import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Search, ChevronDown, Filter, ChevronLeft, ChevronRight, Grid3x3, List, Heart, Eye, Send, Tag, Clock, CalendarDays, Building2, Boxes, Cpu, Bot, Briefcase, Star, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from './loadingscreen';
import { COMPANY_API, LAMBDA } from '../lib/apiConfig';
import { withInlineAds } from './common/adCreatives';
import ToolbarFilterDropdown from './common/ToolbarFilterDropdown';
import ShareMenu from './common/ShareMenu';

// Preview build at /products-v2 - same treatment as CompaniesPageV2 /
// ProfessionalsPageV2: reference layout (ribbon badge, photo header, brand
// line, icon-stat row, tag pills, price+CTA row) ported with real data from
// the live product/view API, nothing fabricated. Two things the reference
// shows that have zero real backing on this data model were dropped rather
// than invented: a star rating/review-count (the pre-existing ProductsPage
// faked this with `4 + Math.random()` - not carried forward here) and an
// unconditional "CERTIFIED" badge (also pre-existing, also not real -
// dropped). The reference's per-category spec trio (Flight Time/Range/IP
// Rating, Bands/RGB/Lightweight, etc.) has no structured backing either
// (no such fields exist) - the 3-icon row below uses only real fields that
// exist on every product instead: Category, Timeline (when supplied), and
// Listed date.

const PAGE_BG: React.CSSProperties = {
  backgroundColor: '#ffd84d',
  backgroundImage: 'radial-gradient(circle, rgba(174,139,24,0.2) 1.5px, transparent 2px)',
  backgroundSize: '56px 56px',
};

const BTN = 'rounded-lg border border-slate-200 bg-white px-3 py-2 font-semibold shadow-sm hover:border-amber-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500';

interface Product {
  id: string;
  publishedId: string;
  userId: string;
  companyName: string;
  urlSlug?: string;
  templateSelection?: string;
  title: string;
  description: string;
  detailedDescription: string;
  image: string;
  category: string;
  price: string;
  features: string[];
  isPopular?: boolean;
  timeline?: string;
  timestamp?: string;
  // Real when present (only ever set on the one labeled demo product so
  // far) - never fabricated for a real listing, see file-top note.
  rating?: number;
  reviewCount?: number;
  reviews?: { name: string; rating: number; comment: string }[];
}

interface ApiResponseItem {
  publishedId: string;
  userId: string;
  companyName: string;
  urlSlug?: string;
  templateSelection?: string;
  timestamp: string;
  products: { products: any[]; categories?: string[] };
}

const CAT_ICONS: Record<string, string> = {
  'Drone': '🚁', 'UAV': '🚁', 'Agriculture': '🌾', 'Survey': '📐', 'GIS': '🗺️',
  'Software': '💻', 'Hardware': '🔌', 'Payload': '📡', 'Camera': '📷', 'GPS': '📍',
  'AI': '🤖', 'Analytics': '📈', 'Training': '🎓', 'General': '📦',
};
function getIcon(cat: string, title: string): string {
  for (const [k, v] of Object.entries(CAT_ICONS)) {
    if (cat.toLowerCase().includes(k.toLowerCase()) || title.toLowerCase().includes(k.toLowerCase())) return v;
  }
  return '📦';
}

function listedMonth(ts?: string): string | undefined {
  if (!ts) return undefined;
  const d = new Date(ts);
  return Number.isFinite(d.getTime()) ? d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : undefined;
}
function isRecent(ts?: string): boolean {
  if (!ts) return false;
  const d = new Date(ts).getTime();
  return Number.isFinite(d) && Date.now() - d < 30 * 24 * 60 * 60 * 1000;
}

