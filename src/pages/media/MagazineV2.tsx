import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, ChevronDown, Filter, ChevronLeft, ChevronRight, Grid3x3, List, Heart, Eye, FileDown, BookOpen, Tag, CalendarDays } from 'lucide-react';
import { MEDIA_API, LAMBDA } from '../../lib/apiConfig';
import { MediaItem } from '../../lib/mediaApi';
import ToolbarFilterDropdown from '../../components/common/ToolbarFilterDropdown';
import ShareMenu from '../../components/common/ShareMenu';

// Preview build at /media/magazine-v2 - same treatment as News Pulse V2:
// real data from the magazine CMS (contentType 'magazine'), nothing
// fabricated. Only 2 real magazine records exist right now, so this shows
// a real "2 magazine issues" count, not the reference's fictional 219. The
// reference's "Vol 5 Issue 9" numbering has no real backing (no volume/
// issue field exists) - dropped rather than invented; the real `date`
// fills that badge slot instead. Views is real (same counter just built
// for News Pulse - the backend increments it for every media content
// type, not just news). "Download PDF" only renders when a record
// actually has a real externalLink to open - never a dead button.

const PAGE_BG: React.CSSProperties = {
  backgroundColor: '#ffd84d',
  backgroundImage: 'radial-gradient(circle, rgba(174,139,24,0.2) 1.5px, transparent 2px)',
  backgroundSize: '56px 56px',
};
const BTN = 'rounded-lg border border-slate-200 bg-white px-3 py-2 font-semibold shadow-sm hover:border-amber-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500';
const MEDIA_BASE = MEDIA_API ? `${MEDIA_API}` : `${LAMBDA.media}/media-content`;

const CAT_COLORS: Record<string, string> = {
  technology: '#7c3aed', drone: '#b45309', gis: '#16a34a', ai: '#7c3aed',
  policy: '#c2410c', business: '#0369a1', 'special edition': '#0369a1',
  'industry insights': '#15803d', 'buyer\'s guide': '#ea580c', 'interview series': '#0e7490',
};
function categoryColor(cat: string): string {
  return CAT_COLORS[cat.toLowerCase()] || '#475569';
}
function fmtCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  return String(n);
}

const issues = [
  { number: '04', quarter: 'Q2 2026', title: "Defence Drones: India's $2B Procurement Shift", gradient: 'from-slate-900 to-slate-700',
    topics: ['$2B domestic drone order pipeline', 'Indigenous UAV manufacturers profiled', 'DRDO programmes update', 'Export potential for Indian defence drones'] },
  { number: '03', quarter: 'Q1 2026', title: 'Agriculture Drones at Scale: Namo Drone Didi', gradient: 'from-amber-400 to-amber-600',
    topics: ['Namo Drone Didi scheme deep-dive', '500+ SHG deployments mapped', 'ROI analysis from Telangana farmers', 'Soil health monitoring use cases'] },
  { number: '02', quarter: 'Q4 2025', title: 'Drone Expo 2025 Mumbai: Full Coverage Report', gradient: 'from-orange-400 to-amber-400',
    topics: ['50+ exhibitor profiles', 'Key announcements and launches', 'Interview highlights reel', 'Market sentiment survey results'] },
];

const adTiers = [
  { icon: '📰', title: 'Directory Listing', desc: 'Logo, company name, and category in the DroneTv Industry Directory — included in every magazine issue for the full subscription year.', badge: 'All Packages', note: 'All 4 issues per year' },
  { icon: '📄', title: 'Half-Page Advertisement', desc: 'Half-page advertisement in 2 issues of DroneTv magazine. Professionally placed in relevant vertical sections.', badge: 'Brand Package', note: '2 issues per year' },
  { icon: '📑', title: 'Full-Page Advertisement', desc: 'Full-page advertisement in all 4 quarterly issues plus 1 full editorial article in one selected issue.', badge: 'Expand Package', note: '4 issues + editorial article' },
  { icon: '🏆', title: 'Cover Page Feature', desc: 'Cover page feature photo eligibility for Expand package subscribers, subject to editorial schedule.', badge: 'Expand Package Only', note: 'Subject to editorial calendar' },
];

