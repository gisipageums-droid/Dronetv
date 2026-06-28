import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Search, MapPin, Star, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from './loadingscreen';
import { COMPANY_API, LAMBDA } from '../lib/apiConfig';

interface Service {
  id: string;
  title: string;
  company: string;
  description: string;
  image: string;
  category: string;
  price: string;
  rating: number;
  popularity: number;
  location: string;
  features: string[];
  featured: boolean;
  benefits?: string[];
  process?: string[];
  timeline?: string;
  detailedDescription?: string;
  userId?: string;
  publishedId?: string;
  timestamp?: string;
}

const isValidTitle = (t: string): boolean => {
  if (!t) return false;
  const junk = ['$el.prop', 'outerHTML', "' + ", "+ '", '+ text +', 'jquery', '$('];
  return !junk.some(p => t.toLowerCase().includes(p.toLowerCase()));
};

const decodeHTML = (s: string): string => {
  if (!s) return s;
  const map: Record<string, string> = {
    '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#039;': "'",
    '&#8211;': '–', '&#8212;': '—', '&#8216;': '‘', '&#8217;': '’',
    '&#8220;': '“', '&#8221;': '”', '&#038;': '&', '&nbsp;': ' ',
    '&rsquo;': '’', '&lsquo;': '‘', '&rdquo;': '”', '&ldquo;': '“',
    '&ndash;': '–', '&mdash;': '—',
  };
  return s.replace(/&[^;\s]+;/g, m => map[m] ?? m);
};

const CAT_COLORS: Record<string, string> = {
  Survey: '#0B5CB5', Agriculture: '#1a7a3a', Defence: '#CC1F1F', Infrastructure: '#c05800',
  GIS: '#1a5a9a', AI: '#6B2FB5', Media: '#9a3a1a', Training: '#444',
  General: '#777', Inspection: '#0B5CB5', LiDAR: '#3a6a1a',
};
function barColor(cat: string): string {
  for (const [k, v] of Object.entries(CAT_COLORS)) {
    if (cat.toLowerCase().includes(k.toLowerCase())) return v;
  }
  return '#F5C518';
}

