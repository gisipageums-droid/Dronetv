import { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import { fetchContent, MediaItem } from '../../lib/mediaApi';

const staticTrends = [
  {
    num: '01', icon: '📡', title: 'BVLOS Operations Expansion',
    desc: 'Beyond Visual Line of Sight (BVLOS) operations represent the most significant near-term shift in India\'s drone sector. DGCA is developing BVLOS type certification standards and corridor frameworks. Once operational, BVLOS enables drone deliveries, long-range infrastructure inspection, and agricultural monitoring at scale.',
    india: 'DGCA is developing the regulatory framework for BVLOS approvals. Multiple companies including agri-drone operators and delivery startups are preparing for BVLOS certification as soon as corridors are approved. DigitalSky UTM integration is a prerequisite.',
    tags: ['BVLOS', 'DGCA', 'UTM', 'Delivery'],
  },
  {
    num: '02', icon: '🤖', title: 'AI-Powered Autonomy',
    desc: 'Artificial intelligence is moving from optional enhancement to core drone capability. AI enables object detection, autonomous path planning, real-time anomaly identification, and adaptive mission execution without human intervention. Companies developing AI stacks for agriculture, infrastructure, and surveillance are seeing the fastest adoption growth.',
    india: 'Defence requirements following the India-Pakistan conflict have accelerated AI investment in surveillance and strike drones. Commercial AI applications in agriculture and infrastructure are growing rapidly, backed by companies like Aeroby Labs, Crop Wings, and others.',
    tags: ['Computer Vision', 'Path Planning', 'Anomaly Detection', 'Edge AI'],
  },
  {
    num: '03', icon: '🗺️', title: 'High-Speed GIS and Mapping Workflows',
    desc: 'Drone-based photogrammetry and LiDAR workflows have become standard for survey, infrastructure, and urban planning projects. Processing time for large-area surveys has dropped dramatically with GPU acceleration and cloud-based platforms. Sub-5cm accuracy is now achievable with standard drone-GNSS setups.',
    india: 'SVAMITVA Scheme deployed drones at scale for rural land surveys across 3.28 lakh villages. NHAI and Railways have mandated drone surveys for infrastructure monitoring. GIS workflows are the second-largest application after agriculture in India\'s commercial drone market.',
    tags: ['LiDAR', 'Photogrammetry', 'Survey-Grade', 'SVAMITVA'],
  },
  {
    num: '04', icon: '🛡️', title: 'Anti-Drone Systems (C-UAS)',
    desc: 'Counter-drone technology is becoming a standalone industry segment in India. The India-Pakistan conflict demonstrated the real-world effectiveness of drone interception systems including the S-400. India\'s defence procurement now explicitly includes anti-drone capabilities alongside attack drone procurement.',
    india: 'India approved procurement of S-400 additions, Tunguska systems, and dedicated counter-UAS platforms in 2026. Civil applications are also growing — airport protection, prison perimeter security, and critical infrastructure defence against rogue drones.',
    tags: ['C-UAS', 'Jamming', 'Interception', 'Defence'],
  },
  {
    num: '05', icon: '🔋', title: 'Extended Flight Time and Hydrogen Propulsion',
    desc: 'Battery technology remains the primary constraint on drone utility. The race to extend flight times beyond 60 minutes for commercial payloads is driving investment in higher-density LiPo packs, hybrid petrol-electric systems, and hydrogen fuel cells. Hydrogen propulsion is moving from prototype to early deployment phase.',
    india: 'Agriculture applications specifically demand 60+ minute flight times for large farm coverage — a major driver of propulsion R&D investment in India. Indian R&D labs are beginning validation work on hydrogen platforms.',
    tags: ['Hydrogen', 'Battery Tech', 'Hybrid', 'Endurance'],
  },
  {
    num: '06', icon: '🐝', title: 'Swarm Drone Technology',
    desc: 'Coordinated swarms of multiple drones operating from a single command represent the next frontier in both defence and commercial applications. Military swarms provide saturation attack and reconnaissance capability. Commercial swarms enable large-area agriculture coverage, coordinated infrastructure inspection, and light shows.',
    india: 'DRDO and several private companies have demonstrated drone swarm capabilities. Agricultural swarm operations for simultaneous multi-unit spraying across large farms are being piloted. Drone light shows using swarms have been conducted at major government events.',
    tags: ['Swarm', 'DRDO', 'Formation Flight', 'Multi-UAV'],
  },
  {
    num: '07', icon: '📦', title: 'Drone Delivery and Urban Air Mobility',
    desc: 'Drone delivery is transitioning from pilot projects to early commercial operations in India. Medical supplies in remote and hilly areas represent the first viable commercial use case — shorter range, lower regulatory complexity, and clear social value. E-commerce and last-mile delivery remain medium-term targets.',
    india: 'Several Indian state governments are piloting medical drone delivery in Meghalaya, Telangana, and other states. Urban delivery requires BVLOS clearance and UTM integration — both in development. DigitalSky platform is the foundational infrastructure for urban drone delivery.',
    tags: ['Delivery', 'Medical Logistics', 'Urban Air Mobility', 'UTM'],
  },
];

export default function TechTrendsPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    fetchContent('tech-trends', controller.signal).then(setItems).catch(() => {}).finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const displayItems = !loading && items.length > 0 ? null : staticTrends;

  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Media Hub</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
              Tech <span className="text-yellow-400">Trends</span> 2026
            </h1>
            <p className="text-sm text-white/60 leading-relaxed max-w-lg">
              Emerging technologies shaping drone capabilities — BVLOS, AI autonomy, swarms, hybrid propulsion, and counter-drone systems.
            </p>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">7</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Key Trends</span>
            </div>
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">2026</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Roadmap</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 pb-12 space-y-6">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
          <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Emerging</span>
          Technology Trends Shaping India's Drone Industry
        </h2>

        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading tech trends...</div>
        ) : displayItems ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {displayItems.map((trend) => (
              <div key={trend.num} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5">
                <div className="flex items-start gap-4 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-yellow-400 flex items-center justify-center flex-shrink-0 text-xl">
                    {trend.icon}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Trend {trend.num}</span>
                    <h3 className="font-bold text-gray-900 text-base leading-snug">{trend.title}</h3>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">{trend.desc}</p>
                <div className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mb-3">
                  <span className="text-xs font-bold text-amber-700 block mb-1">India Context</span>
                  <p className="text-xs text-amber-800 leading-relaxed">{trend.india}</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {trend.tags.map(tag => (
                    <span key={tag} className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {items.map((item, i) => (
              <div key={item.contentId} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-yellow-400 flex items-center justify-center flex-shrink-0">
                    <span className="text-black font-extrabold text-xs">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="flex-1">
                    {item.category && <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-0.5 rounded mb-2 inline-block">{item.category}</span>}
                    <h3 className="text-sm font-bold text-gray-900 mb-2">{item.title}</h3>
                    {item.description && <p className="text-xs text-gray-500 leading-relaxed mb-3">{item.description}</p>}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {item.tags.map(tag => (
                          <span key={tag} className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded-full">{tag}</span>
                        ))}
                      </div>
                    )}
                    {item.externalLink && (
                      <a href={item.externalLink} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-yellow-600 hover:text-yellow-700 flex items-center gap-1">
                        Learn More <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
