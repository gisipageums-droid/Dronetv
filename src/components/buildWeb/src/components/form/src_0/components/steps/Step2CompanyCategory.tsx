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
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-slate-300 hover:border-slate-400'
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
                formData.companyCategory.includes(value) ? 'text-blue-600' : 'text-slate-400'
              }`} />
              <h3 className={`text-xl font-bold mb-2 ${
                formData.companyCategory.includes(value) ? 'text-blue-900' : 'text-slate-700'
              }`}>
                {value}
              </h3>
              <p className={`text-sm text-center ${
                formData.companyCategory.includes(value) ? 'text-blue-700' : 'text-slate-500'
              }`}>
                {description}
              </p>
            </label>
          ))}
        </div>

        {formData.companyCategory.length === 0 && (
          <div className="text-center py-8">
            <p className="text-slate-500">Please select at least one category to continue</p>
          </div>
        )}

        {formData.companyCategory.length > 0 && (
          <div className="bg-slate-100 rounded-lg p-4">
            <h4 className="font-semibold text-slate-900 mb-2">Selected Categories:</h4>
            <div className="flex flex-wrap gap-2">
              {formData.companyCategory.map((category) => (
                <span
                  key={category}
                  className="px-3 py-1 bg-slate-200 text-slate-800 rounded-full text-sm font-medium"
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