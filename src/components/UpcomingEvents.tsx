

import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, Clock, Users, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// (optional) Type – aap chahe toh hata bhi sakte ho
// interface EventCard {
//   id: string;
//   name: string;
//   description: string;
//   date: string;
//   time: string;
//   location: string;
//   attendees?: string;
//   image: string;
//   price?: string;
//   type?: string;
//   status?: string;
//   featured?: boolean;
//   urlSlug?: string;
// }

// Static fallback (agar API fail ho jaye ya slow ho)
const staticEvents: EventCard[] = [
  {
    id: '1',
    name: "Drone Expo & Conference 2025",
    description:
      "Join us in Mumbai for the premier Drone Expo & Conference where innovation, networking, and industry insights converge. Meet key buyers, launch and showcase new products, understand market competition, and build brand awareness. Explore specialized zones, attend technical conferences, and engage with top speakers from defense, tech, and academia.",
    date: "September 25-27, 2025",
    location: "Mumbai, India",
    time: "9:00 AM - 6:00 PM",
    attendees: "5,000+",
    image: "/images/droneexpo_cover.jpg",
    type: "Expo & Conference",
    status: "upcoming",
    price: "Premium",
    featured: true,
    urlSlug: "droneexpo",
  },
];

const UpcomingEvents = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const navigate = useNavigate();

  // 🔁 yahan change: events ko state se manage karenge
  const [events, setEvents] = useState<EventCard[]>([]);
  console.log("events", events);

  useEffect(() => {
    axios
      .get(
        "https://o9og9e2rik.execute-api.ap-south-1.amazonaws.com/prod/events-dashboard?viewType=main"
      )
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data.cards)) {
          console.log("res event", res.data);

          // 👇 API ke cards ko UI wale format me convert kar rahe hain
          const apiEvents: EventCard[] = res.data.cards.map((card: any) => ({
            id: card.eventId,
            name: card.eventName,
            description: card.shortDescription,
            date: card.eventDate, // "2026-04-17 to 2026-04-18"
            time: card.eventTime,
            location: card.location,
            attendees: "Limited Seats", // API me direct field nahi hai – aap chahe toh hata sakte
            image:
              card.heroBannerImage ||
              card.previewImage ||
              "/images/droneexpo_cover.jpg", // fallback
            price: "Premium",
            type: "Expo & Conference",
            status: card.isApproved ? "upcoming" : "draft",
            featured: true,
            urlSlug: card.urlSlug,
          }));

          // 🟡 Ab state me API se aaya data set kar rahe
          setEvents(apiEvents);
        }
      })
      .catch((err) => {
        console.error("Error fetching events:", err);
        // yaha aap chahe toh toast / alert de sakte ho
        // staticEvents already state me hai, to UI blank nahi hoga
      });
  }, []);

  return (
    <section className="py-20 bg-yellow-300 relative overflow-hidden min-h-screen">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-200/20 rounded-full animate-pulse blur-2xl"></div>
        <div
          className="absolute bottom-20 right-10 w-40 h-40 bg-yellow-400/20 rounded-full animate-pulse blur-2xl"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black text-black mb-4 tracking-tight">
            <span>Upcoming Events</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect, learn, and network at industry-leading events
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto rounded-full mt-6"></div>
        </div>

        {/* Dynamic Layout: Center if single event, grid if multiple */}
        <div
          className={`w-full ${events.length === 1
            ? "flex justify-center"
            : "grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8"
            }`}
        >
          {events.map((event, index) => {
            const isHovered = hoveredCard === index; // 🟡 id string hai, isliye index use kar liya

            return (
              <div
                key={event.id}
                className="group relative bg-[#f1ee8e] rounded-2xl lg:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 cursor-pointer transform hover:scale-105 hover:-rotate-1 opacity-100 translate-y-0 max-w-xl w-full"
                style={{
                  transitionDelay: `${index * 200}ms`,
                  animation: `fadeInUp 0.8s ease-out ${index * 200}ms both`,
                }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() =>
                  navigate(`/event/${event.name}`)
                }
                role="button"
                tabIndex={0}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.name}
                    className="w-full h-48 sm:h-56 object-cover transition-all duration-700 group-hover:scale-110"
                  />

                  {/* Black Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 opacity-60 group-hover:opacity-80 transition-all duration-500"></div>
                  {/* Yellow Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-yellow-600/10 opacity-60 group-hover:opacity-80 transition-all duration-500"></div>
                  {/* Price Badge */}
                  <div className="absolute top-4 right-4 bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold shadow-lg  transition-transform duration-500">
                    {event.price || "Premium"}
                  </div>
                  {/* CTA button */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 pointer-events-auto">
                    <Link
                      to={`/event/${event.name}`}
                      className="inline-flex items-center gap-2 bg-yellow-400 text-black px-6 py-3 rounded-full font-bold shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-yellow-300 border border-yellow-500"
                      onClick={(e) => e.stopPropagation()} // Prevent parent card click
                    >
                      <span>Learn More</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                <div className="p-4 sm:p-6 lg:p-8">
                  <h3 className="text-xl sm:text-2xl font-bold text-black mb-4 sm:mb-6 group-hover:text-gray-800 transition-colors duration-300">
                    {event.name}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Column 1: Date & Location */}
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                        <div className="bg-yellow-200 rounded-full p-2 mr-3 sm:mr-4 group-hover:bg-yellow-300 transition-colors duration-300 border border-yellow-300 flex-shrink-0">
                          <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
                        </div>
                        <span className="font-medium text-sm sm:text-base">
                          {event.date}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                        <div className="bg-yellow-200 rounded-full p-2 mr-3 sm:mr-4 group-hover:bg-yellow-300 transition-colors duration-300 border border-yellow-300 flex-shrink-0">
                          <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
                        </div>
                        <span className="font-medium text-sm sm:text-base">
                          {event.location}
                        </span>
                      </div>
                    </div>
                    {/* Column 2: Time & Attendees */}
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                        <div className="bg-yellow-200 rounded-full p-2 mr-3 sm:mr-4 group-hover:bg-yellow-300 transition-colors duration-300 border border-yellow-300 flex-shrink-0">
                          <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
                        </div>
                        <span className="font-medium text-sm sm:text-base">
                          {event.time}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                        <div className="bg-yellow-200 rounded-full p-2 mr-3 sm:mr-4 group-hover:bg-yellow-300 transition-colors duration-300 border border-yellow-300 flex-shrink-0">
                          <Users className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
                        </div>
                        <span className="font-medium text-sm sm:text-base">
                          {event.attendees
                            ? `${event.attendees} Expected`
                            : "Attendees Info Soon"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Yellow Glow Border */}
                <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-yellow-400/30 group-hover:shadow-lg group-hover:shadow-yellow-400/20 transition-all duration-500"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;
