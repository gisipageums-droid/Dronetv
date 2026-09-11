import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ShieldCheck, Clock, Eye, CheckCircle2, RotateCcw, ImageOff } from "lucide-react";
import { toast } from "react-toastify";
import { COMPANY_API } from "../../../lib/apiConfig";
import { authHeader } from "../../../lib/authService";

const API = `${COMPANY_API}/admin/prelisted-companies`;

interface Counters {
  totalPrelisted: number;
  pendingVerification: number;
  inReview: number;
  readyToSubmit: number;
  silverVerified: number;
  reverifyRequired: number;
}

interface Row {
  publishedId: string;
  companyName: string;
  contactName: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  website: string | null;
  completionPercentage: number | null;
  logoPresent: boolean;
  imagesPresent: boolean;
  workflowStatus: string;
  badgeStatus: string;
  lastReviewedBy: string | null;
  lastReviewedAt: string | null;
}

const STATUS_TABS: { key: string; label: string; countKey: keyof Counters }[] = [
  { key: "", label: "All", countKey: "totalPrelisted" },
  { key: "PRE_LISTED", label: "Pending Verification", countKey: "pendingVerification" },
  { key: "IN_REVIEW", label: "In Review", countKey: "inReview" },
  { key: "READY_TO_SUBMIT", label: "Ready to Submit", countKey: "readyToSubmit" },
  { key: "VERIFIED", label: "Silver / Verified", countKey: "silverVerified" },
  { key: "REVERIFY_REQUIRED", label: "Re-verification Required", countKey: "reverifyRequired" },
];

const STATUS_STYLE: Record<string, string> = {
  PRE_LISTED: "bg-gray-100 text-gray-700",
  IN_REVIEW: "bg-amber-100 text-amber-800",
  READY_TO_SUBMIT: "bg-blue-100 text-blue-800",
  VERIFIED: "bg-emerald-100 text-emerald-800",
  REVERIFY_REQUIRED: "bg-red-100 text-red-800",
};

