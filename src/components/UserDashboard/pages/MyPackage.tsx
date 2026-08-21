import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package, CheckCircle, TrendingUp, Coins, Calendar,
  Building2, Video, FileText, Users, Star, Crown,
  ArrowRight, Zap,
} from "lucide-react";
import { useUserAuth } from "../../context/context";
import axios from "axios";
import { toast } from "react-toastify";
import { AUTH_API, PAYMENT_API, LAMBDA } from "../../../lib/apiConfig";
import { authHeader } from "../../../lib/authService";

const PROFILE_API = AUTH_API ? `${AUTH_API}/profile` : `${LAMBDA.profile}/profile`;
// Payment service (not auth) owns this - it deducts real tokens for the
// upgrade before persisting the new package type, see payment service's
// /upgrade-package for why this moved off auth's field-mismatched, non-
// deducting route.
const UPGRADE_API = PAYMENT_API ? `${PAYMENT_API}/upgrade-package` : `${LAMBDA.tokenGateway}/upgrade-package`;
const TOKEN_RATE = 10; // ₹10 = 1 token, must match backend

const PACKAGES = [
  {
    id: "reach",
    name: "Reach",
    price: 25000,
    tokens: 500,
    color: "blue",
    icon: Zap,
    benefits: [
      "1 Company Profile listing",
      "Up to 5 product/service listings",
      "Lead contact details via token unlock",
      "500 tokens included",
      "Social media tag in 2 posts",
    ],
  },
  {
    id: "scale",
    name: "Expand",
    price: 75000,
    tokens: 2000,
    color: "yellow",
    icon: TrendingUp,
    popular: true,
    benefits: [
      "1 Company Profile listing",
      "Up to 20 product/service listings",
      "Lead contact details via token unlock",
      "2,000 tokens included",
      "1 Video Interview (5 min)",
      "4 Social media posts",
      "2 Short Reels",
      "Featured category placement",
    ],
  },
  {
    id: "brand",
    name: "Brand",
    price: 150000,
    tokens: 8000,
    color: "purple",
    icon: Crown,
    benefits: [
      "1 Company Profile listing",
      "Unlimited product/service listings",
      "Full lead contact details — FREE",
      "8,000 tokens included",
      "2 Video Interviews",
      "12 Social media posts",
      "4 Short Reels",
      "3 Feature Articles",
      "6 Press Releases",
      "Homepage Hero Banner — guaranteed",
      "Expo branding at DroneTv events",
    ],
  },
];

const colorMap: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  blue: {
    bg: "bg-status-info/15",
    border: "border-status-info/40",
    text: "text-status-info",
    badge: "bg-status-info/25 text-status-info/40",
  },
  yellow: {
    bg: "bg-brand-yellow/15",
    border: "border-brand-yellow/40",
    text: "text-brand-yellow",
    badge: "bg-brand-yellow/25 text-brand-yellow-soft",
  },
  purple: {
    bg: "bg-brand-gold/15",
    border: "border-brand-gold/40",
    text: "text-brand-gold",
    badge: "bg-brand-gold/25 text-brand-gold/40",
  },
};

interface ProfileData {
  tokenBalance?: number;
  packageType?: string;
  packageExpiry?: string;
  publishedCompanies?: number;
}

