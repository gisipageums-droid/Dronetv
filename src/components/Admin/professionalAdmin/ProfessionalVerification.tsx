import { useCallback, useEffect, useState } from "react";
import { BadgeCheck, FileText, Check, X, RotateCcw } from "lucide-react";
import { toast } from "react-toastify";
import { PROFESSIONAL_API } from "../../../lib/apiConfig";
import { authHeader } from "../../../lib/authService";

interface Cert {
  professionalId: string; fullName: string; userName: string; email: string | null;
  type: string; issuer: string; number: string; file_url: string; file_name: string;
  status: "pending" | "approved" | "rejected"; notes: string; reviewedAt: string;
}
interface IdentityRow {
  professionalId: string; fullName: string; userName: string; email: string | null;
  verified: boolean; verifiedAt: string; source: string; phoneMatched: boolean;
}

const TABS = [
  { key: "pending", label: "Certificates to review" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
  { key: "identity", label: "Identity status" },
] as const;

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800", approved: "bg-emerald-100 text-emerald-800", rejected: "bg-red-100 text-red-700",
};

const ProfessionalVerification: React.FC = () => {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("pending");
  const [certs, setCerts] = useState<Cert[]>([]);
  const [identity, setIdentity] = useState<IdentityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch(`${PROFESSIONAL_API}/admin/verification?status=all`, { headers: authHeader() });
      if (!res.ok) throw new Error(String(res.status));
      const d = await res.json();
      setCerts(d.certificates || []); setIdentity(d.identity || []);
    } catch { setError("Could not load the review list. Please try again."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const review = async (c: Cert, action: "approve" | "reject" | "reset") => {
    let notes = "";
    if (action === "reject") { notes = window.prompt("Reason for rejecting this certificate (shown to admins only):") || ""; }
    setBusy(c.file_url);
    try {
      const res = await fetch(`${PROFESSIONAL_API}/admin/verification/certificate`, {
        method: "POST", headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify({ professionalId: c.professionalId, file_url: c.file_url, action, notes }),
      });
      if (!res.ok) throw new Error();
      toast.success(action === "approve" ? "Certificate approved" : action === "reject" ? "Certificate rejected" : "Moved back to pending");
      await load();
    } catch { toast.error("Could not save. Please try again."); }
    finally { setBusy(""); }
  };

  const setVerified = async (r: IdentityRow, verified: boolean) => {
    if (!window.confirm(verified ? `Mark ${r.fullName} as identity verified?` : `Remove the verified badge from ${r.fullName}?`)) return;
    setBusy(r.professionalId);
    try {
      const res = await fetch(`${PROFESSIONAL_API}/admin/verification/identity`, {
        method: "POST", headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify({ professionalId: r.professionalId, verified }),
      });
      if (!res.ok) throw new Error();
      toast.success(verified ? "Marked as verified" : "Verified badge removed");
      await load();
    } catch { toast.error("Could not save. Please try again."); }
    finally { setBusy(""); }
  };

  const shown = tab === "identity" ? [] : certs.filter(c => c.status === tab);
  const count = (k: string) => certs.filter(c => c.status === k).length;

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6">
      <h1 className="mb-1 flex items-center gap-2 text-xl font-bold"><BadgeCheck className="size-6 text-amber-500" />Professional verification</h1>
      <p className="mb-4 text-sm text-slate-600">Check uploaded certificates and manage the Verified badge. A profile shows as DGCA certified only after you approve its DGCA certificate here.</p>

      <div className="mb-4 flex flex-wrap gap-2" role="tablist">
        {TABS.map(t => (
          <button key={t.key} type="button" role="tab" aria-selected={tab === t.key} onClick={() => setTab(t.key)}
            className={`rounded-lg border px-3 py-1.5 text-sm font-semibold ${tab === t.key ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 bg-white"}`}>
            {t.label}{t.key !== "identity" ? ` (${count(t.key)})` : ` (${identity.filter(i => i.verified).length}/${identity.length})`}
          </button>
        ))}
      </div>

      {error && <div role="alert" className="mb-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error} <button type="button" onClick={load} className="font-semibold underline">Try again</button></div>}
      {loading ? <div role="status" className="py-10 text-center text-sm text-slate-500">Loading...</div> : tab === "identity" ? (
        identity.length === 0 ? <div className="rounded-xl border bg-white p-8 text-center text-sm text-slate-500">No profiles created with the new form yet.</div> : (
          <div className="overflow-x-auto rounded-xl border bg-white">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="p-3">Professional</th><th className="p-3">Email</th><th className="p-3">Phone check</th><th className="p-3">Identity</th><th className="p-3">Action</th></tr></thead>
              <tbody className="divide-y">
                {identity.map(r => (
                  <tr key={r.professionalId}>
                    <td className="p-3"><div className="font-semibold">{r.fullName}</div><div className="text-xs text-slate-500">{r.userName}</div></td>
                    <td className="p-3 text-xs">{r.email || "-"}</td>
                    <td className="p-3 text-xs">{r.phoneMatched ? "Matched" : "Not matched"}</td>
                    <td className="p-3">{r.verified ? <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">Verified{r.source ? ` (${r.source})` : ""}</span> : <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">Not verified</span>}</td>
                    <td className="p-3"><button type="button" disabled={busy === r.professionalId} onClick={() => setVerified(r, !r.verified)} className="rounded-lg border px-3 py-1.5 text-xs font-semibold hover:bg-slate-50 disabled:opacity-50">{r.verified ? "Remove badge" : "Mark verified"}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : shown.length === 0 ? (
        <div className="rounded-xl border bg-white p-8 text-center text-sm text-slate-500">Nothing here.</div>
      ) : (
        <ul className="space-y-3">
          {shown.map(c => (
            <li key={c.professionalId + c.file_url} className="flex flex-wrap items-center gap-3 rounded-xl border bg-white p-4">
              <FileText className="size-8 shrink-0 text-slate-400" />
              <div className="min-w-0 flex-1">
                <div className="font-bold">{c.type}</div>
                <div className="text-sm text-slate-700">{c.fullName} <span className="text-xs text-slate-500">({c.userName})</span></div>
                <div className="text-xs text-slate-500">{[c.issuer, c.number && `No. ${c.number}`].filter(Boolean).join(" | ") || "No issuer or number given"}</div>
                {c.notes && <div className="mt-1 text-xs text-slate-600">Note: {c.notes}</div>}
              </div>
              <span className={`rounded px-2 py-0.5 text-xs font-bold ${STATUS_STYLE[c.status]}`}>{c.status}</span>
              <a href={c.file_url} target="_blank" rel="noreferrer" className="rounded-lg border px-3 py-1.5 text-xs font-semibold hover:bg-slate-50">Open file</a>
              <div className="flex gap-1.5">
                {c.status !== "approved" && <button type="button" disabled={busy === c.file_url} onClick={() => review(c, "approve")} className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white disabled:opacity-50"><Check className="size-3.5" />Approve</button>}
                {c.status !== "rejected" && <button type="button" disabled={busy === c.file_url} onClick={() => review(c, "reject")} className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white disabled:opacity-50"><X className="size-3.5" />Reject</button>}
                {c.status !== "pending" && <button type="button" disabled={busy === c.file_url} onClick={() => review(c, "reset")} className="flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-semibold disabled:opacity-50"><RotateCcw className="size-3.5" />Reset</button>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProfessionalVerification;
