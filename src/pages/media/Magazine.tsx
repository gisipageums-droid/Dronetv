import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MEDIA_API, LAMBDA } from '../../lib/apiConfig';
import CompactHero from '../../components/common/CompactHero';
import ContentCard from '../../components/common/ContentCard';
import { withInlineAds, AdSidebarRail } from '../../components/common/adCreatives';
import PostContentCTA from '../../components/common/PostContentCTA';
import PagePlacementSlot from '../../components/common/PagePlacementSlot';

const MEDIA_BASE = MEDIA_API ? `${MEDIA_API}` : `${LAMBDA.media}/media-content`;

interface MagazineArticle {
  contentId: string;
  title: string;
  description: string;
  imageUrl?: string;
  externalLink?: string;
  source?: string;
  author?: string;
  date?: string;
  category?: string;
  readTime?: string;
}

const issues = [
  {
    number: '04',
    quarter: 'Q2 2026',
    title: 'Defence Drones: India\'s $2B Procurement Shift',
    gradient: 'from-ink to-ink-premiumend', // Premium Gradient (design system §13)
    topics: [
      '$2B domestic drone order pipeline',
      'Indigenous UAV manufacturers profiled',
      'DRDO programmes update',
      'Export potential for Indian defence drones',
    ],
  },
  {
    number: '03',
    quarter: 'Q1 2026',
    title: 'Agriculture Drones at Scale: Namo Drone Didi',
    gradient: 'from-brand-yellow to-brand-gold', // Gold Gradient (design system §13)
    topics: [
      'Namo Drone Didi scheme deep-dive',
      '500+ SHG deployments mapped',
      'ROI analysis from Telangana farmers',
      'Soil health monitoring use cases',
    ],
  },
  {
    number: '02',
    quarter: 'Q4 2025',
    title: 'Drone Expo 2025 Mumbai: Full Coverage Report',
    gradient: 'from-brand-herostart to-brand-yellow', // Hero Gradient (design system §13)
    topics: [
      '50+ exhibitor profiles',
      'Key announcements and launches',
      'Interview highlights reel',
      'Market sentiment survey results',
    ],
  },
];

