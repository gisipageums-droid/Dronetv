import { useState, useEffect, useCallback } from "react";
import { Search, ShieldCheck, Shield } from "lucide-react";
import { toast } from "react-toastify";
import { AUTH_API, LAMBDA } from "../../../lib/apiConfig";

const USERS_API = AUTH_API ? `${AUTH_API}/admin/users` : `${LAMBDA.auth}/admin/users`;
const ROLE_API = (userId: string) => AUTH_API ? `${AUTH_API}/admin/users/${userId}/role` : `${LAMBDA.auth}/admin/users/${userId}/role`;

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const fetchUsers = useCallback((signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    const url = `${USERS_API}?limit=200${search ? `&search=${encodeURIComponent(search)}` : ""}`;
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

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-ink flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-brand-gold" /> Staff & Roles
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

      {loading ? (
        <div className="py-16 text-center text-ink-caption text-sm">Loading...</div>
      ) : (
        <div className="bg-surface-card border border-ink-light rounded-xl overflow-hidden">
          <div className="px-4 py-2 border-b border-ink-light text-xs text-ink-caption">
            {totalCount} user{totalCount !== 1 ? "s" : ""}
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-light text-left text-xs text-ink-caption uppercase tracking-wide">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Current Role</th>
                <th className="px-4 py-2">Assign Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b border-ink-light last:border-0 hover:bg-surface-main">
                  <td className="px-4 py-2 text-ink">{user.fullName || "—"}</td>
                  <td className="px-4 py-2 text-ink-caption">{user.email}</td>
                  <td className="px-4 py-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${user.isAdmin ? "bg-status-success/15 text-status-success" : "bg-ink-offwhite text-ink-paragraph"}`}>
                      {user.isAdmin && <Shield className="h-3 w-3" />}
                      {ROLE_LABEL[user.role] || user.role || "user"}
                    </span>
                  </td>
                  <td className="px-4 py-2">
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
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-ink-caption text-sm">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
