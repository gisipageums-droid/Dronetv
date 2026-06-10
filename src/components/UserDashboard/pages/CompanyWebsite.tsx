import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Shield, CheckCircle, AlertCircle, Loader2, ExternalLink,
  RefreshCw, BadgeCheck, Upload, Edit, X, Lock, Globe,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUserAuth } from "../../context/context";
import { toast } from "sonner";
import axios from "axios";
import { AnimatePresence, motion } from "motion/react";
import FormApp from "../../company/src/components/form/src/App";

const SUREPASS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc3NTY0NzYxNywianRpIjoiNTNiZjhhODMtMDZlZS00Y2QyLTgxNDYtZDQ0MjAyN2M1NmE5IiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LmRyb25ldHZAc3VyZXBhc3MuaW8iLCJuYmYiOjE3NzU2NDc2MTcsImV4cCI6MjQwNjM2NzYxNywiZW1haWwiOiJkcm9uZXR2QHN1cmVwYXNzLmlvIiwidGVuYW50X2lkIjoibWFpbiIsInVzZXJfY2xhaW1zIjp7InNjb3BlcyI6WyJ1c2VyIl19fQ.GgTCyK0v20-XH3eq39Y31La05PBX7cBonsq7grngi1M";

type DigiStatus = "idle" | "loading" | "ready" | "polling" | "verified" | "error";

interface Company {
  publishedId: string;
  userId: string;
  draftId: string;
  companyName: string;
  templateSelection: string;
  reviewStatus: string;
  location: string;
}

