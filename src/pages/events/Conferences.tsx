import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Search } from 'lucide-react';

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

const EVENTS_API = "https://o9og9e2rik.execute-api.ap-south-1.amazonaws.com/prod/events-dashboard?viewType=main";
const KEYWORDS = ['conference', 'summit', 'congress', 'symposium', 'forum'];

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

export default function ConferencesPage() {
  const [events, setEvents] = useState<RawEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    fetch(EVENTS_API, { signal: controller.signal })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(data => {
        const all: RawEvent[] = Array.isArray(data.cards) ? data.cards : [];
        const filtered = all.filter(e => {
          const cat = (e.category || '').toLowerCase();
          return KEYWORDS.some(k => cat.includes(k));
        });
        setEvents(filtered.length > 0 ? filtered : all);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const filtered = events.filter(e =>
    (e.eventName || '').toLowerCase().includes(search.toLowerCase()) ||
    (e.location || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      <div className="bg-black text-white relative">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Events</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Drone <span className="text-yellow-400">Conferences</span></h1>
            <p className="text-sm text-white/60 max-w-lg">Industry conferences, summits, and forums bringing together India's drone ecosystem leaders and policymakers.</p>
          </div>
          <div className="flex-shrink-0">
            <span className="text-4xl font-extrabold text-yellow-400 block leading-none">{events.length}</span>
            <span className="text-xs text-white/50 font-semibold uppercase mt-1 block">Conferences</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-5">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search conferences..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-yellow-400" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-12">
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading conferences...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No conferences found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(event => (
              <div key={event.eventId} onClick={() => navigate(`/event/${event.cleanUrl || event.urlSlug}`)}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden">
                {getEventImage(event.previewImage, event.thumbnailUrl) ? (
                  <img src={getEventImage(event.previewImage, event.thumbnailUrl)!} alt={event.eventName} className="w-full h-40 object-cover" />
                ) : (
                  <div className="w-full h-40 bg-zinc-900 flex items-center justify-center">
                    <span className="text-yellow-400 text-4xl">🎤</span>
                  </div>
                )}
                <div className="p-4">
                  <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded mb-2 inline-block">Conference</span>
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
