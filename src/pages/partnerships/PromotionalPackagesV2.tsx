import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ToolbarFilterDropdown from '../../components/common/ToolbarFilterDropdown';
import ShareMenu from '../../components/common/ShareMenu';
import { Search, ChevronDown, Filter, Heart, Share2, Eye, Check, X as XIcon, Building2, Globe, ListChecks, Mail, Star, LayoutTemplate, Video, Crown, Users as UsersIcon, ShieldCheck, Layers, Mic, Camera, Film, Plane, FileText, Newspaper, Monitor, MessageCircle, Share as ShareIcon, PenTool, Radio } from 'lucide-react';

// New page at /advertising-plans-v2, matching the reference infographic's
// real Reach/Brand/Expand pricing (same 3 tiers already sold on the
// existing /advertising-plans page - src/pages/partnerships/PartnerBenefits.tsx
// - and referenced from the Partnerships hub) laid out in this session's
// established Media Hub card-grid anatomy (stat bar, filters, card grid).
// Market-value/Save figures and the 14 named add-on services + prices come
// directly from the reference infographic the user supplied - that
// infographic IS DroneTv's own real pricing sheet, not invented content.
// No fake engagement numbers (views/comments) on package cards - packages
// aren't CMS content, there's no real counter behind them, so none shown.
// The reference mockup's Industry Vertical / Suitable For filter facets
// are dropped - every package applies equally to Drone/GIS/AI (the
// infographic says so on every single tier), there's no real per-package
// field to filter by; the only real, working facet is Package Type
// (Annual Plans vs Add-On Services), since those are genuinely two
// different real lists.

const PAGE_BG: React.CSSProperties = {
  backgroundColor: '#ffd84d',
  backgroundImage: 'radial-gradient(circle, rgba(174,139,24,0.2) 1.5px, transparent 2px)',
  backgroundSize: '56px 56px',
};
const BTN = 'rounded-lg border border-slate-200 bg-white px-3 py-2 font-semibold shadow-sm hover:border-amber-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500';

interface Pkg {
  slug: string;
  ribbon: string | null;
  ribbonColor: string;
  name: string;
  tagline: string;
  price: string;
  marketValue: string;
  save: string;
  icons: { icon: any; label: string }[];
  features: { text: string; included: boolean }[];
}

