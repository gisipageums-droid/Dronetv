import React from 'react';
import { FormStep } from '../FormStep';
import { FormInput } from '../FormInput';
import { StepProps } from '../../types/form';
import { Building2, Calendar, User, Phone, Mail, Globe } from 'lucide-react';

const Step1CompanyBasics: React.FC<StepProps> = ({
  formData,
  updateFormData,
  onNext,
  onPrev,
  isValid,
}) => {
  return (
    <FormStep
      title="Company Basic Details"
      description="Tell us about your company's basic information"
      onNext={onNext}
      onPrev={onPrev}
      isValid={isValid}
      isFirstStep={true}
      currentStep={1}
      totalSteps={8}
    >
      <div className="space-y-8">
        {/* Company Information */}
        <div className="p-6 bg-blue-50 rounded-lg">
          <h3 className="flex items-center mb-4 text-lg font-bold text-blue-900">
            <Building2 className="mr-3 w-6 h-6" />
            Company Information
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormInput
              label="Company Name"
              value={formData.companyName}
              onChange={(value) => updateFormData({ companyName: value })}
              required
              placeholder="Enter your company name"
            />
            <FormInput
              label="Year Established"
              type="number"
              value={formData.yearEstablished}
              onChange={(value) => updateFormData({ yearEstablished: parseInt(value) || new Date().getFullYear() })}
              required
              placeholder="YYYY"
            />
            <FormInput
              label="Website URL"
              type="url"
              value={formData.websiteUrl}
              onChange={(value) => updateFormData({ websiteUrl: value })}
              required
              placeholder="https://www.yourcompany.com"
            />
            <FormInput
              label="Promotional Code"
              value={formData.promoCode}
              onChange={(value) => updateFormData({ promoCode: value })}
              required
              placeholder="Enter promotional code"
            />
          </div>
        </div>

        {/* Director Information */}
        <div className="p-6 bg-green-50 rounded-lg">
          <h3 className="flex items-center mb-4 text-lg font-bold text-green-900">
            <User className="mr-3 w-6 h-6" />
            Director/MD Information
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormInput
              label="Director Name"
              value={formData.directorName}
              onChange={(value) => updateFormData({ directorName: value })}
              required
              placeholder="Full name"
            />
            <FormInput
              label="Director Phone"
              type="tel"
              value={formData.directorPhone}
              onChange={(value) => updateFormData({ directorPhone: value })}
              required
              placeholder="+91XXXXXXXXXX"
            />
            <div className="md:col-span-2">
              <FormInput
                label="Director Email"
                type="email"
                value={formData.directorEmail}
                onChange={(value) => updateFormData({ directorEmail: value })}
                required
                placeholder="director@company.com"
              />
            </div>
          </div>
        </div>

        {/* Alternative Contact */}
        <div className="p-6 bg-purple-50 rounded-lg">
          <h3 className="flex items-center mb-4 text-lg font-bold text-purple-900">
            <Phone className="mr-3 w-6 h-6" />
            Alternative Contact
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormInput
              label="Contact Person Name"
              value={formData.altContactName}
              onChange={(value) => updateFormData({ altContactName: value })}
              required
              placeholder="Full name"
            />
            <FormInput
              label="Contact Phone"
              type="tel"
              value={formData.altContactPhone}
              onChange={(value) => updateFormData({ altContactPhone: value })}
              required
              placeholder="+91XXXXXXXXXX"
            />
            <div className="md:col-span-2">
              <FormInput
                label="Contact Email"
                type="email"
                value={formData.altContactEmail}
                onChange={(value) => updateFormData({ altContactEmail: value })}
                required
                placeholder="contact@company.com"
              />
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="p-6 bg-orange-50 rounded-lg">
          <h3 className="flex items-center mb-4 text-lg font-bold text-orange-900">
            <Globe className="mr-3 w-6 h-6" />
            Address Information
          </h3>
          <div className="space-y-4">
            <FormInput
              label="Office Address"
              type="textarea"
              value={formData.officeAddress}
              onChange={(value) => updateFormData({ officeAddress: value })}
              required
              placeholder="Complete office address"
              rows={3}
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <FormInput
                label="City"
                value={formData.city}
                onChange={(value) => updateFormData({ city: value })}
                required
                placeholder="City"
              />
              <FormInput
                label="State"
                value={formData.state}
                onChange={(value) => updateFormData({ state: value })}
                required
                placeholder="State"
              />
              <FormInput
                label="Country"
                value={formData.country}
                onChange={(value) => updateFormData({ country: value })}
                required
                placeholder="Country"
              />
              <FormInput
                label="Postal Code"
                value={formData.postalCode}
                onChange={(value) => updateFormData({ postalCode: value })}
                required
                placeholder="PIN Code"
              />
            </div>
          </div>
        </div>

        {/* Optional Information */}
        <div className="p-6 rounded-lg bg-slate-50">
          <h3 className="mb-4 text-lg font-bold text-slate-900">Additional Information (Optional)</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormInput
              label="Legal Company Name"
              value={formData.legalName || ''}
              onChange={(value) => updateFormData({ legalName: value })}
              placeholder="If different from brand name"
            />
            <FormInput
              label="GSTIN"
              value={formData.gstin || ''}
              onChange={(value) => updateFormData({ gstin: value })}
              placeholder="GST number"
            />
            <FormInput
              label="CIN/UDYAM/PAN"
              value={formData.cinOrUdyamOrPan || ''}
              onChange={(value) => updateFormData({ cinOrUdyamOrPan: value })}
              placeholder="Registration number"
            />
            <FormInput
              label="Operating Hours"
              value={formData.operatingHours || ''}
              onChange={(value) => updateFormData({ operatingHours: value })}
              placeholder="Mon-Sat 10:00-18:00"
            />
          </div>
        </div>
      </div>
    </FormStep>
  );
};

export default Step1CompanyBasics;