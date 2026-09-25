import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapPin, Search, X, Briefcase, Plus, Paperclip, Tag, CalendarDays, ChevronDown, Filter, Grid3x3, List, Heart, Eye, Send, IndianRupee, Building2 } from 'lucide-react';
import { fetchContent, fetchMyContent, createContent, MediaItem } from '../../lib/mediaApi';
import { submitApplication, uploadResumeFile } from '../../lib/jobApplicationsApi';
import { useUserAuth } from '../../components/context/context';
import ContentCard from '../../components/common/ContentCard';
import { withInlineAds, AdSidebarRail, AdDetailBanner } from '../../components/common/adCreatives';
import { COMPANY_API, LAMBDA } from '../../lib/apiConfig';

// Preview build at /professionals/job-board-v2 - same treatment as
// Companies/Professionals/Products/Services V2: reference layout (stat bar,
// ribbon badge, photo header, 3-stat row, salary, buttons) with real data.
// Real job postings (MediaItem, contentType 'job') have no experience-level,
// education, work-mode, or skill-tag fields at all - only title/description/
// company/location/salary/category/platform(job type)/imageUrl/createdAt.
// The reference's FEATURED/URGENT/REMOTE/HYBRID/etc ribbon variety and skill
// pill row have zero real backing, so the ribbon here is only ever "NEW" (a
// real signal, from createdAt recency) and there is no pill row - dropped,
// not invented. All existing real functionality (Apply modal, Post-a-Job
// modal, My Posted Jobs, Salary Guide, ad rails) is unchanged from
// JobBoardPage.tsx, only the hero/controls/card visuals are new.

const PAGE_BG: React.CSSProperties = {
  backgroundColor: '#ffd84d',
  backgroundImage: 'radial-gradient(circle, rgba(174,139,24,0.2) 1.5px, transparent 2px)',
  backgroundSize: '56px 56px',
};
const BTN = 'rounded-lg border border-slate-200 bg-white px-3 py-2 font-semibold shadow-sm hover:border-amber-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500';

const CAT_ICONS: Record<string, string> = {
  Agriculture: '🌾', 'Survey & GIS': '🗺️', Inspection: '🔍', Cinematography: '🎬',
  Instructor: '🎓', Defence: '🛡️', Manufacturing: '⚙️', 'R&D': '🔬', Operations: '🚁', General: '💼',
};
function catIcon(cat: string): string {
  return CAT_ICONS[cat] || '💼';
}
function isRecent(ts?: string): boolean {
  if (!ts) return false;
  const d = new Date(ts).getTime();
  return Number.isFinite(d) && Date.now() - d < 30 * 24 * 60 * 60 * 1000;
}
function listedMonth(ts?: string): string | undefined {
  if (!ts) return undefined;
  const d = new Date(ts);
  return Number.isFinite(d.getTime()) ? d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : undefined;
}

interface ApplyForm { name: string; email: string; phone: string; message: string; resume: File | null; }
interface PostJobForm { title: string; company: string; location: string; salary: string; category: string; jobType: string; description: string; imageUrl: string; applicationDeadline: string; }
const EMPTY_POST: PostJobForm = { title: '', company: '', location: '', salary: '', category: '', jobType: 'Full-Time', description: '', imageUrl: '', applicationDeadline: '' };
const JOB_CATEGORIES = ['Agriculture', 'Survey & GIS', 'Inspection', 'Cinematography', 'Instructor', 'Defence', 'Manufacturing', 'R&D', 'Operations'];

const salaryGuide = [
  { range: 'Rs. 25,000–40,000/mo', level: 'Entry Level', desc: 'Fresh DGCA-certified pilot. 0–2 years experience. Agriculture, basic survey, or inspection roles. Salary grows quickly with hours logged.' },
  { range: 'Rs. 40,000–70,000/mo', level: 'Experienced Pilot', desc: '2–5 years experience. Specialised in GIS, cinematography, or inspection. Medium/Large category RPC holders command premium rates.' },
  { range: 'Rs. 70,000–1,00,000+/mo', level: 'Senior / Specialist', desc: '5+ years. BVLOS-experienced. UAV integration engineers, chief pilots, and instructors at top companies. Freelancers earn project-based.' },
];

