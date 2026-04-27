import { useState } from 'react';
import { Clock, MapPin, User } from 'lucide-react';

export function ScheduleSection() {
  const [activeDay, setActiveDay] = useState(1);

  const schedule = {
    1: [
      {
        time: '8:00 AM - 9:00 AM',
        title: 'Registration & Welcome Coffee',
        location: 'Main Lobby',
        speaker: 'Event Team',
        type: 'registration',
      },
      {
        time: '9:00 AM - 11:00 AM',
        title: 'Opening Keynote: The Future is Now',
        location: 'Grand Hall A',
        speaker: 'Dr. Sarah Mitchell',
        type: 'keynote',
      },
      {
        time: '11:15 AM - 12:30 PM',
        title: 'Panel: Innovating in Uncertain Times',
        location: 'Conference Room B',
        speaker: 'Marcus Chen, Elena Rodriguez',
        type: 'panel',
      },
      {
        time: '12:30 PM - 2:00 PM',
        title: 'Networking Lunch',
        location: 'Terrace Garden',
        speaker: 'All Attendees',
        type: 'break',
      },
      {
        time: '2:00 PM - 5:00 PM',
        title: 'Hands-on Innovation Workshop',
        location: 'Innovation Lab',
        speaker: 'James Taylor',
        type: 'workshop',
      },
      {
        time: '5:30 PM - 7:00 PM',
        title: 'Welcome Reception',
        location: 'Rooftop Terrace',
        speaker: 'All Attendees',
        type: 'networking',
      },
    ],
    2: [
      {
        time: '9:00 AM - 10:30 AM',
        title: 'Emerging Technologies Workshop',
        location: 'Tech Hub',
        speaker: 'Dr. Amara Okafor',
        type: 'workshop',
      },
      {
        time: '10:45 AM - 12:15 PM',
        title: 'Building Sustainable Solutions',
        location: 'Grand Hall A',
        speaker: 'Marcus Chen',
        type: 'keynote',
      },
      {
        time: '12:15 PM - 1:45 PM',
        title: 'Lunch & Exhibition Tour',
        location: 'Exhibition Hall',
        speaker: 'All Attendees',
        type: 'break',
      },
      {
        time: '2:00 PM - 3:30 PM',
        title: 'Design Thinking Masterclass',
        location: 'Design Studio',
        speaker: 'Elena Rodriguez',
        type: 'workshop',
      },
      {
        time: '3:45 PM - 5:15 PM',
        title: 'Scaling Your Business',
        location: 'Conference Room A',
        speaker: 'David Kim',
        type: 'session',
      },
      {
        time: '7:00 PM - 10:00 PM',
        title: 'Gala Dinner & Awards Ceremony',
        location: 'Grand Ballroom',
        speaker: 'All Attendees',
        type: 'networking',
      },
    ],
    3: [
      {
        time: '9:00 AM - 10:30 AM',
        title: 'Digital Transformation Strategies',
        location: 'Grand Hall A',
        speaker: 'James Taylor',
        type: 'keynote',
      },
      {
        time: '10:45 AM - 12:00 PM',
        title: 'Interactive Q&A with All Speakers',
        location: 'Conference Room B',
        speaker: 'All Speakers',
        type: 'panel',
      },
      {
        time: '12:00 PM - 1:30 PM',
        title: 'Farewell Lunch',
        location: 'Terrace Garden',
        speaker: 'All Attendees',
        type: 'break',
      },
      {
        time: '1:45 PM - 3:00 PM',
        title: 'Closing Keynote & Future Outlook',
        location: 'Grand Hall A',
        speaker: 'Dr. Sarah Mitchell',
        type: 'keynote',
      },
      {
        time: '3:00 PM - 3:30 PM',
        title: 'Closing Remarks & See You Next Year',
        location: 'Grand Hall A',
        speaker: 'Event Team',
        type: 'closing',
      },
    ],
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      keynote: 'bg-amber-500',
      workshop: 'bg-yellow-500',
      panel: 'bg-orange-500',
      session: 'bg-amber-400',
      networking: 'bg-yellow-400',
      break: 'bg-gray-400',
      registration: 'bg-gray-400',
      closing: 'bg-amber-600',
    };
    return colors[type] || 'bg-gray-400';
  };

  return (
    <section id="schedule" className="py-16 sm:py-20 md:py-24 bg-yellow-100">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-white rounded-full shadow-sm border border-amber-200">
              <span className="text-red-700 text-xl font-semibold">Event Schedule</span>
            </div>
            <h2 className="text-gray-900 mb-4 text-3xl sm:text-4xl md:text-5xl">Three Days of Excellence</h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4">
              Carefully curated sessions designed to maximize your learning and networking opportunities.
            </p>
          </div>

          {/* Day Tabs */}
          <div className="flex justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 flex-wrap px-4">
            {[1, 2, 3].map((day) => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`px-6 sm:px-8 py-3 sm:py-4 rounded-xl transition-all duration-300 text-sm sm:text-base ${
                  activeDay === day
                    ? 'bg-yellow-400 text-gray-900 shadow-lg scale-105'
                    : 'bg-white text-gray-600 hover:bg-yellow-50 border border-gray-200'
                }`}
              >
                Day {day}
                <div className="text-xs sm:text-sm mt-1">March {14 + day}, 2025</div>
              </button>
            ))}
          </div>

          {/* Schedule Items */}
          <div className="space-y-4 sm:space-y-6">
            {schedule[activeDay as keyof typeof schedule].map((item, index) => (
              <div
                key={index}
                className="group bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-transparent hover:border-amber-500"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4 sm:gap-6">
                  <div className="lg:w-44 flex-shrink-0">
                    <div className="flex items-center gap-2 text-gray-900 text-sm sm:text-base">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 flex-shrink-0" />
                      <span>{item.time}</span>
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 sm:px-3 py-1 ${getTypeColor(item.type)} text-white rounded-full text-xs capitalize`}>
                        {item.type}
                      </span>
                    </div>
                    <h3 className="text-gray-900 mb-3 group-hover:text-amber-600 transition-colors text-base sm:text-lg md:text-xl">
                      {item.title}
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 text-gray-600 text-sm sm:text-base">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-amber-600 flex-shrink-0" />
                        <span>{item.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-amber-600 flex-shrink-0" />
                        <span>{item.speaker}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}