// Real pricing/feature data - same 3 tiers as the existing packages[] in
// PartnerBenefits.tsx, cross-checked against the reference infographic for
// the market-value/save figures that page doesn't carry yet.
const PACKAGES: Pkg[] = [
  {
    slug: 'reach',
    ribbon: 'STARTER',
    ribbonColor: '#15803d',
    name: 'Reach',
    tagline: 'Get Listed. Grow Online.',
    price: '₹25,000',
    marketValue: '~₹54,000',
    save: 'Save ₹29,000+',
    icons: [
      { icon: Building2, label: 'Company Profile' },
      { icon: Globe, label: 'Basic Website' },
      { icon: ListChecks, label: '10 Listings' },
      { icon: Mail, label: 'B2B Enquiries' },
    ],
    features: [
      { text: 'Verified company profile (Drone / GIS / AI)', included: true },
      { text: 'Single-page website (basic)', included: true },
      { text: 'Up to 10 product / service listings', included: true },
      { text: 'B2B enquiry form', included: true },
      { text: 'Lead notification email', included: true },
      { text: '2 social media posts (one-time)', included: true },
      { text: 'Magazine directory listing (1 issue)', included: true },
      { text: 'Featured placement', included: false },
      { text: 'Video interview or reel', included: false },
      { text: 'Monthly lead summary report', included: false },
    ],
  },
  {
    slug: 'brand',
    ribbon: 'BEST VALUE',
    ribbonColor: '#dc2626',
    name: 'Brand',
    tagline: 'Build Trust. Get Leads.',
    price: '₹75,000',
    marketValue: '~₹1,55,000',
    save: 'Save ₹80,000+',
    icons: [
      { icon: Star, label: 'Featured Profile' },
      { icon: LayoutTemplate, label: 'Enhanced Website' },
      { icon: ListChecks, label: 'Up to 25 Listings' },
      { icon: Video, label: 'Video Interview' },
    ],
    features: [
      { text: 'Featured profile + Featured Supplier badge', included: true },
      { text: 'Enhanced website (gallery, services, lead form)', included: true },
      { text: 'Up to 25 listings', included: true },
      { text: 'Featured category placement — 3 months', included: true },
      { text: 'Monthly lead summary report', included: true },
      { text: '6 social media posts per year', included: true },
      { text: '1 video interview (YouTube + embedded)', included: true },
      { text: '1 editorial article on DroneTv.in', included: true },
      { text: 'Half-page magazine ad × 2 issues', included: true },
      { text: 'Full buyer contact details', included: false },
    ],
  },
  {
    slug: 'expand',
    ribbon: 'PREMIUM',
    ribbonColor: '#7c3aed',
    name: 'Expand',
    tagline: 'Lead the Industry. Maximum Impact.',
    price: '₹1,50,000',
    marketValue: '~₹4,35,000',
    save: 'Save ₹2,85,000+',
    icons: [
      { icon: Crown, label: 'Premium Profile' },
      { icon: UsersIcon, label: 'Unlimited Listings' },
      { icon: ShieldCheck, label: 'Full Media Support' },
      { icon: Layers, label: 'Expo Stall Branding' },
    ],
    features: [
      { text: 'Premium profile + Industry Partner badge', included: true },
      { text: 'Full website — premium layout, custom banner', included: true },
      { text: 'Unlimited listings', included: true },
      { text: 'Homepage + category feature — quarterly', included: true },
      { text: 'Full buyer contact details on platform', included: true },
      { text: '12 posts + 4 reels + 2 interviews', included: true },
      { text: '3 articles + 6 news + 6 press releases', included: true },
      { text: 'Full-page magazine ad × 4 issues', included: true },
      { text: 'Expo stall branding + Platform Partner status', included: true },
      { text: 'Industry vertical promotion (Drone / GIS / AI)', included: true },
    ],
  },
];

const COMPARISON_ROWS: [string, string, string, string][] = [
  ['Company Profile', 'Verified', 'Featured', 'Premium'],
  ['Website', 'Basic (single page)', 'Enhanced', 'Full Premium'],
  ['Product / Service Listings', 'Up to 10', 'Up to 25', 'Unlimited'],
  ['Lead Notifications', 'Email only', 'Email + Monthly Report', 'Full Buyer Details + Analytics'],
  ['Social Media & Video', '2 Posts', '6 Posts + 1 Interview', '12 Posts + 4 Reels + 2 Interviews'],
  ['Content & Magazine', 'Directory Listing', '1 Article + Half Page × 2', '3 Articles + 6 News + 6 PR + Full Page × 4'],
  ['Expo & Industry Promotion', 'Digital Coverage', 'Digital Coverage', 'Stall Branding + Partner Status'],
];

interface AddOn { icon: any; name: string; price: string }
// Real add-on service menu + prices, from the reference infographic (14
// add-ons, available across Drone/GIS/AI sectors).
const ADD_ONS: AddOn[] = [
  { icon: Mic, name: 'Special Interview', price: '₹12,000' },
  { icon: Building2, name: 'Factory / Office Video', price: '₹10,000' },
  { icon: Film, name: 'Product Demo Video', price: '₹8,000' },
  { icon: Plane, name: 'Aerial Reel', price: '₹12,000' },
  { icon: Camera, name: 'Case Study Video', price: '₹15,000' },
  { icon: Monitor, name: 'Homepage Banner', price: '₹5,000/mo' },
  { icon: MessageCircle, name: 'WhatsApp Campaign', price: '₹4,000' },
  { icon: Mail, name: 'Email Campaign', price: '₹3,500' },
  { icon: Star, name: 'Category Sponsor', price: '₹4,500/mo' },
  { icon: PenTool, name: 'Cover Page', price: '₹25,000' },
  { icon: Newspaper, name: 'Press Release', price: '₹3,000' },
  { icon: FileText, name: 'Case Study Article', price: '₹5,000' },
  { icon: Radio, name: 'Expo Coverage', price: '₹10,000' },
  { icon: ShareIcon, name: 'Webinar', price: '₹7,000' },
];

