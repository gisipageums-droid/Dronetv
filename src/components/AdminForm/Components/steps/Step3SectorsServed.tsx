import React, { useState, useEffect } from 'react';
import { FormStep } from '../FormStep';
import { FormInput } from '../FormInput';
import { StepProps } from '../../types/form';

const Step3SectorsServed: React.FC<StepProps> = ({
  formData,
  updateFormData,
  onNext,
  onPrev,
  isValid,
}) => {
  const initialDroneSectors = [
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
    'Other',
  ];

  const initialAiSectors = [
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
    'Other',
  ];

  const initialGisSectors = [
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
    'Other',
  ];

  const [droneSectors, setDroneSectors] = useState(initialDroneSectors);
  const [aiSectors, setAiSectors] = useState(initialAiSectors);
  const [gisSectors, setGisSectors] = useState(initialGisSectors);

  // Load sectors from localStorage on component mount
  useEffect(() => {
    // Load drone sectors
    const savedDroneSectors = localStorage.getItem('droneSectors');
    if (savedDroneSectors) {
      try {
        const parsed = JSON.parse(savedDroneSectors);
        setDroneSectors(parsed);
      } catch (error) {
        console.error('Error parsing saved drone sectors:', error);
      }
    }

    // Load AI sectors
    const savedAiSectors = localStorage.getItem('aiSectors');
    if (savedAiSectors) {
      try {
        const parsed = JSON.parse(savedAiSectors);
        setAiSectors(parsed);
      } catch (error) {
        console.error('Error parsing saved AI sectors:', error);
      }
    }

    // Load GIS sectors
    const savedGisSectors = localStorage.getItem('gisSectors');
    if (savedGisSectors) {
      try {
        const parsed = JSON.parse(savedGisSectors);
        setGisSectors(parsed);
      } catch (error) {
        console.error('Error parsing saved GIS sectors:', error);
      }
    }

    // Load sectors served from form data
    const savedSectorsServed = localStorage.getItem('sectorsServed');
    if (savedSectorsServed) {
      try {
        const parsed = JSON.parse(savedSectorsServed);
        updateFormData({ sectorsServed: parsed });
      } catch (error) {
        console.error('Error parsing saved sectors served:', error);
      }
    }
  }, []);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditingCategory, setCurrentEditingCategory] = useState<string | null>(null);
  const [editableOptions, setEditableOptions] = useState<string[]>([]);
  const [newOption, setNewOption] = useState('');

  const openEditModal = (category: string) => {
    setCurrentEditingCategory(category);
    switch (category) {
      case 'Drone':
        setEditableOptions([...droneSectors]);
        break;
      case 'AI':
        setEditableOptions([...aiSectors]);
        break;
      case 'GIS':
        setEditableOptions([...gisSectors]);
        break;
      default:
        setEditableOptions([]);
    }
    setNewOption('');
    setIsEditModalOpen(true);
  };

  const handleAddOption = () => {
    if (!newOption.trim()) return;
    setEditableOptions([...editableOptions, newOption.trim()]);
    setNewOption('');
  };

  const handleRemoveOption = (index: number) => {
    setEditableOptions(editableOptions.filter((_, i) => i !== index));
  };

  const handleSaveOptions = () => {
    if (!currentEditingCategory) return;
    switch (currentEditingCategory) {
      case 'Drone':
        setDroneSectors(editableOptions);
        // Save to localStorage
        localStorage.setItem('droneSectors', JSON.stringify(editableOptions));
        break;
      case 'AI':
        setAiSectors(editableOptions);
        // Save to localStorage
        localStorage.setItem('aiSectors', JSON.stringify(editableOptions));
        break;
      case 'GIS':
        setGisSectors(editableOptions);
        // Save to localStorage
        localStorage.setItem('gisSectors', JSON.stringify(editableOptions));
        break;
    }
    setIsEditModalOpen(false);
  };

  // Function to clear localStorage (optional - for cleanup)
  const clearSectorsStorage = () => {
    localStorage.removeItem('droneSectors');
    localStorage.removeItem('aiSectors');
    localStorage.removeItem('gisSectors');
    localStorage.removeItem('sectorsServed');
  };

  const getSectorsByCategory = (category: string) => {
    switch (category) {
      case 'Drone':
        return droneSectors;
      case 'AI':
        return aiSectors;
      case 'GIS':
        return gisSectors;
      default:
        return [];
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Drone':
        return { bg: 'bg-yellow-50', text: 'text-amber-900', border: 'border-amber-200' };
      case 'AI':
        return { bg: 'bg-amber-50', text: 'text-amber-900', border: 'border-amber-200' };
      case 'GIS':
        return { bg: 'bg-yellow-100', text: 'text-amber-900', border: 'border-amber-200' };
      default:
        return { bg: 'bg-yellow-50', text: 'text-amber-900', border: 'border-amber-200' };
    }
  };

  return (
    <FormStep
      title="Sectors You Serve"
      description="Select the industries and sectors your company serves"
      onNext={onNext}
      onPrev={onPrev}
      isValid={isValid}
      currentStep={2}
      totalSteps={6}
    >
      <div className="space-y-4">
        {/* Edit Options Buttons */}
        <div className="flex gap-2 justify-end">
          {formData.companyCategory.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => openEditModal(cat)}
              className="inline-flex gap-1 items-center px-2 py-1 text-xs rounded-lg border hover:bg-white"
            >
              ✏️ Edit {cat} Options
            </button>
          ))}
        </div>

        {/* Main Selection */}
        <div className="space-y-6">
          {formData.companyCategory.map((category) => {
            const sectors = getSectorsByCategory(category);
            const colors = getCategoryColor(category);
            if (sectors.length === 0) return null;
            return (
              <div key={category} className={`${colors.bg} rounded-lg p-3 ${colors.border} border`}>
                <h3 className={`text-sm font-bold ${colors.text} mb-2`}>{category} - Sectors Served</h3>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
                  {sectors.map((sector) => (
                    <label
                      key={sector}
                      className={`flex items-center p-2 border rounded-md cursor-pointer transition-all hover:bg-slate-50 text-xs ${formData.sectorsServed.includes(sector)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-slate-300'
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.sectorsServed.includes(sector)}
                        onChange={(e) => {
                          let newSectorsServed;
                          if (e.target.checked) {
                            newSectorsServed = [...formData.sectorsServed, sector];
                          } else {
                            newSectorsServed = formData.sectorsServed.filter((s) => s !== sector);
                          }
                          updateFormData({ sectorsServed: newSectorsServed });
                          // Save to localStorage
                          localStorage.setItem('sectorsServed', JSON.stringify(newSectorsServed));
                        }}
                        className="sr-only"
                      />
                      <div
                        className={`w-3 h-3 rounded border-2 mr-2 flex items-center justify-center ${formData.sectorsServed.includes(sector)
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-slate-300'
                          }`}
                      >
                        {formData.sectorsServed.includes(sector) && (
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
              </div>
            );
          })}
        </div>

        {/* Edit Modal */}
        {isEditModalOpen && (
          <div className="flex fixed inset-0 z-50 justify-center items-center backdrop-blur-sm bg-black/60">
            <div className="bg-white rounded-xl shadow-xl w-11/12 max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200">
                <h3 className="flex gap-2 items-center text-xl font-bold text-gray-900">
                  ✏️ Edit {currentEditingCategory} Options
                </h3>
                <p className="mt-1 text-sm text-gray-500">Add or remove options for {currentEditingCategory}</p>
              </div>

              {/* Modal Body */}
              <div className="overflow-y-auto flex-1 p-6">
                <div className="mb-6">
                  <h4 className="mb-3 font-medium text-gray-700">Current Options</h4>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    {editableOptions.length > 0 ? (
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {editableOptions.map((option, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center px-3 py-2 bg-white rounded-lg border border-gray-200"
                          >
                            <span className="text-sm">{option}</span>
                            <button
                              type="button"
                              className="text-red-500 transition-colors hover:text-red-700"
                              onClick={() => handleRemoveOption(index)}
                            >
                              ❌
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="py-3 text-sm text-center text-gray-500">No options added yet</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="mb-3 font-medium text-gray-700">Add New Option</h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter new option"
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={newOption}
                      onChange={(e) => setNewOption(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddOption()}
                    />
                    <button
                      type="button"
                      className="flex gap-1 items-center px-4 py-2 text-white bg-blue-500 rounded-lg transition-colors hover:bg-blue-600"
                      onClick={handleAddOption}
                    >
                      ➕ Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 justify-end p-6 bg-gray-50 border-t border-gray-200">
                <button
                  type="button"
                  className="px-4 py-2 font-medium text-gray-700 rounded-lg transition-colors hover:text-gray-900"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="flex gap-1 items-center px-4 py-2 font-medium text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700"
                  onClick={handleSaveOptions}
                >
                  ✅ Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </FormStep>
  );
};

export default Step3SectorsServed;
