import { useState, useEffect } from 'react';
import { MapPin, Search, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PROFESSIONAL_API, LAMBDA } from '../../lib/apiConfig';

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
    <div className="pt-[104px] min-h-screen bg-gray-50">
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Professionals</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">Pilot <span className="text-yellow-400">Directory</span></h1>
            <p className="text-sm text-white/60 leading-relaxed max-w-lg">Find DGCA certified drone pilots across India — agriculture, survey, inspection, and cinematography specialists.</p>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">39,890</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Certified Pilots India</span>
            </div>
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">Free</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">To Create Profile</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search pilots, locations..." value={search} onChange={e => setSearch(e.target.value)}
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
        {cities.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {cities.map(city => (
              <button key={city} onClick={() => setSearch(city)}
                className="px-3 py-1 rounded-full text-xs font-semibold border border-dashed border-gray-300 text-gray-500 hover:border-yellow-400 hover:text-yellow-700 transition-colors">
                📍 {city}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-12">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
          <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Certified</span>
          Drone Pilots
        </h2>
        {loading ? (
          <div className="text-center py-10 text-gray-400">Loading pilots...</div>
        ) : items.length === 0 ? (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-dashed border-gray-300 p-6 text-center mb-4">
              <User className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="font-semibold text-gray-500 mb-1">Are you a DGCA-certified drone pilot?</p>
              <p className="text-sm text-gray-400 mb-3">Add your profile to DroneTv.in's Pilot Directory for free. Drone companies, service operators, and recruiters search here when they need pilots.</p>
              <button onClick={() => navigate('/professional/form')}
                className="bg-yellow-400 text-black font-bold px-5 py-2 rounded-lg hover:bg-yellow-300 transition-colors text-sm">
                Add Your Profile →
              </button>
            </div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide">Sample Pilot Profiles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {samplePilots.map((pilot, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 opacity-80">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-xl flex-shrink-0">{pilot.icon}</div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-gray-900">{pilot.name}</h3>
                        <span className="bg-green-100 text-green-700 text-xs font-bold px-1.5 py-0.5 rounded">✓ DGCA</span>
                      </div>
                      <p className="text-xs text-gray-500">{pilot.badge}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2"><MapPin className="w-3 h-3" />{pilot.location}</div>
                  <p className="text-xs text-gray-500 mb-2">{pilot.experience}</p>
                  <div className="flex flex-wrap gap-1">
                    {pilot.tags.map((tag, j) => <span key={j} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{tag}</span>)}
                  </div>
                  <button className="mt-3 text-xs font-bold text-yellow-600 hover:text-yellow-700">Contact →</button>
                </div>
              ))}
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-10 text-gray-400">No pilots match your search.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(item => (
              <div key={item.professionalId} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5">
                <div className="flex items-center gap-3 mb-3">
                  {item.previewImage ? (
                    <img src={item.previewImage} alt={item.professionalName || item.fullName} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center">
                      <User className="w-6 h-6 text-yellow-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{item.professionalName || item.fullName}</h3>
                    {item.categories && item.categories.length > 0 && (
                      <span className="text-xs text-gray-500">{item.categories[0]}</span>
                    )}
                  </div>
                </div>
                {item.professionalDescription && (
                  <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">{item.professionalDescription}</p>
                )}
                <div className="space-y-1">
                  {item.location && <div className="flex items-center gap-1.5 text-xs text-gray-500"><MapPin className="w-3 h-3" />{item.location}</div>}
                  {item.categories && item.categories.length > 1 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.categories.slice(1).map(cat => <span key={cat} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{cat}</span>)}
                    </div>
                  )}
                </div>
                {item.cleanUrl && (
                  <a href={item.cleanUrl} target="_blank" rel="noopener noreferrer" className="mt-3 block text-xs font-bold text-yellow-600 hover:text-yellow-700">
                    View Profile →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