const ProductsPageV2: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [category, setCategory] = useState('All');
  const [selBrands, setSelBrands] = useState<string[]>([]);
  const [newLaunchOnly, setNewLaunchOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(12);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const API_URL = COMPANY_API ? `${COMPANY_API}/product/view` : `${LAMBDA.products}/product/view`;
    axios.get(API_URL)
      .then(res => {
        const d = res.data;
        if (d.status && Array.isArray(d.data)) {
          const products: Product[] = [];
          const cats = new Set<string>();
          const seen = new Set<string>();
          d.data.forEach((item: ApiResponseItem) => {
            const pcid = (item.publishedId || '').trim();
            if (pcid && seen.has(pcid)) return;
            if (pcid) seen.add(pcid);
            if (!item.products?.products?.length) return;
            (item.products.categories || []).forEach((c: string) => { if (c && c !== 'All') cats.add(c); });
            item.products.products.forEach((p: any, idx: number) => {
              if (!p?.title) return;
              if (p.category && p.category !== 'All') cats.add(p.category);
              products.push({
                id: `${item.publishedId}-${idx}`,
                publishedId: item.publishedId,
                urlSlug: item.urlSlug,
                templateSelection: item.templateSelection,
                userId: item.userId,
                companyName: item.companyName,
                title: p.title,
                description: p.description || p.detailedDescription || '',
                detailedDescription: p.detailedDescription || p.description || '',
                image: p.image || '',
                category: p.category || 'General',
                price: p.pricing || p.price || 'Contact for pricing',
                features: Array.isArray(p.features) ? p.features : [],
                isPopular: p.isPopular || false,
                timeline: p.timeline,
                timestamp: item.timestamp,
                rating: typeof p.rating === 'number' ? p.rating : undefined,
                reviewCount: typeof p.reviewCount === 'number' ? p.reviewCount : undefined,
                reviews: Array.isArray(p.reviews) ? p.reviews : undefined,
              });
            });
          });
          setAllProducts(products.sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime()));
          setCategories(Array.from(cats));
        }
      })
      .catch(() => setAllProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const brandCounts = useMemo(() => {
    const m: Record<string, number> = {};
    allProducts.forEach(p => { if (p.companyName) m[p.companyName] = (m[p.companyName] || 0) + 1; });
    return m;
  }, [allProducts]);
  const topBrands = useMemo(() => Object.keys(brandCounts).sort((a, b) => brandCounts[b] - brandCounts[a]).slice(0, 6), [brandCounts]);

  const filtered = useMemo(() => {
    let list = allProducts;
    if (category !== 'All') list = list.filter(p => p.category === category);
    if (selBrands.length) list = list.filter(p => selBrands.includes(p.companyName));
    if (newLaunchOnly) list = list.filter(p => isRecent(p.timestamp));
    if (featuredOnly) list = list.filter(p => p.isPopular);
    if (minPrice || maxPrice) {
      list = list.filter(p => {
        const n = parseFloat((p.price || '').replace(/[₹,\s]/g, ''));
        if (isNaN(n)) return false;
        if (minPrice && n < parseFloat(minPrice)) return false;
        if (maxPrice && n > parseFloat(maxPrice)) return false;
        return true;
      });
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => p.title.toLowerCase().includes(q) || p.companyName.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => {
      if (sortBy === 'featured') return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
      if (sortBy === 'priceasc') { const na = parseFloat((a.price || '').replace(/[₹,\s]/g, '')); const nb = parseFloat((b.price || '').replace(/[₹,\s]/g, '')); return (isNaN(na) ? Infinity : na) - (isNaN(nb) ? Infinity : nb); }
      if (sortBy === 'pricedesc') { const na = parseFloat((a.price || '').replace(/[₹,\s]/g, '')); const nb = parseFloat((b.price || '').replace(/[₹,\s]/g, '')); return (isNaN(nb) ? Infinity : nb) - (isNaN(na) ? Infinity : na); }
      return new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime();
    });
  }, [allProducts, category, selBrands, newLaunchOnly, featuredOnly, minPrice, maxPrice, search, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [totalPages, page]);
  const first = (page - 1) * perPage;
  const visible = filtered.slice(first, first + perPage);

  const toggleBrand = (b: string) => { setSelBrands(p => p.includes(b) ? p.filter(x => x !== b) : [...p, b]); setPage(1); };
  const resetFilters = () => { setCategory('All'); setSelBrands([]); setNewLaunchOnly(false); setFeaturedOnly(false); setMinPrice(''); setMaxPrice(''); setSearch(''); setPage(1); };

  const goDetails = (p: Product) => navigate(`/product/${p.id}`);
  const goEnquire = (p: Product) => {
    const slug = p.urlSlug || (p.companyName || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'company';
    const seg = (p.templateSelection === 'template-2' || p.templateSelection === '2') ? 'companies' : 'company';
    navigate(`/${seg}/${slug}#contact`);
  };

  if (loading) return <LoadingScreen logoSrc="/images/logo.png" loadingText="Loading Products..." />;

  const newLaunchCount = allProducts.filter(p => isRecent(p.timestamp)).length;
  const featuredCount = allProducts.filter(p => p.isPopular).length;
  const stats: [string, number, any][] = [
    ['Total Products', allProducts.length, Boxes],
    ['Categories', categories.length, Cpu],
    ['Brands', Object.keys(brandCounts).length, Building2],
    ['New Launches', newLaunchCount, Bot],
    ['Featured', featuredCount, Briefcase],
  ];

  const activeCount = (category !== 'All' ? 1 : 0) + selBrands.length + (newLaunchOnly ? 1 : 0) + (featuredOnly ? 1 : 0) + (minPrice || maxPrice ? 1 : 0);

  return (
    <div style={PAGE_BG} className="min-h-screen">
      <div className="mt-16" />

      <section aria-label="Product statistics" className="flex min-h-[77px] flex-wrap items-center gap-3 bg-[#07130f] px-3 py-2 text-white sm:px-6">
        {stats.map(([label, value, Icon]) => (
          <div key={label} className="flex w-[calc(50%-0.5rem)] shrink-0 items-center gap-2 border-r border-yellow-500/25 pr-2 sm:w-[calc(33.333%-0.7rem)] xl:w-auto xl:min-w-[130px] 2xl:min-w-[150px]">
            <Icon className="size-7 shrink-0 text-yellow-400" />
            <span className="flex flex-col"><small className="text-[10px] leading-tight">{label}</small><strong className="text-lg leading-tight text-yellow-300">{value.toLocaleString('en-IN')}</strong></span>
          </div>
        ))}
        <div className="min-w-[220px] shrink-0 border-l border-yellow-500/25 pl-4">
          <strong className="block text-sm leading-tight text-yellow-300">India&rsquo;s #1 Drone|GIS|AI Marketplace</strong>
          <span className="block text-[11px] text-sky-300">Discover | Compare | Enquire</span>
        </div>
      </section>

      <section style={PAGE_BG} className="flex flex-wrap items-center gap-2 px-3 py-3 sm:px-6">
        <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1">
          <button type="button" onClick={() => setSidebarOpen(true)} className={`${BTN} flex shrink-0 items-center gap-1 text-xs lg:hidden`}>Filters <ChevronDown className="size-4" /></button>
          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            <ToolbarFilterDropdown label="Category" options={categories} selected={category === 'All' ? [] : [category]} onToggle={v => { setCategory(v); setPage(1); }} buttonClassName={`${BTN} flex items-center gap-4 text-xs`} />
            {topBrands.length > 0 && <ToolbarFilterDropdown label="Brand" options={topBrands} selected={selBrands} onToggle={toggleBrand} buttonClassName={`${BTN} flex items-center gap-4 text-xs`} />}
            <ToolbarFilterDropdown label="Price Range" badgeCount={(minPrice ? 1 : 0) + (maxPrice ? 1 : 0)} buttonClassName={`${BTN} flex items-center gap-4 text-xs`}>
              <div className="flex items-center gap-2 p-1">
                <input value={minPrice} onChange={e => { setMinPrice(e.target.value); setPage(1); }} type="number" placeholder="Min" className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-xs outline-none" />
                <input value={maxPrice} onChange={e => { setMaxPrice(e.target.value); setPage(1); }} type="number" placeholder="Max" className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-xs outline-none" />
              </div>
            </ToolbarFilterDropdown>
            <ToolbarFilterDropdown label="New Launch" options={[`New Launch (${newLaunchCount})`]} selected={newLaunchOnly ? [`New Launch (${newLaunchCount})`] : []} onToggle={() => { setNewLaunchOnly(v => !v); setPage(1); }} buttonClassName={`${BTN} flex items-center gap-4 text-xs`} />
            <ToolbarFilterDropdown label="Featured" options={[`Featured (${featuredCount})`]} selected={featuredOnly ? [`Featured (${featuredCount})`] : []} onToggle={() => { setFeaturedOnly(v => !v); setPage(1); }} buttonClassName={`${BTN} flex items-center gap-4 text-xs`} />
          </div>
        </div>
        <label className="flex h-10 w-full items-center overflow-hidden rounded-lg border border-slate-200 bg-white md:w-[min(100%,360px)]">
          <span className="sr-only">Search products</span>
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search products — drone, LiDAR, RTK GPS, AI..." className="min-w-0 flex-1 px-3 text-sm outline-none" />
          <span className="flex h-full w-11 items-center justify-center bg-[#ffdf00]"><Search className="size-5" /></span>
        </label>
        <span className={`${BTN} hidden shrink-0 text-xs sm:block`}>Sort by</span>
        <select value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1); }} className={`${BTN} hidden shrink-0 items-center gap-4 text-xs sm:flex`}>
          <option value="newest">Newest first</option>
          <option value="featured">Featured first</option>
          <option value="priceasc">Price: Low to High</option>
          <option value="pricedesc">Price: High to Low</option>
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
              <h3 className="mb-3 text-xs font-extrabold">CATEGORY</h3>
              <div className="flex flex-wrap gap-2">
                {['All', ...categories].map(cat => (
                  <button key={cat} type="button" onClick={() => { setCategory(cat); setPage(1); }} className={`rounded-full border px-3 py-1.5 text-[11px] ${category === cat ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white hover:border-yellow-500'}`}>{cat}</button>
                ))}
              </div>
            </section>

            {topBrands.length > 0 && (
              <section className="mb-4 border-b border-slate-200 pb-3">
                <h3 className="mb-3 text-xs font-extrabold">BRAND</h3>
                <div className="space-y-2">
                  {topBrands.map(b => (
                    <label key={b} className="flex cursor-pointer items-center gap-2 text-xs">
                      <input type="checkbox" checked={selBrands.includes(b)} onChange={() => toggleBrand(b)} className="accent-amber-500" />
                      <span className="truncate">{b}</span> ({brandCounts[b]})
                    </label>
                  ))}
                </div>
              </section>
            )}

            <section className="mb-4 border-b border-slate-200 pb-3">
              <h3 className="mb-3 text-xs font-extrabold">PRICE RANGE</h3>
              <div className="flex items-center gap-2">
                <input value={minPrice} onChange={e => { setMinPrice(e.target.value); setPage(1); }} type="number" placeholder="Min" className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-xs outline-none" />
                <input value={maxPrice} onChange={e => { setMaxPrice(e.target.value); setPage(1); }} type="number" placeholder="Max" className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-xs outline-none" />
              </div>
            </section>

            <section className="mb-4 border-b border-slate-200 pb-3">
              <h3 className="mb-3 text-xs font-extrabold">AVAILABILITY</h3>
              <div className="space-y-2">
                <label className="flex cursor-pointer items-center gap-2 text-xs">
                  <input type="checkbox" checked={newLaunchOnly} onChange={() => { setNewLaunchOnly(v => !v); setPage(1); }} className="accent-amber-500" />
                  New Launch ({newLaunchCount})
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-xs">
                  <input type="checkbox" checked={featuredOnly} onChange={() => { setFeaturedOnly(v => !v); setPage(1); }} className="accent-amber-500" />
                  Featured ({featuredCount})
                </label>
              </div>
            </section>

            <button type="button" onClick={() => setSidebarOpen(false)} className="w-full rounded-lg bg-yellow-400 py-2 text-xs font-bold">Apply Filters</button>
            <button type="button" onClick={resetFilters} className="mt-2 w-full rounded-lg border bg-white py-2 text-xs font-bold">Reset Filters</button>
          </div>
        </aside>

        <section className="min-w-0">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h1 className="text-base font-extrabold">Explore Drone, GIS &amp; AI Products</h1>
            <div className="flex gap-1">
              <button type="button" onClick={() => setView('grid')} aria-label="Grid view" className={`${view === 'grid' ? 'bg-slate-900 text-white' : 'bg-white'} rounded border px-2 py-1`}><Grid3x3 className="size-4" /></button>
              <button type="button" onClick={() => setView('list')} aria-label="List view" className={`${view === 'list' ? 'bg-slate-900 text-white' : 'bg-white'} rounded border px-2 py-1`}><List className="size-4" /></button>
            </div>
          </div>

          <div className="mb-3 rounded-lg bg-white/70 px-3 py-2 text-[11.5px] text-amber-900">⭐ Products from verified companies appear first. Each product links to the company's full profile for quotes.</div>

          {visible.length === 0 ? (
            <p className="rounded-lg bg-white p-8 text-center">No products found.</p>
          ) : (
            <div className={`grid gap-3 ${view === 'list' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'}`}>
              {withInlineAds(visible, (p, i) => (
                <ProductCardV2 key={`${p.id}-${i}`} product={p} onView={() => goDetails(p)} onEnquire={() => goEnquire(p)} />
              ))}
            </div>
          )}

          <div className="mt-5 grid min-w-0 grid-cols-1 items-center gap-4 rounded-lg px-3 py-5 sm:px-5 lg:grid-cols-[1fr_auto_1fr]">
            <strong className="text-sm">Showing {filtered.length ? first + 1 : 0}–{Math.min(first + perPage, filtered.length)} of {filtered.length.toLocaleString('en-IN')} products</strong>
            <nav aria-label="products pagination" className="flex min-w-0 flex-wrap items-center justify-center gap-1.5">
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

// productCard() - matches the reference's card anatomy (ribbon badge, heart,
// photo, brand line, description, 3-stat row, tag pills, price+CTA row).
// No star rating/review-count and no unconditional "CERTIFIED" badge - see
// file-top note on why those were dropped rather than carried forward.
const ProductCardV2: React.FC<{ product: Product; onView: () => void; onEnquire: () => void }> = ({ product, onView, onEnquire }) => {
  const icon = getIcon(product.category, product.title);
  const [imgErr, setImgErr] = useState(false);
  const [liked, setLiked] = useState(false);
  const showImg = product.image && !product.image.includes('placeholder') && !imgErr;
  const since = listedMonth(product.timestamp);
  const badge = product.isPopular ? { text: 'FEATURED', color: '#7c3aed' } : isRecent(product.timestamp) ? { text: 'NEW LAUNCH', color: '#dc2626' } : null;
  const tags = product.features.slice(0, 3);

  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-lg">
      <div className="relative h-40 shrink-0 overflow-hidden bg-slate-100">
        {showImg ? (
          <img src={product.image} alt={product.title} loading="lazy" onError={() => setImgErr(true)} className="h-full w-full object-cover object-center" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-5xl">{icon}</div>
        )}
        {badge && <span className="absolute left-3 top-3 rounded px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-white shadow" style={{ backgroundColor: badge.color }}>{badge.text}</span>}
        <div className="absolute right-3 top-3 flex flex-col items-center gap-2">
          <button type="button" onClick={e => { e.stopPropagation(); setLiked(v => !v); }} aria-label={`Save ${product.title}`} aria-pressed={liked} className={`grid size-9 place-items-center rounded-full bg-white shadow ${liked ? 'text-red-600' : 'text-red-500'}`}>
            <Heart className="size-4" fill={liked ? 'currentColor' : 'none'} />
          </button>
          <ShareMenu url={`${window.location.origin}/product/${product.id}`} title={product.title} buttonClassName="grid size-9 place-items-center rounded-full bg-white text-slate-600 shadow" iconClassName="size-4" />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="min-w-0 cursor-pointer" onClick={onView}>
          <h3 className="truncate text-base font-extrabold leading-tight text-slate-900">{product.title}</h3>
          <p className="flex items-center gap-1 truncate text-sm text-slate-500"><Building2 className="size-3.5 shrink-0" />{product.companyName}</p>
        </div>

        <div className="grid grid-cols-3 gap-1.5 border-y border-slate-100 py-2.5">
          <div className="flex min-w-0 items-center gap-1.5">
            <Tag className="size-4 shrink-0 text-slate-400" />
            <span className="min-w-0 leading-tight">
              <strong className="block truncate text-xs font-bold text-slate-900">{product.category}</strong>
              <small className="block truncate text-[10px] text-slate-500">Category</small>
            </span>
          </div>
          <div className="flex min-w-0 items-center gap-1.5">
            <Clock className="size-4 shrink-0 text-slate-400" />
            <span className="min-w-0 leading-tight">
              <strong className="block truncate text-xs font-bold text-slate-900">{product.timeline || '—'}</strong>
              <small className="block truncate text-[10px] text-slate-500">Lead Time</small>
            </span>
          </div>
          {since && (
            <div className="flex min-w-0 items-center gap-1.5">
              <CalendarDays className="size-4 shrink-0 text-slate-400" />
              <span className="min-w-0 leading-tight">
                <strong className="block truncate text-xs font-bold text-slate-900">{since}</strong>
                <small className="block truncate text-[10px] text-slate-500">Listed</small>
              </span>
            </div>
          )}
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((t, i) => <span key={i} className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase text-blue-700">{t}</span>)}
          </div>
        )}

        <p className="line-clamp-2 min-h-9 text-xs leading-[18px] text-slate-600">{product.description || 'No description available.'}</p>

        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <strong className="text-sm font-extrabold text-slate-900">{product.price}</strong>
          {typeof product.rating === 'number' && (
            <span className="flex items-center gap-1 text-xs font-bold text-amber-600">
              <Star className="size-3.5 fill-amber-500 text-amber-500" />{product.rating.toFixed(1)}
              {typeof product.reviewCount === 'number' && <span className="font-normal text-slate-400">({product.reviewCount} reviews)</span>}
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={e => { e.stopPropagation(); onView(); }} className="rounded-lg border border-slate-300 bg-white py-2 text-xs font-bold text-slate-900"><Eye className="mr-1 inline size-3.5" />View Details</button>
          <button type="button" onClick={e => { e.stopPropagation(); onEnquire(); }} className="rounded-lg bg-red-600 py-2 text-xs font-bold text-white"><Send className="mr-1 inline size-3.5" />Enquire Now</button>
        </div>
      </div>
    </article>
  );
};

export default ProductsPageV2;
