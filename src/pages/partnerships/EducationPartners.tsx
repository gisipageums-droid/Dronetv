import { Link } from 'react-router-dom';

const rptOs = [
  {
    name: 'Drone Destination',
    city: 'Delhi',
    specialty: 'All categories, BVLOS research, corporate training',
    students: '2,000+ trained',
    badge: 'Multi-Category',
    badgeClass: 'bg-blue-100 text-blue-700',
  },
  {
    name: 'ideaForge Technology',
    city: 'Pune',
    specialty: 'Small & Medium category, defence-grade UAV operations',
    students: '1,500+ trained',
    badge: 'Manufacturer RPTO',
    badgeClass: 'bg-orange-100 text-orange-700',
  },
  {
    name: 'Garuda Aerospace',
    city: 'Chennai',
    specialty: 'Agriculture drone operations, sprayer training',
    students: '3,000+ trained',
    badge: 'Agriculture Specialist',
    badgeClass: 'bg-green-100 text-green-700',
  },
  {
    name: 'TATA Advanced Systems',
    city: 'Bengaluru',
    specialty: 'Large category, defence UAV, corporate training',
    students: '800+ trained',
    badge: 'Large Category',
    badgeClass: 'bg-purple-100 text-purple-700',
  },
  {
    name: 'Throttle Aerospace Systems',
    city: 'Hyderabad',
    specialty: 'Survey and mapping, GIS integration, fixed-wing',
    students: '600+ trained',
    badge: 'Survey Specialist',
    badgeClass: 'bg-amber-100 text-amber-700',
  },
  {
    name: 'Asteria Aerospace',
    city: 'Bengaluru',
    specialty: 'AI-integrated drone training, small category',
    students: '400+ trained',
    badge: 'AI Integration',
    badgeClass: 'bg-indigo-100 text-indigo-700',
  },
  {
    name: 'Vimana Tech',
    city: 'Hyderabad',
    specialty: 'Agriculture and small category, SHG training',
    students: '1,200+ trained',
    badge: 'Agriculture',
    badgeClass: 'bg-green-100 text-green-700',
  },
  {
    name: 'DroneAcharya Aerial Innovations',
    city: 'Pune',
    specialty: 'Small category, competitive training, youth programmes',
    students: '900+ trained',
    badge: 'Youth Focus',
    badgeClass: 'bg-blue-100 text-blue-700',
  },
];

export default function EducationPartnersPage() {
  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Partnerships</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
              RPTO and Education <span className="text-yellow-400 not-italic">Partners on DroneTv.in</span>
            </h1>
            <p className="text-sm text-white/60 leading-relaxed max-w-lg">
              DGCA-approved Remote Pilot Training Organisations shaping India's next generation of certified drone pilots.
            </p>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">240+</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">RPTOs in India</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
            <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Listed</span>
            Partner RPTOs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rptOs.map((r) => (
              <div key={r.name} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{r.name}</h3>
                    <p className="text-xs text-gray-500">{r.city}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded flex-shrink-0 ${r.badgeClass}`}>{r.badge}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed mb-3">{r.specialty}</p>
                <p className="text-xs font-bold text-yellow-600">{r.students}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-yellow-400 rounded-xl p-6 flex items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-black text-base mb-1">Get Your RPTO Listed on DroneTv.in</h3>
            <p className="text-black/70 text-sm">Reach aspiring drone pilots across India looking for DGCA-approved training. Free listing with partner packages.</p>
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
