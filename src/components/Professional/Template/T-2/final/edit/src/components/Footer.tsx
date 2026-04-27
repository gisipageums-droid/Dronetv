// import { Edit2, Heart, Loader2, Save, X } from 'lucide-react';
// import { motion } from 'motion/react';
// import { useCallback, useEffect, useRef, useState } from 'react';
// import { toast } from 'sonner';

// // Text limits for Footer only
// const FOOTER_TEXT_LIMITS = {
//   LOGO_TEXT: 30,
//   TAGLINE: 80,
//   DESCRIPTION: 300,
//   LINK_LABEL: 40,
//   COPYRIGHT: 100,
//   BUILT_WITH: 80,
//   CONTACT_FIELD: 60,
//   SOCIAL_LABEL: 40,
// };

// // Custom Button component (consistent with other components)
// const Button = ({
//   children,
//   onClick,
//   variant,
//   size,
//   className,
//   disabled,
//   ...props
// }: {
//   children: React.ReactNode;
//   onClick?: () => void;
//   variant?: string;
//   size?: string;
//   className?: string;
//   disabled?: boolean;
// }) => {
//   const baseClasses =
//     "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
//   const variants: Record<string, string> = {
//     outline: "border border-gray-300 bg-transparent hover:bg-gray-50",
//     default: "bg-blue-600 text-white hover:bg-blue-700",
//   };
//   const sizes: Record<string, string> = {
//     sm: "h-8 px-3 text-sm",
//     default: "h-10 px-4",
//   };

//   return (
//     <button
//       className={`${baseClasses} ${variants[variant || 'default']} ${
//         sizes[size || 'default']
//       } ${className || ""}`}
//       onClick={onClick}
//       disabled={disabled}
//       {...props}
//     >
//       {children}
//     </button>
//   );
// };

// interface FooterLink {
//   href: string;
//   label: string;
// }

// interface SocialLink {
//   icon: string;
//   label: string;
//   href: string;
//   color: string;
// }

// interface ContactInfo {
//   email: string;
//   location: string;
//   availability: string;
// }

// interface FooterData {
//   logoText: string;
//   tagline: string;
//   description: string;
//   quickLinks: FooterLink[];
//   moreLinks: FooterLink[];
//   socialLinks: SocialLink[];
//   copyright: string;
//   contactInfo: ContactInfo;
//   builtWith: string;
// }

// interface FooterProps {
//   footerData?: FooterData;
//   onStateChange?: (data: FooterData) => void;

// }

// export function Footer({ footerData, onStateChange }: FooterProps) {
//   const [isEditing, setIsEditing] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [dataLoaded, setDataLoaded] = useState(false);
//   const [isVisible, setIsVisible] = useState(false);
//   const footerRef = useRef<HTMLDivElement>(null);

//   const defaultFooterData: FooterData = footerData || ""
//   const [data, setData] = useState<FooterData>(defaultFooterData);
//   const [tempData, setTempData] = useState<FooterData>(defaultFooterData);

//   // Text validation functions
//   const validateTextLength = (text: string, limit: number) => {
//     return text.length <= limit;
//   };

//   // Footer EditableText component
//   const FooterEditableText = useCallback(({
//     value,
//     onChange,
//     charLimit,
//     className = "",
//     placeholder = "",
//     multiline = false,
//     rows = 3,
//   }: {
//     value: string;
//     onChange: (value: string) => void;
//     charLimit?: number;
//     className?: string;
//     placeholder?: string;
//     multiline?: boolean;
//     rows?: number;
//   }) => {
//     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//       const newValue = e.target.value;
//       if (charLimit && newValue.length > charLimit) {
//         return;
//       }
//       onChange(newValue);
//     };

//     const currentLength = value?.length || 0;
//     const isOverLimit = charLimit && currentLength > charLimit;

//     const baseClasses = "w-full bg-gray-800 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none text-white placeholder-gray-400";

//     return (
//       <div className="relative">
//         {multiline ? (
//           <textarea
//             value={value || ''}
//             onChange={handleChange}
//             className={`${baseClasses} p-2 resize-none ${className} ${
//               isOverLimit ? 'border-red-400' : ''
//             }`}
//             placeholder={placeholder}
//             rows={rows}
//           />
//         ) : (
//           <input
//             type="text"
//             value={value || ''}
//             onChange={handleChange}
//             className={`${baseClasses} p-2 ${className} ${
//               isOverLimit ? 'border-red-400' : ''
//             }`}
//             placeholder={placeholder}
//           />
//         )}
//         {charLimit && (
//           <div className={`absolute -bottom-6 right-0 text-xs ${
//             isOverLimit ? 'text-red-400' : 'text-gray-400'
//           }`}>
//             {currentLength}/{charLimit}
//           </div>
//         )}
//       </div>
//     );
//   }, []);

