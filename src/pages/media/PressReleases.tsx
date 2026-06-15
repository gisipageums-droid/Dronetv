import { useState, useEffect } from 'react';
import { Calendar, ExternalLink, Search } from 'lucide-react';
import { fetchContent, MediaItem } from '../../lib/mediaApi';

export default function PressReleasesPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchContent('press-release').then(setItems).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = !search ? items : items.filter(i =>
    i.title.toLowerCase().includes(search.toLowerCase()) ||
    (i.company || '').toLowerCase().includes(search.toLowerCase()) ||
    (i.source || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      <div className="bg-black text-white relative">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Media Hub</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Press <span className="text-yellow-400">Releases</span></h1>
            <p className="text-sm text-white/60 max-w-lg">Official announcements from drone companies, government bodies, and industry associations in India.</p>
          </div>
          <div className="flex-shrink-0">
            <span className="text-4xl font-extrabold text-yellow-400 block leading-none">{items.length}</span>
            <span className="text-xs text-white/50 font-semibold uppercase mt-1 block">Releases</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-5">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search press releases..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-yellow-400" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-12">
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading press releases...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No press releases yet.</div>
        ) : (
          <div className="space-y-4">
            {filtered.map(item => (
              <div key={item.contentId} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    {item.category && <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded mb-2 inline-block">{item.category}</span>}
                    <h3 className="text-base font-bold text-gray-900 mb-1">{item.title}</h3>
                    {item.description && <p className="text-sm text-gray-500 leading-relaxed mb-2">{item.description}</p>}
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      {item.company && <span className="font-semibold text-gray-700">{item.company}</span>}
                      {item.date && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{item.date}</span>}
                      {item.source && <span>{item.source}</span>}
                    </div>
                  </div>
                  {item.externalLink && (
                    <a href={item.externalLink} target="_blank" rel="noopener noreferrer"
                      className="flex-shrink-0 text-xs font-bold text-yellow-600 hover:text-yellow-700 flex items-center gap-1 border border-yellow-300 px-3 py-1.5 rounded-lg">
                      View Release <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
