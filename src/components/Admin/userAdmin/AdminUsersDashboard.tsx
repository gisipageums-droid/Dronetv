import { useState, useEffect, useCallback } from "react";
import { Search, RotateCcw, Mail, User, ChevronLeft, ChevronRight, X, Building2, UserCircle } from "lucide-react";
import { toast } from "react-toastify";

const COMPANIES_API = "https://v1lqhhm1ma.execute-api.ap-south-1.amazonaws.com/prod/dashboard-cards?viewType=admin";
const PROFESSIONALS_API = "https://zgkue3u9cl.execute-api.ap-south-1.amazonaws.com/prod/professional-dashboard-cards?viewType=admin";
const FORGOT_PASSWORD_API = "https://ly8r7e8131.execute-api.ap-south-1.amazonaws.com/dev/forgot";

interface UserRecord {
  email: string;
  displayName: string;
  type: "company" | "professional";
  location?: string;
  status?: boolean;
  createdAt?: string;
}

const PAGE_SIZE = 15;

export default function AdminUsersDashboard() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [filtered, setFiltered] = useState<UserRecord[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "company" | "professional">("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resetting, setResetting] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState<UserRecord | null>(null);

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
          status: c.status,
          createdAt: c.createdAt,
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
    if (q) list = list.filter(u => u.displayName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.location ?? "").toLowerCase().includes(q));
    setFiltered(list);
    setPage(1);
  }, [search, typeFilter, users]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const sendReset = async (user: UserRecord) => {
    setResetting(user.email);
    setConfirmReset(null);
    try {
      const res = await fetch(FORGOT_PASSWORD_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });
      if (res.ok) {
        toast.success(`Password reset email sent to ${user.email}`);
      } else {
        const d = await res.json();
        toast.error(d.error || d.message || "Failed to send reset email");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setResetting(null);
    }
  };

  const displayDate = (u: UserRecord) => {
    if (!u.createdAt) return "—";
    try { return new Date(u.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); }
    catch { return u.createdAt; }
  };

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
        <button
          onClick={() => load()}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-sm transition-all disabled:opacity-40"
        >
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
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/25 outline-none focus:border-yellow-400/60 transition-all"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">
              <X size={13} />
            </button>
          )}
        </div>
        <div className="flex rounded-xl overflow-hidden border border-white/10">
          {(["all", "company", "professional"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-4 py-2.5 text-xs font-semibold capitalize transition-all ${
                typeFilter === t
                  ? "bg-yellow-400 text-black"
                  : "bg-white/5 text-white/50 hover:text-white hover:bg-white/10"
              }`}
            >
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
                    <th className="px-4 py-3 text-left text-[11px] font-bold text-white/40 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold text-white/40 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold text-white/40 uppercase tracking-wider">Registered</th>
                    <th className="px-4 py-3 text-center text-[11px] font-bold text-white/40 uppercase tracking-wider">Reset Password</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((u, i) => (
                    <tr key={u.email} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                      <td className="px-4 py-3 text-white/30 text-xs">{(page - 1) * PAGE_SIZE + i + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-yellow-400/15 flex items-center justify-center flex-shrink-0">
                            <span className="text-yellow-400 text-[11px] font-bold">
                              {u.displayName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-white font-medium truncate max-w-[160px]">{u.displayName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-white/50 text-xs truncate max-w-[180px]">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          u.type === "company"
                            ? "bg-blue-400/10 text-blue-400"
                            : "bg-purple-400/10 text-purple-400"
                        }`}>
                          {u.type === "company" ? <Building2 size={10} /> : <UserCircle size={10} />}
                          {u.type === "company" ? "Company" : "Professional"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block w-2 h-2 rounded-full ${u.status ? "bg-green-400" : "bg-red-400"}`} />
                      </td>
                      <td className="px-4 py-3 text-white/50 text-xs whitespace-nowrap">{displayDate(u)}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => setConfirmReset(u)}
                          disabled={resetting === u.email}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-400 text-xs font-semibold transition-all disabled:opacity-40"
                        >
                          {resetting === u.email ? (
                            <span className="w-3 h-3 border border-yellow-400/40 border-t-yellow-400 rounded-full animate-spin" />
                          ) : (
                            <Mail size={12} />
                          )}
                          Send Reset
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

      {/* Confirm reset modal */}
      {confirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm rounded-2xl p-6 shadow-2xl" style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-yellow-400/15 flex items-center justify-center">
                <Mail size={18} className="text-yellow-400" />
              </div>
              <div>
                <h3 className="text-white font-bold text-base">Send Password Reset?</h3>
                <p className="text-white/40 text-xs mt-0.5">A reset link will be emailed to the user</p>
              </div>
            </div>
            <div className="mb-5 p-3 rounded-xl bg-white/5 border border-white/8">
              <p className="text-white text-sm font-medium truncate">{confirmReset.displayName}</p>
              <p className="text-white/50 text-xs mt-0.5 truncate">{confirmReset.email}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setConfirmReset(null)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 text-sm font-semibold transition-all">
                Cancel
              </button>
              <button onClick={() => sendReset(confirmReset)}
                className="flex-1 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black text-sm font-bold transition-all">
                Send Reset Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
