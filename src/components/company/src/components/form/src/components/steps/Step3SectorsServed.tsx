import React from 'react';
import { FormStep } from '../FormStep';
import { FormInput } from '../FormInput';
import { StepProps } from '../../types/form';

const CATEGORIES = [
  {
    value: 'Drone',
    description: 'Drone manufacturing, services, surveying, photography & more',
  },
  {
    value: 'AI',
    description: 'Artificial Intelligence software, solutions & services',
  },
  {
    value: 'GIS',
    description: 'Geospatial, mapping, GNSS & location intelligence',
  },
];

const droneSectors = [
  'Agriculture & Precision Farming',
  'Construction & Infrastructure',
  'Mining & Quarrying',
  'Oil & Gas',
  'Power & Energy',
  'Transportation & Logistics',
  'Defense & Security',
  'Emergency Services',
  'Environmental Monitoring',
  'Real Estate & Photography',
  'Entertainment & Media',
  'Research & Education',
  'Training',
  'Other',
];

const aiSectors = [
  'Healthcare & Medical',
  'Finance & Banking',
  'Retail & E-commerce',
  'Manufacturing & Industry 4.0',
  'Education & EdTech',
  'Transportation & Autonomous Systems',
  'Smart Cities & IoT',
  'Cybersecurity',
  'Legal & Compliance',
  'Entertainment & Gaming',
  'Agriculture & AgTech',
  'Energy & Utilities',
  'Training',
  'Other',
];

const gisSectors = [
  'Urban Planning & Development',
  'Land Management & Surveying',
  'Environmental & Natural Resources',
  'Transportation & Infrastructure',
  'Utilities & Telecommunications',
  'Agriculture & Forestry',
  'Disaster Management',
  'Mining & Geology',
  'Defense & Border Management',
  'Maritime & Coastal',
  'Archaeology & Heritage',
  'Public Health & Epidemiology',
  'Training',
  'Other',
];

const getSectorsByCategory = (category: string) => {
  switch (category) {
    case 'Drone': return droneSectors;
    case 'AI': return aiSectors;
    case 'GIS': return gisSectors;
    default: return [];
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Drone': return { bg: 'bg-yellow-50', text: 'text-amber-900', border: 'border-amber-300' };
    case 'AI': return { bg: 'bg-blue-50', text: 'text-blue-900', border: 'border-blue-200' };
    case 'GIS': return { bg: 'bg-green-50', text: 'text-green-900', border: 'border-green-200' };
    default: return { bg: 'bg-yellow-50', text: 'text-amber-900', border: 'border-amber-200' };
  }
};

const Step3SectorsServed: React.FC<StepProps> = ({
  formData,
  updateFormData,
  onNext,
  onPrev,
  onSkip,
  showSkip,
  onStepClick,
  isValid,
  embedded,
}) => {
  const selectedCategories: string[] = formData.companyCategory || [];

  const toggleCategory = (value: string) => {
    const updated = selectedCategories.includes(value)
      ? selectedCategories.filter((c) => c !== value)
      : [...selectedCategories, value];
    updateFormData({ companyCategory: updated });
  };

  return (
    <FormStep
      title="Sectors You Serve"
      description="Select your company type and the industries you serve"
      onNext={onNext}
      onPrev={onPrev}
      onSkip={onSkip}
      showSkip={showSkip}
      onStepClick={onStepClick}
      isValid={isValid}
      currentStep={1}
      totalSteps={5}
      embedded={embedded}
    >
      <div className="space-y-6">

        {/* Category selection */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 mb-1">
            Your Company Type
          </h3>
          <p className="text-xs text-slate-500 mb-3">
            Pre-selected from your registration. You can add more if needed.
          </p>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {CATEGORIES.map(({ value, description }) => (
              <label
                key={value}
                className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  selectedCategories.includes(value)
                    ? 'border-amber-500 bg-yellow-50 shadow-md'
                    : 'border-amber-200 hover:border-amber-400'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(value)}
                  onChange={() => toggleCategory(value)}
                  className="sr-only"
                />
                <h4 className={`text-base font-bold mb-1 ${
                  selectedCategories.includes(value) ? 'text-amber-900' : 'text-gray-700'
                }`}>
                  {value}
                </h4>
                <p className={`text-xs text-center ${
                  selectedCategories.includes(value) ? 'text-amber-700' : 'text-gray-500'
                }`}>
                  {description}
                </p>
              </label>
            ))}
          </div>
        </div>

        {/* Sectors for each selected category */}
        {selectedCategories.length === 0 && (
          <div className="py-6 text-center border-2 border-dashed border-amber-200 rounded-lg bg-amber-50">
            <p className="text-amber-700 font-medium text-sm">
              Select a company type above to see the relevant sectors
            </p>
          </div>
        )}

        {selectedCategories.map((category) => {
          const sectors = getSectorsByCategory(category);
          const colors = getCategoryColor(category);
          const selectedSectors: string[] = formData.sectorsServed?.[category] || [];
          const otherValue: string = formData.sectorsOther?.[category] || '';

          return (
            <div key={category} className={`${colors.bg} rounded-lg p-4 ${colors.border} border`}>
              <h3 className={`text-sm font-bold ${colors.text} mb-3`}>
                {category} — Sectors Served
              </h3>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
                {sectors.map((sector) => (
                  <label
                    key={sector}
                    className={`flex items-center p-2 border rounded-md cursor-pointer transition-all hover:bg-white text-xs ${
                      selectedSectors.includes(sector)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedSectors.includes(sector)}
                      onChange={(e) => {
                        const updated = e.target.checked
                          ? [...selectedSectors, sector]
                          : selectedSectors.filter((s) => s !== sector);
                        updateFormData({
                          sectorsServed: { ...formData.sectorsServed, [category]: updated },
                        });
                      }}
                      className="sr-only"
                    />
                    <div className={`w-3 h-3 flex-shrink-0 rounded border-2 mr-2 flex items-center justify-center ${
                      selectedSectors.includes(sector)
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-slate-300'
                    }`}>
                      {selectedSectors.includes(sector) && (
                        <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="font-medium leading-tight">{sector}</span>
                  </label>
                ))}
              </div>

              {selectedSectors.includes('Other') && (
                <div className="mt-3">
                  <FormInput
                    label={`Other ${category} sectors (comma-separated)`}
                    value={otherValue}
                    onChange={(value) =>
                      updateFormData({
                        sectorsOther: { ...formData.sectorsOther, [category]: value },
                      })
                    }
                    placeholder="e.g. Forestry, Maritime..."
                  />
                </div>
              )}
            </div>
          );
        })}

        {/* Summary */}
        {formData.sectorsServed && Object.values(formData.sectorsServed).some((arr) => arr.length > 0) && (
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <h4 className="mb-2 text-xs font-semibold text-slate-700">Selected Sectors Summary</h4>
            {Object.entries(formData.sectorsServed).map(([category, sectors]) =>
              sectors.length > 0 ? (
                <div key={category} className="mb-2">
                  <h5 className="text-xs font-bold text-slate-600 mb-1">{category}</h5>
                  <div className="flex flex-wrap gap-1">
                    {sectors.map((sector: string) => (
                      <span
                        key={sector}
                        className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded border border-blue-200 text-xs font-medium"
                      >
                        {sector}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null
            )}
          </div>
        )}
      </div>
    </FormStep>
  );
};

export default Step3SectorsServed;
