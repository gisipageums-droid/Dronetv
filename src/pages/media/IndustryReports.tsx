import { useState, useEffect } from 'react';
import { ExternalLink, BarChart2 } from 'lucide-react';
import { fetchContent, MediaItem } from '../../lib/mediaApi';
import CompactHero from '../../components/common/CompactHero';
import ContentCard from '../../components/common/ContentCard';
import { withInlineAds, AdSidebarRail } from '../../components/common/adCreatives';
import PostContentCTA from '../../components/common/PostContentCTA';

const staticReports = [
  {
    id: 'r1', icon: '📊', iconColor: 'bg-status-info',
    publisher: 'IBEF — India Brand Equity Foundation',
    title: "India's Drone Ecosystem: From Policy Push to Commercial Adoption",
    date: 'June 5, 2026 | ibef.org',
    desc: "Comprehensive analysis of India's drone sector covering regulatory evolution, market sizing, sector-by-sector adoption analysis, government scheme impact (SVAMITVA, Namo Drone Didi), PLI scheme outcomes, manufacturing growth, and 5-year market projections. The most authoritative public analysis of India's drone market available as of mid-2026.",
    highlights: [{num:'Rs.10,977Cr',label:'Market 2025'},{num:'21.51%',label:'CAGR to 2030'},{num:'Rs.29,080Cr',label:'Projected 2030'}],
    access: 'Free access — ibef.org',
    badge: 'Free', badgeColor: 'bg-status-success/15 text-status-success',
    link: 'https://www.ibef.org/blogs/india-s-drone-ecosystem-from-policy-push-to-commercial-adoption',
    linkLabel: 'Read Report ↗',
  },
  {
    id: 'r2', icon: '🌐', iconColor: 'bg-status-error',
    publisher: 'Drone Industry Insights (droneii.com)',
    title: 'Global Drone Market Report 2025–2030',
    date: '2025 | droneii.com',
    desc: 'Global drone market analysis covering commercial, military, and consumer segments across 60+ countries. Projects global drone market growth from $40.6 billion in 2025 to $57.8 billion by 2030 at 7.3% CAGR. India cited as one of the world\'s fastest-growing drone markets with 3x the global growth rate.',
    highlights: [{num:'$40.6B',label:'Global 2025'},{num:'7.3%',label:'Global CAGR'},{num:'$57.8B',label:'Global 2030'}],
    access: 'Paid access — droneii.com',
    badge: 'Global Report', badgeColor: 'bg-status-info/15 text-status-info',
    link: 'https://www.droneii.com',
    linkLabel: 'Visit droneii.com ↗',
  },
  {
    id: 'r3', icon: '🛡️', iconColor: 'bg-status-success',
    publisher: 'Defence News / Defense Acquisition Council, India',
    title: "India's $25 Billion Military Modernisation — Drone and UAV Component Analysis",
    date: 'April 3, 2026 | defensenews.com',
    desc: "Analysis of India's Defence Acquisition Council approvals covering 60 remotely piloted strike aircraft, S-400 additions, and Tunguska counter-drone systems. Examines the impact of the India-Pakistan conflict on UAV procurement priorities and the dual-use advantage of India's 60–70% component overlap between military and civilian drone platforms.",
    highlights: [{num:'$25B',label:'Package Size'},{num:'60',label:'Strike Drones'},{num:'5',label:'S-400 Systems'}],
    access: 'Free access — defensenews.com',
    badge: 'Defence', badgeColor: 'bg-status-warning/15 text-status-warning',
    link: 'https://www.defensenews.com/global/asia-pacific/2026/04/03/india-to-acquire-more-air-defense-systems-and-drones-for-modern-warfare/',
    linkLabel: 'Read Report ↗',
  },
  {
    id: 'r4', icon: '🌾', iconColor: 'bg-brand-gold',
    publisher: 'DGCA India / Ministry of Panchayati Raj',
    title: 'India Drone Workforce and Agriculture Deployment Status Report — February 2026',
    date: 'February 2026',
    desc: 'Government data compilation covering drone workforce growth (38,500+ registered drones, 39,890 certified pilots, 240+ RPTOs), SVAMITVA survey progress (3.28 lakh villages, 2.76 crore property cards), Namo Drone Didi deployment (1,094 drones to women SHGs), and DigitalSky platform registration statistics.',
    highlights: [{num:'38,500+',label:'Drones Registered'},{num:'39,890',label:'Certified Pilots'},{num:'240+',label:'Approved RPTOs'}],
    access: 'Public data — dgca.gov.in',
    badge: 'Government Data', badgeColor: 'bg-brand-gold/15 text-brand-gold',
    link: 'https://www.dgca.gov.in',
    linkLabel: 'DGCA Website ↗',
  },
  {
    id: 'r5', icon: '📰', iconColor: 'bg-ink',
    publisher: 'DroneTv.in Editorial Team',
    title: 'India Drone Industry Buyer\'s Guide and Company Directory 2026',
    date: 'June 2026 | dronetv.in',
    desc: "DroneTv.in's curated directory of verified drone companies in India — manufacturers, service providers, training institutes, GIS companies, and AI technology firms. Includes company profiles, product listings, verified contact details, and sector tags. Updated quarterly as new companies are verified and onboarded.",
    highlights: [{num:'100+',label:'Companies Listed'},{num:'5',label:'Verticals Covered'},{num:'Free',label:'Full Access'}],
    access: 'Free — dronetv.in',
    badge: 'DroneTv', badgeColor: 'bg-brand-yellow-soft text-brand-gold',
    link: '/partnerships',
    linkLabel: 'Browse Directory →',
  },
];

