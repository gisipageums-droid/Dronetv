import { useState, useEffect, useCallback } from "react";
import { Search, ShieldCheck, Shield, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";
import { AUTH_API, LAMBDA } from "../../../lib/apiConfig";

const USERS_API = AUTH_API ? `${AUTH_API}/admin/users` : `${LAMBDA.auth}/admin/users`;
const ROLE_API = (userId: string) => AUTH_API ? `${AUTH_API}/admin/users/${userId}/role` : `${LAMBDA.auth}/admin/users/${userId}/role`;

const PAGE_SIZE = 25;

function adminAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("adminToken");
  return token ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };
}

interface StaffUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
  isAdmin: boolean;
}

const ROLE_GROUPS: { label: string; roles: { value: string; label: string }[] }[] = [
  {
    label: "Admin Tier",
    roles: [
      { value: "super_admin", label: "Super Administrator" },
      { value: "admin", label: "Administrator" },
    ],
  },
  {
    label: "Staff (scoped)",
    roles: [
      { value: "support", label: "Operations & Support" },
      { value: "sales", label: "Sales Manager" },
      { value: "marketing", label: "Marketing Manager" },
      { value: "media_editor", label: "Media Editor" },
      { value: "video_producer", label: "Video Producer" },
      { value: "brand_promotion", label: "Brand Promotion Manager" },
      { value: "event_manager", label: "Event Manager" },
      { value: "hr", label: "Recruiter / HR" },
    ],
  },
  {
    label: "Business / Other",
    roles: [
      { value: "user", label: "User" },
      { value: "company", label: "Company" },
      { value: "professional", label: "Professional" },
      { value: "event_organizer", label: "Event Organizer" },
    ],
  },
];

const ROLE_LABEL = Object.fromEntries(
  ROLE_GROUPS.flatMap(g => g.roles).map(r => [r.value, r.label])
);

export default function StaffManagement() {
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const fetchUsers = useCallback((signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    const offset = (page - 1) * PAGE_SIZE;
    const url = `${USERS_API}?limit=${PAGE_SIZE}&offset=${offset}${search ? `&search=${encodeURIComponent(search)}` : ""}`;
    fetch(url, { headers: adminAuthHeaders(), signal })
      .then(res => {
        if (res.status === 403) throw new Error("Super Admin access required");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        setUsers(data.users || []);
        setTotalCount(data.totalCount || 0);
      })
      .catch(err => {
        if (err.name !== "AbortError") setError(err.message || "Failed to load users");
      })
      .finally(() => setLoading(false));
  }, [search, page]);

  // Debounce the search; jump back to page 1 whenever the term changes.
  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    const controller = new AbortController();
    const t = setTimeout(() => fetchUsers(controller.signal), 300);
    return () => { clearTimeout(t); controller.abort(); };
  }, [fetchUsers]);

  const handleRoleChange = async (user: StaffUser, newRole: string) => {
    if (newRole === user.role) return;
    setSavingId(user.id);
    try {
      const res = await fetch(ROLE_API(user.id), {
        method: "PUT",
        headers: adminAuthHeaders(),
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || `HTTP ${res.status}`);
      }
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: newRole, isAdmin: newRole === "super_admin" || newRole === "admin" } : u));
      toast.success(`${user.email} is now ${ROLE_LABEL[newRole] || newRole}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to update role");
    } finally {
      setSavingId(null);
    }
  };

  const rangeStart = totalCount === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, totalCount);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-ink flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-brand-gold" /> Staff &amp; Roles
        </h1>
        <p className="text-sm text-ink-caption mt-1">
          Super Admin only. Assign staff roles - only Super Admin and Administrator get full admin-panel access; other staff roles are scoped to their own area as those areas get built.
        </p>
      </div>

      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-caption" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full pl-9 pr-3 py-2 border border-ink-light rounded-lg text-sm focus:outline-none focus:border-brand-yellow"
        />
      </div>

      {error && (
        <div className="p-4 mb-4 rounded-lg bg-status-error/10 text-status-error text-sm">{error}</div>
      )}

      <div className="bg-surface-card border border-ink-light rounded-xl overflow-hidden">
        <div className="px-4 py-2 border-b border-ink-light text-xs text-ink-caption">
          {loading
            ? "Loading…"
            : totalCount === 0
              ? "No users"
              : `Showing ${rangeStart}–${rangeEnd} of ${totalCount} user${totalCount !== 1 ? "s" : ""}`}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-ink-light text-left text-xs text-ink-caption uppercase tracking-wide bg-surface-main">
                <th className="px-4 py-2.5 font-semibold">Name</th>
                <th className="px-4 py-2.5 font-semibold">Email</th>
                <th className="px-4 py-2.5 font-semibold">Current Role</th>
                <th className="px-4 py-2.5 font-semibold">Assign Role</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-ink-caption text-sm">Loading…</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-ink-caption text-sm">No users found</td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id} className="border-b border-ink-light last:border-0 hover:bg-surface-main transition-colors">
                    <td className="px-4 py-2.5 text-ink whitespace-nowrap">{user.fullName || "—"}</td>
                    <td className="px-4 py-2.5 text-ink-caption">{user.email}</td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${user.isAdmin ? "bg-status-success/15 text-status-success" : "bg-ink-offwhite text-ink-paragraph"}`}>
                        {user.isAdmin && <Shield className="h-3 w-3" />}
                        {ROLE_LABEL[user.role] || user.role || "user"}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <select
                        value={user.role}
                        disabled={savingId === user.id}
                        onChange={e => handleRoleChange(user, e.target.value)}
                        className="border border-ink-light rounded-lg px-2 py-1 text-xs bg-surface-card focus:outline-none focus:border-brand-yellow disabled:opacity-50"
                      >
                        {ROLE_GROUPS.map(group => (
                          <optgroup key={group.label} label={group.label}>
                            {group.roles.map(r => (
                              <option key={r.value} value={r.value}>{r.label}</option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-ink-light text-sm">
            <button
              type="button"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-ink-light text-ink-paragraph hover:bg-surface-main transition-colors disabled:opacity-40 disabled:pointer-events-none"
            >
              <ChevronLeft className="h-4 w-4" /> Prev
            </button>
            <span className="text-ink-caption text-xs">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loading}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-ink-light text-ink-paragraph hover:bg-surface-main transition-colors disabled:opacity-40 disabled:pointer-events-none"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
