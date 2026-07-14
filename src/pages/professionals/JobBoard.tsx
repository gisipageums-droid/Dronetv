import { useState, useEffect } from 'react';
import { MapPin, Search, X, Briefcase, Plus } from 'lucide-react';
import { fetchContent, createContent, MediaItem } from '../../lib/mediaApi';
import { useUserAuth } from '../../components/context/context';

interface ApplyForm { name: string; email: string; phone: string; message: string; }
interface PostJobForm { title: string; company: string; location: string; salary: string; category: string; jobType: string; description: string; }
const EMPTY_POST: PostJobForm = { title: '', company: '', location: '', salary: '', category: '', jobType: 'Full-Time', description: '' };
const JOB_CATEGORIES = ['Agriculture', 'Survey & GIS', 'Inspection', 'Cinematography', 'Instructor', 'Defence', 'Manufacturing', 'R&D', 'Operations'];

function getMyPostedJobs(userId: string): { contentId: string; title: string; createdAt: string }[] {
  try { return JSON.parse(localStorage.getItem(`dtv_my_jobs_${userId}`) || '[]'); } catch { return []; }
}
function saveMyPostedJob(userId: string, job: { contentId: string; title: string; createdAt: string }) {
  const existing = getMyPostedJobs(userId);
  localStorage.setItem(`dtv_my_jobs_${userId}`, JSON.stringify([job, ...existing]));
}

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
  const [applyForm, setApplyForm] = useState<ApplyForm>({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [postJobModal, setPostJobModal] = useState(false);
  const [postJobForm, setPostJobForm] = useState<PostJobForm>(EMPTY_POST);
  const [postSubmitting, setPostSubmitting] = useState(false);
  const [postSubmitted, setPostSubmitted] = useState(false);
  const [myJobs, setMyJobs] = useState(() => userId ? getMyPostedJobs(userId) : []);

  const openApply = (item: MediaItem) => {
    setApplyModal({ open: true, item });
    setApplyForm({ name: '', email: '', phone: '', message: '' });
    setSubmitted(false);
  };

  const closeApply = () => { setApplyModal({ open: false, item: null }); setSubmitted(false); };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createContent({
        contentType: 'job',
        title: `[Application] ${applyModal.item?.title ?? 'Job Application'}`,
        description: applyForm.message,
        company: applyForm.name,
        source: applyForm.email,
        author: applyForm.phone,
        category: applyModal.item?.company ?? '',
        isPublished: false,
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postJobForm.title || !postJobForm.company) return;
    setPostSubmitting(true);
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
        isPublished: false,
      });
      if (userId && created?.contentId) {
        saveMyPostedJob(userId, { contentId: created.contentId, title: postJobForm.title, createdAt: new Date().toISOString() });
        setMyJobs(getMyPostedJobs(userId));
      }
      setPostSubmitted(true);
    } catch {
      setPostSubmitted(true);
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
    <div className="pt-[104px] min-h-screen bg-gray-50">
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Professionals</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
              Drone, GIS &amp; AI <span className="text-yellow-400">Job Board</span>
            </h1>
            <p className="text-sm text-white/60 leading-relaxed max-w-lg">
              Verified drone pilot, GIS analyst, geospatial engineer, survey/mapping specialist, AI/computer-vision engineer, UAV instructor, and operations roles from companies across India.
            </p>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">20+</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Active Listings</span>
            </div>
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">Rs.25K–1L</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Monthly Salary Range</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search jobs, companies, locations..." value={search} onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-yellow-400 w-full" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${activeCategory === cat ? 'bg-yellow-400 border-yellow-400 text-black' : 'border-gray-200 text-gray-500 hover:border-yellow-400'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-12 space-y-8">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
            <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Open</span>
            Active Job Listings {items.length === 0 && 'June 2026'}
          </h2>
          {loading ? (
            <div className="text-center py-10 text-gray-400">Loading jobs...</div>
          ) : items.length > 0 ? (
            <div className="space-y-3">
              {filteredCms.map(item => (
                <div key={item.contentId} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-4 border-l-4 border-l-yellow-400">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="w-14 h-14 rounded-lg object-cover flex-shrink-0 border border-gray-100" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
                      <div className="min-w-0">
                        {item.category && <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded mb-1 inline-block">{item.category}</span>}
                        <h3 className="text-sm font-bold text-gray-900">{item.title}</h3>
                        {item.company && <p className="text-xs text-gray-500">{item.company}{item.location ? ` · ${item.location}` : ''}</p>}
                        {item.description && <p className="text-xs text-gray-400 mt-1">{item.description}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {item.salary && <span className="text-sm font-bold text-gray-700">{item.salary}</span>}
                      {item.platform && <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded">{item.platform}</span>}
                      <button onClick={() => openApply(item)} className="text-xs font-bold text-yellow-600 hover:text-yellow-700">Apply →</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredStatic.map((job, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-4 border-l-4 border-l-yellow-400">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center text-lg flex-shrink-0">{job.icon}</div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap gap-1.5 mb-1">
                          <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded">{job.category}</span>
                          <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded">{job.type}</span>
                        </div>
                        <h3 className="text-sm font-bold text-gray-900">{job.title}</h3>
                        <p className="text-xs text-gray-500">{job.company}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                          <MapPin className="w-3 h-3 flex-shrink-0" />{job.location}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-sm font-bold text-gray-700">{job.salary}</span>
                      <a href="mailto:bd@dronetv.in?subject=Job Application" className="text-xs font-bold text-yellow-600 hover:text-yellow-700">Apply →</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
            <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Salary</span>
            Salary Guide — India 2026 Verified Data
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {salaryGuide.map((g, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <div className="text-xl font-extrabold text-yellow-500 mb-1">{g.range}</div>
                <div className="text-sm font-bold text-gray-900 mb-2">{g.level}</div>
                <p className="text-xs text-gray-500 leading-relaxed">{g.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {myJobs.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-4 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
              <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">My</span>
              My Posted Jobs
            </h2>
            <div className="space-y-2">
              {myJobs.map(j => (
                <div key={j.contentId} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-yellow-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{j.title}</p>
                      <p className="text-xs text-gray-400">Submitted {new Date(j.createdAt).toLocaleDateString('en-IN')} · Pending admin review</p>
                    </div>
                  </div>
                  <span className="text-xs bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded flex-shrink-0">Pending</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-zinc-900 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-white text-base mb-1">Post a Job on DroneTv.in</h3>
            <p className="text-sm text-white/60 max-w-lg">
              Hiring drone pilots, GIS analysts, geospatial engineers, survey/mapping specialists, AI/computer-vision engineers, UAV instructors, or operations staff? Reach 39,890 certified pilots across India.
            </p>
            <p className="text-xs text-white/40 mt-1">Scale and Brand subscribers post unlimited jobs as part of their package.</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            {userId ? (
              <button onClick={() => { setPostJobForm(EMPTY_POST); setPostSubmitted(false); setPostJobModal(true); }}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black text-sm font-bold rounded-lg hover:bg-yellow-300 transition-colors">
                <Plus className="w-4 h-4" /> Post a Job
              </button>
            ) : (
              <a href="/login"
                className="px-4 py-2 bg-yellow-400 text-black text-sm font-bold rounded-lg hover:bg-yellow-300 transition-colors">
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
        <div className="fixed inset-0 z-[10000000] flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg my-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2"><Briefcase className="w-4 h-4 text-yellow-500" />Post a Job</h2>
              <button onClick={() => setPostJobModal(false)} className="p-1.5 rounded hover:bg-gray-100"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="px-6 py-5">
              {!postSubmitted ? (
                <form onSubmit={handlePostJob} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Job Title *</label>
                    <input type="text" required value={postJobForm.title} onChange={e => setPostJobForm(f => ({ ...f, title: e.target.value }))}
                      placeholder="e.g. Agriculture Drone Pilot"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-yellow-400" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Company Name *</label>
                      <input type="text" required value={postJobForm.company} onChange={e => setPostJobForm(f => ({ ...f, company: e.target.value }))}
                        placeholder="Your company"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-yellow-400" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Location</label>
                      <input type="text" value={postJobForm.location} onChange={e => setPostJobForm(f => ({ ...f, location: e.target.value }))}
                        placeholder="e.g. Hyderabad"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-yellow-400" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                      <select value={postJobForm.category} onChange={e => setPostJobForm(f => ({ ...f, category: e.target.value }))}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-yellow-400">
                        <option value="">Select category</option>
                        {JOB_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Job Type</label>
                      <select value={postJobForm.jobType} onChange={e => setPostJobForm(f => ({ ...f, jobType: e.target.value }))}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-yellow-400">
                        {['Full-Time', 'Part-Time', 'Contract', 'Freelance'].map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Salary / Compensation</label>
                    <input type="text" value={postJobForm.salary} onChange={e => setPostJobForm(f => ({ ...f, salary: e.target.value }))}
                      placeholder="e.g. Rs. 40,000–60,000/mo"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-yellow-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Job Description</label>
                    <textarea rows={3} value={postJobForm.description} onChange={e => setPostJobForm(f => ({ ...f, description: e.target.value }))}
                      placeholder="Describe the role, requirements, and responsibilities..."
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-yellow-400 resize-none" />
                  </div>
                  <p className="text-xs text-gray-400">Your job will be reviewed by DroneTv team before going live on the job board.</p>
                  <button type="submit" disabled={postSubmitting}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-sm py-3 rounded-lg transition-colors disabled:opacity-50">
                    {postSubmitting ? 'Submitting...' : 'Submit Job Listing'}
                  </button>
                </form>
              ) : (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">✓</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Job Submitted!</h3>
                  <p className="text-sm text-gray-500 mb-4">Your job listing is pending review. It will appear on the job board once approved.</p>
                  <button onClick={() => setPostJobModal(false)}
                    className="px-6 py-2 bg-yellow-400 text-black font-bold rounded-lg text-sm hover:bg-yellow-500">
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {applyModal.open && (
        <div className="fixed inset-0 z-[10000000] flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-base font-bold text-gray-900">Apply for this Role</h2>
              <button onClick={closeApply} className="p-1.5 rounded hover:bg-gray-100"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="px-6 py-5">
              {!submitted ? (
                <>
                  <p className="text-sm font-semibold text-gray-800 mb-1">{applyModal.item?.title}</p>
                  {applyModal.item?.company && <p className="text-xs text-gray-400 mb-4">{applyModal.item.company}</p>}
                  <form onSubmit={handleApply} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name *</label>
                      <input type="text" required value={applyForm.name} onChange={e => setApplyForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Your full name"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-yellow-400" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Email *</label>
                      <input type="email" required value={applyForm.email} onChange={e => setApplyForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="Your email address"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-yellow-400" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Phone *</label>
                      <input type="tel" required value={applyForm.phone} onChange={e => setApplyForm(f => ({ ...f, phone: e.target.value }))}
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-yellow-400" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Brief message / experience</label>
                      <textarea rows={3} value={applyForm.message} onChange={e => setApplyForm(f => ({ ...f, message: e.target.value }))}
                        placeholder="Tell us briefly about your experience..."
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-yellow-400 resize-none" />
                    </div>
                    <button type="submit" disabled={submitting}
                      className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-sm py-3 rounded-lg transition-colors disabled:opacity-50">
                      {submitting ? 'Submitting...' : 'Submit Application'}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">✓</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Application Submitted!</h3>
                  <p className="text-sm text-gray-500">We'll review your application and get back to you at {applyForm.email}.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
