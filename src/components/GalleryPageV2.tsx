import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, ChevronDown, Filter, X, ChevronLeft, ChevronRight, Download, Heart, Calendar, MapPin, Users, Plus, Upload, Tag, Eye, Camera, Grid3x3, List } from 'lucide-react';
import { fetchContent } from '../lib/mediaApi';
import ToolbarFilterDropdown from './common/ToolbarFilterDropdown';
import ShareMenu from './common/ShareMenu';

// Redesign of the real Gallery (was GalleryPage.tsx, plain white-card
// layout) into this session's established card anatomy (gold dotted
// background, dark stat bar, colored category ribbon, heart/save button,
// toolbar filter dropdown) applied directly to the real photo grid -
// per explicit user correction: not a separate category-hub page with a
// "View Gallery" button in front of it (that was GalleryHubV2, now
// retired), the new card design goes ON the real gallery itself.
// Every real behaviour is untouched and still lives in this file: CMS
// photos (fetchContent('gallery')) + localStorage-added photos, search,
// category filter, pagination, Add Photo modal, and the full lightbox
// (like/share/download, prev/next). Nothing here is fabricated - the
// category ribbon colors are decoration only, not new data.

const PAGE_BG: React.CSSProperties = {
  backgroundColor: '#ffd84d',
  backgroundImage: 'radial-gradient(circle, rgba(174,139,24,0.2) 1.5px, transparent 2px)',
  backgroundSize: '56px 56px',
};
const BTN = 'rounded-lg border border-slate-200 bg-white px-3 py-2 font-semibold shadow-sm hover:border-amber-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500';

const CAT_COLORS: Record<string, string> = {
  Events: '#dc2626',
  Collaborations: '#0369a1',
  Conferences: '#15803d',
  Interviews: '#7c3aed',
  'Product Launches': '#c2410c',
  'Team Photos': '#be123c',
};
function categoryColor(cat: string): string { return CAT_COLORS[cat] || '#475569'; }

interface GalleryImage {
  id: number;
  src: string;
  title: string;
  category: string;
  date?: string;
  location?: string;
  attendees?: string;
  description?: string;
  tags?: string[];
}

