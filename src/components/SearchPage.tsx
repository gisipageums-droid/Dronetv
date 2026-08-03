import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, Play, Eye, Clock, Building2, Calendar, MapPin, Users, Package, Star, BookOpen } from 'lucide-react';
import CompactHero from './common/CompactHero';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('drone AI');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [filteredResults, setFilteredResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 12;

  const filterOptions = ['All', 'Videos', 'Companies', 'Products', 'Events', 'News'];

  // Mock search results data
  const allResults = [
    // Videos
    {
      id: 1,
      type: 'video',
      title: "Advanced Drone AI Navigation Systems",
      description: "Explore cutting-edge AI algorithms that power autonomous drone flight systems and intelligent navigation.",
      thumbnail: "https://images.pexels.com/photos/442587/pexels-photo-442587.jpeg?auto=compress&cs=tinysrgb&w=600",
      views: "12.5K",
      duration: "8:42",
      category: "AI"
    },
    {
      id: 2,
      type: 'video',
      title: "Machine Learning in Drone Technology",
      description: "How machine learning algorithms are revolutionizing drone capabilities and autonomous decision-making.",
      thumbnail: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600",
      views: "11.3K",
      duration: "14:07",
      category: "AI"
    },
    // Companies
    {
      id: 3,
      type: 'company',
      name: "DroneAI Systems",
      description: "Advanced AI algorithms for autonomous flight systems and intelligent decision-making platforms in aviation technology.",
      logo: Building2,
      industry: "AI Systems",
      rating: 4.9,
      employees: "180+"
    },
    {
      id: 4,
      type: 'company',
      name: "AeroTech Solutions",
      description: "Leading drone manufacturing and AI integration specialists revolutionizing autonomous flight systems.",
      logo: Building2,
      industry: "Manufacturing",
      rating: 4.8,
      employees: "500+"
    },
    // Products
    {
      id: 5,
      type: 'product',
      name: "AI Flight Controller",
      description: "Advanced flight controller with built-in AI for autonomous navigation and obstacle avoidance.",
      image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600",
      price: "$599",
      rating: 4.7,
      category: "Accessories"
    },
    {
      id: 6,
      type: 'product',
      name: "DJI Mavic Air 2S",
      description: "Professional-grade drone with 1-inch CMOS sensor and 5.4K video recording capabilities.",
      image: "https://images.pexels.com/photos/442587/pexels-photo-442587.jpeg?auto=compress&cs=tinysrgb&w=600",
      price: "$999",
      rating: 4.8,
      category: "Drones"
    },
    // Events
    {
      id: 7,
      type: 'event',
      title: "AI in Aviation Summit",
      description: "Exploring the future of artificial intelligence in aviation and autonomous flight systems.",
      date: "April 22-23, 2024",
      location: "Austin, TX",
      attendees: "1,200+",
      image: "https://images.pexels.com/photos/1181354/pexels-photo-1181354.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      id: 8,
      type: 'event',
      title: "Autonomous Flight Systems Conference",
      description: "Technical conference focusing on autonomous flight systems and AI integration.",
      date: "August 20-22, 2024",
      location: "Seattle, WA",
      attendees: "1,800+",
      image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    // News
    {
      id: 9,
      type: 'news',
      title: "Revolutionary AI Navigation System Transforms Drone Industry",
      description: "Latest breakthrough in artificial intelligence brings unprecedented autonomous flight capabilities to commercial drones.",
      image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600",
      author: "Dr. Sarah Chen",
      date: "2024-01-15",
      readTime: "5 min read"
    },
    {
      id: 10,
      type: 'news',
      title: "Machine Learning Algorithms Enhance Drone Swarm Coordination",
      description: "Advanced machine learning techniques enable unprecedented coordination between multiple drones.",
      image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600",
      author: "Dr. James Liu",
      date: "2023-12-28",
      readTime: "11 min read"
    }
  ];

  useEffect(() => {
    let filtered = allResults;

    // Filter by content type
    if (selectedFilter !== 'All') {
      const filterType = selectedFilter.toLowerCase().slice(0, -1); // Remove 's' from plural
      filtered = filtered.filter(result => result.type === filterType);
    }

    setFilteredResults(filtered);
    setCurrentPage(1);
  }, [selectedFilter]);

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = filteredResults.slice(indexOfFirstResult, indexOfLastResult);
  const totalPages = Math.ceil(filteredResults.length / resultsPerPage);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'video': return Play;
      case 'company': return Building2;
      case 'product': return Package;
      case 'event': return Calendar;
      case 'news': return BookOpen;
      default: return Search;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'video': return 'bg-status-error';
      case 'company': return 'bg-ink';
      case 'product': return 'bg-ink-charcoal';
      case 'event': return 'bg-ink';
      case 'news': return 'bg-ink-paragraph';
      default: return 'bg-ink-paragraph';
    }
  };

  const renderResultCard = (result, index) => {
    const IconComponent = getTypeIcon(result.type);
    
    switch (result.type) {
      case 'video':
        return (
          <div
            key={result.id}
            className="group bg-surface-card rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 cursor-pointer transform hover:scale-105"
            style={{ 
              animationDelay: `${index * 100}ms`,
              animation: `fadeInUp 0.8s ease-out ${index * 100}ms both`
            }}
          >
            <div className="relative overflow-hidden">
              <img
                src={result.thumbnail}
                alt={result.title}
                className="w-full h-48 object-cover transition-all duration-700 group-hover:scale-110"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                <div className="bg-status-error rounded-full p-3 transform scale-0 group-hover:scale-100 transition-all duration-500 hover:bg-status-error shadow-2xl">
                  <Play className="h-6 w-6 text-white" />
                </div>
              </div>
              
              <div className={`absolute top-3 right-3 ${getTypeColor(result.type)} text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1`}>
                <IconComponent className="h-3 w-3" />
                Video
              </div>

              <div className="absolute bottom-3 right-3 bg-ink/80 text-white px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {result.duration}
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-lg font-bold text-ink mb-2 group-hover:text-status-error transition-colors duration-300 line-clamp-2">
                {result.title}
              </h3>
              <p className="text-ink-paragraph mb-3 line-clamp-2 text-sm">{result.description}</p>
              
              <div className="flex items-center gap-3 text-xs text-ink-caption">
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {result.views}
                </div>
                <div className="bg-ink-light text-ink-paragraph px-2 py-1 rounded-full text-xs font-medium">
                  {result.category}
                </div>
              </div>
            </div>
          </div>
        );

      case 'company':
        const LogoComponent = result.logo;
        return (
          <div
            key={result.id}
            className="group bg-surface-card rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 cursor-pointer transform hover:scale-105"
            style={{ 
              animationDelay: `${index * 100}ms`,
              animation: `fadeInUp 0.8s ease-out ${index * 100}ms both`
            }}
          >
            <div className="p-8 bg-ink-offwhite transition-all duration-300">
              <div className="flex justify-center mb-4">
                <div className="bg-ink-light rounded-full p-6">
                  <LogoComponent className="h-12 w-12 text-ink-paragraph" />
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="text-xl font-bold text-ink mb-2 group-hover:text-ink-charcoal transition-colors duration-300">
                  {result.name}
                </h3>
                <div className={`${getTypeColor(result.type)} text-brand-yellow px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1`}>
                  <IconComponent className="h-3 w-3" />
                  Company
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-ink-paragraph mb-4 leading-relaxed text-sm line-clamp-3">
                {result.description}
              </p>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center p-2 bg-ink-offwhite rounded-lg border border-ink-light">
                  <div className="text-sm font-bold text-ink">{result.employees}</div>
                  <div className="text-xs text-ink-caption">Employees</div>
                </div>
                <div className="text-center p-2 bg-ink-offwhite rounded-lg border border-ink-light">
                  <div className="text-sm font-bold text-ink flex items-center justify-center gap-1">
                    <Star className="h-3 w-3 fill-current text-brand-yellow" />
                    {result.rating}
                  </div>
                  <div className="text-xs text-ink-caption">Rating</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'product':
        return (
          <div
            key={result.id}
            className="group bg-surface-card rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 cursor-pointer transform hover:scale-105"
            style={{ 
              animationDelay: `${index * 100}ms`,
              animation: `fadeInUp 0.8s ease-out ${index * 100}ms both`
            }}
          >
            <div className="relative overflow-hidden">
              <img
                src={result.image}
                alt={result.name}
                className="w-full h-48 object-cover transition-all duration-700 group-hover:scale-110"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                <div className="bg-brand-yellow text-ink px-4 py-2 rounded-full font-bold shadow-2xl transform scale-0 group-hover:scale-100 transition-all duration-500 hover:bg-brand-yellow-soft">
                  View Details
                </div>
              </div>
              
              <div className={`absolute top-3 right-3 ${getTypeColor(result.type)} text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1`}>
                <IconComponent className="h-3 w-3" />
                Product
              </div>

              <div className="absolute bottom-3 right-3 bg-ink/80 text-white px-2 py-1 rounded-lg text-xs font-medium">
                {result.price}
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-lg font-bold text-ink mb-2 group-hover:text-ink-charcoal transition-colors duration-300 line-clamp-2">
                {result.name}
              </h3>
              <p className="text-ink-paragraph mb-3 line-clamp-2 text-sm">{result.description}</p>
              
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-ink-caption">
                  <Star className="h-3 w-3 fill-current text-brand-gold" />
                  {result.rating}
                </div>
                <div className="bg-ink-light text-ink-paragraph px-2 py-1 rounded-full text-xs font-medium">
                  {result.category}
                </div>
              </div>
            </div>
          </div>
        );

      case 'event':
        return (
          <div
            key={result.id}
            className="group bg-surface-card rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 cursor-pointer transform hover:scale-105"
            style={{ 
              animationDelay: `${index * 100}ms`,
              animation: `fadeInUp 0.8s ease-out ${index * 100}ms both`
            }}
          >
            <div className="relative overflow-hidden">
              <img
                src={result.image}
                alt={result.title}
                className="w-full h-48 object-cover transition-all duration-700 group-hover:scale-110"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                <div className="bg-brand-yellow text-ink px-4 py-2 rounded-full font-bold shadow-2xl transform scale-0 group-hover:scale-100 transition-all duration-500 hover:bg-brand-yellow-soft">
                  View Event
                </div>
              </div>
              
              <div className={`absolute top-3 right-3 ${getTypeColor(result.type)} text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1`}>
                <IconComponent className="h-3 w-3" />
                Event
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-lg font-bold text-ink mb-2 group-hover:text-ink-charcoal transition-colors duration-300 line-clamp-2">
                {result.title}
              </h3>
              <p className="text-ink-paragraph mb-3 line-clamp-2 text-sm">{result.description}</p>
              
              <div className="space-y-1 text-xs">
                <div className="flex items-center text-ink-paragraph">
                  <Calendar className="h-3 w-3 mr-1 text-brand-gold" />
                  {result.date}
                </div>
                <div className="flex items-center text-ink-paragraph">
                  <MapPin className="h-3 w-3 mr-1 text-brand-gold" />
                  {result.location}
                </div>
                <div className="flex items-center text-ink-paragraph">
                  <Users className="h-3 w-3 mr-1 text-brand-gold" />
                  {result.attendees}
                </div>
              </div>
            </div>
          </div>
        );

      case 'news':
        return (
          <div
            key={result.id}
            className="group bg-surface-card rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 cursor-pointer transform hover:scale-105"
            style={{ 
              animationDelay: `${index * 100}ms`,
              animation: `fadeInUp 0.8s ease-out ${index * 100}ms both`
            }}
          >
            <div className="relative overflow-hidden">
              <img
                src={result.image}
                alt={result.title}
                className="w-full h-48 object-cover transition-all duration-700 group-hover:scale-110"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                <div className="bg-brand-yellow text-ink px-4 py-2 rounded-full font-bold shadow-2xl transform scale-0 group-hover:scale-100 transition-all duration-500 hover:bg-brand-yellow-soft">
                  Read Article
                </div>
              </div>
              
              <div className={`absolute top-3 right-3 ${getTypeColor(result.type)} text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1`}>
                <IconComponent className="h-3 w-3" />
                News
              </div>

              <div className="absolute bottom-3 right-3 bg-ink/80 text-white px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {result.readTime}
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-lg font-bold text-ink mb-2 group-hover:text-ink-charcoal transition-colors duration-300 line-clamp-2">
                {result.title}
              </h3>
              <p className="text-ink-paragraph mb-3 line-clamp-2 text-sm">{result.description}</p>
              
              <div className="flex items-center justify-between text-xs text-ink-caption">
                <div>By {result.author}</div>
                <div>{new Date(result.date).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="pt-[104px] min-h-screen bg-ink-offwhite">
      {/* Hero / Search */}
      <CompactHero title={<>Search <span>Results</span></>} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5">
        <p className="text-sm text-ink-caption mb-3">Showing results for "<span className="text-ink font-semibold">{searchTerm}</span>"</p>

        <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <Search className="h-4 w-4 text-ink-caption" />
            </div>
            <input
              type="text"
              placeholder="Search for videos, companies, products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-ink-light bg-surface-card focus:outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow text-ink placeholder-ink-caption text-sm"
            />
          </div>
          <div className="relative">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="appearance-none bg-surface-card border border-ink-light rounded-xl px-4 py-2.5 pr-9 text-ink-paragraph text-sm focus:outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow"
            >
              {filterOptions.map(option => (
                <option key={option} value={option}>
                  {option === 'All' ? 'All Content' : option}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-ink-caption pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-12">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-ink-caption">{filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''} found</p>
          {totalPages > 1 && <p className="text-sm text-ink-caption">Page {currentPage} of {totalPages}</p>}
        </div>

        {currentResults.length === 0 ? (
          <div className="py-16 text-center">
            <div className="p-10 mx-auto max-w-md rounded-xl border border-ink-light bg-surface-card">
              <Search className="mx-auto mb-4 w-12 h-12 text-ink-light" />
              <h3 className="mb-2 text-lg font-bold text-ink">No results found</h3>
              <p className="text-sm text-ink-caption">Try adjusting your search terms or filters</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {currentResults.map((result, index) => renderResultCard(result, index))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center mt-10">
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 font-medium text-ink-paragraph rounded-xl border border-ink-light hover:bg-ink-offwhite disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
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
                      className={`px-4 py-2 rounded-xl font-medium transition-all text-sm ${page === currentPage ? 'bg-ink text-brand-yellow border border-ink' : 'border border-ink-light text-ink-paragraph hover:bg-ink-offwhite'}`}
                    >
                      {page}
                    </button>
                  );
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return <span key={page} className="px-2 text-ink-caption">...</span>;
                }
                return null;
              })}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 font-medium text-ink-paragraph rounded-xl border border-ink-light hover:bg-ink-offwhite disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
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

export default SearchPage;