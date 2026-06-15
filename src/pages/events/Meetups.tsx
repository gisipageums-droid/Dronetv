import { Link } from 'react-router-dom';

const meetups = [
  {
    city: 'Hyderabad',
    title: 'Hyderabad Drone Professionals Meetup',
    schedule: 'Monthly — 3rd Saturday',
    area: 'Koramangala area',
    price: 'Free',
    members: '85+ members',
    desc: 'Monthly gathering of drone pilots, operators, RPTO instructors, and agriculture drone service providers in Hyderabad. Mix of networking, knowledge sharing, and occasional guest speakers from the industry.',
    themes: ['Agriculture Operations', 'DGCA Regulation Updates', 'Job Market & Hiring', 'Equipment Reviews'],
    contact: 'hyderabad@dronetv.in',
  },
  {
    city: 'Delhi NCR',
    title: 'Delhi NCR Drone Networking Evening',
    schedule: 'Monthly — 2nd Thursday',
    area: 'India Habitat Centre',
    price: 'Free',
    members: '120+ members',
    desc: 'Delhi\'s drone community evening bringing together professionals across defence, government, inspection, and training sectors. Includes a structured 15-minute talk from an industry guest followed by open networking.',
    themes: ['Defence & Security', 'Policy & Regulation', 'Infrastructure Inspection', 'Startup Ecosystem'],
    contact: 'delhi@dronetv.in',
  },
  {
    city: 'Mumbai',
    title: 'Mumbai Drone & GIS Community Meetup',
    schedule: 'Bi-monthly — 1st Saturday',
    area: 'BKC area',
    price: 'Free',
    members: '65+ members',
    desc: 'Mumbai\'s bi-monthly drone and geospatial community, drawing professionals from survey, cinematography, real estate, and GIS mapping. Strong participation from media production companies and urban infrastructure firms.',
    themes: ['GIS & Mapping', 'Aerial Cinematography', 'Real Estate & Urban', 'Survey Technology'],
    contact: 'mumbai@dronetv.in',
  },
];

export default function MeetupsPage() {
  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Events</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
              Drone Professional <span className="text-yellow-400 not-italic">Meetups</span>
            </h1>
            <p className="text-sm text-white/60 leading-relaxed max-w-lg">
              Monthly in-person meetups for India's drone professionals — network, learn, and connect with the local community.
            </p>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">3</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">City Chapters</span>
            </div>
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">Free</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Networking</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-5">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-6 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
          <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">City</span>
          Chapters
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {meetups.map((m, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="bg-black px-5 py-4">
                <span className="text-yellow-400 font-extrabold text-lg">{m.city}</span>
                <p className="text-white/50 text-xs mt-0.5">{m.members}</p>
              </div>
              <div className="p-5">
                <h3 className="text-sm font-bold text-gray-900 leading-snug mb-2">{m.title}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                  <span>📅 {m.schedule}</span>
                </div>
                <p className="text-xs text-gray-500 mb-1">📍 {m.area}</p>
                <p className="text-xs font-bold text-green-700 mb-3">{m.price}</p>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">{m.desc}</p>
                <div className="space-y-1">
                  {m.themes.map((t) => (
                    <div key={t} className="flex items-center gap-2 text-xs text-gray-600">
                      <span className="text-yellow-400 font-bold">—</span>{t}
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-gray-100 px-5 py-3 bg-gray-50">
                <a
                  href={`mailto:${m.contact}`}
                  className="text-xs font-bold text-yellow-600 hover:text-yellow-700 transition-colors"
                >
                  Contact Chapter →
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-yellow-400 rounded-xl p-6 flex items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-black text-base mb-1">Host a Meetup Listed on DroneTv.in</h3>
            <p className="text-black/70 text-sm">Starting a drone community in your city? Get it listed and promoted to India's drone professional network.</p>
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
