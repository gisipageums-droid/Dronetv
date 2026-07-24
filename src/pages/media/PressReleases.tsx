import { useState, useEffect } from 'react';
import { Calendar, ExternalLink, Search } from 'lucide-react';
import { fetchContent, MediaItem } from '../../lib/mediaApi';
import CompactHero from '../../components/common/CompactHero';

export default function PressReleasesPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    fetchContent('press-release', controller.signal).then(setItems).catch(() => {}).finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const filtered = !search ? items : items.filter(i =>
    i.title.toLowerCase().includes(search.toLowerCase()) ||
    (i.company || '').toLowerCase().includes(search.toLowerCase()) ||
    (i.source || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      <CompactHero
        title={<>Press <span>Releases</span></>}
        stats={[
          { n: items.length || '0', l: 'Releases' },
          { n: 'Official', l: 'Sources Only' },
        ]}
      />

      <div className="max-w-6xl mx-auto px-6 py-5">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search press releases..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-yellow-400" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-12">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
          <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Latest</span>
          Press Releases
        </h2>
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading press releases...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No press releases yet.</div>
        ) : (
          <div className="space-y-4">
            {filtered.map(item => (
              <div key={item.contentId} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover" />}
                <div className="p-5 flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    {item.category && <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded mb-2 inline-block">{item.category}</span>}
                    <h3 className="text-sm font-bold text-gray-900 mb-1">{item.title}</h3>
                    {item.description && <p className="text-xs text-gray-500 leading-relaxed mb-2">{item.description}</p>}
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
