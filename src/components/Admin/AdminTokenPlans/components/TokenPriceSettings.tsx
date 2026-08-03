import { useState, useEffect } from 'react';
import { Save, Info } from 'lucide-react';

interface TokenPriceSettingsProps {
  tokenPriceINR: number;
  setTokenPriceINR: (price: number) => Promise<void> | void;
}

export function TokenPriceSettings({ tokenPriceINR, setTokenPriceINR }: TokenPriceSettingsProps) {
  const [tempPrice, setTempPrice] = useState(tokenPriceINR.toString());
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTempPrice(tokenPriceINR.toString());
  }, [tokenPriceINR]);

  const handleSave = async () => {
    const price = parseFloat(tempPrice);
    if (!isNaN(price) && price > 0) {
      setLoading(true);
      try {
        await setTokenPriceINR(price);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold tracking-widest text-brand-gold uppercase mb-1">Settings</p>
        <h1 className="text-xl font-extrabold text-ink mb-1">Token Price Settings</h1>
        <p className="text-sm text-ink-caption">Set the base price per token in INR</p>
      </div>

      <div className="max-w-2xl">
        <div className="bg-surface-card border border-ink-light rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand-yellow flex items-center justify-center font-extrabold text-ink">
              ₹
            </div>
            <div>
              <p className="font-bold text-ink">Base Token Price</p>
              <p className="text-xs text-ink-caption">Price per individual token</p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-ink-caption uppercase tracking-wide mb-1.5">
                Price per Token (INR)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-caption text-sm">₹</span>
                <input
                  type="number"
                  step="0.01"
                  value={tempPrice}
                  onChange={(e) => setTempPrice(e.target.value)}
                  className="w-full border border-ink-light rounded-xl px-10 py-3 text-ink text-sm focus:outline-none focus:ring-1 focus:ring-brand-yellow focus:border-brand-yellow transition-all"
                  placeholder="0.50"
                />
              </div>
            </div>

            <div className="bg-surface-main border border-brand-yellow-soft rounded-xl p-4 flex gap-3">
              <Info className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-ink mb-1">Pricing Information</p>
                <p className="text-xs text-ink-caption">
                  This is the base price per token. When creating plans, you can offer discounts from this base price.
                  For example, if the base price is ₹0.50 per token, a plan with 1000 tokens at 10% discount would cost ₹450.
                </p>
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full bg-brand-yellow text-ink font-bold py-3 px-6 rounded-xl hover:bg-brand-yellow-soft transition-colors flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : saved ? 'Saved!' : 'Save Price'}
            </button>
          </div>
        </div>

        <div className="mt-5 bg-surface-card border border-ink-light rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-ink mb-4">Pricing Examples</h3>
          <div className="space-y-2">
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
                <div key={example.tokens} className="flex items-center justify-between p-3 bg-ink-offwhite rounded-lg">
                  <div>
                    <p className="text-sm font-bold text-ink">{example.tokens} tokens</p>
                    <p className="text-xs text-ink-caption">{example.discount}% discount</p>
                  </div>
                  <div className="text-right">
                    {example.discount > 0 && (
                      <p className="text-xs text-ink-caption line-through">₹{totalBase.toFixed(2)}</p>
                    )}
                    <p className="text-sm font-bold text-ink">₹{finalPrice.toFixed(2)}</p>
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
