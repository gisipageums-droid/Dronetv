import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { useUserAuth } from "../../../context/context";
import { getMyCompany, authHeaders, COMPANY_API, LAMBDA } from "../../api";
import { PageHeader, EmptyState } from "../../ui";
import FormApp from "../../../company/src/components/form/src/App";

const UPDATE_API = COMPANY_API ? `${COMPANY_API}/draft/update` : `${LAMBDA.companyDraft2}/update`;
const DETAILS_API = COMPANY_API
  ? `${COMPANY_API}/dashboard-cards/published-details`
  : `${LAMBDA.company}/dashboard-cards/published-details`;

interface Company {
  publishedId: string;
  userId: string;
  draftId: string;
  companyName: string;
  templateSelection: string;
}

// The Company Profile editor is the exact same 5-step wizard admins use to edit
// a company (Sectors Served -> Business Categories -> Products & Services ->
// Promotion & Billing -> Media Uploads), embedded here for the company owner to
// edit their own listing. Same `FormApp` component as
// `Admin/userAdmin/AdminCompanyEdit`, wired to the portal user's own company.
export default function CompanyProfilePage() {
  const { user } = useUserAuth();
  const userId = (user as any)?.userData?.email || (user as any)?.email || "";

  const [company, setCompany] = useState<Company | null>(null);
  const [companyCategory, setCompanyCategory] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    (async () => {
      try {
        const found = await getMyCompany(userId);
        if (!found?.publishedId) {
          setError("No published company found for this account yet.");
          return;
        }
        setCompany(found);
      } catch {
        setError("Failed to load company profile.");
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  useEffect(() => {
    if (!company?.draftId || !company?.userId) return;
    const template = company.templateSelection || "template-1";
    const url = COMPANY_API
      ? `${COMPANY_API}/draft/${company.userId}/${company.draftId}?template=${template}`
      : `${LAMBDA.companyDraft}/api/draft/${company.userId}/${company.draftId}?template=${template}`;
    fetch(url)
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
        const res = await fetch(`${DETAILS_API}/${company.publishedId}`, {
          headers: { "Content-Type": "application/json", "X-User-Id": company.userId, ...authHeaders() },
        });
        const details = await res.json();
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

      const res = await fetch(UPDATE_API, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({
          publishedId: company.publishedId,
          userId: company.userId,
          draftId: company.draftId,
          templateSelection: company.templateSelection,
          content: { ...(hasExisting ? mergedContent : newContent), _detailsUpdatedAt: new Date().toISOString() },
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to save - please try again");
    } finally {
      setSubmitting(false);
    }
  }, [company]);

  if (loading) return <div className="py-16 text-center text-sm text-white/40">Loading profile...</div>;
  if (error || !company) return <EmptyState text={error || "No company found"} />;

  return (
    <div>
      <PageHeader
        title="Company Profile"
        sub={`Edit ${company.companyName || "your company"}'s listing — the details buyers see on DroneTv.in`}
      />

      {submitting && (
        <div className="mb-4 flex items-center gap-2 text-sm text-brand-gold">
          <Loader2 className="w-4 h-4 animate-spin" /> Saving...
        </div>
      )}

      <div className="-mx-4 sm:-mx-6 rounded-lg overflow-hidden">
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
}

// Retained for the (now unrouted) per-section tab components that still import it.
export interface TabProps {
  publishedId: string;
  userId: string;
  profile: Record<string, any>;
  save: (section: string, data: any) => Promise<void>;
}
