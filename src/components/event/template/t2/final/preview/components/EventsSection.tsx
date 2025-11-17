import { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  time: string;
}

interface EventsData {
  subtitle: string;
  heading: string;
  description: string;
  events: Event[];
}

interface EventsProps {
  eventsData?: EventsData;
}

const defaultData: EventsData = {
  subtitle: "event highlights",
  heading: "What to Expect",
  description: "Experience overview",
  events: [
    {
      id: "1",
      title: "Opening Keynote",
      description: "Keynote session details",
      location: "Main Hall",
      time: "9:00 AM - 10:00 AM",
    },
    {
      id: "2",
      title: "Technical Workshops",
      description: "Hands-on workshop sessions",
      location: "Workshop Rooms",
      time: "10:30 AM - 12:30 PM",
    },
    {
      id: "3",
      title: "Networking Sessions",
      description: "Connect with industry professionals",
      location: "Networking Lounge",
      time: "2:00 PM - 3:00 PM",
    }
  ]
};

export function EventsSection({ eventsData }: EventsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [data, setData] = useState<EventsData>(defaultData);
  const eventsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (eventsData) {
      setData(eventsData);
      setDataLoaded(true);
    } else {
      setData(defaultData);
      setDataLoaded(true);
    }
  }, [eventsData]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (eventsRef.current) observer.observe(eventsRef.current);
    return () => {
      if (eventsRef.current) observer.unobserve(eventsRef.current);
    };
  }, []);

  const displayData = data;

  if (isLoading) {
    return (
      <section ref={eventsRef} id="events" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading events data...</p>
        </div>
      </section>
    );
  }

  return (
    <section ref={eventsRef} id="events" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-4 px-4 py-2 bg-yellow-100 rounded-full">
            <span className="text-red-700 text-xl font-semibold">{displayData.subtitle}</span>
          </div>
          <h2 className="text-gray-900 mb-4 text-3xl sm:text-4xl md:text-5xl">{displayData.heading}</h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4">
            {displayData.description}
          </p>
        </motion.div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayData.events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="group bg-yellow-50 rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-amber-200 hover:border-amber-400"
            >
              <div className="p-6 sm:p-8">
                {/* View Mode */}
                <div className="flex items-center gap-4 mb-4">
                  <h3 className="text-gray-900 group-hover:text-amber-600 transition-colors text-xl sm:text-2xl">
                    {event.title}
                  </h3>
                </div>

                <p className="text-gray-600 mb-6 text-sm sm:text-base">{event.description}</p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-gray-600 text-sm sm:text-base">
                    <Clock className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 text-sm sm:text-base">
                    <MapPin className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {displayData.events.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center py-12"
          >
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">No Events Added</h4>
              <p className="text-gray-600">Add events to showcase your conference schedule.</p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}