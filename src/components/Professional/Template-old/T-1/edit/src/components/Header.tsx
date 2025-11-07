import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Sun,
  Moon,
  Menu,
  X,
  Edit,
  Save,
  X as CloseIcon,
  Plus,
  Trash2,
} from "lucide-react";
import { useDarkMode } from "../context/DarkModeContext";
import { toast } from "sonner";

export interface HeaderContent {
  logoText: string;
  navLinks: Array<{
    href: string;
    label: string;
  }>;
}

interface NavbarProps {
  content: HeaderContent;
  onSave: (updatedContent: HeaderContent) => void;
  userId?: string;
}

const Navbar: React.FC<NavbarProps> = ({ content, onSave }) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("#home");
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState<HeaderContent>(
    content || { logoText: "", navLinks: [] }
  );

  const navLinks = useMemo(
    () => editedContent.navLinks || [],
    [editedContent.navLinks]
  );

  // Sync external updates
  useEffect(() => {
    setEditedContent(content || { logoText: "", navLinks: [] });
  }, [content]);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track section in view - FIXED VERSION
  useEffect(() => {
    // Skip observation if in editing mode or if navLinks is empty
    if (isEditing || navLinks.length === 0) return;

    const sections = navLinks
      .map((link) => {
        // Only query selector if href is valid and not empty
        if (link.href && link.href.startsWith("#") && link.href.length > 1) {
          const element = document.querySelector(link.href);
          return element ? element : null;
        }
        return null;
      })
      .filter(Boolean) as HTMLElement[];

    // If no valid sections found, return early
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveLink(`#${entry.target.id}`);
        });
      },
      { threshold: 0.6 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => {
      sections.forEach((section) => observer.unobserve(section));
      observer.disconnect();
    };
  }, [navLinks, isEditing]); // Add isEditing as dependency

  const scrollToSection = (href: string) => {
    // Only scroll if href is valid and not empty
    if (href && href.startsWith("#") && href.length > 1) {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: "smooth" });
      setActiveLink(href);
    }
    setIsMenuOpen(false);
  };

  const handleSave = () => {
    const validatedContent = {
      ...editedContent,
      navLinks: editedContent.navLinks
        .map((link) => ({
          ...link,
          href: link.href.startsWith("#") ? link.href : `#${link.href}`,
        }))
        .filter((link) => link.href && link.href.length > 1), // Filter out invalid hrefs
    };

    onSave(validatedContent);
    toast.success("Header section updated");
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedContent(content);
    toast.success("Cancel updatetion");
    setIsEditing(false);
  };

  const updateNavLink = (
    index: number,
    field: "href" | "label",
    value: string
  ) => {
    const updatedLinks = [...editedContent.navLinks];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setEditedContent({ ...editedContent, navLinks: updatedLinks });
  };

  const addNavLink = () => {
    const newLinks = [
      ...(editedContent.navLinks || []),
      { href: "#new-section", label: "New Link" },
    ];
    setEditedContent({ ...editedContent, navLinks: newLinks });
  };

  const removeNavLink = (index: number) => {
    const filteredLinks = editedContent.navLinks.filter((_, i) => i !== index);
    setEditedContent({ ...editedContent, navLinks: filteredLinks });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-16 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-sm ${
          isScrolled
            ? "bg-white/80 dark:bg-gray-900/80 shadow-lg backdrop-blur-xl"
            : "bg-white dark:bg-gray-900"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`flex justify-between items-center ${
              isEditing ? "h-80" : "h-20"
            } py-2`}
          >
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 cursor-pointer min-w-0 flex-shrink-0 text-blue-500 dark:text-orange-500"
              onClick={() => scrollToSection("#home")}
            >
              <div className="rounded-full bg-yellow-500 text-white h-10 w-10 text-2xl font-extrabold flex items-center justify-center p-2">
                <span className="uppercase">
                  {editedContent.logoText[0] || "P"}
                </span>
              </div>
              {isEditing ? (
                <div className="relative">
                  <input
                    type="text"
                    value={editedContent.logoText}
                    onChange={(e) => {
                      if (e.target.value.length <= 50) {
                        setEditedContent({
                          ...editedContent,
                          logoText: e.target.value,
                        });
                      }
                    }}
                    className="text-xl font-bold bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-3 py-1 rounded max-w-[150px] border-2 border-dashed border-orange-300 focus:border-orange-500 focus:outline-none"
                    placeholder="Logo text"
                    maxLength={50}
                  />
                  <div className="absolute -bottom-6 right-0 text-xs text-gray-500">
                    {editedContent.logoText.length}/50
                  </div>
                </div>
              ) : (
                <span className="text-2xl font-bold truncate capitalize text-yellow-500">
                  {editedContent.logoText || "MyLogo"}
                </span>
              )}
            </motion.div>

            {/* Desktop Navigation (Fixed overflow/wrap) */}
            <div
              className={`hidden md:flex items-center ${
                isEditing
                  ? "flex-wrap justify-start gap-3"
                  : "justify-center space-x-2"
              } flex-1 mx-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600`}
            >
              {navLinks.map((link, index) => (
                <motion.div
                  key={index}
                  whileHover={!isEditing ? { y: -2 } : {}}
                  className="flex-shrink-0"
                >
                  {isEditing ? (
                    <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg border-2 border-orange-200 dark:border-orange-900 min-w-[180px]">
                      <div className="flex flex-col space-y-1 flex-1">
                        <div className="relative">
                          <input
                            type="text"
                            value={link.label}
                            onChange={(e) => {
                              if (e.target.value.length <= 50) {
                                updateNavLink(index, "label", e.target.value);
                              }
                            }}
                            className="bg-white dark:bg-gray-700 border border-orange-300 dark:border-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm w-full px-2 py-1 rounded text-gray-800 dark:text-gray-100"
                            placeholder="Link label"
                            maxLength={50}
                          />
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            value={link.href}
                            onChange={(e) => {
                              if (e.target.value.length <= 50) {
                                updateNavLink(index, "href", e.target.value);
                              }
                            }}
                            className="bg-white dark:bg-gray-700 border border-orange-300 dark:border-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs w-full px-2 py-1 rounded text-gray-600 dark:text-gray-400"
                            placeholder="#section-id"
                            maxLength={50}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-col">
                        <button
                          onClick={() => removeNavLink(index)}
                          className="w-8 h-10 bg-red-500 flex items-center justify-center rounded-md flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className=" text-xs text-gray-500">
                          {link.label.length}/50
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className={`relative px-3 py-2 rounded-md font-medium transition-colors whitespace-nowrap ${
                        activeLink === link.href
                          ? "text-orange-500"
                          : "text-gray-700 dark:text-gray-300 hover:text-orange-500"
                      }`}
                    >
                      {link.label}
                      {activeLink === link.href && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 rounded-md bg-orange-500/10"
                        />
                      )}
                    </button>
                  )}
                </motion.div>
              ))}

              {isEditing && (
                <button
                  onClick={addNavLink}
                  className="flex items-center justify-center gap-1 px-3 py-2 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 font-medium border-2 border-dashed border-green-300 dark:border-green-700 rounded-lg transition-colors min-w-[120px] h-[64px]"
                >
                  <Plus className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              {isEditing ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    title="Save updates"
                    className="p-3 bg-green-500 text-white rounded-full"
                  >
                    <Save className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCancel}
                    title="Cancel updates"
                    className="p-3 bg-red-500 text-white rounded-full"
                  >
                    <CloseIcon className="w-5 h-5" />
                  </motion.button>
                </>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(true)}
                  title="Edit header"
                  className="p-3 bg-gray-500/50 text-white rounded-full"
                >
                  <Edit className="w-5 h-5" />
                </motion.button>
              )}

              {!isEditing && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleDarkMode}
                  className="hidden md:inline-block p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 flex-shrink-0"
                >
                  {isDarkMode ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </motion.button>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 flex-shrink-0"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 dark:border-gray-800 overflow-hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-2">
                {navLinks.map((link, index) => (
                  <div
                    key={index}
                    className={`flex flex-col space-y-2 p-3 rounded-lg ${
                      isEditing
                        ? "bg-gray-100 dark:bg-gray-800 border-2 border-orange-200 dark:border-orange-900"
                        : "bg-gray-50 dark:bg-gray-800"
                    }`}
                  >
                    {isEditing ? (
                      <>
                        <div className="flex items-center space-x-2">
                          <div className="relative flex-1">
                            <input
                              type="text"
                              value={link.label}
                              onChange={(e) => {
                                if (e.target.value.length <= 50) {
                                  updateNavLink(index, "label", e.target.value);
                                }
                              }}
                              className="w-full bg-white dark:bg-gray-700 border border-orange-300 dark:border-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 px-2 py-2 rounded text-gray-800 dark:text-gray-100"
                              placeholder="Link label"
                              maxLength={50}
                            />
                            <div className="absolute -bottom-5 right-0 text-xs text-gray-500">
                              {link.label.length}/50
                            </div>
                          </div>
                          <button
                            onClick={() => removeNavLink(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 flex-shrink-0 rounded transition-colors"
                          >
                            <CloseIcon className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            value={link.href}
                            onChange={(e) => {
                              if (e.target.value.length <= 50) {
                                updateNavLink(index, "href", e.target.value);
                              }
                            }}
                            className="w-full bg-white dark:bg-gray-700 border border-orange-300 dark:border-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 px-2 py-2 rounded text-sm text-gray-600 dark:text-gray-400"
                            placeholder="#section-id"
                            maxLength={50}
                          />
                          <div className="absolute -bottom-5 right-0 text-xs text-gray-500">
                            {link.href.length}/50
                          </div>
                        </div>
                      </>
                    ) : (
                      <button
                        onClick={() => scrollToSection(link.href)}
                        className={`w-full text-left px-3 py-2 rounded-md text-base ${
                          activeLink === link.href
                            ? "text-orange-500 font-semibold bg-orange-50 dark:bg-orange-900/20"
                            : "text-gray-700 dark:text-gray-300 hover:text-orange-500"
                        }`}
                      >
                        {link.label}
                      </button>
                    )}
                  </div>
                ))}
                {isEditing && (
                  <button
                    onClick={addNavLink}
                    className="w-full flex items-center justify-center gap-2 px-3 py-3 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 font-medium border-2 border-dashed border-green-300 dark:border-green-700 rounded-lg transition-colors"
                  >
                    <Plus className="w-5 h-5" /> Add New Link
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </motion.nav>
    </>
  );
};

export default Navbar;
