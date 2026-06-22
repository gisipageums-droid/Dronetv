import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  CheckCircle, AlertCircle, Loader2, ExternalLink,
  BadgeCheck, Upload, Edit, X, Globe,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUserAuth } from "../../context/context";
import { toast } from "sonner";
import { AnimatePresence, motion } from "motion/react";
import FormApp from "../../company/src/components/form/src/App";

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
  const [submitting, setSubmitting] = useState(false);
  const [showPublish, setShowPublish] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [activeTab, setActiveTab] = useState<"preview" | "details">(
    searchParams.get("tab") === "details" ? "details" : "preview"
  );
  const [showEditModal, setShowEditModal] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [currentLogo, setCurrentLogo] = useState<string>("");
  const [iframeKey, setIframeKey] = useState(0);
  const logoInputRef = useRef<HTMLInputElement | null>(null);

  const userId = user?.email || user?.userData?.email || "";

  useEffect(() => {
    if (!userId) return;
    const CARDS_API = "https://v1lqhhm1ma.execute-api.ap-south-1.amazonaws.com/prod/dashboard-cards";
    const savedUserId = localStorage.getItem("dronetv_company_userId") || "";
    const idsToTry = [userId, savedUserId].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i);

    const tryNext = (idx: number) => {
      if (idx >= idsToTry.length) { setLoading(false); return; }
      fetch(`${CARDS_API}?userId=${idsToTry[idx]}`)
        .then((r) => r.json())
        .then((data) => {
          const cards: Company[] = data.cards || [];
          if (cards.length > 0) { setCompany(cards[0]); setLoading(false); }
          else tryNext(idx + 1);
        })
        .catch(() => tryNext(idx + 1));
    };
    tryNext(0);
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

      setIframeKey((k) => k + 1);
      toast.success("Details saved! You can now publish your company.");
      setShowPublish(true);
    } catch {
      toast.error("Failed to update details. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [company]);

  const isVerified = company?.reviewStatus === "approved";

  const handlePublish = async () => {
    if (!company) return;
    setPublishing(true);
    try {
      await fetch("https://twd6yfrd25.execute-api.ap-south-1.amazonaws.com/prod/admin/templates/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publishedId: company.publishedId, action: "approve" }),
      });
      toast.success("Your company is now live!");
      setCompany(prev => prev ? { ...prev, reviewStatus: "approved" } : prev);
      setShowPublish(false);
      setActiveTab("preview");
    } catch {
      toast.error("Failed to publish. Please try again.");
    } finally {
      setPublishing(false);
    }
  };

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

  const handleConfirmEdit = () => {
    if (!company) return;
    setShowEditModal(false);
    navigate(`/user/companies/edit/1/${company.publishedId}/${company.userId}`);
  };

  if (loading) {
    return (
      <div className="h-full bg-amber-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="h-full bg-amber-50 flex flex-col items-center justify-center px-4 text-center pb-20 lg:pb-0">
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
    <div className="h-full bg-amber-50 flex flex-col overflow-y-auto">

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
                <p className="font-semibold text-yellow-800">Verification pending</p>
                <p className="text-sm text-yellow-700 mt-0.5">
                  Your company is listed. Our team will review and verify your listing shortly.
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

        </div>
      ) : (
        <div className="flex-1">
          {submitting ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
              <p className="text-gray-600 font-medium">Saving your details...</p>
            </div>
          ) : showPublish ? (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
              {isVerified ? (
                <>
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-5">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Details Updated!</h3>
                  <p className="text-gray-500 max-w-sm mb-8">
                    Your company is already live. The updated details are now saved to your listing.
                  </p>
                  <button
                    onClick={() => { setShowPublish(false); setActiveTab("preview"); }}
                    className="flex items-center gap-2 px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-base rounded-xl transition-colors shadow-md"
                  >
                    <Globe className="w-5 h-5" /> View My Website
                  </button>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-5">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Details Saved!</h3>
                  <p className="text-gray-500 max-w-sm mb-8">
                    Your company details are ready. Publish now to make your company live and visible to everyone.
                  </p>
                  <button
                    onClick={handlePublish}
                    disabled={publishing}
                    className="flex items-center gap-2 px-8 py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold text-base rounded-xl transition-colors shadow-lg disabled:opacity-60"
                  >
                    {publishing
                      ? <><Loader2 className="w-5 h-5 animate-spin" /> Publishing...</>
                      : <><Globe className="w-5 h-5" /> Publish My Company</>
                    }
                  </button>
                  <button
                    onClick={() => setShowPublish(false)}
                    className="mt-4 text-sm text-gray-400 hover:text-gray-600 underline"
                  >
                    Go back and review
                  </button>
                </>
              )}
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
