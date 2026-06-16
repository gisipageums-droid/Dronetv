import React, { useState, useEffect } from 'react';
import { FormStep } from '../FormStep';
import { FormInput } from '../FormInput';
import { StepProps } from '../../types/form';

const PROMO_API_BASE = 'https://tty7xn2j01.execute-api.ap-south-1.amazonaws.com/Promotion_Preferences_and_Billing';

const Step7PromotionBilling: React.FC<StepProps> = ({
  formData,
  updateFormData,
  onNext,
  onPrev,
  isValid,
}) => {
  // Initial promotion formats
  const initialPromoFormats = [
    'YouTube Company Promotion (Shorts/Full)',
    'Social Shoutout',
    'Magazine Article (Premium)',
    'Website Feature (Premium)',
    'Event Coverage/Live Show (Premium)',
    'Interview (Premium)',
    'Open to all (Paid)',
  ];

  // Initial payment methods
  const initialPaymentMethods = ['UPI', 'Card', 'Bank Transfer'];

  // State for options
  const [promoFormats, setPromoFormats] = useState(initialPromoFormats);
  const [paymentMethods, setPaymentMethods] = useState(initialPaymentMethods);

  // Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditingCategory, setCurrentEditingCategory] = useState<string | null>(null);
  const [editableOptions, setEditableOptions] = useState<string[]>([]);
  const [newOption, setNewOption] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isUpdatingOptions, setIsUpdatingOptions] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const addPromotionOptionsOnServer = async (options: string[]) => {
    setIsUpdatingOptions(true);
    setUpdateError(null);
    try {
      const res = await fetch(`${PROMO_API_BASE}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promotionOptions: options }),
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
    } catch (err) {
};

export default Step7PromotionBilling;