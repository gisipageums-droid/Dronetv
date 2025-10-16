import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "./ThemeProvider";
import logo from "/images/Drone tv .in.jpg";

interface NavItem {
  id: string;
  href: string;
  label: string;
  color: string;
}

interface HeaderData {
  companyName: string;
  logoUrl: string;
  navItems: NavItem[];
  ctaText: string;
  ctaLink?: string;
}

interface HeaderProps {
  headerData: HeaderData;
}

export default function Header({headerData}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme } = useTheme();
  console.log("name",headerData.companyName);
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

  const handleMobileNavClick = (href: string) => {
    setIsMenuOpen(false);
    // Use setTimeout to ensure menu closes before scrolling
    setTimeout(() => {
      const targetId = href.startsWith('#') ? href.slice(1) : href;
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleCtaClick = (href: string) => {
    // Handle CTA button click for both desktop and mobile
    if (href.startsWith('#')) {
      const targetId = href.slice(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        // If element with id not found, try to find element with name attribute
        const namedElement = document.querySelector(`[name="${targetId}"]`);
        if (namedElement) {
          namedElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          // Fallback: scroll to top of body if no specific target found
          document.body.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      // For external links, use normal navigation
      window.location.href = href;
    }
  };

  return (
    <motion.header
      className={`fixed top-[4rem] left-0 right-0 border-b z-50 ${
        theme === "dark"
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
              className="w-8 h-8  rounded-lg flex items-center justify-center mr-2 "
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
               <img
                  src={headerData.logoUrl || logo}
                  alt="Logo"
                  className="w-full h-full object-contain"
                />
            </motion.div>
            <motion.span className={`text-xl font-bold ${
              theme === "dark" ? "text-white" : "text-black"
            }`}>
              {headerData.companyName}
            </motion.span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            {headerData.navItems.map((item: NavItem) => (
              <motion.a
                key={item.id}
                href={item.href}
                className={`font-medium relative group ${
                  theme === "dark"
                    ? "text-gray-300 hover:text-gray-200"
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
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <Button 
              className="bg-primary text-black hover:bg-primary/90 shadow-lg transition-all duration-300"
              onClick={(e) => {
                e.preventDefault();
                handleCtaClick(headerData.ctaLink || '#contact');
              }}
            >
              {headerData.ctaText}
            </Button>

            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <motion.div className="md:hidden">
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary transition-colors p-2"
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

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden border-t border-gray-200 overflow-hidden"
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <motion.nav className="flex flex-col space-y-4 py-4">
                {headerData.navItems.map((item: NavItem, index: number) => (
                  <motion.a
                    key={item.id}
                    href={item.href}
                    className={`text-gray-700 hover:text-${item.color} transition-colors py-2 px-4 rounded-lg hover:bg-${item.color}/10`}
                    variants={itemVariants}
                    whileHover={{ x: 10, scale: 1.02 }}
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      e.preventDefault();
                      handleMobileNavClick(item.href);
                    }}
                  >
                    {item.label}
                  </motion.a>
                ))}
                <Button 
                  className="bg-primary text-black hover:bg-primary/90 w-full mt-4 shadow-lg"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCtaClick(headerData.ctaLink || '#contact');
                  }}
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