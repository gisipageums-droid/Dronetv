import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  RefreshCw,
  X,
  Loader2,
  AlertTriangle,
  Trash2,
  ChevronDown,
} from "lucide-react";
import { funnelApi, type FunnelLead } from "./echoleadsApi";

const STAGES = [
  "lead-qualification",
  "proposal",
  "negotiation",
  "closed-won",
  "closed-lost",
] as const;

type Stage = (typeof STAGES)[number];

function formatStage(stage: string): string {
  return stage
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function stageColor(stage: string): { header: string; badge: string; border: string } {
  switch (stage) {
    case "lead-qualification":
      return { header: "bg-blue-500", badge: "bg-blue-100 text-blue-700", border: "border-blue-200" };
    case "proposal":
      return { header: "bg-amber-500", badge: "bg-amber-100 text-amber-700", border: "border-amber-200" };
    case "negotiation":
      return { header: "bg-purple-500", badge: "bg-purple-100 text-purple-700", border: "border-purple-200" };
    case "closed-won":
      return { header: "bg-green-500", badge: "bg-green-100 text-green-700", border: "border-green-200" };
    case "closed-lost":
      return { header: "bg-red-500", badge: "bg-red-100 text-red-700", border: "border-red-200" };
    default:
      return { header: "bg-gray-400", badge: "bg-gray-100 text-gray-600", border: "border-gray-200" };
  }
}

function formatValue(val?: number): string {
  if (val == null) return "";
  return "$" + val.toLocaleString();
}

// ---------- Move Lead Modal ----------
interface MoveModalProps {
  onClose: () => void;
  onMoved: () => void;
}

function MoveModal({ onClose, onMoved }: MoveModalProps) {
  const [contactId, setContactId] = useState("");
  const [stage, setStage] = useState<Stage>("lead-qualification");
  const [notes, setNotes] = useState("");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    if (!contactId.trim() || isNaN(Number(contactId))) {
      setError("A valid contact ID is required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await funnelApi.move({
        contact_id: Number(contactId),
        funnel_stage: stage,
        notes: notes.trim() || undefined,
        value: value ? Number(value) : undefined,
      });
      onMoved();
      onClose();
    } catch {
      setError("Failed to move lead. Check your API key and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Plus size={18} className="text-amber-600" />
            Move Lead to Stage
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              <AlertTriangle size={15} className="shrink-0" />
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Contact ID *</label>
            <input
              type="number"
              value={contactId}
              onChange={(e) => setContactId(e.target.value)}
              placeholder="e.g. 42"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Funnel Stage *</label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value as Stage)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
            >
              {STAGES.map((s) => (
                <option key={s} value={s}>{formatStage(s)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Value ($)</label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="e.g. 5000"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Optional notes..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
            />
          </div>
        </div>

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
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
            Move Lead
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Edit Lead Modal ----------
interface EditModalProps {
  lead: FunnelLead;
  onClose: () => void;
  onSaved: () => void;
}

function EditModal({ lead, onClose, onSaved }: EditModalProps) {
  const [stage, setStage] = useState<Stage>(lead.funnel_stage as Stage);
  const [notes, setNotes] = useState(lead.notes || "");
  const [value, setValue] = useState(lead.value != null ? String(lead.value) : "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setLoading(true);
    setError("");
    try {
      await funnelApi.update(lead.id, {
        funnel_stage: stage,
        notes: notes.trim() || undefined,
        value: value ? Number(value) : undefined,
      });
      onSaved();
      onClose();
    } catch {
      setError("Failed to update lead. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-900">Edit Lead #{lead.contact_id}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              <AlertTriangle size={15} className="shrink-0" />
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Funnel Stage</label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value as Stage)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
            >
              {STAGES.map((s) => (
                <option key={s} value={s}>{formatStage(s)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Value ($)</label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="e.g. 5000"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
            />
          </div>
        </div>

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
            {loading ? <Loader2 size={15} className="animate-spin" /> : null}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Lead Card ----------
interface LeadCardProps {
  lead: FunnelLead;
  onEdit: (lead: FunnelLead) => void;
  onDelete: (lead: FunnelLead) => void;
}

function LeadCard({ lead, onEdit, onDelete }: LeadCardProps) {
  return (
    <div
      className="bg-white border border-gray-100 rounded-xl hover:border-amber-200 transition-all p-3 cursor-pointer group"
      onClick={() => onEdit(lead)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-700">#{lead.contact_id}</p>
          {lead.value != null && (
            <p className="text-sm font-bold text-amber-600 mt-0.5">{formatValue(lead.value)}</p>
          )}
          {lead.notes && (
            <p className="text-xs text-gray-400 mt-1 line-clamp-2">{lead.notes}</p>
          )}
          {lead.created_at && (
            <p className="text-xs text-gray-300 mt-1">
              {new Date(lead.created_at).toLocaleDateString()}
            </p>
          )}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(lead); }}
          className="p-1.5 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
          title="Delete"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

// ---------- Delete Confirm ----------
interface DeleteConfirmProps {
  lead: FunnelLead;
  onCancel: () => void;
  onDeleted: () => void;
}

function DeleteConfirm({ lead, onCancel, onDeleted }: DeleteConfirmProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function confirm() {
    setLoading(true);
    setError("");
    try {
      await funnelApi.delete(lead.id);
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
            <h3 className="font-bold text-gray-900 text-sm">Delete Lead</h3>
            <p className="text-xs text-gray-500 mt-0.5">Contact #{lead.contact_id}</p>
          </div>
        </div>
        <p className="text-sm text-gray-700 mb-5">
          Remove this lead from the funnel permanently?
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
const FunnelPanel: React.FC = () => {
  if (!localStorage.getItem("echoleads_api_key")) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20 text-gray-400">
        <p className="text-sm font-medium">Not connected</p>
        <p className="text-xs mt-1">Go to Authentication tab first.</p>
      </div>
    );
  }

  const [leadsByStage, setLeadsByStage] = useState<Record<string, FunnelLead[]>>({});
  const [totalLeads, setTotalLeads] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [editLead, setEditLead] = useState<FunnelLead | null>(null);
  const [deleteLead, setDeleteLead] = useState<FunnelLead | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setFetchError("");
    try {
      const res = await funnelApi.getLeads();
      const d = res.data as unknown as { leadsByStage: Record<string, FunnelLead[]>; totalLeads: number };
      setLeadsByStage(d.leadsByStage || {});
      setTotalLeads(d.totalLeads || 0);
    } catch {
      setFetchError("Failed to load funnel leads. Check your API key.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  function onMoved() {
    fetchLeads();
  }

  function onSaved() {
    fetchLeads();
  }

  function onDeleted() {
    setDeleteLead(null);
    fetchLeads();
  }

  return (
    <div className="h-full flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Sales Funnel</h1>
          <p className="text-xs text-gray-500">{totalLeads} total leads</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchLeads}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => setShowMoveModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <Plus size={15} />
            Move Lead
          </button>
        </div>
      </div>

      {/* Error */}
      {fetchError && (
        <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          <AlertTriangle size={15} className="shrink-0" />
          {fetchError}
          <button onClick={fetchLeads} className="ml-auto text-red-500 underline text-xs">Retry</button>
        </div>
      )}

      {/* Loading overlay for board */}
      {loading && (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2 size={28} className="animate-spin" />
        </div>
      )}

      {/* Kanban board */}
      {!loading && (
        <div className="flex gap-4 overflow-x-auto pb-4 flex-1">
          {STAGES.map((stage) => {
            const leads = leadsByStage[stage] || [];
            const colors = stageColor(stage);
            return (
              <div key={stage} className="min-w-[240px] flex-shrink-0 flex flex-col">
                {/* Column header */}
                <div className={`${colors.header} rounded-t-xl px-4 py-2.5 flex items-center justify-between`}>
                  <span className="text-white text-xs font-bold tracking-wide">
                    {formatStage(stage)}
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-white/25 text-white`}>
                    {leads.length}
                  </span>
                </div>

                {/* Cards area */}
                <div className={`flex-1 border-x border-b ${colors.border} rounded-b-xl bg-gray-50 p-2 space-y-2 min-h-[120px]`}>
                  {leads.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-gray-300">
                      <ChevronDown size={20} className="mb-1 opacity-40" />
                      <p className="text-xs">No leads</p>
                    </div>
                  ) : (
                    leads.map((lead) => (
                      <LeadCard
                        key={lead.id}
                        lead={lead}
                        onEdit={setEditLead}
                        onDelete={setDeleteLead}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      {showMoveModal && (
        <MoveModal
          onClose={() => setShowMoveModal(false)}
          onMoved={onMoved}
        />
      )}
      {editLead && (
        <EditModal
          lead={editLead}
          onClose={() => setEditLead(null)}
          onSaved={onSaved}
        />
      )}
      {deleteLead && (
        <DeleteConfirm
          lead={deleteLead}
          onCancel={() => setDeleteLead(null)}
          onDeleted={onDeleted}
        />
      )}
    </div>
  );
};

export default FunnelPanel;
