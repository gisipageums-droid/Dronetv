import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, X, ChevronLeft, ChevronRight, Download, Share2, Heart, Calendar, MapPin, Users, Plus, Upload, Tag } from 'lucide-react';

const GalleryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredImages, setFilteredImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showAddImageModal, setShowAddImageModal] = useState(false);
  const isInitialLoad = useRef(true);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Events',
    description: '',
    tags: '',
    location: '',
    attendees: '',
    image: null,
    imagePreview: null
  });

  const imagesPerPage = 24;
  const categories = ['All', 'Events', 'Collaborations', 'Conferences', 'Interviews', 'Product Launches', 'Team Photos'];

  const defaultImages = [
    { id: 1, src: "/images/1.jpg", title: "Tech Innovations Showcase", category: "Events", date: "July 10, 2023", location: "New York, NY", attendees: "100+", description: "Showcasing the latest innovations in drone technology.", tags: ["dev", "Pranay"] },
    { id: 2, src: "/images/2.jpg", title: "Global Partnerships Panel", category: "Events", date: "July 12, 2023", location: "London, UK", attendees: "120+", description: "Discussing strategic partnerships in the drone industry.", tags: ["dev"] },
    { id: 3, src: "/images/3.jpg", title: "Drone Education Summit", category: "Events", date: "July 15, 2023", location: "Berlin, Germany", attendees: "150+", description: "Gathering experts to discuss the future of drone education.", tags: ["dev", "payal", "pallavi", "supriya", "sandeep", "vamsi", "pranay"] },
    { id: 4, src: "/images/4.jpg", title: "Aerial Imaging Workshop", category: "Events", date: "July 18, 2023", location: "Chicago, IL", attendees: "85+", description: "Practical hands-on experience in aerial image processing.", tags: ["pranay", "dev", "sandeep"] },
    { id: 5, src: "/images/5.jpg", title: "Drone Security and Safety Workshop", category: "Events", date: "July 20, 2023", location: "Sydney, Australia", attendees: "80+", description: "Focusing on safety protocols and security in drone operations.", tags: ["vamsi"] },
    { id: 6, src: "/images/6.jpg", title: "UAV Industry Trends", category: "Events", date: "July 22, 2023", location: "Virtual", attendees: "150+", description: "Analyzing the latest trends and innovations in the UAV industry.", tags: ["dev", "pranay"] },
    { id: 7, src: "/images/7.jpg", title: "Drone Photography Challenge", category: "Events", date: "July 25, 2023", location: "Bangkok, Thailand", attendees: "60+", description: "Competition on drone-based creative photography.", tags: ["dev", "pranay"] },
    { id: 8, src: "/images/8.jpg", title: "Autonomous Drone Operations Seminar", category: "Events", date: "July 28, 2023", location: "Singapore", attendees: "120+", description: "Discussing the future of autonomous drone systems.", tags: ["dev"] },
    { id: 9, src: "/images/9.jpg", title: "Drone Surveying and Mapping Workshop", category: "Events", date: "August 1, 2023", location: "Paris, France", attendees: "90+", description: "Hands-on workshop focusing on drone surveying techniques.", tags: ["dev"] },
    { id: 10, src: "/images/10.jpg", title: "Future of Aerial Imaging Conference", category: "Events", date: "August 5, 2023", location: "Tokyo, Japan", attendees: "300+", description: "A deep dive into the future of aerial imaging and its applications.", tags: ["dev"] },
    { id: 11, src: "/images/11.jpg", title: "AgriTech Drone Solutions Meet", category: "Events", date: "August 8, 2023", location: "Ahmedabad, India", attendees: "110+", description: "Innovative drone solutions for agriculture and spraying.", tags: ["dev", "pranay"] },
    { id: 12, src: "/images/12.jpg", title: "Drone Delivery Solutions Expo", category: "Events", date: "August 12, 2023", location: "Dubai, UAE", attendees: "250+", description: "Exploring the latest advancements in drone delivery solutions.", tags: ["dev"] },
    { id: 13, src: "/images/13.jpg", title: "Drone Industry Roundtable", category: "Events", date: "August 15, 2023", location: "Los Angeles, CA", attendees: "70+", description: "Industry leaders discuss the future of the drone market.", tags: ["vamsi", "payal"] },
    { id: 14, src: "/images/14.jpg", title: "Geospatial Data and UAV Integration", category: "Events", date: "August 17, 2023", location: "Virtual", attendees: "130+", description: "Webinar on integrating UAVs with geospatial data for mapping.", tags: ["vamsi", "dev"] },
    { id: 15, src: "/images/15.jpg", title: "Drone Technology Innovations Showcase", category: "Events", date: "August 20, 2023", location: "San Francisco, CA", attendees: "200+", description: "A showcase of the latest innovations in drone technology.", tags: ["dev"] },
    { id: 16, src: "/images/16.jpg", title: "Disaster Management with UAVs", category: "Events", date: "August 23, 2023", location: "Chennai, India", attendees: "140+", description: "Utilizing UAVs in emergency response and disaster zones.", tags: ["dev"] },
    { id: 17, src: "/images/17.jpg", title: "Women in Drone Technology", category: "Events", date: "August 25, 2023", location: "Pune, India", attendees: "100+", description: "Celebrating women professionals in the UAV industry.", tags: ["dev", "pranay", "sandeep"] },
    { id: 18, src: "/images/18.jpg", title: "Drones in Environmental Conservation Expo", category: "Events", date: "September 5, 2023", location: "Berlin, Germany", attendees: "80+", description: "Exploring the use of drones in environmental conservation efforts.", tags: ["dev", "vamsi"] },
    { id: 19, src: "/images/19.jpg", title: "Autonomous Drone Systems Workshop", category: "Events", date: "September 10, 2023", location: "Paris, France", attendees: "60+", description: "Hands-on workshop on autonomous drone technologies.", tags: ["vamsi"] },
    { id: 21, src: "/images/21.jpg", title: "UAV Innovations and Safety Conference", category: "Events", date: "September 20, 2023", location: "Sydney, Australia", attendees: "250+", description: "Focusing on UAV innovations and safety standards.", tags: ["dev", "payal", "pallavi", "supriya", "sandeep", "vamsi", "pranay"] },
    { id: 22, src: "/images/22.jpg", title: "Drone Journalism and Media Session", category: "Events", date: "September 25, 2023", location: "Mumbai, India", attendees: "75+", description: "Exploring the role of drones in journalism and broadcasting.", tags: ["dev", "vamsi"] },
    { id: 23, src: "/images/23.jpg", title: "AI Integration in Drone Systems", category: "Events", date: "September 28, 2023", location: "Seoul, South Korea", attendees: "180+", description: "Leveraging AI to improve autonomous drone behavior.", tags: ["dev", "pranay", "sandeep"] },
    { id: 24, src: "/images/24.jpg", title: "Youth Drone Bootcamp", category: "Events", date: "October 2, 2023", location: "Hyderabad, India", attendees: "90+", description: "Drone training and awareness for young enthusiasts.", tags: ["dev", "pranay"] },
    { id: 25, src: "/images/25.jpg", title: "Drone AI & Geospatial Data Forum", category: "Events", date: "October 5, 2023", location: "Singapore", attendees: "160+", description: "Discussing convergence of AI and GIS in drone workflows.", tags: ["dev", "vamsi", "sandeep", "pranay"] },
    { id: 26, src: "/images/1.png", title: "DroneWorld Conference 2024 Opening Ceremony", category: "Collaborations", date: "March 15, 2024", location: "San Francisco, CA", attendees: "2,500+", description: "Grand opening ceremony of the largest drone technology conference.", tags: ["Teja", "Dev"] },
    { id: 27, src: "/images/2.png", title: "AI Partnership Announcement", category: "Interviews", date: "February 20, 2024", location: "Seattle, WA", attendees: "150+", description: "Strategic partnership announcement with leading AI technology companies.", tags: ["Dev"] },
    { id: 28, src: "/images/3.png", title: "GIS Mapping Workshop Session", category: "Interviews", date: "January 28, 2024", location: "Austin, TX", attendees: "200+", description: "Hands-on workshop demonstrating advanced GIS mapping techniques." },
    { id: 29, src: "/images/4.png", title: "Drone Technology Exhibition", category: "Interviews", date: "March 16, 2024", location: "San Francisco, CA", attendees: "3,000+", description: "Latest drone technology showcase with live demonstrations.", tags: ["Gosharpener"] },
    { id: 30, src: "/images/5.png", title: "Industry Leaders Panel Discussion", category: "Interviews", date: "March 17, 2024", location: "San Francisco, CA", attendees: "1,500+", description: "Panel discussion with top executives from leading drone companies." },
    { id: 31, src: "/images/6.png", title: "New Product Launch Event", category: "Interviews", date: "February 10, 2024", location: "Los Angeles, CA", attendees: "800+", description: "Exclusive launch event for the latest drone technology innovations." },
    { id: 32, src: "/images/7.png", title: "Team Building Retreat", category: "Team Photos", date: "January 15, 2024", location: "Napa Valley, CA", attendees: "50+", description: "Annual team building retreat with outdoor activities and team bonding.", tags: ["Dev", "Pushpak"] },
    { id: 33, src: "/images/8.png", title: "University Partnership Signing", category: "Events", date: "December 20, 2023", location: "Boston, MA", attendees: "100+", description: "Partnership agreement signing with leading universities.", tags: ["Vamsi", "Pushpak"] },
    { id: 34, src: "/images/9.png", title: "Drone Safety Training Workshop", category: "Events", date: "November 30, 2023", location: "Denver, CO", attendees: "300+", description: "Comprehensive safety training workshop for drone operators.", tags: ["Dev", "Sandeep", "Ramesh"] },
    { id: 35, src: "/images/10.png", title: "International Drone Summit", category: "Events", date: "October 25, 2023", location: "New York, NY", attendees: "2,000+", description: "Global summit bringing together international drone technology experts.", tags: ["Dev"] },
    { id: 36, src: "/images/11.png", title: "Startup Collaboration Meetup", category: "Collaborations", date: "September 15, 2023", location: "Silicon Valley, CA", attendees: "250+", description: "Networking event connecting startups with established drone companies.", tags: ["Dev", "Pranay"] },
    { id: 37, src: "/images/12.png", title: "Annual Company Celebration", category: "Interviews", date: "August 20, 2023", location: "San Francisco, CA", attendees: "200+", description: "Annual company celebration recognizing achievements and milestones." },
    { id: 38, src: "/images/13.png", title: "Environmental Monitoring Conference", category: "Events", date: "July 18, 2023", location: "Portland, OR", attendees: "900+", description: "Conference focused on drone applications in environmental monitoring.", tags: ["Dev", "Pallavi"] },
    { id: 39, src: "/images/14.png", title: "Racing Drone Championship", category: "Collaborations", date: "June 25, 2023", location: "Las Vegas, NV", attendees: "5,000+", description: "International drone racing championship with live competitions.", tags: ["Dev", "Gowrav Reddy"] },
    { id: 40, src: "/images/15.png", title: "AI Research Collaboration", category: "Team Photos", date: "May 30, 2023", location: "Cambridge, MA", attendees: "75+", description: "Research collaboration announcement with MIT AI Lab.", tags: ["Dev"] },
    { id: 41, src: "/images/16.png", title: "Precision Agriculture Workshop", category: "Interviews", date: "April 22, 2023", location: "Iowa City, IA", attendees: "180+", description: "Workshop on precision agriculture applications using drone technology.", tags: ["Sakthivelan"] },
    { id: 42, src: "/images/17.png", title: "Drone Delivery Demo Day", category: "Interviews", date: "March 28, 2023", location: "Phoenix, AZ", attendees: "600+", description: "Live demonstration of autonomous drone delivery systems.", tags: ["Dr. Nirranjan Kumar Gupta"] },
    { id: 43, src: "/images/18.png", title: "Holiday Team Party", category: "Team Photos", date: "December 15, 2022", location: "San Francisco, CA", attendees: "120+", description: "Annual holiday celebration with the entire Drone TV team.", tags: ["Dr. Nirranjan Kumar Gupta", "Dev"] },
    { id: 44, src: "/images/19.png", title: "Government Partnership Forum", category: "Events", date: "November 10, 2022", location: "Washington, DC", attendees: "300+", description: "Forum discussing government partnerships in drone technology." },
    { id: 45, src: "/images/20.png", title: "Advanced Pilot Training", category: "Collaborations", date: "October 5, 2022", location: "Miami, FL", attendees: "150+", description: "Advanced pilot training program for commercial drone operators.", tags: ["Dev", "Ajitha Surabhi"] },
    { id: 46, src: "/images/21.png", title: "Tech Innovation Showcase", category: "Events", date: "September 20, 2022", location: "Austin, TX", attendees: "1,800+", description: "Showcase of the latest innovations in drone and AI technology.", tags: ["Dev", "Payal", "vamsi"] },
    { id: 47, src: "/images/22.png", title: "European Expansion Launch", category: "Conferences", date: "August 15, 2022", location: "London, UK", attendees: "400+", description: "Official launch of Drone TV's expansion into European markets.", tags: ["Dev", "Rini Bansal"] },
    { id: 48, src: "/images/23.png", title: "Mapping Technology Conference", category: "Interviews", date: "July 8, 2022", location: "Denver, CO", attendees: "1,200+", description: "Conference focused on advances in drone mapping technology.", tags: ["Dev", "MGR"] },
    { id: 49, src: "/images/25.png", title: "Company Milestone Celebration", category: "Interviews", date: "June 1, 2022", location: "San Francisco, CA", attendees: "80+", description: "Celebrating major company milestones and achievements.", tags: ["Rini Bansal"] },
  ];

  const [allImages, setAllImages] = useState([]);
  const STORAGE_KEY = 'droneTV_gallery_images_v3';

  useEffect(() => {
    try {
      const savedImages = localStorage.getItem(STORAGE_KEY);
      if (savedImages) {
        const parsedImages = JSON.parse(savedImages);
        setAllImages(Array.isArray(parsedImages) && parsedImages.length > 0 ? parsedImages : defaultImages);
      } else {
        setAllImages(defaultImages);
      }
    } catch {
      setAllImages(defaultImages);
    }
    isInitialLoad.current = false;
  }, []);

  useEffect(() => {
    if (!isInitialLoad.current && allImages.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allImages));
      } catch { /* storage full, ignore */ }
    }
  }, [allImages]);

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  useEffect(() => {
    let filtered = [...allImages];
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(image => image.category === selectedCategory);
    }
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(image =>
        image.title.toLowerCase().includes(lowerQuery) ||
        image.description.toLowerCase().includes(lowerQuery) ||
        image.location.toLowerCase().includes(lowerQuery) ||
        (image.tags && image.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
      );
    }
    filtered.sort((a, b) => b.id - a.id);
    setFilteredImages(filtered);
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, allImages]);

  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = filteredImages.slice(indexOfFirstImage, indexOfLastImage);
  const totalPages = Math.ceil(filteredImages.length / imagesPerPage);

  const openLightbox = (image, globalIndex) => {
    setSelectedImage(image);
    setLightboxIndex(globalIndex);
    setIsLiked(false);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    setLightboxIndex(0);
  };

  const handleDownload = async () => {
    if (!selectedImage) return;
    try {
      const response = await fetch(selectedImage.src);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedImage.title}.jpg`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      window.open(selectedImage.src, '_blank');
    }
  };

  const handleShare = async () => {
    if (!selectedImage) return;
    if (navigator.share) {
      try {
        await navigator.share({ title: selectedImage.title, text: selectedImage.description, url: window.location.href });
      } catch { /* user cancelled */ }
    } else {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
  };

  const navigateLightbox = (direction) => {
    const newIndex = direction === 'next'
      ? (lightboxIndex + 1) % filteredImages.length
      : (lightboxIndex - 1 + filteredImages.length) % filteredImages.length;
    setLightboxIndex(newIndex);
    setSelectedImage(filteredImages[newIndex]);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({ ...formData, image: file, imagePreview: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.imagePreview) {
      return;
    }
    const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    const newId = Date.now() + Math.floor(Math.random() * 1000);
    const newImage = {
      id: newId,
      src: formData.imagePreview,
      title: formData.title.trim(),
      category: formData.category,
      date: getCurrentDate(),
      location: formData.location.trim() || 'Location not specified',
      attendees: formData.attendees.trim() || 'Not specified',
      description: formData.description.trim(),
      tags: tagsArray
    };
    setAllImages(prevImages => [newImage, ...prevImages]);
    setFormData({ title: '', category: 'Events', description: '', tags: '', location: '', attendees: '', image: null, imagePreview: null });
    setShowAddImageModal(false);
  };

  const closeAddImageModal = () => {
    setFormData({ title: '', category: 'Events', description: '', tags: '', location: '', attendees: '', image: null, imagePreview: null });
    setShowAddImageModal(false);
  };

  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Media</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">Photo <span className="text-yellow-400">Gallery</span></h1>
            <p className="text-sm text-white/60 max-w-lg">Highlights from our events and collaborations.</p>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">{allImages.length || '0'}</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Photos</span>
            </div>
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">{categories.length - 1}</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Categories</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-[104px] z-40">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative flex-1 max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search photos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-gray-900 placeholder-gray-400 text-sm"
              />
            </div>
            <div className="flex gap-2 items-center w-full sm:w-auto justify-between sm:justify-end">
              <button
                onClick={() => setShowAddImageModal(true)}
                className="bg-black text-yellow-400 px-4 py-2.5 rounded-xl font-medium hover:bg-gray-900 transition-all flex items-center gap-2 text-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Add Photo</span>
              </button>
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-xl px-3 py-2.5 pr-8 text-gray-700 font-medium focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-sm min-w-[130px]"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category === 'All' ? 'All Photos' : category}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Grid */}
      <div className="max-w-6xl mx-auto px-6 py-6 pb-12">
        <div className="mb-5">
          <h2 className="text-lg font-bold text-gray-900">Gallery ({filteredImages.length})</h2>
        </div>

        {filteredImages.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white border border-gray-200 rounded-xl p-10 max-w-md mx-auto">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">No photos found</h3>
              <p className="text-sm text-gray-400">Try adjusting your search or filter</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4">
              {currentImages.map((image, index) => {
                const globalIndex = indexOfFirstImage + index;
                return (
                  <div
                    key={image.id}
                    className="group cursor-pointer"
                    onClick={() => openLightbox(image, globalIndex)}
                  >
                    <div className="relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                      <img
                        src={image.src}
                        alt={image.title}
                        className="w-full h-36 sm:h-52 lg:h-60 object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400" />
                      <div className="absolute top-2 right-2 bg-black/70 text-yellow-400 px-2 py-0.5 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-all duration-300">
                        {image.category}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-all duration-400 p-3">
                        <h3 className="text-white font-semibold text-xs mb-1 line-clamp-1">{image.title}</h3>
                        <p className="text-white/70 text-xs line-clamp-1">{image.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-10 pb-4">
                <div className="flex items-center gap-2 flex-wrap justify-center">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                  >
                    <span className="hidden sm:inline">Previous</span>
                    <ChevronLeft className="h-4 w-4 sm:hidden" />
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
                      return <span key={page} className="px-1 text-gray-400 text-sm">...</span>;
                    }
                    return null;
                  })}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="h-4 w-4 sm:hidden" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Image Modal */}
      {showAddImageModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-gray-900">Add New Photo</h2>
              <button onClick={closeAddImageModal} className="text-gray-400 hover:text-gray-700 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Image *</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center">
                  {formData.imagePreview ? (
                    <div className="relative">
                      <img src={formData.imagePreview} alt="Preview" className="max-w-full max-h-40 mx-auto rounded-lg" />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image: null, imagePreview: null })}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-400 mb-3">Click to upload (Max 10MB)</p>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="imageUpload" />
                      <label htmlFor="imageUpload" className="bg-yellow-400 text-black px-4 py-2 rounded-lg cursor-pointer hover:bg-yellow-300 transition-colors text-sm font-semibold">
                        Choose File
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1.5">Title *</label>
                <input
                  type="text" id="title" name="title" value={formData.title} onChange={handleInputChange}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-sm"
                  placeholder="Enter image title" required
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                <select
                  id="category" name="category" value={formData.category} onChange={handleInputChange}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-sm bg-white"
                >
                  {categories.filter(cat => cat !== 'All').map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date</label>
                <input type="text" value={getCurrentDate()} disabled className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 text-sm" />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1.5">Description *</label>
                <textarea
                  id="description" name="description" value={formData.description} onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-sm resize-none"
                  placeholder="Enter image description" required
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-1.5">Location</label>
                <input
                  type="text" id="location" name="location" value={formData.location} onChange={handleInputChange}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-sm"
                  placeholder="Enter location"
                />
              </div>

              <div>
                <label htmlFor="attendees" className="block text-sm font-semibold text-gray-700 mb-1.5">Attendees</label>
                <input
                  type="text" id="attendees" name="attendees" value={formData.attendees} onChange={handleInputChange}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-sm"
                  placeholder="e.g., 100+, 50 people"
                />
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-semibold text-gray-700 mb-1.5">Tags</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text" id="tags" name="tags" value={formData.tags} onChange={handleInputChange}
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-sm"
                    placeholder="Tags separated by commas"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={closeAddImageModal} className="px-5 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-black text-yellow-400 rounded-xl hover:bg-gray-900 transition-colors font-semibold text-sm">
                  Add Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/95 z-[99999999] flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 flex-shrink-0">
            <div className="bg-black/50 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
              {lightboxIndex + 1} / {filteredImages.length}
            </div>
            <button onClick={closeLightbox} className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2 sm:p-3 transition-all">
              <X className="h-5 sm:h-6 w-5 sm:w-6" />
            </button>
          </div>

          <div className="flex-1 relative flex items-center justify-center px-12 sm:px-16 min-h-0">
            {filteredImages.length > 1 && (
              <>
                <button
                  onClick={() => navigateLightbox('prev')}
                  className="absolute left-2 sm:left-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 sm:p-3 transition-all z-10"
                  style={{ top: '50%', transform: 'translateY(-50%)' }}
                >
                  <ChevronLeft className="h-5 sm:h-6 w-5 sm:w-6" />
                </button>
                <button
                  onClick={() => navigateLightbox('next')}
                  className="absolute right-2 sm:right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 sm:p-3 transition-all z-10"
                  style={{ top: '50%', transform: 'translateY(-50%)' }}
                >
                  <ChevronRight className="h-5 sm:h-6 w-5 sm:w-6" />
                </button>
              </>
            )}
            <img
              src={selectedImage.src}
              alt={selectedImage.title}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
          </div>

          <div className="flex-shrink-0 bg-gradient-to-t from-black/95 to-transparent px-4 pt-3 pb-5 sm:px-6 sm:pt-4 sm:pb-6">
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-white text-base sm:text-xl font-bold mb-1">{selectedImage.title}</h3>
                <p className="text-white/80 text-sm sm:text-base mb-2">{selectedImage.description}</p>
                <div className="flex flex-wrap gap-2 sm:gap-4 text-white/60 text-xs sm:text-sm">
                  <div className="flex items-center gap-1"><Calendar className="h-3 sm:h-4 w-3 sm:w-4" />{selectedImage.date}</div>
                  <div className="flex items-center gap-1"><MapPin className="h-3 sm:h-4 w-3 sm:w-4" />{selectedImage.location}</div>
                  <div className="flex items-center gap-1"><Users className="h-3 sm:h-4 w-3 sm:w-4" />{selectedImage.attendees}</div>
                </div>
                {selectedImage.tags && selectedImage.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
                    {selectedImage.tags.map((tag, index) => (
                      <span key={index} className="bg-yellow-400/20 text-yellow-400 px-2 py-1 rounded-full text-xs font-medium">#{tag}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`p-2 sm:p-3 rounded-full transition-all ${isLiked ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'}`}
                >
                  <Heart className={`h-4 sm:h-5 w-4 sm:w-5 ${isLiked ? 'fill-current' : ''}`} />
                </button>
                <button onClick={handleShare} className="p-2 sm:p-3 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all">
                  <Share2 className="h-4 sm:h-5 w-4 sm:w-5" />
                </button>
                <button onClick={handleDownload} className="p-2 sm:p-3 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all">
                  <Download className="h-4 sm:h-5 w-4 sm:w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
