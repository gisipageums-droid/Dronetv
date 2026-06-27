import { useState, useEffect } from 'react';
import { MapPin, ExternalLink, Search, Layers } from 'lucide-react';
import { fetchContent, MediaItem } from '../../lib/mediaApi';

const playerTypes = [
  { icon: '🚁', title: 'Drone Service Operators', desc: "Companies providing drone-as-a-service across agriculture, infrastructure inspection, logistics, and surveillance. India's fastest-growing segment as commercial fleet sizes expand post-PLI scheme.", tags: ['DaaS', 'Commercial Ops', 'B2B Service'] },
  { icon: '⚓', title: 'Defence and Government Contractors', desc: "Defence contractors, system integrators, and government procurement organisations involved in India's ₹25B military drone modernisation programme and SVAMITVA/NHAI/Railways mandates.", tags: ['Defence', 'Government', 'Procurement'] },
  { icon: '🏗️', title: 'Infrastructure and Survey Companies', desc: 'GIS firms, survey companies, and infrastructure operators using drone data for mapping, inspection, and monitoring. Covers NHAI corridor monitoring, railway inspection, and smart city applications.', tags: ['Survey', 'GIS', 'Infrastructure'] },
  { icon: '🌱', title: 'Agri-Drone Service Providers', desc: 'Companies and cooperatives operating agriculture drones for precision spraying, NDVI mapping, and crop monitoring across India. Includes Namo Drone Didi SHG operators and commercial agri-drone fleets.', tags: ['Agriculture', 'Spraying', 'SHG Operators'] },
  { icon: '📦', title: 'Logistics and Delivery Operators', desc: "Last-mile delivery companies, healthcare logistics providers, and emergency response operators deploying drone delivery networks across India's tier-2 and tier-3 cities and remote areas.", tags: ['Delivery', 'Last Mile', 'Healthcare'] },
  { icon: '🎬', title: 'Media and Aerial Cinematography', desc: 'Professional aerial photography and cinematography operators for film, advertising, events, and real estate. India\'s most visible commercial drone use case with growing demand from OTT platforms and wedding industry.', tags: ['Cinematography', 'Aerial Photo', 'Film'] },
];

export default function IndustryPlayersPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const controller = new AbortController();
    fetchContent('industry-player', controller.signal).then(setItems).catch(() => {}).finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const categories = ['All', ...Array.from(new Set(items.map(i => i.category || 'General').filter(Boolean)))];

  const filtered = items.filter(i => {
    const matchCat = activeCategory === 'All' || (i.category || 'General') === activeCategory;
    const matchSearch = !search || i.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Partnerships</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">Industry <span className="text-yellow-400">Players</span></h1>
            <p className="text-sm text-white/60 leading-relaxed max-w-lg">Key players across India's drone ecosystem — service operators, defence contractors, infrastructure companies, and agri-tech firms.</p>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">{items.length || '0'}</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Players</span>
            </div>
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">India</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Ecosystem</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
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
          <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Key</span>
          Industry Players
        </h2>
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading industry players...</div>
        ) : items.length > 0 ? (
          filtered.length === 0
            ? <div className="text-center py-8 text-gray-400">No players match your search.</div>
            : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map(item => (
                  <div key={item.contentId} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.title} className="w-full h-40 object-cover" />
                    ) : (
                      <div className="w-full h-40 bg-zinc-900 flex items-center justify-center">
                        <Layers className="w-10 h-10 text-yellow-400" />
                      </div>
                    )}
                    <div className="p-4">
                      {item.category && <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2 py-0.5 rounded mb-2 inline-block">{item.category}</span>}
                      <h3 className="text-sm font-bold text-gray-900 mb-2">{item.title}</h3>
                      {item.description && <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">{item.description}</p>}
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
            <p className="text-xs text-gray-400 mb-4">Types of industry players that partner with DroneTv.in — from service operators to defence contractors.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {playerTypes.map((p, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5">
                  <div className="text-3xl mb-3">{p.icon}</div>
                  <h3 className="font-bold text-gray-900 text-sm mb-2">{p.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-3">{p.desc}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {p.tags.map(tag => <span key={tag} className="bg-orange-50 text-orange-700 text-xs font-semibold px-2 py-0.5 rounded-full">{tag}</span>)}
                  </div>
                  <div className="pt-3 border-t border-gray-100">
                    <a href="/partnerships/become-a-partner" className="text-xs font-bold text-yellow-600 hover:text-yellow-700">Partner with DroneTv →</a>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 bg-zinc-900 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-white text-sm mb-1">Get Found by Buyers Actively Looking for Your Services</h3>
                <p className="text-xs text-white/60 max-w-lg">DroneTv.in's B2B marketplace connects verified buyers with drone service providers. Unlike generic directories, every visitor on DroneTv.in is from the drone industry — which means every lead is a qualified prospect for your services.</p>
              </div>
              <div className="flex gap-3 flex-shrink-0">
                <a href="/partnerships/become-a-partner" className="px-4 py-2 bg-yellow-400 text-black text-sm font-bold rounded-lg hover:bg-yellow-300 transition-colors">Apply Now</a>
                <a href="/partnerships/partner-benefits" className="px-4 py-2 border border-white/20 text-white text-sm font-semibold rounded-lg hover:bg-white/10 transition-colors">Compare Packages →</a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
