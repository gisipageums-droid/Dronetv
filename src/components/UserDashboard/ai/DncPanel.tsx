import React, { useState, useEffect, useCallback } from "react";
import {
  Shield,
  PhoneOff,
  Plus,
  Search,
  X,
  Loader2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { dncApi, type DncNumber, type DncRemovalRequest } from "./echoleadsApi";

// ---------- Badges ----------
function DndStatusBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-100 text-red-600">
      <PhoneOff size={11} />
      IN DND
    </span>
  );
}

function RemovalStatusBadge({ status }: { status?: string }) {
  if (!status) return <span className="text-xs text-gray-400">—</span>;
  const map: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-600",
  };
  const cls = map[status.toLowerCase()] || "bg-gray-100 text-gray-500";
  return (
    <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full ${cls}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// ---------- Add Numbers Modal ----------
function AddNumbersModal({ onClose, onAdded }: { onClose: () => void; onAdded: () => void }) {
  const [mode, setMode] = useState<"single" | "bulk">("single");
  const [single, setSingle] = useState("");
  const [bulk, setBulk] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ added: number; skipped: number } | null>(null);
  const [error, setError] = useState("");

  function parsePhones(): string[] {
    const raw = mode === "single" ? single : bulk;
    return raw
      .split(/[\n,\s]+/)
      .map((p) => p.trim())
      .filter(Boolean);
  }

  async function submit() {
    const phones = parsePhones();
    if (phones.length === 0) { setError("Enter at least one phone number."); return; }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await dncApi.add(phones);
      setResult({ added: res.data.added_count, skipped: res.data.skipped_count });
      onAdded();
    } catch {
      setError("Failed to add numbers. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <PhoneOff size={18} className="text-red-500" />
            <h3 className="text-base font-bold text-gray-900">Add DNC Number</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Mode toggle */}
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-2">Add Mode</p>
            <div className="flex gap-2">
              {(["single", "bulk"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setError(""); setResult(null); }}
                  className={`px-4 py-1.5 text-sm font-semibold rounded-lg border transition-all ${
                    mode === m
                      ? "bg-amber-400 border-amber-400 text-white"
                      : "bg-white border-gray-200 text-gray-600 hover:border-amber-300"
                  }`}
                >
                  {m === "single" ? "Single Number" : "Bulk Add"}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              <AlertTriangle size={15} className="shrink-0" />
              {error}
            </div>
          )}
          {result && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
              <CheckCircle2 size={15} className="shrink-0" />
              Added {result.added}, skipped {result.skipped}
            </div>
          )}

          {mode === "single" ? (
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Number</label>
              <input
                value={single}
                onChange={(e) => setSingle(e.target.value)}
                placeholder="Enter phone number (e.g., 1234567890)"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 font-mono"
              />
              <p className="text-xs text-gray-400 mt-1">Enter a single phone number (digits only)</p>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Numbers</label>
              <textarea
                value={bulk}
                onChange={(e) => setBulk(e.target.value)}
                rows={6}
                placeholder={"Enter phone numbers separated by commas, spaces, or new lines\nExample: 1234567890, 9876543210\nOr:\n1234567890\n9876543210"}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none font-mono"
              />
              <p className="text-xs text-gray-400 mt-1">You can enter multiple phone numbers separated by commas, spaces, or new lines</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
          >
            {result ? "Close" : "Cancel"}
          </button>
          {!result && (
            <button
              onClick={submit}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 bg-amber-400 hover:bg-amber-500 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60"
            >
              {loading ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
              {mode === "single" ? "Add Number" : "Add Numbers"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------- Request Removal Modal ----------
function RequestRemovalModal({
  ids,
  onClose,
  onRequested,
}: {
  ids: number[];
  onClose: () => void;
  onRequested: () => void;
}) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setLoading(true);
    setError("");
    try {
      await dncApi.requestRemoval(ids, reason.trim() || undefined);
      onRequested();
      onClose();
    } catch {
      setError("Failed to submit removal request. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-amber-600" />
            <h3 className="text-base font-bold text-gray-900">Request DNC Removal</h3>
          </div>
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
          <p className="text-sm text-gray-600">
            Requesting removal for <span className="font-semibold">{ids.length} number{ids.length !== 1 ? "s" : ""}</span>.
          </p>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Reason (optional)</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="Explain why these numbers should be removed from DNC…"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
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
            {loading ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- DNC Numbers Tab ----------
function DncNumbersTab() {
  const [numbers, setNumbers] = useState<DncNumber[]>([]);
  const [pagination, setPagination] = useState<{ current_page: number; total_pages: number; per_page: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [showAddModal, setShowAddModal] = useState(false);
  const [removalIds, setRemovalIds] = useState<number[] | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const fetchNumbers = useCallback(async (p = 1, q = "") => {
    setLoading(true);
    setFetchError("");
    try {
      const res = await dncApi.list(p, 20, q);
      setNumbers(res.data.dnc_numbers || []);
      setPagination(res.data.pagination || null);
      setSelected(new Set());
    } catch {
      setFetchError("Failed to load DNC numbers.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNumbers(page, search);
  }, [page, fetchNumbers]);

  function handleSearch(val: string) {
    setSearch(val);
    setPage(1);
    fetchNumbers(1, val);
  }

  const allIds = numbers.map((n) => n.id);
  const allSelected = allIds.length > 0 && allIds.every((id) => selected.has(id));

  function toggleAll() {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(allIds));
    }
  }

  function toggleOne(id: number) {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const selectedCount = selected.size;

  return (
    <div className="flex flex-col gap-4">
      {/* Controls */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[160px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search numbers…"
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
          />
        </div>
        {selectedCount > 0 && (
          <button
            onClick={() => setRemovalIds(Array.from(selected))}
            className="flex items-center gap-1.5 px-3 py-2 bg-amber-400 hover:bg-amber-500 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <Shield size={14} />
            Request Removal ({selectedCount})
          </button>
        )}
        <button
          onClick={() => fetchNumbers(page, search)}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="Refresh"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
        </button>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <Plus size={15} />
          Add Numbers
        </button>
      </div>

      {fetchError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          <AlertTriangle size={15} className="shrink-0" />
          {fetchError}
          <button onClick={() => fetchNumbers(page, search)} className="ml-auto text-red-500 underline text-xs">
            Retry
          </button>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400">
          <Loader2 size={26} className="animate-spin" />
        </div>
      ) : numbers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <PhoneOff size={34} className="mb-3 opacity-40" />
          <p className="text-sm font-medium">No DNC numbers</p>
          <p className="text-xs mt-1">Add numbers to the Do Not Call list.</p>
        </div>
      ) : (
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-2 pr-3 text-left w-8">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="rounded border-gray-300 accent-amber-400"
                  />
                </th>
                <th className="pb-2 pr-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Phone</th>
                <th className="pb-2 pr-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="pb-2 pr-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Added By</th>
                <th className="pb-2 pr-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Removal Request</th>
                <th className="pb-2 pr-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Date</th>
                <th className="pb-2 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {numbers.map((n) => (
                <tr
                  key={n.id}
                  className={`border-b border-gray-50 hover:bg-amber-50/40 transition-colors ${selected.has(n.id) ? "bg-amber-50" : ""}`}
                >
                  <td className="py-3 pr-3">
                    <input
                      type="checkbox"
                      checked={selected.has(n.id)}
                      onChange={() => toggleOne(n.id)}
                      className="rounded border-gray-300 accent-amber-400"
                    />
                  </td>
                  <td className="py-3 pr-3 font-mono text-xs text-gray-800">{n.phone}</td>
                  <td className="py-3 pr-3">
                    <DndStatusBadge />
                  </td>
                  <td className="py-3 pr-3 text-xs text-gray-500 hidden md:table-cell">{n.user_name || "—"}</td>
                  <td className="py-3 pr-3 hidden md:table-cell">
                    <RemovalStatusBadge status={n.removal_request_status} />
                  </td>
                  <td className="py-3 pr-3 text-xs text-gray-400 hidden lg:table-cell">
                    {new Date(n.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => setRemovalIds([n.id])}
                      className="text-xs px-2.5 py-1 border border-amber-300 text-amber-700 hover:bg-amber-50 rounded-lg font-semibold transition-colors"
                      title="Request Removal"
                    >
                      Request Removal
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.total_pages > 1 && (
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Page {pagination.current_page} of {pagination.total_pages}
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
      {showAddModal && (
        <AddNumbersModal
          onClose={() => setShowAddModal(false)}
          onAdded={() => fetchNumbers(page, search)}
        />
      )}
      {removalIds && (
        <RequestRemovalModal
          ids={removalIds}
          onClose={() => setRemovalIds(null)}
          onRequested={() => { setSelected(new Set()); fetchNumbers(page, search); }}
        />
      )}
    </div>
  );
}

// ---------- Removal Requests Tab ----------
function RemovalRequestsTab() {
  const [requests, setRequests] = useState<DncRemovalRequest[]>([]);
  const [pagination, setPagination] = useState<{ current_page: number; total_pages: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [page, setPage] = useState(1);

  const fetchRequests = useCallback(async (p = 1) => {
    setLoading(true);
    setFetchError("");
    try {
      const res = await dncApi.getRemovalRequests(p, 20);
      setRequests(res.data.requests || []);
      setPagination(res.data.pagination || null);
    } catch {
      setFetchError("Failed to load removal requests.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests(page);
  }, [page, fetchRequests]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-end">
        <button
          onClick={() => fetchRequests(page)}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="Refresh"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {fetchError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          <AlertTriangle size={15} className="shrink-0" />
          {fetchError}
          <button onClick={() => fetchRequests(page)} className="ml-auto text-red-500 underline text-xs">
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400">
          <Loader2 size={26} className="animate-spin" />
        </div>
      ) : requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <Shield size={34} className="mb-3 opacity-40" />
          <p className="text-sm font-medium">No removal requests</p>
          <p className="text-xs mt-1">Submitted removal requests will appear here.</p>
        </div>
      ) : (
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-2 pr-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Phone</th>
                <th className="pb-2 pr-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Reason</th>
                <th className="pb-2 pr-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="pb-2 pr-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Admin Notes</th>
                <th className="pb-2 pr-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Created</th>
                <th className="pb-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Reviewed</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id} className="border-b border-gray-50 hover:bg-amber-50/40 transition-colors">
                  <td className="py-3 pr-3 font-mono text-xs text-gray-800">{r.phone}</td>
                  <td className="py-3 pr-3 text-xs text-gray-500 hidden md:table-cell max-w-[160px] truncate">
                    {r.reason || "—"}
                  </td>
                  <td className="py-3 pr-3">
                    <RemovalStatusBadge status={r.status} />
                  </td>
                  <td className="py-3 pr-3 text-xs text-gray-500 hidden lg:table-cell max-w-[160px] truncate">
                    {r.admin_notes || "—"}
                  </td>
                  <td className="py-3 pr-3 text-xs text-gray-400 hidden md:table-cell">
                    {new Date(r.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 text-xs text-gray-400 hidden lg:table-cell">
                    {r.reviewed_at ? new Date(r.reviewed_at).toLocaleDateString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.total_pages > 1 && (
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Page {pagination.current_page} of {pagination.total_pages}
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
    </div>
  );
}

// ---------- Main Panel ----------
const DncPanel: React.FC = () => {
  if (!localStorage.getItem("echoleads_api_key")) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20 text-gray-400">
        <p className="text-sm font-medium">Not connected</p>
        <p className="text-xs mt-1">Go to the Authentication tab first.</p>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState<"dnc" | "requests">("dnc");

  const tabs: { id: "dnc" | "requests"; label: string }[] = [
    { id: "dnc", label: "DNC Numbers" },
    { id: "requests", label: "Removal Requests" },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center">
          <Shield size={20} className="text-red-500" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900">Do Not Call</h1>
          <p className="text-xs text-gray-500">Manage DNC numbers and removal requests</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-5 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${
              activeTab === tab.id
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "dnc" ? <DncNumbersTab /> : <RemovalRequestsTab />}
      </div>
    </div>
  );
};

export default DncPanel;
