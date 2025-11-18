import React, { useState, useEffect } from 'react';


const BuyTokenPage: React.FC = () => {
    const [amount, setAmount] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [showSuccess, setShowSuccess] = useState<boolean>(false);

    // Conversion rate: ₹10 = 1 token
    const TOKEN_RATE = 10;
    const numericAmount = parseFloat(amount) || 0;
    const tokens = Math.floor(numericAmount / TOKEN_RATE);
    const isValid = numericAmount >= 10 && !isNaN(numericAmount);

    useEffect(() => {
        if (showSuccess) {
            const timer = setTimeout(() => setShowSuccess(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showSuccess]);

    const handlePayNow = () => {
        if (!isValid) return;
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setShowSuccess(true);
            setAmount('');
        }, 1200);
    };

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Main Card */}
                <div className="bg-white rounded-2xl hover:shadow-xl hover:shadow-yellow-200 overflow-hidden">
                    {/* Header */}
                    <div className="bg-amber-500 text-white py-5 px-6">
                        <h1 className="text-2xl md:text-3xl font-bold flex items-center">
                            <span className="ml-3">Buy Tokens</span>
                        </h1>
                    </div>

                    {/* Body */}
                    <div className="p-6 md:p-8">
                        {/* Amount Input */}
                        <div className="mb-6">
                            <label htmlFor="amount" className="block text-amber-800 font-medium mb-2">
                                Enter Amount (₹)
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-2/3 transform -translate-y-1/2 text-amber-500 font-bold">
                                    ₹
                                </span>
                                <input
                                    id="amount"
                                    type="number"
                                    min="10"
                                    step="10"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    
                                    className="w-full pl-10 pr-4 py-4 text-lg border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-3 focus:ring-amber-300 focus:border-amber-500 transition"
                                />
                            </div>

                            {/* Token Preview */}
                            {numericAmount > 0 && (
                                <div className={`mt-3 text-center p-3 rounded-lg ${isValid
                                        ? 'bg-green-50 text-green-700'
                                        : 'bg-amber-50 text-amber-700'
                                    }`}>
                                    {isValid ? (
                                        <span className="font-bold">
                                            ₹{numericAmount.toFixed(2)} → <span className="text-amber-600">{tokens} token{tokens !== 1 ? 's' : ''}</span>
                                        </span>
                                    ) : (
                                        <span>Min. ₹10 required (1 token)</span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Pay Button */}
                        <button
                            onClick={handlePayNow}
                            disabled={!isValid || isProcessing}
                            className={`w-full py-4 px-6 text-lg font-bold rounded-xl transition-all duration-200 flex items-center justify-center mb-6 ${isValid && !isProcessing
                                    ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                                    : 'bg-amber-300 text-amber-500 cursor-not-allowed'
                                }`}
                        >
                            {isProcessing ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : showSuccess ? (
                                <>
                                    <span className="mr-2">✓</span> Success!
                                </>
                            ) : (
                                'Pay Now'
                            )}
                        </button>

                        {/* 🔷 Mini Conversion Card — Now BELOW Pay Button 🔷 */}
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                            <h3 className="text-amber-800 font-semibold text-sm mb-3 flex items-center">
                                <span className="bg-amber-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center mr-2">i</span>
                                Token Conversion Rate
                            </h3>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">₹10</span>
                                    <span>= 1 token</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">₹100</span>
                                    <span>= 10 tokens</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">₹500</span>
                                    <span>= 50 tokens</span>
                                </div>
                                <div className="flex justify-between text-sm pt-2 border-t border-amber-100 mt-2">
                                    <span className="font-medium">₹1000</span>
                                    <span>= 100 tokens</span>
                                </div>
                            </div>
                            <p className="text-xs text-amber-600 mt-3 text-center">
                                💡 1 token = ₹10 value • No expiry • Instant recharge
                            </p>
                        </div>
                    </div>
                </div>

                {/* Success Toast */}
                {showSuccess && (
                    <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center animate-fade-in">
                        <span className="mr-2">🎉</span>
                        <span>₹{numericAmount} → {tokens} token{tokens !== 1 ? 's' : ''} added!</span>
                    </div>
                )}
            </div>

            {/* Animations */}
            <style jsx>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: translateX(100%); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }
      `}</style>
        </div>
    );
};

export default BuyTokenPage;