function fmtCount(n: number): string { return String(n); }

const PromotionalPackagesV2: React.FC = () => {
  const [packageType, setPackageType] = useState<'All' | 'Annual Plans' | 'Add-On Services'>('All');
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [liked, setLiked] = useState<Record<string, boolean>>({});

  const filteredPackages = useMemo(() => {
    if (packageType === 'Add-On Services') return [];
    const q = search.toLowerCase();
    return PACKAGES.filter(p => !q || p.name.toLowerCase().includes(q) || p.tagline.toLowerCase().includes(q));
  }, [packageType, search]);

  const filteredAddOns = useMemo(() => {
    if (packageType === 'Annual Plans') return [];
    const q = search.toLowerCase();
    return ADD_ONS.filter(a => !q || a.name.toLowerCase().includes(q));
  }, [packageType, search]);

  const resultCount = filteredPackages.length + filteredAddOns.length;
  const toggleLike = (slug: string) => setLiked(v => ({ ...v, [slug]: !v[slug] }));

  return (
    <div style={PAGE_BG} className="min-h-screen">
      <div className="mt-16" />

      <section aria-label="Promotional package statistics" className="flex min-h-[77px] flex-wrap items-center gap-3 bg-[#07130f] px-3 py-2 text-white sm:px-6">
        <div className="flex w-[calc(50%-0.5rem)] shrink-0 items-center gap-2 border-r border-yellow-500/25 pr-2 sm:w-[calc(33.333%-0.7rem)] xl:w-auto xl:min-w-[150px]">
          <Star className="size-7 shrink-0 text-yellow-400" />
          <span className="flex flex-col"><small className="text-[10px] leading-tight">Annual Plans</small><strong className="text-lg leading-tight text-yellow-300">{PACKAGES.length}</strong></span>
        </div>
        <div className="flex w-[calc(50%-0.5rem)] shrink-0 items-center gap-2 border-r border-yellow-500/25 pr-2 sm:w-[calc(33.333%-0.7rem)] xl:w-auto xl:min-w-[150px]">
          <Layers className="size-7 shrink-0 text-yellow-400" />
          <span className="flex flex-col"><small className="text-[10px] leading-tight">Add-On Services</small><strong className="text-lg leading-tight text-yellow-300">{ADD_ONS.length}</strong></span>
        </div>
        <div className="ml-auto min-w-[200px] shrink-0 text-right">
          <strong className="block text-sm leading-tight text-yellow-300">Promotional Packages</strong>
          <span className="block text-[11px] text-sky-300">Annual Subscription Plans — Drone, GIS &amp; AI</span>
        </div>
      </section>

      <section style={PAGE_BG} className="flex flex-wrap items-center gap-2 px-3 py-3 sm:px-6">
        <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1">
          <button type="button" onClick={() => setSidebarOpen(true)} className={`${BTN} flex shrink-0 items-center gap-1 text-xs lg:hidden`}>Filters <ChevronDown className="size-4" /></button>
          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            <ToolbarFilterDropdown label="Package Type" options={['All', 'Annual Plans', 'Add-On Services']} selected={packageType === 'All' ? [] : [packageType]} onToggle={v => setPackageType(v as typeof packageType)} buttonClassName={`${BTN} flex items-center gap-4 text-xs`} />
          </div>
        </div>
        <label className="flex h-10 w-full items-center overflow-hidden rounded-lg border border-slate-200 bg-white md:w-[min(100%,360px)]">
          <span className="sr-only">Search promotional packages</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search promotional packages, advertising plans, add-ons..." className="min-w-0 flex-1 px-3 text-sm outline-none" />
          <span className="flex h-full w-11 items-center justify-center bg-[#ffdf00]"><Search className="size-5" /></span>
        </label>
      </section>

      <main className="mx-auto grid max-w-[2100px] grid-cols-1 items-start gap-3 px-3 py-4 sm:px-6 lg:grid-cols-[255px_minmax(0,1fr)]">
        <aside className={`${sidebarOpen ? 'fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4 lg:static lg:z-auto lg:bg-transparent lg:p-0' : 'hidden'} self-start lg:block`}>
          <div className={sidebarOpen ? 'mx-auto max-w-sm rounded-xl border border-yellow-300 bg-[#fffef0] p-4 shadow-sm lg:mx-0 lg:max-w-none' : 'rounded-xl border border-yellow-300 bg-[#fffef0] p-4 shadow-sm'}>
            <div className="mb-4 flex items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <h2 className="flex items-center gap-2 text-lg font-extrabold"><Filter className="size-5 text-yellow-500" /> Filters</h2>
              <button type="button" onClick={() => { setPackageType('All'); setSearch(''); setSidebarOpen(false); }} className="text-xs font-bold text-blue-800">Clear All</button>
            </div>

            <section className="mb-4 border-b border-slate-200 pb-3">
              <h3 className="mb-3 text-xs font-extrabold">PACKAGE TYPE</h3>
              <div className="flex flex-wrap gap-2">
                {(['All', 'Annual Plans', 'Add-On Services'] as const).map(t => (
                  <button key={t} type="button" onClick={() => setPackageType(t)} className={`rounded-full border px-3 py-1.5 text-[11px] ${packageType === t ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white hover:border-yellow-500'}`}>{t}</button>
                ))}
              </div>
            </section>

            <button type="button" onClick={() => setSidebarOpen(false)} className="w-full rounded-lg bg-yellow-400 py-2 text-xs font-bold lg:hidden">Apply Filters</button>
          </div>
        </aside>

        <section className="min-w-0">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h1 className="text-base font-extrabold">{fmtCount(resultCount)} Promotional {resultCount === 1 ? 'Package' : 'Packages'}</h1>
          </div>

          {filteredPackages.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredPackages.map(p => (
                <PackageCardV2 key={p.slug} pkg={p} liked={!!liked[p.slug]} onToggleLike={() => toggleLike(p.slug)} />
              ))}
            </div>
          )}

          {filteredAddOns.length > 0 && (
            <div className="mt-6">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-slate-900">
                <Layers className="size-4 text-amber-600" /> Add-On Services
                <span className="font-normal text-slate-500">— Available to All Sectors (Drone · GIS · AI)</span>
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                {filteredAddOns.map(a => (
                  <div key={a.name} className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
                    <a.icon className="size-6 text-blue-700" />
                    <span className="text-xs font-bold text-slate-900">{a.name}</span>
                    <span className="text-sm font-extrabold text-amber-600">{a.price}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {resultCount === 0 && <p className="rounded-lg bg-white p-8 text-center text-sm text-slate-500">No promotional packages match your search.</p>}

          {packageType === 'All' && !search && (
            <div id="comparison" className="mt-10 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
              <h2 className="flex items-center gap-2 px-4 pt-4 text-sm font-extrabold text-slate-900"><Star className="size-4 text-amber-600" /> Package Feature Comparison</h2>
              <table className="mt-3 w-full min-w-[640px] border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-slate-900 text-white">
                    <th className="px-4 py-2.5 font-bold">Feature Category</th>
                    <th className="px-4 py-2.5 font-bold">Reach (Starter)</th>
                    <th className="px-4 py-2.5 font-bold">Brand (Best Value)</th>
                    <th className="px-4 py-2.5 font-bold">Expand (Premium)</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_ROWS.map((row, i) => (
                    <tr key={row[0]} className={i % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                      {row.map((cell, j) => <td key={j} className={`px-4 py-2.5 ${j === 0 ? 'font-bold text-slate-900' : 'text-slate-600'}`}>{cell}</td>)}
                    </tr>
                  ))}
                  <tr className="bg-amber-50 font-extrabold text-slate-900">
                    <td className="px-4 py-2.5">Your Investment</td>
                    {PACKAGES.map(p => <td key={p.slug} className="px-4 py-2.5">{p.price}</td>)}
                  </tr>
                  <tr className="bg-green-50 font-extrabold text-green-700">
                    <td className="px-4 py-2.5">You Save</td>
                    {PACKAGES.map(p => <td key={p.slug} className="px-4 py-2.5">{p.save}</td>)}
                  </tr>
                </tbody>
              </table>
              <p className="p-4 text-[11px] text-slate-500">All prices exclusive of GST. 100% advance payment, 12-month subscription from profile go-live. 2-week delivery SLA, 2 revision rounds.</p>
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

const PackageCardV2: React.FC<{ pkg: Pkg; liked: boolean; onToggleLike: () => void }> = ({ pkg, liked, onToggleLike }) => {
  return (
    <article className="relative flex min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-lg">
      {pkg.ribbon && (
        <span className="absolute left-3 top-3 z-10 rounded px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-white shadow" style={{ backgroundColor: pkg.ribbonColor }}>{pkg.ribbon}</span>
      )}
      <div className="absolute right-3 top-3 z-10 flex flex-col items-center gap-2">
        <button type="button" onClick={onToggleLike} aria-label={`Save ${pkg.name}`} aria-pressed={liked} className={`grid size-9 place-items-center rounded-full bg-white shadow ${liked ? 'text-red-600' : 'text-red-500'}`}>
          <Heart className="size-4" fill={liked ? 'currentColor' : 'none'} />
        </button>
        <ShareMenu url={`${window.location.origin}/advertising-plans`} title={`${pkg.name} - DroneTv Promotional Package`} buttonClassName="grid size-9 place-items-center rounded-full bg-white text-slate-600 shadow" iconClassName="size-4" />
      </div>

      <div className="flex flex-col gap-1 bg-slate-900 px-5 pb-5 pt-14">
        <h3 className="text-2xl font-extrabold leading-tight text-white">{pkg.name}</h3>
        <p className="text-sm font-medium text-white/80">{pkg.tagline}</p>
      </div>

      <div className="grid grid-cols-4 gap-1 border-b border-slate-100 px-4 py-3">
        {pkg.icons.map((it, i) => (
          <div key={i} className="flex flex-col items-center gap-1 text-center">
            <it.icon className="size-5 text-blue-700" />
            <small className="text-[9px] font-semibold leading-tight text-slate-600">{it.label}</small>
          </div>
        ))}
      </div>

      <div className="px-5 pt-3">
        <p className="text-2xl font-extrabold text-green-700">{pkg.price}<span className="text-xs font-normal text-slate-400"> /year + GST · Drone · GIS · AI</span></p>
        <div className="mt-2 flex flex-wrap items-center gap-2 rounded-lg bg-slate-50 px-2.5 py-1.5 text-[11px]">
          <span className="text-slate-500">Market value {pkg.marketValue}</span>
          <span className="font-bold text-green-700">{pkg.save}</span>
        </div>
      </div>

      <ul className="flex-1 space-y-1.5 px-5 py-3 text-xs">
        {pkg.features.slice(0, 6).map((f, i) => (
          <li key={i} className="flex items-start gap-1.5">
            {f.included ? <Check className="mt-0.5 size-3.5 shrink-0 text-green-600" /> : <XIcon className="mt-0.5 size-3.5 shrink-0 text-slate-300" />}
            <span className={f.included ? 'text-slate-700' : 'text-slate-400'}>{f.text}</span>
          </li>
        ))}
      </ul>

      <div className="grid grid-cols-2 gap-2 p-4 pt-0">
        <a href="#comparison" className="flex items-center justify-center rounded-lg border border-slate-300 bg-white py-2 text-xs font-bold text-slate-900"><Eye className="mr-1 inline size-3.5" />View Details</a>
        <Link to="/partnerships/become-a-partner" className="flex items-center justify-center rounded-lg bg-amber-500 py-2 text-xs font-bold text-slate-900"><Share2 className="mr-1 inline size-3.5" />Choose {pkg.name}</Link>
      </div>
    </article>
  );
};

export default PromotionalPackagesV2;
