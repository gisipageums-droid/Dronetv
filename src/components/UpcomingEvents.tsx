

import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, Clock, Users, ArrowRight, CalendarDays } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { EVENTS_API, LAMBDA } from '../lib/apiConfig';
import ContentCard from './common/ContentCard';

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

// event.date comes as "YYYY-MM-DD to YYYY-MM-DD" — an event is ended once its
// end date has fully passed. Unparseable dates are kept (can't confirm ended).
function isEventEnded(dateStr: string): boolean {
  if (!dateStr) return false;
  const parts = dateStr.split(' to ').map((s) => s.trim());
  const endStr = parts[1] || parts[0];
  const endDate = new Date(endStr);
  if (isNaN(endDate.getTime())) return false;
  endDate.setHours(23, 59, 59, 999);
  return endDate.getTime() < Date.now();
}

function eventSlug(event: EventCard): string {
  let slug = (event as any).cleanUrl || (event as any).urlSlug || event.name;
  if (slug && slug.startsWith("http")) {
    slug = slug.split("/").pop() || event.name;
  }
  return slug;
}

const UpcomingEvents = () => {
  const navigate = useNavigate();

  // 🔁 yahan change: events ko state se manage karenge
  const [events, setEvents] = useState<EventCard[]>([]);

  useEffect(() => {
    axios
      .get(
        EVENTS_API ? `${EVENTS_API}/events-dashboard?viewType=main` : `${LAMBDA.events}/events-dashboard?viewType=main`
      )
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data.cards)) {

          // 👇 API ke cards ko UI wale format me convert kar rahe hain
          const apiEvents: EventCard[] = res.data.cards.map((card: any) => ({
            id: card.eventId,
            name: card.eventName,
            description: card.shortDescription,
            date: card.eventDate, // "2026-04-17 to 2026-04-18"
            time: card.eventTime,
            location: card.location,
            attendees: "Limited Seats", // API me direct field nahi hai – aap chahe toh hata sakte
            // Some records store a stale "/assets/default-event-image.png"
            // path from an older build that never shipped that file (404s
            // today) - treat it the same as "no image" so the real fallback
            // below kicks in instead of a broken <img>.
            image:
              [card.heroBannerImage, card.previewImage].find(
                (src) => src && src !== "/assets/default-event-image.png"
              ) || "/images/droneexpo_cover.jpg",
            price: "Premium",
            type: "Expo & Conference",
            status: card.isApproved ? "upcoming" : "draft",
            featured: true,
            urlSlug: card.urlSlug,
            cleanUrl: card.cleanUrl,
          }));

          // 🟡 Ab state me API se aaya data set kar rahe (ended events hide out)
          setEvents(apiEvents.filter((e) => !isEventEnded(e.date)));
        }
      })
      .catch((err) => {
        // yaha aap chahe toh toast / alert de sakte ho
        // staticEvents already state me hai, to UI blank nahi hoga
      });
  }, []);

  return (
    <section className="py-20 bg-brand-yellow-soft relative overflow-hidden min-h-screen">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-brand-yellow-soft/20 rounded-full animate-pulse blur-2xl"></div>
        <div
          className="absolute bottom-20 right-10 w-40 h-40 bg-brand-yellow/20 rounded-full animate-pulse blur-2xl"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black text-ink mb-4 tracking-tight">
            <span>Upcoming Events</span>
          </h2>
          <p className="text-xl text-ink-paragraph max-w-2xl mx-auto">
            Connect, learn, and network at industry-leading events
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-brand-yellow to-brand-gold mx-auto rounded-full mt-6"></div>
        </div>

        {/* Dynamic Layout: Center if single event, grid if multiple */}
        <div
          className={`w-full ${events.length === 1
            ? "flex justify-center"
            : "grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8"
            }`}
        >
          {events.map((event) => (
            <ContentCard
              key={event.id}
              image={event.image}
              imageAlt={event.name}
              imageFallback={<CalendarDays className="h-12 w-12 text-brand-yellow" />}
              className={events.length === 1 ? 'max-w-xl w-full' : 'w-full'}
              onClick={() => navigate(`/event/${eventSlug(event)}`)}
            >
              <span className="bg-brand-yellow-soft text-brand-gold text-xs font-bold px-2 py-0.5 rounded mb-2 inline-block self-start">
                {event.price || 'Premium'}
              </span>
              <h3 className="text-lg font-bold text-ink leading-snug mb-3 line-clamp-2">
                {event.name}
              </h3>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-ink-paragraph">
                  <Calendar className="h-4 w-4 text-brand-gold flex-shrink-0" />
                  <span className="line-clamp-1">{event.date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-ink-paragraph">
                  <MapPin className="h-4 w-4 text-brand-gold flex-shrink-0" />
                  <span className="line-clamp-1">{event.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-ink-paragraph">
                  <Clock className="h-4 w-4 text-brand-gold flex-shrink-0" />
                  <span className="line-clamp-1">{event.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-ink-paragraph">
                  <Users className="h-4 w-4 text-brand-gold flex-shrink-0" />
                  <span className="line-clamp-1">{event.attendees ? `${event.attendees} Expected` : 'Attendees Info Soon'}</span>
                </div>
              </div>

              <Link
                to={`/event/${eventSlug(event)}`}
                onClick={(e) => e.stopPropagation()}
                className="mt-auto inline-flex items-center justify-center gap-2 bg-brand-yellow text-ink px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-brand-yellow-soft transition-colors"
              >
                Learn More <ArrowRight className="h-4 w-4" />
              </Link>
            </ContentCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;
