import { useState } from "react";
import { Card, Field, FormGrid, Btn, EmptyState, Badge, inputCls } from "../../ui";
import type { TabProps } from "./CompanyProfilePage";

const TYPES = ["UAOP (Unmanned Aircraft Operator Permit)", "DGCA Approval", "ISO 9001", "ISO 27001", "NSDC Certified", "DGFT Import License", "WPC License", "Drone Insurance (Company)", "MSME / Udyam Registration", "Other"];
const empty = { type: "", number: "", authority: "", issueDate: "", expiryDate: "", status: "Active" };

export default function CertificationsTab({ profile, save }: TabProps) {
  const [certs, setCerts] = useState<any[]>(profile.certifications || []);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const persist = async (next: any[]) => {
    setCerts(next);
    setSaving(true);
    await save("certifications", next);
    setSaving(false);
  };

  const addCert = () => {
    if (!form.type) return;
    persist([...certs, form]);
    setForm(empty);
    setShowForm(false);
  };

  const removeCert = (i: number) => persist(certs.filter((_, idx) => idx !== i));

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="text-sm text-ink-caption flex-1">Company DGCA permits, ISO certifications, and industry approvals</div>
        <Btn onClick={() => setShowForm(!showForm)}>+ Add Certification</Btn>
      </div>

      {showForm && (
        <Card className="p-6 mb-5">
          <FormGrid>
            <Field label="Certification Type" required>
              <select className={inputCls} value={form.type} onChange={e => set("type", e.target.value)}>
                <option value="">Select type</option>
                {TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Certificate Number"><input className={inputCls} value={form.number} onChange={e => set("number", e.target.value)} /></Field>
            <Field label="Issuing Authority"><input className={inputCls} value={form.authority} onChange={e => set("authority", e.target.value)} placeholder="e.g. DGCA, BIS" /></Field>
            <Field label="Status">
              <select className={inputCls} value={form.status} onChange={e => set("status", e.target.value)}>
                <option>Active</option><option>Expired</option><option>Renewal Pending</option>
              </select>
            </Field>
            <Field label="Issue Date"><input type="date" className={inputCls} value={form.issueDate} onChange={e => set("issueDate", e.target.value)} /></Field>
            <Field label="Expiry Date"><input type="date" className={inputCls} value={form.expiryDate} onChange={e => set("expiryDate", e.target.value)} /></Field>
          </FormGrid>
          <div className="flex gap-3 mt-4">
            <Btn onClick={addCert}>Save</Btn>
            <Btn variant="outline" onClick={() => setShowForm(false)}>Cancel</Btn>
          </div>
        </Card>
      )}

      {certs.length === 0 ? <EmptyState text="No certifications added yet" /> : (
        <div className="space-y-2.5">
          {certs.map((c, i) => (
            <Card key={i} className="p-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-ink">{c.type}</div>
                <div className="text-xs text-ink-caption mt-0.5">{c.authority} {c.number && `· ${c.number}`} {c.expiryDate && `· Expires: ${c.expiryDate}`}</div>
              </div>
              <div className="flex items-center gap-3">
                <Badge tone={c.status === "Active" ? "success" : c.status === "Expired" ? "error" : "warning"}>{c.status}</Badge>
                <button onClick={() => removeCert(i)} className="text-status-error text-xs font-semibold">Remove</button>
              </div>
            </Card>
          ))}
        </div>
      )}
      {saving && <div className="text-xs text-ink-caption mt-3">Saving...</div>}
    </div>
  );
}