//   // Notify parent of state changes
//   useEffect(() => {
//     if (onStateChange) {
//       onStateChange(data);
//     }
//   }, [data]);

//   // Intersection observer
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => setIsVisible(entry.isIntersecting),
//       { threshold: 0.1 }
//     );
//     if (footerRef.current) observer.observe(footerRef.current);
//     return () => {
//       if (footerRef.current) observer.unobserve(footerRef.current);
//     };
//   }, []);

//   // Fake API fetch
//   const fetchFooterData = async () => {
//     setIsLoading(true);
//     try {
//       const response = await new Promise<FooterData>((resolve) =>
//         setTimeout(() => resolve(footerData || defaultFooterData), 1200)
//       );
//       setData(response);
//       setTempData(response);
//       setDataLoaded(true);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (isVisible && !dataLoaded && !isLoading) {
//       fetchFooterData();
//     }
//   }, [isVisible, dataLoaded, isLoading, footerData]);

//   const handleEdit = () => {
//     setIsEditing(true);
//     setTempData({ ...data });
//   };

//   // Save function
//   const handleSave = async () => {
//     try {
//       setIsSaving(true);

//       // Save the updated data
//       await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate save API call

//       // Update both states
//       setData(tempData);

//       setIsEditing(false);
//       toast.success('Footer section saved successfully');

