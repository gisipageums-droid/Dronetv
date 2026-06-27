import { useState, useEffect } from 'react';
import { Calendar, ExternalLink, Monitor } from 'lucide-react';
import { fetchContent, MediaItem } from '../../lib/mediaApi';

const topicSections = [
  { icon: '📜', title: 'Regulatory and Compliance', desc: 'DGCA rule updates, airspace management, BVLOS approval processes, type certification, and import-export compliance for drone companies operating in India.' },
  { icon: '⚙️', title: 'Technology and Products', desc: 'Product demonstrations, new hardware launches, software integrations, AI and computer vision tools, and technical deep-dives from drone, geospatial, and AI technology providers.' },
  { icon: '💼', title: 'Business and Marketing', desc: 'How to sell drone services, participate in government tenders, build a pricing model, and grow a drone services company in India\'s competitive market.' },
  { icon: '🗺️', title: 'GIS and Mapping', desc: 'Photogrammetry workflows, LiDAR processing, geospatial data analysis, and achieving survey-grade accuracy for mapping and inspection projects.' },
  { icon: '🎓', title: 'Training and Career', desc: 'DGCA exam preparation, career pathways in the drone industry, RPTO selection guidance, and how to land your first commercial drone project.' },
  { icon: '🌾', title: 'Agriculture and Field Operations', desc: 'Precision agriculture with drones, NDVI analysis, spray calibration, crop health monitoring, and working with state agriculture departments.' },
];

const expectItems = [
  { icon: '🎙️', title: 'Live Q&A', desc: 'Direct questions to regulators, technology experts, and product teams in real-time during the session.' },
  { icon: '📥', title: 'Downloadable Resources', desc: 'DGCA checklists, regulation summaries, workflow guides, and other materials shared after the session.' },
  { icon: '▶️', title: 'Replay Access', desc: 'Most webinars offer replay access so you can watch at your own pace after the live session concludes.' },
  { icon: '📋', title: 'Participation Certificates', desc: 'Selected organisers issue certificates of participation which can be added to your professional profile.' },
];

export default function WebinarsPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    fetchContent('webinar', controller.signal).then(setItems).catch(() => {}).finally(() => setLoading(false));
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
              Drone Industry <span className="text-yellow-400">Webinars</span>
            </h1>
            <p className="text-sm text-white/60 leading-relaxed max-w-lg">
              Online sessions on DGCA regulations, GIS workflows, AI analytics, drone business models, and career pathways across drones, geospatial, and AI.
            </p>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">Free</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">To List Your Webinar</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 pb-12 space-y-8">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
            <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Upcoming</span>
            Webinars
          </h2>
          {loading ? (
            <div className="text-center py-10 text-gray-400">Loading webinars...</div>
          ) : items.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-10 text-center">
              <Monitor className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="font-semibold text-gray-500 mb-1">No webinars currently listed</p>
              <p className="text-sm text-gray-400 mb-4 max-w-md mx-auto">
                Hosting a drone, GIS, or AI webinar? Submit it here for free listing and promotion to DroneTv.in's audience of drone, geospatial, and AI professionals across India.
              </p>
              <a href="mailto:bd@dronetv.in?subject=Submit Webinar"
                className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black text-sm font-bold rounded-lg hover:bg-yellow-300 transition-colors">
                Submit Your Webinar
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {items.map(item => (
                <div key={item.contentId} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      {item.price ? (
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${item.price.toLowerCase() === 'free' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{item.price}</span>
                      ) : <span />}
                      {item.date && <span className="text-xs font-bold text-gray-500">{item.date}</span>}
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 leading-snug mb-1">{item.title}</h3>
                    {item.platform && <p className="text-xs text-gray-400 mb-3">{item.platform}</p>}
                    {item.description && <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-3">{item.description}</p>}
                    {item.source && (
                      <div className="mb-3">
                        <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Speaker</p>
                        <p className="text-xs text-gray-500">— {item.source}</p>
                      </div>
                    )}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {item.tags.map(tag => (
                          <span key={tag} className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded-full">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="border-t border-gray-100 px-5 py-3 bg-gray-50">
                    {item.externalLink ? (
                      <a href={item.externalLink} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-yellow-600 hover:text-yellow-700 flex items-center gap-1">
                        Register to Attend <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <a href="mailto:bd@dronetv.in?subject=Webinar Registration" className="text-xs font-bold text-yellow-600 hover:text-yellow-700">
                        Register to Attend →
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
            <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Topics</span>
            Webinar Topics Covered on DroneTv.in
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topicSections.map((topic, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <div className="text-2xl mb-3">{topic.icon}</div>
                <h3 className="font-bold text-gray-900 text-sm mb-2">{topic.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{topic.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
            <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Guide</span>
            What to Expect at Drone Webinars
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
            <h3 className="font-bold text-white text-base mb-1">Promote Your Webinar on DroneTv.in</h3>
            <p className="text-sm text-white/60 max-w-lg">
              Brand and Scale package subscribers get social media promotion for their webinars across DroneTv's LinkedIn, Instagram, Facebook, and YouTube channels.
            </p>
            <p className="text-xs text-white/40 mt-1">✉ bd@dronetv.in &nbsp;|&nbsp; 📞 +91 7520123555</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <a href="mailto:bd@dronetv.in?subject=Submit Webinar"
              className="px-4 py-2 bg-yellow-400 text-black text-sm font-bold rounded-lg hover:bg-yellow-300 transition-colors">
              Submit Webinar
            </a>
            <a href="/packages"
              className="px-4 py-2 border border-white/20 text-white text-sm font-semibold rounded-lg hover:bg-white/10 transition-colors">
              View Packages
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
