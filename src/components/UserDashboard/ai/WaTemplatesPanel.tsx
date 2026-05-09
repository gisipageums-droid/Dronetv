import React, { useState, useEffect, useCallback } from "react";
import {
  LayoutTemplate,
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
import { waTemplatesApi, type WaTemplate } from "./echoleadsApi";

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

// ---------- Category Badge ----------
function CategoryBadge({ category }: { category: string }) {
  const cfg: Record<string, string> = {
    MARKETING: "bg-amber-100 text-amber-700",
    UTILITY: "bg-blue-100 text-blue-700",
    AUTHENTICATION: "bg-green-100 text-green-700",
  };
  const cls = cfg[category?.toUpperCase()] ?? "bg-gray-100 text-gray-500";
  return (
    <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full ${cls}`}>
      {category || "—"}
    </span>
  );
}

// ---------- Status Badge ----------
function StatusBadge({ status }: { status?: string }) {
  if (!status) return null;
  const cfg: Record<string, { bg: string; dot: string }> = {
    APPROVED: { bg: "bg-green-100 text-green-700", dot: "bg-green-500" },
    PENDING: { bg: "bg-amber-100 text-amber-700", dot: "bg-amber-500" },
    REJECTED: { bg: "bg-red-100 text-red-700", dot: "bg-red-500" },
  };
  const s = cfg[status?.toUpperCase()] ?? { bg: "bg-gray-100 text-gray-500", dot: "bg-gray-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ${s.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

// ---------- Template Modal ----------
interface TemplateModalProps {
  initial?: WaTemplate | null;
  onClose: () => void;
  onSaved: () => void;
  addToast: (type: ToastType, text: string) => void;
}

const CATEGORIES = ["MARKETING", "UTILITY", "AUTHENTICATION"];
const LANGUAGES = ["en_US", "hi", "es", "fr", "pt_BR", "ar", "de", "it"];

function TemplateModal({ initial, onClose, onSaved, addToast }: TemplateModalProps) {
  const isEdit = !!initial;
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    category: initial?.category ?? "MARKETING",
    language: initial?.language ?? "en_US",
    header: initial?.header ?? "",
    body: initial?.body ?? "",
    footer: initial?.footer ?? "",
  });

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.body.trim()) {
      addToast("error", "Body is required.");
      return;
    }
    setSaving(true);
    try {
      if (isEdit && initial) {
        await waTemplatesApi.update(initial.id, form);
        addToast("success", "Template updated.");
      } else {
        await waTemplatesApi.create(form);
        addToast("success", "Template created.");
      }
      onSaved();
      onClose();
    } catch {
      addToast("error", isEdit ? "Failed to update template." : "Failed to create template.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">
            {isEdit ? "Edit Template" : "New Template"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Template Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. order_confirmation"
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Language</label>
              <select
                value={form.language}
                onChange={(e) => set("language", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
              >
                {LANGUAGES.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Header</label>
            <input
              type="text"
              value={form.header}
              onChange={(e) => set("header", e.target.value)}
              placeholder="Header text (optional)"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Body *</label>
            <textarea
              value={form.body}
              onChange={(e) => set("body", e.target.value)}
              rows={4}
              placeholder="Message body — use {{1}}, {{2}} for variables"
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Footer</label>
            <input
              type="text"
              value={form.footer}
              onChange={(e) => set("footer", e.target.value)}
              placeholder="Footer text (optional)"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
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
            onClick={() => {
              const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
              handleSubmit(fakeEvent);
            }}
            disabled={saving}
            className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-white text-sm font-semibold rounded-lg px-4 py-2 disabled:opacity-50 transition-colors"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
            {isEdit ? "Save Changes" : "Create Template"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Main Component ----------
export default function WaTemplatesPanel() {
  if (!localStorage.getItem("echoleads_api_key")) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20 text-gray-400">
        <p className="text-sm font-medium">Not connected</p>
        <p className="text-xs mt-1">Go to Authentication tab first.</p>
      </div>
    );
  }

  const [templates, setTemplates] = useState<WaTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<WaTemplate | null>(null);
  const [deletingId, setDeletingId] = useState<number | string | null>(null);
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
      const res = await waTemplatesApi.sync();
      setTemplates(res.data.templates ?? []);
    } catch {
      addToast("error", "Failed to load templates.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSync() {
    setSyncing(true);
    try {
      const res = await waTemplatesApi.sync();
      setTemplates(res.data.templates ?? []);
      addToast("success", res.data.message || "Templates synced from Meta.");
    } catch {
      addToast("error", "Sync failed.");
    } finally {
      setSyncing(false);
    }
  }

  async function handleDelete(id: number | string) {
    if (!confirm("Delete this template? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await waTemplatesApi.delete(id);
      addToast("success", "Template deleted.");
      setTemplates((prev) => prev.filter((t) => t.id !== id));
    } catch {
      addToast("error", "Failed to delete template.");
    } finally {
      setDeletingId(null);
    }
  }

  const filtered = templates.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  function formatDate(iso?: string) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

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
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search templates…"
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
          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-2 px-4 py-2 border border-amber-300 text-amber-700 text-sm font-semibold rounded-lg hover:bg-amber-50 disabled:opacity-50 transition-colors"
          >
            {syncing ? <Loader2 size={15} className="animate-spin" /> : <RefreshCw size={15} />}
            Sync from Meta
          </button>
          <button
            onClick={() => { setEditing(null); setShowModal(true); }}
            className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-white text-sm font-semibold rounded-lg px-4 py-2 transition-colors"
          >
            <Plus size={16} />
            New Template
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
            <LayoutTemplate size={36} className="mb-3 opacity-30" />
            <p className="text-sm font-medium">
              {search ? "No templates match your search" : "No templates yet"}
            </p>
            <p className="text-xs mt-1">
              {search ? "Try a different name." : "Sync from Meta or create a new template."}
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((t) => (
              <div
                key={t.id}
                className="bg-white border border-gray-100 rounded-xl p-4 hover:border-amber-200 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{t.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatDate(t.created_at)}</p>
                  </div>
                  {t.status && <StatusBadge status={t.status} />}
                </div>

                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <CategoryBadge category={t.category} />
                  <span className="text-xs text-gray-400 font-medium">{t.language}</span>
                </div>

                {t.body && (
                  <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">
                    {t.body.length > 80 ? t.body.slice(0, 80) + "…" : t.body}
                  </p>
                )}

                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => { setEditing(t); setShowModal(true); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-amber-50 text-gray-600 hover:text-amber-700 text-xs font-semibold rounded-lg transition-colors"
                  >
                    <Pencil size={12} />
                    Edit
                  </button>
                  <div className="flex-1" />
                  <button
                    onClick={() => handleDelete(t.id)}
                    disabled={deletingId === t.id}
                    className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    {deletingId === t.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <TemplateModal
          initial={editing}
          onClose={() => { setShowModal(false); setEditing(null); }}
          onSaved={load}
          addToast={addToast}
        />
      )}
    </div>
  );
}
