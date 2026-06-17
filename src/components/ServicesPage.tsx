

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const decodeHTML = (str: string): string => {
  if (!str) return '';
  const txt = document.createElement('textarea');
  txt.innerHTML = str;
  return txt.value;
};

const isCleanTitle = (title: string): boolean => {
  if (!title?.trim()) return false;
  return !/^\s*'\s*\+|\+\s*'\s*$|\$el\.|outerHTML|\.prop\s*\(|\beval\b|<script/i.test(title);
};
import { Search, ChevronDown, Zap as Drone, Brain, Map, Star, Users, MapPin, Building2 } from 'lucide-react';
import LoadingScreen from './loadingscreen';

interface Service {
  id: string;
  title: string;
  company: string;
  description: string;
  image: string;
  category: string;
  price: string;
  rating: number;
  popularity: number;
  location: string;
  features: string[];
  featured: boolean;
  benefits?: string[];
  process?: string[];
  timeline?: string;
  detailedDescription?: string;
  userId?: string;
  publishedId?: string;
  timestamp?: string;
}

const ServicesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('timestamp'); // Changed default to timestamp for newest first
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const servicesPerPage = 12;
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState(['All']);

  const sortOptions = [
    { value: 'timestamp', label: 'Sort by Newest' }, // New option
    { value: 'popularity', label: 'Sort by Popularity' },
    { value: 'rating', label: 'Sort by Rating' },
    { value: 'company', label: 'Sort by Company' }
  ];

  // Fetch services data from API
  useEffect(() => {
    const fetchServices = () => {
      setLoading(true);
      setError(null);

      const API_URL = "https://f8wb4qay22.execute-api.ap-south-1.amazonaws.com/frontend-services-or-product/services/view";

      axios
        .get(API_URL)
        .then((response) => {
          const responseData = response.data;

          if (responseData.status && responseData.data && Array.isArray(responseData.data)) {
            const apiServices: Service[] = [];
            const allCategories = new Set(['All']);
            const seenCompanyIds = new Set<string>();

            responseData.data.forEach((item: any) => {
              const cid = (item.publishedId || '').trim();
              if (cid && seenCompanyIds.has(cid)) return;
              if (cid) seenCompanyIds.add(cid);
              // Check if services array exists and has at least one service
              if (item.services &&
                item.services.services &&
                Array.isArray(item.services.services) &&
                item.services.services.length > 0) {

                // Add categories from this item
                if (item.services.categories && Array.isArray(item.services.categories)) {
                  item.services.categories.forEach((cat: string) => {
                    if (cat && cat !== 'All') allCategories.add(cat);
                  });
                }

                // Process each service in the services array
                item.services.services.forEach((service: any, index: number) => {
                  // Only process services that have a clean, non-code title
                  if (service && service.title && isCleanTitle(service.title)) {
                    const mappedService: Service = {
                      id: `${item.publishedId}-${index}`, // Unique ID for each service
                      publishedId: item.publishedId,
                      userId: item.userId,
                      title: decodeHTML(service.title),
                      company: item.companyName || (item.userId ? item.userId.split('@')[0] : "Unknown Company"),
                      description: decodeHTML(service.description || service.detailedDescription || "No description available"),
                      image: service.image || "/images/service-placeholder.jpg",
                      category: service.category || "General",
                      price: service.pricing || "Contact for pricing",
                      rating: 4.0 + (Math.random() * 1.5), // Random rating between 4.0-5.5
                      popularity: Math.floor(Math.random() * 20) + 80, // Random popularity between 80-100
                      location: "India",
                      features: service.features || [],
                      featured: Math.random() > 0.8,
                      benefits: service.benefits || [],
                      process: service.process || [],
                      timeline: service.timeline || "N/A",
                      detailedDescription: service.detailedDescription || service.description || "",
                      timestamp: item.timestamp || new Date().toISOString()
                    };
                    apiServices.push(mappedService);

                    // Add service category to categories set
                    if (service.category && service.category !== 'All') {
                      allCategories.add(service.category);
                    }
                  }
                });
              }
            });

            if (apiServices.length > 0) {
              // Sort by timestamp (newest first) initially
              const sortedServices = apiServices.sort((a, b) => {
                const timeA = new Date(a.timestamp || 0).getTime();
                const timeB = new Date(b.timestamp || 0).getTime();
                return timeB - timeA; // Descending order
              });

              setAllServices(sortedServices);
              setCategories(Array.from(allCategories));
            } else {
              setAllServices([]);
            }
          } else {
            setAllServices([]);
          }
        })
        .catch(() => {
          setAllServices([]);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    fetchServices();
  }, []);

  useEffect(() => {
    let filtered = allServices;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(service =>
        service.category === selectedCategory
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (service.features && service.features.some((feature: string) =>
          feature.toLowerCase().includes(searchQuery.toLowerCase())
        ))
      );
    }

    // Sort services
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'timestamp':
          const timeA = new Date(a.timestamp || 0).getTime();
          const timeB = new Date(b.timestamp || 0).getTime();
          return timeB - timeA; // Newest first
        case 'popularity':
          return b.popularity - a.popularity;
        case 'rating':
          return b.rating - a.rating;
        case 'company':
          return a.company.localeCompare(b.company);
        default:
          return 0;
      }
    });

    setFilteredServices(filtered);
    setCurrentPage(1);
  }, [allServices, selectedCategory, sortBy, searchQuery]);

  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = filteredServices.slice(indexOfFirstService, indexOfLastService);
  const totalPages = Math.ceil(filteredServices.length / servicesPerPage);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Drone Technology': return Drone;
      case 'AI Solutions': return Brain;
      case 'GIS Services': return Map;
      case 'Consulting': return Users;
      case 'Training': return Building2;
      case 'Maintenance': return Building2;
      case 'Drone Training & Education Services': return Building2;
      case 'UAV Manufacturing': return Drone;
      case 'Drone training': return Building2;
      default: return Building2;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Drone Technology':
      case 'Drone Training & Education Services':
      case 'Drone training':
      case 'UAV Manufacturing':
        return 'bg-blue-600';
      case 'AI Solutions': return 'bg-purple-600';
      case 'GIS Services': return 'bg-green-600';
      case 'Consulting': return 'bg-indigo-600';
      case 'Training': return 'bg-orange-500';
      case 'Maintenance': return 'bg-red-600';
      default: return 'bg-gray-800';
    }
  };

  // Format date for display
  const formatDate = (timestamp: string) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <LoadingScreen
        logoSrc="/images/logo.png"
        loadingText="Loading Services..."
      />
    );
  }

  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Directory</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">Services <span className="text-yellow-400">Directory</span></h1>
            <p className="text-sm text-white/60 max-w-lg">Explore top services in Drone Tech, AI, and GIS.</p>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">{allServices.length}</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Services</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <div className="flex flex-col gap-2 justify-between items-center lg:flex-row">
            <div className="relative flex-1 max-w-xs">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search services..."
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
                  className="px-3 py-2.5 w-full sm:w-44 text-sm text-gray-700 bg-white rounded-xl border border-gray-200 appearance-none focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'All' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 w-4 h-4 transform -translate-y-1/2 pointer-events-none text-gray-400" />
              </div>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2.5 w-full sm:w-44 text-sm text-gray-700 bg-white rounded-xl border border-gray-200 appearance-none focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 w-4 h-4 transform -translate-y-1/2 pointer-events-none text-gray-400" />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {selectedCategory !== 'All' && (
              <span className="flex gap-1 items-center px-3 py-1 text-xs font-medium text-yellow-400 bg-black rounded-full">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory('All')} className="text-sm hover:text-white">×</button>
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

      {/* Services Grid */}
      <div className="max-w-6xl mx-auto px-6 py-8 pb-12">
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-gray-500">{filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''}</p>
          {totalPages > 1 && <p className="text-sm text-gray-400">Page {currentPage} of {totalPages}</p>}
        </div>

        {currentServices.length === 0 ? (
          <div className="py-16 text-center">
            <div className="p-10 mx-auto max-w-md rounded-xl border border-gray-200 bg-white">
              <Search className="mx-auto mb-4 w-12 h-12 text-gray-300" />
              <h3 className="mb-2 text-lg font-bold text-gray-900">No services found</h3>
              <p className="text-sm text-gray-400">Try adjusting your filters or search terms</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {currentServices.map((service, index) => {
              const IconComponent = getCategoryIcon(service.category);

              return (
                <Link
                  to={`/service/${service.publishedId}`}
                  state={{ service }}
                  key={service.id}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200 block"
                >
                    <div className="p-3">
                      <div className="overflow-hidden relative rounded-lg bg-gray-100 h-48 flex items-center justify-center">
                        <span className="text-gray-500 text-sm font-medium text-center px-4 leading-relaxed z-0 line-clamp-3">{service.title}</span>
                        <img
                          src={service.image}
                          alt={service.title}
                          className="absolute inset-0 object-cover w-full h-48 transition-all duration-700 group-hover:scale-110"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />

                        <div className="absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-0 transition-all duration-500 from-black/60 group-hover:opacity-100"></div>



                        <div className={`absolute top-3 right-3 ${getCategoryColor(service.category)} text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1`}>
                          <IconComponent className="w-3 h-3" />
                          {service.category}
                        </div>

                        <div className="absolute right-3 bottom-3 px-2 py-1 text-xs font-medium text-white rounded-lg bg-black/80">
                          {service.price}
                        </div>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="mb-2 text-xl font-bold text-black transition-colors duration-300 group-hover:text-yellow-600 line-clamp-2">
                        {service.title}
                      </h3>
                      <p className="mb-1 text-sm font-semibold text-gray-500 flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {service.company}
                      </p>

                      {service.timestamp && (
                        <p className="mb-3 text-xs text-gray-400">
                          Added: {formatDate(service.timestamp)}
                        </p>
                      )}

                      <p className="mb-4 text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {service.description}
                      </p>

                      <div className="flex justify-between items-center mb-4 pt-4 border-t border-gray-100">
                        <div className="flex gap-4 items-center text-xs text-gray-500">
                          <div className="flex gap-1 items-center bg-yellow-50 px-2 py-1 rounded-md">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span className="font-bold text-black">{service.rating.toFixed(1)}</span>
                          </div>
                          <div className="flex gap-1 items-center">
                            <MapPin className="w-3 h-3" />
                            {service.location.split(',')[0]}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {service.features && service.features.slice(0, 2).map((feature: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-black/70 bg-gray-100 rounded-md line-clamp-1"
                          >
                            {feature}
                          </span>
                        ))}
                        {service.features && service.features.length > 2 && (
                          <span className="px-2 py-1 text-[10px] font-bold text-black/50 bg-gray-100 rounded-md">
                            +{service.features.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center mt-10">
              <div className="flex gap-1 items-center">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
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
                        className={`px-4 py-2 rounded-xl text-sm font-medium ${page === currentPage
                          ? 'bg-black text-yellow-400 border border-black'
                          : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
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
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;