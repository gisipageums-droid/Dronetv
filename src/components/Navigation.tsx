import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useUserAuth } from "./context/context";
import { motion } from "motion/react";
import { aboutItems, mediaItems, eventsItems, professionalsItems, partnershipsItems } from "../lib/navLinks";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const [isEventsOpen, setIsEventsOpen] = useState(false);
  const [isProfessionalsOpen, setIsProfessionalsOpen] = useState(false);
  const [isPartnershipsOpen, setIsPartnershipsOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("English");

  const { isLogin, isAdminLogin, setHaveAccount, user } = useUserAuth();

  const role = (user as any)?.userData?.role || (user as any)?.role;
  const dashboardPath = isAdminLogin
    ? "/admin/company/dashboard"
    : role === "company"
      ? "/company-portal"
      : role === "professional"
        ? "/professional-portal"
        : "/user-dashboard";
  const languageRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const eventsRef = useRef<HTMLDivElement>(null);
  const professionalsRef = useRef<HTMLDivElement>(null);
  const partnershipsRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
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
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) setIsAccountOpen(false);
      if (mediaRef.current && !mediaRef.current.contains(e.target as Node)) setIsMediaOpen(false);
      if (eventsRef.current && !eventsRef.current.contains(e.target as Node)) setIsEventsOpen(false);
      if (professionalsRef.current && !professionalsRef.current.contains(e.target as Node)) setIsProfessionalsOpen(false);
      if (partnershipsRef.current && !partnershipsRef.current.contains(e.target as Node)) setIsPartnershipsOpen(false);
      if (aboutRef.current && !aboutRef.current.contains(e.target as Node)) setIsAboutOpen(false);
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
    setIsMediaOpen(false);
    setIsEventsOpen(false);
    setIsProfessionalsOpen(false);
    setIsPartnershipsOpen(false);
    setIsAboutOpen(false);
  };

  const chevron = (
    <svg className="relative z-10 w-3 h-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
    </svg>
  );

  const dropdownMotion = { whileInView: { y: [-8, 0] }, transition: { type: "spring", duration: 0.4, stiffness: 60 } };

  const dropdownBase = "absolute z-50 top-full left-0 mt-1 font-medium bg-brand-yellow-soft border-2 border-ink/20 rounded-xl shadow-lg shadow-ink/15 min-w-[190px]";

  const navDropdownItem = (path: string, label: string) => (
    <Link
      key={path}
      to={path}
      onClick={closeAllDropdowns}
      className={`px-3 py-2 rounded-lg text-sm font-medium block whitespace-nowrap transition-colors ${
        location.pathname === path ? "bg-brand-yellow-soft text-ink font-semibold" : "text-ink hover:bg-brand-yellow-soft"
      }`}
    >
      {label}
    </Link>
  );

  const subNavMap: Record<string, { index: string; label: string; items: { path: string; label: string }[] }> = {
    about:         { index: "/about",         label: "About",         items: aboutItems },
    media:         { index: "/media",         label: "Media Hub",     items: mediaItems },
    events:        { index: "/events",        label: "Events",        items: eventsItems },
    professionals: { index: "/professionals", label: "Professionals", items: professionalsItems },
    partnerships:  { index: "/partnerships",  label: "Partnerships",  items: partnershipsItems },
  };

  const currentSection = (() => {
    if (location.pathname === "/about" || location.pathname === "/aboutus/portfolio") return "about";
    if (location.pathname.startsWith("/media") || location.pathname === "/gallery") return "media";
    if (location.pathname === "/events" || location.pathname.startsWith("/events/")) return "events";
    if (location.pathname === "/professionals" || location.pathname.startsWith("/professionals/")) return "professionals";
    if (location.pathname.startsWith("/partnerships") || location.pathname === "/partner") return "partnerships";
    return null;
  })();

  const subNav = currentSection ? subNavMap[currentSection] : null;

  const plainNavItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Companies", path: "/listed-companies" },
    { name: "Products", path: "/products" },
    { name: "Services", path: "/services" },
    { name: "Contact", path: "/contact" },
  ];

  return (
  <>
    <nav
      className={`fixed top-0 w-full z-[9999999] transition-all duration-500 ease-out ${
        isScrolled
          ? "bg-brand-yellow/95 backdrop-blur-lg shadow-2xl border-b border-brand-gold/20"
          : "bg-brand-yellow"
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
          <div className="hidden lg:flex items-center gap-0.5">

            {/* Home */}
            <Link to="/" className={`relative px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-300 group overflow-hidden whitespace-nowrap ${location.pathname === "/" ? "text-ink bg-ink/10" : "text-ink hover:text-ink"}`}>
              <span className="relative z-10">Home</span>
              <div className="absolute inset-0 rounded-lg bg-ink/10 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
            </Link>

            {/* About Us dropdown */}
            <div className="relative" ref={aboutRef}
              onMouseEnter={() => { closeAllDropdowns(); setIsAboutOpen(true); }}
              onMouseLeave={() => setIsAboutOpen(false)}
            >
              <motion.button
                onClick={() => { closeAllDropdowns(); handleNavigation("/about"); }}
                className={`relative px-2.5 py-2 rounded-lg text-sm font-medium text-ink flex items-center gap-1.5 group overflow-hidden transition-all duration-300 whitespace-nowrap ${aboutItems.some(i => location.pathname === i.path) ? "bg-ink/10" : ""}`}
              >
                <span className="relative z-10">About Us</span>
                {chevron}
                <div className="absolute inset-0 rounded-lg bg-ink/10 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
              </motion.button>
              <div className="absolute top-full left-0 h-1 w-full" />
              {isAboutOpen && (
                <motion.div {...dropdownMotion} className={dropdownBase}>
                  <div className="p-2 flex flex-col">
                    {aboutItems.map(i => navDropdownItem(i.path, i.label))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Companies */}
            <Link to="/listed-companies" className={`relative px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-300 group overflow-hidden whitespace-nowrap ${location.pathname === "/listed-companies" ? "text-ink bg-ink/10" : "text-ink hover:text-ink"}`}>
              <span className="relative z-10">Companies</span>
              <div className="absolute inset-0 rounded-lg bg-ink/10 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
            </Link>

            {/* Products */}
            <Link to="/products" className={`relative px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-300 group overflow-hidden whitespace-nowrap ${location.pathname === "/products" ? "text-ink bg-ink/10" : "text-ink hover:text-ink"}`}>
              <span className="relative z-10">Products</span>
              <div className="absolute inset-0 rounded-lg bg-ink/10 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
            </Link>

            {/* Services */}
            <Link to="/services" className={`relative px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-300 group overflow-hidden whitespace-nowrap ${location.pathname === "/services" ? "text-ink bg-ink/10" : "text-ink hover:text-ink"}`}>
              <span className="relative z-10">Services</span>
              <div className="absolute inset-0 rounded-lg bg-ink/10 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
            </Link>

            {/* Professionals dropdown */}
            <div className="relative" ref={professionalsRef}
              onMouseEnter={() => { closeAllDropdowns(); setIsProfessionalsOpen(true); }}
              onMouseLeave={() => setIsProfessionalsOpen(false)}
            >
              <motion.button
                onClick={() => { closeAllDropdowns(); handleNavigation("/professionals"); }}
                className={`relative px-2.5 py-2 rounded-lg text-sm font-medium text-ink flex items-center gap-1.5 group overflow-hidden transition-all duration-300 whitespace-nowrap ${professionalsItems.some(i => location.pathname === i.path) || location.pathname === "/professionals" ? "bg-ink/10" : ""}`}
              >
                <span className="relative z-10">Professionals</span>
                {chevron}
                <div className="absolute inset-0 rounded-lg bg-ink/10 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
              </motion.button>
              <div className="absolute top-full left-0 h-1 w-full" />
              {isProfessionalsOpen && (
                <motion.div {...dropdownMotion} className={dropdownBase}>
                  <div className="p-2 flex flex-col">
                    {professionalsItems.map(i => navDropdownItem(i.path, i.label))}
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
                onClick={() => { closeAllDropdowns(); handleNavigation("/events"); }}
                className={`relative px-2.5 py-2 rounded-lg text-sm font-medium text-ink flex items-center gap-1.5 group overflow-hidden transition-all duration-300 whitespace-nowrap ${eventsItems.some(i => location.pathname === i.path) || location.pathname === "/events" ? "bg-ink/10" : ""}`}
              >
                <span className="relative z-10">Events</span>
                {chevron}
                <div className="absolute inset-0 rounded-lg bg-ink/10 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
              </motion.button>
              <div className="absolute top-full left-0 h-1 w-full" />
              {isEventsOpen && (
                <motion.div {...dropdownMotion} className={dropdownBase}>
                  <div className="p-2 flex flex-col">
                    {eventsItems.map(i => navDropdownItem(i.path, i.label))}
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
                onClick={() => { closeAllDropdowns(); handleNavigation("/partnerships"); }}
                className={`relative px-2.5 py-2 rounded-lg text-sm font-medium text-ink flex items-center gap-1.5 group overflow-hidden transition-all duration-300 whitespace-nowrap ${(partnershipsItems.some(i => location.pathname === i.path) || location.pathname === "/partner") ? "bg-ink/10" : ""}`}
              >
                <span className="relative z-10">Partnerships</span>
                {chevron}
                <div className="absolute inset-0 rounded-lg bg-ink/10 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
              </motion.button>
              <div className="absolute top-full left-0 h-1 w-full" />
              {isPartnershipsOpen && (
                <motion.div {...dropdownMotion} className={`${dropdownBase} min-w-[220px]`}>
                  <div className="p-2 flex flex-col">
                    {partnershipsItems.map(i => navDropdownItem(i.path, i.label))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Media Hub dropdown */}
            <div className="relative" ref={mediaRef}
              onMouseEnter={() => { closeAllDropdowns(); setIsMediaOpen(true); }}
              onMouseLeave={() => setIsMediaOpen(false)}
            >
              <motion.button
                onClick={() => { closeAllDropdowns(); handleNavigation("/media"); }}
                className={`relative px-2.5 py-2 rounded-lg text-sm font-medium text-ink flex items-center gap-1.5 group overflow-hidden transition-all duration-300 whitespace-nowrap ${mediaItems.some(i => location.pathname === i.path) ? "bg-ink/10" : ""}`}
              >
                <span className="relative z-10">Media Hub</span>
                {chevron}
                <div className="absolute inset-0 rounded-lg bg-ink/10 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
              </motion.button>
              <div className="absolute top-full left-0 h-1 w-full" />
              {isMediaOpen && (
                <motion.div {...dropdownMotion} className={dropdownBase}>
                  <div className="p-2 flex flex-col">
                    {mediaItems.map(i => navDropdownItem(i.path, i.label))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Advertising Plans */}
            <Link to="/advertising-plans" className={`relative px-2.5 py-2 rounded-lg text-sm font-semibold transition-all duration-300 group overflow-hidden whitespace-nowrap ${location.pathname === "/advertising-plans" ? "text-ink bg-ink/10" : "text-ink hover:text-ink"}`}>
              <span className="relative z-10">Advertising Plans</span>
              <div className="absolute inset-0 rounded-lg bg-ink/10 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
            </Link>

            {/* Contact */}
            <Link to="/contact" className={`relative px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-300 group overflow-hidden whitespace-nowrap ${location.pathname === "/contact" ? "text-ink bg-ink/10" : "text-ink hover:text-ink"}`}>
              <span className="relative z-10">Contact</span>
              <div className="absolute inset-0 rounded-lg bg-ink/10 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
            </Link>

            {/* Account / Login */}
            {isLogin || isAdminLogin ? (
              <div className="relative" ref={accountRef}
                onMouseEnter={() => { closeAllDropdowns(); setIsAccountOpen(true); }}
                onMouseLeave={() => setIsAccountOpen(false)}
              >
                <motion.button
                  onClick={() => setIsAccountOpen(s => !s)}
                  className="relative px-2.5 py-2 rounded-lg text-sm font-medium text-ink hover:text-ink flex items-center gap-1.5 group overflow-hidden transition-all duration-300 whitespace-nowrap"
                >
                  <span className="relative z-10">Account</span>
                  {chevron}
                  <div className="absolute inset-0 rounded-lg bg-ink/10 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
                </motion.button>
                <div className="absolute top-full left-0 h-2 w-48" />
                {isAccountOpen && (
                  <motion.div {...dropdownMotion} className="absolute z-50 mt-1 font-medium bg-brand-yellow-soft border-2 border-ink/20 rounded-xl shadow-lg shadow-ink/15 left-0">
                    <div className="p-2 flex flex-col min-w-[150px]">
                      <Link to={dashboardPath} onClick={() => setIsAccountOpen(false)}
                        className="px-3 py-2 rounded-lg hover:bg-brand-yellow-soft flex items-center gap-2 text-sm font-medium text-ink">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                        Dashboard
                      </Link>
                      <Link to="/logout" onClick={() => setIsAccountOpen(false)}
                        className="px-3 py-2 rounded-lg hover:bg-brand-yellow-soft flex items-center gap-2 text-sm font-medium text-status-error">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Logout
                      </Link>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              <Link to="/login" onClick={() => setHaveAccount(true)}
                className="relative px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-300 group overflow-hidden whitespace-nowrap text-ink hover:text-ink"
              >
                <span className="relative z-10">Login</span>
                <div className="absolute inset-0 rounded-lg bg-ink/10 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
              </Link>
            )}

          </div>

          {/* Language + hamburger */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="relative" ref={languageRef}>
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center gap-1.5 text-ink hover:text-ink transition-colors"
              >
                <img src="/images/iconre.jpg" alt="Language" className="w-6 h-6 rounded-full" />
                <span className="text-sm notranslate hidden sm:inline" translate="no">{selectedLang}</span>
              </button>
              {isLanguageOpen && (
                <div className="absolute right-0 z-50 mt-2 bg-brand-yellow-soft border-2 border-brand-yellow rounded-lg shadow-lg max-h-72 overflow-y-auto min-w-[130px]">
                  <div className="p-2">
                    <ul className="text-sm text-ink">
                      {languages.map(({ label, code }) => (
                        <li key={code} onClick={() => handleLanguageChange(label, code)}
                          className={`notranslate px-4 py-2 rounded cursor-pointer hover:bg-brand-yellow-soft ${selectedLang === label ? "font-semibold bg-brand-yellow-soft" : ""}`}
                          translate="no">
                          {label}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-ink hover:text-ink focus:outline-none hover:scale-110 transition-all duration-300"
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
        <div className={`lg:hidden transition-all duration-500 ease-out overflow-hidden ${isMenuOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-brand-yellow max-h-[70vh] overflow-y-auto rounded-b-2xl">

            <Link to="/" className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-ink-charcoal/10 text-ink">Home</Link>

            <p className="px-3 py-1 text-xs font-bold text-ink/50 uppercase tracking-widest">About</p>
            {aboutItems.map(i => (
              <Link key={i.path} to={i.path} className="block w-full text-left px-5 py-2 rounded-md text-sm font-medium hover:bg-ink-charcoal/10 text-ink">{i.label}</Link>
            ))}

            <Link to="/listed-companies" className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-ink-charcoal/10 text-ink">Companies</Link>
            <Link to="/products" className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-ink-charcoal/10 text-ink">Products</Link>
            <Link to="/services" className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-ink-charcoal/10 text-ink">Services</Link>

            <p className="px-3 py-1 text-xs font-bold text-ink/50 uppercase tracking-widest">Professionals</p>
            {professionalsItems.map(i => (
              <Link key={i.path} to={i.path} className="block w-full text-left px-5 py-2 rounded-md text-sm font-medium hover:bg-ink-charcoal/10 text-ink">{i.label}</Link>
            ))}

            <p className="px-3 py-1 text-xs font-bold text-ink/50 uppercase tracking-widest">Events</p>
            {eventsItems.map(i => (
              <Link key={i.path} to={i.path} className="block w-full text-left px-5 py-2 rounded-md text-sm font-medium hover:bg-ink-charcoal/10 text-ink">{i.label}</Link>
            ))}

            <p className="px-3 py-1 text-xs font-bold text-ink/50 uppercase tracking-widest">Partnerships</p>
            {partnershipsItems.map(i => (
              <Link key={i.path} to={i.path} className="block w-full text-left px-5 py-2 rounded-md text-sm font-medium hover:bg-ink-charcoal/10 text-ink">{i.label}</Link>
            ))}

            <p className="px-3 py-1 text-xs font-bold text-ink/50 uppercase tracking-widest">Media Hub</p>
            {mediaItems.map(i => (
              <Link key={i.path} to={i.path} className="block w-full text-left px-5 py-2 rounded-md text-sm font-medium hover:bg-ink-charcoal/10 text-ink">{i.label}</Link>
            ))}

            <Link to="/advertising-plans" className="block w-full text-left px-3 py-2 rounded-md text-base font-semibold hover:bg-ink-charcoal/10 text-ink">Advertising Plans</Link>
            <Link to="/contact" className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-ink-charcoal/10 text-ink">Contact</Link>

            {isLogin || isAdminLogin ? (
              <>
                <Link to={dashboardPath} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-ink-charcoal/10 text-ink">Dashboard</Link>
                <Link to="/logout" className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-ink-charcoal/10 text-status-error">Logout</Link>
              </>
            ) : (
              <Link to="/login" onClick={() => setHaveAccount(true)} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-ink-charcoal/10 text-ink">Login</Link>
            )}

          </div>
        </div>
      </div>
    </nav>

    {/* Secondary submenu bar — shows on Media/Events/Professionals/Partnerships pages */}
    {subNav && (
      <div className="fixed top-16 left-0 w-full z-[9999998] bg-surface-darksection border-b-2 border-brand-yellow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Link
            to={subNav.index}
            className={`px-4 py-[11px] text-[12.5px] font-semibold whitespace-nowrap border-b-[3px] transition-all duration-150 -mb-[2px] ${
              location.pathname === subNav.index
                ? "text-brand-yellow border-brand-yellow"
                : "text-white/60 border-transparent hover:text-brand-yellow"
            }`}
          >
            {subNav.label}
          </Link>
          {subNav.items.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-[11px] text-[12.5px] font-semibold whitespace-nowrap border-b-[3px] transition-all duration-150 -mb-[2px] ${
                location.pathname === item.path
                  ? "text-brand-yellow border-brand-yellow"
                  : "text-white/60 border-transparent hover:text-brand-yellow"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    )}
  </>
  );
};

export default Navigation;
