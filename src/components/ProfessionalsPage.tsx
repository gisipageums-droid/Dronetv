import React, { useState, useEffect } from "react";
import { Search, ChevronDown, MapPin, ExternalLink, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "./loadingscreen";

// 1. Define Professional Interface (adapted for new API)
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
  // 2. Typed States
  const [loading, setLoading] = useState(true);
  const [allProfessionals, setAllProfessionals] = useState<Professional[]>([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState<
    Professional[]
  >([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("fullName");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const professionalsPerPage = 12;
  const navigate = useNavigate();

  // 3. Fetch Professionals from API
  useEffect(() => {
    const fetchProfessionals = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          "https://zgkue3u9cl.execute-api.ap-south-1.amazonaws.com/prod/professional-dashboard-cards?viewType=main"
        );
        const data = await res.json();

        // Set professionals from `cards` array
        const professionals = Array.isArray(data.cards) ? data.cards : [];
        setAllProfessionals(professionals);
      } catch (error) {
        console.error("Error fetching professionals:", error);
        setAllProfessionals([]);
      }
      setLoading(false);
    };
    fetchProfessionals();
  }, []);

  // 4. Filtering & Sorting
  useEffect(() => {
    let filtered = allProfessionals;

    // Filter by category (map categories[0] as category)
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (professional) =>
          (professional.categories?.[0] || "").toLowerCase() ===
          selectedCategory.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (professional) =>
          professional.fullName
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          professional.professionalName
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          professional.professionalDescription
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    // Sorting by name
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "fullName":
          return (a.fullName || "").localeCompare(b.fullName || "");
        default:
          return 0;
      }
    });

    setFilteredProfessionals(filtered);
    setCurrentPage(1);
  }, [allProfessionals, selectedCategory, sortBy, searchQuery]);

  // 5. Pagination
  const indexOfLastProfessional = currentPage * professionalsPerPage;
  const indexOfFirstProfessional =
    indexOfLastProfessional - professionalsPerPage;
  const currentProfessionals = filteredProfessionals.slice(
    indexOfFirstProfessional,
    indexOfLastProfessional
  );
  const totalPages = Math.ceil(
    filteredProfessionals.length / professionalsPerPage
  );

  // 6. Category Colors (optional)
  const getCategoryColor = (category: string | undefined) => {
    switch (category) {
      case "Drone Manufacturing":
        return "bg-black";
      case "AI Systems":
        return "bg-gray-900";
      case "GIS Mapping":
        return "bg-gray-800";
      case "Software & Cloud":
        return "bg-gray-700";
      case "Professional Services":
        return "bg-gray-600";
      case "Energy & Propulsion":
        return "bg-black";
      case "Startups":
        return "bg-gray-900";
      default:
        return "bg-gray-800";
    }
  };

  // 7. Professional Card Component (reusable)
  const ProfessionalCard: React.FC<{
    professional: Professional;
    index: number;
  }> = ({ professional, index }) => {
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
            // Default fallback
            navigate(`/professional/${professional.userName}`);
          }
        }}
        className="group bg-[#f1ee8e] rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-[1.02] flex flex-col justify-between"
      >
        {/* Image Section - Full Width Banner */}
        <div className="relative w-full h-56 bg-yellow-100 overflow-hidden">
          {professional.previewImage ? (
            <img
              src={professional.previewImage}
              alt={displayName}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex justify-center items-center w-full h-full bg-yellow-200">
              <span className="text-5xl font-bold text-gray-700 uppercase">
                {displayName[0]}
              </span>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="flex flex-col items-center px-4 pt-4 pb-2 text-center">
          <h3 className="mb-1 text-lg font-bold text-black transition-colors group-hover:text-gray-800 line-clamp-1">
            {displayName}
          </h3>
          {professional.location &&
            professional.location !== "Location Not Specified" && (
              <div className="flex gap-1 justify-center items-center text-xs text-gray-600">
                <MapPin className="w-3 h-3" />
                {professional.location}
              </div>
            )}
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col flex-1 justify-between px-4 pb-4">
          <p className="mb-3 text-xs text-gray-700 line-clamp-2 text-center">
            {professional.professionalDescription ||
              "No professional description."}
          </p>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="py-1 text-center bg-yellow-200 rounded-md">
              <div className="text-sm font-bold text-black">{totalSkills}</div>
              <div className="text-[10px] text-gray-600">Skills</div>
            </div>
            <div className="py-1 text-center bg-yellow-200 rounded-md">
              <div className="text-sm font-bold text-yellow-700">
                {totalServices}
              </div>
              <div className="text-[10px] text-yellow-700">Services</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <LoadingScreen
        logoSrc="images/logo.png"
        loadingText="Loading Professionals..."
      />
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-yellow-400">
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl overflow-hidden relative sm:px-6 lg:px-8 py-8 flex md:flex-row flex-col justify-between items-center md:items-start">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full blur-2xl animate-pulse bg-yellow-200/30"></div>
          <div
            className="absolute right-10 bottom-10 w-40 h-40 rounded-full blur-2xl animate-pulse bg-yellow-600/20"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="text-center md:text-left">
          <h1 className="mb-2 text-3xl mt-[40px] sm:mt-[0px] font-black tracking-tight text-black md:text-5xl">
            Professionals Directory
          </h1>
          <p className="mb-4 max-w-2xl mt-[15px] text-sm md:text-xl text-black/80">
            Explore top professionals in drone, AI, and geospatial technology.
          </p>
        </div>

        <button
          onClick={() => navigate("/professional/select")}
          className="px-6 h-12 text-sm font-semibold text-white bg-black rounded-lg transition duration-300 hover:bg-gray-800"
        >
          List your Profile
        </button>
      </section>

      {/* Filter Section  */}
      <section className="sticky top-16 z-40 py-3 bg-yellow-400 border-b border-black/10">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2 justify-between items-center lg:flex-row">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 w-4 h-4 transform -translate-y-1/2 text-black/60" />
              <input
                type="text"
                placeholder="Search professionals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="py-2 pr-3 pl-10 w-full text-sm font-medium text-black bg-yellow-200 rounded-lg border-2 backdrop-blur-sm transition-all duration-300 border-black/20 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/40 placeholder-black/60"
              />
            </div>

            {/* Filter and Sort Controls  */}
            <div className="flex gap-3">
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 w-48 text-sm font-medium text-black bg-yellow-200 rounded-lg border-2 backdrop-blur-sm transition-all duration-300 appearance-none border-black/20 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/40"
                >
                  {["All"]
                    .concat(
                      Array.from(
                        new Set(
                          allProfessionals.flatMap((p) => p.categories ?? [])
                        )
                      )
                    )
                    .map((category) => (
                      <option key={category} value={category}>
                        {category === "All" ? "All Categories" : category}
                      </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 w-4 h-4 transform -translate-y-1/2 pointer-events-none text-black/60" />
              </div>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 w-48 text-sm font-medium text-black bg-yellow-200 rounded-lg border-2 backdrop-blur-sm transition-all duration-300 appearance-none border-black/20 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/40"
                >
                  <option value="fullName">Sort by Name</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 w-4 h-4 transform -translate-y-1/2 pointer-events-none text-black/60" />
              </div>
            </div>
          </div>

          {/* Active Filters  */}
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedCategory !== "All" && (
              <span className="flex gap-1 items-center px-3 py-1 text-xs font-medium text-yellow-400 bg-black rounded-full">
                Category: {selectedCategory}
                <button
                  onClick={() => setSelectedCategory("All")}
                  className="text-sm transition-colors duration-200 hover:text-white"
                >
                  ×
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="flex gap-1 items-center px-3 py-1 text-xs font-medium text-yellow-400 bg-black rounded-full">
                Search: "{searchQuery}"
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-sm transition-colors duration-200 hover:text-white"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      </section>

      {/* All Professionals Section  */}
      <section className="py-8 bg-yellow-400">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2 items-center">
              <h2 className="text-2xl font-black text-black md:text-3xl">
                All Professionals
              </h2>
              <span className="hidden px-3 py-1 text-sm font-medium text-black bg-yellow-200 rounded-full">
                {filteredProfessionals.length} {filteredProfessionals.length === 1 ? 'professional' : 'professionals'}
              </span>
            </div>
            <div className="text-black/60">
              Page {currentPage} of {totalPages}
            </div>
          </div>

          {currentProfessionals.length === 0 ? (
            <div className="py-16 text-center">
              <div className="p-12 mx-auto max-w-md rounded-3xl backdrop-blur-sm bg-white/80">
                <Search className="mx-auto mb-4 w-16 h-16 text-black/40" />
                <h3 className="mb-2 text-2xl font-bold text-black">
                  No professionals found
                </h3>
                <p className="text-black/60">
                  Try adjusting your filters or search terms
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {currentProfessionals.map((professional, idx) => (
                <ProfessionalCard
                  key={`all-${professional.professionalId}-${idx}`}
                  professional={professional}
                  index={idx}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <div className="flex gap-2 items-center">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-4 py-2 font-medium text-black rounded-xl border-2 backdrop-blur-sm transition-all duration-300 bg-white/80 border-black/20 hover:bg-white hover:border-black/40 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  if (
                    page === currentPage ||
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                          page === currentPage
                            ? "bg-black text-yellow-400 border-2 border-black"
                            : "bg-white/80 backdrop-blur-sm border-2 border-black/20 text-black hover:bg-white hover:border-black/40"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return (
                      <span key={page} className="px-2 text-black/60">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 font-medium text-black rounded-xl border-2 backdrop-blur-sm transition-all duration-300 bg-white/80 border-black/20 hover:bg-white hover:border-black/40 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProfessionalsPage;
