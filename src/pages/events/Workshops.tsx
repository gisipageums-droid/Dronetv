import { Link } from 'react-router-dom';

const workshops = [
  {
    title: 'DGCA RPC Exam Preparation Workshop',
    schedule: 'Monthly',
    location: 'Online / Hybrid',
    price: 'Rs.2,000',
    duration: '1 Day',
    level: 'Beginner',
    levelClass: 'bg-green-100 text-green-700',
    seats: '30 seats per batch',
    desc: 'Intensive preparation workshop for the DGCA Remote Pilot Certificate (RPC) theoretical examination. Covers air regulations, weather, navigation, and drone systems.',
    topics: ['DGCA Air Regulations', 'Drone System Theory', 'Weather & Navigation', 'Mock Exam Papers'],
  },
  {
    title: 'Precision Agriculture Drone Operations',
    schedule: 'Next: Jul 12–13, 2026',
    location: 'Hyderabad',
    price: 'Rs.8,500',
    duration: '2 Days',
    level: 'Intermediate',
    levelClass: 'bg-blue-100 text-blue-700',
    seats: '15 seats',
    desc: 'Hands-on workshop for certified drone pilots looking to operate in the agriculture sector. Covers sprayer calibration, field mapping, crop monitoring, and yield documentation.',
    topics: ['Agriculture Drone Setup', 'Pesticide Calibration', 'Field Mapping Software', 'ROI Documentation'],
  },
  {
    title: 'Drone Survey & GIS Mapping Masterclass',
    schedule: 'Next: Jul 18–20, 2026',
    location: 'Bengaluru',
    price: 'Rs.15,000',
    duration: '3 Days',
    level: 'Advanced',
    levelClass: 'bg-purple-100 text-purple-700',
    seats: '12 seats',
    desc: 'Professional-grade mapping and GIS workshop using photogrammetry, LiDAR point clouds, and DEM generation. Suitable for survey professionals and GIS technicians.',
    topics: ['Photogrammetry Workflow', 'LiDAR Data Processing', 'DEM & Orthomosaic', 'GIS Software Integration'],
  },
  {
    title: 'UAV Maintenance and Repair',
    schedule: 'Next: Aug 8–9, 2026',
    location: 'Delhi',
    price: 'Rs.6,500',
    duration: '2 Days',
    level: 'Intermediate',
    levelClass: 'bg-blue-100 text-blue-700',
    seats: '20 seats',
    desc: 'Practical workshop covering drone assembly, pre-flight inspection, in-field troubleshooting, motor and ESC replacement, and battery management protocols.',
    topics: ['Drone Assembly', 'Pre-flight Inspection', 'Motor & ESC Repair', 'Battery Management'],
  },
];

export default function WorkshopsPage() {
  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Events</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
              Drone Industry <span className="text-yellow-400 not-italic">Workshops</span>
            </h1>
            <p className="text-sm text-white/60 leading-relaxed max-w-lg">
              Hands-on workshops for drone pilots, surveyors, and operators — from DGCA exam prep to advanced GIS mapping.
            </p>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">4</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Workshops</span>
            </div>
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">DGCA</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Focus</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-5">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-6 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
          <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Upcoming</span>
          All Workshops
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {workshops.map((w, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${w.levelClass}`}>{w.level}</span>
                  <span className="text-lg font-extrabold text-yellow-500">{w.price}</span>
                </div>
                <h3 className="text-base font-bold text-gray-900 leading-snug mb-1">{w.title}</h3>
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                  <span>📅 {w.schedule}</span>
                  <span>📍 {w.location}</span>
                  <span>⏱ {w.duration}</span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{w.desc}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {w.topics.map((t) => (
                    <span key={t} className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded-full">{t}</span>
                  ))}
                </div>
              </div>
              <div className="border-t border-gray-100 px-5 py-3 flex items-center justify-between bg-gray-50">
                <span className="text-xs text-gray-500">{w.seats}</span>
                <a
                  href="mailto:bd@dronetv.in?subject=Workshop Registration"
                  className="text-xs font-bold text-yellow-600 hover:text-yellow-700 transition-colors"
                >
                  Register Now →
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-yellow-400 rounded-xl p-6 flex items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-black text-base mb-1">Run a Workshop? Get Listed on DroneTv.in</h3>
            <p className="text-black/70 text-sm">Reach India's drone pilot and professional community. List your workshops for free when you become a partner.</p>
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
