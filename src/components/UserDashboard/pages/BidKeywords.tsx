import React, { useState, useEffect, useCallback } from "react";
import { Target, Coins, TrendingUp, Clock, CheckCircle, AlertCircle, Info, RefreshCw, X } from "lucide-react";
import { useUserAuth } from "../../context/context";
import axios from "axios";
import { AUTH_API, LAMBDA } from "../../../lib/apiConfig";

const PROFILE_API   = AUTH_API ? `${AUTH_API}/profile` : `${LAMBDA.profile}/profile`;
const TOKEN_SPEND   = LAMBDA.tokenSpend;

const KEYWORDS = [
  "Drone Survey", "UAV Training", "DGCA Certification", "Agricultural Drone",
  "Defence UAV", "Commercial Drone", "Drone Manufacturing", "GIS Mapping",
  "FPV Racing", "Drone Photography", "Inspection Drone", "Delivery Drone",
  "RPTO", "Pilot License", "Drone Expo", "Aerial Survey",
];

const DURATIONS = [
  { label: "1 Week",  days: 7,  multiplier: 1 },
  { label: "2 Weeks", days: 14, multiplier: 1.8 },
  { label: "1 Month", days: 30, multiplier: 3 },
];

interface Bid {
  bidId: string;
  keyword: string;
  bidAmount: number;
  totalCost: number;
  durationDays: number;
  status: string;
  position?: number;
  createdAt: string;
  expiresAt: string;
}

