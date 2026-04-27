// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { Save, X, Edit } from "lucide-react";
// import { toast } from "sonner";

// export interface SocialLink {
//   name: string;
//   href: string;
//   icon: "Github" | "Linkedin" | "Mail";
// }

// export interface LinkItem {
//   href: string;
//   label: string;
// }

// export interface NewsletterContent {
//   title: string;
//   description: string;
//   placeholder: string;
//   buttonText: string;
// }

// export interface BottomSectionContent {
//   copyrightText: string;
//   afterCopyrightText: string;
//   privacyPolicy: LinkItem;
//   termsOfService: LinkItem;
// }

// export interface FooterContent {
//   personalInfo: {
//     name: string;
//     description: string;
//   };
//   socialLinks: SocialLink[];
//   quickLinks: LinkItem[];
//   moreLinks: LinkItem[];
//   newsletter: NewsletterContent;
//   bottomSection: BottomSectionContent;
// }

// interface FooterProps {
//   content: FooterContent;
//   onSave?: (content: FooterContent) => void;
// }

// // Character limits
// const CHAR_LIMITS = {
//   personalName: 50,
//   personalDescription: 200,
//   socialLink: 100,
//   linkLabel: 30,
//   linkHref: 100,
//   newsletterTitle: 50,
//   newsletterDescription: 120,
//   newsletterPlaceholder: 30,
//   newsletterButton: 20,
//   copyrightText: 50,
//   afterCopyrightText: 50,
//   policyLabel: 30,
// };

// const Footer: React.FC<FooterProps> = ({ content, onSave }) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [editedContent, setEditedContent] = useState<FooterContent>(content);

//   const handleSave = () => {
//     if (onSave) onSave(editedContent);
//     toast.success("Footer updated successfully");
//     setIsEditing(false);
//   };

//   const handleCancel = () => {
//     setEditedContent(content);
//     toast.success("Cancel update");
//     setIsEditing(false);
//   };

//   const scrollToSection = (href: string) => {
//     const element = document.querySelector(href);
//     element?.scrollIntoView({ behavior: "smooth" });
//   };

//   const getCharCountClass = (current: number, limit: number) => {
//     if (current >= limit) return "text-red-500";
//     if (current >= limit * 0.8) return "text-yellow-500";
//     return "text-gray-500";
//   };

//   return (
//     <footer className="bg-dark-300 text-justify border-t border-gray-200 dark:border-gray-800 relative overflow-hidden">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 relative z-10">
//         {onSave && (
//           <div className="absolute top-6 right-6 z-20 flex gap-3">
//             {isEditing ? (
//               <>
//                 <button
//                   onClick={handleSave}
//                   className="p-3 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-md hover:shadow-lg transition-all"
//                   title="Save updates"
//                 >
//                   <Save className="w-5 h-5" />
//                 </button>
//                 <button
//                   onClick={handleCancel}
//                   className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md hover:shadow-lg transition-all"
//                   title="Cancel updates"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </>
//             ) : (
//               <button
//                 onClick={() => setIsEditing(true)}
//                 className="p-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-full shadow-md hover:shadow-lg transition-all"
//                 title="Edit footer section"
//               >
//                 <Edit className="w-5 h-5" />
//               </button>
//             )}
//           </div>
//         )}

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
//           {/* Info Section */}
//           <div className="col-span-1 lg:col-span-2">
//             <motion.div
//               whileHover={{ scale: 1.02 }}
//               className="flex items-center space-x-2 mb-4"
//             >
//               <div className="rounded-full bg-yellow-500 text-white h-10 w-10 text-2xl font-extrabold flex items-center justify-center p-2">
//                 <span className="uppercase">
//                   {content.personalInfo.name[0] || "P"}
//                 </span>
//               </div>

//               {isEditing ? (
//                 <div className="flex flex-col">
//                   <input
//                     type="text"
//                     value={editedContent.personalInfo.name}
//                     onChange={(e) =>
//                       setEditedContent({
//                         ...editedContent,
//                         personalInfo: {
//                           ...editedContent.personalInfo,
//                           name: e.target.value,
//                         },
//                       })
//                     }
//                     maxLength={CHAR_LIMITS.personalName}
//                     className="text-2xl font-bold text-blue-500 dark:text-orange-500 bg-transparent border-b border-orange-400 focus:outline-none"
//                   />
//                   <div
//                     className={`text-xs mt-1 ${getCharCountClass(
//                       editedContent.personalInfo.name.length,
//                       CHAR_LIMITS.personalName
//                     )}`}
//                   >
//                     {editedContent.personalInfo.name.length}/
//                     {CHAR_LIMITS.personalName}
//                   </div>
//                 </div>
//               ) : (
//                 <span className="text-2xl font-bold truncate capitalize text-yellow-500">
//                   {content.personalInfo.name}
//                 </span>
//               )}
//             </motion.div>

