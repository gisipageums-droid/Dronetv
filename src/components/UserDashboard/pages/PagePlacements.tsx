import React, { useState, useEffect } from "react";
import {
  Layout, MapPin, CheckCircle, XCircle, Clock, Coins,
  TrendingUp, Globe, Newspaper, Video, Home, Tag, AlertCircle,
} from "lucide-react";
import { useUserAuth } from "../../context/context";
import axios from "axios";
import { AUTH_API, LAMBDA } from "../../../lib/apiConfig";

const PROFILE_API = AUTH_API ? `${AUTH_API}/profile` : `${LAMBDA.profile}/profile`;

const HP_SLOTS = [
  {
    id: "HP-1",
    label: "Hero Banner",
    location: "Homepage — full-width top banner",
    tierRequired: "Brand",
    price: null,
    priceLabel: "Subscription benefit — not auctioned",
    icon: Home,
    color: "yellow",
  },
  {
    id: "HP-2",
    label: "Featured Strip — Slot A",
    location: "Homepage — featured companies strip",
    tierRequired: null,
    price: { day: 50, week: 300, month: 1000 },
    priceLabel: "50 ₮/day · 300 ₮/week · 1,000 ₮/month",
    icon: Tag,
    color: "green",
    status: "available",
  },
  {
    id: "HP-3",
    label: "Featured Strip — Slot B",
    location: "Homepage — featured companies strip",
    tierRequired: null,
    price: { day: 50, week: 300, month: 1000 },
    priceLabel: "50 ₮/day · Outbid option available",
    icon: Tag,
    color: "orange",
    status: "taken",
  },
  {
    id: "HP-4",
    label: "Sponsored News Article",
    location: "Homepage — news section",
    tierRequired: null,
    price: { day: 30, week: 180 },
    priceLabel: "30 ₮/day · 180 ₮/week",
    icon: Newspaper,
    color: "blue",
    status: "available",
  },
  {
    id: "HP-5",
    label: "Ticker Announcement",
    location: "Homepage — scrolling ticker",
    tierRequired: null,
    price: { day: 15, week: 90 },
    priceLabel: "15 ₮/day · 90 ₮/week",
    icon: TrendingUp,
    color: "purple",
    status: "available",
  },
];

const CATEGORY_SLOTS = [
  { name: "Defence UAV", total: 3, taken: 2, available: 1 },
  { name: "Agriculture Drone", total: 3, taken: 1, available: 2 },
  { name: "GIS / Survey", total: 3, taken: 0, available: 3 },
  { name: "Commercial Drone", total: 3, taken: 1, available: 2 },
  { name: "AI Technology", total: 3, taken: 2, available: 1 },
  { name: "Training / RPTO", total: 3, taken: 0, available: 3 },
];

const MEDIA_SLOTS = [
  { name: "News Pulse — Featured", price: 30, unit: "day" },
  { name: "Video Spotlight — Top", price: 40, unit: "day" },
  { name: "Press Release — Promoted", price: 15, unit: "once" },
];

const colorMap: Record<string, string> = {
  yellow: "bg-yellow-400/10 border-yellow-400/30 text-yellow-400",
  green: "bg-green-500/10 border-green-500/30 text-green-400",
  orange: "bg-orange-500/10 border-orange-500/30 text-orange-400",
  blue: "bg-blue-500/10 border-blue-500/30 text-blue-400",
  purple: "bg-purple-500/10 border-purple-500/30 text-purple-400",
};

type Duration = "day" | "week" | "month";

