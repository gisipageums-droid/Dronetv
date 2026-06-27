import { useState, useEffect } from 'react';
import { MapPin, Calendar, Trophy, ExternalLink } from 'lucide-react';
import { fetchContent, MediaItem } from '../../lib/mediaApi';

const staticCompetitions = [
  {
    icon: '🏆',
    badge: 'National',
    title: 'India SAE Aerothon',
    organiser: 'SAE India — Society of Automotive Engineers India',
    desc: 'National-level competition for engineering college teams. Teams design and build UAVs to solve real-world problems including agricultural monitoring, search and rescue, and payload delivery scenarios. One of the most competitive collegiate UAV design events in India.',
    openTo: 'Engineering college teams across India',
    format: 'Design + Build + Fly',
    link: 'https://www.saeindia.org',
    status: 'Active',
  },
  {
    icon: '🛸',
    badge: 'National',
    title: 'India SAE Drone Development Challenge (DDC)',
    organiser: 'SAE International | Categories: Micro Class and Regular Class',
    desc: 'Teams design and fly aircraft meeting specific payload fraction and performance requirements. Micro Class targets compact aircraft that fit within a 3-cubic-foot box; Regular Class focuses on high payload fractions and range. Indian teams have ranked 1st and 2nd nationally in recent editions.',
    openTo: 'Indian teams: National 1st (DDC Regular 2025), National 2nd (DDC Micro 2026)',
    format: 'Design + Report + Flight',
    link: 'https://www.saeindia.org',
    status: 'Active',
  },
  {
    icon: '🚀',
    badge: 'India — ISRO',
    title: 'ISRO Robotics Challenge — URSC (IRoC-U) 2026',
    organiser: 'ISRO / URSC | Mission Theme: ASCEND',
    desc: "India's premier space robotics challenge connecting drone and autonomous systems technology with space exploration applications. The ASCEND mission tasks teams with developing robotic systems for future planetary exploration scenarios. Bridges the gap between drone technology and India's space programme.",
    openTo: 'College and university teams across India',
    format: 'Design + Build + Mission Challenge',
    link: 'https://www.isro.gov.in',
    status: 'Active',
  },
  {
    icon: '🌍',
    badge: 'Global — Indian Teams Eligible',
    title: 'SUAS — Student Unmanned Aerial Systems Competition',
    organiser: 'AUVSI Foundation (USA)',
    desc: 'Teams design fully autonomous UAVs for real-world mission scenarios including payload drop, target identification, and obstacle avoidance. Considered one of the most demanding collegiate UAS competitions in the world. Team Arrow from India ranked globally 1st in SUAS 2025 — a significant milestone for Indian drone engineering talent.',
    openTo: 'Team Arrow (India) — Global Rank 1st, SUAS 2025',
    format: 'Autonomous flight mission',
    link: 'https://suas-competition.org',
    status: 'Active',
  },
  {
    icon: '🤖',
    badge: 'Global — Indian Teams Eligible',
    title: 'IARC — International Aerial Robotics Competition',
    organiser: 'IARC Foundation',
    desc: "World's longest-running collegiate drone challenge. Tasks teams with solving complex, open-ended aerial robotics missions that push the state-of-the-art in autonomous flight. Missions evolve each season; no team has solved every historical mission, reflecting the genuine difficulty of the challenge.",
    openTo: 'Running continuously since 1991 — the benchmark for aerial robotics innovation',
    format: 'Autonomous aerial robotics',
    link: 'https://www.aerialroboticscompetition.org',
    status: 'Active',
  },
];

const expectItems = [
  { icon: '📐', title: 'Design Reviews', desc: 'Technical design reviews, written reports, and CDR/FDR presentations before the flight phase.' },
  { icon: '🏅', title: 'Prizes and Recognition', desc: 'Cash prizes, trophies, and national/global recognition. Scouts from drone manufacturers attend top events.' },
  { icon: '🤝', title: 'Industry Connections', desc: 'Drone manufacturers and service companies actively scout competition teams for internships and full-time roles.' },
  { icon: '🚀', title: 'Career Pathways', desc: "Competition experience is highly valued across India's drone, GIS & AI industry. Top teams often launch their own startups." },
];

