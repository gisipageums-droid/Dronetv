import { Link } from 'react-router-dom';

const stories = [
  {
    sector: 'Survey & GIS',
    badgeClass: 'bg-blue-100 text-blue-700',
    title: '3.28 Lakh Villages Mapped Under SVAMITVA in 18 Months',
    desc: 'The SVAMITVA scheme used drones to map property boundaries across 3.28 lakh villages, delivering land rights to rural households and enabling credit access.',
    link: '#',
  },
  {
    sector: 'Infrastructure',
    badgeClass: 'bg-purple-100 text-purple-700',
    title: 'NHAI Cuts Bridge Inspection Time by 70% with Drone Monitoring',
    desc: 'National Highways Authority mandated monthly drone inspections across all highway projects, reducing inspection time and improving safety reporting frequency.',
    link: '#',
  },
  {
    sector: 'Training',
    badgeClass: 'bg-green-100 text-green-700',
    title: '240+ RPTOs Now Training India\'s Next 2 Lakh Drone Pilots',
    desc: 'DGCA\'s approved training organisation network has expanded to 240+ RPTOs nationwide, with the goal of certifying 2 lakh pilots to meet industry demand.',
    link: '#',
  },
  {
    sector: 'Defence',
    badgeClass: 'bg-orange-100 text-orange-700',
    title: 'Indigenous Drones Deployed in Operations: $2B Procurement Shift',
    desc: 'India\'s defence sector is transitioning to domestically manufactured drones with a $2 billion procurement order, reducing import dependence for UAV systems.',
    link: '#',
  },
];

const results = [
  { value: '4x', label: 'Coverage Rate' },
  { value: '40%', label: 'Cost Reduction' },
  { value: '3', label: 'Districts Covered' },
  { value: '18mo', label: 'ROI Achieved' },
];

export default function ImpactStoriesPage() {
  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Media Hub</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
              Drone <span className="text-yellow-400 not-italic">Impact Stories</span>
            </h1>
            <p className="text-sm text-white/60 leading-relaxed max-w-lg">
              Real outcomes from drone deployments across agriculture, infrastructure, defence, and public services in India.
            </p>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">8</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Stories</span>
            </div>
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">5</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Sectors</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
            <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Featured</span>
            Story of the Month
          </h2>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="bg-black md:w-72 flex-shrink-0 p-8 flex flex-col justify-center">
                <p className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-4">Agriculture — Telangana</p>
                <blockquote className="text-white font-bold text-lg leading-snug mb-4">
                  "We went from 2 acres per hour manually to 8 acres per hour. Cost per acre dropped 40%."
                </blockquote>
                <p className="text-white/50 text-sm">
                  Sreenivas Prasad<br />
                  Drone Service Provider, Telangana
                </p>
              </div>
              <div className="p-8 flex-1">
                <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded mb-3 inline-block">Agriculture</span>
                <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight">
                  From Manual Spraying to 8 Acres Per Hour
                </h3>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                  Sreenivas Prasad started with a single agriculture drone in 2023 to serve paddy and cotton farmers in Karimnagar district. Within 18 months, his operation expanded to 3 districts with a team of 4 certified pilots. The shift from backpack sprayers to precision drone spraying transformed farm economics — reducing chemical usage, labour costs, and coverage time simultaneously.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {results.map((r) => (
                    <div key={r.label} className="bg-gray-50 rounded-lg p-3 text-center">
                      <span className="text-2xl font-extrabold text-yellow-500 block leading-none">{r.value}</span>
                      <span className="text-xs text-gray-500 font-semibold mt-1 block">{r.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
            <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Stories</span>
            More Impact Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stories.map((s, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5">
                <span className={`text-xs font-bold px-2 py-0.5 rounded mb-3 inline-block ${s.badgeClass}`}>{s.sector}</span>
                <h3 className="text-sm font-bold text-gray-900 leading-snug mb-2">{s.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-3">{s.desc}</p>
                <Link to={s.link} className="text-xs font-bold text-yellow-600 hover:text-yellow-700 transition-colors">
                  Read Full Story →
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-yellow-400 rounded-xl p-6 flex items-start gap-4">
          <div className="text-2xl">💡</div>
          <div>
            <h3 className="font-bold text-black mb-1">Share Your Drone Impact Story</h3>
            <p className="text-sm text-black/70 mb-3">
              Have a real outcome to share from your drone deployment? We feature verified stories from pilots, operators, and enterprises across India.
            </p>
            <a
              href="mailto:bd@dronetv.in?subject=Impact Story Submission"
              className="inline-block bg-black text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors"
            >
              Submit Your Story →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
