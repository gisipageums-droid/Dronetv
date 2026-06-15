import { useState, useEffect } from 'react';
import { ExternalLink, Cpu } from 'lucide-react';
import { fetchContent, MediaItem } from '../../lib/mediaApi';

export default function TechTrendsPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent('tech-trends').then(setItems).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      <div className="bg-black text-white relative">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Media Hub</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Tech <span className="text-yellow-400">Trends</span></h1>
            <p className="text-sm text-white/60 max-w-lg">Emerging technologies shaping drone capabilities — BVLOS, AI navigation, swarms, hybrid propulsion, and quantum sensors.</p>
          </div>
          <div className="flex-shrink-0">
            <span className="text-4xl font-extrabold text-yellow-400 block leading-none">{items.length}</span>
            <span className="text-xs text-white/50 font-semibold uppercase mt-1 block">Trends</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 pb-12">
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading tech trends...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No tech trends yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item, i) => (
              <div key={item.contentId} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-yellow-400 flex items-center justify-center flex-shrink-0">
                    <span className="text-black font-extrabold text-xs">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="flex-1">
                    {item.category && <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-0.5 rounded mb-2 inline-block">{item.category}</span>}
                    <h3 className="text-base font-bold text-gray-900 mb-2">{item.title}</h3>
                    {item.description && <p className="text-sm text-gray-500 leading-relaxed mb-3">{item.description}</p>}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {item.tags.map(tag => (
                          <span key={tag} className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded-full">{tag}</span>
                        ))}
                      </div>
                    )}
                    {item.externalLink && (
                      <a href={item.externalLink} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-yellow-600 hover:text-yellow-700 flex items-center gap-1">
                        Learn More <ExternalLink className="w-3 h-3" />
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