//             {isEditing ? (
//               <div className="mb-6">
//                 <textarea
//                   value={editedContent.personalInfo.description}
//                   onChange={(e) =>
//                     setEditedContent({
//                       ...editedContent,
//                       personalInfo: {
//                         ...editedContent.personalInfo,
//                         description: e.target.value,
//                       },
//                     })
//                   }
//                   maxLength={CHAR_LIMITS.personalDescription}
//                   className="w-full bg-gray-800 border border-gray-700 text-gray-300 rounded-lg p-3 focus:border-orange-500 focus:outline-none resize-none"
//                   rows={3}
//                 />
//                 <div
//                   className={`text-xs mt-1 text-right ${getCharCountClass(
//                     editedContent.personalInfo.description.length,
//                     CHAR_LIMITS.personalDescription
//                   )}`}
//                 >
//                   {editedContent.personalInfo.description.length}/
//                   {CHAR_LIMITS.personalDescription}
//                 </div>
//               </div>
//             ) : (
//               <p className="text-gray-400 mb-6 leading-relaxed max-w-md">
//                 {content.personalInfo.description}
//               </p>
//             )}
//           </div>

//           {/* Quick Links */}
//           <div>
//             <h3 className="text-gray-700 dark:text-white font-semibold mb-4">
//               Quick Links
//             </h3>
//             <ul className="space-y-2">
//               {editedContent.quickLinks.map((link, index) => (
//                 <li key={index}>
//                   {isEditing ? (
//                     <div className="flex flex-col gap-1 mb-3">
//                       <div>
//                         <input
//                           type="text"
//                           value={link.label}
//                           onChange={(e) => {
//                             const newQuickLinks = [...editedContent.quickLinks];
//                             newQuickLinks[index].label = e.target.value;
//                             setEditedContent({
//                               ...editedContent,
//                               quickLinks: newQuickLinks,
//                             });
//                           }}
//                           maxLength={CHAR_LIMITS.linkLabel}
//                           className="w-full px-2 py-1 text-sm bg-gray-800 border border-gray-700 rounded text-gray-300 focus:border-orange-500 focus:outline-none"
//                           placeholder="Label"
//                         />
//                         <div
//                           className={`text-xs mt-1 text-right ${getCharCountClass(
//                             link.label.length,
//                             CHAR_LIMITS.linkLabel
//                           )}`}
//                         >
//                           {link.label.length}/{CHAR_LIMITS.linkLabel}
//                         </div>
//                       </div>
//                       <div>
//                         <input
//                           type="text"
//                           value={link.href}
//                           onChange={(e) => {
//                             const newQuickLinks = [...editedContent.quickLinks];
//                             newQuickLinks[index].href = e.target.value;
//                             setEditedContent({
//                               ...editedContent,
//                               quickLinks: newQuickLinks,
//                             });
//                           }}
//                           maxLength={CHAR_LIMITS.linkHref}
//                           className="w-full px-2 py-1 text-sm bg-gray-800 border border-gray-700 rounded text-gray-300 focus:border-orange-500 focus:outline-none"
//                           placeholder="#section"
//                         />
//                         <div
//                           className={`text-xs mt-1 text-right ${getCharCountClass(
//                             link.href.length,
//                             CHAR_LIMITS.linkHref
//                           )}`}
//                         >
//                           {link.href.length}/{CHAR_LIMITS.linkHref}
//                         </div>
//                       </div>
//                     </div>
//                   ) : (
//                     <motion.button
//                       whileHover={{ x: 5 }}
//                       onClick={() => scrollToSection(link.href)}
//                       className="text-gray-400 hover:text-accent-orange transition"
//                     >
//                       {link.label}
//                     </motion.button>
//                   )}
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* More + Newsletter */}
//           <div>
//             <h3 className="text-gray-700 dark:text-white font-semibold mb-4">
//               More
//             </h3>
//             <ul className="space-y-2 mb-6">
//               {editedContent.moreLinks.map((link, index) => (
//                 <li key={index}>
//                   {isEditing ? (
//                     <div className="flex flex-col gap-1 mb-3">
//                       <div>
//                         <input
//                           type="text"
//                           value={link.label}
//                           onChange={(e) => {
//                             const newMoreLinks = [...editedContent.moreLinks];
//                             newMoreLinks[index].label = e.target.value;
//                             setEditedContent({
//                               ...editedContent,
//                               moreLinks: newMoreLinks,
//                             });
//                           }}
//                           maxLength={CHAR_LIMITS.linkLabel}
//                           className="w-full px-2 py-1 text-sm bg-gray-800 border border-gray-700 rounded text-gray-300 focus:border-orange-500 focus:outline-none"
//                           placeholder="Label"
//                         />
//                         <div
//                           className={`text-xs mt-1 text-right ${getCharCountClass(
//                             link.label.length,
//                             CHAR_LIMITS.linkLabel
//                           )}`}
//                         >
//                           {link.label.length}/{CHAR_LIMITS.linkLabel}
//                         </div>
//                       </div>
//                       <div>
//                         <input
//                           type="text"
//                           value={link.href}
//                           onChange={(e) => {
//                             const newMoreLinks = [...editedContent.moreLinks];
//                             newMoreLinks[index].href = e.target.value;
//                             setEditedContent({
//                               ...editedContent,
//                               moreLinks: newMoreLinks,
//                             });
//                           }}
//                           maxLength={CHAR_LIMITS.linkHref}
//                           className="w-full px-2 py-1 text-sm bg-gray-800 border border-gray-700 rounded text-gray-300 focus:border-orange-500 focus:outline-none"
//                           placeholder="#section"
//                         />
//                         <div
//                           className={`text-xs mt-1 text-right ${getCharCountClass(
//                             link.href.length,
//                             CHAR_LIMITS.linkHref
//                           )}`}
//                         >
//                           {link.href.length}/{CHAR_LIMITS.linkHref}
//                         </div>
//                       </div>
//                     </div>
//                   ) : (
//                     <motion.button
//                       whileHover={{ x: 5 }}
//                       onClick={() => scrollToSection(link.href)}
//                       className="text-gray-400 hover:text-accent-orange transition"
//                     >
//                       {link.label}
//                     </motion.button>
//                   )}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Save, X, Edit, Loader2 } from "lucide-react";
import { toast } from "sonner";

