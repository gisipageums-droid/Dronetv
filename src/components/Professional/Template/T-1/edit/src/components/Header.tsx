// import React, { useState, useEffect, useMemo } from "react";
// import { motion } from "framer-motion";
// import {
//   Sun,
//   Moon,
//   Menu,
//   X,
//   Edit,
//   Save,
//   X as CloseIcon,
//   Plus,
// } from "lucide-react";
// import { useDarkMode } from "../context/DarkModeContext";
// import { toast } from "sonner";

// export interface HeaderContent {
//   logoText: string;
//   navLinks: Array<{
//     href: string;
//     label: string;
//   }>;
// }

// interface NavbarProps {
//   content: HeaderContent;
//   onSave: (updatedContent: HeaderContent) => void;
//   userId?: string;
// }

// const Navbar: React.FC<NavbarProps> = ({ content, onSave }) => {
//   const { isDarkMode, toggleDarkMode } = useDarkMode();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [activeLink, setActiveLink] = useState("#home");
//   const [isEditing, setIsEditing] = useState(false);
//   const [editedContent, setEditedContent] = useState<HeaderContent>(
//     content || { logoText: "", navLinks: [] }
//   );

//   const navLinks = useMemo(
//     () => editedContent.navLinks || [],
//     [editedContent.navLinks]
//   );

//   // Sync external updates
//   useEffect(() => {
//     setEditedContent(content || { logoText: "", navLinks: [] });
//   }, [content]);

//   // Scroll detection
//   useEffect(() => {
//     const handleScroll = () => setIsScrolled(window.scrollY > 10);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // Track section in view - FIXED VERSION
//   useEffect(() => {
//     // Skip observation if in editing mode or if navLinks is empty
//     if (isEditing || navLinks.length === 0) return;

//     const sections = navLinks
//       .map((link) => {
//         // Only query selector if href is valid and not empty
//         if (link.href && link.href.startsWith("#") && link.href.length > 1) {
//           const element = document.querySelector(link.href);
//           return element ? element : null;
//         }
//         return null;
//       })
//       .filter(Boolean) as HTMLElement[];

//     // If no valid sections found, return early
//     if (sections.length === 0) return;

//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) setActiveLink(`#${entry.target.id}`);
//         });
//       },
//       { threshold: 0.6 }
//     );

//     sections.forEach((section) => observer.observe(section));
//     return () => {
//       sections.forEach((section) => observer.unobserve(section));
//       observer.disconnect();
//     };
//   }, [navLinks, isEditing]); // Add isEditing as dependency

//   const scrollToSection = (href: string) => {
//     // Only scroll if href is valid and not empty
//     if (href && href.startsWith("#") && href.length > 1) {
//       const element = document.querySelector(href);
//       element?.scrollIntoView({ behavior: "smooth" });
//       setActiveLink(href);
//     }
//     setIsMenuOpen(false);
//   };

//   const handleSave = () => {
//     const validatedContent = {
//       ...editedContent,
//       navLinks: editedContent.navLinks
//         .map((link) => ({
//           ...link,
//           href: link.href.startsWith("#") ? link.href : `#${link.href}`,
//         }))
//         .filter((link) => link.href && link.href.length > 1), // Filter out invalid hrefs
//     };

//     onSave(validatedContent);
//     toast.success("Header section updated");
//     setIsEditing(false);
//   };

//   const handleCancel = () => {
//     setEditedContent(content);
//     toast.success("Cancel updatetion");
//     setIsEditing(false);
//   };

//   const updateNavLink = (
//     index: number,
//     field: "href" | "label",
//     value: string
//   ) => {
//     const updatedLinks = [...editedContent.navLinks];
//     updatedLinks[index] = { ...updatedLinks[index], [field]: value };
//     setEditedContent({ ...editedContent, navLinks: updatedLinks });
//   };

