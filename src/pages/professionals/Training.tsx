import { useState, useEffect } from 'react';
import { MapPin, ExternalLink, BookOpen } from 'lucide-react';
import { fetchContent, MediaItem } from '../../lib/mediaApi';

const pathways = [
  {
    level: 'Level 01',
    levelLabel: 'Foundation',
    icon: '🚁',
    title: 'DGCA Remote Pilot Certificate',
    desc: 'Your entry point into professional drone operations. Small category RPC covers 90%+ of commercial applications.',
    skills: ['Basic flight operations', 'DGCA regulations', 'Safety protocols', 'Mission planning', 'Emergency procedures'],
    cost: 'Rs. 50,000–80,000',
    duration: '5 Days',
    colorClass: 'border-l-green-400',
  },
  {
    level: 'Level 02',
    levelLabel: 'Specialisation',
    icon: '🗺️',
    title: 'GIS and Mapping Specialist',
    desc: 'Add geospatial skills to your pilot certificate. The highest-demand combination in India\'s commercial drone market.',
    skills: ['Photogrammetry (Pix4D / Agisoft)', 'LiDAR data processing', 'QGIS and ArcGIS', 'Survey-grade accuracy', 'Client deliverable formats'],
    cost: 'Rs. 30,000–80,000',
    duration: '15–30 Days',
    colorClass: 'border-l-blue-400',
  },
  {
    level: 'Level 03',
    levelLabel: 'Advanced',
    icon: '🌾',
    title: 'Agriculture Drone Specialist',
    desc: "Precision agriculture is India's largest and fastest-growing drone application. Specialise for premium earning.",
    skills: ['NDVI mapping and analysis', 'Precision spraying calibration', 'Crop health interpretation', 'Nozzle and spray management', 'State-specific regulations'],
    cost: 'Rs. 20,000–50,000',
    duration: '5–10 Days',
    colorClass: 'border-l-yellow-400',
  },
  {
    level: 'Level 04',
    levelLabel: 'Expert',
    icon: '🎓',
    title: 'Certified Flight Instructor',
    desc: 'Train the next generation of drone pilots at a DGCA-approved RPTO. India needs thousands more instructors.',
    skills: ['Instructor certification from DGCA', 'Curriculum development', 'Student assessment methods', 'Simulator instruction', 'RPTO quality management'],
    cost: 'DGCA approval required',
    duration: '10–15 Days',
    colorClass: 'border-l-purple-400',
  },
];

const featuredRPTOs = [
  {
    icon: '🏫',
    name: 'Drone Academy Private Limited',
    location: 'Hyderabad, Telangana',
    badge: 'DGCA Approved',
    desc: 'Operating entity behind DroneTv.in. Offers DGCA RPC training for Small and Medium category drones. Hands-on practical training with modern drone fleet.',
    tags: ['Small RPC', 'Medium RPC', 'GIS Mapping'],
  },
  {
    icon: '🏛️',
    name: 'PinakShakti Aerospace Academy',
    location: 'Multi-location | 1,200+ Pilots Certified',
    badge: 'DGCA Approved',
    desc: "One of India's leading drone pilot training academies. 1,200+ pilots certified across 8 locations. Offers job placement guidance and government-sector connections.",
    tags: ['Small RPC', 'Job Placement', 'Defence Track'],
  },
  {
    icon: '🎓',
    name: 'Manipal Skill Development Centre',
    location: 'Pan-India | University-Affiliated',
    badge: 'DGCA Approved',
    desc: 'University-affiliated training offering drone remote pilot courses with academic credibility. Strong placement network through Manipal group industry connections.',
    tags: ['Small RPC', 'Medium RPC', 'Career Mentoring'],
  },
  {
    icon: '🌾',
    name: 'Agriculture Drone Training Institutes',
    location: 'AP, Telangana, Maharashtra, Punjab',
    badge: 'DGCA Approved',
    desc: 'State-specific RPTOs focused on agriculture drone operations. Many operate in partnership with state government agriculture departments and Namo Drone Didi programme.',
    tags: ['Small RPC', 'Agri Spraying', 'NDVI Mapping'],
  },
];

