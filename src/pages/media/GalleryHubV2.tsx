import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown, Filter, Grid3x3, List, Heart, Camera, Images } from 'lucide-react';
import { fetchContent } from '../../lib/mediaApi';

// Preview build at /media/gallery-v2 - a category-hub front page for the
// Photo Gallery, matching the reference's tile design (cover photo, photo
// count badge, description, tag pills, View Gallery button). This sits
// IN FRONT of the existing /media/gallery flat photo grid (with its real
// lightbox/upload/download/share, all untouched) rather than replacing it -
// each tile's "View Gallery" navigates there pre-filtered to that category
// via ?category=. The reference shows 8 category names (Events & Expos,
// Drones & Technology, etc.) that don't correspond to any real photo data
// here - real photos only carry 6 real categories (Events, Collaborations,
// Conferences, Interviews, Product Launches, Team Photos, from the existing
// GalleryPage.tsx), so those are what's shown, not the reference's
// fictional set. Photo counts and cover images are real, computed from the
// same data source the flat grid already uses. Per-category description
// blurbs and tag pills are hand-written category labels (like Partnerships'
// static copy), not fabricated data.

const PAGE_BG: React.CSSProperties = {
  backgroundColor: '#ffd84d',
  backgroundImage: 'radial-gradient(circle, rgba(174,139,24,0.2) 1.5px, transparent 2px)',
  backgroundSize: '56px 56px',
};

interface GalleryImage {
  id: number;
  src: string;
  title: string;
  category: string;
  tags?: string[];
}

const CATEGORY_META: Record<string, { color: string; desc: string; tags: string[] }> = {
  Events: { color: '#dc2626', desc: 'Glimpses from drone expos, conferences and industry events.', tags: ['Expos', 'Conferences', 'Summits'] },
  Collaborations: { color: '#0369a1', desc: 'Partnerships, joint ventures and cross-industry collaborations.', tags: ['Partnerships', 'Networking', 'Joint Ventures'] },
  Conferences: { color: '#15803d', desc: 'Panel discussions, keynotes and industry conference moments.', tags: ['Panels', 'Keynotes', 'Summits'] },
  Interviews: { color: '#7c3aed', desc: 'Behind-the-scenes moments from DroneTv interviews and features.', tags: ['Interviews', 'Features', 'Leaders'] },
  'Product Launches': { color: '#c2410c', desc: 'New product unveilings and technology demonstrations.', tags: ['Launches', 'Demos', 'Innovation'] },
  'Team Photos': { color: '#be123c', desc: 'Team activities, celebrations and DroneTv milestones.', tags: ['Team', 'Culture', 'Milestones'] },
};
const DEFAULT_META = { color: '#475569', desc: 'Photos from the DroneTv community and ecosystem.', tags: ['DroneTV'] };

