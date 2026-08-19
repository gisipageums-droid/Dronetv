import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import { useUserAuth } from "../../context/context";
import axios from 'axios';
import { toast } from 'react-toastify';
import { PAYMENT_API, LAMBDA, AUTH_API } from '../../../lib/apiConfig';
import {
  Coins, Zap, TrendingUp, Crown, CheckCircle, ArrowRight,
  Wallet, Target, Layout, FileText, ShoppingBag,
} from 'lucide-react';

const PROFILE_API = AUTH_API ? `${AUTH_API}/profile` : `${LAMBDA.profile}/profile`;
// Payment service (not auth) owns this - it deducts real tokens for the
// upgrade before persisting the new package type, see payment service's
// /upgrade-package for why this moved off auth's field-mismatched, non-
// deducting route.
const UPGRADE_API = PAYMENT_API ? `${PAYMENT_API}/upgrade-package` : `${LAMBDA.tokenGateway}/upgrade-package`;
const TOKEN_RATE = 10; // ₹10 = 1 token, must match backend

interface Plan {
  features: string[];
  price: number;
  name: string;
  discount: number;
  tokens: number;
  id: string;
  type: string;
}

// Token usage guide shown on wallet page
const TOKEN_USES = [
  { icon: Target,      label: 'Keyword Bidding',  desc: 'Bid on search keywords to appear at the top of results',       cost: 'from 50 ₮' },
  { icon: Layout,      label: 'Page Placements',  desc: 'Book homepage (HP-1 to HP-5) and category page slots',         cost: 'from 200 ₮' },
  { icon: FileText,    label: 'Unlock Leads',     desc: 'View full contact info of buyers who enquired about you',       cost: '10–50 ₮ per lead' },
  { icon: ShoppingBag, label: 'Boost Listing',    desc: 'Push your company to the top of the company directory',        cost: '100 ₮ per week' },
];

const SUBSCRIPTION_PLANS = [
  {
    id: 'reach', name: 'Reach', price: 25000, tokens: 500, color: 'blue',
    icon: Zap, popular: false,
    features: ['1 Company Profile', 'Up to 5 listings', 'Lead unlocks via tokens', '500 tokens included', '2 social media tags'],
  },
  {
    id: 'scale', name: 'Expand', price: 75000, tokens: 2000, color: 'yellow',
    icon: TrendingUp, popular: true,
    features: ['1 Company Profile', 'Up to 20 listings', 'Lead unlocks via tokens', '2,000 tokens included', '1 Video Interview', '4 social posts', '2 Reels', 'Featured category placement'],
  },
  {
    id: 'brand', name: 'Brand', price: 150000, tokens: 8000, color: 'purple',
    icon: Crown, popular: false,
    features: ['1 Company Profile', 'Unlimited listings', 'All leads FREE (no tokens)', '8,000 tokens included', '2 Video Interviews', '12 social posts', '4 Reels', '3 Feature Articles', '6 Press Releases', 'Homepage Hero Banner', 'Expo branding'],
  },
];

const colorMap: Record<string, { bg: string; border: string; text: string; badge: string; btn: string }> = {
  blue:   { bg: 'bg-status-info/10',   border: 'border-status-info/30',   text: 'text-status-info',   badge: 'bg-status-info/20 text-status-info/40',   btn: 'bg-status-info hover:bg-status-info text-white' },
  yellow: { bg: 'bg-brand-yellow/10', border: 'border-brand-yellow/30', text: 'text-brand-yellow', badge: 'bg-brand-yellow/20 text-brand-yellow-soft', btn: 'bg-brand-yellow hover:bg-brand-yellow-soft text-ink' },
  purple: { bg: 'bg-brand-gold/10', border: 'border-brand-gold/30', text: 'text-brand-gold', badge: 'bg-brand-gold/20 text-brand-gold/40', btn: 'bg-brand-gold hover:bg-brand-gold text-white' },
};

