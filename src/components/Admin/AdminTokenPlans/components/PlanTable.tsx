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
      <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm">
        <div className="w-14 h-14 rounded-xl bg-yellow-400 flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-7 h-7 text-black" />
        </div>
        <h3 className="text-gray-900 font-bold mb-1">No plans yet</h3>
        <p className="text-sm text-gray-500">Create your first token plan to get started</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Plan Name</th>
              <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Tokens</th>
              <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Price (INR)</th>
              <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Discount</th>
              <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Features</th>
              <th className="text-right p-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {plans.map((plan) => (
              <tr key={plan.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <p className="text-sm font-bold text-gray-900">{plan.name}</p>
                </td>
                <td className="p-4">
                  <p className="text-sm text-gray-700">{plan.tokens.toLocaleString()}</p>
                </td>
                <td className="p-4">
                  <p className="text-sm font-bold text-gray-900">₹{plan.price.toLocaleString()}</p>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-yellow-400 text-black text-xs font-bold">
                    {plan.discount}%
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {plan.features.slice(0, 2).map((feature, index) => (
                      <span key={index} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                        {feature}
                      </span>
                    ))}
                    {plan.features.length > 2 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                        +{plan.features.length - 2} more
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onEdit(plan)}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-700"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(plan.id)}
                      className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-gray-400 hover:text-red-600"
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
