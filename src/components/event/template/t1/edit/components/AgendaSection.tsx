import React, { useState } from "react";
import { Save, X, Plus, Trash2, Edit } from "lucide-react";

const initialAgendaThemes = {
  1: {
    title: "Theme: Defence & Homeland Security",
    note: "(Sessions conducted by Rashtriya Raksha University as Knowledge Partner)",
    bullets: [
      "The role of drones in security, surveillance, and defense operations",
      "Perspectives from military, law enforcement, and intelligence agencies",
      "UAV integration in counter-terrorism, border security, and critical infrastructure protection",
    ],
  },
  2: {
    title: "Theme: Smart City, GIS & Mapping",
    note: "",
    bullets: [
      "UAV applications in urban planning, geospatial intelligence, and infrastructure development",
      "Advancements in GIS, digital twins, and spatial data for smart city planning",
      "Drone-based land surveying, mapping, and cadastral updates",
    ],
  },
  3: {
    title: "Theme: Irrigation, AI, Space & Drones",
    note: "",
    bullets: [
      "Innovations in precision agriculture, water management, and rural development",
      "AI-driven UAV applications for automation and real-time analytics",
      "Integration of drones with space technology for remote sensing and data collection",
    ],
  },
};

const AgendaSection: React.FC = () => {
  const [activeDay, setActiveDay] = useState(1);
  const [agendaThemes, setAgendaThemes] = useState(initialAgendaThemes);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editForm, setEditForm] = useState(null);

  // Toggle edit mode and load data into the form
  const toggleEditMode = () => {
    if (isEditMode) {
      setIsEditMode(false);
      setEditForm(null); // Clear the form data
    } else {
      setIsEditMode(true);
      setEditForm({ ...agendaThemes[activeDay] });
    }
  };

  // Handle input changes for title and note
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle changes for a specific bullet point
  const handleBulletChange = (e, index) => {
    const newBullets = [...editForm.bullets];
    newBullets[index] = e.target.value;
    setEditForm((prev) => ({ ...prev, bullets: newBullets }));
  };

  // Add a new bullet point
  const handleAddBullet = () => {
    setEditForm((prev) => ({ ...prev, bullets: [...prev.bullets, ""] }));
  };

  // Remove a bullet point
  const handleRemoveBullet = (index) => {
    const newBullets = editForm.bullets.filter((_, i) => i !== index);
    setEditForm((prev) => ({ ...prev, bullets: newBullets }));
  };

  // Save changes to the main state and exit edit mode
  const handleSave = () => {
    setAgendaThemes((prev) => ({
      ...prev,
      [activeDay]: editForm,
    }));
    setIsEditMode(false);
    setEditForm(null);
  };

  // Render the themes based on the current mode
  const renderThemeContent = () => {
    const theme = isEditMode ? editForm : agendaThemes[activeDay];

    if (!theme) {
      return null;
    }

    if (isEditMode) {
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
              onClick={toggleEditMode}
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
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Event <span className="text-[#FF0000]">Themes</span>
          </h2>
          <div className="w-24 h-1 bg-[#FFD400] mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Each day focuses on a powerful industry-relevant theme.
          </p>

          <div className="absolute top-0 right-0">
            <button
              onClick={toggleEditMode}
              className={`px-6 py-2 rounded-lg font-semibold text-lg transition-all duration-300 ${
                isEditMode
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
            >
              {isEditMode ? (
                <span className="flex items-center gap-2">
                  <X size={18} /> Cancel
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Edit size={18} /> Edit
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Day Tabs */}
        <div className="flex justify-center mb-10">
          <div className="flex bg-gray-100 rounded-full p-2 shadow-md">
            {[1, 2, 3].map((day) => (
              <button
                key={day}
                onClick={() => {
                  setActiveDay(day);
                  setEditForm({ ...agendaThemes[day] });
                }}
                className={`px-6 py-2 rounded-full text-sm md:text-base font-semibold transition-all duration-300 ${
                  activeDay === day
                    ? "bg-[#FF0000] text-white shadow-lg"
                    : "text-gray-700 hover:text-[#FF0000]"
                }`}
                disabled={isEditMode}
              >
                Day {day}
              </button>
            ))}
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