const MyPackage: React.FC = () => {
  const { user } = useUserAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmPkg, setConfirmPkg] = useState<(typeof PACKAGES)[number] | null>(null);
  const [upgrading, setUpgrading] = useState(false);

  const userId = user?.userData?.email || user?.email || "";

  useEffect(() => {
    if (!userId) return;
    axios
      .get(`${PROFILE_API}?userId=${userId}`, { headers: authHeader() })
      .then((r) => setProfile(r.data ?? null))
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleUpgrade = async () => {
    if (!confirmPkg || !userId) return;
    setUpgrading(true);
    try {
      const res = await axios.post(UPGRADE_API, { userId, packageId: confirmPkg.id }, { headers: authHeader() });
      if (res.data?.success) {
        setProfile((prev) => ({
          ...prev,
          tokenBalance: res.data.tokenBalance,
          packageType: res.data.packageType,
          packageExpiry: res.data.packageExpiry,
        }));
        toast.success(`Upgraded to ${confirmPkg.name}!`);
        setConfirmPkg(null);
      } else {
        toast.error(res.data?.message || "Upgrade failed");
      }
    } catch (e: any) {
      toast.error(e.response?.data?.detail || e.response?.data?.message || "Upgrade failed. Please try again.");
    } finally {
      setUpgrading(false);
    }
  };

  const currentTier = (profile?.packageType ?? "").toLowerCase();
  const currentPkg = PACKAGES.find((p) => p.id === currentTier) ?? null;
  const colors = currentPkg ? colorMap[currentPkg.color] : colorMap.blue;
  const PkgIcon = currentPkg?.icon ?? Package;

  const formatINR = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const expiryLabel = profile?.packageExpiry
    ? new Date(profile.packageExpiry).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "—";

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[200px]">
        <div className="w-6 h-6 border-2 border-brand-yellow border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Package size={20} className="text-brand-yellow" />
        <h1 className="text-xl font-black text-white">My Package</h1>
      </div>

      {/* Current package card */}
      {currentPkg ? (
        <div className={`rounded-2xl border p-5 mb-6 ${colors.bg} ${colors.border}`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${colors.bg} border ${colors.border}`}>
                <PkgIcon size={20} className={colors.text} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-black ${colors.text}`}>{currentPkg.name} Package</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${colors.badge}`}>Active</span>
                </div>
                <span className="text-xs text-white/50">
                  Renews {expiryLabel} · {formatINR(currentPkg.price)}/year
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Coins size={14} className="text-brand-yellow" />
                <span className="text-sm font-black text-brand-yellow">
                  {(profile?.tokenBalance ?? 0).toLocaleString()} ₮
                </span>
              </div>
              <span className="text-xs text-white/40">tokens available</span>
            </div>
          </div>

          {/* Package benefits */}
          <div className="grid sm:grid-cols-2 gap-1.5">
            {currentPkg.benefits.map((b) => (
              <div key={b} className="flex items-center gap-2">
                <CheckCircle size={13} className="text-status-success flex-shrink-0" />
                <span className="text-xs text-ink-light">{b}</span>
              </div>
            ))}
          </div>

          {/* Renewal & usage */}
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Calendar size={13} className="text-white/40" />
              <span className="text-xs text-white/50">Renewal: {expiryLabel}</span>
            </div>
            <button
              onClick={() => navigate('/user-recharge')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${colors.bg} ${colors.border} ${colors.text} hover:opacity-80`}
            >
              Renew Now
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/15 bg-white/5 p-5 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-white/10 border border-white/15">
              <Package size={20} className="text-white/50" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-white">No Active Package</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white/50">Free</span>
              </div>
              <span className="text-xs text-white/50">
                {(profile?.tokenBalance ?? 0).toLocaleString()} ₮ available · choose a plan below to unlock listings and benefits
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade options */}
      {currentTier !== "brand" && (
        <div>
          <h2 className="text-sm font-bold text-white/70 mb-3 uppercase tracking-wider">
            {currentPkg ? "Upgrade Your Plan" : "Choose a Plan"}
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {PACKAGES.filter((p) => {
              if (!currentPkg) return true;
              const order = ["reach", "scale", "brand"];
              return order.indexOf(p.id) > order.indexOf(currentTier);
            }).map((pkg) => {
              const c = colorMap[pkg.color];
              const Icon = pkg.icon;
              return (
                <div
                  key={pkg.id}
                  className={`rounded-xl border p-4 relative ${c.bg} ${c.border}`}
                >
                  {pkg.popular && (
                    <span className="absolute -top-2.5 left-4 text-[10px] font-black bg-brand-yellow text-ink px-2 py-0.5 rounded-full">
                      Most Popular
                    </span>
                  )}
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={16} className={c.text} />
                    <span className={`text-sm font-black ${c.text}`}>{pkg.name}</span>
                    <span className="text-xs font-bold text-white/40 ml-auto">{formatINR(pkg.price)}/yr</span>
                  </div>
                  <p className="text-xs text-ink-light mb-3">
                    {pkg.tokens.toLocaleString()} tokens + {pkg.benefits.length} benefits included
                  </p>
                  <div className="space-y-1 mb-4">
                    {pkg.benefits.slice(0, 4).map((b) => (
                      <div key={b} className="flex items-center gap-1.5">
                        <CheckCircle size={11} className="text-status-success flex-shrink-0" />
                        <span className="text-xs text-ink-light">{b}</span>
                      </div>
                    ))}
                    {pkg.benefits.length > 4 && (
                      <span className="text-xs text-ink-caption">+{pkg.benefits.length - 4} more benefits</span>
                    )}
                  </div>
                  <button
                    onClick={() => setConfirmPkg(pkg)}
                    className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-black transition-colors border ${c.bg} ${c.border} ${c.text} hover:opacity-80`}
                  >
                    {currentPkg ? `Upgrade to ${pkg.name}` : `Get ${pkg.name}`}
                    <ArrowRight size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Active Listings", value: profile?.publishedCompanies ?? 0, icon: Building2 },
          { label: "Token Balance", value: `${(profile?.tokenBalance ?? 0).toLocaleString()} ₮`, icon: Coins },
          { label: "Package Tier", value: currentPkg?.name ?? "Free", icon: Star },
          { label: "Renews", value: currentPkg ? expiryLabel.split(" ").slice(-2).join(" ") : "—", icon: Calendar },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-xl bg-white/8 border border-white/15 p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Icon size={13} className="text-white/50" />
                <span className="text-[10px] text-white/50 uppercase tracking-wider">{stat.label}</span>
              </div>
              <div className="text-sm font-black text-white">{stat.value}</div>
            </div>
          );
        })}
      </div>

      {/* Upgrade confirmation modal */}
      {confirmPkg && (() => {
        const c = colorMap[confirmPkg.color];
        const tokenCost = Math.round(confirmPkg.price / TOKEN_RATE);
        const balance = profile?.tokenBalance ?? 0;
        const insufficient = balance < tokenCost;
        return (
          <div className="fixed inset-0 z-[10000000] flex items-center justify-center bg-ink/60 p-4" onClick={() => !upgrading && setConfirmPkg(null)}>
            <div className={`bg-ink border rounded-2xl p-6 max-w-md w-full ${c.border}`} onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-black text-white mb-1">Upgrade to {confirmPkg.name}</h3>
              <p className="text-xs text-white/50 mb-4">{formatINR(confirmPkg.price)}/year · {confirmPkg.tokens.toLocaleString()} tokens included</p>

              <div className="space-y-1.5 mb-4">
                {confirmPkg.benefits.map((b) => (
                  <div key={b} className="flex items-center gap-2">
                    <CheckCircle size={13} className="text-status-success flex-shrink-0" />
                    <span className="text-xs text-ink-light">{b}</span>
                  </div>
                ))}
              </div>

              <div className="rounded-xl bg-white/5 border border-white/10 p-3 mb-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-white/60">Cost</span>
                  <span className="font-black text-brand-yellow">{tokenCost.toLocaleString()} ₮</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Your balance</span>
                  <span className={`font-black ${insufficient ? "text-status-error" : "text-white"}`}>{balance.toLocaleString()} ₮</span>
                </div>
              </div>

              {insufficient && (
                <p className="text-xs text-status-error mb-4">
                  Not enough tokens for this upgrade. You need {(tokenCost - balance).toLocaleString()} more.
                </p>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmPkg(null)}
                  disabled={upgrading}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white/70 border border-white/15 hover:bg-white/5 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpgrade}
                  disabled={upgrading || insufficient}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${c.bg} ${c.border} border ${c.text} hover:opacity-80`}
                >
                  {upgrading ? "Upgrading..." : `Confirm — Deduct ${tokenCost.toLocaleString()} ₮`}
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default MyPackage;
