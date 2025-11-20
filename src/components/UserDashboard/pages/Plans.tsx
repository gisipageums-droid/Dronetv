import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import { useUserAuth } from "../../context/context";
import axios from 'axios';
import { toast } from 'react-toastify';

const RechargePlans: React.FC = () => {
    const [animatingCard, setAnimatingCard] = useState<string | null>(null);

    const plans = [
        {
            id: 'basic',
            name: 'Basic',
            monthly: { price: 886, billed: 'billed monthly' },
            yearly: { price: 8510, billed: 'billed monthly (₹521 total)' },
            features: ['5GB Data', 'Unlimited Calls', '100 SMS/day'],
            popular: false,
        },
        {
            id: 'pro',
            name: 'Pro',
            monthly: { price: 1772, billed: 'billed monthly' },
            yearly: { price: 13830, billed: 'billed monthly (₹1408 total)' },
            features: ['20GB Data', 'Unlimited Calls & SMS', '5G Access', 'Roaming'],
            popular: true,
        },
        {
            id: 'premium',
            name: 'Premium',
            monthly: { price: 2659, billed: 'billed monthly' },
            yearly: { price: 20923, billed: 'billed monthly (₹2295 total)' },
            features: ['Unlimited Data', 'Unlimited Calls & SMS', '5G+ Access', 'Global Roaming', 'Priority Support'],
            popular: false,
        },
    ];

    const togglePlanPeriod = (planId: string) => {
        setAnimatingCard(planId);
        setTimeout(() => setAnimatingCard(null), 300);
    };
    const navigate = useNavigate();
    const { user } = useUserAuth();
    const { Razorpay } = useRazorpay();
    const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);

    const TOKEN_RATE = 10; // ₹10 = 1 token

    const handleSelectPlan = async (plan: any, isYearly: boolean) => {
        if (!user) {
            toast.error("Please login to purchase a plan");
            navigate('/login');
            return;
        }

        const price = isYearly ? plan.yearly.price : plan.monthly.price;
        const tokenCount = Math.floor(price / TOKEN_RATE);
        const planName = `${plan.name} (${isYearly ? 'Yearly' : 'Monthly'})`;

        setProcessingPlanId(plan.id);

        try {
            // Step 1: Place Order
            const orderData = {
                userId: user?.userData?.userId || user?.userData?.email,
                amount: price,
                tokenCount: tokenCount,
                currency: "INR",
                email: user?.userData?.email || '',
                name: user?.userData?.fullName || '',
                phone: user?.userData?.phone || '',
                notes: {
                    planId: plan.id,
                    planName: planName,
                    period: isYearly ? 'yearly' : 'monthly'
                }
            };

            const placeOrderResponse = await axios.post('https://yv3392if0d.execute-api.ap-south-1.amazonaws.com/dev/drontv-token-buy-payment-gateway/place-order', orderData);

            if (!placeOrderResponse.data.success) {
                throw new Error(placeOrderResponse.data.message || 'Failed to create order');
            }

            const { transactionId, razorpayOrderId, key, order } = placeOrderResponse.data.data;

            // Step 2: Initialize Razorpay
            const options: RazorpayOrderOptions = {
                key: key,
                amount: order.amount,
                currency: order.currency,
                name: "DRONTV",
                description: `Purchase ${planName} - ${tokenCount} Tokens`,
                image: "https://www.dronetv.in/images/Drone%20tv%20.in.png",
                order_id: razorpayOrderId,
                handler: async (response) => {
                    try {
                        // Step 3: Confirm Order
                        const confirmData = {
                            payment_id: response.razorpay_payment_id,
                            order_id: response.razorpay_order_id,
                            transactionId: transactionId
                        };

                        const confirmResponse = await axios.post('https://yv3392if0d.execute-api.ap-south-1.amazonaws.com/dev/drontv-token-buy-payment-gateway/confirm-order', confirmData);

                        if (confirmResponse.data.success) {
                            toast.success(`Plan purchased successfully! ${tokenCount} tokens added.`);
                        } else {
                            toast.error(confirmResponse.data.message || 'Payment verification failed');
                        }
                    } catch (error: any) {
                        console.error('Confirm order error:', error);
                        toast.error('Payment verification failed. Please contact support.');
                    }
                },
                prefill: {
                    name: user?.userData?.fullName || '',
                    email: user?.userData?.email || '',
                    contact: user?.userData?.phone || ''
                },
                theme: {
                    color: "#F59E0B",
                },
                modal: {
                    ondismiss: () => {
                        setProcessingPlanId(null);
                    }
                }
            };

            const razorpayInstance = new Razorpay(options);
            razorpayInstance.open();

        } catch (error: any) {
            console.error('Payment error:', error);
            toast.error(error.message || 'Failed to initiate payment');
        } finally {
            setProcessingPlanId(null);
        }
    };

    return (
        <>
            {/* Custom Animations */}
            <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        @keyframes checkPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        .animate-price-pulse {
          animation: pulse 0.3s ease forwards;
        }
        .animate-check-pulse {
          animation: checkPulse 1.2s infinite;
        }
      `}</style>

            {/* Main Container — bg-amber-200 */}
            <div className="min-h-screen py-10 px-4 relative">

                {/* 🔷 Buy Token Button (Top-Right, Responsive) */}
                <div className="absolute top-6 right-6 z-20 md:top-8 md:right-8">
                    <button
                        className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5 px-5 rounded-full shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
                        onClick={() => (navigate('/user-buy'))}
                        aria-label="Buy recharge tokens"
                    >
                        <span className="hidden sm:inline">Buy Token</span>
                        <span className="sm:hidden">Token</span>
                    </button>
                </div>

                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-10 pt-4">
                        <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-2">
                            Choose Your Plan
                        </h1>
                        <p className="text-amber-700">Flexible recharge options for every need</p>
                    </div>

                    {/* Plans Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {plans.map((plan) => {
                            const [isYearly, setIsYearly] = useState<boolean>(false);

                            return (
                                <div
                                    key={plan.id}
                                    className={`relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border ${plan.popular
                                        ? 'border-amber-400 ring-1 ring-amber-200'
                                        : 'border-amber-200'
                                        }`}
                                >
                                    {/* Popular Badge */}
                                    {plan.popular && (
                                        <div className="absolute top-8 right-[-30px] bg-amber-400 text-amber-900 font-bold text-xs py-1 px-7 rotate-45 z-10 ">
                                            Most Popular
                                        </div>
                                    )}

                                    <div className="p-5 flex flex-col h-full">
                                        {/* Per-Card Toggle */}
                                        <div className="flex justify-center mb-5">
                                            <div
                                                className="relative inline-flex bg-amber-100 rounded-full p-0.5 w-48 h-9 shadow-sm cursor-pointer select-none"
                                                onClick={() => {
                                                    setIsYearly(!isYearly);
                                                    togglePlanPeriod(plan.id);
                                                }}
                                                role="switch"
                                                aria-checked={isYearly}
                                                tabIndex={0}
                                                onKeyDown={(e) => e.key === 'Enter' && setIsYearly(!isYearly)}
                                                aria-label={`${plan.name} plan: toggle monthly/yearly`}
                                            >
                                                <span
                                                    className={`flex-1 text-center text-xs font-medium py-1.5 rounded-full transition-colors z-10 relative ${!isYearly
                                                        ? 'text-amber-800 bg-white shadow-sm'
                                                        : 'text-amber-600'
                                                        }`}
                                                >
                                                    Monthly
                                                </span>
                                                <span
                                                    className={`flex-1 text-center text-xs font-medium py-1.5 rounded-full transition-colors z-10 relative ${isYearly
                                                        ? 'text-amber-800 bg-white shadow-sm'
                                                        : 'text-amber-600'
                                                        }`}
                                                >
                                                    Yearly
                                                </span>
                                                <span
                                                    className={`absolute top-0.5 h-8 w-24 bg-white rounded-full shadow transition-transform duration-300 ${isYearly ? 'translate-x-24' : 'translate-x-0'
                                                        }`}
                                                />
                                            </div>
                                        </div>

                                        {/* Plan Info */}
                                        <div className="text-center mb-5">
                                            <h2 className="text-xl font-bold text-amber-900 mb-2">
                                                {plan.name}
                                            </h2>
                                            <div className="flex items-baseline justify-center mb-1">
                                                <span className="text-lg text-amber-900">₹</span>
                                                <span
                                                    className={`text-4xl font-extrabold text-amber-600 mx-1 transition-all duration-300 ${animatingCard === plan.id ? 'animate-price-pulse' : ''
                                                        }`}
                                                >
                                                    {isYearly ? plan.yearly.price : plan.monthly.price}
                                                </span>
                                                <span className="text-base text-amber-700">
                                                    /{isYearly ? 'yr' : 'mo'}
                                                </span>
                                            </div>
                                            <p className="text-amber-600 text-xs">
                                                {isYearly ? plan.yearly.billed : plan.monthly.billed}
                                            </p>
                                        </div>

                                        {/* Features */}
                                        <ul className="mb-6 space-y-3 flex-grow">
                                            {plan.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-start">
                                                    <span
                                                        className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-xs mr-2 flex-shrink-0 animate-check-pulse"
                                                        style={{ animationDelay: `${idx * 0.15}s` }}
                                                    >
                                                        ✓
                                                    </span>
                                                    <span className="text-amber-800 text-sm">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        {/* CTA Button */}
                                        <button
                                            onClick={() => handleSelectPlan(plan, isYearly)}
                                            disabled={processingPlanId === plan.id}
                                            className={`w-full py-2.5 font-semibold rounded-lg text-sm transition-all flex justify-center items-center ${plan.popular
                                                ? 'bg-amber-500 hover:bg-amber-600 text-white shadow'
                                                : 'bg-amber-100 hover:bg-amber-200 text-amber-800'
                                                } ${processingPlanId === plan.id ? 'opacity-75 cursor-not-allowed' : ''}`}
                                        >
                                            {processingPlanId === plan.id ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Processing...
                                                </>
                                            ) : (
                                                'Select Plan'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};

export default RechargePlans;