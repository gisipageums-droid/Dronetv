import { Edit2, Trash2, Sparkles } from 'lucide-react';
import { TokenPlan } from '../App';

interface PlanTableProps {
  plans: TokenPlan[];
  onEdit: (plan: TokenPlan) => void;
  onDelete: (id: string) => void;
}

export function PlanTable({ plans, onEdit, onDelete }: PlanTableProps) {
  if (plans.length === 0) {
    return (
      <div className="bg-white/40 backdrop-blur-xl border border-yellow-200/50 rounded-2xl p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-yellow-100/50 flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-yellow-600" />
        </div>
        <h3 className="text-yellow-900 mb-2">No plans yet</h3>
        <p className="text-yellow-700/70">Create your first token plan to get started</p>
      </div>
    );
  }

  return (
    <div className="bg-white/40 backdrop-blur-xl border border-yellow-200/50 rounded-2xl overflow-hidden mt-20">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-yellow-200/50 bg-yellow-50/50">
              <th className="text-left p-4 text-yellow-900">Plan Name</th>
              <th className="text-left p-4 text-yellow-900">Tokens</th>
              <th className="text-left p-4 text-yellow-900">Price (INR)</th>
              <th className="text-left p-4 text-yellow-900">Discount</th>
              <th className="text-left p-4 text-yellow-900">Features</th>
              <th className="text-right p-4 text-yellow-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr key={plan.id} className="border-b border-yellow-200/30 hover:bg-yellow-50/30 transition-colors">
                <td className="p-4">
                  <p className="text-yellow-900">{plan.name}</p>
                </td>
                <td className="p-4">
                  <p className="text-yellow-800">{plan.tokens.toLocaleString()}</p>
                </td>
                <td className="p-4">
                  <p className="text-yellow-900">₹{plan.price.toLocaleString()}</p>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-900">
                    {plan.discount}%
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {plan.features.slice(0, 2).map((feature, index) => (
                      <span key={index} className="text-xs px-2 py-1 rounded-lg bg-yellow-100/50 text-yellow-800">
                        {feature}
                      </span>
                    ))}
                    {plan.features.length > 2 && (
                      <span className="text-xs px-2 py-1 rounded-lg bg-yellow-100/50 text-yellow-800">
                        +{plan.features.length - 2} more
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(plan)}
                      className="p-2 hover:bg-yellow-300/20 rounded-lg transition-colors text-yellow-700 hover:text-yellow-900"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(plan.id)}
                      className="p-2 hover:bg-red-300/20 rounded-lg transition-colors text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
