import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "./ThemeProvider";
import logo from "/images/Drone tv .in.jpg";

export default function Header({
  headerData,
}: any) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme } = useTheme();

  // choose container width based on companyName length (adjust threshold as needed)
  const containerMaxClass =
    (headerData?.companyName || "").trim().length > 30 /* threshold */
      ? "min-w-[1270px]"
      : "max-w-7xl";

  // Static content
  const content = headerData || {
    companyName: "Your Company",
    ctaText: "Get Started",
    logoUrl: logo
  };

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

  // Smooth scroll function
  const scrollToSection = (href: string) => {
    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Handle navigation click
  const handleNavClick = (href: string) => {
    setIsMenuOpen(false); // Close mobile menu
    setTimeout(() => {
      scrollToSection(href);
    }, 100); // Small delay to ensure menu is closed before scrolling
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
      className={`fixed top-16 left-0 right-0 border-b z-10 ${theme === "dark"
        ? "bg-gray-800 border-gray-700 text-gray-300"
        : "bg-white border-gray-200"
        }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div
        className={`px-4 mx-auto max-w-7xl sm:px-6 `}
      >
        <div className="flex items-center justify-between py-[1px] ">
          {/* Logo + Company */}
          <div className="flex items-center flex-shrink-0 min-w-0 mr-6 lg:mr-10">
            {/* Logo display only */}
            <div className="relative flex items-center justify-center flex-shrink-0 mr-2 rounded-lg shadow-md group pt-[5px]">
              {content.logoUrl &&
                (content.logoUrl.startsWith("data:") ||
                  content.logoUrl.startsWith("http")) ? (
                <img
                  src={content.logoUrl || logo}
                  alt="Logo"
                  className="cursor-pointer group-hover:scale-110 transition-all duration-300 rounded-xl object-contain h-[65px] min-w-[77px] max-w-[200px]"
                />
              ) : (
                <span
                  className="text-lg font-bold text-black flex items-center justify-center min-w-[77px] max-w-[200px]"
                  style={{
                    height: '65px',
                  }}
                >
                  {content.logoUrl}
                </span>
              )}
            </div>
          </div>

          {/* Desktop Nav - Centered with proper spacing */}
          <nav className="items-center justify-center flex-1 hidden mx-4 lg:flex min-w-0">
            <div className="flex items-center justify-center space-x-3">
              {staticNavItems.map((item) => (
                <motion.a
                  key={item.id}
                  href={item.href}
                  className={`font-medium relative group whitespace-nowrap ${theme === "dark"
                    ? "text-gray-300 hover:text-gray-200"
                    : "text-gray-700 hover:text-primary"
                    }`}
                  whileHover={{ y: -2 }}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
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
          <div className="flex items-center flex-shrink-0 space-x-1">
            <div className="hidden md:flex">
              <Button
                className="text-black transition-all duration-300 shadow-lg bg-primary hover:bg-primary/90 whitespace-nowrap "
                onClick={() => handleNavClick("#contact")}
              >
                {content.ctaText}
              </Button>
            </div>

            <ThemeToggle />

            {/* Mobile menu button */}
            <motion.div className="flex-shrink-0 lg:hidden">
              <motion.button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`hover:text-primary transition-colors p-2 ${theme === "dark"
                  ? "text-gray-300 hover:text-gray-200"
                  : "text-gray-700 hover:text-primary"
                  }`}
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
        </div>

        {/* Mobile Nav - Using static navigation items */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className={`lg:hidden border-t border-gray-200 overflow-hidden ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white"
                }`}
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <motion.nav className="flex flex-col py-4 space-y-4">
                {staticNavItems.map((item, index) => (
                  <motion.a
                    key={item.id}
                    href={item.href}
                    className={`hover:text-${item.color} transition-colors py-2 px-4 rounded-lg hover:bg-${item.color}/10 cursor-pointer`}
                    variants={itemVariants}
                    whileHover={{ x: 10, scale: 1.02 }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.href);
                    }}
                  >
                    {item.label}
                  </motion.a>
                ))}
                <Button
                  className="w-full mt-4 text-black shadow-lg bg-primary hover:bg-primary/90"
                  onClick={() => handleNavClick("#contact")}
                >
                  {content.ctaText}
                </Button>
              </motion.nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}