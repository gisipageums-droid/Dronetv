const webinars = [
  {
    title: 'BVLOS Regulations: What\'s Coming in India',
    date: 'Jun 28, 2026',
    time: '11:00 AM – 12:30 PM IST',
    platform: 'Zoom (link sent on registration)',
    price: 'Free',
    priceClass: 'bg-green-100 text-green-700',
    speakers: ['DGCA Policy Expert', 'Drone Industry Legal Counsel'],
    desc: 'DGCA officials and legal experts discuss the upcoming BVLOS regulatory framework — what\'s changing, timelines, and how to prepare your operation for approval.',
    topics: ['Current BVLOS pilot programme status', 'Expected rule changes 2026', 'Application process walkthrough', 'Live Q&A with regulators'],
  },
  {
    title: 'Agriculture Drone ROI: Real Numbers from the Field',
    date: 'Jul 5, 2026',
    time: '3:00 PM – 4:00 PM IST',
    platform: 'YouTube Live',
    price: 'Free',
    priceClass: 'bg-green-100 text-green-700',
    speakers: ['Sreenivas Prasad, Drone Operator, Telangana', 'Garuda Aerospace Field Team'],
    desc: 'Practical session with real agriculture drone operators sharing actual revenue, costs, coverage rates, and payback periods from deployments across Telangana, AP, and Maharashtra.',
    topics: ['Rs. per acre economics', 'Equipment and maintenance costs', 'Farmer negotiation and pricing', 'Scaling from 1 to 10 drones'],
  },
  {
    title: 'DGCA RPC Certification: Complete Process Guide',
    date: 'Jul 12, 2026',
    time: '10:00 AM – 11:30 AM IST',
    platform: 'Zoom (link sent on registration)',
    price: 'Free',
    priceClass: 'bg-green-100 text-green-700',
    speakers: ['Certified RPTO Instructor', 'DroneTv Editorial Team'],
    desc: 'Step-by-step walkthrough of the DGCA Remote Pilot Certificate process — from choosing an RPTO to passing the exam, practical training, and receiving your digital RPC certificate.',
    topics: ['RPTO selection criteria', 'Training requirements by drone category', 'Exam syllabus breakdown', 'DigitalSky registration process'],
  },
  {
    title: 'Drone Data Processing: GIS and LiDAR Applications',
    date: 'Jul 19, 2026',
    time: '2:00 PM – 4:00 PM IST',
    platform: 'Zoom (link sent on registration)',
    price: 'Rs.500',
    priceClass: 'bg-blue-100 text-blue-700',
    speakers: ['Sanjay Mehta, Aarav Unmanned Systems', 'GIS Technology Lead'],
    desc: 'Technical deep-dive into drone survey data processing — photogrammetry workflows, LiDAR point cloud processing, orthomosaic generation, and GIS integration using Pix4D, Agisoft, and QGIS.',
    topics: ['Photogrammetry pipeline', 'LiDAR point cloud tools', 'Orthomosaic and DEM generation', 'QGIS integration workflow'],
  },
];

export default function WebinarsPage() {
  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Events</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
              Drone Industry <span className="text-yellow-400 not-italic">Webinars</span>
            </h1>
            <p className="text-sm text-white/60 leading-relaxed max-w-lg">
              Online sessions with drone industry experts — regulations, agriculture economics, certification, and GIS applications.
            </p>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">Free</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">3 of 4 Sessions</span>
            </div>
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">Live</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Q&A Included</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-5">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-6 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
          <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Upcoming</span>
          All Webinars
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {webinars.map((w, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${w.priceClass}`}>{w.price}</span>
                  <span className="text-xs font-bold text-gray-500">{w.date}</span>
                </div>
                <h3 className="text-base font-bold text-gray-900 leading-snug mb-1">{w.title}</h3>
                <p className="text-xs text-gray-400 mb-3">{w.time} · {w.platform}</p>
                <p className="text-sm text-gray-500 leading-relaxed mb-3">{w.desc}</p>
                <div className="mb-3">
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Speakers</p>
                  <div className="space-y-1">
                    {w.speakers.map((s) => (
                      <p key={s} className="text-xs text-gray-500">— {s}</p>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {w.topics.map((t) => (
                    <span key={t} className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded-full">{t}</span>
                  ))}
                </div>
              </div>
              <div className="border-t border-gray-100 px-5 py-3 bg-gray-50">
                <a
                  href="mailto:bd@dronetv.in?subject=Webinar Registration"
                  className="text-xs font-bold text-yellow-600 hover:text-yellow-700 transition-colors"
                >
                  Register to Attend →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