export default function TrainingPage() {
  const [cmsItems, setCmsItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const controller = new AbortController();
    fetchContent('training', controller.signal).then(setCmsItems).catch(() => {}).finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const categories = cmsItems.length > 0
    ? ['All', ...Array.from(new Set(cmsItems.map(i => i.category || 'General').filter(Boolean)))]
    : ['All', 'Small Category', 'Medium Category', 'GIS Mapping', 'Agriculture'];

  const filtered = cmsItems.length > 0
    ? (activeCategory === 'All' ? cmsItems : cmsItems.filter(i => (i.category || 'General') === activeCategory))
    : [];

  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Professionals</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
              Drone Training <span className="text-yellow-400">Pathways</span> India
            </h1>
            <p className="text-sm text-white/60 leading-relaxed max-w-lg">
              From your first DGCA RPC to advanced GIS & mapping specialist, AI image-analytics operator, and flight instructor — the complete drone training ecosystem in India.
            </p>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">240+</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">DGCA-Approved RPTOs</span>
            </div>
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">4</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Career Pathways</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 pb-12 space-y-8">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
            <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Pathways</span>
            Career Training Pathways
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {pathways.map((p, i) => (
              <div key={i} className={`bg-white rounded-xl border border-gray-200 border-l-4 ${p.colorClass} shadow-sm p-5`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{p.icon}</span>
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">{p.level} — {p.levelLabel}</span>
                    <h3 className="font-bold text-gray-900 text-base leading-snug">{p.title}</h3>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">{p.desc}</p>
                <ul className="space-y-1 mb-4">
                  {p.skills.map((skill, j) => (
                    <li key={j} className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full flex-shrink-0" />
                      {skill}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-xs font-bold text-yellow-700">{p.cost}</span>
                  <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded">{p.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {!loading && cmsItems.length > 0 && (
          <div>
            <div className="flex gap-2 flex-wrap mb-5">
              {categories.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${activeCategory === cat ? 'bg-yellow-400 border-yellow-400 text-black' : 'border-gray-200 text-gray-500 hover:border-yellow-400'}`}>
                  {cat}
                </button>
              ))}
            </div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
              <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">RPTO</span>
              Training Programs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(item => (
                <div key={item.contentId} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} className="w-full h-40 object-cover" />
                  ) : (
                    <div className="w-full h-40 bg-zinc-900 flex items-center justify-center">
                      <BookOpen className="w-10 h-10 text-yellow-400" />
                    </div>
                  )}
                  <div className="p-4">
                    {item.category && <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-0.5 rounded mb-2 inline-block">{item.category}</span>}
                    <h3 className="text-sm font-bold text-gray-900 leading-snug mb-2">{item.title}</h3>
                    {item.description && <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">{item.description}</p>}
                    {item.price && <div className="text-xs font-bold text-yellow-700 mb-2">{item.price}</div>}
                    {item.location && <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1"><MapPin className="w-3 h-3" />{item.location}</div>}
                    {item.externalLink && (
                      <a href={item.externalLink} target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center gap-1 text-xs font-bold text-yellow-600 hover:text-yellow-700">
                        Enroll <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
            <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">RPTOs</span>
            Featured RPTOs on DroneTv.in
            <span className="text-xs font-normal text-gray-400">240+ Approved Nationwide</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {featuredRPTOs.map((rpto, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center text-xl flex-shrink-0">{rpto.icon}</div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-bold text-gray-900 text-sm">{rpto.name}</h3>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <MapPin className="w-3 h-3 flex-shrink-0" />{rpto.location}
                    </div>
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded mt-1 inline-block">{rpto.badge}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed mb-3">{rpto.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {rpto.tags.map((tag, j) => (
                    <span key={j} className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-white text-base mb-1">List Your RPTO on DroneTv.in</h3>
            <p className="text-sm text-white/60 max-w-lg">
              Running a DGCA-approved Remote Pilot Training Organisation? List your institute on DroneTv.in's Training section and reach prospective students actively searching for certified drone training across India.
            </p>
            <p className="text-xs text-white/40 mt-1">Free for verified RPTOs — contact us with your DGCA approval certificate.</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <a href="mailto:bd@dronetv.in?subject=List RPTO"
              className="px-4 py-2 bg-yellow-400 text-black text-sm font-bold rounded-lg hover:bg-yellow-300 transition-colors">
              List Your RPTO Free
            </a>
            <a href="/professionals/certifications"
              className="px-4 py-2 border border-white/20 text-white text-sm font-semibold rounded-lg hover:bg-white/10 transition-colors">
              Certification Guide
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
