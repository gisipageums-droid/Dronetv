import { useState, useEffect } from 'react';
import { MapPin, ExternalLink, Search, Briefcase } from 'lucide-react';
import { fetchContent, MediaItem } from '../../lib/mediaApi';

export default function JobBoardPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    fetchContent('job').then(setItems).catch(console.error).finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...Array.from(new Set(items.map(i => i.category || 'General').filter(Boolean)))];

  const filtered = items.filter(i => {
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
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">Drone Industry <span className="text-yellow-400">Job Board</span></h1>
            <p className="text-sm text-white/60 leading-relaxed max-w-lg">Active job listings across India's drone sector — pilots, survey specialists, instructors, and technicians.</p>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">{items.length || '0'}</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Active Jobs</span>
            </div>
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">Hiring</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Now Open</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search jobs..." value={search} onChange={e => setSearch(e.target.value)}
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

      <div className="max-w-6xl mx-auto px-6 pb-12">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
          <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Open</span>
          Job Listings
        </h2>
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading jobs...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No job listings yet.</div>
        ) : (
          <div className="space-y-3">
            {filtered.map(item => (
              <div key={item.contentId} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-4 border-l-4 border-l-yellow-400">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    {item.category && <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded mb-1 inline-block">{item.category}</span>}
                    <h3 className="text-sm font-bold text-gray-900">{item.title}</h3>
                    {item.company && <p className="text-xs text-gray-500">{item.company}{item.location ? ` · ${item.location}` : ''}</p>}
                    {item.description && <p className="text-xs text-gray-400 mt-1 line-clamp-2">{item.description}</p>}
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
        )}
      </div>
    </div>
  );
}
