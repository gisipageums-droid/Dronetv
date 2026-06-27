import { useState, useEffect } from 'react';
import { MEDIA_API, LAMBDA } from '../../lib/apiConfig';

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
    gradient: 'from-slate-900 via-blue-950 to-slate-800',
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
    gradient: 'from-green-950 via-emerald-900 to-green-800',
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
    gradient: 'from-amber-900 via-orange-950 to-yellow-900',
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
    <div className="pt-[104px] min-h-screen bg-gray-50">
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Media Hub</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
              DroneTv <span className="text-yellow-400 not-italic">Magazine</span>
            </h1>
            <p className="text-sm text-white/60 leading-relaxed max-w-lg">
              In-depth quarterly analysis of India's drone industry — market data, policy, technology, and company profiles.
            </p>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">4</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Issues Published</span>
            </div>
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">Qtrly</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Publication</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Articles from CMS */}
        {articles.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-6 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
              <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Latest</span>
              Latest Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map(article => (
                <div key={article.contentId} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  {article.imageUrl && (
                    <img src={article.imageUrl} alt={article.title} className="w-full h-40 object-cover" />
                  )}
                  <div className="p-5">
                    {article.category && (
                      <span className="text-xs font-bold text-yellow-600 uppercase tracking-wider">{article.category}</span>
                    )}
                    <h3 className="font-bold text-gray-900 text-sm mt-1 mb-2 line-clamp-2">{article.title}</h3>
                    {article.description && (
                      <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-3">{article.description}</p>
                    )}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="text-xs text-gray-400">
                        {article.author && <span>{article.author}</span>}
                        {article.author && article.date && <span> · </span>}
                        {article.date && <span>{article.date}</span>}
                      </div>
                      {article.externalLink && (
                        <a
                          href={article.externalLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-gray-900 hover:text-yellow-600 transition-colors"
                        >
                          Read →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-6 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
          <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Issues</span>
          All Editions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {issues.map((issue) => (
            <div key={issue.number} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className={`bg-gradient-to-br ${issue.gradient} aspect-[3/4] flex flex-col items-center justify-center p-6 relative`}>
                <div className="absolute top-4 left-4">
                  <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">ISSUE {issue.number}</span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="text-white/60 text-xs font-semibold">{issue.quarter}</span>
                </div>
                <div className="mt-8 text-center">
                  <span className="text-yellow-400 font-extrabold text-5xl block leading-none mb-1">{issue.number}</span>
                  <span className="text-white/40 text-xs uppercase tracking-widest">DroneTv</span>
                </div>
                <p className="text-white font-bold text-center text-sm mt-4 leading-snug px-2">{issue.title}</p>
              </div>
              <div className="p-5">
                <ul className="space-y-1.5 mb-4">
                  {issue.topics.map((t, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                      <span className="text-yellow-400 font-bold mt-0.5">—</span>
                      {t}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-xs text-green-700 font-semibold">Free for subscribers</span>
                  <a
                    href="mailto:bd@dronetv.in?subject=Request DroneTv Magazine Issue"
                    className="text-xs font-bold text-gray-900 hover:text-yellow-600 transition-colors"
                  >
                    Request Issue →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-6 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
            <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Advertise</span>
            Advertise in DroneTv Magazine
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: '📰', title: 'Directory Listing', desc: 'Logo, company name, and category in the DroneTv Industry Directory — included in every magazine issue for the full subscription year.', badge: 'All Packages', badgeColor: 'bg-green-100 text-green-700', note: 'All 4 issues per year' },
              { icon: '📄', title: 'Half-Page Advertisement', desc: 'Half-page advertisement in 2 issues of DroneTv magazine. Professionally placed in relevant vertical sections.', badge: 'Scale Package', badgeColor: 'bg-blue-100 text-blue-700', note: '2 issues per year' },
              { icon: '📑', title: 'Full-Page Advertisement', desc: 'Full-page advertisement in all 4 quarterly issues plus 1 full editorial article (2–3 pages) in one selected issue. Cover page eligibility included.', badge: 'Brand Package', badgeColor: 'bg-yellow-100 text-yellow-700', note: '4 issues + editorial article' },
              { icon: '🏆', title: 'Cover Page Feature', desc: 'Cover page feature photo eligibility for Brand package subscribers, subject to editorial schedule. The highest-visibility placement in the DroneTv media ecosystem.', badge: 'Brand Package Only', badgeColor: 'bg-orange-100 text-orange-700', note: 'Subject to editorial calendar' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5">
                <div className="text-2xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-gray-900 text-sm mb-2">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-3">{item.desc}</p>
                <span className={`text-xs font-bold px-2 py-0.5 rounded inline-block mb-3 ${item.badgeColor}`}>{item.badge}</span>
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-400">{item.note}</span>
                  <a href="/partnerships/become-a-partner" className="text-xs font-bold text-yellow-600 hover:text-yellow-700">Packages →</a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-black rounded-xl p-8 flex flex-col md:flex-row items-center gap-6 mt-10">
          <div className="flex-1">
            <h3 className="text-white font-extrabold text-xl mb-2">
              Subscribe to receive all future issues <span className="text-yellow-400">free</span>
            </h3>
            <p className="text-white/60 text-sm">New issues drop every quarter. Subscribers also get early access to market intelligence data.</p>
          </div>
          <div className="w-full md:w-auto">
            {submitted ? (
              <p className="text-yellow-400 font-bold text-sm">Subscribed! You'll receive the next issue on release.</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Your email address"
                  className="px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 w-full sm:w-64"
                />
                <button
                  type="submit"
                  className="bg-yellow-400 text-black font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-yellow-500 transition-colors whitespace-nowrap"
                >
                  Subscribe Free
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
