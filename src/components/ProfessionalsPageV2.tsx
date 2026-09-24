import React, { useState, useEffect } from "react";
import { Search, MapPin, SlidersHorizontal, X, Menu, UserRound, Globe2, ChevronDown, Filter, Eye, Send, Briefcase, Wrench } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import LoadingScreen from "./loadingscreen";
import { PROFESSIONAL_API, LAMBDA } from '../lib/apiConfig';
import { fetchContent } from '../lib/mediaApi';
import { withInlineAds, AdSidebarRail } from './common/adCreatives';

// Preview build at /professionals-v2 - same real data/API/filter logic as
// the live ProfessionalsPage.tsx, restyled with Tailwind utility classes
// matching the uploaded design. The uploaded mockup's professional card
// shows DGCA-specific fields (flight hours, credential, specialty, star
// rating) that have no real backing field on today's Professional record
// (only fullName, location, categories, professionalDescription,
// skillsCount, servicesCount exist) - rather than fabricate those, this
// keeps the visual card shell (photo header, avatar, tags, stat row,
// buttons) but fills it with the same real fields the live page already
// shows. Not wired into the real /professionals route - review only.

interface Professional {
  professionalId: string;
  fullName: string;
  professionalName: string;
  location?: string;
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

const NAV_ITEMS = ['Home', 'About Us', 'Companies', 'Products', 'Services', 'Professionals', 'Events', 'Partnerships', 'Media Hub', 'Advertising Plans', 'Contact'];

const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#ffd84d',
  backgroundImage: 'radial-gradient(circle, rgba(174,139,24,.35) 1.5px, transparent 2px)',
  backgroundSize: '28px 28px',
};

