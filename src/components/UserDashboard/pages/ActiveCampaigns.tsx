import React, { useEffect, useState } from "react";
import {
  BarChart2, Coins, Target, Layout, Pause, RefreshCw,
  TrendingUp, Eye, MousePointer, Zap, AlertCircle,
} from "lucide-react";
import { useUserAuth } from "../../context/context";
import axios from "axios";
import { AUTH_API, LAMBDA } from "../../../lib/apiConfig";

const PROFILE_API = AUTH_API ? `${AUTH_API}/profile` : `${LAMBDA.profile}/profile`;

const MOCK_KEYWORD_BIDS = [
  {
    id: "kb1",
    keyword: "UAV Training",
    position: 1,
    status: "winning",
    bid: 120,
    winPrice: 9,
    daysLeft: 5,
    impressions: 1200,
    clicks: 48,
    spend: 45,
  },
  {
    id: "kb2",
    keyword: "Agricultural Drone",
    position: 2,
    status: "outbid",
    bid: 80,
    winPrice: null,
    daysLeft: 3,
    impressions: 600,
    clicks: 18,
    spend: 0,
  },
];

const MOCK_PLACEMENTS = [
  {
    id: "pl1",
    slot: "HP-2 Featured Strip — Slot A",
    type: "Homepage",
    status: "active",
    daysLeft: 7,
    tokensSpent: 300,
    impressions: 4200,
    clicks: 84,
  },
];

const statusColors: Record<string, string> = {
  winning: "bg-green-500/15 text-green-400 border-green-500/30",
  outbid: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  active: "bg-green-500/15 text-green-400 border-green-500/30",
  paused: "bg-white/10 text-white/40 border-white/20",
};

