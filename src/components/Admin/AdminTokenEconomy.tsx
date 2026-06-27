import React, { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import {
  Coins, TrendingUp, Gavel, History, Layers, ShieldCheck,
  IndianRupee, CheckCircle, AlertCircle, ArrowUpRight, RefreshCw,
} from "lucide-react";
import axios from "axios";
import { LAMBDA } from "../../lib/apiConfig";

const TOKEN_SPEND = LAMBDA.tokenSpend;

interface AdminStats {
  totalTokensSpent: number;
  activeBidders: number;
  activeKeywords: number;
  filledSlots: number;
  totalSlots: number;
  fillRate: number;
}
interface AdminStatsResponse {
  stats: AdminStats;
  streams: { label: string; tokens: number; pct: number }[];
  activeBids: { bidId: string; userId: string; keyword: string; bidAmount: number; totalCost: number; expiresAt: string }[];
  activePlacements: { placementId: string; userId: string; slotLabel: string; totalTokens: number; expiresAt: string }[];
}
interface LedgerEntry {
  id: string; userId: string; type: string; keyword?: string;
  slotLabel?: string; tokens: number; createdAt: string; status: string;
}
interface Slot {
  slotId: string; slotLabel: string; costPerDay: number;
  totalSlots: number; occupiedSlots: number; available: boolean;
  occupants?: { userId: string; expiresAt: string }[];
}

const PHASE_GATE_DEFAULTS = { current: 248, threshold: 250, readiness: 99.2 };

const tabFromPath = (path: string) => {
  if (path.includes("auctions")) return "auctions";
  if (path.includes("ledger")) return "ledger";
  if (path.includes("slots")) return "slots";
  if (path.includes("phase-gate")) return "phase-gate";
  return "revenue";
};

const AdminTokenEconomy: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(tabFromPath(location.pathname));
  const [statsResp, setStatsResp] = useState<AdminStatsResponse | null>(null);
  const [ledger, setLedger]       = useState<LedgerEntry[]>([]);
  const [slots, setSlots]         = useState<Slot[]>([]);
  const [loading, setLoading]     = useState(true);
  const [phaseControls, setPhaseControls] = useState([
    { label: "Keyword Auctions", active: false },
    { label: "Homepage Slots", active: false },
    { label: "Lead Unlock", active: false },
    { label: "Professional Boosts", active: false },
  ]);
  const [phaseActivated, setPhaseActivated] = useState(false);

  useEffect(() => { setActiveTab(tabFromPath(location.pathname)); }, [location.pathname]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsR, ledgerR, slotsR] = await Promise.all([
        axios.get(`${TOKEN_SPEND}/admin/stats`),
        axios.get(`${TOKEN_SPEND}/admin/ledger`),
        axios.get(`${TOKEN_SPEND}/slots`),
      ]);
      setStatsResp(statsR.data ?? null);
      setLedger(ledgerR.data?.entries ?? []);
      setSlots(slotsR.data?.slots ?? []);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const toggleControl = (idx: number) =>
    setPhaseControls(prev => prev.map((c, i) => i === idx ? { ...c, active: !c.active } : c));

  const handleActivate = () => {
    setPhaseActivated(true);
    setPhaseControls(prev => prev.map(c => ({ ...c, active: true })));
  };

  const now = new Date();
  const ledgerMonthLabel = now.toLocaleString('en-IN', { month: 'long', year: 'numeric' });

  const tabs = [
    { id: "revenue", label: "Token Revenue", icon: IndianRupee, path: "/admin/tokens/revenue" },
    { id: "auctions", label: "Live Auctions", icon: Gavel, path: "/admin/tokens/auctions" },
    { id: "ledger", label: "Token Ledger", icon: History, path: "/admin/tokens/ledger" },
    { id: "slots", label: "Slot Management", icon: Layers, path: "/admin/tokens/slots" },
    { id: "phase-gate", label: "Phase Gate", icon: ShieldCheck, path: "/admin/tokens/phase-gate" },
  ];

  const stats = statsResp?.stats;
  const streams = statsResp?.streams ?? [];
  const activeBids = statsResp?.activeBids ?? [];
  const activePlacements = statsResp?.activePlacements ?? [];
  const totalTokensSpent = stats?.totalTokensSpent ?? 0;
  const totalRevEst = totalTokensSpent * 4;

  const formatDate = (iso: string) => {
    try { return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }); }
    catch { return iso; }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Coins size={20} className="text-yellow-500" />
          <h1 className="text-lg font-bold text-gray-900">Token Economy</h1>
          <span className="ml-2 text-xs font-bold bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
            Phase Gate: {PHASE_GATE_DEFAULTS.readiness}% Ready
          </span>
        </div>
        <button onClick={fetchData} className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 mb-5 bg-gray-100 p-1 rounded-xl overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); window.history.replaceState(null, "", tab.path); }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon size={13} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Revenue */}
      {activeTab === "revenue" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: `Total Token Spend (${ledgerMonthLabel})`, value: `${totalTokensSpent.toLocaleString()} ₮`, sub: `≈ ₹${(totalRevEst / 1000).toFixed(0)}K est. revenue`, icon: Coins },
              { label: "Active Bidders", value: stats?.activeBidders ?? 0, sub: "Users with active spend", icon: TrendingUp },
              { label: "Active Bids", value: activeBids.length, sub: "Running keyword bids", icon: Gavel },
              { label: "Active Slots", value: activePlacements.length, sub: "Booked page placements", icon: ArrowUpRight },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-1">
                    <Icon size={15} className="text-yellow-500" />
                  </div>
                  <div className="text-xl font-black text-gray-900">{s.value}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{s.sub}</div>
                </div>
              );
            })}
          </div>

          {/* Revenue by stream */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="text-sm font-bold text-gray-700 mb-3">Revenue by Stream — {ledgerMonthLabel}</h3>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="space-y-2.5">
                {streams.length > 0 ? streams.map((stream) => (
                  <div key={stream.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">{stream.label}</span>
                      <span className="text-xs font-bold text-gray-900">{stream.tokens.toLocaleString()} ₮ · {stream.pct}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${Math.min(stream.pct, 100)}%` }} />
                    </div>
                  </div>
                )) : (
                  <p className="text-xs text-gray-400 text-center py-4">No spend data yet</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Live Auctions */}
      {activeTab === "auctions" && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-700">Keyword Bid Monitor — All Active Keywords</h3>
            <span className="text-xs text-gray-400">{stats?.activeBids ?? 0} active bids</span>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : activeBids.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                    <th className="px-4 py-2 text-left">Keyword</th>
                    <th className="px-4 py-2 text-left">User</th>
                    <th className="px-4 py-2 text-right">Bid/day</th>
                    <th className="px-4 py-2 text-right">Total Cost</th>
                    <th className="px-4 py-2 text-left">Expires</th>
                  </tr>
                </thead>
                <tbody>
                  {activeBids.map((row) => (
                    <tr key={row.bidId} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{row.keyword}</td>
                      <td className="px-4 py-3 text-xs text-gray-500 max-w-[120px] truncate">{row.userId}</td>
                      <td className="px-4 py-3 text-right font-bold text-gray-900">{row.bidAmount} ₮</td>
                      <td className="px-4 py-3 text-right text-gray-600">{row.totalCost} ₮</td>
                      <td className="px-4 py-3 text-xs text-gray-400">{formatDate(row.expiresAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-sm text-gray-400">No active keyword bids yet</div>
          )}
        </div>
      )}

      {/* Token Ledger */}
      {activeTab === "ledger" && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-700">Token Transaction Ledger — {ledgerMonthLabel}</h3>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : ledger.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">User</th>
                    <th className="px-4 py-2 text-left">Type</th>
                    <th className="px-4 py-2 text-left">Description</th>
                    <th className="px-4 py-2 text-right">Tokens</th>
                    <th className="px-4 py-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ledger.map((row, i) => (
                    <tr key={row.id ?? i} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-2.5 text-xs text-gray-500 whitespace-nowrap">{formatDate(row.createdAt)}</td>
                      <td className="px-4 py-2.5 text-xs text-gray-700 font-medium max-w-[120px] truncate">{row.userId}</td>
                      <td className="px-4 py-2.5 text-xs text-gray-600 capitalize">{row.type}</td>
                      <td className="px-4 py-2.5 text-xs text-gray-500 max-w-[140px] truncate">
                        {row.keyword ?? row.slotLabel ?? "—"}
                      </td>
                      <td className={`px-4 py-2.5 text-right text-xs font-bold ${row.tokens >= 0 ? "text-green-600" : "text-red-500"}`}>
                        {row.tokens >= 0 ? `+${row.tokens}` : row.tokens} ₮
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          row.status === "active" ? "bg-green-100 text-green-700" :
                          row.status === "expired" ? "bg-gray-100 text-gray-500" :
                          row.status === "cancelled" ? "bg-red-100 text-red-600" :
                          "bg-blue-100 text-blue-700"
                        }`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-sm text-gray-400">No transactions yet</div>
          )}
        </div>
      )}

      {/* Slot Management */}
      {activeTab === "slots" && (
        <div className="space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : slots.length > 0 ? slots.map((slot) => {
            const fillPct = slot.totalSlots > 0 ? Math.round((slot.occupiedSlots / slot.totalSlots) * 100) : 0;
            const statusLabel = slot.occupiedSlots >= slot.totalSlots ? "Full" : slot.occupiedSlots > 0 ? "Partial" : "Available";
            const statusColor = slot.occupiedSlots >= slot.totalSlots
              ? "bg-yellow-50 text-yellow-700"
              : slot.occupiedSlots > 0 ? "bg-blue-50 text-blue-700" : "bg-green-50 text-green-700";
            return (
              <div key={slot.slotId} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-bold text-gray-900">{slot.slotLabel}</span>
                    <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{slot.slotId}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {slot.occupiedSlots}/{slot.totalSlots} slots · {slot.costPerDay} ₮/day
                  </div>
                  <div className="mt-2 h-1.5 bg-gray-100 rounded-full w-32 overflow-hidden">
                    <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${fillPct}%` }} />
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 ${statusColor}`}>
                    {statusLabel === "Full" || statusLabel === "Partial"
                      ? <AlertCircle size={11} />
                      : <CheckCircle size={11} />}
                    {statusLabel}
                  </span>
                </div>
              </div>
            );
          }) : (
            <div className="py-12 text-center text-sm text-gray-400">No slots data</div>
          )}
        </div>
      )}

      {/* Phase Gate */}
      {activeTab === "phase-gate" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-bold text-gray-700 mb-1">
              Token Economy Activation — Phase Gate
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Token economy activates automatically at 250 active listings. You can also force-activate manually.
            </p>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-gray-900">
                {PHASE_GATE_DEFAULTS.current} / {PHASE_GATE_DEFAULTS.threshold} active listings
              </span>
              <span className="text-sm font-black text-orange-600">{PHASE_GATE_DEFAULTS.readiness}% ready</span>
            </div>
            <div className="h-4 bg-gray-100 rounded-full overflow-hidden mb-5">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all"
                style={{ width: `${PHASE_GATE_DEFAULTS.readiness}%` }}
              />
            </div>
            {phaseActivated ? (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-green-700 text-sm font-bold">
                <CheckCircle size={16} className="text-green-500" />
                Token Economy is LIVE — all features enabled
              </div>
            ) : (
              <button
                onClick={handleActivate}
                className="px-4 py-2.5 rounded-xl bg-yellow-400 text-black text-sm font-black hover:bg-yellow-300 transition-colors flex items-center gap-2"
              >
                <Coins size={15} />
                Activate Token Economy Now
              </button>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="text-sm font-bold text-gray-700 mb-3">Feature Controls</h3>
            <div className="space-y-2">
              {phaseControls.map((ctrl, idx) => (
                <div key={ctrl.label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="text-sm text-gray-700">{ctrl.label}</span>
                  <button
                    onClick={() => toggleControl(idx)}
                    className={`w-10 h-5 rounded-full transition-all relative ${ctrl.active ? "bg-green-500" : "bg-gray-200"}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow ${ctrl.active ? "translate-x-5" : "translate-x-0"}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTokenEconomy;
