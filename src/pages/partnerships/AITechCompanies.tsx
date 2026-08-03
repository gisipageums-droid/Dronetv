import { useState, useEffect } from 'react';
import { MapPin, ExternalLink, Search, Cpu } from 'lucide-react';
import { fetchContent, MediaItem } from '../../lib/mediaApi';
import CompactHero from '../../components/common/CompactHero';
import ContentCard from '../../components/common/ContentCard';
import { withInlineAds, AdSidebarRail } from '../../components/common/adCreatives';
import PostContentCTA from '../../components/common/PostContentCTA';

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
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

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
    <div className="pt-[104px] min-h-screen bg-ink-offwhite">
      <CompactHero
        title={<>AI Tech <span>Companies</span></>}
        stats={[
          { n: items.length || '0', l: 'Companies' },
          { n: 'Deep', l: 'Tech' },
        ]}
      />

      <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-caption" />
          <input type="text" placeholder="Search companies..." value={search} onChange={e => setSearch(e.target.value)}
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

      <div className="max-w-6xl mx-auto px-6 pb-12 lg:flex lg:items-start lg:gap-6">
        <div className="flex-1 min-w-0">
        <h2 className="text-lg font-bold text-ink flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-ink-light after:content-['']">
          <span className="bg-brand-yellow text-ink text-xs font-bold px-2 py-0.5 rounded">AI</span>
          Tech Companies
        </h2>
        {loading ? (
          <div className="text-center py-16 text-ink-caption">Loading companies...</div>
        ) : items.length > 0 ? (
          filtered.length === 0
            ? <div className="text-center py-8 text-ink-caption">No companies match your search.</div>
            : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {withInlineAds(filtered, item => (
                  <ContentCard
                    key={item.contentId}
                    image={item.imageUrl}
                    imageAlt={item.title}
                    imageFallback={<Cpu className="w-10 h-10 text-brand-yellow" />}
                  >
                    {item.category && <span className="bg-brand-gold/15 text-brand-gold text-xs font-bold px-2 py-0.5 rounded mb-2 inline-block self-start">{item.category}</span>}
                    <h3 className="text-sm font-bold text-ink leading-snug mb-2 line-clamp-2">{item.title}</h3>
                    {item.description && (
                      <div className="mb-3">
                        <p className={`text-xs text-ink-caption leading-relaxed ${expandedIds.has(item.contentId) ? '' : 'line-clamp-3'}`}>{item.description}</p>
                        {item.description.length > 140 && (
                          <button onClick={() => toggleExpanded(item.contentId)} className="text-xs font-bold text-brand-gold hover:text-brand-yellow mt-1">
                            {expandedIds.has(item.contentId) ? 'Show less' : 'Read more'}
                          </button>
                        )}
                      </div>
                    )}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.tags.map(tag => <span key={tag} className="bg-ink-light text-ink-paragraph text-xs px-2 py-0.5 rounded-full">{tag}</span>)}
                      </div>
                    )}
                    <div className="mt-auto pt-3 border-t border-ink-light flex items-center justify-between gap-2">
                      {item.location && <span className="flex items-center gap-1 text-xs text-ink-caption"><MapPin className="w-3 h-3" />{item.location}</span>}
                      {item.externalLink && (
                        <a href={item.externalLink} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-brand-gold hover:text-brand-yellow flex items-center gap-1 whitespace-nowrap">
                          Visit <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </ContentCard>
                ))}
              </div>
        ) : (
          <>
            <p className="text-xs text-ink-caption mb-4">AI technology sectors DroneTv.in covers — from autonomous flight to counter-drone systems.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {withInlineAds(staticAISectors, (s, i) => (
                <ContentCard key={i}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-ink rounded-xl flex items-center justify-center text-xl flex-shrink-0">{s.icon}</div>
                    <div>
                      <h3 className="font-bold text-ink text-sm leading-snug">{s.name}</h3>
                      <p className="text-xs text-ink-caption">{s.hq}</p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <p className={`text-xs text-ink-caption leading-relaxed ${expandedIds.has(String(i)) ? '' : 'line-clamp-3'}`}>{s.desc}</p>
                    {s.desc.length > 140 && (
                      <button onClick={() => toggleExpanded(String(i))} className="text-xs font-bold text-brand-gold hover:text-brand-yellow mt-1">
                        {expandedIds.has(String(i)) ? 'Show less' : 'Read more'}
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {s.tags.map(tag => <span key={tag} className="bg-ink-light text-ink-paragraph text-xs font-semibold px-2 py-0.5 rounded-full">{tag}</span>)}
                  </div>
                  <div className="mt-auto pt-3 border-t border-ink-light flex items-center justify-between gap-2">
                    <span className="text-xs text-brand-gold font-bold">{s.sector}</span>
                    <a href="/partnerships/become-a-partner" className="text-xs font-bold text-brand-gold hover:text-brand-yellow whitespace-nowrap">Partner with DroneTv →</a>
                  </div>
                </ContentCard>
              ))}
            </div>
            <div className="mt-6 bg-ink rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-white text-sm mb-1">AI is Defining the Next Phase of India's Drone Sector</h3>
                <p className="text-xs text-white/60 max-w-lg">From autonomous flight to GIS analytics to counter-drone systems, AI technology is becoming a prerequisite for competitive drone operations in India. DroneTv.in is the platform where operators discover, evaluate, and connect with technology providers.</p>
              </div>
              <div className="flex gap-3 flex-shrink-0">
                <a href="/partnerships/become-a-partner" className="px-4 py-2 bg-brand-yellow text-ink text-sm font-bold rounded-lg hover:bg-brand-yellow-soft transition-colors">Apply Now</a>
                <a href="/media/tech-trends" className="px-4 py-2 border border-white/20 text-white text-sm font-semibold rounded-lg hover:bg-white/10 transition-colors">Tech Trends →</a>
              </div>
            </div>
          </>
        )}

          <PostContentCTA contentType="ai-company" typeLabel="AI/Tech Company Listing"
            ctaDescription="Build AI or tech solutions for the drone industry? List your company directly." />
        </div>
        <AdSidebarRail />
      </div>
    </div>
  );
}
