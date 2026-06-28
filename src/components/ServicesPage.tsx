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
  location: string;
  features: string[];
  featured: boolean;
  timeline?: string;
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
  Inspection: '#0B5CB5', LiDAR: '#3a6a1a', General: '#777',
};

function barColor(cat: string): string {
  for (const [k, v] of Object.entries(CAT_COLORS)) {
    if (cat.toLowerCase().includes(k.toLowerCase())) return v;
  }
  return '#F5C518';
}

const CAT_ICONS: Record<string, string> = {
  Survey: '📐', Agriculture: '🌾', Defence: '🛡️', Infrastructure: '🏗️',
  GIS: '🗺️', AI: '🤖', Media: '🎥', Training: '🎓',
  Inspection: '🔍', LiDAR: '📡', General: '🔧',
};

function catIcon(cat: string): string {
  for (const [k, v] of Object.entries(CAT_ICONS)) {
    if (cat.toLowerCase().includes(k.toLowerCase())) return v;
  }
  return '🔧';
}

const SERVICES_CSS = `
.sv-page { background: #F8F8F8; font-family: 'Poppins', sans-serif; min-height: 100vh; padding-top: 60px; }
.sv-hero { background: linear-gradient(135deg,#0A0A0A,#111500); color: #fff; }
.sv-hero-i { max-width: 1280px; margin: 0 auto; padding: 28px 22px; }
.sv-hero h1 { font-size: 24px; font-weight: 900; letter-spacing: -0.4px; margin-bottom: 5px; line-height: 1.25; }
.sv-hero h1 span { color: #F5C518; }
.sv-hero p { font-size: 13px; color: rgba(255,255,255,.55); max-width: 560px; line-height: 1.7; margin-bottom: 14px; }
.sv-stats { display: flex; gap: 24px; flex-wrap: wrap; }
.sv-stat-n { font-size: 20px; font-weight: 900; color: #F5C518; line-height: 1; }
.sv-stat-l { font-size: 10.5px; color: rgba(255,255,255,.4); margin-top: 1px; }
.sv-wrap { max-width: 1280px; margin: 0 auto; padding: 20px 22px; }
.sv-toolbar { background: #fff; border: 1px solid #E5E5E5; border-radius: 8px; padding: 14px; box-shadow: 0 2px 12px rgba(0,0,0,.08); margin-bottom: 15px; }
.sv-search { flex: 1; min-width: 180px; display: flex; align-items: center; gap: 6px; background: #F8F8F8; border: 1.5px solid #E5E5E5; border-radius: 8px; padding: 8px 12px; }
.sv-search input { border: none; background: none; font-size: 13px; width: 100%; outline: none; color: #1A1A1A; font-family: 'Poppins',sans-serif; }
.sv-chip-lbl { font-size: 10px; font-weight: 700; color: #777; text-transform: uppercase; letter-spacing: .5px; margin-bottom: 5px; }
.sv-chips { display: flex; gap: 5px; flex-wrap: wrap; }
.sv-chip { padding: 4px 11px; border-radius: 16px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all .12s; white-space: nowrap; font-family: 'Poppins',sans-serif; }
.sv-note { background: #FFFBE8; border: 1px solid #C9A010; border-radius: 8px; padding: 7px 12px; font-size: 11.5px; color: #7a5800; margin-bottom: 12px; }
.sv-resbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; flex-wrap: wrap; gap: 7px; }
.sv-sort { padding: 6px 10px; border: 1.5px solid #E5E5E5; border-radius: 8px; font-size: 12.5px; color: #444; background: #fff; cursor: pointer; font-family: 'Poppins',sans-serif; }
.sv-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 14px; }
.sv-empty { padding: 64px 0; text-align: center; }
.sv-pages { display: flex; justify-content: center; margin-top: 32px; gap: 6px; flex-wrap: wrap; }
.sv-page-btn { padding: 7px 13px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Poppins',sans-serif; }
.sv-card { background: #fff; border: 1px solid #E5E5E5; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,.08); display: flex; flex-direction: column; transition: box-shadow .17s, transform .17s; }
.sv-card.featured { border: 2px solid #F5C518; }
.sv-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,.14); transform: translateY(-2px); }
.sv-card-img { height: 120px; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; background: #F4F4F4; }
.sv-card-img img { width: 100%; height: 100%; object-fit: cover; }
.sv-card-icon { font-size: 38px; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; }
.sv-card-body { padding: 13px 14px; flex: 1; display: flex; flex-direction: column; }
.sv-card-title { font-size: 14px; font-weight: 700; color: #0A0A0A; margin-bottom: 3px; line-height: 1.3; cursor: pointer; }
.sv-card-co { font-size: 12px; color: #444; margin-bottom: 8px; }
.sv-card-desc { font-size: 12.5px; color: #777; line-height: 1.6; flex: 1; margin-bottom: 10px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.sv-card-foot { padding: 10px 14px; border-top: 1px solid #E5E5E5; background: #FAFAFA; }
.sv-foot-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 7px; }
.sv-price { font-size: 13px; font-weight: 800; color: #0A0A0A; }
.sv-rating { display: flex; align-items: center; gap: 3px; font-size: 11px; color: #F5C518; }
.sv-btns { display: flex; gap: 6px; }
.sv-btn-red { flex: 1; background: #CC1F1F; color: #fff; padding: 7px 10px; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; border: none; text-align: center; font-family: 'Poppins',sans-serif; }
.sv-btn-out { background: #fff; color: #0A0A0A; border: 1.5px solid #E5E5E5; padding: 7px 10px; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; font-family: 'Poppins',sans-serif; }
@media (max-width: 600px) {
  .sv-hero h1 { font-size: 19px; }
  .sv-hero-i { padding: 18px 16px; }
  .sv-stat-n { font-size: 17px; }
  .sv-wrap { padding: 14px 14px; }
  .sv-toolbar { padding: 12px; }
  .sv-grid { grid-template-columns: 1fr; }
  .sv-btns { flex-direction: column; }
  .sv-btn-red, .sv-btn-out { text-align: center; }
}
`;

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
                location: 'India',
                features: Array.isArray(s.features) ? s.features : [],
                featured: Math.random() > 0.8,
                timeline: s.timeline || '',
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

  const chipStyle = (on: boolean): React.CSSProperties => ({
    background: on ? '#0A0A0A' : 'transparent',
    color: on ? '#F5C518' : '#444',
    border: `1.5px solid ${on ? '#0A0A0A' : '#E5E5E5'}`,
  });

  if (loading) return <LoadingScreen logoSrc="/images/logo.png" loadingText="Loading Services..." />;

  return (
    <>
      <style>{SERVICES_CSS}</style>
      <div className="sv-page">

        <section className="sv-hero">
          <div className="sv-hero-i">
            <h1>Book <span>Drone, GIS &amp; AI</span> services</h1>
            <p>{allServices.length} services available — surveys, inspections, AI analytics, GIS processing, and training. Connect directly with providers.</p>
            <div className="sv-stats">
              {[
                { n: allServices.length, l: 'Services Available' },
                { n: allServices.filter(s => s.featured).length, l: 'Featured' },
                { n: categories.length - 1, l: 'Categories' },
              ].map(st => (
                <div key={st.l}>
                  <div className="sv-stat-n">{st.n}</div>
                  <div className="sv-stat-l">{st.l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="sv-wrap">

          <div className="sv-toolbar">
            <div style={{ display: 'flex', gap: 9, marginBottom: 12 }}>
              <div className="sv-search">
                <Search size={14} style={{ color: '#777', flexShrink: 0 }} />
                <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search services — survey, spraying, LiDAR, AI..." />
              </div>
            </div>

            {categories.length > 1 && (
              <div style={{ marginBottom: 9 }}>
                <div className="sv-chip-lbl">Category</div>
                <div className="sv-chips">
                  {categories.slice(0, 12).map(cat => (
                    <button key={cat} className="sv-chip" onClick={() => toggleCat(cat)}
                      style={chipStyle(cat === 'All' ? selCats.length === 0 : selCats.includes(cat))}>{cat}</button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="sv-chip-lbl">Trust</div>
              <div className="sv-chips">
                <button className="sv-chip" onClick={() => { setVerifiedOnly(!verifiedOnly); setPage(1); }}
                  style={chipStyle(verifiedOnly)}>⭐ Featured only</button>
              </div>
            </div>
          </div>

          <div className="sv-note">📦 <b>Book via DroneTv</b> — connect directly with providers. Send enquiries and get quotes.</div>

          <div className="sv-resbar">
            <div style={{ fontSize: 12.5, color: '#777' }}>
              <b style={{ color: '#0A0A0A' }}>{filtered.length}</b> service{filtered.length !== 1 ? 's' : ''}
            </div>
            <select className="sv-sort" value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1); }}>
              <option value="timestamp">Newest first</option>
              <option value="featured">Featured first</option>
              <option value="rating">Highest rated</option>
            </select>
          </div>

          {current.length === 0 ? (
            <div className="sv-empty">
              <div style={{ fontSize: 48, marginBottom: 12 }}>🔧</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A', marginBottom: 6 }}>No services found</div>
              <div style={{ fontSize: 13, color: '#777' }}>Try adjusting your filters or search</div>
            </div>
          ) : (
            <div className="sv-grid">
              {current.map(s => <ServiceCard key={s.id} service={s} onView={() => navigate(`/service/${s.publishedId}`)} />)}
            </div>
          )}

          {totalPages > 1 && (
            <div className="sv-pages">
              <button className="sv-page-btn"
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
                <button key={p} className="sv-page-btn" onClick={() => setPage(p as number)}
                  style={{ border: `1.5px solid ${page === p ? '#0A0A0A' : '#E5E5E5'}`, background: page === p ? '#0A0A0A' : '#fff', color: page === p ? '#F5C518' : '#1A1A1A', cursor: 'pointer' }}>
                  {p}
                </button>
              ))}
              <button className="sv-page-btn"
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

const ServiceCard: React.FC<{ service: Service; onView: () => void }> = ({ service, onView }) => {
  const color = barColor(service.category);
  const icon = catIcon(service.category);
  const [imgErr, setImgErr] = useState(false);
  const showImg = service.image && !imgErr;

  return (
    <div className={`sv-card${service.featured ? ' featured' : ''}`}>
      <div style={{ height: 3, background: color }} />

      <div className="sv-card-img">
        {showImg ? (
          <img src={service.image} alt={service.title} onError={() => setImgErr(true)} />
        ) : (
          <div className="sv-card-icon">{icon}</div>
        )}
        {service.featured && (
          <span style={{ position: 'absolute', top: 8, right: 8, background: '#F5C518', color: '#0A0A0A', fontSize: 9.5, fontWeight: 800, padding: '2px 8px', borderRadius: 8 }}>FEATURED</span>
        )}
      </div>

      <div className="sv-card-body">
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 6, alignItems: 'center' }}>
          <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 8, background: '#F8F8F8', color: '#444', border: '1px solid #E5E5E5', textTransform: 'uppercase' as const }}>{service.category}</span>
        </div>
        <div className="sv-card-title" onClick={onView}>{service.title}</div>
        <div className="sv-card-co">{service.company}</div>
        <p className="sv-card-desc">{service.description || 'No description available.'}</p>

        {(service.location || service.timeline) && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 8 }}>
            {service.location && (
              <span style={{ fontSize: 11, color: '#444', display: 'flex', alignItems: 'center', gap: 3, background: '#F8F8F8', padding: '3px 7px', borderRadius: 5 }}>
                <MapPin size={10} />{service.location}
              </span>
            )}
            {service.timeline && (
              <span style={{ fontSize: 11, color: '#444', display: 'flex', alignItems: 'center', gap: 3, background: '#F8F8F8', padding: '3px 7px', borderRadius: 5 }}>
                <Clock size={10} />{service.timeline}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="sv-card-foot">
        <div className="sv-foot-top">
          <div>
            <div className="sv-price">{service.price}</div>
            <div className="sv-rating"><Star size={11} fill="#F5C518" />{service.rating.toFixed(1)}</div>
          </div>
        </div>
        <div className="sv-btns">
          <button className="sv-btn-red" onClick={onView}>Book / Enquire</button>
          <button className="sv-btn-out" onClick={onView}>Details</button>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
