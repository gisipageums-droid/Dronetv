import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Check, Zap, TrendingUp, Crown } from "lucide-react";
import { useUserAuth } from "../../context/context";
import { AUTH_API, PAYMENT_API, LAMBDA } from "../../../lib/apiConfig";
import { PageHeader, Card, CardHeader, Btn, Badge, KpiRow, KpiCard } from "../ui";

const PROFILE_API = AUTH_API ? `${AUTH_API}/profile` : `${LAMBDA.profile}/profile`;
// Payment service (not auth) owns this - it deducts real tokens for the
// upgrade before persisting the new package type, see payment service's
// /upgrade-package for why this moved off auth's field-mismatched, non-
// deducting route.
const UPGRADE_API = PAYMENT_API ? `${PAYMENT_API}/upgrade-package` : `${LAMBDA.tokenGateway}/upgrade-package`;

const PACKAGES = [
  {
    id: "reach", name: "Reach", price: 25000, tokens: 500, icon: Zap,
    benefits: ["1 Company Profile listing", "Up to 5 product/service listings", "Lead contact details via token unlock", "500 tokens included", "Social media tag in 2 posts"],
  },
  {
    id: "scale", name: "Expand", price: 75000, tokens: 2000, icon: TrendingUp, popular: true,
    benefits: ["1 Company Profile listing", "Up to 20 product/service listings", "Lead contact details via token unlock", "2,000 tokens included", "1 Video Interview (5 min)", "4 Social media posts", "2 Short Reels", "Featured category placement"],
  },
  {
    id: "brand", name: "Brand", price: 150000, tokens: 8000, icon: Crown,
    benefits: ["1 Company Profile listing", "Unlimited product/service listings", "Full lead contact details — FREE", "8,000 tokens included", "2 Video Interviews", "12 Social media posts", "4 Short Reels", "3 Feature Articles", "6 Press Releases", "Homepage Hero Banner — guaranteed", "Expo branding at DroneTv events"],
  },
];

interface ProfileData {
  tokenBalance?: number;
  packageType?: string;
  packageExpiry?: string;
  publishedCompanies?: number;
}

export default function PackagePage() {
  const { user } = useUserAuth();
  const userId = (user as any)?.userData?.email || (user as any)?.email || "";
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmPkg, setConfirmPkg] = useState<(typeof PACKAGES)[number] | null>(null);
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    axios.get(`${PROFILE_API}?userId=${userId}`)
      .then((r) => setProfile(r.data?.profile ?? null))
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleUpgrade = async () => {
    if (!confirmPkg || !userId) return;
    setUpgrading(true);
    try {
      const res = await axios.post(UPGRADE_API, { userId, packageId: confirmPkg.id });
      if (res.data?.success) {
        setProfile((prev) => ({ ...prev, tokenBalance: res.data.tokenBalance, packageType: res.data.packageType, packageExpiry: res.data.packageExpiry }));
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

  const currentPkg = PACKAGES.find((p) => p.id === profile?.packageType);

  return (
    <div>
      <PageHeader title="My Package" sub="Manage your subscription and token balance" />

      {loading ? (
        <Card className="text-center py-16 text-ink-caption">Loading...</Card>
      ) : (
        <>
          <KpiRow>
            <KpiCard label="Current Plan" value={currentPkg?.name || profile?.packageType || "None"} accent="yellow" />
            <KpiCard label="Token Balance" value={(profile?.tokenBalance ?? 0).toLocaleString("en-IN")} accent="blue" />
            <KpiCard label="Renews / Expires" value={profile?.packageExpiry ? new Date(profile.packageExpiry).toLocaleDateString("en-IN") : "—"} accent="green" />
            <KpiCard label="Published Companies" value={profile?.publishedCompanies ?? 0} accent="red" />
          </KpiRow>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PACKAGES.map((pkg) => {
              const Icon = pkg.icon;
              const isCurrent = pkg.id === profile?.packageType;
              return (
                <Card key={pkg.id} className={`p-5 min-w-0 flex flex-col ${pkg.popular ? "border-brand-yellow border-2" : ""}`}>
                  {pkg.popular && <Badge tone="warning">Most Popular</Badge>}
                  <div className="flex items-center gap-2 mt-2 mb-1">
                    <Icon className="w-5 h-5 text-brand-gold flex-shrink-0" />
                    <h3 className="text-lg font-extrabold text-ink">{pkg.name}</h3>
                  </div>
                  <div className="text-2xl font-extrabold text-ink mb-1">₹{pkg.price.toLocaleString("en-IN")}</div>
                  <div className="text-xs text-ink-caption mb-4">{pkg.tokens.toLocaleString("en-IN")} tokens included</div>
                  <ul className="space-y-2 mb-5 flex-1">
                    {pkg.benefits.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-xs text-ink-paragraph min-w-0">
                        <Check className="w-3.5 h-3.5 text-status-success mt-0.5 flex-shrink-0" />
                        <span className="min-w-0">{b}</span>
                      </li>
                    ))}
                  </ul>
                  <Btn variant={isCurrent ? "outline" : "primary"} disabled={isCurrent} onClick={() => setConfirmPkg(pkg)} className="w-full justify-center">
                    {isCurrent ? "Current Plan" : "Upgrade"}
                  </Btn>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {confirmPkg && (
        <div className="fixed inset-0 z-[10000000] flex items-center justify-center bg-ink/60 p-4">
          <Card className="w-full max-w-sm">
            <CardHeader title={`Upgrade to ${confirmPkg.name}?`} />
            <div className="p-5">
              <p className="text-sm text-ink-paragraph mb-5">
                You'll be charged ₹{confirmPkg.price.toLocaleString("en-IN")} and receive {confirmPkg.tokens.toLocaleString("en-IN")} tokens.
              </p>
              <div className="flex gap-3 justify-end">
                <Btn variant="outline" onClick={() => setConfirmPkg(null)}>Cancel</Btn>
                <Btn onClick={handleUpgrade} disabled={upgrading}>{upgrading ? "Processing..." : "Confirm Upgrade"}</Btn>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
