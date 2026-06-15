import { Link } from 'react-router-dom';

const partners = [
  {
    name: 'Nexgen Exhibitions',
    event: 'Drone International Expo 2026',
    eventDate: 'Jun 24–25, 2026 · New Delhi',
    desc: 'Nexgen Exhibitions is the organiser behind India\'s Drone International Expo, bringing together drone manufacturers, defence buyers, agriculture companies, and GIS firms for two days of B2B meetings and demonstrations.',
    services: ['Exhibition booth management', 'Conference session curation', 'Visitor registration and marketing', 'Outdoor DEMOex coordination'],
    mediaCredit: true,
  },
  {
    name: 'Services International',
    event: 'Drone Expo India (Annual)',
    eventDate: 'Sep 2026 · Bengaluru',
    desc: 'Services International organises India\'s annual Drone Expo with rotating host cities. The Bengaluru edition focuses on the southern India drone ecosystem, featuring an Innovation Awards ceremony and startup showcase.',
    services: ['Annual expo planning and execution', 'Startup and MSME pavilion', 'Innovation Awards ceremony', 'Government delegation hosting'],
    mediaCredit: true,
  },
];

const benefits = [
  { icon: '🎬', title: 'Video Interview Production', desc: 'DroneTv produces exhibitor and keynote interviews at your event, distributed to 50,000+ industry contacts.' },
  { icon: '📢', title: 'Social Media Amplification', desc: 'Event coverage across DroneTv\'s LinkedIn, YouTube, and WhatsApp channels before, during, and after the event.' },
  { icon: '📖', title: 'Magazine Editorial Coverage', desc: 'Your event featured in DroneTv Magazine\'s quarterly issue, reaching decision-makers across India\'s drone sector.' },
  { icon: '👥', title: 'Audience Reach', desc: 'Access to DroneTv\'s community of 6,000+ drone professionals, pilots, manufacturers, and government buyers.' },
];

export default function EventOrganizersPage() {
  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Partnerships</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
              Event Organizer <span className="text-yellow-400 not-italic">Partners</span>
            </h1>
            <p className="text-sm text-white/60 leading-relaxed max-w-lg">
              DroneTv partners with India's leading drone event organisers to deliver media coverage, interviews, and audience reach.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
            <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Partners</span>
            Current Event Partners
          </h2>
          <div className="space-y-5">
            {partners.map((p) => (
              <div key={p.name} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="text-xl font-extrabold text-gray-900">{p.name}</h3>
                    <p className="text-sm text-yellow-600 font-bold">{p.event}</p>
                    <p className="text-xs text-gray-500">{p.eventDate}</p>
                  </div>
                  {p.mediaCredit && (
                    <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded flex-shrink-0">DroneTv Media Partner</span>
                  )}
                </div>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{p.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {p.services.map((s) => (
                    <span key={s} className="bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-full">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
            <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Benefits</span>
            What DroneTv Brings to Your Event
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {benefits.map((b) => (
              <div key={b.title} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <span className="text-2xl block mb-3">{b.icon}</span>
                <h3 className="font-bold text-gray-900 text-sm mb-2">{b.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-yellow-400 rounded-xl p-6 flex items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-black text-base mb-1">Partner with DroneTv for Your Drone Event</h3>
            <p className="text-black/70 text-sm">Contact our BD team to discuss media partnership options for your expo, conference, or competition.</p>
          </div>
          <Link
            to="/partnerships/become-a-partner"
            className="bg-black text-white font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-gray-900 transition-colors whitespace-nowrap"
          >
            Discuss Partnership →
          </Link>
        </div>
      </div>
    </div>
  );
}
