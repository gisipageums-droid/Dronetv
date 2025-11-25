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
//     <footer className="bg-dark-300 border-t border-gray-200 dark:border-gray-800 relative overflow-hidden">
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
//               <p className="text-gray-400 mb-6 text-justify leading-relaxed max-w-md">
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
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Track content changes
  useEffect(() => {
    setEditedContent(content);
    setHasUnsavedChanges(false);
  }, [content]);

  // Auto-save cleanup
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  // Auto-save function
  const performAutoSave = useCallback(async () => {
    if (!hasUnsavedChanges || !isEditing) return;

    setIsAutoSaving(true);
    
    try {
      onSave?.(editedContent);
      setLastSavedTime(new Date());
      setHasUnsavedChanges(false);
      
      console.log("Footer auto-saved at", new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Footer auto-save failed:", error);
      toast.error("Auto-save failed. Changes not saved.");
    } finally {
      setIsAutoSaving(false);
    }
  }, [editedContent, hasUnsavedChanges, isEditing, onSave]);

  // Schedule auto-save
  const scheduleAutoSave = useCallback(() => {
    if (!isEditing) return;

    setHasUnsavedChanges(true);
    
    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Set new timeout (2-second delay)
    autoSaveTimeoutRef.current = setTimeout(() => {
      performAutoSave();
    }, 2000);
  }, [isEditing, performAutoSave]);

  // Generic content update handler with auto-save
  const updateContent = useCallback((updates: Partial<FooterContent>) => {
    setEditedContent(prev => ({ ...prev, ...updates }));
    scheduleAutoSave();
  }, [scheduleAutoSave]);

  // Personal info handlers
  const handlePersonalNameChange = (name: string) => {
    updateContent({
      personalInfo: { ...editedContent.personalInfo, name }
    });
  };

  const handlePersonalDescriptionChange = (description: string) => {
    updateContent({
      personalInfo: { ...editedContent.personalInfo, description }
    });
  };

  // Quick links handlers
  const handleQuickLinkChange = (index: number, field: 'label' | 'href', value: string) => {
    const newQuickLinks = [...editedContent.quickLinks];
    newQuickLinks[index] = { ...newQuickLinks[index], [field]: value };
    updateContent({ quickLinks: newQuickLinks });
  };

  // More links handlers
  const handleMoreLinkChange = (index: number, field: 'label' | 'href', value: string) => {
    const newMoreLinks = [...editedContent.moreLinks];
    newMoreLinks[index] = { ...newMoreLinks[index], [field]: value };
    updateContent({ moreLinks: newMoreLinks });
  };

  // Social links handlers
  const handleSocialLinkChange = (index: number, field: 'name' | 'href', value: string) => {
    const newSocialLinks = [...editedContent.socialLinks];
    newSocialLinks[index] = { ...newSocialLinks[index], [field]: value };
    updateContent({ socialLinks: newSocialLinks });
  };

  // Newsletter handlers
  const handleNewsletterChange = (field: keyof NewsletterContent, value: string) => {
    updateContent({
      newsletter: { ...editedContent.newsletter, [field]: value }
    });
  };

  // Bottom section handlers
  const handleBottomSectionChange = (field: keyof BottomSectionContent, value: string) => {
    updateContent({
      bottomSection: { ...editedContent.bottomSection, [field]: value }
    });
  };

  const handlePolicyChange = (policy: 'privacyPolicy' | 'termsOfService', field: 'label' | 'href', value: string) => {
    updateContent({
      bottomSection: {
        ...editedContent.bottomSection,
        [policy]: {
          ...editedContent.bottomSection[policy],
          [field]: value
        }
      }
    });
  };

  // Manual save function
  const handleSave = () => {
    // Clear any pending auto-save
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    onSave?.(editedContent);
    setLastSavedTime(new Date());
    setHasUnsavedChanges(false);
    setIsEditing(false);
    toast.success("Footer updated successfully");
  };

  // Manual cancel function
  const handleCancel = () => {
    // Clear any pending auto-save
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    setEditedContent(content);
    setHasUnsavedChanges(false);
    setIsEditing(false);
    toast.info("Changes discarded");
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

  return (
    <footer className="bg-dark-300 border-t border-gray-200 dark:border-gray-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 relative z-10">
        {onSave && (
          <div className="absolute top-6 right-6 z-20 flex gap-3 items-center">
            {isEditing ? (
              <>
                {/* Auto-save indicator */}
                <div className="flex items-center gap-2 mr-4">
                  {isAutoSaving ? (
                    <div className="flex items-center gap-1 text-sm text-blue-500">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </div>
                  ) : hasUnsavedChanges ? (
                    <div className="text-sm text-yellow-500">
                      Unsaved changes
                    </div>
                  ) : lastSavedTime ? (
                    <div className="text-sm text-green-500">
                      Saved {lastSavedTime.toLocaleTimeString()}
                    </div>
                  ) : null}
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
                onClick={() => setIsEditing(true)}
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
                    onChange={(e) => handlePersonalNameChange(e.target.value)}
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
                  onChange={(e) => handlePersonalDescriptionChange(e.target.value)}
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
              <p className="text-gray-400 mb-6 text-justify leading-relaxed max-w-md">
                {editedContent.personalInfo.description}
              </p>
            )}

            {/* Social Links */}
            <div className="flex space-x-4">
              {editedContent.socialLinks.map((link, index) => (
                <div key={index}>
                  {isEditing ? (
                    <div className="flex flex-col gap-2 mb-4 p-3 bg-gray-800 rounded-lg">
                      <div>
                        <input
                          type="text"
                          value={link.name}
                          onChange={(e) => handleSocialLinkChange(index, 'name', e.target.value)}
                          maxLength={CHAR_LIMITS.socialLink}
                          className="w-full px-2 py-1 text-sm bg-gray-700 border border-gray-600 rounded text-gray-300 focus:border-orange-500 focus:outline-none"
                          placeholder="Platform name"
                        />
                        <div
                          className={`text-xs mt-1 text-right ${getCharCountClass(
                            link.name.length,
                            CHAR_LIMITS.socialLink
                          )}`}
                        >
                          {link.name.length}/{CHAR_LIMITS.socialLink}
                        </div>
                      </div>
                      <div>
                        <input
                          type="text"
                          value={link.href}
                          onChange={(e) => handleSocialLinkChange(index, 'href', e.target.value)}
                          maxLength={CHAR_LIMITS.linkHref}
                          className="w-full px-2 py-1 text-sm bg-gray-700 border border-gray-600 rounded text-gray-300 focus:border-orange-500 focus:outline-none"
                          placeholder="URL"
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
                    <motion.a
                      whileHover={{ scale: 1.1 }}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-yellow-500 transition-colors"
                      title={link.name}
                    >
                      {link.icon === 'Github' && 'Git'}
                      {link.icon === 'Linkedin' && 'In'}
                      {link.icon === 'Mail' && 'Mail'}
                    </motion.a>
                  )}
                </div>
              ))}
            </div>
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
                          onChange={(e) => handleQuickLinkChange(index, 'label', e.target.value)}
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
                          onChange={(e) => handleQuickLinkChange(index, 'href', e.target.value)}
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
                          onChange={(e) => handleMoreLinkChange(index, 'label', e.target.value)}
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
                          onChange={(e) => handleMoreLinkChange(index, 'href', e.target.value)}
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

            {/* Newsletter Section */}
            {isEditing && (
              <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                <h4 className="text-gray-300 font-semibold mb-3">Newsletter</h4>
                <div className="space-y-3">
                  <div>
                    <input
                      type="text"
                      value={editedContent.newsletter.title}
                      onChange={(e) => handleNewsletterChange('title', e.target.value)}
                      maxLength={CHAR_LIMITS.newsletterTitle}
                      className="w-full px-2 py-1 text-sm bg-gray-700 border border-gray-600 rounded text-gray-300 focus:border-orange-500 focus:outline-none"
                      placeholder="Newsletter title"
                    />
                    <div
                      className={`text-xs mt-1 text-right ${getCharCountClass(
                        editedContent.newsletter.title.length,
                        CHAR_LIMITS.newsletterTitle
                      )}`}
                    >
                      {editedContent.newsletter.title.length}/{CHAR_LIMITS.newsletterTitle}
                    </div>
                  </div>
                  <div>
                    <textarea
                      value={editedContent.newsletter.description}
                      onChange={(e) => handleNewsletterChange('description', e.target.value)}
                      maxLength={CHAR_LIMITS.newsletterDescription}
                      className="w-full px-2 py-1 text-sm bg-gray-700 border border-gray-600 rounded text-gray-300 focus:border-orange-500 focus:outline-none resize-none"
                      placeholder="Newsletter description"
                      rows={2}
                    />
                    <div
                      className={`text-xs mt-1 text-right ${getCharCountClass(
                        editedContent.newsletter.description.length,
                        CHAR_LIMITS.newsletterDescription
                      )}`}
                    >
                      {editedContent.newsletter.description.length}/{CHAR_LIMITS.newsletterDescription}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-6 border-t border-gray-700">
          {isEditing ? (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    value={editedContent.bottomSection.copyrightText}
                    onChange={(e) => handleBottomSectionChange('copyrightText', e.target.value)}
                    maxLength={CHAR_LIMITS.copyrightText}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-300 focus:border-orange-500 focus:outline-none"
                    placeholder="Copyright text"
                  />
                  <div
                    className={`text-xs mt-1 text-right ${getCharCountClass(
                      editedContent.bottomSection.copyrightText.length,
                      CHAR_LIMITS.copyrightText
                    )}`}
                  >
                    {editedContent.bottomSection.copyrightText.length}/{CHAR_LIMITS.copyrightText}
                  </div>
                </div>
                <div>
                  <input
                    type="text"
                    value={editedContent.bottomSection.afterCopyrightText}
                    onChange={(e) => handleBottomSectionChange('afterCopyrightText', e.target.value)}
                    maxLength={CHAR_LIMITS.afterCopyrightText}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-300 focus:border-orange-500 focus:outline-none"
                    placeholder="Additional copyright text"
                  />
                  <div
                    className={`text-xs mt-1 text-right ${getCharCountClass(
                      editedContent.bottomSection.afterCopyrightText.length,
                      CHAR_LIMITS.afterCopyrightText
                    )}`}
                  >
                    {editedContent.bottomSection.afterCopyrightText.length}/{CHAR_LIMITS.afterCopyrightText}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="text-gray-400 text-sm mb-2">Privacy Policy</h5>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editedContent.bottomSection.privacyPolicy.label}
                      onChange={(e) => handlePolicyChange('privacyPolicy', 'label', e.target.value)}
                      maxLength={CHAR_LIMITS.policyLabel}
                      className="w-full px-2 py-1 text-sm bg-gray-800 border border-gray-700 rounded text-gray-300 focus:border-orange-500 focus:outline-none"
                      placeholder="Privacy Policy label"
                    />
                    <input
                      type="text"
                      value={editedContent.bottomSection.privacyPolicy.href}
                      onChange={(e) => handlePolicyChange('privacyPolicy', 'href', e.target.value)}
                      maxLength={CHAR_LIMITS.linkHref}
                      className="w-full px-2 py-1 text-sm bg-gray-800 border border-gray-700 rounded text-gray-300 focus:border-orange-500 focus:outline-none"
                      placeholder="Privacy Policy URL"
                    />
                  </div>
                </div>
                <div>
                  <h5 className="text-gray-400 text-sm mb-2">Terms of Service</h5>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editedContent.bottomSection.termsOfService.label}
                      onChange={(e) => handlePolicyChange('termsOfService', 'label', e.target.value)}
                      maxLength={CHAR_LIMITS.policyLabel}
                      className="w-full px-2 py-1 text-sm bg-gray-800 border border-gray-700 rounded text-gray-300 focus:border-orange-500 focus:outline-none"
                      placeholder="Terms of Service label"
                    />
                    <input
                      type="text"
                      value={editedContent.bottomSection.termsOfService.href}
                      onChange={(e) => handlePolicyChange('termsOfService', 'href', e.target.value)}
                      maxLength={CHAR_LIMITS.linkHref}
                      className="w-full px-2 py-1 text-sm bg-gray-800 border border-gray-700 rounded text-gray-300 focus:border-orange-500 focus:outline-none"
                      placeholder="Terms of Service URL"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
              <div>
                <span>{editedContent.bottomSection.copyrightText}</span>
                <span className="mx-2">•</span>
                <span>{editedContent.bottomSection.afterCopyrightText}</span>
              </div>
              <div className="flex space-x-4 mt-2 md:mt-0">
                <a
                  href={editedContent.bottomSection.privacyPolicy.href}
                  className="hover:text-yellow-500 transition-colors"
                >
                  {editedContent.bottomSection.privacyPolicy.label}
                </a>
                <a
                  href={editedContent.bottomSection.termsOfService.href}
                  className="hover:text-yellow-500 transition-colors"
                >
                  {editedContent.bottomSection.termsOfService.label}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;