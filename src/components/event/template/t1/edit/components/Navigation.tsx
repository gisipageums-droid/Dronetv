import React, { useState, useEffect } from "react";
import { Menu, X, Edit, Save } from "lucide-react";

interface NavigationProps {
  headerData?: {
    eventName: string;
    ctaText: string;
    navItems: Array<{
      name: string;
      href: string;
    }>;
  };
  onStateChange?: (data: any) => void;
}

const Navigation: React.FC<NavigationProps> = ({
  headerData,
  onStateChange,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Initialize with prop data or default values
  const [navContent, setNavContent] = useState({
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
    ],
  });

  const [backupContent, setBackupContent] = useState(navContent);

  // Update local state when prop data changes
  useEffect(() => {
    if (headerData) {
      setNavContent(headerData);
      setBackupContent(headerData);
    }
  }, [headerData]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleEditToggle = () => {
    if (!editMode) {
      setBackupContent(navContent);
    } else {
      // When saving, call onStateChange to update parent component
      if (onStateChange) {
        onStateChange(navContent);
      }
    }
    setEditMode(!editMode);
  };

  const handleCancel = () => {
    setNavContent(backupContent);
    setEditMode(false);
  };

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
        {/* Edit/Save/Cancel Buttons - Responsive */}
        <div className="absolute top-2 right-4 z-30 flex gap-2">
          {editMode ? (
            <>
              <button
                onClick={handleEditToggle}
                className="flex items-center gap-1 bg-green-600 text-white px-2 py-1 md:px-4 md:py-2 rounded-lg hover:bg-green-700 transition text-xs md:text-sm"
              >
                <Save size={16} className="md:w-[18px] md:h-[18px]" />
                <span className="hidden sm:inline">Save</span>
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-1 bg-red-600 text-white px-2 py-1 md:px-4 md:py-2 rounded-lg hover:bg-red-700 transition text-xs md:text-sm"
              >
                <X size={16} className="md:w-[18px] md:h-[18px]" />
                <span className="hidden sm:inline">Cancel</span>
              </button>
            </>
          ) : (
            <button
              onClick={handleEditToggle}
              className="flex items-center gap-1 bg-black/60 text-white px-2 py-1 md:px-4 md:py-2 rounded-lg border border-white/30 hover:bg-black/80 transition text-xs md:text-sm"
            >
              <Edit size={16} className="md:w-[18px] md:h-[18px]" />
              <span className="hidden sm:inline">Edit</span>
            </button>
          )}
        </div>

        <div className="flex lg:mx-20 items-center justify-between">
          {/* Event Name */}
          <div className="flex items-center flex-1 mr-4">
            {editMode ? (
              <div className="flex flex-col w-full max-w-xs">
                <input
                  type="text"
                  value={navContent.eventName}
                  onChange={(e) =>
                    setNavContent({ ...navContent, eventName: e.target.value })
                  }
                  placeholder="Event Name"
                  maxLength={50}
                  className="bg-white text-black px-2 py-1 md:px-3 md:py-2 rounded-md text-sm md:text-lg font-bold w-full"
                />
                <div className="text-xs text-gray-500 mt-1 text-right">
                  {navContent.eventName.length}/50
                </div>
              </div>
            ) : (
              <h1
                className={`text-lg md:text-xl lg:text-2xl font-bold transition-colors duration-300 truncate ${
                  isScrolled ? "text-black" : "text-white"
                }`}
              >
                {navContent.eventName}
              </h1>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:mx-20 items-center space-x-4 xl:space-x-8">
            {navContent.navItems.map((item, index) => (
              <div key={index} className="flex flex-col">
                {editMode ? (
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-col">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => {
                          const newNavItems = [...navContent.navItems];
                          newNavItems[index] = {
                            ...item,
                            name: e.target.value,
                          };
                          setNavContent({
                            ...navContent,
                            navItems: newNavItems,
                          });
                        }}
                        maxLength={50}
                        className="bg-white text-black px-2 py-1 rounded-md text-xs w-20"
                        placeholder="Name"
                      />
                      <div className="text-xs text-gray-500 text-right">
                        {item.name.length}/50
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <input
                        type="text"
                        value={item.href}
                        onChange={(e) => {
                          const newNavItems = [...navContent.navItems];
                          newNavItems[index] = {
                            ...item,
                            href: e.target.value,
                          };
                          setNavContent({
                            ...navContent,
                            navItems: newNavItems,
                          });
                        }}
                        maxLength={50}
                        className="bg-white text-black px-2 py-1 rounded-md text-xs w-20"
                        placeholder="#href"
                      />
                      <div className="text-xs text-gray-500 text-right">
                        {item.href.length}/50
                      </div>
                    </div>
                  </div>
                ) : (
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
                )}
              </div>
            ))}
          </div>

          {/* CTA Button (Desktop) */}
          <div className="hidden lg:block">
            {editMode ? (
              <div className="flex flex-col gap-2">
                <div className="flex flex-col">
                  <input
                    type="text"
                    value={navContent.ctaText}
                    onChange={(e) =>
                      setNavContent({ ...navContent, ctaText: e.target.value })
                    }
                    placeholder="CTA Text"
                    maxLength={50}
                    className="bg-white text-black px-2 py-1 rounded-md text-xs w-24"
                  />
                  <div className="text-xs text-gray-500 text-right">
                    {navContent.ctaText.length}/50
                  </div>
                </div>
              </div>
            ) : (
              <a
                href={"#contact"}
                className="bg-[#FF0000] hover:bg-[#FF0000]/90 text-white px-4 py-2 xl:px-6 xl:py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 text-sm xl:text-base"
              >
                {navContent.ctaText}
              </a>
            )}
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
            {editMode ? (
              <div className="px-4 space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Edit Navigation
                </h3>
                {navContent.navItems.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <label className="text-xs text-gray-600">
                      Item {index + 1}
                    </label>
                    <div className="flex gap-2">
                      <div className="flex-1 flex flex-col">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => {
                            const newNavItems = [...navContent.navItems];
                            newNavItems[index] = {
                              ...item,
                              name: e.target.value,
                            };
                            setNavContent({
                              ...navContent,
                              navItems: newNavItems,
                            });
                          }}
                          maxLength={100}
                          className="bg-white text-black px-2 py-1 rounded-md text-sm border"
                          placeholder="Name"
                        />
                        <div className="text-xs text-gray-500 text-right mt-1">
                          {item.name.length}/100
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col">
                        <input
                          type="text"
                          value={item.href}
                          onChange={(e) => {
                            const newNavItems = [...navContent.navItems];
                            newNavItems[index] = {
                              ...item,
                              href: e.target.value,
                            };
                            setNavContent({
                              ...navContent,
                              navItems: newNavItems,
                            });
                          }}
                          maxLength={200}
                          className="bg-white text-black px-2 py-1 rounded-md text-sm border"
                          placeholder="#href"
                        />
                        <div className="text-xs text-gray-500 text-right mt-1">
                          {item.href.length}/200
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="space-y-2">
                  <label className="text-xs text-gray-600">CTA Button</label>
                  <div className="flex flex-col">
                    <input
                      type="text"
                      value={navContent.ctaText}
                      onChange={(e) =>
                        setNavContent({
                          ...navContent,
                          ctaText: e.target.value,
                        })
                      }
                      placeholder="CTA Text"
                      maxLength={50}
                      className="w-full bg-white text-black px-2 py-1 rounded-md text-sm border"
                    />
                    <div className="text-xs text-gray-500 text-right mt-1">
                      {navContent.ctaText.length}/50
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {navContent.navItems.map((item, index) => (
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
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
