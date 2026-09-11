import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ShieldCheck, RotateCcw, XCircle, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { COMPANY_API } from "../../../lib/apiConfig";
import { authHeader } from "../../../lib/authService";
import { useUserAuth } from "../../context/context";

const API = `${COMPANY_API}/admin/prelisted-companies`;

interface ChecklistItem {
  key: string;
  label: string;
  mandatory: boolean;
  present: boolean;
  checked: boolean;
}

interface Detail {
  publishedId: string;
  companyName: string;
  location: string | null;
  sectors: string[];
  websiteContent: any;
  workflowStatus: string;
  badgeStatus: string;
  verificationConfirmed: boolean;
  verificationNotes: string | null;
  verifiedBy: string | null;
  verifiedAt: string | null;
  checklist: ChecklistItem[];
  mandatoryFailures: string[];
}

const STATUS_STYLE: Record<string, string> = {
  PRE_LISTED: "bg-gray-100 text-gray-700",
  IN_REVIEW: "bg-amber-100 text-amber-800",
  READY_TO_SUBMIT: "bg-blue-100 text-blue-800",
  VERIFIED: "bg-emerald-100 text-emerald-800",
  REVERIFY_REQUIRED: "bg-red-100 text-red-800",
};

export default function PrelistedCompanyReview() {
  const { publishedId } = useParams();
  const navigate = useNavigate();
  const { admin } = useUserAuth() as any;
  const isSuperAdmin = admin?.adminData?.role === "super_admin";

  const [detail, setDetail] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [confirmed, setConfirmed] = useState(false);

  // Editable profile fields
  const [companyName, setCompanyName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");

  const load = () => {
    if (!publishedId) return;
    setLoading(true);
    fetch(`${API}/${encodeURIComponent(publishedId)}`, { headers: authHeader() })
      .then((r) => r.json())
      .then((d: Detail) => {
        setDetail(d);
        const c: Record<string, boolean> = {};
        d.checklist.forEach((i) => { c[i.key] = i.checked; });
        setChecks(c);
        setConfirmed(d.verificationConfirmed);
        setCompanyName(d.companyName || "");
        setLocation(d.location || "");
        const content = d.websiteContent || {};
        const about = content.about || {};
        const contact = content.contact || {};
        setDescription(about.description || content.hero?.description || "");
        setContactName(contact.contactName || contact.name || "");
        setEmail(contact.email || "");
        setPhone(contact.phone || contact.phoneNumber || "");
        setWebsite(contact.website || "");
      })
      .catch(() => toast.error("Failed to load this company"))
      .finally(() => setLoading(false));
  };

  useEffect(load, [publishedId]);

  const saveProfile = async (silent = false) => {
    if (!publishedId) return;
    const body = {
      companyName,
      location,
      websiteContent: {
        about: { ...(detail?.websiteContent?.about || {}), description },
        contact: { ...(detail?.websiteContent?.contact || {}), contactName, email, phone, website },
      },
    };
    const res = await fetch(`${API}/${encodeURIComponent(publishedId)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...authHeader() },
      body: JSON.stringify(body),
    });
    if (!res.ok) { if (!silent) toast.error("Failed to save"); return false; }
    if (!silent) toast.success("Saved");
    return true;
  };

  const saveChecklist = async () => {
    if (!publishedId) return null;
    const res = await fetch(`${API}/${encodeURIComponent(publishedId)}/checklist`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...authHeader() },
      body: JSON.stringify({ checklist: checks, confirmed }),
    });
    const data = await res.json();
    if (!res.ok) { toast.error(data?.detail || "Failed to save checklist"); return null; }
    return data;
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      await saveProfile();
      await saveChecklist();
      load();
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!publishedId) return;
    setSaving(true);
    try {
      await saveProfile(true);
      await saveChecklist();
      const res = await fetch(`${API}/${encodeURIComponent(publishedId)}/verify`, {
        method: "POST",
        headers: authHeader(),
      });
      const data = await res.json();
      if (!res.ok) {
        const missing = data?.detail?.missing;
        toast.error(missing ? `Missing: ${missing.join(", ")}` : (data?.detail || "Verification failed"));
        load();
        return;
      }
      toast.success("Company verified — Silver badge assigned");
      load();
    } finally {
      setSaving(false);
    }
  };

  const handleReopen = async () => {
    if (!publishedId) return;
    setSaving(true);
    try {
      const res = await fetch(`${API}/${encodeURIComponent(publishedId)}/reopen`, { method: "POST", headers: authHeader() });
      if (!res.ok) throw new Error();
      toast.success("Reopened for re-review");
      load();
    } catch {
      toast.error("Failed to reopen");
    } finally {
      setSaving(false);
    }
  };

  const handleRevoke = async () => {
    if (!publishedId) return;
    const reason = window.prompt("Reason for revoking the Silver badge (required):");
    if (!reason || !reason.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`${API}/${encodeURIComponent(publishedId)}/revoke-silver`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify({ reason }),
      });
      if (!res.ok) throw new Error();
      toast.success("Silver badge revoked");
      load();
    } catch {
      toast.error("Failed to revoke");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-10 flex items-center justify-center text-ink-caption"><Loader2 className="animate-spin mr-2" size={18} /> Loading…</div>;
  }
  if (!detail) {
    return <div className="p-10 text-center text-ink-caption">Company not found</div>;
  }

  const mandatoryOutstanding = detail.checklist.filter((i) => i.mandatory && !checks[i.key]);
  const canSubmit = mandatoryOutstanding.length === 0 && confirmed && detail.workflowStatus !== "VERIFIED";

  return (
    <div className="p-6 max-w-4xl mx-auto pb-24">
      <button onClick={() => navigate("/admin/verification/prelisted")} className="flex items-center gap-1 text-sm text-ink-paragraph hover:text-ink mb-4">
        <ArrowLeft size={15} /> Back to Verification queue
      </button>

      <div className="flex items-center justify-between mb-1">
        <h1 className="text-xl font-bold text-ink">{detail.companyName}</h1>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLE[detail.workflowStatus]}`}>
          {detail.workflowStatus.replace(/_/g, " ")}
        </span>
      </div>
      {detail.badgeStatus === "SILVER" && (
        <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-4">
          <ShieldCheck size={15} /> Verified • Silver{detail.verifiedAt ? ` — ${new Date(detail.verifiedAt).toLocaleString()}` : ""}
        </div>
      )}

      {/* Editable profile fields */}
      <div className="rounded-xl border border-ink-light bg-white p-5 mb-5 grid sm:grid-cols-2 gap-4">
        <Field label="Company Name" value={companyName} onChange={setCompanyName} />
        <Field label="Location / State" value={location} onChange={setLocation} />
        <Field label="Contact Name" value={contactName} onChange={setContactName} />
        <Field label="Phone Number" value={phone} onChange={setPhone} />
        <Field label="Email" value={email} onChange={setEmail} />
        <Field label="Website" value={website} onChange={setWebsite} />
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-ink-caption mb-1">Company Description / About</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full text-sm rounded-lg border border-ink-light px-3 py-2 focus:outline-none focus:border-brand-gold"
          />
        </div>
      </div>

      {/* Checklist */}
      <div className="rounded-xl border border-ink-light bg-white p-5 mb-5">
        <h2 className="text-sm font-bold text-ink mb-3">Verification Checklist</h2>
        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
          {detail.checklist.map((item) => (
            <label key={item.key} className="flex items-center gap-2 text-sm py-1">
              <input
                type="checkbox"
                checked={!!checks[item.key]}
                onChange={(e) => setChecks((p) => ({ ...p, [item.key]: e.target.checked }))}
              />
              <span className={item.mandatory ? "text-ink" : "text-ink-paragraph"}>
                {item.label}{item.mandatory && <span className="text-red-500"> *</span>}
              </span>
              {!item.present && (
                <span className="text-[10px] uppercase font-semibold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">missing data</span>
              )}
            </label>
          ))}
        </div>

        <label className="flex items-start gap-2 mt-5 pt-4 border-t border-ink-light text-sm">
          <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-0.5" />
          <span className="text-ink font-medium">I have verified the required profile content and media.</span>
        </label>

        {mandatoryOutstanding.length > 0 && (
          <div className="text-xs text-red-600 mt-2">
            Still needed: {mandatoryOutstanding.map((i) => i.label).join(", ")}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-ink-light p-4 flex items-center justify-center gap-3 z-40">
        <button
          onClick={handleSaveDraft}
          disabled={saving}
          className="text-sm font-semibold px-4 py-2 rounded-lg border border-ink-light hover:bg-surface-alt disabled:opacity-50"
        >
          Save Draft
        </button>
        {detail.workflowStatus === "VERIFIED" ? (
          <>
            <button onClick={handleReopen} disabled={saving} className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg border border-ink-light hover:bg-surface-alt disabled:opacity-50">
              <RotateCcw size={15} /> Reopen for Re-review
            </button>
            {isSuperAdmin && (
              <button onClick={handleRevoke} disabled={saving} className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50">
                <XCircle size={15} /> Revoke Silver
              </button>
            )}
          </>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || saving}
            className="flex items-center gap-1.5 text-sm font-semibold px-5 py-2 rounded-lg bg-brand-yellow hover:bg-brand-gold text-ink disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShieldCheck size={15} /> Submit Verification &amp; Assign Silver
          </button>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-ink-caption mb-1">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-sm rounded-lg border border-ink-light px-3 py-2 focus:outline-none focus:border-brand-gold"
      />
    </div>
  );
}
