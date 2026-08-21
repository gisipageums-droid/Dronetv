import React, { useState, useEffect, useCallback, useRef } from "react";
import { Layout, Coins, CheckCircle, AlertCircle, RefreshCw, X, Info, Upload, ImageIcon, Link as LinkIcon } from "lucide-react";
import { useUserAuth } from "../../context/context";
import axios from "axios";
import { AUTH_API, PAYMENT_API, LAMBDA } from "../../../lib/apiConfig";
import { authHeader } from "../../../lib/authService";

const PROFILE_API = AUTH_API ? `${AUTH_API}/profile` : `${LAMBDA.profile}/profile`;
const TOKEN_SPEND = LAMBDA.tokenSpend;
const ADS_UPLOAD_API = `${LAMBDA.eventsImageUpload}/upload/ads`;

export const DURATION_OPTIONS = [
  { days: 1,  label: "1 Day",   discount: "" },
  { days: 7,  label: "1 Week",  discount: "Save 10%" },
  { days: 14, label: "2 Weeks", discount: "Save 15%" },
  { days: 30, label: "1 Month", discount: "Save 20%" },
];

// `pageUrl` is the exact live page this slot's creative renders on — verified
// against the actual <PagePlacementSlot> call sites in the codebase, not
// guessed. Slots with `pageUrl: null` have no page wired up yet; those also
// carry `disabled: true` so they can't be booked (and money taken) for a
// slot with nowhere to display. Keep this in sync whenever a slot is wired
// or moved — a wrong link here is worse than no link.
export const SLOT_DEFINITIONS = [
  { id: "HP-1", label: "Homepage Hero Banner",       category: "Homepage",   costPerDay: 0,   description: "Brand subscribers only — full-width hero", pageUrl: null as string | null, sizeHint: "1600×500", disabled: true, disabledReason: "Brand Only" },
  { id: "HP-2", label: "Featured Strip — Slot A",    category: "Homepage",   costPerDay: 100, description: "Top featured strip, left position", pageUrl: "/" as string | null, sizeHint: "900×300 (3:1)" },
  { id: "HP-3", label: "Featured Strip — Slot B",    category: "Homepage",   costPerDay: 100, description: "Top featured strip, right position", pageUrl: "/" as string | null, sizeHint: "900×300 (3:1)" },
  { id: "HP-4", label: "Sponsored Article",          category: "Homepage",   costPerDay: 50,  description: "Inline sponsored news article", pageUrl: "/" as string | null, sizeHint: "1000×250 (4:1)" },
  { id: "HP-5", label: "Ticker Announcement",        category: "Homepage",   costPerDay: 30,  description: "Scrolling ticker at the top", pageUrl: null as string | null, sizeHint: "—", disabled: true, disabledReason: "Coming Soon" },
  { id: "cat-drones",  label: "Commercial Drones",   category: "Categories", costPerDay: 40,  description: "Sponsored Categories rail on Products page", pageUrl: "/products" as string | null, sizeHint: "900×300 (3:1)" },
  { id: "cat-gis",     label: "GIS & Mapping",       category: "Categories", costPerDay: 40,  description: "Sponsored Categories rail on Products page", pageUrl: "/products" as string | null, sizeHint: "900×300 (3:1)" },
  { id: "cat-agri",    label: "Agriculture",          category: "Categories", costPerDay: 40,  description: "Sponsored Categories rail on Products page", pageUrl: "/products" as string | null, sizeHint: "900×300 (3:1)" },
  { id: "cat-defence", label: "Defence & Security",  category: "Categories", costPerDay: 40,  description: "Sponsored Categories rail on Products page", pageUrl: "/products" as string | null, sizeHint: "900×300 (3:1)" },
  { id: "cat-training",label: "Training & RPTOs",    category: "Categories", costPerDay: 40,  description: "Top spot on Training page", pageUrl: "/professionals/training" as string | null, sizeHint: "1000×250 (4:1)" },
  { id: "media-news",    label: "News Pulse Spot",   category: "Media Hub",  costPerDay: 60,  description: "Featured company card in news section", pageUrl: "/media/news-pulse" as string | null, sizeHint: "1000×250 (4:1)" },
  { id: "media-video",   label: "Video Spotlight",   category: "Media Hub",  costPerDay: 80,  description: "Featured video in Video Spotlight", pageUrl: "/media/video-spotlight" as string | null, sizeHint: "1000×250 (4:1)" },
  { id: "media-magazine",label: "Magazine Feature",  category: "Media Hub",  costPerDay: 70,  description: "Featured article placement in Magazine", pageUrl: "/media/magazine" as string | null, sizeHint: "1000×250 (4:1)" },
];

