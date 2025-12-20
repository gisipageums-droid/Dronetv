// import {
//   ArrowRight,
//   Edit2,
//   Facebook,
//   Github,
//   Instagram,
//   Linkedin,
//   Mail,
//   MapPin,
//   Phone,
//   Plus,
//   Save,
//   Trash2,
//   Twitter,
//   Upload,
//   X,
//   Loader2,
//   RotateCw,
//   ZoomIn,
// } from "lucide-react";
// import { motion } from "motion/react";
// import { useEffect, useRef, useState, useCallback } from "react";
// import { toast } from "react-toastify";
// import { Button } from "../components/ui/button";
// import { Input } from "../components/ui/input";
// import Cropper from "react-easy-crop";

// // Enhanced crop helper function
// const createImage = (url) =>
//   new Promise((resolve, reject) => {
//     const image = new Image();
//     image.addEventListener("load", () => resolve(image));
//     image.addEventListener("error", (error) => reject(error));
//     image.setAttribute("crossOrigin", "anonymous");
//     image.src = url;
//   });

// const getCroppedImg = async (imageSrc, pixelCrop, rotation = 0) => {
//   const image = await createImage(imageSrc);
//   const canvas = document.createElement("canvas");
//   const ctx = canvas.getContext("2d");

//   canvas.width = pixelCrop.width;
//   canvas.height = pixelCrop.height;

//   ctx.translate(pixelCrop.width / 2, pixelCrop.height / 2);
//   ctx.rotate((rotation * Math.PI) / 180);
//   ctx.translate(-pixelCrop.width / 2, -pixelCrop.height / 2);

//   ctx.drawImage(
//     image,
//     pixelCrop.x,
//     pixelCrop.y,
//     pixelCrop.width,
//     pixelCrop.height,
//     0,
//     0,
//     pixelCrop.width,
//     pixelCrop.height
//   );

//   return new Promise((resolve) => {
//     canvas.toBlob(
//       (blob) => {
//         const fileName = `cropped-image-${Date.now()}.jpg`;
//         const file = new File([blob], fileName, {
//           type: "image/jpeg",
//           lastModified: Date.now(),
//         });

//         const previewUrl = URL.createObjectURL(blob);

//         resolve({
//           file,
//           previewUrl,
//         });
//       },
//       "image/jpeg",
//       0.95
//     );
//   });
// };

// export default function EditableFooter({
//   content,
//   onStateChange,
//   userId,
//   publishedId,
//   templateSelection,
// }) {
//   // Character limits - applied from your requirements
//   const CHAR_LIMITS = {
//     brandName: 100,
//     brandDescription: 500,
//     sectionTitle: 50,
//     linkText: 50,
//     linkUrl: 50,
//     contactEmail: 50,
//     contactPhone: 50,
//     contactAddress: 50,
//     socialName: 50,
//     socialUrl: 50,
//     legalText: 50,
//     legalUrl: 50,
//   };

//   // Initialize with data from props or use default structure
//   const initialData = {
//     brand: {
//       name: content?.name || "Innovative Labs",
//       description: content?.description || "Innovative solutions for modern businesses. Transform your operations with our expert guidance and cutting-edge technology.",
//       logoUrl: content?.logo || "/api/placeholder/32/32",
//     },
//     contact: {
//       email: "hello@innovativelabs.com",
//       phone: "+1 (555) 123-4567",
//       address: "San Francisco, CA 94105",
//     },
//     sections: [
//       {
//         id: 1,
//         title: "Company",
//         links: [
//           { id: 1, text: "About Us", href: "#about" },
//           { id: 2, text: "Our Team", href: "#team" },
//           { id: 3, text: "Careers", href: "#careers" },
//           { id: 4, text: "News & Press", href: "#news" },
//         ],
//       },
//       {
//         id: 2,
//         title: "Services",
//         links: [
//           { id: 1, text: "Consulting", href: "#consulting" },
//           { id: 2, text: "Development", href: "#development" },
//           { id: 3, text: "Support & Maintenance", href: "#support" },
//           { id: 4, text: "Training", href: "#training" },
//         ],
//       },
//     ],
//     socialMedia: [
//       {
//         id: 1,
//         name: "Facebook",
//         icon: "Facebook",
//         href: "#",
//         hoverColor: "hover:bg-blue-600",
//       },
//       {
//         id: 2,
//         name: "Twitter",
//         icon: "Twitter",
//         href: "#",
//         hoverColor: "hover:bg-blue-400",
//       },
//       {
//         id: 3,
//         name: "Instagram",
//         icon: "Instagram",
//         href: "#",
//         hoverColor: "hover:bg-pink-600",
//       },
//       {
//         id: 4,
//         name: "LinkedIn",
//         icon: "Linkedin",
//         href: "#",
//         hoverColor: "hover:bg-blue-700",
//       },
//     ],
//     legalLinks: [
//       { id: 1, text: "Privacy Policy", href: "#privacy" },
//       { id: 2, text: "Terms of Service", href: "#terms" },
//       { id: 3, text: "Cookie Policy", href: "#cookies" },
//     ],
//     copyright: "© 2024 Innovative Labs. All rights reserved.",
//   };

//   const [isEditing, setIsEditing] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [footerData, setFooterData] = useState(initialData);
//   const [tempData, setTempData] = useState(initialData);
//   const [pendingLogoFile, setPendingLogoFile] = useState(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const fileInputRef = useRef(null);

//   // Enhanced crop modal state
//   const [cropModalOpen, setCropModalOpen] = useState(false);
//   const [crop, setCrop] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);
//   const [rotation, setRotation] = useState(0);
//   const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
//   const [imageToCrop, setImageToCrop] = useState(null);
//   const [originalFile, setOriginalFile] = useState(null);
//   const [aspectRatio, setAspectRatio] = useState(1);

//   // Update state when content prop changes
//   useEffect(() => {
//     if (content) {
//       const updatedData = {
//         ...initialData,
//         brand: {
//           ...initialData.brand,
//           logoUrl: content.logo || initialData.brand.logoUrl,
//           name: content.name || initialData.brand.name,
//         },
//       };
//       setFooterData(updatedData);
//       setTempData(updatedData);
//     }
//   }, [content]);

//   // Notify parent of state changes
//   useEffect(() => {
//     if (onStateChange) {
//       onStateChange(footerData);
//     }
//   }, [footerData, onStateChange]);

//   // Enhanced cropper functions
//   const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
//     setCroppedAreaPixels(croppedAreaPixels);
//   }, []);

//   // Enhanced image upload handler with crop modal
//   const handleLogoUpload = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     // Validate file type and size
//     if (!file.type.startsWith("image/")) {
//       toast.error("Please select an image file");
//       return;
//     }

//     if (file.size > 5 * 1024 * 1024) {
//       toast.error("File size must be less than 5MB");
//       return;
//     }

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setImageToCrop(reader.result);
//       setOriginalFile(file);
//       setCropModalOpen(true);
//       setAspectRatio(1); // Square for logo
//       setCrop({ x: 0, y: 0 });
//       setZoom(1);
//       setRotation(0);
//     };
//     reader.readAsDataURL(file);

//     if (e.target) {
//       e.target.value = "";
//     }
//   };

//   // Apply crop function
//   const applyCrop = async () => {
//     try {
//       if (!imageToCrop || !croppedAreaPixels) {
//         console.error("Please select an area to crop");
//         return;
//       }

//       const { file, previewUrl } = await getCroppedImg(
//         imageToCrop,
//         croppedAreaPixels,
//         rotation
//       );

//       // Store the cropped file for upload on Save
//       setPendingLogoFile(file);

//       // Show immediate local preview of cropped image
//       updateNestedField("brand.logoUrl", previewUrl);

//       setCropModalOpen(false);
//       setImageToCrop(null);
//       setOriginalFile(null);
//       toast.success("Logo cropped successfully");
//     } catch (error) {
//       console.error("Error cropping image:", error);
//       toast.error("Error cropping image. Please try again.");
//     }
//   };

//   const cancelCrop = () => {
//     setCropModalOpen(false);
//     setImageToCrop(null);
//     setOriginalFile(null);
//     setCrop({ x: 0, y: 0 });
//     setZoom(1);
//     setRotation(0);
//   };

//   const resetCropSettings = () => {
//     setZoom(1);
//     setRotation(0);
//     setCrop({ x: 0, y: 0 });
//   };

//   const handleEdit = () => {
//     setIsEditing(true);
//     setTempData(footerData);
//   };

//   const handleCancel = () => {
//     setTempData(footerData);
//     setIsEditing(false);
//     setPendingLogoFile(null);
//   };

//   const handleSave = async () => {
//     setIsSaving(true);
//     setIsUploading(true);

//     try {
//       let updatedLogoUrl = tempData.brand.logoUrl;

//       // If there's a pending logo, upload it first
//       if (pendingLogoFile) {
//         if (!userId || !publishedId || !templateSelection) {
//           console.error("Missing required props:", {
//             userId,
//             publishedId,
//             templateSelection,
//           });
//           toast.error(
//             "Missing user information. Please refresh and try again."
//           );
//           return;
//         }

//         const formData = new FormData();
//         formData.append("file", pendingLogoFile);
//         formData.append("sectionName", "footer");
//         formData.append("imageField", "logoUrl" + Date.now());
//         formData.append("templateSelection", templateSelection);

//         const uploadResponse = await fetch(
//           `https://o66ziwsye5.execute-api.ap-south-1.amazonaws.com/prod/upload-image/${userId}/${publishedId}`,
//           {
//             method: "POST",
//             body: formData,
//           }
//         );

//         if (uploadResponse.ok) {
//           const uploadData = await uploadResponse.json();
//           // Update the logo URL to the S3 URL
//           updatedLogoUrl = uploadData.imageUrl;
//           setPendingLogoFile(null);
//         } else {
//           const errorData = await uploadResponse.json();
//           console.error("Logo upload failed:", errorData);
//           toast.error(
//             `Logo upload failed: ${errorData.message || "Unknown error"}`
//           );
//           return;
//         }
//       }

//       // Create updated data with the new logo URL
//       const updatedData = {
//         ...tempData,
//         brand: {
//           ...tempData.brand,
//           logoUrl: updatedLogoUrl,
//         },
//       };

//       // Now save the updated data
//       setFooterData(updatedData);
//       setTempData(updatedData);
//       setIsEditing(false);
//       toast.success("Footer saved successfully");
//     } catch (error) {
//       console.error("Error saving footer:", error);
//       toast.error("Error saving changes. Please try again.");
//     } finally {
//       setIsSaving(false);
//       setIsUploading(false);
//     }
//   };

//   const updateNestedField = (path, value) => {
//     setTempData((prev) => {
//       const newData = JSON.parse(JSON.stringify(prev));
//       const keys = path.split(".");
//       let current = newData;

