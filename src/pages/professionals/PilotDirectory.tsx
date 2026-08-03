import { useState, useEffect } from 'react';
import { MapPin, Search, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PROFESSIONAL_API, LAMBDA } from '../../lib/apiConfig';
import CompactHero from '../../components/common/CompactHero';
import ContentCard from '../../components/common/ContentCard';
import { withInlineAds, AdSidebarRail } from '../../components/common/adCreatives';

const samplePilots = [
  { icon: '👨‍✈️', name: 'Rajesh K.', badge: 'RPC — Small & Medium Category', location: 'Hyderabad, Telangana', categories: ['Agriculture', 'GIS Mapping'], experience: '4 Years | 800+ Hours', tags: ['Agriculture Spraying', 'NDVI Mapping', 'AP Missions'] },
  { icon: '👩‍✈️', name: 'Priya S.', badge: 'RPC — Small Category', location: 'Bengaluru, Karnataka', categories: ['Cinematography'], experience: '2 Years | 350+ Hours', tags: ['Aerial Photography', 'Real Estate', 'Cinematography'] },
  { icon: '👨‍💼', name: 'Arun M.', badge: 'RPC — Medium Category', location: 'Mumbai, Maharashtra', categories: ['Survey / GIS'], experience: '6 Years | 1,200+ Hours', tags: ['LiDAR Survey', 'Photogrammetry', 'GIS Processing'] },
  { icon: '👨‍🔧', name: 'Sanjay R.', badge: 'RPC — Small, Medium & Large', location: 'Delhi NCR', categories: ['Inspection'], experience: '8 Years | 2,000+ Hours', tags: ['Infrastructure Inspection', 'Tower Survey', 'Pipeline Monitoring'] },
  { icon: '👩‍💻', name: 'Kavitha N.', badge: 'RPC — Small Category + GIS Specialist', location: 'Chennai, Tamil Nadu', categories: ['Survey / GIS'], experience: '3 Years | 500+ Hours', tags: ['GIS Analysis', 'Remote Sensing', 'QGIS'] },
  { icon: '👨‍🏫', name: 'Vikram P.', badge: 'RPC — Small & Medium + Instructor', location: 'Pune, Maharashtra', categories: ['Instructor'], experience: '5 Years | 900+ Hours | 200 Students', tags: ['Flight Instruction', 'DGCA Exam Prep', 'Simulator Training'] },
];

interface Professional {
  professionalId: string;
  professionalName: string;
  fullName: string;
  professionalDescription: string;
  location: string;
  categories: string[];
  previewImage: string;
  isApproved: boolean;
  isVisible: boolean;
  cleanUrl: string;
  urlSlug?: string;
  userName?: string;
  templateSelection?: string;
}

const PROFESSIONALS_API = PROFESSIONAL_API ? `${PROFESSIONAL_API}/professional-dashboard-cards?viewType=main` : `${LAMBDA.professional}/professional-dashboard-cards?viewType=main`;

