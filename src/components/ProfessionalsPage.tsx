import React, { useState, useEffect } from "react";
import { Search, ChevronDown, MapPin, SlidersHorizontal, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "./loadingscreen";
import { PROFESSIONAL_API, LAMBDA } from '../lib/apiConfig';

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
  skillsCount?: number;
  servicesCount?: number;
  reviewStatus?: string;
  status?: boolean;
  [key: string]: any;
}

const ProfessionalsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [allProfessionals, setAllProfessionals] = useState<Professional[]>([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState<Professional[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("fullName");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const professionalsPerPage = 12;
  const navigate = useNavigate();

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
      filtered = filtered.filter(p =>
        (p.categories?.[0] || "").toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.professionalName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.professionalDescription?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    filtered = [...filtered].sort((a, b) => (a.fullName || "").localeCompare(b.fullName || ""));
    setFilteredProfessionals(filtered);
    setCurrentPage(1);
  }, [allProfessionals, selectedCategory, sortBy, searchQuery]);

  const indexOfLastProfessional = currentPage * professionalsPerPage;
  const indexOfFirstProfessional = indexOfLastProfessional - professionalsPerPage;
  const currentProfessionals = filteredProfessionals.slice(indexOfFirstProfessional, indexOfLastProfessional);
  const totalPages = Math.ceil(filteredProfessionals.length / professionalsPerPage);

  const ProfessionalCard: React.FC<{ professional: Professional; index: number }> = ({ professional }) => {
    const totalSkills = professional.skillsCount || 0;
    const totalServices = professional.servicesCount || 0;
    const displayName = professional.fullName || professional.professionalName;

    return (
      <div
        onClick={() => {
          if (professional.templateSelection === "template-1") {
            navigate(`/professional/${professional.userName}`);
          } else if (professional.templateSelection === "template-2") {
            navigate(`/professionals/${professional.userName}`);
          } else {
            navigate(`/professional/${professional.userName}`);
          }
        }}
        className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden flex flex-col"
      >
        <div className="relative w-full h-48 bg-gray-100 overflow-hidden flex items-center justify-center">
          {professional.previewImage ? (
            <img
              src={professional.previewImage}
              alt={displayName}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex justify-center items-center w-full h-full bg-gray-100">
              <span className="text-5xl font-bold text-gray-400 uppercase">
                {displayName?.[0] || '?'}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center px-4 pt-4 pb-2 text-center">
          <h3 className="mb-1 text-sm font-bold text-gray-900 line-clamp-1">{displayName}</h3>
          {professional.location && professional.location !== "Location Not Specified" && (
            <div className="flex gap-1 justify-center items-center text-xs text-gray-500">
              <MapPin className="w-3 h-3" />
              {professional.location}
            </div>
          )}
        </div>

        <div className="flex flex-col flex-1 justify-between px-4 pb-4">
          <p className="mb-3 text-xs text-gray-500 line-clamp-2 text-center">
            {professional.professionalDescription || "No professional description."}
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div className="py-1.5 text-center bg-gray-50 rounded-lg border border-gray-100">
              <div className="text-sm font-bold text-gray-900">{totalSkills}</div>
              <div className="text-[10px] text-gray-500">Skills</div>
            </div>
            <div className="py-1.5 text-center bg-gray-50 rounded-lg border border-gray-100">
              <div className="text-sm font-bold text-gray-900">{totalServices}</div>
              <div className="text-[10px] text-gray-500">Services</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <LoadingScreen logoSrc="/images/logo.png" loadingText="Loading Professionals..." />;
  }

  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
          <h1 className="text-base font-extrabold text-white m-0">Professionals <span className="text-yellow-400">Directory</span> <span className="text-xs font-semibold text-white/50 ml-2">{allProfessionals.length || '0'} Profiles</span></h1>
          <button
            onClick={() => navigate("/professional/select")}
            className="px-3 py-1.5 text-xs font-semibold text-black bg-yellow-400 rounded-lg hover:bg-yellow-300 transition flex-shrink-0"
          >
            List your Profile
          </button>
        </div>
      </div>

      {/* Hub Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
          <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Hub</span>
          Everything You Need as a Drone, GIS & AI Professional
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {[
            { to: '/professionals/job-board', icon: '💼', count: '20+', unit: 'Jobs Listed', title: 'Job Board', desc: 'Drone pilot, GIS analyst, AI engineer, instructor, and UAV operator jobs across India.' },
            { to: '/professionals/pilot-directory', icon: '🧑‍✈️', count: 'Free', unit: 'To List', title: 'Pilot Directory', desc: 'Create your verified pilot profile. Get discovered by drone companies hiring or contracting.' },
            { to: '/professionals/certifications', icon: '🏅', count: '3', unit: 'Categories', title: 'Certifications', desc: 'Complete DGCA RPC certification guide — Small, Medium, and Large drone categories.' },
            { to: '/professionals/portfolio', icon: '🗂️', count: 'Free', unit: 'To Upload', title: 'Portfolio', desc: 'Showcase your drone work — aerial maps, farm surveys, inspection reports, cinematic reels.' },
            { to: '/professionals/training', icon: '🎓', count: '240+', unit: 'RPTOs', title: 'Training', desc: 'Find DGCA-approved training organisations near you and compare courses.' },
            { to: '/professionals/networking', icon: '🔗', count: 'Events', unit: 'Meetups', title: 'Networking', desc: 'Connect with drone companies, fellow pilots, and industry professionals at events.' },
            { to: '/professionals/community', icon: '👥', count: 'Active', unit: 'Community', title: 'Community', desc: 'Discussion forums, WhatsApp groups, flyins, and peer support across India.' },
            { to: '/professionals/certifications', icon: '⚡', count: 'Rs.50K', unit: 'Starting Cost', title: 'Start Here', desc: 'New to drones? Complete 5-day DGCA Small category certification. Start earning from month one.', highlight: true },
          ].map(card => (
            <a key={card.to} href={card.to}
              className={`rounded-xl border shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col ${card.highlight ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 bg-white'}`}>
              <div className={`px-4 py-3 flex items-center gap-3 ${card.highlight ? 'bg-yellow-400' : 'bg-black'}`}>
                <span className="text-xl">{card.icon}</span>
                <div>
                  <span className={`text-sm font-extrabold block leading-none ${card.highlight ? 'text-black' : 'text-white'}`}>{card.count}</span>
                  <span className={`text-xs ${card.highlight ? 'text-black/60' : 'text-white/50'}`}>{card.unit}</span>
                </div>
              </div>
              <div className="px-4 py-3 flex-1">
                <p className="font-bold text-gray-900 text-sm mb-1">{card.title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{card.desc}</p>
              </div>
              <div className={`px-4 py-2 border-t ${card.highlight ? 'border-yellow-200' : 'border-gray-100'}`}>
                <span className={`text-xs font-bold ${card.highlight ? 'text-yellow-700' : 'text-yellow-600'}`}>Explore →</span>
              </div>
            </a>
          ))}
        </div>

        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
          <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">2026</span>
          Why Drone is the Right Career
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
          {[
            { icon: '📈', title: '2 Lakh Pilots Needed — Only 39,890 Certified', desc: "India's drone sector needs 2 lakh certified pilots by 2026. As of February 2026, only 39,890 are certified. That skill gap means strong job security, rising salaries, and wide choice of employers for anyone who qualifies now." },
            { icon: '💰', title: 'Salary from Rs. 25,000 to Rs. 1,00,000 Per Month', desc: 'Entry-level certified pilots earn Rs. 25,000–40,000/month. Experienced pilots in GIS, defence, or specialised inspection roles earn Rs. 10–20 LPA or more. Freelance operators earn project-based income on top.' },
            { icon: '⚡', title: 'Get Certified in 5 Days for Small Category', desc: 'DGCA Small category Remote Pilot Certificate takes just 5 days at an approved RPTO. Total cost including training, medical, and DGCA fees ranges from Rs. 50,000 upwards. No engineering degree required — Class 10 pass is sufficient.' },
            { icon: '🌾', title: 'Jobs in Agriculture, Survey, Defence, Media, Logistics', desc: 'Agriculture spraying, GIS mapping, infrastructure inspection, aerial cinematography, defence surveillance, and drone delivery are all active hiring sectors. Specialise in what interests you most.' },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-start gap-4">
              <span className="text-2xl flex-shrink-0">{item.icon}</span>
              <div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
.prf-wrap{max-width:1280px;margin:0 auto;padding:20px 22px}
.prf-layout{display:grid;grid-template-columns:240px 1fr;gap:16px;align-items:start}
.prf-sidebar{background:#fff;border:1px solid #E5E5E5;border-radius:8px;padding:14px;box-shadow:0 2px 12px rgba(0,0,0,.06);position:sticky;top:120px}
.prf-sidebar-title{font-size:13px;font-weight:800;color:#0A0A0A;margin-bottom:14px;display:flex;align-items:center;gap:6px}
.prf-filter-grp{margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid #F0F0F0}
.prf-filter-grp:last-child{border-bottom:none;margin-bottom:0;padding-bottom:0}
.prf-fl-label{font-size:10px;font-weight:700;color:#777;text-transform:uppercase;letter-spacing:.5px;margin-bottom:7px}
.prf-chip{padding:4px 10px;border-radius:14px;font-size:11.5px;font-weight:600;cursor:pointer;transition:all .12s;white-space:nowrap;border:1.5px solid #E5E5E5;background:#fff;color:#333;font-family:inherit}
.prf-chip.active{background:#0A0A0A;color:#F5C518;border-color:#0A0A0A}
.prf-chips{display:flex;gap:5px;flex-wrap:wrap}
.prf-main{min-width:0}
.prf-search-bar{background:#fff;border:1px solid #E5E5E5;border-radius:8px;padding:10px 12px;box-shadow:0 1px 6px rgba(0,0,0,.06);margin-bottom:12px;display:flex;align-items:center;gap:8px}
.prf-search-bar input{border:none;background:none;font-size:13px;width:100%;outline:none;color:#1A1A1A;font-family:inherit}
.prf-resbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;flex-wrap:wrap;gap:7px}
.prf-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:13px}
.prf-pages{display:flex;justify-content:center;margin-top:28px;gap:6px;flex-wrap:wrap}
.prf-page-btn{padding:7px 13px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;border:1.5px solid #E5E5E5;background:#fff;color:#444;font-family:inherit}
.prf-page-btn.active{background:#0A0A0A;color:#F5C518;border-color:#0A0A0A}
.prf-filter-toggle{display:none}
@media(max-width:960px){
  .prf-layout{grid-template-columns:1fr}
  .prf-sidebar{position:static;display:none}
  .prf-sidebar.open{display:block}
  .prf-filter-toggle{display:flex;align-items:center;gap:6px;padding:7px 12px;background:#0A0A0A;color:#F5C518;border:none;border-radius:8px;font-size:12.5px;font-weight:700;cursor:pointer;font-family:inherit;margin-bottom:10px}
}
@media(max-width:600px){.prf-wrap{padding:12px 14px}.prf-grid{grid-template-columns:repeat(2,1fr)}}
`}</style>

      {/* Professionals listing with sidebar */}
      <div className="prf-wrap">
        <div className="prf-layout">
          {/* Sidebar */}
          <aside className={`prf-sidebar${sidebarOpen ? ' open' : ''}`}>
            <div className="prf-sidebar-title"><SlidersHorizontal size={14} /> Filters</div>

            <div className="prf-filter-grp">
              <div className="prf-fl-label">Search</div>
              <div className="prf-search-bar">
                <Search size={14} color="#999" />
                <input placeholder="Search professionals..." value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }} />
                {searchQuery && <X size={13} color="#999" style={{cursor:'pointer',flexShrink:0}} onClick={() => setSearchQuery('')} />}
              </div>
            </div>

            <div className="prf-filter-grp">
              <div className="prf-fl-label">Category</div>
              <div className="prf-chips">
                {["All"].concat(Array.from(new Set(allProfessionals.flatMap(p => p.categories ?? [])))).map(cat => (
                  <button key={cat} className={`prf-chip${selectedCategory === cat ? ' active' : ''}`} onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}>
                    {cat === "All" ? "All" : cat}
                  </button>
                ))}
              </div>
            </div>

            {(searchQuery || selectedCategory !== "All") && (
              <button onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setCurrentPage(1); }}
                style={{width:'100%',padding:'7px',borderRadius:'8px',fontSize:'12px',fontWeight:700,background:'#0A0A0A',color:'#F5C518',border:'none',cursor:'pointer',fontFamily:'inherit'}}>
                Clear All Filters
              </button>
            )}
          </aside>

          {/* Main */}
          <div className="prf-main">
            <button className="prf-filter-toggle" onClick={() => setSidebarOpen(o => !o)}>
              <SlidersHorizontal size={14} /> Filters {(searchQuery || selectedCategory !== 'All') ? '(active)' : ''}
            </button>

            <div className="prf-resbar">
              <span style={{fontSize:'13px',color:'#666'}}>{filteredProfessionals.length} professional{filteredProfessionals.length !== 1 ? 's' : ''}</span>
              {totalPages > 1 && <span style={{fontSize:'12px',color:'#999'}}>Page {currentPage} of {totalPages}</span>}
            </div>

            {currentProfessionals.length === 0 ? (
              <div style={{textAlign:'center',padding:'64px 0'}}>
                <div style={{background:'#fff',border:'1px solid #E5E5E5',borderRadius:'12px',padding:'48px 32px',maxWidth:'360px',margin:'0 auto'}}>
                  <Search size={40} color="#ccc" style={{margin:'0 auto 12px'}} />
                  <p style={{fontWeight:700,color:'#333',marginBottom:4}}>No professionals found</p>
                  <p style={{fontSize:'13px',color:'#999'}}>Try adjusting your filters</p>
                </div>
              </div>
            ) : (
              <div className="prf-grid">
                {currentProfessionals.map((professional, idx) => (
                  <ProfessionalCard key={`all-${professional.professionalId}-${idx}`} professional={professional} index={idx} />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="prf-pages">
                <button className="prf-page-btn" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>← Prev</button>
                {[...Array(totalPages)].map((_, i) => {
                  const pg = i + 1;
                  if (pg === currentPage || pg === 1 || pg === totalPages || (pg >= currentPage - 1 && pg <= currentPage + 1)) {
                    return <button key={pg} className={`prf-page-btn${pg === currentPage ? ' active' : ''}`} onClick={() => setCurrentPage(pg)}>{pg}</button>;
                  } else if (pg === currentPage - 2 || pg === currentPage + 2) {
                    return <span key={pg} style={{alignSelf:'center',color:'#999'}}>…</span>;
                  }
                  return null;
                })}
                <button className="prf-page-btn" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Next →</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalsPage;
