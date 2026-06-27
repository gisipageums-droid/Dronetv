import { useState, useEffect } from 'react';
import { ExternalLink, BarChart2 } from 'lucide-react';
import { fetchContent, MediaItem } from '../../lib/mediaApi';

const staticReports = [
  {
    id: 'r1', icon: '📊', iconColor: 'bg-blue-600',
    publisher: 'IBEF — India Brand Equity Foundation',
    title: "India's Drone Ecosystem: From Policy Push to Commercial Adoption",
    date: 'June 5, 2026 | ibef.org',
    desc: "Comprehensive analysis of India's drone sector covering regulatory evolution, market sizing, sector-by-sector adoption analysis, government scheme impact (SVAMITVA, Namo Drone Didi), PLI scheme outcomes, manufacturing growth, and 5-year market projections. The most authoritative public analysis of India's drone market available as of mid-2026.",
    highlights: [{num:'Rs.10,977Cr',label:'Market 2025'},{num:'21.51%',label:'CAGR to 2030'},{num:'Rs.29,080Cr',label:'Projected 2030'}],
    access: 'Free access — ibef.org',
    badge: 'Free', badgeColor: 'bg-green-100 text-green-700',
    link: 'https://www.ibef.org/blogs/india-s-drone-ecosystem-from-policy-push-to-commercial-adoption',
    linkLabel: 'Read Report ↗',
  },
  {
    id: 'r2', icon: '🌐', iconColor: 'bg-red-600',
    publisher: 'Drone Industry Insights (droneii.com)',
    title: 'Global Drone Market Report 2025–2030',
    date: '2025 | droneii.com',
    desc: 'Global drone market analysis covering commercial, military, and consumer segments across 60+ countries. Projects global drone market growth from $40.6 billion in 2025 to $57.8 billion by 2030 at 7.3% CAGR. India cited as one of the world\'s fastest-growing drone markets with 3x the global growth rate.',
    highlights: [{num:'$40.6B',label:'Global 2025'},{num:'7.3%',label:'Global CAGR'},{num:'$57.8B',label:'Global 2030'}],
    access: 'Paid access — droneii.com',
    badge: 'Global Report', badgeColor: 'bg-blue-100 text-blue-700',
    link: 'https://www.droneii.com',
    linkLabel: 'Visit droneii.com ↗',
  },
  {
    id: 'r3', icon: '🛡️', iconColor: 'bg-green-600',
    publisher: 'Defence News / Defense Acquisition Council, India',
    title: "India's $25 Billion Military Modernisation — Drone and UAV Component Analysis",
    date: 'April 3, 2026 | defensenews.com',
    desc: "Analysis of India's Defence Acquisition Council approvals covering 60 remotely piloted strike aircraft, S-400 additions, and Tunguska counter-drone systems. Examines the impact of the India-Pakistan conflict on UAV procurement priorities and the dual-use advantage of India's 60–70% component overlap between military and civilian drone platforms.",
    highlights: [{num:'$25B',label:'Package Size'},{num:'60',label:'Strike Drones'},{num:'5',label:'S-400 Systems'}],
    access: 'Free access — defensenews.com',
    badge: 'Defence', badgeColor: 'bg-orange-100 text-orange-700',
    link: 'https://www.defensenews.com/global/asia-pacific/2026/04/03/india-to-acquire-more-air-defense-systems-and-drones-for-modern-warfare/',
    linkLabel: 'Read Report ↗',
  },
  {
    id: 'r4', icon: '🌾', iconColor: 'bg-yellow-500',
    publisher: 'DGCA India / Ministry of Panchayati Raj',
    title: 'India Drone Workforce and Agriculture Deployment Status Report — February 2026',
    date: 'February 2026',
    desc: 'Government data compilation covering drone workforce growth (38,500+ registered drones, 39,890 certified pilots, 240+ RPTOs), SVAMITVA survey progress (3.28 lakh villages, 2.76 crore property cards), Namo Drone Didi deployment (1,094 drones to women SHGs), and DigitalSky platform registration statistics.',
    highlights: [{num:'38,500+',label:'Drones Registered'},{num:'39,890',label:'Certified Pilots'},{num:'240+',label:'Approved RPTOs'}],
    access: 'Public data — dgca.gov.in',
    badge: 'Government Data', badgeColor: 'bg-purple-100 text-purple-700',
    link: 'https://www.dgca.gov.in',
    linkLabel: 'DGCA Website ↗',
  },
  {
    id: 'r5', icon: '📰', iconColor: 'bg-black',
    publisher: 'DroneTv.in Editorial Team',
    title: 'India Drone Industry Buyer\'s Guide and Company Directory 2026',
    date: 'June 2026 | dronetv.in',
    desc: "DroneTv.in's curated directory of verified drone companies in India — manufacturers, service providers, training institutes, GIS companies, and AI technology firms. Includes company profiles, product listings, verified contact details, and sector tags. Updated quarterly as new companies are verified and onboarded.",
    highlights: [{num:'100+',label:'Companies Listed'},{num:'5',label:'Verticals Covered'},{num:'Free',label:'Full Access'}],
    access: 'Free — dronetv.in',
    badge: 'DroneTv', badgeColor: 'bg-yellow-100 text-yellow-700',
    link: '/partnerships',
    linkLabel: 'Browse Directory →',
  },
];

