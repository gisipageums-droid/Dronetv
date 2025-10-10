import React from 'react';
import { Target, Users, Lightbulb, Award } from 'lucide-react';

/** initial data (you can move this to a JSON file or fetch from API) */
const speakersData = [
  {
    day: "Day 1 (24th April'25)",
    speakers: [
      { id: 1, name: "Commodore Santosh", title: "Executive Director", company: "ECIL, Hyderabad", avatar: "CS" },
      { id: 2, name: "Dr. Nagendra Babu", title: "", company: "Zen Technologies", avatar: "NB" },
      { id: 3, name: "Dr. Samir V. Kamat", title: "Chairman", company: "DRDO", avatar: "SK" },
      { id: 4, name: "Lt. Gen. Manish Erry", title: "AVSM, SM", company: "DG Strategic Planning", avatar: "ME" },
      { id: 5, name: "Lt. Gen. Neeraj Varshney", title: "VSM", company: "Commandant MCEME", avatar: "NV" },
      { id: 6, name: "Lt. Gen. V.G. Khandare", title: "PVSM, AVSM, SM", company: "Principal Advisor (USG), Dept. of Defence", avatar: "VK" },
      { id: 7, name: "Maj Gen (Dr.) RK Raina", title: "Director", company: "SISDSS", avatar: "RR" },
      { id: 8, name: "Maj Gen MLN Sravan Kumar (Retd)", title: "", company: "", avatar: "SK" }
    ]
  },
  {
    day: "Day 2 (25th April'25)",
    speakers: [
      { id: 15, name: "Col Harison Verma (Retd.)", title: "COO", company: "Aerospace Services India Ltd", avatar: "HV" },
      { id: 16, name: "Dr. (Smt.) Chandrika Kaushik", title: "DG PC & SI", company: "DRDO", avatar: "CK" },
      { id: 17, name: "Dr. Girish Kant Pandey", title: "Principal", company: "Govt. KRD College", avatar: "GP" },
      { id: 18, name: "Dr. P. Rajalakshmi", title: "", company: "NMICPS TiHAN Foundation, IIT Hyderabad", avatar: "PR" },
      { id: 19, name: "Dr. Sangita Rao Achary Addanki", title: "", company: "DLIC, DRDO", avatar: "SA" },
      { id: 20, name: "Lt. Gen. Sanjay Verma", title: "PVSM, AVSM, VSM, Bar to VSM", company: "", avatar: "SV" }
    ]
  },
  {
    day: "Day 3 (26th April'25)",
    speakers: [
      { id: 28, name: "Dr Pranay Kumar", title: "", company: "", avatar: "PK" },
      { id: 29, name: "Dr. Sunil Khetarpal", title: "Director", company: "Association of Healthcare Providers India", avatar: "SK" },
      { id: 30, name: "Mr. Anuraag Tiwari", title: "Director", company: "GKD Tactix.ai", avatar: "AT" },
      { id: 31, name: "Mr. Arul Rajesh Gedala", title: "Race director", company: "FPV India", avatar: "AG" },
      { id: 32, name: "Mr. Sanjay Kumar", title: "Co-Founder", company: "EON Space Labs Pvt. Ltd.", avatar: "SK" },
      { id: 33, name: "Mr. Vishal Saurav", title: "CEO-founder", company: "XBOOM", avatar: "VS" }
    ]
  }
];

// Utility functions
const getColorForAvatar = (name = '') => {
  const colors = [
    'bg-purple-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-indigo-500',
    'bg-pink-500',
    'bg-cyan-500'
  ];
  const code = name && name.length ? name.charCodeAt(0) : 65;
  const idx = code % colors.length;
  return colors[idx];
};

const getInitials = (name = '') => {
  if (!name) return 'NA';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

const SpeakerCard = ({ speaker }) => {
  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 h-full border border-gray-100 hover:border-gray-200 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-100 rounded-full -translate-y-10 translate-x-10 opacity-50 group-hover:opacity-70 transition-opacity"></div>
      
      <div className="relative z-10">
        {/* Avatar */}
        <div className={`w-16 h-16 rounded-2xl ${getColorForAvatar(speaker.name)} text-white flex items-center justify-center mx-auto font-bold text-lg mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
          {speaker.avatar && speaker.avatar.length > 0
            ? speaker.avatar
            : getInitials(speaker.name)}
        </div>

        {/* Content */}
        <div className="text-center space-y-2">
          <h4 className="text-lg font-bold text-gray-800 leading-tight">{speaker.name}</h4>
          {speaker.title && (
            <p className="text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full inline-block">
              {speaker.title}
            </p>
          )}
          {speaker.company && (
            <p className="text-sm text-gray-600 leading-relaxed">{speaker.company}</p>
          )}
        </div>
      </div>

      {/* Hover effect border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-yellow-400 transition-all pointer-events-none"></div>
    </div>
  );
};

const SpeakersSection = () => {
  const [activeDay, setActiveDay] = React.useState(0);

  // Computed stats
  const totalSpeakers = speakersData.reduce((acc, d) => acc + (d.speakers?.length || 0), 0);
  const eventDays = speakersData.length;
  const speakersToday = speakersData[activeDay]?.speakers?.length || 0;

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-7xl relative">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="text-yellow-500">
              Drone Expo 2025
            </span>
            <span className="block text-gray-800 text-3xl md:text-4xl mt-2">Speakers</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mt-4">
            Meet our distinguished speakers who will share their expertise and insights
          </p>
        </div>

        {/* Day Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-2 flex gap-2">
            {speakersData.map((dayGroup, index) => (
              <button
                key={index}
                onClick={() => setActiveDay(index)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeDay === index
                    ? 'bg-yellow-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                {dayGroup.day}
              </button>
            ))}
          </div>
        </div>

        {/* Speakers Grid */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-bold text-gray-800">
              {speakersData[activeDay]?.day}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {speakersData[activeDay]?.speakers.map((speaker, speakerIndex) => (
              <SpeakerCard
                key={`${speaker.id}-${activeDay}-${speakerIndex}`}
                speaker={speaker}
              />
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 bg-yellow-500 rounded-2xl p-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">{totalSpeakers}</div>
              <div className="text-yellow-100">Total Speakers</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">{eventDays}</div>
              <div className="text-yellow-100">Event Days</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">{speakersToday}</div>
              <div className="text-yellow-100">Speakers Today</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpeakersSection;
