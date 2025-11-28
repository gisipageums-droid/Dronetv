import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

interface NavigationProps {
  headerData?: {
    eventName: string;
    ctaText: string;
    navItems: Array<{
      name: string;
      href: string;
    }>;
  };
}

const defaultHeaderContent = {
  eventName: "demo Event",
  ctaText: "Register Now",
  navItems: [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Speakers", href: "#speakers" },
    { name: "Agenda", href: "#agenda" },
    { name: "Partners", href: "#sponsors" },
    { name: "Videos", href: "#gallery" },
    { name: "Contact", href: "#contact" },
  ]
}

const Navigation: React.FC<NavigationProps> = ({ headerData }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Initialize with prop data or default values
  const [navContent] = useState(headerData || defaultHeaderContent);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-[56px] left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-sm shadow-lg py-3"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex lg:mx-20 items-center justify-between">
          {/* Event Name */}
          <div className="flex items-center flex-1 mr-4">
            <h1 className={`text-lg md:text-xl lg:text-2xl font-bold transition-colors duration-300 truncate ${
              isScrolled ? "text-black" : "text-white"
            }`}>
              {navContent.eventName}
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:mx-20 items-center space-x-4 xl:space-x-8">
            {defaultHeaderContent.navItems.map((item, index) => (
              <div key={index} className="flex flex-col">
                <button
                  onClick={() => scrollToSection(item.href)}
                  className={`relative font-medium transition-colors duration-300 group text-sm xl:text-base ${
                    isScrolled
                      ? "text-black hover:text-[#FF0000]"
                      : "text-white hover:text-[#FFD400]"
                  }`}
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FF0000] transition-all duration-300 group-hover:w-full"></span>
                </button>
              </div>
            ))}
          </div>

          {/* CTA Button (Desktop) */}
          <div className="hidden lg:block">
            <a
              href={"#contact"}
              className="bg-[#FF0000] hover:bg-[#FF0000]/90 text-white px-4 py-2 xl:px-6 xl:py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 text-sm xl:text-base"
            >
              {navContent.ctaText}
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 ${
              isScrolled ? "text-black" : "text-white"
            }`}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 py-4 bg-white/95 backdrop-blur-md rounded-lg shadow-lg">
            {defaultHeaderContent.navItems.map((item, index) => (
              <button
                key={index}
                onClick={() => scrollToSection(item.href)}
                className="block w-full text-left px-4 py-3 text-black hover:text-[#FF0000] hover:bg-gray-100 transition-colors"
              >
                {item.name}
              </button>
            ))}
            <div className="px-4 mt-4">
              <a
                href={"#contact"}
                className="block w-full bg-[#FF0000] hover:bg-[#FF0000]/90 text-white px-6 py-3 rounded-full font-semibold transition-colors text-center"
              >
                {navContent.ctaText}
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;