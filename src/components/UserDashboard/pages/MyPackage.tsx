import React, { useState, useEffect } from "react";
import {
  Package, CheckCircle, TrendingUp, Coins, Calendar,
  Building2, Video, FileText, Users, Star, Crown,
  ArrowRight, Zap,
} from "lucide-react";
import { useUserAuth } from "../../context/context";
import axios from "axios";
import { AUTH_API, LAMBDA } from "../../../lib/apiConfig";

const PROFILE_API = AUTH_API ? `${AUTH_API}/profile` : `${LAMBDA.profile}/profile`;

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
    name: "Scale",
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
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    text: "text-blue-400",
    badge: "bg-blue-500/20 text-blue-300",
  },
  yellow: {
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/30",
    text: "text-yellow-400",
    badge: "bg-yellow-400/20 text-yellow-300",
  },
  purple: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    text: "text-purple-400",
    badge: "bg-purple-500/20 text-purple-300",
  },
};

interface ProfileData {
  tokenBalance?: number;
  packageType?: string;
  packageExpiry?: string;
  listingCount?: number;
}

const MyPackage: React.FC = () => {
  const { user } = useUserAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  const userId = user?.userData?.email || user?.email || "";

  useEffect(() => {
    if (!userId) return;
    axios
      .get(`${PROFILE_API}?userId=${userId}`)
      .then((r) => setProfile(r.data?.profile ?? null))
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, [userId]);

  const currentTier = (profile?.packageType ?? "reach").toLowerCase();
  const currentPkg = PACKAGES.find((p) => p.id === currentTier) ?? PACKAGES[0];
  const colors = colorMap[currentPkg.color];
  const PkgIcon = currentPkg.icon;

  const formatINR = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const expiryLabel = profile?.packageExpiry
    ? new Date(profile.packageExpiry).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "Dec 2026";

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[200px]">
        <div className="w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Package size={20} className="text-yellow-400" />
        <h1 className="text-xl font-black text-white">My Package</h1>
      </div>

      {/* Current package card */}
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
              <Coins size={14} className="text-yellow-400" />
              <span className="text-sm font-black text-yellow-400">
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
              <CheckCircle size={13} className="text-green-400 flex-shrink-0" />
              <span className="text-xs text-white/70">{b}</span>
            </div>
          ))}
        </div>

        {/* Renewal & usage */}
        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Calendar size={13} className="text-white/40" />
            <span className="text-xs text-white/50">Renewal: {expiryLabel}</span>
          </div>
          <button className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${colors.bg} ${colors.border} ${colors.text} hover:opacity-80`}>
            Renew Now
          </button>
        </div>
      </div>

      {/* Upgrade options */}
      {currentTier !== "brand" && (
        <div>
          <h2 className="text-sm font-bold text-white/70 mb-3 uppercase tracking-wider">Upgrade Your Plan</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {PACKAGES.filter((p) => {
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
                    <span className="absolute -top-2.5 left-4 text-[10px] font-black bg-yellow-400 text-black px-2 py-0.5 rounded-full">
                      Most Popular
                    </span>
                  )}
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={16} className={c.text} />
                    <span className={`text-sm font-black ${c.text}`}>{pkg.name}</span>
                    <span className="text-xs font-bold text-white/40 ml-auto">{formatINR(pkg.price)}/yr</span>
                  </div>
                  <p className="text-xs text-white/50 mb-3">
                    {pkg.tokens.toLocaleString()} tokens + {pkg.benefits.length} benefits included
                  </p>
                  <div className="space-y-1 mb-4">
                    {pkg.benefits.slice(0, 4).map((b) => (
                      <div key={b} className="flex items-center gap-1.5">
                        <CheckCircle size={11} className="text-green-400 flex-shrink-0" />
                        <span className="text-xs text-white/60">{b}</span>
                      </div>
                    ))}
                    {pkg.benefits.length > 4 && (
                      <span className="text-xs text-white/30">+{pkg.benefits.length - 4} more benefits</span>
                    )}
                  </div>
                  <button
                    className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-black transition-colors border ${c.bg} ${c.border} ${c.text} hover:opacity-80`}
                  >
                    Upgrade to {pkg.name}
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
          { label: "Active Listings", value: profile?.listingCount ?? 0, icon: Building2 },
          { label: "Token Balance", value: `${(profile?.tokenBalance ?? 0).toLocaleString()} ₮`, icon: Coins },
          { label: "Package Tier", value: currentPkg.name, icon: Star },
          { label: "Renews", value: expiryLabel.split(" ").slice(-2).join(" "), icon: Calendar },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-xl bg-white/3 border border-white/10 p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Icon size={13} className="text-white/30" />
                <span className="text-[10px] text-white/30 uppercase tracking-wider">{stat.label}</span>
              </div>
              <div className="text-sm font-black text-white">{stat.value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyPackage;
