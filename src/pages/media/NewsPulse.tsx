import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { fetchContent, MediaItem } from '../../lib/mediaApi';
import CompactHero from '../../components/common/CompactHero';
import ContentCard from '../../components/common/ContentCard';
import AdSlot from '../../components/common/AdSlot';
import PagePlacementSlot from '../../components/common/PagePlacementSlot';
import { withInlineAds, ExpoAdCreative, DroneAdCreative, getAdsFor } from '../../components/common/adCreatives';
import PostContentCTA from '../../components/common/PostContentCTA';


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
  market: 'bg-status-info/15 text-status-info',
  defence: 'bg-status-warning/15 text-status-warning',
  policy: 'bg-status-success/15 text-status-success',
  agriculture: 'bg-brand-yellow-soft text-brand-gold',
  technology: 'bg-brand-gold/15 text-brand-gold',
  training: 'bg-status-error/15 text-status-error',
};

function badgeClass(category?: string): string {
  if (!category) return 'bg-ink-light text-ink-paragraph';
  return BADGE_MAP[category.toLowerCase()] ?? 'bg-ink-light text-ink-paragraph';
}

export default function NewsPulsePage() {
  const { pathname } = useLocation();
  const sidebarAds = getAdsFor('sidebar', pathname);
  const [active, setActive] = useState('All News');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [news, setNews] = useState<MediaItem[]>([]);
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
    fetchContent('news', controller.signal).then(setNews).catch(() => {});
    return () => controller.abort();
  }, []);

  return (
    <div className="pt-[104px] min-h-screen bg-ink-offwhite">
      <CompactHero
        title={<>Drone Industry <span>News Pulse</span></>}
        stats={[
          { n: 'Daily', l: 'Updated' },
          { n: 6, l: 'Categories Covered' },
        ]}
      />

      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActive(f)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
                  active === f
                    ? 'bg-brand-yellow border-brand-yellow text-ink'
                    : 'border-ink-light text-ink-caption hover:border-brand-yellow hover:text-ink'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {(active === 'All News' || active === 'Market') && <div>
            <h2 className="text-lg font-bold text-ink flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-ink-light after:content-['']">
              <span className="bg-brand-yellow text-ink text-xs font-bold px-2 py-0.5 rounded">Featured</span>
              Top Story
            </h2>
            <div className="bg-surface-card rounded-xl border border-ink-light shadow-sm overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="bg-ink md:w-56 flex-shrink-0 flex flex-col items-center justify-center p-8">
                  <span className="text-3xl font-extrabold text-brand-yellow leading-none">Rs.29,080Cr</span>
                  <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-2 text-center">Projected Market by 2030</span>
                </div>
                <div className="p-6">
                  <span className="bg-status-info/15 text-status-info text-xs font-bold px-2 py-0.5 rounded mb-2 inline-block">Market</span>
                  <h3 className="text-xl font-bold text-ink mb-2 leading-tight">
                    India Drone Market to Reach Rs. 29,080 Crore by 2030 at 21.51% CAGR
                  </h3>
                  <p className="text-sm text-ink-caption mb-3 leading-relaxed">
                    India's drone market is on a steep growth trajectory driven by government PLI schemes, defence procurement, and widespread adoption in agriculture and infrastructure monitoring. The sector is projected to grow from Rs.10,977 Crore in 2025 to Rs.29,080 Crore by 2030.
                  </p>
                  <div className="flex items-center gap-3 text-xs text-ink-caption">
                    <span className="font-semibold text-ink-paragraph">IBEF</span>
                    <span>•</span>
                    <span>Jun 2026</span>
                  </div>
                </div>
              </div>
            </div>
          </div>}

          <div>
            {/* "News Pulse Spot" paid placement — booked via User Dashboard > Page Placements */}
            <PagePlacementSlot slotId="media-news" aspect="4/1" minHeight={90} className="mb-5 w-full" />

            <h2 className="text-lg font-bold text-ink flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-ink-light after:content-['']">
              <span className="bg-brand-yellow text-ink text-xs font-bold px-2 py-0.5 rounded">Latest</span>
              News Grid
            </h2>
            {(() => {
              if (news.length > 0) {
                const filtered = news.filter(item => active === 'All News' || (item.category || '').toLowerCase().includes(active.toLowerCase()));
                if (filtered.length === 0) return <p className="text-sm text-ink-caption text-center py-8">No {active} articles found.</p>;
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {withInlineAds(filtered, item => (
                      <ContentCard key={item.contentId} image={item.imageUrl} imageAlt={item.title}>
                        <div className="flex items-center justify-between mb-3">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded ${badgeClass(item.category)}`}>{item.category || 'News'}</span>
                          <span className="text-xs text-ink-caption">{item.date ? new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}</span>
                        </div>
                        <h3 className="text-sm font-bold text-ink leading-snug mb-3 line-clamp-2">{item.title}</h3>
                        <div className="mt-auto pt-3 border-t border-ink-light">
                          <p className="text-xs text-ink-caption font-semibold">{item.source}</p>
                          <Link to={`/media/news/${item.contentId}`} state={{ item }} className="text-xs text-brand-gold font-bold hover:text-brand-yellow mt-2 block">Read more →</Link>
                        </div>
                      </ContentCard>
                    ))}
                  </div>
                );
              }
              const filtered = staticNews.filter(item => active === 'All News' || item.category.toLowerCase().includes(active.toLowerCase()));
              const displayed = filtered.length > 0 ? filtered : staticNews;
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {withInlineAds(displayed, item => (
                    <ContentCard key={item.id}>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${badgeClass(item.category)}`}>{item.category}</span>
                        <span className="text-xs text-ink-caption">{item.date}</span>
                      </div>
                      <h3 className="text-sm font-bold text-ink leading-snug mb-2 line-clamp-2">{item.title}</h3>
                      <div className="mb-2">
                        <p className={`text-xs text-ink-caption leading-relaxed ${expandedIds.has(item.id) ? '' : 'line-clamp-3'}`}>{item.excerpt}</p>
                        {item.excerpt.length > 140 && (
                          <button onClick={() => toggleExpanded(item.id)} className="text-xs font-bold text-brand-gold hover:text-brand-yellow mt-1">
                            {expandedIds.has(item.id) ? 'Show less' : 'Read more'}
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-ink-caption font-semibold mt-auto pt-3 border-t border-ink-light">Source: {item.source}</p>
                    </ContentCard>
                  ))}
                </div>
              );
            })()}
          </div>

          <div className="bg-brand-yellow rounded-xl p-6 flex items-start gap-4">
            <div className="text-2xl">📰</div>
            <div>
              <h3 className="font-bold text-ink mb-1">Submit a News Story or Press Release</h3>
              <p className="text-sm text-ink/70 mb-3">Share industry news, announcements, or press releases with India's drone community.</p>
              <Link
                to="/media/press-releases"
                className="inline-block bg-ink text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-ink-charcoal transition-colors"
              >
                Go to Press Releases →
              </Link>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="bg-ink px-4 py-3 rounded-t-xl">
              <h3 className="text-white font-bold text-sm">Subscribe for Updates</h3>
            </div>
            <div className="bg-surface-card border border-ink-light rounded-b-xl px-4 py-4">
              <p className="text-xs text-ink-caption mb-3">Get the week's top drone industry news in your inbox every Friday.</p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full border border-ink-light rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:border-brand-yellow"
              />
              {subscribed ? (
                <p className="text-xs text-status-success font-bold text-center py-1">Subscribed! ✓</p>
              ) : (
                <button
                  onClick={() => { if (email) setSubscribed(true); }}
                  className="w-full bg-brand-yellow text-ink font-bold text-xs py-2 rounded-lg hover:bg-brand-gold transition-colors"
                >
                  Subscribe Free
                </button>
              )}
            </div>
          </div>

          <div>
            <div className="bg-ink px-4 py-3 rounded-t-xl">
              <h3 className="text-white font-bold text-sm">Media Hub</h3>
            </div>
            <div className="bg-surface-card border border-ink-light rounded-b-xl px-4 py-4 space-y-2">
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
                  className="flex items-center justify-between py-1.5 text-sm text-ink-paragraph hover:text-brand-yellow font-medium group"
                >
                  {l.label}
                  <span className="text-ink-light group-hover:text-brand-yellow">→</span>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <span className="block text-center text-[10px] font-semibold text-ink-caption uppercase tracking-widest mb-2">Advertisement</span>
            {sidebarAds[0] ? (
              <AdSlot image={sidebarAds[0].imageUrl} href={sidebarAds[0].externalLink} alt={sidebarAds[0].title} width={300} height={250} className="mx-auto" />
            ) : (
              <AdSlot width={300} height={250} className="mx-auto"><ExpoAdCreative /></AdSlot>
            )}
          </div>
          <div>
            <span className="block text-center text-[10px] font-semibold text-ink-caption uppercase tracking-widest mb-2">Advertisement</span>
            {sidebarAds[1] ? (
              <AdSlot image={sidebarAds[1].imageUrl} href={sidebarAds[1].externalLink} alt={sidebarAds[1].title} width={300} height={250} className="mx-auto" />
            ) : (
              <AdSlot width={300} height={250} className="mx-auto"><DroneAdCreative /></AdSlot>
            )}
          </div>
        </div>

        <div className="lg:col-span-3">
          <PostContentCTA contentType="news" typeLabel="News Article"
            ctaDescription="Have drone/GIS/AI industry news to share? Submit your article for the News Pulse." />
        </div>
      </div>
    </div>
  );
}
