import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";
import { useUserAuth } from "./context/context";
import { motion } from "motion/react";
const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const { isLogin,isAdminLogin, setHaveAccount } = useUserAuth();

  const languageRef = useRef<HTMLDivElement>(null);
  const authRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        languageRef.current &&
        !languageRef.current.contains(event.target as Node)
      ) {
        setIsLanguageOpen(false);
      }
      if (authRef.current && !authRef.current.contains(event.target as Node)) {
        setIsAuthOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setIsAccountOpen(false);
      }
      if (mediaRef.current && !mediaRef.current.contains(event.target as Node)) {
        setIsMediaOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("English");
  const mediaRef = useRef<HTMLDivElement>(null);

  const languages = [
    { label: "English",   code: "en" },
    { label: "Hindi",     code: "hi" },
    { label: "Bengali",   code: "bn" },
    { label: "Telugu",    code: "te" },
    { label: "Tamil",     code: "ta" },
    { label: "Kannada",   code: "kn" },
    { label: "Odia",      code: "or" },
    { label: "Assamese",  code: "as" },
    { label: "Nepali",    code: "ne" },
    { label: "Spanish",   code: "es" },
    { label: "French",    code: "fr" },
    { label: "Chinese",   code: "zh-CN" },
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
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Events", path: "/events" },
    { name: "Companies", path: "/listed-companies" },
    { name: "Products", path: "/products" },
    { name: "Services", path: "/services" },
    { name: "Professionals", path: "/professionals" },
    { name: "Partner with us", path: "/partner" },
    //{ name: 'News', path: '/news' },
    { name: "Media", path: "/media" },
    { name: "Contact", path: "/contact" },
    {
      name: (isLogin || isAdminLogin) ? "Account" : "Login",
      path: (isLogin || isAdminLogin) ? "/user-dashboard" : "/login",
    },
  ];

  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

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
              alt="Drone TV Logo"
              className="w-[5.5rem] h-[5.5rem] mx-auto cursor-pointer group-hover:scale-110 transition-all duration-300"
              onClick={() => handleNavigation("/")}
            />
          </div>

          {/* Desktop Navigation */}
          <div className="items-center hidden space-x-1 xl:flex">
            {navItems.map((item) => {
              // Logged-in account dropdown: Dashboard + Logout
              if (item.path === "/user-dashboard" && (isLogin || isAdminLogin)) {
                return (
                  <div key={item.name} className="relative" ref={accountRef}
                    onMouseEnter={() => { closeAllDropdowns(); setIsAccountOpen(true); }}
                    onMouseLeave={() => setIsAccountOpen(false)}
                  >
                    <motion.button
                      onClick={() => setIsAccountOpen((s) => !s)}
                      onMouseEnter={() => { closeAllDropdowns(); setIsAccountOpen(true); }}
                      className="relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 group overflow-hidden whitespace-nowrap text-black hover:text-gray-800 flex items-center gap-2"
                    >
                      <span className="relative z-10">{item.name}</span>
                      <svg className="relative z-10 w-3 h-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                      </svg>
                      <div className="absolute inset-0 transition-transform duration-300 origin-left scale-x-0 rounded-lg bg-black/10 group-hover:scale-x-100"></div>
                    </motion.button>
                    {isAccountOpen && (
                      <motion.div
                        whileInView={{ y: [-10, 0] }}
                        transition={{ type: "spring", duration: 0.5, stiffness: 50 }}
                        className="absolute right-0 z-50 mt-2 font-medium bg-yellow-400 border border-yellow-200 rounded-lg shadow-lg"
                      >
                        <div className="p-2 flex flex-col min-w-[150px]">
                          <Link
                            to={isAdminLogin ? "/admin/company/dashboard" : "/user-dashboard"}
                            onClick={() => setIsAccountOpen(false)}
                            className="px-3 py-2 rounded hover:bg-yellow-100 flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                            Dashboard
                          </Link>
                          <Link
                            to="/logout"
                            onClick={() => setIsAccountOpen(false)}
                            className="px-3 py-2 rounded hover:bg-yellow-100 flex items-center gap-2 text-red-700"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                            Logout
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              }

              // If this is the login entry and user is not logged in, render a small dropdown with Register
              if (item.path === "/login" && !isLogin) {
                return (
                  <div key={item.name} className="relative" ref={authRef}
                    onMouseEnter={() => { closeAllDropdowns(); setIsAuthOpen(true); }}
                    onMouseLeave={() => setIsAuthOpen(false)}
                  >
                    <motion.button
                      onClick={() => setIsAuthOpen((s) => !s)}
                      onMouseEnter={() => { closeAllDropdowns(); setIsAuthOpen(true); }}
                      className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 group overflow-hidden whitespace-nowrap text-black hover:text-gray-800 flex items-center gap-2`}
                    >
                      <span className="relative z-10">{item.name}</span>
                      <svg
                        className="relative z-10 w-3 h-3"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div className="absolute inset-0 transition-transform duration-300 origin-left scale-x-0 rounded-lg bg-black/10 group-hover:scale-x-100"></div>
                    </motion.button>
                    {isAuthOpen && (
                      <motion.div
                        whileInView={{ y:[-10,0] }}
                        transition={{ type: "spring", duration: 0.5, stiffness: 50 }}
                        whileTap={{ scale: 1 }}
                        
                        className="absolute right-0 z-50 mt-2 font-medium bg-yellow-400 border border-yellow-200 rounded-lg shadow-lg">
                        <div className="p-2 flex flex-col min-w-[140px]">
                          <Link
                            to="/login"
                            onClick={() => {
                              setHaveAccount(true);
                              setIsAuthOpen(false);
                            }}
                            className="px-3 py-2 rounded hover:bg-yellow-100"
                          >
                            Login
                          </Link>
                          <Link
                            to="/login"
                            onClick={() => {
                              setHaveAccount(false);
                              setIsAuthOpen(false);
                            }}
                            className="px-3 py-2 rounded hover:bg-yellow-100"
                          >
                            Register
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              }

              // Media dropdown
              if (item.name === "Media") {
                return (
                  <div key="media" className="relative" ref={mediaRef}
                    onMouseEnter={() => { closeAllDropdowns(); setIsMediaOpen(true); }}
                    onMouseLeave={() => setIsMediaOpen(false)}
                  >
                    <motion.button
                      onClick={() => setIsMediaOpen((s) => !s)}
                      onMouseEnter={() => { closeAllDropdowns(); setIsMediaOpen(true); }}
                      className="relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 group overflow-hidden whitespace-nowrap text-black hover:text-gray-800 flex items-center gap-1"
                    >
                      <span className="relative z-10">Media</span>
                      <svg className="relative z-10 w-3 h-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                      </svg>
                      <div className="absolute inset-0 transition-transform duration-300 origin-left scale-x-0 rounded-lg bg-black/10 group-hover:scale-x-100"></div>
                    </motion.button>
                    {isMediaOpen && (
                      <motion.div
                        whileInView={{ y: [-10, 0] }}
                        transition={{ type: "spring", duration: 0.5, stiffness: 50 }}
                        className="absolute left-0 z-50 mt-2 font-medium bg-yellow-400 border border-yellow-200 rounded-lg shadow-lg"
                      >
                        <div className="p-2 flex flex-col min-w-[130px]">
                          <Link
                            to="/gallery"
                            onClick={() => setIsMediaOpen(false)}
                            className={`px-3 py-2 rounded hover:bg-yellow-100 ${location.pathname === "/gallery" ? "bg-black/10" : ""}`}
                          >
                            Gallery
                          </Link>
                          <Link
                            to="/videos"
                            onClick={() => setIsMediaOpen(false)}
                            className={`px-3 py-2 rounded hover:bg-yellow-100 ${location.pathname === "/videos" ? "bg-black/10" : ""}`}
                          >
                            Videos
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 group overflow-hidden whitespace-nowrap ${
                    location.pathname === item.path
                      ? "text-gray-800 bg-black/10"
                      : "text-black hover:text-gray-800"
                  }`}
                >
                  <span className="relative z-10">{item.name}</span>
                  <div className="absolute inset-0 transition-transform duration-300 origin-left scale-x-0 rounded-lg bg-black/10 group-hover:scale-x-100"></div>
                </Link>
              );
            })}

            {/* Language Selector */}
            <div className="relative" ref={languageRef}>
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center space-x-2 text-black hover:text-gray-800"
              >
                <img
                  src="/images/iconre.jpg"
                  alt="Language"
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-sm notranslate" translate="no">{selectedLang}</span>
              </button>
              {isLanguageOpen && (
                <div className="absolute right-0 z-50 mt-2 bg-yellow-300 border-2 border-yellow-400 rounded-lg shadow-lg max-h-72 overflow-y-auto">
                  <div className="p-2">
                    <ul className="text-sm text-black">
                      {languages.map(({ label, code }) => (
                        <li
                          key={code}
                          onClick={() => handleLanguageChange(label, code)}
                          className={`notranslate px-4 py-2 rounded cursor-pointer hover:bg-yellow-200 ${selectedLang === label ? "font-semibold bg-yellow-100" : ""}`}
                          translate="no"
                        >
                          {label}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="xl:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-black transition-all duration-300 hover:text-gray-800 focus:outline-none hover:scale-110"
            >
              <div className="relative w-6 h-6">
                <Menu
                  className={`h-6 w-6 absolute transition-all duration-300 ${
                    isMenuOpen ? "opacity-0 rotate-180" : "opacity-100 rotate-0"
                  }`}
                />
                <X
                  className={`h-6 w-6 absolute transition-all duration-300 ${
                    isMenuOpen
                      ? "opacity-100 rotate-0"
                      : "opacity-0 -rotate-180"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`xl:hidden transition-all duration-500 ease-out overflow-hidden ${
            isMenuOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {/* Scrolling is inside this div */}
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-yellow-400 max-h-[70vh] overflow-y-auto rounded-b-2xl">
            {navItems.map((item, index) => {
              // Mobile: logged-in account menu
              if (item.path === "/user-dashboard" && (isLogin || isAdminLogin)) {
                return (
                  <div key={item.name} className="space-y-1">
                    <button
                      onClick={() => handleNavigation(isAdminLogin ? "/admin/company/dashboard" : "/user-dashboard")}
                      className="w-full text-left block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 hover:bg-black/10 text-black hover:text-gray-800"
                      style={{ transition: `all 0.3s ease-out ${index * 50}ms` }}
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => handleNavigation("/logout")}
                      className="w-full text-left block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 hover:bg-black/10 text-red-700 hover:text-red-900"
                      style={{ transition: `all 0.3s ease-out ${index * 50}ms` }}
                    >
                      Logout
                    </button>
                  </div>
                );
              }

              // In mobile menu, if this is the login entry and user is not logged in,
              // render both Login and Register buttons for easier access.
              if (item.path === "/login" && !isLogin) {
                return (
                  <div key={item.name} className="space-y-1">
                    <button
                      onClick={() => handleNavigation("/login")}
                      className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 hover:bg-black/10 transform hover:translate-x-2 ${
                        location.pathname === "/login"
                          ? "text-gray-800 bg-black/10"
                          : "text-black hover:text-gray-800"
                      }`}
                      style={{
                        animationDelay: `${index * 50}ms`,
                        transform: isMenuOpen
                          ? "translateY(0)"
                          : "translateY(-20px)",
                        opacity: isMenuOpen ? 1 : 0,
                        transition: `all 0.3s ease-out ${index * 50}ms`,
                      }}
                    >
                      Login
                    </button>

                    <button
                      onClick={() => handleNavigation("/register")}
                      className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 hover:bg-black/10 transform hover:translate-x-2 ${
                        location.pathname === "/register"
                          ? "text-gray-800 bg-black/10"
                          : "text-black hover:text-gray-800"
                      }`}
                      style={{
                        animationDelay: `${index * 50}ms`,
                        transform: isMenuOpen
                          ? "translateY(0)"
                          : "translateY(-20px)",
                        opacity: isMenuOpen ? 1 : 0,
                        transition: `all 0.3s ease-out ${index * 50}ms`,
                      }}
                    >
                      Register
                    </button>
                  </div>
                );
              }

              // Mobile: Media submenu
              if (item.name === "Media") {
                return (
                  <div key="media" className="space-y-1">
                    <div className="px-3 py-1 text-xs font-bold text-black/50 uppercase tracking-wider">Media</div>
                    <button
                      onClick={() => handleNavigation("/gallery")}
                      className={`w-full text-left block px-5 py-2 rounded-md text-base font-medium transition-all duration-300 hover:bg-black/10 transform hover:translate-x-2 ${location.pathname === "/gallery" ? "text-gray-800 bg-black/10" : "text-black hover:text-gray-800"}`}
                    >
                      Gallery
                    </button>
                    <button
                      onClick={() => handleNavigation("/videos")}
                      className={`w-full text-left block px-5 py-2 rounded-md text-base font-medium transition-all duration-300 hover:bg-black/10 transform hover:translate-x-2 ${location.pathname === "/videos" ? "text-gray-800 bg-black/10" : "text-black hover:text-gray-800"}`}
                    >
                      Videos
                    </button>
                  </div>
                );
              }

              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 hover:bg-black/10 transform hover:translate-x-2 ${
                    location.pathname === item.path
                      ? "text-gray-800 bg-black/10"
                      : "text-black hover:text-gray-800"
                  }`}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    transform: isMenuOpen
                      ? "translateY(0)"
                      : "translateY(-20px)",
                    opacity: isMenuOpen ? 1 : 0,
                    transition: `all 0.3s ease-out ${index * 50}ms`,
                  }}
                >
                  {item.name}
                </button>
              );
            })}
            <div className="px-3 py-2">
              <Search className="w-5 h-5 text-black transition-all duration-300 cursor-pointer hover:text-gray-800 hover:scale-125" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
