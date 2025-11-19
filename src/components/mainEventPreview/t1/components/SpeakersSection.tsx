import React, { useState, memo } from 'react';

interface Speaker {
  name: string;
  company: string;
  id: number;
  avatar: string;
  title: string;
}

interface SpeakerDay {
  day: string;
  speakers: Speaker[];
}

interface SpeakersHeaderContent {
  sectionTitle: string;
  eventTitle: string;
  subtitle: string;
}

interface SpeakersDataContent {
  speakers: SpeakerDay[];
  headerContent: SpeakersHeaderContent;
}

interface SpeakersSectionProps {
  speakersData?: SpeakersDataContent;
}

/** Default data structure */
const defaultSpeakersData: SpeakersDataContent = {
  speakers: [
    {
      "day": "Day 1 (Date)",
      "speakers": [
        {
          "name": "Speaker Name",
          "company": "Organization",
          "id": 1,
          "avatar": "Initials",
          "title": "Designation"
        }
      ]
    },
    {
      "day": "Day 2 (Date)",
      "speakers": []
    },
    {
      "day": "Day 3 (Date)",
      "speakers": []
    }
  ],
  "headerContent": {
    "sectionTitle": "Speakers",
    "eventTitle": "Professional Event",
    "subtitle": "Meet our distinguished speakers who will share their expertise and insights"
  }
};

/* Utility functions */
const getColorForAvatar = (name = '') => {
  const colors = [
    'bg-purple-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
    'bg-red-500', 'bg-indigo-500', 'bg-pink-500', 'bg-cyan-500'
  ];
  const code = name.length ? name.charCodeAt(0) : 65;
  return colors[code % colors.length];
};

const getInitials = (name = '') => {
  if (!name) return 'NA';
  const parts = name.trim().split(/\s+/);
  return parts.length > 1
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : parts[0].substring(0, 2).toUpperCase();
};

/* Speaker Card Component */
const SpeakerCard = memo(({ speaker }: any) => {
  return (
    <div className="group bg-white rounded-xl shadow-lg p-6">
      <div className={`w-16 h-16 mx-auto rounded-xl ${getColorForAvatar(speaker.name)} text-white flex items-center justify-center text-xl font-bold`}>
        {speaker.avatar || getInitials(speaker.name)}
      </div>

      <h4 className="text-center font-bold mt-4">{speaker.name}</h4>
      {speaker.title && <p className="text-center text-sm">{speaker.title}</p>}
      {speaker.company && <p className="text-center text-sm text-gray-600">{speaker.company}</p>}
    </div>
  );
});

const SpeakersSection: React.FC<SpeakersSectionProps> = ({ speakersData }) => {
  const [activeDay, setActiveDay] = useState(0);

  // Use prop data or default values
  const speakersContent = speakersData || defaultSpeakersData;
  const { speakers, headerContent } = speakersContent;

  return (
    <section id="speakers" className="py-20 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold">
            <span className="text-yellow-500">{headerContent.eventTitle}</span>
            <span className="block text-3xl text-gray-800">{headerContent.sectionTitle}</span>
          </h2>
          <p className="text-gray-600 mt-4">{headerContent.subtitle}</p>
        </div>

        {/* Day Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-white shadow-lg p-2 rounded-2xl flex gap-2">
            {speakers.map((day, index) => (
              <button
                key={index}
                onClick={() => setActiveDay(index)}
                className={`px-6 py-3 rounded-xl ${
                  activeDay === index ? 'bg-yellow-500 text-white' : ''
                }`}
              >
                {day.day}
              </button>
            ))}
          </div>
        </div>

        {/* Speakers Grid */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-bold">{speakers[activeDay]?.day}</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {speakers[activeDay]?.speakers.map((speaker) => (
              <SpeakerCard
                key={speaker.id}
                speaker={speaker}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpeakersSection;