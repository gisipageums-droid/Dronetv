import React, { useState, useEffect, useCallback } from "react";
import {
  Video, FileText, Share2, Newspaper, Megaphone, BookOpen,
  Star, Zap, Coins, CheckCircle2, X, ShoppingCart, AlertTriangle,
  ChevronRight, Package,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useUserAuth } from "../../context/context";
import { AUTH_API, PAYMENT_API, LAMBDA } from '../../../lib/apiConfig';
import { authHeader } from '../../../lib/authService';

const PROFILE_API = AUTH_API ? `${AUTH_API}/profile` : `${LAMBDA.profile}/profile`;
const TOKEN_SPEND = LAMBDA.tokenSpend;

function getStoredActive(email: string): string[] {
  try { return JSON.parse(localStorage.getItem(`addons_active_${email}`) || "[]"); }
  catch { return []; }
}

function saveActive(email: string, ids: string[]) {
  localStorage.setItem(`addons_active_${email}`, JSON.stringify(ids));
}

interface Addon {
  id: string;
  icon: React.ElementType;
  title: string;
  desc: string;
  tokens: number;
  tag: string;
  tagColor: string;
  popular?: boolean;
  positionEffect?: string;
}

const ADDONS: Addon[] = [
  {
    id: "video_interview",
    icon: Video,
    title: "Video Interview (5 min)",
    desc: "CEO/founder interview produced and published on YouTube. Embedded on your DroneTv company profile.",
    tokens: 200,
    tag: "Video",
    tagColor: "bg-status-error/15 text-status-error",
    popular: true,
  },
  {
    id: "short_reel",
    icon: Video,
    title: "Short Reel (1 min)",
    desc: "Product / service reel published on Instagram, Facebook and LinkedIn simultaneously.",
    tokens: 100,
    tag: "Video",
    tagColor: "bg-status-error/15 text-status-error",
  },
  {
    id: "editorial_article",
    icon: FileText,
    title: "Editorial Article",
    desc: "600–1000 word article about your company published on DroneTv.in and promoted on social channels.",
    tokens: 80,
    tag: "Article",
    tagColor: "bg-status-success/15 text-status-success",
  },
  {
    id: "promo_posts",
    icon: Share2,
    title: "Promotional Posts (3-pack)",
    desc: "3 company posts published across LinkedIn, Instagram and Facebook with your brand tagged.",
    tokens: 50,
    tag: "Social",
    tagColor: "bg-status-info/15 text-status-info",
  },
  {
    id: "press_release",
    icon: Megaphone,
    title: "Press Release",
    desc: "Press release written and published on DroneTv.in for announcements, launches or milestones.",
    tokens: 150,
    tag: "PR",
    tagColor: "bg-brand-gold/15 text-brand-gold",
  },
  {
    id: "news_post",
    icon: Newspaper,
    title: "DroneTv News Post",
    desc: "Short platform news post for your announcement, product launch or certification achievement.",
    tokens: 40,
    tag: "News",
    tagColor: "bg-status-info/15 text-status-info",
  },
  {
    id: "magazine_half",
    icon: BookOpen,
    title: "Magazine Half-Page Ad",
    desc: "Half-page advertisement in DroneTv quarterly print & digital magazine reaching industry decision-makers.",
    tokens: 300,
    tag: "Magazine",
    tagColor: "bg-brand-yellow-soft text-brand-gold",
    popular: true,
  },
  {
    id: "featured_placement",
    icon: Star,
    title: "Featured Placement (1 month)",
    desc: "Your company featured on the DroneTv homepage and category pages with priority search ranking for 30 days.",
    tokens: 500,
    tag: "Featured",
    tagColor: "bg-status-warning/15 text-status-warning",
    positionEffect: "Your listings appear at the TOP of all category and search pages with a FEATURED badge.",
  },
  {
    id: "priority_search",
    icon: Zap,
    title: "Priority Search Ranking (3 months)",
    desc: "Appear at the top of all relevant search results and category pages within your sector for 3 months.",
    tokens: 400,
    tag: "Visibility",
    tagColor: "bg-status-info/15 text-status-info",
    positionEffect: "Your listing ranks above standard results in search and category pages for 3 months.",
  },
];

const POSITION_ADDONS = ["featured_placement", "priority_search"];

