import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

export function EventsSection() {
  const events = [
    {
      title: 'Opening Keynote',
      category: 'Main Stage',
      date: 'March 15, 2025',
      time: '9:00 AM - 11:00 AM',
      location: 'Grand Hall A',
      description: 'Kick off the conference with inspiring talks from industry pioneers and thought leaders.',
      color: 'from-yellow-400 to-amber-500',
    },
    {
      title: 'Innovation Workshop',
      category: 'Workshop',
      date: 'March 15, 2025',
      time: '2:00 PM - 5:00 PM',
      location: 'Innovation Lab',
      description: 'Hands-on sessions exploring the latest technologies and methodologies shaping our industry.',
      color: 'from-amber-400 to-orange-500',
    },
    {
      title: 'Networking Gala',
      category: 'Networking',
      date: 'March 16, 2025',
      time: '7:00 PM - 10:00 PM',
      location: 'Rooftop Terrace',
      description: 'An elegant evening of connection, conversation, and celebration with fellow attendees.',
      color: 'from-yellow-300 to-amber-400',
    },
    {
      title: 'Panel Discussion',
      category: 'Discussion',
      date: 'March 17, 2025',
      time: '10:00 AM - 12:00 PM',
      location: 'Conference Room B',
      description: 'Expert panel discussing future trends, challenges, and opportunities in the industry.',
      color: 'from-amber-500 to-yellow-600',
    },
  ];

  return (
    <section id="events" className="py-16 sm:py-20 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-yellow-100 rounded-full">
              <span className="text-red-700 text-xl font-semibold">Featured Events</span>
            </div>
            <h2 className="text-gray-900 mb-4 text-3xl sm:text-4xl md:text-5xl">Unmissable Experiences</h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4">
              From inspiring keynotes to hands-on workshops, every moment is designed to educate, inspire, and connect.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {events.map((event, index) => (
              <div
                key={index}
                className="group bg-yellow-50 rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-amber-200 hover:border-amber-400"
              >
                <div className={`h-2 bg-orange-500`} />
                <div className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-3 py-1 bg-yellow-400 text-white rounded-full text-xs sm:text-sm`}>
                      {event.category}
                    </span>
                  </div>
                  <h3 className="text-gray-900 mb-4 group-hover:text-amber-600 transition-colors text-xl sm:text-2xl">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 mb-6 text-sm sm:text-base">{event.description}</p>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-gray-600 text-sm sm:text-base">
                      <Calendar className="w-5 h-5 text-amber-600 flex-shrink-0" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600 text-sm sm:text-base">
                      <Clock className="w-5 h-5 text-amber-600 flex-shrink-0" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600 text-sm sm:text-base">
                      <MapPin className="w-5 h-5 text-amber-600 flex-shrink-0" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 p-0 h-auto group text-sm sm:text-base"
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}