import React, { useState } from "react";

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

const AgendaSection: React.FC<AgendaSectionProps> = ({ agendaData }) => {
  const [activeDay, setActiveDay] = useState(1);

  // Use prop data or default values
  const agendaContent = agendaData || defaultAgendaContent;

  // Get the current theme for the active day
  const currentTheme = agendaContent.themes[activeDay];

  return (
    <section id="agenda" className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            {agendaContent.title}{" "}
            <span className="text-[#FF0000]">
              {agendaContent.titleHighlight}
            </span>
          </h2>
          <div className="w-24 h-1 bg-[#FFD400] mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto text-justify">
            {agendaContent.subtitle}
          </p>
        </div>

        {/* Day Tabs */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-4">
            <div className="flex bg-gray-100 rounded-full p-2 shadow-md">
              {Object.keys(agendaContent.themes).map((day) => {
                const dayNum = parseInt(day);
                return (
                  <button
                    key={day}
                    onClick={() => setActiveDay(dayNum)}
                    className={`px-6 py-2 rounded-full text-sm md:text-base font-semibold transition-all duration-300 ${
                      activeDay === dayNum
                        ? "bg-[#FF0000] text-white shadow-lg"
                        : "text-gray-700 hover:text-[#FF0000]"
                    }`}
                  >
                    Day {day}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Theme Box */}
        <div className="max-w-3xl mx-auto bg-gray-100 rounded-3xl shadow-lg p-8">
          {currentTheme && (
            <div className="text-center">
              <h3 className="text-xl md:text-2xl font-bold text-black mb-2">
                {currentTheme.title}
              </h3>
              {currentTheme.note && (
                <p className="text-sm text-gray-500 font-medium mb-4 text-justify">{currentTheme.note}</p>
              )}
              <ul className="text-left list-disc list-inside space-y-3 text-gray-700 text-base">
                {currentTheme.bullets.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AgendaSection;