//       for (let i = 0; i < keys.length - 1; i++) {
//         current = current[keys[i]];
//       }
//       current[keys[keys.length - 1]] = value;

//       return newData;
//     });
//   };

//   // Simplified update functions
//   const updateBrand = (field, value) => {
//     setTempData((prev) => ({
//       ...prev,
//       brand: { ...prev.brand, [field]: value },
//     }));
//   };

//   const updateContact = (field, value) => {
//     setTempData((prev) => ({
//       ...prev,
//       contact: { ...prev.contact, [field]: value },
//     }));
//   };

//   const updateSectionTitle = (sectionIndex, value) => {
//     setTempData((prev) => ({
//       ...prev,
//       sections: prev.sections.map((section, index) =>
//         index === sectionIndex ? { ...section, title: value } : section
//       ),
//     }));
//   };

//   const addSectionLink = (sectionId) => {
//     setTempData((prev) => ({
//       ...prev,
//       sections: prev.sections.map((section) =>
//         section.id === sectionId
//           ? {
//             ...section,
//             links: [
//               ...section.links,
//               {
//                 id: Date.now(),
//                 text: "New Link",
//                 href: "#new",
//               },
//             ],
//           }
//           : section
//       ),
//     }));
//   };

//   const removeSectionLink = (sectionId, linkId) => {
//     setTempData((prev) => ({
//       ...prev,
//       sections: prev.sections.map((section) =>
//         section.id === sectionId
//           ? {
//             ...section,
//             links: section.links.filter((link) => link.id !== linkId),
//           }
//           : section
//       ),
//     }));
//   };

//   const updateSectionLink = (sectionId, linkId, field, value) => {
//     setTempData((prev) => ({
//       ...prev,
//       sections: prev.sections.map((section) =>
//         section.id === sectionId
//           ? {
//             ...section,
//             links: section.links.map((link) =>
//               link.id === linkId ? { ...link, [field]: value } : link
//             ),
//           }
//           : section
//       ),
//     }));
//   };

//   const addSection = () => {
//     setTempData((prev) => ({
//       ...prev,
//       sections: [
//         ...prev.sections,
//         {
//           id: Date.now(),
//           title: "New Section",
//           links: [{ id: Date.now() + 1, text: "New Link", href: "#" }],
//         },
//       ],
//     }));
//   };

//   const removeSection = (sectionId) => {
//     if (tempData.sections.length > 1) {
//       setTempData((prev) => ({
//         ...prev,
//         sections: prev.sections.filter((section) => section.id !== sectionId),
//       }));
//     }
//   };

//   const updateSocialMedia = (index, field, value) => {
//     setTempData((prev) => ({
//       ...prev,
//       socialMedia: prev.socialMedia.map((social, i) =>
//         i === index ? { ...social, [field]: value } : social
//       ),
//     }));
//   };

//   const addSocialMedia = () => {
//     setTempData((prev) => ({
//       ...prev,
//       socialMedia: [
//         ...prev.socialMedia,
//         {
//           id: Date.now(),
//           name: "New Social",
//           icon: "Facebook",
//           href: "#",
//           hoverColor: "hover:bg-blue-600",
//         },
//       ],
//     }));
//   };

//   const removeSocialMedia = (id) => {
//     if (tempData.socialMedia.length > 1) {
//       setTempData((prev) => ({
//         ...prev,
//         socialMedia: prev.socialMedia.filter((social) => social.id !== id),
//       }));
//     }
//   };

//   const updateLegalLink = (index, field, value) => {
//     setTempData((prev) => ({
//       ...prev,
//       legalLinks: prev.legalLinks.map((link, i) =>
//         i === index ? { ...link, [field]: value } : link
//       ),
//     }));
//   };

//   const addLegalLink = () => {
//     setTempData((prev) => ({
//       ...prev,
//       legalLinks: [
//         ...prev.legalLinks,
//         { id: Date.now(), text: "New Link", href: "#" },
//       ],
//     }));
//   };

//   const removeLegalLink = (id) => {
//     if (tempData.legalLinks.length > 1) {
//       setTempData((prev) => ({
//         ...prev,
//         legalLinks: prev.legalLinks.filter((link) => link.id !== id),
//       }));
//     }
//   };

//   const getSocialIcon = (iconName) => {
//     const icons = {
//       Facebook: Facebook,
//       Github: Github,
//       Linkedin: Linkedin,
//       Instagram: Instagram,
//       Twitter: Twitter,
//     };
//     const IconComponent = icons[iconName] || Facebook;
//     return <IconComponent className="w-4 h-4" />;
//   };

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//         delayChildren: 0.2,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: {
//         duration: 0.6,
//         ease: "easeOut",
//       },
//     },
//   };

//   return (
//     <>
//       {/* Footer Preview/Edit */}
//       <motion.footer
//         className="bg-gray-900 border-t border-gray-800 relative"
//         initial={{ opacity: 0 }}
//         whileInView={{ opacity: 1 }}
//         viewport={{ once: true }}
//         transition={{ duration: 0.8 }}
//       >
//         {/* Edit Toggle - positioned in top right */}
//         <div className="absolute top-4 right-4 z-10">
//           {!isEditing ? (
//             <Button
//               onClick={handleEdit}
//               className="bg-yellow-400 hover:bg-yellow-500 text-black"
//               size="sm"
//             >
//               <Edit2 className="w-3 h-3 mr-1" />

//             </Button>
//           ) : (
//             <div className="flex gap-2">
//               <Button
//                 onClick={handleSave}
//                 className="bg-green-600 hover:bg-green-700 text-white"
//                 size="sm"
//                 disabled={isSaving || isUploading}
//               >
//                 {isUploading ? (
//                   <Loader2 className="w-3 h-3 mr-1 animate-spin" />
//                 ) : isSaving ? (
//                   <Loader2 className="w-3 h-3 mr-1 animate-spin" />
//                 ) : (
//                   <Save className="w-3 h-3 mr-1" />
//                 )}
//                 {isUploading ? "Uploading..." : isSaving ? "Saving..." : "Save"}
//               </Button>
//               <Button
//                 onClick={handleCancel}
//                 className="bg-gray-600 hover:bg-gray-700 text-white"
//                 size="sm"
//                 disabled={isSaving || isUploading}
//               >
//                 <X className="w-3 h-3 mr-1" />
//                 Cancel
//               </Button>
//             </div>
//           )}
//         </div>

//         <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 lg:py-12 relative">
//           {/* Main Footer Content */}
//           <motion.div
//             className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 text-left"
//             variants={containerVariants}
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true }}
//           >
//             {/* Brand Section */}
//             <motion.div
//               className="col-span-1 md:col-span-2 lg:col-span-1"
//               variants={itemVariants}
//             >
//               <div className="flex items-center justify-start md:justify-start space-x-3 mb-4">
//                 <span className="flex flex-row gap-2 text-xl font-bold text-yellow-400 ">
//                   <div className="relative">
//                     <img
//                       src={isEditing ? tempData.brand.logoUrl : footerData.brand.logoUrl}
//                       alt="Logo"
//                       className="w-[40px] h-[40px] rounded-xl scale-110"
//                       style={{
//                         filter: isEditing ? "brightness(0.7)" : "none",
//                       }}
//                     />
//                     {isEditing && (
//                       <div className="mt-2 flex items-center gap-2">
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           className="bg-gray-800 text-gray-100 border-gray-600 hover:bg-gray-700"
//                           onClick={() => fileInputRef.current?.click()}
//                         >
//                           <Upload className="w-3 h-3 mr-1" /> Change Logo
//                         </Button>
//                         {pendingLogoFile && (
//                           <span className="text-xs text-gray-400 max-w-[160px] truncate">
//                             Selected: {pendingLogoFile.name}
//                           </span>
//                         )}
//                       </div>
//                     )}
//                     <input
//                       type="file"
//                       ref={fileInputRef}
//                       accept="image/*"
//                       onChange={handleLogoUpload}
//                       className="hidden"
//                     />
//                   </div>
//                   {isEditing ? (
//                     <div className="flex-1">
//                       <input
//                         type="text"
//                         value={tempData.brand.name}
//                         onChange={(e) => updateBrand("name", e.target.value)}
//                         placeholder="Brand name"
//                         className="w-full p-1 border border-gray-600 rounded bg-gray-800 text-white text-sm"
//                         maxLength={CHAR_LIMITS.brandName}
//                       />
//                       <div className="text-xs text-gray-500 text-right mt-1">
//                         {tempData.brand.name.length}/{CHAR_LIMITS.brandName} characters
//                       </div>
//                     </div>
//                   ) : (
//                     footerData.brand.name
//                   )}
//                 </span>
//               </div>

//               {isEditing ? (
//                 <div className="mb-4">
//                   <label className="block text-xs text-gray-400 mb-1">
//                     Description:
//                   </label>
//                   <textarea
//                     value={tempData.brand.description}
//                     onChange={(e) => updateBrand("description", e.target.value)}
//                     placeholder="Brand description"
//                     className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white text-sm resize-none"
//                     rows={3}
//                     maxLength={CHAR_LIMITS.brandDescription}
//                   />
//                   <div className="text-xs text-gray-500 text-right mt-1">
//                     {tempData.brand.description.length}/{CHAR_LIMITS.brandDescription} characters
//                   </div>
//                 </div>
//               ) : (
//                 <p className="text-gray-300 text-sm leading-relaxed mb-6">
//                   {footerData.brand.description}
//                 </p>
//               )}
//             </motion.div>

//             {/* Dynamic Sections */}
//             {(isEditing ? tempData.sections : footerData.sections).map((section, sectionIndex) => (
//               <motion.div
//                 key={section.id}
//                 className="col-span-1"
//                 variants={itemVariants}
//               >
//                 <div className="flex items-start justify-start md:justify-start mb-4">
//                   {isEditing ? (
//                     <div className="flex items-center  w-full">
//                       <div className="flex-1">
//                         <input
//                           type="text"
//                           value={section.title}
//                           onChange={(e) =>
//                             updateSectionTitle(sectionIndex, e.target.value)
//                           }
//                           placeholder="Section title"
//                           className="w-full p-1 border border-gray-600 rounded bg-gray-800 text-white text-sm font-semibold"
//                           maxLength={CHAR_LIMITS.sectionTitle}
//                         />
//                         <div className="text-xs text-gray-500 text-right mt-1">
//                           {section.title.length}/{CHAR_LIMITS.sectionTitle} characters
//                         </div>
//                       </div>
//                       {tempData.sections.length > 1 && (
//                         <Button
//                           onClick={() => removeSection(section.id)}
//                           size="sm"
//                           variant="destructive"
//                           className="ml-2"
//                         >
//                           <Trash2 className="w-3 h-3" />
//                         </Button>
//                       )}
//                     </div>
//                   ) : (
//                     <h4 className="font-semibold text-white ">
//                       {section.title}
//                     </h4>
//                   )}
//                 </div>

