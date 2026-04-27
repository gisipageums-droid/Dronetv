import React, { useState } from 'react';

const agendaThemes = {
  1: {
    title: 'Theme: Defence & Homeland Security',
    note: '(Sessions conducted by Rashtriya Raksha University as Knowledge Partner)',
    bullets: [
      'The role of drones in security, surveillance, and defense operations',
      'Perspectives from military, law enforcement, and intelligence agencies',
      'UAV integration in counter-terrorism, border security, and critical infrastructure protection',
    ]
  },
  2: {
    title: 'Theme: Smart City, GIS & Mapping',
    bullets: [
      'UAV applications in urban planning, geospatial intelligence, and infrastructure development',
      'Advancements in GIS, digital twins, and spatial data for smart city planning',
      'Drone-based land surveying, mapping, and cadastral updates',
    ]
  },
  3: {
    title: 'Theme: Irrigation, AI, Space & Drones',
    bullets: [
      'Innovations in precision agriculture, water management, and rural development',
      'AI-driven UAV applications for automation and real-time analytics',
      'Integration of drones with space technology for remote sensing and data collection',
    ]
  }
};

const AgendaSection = () => {
  const [activeDay, setActiveDay] = useState<1 | 2 | 3>(1);

  return (
    <section id="agenda" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Event <span className="text-[#FF0000]">Themes</span>
          </h2>
          <div className="w-24 h-1 bg-[#FFD400] mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Each day focuses on a powerful industry-relevant theme.
          </p>
        </div>

        {/* Day Tabs */}
        <div className="flex justify-center mb-10">
          <div className="flex bg-gray-100 rounded-full p-2 shadow-md">
            {[1, 2, 3].map((day) => (
              <button
                key={day}
                onClick={() => setActiveDay(day as 1 | 2 | 3)}
                className={`px-6 py-2 rounded-full text-sm md:text-base font-semibold transition-all duration-300 ${
                  activeDay === day
                    ? 'bg-[#FF0000] text-white shadow-lg'
                    : 'text-gray-700 hover:text-[#FF0000]'
                }`}
              >
                Day {day}
              </button>
            ))}
          </div>
        </div>

        {/* Theme Box */}
        <div className="max-w-3xl mx-auto bg-gray-100 rounded-3xl shadow-lg p-8 text-center">
          <h3 className="text-xl md:text-2xl font-bold text-black mb-2">
            {agendaThemes[activeDay].title}
          </h3>
          {agendaThemes[activeDay].note && (
            <p className="text-sm text-gray-500 font-medium mb-4">
              {agendaThemes[activeDay].note}
            </p>
          )}
          <ul className="text-left list-disc list-inside space-y-3 text-gray-700 text-base">
            {agendaThemes[activeDay].bullets.map((point, idx) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default AgendaSection;
