import React, { useState, useEffect } from 'react';
import { FormStep } from '../FormStep';
import { StepProps } from '../../types/form';
import { ADMIN_API, LAMBDA } from '../../../../../lib/apiConfig';

const Step3SectorsServed: React.FC<StepProps> = ({
  formData,
  updateFormData,
  onNext,
  onPrev,
  isValid,
}) => {
  const API_BASE = ADMIN_API ? `${ADMIN_API}/sectors-you-serve` : `${LAMBDA.adminSectors}`;
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


  // Load sectors from API on mount
  useEffect(() => {
    const normalize = async (res: Response) => {
      try {
        const json = await res.json();
        if (Array.isArray(json)) return json;
        if (json && Array.isArray(json.data)) return json.data;
        return [];
      } catch (e) {
        return [];
      }
    };

    const fetchAll = async () => {
      try {
        const [droneRes, aiRes, gisRes] = await Promise.all([
          fetch(`${API_BASE}/details/Drone`, { method: 'GET' }),
          fetch(`${API_BASE}/details/AI`, { method: 'GET' }),
          fetch(`${API_BASE}/details/GIS`, { method: 'GET' }),
        ]);
        const [drone, ai, gis] = await Promise.all([
          normalize(droneRes),
          normalize(aiRes),
          normalize(gisRes),
        ]);
        if (drone.length) setDroneSectors(drone);
        if (ai.length) setAiSectors(ai);
        if (gis.length) setGisSectors(gis);
        // (removed) no localStorage persistence for category lists
      } catch (error) {
        console.error('Error fetching sectors:', error);
      }
    };

    fetchAll();
    // Load sectors served from localStorage (keep previous behavior)
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
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setEditingIndex(null);
    setEditingValue('');
    setIsEditModalOpen(true);
  };

  const toApiCategory = (category: string) => {
    const lower = (category || '').toLowerCase();
    if (lower === 'drone') return 'Drone';
    if (lower === 'ai') return 'AI';
    if (lower === 'gis') return 'GIS';
    return category;
  };

  const syncCategoryState = (category: string, options: string[]) => {
    switch (category) {
      case 'Drone':
        setDroneSectors(options);
        break;
      case 'AI':
        setAiSectors(options);
        break;
      case 'GIS':
        setGisSectors(options);
        break;
    }
  };

  const handleAddOption = async () => {
    if (!newOption.trim() || !currentEditingCategory) return;
    setIsSubmitting(true);
    try {
      const apiCat = toApiCategory(currentEditingCategory);
      const res = await fetch(`${API_BASE}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectorsServed: { [apiCat]: [newOption.trim()] },
        }),
      });
      const json = await res.json();
      const updated = (json?.data && json.data[apiCat]) || [...editableOptions, newOption.trim()];
      setEditableOptions(updated);
      syncCategoryState(apiCat, updated);
      setNewOption('');
    } catch (e) {
      console.error('Add option failed:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveOption = async (index: number) => {
    if (!currentEditingCategory) return;
    const option = editableOptions[index];
    setIsSubmitting(true);
    try {
      const apiCat = toApiCategory(currentEditingCategory);
      const res = await fetch(`${API_BASE}/update/${apiCat}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ option }),
      });
      const json = await res.json();
      const updated: string[] = Array.isArray(json?.data) ? json.data : editableOptions.filter((_, i) => i !== index);
      setEditableOptions(updated);
      syncCategoryState(apiCat, updated);
      // If the deleted option was selected, remove from sectorsServed
      if (formData.sectorsServed.includes(option)) {
        const newSectors = formData.sectorsServed.filter((s) => s !== option);
        updateFormData({ sectorsServed: newSectors });
        localStorage.setItem('sectorsServed', JSON.stringify(newSectors));
      }
    } catch (e) {
      console.error('Delete option failed:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditingValue(editableOptions[index]);
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setEditingValue('');
  };

  const saveEditing = async () => {
    if (editingIndex === null || !currentEditingCategory) return;
    const oldOption = editableOptions[editingIndex];
    const newOptionValue = editingValue.trim();
    if (!newOptionValue || newOptionValue === oldOption) {
      cancelEditing();
      return;
    }
    setIsSubmitting(true);
    try {
      const apiCat = toApiCategory(currentEditingCategory);
      const res = await fetch(`${API_BASE}/update/${apiCat}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldOption, newOption: newOptionValue }),
      });
      const json = await res.json();
      const updated: string[] = Array.isArray(json?.data)
        ? json.data
        : editableOptions.map((opt, idx) => (idx === editingIndex ? newOptionValue : opt));
      setEditableOptions(updated);
      syncCategoryState(apiCat, updated);
      // If the option was selected, rename inside sectorsServed
      if (formData.sectorsServed.includes(oldOption)) {
        const newSectors = formData.sectorsServed.map((s) => (s === oldOption ? newOptionValue : s));
        updateFormData({ sectorsServed: newSectors });
        localStorage.setItem('sectorsServed', JSON.stringify(newSectors));
      }
    } catch (e) {
      console.error('Update option failed:', e);
    } finally {
      setIsSubmitting(false);
      cancelEditing();
    }
  };

  const handleSaveOptions = () => {
    if (!currentEditingCategory) return;
    switch (currentEditingCategory) {
      case 'Drone':
        setDroneSectors(editableOptions);
        break;
      case 'AI':
        setAiSectors(editableOptions);
        break;
      case 'GIS':
        setGisSectors(editableOptions);
        break;
    }
    setIsEditModalOpen(false);
  };

  // (removed) clearSectorsStorage — unused

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
        return { bg: 'bg-surface-main', text: 'text-brand-gold', border: 'border-brand-yellow-soft' };
      case 'AI':
        return { bg: 'bg-surface-main', text: 'text-brand-gold', border: 'border-brand-yellow-soft' };
      case 'GIS':
        return { bg: 'bg-brand-yellow-soft', text: 'text-brand-gold', border: 'border-brand-yellow-soft' };
      default:
        return { bg: 'bg-surface-main', text: 'text-brand-gold', border: 'border-brand-yellow-soft' };
    }
  };

  return (
    <FormStep
      title="Sectors You Serve "
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
              className="inline-flex gap-1 items-center px-2 py-1 text-xs rounded-lg border hover:bg-surface-card"
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
                      className={`flex items-center p-2 border rounded-md cursor-pointer transition-all hover:bg-ink-offwhite text-xs ${formData.sectorsServed.includes(sector)
                        ? 'border-status-info bg-status-info/10 text-status-info'
                        : 'border-ink-light'
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
                          ? 'border-status-info bg-status-info'
                          : 'border-ink-light'
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
          <div className="flex fixed inset-0 z-50 justify-center items-center backdrop-blur-sm bg-ink/60">
            <div className="bg-surface-card rounded-xl shadow-xl w-11/12 max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="p-6 border-b border-ink-light">
                <h3 className="flex gap-2 items-center text-xl font-bold text-ink">
                  ✏️ Edit {currentEditingCategory} Options
                </h3>
                <p className="mt-1 text-sm text-ink-caption">Add or remove options for {currentEditingCategory}</p>
              </div>

              {/* Modal Body */}
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
                            {editingIndex === index ? (
                              <div className="flex flex-1 gap-2 items-center">
                                <input
                                  className="flex-1 px-2 py-1 text-sm rounded border border-ink-light outline-none focus:ring-2 focus:ring-status-info focus:border-status-info"
                                  value={editingValue}
                                  onChange={(e) => setEditingValue(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') saveEditing();
                                    if (e.key === 'Escape') cancelEditing();
                                  }}
                                  autoFocus
                                />
                                <button
                                  type="button"
                                  className="px-2 py-1 text-xs text-white bg-status-info rounded hover:bg-status-info disabled:opacity-50"
                                  onClick={saveEditing}
                                  disabled={isSubmitting}
                                >
                                  Save
                                </button>
                                <button
                                  type="button"
                                  className="px-2 py-1 text-xs text-ink-paragraph rounded hover:text-ink"
                                  onClick={cancelEditing}
                                  disabled={isSubmitting}
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div className="flex flex-1 gap-2 items-center">
                                <span className="text-sm">{option}</span>
                                <button
                                  type="button"
                                  className="text-xs text-status-info hover:text-status-info"
                                  onClick={() => startEditing(index)}
                                  disabled={isSubmitting}
                                >
                                  ✏️ Edit
                                </button>
                              </div>
                            )}
                            <button
                              type="button"
                              className="text-status-error transition-colors hover:text-status-error"
                              onClick={() => handleRemoveOption(index)}
                              disabled={isSubmitting}
                            >
                              ❌
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="py-3 text-sm text-center text-ink-caption">No options added yet</p>
                    )}
                  </div>
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
                      ➕ Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
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
                  className="flex gap-1 items-center px-4 py-2 font-medium text-white bg-status-info rounded-lg transition-colors hover:bg-status-info"
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
