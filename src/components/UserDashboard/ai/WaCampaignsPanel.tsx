import React, { useState, useEffect, useCallback } from "react";
import {
  Megaphone,
  Plus,
  Search,
  RefreshCw,
  RefreshCcw,
  X,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { waCampaignsApi, type WaCampaign } from "./echoleadsApi";

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

// ---------- Status Badge ----------
const STATUS_MAP: Record<number, { label: string; bg: string; dot: string }> = {
  1: { label: "Draft", bg: "bg-gray-100 text-gray-500", dot: "bg-gray-400" },
  2: { label: "Running", bg: "bg-green-100 text-green-700", dot: "bg-green-500" },
  3: { label: "Completed", bg: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
  4: { label: "Failed", bg: "bg-red-100 text-red-700", dot: "bg-red-500" },
};

function StatusBadge({ status }: { status: number }) {
  const s = STATUS_MAP[status] ?? { label: String(status), bg: "bg-gray-100 text-gray-500", dot: "bg-gray-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ${s.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

// ---------- Create Campaign Modal ----------
interface CreateModalProps {
  onClose: () => void;
  onCreated: () => void;
  addToast: (type: ToastType, text: string) => void;
}

function CreateCampaignModal({ onClose, onCreated, addToast }: CreateModalProps) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    whatsapp_templates_id: "",
    contact_group: "",
    send_option: "instant",
    template_language: "en_US",
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

    const fd = new FormData();
    fd.append("title", form.title.trim());
    if (form.whatsapp_templates_id) fd.append("whatsapp_templates_id", form.whatsapp_templates_id);
    if (form.contact_group) fd.append("contact_group", form.contact_group);
    fd.append("send_option", form.send_option);
    fd.append("template_language", form.template_language);

    setSaving(true);
    try {
      await waCampaignsApi.create(fd);
      addToast("success", "Campaign created successfully.");
      onCreated();
      onClose();
    } catch {
      addToast("error", "Failed to create campaign.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">New Campaign</h2>
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
              placeholder="e.g. Diwali Promo"
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Template ID</label>
            <input
              type="number"
              value={form.whatsapp_templates_id}
              onChange={(e) => set("whatsapp_templates_id", e.target.value)}
              placeholder="WhatsApp template ID"
              min={1}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Contact Group ID</label>
            <input
              type="number"
              value={form.contact_group}
              onChange={(e) => set("contact_group", e.target.value)}
              placeholder="Contact group ID"
              min={1}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Send Option</label>
            <div className="flex gap-3">
              {(["instant", "schedule"] as const).map((opt) => (
                <label
                  key={opt}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer text-sm font-medium transition-colors ${
                    form.send_option === opt
                      ? "border-amber-400 bg-amber-50 text-amber-700"
                      : "border-gray-200 text-gray-600 hover:border-amber-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="wa_send_option"
                    value={opt}
                    checked={form.send_option === opt}
                    onChange={() => set("send_option", opt)}
                    className="accent-amber-400"
                  />
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Template Language</label>
            <input
              type="text"
              value={form.template_language}
              onChange={(e) => set("template_language", e.target.value)}
              placeholder="en_US"
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
            onClick={(e) => handleSubmit(e as unknown as React.FormEvent)}
            disabled={saving}
            className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-white text-sm font-semibold rounded-lg px-4 py-2 disabled:opacity-50 transition-colors"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
            Create Campaign
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Main Component ----------
interface Pagination {
  current_page: number;
  total_pages: number;
  total_campaigns: number;
  per_page: number;
}

export default function WaCampaignsPanel() {
  if (!localStorage.getItem("echoleads_api_key")) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20 text-gray-400">
        <p className="text-sm font-medium">Not connected</p>
        <p className="text-xs mt-1">Go to Authentication tab first.</p>
      </div>
    );
  }

  const [campaigns, setCampaigns] = useState<WaCampaign[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    current_page: 1,
    total_pages: 1,
    total_campaigns: 0,
    per_page: 10,
  });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [archivingId, setArchivingId] = useState<number | null>(null);
  const [reschedulingId, setReschedulingId] = useState<number | null>(null);
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
      const res = await waCampaignsApi.list(page, 10);
      setCampaigns(res.data.campaigns ?? []);
      if (res.data.pagination) setPagination(res.data.pagination);
    } catch {
      addToast("error", "Failed to load campaigns.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleArchiveToggle(id: number) {
    setArchivingId(id);
    try {
      await waCampaignsApi.archiveToggle(id);
      addToast("success", "Campaign archive status updated.");
      load();
    } catch {
      addToast("error", "Failed to update archive status.");
    } finally {
      setArchivingId(null);
    }
  }

  async function handleRescheduleFailed(id: number) {
    setReschedulingId(id);
    try {
      const res = await waCampaignsApi.rescheduleFailed(id);
      addToast("success", `Rescheduled ${res.data.rescheduled_count ?? 0} message(s).`);
      load();
    } catch {
      addToast("error", "Failed to reschedule.");
    } finally {
      setReschedulingId(null);
    }
  }

  function formatDate(iso: string) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  const filtered = campaigns.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
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
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search campaigns…"
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
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-white text-sm font-semibold rounded-lg px-4 py-2 transition-colors shrink-0"
        >
          <Plus size={16} />
          New Campaign
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <Loader2 size={24} className="animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Megaphone size={36} className="mb-3 opacity-30" />
            <p className="text-sm font-medium">
              {search ? "No campaigns match your search" : "No WA campaigns yet"}
            </p>
            <p className="text-xs mt-1">
              {search ? "Try a different title." : "Create your first WhatsApp campaign."}
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((c) => (
              <div
                key={c.id}
                className={`bg-white border rounded-xl p-4 hover:border-amber-200 hover:shadow-sm transition-all ${
                  c.is_archived ? "opacity-60" : "border-gray-100"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900 truncate">{c.title}</p>
                      {c.is_archived && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 shrink-0">
                          Archived
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{formatDate(c.created_at)}</p>
                  </div>
                  <StatusBadge status={c.status} />
                </div>

                <div className="flex items-center gap-3 mb-3 text-xs text-gray-500">
                  {c.template_name && (
                    <span className="truncate max-w-[120px]" title={c.template_name}>
                      {c.template_name}
                    </span>
                  )}
                  {c.number_of_contacts !== undefined && (
                    <span>{c.number_of_contacts} contacts</span>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-gray-100 flex-wrap">
                  <button
                    onClick={() => handleArchiveToggle(c.id)}
                    disabled={archivingId === c.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-amber-50 text-gray-600 hover:text-amber-700 text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                  >
                    {archivingId === c.id ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <RefreshCcw size={12} />
                    )}
                    {c.is_archived ? "Unarchive" : "Archive"}
                  </button>

                  {c.status === 4 && (
                    <button
                      onClick={() => handleRescheduleFailed(c.id)}
                      disabled={reschedulingId === c.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                    >
                      {reschedulingId === c.id ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <RefreshCcw size={12} />
                      )}
                      Reschedule Failed
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.total_pages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 shrink-0">
          <span className="text-xs text-gray-400">
            Page {pagination.current_page} of {pagination.total_pages} — {pagination.total_campaigns} campaigns
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={pagination.current_page === 1}
              className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(pagination.total_pages, p + 1))}
              disabled={pagination.current_page === pagination.total_pages}
              className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 disabled:opacity-30 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {showCreate && (
        <CreateCampaignModal
          onClose={() => setShowCreate(false)}
          onCreated={load}
          addToast={addToast}
        />
      )}
    </div>
  );
}
