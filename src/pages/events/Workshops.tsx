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
const KEYWORDS = ['workshop', 'training', 'bootcamp', 'hands-on'];

const workshopCategories = [
  { icon: '🪪', title: 'DGCA Remote Pilot Certificate Workshops', desc: 'Hands-on training for Small and Medium category drones. Required for commercial drone operations under Drone Rules 2021. Typically 3–5 days, includes simulator training and practical flying sessions with DGCA-approved instructors.' },
  { icon: '🗺️', title: 'GIS and Aerial Mapping Workshops', desc: 'For survey professionals and geospatial teams. Covers photogrammetry, LiDAR data collection, mission planning using Pix4D and QGIS, and achieving survey-grade accuracy with drone payloads.' },
  { icon: '🌾', title: 'Agriculture Drone Operator Training', desc: 'Practical workshops on precision spraying, crop monitoring, and NDVI mapping. Conducted across Andhra Pradesh, Maharashtra, Punjab, and Telangana. Covers regulatory compliance for agricultural drone operations.' },
  { icon: '🔧', title: 'Drone Maintenance and Repair Workshops', desc: 'Technical workshops on frame building, ESC calibration, battery management, motor replacement, and flight controller tuning. Targeted at technicians, service staff, and engineering students.' },
  { icon: '🎮', title: 'FPV and Drone Building Workshops', desc: 'Beginner to advanced sessions on building custom drones, FPV racing setups, and payload integration. Popular with engineering college students and hobbyists making the transition to commercial drone operations.' },
  { icon: '🤖', title: 'AI and Autonomous Systems Workshops', desc: 'For software developers and engineers working on drone autonomy, computer vision, path planning, and AI-based inspection systems using platforms like ROS, MAVSDK, and ArduPilot.' },
];

const workshopExpect = [
  { icon: '✈️', title: 'Certified Trainers', desc: 'All workshops listed here are run by DGCA-approved RPTOs or industry-recognised instructors.' },
  { icon: '🕹️', title: 'Hands-On Flying', desc: 'Practical time on actual drone hardware — not just theory. Participants fly real missions during the course.' },
  { icon: '📄', title: 'Course Certificates', desc: 'Completion certificates recognised by the industry. DGCA workshops result in RPC eligibility upon exam clearance.' },
  { icon: '💼', title: 'Job Placement Links', desc: 'Several RPTOs offer placement assistance connecting graduates with drone service companies and operators.' },
];

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

export default function WorkshopsPage() {
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
    <div className="pt-[104px] min-h-screen bg-ink-offwhite">
      <CompactHero
        title={<>Drone <span>Workshops</span></>}
        stats={[
          { n: events.length || '0', l: 'Workshops' },
          { n: 'Hands', l: 'On Training' },
        ]}
      />

      <div className="max-w-6xl mx-auto px-6 py-5">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-caption" />
          <input type="text" placeholder="Search workshops..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-ink-light rounded-xl text-sm focus:outline-none focus:border-brand-yellow" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-12 lg:flex lg:items-start lg:gap-6">
        <div className="flex-1 min-w-0 space-y-8">
        {loading ? (
          <div className="text-center py-16 text-ink-caption">Loading workshops...</div>
        ) : events.length > 0 ? (
          filtered.length === 0
            ? <div className="text-center py-8 text-ink-caption">No workshops match your search.</div>
            : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {withInlineAds(filtered, event => (
                  <ContentCard
                    key={event.eventId}
                    image={getEventImage(event.previewImage, event.thumbnailUrl, event.heroBannerImage) || undefined}
                    imageAlt={event.eventName}
                    imageFallback={<span className="text-brand-yellow text-4xl">🛠️</span>}
                    onClick={() => {
                      let slug = event.cleanUrl || event.urlSlug || '';
                      if (slug.startsWith('http')) slug = slug.split('/').pop() || slug;
                      navigate(`/event/${slug}`);
                    }}
                  >
                    <span className="bg-status-success/15 text-status-success text-xs font-bold px-2 py-0.5 rounded mb-2 inline-block self-start">Workshop</span>
                    <h3 className="text-sm font-bold text-ink leading-snug mb-2 line-clamp-2">{event.eventName}</h3>
                    {event.shortDescription && <p className="text-xs text-ink-caption leading-relaxed mb-3 line-clamp-2">{event.shortDescription}</p>}
                    <div className="mt-auto pt-3 border-t border-ink-light space-y-1">
                      {event.eventDate && <div className="flex items-center gap-1.5 text-xs text-ink-caption"><Calendar className="w-3 h-3 flex-shrink-0" />{event.eventDate}</div>}
                      {event.location && <div className="flex items-center gap-1.5 text-xs text-ink-caption"><MapPin className="w-3 h-3 flex-shrink-0" />{event.location}</div>}
                    </div>
                  </ContentCard>
                ))}
              </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-surface-card rounded-xl border border-ink-light p-6 flex items-start gap-4">
              <span className="text-3xl flex-shrink-0">🛠️</span>
              <div>
                <h3 className="font-bold text-ink text-base mb-1">No workshops currently listed</h3>
                <p className="text-sm text-ink-caption mb-3">Running a DGCA-approved drone, GIS, or AI workshop in India? Submit it here and we will list it free on DroneTv.in within 48 hours.</p>
                <a href="mailto:bd@dronetv.in?subject=Submit Workshop" className="inline-block px-4 py-2 bg-brand-yellow text-ink text-sm font-bold rounded-lg hover:bg-brand-yellow-soft transition-colors">Submit Your Workshop</a>
              </div>
            </div>
          </div>
        )}

        <div>
          <h2 className="text-lg font-bold text-ink flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-ink-light after:content-['']">
            <span className="bg-brand-yellow text-ink text-xs font-bold px-2 py-0.5 rounded">Categories</span>
            Workshop Categories on DroneTv.in
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workshopCategories.map((c, i) => (
              <div key={i} className="bg-surface-card rounded-xl border border-ink-light shadow-sm p-5">
                <div className="text-2xl mb-2">{c.icon}</div>
                <h3 className="font-bold text-ink text-sm mb-2">{c.title}</h3>
                <p className="text-xs text-ink-caption leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-ink flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-ink-light after:content-['']">
            <span className="bg-brand-yellow text-ink text-xs font-bold px-2 py-0.5 rounded">Expect</span>
            What to Expect at Drone Workshops
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workshopExpect.map((e, i) => (
              <div key={i} className="bg-surface-card rounded-xl border border-ink-light shadow-sm p-5 flex items-start gap-4">
                <span className="text-2xl flex-shrink-0">{e.icon}</span>
                <div>
                  <h3 className="font-bold text-ink text-sm mb-1">{e.title}</h3>
                  <p className="text-xs text-ink-caption leading-relaxed">{e.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-ink rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-white text-sm mb-1">Drone Academy Private Limited</h3>
            <p className="text-xs text-white/60 max-w-lg">DroneTv.in is operated by Drone Academy Private Limited, which is directly involved in drone training and certification in India. Workshops listed here are verified and relevant for both new entrants and experienced professionals upgrading their skills.</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <a href="mailto:bd@dronetv.in?subject=Submit Workshop" className="px-4 py-2 bg-brand-yellow text-ink text-sm font-bold rounded-lg hover:bg-brand-yellow-soft transition-colors">Submit Your Workshop Free</a>
            <a href="/contact" className="px-4 py-2 border border-white/20 text-white text-sm font-semibold rounded-lg hover:bg-white/10 transition-colors">Contact Us →</a>
          </div>
        </div>
        </div>
        <AdSidebarRail />
      </div>
    </div>
  );
}
