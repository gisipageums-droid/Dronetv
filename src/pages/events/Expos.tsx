import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Search } from 'lucide-react';
import { EVENTS_API, LAMBDA } from '../../lib/apiConfig';
import CompactHero from '../../components/common/CompactHero';
import ContentCard from '../../components/common/ContentCard';

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
  heroBannerImage?: string;
}

const EVENTS_DASHBOARD_URL = EVENTS_API ? `${EVENTS_API}/events-dashboard?viewType=main` : `${LAMBDA.events}/events-dashboard?viewType=main`;
const KEYWORDS = ['expo', 'exhibition', 'trade show', 'trade fair'];

function getEventImage(previewImage?: string, thumbnailUrl?: string, heroBannerImage?: string): string | null {
  for (const url of [previewImage, thumbnailUrl, heroBannerImage]) {
    if (!url) continue;
    if (!url.startsWith('http')) continue;
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
      if (m) return `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg`;
      continue;
    }
    return url;
  }
  return null;
}

export default function ExposPage() {
  const [events, setEvents] = useState<RawEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    fetch(EVENTS_DASHBOARD_URL, { signal: controller.signal })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(data => {
        const all: RawEvent[] = Array.isArray(data.cards) ? data.cards : [];
        const filtered = all.filter(e => {
          const text = `${e.category || ''} ${e.eventName || ''} ${e.shortDescription || ''}`.toLowerCase();
          return KEYWORDS.some(k => text.includes(k));
        });
        setEvents(filtered);
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
      <CompactHero
        title={<>Drone <span>Expos</span></>}
        stats={[
          { n: events.length || '0', l: 'Expos' },
          { n: 'Live', l: 'Floor Coverage' },
        ]}
      />

      <div className="max-w-6xl mx-auto px-6 py-5">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search expos..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-yellow-400" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-12">
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading expos...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No expos found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(event => (
              <ContentCard
                key={event.eventId}
                image={getEventImage(event.previewImage, event.thumbnailUrl, event.heroBannerImage) || undefined}
                imageAlt={event.eventName}
                imageFallback={<span className="text-yellow-400 text-4xl">🏛️</span>}
                onClick={() => {
                  let slug = event.cleanUrl || event.urlSlug || '';
                  if (slug.startsWith('http')) slug = slug.split('/').pop() || slug;
                  navigate(`/event/${slug}`);
                }}
              >
                <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-0.5 rounded mb-2 inline-block self-start">Expo</span>
                <h3 className="text-sm font-bold text-gray-900 leading-snug mb-2 line-clamp-2">{event.eventName}</h3>
                {event.shortDescription && <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">{event.shortDescription}</p>}
                <div className="mt-auto pt-3 border-t border-gray-100 space-y-1">
                  {event.eventDate && <div className="flex items-center gap-1.5 text-xs text-gray-500"><Calendar className="w-3 h-3 flex-shrink-0" />{event.eventDate}</div>}
                  {event.location && <div className="flex items-center gap-1.5 text-xs text-gray-500"><MapPin className="w-3 h-3 flex-shrink-0" />{event.location}</div>}
                </div>
              </ContentCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
