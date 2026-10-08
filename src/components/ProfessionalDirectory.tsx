import React, { useCallback, useEffect, useRef, useState } from "react";
import { Filter, X, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { PROFESSIONAL_API } from "../lib/apiConfig";
import { fetchContent } from "../lib/mediaApi";
import { withInlineAds, AdSidebarRail } from "./common/adCreatives";
import { ProfessionalCardV2, type Professional } from "./ProfessionalsPageV2";
import {
  SECTOR_LABEL, SPECIALIZATIONS, INDIA_STATES, CERT_TYPES, BUSINESS_SUPPORT_CATEGORIES,
  PROFESSIONAL_TYPES, EXPERIENCE_LEVELS, AVAILABILITY, WORK_PREFERENCES, type SectorKey,
} from "../lib/professionalOptions";

// Professional directory: sector counts bar, quick filters, side filters with
// counts, cards, numbered pages. Data comes from the professional service
// search endpoint, which only ever returns public fields.

const PAGE_BG: React.CSSProperties = {
  backgroundColor: "#f3d95e",
  backgroundImage: "radial-gradient(circle, rgba(224,161,0,0.25) 1.5px, transparent 2px)",
  backgroundSize: "46px 46px",
};

interface Row {
  professional_id: string;
  url_slug: string;
  template_selection: string;
  user_name: string;
  full_name: string;
  job_title: string;
  tagline: string;
  summary: string;
  sectors: SectorKey[];
  business_support_category: string;
  specialization: string;
  organisation: string;
  availability: string;
  city: string;
  state: string;
  skills: string[];
  services_count?: number;
  certifications: string[];
  member_since: number | null;
  identity_verified: boolean;
  photo_url: string;
}

interface Facets {
  professional_type?: Record<string, number>;
  availability?: Record<string, number>;
  work_preference?: Record<string, number>;
  certification?: Record<string, number>;
  dgca?: number;
}

interface Filters {
  q: string; sort: string; sector: string; state: string; experience_level: string; verified: string;
  bss_category: string; specialization: string; city: string; dgca: boolean;
  professional_type: string[]; availability: string[]; work_preference: string[]; certification: string[];
}

const EMPTY: Filters = {
  q: "", sort: "relevance", sector: "", state: "", experience_level: "", verified: "", bss_category: "",
  specialization: "", city: "", dgca: false, professional_type: [], availability: [], work_preference: [], certification: [],
};

const GROUPS: { id: "professional_type" | "availability" | "work_preference" | "certification"; title: string; options: string[] }[] = [
  { id: "professional_type", title: "Professional Type", options: PROFESSIONAL_TYPES },
  { id: "availability", title: "Current Availability", options: AVAILABILITY },
  { id: "work_preference", title: "Work Preference", options: WORK_PREFERENCES },
  { id: "certification", title: "Certification", options: CERT_TYPES },
];

const SELECT = "rounded-md border border-white bg-white px-3 py-2 text-xs font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500";
const FSELECT = "w-full rounded-md border border-amber-200 bg-white px-2.5 py-2 text-xs focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-300";

function buildQuery(f: Filters, page: number, pageSize: number): string {
  const p = new URLSearchParams();
  p.set("q", f.q.trim()); p.set("sector", f.sector); p.set("state", f.state); p.set("experience_level", f.experience_level);
  p.set("verified", f.verified); p.set("bss_category", f.sector === "business_support" ? f.bss_category : "");
  p.set("specialization", f.sector === "business_support" ? "" : f.specialization); p.set("city", f.city.trim()); p.set("dgca", f.dgca ? "1" : "");
  GROUPS.forEach(g => p.set(g.id, f[g.id].join(",")));
  p.set("sort", f.sort); p.set("page", String(page)); p.set("page_size", String(pageSize));
  return p.toString();
}

function pageList(cur: number, last: number): (number | "...")[] {
  if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1);
  const set = new Set<number>([1, 2, cur - 1, cur, cur + 1, last].filter(n => n >= 1 && n <= last));
  const nums = Array.from(set).sort((a, b) => a - b);
  const out: (number | "...")[] = [];
  nums.forEach((n, i) => { if (i && n - nums[i - 1] > 1) out.push("..."); out.push(n); });
  return out;
}