export default function PilotDirectoryPage() {
  const [items, setItems] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    fetch(PROFESSIONALS_API, { signal: controller.signal })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(data => {
        const cards: Professional[] = Array.isArray(data.cards) ? data.cards : [];
        setItems(cards.filter(p => p.isApproved && p.isVisible));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const allCategories = Array.from(new Set(items.flatMap(i => i.categories || []).filter(Boolean)));
  const categories = items.length > 0
    ? ['All', ...allCategories]
    : ['All', 'Agriculture', 'Survey / GIS', 'Cinematography', 'Inspection', 'Instructor'];
  const cities = items.length > 0
    ? []
    : ['Hyderabad', 'Bengaluru', 'Mumbai', 'Delhi', 'Chennai', 'Pune'];

  const filtered = items.filter(i => {
    const matchCat = activeCategory === 'All' || (i.categories || []).includes(activeCategory);
    const matchSearch = !search ||
      (i.professionalName || i.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
      (i.location || '').toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="pt-[104px] min-h-screen bg-ink-offwhite">
      <CompactHero
        title={<>Pilot <span>Directory</span></>}
        stats={[
          { n: '39,890', l: 'Certified Pilots India' },
          { n: 'Free', l: 'To Create Profile' },
        ]}
      />

      <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-caption" />
            <input type="text" placeholder="Search pilots, locations..." value={search} onChange={e => setSearch(e.target.value)}
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
        {cities.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {cities.map(city => (
              <button key={city} onClick={() => setSearch(city)}
                className="px-3 py-1 rounded-full text-xs font-semibold border border-dashed border-ink-light text-ink-caption hover:border-brand-yellow hover:text-brand-yellow transition-colors">
                📍 {city}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-12 lg:flex lg:items-start lg:gap-6">
        <div className="flex-1 min-w-0">
        <h2 className="text-lg font-bold text-ink flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-ink-light after:content-['']">
          <span className="bg-brand-yellow text-ink text-xs font-bold px-2 py-0.5 rounded">Certified</span>
          Drone Pilots
        </h2>
        {loading ? (
          <div className="text-center py-10 text-ink-caption">Loading pilots...</div>
        ) : items.length === 0 ? (
          <div className="space-y-4">
            <div className="bg-surface-card rounded-xl border border-dashed border-ink-light p-6 text-center mb-4">
              <User className="w-8 h-8 text-ink-light mx-auto mb-2" />
              <p className="font-semibold text-ink-caption mb-1">Are you a DGCA-certified drone pilot?</p>
              <p className="text-sm text-ink-caption mb-3">Add your profile to DroneTv.in's Pilot Directory for free. Drone companies, service operators, and recruiters search here when they need pilots.</p>
              <button onClick={() => navigate('/professional/form')}
                className="bg-brand-yellow text-ink font-bold px-5 py-2 rounded-lg hover:bg-brand-yellow-soft transition-colors text-sm">
                Add Your Profile →
              </button>
            </div>
            <h3 className="text-sm font-bold text-ink-caption uppercase tracking-wide">Sample Pilot Profiles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {withInlineAds(samplePilots, (pilot, i) => (
                <ContentCard key={i} className="opacity-80">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-ink flex items-center justify-center text-xl flex-shrink-0">{pilot.icon}</div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-ink">{pilot.name}</h3>
                        <span className="bg-status-success/15 text-status-success text-xs font-bold px-1.5 py-0.5 rounded">✓ DGCA</span>
                      </div>
                      <p className="text-xs text-ink-caption">{pilot.badge}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-ink-caption mb-2"><MapPin className="w-3 h-3" />{pilot.location}</div>
                  <p className="text-xs text-ink-caption mb-2">{pilot.experience}</p>
                  <div className="flex flex-wrap gap-1 mt-auto pt-2">
                    {pilot.tags.map((tag, j) => <span key={j} className="bg-ink-light text-ink-paragraph text-xs px-2 py-0.5 rounded-full">{tag}</span>)}
                  </div>
                  <button className="mt-3 text-xs font-bold text-brand-gold hover:text-brand-yellow self-start">Contact →</button>
                </ContentCard>
              ))}
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-10 text-ink-caption">No pilots match your search.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {withInlineAds(filtered, item => (
              <ContentCard key={item.professionalId}>
                <div className="flex items-center gap-3 mb-3">
                  {item.previewImage ? (
                    <img src={item.previewImage} alt={item.professionalName || item.fullName} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-ink flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-brand-yellow" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm font-bold text-ink">{item.professionalName || item.fullName}</h3>
                    {item.categories && item.categories.length > 0 && (
                      <span className="text-xs text-ink-caption">{item.categories[0]}</span>
                    )}
                  </div>
                </div>
                {item.professionalDescription && (
                  <p className="text-xs text-ink-caption leading-relaxed mb-3 line-clamp-2">{item.professionalDescription}</p>
                )}
                <div className="mt-auto pt-2 space-y-1">
                  {item.location && <div className="flex items-center gap-1.5 text-xs text-ink-caption"><MapPin className="w-3 h-3" />{item.location}</div>}
                  {item.categories && item.categories.length > 1 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.categories.slice(1).map(cat => <span key={cat} className="bg-ink-light text-ink-paragraph text-xs px-2 py-0.5 rounded-full">{cat}</span>)}
                    </div>
                  )}
                  {(item.urlSlug || item.userName) && (
                    <a
                      href={`${item.templateSelection === "template-2" ? "/professionals" : "/professional"}/${item.urlSlug || item.userName}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-xs font-bold text-brand-gold hover:text-brand-yellow"
                    >
                      View Profile →
                    </a>
                  )}
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
