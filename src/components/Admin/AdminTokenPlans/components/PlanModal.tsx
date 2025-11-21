import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Info } from 'lucide-react';
import { TokenPlan, PlanType } from '../App';

interface PlanModalProps {
  type: PlanType;
  plan: TokenPlan | null;
  onClose: () => void;
  onSave: (plan: Omit<TokenPlan, 'id'>) => void;
  tokenPriceINR: number;
  saving?: boolean;
}

export function PlanModal({ type, plan, onClose, onSave, tokenPriceINR, saving = false }: PlanModalProps) {
  const [name, setName] = useState(plan?.name || '');
  const [tokens, setTokens] = useState(plan?.tokens.toString() || '');
  const [price, setPrice] = useState(plan?.price.toString() || '');
  const [discount, setDiscount] = useState(plan?.discount.toString() || '0');
  const [features, setFeatures] = useState<string[]>(plan?.features || ['']);

  useEffect(() => {
    // Auto-calculate price when tokens or discount changes
    const tokenCount = parseInt(tokens) || 0;
    const discountPercent = parseFloat(discount) || 0;
    const basePrice = tokenCount * tokenPriceINR;
    const discountedPrice = basePrice * (1 - discountPercent / 100);
    
    if (tokenCount > 0 && !plan) {
      setPrice(discountedPrice.toFixed(2));
    }
  }, [tokens, discount, tokenPriceINR, plan]);

  const handleAddFeature = () => {
    setFeatures([...features, '']);
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const filteredFeatures = features.filter(f => f.trim() !== '');
    
    onSave({
      name,
      tokens: parseInt(tokens),
      price: parseFloat(price),
      discount: parseFloat(discount),
      type,
      features: filteredFeatures
    });
  };

  const basePrice = (parseInt(tokens) || 0) * tokenPriceINR;
  const discountAmount = basePrice * (parseFloat(discount) || 0) / 100;
  const finalPrice = basePrice - discountAmount;

  return (
    <div className="fixed inset-0 z-[9999999] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <div className="bg-white/90 backdrop-blur-xl border border-yellow-200/50 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-amber-500 p-6 rounded-t-2xl flex items-center justify-between z-10">
          <div>
            <h2 className="text-white">{plan ? 'Edit Plan' : 'Create New Plan'}</h2>
            <p className="text-xs text-yellow-50">Fill in the details below</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Plan Name */}
          <div>
            <label className="block text-yellow-900 mb-2">Plan Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full  bg-white/60 backdrop-blur-sm border border-yellow-300/50 rounded-xl px-4 py-3 text-yellow-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
              placeholder="e.g., Starter Pack"
            />
          </div>

          {/* Tokens */}
          <div>
            <label className="block text-yellow-900 mb-2">Number of Tokens</label>
            <input
              type="number"
              value={tokens}
              onChange={(e) => setTokens(e.target.value)}
              required
              min="1"
              className="w-full bg-white/60 backdrop-blur-sm border border-yellow-300/50 rounded-xl px-4 py-3 text-yellow-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
              placeholder="1000"
            />
          </div>

          {/* Discount */}
          <div>
            <label className="block text-yellow-900 mb-2">Discount (%)</label>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              required
              min="0"
              max="100"
              step="0.1"
              className="w-full bg-white/60 backdrop-blur-sm border border-yellow-300/50 rounded-xl px-4 py-3 text-yellow-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
              placeholder="10"
            />
          </div>

          {/* Price Preview */}
          <div className="bg-yellow-100/50 border border-yellow-300/50 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-yellow-700 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-yellow-900 mb-2">Pricing Calculation</p>
                <div className="space-y-1 text-xs text-yellow-700/70">
                  <div className="flex justify-between">
                    <span>Base Price ({parseInt(tokens) || 0} × ₹{tokenPriceINR}):</span>
                    <span>₹{basePrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount ({parseFloat(discount) || 0}%):</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-yellow-300/30">
                    <span className="text-yellow-900">Final Price:</span>
                    <span className="text-yellow-900">₹{finalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Price Override */}
          <div>
            <label className="block text-yellow-900 mb-2">Price Override (INR)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              min="0"
              step="0.01"
              className="w-full bg-white/60 backdrop-blur-sm border border-yellow-300/50 rounded-xl px-4 py-3 text-yellow-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
              placeholder="450.00"
            />
            <p className="text-xs text-yellow-700/70 mt-1">You can manually adjust the final price if needed</p>
          </div>

          {/* Features */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-yellow-900">Features</label>
              <button
                type="button"
                onClick={handleAddFeature}
                className="text-xs bg-yellow-300/30 hover:bg-yellow-300/50 text-yellow-900 px-3 py-1 rounded-lg transition-colors flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Add Feature
              </button>
            </div>
            <div className="space-y-2">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    className="flex-1 bg-white/60 backdrop-blur-sm border border-yellow-300/50 rounded-xl px-4 py-2 text-yellow-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
                    placeholder="e.g., Priority support"
                  />
                  {features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(index)}
                      className="p-2 hover:bg-red-300/20 rounded-lg transition-colors text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 bg-yellow-100/50 hover:bg-yellow-200/50 text-yellow-900 py-3 px-6 rounded-xl transition-all disabled:opacity-70"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-amber-500 text-white py-3 px-6 rounded-xl hover:shadow-lg transition-all disabled:opacity-70"
            >
              {saving ? 'Saving...' : plan ? 'Update Plan' : 'Create Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
