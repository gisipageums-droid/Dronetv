import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, ChevronDown, Filter, ChevronLeft, ChevronRight, Grid3x3, List, Bookmark, Eye, Share2, Copy, FileText, Tag } from 'lucide-react';
import { fetchContent, MediaItem } from '../../lib/mediaApi';

// Preview build at /media/industry-reports-v2 - same treatment as the other
// Media Hub V2 pages: real data from the press-release CMS, nothing
// fabricated. No second headline overlay (only one real title field per
// release). Views real, comments dropped - no comment system exists.

const PAGE_BG: React.CSSProperties = {
  backgroundColor: '#ffd84d',
  backgroundImage: 'radial-gradient(circle, rgba(174,139,24,0.2) 1.5px, transparent 2px)',
  backgroundSize: '56px 56px',
};
const BTN = 'rounded-lg border border-slate-200 bg-white px-3 py-2 font-semibold shadow-sm hover:border-amber-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500';

const CAT_COLORS: Record<string, string> = {
  'market report': '#0369a1', 'technology report': '#15803d', 'investment report': '#7c3aed',
  'policy & regulatory': '#dc2626', 'sector report': '#c2410c', 'global outlook': '#0e7490',
  'infrastructure report': '#15803d', 'defence & security': '#475569', 'retail tech': '#c2410c',
};
function categoryColor(cat: string): string {
  return CAT_COLORS[cat.toLowerCase()] || '#475569';
}
function fmtCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  return String(n);
}

