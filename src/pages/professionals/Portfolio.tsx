import { Link } from 'react-router-dom';

const portfolios = [
  {
    category: 'Aerial Photography',
    categoryClass: 'bg-purple-100 text-purple-700',
    headline: 'Drone Aerial Coverage — Drone Expo 2025 Mumbai',
    location: 'BKC, Mumbai',
    person: 'Priya Nair',
    company: 'Independent Cinematographer',
    desc: 'Full aerial photography and videography of the Drone Expo 2025 trade show floor, outdoor demos, and keynote sessions. 4K footage delivered across 2 days.',
    tags: ['Aerial Video', '4K', 'Events'],
  },
  {
    category: 'GIS Survey',
    categoryClass: 'bg-blue-100 text-blue-700',
    headline: 'SVAMITVA Village Mapping — 42 Villages, 3 Districts',
    location: 'Karimnagar, Telangana',
    person: 'Rajesh Kumar',
    company: 'Survey Solutions',
    desc: 'Completed mapping of 42 villages under the SVAMITVA programme using DJI Phantom 4 RTK. Delivered ortho-rectified maps and property boundary shapefiles to district administration.',
    tags: ['Photogrammetry', 'DEM', 'SVAMITVA'],
  },
  {
    category: 'Agriculture Mapping',
    categoryClass: 'bg-amber-100 text-amber-700',
    headline: 'Paddy Crop Health Mapping — 1,200 Acres',
    location: 'West Godavari, Andhra Pradesh',
    person: 'Sunita Reddy',
    company: 'AgroScan Drones',
    desc: 'NDVI analysis of 1,200 acres of paddy fields during crop development stage. Identified nitrogen deficiency zones and guided targeted fertilisation, reducing input cost by 22%.',
    tags: ['NDVI', 'Multispectral', 'Paddy'],
  },
  {
    category: 'Infrastructure Inspection',
    categoryClass: 'bg-orange-100 text-orange-700',
    headline: 'Bridge Structural Inspection — Godavari Cable Bridge',
    location: 'Rajahmundry, AP',
    person: 'Amit Singh',
    company: 'InfraEye Drones',
    desc: 'Complete visual inspection of cable stays, deck surface, and pylon structure using DJI Matrice 300 RTK with Zenmuse H20T thermal camera. Identified 3 areas requiring maintenance.',
    tags: ['Inspection', 'Thermal', 'Infrastructure'],
  },
  {
    category: 'Training Programme',
    categoryClass: 'bg-green-100 text-green-700',
    headline: 'Trained 48 Agriculture Drone Pilots in 3 Months',
    location: 'Hyderabad, Telangana',
    person: 'Kavita Sharma',
    company: 'SkySpark Training Academy',
    desc: 'Delivered a rapid-certification agriculture drone pilot training programme under Namo Drone Didi. 48 women SHG members trained and certified, now actively operating drones in their districts.',
    tags: ['Training', 'SHG', 'Agriculture'],
  },
  {
    category: 'Real Estate',
    categoryClass: 'bg-indigo-100 text-indigo-700',
    headline: 'Pre-Launch Aerial Marketing — 280-Unit Residential Project',
    location: 'Whitefield, Bengaluru',
    person: 'Kiran Bose',
    company: 'Vista Aerial Media',
    desc: 'Produced complete aerial video and photography package for a major residential launch. Included neighbourhood aerial tour, unit floor flyover simulations, and social media short-form content.',
    tags: ['Real Estate', 'Marketing', 'Aerial Video'],
  },
];

export default function PortfolioPage() {
  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Professionals</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
              Drone Professional <span className="text-yellow-400 not-italic">Portfolio</span>
            </h1>
            <p className="text-sm text-white/60 leading-relaxed max-w-lg">
              Showcase your drone work and get discovered by operators, companies, and buyers across India.
            </p>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">Showcase</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Your Work</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
          <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Featured</span>
          Portfolio Projects
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {portfolios.map((p, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="bg-gray-900 h-32 flex items-center justify-center relative">
                <span className="text-4xl">🚁</span>
                <div className="absolute top-3 left-3">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${p.categoryClass}`}>{p.category}</span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-sm font-bold text-gray-900 leading-snug mb-1">{p.headline}</h3>
                <p className="text-xs text-gray-500 mb-2">📍 {p.location} · {p.person}, {p.company}</p>
                <p className="text-xs text-gray-500 leading-relaxed mb-3">{p.desc}</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {p.tags.map((t) => (
                    <span key={t} className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded-full">{t}</span>
                  ))}
                </div>
                <Link to="/professionals/community" className="text-xs font-bold text-yellow-600 hover:text-yellow-700 transition-colors">
                  View Profile →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-yellow-400 rounded-xl p-6 flex items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-black text-base mb-1">Add Your Portfolio to DroneTv.in</h3>
            <p className="text-black/70 text-sm">DGCA-certified pilots and professional drone operators can submit their work for portfolio listing.</p>
          </div>
          <Link
            to="/professionals/community"
            className="bg-black text-white font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-gray-900 transition-colors whitespace-nowrap"
          >
            Join & List Work →
          </Link>
        </div>
      </div>
    </div>
  );
}
