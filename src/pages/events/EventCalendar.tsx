import { useState } from 'react';
import { Link } from 'react-router-dom';

const events = [
  {
    dateShort: 'Jun 24–25',
    year: '2026',
    title: 'Drone International Expo 2026',
    location: 'New Delhi',
    type: 'Expo',
    typeClass: 'bg-orange-100 text-orange-700',
    badge: 'Next Event',
    badgeClass: 'bg-yellow-400 text-black',
    mediaPartner: true,
  },
  {
    dateShort: 'Jun 24',
    year: '2026',
    title: 'Drone International Technical Conference',
    location: 'New Delhi',
    type: 'Conference',
    typeClass: 'bg-blue-100 text-blue-700',
    badge: null,
    badgeClass: '',
    mediaPartner: false,
  },
  {
    dateShort: 'Jun 28',
    year: '2026',
    title: 'BVLOS Regulations Webinar',
    location: 'Online',
    type: 'Webinar',
    typeClass: 'bg-green-100 text-green-700',
    badge: null,
    badgeClass: '',
    mediaPartner: false,
  },
  {
    dateShort: 'Jul 5',
    year: '2026',
    title: 'Agriculture Drone ROI Webinar',
    location: 'Online',
    type: 'Webinar',
    typeClass: 'bg-green-100 text-green-700',
    badge: null,
    badgeClass: '',
    mediaPartner: false,
  },
  {
    dateShort: 'Sep 2026',
    year: '',
    title: 'Drone Expo 2026 Bengaluru',
    location: 'Bengaluru',
    type: 'Expo',
    typeClass: 'bg-orange-100 text-orange-700',
    badge: null,
    badgeClass: '',
    mediaPartner: true,
  },
  {
    dateShort: 'TBA',
    year: '2026',
    title: 'IFSEC 2026',
    location: 'India (Venue TBC)',
    type: 'Expo',
    typeClass: 'bg-orange-100 text-orange-700',
    badge: 'Coming Soon',
    badgeClass: 'bg-gray-200 text-gray-600',
    mediaPartner: true,
  },
];

const categories = ['All', 'Expo', 'Conference', 'Competition', 'Webinar', 'Meetup'];
const months = ['All Months', 'June 2026', 'July 2026', 'August 2026', 'September 2026'];
const locations = ['All Locations', 'New Delhi', 'Bengaluru', 'Hyderabad', 'Mumbai', 'Online'];

export default function EventCalendarPage() {
  const [category, setCategory] = useState('All');
  const [month, setMonth] = useState('All Months');
  const [location, setLocation] = useState('All Locations');

  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Events</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
              Upcoming Drone <span className="text-yellow-400 not-italic">Events Calendar</span>
            </h1>
            <p className="text-sm text-white/60 leading-relaxed max-w-lg">
              All drone industry events in one place — expos, conferences, webinars, workshops, and meetups across India and globally.
            </p>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">5+</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Events Listed</span>
            </div>
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">Free</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">To Submit</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-wrap gap-3 mb-6">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-yellow-400"
          >
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-yellow-400"
          >
            {months.map((m) => <option key={m}>{m}</option>)}
          </select>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-yellow-400"
          >
            {locations.map((l) => <option key={l}>{l}</option>)}
          </select>
        </div>

        <div className="space-y-3 mb-8">
          {events.map((ev, i) => (
            <div
              key={i}
              className={`bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow overflow-hidden flex ${
                ev.badge === 'Next Event' ? 'border-yellow-300' : 'border-gray-200'
              }`}
            >
              <div className="bg-black w-20 flex-shrink-0 flex flex-col items-center justify-center py-4 px-2 text-center">
                <span className="text-yellow-400 font-extrabold text-sm leading-tight block">{ev.dateShort}</span>
                {ev.year && <span className="text-white/40 text-xs mt-0.5">{ev.year}</span>}
              </div>
              <div className="p-4 flex-1 flex flex-wrap items-center gap-3 justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${ev.typeClass}`}>{ev.type}</span>
                    {ev.badge && (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${ev.badgeClass}`}>{ev.badge}</span>
                    )}
                    {ev.mediaPartner && (
                      <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded">DroneTv Media Partner</span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">{ev.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">📍 {ev.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-yellow-400 rounded-xl p-6 flex items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-black text-base mb-1">Submit an Event</h3>
            <p className="text-black/70 text-sm">Free listing for drone industry events. Expos, webinars, competitions, and meetups welcome.</p>
          </div>
          <Link
            to="/contact"
            className="bg-black text-white font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-gray-900 transition-colors whitespace-nowrap"
          >
            Submit Event →
          </Link>
        </div>
      </div>
    </div>
  );
}
