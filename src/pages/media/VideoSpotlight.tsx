import { useState, useEffect } from 'react';
import { fetchContent, MediaItem } from '../../lib/mediaApi';
import CompactHero from '../../components/common/CompactHero';
import { withInlineAds, AdSidebarRail } from '../../components/common/adCreatives';
import PostContentCTA from '../../components/common/PostContentCTA';
import PagePlacementSlot from '../../components/common/PagePlacementSlot';

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
    <div className="flex flex-col bg-surface-card rounded-xl border border-ink-light shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="relative w-full flex-shrink-0" style={{ paddingTop: '56.25%' }}>
        {playing && embedUrl ? (
          <iframe
            src={`${embedUrl}?autoplay=1`}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div
            className="absolute inset-0 bg-ink cursor-pointer"
            onClick={() => embedUrl && setPlaying(true)}
          >
            {thumb ? (
              <img src={thumb} alt={item.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-10 h-10 bg-brand-yellow rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-ink ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            )}
            {embedUrl && (
              <div className="absolute inset-0 flex items-center justify-center bg-ink/30 hover:bg-ink-charcoal/20 transition-colors">
                <div className="w-12 h-12 bg-brand-yellow rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-ink ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        {item.category && (
          <span className="bg-brand-gold/15 text-brand-gold text-xs font-bold px-2 py-0.5 rounded mb-2 inline-block self-start">{item.category}</span>
        )}
        <h3 className="text-sm font-bold text-ink leading-snug mb-1 line-clamp-2">{item.title}</h3>
        {item.description && <p className="text-xs text-ink-caption mb-3 line-clamp-3">{item.description}</p>}
        {item.externalLink && (
          <a href={item.externalLink} target="_blank" rel="noopener noreferrer"
            className="mt-auto pt-2 text-xs font-bold text-brand-gold hover:text-brand-yellow transition-colors">
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
    <div className="pt-[104px] min-h-screen bg-ink-offwhite">
      <CompactHero
        title={<>DroneTv <span>Video Spotlight</span></>}
        stats={[
          { n: items.length || '50+', l: 'Interviews' },
          { n: '5M+', l: 'Views' },
        ]}
      />

      <div className="max-w-6xl mx-auto px-6 py-8 lg:flex lg:items-start lg:gap-6">
        <div className="flex-1 min-w-0 space-y-8">
        <PagePlacementSlot slotId="media-video" aspect="4/1" minHeight={90} className="w-full" />

        <div className="flex flex-wrap gap-2">
          {categories.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
                activeFilter === f
                  ? 'bg-brand-yellow border-brand-yellow text-ink'
                  : 'border-ink-light text-ink-caption hover:border-brand-yellow hover:text-ink'
              }`}>
              {f}
            </button>
          ))}
        </div>

        <div>
          <h2 className="text-lg font-bold text-ink flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-ink-light after:content-['']">
            <span className="bg-brand-yellow text-ink text-xs font-bold px-2 py-0.5 rounded">Episodes</span>
            Video Interviews
          </h2>
          {loading ? (
            <div className="text-center py-16 text-ink-caption">Loading videos...</div>
          ) : items.length > 0 ? (
            filtered.length === 0
              ? <div className="text-center py-8 text-ink-caption">No videos in this category.</div>
              : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {withInlineAds(filtered, item => <VideoCard key={item.contentId} item={item} />)}
                </div>
          ) : (
            <div className="space-y-6">
              <p className="text-sm text-ink-caption">Drone Expo 2025 — Mumbai Interviews <span className="font-bold text-brand-gold">40+ Videos</span></p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {withInlineAds(staticVideos, v => (
                  <div key={v.id} className="flex flex-col bg-surface-card rounded-xl border border-ink-light shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                    <div className="bg-ink aspect-video flex items-center justify-center relative flex-shrink-0">
                      <span className="absolute top-2 left-2 bg-brand-yellow text-ink text-xs font-bold px-2 py-0.5 rounded">{v.ep}</span>
                      <a href={v.link} target="_blank" rel="noopener noreferrer"
                        className="w-12 h-12 bg-brand-yellow rounded-full flex items-center justify-center hover:bg-brand-yellow-soft transition-colors">
                        <svg className="w-5 h-5 text-ink ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      </a>
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <span className="bg-brand-gold/15 text-brand-gold text-xs font-bold px-2 py-0.5 rounded mb-2 inline-block self-start">{v.tag}</span>
                      <h3 className="text-sm font-bold text-ink leading-snug mb-1 line-clamp-2">{v.title}</h3>
                      <p className="text-xs text-ink-caption">{v.person} — {v.company}</p>
                      <a href={v.link} target="_blank" rel="noopener noreferrer"
                        className="mt-auto pt-2 text-xs font-bold text-brand-gold hover:text-brand-yellow block">
                        Watch on YouTube →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-brand-yellow rounded-xl p-6 flex items-center justify-between gap-4">
          <div>
            <h3 className="font-extrabold text-ink text-lg mb-1">Watch the full series on YouTube</h3>
            <p className="text-ink/70 text-sm">50+ interviews with India's drone industry leaders. New episodes added regularly.</p>
          </div>
          <a href="https://www.youtube.com/@indiadronetv" target="_blank" rel="noopener noreferrer"
            className="bg-ink text-white font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-ink-charcoal transition-colors whitespace-nowrap">
            Visit Channel →
          </a>
        </div>

          <PostContentCTA contentType="video" typeLabel="Video"
            ctaDescription="Have a drone demo, interview, or event recap video to share? Submit it for the Video Spotlight." />
        </div>
        <AdSidebarRail />
      </div>
    </div>
  );
}
