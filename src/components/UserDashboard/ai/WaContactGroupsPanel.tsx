import React, { useState, useEffect, useCallback } from "react";
import {
  UsersRound,
  Plus,
  Pencil,
  Trash2,
  Search,
  RefreshCw,
  X,
  Loader2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { contactGroupsApi, type ContactGroup } from "./echoleadsApi";

// ---------- Toast ----------
type ToastType = "success" | "error";
interface ToastMsg { id: number; type: ToastType; text: string }

function Toast({ toasts, dismiss }: { toasts: ToastMsg[]; dismiss: (id: number) => void }) {
  return (
    <div className="fixed top-5 right-5 z-[200] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium pointer-events-auto transition-all ${
            t.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {t.type === "success" ? (
            <CheckCircle2 size={16} className="text-green-600 shrink-0" />
          ) : (
            <AlertTriangle size={16} className="text-red-500 shrink-0" />
          )}
          <span>{t.text}</span>
          <button onClick={() => dismiss(t.id)} className="ml-2 opacity-50 hover:opacity-100">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

// ---------- Group Modal ----------
interface GroupModalProps {
  initial?: ContactGroup | null;
  onClose: () => void;
  onSaved: () => void;
  addToast: (type: ToastType, text: string) => void;
}

function GroupModal({ initial, onClose, onSaved, addToast }: GroupModalProps) {
  const isEdit = !!initial;
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    contact_ids_raw: initial?.contact_ids?.join(", ") ?? "",
  });

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      addToast("error", "Title is required.");
      return;
    }

    const contact_ids = form.contact_ids_raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map(Number)
      .filter((n) => !isNaN(n));

    const payload = {
      title: form.title.trim(),
      ...(form.description.trim() && { description: form.description.trim() }),
      ...(contact_ids.length > 0 && { contact_ids }),
    };

    setSaving(true);
    try {
      if (isEdit && initial) {
        await contactGroupsApi.update(initial.id, payload);
        addToast("success", "Group updated.");
      } else {
        await contactGroupsApi.create(payload);
        addToast("success", "Group created.");
      }
      onSaved();
      onClose();
    } catch {
      addToast("error", isEdit ? "Failed to update group." : "Failed to create group.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">
            {isEdit ? "Edit Group" : "New Contact Group"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. VIP Customers"
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Description</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Short description (optional)"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Contact IDs, comma-separated
            </label>
            <textarea
              value={form.contact_ids_raw}
              onChange={(e) => set("contact_ids_raw", e.target.value)}
              rows={3}
              placeholder="1, 2, 3, 45"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
            />
          </div>
        </form>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e as unknown as React.FormEvent)}
            disabled={saving}
            className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-white text-sm font-semibold rounded-lg px-4 py-2 disabled:opacity-50 transition-colors"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
            {isEdit ? "Save Changes" : "Create Group"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Main Component ----------
export default function WaContactGroupsPanel() {
  if (!localStorage.getItem("echoleads_api_key")) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20 text-gray-400">
        <p className="text-sm font-medium">Not connected</p>
        <p className="text-xs mt-1">Go to Authentication tab first.</p>
      </div>
    );
  }

  const [groups, setGroups] = useState<ContactGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<ContactGroup | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const toastCounter = React.useRef(0);

  function addToast(type: ToastType, text: string) {
    const id = ++toastCounter.current + Date.now();
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }

  function dismissToast(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await contactGroupsApi.list();
      setGroups(res.data.contactGroup ?? []);
    } catch {
      addToast("error", "Failed to load contact groups.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function toggleSelect(id: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((g) => g.id)));
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this contact group? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await contactGroupsApi.delete(id);
      addToast("success", "Group deleted.");
      setGroups((prev) => prev.filter((g) => g.id !== id));
      setSelected((prev) => { const n = new Set(prev); n.delete(id); return n; });
    } catch {
      addToast("error", "Failed to delete group.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleBulkDelete() {
    if (!confirm(`Delete ${selected.size} group(s)? This cannot be undone.`)) return;
    setBulkDeleting(true);
    try {
      await contactGroupsApi.bulkDelete(Array.from(selected));
      addToast("success", `${selected.size} group(s) deleted.`);
      setSelected(new Set());
      load();
    } catch {
      addToast("error", "Bulk delete failed.");
    } finally {
      setBulkDeleting(false);
    }
  }

  function formatDate(iso?: string) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  const filtered = groups.filter((g) =>
    g.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <Toast toasts={toasts} dismiss={dismissToast} />

      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between px-6 pt-5 pb-4">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setSelected(new Set()); }}
              placeholder="Search groups…"
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <button
            onClick={load}
            title="Refresh"
            className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:text-amber-500 hover:border-amber-200 transition-colors"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {selected.size > 0 && (
            <button
              onClick={handleBulkDelete}
              disabled={bulkDeleting}
              className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 text-sm font-semibold rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors"
            >
              {bulkDeleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
              Delete Selected ({selected.size})
            </button>
          )}
          <button
            onClick={() => { setEditing(null); setShowModal(true); }}
            className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-white text-sm font-semibold rounded-lg px-4 py-2 transition-colors"
          >
            <Plus size={16} />
            New Group
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <Loader2 size={24} className="animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <UsersRound size={36} className="mb-3 opacity-30" />
            <p className="text-sm font-medium">
              {search ? "No groups match your search" : "No contact groups yet"}
            </p>
            <p className="text-xs mt-1">
              {search ? "Try a different name." : "Create your first contact group."}
            </p>
          </div>
        ) : (
          <>
            {filtered.length > 1 && (
              <div className="flex items-center gap-2 mb-3">
                <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={selected.size === filtered.length && filtered.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded accent-amber-400"
                  />
                  Select all ({filtered.length})
                </label>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((g) => (
                <div
                  key={g.id}
                  className={`bg-white border rounded-xl p-4 hover:border-amber-200 hover:shadow-sm transition-all ${
                    selected.has(g.id) ? "border-amber-300 bg-amber-50/30" : "border-gray-100"
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <input
                      type="checkbox"
                      checked={selected.has(g.id)}
                      onChange={() => toggleSelect(g.id)}
                      className="mt-0.5 rounded accent-amber-400 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{g.title}</p>
                      {g.description && (
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{g.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <UsersRound size={12} className="text-amber-400" />
                      {g.contact_ids?.length ?? 0} contacts
                    </span>
                    <span>{formatDate(g.created_at)}</span>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => { setEditing(g); setShowModal(true); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-amber-50 text-gray-600 hover:text-amber-700 text-xs font-semibold rounded-lg transition-colors"
                    >
                      <Pencil size={12} />
                      Edit
                    </button>
                    <div className="flex-1" />
                    <button
                      onClick={() => handleDelete(g.id)}
                      disabled={deletingId === g.id}
                      className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      {deletingId === g.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {showModal && (
        <GroupModal
          initial={editing}
          onClose={() => { setShowModal(false); setEditing(null); }}
          onSaved={load}
          addToast={addToast}
        />
      )}
    </div>
  );
}
