const reports = [
  {
    iconBg: 'bg-blue-600',
    icon: '📊',
    publisher: 'IBEF',
    title: "India's Drone Ecosystem: From Policy Push to Commercial Adoption",
    date: 'Jun 2026',
    desc: 'Comprehensive analysis of India\'s drone market covering government policy, PLI scheme outcomes, sector-wise adoption, and 2030 growth projections.',
    stats: ['Rs.10,977Cr Market 2025', '21.51% CAGR', 'Rs.29,080Cr by 2030'],
    access: 'Free access on IBEF.org',
    badges: ['Market', 'Policy'],
    link: 'https://www.ibef.org',
    external: true,
  },
  {
    iconBg: 'bg-purple-600',
    icon: '🌐',
    publisher: 'Drone Industry Insights',
    title: 'Global Drone Market Report 2025–2030',
    date: 'Mar 2026',
    desc: 'Global overview of the commercial drone industry covering 40+ countries, sector breakdown, regulatory environment comparison, and leading company profiles.',
    stats: ['$58.4B Global Market', '7.3% Global CAGR', '40+ Countries Covered'],
    access: 'Available on droneii.com',
    badges: ['Global', 'Market'],
    link: 'https://www.droneii.com',
    external: true,
  },
  {
    iconBg: 'bg-green-600',
    icon: '🏛️',
    publisher: 'DGCA India',
    title: 'Remote Pilot Certificate Statistics 2026',
    date: 'Apr 2026',
    desc: 'Official DGCA data on remote pilot certification, approved training organisations, registered drone fleet, and enforcement actions in India.',
    stats: ['39,890 Certified Pilots', '240 RPTOs Approved', '38,500+ Drones Registered'],
    access: 'Free on digitalsky.dgca.gov.in',
    badges: ['Regulation', 'Official'],
    link: 'https://digitalsky.dgca.gov.in',
    external: true,
  },
  {
    iconBg: 'bg-orange-600',
    icon: '🇮🇳',
    publisher: 'NITI Aayog',
    title: "India's Drone Shakti Vision 2030",
    date: '2023',
    desc: 'India\'s long-term policy framework for the drone sector, setting targets for manufacturing, exports, pilot certification, and creating a hub-and-spoke drone services network.',
    stats: ['Rs.900Cr PLI Scheme', '500+ Drone Startups', '50,000 Jobs Projected'],
    access: 'Free PDF download',
    badges: ['Policy', 'Vision'],
    link: 'https://www.niti.gov.in',
    external: true,
  },
  {
    iconBg: 'bg-yellow-500',
    icon: '🎬',
    publisher: 'DroneTv Editorial',
    title: 'Drone Expo 2025 Mumbai: Industry Snapshot',
    date: 'Dec 2025',
    desc: 'DroneTv\'s on-the-ground report from Drone Expo 2025 Mumbai — company announcements, product launches, interview highlights, and market sentiment survey results.',
    stats: ['50+ Interviews Filmed', '200+ Companies Present', '3 Days Coverage'],
    access: 'Free for DroneTv subscribers',
    badges: ['Event', 'Editorial'],
    link: '/media/video-spotlight',
    external: false,
  },
];

export default function IndustryReportsPage() {
  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Media Hub</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
              Drone <span className="text-yellow-400 not-italic">Industry Reports</span>
            </h1>
            <p className="text-sm text-white/60 leading-relaxed max-w-lg">
              Curated research and official data on India's drone market from government bodies, research firms, and DroneTv editorial.
            </p>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">5</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Reports</span>
            </div>
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">Free</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">To Access</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-5">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-6 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
          <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">All</span>
          Reports
        </h2>

        {reports.map((r, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-5">
                <div className={`${r.iconBg} w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0`}>
                  {r.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <p className="text-xs font-bold text-gray-400 mb-0.5">{r.publisher} · {r.date}</p>
                      <h3 className="text-base font-extrabold text-gray-900 leading-snug">{r.title}</h3>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {r.badges.map((b) => (
                        <span key={b} className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-0.5 rounded">{b}</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">{r.desc}</p>
                  <div className="flex flex-wrap gap-3 mb-4">
                    {r.stats.map((s) => (
                      <span key={s} className="bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-lg">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-100 px-6 py-3 flex items-center justify-between bg-gray-50">
              <span className="text-xs text-gray-500 font-semibold">{r.access}</span>
              {r.external ? (
                <a
                  href={r.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-yellow-600 hover:text-yellow-700 transition-colors"
                >
                  Access Report →
                </a>
              ) : (
                <a href={r.link} className="text-xs font-bold text-yellow-600 hover:text-yellow-700 transition-colors">
                  Access Report →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
