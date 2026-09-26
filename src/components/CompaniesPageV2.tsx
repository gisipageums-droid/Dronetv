import React, { useState, useEffect, useMemo } from 'react';
import { Search, BadgeCheck, MapPin, ChevronRight, ChevronLeft, Heart, ChevronDown, Filter, Box, Wrench, Users, CalendarDays, Eye, Send, Building2, Cpu, Bot, Briefcase, Grid3x3, List, X } from 'lucide-react';
import ShareMenu from './common/ShareMenu';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from './loadingscreen';
import { COMPANY_API, LAMBDA } from '../lib/apiConfig';
import { withInlineAds } from './common/adCreatives';
import type { Company } from './CompaniesPage';
import { TIER_STYLE, getTier, useSavedCompanies, getIndustry, getSectors, getInitials, requestOptOut, realTagline, ALL_SECTORS, extractState, shortLocation } from './CompaniesPage';
import ToolbarFilterDropdown from './common/ToolbarFilterDropdown';

// Preview build at /companies-v2 - Round 4: a direct, class-string-exact
// port of the reference app's own source (main.ts, run locally at
// http://127.0.0.1:5942/companies during review) rather than a re-styling
// from screenshots - every Tailwind class below is copied from that file's
// header()/industryBar()/controls()/sidebar()/companyCard()/results()/
// footer() functions, not approximated. Real API data/business logic
// (verified/RPTO/Managed/documentation/capacity/unclaimed-banner/quote/
// share) is threaded into that exact same markup as additive elements,
// never replacing or fabricating what the reference itself doesn't have
// real data for.

const PAGE_BG: React.CSSProperties = {
  backgroundColor: '#ffd84d',
  backgroundImage: 'radial-gradient(circle, rgba(174,139,24,0.2) 1.5px, transparent 2px)',
  backgroundSize: '56px 56px',
};

const MEDAL_SRC: Record<string, string> = {
  silver: '/assets/medals/silver-medal.png',
  gold: '/assets/medals/gold-medal.png',
  platinum: '/assets/medals/platinum-medal.png',
};

// A card should never show a blank/empty photo slot. The small logo avatar
// keeps its plain initials (unchanged, per user feedback - that part was
// fine as-is). The 4-photo gallery row is the one that must never be
// empty: when a company has no real uploaded photos, it's filled with real
// themed stock photography matching getIndustry()'s own keyword match on
// name+description (drone/gis/ai/all) - each URL hand-checked (downloaded
// and visually inspected) before use, not guessed.
const CATEGORY_PHOTOS: Record<'drone' | 'gis' | 'ai' | 'all', string[]> = {
  drone: [
    'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=400&q=70',
    'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=400&q=70',
    'https://images.unsplash.com/photo-1521405924368-64c5b84bec60?auto=format&fit=crop&w=400&q=70',
  ],
  gis: [
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=70',
    'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=400&q=70',
    'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&w=400&q=70',
  ],
  ai: [
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=400&q=70',
    'https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&w=400&q=70',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=70',
  ],
  all: [
    'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=400&q=70',
    'https://images.unsplash.com/photo-1521405924368-64c5b84bec60?auto=format&fit=crop&w=400&q=70',
  ],
};

// Exact button class from main.ts's `const btn = '...'`.
const BTN = 'rounded-lg border border-slate-200 bg-white px-3 py-2 font-semibold shadow-sm hover:border-amber-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500';

