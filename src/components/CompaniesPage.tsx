import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, MapPin, BadgeCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from './loadingscreen';

interface Company {
  companyName: string;
  location?: string;
  sectors?: string[];
  previewImage?: string;
  heroImage?: string;
  aboutDescription?: string;
  createdAt?: string;
  publishedDate?: string;
  templateSelection?: string;
  urlSlug?: string;
  servicesCount?: number;
  productsCount?: number;
  companyDescription?: string;
  reviewStatus?: string;
  [key: string]: any;
}

const CompaniesPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [sortBy, setSortBy] = useState('createdAt');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const companiesPerPage = 12;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const res = await fetch('https://v1lqhhm1ma.execute-api.ap-south-1.amazonaws.com/prod/dashboard-cards?viewType=main');
        const data = await res.json();
        const companies = Array.isArray(data.cards) ? data.cards : [];
        const seenIds = new Set<string>();
        const seenNames = new Set<string>();
        const unique = companies.filter((company: Company) => {
          const id = (company.publishedId || '').toLowerCase().trim();
          const name = (company.companyName || '').toLowerCase().trim();
          if (id && seenIds.has(id)) return false;
          if (name && seenNames.has(name)) return false;
          if (id) seenIds.add(id);
          if (name) seenNames.add(name);
          return true;
        });
        setAllCompanies(unique);
      } catch {
        setAllCompanies([]);
      }
      setLoading(false);
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    let filtered = allCompanies;
    if (selectedIndustry !== 'All') {
      filtered = filtered.filter(company =>
        (company.sectors?.[0] || '').toLowerCase() === selectedIndustry.toLowerCase()
      );
    }
    if (searchQuery) {
      filtered = filtered.filter(company =>
        company.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.aboutDescription?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'companyName':
          return (a.companyName || '').localeCompare(b.companyName || '');
        case 'createdAt':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        default:
          return 0;
      }
    });
    setFilteredCompanies(filtered);
    setCurrentPage(1);
  }, [allCompanies, selectedIndustry, sortBy, searchQuery]);

  const indexOfLastCompany = currentPage * companiesPerPage;
  const indexOfFirstCompany = indexOfLastCompany - companiesPerPage;
  const currentCompanies = filteredCompanies.slice(indexOfFirstCompany, indexOfLastCompany);
  const totalPages = Math.ceil(filteredCompanies.length / companiesPerPage);

  const handleCardClick = (company: Company) => {
    const slug = (company as any).urlSlug || (company as any).publishedId || (company as any).companyId;
    if (!slug) return;
    if (company.templateSelection === 'template-1') {
      navigate(`/company/${slug}`);
    } else if (company.templateSelection === 'template-2') {
      navigate(`/companies/${slug}`);
    }
  };

  const CompanyCard: React.FC<{ company: Company; index: number }> = ({ company }) => {
    const totalServices = company.servicesCount || 0;
    const totalProducts = company.productsCount || 0;

    return (
      <div
        onClick={() => handleCardClick(company)}
        className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden flex flex-col"
      >
        <div className="relative w-full h-48 bg-gray-100 overflow-hidden p-4 flex items-center justify-center">
          {company.previewImage ? (
            <img
              src={company.previewImage}
              alt={company.companyName}
              className="object-contain w-full h-full transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
          ) : null}
          <div
            className="flex-col justify-center items-center w-full h-full bg-gray-100 px-4 gap-2"
            style={{ display: company.previewImage ? 'none' : 'flex' }}
          >
            <p className="text-2xl font-black text-gray-500 text-center uppercase leading-snug tracking-wide">
              {company.companyName.split(' ')[0]}
            </p>
            <p className="text-xs font-semibold text-gray-400 text-center uppercase tracking-widest opacity-70">
              {company.companyName}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center px-4 pt-4 pb-2 text-center">
          <div className="flex items-center gap-1 mb-1">
            <h3 className="text-sm font-bold text-gray-900 line-clamp-1">{company.companyName}</h3>
            {company.reviewStatus === 'approved' && (
              <BadgeCheck className="w-4 h-4 text-green-600 flex-shrink-0" title="Verified" />
            )}
          </div>
          {company.location && (
            <div className="flex gap-1 justify-center items-center text-xs text-gray-500">
              <MapPin className="w-3 h-3" />
              {company.location}
            </div>
          )}
        </div>

        <div className="flex flex-col flex-1 justify-between px-4 pb-4">
          <p className="mb-3 text-xs text-gray-500 line-clamp-2 text-center">
            {company.companyDescription || "No company description."}
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div className="py-1.5 text-center bg-gray-50 rounded-lg border border-gray-100">
              <div className="text-sm font-bold text-gray-900">{totalServices}</div>
              <div className="text-[10px] text-gray-500">Services</div>
            </div>
            <div className="py-1.5 text-center bg-gray-50 rounded-lg border border-gray-100">
              <div className="text-sm font-bold text-gray-900">{totalProducts}</div>
              <div className="text-[10px] text-gray-500">Products</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <LoadingScreen logoSrc="/images/logo.png" loadingText="Loading Companies..." />;
  }

  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Directory</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">Companies <span className="text-yellow-400">Directory</span></h1>
            <p className="text-sm text-white/60 max-w-lg">Explore top companies leading drone, AI, and geospatial tech.</p>
          </div>
          <div className="flex flex-col items-end gap-4 flex-shrink-0">
            <div className="flex gap-8">
              <div>
                <span className="text-4xl font-extrabold text-yellow-400 block leading-none">{allCompanies.length || '0'}</span>
                <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Companies</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/form', { state: { templateId: 1 } })}
              className="px-5 py-2.5 text-sm font-semibold text-black bg-yellow-400 rounded-lg hover:bg-yellow-300 transition"
            >
              List your Company
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <div className="flex flex-col gap-2 justify-between items-center md:flex-row">
            <div className="relative flex-1 max-w-xs">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="py-2.5 pr-3 pl-9 w-full text-sm text-gray-900 bg-white rounded-xl border border-gray-200 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 placeholder-gray-400"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <div className="relative">
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="px-3 py-2.5 w-full sm:w-48 text-sm text-gray-700 bg-white rounded-xl border border-gray-200 appearance-none focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                >
                  {['All'].concat(Array.from(new Set(allCompanies.flatMap(c => c.sectors ?? [])))).map(industry => (
                    <option key={industry} value={industry}>{industry === 'All' ? 'All Industries' : industry}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 w-4 h-4 transform -translate-y-1/2 pointer-events-none text-gray-400" />
              </div>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="px-3 py-2.5 w-full sm:w-48 text-sm text-gray-700 bg-white rounded-xl border border-gray-200 appearance-none focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                >
                  <option value="companyName">Sort by Name</option>
                  <option value="createdAt">Sort by Date (Newest)</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 w-4 h-4 transform -translate-y-1/2 pointer-events-none text-gray-400" />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {selectedIndustry !== 'All' && (
              <span className="flex gap-1 items-center px-3 py-1 text-xs font-medium text-yellow-400 bg-black rounded-full">
                Industry: {selectedIndustry}
                <button onClick={() => setSelectedIndustry('All')} className="text-sm hover:text-white">×</button>
              </span>
            )}
            {searchQuery && (
              <span className="flex gap-1 items-center px-3 py-1 text-xs font-medium text-yellow-400 bg-black rounded-full">
                Search: "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="text-sm hover:text-white">×</button>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Companies Grid */}
      <div className="max-w-6xl mx-auto px-6 py-8 pb-12">
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-gray-500">{filteredCompanies.length} compan{filteredCompanies.length !== 1 ? 'ies' : 'y'}</p>
          {totalPages > 1 && <p className="text-sm text-gray-400">Page {currentPage} of {totalPages}</p>}
        </div>

        {currentCompanies.length === 0 ? (
          <div className="py-16 text-center">
            <div className="p-10 mx-auto max-w-md rounded-xl border border-gray-200 bg-white">
              <Search className="mx-auto mb-4 w-12 h-12 text-gray-300" />
              <h3 className="mb-2 text-lg font-bold text-gray-900">No companies found</h3>
              <p className="text-sm text-gray-400">Try adjusting your filters or search terms</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {currentCompanies.map((company, idx) => (
              <CompanyCard key={`all-${company.companyName}-${idx}`} company={company} index={idx} />
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
                      className={`px-4 py-2 rounded-xl font-medium transition-all text-sm ${page === currentPage ? 'bg-black text-yellow-400 border border-black' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
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

export default CompaniesPage;
