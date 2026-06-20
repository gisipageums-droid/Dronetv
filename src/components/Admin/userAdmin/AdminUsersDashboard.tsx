import { useState, useEffect, useCallback } from "react";
import {
  Search, RotateCcw, User, ChevronLeft, ChevronRight, X,
  Building2, UserCircle, ExternalLink, CheckCircle, XCircle,
  MapPin, Briefcase, Star, Eye, Calendar, BarChart2, ChevronRight as Arrow,
} from "lucide-react";

const COMPANIES_API = "https://v1lqhhm1ma.execute-api.ap-south-1.amazonaws.com/prod/dashboard-cards?viewType=admin";
const PROFESSIONALS_API = "https://zgkue3u9cl.execute-api.ap-south-1.amazonaws.com/prod/professional-dashboard-cards?viewType=admin";

interface UserRecord {
  email: string;
  displayName: string;
  type: "company" | "professional";
  // common
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
  // company-specific
  sectors?: string[];
  servicesCount?: number;
  productsCount?: number;
  // professional-specific
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
    approved: "bg-green-400/10 text-green-400",
    pending: "bg-yellow-400/10 text-yellow-400",
    rejected: "bg-red-400/10 text-red-400",
    under_review: "bg-blue-400/10 text-blue-400",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize ${cfg[s] ?? "bg-white/10 text-white/40"}`}>
      {s.replace("_", " ")}
    </span>
  );
}

function DetailDrawer({ user, onClose }: { user: UserRecord; onClose: () => void }) {
  const image = user.headerLogo || user.previewImage;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md h-full overflow-y-auto shadow-2xl"
        style={{ background: "#0f172a", borderLeft: "1px solid rgba(255,255,255,0.08)" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b border-white/8" style={{ background: "#0f172a" }}>
          <h2 className="text-white font-bold text-base">User Details</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all">
            <X size={15} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Profile header */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl flex-shrink-0 overflow-hidden bg-yellow-400/10 flex items-center justify-center">
              {image
                ? <img src={image} alt="" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                : <span className="text-yellow-400 text-2xl font-black">{user.displayName.charAt(0).toUpperCase()}</span>
              }
            </div>
            <div className="min-w-0">
              <div className="text-white font-bold text-base truncate">{user.displayName}</div>
              {user.userName && <div className="text-white/40 text-xs mt-0.5">@{user.userName}</div>}
              <div className="text-white/50 text-xs mt-1 truncate">{user.email}</div>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                  user.type === "company" ? "bg-blue-400/10 text-blue-400" : "bg-purple-400/10 text-purple-400"
                }`}>
                  {user.type === "company" ? <Building2 size={10} /> : <UserCircle size={10} />}
                  {user.type === "company" ? "Company" : "Professional"}
                </span>
                <ReviewBadge status={user.reviewStatus} />
              </div>
            </div>
          </div>

          {/* Description */}
          {user.description && (
            <div className="p-3 rounded-xl bg-white/5 border border-white/8">
              <p className="text-white/60 text-xs leading-relaxed">{user.description}</p>
            </div>
          )}

          {/* Info grid */}
          <div className="space-y-2">
            <h3 className="text-[11px] font-bold text-white/30 uppercase tracking-wider">Details</h3>
            <div className="rounded-xl overflow-hidden border border-white/8" style={{ background: "#1e293b" }}>
              {[
                { icon: <MapPin size={13} />, label: "Location", value: user.location },
                { icon: <Calendar size={13} />, label: "Registered", value: fmtDate(user.createdAt) },
                { icon: <Calendar size={13} />, label: "Published", value: fmtDate(user.publishedDate) },
                { icon: <Eye size={13} />, label: "Last Activity", value: fmtDate(user.lastActivity) },
                { icon: <Star size={13} />, label: "Template", value: user.templateSelection?.replace("-", " ").replace(/\b\w/g, c => c.toUpperCase()) },
                { icon: <BarChart2 size={13} />, label: "Completion", value: user.completionPercentage != null ? `${user.completionPercentage}%` : undefined },
              ].filter(r => r.value && r.value !== "—").map((row, i, arr) => (
                <div key={row.label} className={`flex items-center gap-3 px-4 py-3 ${i < arr.length - 1 ? "border-b border-white/5" : ""}`}>
                  <span className="text-white/30 flex-shrink-0">{row.icon}</span>
                  <span className="text-white/40 text-xs w-24 flex-shrink-0">{row.label}</span>
                  <span className="text-white text-xs font-medium">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sectors / Categories */}
          {((user.sectors && user.sectors.length > 0) || (user.categories && user.categories.length > 0)) && (
            <div className="space-y-2">
              <h3 className="text-[11px] font-bold text-white/30 uppercase tracking-wider">
                {user.type === "company" ? "Sectors" : "Categories"}
              </h3>
              <div className="flex flex-wrap gap-2">
                {(user.sectors ?? user.categories ?? []).map(s => (
                  <span key={s} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/60 text-xs">{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="space-y-2">
            <h3 className="text-[11px] font-bold text-white/30 uppercase tracking-wider">Stats</h3>
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

          {/* Status flags */}
          <div className="space-y-2">
            <h3 className="text-[11px] font-bold text-white/30 uppercase tracking-wider">Status</h3>
            <div className="rounded-xl overflow-hidden border border-white/8" style={{ background: "#1e293b" }}>
              {[
                { label: "Active", value: user.status },
                { label: "Approved", value: user.isApproved },
                { label: "Visible", value: user.isVisible },
              ].map((f, i) => (
                <div key={f.label} className={`flex items-center justify-between px-4 py-3 ${i < 2 ? "border-b border-white/5" : ""}`}>
                  <span className="text-white/50 text-xs">{f.label}</span>
                  {f.value
                    ? <CheckCircle size={14} className="text-green-400" />
                    : <XCircle size={14} className="text-red-400" />
                  }
                </div>
              ))}
            </div>
          </div>

          {/* Profile link */}
          {user.cleanUrl && (
            <a
              href={user.cleanUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-yellow-400/10 hover:bg-yellow-400/15 border border-yellow-400/20 transition-all"
            >
              <span className="text-yellow-400 text-sm font-semibold">View Live Profile</span>
              <ExternalLink size={14} className="text-yellow-400" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl p-3 border border-white/8 flex items-center gap-3" style={{ background: "#0f172a" }}>
      <div className="text-yellow-400">{icon}</div>
      <div>
        <div className="text-white font-bold text-base leading-none">{value}</div>
        <div className="text-white/40 text-[11px] mt-0.5">{label}</div>
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
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">Users</h1>
          <p className="text-sm text-white/40 mt-0.5">
            {loading ? "Loading..." : `${users.length} registered user${users.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <button onClick={() => load()} disabled={loading}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-sm transition-all disabled:opacity-40">
          <RotateCcw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      {!loading && !error && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total", value: users.length, icon: <User size={15} /> },
            { label: "Companies", value: compCount, icon: <Building2 size={15} /> },
            { label: "Professionals", value: proCount, icon: <UserCircle size={15} /> },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-4 border border-white/8 flex items-center gap-3" style={{ background: "#1e293b" }}>
              <div className="text-yellow-400">{s.icon}</div>
              <div>
                <div className="text-white font-bold text-lg leading-none">{s.value}</div>
                <div className="text-white/40 text-xs mt-0.5">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input type="text" placeholder="Search by name, email or location…" value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/25 outline-none focus:border-yellow-400/60 transition-all" />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">
              <X size={13} />
            </button>
          )}
        </div>
        <div className="flex rounded-xl overflow-hidden border border-white/10">
          {(["all", "company", "professional"] as const).map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`px-4 py-2.5 text-xs font-semibold transition-all ${
                typeFilter === t ? "bg-yellow-400 text-black" : "bg-white/5 text-white/50 hover:text-white hover:bg-white/10"
              }`}>
              {t === "all" ? "All" : t === "company" ? "Companies" : "Professionals"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden border border-white/8" style={{ background: "#1e293b" }}>
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3 text-white/40">
            <p className="text-sm">{error}</p>
            <button onClick={() => load()} className="text-yellow-400 text-sm hover:underline">Retry</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-2 text-white/40">
            <User size={32} className="opacity-30" />
            <p className="text-sm">{search ? "No users match your search" : "No users found"}</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8" style={{ background: "#0f172a" }}>
                    <th className="px-4 py-3 text-left text-[11px] font-bold text-white/40 uppercase tracking-wider">#</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold text-white/40 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold text-white/40 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold text-white/40 uppercase tracking-wider">Location</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold text-white/40 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold text-white/40 uppercase tracking-wider">Review</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold text-white/40 uppercase tracking-wider">Registered</th>
                    <th className="px-4 py-3 text-center text-[11px] font-bold text-white/40 uppercase tracking-wider">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((u, i) => (
                    <tr key={u.email} onClick={() => setSelected(u)}
                      className="border-b border-white/5 hover:bg-white/[0.04] cursor-pointer transition-colors">
                      <td className="px-4 py-3 text-white/30 text-xs">{(page - 1) * PAGE_SIZE + i + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg flex-shrink-0 overflow-hidden bg-yellow-400/10 flex items-center justify-center">
                            {u.headerLogo || u.previewImage
                              ? <img src={u.headerLogo || u.previewImage} alt="" className="w-full h-full object-cover"
                                  onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                              : <span className="text-yellow-400 text-[11px] font-bold">{u.displayName.charAt(0).toUpperCase()}</span>
                            }
                          </div>
                          <span className="text-white font-medium truncate max-w-[140px]">{u.displayName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-white/50 text-xs truncate max-w-[160px]">{u.email}</td>
                      <td className="px-4 py-3 text-white/50 text-xs truncate max-w-[120px]">{u.location ?? "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          u.type === "company" ? "bg-blue-400/10 text-blue-400" : "bg-purple-400/10 text-purple-400"
                        }`}>
                          {u.type === "company" ? <Building2 size={10} /> : <UserCircle size={10} />}
                          {u.type === "company" ? "Company" : "Professional"}
                        </span>
                      </td>
                      <td className="px-4 py-3"><ReviewBadge status={u.reviewStatus} /></td>
                      <td className="px-4 py-3 text-white/50 text-xs whitespace-nowrap">{fmtDate(u.createdAt)}</td>
                      <td className="px-4 py-3 text-center">
                        <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 hover:bg-yellow-400/10 text-white/30 hover:text-yellow-400 transition-all mx-auto">
                          <Arrow size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-white/8">
                <span className="text-xs text-white/30">
                  Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                </span>
                <div className="flex items-center gap-1">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white/60 disabled:opacity-30 transition-all">
                    <ChevronLeft size={14} />
                  </button>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white/60 disabled:opacity-30 transition-all">
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {selected && <DetailDrawer user={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
