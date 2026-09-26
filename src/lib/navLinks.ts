export interface NavItem {
  path: string;
  label: string;
}

export const aboutItems: NavItem[] = [
  { path: "/about", label: "About Us" },
  { path: "/aboutus/portfolio", label: "Platform Portfolio" },
];

export const mediaItems: NavItem[] = [
  { path: "/media/news-pulse", label: "News Pulse" },
  { path: "/media/magazine", label: "Magazine" },
  { path: "/media/video-spotlight", label: "Video Spotlight" },
  { path: "/gallery", label: "Gallery" },
  { path: "/media/impact-stories", label: "Impact Stories" },
  { path: "/media/market-intelligence", label: "Market Intelligence" },
  { path: "/media/tech-trends", label: "Tech Trends" },
  { path: "/media/press-releases", label: "Press Releases" },
  { path: "/media/industry-reports", label: "Industry Reports" },
];

export const eventsItems: NavItem[] = [
  { path: "/events/calendar", label: "Event Calendar" },
  { path: "/events/expos", label: "Expos" },
  { path: "/events/conferences", label: "Conferences" },
  { path: "/events/workshops", label: "Workshops" },
  { path: "/events/competitions", label: "Competitions" },
  { path: "/events/webinars", label: "Webinars" },
  { path: "/events/meetups", label: "Meetups" },
];

export const professionalsItems: NavItem[] = [
  { path: "/professionals/job-board", label: "Job Board" },
  { path: "/professionals/pilot-directory", label: "Pilot Directory" },
  { path: "/professionals/certifications", label: "Certifications" },
  { path: "/professionals/training", label: "Training" },
  { path: "/professionals/career-path", label: "Career Path" },
];

export const partnershipsItems: NavItem[] = [
  { path: "/partnerships/drone-manufacturers", label: "Drone Manufacturers" },
  { path: "/partnerships/ai-tech", label: "AI & Tech Companies" },
  { path: "/partnerships/event-organizers", label: "Event Organizers" },
  { path: "/partnerships/education-partners", label: "Education Partners" },
  { path: "/partnerships/industry-players", label: "Industry Players" },
  { path: "/partner", label: "Partner With Us" },
];

export const plainNavItems: NavItem[] = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About Us" },
  { path: "/listed-companies", label: "Companies" },
  { path: "/products", label: "Products" },
  { path: "/services", label: "Services" },
  { path: "/contact", label: "Contact" },
];
