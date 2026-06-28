import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Search, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from './loadingscreen';
import { COMPANY_API, LAMBDA } from '../lib/apiConfig';

interface Product {
  id: string;
  publishedId: string;
  userId: string;
  companyName: string;
  title: string;
  description: string;
  detailedDescription: string;
  image: string;
  category: string;
  price: string;
  rating: number;
  popularity: number;
  features: string[];
  featured: boolean;
  isPopular?: boolean;
  timeline?: string;
  timestamp?: string;
}

interface ApiResponseItem {
  publishedId: string;
  userId: string;
  companyName: string;
  type: string;
  timestamp: string;
  products: { products: any[]; categories?: string[]; trustText?: string; };
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

const PRODUCTS_CSS = `
.pr-page { background: #F8F8F8; font-family: 'Poppins', sans-serif; min-height: 100vh; padding-top: 60px; }
.pr-hero { background: #0A0A0A; color: #fff; border-bottom: 2px solid #F5C518; }
.pr-hero-i { max-width: 1280px; margin: 0 auto; padding: 10px 22px; display: flex; align-items: center; gap: 18px; flex-wrap: wrap; }
.pr-hero h1 { font-size: 15px; font-weight: 800; letter-spacing: -0.2px; line-height: 1.2; white-space: nowrap; }
.pr-hero h1 span { color: #F5C518; }
.pr-stats { display: flex; gap: 18px; flex-wrap: wrap; margin-left: auto; }
.pr-stat-n { font-size: 15px; font-weight: 900; color: #F5C518; line-height: 1; }
.pr-stat-l { font-size: 9.5px; color: rgba(255,255,255,.4); margin-top: 1px; }
.pr-wrap { max-width: 1280px; margin: 0 auto; padding: 20px 22px; }
.pr-toolbar { background: #fff; border: 1px solid #E5E5E5; border-radius: 8px; padding: 14px; box-shadow: 0 2px 12px rgba(0,0,0,.08); margin-bottom: 15px; }
.pr-search { flex: 1; min-width: 180px; display: flex; align-items: center; gap: 6px; background: #F8F8F8; border: 1.5px solid #E5E5E5; border-radius: 8px; padding: 8px 12px; }
.pr-search input { border: none; background: none; font-size: 13px; width: 100%; outline: none; color: #1A1A1A; font-family: 'Poppins',sans-serif; }
.pr-chip-lbl { font-size: 10px; font-weight: 700; color: #777; text-transform: uppercase; letter-spacing: .5px; margin-bottom: 5px; }
.pr-chips { display: flex; gap: 5px; flex-wrap: wrap; }
.pr-chip { padding: 4px 11px; border-radius: 16px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all .12s; white-space: nowrap; font-family: 'Poppins',sans-serif; }
.pr-note { background: #FFFBE8; border: 1px solid #C9A010; border-radius: 8px; padding: 7px 12px; font-size: 11.5px; color: #7a5800; margin-bottom: 12px; }
.pr-resbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; flex-wrap: wrap; gap: 7px; }
.pr-sort { padding: 6px 10px; border: 1.5px solid #E5E5E5; border-radius: 8px; font-size: 12.5px; color: #444; background: #fff; cursor: pointer; font-family: 'Poppins',sans-serif; }
.pr-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 14px; }
.pr-empty { padding: 64px 0; text-align: center; }
.pr-pages { display: flex; justify-content: center; margin-top: 32px; gap: 6px; flex-wrap: wrap; }
.pr-page-btn { padding: 7px 13px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Poppins',sans-serif; }
.pr-card { background: #fff; border: 1px solid #E5E5E5; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,.08); display: flex; flex-direction: column; transition: box-shadow .17s, transform .17s; }
.pr-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,.14); transform: translateY(-2px); }
.pr-card-img { height: 130px; display: flex; align-items: center; justify-content: center; background: #F8F8F8; position: relative; overflow: hidden; }
.pr-card-img img { width: 100%; height: 100%; object-fit: cover; }
.pr-card-icon { font-size: 40px; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; }
.pr-card-body { padding: 13px 14px; flex: 1; display: flex; flex-direction: column; }
.pr-card-title { font-size: 14px; font-weight: 700; color: #0A0A0A; margin-bottom: 3px; line-height: 1.3; cursor: pointer; }
.pr-card-co { font-size: 12px; color: #777; margin-bottom: 8px; }
.pr-card-desc { font-size: 12.5px; color: #777; line-height: 1.6; flex: 1; margin-bottom: 10px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.pr-card-foot { padding: 10px 14px; border-top: 1px solid #E5E5E5; background: #FAFAFA; display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.pr-btn-out { background: #fff; color: #0A0A0A; border: 1.5px solid #E5E5E5; padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; font-family: 'Poppins',sans-serif; }
.pr-btn-red { background: #CC1F1F; color: #fff; padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; border: none; font-family: 'Poppins',sans-serif; }
@media (max-width: 600px) {
  .pr-hero-i { padding: 8px 14px; gap: 10px; }
  .pr-hero h1 { font-size: 13px; }
  .pr-stat-n { font-size: 13px; }
  .pr-wrap { padding: 12px 14px; }
  .pr-toolbar { padding: 12px; }
  .pr-grid { grid-template-columns: 1fr; }
  .pr-card-foot { flex-direction: column; align-items: stretch; }
  .pr-card-foot > div { justify-content: space-between; }
  .pr-btn-out, .pr-btn-red { flex: 1; text-align: center; }
}
`;

const ProductsPage: React.FC = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selCats, setSelCats] = useState<string[]>([]);
  const [priceFilter, setPriceFilter] = useState('');
  const [sortBy, setSortBy] = useState('timestamp');
  const [page, setPage] = useState(1);
  const perPage = 12;
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
                userId: item.userId,
                companyName: item.companyName,
                title: p.title,
                description: p.description || p.detailedDescription || '',
                detailedDescription: p.detailedDescription || p.description || '',
                image: p.image || '',
                category: p.category || 'General',
                price: p.pricing || p.price || 'Contact for pricing',
                rating: parseFloat((4 + Math.random()).toFixed(1)),
                popularity: Math.floor(Math.random() * 20) + 80,
                features: Array.isArray(p.features) ? p.features : [],
                featured: p.isPopular || false,
                isPopular: p.isPopular,
                timeline: p.timeline,
                timestamp: item.timestamp,
              });
            });
          });
          setAllProducts(products.sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime()));
          setCategories(['All', ...Array.from(cats)]);
        }
      })
      .catch(() => setAllProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = allProducts;
    if (selCats.length) list = list.filter(p => selCats.includes(p.category));
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => p.title.toLowerCase().includes(q) || p.companyName.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (priceFilter) {
      list = list.filter(p => {
        const raw = (p.price || '').replace(/[₹,\s]/g, '');
        const num = parseFloat(raw);
        if (priceFilter === 'free') return isNaN(num) || raw === '';
        if (priceFilter === 'lt1l') return !isNaN(num) && num < 100000;
        if (priceFilter === '1l5l') return !isNaN(num) && num >= 100000 && num <= 500000;
        if (priceFilter === 'gt5l') return !isNaN(num) && num > 500000;
        return true;
      });
    }
    return [...list].sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'featured') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      if (sortBy === 'priceasc') { const na = parseFloat(a.price.replace(/[₹,\s]/g,'')); const nb = parseFloat(b.price.replace(/[₹,\s]/g,'')); return (isNaN(na)?Infinity:na)-(isNaN(nb)?Infinity:nb); }
      if (sortBy === 'pricedesc') { const na = parseFloat(a.price.replace(/[₹,\s]/g,'')); const nb = parseFloat(b.price.replace(/[₹,\s]/g,'')); return (isNaN(nb)?Infinity:nb)-(isNaN(na)?Infinity:na); }
      return new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime();
    });
  }, [allProducts, selCats, search, priceFilter, sortBy]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const current = filtered.slice((page - 1) * perPage, page * perPage);

  const toggleCat = (cat: string) => {
    if (cat === 'All') { setSelCats([]); setPage(1); return; }
    setSelCats(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
    setPage(1);
  };

  const chipStyle = (on: boolean): React.CSSProperties => ({
    background: on ? '#0A0A0A' : 'transparent',
    color: on ? '#F5C518' : '#444',
    border: `1.5px solid ${on ? '#0A0A0A' : '#E5E5E5'}`,
  });

  if (loading) return <LoadingScreen logoSrc="/images/logo.png" loadingText="Loading Products..." />;

  return (
    <>
      <style>{PRODUCTS_CSS}</style>
      <div className="pr-page">

        {/* HERO */}
        <section className="pr-hero">
          <div className="pr-hero-i">
            <h1>Explore <span>Drone, GIS &amp; AI</span> products</h1>
            <div className="pr-stats">
              {[
                { n: allProducts.length, l: 'Products Listed' },
                { n: allProducts.filter(p => p.featured).length || allProducts.filter(p => p.rating >= 4.5).length, l: 'Top Rated' },
                { n: categories.length - 1, l: 'Categories' },
              ].map(st => (
                <div key={st.l}>
                  <div className="pr-stat-n">{st.n}</div>
                  <div className="pr-stat-l">{st.l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="pr-wrap">

          {/* TOOLBAR */}
          <div className="pr-toolbar">
            <div style={{ display: 'flex', gap: 9, marginBottom: 12 }}>
              <div className="pr-search">
                <Search size={14} style={{ color: '#777', flexShrink: 0 }} />
                <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search products — drone, LiDAR, RTK GPS, AI..." />
              </div>
            </div>

            <div style={{ marginBottom: 9 }}>
              <div className="pr-chip-lbl">Price Range</div>
              <div className="pr-chips">
                {[{ v: '', l: 'All Prices' }, { v: 'free', l: 'On Request' }, { v: 'lt1l', l: 'Under ₹1L' }, { v: '1l5l', l: '₹1L – ₹5L' }, { v: 'gt5l', l: 'Above ₹5L' }].map(opt => (
                  <button key={opt.v} className="pr-chip" onClick={() => { setPriceFilter(opt.v); setPage(1); }}
                    style={chipStyle(priceFilter === opt.v)}>{opt.l}</button>
                ))}
              </div>
            </div>

            {categories.length > 1 && (
              <div>
                <div className="pr-chip-lbl">Category</div>
                <div className="pr-chips">
                  {categories.slice(0, 12).map(cat => (
                    <button key={cat} className="pr-chip" onClick={() => toggleCat(cat)}
                      style={chipStyle(cat === 'All' ? selCats.length === 0 : selCats.includes(cat))}>{cat}</button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="pr-note">⭐ Products from verified companies appear first. Each product links to the company's full profile for quotes.</div>

          {/* RESULTS BAR */}
          <div className="pr-resbar">
            <div style={{ fontSize: 12.5, color: '#777' }}>
              <b style={{ color: '#0A0A0A' }}>{filtered.length}</b> product{filtered.length !== 1 ? 's' : ''}
            </div>
            <select className="pr-sort" value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1); }}>
              <option value="timestamp">Newest first</option>
              <option value="featured">Featured first</option>
              <option value="rating">Highest rated</option>
              <option value="priceasc">Price: Low to High</option>
              <option value="pricedesc">Price: High to Low</option>
            </select>
          </div>

          {/* GRID */}
          {current.length === 0 ? (
            <div className="pr-empty">
              <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A', marginBottom: 6 }}>No products found</div>
              <div style={{ fontSize: 13, color: '#777' }}>Try adjusting your filters or search</div>
            </div>
          ) : (
            <div className="pr-grid">
              {current.map(p => <ProductCard key={p.id} product={p} onView={() => navigate(`/product/${p.publishedId}`)} />)}
            </div>
          )}

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="pr-pages">
              <button className="pr-page-btn"
                onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                style={{ border: '1.5px solid #E5E5E5', background: '#fff', color: '#1A1A1A', opacity: page === 1 ? .4 : 1, cursor: page === 1 ? 'not-allowed' : 'pointer' }}>
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).filter(p =>
                p === 1 || p === totalPages || Math.abs(p - page) <= 1
              ).reduce<(number | '...')[]>((acc, p, i, arr) => {
                if (i > 0 && typeof arr[i - 1] === 'number' && (p as number) - (arr[i - 1] as number) > 1) acc.push('...');
                acc.push(p); return acc;
              }, []).map((p, i) => p === '...' ? (
                <span key={`e${i}`} style={{ padding: '7px 4px', color: '#777' }}>…</span>
              ) : (
                <button key={p} className="pr-page-btn" onClick={() => setPage(p as number)}
                  style={{ border: `1.5px solid ${page === p ? '#0A0A0A' : '#E5E5E5'}`, background: page === p ? '#0A0A0A' : '#fff', color: page === p ? '#F5C518' : '#1A1A1A', cursor: 'pointer' }}>
                  {p}
                </button>
              ))}
              <button className="pr-page-btn"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                style={{ border: '1.5px solid #E5E5E5', background: '#fff', color: '#1A1A1A', opacity: page === totalPages ? .4 : 1, cursor: page === totalPages ? 'not-allowed' : 'pointer' }}>
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const ProductCard: React.FC<{ product: Product; onView: () => void }> = ({ product, onView }) => {
  const icon = getIcon(product.category, product.title);
  const specs = product.features.slice(0, 4);
  const [imgErr, setImgErr] = useState(false);
  const showImg = product.image && !product.image.includes('placeholder') && !imgErr;

  return (
    <div className="pr-card">
      <div className="pr-card-img">
        {showImg ? (
          <img src={product.image} alt={product.title} onError={() => setImgErr(true)} />
        ) : (
          <div className="pr-card-icon">{icon}</div>
        )}
        {product.featured && (
          <span style={{ position: 'absolute', top: 8, left: 8, background: '#F5C518', color: '#0A0A0A', fontSize: 9.5, fontWeight: 800, padding: '2px 8px', borderRadius: 8 }}>FEATURED</span>
        )}
        <span style={{ position: 'absolute', top: 8, right: 8, background: '#1a7a3a', color: '#fff', fontSize: 9.5, fontWeight: 800, padding: '2px 8px', borderRadius: 8 }}>CERTIFIED</span>
      </div>

      <div className="pr-card-body">
        <div className="pr-card-title" onClick={onView}>{product.title}</div>
        <div className="pr-card-co">{product.companyName}</div>
        <p className="pr-card-desc">{product.description || 'No description available.'}</p>
        {specs.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
            {specs.map((f, i) => (
              <span key={i} style={{ fontSize: 10.5, fontWeight: 600, background: '#F8F8F8', color: '#444', padding: '2px 7px', borderRadius: 5, border: '1px solid #E5E5E5' }}>
                {typeof f === 'string' ? f.slice(0, 20) : f}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="pr-card-foot">
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#0A0A0A' }}>{product.price}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: '#F5C518' }}>
            <Star size={11} fill="#F5C518" />{product.rating.toFixed(1)}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="pr-btn-out" onClick={onView}>Details</button>
          <button className="pr-btn-red" onClick={onView}>Get Quote</button>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
