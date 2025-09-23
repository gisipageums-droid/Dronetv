import React from 'react';
import { FormStep } from '../FormStep';
import { MultiSelect, FormInput } from '../FormInput';
import { StepProps } from '../../types/form';

const Step7PromotionBilling: React.FC<StepProps> = ({
  formData,
  updateFormData,
  onNext,
  onPrev,
  isValid,
}) => {
  const promoFormatOptions = [
    'YouTube Company Promotion (Shorts/Full)',
    'Social Shoutout',
    'Magazine Article (Premium)',
    'Website Feature (Premium)',
    'Event Coverage/Live Show (Premium)',
    'Interview (Premium)',
    'Open to all (Paid)',
  ];

  const paymentMethodOptions = ['UPI', 'Card', 'Bank Transfer'];

  const showBillingFields = formData.promoFormats.some(format => 
    format.includes('Premium') || format.includes('Paid')
  );

  return (
    <FormStep
      title="Promotion Preferences & Billing"
      description="Select your preferred promotion formats and provide billing information if needed."
      onNext={onNext}
      onPrev={onPrev}
      isValid={isValid}
      currentStep={5}
      totalSteps={6}
    >
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6">
          <h3 className="text-lg font-bold text-orange-900 mb-4">Promotion Preferences</h3>
          <MultiSelect
            label="Select Promotion Formats"
            options={promoFormatOptions}
            selected={formData.promoFormats}
            onChange={(selected) => updateFormData({ promoFormats: selected })}
          />
          
          {formData.promoFormats.length > 0 && (
            <div className="mt-4 p-4 bg-orange-100 rounded-lg">
              <h4 className="font-semibold text-orange-900 mb-2">Selected Formats:</h4>
              <ul className="space-y-1">
                {formData.promoFormats.map((format) => (
                  <li key={format} className="flex items-center text-orange-800">
                    <span className="w-2 h-2 bg-orange-600 rounded-full mr-3"></span>
                    {format}
                    {(format.includes('Premium') || format.includes('Paid')) && (
                      <span className="ml-2 px-2 py-1 bg-orange-200 text-orange-800 text-xs rounded-full">
                        Paid Service
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {showBillingFields && (
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-bold text-blue-900 mb-4">Billing Information</h3>
            <p className="text-blue-700 mb-4">
              Since you've selected premium services, please provide billing details.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Billing Contact Name"
                value={formData.billingContactName || ''}
                onChange={(value) => updateFormData({ billingContactName: value })}
                placeholder="Full name for billing"
              />
              
              <FormInput
                label="Billing Contact Email"
                type="email"
                value={formData.billingContactEmail || ''}
                onChange={(value) => updateFormData({ billingContactEmail: value })}
                placeholder="billing@company.com"
              />
              
              <FormInput
                label="GST Details"
                value={formData.billingGstDetails || ''}
                onChange={(value) => updateFormData({ billingGstDetails: value })}
                placeholder="GST number if applicable"
              />
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Preferred Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {paymentMethodOptions.map((method) => (
                    <label
                      key={method}
                      className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all hover:bg-slate-50 ${
                        formData.paymentMethod === method
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method}
                        checked={formData.paymentMethod === method}
                        onChange={(e) => updateFormData({ paymentMethod: e.target.value })}
                        className="sr-only"
                      />
                      <span className="font-medium">{method}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            
            <FormInput
              label="Billing Address"
              type="textarea"
              value={formData.billingAddress || ''}
              onChange={(value) => updateFormData({ billingAddress: value })}
              placeholder="Complete billing address"
              rows={3}
            />
          </div>
        )}

        <div className="bg-slate-50 rounded-lg p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Terms & Conditions</h3>
          
          <div className="space-y-4">
            <label className="flex items-start">
              <input
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={(e) => updateFormData({ acceptTerms: e.target.checked })}
                className="mt-1 mr-3 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <span className="text-slate-700">
                <span className="font-semibold">I accept the Terms & Conditions</span>
                <span className="text-red-500 ml-1">*</span>
                <br />
                <span className="text-sm text-slate-600">
                  I agree to the terms of service, data processing, and promotional activities as outlined in the DroneTV platform agreement.
                </span>
              </span>
            </label>
            
            <label className="flex items-start">
              <input
                type="checkbox"
                checked={formData.acceptPrivacy}
                onChange={(e) => updateFormData({ acceptPrivacy: e.target.checked })}
                className="mt-1 mr-3 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <span className="text-slate-700">
                <span className="font-semibold">I accept the Privacy Policy</span>
                <span className="text-red-500 ml-1">*</span>
                <br />
                <span className="text-sm text-slate-600">
                  I understand how my data will be collected, processed, and used for website generation and promotional purposes.
                </span>
              </span>
            </label>
          </div>
          
          {(!formData.acceptTerms || !formData.acceptPrivacy) && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">
                Please accept both Terms & Conditions and Privacy Policy to continue.
              </p>
            </div>
          )}
        </div>
      </div>
    </FormStep>
  );
};

export default Step7PromotionBilling;