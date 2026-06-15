import { Link } from 'react-router-dom';

const hubs = [
  {
    to: '/media/news-pulse',
    icon: '📰',
    title: 'News Pulse',
    desc: 'Daily coverage of India\'s drone industry — policy, market, defence, agriculture.',
    tags: ['Market', 'Policy', 'Defence'],
    update: '18 articles this month',
  },
  {
    to: '/media/magazine',
    icon: '📖',
    title: 'Magazine',
    desc: 'In-depth quarterly analysis of the drone market, technology, and company profiles.',
    tags: ['Quarterly', 'Analysis', 'Data'],
    update: '4 issues published',
  },
  {
    to: '/media/video-spotlight',
    icon: '🎬',
    title: 'Video Spotlight',
    desc: 'Video interviews with India\'s top drone manufacturers, pilots, and policymakers.',
    tags: ['Interviews', 'Expo', 'YouTube'],
    update: '50+ interviews',
  },
  {
    to: '/gallery',
    icon: '📷',
    title: 'Gallery',
    desc: 'Photo and video coverage from India\'s major drone events and exhibitions.',
    tags: ['Photos', 'Events', '2025'],
    update: 'Drone Expo 2025 Mumbai',
  },
  {
    to: '/media/impact-stories',
    icon: '💡',
    title: 'Impact Stories',
    desc: 'Verified outcomes from real drone deployments — agriculture, infrastructure, defence.',
    tags: ['Agriculture', 'Survey', 'Defence'],
    update: '8 stories published',
  },
  {
    to: '/media/market-intelligence',
    icon: '📊',
    title: 'Market Intelligence',
    desc: 'Data-backed market analysis — growth charts, sector breakdown, key indicators.',
    tags: ['IBEF Data', '2030 Projections'],
    update: 'IBEF data June 2026',
  },
  {
    to: '/media/tech-trends',
    icon: '🚀',
    title: 'Tech Trends',
    desc: 'The technologies defining India\'s drone industry in 2026 — BVLOS, AI, swarms.',
    tags: ['AI', 'BVLOS', 'Swarm'],
    update: '7 trends for 2026',
  },
  {
    to: '/media/press-releases',
    icon: '📣',
    title: 'Press Releases',
    desc: 'Official announcements from government, industry associations, and companies.',
    tags: ['Government', 'Companies'],
    update: 'Submit free',
  },
  {
    to: '/media/industry-reports',
    icon: '📋',
    title: 'Industry Reports',
    desc: 'Curated research from IBEF, DGCA, NITI Aayog, and DroneTv editorial.',
    tags: ['IBEF', 'DGCA', 'Research'],
    update: '5 reports available',
  },
];

export default function MediaHubPage() {
  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">DroneTv.in</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
              DroneTv <span className="text-yellow-400 not-italic">Media Hub</span>
            </h1>
            <p className="text-sm text-white/60 leading-relaxed max-w-lg">
              India's most comprehensive drone industry media platform — news, analysis, video interviews, market data, and impact stories.
            </p>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">50+</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Videos</span>
            </div>
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">Daily</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Updates</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-6 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
          <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Explore</span>
          All Sections
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {hubs.map((h) => (
            <Link
              key={h.to}
              to={h.to}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
            >
              <div className="bg-black px-5 py-4 flex items-center gap-3">
                <span className="text-2xl">{h.icon}</span>
                <div>
                  <h3 className="text-white font-bold text-sm group-hover:text-yellow-400 transition-colors">{h.title}</h3>
                  <p className="text-white/40 text-xs">{h.update}</p>
                </div>
              </div>
              <div className="px-5 py-4">
                <p className="text-sm text-gray-600 leading-relaxed mb-3">{h.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {h.tags.map((t) => (
                    <span key={t} className="bg-gray-100 text-gray-500 text-xs font-semibold px-2 py-0.5 rounded-full">{t}</span>
                  ))}
                </div>
              </div>
              <div className="border-t border-gray-100 px-5 py-3 flex items-center justify-between">
                <span className="text-xs text-gray-400">Explore section</span>
                <span className="text-yellow-400 font-bold text-sm group-hover:translate-x-1 transition-transform inline-block">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