const GalleryPageV2: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showAddImageModal, setShowAddImageModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const isInitialLoad = useRef(true);

  const [formData, setFormData] = useState({
    title: '', category: 'Events', description: '', tags: '', location: '', attendees: '',
    image: null as File | null, imagePreview: null as string | null,
  });

  const imagesPerPage = 24;
  const categories = ['All', 'Events', 'Collaborations', 'Conferences', 'Interviews', 'Product Launches', 'Team Photos'];

  const defaultImages: GalleryImage[] = [
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

  const [allImages, setAllImages] = useState<GalleryImage[]>([]);
  const [cmsImages, setCmsImages] = useState<GalleryImage[]>([]);
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
    const controller = new AbortController();
    fetchContent('gallery', controller.signal).then(items => {
      if (items.length > 0) {
        const base = Date.now();
        setCmsImages(items.map((item, i) => ({
          id: base + i,
          src: item.imageUrl || '',
          title: item.title,
          category: item.category || 'Events',
          date: item.date || '',
          location: item.location || '',
          attendees: '',
          description: item.description || '',
          tags: item.tags || [],
        })));
      }
    }).catch(() => {});
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!isInitialLoad.current && allImages.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allImages));
      } catch { /* storage full, ignore */ }
    }
  }, [allImages]);

  const getCurrentDate = () => new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const displayImages = [...cmsImages, ...allImages];

  useEffect(() => {
    let filtered = [...displayImages];
    if (selectedCategory !== 'All') filtered = filtered.filter(image => image.category === selectedCategory);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(image =>
        image.title.toLowerCase().includes(q) ||
        (image.description || '').toLowerCase().includes(q) ||
        (image.location || '').toLowerCase().includes(q) ||
        (image.tags && image.tags.some(tag => tag.toLowerCase().includes(q)))
      );
    }
    filtered.sort((a, b) => b.id - a.id);
    setFilteredImages(filtered);
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, searchQuery, allImages, cmsImages]);

  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = filteredImages.slice(indexOfFirstImage, indexOfLastImage);
  const totalPages = Math.ceil(filteredImages.length / imagesPerPage);

  const openLightbox = (image: GalleryImage, globalIndex: number) => {
    setSelectedImage(image);
    setLightboxIndex(globalIndex);
    setIsLiked(false);
  };
  const closeLightbox = () => { setSelectedImage(null); setLightboxIndex(0); };

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

  const navigateLightbox = (direction: 'next' | 'prev') => {
    const newIndex = direction === 'next' ? (lightboxIndex + 1) % filteredImages.length : (lightboxIndex - 1 + filteredImages.length) % filteredImages.length;
    setLightboxIndex(newIndex);
    setSelectedImage(filteredImages[newIndex]);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) return;
      const reader = new FileReader();
      reader.onload = e => setFormData(f => ({ ...f, image: file, imagePreview: e.target?.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imagePreview) return;
    const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
    const newImage: GalleryImage = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      src: formData.imagePreview,
      title: formData.title.trim(),
      category: formData.category,
      date: getCurrentDate(),
      location: formData.location.trim() || 'Location not specified',
      attendees: formData.attendees.trim() || 'Not specified',
      description: formData.description.trim(),
      tags: tagsArray,
    };
    setAllImages(prev => [newImage, ...prev]);
    setFormData({ title: '', category: 'Events', description: '', tags: '', location: '', attendees: '', image: null, imagePreview: null });
    setShowAddImageModal(false);
  };

  const closeAddImageModal = () => {
    setFormData({ title: '', category: 'Events', description: '', tags: '', location: '', attendees: '', image: null, imagePreview: null });
    setShowAddImageModal(false);
  };

  const categoryCounts: Record<string, number> = {};
  displayImages.forEach(img => { categoryCounts[img.category] = (categoryCounts[img.category] || 0) + 1; });

  return (
    <div style={PAGE_BG} className="min-h-screen">
      <div className="mt-[108px]" />

      <section aria-label="Gallery statistics" className="flex min-h-[77px] flex-wrap items-center gap-3 bg-[#07130f] px-3 py-2 text-white sm:px-6">
        <div className="flex w-[calc(50%-0.5rem)] shrink-0 items-center gap-2 border-r border-yellow-500/25 pr-2 sm:w-[calc(33.333%-0.7rem)] xl:w-auto xl:min-w-[150px]">
          <Camera className="size-7 shrink-0 text-yellow-400" />
          <span className="flex flex-col"><small className="text-[10px] leading-tight">Total Photos</small><strong className="text-lg leading-tight text-yellow-300">{allImages.length.toLocaleString('en-IN')}</strong></span>
        </div>
        <div className="flex w-[calc(50%-0.5rem)] shrink-0 items-center gap-2 border-r border-yellow-500/25 pr-2 sm:w-[calc(33.333%-0.7rem)] xl:w-auto xl:min-w-[150px]">
          <Grid3x3 className="size-7 shrink-0 text-yellow-400" />
          <span className="flex flex-col"><small className="text-[10px] leading-tight">Categories</small><strong className="text-lg leading-tight text-yellow-300">{categories.length - 1}</strong></span>
        </div>
        <button type="button" onClick={() => setShowAddImageModal(true)} className="flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#ffdf00] px-4 text-sm font-extrabold text-black"><Plus className="size-4" /> Add Photo</button>
        <div className="ml-auto min-w-[200px] shrink-0 text-right">
          <strong className="block text-sm leading-tight text-yellow-300">DroneTv Photo Gallery</strong>
          <span className="block text-[11px] text-sky-300">Events · Community · Moments</span>
        </div>
      </section>

      <section style={PAGE_BG} className="flex flex-wrap items-center gap-2 px-3 py-3 sm:px-6">
        <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1">
          <button type="button" onClick={() => setSidebarOpen(true)} className={`${BTN} flex shrink-0 items-center gap-1 text-xs lg:hidden`}>Filters <ChevronDown className="size-4" /></button>
          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            <ToolbarFilterDropdown label="Category" options={categories.filter(c => c !== 'All')} selected={selectedCategory === 'All' ? [] : [selectedCategory]} onToggle={v => setSelectedCategory(v)} buttonClassName={`${BTN} flex items-center gap-4 text-xs`} />
          </div>
        </div>
        <label className="flex h-10 w-full items-center overflow-hidden rounded-lg border border-slate-200 bg-white md:w-[min(100%,360px)]">
          <span className="sr-only">Search photos</span>
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search photos, events, drone, GIS, AI, robotics..." className="min-w-0 flex-1 px-3 text-sm outline-none" />
          <span className="flex h-full w-11 items-center justify-center bg-[#ffdf00]"><Search className="size-5" /></span>
        </label>
      </section>

      <main className="mx-auto grid max-w-[2100px] grid-cols-1 items-start gap-3 px-3 py-4 sm:px-6 lg:grid-cols-[255px_minmax(0,1fr)]">
        <aside onClick={e => { if (e.target === e.currentTarget) setSidebarOpen(false); }} className={`${sidebarOpen ? 'fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4 lg:static lg:z-auto lg:bg-transparent lg:p-0' : 'hidden'} self-start lg:block`}>
          <div className={sidebarOpen ? 'mx-auto max-w-sm rounded-xl border border-yellow-300 bg-[#fffef0] p-4 shadow-sm lg:mx-0 lg:max-w-none' : 'rounded-xl border border-yellow-300 bg-[#fffef0] p-4 shadow-sm'}>
            <div className="mb-4 flex items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <h2 className="flex items-center gap-2 text-lg font-extrabold"><Filter className="size-5 text-yellow-500" /> Filters</h2>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => { setSelectedCategory('All'); setSearchQuery(''); setSidebarOpen(false); }} className="text-xs font-bold text-blue-800">Clear All</button>
                <button type="button" onClick={() => setSidebarOpen(false)} aria-label="Close filters" className="lg:hidden"><X className="size-5 text-slate-500" /></button>
              </div>
            </div>

            <section className="mb-4 border-b border-slate-200 pb-3">
              <h3 className="mb-3 text-xs font-extrabold">CATEGORY</h3>
              <div className="space-y-2">
                {categories.filter(c => c !== 'All').map(cat => (
                  <label key={cat} className="flex cursor-pointer items-center gap-2 text-xs">
                    <input type="radio" name="gallery-category" checked={selectedCategory === cat} onChange={() => setSelectedCategory(cat)} className="accent-amber-500" />
                    {cat} {categoryCounts[cat] ? `(${categoryCounts[cat]})` : ''}
                  </label>
                ))}
                <label className="flex cursor-pointer items-center gap-2 text-xs">
                  <input type="radio" name="gallery-category" checked={selectedCategory === 'All'} onChange={() => setSelectedCategory('All')} className="accent-amber-500" />
                  All Photos
                </label>
              </div>
            </section>

            <button type="button" onClick={() => setSidebarOpen(false)} className="w-full rounded-lg bg-yellow-400 py-2 text-xs font-bold lg:hidden">Apply Filters</button>
          </div>
        </aside>

        <section className="min-w-0">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h1 className="text-base font-extrabold">{filteredImages.length} {filteredImages.length === 1 ? 'Photo' : 'Photos'}{totalPages > 1 ? ` · Page ${currentPage} of ${totalPages}` : ''}</h1>
            <div className="flex gap-1">
              <button type="button" onClick={() => setView('grid')} aria-label="Grid view" className={`${view === 'grid' ? 'bg-slate-900 text-white' : 'bg-white'} rounded border px-2 py-1`}><Grid3x3 className="size-4" /></button>
              <button type="button" onClick={() => setView('list')} aria-label="List view" className={`${view === 'list' ? 'bg-slate-900 text-white' : 'bg-white'} rounded border px-2 py-1`}><List className="size-4" /></button>
            </div>
          </div>

          {filteredImages.length === 0 ? (
            <p className="rounded-lg bg-white p-8 text-center">No photos found. Try adjusting your filters.</p>
          ) : (
            <>
              <div className={`grid gap-3 ${view === 'list' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'}`}>
                {currentImages.map((image, index) => (
                  <GalleryCardV2 key={image.id} image={image} onOpen={() => openLightbox(image, indexOfFirstImage + index)} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-5 flex flex-wrap items-center justify-center gap-1.5">
                  <button type="button" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="grid h-9 min-w-9 place-items-center rounded-md border border-amber-300 bg-white text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft className="size-4" /></button>
                  {[...Array(totalPages)].map((_, i) => {
                    const pg = i + 1;
                    if (pg === currentPage || pg === 1 || pg === totalPages || (pg >= currentPage - 1 && pg <= currentPage + 1)) {
                      return <button key={pg} type="button" onClick={() => setCurrentPage(pg)} className={`grid h-9 min-w-9 place-items-center rounded-md border px-2 text-sm font-semibold shadow-sm ${pg === currentPage ? 'border-slate-900 bg-slate-900 text-white' : 'border-amber-300 bg-white text-slate-900 hover:bg-amber-50'}`}>{pg}</button>;
                    } else if (pg === currentPage - 2 || pg === currentPage + 2) {
                      return <span key={pg} className="px-1 self-center text-slate-400">…</span>;
                    }
                    return null;
                  })}
                  <button type="button" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="grid h-9 min-w-9 place-items-center rounded-md border border-amber-300 bg-white text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"><ChevronRight className="size-4" /></button>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <footer className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 bg-yellow-400 px-4 py-5 text-center text-sm font-semibold text-black lg:justify-between lg:px-6 lg:text-left">
        <strong>📣 Drone TV Expo 2026 - India&rsquo;s Biggest Drone Event</strong><span className="hidden lg:inline">│</span>
        <span>India&rsquo;s Drone Industry Platform</span><span className="hidden lg:inline">│</span>
        <span>Explore verified drone products &amp; services</span><span className="hidden lg:inline">│</span>
        <span>Connect │ Collaborate │ Grow</span>
      </footer>

      {/* Add Image Modal - unchanged real functionality */}
      {showAddImageModal && (
        <div className="fixed inset-0 z-[10000000] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Add New Photo</h2>
              <button onClick={closeAddImageModal} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Upload Image *</label>
                <div className="rounded-xl border-2 border-dashed border-slate-200 p-5 text-center">
                  {formData.imagePreview ? (
                    <div className="relative">
                      <img src={formData.imagePreview} alt="Preview" className="mx-auto max-h-40 max-w-full rounded-lg" />
                      <button type="button" onClick={() => setFormData(f => ({ ...f, image: null, imagePreview: null }))} className="absolute right-2 top-2 rounded-full bg-red-600 p-1 text-white hover:bg-red-700"><X className="h-3 w-3" /></button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="mx-auto mb-3 h-10 w-10 text-slate-300" />
                      <p className="mb-3 text-sm text-slate-500">Click to upload (Max 10MB)</p>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="imageUpload" />
                      <label htmlFor="imageUpload" className="cursor-pointer rounded-lg bg-yellow-400 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-yellow-300">Choose File</label>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="title" className="mb-1.5 block text-sm font-semibold text-slate-700">Title *</label>
                <input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400" placeholder="Enter image title" required />
              </div>

              <div>
                <label htmlFor="category" className="mb-1.5 block text-sm font-semibold text-slate-700">Category</label>
                <select id="category" name="category" value={formData.category} onChange={handleInputChange} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400">
                  {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Date</label>
                <input type="text" value={getCurrentDate()} disabled className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-400" />
              </div>

              <div>
                <label htmlFor="description" className="mb-1.5 block text-sm font-semibold text-slate-700">Description *</label>
                <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} rows={3} className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400" placeholder="Enter image description" required />
              </div>

              <div>
                <label htmlFor="location" className="mb-1.5 block text-sm font-semibold text-slate-700">Location</label>
                <input type="text" id="location" name="location" value={formData.location} onChange={handleInputChange} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400" placeholder="Enter location" />
              </div>

              <div>
                <label htmlFor="attendees" className="mb-1.5 block text-sm font-semibold text-slate-700">Attendees</label>
                <input type="text" id="attendees" name="attendees" value={formData.attendees} onChange={handleInputChange} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400" placeholder="e.g., 100+, 50 people" />
              </div>

              <div>
                <label htmlFor="tags" className="mb-1.5 block text-sm font-semibold text-slate-700">Tags</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input type="text" id="tags" name="tags" value={formData.tags} onChange={handleInputChange} className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400" placeholder="Tags separated by commas" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={closeAddImageModal} className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
                <button type="submit" className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-yellow-400 hover:bg-slate-800">Add Photo</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox - unchanged real functionality */}
      {selectedImage && (
        <div className="fixed inset-0 z-[99999999] flex flex-col bg-black/95">
          <div className="flex flex-shrink-0 items-center justify-between px-4 py-3">
            <div className="rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white sm:text-sm">{lightboxIndex + 1} / {filteredImages.length}</div>
            <button onClick={closeLightbox} className="rounded-full bg-white/20 p-2 text-white transition-all hover:bg-white/30 sm:p-3"><X className="h-5 w-5 sm:h-6 sm:w-6" /></button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-12 sm:px-16">
            {filteredImages.length > 1 && (
              <>
                <button onClick={() => navigateLightbox('prev')} className="absolute left-2 z-10 rounded-full bg-white/20 p-2 text-white transition-all hover:bg-white/30 sm:left-4 sm:p-3" style={{ top: '50%', transform: 'translateY(-50%)' }}><ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" /></button>
                <button onClick={() => navigateLightbox('next')} className="absolute right-2 z-10 rounded-full bg-white/20 p-2 text-white transition-all hover:bg-white/30 sm:right-4 sm:p-3" style={{ top: '50%', transform: 'translateY(-50%)' }}><ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" /></button>
              </>
            )}
            <img src={selectedImage.src} alt={selectedImage.title} className="max-h-full max-w-full rounded-lg object-contain shadow-2xl" />
          </div>

          <div className="flex-shrink-0 bg-gradient-to-t from-black/95 to-transparent px-4 pb-5 pt-3 sm:px-6 sm:pb-6 sm:pt-4">
            <div className="mx-auto flex max-w-4xl flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
              <div className="min-w-0 flex-1">
                <h3 className="mb-1 text-base font-bold text-white sm:text-xl">{selectedImage.title}</h3>
                <p className="mb-2 text-sm text-white/80 sm:text-base">{selectedImage.description}</p>
                <div className="flex flex-wrap gap-2 text-xs text-white/60 sm:gap-4 sm:text-sm">
                  {selectedImage.date && <div className="flex items-center gap-1"><Calendar className="h-3 w-3 sm:h-4 sm:w-4" />{selectedImage.date}</div>}
                  {selectedImage.location && <div className="flex items-center gap-1"><MapPin className="h-3 w-3 sm:h-4 sm:w-4" />{selectedImage.location}</div>}
                  {selectedImage.attendees && <div className="flex items-center gap-1"><Users className="h-3 w-3 sm:h-4 sm:w-4" />{selectedImage.attendees}</div>}
                </div>
                {selectedImage.tags && selectedImage.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5 sm:gap-2">
                    {selectedImage.tags.map((tag, i) => <span key={i} className="rounded-full bg-yellow-400/20 px-2 py-1 text-xs font-medium text-yellow-400">#{tag}</span>)}
                  </div>
                )}
              </div>
              <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3">
                <button onClick={() => setIsLiked(!isLiked)} className={`rounded-full p-2 transition-all sm:p-3 ${isLiked ? 'bg-red-600 text-white' : 'bg-white/20 text-white hover:bg-white/30'}`}><Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${isLiked ? 'fill-current' : ''}`} /></button>
                <ShareMenu url={window.location.href} title={selectedImage.title} buttonClassName="rounded-full bg-white/20 p-2 text-white transition-all hover:bg-white/30 sm:p-3" iconClassName="h-4 w-4 sm:h-5 sm:w-5" />
                <button onClick={handleDownload} className="rounded-full bg-white/20 p-2 text-white transition-all hover:bg-white/30 sm:p-3"><Download className="h-4 w-4 sm:h-5 sm:w-5" /></button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const GalleryCardV2: React.FC<{ image: GalleryImage; onOpen: () => void }> = ({ image, onOpen }) => {
  const [imgErr, setImgErr] = useState(false);
  const [liked, setLiked] = useState(false);
  return (
    <article onClick={onOpen} className="flex min-w-0 cursor-pointer flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-lg">
      <div className="relative h-40 shrink-0 overflow-hidden bg-slate-100">
        {!imgErr ? (
          <img src={image.src} alt={image.title} loading="lazy" onError={() => setImgErr(true)} className="h-full w-full object-cover object-center transition-transform duration-300 hover:scale-105" />
        ) : (
          <div className="flex h-full w-full items-center justify-center"><Camera className="size-10 text-slate-300" /></div>
        )}
        <span className="absolute left-3 top-3 rounded px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-white shadow" style={{ backgroundColor: categoryColor(image.category) }}>{image.category}</span>
        <button type="button" onClick={e => { e.stopPropagation(); setLiked(v => !v); }} aria-label={`Save ${image.title}`} aria-pressed={liked} className={`absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white shadow ${liked ? 'text-red-600' : 'text-red-500'}`}>
          <Heart className="size-4" fill={liked ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-1 text-sm font-extrabold leading-snug text-slate-900">{image.title}</h3>
        <p className="line-clamp-2 min-h-8 text-xs leading-[18px] text-slate-600">{image.description}</p>
        {(image.location || image.date) && (
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-500">
            {image.location && <span className="flex items-center gap-1"><MapPin className="size-3" />{image.location}</span>}
            {image.date && <span className="flex items-center gap-1"><Calendar className="size-3" />{image.date}</span>}
          </div>
        )}
        {image.tags && image.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {image.tags.slice(0, 3).map((t, i) => <span key={i} className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase text-blue-700">{t}</span>)}
          </div>
        )}
        <button type="button" onClick={e => { e.stopPropagation(); onOpen(); }} className="mt-auto flex items-center justify-center gap-1 rounded-lg border border-slate-300 bg-white py-2 text-xs font-bold text-slate-900 hover:border-amber-500">
          <Eye className="size-3.5" /> View Photo
        </button>
      </div>
    </article>
  );
};

export default GalleryPageV2;
