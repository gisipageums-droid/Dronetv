import { useState, useEffect } from 'react';
import { MapPin, ExternalLink } from 'lucide-react';
import { fetchContent, MediaItem } from '../../lib/mediaApi';

const staticStories = [
  { id: 's1', category: 'Survey and GIS', title: 'GIS Company Reduces Survey Time by 80% Using Drone Photogrammetry', text: 'A Hyderabad-based survey company replaced manned aircraft with drone photogrammetry for a 500-hectare boundary mapping project, completing in 3 days what previously took 2 weeks — at 60% lower cost.', metric: '80%', metricLabel: 'Reduction in survey time', location: 'Hyderabad, Telangana' },
  { id: 's2', category: 'Training Institute', title: 'RPTO Trains 200 Pilots in First Year, Builds Pipeline for Agriculture Drone Companies', text: "Drone Academy Private Limited's DGCA-approved training programme certified 200 remote pilots in its first operational year, with 85% placed in agricultural drone service companies across Telangana, AP, and Karnataka.", metric: '200', metricLabel: 'Pilots certified, Year 1', location: 'Hyderabad, Telangana' },
  { id: 's3', category: 'Manufacturing', title: 'PLI-Backed Drone Manufacturer Grows Revenue 7x in 24 Months', text: 'A Bengaluru-based drone manufacturer enrolled in the PLI scheme grew annual revenue by 7x in 24 months, investing in localised component production and reducing import dependence for frames, ESCs, and propulsion systems.', metric: '7x', metricLabel: 'Revenue growth in 24 months', location: 'Bengaluru, Karnataka' },
  { id: 's4', category: 'Infrastructure', title: 'Highway Contractor Saves 60% on Inspection Costs Using Monthly Drone Monitoring', text: "Following NHAI's mandate for monthly drone video monitoring, a highway contractor in Maharashtra switched from manual inspection crews to drone-based monthly surveys — reducing inspection cost by 60% and improving documentation accuracy.", metric: '60%', metricLabel: 'Inspection cost reduction', location: 'Maharashtra' },
];

export default function ImpactStoriesPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const controller = new AbortController();
    fetchContent('impact-story', controller.signal).then(setItems).catch(() => {}).finally(() => setLoading(false));
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
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">Drone <span className="text-yellow-400">Impact Stories</span></h1>
            <p className="text-sm text-white/60 leading-relaxed max-w-lg">Real-world stories of drones transforming agriculture, disaster relief, infrastructure and healthcare across India.</p>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">{items.length || '0'}</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Stories</span>
            </div>
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">India</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Focused</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-5">
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
          <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Stories</span>
          Real-World Impact
        </h2>
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading stories...</div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map(item => (
              <div key={item.contentId} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="w-full h-40 object-cover" />}
                <div className="p-5">
                  {item.category && <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-0.5 rounded mb-2 inline-block">{item.category}</span>}
                  <h3 className="text-sm font-bold text-gray-900 leading-snug mb-2">{item.title}</h3>
                  {item.description && <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-3">{item.description}</p>}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      {item.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{item.location}</span>}
                      {item.source && <span>{item.source}</span>}
                    </div>
                    {item.externalLink && (
                      <a href={item.externalLink} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-yellow-600 hover:text-yellow-700 flex items-center gap-1">
                        Read More <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="bg-zinc-900 md:w-56 flex-shrink-0 flex flex-col items-center justify-center p-8 gap-6">
                  {[{num:'4x',label:'Coverage per hour'},{num:'40%',label:'Cost reduction/acre'},{num:'3',label:'Districts served'}].map(s => (
                    <div key={s.num} className="text-center">
                      <span className="text-3xl font-extrabold text-yellow-400 block leading-none">{s.num}</span>
                      <span className="text-xs text-white/50 mt-1 block">{s.label}</span>
                    </div>
                  ))}
                </div>
                <div className="p-6">
                  <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded mb-3 inline-block">Agriculture</span>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">From Manual Spraying to 8 Acres Per Hour — A Drone Service Provider's Journey</h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-3 italic">"We went from 2 acres per hour manually to 8 acres per hour with drone spraying. The cost per acre dropped by 40%."</p>
                  <p className="text-sm text-gray-600 leading-relaxed">Sreenivas Prasad, featured in DroneTv's Drone Expo 2025 coverage, runs an agricultural drone services business in Telangana. After completing DGCA RPC certification and acquiring two agriculture drones, he transitioned from manual labour-intensive spraying to drone-based precision operations, multiplying his daily coverage and reducing operational cost per acre significantly.</p>
                  <p className="text-xs text-gray-400 mt-3">Sreenivas Prasad — Drone Service Provider, Telangana · DroneTv Drone Expo 2025</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {staticStories.map(story => (
                <div key={story.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5">
                  <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-0.5 rounded mb-3 inline-block">{story.category}</span>
                  <h3 className="text-sm font-bold text-gray-900 leading-snug mb-2">{story.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-3">{story.text}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                      <span className="text-2xl font-extrabold text-yellow-500 block leading-none">{story.metric}</span>
                      <span className="text-xs text-gray-400">{story.metricLabel}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <MapPin className="w-3 h-3" />{story.location}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-zinc-900 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-white text-base mb-1">Share Your Impact Story</h3>
                <p className="text-sm text-white/60 max-w-lg">Has your company achieved measurable results using drones — yield improvement, time savings, cost reduction, or business growth? DroneTv.in publishes verified impact stories from across India's drone ecosystem.</p>
              </div>
              <div className="flex gap-3 flex-shrink-0">
                <a href="mailto:bd@dronetv.in?subject=Submit Impact Story" className="px-4 py-2 bg-yellow-400 text-black text-sm font-bold rounded-lg hover:bg-yellow-300 transition-colors">Share Your Story</a>
                <a href="/media/video-spotlight" className="px-4 py-2 border border-white/20 text-white text-sm font-semibold rounded-lg hover:bg-white/10 transition-colors">Video Interviews →</a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
