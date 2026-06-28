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

const COMPANIES_CSS = `
.co-page { background: #F8F8F8; font-family: 'Poppins', sans-serif; min-height: 100vh; padding-top: 60px; }
.co-hero { background: linear-gradient(135deg,#0A0A0A,#111500); color:#fff; }
.co-hero-i { max-width: 1280px; margin: 0 auto; padding: 28px 22px; }
.co-hero h1 { font-size: 24px; font-weight: 900; letter-spacing: -0.4px; margin-bottom: 5px; line-height: 1.25; }
.co-hero h1 span { color: #F5C518; }
.co-hero p { font-size: 13px; color: rgba(255,255,255,.55); max-width: 560px; line-height: 1.7; margin-bottom: 14px; }
.co-stats { display: flex; gap: 24px; flex-wrap: wrap; }
.co-stat-n { font-size: 20px; font-weight: 900; color: #F5C518; line-height: 1; }
.co-stat-l { font-size: 10.5px; color: rgba(255,255,255,.4); margin-top: 1px; }
.co-tabs { background: #0A0A0A; border-bottom: 3px solid #F5C518; position: sticky; top: 60px; z-index: 110; }
.co-tabs-i { max-width: 1280px; margin: 0 auto; padding: 0 22px; display: flex; overflow-x: auto; scrollbar-width: none; -ms-overflow-style: none; }
.co-tabs-i::-webkit-scrollbar { display: none; }
.co-tab { padding: 10px 18px; font-size: 12.5px; font-weight: 700; background: none; cursor: pointer; white-space: nowrap; display: flex; align-items: center; gap: 6px; transition: all .13s; border: none; border-bottom: 3px solid transparent; margin-bottom: -3px; }
.co-trust { background: #0A0A0A; border-bottom: 2px solid #F5C518; }
.co-trust-i { max-width: 1280px; margin: 0 auto; padding: 8px 22px; display: flex; gap: 18px; flex-wrap: wrap; }
.co-trust-item { display: flex; align-items: center; gap: 5px; color: rgba(255,255,255,.6); font-size: 11.5px; font-weight: 500; }
.co-wrap { max-width: 1280px; margin: 0 auto; padding: 20px 22px; }
.co-toolbar { background: #fff; border: 1px solid #E5E5E5; border-radius: 8px; padding: 14px; box-shadow: 0 2px 12px rgba(0,0,0,.08); margin-bottom: 15px; }
.co-search { flex: 1; min-width: 180px; display: flex; align-items: center; gap: 6px; background: #F8F8F8; border: 1.5px solid #E5E5E5; border-radius: 8px; padding: 8px 12px; }
.co-search input { border: none; background: none; font-size: 13px; width: 100%; outline: none; color: #1A1A1A; font-family: 'Poppins',sans-serif; }
.co-chip-lbl { font-size: 10px; font-weight: 700; color: #777; text-transform: uppercase; letter-spacing: .5px; margin-bottom: 5px; }
.co-chips { display: flex; gap: 5px; flex-wrap: wrap; }
.co-chip { padding: 4px 11px; border-radius: 16px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all .12s; white-space: nowrap; }
.co-note { background: #FFFBE8; border: 1px solid #C9A010; border-radius: 8px; padding: 7px 12px; font-size: 11.5px; color: #7a5800; margin-bottom: 12px; }
.co-resbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; flex-wrap: wrap; gap: 7px; }
.co-sort { padding: 6px 10px; border: 1.5px solid #E5E5E5; border-radius: 8px; font-size: 12.5px; color: #444; background: #fff; cursor: pointer; font-family: 'Poppins',sans-serif; }
.co-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 14px; }
.co-empty { padding: 64px 0; text-align: center; }
.co-pages { display: flex; justify-content: center; margin-top: 32px; gap: 6px; flex-wrap: wrap; }
.co-page-btn { padding: 7px 13px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Poppins',sans-serif; }
.co-card { background: #fff; border: 1px solid #E5E5E5; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,.08); display: flex; flex-direction: column; transition: box-shadow .17s, transform .17s; cursor: pointer; }
.co-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,.14); transform: translateY(-2px); }
.co-card-top { padding: 14px 15px 0; display: flex; gap: 12px; align-items: flex-start; }
.co-avatar { width: 48px; height: 48px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 900; color: #fff; flex-shrink: 0; overflow: hidden; }
.co-avatar img { width: 48px; height: 48px; border-radius: 10px; object-fit: cover; }
.co-card-name { font-size: 14px; font-weight: 700; color: #0A0A0A; line-height: 1.3; }
.co-card-loc { display: flex; align-items: center; gap: 3px; font-size: 12px; color: #777; margin-top: 2px; }
.co-card-desc { font-size: 12.5px; color: #777; line-height: 1.6; padding: 0 15px; margin-bottom: 10px; flex: 1; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.co-card-foot { padding: 10px 15px; border-top: 1px solid #E5E5E5; background: #FAFAFA; display: flex; gap: 7px; }
.co-btn-out { flex: 1; background: #fff; color: #0A0A0A; border: 1.5px solid #E5E5E5; padding: 7px 10px; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px; font-family: 'Poppins',sans-serif; }
.co-btn-red { flex: 1; background: #CC1F1F; color: #fff; padding: 7px 10px; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; border: none; font-family: 'Poppins',sans-serif; }
@media (max-width: 960px) {
  .co-trust-item:nth-child(n+3) { display: none; }
}
@media (max-width: 600px) {
  .co-hero h1 { font-size: 19px; }
  .co-hero-i { padding: 18px 16px; }
  .co-stat-n { font-size: 17px; }
  .co-wrap { padding: 14px 14px; }
  .co-trust-i { padding: 7px 14px; gap: 12px; }
  .co-trust-item:nth-child(n+3) { display: none; }
  .co-grid { grid-template-columns: 1fr; }
  .co-toolbar { padding: 12px; }
  .co-tabs-i { padding: 0 14px; }
  .co-tab { padding: 8px 13px; font-size: 12px; }
}
`;

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
    if (industry !== 'all') list = list.filter(c => getIndustry(c.sectors || []) === industry);
    if (selSectors.length) list = list.filter(c => selSectors.some(s => (c.sectors || []).includes(s)));
    if (selStates.length) {
      list = list.filter(c => {
        const parts = (c.location || '').split(',');
        const st = parts[parts.length - 1]?.trim().replace(/\s+India$/i, '').trim();
        return selStates.includes(st);
      });
    }
    if (verifiedOnly) list = list.filter(c => c.reviewStatus === 'approved');
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        c.companyName?.toLowerCase().includes(q) ||
        c.companyDescription?.toLowerCase().includes(q) ||
        (c.sectors || []).join(' ').toLowerCase().includes(q)
      );
    }
    return [...list].sort((a, b) => {
      if (sortBy === 'companyName') return (a.companyName || '').localeCompare(b.companyName || '');
      if (sortBy === 'createdAt') return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      if (sortBy === 'featured') return ((b.reviewStatus === 'approved') ? 0 : 1) - ((a.reviewStatus === 'approved') ? 0 : 1);
      return 0;
    });
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

  const chipStyle = (on: boolean): React.CSSProperties => ({
    background: on ? '#0A0A0A' : 'transparent',
    color: on ? '#F5C518' : '#444',
    border: `1.5px solid ${on ? '#0A0A0A' : '#E5E5E5'}`,
  });

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(p =>
    p === 1 || p === totalPages || Math.abs(p - page) <= 1
  ).reduce<(number | '...')[]>((acc, p, i, arr) => {
    if (i > 0 && typeof arr[i - 1] === 'number' && (p as number) - (arr[i - 1] as number) > 1) acc.push('...');
    acc.push(p); return acc;
  }, []);

  return (
    <>
      <style>{COMPANIES_CSS}</style>
      <div className="co-page">

        {/* HERO */}
        <section className="co-hero">
          <div className="co-hero-i">
            <h1>Find verified <span>Drone, GIS &amp; AI</span> companies</h1>
            <p>Browse {allCompanies.length} listed companies — manufacturers, service providers, GIS firms, and AI companies.</p>
            <div className="co-stats">
              {[
                { n: allCompanies.length, l: 'Listed Companies' },
                { n: verifiedCount, l: 'Verified' },
                { n: allCompanies.reduce((s, c) => s + (c.productsCount || 0), 0), l: 'Products' },
                { n: allCompanies.reduce((s, c) => s + (c.servicesCount || 0), 0), l: 'Services' },
              ].map(st => (
                <div key={st.l}>
                  <div className="co-stat-n">{st.n}</div>
                  <div className="co-stat-l">{st.l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* INDUSTRY TABS */}
        <nav className="co-tabs">
          <div className="co-tabs-i">
            {(['all', 'drone', 'gis', 'ai'] as const).map(ind => {
              const count = ind === 'all' ? allCompanies.length : allCompanies.filter(c => getIndustry(c.sectors || []) === ind).length;
              const active = industry === ind;
              return (
                <button key={ind} className="co-tab"
                  onClick={() => { setIndustry(ind); setPage(1); }}
                  style={{ color: active ? '#F5C518' : 'rgba(255,255,255,.48)', borderBottomColor: active ? '#F5C518' : 'transparent' }}>
                  {IND_LABELS[ind]}
                  <span style={{ fontSize: 10, fontWeight: 800, padding: '1px 7px', borderRadius: 10, background: active ? '#F5C518' : 'rgba(255,255,255,.1)', color: active ? '#0A0A0A' : 'rgba(255,255,255,.7)' }}>{count}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* TRUST STRIP */}
        <div className="co-trust">
          <div className="co-trust-i">
            {[
              { icon: '✓', b: verifiedCount, l: 'verified companies' },
              { icon: '🔒', b: 'DGCA-certified', l: 'providers' },
              { icon: '⭐', b: '4.7 avg', l: 'platform rating' },
              { icon: '🛡️', b: 'Service guarantee', l: 'Brand partners' },
            ].map(t => (
              <div key={t.l} className="co-trust-item">
                <span>{t.icon}</span><b style={{ color: '#F5C518' }}>{t.b}</b> {t.l}
              </div>
            ))}
          </div>
        </div>

        <div className="co-wrap">

          {/* TOOLBAR */}
          <div className="co-toolbar">
            <div style={{ display: 'flex', gap: 9, marginBottom: 12 }}>
              <div className="co-search">
                <Search size={14} style={{ color: '#777', flexShrink: 0 }} />
                <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search companies, sectors, locations..." />
              </div>
            </div>

            {sectors.length > 0 && (
              <div style={{ marginBottom: 9 }}>
                <div className="co-chip-lbl">Sector</div>
                <div className="co-chips">
                  {sectors.map(s => (
                    <button key={s} className="co-chip" onClick={() => toggleChip(selSectors, setSelSectors, s)}
                      style={chipStyle(selSectors.includes(s))}>{s}</button>
                  ))}
                </div>
              </div>
            )}

            {states.length > 0 && (
              <div style={{ marginBottom: 9 }}>
                <div className="co-chip-lbl">State</div>
                <div className="co-chips">
                  {states.map(st => (
                    <button key={st} className="co-chip" onClick={() => toggleChip(selStates, setSelStates, st)}
                      style={chipStyle(selStates.includes(st))}>{st}</button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="co-chip-lbl">Verification</div>
              <div className="co-chips">
                <button className="co-chip" onClick={() => { setVerifiedOnly(!verifiedOnly); setPage(1); }}
                  style={chipStyle(verifiedOnly)}>✓ Verified only</button>
              </div>
            </div>
          </div>

          <div className="co-note">⭐ Verified companies appear first. Get your company verified by submitting GST documents in your dashboard.</div>

          {/* RESULTS BAR */}
          <div className="co-resbar">
            <div style={{ fontSize: 12.5, color: '#777' }}>
              <b style={{ color: '#0A0A0A' }}>{filtered.length}</b> {filtered.length === 1 ? 'company' : 'companies'}
              {industry !== 'all' && <span style={{ color: '#0B5CB5', fontWeight: 600 }}> · {IND_LABELS[industry]}</span>}
            </div>
            <select className="co-sort" value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1); }}>
              <option value="featured">Verified first</option>
              <option value="createdAt">Newest first</option>
              <option value="companyName">A – Z</option>
            </select>
          </div>

          {/* GRID */}
          {current.length === 0 ? (
            <div className="co-empty">
              <Search size={48} style={{ color: '#ccc', margin: '0 auto 12px' }} />
              <div style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A', marginBottom: 6 }}>No companies found</div>
              <div style={{ fontSize: 13, color: '#777' }}>Try adjusting your filters or search</div>
            </div>
          ) : (
            <div className="co-grid">
              {current.map((c, i) => <CompanyCard key={`${c.companyName}-${i}`} company={c} onClick={() => handleCardClick(c)} />)}
            </div>
          )}

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="co-pages">
              <button className="co-page-btn"
                onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                style={{ border: '1.5px solid #E5E5E5', background: '#fff', color: '#1A1A1A', opacity: page === 1 ? .4 : 1, cursor: page === 1 ? 'not-allowed' : 'pointer' }}>
                Previous
              </button>
              {pages.map((p, i) => p === '...' ? (
                <span key={`e${i}`} style={{ padding: '7px 4px', color: '#777' }}>…</span>
              ) : (
                <button key={p} className="co-page-btn" onClick={() => setPage(p as number)}
                  style={{ border: `1.5px solid ${page === p ? '#0A0A0A' : '#E5E5E5'}`, background: page === p ? '#0A0A0A' : '#fff', color: page === p ? '#F5C518' : '#1A1A1A', cursor: 'pointer' }}>
                  {p}
                </button>
              ))}
              <button className="co-page-btn"
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

const CompanyCard: React.FC<{ company: Company; onClick: () => void }> = ({ company, onClick }) => {
  const ind = getIndustry(company.sectors || []);
  const indColor = IND_COLORS[ind] || '#444';
  const verified = company.reviewStatus === 'approved';
  const bg = avColor(company.companyName);
  const [imgErr, setImgErr] = useState(false);

  return (
    <div className="co-card" onClick={onClick}>
      <div style={{ height: 4, background: indColor }} />

      <div className="co-card-top">
        <div className="co-avatar" style={{ background: bg }}>
          {company.previewImage && !imgErr ? (
            <img src={company.previewImage} alt="" onError={() => setImgErr(true)} />
          ) : getInitials(company.companyName)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span className="co-card-name">{company.companyName}</span>
            {verified && <BadgeCheck size={15} style={{ color: '#1a7a3a', flexShrink: 0 }} />}
          </div>
          {company.location && (
            <div className="co-card-loc"><MapPin size={11} />{company.location}</div>
          )}
        </div>
      </div>

      <div style={{ padding: '8px 15px', display: 'flex', gap: 5, flexWrap: 'wrap', alignItems: 'center' }}>
        {verified && (
          <span style={{ fontSize: 9.5, fontWeight: 800, padding: '2px 8px', borderRadius: 8, background: '#e8f5ec', color: '#1a7a3a', textTransform: 'uppercase' as const }}>Verified</span>
        )}
        {ind !== 'all' && (
          <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 7, background: ind === 'drone' ? '#E7F0FB' : ind === 'gis' ? '#e8f5ec' : '#EFE7FB', color: indColor, textTransform: 'uppercase' as const, letterSpacing: .3 }}>
            {ind.toUpperCase()}
          </span>
        )}
        {(company.sectors || []).slice(0, 2).map(s => (
          <span key={s} style={{ fontSize: 9.5, fontWeight: 600, padding: '2px 7px', borderRadius: 7, background: '#F8F8F8', color: '#444', border: '1px solid #E5E5E5' }}>{s}</span>
        ))}
      </div>

      <p className="co-card-desc">
        {company.companyDescription || company.aboutDescription || 'No description available.'}
      </p>

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

      <div className="co-card-foot">
        <button className="co-btn-out" onClick={e => { e.stopPropagation(); onClick(); }}>
          View Profile <ChevronRight size={12} />
        </button>
        <button className="co-btn-red" onClick={e => { e.stopPropagation(); onClick(); }}>
          Enquire
        </button>
      </div>
    </div>
  );
};

export default CompaniesPage;
