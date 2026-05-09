import React, { useState, useEffect, useCallback } from "react";
import {
  Bot,
  Plus,
  Search,
  Pencil,
  Trash2,
  PhoneIncoming,
  PhoneOutgoing,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
  RefreshCw,
  KeyRound,
  AlertTriangle,
  CheckCircle2,
  Mic,
  ChevronDown,
} from "lucide-react";
import { agentsApi, voicesApi, type Agent, type AgentPayload, type Voice, type Pagination } from "./echoleadsApi";

// ---------- API Key Gate ----------
function ApiKeyGate({ onSave }: { onSave: () => void }) {
  const [key, setKey] = useState("");
  const [saving, setSaving] = useState(false);

  function save() {
    if (!key.trim()) return;
    setSaving(true);
    localStorage.setItem("echoleads_api_key", key.trim());
    setTimeout(() => { setSaving(false); onSave(); }, 300);
  }

  return (
    <div className="flex flex-col items-center justify-center h-full py-20 px-8">
      <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-4">
        <KeyRound size={28} className="text-amber-600" />
      </div>
      <h2 className="text-lg font-bold text-gray-900 mb-1">Connect Your AI Account</h2>
      <p className="text-sm text-gray-500 mb-6 text-center max-w-sm">
        Enter your API key to start managing AI agents.
      </p>
      <div className="w-full max-w-sm flex gap-2">
        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && save()}
          placeholder="Paste your API key"
          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
        <button
          onClick={save}
          disabled={!key.trim() || saving}
          className="px-4 py-2.5 bg-amber-400 text-white text-sm font-semibold rounded-lg hover:bg-amber-500 disabled:opacity-50 transition-colors"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : "Save"}
        </button>
      </div>
    </div>
  );
}

// ---------- Status Badge ----------
function StatusBadge({ status }: { status: string }) {
  const isActive = status === "active";
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
      isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-green-500" : "bg-gray-400"}`} />
      {isActive ? "Active" : "Draft"}
    </span>
  );
}

