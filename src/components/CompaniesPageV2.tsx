import React, { useState, useEffect, useMemo } from 'react';
import { Search, BadgeCheck, MapPin, ChevronRight, ChevronLeft, SlidersHorizontal, X, Award, Crown, Share2, Heart, BarChart2, Star, Copy, Grid3x3, List, Menu, UserRound, Globe2, ChevronDown, Filter, Box, Wrench, Users, CalendarDays, Eye, Send, Briefcase } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import LoadingScreen from './loadingscreen';
import { COMPANY_API, LAMBDA } from '../lib/apiConfig';
import { withInlineAds } from './common/adCreatives';
import type { Company } from './CompaniesPage';
import { TIER_STYLE, getTier, useSavedCompanies, getIndustry, getSectors, getInitials, requestOptOut, realTagline, IND_COLORS, IND_LABELS, avColor, ALL_SECTORS, shortLocation, extractState } from './CompaniesPage';

// Preview build at /companies-v2 - same real data, same real business logic
// as the live CompaniesPage.tsx (verified/RPTO/Managed/documentation/
// capacity/unclaimed-banner, everything), restyled with real Tailwind
// utility classes matching the uploaded design instead of the CSS-in-JS
// template string the live page uses. Not wired into the real /companies
// route - for side-by-side review only, per explicit instruction.

const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#ffd84d',
  backgroundImage: 'radial-gradient(circle, rgba(174,139,24,.35) 1.5px, transparent 2px)',
  backgroundSize: '28px 28px',
};

const NAV_ITEMS = ['Home', 'About Us', 'Companies', 'Products', 'Services', 'Professionals', 'Events', 'Partnerships', 'Media Hub', 'Advertising Plans', 'Contact'];

