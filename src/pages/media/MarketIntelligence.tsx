import { useState, useEffect } from 'react';
import { ExternalLink, TrendingUp } from 'lucide-react';
import { fetchContent, MediaItem } from '../../lib/mediaApi';

const indiaStats = [
  { num: 'Rs.10,977Cr', label: 'India Market Size 2025', note: 'US$ 1,219.7 million' },
  { num: 'Rs.29,080Cr', label: 'Projected by 2030', note: 'US$ 3,231.1 million' },
  { num: '21.51%', label: 'India CAGR 2025–2030', note: 'Nearly 3x global rate' },
  { num: '38,500+', label: 'Drones Registered in India', note: 'As of Feb 2026' },
];

const sectors = [
  { icon: '⚔️', title: 'Defence and Security', badge: 'Largest Segment', badgeColor: 'bg-orange-100 text-orange-700', desc: 'India approved $2B+ domestic drone procurement in June 2026. 60 remotely piloted strike aircraft approved under $25B military modernisation package. S-400 systems validated drone interception capabilities.', note: '60–70% component overlap with civil drones' },
  { icon: '🌾', title: 'Agriculture', badge: 'Fastest Growing', badgeColor: 'bg-green-100 text-green-700', desc: '1,094 drones deployed to women SHGs under Namo Drone Didi. Precision spraying, NDVI mapping, and crop monitoring expanding across Andhra Pradesh, Maharashtra, and Punjab. Government-backed adoption accelerating.', note: 'State-level schemes driving adoption' },
  { icon: '🗺️', title: 'Survey and GIS', badge: 'Government-Mandated', badgeColor: 'bg-blue-100 text-blue-700', desc: 'SVAMITVA Scheme surveyed 3.28 lakh villages across 31 states. 2.76 crore property cards issued. Drone photogrammetry, LiDAR, and GIS data pipelines are now standard. NHAI mandates monthly drone monitoring of all highway projects.', note: 'Infrastructure monitoring expanding' },
  { icon: '🏭', title: 'Manufacturing and PLI', badge: 'Policy-Backed', badgeColor: 'bg-purple-100 text-purple-700', desc: 'PLI scheme with up to 20% value-addition incentives delivered 7x revenue growth for participating drone manufacturers. Proposed Rs.2,000 crore investment over three years to build long-term industrial capacity.', note: '40% localisation target by FY28' },
];

const globalStats = [
  { num: '$40.6B', label: 'Global Drone Market 2025', note: 'Rs. 3.65 lakh crore' },
  { num: '$57.8B', label: 'Global Market by 2030', note: 'Rs. 5.20 lakh crore' },
  { num: '7.3%', label: 'Global CAGR 2025–30', note: 'India 3x faster' },
  { num: '1,20,000+', label: 'Manufacturing Jobs Projected', note: '+6,00,000 service sector' },
];

export default function MarketIntelligencePage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const controller = new AbortController();
    fetchContent('market-intelligence', controller.signal).then(setItems).catch(() => {}).finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const categories = ['All', ...Array.from(new Set(items.map(i => i.category || 'General').filter(Boolean)))];
  const filtered = activeCategory === 'All' ? items : items.filter(i => (i.category || 'General') === activeCategory);

  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Media Hub</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
              Market <span className="text-yellow-400">Intelligence</span>
            </h1>
            <p className="text-sm text-white/60 leading-relaxed max-w-lg">
              Verified market data, growth projections, sector analysis, and competitive intelligence for India's drone, GIS & AI industry. Sourced from IBEF, Drone Industry Insights, and government publications.
            </p>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">21.51%</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">India Market CAGR</span>
            </div>
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">7.3%</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Global Market CAGR</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 pb-12 space-y-8">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
            <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">India</span>
            Key Market Statistics 2025–2026
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {indiaStats.map((s, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 text-center">
                <div className="text-2xl font-extrabold text-yellow-500 mb-1">{s.num}</div>
                <div className="text-xs font-bold text-gray-700 mb-0.5">{s.label}</div>
                <div className="text-xs text-gray-400">{s.note}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2 text-right">Source: IBEF — India's Drone Ecosystem Report, June 2026</p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
            <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Sectors</span>
            Sector-by-Sector Analysis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {sectors.map((sector, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl">{sector.icon}</span>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">{sector.title}</h3>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${sector.badgeColor}`}>{sector.badge}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed mb-2">{sector.desc}</p>
                <p className="text-xs text-gray-400 italic">{sector.note}</p>
              </div>
            ))}
          </div>
        </div>

        {!loading && items.length > 0 && (
          <div>
            <div className="flex gap-2 flex-wrap mb-5">
              {categories.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${activeCategory === cat ? 'bg-yellow-400 border-yellow-400 text-black' : 'border-gray-200 text-gray-500 hover:border-yellow-400'}`}>
                  {cat}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(item => (
                <div key={item.contentId} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} className="w-full h-40 object-cover" />
                  ) : (
                    <div className="w-full h-40 bg-zinc-900 flex items-center justify-center">
                      <TrendingUp className="w-10 h-10 text-yellow-400" />
                    </div>
                  )}
                  <div className="p-4">
                    {item.category && <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded mb-2 inline-block">{item.category}</span>}
                    <h3 className="text-sm font-bold text-gray-900 leading-snug mb-2">{item.title}</h3>
                    {item.description && <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-3">{item.description}</p>}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">{item.source || item.date}</span>
                      {item.externalLink && (
                        <a href={item.externalLink} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-yellow-600 hover:text-yellow-700 flex items-center gap-1">
                          View <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
            <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Global</span>
            Global Context
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {globalStats.map((s, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 text-center">
                <div className="text-xl font-extrabold text-gray-900 mb-1">{s.num}</div>
                <div className="text-xs font-bold text-gray-600 mb-0.5">{s.label}</div>
                <div className="text-xs text-gray-400">{s.note}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-white text-base mb-1">Market Data for Your Business Decisions</h3>
            <p className="text-sm text-white/60 max-w-lg">DroneTv.in publishes drone, GIS & AI market intelligence curated from IBEF, government bodies, and industry research. For full research reports and sector-specific analysis, visit the Industry Reports section.</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <a href="/media/industry-reports" className="px-4 py-2 bg-yellow-400 text-black text-sm font-bold rounded-lg hover:bg-yellow-300 transition-colors">Industry Reports →</a>
            <a href="/media/tech-trends" className="px-4 py-2 border border-white/20 text-white text-sm font-semibold rounded-lg hover:bg-white/10 transition-colors">Tech Trends →</a>
          </div>
        </div>
      </div>
    </div>
  );
}
