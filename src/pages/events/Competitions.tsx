import { useState, useEffect } from 'react';
import { MapPin, Calendar, Trophy, ExternalLink } from 'lucide-react';
import { fetchContent, MediaItem } from '../../lib/mediaApi';

export default function CompetitionsPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    fetchContent('competition', controller.signal).then(setItems).catch(() => {}).finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Events</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">Drone <span className="text-yellow-400">Competitions</span></h1>
            <p className="text-sm text-white/60 max-w-lg">Racing circuits, innovation challenges, and aerial competitions for India's drone community.</p>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">{items.length || '0'}</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Competitions</span>
            </div>
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">India</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Wide</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 pb-12">
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading competitions...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No competitions listed yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map(item => (
              <div key={item.contentId} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.title} className="w-full h-40 object-cover" />
                ) : (
                  <div className="w-full h-40 bg-zinc-900 flex items-center justify-center">
                    <Trophy className="w-10 h-10 text-yellow-400" />
                  </div>
                )}
                <div className="p-4">
                  {item.category && <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2 py-0.5 rounded mb-2 inline-block">{item.category}</span>}
                  <h3 className="text-sm font-bold text-gray-900 leading-snug mb-2">{item.title}</h3>
                  {item.description && <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">{item.description}</p>}
                  {item.price && <div className="text-xs font-bold text-green-700 mb-2">{item.price}</div>}
                  <div className="space-y-1">
                    {item.date && <div className="flex items-center gap-1.5 text-xs text-gray-500"><Calendar className="w-3 h-3 flex-shrink-0" />{item.date}</div>}
                    {item.location && <div className="flex items-center gap-1.5 text-xs text-gray-500"><MapPin className="w-3 h-3 flex-shrink-0" />{item.location}</div>}
                  </div>
                  {item.externalLink && (
                    <a href={item.externalLink} target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center gap-1 text-xs font-bold text-yellow-600 hover:text-yellow-700">
                      Register <ExternalLink className="w-3 h-3" />
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