export default function CompetitionsPage() {
  const [cmsItems, setcmsItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    fetchContent('competition', controller.signal).then(setcmsItems).catch(() => {}).finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Events &amp; Programs</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
              Drone Competitions and <span className="text-yellow-400">UAV Challenges</span>
            </h1>
            <p className="text-sm text-white/60 leading-relaxed max-w-lg">
              India's drone competition circuit is growing across colleges, defence institutions, and industry bodies — from collegiate UAV design challenges to global autonomous flight competitions.
            </p>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">5</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Active Series</span>
            </div>
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">#1</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">India Team SUAS 2025</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 pb-12 space-y-8">
        {!loading && cmsItems.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
              <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Listed</span>
              Competition Listings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {cmsItems.map(item => (
                <div key={item.contentId} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} className="w-full h-40 object-cover" />
                  ) : (
                    <div className="w-full h-40 bg-zinc-900 flex items-center justify-center">
                      <Trophy className="w-10 h-10 text-yellow-400" />
                    </div>
                  )}
                  <div className="p-4">
                    {item.category && <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2 py-0.5 rounded mb-2 inline-block">{item.category}</span>}
                    <h3 className="text-sm font-bold text-gray-900 leading-snug mb-2">{item.title}</h3>
                    {item.description && <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">{item.description}</p>}
                    {item.price && <div className="text-xs font-bold text-green-700 mb-2">{item.price}</div>}
                    <div className="space-y-1">
                      {item.date && <div className="flex items-center gap-1.5 text-xs text-gray-500"><Calendar className="w-3 h-3 flex-shrink-0" />{item.date}</div>}
                      {item.location && <div className="flex items-center gap-1.5 text-xs text-gray-500"><MapPin className="w-3 h-3 flex-shrink-0" />{item.location}</div>}
                    </div>
                    {item.externalLink && (
                      <a href={item.externalLink} target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center gap-1 text-xs font-bold text-yellow-600 hover:text-yellow-700">
                        Register <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
            <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">2026</span>
            Active Competition Series
          </h2>
          <div className="space-y-4">
            {staticCompetitions.map((comp, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center text-2xl">{comp.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-0.5 rounded">{comp.badge}</span>
                      <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded">{comp.status}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-base leading-snug mb-0.5">{comp.title}</h3>
                    <p className="text-xs text-gray-500 mb-2">{comp.organiser}</p>
                    <p className="text-sm text-gray-600 leading-relaxed mb-3">{comp.desc}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-3">
                      <span><span className="font-semibold text-gray-700">Open to:</span> {comp.openTo}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded">Format: {comp.format}</span>
                      <a href={comp.link} target="_blank" rel="noopener noreferrer"
                        className="text-xs font-bold text-yellow-600 hover:text-yellow-700 flex items-center gap-1">
                        Official Website <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
            <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Guide</span>
            What to Expect at Drone Competitions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {expectItems.map((item, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <div className="text-2xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-gray-900 text-sm mb-2">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-white text-base mb-1">List Your Event</h3>
            <p className="text-sm text-white/60">Submit any drone, GIS &amp; AI industry event for free listing on DroneTv.in.</p>
            <p className="text-xs text-white/40 mt-1">✉ bd@dronetv.in &nbsp;|&nbsp; 📞 +91 7520123555</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <a href="mailto:bd@dronetv.in?subject=Submit Event"
              className="px-4 py-2 bg-yellow-400 text-black text-sm font-bold rounded-lg hover:bg-yellow-300 transition-colors">
              Submit Event
            </a>
            <a href="mailto:bd@dronetv.in?subject=Media Partner"
              className="px-4 py-2 border border-white/20 text-white text-sm font-semibold rounded-lg hover:bg-white/10 transition-colors">
              Become a Media Partner
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
