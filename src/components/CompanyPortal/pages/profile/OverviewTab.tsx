import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Building2, Loader2 } from "lucide-react";
import { Card, Field, FormGrid, ActionBar, inputCls } from "../../ui";
import { getCompanyContent, saveCompanyContent, uploadCompanyFile } from "../../api";
import type { TabProps } from "./CompanyProfilePage";

const CATEGORIES = ["Drone Service Provider", "Drone Manufacturer / OEM", "Component / Parts Supplier", "Software / Platform", "Training / RPTO", "Consulting", "Agriculture Drone Services", "Survey & Mapping", "Inspection Services", "Defence / Security", "GIS / Remote Sensing", "AI / ML Solutions", "Other"];
const SIZES = ["1-10 employees", "11-50 employees", "51-200 employees", "201-500 employees", "500+ employees"];
const REQUIRED_FIELDS: [string, string][] = [
  ["category", "Company Category"],
  ["email", "Company Email"],
  ["phone", "Phone (WhatsApp)"],
  ["address", "Company Address"],
  ["city", "City"],
  ["state", "State"],
  ["description", "Company Description"],
];

export default function OverviewTab({ publishedId, userId, profile, save }: TabProps) {
  const [form, setForm] = useState(() => ({
    legalEntityName: "", category: "", yearEstablished: "", cin: "", gstin: "",
    email: "", phone: "", website: "", linkedin: "", address: "", city: "", state: "", pincode: "",
    companySize: "", description: "",
    ...(profile.overview || {}),
  }));
  const [saving, setSaving] = useState(false);

  // Real, publicly-shown company logo - lives in the site's own websiteContent
  // blob (what the public profile/card/share-preview all read), not in this
  // tab's own "overview" section (that's a separate blob nothing public
  // renders). Was previously only reachable by clicking through all 5 steps
  // of the Services & Products wizard to its last "Media Uploads" step - real
  // members reported never finding it. Fetched/saved directly here instead so
  // it's visible the moment the profile page opens, no wizard needed.
  const [logoUrl, setLogoUrl] = useState("");
  const [logoLoading, setLogoLoading] = useState(true);
  const [logoUploading, setLogoUploading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getCompanyContent(publishedId)
      .then(data => {
        if (cancelled) return;
        const content = data?.content || {};
        setLogoUrl(content.header?.logoSrc || content.company?.logo || "");
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLogoLoading(false); });
    return () => { cancelled = true; };
  }, [publishedId]);

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setLogoUploading(true);
    try {
      const url = await uploadCompanyFile(userId, "companyLogoUrl", file);
      const data = await getCompanyContent(publishedId);
      const existing = data?.content || {};
      await saveCompanyContent(userId, publishedId, {
        ...existing,
        company: { ...existing.company, logo: url },
        header: { ...existing.header, logoSrc: url, logoUrl: url },
      });
      setLogoUrl(url);
      toast.success("Logo updated - it's now live on your public listing.");
    } catch {
      toast.error("Failed to update logo - please try again.");
    } finally {
      setLogoUploading(false);
    }
  };

  const set = (k: string, v: string) => setForm((f: any) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    const missing = REQUIRED_FIELDS.filter(([key]) => !String(form[key] || "").trim());
    if (missing.length) {
      toast.error(`Please fill required fields: ${missing.map(([, label]) => label).join(", ")}`);
      return;
    }
    setSaving(true);
    await save("overview", form);
    setSaving(false);
  };

  return (
    <>
      <Card className="p-6 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center overflow-hidden flex-shrink-0">
            {logoLoading ? (
              <Loader2 className="w-5 h-5 text-white/30 animate-spin" />
            ) : logoUrl ? (
              <img src={logoUrl} alt="Company logo" className="w-full h-full object-contain" />
            ) : (
              <Building2 className="w-8 h-8 text-white/20" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-white mb-0.5">Company Logo</p>
            <p className="text-xs text-white/40 mb-2.5">Shown on your listing card, public profile, and shared links. PNG/JPG/SVG.</p>
            <label className="inline-flex items-center gap-1.5 rounded-lg bg-brand-yellow px-3 py-1.5 text-xs font-semibold text-ink hover:bg-brand-gold transition-colors cursor-pointer disabled:opacity-50">
              {logoUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
              {logoUploading ? "Uploading..." : logoUrl ? "Change Logo" : "Upload Logo"}
              <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} disabled={logoUploading} />
            </label>
          </div>
        </div>
      </Card>

      <Card className="p-6">
      <FormGrid>
        <Field label="Legal Entity Name"><input className={inputCls} value={form.legalEntityName} onChange={e => set("legalEntityName", e.target.value)} placeholder="Registered name as per MCA/GSTIN" /></Field>
        <Field label="Company Category" required>
          <select className={inputCls} value={form.category} onChange={e => set("category", e.target.value)}>
            <option value="">Select category</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Year of Establishment"><input type="number" className={inputCls} value={form.yearEstablished} onChange={e => set("yearEstablished", e.target.value)} min={1950} max={2026} /></Field>
        <Field label="CIN Number"><input className={inputCls} value={form.cin} onChange={e => set("cin", e.target.value)} placeholder="Company Identification Number" /></Field>
        <Field label="GSTIN"><input className={inputCls} value={form.gstin} onChange={e => set("gstin", e.target.value)} placeholder="GST Identification Number" /></Field>
        <Field label="Company Email" required><input type="email" className={inputCls} value={form.email} onChange={e => set("email", e.target.value)} /></Field>
        <Field label="Phone (WhatsApp)" required><input type="tel" className={inputCls} value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+91 ..." /></Field>
        <Field label="Website"><input type="url" className={inputCls} value={form.website} onChange={e => set("website", e.target.value)} placeholder="https://yourcompany.com" /></Field>
        <Field label="LinkedIn"><input type="url" className={inputCls} value={form.linkedin} onChange={e => set("linkedin", e.target.value)} placeholder="https://linkedin.com/company/..." /></Field>
        <Field label="Company Size">
          <select className={inputCls} value={form.companySize} onChange={e => set("companySize", e.target.value)}>
            <option value="">Select range</option>
            {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Company Address" wide required><textarea className={inputCls} rows={2} value={form.address} onChange={e => set("address", e.target.value)} placeholder="Full registered address" /></Field>
        <Field label="City" required><input className={inputCls} value={form.city} onChange={e => set("city", e.target.value)} /></Field>
        <Field label="State" required><input className={inputCls} value={form.state} onChange={e => set("state", e.target.value)} /></Field>
        <Field label="Pincode"><input className={inputCls} value={form.pincode} onChange={e => set("pincode", e.target.value)} /></Field>
        <Field label="Company Description" wide required>
          <textarea className={inputCls} rows={4} value={form.description} onChange={e => set("description", e.target.value)} placeholder="Describe what your company does..." />
        </Field>
      </FormGrid>
      <ActionBar onSave={handleSave} saveLabel={saving ? "Saving..." : "Save Changes"} />
      </Card>
    </>
  );
}