const GalleryHubV2: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [cmsImages, setCmsImages] = useState<GalleryImage[]>([]);
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    fetchContent('gallery', controller.signal).then(items => {
      const base = Date.now();
      setCmsImages(items.map((item, i) => ({
        id: base + i,
        src: item.imageUrl || '',
        title: item.title,
        category: item.category || 'Events',
        tags: item.tags || [],
      })));
    }).catch(() => setCmsImages([])).finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const categoryTiles = useMemo(() => {
    const byCategory: Record<string, GalleryImage[]> = {};
    cmsImages.forEach(img => {
      if (!byCategory[img.category]) byCategory[img.category] = [];
      byCategory[img.category].push(img);
    });
    return Object.keys(byCategory)
      .filter(cat => byCategory[cat].length > 0)
      .map(cat => {
        const imgs = byCategory[cat];
        const meta = CATEGORY_META[cat] || DEFAULT_META;
        return { category: cat, count: imgs.length, cover: imgs[0]?.src, ...meta };
      })
      .sort((a, b) => b.count - a.count);
  }, [cmsImages]);

  const filteredTiles = useMemo(() => {
    if (!search) return categoryTiles;
    const q = search.toLowerCase();
    return categoryTiles.filter(t => t.category.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q));
  }, [categoryTiles, search]);

  if (loading) return (
    <div style={PAGE_BG} className="flex min-h-screen items-center justify-center">
      <p className="text-sm font-semibold text-slate-700">Loading Photo Gallery...</p>
    </div>
  );

  const totalPhotos = cmsImages.length;

  return (
    <div style={PAGE_BG} className="min-h-screen">
      <div className="mt-16" />

      <section aria-label="Gallery statistics" className="flex min-h-[77px] flex-wrap items-center gap-3 bg-[#07130f] px-3 py-2 text-white sm:px-6">
        <div className="flex w-[calc(50%-0.5rem)] shrink-0 items-center gap-2 border-r border-yellow-500/25 pr-2 sm:w-[calc(33.333%-0.7rem)] xl:w-auto xl:min-w-[150px]">
          <Camera className="size-7 shrink-0 text-yellow-400" />
          <span className="flex flex-col"><small className="text-[10px] leading-tight">Total Photos</small><strong className="text-lg leading-tight text-yellow-300">{totalPhotos.toLocaleString('en-IN')}</strong></span>
        </div>
        <div className="flex w-[calc(50%-0.5rem)] shrink-0 items-center gap-2 border-r border-yellow-500/25 pr-2 sm:w-[calc(33.333%-0.7rem)] xl:w-auto xl:min-w-[150px]">
          <Images className="size-7 shrink-0 text-yellow-400" />
          <span className="flex flex-col"><small className="text-[10px] leading-tight">Categories</small><strong className="text-lg leading-tight text-yellow-300">{categoryTiles.length}</strong></span>
        </div>
        <div className="ml-auto min-w-[200px] shrink-0 text-right">
          <strong className="block text-sm leading-tight text-yellow-300">DroneTv Photo Gallery</strong>
          <span className="block text-[11px] text-sky-300">Events · Community · Moments</span>
        </div>
      </section>

      <section style={PAGE_BG} className="flex flex-wrap items-center gap-2 px-3 py-3 sm:px-6">
        <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1">
          <button type="button" onClick={() => setSidebarOpen(v => !v)} className="flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold shadow-sm lg:hidden">Filters <ChevronDown className="size-4" /></button>
        </div>
        <label className="flex h-10 w-full items-center overflow-hidden rounded-lg border border-slate-200 bg-white md:w-[min(100%,360px)]">
          <span className="sr-only">Search photo galleries</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search photos, events, drone, GIS, AI, robotics..." className="min-w-0 flex-1 px-3 text-sm outline-none" />
          <span className="flex h-full w-11 items-center justify-center bg-[#ffdf00]"><Search className="size-5" /></span>
        </label>
      </section>

      <main className="mx-auto grid max-w-[2100px] grid-cols-1 items-start gap-3 px-3 py-4 sm:px-6 lg:grid-cols-[255px_minmax(0,1fr)]">
        <aside className={`${sidebarOpen ? 'fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4 lg:static lg:z-auto lg:bg-transparent lg:p-0' : 'hidden'} self-start lg:block`}>
          <div className={sidebarOpen ? 'mx-auto max-w-sm rounded-xl border border-yellow-300 bg-[#fffef0] p-4 shadow-sm lg:mx-0 lg:max-w-none' : 'rounded-xl border border-yellow-300 bg-[#fffef0] p-4 shadow-sm'}>
            <div className="mb-4 flex items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <h2 className="flex items-center gap-2 text-lg font-extrabold"><Filter className="size-5 text-yellow-500" /> Gallery Categories</h2>
              <button type="button" onClick={() => setSidebarOpen(false)} className="text-xs font-bold text-blue-800">Close</button>
            </div>
            <div className="space-y-2">
              {categoryTiles.map(t => (
                <button key={t.category} type="button" onClick={() => { navigate(`/media/gallery?category=${encodeURIComponent(t.category)}`); setSidebarOpen(false); }} className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-xs font-semibold hover:border-yellow-500">
                  {t.category}<span className="text-slate-400">{t.count}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <section className="min-w-0">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h1 className="text-base font-extrabold">{filteredTiles.length} Photo {filteredTiles.length === 1 ? 'Gallery' : 'Galleries'}</h1>
            <div className="flex gap-1">
              <button type="button" onClick={() => setView('grid')} aria-label="Grid view" className={`${view === 'grid' ? 'bg-slate-900 text-white' : 'bg-white'} rounded border px-2 py-1`}><Grid3x3 className="size-4" /></button>
              <button type="button" onClick={() => setView('list')} aria-label="List view" className={`${view === 'list' ? 'bg-slate-900 text-white' : 'bg-white'} rounded border px-2 py-1`}><List className="size-4" /></button>
            </div>
          </div>

          {filteredTiles.length === 0 ? (
            <p className="rounded-lg bg-white p-8 text-center">No galleries found.</p>
          ) : (
            <div className={`grid gap-3 ${view === 'list' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'}`}>
              {filteredTiles.map(t => (
                <GalleryTileV2 key={t.category} tile={t} onView={() => navigate(`/media/gallery?category=${encodeURIComponent(t.category)}`)} />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 bg-yellow-400 px-4 py-5 text-center text-sm font-semibold text-black lg:justify-between lg:px-6 lg:text-left">
        <strong>📣 Drone TV Expo 2026 - India&rsquo;s Biggest Drone Event</strong><span className="hidden lg:inline">│</span>
        <span>India&rsquo;s Drone Industry Platform</span><span className="hidden lg:inline">│</span>
        <span>Explore verified drone products &amp; services</span><span className="hidden lg:inline">│</span>
        <span>Connect │ Collaborate │ Grow</span>
      </footer>
    </div>
  );
};

interface Tile { category: string; count: number; cover?: string; color: string; desc: string; tags: string[] }

const GalleryTileV2: React.FC<{ tile: Tile; onView: () => void }> = ({ tile, onView }) => {
  const [imgErr, setImgErr] = useState(false);
  const [liked, setLiked] = useState(false);
  const showImg = tile.cover && !imgErr;

  return (
    <article onClick={onView} className="flex min-w-0 cursor-pointer flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-lg">
      <div className="relative h-40 shrink-0 overflow-hidden bg-slate-100">
        {showImg ? (
          <img src={tile.cover} alt={tile.category} loading="lazy" onError={() => setImgErr(true)} className="h-full w-full object-cover object-center" />
        ) : (
          <div className="flex h-full w-full items-center justify-center"><Images className="size-10 text-slate-300" /></div>
        )}
        <span className="absolute left-3 top-3 rounded px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-white shadow" style={{ backgroundColor: tile.color }}>{tile.category}</span>
        <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded bg-black/70 px-2 py-1 text-[11px] font-bold text-white"><Camera className="size-3" />{tile.count}</span>
        <button type="button" onClick={e => { e.stopPropagation(); setLiked(v => !v); }} aria-label={`Save ${tile.category}`} aria-pressed={liked} className={`absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white shadow ${liked ? 'text-red-600' : 'text-red-500'}`}>
          <Heart className="size-4" fill={liked ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-sm font-extrabold leading-snug text-slate-900">{tile.category}</h3>
        <p className="line-clamp-2 min-h-8 text-xs leading-[18px] text-slate-600">{tile.desc}</p>
        <div className="flex flex-wrap gap-1.5">
          {tile.tags.map((t, i) => <span key={i} className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase text-blue-700">{t}</span>)}
        </div>
        <button type="button" onClick={e => { e.stopPropagation(); onView(); }} className="mt-auto flex items-center justify-center gap-1 rounded-lg border border-slate-300 bg-white py-2 text-xs font-bold text-slate-900 hover:border-amber-500">
          View Gallery →
        </button>
      </div>
    </article>
  );
};

export default GalleryHubV2;
