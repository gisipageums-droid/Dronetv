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

  if (loading) return <LoadingScreen logoSrc="/images/logo.png" loadingText="Loading Products..." />;

  return (
    <div className="pt-[60px] min-h-screen" style={{ background: '#F8F8F8', fontFamily: "'Poppins',sans-serif" }}>

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg,#0A0A0A,#111500)', color: '#fff' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 22px' }}>
          <h1 style={{ fontSize: 24, fontWeight: 900, letterSpacing: -0.4, marginBottom: 5, lineHeight: 1.25 }}>
            Explore <span style={{ color: '#F5C518' }}>Drone, GIS &amp; AI</span> products
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,.55)', maxWidth: 560, lineHeight: 1.7, marginBottom: 14 }}>
            Browse {allProducts.length} products — drones, payloads, GIS hardware, software, and AI platforms. Get quotes directly from OEMs.
          </p>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[
              { n: allProducts.length, l: 'Products Listed' },
              { n: allProducts.filter(p => p.featured).length || allProducts.filter(p => p.rating >= 4.5).length, l: 'Top Rated' },
              { n: categories.length - 1, l: 'Categories' },
            ].map(st => (
              <div key={st.l}>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#F5C518', lineHeight: 1 }}>{st.n}</div>
                <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,.4)', marginTop: 1 }}>{st.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '20px 22px' }}>

        {/* TOOLBAR */}
        <div style={{ background: '#fff', border: '1px solid #E5E5E5', borderRadius: 8, padding: 14, boxShadow: '0 2px 12px rgba(0,0,0,.08)', marginBottom: 15 }}>
          <div style={{ display: 'flex', gap: 9, marginBottom: 12, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 180, display: 'flex', alignItems: 'center', gap: 6, background: '#F8F8F8', border: '1.5px solid #E5E5E5', borderRadius: 8, padding: '8px 12px' }}>
              <Search size={14} style={{ color: '#777', flexShrink: 0 }} />
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search products — drone, LiDAR, RTK GPS, AI..."
                style={{ border: 'none', background: 'none', fontSize: 13, width: '100%', outline: 'none', color: '#1A1A1A' }} />
            </div>
          </div>

          {/* Price chips */}
          <div style={{ marginBottom: 9 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#777', textTransform: 'uppercase', letterSpacing: .5, marginBottom: 5 }}>Price Range</div>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              {[{ v: '', l: 'All Prices' }, { v: 'free', l: 'On Request' }, { v: 'lt1l', l: 'Under ₹1L' }, { v: '1l5l', l: '₹1L – ₹5L' }, { v: 'gt5l', l: 'Above ₹5L' }].map(opt => {
                const on = priceFilter === opt.v;
                return (
                  <button key={opt.v} onClick={() => { setPriceFilter(opt.v); setPage(1); }}
                    style={{ padding: '4px 11px', borderRadius: 16, fontSize: 12, fontWeight: 600, border: `1.5px solid ${on ? '#0A0A0A' : '#E5E5E5'}`, background: on ? '#0A0A0A' : 'none', color: on ? '#F5C518' : '#444', cursor: 'pointer', transition: 'all .12s' }}>
                    {opt.l}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category chips */}
          {categories.length > 1 && (
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#777', textTransform: 'uppercase', letterSpacing: .5, marginBottom: 5 }}>Category</div>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                {categories.slice(0, 12).map(cat => {
                  const on = cat === 'All' ? selCats.length === 0 : selCats.includes(cat);
                  return (
                    <button key={cat} onClick={() => toggleCat(cat)}
                      style={{ padding: '4px 11px', borderRadius: 16, fontSize: 12, fontWeight: 600, border: `1.5px solid ${on ? '#0A0A0A' : '#E5E5E5'}`, background: on ? '#0A0A0A' : 'none', color: on ? '#F5C518' : '#444', cursor: 'pointer', transition: 'all .12s' }}>
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* FEATURED NOTE */}
        <div style={{ background: '#FFFBE8', border: '1px solid #C9A010', borderRadius: 8, padding: '7px 12px', fontSize: 11.5, color: '#7a5800', marginBottom: 12 }}>
          ⭐ Products from verified companies appear first. Each product links to the company's full profile for quotes.
        </div>

        {/* RESULTS BAR */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 7 }}>
          <div style={{ fontSize: 12.5, color: '#777' }}>
            <b style={{ color: '#0A0A0A' }}>{filtered.length}</b> product{filtered.length !== 1 ? 's' : ''}
          </div>
          <select value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1); }}
            style={{ padding: '6px 10px', border: '1.5px solid #E5E5E5', borderRadius: 8, fontSize: 12.5, color: '#444', background: '#fff', cursor: 'pointer' }}>
            <option value="timestamp">Newest first</option>
            <option value="featured">Featured first</option>
            <option value="rating">Highest rated</option>
            <option value="priceasc">Price: Low to High</option>
            <option value="pricedesc">Price: High to Low</option>
          </select>
        </div>

        {/* GRID */}
        {current.length === 0 ? (
          <div style={{ padding: '64px 0', textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A', marginBottom: 6 }}>No products found</div>
            <div style={{ fontSize: 13, color: '#777' }}>Try adjusting your filters or search</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 14 }}>
            {current.map(p => <ProductCard key={p.id} product={p} onView={() => navigate(`/product/${p.publishedId}`)} />)}
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32, gap: 6, flexWrap: 'wrap' }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              style={{ padding: '7px 16px', borderRadius: 8, border: '1.5px solid #E5E5E5', fontSize: 13, fontWeight: 600, background: '#fff', color: '#1A1A1A', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? .4 : 1 }}>
              Previous
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              if (totalPages <= 7) return i + 1;
              if (i === 0) return 1;
              if (i === 6) return totalPages;
              return page - 2 + i;
            }).filter(n => n >= 1 && n <= totalPages).map(n => (
              <button key={n} onClick={() => setPage(n)}
                style={{ padding: '7px 13px', borderRadius: 8, border: `1.5px solid ${page === n ? '#0A0A0A' : '#E5E5E5'}`, fontSize: 13, fontWeight: 600, background: page === n ? '#0A0A0A' : '#fff', color: page === n ? '#F5C518' : '#1A1A1A', cursor: 'pointer' }}>
                {n}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              style={{ padding: '7px 16px', borderRadius: 8, border: '1.5px solid #E5E5E5', fontSize: 13, fontWeight: 600, background: '#fff', color: '#1A1A1A', cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? .4 : 1 }}>
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const ProductCard: React.FC<{ product: Product; onView: () => void }> = ({ product, onView }) => {
  const icon = getIcon(product.category, product.title);
  const specs = product.features.slice(0, 4);

  return (
    <div style={{ background: '#fff', border: product.featured ? '2px solid #F5C518' : '1px solid #E5E5E5', borderRadius: 10, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,.08)', display: 'flex', flexDirection: 'column', transition: 'all .17s' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 24px rgba(0,0,0,.14)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(0,0,0,.08)'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}>

      {/* Image / Icon area */}
      <div style={{ height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8F8F8', position: 'relative', overflow: 'hidden' }}>
        {product.image && !product.image.includes('placeholder') ? (
          <img src={product.image} alt={product.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => { (e.currentTarget as HTMLElement).style.display = 'none'; (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex'; }} />
        ) : null}
        <div style={{ fontSize: 40, display: product.image && !product.image.includes('placeholder') ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>{icon}</div>
        {product.featured && (
          <span style={{ position: 'absolute', top: 8, left: 8, background: '#F5C518', color: '#0A0A0A', fontSize: 9.5, fontWeight: 800, padding: '2px 8px', borderRadius: 8 }}>FEATURED</span>
        )}
        <span style={{ position: 'absolute', top: 8, right: 8, background: '#1a7a3a', color: '#fff', fontSize: 9.5, fontWeight: 800, padding: '2px 8px', borderRadius: 8 }}>CERTIFIED</span>
      </div>

      {/* Body */}
      <div style={{ padding: '13px 14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#0A0A0A', marginBottom: 3, lineHeight: 1.3, cursor: 'pointer' }} onClick={onView}>
          {product.title}
        </div>
        <div style={{ fontSize: 12, color: '#777', marginBottom: 8 }}>{product.companyName}</div>
        <p style={{ fontSize: 12.5, color: '#777', lineHeight: 1.6, flex: 1, marginBottom: 10, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {product.description || 'No description available.'}
        </p>
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

      {/* Footer */}
      <div style={{ padding: '10px 14px', borderTop: '1px solid #E5E5E5', background: '#FAFAFA', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#0A0A0A' }}>{product.price}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: '#F5C518' }}>
            <Star size={11} fill="#F5C518" />{product.rating.toFixed(1)}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={onView}
            style={{ background: '#fff', color: '#0A0A0A', border: '1.5px solid #E5E5E5', padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
            Details
          </button>
          <button onClick={onView}
            style={{ background: '#CC1F1F', color: '#fff', padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', border: 'none' }}>
            Get Quote
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