const CompanyWebsite: React.FC = () => {
  const { user } = useUserAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [companyCategory, setCompanyCategory] = useState<string[]>([]);
  const [isDetailsUpdated, setIsDetailsUpdated] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"preview" | "details">(
    searchParams.get("tab") === "details" ? "details" : "preview"
  );
  const [digiStatus, setDigiStatus] = useState<DigiStatus>("idle");
  const [digiUrl, setDigiUrl] = useState("");
  const [digiClientId, setDigiClientId] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [currentLogo, setCurrentLogo] = useState<string>("");
  const [iframeKey, setIframeKey] = useState(0);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const popupRef = useRef<Window | null>(null);
  const logoInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  const userId = user?.email || user?.userData?.email || "";

  useEffect(() => {
    if (!userId) return;
    fetch(`https://v1lqhhm1ma.execute-api.ap-south-1.amazonaws.com/prod/dashboard-cards?userId=${userId}`)
      .then((r) => r.json())
      .then((data) => {
        const cards: Company[] = data.cards || [];
        if (cards.length > 0) setCompany(cards[0]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    if (!company) return;
    const template = company.templateSelection || "template-1";
    fetch(`https://3l8nvxqw1a.execute-api.ap-south-1.amazonaws.com/prod/api/draft/${company.userId}/${company.draftId}?template=${template}`)
      .then((r) => r.json())
      .then((data) => {
        const cats: string[] = data?.formData?.companyCategory;
        if (Array.isArray(cats) && cats.length > 0) setCompanyCategory(cats);
      })
      .catch(() => {});
  }, [company]);

  useEffect(() => {
    if (!company) return;
    // Fast check: localStorage cache
    const cachedLock = localStorage.getItem(`details_updated_${company.publishedId}`) === "true";
    if (cachedLock) { setIsDetailsUpdated(true); return; }
    // Server-side check: look for _detailsUpdatedAt in published content
    fetch(
      `https://v1lqhhm1ma.execute-api.ap-south-1.amazonaws.com/prod/dashboard-cards/published-details/${company.publishedId}`,
      { headers: { "Content-Type": "application/json", "X-User-Id": company.userId } }
    )
      .then(r => r.json())
      .then(data => {
        if (data?.content?._detailsUpdatedAt) {
          setIsDetailsUpdated(true);
          localStorage.setItem(`details_updated_${company.publishedId}`, "true");
        }
      })
      .catch(() => {});
  }, [company]);

  const handleFormSubmit = useCallback(async (aiGenData: any) => {
    if (!company) return;
    setSubmitting(true);
    try {
      // Fetch existing published content so scraped data is not lost
      let existingContent: any = {};
      try {
        const detailsRes = await fetch(
          `https://v1lqhhm1ma.execute-api.ap-south-1.amazonaws.com/prod/dashboard-cards/published-details/${company.publishedId}`,
          { headers: { "Content-Type": "application/json", "X-User-Id": company.userId } }
        );
        const details = await detailsRes.json();
        existingContent = details?.content || {};
      } catch { /* proceed with empty — will use full generated content */ }

      const newContent = aiGenData.content || {};
      const hasExisting = Object.keys(existingContent).length > 0;

      // Selectively merge: preserve scraped text, update only what the 5 steps provide
      const mergedContent = hasExisting ? {
        ...existingContent,
        // Services from step 3 (Products & Services)
        ...(newContent.services?.services?.length > 0 ? {
          services: { ...existingContent.services, services: newContent.services.services },
        } : {}),
        // Products from step 3
        ...(newContent.products?.products?.length > 0 ? {
          products: { ...existingContent.products, products: newContent.products.products },
        } : {}),
        // Logo from step 5 (Media Uploads)
        ...(newContent.company?.logo ? {
          company: { ...existingContent.company, logo: newContent.company.logo },
          header: {
            ...existingContent.header,
            logoSrc: newContent.company.logo,
            logoUrl: newContent.company.logo,
          },
        } : {}),
        // Hero background image if user uploaded one (skip default unsplash)
        ...(newContent.hero?.mainHeroImage && !newContent.hero.mainHeroImage.includes('unsplash.com') ? {
          hero: {
            ...existingContent.hero,
            mainHeroImage: newContent.hero.mainHeroImage,
            secHeroImage: newContent.hero.mainHeroImage,
          },
        } : {}),
        // About / office image
        ...(newContent.about?.officeImage ? {
          about: { ...existingContent.about, officeImage: newContent.about.officeImage },
        } : {}),
        // Testimonials if user added any
        ...(newContent.testimonials?.testimonials?.length > 0 ? {
          testimonials: { ...existingContent.testimonials, testimonials: newContent.testimonials.testimonials },
        } : {}),
        // Clients if user added any
        ...(newContent.clients?.clients?.length > 0 ? {
          clients: { ...existingContent.clients, clients: newContent.clients.clients },
        } : {}),
      } : newContent;

      const finalContent = {
        ...(hasExisting ? mergedContent : newContent),
        _detailsUpdatedAt: new Date().toISOString(),
      };

      await fetch("https://59rgr29n6b.execute-api.ap-south-1.amazonaws.com/dev/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publishedId: company.publishedId,
          userId: company.userId,
          draftId: company.draftId,
          templateSelection: company.templateSelection,
          content: finalContent,
        }),
      });

      localStorage.setItem(`details_updated_${company.publishedId}`, "true");
      setIsDetailsUpdated(true);
      setIframeKey((k) => k + 1);
      toast.success("Details updated! Redirecting to editor...");
      navigate(
        `/user/companies/edit/1/${company.publishedId}/${company.userId}`,
        { state: { aiGenData: { ...aiGenData, content: finalContent } } }
      );
    } catch {
      toast.error("Failed to update details. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [company, navigate]);

  const isVerified = company?.reviewStatus === "approved";

  const handleLogoUpload = async (file: File) => {
    if (!company) return;
    setLogoUploading(true);
    try {
      // 1. Upload file to S3
      const fd = new FormData();
      fd.append("file", file);
      fd.append("sectionName", "header");
      fd.append("imageField", `logoSrc_${Date.now()}`);
      fd.append("templateSelection", company.templateSelection);

      const uploadRes = await fetch(
        `https://o66ziwsye5.execute-api.ap-south-1.amazonaws.com/prod/upload-image/${userId}/${company.publishedId}`,
        { method: "POST", body: fd }
      );
      if (!uploadRes.ok) throw new Error("Upload failed");
      const { imageUrl } = await uploadRes.json();

      // 2. Fetch current company content
      const detailsRes = await fetch(
        `https://v1lqhhm1ma.execute-api.ap-south-1.amazonaws.com/prod/dashboard-cards/published-details/${company.publishedId}`,
        { headers: { "Content-Type": "application/json", "X-User-Id": company.userId } }
      );
      const details = await detailsRes.json();
      const content = details?.content || {};

      // 3. Merge new logo and PUT update
      const updatedContent = {
        ...content,
        company: { ...content.company, logo: imageUrl },
        header: { ...content.header, logoUrl: imageUrl, logoSrc: imageUrl },
      };
      await fetch("https://59rgr29n6b.execute-api.ap-south-1.amazonaws.com/dev/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publishedId: company.publishedId,
          userId: company.userId,
          draftId: company.draftId,
          templateSelection: company.templateSelection,
          content: updatedContent,
        }),
      });

      setCurrentLogo(imageUrl);
      setIframeKey(k => k + 1);
      toast.success("Logo updated successfully!");
    } catch {
      toast.error("Failed to upload logo. Please try again.");
    } finally {
      setLogoUploading(false);
    }
  };

  const previewUrl = company
    ? `/user/companies/preview/1/${company.publishedId}/${company.userId}`
    : "";

  // ---- Aadhaar flow ----
  const initDigiBoost = async () => {
    setDigiStatus("loading");
    setDigiUrl("");
    setDigiClientId("");
    try {
      const res = await axios.post(
        "https://kyc-api.surepass.app/api/v1/digilocker/initialize",
        { data: { signup_flow: true } },
        { headers: { Authorization: `Bearer ${SUREPASS_TOKEN}`, "Content-Type": "application/json" } }
      );
      if (!res.data?.success || !res.data?.data?.url) throw new Error("Init failed");
      setDigiUrl(res.data.data.url);
      setDigiClientId(res.data.data.client_id);
      setDigiStatus("ready");
    } catch {
      setDigiStatus("error");
    }
  };

  const startPolling = (clientId: string) => {
    if (pollRef.current) clearInterval(pollRef.current);
    let attempts = 0;
    pollRef.current = setInterval(async () => {
      attempts++;
      try {
        const res = await axios.get(
          `https://kyc-api.surepass.app/api/v1/digilocker/download-aadhaar/${clientId}`,
          { headers: { Authorization: `Bearer ${SUREPASS_TOKEN}` } }
        );
        if (res.data?.success) {
          clearInterval(pollRef.current!);
          popupRef.current?.close();
          setDigiStatus("verified");
          toast.success("Aadhaar verified successfully!");
          return;
        }
      } catch { /* keep polling */ }

      if (popupRef.current?.closed) {
        clearInterval(pollRef.current!);
        try {
          const finalRes = await axios.get(
            `https://kyc-api.surepass.app/api/v1/digilocker/download-aadhaar/${clientId}`,
            { headers: { Authorization: `Bearer ${SUREPASS_TOKEN}` } }
          );
          if (finalRes.data?.success) {
            setDigiStatus("verified");
            toast.success("Aadhaar verified successfully!");
          } else {
            setDigiStatus("ready");
          }
        } catch { setDigiStatus("ready"); }
        return;
      }

      if (attempts >= 60) {
        clearInterval(pollRef.current!);
        setDigiStatus("error");
        toast.error("Verification timed out. Please try again.");
      }
    }, 2000);
  };

  const handleOpenDigiLocker = () => {
    if (!digiUrl || !digiClientId) return;
    const popup = window.open(digiUrl, "digilocker-verify", "width=620,height=720,left=300,top=80");
    popupRef.current = popup;
    setDigiStatus("polling");
    startPolling(digiClientId);
  };

  const handleConfirmPublish = async () => {
    if (!company || digiStatus !== "verified") return;
    setIsPublishing(true);
    try {
      await axios.post(
        "https://twd6yfrd25.execute-api.ap-south-1.amazonaws.com/prod/admin/templates/review",
        { publishedId: company.publishedId, action: "approve" },
        { headers: { "Content-Type": "application/json" } }
      );
      toast.success("Your company is now live and verified!");
      setCompany((prev) => prev ? { ...prev, reviewStatus: "approved" } : prev);
      setDigiStatus("idle");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleConfirmEdit = () => {
    if (!company) return;
    setShowEditModal(false);
    navigate(`/user/companies/edit/1/${company.publishedId}/${company.userId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mb-5">
          <Globe className="w-10 h-10 text-amber-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Website Yet</h2>
        <p className="text-gray-500 max-w-sm mb-6">
          You haven't created your company website yet. Register your company to get a public listing page.
        </p>
        <button
          onClick={() => navigate("/form")}
          className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors shadow-md"
        >
          Create Your Website
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col">

      {/* Edit Confirmation Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Edit className="text-amber-600 w-6 h-6" />
                  <h3 className="text-xl font-semibold text-gray-900">Edit Website</h3>
                </div>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                You'll be redirected to the editor where you can update your website content and publish the changes.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-700 font-medium rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmEdit}
                  className="px-4 py-2 text-white font-medium rounded-lg bg-amber-600 hover:bg-amber-700 transition-colors shadow-md"
                >
                  Edit Website
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">{company.companyName}</h1>
            {isVerified && <BadgeCheck className="w-6 h-6 text-green-600" title="Verified" />}
          </div>
          <p className="text-sm text-gray-500 mt-0.5">{company.location}</p>
        </div>
        <button
          onClick={() => setShowEditModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors shadow-sm"
        >
          <Edit className="w-4 h-4" />
          Edit Website
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 px-6 bg-white">
        <button
          onClick={() => setActiveTab("preview")}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "preview"
              ? "border-amber-500 text-amber-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Website Preview
        </button>
        <button
          onClick={() => setActiveTab("details")}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "details"
              ? "border-amber-500 text-amber-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Update Details
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "preview" ? (
        <div className="flex flex-col gap-5 p-6">
          {/* Status Banner */}
          {isVerified ? (
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-green-800">Your company is live and verified</p>
                <p className="text-sm text-green-600">It's publicly listed with a verified badge in the Companies directory.</p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-300 rounded-xl">
              <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-yellow-800">Your company is listed but not yet verified</p>
                <p className="text-sm text-yellow-700 mt-0.5">
                  Complete Aadhaar verification below to get a Verified badge and confirm your listing.
                </p>
              </div>
            </div>
          )}

          {/* Logo Upload */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center gap-5">
            <div className="w-16 h-16 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0">
              {currentLogo ? (
                <img src={currentLogo} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <span className="text-xs text-gray-400 text-center px-1">No Logo</span>
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">Company Logo</p>
              <p className="text-xs text-gray-400 mt-0.5">Shown in your website header. PNG, JPG, or SVG.</p>
            </div>
            <button
              onClick={() => logoInputRef.current?.click()}
              disabled={logoUploading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {logoUploading ? (
                <><Loader2 className="w-4 h-4 animate-spin" />Uploading...</>
              ) : (
                <><Upload className="w-4 h-4" />{currentLogo ? "Change Logo" : "Upload Logo"}</>
              )}
            </button>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleLogoUpload(file);
                e.target.value = "";
              }}
            />
          </div>

          {/* Website Preview */}
          <div className="rounded-xl overflow-hidden border border-yellow-200 shadow-lg bg-white">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <span className="text-xs text-gray-500 font-medium">Website Preview</span>
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium"
              >
                <ExternalLink className="w-3 h-3" />
                Full Screen
              </a>
            </div>
            <div className="relative">
              <iframe
                key={iframeKey}
                src={previewUrl}
                title="Company Website Preview"
                className="w-full border-0"
                style={{ height: "560px", pointerEvents: "none" }}
              />
              {/* Transparent overlay blocks all clicks inside the iframe */}
              <div className="absolute inset-0" style={{ pointerEvents: "auto", background: "transparent" }} />
            </div>
          </div>

          {/* Aadhaar Verification */}
          {!isVerified && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-600" />
                Aadhaar Verification
              </h3>
              <p className="text-sm text-gray-500 mb-5">
                Verify your identity via DigiLocker to publish your company as a verified listing.
              </p>

              {digiStatus === "idle" && (
                <button
                  onClick={initDigiBoost}
                  className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Start Aadhaar Verification
                </button>
              )}

              {digiStatus === "loading" && (
                <div className="flex items-center gap-2 text-indigo-600 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Initializing secure verification...
                </div>
              )}

              {digiStatus === "error" && (
                <div>
                  <p className="text-sm text-red-600 mb-2">Initialization failed. Please retry.</p>
                  <button
                    onClick={initDigiBoost}
                    className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    <RefreshCw className="w-4 h-4" /> Retry
                  </button>
                </div>
              )}

              {digiStatus === "ready" && (
                <div>
                  <p className="text-sm text-gray-500 mb-3">
                    Click below to open DigiLocker in a new window and complete verification.
                  </p>
                  <button
                    onClick={handleOpenDigiLocker}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Verify via DigiLocker
                  </button>
                </div>
              )}

              {digiStatus === "polling" && (
                <div className="flex items-center gap-3 text-indigo-600 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Waiting for DigiLocker verification...
                  <button
                    onClick={() => { if (pollRef.current) clearInterval(pollRef.current); setDigiStatus("ready"); }}
                    className="text-xs text-gray-500 hover:text-gray-700 underline ml-2"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {digiStatus === "verified" && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-700">Aadhaar Verified Successfully</span>
                  </div>
                  <button
                    onClick={handleConfirmPublish}
                    disabled={isPublishing}
                    className={`flex items-center gap-2 px-5 py-2.5 font-semibold rounded-lg transition-colors shadow-md w-fit ${
                      isPublishing
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                    }`}
                  >
                    {isPublishing ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Publishing...</>
                    ) : (
                      <><CheckCircle className="w-4 h-4" /> Confirm & Publish</>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1">
          {isDetailsUpdated ? (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Lock className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Details Already Updated</h3>
              <p className="text-gray-500 max-w-sm">
                You have already submitted your company details. Updates are a one-time action. Contact support if you need further changes.
              </p>
              <button
                onClick={() => setActiveTab("preview")}
                className="mt-6 px-5 py-2.5 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors"
              >
                View Website Preview
              </button>
            </div>
          ) : submitting ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
              <p className="text-gray-600 font-medium">Saving your details...</p>
            </div>
          ) : (
            <FormApp
              embedded={true}
              initialCompanyCategory={companyCategory}
              companyData={{
                publishedId: company.publishedId,
                userId: company.userId,
                draftId: company.draftId,
                templateSelection: company.templateSelection,
              }}
              onEmbeddedSubmit={handleFormSubmit}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default CompanyWebsite;