//                 <ul className="space-y-3 text-sm">
//                   {section.links.map((link) => (
//                     <li key={link.id} className="flex items-center gap-2">
//                       {isEditing ? (
//                         <div className="flex-1 space-y-1">
//                           <div>
//                             <input
//                               type="text"
//                               value={link.text}
//                               onChange={(e) =>
//                                 updateSectionLink(
//                                   section.id,
//                                   link.id,
//                                   "text",
//                                   e.target.value
//                                 )
//                               }
//                               placeholder="Link text"
//                               className="w-full p-1 border border-gray-600 rounded bg-gray-800 text-white text-xs"
//                               maxLength={CHAR_LIMITS.linkText}
//                             />
//                             <div className="text-xs text-gray-500 text-right mt-1">
//                               {link.text.length}/{CHAR_LIMITS.linkText} characters
//                             </div>
//                           </div>
//                           <div>
//                             <input
//                               type="text"
//                               value={link.href}
//                               onChange={(e) =>
//                                 updateSectionLink(
//                                   section.id,
//                                   link.id,
//                                   "href",
//                                   e.target.value
//                                 )
//                               }
//                               placeholder="Link URL"
//                               className="w-full p-1 border border-gray-600 rounded bg-gray-800 text-white text-xs"
//                               maxLength={CHAR_LIMITS.linkUrl}
//                             />
//                             <div className="text-xs text-gray-500 text-right mt-1">
//                               {link.href.length}/{CHAR_LIMITS.linkUrl} characters
//                             </div>
//                           </div>
//                         </div>
//                       ) : (
//                         <a
//                           href={link.href}
//                           className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex-1"
//                         >
//                           {link.text}
//                         </a>
//                       )}

//                       {isEditing && (
//                         <button
//                           onClick={() => removeSectionLink(section.id, link.id)}
//                           className="text-red-400 hover:text-red-300 p-1"
//                         >
//                           <Trash2 className="w-3 h-3" />
//                         </button>
//                       )}
//                     </li>
//                   ))}

//                   {isEditing && (
//                     <li>
//                       <button
//                         onClick={() => addSectionLink(section.id)}
//                         className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm"
//                       >
//                         <Plus className="w-3 h-3" />
//                         Add Link
//                       </button>
//                     </li>
//                   )}
//                 </ul>
//               </motion.div>
//             ))}

//             {/* Add Section Button */}
//             {isEditing && (
//               <motion.div
//                 className="col-span-1 flex items-center justify-center"
//                 variants={itemVariants}
//               >
//                 <Button
//                   onClick={addSection}
//                   size="sm"
//                   variant="outline"
//                   className="text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
//                 >
//                   <Plus className="w-4 h-4 mr-1" />
//                   Add Section
//                 </Button>
//               </motion.div>
//             )}
//           </motion.div>

//           {/* Edit Mode Instructions */}
//           {isEditing && (
//             <motion.div
//               className="mt-8 p-4 bg-blue-900/50 rounded-lg border border-blue-700"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//             >
//               <p className="text-sm text-blue-300 mb-2">
//                 <strong>Edit Mode Active:</strong> Character limits:
//               </p>
//               <ul className="text-xs text-blue-300 space-y-1">
//                 <li>• <strong>Brand Name:</strong> {CHAR_LIMITS.brandName} characters</li>
//                 <li>• <strong>Brand Description:</strong> {CHAR_LIMITS.brandDescription} characters</li>
//                 <li>• <strong>Section Titles:</strong> {CHAR_LIMITS.sectionTitle} characters</li>
//                 <li>• <strong>Link Text:</strong> {CHAR_LIMITS.linkText} characters</li>
//                 <li>• <strong>Link URLs:</strong> {CHAR_LIMITS.linkUrl} characters</li>
//               </ul>
//             </motion.div>
//           )}
//         </div>
//       </motion.footer>

//       {/* Enhanced Crop Modal */}
//       {cropModalOpen && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="fixed inset-0 bg-black/90 z-[99999999] flex items-center justify-center p-4"
//         >
//           <motion.div
//             initial={{ scale: 0.9, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             className="bg-white rounded-xl max-w-4xl w-full h-[90vh] flex flex-col"
//           >
//             {/* Header */}
//             <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
//               <h3 className="text-lg font-semibold text-gray-800">
//                 Crop Logo
//               </h3>
//               <button
//                 onClick={cancelCrop}
//                 className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-600" />
//               </button>
//             </div>

//             {/* Cropper Area */}
//             <div className="flex-1 relative bg-gray-900 min-h-0">
//               <div className="relative w-full h-full">
//                 <Cropper
//                   image={imageToCrop}
//                   crop={crop}
//                   zoom={zoom}
//                   rotation={rotation}
//                   aspect={aspectRatio}
//                   minZoom={0.5}
//                   maxZoom={4}
//                   restrictPosition={false}
//                   onCropChange={setCrop}
//                   onZoomChange={setZoom}
//                   onCropComplete={onCropComplete}
//                   showGrid={false}
//                   cropShape="rect"
//                   style={{
//                     containerStyle: {
//                       position: "relative",
//                       width: "100%",
//                       height: "100%",
//                     },
//                     cropAreaStyle: {
//                       border: "2px solid white",
//                       borderRadius: "8px",
//                     },
//                   }}
//                 />
//               </div>
//             </div>

//             {/* Controls */}
//             <div className="p-4 bg-gray-50 border-t border-gray-200">
//               {/* Aspect Ratio Buttons */}
//               <div className="mb-4">
//                 <p className="text-sm font-medium text-gray-700 mb-2">Aspect Ratio:</p>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => setAspectRatio(1)}
//                     className={`px-3 py-2 text-sm rounded border ${aspectRatio === 1
//                       ? 'bg-blue-500 text-white border-blue-500'
//                       : 'bg-white text-gray-700 border-gray-300'
//                       }`}
//                   >
//                     1:1 (Square)
//                   </button>
//                   <button
//                     onClick={() => setAspectRatio(4 / 3)}
//                     className={`px-3 py-2 text-sm rounded border ${aspectRatio === 4 / 3
//                       ? 'bg-blue-500 text-white border-blue-500'
//                       : 'bg-white text-gray-700 border-gray-300'
//                       }`}
//                   >
//                     4:3 (Standard)
//                   </button>
//                   <button
//                     onClick={() => setAspectRatio(16 / 9)}
//                     className={`px-3 py-2 text-sm rounded border ${aspectRatio === 16 / 9
//                       ? 'bg-blue-500 text-white border-blue-500'
//                       : 'bg-white text-gray-700 border-gray-300'
//                       }`}
//                   >
//                     16:9 (Widescreen)
//                   </button>
//                 </div>
//               </div>

//               {/* Zoom Control */}
//               <div className="space-y-2 mb-4">
//                 <div className="flex items-center justify-between text-sm">
//                   <span className="text-gray-700">Zoom</span>
//                   <span className="text-gray-600">{zoom.toFixed(1)}x</span>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <button
//                     type="button"
//                     onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.1).toFixed(2)))}
//                     className="px-3 py-1.5 text-sm rounded border bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
//                   >
//                     −
//                   </button>
//                   <input
//                     type="range"
//                     value={zoom}
//                     min={0.5}
//                     max={4}
//                     step={0.1}
//                     onChange={(e) => setZoom(Number(e.target.value))}
//                     className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setZoom((z) => Math.min(4, +(z + 0.1).toFixed(2)))}
//                     className="px-3 py-1.5 text-sm rounded border bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
//                   >
//                     +
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => setZoom(1)}
//                     className="px-3 py-1.5 text-sm rounded border bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
//                   >
//                     1x
//                   </button>
//                 </div>
//               </div>

//               {/* Action Buttons */}
//               <div className="grid grid-cols-3 gap-3">
//                 <button
//                   onClick={resetCropSettings}
//                   className="w-full border border-gray-300 text-gray-700 hover:bg-gray-100 rounded py-2 text-sm font-medium"
//                 >
//                   Reset
//                 </button>
//                 <button
//                   onClick={cancelCrop}
//                   className="w-full border border-gray-300 text-gray-700 hover:bg-gray-100 rounded py-2 text-sm font-medium"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={applyCrop}
//                   className="w-full bg-green-600 hover:bg-green-700 text-white rounded py-2 text-sm font-medium"
//                 >
//                   Apply Crop
//                 </button>
//               </div>
//             </div>
//           </motion.div>
//         </motion.div>
//       )}
//     </>
//   );
// }

// import {
//   ArrowRight,
//   Edit2,
//   Facebook,
//   Github,
//   Instagram,
//   Linkedin,
//   Mail,
//   MapPin,
//   Phone,
//   Plus,
//   Save,
//   Trash2,
//   Twitter,
//   Upload,
//   X,
//   Loader2,
//   RotateCw,
//   ZoomIn,
// } from "lucide-react";
// import { motion } from "motion/react";
// import { useEffect, useRef, useState, useCallback } from "react";
// import { toast } from "react-toastify";
// import { Button } from "../components/ui/button";
// import { Input } from "../components/ui/input";
// import Cropper from "react-easy-crop";
// import debounce from 'lodash/debounce';

// // Enhanced crop helper function
// const createImage = (url) =>
//   new Promise((resolve, reject) => {
//     const image = new Image();
//     image.addEventListener("load", () => resolve(image));
//     image.addEventListener("error", (error) => reject(error));
//     image.setAttribute("crossOrigin", "anonymous");
//     image.src = url;
//   });

// const getCroppedImg = async (imageSrc, pixelCrop, rotation = 0) => {
//   const image = await createImage(imageSrc);
//   const canvas = document.createElement("canvas");
//   const ctx = canvas.getContext("2d");

//   canvas.width = pixelCrop.width;
//   canvas.height = pixelCrop.height;

//   ctx.translate(pixelCrop.width / 2, pixelCrop.height / 2);
//   ctx.rotate((rotation * Math.PI) / 180);
//   ctx.translate(-pixelCrop.width / 2, -pixelCrop.height / 2);

//   ctx.drawImage(
//     image,
//     pixelCrop.x,
//     pixelCrop.y,
//     pixelCrop.width,
//     pixelCrop.height,
//     0,
//     0,
//     pixelCrop.width,
//     pixelCrop.height
//   );

//   return new Promise((resolve) => {
//     canvas.toBlob(
//       (blob) => {
//         const fileName = `cropped-image-${Date.now()}.jpg`;
//         const file = new File([blob], fileName, {
//           type: "image/jpeg",
//           lastModified: Date.now(),
//         });

//         const previewUrl = URL.createObjectURL(blob);

//         resolve({
//           file,
//           previewUrl,
//         });
//       },
//       "image/jpeg",
//       0.95
//     );
//   });
// };

