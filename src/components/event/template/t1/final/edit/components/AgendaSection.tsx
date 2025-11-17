import React, { useState, useEffect } from "react";
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

  const handleEditToggle = () => {
    if (!editMode) {
      setBackupContent(agendaContent);
      setEditForm({ ...agendaContent.themes[activeDay] });
    } else {
      // When saving, call onStateChange to update parent component
      if (onStateChange) {
        onStateChange(agendaContent);
      }
    }
    setEditMode(!editMode);
  };

  const handleCancel = () => {
    setAgendaContent(backupContent);
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
    if (onStateChange) {
      onStateChange(updatedContent);
    }
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
    if (onStateChange) {
      onStateChange(updatedContent);
    }

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
  };

  // Handle changes for a specific bullet point
  const handleBulletChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (!editForm) return;
    
    const newBullets = [...editForm.bullets];
    newBullets[index] = e.target.value;
    setEditForm((prev) => (prev ? { ...prev, bullets: newBullets } : null));
  };

  // Add a new bullet point
  const handleAddBullet = () => {
    if (!editForm) return;
    
    setEditForm((prev) => (prev ? { ...prev, bullets: [...prev.bullets, ""] } : null));
  };

  // Remove a bullet point
  const handleRemoveBullet = (index: number) => {
    if (!editForm) return;
    
    const newBullets = editForm.bullets.filter((_, i) => i !== index);
    setEditForm((prev) => (prev ? { ...prev, bullets: newBullets } : null));
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
    if (onStateChange) {
      onStateChange(updatedContent);
    }
    setEditMode(false);
    setEditForm(null);
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
          <input
            type="text"
            name="title"
            value={theme.title}
            onChange={handleInputChange}
            className="w-full text-xl md:text-2xl font-bold text-black border-b border-gray-300 focus:outline-none focus:border-[#FF0000] transition-colors bg-transparent text-center"
          />
          <input
            type="text"
            name="note"
            value={theme.note}
            onChange={handleInputChange}
            className="w-full text-sm text-gray-500 font-medium border-b border-gray-300 focus:outline-none focus:border-blue-400 transition-colors bg-transparent text-center"
            placeholder="Optional Note"
          />
          <ul className="text-left list-none space-y-4 text-gray-700 text-base">
            {theme.bullets.map((point, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={point}
                  onChange={(e) => handleBulletChange(e, idx)}
                  className="w-full p-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
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
              <Save size={18} /> Save
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
          <div className="absolute top-0 right-0 flex gap-3">
            {editMode ? (
              <>
                <button
                  onClick={handleEditToggle}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg border border-green-700 hover:bg-green-700 transition"
                >
                  <Save size={18} /> Save
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
                <input
                  type="text"
                  value={agendaContent.title}
                  onChange={(e) =>
                    setAgendaContent({
                      ...agendaContent,
                      title: e.target.value,
                    })
                  }
                  className="text-4xl md:text-5xl font-bold text-black bg-transparent border-b-2 border-gray-300 focus:border-blue-500 outline-none text-center"
                />
                <input
                  type="text"
                  value={agendaContent.titleHighlight}
                  onChange={(e) =>
                    setAgendaContent({
                      ...agendaContent,
                      titleHighlight: e.target.value,
                    })
                  }
                  className="text-4xl md:text-5xl font-bold text-[#FF0000] bg-transparent border-b-2 border-gray-300 focus:border-blue-500 outline-none text-center"
                />
              </div>
              <div className="w-24 h-1 bg-[#FFD400] mx-auto mb-4"></div>
              <textarea
                value={agendaContent.subtitle}
                onChange={(e) =>
                  setAgendaContent({
                    ...agendaContent,
                    subtitle: e.target.value,
                  })
                }
                className="text-gray-600 text-lg max-w-2xl mx-auto bg-transparent border-2 border-gray-300 focus:border-blue-500 outline-none p-2 rounded-md w-full resize-none"
                rows={2}
              />
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