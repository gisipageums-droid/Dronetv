import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  MapPin,
  Star,
  Mail,
  Phone,
  Award,
  Users,
  Calendar,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Professional {
  id: string;
  fullName: string;
  profession: string;
  location: string;
  rating: number;
  experience: string;
  profilePicture: string;
  bio: string;
  specialties: string[];
  projects: number;
  featured: boolean;
  selectedTemplate: string;
}

interface SortOption {
  value: string;
  label: string;
}

const ProfessionalsPage: React.FC = () => {
  const [selectedProfession, setSelectedProfession] = useState<string>("All");
  const [selectedLocation, setSelectedLocation] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("name");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredProfessionals, setFilteredProfessionals] = useState<
    Professional[]
  >([]);
  const [allProfessionals, setAllProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const professionalsPerPage = 12;
  const navigate = useNavigate();

  // Static professionals data - Only Sumit Krishnan and Dev R
  const staticProfessionals: Professional[] = [
    {
      id: "1",
      fullName: "Dev R",
      profession: "Founder & CEO",
      location: "Singapore & India",
      rating: 4.8,
      experience: "16 years",
      profilePicture: "/images/dev.png",
      bio: "Founder & CEO with expertise in drone technology innovation, business strategy, and driving technological advancement in the industry. Passionate about broadcasting the future of drones through innovation and storytelling.",
      specialties: ["Business Strategy", "Drone Technology", "GIS", "AI Solutions"],
      projects: 150,
      featured: true,
      selectedTemplate: "2"
    },
    {
      id: "2",
      fullName: "Sumit Krishnan",
      profession: "DGCA RPAS Instructor",
      location: "India",
      rating: 4.9,
      experience: "11 years",
      profilePicture: "/images/sumit.jpg",
      bio: "DGCA-certified Remotely Piloted Aircraft Instructor with over 11 years of combined experience in drone operations and aerospace education. Specializes in training drone pilots and developing UAV curriculum.",
      specialties: ["RPAS Training", "Aerospace Education", "Flight Dynamics", "Technical Writing"],
      projects: 85,
      featured: true,
      selectedTemplate: "1"
    }
  ];

  const professions: string[] = [
    "All",
    "DGCA RPAS Instructor",
    "Founder & CEO"
  ];
  const locations: string[] = [
    "All",
    "India",
    "Singapore & India"
  ];
  const sortOptions: SortOption[] = [
    { value: "name", label: "Sort by Name" },
    { value: "rating", label: "Sort by Rating" },
    { value: "experience", label: "Sort by Experience" },
    { value: "location", label: "Sort by Location" },
  ];

  useEffect(() => {
    // Simulate loading for smooth transition
    const timer = setTimeout(() => {
      setAllProfessionals(staticProfessionals);
      setFilteredProfessionals(staticProfessionals);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (allProfessionals.length === 0) return;

    let filtered = allProfessionals;

    // Filter by profession
    if (selectedProfession !== "All") {
      filtered = filtered.filter(
        (professional) => professional.profession === selectedProfession
      );
    }

    // Filter by location
    if (selectedLocation !== "All") {
      filtered = filtered.filter(
        (professional) => professional.location === selectedLocation
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (professional) =>
          professional.fullName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          professional.profession
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          professional.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
          professional.specialties.some((specialty) =>
            specialty.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Sort professionals
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.fullName.localeCompare(b.fullName);
        case "rating":
          return b.rating - a.rating;
        case "experience":
          return parseInt(b.experience) - parseInt(a.experience);
        case "location":
          return a.location.localeCompare(b.location);
        default:
          return 0;
      }
    });

    setFilteredProfessionals(filtered);
    setCurrentPage(1);
  }, [
    selectedProfession,
    selectedLocation,
    sortBy,
    searchQuery,
    allProfessionals,
  ]);

  const featuredProfessionals = allProfessionals.filter(
    (professional) => professional.featured
  );
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

  const getProfessionColor = (profession: string): string => {
    switch (profession) {
      case "DGCA RPAS Instructor":
        return "bg-black";
      case "Founder & CEO":
        return "bg-red-600";
      default:
        return "bg-gray-800";
    }
  };

  const renderStars = (rating: number): JSX.Element[] => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? "text-yellow-500 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const handleAddEventClick = (): void => {
    navigate("/professional/select");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-yellow-400 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-black font-medium">Loading professionals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-400 pt-16">
      {/* Hero Section */}
      <section className="py-3 bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-500 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-200/30 rounded-full animate-pulse blur-2xl"></div>
          <div
            className="absolute bottom-10 right-10 w-40 h-40 bg-yellow-600/20 rounded-full animate-pulse blur-2xl"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-2xl md:text-5xl font-black text-black mb-2 tracking-tight">
            Meet Our Team
          </h1>
          <p className="text-xl text-black/80 max-w-2xl mx-auto mb-4">
            Meet the industry leaders driving innovation in drone technology and education
          </p>
          <div className="w-24 h-1 bg-black mx-auto rounded-full"></div>
        </div>
        <div className="absolute top-4 right-10 z-10 pointer-events-auto">
          <button
            onClick={handleAddEventClick}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-red-600 transition duration-300"
          >
            List your Profile
          </button>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-3 bg-yellow-400 sticky top-16 z-40 border-b border-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-2 items-center justify-between">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black/60" />
              <input
                type="text"
                placeholder="Search professionals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-lg border-2 border-black/20 bg-yellow-200 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/40 text-black placeholder-black/60 font-medium text-sm"
              />
            </div>
            <div className="flex gap-3">
              {[
                {
                  value: selectedProfession,
                  setValue: setSelectedProfession,
                  options: professions,
                  label: "Professions",
                },
                {
                  value: selectedLocation,
                  setValue: setSelectedLocation,
                  options: locations,
                  label: "Locations",
                },
                {
                  value: sortBy,
                  setValue: setSortBy,
                  options: sortOptions,
                  label: "Sort Options",
                },
              ].map(({ value, setValue, options, label }, idx) => (
                <div key={idx} className="relative">
                  <select
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="appearance-none bg-yellow-200 backdrop-blur-sm border-2 border-black/20 rounded-lg px-3 py-2 text-black font-medium focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/40"
                  >
                    {options.map((option: any) => (
                      <option
                        key={option.value || option}
                        value={option.value || option}
                      >
                        {option === "All"
                          ? `All ${label}`
                          : option.label || option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black/60 pointer-events-none" />
                </div>
              ))}
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {["Profession", "Location", "Search"].map((filter, idx) => {
              const value =
                filter === "Profession"
                  ? selectedProfession
                  : filter === "Location"
                  ? selectedLocation
                  : searchQuery;
              const setter =
                filter === "Profession"
                  ? setSelectedProfession
                  : filter === "Location"
                  ? setSelectedLocation
                  : setSearchQuery;
              return value !== "All" && value ? (
                <span
                  key={idx}
                  className="bg-black text-yellow-400 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                >
                  {filter}: {value}{" "}
                  <button
                    onClick={() => setter("All")}
                    className="hover:text-white transition-colors duration-200 text-sm"
                  >
                    ×
                  </button>
                </span>
              ) : null;
            })}
          </div>
        </div>
      </section>



{/* Featured Professionals Section
    <section className="py-4 bg-gradient-to-b from-yellow-400 to-yellow-300">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {featuredProfessionals.map((professional, index) => (
        <div
          key={professional.id}
          className="group bg-[#f1ee8e] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 cursor-pointer transform hover:scale-105 hover:-rotate-1"
          style={{
            animationDelay: `${index * 200}ms`,
            animation: `fadeInUp 0.8s ease-out ${index * 200}ms both`
          }}
          onClick={() =>
            professional.id === 2
              ? navigate('/company/portfolio-template-2')
              : navigate('/company/portfolio-template-1')
          }
        >
          <div className="p-8 text-center bg-[#f1ee8e]">
            Profile Picture
            <div className="relative mb-6">
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-yellow-400 group-hover:border-yellow-500 transition-all duration-300">
                <img
                  src={professional.profilePicture}
                  alt={professional.name}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                />
              </div>
              <div className="absolute -top-2 -right-2 bg-yellow-400 text-black px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                <Star className="h-3 w-3 fill-current" />
                Featured
              </div>
            </div>

            Professional Info
            <h3 className="text-xl font-bold text-black mb-1 group-hover:text-gray-800 transition-colors duration-300">
              {professional.name}
            </h3>
            
            <div className={`${getProfessionColor(professional.profession)} text-white px-3 py-1 rounded-full text-sm font-bold inline-block mb-3`}>
              {professional.profession}
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-600 mb-3">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{professional.location}</span>
            </div>
            <div className="flex items-center justify-center gap-1 mb-3">
              {renderStars(professional.rating)}
              <span className="ml-2 text-black font-semibold">{professional.rating}</span>
            </div>
            <p className="text-gray-600 mb-4 leading-relaxed text-sm">
              {professional.bio}
            </p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="text-center p-2 bg-yellow-300 rounded-lg">
                <div className="text-sm font-bold text-black">{professional.experience}</div>
                <div className="text-xs text-gray-600">Experience</div>
              </div>
              <div className="text-center p-2 bg-yellow-200 rounded-lg">
                <div className="text-sm font-bold text-yellow-700">{professional.projects}</div>
                <div className="text-xs text-yellow-600">Projects</div>
              </div>
            </div>
            <button className="bg-black text-yellow-400 px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 mx-auto">
              <Mail className="h-4 w-4" />
              Contact
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
 */}


      {/* All Professionals Grid Section */}
      <section className="py-16 bg-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-black text-black">
              Our Team ({filteredProfessionals.length})
            </h2>
            <div className="text-black/60">
              Page {currentPage} of {totalPages}
            </div>
          </div>

          {currentProfessionals.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-[#f1ee8e] backdrop-blur-sm rounded-3xl p-12 max-w-md mx-auto">
                <Search className="h-16 w-16 text-black/40 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-black mb-2">
                  No professionals found
                </h3>
                <p className="text-black/60">
                  Try adjusting your filters or search terms
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {currentProfessionals.map((professional, index) => (
                <div
                  key={professional.id}
                  className="group bg-[#f1ee8e] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 cursor-pointer transform hover:scale-105"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: `fadeInUp 0.8s ease-out ${index * 100}ms both`,
                  }}
                  onClick={() => {
                    // Ensure selectedTemplate exists and is valid
                    const template = professional.selectedTemplate || "1"; // default to template-1
                    const validTemplates = ["1", "2"]; // Add more if you have additional templates

                    // Validate the template format
                    const cleanTemplate = validTemplates.includes(
                      template.toString()
                    )
                      ? template.toString()
                      : "1";

                    // Navigate to the portfolio page
                    navigate(`/event/portfolio/template-${professional.selectedTemplate || '1'}/${professional.id}`)}}
                >


                  
                  <div className="p-6 text-center bg-[#f1ee8e]">
                    {/* Profile Picture */}
                    <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-3 border-yellow-400 group-hover:border-yellow-500 transition-all duration-300 mb-4">
                      <img
                        src={professional.profilePicture}
                        alt={professional.fullName}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80";
                        }}
                      />
                    </div>

                    {/* Professional Info */}
                    <h3 className="text-lg font-bold text-black mb-1 group-hover:text-gray-800 transition-colors duration-300">
                      {professional.fullName}
                    </h3>

                    <div
                      className={`${getProfessionColor(
                        professional.profession
                      )} text-white px-2 py-1 rounded-full text-xs font-bold inline-block mb-3`}
                    >
                      {professional.profession}
                    </div>

                    <div className="flex items-center justify-center gap-1 text-gray-600 mb-2 text-sm">
                      <MapPin className="h-3 w-3" />
                      <span>{professional.location}</span>
                    </div>

                    <div className="flex items-center justify-center gap-1 mb-3">
                      {renderStars(professional.rating)}
                      <span className="ml-1 text-black font-semibold text-sm">
                        {professional.rating}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-4 leading-relaxed text-sm line-clamp-2">
                      {professional.bio}
                    </p>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="text-center p-2 bg-yellow-300 rounded-lg">
                        <div className="text-xs font-bold text-black">
                          {professional.experience}
                        </div>
                        <div className="text-xs text-gray-600">Experience</div>
                      </div>
                      <div className="text-center p-2 bg-yellow-200 rounded-lg">
                        <div className="text-xs font-bold text-yellow-700">
                          {professional.projects}
                        </div>
                        <div className="text-xs text-yellow-600">Projects</div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {professional.specialties
                          .slice(0, 2)
                          .map((specialty, idx) => (
                            <span
                              key={specialty}
                              className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium"
                            >
                              {specialty}
                            </span>
                          ))}
                        {professional.specialties.length > 2 && (
                          <span className="bg-yellow-200 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                            +{professional.specialties.length - 2}
                          </span>
                        )}
                      </div>
                    </div>

                    <button className="bg-black text-yellow-400 px-4 py-2 rounded-xl font-semibold text-sm hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 mx-auto">
                      <Mail className="h-3 w-3" />
                      Contact
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-xl bg-yellow-100/80 backdrop-blur-sm border-2 border-black/20 text-black font-medium hover:bg-yellow-200 hover:border-black/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
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
                            : "bg-yellow-100/80 backdrop-blur-sm border-2 border-black/20 text-black hover:bg-yellow-200 hover:border-black/40"
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
                  className="px-4 py-2 rounded-xl bg-yellow-100/80 backdrop-blur-sm border-2 border-black/20 text-black font-medium hover:bg-yellow-200 hover:border-black/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
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