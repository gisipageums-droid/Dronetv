import { Link } from 'react-router-dom';

const conferences = [
  {
    title: 'Drone International Expo Technical Conference 2026',
    date: 'Jun 24, 2026',
    location: 'Bharat Mandapam, New Delhi',
    badge: 'DroneTv Media Partner',
    badgeClass: 'bg-orange-100 text-orange-700',
    status: 'Upcoming',
    statusClass: 'bg-yellow-100 text-yellow-700',
    desc: 'Full-day technical conference co-located with Drone International Expo 2026. Expert panels covering the latest in drone regulations, agricultural deployments, defence procurement, and infrastructure monitoring.',
    topics: ['BVLOS Regulatory Framework Update', 'Agriculture Drone ROI: Real Data', 'Defence Procurement Pipeline 2026', 'Infrastructure Inspection at Scale', 'UTM and Airspace Management'],
    featured: true,
  },
  {
    title: 'Drone Expo 2026 Bengaluru Conference',
    date: 'Sep 2026',
    location: 'Bengaluru (venue TBC)',
    badge: 'DroneTv Media Partner',
    badgeClass: 'bg-orange-100 text-orange-700',
    status: 'Save the Date',
    statusClass: 'bg-blue-100 text-blue-700',
    desc: 'Two-day industry conference focused on drone policy, market development, and technology showcases. DroneTv will produce video coverage and interview delegates.',
    topics: ['PLI Scheme Progress Review', 'Export Opportunities for Indian Drones', 'Training Ecosystem Update (240+ RPTOs)', 'Startup Showcase'],
    featured: false,
  },
  {
    title: 'InterDrone 2026',
    date: 'Oct 2026',
    location: 'Las Vegas, Nevada, USA',
    badge: 'Global',
    badgeClass: 'bg-purple-100 text-purple-700',
    status: 'International',
    statusClass: 'bg-gray-100 text-gray-600',
    desc: 'North America\'s largest commercial drone conference. Covers autonomous systems, enterprise applications, regulatory updates across the US and global markets. Relevant for Indian exporters and technology companies.',
    topics: ['FAA BVLOS Rulemaking', 'Enterprise Drone Adoption', 'Counter-UAV Technology', 'Drone Delivery at Scale'],
    featured: false,
  },
];

export default function ConferencesPage() {
  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Events</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
              Drone <span className="text-yellow-400 not-italic">Conferences and Industry Summits</span>
            </h1>
            <p className="text-sm text-white/60 leading-relaxed max-w-lg">
              Expert panels, regulatory briefings, and market sessions from India's leading drone industry conferences.
            </p>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">3</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Upcoming Events</span>
            </div>
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">India</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">& Global</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-5">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-6 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
          <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">2026</span>
          Upcoming Conferences
        </h2>

        {conferences.map((c, i) => (
          <div
            key={i}
            className={`bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow overflow-hidden ${
              c.featured ? 'border-yellow-300' : 'border-gray-200'
            }`}
          >
            {c.featured && (
              <div className="bg-yellow-400 px-5 py-2">
                <p className="text-black font-bold text-xs uppercase tracking-widest">Featured Conference</p>
              </div>
            )}
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${c.badgeClass}`}>{c.badge}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${c.statusClass}`}>{c.status}</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-gray-900 leading-snug mb-1">{c.title}</h3>
                  <p className="text-sm text-yellow-600 font-bold mb-3">{c.date} · {c.location}</p>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">{c.desc}</p>
                  <div>
                    <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Topics Covered</p>
                    <div className="flex flex-wrap gap-2">
                      {c.topics.map((t) => (
                        <span key={t} className="bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-full">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="bg-yellow-400 rounded-xl p-6 flex items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-black text-base mb-1">Organising a drone conference?</h3>
            <p className="text-black/70 text-sm">DroneTv produces media coverage and interviews at industry conferences across India.</p>
          </div>
          <Link
            to="/partnerships/become-a-partner"
            className="bg-black text-white font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-gray-900 transition-colors whitespace-nowrap"
          >
            Partner with DroneTv →
          </Link>
        </div>
      </div>
    </div>
  );
}
