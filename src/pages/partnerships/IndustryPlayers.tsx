import { Link } from 'react-router-dom';

const sectors = [
  {
    title: 'Manufacturers',
    count: '180+',
    icon: '🏭',
    colorClass: 'bg-blue-600',
    companies: ['ideaForge Technology', 'Garuda Aerospace', 'Asteria Aerospace', 'TATA Advanced Systems', 'Raphe mPhibr', 'Throttle Aerospace', 'Vimana Tech', 'TechEagle Innovations'],
  },
  {
    title: 'Service Providers',
    count: '200+',
    icon: '🚁',
    colorClass: 'bg-green-600',
    companies: ['Skye Air Mobility', 'Drone Destination', 'AeroGCS', 'FlyingEye', 'SkyOcean Innovations', 'Aarav Unmanned Systems', 'Marut Drones', 'AgriBot'],
  },
  {
    title: 'Training (RPTOs)',
    count: '240+',
    icon: '🎓',
    colorClass: 'bg-orange-600',
    companies: ['Drone Destination', 'ideaForge RPTO', 'Garuda RPTO', 'TATA RPTO', 'Throttle Academy', 'DroneAcharya', 'Vimana Academy', 'IIT Bombay RPTO'],
  },
  {
    title: 'Tech & Software',
    count: '50+',
    icon: '💻',
    colorClass: 'bg-purple-600',
    companies: ['Aarav Unmanned Systems', 'Asteria AI Stack', 'Netra.ai', 'Detect Technologies', 'Fasal', 'DroneBase India', 'AeroBharat', 'SkyMapper'],
  },
];

export default function IndustryPlayersPage() {
  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Partnerships</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
              Industry Players <span className="text-yellow-400 not-italic">on DroneTv.in</span>
            </h1>
            <p className="text-sm text-white/60 leading-relaxed max-w-lg">
              India's complete drone ecosystem — manufacturers, service providers, training organisations, and technology companies.
            </p>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">515+</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Companies</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {sectors.map((s) => (
            <div key={s.title} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
              <span className="text-2xl block mb-2">{s.icon}</span>
              <p className="text-2xl font-extrabold text-yellow-500">{s.count}</p>
              <p className="text-xs text-gray-600 font-semibold">{s.title}</p>
            </div>
          ))}
        </div>

        <div className="space-y-5">
          {sectors.map((s) => (
            <div key={s.title} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className={`${s.colorClass} px-5 py-3 flex items-center gap-3`}>
                <span className="text-xl">{s.icon}</span>
                <div>
                  <h3 className="text-white font-bold text-sm">{s.title}</h3>
                  <p className="text-white/60 text-xs">{s.count} companies listed</p>
                </div>
              </div>
              <div className="p-5">
                <div className="flex flex-wrap gap-2">
                  {s.companies.map((c) => (
                    <span key={c} className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full">{c}</span>
                  ))}
                  <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1.5 rounded-full">+many more</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-yellow-400 rounded-xl p-6 flex items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-black text-base mb-1">Get Your Company Listed on DroneTv.in</h3>
            <p className="text-black/70 text-sm">Manufacturers, service providers, RPTOs, and tech companies can list on India's leading drone industry platform.</p>
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
