import { useState } from 'react';
import { DollarSign, Save, Info } from 'lucide-react';

interface TokenPriceSettingsProps {
  tokenPriceINR: number;
  setTokenPriceINR: (price: number) => Promise<void> | void;
}

export function TokenPriceSettings({ tokenPriceINR, setTokenPriceINR }: TokenPriceSettingsProps) {
  const [tempPrice, setTempPrice] = useState(tokenPriceINR.toString());
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    const price = parseFloat(tempPrice);
    if (!isNaN(price) && price > 0) {
      setLoading(true);
      try {
        await setTokenPriceINR(price);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } catch (error) {
        console.error("Failed to save price", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6 mt-20">
      <div>
        <h1 className="text-yellow-900 mb-2">Token Price Settings</h1>
        <p className="text-yellow-700/70">Set the base price per token in INR</p>
      </div>

      <div className="max-w-2xl">
        <div className="bg-white/40 backdrop-blur-xl border border-yellow-200/50 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-yellow-400/20  flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-yellow-900" />
            </div>
            <div>
              <h3 className="text-yellow-900">Base Token Price</h3>
              <p className="text-xs text-yellow-700/70">Price per individual token</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-yellow-900 mb-2">
                Price per Token (INR)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-700">₹</span>
                <input
                  type="number"
                  step="0.01"
                  value={tempPrice}
                  onChange={(e) => setTempPrice(e.target.value)}
                  className="w-full bg-white/60 backdrop-blur-sm border border-yellow-300/50 rounded-xl px-10 py-3 text-yellow-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
                  placeholder="0.50"
                />
              </div>
            </div>

            <div className="bg-yellow-100/50 border border-yellow-300/50 rounded-xl p-4 flex gap-3">
              <Info className="w-5 h-5 text-yellow-700 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-yellow-900 mb-1">Pricing Information</p>
                <p className="text-xs text-yellow-700/70">
                  This is the base price per token. When creating plans, you can offer discounts from this base price. 
                  For example, if the base price is ₹0.50 per token, a plan with 1000 tokens at 10% discount would cost ₹450.
                </p>
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full bg-amber-500 text-white py-3 px-6 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Saving...' : saved ? 'Saved!' : 'Save Price'}
            </button>
          </div>
        </div>

        {/* Preview Card */}
        <div className="mt-6 bg-white/40 backdrop-blur-xl border border-yellow-200/50 rounded-2xl p-6">
          <h3 className="text-yellow-900 mb-4">Pricing Examples</h3>
          <div className="space-y-3">
            {[
              { tokens: 100, discount: 0 },
              { tokens: 500, discount: 5 },
              { tokens: 1000, discount: 10 },
              { tokens: 5000, discount: 20 }
            ].map((example) => {
              const basePrice = parseFloat(tempPrice) || 0;
              const totalBase = example.tokens * basePrice;
              const discountAmount = totalBase * (example.discount / 100);
              const finalPrice = totalBase - discountAmount;

              return (
                <div key={example.tokens} className="flex items-center justify-between p-3 bg-yellow-100/30 rounded-xl">
                  <div>
                    <p className="text-yellow-900">{example.tokens} tokens</p>
                    <p className="text-xs text-yellow-700/70">{example.discount}% discount</p>
                  </div>
                  <div className="text-right">
                    {example.discount > 0 && (
                      <p className="text-xs text-yellow-700/70 line-through">₹{totalBase.toFixed(2)}</p>
                    )}
                    <p className="text-yellow-900">₹{finalPrice.toFixed(2)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