//     } catch (error) {
//       console.error('Error saving footer section:', error);
//       toast.error('Error saving changes. Please try again.');
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleCancel = () => {
//     setTempData({ ...data });
//     setIsEditing(false);
//   };

//   // Update functions with useCallback
//   const updateBasicField = useCallback((field: keyof FooterData, value: string) => {
//     setTempData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   }, []);

//   const updateContactInfo = useCallback((field: keyof ContactInfo, value: string) => {
//     setTempData(prev => ({
//       ...prev,
//       contactInfo: { ...prev.contactInfo, [field]: value }
//     }));
//   }, []);

//   const updateQuickLink = useCallback((index: number, field: keyof FooterLink, value: string) => {
//     const updatedLinks = [...tempData.quickLinks];
//     updatedLinks[index] = { ...updatedLinks[index], [field]: value };
//     setTempData(prev => ({
//       ...prev,
//       quickLinks: updatedLinks
//     }));
//   }, [tempData.quickLinks]);

//   const updateMoreLink = useCallback((index: number, field: keyof FooterLink, value: string) => {
//     const updatedLinks = [...tempData.moreLinks];
//     updatedLinks[index] = { ...updatedLinks[index], [field]: value };
//     setTempData(prev => ({
//       ...prev,
//       moreLinks: updatedLinks
//     }));
//   }, [tempData.moreLinks]);

//   const updateSocialLink = useCallback((index: number, field: keyof SocialLink, value: string) => {
//     const updatedLinks = [...tempData.socialLinks];
//     updatedLinks[index] = { ...updatedLinks[index], [field]: value };
//     setTempData(prev => ({
//       ...prev,
//       socialLinks: updatedLinks
//     }));
//   }, [tempData.socialLinks]);

//   const addQuickLink = useCallback(() => {
//     setTempData(prev => ({
//       ...prev,
//       quickLinks: [...prev.quickLinks, { href: "#", label: "New Link" }]
//     }));
//   }, []);

//   const addMoreLink = useCallback(() => {
//     setTempData(prev => ({
//       ...prev,
//       moreLinks: [...prev.moreLinks, { href: "#", label: "New Link" }]
//     }));
//   }, []);

//   const removeQuickLink = useCallback((index: number) => {
//     if (tempData.quickLinks.length <= 1) {
//       toast.error("You must have at least one quick link");
//       return;
//     }
//     const updatedLinks = tempData.quickLinks.filter((_, i) => i !== index);
//     setTempData(prev => ({
//       ...prev,
//       quickLinks: updatedLinks
//     }));
//   }, [tempData.quickLinks]);

//   const removeMoreLink = useCallback((index: number) => {
//     if (tempData.moreLinks.length <= 1) {
//       toast.error("You must have at least one more link");
//       return;
//     }
//     const updatedLinks = tempData.moreLinks.filter((_, i) => i !== index);
//     setTempData(prev => ({
//       ...prev,
//       moreLinks: updatedLinks
//     }));
//   }, [tempData.moreLinks]);

//   const removeSocialLink = useCallback((index: number) => {
//     if (tempData.socialLinks.length <= 1) {
//       toast.error("You must have at least one social link");
//       return;
//     }
//     const updatedLinks = tempData.socialLinks.filter((_, i) => i !== index);
//     setTempData(prev => ({
//       ...prev,
//       socialLinks: updatedLinks
//     }));
//   }, [tempData.socialLinks]);

//   const displayData = isEditing ? tempData : data;
//   const currentYear = new Date().getFullYear();

//   // Loading state
//   if (isLoading) {
//     return (
//       <footer ref={footerRef} className="py-12 text-white bg-gray-900">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <Loader2 className="w-8 h-8 animate-spin mx-auto text-yellow-500" />
//           <p className="text-gray-400 mt-4">Loading footer data...</p>
//         </div>
//       </footer>
//     );
//   }

//   // Helper function to get Lucide icons
//   const getIconComponent = (iconName: string) => {
//     const icons: Record<string, any> = {
//       Linkedin: Edit2, // Replace with actual Linkedin icon
//       Github: Heart,   // Replace with actual Github icon
//       Twitter: Save,   // Replace with actual Twitter icon
//       Mail: X,         // Replace with actual Mail icon
//       Instagram: Heart // Replace with actual Instagram icon
//     };
//     return icons[iconName] || Edit2;
//   };

//   return (
//     <footer ref={footerRef} className="py-12  text-white bg-gray-900">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Edit Controls */}
//         <div className='text-right mb-8'>
//           {!isEditing ? (
//             <Button
//               onClick={handleEdit}
//               size='sm'
//               className='bg-red-500 hover:bg-red-600 shadow-md text-white'
//             >
//               <Edit2 className='w-4 h-4 mr-2' />
//               Edit
//             </Button>
//           ) : (
//             <div className='flex gap-2 justify-end'>
//               <Button
//                 onClick={handleSave}
//                 size='sm'
//                 className='bg-green-600 hover:bg-green-700 text-white shadow-md'
//                 disabled={isSaving}
//               >
//                 {isSaving ? (
//                   <Loader2 className='w-4 h-4 mr-2 animate-spin' />
//                 ) : (
//                   <Save className='w-4 h-4 mr-2' />
//                 )}
//                 {isSaving ? "Saving..." : "Save"}
//               </Button>
//               <Button
//                 onClick={handleCancel}
//                 size='sm'
//                 className='bg-red-500 hover:bg-red-600 shadow-md text-white'
//                 disabled={isSaving}
//               >
//                 <X className='w-4 h-4 mr-2' />
//                 Cancel
//               </Button>
//             </div>
//           )}
//         </div>

//         <div className="grid gap-8 md:grid-cols-4">
//           {/* Brand Section */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             viewport={{ once: true }}
//             className="space-y-4 md:col-span-2"
//           >
//             {isEditing ? (
//               <>
//                 <FooterEditableText
//                   value={displayData.logoText}
//                   onChange={(value) => updateBasicField('logoText', value)}
//                   charLimit={FOOTER_TEXT_LIMITS.LOGO_TEXT}
//                   className="text-2xl font-bold"
//                   placeholder="Logo text"
//                 />
//                 <FooterEditableText
//                   value={displayData.tagline}
//                   onChange={(value) => updateBasicField('tagline', value)}
//                   charLimit={FOOTER_TEXT_LIMITS.TAGLINE}
//                   className="text-lg text-yellow-400"
//                   placeholder="Tagline"
//                 />
//                 <FooterEditableText
//                   value={displayData.description}
//                   onChange={(value) => updateBasicField('description', value)}
//                   charLimit={FOOTER_TEXT_LIMITS.DESCRIPTION}
//                   className="text-sm text-gray-400"
//                   placeholder="Description"
//                   multiline
//                   rows={4}
//                 />
//               </>
//             ) : (
//               <>
//                 <h3 className="text-2xl font-bold text-white">{displayData.logoText}</h3>
//                 <p className="text-lg text-yellow-400">{displayData.tagline}</p>
//                 <p className="leading-relaxed text-gray-400">
//                   {displayData.description}
//                 </p>
//               </>
//             )}
//           </motion.div>

//           {/* Quick Links */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.1 }}
//             viewport={{ once: true }}
//             className="space-y-4"
//           >
//             <h4 className="text-lg font-semibold text-yellow-400">Quick Links</h4>
//             {isEditing ? (
//               <div className="space-y-2">
//                 {displayData.quickLinks.map((link, index) => (
//                   <div key={index} className="flex gap-2">
//                     <FooterEditableText
//                       value={link.label}
//                       onChange={(value) => updateQuickLink(index, 'label', value)}
//                       charLimit={FOOTER_TEXT_LIMITS.LINK_LABEL}
//                       className="flex-1 text-sm text-gray-400"
//                       placeholder="Link Label"
//                     />
//                     <input
//                       type="text"
//                       value={link.href}
//                       onChange={(e) => updateQuickLink(index, 'href', e.target.value)}
//                       className="flex-1 text-sm text-gray-400 bg-gray-800 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2"
//                       placeholder="Link URL"
//                     />
//                     <Button
//                       onClick={() => removeQuickLink(index)}
//                       size="sm"
//                       variant="outline"
//                       className="bg-red-50 hover:bg-red-100 text-red-700 p-1"
//                     >
//                       <X className="w-3 h-3" />
//                     </Button>
//                   </div>
//                 ))}
//                 <Button
//                   onClick={addQuickLink}
//                   variant="outline"
//                   size="sm"
//                   className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700"
//                 >
//                   Add Quick Link
//                 </Button>
//               </div>
//             ) : (
//               <div className="space-y-2">
//                 {displayData.quickLinks.map((link, index) => (
//                   <motion.a
//                     key={index}
//                     href={link.href}
//                     whileHover={{ x: 5, color: '#fbbf24' }}
//                     transition={{ duration: 0.2 }}
//                     className="block text-gray-400 transition-colors duration-300 hover:text-yellow-400"
//                   >
//                     {link.label}
//                   </motion.a>
//                 ))}
//               </div>
//             )}
//           </motion.div>

//           {/* More Links */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.2 }}
//             viewport={{ once: true }}
//             className="space-y-4"
//           >
//             <h4 className="text-lg font-semibold text-yellow-400">More Links</h4>
//             {isEditing ? (
//               <div className="space-y-2">
//                 {displayData.moreLinks.map((link, index) => (
//                   <div key={index} className="flex gap-2">
//                     <FooterEditableText
//                       value={link.label}
//                       onChange={(value) => updateMoreLink(index, 'label', value)}
//                       charLimit={FOOTER_TEXT_LIMITS.LINK_LABEL}
//                       className="flex-1 text-sm text-gray-400"
//                       placeholder="Link Label"
//                     />
//                     <input
//                       type="text"
//                       value={link.href}
//                       onChange={(e) => updateMoreLink(index, 'href', e.target.value)}
//                       className="flex-1 text-sm text-gray-400 bg-gray-800 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2"
//                       placeholder="Link URL"
//                     />
//                     <Button
//                       onClick={() => removeMoreLink(index)}
//                       size="sm"
//                       variant="outline"
//                       className="bg-red-50 hover:bg-red-100 text-red-700 p-1"
//                     >
//                       <X className="w-3 h-3" />
//                     </Button>
//                   </div>
//                 ))}
//                 <Button
//                   onClick={addMoreLink}
//                   variant="outline"
//                   size="sm"
//                   className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700"
//                 >
//                   Add More Link
//                 </Button>
//               </div>
//             ) : (
//               <div className="space-y-2">
//                 {displayData.moreLinks.map((link, index) => (
//                   <motion.a
//                     key={index}
//                     href={link.href}
//                     whileHover={{ x: 5, color: '#fbbf24' }}
//                     transition={{ duration: 0.2 }}
//                     className="block text-gray-400 transition-colors duration-300 hover:text-yellow-400"
//                   >
//                     {link.label}
//                   </motion.a>
//                 ))}
//               </div>
//             )}
//           </motion.div>
//         </div>

//         {/* Contact & Social Links */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, delay: 0.3 }}
//           viewport={{ once: true }}
//           className="grid gap-8 md:grid-cols-2 mt-8 pt-8 border-t border-gray-800"
//         >

//         </motion.div>

// {/*
//         <motion.div
//           initial={{ opacity: 0 }}
//           whileInView={{ opacity: 1 }}
//           transition={{ duration: 0.6, delay: 0.4 }}
//           viewport={{ once: true }}
//           className="pt-8 mt-8 text-center border-t border-gray-800"
//         >
//           {isEditing ? (
//             <div className="space-y-2">
//               <FooterEditableText
//                 value={displayData.copyright.replace(`© ${currentYear}`, '').trim()}
//                 onChange={(value) => updateBasicField('copyright', `© ${currentYear} ${value}`)}
//                 charLimit={FOOTER_TEXT_LIMITS.COPYRIGHT}
//                 className="w-full text-sm text-gray-400 text-center"
//                 placeholder="Copyright text"
//               />
//               <FooterEditableText
//                 value={displayData.builtWith}
//                 onChange={(value) => updateBasicField('builtWith', value)}
//                 charLimit={FOOTER_TEXT_LIMITS.BUILT_WITH}
//                 className="w-full text-sm text-gray-400 text-center"
//                 placeholder="Built with text"
//               />
//             </div>
//           ) : (
//             <>
//               <p className="text-gray-400">{displayData.copyright}</p>
//               <p className="flex justify-center items-center space-x-2 text-gray-400 mt-2">
//                 <span>{displayData.builtWith}</span>
//                 <motion.span
//                   animate={{ scale: [1, 1.2, 1] }}
//                   transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
//                 >
//                   <Heart className="w-4 h-4 text-red-500 fill-current" />
//                 </motion.span>
//               </p>
//             </>
//           )}
//         </motion.div> */}
//       </div>
//     </footer>
//   );
// }

import { Edit2, Heart, Loader2, Save, X } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// Text limits for Footer only
const FOOTER_TEXT_LIMITS = {
  LOGO_TEXT: 30,
  TAGLINE: 80,
  DESCRIPTION: 300,
  LINK_LABEL: 40,
  COPYRIGHT: 100,
  BUILT_WITH: 80,
  CONTACT_FIELD: 60,
  SOCIAL_LABEL: 40,
};

// Custom Button component (consistent with other components)
const Button = ({
  children,
  onClick,
  variant,
  size,
  className,
  disabled,
  ...props
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: string;
  size?: string;
  className?: string;
  disabled?: boolean;
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variants: Record<string, string> = {
    outline: "border border-gray-300 bg-transparent hover:bg-gray-50",
    default: "bg-blue-600 text-white hover:bg-blue-700",
  };
  const sizes: Record<string, string> = {
    sm: "h-8 px-3 text-sm",
    default: "h-10 px-4",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant || "default"]} ${
        sizes[size || "default"]
      } ${className || ""}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

interface FooterLink {
  href: string;
  label: string;
}

interface SocialLink {
  icon: string;
  label: string;
  href: string;
  color: string;
}

interface ContactInfo {
  email: string;
  location: string;
  availability: string;
}

interface FooterData {
  logoText: string;
  tagline: string;
  description: string;
  quickLinks: FooterLink[];
  moreLinks: FooterLink[];
  socialLinks: SocialLink[];
  copyright: string;
  contactInfo: ContactInfo;
  builtWith: string;
}

interface FooterProps {
  footerData?: FooterData;
  onStateChange?: (data: FooterData) => void;
}

export function Footer({ footerData, onStateChange }: FooterProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Auto-save states
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();
  const lastSavedDataRef = useRef<FooterData | null>(null);

  const footerRef = useRef<HTMLDivElement>(null);

  const defaultFooterData: FooterData = footerData || {
    logoText: "",
    tagline: "",
    description: "",
    quickLinks: [],
    moreLinks: [],
    socialLinks: [],
    copyright: "",
    contactInfo: { email: "", location: "", availability: "" },
    builtWith: "",
  };

  const [data, setData] = useState<FooterData>(defaultFooterData);
  const [tempData, setTempData] = useState<FooterData>(defaultFooterData);

  // Use ref for onStateChange to prevent infinite loops
  const onStateChangeRef = useRef(onStateChange);
  useEffect(() => {
    onStateChangeRef.current = onStateChange;
  }, [onStateChange]);

  // Auto-save functionality
  const performAutoSave = useCallback(async (dataToSave: FooterData) => {
    try {
      setIsAutoSaving(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (onStateChangeRef.current) {
        onStateChangeRef.current(dataToSave);
      }

      lastSavedDataRef.current = dataToSave;
      setLastSaved(new Date());
      setHasUnsavedChanges(false);

      console.log("Footer auto-save completed:", dataToSave);
    } catch (error) {
      console.error("Auto-save failed:", error);
      toast.error("Failed to auto-save changes");
    } finally {
      setIsAutoSaving(false);
    }
  }, []);

  const scheduleAutoSave = useCallback(
    (updatedData: FooterData) => {
      setHasUnsavedChanges(true);

      // Clear existing timeout
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      // Schedule new auto-save
      autoSaveTimeoutRef.current = setTimeout(() => {
        performAutoSave(updatedData);
      }, 2000); // 2 second delay
    },
    [performAutoSave]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  // Text validation functions
  const validateTextLength = (text: string, limit: number) => {
    return text.length <= limit;
  };

  // Footer EditableText component
  const FooterEditableText = useCallback(
    ({
      value,
      onChange,
      charLimit,
      className = "",
      placeholder = "",
      multiline = false,
      rows = 3,
    }: {
      value: string;
      onChange: (value: string) => void;
      charLimit?: number;
      className?: string;
      placeholder?: string;
      multiline?: boolean;
      rows?: number;
    }) => {
      const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => {
        const newValue = e.target.value;
        if (charLimit && newValue.length > charLimit) {
          return;
        }
        onChange(newValue);
      };

      const currentLength = value?.length || 0;
      const isOverLimit = charLimit && currentLength > charLimit;

      const baseClasses =
        "w-full bg-gray-800 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none text-white placeholder-gray-400";

      return (
        <div className="relative">
          {multiline ? (
            <textarea
              value={value || ""}
              onChange={handleChange}
              className={`${baseClasses} p-2 resize-none ${className} ${
                isOverLimit ? "border-red-400" : ""
              }`}
              placeholder={placeholder}
              rows={rows}
            />
          ) : (
            <input
              type="text"
              value={value || ""}
              onChange={handleChange}
              className={`${baseClasses} p-2 ${className} ${
                isOverLimit ? "border-red-400" : ""
              }`}
              placeholder={placeholder}
            />
          )}
          {charLimit && (
            <div
              className={`absolute -bottom-6 right-0 text-xs ${
                isOverLimit ? "text-red-400" : "text-gray-400"
              }`}
            >
              {currentLength}/{charLimit}
            </div>
          )}
        </div>
      );
    },
    []
  );

  // Intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (footerRef.current) observer.observe(footerRef.current);
    return () => {
      if (footerRef.current) observer.unobserve(footerRef.current);
    };
  }, []);

  // Fake API fetch
  const fetchFooterData = async () => {
    setIsLoading(true);
    try {
      const response = await new Promise<FooterData>((resolve) =>
        setTimeout(() => resolve(footerData || defaultFooterData), 1200)
      );
      setData(response);
      setTempData(response);
      lastSavedDataRef.current = response;
      setDataLoaded(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible && !dataLoaded && !isLoading) {
      fetchFooterData();
    }
  }, [isVisible, dataLoaded, isLoading, footerData]);

  const handleEdit = () => {
    setIsEditing(true);
    setTempData({ ...data });
    lastSavedDataRef.current = data;
    setHasUnsavedChanges(false);
  };

  // Save function
  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Clear any pending auto-save
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      // Save the updated data
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate save API call

      // Update both states
      setData(tempData);
      lastSavedDataRef.current = tempData;

      setIsEditing(false);
      setHasUnsavedChanges(false);
      setLastSaved(new Date());

      if (onStateChangeRef.current) {
        onStateChangeRef.current(tempData);
      }

      toast.success("Footer section saved successfully");
    } catch (error) {
      console.error("Error saving footer section:", error);
      toast.error("Error saving changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Clear any pending auto-save
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    setTempData(lastSavedDataRef.current || data);
    setHasUnsavedChanges(false);
    setIsEditing(false);
    toast.info("Changes discarded");
  };

  // Update functions with useCallback and auto-save
  const updateBasicField = useCallback(
    (field: keyof FooterData, value: string) => {
      setTempData((prev) => {
        const updated = {
          ...prev,
          [field]: value,
        };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  const updateContactInfo = useCallback(
    (field: keyof ContactInfo, value: string) => {
      setTempData((prev) => {
        const updated = {
          ...prev,
          contactInfo: { ...prev.contactInfo, [field]: value },
        };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  const updateQuickLink = useCallback(
    (index: number, field: keyof FooterLink, value: string) => {
      setTempData((prev) => {
        const updatedLinks = [...prev.quickLinks];
        updatedLinks[index] = { ...updatedLinks[index], [field]: value };
        const updated = {
          ...prev,
          quickLinks: updatedLinks,
        };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  const updateMoreLink = useCallback(
    (index: number, field: keyof FooterLink, value: string) => {
      setTempData((prev) => {
        const updatedLinks = [...prev.moreLinks];
        updatedLinks[index] = { ...updatedLinks[index], [field]: value };
        const updated = {
          ...prev,
          moreLinks: updatedLinks,
        };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  const updateSocialLink = useCallback(
    (index: number, field: keyof SocialLink, value: string) => {
      setTempData((prev) => {
        const updatedLinks = [...prev.socialLinks];
        updatedLinks[index] = { ...updatedLinks[index], [field]: value };
        const updated = {
          ...prev,
          socialLinks: updatedLinks,
        };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  const addQuickLink = useCallback(() => {
    setTempData((prev) => {
      const updated = {
        ...prev,
        quickLinks: [...prev.quickLinks, { href: "#", label: "New Link" }],
      };
      scheduleAutoSave(updated);
      return updated;
    });
  }, [scheduleAutoSave]);

  const addMoreLink = useCallback(() => {
    setTempData((prev) => {
      const updated = {
        ...prev,
        moreLinks: [...prev.moreLinks, { href: "#", label: "New Link" }],
      };
      scheduleAutoSave(updated);
      return updated;
    });
  }, [scheduleAutoSave]);

  const removeQuickLink = useCallback(
    (index: number) => {
      setTempData((prev) => {
        if (prev.quickLinks.length <= 1) {
          toast.error("You must have at least one quick link");
          return prev;
        }
        const updatedLinks = prev.quickLinks.filter((_, i) => i !== index);
        const updated = {
          ...prev,
          quickLinks: updatedLinks,
        };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  const removeMoreLink = useCallback(
    (index: number) => {
      setTempData((prev) => {
        if (prev.moreLinks.length <= 1) {
          toast.error("You must have at least one more link");
          return prev;
        }
        const updatedLinks = prev.moreLinks.filter((_, i) => i !== index);
        const updated = {
          ...prev,
          moreLinks: updatedLinks,
        };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  const removeSocialLink = useCallback(
    (index: number) => {
      setTempData((prev) => {
        if (prev.socialLinks.length <= 1) {
          toast.error("You must have at least one social link");
          return prev;
        }
        const updatedLinks = prev.socialLinks.filter((_, i) => i !== index);
        const updated = {
          ...prev,
          socialLinks: updatedLinks,
        };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  const displayData = isEditing ? tempData : data;
  const currentYear = new Date().getFullYear();

  // Loading state
  if (isLoading) {
    return (
      <footer ref={footerRef} className="py-12 text-white bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-yellow-500" />
          <p className="text-gray-400 mt-4">Loading footer data...</p>
        </div>
      </footer>
    );
  }

  // Helper function to get Lucide icons
  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = {
      Linkedin: Edit2, // Replace with actual Linkedin icon
      Github: Heart, // Replace with actual Github icon
      Twitter: Save, // Replace with actual Twitter icon
      Mail: X, // Replace with actual Mail icon
      Instagram: Heart, // Replace with actual Instagram icon
    };
    return icons[iconName] || Edit2;
  };

  return (
    <footer ref={footerRef} className="py-12 text-white bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Edit Controls */}
        <div className="text-right mb-8">
          {/* Auto-save indicator */}
          {isEditing && (
            <div className="flex items-center gap-2 justify-end mb-2 text-sm">
              {isAutoSaving && (
                <div className="flex items-center gap-1 text-blue-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Auto-saving...</span>
                </div>
              )}
              {hasUnsavedChanges && !isAutoSaving && (
                <div className="text-yellow-500">● Unsaved changes</div>
              )}
              {lastSaved && !hasUnsavedChanges && !isAutoSaving && (
                <div className="text-green-500">
                  ✓ Auto-saved {lastSaved.toLocaleTimeString()}
                </div>
              )}
            </div>
          )}

          {!isEditing ? (
            <Button
              onClick={handleEdit}
              size="sm"
              className="bg-red-500 hover:bg-red-600 shadow-md text-white"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2 justify-end">
              <Button
                onClick={handleSave}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white shadow-md"
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isSaving ? "Saving..." : "Save"}
              </Button>
              <Button
                onClick={handleCancel}
                size="sm"
                className="bg-red-500 hover:bg-red-600 shadow-md text-white"
                disabled={isSaving}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>

        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-4 md:col-span-2"
          >
            {isEditing ? (
              <>
                <FooterEditableText
                  value={displayData.logoText}
                  onChange={(value) => updateBasicField("logoText", value)}
                  charLimit={FOOTER_TEXT_LIMITS.LOGO_TEXT}
                  className="text-2xl font-bold"
                  placeholder="Logo text"
                />
                <FooterEditableText
                  value={displayData.tagline}
                  onChange={(value) => updateBasicField("tagline", value)}
                  charLimit={FOOTER_TEXT_LIMITS.TAGLINE}
                  className="text-lg text-yellow-400"
                  placeholder="Tagline"
                />
                <FooterEditableText
                  value={displayData.description}
                  onChange={(value) => updateBasicField("description", value)}
                  charLimit={FOOTER_TEXT_LIMITS.DESCRIPTION}
                  className="text-sm text-gray-400"
                  placeholder="Description"
                  multiline
                  rows={4}
                />
              </>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-white">
                  {displayData.logoText}
                </h3>
                <p className="text-lg text-yellow-400">{displayData.tagline}</p>
                <p className="leading-relaxed text-gray-400">
                  {displayData.description}
                </p>
              </>
            )}
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h4 className="text-lg font-semibold text-yellow-400">
              Quick Links
            </h4>
            {isEditing ? (
              <div className="space-y-2">
                {displayData.quickLinks.map((link, index) => (
                  <div key={index} className="flex gap-2">
                    <FooterEditableText
                      value={link.label}
                      onChange={(value) =>
                        updateQuickLink(index, "label", value)
                      }
                      charLimit={FOOTER_TEXT_LIMITS.LINK_LABEL}
                      className="flex-1 text-sm text-gray-400"
                      placeholder="Link Label"
                    />
                    <input
                      type="text"
                      value={link.href}
                      onChange={(e) =>
                        updateQuickLink(index, "href", e.target.value)
                      }
                      className="flex-1 text-sm text-gray-400 bg-gray-800 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2"
                      placeholder="Link URL"
                    />
                    <Button
                      onClick={() => removeQuickLink(index)}
                      size="sm"
                      variant="outline"
                      className="bg-red-50 hover:bg-red-100 text-red-700 p-1"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
                <Button
                  onClick={addQuickLink}
                  variant="outline"
                  size="sm"
                  className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700"
                >
                  Add Quick Link
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {displayData.quickLinks.map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.href}
                    whileHover={{ x: 5, color: "#fbbf24" }}
                    transition={{ duration: 0.2 }}
                    className="block text-gray-400 transition-colors duration-300 hover:text-yellow-400"
                  >
                    {link.label}
                  </motion.a>
                ))}
              </div>
            )}
          </motion.div>

          {/* More Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h4 className="text-lg font-semibold text-yellow-400">
              More Links
            </h4>
            {isEditing ? (
              <div className="space-y-2">
                {displayData.moreLinks.map((link, index) => (
                  <div key={index} className="flex gap-2">
                    <FooterEditableText
                      value={link.label}
                      onChange={(value) =>
                        updateMoreLink(index, "label", value)
                      }
                      charLimit={FOOTER_TEXT_LIMITS.LINK_LABEL}
                      className="flex-1 text-sm text-gray-400"
                      placeholder="Link Label"
                    />
                    <input
                      type="text"
                      value={link.href}
                      onChange={(e) =>
                        updateMoreLink(index, "href", e.target.value)
                      }
                      className="flex-1 text-sm text-gray-400 bg-gray-800 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2"
                      placeholder="Link URL"
                    />
                    <Button
                      onClick={() => removeMoreLink(index)}
                      size="sm"
                      variant="outline"
                      className="bg-red-50 hover:bg-red-100 text-red-700 p-1"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
                <Button
                  onClick={addMoreLink}
                  variant="outline"
                  size="sm"
                  className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700"
                >
                  Add More Link
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {displayData.moreLinks.map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.href}
                    whileHover={{ x: 5, color: "#fbbf24" }}
                    transition={{ duration: 0.2 }}
                    className="block text-gray-400 transition-colors duration-300 hover:text-yellow-400"
                  >
                    {link.label}
                  </motion.a>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Contact & Social Links - Removed as per your code */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="grid gap-8 md:grid-cols-2 mt-8 pt-8 border-t border-gray-800"
        >
          {/* Content removed as per your original code */}
        </motion.div>
      </div>
    </footer>
  );
}
