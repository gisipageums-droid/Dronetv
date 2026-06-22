import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import FormApp from "../../company/src/components/form/src/App";

const CARDS_API = "https://v1lqhhm1ma.execute-api.ap-south-1.amazonaws.com/prod/dashboard-cards";
const UPDATE_API = "https://59rgr29n6b.execute-api.ap-south-1.amazonaws.com/dev/update";
const DETAILS_API = "https://v1lqhhm1ma.execute-api.ap-south-1.amazonaws.com/prod/dashboard-cards/published-details";

interface Company {
  publishedId: string;
  userId: string;
  draftId: string;
  companyName: string;
  templateSelection: string;
  location: string;
  reviewStatus: string;
}

const AdminCompanyEdit: React.FC = () => {
  const { publishedId, userId } = useParams<{ publishedId: string; userId: string }>();
  const navigate = useNavigate();

  const [company, setCompany] = useState<Company | null>(null);
  const [companyCategory, setCompanyCategory] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!userId) return;
    fetch(`${CARDS_API}?userId=${userId}`)
      .then(r => r.json())
      .then(data => {
        const cards: Company[] = data.cards || [];
        const found = publishedId
          ? cards.find(c => c.publishedId === publishedId) ?? cards[0]
          : cards[0];
        if (found) setCompany(found);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId, publishedId]);

  useEffect(() => {
    if (!company) return;
    const template = company.templateSelection || "template-1";
    fetch(`https://3l8nvxqw1a.execute-api.ap-south-1.amazonaws.com/prod/api/draft/${company.userId}/${company.draftId}?template=${template}`)
      .then(r => r.json())
      .then(data => {
        const cats: string[] = data?.formData?.companyCategory;
        if (Array.isArray(cats) && cats.length > 0) setCompanyCategory(cats);
      })
      .catch(() => {});
  }, [company]);

  const handleFormSubmit = useCallback(async (aiGenData: any) => {
    if (!company) return;
    setSubmitting(true);
    try {
      let existingContent: any = {};
      try {
        const detailsRes = await fetch(`${DETAILS_API}/${company.publishedId}`, {
          headers: { "Content-Type": "application/json", "X-User-Id": company.userId },
        });
        const details = await detailsRes.json();
        existingContent = details?.content || {};
      } catch { /* proceed with empty */ }

      const newContent = aiGenData.content || {};
      const hasExisting = Object.keys(existingContent).length > 0;

      const mergedContent = hasExisting ? {
        ...existingContent,
        ...(newContent.services?.services?.length > 0 ? {
          services: { ...existingContent.services, services: newContent.services.services },
        } : {}),
        ...(newContent.products?.products?.length > 0 ? {
          products: { ...existingContent.products, products: newContent.products.products },
        } : {}),
        ...(newContent.company?.logo ? {
          company: { ...existingContent.company, logo: newContent.company.logo },
          header: { ...existingContent.header, logoSrc: newContent.company.logo, logoUrl: newContent.company.logo },
        } : {}),
        ...(newContent.hero?.mainHeroImage && !newContent.hero.mainHeroImage.includes("unsplash.com") ? {
          hero: { ...existingContent.hero, mainHeroImage: newContent.hero.mainHeroImage, secHeroImage: newContent.hero.mainHeroImage },
        } : {}),
        ...(newContent.about?.officeImage ? {
          about: { ...existingContent.about, officeImage: newContent.about.officeImage },
        } : {}),
        ...(newContent.testimonials?.testimonials?.length > 0 ? {
          testimonials: { ...existingContent.testimonials, testimonials: newContent.testimonials.testimonials },
        } : {}),
        ...(newContent.clients?.clients?.length > 0 ? {
          clients: { ...existingContent.clients, clients: newContent.clients.clients },
        } : {}),
      } : newContent;

      await fetch(UPDATE_API, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publishedId: company.publishedId,
          userId: company.userId,
          draftId: company.draftId,
          templateSelection: company.templateSelection,
          content: { ...(hasExisting ? mergedContent : newContent), _detailsUpdatedAt: new Date().toISOString() },
        }),
      });

      toast.success("Company details updated successfully!");
      setDone(true);
    } catch {
      toast.error("Failed to update company details. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [company]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 text-center">
        <p className="text-gray-500 text-lg">Company not found for this user.</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-sm text-yellow-600 underline">Go back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/users")}
          className="flex items-center gap-2 text-gray-300 hover:text-white text-sm transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Users
        </button>
        <div className="h-4 w-px bg-gray-600" />
        <div>
          <h1 className="text-white font-bold text-base">{company.companyName}</h1>
          <p className="text-gray-400 text-xs">{company.userId} · Edit Company Details</p>
        </div>
      </div>

      {/* Admin notice */}
      <div className="mx-6 mt-4 px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-800 font-medium">
        Admin editing mode — changes save directly to this company. Publish is controlled by the user.
      </div>

      {/* Form */}
      <div className="flex-1">
        {done ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <span className="text-3xl">✓</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Details Updated</h3>
            <p className="text-gray-500 max-w-sm mb-6">Company details have been saved successfully.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDone(false)}
                className="px-5 py-2.5 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors"
              >
                Edit Again
              </button>
              <button
                onClick={() => navigate("/admin/users")}
                className="px-5 py-2.5 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              >
                Back to Users
              </button>
            </div>
          </div>
        ) : submitting ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
            <p className="text-gray-600 font-medium">Saving company details...</p>
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
    </div>
  );
};

export default AdminCompanyEdit;
