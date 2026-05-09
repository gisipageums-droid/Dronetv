import React, { useState, useEffect, useCallback } from "react";
import {
  Wrench,
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  PhoneCall,
} from "lucide-react";
import { toolsApi, type Tool, type ToolPayload } from "./echoleadsApi";

// ---------- Not connected guard ----------
function NotConnected() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-20 text-gray-400">
      <p className="text-sm font-medium">Not connected</p>
      <p className="text-xs mt-1">Go to the Authentication tab first.</p>
    </div>
  );
}

// ---------- Tool type badge ----------
function ToolTypeBadge({ type }: { type: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    transfer_call: { label: "Transfer Call", cls: "bg-blue-50 text-blue-600" },
    end_call: { label: "End Call", cls: "bg-red-50 text-red-500" },
    custom: { label: "Custom", cls: "bg-purple-50 text-purple-600" },
  };
  const entry = map[type] ?? { label: type, cls: "bg-gray-100 text-gray-500" };
  return (
    <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full ${entry.cls}`}>
      {entry.label}
    </span>
  );
}

// ---------- Status badge ----------
function StatusBadge({ status }: { status: string }) {
  const isActive = status === "active";
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
        isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-green-500" : "bg-gray-400"}`} />
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

// ---------- Tool modal ----------
const TRANSFER_PLAN_OPTIONS = [
  { value: "blind-transfer", label: "Blind Transfer" },
  { value: "warm-transfer-say-message", label: "Warm Transfer — Say Message" },
  { value: "warm-transfer-wait-for-operator-to-speak-first", label: "Warm Transfer — Wait for Operator" },
];

const emptyForm: ToolPayload = {
  tool_name: "",
  tool_type: "transfer_call",
  description: "",
  destination_phone_number: "",
  message_to_customer: "",
  destination_description: "",
  transfer_plan_mode: "blind-transfer",
};

interface ToolModalProps {
  initial?: Tool | null;
  onClose: () => void;
  onSaved: () => void;
}

function ToolModal({ initial, onClose, onSaved }: ToolModalProps) {
  const isEdit = !!initial;
  const [form, setForm] = useState<ToolPayload>(
    initial
      ? {
          tool_name: initial.tool_name,
          tool_type: initial.tool_type,
          description: initial.description ?? "",
          destination_phone_number: initial.destination_phone_number ?? "",
          message_to_customer: initial.message_to_customer ?? "",
          destination_description: initial.destination_description ?? "",
          transfer_plan_mode: initial.transfer_plan_mode ?? "blind-transfer",
        }
      : { ...emptyForm }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function set(field: keyof ToolPayload, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function submit() {
    if (!form.tool_name.trim()) { setError("Tool name is required."); return; }
    if (form.tool_type === "transfer_call" && !form.destination_phone_number?.trim()) {
      setError("Destination phone number is required for transfer calls.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      if (isEdit) {
        await toolsApi.update(initial!.id, form);
      } else {
        await toolsApi.create(form);
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Wrench size={20} className="text-amber-600" />
            <h3 className="text-base font-bold text-gray-900">{isEdit ? "Edit Tool" : "Create Tool"}</h3>
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

          {/* Tool name */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Tool Name *</label>
            <input
              value={form.tool_name}
              onChange={(e) => set("tool_name", e.target.value)}
              placeholder="e.g. Transfer to Support"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* Tool type */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Tool Type</label>
            <select
              value={form.tool_type}
              onChange={(e) => set("tool_type", e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
            >
              <option value="transfer_call">Transfer Call</option>
              <option value="end_call">End Call</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {/* Destination phone — only for transfer_call */}
          {form.tool_type === "transfer_call" && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                <span className="flex items-center gap-1"><PhoneCall size={12} /> Destination Phone Number *</span>
              </label>
              <input
                value={form.destination_phone_number}
                onChange={(e) => set("destination_phone_number", e.target.value)}
                placeholder="+1 555 000 0000"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
            <input
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="What does this tool do?"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* Message to customer */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Message to Customer</label>
            <input
              value={form.message_to_customer}
              onChange={(e) => set("message_to_customer", e.target.value)}
              placeholder="e.g. Please hold while I transfer you."
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* Destination description */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Destination Description</label>
            <input
              value={form.destination_description}
              onChange={(e) => set("destination_description", e.target.value)}
              placeholder="e.g. Customer support team"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* Transfer plan mode */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Transfer Plan Mode</label>
            <select
              value={form.transfer_plan_mode}
              onChange={(e) => set("transfer_plan_mode", e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
            >
              {TRANSFER_PLAN_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
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
            {isEdit ? "Save Changes" : "Create Tool"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Delete confirm ----------
function DeleteConfirm({ tool, onCancel, onDeleted }: { tool: Tool; onCancel: () => void; onDeleted: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function confirm() {
    setLoading(true);
    setError("");
    try {
      await toolsApi.delete(tool.id);
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
            <h3 className="font-bold text-gray-900 text-sm">Delete Tool</h3>
            <p className="text-xs text-gray-500 mt-0.5">This action cannot be undone.</p>
          </div>
        </div>
        <p className="text-sm text-gray-700 mb-5">
          Are you sure you want to delete <span className="font-semibold">"{tool.tool_name}"</span>?
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

// ---------- Main panel ----------
const ToolsPanel: React.FC = () => {
  if (!localStorage.getItem("echoleads_api_key")) return <NotConnected />;

  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editTool, setEditTool] = useState<Tool | null>(null);
  const [deleteTool, setDeleteTool] = useState<Tool | null>(null);

  const fetchTools = useCallback(async () => {
    setLoading(true);
    setFetchError("");
    try {
      const res = await toolsApi.list();
      setTools(res.data.tools || []);
    } catch {
      setFetchError("Failed to load tools. Check your API key.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTools();
  }, [fetchTools]);

  function onSaved() {
    fetchTools();
  }

  function onDeleted() {
    setDeleteTool(null);
    fetchTools();
  }

  return (
    <div className="h-full flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center">
            <Wrench size={20} className="text-amber-700" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Tools</h1>
            <p className="text-xs text-gray-500">{tools.length > 0 ? `${tools.length} tool${tools.length === 1 ? "" : "s"}` : "Manage your agent tools"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchTools}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => { setEditTool(null); setShowModal(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <Plus size={15} />
            New Tool
          </button>
        </div>
      </div>

      {/* Error */}
      {fetchError && (
        <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          <AlertTriangle size={15} className="shrink-0" />
          {fetchError}
          <button onClick={fetchTools} className="ml-auto text-red-500 underline text-xs">Retry</button>
        </div>
      )}

      {/* Tool list */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <Loader2 size={28} className="animate-spin" />
          </div>
        ) : tools.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Wrench size={36} className="mb-3 opacity-40" />
            <p className="text-sm font-medium">No tools found</p>
            <p className="text-xs mt-1">Create your first tool to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tools.map((tool) => (
              <div
                key={tool.id}
                className="flex items-start gap-4 p-4 bg-white border border-gray-100 rounded-xl hover:border-amber-200 hover:shadow-sm transition-all"
              >
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                  <Wrench size={20} className="text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-gray-900 truncate">{tool.tool_name}</span>
                    <ToolTypeBadge type={tool.tool_type} />
                    <StatusBadge status={tool.status} />
                  </div>
                  {tool.description && (
                    <p className="text-xs text-gray-500 mt-1 truncate">{tool.description}</p>
                  )}
                  {tool.destination_phone_number && (
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                      <PhoneCall size={11} />
                      {tool.destination_phone_number}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-0.5">
                    Created {new Date(tool.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => { setEditTool(tool); setShowModal(true); }}
                    className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => setDeleteTool(tool)}
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

      {/* Modals */}
      {showModal && (
        <ToolModal
          initial={editTool}
          onClose={() => { setShowModal(false); setEditTool(null); }}
          onSaved={onSaved}
        />
      )}
      {deleteTool && (
        <DeleteConfirm
          tool={deleteTool}
          onCancel={() => setDeleteTool(null)}
          onDeleted={onDeleted}
        />
      )}
    </div>
  );
};

export default ToolsPanel;
