import { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import { fetchContent, MediaItem } from '../../lib/mediaApi';

const communitySpaces = [
  { icon: '💬', title: 'Discussion Forum', desc: 'Ask technical questions, share experiences, discuss regulations, and get peer feedback from verified drone professionals.', stat: 'Active Discussions Ongoing', cta: 'Join Forum', link: 'mailto:bd@dronetv.in' },
  { icon: '📱', title: 'WhatsApp Groups', desc: 'State-specific and vertical-specific WhatsApp groups. Agriculture pilots, GIS & mapping specialists, AI & analytics professionals, DGCA updates, and job alerts.', stat: '8+ Active Groups', cta: 'Request to Join', link: 'https://wa.me/917520123555' },
  { icon: '🚁', title: 'Community Flyins', desc: 'Informal pilot gatherings at approved flying sites. Test equipment, share techniques, and meet fellow pilots in your area.', stat: 'Monthly Across Cities', cta: 'Find Flyins', link: 'mailto:bd@dronetv.in' },
  { icon: '🏆', title: 'Competitions', desc: 'SAE Aerothon, DDC, IRoC-U, SUAS, IARC — compete, collaborate, and build your career through India\'s drone competition circuit.', stat: '5+ Active Series', cta: 'Competition Details', link: '/events/competitions' },
  { icon: '📰', title: 'News and Updates', desc: 'DGCA regulation updates, DigitalSky changes, new airspace rules, and policy announcements that affect your operations.', stat: 'Daily Updates', cta: 'Read News', link: '/media/news-pulse' },
  { icon: '🎓', title: 'Knowledge Base', desc: 'How-to guides, DGCA exam prep materials, photogrammetry tutorials, and career advice from experienced drone professionals.', stat: 'Growing Resources', cta: 'Browse Resources', link: '/professionals/certifications' },
];

const channels = [
  {
    platform: 'LinkedIn',
    handle: '@indiaDroneTv',
    stat: '6,000+ members',
    desc: 'India\'s drone professional community. Job listings, regulatory updates, event announcements, and industry news shared weekly.',
    cta: 'Join on LinkedIn',
    link: 'https://www.linkedin.com/company/indiadronetv',
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
    handle: '8 Active Groups',
    stat: '1,200+ members',
    desc: 'State and vertical-specific WhatsApp groups for drone pilots, GIS professionals, AI & analytics specialists, and industry players. Agriculture, GIS & mapping, DGCA updates, and job alerts.',
    cta: 'Join Your State Group',
    link: 'https://wa.me/917520123555',
    bgColor: 'bg-green-600',
    icon: '💬',
  },
];

const discussions = [
  { icon: '❓', title: 'What is the fastest way to get Medium category RPC after Small?', author: 'Arjun K. — Hyderabad', group: 'Agriculture Pilots Group', replies: 12 },
  { icon: '🗺️', title: 'Best photogrammetry software for large-area orthomosaic maps in India — Pix4D vs Agisoft vs DroneDeploy?', author: 'Kavitha N. — Chennai', group: 'GIS Specialists Group', replies: 28 },
  { icon: '💰', title: 'Salary negotiation tips for experienced drone pilots moving from agri to inspection sector?', author: 'Vikram P. — Pune', group: 'Career Discussions', replies: 19 },
  { icon: '⚖️', title: 'DGCA BVLOS regulations update — what it means for agricultural drone operators in 2026', author: 'DroneTv.in Admin', group: 'Regulatory Updates', replies: 34 },
  { icon: '🔧', title: 'DJI Agras T50 vs indigenous alternatives for precision spraying in Telangana conditions — honest review', author: 'Sreenivas P. — Hyderabad', group: 'Agriculture Drone Operators', replies: 41 },
  { icon: '📚', title: 'DGCA theory exam preparation — which topics should I focus on to clear first attempt?', author: 'Meena R. — Bengaluru', group: 'New Pilots Forum', replies: 22 },
  { icon: '🤝', title: 'Looking for GIS co-pilot for 3-month Andhra Pradesh highway survey project — any takers?', author: 'Arun M. — Mumbai', group: 'Project Collaboration Board', replies: 7 },
];

export default function CommunityPage() {
  const [cmsItems, setCmsItems] = useState<MediaItem[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    fetchContent('community', controller.signal).then(setCmsItems).catch(() => {});
    return () => controller.abort();
  }, []);

  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Professionals</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
              India's Drone <span className="text-yellow-400">Community</span>
            </h1>
            <p className="text-sm text-white/60 leading-relaxed max-w-lg">
              A professional community for drone pilots, GIS & surveying specialists, AI and computer-vision engineers, and enthusiasts across India.
            </p>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">39,890</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Certified Pilots India</span>
            </div>
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">8+</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Active WhatsApp Groups</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {cmsItems.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
              <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Featured</span>
              Community Highlights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {cmsItems.map(item => (
                <div key={item.contentId} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="w-full h-36 object-cover" />}
                  <div className="p-4">
                    {item.category && <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded mb-2 inline-block">{item.category}</span>}
                    <h3 className="font-bold text-gray-900 text-sm mb-1">{item.title}</h3>
                    {item.company && <p className="text-xs text-gray-500 mb-1">{item.company}</p>}
                    {item.location && <p className="text-xs text-gray-400 mb-2">{item.location}</p>}
                    {item.description && <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-3">{item.description}</p>}
                    {item.externalLink && (
                      <a href={item.externalLink} target="_blank" rel="noopener noreferrer"
                        className="text-xs font-bold text-yellow-600 hover:text-yellow-700 flex items-center gap-1">
                        Join Now <ExternalLink className="w-3 h-3" />
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
            <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Spaces</span>
            Community Spaces
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {communitySpaces.map((space, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">{space.icon}</span>
                  <span className="text-xs font-bold text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded">{space.stat}</span>
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-2">{space.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-3">{space.desc}</p>
                <a href={space.link} target={space.link.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                  className="text-xs font-bold text-yellow-600 hover:text-yellow-700 flex items-center gap-1">
                  {space.cta} →
                </a>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
            <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Active</span>
            Discussions Community Forum
          </h2>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {discussions.map((d, i) => (
              <div key={i} className={`px-5 py-4 flex items-start gap-4 hover:bg-gray-50 transition-colors ${i < discussions.length - 1 ? 'border-b border-gray-100' : ''}`}>
                <span className="text-xl flex-shrink-0 mt-0.5">{d.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm leading-snug mb-1">{d.title}</p>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                    <span>Posted by {d.author}</span>
                    <span className="text-gray-300">|</span>
                    <span>{d.group}</span>
                  </div>
                </div>
                <div className="flex-shrink-0 text-center">
                  <span className="text-lg font-extrabold text-yellow-500 block leading-none">{d.replies}</span>
                  <span className="text-xs text-gray-400">Replies</span>
                </div>
              </div>
            ))}
          </div>
        </div>

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
                  <a href={c.link} target="_blank" rel="noopener noreferrer"
                    className={`block w-full ${c.bgColor} text-white font-bold text-xs py-2.5 rounded-lg hover:opacity-90 transition-opacity text-center`}>
                    {c.cta} →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-white text-base mb-1">Join India's Drone, GIS &amp; AI Professional Community</h3>
            <p className="text-sm text-white/60 max-w-lg">
              Whether you are just starting your DGCA certification journey or have 10 years of experience, there is a place for you here. Contact us to join the right groups for your specialisation.
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <a href="https://wa.me/917520123555" target="_blank" rel="noopener noreferrer"
              className="px-4 py-2 bg-yellow-400 text-black text-sm font-bold rounded-lg hover:bg-yellow-300 transition-colors">
              Join the Community
            </a>
            <a href="/events/meetups"
              className="px-4 py-2 border border-white/20 text-white text-sm font-semibold rounded-lg hover:bg-white/10 transition-colors">
              Networking Events
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
