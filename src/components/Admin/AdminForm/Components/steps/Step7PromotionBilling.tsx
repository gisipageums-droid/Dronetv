import React, { useState, useEffect } from 'react';
import { FormStep } from '../FormStep';
import { FormInput } from '../FormInput';
import { StepProps } from '../../types/form';
import { ADMIN_API, LAMBDA } from '../../../../../lib/apiConfig';

const PROMO_API_BASE = ADMIN_API ? `${ADMIN_API}/promotion-billing` : `${LAMBDA.promoForm}/Promotion_Preferences_and_Billing`;

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
      console.warn('Failed to add promotion option', err);
      setUpdateError('Failed to add option. Please try again.');
    } finally {
      setIsUpdatingOptions(false);
    }
  };

  const commitInlineEdit = async () => {
    if (currentEditingCategory === 'Promotion Formats') {
      setPromoFormats(editableOptions);
      await updatePromotionOptionsOnServer(editableOptions);
    } else if (currentEditingCategory === 'Payment Methods') {
      setPaymentMethods(editableOptions);
    }
  };

  // Options hydrate from the view API below.

  // Fetch promotion formats from API view and hydrate options
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch(`${PROMO_API_BASE}/view`, { method: 'GET', signal: controller.signal });
        if (!res.ok) return;
        const json = await res.json();
        const record = Array.isArray(json?.items) ? json.items[0] : Array.isArray(json) ? json[0] : json;
        const fromApi = Array.isArray(record?.promotionOptions) ? record.promotionOptions : [];
        if (fromApi.length) {
          setPromoFormats(fromApi);
        }
      } catch (e) {
        console.warn('Failed to load promotion options from API', e);
      }
    })();
    return () => controller.abort();
  }, []);

  // Removed localStorage persistence for form data

  const showBillingFields = formData.promoFormats?.some(format =>
    format.includes('Premium') || format.includes('Paid')
  );

  const openEditModal = (category: string, options: string[]) => {
    setCurrentEditingCategory(category);
    setEditableOptions([...options]);
    setNewOption('');
    setEditingIndex(null);
    setIsEditModalOpen(true);
  };

  const updatePromotionOptionsOnServer = async (options: string[]) => {
    setIsUpdatingOptions(true);
    setUpdateError(null);
    try {
      const res = await fetch(`${PROMO_API_BASE}/update/Promotion_Preferences_and_Billing_singleton`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promotionOptions: options }),
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
    } catch (err) {
      console.warn('Failed to update promotion options', err);
      setUpdateError('Failed to update options. Please try again.');
    } finally {
      setIsUpdatingOptions(false);
    }
  };

  const handleAddOption = async () => {
    if (!newOption.trim() || !currentEditingCategory) return;

    const next = [...editableOptions, newOption.trim()];
    setEditableOptions(next);
    setNewOption('');

    if (currentEditingCategory === 'Promotion Formats') {
      setPromoFormats(next);
      await addPromotionOptionsOnServer(next);
    } else if (currentEditingCategory === 'Payment Methods') {
      setPaymentMethods(next);
    }
  };

  const handleRemoveOption = async (index: number) => {
    const next = editableOptions.filter((_, i) => i !== index);
    setEditableOptions(next);

    if (currentEditingCategory === 'Promotion Formats') {
      setPromoFormats(next);
      await updatePromotionOptionsOnServer(next);
    }
  };

  const handleSaveOptions = async () => {
    if (currentEditingCategory === 'Promotion Formats') {
      setPromoFormats(editableOptions);
      await updatePromotionOptionsOnServer(editableOptions);
    } else if (currentEditingCategory === 'Payment Methods') {
      setPaymentMethods(editableOptions);
    }
    setIsEditModalOpen(false);
  };

  return (
    <FormStep
      title="Promotion Preferences & Billing"
      description="Select your preferred promotion formats and provide billing information if needed."
      onNext={onNext}
      onPrev={onPrev}
      isValid={isValid}
      currentStep={6}
      totalSteps={6}
    >
      <div className="space-y-8">
        {/* Promotion Formats Section */}
        <div className="p-6 bg-gradient-to-r from-surface-main to-status-warning/10 rounded-lg border border-status-warning/25">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-status-warning">Promotion Preferences</h3>
            <button
              type="button"
              onClick={() => openEditModal('Promotion Formats', promoFormats)}
              className="inline-flex gap-1 items-center px-3 py-1 text-xs text-status-warning bg-status-warning/15 rounded-lg transition-colors hover:bg-status-warning/25"
            >
              ✏️ Edit Options
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {promoFormats.map((format) => (
              <label
                key={format}
                className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all hover:bg-surface-card ${formData.promoFormats?.includes(format)
                  ? 'border-status-info bg-status-info/10 text-status-info'
                  : 'border-ink-light'
                  }`}
              >
                <input
                  type="checkbox"
                  checked={formData.promoFormats?.includes(format) || false}
                  onChange={(e) => {
                    const currentFormats = formData.promoFormats || [];
                    let newFormats;
                    if (e.target.checked) {
                      newFormats = [...currentFormats, format];
                    } else {
                      newFormats = currentFormats.filter((f) => f !== format);
                    }
                    updateFormData({ promoFormats: newFormats });
                  }}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${formData.promoFormats?.includes(format)
                    ? 'border-status-info bg-status-info'
                    : 'border-ink-light'
                    }`}
                >
                  {formData.promoFormats?.includes(format) && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-sm font-medium">
                  {format}
                  {(format.includes('Premium') || format.includes('Paid')) && (
                    <span className="px-2 py-1 ml-2 text-xs text-status-warning bg-status-warning/25 rounded-full">
                      Paid Service
                    </span>
                  )}
                </span>
              </label>
            ))}
          </div>

          {formData.promoFormats?.length > 0 && (
            <div className="p-4 mt-4 bg-status-warning/15 rounded-lg border border-status-warning/25">
              <h4 className="mb-2 font-semibold text-status-warning">Selected Formats:</h4>
              <div className="flex flex-wrap gap-2">
                {formData.promoFormats.map((format) => (
                  <span
                    key={format}
                    className="px-3 py-1 text-xs font-medium text-status-warning bg-status-warning/25 rounded-full border border-status-warning/40"
                  >
                    {format}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Billing Information Section */}
        {/* {showBillingFields && (
          <div className="p-6 bg-status-info/10 rounded-lg border border-status-info/25">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-status-info">Billing Information</h3>
              <button
                type="button"
                onClick={() => openEditModal('Payment Methods', paymentMethods)}
                className="inline-flex gap-1 items-center px-3 py-1 text-xs text-status-info bg-status-info/15 rounded-lg transition-colors hover:bg-status-info/25"
              >
                ✏️ Edit Options
              </button>
            </div>

            <p className="mb-4 text-sm text-status-info">
              Since you've selected premium services, please provide billing details.
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormInput
                label="Billing Contact Name"
                value={formData.billingContactName || ''}
                onChange={(value) => {
                  updateFormData({ billingContactName: value });
                }}
                placeholder="Full name for billing"
              />

              <FormInput
                label="Billing Contact Email"
                type="email"
                value={formData.billingContactEmail || ''}
                onChange={(value) => {
                  updateFormData({ billingContactEmail: value });
                }}
                placeholder="billing@company.com"
              />

              <FormInput
                label="GST Details"
                value={formData.billingGstDetails || ''}
                onChange={(value) => {
                  updateFormData({ billingGstDetails: value });
                }}
                placeholder="GST number if applicable"
              />

              <div>
                <label className="block mb-3 text-sm font-semibold text-ink-paragraph">
                  Preferred Payment Method
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {paymentMethods.map((method) => (
                    <label
                      key={method}
                      className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all hover:bg-surface-card ${formData.paymentMethod === method
                        ? 'border-status-info bg-status-info/10 text-status-info'
                        : 'border-ink-light'
                        }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method}
                        checked={formData.paymentMethod === method}
                        onChange={(e) => {
                          updateFormData({ paymentMethod: e.target.value });
                        }}
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${formData.paymentMethod === method
                          ? 'border-status-info bg-status-info'
                          : 'border-ink-light'
                          }`}
                      >
                        {formData.paymentMethod === method && (
                          <div className="w-2 h-2 bg-surface-card rounded-full"></div>
                        )}
                      </div>
                      <span className="text-sm font-medium">{method}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <FormInput
              label="Billing Address"
              type="textarea"
              value={formData.billingAddress || ''}
              onChange={(value) => {
                updateFormData({ billingAddress: value });
              }}
              placeholder="Complete billing address"
              rows={3}
            />
          </div>
        )} */}

        {/* Terms & Conditions Section */}
        <div className="p-6 rounded-lg border bg-ink-offwhite border-ink-light">
          <h3 className="mb-4 text-lg font-bold text-ink">Terms & Conditions</h3>

          <div className="space-y-4">
            <label className="flex items-start">
              <input
                type="checkbox"
                checked={formData.acceptTerms || false}
                onChange={(e) => {
                  updateFormData({ acceptTerms: e.target.checked });
                }}
                className="mt-1 mr-3 w-5 h-5 text-status-info rounded border-ink-light focus:ring-status-info"
              />
              <span className="text-ink-paragraph">
                <span className="font-semibold">I accept the Terms & Conditions</span>
                <span className="ml-1 text-status-error">*</span>
                <br />
                <span className="text-sm text-ink-paragraph">
                  I agree to the terms of service, data processing, and promotional activities as outlined in the DroneTV platform agreement.
                </span>
              </span>
            </label>

            <label className="flex items-start">
              <input
                type="checkbox"
                checked={formData.acceptPrivacy || false}
                onChange={(e) => {
                  updateFormData({ acceptPrivacy: e.target.checked });
                }}
                className="mt-1 mr-3 w-5 h-5 text-status-info rounded border-ink-light focus:ring-status-info"
              />
              <span className="text-ink-paragraph">
                <span className="font-semibold">I accept the Privacy Policy</span>
                <span className="ml-1 text-status-error">*</span>
                <br />
                <span className="text-sm text-ink-paragraph">
                  I understand how my data will be collected, processed, and used for website generation and promotional purposes.
                </span>
              </span>
            </label>
          </div>

          {(!formData.acceptTerms || !formData.acceptPrivacy) && (
            <div className="p-3 mt-4 bg-status-error/10 rounded-lg border border-status-error/25">
              <p className="text-sm text-status-error">
                Please accept both Terms & Conditions and Privacy Policy to continue.
              </p>
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {isEditModalOpen && (
          <div className="flex fixed inset-0 z-50 justify-center items-center backdrop-blur-sm bg-ink/60">
            <div className="bg-surface-card rounded-xl shadow-xl w-11/12 max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
              <div className="p-6 border-b border-ink-light">
                <h3 className="flex gap-2 items-center text-xl font-bold text-ink">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-status-info" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Edit {currentEditingCategory}
                </h3>
                <p className="mt-1 text-sm text-ink-caption">Add or remove options for {currentEditingCategory}</p>
              </div>

              <div className="overflow-y-auto flex-1 p-6">
                <div className="mb-6">
                  <h4 className="mb-3 font-medium text-ink-paragraph">Current Options</h4>
                  <div className="p-4 bg-ink-offwhite rounded-lg border border-ink-light">
                    {editableOptions.length > 0 ? (
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {editableOptions.map((option, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center px-3 py-2 bg-surface-card rounded-lg border border-ink-light"
                          >
                            <input
                              type="text"
                              className={`flex-1 text-sm bg-transparent outline-none ${editingIndex === index ? 'ring-1 ring-status-info/40 rounded px-2 py-1' : ''}`}
                              value={option}
                              readOnly={editingIndex !== index}
                              onChange={(e) =>
                                setEditableOptions((prev) => prev.map((o, i) => (i === index ? e.target.value : o)))
                              }
                              onKeyDown={async (e) => {
                                if (e.key === 'Enter') {
                                  setEditingIndex(null);
                                  await commitInlineEdit();
                                }
                              }}
                            />
                            <div className="flex gap-2 items-center ml-3">
                              {editingIndex === index ? (
                                <button
                                  type="button"
                                  className="text-status-success transition-colors hover:text-status-success"
                                  title="Done"
                                  onClick={async () => {
                                    setEditingIndex(null);
                                    await commitInlineEdit();
                                  }}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  className="text-ink-caption transition-colors hover:text-ink-paragraph"
                                  title="Edit"
                                  onClick={() => setEditingIndex(index)}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                  </svg>
                                </button>
                              )}
                              <button
                                type="button"
                                className="text-status-error transition-colors hover:text-status-error"
                                onClick={() => handleRemoveOption(index)}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="py-3 text-sm text-center text-ink-caption">No options added yet</p>
                    )}
                  </div>
                  {updateError && (
                    <p className="mt-2 text-sm text-status-error">{updateError}</p>
                  )}
                </div>

                <div>
                  <h4 className="mb-3 font-medium text-ink-paragraph">Add New Option</h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter new option"
                      className="flex-1 px-4 py-2 rounded-lg border border-ink-light outline-none focus:ring-2 focus:ring-status-info focus:border-status-info"
                      value={newOption}
                      onChange={(e) => setNewOption(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddOption()}
                    />
                    <button
                      type="button"
                      className="flex gap-1 items-center px-4 py-2 text-white bg-status-info rounded-lg transition-colors hover:bg-status-info"
                      onClick={handleAddOption}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end p-6 bg-ink-offwhite border-t border-ink-light">
                <button
                  type="button"
                  className="px-4 py-2 font-medium text-ink-paragraph rounded-lg transition-colors hover:text-ink"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={`flex gap-1 items-center px-4 py-2 font-medium text-white rounded-lg transition-colors ${isUpdatingOptions ? 'bg-status-info cursor-not-allowed' : 'bg-status-info hover:bg-status-info'}`}
                  onClick={handleSaveOptions}
                  disabled={isUpdatingOptions}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {isUpdatingOptions ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </FormStep>
  );
};

export default Step7PromotionBilling;