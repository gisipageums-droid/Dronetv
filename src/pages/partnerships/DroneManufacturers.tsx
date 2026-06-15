import { Link } from 'react-router-dom';

const categories = [
  { title: 'Agriculture Drones', icon: '🌾', desc: 'Sprayer drones, multispectral sensors, crop monitoring platforms for Indian farming conditions.', count: '40+ manufacturers' },
  { title: 'Defence UAVs', icon: '🛡️', desc: 'Surveillance, reconnaissance, and combat drone systems for Indian defence forces and paramilitary.', count: '15+ manufacturers' },
  { title: 'Survey Drones', icon: '🗺️', desc: 'High-precision mapping platforms with RTK GPS, LiDAR, and photogrammetry capabilities.', count: '30+ manufacturers' },
  { title: 'Cargo & Delivery', icon: '📦', desc: 'Logistics drones for last-mile delivery, medical supply, and rural connectivity applications.', count: '12+ manufacturers' },
  { title: 'Fixed Wing', icon: '✈️', desc: 'Long-endurance fixed-wing platforms for large-area survey, border patrol, and pipeline monitoring.', count: '20+ manufacturers' },
  { title: 'Multirotor', icon: '🚁', desc: 'Multi-rotor platforms for inspection, cinematography, security, and general commercial operations.', count: '60+ manufacturers' },
];

const companies = [
  'ideaForge Technology',
  'Garuda Aerospace',
  'TechEagle Innovations',
  'TATA Advanced Systems',
  'Asteria Aerospace',
  'Throttle Aerospace Systems',
  'Vimana Tech',
  'Raphe mPhibr',
];

export default function DroneManufacturersPage() {
  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Partnerships</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
              Drone Manufacturers <span className="text-yellow-400 not-italic">on DroneTv.in</span>
            </h1>
            <p className="text-sm text-white/60 leading-relaxed max-w-lg">
              India's drone manufacturers directory — agriculture, defence, survey, cargo, fixed wing, and multirotor platforms.
            </p>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">50+</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Manufacturers Listed</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
            <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Categories</span>
            By Platform Type
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((c) => (
              <div key={c.title} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{c.icon}</span>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{c.title}</h3>
                    <p className="text-xs text-yellow-600 font-semibold">{c.count}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
            <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Featured</span>
            Companies
          </h2>
          <div className="flex flex-wrap gap-3">
            {companies.map((c) => (
              <span
                key={c}
                className="bg-black text-white font-bold text-sm px-4 py-2 rounded-full hover:bg-gray-800 transition-colors cursor-pointer"
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-yellow-400 rounded-xl p-6 flex items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-black text-base mb-1">List Your Drone Company on DroneTv.in</h3>
            <p className="text-black/70 text-sm">Reach buyers, integrators, and government procurement officers through India's drone industry platform.</p>
          </div>
          <Link
            to="/partnerships/become-a-partner"
            className="bg-black text-white font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-gray-900 transition-colors whitespace-nowrap"
          >
            Get Listed →
          </Link>
        </div>
      </div>
    </div>
  );
}
