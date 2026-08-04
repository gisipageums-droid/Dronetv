import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapPin, Search, X, Briefcase, Plus, Paperclip } from 'lucide-react';
import { fetchContent, fetchAdminContent, createContent, MediaItem } from '../../lib/mediaApi';
import { submitApplication, uploadResumeFile } from '../../lib/jobApplicationsApi';
import { useUserAuth } from '../../components/context/context';
import CompactHero from '../../components/common/CompactHero';
import ContentCard from '../../components/common/ContentCard';
import { withInlineAds, AdSidebarRail, AdDetailBanner, SponsorBadge } from '../../components/common/adCreatives';
import { COMPANY_API, LAMBDA } from '../../lib/apiConfig';

// Category that currently has an exclusive Zone 6 sponsor badge (see ad placement plan in memory)
const SPONSORED_CATEGORY = 'Agriculture';

interface ApplyForm { name: string; email: string; phone: string; message: string; resume: File | null; }
interface PostJobForm { title: string; company: string; location: string; salary: string; category: string; jobType: string; description: string; imageUrl: string; applicationDeadline: string; }
const EMPTY_POST: PostJobForm = { title: '', company: '', location: '', salary: '', category: '', jobType: 'Full-Time', description: '', imageUrl: '', applicationDeadline: '' };
const JOB_CATEGORIES = ['Agriculture', 'Survey & GIS', 'Inspection', 'Cinematography', 'Instructor', 'Defence', 'Manufacturing', 'R&D', 'Operations'];

const staticJobs = [
  { icon: '🌾', title: 'Agriculture Drone Pilot', company: 'Agri-Drone Service Company — Telangana', category: 'Agriculture', type: 'Full-Time', salary: 'Rs. 30,000–40,000/mo', location: 'Hyderabad / Field' },
  { icon: '🗺️', title: 'GIS Survey Drone Pilot', company: 'Survey and Mapping Firm — Pan India', category: 'Survey & GIS', type: 'Full-Time', salary: 'Rs. 35,000–55,000/mo', location: 'Multiple Locations' },
  { icon: '🎬', title: 'Aerial Cinematography Drone Operator', company: 'Media Production Company — Mumbai', category: 'Cinematography', type: 'Contract', salary: 'Rs. 40,000–70,000/mo', location: 'Mumbai, Maharashtra' },
  { icon: '🏗️', title: 'Infrastructure Inspection Drone Pilot', company: 'Engineering Inspection Company — Bengaluru', category: 'Inspection', type: 'Full-Time', salary: 'Rs. 35,000–50,000/mo', location: 'Bengaluru / Site Visits' },
  { icon: '🎓', title: 'Drone Flight Instructor', company: 'DGCA-Approved RPTO — Pan India', category: 'Instructor', type: 'Full-Time', salary: 'Rs. 40,000–50,000/mo', location: 'Multiple RPTO Locations' },
  { icon: '⚙️', title: 'UAV Test Pilot and Integration Engineer', company: 'Drone Manufacturer — Bengaluru / Noida', category: 'Manufacturing', type: 'Full-Time', salary: 'Rs. 50,000–80,000/mo', location: 'Bengaluru / Noida' },
  { icon: '🛡️', title: 'Surveillance Drone Operator', company: 'Security Solutions Company — Delhi NCR', category: 'Defence', type: 'Full-Time', salary: 'Rs. 35,000–47,000/mo', location: 'Delhi NCR' },
  { icon: '🌱', title: 'NDVI Mapping and Crop Analytics Pilot', company: 'AgriTech Platform — Maharashtra', category: 'Agriculture', type: 'Contract', salary: 'Rs. 30,000–45,000/mo', location: 'Pune / Field' },
];

const salaryGuide = [
  { range: 'Rs. 25,000–40,000/mo', level: 'Entry Level', desc: 'Fresh DGCA-certified pilot. 0–2 years experience. Agriculture, basic survey, or inspection roles. Salary grows quickly with hours logged.' },
  { range: 'Rs. 40,000–70,000/mo', level: 'Experienced Pilot', desc: '2–5 years experience. Specialised in GIS, cinematography, or inspection. Medium/Large category RPC holders command premium rates.' },
  { range: 'Rs. 70,000–1,00,000+/mo', level: 'Senior / Specialist', desc: '5+ years. BVLOS-experienced. UAV integration engineers, chief pilots, and instructors at top companies. Freelancers earn project-based.' },
];