const AV_COLORS = ['#0B5CB5', '#22C55E', '#DC2626', '#6B2FB5', '#c05800', '#1a5a9a', '#3a6a1a', '#9a3a1a'];
function avColor(name: string): string {
  let h = 0;
  for (let i = 0; i < (name || '').length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AV_COLORS[h % AV_COLORS.length];
}

const ProfessionalsPageV2: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [allProfessionals, setAllProfessionals] = useState<Professional[]>([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState<Professional[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [jobCount, setJobCount] = useState<number | null>(null);
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
      filtered = filtered.filter(p => (p.categories?.[0] || "").toLowerCase() === selectedCategory.toLowerCase());
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
  }, [allProfessionals, selectedCategory, searchQuery]);

  const indexOfLastProfessional = currentPage * professionalsPerPage;
  const indexOfFirstProfessional = indexOfLastProfessional - professionalsPerPage;
  const currentProfessionals = filteredProfessionals.slice(indexOfFirstProfessional, indexOfLastProfessional);
  const totalPages = Math.max(1, Math.ceil(filteredProfessionals.length / professionalsPerPage));
  const categories = ["All"].concat(Array.from(new Set(allProfessionals.flatMap(p => p.categories ?? []))));
  const activeFilters = (searchQuery ? 1 : 0) + (selectedCategory !== 'All' ? 1 : 0);

  const goToProfile = (p: Professional) => {
    const slug = p.urlSlug || p.userName;
    if (p.templateSelection === "template-2") navigate(`/professionals/${slug}`);
    else navigate(`/professional/${slug}`);
  };

  const chip = (on: boolean) =>
    `rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors ${on ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white hover:border-amber-500'}`;

  if (loading) return <LoadingScreen logoSrc="/images/logo.png" loadingText="Loading Professionals..." />;

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
            <a key={item} href="#" className={`rounded px-1 py-2 text-[11px] font-bold whitespace-nowrap hover:bg-yellow-300 ${item === 'Professionals' ? 'underline underline-offset-4' : ''}`}>{item}</a>
          ))}
        </nav>
        <div className="hidden shrink-0 items-center gap-4 text-xs font-bold 2xl:flex">
          <Search className="size-5" />
          <span className="flex items-center gap-1"><UserRound className="size-5" /> Account</span>
          <span className="flex items-center gap-1"><Globe2 className="size-5" /> English <ChevronDown className="size-3" /></span>
        </div>
      </header>

      {/* STAT BAR */}
      <section className="flex min-h-[77px] flex-wrap items-center gap-3 bg-[#07130f] px-3 py-2 text-white sm:px-6">
        <div className="flex w-[calc(50%-0.5rem)] shrink-0 items-center gap-2 border-r border-yellow-500/25 pr-2 sm:w-[calc(33.333%-0.7rem)] xl:w-auto xl:min-w-[160px]">
          <Briefcase className="size-7 shrink-0 text-yellow-400" />
          <span className="flex flex-col">
            <small className="text-[10px] leading-tight">Total Professionals</small>
            <strong className="text-lg leading-tight text-yellow-300">{allProfessionals.length.toLocaleString('en-IN')}</strong>
          </span>
        </div>
        <div className="flex w-[calc(50%-0.5rem)] shrink-0 items-center gap-2 border-r border-yellow-500/25 pr-2 sm:w-[calc(33.333%-0.7rem)] xl:w-auto xl:min-w-[160px]">
          <Wrench className="size-7 shrink-0 text-yellow-400" />
          <span className="flex flex-col">
            <small className="text-[10px] leading-tight">Open Jobs</small>
            <strong className="text-lg leading-tight text-yellow-300">{jobCount === null ? '…' : jobCount.toLocaleString('en-IN')}</strong>
          </span>
        </div>
        <button type="button" onClick={() => { try { localStorage.removeItem("professionalFormDraft"); } catch {} navigate("/professional/form"); }} className="flex h-9 min-w-[183px] shrink-0 items-center justify-center rounded-lg bg-[#ffdf00] px-3 text-sm font-extrabold text-black">+ List your Profile</button>
        <div className="min-w-[255px] shrink-0 border-l border-yellow-500/25 pl-4">
          <strong className="block text-sm leading-tight text-yellow-300">India&rsquo;s #1 Drone|GIS|AI Industry Platform</strong>
          <span className="block text-[11px] text-sky-300">Discover | Connect | Collaborate | Grow</span>
        </div>
      </section>

      {/* Mobile filter toggle */}
      <div className="px-3 pt-3 sm:px-6 lg:hidden">
        <button type="button" onClick={() => setSidebarOpen(o => !o)} className="flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-yellow-400">
          <SlidersHorizontal className="size-4" /> Filters {activeFilters > 0 && `(${activeFilters})`}
        </button>
      </div>

      <main className="mx-auto grid max-w-[2100px] grid-cols-1 items-start gap-3 px-3 py-4 sm:px-6 lg:grid-cols-[255px_minmax(0,1fr)]">
        {/* SIDEBAR */}
        <aside className={`${sidebarOpen ? 'block' : 'hidden'} self-start rounded-xl border border-yellow-300 bg-[#fffef0] p-4 shadow-sm lg:block`}>
          <div className="mb-4 flex items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <h2 className="flex items-center gap-2 text-lg font-extrabold"><Filter className="size-5 text-yellow-500" /> Filters</h2>
            {activeFilters > 0 && (
              <button type="button" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }} className="text-xs font-bold text-blue-800">Clear All</button>
            )}
          </div>

          <section className="mb-4 border-b border-slate-200 pb-3">
            <h3 className="mb-3 text-xs font-extrabold">SEARCH</h3>
            <label className="flex h-10 items-center overflow-hidden rounded-lg border border-slate-200 bg-white">
              <span className="pl-3"><Search className="size-4 text-slate-400" /></span>
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search professionals..." className="min-w-0 flex-1 px-2 text-xs outline-none" />
              {searchQuery && <button onClick={() => setSearchQuery('')} className="pr-3"><X className="size-3.5 text-slate-400" /></button>}
            </label>
          </section>

          <section className="mb-1">
            <h3 className="mb-3 text-xs font-extrabold">CATEGORY</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button key={cat} type="button" onClick={() => setSelectedCategory(cat)} className={chip(selectedCategory === cat)}>{cat}</button>
              ))}
            </div>
          </section>
        </aside>

        {/* RESULTS */}
        <section className="min-w-0">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h1 className="text-base font-extrabold">Drone, GIS &amp; AI Professionals</h1>
            {totalPages > 1 && <span className="text-xs text-slate-500">Page {currentPage} of {totalPages}</span>}
          </div>

          {currentProfessionals.length === 0 ? (
            <p className="rounded-lg bg-white p-8 text-center">
              <Search className="mx-auto mb-3 size-10 text-slate-300" />
              <span className="block font-bold text-slate-800">No professionals found</span>
              <span className="block text-sm text-slate-500">Try adjusting your filters</span>
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {currentProfessionals.map((p, idx) => (
                <ProfessionalCardV2 key={`all-${p.professionalId}-${idx}`} professional={p} onClick={() => goToProfile(p)} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <nav className="mt-5 flex flex-wrap items-center justify-center gap-1.5">
              <button type="button" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="grid h-9 min-w-9 place-items-center rounded-md border border-amber-300 bg-white px-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40">← Prev</button>
              {[...Array(totalPages)].map((_, i) => {
                const pg = i + 1;
                if (pg === currentPage || pg === 1 || pg === totalPages || (pg >= currentPage - 1 && pg <= currentPage + 1)) {
                  return <button key={pg} type="button" onClick={() => setCurrentPage(pg)} className={`grid h-9 min-w-9 place-items-center rounded-md border px-2 text-sm font-semibold ${pg === currentPage ? 'border-slate-900 bg-slate-900 text-white' : 'border-amber-300 bg-white text-slate-900'}`}>{pg}</button>;
                } else if (pg === currentPage - 2 || pg === currentPage + 2) {
                  return <span key={pg} className="px-1">…</span>;
                }
                return null;
              })}
              <button type="button" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="grid h-9 min-w-9 place-items-center rounded-md border border-amber-300 bg-white px-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40">Next →</button>
            </nav>
          )}
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

// Real fields only - skillsCount/servicesCount (the two stats the live page
// already shows), categories as tags, professionalDescription. No
// fabricated flight-hours/credential/rating/DGCA-status fields, since
// today's Professional record carries none of those.
const ProfessionalCardV2: React.FC<{ professional: Professional; onClick: () => void }> = ({ professional, onClick }) => {
  const displayName = professional.fullName || professional.professionalName;
  const bg = avColor(displayName || '');
  return (
    <article onClick={onClick} className="flex min-w-0 cursor-pointer flex-col overflow-hidden rounded-xl border-2 border-yellow-400 bg-[#f1ee8e] shadow-md transition-shadow hover:shadow-lg">
      <div className="relative h-24 overflow-hidden">
        {professional.previewImage ? (
          <img src={professional.previewImage} alt={displayName} loading="lazy" className="size-full object-cover object-center" />
        ) : (
          <div className="flex size-full items-center justify-center" style={{ background: bg }}>
            <span className="text-3xl font-bold uppercase text-white/70">{displayName?.[0] || '?'}</span>
          </div>
        )}
        {professional.categories?.[0] && (
          <span className="absolute left-2 top-2 rounded bg-blue-700 px-2 py-1 text-[9px] font-bold text-white">{professional.categories[0]}</span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-2.5">
        <div className="flex items-center gap-2">
          <div className="grid size-8 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-white text-[10px] font-bold text-white" style={{ background: bg }}>
            {professional.previewImage ? <img src={professional.previewImage} alt="" className="size-full object-cover" /> : (displayName?.[0] || '?')}
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-xs font-extrabold">{displayName}</h3>
            {professional.location && professional.location !== "Location Not Specified" && (
              <p className="flex items-center gap-1 truncate text-[9px] text-slate-500"><MapPin className="size-2.5 shrink-0" /> {professional.location}</p>
            )}
          </div>
        </div>

        <p className="line-clamp-2 min-h-6 text-[10px] leading-[14px] text-slate-600">{professional.professionalDescription || "No professional description."}</p>

        <div className="mt-auto grid grid-cols-2 gap-2 pt-1">
          <div className="rounded-lg border border-slate-300 bg-white py-1.5 text-center">
            <div className="text-sm font-bold">{professional.skillsCount || 0}</div>
            <div className="text-[9px] text-slate-500">Skills</div>
          </div>
          <div className="rounded-lg border border-slate-300 bg-white py-1.5 text-center">
            <div className="text-sm font-bold">{professional.servicesCount || 0}</div>
            <div className="text-[9px] text-slate-500">Services</div>
          </div>
        </div>

        <button type="button" onClick={e => { e.stopPropagation(); onClick(); }} className="mt-1 flex items-center justify-center gap-1 rounded bg-red-600 py-1.5 text-[10.5px] font-bold text-white"><Eye className="size-3" /> View Profile</button>
      </div>
    </article>
  );
};

export default ProfessionalsPageV2;
