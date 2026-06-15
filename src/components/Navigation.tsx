import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useUserAuth } from "./context/context";
import { motion } from "motion/react";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const [isEventsOpen, setIsEventsOpen] = useState(false);
  const [isProfessionalsOpen, setIsProfessionalsOpen] = useState(false);
  const [isPartnershipsOpen, setIsPartnershipsOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("English");

  const { isLogin, isAdminLogin, setHaveAccount } = useUserAuth();
  const languageRef = useRef<HTMLDivElement>(null);
  const authRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const eventsRef = useRef<HTMLDivElement>(null);
  const professionalsRef = useRef<HTMLDivElement>(null);
  const partnershipsRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (languageRef.current && !languageRef.current.contains(e.target as Node)) setIsLanguageOpen(false);
      if (authRef.current && !authRef.current.contains(e.target as Node)) setIsAuthOpen(false);
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) setIsAccountOpen(false);
      if (mediaRef.current && !mediaRef.current.contains(e.target as Node)) setIsMediaOpen(false);
      if (eventsRef.current && !eventsRef.current.contains(e.target as Node)) setIsEventsOpen(false);
      if (professionalsRef.current && !professionalsRef.current.contains(e.target as Node)) setIsProfessionalsOpen(false);
      if (partnershipsRef.current && !partnershipsRef.current.contains(e.target as Node)) setIsPartnershipsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const languages = [
    { label: "English", code: "en" },
    { label: "Hindi", code: "hi" },
    { label: "Bengali", code: "bn" },
    { label: "Telugu", code: "te" },
    { label: "Tamil", code: "ta" },
    { label: "Kannada", code: "kn" },
    { label: "Odia", code: "or" },
    { label: "Assamese", code: "as" },
    { label: "Nepali", code: "ne" },
    { label: "Spanish", code: "es" },
    { label: "French", code: "fr" },
    { label: "Chinese", code: "zh-CN" },
  ];

  const handleLanguageChange = (label: string, code: string) => {
    setSelectedLang(label);
    setIsLanguageOpen(false);
    const select = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (select) {
      select.value = code;
      select.dispatchEvent(new Event("change"));
    }
  };

  const handleNavigation = (path: string) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  const closeAllDropdowns = () => {
    setIsAccountOpen(false);
    setIsAuthOpen(false);
    setIsMediaOpen(false);
    setIsEventsOpen(false);
    setIsProfessionalsOpen(false);
    setIsPartnershipsOpen(false);
  };

  const chevron = (
    <svg className="relative z-10 w-3 h-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
    </svg>
  );

  const dropdownMotion = { whileInView: { y: [-8, 0] }, transition: { type: "spring", duration: 0.4, stiffness: 60 } };

  const blackDropdownBase = "absolute z-50 top-full left-0 mt-0 bg-zinc-950 border-t-[3px] border-yellow-400 rounded-b-lg shadow-2xl min-w-[200px]";

  const blackDropdownItem = (path: string, label: string) => (
    <Link
      key={path}
      to={path}
      onClick={closeAllDropdowns}
      className={`block px-5 py-2.5 text-sm font-medium whitespace-nowrap transition-colors ${
        location.pathname === path ? "text-yellow-400" : "text-white/80 hover:bg-yellow-400 hover:text-black"
      }`}
    >
      {label}
    </Link>
  );

  const mediaItems = [
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

  const eventsItems = [
    { path: "/events/calendar", label: "Event Calendar" },
    { path: "/events/expos", label: "Expos" },
    { path: "/events/conferences", label: "Conferences" },
    { path: "/events/workshops", label: "Workshops" },
    { path: "/events/competitions", label: "Competitions" },
    { path: "/events/webinars", label: "Webinars" },
    { path: "/events/meetups", label: "Meetups" },
  ];

  const professionalsItems = [
    { path: "/professionals/job-board", label: "Job Board" },
    { path: "/professionals/pilot-directory", label: "Pilot Directory" },
    { path: "/professionals/certifications", label: "Certifications" },
    { path: "/professionals/portfolio", label: "Portfolio" },
    { path: "/professionals/training", label: "Training" },
    { path: "/professionals/networking", label: "Networking" },
    { path: "/professionals/community", label: "Community" },
  ];

  const partnershipsItems = [
    { path: "/partnerships/drone-manufacturers", label: "Drone Manufacturers" },
    { path: "/partnerships/ai-tech", label: "AI & Tech Companies" },
    { path: "/partnerships/event-organizers", label: "Event Organizers" },
    { path: "/partnerships/education-partners", label: "Education Partners" },
    { path: "/partnerships/industry-players", label: "Industry Players" },
    { path: "/partnerships/benefits", label: "Partnership Benefits" },
    { path: "/partnerships/become-a-partner", label: "Become a Partner" },
  ];

  const plainNavItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Companies", path: "/listed-companies" },
    { name: "Products", path: "/products" },
    { name: "Services", path: "/services" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-[9999999] transition-all duration-500 ease-out ${
        isScrolled
          ? "bg-yellow-400/95 backdrop-blur-lg shadow-2xl border-b border-yellow-500/20"
          : "bg-yellow-400"
      }`}
    >
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex-shrink-0 group">
            <img
              src="/images/Drone tv .in.png"
              alt="Drone TV"
              className="w-20 h-20 cursor-pointer group-hover:scale-110 transition-all duration-300"
              onClick={() => handleNavigation("/")}
            />
          </div>

          {/* Desktop nav */}
          <div className="hidden xl:flex items-center gap-0.5">

            {/* Home */}
            <Link to="/" className={`relative px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-300 group overflow-hidden whitespace-nowrap ${location.pathname === "/" ? "text-gray-800 bg-black/10" : "text-black hover:text-gray-800"}`}>
              <span className="relative z-10">Home</span>
              <div className="absolute inset-0 rounded-lg bg-black/10 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
            </Link>

            {/* About */}
            <Link to="/about" className={`relative px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-300 group overflow-hidden whitespace-nowrap ${location.pathname === "/about" ? "text-gray-800 bg-black/10" : "text-black hover:text-gray-800"}`}>
              <span className="relative z-10">About Us</span>
              <div className="absolute inset-0 rounded-lg bg-black/10 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
            </Link>

            {/* Media Hub dropdown */}
            <div className="relative" ref={mediaRef}
              onMouseEnter={() => { closeAllDropdowns(); setIsMediaOpen(true); }}
              onMouseLeave={() => setIsMediaOpen(false)}
            >
              <motion.button
                onClick={() => { closeAllDropdowns(); setIsMediaOpen(s => !s); }}
                className={`relative px-2.5 py-2 rounded-lg text-sm font-medium text-black flex items-center gap-1.5 group overflow-hidden transition-all duration-300 whitespace-nowrap ${mediaItems.some(i => location.pathname === i.path) ? "bg-black/10" : ""}`}
              >
                <span className="relative z-10">Media Hub</span>
                {chevron}
                <div className="absolute inset-0 rounded-lg bg-black/10 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
              </motion.button>
              <div className="absolute top-full left-0 h-1 w-full" />
              {isMediaOpen && (
                <motion.div {...dropdownMotion} className={blackDropdownBase}>
                  <div className="py-1">
                    {mediaItems.map(i => blackDropdownItem(i.path, i.label))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Events dropdown */}
            <div className="relative" ref={eventsRef}
              onMouseEnter={() => { closeAllDropdowns(); setIsEventsOpen(true); }}
              onMouseLeave={() => setIsEventsOpen(false)}
            >
              <motion.button
                onClick={() => { closeAllDropdowns(); setIsEventsOpen(s => !s); }}
                className={`relative px-2.5 py-2 rounded-lg text-sm font-medium text-black flex items-center gap-1.5 group overflow-hidden transition-all duration-300 whitespace-nowrap ${eventsItems.some(i => location.pathname === i.path) || location.pathname === "/events" ? "bg-black/10" : ""}`}
              >
                <span className="relative z-10">Events</span>
                {chevron}
                <div className="absolute inset-0 rounded-lg bg-black/10 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
              </motion.button>
              <div className="absolute top-full left-0 h-1 w-full" />
              {isEventsOpen && (
                <motion.div {...dropdownMotion} className={blackDropdownBase}>
                  <div className="py-1">
                    {eventsItems.map(i => blackDropdownItem(i.path, i.label))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Companies */}
            <Link to="/listed-companies" className={`relative px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-300 group overflow-hidden whitespace-nowrap ${location.pathname === "/listed-companies" ? "text-gray-800 bg-black/10" : "text-black hover:text-gray-800"}`}>
              <span className="relative z-10">Companies</span>
              <div className="absolute inset-0 rounded-lg bg-black/10 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
            </Link>

            {/* Professionals dropdown */}
            <div className="relative" ref={professionalsRef}
              onMouseEnter={() => { closeAllDropdowns(); setIsProfessionalsOpen(true); }}
              onMouseLeave={() => setIsProfessionalsOpen(false)}
            >
              <motion.button
                onClick={() => { closeAllDropdowns(); setIsProfessionalsOpen(s => !s); }}
                className={`relative px-2.5 py-2 rounded-lg text-sm font-medium text-black flex items-center gap-1.5 group overflow-hidden transition-all duration-300 whitespace-nowrap ${professionalsItems.some(i => location.pathname === i.path) || location.pathname === "/professionals" ? "bg-black/10" : ""}`}
              >
                <span className="relative z-10">Professionals</span>
                {chevron}
                <div className="absolute inset-0 rounded-lg bg-black/10 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
              </motion.button>
              <div className="absolute top-full left-0 h-1 w-full" />
              {isProfessionalsOpen && (
                <motion.div {...dropdownMotion} className={blackDropdownBase}>
                  <div className="py-1">
                    {professionalsItems.map(i => blackDropdownItem(i.path, i.label))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Partnerships dropdown */}
            <div className="relative" ref={partnershipsRef}
              onMouseEnter={() => { closeAllDropdowns(); setIsPartnershipsOpen(true); }}
              onMouseLeave={() => setIsPartnershipsOpen(false)}
            >
              <motion.button
                onClick={() => { closeAllDropdowns(); setIsPartnershipsOpen(s => !s); }}
                className={`relative px-2.5 py-2 rounded-lg text-sm font-medium text-black flex items-center gap-1.5 group overflow-hidden transition-all duration-300 whitespace-nowrap ${partnershipsItems.some(i => location.pathname === i.path) ? "bg-black/10" : ""}`}
              >
                <span className="relative z-10">Partnerships</span>
                {chevron}
                <div className="absolute inset-0 rounded-lg bg-black/10 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
              </motion.button>
              <div className="absolute top-full left-0 h-1 w-full" />
              {isPartnershipsOpen && (
                <motion.div {...dropdownMotion} className={`${blackDropdownBase} min-w-[220px]`}>
                  <div className="py-1">
                    {partnershipsItems.map(i => blackDropdownItem(i.path, i.label))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Products */}
            <Link to="/products" className={`relative px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-300 group overflow-hidden whitespace-nowrap ${location.pathname === "/products" ? "text-gray-800 bg-black/10" : "text-black hover:text-gray-800"}`}>
              <span className="relative z-10">Products</span>
              <div className="absolute inset-0 rounded-lg bg-black/10 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
            </Link>

            {/* Services */}
            <Link to="/services" className={`relative px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-300 group overflow-hidden whitespace-nowrap ${location.pathname === "/services" ? "text-gray-800 bg-black/10" : "text-black hover:text-gray-800"}`}>
              <span className="relative z-10">Services</span>
              <div className="absolute inset-0 rounded-lg bg-black/10 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
            </Link>

            {/* Contact */}
            <Link to="/contact" className={`relative px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-300 group overflow-hidden whitespace-nowrap ${location.pathname === "/contact" ? "text-gray-800 bg-black/10" : "text-black hover:text-gray-800"}`}>
              <span className="relative z-10">Contact</span>
              <div className="absolute inset-0 rounded-lg bg-black/10 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
            </Link>

            {/* Account / Login */}
            {isLogin || isAdminLogin ? (
              <div className="relative" ref={accountRef}
                onMouseEnter={() => { closeAllDropdowns(); setIsAccountOpen(true); }}
                onMouseLeave={() => setIsAccountOpen(false)}
              >
                <motion.button
                  onClick={() => setIsAccountOpen(s => !s)}
                  className="relative px-2.5 py-2 rounded-lg text-sm font-medium text-black hover:text-gray-800 flex items-center gap-1.5 group overflow-hidden transition-all duration-300 whitespace-nowrap"
                >
                  <span className="relative z-10">Account</span>
                  {chevron}
                  <div className="absolute inset-0 rounded-lg bg-black/10 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
                </motion.button>
                <div className="absolute top-full left-0 h-2 w-48" />
                {isAccountOpen && (
                  <motion.div {...dropdownMotion} className="absolute z-50 mt-1 font-medium bg-yellow-300 border-2 border-black/20 rounded-xl shadow-lg shadow-black/15 left-0">
                    <div className="p-2 flex flex-col min-w-[150px]">
                      <Link to={isAdminLogin ? "/admin/company/dashboard" : "/user-dashboard"} onClick={() => setIsAccountOpen(false)}
                        className="px-3 py-2 rounded-lg hover:bg-yellow-200 flex items-center gap-2 text-sm font-medium text-gray-800">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                        Dashboard
                      </Link>
                      <Link to="/logout" onClick={() => setIsAccountOpen(false)}
                        className="px-3 py-2 rounded-lg hover:bg-yellow-200 flex items-center gap-2 text-sm font-medium text-red-700">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Logout
                      </Link>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="relative" ref={authRef}
                onMouseEnter={() => { closeAllDropdowns(); setIsAuthOpen(true); }}
                onMouseLeave={() => setIsAuthOpen(false)}
              >
                <motion.button
                  onClick={() => setIsAuthOpen(s => !s)}
                  className="relative px-2.5 py-2 rounded-lg text-sm font-medium text-black hover:text-gray-800 flex items-center gap-1.5 group overflow-hidden transition-all duration-300 whitespace-nowrap"
                >
                  <span className="relative z-10">Login</span>
                  {chevron}
                  <div className="absolute inset-0 rounded-lg bg-black/10 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
                </motion.button>
                <div className="absolute top-full left-0 h-2 w-48" />
                {isAuthOpen && (
                  <motion.div {...dropdownMotion} className="absolute z-50 mt-1 font-medium bg-yellow-300 border-2 border-black/20 rounded-xl shadow-lg shadow-black/15 left-0">
                    <div className="p-2 flex flex-col min-w-[140px]">
                      <Link to="/login" onClick={() => { setHaveAccount(true); setIsAuthOpen(false); }}
                        className="px-3 py-2 rounded-lg text-sm font-medium text-gray-800 hover:bg-yellow-200">Login</Link>
                      <Link to="/login" onClick={() => { setHaveAccount(false); setIsAuthOpen(false); }}
                        className="px-3 py-2 rounded-lg text-sm font-medium text-gray-800 hover:bg-yellow-200">Register</Link>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* Get Listed CTA */}
            <Link to="/partnerships/become-a-partner"
              className="ml-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-colors whitespace-nowrap flex-shrink-0">
              Get Listed
            </Link>
          </div>

          {/* Language + hamburger */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="relative" ref={languageRef}>
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center gap-1.5 text-black hover:text-gray-800 transition-colors"
              >
                <img src="/images/iconre.jpg" alt="Language" className="w-6 h-6 rounded-full" />
                <span className="text-sm notranslate hidden sm:inline" translate="no">{selectedLang}</span>
              </button>
              {isLanguageOpen && (
                <div className="absolute right-0 z-50 mt-2 bg-yellow-300 border-2 border-yellow-400 rounded-lg shadow-lg max-h-72 overflow-y-auto min-w-[130px]">
                  <div className="p-2">
                    <ul className="text-sm text-black">
                      {languages.map(({ label, code }) => (
                        <li key={code} onClick={() => handleLanguageChange(label, code)}
                          className={`notranslate px-4 py-2 rounded cursor-pointer hover:bg-yellow-200 ${selectedLang === label ? "font-semibold bg-yellow-100" : ""}`}
                          translate="no">
                          {label}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div className="xl:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-black hover:text-gray-800 focus:outline-none hover:scale-110 transition-all duration-300"
              >
                <div className="relative w-6 h-6">
                  <Menu className={`h-6 w-6 absolute transition-all duration-300 ${isMenuOpen ? "opacity-0 rotate-180" : "opacity-100 rotate-0"}`} />
                  <X className={`h-6 w-6 absolute transition-all duration-300 ${isMenuOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-180"}`} />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`xl:hidden transition-all duration-500 ease-out overflow-hidden ${isMenuOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-yellow-400 max-h-[70vh] overflow-y-auto rounded-b-2xl">

            <button onClick={() => handleNavigation("/")} className="w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-black/10 text-black">Home</button>
            <button onClick={() => handleNavigation("/about")} className="w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-black/10 text-black">About Us</button>

            <p className="px-3 py-1 text-xs font-bold text-black/50 uppercase tracking-widest">Media Hub</p>
            {mediaItems.map(i => (
              <button key={i.path} onClick={() => handleNavigation(i.path)} className="w-full text-left px-5 py-2 rounded-md text-sm font-medium hover:bg-black/10 text-black">{i.label}</button>
            ))}

            <p className="px-3 py-1 text-xs font-bold text-black/50 uppercase tracking-widest">Events</p>
            {eventsItems.map(i => (
              <button key={i.path} onClick={() => handleNavigation(i.path)} className="w-full text-left px-5 py-2 rounded-md text-sm font-medium hover:bg-black/10 text-black">{i.label}</button>
            ))}

            <button onClick={() => handleNavigation("/listed-companies")} className="w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-black/10 text-black">Companies</button>

            <p className="px-3 py-1 text-xs font-bold text-black/50 uppercase tracking-widest">Professionals</p>
            {professionalsItems.map(i => (
              <button key={i.path} onClick={() => handleNavigation(i.path)} className="w-full text-left px-5 py-2 rounded-md text-sm font-medium hover:bg-black/10 text-black">{i.label}</button>
            ))}

            <p className="px-3 py-1 text-xs font-bold text-black/50 uppercase tracking-widest">Partnerships</p>
            {partnershipsItems.map(i => (
              <button key={i.path} onClick={() => handleNavigation(i.path)} className="w-full text-left px-5 py-2 rounded-md text-sm font-medium hover:bg-black/10 text-black">{i.label}</button>
            ))}

            <button onClick={() => handleNavigation("/products")} className="w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-black/10 text-black">Products</button>
            <button onClick={() => handleNavigation("/services")} className="w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-black/10 text-black">Services</button>
            <button onClick={() => handleNavigation("/contact")} className="w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-black/10 text-black">Contact</button>

            {isLogin || isAdminLogin ? (
              <>
                <button onClick={() => handleNavigation(isAdminLogin ? "/admin/company/dashboard" : "/user-dashboard")} className="w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-black/10 text-black">Dashboard</button>
                <button onClick={() => handleNavigation("/logout")} className="w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-black/10 text-red-700">Logout</button>
              </>
            ) : (
              <>
                <button onClick={() => { setHaveAccount(true); handleNavigation("/login"); }} className="w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-black/10 text-black">Login</button>
                <button onClick={() => { setHaveAccount(false); handleNavigation("/login"); }} className="w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-black/10 text-black">Register</button>
              </>
            )}

            <button onClick={() => handleNavigation("/partnerships/become-a-partner")} className="w-full text-left px-3 py-2 rounded-md text-base font-bold bg-red-600 text-white rounded-lg mt-2">Get Listed</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
