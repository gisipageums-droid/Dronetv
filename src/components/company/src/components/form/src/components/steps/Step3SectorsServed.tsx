import React, { useState, useEffect } from 'react';
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
    case 'Drone': return { bg: 'bg-surface-main', text: 'text-brand-gold', border: 'border-brand-yellow-soft' };
    case 'AI': return { bg: 'bg-status-info/10', text: 'text-status-info', border: 'border-status-info/25' };
    case 'GIS': return { bg: 'bg-status-success/10', text: 'text-status-success', border: 'border-status-success/25' };
    default: return { bg: 'bg-surface-main', text: 'text-brand-gold', border: 'border-brand-yellow-soft' };
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
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(selectedCategories)
  );

  useEffect(() => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      selectedCategories.forEach((c) => next.add(c));
      return next;
    });
  }, [selectedCategories.join(',')]);

  const toggleCategory = (value: string) => {
    const updated = selectedCategories.includes(value)
      ? selectedCategories.filter((c) => c !== value)
      : [...selectedCategories, value];
    updateFormData({ companyCategory: updated });
  };

  const toggleExpanded = (category: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
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
      <div className="space-y-4">

        {/* Category selection */}
        <div>
          <h3 className="text-sm font-bold text-ink-charcoal mb-1">
            Your Company Type
          </h3>
          <p className="text-xs text-ink-caption mb-3">
            Pre-selected from your registration. You can add more if needed.
          </p>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {CATEGORIES.map(({ value, description }) => {
              const isSelected = selectedCategories.includes(value);
              return (
                <label
                  key={value}
                  className={`relative flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'border-brand-gold bg-surface-main shadow-md ring-2 ring-brand-yellow-soft'
                      : 'border-ink-light bg-surface-card hover:border-brand-yellow-soft hover:shadow-sm'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleCategory(value)}
                    className="sr-only"
                  />
                  <div className={`absolute top-3 right-3 w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                    isSelected ? 'border-brand-gold bg-brand-gold' : 'border-ink-light bg-surface-card'
                  }`}>
                    {isSelected && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <h4 className={`text-base font-bold mb-1 ${isSelected ? 'text-brand-gold' : 'text-ink-paragraph'}`}>
                    {value}
                  </h4>
                  <p className={`text-xs text-center ${isSelected ? 'text-brand-gold' : 'text-ink-caption'}`}>
                    {description}
                  </p>
                </label>
              );
            })}
          </div>
        </div>

        {/* Sectors for each selected category — accordion panels */}
        {selectedCategories.length === 0 && (
          <div className="py-6 text-center border-2 border-dashed border-brand-yellow-soft rounded-lg bg-surface-main">
            <p className="text-brand-gold font-medium text-sm">
              Select a company type above to see the relevant sectors
            </p>
          </div>
        )}

        {selectedCategories.map((category) => {
          const sectors = getSectorsByCategory(category);
          const colors = getCategoryColor(category);
          const selectedSectors: string[] = formData.sectorsServed?.[category] || [];
          const otherValue: string = formData.sectorsOther?.[category] || '';
          const isOpen = expandedCategories.has(category);

          return (
            <div key={category} className={`rounded-xl border-2 overflow-hidden transition-all duration-200 ${colors.border}`}>
              {/* Accordion header */}
              <button
                type="button"
                onClick={() => toggleExpanded(category)}
                className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                  isOpen ? `${colors.bg}` : 'bg-surface-card hover:bg-ink-offwhite'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${colors.text}`}>{category} — Sectors Served</span>
                  {selectedSectors.length > 0 && (
                    <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-brand-yellow-soft text-brand-gold">
                      {selectedSectors.length} selected
                    </span>
                  )}
                </div>
                <svg
                  className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${colors.text} ${isOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Accordion body */}
              {isOpen && (
                <div className={`px-4 pb-4 pt-2 ${colors.bg} animate-step-slide-up`}>
                  <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
                    {sectors.map((sector) => (
                      <label
                        key={sector}
                        className={`flex items-center p-2 border rounded-md cursor-pointer transition-all hover:bg-surface-card text-xs ${
                          selectedSectors.includes(sector)
                            ? 'border-status-info bg-status-info/10 text-status-info'
                            : 'border-ink-light bg-surface-card text-ink-charcoal'
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
                            ? 'border-status-info bg-status-info'
                            : 'border-ink-light'
                        }`}>
                          {selectedSectors.includes(sector) && (
                            <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
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
              )}
            </div>
          );
        })}

        {/* Summary */}
        {formData.sectorsServed && Object.values(formData.sectorsServed).some((arr) => arr.length > 0) && (
          <div className="p-3 rounded-lg bg-ink-offwhite border border-ink-light">
            <h4 className="mb-2 text-xs font-semibold text-ink-paragraph">Selected Sectors Summary</h4>
            {Object.entries(formData.sectorsServed).map(([category, sectors]) =>
              sectors.length > 0 ? (
                <div key={category} className="mb-2">
                  <h5 className="text-xs font-bold text-ink-paragraph mb-1">{category}</h5>
                  <div className="flex flex-wrap gap-1">
                    {sectors.map((sector: string) => (
                      <span
                        key={sector}
                        className="px-2 py-0.5 bg-status-info/15 text-status-info rounded border border-status-info/25 text-xs font-medium"
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
