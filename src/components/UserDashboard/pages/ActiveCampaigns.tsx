import React, { useEffect, useState, useCallback } from "react";
import {
  BarChart2, Coins, Target, Layout, RefreshCw,
  CheckCircle, X, Clock,
} from "lucide-react";
import { useUserAuth } from "../../context/context";
import axios from "axios";
import { AUTH_API, LAMBDA } from "../../../lib/apiConfig";

const PROFILE_API = AUTH_API ? `${AUTH_API}/profile` : `${LAMBDA.profile}/profile`;
const TOKEN_SPEND = LAMBDA.tokenSpend;

interface Bid {
  bidId: string; keyword: string; bidAmount: number; totalCost: number;
  durationDays: number; status: string; createdAt: string; expiresAt: string;
}
interface Placement {
  placementId: string; slotId: string; slotLabel: string; durationDays: number;
  costPerDay: number; totalTokens: number; status: string; createdAt: string;
  expiresAt: string; daysLeft?: number;
}

const ActiveCampaigns: React.FC = () => {
  const { user } = useUserAuth();
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [totalSpent, setTotalSpent]     = useState<number>(0);
  const [bids, setBids]                 = useState<Bid[]>([]);
  const [placements, setPlacements]     = useState<Placement[]>([]);
  const [loading, setLoading]           = useState(true);
  const [cancelling, setCancelling]     = useState<string | null>(null);

  const userId = user?.userData?.email || user?.email || "";

  const fetchAll = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const [profileR, bidsR, placR] = await Promise.all([
        axios.get(`${PROFILE_API}?userId=${userId}`),
        axios.get(`${TOKEN_SPEND}/bids?userId=${userId}`),
        axios.get(`${TOKEN_SPEND}/placements?userId=${userId}`),
      ]);
      const prof = profileR.data?.profile ?? {};
      setTokenBalance(prof.tokenBalance ?? 0);
      setTotalSpent(Math.max(0, prof.totalTokensSpent ?? 0));
      setBids(bidsR.data?.bids ?? []);
      setPlacements(placR.data?.placements ?? []);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const activeBids       = bids.filter(b => b.status === "active");
  const activePlacements = placements.filter(p => p.status === "active");
  const totalActive      = activeBids.length + activePlacements.length;

  const handleCancelBid = async (bidId: string) => {
    setCancelling(bidId);
    try {
      const r = await axios.delete(`${TOKEN_SPEND}/bid?bidId=${bidId}&userId=${userId}`);
      if (r.data.success) { setTokenBalance(prev => prev + (r.data.refunded || 0)); await fetchAll(); }
    } catch {}
    setCancelling(null);
  };

  const handleCancelPlacement = async (placementId: string) => {
    setCancelling(placementId);
    try {
      const r = await axios.delete(`${TOKEN_SPEND}/placement?placementId=${placementId}&userId=${userId}`);
      if (r.data.success) { setTokenBalance(prev => prev + (r.data.refunded || 0)); await fetchAll(); }
    } catch {}
    setCancelling(null);
  };

  const daysLeft = (expiresAt: string) =>
    Math.max(0, Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 86400000));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <BarChart2 size={22} className="text-yellow-400" /> Active Campaigns
            </h1>
            <p className="text-sm text-white/40 mt-0.5">Your running keyword bids and page placements</p>
          </div>
          <button onClick={fetchAll} className="p-2 text-white/30 hover:text-white rounded-lg hover:bg-white/8 transition-colors">
            <RefreshCw size={14} />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Active Campaigns", value: totalActive, icon: BarChart2, color: "text-yellow-400" },
            { label: "Active Bids",      value: activeBids.length,       icon: Target, color: "text-blue-400" },
            { label: "Active Slots",     value: activePlacements.length, icon: Layout, color: "text-green-400" },
            { label: "Tokens Spent",     value: `${totalSpent.toLocaleString()} ₮`, icon: Coins, color: "text-purple-400" },
          ].map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-gray-900 border border-white/8 rounded-xl p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <Icon size={13} className={stat.color} />
                  <span className="text-[10px] text-white/40 uppercase tracking-wider">{stat.label}</span>
                </div>
                <div className={`text-xl font-black ${stat.color}`}>{stat.value}</div>
              </div>
            );
          })}
        </div>

        {totalActive === 0 ? (
          <div className="bg-gray-900 border border-white/8 rounded-xl py-16 text-center">
            <BarChart2 size={36} className="mx-auto mb-4 text-white/20" />
            <p className="text-white/40 text-sm mb-4">No active campaigns yet</p>
            <div className="flex items-center justify-center gap-3">
              <a href="/user-bid-keywords" className="px-4 py-2 bg-yellow-400 text-black text-xs font-black rounded-lg hover:bg-yellow-300 transition-colors">
                Bid Keywords
              </a>
              <a href="/user-page-placements" className="px-4 py-2 bg-gray-800 text-white text-xs font-bold rounded-lg hover:bg-gray-700 transition-colors border border-white/10">
                Book Slots
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Active Bids */}
            {activeBids.length > 0 && (
              <div className="bg-gray-900 border border-white/8 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-white/8 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target size={15} className="text-blue-400" />
                    <span className="font-bold text-white text-sm">Keyword Bids ({activeBids.length})</span>
                  </div>
                  <a href="/user-bid-keywords" className="text-xs text-yellow-400 hover:underline">+ Add bid</a>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-950">
                        {["Keyword", "Daily Bid", "Duration", "Expires", "Cost", ""].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-[10px] font-bold text-white/40 uppercase tracking-wider whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {activeBids.map(b => (
                        <tr key={b.bidId} className="border-t border-white/5 hover:bg-white/2">
                          <td className="px-4 py-3 text-sm font-semibold text-white whitespace-nowrap">{b.keyword}</td>
                          <td className="px-4 py-3 text-sm text-yellow-400 font-bold whitespace-nowrap">{b.bidAmount} ₮/day</td>
                          <td className="px-4 py-3 text-sm text-white/60">{b.durationDays}d</td>
                          <td className="px-4 py-3 text-sm text-white/50 whitespace-nowrap">
                            <span className="flex items-center gap-1"><Clock size={11} /> {daysLeft(b.expiresAt)}d left</span>
                          </td>
                          <td className="px-4 py-3 text-sm font-bold text-white/70">{b.totalCost} ₮</td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleCancelBid(b.bidId)}
                              disabled={cancelling === b.bidId}
                              className="p-1 text-white/30 hover:text-red-400 transition-colors disabled:opacity-40"
                              title="Cancel (partial refund)"
                            >
                              {cancelling === b.bidId
                                ? <div className="w-3 h-3 border border-white/40 border-t-transparent rounded-full animate-spin" />
                                : <X size={13} />}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Active Placements */}
            {activePlacements.length > 0 && (
              <div className="bg-gray-900 border border-white/8 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-white/8 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layout size={15} className="text-green-400" />
                    <span className="font-bold text-white text-sm">Page Placements ({activePlacements.length})</span>
                  </div>
                  <a href="/user-page-placements" className="text-xs text-yellow-400 hover:underline">+ Book slot</a>
                </div>
                <div className="divide-y divide-white/5">
                  {activePlacements.map(p => (
                    <div key={p.placementId} className="flex items-center justify-between px-5 py-4">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-white">{p.slotLabel}</div>
                        <div className="text-xs text-white/40 mt-0.5">
                          {p.costPerDay} ₮/day · {p.daysLeft ?? daysLeft(p.expiresAt)}d remaining · {p.totalTokens} ₮ total
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                        <span className="text-[11px] bg-green-500/15 text-green-400 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                          <CheckCircle size={10} /> Live
                        </span>
                        <button
                          onClick={() => handleCancelPlacement(p.placementId)}
                          disabled={cancelling === p.placementId}
                          className="p-1 text-white/30 hover:text-red-400 transition-colors disabled:opacity-40"
                          title="Cancel (partial refund)"
                        >
                          {cancelling === p.placementId
                            ? <div className="w-3 h-3 border border-white/40 border-t-transparent rounded-full animate-spin" />
                            : <X size={13} />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Token ROI summary */}
            <div className="bg-gray-900 border border-white/8 rounded-xl p-5">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Coins size={15} className="text-yellow-400" /> Token Summary
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: "Current Balance", value: `${tokenBalance.toLocaleString()} ₮`, color: "text-yellow-400" },
                  { label: "Total Spent",     value: `${totalSpent.toLocaleString()} ₮`,   color: "text-white" },
                  { label: "Active Spend",    value: `${[...activeBids.map(b => b.totalCost), ...activePlacements.map(p => p.totalTokens)].reduce((s, v) => s + v, 0).toLocaleString()} ₮`, color: "text-blue-400" },
                ].map(s => (
                  <div key={s.label} className="text-center bg-white/3 rounded-xl p-4">
                    <div className={`text-xl font-black ${s.color}`}>{s.value}</div>
                    <div className="text-[10px] text-white/40 uppercase tracking-wider mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <a href="/user-recharge" className="text-xs text-yellow-400 hover:underline">View all transactions →</a>
                <a href="/user-buy" className="px-3 py-1.5 bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-xs font-bold rounded-lg hover:bg-yellow-400/20 transition-colors">
                  Buy Tokens
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveCampaigns;
