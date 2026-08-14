import { useState } from "react";
import { Card, Field, FormGrid, ActionBar, inputCls } from "../../ui";
import type { TabProps } from "./CompanyProfilePage";

const CATEGORIES = ["Drone Service Provider", "Drone Manufacturer / OEM", "Component / Parts Supplier", "Software / Platform", "Training / RPTO", "Consulting", "Agriculture Drone Services", "Survey & Mapping", "Inspection Services", "Defence / Security", "GIS / Remote Sensing", "AI / ML Solutions", "Other"];
const SIZES = ["1-10 employees", "11-50 employees", "51-200 employees", "201-500 employees", "500+ employees"];

export default function OverviewTab({ profile, save }: TabProps) {
  const [form, setForm] = useState(() => ({
    legalEntityName: "", category: "", yearEstablished: "", cin: "", gstin: "",
    email: "", phone: "", website: "", linkedin: "", address: "", city: "", state: "", pincode: "",
    companySize: "", description: "",
    ...(profile.overview || {}),
  }));
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string) => setForm((f: any) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    await save("overview", form);
    setSaving(false);
  };

  return (
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
  );
}
