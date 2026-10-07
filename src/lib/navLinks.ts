export interface NavItem {
  path: string;
  label: string;
}

export const aboutItems: NavItem[] = [
  { path: "/about", label: "About Us" },
  { path: "/aboutus/portfolio", label: "Platform Portfolio" },
];

export const mediaItems: NavItem[] = [
  { path: "/media/news-pulse", label: "News" },
  { path: "/media/magazine", label: "Magazine" },
  { path: "/media/video-spotlight", label: "Video Gallery" },
  { path: "/gallery", label: "Photo Gallery" },
  { path: "/media/impact-stories", label: "Impact Stories" },
  { path: "/media/market-intelligence", label: "Market Intelligence" },
  { path: "/media/tech-trends", label: "Tech Trends" },
  { path: "/media/industry-reports", label: "Industry Reports" },
];

export const eventsItems: NavItem[] = [
  { path: "/events/expos", label: "Expos" },
  { path: "/events/workshops", label: "Workshops" },
  { path: "/events/competitions", label: "Competitions" },
  { path: "/events/webinars", label: "Webinars" },
];

export const professionalsItems: NavItem[] = [
  { path: "/professionals/job-board", label: "Job Board" },
  { path: "/professionals/networking", label: "Networking" },
  { path: "/media", label: "Media" },
];

export const contactItems: NavItem[] = [
  { path: "/contact", label: "Contact Us" },
  { path: "/book-a-call", label: "Book a Call / Help Center" },
  { path: "/faqs", label: "FAQs" },
  { path: "/advertising-plans", label: "Promotional Plans" },
  { path: "/contact?topic=report-issue", label: "Report an Issue / Feedback" },
];

export const plainNavItems: NavItem[] = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About Us" },
  { path: "/listed-companies", label: "Companies" },
  { path: "/products", label: "Products" },
  { path: "/services", label: "Services" },
  { path: "/contact", label: "Contact" },
];
