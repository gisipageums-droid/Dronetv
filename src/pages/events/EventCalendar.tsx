import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Search } from 'lucide-react';
import { EVENTS_API, LAMBDA } from '../../lib/apiConfig';
import CompactHero from '../../components/common/CompactHero';
import ContentCard from '../../components/common/ContentCard';
import { withInlineAds, AdSidebarRail } from '../../components/common/adCreatives';

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

function getEventImage(previewImage?: string, thumbnailUrl?: string, heroBannerImage?: string): string | null {
  for (const url of [previewImage, thumbnailUrl, heroBannerImage]) {
    if (!url) continue;
    // The event-publish backend sometimes stores a relative placeholder path here
    // instead of the real uploaded image URL — that path 404s to the SPA's own
    // index.html, not an image, so skip it and fall through to heroBannerImage.
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
    <div className="pt-[104px] min-h-screen bg-ink-offwhite">
      <CompactHero
        title={<>Event <span>Calendar</span></>}
        stats={[
          { n: events.length || '0', l: 'Total Events' },
          { n: '2026', l: 'Season' },
        ]}
      />

      <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-caption" />
          <input type="text" placeholder="Search events..." value={search} onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2.5 border border-ink-light rounded-xl text-sm focus:outline-none focus:border-brand-yellow w-full" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${activeCategory === cat ? 'bg-brand-yellow border-brand-yellow text-ink' : 'border-ink-light text-ink-caption hover:border-brand-yellow'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-12 lg:flex lg:items-start lg:gap-6">
        <div className="flex-1 min-w-0">
        {loading ? (
          <div className="text-center py-16 text-ink-caption">Loading events...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-ink-caption">No events found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {withInlineAds(filtered, event => (
              <ContentCard
                key={event.eventId}
                image={getEventImage(event.previewImage, event.thumbnailUrl, event.heroBannerImage) || undefined}
                imageAlt={event.eventName}
                imageFallback={<span className="text-brand-yellow text-4xl">🗓️</span>}
                onClick={() => {
                  let slug = event.cleanUrl || event.urlSlug || '';
                  if (slug.startsWith('http')) slug = slug.split('/').pop() || slug;
                  navigate(`/event/${slug}`);
                }}
              >
                <span className="bg-brand-yellow-soft text-brand-gold text-xs font-bold px-2 py-0.5 rounded mb-2 inline-block capitalize self-start">{event.category || 'Event'}</span>
                <h3 className="text-sm font-bold text-ink leading-snug mb-2 line-clamp-2">{event.eventName}</h3>
                {event.shortDescription && <p className="text-xs text-ink-caption leading-relaxed mb-3 line-clamp-2">{event.shortDescription}</p>}
                <div className="mt-auto pt-3 border-t border-ink-light space-y-1">
                  {event.eventDate && <div className="flex items-center gap-1.5 text-xs text-ink-caption"><Calendar className="w-3 h-3 flex-shrink-0" /><span className="line-clamp-1">{event.eventDate}</span></div>}
                  {event.location && <div className="flex items-center gap-1.5 text-xs text-ink-caption"><MapPin className="w-3 h-3 flex-shrink-0" /><span className="line-clamp-1">{event.location}</span></div>}
                </div>
              </ContentCard>
            ))}
          </div>
        )}
        </div>
        <AdSidebarRail />
      </div>
    </div>
  );
}
