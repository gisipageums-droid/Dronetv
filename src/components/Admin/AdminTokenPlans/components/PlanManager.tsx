import { useState } from 'react';
import { Plus } from 'lucide-react';
import { TokenPlan, PlanType } from '../App';
import { PlanTable } from './PlanTable';
import { PlanModal } from './PlanModal';

interface PlanManagerProps {
  type: PlanType;
  plans: TokenPlan[];
  addPlan: (plan: Omit<TokenPlan, 'id'>) => Promise<void> | void;
  updatePlan: (id: string, plan: Partial<TokenPlan>) => Promise<void> | void;
  deletePlan: (id: string) => Promise<void> | void;
  tokenPriceINR: number;
}

export function PlanManager({ type, plans, addPlan, updatePlan, deletePlan, tokenPriceINR }: PlanManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<TokenPlan | null>(null);
  const [saving, setSaving] = useState(false);

  const handleEdit = (plan: TokenPlan) => {
    setEditingPlan(plan);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingPlan(null);
  };

  const handleSave = async (plan: Omit<TokenPlan, 'id'>) => {
    setSaving(true);
    try {
      if (editingPlan) {
        await updatePlan(editingPlan.id, plan);
      } else {
        await addPlan(plan);
      }
      handleClose();
    } catch (error) {
      console.error("Failed to save plan", error);
    } finally {
      setSaving(false);
    }
  };

  const typeLabels: Record<PlanType, string> = {
    'one-time': 'One-Time',
    'monthly': 'Monthly',
    'Quarterly': 'Quarterly',
    'yearly': 'Yearly'
  };

  return (
    <div className="space-y-6 mt-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-yellow-900 mb-2">{typeLabels[type]} Plans</h1>
          <p className="text-yellow-700/70">Manage your {typeLabels[type].toLowerCase()} token plans</p>
        </div>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-amber-500 text-white py-3 px-6 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create New Plan
        </button>
      </div>

      <PlanTable 
        plans={plans}
        onEdit={handleEdit}
        onDelete={deletePlan}
      />

      {isModalOpen && (
        <PlanModal
          type={type}
          plan={editingPlan}
          onClose={handleClose}
          onSave={handleSave}
          tokenPriceINR={tokenPriceINR}
          saving={saving}
        />
      )}
    </div>
  );
}
