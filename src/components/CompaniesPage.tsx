import React, { useState, useEffect, useMemo } from 'react';
import { Search, BadgeCheck, MapPin, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from './loadingscreen';
import { COMPANY_API, LAMBDA } from '../lib/apiConfig';

interface Company {
  companyName: string;
  location?: string;
  sectors?: string[];
  previewImage?: string;
  aboutDescription?: string;
  companyDescription?: string;
  createdAt?: string;
  publishedDate?: string;
  templateSelection?: string;
  urlSlug?: string;
  servicesCount?: number;
  productsCount?: number;
  reviewStatus?: string;
  publishedId?: string;
  companyId?: string;
  [key: string]: any;
}

const DRONE_KW = /drone|uav|uas|rpas|rpto|aerial|unmanned|pilot|flight|multirotor|quadcopter/i;
const GIS_KW   = /gis|geospatial|spatial|mapping|lidar|survey|topographic|remote sensing|cartograph|photogramm/i;
const AI_KW    = /\bai\b|artificial intel|machine learn|deep learn|computer vision|analytics|algorithm|neural/i;

function getIndustry(sectors: string[]): 'drone' | 'gis' | 'ai' | 'all' {
  const s = (sectors || []).join(' ');
  if (AI_KW.test(s)) return 'ai';
  if (GIS_KW.test(s)) return 'gis';
  if (DRONE_KW.test(s)) return 'drone';
  return 'all';
}

function getInitials(name: string): string {
  return name.split(' ').slice(0, 2).map(w => w[0] || '').join('').toUpperCase();
}

const IND_COLORS: Record<string, string> = { drone: '#0B5CB5', gis: '#1a7a3a', ai: '#6B2FB5', all: '#444444' };
const IND_LABELS: Record<string, string> = { all: 'All', drone: '🚁 Drone', gis: '🗺️ GIS', ai: '🤖 AI' };

const AV_COLORS = ['#0B5CB5','#1a7a3a','#CC1F1F','#6B2FB5','#c05800','#1a5a9a','#3a6a1a','#9a3a1a'];
function avColor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AV_COLORS[h % AV_COLORS.length];
}

const CompaniesPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
  const [industry, setIndustry] = useState<string>('all');
  const [sectors, setSectors] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [selSectors, setSelSectors] = useState<string[]>([]);
  const [selStates, setSelStates] = useState<string[]>([]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 12;
  const navigate = useNavigate();

  useEffect(() => {
    const url = COMPANY_API
      ? `${COMPANY_API}/dashboard-cards?viewType=main`
      : `${LAMBDA.company}/dashboard-cards?viewType=main`;
    fetch(url)
      .then(r => r.json())
      .then(d => {
        const raw: Company[] = Array.isArray(d.cards) ? d.cards : [];
        const seen = new Set<string>();
        const unique = raw.filter(c => {
          const k = (c.companyName || '').toLowerCase().trim();
          if (!k || seen.has(k)) return false;
          seen.add(k); return true;
        });
        setAllCompanies(unique);

        // derive sector pills
        const secSet = new Set<string>();
        const stateSet = new Set<string>();
        unique.forEach(c => {
          (c.sectors || []).forEach(s => { if (s) secSet.add(s); });
          const parts = (c.location || '').split(',');
          const st = parts[parts.length - 1]?.trim().replace(/\s+India$/i, '').trim();
          if (st && st.length > 1 && st.length < 30) stateSet.add(st);
        });
        setSectors(Array.from(secSet).slice(0, 10));
        setStates(Array.from(stateSet).slice(0, 8));
      })
      .catch(() => setAllCompanies([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = allCompanies;

    if (industry !== 'all') {
      list = list.filter(c => getIndustry(c.sectors || []) === industry);
    }
    if (selSectors.length) {
      list = list.filter(c => selSectors.some(s => (c.sectors || []).includes(s)));
    }
    if (selStates.length) {
      list = list.filter(c => {
        const parts = (c.location || '').split(',');
        const st = parts[parts.length - 1]?.trim().replace(/\s+India$/i, '').trim();
        return selStates.includes(st);
      });
    }
    if (verifiedOnly) {
      list = list.filter(c => c.reviewStatus === 'approved');
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        c.companyName?.toLowerCase().includes(q) ||
        c.companyDescription?.toLowerCase().includes(q) ||
        (c.sectors || []).join(' ').toLowerCase().includes(q)
      );
    }

    list = [...list].sort((a, b) => {
      if (sortBy === 'companyName') return (a.companyName || '').localeCompare(b.companyName || '');
      if (sortBy === 'createdAt') return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      if (sortBy === 'featured') {
        const av = (x: Company) => x.reviewStatus === 'approved' ? 0 : 1;
        return av(a) - av(b);
      }
      return 0;
    });

    return list;
  }, [allCompanies, industry, selSectors, selStates, verifiedOnly, search, sortBy]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const current = filtered.slice((page - 1) * perPage, page * perPage);

  const toggleChip = (arr: string[], setArr: (v: string[]) => void, val: string) => {
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);
    setPage(1);
  };

  const handleCardClick = (c: Company) => {
    const slug = c.urlSlug || c.publishedId || c.companyId;
    if (!slug) return;
    if (c.templateSelection === 'template-2') navigate(`/companies/${slug}`);
    else navigate(`/company/${slug}`);
  };

  if (loading) return <LoadingScreen logoSrc="/images/logo.png" loadingText="Loading Companies..." />;

  const verifiedCount = allCompanies.filter(c => c.reviewStatus === 'approved').length;

  return (
    <div className="pt-[60px] min-h-screen" style={{ background: '#F8F8F8', fontFamily: "'Poppins', sans-serif" }}>

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg,#0A0A0A,#111500)', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 22px', position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: 24, fontWeight: 900, letterSpacing: -0.4, marginBottom: 5, lineHeight: 1.25 }}>
            Find verified <span style={{ color: '#F5C518' }}>Drone, GIS &amp; AI</span> companies
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,.55)', maxWidth: 560, lineHeight: 1.7, marginBottom: 14 }}>
            Browse {allCompanies.length} listed companies — manufacturers, service providers, GIS firms, and AI companies.
          </p>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[
              { n: allCompanies.length, l: 'Listed Companies' },
              { n: verifiedCount, l: 'Verified' },
              { n: allCompanies.reduce((s, c) => s + (c.productsCount || 0), 0), l: 'Products' },
              { n: allCompanies.reduce((s, c) => s + (c.servicesCount || 0), 0), l: 'Services' },
            ].map(st => (
              <div key={st.l}>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#F5C518', lineHeight: 1 }}>{st.n}</div>
                <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,.4)', marginTop: 1 }}>{st.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INDUSTRY TABS */}
      <nav style={{ background: '#0A0A0A', borderBottom: '3px solid #F5C518', position: 'sticky', top: 60, zIndex: 110 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 22px', display: 'flex', overflowX: 'auto' }}>
          {(['all', 'drone', 'gis', 'ai'] as const).map(ind => {
            const count = ind === 'all' ? allCompanies.length
              : allCompanies.filter(c => getIndustry(c.sectors || []) === ind).length;
            const active = industry === ind;
            return (
              <button
                key={ind}
                onClick={() => { setIndustry(ind); setPage(1); }}
                style={{
                  padding: '10px 18px', fontSize: 12.5, fontWeight: 700,
                  color: active ? '#F5C518' : 'rgba(255,255,255,.48)',
                  borderBottom: active ? '3px solid #F5C518' : '3px solid transparent',
                  marginBottom: -3, background: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                  display: 'flex', alignItems: 'center', gap: 6, transition: 'all .13s',
                }}
              >
                {IND_LABELS[ind]}
                <span style={{
                  fontSize: 10, fontWeight: 800, padding: '1px 7px', borderRadius: 10,
                  background: active ? '#F5C518' : 'rgba(255,255,255,.1)',
                  color: active ? '#0A0A0A' : 'rgba(255,255,255,.7)',
                }}>{count}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* TRUST STRIP */}
      <div style={{ background: '#0A0A0A', borderBottom: '2px solid #F5C518' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '8px 22px', display: 'flex', gap: 22, flexWrap: 'wrap' }}>
          {[
            { icon: '✓', b: verifiedCount, l: 'verified companies' },
            { icon: '🔒', b: 'DGCA-certified', l: 'providers' },
            { icon: '⭐', b: '4.7 avg', l: 'platform rating' },
            { icon: '🛡️', b: 'Service guarantee', l: 'Brand partners' },
          ].map(t => (
            <div key={t.l} style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'rgba(255,255,255,.6)', fontSize: 11.5, fontWeight: 500 }}>
              <span>{t.icon}</span><b style={{ color: '#F5C518' }}>{t.b}</b> {t.l}
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '20px 22px' }}>

        {/* TOOLBAR */}
        <div style={{ background: '#fff', border: '1px solid #E5E5E5', borderRadius: 8, padding: 14, boxShadow: '0 2px 12px rgba(0,0,0,.08)', marginBottom: 15 }}>
          {/* Search */}
          <div style={{ display: 'flex', gap: 9, marginBottom: 12, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 180, display: 'flex', alignItems: 'center', gap: 6, background: '#F8F8F8', border: '1.5px solid #E5E5E5', borderRadius: 8, padding: '8px 12px' }}>
              <Search size={14} style={{ color: '#777', flexShrink: 0 }} />
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search companies, sectors, locations..."
                style={{ border: 'none', background: 'none', fontSize: 13, width: '100%', outline: 'none', color: '#1A1A1A' }}
              />
            </div>
          </div>

          {/* Sector chips */}
          {sectors.length > 0 && (
            <div style={{ marginBottom: 9 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#777', textTransform: 'uppercase', letterSpacing: .5, marginBottom: 5 }}>Sector</div>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                {sectors.map(s => {
                  const on = selSectors.includes(s);
                  return (
                    <button key={s} onClick={() => toggleChip(selSectors, setSelSectors, s)}
                      style={{ padding: '4px 11px', borderRadius: 16, fontSize: 12, fontWeight: 600, border: `1.5px solid ${on ? '#0A0A0A' : '#E5E5E5'}`, background: on ? '#0A0A0A' : 'none', color: on ? '#F5C518' : '#444', cursor: 'pointer', transition: 'all .12s' }}>
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* State chips */}
          {states.length > 0 && (
            <div style={{ marginBottom: 9 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#777', textTransform: 'uppercase', letterSpacing: .5, marginBottom: 5 }}>State</div>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                {states.map(st => {
                  const on = selStates.includes(st);
                  return (
                    <button key={st} onClick={() => toggleChip(selStates, setSelStates, st)}
                      style={{ padding: '4px 11px', borderRadius: 16, fontSize: 12, fontWeight: 600, border: `1.5px solid ${on ? '#0A0A0A' : '#E5E5E5'}`, background: on ? '#0A0A0A' : 'none', color: on ? '#F5C518' : '#444', cursor: 'pointer', transition: 'all .12s' }}>
                      {st}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Verification chip */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#777', textTransform: 'uppercase', letterSpacing: .5, marginBottom: 5 }}>Verification</div>
            <button onClick={() => { setVerifiedOnly(!verifiedOnly); setPage(1); }}
              style={{ padding: '4px 11px', borderRadius: 16, fontSize: 12, fontWeight: 600, border: `1.5px solid ${verifiedOnly ? '#0A0A0A' : '#E5E5E5'}`, background: verifiedOnly ? '#0A0A0A' : 'none', color: verifiedOnly ? '#F5C518' : '#444', cursor: 'pointer', transition: 'all .12s' }}>
              ✓ Verified only
            </button>
          </div>
        </div>

        {/* FEATURED NOTE */}
        <div style={{ background: '#FFFBE8', border: '1px solid #C9A010', borderRadius: 8, padding: '7px 12px', fontSize: 11.5, color: '#7a5800', marginBottom: 12 }}>
          ⭐ Verified companies appear first. Get your company verified by submitting GST documents in your dashboard.
        </div>

        {/* RESULTS BAR */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 7 }}>
          <div style={{ fontSize: 12.5, color: '#777' }}>
            <b style={{ color: '#0A0A0A' }}>{filtered.length}</b> {filtered.length === 1 ? 'company' : 'companies'}
            {industry !== 'all' && <span style={{ color: '#0B5CB5', fontWeight: 600 }}> · {IND_LABELS[industry]}</span>}
          </div>
          <select
            value={sortBy}
            onChange={e => { setSortBy(e.target.value); setPage(1); }}
            style={{ padding: '6px 10px', border: '1.5px solid #E5E5E5', borderRadius: 8, fontSize: 12.5, color: '#444', background: '#fff', cursor: 'pointer' }}
          >
            <option value="featured">Verified first</option>
            <option value="createdAt">Newest first</option>
            <option value="companyName">A – Z</option>
          </select>
        </div>

        {/* GRID */}
        {current.length === 0 ? (
          <div style={{ padding: '64px 0', textAlign: 'center' }}>
            <Search size={48} style={{ color: '#ccc', margin: '0 auto 12px' }} />
            <div style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A', marginBottom: 6 }}>No companies found</div>
            <div style={{ fontSize: 13, color: '#777' }}>Try adjusting your filters or search</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 14 }}>
            {current.map((c, i) => <CompanyCard key={`${c.companyName}-${i}`} company={c} onClick={() => handleCardClick(c)} />)}
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32, gap: 6, flexWrap: 'wrap' }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              style={{ padding: '7px 16px', borderRadius: 8, border: '1.5px solid #E5E5E5', fontSize: 13, fontWeight: 600, background: '#fff', color: '#1A1A1A', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? .4 : 1 }}>
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
              <button key={p} onClick={() => setPage(p as number)}
                style={{ padding: '7px 13px', borderRadius: 8, border: `1.5px solid ${page === p ? '#0A0A0A' : '#E5E5E5'}`, fontSize: 13, fontWeight: 600, background: page === p ? '#0A0A0A' : '#fff', color: page === p ? '#F5C518' : '#1A1A1A', cursor: 'pointer' }}>
                {p}
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

const CompanyCard: React.FC<{ company: Company; onClick: () => void }> = ({ company, onClick }) => {
  const ind = getIndustry(company.sectors || []);
  const indColor = IND_COLORS[ind] || '#444';
  const verified = company.reviewStatus === 'approved';
  const bg = avColor(company.companyName);

  return (
    <div style={{ background: '#fff', border: '1px solid #E5E5E5', borderRadius: 10, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,.08)', display: 'flex', flexDirection: 'column', transition: 'all .17s', cursor: 'pointer' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 24px rgba(0,0,0,.14)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(0,0,0,.08)'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}>

      {/* Colored top bar */}
      <div style={{ height: 4, background: indColor }} />

      {/* Card top */}
      <div style={{ padding: '14px 15px 0', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div style={{ width: 48, height: 48, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900, color: '#fff', flexShrink: 0 }}>
          {company.previewImage ? (
            <img src={company.previewImage} alt="" style={{ width: 48, height: 48, borderRadius: 10, objectFit: 'cover' }}
              onError={e => { (e.currentTarget as HTMLElement).style.display = 'none'; }} />
          ) : getInitials(company.companyName)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#0A0A0A', lineHeight: 1.3, cursor: 'pointer' }} onClick={onClick}>
              {company.companyName}
            </span>
            {verified && <BadgeCheck size={15} style={{ color: '#1a7a3a', flexShrink: 0 }} />}
          </div>
          {company.location && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, color: '#777' }}>
              <MapPin size={11} />{company.location}
            </div>
          )}
        </div>
      </div>

      {/* Badges */}
      <div style={{ padding: '8px 15px', display: 'flex', gap: 5, flexWrap: 'wrap', alignItems: 'center' }}>
        {verified && (
          <span style={{ fontSize: 9.5, fontWeight: 800, padding: '2px 8px', borderRadius: 8, background: '#e8f5ec', color: '#1a7a3a', textTransform: 'uppercase' }}>Verified</span>
        )}
        {ind !== 'all' && (
          <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 7, background: ind === 'drone' ? '#E7F0FB' : ind === 'gis' ? '#e8f5ec' : '#EFE7FB', color: indColor, textTransform: 'uppercase', letterSpacing: .3 }}>
            {ind.toUpperCase()}
          </span>
        )}
        {(company.sectors || []).slice(0, 2).map(s => (
          <span key={s} style={{ fontSize: 9.5, fontWeight: 600, padding: '2px 7px', borderRadius: 7, background: '#F8F8F8', color: '#444', border: '1px solid #E5E5E5' }}>{s}</span>
        ))}
      </div>

      {/* Description */}
      <p style={{ fontSize: 12.5, color: '#777', lineHeight: 1.6, padding: '0 15px', marginBottom: 10, flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {company.companyDescription || company.aboutDescription || 'No description available.'}
      </p>

      {/* Meta */}
      {((company.servicesCount || 0) > 0 || (company.productsCount || 0) > 0) && (
        <div style={{ padding: '0 15px 10px', display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {(company.productsCount || 0) > 0 && (
            <span style={{ fontSize: 11, color: '#444', display: 'flex', alignItems: 'center', gap: 3, background: '#F8F8F8', padding: '3px 7px', borderRadius: 5 }}>
              📦 {company.productsCount} products
            </span>
          )}
          {(company.servicesCount || 0) > 0 && (
            <span style={{ fontSize: 11, color: '#444', display: 'flex', alignItems: 'center', gap: 3, background: '#F8F8F8', padding: '3px 7px', borderRadius: 5 }}>
              🔧 {company.servicesCount} services
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div style={{ padding: '10px 15px', borderTop: '1px solid #E5E5E5', background: '#FAFAFA', display: 'flex', gap: 7 }}>
        <button onClick={onClick}
          style={{ flex: 1, background: '#fff', color: '#0A0A0A', border: '1.5px solid #E5E5E5', padding: '7px 10px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          View Profile <ChevronRight size={12} />
        </button>
        <button
          onClick={e => { e.stopPropagation(); onClick(); }}
          style={{ flex: 1, background: '#CC1F1F', color: '#fff', padding: '7px 10px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', border: 'none' }}>
          Enquire
        </button>
      </div>
    </div>
  );
};

export default CompaniesPage;