export default function IndustryReportsPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const controller = new AbortController();
    fetchContent('industry-report', controller.signal).then(setItems).catch(() => {}).finally(() => setLoading(false));
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
              Industry <span className="text-yellow-400">Reports</span>
            </h1>
            <p className="text-sm text-white/60 leading-relaxed max-w-lg">
              Comprehensive reports from IBEF, DGCA, Drone Industry Insights, and leading consultancies on India's drone ecosystem.
            </p>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">5+</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Key Reports</span>
            </div>
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">Expert</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Analysis</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 pb-12 space-y-5">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
          <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">2025–2026</span>
          Featured Reports
        </h2>

        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading industry reports...</div>
        ) : items.length > 0 ? (
          <>
            <div className="flex gap-2 flex-wrap">
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
                      <BarChart2 className="w-10 h-10 text-yellow-400" />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      {item.category && <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded">{item.category}</span>}
                      {item.date && <span className="text-xs text-gray-400">{item.date}</span>}
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 leading-snug mb-2">{item.title}</h3>
                    {item.description && <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-3">{item.description}</p>}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-600">{item.source}</span>
                      {item.externalLink && (
                        <a href={item.externalLink} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-yellow-600 hover:text-yellow-700 flex items-center gap-1">
                          Download <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="space-y-4">
            {staticReports.map(report => (
              <div key={report.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5">
                <div className="flex items-start gap-4 mb-3">
                  <div className={`w-10 h-10 rounded-xl ${report.iconColor} flex items-center justify-center text-xl flex-shrink-0`}>{report.icon}</div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 font-semibold mb-0.5">{report.publisher}</p>
                    <h3 className="font-bold text-gray-900 text-base leading-snug mb-0.5">{report.title}</h3>
                    <p className="text-xs text-gray-400">{report.date}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">{report.desc}</p>
                <div className="flex gap-4 mb-4">
                  {report.highlights.map((h, i) => (
                    <div key={i} className="text-center">
                      <span className="text-lg font-extrabold text-yellow-500 block leading-none">{h.num}</span>
                      <span className="text-xs text-gray-400">{h.label}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{report.access}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${report.badgeColor}`}>{report.badge}</span>
                  </div>
                  <a href={report.link} target={report.link.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                    className="text-xs font-bold text-yellow-600 hover:text-yellow-700 flex items-center gap-1">
                    {report.linkLabel} {report.link.startsWith('http') && <ExternalLink className="w-3 h-3" />}
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
