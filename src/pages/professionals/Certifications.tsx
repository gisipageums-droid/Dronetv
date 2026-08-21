import { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import { fetchContent, MediaItem } from '../../lib/mediaApi';
import CompactHero from '../../components/common/CompactHero';
import ContentCard from '../../components/common/ContentCard';
import { withInlineAds, AdSidebarRail } from '../../components/common/adCreatives';
import PostContentCTA from '../../components/common/PostContentCTA';

const certCategories = [
  {
    icon: '🚁',
    title: 'Small Category',
    subtitle: 'Drones above 250g and up to 2kg MTOW',
    desc: 'Covers 90%+ of commercial agriculture, survey, cinematography, and inspection drones in India. Best starting point for all new pilots.',
    cost: 'Rs. 50,000 – 80,000',
    duration: '5 Days Training',
    popular: true,
  },
  {
    icon: '🛸',
    title: 'Medium Category',
    subtitle: 'Drones above 2kg and up to 25kg MTOW',
    desc: 'Required for heavy agriculture drones, large LiDAR platforms, and industrial inspection. More rigorous practical requirements.',
    cost: 'Rs. 1,00,000 – 1,50,000',
    duration: '10–15 Days Training',
    popular: false,
  },
  {
    icon: '✈️',
    title: 'Large Category',
    subtitle: 'Drones above 25kg MTOW',
    desc: 'Defence, cargo delivery, and specialised industrial platforms. Requires prior Small or Medium certification. Most demanding and highest-paying category.',
    cost: 'Rs. 2,50,000 – 3,00,000',
    duration: '15+ Days Training',
    popular: false,
  },
];

const steps = [
  {
    step: '01',
    icon: '🎂',
    title: 'Eligibility Check',
    subtitle: 'Confirm You Are Eligible',
    desc: 'Confirm you meet the basic eligibility criteria set by DGCA for remote pilot certification.',
    bullets: ['Age: Minimum 18 years', 'Education: Class 10 pass with English literacy', 'Language: English or Hindi reading ability required'],
  },
  {
    step: '02',
    icon: '🏥',
    title: 'Medical Examination',
    subtitle: 'Pass DGCA Class 2 Medical',
    desc: 'A DGCA Class 2 medical examination is mandatory before you can begin flight training. Conducted by DGCA-empanelled aviation medical examiners across India.',
    bullets: ['Duration: Half-day examination', 'Cost: Rs. 3,000 – 6,000 approx.', 'Validity: 5 years for under 40, 2 years for 40+'],
  },
  {
    step: '03',
    icon: '🏫',
    title: 'Enrol at a DGCA-Approved RPTO',
    subtitle: 'Complete Training at an Approved Institute',
    desc: 'Choose a DGCA-approved Remote Pilot Training Organisation (RPTO). India has 240+ approved institutes across all states.',
    bullets: ['Duration: 5 days (Small) | 15 days (Medium/Large)', 'Cost: Rs. 40,000–75,000+ depending on RPTO and category', 'Locations: 240+ RPTOs across India'],
  },
  {
    step: '04',
    icon: '📝',
    title: 'DGCA Theoretical Examination',
    subtitle: 'Pass the Written Theory Exam',
    desc: 'The DGCA theory exam covers air navigation, meteorology, drone regulations, airspace management, safety procedures, and emergency protocols. Conducted online through the DigitalSky platform.',
    bullets: ['Format: Online multiple-choice exam', 'Pass mark: 70%', 'Attempts: Unlimited (with cooling period)'],
  },
  {
    step: '05',
    icon: '🛩️',
    title: 'Practical Flight Assessment',
    subtitle: 'Complete Practical Skills Test',
    desc: 'A DGCA examiner or RPTO-designated assessor evaluates your practical flying skills, including takeoff/landing, hover control, emergency procedures, and mission execution.',
    bullets: ['Duration: 1–2 hours assessment', 'Outcome: Pass/Fail with feedback', 'Certificate: DGCA Remote Pilot Certificate (RPC)'],
  },
  {
    step: '06',
    icon: '🏅',
    title: 'Start Your Career',
    subtitle: 'Receive RPC and Start Flying Professionally',
    desc: "Your DGCA Remote Pilot Certificate is registered on the DigitalSky platform. You are now legally authorised to operate drones commercially in India in your certified category.",
    bullets: ['Starting salary: Rs. 25,000–40,000/month', 'Growth: Rs. 10–20 LPA after 3–5 years', 'Platform: Register on DigitalSky for flight plans'],
  },
];

const rptOs = [
  { name: 'Drone Destination', city: 'Delhi', specialty: 'Multi-category' },
  { name: 'ideaForge Technology', city: 'Pune', specialty: 'Small & Medium category' },
  { name: 'Garuda Aerospace', city: 'Chennai', specialty: 'Agriculture drones' },
  { name: 'TATA Advanced Systems', city: 'Bengaluru', specialty: 'Large category' },
  { name: 'Throttle Aerospace Systems', city: 'Hyderabad', specialty: 'Survey & mapping' },
];

export default function CertificationsPage() {
  const [cmsItems, setCmsItems] = useState<MediaItem[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchContent('certification', controller.signal).then(setCmsItems).catch(() => {});
    return () => controller.abort();
  }, []);

  return (
    <div className="pt-[104px] min-h-screen bg-surface-main">
      <CompactHero
        title={<>DGCA Drone <span>Certifications</span> India 2026</>}
        stats={[
          { n: '5', l: 'Days Small Training' },
          { n: '39,890', l: 'Certified Pilots' },
          { n: '240+', l: 'RPTOs Approved' },
        ]}
      />

      <div className="max-w-6xl mx-auto px-6 py-8 lg:flex lg:items-start lg:gap-6">
        <div className="flex-1 min-w-0 space-y-10">
        <div>
          <h2 className="text-lg font-bold text-ink flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-ink-light after:content-['']">
            <span className="bg-brand-yellow text-ink text-xs font-bold px-2 py-0.5 rounded">Categories</span>
            Choose Your Certification Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {certCategories.map((cat) => (
              <div key={cat.title} className="relative">
                {cat.popular && (
                  <span className="absolute -top-3 left-5 z-10 bg-brand-yellow text-ink text-xs font-bold px-3 py-0.5 rounded-full">Most Popular</span>
                )}
                <ContentCard className={cat.popular ? 'border-brand-yellow border-2' : ''}>
                  <div className="text-3xl mb-3">{cat.icon}</div>
                  <h3 className="font-extrabold text-ink text-lg mb-1">{cat.title}</h3>
                  <p className="text-xs text-ink-caption mb-3">{cat.subtitle}</p>
                  <p className="text-sm text-ink-paragraph leading-relaxed mb-4">{cat.desc}</p>
                  <div className="mt-auto pt-4 border-t border-ink-light space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-ink-caption font-semibold">Course Cost</span>
                      <span className="text-sm font-extrabold text-ink">{cat.cost}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-ink-caption font-semibold">Duration</span>
                      <span className="text-xs font-bold text-brand-gold bg-surface-main px-2 py-0.5 rounded">{cat.duration}</span>
                    </div>
                  </div>
                </ContentCard>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-ink flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-ink-light after:content-['']">
            <span className="bg-brand-yellow text-ink text-xs font-bold px-2 py-0.5 rounded">Process</span>
            Step-by-Step Certification Path
          </h2>
          <div className="space-y-4">
            {steps.map((s) => (
              <div key={s.step} className="bg-surface-card rounded-xl border border-ink-light shadow-sm p-5 flex flex-col md:flex-row gap-4">
                <div className="flex-shrink-0 flex items-start gap-4">
                  <div className="w-10 h-10 bg-brand-yellow rounded-full flex items-center justify-center text-ink font-extrabold text-sm flex-shrink-0">
                    {s.step}
                  </div>
                  <div className="text-2xl">{s.icon}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-ink text-base leading-snug mb-0.5">{s.title}</h3>
                  <p className="text-xs font-semibold text-brand-gold uppercase tracking-wide mb-2">{s.subtitle}</p>
                  <p className="text-sm text-ink-paragraph leading-relaxed mb-3">{s.desc}</p>
                  <div className="flex flex-wrap gap-3">
                    {s.bullets.map((b, i) => (
                      <span key={i} className="bg-ink-light text-ink-paragraph text-xs font-semibold px-3 py-1 rounded-full">{b}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-ink flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-ink-light after:content-['']">
            <span className="bg-brand-yellow text-ink text-xs font-bold px-2 py-0.5 rounded">RPTOs</span>
            Top Training Organisations
          </h2>
          {cmsItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {withInlineAds(cmsItems, item => (
                <ContentCard key={item.contentId}>
                  {item.imageUrl && (
                    <div className="w-full h-32 bg-ink-light rounded-lg mb-3 overflow-hidden">
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold text-ink text-sm leading-snug line-clamp-2">{item.title}</h3>
                    {item.category && <span className="bg-brand-yellow-soft text-brand-gold text-xs font-bold px-2 py-0.5 rounded flex-shrink-0">{item.category}</span>}
                  </div>
                  {item.company && <p className="text-xs text-ink-caption mb-1">{item.company}</p>}
                  {item.location && <p className="text-xs text-ink-caption mb-2">{item.location}</p>}
                  {item.description && (
                    <div className="mb-3">
                      <p className={`text-xs text-ink-caption leading-relaxed ${expandedIds.has(item.contentId) ? '' : 'line-clamp-3'}`}>{item.description}</p>
                      {item.description.length > 180 && (
                        <button onClick={() => toggleExpanded(item.contentId)} className="text-xs font-bold text-brand-gold hover:text-brand-yellow mt-1">
                          {expandedIds.has(item.contentId) ? 'Show less' : 'Read more'}
                        </button>
                      )}
                    </div>
                  )}
                  <div className="mt-auto pt-3 border-t border-ink-light flex items-center justify-between">
                    {item.price && <span className="text-xs font-semibold text-ink-paragraph">{item.price}</span>}
                    {item.externalLink && (
                      <a href={item.externalLink} target="_blank" rel="noopener noreferrer"
                        className="text-xs font-bold text-brand-gold hover:text-brand-yellow flex items-center gap-1 ml-auto">
                        Learn More <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </ContentCard>
              ))}
            </div>
          ) : (
            <div className="bg-surface-card rounded-xl border border-ink-light shadow-sm overflow-hidden">
              {rptOs.map((r, i) => (
                <div key={i} className={`flex items-center justify-between px-5 py-3.5 ${i < rptOs.length - 1 ? 'border-b border-ink-light' : ''}`}>
                  <div>
                    <p className="font-bold text-ink text-sm">{r.name}</p>
                    <p className="text-xs text-ink-caption">{r.specialty}</p>
                  </div>
                  <span className="bg-ink-light text-ink-paragraph text-xs font-semibold px-3 py-1 rounded-full">{r.city}</span>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4 text-center">
            <a href="https://digitalsky.dgca.gov.in" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-bold text-brand-gold hover:text-brand-yellow transition-colors">
              View all 240+ approved RPTOs on DGCA DigitalSky <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="bg-ink rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-white text-base mb-1">Drone Academy Private Limited — DGCA-Approved Training</h3>
            <p className="text-sm text-white/60 max-w-lg">
              DroneTv.in is operated by Drone Academy Private Limited. For guidance on choosing the right RPTO, understanding exam requirements, or planning your certification path, contact our team directly.
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <a href="mailto:bd@dronetv.in?subject=RPTO Guidance"
              className="px-4 py-2 bg-brand-yellow text-ink text-sm font-bold rounded-lg hover:bg-brand-yellow-soft transition-colors">
              Find an RPTO
            </a>
            <a href="/professionals/job-board"
              className="px-4 py-2 border border-white/20 text-white text-sm font-semibold rounded-lg hover:bg-white/10 transition-colors">
              Browse Jobs After Certification
            </a>
          </div>
        </div>

        <PostContentCTA contentType="certification" typeLabel="Certification"
          ctaDescription="Run a DGCA-approved RPTO or offer a drone certification course? List it for pilots to discover." />
        </div>
        <AdSidebarRail />
      </div>
    </div>
  );
}
