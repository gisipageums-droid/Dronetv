import { useState, useEffect } from 'react';
import { Calendar, ExternalLink, Monitor } from 'lucide-react';
import { fetchContent, MediaItem } from '../../lib/mediaApi';

export default function WebinarsPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent('webinar').then(setItems).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      <div className="bg-black text-white relative">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Events</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Drone Industry <span className="text-yellow-400">Webinars</span></h1>
            <p className="text-sm text-white/60 max-w-lg">Online sessions with drone industry experts — regulations, agriculture economics, certification, and GIS applications.</p>
          </div>
          <div className="flex-shrink-0">
            <span className="text-4xl font-extrabold text-yellow-400 block leading-none">{items.length}</span>
            <span className="text-xs text-white/50 font-semibold uppercase mt-1 block">Webinars</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 pb-12">
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading webinars...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No webinars scheduled yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {items.map(item => (
              <div key={item.contentId} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    {item.price ? (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${item.price.toLowerCase() === 'free' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{item.price}</span>
                    ) : <span />}
                    {item.date && <span className="text-xs font-bold text-gray-500">{item.date}</span>}
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 leading-snug mb-1">{item.title}</h3>
                  {item.platform && <p className="text-xs text-gray-400 mb-3">{item.platform}</p>}
                  {item.description && <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-3">{item.description}</p>}
                  {item.source && (
                    <div className="mb-3">
                      <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Speaker</p>
                      <p className="text-xs text-gray-500">— {item.source}</p>
                    </div>
                  )}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {item.tags.map(tag => (
                        <span key={tag} className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded-full">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="border-t border-gray-100 px-5 py-3 bg-gray-50">
                  {item.externalLink ? (
                    <a href={item.externalLink} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-yellow-600 hover:text-yellow-700 flex items-center gap-1">
                      Register to Attend <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <a href="mailto:bd@dronetv.in?subject=Webinar Registration" className="text-xs font-bold text-yellow-600 hover:text-yellow-700">
                      Register to Attend →
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
