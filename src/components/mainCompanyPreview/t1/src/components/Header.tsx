import { motion } from "motion/react";
import logo from "/logos/logo.svg";
import { useState } from "react";

export default function Header({ headerData }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const headerStyles: React.CSSProperties = {
    position: "fixed",
    top: "56px",
    left: "0",
    right: "0",
    width: "100%",
    zIndex: 1000,
    backgroundColor: "white",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    borderBottom: "1px solid #e5e7eb",
    transition: "all 0.5s ease",
  };

  const mobileMenuStyles: React.CSSProperties = {
    position: "fixed",
    top: "112px",
    left: "0",
    right: "0",
    zIndex: 999,
    backgroundColor: "white",
    borderTop: "1px solid #e5e7eb",
    maxHeight: isMobileMenuOpen ? "384px" : "0",
    opacity: isMobileMenuOpen ? "1" : "0",
    overflow: "hidden",
    transition: "all 0.3s ease-in-out",
  };

  return (
    <>
      <motion.header
        style={headerStyles}
        className="dark:bg-gray-900 dark:border-gray-700"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-[16rem] h-16 mx-auto min-w-7xl">
            {/* Logo + Company Name */}
            <motion.div
              className="flex flex-row items-center gap-2 text-xl font-bold text-red-500 transition-colors duration-300 sm:text-2xl dark:text-yellow-400 group"
              whileHover={{ scale: 1.05 }}
            >
              {/* Logo with Animations */}
              <div className="relative flex-shrink-0">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    rotate: 0,
                    transition: {
                      duration: 0.8,
                      type: "spring",
                      stiffness: 120,
                    },
                  }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <motion.img
                    src={headerData?.logoSrc || logo}
                    alt="Logo"
                    className="w-[50px] h-[50px] mx-auto cursor-pointer group-hover:scale-110 transition-all duration-300 rounded-xl"
                    animate={{
                      y: [0, -5, 0],
                      transition: {
                        duration: 3,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                      },
                    }}
                  />
                </motion.div>
              </div>

              <span className="text-lg sm:text-xl md:text-2xl flex-shrink-0">
                {headerData?.companyName || "Your Company"}
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="items-center hidden mr-16 space-x-4 md:flex lg:space-x-6 lg:mr-20">
              {(headerData?.navItems || [
                "Home",
                "About",
                "Profile",
                "Services",
                "Product",
                "Gallery",
                "Blog",
                "Testimonials",
              ]).map((item, index) => (
                <a
                  key={index}
                  href={`#${item.toLowerCase()}`}
                  className="text-sm font-medium text-black transition-colors duration-300 hover:text-yellow-600 lg:text-base"
                >
                  {item}
                </a>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex items-center space-x-2 md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="p-2 transition-colors duration-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <svg
                  className="w-6 h-6 transition-transform duration-200"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  style={{
                    transform: isMobileMenuOpen
                      ? "rotate(90deg)"
                      : "rotate(0deg)",
                  }}
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Navigation Menu */}
      <div
        style={{ ...mobileMenuStyles }}
        className="md:hidden dark:bg-gray-900 dark:border-gray-700"
      >
        <div className="flex gap-1 w-[100%] flex-col">
          {(headerData?.navItems || [
            "Home",
            "About",
            "Profile",
            "Services",
            "Product",
            "Gallery",
            "Blog",
            "Testimonials",
          ]).map((item, index) => (
            <a
              key={index}
              href={`#${item.toLowerCase()}`}
              className="px-3 py-2 font-medium text-black transition-colors duration-300 rounded-lg hover:text-yellow-600 hover:bg-gray-50"
              onClick={closeMobileMenu}
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}