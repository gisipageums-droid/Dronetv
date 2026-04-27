import React, { useState, useEffect } from 'react';
import { Menu, X, Moon, Sun } from 'lucide-react';

interface NavigationProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ darkMode, toggleDarkMode }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Services', href: '#services' },
    { name: 'Gallery', href: '#portfolio' },
    // { name: 'Blog', href: '#blog' },
    { name: 'Contact', href: '#contact' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
   <nav className={`fixed top-[60px] left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-black/95 backdrop-blur-md shadow-2xl py-3' 
        : 'bg-transparent py-6'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="text-2xl font-bold">
            <span className={isScrolled ? 'text-[#FFD400]' : 'text-black dark:text-white'}>
              Drone
            </span>
            <span className="text-[#FF0000]">TV</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className={`relative font-medium transition-all duration-300 group ${
                  isScrolled 
                    ? 'text-white hover:text-[#FFD400]' 
                    : 'text-black dark:text-white hover:text-[#FF0000]'
                }`}
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FF0000] transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            <button className="hidden md:block bg-[#FF0000] hover:bg-[#FF0000]/90 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
              Hire Me
            </button>
            
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-colors ${
                isScrolled 
                  ? 'text-white hover:bg-white/10' 
                  : 'text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 ${
                isScrolled ? 'text-white' : 'text-black dark:text-white'
              }`}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 py-4 bg-black/95 backdrop-blur-md rounded-lg">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="block w-full text-left px-4 py-3 text-white hover:text-[#FFD400] hover:bg-white/10 transition-colors"
              >
                {item.name}
              </button>
            ))}
            <button className="w-full mt-4 mx-4 bg-[#FF0000] hover:bg-[#FF0000]/90 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300">
              Hire Me
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;