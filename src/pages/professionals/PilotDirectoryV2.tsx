import React, { useState, useEffect } from "react";
import { Search, ChevronDown, Filter, ChevronLeft, ChevronRight, Grid3x3, List, Briefcase, Award, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../../components/loadingscreen";
import { PROFESSIONAL_API, LAMBDA } from "../../lib/apiConfig";
import { withInlineAds } from "../../components/common/adCreatives";
import ToolbarFilterDropdown from "../../components/common/ToolbarFilterDropdown";
import { Professional, getCategory, ProfessionalCardV2 } from "../../components/ProfessionalsPageV2";

// Preview build at /professionals/pilot-directory-v2 - same reference
// layout as /professionals (stat bar, filters sidebar, grid), reusing the
// exact same ProfessionalCardV2 already built and approved there (same
// real API, same fields) rather than duplicating a second card component
// for what is the same underlying data. Pilot Directory has never had its
// own distinct dataset - the live PilotDirectoryPage.tsx already just
// shows the full professional-dashboard-cards list, unfiltered - so this
// keeps that behaviour, only the hero copy/stats are Pilot-Directory-
// specific.

const PAGE_BG: React.CSSProperties = {
  backgroundColor: '#ffd84d',
  backgroundImage: 'radial-gradient(circle, rgba(174,139,24,0.2) 1.5px, transparent 2px)',
  backgroundSize: '56px 56px',
};
const BTN = 'rounded-lg border border-slate-200 bg-white px-3 py-2 font-semibold shadow-sm hover:border-amber-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500';

const PilotDirectoryPageV2: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [allProfessionals, setAllProfessionals] = useState<Professional[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [selLocations, setSelLocations] = useState<string[]>([]);
  const perPage = 12;
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    const url = PROFESSIONAL_API ? `${PROFESSIONAL_API}/professional-dashboard-cards?viewType=main` : `${LAMBDA.professional}/professional-dashboard-cards?viewType=main`;
    fetch(url, { signal: controller.signal })
      .then(r => r.json())
      .then(data => {
        const professionals = Array.isArray(data.cards) ? data.cards : [];
        const seenPIds = new Set<string>();
        const seenPNames = new Set<string>();
        const unique = professionals.filter((p: any) => {
          const id = (p.professionalId || '').toLowerCase().trim();
          const name = (p.fullName || p.professionalName || '').toLowerCase().trim();
          if (id && seenPIds.has(id)) return false;
          if (name && seenPNames.has(name)) return false;
          if (id) seenPIds.add(id);
          if (name) seenPNames.add(name);
          return true;
        });
        setAllProfessionals(unique);
      })
      .catch(() => setAllProfessionals([]))
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const filtered = React.useMemo(() => {
    let list = allProfessionals;
    if (selectedCategory !== "All") list = list.filter(p => (getCategory(p) || "").toLowerCase() === selectedCategory.toLowerCase());
    if (selLocations.length) list = list.filter(p => selLocations.includes(p.location || ''));
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => p.fullName?.toLowerCase().includes(q) || p.professionalName?.toLowerCase().includes(q) || p.location?.toLowerCase().includes(q));
    }
    return list;
  }, [allProfessionals, selectedCategory, selLocations, searchQuery]);

  useEffect(() => { setCurrentPage(1); }, [selectedCategory, selLocations, searchQuery]);

  const first = (currentPage - 1) * perPage;
  const current = filtered.slice(first, first + perPage);
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const categories = ["All"].concat(Array.from(new Set(allProfessionals.map(getCategory).filter((c): c is string => !!c))));
  const locationCounts: Record<string, number> = {};
  allProfessionals.forEach(p => { if (p.location && p.location !== 'Location Not Specified') locationCounts[p.location] = (locationCounts[p.location] || 0) + 1; });
  const topLocations = Object.keys(locationCounts).sort((a, b) => locationCounts[b] - locationCounts[a]).slice(0, 5);

  const toggleLocation = (loc: string) => setSelLocations(p => p.includes(loc) ? p.filter(x => x !== loc) : [...p, loc]);
  const resetFilters = () => { setSearchQuery(''); setSelectedCategory('All'); setSelLocations([]); };

  const goToProfile = (p: Professional) => {
    const slug = p.urlSlug || p.userName;
    if (p.templateSelection === "template-2") navigate(`/professionals/${slug}`);
    else navigate(`/professional/${slug}`);
  };

  if (loading) return <LoadingScreen logoSrc="/images/logo.png" loadingText="Loading Pilot Directory..." />;

  const dgcaCategoryCount = allProfessionals.filter(p => /dgca|pilot/i.test(getCategory(p) || '')).length;

  return (
    <div style={PAGE_BG} className="min-h-screen">
      <div className="mt-[108px]" />

      <section aria-label="Pilot directory statistics" className="flex min-h-[64px] flex-wrap items-center gap-3 bg-[#0c1220] px-3 py-2 text-white sm:px-6">
        <div className="flex w-[calc(50%-0.5rem)] shrink-0 items-center gap-2 border-r border-yellow-500/20 pr-2 sm:w-auto sm:min-w-[160px]">
          <Briefcase className="size-6 shrink-0 text-yellow-400" />
          <span className="flex flex-col">
            <strong className="text-base leading-tight text-white">{allProfessionals.length.toLocaleString('en-IN')}</strong>
            <small className="text-[9.5px] leading-tight text-slate-300">Registered Pilots</small>
          </span>
        </div>
        <div className="flex w-[calc(50%-0.5rem)] shrink-0 items-center gap-2 border-r border-yellow-500/20 pr-2 sm:w-auto sm:min-w-[160px]">
          <Award className="size-6 shrink-0 text-yellow-400" />
          <span className="flex flex-col">
            <strong className="text-base leading-tight text-white">{dgcaCategoryCount.toLocaleString('en-IN')}</strong>
            <small className="text-[9.5px] leading-tight text-slate-300">DGCA Certified</small>
          </span>
        </div>
        <button type="button" onClick={() => navigate("/professional/form")} className="flex h-9 shrink-0 items-center justify-center rounded-lg bg-[#ffdf00] px-4 text-sm font-extrabold text-black">+ Add Your Profile</button>
        <div className="ml-auto shrink-0 text-right">
          <strong className="block text-sm leading-tight text-yellow-300">India&rsquo;s Pilot Directory</strong>
          <span className="block text-[11px] text-sky-300">Free profile · Discovered by companies hiring pilots</span>
        </div>
      </section>

      <section style={PAGE_BG} className="flex flex-wrap items-center gap-2 px-3 py-3 sm:px-6">
        <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1">
          <button type="button" onClick={() => setSidebarOpen(true)} className={`${BTN} flex shrink-0 items-center gap-1 text-xs lg:hidden`}>Filters <ChevronDown className="size-4" /></button>
          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            <ToolbarFilterDropdown label="Category" options={categories.filter(c => c !== 'All')} selected={selectedCategory === 'All' ? [] : [selectedCategory]} onToggle={v => setSelectedCategory(v)} buttonClassName={`${BTN} flex items-center gap-4 text-xs`} />
            {topLocations.length > 0 && <ToolbarFilterDropdown label="Location" options={topLocations} selected={selLocations} onToggle={toggleLocation} buttonClassName={`${BTN} flex items-center gap-4 text-xs`} />}
          </div>
        </div>
        <label className="flex h-10 w-full items-center overflow-hidden rounded-lg border border-slate-200 bg-white md:w-[min(100%,360px)]">
          <span className="sr-only">Search pilots</span>
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search pilots, locations..." className="min-w-0 flex-1 px-3 text-sm outline-none" />
          <span className="flex h-full w-11 items-center justify-center bg-[#ffdf00]"><Search className="size-5" /></span>
        </label>
      </section>

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
                {categories.map(cat => (
                  <button key={cat} type="button" onClick={() => setSelectedCategory(cat)} className={`rounded-full border px-3 py-1.5 text-[11px] ${selectedCategory === cat ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white hover:border-yellow-500'}`}>{cat}</button>
                ))}
              </div>
            </section>

            {topLocations.length > 0 && (
              <section className="mb-4 border-b border-slate-200 pb-3">
                <h3 className="mb-3 text-xs font-extrabold">LOCATION</h3>
                <div className="space-y-2">
                  {topLocations.map(loc => (
                    <label key={loc} className="flex cursor-pointer items-center gap-2 text-xs">
                      <input type="checkbox" checked={selLocations.includes(loc)} onChange={() => toggleLocation(loc)} className="accent-amber-500" />
                      {loc} ({locationCounts[loc]})
                    </label>
                  ))}
                </div>
              </section>
            )}

            <button type="button" onClick={() => setSidebarOpen(false)} className="w-full rounded-lg bg-yellow-400 py-2 text-xs font-bold">Apply Filters</button>
            <button type="button" onClick={resetFilters} className="mt-2 w-full rounded-lg border bg-white py-2 text-xs font-bold">Reset Filters</button>
          </div>
        </aside>

        <section className="min-w-0">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h1 className="text-base font-extrabold">{filtered.length} Drone Pilots / Trainers</h1>
            <div className="flex gap-1">
              <button type="button" onClick={() => setView('grid')} aria-label="Grid view" className={`${view === 'grid' ? 'bg-slate-900 text-white' : 'bg-white'} rounded border px-2 py-1`}><Grid3x3 className="size-4" /></button>
              <button type="button" onClick={() => setView('list')} aria-label="List view" className={`${view === 'list' ? 'bg-slate-900 text-white' : 'bg-white'} rounded border px-2 py-1`}><List className="size-4" /></button>
            </div>
          </div>

          {current.length === 0 ? (
            <p className="rounded-lg bg-white p-8 text-center">No pilots found.</p>
          ) : (
            <div className={`grid gap-3 ${view === 'list' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'}`}>
              {withInlineAds(current, (p, idx) => (
                <ProfessionalCardV2 key={`pilot-${p.professionalId}-${idx}`} professional={p} onClick={() => goToProfile(p)} />
              ))}
            </div>
          )}

          <div className="mt-5 grid min-w-0 grid-cols-1 items-center gap-4 rounded-lg px-3 py-5 sm:px-5 lg:grid-cols-[1fr_auto_1fr]">
            <strong className="text-sm">Showing {filtered.length ? first + 1 : 0}–{Math.min(first + perPage, filtered.length)} of {filtered.length.toLocaleString('en-IN')} pilots</strong>
            <nav aria-label="pilots pagination" className="flex min-w-0 flex-wrap items-center justify-center gap-1.5">
              <button type="button" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="grid h-9 min-w-9 place-items-center rounded-md border border-amber-300 bg-white text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft className="size-4" /></button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1).reduce<(number | '...')[]>((acc, p, i, arr) => { if (i > 0 && (p as number) - (arr[i - 1] as number) > 1) acc.push('...'); acc.push(p); return acc; }, []).map((p, i) => p === '...' ? <span key={`e${i}`} className="px-1">…</span> : (
                <button key={p} type="button" onClick={() => setCurrentPage(p as number)} className={`grid h-9 min-w-9 place-items-center rounded-md border px-2 text-sm font-semibold shadow-sm ${currentPage === p ? 'border-slate-900 bg-slate-900 text-white' : 'border-amber-300 bg-white text-slate-900 hover:bg-amber-50'}`}>{(p as number).toLocaleString('en-IN')}</button>
              ))}
              <button type="button" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="grid h-9 min-w-9 place-items-center rounded-md border border-amber-300 bg-white text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"><ChevronRight className="size-4" /></button>
            </nav>
            <span className="lg:justify-self-end" />
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

export default PilotDirectoryPageV2;