const PagePlacements: React.FC = () => {
  const { user } = useUserAuth();
  const [tokenBalance, setTokenBalance] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [duration, setDuration] = useState<Duration>("week");
  const [activeTab, setActiveTab] = useState<"homepage" | "category" | "media">("homepage");

  const userId = user?.userData?.email || user?.email || "";

  useEffect(() => {
    if (!userId) return;
    axios
      .get(`${PROFILE_API}?userId=${userId}`)
      .then((r) => setTokenBalance(r.data?.profile?.tokenBalance ?? 0))
      .catch(() => setTokenBalance(0));
  }, [userId]);

  const getSlotCost = (slot: (typeof HP_SLOTS)[0]) => {
    if (!slot.price) return null;
    return slot.price[duration as keyof typeof slot.price] ?? null;
  };

  const handleBook = (slotId: string) => {
    setSelectedSlot(selectedSlot === slotId ? null : slotId);
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layout size={20} className="text-yellow-400" />
            <h1 className="text-xl font-black text-white">Page Placements</h1>
          </div>
          <p className="text-sm text-white/50">
            Boost your visibility with sponsored placement slots across DroneTv.in
          </p>
        </div>
        {tokenBalance !== null && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-400/10 border border-yellow-400/20">
            <Coins size={16} className="text-yellow-400" />
            <span className="text-sm font-black text-yellow-400">{tokenBalance.toLocaleString()} ₮</span>
          </div>
        )}
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 mb-6">
        <AlertCircle size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-blue-300">
          Page placements put your company in high-visibility locations across DroneTv.in. Tokens
          are deducted daily at midnight IST. Unused reservations are refunded if you cancel.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 p-1 bg-white/5 rounded-xl w-fit">
        {(["homepage", "category", "media"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all capitalize ${
              activeTab === tab
                ? "bg-yellow-400 text-black"
                : "text-white/50 hover:text-white"
            }`}
          >
            {tab === "homepage" ? "Homepage" : tab === "category" ? "Category Pages" : "Media Hub"}
          </button>
        ))}
      </div>

      {/* Homepage Slots */}
      {activeTab === "homepage" && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-4">
            <Globe size={14} className="text-white/40" />
            <span className="text-xs text-white/40">Homepage — dev.dronetv.in</span>
          </div>

          {/* Duration selector (for paid slots) */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs text-white/50 mr-1">Duration:</span>
            {(["day", "week", "month"] as Duration[]).map((d) => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  duration === d
                    ? "bg-yellow-400 text-black"
                    : "bg-white/5 text-white/50 hover:text-white"
                }`}
              >
                {d === "day" ? "1 Day" : d === "week" ? "1 Week" : "1 Month"}
              </button>
            ))}
          </div>

          {HP_SLOTS.map((slot) => {
            const SlotIcon = slot.icon;
            const cost = getSlotCost(slot);
            const isFree = slot.tierRequired === "Brand";
            const isTaken = slot.status === "taken";
            const isSelected = selectedSlot === slot.id;

            return (
              <div
                key={slot.id}
                className={`rounded-xl border p-4 transition-all ${
                  isSelected ? "border-yellow-400/50 bg-yellow-400/5" : "border-white/10 bg-white/3"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${colorMap[slot.color]}`}>
                      <SlotIcon size={17} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-bold text-white">{slot.label}</span>
                        <span className="text-[10px] font-bold text-white/30 bg-white/10 px-1.5 py-0.5 rounded">{slot.id}</span>
                        {isFree && (
                          <span className="text-[10px] font-bold text-yellow-400 bg-yellow-400/10 px-1.5 py-0.5 rounded">
                            Brand Only
                          </span>
                        )}
                        {isTaken && !isFree && (
                          <span className="text-[10px] font-bold text-orange-400 bg-orange-400/10 px-1.5 py-0.5 rounded">
                            Taken
                          </span>
                        )}
                        {!isTaken && !isFree && (
                          <span className="text-[10px] font-bold text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded">
                            Available
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white/40">{slot.location}</p>
                      <p className="text-xs text-white/60 mt-1 font-medium">{slot.priceLabel}</p>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    {isFree ? (
                      <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
                        <CheckCircle size={13} className="text-green-400" />
                        <span className="text-xs font-semibold text-green-400">Active</span>
                      </div>
                    ) : isTaken ? (
                      <button
                        onClick={() => handleBook(slot.id)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold hover:bg-orange-500/20 transition-colors"
                      >
                        <XCircle size={13} />
                        Outbid
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBook(slot.id)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-yellow-400/15 border border-yellow-400/20 text-yellow-400 text-xs font-semibold hover:bg-yellow-400/25 transition-colors"
                      >
                        <MapPin size={13} />
                        Book {cost !== null ? `— ${cost} ₮` : ""}
                      </button>
                    )}
                  </div>
                </div>

                {/* Booking panel */}
                {isSelected && !isFree && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-white/60">
                        {isTaken ? "Outbid current holder" : "Confirm booking"}
                      </span>
                      <span className="text-sm font-black text-yellow-400">{cost} ₮</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {tokenBalance !== null && cost !== null && tokenBalance >= cost ? (
                        <button className="flex-1 py-2 rounded-lg bg-yellow-400 text-black text-xs font-black hover:bg-yellow-300 transition-colors">
                          Confirm — Deduct {cost} ₮
                        </button>
                      ) : (
                        <div className="flex-1 py-2 rounded-lg bg-white/5 border border-white/10 text-center text-xs text-white/40">
                          Insufficient tokens
                        </div>
                      )}
                      <button
                        onClick={() => setSelectedSlot(null)}
                        className="px-3 py-2 rounded-lg bg-white/5 text-white/50 text-xs hover:bg-white/10 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Category Slots */}
      {activeTab === "category" && (
        <div className="space-y-3">
          <p className="text-xs text-white/40 mb-4">
            Each category page has 3 sponsored slots shown above organic listings. Bid for keywords to win these slots.
          </p>
          {CATEGORY_SLOTS.map((cat) => (
            <div key={cat.name} className="rounded-xl border border-white/10 bg-white/3 p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-sm font-bold text-white">{cat.name}</span>
                  <span className="text-xs text-white/40 ml-2">Category Page</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/40">{cat.taken}/{cat.total} slots filled</span>
                  {cat.available > 0 ? (
                    <span className="text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded">
                      {cat.available} open
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded">
                      Full
                    </span>
                  )}
                </div>
              </div>
              {/* Slot bars */}
              <div className="flex gap-1.5 mb-3">
                {Array.from({ length: cat.total }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 h-2 rounded-full ${i < cat.taken ? "bg-yellow-400" : "bg-white/10"}`}
                  />
                ))}
              </div>
              <button className="px-3 py-1.5 rounded-lg bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-xs font-semibold hover:bg-yellow-400/20 transition-colors">
                Bid for Keyword →
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Media Hub Slots */}
      {activeTab === "media" && (
        <div className="space-y-3">
          <p className="text-xs text-white/40 mb-4">
            Featured spots within the Media Hub sections for increased editorial visibility.
          </p>
          {MEDIA_SLOTS.map((slot) => (
            <div key={slot.name} className="rounded-xl border border-white/10 bg-white/3 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Video size={16} className="text-blue-400" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{slot.name}</div>
                  <div className="text-xs text-white/40">
                    {slot.price} ₮/{slot.unit}
                  </div>
                </div>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-xs font-semibold hover:bg-yellow-400/20 transition-colors">
                <Clock size={12} />
                Book — {slot.price} ₮
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PagePlacements;
