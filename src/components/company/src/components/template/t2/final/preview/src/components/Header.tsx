import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "./ThemeProvider";
import logo from "/images/Drone tv .in.jpg";

export default function Header({headerData}) {
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
      className={`fixed top-[4rem] left-0 right-0 border-b z-50 ${
        theme == "dark"
          ? "bg-gray-800 border-gray-700 text-white"
          : "bg-white border-gray-200 text-black"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Limited width to prevent taking too much space */}
          <div className="flex items-center flex-shrink-0 max-w-[200px]">
            <motion.div
              className="w-14 h-14 rounded-lg flex items-center justify-center mr-2 flex-shrink-0"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
               <img
                  src={headerData.logoUrl || logo}
                  alt="Logo"
                  className="w-full h-full object-contain"
                />
            </motion.div>
            <motion.span className={`text-xl font-bold text-black truncate
              ${
        theme == "dark"
          ? "bg-gray-800 border-gray-700 text-white"
          : "bg-white border-gray-200 text-black"
      }`}>
              {headerData.companyName}
            </motion.span>
          </div>

          {/* Desktop Nav - Centered with proper spacing */}
          <nav className="hidden lg:flex items-center justify-center flex-1 mx-8">
            <div className="flex items-center space-x-6 flex-wrap justify-center">
              {staticNavItems.map((item) => (
                <motion.a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => handleDesktopNavigation(e, item.href)}
                  className={`font-medium relative group whitespace-nowrap ${
                    theme == "dark"
                      ? "text-white hover:text-gray-200"
                      : "text-gray-700 hover:text-primary"
                  }`}
                  whileHover={{ y: -2 }}
                >
                  {item.label}
                  <motion.span
                    className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-${item.color} transition-all group-hover:w-full`}
                    transition={{ duration: 0.3 }}
                  />
                </motion.a>
              ))}
            </div>
          </nav>

          {/* Right side - Fixed width to prevent shifting */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            <Button className="bg-primary text-black hover:bg-primary/90 shadow-lg transition-all duration-300 whitespace-nowrap">
              <a 
                href="#contact" 
                onClick={(e) => handleDesktopNavigation(e, '#contact')}
              >
                {headerData.ctaText}
              </a>
            </Button>

            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <motion.div className="lg:hidden flex-shrink-0">
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`transition-colors p-2 ${theme === "dark" ? "text-gray-300 hover:text-gray-200" : "text-gray-700 hover:text-primary"}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              animate={{ rotate: isMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        </div>

        {/* Mobile Nav - Using static navigation items */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="lg:hidden border-t border-gray-200 overflow-hidden"
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <motion.nav className="flex flex-col space-y-4 py-4">
                {staticNavItems.map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => handleScrollToSection(item.href)}
                    className={`text-left hover:text-${item.color} transition-colors py-2 px-4 rounded-lg hover:bg-${item.color}/10 ${
                    theme === "dark"
                      ? "text-gray-300 hover:text-gray-200"
                      : "text-gray-700 hover:text-primary"
                  }`}
                    variants={itemVariants}
                    whileHover={{ x: 10, scale: 1.02 }}
                  >
                    {item.label}
                  </motion.button>
                ))}
                <Button 
                  className="bg-primary text-black hover:bg-primary/90 w-full mt-4 shadow-lg"
                  onClick={() => handleScrollToSection('#contact')}
                >
                  {headerData.ctaText}
                </Button>
              </motion.nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
