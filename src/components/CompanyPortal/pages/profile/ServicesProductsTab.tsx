import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { authHeaders, COMPANY_API, LAMBDA } from "../../api";
import FormApp from "../../../company/src/components/form/src/App";
import type { TabProps } from "./CompanyProfilePage";

const UPDATE_API = COMPANY_API ? `${COMPANY_API}/draft/update` : `${LAMBDA.companyDraft2}/update`;
const DETAILS_API = COMPANY_API
  ? `${COMPANY_API}/dashboard-cards/published-details`
  : `${LAMBDA.company}/dashboard-cards/published-details`;

// This tab is the exact same 5-step wizard admins use to edit a company
// (Sectors Served -> Business Categories -> Products & Services ->
// Promotion & Billing -> Media Uploads). Same `FormApp` component as
// `Admin/userAdmin/AdminCompanyEdit`, embedded here for the company owner
// to edit their own listing.
export default function ServicesProductsTab({ publishedId, userId, draftId, templateSelection }: TabProps) {
  const [companyCategory, setCompanyCategory] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!draftId || !userId) { setReady(true); return; }
    const template = templateSelection || "template-1";
    const url = COMPANY_API
      ? `${COMPANY_API}/draft/${userId}/${draftId}?template=${template}`
      : `${LAMBDA.companyDraft}/api/draft/${userId}/${draftId}?template=${template}`;
    fetch(url)
      .then(r => r.json())
      .then(data => {
        const cats: string[] = data?.formData?.companyCategory;
        if (Array.isArray(cats) && cats.length > 0) setCompanyCategory(cats);
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, [draftId, userId, templateSelection]);

  const handleFormSubmit = useCallback(async (aiGenData: any) => {
    setSubmitting(true);
    try {
      let existingContent: any = {};
      try {
        const res = await fetch(`${DETAILS_API}/${publishedId}`, {
          headers: { "Content-Type": "application/json", "X-User-Id": userId, ...authHeaders() },
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
          publishedId,
          userId,
          draftId,
          templateSelection,
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
  }, [publishedId, userId, draftId, templateSelection]);

  if (!ready) return <div className="py-16 text-center text-sm text-white/40">Loading...</div>;

  return (
    <div>
      {submitting && (
        <div className="mb-3 flex items-center gap-2 text-sm text-brand-gold">
          <Loader2 className="w-4 h-4 animate-spin" /> Saving...
        </div>
      )}
      <style>{WIZARD_DARK_CSS}</style>
      <div className="sp-wizard-dark -mx-4 sm:-mx-6 rounded-lg overflow-hidden bg-ink border border-white/10">
        <FormApp
          embedded={true}
          initialCompanyCategory={companyCategory}
          companyData={{ publishedId, userId, draftId, templateSelection }}
          onEmbeddedSubmit={handleFormSubmit}
        />
      </div>
    </div>
  );
}

// The embedded wizard (FormApp) is the same component the public registration
// form and the admin editor use, styled light/yellow. This scoped override maps
// its design tokens onto the dark Company Portal theme without touching the
// shared component. Scoped strictly under .sp-wizard-dark so registration and
// admin edit are unaffected.
const WIZARD_DARK_CSS = `
.sp-wizard-dark { color: #fff; }
.sp-wizard-dark .bg-gradient-to-br { background-image: none !important; background-color: transparent !important; }
.sp-wizard-dark .bg-brand-yellow-soft { background-color: rgba(255,255,255,0.05) !important; }
.sp-wizard-dark .bg-surface-main { background-color: rgba(255,255,255,0.04) !important; }
.sp-wizard-dark .bg-surface-card,
.sp-wizard-dark .bg-white { background-color: rgba(255,255,255,0.03) !important; }
.sp-wizard-dark .bg-ink-offwhite { background-color: rgba(255,255,255,0.05) !important; }
.sp-wizard-dark .bg-ink-light { background-color: rgba(255,255,255,0.1) !important; }
.sp-wizard-dark .shadow-sm,
.sp-wizard-dark .shadow-md { box-shadow: none !important; }
.sp-wizard-dark .text-ink,
.sp-wizard-dark .text-ink-charcoal { color: #ffffff !important; }
.sp-wizard-dark .text-ink-paragraph { color: rgba(255,255,255,0.72) !important; }
.sp-wizard-dark .text-ink-caption,
.sp-wizard-dark .text-ink-light { color: rgba(255,255,255,0.4) !important; }
.sp-wizard-dark .text-brand-gold { color: #F8C400 !important; }
.sp-wizard-dark .border-ink-light,
.sp-wizard-dark .border-brand-yellow-soft,
.sp-wizard-dark .border-ink-caption { border-color: rgba(255,255,255,0.12) !important; }
.sp-wizard-dark input:not([type=checkbox]):not([type=radio]):not([type=file]),
.sp-wizard-dark textarea,
.sp-wizard-dark select {
  background-color: rgba(255,255,255,0.05) !important;
  color: #fff !important;
  border-color: rgba(255,255,255,0.15) !important;
}
.sp-wizard-dark select option { background-color: #1b1b1b !important; color: #fff !important; }
.sp-wizard-dark ::placeholder { color: rgba(255,255,255,0.3) !important; }
`;
