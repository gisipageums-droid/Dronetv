import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, Calendar, User, Clock, ArrowRight, BookOpen, TrendingUp, Eye } from 'lucide-react';

const NewsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 9;

  const categories = ['All', 'Drone Tech News', 'AI Insights', 'Industry Trends', 'Product Reviews', 'Company Updates'];

  const allArticles = [
    {
      id: 1,
      title: "Revolutionary AI Navigation System Transforms Drone Industry",
      excerpt: "Latest breakthrough in artificial intelligence brings unprecedented autonomous flight capabilities to commercial drones, revolutionizing industries from agriculture to logistics.",
      image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600",
      category: "AI Insights",
      author: "Dr. Sarah Chen",
      date: "2024-01-15",
      readTime: "5 min read",
      views: "2.3K",
      featured: true
    },
    {
      id: 2,
      title: "GIS Mapping Technology Reaches New Heights with Advanced Sensors",
      excerpt: "Precision mapping solutions now offer centimeter-level accuracy, opening new possibilities for urban planning, environmental monitoring, and infrastructure development.",
      image: "https://images.pexels.com/photos/1034662/pexels-photo-1034662.jpeg?auto=compress&cs=tinysrgb&w=600",
      category: "Drone Tech News",
      author: "Michael Rodriguez",
      date: "2024-01-12",
      readTime: "7 min read",
      views: "1.8K",
      featured: true
    },
    {
      id: 3,
      title: "Market Analysis: Commercial Drone Industry Growth Projections",
      excerpt: "Industry experts predict exponential growth in commercial drone applications, with market value expected to reach $58 billion by 2026 across various sectors.",
      image: "https://images.pexels.com/photos/442587/pexels-photo-442587.jpeg?auto=compress&cs=tinysrgb&w=600",
      category: "Industry Trends",
      author: "Jennifer Park",
      date: "2024-01-10",
      readTime: "6 min read",
      views: "3.1K",
      featured: true
    },
    {
      id: 4,
      title: "DJI Mavic Pro 4: Comprehensive Review and Performance Analysis",
      excerpt: "Our in-depth review covers the latest features, performance improvements, and real-world testing results of DJI's newest flagship drone model.",
      image: "https://images.pexels.com/photos/724712/pexels-photo-724712.jpeg?auto=compress&cs=tinysrgb&w=600",
      category: "Product Reviews",
      author: "Alex Thompson",
      date: "2024-01-08",
      readTime: "12 min read",
      views: "4.2K"
    },
    {
      id: 5,
      title: "Regulatory Updates: New FAA Guidelines for Commercial Operations",
      excerpt: "Recent regulatory changes impact commercial drone operations, including new certification requirements and operational restrictions for various industries.",
      image: "https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=600",
      category: "Industry Trends",
      author: "Robert Kim",
      date: "2024-01-05",
      readTime: "8 min read",
      views: "1.9K"
    },
    {
      id: 6,
      title: "Startup Spotlight: Emerging Companies Disrupting Drone Technology",
      excerpt: "Meet the innovative startups pushing boundaries in drone technology, from micro-drones to advanced AI systems and sustainable energy solutions.",
      image: "https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=600",
      category: "Company Updates",
      author: "Lisa Wang",
      date: "2024-01-03",
      readTime: "10 min read",
      views: "2.7K"
    },
    {
      id: 7,
      title: "Environmental Impact: How Drones Are Supporting Conservation Efforts",
      excerpt: "Exploring the positive environmental impact of drone technology in wildlife monitoring, forest conservation, and climate research initiatives worldwide.",
      image: "https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=600",
      category: "Drone Tech News",
      author: "Dr. Emma Foster",
      date: "2024-01-01",
      readTime: "9 min read",
      views: "1.5K"
    },
    {
      id: 8,
      title: "Machine Learning Algorithms Enhance Drone Swarm Coordination",
      excerpt: "Advanced machine learning techniques enable unprecedented coordination between multiple drones, opening new possibilities for large-scale operations.",
      image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600",
      category: "AI Insights",
      author: "Dr. James Liu",
      date: "2023-12-28",
      readTime: "11 min read",
      views: "2.1K"
    },
    {
      id: 9,
      title: "Future of Urban Air Mobility: Drone Taxis and Smart Cities",
      excerpt: "Examining the potential integration of passenger drones into urban transportation systems and the infrastructure requirements for smart city implementation.",
      image: "https://images.pexels.com/photos/1181354/pexels-photo-1181354.jpeg?auto=compress&cs=tinysrgb&w=600",
      category: "Industry Trends",
      author: "Maria Gonzalez",
      date: "2023-12-25",
      readTime: "13 min read",
      views: "3.8K"
    }
  ];

  useEffect(() => {
    let filtered = allArticles;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    setFilteredArticles(filtered);
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  const featuredArticles = allArticles.filter(article => article.featured);
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Drone Tech News': return 'bg-black';
      case 'AI Insights': return 'bg-gray-900';
      case 'Industry Trends': return 'bg-gray-800';
      case 'Product Reviews': return 'bg-gray-700';
      case 'Company Updates': return 'bg-gray-600';
      default: return 'bg-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-yellow-400 pt-16">
      {/* Hero Section */}
      <section className="py-3 bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-500 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-200/30 rounded-full animate-pulse blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-yellow-600/20 rounded-full animate-pulse blur-2xl" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-2xl md:text-5xl font-black text-black mb-2 tracking-tight">
            News & Blogs

          </h1>
          <p className="text-xl text-black/80 max-w-2xl mx-auto mb-4">
            Get the latest trends and insights in drone tech and AI.
          </p>
          <div className="w-24 h-1 bg-black mx-auto rounded-full"></div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-2 bg-yellow-400 sticky top-16 z-40 border-b border-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-1 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black/60" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-lg border-2 border-black/20 bg-yellow-200 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/40 text-black placeholder-black/60 font-medium text-sm transition-all duration-300"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-yellow-200 backdrop-blur-sm border-2 border-black/20 rounded-lg px-3 py-2 pr-8 text-black font-medium focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/40 text-sm transition-all duration-300 w-48"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'All' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black/60 pointer-events-none" />
            </div>
          </div>

          {/* Active Filters Display */}
          <div className="mt-1 flex flex-wrap gap-1">
            {selectedCategory !== 'All' && (
              <span className="bg-black text-yellow-400 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory('All')} className="hover:text-white text-sm">×</button>
              </span>
            )}
            {searchQuery && (
              <span className="bg-black text-yellow-400 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                Search: "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="hover:text-white text-sm">×</button>
              </span>
            )}
          </div>
        </div>
      </section>



      {/* Featured Articles Section */}
      <section className="py-4 bg-gradient-to-b from-yellow-400 to-yellow-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredArticles.map((article, index) => (
              <div
                key={article.id}
                className="group bg-[#f1ee8e] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 cursor-pointer transform hover:scale-105 hover:-rotate-1 border-2 border-black/20 hover:border-black/40"
                style={{
                  animationDelay: `${index * 200}ms`,
                  animation: `fadeInUp 0.8s ease-out ${index * 200}ms both`
                }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-48 object-cover transition-all duration-700 group-hover:scale-110 border-b-2 border-black/10"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="bg-yellow-400 text-black px-6 py-3 rounded-full font-bold shadow-2xl transform scale-0 group-hover:scale-100 transition-all duration-500 hover:bg-yellow-300 flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span>Read Article</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>

                  <div className={`absolute top-4 right-4 ${getCategoryColor(article.category)} text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg`}>
                    {article.category}
                  </div>

                  <div className="absolute bottom-4 right-4 bg-black/80 text-white px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {article.readTime}
                  </div>

                  <div className="absolute top-4 left-4 bg-yellow-400 text-black px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Featured
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-black mb-2 group-hover:text-gray-800 transition-colors duration-300">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {article.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(article.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {article.views}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid Section */}
      <section className="py-16 bg-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-black text-black">
              All Articles ({filteredArticles.length})
            </h2>
            <div className="text-black/60">
              Page {currentPage} of {totalPages}
            </div>
          </div>

          {currentArticles.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 max-w-md mx-auto">
                <Search className="h-16 w-16 text-black/40 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-black mb-2">No articles found</h3>
                <p className="text-black/60">Try adjusting your filters or search terms</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentArticles.map((article, index) => (
                <div
                  key={article.id}
                  className="group bg-[#f1ee8e] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 cursor-pointer transform hover:scale-105 border-2 border-black/20 hover:border-black/40"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: `fadeInUp 0.8s ease-out ${index * 100}ms both`
                  }}
                >
                  <div className="p-3">
                    <div className="relative overflow-hidden rounded-2xl">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-48 object-cover transition-all duration-700 group-hover:scale-110"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="bg-yellow-400 text-black px-4 py-2 rounded-full font-bold shadow-2xl transform scale-0 group-hover:scale-100 transition-all duration-500 hover:bg-yellow-300 flex items-center gap-2">
                          <span>Read More</span>
                          <ArrowRight className="h-3 w-3" />
                        </div>
                      </div>

                      <div className={`absolute top-3 right-3 ${getCategoryColor(article.category)} text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg`}>
                        {article.category}
                      </div>

                      <div className="absolute bottom-3 right-3 bg-black/80 text-white px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {article.readTime}
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-black mb-2 group-hover:text-gray-800 transition-colors duration-300 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3 text-sm">{article.excerpt}</p>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {article.author}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(article.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {article.views}
                      </div>
                    </div>
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

export default NewsPage;