const channels = [
  {
    platform: 'LinkedIn',
    handle: '@indiaDroneTv',
    stat: '5,000+ members',
    desc: 'India\'s drone professional community. Job listings, regulatory updates, event announcements, and industry news shared weekly.',
    cta: 'Join on LinkedIn',
    link: 'https://www.linkedin.com',
    bgColor: 'bg-blue-600',
    icon: '💼',
  },
  {
    platform: 'YouTube',
    handle: '@indiadronetv',
    stat: '50+ videos',
    desc: 'Full interview series from Drone Expo 2025 Mumbai. Industry leader conversations, product reviews, and event coverage.',
    cta: 'Subscribe on YouTube',
    link: 'https://www.youtube.com/@indiadronetv',
    bgColor: 'bg-red-600',
    icon: '🎬',
  },
  {
    platform: 'WhatsApp Groups',
    handle: '7 State Groups',
    stat: '1,200+ members',
    desc: 'State-specific WhatsApp groups for Telangana, AP, Karnataka, Maharashtra, Delhi, Rajasthan, and Tamil Nadu drone professionals.',
    cta: 'Join Your State Group',
    link: 'https://wa.me/919000000000',
    bgColor: 'bg-green-600',
    icon: '💬',
  },
];

const highlights = [
  {
    icon: '💼',
    title: 'Job Postings Shared',
    desc: 'Active hiring notifications from drone companies across India shared directly in the community.',
  },
  {
    icon: '📅',
    title: 'Event Announcements',
    desc: 'First access to expo registrations, webinar slots, and meetup details before public announcement.',
  },
  {
    icon: '📋',
    title: 'Regulatory Updates',
    desc: 'DGCA circulars, policy changes, and BVLOS developments summarised and shared by community leads.',
  },
  {
    icon: '🔧',
    title: 'Equipment Reviews',
    desc: 'Real-world reviews and comparisons from pilots who have flown the equipment professionally.',
  },
];

export default function CommunityPage() {
  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Professionals</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
              DroneTv <span className="text-yellow-400 not-italic">Professional Community</span>
            </h1>
            <p className="text-sm text-white/60 leading-relaxed max-w-lg">
              Join India's drone professional network across LinkedIn, YouTube, and WhatsApp — connect with 6,000+ pilots, operators, and industry leaders.
            </p>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">6,000+</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Community Members</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
            <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Join</span>
            Community Channels
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {channels.map((c) => (
              <div key={c.platform} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className={`${c.bgColor} px-5 py-5 flex items-center gap-3`}>
                  <span className="text-3xl">{c.icon}</span>
                  <div>
                    <h3 className="text-white font-extrabold text-base">{c.platform}</h3>
                    <p className="text-white/70 text-xs">{c.handle}</p>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-xl font-extrabold text-gray-900 mb-1">{c.stat}</p>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">{c.desc}</p>
                  <a
                    href={c.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block w-full ${c.bgColor} text-white font-bold text-xs py-2.5 rounded-lg hover:opacity-90 transition-opacity text-center`}
                  >
                    {c.cta} →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
            <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Value</span>
            What the Community Shares
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {highlights.map((h) => (
              <div key={h.title} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 text-center">
                <span className="text-3xl block mb-3">{h.icon}</span>
                <h3 className="font-bold text-gray-900 text-sm mb-2">{h.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