interface SlotStatus { available: boolean; costPerDay: number; holder: string | null; expiresAt: string | null; }
interface Placement { placementId: string; slotId: string; slotLabel: string; durationDays: number; costPerDay: number; totalTokens: number; status: string; createdAt: string; expiresAt: string; daysLeft?: number; imageUrl?: string | null; linkUrl?: string | null; }

const PagePlacements: React.FC = () => {
  const { user } = useUserAuth();
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [packageType, setPackageType]   = useState<string>("");
  const [slotStatus, setSlotStatus]     = useState<Record<string, SlotStatus>>({});
  const [myPlacements, setMyPlacements] = useState<Placement[]>([]);
  const [loading, setLoading]           = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number>(0);
  const [booking, setBooking]           = useState(false);
  const [cancelling, setCancelling]     = useState<string | null>(null);
  const [success, setSuccess]           = useState("");
  const [error, setError]               = useState("");
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);
  const [linkDraft, setLinkDraft]       = useState<Record<string, string>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const userId = user?.userData?.email || user?.email || "";

  const fetchAll = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const [profileR, slotsR, placR] = await Promise.all([
        axios.get(`${PROFILE_API}?userId=${userId}`, { headers: authHeader() }),
        axios.get(PAYMENT_API ? `${PAYMENT_API}/placements/slots` : `${TOKEN_SPEND}/slots`),
        axios.get(PAYMENT_API ? `${PAYMENT_API}/placements?userId=${userId}` : `${TOKEN_SPEND}/placements?userId=${userId}`, { headers: authHeader() }),
      ]);
      setTokenBalance(profileR.data?.tokenBalance ?? 0);
      setPackageType((profileR.data?.packageType || "").toLowerCase());
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
  const liveCostPerDay = selectedSlot ? (slotStatus[selectedSlot]?.costPerDay ?? slotDef?.costPerDay ?? 0) : 0;
  const bookCost = durOpt ? liveCostPerDay * durOpt.days : 0;
  const categories = Array.from(new Set(SLOT_DEFINITIONS.map(s => s.category)));
  const hasPackage = ["reach", "scale", "brand"].includes(packageType);

  const handleBook = async () => {
    if (!selectedSlot || !slotDef || !durOpt) return;
    setBooking(true); setError("");
    try {
      const r = await axios.post(PAYMENT_API ? `${PAYMENT_API}/placements` : `${TOKEN_SPEND}/placement`, {
        userId, slotId: selectedSlot, slotLabel: slotDef.label, durationDays: durOpt.days,
      }, { headers: authHeader() });
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
      const r = await axios.delete(
        PAYMENT_API
          ? `${PAYMENT_API}/placements/${placementId}?userId=${userId}`
          : `${TOKEN_SPEND}/placement?placementId=${placementId}&userId=${userId}`,
        { headers: authHeader() }
      );
      if (r.data.success) {
        setTokenBalance(prev => prev + (r.data.refunded || 0));
        await fetchAll();
      }
    } catch {}
    setCancelling(null);
  };

  const handleUploadCreative = async (placementId: string, file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file for the ad banner.");
      return;
    }
    setUploadingFor(placementId);
    setError("");
    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("fieldName", "placementBanner");
      formData.append("file", file);

      const uploadRes = await axios.post(ADS_UPLOAD_API, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (!uploadRes.data?.success) throw new Error(uploadRes.data?.error || "Upload failed");

      const imageUrl = uploadRes.data.s3Url;
      const linkUrl = linkDraft[placementId] || "";

      const saveRes = await axios.put(
        PAYMENT_API ? `${PAYMENT_API}/placements/creative` : `${TOKEN_SPEND}/placement/creative`,
        { placementId, userId, imageUrl, linkUrl },
        { headers: authHeader() }
      );
      if (!saveRes.data?.success) throw new Error(saveRes.data?.message || "Could not save creative");

      setSuccess("Ad banner uploaded!");
      setTimeout(() => setSuccess(""), 4000);
      await fetchAll();
    } catch (e: any) {
      setError(e.response?.data?.message || e.message || "Failed to upload ad banner");
    } finally {
      setUploadingFor(null);
    }
  };

  return (
    <div className="min-h-screen bg-ink p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Layout size={22} className="text-brand-yellow" /> Page Placements
            </h1>
            <p className="text-sm text-white/40 mt-0.5">Book premium slots on DroneTv.in pages</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] text-white/40 uppercase tracking-widest">Balance</div>
              <div className="text-lg font-black text-brand-yellow">{tokenBalance.toLocaleString()} ₮</div>
            </div>
            <button onClick={fetchAll} className="p-2 text-white/30 hover:text-white rounded-lg hover:bg-white/8 transition-colors">
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {success && (
          <div className="flex items-center gap-2 bg-status-success/15 border border-status-success/30 rounded-xl px-5 py-3 mb-5 text-status-success text-sm">
            <CheckCircle size={15} /> {success}
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 bg-status-error/15 border border-status-error/30 rounded-xl px-5 py-3 mb-5 text-status-error text-sm">
            <AlertCircle size={15} /> {error}
          </div>
        )}

        {activePlacements.length > 0 && (
          <div className="bg-ink border border-brand-yellow/20 rounded-xl overflow-hidden mb-6">
            <div className="px-5 py-3 border-b border-white/8">
              <span className="text-sm font-bold text-brand-yellow">Active Placements ({activePlacements.length})</span>
            </div>
            <div className="divide-y divide-white/5">
              {activePlacements.map(p => (
                <div key={p.placementId} className="px-5 py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-white">{p.slotLabel}</div>
                      <div className="text-xs text-white/40">{p.totalTokens} ₮ · {Math.max(0, Math.ceil((new Date(p.expiresAt).getTime() - Date.now()) / 86400000))}d remaining</div>
                    </div>
                    <button
                      onClick={() => handleCancel(p.placementId)}
                      disabled={cancelling === p.placementId}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-status-error border border-status-error/20 rounded-lg hover:bg-status-error/10 transition-colors disabled:opacity-40"
                    >
                      {cancelling === p.placementId
                        ? <div className="w-3 h-3 border border-status-error border-t-transparent rounded-full animate-spin" />
                        : <X size={12} />}
                      Cancel
                    </button>
                  </div>

                  <div className="mt-3 flex items-start gap-3 bg-ink/30 border border-white/8 rounded-lg p-3">
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt={`${p.slotLabel} banner`} className="w-24 h-14 object-cover rounded border border-white/10 flex-shrink-0" />
                    ) : (
                      <div className="w-24 h-14 flex items-center justify-center bg-white/5 rounded border border-dashed border-white/15 flex-shrink-0">
                        <ImageIcon size={16} className="text-white/25" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0 space-y-2">
                      {!p.imageUrl && (
                        <p className="text-xs text-brand-yellow/90">No ad banner uploaded yet — this slot won't show anything until you add one.</p>
                      )}
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <LinkIcon size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/25" />
                          <input
                            type="url"
                            placeholder="Click-through link (optional)"
                            defaultValue={p.linkUrl || ""}
                            onChange={(e) => setLinkDraft(prev => ({ ...prev, [p.placementId]: e.target.value }))}
                            className="w-full pl-7 pr-2 py-1.5 bg-white/5 border border-white/10 rounded text-xs text-white placeholder-white/30 focus:outline-none focus:border-brand-yellow/50"
                          />
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          ref={(el) => { fileInputRefs.current[p.placementId] = el; }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUploadCreative(p.placementId, file);
                            e.target.value = "";
                          }}
                        />
                        <button
                          onClick={() => fileInputRefs.current[p.placementId]?.click()}
                          disabled={uploadingFor === p.placementId}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-brand-yellow border border-brand-yellow/30 rounded-lg hover:bg-brand-yellow/10 transition-colors disabled:opacity-40 whitespace-nowrap"
                        >
                          {uploadingFor === p.placementId
                            ? <div className="w-3 h-3 border border-brand-yellow border-t-transparent rounded-full animate-spin" />
                            : <Upload size={12} />}
                          {p.imageUrl ? "Change Banner" : "Upload Banner"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-7 h-7 border-2 border-brand-yellow border-t-transparent rounded-full animate-spin" />
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
                      const isDisabled = !!slot.disabled;

                      return (
                        <div key={slot.id}>
                          <button
                            disabled={!isAvail || isDisabled}
                            onClick={() => setSelectedSlot(isSelected ? null : slot.id)}
                            className={`w-full text-left rounded-xl border p-4 transition-all ${
                              isSelected              ? "border-brand-yellow bg-brand-yellow/10"
                              : isMine                ? "border-status-success/40 bg-status-success/8"
                              : isAvail && !isDisabled ? "border-white/10 bg-ink hover:border-brand-yellow/30 hover:bg-white/3"
                                                       : "border-white/5 bg-ink/50 opacity-60 cursor-not-allowed"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className={`text-sm font-bold ${isSelected ? "text-brand-yellow" : "text-white"}`}>{slot.label}</span>
                                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                    isMine         ? "bg-status-success/20 text-status-success"
                                    : isDisabled   ? "bg-brand-gold/20 text-brand-gold"
                                    : isAvail      ? "bg-status-success/15 text-status-success"
                                                   : "bg-status-error/15 text-status-error"
                                  }`}>
                                    {isMine ? "Yours" : isDisabled ? slot.disabledReason : isAvail ? "Available" : "Occupied"}
                                  </span>
                                </div>
                                <p className="text-xs text-white/40 mt-0.5">{slot.description}</p>
                                {!isAvail && status?.expiresAt && (
                                  <p className="text-[10px] text-status-error/60 mt-1">
                                    Free on {new Date(status.expiresAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                                  </p>
                                )}
                              </div>
                              {(slotStatus[slot.id]?.costPerDay ?? slot.costPerDay) > 0 && (
                                <div className="text-right flex-shrink-0">
                                  <div className="text-sm font-black text-brand-yellow">{slotStatus[slot.id]?.costPerDay ?? slot.costPerDay} ₮</div>
                                  <div className="text-[10px] text-white/30">per day</div>
                                </div>
                              )}
                            </div>
                          </button>
                          <div className="flex items-center justify-between px-1 mt-1">
                            <span className="text-[10px] text-white/30">Recommended size: {slot.sizeHint}</span>
                            {slot.pageUrl && (
                              <a
                                href={slot.pageUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-[10px] font-semibold text-brand-yellow/80 hover:text-brand-yellow underline"
                              >
                                View page where this shows →
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="space-y-4">
            <div className={`bg-ink border rounded-xl p-5 transition-all ${selectedSlot ? "border-brand-yellow/30" : "border-white/8"}`}>
              <h3 className="text-sm font-bold text-white mb-4">
                {selectedSlot ? `Book: ${slotDef?.label}` : "Select a slot to book"}
              </h3>
              {selectedSlot && slotDef ? (
                <>
                  <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">Duration</div>
                  <div className="space-y-2 mb-5">
                    {DURATION_OPTIONS.map((d, i) => {
                      const cost = liveCostPerDay * d.days;
                      return (
                        <button
                          key={d.days}
                          onClick={() => setSelectedDuration(i)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-sm transition-all ${
                            selectedDuration === i
                              ? "border-brand-yellow bg-brand-yellow/10 text-brand-yellow"
                              : "border-white/10 bg-ink-charcoal text-white/60 hover:border-brand-yellow/30"
                          }`}
                        >
                          <span className="font-semibold">{d.label}</span>
                          <div className="text-right">
                            <div className="font-black">{cost} ₮</div>
                            {d.discount && <div className="text-[10px] text-status-success">{d.discount}</div>}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="bg-ink-charcoal rounded-lg p-3 mb-4 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-white/50">Total</div>
                      <div className="text-xl font-black text-brand-yellow">{bookCost} ₮</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-white/50">After</div>
                      <div className={`text-sm font-bold ${tokenBalance - bookCost >= 0 ? "text-white" : "text-status-error"}`}>
                        {(tokenBalance - bookCost).toLocaleString()} ₮
                      </div>
                    </div>
                  </div>

                  {!hasPackage && (
                    <div className="flex items-center gap-2 bg-status-error/10 border border-status-error/20 rounded-lg px-3 py-2 text-status-error text-xs mb-3">
                      <AlertCircle size={12} /> Requires an active package. <a href="/user-recharge" className="underline ml-1">Upgrade</a>
                    </div>
                  )}
                  {hasPackage && tokenBalance < bookCost && (
                    <div className="flex items-center gap-2 bg-status-error/10 border border-status-error/20 rounded-lg px-3 py-2 text-status-error text-xs mb-3">
                      <AlertCircle size={12} /> Insufficient. <a href="/user-buy" className="underline ml-1">Buy tokens</a>
                    </div>
                  )}

                  <button
                    onClick={handleBook}
                    disabled={booking || !hasPackage || tokenBalance < bookCost}
                    className="w-full py-3 rounded-xl font-black text-sm bg-brand-yellow text-ink hover:bg-brand-yellow-soft disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {booking
                      ? <><div className="w-4 h-4 border-2 border-ink border-t-transparent rounded-full animate-spin" /> Booking...</>
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

            <div className="bg-ink border border-white/8 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <Info size={13} className="text-brand-yellow flex-shrink-0 mt-0.5" />
                <div className="text-xs text-white/50 leading-relaxed space-y-1.5">
                  <p><strong className="text-white">HP-1</strong> — Brand subscribers only.</p>
                  <p><strong className="text-white">HP-5</strong> — Coming soon, not bookable yet.</p>
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
