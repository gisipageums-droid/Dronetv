import { useState, useEffect } from 'react';
import { Monitor, X } from 'lucide-react';
import { fetchContent, MediaItem } from '../../lib/mediaApi';
import { ADMIN_API, LAMBDA } from '../../lib/apiConfig';
import CompactHero from '../../components/common/CompactHero';
import ContentCard from '../../components/common/ContentCard';
import { withInlineAds, AdSidebarRail } from '../../components/common/adCreatives';
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
    <div className="pt-[104px] min-h-screen bg-surface-main">
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
          <h2 className="text-lg font-bold text-ink flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-ink-light after:content-['']">
            <span className="bg-brand-yellow text-ink text-xs font-bold px-2 py-0.5 rounded">Upcoming</span>
            Webinars
          </h2>
          {loading ? (
            <div className="text-center py-10 text-ink-caption">Loading webinars...</div>
          ) : items.length === 0 ? (
            <div className="bg-surface-card rounded-xl border border-ink-light shadow-sm p-10 text-center">
              <Monitor className="w-10 h-10 text-ink-light mx-auto mb-3" />
              <p className="font-semibold text-ink-caption mb-1">No webinars currently listed</p>
              <p className="text-sm text-ink-caption mb-4 max-w-md mx-auto">
                Hosting a drone, GIS, or AI webinar? Submit it here for free listing and promotion to DroneTv.in's audience.
              </p>
              <a href="mailto:bd@dronetv.in?subject=Submit Webinar"
                className="inline-flex items-center gap-2 px-4 py-2 bg-brand-yellow text-ink text-sm font-bold rounded-lg hover:bg-brand-yellow-soft transition-colors">
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
                  imageFallback={<Monitor className="w-10 h-10 text-brand-yellow" />}
                >
                  <div className="flex items-center justify-between mb-3">
                    {item.price ? (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${item.price.toLowerCase() === 'free' ? 'bg-status-success/15 text-status-success' : 'bg-status-info/15 text-status-info'}`}>{item.price}</span>
                    ) : <span />}
                    {item.date && <span className="text-xs font-bold text-ink-caption">{item.date}</span>}
                  </div>
                  <h3 className="text-sm font-bold text-ink leading-snug mb-1 line-clamp-2">{item.title}</h3>
                  {item.platform && <p className="text-xs text-ink-caption mb-3">{item.platform}</p>}
                  {item.description && <p className="text-xs text-ink-caption leading-relaxed mb-3 line-clamp-3">{item.description}</p>}
                  {item.source && (
                    <div className="mb-3">
                      <p className="text-xs font-bold text-ink-paragraph uppercase tracking-wide mb-1">Speaker</p>
                      <p className="text-xs text-ink-caption">— {item.source}</p>
                    </div>
                  )}
                  <div className="mt-auto pt-3 border-t border-ink-light flex items-center justify-between gap-2">
                    {item.tags && item.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {item.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="bg-ink-light text-ink-paragraph text-xs font-semibold px-2 py-0.5 rounded-full">{tag}</span>
                        ))}
                      </div>
                    ) : <span />}
                    <button onClick={() => openModal(item)} className="text-xs font-bold text-brand-gold hover:text-brand-yellow whitespace-nowrap">
                      Register to Attend →
                    </button>
                  </div>
                </ContentCard>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-lg font-bold text-ink flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-ink-light after:content-['']">
            <span className="bg-brand-yellow text-ink text-xs font-bold px-2 py-0.5 rounded">Topics</span>
            Webinar Topics Covered on DroneTv.in
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topicSections.map((topic, i) => (
              <div key={i} className="bg-surface-card rounded-xl border border-ink-light shadow-sm p-5">
                <div className="text-2xl mb-3">{topic.icon}</div>
                <h3 className="font-bold text-ink text-sm mb-2">{topic.title}</h3>
                <p className="text-xs text-ink-caption leading-relaxed">{topic.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-ink flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-ink-light after:content-['']">
            <span className="bg-brand-yellow text-ink text-xs font-bold px-2 py-0.5 rounded">Guide</span>
            What to Expect at Drone Webinars
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {expectItems.map((item, i) => (
              <div key={i} className="bg-surface-card rounded-xl border border-ink-light shadow-sm p-5">
                <div className="text-2xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-ink text-sm mb-2">{item.title}</h3>
                <p className="text-xs text-ink-caption leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-ink rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-white text-base mb-1">Promote Your Webinar on DroneTv.in</h3>
            <p className="text-sm text-white/60 max-w-lg">
              Brand and Scale package subscribers get social media promotion for their webinars across DroneTv's LinkedIn, Instagram, Facebook, and YouTube channels.
            </p>
            <p className="text-xs text-white/40 mt-1">✉ bd@dronetv.in &nbsp;|&nbsp; 📞 +91 7520123555</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <a href="/form"
              className="px-4 py-2 bg-brand-yellow text-ink text-sm font-bold rounded-lg hover:bg-brand-yellow-soft transition-colors">
              Submit Webinar
            </a>
            <a href="/packages"
              className="px-4 py-2 border border-white/20 text-white text-sm font-semibold rounded-lg hover:bg-white/10 transition-colors">
              View Packages
            </a>
          </div>
        </div>
        </div>
        <AdSidebarRail />
      </div>

      {/* Registration Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-[10000000] flex items-center justify-center bg-ink/60 p-4">
          <div className="bg-surface-card rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-ink-light">
              <h2 className="text-base font-bold text-ink">Register to Attend</h2>
              <button onClick={closeModal} className="p-1.5 rounded hover:bg-ink-light">
                <X className="w-5 h-5 text-ink-caption" />
              </button>
            </div>
            <div className="px-6 py-5">
              {!submitted ? (
                <>
                  <p className="text-sm font-semibold text-ink-charcoal mb-1">{modal.item?.title}</p>
                  {modal.item?.date && <p className="text-xs text-ink-caption mb-4">{modal.item.date}</p>}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-ink-paragraph mb-1">Full Name *</label>
                      <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Your full name"
                        className="w-full px-3 py-2.5 border border-ink-light rounded-lg text-sm focus:outline-none focus:border-brand-yellow" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-ink-paragraph mb-1">Email *</label>
                      <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="Your email address"
                        className="w-full px-3 py-2.5 border border-ink-light rounded-lg text-sm focus:outline-none focus:border-brand-yellow" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-ink-paragraph mb-1">Phone *</label>
                      <input type="tel" required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full px-3 py-2.5 border border-ink-light rounded-lg text-sm focus:outline-none focus:border-brand-yellow" />
                    </div>
                    {submitError && (
                      <p className="text-xs text-status-error font-medium">
                        Registration failed. Please check your connection and try again.
                      </p>
                    )}
                    <button type="submit" disabled={submitting}
                      className="w-full bg-brand-yellow hover:bg-brand-gold text-ink font-bold text-sm py-3 rounded-lg transition-colors disabled:opacity-50">
                      {submitting ? 'Registering...' : 'Confirm Registration'}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="w-12 h-12 bg-status-success/15 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">✓</span>
                  </div>
                  <h3 className="font-bold text-ink mb-2">You're registered!</h3>
                  <p className="text-sm text-ink-caption mb-4">We'll send you the details at {form.email}.</p>
                  {modal.item?.externalLink && (
                    <a href={modal.item.externalLink} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-ink text-white font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-ink-charcoal transition-colors">
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
