import React, { useState } from 'react';
import { Clock, MapPin, User, Calendar } from 'lucide-react';

const AgendaSection: React.FC = () => {
  const [activeDay, setActiveDay] = useState(1);

  const schedule = {
    1: [
      {
        time: '8:00 AM',
        title: 'Registration & Welcome Coffee',
        speaker: 'Event Team',
        location: 'Main Entrance',
        type: 'registration',
        duration: '1 hour'
      },
      {
        time: '9:00 AM',
        title: 'Opening Keynote: The Future of Autonomous Flight',
        speaker: 'Dr. Alex Rivera',
        location: 'Main Stage',
        type: 'keynote',
        duration: '45 minutes'
      },
      {
        time: '10:00 AM',
        title: 'Drone Racing Championship - Qualifying Rounds',
        speaker: 'Professional Pilots',
        location: 'Racing Arena',
        type: 'competition',
        duration: '2 hours'
      },
      {
        time: '12:00 PM',
        title: 'Innovation Showcase & Networking Lunch',
        speaker: 'All Attendees',
        location: 'Exhibition Hall',
        type: 'networking',
        duration: '1.5 hours'
      },
      {
        time: '1:30 PM',
        title: 'Panel: AI in Commercial Drone Applications',
        speaker: 'Sarah Chen, Marcus Johnson',
        location: 'Tech Theater',
        type: 'panel',
        duration: '1 hour'
      },
      {
        time: '3:00 PM',
        title: 'Live Demo: Advanced Navigation Systems',
        speaker: 'SkyVision Systems',
        location: 'Demo Zone',
        type: 'demo',
        duration: '45 minutes'
      },
      {
        time: '4:00 PM',
        title: 'Startup Pitch Competition',
        speaker: 'Emerging Companies',
        location: 'Innovation Stage',
        type: 'competition',
        duration: '2 hours'
      },
      {
        time: '6:00 PM',
        title: 'Day 1 Wrap-up & Evening Networking',
        speaker: 'Event Organizers',
        location: 'Rooftop Lounge',
        type: 'networking',
        duration: '2 hours'
      }
    ],
    2: [
      {
        time: '9:00 AM',
        title: 'Day 2 Welcome & Coffee',
        speaker: 'Event Team',
        location: 'Main Entrance',
        type: 'registration',
        duration: '30 minutes'
      },
      {
        time: '9:30 AM',
        title: 'Keynote: Urban Air Mobility Revolution',
        speaker: 'Dr. Lisa Kumar',
        location: 'Main Stage',
        type: 'keynote',
        duration: '45 minutes'
      },
      {
        time: '10:30 AM',
        title: 'Drone Racing Championship - Finals',
        speaker: 'Top Pilots',
        location: 'Racing Arena',
        type: 'competition',
        duration: '2 hours'
      },
      {
        time: '12:30 PM',
        title: 'Awards Lunch & Recognition Ceremony',
        speaker: 'Industry Leaders',
        location: 'Grand Ballroom',
        type: 'ceremony',
        duration: '1.5 hours'
      },
      {
        time: '2:00 PM',
        title: 'Workshop: Building Your First Autonomous Drone',
        speaker: 'Dr. Emily Watson',
        location: 'Workshop Lab',
        type: 'workshop',
        duration: '2 hours'
      },
      {
        time: '4:30 PM',
        title: 'Panel: Future of Drone Regulations',
        speaker: 'Industry Experts',
        location: 'Policy Theater',
        type: 'panel',
        duration: '1 hour'
      },
      {
        time: '5:30 PM',
        title: 'Closing Ceremony & Innovation Awards',
        speaker: 'Event Organizers',
        location: 'Main Stage',
        type: 'ceremony',
        duration: '1 hour'
      },
      {
        time: '7:00 PM',
        title: 'After Party & Final Networking',
        speaker: 'All Attendees',
        location: 'Expo Grounds',
        type: 'networking',
        duration: '3 hours'
      }
    ]
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'keynote': return { bg: 'bg-[#FF0000]', text: 'text-white', border: 'border-[#FF0000]' };
      case 'panel': return { bg: 'bg-[#FFD400]', text: 'text-black', border: 'border-[#FFD400]' };
      case 'workshop': return { bg: 'bg-blue-500', text: 'text-white', border: 'border-blue-500' };
      case 'demo': return { bg: 'bg-green-500', text: 'text-white', border: 'border-green-500' };
      case 'competition': return { bg: 'bg-purple-500', text: 'text-white', border: 'border-purple-500' };
      case 'networking': return { bg: 'bg-orange-500', text: 'text-white', border: 'border-orange-500' };
      case 'ceremony': return { bg: 'bg-indigo-500', text: 'text-white', border: 'border-indigo-500' };
      case 'registration': return { bg: 'bg-gray-500', text: 'text-white', border: 'border-gray-500' };
      default: return { bg: 'bg-gray-500', text: 'text-white', border: 'border-gray-500' };
    }
  };

  return (
    <section id="schedule" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 data-aos="fade-up" className="text-4xl md:text-6xl font-bold text-[#FFD400] mb-4">
            Event <span className="text-white">Schedule</span>
          </h2>
          <div data-aos="fade-up" data-aos-delay="200" className="w-32 h-1 bg-[#FFD400] mx-auto mb-6"></div>
          <p data-aos="fade-up" data-aos-delay="400" className="text-gray-300 text-lg max-w-3xl mx-auto">
            Two action-packed days of competitions, demonstrations, workshops, and networking opportunities.
          </p>
        </div>

        {/* Day Tabs */}
        <div data-aos="fade-up" data-aos-delay="600" className="flex justify-center mb-12">
          <div className="flex bg-gray-800 rounded-full p-2 border border-gray-700">
            {[1, 2].map((day) => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`flex items-center gap-2 px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeDay === day
                    ? 'bg-[#FF0000] text-white shadow-lg transform scale-105'
                    : 'text-gray-400 hover:text-[#FFD400]'
                }`}
              >
                <Calendar size={16} />
                Day {day}
              </button>
            ))}
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-6">
            {schedule[activeDay as keyof typeof schedule].map((session, index) => {
              const typeStyle = getTypeStyle(session.type);
              return (
                <div 
                  key={index}
                  data-aos="fade-up" 
                  data-aos-delay={index * 100}
                  className="group bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 hover:border-[#FFD400]/50 transition-all duration-300 hover:transform hover:scale-[1.02]"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* Time & Type */}
                    <div className="flex-shrink-0 lg:w-48">
                      <div className="text-2xl font-bold text-[#FFD400] mb-2">{session.time}</div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${typeStyle.bg} ${typeStyle.text}`}>
                          {session.type}
                        </span>
                        <span className="text-gray-500 text-sm">{session.duration}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#FFD400] transition-colors">
                        {session.title}
                      </h3>
                      
                      <div className="flex flex-wrap gap-6 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-[#FFD400]" />
                          <span>{session.speaker}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-[#FFD400]" />
                          <span>{session.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-[#FFD400]" />
                          <span>{session.duration}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex-shrink-0">
                      <button className="bg-[#FF0000] hover:bg-[#FF0000]/90 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
                        Add to Calendar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Download Schedule CTA */}
        <div data-aos="fade-up" data-aos-delay="800" className="text-center mt-16">
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto border border-gray-800">
            <h3 className="text-2xl font-bold text-white mb-4">
              Download Full Schedule
            </h3>
            <p className="text-gray-400 mb-6">
              Get the complete event schedule with detailed session information and speaker bios.
            </p>
            <button className="bg-[#FFD400] hover:bg-[#FFD400]/90 text-black px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
              Download PDF Schedule
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgendaSection;