import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, Play, Eye, Clock, Star, TrendingUp, Calendar, Plus, X, Upload, Youtube } from 'lucide-react';

const VideosPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('date');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [filteredFeaturedVideos, setFilteredFeaturedVideos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddVideoForm, setShowAddVideoForm] = useState(false);
  const [newVideo, setNewVideo] = useState({
    title: '',
    description: '',
    videoUrl: '',
    category: 'Drone',
    featured: false
  });
  const videosPerPage = 12;

  const categories = ['All', 'Drone', 'AI', 'GIS', 'Events', 'Reviews', 'Agritech'];
  const sortOptions = [
    { value: 'date', label: 'Sort by Date' },
    { value: 'popularity', label: 'Sort by Popularity' },
    { value: 'views', label: 'Sort by Views' },
    { value: 'title', label: 'Sort by Title' }
  ];

  type Video = {
    id: number;
    title: string;
    description: string;
    videoUrl: string;
    category: string;
    views: string;
    duration: string;
    rating: number;
    featured?: boolean;
    date?: string;
    frontImage?: string;
  };

  // Default videos - these are the initial videos
  const defaultVideos: Video[] = [
    {
      id: 13,
      title: "Dr. Pranay Kumar Speaks on RPTO Association",
      description: "Dr. Pranay Kumar of India Drone TV discusses the RPTO Association and its vision for drone training and leadership in India's rapidly evolving drone industry—a key highlight from Drone Expo 2025.",
      videoUrl: "https://www.youtube.com/embed/ZxMxuGhwaRo",
      category: "Events",
      views: "not available",
      duration: "not available",
      rating: 4.5,
      featured: true,
      date: "2024-01-15"
    },
    {
      id: 14,
      title: "A Game‑Changing Initiative by Mr. Dev in Drone Technology",
      description: "This latest segment on Drone TV highlights Mr. Dev's pioneering drone initiative in mapping and commercial applications, showcasing how innovate leaders are shaping India's Drone Expo 2025 narrative.",
      videoUrl: "https://www.youtube.com/embed/MOT_ElaXvY0",
      category: "Events",
      views: "not available",
      duration: "not available",
      rating: 4.6,
      featured: true,
      date: "2024-01-14"
    },
    {
      id: 3,
      title: "Dr. Pranay Kumar on Industry-Scale Drone Integration at Drone Expo 2025",
      description: "Dr. Pranay Kumar, COO of BBPL Aero and Technical Advisor at Services International, shares expert insights on how drone technology is transforming agriculture, infrastructure, logistics, and more. His briefing at Drone Expo 2025 outlines a clear roadmap for intelligent UAV adoption and strategic industry integration in India.",
      videoUrl: "https://www.youtube.com/embed/7Emdg4-WgQo",
      category: "Drone",
      views: "15.2K",
      duration: "6:33",
      rating: 4.9,
      featured: true,
      date: "2024-01-13"
    },
    {
      id: 2,
      title: "Voices from Drone Expo 2025 – Featuring Dev R, Founder of Drone TV",
      description: "Drone TV captures the spirit of Drone Expo 2025 — candid interviews, expert insights, and bold visions shaping India's UAV ecosystem. Dev R, Founder of Drone TV, shares: 'Drone TV is the voice of the drone ecosystem — a platform where innovators, startups, and entrepreneurs can express their vision and connect with the world.' Subscribe for more exclusive coverage and insights.",
      videoUrl: "https://www.youtube.com/embed/W2kpIo1Xlj4",
      category: "Events",
      views: "8.9K",
      duration: "12:15",
      rating: 4.6,
      date: "2024-01-12"
    },
    {
      id: 1,
      title: "Payal Highlights Innovation at Drone Expo 2025",
      description: "In this special feature, Payal — a passionate voice from the Drone Expo team — shares her take on the most innovative drone stalls at the event. From standout technologies to unique features, her enthusiasm captures the collaborative and futuristic spirit of Drone Expo 2025, where industry leaders, enthusiasts, and innovators converge.",
      videoUrl: "https://www.youtube.com/embed/ykgVmoq5UXc",
      category: "GIS",
      views: "7.8K",
      duration: "9:51",
      rating: 4.4,
      date: "2024-01-11"
    },
    {
      id: 6,
      title: "Carbon Light's Innovation in Drone Design – Rini Bansal at Drone Expo 2025",
      description: "Rini Bansal from Carbon Light shares exclusive insights with Drone TV on their advanced carbon fiber components and lightweight drone frames showcased at Drone Expo 2025. Learn how their mission-ready tech enhances endurance, payload capacity, and performance — making Carbon Light a go-to name for drone OEMs and integrators.",
      videoUrl: "https://www.youtube.com/embed/bIOSkyj6xSk",
      category: "Drone",
      views: "9.7K",
      duration: "10:28",
      rating: 4.5,
      date: "2024-01-10"
    },
    {
      id: 5,
      title: "Teja from Corteva on Drone-Powered Agriculture at Drone Expo 2025",
      description: "Drone TV interviews Teja from Corteva Agriscience at Drone Expo 2025 to explore how drones are transforming modern agriculture. From precision spraying to crop health monitoring, learn how Corteva leverages drone tech to boost sustainability, productivity, and field efficiency. Part of Drone TV's exclusive series on drone-driven innovation across industries.",
      videoUrl: "https://www.youtube.com/embed/9SUglQh93cQ",
      category: "AI",
      views: "11.3K",
      duration: "14:07",
      rating: 4.7,
      date: "2024-01-09"
    },
    {
      id: 7,
      title: "IlaAgri's Uber Model for Agro Drones – Featured at DroneWorld 2024",
      description: "Drone TV showcases IlaAgri Services Pvt. Ltd., a pioneer in democratizing drone access for Indian farmers. Discover how their 'Uberization' model allows farmers to book agro drones as easily as a ride — making tech-driven agriculture affordable and impactful. Hear real stories, explore ground-level impact, and witness how IlaAgri is transforming Indian farming.",
      videoUrl: "https://www.youtube.com/embed/Wd5tORrsZDY",
      category: "Events",
      views: "13.1K",
      duration: "18:22",
      rating: 4.8,
      date: "2024-01-08"
    },
    {
      id: 8,
      title: "Kalyan from XBOOM on Underwater Drone Innovation – Drone Expo 2025",
      description: "At Drone Expo 2025, Kalyan, COO of XBOOM, unveils how their underwater drones are transforming aquatic operations—from pipeline inspections and marine research to defense surveillance and disaster response. Dive into the next frontier of unmanned technology and explore how XBOOM is redefining drone deployment beneath the surface.",
      videoUrl: "https://www.youtube.com/embed/D8yx7peXCtg",
      category: "Reviews",
      views: "22.4K",
      duration: "16:45",
      rating: 4.9,
      date: "2024-01-07"
    },
    {
      id: 9,
      title: "Hrishikesh Wadkar on Indigenous Drones & Training – Drone Expo 2025",
      description: "Drone TV speaks with Hrishikesh Wadkar, Founder of Pavaman Aviation, on their dual mission — manufacturing drones in India and offering DGCA-certified pilot training. Learn how Pavaman is driving innovation, quality, and self-reliance in the UAV sector. Part of Drone TV's exclusive Drone Expo 2025 series featuring pioneers shaping India's drone future.",
      videoUrl: "https://www.youtube.com/embed/K9ZIZtb0PNY",
      category: "AI",
      views: "6.2K",
      duration: "11:33",
      rating: 4.6,
      date: "2024-01-06"
    },
    {
      id: 10,
      title: "Rohaan Ullah Khan on Drone-Ready Packaging – Drone Expo 2025",
      description: "At Drone Expo 2025, Rohaan Ullah Khan of K.K. Nag Pvt. Ltd. discusses the importance of specialized packaging in safeguarding advanced drone components. As drones grow more sophisticated, their safe transport and storage become critical. Discover how K.K. Nag's custom-engineered solutions protect the tech that powers tomorrow — only on Drone TV.",
      videoUrl: "https://www.youtube.com/embed/q-3kYJJff3s",
      category: "GIS",
      views: "5.9K",
      duration: "13:17",
      rating: 4.3,
      date: "2024-01-05"
    },
    {
      id: 11,
      title: "Rishab Raj on Carbon Fiber Drones – Drone Expo 2025",
      description: "At Drone Expo 2025, Rishab Raj from Carbon Light unveils the future of drone design with advanced carbon fiber technology. Learn how this lightweight, ultra-strong material is redefining durability, flight efficiency, and payload performance in UAVs. Don't miss this exclusive Drone TV feature on the next generation of high-performance drones.",
      videoUrl: "https://www.youtube.com/embed/UTEOSIHf9G4",
      category: "Drone",
      views: "18.7K",
      duration: "25:14",
      rating: 4.7,
      date: "2024-01-04"
    },
    {
      id: 12,
      title: "Copter Innovations Showcases Mission-Ready Drones – Drone Expo 2025",
      description: "At Drone Expo 2025, Copter Innovations unveils their latest breakthroughs in rotary-wing UAVs designed for mapping, surveillance, logistics, and more. With custom-built solutions for both commercial and defense sectors, their precision engineering and innovation-first mindset are shaping the future of mission-ready aerial platforms. Watch the full showcase on Drone TV.",
      videoUrl: "https://www.youtube.com/embed/ctKVmhYssVw",
      category: "Events",
      views: "14.8K",
      duration: "32:18",
      rating: 4.8,
      date: "2024-01-03"
    },
    {
      id: 4,
      title: "Gowrav Reddy on Drone Tech for Indian Agriculture",
      description: "At Drone Expo, Gowrav Reddy, Founder of CropWings, highlights how drone technology can address India's agri crisis—reducing pesticide overuse, minimizing crop protection costs, and connecting farmers with certified drone operators for safer, smarter farming.",
      videoUrl: "https://www.youtube.com/embed/hRt9Op9nD7M",
      category: "Agritech",
      views: "12.5K",
      duration: "8:42",
      rating: 4.8,
      featured: true,
      date: "2024-01-02"
    }
  ];

  const [allVideos, setAllVideos] = useState<Video[]>([]);

  // Initialize localStorage with a unique key and robust data handling
  const STORAGE_KEY = 'droneTV_videos_v2';

  // Load videos from localStorage on component mount
  useEffect(() => {
    try {
      const savedVideos = localStorage.getItem(STORAGE_KEY);
      if (savedVideos) {
        const parsedVideos = JSON.parse(savedVideos);
        // Validate the parsed data
        if (Array.isArray(parsedVideos) && parsedVideos.length > 0) {
          setAllVideos(parsedVideos);
        } else {
          // If data is invalid, use defaults and save them
          setAllVideos(defaultVideos);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultVideos));
        }
      } else {
        // First time visit, save default videos
        setAllVideos(defaultVideos);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultVideos));
      }
    } catch (error) {
      console.error('Error loading videos from localStorage:', error);
      // Fallback to defaults if there's any error
      setAllVideos(defaultVideos);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultVideos));
    }
  }, []);

  // Save videos to localStorage with error handling
  const saveVideosToStorage = (videos) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
    } catch (error) {
      console.error('Error saving videos to localStorage:', error);
      alert('Unable to save videos. Please check your browser settings.');
    }
  };

  // Update storage whenever allVideos changes (but not on initial load)
  useEffect(() => {
    if (allVideos.length > 0) {
      saveVideosToStorage(allVideos);
    }
  }, [allVideos]);

  // Convert YouTube URL to embed URL
  const convertToEmbedUrl = (url: string) => {
    if (url.includes('embed/')) {
      return url;
    }

    // Handle watch URLs
    if (url.includes('watch?v=')) {
      const videoId = url.split('watch?v=')[1].split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // Handle youtu.be URLs
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    return url;
  };

  // Handle form submission
  const handleSubmitVideo = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newVideo.title || !newVideo.description || !newVideo.videoUrl) {
      alert('Please fill in all required fields');
      return;
    }

    const videoToAdd: Video = {
      id: Date.now(), // Use timestamp for unique ID
      title: newVideo.title,
      description: newVideo.description,
      videoUrl: convertToEmbedUrl(newVideo.videoUrl),
      category: newVideo.category,
      views: '0',
      duration: 'New',
      rating: 5.0,
      featured: newVideo.featured,
      date: new Date().toISOString().split('T')[0]
    };

    setAllVideos(prev => [videoToAdd, ...prev]);

    // Reset form
    setNewVideo({
      title: '',
      description: '',
      videoUrl: '',
      category: 'Drone',
      featured: false
    });

    setShowAddVideoForm(false);
  };

  // Enhanced filtering logic that applies to both featured and regular videos
  useEffect(() => {
    const applyFilters = (videos) => {
      let filtered = [...videos];

      // Filter by category
      if (selectedCategory !== 'All') {
        filtered = filtered.filter(video => video.category === selectedCategory);
      }

      // Filter by search query
      if (searchQuery) {
        filtered = filtered.filter(video =>
          video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          video.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Sort videos
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'date':
            return new Date(b.date || '').getTime() - new Date(a.date || '').getTime();
          case 'popularity':
            return b.rating - a.rating;
          case 'views':
            return parseFloat(b.views) - parseFloat(a.views);
          case 'title':
            return a.title.localeCompare(b.title);
          default:
            return 0;
        }
      });

      return filtered;
    };

    // Apply filters to featured videos
    const featuredVideos = allVideos.filter(video => video.featured);
    const filteredFeatured = applyFilters(featuredVideos);
    setFilteredFeaturedVideos(filteredFeatured);

    // Apply filters to all videos (excluding featured ones for the All Videos section)
    const nonFeaturedVideos = allVideos.filter(video => !video.featured);
    const filteredNonFeatured = applyFilters(nonFeaturedVideos);
    setFilteredVideos(filteredNonFeatured);

    setCurrentPage(1);
  }, [selectedCategory, sortBy, searchQuery, allVideos]);

  // Pagination for All Videos section
  const indexOfLastVideo = currentPage * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  const currentVideos = filteredVideos.slice(indexOfFirstVideo, indexOfLastVideo);
  const totalPages = Math.ceil(filteredVideos.length / videosPerPage);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'AI': return 'bg-red-600';
      case 'GIS': return 'bg-black';
      case 'Drone': return 'bg-gray-800';
      case 'Events': return 'bg-red-800';
      case 'Reviews': return 'bg-gray-900';
      case 'Agritech': return 'bg-green-800';
      default: return 'bg-gray-700';
    }
  };

  const getYoutubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : '';
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
            Video Library
          </h1>
          <p className="text-xl text-black/80 max-w-2xl mx-auto mb-4">
            Explore innovative drone tech, AI, and GIS solutions.
          </p>
          <div className="w-24 h-1 bg-black mx-auto rounded-full mb-4"></div>
        </div>
      </section>

      {/* Add Video Modal */}
      {showAddVideoForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-black">Add New Video</h2>
              <button
                onClick={() => setShowAddVideoForm(false)}
                className="text-gray-500 hover:text-black transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmitVideo} className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">Title *</label>
                <input
                  type="text"
                  value={newVideo.title}
                  onChange={(e) => setNewVideo(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
                  placeholder="Enter video title"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">Description *</label>
                <textarea
                  value={newVideo.description}
                  onChange={(e) => setNewVideo(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
                  placeholder="Enter video description"
                  required
                />
              </div>

              {/* Video URL */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">Video URL *</label>
                <input
                  type="url"
                  value={newVideo.videoUrl}
                  onChange={(e) => setNewVideo(prev => ({ ...prev, videoUrl: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
                  placeholder="Enter YouTube URL (any format)"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Supports YouTube URLs like: youtube.com/watch?v=... or youtu.be/... or youtube.com/embed/...
                </p>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">Category</label>
                <select
                  value={newVideo.category}
                  onChange={(e) => setNewVideo(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
                >
                  {categories.filter(cat => cat !== 'All').map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Featured Checkbox */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="featured"
                  checked={newVideo.featured}
                  onChange={(e) => setNewVideo(prev => ({ ...prev, featured: e.target.checked }))}
                  className="h-5 w-5 text-black focus:ring-black border-gray-300 rounded"
                />
                <label htmlFor="featured" className="text-sm font-medium text-black">
                  Featured Video (will appear in the featured section)
                </label>
              </div>

              {/* Auto-generated Date Info */}
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Date will be automatically generated: {new Date().toLocaleDateString()}</span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddVideoForm(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-200 text-black rounded-xl hover:border-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
                >
                  Add Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filter Section */}
      <section className="py-2 bg-yellow-400 sticky top-0 z-40 border-b border-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-1 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black/60" />
              <input
                type="text"
                placeholder="Search videos or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-lg border-2 border-black/20 bg-yellow-200 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/40 text-black placeholder-black/60 font-medium text-sm transition-all duration-300"
              />
            </div>

            {/* Add Video Button + Category Filter */}
            <div className="flex items-center gap-2">
              {/* Add Video Button */}
              <button
                onClick={() => setShowAddVideoForm(true)}
                className="bg-black text-yellow-400 px-7 py-2 rounded-xl font-medium hover:bg-gray-800 transition-all duration-300 flex items-center gap-2 text-sm"
              >
                <Plus className="h-4 w-4" />
                Video
              </button>

              {/* Category Filter */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none bg-yellow-200 backdrop-blur-sm border-2 border-black/20 rounded-lg px-3 py-2 pr-8 text-black font-medium focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/40 text-sm transition-all duration-300 w-48"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === 'All' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black/60 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          <div className="mt-1 flex flex-wrap gap-1">
            {selectedCategory !== 'All' && (
              <span className="bg-black text-yellow-400 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory('All')} className="hover:text-white text-sm">
                  ×
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="bg-black text-yellow-400 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                Search: "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="hover:text-white text-sm">
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Featured Videos Section - Only show when there are filtered featured videos */}
      {filteredFeaturedVideos.length > 0 && (
        <section className="py-4 bg-gradient-to-b from-yellow-400 to-yellow-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-black text-black flex items-center gap-2">
                <Star className="h-6 w-6 fill-current" />
                Featured Videos ({filteredFeaturedVideos.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredFeaturedVideos.map((video, index) => (
                <div
                  key={video.id}
                  className="group bg-[#f1ee8e] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 cursor-pointer transform hover:scale-105 hover:-rotate-1 border-2 border-black/20 hover:border-black/40"
                  style={{
                    animationDelay: `${index * 200}ms`,
                    animation: `fadeInUp 0.8s ease-out ${index * 200}ms both`
                  }}
                >
                  <div className="relative overflow-hidden">
                    <iframe
                      src={convertToEmbedUrl(video.videoUrl)}
                      title={video.title}
                      className="w-full h-48 object-cover transition-all duration-700 group-hover:scale-110 border-b-2 border-black/10 rounded-t-3xl"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                    <div className="absolute top-4 left-4 bg-yellow-400 text-black px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      Featured
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-black mb-2 group-hover:text-red-800 transition-colors duration-300">
                      {video.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{video.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Video Grid Section */}
      <section className="py-16 bg-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-black text-black">
              All Videos ({filteredVideos.length})
            </h2>
            <div className="text-black/60">
              Page {currentPage} of {totalPages}
            </div>
          </div>

          {currentVideos.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 max-w-md mx-auto">
                <Search className="h-16 w-16 text-black/40 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-black mb-2">No videos found</h3>
                <p className="text-black/60">Try adjusting your filters or search terms</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {currentVideos.map((video, index) => (
                <div
                  key={video.id}
                  className="group bg-[#f1ee8e] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 cursor-pointer transform hover:scale-105 border-2 border-black/20 hover:border-black/40"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: `fadeInUp 0.8s ease-out ${index * 100}ms both`
                  }}
                >
                  <div className="p-3">
                    <div className="relative overflow-hidden rounded-2xl">
                      <iframe
                        src={convertToEmbedUrl(video.videoUrl)}
                        title={video.title}
                        className="w-full h-48 object-cover rounded-2xl"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none" />
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-bold text-black mb-2 group-hover:text-red-800 transition-colors duration-300 line-clamp-2">
                      {video.title}
                    </h3>
                    <p className="text-gray-600 mb-3 line-clamp-2 text-sm">{video.description}</p>
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

export default VideosPage;