export default function MagazinePage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [articles, setArticles] = useState<MagazineArticle[]>([]);

  useEffect(() => {
    fetch(`${MEDIA_BASE}?type=magazine&isPublished=true`)
      .then(r => r.json())
      .then(d => setArticles(d.items || []))
      .catch(() => {});
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setEmail('');
  };

  return (
    <div className="pt-[104px] min-h-screen bg-surface-main">
      <CompactHero
        title={<>DroneTv <span>Magazine</span></>}
        stats={[
          { n: articles.length || issues.length, l: 'Issues Published' },
          { n: 'Qtrly', l: 'Publication' },
        ]}
      />

      <div className="max-w-6xl mx-auto px-6 py-10 lg:flex lg:items-start lg:gap-6">
        <div className="flex-1 min-w-0">

        <PagePlacementSlot slotId="media-magazine" aspect="4/1" minHeight={90} className="mb-8 w-full" />

        {/* Articles from CMS */}
        {articles.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-bold text-ink flex items-center gap-3 mb-6 after:flex-1 after:h-0.5 after:bg-ink-light after:content-['']">
              <span className="bg-brand-yellow text-ink text-xs font-bold px-2 py-0.5 rounded">Latest</span>
              Latest Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {withInlineAds(articles, article => (
                <ContentCard key={article.contentId} image={article.imageUrl} imageAlt={article.title}>
                  {article.category && (
                    <span className="text-xs font-bold text-brand-gold uppercase tracking-wider self-start">{article.category}</span>
                  )}
                  <h3 className="font-bold text-ink text-sm mt-1 mb-2 line-clamp-2">{article.title}</h3>
                  {article.description && (
                    <p className="text-xs text-ink-caption leading-relaxed mb-3 line-clamp-3">{article.description}</p>
                  )}
                  <div className="mt-auto pt-3 border-t border-ink-light flex items-center justify-between">
                    <div className="text-xs text-ink-caption">
                      {article.author && <span>{article.author}</span>}
                      {article.author && article.date && <span> · </span>}
                      {article.date && <span>{article.date}</span>}
                    </div>
                    <Link
                      to={`/media/magazine/${article.contentId}`}
                      state={{ item: article }}
                      className="text-xs font-bold text-ink hover:text-brand-yellow transition-colors whitespace-nowrap"
                    >
                      Read →
                    </Link>
                  </div>
                </ContentCard>
              ))}
            </div>
          </div>
        )}

        <h2 className="text-lg font-bold text-ink flex items-center gap-3 mb-6 after:flex-1 after:h-0.5 after:bg-ink-light after:content-['']">
          <span className="bg-brand-yellow text-ink text-xs font-bold px-2 py-0.5 rounded">Issues</span>
          All Editions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {issues.map((issue) => (
            <div key={issue.number} className="bg-surface-card rounded-xl border border-ink-light shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className={`bg-gradient-to-br ${issue.gradient} aspect-[3/4] flex flex-col items-center justify-center p-6 relative`}>
                <div className="absolute top-4 left-4">
                  <span className="bg-brand-yellow text-ink text-xs font-bold px-2 py-0.5 rounded">ISSUE {issue.number}</span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="text-white/60 text-xs font-semibold">{issue.quarter}</span>
                </div>
                <div className="mt-8 text-center">
                  <span className="text-brand-yellow font-extrabold text-5xl block leading-none mb-1">{issue.number}</span>
                  <span className="text-white/40 text-xs uppercase tracking-widest">DroneTv</span>
                </div>
                <p className="text-white font-bold text-center text-sm mt-4 leading-snug px-2">{issue.title}</p>
              </div>
              <div className="p-5">
                <ul className="space-y-1.5 mb-4">
                  {issue.topics.map((t, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-ink-paragraph">
                      <span className="text-brand-yellow font-bold mt-0.5">—</span>
                      {t}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between pt-3 border-t border-ink-light">
                  <span className="text-xs text-status-success font-semibold">Free for subscribers</span>
                  <a
                    href="mailto:bd@dronetv.in?subject=Request DroneTv Magazine Issue"
                    className="text-xs font-bold text-ink hover:text-brand-yellow transition-colors"
                  >
                    Request Issue →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-lg font-bold text-ink flex items-center gap-3 mb-6 after:flex-1 after:h-0.5 after:bg-ink-light after:content-['']">
            <span className="bg-brand-yellow text-ink text-xs font-bold px-2 py-0.5 rounded">Advertise</span>
            Advertise in DroneTv Magazine
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: '📰', title: 'Directory Listing', desc: 'Logo, company name, and category in the DroneTv Industry Directory — included in every magazine issue for the full subscription year.', badge: 'All Packages', badgeColor: 'bg-status-success/15 text-status-success', note: 'All 4 issues per year' },
              { icon: '📄', title: 'Half-Page Advertisement', desc: 'Half-page advertisement in 2 issues of DroneTv magazine. Professionally placed in relevant vertical sections.', badge: 'Scale Package', badgeColor: 'bg-status-info/15 text-status-info', note: '2 issues per year' },
              { icon: '📑', title: 'Full-Page Advertisement', desc: 'Full-page advertisement in all 4 quarterly issues plus 1 full editorial article (2–3 pages) in one selected issue. Cover page eligibility included.', badge: 'Brand Package', badgeColor: 'bg-brand-yellow-soft text-brand-gold', note: '4 issues + editorial article' },
              { icon: '🏆', title: 'Cover Page Feature', desc: 'Cover page feature photo eligibility for Brand package subscribers, subject to editorial schedule. The highest-visibility placement in the DroneTv media ecosystem.', badge: 'Brand Package Only', badgeColor: 'bg-status-warning/15 text-status-warning', note: 'Subject to editorial calendar' },
            ].map((item, i) => (
              <ContentCard key={i}>
                <div className="text-2xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-ink text-sm mb-2 line-clamp-2">{item.title}</h3>
                <p className="text-xs text-ink-caption leading-relaxed mb-3 line-clamp-3">{item.desc}</p>
                <span className={`text-xs font-bold px-2 py-0.5 rounded inline-block mb-3 self-start ${item.badgeColor}`}>{item.badge}</span>
                <div className="mt-auto pt-3 border-t border-ink-light flex items-center justify-between gap-2">
                  <span className="text-xs text-ink-caption">{item.note}</span>
                  <a href="/partnerships/become-a-partner" className="text-xs font-bold text-brand-gold hover:text-brand-yellow whitespace-nowrap">Packages →</a>
                </div>
              </ContentCard>
            ))}
          </div>
        </div>

        <div className="bg-ink rounded-xl p-8 flex flex-col md:flex-row items-center gap-6 mt-10">
          <div className="flex-1">
            <h3 className="text-white font-extrabold text-xl mb-2">
              Subscribe to receive all future issues <span className="text-brand-yellow">free</span>
            </h3>
            <p className="text-white/60 text-sm">New issues drop every quarter. Subscribers also get early access to market intelligence data.</p>
          </div>
          <div className="w-full md:w-auto">
            {submitted ? (
              <p className="text-brand-yellow font-bold text-sm">Subscribed! You'll receive the next issue on release.</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Your email address"
                  className="px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow w-full sm:w-64"
                />
                <button
                  type="submit"
                  className="bg-brand-yellow text-ink font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-brand-gold transition-colors whitespace-nowrap"
                >
                  Subscribe Free
                </button>
              </form>
            )}
          </div>
        </div>

          <PostContentCTA contentType="magazine" typeLabel="Magazine Feature"
            ctaDescription="Want your company or product featured in an upcoming DroneTv magazine issue? Submit it here." />
        </div>
        <AdSidebarRail />
      </div>
    </div>
  );
}