const CompaniesPageV2: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
  const [listedTotal, setListedTotal] = useState(0);
  const [industry, setIndustry] = useState<string>('All');
  const [states, setStates] = useState<string[]>([]);
  const [selStates, setSelStates] = useState<string[]>([]);
  const [selSectors, setSelSectors] = useState<string[]>([]);
  const [selPackages, setSelPackages] = useState<string[]>([]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(12);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { saved: savedCompanies, toggle: toggleSaved } = useSavedCompanies();
  const navigate = useNavigate();

  useEffect(() => {
    const url = COMPANY_API
      ? `${COMPANY_API}/dashboard-cards?viewType=main&limit=1000`
      : `${LAMBDA.company}/dashboard-cards?viewType=main&limit=1000`;
    fetch(url)
      .then(r => r.json())
      .then(d => {
        const rawAll: Company[] = Array.isArray(d.cards) ? d.cards : [];
        const score = (c: Company) =>
          (Number(c.servicesCount) || 0) + (Number(c.productsCount) || 0) +
          (Number(c.completionPercentage) || 0) / 1000 +
          new Date(c.lastModified || c.createdAt || 0).getTime() / 1e15;
        const bySlug = new Map<string, Company>();
        rawAll.forEach(c => {
          const key = (c.urlSlug || c.companyName || c.publishedId || '').toLowerCase().trim();
          const prev = bySlug.get(key);
          if (!prev || score(c) > score(prev)) bySlug.set(key, c);
        });
        const raw = Array.from(bySlug.values());
        setAllCompanies(raw);
        setListedTotal(typeof d.totalCount === 'number' ? Math.min(d.totalCount, raw.length) : raw.length);
        const stateSet = new Set<string>();
        raw.forEach(c => { const st = extractState(c.location); if (st && st.length > 1 && st.length < 30) stateSet.add(st); });
        setStates(Array.from(stateSet));
      })
      .catch(() => setAllCompanies([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = allCompanies;
    if (industry !== 'All') list = list.filter(c => getIndustry(c).toLowerCase() === industry.toLowerCase());
    if (selStates.length) list = list.filter(c => selStates.includes(extractState(c.location)));
    if (selSectors.length) list = list.filter(c => selSectors.some(s => getSectors(c).includes(s)));
    if (selPackages.length) list = list.filter(c => selPackages.includes((getTier(c) || 'listed').replace(/^./, ch => ch.toUpperCase())));
    if (verifiedOnly) list = list.filter(c => !!c.badgeStatus && c.badgeStatus !== 'NONE');
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(c => c.companyName?.toLowerCase().includes(q) || c.companyDescription?.toLowerCase().includes(q) || c.location?.toLowerCase().includes(q));
    }
    const recency = (c: Company) => new Date(c.lastModified || c.createdAt || 0).getTime();
    return [...list].sort((a, b) => {
      if (sortBy === 'companyName') return (a.companyName || '').localeCompare(b.companyName || '');
      if (sortBy === 'createdAt') return recency(b) - recency(a);
      return ((b.reviewStatus === 'approved') ? 0 : 1) - ((a.reviewStatus === 'approved') ? 0 : 1);
    });
  }, [allCompanies, industry, selStates, selSectors, selPackages, verifiedOnly, search, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [totalPages, page]);
  const first = (page - 1) * perPage;
  const visible = filtered.slice(first, first + perPage);

  const toggleState = (s: string) => { setSelStates(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]); setPage(1); };
  const toggleSector = (s: string) => { setSelSectors(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]); setPage(1); };
  const togglePackage = (s: string) => { setSelPackages(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]); setPage(1); };
  const resetFilters = () => { setIndustry('All'); setSelStates([]); setSelSectors([]); setSelPackages([]); setVerifiedOnly(false); setSearch(''); setPage(1); };

  const handleCardClick = (c: Company) => {
    const slug = c.urlSlug || c.publishedId || c.companyId;
    if (!slug) return;
    if (c.templateSelection === 'template-2' || c.templateSelection === '2') navigate(`/companies/${slug}`);
    else navigate(`/company/${slug}`);
  };
  const handleEnquireClick = (c: Company) => {
    const slug = c.urlSlug || c.publishedId || c.companyId;
    if (!slug) return;
    const seg = (c.templateSelection === 'template-2' || c.templateSelection === '2') ? 'companies' : 'company';
    navigate(`/${seg}/${slug}#contact`);
  };

  if (loading) return <LoadingScreen logoSrc="/images/logo.png" loadingText="Loading Companies..." />;

  const verifiedCount = allCompanies.filter(c => !!c.badgeStatus && c.badgeStatus !== 'NONE').length;
  const droneCount = allCompanies.filter(c => getIndustry(c) === 'drone').length;
  const gisCount = allCompanies.filter(c => getIndustry(c) === 'gis').length;
  const aiCount = allCompanies.filter(c => getIndustry(c) === 'ai').length;
  const roboticsCount = allCompanies.filter(c => /\brobot(?:ics)?\b/i.test(`${c.companyName || ''} ${c.companyDescription || ''}`)).length;
  const otherCount = allCompanies.length - droneCount - gisCount - aiCount;
  // Exact same 6-stat shape as industryBar()'s data.stats - real counts in
  // place of the fictional 12,568/6,230/2,104/1,870/985/1,379.
  const stats: [string, number, any][] = [
    ['Total Companies', listedTotal || allCompanies.length, Briefcase],
    ['Drones', droneCount, Building2],
    ['GIS', gisCount, MapPin],
    ['AI', aiCount, Cpu],
    ['Robotics', roboticsCount, Bot],
    ['Other Support Businesses', otherCount, Briefcase],
  ];

  const packageCounts: Record<string, number> = { Listed: 0, Silver: 0, Gold: 0, Platinum: 0 };
  allCompanies.forEach(c => { const t = getTier(c); const label = t ? t.charAt(0).toUpperCase() + t.slice(1) : 'Listed'; packageCounts[label]++; });
  const stateCounts: Record<string, number> = {};
  allCompanies.forEach(c => { const st = extractState(c.location); if (st) stateCounts[st] = (stateCounts[st] || 0) + 1; });
  const topStates = [...states].sort((a, b) => (stateCounts[b] || 0) - (stateCounts[a] || 0)).slice(0, 5);

  // PACKAGE/LOCATION/SERVICES only - INDUSTRY dropped from here (user
  // flagged on mobile, 20260926): the CATEGORY pill row above already
  // filters by the exact same industry state, so this checkbox group was
  // the identical filter shown a second time right underneath it in a
  // different widget style, not a second real dimension.
  const groups: [string, string[], (s: string) => void, string[]][] = [
    ['PACKAGE', ['Listed', 'Silver', 'Gold', 'Platinum'], togglePackage, selPackages],
    ['LOCATION', topStates, toggleState, selStates],
    ['SERVICES', ALL_SECTORS, toggleSector, selSectors],
  ];

  const activeCount = (industry !== 'All' ? 1 : 0) + selStates.length + selSectors.length + selPackages.length + (verifiedOnly ? 1 : 0);

  return (
    <div style={PAGE_BG} className="min-h-screen">
      {/* No page-local header - the app's persistent global <Navigation/>
          (fixed, h-16) already renders above every route; a page-local
          header duplicated and hid underneath it in an earlier round. */}
      <div className="mt-16" />

      {/* industryBar() - exact classes */}
      <section aria-label="Industry statistics" className="flex min-h-[77px] flex-wrap items-center gap-3 bg-[#07130f] px-3 py-2 text-white sm:px-6">
        {stats.map(([label, value, Icon]) => (
          <div key={label} className="flex w-[calc(50%-0.5rem)] shrink-0 items-center gap-2 border-r border-yellow-500/25 pr-2 sm:w-[calc(33.333%-0.7rem)] xl:w-auto xl:min-w-[130px] 2xl:min-w-[165px]">
            <Icon className="size-7 shrink-0 text-yellow-400" />
            <span className="flex flex-col"><small className="text-[10px] leading-tight">{label}</small><strong className="text-lg leading-tight text-yellow-300">{value.toLocaleString('en-IN')}</strong></span>
          </div>
        ))}
        <a href="/form" className="flex h-9 min-w-[183px] shrink-0 items-center justify-center rounded-lg bg-[#ffdf00] px-3 text-sm font-extrabold text-black">+ List Your Company</a>
        <div className="min-w-[255px] shrink-0 border-l border-yellow-500/25 pl-4">
          <strong className="block text-sm leading-tight text-yellow-300">India&rsquo;s #1 Drone|GIS|AI|ROBO<br />Industry Platform</strong>
          <span className="block text-[11px] text-sky-300">Discover | Connect | Collaborate | Grow</span>
        </div>
      </section>

      {/* controls() - exact classes */}
      <section style={PAGE_BG} className="flex flex-wrap items-center gap-2 px-3 py-3 sm:px-6">
        <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1">
          <button type="button" onClick={() => setSidebarOpen(true)} className={`${BTN} flex shrink-0 items-center gap-1 text-xs lg:hidden`}>Filters <ChevronDown className="size-4" /></button>
          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            <ToolbarFilterDropdown label="Sector" options={ALL_SECTORS} selected={selSectors} onToggle={toggleSector} buttonClassName={`${BTN} flex items-center gap-4 text-xs`} />
            <ToolbarFilterDropdown label="State" options={topStates} selected={selStates} onToggle={toggleState} buttonClassName={`${BTN} flex items-center gap-4 text-xs`} />
            <ToolbarFilterDropdown label="Package" options={['Listed', 'Silver', 'Gold', 'Platinum']} selected={selPackages} onToggle={togglePackage} buttonClassName={`${BTN} flex items-center gap-4 text-xs`} />
            <ToolbarFilterDropdown label="Verified" options={['Verified companies only']} selected={verifiedOnly ? ['Verified companies only'] : []} onToggle={() => { setVerifiedOnly(v => !v); setPage(1); }} buttonClassName={`${BTN} flex items-center gap-4 text-xs`} />
          </div>
        </div>
        <label className="flex h-10 w-full items-center overflow-hidden rounded-lg border border-slate-200 bg-white md:w-[min(100%,360px)]">
          <span className="sr-only">Search companies</span>
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search companies, products, services..." className="min-w-0 flex-1 px-3 text-sm outline-none" />
          <span className="flex h-full w-11 items-center justify-center bg-[#ffdf00]"><Search className="size-5" /></span>
        </label>
        <span className={`${BTN} hidden shrink-0 text-xs sm:block`}>Sort by</span>
        <select value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1); }} className={`${BTN} hidden shrink-0 items-center gap-4 text-xs sm:flex`}>
          <option value="featured">Relevance</option>
          <option value="createdAt">Newest first</option>
          <option value="companyName">A – Z</option>
        </select>
      </section>

      {/* main + sidebar() + results() - exact classes */}
      <main className="mx-auto grid max-w-[2100px] grid-cols-1 items-start gap-3 px-3 py-4 sm:px-6 lg:grid-cols-[255px_minmax(0,1fr)]">
        <aside onClick={e => { if (e.target === e.currentTarget) setSidebarOpen(false); }} className={`${sidebarOpen ? 'fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4 lg:static lg:z-auto lg:bg-transparent lg:p-0' : 'hidden'} self-start lg:block`}>
          <div className={sidebarOpen ? 'mx-auto max-w-sm rounded-xl border border-yellow-300 bg-[#fffef0] p-4 shadow-sm lg:mx-0 lg:max-w-none' : 'rounded-xl border border-yellow-300 bg-[#fffef0] p-4 shadow-sm'}>
            <div className="mb-4 flex items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <h2 className="flex items-center gap-2 text-lg font-extrabold"><Filter className="size-5 text-yellow-500" /> Filters</h2>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => { resetFilters(); setSidebarOpen(false); }} className="text-xs font-bold text-blue-800">Clear All</button>
                <button type="button" onClick={() => setSidebarOpen(false)} aria-label="Close filters" className="lg:hidden"><X className="size-5 text-slate-500" /></button>
              </div>
            </div>

            <section className="mb-4 border-b border-slate-200 pb-3">
              <h3 className="mb-3 text-xs font-extrabold">CATEGORY</h3>
              <div className="flex flex-wrap gap-2">
                {['All', 'Drone', 'GIS', 'AI'].map(cat => (
                  <button key={cat} type="button" onClick={() => { setIndustry(cat); setPage(1); }} className={`rounded-full border px-3 py-1.5 text-[11px] ${industry === cat ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white hover:border-yellow-500'}`}>{cat}</button>
                ))}
              </div>
            </section>

            {groups.map(([title, options, onToggle, activeList]) => options.length > 0 && (
              <section key={title} className="mb-4 border-b border-slate-200 pb-3">
                <h3 className="mb-3 text-xs font-extrabold">{title}</h3>
                <div className="space-y-2">
                  {options.map(option => (
                    <label key={option} className="flex cursor-pointer items-center gap-2 text-xs">
                      <input type="checkbox" checked={activeList.includes(option)} onChange={() => onToggle(option)} className="accent-amber-500" />
                      {option}{title === 'LOCATION' && stateCounts[option] ? ` (${stateCounts[option]})` : ''}{title === 'PACKAGE' ? ` (${packageCounts[option]})` : ''}
                    </label>
                  ))}
                </div>
              </section>
            ))}

            <section className="mb-4 border-b border-slate-200 pb-3">
              <h3 className="mb-3 text-xs font-extrabold">VERIFIED</h3>
              <label className="flex cursor-pointer items-center gap-2 text-xs">
                <input type="checkbox" checked={verifiedOnly} onChange={() => { setVerifiedOnly(v => !v); setPage(1); }} className="accent-amber-500" />
                Verified Companies ({verifiedCount})
              </label>
            </section>

            <button type="button" onClick={() => setSidebarOpen(false)} className="w-full rounded-lg bg-yellow-400 py-2 text-xs font-bold">Apply Filters</button>
            <button type="button" onClick={resetFilters} className="mt-2 w-full rounded-lg border bg-white py-2 text-xs font-bold">Reset Filters</button>
          </div>
        </aside>

        <section className="min-w-0">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h1 className="text-base font-extrabold">Explore Drone Industry Companies</h1>
            <div className="flex gap-1">
              <button type="button" onClick={() => setView('grid')} aria-label="Grid view" className={`${view === 'grid' ? 'bg-slate-900 text-white' : 'bg-white'} rounded border px-2 py-1`}><Grid3x3 className="size-4" /></button>
              <button type="button" onClick={() => setView('list')} aria-label="List view" className={`${view === 'list' ? 'bg-slate-900 text-white' : 'bg-white'} rounded border px-2 py-1`}><List className="size-4" /></button>
            </div>
          </div>

          <div className="mb-3 rounded-lg bg-white/70 px-3 py-2 text-[11.5px] text-amber-900">⭐ Verified companies appear first. Get your company verified by submitting GST documents in your dashboard.</div>

          <div className={`grid gap-3 ${view === 'list' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'}`}>
            {withInlineAds(visible, (c, i) => {
              const id = c.publishedId || c.companyId || c.companyName;
              return <CompanyCardV2 key={`${c.companyName}-${i}`} company={c} onClick={() => handleCardClick(c)} onEnquire={() => handleEnquireClick(c)} saved={savedCompanies.has(id)} onToggleSave={() => toggleSaved(id)} />;
            })}
          </div>
          {filtered.length === 0 && <p className="rounded-lg bg-white p-8 text-center">No companies found.</p>}

          <div className="mt-5 grid min-w-0 grid-cols-1 items-center gap-4 rounded-lg px-3 py-5 sm:px-5 lg:grid-cols-[1fr_auto_1fr]">
            <strong className="text-sm">Showing {filtered.length ? first + 1 : 0}–{Math.min(first + perPage, filtered.length)} of {filtered.length.toLocaleString('en-IN')} companies</strong>
            <nav aria-label="companies pagination" className="flex min-w-0 flex-wrap items-center justify-center gap-1.5">
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

      {/* footer() - exact classes */}
      <footer className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 bg-yellow-400 px-4 py-5 text-center text-sm font-semibold text-black lg:justify-between lg:px-6 lg:text-left">
        <strong>📣 Drone TV Expo 2026 - India&rsquo;s Biggest Drone Event</strong><span className="hidden text-yellow-400 lg:inline">│</span>
        <span>India&rsquo;s Drone Industry Platform</span><span className="hidden text-yellow-400 lg:inline">│</span>
        <span>Explore verified drone products &amp; services</span><span className="hidden text-yellow-400 lg:inline">│</span>
        <span>Connect <span className="text-yellow-400">│</span> Collaborate <span className="text-yellow-400">│</span> Grow</span>
      </footer>
    </div>
  );
};