// ---------- Call Type Badge ----------
function CallTypeBadge({ type }: { type: string }) {
  const isIncoming = type === "incoming";
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
      isIncoming ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
    }`}>
      {isIncoming ? <PhoneIncoming size={11} /> : <PhoneOutgoing size={11} />}
      {isIncoming ? "Incoming" : "Outgoing"}
    </span>
  );
}

// ---------- Agent Form Modal ----------
const emptyForm: AgentPayload = {
  name: "",
  agent_call_type: "outgoing",
  firstMessage: "",
  prompt: "",
  voice_id: "",
  language: "en",
  agent_status: "draft",
  speaks_first: "ai",
  silence_timeout: "10",
  max_duration_seconds: "300",
};

interface AgentModalProps {
  initial?: Agent | null;
  voices: Voice[];
  onClose: () => void;
  onSaved: () => void;
}

function AgentModal({ initial, voices, onClose, onSaved }: AgentModalProps) {
  const isEdit = !!initial;
  const [form, setForm] = useState<AgentPayload>(
    initial
      ? {
          name: initial.name,
          agent_call_type: initial.agent_call_type,
          firstMessage: initial.firstMessage || "",
          prompt: initial.prompt || "",
          voice_id: initial.voice_id || "",
          language: initial.language || "en",
          agent_status: initial.agent_status,
          speaks_first: initial.speaks_first || "ai",
          silence_timeout: initial.silence_timeout || "10",
          max_duration_seconds: initial.max_duration_seconds || "300",
        }
      : { ...emptyForm }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  function set(field: keyof AgentPayload, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function submit() {
    if (!form.name?.trim()) { setError("Agent name is required."); return; }
    setLoading(true);
    setError("");
    try {
      if (isEdit) {
        await agentsApi.update(initial!.id, form);
      } else {
        await agentsApi.create(form);
      }
      onSaved();
      onClose();
    } catch {
      setError("Request failed. Check your API key and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Bot size={20} className="text-amber-600" />
            <h3 className="text-base font-bold text-gray-900">
              {isEdit ? "Edit Agent" : "Create Agent"}
            </h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              <AlertTriangle size={15} className="shrink-0" />
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Agent Name *</label>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Sales Agent"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* Call Type + Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Call Type</label>
              <select
                value={form.agent_call_type}
                onChange={(e) => set("agent_call_type", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
              >
                <option value="outgoing">Outgoing</option>
                <option value="incoming">Incoming</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
              <select
                value={form.agent_status}
                onChange={(e) => set("agent_status", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
              </select>
            </div>
          </div>

          {/* First Message */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">First Message</label>
            <input
              value={form.firstMessage}
              onChange={(e) => set("firstMessage", e.target.value)}
              placeholder="Hello, how can I help you today?"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* Prompt */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">System Prompt</label>
            <textarea
              value={form.prompt}
              onChange={(e) => set("prompt", e.target.value)}
              rows={4}
              placeholder="You are a helpful assistant..."
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
            />
          </div>

          {/* Voice */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              <span className="flex items-center gap-1"><Mic size={12} /> Voice</span>
            </label>
            <select
              value={form.voice_id}
              onChange={(e) => set("voice_id", e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
            >
              <option value="">Select a voice</option>
              {voices.map((v) => (
                <option key={v.voice_id} value={v.voice_id}>
                  {v.caller_name} — {v.gender}, {v.language} ({v.provider})
                </option>
              ))}
            </select>
          </div>

          {/* Language + Speaks First */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Language</label>
              <input
                value={form.language}
                onChange={(e) => set("language", e.target.value)}
                placeholder="en"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Speaks First</label>
              <select
                value={form.speaks_first}
                onChange={(e) => set("speaks_first", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
              >
                <option value="ai">AI</option>
                <option value="user">User</option>
              </select>
            </div>
          </div>

          {/* Advanced toggle */}
          <button
            type="button"
            onClick={() => setShowAdvanced((v) => !v)}
            className="flex items-center gap-1 text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors"
          >
            <ChevronDown size={14} className={`transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
            Advanced Settings
          </button>

          {showAdvanced && (
            <div className="grid grid-cols-2 gap-3 border border-dashed border-amber-200 rounded-xl p-4 bg-amber-50">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Silence Timeout (s)</label>
                <input
                  type="number"
                  value={form.silence_timeout}
                  onChange={(e) => set("silence_timeout", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Max Duration (s)</label>
                <input
                  type="number"
                  value={form.max_duration_seconds}
                  onChange={(e) => set("max_duration_seconds", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 bg-amber-400 hover:bg-amber-500 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
            {isEdit ? "Save Changes" : "Create Agent"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Delete Confirm ----------
function DeleteConfirm({ agent, onCancel, onDeleted }: { agent: Agent; onCancel: () => void; onDeleted: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function confirm() {
    setLoading(true);
    setError("");
    try {
      await agentsApi.delete(agent.id);
      onDeleted();
    } catch {
      setError("Failed to delete. Try again.");
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
            <Trash2 size={20} className="text-red-500" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Delete Agent</h3>
            <p className="text-xs text-gray-500 mt-0.5">This will permanently delete the VAPI assistant.</p>
          </div>
        </div>
        <p className="text-sm text-gray-700 mb-5">
          Are you sure you want to delete <span className="font-semibold">"{agent.name}"</span>?
        </p>
        {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
            Cancel
          </button>
          <button
            onClick={confirm}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Main Panel ----------
const AgentsPanel: React.FC = () => {
  const [hasKey, setHasKey] = useState(!!localStorage.getItem("echoleads_api_key"));
  const [agents, setAgents] = useState<Agent[]>([]);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editAgent, setEditAgent] = useState<Agent | null>(null);
  const [deleteAgent, setDeleteAgent] = useState<Agent | null>(null);

  const fetchAgents = useCallback(async (p = 1, q = "") => {
    setLoading(true);
    setFetchError("");
    try {
      const res = await agentsApi.list(p, 10, q);
      setAgents(res.data.data || []);
      setPagination(res.data.pagination || null);
    } catch {
      setFetchError("Failed to load agents. Check your API key.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchVoices = useCallback(async () => {
    try {
      const res = await voicesApi.list();
      setVoices(res.data.data || []);
    } catch {
      // voices are optional
    }
  }, []);

  useEffect(() => {
    if (!hasKey) return;
    fetchAgents(page, search);
    fetchVoices();
  }, [hasKey, page, fetchAgents, fetchVoices]);

  function handleSearch(val: string) {
    setSearch(val);
    setPage(1);
    fetchAgents(1, val);
  }

  function onSaved() {
    fetchAgents(page, search);
  }

  function onDeleted() {
    setDeleteAgent(null);
    fetchAgents(page, search);
  }

  function resetKey() {
    localStorage.removeItem("echoleads_api_key");
    setHasKey(false);
  }

  if (!hasKey) {
    return <ApiKeyGate onSave={() => setHasKey(true)} />;
  }

  return (
    <div className="h-full flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center">
            <Bot size={20} className="text-amber-700" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">AI Agents</h1>
            <p className="text-xs text-gray-500">
              {pagination ? `${pagination.total_records} agents` : "Manage your calling agents"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchAgents(page, search)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={resetKey}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Change API key"
          >
            <KeyRound size={16} />
          </button>
          <button
            onClick={() => { setEditAgent(null); setShowModal(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <Plus size={15} />
            New Agent
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search agents by name, phone…"
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
        />
      </div>

      {/* Error */}
      {fetchError && (
        <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          <AlertTriangle size={15} className="shrink-0" />
          {fetchError}
          <button onClick={() => fetchAgents(page, search)} className="ml-auto text-red-500 underline text-xs">Retry</button>
        </div>
      )}

      {/* Agent list */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <Loader2 size={28} className="animate-spin" />
          </div>
        ) : agents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Bot size={36} className="mb-3 opacity-40" />
            <p className="text-sm font-medium">No agents found</p>
            <p className="text-xs mt-1">Create your first AI agent to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl hover:border-amber-200 hover:shadow-sm transition-all"
              >
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
                  <Bot size={20} className="text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-gray-900 truncate">{agent.name}</span>
                    <StatusBadge status={agent.agent_status} />
                    <CallTypeBadge type={agent.agent_call_type} />
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">
                    ID: {agent.a_id || `#${agent.id}`} &middot; Created {new Date(agent.created_at).toLocaleDateString()}
                  </p>
                  {agent.firstMessage && (
                    <p className="text-xs text-gray-500 mt-1 truncate italic">"{agent.firstMessage}"</p>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => { setEditAgent(agent); setShowModal(true); }}
                    className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => setDeleteAgent(agent)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.total_pages > 1 && (
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Page {pagination.current_page} of {pagination.total_pages} &middot; {pagination.total_records} total
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={pagination.current_page === 1}
              className="p-1.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft size={15} />
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={pagination.current_page === pagination.total_pages}
              className="p-1.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {showModal && (
        <AgentModal
          initial={editAgent}
          voices={voices}
          onClose={() => { setShowModal(false); setEditAgent(null); }}
          onSaved={onSaved}
        />
      )}
      {deleteAgent && (
        <DeleteConfirm
          agent={deleteAgent}
          onCancel={() => setDeleteAgent(null)}
          onDeleted={onDeleted}
        />
      )}
    </div>
  );
};

export default AgentsPanel;