export interface SocialLink {
  name: string;
  href: string;
  icon: "Github" | "Linkedin" | "Mail";
}

export interface LinkItem {
  href: string;
  label: string;
}

export interface NewsletterContent {
  title: string;
  description: string;
  placeholder: string;
  buttonText: string;
}

export interface BottomSectionContent {
  copyrightText: string;
  afterCopyrightText: string;
  privacyPolicy: LinkItem;
  termsOfService: LinkItem;
}

export interface FooterContent {
  personalInfo: {
    name: string;
    description: string;
  };
  socialLinks: SocialLink[];
  quickLinks: LinkItem[];
  moreLinks: LinkItem[];
  newsletter: NewsletterContent;
  bottomSection: BottomSectionContent;
}

interface FooterProps {
  content: FooterContent;
  onSave?: (content: FooterContent) => void;
}

// Character limits
const CHAR_LIMITS = {
  personalName: 50,
  personalDescription: 200,
  socialLink: 100,
  linkLabel: 30,
  linkHref: 100,
  newsletterTitle: 50,
  newsletterDescription: 120,
  newsletterPlaceholder: 30,
  newsletterButton: 20,
  copyrightText: 50,
  afterCopyrightText: 50,
  policyLabel: 30,
};

const Footer: React.FC<FooterProps> = ({ content, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState<FooterContent>(content);

  // Auto-save states
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);

  // Auto-save timeout ref
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Track if component is mounted to prevent state updates after unmount
  const isMounted = useRef(true);

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

  // Reset edited content when content prop changes
  useEffect(() => {
    setEditedContent(content);
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
    if (!isMounted.current || !hasUnsavedChanges || !onSave) return;

    try {
      setIsAutoSaving(true);

      // Call the save function
      onSave(editedContent);

      // Update state
      setHasUnsavedChanges(false);
      setLastSavedTime(new Date());

      // Show subtle notification
      toast.success("Footer changes auto-saved", {
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

  // Handle content changes with auto-save tracking
  const handlePersonalInfoChange = (field: string, value: string) => {
    setEditedContent((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
    setHasUnsavedChanges(true);
  };

  const handleQuickLinkChange = (
    index: number,
    field: string,
    value: string
  ) => {
    setEditedContent((prev) => {
      const newQuickLinks = [...prev.quickLinks];
      newQuickLinks[index] = { ...newQuickLinks[index], [field]: value };
      return { ...prev, quickLinks: newQuickLinks };
    });
    setHasUnsavedChanges(true);
  };

  const handleMoreLinkChange = (
    index: number,
    field: string,
    value: string
  ) => {
    setEditedContent((prev) => {
      const newMoreLinks = [...prev.moreLinks];
      newMoreLinks[index] = { ...newMoreLinks[index], [field]: value };
      return { ...prev, moreLinks: newMoreLinks };
    });
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    if (onSave) onSave(editedContent);
    setHasUnsavedChanges(false);
    setLastSavedTime(new Date());
    toast.success("Footer updated successfully");
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

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const getCharCountClass = (current: number, limit: number) => {
    if (current >= limit) return "text-red-500";
    if (current >= limit * 0.8) return "text-yellow-500";
    return "text-gray-500";
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
    <footer className="bg-dark-300 text-justify border-t border-gray-200 dark:border-gray-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 relative z-10">
        {onSave && (
          <div className="absolute top-6 right-6 z-20 flex gap-3 items-center">
            {isEditing ? (
              <>
                {/* Auto-save indicator */}
                <div className="flex items-center gap-2 mr-2 text-sm text-gray-500 dark:text-gray-400">
                  {isAutoSaving ? (
                    <div className="flex items-center gap-1">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </div>
                  ) : hasUnsavedChanges ? (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                      <span>Unsaved changes</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Saved {formatLastSavedTime()}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleSave}
                  className="p-3 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-md hover:shadow-lg transition-all"
                  title="Save updates"
                >
                  <Save className="w-5 h-5" />
                </button>
                <button
                  onClick={handleCancel}
                  className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md hover:shadow-lg transition-all"
                  title="Cancel updates"
                >
                  <X className="w-5 h-5" />
                </button>
              </>
            ) : (
              <button
                onClick={handleEditStart}
                className="p-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-full shadow-md hover:shadow-lg transition-all"
                title="Edit footer section"
              >
                <Edit className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Info Section */}
          <div className="col-span-1 lg:col-span-2">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center space-x-2 mb-4"
            >
              <div className="rounded-full bg-yellow-500 text-white h-10 w-10 text-2xl font-extrabold flex items-center justify-center p-2">
                <span className="uppercase">
                  {editedContent.personalInfo.name[0] || "P"}
                </span>
              </div>

              {isEditing ? (
                <div className="flex flex-col">
                  <input
                    type="text"
                    value={editedContent.personalInfo.name}
                    onChange={(e) =>
                      handlePersonalInfoChange("name", e.target.value)
                    }
                    maxLength={CHAR_LIMITS.personalName}
                    className="text-2xl font-bold text-blue-500 dark:text-orange-500 bg-transparent border-b border-orange-400 focus:outline-none"
                  />
                  <div
                    className={`text-xs mt-1 ${getCharCountClass(
                      editedContent.personalInfo.name.length,
                      CHAR_LIMITS.personalName
                    )}`}
                  >
                    {editedContent.personalInfo.name.length}/
                    {CHAR_LIMITS.personalName}
                  </div>
                </div>
              ) : (
                <span className="text-2xl font-bold truncate capitalize text-yellow-500">
                  {editedContent.personalInfo.name}
                </span>
              )}
            </motion.div>

            {isEditing ? (
              <div className="mb-6">
                <textarea
                  value={editedContent.personalInfo.description}
                  onChange={(e) =>
                    handlePersonalInfoChange("description", e.target.value)
                  }
                  maxLength={CHAR_LIMITS.personalDescription}
                  className="w-full bg-gray-800 border border-gray-700 text-gray-300 rounded-lg p-3 focus:border-orange-500 focus:outline-none resize-none"
                  rows={3}
                />
                <div
                  className={`text-xs mt-1 text-right ${getCharCountClass(
                    editedContent.personalInfo.description.length,
                    CHAR_LIMITS.personalDescription
                  )}`}
                >
                  {editedContent.personalInfo.description.length}/
                  {CHAR_LIMITS.personalDescription}
                </div>
              </div>
            ) : (
              <p className="text-gray-400 mb-6 leading-relaxed max-w-md">
                {editedContent.personalInfo.description}
              </p>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-700 dark:text-white font-semibold mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {editedContent.quickLinks.map((link, index) => (
                <li key={index}>
                  {isEditing ? (
                    <div className="flex flex-col gap-1 mb-3">
                      <div>
                        <input
                          type="text"
                          value={link.label}
                          onChange={(e) =>
                            handleQuickLinkChange(
                              index,
                              "label",
                              e.target.value
                            )
                          }
                          maxLength={CHAR_LIMITS.linkLabel}
                          className="w-full px-2 py-1 text-sm bg-gray-800 border border-gray-700 rounded text-gray-300 focus:border-orange-500 focus:outline-none"
                          placeholder="Label"
                        />
                        <div
                          className={`text-xs mt-1 text-right ${getCharCountClass(
                            link.label.length,
                            CHAR_LIMITS.linkLabel
                          )}`}
                        >
                          {link.label.length}/{CHAR_LIMITS.linkLabel}
                        </div>
                      </div>
                      <div>
                        <input
                          type="text"
                          value={link.href}
                          onChange={(e) =>
                            handleQuickLinkChange(index, "href", e.target.value)
                          }
                          maxLength={CHAR_LIMITS.linkHref}
                          className="w-full px-2 py-1 text-sm bg-gray-800 border border-gray-700 rounded text-gray-300 focus:border-orange-500 focus:outline-none"
                          placeholder="#section"
                        />
                        <div
                          className={`text-xs mt-1 text-right ${getCharCountClass(
                            link.href.length,
                            CHAR_LIMITS.linkHref
                          )}`}
                        >
                          {link.href.length}/{CHAR_LIMITS.linkHref}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <motion.button
                      whileHover={{ x: 5 }}
                      onClick={() => scrollToSection(link.href)}
                      className="text-gray-400 hover:text-accent-orange transition"
                    >
                      {link.label}
                    </motion.button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* More + Newsletter */}
          <div>
            <h3 className="text-gray-700 dark:text-white font-semibold mb-4">
              More
            </h3>
            <ul className="space-y-2 mb-6">
              {editedContent.moreLinks.map((link, index) => (
                <li key={index}>
                  {isEditing ? (
                    <div className="flex flex-col gap-1 mb-3">
                      <div>
                        <input
                          type="text"
                          value={link.label}
                          onChange={(e) =>
                            handleMoreLinkChange(index, "label", e.target.value)
                          }
                          maxLength={CHAR_LIMITS.linkLabel}
                          className="w-full px-2 py-1 text-sm bg-gray-800 border border-gray-700 rounded text-gray-300 focus:border-orange-500 focus:outline-none"
                          placeholder="Label"
                        />
                        <div
                          className={`text-xs mt-1 text-right ${getCharCountClass(
                            link.label.length,
                            CHAR_LIMITS.linkLabel
                          )}`}
                        >
                          {link.label.length}/{CHAR_LIMITS.linkLabel}
                        </div>
                      </div>
                      <div>
                        <input
                          type="text"
                          value={link.href}
                          onChange={(e) =>
                            handleMoreLinkChange(index, "href", e.target.value)
                          }
                          maxLength={CHAR_LIMITS.linkHref}
                          className="w-full px-2 py-1 text-sm bg-gray-800 border border-gray-700 rounded text-gray-300 focus:border-orange-500 focus:outline-none"
                          placeholder="#section"
                        />
                        <div
                          className={`text-xs mt-1 text-right ${getCharCountClass(
                            link.href.length,
                            CHAR_LIMITS.linkHref
                          )}`}
                        >
                          {link.href.length}/{CHAR_LIMITS.linkHref}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <motion.button
                      whileHover={{ x: 5 }}
                      onClick={() => scrollToSection(link.href)}
                      className="text-gray-400 hover:text-accent-orange transition"
                    >
                      {link.label}
                    </motion.button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
