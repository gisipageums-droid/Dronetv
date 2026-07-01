import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchContent, MediaItem } from '../../lib/mediaApi';

const filters = ['All News', 'Market', 'Defence', 'Policy', 'Agriculture', 'Technology', 'Training'];

const staticNews = [
  { id: 's1', category: 'Defence', date: '3 June 2026', title: 'India Set for $2 Billion Domestic Drone Order in Biggest Military Purchase', excerpt: 'India is likely to order more than $2 billion worth of military drones from domestic firms this year in its biggest such purchase. The move represents a major shift toward indigenous drone procurement for defence.', source: 'Reuters' },
  { id: 's2', category: 'Defence Policy', date: '3 April 2026', title: 'India Approves $25B Military Package Including 60 Remotely Piloted Strike Aircraft', excerpt: 'The Defence Acquisition Council approved procurement of 60 new remotely piloted strike aircraft alongside five additional S-400 air defence systems in a record modernisation push.', source: 'Defence News' },
  { id: 's3', category: 'Agriculture', date: 'February 2026', title: 'Namo Drone Didi: Over 500 Drones Deployed to Women SHGs for Precision Farming', excerpt: 'More than 1,094 drones distributed to women self-help groups, including 500+ under the Namo Drone Didi initiative, enabling precision spraying, crop monitoring, and enhanced farm efficiency across rural India.', source: 'IBEF' },
  { id: 's4', category: 'Policy', date: 'February 2026', title: 'SVAMITVA Scheme Surveys 3.28 Lakh Villages Using Drones; 2.76 Crore Property Cards Issued', excerpt: 'Government drone surveys under the SVAMITVA scheme have reached 3.28 lakh villages across 31 states, with 2.76 crore property cards distributed — strengthening land records and reducing property disputes.', source: 'Ministry of Panchayati Raj' },
  { id: 's5', category: 'Market', date: '2025–2026', title: 'PLI Scheme Drives 7x Revenue Growth for Participating Drone Manufacturers', excerpt: 'Production-Linked Incentive scheme for drones, offering up to 20% on value addition, has resulted in sevenfold revenue increase for participating firms, significantly improving manufacturing economics.', source: 'IBEF' },
  { id: 's6', category: 'Technology', date: '2026', title: 'NHAI Mandates Monthly Drone Video Monitoring for All Highway Projects', excerpt: 'National Highways Authority of India now requires contractors to upload monthly drone footage for all highway projects, enabling progress comparison and improving project oversight.', source: 'NHAI / IBEF' },
  { id: 's7', category: 'Training', date: 'February 2026', title: 'India Now Has 39,890 Certified Remote Pilots and 240+ DGCA-Approved RPTOs', excerpt: "India's DGCA has certified 39,890 remote pilots and approved over 240 Remote Pilot Training Organisations as of February 2026, reflecting the rapid expansion of the country's drone workforce.", source: 'DGCA India' },
  { id: 's8', category: 'Policy', date: '2026', title: 'Indian Railways Adopts Drone Inspections for Tracks, Bridges, and Infrastructure Nationwide', excerpt: 'Ministry of Railways has instructed all railway zones and divisions to deploy drones for regular inspection and upkeep of tracks, bridges, and railway infrastructure — reducing inspection time and improving accuracy.', source: 'Ministry of Railways' },
];

const BADGE_MAP: Record<string, string> = {
  market: 'bg-blue-100 text-blue-700',
  defence: 'bg-orange-100 text-orange-700',
  policy: 'bg-green-100 text-green-700',
  agriculture: 'bg-amber-100 text-amber-700',
  technology: 'bg-purple-100 text-purple-700',
  training: 'bg-pink-100 text-pink-700',
};

function badgeClass(category?: string): string {
  if (!category) return 'bg-gray-100 text-gray-600';
  return BADGE_MAP[category.toLowerCase()] ?? 'bg-gray-100 text-gray-600';
}