const IndustryReportsV2: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [allReports, setAllTrends] = useState<MediaItem[]>([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(12);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    fetchContent('industry-report', controller.signal).then(setAllTrends).catch(() => setAllTrends([])).finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const categories = useMemo(() => Array.from(new Set(allReports.map(t => t.category).filter(Boolean))) as string[], [allReports]);

  const filtered = useMemo(() => {
    let list = allReports;
    if (category !== 'All') list = list.filter(t => t.category === category);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(t => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => {
      if (sortBy === 'oldest') return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      if (sortBy === 'popular') return (b.views ?? 0) - (a.views ?? 0);
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
  }, [allReports, category, search, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [totalPages, page]);
  const first = (page - 1) * perPage;
  const visible = filtered.slice(first, first + perPage);
  const resetFilters = () => { setCategory('All'); setSearch(''); setSortBy('newest'); setPage(1); };

  if (loading) return (
    <div style={PAGE_BG} className="flex min-h-screen items-center justify-center">
      <p className="text-sm font-semibold text-slate-700">Loading Industry Reports...</p>
    </div>
  );

  const stats: [string, number, any][] = [
    ['Industry Reports', allReports.length, FileText],
    ['Categories', categories.length, Tag],
  ];

  return (
    <div style={PAGE_BG} className="min-h-screen">
      <div className="mt-[108px]" />

      <section aria-label="Press release statistics" className="flex min-h-[77px] flex-wrap items-center gap-3 bg-[#07130f] px-3 py-2 text-white sm:px-6">
        {stats.map(([label, value, Icon]) => (
          <div key={label} className="flex w-[calc(50%-0.5rem)] shrink-0 items-center gap-2 border-r border-yellow-500/25 pr-2 sm:w-[calc(33.333%-0.7rem)] xl:w-auto xl:min-w-[150px]">
            <Icon className="size-7 shrink-0 text-yellow-400" />
            <span className="flex flex-col"><small className="text-[10px] leading-tight">{label}</small><strong className="text-lg leading-tight text-yellow-300">{value.toLocaleString('en-IN')}</strong></span>
          </div>
        ))}
        <div className="ml-auto min-w-[200px] shrink-0 text-right">
          <strong className="block text-sm leading-tight text-yellow-300">Drone Industry Reports</strong>
          <span className="block text-[11px] text-sky-300">Research · Analysis</span>
        </div>
      </section>

      <section style={PAGE_BG} className="flex flex-wrap items-center gap-2 px-3 py-3 sm:px-6">
        <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1">
          <button type="button" onClick={() => setSidebarOpen(true)} className={`${BTN} flex shrink-0 items-center gap-1 text-xs lg:hidden`}>Filters <ChevronDown className="size-4" /></button>
          {['Report Category', 'Sort'].map(label => (
            <button key={label} type="button" onClick={() => setSidebarOpen(true)} className={`${BTN} hidden shrink-0 items-center gap-4 text-xs lg:flex`}>{label} <ChevronDown className="size-4" /></button>
          ))}
        </div>
        <label className="flex h-10 w-full items-center overflow-hidden rounded-lg border border-slate-200 bg-white md:w-[min(100%,360px)]">
          <span className="sr-only">Search press releases</span>
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search industry reports, market analysis, white papers..." className="min-w-0 flex-1 px-3 text-sm outline-none" />
          <span className="flex h-full w-11 items-center justify-center bg-[#ffdf00]"><Search className="size-5" /></span>
        </label>
        <span className={`${BTN} hidden shrink-0 text-xs sm:block`}>Sort by</span>
        <select value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1); }} className={`${BTN} hidden shrink-0 items-center gap-4 text-xs sm:flex`}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="popular">Most viewed</option>
        </select>
      </section>

      <main className="mx-auto grid max-w-[2100px] grid-cols-1 items-start gap-3 px-3 py-4 sm:px-6 lg:grid-cols-[255px_minmax(0,1fr)]">
        <aside className={`${sidebarOpen ? 'fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4 lg:static lg:z-auto lg:bg-transparent lg:p-0' : 'hidden'} self-start lg:block`}>
          <div className={sidebarOpen ? 'mx-auto max-w-sm rounded-xl border border-yellow-300 bg-[#fffef0] p-4 shadow-sm lg:mx-0 lg:max-w-none' : 'rounded-xl border border-yellow-300 bg-[#fffef0] p-4 shadow-sm'}>
            <div className="mb-4 flex items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <h2 className="flex items-center gap-2 text-lg font-extrabold"><Filter className="size-5 text-yellow-500" /> Filters</h2>
              <button type="button" onClick={() => { resetFilters(); setSidebarOpen(false); }} className="text-xs font-bold text-blue-800">Clear All</button>
            </div>

            <section className="mb-4 border-b border-slate-200 pb-3">
              <h3 className="mb-3 text-xs font-extrabold">REPORT CATEGORY</h3>
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
            <h1 className="text-base font-extrabold">{filtered.length} Industry {filtered.length === 1 ? 'Report' : 'Reports'}</h1>
            <div className="flex gap-1">
              <button type="button" onClick={() => setView('grid')} aria-label="Grid view" className={`${view === 'grid' ? 'bg-slate-900 text-white' : 'bg-white'} rounded border px-2 py-1`}><Grid3x3 className="size-4" /></button>
              <button type="button" onClick={() => setView('list')} aria-label="List view" className={`${view === 'list' ? 'bg-slate-900 text-white' : 'bg-white'} rounded border px-2 py-1`}><List className="size-4" /></button>
            </div>
          </div>

          {visible.length === 0 ? (
            <p className="rounded-lg bg-white p-8 text-center">No industry reports found.</p>
          ) : (
            <div className={`grid gap-3 ${view === 'list' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'}`}>
              {visible.map((item, i) => (
                <ReportCardV2 key={`${item.contentId}-${i}`} item={item} onView={() => navigate(`/media/industry-reports/${item.contentId}`, { state: { item } })} />
              ))}
            </div>
          )}

          <div className="mt-5 grid min-w-0 grid-cols-1 items-center gap-4 rounded-lg px-3 py-5 sm:px-5 lg:grid-cols-[1fr_auto_1fr]">
            <strong className="text-sm">Showing {filtered.length ? first + 1 : 0}–{Math.min(first + perPage, filtered.length)} of {filtered.length.toLocaleString('en-IN')} reports</strong>
            <nav aria-label="industry reports pagination" className="flex min-w-0 flex-wrap items-center justify-center gap-1.5">
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

const ReportCardV2: React.FC<{ item: MediaItem; onView: () => void }> = ({ item, onView }) => {
  const [imgErr, setImgErr] = useState(false);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const showImg = item.imageUrl && !imgErr;
  const tags = (item.tags || []).slice(0, 3);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/media/industry-reports/${item.contentId}`;
    navigator.clipboard?.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800); }).catch(() => {});
  };

  return (
    <article onClick={onView} className="flex min-w-0 cursor-pointer flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-lg">
      <div className="relative h-44 shrink-0 overflow-hidden bg-slate-100">
        {showImg ? (
          <img src={item.imageUrl} alt={item.title} loading="lazy" onError={() => setImgErr(true)} className="h-full w-full object-cover object-center" />
        ) : (
          <div className="flex h-full w-full items-center justify-center"><FileText className="size-10 text-slate-300" /></div>
        )}
        {item.category && <span className="absolute left-3 top-3 rounded px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-white shadow" style={{ backgroundColor: categoryColor(item.category) }}>{item.category}</span>}
        <button type="button" onClick={e => { e.stopPropagation(); setLiked(v => !v); }} aria-label={`Save ${item.title}`} aria-pressed={liked} className={`absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white shadow ${liked ? 'text-blue-700' : 'text-slate-500'}`}>
          <Bookmark className="size-4" fill={liked ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 text-sm font-extrabold leading-snug text-slate-900">{item.title}</h3>
        <p className="line-clamp-2 min-h-8 text-xs leading-[18px] text-slate-600">{item.description || 'No description available.'}</p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((t, i) => <span key={i} className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase text-blue-700">{t}</span>)}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs font-semibold text-slate-500" title="Views">
              <Eye className="size-3.5 shrink-0" />{fmtCount(item.views ?? 0)}
            </span>
            <button type="button" onClick={handleShare} aria-label="Copy report link" className="flex shrink-0 items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-700">
              {copied ? <Copy className="size-3.5" /> : <Share2 className="size-3.5" />}
            </button>
          </div>
          <Link to={`/media/industry-reports/${item.contentId}`} state={{ item }} onClick={e => e.stopPropagation()} className="flex shrink-0 items-center rounded-lg bg-yellow-400 px-3 py-1.5 text-xs font-bold text-slate-900 hover:bg-yellow-300">
            View Report →
          </Link>
        </div>
      </div>
    </article>
  );
};

export default IndustryReportsV2;
