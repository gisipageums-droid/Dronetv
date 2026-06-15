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
    <div className="fixed inset-0 z-[9999999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
        <div className="sticky top-0 bg-gray-900 px-6 py-4 rounded-t-xl flex items-center justify-between z-10">
          <div>
            <p className="text-white font-bold text-sm">{plan ? 'Edit Plan' : 'Create New Plan'}</p>
            <p className="text-xs text-gray-400">Fill in the details below</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1.5 hover:bg-gray-800 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Plan Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400 transition-all"
              placeholder="e.g., Starter Pack"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Number of Tokens</label>
            <input
              type="number"
              value={tokens}
              onChange={(e) => setTokens(e.target.value)}
              required
              min="1"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400 transition-all"
              placeholder="1000"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Discount (%)</label>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              required
              min="0"
              max="100"
              step="0.1"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400 transition-all"
              placeholder="10"
            />
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-bold text-gray-900 mb-2">Pricing Calculation</p>
                <div className="space-y-1 text-xs text-gray-500">
                  <div className="flex justify-between">
                    <span>Base Price ({parseInt(tokens) || 0} × ₹{tokenPriceINR}):</span>
                    <span>₹{basePrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount ({parseFloat(discount) || 0}%):</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-1.5 border-t border-yellow-200">
                    <span className="font-bold text-gray-900">Final Price:</span>
                    <span className="font-bold text-gray-900">₹{finalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Price Override (INR)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              min="0"
              step="0.01"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400 transition-all"
              placeholder="450.00"
            />
            <p className="text-xs text-gray-400 mt-1">You can manually adjust the final price if needed</p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Features</label>
              <button
                type="button"
                onClick={handleAddFeature}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-lg transition-colors flex items-center gap-1"
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
                    className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400 transition-all"
                    placeholder="e.g., Priority support"
                  />
                  {features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(index)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 border border-gray-200 text-gray-700 py-2.5 px-5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-yellow-400 text-black font-bold py-2.5 px-5 rounded-lg text-sm hover:bg-yellow-300 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : plan ? 'Update Plan' : 'Create Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