const allCategories = ['All', 'Agriculture', 'Survey & GIS', 'Inspection', 'Cinematography', 'Instructor', 'Defence'];

export default function JobBoardPage() {
  const { user } = useUserAuth();
  const userId = (user as any)?.userData?.email || (user as any)?.email || '';
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [applyModal, setApplyModal] = useState<{ open: boolean; item: MediaItem | null }>({ open: false, item: null });
  const [applyForm, setApplyForm] = useState<ApplyForm>({ name: '', email: '', phone: '', message: '', resume: null });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [postJobModal, setPostJobModal] = useState(false);
  const [postJobForm, setPostJobForm] = useState<PostJobForm>(EMPTY_POST);
  const [postSubmitting, setPostSubmitting] = useState(false);
  const [postSubmitted, setPostSubmitted] = useState(false);
  const [postSubmitError, setPostSubmitError] = useState(false);
  const [myJobs, setMyJobs] = useState<MediaItem[]>([]);
  const [companies, setCompanies] = useState<{ publishedId: string; companyName: string }[]>([]);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (!userId) { setCompanies([]); return; }
    const controller = new AbortController();
    const url = COMPANY_API ? `${COMPANY_API}/dashboard-cards?userId=${userId}` : `${LAMBDA.company}/dashboard-cards?userId=${userId}`;
    fetch(url, { signal: controller.signal })
      .then(res => res.json())
      .then(data => setCompanies((data.cards || []).map((c: any) => ({ publishedId: c.publishedId || '', companyName: c.companyName || 'Unnamed Company' }))))
      .catch(() => {});
    return () => controller.abort();
  }, [userId]);

  const loadMyJobs = useCallback(() => {
    if (!userId) { setMyJobs([]); return; }
    fetchAdminContent(undefined, 'job')
      .then(all => setMyJobs(all.filter(j => j.author === userId && !j.title.startsWith('[Application]'))))
      .catch(() => {});
  }, [userId]);

  // Server-backed so a job posted on one device shows up on every device, not just localStorage
  useEffect(() => { loadMyJobs(); }, [loadMyJobs]);

  useEffect(() => {
    if (searchParams.get('postjob') === 'true' && userId) {
      setPostJobModal(true);
    }
  }, [searchParams, userId]);

  const openApply = (item: MediaItem) => {
    setApplyModal({ open: true, item });
    setApplyForm({ name: '', email: '', phone: '', message: '', resume: null });
    setSubmitted(false);
    setSubmitError(false);
  };

  const closeApply = () => { setApplyModal({ open: false, item: null }); setSubmitted(false); setSubmitError(false); };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyModal.item?.contentId) return;
    setSubmitting(true);
    setSubmitError(false);
    try {
      let resumeKey = '';
      if (applyForm.resume) {
        resumeKey = await uploadResumeFile(applyForm.resume);
      }
      await submitApplication({
        jobId: applyModal.item.contentId,
        jobTitle: applyModal.item.title,
        company: applyModal.item.company || '',
        fullName: applyForm.name,
        email: applyForm.email,
        phone: applyForm.phone,
        professionalSummary: applyForm.message,
        resumeKey,
      });
      setSubmitted(true);
    } catch {
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postJobForm.title || !postJobForm.company) return;
    setPostSubmitting(true);
    setPostSubmitError(false);
    try {
      const created = await createContent({
        contentType: 'job',
        title: postJobForm.title,
        description: postJobForm.description,
        company: postJobForm.company,
        location: postJobForm.location,
        salary: postJobForm.salary,
        category: postJobForm.category,
        platform: postJobForm.jobType,
        author: userId,
        source: userId,
        imageUrl: postJobForm.imageUrl || undefined,
        applicationDeadline: postJobForm.applicationDeadline,
        isPublished: false,
      });
      if (userId && created?.contentId) {
        loadMyJobs();
      }
      setPostSubmitted(true);
    } catch {
      setPostSubmitError(true);
    } finally {
      setPostSubmitting(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchContent('job', controller.signal).then(setItems).catch(() => {}).finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const categories = items.length > 0
    ? ['All', ...Array.from(new Set(items.map(i => i.category || 'General').filter(Boolean)))]
    : allCategories;

  const filteredStatic = staticJobs.filter(j => {
    const matchCat = activeCategory === 'All' || j.category === activeCategory;
    const matchSearch = !search || j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase()) || j.location.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const filteredCms = items.filter(i => {
    const matchCat = activeCategory === 'All' || (i.category || 'General') === activeCategory;
    const matchSearch = !search || i.title.toLowerCase().includes(search.toLowerCase()) || (i.company || '').toLowerCase().includes(search.toLowerCase()) || (i.location || '').toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="pt-[104px] min-h-screen bg-surface-main">
      <CompactHero
        title={<>Drone, GIS &amp; AI <span>Job Board</span></>}
        stats={[
          { n: items.length || staticJobs.length, l: 'Active Listings' },
          { n: 'Rs.25K–1L', l: 'Monthly Salary Range' },
        ]}
      />

      <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-caption" />
          <input type="text" placeholder="Search jobs, companies, locations..." value={search} onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2.5 border border-ink-light rounded-xl text-sm focus:outline-none focus:border-brand-yellow w-full" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`relative px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${activeCategory === cat ? 'bg-brand-yellow border-brand-yellow text-ink' : 'border-ink-light text-ink-caption hover:border-brand-yellow'}`}>
              {cat}
              {cat === SPONSORED_CATEGORY && <SponsorBadge />}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mb-8 lg:flex lg:items-start lg:gap-6">
        <div className="flex-1 min-w-0 space-y-8">
        <div>
          <h2 className="text-lg font-bold text-ink flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-ink-light after:content-['']">
            <span className="bg-brand-yellow text-ink text-xs font-bold px-2 py-0.5 rounded">Open</span>
            Active Job Listings {items.length === 0 && 'June 2026'}
          </h2>
          {loading ? (
            <div className="text-center py-10 text-ink-caption">Loading jobs...</div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {withInlineAds(filteredCms, item => (
                <ContentCard
                  key={item.contentId}
                  image={item.imageUrl}
                  imageAlt={item.title}
                  imageFallback={<Briefcase className="w-10 h-10 text-brand-yellow" />}
                  className="border-l-4 border-l-brand-yellow"
                >
                  {item.category && <span className="bg-brand-yellow-soft text-brand-gold text-xs font-bold px-2 py-0.5 rounded mb-2 inline-block self-start">{item.category}</span>}
                  <h3 className="text-sm font-bold text-ink leading-snug mb-1 line-clamp-2">{item.title}</h3>
                  {item.company && <p className="text-xs text-ink-caption mb-2">{item.company}{item.location ? ` · ${item.location}` : ''}</p>}
                  {item.description && <p className="text-xs text-ink-caption leading-relaxed mb-3 line-clamp-3">{item.description}</p>}
                  <div className="mt-auto pt-3 border-t border-ink-light flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {item.salary && <span className="text-sm font-bold text-ink-paragraph truncate">{item.salary}</span>}
                      {item.platform && <span className="bg-ink-light text-ink-paragraph text-xs font-semibold px-2 py-0.5 rounded flex-shrink-0">{item.platform}</span>}
                    </div>
                    <button onClick={() => openApply(item)} className="text-xs font-bold text-brand-gold hover:text-brand-yellow flex-shrink-0">Apply →</button>
                  </div>
                </ContentCard>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {withInlineAds(filteredStatic, (job, i) => (
                <ContentCard key={i} imageFallback={<span className="text-4xl">{job.icon}</span>} className="border-l-4 border-l-brand-yellow">
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    <span className="bg-brand-yellow-soft text-brand-gold text-xs font-bold px-2 py-0.5 rounded">{job.category}</span>
                    <span className="bg-ink-light text-ink-paragraph text-xs font-semibold px-2 py-0.5 rounded">{job.type}</span>
                  </div>
                  <h3 className="text-sm font-bold text-ink leading-snug mb-1 line-clamp-2">{job.title}</h3>
                  <p className="text-xs text-ink-caption mb-2">{job.company}</p>
                  <div className="flex items-center gap-1 text-xs text-ink-caption">
                    <MapPin className="w-3 h-3 flex-shrink-0" />{job.location}
                  </div>
                  <div className="mt-auto pt-3 border-t border-ink-light flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-ink-paragraph">{job.salary}</span>
                    <a href="mailto:bd@dronetv.in?subject=Job Application" className="text-xs font-bold text-brand-gold hover:text-brand-yellow">Apply →</a>
                  </div>
                </ContentCard>
              ))}
            </div>
          )}
        </div>

        {/* Zone 4: Job Detail Panel Ad — real page has no separate job-detail view, so this sits right after the primary listings content instead */}
        <AdDetailBanner />

        <div>
          <h2 className="text-lg font-bold text-ink flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-ink-light after:content-['']">
            <span className="bg-brand-yellow text-ink text-xs font-bold px-2 py-0.5 rounded">Salary</span>
            Salary Guide — India 2026 Verified Data
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {salaryGuide.map((g, i) => (
              <ContentCard key={i}>
                <div className="text-xl font-extrabold text-brand-gold mb-1">{g.range}</div>
                <div className="text-sm font-bold text-ink mb-2">{g.level}</div>
                <p className="text-xs text-ink-caption leading-relaxed">{g.desc}</p>
              </ContentCard>
            ))}
          </div>
        </div>
        </div>

        {/* Zone 2A/2B: sidebar ad rail — hidden below lg so it never disturbs the mobile/tablet single-column layout */}
        <AdSidebarRail />
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-12 space-y-8">
        {myJobs.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-ink flex items-center gap-3 mb-4 after:flex-1 after:h-0.5 after:bg-ink-light after:content-['']">
              <span className="bg-brand-yellow text-ink text-xs font-bold px-2 py-0.5 rounded">My</span>
              My Posted Jobs
            </h2>
            <div className="space-y-2">
              {myJobs.map(j => (
                <div key={j.contentId} className="bg-surface-card rounded-xl border border-ink-light p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-surface-main rounded-lg flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-4 h-4 text-brand-gold" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink">{j.title}</p>
                      <p className="text-xs text-ink-caption">Submitted {new Date(j.createdAt).toLocaleDateString('en-IN')} · {j.isPublished ? 'Live on Job Board' : 'Pending admin review'}</p>
                    </div>
                  </div>
                  {j.isPublished
                    ? <span className="text-xs bg-status-success/15 text-status-success font-bold px-2 py-0.5 rounded flex-shrink-0">Live</span>
                    : <span className="text-xs bg-brand-yellow-soft text-brand-gold font-bold px-2 py-0.5 rounded flex-shrink-0">Pending</span>
                  }
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-ink rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-white text-base mb-1">Post a Job on DroneTv.in</h3>
            <p className="text-sm text-white/60 max-w-lg">
              Hiring drone pilots, GIS analysts, geospatial engineers, survey/mapping specialists, AI/computer-vision engineers, UAV instructors, or operations staff? Reach 39,890 certified pilots across India.
            </p>
            <p className="text-xs text-white/40 mt-1">Scale and Brand subscribers post unlimited jobs as part of their package.</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            {userId ? (
              <button onClick={() => { setPostJobForm({ ...EMPTY_POST, company: companies[0]?.companyName || '' }); setPostSubmitted(false); setPostSubmitError(false); setPostJobModal(true); }}
                className="flex items-center gap-2 px-4 py-2 bg-brand-yellow text-ink text-sm font-bold rounded-lg hover:bg-brand-yellow-soft transition-colors">
                <Plus className="w-4 h-4" /> Post a Job
              </button>
            ) : (
              <a href="/login"
                className="px-4 py-2 bg-brand-yellow text-ink text-sm font-bold rounded-lg hover:bg-brand-yellow-soft transition-colors">
                Login to Post a Job
              </a>
            )}
            <a href="/professionals/pilot-directory"
              className="px-4 py-2 border border-white/20 text-white text-sm font-semibold rounded-lg hover:bg-white/10 transition-colors">
              Browse Pilot Profiles
            </a>
          </div>
        </div>
      </div>

      {postJobModal && (
        <div className="fixed inset-0 z-[10000000] flex items-center justify-center bg-ink/60 p-4 overflow-y-auto">
          <div className="bg-surface-card rounded-xl shadow-2xl w-full max-w-lg my-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-ink-light">
              <h2 className="text-base font-bold text-ink flex items-center gap-2"><Briefcase className="w-4 h-4 text-brand-gold" />Post a Job</h2>
              <button onClick={() => setPostJobModal(false)} className="p-1.5 rounded hover:bg-ink-light"><X className="w-5 h-5 text-ink-caption" /></button>
            </div>
            <div className="px-6 py-5">
              {!postSubmitted ? (
                <form onSubmit={handlePostJob} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-ink-paragraph mb-1">Job Title *</label>
                    <input type="text" required value={postJobForm.title} onChange={e => setPostJobForm(f => ({ ...f, title: e.target.value }))}
                      placeholder="e.g. Agriculture Drone Pilot"
                      className="w-full px-3 py-2.5 border border-ink-light rounded-lg text-sm focus:outline-none focus:border-brand-yellow" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-ink-paragraph mb-1">Company Name *</label>
                      {companies.length > 0 ? (
                        <select required value={postJobForm.company} onChange={e => setPostJobForm(f => ({ ...f, company: e.target.value }))}
                          className="w-full px-3 py-2.5 border border-ink-light rounded-lg text-sm focus:outline-none focus:border-brand-yellow">
                          <option value="">Select your company</option>
                          {companies.map(c => <option key={c.publishedId} value={c.companyName}>{c.companyName}</option>)}
                        </select>
                      ) : (
                        <input type="text" required value={postJobForm.company} onChange={e => setPostJobForm(f => ({ ...f, company: e.target.value }))}
                          placeholder="Your company"
                          className="w-full px-3 py-2.5 border border-ink-light rounded-lg text-sm focus:outline-none focus:border-brand-yellow" />
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-ink-paragraph mb-1">Location</label>
                      <input type="text" value={postJobForm.location} onChange={e => setPostJobForm(f => ({ ...f, location: e.target.value }))}
                        placeholder="e.g. Hyderabad"
                        className="w-full px-3 py-2.5 border border-ink-light rounded-lg text-sm focus:outline-none focus:border-brand-yellow" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-ink-paragraph mb-1">Category</label>
                      <select value={postJobForm.category} onChange={e => setPostJobForm(f => ({ ...f, category: e.target.value }))}
                        className="w-full px-3 py-2.5 border border-ink-light rounded-lg text-sm focus:outline-none focus:border-brand-yellow">
                        <option value="">Select category</option>
                        {JOB_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-ink-paragraph mb-1">Job Type</label>
                      <select value={postJobForm.jobType} onChange={e => setPostJobForm(f => ({ ...f, jobType: e.target.value }))}
                        className="w-full px-3 py-2.5 border border-ink-light rounded-lg text-sm focus:outline-none focus:border-brand-yellow">
                        {['Full-Time', 'Part-Time', 'Contract', 'Internship'].map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink-paragraph mb-1">Salary / Compensation</label>
                    <input type="text" value={postJobForm.salary} onChange={e => setPostJobForm(f => ({ ...f, salary: e.target.value }))}
                      placeholder="e.g. Rs. 40,000–60,000/mo"
                      className="w-full px-3 py-2.5 border border-ink-light rounded-lg text-sm focus:outline-none focus:border-brand-yellow" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink-paragraph mb-1">Job Description</label>
                    <textarea rows={3} value={postJobForm.description} onChange={e => setPostJobForm(f => ({ ...f, description: e.target.value }))}
                      placeholder="Describe the role, requirements, and responsibilities..."
                      className="w-full px-3 py-2.5 border border-ink-light rounded-lg text-sm focus:outline-none focus:border-brand-yellow resize-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-ink-paragraph mb-1">Job Image URL <span className="text-ink-caption font-normal">(optional)</span></label>
                      <input type="url" value={postJobForm.imageUrl} onChange={e => setPostJobForm(f => ({ ...f, imageUrl: e.target.value }))}
                        placeholder="https://example.com/image.jpg"
                        className="w-full px-3 py-2.5 border border-ink-light rounded-lg text-sm focus:outline-none focus:border-brand-yellow" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-ink-paragraph mb-1">Application Deadline</label>
                      <input type="date" value={postJobForm.applicationDeadline} onChange={e => setPostJobForm(f => ({ ...f, applicationDeadline: e.target.value }))}
                        className="w-full px-3 py-2.5 border border-ink-light rounded-lg text-sm focus:outline-none focus:border-brand-yellow" />
                    </div>
                  </div>
                  <p className="text-xs text-ink-caption">Your job will be reviewed by DroneTv team before going live on the job board.</p>
                  {postSubmitError && (
                    <p className="text-xs text-status-error font-medium">
                      Submission failed. Please check your connection and try again.
                    </p>
                  )}
                  <button type="submit" disabled={postSubmitting}
                    className="w-full bg-brand-yellow hover:bg-brand-gold text-ink font-bold text-sm py-3 rounded-lg transition-colors disabled:opacity-50">
                    {postSubmitting ? 'Submitting...' : 'Submit Job Listing'}
                  </button>
                </form>
              ) : (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-status-success/15 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">✓</span>
                  </div>
                  <h3 className="font-bold text-ink mb-2">Job Submitted!</h3>
                  <p className="text-sm text-ink-caption mb-4">Your job listing is pending review. It will appear on the job board once approved.</p>
                  <button onClick={() => setPostJobModal(false)}
                    className="px-6 py-2 bg-brand-yellow text-ink font-bold rounded-lg text-sm hover:bg-brand-gold">
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {applyModal.open && (
        <div className="fixed inset-0 z-[10000000] flex items-center justify-center bg-ink/60 p-4 overflow-y-auto">
          <div className="bg-surface-card rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-ink-light">
              <h2 className="text-base font-bold text-ink">Apply for this Role</h2>
              <button onClick={closeApply} className="p-1.5 rounded hover:bg-ink-light"><X className="w-5 h-5 text-ink-caption" /></button>
            </div>
            <div className="px-6 py-5">
              {!submitted ? (
                <>
                  <p className="text-sm font-semibold text-ink-charcoal mb-1">{applyModal.item?.title}</p>
                  {applyModal.item?.company && <p className="text-xs text-ink-caption mb-4">{applyModal.item.company}</p>}
                  <form onSubmit={handleApply} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-ink-paragraph mb-1">Full Name *</label>
                      <input type="text" required value={applyForm.name} onChange={e => setApplyForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Your full name"
                        className="w-full px-3 py-2.5 border border-ink-light rounded-lg text-sm focus:outline-none focus:border-brand-yellow" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-ink-paragraph mb-1">Email *</label>
                      <input type="email" required value={applyForm.email} onChange={e => setApplyForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="Your email address"
                        className="w-full px-3 py-2.5 border border-ink-light rounded-lg text-sm focus:outline-none focus:border-brand-yellow" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-ink-paragraph mb-1">Phone *</label>
                      <input type="tel" required value={applyForm.phone} onChange={e => setApplyForm(f => ({ ...f, phone: e.target.value }))}
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full px-3 py-2.5 border border-ink-light rounded-lg text-sm focus:outline-none focus:border-brand-yellow" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-ink-paragraph mb-1">Brief message / experience</label>
                      <textarea rows={3} value={applyForm.message} onChange={e => setApplyForm(f => ({ ...f, message: e.target.value }))}
                        placeholder="Tell us briefly about your experience..."
                        className="w-full px-3 py-2.5 border border-ink-light rounded-lg text-sm focus:outline-none focus:border-brand-yellow resize-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-ink-paragraph mb-1">Resume <span className="text-ink-caption font-normal">(optional, PDF)</span></label>
                      <label className="flex items-center gap-2 px-3 py-2.5 border border-dashed border-ink-light rounded-lg text-sm text-ink-caption cursor-pointer hover:border-brand-yellow">
                        <Paperclip className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{applyForm.resume ? applyForm.resume.name : 'Upload your resume'}</span>
                        <input type="file" accept=".pdf,.doc,.docx" className="hidden"
                          onChange={e => setApplyForm(f => ({ ...f, resume: e.target.files?.[0] || null }))} />
                      </label>
                    </div>
                    {submitError && (
                      <p className="text-xs text-status-error font-medium">
                        Submission failed. Please check your connection and try again.
                      </p>
                    )}
                    <button type="submit" disabled={submitting}
                      className="w-full bg-brand-yellow hover:bg-brand-gold text-ink font-bold text-sm py-3 rounded-lg transition-colors disabled:opacity-50">
                      {submitting ? 'Submitting...' : 'Submit Application'}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="w-12 h-12 bg-status-success/15 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">✓</span>
                  </div>
                  <h3 className="font-bold text-ink mb-2">Application Submitted!</h3>
                  <p className="text-sm text-ink-caption">We'll review your application and get back to you at {applyForm.email}.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