const BidKeywordsPage: React.FC = () => {
  const { user } = useUserAuth();
  const [tokenBalance, setTokenBalance]     = useState<number>(0);
  const [selectedKeyword, setSelectedKeyword] = useState<string>("");
  const [bidAmount, setBidAmount]           = useState<number>(50);
  const [selectedDuration, setSelectedDuration] = useState<number>(0);
  const [placing, setPlacing]               = useState(false);
  const [cancelling, setCancelling]         = useState<string | null>(null);
  const [success, setSuccess]               = useState(false);
  const [error, setError]                   = useState<string>("");
  const [myBids, setMyBids]                 = useState<Bid[]>([]);
  const [loadingBids, setLoadingBids]       = useState(true);

  const userId = user?.userData?.email || user?.email || "";

  const fetchProfile = useCallback(async () => {
    if (!userId) return;
    try {
      const r = await axios.get(`${PROFILE_API}?userId=${userId}`);
      setTokenBalance(r.data?.profile?.tokenBalance ?? 0);
    } catch {}
  }, [userId]);

  const fetchBids = useCallback(async () => {
    if (!userId) return;
    setLoadingBids(true);
    try {
      const r = await axios.get(`${TOKEN_SPEND}/bids?userId=${userId}`);
      setMyBids(r.data?.bids ?? []);
    } catch {
      setMyBids([]);
    } finally {
      setLoadingBids(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfile();
    fetchBids();
  }, [fetchProfile, fetchBids]);

  const dur = DURATIONS[selectedDuration];
  const totalCost = Math.round(bidAmount * dur.multiplier);
  const canBid = selectedKeyword && tokenBalance >= totalCost;

  const handlePlaceBid = async () => {
    if (!canBid) return;
    if (bidAmount <= 0 || totalCost <= 0) return;
    setPlacing(true);
    setError("");
    try {
      const r = await axios.post(`${TOKEN_SPEND}/bid`, {
        userId,
        keyword: selectedKeyword,
        bidAmount,
        durationDays: dur.days,
        totalCost,
      });
      if (r.data.success) {
        setTokenBalance(r.data.newBalance);
        setSuccess(true);
        setSelectedKeyword("");
        setTimeout(() => setSuccess(false), 3000);
        await fetchBids();
      } else {
        setError(r.data.message || "Bid failed");
      }
    } catch (e: any) {
      setError(e.response?.data?.message || "Failed to place bid");
    } finally {
      setPlacing(false);
    }
  };

  const handleCancelBid = async (bidId: string) => {
    setCancelling(bidId);
    try {
      const r = await axios.delete(`${TOKEN_SPEND}/bid?bidId=${bidId}&userId=${userId}`);
      if (r.data.success) {
        setTokenBalance(prev => prev + (r.data.refunded || 0));
        await fetchBids();
      }
    } catch {}
    setCancelling(null);
  };

  const activeBids = myBids.filter(b => b.status === "active");
  const expiredBids = myBids.filter(b => b.status === "expired" || b.status === "cancelled");

  return (
    <div className="min-h-screen bg-gray-950 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <Target size={24} className="text-yellow-400" />
            Bid for Keywords
          </h1>
          <p className="text-sm text-white/50 mt-1">
            Win top spots when buyers search for drone services. Max 3 slots per keyword.
          </p>
        </div>

        {/* Token Balance Banner */}
        <div className="flex items-center justify-between bg-yellow-400/10 border border-yellow-400/20 rounded-xl px-5 py-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center">
              <span className="text-black font-black text-sm">₮</span>
            </div>
            <div>
              <div className="text-xs text-white/50 uppercase tracking-widest">Token Balance</div>
              <div className="text-2xl font-black text-yellow-400">{tokenBalance.toLocaleString()} ₮</div>
            </div>
          </div>
          <a href="/user-buy" className="px-4 py-2 bg-yellow-400 text-black text-sm font-bold rounded-lg hover:bg-yellow-300 transition-colors">
            Buy More
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bid Simulator */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-gray-900 border border-yellow-400/20 rounded-xl p-5">
              <h2 className="text-base font-bold text-yellow-400 flex items-center gap-2 mb-5">
                <TrendingUp size={16} /> Place a Keyword Bid
              </h2>

              {/* Step 1 */}
              <div className="bg-white/4 rounded-lg p-4 mb-3">
                <div className="text-[10px] font-bold text-white/35 uppercase tracking-widest mb-3">Step 1 — Select Keyword</div>
                <div className="flex flex-wrap gap-2">
                  {KEYWORDS.map(kw => (
                    <button
                      key={kw}
                      onClick={() => setSelectedKeyword(kw)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        selectedKeyword === kw
                          ? "bg-yellow-400/15 border-yellow-400 text-yellow-400"
                          : "bg-gray-800 border-white/10 text-white/50 hover:border-yellow-400/30 hover:text-white"
                      }`}
                    >
                      {kw}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white/4 rounded-lg p-4 mb-3">
                <div className="text-[10px] font-bold text-white/35 uppercase tracking-widest mb-3">Step 2 — Daily Bid (₮/day)</div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-white/50 min-w-[70px]">Min: 50 ₮</span>
                  <input
                    type="range" min={50} max={500} step={10}
                    value={bidAmount}
                    onChange={e => setBidAmount(Number(e.target.value))}
                    className="flex-1 accent-yellow-400"
                  />
                  <span className="text-lg font-black text-yellow-400 min-w-[60px] text-right">{bidAmount} ₮</span>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white/4 rounded-lg p-4 mb-4">
                <div className="text-[10px] font-bold text-white/35 uppercase tracking-widest mb-3">Step 3 — Duration</div>
                <div className="flex gap-2 flex-wrap">
                  {DURATIONS.map((d, i) => (
                    <button
                      key={d.label}
                      onClick={() => setSelectedDuration(i)}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${
                        selectedDuration === i
                          ? "bg-yellow-400/15 border-yellow-400 text-yellow-400"
                          : "bg-gray-800 border-white/10 text-white/50 hover:border-yellow-400/30 hover:text-white"
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-between mb-4">
                <div>
                  <div className="text-xs text-white/50 mb-1">Total Cost</div>
                  <div className="text-2xl font-black text-yellow-400">{totalCost} ₮</div>
                  {selectedKeyword && (
                    <div className="text-xs text-white/40 mt-1">
                      {selectedKeyword} · {dur.label} · {bidAmount} ₮/day
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-xs text-white/50 mb-1">After Bid</div>
                  <div className={`text-lg font-bold ${tokenBalance - totalCost >= 0 ? "text-white" : "text-red-400"}`}>
                    {(tokenBalance - totalCost).toLocaleString()} ₮
                  </div>
                </div>
              </div>

              {success && (
                <div className="flex items-center gap-2 bg-green-500/15 border border-green-500/30 rounded-lg px-4 py-3 mb-3 text-green-400 text-sm">
                  <CheckCircle size={16} /> Bid placed! You're now bidding on "{selectedKeyword || "your keyword"}".
                </div>
              )}
              {error && (
                <div className="flex items-center gap-2 bg-red-500/15 border border-red-500/30 rounded-lg px-4 py-3 mb-3 text-red-400 text-sm">
                  <AlertCircle size={16} /> {error}
                </div>
              )}
              {!canBid && selectedKeyword && tokenBalance < totalCost && (
                <div className="flex items-center gap-2 bg-red-500/15 border border-red-500/30 rounded-lg px-4 py-3 mb-3 text-red-400 text-sm">
                  <AlertCircle size={16} /> Insufficient tokens. <a href="/user-buy" className="underline ml-1">Buy more</a>
                </div>
              )}

              <button
                onClick={handlePlaceBid}
                disabled={!canBid || placing}
                className="w-full py-3 rounded-lg font-bold text-sm transition-all bg-yellow-400 text-black hover:bg-yellow-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {placing
                  ? <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> Placing...</>
                  : `⚡ Place Bid — Reserve ${totalCost} ₮`
                }
              </button>
            </div>

            {/* My Active Bids */}
            <div className="bg-gray-900 border border-white/8 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-white/8 flex items-center justify-between">
                <span className="font-bold text-white text-sm">My Active Bids ({activeBids.length})</span>
                <button onClick={fetchBids} className="p-1.5 text-white/30 hover:text-white rounded-lg hover:bg-white/8 transition-colors">
                  <RefreshCw size={13} />
                </button>
              </div>
              {loadingBids ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : activeBids.length === 0 ? (
                <div className="py-10 text-center text-white/30 text-sm">No active bids — place your first bid above</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-950">
                        {["Keyword", "Bid", "Duration", "Status", "Expires", ""].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-[10px] font-bold text-white/40 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {activeBids.map(b => {
                        const daysLeft = Math.max(0, Math.ceil((new Date(b.expiresAt).getTime() - Date.now()) / 86400000));
                        return (
                          <tr key={b.bidId} className="border-t border-white/5 hover:bg-white/2">
                            <td className="px-4 py-3 text-sm font-semibold text-white">{b.keyword}</td>
                            <td className="px-4 py-3 text-sm text-yellow-400 font-bold">{b.bidAmount} ₮/day</td>
                            <td className="px-4 py-3 text-sm text-white/70">{b.durationDays}d</td>
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-green-500/15 text-green-400">
                                <CheckCircle size={11} /> Active
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-white/50 whitespace-nowrap">
                              <span className="flex items-center gap-1"><Clock size={11} /> {daysLeft}d left</span>
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => handleCancelBid(b.bidId)}
                                disabled={cancelling === b.bidId}
                                className="p-1 text-white/30 hover:text-red-400 transition-colors disabled:opacity-40"
                                title="Cancel bid (partial refund)"
                              >
                                {cancelling === b.bidId ? <div className="w-3 h-3 border border-white/40 border-t-transparent rounded-full animate-spin" /> : <X size={13} />}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Past bids */}
            {expiredBids.length > 0 && (
              <div className="bg-gray-900 border border-white/8 rounded-xl overflow-hidden">
                <div className="px-5 py-3 border-b border-white/8">
                  <span className="text-sm font-bold text-white/40">Past Bids ({expiredBids.length})</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <tbody>
                      {expiredBids.slice(0, 5).map(b => (
                        <tr key={b.bidId} className="border-t border-white/5">
                          <td className="px-4 py-2.5 text-sm text-white/50">{b.keyword}</td>
                          <td className="px-4 py-2.5 text-sm text-white/40">{b.bidAmount} ₮/day · {b.durationDays}d</td>
                          <td className="px-4 py-2.5">
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                              b.status === "cancelled" ? "bg-gray-500/20 text-gray-400" : "bg-gray-500/20 text-gray-400"
                            }`}>{b.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Right: info panel */}
          <div className="space-y-4">
            <div className="bg-yellow-400/8 border border-yellow-400/20 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <Info size={14} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-white/60 leading-relaxed">
                  <strong className="text-yellow-400">How bidding works:</strong><br />
                  Top 3 bidders win sponsored placement for that keyword. Bids run for the chosen duration and tokens are deducted upfront. Cancel anytime for a partial refund.
                </div>
              </div>
            </div>

            <div className="bg-gray-900 border border-white/8 rounded-xl p-4">
              <div className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">Token cost breakdown</div>
              <div className="space-y-2 text-xs">
                {DURATIONS.map(d => (
                  <div key={d.label} className="flex items-center justify-between">
                    <span className="text-white/50">{d.label} @ 50 ₮/day</span>
                    <span className="font-bold text-yellow-400">{Math.round(50 * d.multiplier)} ₮</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-white/8 text-[10px] text-white/30">
                Cancel bid = refund for remaining days
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BidKeywordsPage;
