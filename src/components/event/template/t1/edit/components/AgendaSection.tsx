import React, { useState, useEffect, useCallback } from "react";
import {
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
} from "lucide-react";

interface Theme {
  title: string;
  note: string;
  bullets: string[];
}

interface AgendaContent {
  title: string;
  titleHighlight: string;
  subtitle: string;
  themes: {
    [key: string]: Theme;
  };
}

interface AgendaSectionProps {
  agendaData?: AgendaContent;
  onStateChange?: (data: AgendaContent) => void;
}

/** Default data structure */
const defaultAgendaContent: AgendaContent = {
  title: "Event",
  titleHighlight: "Themes",
  subtitle: "Each day focuses on a powerful industry-relevant theme.",
  themes: {
    1: {
      title: "Theme 1",
      note: "Theme description or note",
      bullets: [
        "Key point 1",
        "Key point 2",
        "Key point 3"
      ],
    },
    2: {
      title: "Theme 2",
      note: "",
      bullets: [
        "Key point 1",
        "Key point 2"
      ],
    },
    3: {
      title: "Theme 3",
      note: "",
      bullets: [
        "Key point 1"
      ],
    },
  },
};

const AgendaSection: React.FC<AgendaSectionProps> = ({ agendaData, onStateChange }) => {
  const [activeDay, setActiveDay] = useState(1);
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Auto-save timeout reference
  const autoSaveTimeoutRef = React.useRef<NodeJS.Timeout>();

  const [agendaContent, setAgendaContent] = useState<AgendaContent>(defaultAgendaContent);
  const [backupContent, setBackupContent] = useState<AgendaContent>(defaultAgendaContent);
  const [editForm, setEditForm] = useState<Theme | null>(null);

  // Update local state when prop data changes
  useEffect(() => {
    if (agendaData) {
      setAgendaContent(agendaData);
      setBackupContent(agendaData);
      // Set edit form to current active day's theme if available
      if (agendaData.themes[activeDay]) {
        setEditForm(agendaData.themes[activeDay]);
      }
    }
  }, [agendaData, activeDay]);

  // Auto-save function
  const autoSave = useCallback(async () => {
    if (!onStateChange || !editMode) return;

    setIsSaving(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onStateChange(agendaContent);
    setLastSaved(new Date());
    setIsSaving(false);
  }, [agendaContent, editMode, onStateChange]);

  // Debounced auto-save effect
  useEffect(() => {
    if (editMode && onStateChange) {
      // Clear existing timeout
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      // Set new timeout for auto-save (1 second debounce)
      autoSaveTimeoutRef.current = setTimeout(() => {
        autoSave();
      }, 1000);

      // Cleanup timeout on unmount or when dependencies change
      return () => {
        if (autoSaveTimeoutRef.current) {
          clearTimeout(autoSaveTimeoutRef.current);
        }
      };
    }
  }, [agendaContent, editMode, autoSave, onStateChange]);

  const handleEditToggle = () => {
    if (!editMode) {
      setBackupContent(agendaContent);
      setEditForm({ ...agendaContent.themes[activeDay] });
    }
    setEditMode(!editMode);
  };

  const handleCancel = () => {
    setAgendaContent(backupContent);
    if (onStateChange) {
      onStateChange(backupContent); // Sync with parent
    }
    setEditMode(false);
    setEditForm(null);
  };

  // Add new day
  const handleAddDay = () => {
    const dayKeys = Object.keys(agendaContent.themes).map(Number);
    const newDayNumber = dayKeys.length > 0 ? Math.max(...dayKeys) + 1 : 1;
    const newDay: Theme = {
      title: `Day ${newDayNumber} Theme`,
      note: "New theme description",
      bullets: ["New bullet point"],
    };

    const updatedContent = {
      ...agendaContent,
      themes: {
        ...agendaContent.themes,
        [newDayNumber]: newDay,
      },
    };

    setAgendaContent(updatedContent);
    setActiveDay(newDayNumber);
    setEditForm(newDay);
  };

  // Remove day
  const handleRemoveDay = (dayToRemove: number) => {
    const { [dayToRemove]: _, ...remainingThemes } = agendaContent.themes;
    const dayKeys = Object.keys(remainingThemes).map(Number);

    if (dayKeys.length === 0) return; // Don't remove if it's the last day

    const updatedContent = {
      ...agendaContent,
      themes: remainingThemes,
    };

    setAgendaContent(updatedContent);

    // Set active day to first available day if current day was removed
    if (activeDay === dayToRemove) {
      const firstDay = Math.min(...dayKeys);
      setActiveDay(firstDay);
      setEditForm({ ...remainingThemes[firstDay] });
    }
  };

  // Handle input changes for title and note
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => (prev ? { ...prev, [name]: value } : null));
    
    // Update main content immediately for auto-save
    if (editForm) {
      const updatedThemes = {
        ...agendaContent.themes,
        [activeDay]: { ...editForm, [name]: value },
      };
      setAgendaContent({ ...agendaContent, themes: updatedThemes });
    }
  };

  // Handle changes for a specific bullet point
  const handleBulletChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (!editForm) return;
    
    const newBullets = [...editForm.bullets];
    newBullets[index] = e.target.value;
    setEditForm((prev) => (prev ? { ...prev, bullets: newBullets } : null));
    
    // Update main content immediately for auto-save
    const updatedThemes = {
      ...agendaContent.themes,
      [activeDay]: { ...editForm, bullets: newBullets },
    };
    setAgendaContent({ ...agendaContent, themes: updatedThemes });
  };

  // Add a new bullet point
  const handleAddBullet = () => {
    if (!editForm) return;
    
    const newBullets = [...editForm.bullets, ""];
    setEditForm((prev) => (prev ? { ...prev, bullets: newBullets } : null));
    
    // Update main content immediately for auto-save
    const updatedThemes = {
      ...agendaContent.themes,
      [activeDay]: { ...editForm, bullets: newBullets },
    };
    setAgendaContent({ ...agendaContent, themes: updatedThemes });
  };

  // Remove a bullet point
  const handleRemoveBullet = (index: number) => {
    if (!editForm) return;
    
    const newBullets = editForm.bullets.filter((_, i) => i !== index);
    setEditForm((prev) => (prev ? { ...prev, bullets: newBullets } : null));
    
    // Update main content immediately for auto-save
    const updatedThemes = {
      ...agendaContent.themes,
      [activeDay]: { ...editForm, bullets: newBullets },
    };
    setAgendaContent({ ...agendaContent, themes: updatedThemes });
  };

  // Save changes to the main state and exit edit mode
  const handleSave = () => {
    if (!editForm) return;
    
    const updatedThemes = {
      ...agendaContent.themes,
      [activeDay]: editForm,
    };
    
    const updatedContent = { ...agendaContent, themes: updatedThemes };
    
    setAgendaContent(updatedContent);
    setEditMode(false);
    setEditForm(null);
  };

  // Update header fields
  const updateHeaderField = (field: keyof Pick<AgendaContent, 'title' | 'titleHighlight' | 'subtitle'>, value: string) => {
    setAgendaContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Render the themes based on the current mode
  const renderThemeContent = () => {
    const theme = editMode && editForm ? editForm : agendaContent.themes[activeDay];

    if (!theme) {
      return null;
    }

    if (editMode) {
      return (
        <div className="space-y-6">
          <div>
            <input
              type="text"
              name="title"
              value={theme.title}
              onChange={handleInputChange}
              maxLength={100}
              className="w-full text-xl md:text-2xl font-bold text-black border-b border-gray-300 focus:outline-none focus:border-[#FF0000] transition-colors bg-transparent text-center"
            />
            <div className="text-sm text-gray-500 text-right mt-1">
              {theme.title.length}/100
            </div>
          </div>
          <div>
            <input
              type="text"
              name="note"
              value={theme.note}
              onChange={handleInputChange}
              maxLength={200}
              className="w-full text-sm text-gray-500 font-medium border-b border-gray-300 focus:outline-none focus:border-blue-400 transition-colors bg-transparent text-center"
              placeholder="Optional Note"
            />
            <div className="text-sm text-gray-500 text-right mt-1">
              {theme.note.length}/200
            </div>
          </div>
          <ul className="text-left list-none space-y-4 text-gray-700 text-base">
            {theme.bullets.map((point, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <div className="flex-1">
                  <input
                    type="text"
                    value={point}
                    onChange={(e) => handleBulletChange(e, idx)}
                    maxLength={500}
                    className="w-full p-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <div className="text-xs text-gray-500 text-right mt-1">
                    {point.length}/500
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveBullet(idx)}
                  className="p-1 text-red-500 hover:bg-red-100 rounded-full"
                  title="Remove bullet"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
            <li className="flex justify-center mt-4">
              <button
                onClick={handleAddBullet}
                className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors shadow-md"
              >
                <Plus size={16} /> Add Bullet
              </button>
            </li>
          </ul>
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 transition-colors shadow-lg"
            >
              <Save size={18} /> Done
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-full font-semibold hover:bg-gray-600 transition-colors shadow-lg"
            >
              <X size={18} /> Cancel
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="text-center">
        <h3 className="text-xl md:text-2xl font-bold text-black mb-2">
          {theme.title}
        </h3>
        {theme.note && (
          <p className="text-sm text-gray-500 font-medium mb-4">{theme.note}</p>
        )}
        <ul className="text-left list-disc list-inside space-y-3 text-gray-700 text-base">
          {theme.bullets.map((point, idx) => (
            <li key={idx}>{point}</li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <section id="agenda" className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-7xl relative">
        <div className="text-center mb-12 relative">
          {/* Edit/Save/Cancel Buttons */}
          <div className="absolute top-0 right-0 flex gap-3 items-center">
            {/* Auto-save status */}
            {editMode && onStateChange && (
              <div className="text-sm text-gray-600 mr-2 bg-gray-100 px-3 py-1 rounded-lg hidden sm:block">
                {isSaving ? (
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    Saving...
                  </span>
                ) : lastSaved ? (
                  <span>Auto-saved {lastSaved.toLocaleTimeString()}</span>
                ) : null}
              </div>
            )}
            
            {editMode ? (
              <>
                <button
                  onClick={handleEditToggle}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg border border-green-700 hover:bg-green-700 transition"
                >
                  <Save size={18} /> Done
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg border border-red-700 hover:bg-red-700 transition"
                >
                  <X size={18} /> Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleEditToggle}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg border border-blue-700 hover:bg-blue-700 transition"
              >
                <Edit size={18} /> Edit
              </button>
            )}
          </div>

          {editMode ? (
            <>
              <div className="flex items-center justify-center gap-2 mb-4">
                <div>
                  <input
                    type="text"
                    value={agendaContent.title}
                    onChange={(e) => updateHeaderField('title', e.target.value)}
                    maxLength={100}
                    className="text-4xl md:text-5xl font-bold text-black bg-transparent border-b-2 border-gray-300 focus:border-blue-500 outline-none text-center"
                  />
                  <div className="text-sm text-gray-500 text-right mt-1">
                    {agendaContent.title.length}/100
                  </div>
                </div>
                <div>
                  <input
                    type="text"
                    value={agendaContent.titleHighlight}
                    onChange={(e) => updateHeaderField('titleHighlight', e.target.value)}
                    maxLength={50}
                    className="text-4xl md:text-5xl font-bold text-[#FF0000] bg-transparent border-b-2 border-gray-300 focus:border-blue-500 outline-none text-center"
                  />
                  <div className="text-sm text-gray-500 text-right mt-1">
                    {agendaContent.titleHighlight.length}/50
                  </div>
                </div>
              </div>
              <div className="w-24 h-1 bg-[#FFD400] mx-auto mb-4"></div>
              <div className="max-w-2xl mx-auto">
                <textarea
                  value={agendaContent.subtitle}
                  onChange={(e) => updateHeaderField('subtitle', e.target.value)}
                  maxLength={200}
                  className="text-gray-600 text-lg bg-transparent border-2 border-gray-300 focus:border-blue-500 outline-none p-2 rounded-md w-full resize-none"
                  rows={2}
                />
                <div className="text-sm text-gray-500 text-right mt-1">
                  {agendaContent.subtitle.length}/200
                </div>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
                {agendaContent.title}{" "}
                <span className="text-[#FF0000]">
                  {agendaContent.titleHighlight}
                </span>
              </h2>
              <div className="w-24 h-1 bg-[#FFD400] mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                {agendaContent.subtitle}
              </p>
            </>
          )}
        </div>

        {/* Day Tabs */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-4">
            <div className="flex bg-gray-100 rounded-full p-2 shadow-md">
              {Object.keys(agendaContent.themes).map((day) => {
                const dayNum = parseInt(day);
                return (
                  <div key={day} className="relative flex items-center">
                    <button
                      onClick={() => {
                        setActiveDay(dayNum);
                        if (editMode) {
                          setEditForm({ ...agendaContent.themes[dayNum] });
                        }
                      }}
                      className={`px-6 py-2 rounded-full text-sm md:text-base font-semibold transition-all duration-300 ${
                        activeDay === dayNum
                          ? "bg-[#FF0000] text-white shadow-lg"
                          : "text-gray-700 hover:text-[#FF0000]"
                      }`}
                      disabled={editMode}
                    >
                      Day {day}
                    </button>
                    {editMode &&
                      Object.keys(agendaContent.themes).length > 1 && (
                        <button
                          onClick={() => handleRemoveDay(dayNum)}
                          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors flex items-center justify-center"
                          title="Remove Day"
                        >
                          ×
                        </button>
                      )}
                  </div>
                );
              })}
            </div>
            {editMode && (
              <button
                onClick={handleAddDay}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-md"
                title="Add New Day"
              >
                <Plus size={16} />
                Add Day
              </button>
            )}
          </div>
        </div>

        {/* Theme Box */}
        <div className="max-w-3xl mx-auto bg-gray-100 rounded-3xl shadow-lg p-8">
          {renderThemeContent()}
        </div>
      </div>
    </section>
  );
};

export default AgendaSection;