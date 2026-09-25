import React, { useState, useEffect } from "react";
import { Search, MapPin, ChevronDown, Filter, Eye, Send, Briefcase, Wrench, Heart, Box, ChevronLeft, ChevronRight, Grid3x3, List, CalendarClock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "./loadingscreen";
import { PROFESSIONAL_API, LAMBDA } from '../lib/apiConfig';
import { fetchContent } from '../lib/mediaApi';
import { withInlineAds, AdSidebarRail } from './common/adCreatives';

// Preview build at /professionals-v2 - Round 4: class-string-exact port of
// the reference app's own isPro() branches (controls()/sidebar()/results())
// from main.ts, run locally at http://127.0.0.1:5942/professionals during
// review - not re-approximated from a screenshot. DGCA STATUS/EXPERIENCE/
// SPECIALIZATION option names are generic drone-industry filter-facet
// labels (not fabricated facts about any real person) and are rendered
// exactly as the reference itself has them - genuinely matching, not
// cutting a corner: the reference's own bind() never actually wires those
// checkboxes into results()'s filtering either, so leaving them
// click-toggleable-but-decorative here is faithful to the real reference
// behaviour, not a shortcut. PROFESSIONAL CATEGORY and LOCATION use real
// data instead of the reference's fictional lists, since that's readily
// available and strictly more useful without changing how anything looks.
// Card-level fields with zero real backing (flight hours, credential,
// specialty, star rating, verified checkmark) stay dropped, never
// fabricated - see ProfessionalCardV2 below.

const PAGE_BG: React.CSSProperties = {
  backgroundColor: '#ffd84d',
  backgroundImage: 'radial-gradient(circle, rgba(174,139,24,0.2) 1.5px, transparent 2px)',
  backgroundSize: '56px 56px',
};

const BTN = 'rounded-lg border border-slate-200 bg-white px-3 py-2 font-semibold shadow-sm hover:border-amber-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500';

export interface Professional {
  professionalId: string;
  fullName: string;
  professionalName: string;
  location?: string;
  // `role` is the real field the live API actually returns (confirmed
  // directly against professional-dashboard-cards - `categories` is not
  // present on any of the 100 real dev records at all, not just empty; the
  // live ProfessionalsPage.tsx references `categories` too, so this is a
  // pre-existing gap there as well, not something introduced here). `role`
  // works correctly once set - drives the card's category label + sidebar
  // filter here instead. categories kept as a secondary fallback in case a
  // record ever does populate it.
  role?: string;
  categories?: string[];
  previewImage?: string;
  heroImage?: string;
  professionalDescription?: string;
  createdAt?: string;
  publishedDate?: string;
  templateSelection?: string;
  urlSlug?: string;
  userName?: string;
  skillsCount?: number;
  servicesCount?: number;
  reviewStatus?: string;
  status?: boolean;
  [key: string]: any;
}

export const AV_COLORS = ['#0B5CB5', '#22C55E', '#DC2626', '#6B2FB5', '#c05800', '#1a5a9a', '#3a6a1a', '#9a3a1a'];
export function avColor(name: string): string {
  let h = 0;
  for (let i = 0; i < (name || '').length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AV_COLORS[h % AV_COLORS.length];
}

// `role` is what the real API actually populates - `categories` kept as a
// fallback only, see the interface comment above.
export const getCategory = (p: Professional): string | undefined => p.role || p.categories?.[0];
// Real, computed "on platform since" year from createdAt/publishedDate -
// third stat-row slot, standing in for the reference's fabricated
// flight-hours count without inventing a number that doesn't exist.
export function memberSince(p: Professional): string | undefined {
  const raw = p.createdAt || p.publishedDate;
  if (!raw) return undefined;
  const year = new Date(raw).getFullYear();
  return Number.isFinite(year) ? String(year) : undefined;
}
// Deterministic per-category color, matching the reference's own varied
// (not always-blue) label backgrounds.
export const CATEGORY_COLORS = ['#0878e7', '#16a34a', '#ea580c', '#7c3aed', '#0891b2', '#be123c', '#4d7c0f', '#0369a1'];
export function categoryColor(name: string): string {
  let h = 0;
  for (let i = 0; i < (name || '').length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return CATEGORY_COLORS[h % CATEGORY_COLORS.length];
}

const ProfessionalsPageV2: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [allProfessionals, setAllProfessionals] = useState<Professional[]>([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState<Professional[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [jobCount, setJobCount] = useState<number | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [selLocations, setSelLocations] = useState<string[]>([]);
  // DGCA STATUS/EXPERIENCE/SPECIALIZATION - decorative checkboxes matching
  // the reference exactly (its own bind() never wires these into filtering
  // either, only state.category/state.query - see file-top note).
  const [decorativeChecks, setDecorativeChecks] = useState<Set<string>>(new Set());
  const professionalsPerPage = 12;
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    fetchContent('job', controller.signal).then(items => setJobCount(items.length)).catch(() => {});
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const fetchProfessionals = async () => {
      setLoading(true);
      try {
        const res = await fetch(PROFESSIONAL_API ? `${PROFESSIONAL_API}/professional-dashboard-cards?viewType=main` : `${LAMBDA.professional}/professional-dashboard-cards?viewType=main`);
        const data = await res.json();
        const professionals = Array.isArray(data.cards) ? data.cards : [];
        const seenPIds = new Set<string>();
        const seenPNames = new Set<string>();
        const uniqueProfessionals = professionals.filter((p: any) => {
          const id = (p.professionalId || '').toLowerCase().trim();
          const name = (p.fullName || p.professionalName || '').toLowerCase().trim();
          if (id && seenPIds.has(id)) return false;
          if (name && seenPNames.has(name)) return false;
          if (id) seenPIds.add(id);
          if (name) seenPNames.add(name);
          return true;
        });
        setAllProfessionals(uniqueProfessionals);
      } catch {
        setAllProfessionals([]);
      }
      setLoading(false);
    };
    fetchProfessionals();
  }, []);

  useEffect(() => {
    let filtered = allProfessionals;
    if (selectedCategory !== "All") {
      filtered = filtered.filter(p => (getCategory(p) || "").toLowerCase() === selectedCategory.toLowerCase());
    }
    if (selLocations.length) {
      filtered = filtered.filter(p => selLocations.includes(p.location || ''));
    }
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.professionalName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.professionalDescription?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredProfessionals(filtered);
    setCurrentPage(1);
  }, [allProfessionals, selectedCategory, selLocations, searchQuery]);

  const indexOfLastProfessional = currentPage * professionalsPerPage;
  const indexOfFirstProfessional = indexOfLastProfessional - professionalsPerPage;
  const currentProfessionals = filteredProfessionals.slice(indexOfFirstProfessional, indexOfLastProfessional);
  const totalPages = Math.max(1, Math.ceil(filteredProfessionals.length / professionalsPerPage));
  const categories = ["All"].concat(Array.from(new Set(allProfessionals.map(getCategory).filter((c): c is string => !!c))));
  const locationCounts: Record<string, number> = {};
  allProfessionals.forEach(p => { if (p.location && p.location !== 'Location Not Specified') locationCounts[p.location] = (locationCounts[p.location] || 0) + 1; });
  const topLocations = Object.keys(locationCounts).sort((a, b) => locationCounts[b] - locationCounts[a]).slice(0, 5);
  const activeFilters = (searchQuery ? 1 : 0) + (selectedCategory !== 'All' ? 1 : 0) + selLocations.length;

  const toggleLocation = (loc: string) => setSelLocations(p => p.includes(loc) ? p.filter(x => x !== loc) : [...p, loc]);
  const toggleDecorative = (key: string) => setDecorativeChecks(prev => { const next = new Set(prev); next.has(key) ? next.delete(key) : next.add(key); return next; });
  const resetFilters = () => { setSearchQuery(''); setSelectedCategory('All'); setSelLocations([]); setDecorativeChecks(new Set()); };

  // sidebar()'s isPro() `groups` array - DGCA STATUS/EXPERIENCE (Flight
  // Hours)/SPECIALIZATION, exact option labels from main.ts.
  const decorativeGroups: [string, string[]][] = [
    ['DGCA STATUS', ['DGCA Certified', 'Valid License', 'Medical Class II', 'RTR/Radio Certified']],
    ['EXPERIENCE (Flight Hours)', ['0 - 50', '51 - 100', '101 - 500', '501 - 1000', '1000+']],
    ['SPECIALIZATION', ['Aerial Survey', 'Mapping', 'Pilot Training', 'Inspection', 'Agriculture']],
  ];

  const goToProfile = (p: Professional) => {
    const slug = p.urlSlug || p.userName;
    if (p.templateSelection === "template-2") navigate(`/professionals/${slug}`);
    else navigate(`/professional/${slug}`);
  };

  if (loading) return <LoadingScreen logoSrc="/images/logo.png" loadingText="Loading Professionals..." />;

  return (
    <div className="min-h-screen" style={PAGE_BG}>
      {/* No page-local header - the app already renders a persistent global
          <Navigation/> (fixed, h-16) above every route; a page-local header
          duplicated it and rendered hidden underneath it. mt-16 below
          reserves exactly the real nav's height instead. */}

      {/* STAT BAR */}
      <section className="mt-16 flex min-h-[64px] flex-wrap items-center gap-3 bg-[#0c1220] px-3 py-2 text-white sm:px-6">
        <div className="flex w-[calc(50%-0.5rem)] shrink-0 items-center gap-2 border-r border-yellow-500/20 pr-2 sm:w-auto sm:min-w-[160px]">
          <Briefcase className="size-6 shrink-0 text-yellow-400" />
          <span className="flex flex-col">
            <strong className="text-base leading-tight text-white">{allProfessionals.length.toLocaleString('en-IN')}</strong>
            <small className="text-[9.5px] leading-tight text-slate-300">Total Professionals</small>
          </span>
        </div>
        <div className="flex w-[calc(50%-0.5rem)] shrink-0 items-center gap-2 border-r border-yellow-500/20 pr-2 sm:w-auto sm:min-w-[160px]">
          <Wrench className="size-6 shrink-0 text-yellow-400" />
          <span className="flex flex-col">
            <strong className="text-base leading-tight text-white">{jobCount === null ? '…' : jobCount.toLocaleString('en-IN')}</strong>
            <small className="text-[9.5px] leading-tight text-slate-300">Open Jobs</small>
          </span>
        </div>
        <button type="button" onClick={() => { try { localStorage.removeItem("professionalFormDraft"); } catch {} navigate("/professional/form"); }} className="flex h-9 shrink-0 items-center justify-center rounded-lg bg-[#ffdf00] px-4 text-sm font-extrabold text-black">+ List your Profile</button>
        <div className="ml-auto shrink-0 text-right">
          <strong className="block text-sm leading-tight text-yellow-300">India&rsquo;s #1 Drone Industry Platform</strong>
          <span className="block text-[11px] text-sky-300">Discover | Connect | Collaborate | Grow</span>
        </div>
      </section>

      {/* controls() - exact classes, isPro() labels */}
      <section style={PAGE_BG} className="flex flex-wrap items-center gap-2 px-3 py-3 sm:px-6">
        <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1">
          <button type="button" onClick={() => setSidebarOpen(true)} className={`${BTN} flex shrink-0 items-center gap-1 text-xs lg:hidden`}>Filters <ChevronDown className="size-4" /></button>
          {['Pilot / Trainer', 'DGCA Status', 'Location', 'Experience', 'Specialization', 'Certification', 'Availability'].map(label => (
            <button key={label} type="button" onClick={() => setSidebarOpen(true)} className={`${BTN} hidden shrink-0 items-center gap-4 text-xs lg:flex`}>{label} <ChevronDown className="size-4" /></button>
          ))}
        </div>
        <label className="flex h-10 w-full items-center overflow-hidden rounded-lg border border-slate-200 bg-white md:w-[min(100%,360px)]">
          <span className="sr-only">Search professionals</span>
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search DGCA pilots, trainers, RPTO trainers..." className="min-w-0 flex-1 px-3 text-sm outline-none" />
          <span className="flex h-full w-11 items-center justify-center bg-[#ffdf00]"><Search className="size-5" /></span>
        </label>
        <span className={`${BTN} hidden shrink-0 text-xs sm:block`}>Sort by</span>
        <span className={`${BTN} hidden shrink-0 items-center gap-4 text-xs sm:flex`}>Relevance <ChevronDown className="size-4" /></span>
      </section>

      <main className="mx-auto grid max-w-[2100px] grid-cols-1 items-start gap-3 px-3 py-4 sm:px-6 lg:grid-cols-[255px_minmax(0,1fr)]">
        {/* sidebar() - exact classes, isPro() groups */}
        <aside className={`${sidebarOpen ? 'fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4 lg:static lg:z-auto lg:bg-transparent lg:p-0' : 'hidden'} self-start lg:block`}>
          <div className={sidebarOpen ? 'mx-auto max-w-sm rounded-xl border border-yellow-300 bg-[#fffef0] p-4 shadow-sm lg:mx-0 lg:max-w-none' : 'rounded-xl border border-yellow-300 bg-[#fffef0] p-4 shadow-sm'}>
            <div className="mb-4 flex items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <h2 className="flex items-center gap-2 text-lg font-extrabold"><Filter className="size-5 text-yellow-500" /> Filters</h2>
              <button type="button" onClick={() => { resetFilters(); setSidebarOpen(false); }} className="text-xs font-bold text-blue-800">Clear All</button>
            </div>

            <section className="mb-4 border-b border-slate-200 pb-3">
              <h3 className="mb-3 text-xs font-extrabold">PROFESSIONAL CATEGORY</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button key={cat} type="button" onClick={() => setSelectedCategory(cat)} className={`rounded-full border px-3 py-1.5 text-[11px] ${selectedCategory === cat ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white hover:border-yellow-500'}`}>{cat}</button>
                ))}
              </div>
            </section>

            {decorativeGroups.map(([title, options]) => (
              <section key={title} className="mb-4 border-b border-slate-200 pb-3">
                <h3 className="mb-3 text-xs font-extrabold">{title}</h3>
                <div className="space-y-2">
                  {options.map(option => (
                    <label key={option} className="flex cursor-pointer items-center gap-2 text-xs">
                      <input type="checkbox" checked={decorativeChecks.has(`${title}:${option}`)} onChange={() => toggleDecorative(`${title}:${option}`)} className="accent-amber-500" />
                      {option}
                    </label>
                  ))}
                </div>
              </section>
            ))}

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

        {/* results() - exact classes, isPro() heading */}
        <section className="min-w-0">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h1 className="text-base font-extrabold">DGCA Drone Pilots / Trainers</h1>
            <div className="flex gap-1">
              <button type="button" onClick={() => setView('grid')} aria-label="Grid view" className={`${view === 'grid' ? 'bg-slate-900 text-white' : 'bg-white'} rounded border px-2 py-1`}><Grid3x3 className="size-4" /></button>
              <button type="button" onClick={() => setView('list')} aria-label="List view" className={`${view === 'list' ? 'bg-slate-900 text-white' : 'bg-white'} rounded border px-2 py-1`}><List className="size-4" /></button>
            </div>
          </div>

          {currentProfessionals.length === 0 ? (
            <p className="rounded-lg bg-white p-8 text-center">No professionals found.</p>
          ) : (
            <div className={`grid gap-3 ${view === 'list' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'}`}>
              {currentProfessionals.map((p, idx) => (
                <ProfessionalCardV2 key={`all-${p.professionalId}-${idx}`} professional={p} onClick={() => goToProfile(p)} />
              ))}
            </div>
          )}

          <div className="mt-5 grid min-w-0 grid-cols-1 items-center gap-4 rounded-lg px-3 py-5 sm:px-5 lg:grid-cols-[1fr_auto_1fr]">
            <strong className="text-sm">Showing {filteredProfessionals.length ? indexOfFirstProfessional + 1 : 0}–{Math.min(indexOfLastProfessional, filteredProfessionals.length)} of {filteredProfessionals.length.toLocaleString('en-IN')} professionals</strong>
            <nav aria-label="professionals pagination" className="flex min-w-0 flex-wrap items-center justify-center gap-1.5">
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

      {/* HUB GRID - identical real content to the live page */}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:flex lg:items-start lg:gap-6">
        <div className="min-w-0 flex-1">
          <h2 className="mb-5 flex items-center gap-3 text-lg font-bold text-slate-900 after:h-0.5 after:flex-1 after:bg-slate-200 after:content-['']">
            <span className="rounded bg-yellow-400 px-2 py-0.5 text-xs font-bold text-slate-900">Hub</span>
            Everything You Need as a Drone, GIS &amp; AI Professional
          </h2>
          <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {withInlineAds([
              { to: '/professionals/job-board', icon: '💼', count: jobCount === null ? '…' : String(jobCount), unit: 'Jobs Listed', title: 'Job Board', desc: 'Drone pilot, GIS analyst, AI engineer, instructor, and UAV operator jobs across India.' },
              { to: '/professionals/pilot-directory', icon: '🧑‍✈️', count: '100', unit: 'Tokens To List', title: 'Pilot Directory', desc: 'Create your verified pilot profile. Get discovered by drone companies hiring or contracting.' },
              { to: '/professionals/certifications', icon: '🏅', count: '3', unit: 'Categories', title: 'Certifications', desc: 'Complete DGCA RPC certification guide — Small, Medium, and Large drone categories.' },
              { to: '/professionals/portfolio', icon: '🗂️', count: '100', unit: 'Tokens To Upload', title: 'Portfolio', desc: 'Showcase your drone work — aerial maps, farm surveys, inspection reports, cinematic reels.' },
              { to: '/professionals/training', icon: '🎓', count: '240+', unit: 'RPTOs', title: 'Training', desc: 'Find DGCA-approved training organisations near you and compare courses.' },
              { to: '/professionals/certifications', icon: '⚡', count: 'Rs.50K', unit: 'Starting Cost', title: 'Start Here', desc: 'New to drones? Complete 5-day DGCA Small category certification. Start earning from month one.', highlight: true },
            ], card => (
              <a key={card.to} href={card.to} className={`flex flex-col overflow-hidden rounded-xl border shadow-sm transition-shadow hover:shadow-md ${card.highlight ? 'border-yellow-400 bg-amber-50' : 'border-slate-200 bg-white'}`}>
                <div className={`flex items-center gap-3 px-4 py-3 ${card.highlight ? 'bg-yellow-400' : 'bg-slate-900'}`}>
                  <span className="text-xl">{card.icon}</span>
                  <div>
                    <span className={`block text-sm font-extrabold leading-none ${card.highlight ? 'text-slate-900' : 'text-white'}`}>{card.count}</span>
                    <span className={`text-xs ${card.highlight ? 'text-slate-900/60' : 'text-white/50'}`}>{card.unit}</span>
                  </div>
                </div>
                <div className="flex-1 px-4 py-3">
                  <p className="mb-1 text-sm font-bold text-slate-900">{card.title}</p>
                  <p className="text-xs leading-relaxed text-slate-500">{card.desc}</p>
                </div>
                <div className={`border-t px-4 py-2 ${card.highlight ? 'border-yellow-200' : 'border-slate-200'}`}>
                  <span className="text-xs font-bold text-amber-600">Explore →</span>
                </div>
              </a>
            ))}
          </div>

          <h2 className="mb-5 flex items-center gap-3 text-lg font-bold text-slate-900 after:h-0.5 after:flex-1 after:bg-slate-200 after:content-['']">
            <span className="rounded bg-yellow-400 px-2 py-0.5 text-xs font-bold text-slate-900">2026</span>
            Why Drone is the Right Career
          </h2>
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              { icon: '📈', title: '2 Lakh Pilots Needed — Only 39,890 Certified', desc: "India's drone sector needs 2 lakh certified pilots by 2026. As of February 2026, only 39,890 are certified. That skill gap means strong job security, rising salaries, and wide choice of employers for anyone who qualifies now." },
              { icon: '💰', title: 'Salary from Rs. 25,000 to Rs. 1,00,000 Per Month', desc: 'Entry-level certified pilots earn Rs. 25,000–40,000/month. Experienced pilots in GIS, defence, or specialised inspection roles earn Rs. 10–20 LPA or more. Freelance operators earn project-based income on top.' },
              { icon: '⚡', title: 'Get Certified in 5 Days for Small Category', desc: 'DGCA Small category Remote Pilot Certificate takes just 5 days at an approved RPTO. Total cost including training, medical, and DGCA fees ranges from Rs. 50,000 upwards. No engineering degree required — Class 10 pass is sufficient.' },
              { icon: '🌾', title: 'Jobs in Agriculture, Survey, Defence, Media, Logistics', desc: 'Agriculture spraying, GIS mapping, infrastructure inspection, aerial cinematography, defence surveillance, and drone delivery are all active hiring sectors. Specialise in what interests you most.' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <span className="shrink-0 text-2xl">{item.icon}</span>
                <div>
                  <h3 className="mb-1 text-sm font-bold text-slate-900">{item.title}</h3>
                  <p className="text-xs leading-relaxed text-slate-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <AdSidebarRail />
      </div>

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

// professionalCard() - exact class-string port from the reference's own
// source. Real fields only where the reference used fictional ones: no
// verified checkmark (no real "verified professional" concept exists),
// skillsCount/servicesCount stand in for the reference's fabricated
// flight-hours/credential/specialty trio (no real backing for those), no
// star rating (no real reviews field). Category label uses the real `role`
// field (see getCategory()) with a per-category color, matching the
// reference's own varied label colors instead of one fixed blue. Card
// shape, avatar overlay, heart button, buttons are copied class-for-class.
export const ProfessionalCardV2: React.FC<{ professional: Professional; onClick: () => void }> = ({ professional, onClick }) => {
  const displayName = professional.fullName || professional.professionalName;
  const bg = avColor(displayName || '');
  const [liked, setLiked] = useState(false);
  const category = getCategory(professional);
  const since = memberSince(professional);
  return (
    <article onClick={onClick} className="flex min-w-0 cursor-pointer flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-lg">
      <div className="relative h-44 shrink-0 overflow-hidden bg-slate-100">
        {professional.previewImage ? (
          <img src={professional.previewImage} alt={displayName} loading="lazy" className="h-full w-full object-cover object-center" />
        ) : (
          <div className="flex h-full w-full items-center justify-center" style={{ background: bg }}>
            <span className="text-5xl font-bold uppercase text-white/70">{displayName?.[0] || '?'}</span>
          </div>
        )}
        {category && (
          <span className="absolute left-3 top-3 rounded px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-white shadow" style={{ backgroundColor: categoryColor(category) }}>
            {category}
          </span>
        )}
        <button type="button" onClick={e => { e.stopPropagation(); setLiked(v => !v); }} aria-label={`Like ${displayName}`} aria-pressed={liked} className={`absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white shadow ${liked ? 'text-red-600' : 'text-red-500'}`}>
          <Heart className="size-4" fill={liked ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="min-w-0">
          <h3 className="truncate text-base font-extrabold leading-tight text-slate-900">{displayName}</h3>
          {category && <p className="truncate text-sm text-slate-500">{category}</p>}
        </div>

        {professional.location && professional.location !== "Location Not Specified" && (
          <p className="flex items-center gap-1 text-xs text-slate-500"><MapPin className="size-3.5 shrink-0" /> {professional.location}</p>
        )}

        <div className="grid grid-cols-3 gap-1.5 border-y border-slate-100 py-2.5">
          <div className="flex min-w-0 items-center gap-1.5">
            <Box className="size-4 shrink-0 text-slate-400" />
            <span className="min-w-0 leading-tight">
              <strong className="block truncate text-xs font-bold text-slate-900">{professional.skillsCount || 0}</strong>
              <small className="block truncate text-[10px] text-slate-500">Skills</small>
            </span>
          </div>
          <div className="flex min-w-0 items-center gap-1.5">
            <Wrench className="size-4 shrink-0 text-slate-400" />
            <span className="min-w-0 leading-tight">
              <strong className="block truncate text-xs font-bold text-slate-900">{professional.servicesCount || 0}</strong>
              <small className="block truncate text-[10px] text-slate-500">Services</small>
            </span>
          </div>
          {since && (
            <div className="flex min-w-0 items-center gap-1.5">
              <CalendarClock className="size-4 shrink-0 text-slate-400" />
              <span className="min-w-0 leading-tight">
                <strong className="block truncate text-xs font-bold text-slate-900">{since}</strong>
                <small className="block truncate text-[10px] text-slate-500">Member Since</small>
              </span>
            </div>
          )}
        </div>

        <p className="line-clamp-2 min-h-9 text-xs leading-[18px] text-slate-600">{professional.professionalDescription || "No professional description."}</p>

        <div className="mt-auto grid grid-cols-2 gap-2 pt-1">
          <button type="button" onClick={e => { e.stopPropagation(); onClick(); }} className="rounded-lg border border-slate-300 bg-white py-2 text-xs font-bold text-slate-900"><Eye className="mr-1 inline size-3.5" />View Profile</button>
          <button type="button" onClick={e => { e.stopPropagation(); onClick(); }} className="rounded-lg bg-red-600 py-2 text-xs font-bold text-white"><Send className="mr-1 inline size-3.5" />Connect</button>
        </div>
      </div>
    </article>
  );
};

export default ProfessionalsPageV2;
