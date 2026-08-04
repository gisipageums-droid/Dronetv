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
const KEYWORDS = ['conference', 'summit', 'congress', 'symposium', 'forum'];

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

const staticConferences = [
  { id: 'sc1', badge: 'India', title: 'Drone International Expo Technical Conference 2026', date: '24 June 2026', location: 'Bharat Mandapam, New Delhi', time: '11:00 AM – 5:00 PM', desc: 'A one-day technical conference running alongside the Drone International Expo. Covers drone technology advancements, market trends, regulatory updates, and operational insights across agriculture, logistics, defence, and infrastructure inspection.', tags: ['Regulations', 'Market Intelligence', 'Technology Trends', 'Agriculture', 'Defence'], type: 'India' },
  { id: 'sc2', badge: 'USA', title: 'Next Generation UAS Summit 2026', date: 'United States', location: 'United States', time: '', desc: 'Focused on advancing drone capability for military and defence applications. Relevant for Indian defence-oriented drone companies and export-focused manufacturers tracking global procurement trends.', tags: ['Defence', 'Military UAS', 'Global'], type: 'Global' },
  { id: 'sc3', badge: 'UAE', title: '4th Geospatial & Space Technology Forum 2026', date: 'United Arab Emirates', location: 'United Arab Emirates', time: '', desc: 'Unites geospatial intelligence and space innovation. Directly relevant to DroneTv\'s GIS vertical and Indian GIS companies tracking global standards and emerging technologies in spatial data.', tags: ['GIS', 'Geospatial', 'Space Tech', 'Global'], type: 'Global' },
];

export default function ConferencesPage() {
  const [events, setEvents] = useState<RawEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  const toggleExpanded = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

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
    <div className="pt-[104px] min-h-screen bg-surface-main">
      <CompactHero
        title={<>Drone <span>Conferences</span></>}
        stats={[
          { n: events.length || '0', l: 'Conferences' },
          { n: 'Expert', l: 'Speakers' },
        ]}
      />

      <div className="max-w-6xl mx-auto px-6 py-5">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-caption" />
          <input type="text" placeholder="Search conferences..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-ink-light rounded-xl text-sm focus:outline-none focus:border-brand-yellow" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-12 lg:flex lg:items-start lg:gap-6">
        <div className="flex-1 min-w-0">
        {loading ? (
          <div className="text-center py-16 text-ink-caption">Loading conferences...</div>
        ) : events.length === 0 ? (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {withInlineAds(staticConferences, conf => (
                <ContentCard key={conf.id} imageFallback={<span className="text-brand-yellow text-4xl">🎤</span>}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-status-info/15 text-status-info text-xs font-bold px-2 py-0.5 rounded">Conference</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${conf.type === 'India' ? 'bg-status-success/15 text-status-success' : 'bg-ink-light text-ink-paragraph'}`}>{conf.badge}</span>
                  </div>
                  <h3 className="text-sm font-bold text-ink leading-snug mb-2 line-clamp-2">{conf.title}</h3>
                  <div className="mb-3">
                    <p className={`text-xs text-ink-caption leading-relaxed ${expandedIds.has(conf.id) ? '' : 'line-clamp-3'}`}>{conf.desc}</p>
                    {conf.desc.length > 140 && (
                      <button onClick={() => toggleExpanded(conf.id)} className="text-xs font-bold text-brand-gold hover:text-brand-yellow mt-1">
                        {expandedIds.has(conf.id) ? 'Show less' : 'Read more'}
                      </button>
                    )}
                  </div>
                  <div className="mt-auto pt-3 border-t border-ink-light">
                    <div className="space-y-1 mb-2">
                      <div className="flex items-center gap-1.5 text-xs text-ink-caption"><Calendar className="w-3 h-3 flex-shrink-0" />{conf.date}</div>
                      <div className="flex items-center gap-1.5 text-xs text-ink-caption"><MapPin className="w-3 h-3 flex-shrink-0" />{conf.location}</div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {conf.tags.map(tag => <span key={tag} className="bg-ink-light text-ink-paragraph text-xs px-2 py-0.5 rounded-full">{tag}</span>)}
                    </div>
                  </div>
                </ContentCard>
              ))}
            </div>
            <div className="bg-ink rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-white text-sm mb-1">DroneTv.in Covers Every Major Conference</h3>
                <p className="text-xs text-white/60 max-w-lg">DroneTv.in publishes post-conference summaries, video interviews with speakers, and press releases from major drone policy events.</p>
              </div>
              <a href="mailto:bd@dronetv.in?subject=Submit Conference" className="flex-shrink-0 px-4 py-2 bg-brand-yellow text-ink text-sm font-bold rounded-lg hover:bg-brand-yellow-soft transition-colors">Submit a Conference</a>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-8 text-ink-caption">No conferences match your search.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {withInlineAds(filtered, event => (
              <ContentCard
                key={event.eventId}
                image={getEventImage(event.previewImage, event.thumbnailUrl, event.heroBannerImage) || undefined}
                imageAlt={event.eventName}
                imageFallback={<span className="text-brand-yellow text-4xl">🎤</span>}
                onClick={() => {
                  let slug = event.cleanUrl || event.urlSlug || '';
                  if (slug.startsWith('http')) slug = slug.split('/').pop() || slug;
                  navigate(`/event/${slug}`);
                }}
              >
                <span className="bg-status-info/15 text-status-info text-xs font-bold px-2 py-0.5 rounded mb-2 inline-block self-start">Conference</span>
                <h3 className="text-sm font-bold text-ink leading-snug mb-2 line-clamp-2">{event.eventName}</h3>
                {event.shortDescription && <p className="text-xs text-ink-caption leading-relaxed mb-3 line-clamp-2">{event.shortDescription}</p>}
                <div className="mt-auto pt-3 border-t border-ink-light space-y-1">
                  {event.eventDate && <div className="flex items-center gap-1.5 text-xs text-ink-caption"><Calendar className="w-3 h-3 flex-shrink-0" />{event.eventDate}</div>}
                  {event.location && <div className="flex items-center gap-1.5 text-xs text-ink-caption"><MapPin className="w-3 h-3 flex-shrink-0" />{event.location}</div>}
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