const ActiveCampaigns: React.FC = () => {
  const { user } = useUserAuth();
  const [tokenBalance, setTokenBalance] = useState<number | null>(null);

  const userId = user?.userData?.email || user?.email || "";

  useEffect(() => {
    if (!userId) return;
    axios
      .get(`${PROFILE_API}?userId=${userId}`)
      .then((r) => setTokenBalance(r.data?.profile?.tokenBalance ?? 0))
      .catch(() => setTokenBalance(0));
  }, [userId]);

  const totalSpend = MOCK_KEYWORD_BIDS.reduce((s, b) => s + b.spend, 0) +
    MOCK_PLACEMENTS.reduce((s, p) => s + p.tokensSpent, 0);
  const totalImpressions = MOCK_KEYWORD_BIDS.reduce((s, b) => s + b.impressions, 0) +
    MOCK_PLACEMENTS.reduce((s, p) => s + p.impressions, 0);
  const totalClicks = MOCK_KEYWORD_BIDS.reduce((s, b) => s + b.clicks, 0) +
    MOCK_PLACEMENTS.reduce((s, p) => s + p.clicks, 0);

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart2 size={20} className="text-yellow-400" />
            <h1 className="text-xl font-black text-white">Active Campaigns</h1>
          </div>
          <p className="text-sm text-white/50">Your running keyword bids and page placements</p>
        </div>
        {tokenBalance !== null && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-400/10 border border-yellow-400/20">
            <Coins size={16} className="text-yellow-400" />
            <span className="text-sm font-black text-yellow-400">{tokenBalance.toLocaleString()} ₮</span>
          </div>
        )}
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Active Bids", value: MOCK_KEYWORD_BIDS.filter(b => b.status === "winning").length, icon: Target, color: "text-green-400" },
          { label: "Tokens Spent", value: `${totalSpend} ₮`, icon: Coins, color: "text-yellow-400" },
          { label: "Impressions", value: totalImpressions.toLocaleString(), icon: Eye, color: "text-blue-400" },
          { label: "Clicks", value: totalClicks, icon: MousePointer, color: "text-purple-400" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-xl bg-white/3 border border-white/10 p-3">
              <Icon size={14} className={`${s.color} mb-1.5`} />
              <div className="text-lg font-black text-white">{s.value}</div>
              <div className="text-[10px] text-white/40 uppercase tracking-wider">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Keyword bids */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <Target size={15} className="text-yellow-400" />
          <h2 className="text-sm font-bold text-white/70">Keyword Bids</h2>
          <span className="text-[10px] bg-white/10 text-white/40 px-2 py-0.5 rounded-full">
            {MOCK_KEYWORD_BIDS.length}
          </span>
        </div>

        {MOCK_KEYWORD_BIDS.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/3 p-6 text-center">
            <Target size={24} className="text-white/20 mx-auto mb-2" />
            <p className="text-sm text-white/40">No active keyword bids</p>
            <button className="mt-3 px-4 py-2 rounded-lg bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-xs font-semibold">
              Bid for Keywords
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {MOCK_KEYWORD_BIDS.map((bid) => (
              <div key={bid.id} className="rounded-xl border border-white/10 bg-white/3 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-bold text-white">{bid.keyword}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColors[bid.status]}`}>
                        {bid.status === "winning" ? `🥇 Pos #${bid.position}` : "Outbid"}
                      </span>
                    </div>
                    <p className="text-xs text-white/40">
                      Bid: {bid.bid} ₮/day · {bid.daysLeft} days remaining
                      {bid.winPrice && ` · Win price: ${bid.winPrice} ₮/day`}
                    </p>
                  </div>
                  <div className="flex gap-1.5">
                    <button className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors" title="Pause">
                      <Pause size={12} className="text-white/40" />
                    </button>
                    <button className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors" title="Extend">
                      <RefreshCw size={12} className="text-white/40" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Impressions", value: bid.impressions.toLocaleString() },
                    { label: "Clicks", value: bid.clicks },
                    { label: "Spent", value: `${bid.spend} ₮` },
                  ].map((s) => (
                    <div key={s.label} className="text-center bg-white/4 rounded-lg p-2">
                      <div className="text-sm font-black text-white">{s.value}</div>
                      <div className="text-[9px] text-white/30 uppercase tracking-wider">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Page placements */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <Layout size={15} className="text-yellow-400" />
          <h2 className="text-sm font-bold text-white/70">Page Placements</h2>
          <span className="text-[10px] bg-white/10 text-white/40 px-2 py-0.5 rounded-full">
            {MOCK_PLACEMENTS.length}
          </span>
        </div>

        {MOCK_PLACEMENTS.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/3 p-6 text-center">
            <Layout size={24} className="text-white/20 mx-auto mb-2" />
            <p className="text-sm text-white/40">No active placements</p>
            <button className="mt-3 px-4 py-2 rounded-lg bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-xs font-semibold">
              Book a Placement
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {MOCK_PLACEMENTS.map((pl) => (
              <div key={pl.id} className="rounded-xl border border-white/10 bg-white/3 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-bold text-white">{pl.slot}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColors[pl.status]}`}>
                        Active
                      </span>
                    </div>
                    <p className="text-xs text-white/40">
                      {pl.type} · {pl.daysLeft} days remaining · {pl.tokensSpent} ₮ prepaid
                    </p>
                  </div>
                  <div className="flex gap-1.5">
                    <button className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors" title="Renew">
                      <RefreshCw size={12} className="text-white/40" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Impressions", value: pl.impressions.toLocaleString() },
                    { label: "Clicks", value: pl.clicks },
                  ].map((s) => (
                    <div key={s.label} className="text-center bg-white/4 rounded-lg p-2">
                      <div className="text-sm font-black text-white">{s.value}</div>
                      <div className="text-[9px] text-white/30 uppercase tracking-wider">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Token ROI */}
      {totalSpend > 0 && (
        <div className="rounded-xl border border-yellow-400/20 bg-yellow-400/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={14} className="text-yellow-400" />
            <span className="text-xs font-bold text-yellow-400">Token ROI This Month</span>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-base font-black text-white">{totalSpend} ₮</div>
              <div className="text-[9px] text-white/40">Tokens Spent</div>
            </div>
            <div>
              <div className="text-base font-black text-white">{totalImpressions.toLocaleString()}</div>
              <div className="text-[9px] text-white/40">Impressions</div>
            </div>
            <div>
              <div className="text-base font-black text-white">
                {totalClicks > 0 ? (totalSpend / totalClicks).toFixed(1) : "—"} ₮
              </div>
              <div className="text-[9px] text-white/40">Cost/Click</div>
            </div>
          </div>
        </div>
      )}

      {totalSpend === 0 && MOCK_KEYWORD_BIDS.length === 0 && MOCK_PLACEMENTS.length === 0 && (
        <div className="rounded-xl border border-white/10 bg-white/3 p-8 text-center">
          <Zap size={32} className="text-white/20 mx-auto mb-3" />
          <p className="text-sm font-semibold text-white/50 mb-1">No active campaigns</p>
          <p className="text-xs text-white/30 mb-4">Start bidding for keywords or book a page placement to grow your visibility.</p>
          <div className="flex gap-2 justify-center">
            <button className="px-4 py-2 rounded-lg bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-xs font-semibold hover:bg-yellow-400/20 transition-colors">
              Bid for Keywords
            </button>
            <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/50 text-xs font-semibold hover:bg-white/10 transition-colors">
              Book Placement
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveCampaigns;