const profilePath = (r: Row) => `${r.template_selection === "template-2" ? "/professionals/" : "/professional/"}${r.url_slug || r.user_name}`;

const toCardData = (r: Row): Professional => ({
  professionalId: r.professional_id,
  fullName: r.full_name,
  professionalName: r.full_name,
  role: r.job_title || r.specialization || r.business_support_category,
  location: [r.city, r.state].filter(Boolean).join(", "),
  previewImage: /^https?:\/\//i.test(r.photo_url || "") ? r.photo_url : "",
  professionalDescription: r.summary || r.tagline,
  createdAt: r.member_since ? `${r.member_since}-06-15` : undefined,
  templateSelection: r.template_selection,
  urlSlug: r.url_slug,
  userName: r.user_name,
  skillsCount: r.skills.length,
  servicesCount: r.services_count || 0,
});

const ProfessionalDirectory: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<Filters>(EMPTY);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(12);
  const [rows, setRows] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<{ registered: number; by_sector: Record<string, number> }>({ registered: 0, by_sector: {} });
  const [facets, setFacets] = useState<Facets>({});
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [jobCount, setJobCount] = useState<number | null>(null);
  const first = useRef(true);

  useEffect(() => {
    const c = new AbortController();
    fetchContent("job", c.signal).then(items => setJobCount(items.length)).catch(() => {});
    return () => c.abort();
  }, []);

  useEffect(() => {
    const c = new AbortController();
    const t = setTimeout(async () => {
      setLoading(true); setFailed(false);
      try {
        const res = await fetch(`${PROFESSIONAL_API}/search?${buildQuery(filters, page, perPage)}`, { signal: c.signal, headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error(String(res.status));
        const d = await res.json();
        setRows(d.results || []); setTotal(Number(d.total) || 0);
        if (d.stats) setStats(d.stats);
        setFacets(d.facets || {});
      } catch (e: any) {
        if (e?.name !== "AbortError") { setFailed(true); setRows([]); setTotal(0); }
      } finally {
        if (!c.signal.aborted) setLoading(false);
      }
    }, first.current ? 0 : 250);
    first.current = false;
    return () => { clearTimeout(t); c.abort(); };
  }, [filters, page, perPage]);

  const update = useCallback((patch: Partial<Filters>) => { setFilters(f => ({ ...f, ...patch })); setPage(1); }, []);
  const toggleIn = (g: "professional_type" | "availability" | "work_preference" | "certification", v: string) =>
    update({ [g]: filters[g].includes(v) ? filters[g].filter(x => x !== v) : [...filters[g], v] } as Partial<Filters>);
  const reset = () => { setFilters(EMPTY); setPage(1); };

  const specOptions: string[] = filters.sector && filters.sector !== "business_support"
    ? SPECIALIZATIONS[filters.sector as Exclude<SectorKey, "business_support">]
    : Object.values(SPECIALIZATIONS).flat();

  const chips: { text: string; remove: () => void }[] = [];
  if (filters.sector) chips.push({ text: `Sector: ${SECTOR_LABEL[filters.sector as SectorKey]}`, remove: () => update({ sector: "", bss_category: "", specialization: "" }) });
  if (filters.state) chips.push({ text: `State: ${filters.state}`, remove: () => update({ state: "" }) });
  if (filters.experience_level) chips.push({ text: `Experience: ${filters.experience_level}`, remove: () => update({ experience_level: "" }) });
  if (filters.verified) chips.push({ text: "Verified only", remove: () => update({ verified: "" }) });
  if (filters.bss_category && filters.sector === "business_support") chips.push({ text: `Support: ${filters.bss_category}`, remove: () => update({ bss_category: "" }) });
  if (filters.specialization && filters.sector !== "business_support") chips.push({ text: `Specialization: ${filters.specialization}`, remove: () => update({ specialization: "" }) });
  if (filters.city) chips.push({ text: `City: ${filters.city}`, remove: () => update({ city: "" }) });
  GROUPS.forEach(g => filters[g.id].forEach(v => chips.push({ text: v, remove: () => toggleIn(g.id, v) })));
  if (filters.dgca) chips.push({ text: "DGCA certified", remove: () => update({ dgca: false }) });
  if (filters.q.trim()) chips.push({ text: `Search: ${filters.q.trim()}`, remove: () => update({ q: "" }) });

  const last = Math.max(1, Math.ceil(total / perPage));
  const from = total ? (page - 1) * perPage + 1 : 0;
  const to = Math.min(total, page * perPage);
  const by = stats.by_sector || {};
  const count = (n?: number) => (n === undefined ? "" : ` (${n})`);

  const addProfile = () => {
    try { localStorage.removeItem("professionalFormDraft"); } catch { /* ignore */ }
    navigate("/professional/form");
  };

  const filterPanel = (
    <div className="rounded-xl border border-yellow-300 bg-[#fffdf3] p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-2 border-b border-[#eee3b3] pb-3">
        <h2 className="flex items-center gap-2 text-base font-extrabold"><Filter className="size-4 text-yellow-500" /> Filters</h2>
        <div className="flex items-center gap-3">
          <button type="button" onClick={reset} className="text-xs font-bold text-blue-700">Clear All</button>
          <button type="button" onClick={() => setSidebarOpen(false)} aria-label="Close filters" className="lg:hidden"><X className="size-5 text-slate-500" /></button>
        </div>
      </div>

      {filters.sector === "business_support" ? (
        <div className="mb-3 border-b border-[#eee3b3] pb-3">
          <h3 className="mb-2 text-[11px] font-extrabold uppercase tracking-wide">Business Support Category</h3>
          <select aria-label="Business Support Category" value={filters.bss_category} onChange={e => update({ bss_category: e.target.value })} className={FSELECT}>
            <option value="">All Categories</option>
            {BUSINESS_SUPPORT_CATEGORIES.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      ) : (
        <div className="mb-3 border-b border-[#eee3b3] pb-3">
          <h3 className="mb-2 text-[11px] font-extrabold uppercase tracking-wide">Specialization</h3>
          <select aria-label="Specialization" value={filters.specialization} onChange={e => update({ specialization: e.target.value })} className={FSELECT}>
            <option value="">All Specializations</option>
            {specOptions.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      )}

      {GROUPS.map(g => (
        <div key={g.id} className="mb-3 border-b border-[#eee3b3] pb-3">
          <h3 className="mb-2 text-[11px] font-extrabold uppercase tracking-wide">{g.title}</h3>
          <div className="max-h-44 overflow-y-auto">
            {g.id === "certification" && (
              <label className="flex cursor-pointer items-center gap-2 py-0.5 text-xs">
                <input type="checkbox" checked={filters.dgca} onChange={e => update({ dgca: e.target.checked })} className="size-3.5 accent-slate-900" />
                DGCA certified{count(facets.dgca)}
              </label>
            )}
            {g.options.map(o => (
              <label key={o} className="flex cursor-pointer items-center gap-2 py-0.5 text-xs">
                <input type="checkbox" checked={filters[g.id].includes(o)} onChange={() => toggleIn(g.id, o)} className="size-3.5 accent-slate-900" />
                {o}{count(facets[g.id]?.[o])}
              </label>
            ))}
          </div>
        </div>
      ))}

      <div className="mb-4">
        <h3 className="mb-2 text-[11px] font-extrabold uppercase tracking-wide">Location</h3>
        <input type="text" maxLength={100} value={filters.city} onChange={e => update({ city: e.target.value })} placeholder="City or district" aria-label="City or district" className={FSELECT} />
      </div>

      <button type="button" onClick={() => setSidebarOpen(false)} className="mb-2 w-full rounded-md border border-[#e0b92e] bg-[#ffd75e] py-2.5 text-sm font-extrabold hover:bg-[#fbc50b]">Apply Filters</button>
      <button type="button" onClick={reset} className="w-full rounded-md border border-[#e6dca9] bg-white py-2.5 text-sm font-extrabold hover:bg-slate-50">Reset Filters</button>
    </div>
  );

  return (
    <div className="min-h-screen" style={PAGE_BG}>
      {/* Reserve the fixed navbar plus the professionals submenu bar. */}
      <section className="mt-[108px] flex min-h-[64px] flex-wrap items-center gap-x-5 gap-y-2 bg-[#0c1220] px-3 py-2 text-white sm:px-6" aria-label="Directory counts">
        {[
          ["Total Professionals", stats.registered], ["Drone / Aerospace", by.drone_aerospace], ["GIS", by.gis],
          ["AI", by.ai], ["Robotics", by.robotics], ["Business Support", by.business_support],
        ].map(([label, n]) => (
          <div key={label as string} className="min-w-[72px] leading-tight">
            <span className="block text-[9.5px] text-slate-300">{label}</span>
            <b className="text-base font-extrabold">{Number(n || 0).toLocaleString("en-IN")}</b>
          </div>
        ))}
        <button type="button" onClick={addProfile} className="flex h-9 items-center rounded-lg bg-[#ffdf00] px-4 text-sm font-extrabold text-black">+ Add Your Profile</button>
        <div className="ml-auto text-right text-sm font-bold leading-tight text-yellow-300">
          India&rsquo;s Professional Directory<span className="block text-[11px] font-normal text-sky-300">Discover, Connect, Collaborate, Grow</span>
        </div>
      </section>

      <div className="mx-auto max-w-[1500px] px-3 pb-10 pt-4 sm:px-6">
        <form className="mb-5 flex flex-wrap items-center justify-between gap-3" role="search" autoComplete="off" onSubmit={e => e.preventDefault()}>
          <div className="flex flex-wrap items-center gap-2">
            <select aria-label="Sector" value={filters.sector} onChange={e => update({ sector: e.target.value, bss_category: "", specialization: "" })} className={SELECT}>
              <option value="">Sector</option>
              {(Object.keys(SECTOR_LABEL) as SectorKey[]).map(k => <option key={k} value={k}>{SECTOR_LABEL[k]}</option>)}
            </select>
            <select aria-label="State" value={filters.state} onChange={e => update({ state: e.target.value })} className={SELECT}>
              <option value="">State</option>
              {INDIA_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select aria-label="Experience" value={filters.experience_level} onChange={e => update({ experience_level: e.target.value })} className={SELECT}>
              <option value="">Experience</option>
              {EXPERIENCE_LEVELS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select aria-label="Verified" value={filters.verified} onChange={e => update({ verified: e.target.value })} className={SELECT}>
              <option value="">Verified</option>
              <option value="1">Verified only</option>
            </select>
            <button type="button" onClick={() => setSidebarOpen(true)} className="flex items-center gap-1 rounded-md bg-white px-3 py-2 text-xs font-bold shadow-sm lg:hidden">More Filters <ChevronDown className="size-4" /></button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex w-[320px] max-w-full overflow-hidden rounded-md border border-white bg-white shadow-sm focus-within:ring-2 focus-within:ring-amber-500">
              <input type="text" maxLength={100} value={filters.q} onChange={e => update({ q: e.target.value })} placeholder="Search professionals, skills, cities" aria-label="Search professionals" className="min-w-0 flex-1 px-3 py-2 text-xs outline-none" />
              <span className="flex items-center bg-[#fbc50b] px-4 text-xs font-extrabold">Search</span>
            </div>
            <label htmlFor="pd-sort" className="text-xs font-bold">Sort by</label>
            <select id="pd-sort" value={filters.sort} onChange={e => update({ sort: e.target.value })} className={SELECT}>
              <option value="relevance">Relevance</option>
              <option value="newest">Newest members</option>
              <option value="experience">Most experienced</option>
              <option value="name">Name A to Z</option>
            </select>
          </div>
        </form>

        <div className="grid items-start gap-5 lg:grid-cols-[250px_minmax(0,1fr)]">
          <aside onClick={e => { if (e.target === e.currentTarget) setSidebarOpen(false); }}
            className={sidebarOpen ? "fixed inset-0 z-[100000000] overflow-y-auto bg-black/50 p-4 lg:static lg:z-auto lg:bg-transparent lg:p-0" : "hidden lg:sticky lg:top-28 lg:block lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto"}>
            <div className={sidebarOpen ? "mx-auto max-w-sm lg:max-w-none" : ""}>{filterPanel}</div>
          </aside>

          <section aria-live="polite" className="min-w-0">
            <h1 className="mb-2 text-base font-extrabold">{filters.sector ? `Explore ${SECTOR_LABEL[filters.sector as SectorKey]} Professionals` : "Explore Industry Professionals"}</h1>
            <div className="mb-3 rounded-md border border-[#ecd36f] bg-[#fbf0c3] px-3 py-2 text-[11px] leading-relaxed">
              Verified profiles appear first. Complete identity verification in your dashboard to get your profile verified.
            </div>
            {chips.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {chips.map(c => (
                  <span key={c.text} className="flex items-center gap-1 rounded-full border border-slate-900 bg-white py-0.5 pl-2.5 pr-1 text-[11px] font-semibold">
                    {c.text}<button type="button" onClick={c.remove} aria-label={`Remove ${c.text}`} className="px-1.5 text-xs">x</button>
                  </span>
                ))}
              </div>
            )}

            {failed ? (
              <div role="alert" className="rounded-xl bg-[#fffdf3] p-8 text-center shadow">
                <h3 className="mb-1 text-base font-bold">Search is not available right now</h3>
                <p className="mb-3 text-xs text-slate-600">Please try again in a moment.</p>
                <button type="button" onClick={() => setFilters(f => ({ ...f }))} className="rounded-md border border-[#e0b92e] bg-[#ffd75e] px-5 py-2 text-xs font-extrabold">Try again</button>
              </div>
            ) : loading && rows.length === 0 ? (
              <div role="status" className="rounded-xl bg-[#fffdf3] p-10 text-center text-sm font-semibold shadow">Loading professionals...</div>
            ) : total === 0 ? (
              <div className="rounded-xl bg-[#fffdf3] p-8 text-center shadow">
                <h3 className="mb-1 text-base font-bold">No professionals match your search</h3>
                <p className="mb-3 text-xs text-slate-600">Try fewer words, or remove some filters.</p>
                <button type="button" onClick={reset} className="rounded-md border border-[#e0b92e] bg-[#ffd75e] px-5 py-2 text-xs font-extrabold">Clear all filters</button>
              </div>
            ) : (
              <div className={`grid gap-3.5 [grid-template-columns:repeat(auto-fill,minmax(255px,1fr))] ${loading ? "opacity-60" : ""}`}>
                {rows.map(r => <ProfessionalCardV2 key={r.professional_id} professional={toCardData(r)} onClick={() => navigate(profilePath(r))} />)}
              </div>
            )}

            {total > 0 && (
              <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                <strong className="text-xs">Showing {from} to {to} of {total} professionals</strong>
                <nav aria-label="Pages" className="flex flex-wrap items-center gap-1.5">
                  <button type="button" disabled={page <= 1} onClick={() => { setPage(page - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="h-8 min-w-8 rounded bg-white px-2 text-xs font-bold shadow-sm disabled:opacity-40">&lt;</button>
                  {pageList(page, last).map((n, i) => n === "..." ? <span key={`d${i}`} className="px-1 text-xs">...</span> : (
                    <button key={n} type="button" aria-current={n === page ? "page" : undefined} onClick={() => { setPage(n); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      className={`h-8 min-w-8 rounded px-2 text-xs font-bold shadow-sm ${n === page ? "bg-[#0d0d0d] text-white" : "bg-white"}`}>{n}</button>
                  ))}
                  <button type="button" disabled={page >= last} onClick={() => { setPage(page + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="h-8 min-w-8 rounded bg-white px-2 text-xs font-bold shadow-sm disabled:opacity-40">&gt;</button>
                </nav>
                <label className="flex items-center gap-2 text-xs font-bold">Show
                  <select value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }} className="rounded bg-white px-2 py-1.5 text-xs shadow-sm">
                    <option value={12}>12 per page</option><option value={24}>24 per page</option><option value={48}>48 per page</option>
                  </select>
                </label>
              </div>
            )}
          </section>
        </div>
      </div>

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

export default ProfessionalDirectory;