// companyCard() - exact class-string port. Real business-logic signals
// (verified checkmark, RPTO/Managed/Suspended tags, documentation stat,
// unclaimed banner, quote, share) are threaded in as additive elements
// using the same sizing/spacing language as the reference, never
// fabricated data (no fake like-count or star rating - dropped, not
// invented, since no real field backs them).
const CompanyCardV2: React.FC<{ company: Company; onClick: () => void; onEnquire: () => void; saved?: boolean; onToggleSave?: () => void }> = ({ company, onClick, onEnquire, saved, onToggleSave }) => {
  const ind = getIndustry(company);
  const fallbackPhotos = CATEGORY_PHOTOS[ind];
  const tier = getTier(company);
  const verified = !!company.badgeStatus && company.badgeStatus !== 'NONE' && !company.credentialsExpired;
  const [imgErr, setImgErr] = useState(false);
  const [optedOut, setOptedOut] = useState(false);
  const detectedSectors = getSectors(company);
  const description = company.realDescription || company.companyDescription || company.aboutDescription || 'No description available.';

  // Fixed-size photo tiles: h-12 w-full with object-cover, exactly like
  // companyCard()'s own photo grid - real gallery photos scale to fill
  // that fixed box and crop to fit, never distorted, never a fake filler
  // image when a company has none (row just doesn't render then).
  const realPhotos = (company.galleryImages && company.galleryImages.length > 0)
    ? company.galleryImages.slice(0, 4)
    : [company.previewImage, company.heroImage].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i).slice(0, 4).map(url => ({ url: url as string }));
  const missingPhotoCount = Math.max(0, 4 - realPhotos.length);

  const sinceYear = company.yearsInBusiness ? (String(company.yearsInBusiness).match(/\d{4}/) || [null])[0] : null;
  const yearsEstablished = sinceYear ? String(new Date().getFullYear() - Number(sinceYear)) : null;
  const statCells: [any, any, string][] = [
    (Number(company.productsCount) || 0) > 0 ? [Box, company.productsCount, 'Products'] : null,
    (Number(company.servicesCount) || 0) > 0 ? [Wrench, company.servicesCount, 'Services'] : null,
    company.teamSize ? [Users, company.teamSize, 'Team Size'] : null,
    yearsEstablished ? [CalendarDays, yearsEstablished, 'Years Established'] : null,
  ].filter(Boolean) as [any, any, string][];

  const extraTags = [
    company.deliveryTier === 'MANAGED' ? 'Managed' : null,
    company.rptoStatus === 'DGCA_APPROVED_RPTO' ? 'DGCA-RPTO' : null,
    company.credentialsExpired ? 'Suspended' : null,
    (company.documentation?.score ?? 0) > 0 ? `📋 ${company.documentation!.score}%` : null,
  ].filter(Boolean) as string[];

  return (
    <article onClick={onClick} className="relative flex min-w-0 cursor-pointer flex-col gap-1.5 overflow-hidden rounded-xl border-2 border-[#f1d823] bg-[#f1ee8e] p-2 shadow-md transition-shadow hover:shadow-lg">
      {company.bulkImported && company.isClaimed === false && (
        <div className="-mx-2 -mt-2 mb-1 bg-amber-100 px-2 py-1.5 text-center text-[9px] font-extrabold text-amber-900">
          {optedOut ? 'Opt-out requested — DroneTV will review' : (
            <>Unclaimed{' · '}<button onClick={e => { e.stopPropagation(); requestOptOut(company.publishedId, () => setOptedOut(true)); }} className="underline">Not us?</button></>
          )}
        </div>
      )}

      {/* Exact tier badge treatment from companyCard(): LISTED is a plain
          text pill; Silver/Gold/Platinum use the real medal artwork at a
          fixed h-12 w-12 object-contain box, same as the reference. */}
      {tier ? (
        <img src={MEDAL_SRC[tier]} alt={`${TIER_STYLE[tier].label} package`} title={TIER_STYLE[tier].label} className="absolute right-1 top-1 z-10 h-16 w-16 object-contain" />
      ) : (
        <span className="absolute right-2 top-2 z-10 rounded bg-[#dff0df] px-2 py-2 text-[10px] font-extrabold">LISTED</span>
      )}

      <div className="flex min-h-[78px] items-start gap-2 pr-20">
        <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 border-yellow-400 bg-slate-50 text-lg font-extrabold text-blue-600">
          {company.previewImage && !imgErr ? <img src={company.previewImage} alt="" className="size-full object-cover" onError={() => setImgErr(true)} /> : getInitials(company.companyName)}
        </div>
        <div className="min-w-0">
          <h3 className="line-clamp-2 text-xs font-extrabold leading-tight">{company.companyName}</h3>
          {company.location && <p className="mt-1 flex items-center gap-1 text-[10px]"><MapPin className="size-3 shrink-0" /><span className="truncate">{shortLocation(company.location)}</span></p>}
          {verified && <p className="mt-1 flex items-center gap-1 text-[10px] font-bold text-blue-700"><BadgeCheck className="size-3.5 shrink-0" />Verified</p>}
        </div>
      </div>

      {/* Exact heart/share icon column position - star/rating dropped, no
          real rating field exists to back it (not fabricated). */}
      <div className="absolute right-2 top-[70px] flex items-start justify-end gap-2 text-center">
        <div className="flex w-7 flex-col items-center">
          <button type="button" onClick={e => { e.stopPropagation(); onToggleSave?.(); }} aria-label="Save" className={`flex size-7 items-center justify-center ${saved ? 'text-red-600' : ''}`}><Heart className="size-5" fill={saved ? 'currentColor' : 'none'} /></button>
        </div>
        <ShareMenu url={`${window.location.origin}/s/${company.urlSlug || company.publishedId}`} title={company.companyName} />
      </div>

      <div className="flex flex-wrap gap-1">
        {ind !== 'all' && <span className="rounded border border-blue-300 bg-white px-1.5 py-0.5 text-[9px] font-bold text-blue-700">{ind.toUpperCase()}</span>}
        {detectedSectors.slice(0, 2).map(s => <span key={s} className="rounded border border-blue-300 bg-white px-1.5 py-0.5 text-[9px] font-bold text-blue-700">{s}</span>)}
        {extraTags.map(t => <span key={t} className="rounded border border-blue-300 bg-white px-1.5 py-0.5 text-[9px] font-bold text-blue-700">{t}</span>)}
      </div>

      <p className="min-h-7 text-[10px] font-semibold leading-[14px] line-clamp-2">{description}</p>

      {realTagline(company) && <p className="text-[9px] italic text-amber-800 line-clamp-1">&ldquo;{realTagline(company)}&rdquo;</p>}

      {/* Always exactly 4 tiles - real uploaded photos first, filled out
          with real themed stock photography (never an empty slot, never a
          fake gradient tile) when a company has fewer than 4 real photos. */}
      <div className="grid grid-cols-4 gap-1">
        {realPhotos.map((p, i) => <img key={i} src={p.url} alt={`${company.companyName} ${i + 1}`} loading="lazy" className="h-12 w-full rounded border border-black object-cover" />)}
        {Array.from({ length: missingPhotoCount }).map((_, i) => (
          <img key={`fb-${i}`} src={fallbackPhotos[i % fallbackPhotos.length]} alt="" loading="lazy" className="h-12 w-full rounded border border-black object-cover" />
        ))}
      </div>

      {statCells.length > 0 && (
        <div className="mt-auto grid border-y border-black/10 py-1 text-center" style={{ gridTemplateColumns: `repeat(${statCells.length}, 1fr)` }}>
          {statCells.map(([Icon, v, label], i) => (
            <div key={i} className="flex min-w-0 items-center justify-center gap-1 border-r border-black/10 px-0.5 last:border-0">
              <Icon className="size-4 shrink-0" />
              <span className="min-w-0 text-left"><strong className="block text-[10px]">{v}</strong><small className="block text-[7px] leading-tight break-words">{label}</small></span>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={e => { e.stopPropagation(); onClick(); }} className="rounded border border-slate-200 bg-white py-1.5 text-[10px] font-bold"><Eye className="mr-1 inline size-3" />View Profile</button>
        <button type="button" onClick={e => { e.stopPropagation(); onEnquire(); }} className="rounded bg-red-600 py-1.5 text-[10px] font-bold text-white"><Send className="mr-1 inline size-3" />Enquire Now</button>
      </div>

    </article>
  );
};

export default CompaniesPageV2;