const Addons: React.FC = () => {
  const { user } = useUserAuth();
  const [tokenBalance, setTokenBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [activeIds, setActiveIds] = useState<string[]>([]);
  const [confirmAddon, setConfirmAddon] = useState<Addon | null>(null);
  const [tab, setTab] = useState<"store" | "active">("store");

  const userId = user?.userData?.email || user?.email || "";

  const fetchProfile = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    try {
      const res = await axios.get(`${PROFILE_API}?userId=${userId}`, { headers: authHeader() });
      setTokenBalance(res.data?.tokenBalance || 0);
    } catch { /* silent */ }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchProfile();
    if (userId) setActiveIds(getStoredActive(userId));
  }, [fetchProfile, userId]);

  const handlePurchase = async (addon: Addon) => {
    if (tokenBalance < addon.tokens) {
      toast.error(`Insufficient tokens. You need ${addon.tokens} but have ${tokenBalance}.`);
      return;
    }
    setConfirmAddon(addon);
  };

  const confirmPurchase = async () => {
    if (!confirmAddon) return;
    if (confirmAddon.tokens <= 0) return;
    setPurchasing(confirmAddon.id);
    setConfirmAddon(null);

    try {
      const r = await axios.post(
        PAYMENT_API ? `${PAYMENT_API}/bids` : `${TOKEN_SPEND}/bid`,
        {
          userId,
          keyword: `[Addon] ${confirmAddon.title}`,
          bidAmount: confirmAddon.tokens,
          durationDays: 1,
          totalCost: confirmAddon.tokens,
        }
      );
      if (!r.data?.success) {
        toast.error(r.data?.message || "Purchase failed. Please try again.");
        setPurchasing(null);
        return;
      }
    } catch {
      toast.error("Purchase failed. Please try again.");
      setPurchasing(null);
      return;
    }

    const updated = [...new Set([...activeIds, confirmAddon.id])];
    setActiveIds(updated);
    saveActive(userId, updated);
    toast.success(`${confirmAddon.title} purchased! Our team will contact you within 24 hours.`);
    setPurchasing(null);
    fetchProfile();
  };

  const activeAddons = ADDONS.filter(a => activeIds.includes(a.id));
  const positionAddons = activeAddons.filter(a => POSITION_ADDONS.includes(a.id));

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <p className="text-xs font-bold tracking-widest text-brand-yellow uppercase mb-1">ADDONS</p>
        <h1 className="text-2xl font-black text-ink">Premium Add-on Services</h1>
        <p className="text-sm text-ink-caption mt-1">Purchase individual media and marketing services using your token balance.</p>
      </div>

      {/* Token balance bar */}
      <div className="bg-ink rounded-2xl px-5 py-4 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-yellow/15 flex items-center justify-center">
            <Coins size={20} className="text-brand-yellow" />
          </div>
          <div>
            <p className="text-xs text-white/50 uppercase tracking-wide">Token Balance</p>
            <p className="text-2xl font-black text-brand-yellow">{loading ? "…" : tokenBalance.toLocaleString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {activeIds.length > 0 && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-yellow/15 text-brand-yellow text-xs font-bold">
              <Package size={13} />
              {activeIds.length} active
            </span>
          )}
          <a href="/user-recharge" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-yellow text-ink text-sm font-bold hover:bg-brand-gold transition-colors">
            <Coins size={15} />
            Top Up
          </a>
        </div>
      </div>

      {/* Position effect banner */}
      {positionAddons.length > 0 && (
        <div className="mb-5 p-4 rounded-xl border border-brand-yellow-soft bg-surface-main flex items-start gap-3">
          <Star size={18} className="text-brand-gold flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-brand-gold">Active Positioning</p>
            {positionAddons.map(a => (
              <p key={a.id} className="text-xs text-brand-gold mt-0.5">{a.positionEffect}</p>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-5">
        {(["store", "active"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
              tab === t ? "bg-ink text-white" : "bg-ink-light text-ink-caption hover:bg-ink-light"
            }`}
          >
            {t === "store" ? "Services" : `Active (${activeIds.length})`}
          </button>
        ))}
      </div>

      {/* Active addons tab */}
      {tab === "active" && (
        <div>
          {activeAddons.length === 0 ? (
            <div className="text-center py-14 bg-surface-card rounded-2xl border border-dashed border-ink-light">
              <Package size={32} className="mx-auto text-ink-light mb-3" />
              <p className="font-bold text-ink-caption">No active addons yet</p>
              <p className="text-sm text-ink-caption mt-1 mb-4">Browse the Services tab to purchase your first addon.</p>
              <button onClick={() => setTab("store")} className="flex items-center gap-1.5 mx-auto px-4 py-2 rounded-xl bg-brand-yellow text-ink text-sm font-bold hover:bg-brand-gold transition-colors">
                Browse Services <ChevronRight size={14} />
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {activeAddons.map(addon => {
                const Icon = addon.icon;
                return (
                  <div key={addon.id} className="bg-surface-card border border-status-success/25 rounded-xl px-5 py-4 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-status-success/10 flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-status-success" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-ink">{addon.title}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide ${addon.tagColor}`}>{addon.tag}</span>
                        <span className="flex items-center gap-1 text-[11px] text-status-success font-semibold">
                          <CheckCircle2 size={12} />Active
                        </span>
                      </div>
                      {addon.positionEffect && (
                        <p className="text-xs text-ink-caption mt-1 flex items-start gap-1">
                          <Star size={11} className="text-brand-gold flex-shrink-0 mt-0.5" />
                          {addon.positionEffect}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Store tab */}
      {tab === "store" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {ADDONS.map(addon => {
            const Icon = addon.icon;
            const isPurchased = activeIds.includes(addon.id);
            const isProcessing = purchasing === addon.id;
            const canAfford = tokenBalance >= addon.tokens;

            return (
              <div
                key={addon.id}
                className={`bg-surface-card rounded-2xl border shadow-sm flex flex-col ${isPurchased ? "border-status-success/40" : "border-ink-light"}`}
              >
                {addon.popular && (
                  <div className="px-4 pt-3 pb-0">
                    <span className="text-[10px] font-bold bg-brand-yellow text-ink px-2 py-0.5 rounded-full uppercase tracking-wide">Popular</span>
                  </div>
                )}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-yellow/10 flex items-center justify-center">
                      <Icon size={20} className="text-brand-gold" />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide ${addon.tagColor}`}>{addon.tag}</span>
                  </div>
                  <h3 className="font-bold text-ink text-sm mb-1">{addon.title}</h3>
                  <p className="text-xs text-ink-caption leading-relaxed mb-3">{addon.desc}</p>
                  {addon.positionEffect && (
                    <p className="text-[11px] text-brand-gold bg-surface-main border border-brand-yellow-soft rounded-lg px-2.5 py-1.5 mb-3 flex items-start gap-1">
                      <Star size={11} className="flex-shrink-0 mt-0.5" />
                      {addon.positionEffect}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-1">
                      <Coins size={14} className="text-brand-gold" />
                      <span className="text-base font-black text-ink">{addon.tokens}</span>
                      <span className="text-xs text-ink-caption">tokens</span>
                    </div>
                    {isPurchased ? (
                      <div className="flex items-center gap-1 text-status-success text-sm font-semibold">
                        <CheckCircle2 size={16} />
                        Active
                      </div>
                    ) : (
                      <button
                        onClick={() => handlePurchase(addon)}
                        disabled={isProcessing || loading}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-bold transition-colors ${
                          canAfford
                            ? "bg-ink text-white hover:bg-ink-paragraph"
                            : "bg-ink-light text-ink-caption cursor-not-allowed"
                        }`}
                      >
                        {isProcessing ? (
                          <span className="animate-pulse">Processing…</span>
                        ) : (
                          <>
                            <ShoppingCart size={14} />
                            {canAfford ? "Buy Now" : "Top Up"}
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  {!canAfford && !isPurchased && (
                    <p className="text-[10px] text-status-error mt-1.5 flex items-center gap-1">
                      <AlertTriangle size={10} />
                      Need {addon.tokens - tokenBalance} more tokens
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirm modal */}
      {confirmAddon && (
        <div className="fixed inset-0 z-[10000000] flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm">
          <div className="bg-surface-card rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-ink">Confirm Purchase</h3>
              <button onClick={() => setConfirmAddon(null)} className="p-1 rounded-lg hover:bg-ink-light transition-colors">
                <X size={18} className="text-ink-caption" />
              </button>
            </div>
            <div className="bg-ink-offwhite rounded-xl p-4 mb-4">
              <p className="font-semibold text-ink text-sm">{confirmAddon.title}</p>
              <div className="flex items-center gap-1 mt-2">
                <Coins size={15} className="text-brand-gold" />
                <span className="font-black text-ink">{confirmAddon.tokens} tokens</span>
                <span className="text-ink-caption text-sm ml-2">→ Balance: {tokenBalance - confirmAddon.tokens}</span>
              </div>
              {confirmAddon.positionEffect && (
                <p className="text-xs text-brand-gold mt-2 flex items-start gap-1">
                  <Star size={11} className="flex-shrink-0 mt-0.5" />
                  {confirmAddon.positionEffect}
                </p>
              )}
            </div>
            <p className="text-xs text-ink-caption mb-5">Our team will contact you within 24 hours to initiate this service.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmAddon(null)} className="flex-1 px-4 py-2 rounded-xl border border-ink-light text-sm font-semibold text-ink-paragraph hover:bg-ink-offwhite transition-colors">
                Cancel
              </button>
              <button onClick={confirmPurchase} className="flex-1 px-4 py-2 rounded-xl bg-brand-yellow text-ink text-sm font-bold hover:bg-brand-gold transition-colors">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Addons;
