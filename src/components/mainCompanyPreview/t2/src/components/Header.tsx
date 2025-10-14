import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "./ThemeProvider";
import logo from "/images/Drone tv .in.jpg";

export default function Header({ headerData }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme } = useTheme();
  const scrollTimer = useRef(null);

  const menuVariants = {
    closed: { opacity: 0, height: 0, transition: { duration: 0.3 } },
    open: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.3, staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    closed: { opacity: 0, x: -20 },
    open: { opacity: 1, x: 0 },
  };

  // Smooth scroll helper
  const smoothScrollTo = (href) => {
    const targetId = href.replace("#", "");
    const el = document.getElementById(targetId);

    if (!el) {
      // fallback default hash navigation
      window.location.hash = href;
      return;
    }

    const headerOffset = 128; // fixed header height
    const y = el.getBoundingClientRect().top + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: Math.max(y, 0),
      behavior: "smooth",
    });
  };

  const handleNavClick = (e, href) => {
    e.preventDefault();

    // prevent multiple pending timers
    if (scrollTimer.current) clearTimeout(scrollTimer.current);

    const doScroll = () => smoothScrollTo(href);

    if (isMenuOpen) {
      // close first, wait for exit animation (~300ms), then scroll
      setIsMenuOpen(false);
      scrollTimer.current = setTimeout(doScroll, 320);
    } else {
      doScroll();
    }
  };

  return (
    <motion.header
      className={`fixed top-[4rem] left-0 right-0 border-b z-50 ${theme === "dark"
        ? "bg-gray-800 border-gray-700 text-gray-300"
        : "bg-white border-gray-200"
        }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <motion.div
              className="w-8 h-8 rounded-lg flex items-center justify-center mr-2"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <img
                src={headerData.logoUrl || logo}
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </motion.div>
            <motion.span
              className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-black"
                }`}
            >
              {headerData.companyName}
            </motion.span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            {headerData.navItems.map((item) => (
              <motion.a
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                onTouchEnd={(e) => handleNavClick(e, item.href)}
                className={`font-medium relative group cursor-pointer ${theme === "dark"
                  ? "text-gray-300 hover:text-gray-200"
                  : "text-gray-700 hover:text-primary"
                  }`}
                whileHover={{ y: -2 }}
              >
                {item.label}
                <motion.span
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            ))}
          </nav>

          {/* Right side - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Button className="bg-primary text-black hover:bg-primary/90 shadow-lg transition-all duration-300">
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, "#contact")}
                onTouchEnd={(e) => handleNavClick(e, "#contact")}
              >
                {headerData.ctaText}
              </a>
            </Button>
            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <motion.button
              onClick={() => setIsMenuOpen((v) => !v)}
              className={`p-2 ${theme === "dark"
                ? "text-gray-300 hover:text-gray-100"
                : "text-gray-700 hover:text-primary"
                }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className={`md:hidden border-t overflow-hidden ${theme === "dark" ? "border-gray-700" : "border-gray-200"
                }`}
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <motion.nav className="flex flex-col py-4">
                {headerData.navItems.map((item) => (
                  <motion.a
                    key={item.id}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    onTouchEnd={(e) => handleNavClick(e, item.href)}
                    className={`py-3 px-4 rounded-lg transition-colors cursor-pointer ${theme === "dark"
                      ? "text-gray-300 hover:text-white hover:bg-gray-700"
                      : "text-gray-700 hover:text-primary hover:bg-gray-100"
                      }`}
                    variants={itemVariants}
                    whileHover={{ x: 10, scale: 1.02 }}
                  >
                    {item.label}
                  </motion.a>
                ))}
                <Button className="bg-primary text-black hover:bg-primary/90 w-full mt-4 shadow-lg">
                  <a
                    href="#contact"
                    onClick={(e) => handleNavClick(e, "#contact")}
                    onTouchEnd={(e) => handleNavClick(e, "#contact")}
                  >
                    {headerData.ctaText}
                  </a>
                </Button>
              </motion.nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}