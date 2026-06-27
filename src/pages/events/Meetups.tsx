import { useState, useEffect } from 'react';
import { MapPin, Calendar, Users, ExternalLink } from 'lucide-react';
import { fetchContent, MediaItem } from '../../lib/mediaApi';

const meetupTypes = [
  { icon: '🏙️', title: 'City-Level Industry Networking', desc: 'Drone professionals and entrepreneurs meeting in Hyderabad, Bengaluru, Mumbai, Delhi, Pune, and Chennai. Hosted by associations, incubators, and community groups. Typically 30–100 attendees.' },
  { icon: '🚁', title: 'Community Drone Flyins', desc: 'Pilot gatherings at open flying sites. Informal events where drone operators test new equipment, share techniques, and build community. Growing in popularity across Tier 2 cities in India.' },
  { icon: '📊', title: 'B2B Roundtables', desc: 'Invite-only or limited-seat sessions bringing together drone companies, buyers, and investors for structured discussion on agriculture, defence, infrastructure, or logistics verticals.' },
  { icon: '💡', title: 'Startup and Investor Meetups', desc: 'Events connecting drone startups with angel investors, venture capital, and government grant bodies. Often co-organised with incubators, CII, or state innovation cells across India.' },
  { icon: '🌍', title: 'Regional Pilot Community Events', desc: 'State-level gatherings of DGCA-certified pilots, often organised around a flying demonstration or local competition. Relevant for training institutes and drone service companies looking to hire.' },
  { icon: '🎓', title: 'Academic and Student Meetups', desc: 'Events connecting engineering students, researchers, and academic institutions with the commercial drone industry. Bridges the gap between education and employment in the sector.' },
];

const whyAttend = [
  { icon: '🎯', title: 'Focused Conversations', desc: 'Informal access to decision-makers without the noise of a large expo floor. Real conversations, not sales pitches.' },
  { icon: '🔗', title: 'Pre-Arranged Meetings', desc: 'Many B2B meetups facilitate structured pre-arranged meetings between buyers, suppliers, and service providers.' },
  { icon: '💰', title: 'Deal Flow Access', desc: 'Early access to project opportunities, partnerships, and collaboration before they reach the broader market.' },
  { icon: '📸', title: 'DroneTv Coverage', desc: 'DroneTv team attends select meetups for video and social media coverage. Your event reaches our full audience.' },
];

export default function MeetupsPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    fetchContent('meetup', controller.signal).then(setItems).catch(() => {}).finally(() => setLoading(false));
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
              Industry Meetups and <span className="text-yellow-400">Networking</span>
            </h1>
            <p className="text-sm text-white/60 leading-relaxed max-w-lg">
              Smaller, focused, and built for real conversations — connecting manufacturers, operators, pilots, geospatial and AI specialists, and investors.
            </p>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">Free</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">To List Your Meetup</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 pb-12 space-y-8">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
            <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Upcoming</span>
            Meetups
          </h2>
          {loading ? (
            <div className="text-center py-10 text-gray-400">Loading meetups...</div>
          ) : items.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-10 text-center">
              <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="font-semibold text-gray-500 mb-1">No meetups currently listed</p>
              <p className="text-sm text-gray-400 mb-4 max-w-md mx-auto">
                Organising a drone, GIS, or AI industry meetup, community flyin, or B2B roundtable in India? Submit it here for free listing on DroneTv.in.
              </p>
              <a href="mailto:bd@dronetv.in?subject=Submit Meetup"
                className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black text-sm font-bold rounded-lg hover:bg-yellow-300 transition-colors">
                Submit Your Meetup
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.map(item => (
                <div key={item.contentId} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} className="w-full h-40 object-cover" />
                  ) : (
                    <div className="w-full h-40 bg-zinc-900 flex items-center justify-center">
                      <Users className="w-10 h-10 text-yellow-400" />
                    </div>
                  )}
                  <div className="p-4">
                    {item.price && <span className={`text-xs font-bold px-2 py-0.5 rounded mb-2 inline-block ${item.price.toLowerCase() === 'free' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{item.price}</span>}
                    <h3 className="text-sm font-bold text-gray-900 leading-snug mb-2">{item.title}</h3>
                    {item.description && <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">{item.description}</p>}
                    <div className="space-y-1">
                      {item.date && <div className="flex items-center gap-1.5 text-xs text-gray-500"><Calendar className="w-3 h-3 flex-shrink-0" />{item.date}</div>}
                      {item.location && <div className="flex items-center gap-1.5 text-xs text-gray-500"><MapPin className="w-3 h-3 flex-shrink-0" />{item.location}</div>}
                    </div>
                    {item.externalLink && (
                      <a href={item.externalLink} target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center gap-1 text-xs font-bold text-yellow-600 hover:text-yellow-700">
                        Join Meetup <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
            <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Types</span>
            Meetup Types Listed on DroneTv.in
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {meetupTypes.map((type, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <div className="text-2xl mb-3">{type.icon}</div>
                <h3 className="font-bold text-gray-900 text-sm mb-2">{type.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{type.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
            <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Benefits</span>
            Why Attend Drone Meetups
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {whyAttend.map((item, i) => (
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
            <h3 className="font-bold text-white text-base mb-1">VirelbBiz — Connect, Collaborate, Grow</h3>
            <p className="text-sm text-white/60 max-w-lg">
              DroneTv.in's VirelbBiz platform is built for exactly this: connecting drone, geospatial, and AI businesses, professionals, and clients in a focused environment.
            </p>
            <p className="text-xs text-white/40 mt-1">✉ bd@dronetv.in &nbsp;|&nbsp; 📞 +91 7520123555</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <a href="mailto:bd@dronetv.in?subject=Submit Meetup"
              className="px-4 py-2 bg-yellow-400 text-black text-sm font-bold rounded-lg hover:bg-yellow-300 transition-colors">
              Submit Your Meetup
            </a>
            <a href="https://wa.me/917520123555" target="_blank" rel="noopener noreferrer"
              className="px-4 py-2 border border-white/20 text-white text-sm font-semibold rounded-lg hover:bg-white/10 transition-colors">
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
