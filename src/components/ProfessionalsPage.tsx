import React, { useState, useEffect } from "react";
import { Search, ChevronDown, MapPin } from "lucide-react";
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Directory</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">Professionals <span className="text-yellow-400">Directory</span></h1>
            <p className="text-sm text-white/60 max-w-lg">Explore top professionals in drone, AI, and geospatial technology.</p>
          </div>
          <div className="flex flex-col items-end gap-4 flex-shrink-0">
            <div className="flex gap-8">
              <div>
                <span className="text-4xl font-extrabold text-yellow-400 block leading-none">{allProfessionals.length || '0'}</span>
                <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Profiles</span>
              </div>
            </div>
            <button
              onClick={() => navigate("/professional/select")}
              className="px-5 py-2.5 text-sm font-semibold text-black bg-yellow-400 rounded-lg hover:bg-yellow-300 transition"
            >
              List your Profile
            </button>
          </div>
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

      {/* Filter Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-[104px] z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex flex-col gap-2 justify-between items-center lg:flex-row">
            <div className="relative flex-1 max-w-xs">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search professionals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="py-2.5 pr-3 pl-9 w-full text-sm text-gray-900 bg-white rounded-xl border border-gray-200 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 placeholder-gray-400"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2.5 w-full sm:w-48 text-sm text-gray-700 bg-white rounded-xl border border-gray-200 appearance-none focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                >
                  {["All"].concat(Array.from(new Set(allProfessionals.flatMap(p => p.categories ?? [])))).map(cat => (
                    <option key={cat} value={cat}>{cat === "All" ? "All Categories" : cat}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 w-4 h-4 transform -translate-y-1/2 pointer-events-none text-gray-400" />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {selectedCategory !== "All" && (
              <span className="flex gap-1 items-center px-3 py-1 text-xs font-medium text-yellow-400 bg-black rounded-full">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory("All")} className="text-sm hover:text-white">×</button>
              </span>
            )}
            {searchQuery && (
              <span className="flex gap-1 items-center px-3 py-1 text-xs font-medium text-yellow-400 bg-black rounded-full">
                Search: "{searchQuery}"
                <button onClick={() => setSearchQuery("")} className="text-sm hover:text-white">×</button>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Professionals Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-12">
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-gray-500">{filteredProfessionals.length} professional{filteredProfessionals.length !== 1 ? 's' : ''}</p>
          {totalPages > 1 && <p className="text-sm text-gray-400">Page {currentPage} of {totalPages}</p>}
        </div>

        {currentProfessionals.length === 0 ? (
          <div className="py-16 text-center">
            <div className="p-10 mx-auto max-w-md rounded-xl border border-gray-200 bg-white">
              <Search className="mx-auto mb-4 w-12 h-12 text-gray-300" />
              <h3 className="mb-2 text-lg font-bold text-gray-900">No professionals found</h3>
              <p className="text-sm text-gray-400">Try adjusting your filters or search terms</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {currentProfessionals.map((professional, idx) => (
              <ProfessionalCard key={`all-${professional.professionalId}-${idx}`} professional={professional} index={idx} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center mt-10">
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 font-medium text-gray-700 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                if (page === currentPage || page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-xl font-medium transition-all text-sm ${page === currentPage ? "bg-black text-yellow-400 border border-black" : "border border-gray-200 text-gray-700 hover:bg-gray-50"}`}
                    >
                      {page}
                    </button>
                  );
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return <span key={page} className="px-2 text-gray-400">...</span>;
                }
                return null;
              })}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 font-medium text-gray-700 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalsPage;
