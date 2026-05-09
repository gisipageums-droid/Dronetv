import React, { useState, useCallback } from "react";
import {
  Bot,
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { waAgentsApi, type WaAgent } from "./echoleadsApi";

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
  const isActive = status?.toLowerCase() === "active";
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
        isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-green-500" : "bg-gray-400"}`} />
      {status || "Unknown"}
    </span>
  );
}

// ---------- AI Bot Toggle ----------
function AiBotToggle({
  enabled,
  loading,
  onToggle,
}: {
  enabled: boolean;
  loading: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      disabled={loading}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all disabled:opacity-50 ${
        enabled
          ? "bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100"
          : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"
      }`}
      title={enabled ? "Disable AI Bot" : "Enable AI Bot"}
    >
      {loading ? (
        <Loader2 size={14} className="animate-spin" />
      ) : enabled ? (
        <ToggleRight size={18} className="text-amber-500" />
      ) : (
        <ToggleLeft size={18} className="text-gray-400" />
      )}
      AI Bot {enabled ? "On" : "Off"}
    </button>
  );
}

// ---------- Edit Agent Modal ----------
interface EditModalProps {
  agent: WaAgent;
  onClose: () => void;
  onSaved: () => void;
  addToast: (type: ToastType, text: string) => void;
}

function EditAgentModal({ agent, onClose, onSaved, addToast }: EditModalProps) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: agent.name ?? "",
    agent_status: agent.agent_status ?? "",
    firstMessage: agent.firstMessage ?? "",
    prompt: agent.prompt ?? "",
    summary_capturing: agent.summary_capturing ?? false,
    sentiment_detection: agent.sentiment_detection ?? false,
  });

  function setStr(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function setBool(field: string, value: boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await waAgentsApi.update(agent.id, form);
      addToast("success", "Agent updated.");
      onSaved();
      onClose();
    } catch {
      addToast("error", "Failed to update agent.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Edit Agent</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setStr("name", e.target.value)}
              placeholder="Agent name"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Agent Status</label>
            <input
              type="text"
              value={form.agent_status}
              onChange={(e) => setStr("agent_status", e.target.value)}
              placeholder="e.g. active"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">First Message</label>
            <input
              type="text"
              value={form.firstMessage}
              onChange={(e) => setStr("firstMessage", e.target.value)}
              placeholder="Opening message"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Prompt</label>
            <textarea
              value={form.prompt}
              onChange={(e) => setStr("prompt", e.target.value)}
              rows={4}
              placeholder="System prompt / instructions"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
            />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 select-none">
              <input
                type="checkbox"
                checked={form.summary_capturing}
                onChange={(e) => setBool("summary_capturing", e.target.checked)}
                className="rounded accent-amber-400"
              />
              Summary Capturing
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 select-none">
              <input
                type="checkbox"
                checked={form.sentiment_detection}
                onChange={(e) => setBool("sentiment_detection", e.target.checked)}
                className="rounded accent-amber-400"
              />
              Sentiment Detection
            </label>
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
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Pencil size={15} />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Create Agent Modal ----------
interface CreateModalProps {
  onClose: () => void;
  onCreated: (id: number) => void;
  addToast: (type: ToastType, text: string) => void;
}

function CreateAgentModal({ onClose, onCreated, addToast }: CreateModalProps) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", prompt: "", firstMessage: "" });

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      addToast("error", "Name is required.");
      return;
    }
    const fd = new FormData();
    fd.append("name", form.name.trim());
    if (form.prompt.trim()) fd.append("prompt", form.prompt.trim());
    if (form.firstMessage.trim()) fd.append("firstMessage", form.firstMessage.trim());

    setSaving(true);
    try {
      const res = await waAgentsApi.create(fd);
      addToast("success", "Agent created.");
      onCreated(res.data.whatsappAgent.id);
      onClose();
    } catch {
      addToast("error", "Failed to create agent.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Create WA Agent</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Agent name"
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">First Message</label>
            <input
              type="text"
              value={form.firstMessage}
              onChange={(e) => set("firstMessage", e.target.value)}
              placeholder="Opening message"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Prompt</label>
            <textarea
              value={form.prompt}
              onChange={(e) => set("prompt", e.target.value)}
              rows={4}
              placeholder="System instructions"
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
            Create Agent
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Main Component ----------
export default function WaAgentsPanel() {
  if (!localStorage.getItem("echoleads_api_key")) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20 text-gray-400">
        <p className="text-sm font-medium">Not connected</p>
        <p className="text-xs mt-1">Go to Authentication tab first.</p>
      </div>
    );
  }

  const [agentIdInput, setAgentIdInput] = useState("");
  const [agent, setAgent] = useState<WaAgent | null>(null);
  const [loadingAgent, setLoadingAgent] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [togglingBot, setTogglingBot] = useState(false);
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

  const loadAgent = useCallback(async (id: number) => {
    setLoadingAgent(true);
    setLoadError("");
    try {
      const res = await waAgentsApi.getById(id);
      const agents = res.data.whatsappAgent ?? [];
      if (agents.length === 0) {
        setLoadError("No agent found with that ID.");
        setAgent(null);
      } else {
        setAgent(agents[0]);
      }
    } catch {
      setLoadError("Failed to load agent. Check the ID and try again.");
      setAgent(null);
    } finally {
      setLoadingAgent(false);
    }
  }, []);

  function handleLoad() {
    const id = parseInt(agentIdInput, 10);
    if (!id || id <= 0) {
      setLoadError("Enter a valid numeric agent ID.");
      return;
    }
    loadAgent(id);
  }

  async function handleDelete() {
    if (!agent) return;
    if (!confirm("Delete this agent? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await waAgentsApi.delete(agent.id);
      addToast("success", "Agent deleted.");
      setAgent(null);
      setAgentIdInput("");
    } catch {
      addToast("error", "Failed to delete agent.");
    } finally {
      setDeleting(false);
    }
  }

  async function handleToggleBot() {
    if (!agent) return;
    setTogglingBot(true);
    try {
      await waAgentsApi.toggleAiBot(agent.id, !agent.enable_ai_bot);
      addToast("success", `AI Bot ${!agent.enable_ai_bot ? "enabled" : "disabled"}.`);
      await loadAgent(agent.id);
    } catch {
      addToast("error", "Failed to toggle AI bot.");
    } finally {
      setTogglingBot(false);
    }
  }

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
          <input
            type="number"
            value={agentIdInput}
            onChange={(e) => { setAgentIdInput(e.target.value); setLoadError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleLoad()}
            placeholder="Agent ID"
            min={1}
            className="w-32 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <button
            onClick={handleLoad}
            disabled={loadingAgent || !agentIdInput}
            className="flex items-center gap-2 px-4 py-2 border border-amber-300 text-amber-700 text-sm font-semibold rounded-lg hover:bg-amber-50 disabled:opacity-50 transition-colors"
          >
            {loadingAgent ? <Loader2 size={15} className="animate-spin" /> : <Bot size={15} />}
            Load
          </button>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-white text-sm font-semibold rounded-lg px-4 py-2 transition-colors shrink-0"
        >
          <Plus size={16} />
          Create Agent
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {loadError && (
          <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            <AlertTriangle size={15} className="shrink-0" />
            {loadError}
          </div>
        )}

        {!agent && !loadingAgent && !loadError && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Bot size={36} className="mb-3 opacity-30" />
            <p className="text-sm font-medium">No agent loaded</p>
            <p className="text-xs mt-1">Enter a numeric agent ID above and click Load.</p>
          </div>
        )}

        {loadingAgent && (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <Loader2 size={24} className="animate-spin" />
          </div>
        )}

        {agent && !loadingAgent && (
          <div className="max-w-xl">
            <div className="bg-white border border-gray-100 rounded-xl p-5 hover:border-amber-200 hover:shadow-sm transition-all">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                    <Bot size={22} className="text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{agent.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">#{agent.id} · {formatDate(agent.created_at)}</p>
                  </div>
                </div>
                <StatusBadge status={agent.agent_status} />
              </div>

              {/* AI Bot Toggle */}
              <div className="mb-4">
                <AiBotToggle
                  enabled={!!agent.enable_ai_bot}
                  loading={togglingBot}
                  onToggle={handleToggleBot}
                />
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                {agent.meta_config?.whatsapp_number && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-400 mb-1">WhatsApp Number</p>
                    <p className="font-semibold text-gray-800">{agent.meta_config.whatsapp_number}</p>
                  </div>
                )}
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-400 mb-1">Credits Used</p>
                  <p className="font-semibold text-gray-800">
                    {agent.credits ?? "—"} / {agent.total_credits ?? "—"}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-400 mb-1">Total Chats</p>
                  <p className="font-semibold text-gray-800">{agent.total_chats ?? 0}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-400 mb-1">Features</p>
                  <p className="font-semibold text-gray-800 text-[11px] leading-relaxed">
                    {[
                      agent.summary_capturing && "Summary",
                      agent.sentiment_detection && "Sentiment",
                    ]
                      .filter(Boolean)
                      .join(", ") || "None"}
                  </p>
                </div>
              </div>

              {agent.firstMessage && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                  <p className="text-xs text-amber-600 font-semibold mb-1">First Message</p>
                  <p className="text-xs text-gray-700 leading-relaxed">{agent.firstMessage}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setShowEdit(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-amber-50 text-gray-600 hover:text-amber-700 text-xs font-semibold rounded-lg transition-colors"
                >
                  <Pencil size={12} />
                  Edit
                </button>

                <div className="flex-1" />

                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-red-500 hover:bg-red-50 text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                >
                  {deleting ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Trash2 size={13} />
                  )}
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showEdit && agent && (
        <EditAgentModal
          agent={agent}
          onClose={() => setShowEdit(false)}
          onSaved={() => loadAgent(agent.id)}
          addToast={addToast}
        />
      )}

      {showCreate && (
        <CreateAgentModal
          onClose={() => setShowCreate(false)}
          onCreated={(id) => {
            setAgentIdInput(String(id));
            loadAgent(id);
          }}
          addToast={addToast}
        />
      )}
    </div>
  );
}
