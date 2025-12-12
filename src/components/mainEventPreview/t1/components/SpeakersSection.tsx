import React, { memo } from 'react';
import { User } from 'lucide-react';
import maleAvatar from "/logos/maleAvatar.png"
import femaleAvatar from "/logos/femaleAvatar.png"

interface Speaker {
  name: string;
  company: string;
  id: number;
  avatar: string;
  title: string;
  prefix?: string;
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
          "avatar": "",
          "title": "Designation",
          "prefix": "mr"
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

// Helper function to get prefix display text
const getPrefixDisplay = (prefix: string | undefined): string => {
  switch (prefix) {
    case 'mr': return 'Mr.';
    case 'mrs': return 'Mrs.';
    case 'ms': return 'Ms.';
    default: return '';
  }
};

/* Speaker Card Component */
const SpeakerCard = memo(
  ({
    speaker
  }: any) => {
    // Function to render avatar - only image or default icon
    const renderAvatar = (avatarUrl: string | undefined, altText: string = 'Speaker', prefix?: string) => {
      if (avatarUrl && avatarUrl.trim() !== '') {
        return (
          <img 
            src={avatarUrl} 
            alt={altText}
            className="w-full h-full object-cover rounded-full"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                const fallback = parent.querySelector('.avatar-fallback') as HTMLElement;
                if (fallback) fallback.classList.remove('hidden');
              }
            }}
          />
        );
      }
      
      // Use prefix to determine which default avatar to show
      const defaultAvatar = prefix === 'Mr.' ? maleAvatar : femaleAvatar;
      
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-full">
          <img 
            src={defaultAvatar} 
            alt={altText}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      );
    };

    return (
      <div className="group bg-white rounded-lg md:rounded-xl shadow-md md:shadow-lg p-4 md:p-6 relative h-full min-h-[200px] md:min-h-[250px] hover:shadow-lg transition-shadow duration-300">
        {/* Avatar */}
        <div className="relative">
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full overflow-hidden flex items-center justify-center">
            {renderAvatar(speaker.avatar, speaker.name, speaker.prefix)}
            <div className="avatar-fallback hidden w-full h-full items-center justify-center bg-gray-200 rounded-full">
              <User className="w-8 h-8 text-gray-500" />
            </div>
          </div>
        </div>

        <h4 className="text-center font-bold mt-3 md:mt-4 text-sm md:text-base line-clamp-1">
          {speaker.prefix && `${getPrefixDisplay(speaker.prefix)} `}{speaker.name}
        </h4>
        {speaker.title && (
          <p className="text-justify text-xs md:text-sm mt-1 md:mt-2 line-clamp-2">
            {speaker.title}
          </p>
        )}
        {speaker.company && (
          <p className="text-justify text-xs md:text-sm text-gray-600 mt-1 line-clamp-2">
            {speaker.company}
          </p>
        )}
      </div>
    );
  }
);

SpeakerCard.displayName = 'SpeakerCard';

/* Main Component */
const SpeakersSection: React.FC<SpeakersSectionProps> = ({ 
  speakersData 
}) => {
  // Use provided data or default
  const { speakers, headerContent } = speakersData || defaultSpeakersData;
  const [activeDay, setActiveDay] = React.useState(0);

  return (
    <section id="speakers" className="py-12 md:py-20 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-3 sm:px-4 max-w-7xl relative">
        
        {/* Header */}
        <div className="text-center mb-10 md:mb-16 px-2">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            <span className="text-yellow-500 block md:inline">{headerContent.eventTitle}</span>
            <span className="block text-xl sm:text-2xl md:text-3xl text-gray-800 mt-2">{headerContent.sectionTitle}</span>
          </h2>
          <p className="text-gray-600 mt-3 md:mt-4 text-justify md:text-center px-4 sm:px-6 md:px-0 max-w-3xl mx-auto">
            {headerContent.subtitle}
          </p>
        </div>

        {/* Day Tabs */}
        <div className="flex justify-center items-center mb-8 md:mb-12 gap-4">
          <div className="bg-white shadow-lg p-1 sm:p-2 rounded-xl md:rounded-2xl flex flex-wrap justify-center gap-1 sm:gap-2 max-w-full overflow-x-auto">
            {speakers.map((day, index) => (
              <div key={index} className="relative">
                <button
                  onClick={() => setActiveDay(index)}
                  className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-lg md:rounded-xl text-sm sm:text-base whitespace-nowrap transition-colors ${
                    activeDay === index 
                      ? 'bg-yellow-400 text-black font-bold hover:bg-yellow-500' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {day.day}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Speakers Grid */}
        <div className="px-2 sm:px-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-3">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
              {speakers[activeDay]?.day}
            </h3>
          </div>

          {speakers[activeDay]?.speakers.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <p className="text-gray-500 text-lg">No speakers added for this day yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {speakers[activeDay]?.speakers.map((speaker) => (
                <SpeakerCard
                  key={speaker.id}
                  speaker={speaker}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );  
};

export default SpeakersSection;