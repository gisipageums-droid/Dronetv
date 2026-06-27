import React, { useState, useEffect, useCallback } from "react";
import { Layout, Coins, CheckCircle, AlertCircle, RefreshCw, X, Info } from "lucide-react";
import { useUserAuth } from "../../context/context";
import axios from "axios";
import { AUTH_API, LAMBDA } from "../../../lib/apiConfig";

const PROFILE_API = AUTH_API ? `${AUTH_API}/profile` : `${LAMBDA.profile}/profile`;
const TOKEN_SPEND = LAMBDA.tokenSpend;

const DURATION_OPTIONS = [
  { days: 1,  label: "1 Day",   discount: "" },
  { days: 7,  label: "1 Week",  discount: "Save 10%" },
  { days: 14, label: "2 Weeks", discount: "Save 15%" },
  { days: 30, label: "1 Month", discount: "Save 20%" },
];

const SLOT_DEFINITIONS = [
  { id: "HP-1", label: "Homepage Hero Banner",       category: "Homepage",   costPerDay: 0,   description: "Brand subscribers only — full-width hero" },
  { id: "HP-2", label: "Featured Strip — Slot A",    category: "Homepage",   costPerDay: 100, description: "Top featured strip, left position" },
  { id: "HP-3", label: "Featured Strip — Slot B",    category: "Homepage",   costPerDay: 100, description: "Top featured strip, right position" },
  { id: "HP-4", label: "Sponsored Article",          category: "Homepage",   costPerDay: 50,  description: "Inline sponsored news article" },
  { id: "HP-5", label: "Ticker Announcement",        category: "Homepage",   costPerDay: 30,  description: "Scrolling ticker at the top" },
  { id: "cat-drones",  label: "Commercial Drones",   category: "Categories", costPerDay: 40,  description: "Top spot on Commercial Drones category page" },
  { id: "cat-gis",     label: "GIS & Mapping",       category: "Categories", costPerDay: 40,  description: "Top spot on GIS & Mapping page" },
  { id: "cat-agri",    label: "Agriculture",          category: "Categories", costPerDay: 40,  description: "Top spot on Agriculture category page" },
  { id: "cat-defence", label: "Defence & Security",  category: "Categories", costPerDay: 40,  description: "Top spot on Defence & Security page" },
  { id: "cat-training",label: "Training & RPTOs",    category: "Categories", costPerDay: 40,  description: "Top spot on Training page" },
  { id: "media-news",    label: "News Pulse Spot",   category: "Media Hub",  costPerDay: 60,  description: "Featured company card in news section" },
  { id: "media-video",   label: "Video Spotlight",   category: "Media Hub",  costPerDay: 80,  description: "Featured video in Video Spotlight" },
  { id: "media-magazine",label: "Magazine Feature",  category: "Media Hub",  costPerDay: 70,  description: "Featured article placement in Magazine" },
];

interface SlotStatus { available: boolean; costPerDay: number; holder: string | null; expiresAt: string | null; }
interface Placement { placementId: string; slotId: string; slotLabel: string; durationDays: number; costPerDay: number; totalTokens: number; status: string; createdAt: string; expiresAt: string; daysLeft?: number; }

const PagePlacements: React.FC = () => {
  const { user } = useUserAuth();
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [slotStatus, setSlotStatus]     = useState<Record<string, SlotStatus>>({});
  const [myPlacements, setMyPlacements] = useState<Placement[]>([]);
  const [loading, setLoading]           = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number>(0);
  const [booking, setBooking]           = useState(false);
  const [cancelling, setCancelling]     = useState<string | null>(null);
  const [success, setSuccess]           = useState("");
  const [error, setError]               = useState("");

  const userId = user?.userData?.email || user?.email || "";

  const fetchAll = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const [profileR, slotsR, placR] = await Promise.all([
        axios.get(`${PROFILE_API}?userId=${userId}`),
        axios.get(`${TOKEN_SPEND}/slots`),
        axios.get(`${TOKEN_SPEND}/placements?userId=${userId}`),
      ]);
      setTokenBalance(profileR.data?.profile?.tokenBalance ?? 0);
      setSlotStatus(slotsR.data?.slots ?? {});
      setMyPlacements(placR.data?.placements ?? []);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const getSlotDef = (id: string) => SLOT_DEFINITIONS.find(s => s.id === id);
  const activePlacements = myPlacements.filter(p => p.status === "active");
  const slotDef = selectedSlot ? getSlotDef(selectedSlot) : null;
  const durOpt  = DURATION_OPTIONS[selectedDuration];
  const bookCost = slotDef && durOpt ? slotDef.costPerDay * durOpt.days : 0;
  const categories = Array.from(new Set(SLOT_DEFINITIONS.map(s => s.category)));

  const handleBook = async () => {
    if (!selectedSlot || !slotDef || !durOpt) return;
    setBooking(true); setError("");
    try {
      const r = await axios.post(`${TOKEN_SPEND}/placement`, {
        userId, slotId: selectedSlot, slotLabel: slotDef.label, durationDays: durOpt.days,
      });
      if (r.data.success) {
        setTokenBalance(r.data.newBalance);
        setSuccess(`${slotDef.label} booked for ${durOpt.days} day${durOpt.days > 1 ? "s" : ""}!`);
        setSelectedSlot(null);
        setTimeout(() => setSuccess(""), 4000);
        await fetchAll();
      } else {
        setError(r.data.message || "Booking failed");
      }
    } catch (e: any) {
      setError(e.response?.data?.message || "Booking failed");
    } finally {
      setBooking(false);
    }
  };

  const handleCancel = async (placementId: string) => {
    setCancelling(placementId);
    try {
      const r = await axios.delete(`${TOKEN_SPEND}/placement?placementId=${placementId}&userId=${userId}`);
      if (r.data.success) {
        setTokenBalance(prev => prev + (r.data.refunded || 0));
        await fetchAll();
      }
    } catch {}
    setCancelling(null);
  };

  return (
    <div className="min-h-screen bg-gray-950 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Layout size={22} className="text-yellow-400" /> Page Placements
            </h1>
            <p className="text-sm text-white/40 mt-0.5">Book premium slots on DroneTv.in pages</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] text-white/40 uppercase tracking-widest">Balance</div>
              <div className="text-lg font-black text-yellow-400">{tokenBalance.toLocaleString()} ₮</div>
            </div>
            <button onClick={fetchAll} className="p-2 text-white/30 hover:text-white rounded-lg hover:bg-white/8 transition-colors">
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {success && (
          <div className="flex items-center gap-2 bg-green-500/15 border border-green-500/30 rounded-xl px-5 py-3 mb-5 text-green-400 text-sm">
            <CheckCircle size={15} /> {success}
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 bg-red-500/15 border border-red-500/30 rounded-xl px-5 py-3 mb-5 text-red-400 text-sm">
            <AlertCircle size={15} /> {error}
          </div>
        )}

        {activePlacements.length > 0 && (
          <div className="bg-gray-900 border border-yellow-400/20 rounded-xl overflow-hidden mb-6">
            <div className="px-5 py-3 border-b border-white/8">
              <span className="text-sm font-bold text-yellow-400">Active Placements ({activePlacements.length})</span>
            </div>
            <div className="divide-y divide-white/5">
              {activePlacements.map(p => (
                <div key={p.placementId} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <div className="text-sm font-bold text-white">{p.slotLabel}</div>
                    <div className="text-xs text-white/40">{p.totalTokens} ₮ · {p.daysLeft ?? 0}d remaining</div>
                  </div>
                  <button
                    onClick={() => handleCancel(p.placementId)}
                    disabled={cancelling === p.placementId}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-400 border border-red-400/20 rounded-lg hover:bg-red-400/10 transition-colors disabled:opacity-40"
                  >
                    {cancelling === p.placementId
                      ? <div className="w-3 h-3 border border-red-400 border-t-transparent rounded-full animate-spin" />
                      : <X size={12} />}
                    Cancel
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-7 h-7 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              categories.map(cat => (
                <div key={cat}>
                  <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">{cat}</div>
                  <div className="space-y-2">
                    {SLOT_DEFINITIONS.filter(s => s.category === cat).map(slot => {
                      const status    = slotStatus[slot.id];
                      const isAvail   = status?.available !== false;
                      const isSelected = selectedSlot === slot.id;
                      const isMine    = activePlacements.some(p => p.slotId === slot.id);
                      const isHP1     = slot.id === "HP-1";

                      return (
                        <button
                          key={slot.id}
                          disabled={!isAvail || isHP1}
                          onClick={() => setSelectedSlot(isSelected ? null : slot.id)}
                          className={`w-full text-left rounded-xl border p-4 transition-all ${
                            isSelected            ? "border-yellow-400 bg-yellow-400/10"
                            : isMine              ? "border-green-500/40 bg-green-500/8"
                            : isAvail && !isHP1   ? "border-white/10 bg-gray-900 hover:border-yellow-400/30 hover:bg-white/3"
                                                  : "border-white/5 bg-gray-900/50 opacity-60 cursor-not-allowed"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`text-sm font-bold ${isSelected ? "text-yellow-400" : "text-white"}`}>{slot.label}</span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                  isMine         ? "bg-green-500/20 text-green-400"
                                  : isHP1        ? "bg-purple-500/20 text-purple-400"
                                  : isAvail      ? "bg-green-500/15 text-green-400"
                                                 : "bg-red-500/15 text-red-400"
                                }`}>
                                  {isMine ? "Yours" : isHP1 ? "Brand Only" : isAvail ? "Available" : "Occupied"}
                                </span>
                              </div>
                              <p className="text-xs text-white/40 mt-0.5">{slot.description}</p>
                              {!isAvail && status?.expiresAt && (
                                <p className="text-[10px] text-red-400/60 mt-1">
                                  Free on {new Date(status.expiresAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                                </p>
                              )}
                            </div>
                            {slot.costPerDay > 0 && (
                              <div className="text-right flex-shrink-0">
                                <div className="text-sm font-black text-yellow-400">{slot.costPerDay} ₮</div>
                                <div className="text-[10px] text-white/30">per day</div>
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="space-y-4">
            <div className={`bg-gray-900 border rounded-xl p-5 transition-all ${selectedSlot ? "border-yellow-400/30" : "border-white/8"}`}>
              <h3 className="text-sm font-bold text-white mb-4">
                {selectedSlot ? `Book: ${slotDef?.label}` : "Select a slot to book"}
              </h3>
              {selectedSlot && slotDef ? (
                <>
                  <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">Duration</div>
                  <div className="space-y-2 mb-5">
                    {DURATION_OPTIONS.map((d, i) => {
                      const cost = slotDef.costPerDay * d.days;
                      return (
                        <button
                          key={d.days}
                          onClick={() => setSelectedDuration(i)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-sm transition-all ${
                            selectedDuration === i
                              ? "border-yellow-400 bg-yellow-400/10 text-yellow-400"
                              : "border-white/10 bg-gray-800 text-white/60 hover:border-yellow-400/30"
                          }`}
                        >
                          <span className="font-semibold">{d.label}</span>
                          <div className="text-right">
                            <div className="font-black">{cost} ₮</div>
                            {d.discount && <div className="text-[10px] text-green-400">{d.discount}</div>}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="bg-gray-800 rounded-lg p-3 mb-4 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-white/50">Total</div>
                      <div className="text-xl font-black text-yellow-400">{bookCost} ₮</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-white/50">After</div>
                      <div className={`text-sm font-bold ${tokenBalance - bookCost >= 0 ? "text-white" : "text-red-400"}`}>
                        {(tokenBalance - bookCost).toLocaleString()} ₮
                      </div>
                    </div>
                  </div>

                  {tokenBalance < bookCost && (
                    <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 text-red-400 text-xs mb-3">
                      <AlertCircle size={12} /> Insufficient. <a href="/user-buy" className="underline ml-1">Buy tokens</a>
                    </div>
                  )}

                  <button
                    onClick={handleBook}
                    disabled={booking || tokenBalance < bookCost}
                    className="w-full py-3 rounded-xl font-black text-sm bg-yellow-400 text-black hover:bg-yellow-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {booking
                      ? <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> Booking...</>
                      : `Confirm — Deduct ${bookCost} ₮`}
                  </button>
                  <p className="text-[10px] text-white/30 text-center mt-2">Cancel anytime for a partial refund</p>
                </>
              ) : (
                <div className="py-8 text-center text-white/25 text-sm">
                  <Layout size={28} className="mx-auto mb-3 opacity-30" />
                  Click an available slot on the left
                </div>
              )}
            </div>

            <div className="bg-gray-900 border border-white/8 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <Info size={13} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-white/50 leading-relaxed space-y-1.5">
                  <p><strong className="text-white">HP-1</strong> — Brand subscribers only.</p>
                  <p>Cancel early → get tokens back for remaining days.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PagePlacements;
