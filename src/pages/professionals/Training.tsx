import { Link } from 'react-router-dom';

const packages = [
  {
    category: 'Small Category RPC',
    duration: '5 Days',
    price: 'Rs.25,000–50,000',
    badge: 'Entry Level',
    badgeClass: 'bg-green-100 text-green-700',
    desc: 'Required for operating drones up to 25kg. Covers theoretical knowledge, pre-flight checks, flight exercises, and the DGCA practical test.',
    includes: ['Theory classes (air regulations, weather, navigation)', 'Flight simulation exercises', 'Practical flying sessions', 'DGCA exam preparation', 'RPC application support'],
    suitable: 'First-time drone pilots, agriculture operators, hobbyists turning professional',
  },
  {
    category: 'Medium Category RPC',
    duration: '15 Days',
    price: 'Rs.75,000–1,25,000',
    badge: 'Advanced',
    badgeClass: 'bg-blue-100 text-blue-700',
    desc: 'For drones in the 25–150kg weight class. Includes advanced navigation, emergency procedures, and multi-crew operations for survey and inspection drones.',
    includes: ['Extended theory sessions', 'Advanced flight manoeuvres', 'Emergency procedure training', 'Survey equipment integration', 'Night and adverse condition flying'],
    suitable: 'Survey professionals, inspection operators, delivery companies',
  },
  {
    category: 'Large Category RPC',
    duration: '30 Days',
    price: 'Rs.1,50,000–3,00,000',
    badge: 'Expert',
    badgeClass: 'bg-purple-100 text-purple-700',
    desc: 'For heavy-lift drones above 150kg. Comprehensive training on multi-rotor and fixed-wing platforms used in cargo, defence, and large-area agriculture applications.',
    includes: ['Full airworthiness training', 'Multi-engine systems', 'Cargo operations procedures', 'Advanced GIS and telemetry', 'Type-specific endorsements'],
    suitable: 'Cargo operators, defence service providers, large-scale agriculture companies',
  },
];

const institutes = [
  { name: 'Drone Destination', city: 'Delhi', specialty: 'All categories, BVLOS research' },
  { name: 'ideaForge Technology', city: 'Pune', specialty: 'Small & Medium, Defence' },
  { name: 'Garuda Aerospace', city: 'Chennai', specialty: 'Agriculture drones, Multirotor' },
  { name: 'TATA Advanced Systems', city: 'Bengaluru', specialty: 'Large category, Defence' },
  { name: 'Throttle Aerospace Systems', city: 'Hyderabad', specialty: 'Survey & GIS, Fixed Wing' },
  { name: 'Asteria Aerospace', city: 'Bengaluru', specialty: 'AI-integrated drones, Small cat.' },
  { name: 'Vimana Tech', city: 'Hyderabad', specialty: 'Agriculture, Small category' },
  { name: 'Raphe mPhibr', city: 'Noida', specialty: 'Defence UAV, Medium category' },
];

export default function TrainingPage() {
  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Professionals</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
              Drone Pilot <span className="text-yellow-400 not-italic">Training</span>
            </h1>
            <p className="text-sm text-white/60 leading-relaxed max-w-lg">
              Find DGCA-approved training organisations and understand the training requirements for each drone category in India.
            </p>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">240+</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">RPTOs Approved</span>
            </div>
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">DGCA</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Approved</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
            <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Packages</span>
            Training Programmes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {packages.map((p) => (
              <div key={p.category} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="bg-black p-5">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded mb-2 inline-block ${p.badgeClass}`}>{p.badge}</span>
                  <h3 className="text-white font-extrabold text-base leading-snug">{p.category}</h3>
                  <p className="text-yellow-400 font-extrabold text-xl mt-1">{p.price}</p>
                  <p className="text-white/50 text-xs">{p.duration} · At RPTO of choice</p>
                </div>
                <div className="p-5">
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">{p.desc}</p>
                  <ul className="space-y-1.5 mb-4">
                    {p.includes.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs text-gray-600">
                        <span className="text-yellow-400 font-bold mt-0.5 flex-shrink-0">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="border-t border-gray-100 pt-3">
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">Best for</p>
                    <p className="text-xs text-gray-600">{p.suitable}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
            <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Institutes</span>
            DGCA-Approved RPTOs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {institutes.map((r) => (
              <div key={r.name} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-4 flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900 text-sm">{r.name}</p>
                  <p className="text-xs text-gray-500">{r.specialty}</p>
                </div>
                <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full flex-shrink-0">{r.city}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-yellow-400 rounded-xl p-6 flex items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-black text-base mb-1">Get Your RPTO Listed on DroneTv.in</h3>
            <p className="text-black/70 text-sm">Reach India's aspiring drone pilots. RPTOs can list their programmes as part of our partnership packages.</p>
          </div>
          <Link
            to="/partnerships/become-a-partner"
            className="bg-black text-white font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-gray-900 transition-colors whitespace-nowrap"
          >
            Become a Partner →
          </Link>
        </div>
      </div>
    </div>
  );
}
