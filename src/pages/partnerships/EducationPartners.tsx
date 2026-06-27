import { useState, useEffect } from 'react';
import { MapPin, ExternalLink, GraduationCap } from 'lucide-react';
import { fetchContent, MediaItem } from '../../lib/mediaApi';

const eduStats = [
  { num: '240+', label: 'DGCA-Approved\nRPTOs' },
  { num: '39,890', label: 'Certified Remote\nPilots Feb 2026' },
  { num: '₹50K–1L', label: 'Avg. Annual\nPilot Salary' },
  { num: '5 Days', label: 'Minimum DGCA\nCertification' },
];

const eduOffers = [
  { icon: '🎓', title: 'Verified Institute Listing', desc: "Your RPTO or training institute listed on DroneTv.in's Workshops and Professionals sections — reaching students actively searching for drone training programmes across India." },
  { icon: '🏆', title: 'Competition and Achievement Coverage', desc: 'DroneTv covers major drone competitions including SAE Aerothon, SUAS, and IRoC-U. Teams from partner institutions receive editorial coverage and social media promotion for competition milestones.' },
  { icon: '📹', title: 'Faculty and Course Interviews', desc: 'Video interviews with instructors and graduates published on DroneTv YouTube and social media — building credibility and organic reach for your institution.' },
  { icon: '📝', title: 'Workshop Listings Free', desc: "Submit your drone, GIS, or AI workshops for free listing on DroneTv.in's Events section — reaching students and professionals actively planning skill upgrades." },
];

export default function EducationPartnersPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const controller = new AbortController();
    fetchContent('education-partner', controller.signal).then(setItems).catch(() => {}).finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const categories = ['All', ...Array.from(new Set(items.map(i => i.category || 'General').filter(Boolean)))];
  const filtered = activeCategory === 'All' ? items : items.filter(i => (i.category || 'General') === activeCategory);

  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Partnerships</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">Education <span className="text-yellow-400">Partners</span></h1>
            <p className="text-sm text-white/60 leading-relaxed max-w-lg">DGCA approved RPTOs, universities, and training institutes developing India's next generation of drone professionals.</p>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">{items.length || '0'}</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Partners</span>
            </div>
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">DGCA</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Approved</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-5">
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${activeCategory === cat ? 'bg-yellow-400 border-yellow-400 text-black' : 'border-gray-200 text-gray-500 hover:border-yellow-400'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-12">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
          <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">RPTO</span>
          Education Partners
        </h2>
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading education partners...</div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(item => (
              <div key={item.contentId} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.title} className="w-full h-40 object-cover" />
                ) : (
                  <div className="w-full h-40 bg-zinc-900 flex items-center justify-center">
                    <GraduationCap className="w-10 h-10 text-yellow-400" />
                  </div>
                )}
                <div className="p-4">
                  {item.category && <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-0.5 rounded mb-2 inline-block">{item.category}</span>}
                  <h3 className="text-sm font-bold text-gray-900 mb-2">{item.title}</h3>
                  {item.description && <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">{item.description}</p>}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.tags.map(tag => <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{tag}</span>)}
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    {item.location && <span className="flex items-center gap-1 text-xs text-gray-400"><MapPin className="w-3 h-3" />{item.location}</span>}
                    {item.externalLink && (
                      <a href={item.externalLink} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-yellow-600 hover:text-yellow-700 flex items-center gap-1">
                        Visit <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {eduStats.map((s, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 text-center shadow-sm">
                  <div className="text-2xl font-extrabold text-yellow-500 leading-none mb-2">{s.num}</div>
                  <div className="text-xs font-semibold text-gray-500 whitespace-pre-line">{s.label}</div>
                </div>
              ))}
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 mb-4">What DroneTv.in Offers Education Partners</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {eduOffers.map((o, i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-start gap-4">
                    <span className="text-2xl flex-shrink-0">{o.icon}</span>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm mb-1">{o.title}</h3>
                      <p className="text-xs text-gray-500 leading-relaxed">{o.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-zinc-900 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-white text-sm mb-1">Drone Academy Private Limited — DroneTv's Training Entity</h3>
                <p className="text-xs text-white/60 max-w-lg">DroneTv.in is operated by Drone Academy Private Limited, which is directly involved in drone training and certification. Education partnerships with DroneTv carry the credibility of an operating training entity — not just a media platform.</p>
              </div>
              <div className="flex gap-3 flex-shrink-0">
                <a href="/partnerships/become-a-partner" className="px-4 py-2 bg-yellow-400 text-black text-sm font-bold rounded-lg hover:bg-yellow-300 transition-colors">Apply as Education Partner</a>
                <a href="/events/workshops" className="px-4 py-2 border border-white/20 text-white text-sm font-semibold rounded-lg hover:bg-white/10 transition-colors">List Your Workshop Free →</a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
