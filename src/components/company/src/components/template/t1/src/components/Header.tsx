import { motion } from "motion/react";
import { useState } from "react";
import logo from "../public/images/logos/logo.svg";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const headerStyles: React.CSSProperties = {
    position: "fixed" as const,
    top: "56px",
    left: "0",
    right: "0",
    width: "100%",
    zIndex: 2147483647,
    backgroundColor: "white",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    borderBottom: "1px solid #e5e7eb",
    transition: "all 0.5s ease",
  };

  const mobileButtonStyles: React.CSSProperties = {
    position: "relative" as const,
    zIndex: 2147483647,
    display: "block",
    visibility: "visible" as const,
    opacity: "1",
    pointerEvents: "auto" as const,
    padding: "0.5rem",
    borderRadius: "0.375rem",
    color: "#374151",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
  };

  const mobileMenuStyles: React.CSSProperties = {
    position: "fixed" as const,
    top: "112px",
    left: "0",
    right: "0",
    zIndex: 2147483646,
    backgroundColor: "white",
    borderTop: "1px solid #e5e7eb",
    maxHeight: isMobileMenuOpen ? "480px" : "0", // Increased height to fit new items
    opacity: isMobileMenuOpen ? "1" : "0",
    overflow: "hidden" as const,
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo + Name */}
            <motion.a
              href="#home"
              className="flex flex-row gap-2 items-center text-xl sm:text-2xl font-bold text-red-500 dark:text-yellow-400 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <motion.img
                src={logo}
                alt="Logo"
                className="h-4 w-4 sm:h-6 sm:w-6 object-contain"
                initial={{ opacity: 0, scale: 0.5, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, type: "spring", stiffness: 120 }}
                whileInView={{
                  y: [0, -4, 0],
                  transition: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
                whileHover={{
                  rotate: [0, -5, 5, -5, 0],
                  scale: 1.2,
                  boxShadow: "0px 0px 15px rgba(255, 215, 0, 0.6)",
                  transition: { duration: 0.5 },
                }}
                whileTap={{ scale: 0.9 }}
              />
              <span>Innovative Labs</span>
            </motion.a>

            {/* Desktop Navigation — UPDATED with Profile & Gallery */}
            <nav className="hidden md:flex items-center space-x-6">
              <a
                href="#home"
                className="text-black hover:text-yellow-600 transition-colors duration-300 font-medium"
              >
                Home
              </a>
              <a
                href="#about"
                className="text-black hover:text-yellow-600 transition-colors duration-300 font-medium"
              >
                About
              </a>
              <a
                href="#profile"
                className="text-black hover:text-yellow-600 transition-colors duration-300 font-medium"
              >
                Profile
              </a>
              <a
                href="#services"
                className="text-black hover:text-yellow-600 transition-colors duration-300 font-medium"
              >
                Services
              </a>
              <a
                href="#product"
                className="text-black hover:text-yellow-600 transition-colors duration-300 font-medium"
              >
                Product
              </a>
              <a
                href="#blog"
                className="text-black hover:text-yellow-600 transition-colors duration-300 font-medium"
              >
                Blog
              </a>
              {/* 👇 Added Gallery */}
              <a
                href="#gallery"
                className="text-black hover:text-yellow-600 transition-colors duration-300 font-medium"
              >
                Gallery
              </a>
              <a
                href="#testimonials"
                className="text-black hover:text-yellow-600 transition-colors duration-300 font-medium"
              >
                Testimonials
              </a>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <button
                onClick={toggleMobileMenu}
                style={mobileButtonStyles}
                className="hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                aria-label="Toggle mobile menu"
                type="button"
              >
                <svg
                  className="h-6 w-6 transition-transform duration-200"
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

      {/* Mobile Navigation Menu — UPDATED */}
      <div
        style={{ ...mobileMenuStyles }}
        className="md:hidden dark:bg-gray-900 dark:border-gray-700"
      >
        <div className="px-4 pt-2 pb-3 space-y-1 sm:px-6">
          {[
            "Home",
            "About",
            "Profile", // 👈 Added
            "Product",
            "Services",
            "Testimonials",
            "Blog",
            "Gallery", // 👈 Added
          ].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="block px-3 py-2.5 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors duration-300"
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
