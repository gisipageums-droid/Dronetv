import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Search, RotateCcw, User, ChevronLeft, ChevronRight, X,
  Building2, UserCircle, ExternalLink, CheckCircle, XCircle,
  MapPin, Briefcase, Star, Eye, Calendar, BarChart2, Trash2, AlertTriangle, Globe,
} from "lucide-react";
import { COMPANY_API, PROFESSIONAL_API, LAMBDA } from '../../../lib/apiConfig';

const COMPANIES_API = COMPANY_API ? `${COMPANY_API}/dashboard-cards?viewType=admin` : `${LAMBDA.company}/dashboard-cards?viewType=admin`;
const PROFESSIONALS_API = PROFESSIONAL_API ? `${PROFESSIONAL_API}/professional-dashboard-cards?viewType=admin` : `${LAMBDA.professional}/professional-dashboard-cards?viewType=admin`;

interface UserRecord {
  email: string;
  displayName: string;
  type: "company" | "professional";
  publishedId?: string;
  location?: string;
  status?: boolean;
  createdAt?: string;
  reviewStatus?: string;
  completionPercentage?: number;
  previewImage?: string;
  headerLogo?: string;
  urlSlug?: string;
  cleanUrl?: string;
  description?: string;
  isApproved?: boolean;
  isVisible?: boolean;
  publishedDate?: string;
  lastActivity?: string;
  templateSelection?: string;
  sectors?: string[];
  servicesCount?: number;
  productsCount?: number;
  professionalId?: string;
  categories?: string[];
  skillsCount?: number;
  userName?: string;
}

const PAGE_SIZE = 15;

function fmtDate(raw?: string) {
  if (!raw) return "—";
  try { return new Date(raw).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); }
  catch { return raw; }
}

