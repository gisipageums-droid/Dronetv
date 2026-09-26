import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, ChevronDown, Filter, ChevronLeft, ChevronRight, Grid3x3, List, Heart, Newspaper, Tag, CalendarDays, Eye, X } from 'lucide-react';
import { fetchContent, MediaItem } from '../../lib/mediaApi';
import ToolbarFilterDropdown from '../../components/common/ToolbarFilterDropdown';
import ShareMenu from '../../components/common/ShareMenu';

// Preview build at /media/news-pulse-v2 - same treatment as the other V2
// pages: real data from the news CMS (contentType 'news'), nothing
// fabricated. The reference's view-count/comment-count pair (👁 1.2K,
// 💬 24) had zero real backing when this page was first built - the eye/
// view-count half is now real (MediaItem.views, a genuine per-article
// counter incremented server-side on each detail-page open, same pattern
// as professional/company profileViews - see incrementViews() in
// mediaApi.ts and the useEffect in MediaDetailPage.tsx). The comment-count
// half stays dropped: there is still no comment system anywhere in this
// backend, that's a real feature build, not a redesign tweak, and was
// explicitly out of scope when this was last discussed. Tags ARE real
// (MediaItem.tags), used for the pill row. Share is real (copies the
// article's own detail link), not decorative.

const PAGE_BG: React.CSSProperties = {
  backgroundColor: '#ffd84d',
  backgroundImage: 'radial-gradient(circle, rgba(174,139,24,0.2) 1.5px, transparent 2px)',
  backgroundSize: '56px 56px',
};
const BTN = 'rounded-lg border border-slate-200 bg-white px-3 py-2 font-semibold shadow-sm hover:border-amber-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500';

const CAT_COLORS: Record<string, string> = {
  drone: '#b45309', drones: '#b45309', gis: '#16a34a', ai: '#7c3aed', robotics: '#dc2626',
  government: '#c2410c', business: '#0369a1', research: '#0e7490', industry: '#be123c',
  agriculture: '#15803d', defence: '#475569', news: '#64748b',
};
function categoryColor(cat: string): string {
  return CAT_COLORS[cat.toLowerCase()] || '#475569';
}

function fmtDate(raw?: string): string {
  if (!raw) return '';
  const d = new Date(raw);
  if (Number.isFinite(d.getTime())) return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  return raw; // some real records store a pre-formatted string like "3 June 2026"
}
function isRecent(raw?: string): boolean {
  if (!raw) return false;
  const d = new Date(raw).getTime();
  return Number.isFinite(d) && Date.now() - d < 14 * 24 * 60 * 60 * 1000;
}

