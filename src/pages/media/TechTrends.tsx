const trends = [
  {
    icon: '📡',
    num: '01',
    title: 'BVLOS Operations',
    desc: 'Beyond Visual Line of Sight operations are the next frontier for drone utility. Delivery, pipeline inspection, and corridor monitoring all require BVLOS capability.',
    india: 'DGCA is developing a comprehensive BVLOS regulatory framework. Pilot approvals have been granted for select delivery and inspection use cases in 2025-26.',
    tags: ['DGCA', 'Delivery', 'Inspection'],
  },
  {
    icon: '🤖',
    num: '02',
    title: 'AI-Powered Autonomy',
    desc: 'Artificial intelligence is transforming drones from remote-controlled tools to autonomous decision-makers. Computer vision enables real-time detection and classification.',
    india: 'Indian companies are deploying AI for crop disease detection in Telangana, bridge crack identification on NHAI highways, and perimeter security monitoring.',
    tags: ['Computer Vision', 'Edge AI', 'Autonomy'],
  },
  {
    icon: '🛰️',
    num: '03',
    title: 'UTM Integration',
    desc: 'Unmanned Traffic Management systems coordinate airspace access for multiple drones simultaneously, enabling scalable commercial operations in shared airspace.',
    india: 'India\'s DigitalSky platform forms the backbone of the UTM ecosystem. NPNT (No Permission, No Takeoff) is enforced for all registered drone flights.',
    tags: ['DigitalSky', 'NPNT', 'Airspace'],
  },
  {
    icon: '🔋',
    num: '04',
    title: 'Hydrogen & Hybrid Propulsion',
    desc: 'Battery limitations constrain flight time to 20-40 minutes for most commercial drones. Hydrogen fuel cells and hybrid systems extend endurance to 2+ hours.',
    india: 'Several Indian startups and DRDO are testing hydrogen propulsion for agriculture and surveillance drones, targeting longer flight times for large-area coverage.',
    tags: ['Hydrogen', 'Hybrid', 'Endurance'],
  },
  {
    icon: '🛡️',
    num: '05',
    title: 'Anti-Drone Systems',
    desc: 'Counter-UAV technology is growing as rapidly as the drone market itself. Detection, tracking, and neutralisation systems are in demand across defence and critical infrastructure.',
    india: 'India\'s anti-drone market exceeds Rs.2B+. DRDO\'s counter-UAV solutions are deployed at airports and strategic installations. Private sector demand is accelerating.',
    tags: ['Counter-UAV', 'Defence', 'Security'],
  },
  {
    icon: '🏭',
    num: '06',
    title: 'Made in India Manufacturing',
    desc: 'India\'s PLI scheme for drones has transformed the manufacturing landscape. Domestic production has grown 7x in revenue terms as import substitution accelerates.',
    india: 'Companies like ideaForge, Garuda Aerospace, and Asteria have expanded manufacturing capacity. PLI incentives totalling Rs.120Cr are driving localisation across the value chain.',
    tags: ['PLI Scheme', 'Manufacturing', 'Export'],
  },
  {
    icon: '🌐',
    num: '07',
    title: 'Swarm Drone Technology',
    desc: 'Coordinated swarms of drones working as a single unit dramatically increase coverage area and redundancy. Swarms communicate peer-to-peer and adapt to failures autonomously.',
    india: 'Swarm drones are being explored for large-area agriculture spraying in Rajasthan and Punjab, search and rescue operations, and military applications under DRDO programmes.',
    tags: ['Swarm', 'Agriculture', 'Military'],
  },
];

export default function TechTrendsPage() {
  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Media Hub</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
              Drone Tech <span className="text-yellow-400 not-italic">Trends 2026</span>
            </h1>
            <p className="text-sm text-white/60 leading-relaxed max-w-lg">
              The seven technologies reshaping India's drone industry — from BVLOS operations to swarm coordination.
            </p>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">7</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Key Trends</span>
            </div>
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">AI</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Defining Technology</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-6 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
          <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">2026</span>
          Technology Trends
        </h2>

        {trends.map((t) => (
          <div
            key={t.num}
            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6 border-l-4 border-l-yellow-400"
          >
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="flex items-start gap-4 mb-3">
                  <span className="text-2xl">{t.icon}</span>
                  <div>
                    <span className="text-xs font-bold text-yellow-500 uppercase tracking-widest">Trend {t.num}</span>
                    <h3 className="text-lg font-extrabold text-gray-900 leading-snug">{t.title}</h3>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">{t.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {t.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="md:w-72 flex-shrink-0">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-xs font-bold text-yellow-700 uppercase tracking-widest mb-2">India Context</p>
                  <p className="text-xs text-gray-700 leading-relaxed">{t.india}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
