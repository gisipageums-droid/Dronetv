import { useState, useEffect } from 'react';
import { fetchContent, MediaItem } from '../../lib/mediaApi';

function getYoutubeEmbed(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}

function getYoutubeThumbnail(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
  return m ? `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg` : null;
}

function VideoCard({ item }: { item: MediaItem }) {
  const [playing, setPlaying] = useState(false);
  const embedUrl = item.videoUrl ? getYoutubeEmbed(item.videoUrl) : null;
  const thumb = item.imageUrl || (item.videoUrl ? getYoutubeThumbnail(item.videoUrl) : null);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
        {playing && embedUrl ? (
          <iframe
            src={`${embedUrl}?autoplay=1`}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div
            className="absolute inset-0 bg-zinc-900 cursor-pointer"
            onClick={() => embedUrl && setPlaying(true)}
          >
            {thumb ? (
              <img src={thumb} alt={item.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            )}
            {embedUrl && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/20 transition-colors">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="p-4">
        {item.category && (
          <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-0.5 rounded mb-2 inline-block">{item.category}</span>
        )}
        <h3 className="text-sm font-bold text-gray-900 leading-snug mb-1">{item.title}</h3>
        {item.description && <p className="text-xs text-gray-500 mb-3 line-clamp-2">{item.description}</p>}
        {item.externalLink && (
          <a href={item.externalLink} target="_blank" rel="noopener noreferrer"
            className="text-xs font-bold text-yellow-600 hover:text-yellow-700 transition-colors">
            Watch on YouTube →
          </a>
        )}
      </div>
    </div>
  );
}

const staticVideos = [
  { id: 'sv1', ep: 'Ep. 19', title: 'Dev R on Building India\'s Drone Media Platform', person: 'Dev R', company: 'DroneTv.in', tag: 'DroneTv CEO', link: 'https://www.youtube.com/@indiadronetv' },
  { id: 'sv2', ep: 'Ep. 33', title: 'Sakthivelan on AI-Powered Agricultural Drone Systems', person: 'Sakthivelan', company: 'Aeroby Labs', tag: 'Agriculture Tech', link: 'https://www.youtube.com/@indiadronetv' },
  { id: 'sv3', ep: 'Ep. 38', title: 'Gowrav Reddy — Drone-Powered Precision Crop Management', person: 'Gowrav Reddy', company: 'Crop Wings', tag: 'Agriculture', link: 'https://www.youtube.com/@indiadronetv' },
  { id: 'sv4', ep: 'Ep. 14', title: 'Kiran Kakarlmudi on Survey-Grade Drone Mapping for Infrastructure', person: 'Kiran Kakarlmudi', company: 'NKI', tag: 'GIS / Survey', link: 'https://www.youtube.com/@indiadronetv' },
];

export default function VideoSpotlightPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All Videos');

  useEffect(() => {
    const controller = new AbortController();
    fetchContent('video', controller.signal).then(setItems).catch(() => {}).finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const categories = ['All Videos', ...Array.from(new Set(items.map(i => i.category).filter(Boolean))) as string[]];
  const filtered = activeFilter === 'All Videos'
    ? items
    : items.filter(i => i.category === activeFilter);

  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Media Hub</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
              DroneTv <span className="text-yellow-400 not-italic">Video Spotlight</span>
            </h1>
            <p className="text-sm text-white/60 leading-relaxed max-w-lg">
              In-depth interviews with India's top drone industry leaders, manufacturers, pilots, and policymakers.
            </p>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">{items.length || '50+'}</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Interviews</span>
            </div>
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">5M+</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Views</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <div className="flex flex-wrap gap-2">
          {categories.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
                activeFilter === f
                  ? 'bg-yellow-400 border-yellow-400 text-black'
                  : 'border-gray-200 text-gray-500 hover:border-yellow-400 hover:text-gray-900'
              }`}>
              {f}
            </button>
          ))}
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
            <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Episodes</span>
            Video Interviews
          </h2>
          {loading ? (
            <div className="text-center py-16 text-gray-400">Loading videos...</div>
          ) : items.length > 0 ? (
            filtered.length === 0
              ? <div className="text-center py-8 text-gray-400">No videos in this category.</div>
              : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filtered.map(item => <VideoCard key={item.contentId} item={item} />)}
                </div>
          ) : (
            <div className="space-y-6">
              <p className="text-sm text-gray-500">Drone Expo 2025 — Mumbai Interviews <span className="font-bold text-yellow-600">40+ Videos</span></p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {staticVideos.map(v => (
                  <div key={v.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                    <div className="bg-zinc-900 aspect-video flex items-center justify-center relative">
                      <span className="absolute top-2 left-2 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">{v.ep}</span>
                      <a href={v.link} target="_blank" rel="noopener noreferrer"
                        className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-300 transition-colors">
                        <svg className="w-5 h-5 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      </a>
                    </div>
                    <div className="p-4">
                      <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-0.5 rounded mb-2 inline-block">{v.tag}</span>
                      <h3 className="text-sm font-bold text-gray-900 leading-snug mb-1">{v.title}</h3>
                      <p className="text-xs text-gray-500">{v.person} — {v.company}</p>
                      <a href={v.link} target="_blank" rel="noopener noreferrer"
                        className="mt-3 text-xs font-bold text-yellow-600 hover:text-yellow-700 block">
                        Watch on YouTube →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-yellow-400 rounded-xl p-6 flex items-center justify-between gap-4">
          <div>
            <h3 className="font-extrabold text-black text-lg mb-1">Watch the full series on YouTube</h3>
            <p className="text-black/70 text-sm">50+ interviews with India's drone industry leaders. New episodes added regularly.</p>
          </div>
          <a href="https://www.youtube.com/@indiadronetv" target="_blank" rel="noopener noreferrer"
            className="bg-black text-white font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-gray-900 transition-colors whitespace-nowrap">
            Visit Channel →
          </a>
        </div>
      </div>
    </div>
  );
}
