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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
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
    </div>
  );
};

export default ProfessionalsPage;