export default function IndustryReportsPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
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
    fetchContent('industry-report', controller.signal).then(setItems).catch(() => {}).finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const categories = ['All', ...Array.from(new Set(items.map(i => i.category || 'General').filter(Boolean)))];
  const filtered = activeCategory === 'All' ? items : items.filter(i => (i.category || 'General') === activeCategory);

  return (
    <div className="pt-[104px] min-h-screen bg-surface-main">
      <CompactHero
        title={<>Industry <span>Reports</span></>}
        stats={[
          { n: items.length || staticReports.length, l: 'Key Reports' },
          { n: 'Expert', l: 'Analysis' },
        ]}
      />

      <div className="max-w-6xl mx-auto px-6 py-8 pb-12 lg:flex lg:items-start lg:gap-6">
        <div className="flex-1 min-w-0 space-y-5">
        <h2 className="text-lg font-bold text-ink flex items-center gap-3 after:flex-1 after:h-0.5 after:bg-ink-light after:content-['']">
          <span className="bg-brand-yellow text-ink text-xs font-bold px-2 py-0.5 rounded">2025–2026</span>
          Featured Reports
        </h2>

        {loading ? (
          <div className="text-center py-16 text-ink-caption">Loading industry reports...</div>
        ) : items.length > 0 ? (
          <>
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${activeCategory === cat ? 'bg-brand-yellow border-brand-yellow text-ink' : 'border-ink-light text-ink-caption hover:border-brand-yellow'}`}>
                  {cat}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {withInlineAds(filtered, item => (
                <ContentCard
                  key={item.contentId}
                  image={item.imageUrl}
                  imageAlt={item.title}
                  imageFallback={<BarChart2 className="w-10 h-10 text-brand-yellow" />}
                >
                  <div className="flex items-center justify-between mb-2">
                    {item.category && <span className="bg-status-info/15 text-status-info text-xs font-bold px-2 py-0.5 rounded">{item.category}</span>}
                    {item.date && <span className="text-xs text-ink-caption">{item.date}</span>}
                  </div>
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
                  <div className="mt-auto pt-3 border-t border-ink-light flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-ink-paragraph">{item.source}</span>
                    {item.externalLink && (
                      <a href={item.externalLink} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-brand-gold hover:text-brand-yellow flex items-center gap-1 whitespace-nowrap">
                        View More <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </ContentCard>
              ))}
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {withInlineAds(staticReports, report => (
              <ContentCard key={report.id}>
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl ${report.iconColor} flex items-center justify-center text-xl flex-shrink-0`}>{report.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-ink-caption font-semibold mb-0.5">{report.publisher}</p>
                    <h3 className="font-bold text-ink text-base leading-snug mb-0.5 line-clamp-2">{report.title}</h3>
                    <p className="text-xs text-ink-caption">{report.date}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <p className={`text-sm text-ink-paragraph leading-relaxed ${expandedIds.has(report.id) ? '' : 'line-clamp-3'}`}>{report.desc}</p>
                  {report.desc.length > 140 && (
                    <button onClick={() => toggleExpanded(report.id)} className="text-xs font-bold text-brand-gold hover:text-brand-yellow mt-1">
                      {expandedIds.has(report.id) ? 'Show less' : 'Read more'}
                    </button>
                  )}
                </div>
                <div className="flex gap-4 mb-4">
                  {report.highlights.map((h, i) => (
                    <div key={i} className="text-center">
                      <span className="text-lg font-extrabold text-brand-gold block leading-none">{h.num}</span>
                      <span className="text-xs text-ink-caption">{h.label}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-auto pt-3 border-t border-ink-light flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs text-ink-caption truncate">{report.access}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded flex-shrink-0 ${report.badgeColor}`}>{report.badge}</span>
                  </div>
                  <a href={report.link} target={report.link.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                    className="text-xs font-bold text-brand-gold hover:text-brand-yellow flex items-center gap-1 flex-shrink-0">
                    {report.linkLabel} {report.link.startsWith('http') && <ExternalLink className="w-3 h-3" />}
                  </a>
                </div>
              </ContentCard>
            ))}
          </div>
        )}

          <PostContentCTA contentType="industry-report" typeLabel="Industry Report"
            ctaDescription="Published a research report on the drone/GIS/AI industry? Submit it for wider distribution." />
        </div>
        <AdSidebarRail />
      </div>
    </div>
  );
}