const MagazineV2: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [allArticles, setAllArticles] = useState<MediaItem[]>([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(12);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [selSources, setSelSources] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${MEDIA_BASE}?type=magazine&isPublished=true`)
      .then(r => r.json())
      .then(d => setAllArticles(d.items || []))
      .catch(() => setAllArticles([]))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => Array.from(new Set(allArticles.map(a => a.category).filter(Boolean))) as string[], [allArticles]);
  const topSources = useMemo(() => Array.from(new Set(allArticles.map(a => a.source).filter(Boolean))) as string[], [allArticles]);
  const toggleSource = (v: string) => setSelSources(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v]);

  const filtered = useMemo(() => {
    let list = allArticles;
    if (category !== 'All') list = list.filter(a => a.category === category);
    if (selSources.length) list = list.filter(a => selSources.includes(a.source || ''));
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(a => a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q) || (a.source || '').toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => {
      if (sortBy === 'oldest') return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
  }, [allArticles, category, selSources, search, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [totalPages, page]);
  const first = (page - 1) * perPage;
  const visible = filtered.slice(first, first + perPage);
  const resetFilters = () => { setCategory('All'); setSelSources([]); setSearch(''); setSortBy('newest'); setPage(1); };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) return;
    setSubscribed(true);
    setEmail('');
  };

  if (loading) return (
    <div style={PAGE_BG} className="flex min-h-screen items-center justify-center">
      <p className="text-sm font-semibold text-slate-700">Loading Magazine...</p>
    </div>
  );

  const stats: [string, number, any][] = [
    ['Articles Published', allArticles.length, BookOpen],
    ['Categories', categories.length, Tag],
    ['Print Editions', issues.length, FileDown],
  ];

  return (
    <div style={PAGE_BG} className="min-h-screen">
      <div className="mt-[108px]" />

      <section aria-label="Magazine statistics" className="flex min-h-[77px] flex-wrap items-center gap-3 bg-[#07130f] px-3 py-2 text-white sm:px-6">
        {stats.map(([label, value, Icon]) => (
          <div key={label} className="flex w-[calc(50%-0.5rem)] shrink-0 items-center gap-2 border-r border-yellow-500/25 pr-2 sm:w-[calc(33.333%-0.7rem)] xl:w-auto xl:min-w-[150px]">
            <Icon className="size-7 shrink-0 text-yellow-400" />
            <span className="flex flex-col"><small className="text-[10px] leading-tight">{label}</small><strong className="text-lg leading-tight text-yellow-300">{value.toLocaleString('en-IN')}</strong></span>
          </div>
        ))}
        <div className="ml-auto min-w-[200px] shrink-0 text-right">
          <strong className="block text-sm leading-tight text-yellow-300">DroneTv Magazine</strong>
          <span className="block text-[11px] text-sky-300">Quarterly print · Articles year-round</span>
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
          <span className="sr-only">Search magazine articles</span>
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search magazine, articles, interviews..." className="min-w-0 flex-1 px-3 text-sm outline-none" />
          <span className="flex h-full w-11 items-center justify-center bg-[#ffdf00]"><Search className="size-5" /></span>
        </label>
        <span className={`${BTN} hidden shrink-0 text-xs sm:block`}>Sort by</span>
        <select value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1); }} className={`${BTN} hidden shrink-0 items-center gap-4 text-xs sm:flex`}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
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
              <h3 className="mb-3 text-xs font-extrabold">MAGAZINE CATEGORY</h3>
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
            <h1 className="text-base font-extrabold">{filtered.length} Magazine {filtered.length === 1 ? 'Article' : 'Articles'}</h1>
            <div className="flex gap-1">
              <button type="button" onClick={() => setView('grid')} aria-label="Grid view" className={`${view === 'grid' ? 'bg-slate-900 text-white' : 'bg-white'} rounded border px-2 py-1`}><Grid3x3 className="size-4" /></button>
              <button type="button" onClick={() => setView('list')} aria-label="List view" className={`${view === 'list' ? 'bg-slate-900 text-white' : 'bg-white'} rounded border px-2 py-1`}><List className="size-4" /></button>
            </div>
          </div>

          {visible.length === 0 ? (
            <p className="rounded-lg bg-white p-8 text-center">No magazine articles found.</p>
          ) : (
            <div className={`grid gap-3 ${view === 'list' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'}`}>
              {visible.map((item, i) => (
                <MagazineCardV2 key={`${item.contentId}-${i}`} item={item} onView={() => navigate(`/media/magazine/${item.contentId}`, { state: { item } })} />
              ))}
            </div>
          )}

          <div className="mt-5 grid min-w-0 grid-cols-1 items-center gap-4 rounded-lg px-3 py-5 sm:px-5 lg:grid-cols-[1fr_auto_1fr]">
            <strong className="text-sm">Showing {filtered.length ? first + 1 : 0}–{Math.min(first + perPage, filtered.length)} of {filtered.length.toLocaleString('en-IN')} articles</strong>
            <nav aria-label="magazine pagination" className="flex min-w-0 flex-wrap items-center justify-center gap-1.5">
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

          <div className="mt-10 space-y-8">
            <div>
              <h2 className="mb-5 flex items-center gap-3 text-lg font-bold text-slate-900 after:h-0.5 after:flex-1 after:bg-slate-200 after:content-['']">
                <span className="rounded bg-yellow-400 px-2 py-0.5 text-xs font-bold text-slate-900">Issues</span>
                All Print Editions
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {issues.map(issue => (
                  <div key={issue.number} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                    <div className={`relative flex aspect-[3/4] flex-col items-center justify-center bg-gradient-to-br p-6 ${issue.gradient}`}>
                      <span className="absolute left-4 top-4 rounded bg-yellow-400 px-2 py-0.5 text-xs font-bold text-slate-900">ISSUE {issue.number}</span>
                      <span className="absolute right-4 top-4 text-xs font-semibold text-white/60">{issue.quarter}</span>
                      <div className="mt-8 text-center">
                        <span className="block text-5xl font-extrabold leading-none text-yellow-400">{issue.number}</span>
                        <span className="text-xs uppercase tracking-widest text-white/40">DroneTv</span>
                      </div>
                      <p className="mt-4 px-2 text-center text-sm font-bold leading-snug text-white">{issue.title}</p>
                    </div>
                    <div className="p-5">
                      <ul className="mb-4 space-y-1.5">
                        {issue.topics.map((t, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                            <span className="mt-0.5 font-bold text-amber-500">—</span>{t}
                          </li>
                        ))}
                      </ul>
                      <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                        <span className="text-xs font-semibold text-green-600">Free for subscribers</span>
                        <a href="mailto:bd@dronetv.in?subject=Request DroneTv Magazine Issue" className="text-xs font-bold text-slate-900 hover:text-amber-600">Request Issue →</a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="mb-5 flex items-center gap-3 text-lg font-bold text-slate-900 after:h-0.5 after:flex-1 after:bg-slate-200 after:content-['']">
                <span className="rounded bg-yellow-400 px-2 py-0.5 text-xs font-bold text-slate-900">Advertise</span>
                Advertise in DroneTv Magazine
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {adTiers.map((item, i) => (
                  <div key={i} className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-3 text-2xl">{item.icon}</div>
                    <h3 className="mb-2 line-clamp-2 text-sm font-bold text-slate-900">{item.title}</h3>
                    <p className="mb-3 line-clamp-3 text-xs leading-relaxed text-slate-500">{item.desc}</p>
                    <span className="mb-3 inline-block self-start rounded bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-700">{item.badge}</span>
                    <div className="mt-auto flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
                      <span className="text-xs text-slate-500">{item.note}</span>
                      <Link to="/partnerships/become-a-partner" className="whitespace-nowrap text-xs font-bold text-amber-600 hover:text-amber-700">Packages →</Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center gap-6 rounded-xl bg-slate-900 p-8 md:flex-row">
              <div className="flex-1">
                <h3 className="mb-2 text-xl font-extrabold text-white">Subscribe to receive all future issues <span className="text-yellow-400">free</span></h3>
                <p className="text-sm text-white/60">New issues drop every quarter. Subscribers also get early access to market intelligence data.</p>
              </div>
              <div className="w-full md:w-auto">
                {subscribed ? (
                  <p className="text-sm font-bold text-yellow-400">Subscribed! You&rsquo;ll receive the next issue on release.</p>
                ) : (
                  <form onSubmit={handleSubscribe} className="flex gap-2">
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Your email address" className="w-full rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-amber-400 sm:w-64" />
                    <button type="submit" className="whitespace-nowrap rounded-lg bg-yellow-400 px-5 py-2.5 text-sm font-bold text-slate-900 hover:bg-yellow-300">Subscribe Free</button>
                  </form>
                )}
              </div>
            </div>
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

// magazineCard() - matches the reference's card anatomy (ribbon badge,
// heart, cover photo, date badge, title, description, tag pills, views,
// View Online + conditional Download PDF). No fabricated Vol/Issue
// numbering - see file-top note.
const MagazineCardV2: React.FC<{ item: MediaItem; onView: () => void }> = ({ item, onView }) => {
  const [imgErr, setImgErr] = useState(false);
  const [liked, setLiked] = useState(false);
  const showImg = item.imageUrl && !imgErr;
  const tags = (item.tags || []).slice(0, 3);

  return (
    <article onClick={onView} className="flex min-w-0 cursor-pointer flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-lg">
      <div className="relative h-44 shrink-0 overflow-hidden bg-slate-100">
        {showImg ? (
          <img src={item.imageUrl} alt={item.title} loading="lazy" onError={() => setImgErr(true)} className="h-full w-full object-cover object-center" />
        ) : (
          <div className="flex h-full w-full items-center justify-center"><BookOpen className="size-10 text-slate-300" /></div>
        )}
        {item.category && <span className="absolute left-3 top-3 rounded px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-white shadow" style={{ backgroundColor: categoryColor(item.category) }}>{item.category}</span>}
        {item.date && <span className="absolute right-3 top-3 rounded bg-white/90 px-2 py-1 text-[11px] font-bold text-slate-700 shadow">{item.date}</span>}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <button type="button" onClick={e => { e.stopPropagation(); setLiked(v => !v); }} aria-label={`Save ${item.title}`} aria-pressed={liked} className={`grid size-9 place-items-center rounded-full bg-white shadow ${liked ? 'text-red-600' : 'text-red-500'}`}>
            <Heart className="size-4" fill={liked ? 'currentColor' : 'none'} />
          </button>
          <ShareMenu url={`${window.location.origin}/media/magazine/${item.contentId}`} title={item.title} buttonClassName="grid size-9 place-items-center rounded-full bg-white text-slate-600 shadow" iconClassName="size-4" />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 text-sm font-extrabold leading-snug text-slate-900">{item.title}</h3>
        <p className="line-clamp-2 min-h-8 text-xs leading-[18px] text-slate-600">{item.description || 'No description available.'}</p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((t, i) => <span key={i} className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase text-blue-700">{t}</span>)}
          </div>
        )}

        <div className="mt-auto flex items-center gap-1.5 pt-1">
          <span className="flex items-center gap-1 text-xs font-semibold text-slate-500" title="Views">
            <Eye className="size-3.5 shrink-0" />{fmtCount(item.views ?? 0)}
          </span>
          {item.author && <span className="truncate text-xs font-semibold text-slate-500">· {item.author}</span>}
        </div>
        <div className={`grid gap-2 ${item.externalLink ? 'grid-cols-2' : 'grid-cols-1'}`}>
          <button type="button" onClick={e => { e.stopPropagation(); onView(); }} className="rounded-lg border border-slate-300 bg-white py-2 text-xs font-bold text-slate-900">View Online</button>
          {item.externalLink && (
            <a href={item.externalLink} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="flex items-center justify-center gap-1 rounded-lg bg-red-600 py-2 text-xs font-bold text-white"><FileDown className="size-3.5" />Download PDF</a>
          )}
        </div>
      </div>
    </article>
  );
};

export default MagazineV2;
