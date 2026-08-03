import { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import { fetchContent, MediaItem } from '../../lib/mediaApi';
import CompactHero from '../../components/common/CompactHero';
import ContentCard from '../../components/common/ContentCard';
import { withInlineAds, AdSidebarRail } from '../../components/common/adCreatives';
import PostContentCTA from '../../components/common/PostContentCTA';

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
    fetchContent('tech-trends', controller.signal).then(setItems).catch(() => {}).finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const displayItems = !loading && items.length > 0 ? null : staticTrends;

  return (
    <div className="pt-[104px] min-h-screen bg-ink-offwhite">
      <CompactHero
        title={<>Tech <span>Trends</span> 2026</>}
        stats={[
          { n: !loading && items.length > 0 ? items.length : staticTrends.length, l: 'Key Trends' },
          { n: '2026', l: 'Roadmap' },
        ]}
      />

      <div className="max-w-6xl mx-auto px-6 py-8 pb-12 lg:flex lg:items-start lg:gap-6">
        <div className="flex-1 min-w-0 space-y-6">
        <h2 className="text-lg font-bold text-ink flex items-center gap-3 after:flex-1 after:h-0.5 after:bg-ink-light after:content-['']">
          <span className="bg-brand-yellow text-ink text-xs font-bold px-2 py-0.5 rounded">Emerging</span>
          Technology Trends Shaping India's Drone Industry
        </h2>

        {loading ? (
          <div className="text-center py-16 text-ink-caption">Loading tech trends...</div>
        ) : displayItems ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {withInlineAds(displayItems, (trend) => (
              <ContentCard key={trend.num}>
                <div className="flex items-start gap-4 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-yellow flex items-center justify-center flex-shrink-0 text-xl">
                    {trend.icon}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-ink-caption uppercase tracking-wide">Trend {trend.num}</span>
                    <h3 className="font-bold text-ink text-base leading-snug">{trend.title}</h3>
                  </div>
                </div>
                <p className="text-sm text-ink-paragraph leading-relaxed mb-3">{trend.desc}</p>
                <div className="bg-surface-main border border-brand-yellow-soft rounded-lg px-3 py-2 mb-3">
                  <span className="text-xs font-bold text-brand-gold block mb-1">India Context</span>
                  <p className="text-xs text-brand-gold leading-relaxed">{trend.india}</p>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-auto pt-3 border-t border-ink-light">
                  {trend.tags.map(tag => (
                    <span key={tag} className="bg-ink-light text-ink-paragraph text-xs font-semibold px-2 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>
              </ContentCard>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {withInlineAds(items, (item, i) => (
              <ContentCard key={item.contentId} image={item.imageUrl} imageAlt={item.title}>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-yellow flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-ink font-extrabold text-xs">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="flex-1 flex flex-col">
                    {item.category && <span className="bg-ink-light text-ink-paragraph text-xs font-bold px-2 py-0.5 rounded mb-2 inline-block self-start">{item.category}</span>}
                    <h3 className="text-sm font-bold text-ink mb-2 line-clamp-2">{item.title}</h3>
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
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {item.tags.map(tag => (
                          <span key={tag} className="bg-ink-light text-ink-paragraph text-xs font-semibold px-2 py-0.5 rounded-full">{tag}</span>
                        ))}
                      </div>
                    )}
                    {item.externalLink && (
                      <a href={item.externalLink} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-brand-gold hover:text-brand-yellow flex items-center gap-1 mt-auto pt-3 border-t border-ink-light">
                        Learn More <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </ContentCard>
            ))}
          </div>
        )}

          <PostContentCTA contentType="tech-trends" typeLabel="Tech Trend"
            ctaDescription="Spotted an emerging drone/GIS/AI technology trend worth covering? Submit it here." />
        </div>
        <AdSidebarRail />
      </div>
    </div>
  );
}
