import { useState, useEffect } from 'react';
import { MapPin, ExternalLink, Search, Building2 } from 'lucide-react';
import { fetchContent, MediaItem } from '../../lib/mediaApi';

const staticManufacturers = [
  { icon: '✈️', name: 'ideaForge Technology', hq: 'Mumbai, Maharashtra | BSE: IDEAFORGE', desc: "India's market leader in unmanned aerial systems with approximately 50% market share. SWITCH UAV is standard equipment for high-altitude border surveillance in Ladakh and Arunachal Pradesh. The only Type Approved manufacturer in multiple military categories.", tags: ['Defence', 'Surveillance', 'Type Approved', 'BSE Listed'], sector: 'Defence UAV' },
  { icon: '🛸', name: 'IoTechWorld Avigation', hq: 'Sahibabad, Uttar Pradesh', desc: "Described as India's largest agriculture drone manufacturer. Mission to build a comprehensive drone ecosystem making drone technology accessible to all farmers. Focuses on small and marginal farmers across rural India with accessible pricing and service networks.", tags: ['Agriculture', 'Agri-Drone', 'Rural India'], sector: 'Agriculture UAV' },
  { icon: '🚀', name: 'NewSpace Research and Technologies', hq: 'Bengaluru, Karnataka', desc: 'Leader in autonomous drone systems and swarm intelligence. Currently testing AI-driven swarm operations for the Indian Air Force. Key platforms include Abhimanyu (Navy loyal wingman) and the BELUGA hybrid swarm system.', tags: ['Swarm', 'AI Autonomous', 'Defence', 'Navy'], sector: 'Defence / Swarm UAV' },
  { icon: '🏭', name: 'Asteria Aerospace', hq: 'Bengaluru, Karnataka | Backed by Reliance Industries', desc: 'Specialises in customised drone solutions with in-house design and manufacturing capabilities. Provides a comprehensive drone-as-a-service platform transforming aerial data into actionable intelligence across defence, agriculture, and GIS surveying sectors.', tags: ['Defence', 'Agriculture', 'GIS', 'DaaS'], sector: 'Multi-Sector UAV' },
  { icon: '⚙️', name: 'Throttle Aerospace Systems', hq: 'India', desc: 'First DGCA-approved manufacturer of civil drones in India and licensed to produce military drones. Over 15 years of experience in drone design and development. Offers a range of innovative products across aviation, agriculture, and infrastructure.', tags: ['DGCA Approved', 'Civil & Military', '15+ Years'], sector: 'Civil / Military UAV' },
  { icon: '🔋', name: 'Raphe mPhibr', hq: 'Noida, Uttar Pradesh | $100M Funded (2025)', desc: 'Clear leader in Indian drone propulsion systems. Full in-house production of BLDC motors, intelligent ESCs, and power distribution boards. Major defence contracts with Indian Army, Navy, Air Force, BSF, and CRPF. $100 million funding raised in 2025.', tags: ['Propulsion', 'BLDC Motors', 'Defence', 'PLI Supported'], sector: 'Drone Components' },
];

export default function DroneManufacturersPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const controller = new AbortController();
    fetchContent('manufacturer', controller.signal).then(setItems).catch(() => {}).finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const categories = ['All', ...Array.from(new Set(items.map(i => i.category || 'General').filter(Boolean)))];

  const filtered = items.filter(i => {
    const matchCat = activeCategory === 'All' || (i.category || 'General') === activeCategory;
    const matchSearch = !search || i.title.toLowerCase().includes(search.toLowerCase()) || (i.location || '').toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Partnerships</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">Drone <span className="text-yellow-400">Manufacturers</span></h1>
            <p className="text-sm text-white/60 leading-relaxed max-w-lg">India's leading drone hardware manufacturers — agriculture sprayers, defence UAVs, survey platforms, and consumer drones.</p>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">{items.length || '0'}</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Manufacturers</span>
            </div>
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">Made</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">In India</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search manufacturers..." value={search} onChange={e => setSearch(e.target.value)}
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
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
          <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Listed</span>
          Drone Manufacturers
        </h2>
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading manufacturers...</div>
        ) : items.length > 0 ? (
          filtered.length === 0
            ? <div className="text-center py-8 text-gray-400">No manufacturers match your search.</div>
            : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map(item => (
                  <div key={item.contentId} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.title} className="w-full h-40 object-cover" />
                    ) : (
                      <div className="w-full h-40 bg-zinc-900 flex items-center justify-center">
                        <Building2 className="w-10 h-10 text-yellow-400" />
                      </div>
                    )}
                    <div className="p-4">
                      {item.category && <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-0.5 rounded mb-2 inline-block">{item.category}</span>}
                      <h3 className="text-sm font-bold text-gray-900 leading-snug mb-2">{item.title}</h3>
                      {item.description && <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">{item.description}</p>}
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {item.tags.map(tag => <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{tag}</span>)}
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        {item.location && <span className="flex items-center gap-1 text-xs text-gray-400"><MapPin className="w-3 h-3" />{item.location}</span>}
                        {item.externalLink && (
                          <a href={item.externalLink} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-yellow-600 hover:text-yellow-700 flex items-center gap-1">
                            Visit <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
        ) : (
          <>
            <p className="text-xs text-gray-400 mb-4">India has 180+ active drone manufacturers. Featured companies below.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {staticManufacturers.map((m, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-xl flex-shrink-0">{m.icon}</div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm leading-snug">{m.name}</h3>
                      <p className="text-xs text-gray-400">{m.hq}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed mb-3">{m.desc}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {m.tags.map(tag => <span key={tag} className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded-full">{tag}</span>)}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-xs text-yellow-700 font-bold">{m.sector}</span>
                    <a href="/partnerships/become-a-partner" className="text-xs font-bold text-yellow-600 hover:text-yellow-700">Partner with DroneTv →</a>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 bg-zinc-900 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-white text-sm mb-1">India Has 515+ Drone Companies — Stand Out on DroneTv.in</h3>
                <p className="text-xs text-white/60 max-w-lg">With the Indian drone market set to reach Rs. 29,080 crore by 2030, DroneTv.in is where India's drone buyers search for suppliers, watch product videos, and submit enquiries.</p>
              </div>
              <a href="/partnerships/become-a-partner" className="flex-shrink-0 px-4 py-2 bg-yellow-400 text-black text-sm font-bold rounded-lg hover:bg-yellow-300 transition-colors">Apply for Partnership</a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
