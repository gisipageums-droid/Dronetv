import React, { useState, useEffect } from 'react';
import { Coins, Zap, Target, Layout, FileText, CheckCircle, ArrowRight, Info } from 'lucide-react';
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import { useUserAuth } from "../../context/context";
import axios from 'axios';
import { PAYMENT_API, LAMBDA, AUTH_API } from '../../../lib/apiConfig';

const PROFILE_API = AUTH_API ? `${AUTH_API}/profile` : `${LAMBDA.profile}/profile`;

const TOKEN_RATE = 10; // ₹10 = 1 token

const PRESETS = [
  { amount: 50,   label: '₹50',   tokens: 5,    tag: '' },
  { amount: 100,  label: '₹100',  tokens: 10,   tag: '' },
  { amount: 500,  label: '₹500',  tokens: 50,   tag: 'Min Bid' },
  { amount: 1000, label: '₹1,000',tokens: 100,  tag: 'Popular' },
  { amount: 2000, label: '₹2,000',tokens: 200,  tag: '' },
  { amount: 5000, label: '₹5,000',tokens: 500,  tag: 'Best Value' },
];

const TOKEN_USES = [
  { icon: Target, label: 'Keyword Bids', desc: 'Win sponsored spots when buyers search drone keywords', tokens: '50–500 ₮/week' },
  { icon: Layout, label: 'Page Placements', desc: 'Book premium homepage and category page slots', tokens: '200–2,000 ₮' },
  { icon: FileText, label: 'Unlock Leads', desc: 'View full contact details of buyers who enquired', tokens: '10–50 ₮/lead' },
  { icon: Zap, label: 'Boost Profile', desc: 'Push your company to top of directory listings', tokens: '100 ₮/week' },
];

