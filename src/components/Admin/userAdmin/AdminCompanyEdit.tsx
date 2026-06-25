import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, CheckCircle, Building2 } from "lucide-react";
import { toast } from "react-toastify";
import FormApp from "../../company/src/components/form/src/App";
import { COMPANY_API, LAMBDA } from '../../../lib/apiConfig';

const CARDS_API = COMPANY_API ? `${COMPANY_API}/dashboard-cards` : `${LAMBDA.company}/dashboard-cards`;
const UPDATE_API = COMPANY_API ? `${COMPANY_API}/draft/update` : `${LAMBDA.companyDraft2}/update`;
const DETAILS_API = COMPANY_API ? `${COMPANY_API}/dashboard-cards/published-details` : `${LAMBDA.company}/dashboard-cards/published-details`;

interface Company {
  publishedId: string;
  userId: string;
  draftId: string;
  companyName: string;
  templateSelection: string;
  location: string;
  reviewStatus: string;
}

function AdminHeader({ title, subtitle, onBack }: { title: string; subtitle?: string; onBack: () => void }) {
  return (
    <div className="bg-gray-900 px-4 sm:px-6 py-4 flex items-center gap-3 flex-shrink-0">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition-colors flex-shrink-0"
      >
        <ArrowLeft size={15} />
        <span className="hidden sm:inline">Back to Users</span>
        <span className="sm:hidden">Back</span>
      </button>
      <div className="h-4 w-px bg-gray-700 flex-shrink-0" />
      <div className="min-w-0 flex items-center gap-2">
        <Building2 size={16} className="text-yellow-400 flex-shrink-0" />
        <div className="min-w-0">
          <p className="text-white font-semibold text-sm truncate">{title}</p>
          {subtitle && <p className="text-gray-500 text-xs truncate">{subtitle}</p>}
        </div>
      </div>
      <div className="ml-auto flex-shrink-0">
        <span className="px-2.5 py-1 rounded-full bg-yellow-400/10 text-yellow-400 text-xs font-semibold border border-yellow-400/20">
          Admin Edit
        </span>
      </div>
    </div>
  );
}

const AdminCompanyEdit: React.FC = () => {
  const { publishedId, userId } = useParams<{ publishedId: string; userId: string }>();
  const navigate = useNavigate();

  const [company, setCompany] = useState<Company | null>(null);
  const [companyCategory, setCompanyCategory] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const goBack = () => navigate("/admin/users");

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
    fetch(COMPANY_API ? `${COMPANY_API}/draft/${company.userId}/${company.draftId}?template=${template}` : `${LAMBDA.companyDraft}/api/draft/${company.userId}/${company.draftId}?template=${template}`)
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
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <AdminHeader title="Loading..." onBack={goBack} />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
            <p className="text-gray-500 text-sm">Loading company data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <AdminHeader title="Company Not Found" subtitle={userId} onBack={goBack} />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center max-w-sm w-full">
            <div className="w-14 h-14 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center mx-auto mb-4">
              <Building2 size={24} className="text-gray-400" />
            </div>
            <h3 className="text-gray-900 font-bold text-base mb-1">No Company Found</h3>
            <p className="text-gray-500 text-sm mb-5">
              This user hasn't registered a company yet, or the company ID doesn't match.
            </p>
            <button
              onClick={goBack}
              className="w-full px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-semibold text-sm rounded-xl transition-colors"
            >
              Back to Users
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <AdminHeader title={company.companyName} subtitle={company.userId} onBack={goBack} />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center max-w-sm w-full">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={24} className="text-green-600" />
            </div>
            <h3 className="text-gray-900 font-bold text-base mb-1">Details Saved</h3>
            <p className="text-gray-500 text-sm mb-5">
              Company details updated. The user will see these when they log in.
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setDone(false)}
                className="w-full px-4 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold text-sm rounded-xl transition-colors"
              >
                Edit Again
              </button>
              <button
                onClick={goBack}
                className="w-full px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-sm rounded-xl border border-gray-200 transition-colors"
              >
                Back to Users
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (submitting) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <AdminHeader title={company.companyName} subtitle={company.userId} onBack={goBack} />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
            <p className="text-gray-500 text-sm">Saving company details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <AdminHeader title={company.companyName} subtitle={`${company.userId} · ${company.location || "—"}`} onBack={goBack} />

      <div className="mx-4 sm:mx-6 mt-4 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2">
        <span className="text-amber-500 mt-0.5 flex-shrink-0">⚠</span>
        <p className="text-amber-800 text-sm font-medium">
          Admin editing mode — fill in the company details below. The user will see these when they log in and can then publish their listing.
        </p>
      </div>

      <div className="flex-1 mt-2">
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
      </div>
    </div>
  );
};

export default AdminCompanyEdit;