//   const addNavLink = () => {
//     const newLinks = [
//       ...(editedContent.navLinks || []),
//       { href: "#new-section", label: "New Link" },
//     ];
//     setEditedContent({ ...editedContent, navLinks: newLinks });
//   };

//   const removeNavLink = (index: number) => {
//     const filteredLinks = editedContent.navLinks.filter((_, i) => i !== index);
//     setEditedContent({ ...editedContent, navLinks: filteredLinks });
//   };

//   return (
//     <>
//       <motion.nav
//         initial={{ y: -100, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.3 }}
//         className={`fixed top-16 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-sm ${
//           isScrolled
//             ? "bg-white/80 dark:bg-gray-900/80 shadow-lg backdrop-blur-xl"
//             : "bg-surface-card dark:bg-gray-900"
//         }`}
//       >
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className={`flex justify-between items-center h-20 py-2`}>
//             {/* Logo */}
//             <motion.div
//               whileHover={{ scale: 1.05 }}
//               className="flex items-center space-x-2 cursor-pointer min-w-0 flex-shrink-0 text-status-info dark:text-orange-500"
//               onClick={() => scrollToSection("#home")}
//             >
//               <div className="rounded-full bg-brand-gold text-ink h-10 w-10 text-2xl font-extrabold flex items-center justify-center p-2">
//                 <span className="uppercase">
//                   {editedContent.logoText[0] || "P"}
//                 </span>
//               </div>
//               {isEditing ? (
//                 <div className="relative">
//                   <input
//                     type="text"
//                     value={editedContent.logoText}
//                     onChange={(e) => {
//                       if (e.target.value.length <= 50) {
//                         setEditedContent({
//                           ...editedContent,
//                           logoText: e.target.value,
//                         });
//                       }
//                     }}
//                     className="text-xl font-bold bg-surface-card dark:bg-gray-800 text-ink-charcoal dark:text-gray-100 px-3 py-1 rounded max-w-[150px] border-2 border-dashed border-status-warning/40 focus:border-status-warning focus:outline-none"
//                     placeholder="Logo text"
//                     maxLength={50}
//                   />
//                   <div className="absolute -bottom-6 right-0 text-xs text-ink-caption">
//                     {editedContent.logoText.length}/50
//                   </div>
//                 </div>
//               ) : (
//                 <span className="text-2xl font-bold truncate capitalize text-brand-gold">
//                   {editedContent.logoText || "MyLogo"}
//                 </span>
//               )}
//             </motion.div>

//             {/* Desktop Navigation (Fixed overflow/wrap) */}
//             <div
//               className={`hidden md:flex items-center justify-center space-x-2 flex-1 mx-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600`}
//             >
//               {navLinks.map((link, index) => (
//                 <motion.div
//                   key={index}
//                   whileHover={!isEditing ? { y: -2 } : {}}
//                   className="flex-shrink-0"
//                 >
//                   <button
//                     onClick={() => scrollToSection(link.href)}
//                     className={`relative px-3 py-2 rounded-md font-medium transition-colors whitespace-nowrap ${
//                       activeLink === link.href
//                         ? "text-status-warning"
//                         : "text-ink-paragraph dark:text-gray-300 hover:text-status-warning"
//                     }`}
//                   >
//                     {link.label}
//                     {activeLink === link.href && (
//                       <motion.div
//                         layoutId="activeTab"
//                         className="absolute inset-0 rounded-md bg-status-warning/10"
//                       />
//                     )}
//                   </button>
//                 </motion.div>
//               ))}
//             </div>

