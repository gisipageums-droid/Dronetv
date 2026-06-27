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
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Events</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">Drone <span className="text-yellow-400">Workshops</span></h1>
            <p className="text-sm text-white/60 max-w-lg">Hands-on training workshops, bootcamps, and skill-building sessions for pilots, operators, and technicians.</p>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">{events.length || '0'}</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Workshops</span>
            </div>
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">Hands</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">On Training</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-5">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search workshops..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-yellow-400" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-12 space-y-8">
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading workshops...</div>
        ) : events.length > 0 ? (
          filtered.length === 0
            ? <div className="text-center py-8 text-gray-400">No workshops match your search.</div>
            : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map(event => (
                  <div key={event.eventId} onClick={() => navigate(`/event/${event.cleanUrl || event.urlSlug}`)}
                    className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden">
                    {getEventImage(event.previewImage, event.thumbnailUrl) ? (
                      <img src={getEventImage(event.previewImage, event.thumbnailUrl)!} alt={event.eventName} className="w-full h-40 object-cover" />
                    ) : (
                      <div className="w-full h-40 bg-zinc-900 flex items-center justify-center">
                        <span className="text-yellow-400 text-4xl">🛠️</span>
                      </div>
                    )}
                    <div className="p-4">
                      <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-0.5 rounded mb-2 inline-block">Workshop</span>
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
        ) : (
          <div className="space-y-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-start gap-4">
              <span className="text-3xl flex-shrink-0">🛠️</span>
              <div>
                <h3 className="font-bold text-gray-900 text-base mb-1">No workshops currently listed</h3>
                <p className="text-sm text-gray-500 mb-3">Running a DGCA-approved drone, GIS, or AI workshop in India? Submit it here and we will list it free on DroneTv.in within 48 hours.</p>
                <a href="mailto:bd@dronetv.in?subject=Submit Workshop" className="inline-block px-4 py-2 bg-yellow-400 text-black text-sm font-bold rounded-lg hover:bg-yellow-300 transition-colors">Submit Your Workshop</a>
              </div>
            </div>
          </div>
        )}

        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
            <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Categories</span>
            Workshop Categories on DroneTv.in
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workshopCategories.map((c, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <div className="text-2xl mb-2">{c.icon}</div>
                <h3 className="font-bold text-gray-900 text-sm mb-2">{c.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
            <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Expect</span>
            What to Expect at Drone Workshops
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workshopExpect.map((e, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-start gap-4">
                <span className="text-2xl flex-shrink-0">{e.icon}</span>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1">{e.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{e.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-white text-sm mb-1">Drone Academy Private Limited</h3>
            <p className="text-xs text-white/60 max-w-lg">DroneTv.in is operated by Drone Academy Private Limited, which is directly involved in drone training and certification in India. Workshops listed here are verified and relevant for both new entrants and experienced professionals upgrading their skills.</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <a href="mailto:bd@dronetv.in?subject=Submit Workshop" className="px-4 py-2 bg-yellow-400 text-black text-sm font-bold rounded-lg hover:bg-yellow-300 transition-colors">Submit Your Workshop Free</a>
            <a href="/contact" className="px-4 py-2 border border-white/20 text-white text-sm font-semibold rounded-lg hover:bg-white/10 transition-colors">Contact Us →</a>
          </div>
        </div>
      </div>
    </div>
  );
}
