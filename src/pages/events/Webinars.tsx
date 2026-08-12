import { useState, useEffect } from 'react';
import { Monitor, X } from 'lucide-react';
import { fetchContent, MediaItem } from '../../lib/mediaApi';
import { ADMIN_API, LAMBDA } from '../../lib/apiConfig';
import CompactHero from '../../components/common/CompactHero';
import ContentCard from '../../components/common/ContentCard';
import { withInlineAds, AdSidebarRail } from '../../components/common/adCreatives';
import PostContentCTA from '../../components/common/PostContentCTA';
import DteaWebinarCard from './DteaWebinarCard';

const CONTACT_URL = ADMIN_API ? `${ADMIN_API}/contact` : `${LAMBDA.contact}/contact`;

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

interface RegForm { name: string; email: string; phone: string; }

export default function WebinarsPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; item: MediaItem | null }>({ open: false, item: null });
  const [form, setForm] = useState<RegForm>({ name: '', email: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetchContent('webinar', controller.signal).then(setItems).catch(() => {}).finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const openModal = (item: MediaItem) => {
    setModal({ open: true, item });
    setForm({ name: '', email: '', phone: '' });
    setSubmitted(false);
    setSubmitError(false);
  };

  const closeModal = () => {
    setModal({ open: false, item: null });
    setSubmitted(false);
    setSubmitError(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(false);
    try {
      const res = await fetch(CONTACT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          message: `Webinar Registration: ${modal.item?.title}`,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSubmitted(true);
    } catch {
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      <CompactHero
        title={<>Drone Industry <span>Webinars</span></>}
        stats={[
          { n: 'Free', l: 'To List Your Webinar' },
        ]}
      />

      <div className="max-w-6xl mx-auto px-6 py-8 pb-12 lg:flex lg:items-start lg:gap-6">
        <div className="flex-1 min-w-0 space-y-8">
        <DteaWebinarCard />

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
                Hosting a drone, GIS, or AI webinar? Submit it here for free listing and promotion to DroneTv.in's audience.
              </p>
              <a href="mailto:bd@dronetv.in?subject=Submit Webinar"
                className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black text-sm font-bold rounded-lg hover:bg-yellow-300 transition-colors">
                Submit Your Webinar
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
              {withInlineAds(items, item => (
                <ContentCard
                  key={item.contentId}
                  image={item.imageUrl}
                  imageAlt={item.title}
                  imageFallback={<Monitor className="w-10 h-10 text-yellow-400" />}
                >
                  <div className="flex items-center justify-between mb-3">
                    {item.price ? (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${item.price.toLowerCase() === 'free' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{item.price}</span>
                    ) : <span />}
                    {item.date && <span className="text-xs font-bold text-gray-500">{item.date}</span>}
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 leading-snug mb-1 line-clamp-2">{item.title}</h3>
                  {item.platform && <p className="text-xs text-gray-400 mb-3">{item.platform}</p>}
                  {item.description && <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-3">{item.description}</p>}
                  {item.source && (
                    <div className="mb-3">
                      <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Speaker</p>
                      <p className="text-xs text-gray-500">— {item.source}</p>
                    </div>
                  )}
                  <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                    {item.tags && item.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {item.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded-full">{tag}</span>
                        ))}
                      </div>
                    ) : <span />}
                    <button onClick={() => openModal(item)} className="text-xs font-bold text-yellow-600 hover:text-yellow-700 whitespace-nowrap">
                      Register to Attend →
                    </button>
                  </div>
                </ContentCard>
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

        <PostContentCTA contentType="webinar" typeLabel="Webinar"
          ctaTitle="Submit Instantly"
          ctaDescription="Prefer instant self-listing over manual review? Post your webinar directly." />
        </div>
        <AdSidebarRail />
      </div>

      {/* Registration Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-[10000000] flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-base font-bold text-gray-900">Register to Attend</h2>
              <button onClick={closeModal} className="p-1.5 rounded hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="px-6 py-5">
              {!submitted ? (
                <>
                  <p className="text-sm font-semibold text-gray-800 mb-1">{modal.item?.title}</p>
                  {modal.item?.date && <p className="text-xs text-gray-400 mb-4">{modal.item.date}</p>}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name *</label>
                      <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Your full name"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-yellow-400" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Email *</label>
                      <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="Your email address"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-yellow-400" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Phone *</label>
                      <input type="tel" required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-yellow-400" />
                    </div>
                    {submitError && (
                      <p className="text-xs text-red-600 font-medium">
                        Registration failed. Please check your connection and try again.
                      </p>
                    )}
                    <button type="submit" disabled={submitting}
                      className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-sm py-3 rounded-lg transition-colors disabled:opacity-50">
                      {submitting ? 'Registering...' : 'Confirm Registration'}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">✓</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">You're registered!</h3>
                  <p className="text-sm text-gray-500 mb-4">We'll send you the details at {form.email}.</p>
                  {modal.item?.externalLink && (
                    <a href={modal.item.externalLink} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-black text-white font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-gray-900 transition-colors">
                      Join Webinar →
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