//             {/* Right Section */}
//             <div className="flex items-center space-x-3 flex-shrink-0">
//               {isEditing ? (
//                 <>
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={handleSave}
//                     title="Save updates"
//                     className="p-3 bg-status-success text-white rounded-full"
//                   >
//                     <Save className="w-5 h-5" />
//                   </motion.button>
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={handleCancel}
//                     title="Cancel updates"
//                     className="p-3 bg-status-error text-white rounded-full"
//                   >
//                     <CloseIcon className="w-5 h-5" />
//                   </motion.button>
//                 </>
//               ) : (
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => setIsEditing(true)}
//                   title="Edit header"
//                   className="p-3 bg-ink-caption/50 text-white rounded-full"
//                 >
//                   <Edit className="w-5 h-5" />
//                 </motion.button>
//               )}

//               {!isEditing && (
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={toggleDarkMode}
//                   className="hidden md:inline-block p-3 rounded-full bg-ink-light dark:bg-gray-800 text-ink-paragraph dark:text-gray-300 flex-shrink-0"
//                 >
//                   {isDarkMode ? (
//                     <Sun className="w-5 h-5" />
//                   ) : (
//                     <Moon className="w-5 h-5" />
//                   )}
//                 </motion.button>
//               )}

//               {/* Mobile menu toggle */}
//               <button
//                 onClick={() => setIsMenuOpen(!isMenuOpen)}
//                 className="md:hidden p-2 rounded-md text-ink-paragraph dark:text-gray-300 flex-shrink-0"
//               >
//                 {isMenuOpen ? (
//                   <X className="w-6 h-6" />
//                 ) : (
//                   <Menu className="w-6 h-6" />
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* Mobile Menu */}
//           {isMenuOpen && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: "auto" }}
//               exit={{ opacity: 0, height: 0 }}
//               className="md:hidden border-t border-ink-light dark:border-gray-800 overflow-hidden"
//             >
//               <div className="px-2 pt-2 pb-3 space-y-2">
//                 {navLinks.map((link, index) => (
//                   <div
//                     key={index}
//                     className={`flex flex-col space-y-2 p-3 rounded-lg ${
//                       isEditing
//                         ? "bg-ink-light dark:bg-gray-800 border-2 border-status-warning/25 dark:border-orange-900"
//                         : "bg-ink-offwhite dark:bg-gray-800"
//                     }`}
//                   >
//                     {isEditing ? (
//                       <>
//                         <div className="flex items-center space-x-2">
//                           <div className="relative flex-1">
//                             <input
//                               type="text"
//                               value={link.label}
//                               onChange={(e) => {
//                                 if (e.target.value.length <= 50) {
//                                   updateNavLink(index, "label", e.target.value);
//                                 }
//                               }}
//                               className="w-full bg-surface-card dark:bg-gray-700 border border-status-warning/40 dark:border-orange-700 focus:outline-none focus:ring-2 focus:ring-status-warning px-2 py-2 rounded text-ink-charcoal dark:text-gray-100"
//                               placeholder="Link label"
//                               maxLength={50}
//                             />
//                             <div className="absolute -bottom-5 right-0 text-xs text-ink-caption">
//                               {link.label.length}/50
//                             </div>
//                           </div>
//                           <button
//                             onClick={() => removeNavLink(index)}
//                             className="text-status-error hover:text-status-error hover:bg-status-error/10 dark:hover:bg-red-900/20 p-2 flex-shrink-0 rounded transition-colors"
//                           >
//                             <CloseIcon className="w-5 h-5" />
//                           </button>
//                         </div>
//                         <div className="relative">
//                           <input
//                             type="text"
//                             value={link.href}
//                             onChange={(e) => {
//                               if (e.target.value.length <= 50) {
//                                 updateNavLink(index, "href", e.target.value);
//                               }
//                             }}
//                             className="w-full bg-surface-card dark:bg-gray-700 border border-status-warning/40 dark:border-orange-700 focus:outline-none focus:ring-2 focus:ring-status-warning px-2 py-2 rounded text-sm text-ink-paragraph dark:text-gray-400"
//                             placeholder="#section-id"
//                             maxLength={50}
//                           />
//                           <div className="absolute -bottom-5 right-0 text-xs text-ink-caption">
//                             {link.href.length}/50
//                           </div>
//                         </div>
//                       </>
//                     ) : (
//                       <button
//                         onClick={() => scrollToSection(link.href)}
//                         className={`w-full text-left px-3 py-2 rounded-md text-base ${
//                           activeLink === link.href
//                             ? "text-status-warning font-semibold bg-status-warning/10 dark:bg-orange-900/20"
//                             : "text-ink-paragraph dark:text-gray-300 hover:text-status-warning"
//                         }`}
//                       >
//                         {link.label}
//                       </button>
//                     )}
//                   </div>
//                 ))}
//                 {isEditing && (
//                   <button
//                     onClick={addNavLink}
//                     className="w-full flex items-center justify-center gap-2 px-3 py-3 text-status-success hover:text-status-success hover:bg-status-success/10 dark:hover:bg-green-900/20 font-medium border-2 border-dashed border-status-success/40 dark:border-green-700 rounded-lg transition-colors"
//                   >
//                     <Plus className="w-5 h-5" /> Add New Link
//                   </button>
//                 )}
//               </div>
//             </motion.div>
//           )}
//         </div>
//       </motion.nav>
//     </>
//   );
// };