const NewsPulseV2: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [allNews, setAllNews] = useState<MediaItem[]>([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(12);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selSources, setSelSources] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    fetchContent('news', controller.signal).then(setAllNews).catch(() => setAllNews([])).finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const categories = useMemo(() => Array.from(new Set(allNews.map(n => n.category).filter(Boolean))) as string[], [allNews]);
  const topSources = useMemo(() => Array.from(new Set(allNews.map(n => n.source).filter(Boolean))) as string[], [allNews]);
  const toggleSource = (v: string) => setSelSources(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v]);

  const filtered = useMemo(() => {
    let list = allNews;
    if (category !== 'All') list = list.filter(n => n.category === category);
    if (selSources.length) list = list.filter(n => selSources.includes(n.source || ''));
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(n => n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q) || (n.source || '').toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => {
      if (sortBy === 'oldest') return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
  }, [allNews, category, selSources, search, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [totalPages, page]);
  const first = (page - 1) * perPage;
  const visible = filtered.slice(first, first + perPage);
  const resetFilters = () => { setCategory('All'); setSelSources([]); setSearch(''); setSortBy('newest'); setPage(1); };
  const recentCount = allNews.filter(n => isRecent(n.createdAt)).length;

  if (loading) return (
    <div style={PAGE_BG} className="flex min-h-screen items-center justify-center">
      <p className="text-sm font-semibold text-slate-700">Loading News Pulse...</p>
    </div>
  );

  const stats: [string, number, any][] = [
    ['Total Articles', allNews.length, Newspaper],
    ['Categories', categories.length, Tag],
    ['This Fortnight', recentCount, CalendarDays],
  ];

  return (
    <div style={PAGE_BG} className="min-h-screen">
      <div className="mt-[108px]" />

      <section aria-label="News statistics" className="flex min-h-[77px] flex-wrap items-center gap-3 bg-[#07130f] px-3 py-2 text-white sm:px-6">
        {stats.map(([label, value, Icon]) => (
          <div key={label} className="flex w-[calc(50%-0.5rem)] shrink-0 items-center gap-2 border-r border-yellow-500/25 pr-2 sm:w-[calc(33.333%-0.7rem)] xl:w-auto xl:min-w-[150px]">
            <Icon className="size-7 shrink-0 text-yellow-400" />
            <span className="flex flex-col"><small className="text-[10px] leading-tight">{label}</small><strong className="text-lg leading-tight text-yellow-300">{value.toLocaleString('en-IN')}</strong></span>
          </div>
        ))}
        <div className="ml-auto min-w-[200px] shrink-0 text-right">
          <strong className="block text-sm leading-tight text-yellow-300">Drone Industry News Pulse</strong>
          <span className="block text-[11px] text-sky-300">Updated daily · Drone, GIS &amp; AI</span>
        </div>
      </section>

      <section style={PAGE_BG} className="flex flex-wrap items-center gap-2 px-3 py-3 sm:px-6">
        <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1">
          <button type="button" onClick={() => setSidebarOpen(true)} className={`${BTN} flex shrink-0 items-center gap-1 text-xs lg:hidden`}>Filters <ChevronDown className="size-4" /></button>
          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            <ToolbarFilterDropdown label="Category" options={categories} selected={category === 'All' ? [] : [category]} onToggle={v => setCategory(v)} buttonClassName={`${BTN} flex items-center gap-4 text-xs`} />
            {topSources.length > 0 && <ToolbarFilterDropdown label="Source" options={topSources} selected={selSources} onToggle={toggleSource} buttonClassName={`${BTN} flex items-center gap-4 text-xs`} />}
          </div>
        </div>
        <label className="flex h-10 w-full items-center overflow-hidden rounded-lg border border-slate-200 bg-white md:w-[min(100%,360px)]">
          <span className="sr-only">Search news</span>
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search news on drone, GIS, AI, robotics..." className="min-w-0 flex-1 px-3 text-sm outline-none" />
          <span className="flex h-full w-11 items-center justify-center bg-[#ffdf00]"><Search className="size-5" /></span>
        </label>
        <span className={`${BTN} hidden shrink-0 text-xs sm:block`}>Sort by</span>
        <select value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1); }} className={`${BTN} hidden shrink-0 items-center gap-4 text-xs sm:flex`}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </section>

      <main className="mx-auto grid max-w-[2100px] grid-cols-1 items-start gap-3 px-3 py-4 sm:px-6 lg:grid-cols-[255px_minmax(0,1fr)]">
        <aside onClick={e => { if (e.target === e.currentTarget) setSidebarOpen(false); }} className={`${sidebarOpen ? 'fixed inset-0 z-[100000000] overflow-y-auto bg-black/50 p-4 lg:static lg:z-auto lg:bg-transparent lg:p-0' : 'hidden'} self-start lg:block`}>
          <div className={sidebarOpen ? 'mx-auto max-w-sm rounded-xl border border-yellow-300 bg-[#fffef0] p-4 shadow-sm lg:mx-0 lg:max-w-none' : 'rounded-xl border border-yellow-300 bg-[#fffef0] p-4 shadow-sm'}>
            <div className="mb-4 flex items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <h2 className="flex items-center gap-2 text-lg font-extrabold"><Filter className="size-5 text-yellow-500" /> Filters</h2>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => { resetFilters(); setSidebarOpen(false); }} className="text-xs font-bold text-blue-800">Clear All</button>
                <button type="button" onClick={() => setSidebarOpen(false)} aria-label="Close filters" className="lg:hidden"><X className="size-5 text-slate-500" /></button>
              </div>
            </div>

            <section className="mb-4 border-b border-slate-200 pb-3">
              <h3 className="mb-3 text-xs font-extrabold">NEWS CATEGORY</h3>
              <div className="flex flex-wrap gap-2">
                {['All', ...categories].map(cat => (
                  <button key={cat} type="button" onClick={() => { setCategory(cat); setPage(1); }} className={`rounded-full border px-3 py-1.5 text-[11px] ${category === cat ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white hover:border-yellow-500'}`}>{cat}</button>
                ))}
              </div>
            </section>

            <button type="button" onClick={() => setSidebarOpen(false)} className="w-full rounded-lg bg-yellow-400 py-2 text-xs font-bold">Apply Filters</button>
            <button type="button" onClick={resetFilters} className="mt-2 w-full rounded-lg border bg-white py-2 text-xs font-bold">Reset Filters</button>
          </div>
        </aside>

        <section className="min-w-0">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h1 className="text-base font-extrabold">{filtered.length} Latest News Articles</h1>
            <div className="flex gap-1">
              <button type="button" onClick={() => setView('grid')} aria-label="Grid view" className={`${view === 'grid' ? 'bg-slate-900 text-white' : 'bg-white'} rounded border px-2 py-1`}><Grid3x3 className="size-4" /></button>
              <button type="button" onClick={() => setView('list')} aria-label="List view" className={`${view === 'list' ? 'bg-slate-900 text-white' : 'bg-white'} rounded border px-2 py-1`}><List className="size-4" /></button>
            </div>
          </div>

          {visible.length === 0 ? (
            <p className="rounded-lg bg-white p-8 text-center">No news articles found.</p>
          ) : (
            <div className={`grid gap-3 ${view === 'list' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'}`}>
              {visible.map((item, i) => (
                <NewsCardV2 key={`${item.contentId}-${i}`} item={item} onRead={() => navigate(`/media/news/${item.contentId}`, { state: { item } })} />
              ))}
            </div>
          )}

          <div className="mt-5 grid min-w-0 grid-cols-1 items-center gap-4 rounded-lg px-3 py-5 sm:px-5 lg:grid-cols-[1fr_auto_1fr]">
            <strong className="text-sm">Showing {filtered.length ? first + 1 : 0}–{Math.min(first + perPage, filtered.length)} of {filtered.length.toLocaleString('en-IN')} articles</strong>
            <nav aria-label="news pagination" className="flex min-w-0 flex-wrap items-center justify-center gap-1.5">
              <button type="button" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="grid h-9 min-w-9 place-items-center rounded-md border border-amber-300 bg-white text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft className="size-4" /></button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1).reduce<(number | '...')[]>((acc, p, i, arr) => { if (i > 0 && (p as number) - (arr[i - 1] as number) > 1) acc.push('...'); acc.push(p); return acc; }, []).map((p, i) => p === '...' ? <span key={`e${i}`} className="px-1">…</span> : (
                <button key={p} type="button" onClick={() => setPage(p as number)} className={`grid h-9 min-w-9 place-items-center rounded-md border px-2 text-sm font-semibold shadow-sm ${page === p ? 'border-slate-900 bg-slate-900 text-white' : 'border-amber-300 bg-white text-slate-900 hover:bg-amber-50'}`}>{(p as number).toLocaleString('en-IN')}</button>
              ))}
              <button type="button" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="grid h-9 min-w-9 place-items-center rounded-md border border-amber-300 bg-white text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"><ChevronRight className="size-4" /></button>
            </nav>
            <label className="flex items-center gap-1 text-sm lg:justify-self-end">Show
              <select value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }} className="ml-1 rounded-md border border-amber-300 bg-white px-2 py-1.5">
                {[6, 12, 24, 48].map(size => <option key={size} value={size}>{size} per page</option>)}
              </select>
            </label>
          </div>
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

function fmtCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K`;
  return String(n);
}

// newsCard() - matches the reference's card anatomy (ribbon badge, heart,
// photo, date, title, description, tag pills, real view count, share,
// Read More). No fabricated comment count - see file-top note.
const NewsCardV2: React.FC<{ item: MediaItem; onRead: () => void }> = ({ item, onRead }) => {
  const [imgErr, setImgErr] = useState(false);
  const [liked, setLiked] = useState(false);
  const showImg = item.imageUrl && !imgErr;
  const tags = (item.tags || []).slice(0, 3);

  return (
    <article onClick={onRead} className="flex min-w-0 cursor-pointer flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-lg">
      <div className="relative h-40 shrink-0 overflow-hidden bg-slate-100">
        {showImg ? (
          <img src={item.imageUrl} alt={item.title} loading="lazy" onError={() => setImgErr(true)} className="h-full w-full object-cover object-center" />
        ) : (
          <div className="flex h-full w-full items-center justify-center"><Newspaper className="size-10 text-slate-300" /></div>
        )}
        {item.category && <span className="absolute left-3 top-3 rounded px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-white shadow" style={{ backgroundColor: categoryColor(item.category) }}>{item.category}</span>}
        <button type="button" onClick={e => { e.stopPropagation(); setLiked(v => !v); }} aria-label={`Save ${item.title}`} aria-pressed={liked} className={`absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white shadow ${liked ? 'text-red-600' : 'text-red-500'}`}>
          <Heart className="size-4" fill={liked ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        {(item.date || item.createdAt) && <p className="flex items-center gap-1 text-xs text-slate-500"><CalendarDays className="size-3.5 shrink-0" />{fmtDate(item.date || item.createdAt)}</p>}
        <h3 className="line-clamp-2 text-sm font-extrabold leading-snug text-slate-900">{item.title}</h3>
        <p className="line-clamp-2 min-h-8 text-xs leading-[18px] text-slate-600">{item.description || 'No description available.'}</p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((t, i) => <span key={i} className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase text-blue-700">{t}</span>)}
          </div>
        )}

        {item.source && <span className="truncate text-xs font-semibold text-slate-500">{item.source}</span>}

        {/* Footer row - icons left, Read More right, same line, matching
            the reference's card-footer alignment exactly (was two stacked
            rows before: icons row, then a full-width button below). */}
        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs font-semibold text-slate-500" title="Views">
              <Eye className="size-3.5 shrink-0" />{fmtCount(item.views ?? 0)}
            </span>
            <ShareMenu url={`${window.location.origin}/media/news/${item.contentId}`} title={item.title} buttonClassName="flex shrink-0 items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-700" iconClassName="size-3.5" />
          </div>
          <Link to={`/media/news/${item.contentId}`} state={{ item }} onClick={e => e.stopPropagation()} className="flex shrink-0 items-center rounded-lg bg-yellow-400 px-3 py-1.5 text-xs font-bold text-slate-900 hover:bg-yellow-300">
            Read More →
          </Link>
        </div>
      </div>
    </article>
  );
};

export default NewsPulseV2;
