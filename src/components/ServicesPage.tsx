import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
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
}

const ServicesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popularity');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const servicesPerPage = 12;
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState(['All', 'Drone Technology', 'AI Solutions', 'GIS Services', 'Consulting', 'Training', 'Maintenance']);
  const sortOptions = [
    { value: 'popularity', label: 'Sort by Popularity' },
    { value: 'rating', label: 'Sort by Rating' },
    { value: 'price', label: 'Sort by Price' },
    { value: 'company', label: 'Sort by Company' }
  ];

  // Static fallback services removed - only use API data

  // Fetch services data from API
  useEffect(() => {
    const fetchServices = () => {
      setLoading(true);
      setError(null);

      // Don't set static services initially - wait for API data
      // setAllServices(staticServices);

      const API_URL = "https://f8wb4qay22.execute-api.ap-south-1.amazonaws.com/frontend-services-or-product/services/view";

      axios
        .get(API_URL)
        .then((response) => {
          const responseData = response.data;

          if (responseData.status && responseData.data && Array.isArray(responseData.data)) {
            const apiServices: Service[] = [];
            const allCategories = new Set(['All']);

            responseData.data.forEach((item: any) => {
              if (item.services && item.services.services && Array.isArray(item.services.services)) {
                // Add categories from this item
                if (item.services.categories && Array.isArray(item.services.categories)) {
                  item.services.categories.forEach((cat: string) => {
                    if (cat !== 'All') allCategories.add(cat);
                  });
                }

                // Map only the first service from each publishedId (one service per company)
                if (item.services.services.length > 0) {
                  const service = item.services.services[0]; // Take only first service
                  const mappedService: Service = {
                    id: item.publishedId, // Use publishedId as the main ID
                    title: service.title || "Service",
                    company: item.userId ? item.userId.split('@')[0] : "Company",
                    description: service.description || service.detailedDescription || "",
                    image: service.image || "/images/service1.jpg",
                    category: service.category || "General",
                    price: service.pricing || "Contact for pricing",
                    rating: 4.5, // Default rating
                    popularity: Math.floor(Math.random() * 20) + 80, // Random popularity between 80-100
                    location: "India", // Default location
                    features: service.features || [],
                    featured: Math.random() > 0.7, // Random featured status
                    benefits: service.benefits || [],
                    process: service.process || [],
                    timeline: service.timeline || "N/A",
                    detailedDescription: service.detailedDescription || service.description || ""
                  };
                  apiServices.push(mappedService);
                }
              }
            });

            if (apiServices.length > 0) {
              console.log("API Services mapped successfully:", apiServices.length, "services");
              console.log("Sample service:", apiServices[0]);
              setAllServices(apiServices);
              setCategories(Array.from(allCategories));
            } else {
              console.warn("API returned but no services parsed.");
              setAllServices([]);
            }
          } else {
            console.warn("API returned no data.");
            setAllServices([]);
          }
        })
        .catch((error) => {
          console.error("API Error:", error);
          setError("Failed to fetch services data");
          setAllServices([]);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    fetchServices();
  }, []);

  useEffect(() => {
    console.log("Filtering services - allServices count:", allServices.length);
    console.log("Selected category:", selectedCategory);
    console.log("Search query:", searchQuery);

    let filtered = allServices;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(service => service.category === selectedCategory);
      console.log("After category filter:", filtered.length);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.features.some((feature: string) =>
          feature.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      console.log("After search filter:", filtered.length);
    }

    // Sort services
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popularity':
          return b.popularity - a.popularity;
        case 'rating':
          return b.rating - a.rating;
        case 'price':
          return parseFloat(a.price.replace(/[^0-9.]/g, '')) - parseFloat(b.price.replace(/[^0-9.]/g, ''));
        case 'company':
          return a.company.localeCompare(b.company);
        default:
          return 0;
      }
    });

    console.log("Final filtered services count:", filtered.length);
    setFilteredServices(filtered);
    setCurrentPage(1);
  }, [allServices, selectedCategory, sortBy, searchQuery]);

  const featuredServices = allServices.filter(service => service.featured);
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
      default: return Building2;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Drone Technology': return 'bg-black';
      case 'AI Solutions': return 'bg-gray-900';
      case 'GIS Services': return 'bg-gray-800';
      case 'Consulting': return 'bg-gray-700';
      case 'Training': return 'bg-gray-600';
      case 'Maintenance': return 'bg-black';
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

  if (error) {
    return (
      <div className="flex justify-center items-center pt-16 min-h-screen bg-yellow-400">
        <div className="text-center">
          <p className="mb-4 text-xl font-semibold text-red-600">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 text-yellow-400 bg-black rounded-lg transition-colors hover:bg-gray-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-yellow-400">
      {/* Hero Section */}
      <section className="overflow-hidden relative py-3 bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-500">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full blur-2xl animate-pulse bg-yellow-200/30"></div>
          <div className="absolute right-10 bottom-10 w-40 h-40 rounded-full blur-2xl animate-pulse bg-yellow-600/20" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 px-4 mx-auto max-w-7xl text-center sm:px-6 lg:px-8">
          <h1 className="mb-2 text-2xl font-black tracking-tight text-black md:text-5xl">
            Services Directory

          </h1>
          <p className="mx-auto mb-4 max-w-2xl text-xl text-black/80">
            Explore top services in Drone Tech, AI, and GIS.
          </p>
          <div className="mx-auto w-24 h-1 bg-black rounded-full"></div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="sticky top-16 z-40 py-3 bg-yellow-400 border-b border-black/10">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2 justify-between items-center lg:flex-row">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 w-4 h-4 transform -translate-y-1/2 text-black/60" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="py-2 pr-3 pl-10 w-full text-sm font-medium text-black bg-yellow-200 rounded-lg border-2 backdrop-blur-sm transition-all duration-300 border-black/20 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/40 placeholder-black/60"
              />
            </div>

            {/* Filter and Sort Controls */}
            <div className="flex gap-3">
              {/* Category Filter */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 w-44 text-sm font-medium text-black bg-yellow-200 rounded-lg border-2 backdrop-blur-sm transition-all duration-300 appearance-none border-black/20 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/40"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'All' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 w-4 h-4 transform -translate-y-1/2 pointer-events-none text-black/60" />
              </div>

              {/* Sort Options */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 w-44 text-sm font-medium text-black bg-yellow-200 rounded-lg border-2 backdrop-blur-sm transition-all duration-300 appearance-none border-black/20 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/40"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 w-4 h-4 transform -translate-y-1/2 pointer-events-none text-black/60" />
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedCategory !== 'All' && (
              <span className="flex gap-1 items-center px-3 py-1 text-xs font-medium text-yellow-400 bg-black rounded-full">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory('All')} className="text-sm transition-colors duration-200 hover:text-white">×</button>
              </span>
            )}
            {searchQuery && (
              <span className="flex gap-1 items-center px-3 py-1 text-xs font-medium text-yellow-400 bg-black rounded-full">
                Search: "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="text-sm transition-colors duration-200 hover:text-white">×</button>
              </span>
            )}
          </div>
        </div>
      </section>


      {/* Featured Services Section */}
      <section className="py-4 bg-gradient-to-b from-yellow-400 to-yellow-300">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {featuredServices.map((service, index) => {
              const IconComponent = getCategoryIcon(service.category);

              return (
                <div
                  key={service.id}
                  className="group bg-[#f1ee8e] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 cursor-pointer transform hover:scale-105 hover:-rotate-1 border-2 border-black/20 hover:border-black/40"
                  style={{
                    animationDelay: `${index * 200}ms`,
                    animation: `fadeInUp 0.8s ease-out ${index * 200}ms both`
                  }}
                >
                  <div className="p-4">
                    <div className="overflow-hidden relative rounded-2xl">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="object-cover w-full h-48 transition-all duration-700 group-hover:scale-110"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-0 transition-all duration-500 from-black/60 group-hover:opacity-100"></div>

                      <div className="flex absolute inset-0 justify-center items-center opacity-0 transition-all duration-500 group-hover:opacity-100">
                        <Link
                          to={`/service/${service.id}`}
                          className="px-4 py-2 font-bold text-black bg-yellow-400 rounded-full shadow-2xl transition-all duration-500 transform scale-0 group-hover:scale-100 hover:bg-yellow-300"
                        >
                          View Details
                        </Link>
                      </div>

                      <div className={`absolute top-4 right-4 ${getCategoryColor(service.category)} text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1`}>
                        <IconComponent className="w-3 h-3" />
                        {service.category}
                      </div>

                      <div className="absolute right-4 bottom-4 px-2 py-1 text-xs font-medium text-white rounded-lg bg-black/80">
                        {service.price}
                      </div>

                      <div className="flex absolute top-4 left-4 gap-1 items-center px-2 py-1 text-xs font-bold text-black bg-yellow-400 rounded-lg">
                        <Star className="w-3 h-3 fill-current" />
                        Featured
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="mb-2 text-xl font-bold text-black transition-colors duration-300 group-hover:text-gray-800">
                      {service.title}
                    </h3>
                    <p className="mb-2 text-sm font-semibold text-gray-600">{service.company}</p>
                    <p className="mb-4 text-gray-600 line-clamp-2">{service.description}</p>

                    <div className="flex justify-between items-center mb-4">
                      <div className="flex gap-4 items-center text-sm text-gray-500">
                        <div className="flex gap-1 items-center">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          {service.rating}
                        </div>
                        <div className="flex gap-1 items-center">
                          <MapPin className="w-4 h-4" />
                          {service.location}
                        </div>
                      </div>
                      <div className="text-lg font-bold text-black">{service.price}</div>
                    </div>

                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {service.features.slice(0, 3).map((feature: string) => (
                          <span
                            key={feature}
                            className="px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-300 rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                        {service.features.length > 3 && (
                          <span className="px-2 py-1 text-xs font-medium text-gray-600 bg-yellow-300 rounded-full">
                            +{service.features.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="py-16 bg-yellow-400">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-black text-black md:text-4xl">
              All Services ({filteredServices.length})
            </h2>
            <div className="text-black/60">
              Page {currentPage} of {totalPages}
            </div>
          </div>

          {currentServices.length === 0 ? (
            <div className="py-16 text-center">
              <div className="p-12 mx-auto max-w-md rounded-3xl backdrop-blur-sm bg-white/80">
                <Search className="mx-auto mb-4 w-16 h-16 text-black/40" />
                <h3 className="mb-2 text-2xl font-bold text-black">No services found</h3>
                <p className="text-black/60">Try adjusting your filters or search terms</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {currentServices.map((service, index) => {
                const IconComponent = getCategoryIcon(service.category);

                return (
                  <div
                    key={service.id}
                    className="group bg-[#f1ee8e] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 cursor-pointer transform hover:scale-105 border-2 border-black/20 hover:border-black/40"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: `fadeInUp 0.8s ease-out ${index * 100}ms both`
                    }}
                  >
                    <div className="p-3">
                      <div className="overflow-hidden relative rounded-2xl">
                        <img
                          src={service.image}
                          alt={service.title}
                          className="object-cover w-full h-40 transition-all duration-700 group-hover:scale-110"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-0 transition-all duration-500 from-black/60 group-hover:opacity-100"></div>

                        <div className="flex absolute inset-0 justify-center items-center opacity-0 transition-all duration-500 group-hover:opacity-100">
                          <Link
                            to={`/service/${service.id}`}
                            className="px-4 py-2 font-bold text-black bg-yellow-400 rounded-full shadow-2xl transition-all duration-500 transform scale-0 group-hover:scale-100 hover:bg-yellow-300"
                          >
                            View Details
                          </Link>
                        </div>

                        <div className={`absolute top-3 right-3 ${getCategoryColor(service.category)} text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1`}>
                          <IconComponent className="w-3 h-3" />
                          {service.category}
                        </div>

                        <div className="absolute right-3 bottom-3 px-2 py-1 text-xs font-medium text-white rounded-lg bg-black/80">
                          {service.price}
                        </div>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="mb-1 text-lg font-bold text-black transition-colors duration-300 group-hover:text-gray-800 line-clamp-2">
                        {service.title}
                      </h3>
                      <p className="mb-2 text-sm font-semibold text-gray-600">{service.company}</p>
                      <p className="mb-3 text-sm text-gray-600 line-clamp-2">{service.description}</p>

                      <div className="flex justify-between items-center mb-3 text-xs">
                        <div className="flex gap-3 items-center text-gray-500">
                          <div className="flex gap-1 items-center">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            {service.rating}
                          </div>
                          <div className="flex gap-1 items-center">
                            <MapPin className="w-3 h-3" />
                            {service.location.split(',')[0]}
                          </div>
                        </div>
                        <div className="text-sm font-bold text-black">{service.price}</div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {service.features.slice(0, 2).map((feature: string) => (
                          <span
                            key={feature}
                            className="px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-300 rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                        {service.features.length > 2 && (
                          <span className="px-2 py-1 text-xs font-medium text-gray-600 bg-yellow-300 rounded-full">
                            +{service.features.length - 2}
                          </span>
                        )}
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
              <div className="flex gap-2 items-center">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 font-medium text-black rounded-xl border-2 backdrop-blur-sm transition-all duration-300 bg-white/80 border-black/20 hover:bg-white hover:border-black/40 disabled:opacity-50 disabled:cursor-not-allowed"
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

export default ServicesPage;