// export default function EditableFooter({
//   content,
//   onStateChange,
//   userId,
//   publishedId,
//   templateSelection,
// }) {
//   // Character limits - applied from your requirements
//   const CHAR_LIMITS = {
//     brandName: 100,
//     brandDescription: 500,
//     sectionTitle: 50,
//     linkText: 50,
//     linkUrl: 50,
//     contactEmail: 50,
//     contactPhone: 50,
//     contactAddress: 50,
//     socialName: 50,
//     socialUrl: 50,
//     legalText: 50,
//     legalUrl: 50,
//   };

//   // Initialize with data from props or use default structure
//   const initialData = {
//     brand: {
//       name: content?.name || "Innovative Labs",
//       description: content?.description || "Innovative solutions for modern businesses. Transform your operations with our expert guidance and cutting-edge technology.",
//       logoUrl: content?.logo || "/api/placeholder/32/32",
//     },
//     contact: {
//       email: "hello@innovativelabs.com",
//       phone: "+1 (555) 123-4567",
//       address: "San Francisco, CA 94105",
//     },
//     sections: [
//       {
//         id: 1,
//         title: "Company",
//         links: [
//           { id: 1, text: "About Us", href: "#about" },
//           { id: 2, text: "Our Team", href: "#team" },
//           { id: 3, text: "Careers", href: "#careers" },
//           { id: 4, text: "News & Press", href: "#news" },
//         ],
//       },
//       {
//         id: 2,
//         title: "Services",
//         links: [
//           { id: 1, text: "Consulting", href: "#consulting" },
//           { id: 2, text: "Development", href: "#development" },
//           { id: 3, text: "Support & Maintenance", href: "#support" },
//           { id: 4, text: "Training", href: "#training" },
//         ],
//       },
//     ],
//     socialMedia: [
//       {
//         id: 1,
//         name: "Facebook",
//         icon: "Facebook",
//         href: "#",
//         hoverColor: "hover:bg-blue-600",
//       },
//       {
//         id: 2,
//         name: "Twitter",
//         icon: "Twitter",
//         href: "#",
//         hoverColor: "hover:bg-blue-400",
//       },
//       {
//         id: 3,
//         name: "Instagram",
//         icon: "Instagram",
//         href: "#",
//         hoverColor: "hover:bg-pink-600",
//       },
//       {
//         id: 4,
//         name: "LinkedIn",
//         icon: "Linkedin",
//         href: "#",
//         hoverColor: "hover:bg-blue-700",
//       },
//     ],
//     legalLinks: [
//       { id: 1, text: "Privacy Policy", href: "#privacy" },
//       { id: 2, text: "Terms of Service", href: "#terms" },
//       { id: 3, text: "Cookie Policy", href: "#cookies" },
//     ],
//     copyright: "© 2024 Innovative Labs. All rights reserved.",
//   };

//   const [isEditing, setIsEditing] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [footerData, setFooterData] = useState(initialData);
//   const [tempData, setTempData] = useState(initialData);
//   const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);
//   const fileInputRef = useRef(null);
//   const saveTimeoutRef = useRef(null);

//   // Enhanced crop modal state
//   const [cropModalOpen, setCropModalOpen] = useState(false);
//   const [crop, setCrop] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);
//   const [rotation, setRotation] = useState(0);
//   const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
//   const [imageToCrop, setImageToCrop] = useState(null);
//   const [originalFile, setOriginalFile] = useState(null);
//   const [aspectRatio, setAspectRatio] = useState(1);

//   // Auto-save configuration
//   const AUTO_SAVE_DELAY = 2000; // 2 seconds

//   // Update state when content prop changes
//   useEffect(() => {
//     if (content) {
//       const updatedData = {
//         ...initialData,
//         brand: {
//           ...initialData.brand,
//           logoUrl: content.logo || initialData.brand.logoUrl,
//           name: content.name || initialData.brand.name,
//         },
//       };
//       setFooterData(updatedData);
//       setTempData(updatedData);
//     }
//   }, [content]);

//   // Notify parent of state changes
//   useEffect(() => {
//     if (onStateChange) {
//       onStateChange(footerData);
//     }
//   }, [footerData, onStateChange]);

//   // Auto-save function
//   const autoSave = useCallback(
//     debounce(async (data) => {
//       if (!hasUnsavedChanges) return;

//       setIsSaving(true);
//       try {
//         // Here you would typically send the data to your backend
//         // For now, we'll just update the local state
//         setFooterData(data);
//         setHasUnsavedChanges(false);
        
//         // Show auto-save notification
//         toast.success("Changes saved automatically", {
//           position: "bottom-right",
//           autoClose: 2000,
//           hideProgressBar: true,
//         });
//       } catch (error) {
//         console.error("Auto-save failed:", error);
//         toast.error("Auto-save failed");
//       } finally {
//         setIsSaving(false);
//       }
//     }, AUTO_SAVE_DELAY),
//     [hasUnsavedChanges]
//   );

//   // Trigger auto-save when tempData changes
//   useEffect(() => {
//     if (isEditing && hasUnsavedChanges) {
//       autoSave(tempData);
//     }

//     return () => {
//       if (saveTimeoutRef.current) {
//         clearTimeout(saveTimeoutRef.current);
//       }
//     };
//   }, [tempData, isEditing, hasUnsavedChanges, autoSave]);

//   // Enhanced cropper functions
//   const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
//     setCroppedAreaPixels(croppedAreaPixels);
//   }, []);

//   // Enhanced image upload handler with crop modal and direct AWS upload
//   const handleLogoUpload = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     // Validate file type and size
//     if (!file.type.startsWith("image/")) {
//       toast.error("Please select an image file");
//       return;
//     }

//     if (file.size > 5 * 1024 * 1024) {
//       toast.error("File size must be less than 5MB");
//       return;
//     }

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setImageToCrop(reader.result);
//       setOriginalFile(file);
//       setCropModalOpen(true);
//       setAspectRatio(1); // Square for logo
//       setCrop({ x: 0, y: 0 });
//       setZoom(1);
//       setRotation(0);
//     };
//     reader.readAsDataURL(file);

//     if (e.target) {
//       e.target.value = "";
//     }
//   };

//   // Upload cropped image directly to AWS
//   const uploadToAWS = async (file) => {
//     if (!userId || !publishedId || !templateSelection) {
//       console.error("Missing required props:", {
//         userId,
//         publishedId,
//         templateSelection,
//       });
//       throw new Error("Missing user information. Please refresh and try again.");
//     }

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("sectionName", "footer");
//     formData.append("imageField", "logoUrl" + Date.now());
//     formData.append("templateSelection", templateSelection);

//     const uploadResponse = await fetch(
//       `https://o66ziwsye5.execute-api.ap-south-1.amazonaws.com/prod/upload-image/${userId}/${publishedId}`,
//       {
//         method: "POST",
//         body: formData,
//       }
//     );

//     if (!uploadResponse.ok) {
//       const errorData = await uploadResponse.json();
//       throw new Error(errorData.message || "Upload failed");
//     }

//     const uploadData = await uploadResponse.json();
//     return uploadData.imageUrl;
//   };

//   // Apply crop and upload directly to AWS
//   const applyCrop = async () => {
//     try {
//       if (!imageToCrop || !croppedAreaPixels) {
//         console.error("Please select an area to crop");
//         return;
//       }

//       setIsUploading(true);

//       const { file, previewUrl } = await getCroppedImg(
//         imageToCrop,
//         croppedAreaPixels,
//         rotation
//       );

//       // Upload directly to AWS
//       const awsImageUrl = await uploadToAWS(file);

//       // Update the data with AWS URL and trigger auto-save
//       updateNestedField("brand.logoUrl", awsImageUrl);
//       setHasUnsavedChanges(true);

//       setCropModalOpen(false);
//       setImageToCrop(null);
//       setOriginalFile(null);
      
