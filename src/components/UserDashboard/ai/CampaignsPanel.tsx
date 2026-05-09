import React, { useState, useEffect, useCallback } from "react";
import {
  Megaphone,
  Plus,
  Search,
  Trash2,
  Play,
  Pause,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import {
  campaignsApi,
  agentsApi,
  type Campaign,
  type Agent,
} from "./echoleadsApi";

// ---------- Types ----------
interface CampaignPagination {
  current_page: number;
  total_pages: number;
  total_campaigns: number;
  per_page: number;
}

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
function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, { bg: string; dot: string; label: string }> = {
    running: { bg: "bg-green-100 text-green-700", dot: "bg-green-500", label: "Running" },
    completed: { bg: "bg-blue-100 text-blue-700", dot: "bg-blue-500", label: "Completed" },
    scheduled: { bg: "bg-amber-100 text-amber-700", dot: "bg-amber-500", label: "Scheduled" },
    paused: { bg: "bg-gray-100 text-gray-500", dot: "bg-gray-400", label: "Paused" },
    failed: { bg: "bg-red-100 text-red-700", dot: "bg-red-500", label: "Failed" },
  };
  const s = cfg[status?.toLowerCase()] ?? { bg: "bg-gray-100 text-gray-500", dot: "bg-gray-400", label: status };
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ${s.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

// ---------- Send Option Badge ----------
function SendOptionBadge({ option }: { option: string }) {
  const isScheduled = option === "schedule";
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
      isScheduled ? "bg-purple-100 text-purple-700" : "bg-teal-100 text-teal-700"
    }`}>
      {isScheduled ? <Calendar size={11} /> : <Play size={11} />}
      {isScheduled ? "Scheduled" : "Instant"}
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
  const formRef = React.useRef<HTMLFormElement>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loadingAgents, setLoadingAgents] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [form, setForm] = useState({
    campaign_name: "",
    agent_id: "",
    from_number: "",
    send_option: "instant" as "instant" | "schedule",
    contact_ids_raw: "",
    concurrency_reserved: "",
    concurrency_allocated: "",
    schedule_date: "",
    schedule_time: "",
    timezone: "Asia/Kolkata",
    retries: "",
    retry_after: "",
  });

  useEffect(() => {
    setLoadingAgents(true);
    agentsApi
      .list(1, 100)
      .then((res) => setAgents(res.data.data ?? []))
      .catch(() => setAgents([]))
      .finally(() => setLoadingAgents(false));
  }, []);

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.campaign_name.trim()) {
      addToast("error", "Campaign name is required.");
      return;
    }

    const rawIds = form.contact_ids_raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map(Number)
      .filter((n) => !isNaN(n));

    const payload: Parameters<typeof campaignsApi.create>[0] = {
      campaign_name: form.campaign_name.trim(),
      agent_id: Number(form.agent_id) || 0,
      from_number: form.from_number.trim(),
      send_option: form.send_option,
      contact_ids: rawIds,
    };

    if (form.concurrency_reserved) payload.concurrency_reserved = Number(form.concurrency_reserved);
    if (form.concurrency_allocated) payload.concurrency_allocated = Number(form.concurrency_allocated);
    if (form.retries) payload.retries = Number(form.retries);
    if (form.retry_after) payload.retry_after = Number(form.retry_after);
    if (form.timezone) payload.timezone = form.timezone;
    if (form.send_option === "schedule") {
      if (form.schedule_date) payload.schedule_date = form.schedule_date;
      if (form.schedule_time) payload.schedule_time = form.schedule_time;
    }

    setSaving(true);
    try {
      await campaignsApi.create(payload);
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
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">New Campaign</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form ref={formRef} onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {/* Campaign Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Campaign Name *</label>
            <input
              type="text"
              value={form.campaign_name}
              onChange={(e) => set("campaign_name", e.target.value)}
              placeholder="e.g. Q2 Outreach"
              required
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* Agent */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Agent</label>
            {loadingAgents ? (
              <div className="flex items-center gap-2 text-xs text-gray-400 py-2">
                <Loader2 size={14} className="animate-spin" /> Loading agents…
              </div>
            ) : (
              <select
                value={form.agent_id}
                onChange={(e) => set("agent_id", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
              >
                <option value="">Select an agent</option>
                {agents.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* From Number */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">From Number</label>
            <input
              type="text"
              value={form.from_number}
              onChange={(e) => set("from_number", e.target.value)}
              placeholder="+1234567890"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* Send Option */}
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
                    name="send_option"
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

          {/* Contact IDs */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Contact IDs, comma separated</label>
            <textarea
              value={form.contact_ids_raw}
              onChange={(e) => set("contact_ids_raw", e.target.value)}
              rows={2}
              placeholder="1, 2, 3, 45"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
            />
          </div>

          {/* Concurrency */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Concurrency Reserved</label>
              <input
                type="number"
                min={0}
                value={form.concurrency_reserved}
                onChange={(e) => set("concurrency_reserved", e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Concurrency Allocated</label>
              <input
                type="number"
                min={0}
                value={form.concurrency_allocated}
                onChange={(e) => set("concurrency_allocated", e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          {/* Advanced Toggle */}
          <div className="border-t border-gray-100 pt-3">
            <button
              type="button"
              onClick={() => setShowAdvanced((v) => !v)}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-amber-600 transition-colors"
            >
              <ChevronDown
                size={15}
                className={`transition-transform ${showAdvanced ? "rotate-180" : ""}`}
              />
              Advanced Options
            </button>

            {showAdvanced && (
              <div className="mt-4 space-y-4">
                {/* Schedule fields */}
                {form.send_option === "schedule" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Schedule Date</label>
                      <input
                        type="date"
                        value={form.schedule_date}
                        onChange={(e) => set("schedule_date", e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Schedule Time</label>
                      <input
                        type="time"
                        value={form.schedule_time}
                        onChange={(e) => set("schedule_time", e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                      />
                    </div>
                  </div>
                )}

                {/* Timezone */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Timezone</label>
                  <input
                    type="text"
                    value={form.timezone}
                    onChange={(e) => set("timezone", e.target.value)}
                    placeholder="Asia/Kolkata"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                {/* Retries */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Retries</label>
                    <input
                      type="number"
                      min={0}
                      value={form.retries}
                      onChange={(e) => set("retries", e.target.value)}
                      placeholder="0"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Retry After (min)</label>
                    <input
                      type="number"
                      min={0}
                      value={form.retry_after}
                      onChange={(e) => set("retry_after", e.target.value)}
                      placeholder="0"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
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
            onClick={() => formRef.current?.requestSubmit()}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-amber-400 hover:bg-amber-500 text-white text-sm font-semibold rounded-lg disabled:opacity-50 transition-colors"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
            Create Campaign
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Not Connected Screen ----------
function NotConnected() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-20 text-gray-400">
      <p className="text-sm font-medium">Not connected</p>
      <p className="text-xs mt-1">Go to the Authentication tab to connect your account.</p>
    </div>
  );
}

// ---------- Campaigns List ----------
function CampaignsList() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [pagination, setPagination] = useState<CampaignPagination>({
    current_page: 1,
    total_pages: 1,
    total_campaigns: 0,
    per_page: 10,
  });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [showCreate, setShowCreate] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [actionId, setActionId] = useState<number | null>(null);
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
      const res = await campaignsApi.list(page, 10, statusFilter, search);
      setCampaigns(res.data.campaigns ?? []);
      if (res.data.pagination) setPagination(res.data.pagination);
    } catch {
      addToast("error", "Failed to load campaigns.");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleStart(id: number) {
    setActionId(id);
    try {
      await campaignsApi.start(id);
      addToast("success", "Campaign started.");
      load();
    } catch {
      addToast("error", "Failed to start campaign.");
    } finally {
      setActionId(null);
    }
  }

  async function handleTogglePause(c: Campaign) {
    const newStatus = c.status === "paused" ? "running" : "paused";
    setActionId(c.id);
    try {
      await campaignsApi.update(c.id, { status: newStatus });
      addToast("success", `Campaign ${newStatus === "paused" ? "paused" : "resumed"}.`);
      load();
    } catch {
      addToast("error", "Failed to update campaign status.");
    } finally {
      setActionId(null);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this campaign? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await campaignsApi.delete(id);
      addToast("success", "Campaign deleted.");
      load();
    } catch {
      addToast("error", "Failed to delete campaign.");
    } finally {
      setDeletingId(null);
    }
  }

  function formatDate(iso: string) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  const canPause = (status: string) => ["running"].includes(status?.toLowerCase());
  const canResume = (status: string) => ["paused"].includes(status?.toLowerCase());
  const canStart = (status: string) => ["scheduled"].includes(status?.toLowerCase());

  return (
    <div className="flex flex-col h-full">
      <Toast toasts={toasts} dismiss={dismissToast} />

      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between px-6 pt-5 pb-4">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search campaigns…"
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white text-gray-600"
          >
            <option value="">All Statuses</option>
            <option value="running">Running</option>
            <option value="completed">Completed</option>
            <option value="scheduled">Scheduled</option>
            <option value="paused">Paused</option>
            <option value="failed">Failed</option>
          </select>
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
          className="flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-white text-sm font-semibold rounded-lg transition-colors shrink-0"
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
        ) : campaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Megaphone size={36} className="mb-3 opacity-30" />
            <p className="text-sm font-medium">No campaigns found</p>
            <p className="text-xs mt-1">Create your first campaign to get started.</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {campaigns.map((c) => (
              <div
                key={c.id}
                className="bg-white border border-gray-100 rounded-xl p-4 hover:border-amber-200 hover:shadow-sm transition-all"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{c.campaign_name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatDate(c.created_at)}</p>
                  </div>
                  <StatusBadge status={c.status} />
                </div>

                {/* Badges */}
                <div className="flex items-center gap-2 mb-3">
                  <SendOptionBadge option={c.send_option} />
                  {c.total_calls !== undefined && (
                    <span className="text-xs text-gray-400 font-medium">{c.total_calls} calls</span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  {canStart(c.status) && (
                    <button
                      onClick={() => handleStart(c.id)}
                      disabled={actionId === c.id}
                      title="Start campaign"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                    >
                      {actionId === c.id ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <Play size={13} />
                      )}
                      Start
                    </button>
                  )}

                  {(canPause(c.status) || canResume(c.status)) && (
                    <button
                      onClick={() => handleTogglePause(c)}
                      disabled={actionId === c.id}
                      title={canPause(c.status) ? "Pause campaign" : "Resume campaign"}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-amber-50 text-gray-600 hover:text-amber-700 text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                    >
                      {actionId === c.id ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : canPause(c.status) ? (
                        <Pause size={13} />
                      ) : (
                        <Play size={13} />
                      )}
                      {canPause(c.status) ? "Pause" : "Resume"}
                    </button>
                  )}

                  <div className="flex-1" />

                  <button
                    onClick={() => handleDelete(c.id)}
                    disabled={deletingId === c.id}
                    title="Delete campaign"
                    className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    {deletingId === c.id ? (
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

      {/* Create Modal */}
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

// ---------- Main Export ----------
export default function CampaignsPanel() {
  if (!localStorage.getItem("echoleads_api_key")) {
    return <NotConnected />;
  }
  return <CampaignsList />;
}
