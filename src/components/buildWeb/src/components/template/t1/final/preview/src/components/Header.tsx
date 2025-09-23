import { motion } from "motion/react";
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
        className='dark:bg-gray-900 dark:border-gray-700'
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative'>
          <div className='flex items-center justify-between h-16'>
            {/* Logo + Company Name */}
            <motion.div
              className='flex flex-row gap-2 items-center text-xl sm:text-2xl font-bold text-red-500 dark:text-yellow-400 transition-colors duration-300'
              whileHover={{ scale: 1.05 }}
            >
              {/* Enhanced Logo with Animations */}
              <div className='relative'>
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
                  whileHover={{
                    scale: 1.2,
                    rotate: 360,
                    transition: { duration: 0.5 },
                  }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <motion.img
                    src={headerData.logoSrc}
                    alt='Logo'
                    className='h-4 w-4 sm:h-6 sm:w-6 object-contain rounded-full'
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

              {/* Company Name */}
              <span>{headerData.companyName}</span>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className='hidden md:flex items-center space-x-4 mr-20'>
              {headerData.navItems.map((item, index) => (
                <a
                  key={index}
                  href={`#${item.toLowerCase()}`}
                    className='text-black hover:text-yellow-600 transition-colors duration-300 font-medium'
                >
                  {item}
                </a>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <div className='md:hidden flex items-center space-x-2'>
              <button
                onClick={toggleMobileMenu}
                className='p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700'
              >
                <svg
                  className='h-6 w-6 transition-transform duration-200'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  style={{
                    transform: isMobileMenuOpen
                      ? "rotate(90deg)"
                      : "rotate(0deg)",
                  }}
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M6 18L18 6M6 6l12 12'
                    />
                  ) : (
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M4 6h16M4 12h16M4 18h16'
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
        className='md:hidden dark:bg-gray-900 dark:border-gray-700'
      >
        <div className='px-4 pt-2 pb-3 space-y-1 sm:px-6'>
          {headerData.navItems.map((item, index) => (
            <a
              key={index}
              href={`#${item.toLowerCase()}`}
              className='block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors duration-300'
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