const CompaniesPageV2: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
  const [listedTotal, setListedTotal] = useState(0);
  const [industry, setIndustry] = useState<string>('all');
  const [states, setStates] = useState<string[]>([]);
  const [selSectors, setSelSectors] = useState<string[]>([]);
  const [selStates, setSelStates] = useState<string[]>([]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(12);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const { saved: savedCompanies, toggle: toggleSaved } = useSavedCompanies();
  const navigate = useNavigate();

  // Identical fetch + de-dup logic to the live page - same API, same
  // slug-collapse for the Aug-2025 duplicate-import records.
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
        raw.forEach(c => {
          const st = extractState(c.location);
          if (st && st.length > 1 && st.length < 30) stateSet.add(st);
        });
        setStates(Array.from(stateSet).slice(0, 10));
      })
      .catch(() => setAllCompanies([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = allCompanies;
    if (industry !== 'all') list = list.filter(c => getIndustry(c) === industry);
    if (selSectors.length) list = list.filter(c => selSectors.some(s => getSectors(c).includes(s)));
    if (selStates.length) list = list.filter(c => selStates.includes(extractState(c.location)));
    if (verifiedOnly) list = list.filter(c => !!c.badgeStatus && c.badgeStatus !== 'NONE');
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        c.companyName?.toLowerCase().includes(q) ||
        c.companyDescription?.toLowerCase().includes(q) ||
        c.location?.toLowerCase().includes(q)
      );
    }
    const recency = (c: Company) => new Date(c.lastModified || c.createdAt || 0).getTime();
    return [...list].sort((a, b) => {
      if (sortBy === 'companyName') return (a.companyName || '').localeCompare(b.companyName || '');
      if (sortBy === 'createdAt') return recency(b) - recency(a);
      if (sortBy === 'featured') return ((b.reviewStatus === 'approved') ? 0 : 1) - ((a.reviewStatus === 'approved') ? 0 : 1);
      return 0;
    });
  }, [allCompanies, industry, selSectors, selStates, verifiedOnly, search, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [totalPages, page]);
  const current = filtered.slice((page - 1) * perPage, page * perPage);

  const toggleSector = (s: string) => { setSelSectors(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]); setPage(1); };
  const toggleState = (s: string) => { setSelStates(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]); setPage(1); };

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

  const activeFiltersCount = selSectors.length + selStates.length + (verifiedOnly ? 1 : 0);
  const verifiedCount = allCompanies.filter(c => !!c.badgeStatus && c.badgeStatus !== 'NONE').length;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
    .reduce<(number | '...')[]>((acc, p, i, arr) => {
      if (i > 0 && typeof arr[i - 1] === 'number' && (p as number) - (arr[i - 1] as number) > 1) acc.push('...');
      acc.push(p); return acc;
    }, []);

  if (loading) return <LoadingScreen logoSrc="/images/logo.png" loadingText="Loading Companies..." />;

  const indryCounts: Record<string, number> = { all: allCompanies.length };
  for (const ind of ['drone', 'gis', 'ai'] as const) indryCounts[ind] = allCompanies.filter(c => getIndustry(c) === ind).length;

  const stats: [string, number][] = [
    ['Total Listed', listedTotal || allCompanies.length],
    ['Verified', verifiedCount],
    ['Drone', indryCounts.drone],
    ['GIS', indryCounts.gis],
    ['AI', indryCounts.ai],
    ['Products', allCompanies.reduce((s, c) => s + (Number(c.productsCount) || 0), 0)],
  ];
  const statIcons = [Briefcase, BadgeCheck, MapPin, Box, Wrench, Box];

  const chip = (on: boolean) =>
    `rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors ${on ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white hover:border-amber-500'}`;
  const btn = 'rounded-lg border border-slate-200 bg-white px-3 py-2 font-semibold shadow-sm hover:border-amber-500';

  return (
    <div className="min-h-screen" style={DOTTED_BG}>
      {/* HEADER */}
      <header className="relative z-30 flex h-[70px] items-center gap-3 bg-[#ffe32a] px-3 shadow-sm sm:px-5 xl:px-7">
        <Link to="/" className="flex h-14 w-[160px] shrink-0 items-center overflow-hidden sm:w-[180px]">
          <img src="/images/logo.png" alt="DroneTV" className="h-full w-full object-contain object-left" />
        </Link>
        <button type="button" onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu" className="ml-auto rounded p-2 xl:hidden">
          {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
        <nav className={`${menuOpen ? 'grid' : 'hidden'} absolute inset-x-0 top-[70px] grid-cols-2 gap-1 bg-[#ffe32a] p-3 shadow-md xl:static xl:flex xl:flex-1 xl:flex-row xl:items-center xl:justify-center xl:gap-0 xl:bg-transparent xl:p-0 xl:shadow-none 2xl:gap-2`}>
          {NAV_ITEMS.map(item => (
            <a key={item} href="#" className={`rounded px-1 py-2 text-[11px] font-bold whitespace-nowrap hover:bg-yellow-300 ${item === 'Companies' ? 'underline underline-offset-4' : ''}`}>{item}</a>
          ))}
        </nav>
        <div className="hidden shrink-0 items-center gap-4 text-xs font-bold 2xl:flex">
          <Search className="size-5" />
          <span className="flex items-center gap-1"><UserRound className="size-5" /> Account</span>
          <span className="flex items-center gap-1"><Globe2 className="size-5" /> English <ChevronDown className="size-3" /></span>
        </div>
      </header>

      {/* INDUSTRY STAT BAR */}
      <section className="flex min-h-[77px] flex-wrap items-center gap-3 bg-[#07130f] px-3 py-2 text-white sm:px-6">
        {stats.map(([label, value], i) => {
          const Icon = statIcons[i];
          return (
            <div key={label} className="flex w-[calc(50%-0.5rem)] shrink-0 items-center gap-2 border-r border-yellow-500/25 pr-2 sm:w-[calc(33.333%-0.7rem)] xl:w-auto xl:min-w-[130px] 2xl:min-w-[150px]">
              <Icon className="size-7 shrink-0 text-yellow-400" />
              <span className="flex flex-col">
                <small className="text-[10px] leading-tight">{label}</small>
                <strong className="text-lg leading-tight text-yellow-300">{value.toLocaleString('en-IN')}</strong>
              </span>
            </div>
          );
        })}
        <a href="/form" className="flex h-9 min-w-[183px] shrink-0 items-center justify-center rounded-lg bg-[#ffdf00] px-3 text-sm font-extrabold text-black">+ List Your Company</a>
        <div className="min-w-[255px] shrink-0 border-l border-yellow-500/25 pl-4">
          <strong className="block text-sm leading-tight text-yellow-300">India&rsquo;s #1 Drone|GIS|AI Industry Platform</strong>
          <span className="block text-[11px] text-sky-300">Discover | Connect | Collaborate | Grow</span>
        </div>
      </section>

      {/* CONTROLS */}
      <section style={DOTTED_BG} className="flex flex-wrap items-center gap-2 px-3 py-3 sm:px-6">
        <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1">
          {['Sector', 'State', 'Package', 'Verified', 'Experience', 'Services', 'Company Type'].map(label => (
            <button key={label} type="button" className={`${btn} flex shrink-0 items-center gap-2 text-xs`}>{label} <ChevronDown className="size-4" /></button>
          ))}
        </div>
        <label className="flex h-10 w-full items-center overflow-hidden rounded-lg border border-slate-200 bg-white md:w-[min(100%,360px)]">
          <span className="sr-only">Search companies</span>
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search companies, products, services..." className="min-w-0 flex-1 px-3 text-sm outline-none" />
          <span className="flex h-full w-11 items-center justify-center bg-[#ffdf00]"><Search className="size-5" /></span>
        </label>
        <button type="button" className={`${btn} hidden shrink-0 text-xs sm:block`}>Sort by</button>
        <select value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1); }} className={`${btn} hidden shrink-0 text-xs sm:block`}>
          <option value="featured">Verified first</option>
          <option value="createdAt">Newest first</option>
          <option value="companyName">A – Z</option>
        </select>
      </section>

      {/* Mobile filter toggle */}
      <div className="px-3 pt-3 sm:px-6 lg:hidden">
        <button type="button" onClick={() => setSidebarOpen(o => !o)} className="flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-yellow-400">
          <SlidersHorizontal className="size-4" /> Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
        </button>
      </div>

      <main className="mx-auto grid max-w-[2100px] grid-cols-1 items-start gap-3 px-3 py-4 sm:px-6 lg:grid-cols-[255px_minmax(0,1fr)]">
        {/* SIDEBAR */}
        <aside className={`${sidebarOpen ? 'block' : 'hidden'} self-start rounded-xl border border-yellow-300 bg-[#fffef0] p-4 shadow-sm lg:block`}>
          <div className="mb-4 flex items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <h2 className="flex items-center gap-2 text-lg font-extrabold"><Filter className="size-5 text-yellow-500" /> Filters</h2>
            {activeFiltersCount > 0 && (
              <button type="button" onClick={() => { setSelSectors([]); setSelStates([]); setVerifiedOnly(false); setPage(1); }} className="text-xs font-bold text-blue-800">Clear All</button>
            )}
          </div>

          <section className="mb-4 border-b border-slate-200 pb-3">
            <h3 className="mb-3 text-xs font-extrabold">CATEGORY</h3>
            <div className="flex flex-wrap gap-2">
              {(['all', 'drone', 'gis', 'ai'] as const).map(ind => (
                <button key={ind} type="button" onClick={() => { setIndustry(ind); setPage(1); }} className={chip(industry === ind)}>
                  {IND_LABELS[ind]} ({indryCounts[ind] ?? 0})
                </button>
              ))}
            </div>
          </section>

          <section className="mb-4 border-b border-slate-200 pb-3">
            <h3 className="mb-3 text-xs font-extrabold">SECTOR</h3>
            <div className="flex flex-wrap gap-2">
              {ALL_SECTORS.map(s => (
                <button key={s} type="button" onClick={() => toggleSector(s)} className={chip(selSectors.includes(s))}>{s}</button>
              ))}
            </div>
          </section>

          {states.length > 0 && (
            <section className="mb-4 border-b border-slate-200 pb-3">
              <h3 className="mb-3 text-xs font-extrabold">STATE</h3>
              <div className="flex flex-wrap gap-2">
                {states.map(st => (
                  <button key={st} type="button" onClick={() => toggleState(st)} className={chip(selStates.includes(st))}>{st}</button>
                ))}
              </div>
            </section>
          )}

          <section className="mb-4 border-b border-slate-200 pb-3">
            <h3 className="mb-3 text-xs font-extrabold">VERIFICATION</h3>
            <label className="flex cursor-pointer items-center gap-2 text-xs">
              <input type="checkbox" checked={verifiedOnly} onChange={() => { setVerifiedOnly(v => !v); setPage(1); }} className="accent-amber-500" />
              DGCA-Verified only
            </label>
          </section>

          <section className="mb-1">
            <h3 className="mb-3 text-xs font-extrabold">PACKAGE TIER</h3>
            <div className="flex flex-wrap gap-2 opacity-50">
              {['📌 Reach', '⭐ Brand', '🔵 Expand'].map(l => (
                <span key={l} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold">{l}</span>
              ))}
            </div>
            <div className="mt-1 text-[10px] text-slate-400">Coming soon</div>
          </section>
        </aside>

        {/* RESULTS */}
        <section className="min-w-0">
          <div className="mb-3 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-[11.5px] text-amber-800">
            ⭐ Verified companies appear first. Get your company verified by submitting GST documents in your dashboard.
          </div>

          <div className="mb-3 flex items-center justify-between gap-2">
            <h1 className="text-base font-extrabold">
              {filtered.length.toLocaleString('en-IN')} {filtered.length === 1 ? 'company' : 'companies'}
              {industry !== 'all' && <span className="ml-1 font-semibold" style={{ color: IND_COLORS[industry] }}>· {IND_LABELS[industry]}</span>}
            </h1>
            <div className="flex gap-1">
              <button type="button" onClick={() => setView('grid')} aria-label="Grid view" className={`${view === 'grid' ? 'bg-slate-900 text-white' : 'bg-white'} rounded border px-2 py-1`}><Grid3x3 className="size-4" /></button>
              <button type="button" onClick={() => setView('list')} aria-label="List view" className={`${view === 'list' ? 'bg-slate-900 text-white' : 'bg-white'} rounded border px-2 py-1`}><List className="size-4" /></button>
            </div>
          </div>

          {current.length === 0 ? (
            <p className="rounded-lg bg-white p-8 text-center">
              <Search className="mx-auto mb-3 size-10 text-slate-300" />
              <span className="block font-bold text-slate-800">No companies found</span>
              <span className="block text-sm text-slate-500">Try adjusting your filters or search</span>
            </p>
          ) : (
            <div className={`grid gap-3 ${view === 'list' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'}`}>
              {withInlineAds(current, (c, i) => {
                const tier = getTier(c);
                const id = c.publishedId || c.companyId || c.companyName;
                return tier ? (
                  <PremiumCompanyCardV2 key={`${c.companyName}-${i}`} company={c} tier={tier} onClick={() => handleCardClick(c)} onEnquire={() => handleEnquireClick(c)} saved={savedCompanies.has(id)} onToggleSave={() => toggleSaved(id)} />
                ) : (
                  <CompanyCardV2 key={`${c.companyName}-${i}`} company={c} onClick={() => handleCardClick(c)} onEnquire={() => handleEnquireClick(c)} saved={savedCompanies.has(id)} onToggleSave={() => toggleSaved(id)} />
                );
              })}
            </div>
          )}

          <div className="mt-5 grid min-w-0 grid-cols-1 items-center gap-4 rounded-lg px-3 py-5 sm:px-5 lg:grid-cols-[1fr_auto_1fr]">
            <strong className="text-sm">Showing {current.length ? (page - 1) * perPage + 1 : 0}–{Math.min(page * perPage, filtered.length)} of {filtered.length.toLocaleString('en-IN')} companies</strong>
            {totalPages > 1 && (
              <nav className="flex min-w-0 flex-wrap items-center justify-center gap-1.5">
                <button type="button" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="grid h-9 min-w-9 place-items-center rounded-md border border-amber-300 bg-white disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft className="size-4" /></button>
                {pages.map((p, i) => p === '...' ? (
                  <span key={`e${i}`} className="px-1">…</span>
                ) : (
                  <button key={p} type="button" onClick={() => setPage(p as number)} className={`grid h-9 min-w-9 place-items-center rounded-md border px-2 text-sm font-semibold shadow-sm ${page === p ? 'border-slate-900 bg-slate-900 text-white' : 'border-amber-300 bg-white text-slate-900 hover:bg-amber-50'}`}>{p}</button>
                ))}
                <button type="button" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="grid h-9 min-w-9 place-items-center rounded-md border border-amber-300 bg-white disabled:cursor-not-allowed disabled:opacity-40"><ChevronRight className="size-4" /></button>
              </nav>
            )}
            <label className="flex items-center gap-1 text-sm lg:justify-self-end">Show
              <select value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }} className="ml-1 rounded-md border border-amber-300 bg-white px-2 py-1.5">
                {[12, 24, 48].map(n => <option key={n} value={n}>{n} per page</option>)}
              </select>
            </label>
          </div>
        </section>
      </main>

      {/* FOOTER TICKER */}
      <footer className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 bg-yellow-400 px-4 py-5 text-center text-sm font-semibold text-black lg:justify-between lg:px-6 lg:text-left">
        <strong>📣 Drone TV Expo 2026 - India&rsquo;s Biggest Drone Event</strong><span className="hidden lg:inline">│</span>
        <span>India&rsquo;s Drone Industry Platform</span><span className="hidden lg:inline">│</span>
        <span>Explore verified drone products &amp; services</span><span className="hidden lg:inline">│</span>
        <span>Connect │ Collaborate │ Grow</span>
      </footer>
    </div>
  );
};