// export default Navbar;

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
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
  Loader2,
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

  // Auto-save states
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);

  // Auto-save timeout ref
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Track if component is mounted to prevent state updates after unmount
  const isMounted = useRef(true);

  const navLinks = useMemo(
    () => editedContent.navLinks || [],
    [editedContent.navLinks]
  );

  // Initialize component mount state
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      // Cleanup auto-save timeout on unmount
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  // Sync external updates
  useEffect(() => {
    setEditedContent(content || { logoText: "", navLinks: [] });
    setHasUnsavedChanges(false);
  }, [content]);

  // Auto-save effect
  useEffect(() => {
    // Don't auto-save if not editing or no unsaved changes
    if (!isEditing || !hasUnsavedChanges) return;

    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Set new timeout for auto-save
    autoSaveTimeoutRef.current = setTimeout(() => {
      performAutoSave();
    }, 2000); // 2-second delay

    // Cleanup timeout on unmount or dependency change
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [editedContent, hasUnsavedChanges, isEditing]);

  // Perform auto-save
  const performAutoSave = useCallback(async () => {
    if (!isMounted.current || !hasUnsavedChanges) return;

    try {
      setIsAutoSaving(true);

      const validatedContent = {
        ...editedContent,
        navLinks: editedContent.navLinks
          .map((link) => ({
            ...link,
            href: link.href.startsWith("#") ? link.href : `#${link.href}`,
          }))
          .filter((link) => link.href && link.href.length > 1),
      };

      // Call the save function
      onSave(validatedContent);

      // Update state
      setHasUnsavedChanges(false);
      setLastSavedTime(new Date());

      // Show subtle notification
      toast.success("Header changes auto-saved", {
        duration: 1000,
        position: "bottom-right",
      });
    } catch (error) {
      console.error("Auto-save failed:", error);
      toast.error("Auto-save failed. Please save manually.");
    } finally {
      if (isMounted.current) {
        setIsAutoSaving(false);
      }
    }
  }, [editedContent, hasUnsavedChanges, onSave]);

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

  // Handle content changes with auto-save tracking
  const handleLogoTextChange = (value: string) => {
    if (value.length <= 50) {
      setEditedContent({
        ...editedContent,
        logoText: value,
      });
      setHasUnsavedChanges(true);
    }
  };

  const updateNavLink = (
    index: number,
    field: "href" | "label",
    value: string
  ) => {
    const updatedLinks = [...editedContent.navLinks];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setEditedContent({ ...editedContent, navLinks: updatedLinks });
    setHasUnsavedChanges(true);
  };

  const addNavLink = () => {
    const newLinks = [
      ...(editedContent.navLinks || []),
      { href: "#new-section", label: "New Link" },
    ];
    setEditedContent({ ...editedContent, navLinks: newLinks });
    setHasUnsavedChanges(true);
  };

  const removeNavLink = (index: number) => {
    const filteredLinks = editedContent.navLinks.filter((_, i) => i !== index);
    setEditedContent({ ...editedContent, navLinks: filteredLinks });
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    const validatedContent = {
      ...editedContent,
      navLinks: editedContent.navLinks
        .map((link) => ({
          ...link,
          href: link.href.startsWith("#") ? link.href : `#${link.href}`,
        }))
        .filter((link) => link.href && link.href.length > 1),
    };

    onSave(validatedContent);
    setHasUnsavedChanges(false);
    setLastSavedTime(new Date());
    toast.success("Header section updated");
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedContent(content);
    setHasUnsavedChanges(false);
    toast.info("Changes discarded");
    setIsEditing(false);
  };

  const handleEditStart = () => {
    setIsEditing(true);
    setHasUnsavedChanges(false);
  };

  // Format last saved time for display
  const formatLastSavedTime = () => {
    if (!lastSavedTime) return "Never";

    const now = new Date();
    const diffInSeconds = Math.floor(
      (now.getTime() - lastSavedTime.getTime()) / 1000
    );

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return lastSavedTime.toLocaleDateString();
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
            : "bg-surface-card dark:bg-gray-900"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex justify-between items-center h-20 py-2`}>
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 cursor-pointer min-w-0 flex-shrink-0 text-status-info dark:text-orange-500"
              onClick={() => scrollToSection("#home")}
            >
              <div className="rounded-full bg-brand-gold text-ink h-10 w-10 text-2xl font-extrabold flex items-center justify-center p-2">
                <span className="uppercase">
                  {editedContent.logoText[0] || "P"}
                </span>
              </div>
              {isEditing ? (
                <div className="relative">
                  <input
                    type="text"
                    value={editedContent.logoText}
                    onChange={(e) => handleLogoTextChange(e.target.value)}
                    className="text-xl font-bold bg-surface-card dark:bg-gray-800 text-ink-charcoal dark:text-gray-100 px-3 py-1 rounded max-w-[150px] border-2 border-dashed border-status-warning/40 focus:border-status-warning focus:outline-none"
                    placeholder="Logo text"
                    maxLength={50}
                  />
                  <div className="absolute -bottom-6 right-0 text-xs text-ink-caption">
                    {editedContent.logoText.length}/50
                  </div>
                </div>
              ) : (
                <span className="text-2xl font-bold truncate capitalize text-brand-gold">
                  {editedContent.logoText || "MyLogo"}
                </span>
              )}
            </motion.div>

            {/* Desktop Navigation (Fixed overflow/wrap) */}
            <div
              className={`hidden md:flex items-center justify-center space-x-2 flex-1 mx-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600`}
            >
              {navLinks.map((link, index) => (
                <motion.div
                  key={index}
                  whileHover={!isEditing ? { y: -2 } : {}}
                  className="flex-shrink-0"
                >
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className={`relative px-3 py-2 rounded-md font-medium transition-colors whitespace-nowrap ${
                      activeLink === link.href
                        ? "text-status-warning"
                        : "text-ink-paragraph dark:text-gray-300 hover:text-status-warning"
                    }`}
                  >
                    {link.label}
                    {activeLink === link.href && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 rounded-md bg-status-warning/10"
                      />
                    )}
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              {isEditing ? (
                <>
                  {/* Auto-save indicator */}
                  <div className="hidden md:flex items-center gap-2 mr-2 text-sm text-ink-caption dark:text-gray-400">
                    {isAutoSaving ? (
                      <div className="flex items-center gap-1">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </div>
                    ) : hasUnsavedChanges ? (
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-brand-gold rounded-full animate-pulse"></div>
                        <span>Unsaved changes</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-status-success rounded-full"></div>
                        <span>Saved {formatLastSavedTime()}</span>
                      </div>
                    )}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    title="Save updates"
                    className="p-3 bg-status-success text-white rounded-full"
                  >
                    <Save className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCancel}
                    title="Cancel updates"
                    className="p-3 bg-status-error text-white rounded-full"
                  >
                    <CloseIcon className="w-5 h-5" />
                  </motion.button>
                </>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEditStart}
                  title="Edit header"
                  className="p-3 bg-ink-caption/50 text-white rounded-full"
                >
                  <Edit className="w-5 h-5" />
                </motion.button>
              )}

              {!isEditing && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleDarkMode}
                  className="hidden md:inline-block p-3 rounded-full bg-ink-light dark:bg-gray-800 text-ink-paragraph dark:text-gray-300 flex-shrink-0"
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
                className="md:hidden p-2 rounded-md text-ink-paragraph dark:text-gray-300 flex-shrink-0"
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
              className="md:hidden border-t border-ink-light dark:border-gray-800 overflow-hidden"
            >
              {/* Mobile Auto-save indicator */}
              {isEditing && (
                <div className="px-4 py-2 bg-ink-light dark:bg-gray-800 border-b border-ink-light dark:border-gray-700">
                  <div className="flex items-center gap-2 text-sm text-ink-caption dark:text-gray-400">
                    {isAutoSaving ? (
                      <div className="flex items-center gap-1">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </div>
                    ) : hasUnsavedChanges ? (
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-brand-gold rounded-full animate-pulse"></div>
                        <span>Unsaved changes</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-status-success rounded-full"></div>
                        <span>Saved {formatLastSavedTime()}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="px-2 pt-2 pb-3 space-y-2">
                {navLinks.map((link, index) => (
                  <div
                    key={index}
                    className={`flex flex-col space-y-2 p-3 rounded-lg ${
                      isEditing
                        ? "bg-ink-light dark:bg-gray-800 border-2 border-status-warning/25 dark:border-orange-900"
                        : "bg-ink-offwhite dark:bg-gray-800"
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
                              className="w-full bg-surface-card dark:bg-gray-700 border border-status-warning/40 dark:border-orange-700 focus:outline-none focus:ring-2 focus:ring-status-warning px-2 py-2 rounded text-ink-charcoal dark:text-gray-100"
                              placeholder="Link label"
                              maxLength={50}
                            />
                            <div className="absolute -bottom-5 right-0 text-xs text-ink-caption">
                              {link.label.length}/50
                            </div>
                          </div>
                          <button
                            onClick={() => removeNavLink(index)}
                            className="text-status-error hover:text-status-error hover:bg-status-error/10 dark:hover:bg-red-900/20 p-2 flex-shrink-0 rounded transition-colors"
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
                            className="w-full bg-surface-card dark:bg-gray-700 border border-status-warning/40 dark:border-orange-700 focus:outline-none focus:ring-2 focus:ring-status-warning px-2 py-2 rounded text-sm text-ink-paragraph dark:text-gray-400"
                            placeholder="#section-id"
                            maxLength={50}
                          />
                          <div className="absolute -bottom-5 right-0 text-xs text-ink-caption">
                            {link.href.length}/50
                          </div>
                        </div>
                      </>
                    ) : (
                      <button
                        onClick={() => scrollToSection(link.href)}
                        className={`w-full text-left px-3 py-2 rounded-md text-base ${
                          activeLink === link.href
                            ? "text-status-warning font-semibold bg-status-warning/10 dark:bg-orange-900/20"
                            : "text-ink-paragraph dark:text-gray-300 hover:text-status-warning"
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
                    className="w-full flex items-center justify-center gap-2 px-3 py-3 text-status-success hover:text-status-success hover:bg-status-success/10 dark:hover:bg-green-900/20 font-medium border-2 border-dashed border-status-success/40 dark:border-green-700 rounded-lg transition-colors"
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