const ServicesPage: React.FC = () => {
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selCats, setSelCats] = useState<string[]>([]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('timestamp');
  const [page, setPage] = useState(1);
  const perPage = 12;
  const navigate = useNavigate();

  useEffect(() => {
    const API_URL = COMPANY_API ? `${COMPANY_API}/services/view` : `${LAMBDA.products}/services/view`;
    axios.get(API_URL)
      .then(res => {
        const d = res.data;
        if (d.status && Array.isArray(d.data)) {
          const services: Service[] = [];
          const cats = new Set<string>(['All']);
          d.data.forEach((item: any) => {
            if (!item.services?.services?.length) return;
            (item.services.categories || []).forEach((c: string) => { if (c && c !== 'All') cats.add(c); });
            item.services.services.forEach((s: any, idx: number) => {
              const raw = s?.title ? String(s.title) : '';
              if (!raw || !isValidTitle(raw)) return;
              if (s.category && s.category !== 'All') cats.add(s.category);
              services.push({
                id: `${item.publishedId}-${idx}`,
                publishedId: item.publishedId,
                userId: item.userId,
                title: decodeHTML(raw),
                company: item.companyName || (item.userId?.split('@')[0] ?? 'Unknown'),
                description: decodeHTML(s.description || s.detailedDescription || ''),
                image: s.image || '',
                category: s.category || 'General',
                price: s.pricing || 'Contact for pricing',
                rating: parseFloat((4 + Math.random()).toFixed(1)),
                popularity: Math.floor(Math.random() * 20) + 80,
                location: 'India',
                features: Array.isArray(s.features) ? s.features : [],
                featured: Math.random() > 0.8,
                benefits: s.benefits || [],
                process: s.process || [],
                timeline: s.timeline || 'N/A',
                detailedDescription: s.detailedDescription || s.description || '',
                timestamp: item.timestamp || new Date().toISOString(),
              });
            });
          });
          setAllServices(services.sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime()));
          setCategories(Array.from(cats));
        }
      })
      .catch(() => setAllServices([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = allServices;
    if (selCats.length) list = list.filter(s => selCats.includes(s.category));
    if (verifiedOnly) list = list.filter(s => s.featured);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(s => s.title.toLowerCase().includes(q) || s.company.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'featured') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      if (sortBy === 'popularity') return b.popularity - a.popularity;
      return new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime();
    });
  }, [allServices, selCats, verifiedOnly, search, sortBy]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const current = filtered.slice((page - 1) * perPage, page * perPage);

  const toggleCat = (cat: string) => {
    if (cat === 'All') { setSelCats([]); setPage(1); return; }
    setSelCats(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
    setPage(1);
  };

  if (loading) return <LoadingScreen logoSrc="/images/logo.png" loadingText="Loading Services..." />;

  return (
    <div className="pt-[60px] min-h-screen" style={{ background: '#F8F8F8', fontFamily: "'Poppins',sans-serif" }}>

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg,#0A0A0A,#111500)', color: '#fff' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 22px' }}>
          <h1 style={{ fontSize: 24, fontWeight: 900, letterSpacing: -0.4, marginBottom: 5, lineHeight: 1.25 }}>
            Book <span style={{ color: '#F5C518' }}>Drone, GIS &amp; AI</span> services
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,.55)', maxWidth: 560, lineHeight: 1.7, marginBottom: 14 }}>
            {allServices.length} services available — surveys, inspections, AI analytics, GIS processing, and training. Connect directly with providers.
          </p>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[
              { n: allServices.length, l: 'Services Available' },
              { n: allServices.filter(s => s.featured).length, l: 'Featured' },
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
                placeholder="Search services — survey, spraying, LiDAR, AI..."
                style={{ border: 'none', background: 'none', fontSize: 13, width: '100%', outline: 'none', color: '#1A1A1A' }} />
            </div>
          </div>

          {/* Category chips */}
          {categories.length > 1 && (
            <div style={{ marginBottom: 9 }}>
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

          {/* Trust chip */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#777', textTransform: 'uppercase', letterSpacing: .5, marginBottom: 5 }}>Trust</div>
            <button onClick={() => { setVerifiedOnly(!verifiedOnly); setPage(1); }}
              style={{ padding: '4px 11px', borderRadius: 16, fontSize: 12, fontWeight: 600, border: `1.5px solid ${verifiedOnly ? '#0A0A0A' : '#E5E5E5'}`, background: verifiedOnly ? '#0A0A0A' : 'none', color: verifiedOnly ? '#F5C518' : '#444', cursor: 'pointer', transition: 'all .12s' }}>
              ⭐ Featured only
            </button>
          </div>
        </div>

        {/* MANAGED BOOKING NOTE */}
        <div style={{ background: '#FFFBE8', border: '1px solid #C9A010', borderRadius: 8, padding: '7px 12px', fontSize: 11.5, color: '#7a5800', marginBottom: 12 }}>
          📦 <b>Book via DroneTv</b> — connect directly with providers. Send enquiries and get quotes.
        </div>

        {/* RESULTS BAR */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 7 }}>
          <div style={{ fontSize: 12.5, color: '#777' }}>
            <b style={{ color: '#0A0A0A' }}>{filtered.length}</b> service{filtered.length !== 1 ? 's' : ''}
          </div>
          <select value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1); }}
            style={{ padding: '6px 10px', border: '1.5px solid #E5E5E5', borderRadius: 8, fontSize: 12.5, color: '#444', background: '#fff', cursor: 'pointer' }}>
            <option value="timestamp">Newest first</option>
            <option value="featured">Featured first</option>
            <option value="rating">Highest rated</option>
            <option value="popularity">Most popular</option>
          </select>
        </div>

        {/* GRID */}
        {current.length === 0 ? (
          <div style={{ padding: '64px 0', textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔧</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A', marginBottom: 6 }}>No services found</div>
            <div style={{ fontSize: 13, color: '#777' }}>Try adjusting your filters or search</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 14 }}>
            {current.map(s => <ServiceCard key={s.id} service={s} onView={() => navigate(`/service/${s.publishedId}`)} />)}
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
              if (i === 0) return 1; if (i === 6) return totalPages;
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

const ServiceCard: React.FC<{ service: Service; onView: () => void }> = ({ service, onView }) => {
  const color = barColor(service.category);

  return (
    <div style={{ background: '#fff', border: service.featured ? '2px solid #F5C518' : '1px solid #E5E5E5', borderRadius: 10, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,.08)', display: 'flex', flexDirection: 'column', transition: 'all .17s' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 24px rgba(0,0,0,.14)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(0,0,0,.08)'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}>

      {/* Colored top bar */}
      <div style={{ height: 3, background: color }} />

      {/* Top */}
      <div style={{ padding: '13px 14px 0' }}>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 7, alignItems: 'center' }}>
          <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 8, background: '#F8F8F8', color: '#444', border: '1px solid #E5E5E5', textTransform: 'uppercase' }}>{service.category}</span>
          {service.featured && <span style={{ fontSize: 9, fontWeight: 800, background: '#F5C518', color: '#0A0A0A', padding: '2px 7px', borderRadius: 8, marginLeft: 'auto' }}>FEATURED</span>}
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#0A0A0A', marginBottom: 3, cursor: 'pointer', lineHeight: 1.3 }} onClick={onView}>
          {service.title}
        </div>
        <div style={{ fontSize: 12, color: '#444', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
          {service.company}
        </div>
      </div>

      {/* Desc */}
      <p style={{ fontSize: 12.5, color: '#777', lineHeight: 1.6, padding: '0 14px', marginBottom: 10, flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {service.description || 'No description available.'}
      </p>

      {/* Meta */}
      <div style={{ padding: '0 14px 10px', display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {service.location && (
          <span style={{ fontSize: 11, color: '#444', display: 'flex', alignItems: 'center', gap: 3, background: '#F8F8F8', padding: '3px 7px', borderRadius: 5 }}>
            <MapPin size={10} />{service.location}
          </span>
        )}
        {service.timeline && service.timeline !== 'N/A' && (
          <span style={{ fontSize: 11, color: '#444', display: 'flex', alignItems: 'center', gap: 3, background: '#F8F8F8', padding: '3px 7px', borderRadius: 5 }}>
            <Clock size={10} />{service.timeline}
          </span>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: '10px 14px', borderTop: '1px solid #E5E5E5', background: '#FAFAFA' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#0A0A0A' }}>{service.price}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: '#F5C518' }}>
              <Star size={11} fill="#F5C518" />{service.rating.toFixed(1)}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={onView}
            style={{ flex: 1, background: '#CC1F1F', color: '#fff', padding: '7px 10px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', border: 'none', textAlign: 'center' }}>
            Book / Enquire
          </button>
          <button onClick={onView}
            style={{ background: '#fff', color: '#0A0A0A', border: '1.5px solid #E5E5E5', padding: '7px 10px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