export default function PrelistedCompanies() {
  const navigate = useNavigate();
  const [counters, setCounters] = useState<Counters | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [missing, setMissing] = useState("");
  const [sortBy, setSortBy] = useState("oldest");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkBusy, setBulkBusy] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ limit: "100", sortBy });
    if (status) params.set("workflowStatus", status);
    if (search) params.set("search", search);
    if (missing) params.set("missing", missing);
    fetch(`${API}?${params.toString()}`, { headers: authHeader() })
      .then((r) => r.json())
      .then((d) => {
        setCounters(d.counters || null);
        setRows(d.items || []);
        setTotal(d.total || 0);
        setSelected(new Set());
      })
      .catch(() => toast.error("Failed to load the verification queue"))
      .finally(() => setLoading(false));
  }, [status, search, missing, sortBy]);

  useEffect(() => { load(); }, [load]);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const readyRows = rows.filter((r) => r.workflowStatus === "READY_TO_SUBMIT");

  const bulkSubmit = async () => {
    if (!selected.size) return;
    setBulkBusy(true);
    try {
      const res = await fetch(`${API}/bulk-verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify({ publishedIds: Array.from(selected) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || `HTTP ${res.status}`);
      toast.success(`Silver assigned to ${data.succeeded.length} companies${data.failed.length ? `, ${data.failed.length} skipped` : ""}`);
      load();
    } catch (e: any) {
      toast.error(e.message || "Bulk verification failed");
    } finally {
      setBulkBusy(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-lg sm:text-xl font-bold text-ink">Pre-Listed Company Verification</h1>
      </div>
      <p className="text-sm text-ink-paragraph mb-5">
        Review pre-listed companies, complete their checklist, then submit to assign the Silver badge.
      </p>

      {/* Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {STATUS_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setStatus(t.key)}
            className={`text-left rounded-xl border p-3 transition-colors ${status === t.key ? "border-brand-yellow bg-brand-yellow/10" : "border-ink-light bg-white hover:bg-surface-alt"}`}
          >
            <div className="text-2xl font-bold text-ink">{counters ? counters[t.countKey] : "—"}</div>
            <div className="text-xs text-ink-paragraph mt-0.5">{t.label}</div>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-caption" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by company, email or phone"
            className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-ink-light focus:outline-none focus:border-brand-gold"
          />
        </div>
        <select value={missing} onChange={(e) => setMissing(e.target.value)} className="text-sm rounded-lg border border-ink-light px-2 py-2">
          <option value="">All content</option>
          <option value="logo">Missing logo</option>
          <option value="images">Missing images</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-sm rounded-lg border border-ink-light px-2 py-2">
          <option value="oldest">Oldest pending first</option>
          <option value="newest">Newest updated first</option>
          <option value="name">Company name</option>
          <option value="completeness">Completeness</option>
        </select>
        {selected.size > 0 && (
          <button
            onClick={bulkSubmit}
            disabled={bulkBusy}
            className="ml-auto flex items-center gap-1.5 text-sm font-semibold bg-brand-yellow hover:bg-brand-gold text-ink px-3 py-2 rounded-lg disabled:opacity-50"
          >
            <ShieldCheck size={15} /> {bulkBusy ? "Submitting…" : `Submit Selected as Silver (${selected.size})`}
          </button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-ink-light bg-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ink-caption border-b border-ink-light">
              <th className="p-3 w-8">
                <input
                  type="checkbox"
                  checked={readyRows.length > 0 && selected.size === readyRows.length}
                  onChange={(e) => setSelected(e.target.checked ? new Set(readyRows.map((r) => r.publishedId)) : new Set())}
                  disabled={!readyRows.length}
                />
              </th>
              <th className="p-3">Company</th>
              <th className="p-3">Contact</th>
              <th className="p-3">Location</th>
              <th className="p-3">Content</th>
              <th className="p-3">Status</th>
              <th className="p-3">Badge</th>
              <th className="p-3">Last Updated</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={9} className="p-8 text-center text-ink-caption">Loading…</td></tr>
            )}
            {!loading && rows.length === 0 && (
              <tr><td colSpan={9} className="p-8 text-center text-ink-caption">Nothing in this view</td></tr>
            )}
            {!loading && rows.map((r) => (
              <tr key={r.publishedId} className="border-b border-ink-light last:border-0 hover:bg-surface-alt/40">
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selected.has(r.publishedId)}
                    disabled={r.workflowStatus !== "READY_TO_SUBMIT"}
                    onChange={() => toggleSelect(r.publishedId)}
                  />
                </td>
                <td className="p-3 font-medium text-ink">{r.companyName || "—"}</td>
                <td className="p-3 text-ink-paragraph">
                  <div>{r.contactName || "—"}</div>
                  <div className="text-xs text-ink-caption">{r.email || r.phone || ""}</div>
                </td>
                <td className="p-3 text-ink-paragraph">{r.location || "—"}</td>
                <td className="p-3">
                  {!r.logoPresent || !r.imagesPresent ? (
                    <span className="inline-flex items-center gap-1 text-xs text-amber-700"><ImageOff size={13} /> incomplete</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-700"><CheckCircle2 size={13} /> complete</span>
                  )}
                </td>
                <td className="p-3">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_STYLE[r.workflowStatus] || "bg-gray-100 text-gray-700"}`}>
                    {r.workflowStatus.replace(/_/g, " ")}
                  </span>
                </td>
                <td className="p-3">
                  {r.badgeStatus === "SILVER" ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600"><ShieldCheck size={13} /> Silver</span>
                  ) : (
                    <span className="text-xs text-ink-caption">—</span>
                  )}
                </td>
                <td className="p-3 text-xs text-ink-caption">
                  {r.lastReviewedAt ? new Date(r.lastReviewedAt).toLocaleDateString() : <Clock size={13} className="inline" />}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => navigate(`/admin/verification/prelisted/${r.publishedId}`)}
                    className="flex items-center gap-1 text-xs font-semibold text-ink-link hover:underline"
                  >
                    <Eye size={13} /> Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-xs text-ink-caption mt-2">{total} pre-listed companies in this filter</div>
    </div>
  );
}
