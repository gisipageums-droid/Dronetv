import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Search } from 'lucide-react';
import { EVENTS_API, LAMBDA } from '../../lib/apiConfig';

interface RawEvent {
  eventId: string;
  eventName: string;
  shortDescription: string;
  eventDate: string;
  location: string;
  category: string;
  isApproved: boolean;
  urlSlug?: string;
  cleanUrl?: string;
  previewImage?: string;
  thumbnailUrl?: string;
}

const EVENTS_DASHBOARD_URL = EVENTS_API ? `${EVENTS_API}/events-dashboard?viewType=main` : `${LAMBDA.events}/events-dashboard?viewType=main`;

function getEventImage(previewImage?: string, thumbnailUrl?: string): string | null {
  for (const url of [previewImage, thumbnailUrl]) {
    if (!url) continue;
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
      if (m) return `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg`;
      continue;
    }
    return url;
  }
  return null;
}

export default function EventCalendarPage() {
  const [events, setEvents] = useState<RawEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    fetch(EVENTS_DASHBOARD_URL, { signal: controller.signal })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(data => {
        const all: RawEvent[] = Array.isArray(data.cards) ? data.cards : [];
        setEvents(all);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const categories = ['All', ...Array.from(new Set(events.map(e => e.category || 'General').filter(Boolean)))];

  const filtered = events.filter(e => {
    const matchSearch = (e.eventName || '').toLowerCase().includes(search.toLowerCase()) ||
      (e.location || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'All' || (e.category || 'General') === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Events</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">Event <span className="text-yellow-400">Calendar</span></h1>
            <p className="text-sm text-white/60 max-w-lg">All drone industry events in India — expos, conferences, workshops, competitions, webinars, and meetups.</p>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">{events.length || '0'}</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Total Events</span>
            </div>
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">2026</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Season</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search events..." value={search} onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-yellow-400 w-full" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${activeCategory === cat ? 'bg-yellow-400 border-yellow-400 text-black' : 'border-gray-200 text-gray-500 hover:border-yellow-400'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-12">
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading events...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No events found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(event => (
              <div key={event.eventId} onClick={() => {
                let slug = event.cleanUrl || event.urlSlug || '';
                if (slug.startsWith('http')) slug = slug.split('/').pop() || slug;
                navigate(`/event/${slug}`);
              }}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden">
                {getEventImage(event.previewImage, event.thumbnailUrl) ? (
                  <img src={getEventImage(event.previewImage, event.thumbnailUrl)!} alt={event.eventName} className="w-full h-40 object-cover" />
                ) : (
                  <div className="w-full h-40 bg-zinc-900 flex items-center justify-center">
                    <span className="text-yellow-400 text-4xl">🗓️</span>
                  </div>
                )}
                <div className="p-4">
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-0.5 rounded mb-2 inline-block capitalize">{event.category || 'Event'}</span>
                  <h3 className="text-sm font-bold text-gray-900 leading-snug mb-2">{event.eventName}</h3>
                  {event.shortDescription && <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">{event.shortDescription}</p>}
                  <div className="space-y-1">
                    {event.eventDate && <div className="flex items-center gap-1.5 text-xs text-gray-500"><Calendar className="w-3 h-3 flex-shrink-0" />{event.eventDate}</div>}
                    {event.location && <div className="flex items-center gap-1.5 text-xs text-gray-500"><MapPin className="w-3 h-3 flex-shrink-0" />{event.location}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
