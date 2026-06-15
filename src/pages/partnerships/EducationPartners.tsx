import { useState, useEffect } from 'react';
import { MapPin, ExternalLink, GraduationCap } from 'lucide-react';
import { fetchContent, MediaItem } from '../../lib/mediaApi';

export default function EducationPartnersPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    fetchContent('education-partner').then(setItems).catch(console.error).finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...Array.from(new Set(items.map(i => i.category || 'General').filter(Boolean)))];
  const filtered = activeCategory === 'All' ? items : items.filter(i => (i.category || 'General') === activeCategory);

  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      <div className="bg-black text-white relative">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Partnerships</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Education <span className="text-yellow-400">Partners</span></h1>
            <p className="text-sm text-white/60 max-w-lg">DGCA approved RPTOs, universities, and training institutes developing India's next generation of drone professionals.</p>
          </div>
          <div className="flex-shrink-0">
            <span className="text-4xl font-extrabold text-yellow-400 block leading-none">{items.length}</span>
            <span className="text-xs text-white/50 font-semibold uppercase mt-1 block">Partners</span>
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
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading education partners...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No education partners listed yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(item => (
              <div key={item.contentId} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.title} className="w-full h-36 object-cover" />
                ) : (
                  <div className="w-full h-36 bg-zinc-900 flex items-center justify-center">
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
        )}
      </div>
    </div>
  );
}