// Compact card - real logic identical to CompanyCard in CompaniesPage.tsx
// (unclaimed banner+optout, saved heart, verified/silver badges, industry+
// sector tags, Managed/RPTO/Suspended tags, documentation score, products/
// services counts) - only the markup is rebuilt with Tailwind classes
// matching the uploaded design's card layout.
const CompanyCardV2: React.FC<{ company: Company; onClick: () => void; onEnquire: () => void; saved?: boolean; onToggleSave?: () => void }> = ({ company, onClick, onEnquire, saved, onToggleSave }) => {
  const ind = getIndustry(company);
  const indColor = IND_COLORS[ind] || '#444';
  const verified = !!company.badgeStatus && company.badgeStatus !== 'NONE' && !company.credentialsExpired;
  const silver = company.badgeStatus === 'SILVER';
  const bg = avColor(company.companyName);
  const [imgErr, setImgErr] = useState(false);
  const [optedOut, setOptedOut] = useState(false);
  const detectedSectors = getSectors(company);
  const photos = (company.galleryImages && company.galleryImages.length > 0)
    ? company.galleryImages.slice(0, 4)
    : [];

  return (
    <article onClick={onClick} className="relative flex min-w-0 flex-col gap-2 overflow-hidden rounded-xl border-2 border-[#f1d823] bg-[#f1ee8e] p-2.5 shadow-md cursor-pointer hover:shadow-lg transition-shadow">
      {company.bulkImported && company.isClaimed === false && (
        <div className="-mx-2.5 -mt-2.5 mb-1 bg-amber-100 px-2 py-1.5 text-center text-[10px] font-extrabold text-amber-900">
          {optedOut ? 'Opt-out requested — DroneTV will review' : (
            <>Unclaimed — not yet confirmed by this company{' · '}
              <button onClick={e => { e.stopPropagation(); requestOptOut(company.publishedId, () => setOptedOut(true)); }} className="underline">Not us?</button>
            </>
          )}
        </div>
      )}
      <div className="flex items-start gap-2 pr-16">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-lg border-2 border-yellow-400 bg-slate-50 text-lg font-extrabold text-white overflow-hidden" style={{ background: company.previewImage && !imgErr ? undefined : bg }}>
          {company.previewImage && !imgErr ? <img src={company.previewImage} alt="" className="size-full object-cover" onError={() => setImgErr(true)} /> : getInitials(company.companyName)}
        </div>
        <div className="min-w-0">
          <h3 className="flex items-center gap-1 text-xs font-extrabold leading-tight">
            <span className="truncate">{company.companyName}</span>
            {verified && <BadgeCheck className="size-3.5 shrink-0 text-emerald-600" />}
            {silver && <Award className="size-3.5 shrink-0 text-slate-500" titleAccess="Silver - Profile verified by DroneTV team" />}
          </h3>
          {company.location && (
            <p className="mt-1 flex items-center gap-1 text-[10px]"><MapPin className="size-3 shrink-0" /> <span className="truncate">{shortLocation(company.location)}</span></p>
          )}
        </div>
      </div>

      <div className="absolute right-2 top-2 flex items-start justify-end gap-2 text-center">
        <div className="flex w-7 flex-col items-center">
          {onToggleSave && (
            <button type="button" onClick={e => { e.stopPropagation(); onToggleSave(); }} aria-label="Save" className={`flex size-7 items-center justify-center ${saved ? 'text-red-600' : ''}`}>
              <Heart className="size-5" fill={saved ? 'currentColor' : 'none'} />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-1">
        {verified && <span className="rounded border border-emerald-300 bg-white px-1.5 py-0.5 text-[9px] font-bold uppercase text-emerald-700">Verified</span>}
        {silver && <span className="rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[9px] font-bold uppercase text-slate-600">Silver</span>}
        {ind !== 'all' && <span className="rounded border px-1.5 py-0.5 text-[9px] font-bold uppercase" style={{ borderColor: indColor, color: indColor }}>{ind}</span>}
        {detectedSectors.slice(0, 1).map(s => <span key={s} className="rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[9px] font-bold text-slate-600">{s}</span>)}
        {company.deliveryTier === 'MANAGED' && <span className="rounded border border-blue-300 bg-blue-50 px-1.5 py-0.5 text-[9px] font-bold text-blue-700" title="Fulfilled directly by DroneTV's own group companies">DroneTV Managed</span>}
        {company.rptoStatus === 'DGCA_APPROVED_RPTO' && <span className="rounded border border-emerald-300 bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700" title="Self-declared DGCA RPTO Authorization on file">DGCA-Approved RPTO</span>}
        {company.credentialsExpired && <span className="rounded border border-red-300 bg-red-50 px-1.5 py-0.5 text-[9px] font-bold text-red-700" title="A required credential has expired">Verification Suspended</span>}
      </div>

      <p className="line-clamp-2 min-h-8 text-[10.5px] leading-[15px] text-slate-700">{company.companyDescription || company.aboutDescription || 'No description available.'}</p>

      {photos.length > 0 && (
        <div className="grid grid-cols-4 gap-1">
          {photos.map((p, i) => <img key={i} src={p.url} alt="" loading="lazy" className="h-12 w-full rounded border border-black/10 object-cover" />)}
        </div>
      )}

      {((Number(company.productsCount) || 0) > 0 || (Number(company.servicesCount) || 0) > 0 || (company.documentation?.score ?? 0) > 0) && (
        <div className="mt-auto grid grid-cols-3 border-y border-black/10 py-1.5 text-center">
          {[
            (Number(company.productsCount) || 0) > 0 ? [Box, company.productsCount, 'Products'] : null,
            (Number(company.servicesCount) || 0) > 0 ? [Wrench, company.servicesCount, 'Services'] : null,
            (company.documentation?.score ?? 0) > 0 ? [BarChart2, `${company.documentation!.score}%`, 'Documented'] : null,
          ].filter(Boolean).map(([Icon, v, label]: any, i) => (
            <div key={i} className="flex min-w-0 items-center justify-center gap-1 border-r border-black/10 px-0.5 last:border-0">
              <Icon className="size-4 shrink-0 text-slate-600" />
              <span className="min-w-0 text-left"><strong className="block text-[10px]">{v}</strong><small className="block text-[7px] leading-tight">{label}</small></span>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={e => { e.stopPropagation(); onClick(); }} className="rounded border border-slate-300 bg-white py-1.5 text-[10.5px] font-bold flex items-center justify-center gap-1"><Eye className="size-3" /> View Profile</button>
        <button type="button" onClick={e => { e.stopPropagation(); onEnquire(); }} className="rounded bg-red-600 py-1.5 text-[10.5px] font-bold text-white flex items-center justify-center gap-1"><Send className="size-3" /> Enquire Now</button>
      </div>
    </article>
  );
};

// Premium (Silver/Gold/Platinum) card - real logic identical to
// PremiumCompanyCard, rebuilt with Tailwind. Platinum keeps its dark-card
// treatment.
const PremiumCompanyCardV2: React.FC<{ company: Company; tier: keyof typeof TIER_STYLE; onClick: () => void; onEnquire: () => void; saved: boolean; onToggleSave: () => void }> = ({ company, tier, onClick, onEnquire, saved, onToggleSave }) => {
  const style = TIER_STYLE[tier];
  const dark = !!style.dark;
  const ind = getIndustry(company);
  const indColor = IND_COLORS[ind] || '#444';
  const verified = !!company.badgeStatus && company.badgeStatus !== 'NONE' && !company.credentialsExpired;
  const bg = avColor(company.companyName);
  const [imgErr, setImgErr] = useState(false);
  const [optedOut, setOptedOut] = useState(false);
  const detectedSectors = getSectors(company);
  const description = company.realDescription || company.companyDescription || company.aboutDescription || 'No description available.';
  const sinceYear = company.yearsInBusiness ? (String(company.yearsInBusiness).match(/\d{4}/) || [null])[0] : null;
  const specialty = [detectedSectors.length > 0 ? detectedSectors.slice(0, 4).join(' | ') : shortLocation(company.location), sinceYear ? `Since ${sinceYear}` : null].filter(Boolean).join(' • ');
  const photos = (company.galleryImages && company.galleryImages.length > 0)
    ? company.galleryImages
    : [company.previewImage, company.heroImage].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i).map(url => ({ url: url as string, label: null as string | null }));
  const highlights = (company.heroStats || []).filter(s => s.label && !s.value).slice(0, 6);
  const numericStats = (company.heroStats && company.heroStats.some(s => s.value))
    ? company.heroStats.filter(s => s.value).slice(0, 5).map(s => ({ n: s.value as string, l: s.label || '' }))
    : [
        (Number(company.productsCount) || 0) > 0 ? { n: String(company.productsCount), l: 'Products' } : null,
        (Number(company.servicesCount) || 0) > 0 ? { n: String(company.servicesCount), l: 'Services' } : null,
        company.teamSize ? { n: String(company.teamSize), l: 'Team Size' } : null,
        (company.documentation?.score ?? 0) > 0 ? { n: `${company.documentation!.score}%`, l: 'Documented' } : null,
      ].filter(Boolean) as { n: string; l: string }[];

  return (
    <article onClick={onClick} className={`col-span-full flex flex-col gap-3 rounded-2xl border p-4 shadow-md cursor-pointer transition-shadow hover:shadow-lg ${dark ? 'border-slate-700 bg-slate-900' : 'border-[#f1d823] bg-white'}`}>
      {company.bulkImported && company.isClaimed === false && (
        <div className="-mx-4 -mt-4 rounded-t-2xl bg-amber-100 px-4 py-2 text-center text-[10.5px] font-extrabold text-amber-900">
          {optedOut ? 'Opt-out requested — DroneTV will review' : (
            <>Unclaimed — not yet confirmed by this company{' · '}
              <button onClick={e => { e.stopPropagation(); requestOptOut(company.publishedId, () => setOptedOut(true)); }} className="underline">Not us?</button>
            </>
          )}
        </div>
      )}
      <div className="flex gap-3 items-start pr-14 relative">
        <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-slate-50 text-white font-extrabold" style={{ background: (company.headerLogo || company.previewImage) && !imgErr ? undefined : bg }}>
          {(company.headerLogo || company.previewImage) && !imgErr ? <img src={company.headerLogo || company.previewImage} alt="" className="size-full object-contain" onError={() => setImgErr(true)} /> : getInitials(company.companyName)}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className={`text-base font-extrabold leading-tight line-clamp-2 ${dark ? 'text-white' : 'text-slate-900'}`}>{company.companyName}</h3>
          {specialty && <p className={`mt-0.5 text-xs ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{specialty}</p>}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {verified && <span className="rounded bg-emerald-100 px-2 py-0.5 text-[9px] font-extrabold uppercase text-emerald-700">Verified</span>}
            {ind !== 'all' && <span className="rounded px-2 py-0.5 text-[9px] font-extrabold uppercase" style={{ background: `${indColor}22`, color: indColor }}>{ind}</span>}
            {detectedSectors.slice(0, 2).map(s => <span key={s} className={`rounded px-2 py-0.5 text-[9px] font-extrabold uppercase ${dark ? 'bg-white/10 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>{s}</span>)}
            {tier !== 'silver' && <span className="rounded bg-yellow-400 px-2 py-0.5 text-[9px] font-extrabold uppercase text-slate-900">Premium</span>}
            {company.deliveryTier === 'MANAGED' ? (
              <span className="rounded bg-blue-100 px-2 py-0.5 text-[9px] font-extrabold uppercase text-blue-700">DroneTV Managed</span>
            ) : (
              <span className={`rounded px-2 py-0.5 text-[9px] font-extrabold uppercase ${dark ? 'bg-white/10 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>Marketplace Listing</span>
            )}
            {company.rptoStatus === 'DGCA_APPROVED_RPTO' && <span className="rounded bg-emerald-100 px-2 py-0.5 text-[9px] font-extrabold uppercase text-emerald-700">DGCA-Approved RPTO</span>}
            {company.credentialsExpired && <span className="rounded bg-red-100 px-2 py-0.5 text-[9px] font-extrabold uppercase text-red-700">Verification Suspended</span>}
          </div>
        </div>
        <div className="absolute right-0 top-0 flex flex-col items-end gap-1.5">
          <div className="flex gap-1.5">
            <button type="button" onClick={e => e.stopPropagation()} className={`grid size-6 place-items-center rounded-full border ${dark ? 'border-white/20 bg-white/10' : 'border-slate-200 bg-white'}`}><Share2 className="size-3" /></button>
            <button type="button" onClick={e => { e.stopPropagation(); onToggleSave(); }} className={`grid size-6 place-items-center rounded-full border ${saved ? 'text-red-600' : ''} ${dark ? 'border-white/20 bg-white/10' : 'border-slate-200 bg-white'}`}><Heart className="size-3" fill={saved ? 'currentColor' : 'none'} /></button>
          </div>
          <div className="grid size-9 place-items-center rounded-full shadow" style={{ background: style.ribbonBg }} title={`${style.label} - verified by DroneTV`}>
            {tier === 'silver' ? <Award className="size-5" style={{ color: style.ribbonColor }} /> : <Crown className="size-5" style={{ color: style.ribbonColor }} />}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <p className={`flex-1 min-w-[200px] text-[13px] leading-relaxed line-clamp-3 ${dark ? 'text-slate-200' : 'text-slate-700'}`}>{description}</p>
        {realTagline(company) && (
          <div className="flex flex-1 min-w-[180px] items-center gap-2 rounded-lg p-3" style={{ background: style.highlightBg }}>
            <div className="grid size-8 shrink-0 place-items-center rounded-lg" style={{ background: tier === 'silver' ? '#D9D9D9' : '#F8C400' }}><BarChart2 className="size-4" style={{ color: tier === 'silver' ? '#555' : '#7A5B00' }} /></div>
            <span className={`text-xs font-bold line-clamp-2 ${dark ? 'text-white' : 'text-slate-800'}`}>{realTagline(company)}</span>
          </div>
        )}
      </div>

      {photos.length > 0 && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {photos.slice(0, 4).map((p, i) => (
            <div key={i} className="overflow-hidden rounded-lg bg-slate-100" style={{ height: 70 }}>
              <img src={p.url} alt={p.label || ''} className="size-full object-cover" />
            </div>
          ))}
        </div>
      )}

      {highlights.length > 0 && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {highlights.map((h, i) => (
            <div key={i} className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10.5px] font-bold ${dark ? 'text-white' : 'text-slate-700'}`} style={{ background: style.highlightBg }}>
              <Star className="size-3.5" style={{ color: tier === 'silver' ? '#777' : '#92700A' }} /> {h.label}
            </div>
          ))}
        </div>
      )}

      {numericStats.length > 0 && (
        <div className={`flex flex-wrap gap-2 border-t pt-3 ${dark ? 'border-white/10' : 'border-slate-100'}`}>
          {numericStats.map((s, i) => (
            <div key={i} className={`rounded-lg px-3 py-1.5 ${dark ? 'bg-white/10' : 'bg-slate-100'}`}>
              <div className={`text-sm font-extrabold ${dark ? 'text-white' : 'text-slate-900'}`}>{s.n}</div>
              <div className={`text-[9px] ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{s.l}</div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={e => { e.stopPropagation(); onClick(); }} className={`flex-1 rounded-lg border py-2 text-xs font-bold flex items-center justify-center gap-1.5 ${dark ? 'border-white/25 text-white' : 'border-slate-200 text-slate-900'}`}><Eye className="size-3.5" /> View {tier === 'silver' ? 'Profile' : 'Company Profile'}</button>
        <button type="button" onClick={e => { e.stopPropagation(); onEnquire(); }} className="flex-1 rounded-lg bg-red-600 py-2 text-xs font-bold text-white flex items-center justify-center gap-1.5"><Send className="size-3.5" /> Enquire Now</button>
      </div>

      {company.quote && <div className={`-mx-4 -mb-4 mt-1 rounded-b-2xl px-4 py-2.5 text-center text-xs italic ${dark ? 'bg-white/5 text-amber-300' : 'bg-amber-50 text-amber-800'}`}>&ldquo;{company.quote}&rdquo;</div>}
    </article>
  );
};

export default CompaniesPageV2;
