import React from 'react';
import { FormStep } from '../FormStep';
import { FormInput } from '../FormInput';
import { StepProps } from '../../types/form';

const Step3SectorsServed: React.FC<StepProps> = ({
  formData,
  updateFormData,
  onNext,
  onPrev,
  onSkip, // Add this line
  showSkip, // Add this line
  isValid,
}) => {
  // Drone-specific sectors
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
    "Training",
    'Other'
  ];

  // AI-specific sectors
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
        "Training",

    'Other'
  ];

  // GIS-specific sectors
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
        "Training",

    'Other'
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
      case 'Drone': return { bg: 'bg-yellow-50', text: 'text-amber-900', border: 'border-amber-200' };
      case 'AI': return { bg: 'bg-amber-50', text: 'text-amber-900', border: 'border-amber-200' };
      case 'GIS': return { bg: 'bg-yellow-100', text: 'text-amber-900', border: 'border-amber-200' };
      default: return { bg: 'bg-yellow-50', text: 'text-amber-900', border: 'border-amber-200' };
    }
  };

  return (
     <FormStep
      title="Sectors You Serve"
      description="Select the industries and sectors your company serves"
      onNext={onNext}
      onPrev={onPrev}
      onSkip={onSkip} // Add this line
      showSkip={showSkip} // Add this line
      isValid={isValid}
      currentStep={2}
      totalSteps={6}
    >
      <div className="space-y-6">
        {formData.companyCategory.map((category) => {
          const sectors = getSectorsByCategory(category);
          const colors = getCategoryColor(category);

          // Ensure structure exists
          const selectedSectors = formData.sectorsServed?.[category] || [];
          const otherValue = formData.sectorsOther?.[category] || "";

          if (sectors.length === 0) return null;

          return (
            <div key={category} className={`${colors.bg} rounded-lg p-3 ${colors.border} border`}>
              <h3 className={`text-sm font-bold ${colors.text} mb-2`}>
                {category} - Sectors Served
              </h3>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
                {sectors.map((sector) => (
                  <label
                    key={sector}
                    className={`flex items-center p-2 border rounded-md cursor-pointer transition-all hover:bg-slate-50 text-xs ${
                      selectedSectors.includes(sector)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedSectors.includes(sector)}
                      onChange={(e) => {
                        let updated = [...selectedSectors];
                        if (e.target.checked) {
                          updated.push(sector);
                        } else {
                          updated = updated.filter(s => s !== sector);
                        }
                        updateFormData({
                          sectorsServed: {
                            ...formData.sectorsServed,
                            [category]: updated,
                          },
                        });
                      }}
                      className="sr-only"
                    />
                    <div className={`w-3 h-3 rounded border-2 mr-2 flex items-center justify-center ${
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

              {/* Other input for each category */}
              {selectedSectors.includes('Other') && (
                <div className="mt-3">
                  <FormInput
                    label={`Please specify other ${category} sectors (comma-separated)`}
                    value={otherValue}
                    onChange={(value) =>
                      updateFormData({
                        sectorsOther: {
                          ...formData.sectorsOther,
                          [category]: value,
                        },
                      })
                    }
                    placeholder="Enter other sectors..."
                  />
                </div>
              )}
            </div>
          );
        })}

        {formData.companyCategory.length === 0 && (
          <div className="py-4 text-center">
            <p className="text-slate-500">Please select company categories in the previous step first</p>
          </div>
        )}

        {/* Summary */}
        {formData.sectorsServed && Object.values(formData.sectorsServed).some(arr => arr.length > 0) && (
          <div className="p-2 rounded-lg bg-slate-50">
            <h4 className="mb-2 text-xs font-semibold text-slate-800">Selected Sectors Summary</h4>
            {Object.entries(formData.sectorsServed).map(([category, sectors]) => (
              <div key={category} className="mb-2">
                <h5 className="text-xs font-bold text-slate-700">{category}</h5>
                <div className="flex flex-wrap gap-2">
                  {sectors.map((sector: string) => (
                    <span
                      key={sector}
                      className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded border border-blue-200 text-xs font-medium"
                    >
                      {sector}
                    </span>
                  ))}
                </div>

                {formData.sectorsOther?.[category] && formData.sectorsOther[category].trim() && (
                  <div className="mt-1">
                    <h6 className="mb-1 text-xs font-semibold text-slate-700">Custom Sectors:</h6>
                    <div className="flex flex-wrap gap-2">
                      {formData.sectorsOther[category].split(',').map((item, index) => {
                        const trimmedItem = item.trim();
                        if (!trimmedItem) return null;
                        return (
                          <span
                            key={index}
                            className="px-2 py-0.5 bg-green-100 text-green-800 rounded border border-green-200 text-xs font-medium"
                          >
                            {trimmedItem}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </FormStep>
  );
};

export default Step3SectorsServed;