const BuyTokenPage: React.FC = () => {
  const { Razorpay } = useRazorpay();
  const { user } = useUserAuth();

  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentBalance, setCurrentBalance] = useState<number>(0);

  const userId = user?.userData?.email || user?.email || '';

  useEffect(() => {
    if (!userId) return;
    axios.get(`${PROFILE_API}?userId=${userId}`)
      .then(r => setCurrentBalance(r.data?.profile?.tokenBalance ?? 0))
      .catch(() => {});
  }, [userId]);

  useEffect(() => {
    if (showSuccess) {
      const t = setTimeout(() => setShowSuccess(false), 4000);
      return () => clearTimeout(t);
    }
  }, [showSuccess]);

  useEffect(() => {
    if (errorMessage) {
      const t = setTimeout(() => setErrorMessage(''), 5000);
      return () => clearTimeout(t);
    }
  }, [errorMessage]);

  const finalAmount = selectedPreset !== null
    ? selectedPreset
    : parseFloat(customAmount) || 0;

  const tokens = Math.floor(finalAmount / TOKEN_RATE);
  const isValid = finalAmount >= 10;

  const placeOrder = (orderData: any) =>
    axios.post(PAYMENT_API ? `${PAYMENT_API}/place-order` : `${LAMBDA.tokenGateway}/place-order`, orderData)
      .then(r => r.data)
      .catch(e => { throw new Error(e.response?.data?.message || 'Failed to place order'); });

  const failOrder = (transactionId: string, reason: string, errorCode = '', status: 'FAILED' | 'CANCELLED' = 'FAILED') =>
    axios.post(PAYMENT_API ? `${PAYMENT_API}/fail-order` : `${LAMBDA.tokenGateway}/fail-order`,
      { transactionId, reason, errorCode, status })
      .then(r => r.data)
      .catch(() => null);

  const confirmOrder = (paymentData: any) =>
    axios.post(PAYMENT_API ? `${PAYMENT_API}/confirm-order` : `${LAMBDA.tokenGateway}/confirm-order`, paymentData)
      .then(r => r.data)
      .catch(e => { throw new Error(e.response?.data?.message || 'Failed to confirm order'); });

  const handlePayNow = async () => {
    if (!isValid) return;
    setIsProcessing(true);
    setErrorMessage('');

    try {
      const orderData = {
        userId: user?.userData?.userId || userId,
        amount: finalAmount,
        tokenCount: tokens,
        currency: 'INR',
        email: user?.userData?.email || '',
        name: user?.userData?.fullName || '',
        phone: user?.userData?.phone || '',
      };

      const placeRes = await placeOrder(orderData);
      if (!placeRes.success) throw new Error(placeRes.message || 'Failed to create order');

      const { transactionId, razorpayOrderId, key, order } = placeRes.data;
      let paymentHandled = false;

      const options: RazorpayOrderOptions = {
        key: key,
        amount: order.amount,
        currency: order.currency,
        name: 'DroneTv.in',
        description: `${tokens} Tokens`,
        image: 'https://www.dronetv.in/images/Drone%20tv%20.in.png',
        order_id: razorpayOrderId,
        handler: async (response) => {
          paymentHandled = true;
          const confirmRes = await confirmOrder({
            payment_id: response.razorpay_payment_id,
            order_id: response.razorpay_order_id,
            signature: response.razorpay_signature,
            transactionId,
          });
          if (confirmRes.success) {
            setShowSuccess(true);
            setCurrentBalance(prev => prev + tokens);
            setSelectedPreset(null);
            setCustomAmount('');
          } else {
            setErrorMessage(confirmRes.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: user?.userData?.fullName || '',
          email: user?.userData?.email || '',
          contact: user?.userData?.phone || '9999999999',
        },
        theme: { color: '#F59E0B' },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            if (!paymentHandled) failOrder(transactionId, 'Payment cancelled by user', '', 'CANCELLED');
          },
        },
      };

      const rp = new Razorpay(options);
      rp.on('payment.failed', (r: any) => {
        paymentHandled = true;
        const reason = r?.error?.description || 'Payment failed';
        setErrorMessage(`Payment failed: ${reason}`);
        setIsProcessing(false);
        failOrder(transactionId, reason, r?.error?.code || '', 'FAILED');
      });
      rp.open();
    } catch (e: any) {
      setErrorMessage(e.message || 'Failed to initiate payment');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Coins size={22} className="text-yellow-400" />
              Buy Tokens
            </h1>
            <p className="text-sm text-white/40 mt-0.5">₹10 = 1 token · No expiry · Instant credit</p>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-white/40 uppercase tracking-widest mb-0.5">Current Balance</div>
            <div className="text-xl font-black text-yellow-400">{currentBalance.toLocaleString()} ₮</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT — Preset + Custom + Pay */}
          <div className="lg:col-span-2 space-y-4">

            {/* Preset amounts */}
            <div className="bg-gray-900 border border-white/8 rounded-xl p-5">
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4">Select Amount</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                {PRESETS.map(p => (
                  <button
                    key={p.amount}
                    onClick={() => { setSelectedPreset(p.amount); setCustomAmount(''); }}
                    className={`relative rounded-xl border p-3 text-left transition-all ${
                      selectedPreset === p.amount
                        ? 'border-yellow-400 bg-yellow-400/10'
                        : 'border-white/10 bg-gray-800 hover:border-yellow-400/30'
                    }`}
                  >
                    {p.tag && (
                      <span className="absolute -top-2 left-2 text-[9px] font-black bg-yellow-400 text-black px-1.5 py-0.5 rounded-full">
                        {p.tag}
                      </span>
                    )}
                    <div className={`text-base font-black ${selectedPreset === p.amount ? 'text-yellow-400' : 'text-white'}`}>
                      {p.label}
                    </div>
                    <div className="text-xs text-white/50 mt-0.5">{p.tokens} tokens</div>
                  </button>
                ))}
              </div>

              {/* Custom amount */}
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Or enter custom amount</div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 font-bold">₹</span>
                <input
                  type="number"
                  min="10"
                  step="10"
                  value={customAmount}
                  onChange={e => { setCustomAmount(e.target.value); setSelectedPreset(null); }}
                  placeholder="Min ₹10"
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-yellow-400/50 text-sm"
                />
              </div>

              {/* Preview */}
              {finalAmount > 0 && (
                <div className={`mt-3 flex items-center justify-between rounded-lg px-4 py-3 ${
                  isValid ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'
                }`}>
                  {isValid ? (
                    <>
                      <span className="text-sm text-white/70">You get</span>
                      <span className="text-lg font-black text-yellow-400">{tokens} tokens</span>
                      <span className="text-sm text-green-400 font-bold">₹{finalAmount.toLocaleString()}</span>
                    </>
                  ) : (
                    <span className="text-sm text-red-400">Minimum purchase is ₹10 (1 token)</span>
                  )}
                </div>
              )}
            </div>

            {/* Error */}
            {errorMessage && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
                {errorMessage}
              </div>
            )}

            {/* Pay button */}
            <button
              onClick={handlePayNow}
              disabled={!isValid || isProcessing}
              className="w-full py-4 rounded-xl font-black text-base transition-all bg-yellow-400 text-black hover:bg-yellow-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Coins size={18} />
                  Pay ₹{finalAmount > 0 ? finalAmount.toLocaleString() : '—'} → Get {tokens > 0 ? tokens : '—'} Tokens
                </>
              )}
            </button>

            <p className="text-center text-xs text-white/30">Secured by Razorpay · UPI / Card / Net Banking accepted</p>
          </div>

          {/* RIGHT — How tokens work */}
          <div className="space-y-4">
            {/* Conversion table */}
            <div className="bg-gray-900 border border-yellow-400/20 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-white/8">
                <div className="flex items-center gap-2">
                  <Info size={13} className="text-yellow-400" />
                  <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider">Token Rate</span>
                </div>
              </div>
              <div className="divide-y divide-white/5">
                {[
                  { inr: '₹100', tokens: '10 ₮' },
                  { inr: '₹500', tokens: '50 ₮' },
                  { inr: '₹1,000', tokens: '100 ₮' },
                  { inr: '₹5,000', tokens: '500 ₮' },
                  { inr: '₹10,000', tokens: '1,000 ₮' },
                ].map(r => (
                  <div key={r.inr} className="flex items-center justify-between px-4 py-2.5">
                    <span className="text-sm font-semibold text-white">{r.inr}</span>
                    <ArrowRight size={12} className="text-white/20" />
                    <span className="text-sm font-black text-yellow-400">{r.tokens}</span>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 bg-yellow-400/5 text-[11px] text-white/40 text-center">
                ₹10 = 1 token · No expiry · Instant credit
              </div>
            </div>

            {/* How to use */}
            <div className="bg-gray-900 border border-white/8 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-white/8">
                <span className="text-xs font-bold text-white/50 uppercase tracking-wider">What tokens unlock</span>
              </div>
              <div className="divide-y divide-white/5">
                {TOKEN_USES.map(u => {
                  const Icon = u.icon;
                  return (
                    <div key={u.label} className="px-4 py-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon size={13} className="text-yellow-400 flex-shrink-0" />
                        <span className="text-xs font-bold text-white">{u.label}</span>
                      </div>
                      <p className="text-[11px] text-white/40 leading-relaxed mb-1">{u.desc}</p>
                      <span className="text-[10px] font-bold text-yellow-400/70">{u.tokens}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Success toast */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 bg-green-500 text-white px-5 py-3 rounded-xl shadow-lg">
          <CheckCircle size={18} />
          <span className="font-bold text-sm">{tokens} tokens added to your wallet!</span>
        </div>
      )}
    </div>
  );
};

export default BuyTokenPage;
