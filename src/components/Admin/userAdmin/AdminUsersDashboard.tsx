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
    approved: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    rejected: "bg-red-100 text-red-700",
    under_review: "bg-blue-100 text-blue-700",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize ${cfg[s] ?? "bg-gray-100 text-gray-500"}`}>
      {s.replace("_", " ")}
    </span>
  );
}

function DetailDrawer({ user, onClose, onDeleted, onStatusChanged }: { user: UserRecord; onClose: () => void; onDeleted: (email: string) => void; onStatusChanged: (email: string, status: string) => void }) {
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
      onStatusChanged(user.email, newStatus);
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
      onDeleted(user.email);
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
        <div className="absolute inset-0 bg-black/40" />
        <div
          className="relative w-full sm:max-w-sm h-full overflow-y-auto bg-white shadow-2xl border-l border-gray-200"
          onClick={e => e.stopPropagation()}
        >
          <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-white">
            <h2 className="text-gray-900 font-bold text-base">User Details</h2>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-all">
              <X size={16} />
            </button>
          </div>

          <div className="p-5 space-y-5">
            {/* Profile */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl flex-shrink-0 overflow-hidden bg-yellow-50 border border-yellow-100 flex items-center justify-center">
                {image
                  ? <img src={image} alt="" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  : <span className="text-yellow-500 text-2xl font-black">{user.displayName.charAt(0).toUpperCase()}</span>
                }
              </div>
              <div className="min-w-0">
                <div className="text-gray-900 font-bold text-base truncate">{user.displayName}</div>
                {user.userName && <div className="text-gray-400 text-xs mt-0.5">@{user.userName}</div>}
                <div className="text-gray-500 text-xs mt-0.5 truncate">{user.email}</div>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                    user.type === "company" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                  }`}>
                    {user.type === "company" ? <Building2 size={10} /> : <UserCircle size={10} />}
                    {user.type === "company" ? "Company" : "Professional"}
                  </span>
                  <ReviewBadge status={user.reviewStatus} />
                </div>
              </div>
            </div>

            {user.description && (
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                <p className="text-gray-600 text-xs leading-relaxed">{user.description}</p>
              </div>
            )}

            {/* Info grid */}
            <div className="space-y-2">
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Details</h3>
              <div className="rounded-xl overflow-hidden border border-gray-200 bg-white">
                {[
                  { icon: <MapPin size={13} />, label: "Location", value: user.location },
                  { icon: <Calendar size={13} />, label: "Registered", value: fmtDate(user.createdAt) },
                  { icon: <Calendar size={13} />, label: "Published", value: fmtDate(user.publishedDate) },
                  { icon: <Eye size={13} />, label: "Last Activity", value: fmtDate(user.lastActivity) },
                  { icon: <Star size={13} />, label: "Template", value: user.templateSelection?.replace("-", " ").replace(/\b\w/g, c => c.toUpperCase()) },
                  { icon: <BarChart2 size={13} />, label: "Completion", value: user.completionPercentage != null ? `${user.completionPercentage}%` : undefined },
                ].filter(r => r.value && r.value !== "—").map((row, i, arr) => (
                  <div key={row.label} className={`flex items-center gap-3 px-4 py-3 ${i < arr.length - 1 ? "border-b border-gray-100" : ""}`}>
                    <span className="text-gray-400 flex-shrink-0">{row.icon}</span>
                    <span className="text-gray-500 text-xs w-24 flex-shrink-0">{row.label}</span>
                    <span className="text-gray-900 text-xs font-medium">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sectors / Categories */}
            {((user.sectors && user.sectors.length > 0) || (user.categories && user.categories.length > 0)) && (
              <div className="space-y-2">
                <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  {user.type === "company" ? "Sectors" : "Categories"}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(user.sectors ?? user.categories ?? []).map(s => (
                    <span key={s} className="px-2.5 py-1 rounded-lg bg-gray-100 border border-gray-200 text-gray-600 text-xs">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="space-y-2">
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Stats</h3>
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
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</h3>
              <div className="rounded-xl overflow-hidden border border-gray-200 bg-white">
                {[
                  { label: "Active", value: user.status },
                  { label: "Approved", value: user.isApproved },
                  { label: "Visible", value: user.isVisible },
                ].map((f, i) => (
                  <div key={f.label} className={`flex items-center justify-between px-4 py-3 ${i < 2 ? "border-b border-gray-100" : ""}`}>
                    <span className="text-gray-600 text-xs">{f.label}</span>
                    {f.value
                      ? <CheckCircle size={14} className="text-green-500" />
                      : <XCircle size={14} className="text-red-400" />
                    }
                  </div>
                ))}
              </div>
            </div>

            {/* Website Steps (company only) */}
            {user.type === "company" && user.publishedId && (
              <div className="space-y-2">
                <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Globe size={11} />
                  Website
                </h3>

                {/* Edit company details — opens the 5-step form for this company */}
                <button
                  onClick={() => navigate(`/admin/companies/details/${user.publishedId}/${user.email}`)}
                  className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 transition-all"
                >
                  <span className="text-yellow-800 text-sm font-semibold">Edit Company Details</span>
                  <ChevronRight size={14} className="text-yellow-500" />
                </button>

                <div className="rounded-xl overflow-hidden border border-gray-200 bg-white">
                  {[
                    { label: "Company Registered", done: true },
                    { label: "Published / Visible", done: !!user.isVisible },
                    { label: "Verified & Approved", done: currentReviewStatus === "approved" },
                  ].map((step, i) => (
                    <div key={step.label} className={`flex items-center justify-between px-4 py-3 ${i < 2 ? "border-b border-gray-100" : ""}`}>
                      <span className="text-gray-700 text-xs font-medium">{step.label}</span>
                      {step.done
                        ? <CheckCircle size={14} className="text-green-500" />
                        : <XCircle size={14} className="text-gray-300" />
                      }
                    </div>
                  ))}
                </div>

                {currentReviewStatus !== "approved" ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReviewAction("approve")}
                      disabled={!!actionLoading}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 text-sm font-semibold transition-all disabled:opacity-50"
                    >
                      {actionLoading === "approve"
                        ? <div className="w-4 h-4 border-2 border-green-400/40 border-t-green-500 rounded-full animate-spin" />
                        : <CheckCircle size={14} />
                      }
                      Approve
                    </button>
                    <button
                      onClick={() => handleReviewAction("reject")}
                      disabled={!!actionLoading}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-sm font-semibold transition-all disabled:opacity-50"
                    >
                      {actionLoading === "reject"
                        ? <div className="w-4 h-4 border-2 border-red-400/40 border-t-red-500 rounded-full animate-spin" />
                        : <XCircle size={14} />
                      }
                      Reject
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleReviewAction("reject")}
                    disabled={!!actionLoading}
                    className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-sm font-semibold transition-all disabled:opacity-50"
                  >
                    {actionLoading === "reject"
                      ? <div className="w-4 h-4 border-2 border-red-400/40 border-t-red-500 rounded-full animate-spin" />
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
                className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 transition-all"
              >
                <span className="text-yellow-700 text-sm font-semibold">View Live Profile</span>
                <ExternalLink size={14} className="text-yellow-600" />
              </a>
            )}

            {/* Delete */}
            {((user.type === "company" && user.publishedId) || (user.type === "professional" && user.professionalId)) && (
              <button
                onClick={() => setShowConfirm(true)}
                className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 transition-all"
              >
                <span className="text-red-600 text-sm font-semibold flex items-center gap-2">
                  <Trash2 size={14} />
                  Delete User
                </span>
                <ChevronRight size={14} className="text-red-400" />
              </button>
            )}
          </div>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={() => !deleting && setShowConfirm(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="relative w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl border border-red-100"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={18} className="text-red-500" />
              </div>
              <div>
                <h3 className="text-gray-900 font-bold text-base">Delete User?</h3>
                <p className="text-gray-400 text-xs mt-0.5">This cannot be undone</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-5">
              Permanently delete <span className="text-gray-900 font-semibold">{user.displayName}</span> and all their data?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold transition-all disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-all disabled:opacity-60 flex items-center justify-center gap-2"
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
    <div className="rounded-xl p-3 border border-gray-200 bg-gray-50 flex items-center gap-3">
      <div className="text-yellow-500">{icon}</div>
      <div>
        <div className="text-gray-900 font-bold text-base leading-none">{value}</div>
        <div className="text-gray-500 text-[11px] mt-0.5">{label}</div>
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

      const seen = new Set<string>();
      const combined: UserRecord[] = [];

      for (const c of (compData.cards ?? [])) {
        const email: string = c.userId ?? "";
        if (!email || seen.has(email)) continue;
        seen.add(email);
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
        if (!email || seen.has(email)) continue;
        seen.add(email);
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
      <div className="bg-gray-900 px-6 py-5">
        <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-1">Admin</p>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-extrabold text-white mb-0.5">Users</h1>
            <p className="text-sm text-gray-400">
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
              { label: "Total Users", value: users.length, icon: <User size={16} />, color: "text-yellow-500" },
              { label: "Companies", value: compCount, icon: <Building2 size={16} />, color: "text-blue-500" },
              { label: "Professionals", value: proCount, icon: <UserCircle size={16} />, color: "text-purple-500" },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200 shadow-sm flex items-center gap-2 sm:gap-3">
                <div className={`${s.color} hidden sm:block`}>{s.icon}</div>
                <div>
                  <div className="text-gray-900 font-bold text-base sm:text-lg leading-none">{s.value}</div>
                  <div className="text-gray-500 text-[10px] sm:text-xs mt-0.5 leading-tight">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email or location…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 text-sm placeholder-gray-400 outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={13} />
              </button>
            )}
          </div>
          <div className="flex rounded-xl overflow-hidden border border-gray-200 bg-white">
            {(["all", "company", "professional"] as const).map(t => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-4 py-2.5 text-xs font-semibold transition-all ${
                  typeFilter === t ? "bg-yellow-400 text-black" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {t === "all" ? "All" : t === "company" ? "Companies" : "Professionals"}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-8 h-8 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3 text-gray-400">
              <p className="text-sm">{error}</p>
              <button onClick={() => load()} className="text-yellow-500 text-sm hover:underline">Retry</button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-2 text-gray-400">
              <User size={32} className="opacity-30" />
              <p className="text-sm">{search ? "No users match your search" : "No users found"}</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-3 py-3 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">#</th>
                      <th className="px-3 py-3 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-3 py-3 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Email</th>
                      <th className="px-3 py-3 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Location</th>
                      <th className="px-3 py-3 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-3 py-3 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Review</th>
                      <th className="px-3 py-3 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Registered</th>
                      <th className="px-3 py-3 text-center text-[11px] font-bold text-gray-500 uppercase tracking-wider">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginated.map((u, i) => (
                      <tr
                        key={u.email}
                        onClick={() => setSelected(u)}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <td className="px-3 py-3 text-gray-400 text-xs hidden sm:table-cell">{(page - 1) * PAGE_SIZE + i + 1}</td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg flex-shrink-0 overflow-hidden bg-yellow-50 border border-yellow-100 flex items-center justify-center">
                              {u.headerLogo || u.previewImage
                                ? <img src={u.headerLogo || u.previewImage} alt="" className="w-full h-full object-cover"
                                    onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                                : <span className="text-yellow-500 text-[11px] font-bold">{u.displayName.charAt(0).toUpperCase()}</span>
                              }
                            </div>
                            <div className="min-w-0">
                              <div className="text-gray-900 font-medium text-xs truncate max-w-[120px] sm:max-w-[160px]">{u.displayName}</div>
                              <div className="text-gray-400 text-[10px] truncate max-w-[120px] md:hidden">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-gray-500 text-xs hidden md:table-cell max-w-[160px] truncate">{u.email}</td>
                        <td className="px-3 py-3 text-gray-500 text-xs hidden lg:table-cell">{u.location ?? "—"}</td>
                        <td className="px-3 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            u.type === "company" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                          }`}>
                            {u.type === "company" ? <Building2 size={10} /> : <UserCircle size={10} />}
                            <span className="hidden sm:inline">{u.type === "company" ? "Company" : "Professional"}</span>
                          </span>
                        </td>
                        <td className="px-3 py-3 hidden sm:table-cell"><ReviewBadge status={u.reviewStatus} /></td>
                        <td className="px-3 py-3 text-gray-500 text-xs whitespace-nowrap hidden lg:table-cell">{fmtDate(u.createdAt)}</td>
                        <td className="px-3 py-3 text-center">
                          <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-yellow-100 text-gray-400 hover:text-yellow-600 transition-all mx-auto">
                            <ChevronRight size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
                  <span className="text-xs text-gray-500">
                    Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-gray-200 hover:bg-gray-100 text-gray-600 disabled:opacity-30 transition-all"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <span className="text-xs text-gray-500 px-2">{page} / {totalPages}</span>
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-gray-200 hover:bg-gray-100 text-gray-600 disabled:opacity-30 transition-all"
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
          onDeleted={(email) => {
            setUsers(prev => prev.filter(u => u.email !== email));
            setSelected(null);
          }}
          onStatusChanged={(email, status) => {
            setUsers(prev => prev.map(u => u.email === email ? { ...u, reviewStatus: status } : u));
          }}
        />
      )}
    </div>
  );
}