function ReviewBadge({ status }: { status?: string }) {
  const s = status ?? "unknown";
  const cfg: Record<string, string> = {
    approved: "bg-status-success/15 text-status-success",
    pending: "bg-brand-yellow-soft text-brand-gold",
    rejected: "bg-status-error/15 text-status-error",
    under_review: "bg-status-info/15 text-status-info",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize ${cfg[s] ?? "bg-ink-light text-ink-caption"}`}>
      {s.replace("_", " ")}
    </span>
  );
}

function DetailDrawer({ user, onClose, onDeleted, onStatusChanged }: { user: UserRecord; onClose: () => void; onDeleted: (email: string, type: "company" | "professional") => void; onStatusChanged: (email: string, type: "company" | "professional", status: string) => void }) {
  const navigate = useNavigate();
  const image = user.headerLogo || user.previewImage;
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [actionLoading, setActionLoading] = useState<"approve" | "reject" | null>(null);
  const [currentReviewStatus, setCurrentReviewStatus] = useState(user.reviewStatus);

  const handleReviewAction = async (action: "approve" | "reject") => {
    if (!user.publishedId) return;
    setActionLoading(action);
    try {
      const res = await fetch(COMPANY_API ? `${COMPANY_API}/admin/templates/review` : `${LAMBDA.companyAdmin}/admin/templates/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publishedId: user.publishedId, action }),
      });
      if (!res.ok) throw new Error();
      const newStatus = action === "approve" ? "approved" : "rejected";
      toast.success(`Company ${action === "approve" ? "approved" : "rejected"} successfully`);
      setCurrentReviewStatus(newStatus);
      onStatusChanged(user.email, user.type, newStatus);
    } catch {
      toast.error(`Failed to ${action} company`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      let res: Response;
      if (user.type === "company" && user.publishedId) {
        res = await fetch(COMPANY_API ? `${COMPANY_API}/admin/templates/delete` : `${LAMBDA.companyAdmin}/admin/templates/delete`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
          body: JSON.stringify({ publishedId: user.publishedId, action: "delete" }),
        });
      } else if (user.type === "professional" && user.professionalId) {
        res = await fetch(PROFESSIONAL_API ? `${PROFESSIONAL_API}/delete-prof-tem` : `${LAMBDA.profDelete}/delete-prof-tem`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
          body: JSON.stringify({ professionalId: user.professionalId, action: "delete" }),
        });
      } else {
        toast.error("Cannot delete — no ID found");
        setDeleting(false);
        return;
      }
      if (!res.ok) throw new Error("Delete failed");
      toast.success(`${user.displayName} deleted successfully`);
      onDeleted(user.email, user.type);
      onClose();
    } catch {
      toast.error("Failed to delete user");
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <div className="fixed top-14 inset-x-0 bottom-0 z-50 flex justify-end" onClick={onClose}>
        <div className="absolute inset-0 bg-ink/40" />
        <div
          className="relative w-full sm:max-w-sm h-full overflow-y-auto bg-surface-card shadow-2xl border-l border-ink-light"
          onClick={e => e.stopPropagation()}
        >
          <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b border-ink-light bg-surface-card">
            <h2 className="text-ink font-bold text-base">User Details</h2>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-ink-light text-ink-caption transition-all">
              <X size={16} />
            </button>
          </div>

          <div className="p-5 space-y-5">
            {/* Profile */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl flex-shrink-0 overflow-hidden bg-surface-main border border-brand-yellow-soft flex items-center justify-center">
                {image
                  ? <img src={image} alt="" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  : <span className="text-brand-gold text-2xl font-black">{user.displayName.charAt(0).toUpperCase()}</span>
                }
              </div>
              <div className="min-w-0">
                <div className="text-ink font-bold text-base truncate">{user.displayName}</div>
                {user.userName && <div className="text-ink-caption text-xs mt-0.5">@{user.userName}</div>}
                <div className="text-ink-caption text-xs mt-0.5 truncate">{user.email}</div>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                    user.type === "company" ? "bg-status-info/15 text-status-info" : "bg-brand-gold/15 text-brand-gold"
                  }`}>
                    {user.type === "company" ? <Building2 size={10} /> : <UserCircle size={10} />}
                    {user.type === "company" ? "Company" : "Professional"}
                  </span>
                  <ReviewBadge status={user.reviewStatus} />
                </div>
              </div>
            </div>

            {user.description && (
              <div className="p-3 rounded-xl bg-ink-offwhite border border-ink-light">
                <p className="text-ink-paragraph text-xs leading-relaxed">{user.description}</p>
              </div>
            )}

            {/* Info grid */}
            <div className="space-y-2">
              <h3 className="text-[11px] font-bold text-ink-caption uppercase tracking-wider">Details</h3>
              <div className="rounded-xl overflow-hidden border border-ink-light bg-surface-card">
                {[
                  { icon: <MapPin size={13} />, label: "Location", value: user.location },
                  { icon: <Calendar size={13} />, label: "Registered", value: fmtDate(user.createdAt) },
                  { icon: <Calendar size={13} />, label: "Published", value: fmtDate(user.publishedDate) },
                  { icon: <Eye size={13} />, label: "Last Activity", value: fmtDate(user.lastActivity) },
                  { icon: <Star size={13} />, label: "Template", value: user.templateSelection?.replace("-", " ").replace(/\b\w/g, c => c.toUpperCase()) },
                  { icon: <BarChart2 size={13} />, label: "Completion", value: user.completionPercentage != null ? `${user.completionPercentage}%` : undefined },
                ].filter(r => r.value && r.value !== "—").map((row, i, arr) => (
                  <div key={row.label} className={`flex items-center gap-3 px-4 py-3 ${i < arr.length - 1 ? "border-b border-ink-light" : ""}`}>
                    <span className="text-ink-caption flex-shrink-0">{row.icon}</span>
                    <span className="text-ink-caption text-xs w-24 flex-shrink-0">{row.label}</span>
                    <span className="text-ink text-xs font-medium">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sectors / Categories */}
            {((user.sectors && user.sectors.length > 0) || (user.categories && user.categories.length > 0)) && (
              <div className="space-y-2">
                <h3 className="text-[11px] font-bold text-ink-caption uppercase tracking-wider">
                  {user.type === "company" ? "Sectors" : "Categories"}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(user.sectors ?? user.categories ?? []).map(s => (
                    <span key={s} className="px-2.5 py-1 rounded-lg bg-ink-light border border-ink-light text-ink-paragraph text-xs">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="space-y-2">
              <h3 className="text-[11px] font-bold text-ink-caption uppercase tracking-wider">Stats</h3>
              <div className="grid grid-cols-2 gap-2">
                {user.type === "company" ? (
                  <>
                    <StatBox label="Services" value={user.servicesCount ?? 0} icon={<Briefcase size={14} />} />
                    <StatBox label="Products" value={user.productsCount ?? 0} icon={<Star size={14} />} />
                  </>
                ) : (
                  <>
                    <StatBox label="Skills" value={user.skillsCount ?? 0} icon={<Star size={14} />} />
                    <StatBox label="Services" value={user.servicesCount ?? 0} icon={<Briefcase size={14} />} />
                  </>
                )}
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <h3 className="text-[11px] font-bold text-ink-caption uppercase tracking-wider">Status</h3>
              <div className="rounded-xl overflow-hidden border border-ink-light bg-surface-card">
                {[
                  { label: "Active", value: user.status },
                  { label: "Approved", value: user.isApproved },
                  { label: "Visible", value: user.isVisible },
                ].map((f, i) => (
                  <div key={f.label} className={`flex items-center justify-between px-4 py-3 ${i < 2 ? "border-b border-ink-light" : ""}`}>
                    <span className="text-ink-paragraph text-xs">{f.label}</span>
                    {f.value
                      ? <CheckCircle size={14} className="text-status-success" />
                      : <XCircle size={14} className="text-status-error" />
                    }
                  </div>
                ))}
              </div>
            </div>

            {/* Website Steps (company only) */}
            {user.type === "company" && user.publishedId && (
              <div className="space-y-2">
                <h3 className="text-[11px] font-bold text-ink-caption uppercase tracking-wider flex items-center gap-1.5">
                  <Globe size={11} />
                  Website
                </h3>

                {/* Edit company details — opens the 5-step form for this company */}
                <button
                  onClick={() => navigate(`/admin/companies/details/${user.publishedId}/${user.email}`)}
                  className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-surface-main hover:bg-brand-yellow-soft border border-brand-yellow-soft transition-all"
                >
                  <span className="text-brand-gold text-sm font-semibold">Edit Company Details</span>
                  <ChevronRight size={14} className="text-brand-gold" />
                </button>

                <div className="rounded-xl overflow-hidden border border-ink-light bg-surface-card">
                  {[
                    { label: "Company Registered", done: true },
                    { label: "Published / Visible", done: !!user.isVisible },
                    { label: "Verified & Approved", done: currentReviewStatus === "approved" },
                  ].map((step, i) => (
                    <div key={step.label} className={`flex items-center justify-between px-4 py-3 ${i < 2 ? "border-b border-ink-light" : ""}`}>
                      <span className="text-ink-paragraph text-xs font-medium">{step.label}</span>
                      {step.done
                        ? <CheckCircle size={14} className="text-status-success" />
                        : <XCircle size={14} className="text-ink-light" />
                      }
                    </div>
                  ))}
                </div>

                {currentReviewStatus !== "approved" ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReviewAction("approve")}
                      disabled={!!actionLoading}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-status-success/10 hover:bg-status-success/15 border border-status-success/25 text-status-success text-sm font-semibold transition-all disabled:opacity-50"
                    >
                      {actionLoading === "approve"
                        ? <div className="w-4 h-4 border-2 border-status-success/40 border-t-status-success rounded-full animate-spin" />
                        : <CheckCircle size={14} />
                      }
                      Approve
                    </button>
                    <button
                      onClick={() => handleReviewAction("reject")}
                      disabled={!!actionLoading}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-status-error/10 hover:bg-status-error/15 border border-status-error/25 text-status-error text-sm font-semibold transition-all disabled:opacity-50"
                    >
                      {actionLoading === "reject"
                        ? <div className="w-4 h-4 border-2 border-status-error/40 border-t-status-error rounded-full animate-spin" />
                        : <XCircle size={14} />
                      }
                      Reject
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleReviewAction("reject")}
                    disabled={!!actionLoading}
                    className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-xl bg-status-error/10 hover:bg-status-error/15 border border-status-error/25 text-status-error text-sm font-semibold transition-all disabled:opacity-50"
                  >
                    {actionLoading === "reject"
                      ? <div className="w-4 h-4 border-2 border-status-error/40 border-t-status-error rounded-full animate-spin" />
                      : <XCircle size={14} />
                    }
                    Revoke Approval
                  </button>
                )}
              </div>
            )}

            {/* View profile */}
            {user.cleanUrl && (
              <a
                href={user.cleanUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-surface-main hover:bg-brand-yellow-soft border border-brand-yellow-soft transition-all"
              >
                <span className="text-brand-gold text-sm font-semibold">View Live Profile</span>
                <ExternalLink size={14} className="text-brand-gold" />
              </a>
            )}

            {/* Delete */}
            {((user.type === "company" && user.publishedId) || (user.type === "professional" && user.professionalId)) && (
              <button
                onClick={() => setShowConfirm(true)}
                className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-status-error/10 hover:bg-status-error/15 border border-status-error/25 transition-all"
              >
                <span className="text-status-error text-sm font-semibold flex items-center gap-2">
                  <Trash2 size={14} />
                  Delete User
                </span>
                <ChevronRight size={14} className="text-status-error" />
              </button>
            )}
          </div>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={() => !deleting && setShowConfirm(false)}>
          <div className="absolute inset-0 bg-ink/50" />
          <div
            className="relative w-full max-w-sm bg-surface-card rounded-2xl p-6 shadow-2xl border border-status-error/15"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-status-error/10 border border-status-error/15 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={18} className="text-status-error" />
              </div>
              <div>
                <h3 className="text-ink font-bold text-base">Delete User?</h3>
                <p className="text-ink-caption text-xs mt-0.5">This cannot be undone</p>
              </div>
            </div>
            <p className="text-ink-paragraph text-sm mb-5">
              Permanently delete <span className="text-ink font-semibold">{user.displayName}</span> and all their data?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-xl bg-ink-light hover:bg-ink-light text-ink-paragraph text-sm font-semibold transition-all disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-xl bg-status-error hover:bg-status-error text-white text-sm font-bold transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {deleting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Trash2 size={14} />}
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function StatBox({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl p-3 border border-ink-light bg-ink-offwhite flex items-center gap-3">
      <div className="text-brand-gold">{icon}</div>
      <div>
        <div className="text-ink font-bold text-base leading-none">{value}</div>
        <div className="text-ink-caption text-[11px] mt-0.5">{label}</div>
      </div>
    </div>
  );
}

export default function AdminUsersDashboard() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [filtered, setFiltered] = useState<UserRecord[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "company" | "professional">("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<UserRecord | null>(null);

  const load = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const [compRes, proRes] = await Promise.all([
        fetch(COMPANIES_API, { signal }),
        fetch(PROFESSIONALS_API, { signal }),
      ]);
      const compData = compRes.ok ? await compRes.json() : { cards: [] };
      const proData = proRes.ok ? await proRes.json() : { cards: [] };

      const seenCompany = new Set<string>();
      const seenProfessional = new Set<string>();
      const combined: UserRecord[] = [];

      for (const c of (compData.cards ?? [])) {
        const email: string = c.userId ?? "";
        if (!email || seenCompany.has(email)) continue;
        seenCompany.add(email);
        combined.push({
          email,
          displayName: c.companyName ?? email,
          type: "company",
          publishedId: c.publishedId,
          location: c.location,
          status: c.status,
          createdAt: c.createdAt,
          reviewStatus: c.reviewStatus,
          completionPercentage: c.completionPercentage,
          previewImage: c.previewImage,
          headerLogo: c.headerLogo,
          urlSlug: c.urlSlug,
          cleanUrl: c.cleanUrl,
          description: c.companyDescription,
          isApproved: c.isApproved,
          isVisible: c.isVisible,
          publishedDate: c.publishedDate || undefined,
          lastActivity: c.lastActivity || undefined,
          templateSelection: c.templateSelection,
          sectors: c.sectors,
          servicesCount: c.servicesCount,
          productsCount: c.productsCount,
        });
      }

      for (const p of (proData.cards ?? [])) {
        const email: string = p.userId ?? "";
        if (!email || seenProfessional.has(email)) continue;
        seenProfessional.add(email);
        combined.push({
          email,
          displayName: p.fullName ?? p.professionalName ?? email,
          type: "professional",
          professionalId: p.professionalId,
          location: p.location,
          status: p.status,
          createdAt: p.createdAt,
          reviewStatus: p.reviewStatus,
          completionPercentage: p.completionPercentage,
          previewImage: p.previewImage,
          urlSlug: p.urlSlug,
          cleanUrl: p.cleanUrl,
          description: p.professionalDescription,
          isApproved: p.isApproved,
          isVisible: p.isVisible,
          publishedDate: p.publishedDate || undefined,
          lastActivity: p.lastActivity || undefined,
          templateSelection: p.templateSelection,
          categories: p.categories,
          skillsCount: p.skillsCount,
          servicesCount: p.servicesCount,
          userName: p.userName,
        });
      }

      combined.sort((a, b) => (b.createdAt ?? "") > (a.createdAt ?? "") ? 1 : -1);
      setUsers(combined);
      setFiltered(combined);
    } catch (err: any) {
      if (err.name !== "AbortError") setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  useEffect(() => {
    const q = search.trim().toLowerCase();
    let list = users;
    if (typeFilter !== "all") list = list.filter(u => u.type === typeFilter);
    if (q) list = list.filter(u =>
      u.displayName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.location ?? "").toLowerCase().includes(q)
    );
    setFiltered(list);
    setPage(1);
  }, [search, typeFilter, users]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const compCount = users.filter(u => u.type === "company").length;
  const proCount = users.filter(u => u.type === "professional").length;

  return (
    <div className="space-y-5">
      {/* Page header — dark like other admin pages */}
      <div className="bg-ink px-6 py-5">
        <p className="text-xs font-bold tracking-widest text-brand-yellow uppercase mb-1">Admin</p>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-extrabold text-white mb-0.5">Users</h1>
            <p className="text-sm text-ink-caption">
              {loading ? "Loading..." : `${users.length} registered user${users.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <button
            onClick={() => load()}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm transition-all disabled:opacity-40"
          >
            <RotateCcw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      <div className="px-6 space-y-5 pb-6">
        {/* Stats */}
        {!loading && !error && (
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {[
              { label: "Total Users", value: users.length, icon: <User size={16} />, color: "text-brand-gold" },
              { label: "Companies", value: compCount, icon: <Building2 size={16} />, color: "text-status-info" },
              { label: "Professionals", value: proCount, icon: <UserCircle size={16} />, color: "text-brand-gold" },
            ].map(s => (
              <div key={s.label} className="bg-surface-card rounded-xl p-3 sm:p-4 border border-ink-light shadow-sm flex items-center gap-2 sm:gap-3">
                <div className={`${s.color} hidden sm:block`}>{s.icon}</div>
                <div>
                  <div className="text-ink font-bold text-base sm:text-lg leading-none">{s.value}</div>
                  <div className="text-ink-caption text-[10px] sm:text-xs mt-0.5 leading-tight">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-caption" />
            <input
              type="text"
              placeholder="Search by name, email or location…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-surface-card border border-ink-light text-ink text-sm placeholder-ink-caption outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-caption hover:text-ink-paragraph">
                <X size={13} />
              </button>
            )}
          </div>
          <div className="flex rounded-xl overflow-hidden border border-ink-light bg-surface-card">
            {(["all", "company", "professional"] as const).map(t => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-4 py-2.5 text-xs font-semibold transition-all ${
                  typeFilter === t ? "bg-brand-yellow text-ink" : "text-ink-paragraph hover:bg-ink-offwhite"
                }`}
              >
                {t === "all" ? "All" : t === "company" ? "Companies" : "Professionals"}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-surface-card rounded-xl border border-ink-light shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-8 h-8 border-2 border-brand-yellow/30 border-t-brand-yellow rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3 text-ink-caption">
              <p className="text-sm">{error}</p>
              <button onClick={() => load()} className="text-brand-gold text-sm hover:underline">Retry</button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-2 text-ink-caption">
              <User size={32} className="opacity-30" />
              <p className="text-sm">{search ? "No users match your search" : "No users found"}</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-ink-light bg-ink-offwhite">
                      <th className="px-3 py-3 text-left text-[11px] font-bold text-ink-caption uppercase tracking-wider hidden sm:table-cell">#</th>
                      <th className="px-3 py-3 text-left text-[11px] font-bold text-ink-caption uppercase tracking-wider">Name</th>
                      <th className="px-3 py-3 text-left text-[11px] font-bold text-ink-caption uppercase tracking-wider hidden md:table-cell">Email</th>
                      <th className="px-3 py-3 text-left text-[11px] font-bold text-ink-caption uppercase tracking-wider hidden lg:table-cell">Location</th>
                      <th className="px-3 py-3 text-left text-[11px] font-bold text-ink-caption uppercase tracking-wider">Type</th>
                      <th className="px-3 py-3 text-left text-[11px] font-bold text-ink-caption uppercase tracking-wider hidden sm:table-cell">Review</th>
                      <th className="px-3 py-3 text-left text-[11px] font-bold text-ink-caption uppercase tracking-wider hidden lg:table-cell">Registered</th>
                      <th className="px-3 py-3 text-center text-[11px] font-bold text-ink-caption uppercase tracking-wider">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-light">
                    {paginated.map((u, i) => (
                      <tr
                        key={`${u.type}-${u.email}`}
                        onClick={() => setSelected(u)}
                        className="hover:bg-ink-offwhite cursor-pointer transition-colors"
                      >
                        <td className="px-3 py-3 text-ink-caption text-xs hidden sm:table-cell">{(page - 1) * PAGE_SIZE + i + 1}</td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg flex-shrink-0 overflow-hidden bg-surface-main border border-brand-yellow-soft flex items-center justify-center">
                              {u.headerLogo || u.previewImage
                                ? <img src={u.headerLogo || u.previewImage} alt="" className="w-full h-full object-cover"
                                    onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                                : <span className="text-brand-gold text-[11px] font-bold">{u.displayName.charAt(0).toUpperCase()}</span>
                              }
                            </div>
                            <div className="min-w-0">
                              <div className="text-ink font-medium text-xs truncate max-w-[120px] sm:max-w-[160px]">{u.displayName}</div>
                              <div className="text-ink-caption text-[10px] truncate max-w-[120px] md:hidden">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-ink-caption text-xs hidden md:table-cell max-w-[160px] truncate">{u.email}</td>
                        <td className="px-3 py-3 text-ink-caption text-xs hidden lg:table-cell">{u.location ?? "—"}</td>
                        <td className="px-3 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            u.type === "company" ? "bg-status-info/15 text-status-info" : "bg-brand-gold/15 text-brand-gold"
                          }`}>
                            {u.type === "company" ? <Building2 size={10} /> : <UserCircle size={10} />}
                            <span className="hidden sm:inline">{u.type === "company" ? "Company" : "Professional"}</span>
                          </span>
                        </td>
                        <td className="px-3 py-3 hidden sm:table-cell"><ReviewBadge status={u.reviewStatus} /></td>
                        <td className="px-3 py-3 text-ink-caption text-xs whitespace-nowrap hidden lg:table-cell">{fmtDate(u.createdAt)}</td>
                        <td className="px-3 py-3 text-center">
                          <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-ink-light hover:bg-brand-yellow-soft text-ink-caption hover:text-brand-yellow transition-all mx-auto">
                            <ChevronRight size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-ink-light bg-ink-offwhite">
                  <span className="text-xs text-ink-caption">
                    Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-surface-card border border-ink-light hover:bg-ink-light text-ink-paragraph disabled:opacity-30 transition-all"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <span className="text-xs text-ink-caption px-2">{page} / {totalPages}</span>
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-surface-card border border-ink-light hover:bg-ink-light text-ink-paragraph disabled:opacity-30 transition-all"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {selected && (
        <DetailDrawer
          user={selected}
          onClose={() => setSelected(null)}
          onDeleted={(email, type) => {
            setUsers(prev => prev.filter(u => !(u.email === email && u.type === type)));
            setSelected(null);
          }}
          onStatusChanged={(email, type, status) => {
            setUsers(prev => prev.map(u => (u.email === email && u.type === type) ? { ...u, reviewStatus: status } : u));
          }}
        />
      )}
    </div>
  );
}