//       toast.success("Logo uploaded successfully");
//     } catch (error) {
//       console.error("Error uploading image:", error);
//       toast.error(`Upload failed: ${error.message}`);
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const cancelCrop = () => {
//     setCropModalOpen(false);
//     setImageToCrop(null);
//     setOriginalFile(null);
//     setCrop({ x: 0, y: 0 });
//     setZoom(1);
//     setRotation(0);
//   };

//   const resetCropSettings = () => {
//     setZoom(1);
//     setRotation(0);
//     setCrop({ x: 0, y: 0 });
//   };

//   const handleEdit = () => {
//     setIsEditing(true);
//     setTempData(footerData);
//     setHasUnsavedChanges(false);
//   };

//   const handleCancel = () => {
//     setTempData(footerData);
//     setIsEditing(false);
//     setHasUnsavedChanges(false);
//   };

//   const handleSave = async () => {
//     // Manual save trigger - same as auto-save but immediate
//     setIsSaving(true);
//     try {
//       setFooterData(tempData);
//       setHasUnsavedChanges(false);
//       setIsEditing(false);
//       toast.success("Changes saved successfully");
//     } catch (error) {
//       console.error("Error saving footer:", error);
//       toast.error("Error saving changes. Please try again.");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const updateNestedField = (path, value) => {
//     setTempData((prev) => {
//       const newData = JSON.parse(JSON.stringify(prev));
//       const keys = path.split(".");
//       let current = newData;

//       for (let i = 0; i < keys.length - 1; i++) {
//         current = current[keys[i]];
//       }
//       current[keys[keys.length - 1]] = value;

//       return newData;
//     });
//     setHasUnsavedChanges(true);
//   };

//   // Simplified update functions - all now trigger auto-save
//   const updateBrand = (field, value) => {
//     setTempData((prev) => ({
//       ...prev,
//       brand: { ...prev.brand, [field]: value },
//     }));
//     setHasUnsavedChanges(true);
//   };

//   const updateContact = (field, value) => {
//     setTempData((prev) => ({
//       ...prev,
//       contact: { ...prev.contact, [field]: value },
//     }));
//     setHasUnsavedChanges(true);
//   };

//   const updateSectionTitle = (sectionIndex, value) => {
//     setTempData((prev) => ({
//       ...prev,
//       sections: prev.sections.map((section, index) =>
//         index === sectionIndex ? { ...section, title: value } : section
//       ),
//     }));
//     setHasUnsavedChanges(true);
//   };

//   const addSectionLink = (sectionId) => {
//     setTempData((prev) => ({
//       ...prev,
//       sections: prev.sections.map((section) =>
//         section.id === sectionId
//           ? {
//             ...section,
//             links: [
//               ...section.links,
//               {
//                 id: Date.now(),
//                 text: "New Link",
//                 href: "#new",
//               },
//             ],
//           }
//           : section
//       ),
//     }));
//     setHasUnsavedChanges(true);
//   };

//   const removeSectionLink = (sectionId, linkId) => {
//     setTempData((prev) => ({
//       ...prev,
//       sections: prev.sections.map((section) =>
//         section.id === sectionId
//           ? {
//             ...section,
//             links: section.links.filter((link) => link.id !== linkId),
//           }
//           : section
//       ),
//     }));
//     setHasUnsavedChanges(true);
//   };

//   const updateSectionLink = (sectionId, linkId, field, value) => {
//     setTempData((prev) => ({
//       ...prev,
//       sections: prev.sections.map((section) =>
//         section.id === sectionId
//           ? {
//             ...section,
//             links: section.links.map((link) =>
//               link.id === linkId ? { ...link, [field]: value } : link
//             ),
//           }
//           : section
//       ),
//     }));
//     setHasUnsavedChanges(true);
//   };

//   const addSection = () => {
//     setTempData((prev) => ({
//       ...prev,
//       sections: [
//         ...prev.sections,
//         {
//           id: Date.now(),
//           title: "New Section",
//           links: [{ id: Date.now() + 1, text: "New Link", href: "#" }],
//         },
//       ],
//     }));
//     setHasUnsavedChanges(true);
//   };

//   const removeSection = (sectionId) => {
//     if (tempData.sections.length > 1) {
//       setTempData((prev) => ({
//         ...prev,
//         sections: prev.sections.filter((section) => section.id !== sectionId),
//       }));
//       setHasUnsavedChanges(true);
//     }
//   };

//   const updateSocialMedia = (index, field, value) => {
//     setTempData((prev) => ({
//       ...prev,
//       socialMedia: prev.socialMedia.map((social, i) =>
//         i === index ? { ...social, [field]: value } : social
//       ),
//     }));
//     setHasUnsavedChanges(true);
//   };

//   const addSocialMedia = () => {
//     setTempData((prev) => ({
//       ...prev,
//       socialMedia: [
//         ...prev.socialMedia,
//         {
//           id: Date.now(),
//           name: "New Social",
//           icon: "Facebook",
//           href: "#",
//           hoverColor: "hover:bg-blue-600",
//         },
//       ],
//     }));
//     setHasUnsavedChanges(true);
//   };

//   const removeSocialMedia = (id) => {
//     if (tempData.socialMedia.length > 1) {
//       setTempData((prev) => ({
//         ...prev,
//         socialMedia: prev.socialMedia.filter((social) => social.id !== id),
//       }));
//       setHasUnsavedChanges(true);
//     }
//   };

//   const updateLegalLink = (index, field, value) => {
//     setTempData((prev) => ({
//       ...prev,
//       legalLinks: prev.legalLinks.map((link, i) =>
//         i === index ? { ...link, [field]: value } : link
//       ),
//     }));
//     setHasUnsavedChanges(true);
//   };

//   const addLegalLink = () => {
//     setTempData((prev) => ({
//       ...prev,
//       legalLinks: [
//         ...prev.legalLinks,
//         { id: Date.now(), text: "New Link", href: "#" },
//       ],
//     }));
//     setHasUnsavedChanges(true);
//   };

//   const removeLegalLink = (id) => {
//     if (tempData.legalLinks.length > 1) {
//       setTempData((prev) => ({
//         ...prev,
//         legalLinks: prev.legalLinks.filter((link) => link.id !== id),
//       }));
//       setHasUnsavedChanges(true);
//     }
//   };

//   const getSocialIcon = (iconName) => {
//     const icons = {
//       Facebook: Facebook,
//       Github: Github,
//       Linkedin: Linkedin,
//       Instagram: Instagram,
//       Twitter: Twitter,
//     };
//     const IconComponent = icons[iconName] || Facebook;
//     return <IconComponent className="w-4 h-4" />;
//   };

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//         delayChildren: 0.2,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: {
//         duration: 0.6,
//         ease: "easeOut",
//       },
//     },
//   };

//   return (
//     <>
//       {/* Footer Preview/Edit */}
//       <motion.footer
//         className="bg-gray-900 border-t border-gray-800 relative"
//         initial={{ opacity: 0 }}
//         whileInView={{ opacity: 1 }}
//         viewport={{ once: true }}
//         transition={{ duration: 0.8 }}
//       >
//         {/* Edit Toggle - positioned in top right */}
//         <div className="absolute top-4 right-4 z-10">
//           {!isEditing ? (
//             <Button
//               onClick={handleEdit}
//               className="bg-yellow-400 hover:bg-yellow-500 text-black"
//               size="sm"
//             >
//               <Edit2 className="w-3 h-3 mr-1" />
//             </Button>
//           ) : (
//             <div className="flex gap-2">
//               <Button
//                 onClick={handleSave}
//                 className="bg-green-600 hover:bg-green-700 text-white"
//                 size="sm"
//                 disabled={isSaving || isUploading || !hasUnsavedChanges}
//               >
//                 {isSaving ? (
//                   <Loader2 className="w-3 h-3 mr-1 animate-spin" />
//                 ) : (
//                   <Save className="w-3 h-3 mr-1" />
//                 )}
//                 {isSaving ? "Saving..." : "Save"}
//               </Button>
//               <Button
//                 onClick={handleCancel}
//                 className="bg-gray-600 hover:bg-gray-700 text-white"
//                 size="sm"
//                 disabled={isSaving || isUploading}
//               >
//                 <X className="w-3 h-3 mr-1" />
//                 Cancel
//               </Button>
//             </div>
//           )}
//         </div>

//         {/* Auto-save indicator */}
//         {isEditing && (
//           <div className="absolute top-4 left-4 z-10">
//             <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
//               isSaving 
//                 ? 'bg-blue-500 text-white' 
//                 : hasUnsavedChanges 
//                   ? 'bg-yellow-500 text-black' 
//                   : 'bg-green-500 text-white'
//             }`}>
//               {isSaving ? (
//                 <>
//                   <Loader2 className="w-3 h-3 animate-spin" />
//                   Auto-saving...
//                 </>
//               ) : hasUnsavedChanges ? (
//                 <>
//                   <Loader2 className="w-3 h-3 animate-pulse" />
//                   Unsaved changes
//                 </>
//               ) : (
//                 <>
//                   <Save className="w-3 h-3" />
//                   All changes saved
//                 </>
//               )}
//             </div>
//           </div>
//         )}

//         <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 lg:py-12 relative">
//           {/* Main Footer Content */}
//           <motion.div
//             className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 text-left"
//             variants={containerVariants}
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true }}
//           >
//             {/* Brand Section */}
//             <motion.div
//               className="col-span-1 md:col-span-2 lg:col-span-1"
//               variants={itemVariants}
//             >
//               <div className="flex items-center justify-start md:justify-start space-x-3 mb-4">
//                 <span className="flex flex-row gap-2 text-xl font-bold text-yellow-400 ">
//                   <div className="relative">
//                     <img
//                       src={isEditing ? tempData.brand.logoUrl : footerData.brand.logoUrl}
//                       alt="Logo"
//                       className="w-[40px] h-[40px] rounded-xl scale-110"
//                       style={{
//                         filter: isEditing ? "brightness(0.7)" : "none",
//                       }}
//                     />
//                     {isEditing && (
//                       <div className="mt-2 flex items-center gap-2">
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           className="bg-gray-800 text-gray-100 border-gray-600 hover:bg-gray-700"
//                           onClick={() => fileInputRef.current?.click()}
//                         >
//                           <Upload className="w-3 h-3 mr-1" /> Change Logo
//                         </Button>
//                       </div>
//                     )}
//                     <input
//                       type="file"
//                       ref={fileInputRef}
//                       accept="image/*"
//                       onChange={handleLogoUpload}
//                       className="hidden"
//                     />
//                   </div>
//                   {isEditing ? (
//                     <div className="flex-1">
//                       <input
//                         type="text"
//                         value={tempData.brand.name}
//                         onChange={(e) => updateBrand("name", e.target.value)}
//                         placeholder="Brand name"
//                         className="w-full p-1 border border-gray-600 rounded bg-gray-800 text-white text-sm"
//                         maxLength={CHAR_LIMITS.brandName}
//                       />
//                       <div className="text-xs text-gray-500 text-right mt-1">
//                         {tempData.brand.name.length}/{CHAR_LIMITS.brandName} characters
//                       </div>
//                     </div>
//                   ) : (
//                     footerData.brand.name
//                   )}
//                 </span>
//               </div>

//               {isEditing ? (
//                 <div className="mb-4">
//                   <label className="block text-xs text-gray-400 mb-1">
//                     Description:
//                   </label>
//                   <textarea
//                     value={tempData.brand.description}
//                     onChange={(e) => updateBrand("description", e.target.value)}
//                     placeholder="Brand description"
//                     className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white text-sm resize-none"
//                     rows={3}
//                     maxLength={CHAR_LIMITS.brandDescription}
//                   />
//                   <div className="text-xs text-gray-500 text-right mt-1">
//                     {tempData.brand.description.length}/{CHAR_LIMITS.brandDescription} characters
//                   </div>
//                 </div>
//               ) : (
//                 <p className="text-gray-300 text-sm leading-relaxed mb-6">
//                   {footerData.brand.description}
//                 </p>
//               )}
//             </motion.div>

//             {/* Dynamic Sections */}
//             {(isEditing ? tempData.sections : footerData.sections).map((section, sectionIndex) => (
//               <motion.div
//                 key={section.id}
//                 className="col-span-1"
//                 variants={itemVariants}
//               >
//                 <div className="flex items-start justify-start md:justify-start mb-4">
//                   {isEditing ? (
//                     <div className="flex items-center  w-full">
//                       <div className="flex-1">
//                         <input
//                           type="text"
//                           value={section.title}
//                           onChange={(e) =>
//                             updateSectionTitle(sectionIndex, e.target.value)
//                           }
//                           placeholder="Section title"
//                           className="w-full p-1 border border-gray-600 rounded bg-gray-800 text-white text-sm font-semibold"
//                           maxLength={CHAR_LIMITS.sectionTitle}
//                         />
//                         <div className="text-xs text-gray-500 text-right mt-1">
//                           {section.title.length}/{CHAR_LIMITS.sectionTitle} characters
//                         </div>
//                       </div>
//                       {tempData.sections.length > 1 && (
//                         <Button
//                           onClick={() => removeSection(section.id)}
//                           size="sm"
//                           variant="destructive"
//                           className="ml-2"
//                         >
//                           <Trash2 className="w-3 h-3" />
//                         </Button>
//                       )}
//                     </div>
//                   ) : (
//                     <h4 className="font-semibold text-white ">
//                       {section.title}
//                     </h4>
//                   )}
//                 </div>

