import React from 'react';
import { FormStep } from '../FormStep';
import { MultiSelect } from '../FormInput';
import { StepProps } from '../../types/form';
import { Bone as Drone, Brain, MapPin } from 'lucide-react';

const Step2CompanyCategory: React.FC<StepProps> = ({
  formData,
  updateFormData,
  onNext,
  onPrev,
  isValid,
}) => {
  const categoryOptions = [
    { value: 'Drone', icon: Drone, description: 'UAV manufacturing, services, and training' },
    { value: 'AI', icon: Brain, description: 'Artificial intelligence solutions and products' },
    { value: 'GIS', icon: MapPin, description: 'Geographic Information Systems and GNSS/GPS/DGPS' },
  ];

  const handleCategoryChange = (selected: string[]) => {
    updateFormData({ companyCategory: selected });
  };

  return (
    <FormStep
      title="Company Category"
      description="Select your company's main business category (you can select multiple)"
      onNext={onNext}
      onPrev={onPrev}
      isValid={isValid}
      currentStep={2}
      totalSteps={8}
    >
      <div className="space-y-6">
        {/* Category Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categoryOptions.map(({ value, icon: Icon, description }) => (
            <label
              key={value}
              className={`flex flex-col items-center p-6 border-2 rounded-xl cursor-pointer transition-all hover:shadow-lg ${
                formData.companyCategory.includes(value)
                  ? 'border-status-info bg-status-info/10 shadow-md'
                  : 'border-ink-light hover:border-ink-caption'
              }`}
            >
              <input
                type="checkbox"
                checked={formData.companyCategory.includes(value)}
                onChange={(e) => {
                  if (e.target.checked) {
                    handleCategoryChange([...formData.companyCategory, value]);
                  } else {
                    handleCategoryChange(formData.companyCategory.filter(cat => cat !== value));
                  }
                }}
                className="sr-only"
              />
              <Icon className={`w-12 h-12 mb-4 ${
                formData.companyCategory.includes(value) ? 'text-status-info' : 'text-ink-caption'
              }`} />
              <h3 className={`text-xl font-bold mb-2 ${
                formData.companyCategory.includes(value) ? 'text-status-info' : 'text-ink-paragraph'
              }`}>
                {value}
              </h3>
              <p className={`text-sm text-center ${
                formData.companyCategory.includes(value) ? 'text-status-info' : 'text-ink-caption'
              }`}>
                {description}
              </p>
            </label>
          ))}
        </div>

        {formData.companyCategory.length === 0 && (
          <div className="text-center py-8">
            <p className="text-ink-caption">Please select at least one category to continue</p>
          </div>
        )}

        {formData.companyCategory.length > 0 && (
          <div className="bg-ink-light rounded-lg p-4">
            <h4 className="font-semibold text-ink mb-2">Selected Categories:</h4>
            <div className="flex flex-wrap gap-2">
              {formData.companyCategory.map((category) => (
                <span
                  key={category}
                  className="px-3 py-1 bg-ink-light text-ink-charcoal rounded-full text-sm font-medium"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </FormStep>
  );
};

export default Step2CompanyCategory;