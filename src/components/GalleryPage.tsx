import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, X, ChevronLeft, ChevronRight, Download, Share2, Heart, Calendar, MapPin, Users, Plus, Upload, Tag } from 'lucide-react';

// Define TypeScript interfaces
interface ImageItem {
  id: number;
  src: string;
  title: string;
  category: string;
  date: string;
  location: string;
  attendees: string;
  description: string;
  tags?: string[];
}

interface FormData {
  title: string;
  category: string;
  description: string;
  tags: string;
  location: string;
  attendees: string;
  image: File | null;
  imagePreview: string | null;
}

const GalleryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredImages, setFilteredImages] = useState<ImageItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showAddImageModal, setShowAddImageModal] = useState(false);
  const [processedImages, setProcessedImages] = useState<Record<number, string>>({});
  const isInitialLoad = useRef(true);

  // Form state
  const [formData, setFormData] = useState<FormData>({
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
  const categories = ['All', 'Events', 'Collaborations', 'Conferences', 'Interviews', 'Product Launches', 'Team Photos', 'Gallery', 'Exhibition', 'Demonstration', 'Education', 'Media'];

  // Default images - these are the initial images
  const defaultImages: ImageItem[] = [
    {
      id: 1,
      src: "/images/1.jpg",
      title: "Tech Innovations Showcase",
      category: "Events",
      date: "July 10, 2023",
      location: "New York, NY",
      attendees: "100+",
      description: "Showcasing the latest innovations in drone technology.",
      tags: ["dev", "Pranay"]
    },
    {
      id: 2,
      src: "/images/2.jpg",
      title: "Global Partnerships Panel",
      category: "Events",
      date: "July 12, 2023",
      location: "London, UK",
      attendees: "120+",
      description: "Discussing strategic partnerships in the drone industry.",
      tags: ["dev"]
    },
    {
      id: 3,
      src: "/images/3.jpg",
      title: "Drone Education Summit",
      category: "Events",
      date: "July 15, 2023",
      location: "Berlin, Germany",
      attendees: "150+",
      description: "Gathering experts to discuss the future of drone education.",
      tags: ["dev", "payal", "pallavi", "supriya", "sandeep", "vamsi", "pranay"]
    },
    {
      id: 4,
      src: "/images/4.jpg",
      title: "Aerial Imaging Workshop",
      category: "Events",
      date: "July 18, 2023",
      location: "Chicago, IL",
      attendees: "85+",
      description: "Practical hands-on experience in aerial image processing.",
      tags: ["pranay", "dev", "sandeep"]
    },
    {
      id: 5,
      src: "/images/5.jpg",
      title: "Drone Security and Safety Workshop",
      category: "Events",
      date: "July 20, 2023",
      location: "Sydney, Australia",
      attendees: "80+",
      description: "Focusing on safety protocols and security in drone operations.",
      tags: ["vamsi"]
    },
    {
      id: 6,
      src: "/images/6.jpg",
      title: "UAV Industry Trends",
      category: "Events",
      date: "July 22, 2023",
      location: "Virtual",
      attendees: "150+",
      description: "Analyzing the latest trends and innovations in the UAV industry.",
      tags: ["dev", "pranay"]
    },
    {
      id: 7,
      src: "/images/7.jpg",
      title: "Drone Photography Challenge",
      category: "Events",
      date: "July 25, 2023",
      location: "Bangkok, Thailand",
      attendees: "60+",
      description: "Competition on drone-based creative photography.",
      tags: ["dev", "pranay"]
    },
    {
      id: 8,
      src: "/images/8.jpg",
      title: "Autonomous Drone Operations Seminar",
      category: "Events",
      date: "July 28, 2023",
      location: "Singapore",
      attendees: "120+",
      description: "Discussing the future of autonomous drone systems.",
      tags: ["dev"]
    },
    {
      id: 9,
      src: "/images/9.jpg",
      title: "Drone Surveying and Mapping Workshop",
      category: "Events",
      date: "August 1, 2023",
      location: "Paris, France",
      attendees: "90+",
      description: "Hands-on workshop focusing on drone surveying techniques.",
      tags: ["dev"]
    },
    {
      id: 10,
      src: "/images/10.jpg",
      title: "Future of Aerial Imaging Conference",
      category: "Events",
      date: "August 5, 2023",
      location: "Tokyo, Japan",
      attendees: "300+",
      description: "A deep dive into the future of aerial imaging and its applications.",
      tags: ["dev"]
    },
    {
      id: 11,
      src: "/images/11.jpg",
      title: "AgriTech Drone Solutions Meet",
      category: "Events",
      date: "August 8, 2023",
      location: "Ahmedabad, India",
      attendees: "110+",
      description: "Innovative drone solutions for agriculture and spraying.",
      tags: ["dev", "pranay"]
    },
    {
      id: 12,
      src: "/images/12.jpg",
      title: "Drone Delivery Solutions Expo",
      category: "Events",
      date: "August 12, 2023",
      location: "Dubai, UAE",
      attendees: "250+",
      description: "Exploring the latest advancements in drone delivery solutions.",
      tags: ["dev"]
    },
    {
      id: 13,
      src: "/images/13.jpg",
      title: "Drone Industry Roundtable",
      category: "Events",
      date: "August 15, 2023",
      location: "Los Angeles, CA",
      attendees: "70+",
      description: "Industry leaders discuss the future of the drone market.",
      tags: ["vamsi", "payal"]
    },
    {
      id: 14,
      src: "/images/14.jpg",
      title: "Geospatial Data and UAV Integration",
      category: "Events",
      date: "August 17, 2023",
      location: "Virtual",
      attendees: "130+",
      description: "Webinar on integrating UAVs with geospatial data for mapping.",
      tags: ["vamsi", "dev"]
    },
    {
      id: 15,
      src: "/images/15.jpg",
      title: "Drone Technology Innovations Showcase",
      category: "Events",
      date: "August 20, 2023",
      location: "San Francisco, CA",
      attendees: "200+",
      description: "A showcase of the latest innovations in drone technology.",
      tags: ["dev"]
    },
    {
      id: 16,
      src: "/images/16.jpg",
      title: "Disaster Management with UAVs",
      category: "Events",
      date: "August 23, 2023",
      location: "Chennai, India",
      attendees: "140+",
      description: "Utilizing UAVs in emergency response and disaster zones.",
      tags: ["dev"]
    },
    {
      id: 17,
      src: "/images/17.jpg",
      title: "Women in Drone Technology",
      category: "Events",
      date: "August 25, 2023",
      location: "Pune, India",
      attendees: "100+",
      description: "Celebrating women professionals in the UAV industry.",
      tags: ["dev", "pranay", "sandeep"]
    },
    {
      id: 18,
      src: "/images/18.jpg",
      title: "Drones in Environmental Conservation Expo",
      category: "Events",
      date: "September 5, 2023",
      location: "Berlin, Germany",
      attendees: "80+",
      description: "Exploring the use of drones in environmental conservation efforts.",
      tags: ["dev", "vamsi"]
    },
    {
      id: 19,
      src: "/images/19.jpg",
      title: "Autonomous Drone Systems Workshop",
      category: "Events",
      date: "September 10, 2023",
      location: "Paris, France",
      attendees: "60+",
      description: "Hands-on workshop on autonomous drone technologies.",
      tags: ["vamsi"]
    },
    {
      id: 21,
      src: "/images/21.jpg",
      title: "UAV Innovations and Safety Conference",
      category: "Events",
      date: "September 20, 2023",
      location: "Sydney, Australia",
      attendees: "250+",
      description: "Focusing on UAV innovations and safety standards.",
      tags: ["dev", "payal", "pallavi", "supriya", "sandeep", "vamsi", "pranay"]
    },
    {
      id: 22,
      src: "/images/22.jpg",
      title: "Drone Journalism and Media Session",
      category: "Events",
      date: "September 25, 2023",
      location: "Mumbai, India",
      attendees: "75+",
      description: "Exploring the role of drones in journalism and broadcasting.",
      tags: ["dev", "vamsi"]
    },
    {
      id: 23,
      src: "/images/23.jpg",
      title: "AI Integration in Drone Systems",
      category: "Events",
      date: "September 28, 2023",
      location: "Seoul, South Korea",
      attendees: "180+",
      description: "Leveraging AI to improve autonomous drone behavior.",
      tags: ["dev", "pranay", "sandeep"]
    },
    {
      id: 24,
      src: "/images/24.jpg",
      title: "Youth Drone Bootcamp",
      category: "Events",
      date: "October 2, 2023",
      location: "Hyderabad, India",
      attendees: "90+",
      description: "Drone training and awareness for young enthusiasts.",
      tags: ["dev", "pranay"]
    },
    {
      id: 25,
      src: "/images/25.jpg",
      title: "Drone AI & Geospatial Data Forum",
      category: "Events",
      date: "October 5, 2023",
      location: "Singapore",
      attendees: "160+",
      description: "Discussing convergence of AI and GIS in drone workflows.",
      tags: ["dev", "vamsi", "sandeep", "pranay"]
    },
    {
      id: 26,
      src: "/images/1.png",
      title: "DroneWorld Conference 2024 Opening Ceremony",
      category: "Collaborations",
      date: "March 15, 2024",
      location: "San Francisco, CA",
      attendees: "2,500+",
      description: "Grand opening ceremony of the largest drone technology conference with industry leaders.",
      tags: ["Teja", "Dev"]
    },
    {
      id: 27,
      src: "/images/2.png",
      title: "AI Partnership Announcement",
      category: "Interviews",
      date: "February 20, 2024",
      location: "Seattle, WA",
      attendees: "150+",
      description: "Strategic partnership announcement with leading AI technology companies.",
      tags: ["Dev"]
    },
    {
      id: 28,
      src: "/images/3.png",
      title: "GIS Mapping Workshop Session",
      category: "Interviews",
      date: "January 28, 2024",
      location: "Austin, TX",
      attendees: "200+",
      description: "Hands-on workshop demonstrating advanced GIS mapping techniques."
    },
    {
      id: 29,
      src: "/images/4.png",
      title: "Drone Technology Exhibition",
      category: "Interviews",
      date: "March 16, 2024",
      location: "San Francisco, CA",
      attendees: "3,000+",
      description: "Latest drone technology showcase with live demonstrations.",
      tags: ["Gosharpener"]
    },
    {
      id: 30,
      src: "/images/5.png",
      title: "Industry Leaders Panel Discussion",
      category: "Interviews",
      date: "March 17, 2024",
      location: "San Francisco, CA",
      attendees: "1,500+",
      description: "Panel discussion with top executives from leading drone companies."
    },
    {
      id: 31,
      src: "/images/6.png",
      title: "New Product Launch Event",
      category: "Interviews",
      date: "February 10, 2024",
      location: "Los Angeles, CA",
      attendees: "800+",
      description: "Exclusive launch event for the latest drone technology innovations."
    },
    {
      id: 32,
      src: "/images/7.png",
      title: "Team Building Retreat",
      category: "Team Photos",
      date: "January 15, 2024",
      location: "Napa Valley, CA",
      attendees: "50+",
      description: "Annual team building retreat with outdoor activities and team bonding.",
      tags: ["Dev", "Pushpak"]
    },
    {
      id: 33,
      src: "/images/8.png",
      title: "University Partnership Signing",
      category: "Events",
      date: "December 20, 2023",
      location: "Boston, MA",
      attendees: "100+",
      description: "Partnership agreement signing with leading universities for research collaboration.",
      tags: ["Vamsi", "Pushpak"]
    },
    {
      id: 34,
      src: "/images/9.png",
      title: "Drone Safety Training Workshop",
      category: "Events",
      date: "November 30, 2023",
      location: "Denver, CO",
      attendees: "300+",
      description: "Comprehensive safety training workshop for drone operators and pilots.",
      tags: ["Dev", "Sandeep", "Ramesh"]
    },
    {
      id: 35,
      src: "/images/10.png",
      title: "International Drone Summit",
      category: "Events",
      date: "October 25, 2023",
      location: "New York, NY",
      attendees: "2,000+",
      description: "Global summit bringing together international drone technology experts.",
      tags: ["Dev"]
    },
    {
      id: 36,
      src: "/images/11.png",
      title: "Startup Collaboration Meetup",
      category: "Collaborations",
      date: "September 15, 2023",
      location: "Silicon Valley, CA",
      attendees: "250+",
      description: "Networking event connecting startups with established drone companies.",
      tags: ["Dev", "Pranay"]
    },
    {
      id: 37,
      src: "/images/12.png",
      title: "Annual Company Celebration",
      category: "Interviews",
      date: "August 20, 2023",
      location: "San Francisco, CA",
      attendees: "200+",
      description: "Annual company celebration recognizing achievements and milestones."
    },
    {
      id: 38,
      src: "/images/13.png",
      title: "Environmental Monitoring Conference",
      category: "Events",
      date: "July 18, 2023",
      location: "Portland, OR",
      attendees: "900+",
      description: "Conference focused on drone applications in environmental monitoring.",
      tags: ["Dev", "Pallavi"]
    },
    {
      id: 39,
      src: "/images/14.png",
      title: "Racing Drone Championship",
      category: "Collaborations",
      date: "June 25, 2023",
      location: "Las Vegas, NV",
      attendees: "5,000+",
      description: "International drone racing championship with live competitions.",
      tags: ["Dev", "Gowrav Reddy"]
    },
    {
      id: 40,
      src: "/images/15.png",
      title: "AI Research Collaboration",
      category: "Team Photos",
      date: "May 30, 2023",
      location: "Cambridge, MA",
      attendees: "75+",
      description: "Research collaboration announcement with MIT AI Lab.",
      tags: ["Dev"]
    },
    {
      id: 41,
      src: "/images/16.png",
      title: "Precision Agriculture Workshop",
      category: "Interviews",
      date: "April 22, 2023",
      location: "Iowa City, IA",
      attendees: "180+",
      description: "Workshop on precision agriculture applications using drone technology.",
      tags: ["Sakthivelan"]
    },
    {
      id: 42,
      src: "/images/17.png",
      title: "Drone Delivery Demo Day",
      category: "Interviews",
      date: "March 28, 2023",
      location: "Phoenix, AZ",
      attendees: "600+",
      description: "Live demonstration of autonomous drone delivery systems.",
      tags: ["Dr. Nirranjan Kumar Gupta"]
    },
    {
      id: 43,
      src: "/images/18.png",
      title: "Holiday Team Party",
      category: "Team Photos",
      date: "December 15, 2022",
      location: "San Francisco, CA",
      attendees: "120+",
      description: "Annual holiday celebration with the entire Drone TV team.",
      tags: ["Dr. Nirranjan Kumar Gupta", "Dev"]
    },
    {
      id: 44,
      src: "/images/19.png",
      title: "Government Partnership Forum",
      category: "Events",
      date: "November 10, 2022",
      location: "Washington, DC",
      attendees: "300+",
      description: "Forum discussing government partnerships in drone technology."
    },
    {
      id: 45,
      src: "/images/20.png",
      title: "Advanced Pilot Training",
      category: "Collaborations",
      date: "October 5, 2022",
      location: "Miami, FL",
      attendees: "150+",
      description: "Advanced pilot training program for commercial drone operators.",
      tags: ["Dev", "Ajitha Surabhi"]
    },
    {
      id: 46,
      src: "/images/21.png",
      title: "Tech Innovation Showcase",
      category: "Events",
      date: "September 20, 2022",
      location: "Austin, TX",
      attendees: "1,800+",
      description: "Showcase of the latest innovations in drone and AI technology.",
      tags: ["Dev", "Payal", "vamsi"]
    },
    {
      id: 47,
      src: "/images/22.png",
      title: "European Expansion Launch",
      category: "Conferences",
      date: "August 15, 2022",
      location: "London, UK",
      attendees: "400+",
      description: "Official launch of Drone TV's expansion into European markets.",
      tags: ["Dev", "Rini Bansal"]
    },
    {
      id: 48,
      src: "/images/23.png",
      title: "Mapping Technology Conference",
      category: "Interviews",
      date: "July 8, 2022",
      location: "Denver, CO",
      attendees: "1,200+",
      description: "Conference focused on advances in drone mapping technology.",
      tags: ["Dev", "MGR"]
    },
    {
      id: 49,
      src: "/images/25.png",
      title: "Company Milestone Celebration",
      category: "Interviews",
      date: "June 1, 2022",
      location: "San Francisco, CA",
      attendees: "80+",
      description: "Celebrating major company milestones and achievements.",
      tags: ["Rini Bansal"]
    },
    // New images (IDs 50-74)
    {
      id: 51,
      src: "/images/NAG_9983.jpg",
      title: "Drone Showcase",
      category: "Gallery",
      date: "September 2025",
      location: "Mumbai, India",
      attendees: "N/A",
      description: "Drone display session featuring advanced UAV technology.",
      tags: ["Amar"]
    },
    {
      id: 52,
      src: "/images/NAG_9940.jpg",
      title: "Interactive Session",
      category: "Interviews",
      date: "September 2025",
      location: "Mumbai, India",
      attendees: "N/A",
      description: "One-on-one interaction with exhibitors and drone innovators.",
      tags: ["DroneTV"]
    },
    {
      id: 53,
      src: "/images/NAG_0042.jpg",
      title: "Exhibitor Booths",
      category: "Exhibition",
      date: "September 2025",
      location: "Mumbai, India",
      attendees: "N/A",
      description: "Showcasing drone hardware and software solutions from leading brands.",
      tags: ["DroneTV"]
    },
    {
      id: 54,
      src: "/images/NAG_0024.jpg",
      title: "Drone Demo",
      category: "Demonstration",
      date: "September 2025",
      location: "Mumbai, India",
      attendees: "N/A",
      description: "Live drone flight demonstration at the Drone Expo ground.",
      tags: ["DroneTV"]
    },
    {
      id: 55,
      src: "/images/NAG_0005.jpg",
      title: "Visitors Interaction",
      category: "Gallery",
      date: "September 2025",
      location: "Mumbai, India",
      attendees: "N/A",
      description: "Attendees exploring new drone technologies and interacting with experts.",
      tags: ["DroneTV"]
    },
    {
      id: 56,
      src: "/images/ASJ07458.jpg",
      title: "Drone Launch",
      category: "Product Launch",
      date: "September 2025",
      location: "Mumbai, India",
      attendees: "N/A",
      description: "Official unveiling of a new commercial UAV at Drone Expo 2025.",
      tags: ["DroneTV"]
    },
    {
      id: 57,
      src: "/images/ASJ07430.jpg",
      title: "Panel Discussion",
      category: "Conference",
      date: "September 2025",
      location: "Mumbai, India",
      attendees: "N/A",
      description: "Industry leaders discussing drone regulations and opportunities.",
      tags: ["DroneTV"]
    },
    {
      id: 58,
      src: "/images/ASJ07352.jpg",
      title: "Networking Session",
      category: "Event",
      date: "September 2025",
      location: "Mumbai, India",
      attendees: "N/A",
      description: "Professionals connecting and sharing ideas in the UAV industry.",
      tags: ["DroneTV"]
    },
    {
      id: 59,
      src: "/images/NAG_0429.jpg",
      title: "Drone Display Zone",
      category: "Exhibition",
      date: "September 2025",
      location: "Mumbai, India",
      attendees: "N/A",
      description: "Large-scale display of agricultural and defense drones.",
      tags: ["DroneTV"]
    },
    {
      id: 60,
      src: "/images/NAG_0435.jpg",
      title: "Training Awareness",
      category: "Education",
      date: "September 2025",
      location: "Mumbai, India",
      attendees: "N/A",
      description: "Promoting DGCA-certified pilot training at India Drone Academy booth.",
      tags: ["India Drone Academy"]
    },
    {
      id: 61,
      src: "/images/NAG_0443.jpg",
      title: "Live Demonstration",
      category: "Demonstration",
      date: "September 2025",
      location: "Mumbai, India",
      attendees: "N/A",
      description: "Drone simulation and field demonstration conducted for visitors.",
      tags: ["Drone Simulator Pro"]
    },
    {
      id: 62,
      src: "/images/NAG_0245.jpg",
      title: "Industry Showcase",
      category: "Gallery",
      date: "September 2025",
      location: "Mumbai, India",
      attendees: "N/A",
      description: "Various UAV industry applications displayed during the expo.",
      tags: ["DroneTV"]
    },
    {
      id: 63,
      src: "/images/NAG_0089.jpg",
      title: "Expo Entry Zone",
      category: "Event",
      date: "September 2025",
      location: "Mumbai, India",
      attendees: "N/A",
      description: "Attendees arriving at the Drone Expo 2025 entry pavilion.",
      tags: ["DroneTV"]
    },
    {
      id: 64,
      src: "/images/_SKJ9808.jpg",
      title: "Keynote Session",
      category: "Conference",
      date: "September 2025",
      location: "Mumbai, India",
      attendees: "N/A",
      description: "Keynote speakers addressing drone innovation and growth.",
      tags: ["DroneTV"]
    },
    {
      id: 65,
      src: "/images/_SKJ9803.jpg",
      title: "Exhibitor Interaction",
      category: "Gallery",
      date: "September 2025",
      location: "Mumbai, India",
      attendees: "N/A",
      description: "Exhibitors engaging with DroneTV crew for interviews.",
      tags: ["DroneTV"]
    },
    {
      id: 66,
      src: "/images/_SKJ9770.jpg",
      title: "Aerial Footage Capture",
      category: "Media",
      date: "September 2025",
      location: "Mumbai, India",
      attendees: "N/A",
      description: "Behind-the-scenes media capture for DroneTV coverage.",
      tags: ["DroneTV"]
    },
    {
      id: 67,
      src: "/images/_SKJ9765.jpg",
      title: "Panel Interaction",
      category: "Conference",
      date: "September 2025",
      location: "Mumbai, India",
      attendees: "N/A",
      description: "Drone industry experts engaging in panel discussions.",
      tags: ["DroneTV"]
    },
    {
      id: 68,
      src: "/images/_SKJ9694.jpg",
      title: "Product Display",
      category: "Exhibition",
      date: "September 2025",
      location: "Mumbai, India",
      attendees: "N/A",
      description: "Latest drone products and accessories displayed.",
      tags: ["DroneTV"]
    },
    {
      id: 69,
      src: "/images/NAG_9927.jpg",
      title: "Delegates Visit",
      category: "Event",
      date: "September 2025",
      location: "Mumbai, India",
      attendees: "N/A",
      description: "Delegates and guests visiting the DroneTV booth.",
      tags: ["DroneTV"]
    },
    {
      id: 70,
      src: "/images/NAG_9669.jpg",
      title: "Drone Showcase Zone",
      category: "Exhibition",
      date: "September 2025",
      location: "Mumbai, India",
      attendees: "N/A",
      description: "Professional drones showcased for industrial applications.",
      tags: ["DroneTV"]
    },
    {
      id: 71,
      src: "/images/_SKJ9421.jpg",
      title: "Team Interaction",
      category: "Gallery",
      date: "September 2025",
      location: "Mumbai, India",
      attendees: "N/A",
      description: "DroneTV production team interacting with exhibitors.",
      tags: ["DroneTV"]
    },
    {
      id: 72,
      src: "/images/_SKJ9409.jpg",
      title: "Crowd Engagement",
      category: "Event",
      date: "September 2025",
      location: "Mumbai, India",
      attendees: "N/A",
      description: "Visitors exploring drone technology zones at the expo.",
      tags: ["DroneTV"]
    },
    {
      id: 73,
      src: "/images/_SKJ9405.jpg",
      title: "Booth Showcase",
      category: "Exhibition",
      date: "September 2025",
      location: "Mumbai, India",
      attendees: "N/A",
      description: "Interactive booths by top drone training organizations.",
      tags: ["DroneTV"]
    },
    {
      id: 74,
      src: "/images/_SKJ9401.jpg",
      title: "Closing Ceremony",
      category: "Event",
      date: "September 2025",
      location: "Mumbai, India",
      attendees: "N/A",
      description: "Final moments of Drone Expo 2025 with media highlights.",
      tags: ["DroneTV"]
    }
  ];

  const [allImages, setAllImages] = useState<ImageItem[]>(defaultImages); // Use defaultImages directly

  // Watermark helper function
  async function bakeThumbWatermark(
    src: string,
    targetW = 1200,
    targetH = 675,
    logoSrc = '/images/logo.png' // Path to your logo image for watermark
  ): Promise<string> {
    try {
      const res = await fetch(src, { mode: 'cors', cache: 'force-cache' });
      if (!res.ok || res.type === 'opaque') throw new Error('CORS blocked');
      const bmp = await createImageBitmap(await res.blob());
      // Cover scaling
      const scale = Math.max(targetW / bmp.width, targetH / bmp.height);
      const drawW = Math.round(bmp.width * scale);
      const drawH = Math.round(bmp.height * scale);
      const dx = Math.round((targetW - drawW) / 2); // center crop
      const dy = Math.round((targetH - drawH) / 2);
      const c = document.createElement('canvas');
      c.width = targetW;
      c.height = targetH;
      const ctx = c.getContext('2d')!;
      // Draw the image
      ctx.drawImage(bmp, dx, dy, drawW, drawH);
      // Add watermark (logo image)
      const logo = new Image();
      logo.src = logoSrc;
      await new Promise((resolve) => {
        logo.onload = resolve;
      });
      // Calculate watermark size (20% of image width)
      const logoWidth = Math.min(targetW * 0.2, logo.width);
      const logoHeight = (logoWidth / logo.width) * logo.height;
      // Position watermark at bottom-right corner with margin
      const margin = 16;
      const x = targetW - logoWidth - margin;
      const y = targetH - logoHeight - margin;
      ctx.globalAlpha = 0.65;
      ctx.drawImage(logo, x, y, logoWidth, logoHeight); // Draw watermark logo
      return c.toDataURL('image/png');
    } catch (error) {
      console.error(`Error processing image ${src}:`, error);
      // Return original source if watermark fails
      return src;
    }
  }

  // Process images to add watermarks when allImages changes
  useEffect(() => {
    const processAllImages = async () => {
      const processed: Record<number, string> = {};
      const promises = allImages.map(async (image) => {
        try {
          // Only process if it's not a data URL (uploaded image)
          if (!image.src.startsWith('data:image')) {
            const watermarked = await bakeThumbWatermark(image.src);
            processed[image.id] = watermarked;
          } else {
            processed[image.id] = image.src; // For uploaded images, use as is
          }
        } catch (error) {
          console.error(`Failed to process image ${image.id}:`, error);
          processed[image.id] = image.src; // Fallback to original
        }
      });
      await Promise.all(promises);
      setProcessedImages(processed);
    };
    processAllImages();
  }, [allImages]);

  // Get current date in readable format
  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Filter and search logic
  useEffect(() => {
    let filtered = [...allImages]; // Create a copy to avoid mutations

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(image => image.category === selectedCategory);
    }

    // Filter by search query (tags and other fields)
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(image =>
        image.title.toLowerCase().includes(lowerQuery) ||
        image.description.toLowerCase().includes(lowerQuery) ||
        image.location.toLowerCase().includes(lowerQuery) ||
        (image.tags && image.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
      );
    }

    // Sort by ID (most recent first)
    filtered.sort((a, b) => b.id - a.id);
    setFilteredImages(filtered);
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, allImages]);

  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = filteredImages.slice(indexOfFirstImage, indexOfLastImage);
  const totalPages = Math.ceil(filteredImages.length / imagesPerPage);

  const openLightbox = (image: ImageItem, globalIndex: number) => {
    setSelectedImage(image);
    setLightboxIndex(globalIndex);
    setIsLiked(false);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    setLightboxIndex(0);
  };

  const navigateLightbox = (direction: 'next' | 'prev') => {
    const newIndex = direction === 'next'
      ? (lightboxIndex + 1) % filteredImages.length
      : (lightboxIndex - 1 + filteredImages.length) % filteredImages.length;
    setLightboxIndex(newIndex);
    setSelectedImage(filteredImages[newIndex]);
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage) { // Only handle if lightbox is open
        if (e.key === 'ArrowRight') {
          navigateLightbox('next');
        } else if (e.key === 'ArrowLeft') {
          navigateLightbox('prev');
        } else if (e.key === 'Escape') {
          closeLightbox();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedImage, lightboxIndex, filteredImages]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({
          ...formData,
          image: file,
          imagePreview: e.target.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate required fields
    if (!formData.title.trim() || !formData.description.trim() || !formData.imagePreview) {
      alert('Please fill in all required fields (Title, Description) and upload an image.');
      return;
    }

    // Create tags array from comma-separated string
    const tagsArray = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '');

    // Generate unique ID based on timestamp and random number
    const newId = Date.now() + Math.floor(Math.random() * 1000);

    // Create new image object
    const newImage: ImageItem = {
      id: newId,
      src: formData.imagePreview, // For uploaded images, use data URL directly
      title: formData.title.trim(),
      category: formData.category,
      date: getCurrentDate(),
      location: formData.location.trim() || 'Location not specified',
      attendees: formData.attendees.trim() || 'Not specified',
      description: formData.description.trim(),
      tags: tagsArray
    };

    // Add new image to the beginning of the array
    setAllImages(prevImages => [newImage, ...prevImages]);

    // Reset form
    setFormData({
      title: '',
      category: 'Events',
      description: '',
      tags: '',
      location: '',
      attendees: '',
      image: null,
      imagePreview: null
    });

    // Close modal
    setShowAddImageModal(false);

    // Show success message
    alert('Image added successfully!');
  };

  // Reset form when modal closes
  const closeAddImageModal = () => {
    setFormData({
      title: '',
      category: 'Events',
      description: '',
      tags: '',
      location: '',
      attendees: '',
      image: null,
      imagePreview: null
    });
    setShowAddImageModal(false);
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
            Photo Gallery
          </h1>
          <p className="text-xl text-black/80 max-w-2xl mx-auto mb-4">
            Highlights from our events and collaborations.
          </p>
          <div className="w-24 h-1 bg-black mx-auto rounded-full"></div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-3 sm:py-4 bg-yellow-400 sticky top-16 z-40 border-b border-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-xs w-full order-1 sm:order-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black/60" />
              <input
                type="text"
                placeholder="Search photos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-lg border-2 border-black/20 bg-yellow-200 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/40 text-black placeholder-black/60 font-medium text-sm transition-all duration-300"
              />
            </div>
            <div className="flex gap-2 sm:gap-3 items-center w-full sm:w-auto justify-between sm:justify-end order-2 sm:order-2">
              {/* Add Image Button */}
              <button
                onClick={() => setShowAddImageModal(true)}
                className="bg-black text-yellow-400 px-3 sm:px-4 py-2 rounded-xl font-medium hover:bg-black/90 transition-all duration-300 flex items-center gap-2 text-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Gallery</span>
              </button>
              {/* Category Filter */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none bg-yellow-200 backdrop-blur-sm border-2 border-black/20 rounded-xl px-3 py-2 pr-8 text-black font-medium focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/40 text-sm transition-all duration-300 min-w-[120px]"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'All' ? 'All Photos' : category}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black/60 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Grid Section */}
      <section className="py-4 sm:py-6 bg-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Gallery Title */}
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-black">Gallery ({filteredImages.length})</h2>
          </div>

          {filteredImages.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 sm:p-12 max-w-md mx-auto">
                <Search className="h-12 sm:h-16 w-12 sm:w-16 text-black/40 mx-auto mb-4" />
                <h3 className="text-xl sm:text-2xl font-bold text-black mb-2">No photos found</h3>
                <p className="text-black/60 text-sm sm:text-base">Try adjusting your search or filter</p>
              </div>
            </div>
          ) : (
            <>
              {/* Gallery Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {currentImages.map((image, index) => {
                  const globalIndex = indexOfFirstImage + index;
                  return (
                    <div
                      key={image.id}
                      className="group cursor-pointer"
                      onClick={() => openLightbox(image, globalIndex)}
                      style={{
                        animationDelay: `${index * 50}ms`,
                        animation: `fadeInUp 0.6s ease-out ${index * 50}ms both`
                      }}
                    >
                      <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
                        <img
                          src={processedImages[image.id] || image.src}
                          alt={image.title}
                          className="w-full h-48 sm:h-56 lg:h-64 object-cover transition-all duration-700 group-hover:scale-110"
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                        <div className="absolute top-3 right-3 bg-black/80 text-yellow-400 px-2 py-1 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-all duration-500">
                          {image.category}
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 p-4">
                          <h3 className="text-white font-semibold text-sm mb-1">{image.title}</h3>
                          <p className="text-white/80 text-xs line-clamp-2">{image.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination - Centered at bottom */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8 sm:mt-12 pb-8">
                  <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 sm:px-4 py-2 rounded-xl bg-white/80 backdrop-blur-sm border-2 border-black/20 text-black font-medium hover:bg-white hover:border-black/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-sm"
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
                            className={`px-3 sm:px-4 py-2 rounded-xl font-medium transition-all duration-300 text-sm ${page === currentPage
                              ? 'bg-black text-yellow-400 border-2 border-black'
                              : 'bg-white/80 backdrop-blur-sm border-2 border-black/20 text-black hover:bg-white hover:border-black/40'
                              }`}
                          >
                            {page}
                          </button>
                        );
                      } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return <span key={page} className="px-1 sm:px-2 text-black/60 text-sm">...</span>;
                      }
                      return null;
                    })}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 sm:px-4 py-2 rounded-xl bg-white/80 backdrop-blur-sm border-2 border-black/20 text-black font-medium hover:bg-white hover:border-black/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-sm"
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
      </section>

      {/* Add Image Modal */}
      {showAddImageModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-black">Add New Image</h2>
              <button
                onClick={closeAddImageModal}
                className="text-black/60 hover:text-black transition-colors"
              >
                <X className="h-5 sm:h-6 w-5 sm:w-6" />
              </button>
            </div>
            <form onSubmit={handleFormSubmit} className="space-y-4 sm:space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Upload Image *
                </label>
                <div className="border-2 border-dashed border-black/20 rounded-xl p-4 sm:p-6 text-center">
                  {formData.imagePreview ? (
                    <div className="relative">
                      <img
                        src={formData.imagePreview}
                        alt="Preview"
                        className="max-w-full max-h-32 sm:max-h-48 mx-auto rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image: null, imagePreview: null })}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-3 sm:h-4 w-3 sm:w-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="h-8 sm:h-12 w-8 sm:w-12 text-black/40 mx-auto mb-2 sm:mb-4" />
                      <p className="text-black/60 mb-2 text-sm">Click to upload an image (Max 10MB)</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="imageUpload"
                      />
                      <label
                        htmlFor="imageUpload"
                        className="bg-yellow-400 text-black px-3 sm:px-4 py-2 rounded-lg cursor-pointer hover:bg-yellow-500 transition-colors text-sm"
                      >
                        Choose File
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-black mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
                  placeholder="Enter image title"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-black mb-2">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
                >
                  {categories.filter(cat => cat !== 'All').map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date (Auto-generated) */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Date
                </label>
                <input
                  type="text"
                  value={getCurrentDate()}
                  disabled
                  className="w-full px-3 py-2 border border-black/20 rounded-lg bg-gray-100 text-black/60 text-sm"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-black mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
                  placeholder="Enter image description"
                  required
                />
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-black mb-2">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
                  placeholder="Enter location"
                />
              </div>

              {/* Attendees */}
              <div>
                <label htmlFor="attendees" className="block text-sm font-medium text-black mb-2">
                  Attendees
                </label>
                <input
                  type="text"
                  id="attendees"
                  name="attendees"
                  value={formData.attendees}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
                  placeholder="e.g., 100+, 50 people"
                />
              </div>

              {/* Tags */}
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-black mb-2">
                  Tags
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black/60" />
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
                    placeholder="Enter tags separated by commas (e.g., tech, innovation, event)"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 sm:gap-4 justify-end">
                <button
                  type="button"
                  onClick={closeAddImageModal}
                  className="px-4 sm:px-6 py-2 border border-black/20 rounded-lg text-black hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 sm:px-6 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors font-medium text-sm"
                >
                  Add Image
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="relative max-w-6xl w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 sm:p-3 transition-all duration-300 z-10"
            >
              <X className="h-5 sm:h-6 w-5 sm:w-6" />
            </button>

            {/* Navigation Buttons */}
            {filteredImages.length > 1 && (
              <>
                <button
                  onClick={() => navigateLightbox('prev')}
                  className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 sm:p-3 transition-all duration-300 z-10"
                >
                  <ChevronLeft className="h-5 sm:h-6 w-5 sm:w-6" />
                </button>
                <button
                  onClick={() => navigateLightbox('next')}
                  className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 sm:p-3 transition-all duration-300 z-10"
                >
                  <ChevronRight className="h-5 sm:h-6 w-5 sm:w-6" />
                </button>
              </>
            )}

            {/* Image */}
            <div className="relative max-w-full max-h-full">
              <img
                src={processedImages[selectedImage.id] || selectedImage.src}
                alt={selectedImage.title}
                className="max-w-full max-h-[70vh] sm:max-h-[80vh] object-contain rounded-lg shadow-2xl"
              />
            </div>

            {/* Image Info Panel */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3 sm:p-6">
              <div className="max-w-4xl mx-auto">
                <div className="flex flex-col gap-3 sm:gap-4">
                  <div className="flex-1">
                    <h3 className="text-white text-lg sm:text-xl font-bold mb-1 sm:mb-2">{selectedImage.title}</h3>
                    <p className="text-white/80 mb-2 sm:mb-3 text-sm sm:text-base">{selectedImage.description}</p>
                    <div className="flex flex-wrap gap-2 sm:gap-4 text-white/70 text-xs sm:text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 sm:h-4 w-3 sm:w-4" />
                        {selectedImage.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 sm:h-4 w-3 sm:w-4" />
                        {selectedImage.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 sm:h-4 w-3 sm:w-4" />
                        {selectedImage.attendees}
                      </div>
                    </div>
                    {selectedImage.tags && selectedImage.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
                        {selectedImage.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-yellow-400/20 text-yellow-400 px-2 py-1 rounded-full text-xs font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 justify-center sm:justify-end">
                    <button
                      onClick={() => setIsLiked(!isLiked)}
                      className={`p-2 sm:p-3 rounded-full transition-all duration-300 ${isLiked ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                    >
                      <Heart className={`h-4 sm:h-5 w-4 sm:w-5 ${isLiked ? 'fill-current' : ''}`} />
                    </button>
                    <button className="p-2 sm:p-3 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all duration-300">
                      <Share2 className="h-4 sm:h-5 w-4 sm:w-5" />
                    </button>
                    <a
                      href={processedImages[selectedImage.id] || selectedImage.src}
                      download={`${selectedImage.title.replace(/\s+/g, '_')}.png`}
                      className="p-2 sm:p-3 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all duration-300"
                    >
                      <Download className="h-4 sm:h-5 w-4 sm:w-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Counter */}
            <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-black/50 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
              {lightboxIndex + 1} / {filteredImages.length}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default GalleryPage;