import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Coins, TrendingUp, Gavel, History, Layers, ShieldCheck,
  IndianRupee, CheckCircle, AlertCircle, ArrowUpRight,
} from "lucide-react";

const MOCK_REVENUE = {
  total: 498000,
  mom: 23,
  streams: [
    { label: "Token Purchases", amount: 358000, pct: 72 },
    { label: "Keyword Auction Wins", amount: 72000, pct: 14 },
    { label: "Homepage Placements", amount: 43000, pct: 9 },
    { label: "Lead Unlocks", amount: 24000, pct: 5 },
    { label: "Professional Boosts", amount: 1000, pct: 0.2 },
  ],
  activeBidders: 47,
  fillRate: 82,
  velocity: 0.78,
};

const MOCK_AUCTIONS = [
  { keyword: "Defence UAV", slots: 3, filled: 3, topBidder: "ideaForge Technology", winBid: 12, dailyRev: 27, status: "live" },
  { keyword: "Agriculture Drone", slots: 3, filled: 2, topBidder: "IoTechWorld Avigation", winBid: 10, dailyRev: 18, status: "live" },
  { keyword: "GIS Mapping Drone", slots: 3, filled: 1, topBidder: "Asteria Aerospace", winBid: 7, dailyRev: 7, status: "partial" },
  { keyword: "NDVI Mapping", slots: 3, filled: 0, topBidder: "—", winBid: 0, dailyRev: 0, status: "vacant" },
  { keyword: "Commercial Drone", slots: 3, filled: 2, topBidder: "Throttle Aerospace", winBid: 9, dailyRev: 16, status: "live" },
  { keyword: "DGCA Training", slots: 3, filled: 1, topBidder: "Skylark Drones", winBid: 5, dailyRev: 5, status: "partial" },
];

const MOCK_LEDGER = [
  { date: "10 Jun", company: "ideaForge Technology", type: "Purchase", tokens: 2000, amount: 8000, status: "credit" },
  { date: "10 Jun", company: "ideaForge Technology", type: "Keyword Bid", tokens: -49, amount: -196, status: "debit" },
  { date: "11 Jun", company: "Asteria Aerospace", type: "Purchase", tokens: 5000, amount: 18000, status: "credit" },
  { date: "12 Jun", company: "ideaForge Technology", type: "Lead Unlock", tokens: -10, amount: -40, status: "debit" },
  { date: "13 Jun", company: "IoTechWorld Avigation", type: "Purchase", tokens: 2000, amount: 8000, status: "credit" },
  { date: "13 Jun", company: "ideaForge Technology", type: "HP-2 Placement", tokens: -300, amount: -1200, status: "debit" },
  { date: "14 Jun", company: "ideaForge Technology", type: "Outbid Refund", tokens: 56, amount: 224, status: "credit" },
  { date: "15 Jun", company: "Skylark Drones", type: "Purchase", tokens: 500, amount: 2500, status: "credit" },
];

const MOCK_SLOTS = [
  { id: "HP-1", label: "Hero Banner", type: "Subscription", status: "active", holder: "ideaForge Technology (Brand)", revenue: 0 },
  { id: "HP-2", label: "Featured Strip — Slot A", type: "Token", status: "active", holder: "ideaForge Technology", revenue: 300 },
  { id: "HP-3", label: "Featured Strip — Slot B", type: "Token", status: "taken", holder: "Asteria Aerospace", revenue: 300 },
  { id: "HP-4", label: "Sponsored News Article", type: "Token", status: "available", holder: "—", revenue: 0 },
  { id: "HP-5", label: "Ticker Announcement", type: "Token", status: "available", holder: "—", revenue: 0 },
];

const PHASE_GATE_DEFAULTS = {
  current: 248,
  threshold: 250,
  readiness: 99.2,
};

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
  const [phaseControls, setPhaseControls] = useState([
    { label: "Keyword Auctions", active: false },
    { label: "Homepage Slots", active: false },
    { label: "Lead Unlock", active: false },
    { label: "Professional Boosts", active: false },
  ]);
  const [phaseActivated, setPhaseActivated] = useState(false);

  useEffect(() => {
    setActiveTab(tabFromPath(location.pathname));
  }, [location.pathname]);

  const toggleControl = (idx: number) => {
    setPhaseControls(prev => prev.map((c, i) => i === idx ? { ...c, active: !c.active } : c));
  };

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

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <Coins size={20} className="text-yellow-500" />
        <h1 className="text-lg font-bold text-gray-900">Token Economy</h1>
        <span className="ml-2 text-xs font-bold bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
          Phase Gate: {PHASE_GATE.readiness}% Ready
        </span>
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
                activeTab === tab.id
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
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
          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total Tokens Sold (Jun)", value: "1,24,500 ₮", sub: `≈ ₹${(MOCK_REVENUE.total / 1000).toFixed(0)}K revenue`, icon: Coins, up: true, pct: MOCK_REVENUE.mom },
              { label: "Active Bidders", value: MOCK_REVENUE.activeBidders, sub: "Keyword + placement bids", icon: TrendingUp, up: true },
              { label: "Auction Fill Rate", value: `${MOCK_REVENUE.fillRate}%`, sub: "Slots with active bids", icon: Gavel, up: true },
              { label: "Token Velocity", value: MOCK_REVENUE.velocity, sub: "Spend/purchase ratio", icon: ArrowUpRight, up: false },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-1">
                    <Icon size={15} className="text-yellow-500" />
                    {s.pct && (
                      <span className="text-xs text-green-600 font-bold">↑ {s.pct}% MoM</span>
                    )}
                  </div>
                  <div className="text-xl font-black text-gray-900">{s.value}</div>
                  <div className="text-xs text-gray-400">{s.sub}</div>
                </div>
              );
            })}
          </div>

          {/* Revenue by stream */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="text-sm font-bold text-gray-700 mb-3">Revenue by Stream — {ledgerMonthLabel}</h3>
            <div className="space-y-2.5">
              {MOCK_REVENUE.streams.map((s) => (
                <div key={s.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">{s.label}</span>
                    <span className="text-xs font-bold text-gray-900">
                      ₹{(s.amount / 1000).toFixed(0)}K · {s.pct}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full"
                      style={{ width: `${s.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Live Auctions */}
      {activeTab === "auctions" && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-700">Live Auction Monitor — All Keywords</h3>
            <span className="text-xs text-gray-400">Next cycle: 00:00 IST</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                  <th className="px-4 py-2 text-left">Keyword</th>
                  <th className="px-4 py-2 text-center">Slots</th>
                  <th className="px-4 py-2 text-left">Top Bidder</th>
                  <th className="px-4 py-2 text-right">Win Bid</th>
                  <th className="px-4 py-2 text-right">Daily Rev.</th>
                  <th className="px-4 py-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_AUCTIONS.map((row) => (
                  <tr key={row.keyword} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{row.keyword}</td>
                    <td className="px-4 py-3 text-center text-gray-500">{row.filled}/{row.slots}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{row.topBidder}</td>
                    <td className="px-4 py-3 text-right font-bold text-gray-900">
                      {row.winBid > 0 ? `${row.winBid} ₮` : "—"}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      {row.dailyRev > 0 ? `${row.dailyRev} ₮` : "₹0"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        row.status === "live" ? "bg-green-100 text-green-700" :
                        row.status === "partial" ? "bg-yellow-100 text-yellow-700" :
                        "bg-gray-100 text-gray-500"
                      }`}>
                        {row.status === "live" ? "🟢 Live" : row.status === "partial" ? "🟡 Partial" : "⬜ Vacant"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Token Ledger */}
      {activeTab === "ledger" && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-700">Token Transaction Ledger — {ledgerMonthLabel}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Company</th>
                  <th className="px-4 py-2 text-left">Type</th>
                  <th className="px-4 py-2 text-right">Tokens</th>
                  <th className="px-4 py-2 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_LEDGER.map((row, i) => (
                  <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-2.5 text-xs text-gray-500">{row.date}</td>
                    <td className="px-4 py-2.5 text-xs text-gray-700 font-medium">{row.company}</td>
                    <td className="px-4 py-2.5 text-xs text-gray-600">{row.type}</td>
                    <td className={`px-4 py-2.5 text-right text-xs font-bold ${row.status === "credit" ? "text-green-600" : "text-red-500"}`}>
                      {row.tokens > 0 ? `+${row.tokens}` : row.tokens} ₮
                    </td>
                    <td className={`px-4 py-2.5 text-right text-xs ${row.status === "credit" ? "text-green-600" : "text-red-500"}`}>
                      {row.amount > 0 ? `+₹${row.amount}` : `₹${row.amount}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Slot Management */}
      {activeTab === "slots" && (
        <div className="space-y-3">
          {MOCK_SLOTS.map((slot) => (
            <div key={slot.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-bold text-gray-900">{slot.label}</span>
                  <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{slot.id}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    slot.type === "Subscription" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                  }`}>
                    {slot.type}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{slot.holder}</p>
              </div>
              <div className="flex items-center gap-2">
                {slot.revenue > 0 && (
                  <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded-lg">
                    {slot.revenue} ₮/wk
                  </span>
                )}
                <span className={`text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 ${
                  slot.status === "active" ? "bg-green-50 text-green-700" :
                  slot.status === "taken" ? "bg-yellow-50 text-yellow-700" :
                  "bg-gray-50 text-gray-500"
                }`}>
                  {slot.status === "active" ? <CheckCircle size={11} /> : <AlertCircle size={11} />}
                  {slot.status.charAt(0).toUpperCase() + slot.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
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
                    className={`w-10 h-5 rounded-full transition-all relative ${
                      ctrl.active ? "bg-green-500" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow ${
                        ctrl.active ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
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
