import React, { useState, useEffect, useRef } from "react";
import {
  Shield, CheckCircle, AlertCircle, Loader2, ExternalLink,
  RefreshCw, Globe, Plus, BadgeCheck, Upload,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../../context/context";
import { toast } from "sonner";
import axios from "axios";

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

  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [digiStatus, setDigiStatus] = useState<DigiStatus>("idle");
  const [digiUrl, setDigiUrl] = useState("");
  const [digiClientId, setDigiClientId] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [currentLogo, setCurrentLogo] = useState<string>("");
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
        { headers: { "Content-Type": "application/json", "X-User-Id": userId } }
      );
      const details = await detailsRes.json();
      const content = details?.content || {};

      // 3. Merge new logo and PUT update
      const updatedContent = {
        ...content,
        company: { ...content.company, logo: imageUrl },
        header: { ...content.header, logoUrl: imageUrl },
      };
      await fetch("https://59rgr29n6b.execute-api.ap-south-1.amazonaws.com/dev/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publishedId: company.publishedId,
          userId,
          draftId: company.draftId,
          templateSelection: company.templateSelection,
          content: updatedContent,
        }),
      });

      setCurrentLogo(imageUrl);
      toast.success("Logo updated successfully!");
    } catch {
      toast.error("Failed to upload logo. Please try again.");
    } finally {
      setLogoUploading(false);
    }
  };

  const previewUrl = company
    ? company.templateSelection === "template-1"
      ? `/user/companies/preview/1/${company.publishedId}/${userId}`
      : `/user/companies/preview/2/${company.publishedId}/${userId}`
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

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center gap-4 p-8">
        <Globe className="w-16 h-16 text-yellow-400" />
        <h2 className="text-2xl font-bold text-gray-800">No website yet</h2>
        <p className="text-gray-500 text-center max-w-sm">
          You haven't created a company listing yet. Fill out the form to get started.
        </p>
        <button
          onClick={() => navigate("/form")}
          className="flex items-center gap-2 px-6 py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Your Company
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 p-6 flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">{company.companyName}</h1>
            {isVerified && <BadgeCheck className="w-6 h-6 text-green-600" title="Verified" />}
          </div>
          <p className="text-sm text-gray-500 mt-0.5">{company.location}</p>
        </div>
      </div>

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
        <iframe
          src={previewUrl}
          title="Company Website Preview"
          className="w-full border-0"
          style={{ height: "520px", pointerEvents: "auto" }}
        />
      </div>

      {/* Aadhaar Verification Section — only shown if not verified */}
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
  );
};

export default CompanyWebsite;