export default function JobBoardPageV2() {
  const { user } = useUserAuth();
  const userId = (user as any)?.userData?.email || (user as any)?.email || '';
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selTypes, setSelTypes] = useState<string[]>([]);
  const [newOnly, setNewOnly] = useState(false);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [detailModal, setDetailModal] = useState<MediaItem | null>(null);
  const [applyModal, setApplyModal] = useState<{ open: boolean; item: MediaItem | null }>({ open: false, item: null });
  const [applyForm, setApplyForm] = useState<ApplyForm>({ name: '', email: '', phone: '', message: '', resume: null });
  const [submitting, setSubmitting] = useState(false);
  const [resumeUploadPct, setResumeUploadPct] = useState(0);
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
    fetchMyContent(undefined, 'job')
      .then(all => setMyJobs(all.filter(j => !j.title.startsWith('[Application]'))))
      .catch(() => {});
  }, [userId]);

  useEffect(() => { loadMyJobs(); }, [loadMyJobs]);

  useEffect(() => {
    if (searchParams.get('postjob') === 'true' && userId) setPostJobModal(true);
  }, [searchParams, userId]);

  useEffect(() => {
    const controller = new AbortController();
    fetchContent('job', controller.signal).then(setItems).catch(() => {}).finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

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
    setResumeUploadPct(0);
    try {
      let resumeKey = '';
      if (applyForm.resume) resumeKey = await uploadResumeFile(applyForm.resume, setResumeUploadPct);
      await submitApplication({
        jobId: applyModal.item.contentId,
        jobTitle: applyModal.item.title,
        company: applyModal.item.company || '',
        companyId: applyModal.item.author || undefined,
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
      if (userId && created?.contentId) loadMyJobs();
      setPostSubmitted(true);
    } catch {
      setPostSubmitError(true);
    } finally {
      setPostSubmitting(false);
    }
  };

  const categories = useMemo(() => Array.from(new Set(items.map(i => i.category || 'General').filter(Boolean))), [items]);
  const jobTypeCounts = useMemo(() => {
    const m: Record<string, number> = {};
    items.forEach(i => { const t = i.platform || 'Full-Time'; m[t] = (m[t] || 0) + 1; });
    return m;
  }, [items]);
  const topJobTypes = Object.keys(jobTypeCounts);

  const filtered = useMemo(() => {
    let list = items;
    if (category !== 'All') list = list.filter(i => (i.category || 'General') === category);
    if (selTypes.length) list = list.filter(i => selTypes.includes(i.platform || 'Full-Time'));
    if (newOnly) list = list.filter(i => isRecent(i.createdAt));
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(i => i.title.toLowerCase().includes(q) || (i.company || '').toLowerCase().includes(q) || (i.location || '').toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }, [items, category, selTypes, newOnly, search]);

  const toggleType = (t: string) => setSelTypes(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t]);
  const resetFilters = () => { setCategory('All'); setSelTypes([]); setNewOnly(false); setSearch(''); };
  const newCount = items.filter(i => isRecent(i.createdAt)).length;
  const activeCount = (category !== 'All' ? 1 : 0) + selTypes.length + (newOnly ? 1 : 0);

  const stats: [string, number, any][] = [
    ['Active Listings', items.length, Briefcase],
    ['Categories', categories.length, Tag],
    ['Job Types', topJobTypes.length, Building2],
    ['New This Month', newCount, CalendarDays],
  ];

  return (
    <div style={PAGE_BG} className="min-h-screen">
      <div className="mt-[108px]" />

      <section aria-label="Job listing statistics" className="flex min-h-[77px] flex-wrap items-center gap-3 bg-[#07130f] px-3 py-2 text-white sm:px-6">
        {stats.map(([label, value, Icon]) => (
          <div key={label} className="flex w-[calc(50%-0.5rem)] shrink-0 items-center gap-2 border-r border-yellow-500/25 pr-2 sm:w-[calc(33.333%-0.7rem)] xl:w-auto xl:min-w-[130px] 2xl:min-w-[150px]">
            <Icon className="size-7 shrink-0 text-yellow-400" />
            <span className="flex flex-col"><small className="text-[10px] leading-tight">{label}</small><strong className="text-lg leading-tight text-yellow-300">{value.toLocaleString('en-IN')}</strong></span>
          </div>
        ))}
        <div className="min-w-[220px] shrink-0 border-l border-yellow-500/25 pl-4">
          <strong className="block text-sm leading-tight text-yellow-300">India&rsquo;s #1 Drone|GIS|AI Job Board</strong>
          <span className="block text-[11px] text-sky-300">Rs.25K – Rs.1L+ monthly salary range</span>
        </div>
      </section>

      <section style={PAGE_BG} className="flex flex-wrap items-center gap-2 px-3 py-3 sm:px-6">
        <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1">
          <button type="button" onClick={() => setSidebarOpen(true)} className={`${BTN} flex shrink-0 items-center gap-1 text-xs lg:hidden`}>Filters <ChevronDown className="size-4" /></button>
          {['Job Type', 'Category', 'New Listings'].map(label => (
            <button key={label} type="button" onClick={() => setSidebarOpen(true)} className={`${BTN} hidden shrink-0 items-center gap-4 text-xs lg:flex`}>{label} <ChevronDown className="size-4" /></button>
          ))}
        </div>
        <label className="flex h-10 w-full items-center overflow-hidden rounded-lg border border-slate-200 bg-white md:w-[min(100%,360px)]">
          <span className="sr-only">Search jobs</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search jobs, companies, locations..." className="min-w-0 flex-1 px-3 text-sm outline-none" />
          <span className="flex h-full w-11 items-center justify-center bg-[#ffdf00]"><Search className="size-5" /></span>
        </label>
        {userId ? (
          <button onClick={() => { setPostJobForm({ ...EMPTY_POST, company: companies[0]?.companyName || '' }); setPostSubmitted(false); setPostSubmitError(false); setPostJobModal(true); }}
            className="flex h-10 shrink-0 items-center gap-1.5 rounded-lg bg-[#ffdf00] px-4 text-sm font-extrabold text-black">
            <Plus className="size-4" /> Post a Job
          </button>
        ) : (
          <a href="/login" className="flex h-10 shrink-0 items-center rounded-lg bg-[#ffdf00] px-4 text-sm font-extrabold text-black">Login to Post</a>
        )}
      </section>

      <main className="mx-auto grid max-w-[2100px] grid-cols-1 items-start gap-3 px-3 py-4 sm:px-6 lg:grid-cols-[255px_minmax(0,1fr)]">
        <aside className={`${sidebarOpen ? 'fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4 lg:static lg:z-auto lg:bg-transparent lg:p-0' : 'hidden'} self-start lg:block`}>
          <div className={sidebarOpen ? 'mx-auto max-w-sm rounded-xl border border-yellow-300 bg-[#fffef0] p-4 shadow-sm lg:mx-0 lg:max-w-none' : 'rounded-xl border border-yellow-300 bg-[#fffef0] p-4 shadow-sm'}>
            <div className="mb-4 flex items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <h2 className="flex items-center gap-2 text-lg font-extrabold"><Filter className="size-5 text-yellow-500" /> Filters</h2>
              <button type="button" onClick={() => { resetFilters(); setSidebarOpen(false); }} className="text-xs font-bold text-blue-800">Clear All</button>
            </div>

            <section className="mb-4 border-b border-slate-200 pb-3">
              <h3 className="mb-3 text-xs font-extrabold">JOB CATEGORY</h3>
              <div className="flex flex-wrap gap-2">
                {['All', ...categories].map(cat => (
                  <button key={cat} type="button" onClick={() => setCategory(cat)} className={`rounded-full border px-3 py-1.5 text-[11px] ${category === cat ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white hover:border-yellow-500'}`}>{cat}</button>
                ))}
              </div>
            </section>

            {topJobTypes.length > 0 && (
              <section className="mb-4 border-b border-slate-200 pb-3">
                <h3 className="mb-3 text-xs font-extrabold">JOB TYPE</h3>
                <div className="space-y-2">
                  {topJobTypes.map(t => (
                    <label key={t} className="flex cursor-pointer items-center gap-2 text-xs">
                      <input type="checkbox" checked={selTypes.includes(t)} onChange={() => toggleType(t)} className="accent-amber-500" />
                      {t} ({jobTypeCounts[t]})
                    </label>
                  ))}
                </div>
              </section>
            )}

            <section className="mb-4 border-b border-slate-200 pb-3">
              <h3 className="mb-3 text-xs font-extrabold">LISTED</h3>
              <label className="flex cursor-pointer items-center gap-2 text-xs">
                <input type="checkbox" checked={newOnly} onChange={() => setNewOnly(v => !v)} className="accent-amber-500" />
                New this month ({newCount})
              </label>
            </section>

            <button type="button" onClick={() => setSidebarOpen(false)} className="w-full rounded-lg bg-yellow-400 py-2 text-xs font-bold">Apply Filters</button>
            <button type="button" onClick={resetFilters} className="mt-2 w-full rounded-lg border bg-white py-2 text-xs font-bold">Reset Filters</button>
          </div>
        </aside>

        <section className="min-w-0 space-y-8">
          <div>
            <div className="mb-3 flex items-center justify-between gap-2">
              <h1 className="text-base font-extrabold">Drone, GIS &amp; AI Job Listings</h1>
              <div className="flex gap-1">
                <button type="button" onClick={() => setView('grid')} aria-label="Grid view" className={`${view === 'grid' ? 'bg-slate-900 text-white' : 'bg-white'} rounded border px-2 py-1`}><Grid3x3 className="size-4" /></button>
                <button type="button" onClick={() => setView('list')} aria-label="List view" className={`${view === 'list' ? 'bg-slate-900 text-white' : 'bg-white'} rounded border px-2 py-1`}><List className="size-4" /></button>
              </div>
            </div>

            {loading ? (
              <p className="rounded-lg bg-white p-8 text-center">Loading jobs...</p>
            ) : filtered.length === 0 ? (
              <p className="rounded-lg bg-white p-8 text-center">No jobs found.</p>
            ) : (
              <div className={`grid gap-3 ${view === 'list' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'}`}>
                {withInlineAds(filtered, item => (
                  <JobCardV2 key={item.contentId} job={item} onView={() => setDetailModal(item)} onApply={() => openApply(item)} />
                ))}
              </div>
            )}
          </div>

          <AdDetailBanner />

          <div>
            <h2 className="mb-5 flex items-center gap-3 text-lg font-bold text-slate-900 after:h-0.5 after:flex-1 after:bg-slate-200 after:content-['']">
              <span className="rounded bg-yellow-400 px-2 py-0.5 text-xs font-bold text-slate-900">Salary</span>
              Salary Guide — India 2026 Verified Data
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {salaryGuide.map((g, i) => (
                <div key={i} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-1 text-xl font-extrabold text-amber-600">{g.range}</div>
                  <div className="mb-2 text-sm font-bold text-slate-900">{g.level}</div>
                  <p className="text-xs leading-relaxed text-slate-500">{g.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {myJobs.length > 0 && (
            <div>
              <h2 className="mb-4 flex items-center gap-3 text-lg font-bold text-slate-900 after:h-0.5 after:flex-1 after:bg-slate-200 after:content-['']">
                <span className="rounded bg-yellow-400 px-2 py-0.5 text-xs font-bold text-slate-900">My</span>
                My Posted Jobs
              </h2>
              <div className="space-y-2">
                {myJobs.map(j => (
                  <div key={j.contentId} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-50"><Briefcase className="size-4 text-amber-600" /></div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{j.title}</p>
                        <p className="text-xs text-slate-500">Submitted {new Date(j.createdAt).toLocaleDateString('en-IN')} · {j.isPublished ? 'Live on Job Board' : 'Pending admin review'}</p>
                      </div>
                    </div>
                    {j.isPublished
                      ? <span className="shrink-0 rounded bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">Live</span>
                      : <span className="shrink-0 rounded bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">Pending</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      <div className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-4 rounded-xl bg-slate-900 p-6 md:flex-row md:items-center">
          <div>
            <h3 className="mb-1 text-base font-bold text-white">Post a Job on DroneTv.in</h3>
            <p className="max-w-lg text-sm text-white/60">
              Hiring drone pilots, GIS analysts, geospatial engineers, survey/mapping specialists, AI/computer-vision engineers, UAV instructors, or operations staff? Reach 39,890 certified pilots across India.
            </p>
            <p className="mt-1 text-xs text-white/40">Brand and Expand subscribers post unlimited jobs as part of their package.</p>
          </div>
          <div className="flex shrink-0 gap-3">
            {userId ? (
              <button onClick={() => { setPostJobForm({ ...EMPTY_POST, company: companies[0]?.companyName || '' }); setPostSubmitted(false); setPostSubmitError(false); setPostJobModal(true); }}
                className="flex items-center gap-2 rounded-lg bg-yellow-400 px-4 py-2 text-sm font-bold text-slate-900 transition-colors hover:bg-yellow-300">
                <Plus className="size-4" /> Post a Job
              </button>
            ) : (
              <a href="/login" className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-bold text-slate-900 transition-colors hover:bg-yellow-300">Login to Post a Job</a>
            )}
            <a href="/professionals/pilot-directory" className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10">Browse Pilot Profiles</a>
          </div>
        </div>
      </div>

      {/* DETAIL MODAL - real content only (title/company/location/category/
          job type/salary/description/posted date), no fabricated fields */}
      {detailModal && (
        <div onClick={() => setDetailModal(null)} className="fixed inset-0 z-[10000000] flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div onClick={e => e.stopPropagation()} className="w-full max-w-lg rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h2 className="text-base font-bold text-slate-900">Job Details</h2>
              <button onClick={() => setDetailModal(null)}><X className="size-5 text-slate-400" /></button>
            </div>
            <div className="space-y-3 px-6 py-5">
              <h3 className="text-xl font-extrabold text-slate-900">{detailModal.title}</h3>
              {detailModal.company && <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-700"><Building2 className="size-4" />{detailModal.company}</p>}
              {detailModal.location && <p className="flex items-center gap-1.5 text-sm text-slate-500"><MapPin className="size-4" />{detailModal.location}</p>}
              <div className="flex flex-wrap gap-2 pt-1">
                {detailModal.category && <span className="rounded bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700">{detailModal.category}</span>}
                {detailModal.platform && <span className="rounded bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">{detailModal.platform}</span>}
              </div>
              {detailModal.salary && <p className="flex items-center gap-1.5 text-lg font-extrabold text-slate-900"><IndianRupee className="size-4" />{detailModal.salary}</p>}
              {detailModal.description && <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">{detailModal.description}</p>}
              <button onClick={() => { setDetailModal(null); openApply(detailModal); }} className="mt-2 w-full rounded-lg bg-red-600 py-2.5 text-sm font-bold text-white">
                <Send className="mr-1.5 inline size-4" />Apply Now
              </button>
            </div>
          </div>
        </div>
      )}

      {postJobModal && (
        <div className="fixed inset-0 z-[10000000] flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="my-auto w-full max-w-lg rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h2 className="flex items-center gap-2 text-base font-bold text-slate-900"><Briefcase className="size-4 text-amber-600" />Post a Job</h2>
              <button onClick={() => setPostJobModal(false)}><X className="size-5 text-slate-400" /></button>
            </div>
            <div className="px-6 py-5">
              {!postSubmitted ? (
                <form onSubmit={handlePostJob} className="space-y-4">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700">Job Title *</label>
                    <input type="text" required value={postJobForm.title} onChange={e => setPostJobForm(f => ({ ...f, title: e.target.value }))}
                      placeholder="e.g. Agriculture Drone Pilot" className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-amber-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-700">Company Name *</label>
                      {companies.length > 0 ? (
                        <select required value={postJobForm.company} onChange={e => setPostJobForm(f => ({ ...f, company: e.target.value }))}
                          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-amber-500">
                          <option value="">Select your company</option>
                          {companies.map(c => <option key={c.publishedId} value={c.companyName}>{c.companyName}</option>)}
                        </select>
                      ) : (
                        <input type="text" required value={postJobForm.company} onChange={e => setPostJobForm(f => ({ ...f, company: e.target.value }))}
                          placeholder="Your company" className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-amber-500" />
                      )}
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-700">Location</label>
                      <input type="text" value={postJobForm.location} onChange={e => setPostJobForm(f => ({ ...f, location: e.target.value }))}
                        placeholder="e.g. Hyderabad" className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-amber-500" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-700">Category</label>
                      <select value={postJobForm.category} onChange={e => setPostJobForm(f => ({ ...f, category: e.target.value }))}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-amber-500">
                        <option value="">Select category</option>
                        {JOB_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-700">Job Type</label>
                      <select value={postJobForm.jobType} onChange={e => setPostJobForm(f => ({ ...f, jobType: e.target.value }))}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-amber-500">
                        {['Full-Time', 'Part-Time', 'Contract', 'Internship'].map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700">Salary / Compensation</label>
                    <input type="text" value={postJobForm.salary} onChange={e => setPostJobForm(f => ({ ...f, salary: e.target.value }))}
                      placeholder="e.g. Rs. 40,000–60,000/mo" className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-amber-500" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700">Job Description</label>
                    <textarea rows={3} value={postJobForm.description} onChange={e => setPostJobForm(f => ({ ...f, description: e.target.value }))}
                      placeholder="Describe the role, requirements, and responsibilities..." className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-amber-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-700">Job Image URL <span className="font-normal text-slate-400">(optional)</span></label>
                      <input type="url" value={postJobForm.imageUrl} onChange={e => setPostJobForm(f => ({ ...f, imageUrl: e.target.value }))}
                        placeholder="https://example.com/image.jpg" className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-amber-500" />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-700">Application Deadline</label>
                      <input type="date" value={postJobForm.applicationDeadline} onChange={e => setPostJobForm(f => ({ ...f, applicationDeadline: e.target.value }))}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-amber-500" />
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">Your job will be reviewed by DroneTv team before going live on the job board.</p>
                  {postSubmitError && <p className="text-xs font-medium text-red-600">Submission failed. Please check your connection and try again.</p>}
                  <button type="submit" disabled={postSubmitting} className="w-full rounded-lg bg-yellow-400 py-3 text-sm font-bold text-slate-900 transition-colors hover:bg-yellow-300 disabled:opacity-50">
                    {postSubmitting ? 'Submitting...' : 'Submit Job Listing'}
                  </button>
                </form>
              ) : (
                <div className="py-6 text-center">
                  <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-green-100"><span className="text-2xl">✓</span></div>
                  <h3 className="mb-2 font-bold text-slate-900">Job Submitted!</h3>
                  <p className="mb-4 text-sm text-slate-500">Your job listing is pending review. It will appear on the job board once approved.</p>
                  <button onClick={() => setPostJobModal(false)} className="rounded-lg bg-yellow-400 px-6 py-2 text-sm font-bold text-slate-900 hover:bg-yellow-300">Close</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {applyModal.open && (
        <div className="fixed inset-0 z-[10000000] flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="w-full max-w-md rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h2 className="text-base font-bold text-slate-900">Apply for this Role</h2>
              <button onClick={closeApply}><X className="size-5 text-slate-400" /></button>
            </div>
            <div className="px-6 py-5">
              {!submitted ? (
                <>
                  <p className="mb-1 text-sm font-semibold text-slate-700">{applyModal.item?.title}</p>
                  {applyModal.item?.company && <p className="mb-4 text-xs text-slate-500">{applyModal.item.company}</p>}
                  <form onSubmit={handleApply} className="space-y-4">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-700">Full Name *</label>
                      <input type="text" required value={applyForm.name} onChange={e => setApplyForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Your full name" className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-amber-500" />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-700">Email *</label>
                      <input type="email" required value={applyForm.email} onChange={e => setApplyForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="Your email address" className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-amber-500" />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-700">Phone *</label>
                      <input type="tel" required value={applyForm.phone} onChange={e => setApplyForm(f => ({ ...f, phone: e.target.value }))}
                        placeholder="+91 XXXXX XXXXX" className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-amber-500" />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-700">Brief message / experience</label>
                      <textarea rows={3} value={applyForm.message} onChange={e => setApplyForm(f => ({ ...f, message: e.target.value }))}
                        placeholder="Tell us briefly about your experience..." className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-amber-500" />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-700">Resume <span className="font-normal text-slate-400">(optional, PDF)</span></label>
                      <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-slate-300 px-3 py-2.5 text-sm text-slate-500 hover:border-amber-500">
                        <Paperclip className="size-4 shrink-0" />
                        <span className="truncate">{applyForm.resume ? applyForm.resume.name : 'Upload your resume'}</span>
                        <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={e => setApplyForm(f => ({ ...f, resume: e.target.files?.[0] || null }))} />
                      </label>
                    </div>
                    {submitError && <p className="text-xs font-medium text-red-600">Submission failed. Please check your connection and try again.</p>}
                    <button type="submit" disabled={submitting} className="w-full rounded-lg bg-yellow-400 py-3 text-sm font-bold text-slate-900 transition-colors hover:bg-yellow-300 disabled:opacity-50">
                      {submitting ? (applyForm.resume && resumeUploadPct < 100 ? `Uploading resume... ${resumeUploadPct}%` : 'Submitting...') : 'Submit Application'}
                    </button>
                  </form>
                </>
              ) : (
                <div className="py-4 text-center">
                  <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-green-100"><span className="text-2xl">✓</span></div>
                  <h3 className="mb-2 font-bold text-slate-900">Application Submitted!</h3>
                  <p className="text-sm text-slate-500">We'll review your application and get back to you at {applyForm.email}.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <footer className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 bg-yellow-400 px-4 py-5 text-center text-sm font-semibold text-black lg:justify-between lg:px-6 lg:text-left">
        <strong>📣 Drone TV Expo 2026 - India&rsquo;s Biggest Drone Event</strong><span className="hidden lg:inline">│</span>
        <span>India&rsquo;s Drone Industry Platform</span><span className="hidden lg:inline">│</span>
        <span>Explore verified drone products &amp; services</span><span className="hidden lg:inline">│</span>
        <span>Connect │ Collaborate │ Grow</span>
      </footer>
    </div>
  );
}

// jobCard() - matches the reference's card anatomy (ribbon badge, heart,
// photo, company line, 3-stat row, salary, buttons). No fabricated
// experience/education/work-mode/skill-tags - see file-top note.
const JobCardV2: React.FC<{ job: MediaItem; onView: () => void; onApply: () => void }> = ({ job, onView, onApply }) => {
  const icon = catIcon(job.category || 'General');
  const [imgErr, setImgErr] = useState(false);
  const [liked, setLiked] = useState(false);
  const showImg = job.imageUrl && !imgErr;
  const since = listedMonth(job.createdAt);
  const isNew = isRecent(job.createdAt);

  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-lg">
      <div className="relative h-40 shrink-0 overflow-hidden bg-slate-100">
        {showImg ? (
          <img src={job.imageUrl} alt={job.title} loading="lazy" onError={() => setImgErr(true)} className="h-full w-full object-cover object-center" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-5xl">{icon}</div>
        )}
        {isNew && <span className="absolute left-3 top-3 rounded bg-red-600 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-white shadow">New</span>}
        <button type="button" onClick={e => { e.stopPropagation(); setLiked(v => !v); }} aria-label={`Save ${job.title}`} aria-pressed={liked} className={`absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white shadow ${liked ? 'text-red-600' : 'text-red-500'}`}>
          <Heart className="size-4" fill={liked ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="min-w-0 cursor-pointer" onClick={onView}>
          <h3 className="truncate text-base font-extrabold leading-tight text-slate-900">{job.title}</h3>
          {job.company && <p className="flex items-center gap-1 truncate text-sm text-slate-500"><Building2 className="size-3.5 shrink-0" />{job.company}</p>}
        </div>

        {job.location && <p className="flex items-center gap-1 text-xs text-slate-500"><MapPin className="size-3.5 shrink-0" />{job.location}</p>}

        <div className="grid grid-cols-3 gap-1.5 border-y border-slate-100 py-2.5">
          <div className="flex min-w-0 items-center gap-1.5">
            <Tag className="size-4 shrink-0 text-slate-400" />
            <span className="min-w-0 leading-tight">
              <strong className="block truncate text-xs font-bold text-slate-900">{job.category || 'General'}</strong>
              <small className="block truncate text-[10px] text-slate-500">Category</small>
            </span>
          </div>
          <div className="flex min-w-0 items-center gap-1.5">
            <Briefcase className="size-4 shrink-0 text-slate-400" />
            <span className="min-w-0 leading-tight">
              <strong className="block truncate text-xs font-bold text-slate-900">{job.platform || 'Full-Time'}</strong>
              <small className="block truncate text-[10px] text-slate-500">Job Type</small>
            </span>
          </div>
          {since && (
            <div className="flex min-w-0 items-center gap-1.5">
              <CalendarDays className="size-4 shrink-0 text-slate-400" />
              <span className="min-w-0 leading-tight">
                <strong className="block truncate text-xs font-bold text-slate-900">{since}</strong>
                <small className="block truncate text-[10px] text-slate-500">Listed</small>
              </span>
            </div>
          )}
        </div>

        <p className="line-clamp-2 min-h-9 text-xs leading-[18px] text-slate-600">{job.description || 'No description available.'}</p>

        <div className="mt-auto flex items-center gap-1.5 pt-1">
          <IndianRupee className="size-3.5 shrink-0 text-slate-400" />
          <strong className="text-sm font-extrabold text-slate-900">{job.salary || 'Salary not disclosed'}</strong>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={e => { e.stopPropagation(); onView(); }} className="rounded-lg border border-slate-300 bg-white py-2 text-xs font-bold text-slate-900"><Eye className="mr-1 inline size-3.5" />View Details</button>
          <button type="button" onClick={e => { e.stopPropagation(); onApply(); }} className="rounded-lg bg-red-600 py-2 text-xs font-bold text-white"><Send className="mr-1 inline size-3.5" />Apply Now</button>
        </div>
      </div>
    </article>
  );
};
