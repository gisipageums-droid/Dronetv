import { useState, useEffect } from 'react';
import { MapPin, ExternalLink, Search, Cpu } from 'lucide-react';
import { fetchContent, MediaItem } from '../../lib/mediaApi';

const staticAISectors = [
  { icon: '🧠', name: 'Autonomous Flight and AI Stack Companies', hq: 'Computer Vision · Path Planning · Edge AI', desc: 'Companies developing AI for object detection, autonomous path planning, real-time anomaly identification, and adaptive mission execution. Applications in agriculture (crop disease identification), infrastructure (crack detection), and surveillance (autonomous perimeter monitoring).', tags: ['Autonomy', 'Computer Vision', 'Edge AI'], sector: 'AI / Autonomy' },
  { icon: '🗺️', name: 'GIS and Geospatial Technology Platforms', hq: 'Photogrammetry · LiDAR · Mapping Software', desc: "GIS software companies, photogrammetry platforms, LiDAR processing tools, and geospatial analytics providers. India's SVAMITVA scheme, NHAI drone mandates, and Railway inspection programmes create massive demand for GIS technology across government and commercial projects.", tags: ['GIS', 'LiDAR', 'Photogrammetry', 'QGIS'], sector: 'GIS Technology' },
  { icon: '🌾', name: 'Agriculture AI and Precision Farming Platforms', hq: 'NDVI · Crop Analytics · Spray Management', desc: "AI platforms for NDVI mapping, crop health analytics, precision spray management, and farm data intelligence. DroneTv's audience includes 39,000+ certified drone pilots with heavy concentration in agri-drone operations — the primary buyers for agriculture AI technology.", tags: ['AgriTech', 'NDVI', 'Spray AI', 'Farm Data'], sector: 'Agriculture AI' },
  { icon: '🛡️', name: 'Anti-Drone and Counter-UAS Technology', hq: 'RF Detection · Jamming · Interception', desc: "Counter-drone technology companies providing RF detection, frequency jamming, laser interception, and AI-based threat identification systems. India's ₹25B military modernisation package and growing civilian C-UAS requirements for airports and critical infrastructure create a major addressable market.", tags: ['C-UAS', 'RF Detection', 'Jamming', 'Defence'], sector: 'Counter-Drone' },
  { icon: '📡', name: 'Drone Simulation and Training Technology', hq: 'Virtual Training · Mission Rehearsal · DGCA Prep', desc: "Drone simulation platforms, virtual training environments, and digital mission rehearsal tools for RPTO training, pilot proficiency, and DGCA exam preparation. India's 244 approved RPTOs represent the primary customer base for simulation technology.", tags: ['Simulation', 'RPTO Tech', 'VR Training'], sector: 'Simulation Technology' },
  { icon: '⚡', name: 'UTM, Fleet Management and IoT Platforms', hq: 'Airspace Management · Fleet Software · IoT', desc: 'Unmanned Traffic Management (UTM) systems, drone fleet management software, IoT integration platforms, and cloud data management solutions. DigitalSky integration and growing commercial fleet sizes are driving strong demand for fleet intelligence tools in India.', tags: ['UTM', 'Fleet Management', 'IoT', 'DigitalSky'], sector: 'Aviation Software' },
];

export default function AITechCompaniesPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const controller = new AbortController();
    fetchContent('ai-company', controller.signal).then(setItems).catch(() => {}).finally(() => setLoading(false));
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
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">AI Tech <span className="text-yellow-400">Companies</span></h1>
            <p className="text-sm text-white/60 leading-relaxed max-w-lg">AI software platforms, computer vision companies, and deep-tech enablers powering India's autonomous drone ecosystem.</p>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">{items.length || '0'}</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Companies</span>
            </div>
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">Deep</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Tech</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search companies..." value={search} onChange={e => setSearch(e.target.value)}
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
          <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">AI</span>
          Tech Companies
        </h2>
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading companies...</div>
        ) : items.length > 0 ? (
          filtered.length === 0
            ? <div className="text-center py-8 text-gray-400">No companies match your search.</div>
            : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map(item => (
                  <div key={item.contentId} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.title} className="w-full h-40 object-cover" />
                    ) : (
                      <div className="w-full h-40 bg-zinc-900 flex items-center justify-center">
                        <Cpu className="w-10 h-10 text-yellow-400" />
                      </div>
                    )}
                    <div className="p-4">
                      {item.category && <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2 py-0.5 rounded mb-2 inline-block">{item.category}</span>}
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
            <p className="text-xs text-gray-400 mb-4">AI technology sectors DroneTv.in covers — from autonomous flight to counter-drone systems.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {staticAISectors.map((s, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-xl flex-shrink-0">{s.icon}</div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm leading-snug">{s.name}</h3>
                      <p className="text-xs text-gray-400">{s.hq}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed mb-3">{s.desc}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {s.tags.map(tag => <span key={tag} className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded-full">{tag}</span>)}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-xs text-purple-700 font-bold">{s.sector}</span>
                    <a href="/partnerships/become-a-partner" className="text-xs font-bold text-yellow-600 hover:text-yellow-700">Partner with DroneTv →</a>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 bg-zinc-900 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-white text-sm mb-1">AI is Defining the Next Phase of India's Drone Sector</h3>
                <p className="text-xs text-white/60 max-w-lg">From autonomous flight to GIS analytics to counter-drone systems, AI technology is becoming a prerequisite for competitive drone operations in India. DroneTv.in is the platform where operators discover, evaluate, and connect with technology providers.</p>
              </div>
              <div className="flex gap-3 flex-shrink-0">
                <a href="/partnerships/become-a-partner" className="px-4 py-2 bg-yellow-400 text-black text-sm font-bold rounded-lg hover:bg-yellow-300 transition-colors">Apply Now</a>
                <a href="/media/tech-trends" className="px-4 py-2 border border-white/20 text-white text-sm font-semibold rounded-lg hover:bg-white/10 transition-colors">Tech Trends →</a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