export default function NewsPulsePage() {
  const [active, setActive] = useState('All News');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [news, setNews] = useState<MediaItem[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    fetchContent('news', controller.signal).then(setNews).catch(() => {});
    return () => controller.abort();
  }, []);

  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Media Hub — India 2026</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
              Drone Industry <span className="text-yellow-400 not-italic">News Pulse</span>
            </h1>
            <p className="text-sm text-white/60 leading-relaxed max-w-lg">
              Latest from India's drone sector — policy updates, market movements, defence procurement, agriculture deployments.
            </p>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">Daily</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Updated</span>
            </div>
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">6</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Categories Covered</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActive(f)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
                  active === f
                    ? 'bg-yellow-400 border-yellow-400 text-black'
                    : 'border-gray-200 text-gray-500 hover:border-yellow-400 hover:text-gray-900'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {(active === 'All News' || active === 'Market') && <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
              <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Featured</span>
              Top Story
            </h2>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="bg-black md:w-56 flex-shrink-0 flex flex-col items-center justify-center p-8">
                  <span className="text-3xl font-extrabold text-yellow-400 leading-none">Rs.29,080Cr</span>
                  <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-2 text-center">Projected Market by 2030</span>
                </div>
                <div className="p-6">
                  <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded mb-2 inline-block">Market</span>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                    India Drone Market to Reach Rs. 29,080 Crore by 2030 at 21.51% CAGR
                  </h3>
                  <p className="text-sm text-gray-500 mb-3 leading-relaxed">
                    India's drone market is on a steep growth trajectory driven by government PLI schemes, defence procurement, and widespread adoption in agriculture and infrastructure monitoring. The sector is projected to grow from Rs.10,977 Crore in 2025 to Rs.29,080 Crore by 2030.
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="font-semibold text-gray-700">IBEF</span>
                    <span>•</span>
                    <span>Jun 2026</span>
                  </div>
                </div>
              </div>
            </div>
          </div>}

          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
              <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Latest</span>
              News Grid
            </h2>
            {(() => {
              if (news.length > 0) {
                const filtered = news.filter(item => active === 'All News' || (item.category || '').toLowerCase().includes(active.toLowerCase()));
                if (filtered.length === 0) return <p className="text-sm text-gray-400 text-center py-8">No {active} articles found.</p>;
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filtered.map(item => (
                      <div key={item.contentId} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                        {item.imageUrl && (
                          <img src={item.imageUrl} alt={item.title} className="w-full h-40 object-cover" />
                        )}
                        <div className="p-5">
                          <div className="flex items-center justify-between mb-3">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${badgeClass(item.category)}`}>{item.category || 'News'}</span>
                            <span className="text-xs text-gray-400">{item.date ? new Date(item.date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : ''}</span>
                          </div>
                          <h3 className="text-sm font-bold text-gray-900 leading-snug mb-3">{item.title}</h3>
                          <p className="text-xs text-gray-500 font-semibold">{item.source}</p>
                          {item.externalLink && (
                            <a href={item.externalLink} target="_blank" rel="noopener noreferrer" className="text-xs text-yellow-600 font-bold hover:text-yellow-700 mt-2 block">Read more →</a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              }
              const filtered = staticNews.filter(item => active === 'All News' || item.category.toLowerCase().includes(active.toLowerCase()));
              const displayed = filtered.length > 0 ? filtered : staticNews;
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {displayed.map(item => (
                    <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${badgeClass(item.category)}`}>{item.category}</span>
                        <span className="text-xs text-gray-400">{item.date}</span>
                      </div>
                      <h3 className="text-sm font-bold text-gray-900 leading-snug mb-2">{item.title}</h3>
                      <p className="text-xs text-gray-500 leading-relaxed mb-2">{item.excerpt}</p>
                      <p className="text-xs text-gray-500 font-semibold">Source: {item.source}</p>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>

          <div className="bg-yellow-400 rounded-xl p-6 flex items-start gap-4">
            <div className="text-2xl">📰</div>
            <div>
              <h3 className="font-bold text-black mb-1">Submit a News Story or Press Release</h3>
              <p className="text-sm text-black/70 mb-3">Share industry news, announcements, or press releases with India's drone community.</p>
              <Link
                to="/media/press-releases"
                className="inline-block bg-black text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors"
              >
                Go to Press Releases →
              </Link>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="bg-black px-4 py-3 rounded-t-xl">
              <h3 className="text-white font-bold text-sm">Subscribe for Updates</h3>
            </div>
            <div className="bg-white border border-gray-200 rounded-b-xl px-4 py-4">
              <p className="text-xs text-gray-500 mb-3">Get the week's top drone industry news in your inbox every Friday.</p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:border-yellow-400"
              />
              {subscribed ? (
                <p className="text-xs text-green-600 font-bold text-center py-1">Subscribed! ✓</p>
              ) : (
                <button
                  onClick={() => { if (email) setSubscribed(true); }}
                  className="w-full bg-yellow-400 text-black font-bold text-xs py-2 rounded-lg hover:bg-yellow-500 transition-colors"
                >
                  Subscribe Free
                </button>
              )}
            </div>
          </div>

          <div>
            <div className="bg-black px-4 py-3 rounded-t-xl">
              <h3 className="text-white font-bold text-sm">Media Hub</h3>
            </div>
            <div className="bg-white border border-gray-200 rounded-b-xl px-4 py-4 space-y-2">
              {[
                { label: 'Magazine', to: '/media/magazine' },
                { label: 'Video Spotlight', to: '/media/video-spotlight' },
                { label: 'Impact Stories', to: '/media/impact-stories' },
                { label: 'Market Intelligence', to: '/media/market-intelligence' },
                { label: 'Tech Trends 2026', to: '/media/tech-trends' },
                { label: 'Press Releases', to: '/media/press-releases' },
                { label: 'Industry Reports', to: '/media/industry-reports' },
              ].map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="flex items-center justify-between py-1.5 text-sm text-gray-700 hover:text-yellow-600 font-medium group"
                >
                  {l.label}
                  <span className="text-gray-300 group-hover:text-yellow-400">→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