//                 <ul className="space-y-3 text-sm">
//                   {section.links.map((link) => (
//                     <li key={link.id} className="flex items-center gap-2">
//                       {isEditing ? (
//                         <div className="flex-1 space-y-1">
//                           <div>
//                             <input
//                               type="text"
//                               value={link.text}
//                               onChange={(e) =>
//                                 updateSectionLink(
//                                   section.id,
//                                   link.id,
//                                   "text",
//                                   e.target.value
//                                 )
//                               }
//                               placeholder="Link text"
//                               className="w-full p-1 border border-gray-600 rounded bg-gray-800 text-white text-xs"
//                               maxLength={CHAR_LIMITS.linkText}
//                             />
//                             <div className="text-xs text-gray-500 text-right mt-1">
//                               {link.text.length}/{CHAR_LIMITS.linkText} characters
//                             </div>
//                           </div>
//                           <div>
//                             <input
//                               type="text"
//                               value={link.href}
//                               onChange={(e) =>
//                                 updateSectionLink(
//                                   section.id,
//                                   link.id,
//                                   "href",
//                                   e.target.value
//                                 )
//                               }
//                               placeholder="Link URL"
//                               className="w-full p-1 border border-gray-600 rounded bg-gray-800 text-white text-xs"
//                               maxLength={CHAR_LIMITS.linkUrl}
//                             />
//                             <div className="text-xs text-gray-500 text-right mt-1">
//                               {link.href.length}/{CHAR_LIMITS.linkUrl} characters
//                             </div>
//                           </div>
//                         </div>
//                       ) : (
//                         <a
//                           href={link.href}
//                           className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex-1"
//                         >
//                           {link.text}
//                         </a>
//                       )}

//                       {isEditing && (
//                         <button
//                           onClick={() => removeSectionLink(section.id, link.id)}
//                           className="text-red-400 hover:text-red-300 p-1"
//                         >
//                           <Trash2 className="w-3 h-3" />
//                         </button>
//                       )}
//                     </li>
//                   ))}

//                   {isEditing && (
//                     <li>
//                       <button
//                         onClick={() => addSectionLink(section.id)}
//                         className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm"
//                       >
//                         <Plus className="w-3 h-3" />
//                         Add Link
//                       </button>
//                     </li>
//                   )}
//                 </ul>
//               </motion.div>
//             ))}

//             {/* Add Section Button */}
//             {isEditing && (
//               <motion.div
//                 className="col-span-1 flex items-center justify-center"
//                 variants={itemVariants}
//               >
//                 <Button
//                   onClick={addSection}
//                   size="sm"
//                   variant="outline"
//                   className="text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
//                 >
//                   <Plus className="w-4 h-4 mr-1" />
//                   Add Section
//                 </Button>
//               </motion.div>
//             )}
//           </motion.div>

//           {/* Edit Mode Instructions */}
//           {isEditing && (
//             <motion.div
//               className="mt-8 p-4 bg-blue-900/50 rounded-lg border border-blue-700"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//             >
//               <p className="text-sm text-blue-300 mb-2">
//                 <strong>Edit Mode Active:</strong> Changes are saved automatically every 2 seconds
//               </p>
//               <ul className="text-xs text-blue-300 space-y-1">
//                 <li>• <strong>Brand Name:</strong> {CHAR_LIMITS.brandName} characters</li>
//                 <li>• <strong>Brand Description:</strong> {CHAR_LIMITS.brandDescription} characters</li>
//                 <li>• <strong>Section Titles:</strong> {CHAR_LIMITS.sectionTitle} characters</li>
//                 <li>• <strong>Link Text:</strong> {CHAR_LIMITS.linkText} characters</li>
//                 <li>• <strong>Link URLs:</strong> {CHAR_LIMITS.linkUrl} characters</li>
//               </ul>
//             </motion.div>
//           )}
//         </div>
//       </motion.footer>

//       {/* Enhanced Crop Modal */}
//       {cropModalOpen && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="fixed inset-0 bg-black/90 z-[99999999] flex items-center justify-center p-4"
//         >
//           <motion.div
//             initial={{ scale: 0.9, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             className="bg-white rounded-xl max-w-4xl w-full h-[90vh] flex flex-col"
//           >
//             {/* Header */}
//             <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
//               <h3 className="text-lg font-semibold text-gray-800">
//                 Crop Logo
//               </h3>
//               <button
//                 onClick={cancelCrop}
//                 className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-600" />
//               </button>
//             </div>

//             {/* Cropper Area */}
//             <div className="flex-1 relative bg-gray-900 min-h-0">
//               <div className="relative w-full h-full">
//                 <Cropper
//                   image={imageToCrop}
//                   crop={crop}
//                   zoom={zoom}
//                   rotation={rotation}
//                   aspect={aspectRatio}
//                   minZoom={0.5}
//                   maxZoom={4}
//                   restrictPosition={false}
//                   onCropChange={setCrop}
//                   onZoomChange={setZoom}
//                   onCropComplete={onCropComplete}
//                   showGrid={false}
//                   cropShape="rect"
//                   style={{
//                     containerStyle: {
//                       position: "relative",
//                       width: "100%",
//                       height: "100%",
//                     },
//                     cropAreaStyle: {
//                       border: "2px solid white",
//                       borderRadius: "8px",
//                     },
//                   }}
//                 />
//               </div>
//             </div>

//             {/* Controls */}
//             <div className="p-4 bg-gray-50 border-t border-gray-200">
//               {/* Aspect Ratio Buttons */}
//               <div className="mb-4">
//                 <p className="text-sm font-medium text-gray-700 mb-2">Aspect Ratio:</p>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => setAspectRatio(1)}
//                     className={`px-3 py-2 text-sm rounded border ${aspectRatio === 1
//                       ? 'bg-blue-500 text-white border-blue-500'
//                       : 'bg-white text-gray-700 border-gray-300'
//                       }`}
//                   >
//                     1:1 (Square)
//                   </button>
//                   <button
//                     onClick={() => setAspectRatio(4 / 3)}
//                     className={`px-3 py-2 text-sm rounded border ${aspectRatio === 4 / 3
//                       ? 'bg-blue-500 text-white border-blue-500'
//                       : 'bg-white text-gray-700 border-gray-300'
//                       }`}
//                   >
//                     4:3 (Standard)
//                   </button>
//                   <button
//                     onClick={() => setAspectRatio(16 / 9)}
//                     className={`px-3 py-2 text-sm rounded border ${aspectRatio === 16 / 9
//                       ? 'bg-blue-500 text-white border-blue-500'
//                       : 'bg-white text-gray-700 border-gray-300'
//                       }`}
//                   >
//                     16:9 (Widescreen)
//                   </button>
//                 </div>
//               </div>

//               {/* Zoom Control */}
//               <div className="space-y-2 mb-4">
//                 <div className="flex items-center justify-between text-sm">
//                   <span className="text-gray-700">Zoom</span>
//                   <span className="text-gray-600">{zoom.toFixed(1)}x</span>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <button
//                     type="button"
//                     onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.1).toFixed(2)))}
//                     className="px-3 py-1.5 text-sm rounded border bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
//                   >
//                     −
//                   </button>
//                   <input
//                     type="range"
//                     value={zoom}
//                     min={0.5}
//                     max={4}
//                     step={0.1}
//                     onChange={(e) => setZoom(Number(e.target.value))}
//                     className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setZoom((z) => Math.min(4, +(z + 0.1).toFixed(2)))}
//                     className="px-3 py-1.5 text-sm rounded border bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
//                   >
//                     +
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => setZoom(1)}
//                     className="px-3 py-1.5 text-sm rounded border bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
//                   >
//                     1x
//                   </button>
//                 </div>
//               </div>

//               {/* Action Buttons */}
//               <div className="grid grid-cols-3 gap-3">
//                 <button
//                   onClick={resetCropSettings}
//                   className="w-full border border-gray-300 text-gray-700 hover:bg-gray-100 rounded py-2 text-sm font-medium"
//                 >
//                   Reset
//                 </button>
//                 <button
//                   onClick={cancelCrop}
//                   className="w-full border border-gray-300 text-gray-700 hover:bg-gray-100 rounded py-2 text-sm font-medium"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={applyCrop}
//                   disabled={isUploading}
//                   className="w-full bg-green-600 hover:bg-green-700 text-white rounded py-2 text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
//                 >
//                   {isUploading ? (
//                     <>
//                       <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
//                       Uploading...
//                     </>
//                   ) : (
//                     "Apply Crop & Upload"
//                   )}
//                 </button>
//               </div>
//             </div>
//           </motion.div>
//         </motion.div>
//       )}
//     </>
//   );
// }



import {
  ArrowRight,
  Edit2,
  Facebook,
  Github,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Plus,
  Save,
  Trash2,
  Twitter,
  Upload,
  X,
  Loader2,
  RotateCw,
  ZoomIn,
  Check,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import Cropper from "react-easy-crop";

// Enhanced crop helper function
const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

const getCroppedImg = async (imageSrc, pixelCrop, rotation = 0) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.translate(pixelCrop.width / 2, pixelCrop.height / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.translate(-pixelCrop.width / 2, -pixelCrop.height / 2);

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        const fileName = `cropped-image-${Date.now()}.jpg`;
        const file = new File([blob], fileName, {
          type: "image/jpeg",
          lastModified: Date.now(),
        });

        const previewUrl = URL.createObjectURL(blob);

        resolve({
          file,
          previewUrl,
        });
      },
      "image/jpeg",
      0.95
    );
  });
};