const RechargePlans: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [packageType, setPackageType] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'subscription' | 'topup'>('subscription');
  const [confirmPkg, setConfirmPkg] = useState<(typeof SUBSCRIPTION_PLANS)[number] | null>(null);
  const [upgrading, setUpgrading] = useState(false);

  const navigate = useNavigate();
  const { user } = useUserAuth();
  const { Razorpay } = useRazorpay();
  const userId = user?.userData?.email || user?.email || '';

  const filters = ['All', 'One-Time', 'Monthly', 'Quarterly', 'Yearly'];

  useEffect(() => {
    if (userId) {
      axios.get(`${PROFILE_API}?userId=${userId}`)
        .then(r => {
          setPackageType((r.data?.profile?.packageType ?? '').toLowerCase());
        })
        .catch(() => {});
      if (PAYMENT_API) {
        axios.get(`${PAYMENT_API}/wallet?userId=${userId}`)
          .then(r => setTokenBalance(r.data?.tokenBalance ?? 0))
          .catch(() => {});
      } else {
        axios.get(`${PROFILE_API}?userId=${userId}`)
          .then(r => setTokenBalance(r.data?.profile?.tokenBalance ?? 0))
          .catch(() => {});
      }
    }
  }, [userId]);

  useEffect(() => {
    axios.get(PAYMENT_API ? `${PAYMENT_API}/plans` : `${LAMBDA.plans}/dev`)
      .then(r => {
        if (r.data?.data?.plans) setPlans(r.data.data.plans);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSelectPlan = async (plan: Plan) => {
    if (!user) { toast.error('Please login to purchase'); navigate('/login'); return; }
    setProcessingPlanId(plan.id);
    try {
      const orderData = PAYMENT_API
        ? {
            userId: user?.userData?.userId || userId,
            planId: plan.id,
            currency: 'INR',
            email: user?.userData?.email || '',
            name: user?.userData?.fullName || '',
            phone: user?.userData?.phone || '',
          }
        : {
            userId: user?.userData?.userId || userId,
            amount: plan.price,
            tokenCount: plan.tokens,
            currency: 'INR',
            email: user?.userData?.email || '',
            name: user?.userData?.fullName || '',
            phone: user?.userData?.phone || '',
            notes: { planId: plan.id, planName: plan.name, period: plan.type },
          };
      const placeRes = await axios.post(PAYMENT_API ? `${PAYMENT_API}/place-order` : `${LAMBDA.tokenGateway}/place-order`, orderData);
      if (!placeRes.data.success) throw new Error(placeRes.data.message || 'Failed to create order');
      const { transactionId, razorpayOrderId, key, order } = placeRes.data.data;

      const options: RazorpayOrderOptions = {
        key: key || import.meta.env.VITE_RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency,
        name: 'DroneTv.in',
        description: `${plan.name} — ${plan.tokens} Tokens`,
        image: 'https://www.dronetv.in/images/Drone%20tv%20.in.png',
        order_id: razorpayOrderId,
        handler: async (response) => {
          const confirmRes = await axios.post(
            PAYMENT_API ? `${PAYMENT_API}/confirm-order` : `${LAMBDA.tokenGateway}/confirm-order`,
            { payment_id: response.razorpay_payment_id, order_id: response.razorpay_order_id, signature: response.razorpay_signature, transactionId }
          );
          if (confirmRes.data.success) {
            toast.success(`${plan.tokens} tokens added!`);
            setTokenBalance(prev => prev + plan.tokens);
          } else {
            toast.error(confirmRes.data.message || 'Payment verification failed');
          }
        },
        prefill: { name: user?.userData?.fullName || '', email: user?.userData?.email || '', contact: user?.userData?.phone || '' },
        theme: { color: '#F8C400' },
        modal: { ondismiss: () => setProcessingPlanId(null) },
      };
      new Razorpay(options).open();
    } catch (e: any) {
      toast.error(e.message || 'Failed to initiate payment');
    } finally {
      setProcessingPlanId(null);
    }
  };

  const handleUpgrade = async () => {
    if (!confirmPkg || !userId) return;
    setUpgrading(true);
    try {
      const res = await axios.post(UPGRADE_API, { userId, packageId: confirmPkg.id });
      if (res.data?.success) {
        setTokenBalance(res.data.tokenBalance);
        setPackageType((res.data.packageType ?? confirmPkg.id).toLowerCase());
        toast.success(`Upgraded to ${confirmPkg.name}!`);
        setConfirmPkg(null);
      } else {
        toast.error(res.data?.message || 'Upgrade failed');
      }
    } catch (e: any) {
      toast.error(e.response?.data?.detail || e.response?.data?.message || 'Upgrade failed. Please try again.');
    } finally {
      setUpgrading(false);
    }
  };

  const filteredPlans = plans.filter(p => selectedFilter === 'All' || p.type.toLowerCase() === selectedFilter.toLowerCase());

  return (
    <div className="min-h-screen bg-ink p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header + Balance */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Wallet size={22} className="text-brand-yellow" />
              Token Wallet
            </h1>
            <p className="text-sm text-white/40 mt-0.5">Choose a subscription plan or top-up anytime</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-brand-yellow/10 border border-brand-yellow/20 rounded-xl px-4 py-3 text-center min-w-[120px]">
              <div className="text-[10px] text-white/40 uppercase tracking-widest mb-0.5">Balance</div>
              <div className="text-xl font-black text-brand-yellow">{tokenBalance.toLocaleString()} ₮</div>
            </div>
            <button
              onClick={() => navigate('/user-bid-keywords')}
              className="flex items-center gap-1.5 px-4 py-2 bg-brand-yellow/10 border border-brand-yellow/20 rounded-xl text-brand-yellow text-xs font-bold hover:bg-brand-yellow/20 transition-colors"
            >
              <Target size={13} />
              Bid Keywords
            </button>
          </div>
        </div>

        {/* What tokens unlock */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {TOKEN_USES.map(u => {
            const Icon = u.icon;
            return (
              <div key={u.label} className="bg-ink border border-white/8 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Icon size={13} className="text-brand-yellow" />
                  <span className="text-xs font-bold text-white">{u.label}</span>
                </div>
                <p className="text-[10px] text-white/40 leading-relaxed mb-1.5">{u.desc}</p>
                <span className="text-[10px] font-black text-brand-yellow">{u.cost}</span>
              </div>
            );
          })}
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 bg-ink border border-white/8 rounded-xl p-1 mb-6 w-fit">
          {[
            { key: 'subscription', label: 'Annual Plans' },
            { key: 'topup', label: 'Top-up Packs' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key as any)}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === t.key
                  ? 'bg-brand-yellow text-ink'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* SUBSCRIPTION PLANS */}
        {activeTab === 'subscription' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {SUBSCRIPTION_PLANS.map(pkg => {
              const c = colorMap[pkg.color];
              const Icon = pkg.icon;
              const isCurrent = pkg.id === packageType;
              return (
                <div
                  key={pkg.id}
                  className={`relative rounded-2xl border p-5 flex flex-col ${c.bg} ${isCurrent ? 'border-status-success/60' : c.border}`}
                >
                  {isCurrent ? (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-black bg-status-success text-ink px-3 py-1 rounded-full whitespace-nowrap">
                      Current Plan
                    </span>
                  ) : pkg.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-black bg-brand-yellow text-ink px-3 py-1 rounded-full whitespace-nowrap">
                      Most Popular
                    </span>
                  )}
                  <div className="flex items-center gap-3 mb-4 mt-2">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.bg} border ${c.border}`}>
                      <Icon size={18} className={c.text} />
                    </div>
                    <div>
                      <div className={`text-lg font-black ${c.text}`}>{pkg.name}</div>
                      <div className="text-xs text-white/40">
                        ₹{(pkg.price / 1000).toFixed(0)}K/year · {pkg.tokens.toLocaleString()} tokens
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 space-y-1.5 mb-5">
                    {pkg.features.map(f => (
                      <div key={f} className="flex items-start gap-1.5">
                        <CheckCircle size={12} className="text-status-success flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-white/70">{f}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setConfirmPkg(pkg)}
                    disabled={isCurrent}
                    className={`w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-black transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                      isCurrent ? 'bg-status-success/20 border border-status-success/40 text-status-success/40' : c.btn
                    }`}
                  >
                    {isCurrent ? (
                      <><CheckCircle size={14} /> Current Plan</>
                    ) : (
                      <>Get {pkg.name} <ArrowRight size={14} /></>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* TOP-UP PACKS from API */}
        {activeTab === 'topup' && (
          <>
            <div className="flex flex-wrap gap-2 mb-5">
              {filters.map(f => (
                <button
                  key={f}
                  onClick={() => setSelectedFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                    selectedFilter === f
                      ? 'bg-brand-yellow text-ink border-brand-yellow'
                      : 'bg-ink text-white/50 border-white/10 hover:border-brand-yellow/30 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-brand-yellow border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredPlans.length === 0 ? (
              <div className="text-center py-16 text-white/30 text-sm">No plans available for this filter</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPlans.map(plan => (
                  <div
                    key={plan.id}
                    className={`relative bg-ink rounded-2xl border overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-yellow/10 ${
                      plan.discount > 0 ? 'border-brand-yellow/40' : 'border-white/8'
                    }`}
                  >
                    {plan.discount > 0 && (
                      <div className="absolute top-3 right-3 bg-brand-yellow text-ink text-[10px] font-black px-2 py-0.5 rounded-full">
                        {plan.discount}% OFF
                      </div>
                    )}
                    <div className="p-5">
                      <div className="text-center mb-4">
                        <h2 className="text-base font-black text-white mb-1">{plan.name}</h2>
                        <div className="text-3xl font-black text-brand-yellow">₹{plan.price}</div>
                        <div className="text-xs text-white/40 mt-0.5 uppercase tracking-wider">{plan.type}</div>
                        <div className="inline-flex items-center gap-1 mt-2 bg-brand-yellow/10 border border-brand-yellow/20 px-3 py-1 rounded-full">
                          <Coins size={11} className="text-brand-yellow" />
                          <span className="text-xs font-black text-brand-yellow">{plan.tokens} Tokens</span>
                        </div>
                      </div>
                      <div className="space-y-1.5 mb-5">
                        {plan.features.map((f, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <CheckCircle size={12} className="text-status-success flex-shrink-0 mt-0.5" />
                            <span className="text-xs text-white/60">{f}</span>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => handleSelectPlan(plan)}
                        disabled={processingPlanId === plan.id}
                        className={`w-full py-2.5 font-black rounded-xl text-sm transition-all flex items-center justify-center gap-2 ${
                          plan.discount > 0
                            ? 'bg-brand-yellow text-ink hover:bg-brand-yellow-soft'
                            : 'bg-white/10 text-white hover:bg-white/15'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {processingPlanId === plan.id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>Buy Plan</>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Custom top-up CTA */}
            <div className="mt-6 bg-ink border border-brand-yellow/20 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-sm font-bold text-white mb-0.5">Need a custom amount?</div>
                <p className="text-xs text-white/40">Buy any amount at ₹10 = 1 token. No minimum order.</p>
              </div>
              <button
                onClick={() => navigate('/user-buy')}
                className="flex items-center gap-2 px-5 py-2.5 bg-brand-yellow text-ink rounded-xl font-black text-sm hover:bg-brand-yellow-soft transition-colors whitespace-nowrap"
              >
                <Coins size={15} />
                Custom Buy
              </button>
            </div>
          </>
        )}
      </div>

      {/* Upgrade confirmation modal (token deduction, no Razorpay) */}
      {confirmPkg && (() => {
        const c = colorMap[confirmPkg.color];
        const tokenCost = Math.round(confirmPkg.price / TOKEN_RATE);
        const insufficient = tokenBalance < tokenCost;
        return (
          <div className="fixed inset-0 z-[10000000] flex items-center justify-center bg-ink/60 p-4" onClick={() => !upgrading && setConfirmPkg(null)}>
            <div className={`bg-ink border rounded-2xl p-6 max-w-md w-full ${c.border}`} onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-black text-white mb-1">Upgrade to {confirmPkg.name}</h3>
              <p className="text-xs text-white/50 mb-4">
                ₹{(confirmPkg.price / 1000).toFixed(0)}K/year · {confirmPkg.tokens.toLocaleString()} tokens included
              </p>

              <div className="space-y-1.5 mb-4">
                {confirmPkg.features.map((f) => (
                  <div key={f} className="flex items-center gap-2">
                    <CheckCircle size={13} className="text-status-success flex-shrink-0" />
                    <span className="text-xs text-ink-light">{f}</span>
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
                  <span className={`font-black ${insufficient ? 'text-status-error' : 'text-white'}`}>{tokenBalance.toLocaleString()} ₮</span>
                </div>
              </div>

              {insufficient && (
                <p className="text-xs text-status-error mb-4">
                  Not enough tokens for this upgrade. You need {(tokenCost - tokenBalance).toLocaleString()} more — top up first.
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
                {insufficient ? (
                  <button
                    onClick={() => { setConfirmPkg(null); setActiveTab('topup'); }}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-black transition-colors border ${c.bg} ${c.border} ${c.text} hover:opacity-80`}
                  >
                    Top Up Tokens
                  </button>
                ) : (
                  <button
                    onClick={handleUpgrade}
                    disabled={upgrading}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed border ${c.bg} ${c.border} ${c.text} hover:opacity-80`}
                  >
                    {upgrading ? 'Upgrading...' : `Confirm — Deduct ${tokenCost.toLocaleString()} ₮`}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default RechargePlans;
