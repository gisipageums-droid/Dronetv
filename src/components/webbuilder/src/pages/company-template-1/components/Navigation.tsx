import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

interface NavLink {
  label: string;
  link: string;
}

interface NavigationProps {
  navigationLinks: NavLink[];
  companyLogo?: string;
  companyName?: string;
}

const Navigation: React.FC<NavigationProps> = ({ navigationLinks, companyLogo, companyName, }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed top-[60px] left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-black/95 backdrop-blur-md shadow-lg py-3'
        : 'bg-transparent py-6'
      }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 text-2xl font-bold">
            {companyLogo && (
              <img
                src={companyLogo}
                alt="Company Logo"
                className="h-8 w-8 object-contain rounded-full bg-white shadow"
              />
            )}
            <span className={isScrolled ? 'text-[#FFD400]' : 'text-white'}>
              {companyName || "Company"}
            </span>
          </div>
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {(navigationLinks || []).map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.link)}
                className={`relative font-medium transition-colors duration-300 group ${isScrolled
                    ? 'text-white hover:text-[#FFD400]'
                    : 'text-white hover:text-[#FFD400]'
                  }`}
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FF0000] transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <button className="bg-[#FF0000] hover:bg-[#FF0000]/90 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
              Get Quote
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 ${isScrolled ? 'text-white' : 'text-white'}`}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 py-4 bg-black/95 backdrop-blur-md rounded-lg">
            {(navigationLinks || []).map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.link)}
                className="block w-full text-left px-4 py-3 text-white hover:text-[#FFD400] hover:bg-white/10 transition-colors"
              >
                {item.label}
              </button>
            ))}
            <button className="w-full mt-4 mx-4 bg-[#FF0000] hover:bg-[#FF0000]/90 text-white px-6 py-3 rounded-full font-semibold transition-colors">
              Get Quote
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
