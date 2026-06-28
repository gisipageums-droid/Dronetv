import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, Play, Eye, Clock, Star, TrendingUp, Calendar, Plus, X, Upload, Youtube, SlidersHorizontal } from 'lucide-react';

const VideosPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('date');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [filteredFeaturedVideos, setFilteredFeaturedVideos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddVideoForm, setShowAddVideoForm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    } catch {
      setAllVideos(defaultVideos);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultVideos));
    }
  }, []);

  // Save videos to localStorage with error handling
  const saveVideosToStorage = (videos) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
    } catch {
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
    <div className="pt-[104px] min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex items-center gap-3">
          <h1 className="text-base font-extrabold text-white m-0">Video <span className="text-yellow-400">Library</span> <span className="text-xs font-semibold text-white/50 ml-2">{allVideos.length} Videos</span></h1>
        </div>
      </div>

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

      <style>{`
.vd-wrap{max-width:1280px;margin:0 auto;padding:20px 22px}
.vd-layout{display:grid;grid-template-columns:240px 1fr;gap:16px;align-items:start}
.vd-sidebar{background:#fff;border:1px solid #E5E5E5;border-radius:8px;padding:14px;box-shadow:0 2px 12px rgba(0,0,0,.06);position:sticky;top:120px}
.vd-sidebar-title{font-size:13px;font-weight:800;color:#0A0A0A;margin-bottom:14px;display:flex;align-items:center;gap:6px}
.vd-filter-grp{margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid #F0F0F0}
.vd-filter-grp:last-child{border-bottom:none;margin-bottom:0;padding-bottom:0}
.vd-fl-label{font-size:10px;font-weight:700;color:#777;text-transform:uppercase;letter-spacing:.5px;margin-bottom:7px}
.vd-chip{padding:4px 10px;border-radius:14px;font-size:11.5px;font-weight:600;cursor:pointer;transition:all .12s;white-space:nowrap;border:1.5px solid #E5E5E5;background:#fff;color:#333;font-family:inherit}
.vd-chip.active{background:#0A0A0A;color:#F5C518;border-color:#0A0A0A}
.vd-chips{display:flex;gap:5px;flex-wrap:wrap}
.vd-main{min-width:0}
.vd-search-bar{background:#fff;border:1px solid #E5E5E5;border-radius:8px;padding:10px 12px;box-shadow:0 1px 6px rgba(0,0,0,.06);margin-bottom:12px;display:flex;align-items:center;gap:8px}
.vd-search-bar input{border:none;background:none;font-size:13px;width:100%;outline:none;color:#1A1A1A;font-family:inherit}
.vd-resbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;flex-wrap:wrap;gap:7px}
.vd-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:13px}
.vd-pages{display:flex;justify-content:center;margin-top:28px;gap:6px;flex-wrap:wrap}
.vd-page-btn{padding:7px 13px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;border:1.5px solid #E5E5E5;background:#fff;color:#444;font-family:inherit}
.vd-page-btn.active{background:#0A0A0A;color:#F5C518;border-color:#0A0A0A}
.vd-filter-toggle{display:none}
@media(max-width:960px){
  .vd-layout{grid-template-columns:1fr}
  .vd-sidebar{position:static;display:none}
  .vd-sidebar.open{display:block}
  .vd-filter-toggle{display:flex;align-items:center;gap:6px;padding:7px 12px;background:#0A0A0A;color:#F5C518;border:none;border-radius:8px;font-size:12.5px;font-weight:700;cursor:pointer;font-family:inherit;margin-bottom:10px}
}
@media(max-width:600px){.vd-wrap{padding:12px 14px}.vd-grid{grid-template-columns:1fr}}
`}</style>

      {/* Main content with sidebar */}
      <div className="vd-wrap">
        <div className="vd-layout">
          {/* Sidebar */}
          <aside className={`vd-sidebar${sidebarOpen ? ' open' : ''}`}>
            <div className="vd-sidebar-title"><SlidersHorizontal size={14} /> Filters</div>

            <div className="vd-filter-grp">
              <div className="vd-fl-label">Search</div>
              <div className="vd-search-bar">
                <Search size={14} color="#999" />
                <input placeholder="Search videos..." value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }} />
                {searchQuery && <X size={13} color="#999" style={{cursor:'pointer',flexShrink:0}} onClick={() => setSearchQuery('')} />}
              </div>
            </div>

            <div className="vd-filter-grp">
              <div className="vd-fl-label">Category</div>
              <div className="vd-chips">
                {categories.map(cat => (
                  <button key={cat} className={`vd-chip${selectedCategory === cat ? ' active' : ''}`} onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}>
                    {cat === 'All' ? 'All' : cat}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={() => setShowAddVideoForm(true)}
              style={{width:'100%',padding:'8px',borderRadius:'8px',fontSize:'12px',fontWeight:700,background:'#0A0A0A',color:'#F5C518',border:'none',cursor:'pointer',fontFamily:'inherit',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
              <Plus size={13} /> Add Video
            </button>
          </aside>

          {/* Main */}
          <div className="vd-main">
            <button className="vd-filter-toggle" onClick={() => setSidebarOpen(o => !o)}>
              <SlidersHorizontal size={14} /> Filters {(searchQuery || selectedCategory !== 'All') ? '(active)' : ''}
            </button>

            {/* Featured Videos */}
            {filteredFeaturedVideos.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl mb-4 p-4">
                <h2 style={{fontSize:'13px',fontWeight:800,color:'#0A0A0A',marginBottom:12,display:'flex',alignItems:'center',gap:6}}>
                  <Star size={14} color="#F5C518" fill="#F5C518" /> Featured Videos ({filteredFeaturedVideos.length})
                </h2>
                <div className="vd-grid">
                  {filteredFeaturedVideos.map(video => (
                    <div key={video.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                      <div className="relative overflow-hidden">
                        <iframe src={convertToEmbedUrl(video.videoUrl)} title={video.title} className="w-full h-40 rounded-t-xl" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                        <div className="absolute top-2 left-2 bg-yellow-400 text-black px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1"><Star size={10} fill="currentColor" />Featured</div>
                      </div>
                      <div className="p-3">
                        <h3 className="text-xs font-bold text-gray-900 mb-1 line-clamp-2">{video.title}</h3>
                        <p className="text-xs text-gray-500 line-clamp-2">{video.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="vd-resbar">
              <span style={{fontSize:'13px',color:'#666'}}>{filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''}</span>
              {totalPages > 1 && <span style={{fontSize:'12px',color:'#999'}}>Page {currentPage} of {totalPages}</span>}
            </div>

            {currentVideos.length === 0 ? (
              <div style={{textAlign:'center',padding:'64px 0'}}>
                <div style={{background:'#fff',border:'1px solid #E5E5E5',borderRadius:'12px',padding:'48px 32px',maxWidth:'360px',margin:'0 auto'}}>
                  <Search size={40} color="#ccc" style={{margin:'0 auto 12px'}} />
                  <p style={{fontWeight:700,color:'#333',marginBottom:4}}>No videos found</p>
                  <p style={{fontSize:'13px',color:'#999'}}>Try adjusting your filters</p>
                </div>
              </div>
            ) : (
              <div className="vd-grid">
                {currentVideos.map(video => (
                  <div key={video.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-2">
                      <iframe src={convertToEmbedUrl(video.videoUrl)} title={video.title} className="w-full h-40 rounded-lg" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                    </div>
                    <div className="px-3 pb-3">
                      <h3 className="text-xs font-bold text-gray-900 mb-1 line-clamp-2">{video.title}</h3>
                      <p className="text-xs text-gray-500 line-clamp-2">{video.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="vd-pages">
                <button className="vd-page-btn" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>← Prev</button>
                {[...Array(totalPages)].map((_, i) => {
                  const pg = i + 1;
                  if (pg === currentPage || pg === 1 || pg === totalPages || (pg >= currentPage - 1 && pg <= currentPage + 1)) {
                    return <button key={pg} className={`vd-page-btn${pg === currentPage ? ' active' : ''}`} onClick={() => setCurrentPage(pg)}>{pg}</button>;
                  } else if (pg === currentPage - 2 || pg === currentPage + 2) {
                    return <span key={pg} style={{alignSelf:'center',color:'#999'}}>…</span>;
                  }
                  return null;
                })}
                <button className="vd-page-btn" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Next →</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideosPage;