import { Link } from 'react-router-dom';

const competitions = [
  {
    title: 'SAE Aerothon 2026',
    organiser: 'SAE India',
    category: 'Student Design',
    categoryClass: 'bg-blue-100 text-blue-700',
    date: 'Aug 2026',
    prize: 'Recognition + Internships',
    desc: 'National-level student drone design competition open to engineering teams from IITs, NITs, and other colleges. Teams design, build, and fly drones to compete on performance metrics including payload capacity, endurance, and precision navigation.',
    eligibility: 'Engineering students — IIT, NIT, and other institutions',
    focus: 'Drone design and manufacturing',
    teams: ['IIT Bombay', 'NIT Warangal', 'IIT Madras', 'BITS Pilani'],
  },
  {
    title: 'DRDO Drone Challenge 2026',
    organiser: 'Defence Research and Development Organisation',
    category: 'National',
    categoryClass: 'bg-orange-100 text-orange-700',
    date: 'Oct 2026',
    prize: 'Rs.10 Lakh',
    desc: 'DRDO\'s national drone innovation challenge focused on defence and security applications. Participants are invited to demonstrate drone solutions for surveillance, reconnaissance, logistics support, and counter-drone applications.',
    eligibility: 'Indian startups and established companies',
    focus: 'Defence applications',
    teams: ['Startups', 'MSMEs', 'Research institutions'],
  },
  {
    title: 'AgriDrone Challenge 2026',
    organiser: 'Ministry of Agriculture & Farmers Welfare',
    category: 'Agriculture',
    categoryClass: 'bg-green-100 text-green-700',
    date: 'Sep 2026',
    prize: 'Rs.5 Lakh',
    desc: 'Government-backed challenge to identify the best precision farming drone solutions. Participants demonstrate drone applications in crop monitoring, soil health analysis, pesticide spraying efficiency, and yield optimisation across different terrain and crop types.',
    eligibility: 'Drone service providers and manufacturers',
    focus: 'Precision agriculture',
    teams: ['Agriculture drone manufacturers', 'Service providers', 'Agritech startups'],
  },
];

export default function CompetitionsPage() {
  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Events</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
              Drone <span className="text-yellow-400 not-italic">Competitions</span>
            </h1>
            <p className="text-sm text-white/60 leading-relaxed max-w-lg">
              National drone competitions — from student design challenges to government-backed innovation prizes.
            </p>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">3</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Competitions</span>
            </div>
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">Rs.15L</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Prize Pool</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-5">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-6 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
          <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">2026</span>
          Upcoming Competitions
        </h2>

        {competitions.map((c, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${c.categoryClass}`}>{c.category}</span>
                  <span className="text-xs text-gray-400 font-semibold">{c.date}</span>
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 leading-snug mb-1">{c.title}</h3>
                <p className="text-sm text-gray-500 mb-3">{c.organiser}</p>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">{c.desc}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Eligibility</p>
                    <p className="text-xs text-gray-700">{c.eligibility}</p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-3">
                    <p className="text-xs font-bold text-yellow-600 uppercase tracking-wide mb-1">Prize</p>
                    <p className="text-sm font-extrabold text-gray-900">{c.prize}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="bg-yellow-400 rounded-xl p-6 flex items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-black text-base mb-1">Organising a drone competition?</h3>
            <p className="text-black/70 text-sm">Get your event listed and covered by DroneTv.in's media team.</p>
          </div>
          <Link
            to="/partnerships/become-a-partner"
            className="bg-black text-white font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-gray-900 transition-colors whitespace-nowrap"
          >
            List Your Event →
          </Link>
        </div>
      </div>
    </div>
  );
}
