import React, { useState, useEffect } from "react";
import { Target, Coins, TrendingUp, Clock, CheckCircle, AlertCircle, Info } from "lucide-react";
import { useUserAuth } from "../../context/context";
import axios from "axios";
import { AUTH_API, LAMBDA } from "../../../lib/apiConfig";

const PROFILE_API = AUTH_API ? `${AUTH_API}/profile` : `${LAMBDA.profile}/profile`;

const KEYWORDS = [
  "Drone Survey", "UAV Training", "DGCA Certification", "Agricultural Drone",
  "Defence UAV", "Commercial Drone", "Drone Manufacturing", "GIS Mapping",
  "FPV Racing", "Drone Photography", "Inspection Drone", "Delivery Drone",
  "RPTO", "Pilot License", "Drone Expo", "Aerial Survey",
];

const DURATIONS = [
  { label: "1 Week", days: 7, multiplier: 1 },
  { label: "2 Weeks", days: 14, multiplier: 1.8 },
  { label: "1 Month", days: 30, multiplier: 3 },
];

const MY_BIDS = [
  { keyword: "UAV Training", bid: 120, position: 1, status: "Winning", expires: "Jul 5, 2026" },
  { keyword: "Agricultural Drone", bid: 80, position: 2, status: "Outbid", expires: "Jul 3, 2026" },
];

const TOP_BIDS = [
  { keyword: "Drone Survey", top: 200, slots: 3, open: 1 },
  { keyword: "Defence UAV", top: 180, slots: 3, open: 0 },
  { keyword: "GIS Mapping", top: 150, slots: 3, open: 2 },
  { keyword: "Agricultural Drone", top: 90, slots: 3, open: 1 },
  { keyword: "UAV Training", top: 120, slots: 3, open: 2 },
  { keyword: "DGCA Certification", top: 110, slots: 3, open: 1 },
];

const BidKeywordsPage: React.FC = () => {
  const { user } = useUserAuth();
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [selectedKeyword, setSelectedKeyword] = useState<string>("");
  const [bidAmount, setBidAmount] = useState<number>(50);
  const [selectedDuration, setSelectedDuration] = useState<number>(0);
  const [placing, setPlacing] = useState(false);
  const [success, setSuccess] = useState(false);

  const userId = user?.userData?.email || user?.email || "";

  useEffect(() => {
    if (!userId) return;
    axios.get(`${PROFILE_API}?userId=${userId}`)
      .then(r => setTokenBalance(r.data?.profile?.tokenBalance ?? 0))
      .catch(() => {});
  }, [userId]);

  const dur = DURATIONS[selectedDuration];
  const totalCost = Math.round(bidAmount * dur.multiplier);
  const canBid = selectedKeyword && tokenBalance >= totalCost;

  const handlePlaceBid = () => {
    if (!canBid) return;
    setPlacing(true);
    setTimeout(() => {
      setPlacing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <Target size={24} className="text-yellow-400" />
            Bid for Keywords
          </h1>
          <p className="text-sm text-white/50 mt-1">
            Win top spots on DroneTv.in when buyers search for drone services. Max 3 slots per keyword.
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
                <TrendingUp size={16} /> Bid Simulator
              </h2>

              {/* Step 1: Select Keyword */}
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

              {/* Step 2: Set Bid Amount */}
              <div className="bg-white/4 rounded-lg p-4 mb-3">
                <div className="text-[10px] font-bold text-white/35 uppercase tracking-widest mb-3">Step 2 — Set Daily Bid (₮ per day)</div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-white/50 min-w-[70px]">Min: 50 ₮</span>
                  <input
                    type="range"
                    min={50}
                    max={500}
                    step={10}
                    value={bidAmount}
                    onChange={e => setBidAmount(Number(e.target.value))}
                    className="flex-1 accent-yellow-400"
                  />
                  <span className="text-lg font-black text-yellow-400 min-w-[60px] text-right">{bidAmount} ₮</span>
                </div>
              </div>

              {/* Step 3: Duration */}
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
                  <CheckCircle size={16} /> Bid placed successfully!
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
                className="w-full py-3 rounded-lg font-bold text-sm transition-all bg-yellow-400 text-black hover:bg-yellow-300 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {placing ? "Placing Bid..." : `⚡ Place Bid — Reserve ${totalCost} ₮`}
              </button>
            </div>

            {/* My Active Bids */}
            <div className="bg-gray-900 border border-white/8 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-white/8 flex items-center justify-between">
                <span className="font-bold text-white text-sm">My Active Bids</span>
                <span className="text-xs text-white/40">{MY_BIDS.length} active</span>
              </div>
              <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-950">
                    <th className="px-4 py-3 text-left text-[10px] font-bold text-white/40 uppercase tracking-wider">Keyword</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold text-white/40 uppercase tracking-wider">Bid</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold text-white/40 uppercase tracking-wider">Position</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold text-white/40 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold text-white/40 uppercase tracking-wider">Expires</th>
                  </tr>
                </thead>
                <tbody>
                  {MY_BIDS.map((b, i) => (
                    <tr key={i} className="border-t border-white/5 hover:bg-white/2">
                      <td className="px-4 py-3 text-sm font-semibold text-white">{b.keyword}</td>
                      <td className="px-4 py-3 text-sm text-yellow-400 font-bold">{b.bid} ₮</td>
                      <td className="px-4 py-3 text-sm text-white/70">#{b.position}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          b.status === "Winning"
                            ? "bg-green-500/15 text-green-400"
                            : "bg-red-500/15 text-red-400"
                        }`}>
                          {b.status === "Winning" ? <CheckCircle size={11} /> : <AlertCircle size={11} />}
                          {b.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-white/50">
                        <span className="flex items-center gap-1"><Clock size={11} /> {b.expires}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          </div>

          {/* Live Auction Board */}
          <div className="space-y-4">
            <div className="bg-gray-900 border border-white/8 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-white/8">
                <span className="font-bold text-white text-sm">Live Keyword Prices</span>
                <div className="text-[10px] text-white/40 mt-0.5">Updated hourly</div>
              </div>
              <div className="divide-y divide-white/5">
                {TOP_BIDS.map((k, i) => (
                  <div key={i} className="px-4 py-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-white">{k.keyword}</span>
                      <span className="text-yellow-400 text-xs font-bold">{k.top} ₮</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-white/40">{k.slots} slots total</span>
                      <span className={`text-[11px] font-bold ${k.open > 0 ? "text-green-400" : "text-red-400"}`}>
                        {k.open > 0 ? `${k.open} open` : "Full"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-yellow-400/8 border border-yellow-400/20 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <Info size={14} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-white/60 leading-relaxed">
                  <strong className="text-yellow-400">How bidding works:</strong><br />
                  Top 3 bidders win sponsored placement for that keyword. Bids reset daily at midnight IST. Outbid alerts sent via email.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BidKeywordsPage;