export default function EditableFooter({
  content,
  onStateChange,
  userId,
  publishedId,
  templateSelection,
  footersData,
}) {
  // Character limits - applied from your requirements
  const CHAR_LIMITS = {
    brandName: 100,
    brandDescription: 500,
    sectionTitle: 50,
    linkText: 50,
    linkUrl: 50,
    contactEmail: 50,
    contactPhone: 50,
    contactAddress: 50,
    socialName: 50,
    socialUrl: 50,
    legalText: 50,
    legalUrl: 50,
  };

  // Initialize with data from props or use default structure
  const initialData = {
    brand: {
      name: content?.name || "Innovative Labs",
      description: content?.description || "Innovative solutions for modern businesses. Transform your operations with our expert guidance and cutting-edge technology.",
      logoUrl: content?.logo || "/api/placeholder/32/32",
    },
    contact: {
      email: "hello@innovativelabs.com",
      phone: "+1 (555) 123-4567",
      address: "San Francisco, CA 94105",
    },
    sections: [
      {
        id: 1,
        title: "Company",
        links: [
          { id: 1, text: "About Us", href: "#about" },
          { id: 2, text: "Profile", href: "#profile" },
          { id: 3, text: "Blog", href: "#blog" },
          { id: 4, text: "Gallery", href: "#gallery" },
        ],
      },
      {
        id: 2,
        title: "Services",
        links: footersData?.services
          ? footersData.services.map((service, index) => ({
              id: index + 1,
              text: service.title,
              href: "#services",
            })): [
          { id: 1, text: "Consulting", href: "#consulting" },
          { id: 2, text: "Development", href: "#development" },
          { id: 3, text: "Support & Maintenance", href: "#support" },
          { id: 4, text: "Training", href: "#training" },
        ],
      },
    ],
    socialMedia: [
      {
        id: 1,
        name: "Facebook",
        icon: "Facebook",
        href: "#",
        hoverColor: "hover:bg-blue-600",
      },
      {
        id: 2,
        name: "Twitter",
        icon: "Twitter",
        href: "#",
        hoverColor: "hover:bg-blue-400",
      },
      {
        id: 3,
        name: "Instagram",
        icon: "Instagram",
        href: "#",
        hoverColor: "hover:bg-pink-600",
      },
      {
        id: 4,
        name: "LinkedIn",
        icon: "Linkedin",
        href: "#",
        hoverColor: "hover:bg-blue-700",
      },
    ],
    legalLinks: [
      { id: 1, text: "Privacy Policy", href: "#privacy" },
      { id: 2, text: "Terms of Service", href: "#terms" },
      { id: 3, text: "Cookie Policy", href: "#cookies" },
    ],
    copyright: "© 2024 Innovative Labs. All rights reserved.",
  };

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [footerData, setFooterData] = useState(initialData);
  const [tempData, setTempData] = useState(initialData);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Auto-save state
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingLogoRef = useRef<{ file: File; previewUrl: string } | null>(null);

  // Enhanced crop modal state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(1);

  // Update state when content prop changes
  useEffect(() => {
    if (content) {
      const updatedData = {
        ...initialData,
        brand: {
          ...initialData.brand,
          logoUrl: content.logo || initialData.brand.logoUrl,
          name: content.name || initialData.brand.name,
        },
      };
      setFooterData(updatedData);
      setTempData(updatedData);
    }
  }, [content]);

  // Notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(footerData);
    }
  }, [footerData, onStateChange]);

  // Auto-save effect
  useEffect(() => {
    if (!isEditing || !hasUnsavedChanges) return;

    // Clear any existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Set new timeout for auto-save (1.5 seconds after last change)
    autoSaveTimeoutRef.current = setTimeout(() => {
      handleAutoSave();
    }, 1500);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [tempData, isEditing, hasUnsavedChanges]);

  // Enhanced cropper functions
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Upload image to AWS S3
  const uploadImageToS3 = async (file: File): Promise<string | null> => {
    try {
      if (!userId || !publishedId || !templateSelection) {
        console.error("Missing required props for upload");
        return null;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("sectionName", "footer");
      formData.append("imageField", `logoUrl.${Date.now()}`);
      formData.append("templateSelection", templateSelection);

      const uploadResponse = await fetch(
        `https://o66ziwsye5.execute-api.ap-south-1.amazonaws.com/prod/upload-image/${userId}/${publishedId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (uploadResponse.ok) {
        const uploadData = await uploadResponse.json();
        console.log("Logo uploaded to S3:", uploadData.imageUrl);
        return uploadData.imageUrl;
      } else {
        const errorData = await uploadResponse.json();
        console.error("Image upload failed:", errorData);
        throw new Error(errorData.message || "Upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  // Enhanced image upload handler with crop modal
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageToCrop(reader.result);
      setOriginalFile(file);
      setCropModalOpen(true);
      setAspectRatio(1); // Square for logo
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
    };
    reader.readAsDataURL(file);

    if (e.target) {
      e.target.value = "";
    }
  };

  // Apply crop function with immediate upload
  const applyCrop = async () => {
    try {
      setIsUploading(true);
      if (!imageToCrop || !croppedAreaPixels) {
        console.error("Please select an area to crop");
        return;
      }

      const { file, previewUrl } = await getCroppedImg(
        imageToCrop,
        croppedAreaPixels,
        rotation
      );

      // Store in pending upload
      pendingLogoRef.current = { file, previewUrl };

      // Show immediate local preview of cropped image
      updateBrand("logoUrl", previewUrl);
      setHasUnsavedChanges(true);

      // Upload image to S3 immediately
      try {
        const s3Url = await uploadImageToS3(file);
        if (s3Url) {
          // Update with actual S3 URL
          updateBrand("logoUrl", s3Url);
          
          // Update main content as well
          setFooterData((prev) => ({
            ...prev,
            brand: { ...prev.brand, logoUrl: s3Url },
          }));

          // Clear pending upload
          pendingLogoRef.current = null;
          toast.success("Logo uploaded successfully!");
        }
      } catch (uploadError) {
        console.error("Failed to upload logo:", uploadError);
        toast.warning("Logo cropped but upload failed. Will retry on auto-save.");
      }

      setCropModalOpen(false);
      setImageToCrop(null);
      setOriginalFile(null);
    } catch (error) {
      console.error("Error cropping image:", error);
      toast.error("Error cropping image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const cancelCrop = () => {
    setCropModalOpen(false);
    setImageToCrop(null);
    setOriginalFile(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
  };

  const resetCropSettings = () => {
    setZoom(1);
    setRotation(0);
    setCrop({ x: 0, y: 0 });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setTempData(footerData);
    setHasUnsavedChanges(false);
    pendingLogoRef.current = null;
  };

  const handleCancel = () => {
    setTempData(footerData);
    setIsEditing(false);
    setHasUnsavedChanges(false);
    pendingLogoRef.current = null;
  };

  // Auto-save handler
  const handleAutoSave = async () => {
    if (!isEditing || !hasUnsavedChanges) return;

    try {
      setIsAutoSaving(true);
      
      // Upload pending logo first if exists
      let finalLogoUrl = tempData.brand.logoUrl;
      
      if (pendingLogoRef.current?.file) {
        try {
          const s3Url = await uploadImageToS3(pendingLogoRef.current.file);
          if (s3Url) {
            finalLogoUrl = s3Url;
            pendingLogoRef.current = null;
          }
        } catch (error) {
          console.error("Failed to upload pending logo:", error);
        }
      }

      // Create updated data
      const updatedData = {
        ...tempData,
        brand: {
          ...tempData.brand,
          logoUrl: finalLogoUrl,
        },
      };

      // Update both states
      setFooterData(updatedData);
      setTempData(updatedData);
      setHasUnsavedChanges(false);
      setLastSaved(new Date());

      // Notify parent
      if (onStateChange) {
        onStateChange(updatedData);
      }

      console.log("Auto-saved successfully");
    } catch (error) {
      console.error("Error during auto-save:", error);
    } finally {
      setIsAutoSaving(false);
    }
  };

  // Manual save button handler (for backward compatibility)
  const handleSave = async () => {
    await handleAutoSave();
    setIsEditing(false);
    toast.success("Changes saved successfully!");
  };

  // Generic update function
  const updateTempData = useCallback((updater) => {
    setTempData(prev => {
      const newData = typeof updater === 'function' ? updater(prev) : updater;
      setHasUnsavedChanges(true);
      return newData;
    });
  }, []);

  // Simplified update functions
  const updateBrand = (field, value) => {
    updateTempData((prev) => ({
      ...prev,
      brand: { ...prev.brand, [field]: value },
    }));
  };

  const updateContact = (field, value) => {
    updateTempData((prev) => ({
      ...prev,
      contact: { ...prev.contact, [field]: value },
    }));
  };

  const updateSectionTitle = (sectionIndex, value) => {
    updateTempData((prev) => ({
      ...prev,
      sections: prev.sections.map((section, index) =>
        index === sectionIndex ? { ...section, title: value } : section
      ),
    }));
  };

  const addSectionLink = (sectionId) => {
    updateTempData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? {
            ...section,
            links: [
              ...section.links,
              {
                id: Date.now(),
                text: "New Link",
                href: "#new",
              },
            ],
          }
          : section
      ),
    }));
  };

  const removeSectionLink = (sectionId, linkId) => {
    updateTempData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? {
            ...section,
            links: section.links.filter((link) => link.id !== linkId),
          }
          : section
      ),
    }));
  };

  const updateSectionLink = (sectionId, linkId, field, value) => {
    updateTempData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? {
            ...section,
            links: section.links.map((link) =>
              link.id === linkId ? { ...link, [field]: value } : link
            ),
          }
          : section
      ),
    }));
  };

  const addSection = () => {
    updateTempData((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          id: Date.now(),
          title: "New Section",
          links: [{ id: Date.now() + 1, text: "New Link", href: "#" }],
        },
      ],
    }));
  };

  const removeSection = (sectionId) => {
    if (tempData.sections.length > 1) {
      updateTempData((prev) => ({
        ...prev,
        sections: prev.sections.filter((section) => section.id !== sectionId),
      }));
    }
  };

  const updateSocialMedia = (index, field, value) => {
    updateTempData((prev) => ({
      ...prev,
      socialMedia: prev.socialMedia.map((social, i) =>
        i === index ? { ...social, [field]: value } : social
      ),
    }));
  };

  const addSocialMedia = () => {
    updateTempData((prev) => ({
      ...prev,
      socialMedia: [
        ...prev.socialMedia,
        {
          id: Date.now(),
          name: "New Social",
          icon: "Facebook",
          href: "#",
          hoverColor: "hover:bg-blue-600",
        },
      ],
    }));
  };

  const removeSocialMedia = (id) => {
    if (tempData.socialMedia.length > 1) {
      updateTempData((prev) => ({
        ...prev,
        socialMedia: prev.socialMedia.filter((social) => social.id !== id),
      }));
    }
  };

  const updateLegalLink = (index, field, value) => {
    updateTempData((prev) => ({
      ...prev,
      legalLinks: prev.legalLinks.map((link, i) =>
        i === index ? { ...link, [field]: value } : link
      ),
    }));
  };

  const addLegalLink = () => {
    updateTempData((prev) => ({
      ...prev,
      legalLinks: [
        ...prev.legalLinks,
        { id: Date.now(), text: "New Link", href: "#" },
      ],
    }));
  };

  const removeLegalLink = (id) => {
    if (tempData.legalLinks.length > 1) {
      updateTempData((prev) => ({
        ...prev,
        legalLinks: prev.legalLinks.filter((link) => link.id !== id),
      }));
    }
  };

  const getSocialIcon = (iconName) => {
    const icons = {
      Facebook: Facebook,
      Github: Github,
      Linkedin: Linkedin,
      Instagram: Instagram,
      Twitter: Twitter,
    };
    const IconComponent = icons[iconName] || Facebook;
    return <IconComponent className="w-4 h-4" />;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <>
      {/* Footer Preview/Edit */}
      <motion.footer
        className="bg-gray-900 border-t border-gray-800 relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* Edit Toggle - positioned in top right */}
        <div className="absolute top-4 right-4 z-10">
          {!isEditing ? (
            <Button
              onClick={handleEdit}
              className="bg-yellow-400 hover:bg-yellow-500 text-black"
              size="sm"
            >
              <Edit2 className="w-3 h-3 mr-1" />
            </Button>
          ) : (
            <div className="flex gap-2">
              {/* Auto-save indicator */}
              <div className="flex items-center gap-2 bg-white/90 px-3 py-1 rounded-md shadow-sm">
                {isAutoSaving ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
                    <span className="text-xs text-gray-600">Saving...</span>
                  </>
                ) : lastSaved ? (
                  <>
                    <Check className="w-3 h-3 text-green-600" />
                    <span className="text-xs text-gray-600">
                      Saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </>
                ) : (
                  <span className="text-xs text-gray-600">Unsaved changes</span>
                )}
              </div>
              
              {/* Manual Save button */}
              <Button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white"
                size="sm"
                disabled={isAutoSaving || isUploading}
              >
                {isAutoSaving ? (
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                ) : (
                  <Save className="w-3 h-3 mr-1" />
                )}
                Save
              </Button>
              <Button
                onClick={handleCancel}
                className="bg-gray-600 hover:bg-gray-700 text-white"
                size="sm"
                disabled={isAutoSaving || isUploading}
              >
                <X className="w-3 h-3 mr-1" />
                Cancel
              </Button>
            </div>
          )}
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 lg:py-12 relative">
          {/* Main Footer Content */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 text-left"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Brand Section */}
            <motion.div
              className="col-span-1 md:col-span-2 lg:col-span-1"
              variants={itemVariants}
            >
              <div className="flex items-center justify-start md:justify-start space-x-3 mb-4">
                <span className="flex flex-row gap-2 text-xl font-bold text-yellow-400 ">
                  <div className="relative">
                    {/* <img
                      src={isEditing ? tempData.brand.logoUrl : footerData.brand.logoUrl}
                      alt="Logo"
                      className="w-[40px] h-[40px] rounded-xl scale-110"
                      style={{
                        filter: isEditing ? "brightness(0.7)" : "none",
                      }}
                    /> */}
                    {/* {isEditing && (
                      <div className="mt-2 flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-gray-800 text-gray-100 border-gray-600 hover:bg-gray-700"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="w-3 h-3 mr-1" /> Change Logo
                        </Button>
                        {pendingLogoRef.current && (
                          <span className="text-xs text-gray-400 max-w-[160px] truncate">
                            New logo selected
                          </span>
                        )}
                      </div>
                    )} */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </div>
                  {isEditing ? (
                    <div className="flex-1">
                      <input
                        type="text"
                        value={tempData.brand.name}
                        onChange={(e) => updateBrand("name", e.target.value)}
                        placeholder="Brand name"
                        className="w-full p-1 border border-gray-600 rounded bg-gray-800 text-white text-sm"
                        maxLength={CHAR_LIMITS.brandName}
                      />
                      <div className="text-xs text-gray-500 text-right mt-1">
                        {tempData.brand.name.length}/{CHAR_LIMITS.brandName} characters
                      </div>
                    </div>
                  ) : (
                    footerData.brand.name
                  )}
                </span>
              </div>

              {isEditing ? (
                <div className="mb-4">
                  <label className="block text-xs text-gray-400 mb-1">
                    Description:
                  </label>
                  <textarea
                    value={tempData.brand.description}
                    onChange={(e) => updateBrand("description", e.target.value)}
                    placeholder="Brand description"
                    className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white text-sm resize-none"
                    rows={3}
                    maxLength={CHAR_LIMITS.brandDescription}
                  />
                  <div className="text-xs text-gray-500 text-right mt-1">
                    {tempData.brand.description.length}/{CHAR_LIMITS.brandDescription} characters
                  </div>
                </div>
              ) : (
                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  {footerData.brand.description}
                </p>
              )}
            </motion.div>

            {/* Dynamic Sections */}
            {(isEditing ? tempData.sections : footerData.sections).map((section, sectionIndex) => (
              <motion.div
                key={section.id}
                className="col-span-1"
                variants={itemVariants}
              >
                <div className="flex items-start justify-start md:justify-start mb-4">
                  {isEditing ? (
                    <div className="flex items-center  w-full">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={section.title}
                          onChange={(e) =>
                            updateSectionTitle(sectionIndex, e.target.value)
                          }
                          placeholder="Section title"
                          className="w-full p-1 border border-gray-600 rounded bg-gray-800 text-white text-sm font-semibold"
                          maxLength={CHAR_LIMITS.sectionTitle}
                        />
                        <div className="text-xs text-gray-500 text-right mt-1">
                          {section.title.length}/{CHAR_LIMITS.sectionTitle} characters
                        </div>
                      </div>
                      {tempData.sections.length > 1 && (
                        <Button
                          onClick={() => removeSection(section.id)}
                          size="sm"
                          variant="destructive"
                          className="ml-2"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  ) : (
                    <h4 className="font-semibold text-white ">
                      {section.title}
                    </h4>
                  )}
                </div>

                <ul className="space-y-3 text-sm">
                  {section.links.map((link) => (
                    <li key={link.id} className="flex items-center gap-2">
                      {isEditing ? (
                        <div className="flex-1 space-y-1">
                          <div>
                            <input
                              type="text"
                              value={link.text}
                              onChange={(e) =>
                                updateSectionLink(
                                  section.id,
                                  link.id,
                                  "text",
                                  e.target.value
                                )
                              }
                              placeholder="Link text"
                              className="w-full p-1 border border-gray-600 rounded bg-gray-800 text-white text-xs"
                              maxLength={CHAR_LIMITS.linkText}
                            />
                            <div className="text-xs text-gray-500 text-right mt-1">
                              {link.text.length}/{CHAR_LIMITS.linkText} characters
                            </div>
                          </div>
                          <div>
                            <input
                              type="text"
                              value={link.href}
                              onChange={(e) =>
                                updateSectionLink(
                                  section.id,
                                  link.id,
                                  "href",
                                  e.target.value
                                )
                              }
                              placeholder="Link URL"
                              className="w-full p-1 border border-gray-600 rounded bg-gray-800 text-white text-xs"
                              maxLength={CHAR_LIMITS.linkUrl}
                            />
                            <div className="text-xs text-gray-500 text-right mt-1">
                              {link.href.length}/{CHAR_LIMITS.linkUrl} characters
                            </div>
                          </div>
                        </div>
                      ) : (
                        <a
                          href={link.href}
                          className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex-1"
                        >
                          {link.text}
                        </a>
                      )}

                      {isEditing && (
                        <button
                          onClick={() => removeSectionLink(section.id, link.id)}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </li>
                  ))}

                  {isEditing && (
                    <li>
                      <button
                        onClick={() => addSectionLink(section.id)}
                        className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm"
                      >
                        <Plus className="w-3 h-3" />
                        Add Link
                      </button>
                    </li>
                  )}
                </ul>
              </motion.div>
            ))}

            {/* Add Section Button */}
            {isEditing && (
              <motion.div
                className="col-span-1 flex items-center justify-center"
                variants={itemVariants}
              >
                <Button
                  onClick={addSection}
                  size="sm"
                  variant="outline"
                  className="text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Section
                </Button>
              </motion.div>
            )}
          </motion.div>

          {/* Edit Mode Instructions */}
          {isEditing && (
            <motion.div
              className="mt-8 p-4 bg-blue-900/50 rounded-lg border border-blue-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-sm text-blue-300 mb-2">
                <strong>Edit Mode Active:</strong> Character limits:
              </p>
              <ul className="text-xs text-blue-300 space-y-1">
                <li>• <strong>Brand Name:</strong> {CHAR_LIMITS.brandName} characters</li>
                <li>• <strong>Brand Description:</strong> {CHAR_LIMITS.brandDescription} characters</li>
                <li>• <strong>Section Titles:</strong> {CHAR_LIMITS.sectionTitle} characters</li>
                <li>• <strong>Link Text:</strong> {CHAR_LIMITS.linkText} characters</li>
                <li>• <strong>Link URLs:</strong> {CHAR_LIMITS.linkUrl} characters</li>
              </ul>
            </motion.div>
          )}
        </div>
      </motion.footer>

      {/* Enhanced Crop Modal */}
      {cropModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/90 z-[99999999] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl max-w-4xl w-full h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800">
                Crop Logo
              </h3>
              <button
                onClick={cancelCrop}
                className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Cropper Area */}
            <div className="flex-1 relative bg-gray-900 min-h-0">
              <div className="relative w-full h-full">
                <Cropper
                  image={imageToCrop}
                  crop={crop}
                  zoom={zoom}
                  rotation={rotation}
                  aspect={aspectRatio}
                  minZoom={0.5}
                  maxZoom={4}
                  restrictPosition={false}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                  showGrid={false}
                  cropShape="rect"
                  style={{
                    containerStyle: {
                      position: "relative",
                      width: "100%",
                      height: "100%",
                    },
                    cropAreaStyle: {
                      border: "2px solid white",
                      borderRadius: "8px",
                    },
                  }}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              {/* Aspect Ratio Buttons */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Aspect Ratio:</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setAspectRatio(1)}
                    className={`px-3 py-2 text-sm rounded border ${aspectRatio === 1
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300'
                      }`}
                  >
                    1:1 (Square)
                  </button>
                  <button
                    onClick={() => setAspectRatio(4 / 3)}
                    className={`px-3 py-2 text-sm rounded border ${aspectRatio === 4 / 3
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300'
                      }`}
                  >
                    4:3 (Standard)
                  </button>
                  <button
                    onClick={() => setAspectRatio(16 / 9)}
                    className={`px-3 py-2 text-sm rounded border ${aspectRatio === 16 / 9
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300'
                      }`}
                  >
                    16:9 (Widescreen)
                  </button>
                </div>
              </div>

              {/* Zoom Control */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">Zoom</span>
                  <span className="text-gray-600">{zoom.toFixed(1)}x</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.1).toFixed(2)))}
                    className="px-3 py-1.5 text-sm rounded border bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  >
                    −
                  </button>
                  <input
                    type="range"
                    value={zoom}
                    min={0.5}
                    max={4}
                    step={0.1}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setZoom((z) => Math.min(4, +(z + 0.1).toFixed(2)))}
                    className="px-3 py-1.5 text-sm rounded border bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoom(1)}
                    className="px-3 py-1.5 text-sm rounded border bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  >
                    1x
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={resetCropSettings}
                  className="w-full border border-gray-300 text-gray-700 hover:bg-gray-100 rounded py-2 text-sm font-medium"
                >
                  Reset
                </button>
                <button
                  onClick={cancelCrop}
                  className="w-full border border-gray-300 text-gray-700 hover:bg-gray-100 rounded py-2 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={applyCrop}
                  className="w-full bg-green-600 hover:bg-green-700 text-white rounded py-2 text-sm font-medium"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                  ) : (
                    "Apply Crop"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}