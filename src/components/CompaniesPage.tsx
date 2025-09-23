import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, MapPin, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from './loadingscreen';

// 1. Define Company Interface (adapted for new API)
interface Company {
  companyName: string;
  location?: string;
  sectors?: string[];
  previewImage?: string;
  heroImage?: string;
  aboutDescription?: string;
  [key: string]: any;
}

const CompaniesPage: React.FC = () => {
  // 2. Typed States
  const [loading, setLoading] = useState(true);
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [sortBy, setSortBy] = useState('companyName');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const companiesPerPage = 12;
  const navigate = useNavigate();

  // 3. Fetch Companies from API
  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const res = await fetch('https://v1lqhhm1ma.execute-api.ap-south-1.amazonaws.com/prod/dashboard-cards?viewType=main');
        const data = await res.json();
        // Set companies from `cards` array
        setAllCompanies(Array.isArray(data.cards) ? data.cards : []);
      } catch (error) {
        console.error(error);
        setAllCompanies([]);
      }
      setLoading(false);
    };
    fetchCompanies();
  }, []);

  // 4. Filtering & Sorting
  useEffect(() => {
    let filtered = allCompanies;

    // Filter by industry (map sectors[0] as industry)
    if (selectedIndustry !== 'All') {
      filtered = filtered.filter(company =>
        (company.sectors?.[0] || '').toLowerCase() === selectedIndustry.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(company =>
        company.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.aboutDescription?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sorting by name
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'companyName':
          return (a.companyName || '').localeCompare(b.companyName || '');
        default:
          return 0;
      }
    });

    setFilteredCompanies(filtered);
    setCurrentPage(1);
  }, [allCompanies, selectedIndustry, sortBy, searchQuery]);

  // 5. Pagination
  const indexOfLastCompany = currentPage * companiesPerPage;
  const indexOfFirstCompany = indexOfLastCompany - companiesPerPage;
  const currentCompanies = filteredCompanies.slice(indexOfFirstCompany, indexOfLastCompany);
  const totalPages = Math.ceil(filteredCompanies.length / companiesPerPage);

  // 6. Industry Colors (optional)
  const getIndustryColor = (industry: string | undefined) => {
    switch (industry) {
      case 'Drone Manufacturing': return 'bg-black';
      case 'AI Systems': return 'bg-gray-900';
      case 'GIS Mapping': return 'bg-gray-800';
      case 'Software & Cloud': return 'bg-gray-700';
      case 'Professional Services': return 'bg-gray-600';
      case 'Energy & Propulsion': return 'bg-black';
      case 'Startups': return 'bg-gray-900';
      default: return 'bg-gray-800';
    }
  };

  if (loading) {
    return (
      <LoadingScreen
        logoSrc="images/logo.png"
        loadingText="Loading Companies..."
      />
    );
  }

  return (
    <div className="min-h-screen bg-yellow-400 pt-16">
      {/* Hero Section */}
      <section className="py-3 bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-500 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-200/30 rounded-full animate-pulse blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-yellow-600/20 rounded-full animate-pulse blur-2xl" style={{ animationDelay: '2s' }}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-2xl md:text-5xl font-black text-black mb-2 tracking-tight">
            Companies Directory
          </h1>
          <p className="text-xl text-black/80 max-w-2xl mx-auto mb-4">
            Explore top companies leading drone, AI, and geospatial tech.
          </p>
          <div className="w-24 h-1 bg-black mx-auto rounded-full"></div>
        </div>
        <div className="absolute top-4 right-10 z-10 pointer-events-auto">
          <button
            onClick={() => navigate('/user/companies/template-selection')}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-red-600 transition duration-300"
          >
            List your Company
          </button>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-3 bg-yellow-400 sticky top-16 z-40 border-b border-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-2 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black/60" />
              <input
                type="text"
                placeholder="Search companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-lg border-2 border-black/20 bg-yellow-200 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/40 text-black placeholder-black/60 font-medium text-sm transition-all duration-300"
              />
            </div>

            {/* Filter and Sort Controls */}
            <div className="flex gap-3">
              <div className="relative">
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="appearance-none bg-yellow-200 backdrop-blur-sm border-2 border-black/20 rounded-lg px-3 py-2 text-black font-medium focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/40 text-sm transition-all duration-300 w-48"
                >
                  {['All'].concat(
                    Array.from(new Set(allCompanies.flatMap(c => c.sectors ?? [])))
                  ).map(industry => (
                    <option key={industry} value={industry}>
                      {industry === 'All' ? 'All Industries' : industry}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black/60 pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="appearance-none bg-yellow-200 backdrop-blur-sm border-2 border-black/20 rounded-lg px-3 py-2 text-black font-medium focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/40 text-sm transition-all duration-300 w-48"
                >
                  <option value="companyName">Sort by Name</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black/60 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Active Filters */}
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedIndustry !== 'All' && (
              <span className="bg-black text-yellow-400 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                Industry: {selectedIndustry}
                <button onClick={() => setSelectedIndustry('All')} className="hover:text-white transition-colors duration-200 text-sm">×</button>
              </span>
            )}
            {searchQuery && (
              <span className="bg-black text-yellow-400 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                Search: "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="hover:text-white transition-colors duration-200 text-sm">×</button>
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Companies Grid Section */}
      <section className="py-16 bg-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-black text-black">
              All Companies ({filteredCompanies.length})
            </h2>
            <div className="text-black/60">
              Page {currentPage} of {totalPages}
            </div>
          </div>
          {currentCompanies.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 max-w-md mx-auto">
                <Search className="h-16 w-16 text-black/40 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-black mb-2">No companies found</h3>
                <p className="text-black/60">Try adjusting your filters or search terms</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {currentCompanies.map((company, idx) => {
                const totalServices = company.servicesCount || 0; // Assuming servicesCount exists
                const totalProducts = company.productsCount; // No products in this API currently
                return (
                  <div
                    key={company.companyName + idx}
                    className="group  bg-[#f1ee8e] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 cursor-pointer transform hover:scale-105"
                  >
                    <div className="relative p-8  transition-all duration-500">
                      <div className="flex justify-center mb-4">
                        <div className="relative">
                          <div className="absolute inset-0 bg-yellow-400/20 rounded-2xl blur-xl scale-150 group-hover:scale-200 transition-all duration-700"></div>
                          <div className="relative bg-yellow-400/20 backdrop-blur-sm rounded-2xl flex items-center justify-center w-16 h-16 group-hover:scale-110 transition-all duration-500 border border-yellow-400/30 group-hover:shadow-lg group-hover:shadow-yellow-400/30">
                            {company.previewImage ? (
                              <img
                                src={company.previewImage}
                                alt={company.companyName}
                                className="w-12 h-12 object-contain object-center bg-white"
                                style={{ background: "#fff" }}
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gray-200 rounded-2xl"></div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-center">
                        <h3 className="text-xl font-bold text-black mb-2 group-hover:text-gray-800 transition-colors duration-300">
                          {company.companyName}
                        </h3>
                        {company.location && (
                          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-2">
                            <MapPin className="h-3 w-3" />
                            {company.location} 
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="relative p-8  transition-all duration-500">
                      <p className="text-gray-600 mb-4 leading-relaxed text-sm line-clamp-3">
                        {company.companyDescription || 'No company description.'}
                      </p>

                      {/* Services & Products */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex-1 bg-yellow-300 rounded-lg p-3 text-center">
                          <div className="text-lg font-bold text-black">{totalServices}</div>
                          <div className="text-xs text-gray-600">Total Services</div>
                        </div>
                        <div className="flex-1 bg-yellow-300 rounded-lg p-3 text-center">
                          <div className="text-lg font-bold text-yellow-700">{totalProducts}</div>
                          <div className="text-xs text-yellow-700">Total Products</div>
                        </div>
                      </div>

                      <div className="flex justify-center">
                        <button
                          // onClick={() => {
                          //   if (!company.isTemplate2 ) {
                          //     navigate(`/admin/companies/preview/1/${publishedId}/${company.userId}`);
                          //   } else if (company.isTemplate2) {
                          //     navigate(`/admin/companies/preview/2/${publishedId}/${company.userId}`);
                          //   }
                          // }}
                          onClick={() => {
                          if (company.templateSelection=== 'template-1') {
                            navigate(`/company/${company.urlSlug}`);
                          } else if (company.templateSelection === 'template-2') {
                            navigate(`/companies/${company.urlSlug}`);
                          }
                        }}
                          className="group/btn bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-4 py-2 rounded-xl font-semibold text-sm hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg"
                        >
                          <span>View Profile </span>
                          <ExternalLink className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform duration-300" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-xl bg-white/80 backdrop-blur-sm border-2 border-black/20 text-black font-medium hover:bg-white hover:border-black/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
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
                        className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${page === currentPage
                          ? 'bg-black text-yellow-400 border-2 border-black'
                          : 'bg-white/80 backdrop-blur-sm border-2 border-black/20 text-black hover:bg-white hover:border-black/40'
                          }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return <span key={page} className="px-2 text-black/60">...</span>;
                  }
                  return null;
                })}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-xl bg-white/80 backdrop-blur-sm border-2 border-black/20 text-black font-medium hover:bg-white hover:border-black/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
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

export default CompaniesPage;
