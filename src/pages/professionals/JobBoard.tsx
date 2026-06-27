import { useState, useEffect } from 'react';
import { MapPin, ExternalLink, Search, Briefcase } from 'lucide-react';
import { fetchContent, MediaItem } from '../../lib/mediaApi';

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
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

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
                      {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="w-14 h-14 rounded-lg object-cover flex-shrink-0 border border-gray-100" />}
                      <div className="min-w-0">
                        {item.category && <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded mb-1 inline-block">{item.category}</span>}
                        <h3 className="text-sm font-bold text-gray-900">{item.title}</h3>
                        {item.company && <p className="text-xs text-gray-500">{item.company}{item.location ? ` · ${item.location}` : ''}</p>}
                        {item.description && <p className="text-xs text-gray-400 mt-1 line-clamp-2">{item.description}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {item.salary && <span className="text-sm font-bold text-gray-700">{item.salary}</span>}
                      {item.platform && <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded">{item.platform}</span>}
                      {item.externalLink ? (
                        <a href={item.externalLink} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-yellow-600 hover:text-yellow-700 flex items-center gap-1">
                          Apply <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <a href="mailto:bd@dronetv.in" className="text-xs font-bold text-yellow-600 hover:text-yellow-700">Apply →</a>
                      )}
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

        <div className="bg-zinc-900 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-white text-base mb-1">Post a Job on DroneTv.in</h3>
            <p className="text-sm text-white/60 max-w-lg">
              Hiring drone pilots, GIS analysts, geospatial engineers, survey/mapping specialists, AI/computer-vision engineers, UAV instructors, or operations staff? Reach 39,890 certified pilots across India.
            </p>
            <p className="text-xs text-white/40 mt-1">Scale and Brand subscribers post unlimited jobs as part of their package.</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <a href="mailto:bd@dronetv.in?subject=Post a Job"
              className="px-4 py-2 bg-yellow-400 text-black text-sm font-bold rounded-lg hover:bg-yellow-300 transition-colors">
              Post a Job
            </a>
            <a href="/professionals/pilot-directory"
              className="px-4 py-2 border border-white/20 text-white text-sm font-semibold rounded-lg hover:bg-white/10 transition-colors">
              Browse Pilot Profiles
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
