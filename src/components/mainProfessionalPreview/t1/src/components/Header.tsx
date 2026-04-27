import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useDarkMode } from "../context/DarkModeContext";

export interface HeaderContent {
  logoText: string;
  navLinks: Array<{
    href: string;
    label: string;
  }>;
}

interface NavbarProps {
  content: HeaderContent;
}

const Navbar: React.FC<NavbarProps> = ({ content }) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("#home");

  const navLinks = useMemo(() => content.navLinks || [], [content.navLinks]);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track section in view
  useEffect(() => {
    if (navLinks.length === 0) return;

    const sections = navLinks
      .map((link) => {
        if (link.href && link.href.startsWith("#") && link.href.length > 1) {
          const element = document.querySelector(link.href);
          return element ? element : null;
        }
        return null;
      })
      .filter(Boolean) as HTMLElement[];

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveLink(`#${entry.target.id}`);
        });
      },
      { threshold: 0.6 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => {
      sections.forEach((section) => observer.unobserve(section));
      observer.disconnect();
    };
  }, [navLinks]);

  const scrollToSection = (href: string) => {
    if (href && href.startsWith("#") && href.length > 1) {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: "smooth" });
      setActiveLink(href);
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-16 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-sm ${
          isScrolled
            ? "bg-white/80 dark:bg-gray-900/80 shadow-lg backdrop-blur-xl"
            : "bg-white dark:bg-gray-900"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 cursor-pointer min-w-0 flex-shrink-0 text-blue-500 dark:text-orange-500"
              onClick={() => scrollToSection("#home")}
            >
              <div className="rounded-full bg-yellow-500 text-white h-10 w-10 text-2xl font-extrabold flex items-center justify-center p-2">
                <span className="uppercase">{content.logoText[0] || "P"}</span>
              </div>
              <span className="text-2xl font-bold truncate capitalize text-yellow-500">
                {content.logoText || "MyLogo"}
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center justify-center space-x-1 flex-1 mx-4">
              {navLinks.map((link, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -2 }}
                  className="flex-shrink-0"
                >
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className={`relative px-3 py-2 rounded-md font-medium transition-colors whitespace-nowrap ${
                      activeLink === link.href
                        ? "text-orange-500"
                        : "text-gray-700 dark:text-gray-300 hover:text-orange-500"
                    }`}
                  >
                    {link.label}
                    {activeLink === link.href && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 rounded-md bg-orange-500/10"
                      />
                    )}
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleDarkMode}
                className="hidden md:inline-block p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 flex-shrink-0"
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </motion.button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 flex-shrink-0"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 dark:border-gray-800 overflow-hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navLinks.map((link, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 dark:bg-gray-800 p-2 rounded-lg"
                  >
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className={`w-full text-left px-3 py-2 rounded-md text-base ${
                        activeLink === link.href
                          ? "text-orange-500 font-semibold bg-orange-50 dark:bg-orange-900/20"
                          : "text-gray-700 dark:text-gray-300 hover:text-orange-500"
                      }`}
                    >
                      {link.label}
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </motion.nav>
    </>
  );
};

export default Navbar;
