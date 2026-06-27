import { useState, useEffect } from 'react';
import { fetchContent, MediaItem } from '../../lib/mediaApi';

const confirmedPartners = [
  {
    icon: '🏛️',
    name: 'Drone Expo — Services International',
    hq: 'New Delhi and Bengaluru editions | India\'s longest-running drone expo series',
    desc: 'DroneTv.in is the official Digital Broadcast Media Partner for the Drone Expo series. We produced 50+ video interviews at Drone Expo 2025 Mumbai and served as media partner for Drone Expo 2026 Bengaluru (BIEC, April 17-18). Next edition: Drone Expo New Delhi, September 28-30, 2026.',
    tags: ['Confirmed Partner', '2025', '2026'],
    type: 'Official Media Partner',
    link: '/events/expos',
  },
  {
    icon: '🎪',
    name: 'IFSEC Expo and Conference 2026',
    hq: 'India — December 2026 | Venue TBC',
    desc: 'DroneTv.in is confirmed as official media partner for IFSEC Expo and Conference 2026. DroneTv will produce video coverage, social media content, and post-event editorial for the IFSEC 2026 edition. Event venue and exact dates will be announced.',
    tags: ['Confirmed 2026', 'Security', 'Drones'],
    type: 'Confirmed Media Partner',
    link: '/events/expos',
  },
];

const deliverables = [
  { icon: '🎬', title: 'On-Ground Video Interview Production', desc: 'Professional interview setup at your expo or conference. DroneTv team interviews exhibitors, speakers, and delegates — producing 5-minute interviews published on YouTube and DroneTv.in within 48 hours.' },
  { icon: '📱', title: 'Same-Day Social Media Coverage', desc: 'Event photos, short-form video clips, and live updates across DroneTv\'s LinkedIn, Instagram, Facebook, and YouTube channels on the day of your event — reaching the drone industry audience in real time.' },
  { icon: '📝', title: 'Post-Event Editorial Article', desc: 'A 1,000–1,500 word editorial article covering key announcements, product launches, and insights from your event — published on DroneTv.in and promoted on social media within 48 hours.' },
  { icon: '🌐', title: 'Event Listing on DroneTv.in', desc: 'Your event is listed on DroneTv.in\'s Events section and added to the industry calendar — reaching visitors actively planning their drone expo and conference attendance.' },
];

export default function EventOrganizersPage() {
  const [items, setItems] = useState<MediaItem[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    fetchContent('event-organizer', controller.signal).then(setItems).catch(() => {});
    return () => controller.abort();
  }, []);

  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Partnerships</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
              Event <span className="text-yellow-400">Organizers</span>
            </h1>
            <p className="text-sm text-white/60 leading-relaxed max-w-lg">
              DroneTv.in is the official Digital Broadcast Media Partner for India's leading drone expos and conferences.
            </p>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">50+</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Video Interviews</span>
            </div>
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">5M+</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Views</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 pb-12 space-y-8">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
            <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Partners</span>
            Current Media Partnerships
          </h2>
          <div className="space-y-4">
            {confirmedPartners.map((partner, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5">
                <div className="flex items-start gap-4 mb-3">
                  <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">{partner.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-base mb-0.5">{partner.name}</h3>
                    <p className="text-xs text-gray-400">{partner.hq}</p>
                  </div>
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded flex-shrink-0">{partner.type}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">{partner.desc}</p>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex gap-2 flex-wrap">
                    {partner.tags.map(tag => (
                      <span key={tag} className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded">{tag}</span>
                    ))}
                  </div>
                  <a href={partner.link} className="text-xs font-bold text-yellow-600 hover:text-yellow-700">Expo Details →</a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {items.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
              <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Listed</span>
              All Event Organizers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.map(item => (
                <div key={item.contentId} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5">
                  {item.category && <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded mb-2 inline-block">{item.category}</span>}
                  <h3 className="text-sm font-bold text-gray-900 mb-2">{item.title}</h3>
                  {item.description && <p className="text-xs text-gray-500 leading-relaxed mb-3">{item.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
            <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Deliverables</span>
            What DroneTv Delivers at Your Event
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deliverables.map((d, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-start gap-4">
                <span className="text-2xl flex-shrink-0">{d.icon}</span>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1">{d.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-white text-base mb-1">DroneTv.in Covered Drone Expo 2025 with 50+ Interviews</h3>
            <p className="text-sm text-white/60 max-w-lg">At Drone Expo 2025 Mumbai, DroneTv's production team recorded 50+ video interviews across 2 days. Videos were published across YouTube, LinkedIn, and Instagram within 48 hours. Combined views exceeded 5 million. That's the reach your event gets when DroneTv is your media partner.</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <a href="mailto:bd@dronetv.in?subject=DroneTv Media Partnership" className="px-4 py-2 bg-yellow-400 text-black text-sm font-bold rounded-lg hover:bg-yellow-300 transition-colors">Apply for Media Partnership</a>
            <a href="/events" className="px-4 py-2 border border-white/20 text-white text-sm font-semibold rounded-lg hover:bg-white/10 transition-colors">View Events Calendar →</a>
          </div>
        </div>
      </div>
    </div>
  );
}
