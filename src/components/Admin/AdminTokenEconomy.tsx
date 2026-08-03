import React, { useEffect, useState, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  Coins, TrendingUp, Gavel, History, Layers, ShieldCheck,
  IndianRupee, CheckCircle, AlertCircle, ArrowUpRight, RefreshCw,
  Upload, ImageIcon, Link as LinkIcon,
} from "lucide-react";
import axios from "axios";
import { LAMBDA } from "../../lib/apiConfig";
import { SLOT_DEFINITIONS } from "../UserDashboard/pages/PagePlacements";

const TOKEN_SPEND = LAMBDA.tokenSpend;
const ADS_UPLOAD_API = `${LAMBDA.eventsImageUpload}/upload/ads`;
const SLOT_LABELS: Record<string, string> = Object.fromEntries(SLOT_DEFINITIONS.map(s => [s.id, s.label]));

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
  holder?: string | null; imageUrl?: string | null; linkUrl?: string | null;
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
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);
  const [linkDraft, setLinkDraft] = useState<Record<string, string>>({});
  const [slotError, setSlotError] = useState("");
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

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
      const rawSlots = slotsR.data?.slots ?? {};
      const converted: Slot[] = Object.entries(rawSlots).map(([id, v]: [string, any]) => ({
        slotId: id,
        slotLabel: v.slotLabel || SLOT_LABELS[id] || id,
        costPerDay: v.costPerDay ?? 0,
        totalSlots: 1,
        occupiedSlots: v.available === false ? 1 : 0,
        available: v.available !== false,
        holder: v.holder ?? null,
        imageUrl: v.imageUrl ?? null,
        linkUrl: v.linkUrl ?? null,
      }));
      setSlots(converted);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAdminUploadCreative = async (slotId: string, slotLabel: string, file: File) => {
    if (!file.type.startsWith("image/")) {
      setSlotError("Please choose an image file for the ad banner.");
      return;
    }
    setUploadingFor(slotId);
    setSlotError("");
    try {
      const formData = new FormData();
      formData.append("userId", "admin@dronetv.in");
      formData.append("fieldName", "placementBanner");
      formData.append("file", file);

      const uploadRes = await axios.post(ADS_UPLOAD_API, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (!uploadRes.data?.success) throw new Error(uploadRes.data?.error || "Upload failed");

      const imageUrl = uploadRes.data.s3Url;
      const linkUrl = linkDraft[slotId] || "";

      const saveRes = await axios.put(`${TOKEN_SPEND}/admin/placement-creative`, {
        slotId, slotLabel, imageUrl, linkUrl,
      });
      if (!saveRes.data?.success) throw new Error(saveRes.data?.message || "Could not save creative");

      await fetchData();
    } catch (e: any) {
      setSlotError(e.response?.data?.message || e.message || "Failed to upload ad banner");
    } finally {
      setUploadingFor(null);
    }
  };

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
          <Coins size={20} className="text-brand-gold" />
          <h1 className="text-lg font-bold text-ink">Token Economy</h1>
          <span className="ml-2 text-xs font-bold bg-status-warning/15 text-status-warning px-2 py-0.5 rounded-full">
            Phase Gate: {PHASE_GATE_DEFAULTS.readiness}% Ready
          </span>
        </div>
        <button onClick={fetchData} className="p-1.5 text-ink-caption hover:text-ink-paragraph rounded-lg hover:bg-ink-light transition-colors">
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Tab bar */}
      <div className="flex gap-0 border-b-2 border-ink-light mb-5 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); window.history.replaceState(null, "", tab.path); }}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold whitespace-nowrap border-b-[3px] -mb-[2px] transition-all ${
                activeTab === tab.id ? "text-ink border-brand-yellow" : "text-ink-caption border-transparent hover:text-ink-paragraph"
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
                <div key={s.label} className="bg-surface-card rounded-xl border border-ink-light p-4">
                  <div className="flex items-center justify-between mb-1">
                    <Icon size={15} className="text-brand-gold" />
                  </div>
                  <div className="text-xl font-black text-ink">{s.value}</div>
                  <div className="text-xs text-ink-caption mt-0.5">{s.sub}</div>
                </div>
              );
            })}
          </div>

          {/* Revenue by stream */}
          <div className="bg-surface-card rounded-xl border border-ink-light p-4">
            <h3 className="text-sm font-bold text-ink-paragraph mb-3">Revenue by Stream — {ledgerMonthLabel}</h3>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-5 h-5 border-2 border-brand-yellow border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="space-y-2.5">
                {streams.length > 0 ? streams.map((stream) => (
                  <div key={stream.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-ink-paragraph">{stream.label}</span>
                      <span className="text-xs font-bold text-ink">{stream.tokens.toLocaleString()} ₮ · {stream.pct}%</span>
                    </div>
                    <div className="h-2 bg-ink-light rounded-full overflow-hidden">
                      <div className="h-full bg-brand-yellow rounded-full" style={{ width: `${Math.min(stream.pct, 100)}%` }} />
                    </div>
                  </div>
                )) : (
                  <p className="text-xs text-ink-caption text-center py-4">No spend data yet</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Live Auctions */}
      {activeTab === "auctions" && (
        <div className="bg-surface-card rounded-xl border border-ink-light overflow-hidden">
          <div className="px-4 py-3 border-b border-ink-light flex items-center justify-between">
            <h3 className="text-sm font-bold text-ink-paragraph">Keyword Bid Monitor — All Active Keywords</h3>
            <span className="text-xs text-ink-caption">{activeBids.length} active bids</span>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-5 h-5 border-2 border-brand-yellow border-t-transparent rounded-full animate-spin" />
            </div>
          ) : activeBids.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-ink-offwhite text-xs text-ink-caption uppercase tracking-wider">
                    <th className="px-4 py-2 text-left">Keyword</th>
                    <th className="px-4 py-2 text-left">User</th>
                    <th className="px-4 py-2 text-right">Bid/day</th>
                    <th className="px-4 py-2 text-right">Total Cost</th>
                    <th className="px-4 py-2 text-left">Expires</th>
                  </tr>
                </thead>
                <tbody>
                  {activeBids.map((row) => (
                    <tr key={row.bidId} className="border-t border-ink-light hover:bg-ink-offwhite">
                      <td className="px-4 py-3 font-medium text-ink">{row.keyword}</td>
                      <td className="px-4 py-3 text-xs text-ink-caption max-w-[120px] truncate">{row.userId}</td>
                      <td className="px-4 py-3 text-right font-bold text-ink">{row.bidAmount} ₮</td>
                      <td className="px-4 py-3 text-right text-ink-paragraph">{row.totalCost} ₮</td>
                      <td className="px-4 py-3 text-xs text-ink-caption">{formatDate(row.expiresAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-sm text-ink-caption">No active keyword bids yet</div>
          )}
        </div>
      )}

      {/* Token Ledger */}
      {activeTab === "ledger" && (
        <div className="bg-surface-card rounded-xl border border-ink-light overflow-hidden">
          <div className="px-4 py-3 border-b border-ink-light">
            <h3 className="text-sm font-bold text-ink-paragraph">Token Transaction Ledger — {ledgerMonthLabel}</h3>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-5 h-5 border-2 border-brand-yellow border-t-transparent rounded-full animate-spin" />
            </div>
          ) : ledger.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-ink-offwhite text-xs text-ink-caption uppercase tracking-wider">
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
                    <tr key={row.id ?? i} className="border-t border-ink-light hover:bg-ink-offwhite">
                      <td className="px-4 py-2.5 text-xs text-ink-caption whitespace-nowrap">{formatDate(row.createdAt)}</td>
                      <td className="px-4 py-2.5 text-xs text-ink-paragraph font-medium max-w-[120px] truncate">{row.userId}</td>
                      <td className="px-4 py-2.5 text-xs text-ink-paragraph capitalize">{row.type}</td>
                      <td className="px-4 py-2.5 text-xs text-ink-caption max-w-[140px] truncate">
                        {row.keyword ?? row.slotLabel ?? "—"}
                      </td>
                      <td className={`px-4 py-2.5 text-right text-xs font-bold ${row.tokens >= 0 ? "text-status-success" : "text-status-error"}`}>
                        {row.tokens >= 0 ? `+${row.tokens}` : row.tokens} ₮
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          row.status === "active" ? "bg-status-success/15 text-status-success" :
                          row.status === "expired" ? "bg-ink-light text-ink-caption" :
                          row.status === "cancelled" ? "bg-status-error/15 text-status-error" :
                          "bg-status-info/15 text-status-info"
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
            <div className="py-12 text-center text-sm text-ink-caption">No transactions yet</div>
          )}
        </div>
      )}

      {/* Slot Management */}
      {activeTab === "slots" && (
        <div className="space-y-3">
          {slotError && (
            <div className="flex items-center gap-2 bg-status-error/10 border border-status-error/25 rounded-xl px-4 py-2.5 text-status-error text-xs">
              <AlertCircle size={13} /> {slotError}
            </div>
          )}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-5 h-5 border-2 border-brand-yellow border-t-transparent rounded-full animate-spin" />
            </div>
          ) : slots.length > 0 ? slots.map((slot) => {
            const fillPct = slot.totalSlots > 0 ? Math.round((slot.occupiedSlots / slot.totalSlots) * 100) : 0;
            const statusLabel = slot.occupiedSlots >= slot.totalSlots ? "Full" : slot.occupiedSlots > 0 ? "Partial" : "Available";
            const statusColor = slot.occupiedSlots >= slot.totalSlots
              ? "bg-surface-main text-brand-gold"
              : slot.occupiedSlots > 0 ? "bg-status-info/10 text-status-info" : "bg-status-success/10 text-status-success";
            return (
              <div key={slot.slotId} className="bg-surface-card rounded-xl border border-ink-light p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-bold text-ink">{slot.slotLabel}</span>
                      <span className="text-[10px] font-bold text-ink-caption bg-ink-light px-1.5 py-0.5 rounded">{slot.slotId}</span>
                    </div>
                    <div className="text-xs text-ink-caption">
                      {slot.occupiedSlots}/{slot.totalSlots} slots · {slot.costPerDay} ₮/day
                      {slot.holder && slot.holder !== "admin@dronetv.in" && <> · booked by <span className="text-ink-paragraph font-medium">{slot.holder}</span></>}
                      {slot.holder === "admin@dronetv.in" && <> · set by admin (free)</>}
                    </div>
                    <div className="mt-2 h-1.5 bg-ink-light rounded-full w-32 overflow-hidden">
                      <div className="h-full bg-brand-yellow rounded-full" style={{ width: `${fillPct}%` }} />
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

                <div className="mt-3 flex items-start gap-3 bg-ink-offwhite border border-ink-light rounded-lg p-3">
                  {slot.imageUrl ? (
                    <img src={slot.imageUrl} alt={`${slot.slotLabel} banner`} className="w-24 h-14 object-cover rounded border border-ink-light flex-shrink-0" />
                  ) : (
                    <div className="w-24 h-14 flex items-center justify-center bg-surface-card rounded border border-dashed border-ink-light flex-shrink-0">
                      <ImageIcon size={16} className="text-ink-light" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0 space-y-2">
                    {!slot.imageUrl && (
                      <p className="text-xs text-brand-gold">No ad banner set — this slot shows the default placeholder on the live site.</p>
                    )}
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <LinkIcon size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-light" />
                        <input
                          type="url"
                          placeholder="Click-through link (optional)"
                          defaultValue={slot.linkUrl || ""}
                          onChange={(e) => setLinkDraft(prev => ({ ...prev, [slot.slotId]: e.target.value }))}
                          className="w-full pl-7 pr-2 py-1.5 bg-surface-card border border-ink-light rounded text-xs text-ink placeholder-ink-caption focus:outline-none focus:border-brand-yellow"
                        />
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={(el) => { fileInputRefs.current[slot.slotId] = el; }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleAdminUploadCreative(slot.slotId, slot.slotLabel, file);
                          e.target.value = "";
                        }}
                      />
                      <button
                        onClick={() => fileInputRefs.current[slot.slotId]?.click()}
                        disabled={uploadingFor === slot.slotId}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-brand-gold border border-brand-yellow/50 bg-surface-main rounded-lg hover:bg-brand-yellow-soft transition-colors disabled:opacity-40 whitespace-nowrap"
                      >
                        {uploadingFor === slot.slotId
                          ? <div className="w-3 h-3 border border-brand-gold border-t-transparent rounded-full animate-spin" />
                          : <Upload size={12} />}
                        {slot.imageUrl ? "Change Banner" : "Upload Banner"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="py-12 text-center text-sm text-ink-caption">No slots data</div>
          )}
        </div>
      )}

      {/* Phase Gate */}
      {activeTab === "phase-gate" && (
        <div className="space-y-4">
          <div className="bg-surface-card rounded-xl border border-ink-light p-5">
            <h3 className="text-sm font-bold text-ink-paragraph mb-1">
              Token Economy Activation — Phase Gate
            </h3>
            <p className="text-xs text-ink-caption mb-4">
              Token economy activates automatically at 250 active listings. You can also force-activate manually.
            </p>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-ink">
                {PHASE_GATE_DEFAULTS.current} / {PHASE_GATE_DEFAULTS.threshold} active listings
              </span>
              <span className="text-sm font-black text-status-warning">{PHASE_GATE_DEFAULTS.readiness}% ready</span>
            </div>
            <div className="h-4 bg-ink-light rounded-full overflow-hidden mb-5">
              <div
                className="h-full bg-gradient-to-r from-brand-yellow to-status-warning rounded-full transition-all"
                style={{ width: `${PHASE_GATE_DEFAULTS.readiness}%` }}
              />
            </div>
            {phaseActivated ? (
              <div className="flex items-center gap-2 bg-status-success/10 border border-status-success/25 rounded-xl px-4 py-3 text-status-success text-sm font-bold">
                <CheckCircle size={16} className="text-status-success" />
                Token Economy is LIVE — all features enabled
              </div>
            ) : (
              <button
                onClick={handleActivate}
                className="px-4 py-2.5 rounded-xl bg-brand-yellow text-ink text-sm font-black hover:bg-brand-yellow-soft transition-colors flex items-center gap-2"
              >
                <Coins size={15} />
                Activate Token Economy Now
              </button>
            )}
          </div>

          <div className="bg-surface-card rounded-xl border border-ink-light p-4">
            <h3 className="text-sm font-bold text-ink-paragraph mb-3">Feature Controls</h3>
            <div className="space-y-2">
              {phaseControls.map((ctrl, idx) => (
                <div key={ctrl.label} className="flex items-center justify-between py-2 border-b border-ink-light last:border-0">
                  <span className="text-sm text-ink-paragraph">{ctrl.label}</span>
                  <button
                    onClick={() => toggleControl(idx)}
                    className={`w-10 h-5 rounded-full transition-all relative ${ctrl.active ? "bg-status-success" : "bg-ink-light"}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-surface-card transition-transform shadow ${ctrl.active ? "translate-x-5" : "translate-x-0"}`} />
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
