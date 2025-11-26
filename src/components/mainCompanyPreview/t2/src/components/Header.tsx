import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "./ThemeProvider";
import logo from "/images/Drone tv .in.jpg";

export default function Header({ headerData }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme } = useTheme();

  // Static navigation items
  const staticNavItems = [
    { id: 1, label: "Home", href: "#home", color: "primary" },
    { id: 2, label: "About", href: "#about", color: "primary" },
    { id: 3, label: "Our Team", href: "#our-team", color: "primary" },
    { id: 4, label: "Product", href: "#product", color: "primary" },
    { id: 5, label: "Services", href: "#services", color: "red-accent" },
    { id: 6, label: "Gallery", href: "#gallery", color: "primary" },
    { id: 7, label: "Blog", href: "#blog", color: "primary" },
    { id: 8, label: "Testimonial", href: "#testimonial", color: "primary" },
    { id: 9, label: "Clients", href: "#clients", color: "primary" },
  ];

  // Function to handle smooth scrolling
  const handleScrollToSection = (href: string) => {
    setIsMenuOpen(false);

    // Wait for menu to close before scrolling
    setTimeout(() => {
      const targetId = href.replace('#', '');
      const element = document.getElementById(targetId);

      if (element) {
        const headerHeight = 64; // Height of your fixed header (4rem = 64px)
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 300); // Match this with your menu closing animation duration
  };

  // Function to handle desktop navigation (preserve default anchor behavior)
  const handleDesktopNavigation = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);

    if (element) {
      const headerHeight = 64;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

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
          {/* Logo - Only show logo image, removed company name */}
          <div className="flex rounded-lg items-center group">
            <div className="rounded-lg flex items-center justify-center flex-shrink-0 mr-2  ">
              <img
                src={headerData?.logoUrl || logo}
                alt="Logo"
                className="w-[77px] h-[45px] mx-auto cursor-pointer group-hover:scale-110 transition-all duration-300 rounded-xl bg-cover"
              />
            </div>
          </div>

          {/* Desktop Nav - Improved responsiveness */}
          <nav className="items-center justify-center flex-1 hidden mx-4 lg:flex min-w-0">
            <div className="flex items-center justify-center space-x-3">
              {staticNavItems.map((item) => (
                <motion.a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => handleDesktopNavigation(e, item.href)}
                  className={`font-medium relative group whitespace-nowrap text-sm xl:text-base ${theme === "dark"
                    ? "text-gray-300 hover:text-gray-200"
                    : "text-gray-700 hover:text-primary"
                    }`}
                  whileHover={{ y: -2 }}
                >
                  {item.label}
                  <motion.span
                    className={`absolute -bottom-1 left-0 w-0 h-0.5 ${item.color === "red-accent"
                      ? "bg-red-500"
                      : "bg-primary"
                      } transition-all group-hover:w-full`}
                    transition={{ duration: 0.3 }}
                  />
                </motion.a>
              ))}
            </div>
          </nav>

          {/* Right side - Improved responsive spacing and sizing */}
          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 flex-shrink-0">
            <div className="hidden lg:block">
              <Button className="bg-primary text-black hover:bg-primary/90 shadow-lg transition-all duration-300 whitespace-nowrap text-sm px-3 py-2 md:px-4 md:py-2">
                <a
                  href="#contact"
                  onClick={(e) => handleDesktopNavigation(e, '#contact')}
                  className="text-xs sm:text-sm"
                >
                  {headerData?.ctaText || "Get Started"}
                </a>
              </Button>
            </div>

            <div className="hidden lg:block">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile menu button - Improved visibility */}
          <motion.div className="flex items-center space-x-2 flex-shrink-0 lg:hidden">
            {/* Show ThemeToggle on mobile when menu is closed */}
            <AnimatePresence>
              {!isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <ThemeToggle />
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-md transition-colors ${theme === "dark"
                ? "text-gray-300 hover:bg-gray-700"
                : "text-gray-700 hover:bg-gray-100"
                }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              animate={{ rotate: isMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        </div>

        {/* Mobile Nav - Improved spacing and typography */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className={`lg:hidden border-t overflow-hidden ${theme === "dark" ? "border-gray-700" : "border-gray-200"
                }`}
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <motion.nav className="flex flex-col space-y-2 py-4">
                {staticNavItems.map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => handleScrollToSection(item.href)}
                    className={`text-left transition-colors py-3 px-4 rounded-lg text-base font-medium ${theme === "dark"
                      ? "text-gray-300 hover:text-gray-200 hover:bg-gray-700"
                      : "text-gray-700 hover:text-primary hover:bg-gray-50"
                      }`}
                    variants={itemVariants}
                    whileHover={{ x: 10, scale: 1.02 }}
                  >
                    {item.label}
                  </motion.button>
                ))}
                <motion.div
                  className="px-4 pt-2"
                  variants={itemVariants}
                >
                  <Button
                    className="bg-primary text-black hover:bg-primary/90 w-full shadow-lg py-3 text-base font-medium"
                    onClick={() => handleScrollToSection('#contact')}
                  >
                    {headerData?.ctaText || "Get Started"}
                  </Button>
                </motion.div>
              </motion.nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}