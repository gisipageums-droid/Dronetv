import React, { useState, useEffect, useCallback } from "react";
import {
  PhoneCall,
  Play,
  RefreshCw,
  Loader2,
  X,
  Plus,
  AlertTriangle,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Mic,
  Clock,
} from "lucide-react";
import { callLogsApi, type CallLog, type CallLogsParams } from "./echoleadsApi";

// ---------- Status badge ----------
function StatusBadge({ status }: { status?: string }) {
  if (!status) return null;
  let cls = "bg-ink-light text-ink-caption";
  if (status === "ended") cls = "bg-status-success/15 text-status-success";
  else if (status === "failed") cls = "bg-status-error/15 text-status-error";
  else if (status === "queued") cls = "bg-brand-yellow-soft text-brand-gold";
  return (
    <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${cls}`}>
      {status}
    </span>
  );
}

// ---------- Make Call Modal ----------
interface MakeCallModalProps {
  onClose: () => void;
  onRefresh: () => void;
}

function MakeCallModal({ onClose, onRefresh }: MakeCallModalProps) {
  const [phone, setPhone] = useState("");
  const [aId, setAId] = useState("");
  const [firstMessage, setFirstMessage] = useState("");
  const [fromNumber, setFromNumber] = useState("");
  const [campaignId, setCampaignId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successId, setSuccessId] = useState("");

  useEffect(() => {
    if (!successId) return;
    const t = setTimeout(() => {
      onRefresh();
      onClose();
    }, 3000);
    return () => clearTimeout(t);
  }, [successId, onRefresh, onClose]);

  async function submit() {
    if (!phone.trim()) { setError("Phone number is required."); return; }
    setLoading(true);
    setError("");
    try {
      const res = await callLogsApi.create({
        phone: phone.trim(),
        a_id: aId.trim() || undefined,
        firstMessage: firstMessage.trim() || undefined,
        from_number: fromNumber.trim() || undefined,
        campaign_id: campaignId ? Number(campaignId) : undefined,
      });
      const callId = res.data?.data?.id || res.data?.data?.data?.id || "";
      setSuccessId(String(callId));
    } catch {
      setError("Failed to initiate call. Check your API key and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[10000000] flex items-center justify-center bg-ink/40 backdrop-blur-sm px-4">
      <div className="bg-surface-card rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-ink-light">
          <h3 className="text-base font-bold text-ink flex items-center gap-2">
            <PhoneCall size={18} className="text-brand-gold" />
            Make a Call
          </h3>
          <button onClick={onClose} className="text-ink-caption hover:text-ink-paragraph transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-status-error/10 border border-status-error/25 rounded-lg text-sm text-status-error">
              <AlertTriangle size={15} className="shrink-0" />
              {error}
            </div>
          )}

          {successId && (
            <div className="p-3 bg-status-success/10 border border-status-success/25 rounded-lg text-sm text-status-success font-medium">
              Call initiated! ID: <span className="font-mono">{successId}</span> — closing…
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-ink-paragraph mb-1">Phone Number * (E.164)</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+14155550100"
              className="w-full border border-ink-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-ink-paragraph mb-1">Agent Assistant ID</label>
              <input
                value={aId}
                onChange={(e) => setAId(e.target.value)}
                placeholder="optional"
                className="w-full border border-ink-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-paragraph mb-1">From Number</label>
              <input
                type="tel"
                value={fromNumber}
                onChange={(e) => setFromNumber(e.target.value)}
                placeholder="optional"
                className="w-full border border-ink-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-paragraph mb-1">First Message</label>
            <input
              value={firstMessage}
              onChange={(e) => setFirstMessage(e.target.value)}
              placeholder="Hello, I'm calling about..."
              className="w-full border border-ink-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-paragraph mb-1">Campaign ID</label>
            <input
              type="number"
              value={campaignId}
              onChange={(e) => setCampaignId(e.target.value)}
              placeholder="optional"
              className="w-full border border-ink-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-ink-light">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-ink-paragraph hover:text-ink-charcoal transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={loading || !!successId}
            className="flex items-center gap-2 px-5 py-2 bg-brand-yellow hover:bg-brand-gold text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <PhoneCall size={15} />}
            Call Now
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Call Row ----------
interface CallRowProps {
  log: CallLog;
}

function CallRow({ log }: CallRowProps) {
  const [expanded, setExpanded] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);

  const contactName = log.contact
    ? `${log.contact.firstName}${log.contact.phone ? ` · ${log.contact.phone}` : ""}`
    : null;

  return (
    <div
      className="bg-surface-card border border-ink-light rounded-xl hover:border-brand-yellow-soft transition-all"
    >
      <div
        className="flex items-center gap-3 p-3 cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="w-9 h-9 bg-surface-main rounded-xl flex items-center justify-center shrink-0">
          <PhoneCall size={16} className="text-brand-gold" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-ink">{log.phone || "—"}</span>
            <StatusBadge status={log.status} />
            {log.call_total_time && (
              <span className="inline-flex items-center gap-1 text-xs text-ink-caption">
                <Clock size={11} />
                {log.call_total_time}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap mt-0.5">
            {contactName && (
              <span className="text-xs text-ink-caption">{contactName}</span>
            )}
            {log.campaign && (
              <span className="text-xs text-ink-caption">· {log.campaign.campaign_name}</span>
            )}
            {log.agent && (
              <span className="text-xs text-ink-caption flex items-center gap-0.5">
                · <Mic size={10} /> {log.agent.name}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-ink-caption hidden sm:block">
            {new Date(log.created_at).toLocaleDateString()}
          </span>
          <ChevronDown
            size={15}
            className={`text-ink-light transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      {expanded && (
        <div className="border-t border-ink-light px-4 pb-4 pt-3 space-y-3">
          <p className="text-xs text-ink-caption">
            {new Date(log.created_at).toLocaleString()}
          </p>

          {log.recording_url && (
            <div className="space-y-2">
              <button
                onClick={(e) => { e.stopPropagation(); setShowPlayer((v) => !v); }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-gold hover:text-brand-yellow transition-colors"
              >
                <Play size={12} />
                {showPlayer ? "Hide Recording" : "Play Recording"}
              </button>
              {showPlayer && (
                <audio
                  controls
                  autoPlay
                  src={log.recording_url}
                  className="w-full h-9"
                  onClick={(e) => e.stopPropagation()}
                />
              )}
            </div>
          )}

          {log.transcript ? (
            <div>
              <p className="text-xs font-semibold text-ink-caption mb-1 flex items-center gap-1">
                <Mic size={11} /> Transcript
              </p>
              <p className="text-xs text-ink-paragraph whitespace-pre-wrap leading-relaxed bg-ink-offwhite rounded-lg p-3 max-h-48 overflow-y-auto">
                {log.transcript}
              </p>
            </div>
          ) : (
            <p className="text-xs text-ink-light">No transcript available.</p>
          )}
        </div>
      )}
    </div>
  );
}

const LIMIT = 50;

// ---------- Main Panel ----------
const CallLogsPanel: React.FC = () => {
  if (!localStorage.getItem("echoleads_api_key")) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20 text-ink-caption">
        <p className="text-sm font-medium">Not connected</p>
        <p className="text-xs mt-1">Go to Authentication tab first.</p>
      </div>
    );
  }

  const [logs, setLogs] = useState<CallLog[]>([]);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [showCallModal, setShowCallModal] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(true);

  // Filters
  const [status, setStatus] = useState("");
  const [campaignId, setCampaignId] = useState("");
  const [agentId, setAgentId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isTestCall, setIsTestCall] = useState(false);
  const [limitVal] = useState(LIMIT);

  // Active params (applied on search)
  const [activeParams, setActiveParams] = useState<CallLogsParams>({ limit: LIMIT, offset: 0 });

  const fetchLogs = useCallback(async (params: CallLogsParams) => {
    setLoading(true);
    setFetchError("");
    try {
      const res = await callLogsApi.list(params);
      const d = res.data as { calls?: CallLog[]; total_count?: number };
      setLogs(d.calls || []);
      setTotalCount(d.total_count ?? null);
    } catch {
      setFetchError("Failed to load call logs. Check your API key.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs(activeParams);
  }, [activeParams, fetchLogs]);

  function applyFilters() {
    const params: CallLogsParams = {
      limit: limitVal,
      offset: 0,
      ...(status.trim() && { status: status.trim() }),
      ...(campaignId && { campaign_id: Number(campaignId) }),
      ...(agentId && { agent_id: Number(agentId) }),
      ...(fromDate && { from_date: fromDate }),
      ...(toDate && { to_date: toDate }),
      ...(isTestCall && { is_test_call: true }),
    };
    setOffset(0);
    setActiveParams(params);
  }

  function clearFilters() {
    setStatus("");
    setCampaignId("");
    setAgentId("");
    setFromDate("");
    setToDate("");
    setIsTestCall(false);
    const params: CallLogsParams = { limit: LIMIT, offset: 0 };
    setOffset(0);
    setActiveParams(params);
  }

  function goNext() {
    const next = offset + LIMIT;
    const params = { ...activeParams, offset: next };
    setOffset(next);
    setActiveParams(params);
  }

  function goPrev() {
    const prev = Math.max(0, offset - LIMIT);
    const params = { ...activeParams, offset: prev };
    setOffset(prev);
    setActiveParams(params);
  }

  const currentPage = Math.floor(offset / LIMIT) + 1;
  const hasNext = totalCount != null ? offset + LIMIT < totalCount : logs.length === LIMIT;
  const hasPrev = offset > 0;

  return (
    <div className="h-full flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <div>
          <h1 className="text-lg font-bold text-ink">Call Logs</h1>
          <p className="text-xs text-ink-caption">
            {totalCount != null ? `${totalCount} total calls` : `${logs.length} calls loaded`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchLogs(activeParams)}
            className="p-2 text-ink-caption hover:text-ink-paragraph hover:bg-ink-light rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => setShowCallModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-yellow hover:bg-brand-gold text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <PhoneCall size={15} />
            Make Call
          </button>
        </div>
      </div>

      {/* Filters panel */}
      <div className="mb-4 border border-ink-light rounded-xl overflow-hidden">
        <button
          className="w-full flex items-center justify-between px-4 py-3 bg-ink-offwhite hover:bg-ink-light transition-colors text-sm font-semibold text-ink-paragraph"
          onClick={() => setFiltersOpen((v) => !v)}
        >
          <span className="flex items-center gap-2">
            <Filter size={14} className="text-brand-gold" />
            Filters
          </span>
          <ChevronDown size={15} className={`text-ink-caption transition-transform ${filtersOpen ? "rotate-180" : ""}`} />
        </button>

        {filtersOpen && (
          <div className="p-4 space-y-3 bg-surface-card">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-semibold text-ink-paragraph mb-1">Status</label>
                <input
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  placeholder="ended, failed…"
                  className="w-full border border-ink-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-paragraph mb-1">Campaign ID</label>
                <input
                  type="number"
                  value={campaignId}
                  onChange={(e) => setCampaignId(e.target.value)}
                  placeholder="optional"
                  className="w-full border border-ink-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-paragraph mb-1">Agent ID</label>
                <input
                  type="number"
                  value={agentId}
                  onChange={(e) => setAgentId(e.target.value)}
                  placeholder="optional"
                  className="w-full border border-ink-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-ink-paragraph mb-1">From Date</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full border border-ink-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-paragraph mb-1">To Date</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full border border-ink-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <label className="flex items-center gap-2 text-sm text-ink-paragraph cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isTestCall}
                  onChange={(e) => setIsTestCall(e.target.checked)}
                  className="w-4 h-4 accent-brand-yellow"
                />
                Test calls only
              </label>

              <div className="ml-auto flex items-center gap-3">
                <button
                  onClick={clearFilters}
                  className="text-xs text-ink-caption hover:text-ink-paragraph underline transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={applyFilters}
                  className="flex items-center gap-2 px-4 py-2 bg-brand-yellow hover:bg-brand-gold text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {fetchError && (
        <div className="flex items-center gap-2 p-3 mb-4 bg-status-error/10 border border-status-error/25 rounded-lg text-sm text-status-error">
          <AlertTriangle size={15} className="shrink-0" />
          {fetchError}
          <button onClick={() => fetchLogs(activeParams)} className="ml-auto text-status-error underline text-xs">Retry</button>
        </div>
      )}

      {/* Logs list */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-ink-caption">
            <Loader2 size={28} className="animate-spin" />
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-ink-caption">
            <PhoneCall size={36} className="mb-3 opacity-30" />
            <p className="text-sm font-medium">No call logs found</p>
            <p className="text-xs mt-1">Try adjusting your filters or make a call.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {logs.map((log) => (
              <CallRow key={log.id} log={log} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {(hasPrev || hasNext) && (
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-ink-light">
          <p className="text-xs text-ink-caption">
            Page {currentPage}
            {totalCount != null && ` · ${totalCount} total`}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={goPrev}
              disabled={!hasPrev || loading}
              className="p-1.5 border border-ink-light rounded-lg text-ink-caption hover:bg-ink-offwhite disabled:opacity-40 transition-colors"
            >
              <ChevronLeft size={15} />
            </button>
            <button
              onClick={goNext}
              disabled={!hasNext || loading}
              className="p-1.5 border border-ink-light rounded-lg text-ink-caption hover:bg-ink-offwhite disabled:opacity-40 transition-colors"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Make Call modal */}
      {showCallModal && (
        <MakeCallModal
          onClose={() => setShowCallModal(false)}
          onRefresh={() => fetchLogs(activeParams)}
        />
      )}
    </div>
  );
};

export default CallLogsPanel;
