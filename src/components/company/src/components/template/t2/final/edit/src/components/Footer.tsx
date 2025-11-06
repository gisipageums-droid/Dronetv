// import {
//   Facebook,
//   Twitter,
//   Linkedin,
//   Instagram,
//   Mail,
//   Phone,
//   Edit2,
//   Save,
//   Upload,
//   X as XIcon,
//   RotateCw,
//   ZoomIn,
// } from "lucide-react";
// import { motion } from "motion/react";
// import { useState, useEffect, useRef, useCallback } from "react";
// import { Button } from "./ui/button";
// import { toast } from "react-toastify";
// import logo from "/images/Drone tv .in.jpg";
// import Cropper from "react-easy-crop";

// // Create an icon map to convert string names to actual components
// const iconMap = {
//   Facebook: Facebook,
//   Twitter: Twitter,
//   Linkedin: Linkedin,
//   LinkedIn: Linkedin, // Added alias for LinkedIn
//   Instagram: Instagram,
//   Mail: Mail,
//   Phone: Phone,
// };

// export default function Footer({
//   onStateChange,
//   footerData,
//   userId,
//   publishedId,
//   templateSelection,
// }) {
//   const [isEditing, setIsEditing] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);
//   const [pendingLogoFile, setPendingLogoFile] = useState(null);
//   const fileInputRef = useRef<HTMLInputElement | null>(null);

//   // Cropping states - Updated to match Header component
//   const [showCropper, setShowCropper] = useState(false);
//   const [crop, setCrop] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);
//   const [rotation, setRotation] = useState(0);
//   const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
//   const [imageToCrop, setImageToCrop] = useState(null);
//   const [originalFile, setOriginalFile] = useState(null);
//   const [aspectRatio, setAspectRatio] = useState(1); // Square for logos

//   // Merged all state into a single object
//   const [footerContent, setFooterContent] = useState(() => {
//     // Process the footer data to ensure icons are proper components
//     const processedData = { ...footerData };

//     if (processedData.socialLinks) {
//       processedData.socialLinks = processedData.socialLinks.map((link) => ({
//         ...link,
//         // Use the name to determine the icon if icon is not a valid string
//         icon:
//           typeof link.icon === "string" && iconMap[link.icon]
//             ? iconMap[link.icon]
//             : iconMap[link.name] || Facebook, // Fallback to name or Facebook
//       }));
//     }

//     return processedData;
//   });

//   // Update footer content when footerData changes
//   useEffect(() => {
//     if (footerData?.services) {
//       setFooterContent((prev) => ({
//         ...prev,
//         footerLinks: {
//           ...prev.footerLinks,
//           Services: footerData.services.map((service) => ({
//             name: service.title,
//             href: "#services",
//           })),
//         },
//       }));
//     }
//   }, [footerData]);

//   // Add this useEffect to notify parent of state changes
//   useEffect(() => {
//     if (onStateChange) {
//       onStateChange(footerContent);
//     }
//   }, [footerContent, onStateChange]);

//   // Handlers for company info
//   const updateCompanyInfo = (field, value) => {
//     setFooterContent((prev) => ({
//       ...prev,
//       companyInfo: { ...prev.companyInfo, [field]: value },
//     }));
//   };

//   // Handlers for footer links
//   const updateFooterLink = (category, index, field, value) => {
//     setFooterContent((prev) => ({
//       ...prev,
//       footerLinks: {
//         ...prev.footerLinks,
//         [category]: prev.footerLinks[category].map((link, i) =>
//           i === index ? { ...link, [field]: value } : link
//         ),
//       },
//     }));
//   };

//   const addFooterLink = (category) => {
//     setFooterContent((prev) => ({
//       ...prev,
//       footerLinks: {
//         ...prev.footerLinks,
//         [category]: [
//           ...prev.footerLinks[category],
//           { name: "New Link", href: "#" },
//         ],
//       },
//     }));
//   };

//   const removeFooterLink = (category, index) => {
//     setFooterContent((prev) => ({
//       ...prev,
//       footerLinks: {
//         ...prev.footerLinks,
//         [category]: prev.footerLinks[category].filter((_, i) => i !== index),
//       },
//     }));
//   };

//   // Handlers for social links
//   const updateSocialLink = (index, field, value) => {
//     setFooterContent((prev) => ({
//       ...prev,
//       socialLinks: prev.socialLinks.map((link, i) =>
//         i === index ? { ...link, [field]: value } : link
//       ),
//     }));
//   };

//   // Logo cropping functionality - Updated to match Header component
//   const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

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
//       setShowCropper(true);
//       setAspectRatio(1); // Square for logos
//       setCrop({ x: 0, y: 0 });
//       setZoom(1);
//       setRotation(0);
//     };
//     reader.readAsDataURL(file);

//     e.target.value = "";
//   };

//   // Cropper functions - Same as Header component
//   const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
//     setCroppedAreaPixels(croppedAreaPixels);
//   }, []);

//   const createImage = (url) =>
//     new Promise((resolve, reject) => {
//       const image = new Image();
//       image.addEventListener("load", () => resolve(image));
//       image.addEventListener("error", (error) => reject(error));
//       image.setAttribute("crossOrigin", "anonymous");
//       image.src = url;
//     });

//   const getCroppedImg = async (imageSrc, pixelCrop, rotation = 0) => {
//     const image = await createImage(imageSrc);
//     const canvas = document.createElement("canvas");
//     const ctx = canvas.getContext("2d");

//     canvas.width = pixelCrop.width;
//     canvas.height = pixelCrop.height;

//     ctx.translate(pixelCrop.width / 2, pixelCrop.height / 2);
//     ctx.rotate((rotation * Math.PI) / 180);
//     ctx.translate(-pixelCrop.width / 2, -pixelCrop.height / 2);

//     ctx.drawImage(
//       image,
//       pixelCrop.x,
//       pixelCrop.y,
//       pixelCrop.width,
//       pixelCrop.height,
//       0,
//       0,
//       pixelCrop.width,
//       pixelCrop.height
//     );

//     return new Promise((resolve) => {
//       canvas.toBlob(
//         (blob) => {
//           const fileName = originalFile
//             ? `cropped-${originalFile.name}`
//             : `cropped-logo-${Date.now()}.jpg`;

//           const file = new File([blob], fileName, {
//             type: "image/jpeg",
//             lastModified: Date.now(),
//           });

//           const previewUrl = URL.createObjectURL(blob);

//           resolve({
//             file,
//             previewUrl,
//           });
//         },
//         "image/jpeg",
//         0.95
//       );
//     });
//   };

//   const applyCrop = async () => {
//     try {
//       if (!imageToCrop || !croppedAreaPixels) {
//         toast.error("Please select an area to crop");
//         return;
//       }

//       const { file, previewUrl } = await getCroppedImg(
//         imageToCrop,
//         croppedAreaPixels,
//         rotation
//       );

//       // Update preview immediately
//       updateCompanyInfo("logoUrl", previewUrl);

//       // Set the file for upload on save
//       setPendingLogoFile(file);

//       toast.success("Logo cropped successfully! Click Save to upload to S3.");
//       setShowCropper(false);
//       setImageToCrop(null);
//       setOriginalFile(null);
//     } catch (error) {
//       console.error("Error cropping logo:", error);
//       toast.error("Error cropping logo. Please try again.");
//     }
//   };

//   const cancelCrop = () => {
//     setShowCropper(false);
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

//   // Save button handler with S3 upload
//   const handleSave = async () => {
//     try {
//       setIsUploading(true);

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
//           // Replace local preview with S3 URL
//           updateCompanyInfo("logoUrl", uploadData.imageUrl);
//           setPendingLogoFile(null); // Clear pending file
//           console.log("Logo uploaded to S3:", uploadData.imageUrl);
//         } else {
//           const errorData = await uploadResponse.json();
//           console.error("Logo upload failed:", errorData);
//           toast.error(
//             `Logo upload failed: ${errorData.message || "Unknown error"}`
//           );
//           return; // Don't exit edit mode
//         }
//       }

//       // Exit edit mode
//       setIsEditing(false);
//       toast.success("Footer section saved with S3 URLs!");
//     } catch (error) {
//       console.error("Error saving footer section:", error);
//       toast.error("Error saving changes. Please try again.");
//     } finally {
//       setIsUploading(false);
//     }
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
//       {/* Image Cropper Modal - Updated to match Header component */}
//       {showCropper && (
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
//               <h3 className="text-lg font-semibold text-gray-800">Crop Logo</h3>
//               <button
//                 onClick={cancelCrop}
//                 className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
//               >
//                 <XIcon className="w-5 h-5 text-gray-600" />
//               </button>
//             </div>

//             {/* Cropper Area */}
//             <div className="flex-1 relative bg-gray-900 min-h-0">
//               <Cropper
//                 image={imageToCrop}
//                 crop={crop}
//                 zoom={zoom}
//                 rotation={rotation}
//                 aspect={aspectRatio}
//                 onCropChange={setCrop}
//                 onZoomChange={setZoom}
//                 onCropComplete={onCropComplete}
//                 showGrid={false}
//                 cropShape="rect"
//                 style={{
//                   containerStyle: {
//                     position: "relative",
//                     width: "100%",
//                     height: "100%",
//                   },
//                   cropAreaStyle: {
//                     border: "2px solid white",
//                     borderRadius: "8px",
//                   },
//                 }}
//               />
//             </div>

//             {/* Controls */}
//             <div className="p-4 bg-gray-50 border-t border-gray-200">
//               {/* Aspect Ratio Buttons */}
//               <div className="mb-4">
//                 <p className="text-sm font-medium text-gray-700 mb-2">
//                   Aspect Ratio:
//                 </p>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => setAspectRatio(1)}
//                     className={`px-3 py-2 text-sm rounded border ${
//                       aspectRatio === 1
//                         ? "bg-blue-500 text-white border-blue-500"
//                         : "bg-white text-gray-700 border-gray-300"
//                     }`}
//                   >
//                     1:1 (Square)
//                   </button>
//                   <button
//                     onClick={() => setAspectRatio(4 / 3)}
//                     className={`px-3 py-2 text-sm rounded border ${
//                       aspectRatio === 4 / 3
//                         ? "bg-blue-500 text-white border-blue-500"
//                         : "bg-white text-gray-700 border-gray-300"
//                     }`}
//                   >
//                     4:3 (Standard)
//                   </button>
//                   <button
//                     onClick={() => setAspectRatio(16 / 9)}
//                     className={`px-3 py-2 text-sm rounded border ${
//                       aspectRatio === 16 / 9
//                         ? "bg-blue-500 text-white border-blue-500"
//                         : "bg-white text-gray-700 border-gray-300"
//                     }`}
//                   >
//                     16:9 (Widescreen)
//                   </button>
//                 </div>
//               </div>

//               {/* Zoom Control */}
//               <div className="space-y-2 mb-4">
//                 <div className="flex items-center justify-between text-sm">
//                   <span className="flex items-center gap-2 text-gray-700">
//                     <ZoomIn className="w-4 h-4" />
//                     Zoom
//                   </span>
//                   <span className="text-gray-600">{zoom.toFixed(1)}x</span>
//                 </div>
//                 <input
//                   type="range"
//                   value={zoom}
//                   min={1}
//                   max={3}
//                   step={0.1}
//                   onChange={(e) => setZoom(Number(e.target.value))}
//                   className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
//                 />
//               </div>

//               {/* Action Buttons */}
//               <div className="grid grid-cols-3 gap-3">
//                 <button
//                   onClick={resetCropSettings}
//                   className="w-full border border-gray-300 text-gray-700 hover:bg-gray-100 rounded py-2 text-sm"
//                 >
//                   Reset
//                 </button>
//                 <button
//                   onClick={cancelCrop}
//                   className="w-full border border-gray-300 text-gray-700 hover:bg-gray-100 rounded py-2 text-sm"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={applyCrop}
//                   className="w-full bg-green-600 hover:bg-green-700 text-white rounded py-2 text-sm"
//                 >
//                   Apply Crop
//                 </button>
//               </div>
//             </div>
//           </motion.div>
//         </motion.div>
//       )}

//       <motion.footer
//         className="text-white bg-black theme-transition"
//         initial={{ opacity: 0 }}
//         whileInView={{ opacity: 1 }}
//         viewport={{ once: true }}
//         transition={{ duration: 0.8 }}
//       >
//         {/* Edit/Save Buttons */}
//         <div className="flex justify-end mr-50">
//           {isEditing ? (
//             <motion.button
//               whileTap={{ scale: 0.9 }}
//               whileHover={{ y: -1, scaleX: 1.1 }}
//               onClick={handleSave}
//               disabled={isUploading}
//               className={`${
//                 isUploading
//                   ? "bg-gray-400 cursor-not-allowed"
//                   : "bg-green-600 hover:font-semibold"
//               } text-white px-4 py-2 rounded cursor-pointer hover:shadow-2xl shadow-xl`}
//             >
//               {isUploading ? (
//                 "Uploading..."
//               ) : (
//                 <>
//                   <Save size={16} className="inline mr-1" /> Save
//                 </>
//               )}
//             </motion.button>
//           ) : (
//             <motion.button
//               whileTap={{ scale: 0.9 }}
//               whileHover={{ y: -1, scaleX: 1.1 }}
//               onClick={() => setIsEditing(true)}
//               className="px-4 py-2 text-black bg-yellow-500 rounded shadow-xl cursor-pointer hover:shadow-2xl hover:font-semibold"
//             >
//               <Edit2 size={16} className="inline mr-1" /> Edit
//             </motion.button>
//           )}
//         </div>

//         <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
//           {/* Main footer content */}
//           <motion.div
//             className="py-16"
//             variants={containerVariants}
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true }}
//           >
//             <div className="grid gap-8 lg:grid-cols-5">
//               {/* Company info */}
//               <motion.div
//                 className="space-y-6 lg:col-span-2"
//                 variants={itemVariants}
//               >
//                 <motion.div
//                   className="flex items-center"
//                   whileHover={{ scale: 1.05 }}
//                   transition={{ duration: 0.3 }}
//                 >
//                   <motion.div
//                     className="relative flex items-center justify-center w-8 h-8 mr-2 overflow-hidden rounded-lg"
//                     whileHover={{
//                       rotate: 360,
//                       boxShadow: "0 0 20px rgba(250, 204, 21, 0.4)",
//                     }}
//                     transition={{ duration: 0.6 }}
//                   >
//                     {isEditing ? (
//                       <div className="relative w-full h-full">
//                         {footerContent.companyInfo.logoUrl &&
//                         (footerContent.companyInfo.logoUrl.startsWith(
//                           "data:"
//                         ) ||
//                           footerContent.companyInfo.logoUrl.startsWith(
//                             "http"
//                           )) ? (
//                           <img
//                             src={footerContent.companyInfo.logoUrl || logo}
//                             alt="Logo"
//                             className="object-contain w-full h-full"
//                           />
//                         ) : (
//                           <span className="text-lg font-bold text-black">
//                             {footerContent.companyInfo.logoUrl}
//                           </span>
//                         )}
//                         <div className="absolute inset-0 flex items-center justify-center transition-opacity bg-black bg-opacity-50 opacity-0 hover:opacity-100">
//                           <button
//                             onClick={() => fileInputRef.current?.click()}
//                             className="p-1 text-xs text-white bg-blue-500 rounded"
//                           >
//                             <Upload size={12} />
//                           </button>
//                         </div>
//                       </div>
//                     ) : (
//                       <>
//                         {footerContent.companyInfo.logoUrl &&
//                         (footerContent.companyInfo.logoUrl.startsWith(
//                           "data:"
//                         ) ||
//                           footerContent.companyInfo.logoUrl.startsWith(
//                             "http"
//                           )) ? (
//                           <img
//                             src={footerContent.companyInfo.logoUrl}
//                             alt="Logo"
//                             className="object-contain w-[70px] h-[70px]"
//                           />
//                         ) : (
//                           <span className="text-lg font-medium text-black">
//                             {footerContent.companyInfo.logoUrl}
//                           </span>
//                         )}
//                       </>
//                     )}
//                     <input
//                       type="file"
//                       ref={fileInputRef}
//                       accept="image/*"
//                       onChange={handleLogoUpload}
//                       className="hidden font-bold"
//                     />
//                   </motion.div>
//                   {isEditing ? (
//                     <div className="relative">
//                       <input
//                         value={footerContent.companyInfo.companyName}
//                         onChange={(e) =>
//                           updateCompanyInfo("companyName", e.target.value)
//                         }
//                         maxLength={50}
//                         className={`w-full text-xl font-bold text-white bg-transparent border-b ${
//                           footerContent.companyInfo.companyName.length >= 50
//                             ? "border-red-500"
//                             : ""
//                         }`}
//                       />
//                       <div className="text-right text-xs text-gray-300 mt-1">
//                         {footerContent.companyInfo.companyName.length}/50
//                         {footerContent.companyInfo.companyName.length >= 50 && (
//                           <span className="ml-2 text-red-300 font-bold">
//                             Character limit reached!
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   ) : (
//                     <span className="text-xl font-bold text-white">
//                       {footerContent.companyInfo.companyName}
//                     </span>
//                   )}
//                 </motion.div>

//                 {isEditing ? (
//                   <div className="relative">
//                     <textarea
//                       value={footerContent.companyInfo.description}
//                       onChange={(e) =>
//                         updateCompanyInfo("description", e.target.value)
//                       }
//                       maxLength={200}
//                       className={`w-full max-w-md text-gray-400 bg-transparent border-b ${
//                         footerContent.companyInfo.description.length >= 200
//                           ? "border-red-500"
//                           : ""
//                       }`}
//                       rows={3}
//                     />
//                     <div className="text-right text-xs text-gray-500 mt-1">
//                       {footerContent.companyInfo.description.length}/200
//                       {footerContent.companyInfo.description.length >= 200 && (
//                         <span className="ml-2 text-red-500 font-bold">
//                           Character limit reached!
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 ) : (
//                   <p className="max-w-md text-gray-400">
//                     {footerContent.companyInfo.description}
//                   </p>
//                 )}
//               </motion.div>

//               {/* Footer links */}
//               {Object.entries(footerContent.footerLinks).map(
//                 ([category, links], categoryIndex) => (
//                   <motion.div key={category} variants={itemVariants}>
//                     {isEditing ? (
//                       <div className="relative">
//                         <input
//                           value={category}
//                           onChange={(e) => {
//                             const newCategory = e.target.value;
//                             setFooterContent((prev) => {
//                               const newLinks = { ...prev.footerLinks };
//                               newLinks[newCategory] = newLinks[category];
//                               delete newLinks[category];
//                               return { ...prev, footerLinks: newLinks };
//                             });
//                           }}
//                           maxLength={25}
//                           className={`w-full mb-4 font-medium text-white bg-transparent border-b ${
//                             category.length >= 25 ? "border-red-500" : ""
//                           }`}
//                         />
//                         <div className="text-right text-xs text-gray-300 mt-1 -mb-2">
//                           {category.length}/25
//                           {category.length >= 25 && (
//                             <span className="ml-2 text-red-300 font-bold">
//                               Character limit reached!
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     ) : (
//                       <h4 className="mb-4 font-medium text-white">
//                         {category}
//                       </h4>
//                     )}
//                     <ul className="space-y-3">
//                       {links.map((link, linkIndex) => (
//                         <motion.li
//                           key={linkIndex}
//                           initial={{ opacity: 0, x: -20 }}
//                           whileInView={{ opacity: 1, x: 0 }}
//                           viewport={{ once: true }}
//                           transition={{
//                             delay: categoryIndex * 0.1 + linkIndex * 0.05,
//                             duration: 0.5,
//                           }}
//                           whileHover={{ x: 5 }}
//                         >
//                           {isEditing ? (
//                             <div className="flex items-center">
//                               <input
//                                 value={link.name}
//                                 onChange={(e) =>
//                                   updateFooterLink(
//                                     category,
//                                     linkIndex,
//                                     "name",
//                                     e.target.value
//                                   )
//                                 }
//                                 className="w-full mr-2 text-gray-400 bg-transparent border-b"
//                               />
//                               <input
//                                 value={link.href}
//                                 onChange={(e) =>
//                                   updateFooterLink(
//                                     category,
//                                     linkIndex,
//                                     "href",
//                                     e.target.value
//                                   )
//                                 }
//                                 className="w-full mr-2 text-gray-400 bg-transparent border-b"
//                               />
//                               <Button
//                                 size="sm"
//                                 variant="destructive"
//                                 onClick={() =>
//                                   removeFooterLink(category, linkIndex)
//                                 }
//                               >
//                                 ×
//                               </Button>
//                             </div>
//                           ) : (
//                             <a
//                               href={link.href}
//                               className="text-gray-400 transition-colors hover:text-primary"
//                             >
//                               {link.name}
//                             </a>
//                           )}
//                         </motion.li>
//                       ))}
//                       {isEditing && (
//                         <motion.li
//                           whileHover={{ scale: 1.1 }}
//                           whileTap={{ scale: 0.9 }}
//                         >
//                           <Button
//                             onClick={() => addFooterLink(category)}
//                             className="text-green-600"
//                           >
//                             + Add Link
//                           </Button>
//                         </motion.li>
//                       )}
//                     </ul>
//                   </motion.div>
//                 )
//               )}
//             </div>
//           </motion.div>
//         </div>
//       </motion.footer>
//     </>
//   );
// }




import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Phone,
  Edit2,
  Save,
  Upload,
  X as XIcon,
  RotateCw,
  ZoomIn,
} from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "./ui/button";
import { toast } from "react-toastify";
import logo from "/images/Drone tv .in.jpg";
import Cropper from "react-easy-crop";

// Create an icon map to convert string names to actual components
const iconMap = {
  Facebook: Facebook,
  Twitter: Twitter,
  Linkedin: Linkedin,
  LinkedIn: Linkedin, // Added alias for LinkedIn
  Instagram: Instagram,
  Mail: Mail,
  Phone: Phone,
};

export default function Footer({
  onStateChange,
  footerData,
  userId,
  publishedId,
  templateSelection,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [pendingLogoFile, setPendingLogoFile] = useState(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Cropping states - Updated to match Header component
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(1); // Square for logos

  // Merged all state into a single object
  const [footerContent, setFooterContent] = useState(() => {
    // Process the footer data to ensure icons are proper components
    const processedData = { ...footerData };

    if (processedData.socialLinks) {
      processedData.socialLinks = processedData.socialLinks.map((link) => ({
        ...link,
        // Use the name to determine the icon if icon is not a valid string
        icon:
          typeof link.icon === "string" && iconMap[link.icon]
            ? iconMap[link.icon]
            : iconMap[link.name] || Facebook, // Fallback to name or Facebook
      }));
    }

    return processedData;
  });

  // Update footer content when footerData changes
  useEffect(() => {
    if (footerData?.services) {
      setFooterContent((prev) => ({
        ...prev,
        footerLinks: {
          ...prev.footerLinks,
          Services: footerData.services.map((service) => ({
            name: service.title,
            href: "#services",
          })),
        },
      }));
    }
  }, [footerData]);

  // Add this useEffect to notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(footerContent);
    }
  }, [footerContent, onStateChange]);

  // Handlers for company info
  const updateCompanyInfo = (field, value) => {
    setFooterContent((prev) => ({
      ...prev,
      companyInfo: { ...prev.companyInfo, [field]: value },
    }));
  };

  // Handlers for footer links
  const updateFooterLink = (category, index, field, value) => {
    setFooterContent((prev) => ({
      ...prev,
      footerLinks: {
        ...prev.footerLinks,
        [category]: prev.footerLinks[category].map((link, i) =>
          i === index ? { ...link, [field]: value } : link
        ),
      },
    }));
  };

  const addFooterLink = (category) => {
    setFooterContent((prev) => ({
      ...prev,
      footerLinks: {
        ...prev.footerLinks,
        [category]: [
          ...prev.footerLinks[category],
          { name: "New Link", href: "#" },
        ],
      },
    }));
  };

  const removeFooterLink = (category, index) => {
    setFooterContent((prev) => ({
      ...prev,
      footerLinks: {
        ...prev.footerLinks,
        [category]: prev.footerLinks[category].filter((_, i) => i !== index),
      },
    }));
  };

  // Handlers for social links
  const updateSocialLink = (index, field, value) => {
    setFooterContent((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.map((link, i) =>
        i === index ? { ...link, [field]: value } : link
      ),
    }));
  };

  // Logo cropping functionality - Updated to match Header component
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
      setShowCropper(true);
      setAspectRatio(1); // Square for logos
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
    };
    reader.readAsDataURL(file);

    e.target.value = "";
  };

  // Cropper functions - Same as Header component
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

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
          const fileName = originalFile
            ? `cropped-${originalFile.name}`
            : `cropped-logo-${Date.now()}.jpg`;

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

  const applyCrop = async () => {
    try {
      if (!imageToCrop || !croppedAreaPixels) {
        toast.error("Please select an area to crop");
        return;
      }

      const { file, previewUrl } = await getCroppedImg(
        imageToCrop,
        croppedAreaPixels,
        rotation
      );

      // Update preview immediately
      updateCompanyInfo("logoUrl", previewUrl);

      // Set the file for upload on save
      setPendingLogoFile(file);

      toast.success("Logo cropped successfully! Click Save to upload to S3.");
      setShowCropper(false);
      setImageToCrop(null);
      setOriginalFile(null);
    } catch (error) {
      console.error("Error cropping logo:", error);
      toast.error("Error cropping logo. Please try again.");
    }
  };

  const cancelCrop = () => {
    setShowCropper(false);
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

  // Save button handler with S3 upload
  const handleSave = async () => {
    try {
      setIsUploading(true);

      // If there's a pending logo, upload it first
      if (pendingLogoFile) {
        if (!userId || !publishedId || !templateSelection) {
          console.error("Missing required props:", {
            userId,
            publishedId,
            templateSelection,
          });
          toast.error(
            "Missing user information. Please refresh and try again."
          );
          return;
        }

        const formData = new FormData();
        formData.append("file", pendingLogoFile);
        formData.append("sectionName", "footer");
        formData.append("imageField", "logoUrl" + Date.now());
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
          // Replace local preview with S3 URL
          updateCompanyInfo("logoUrl", uploadData.imageUrl);
          setPendingLogoFile(null); // Clear pending file
          console.log("Logo uploaded to S3:", uploadData.imageUrl);
        } else {
          const errorData = await uploadResponse.json();
          console.error("Logo upload failed:", errorData);
          toast.error(
            `Logo upload failed: ${errorData.message || "Unknown error"}`
          );
          return; // Don't exit edit mode
        }
      }

      // Exit edit mode
      setIsEditing(false);
      toast.success("Footer section saved with S3 URLs!");
    } catch (error) {
      console.error("Error saving footer section:", error);
      toast.error("Error saving changes. Please try again.");
    } finally {
      setIsUploading(false);
    }
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
      {/* Image Cropper Modal - Updated to match Header component */}
      {showCropper && (
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
              <h3 className="text-lg font-semibold text-gray-800">Crop Logo</h3>
              <button
                onClick={cancelCrop}
                className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
              >
                <XIcon className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Cropper Area */}
            <div className="flex-1 relative bg-gray-900 min-h-0">
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={aspectRatio}
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

            {/* Controls */}
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              {/* Aspect Ratio Buttons */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Aspect Ratio:
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setAspectRatio(1)}
                    className={`px-3 py-2 text-sm rounded border ${
                      aspectRatio === 1
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-700 border-gray-300"
                    }`}
                  >
                    1:1 (Square)
                  </button>
                  <button
                    onClick={() => setAspectRatio(4 / 3)}
                    className={`px-3 py-2 text-sm rounded border ${
                      aspectRatio === 4 / 3
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-700 border-gray-300"
                    }`}
                  >
                    4:3 (Standard)
                  </button>
                  <button
                    onClick={() => setAspectRatio(16 / 9)}
                    className={`px-3 py-2 text-sm rounded border ${
                      aspectRatio === 16 / 9
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-700 border-gray-300"
                    }`}
                  >
                    16:9 (Widescreen)
                  </button>
                </div>
              </div>

              {/* Zoom Control */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-gray-700">
                    <ZoomIn className="w-4 h-4" />
                    Zoom
                  </span>
                  <span className="text-gray-600">{zoom.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={resetCropSettings}
                  className="w-full border border-gray-300 text-gray-700 hover:bg-gray-100 rounded py-2 text-sm"
                >
                  Reset
                </button>
                <button
                  onClick={cancelCrop}
                  className="w-full border border-gray-300 text-gray-700 hover:bg-gray-100 rounded py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={applyCrop}
                  className="w-full bg-green-600 hover:bg-green-700 text-white rounded py-2 text-sm"
                >
                  Apply Crop
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      <motion.footer
        className="text-white bg-black theme-transition"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* Edit/Save Buttons */}
        <div className="flex justify-end mr-50">
          {isEditing ? (
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ y: -1, scaleX: 1.1 }}
              onClick={handleSave}
              disabled={isUploading}
              className={`${
                isUploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:font-semibold"
              } text-white px-4 py-2 rounded cursor-pointer hover:shadow-2xl shadow-xl`}
            >
              {isUploading ? (
                "Uploading..."
              ) : (
                <>
                  <Save size={16} className="inline mr-1" /> Save
                </>
              )}
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ y: -1, scaleX: 1.1 }}
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 text-black bg-yellow-500 rounded shadow-xl cursor-pointer hover:shadow-2xl hover:font-semibold"
            >
              <Edit2 size={16} className="inline mr-1" /> Edit
            </motion.button>
          )}
        </div>

        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Main footer content */}
          <motion.div
            className="py-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="grid gap-8 lg:grid-cols-5">
              {/* Company info */}
              <motion.div
                className="space-y-6 lg:col-span-2"
                variants={itemVariants}
              >
                <div className="flex items-center">
                  <div className="relative flex items-center justify-center w-8 h-8 mr-2 overflow-hidden rounded-lg">
                    {isEditing ? (
                      <div className="relative w-full h-full">
                        {footerContent.companyInfo.logoUrl &&
                        (footerContent.companyInfo.logoUrl.startsWith(
                          "data:"
                        ) ||
                          footerContent.companyInfo.logoUrl.startsWith(
                            "http"
                          )) ? (
                          <img
                            src={footerContent.companyInfo.logoUrl || logo}
                            alt="Logo"
                            className="object-contain w-full h-full"
                          />
                        ) : (
                          <span className="text-lg font-bold text-black">
                            {footerContent.companyInfo.logoUrl}
                          </span>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center transition-opacity bg-black bg-opacity-50 opacity-0 hover:opacity-100">
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="p-1 text-xs text-white bg-blue-500 rounded"
                          >
                            <Upload size={12} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {footerContent.companyInfo.logoUrl &&
                        (footerContent.companyInfo.logoUrl.startsWith(
                          "data:"
                        ) ||
                          footerContent.companyInfo.logoUrl.startsWith(
                            "http"
                          )) ? (
                          <img
                            src={footerContent.companyInfo.logoUrl}
                            alt="Logo"
                            className="object-contain w-[70px] h-[70px]"
                          />
                        ) : (
                          <span className="text-lg font-medium text-black">
                            {footerContent.companyInfo.logoUrl}
                          </span>
                        )}
                      </>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden font-bold"
                    />
                  </div>
                  {isEditing ? (
                    <div className="relative">
                      <input
                        value={footerContent.companyInfo.companyName}
                        onChange={(e) =>
                          updateCompanyInfo("companyName", e.target.value)
                        }
                        maxLength={50}
                        className={`w-full text-xl font-bold text-white bg-transparent border-b ${
                          footerContent.companyInfo.companyName.length >= 50
                            ? "border-red-500"
                            : ""
                        }`}
                      />
                      <div className="text-right text-xs text-gray-300 mt-1">
                        {footerContent.companyInfo.companyName.length}/50
                        {footerContent.companyInfo.companyName.length >= 50 && (
                          <span className="ml-2 text-red-300 font-bold">
                            Character limit reached!
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <span className="text-xl font-bold text-white">
                      {footerContent.companyInfo.companyName}
                    </span>
                  )}
                </div>

                {isEditing ? (
                  <div className="relative">
                    <textarea
                      value={footerContent.companyInfo.description}
                      onChange={(e) =>
                        updateCompanyInfo("description", e.target.value)
                      }
                      maxLength={200}
                      className={`w-full max-w-md text-gray-400 bg-transparent border-b ${
                        footerContent.companyInfo.description.length >= 200
                          ? "border-red-500"
                          : ""
                      }`}
                      rows={3}
                    />
                    <div className="text-right text-xs text-gray-500 mt-1">
                      {footerContent.companyInfo.description.length}/200
                      {footerContent.companyInfo.description.length >= 200 && (
                        <span className="ml-2 text-red-500 font-bold">
                          Character limit reached!
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="max-w-md text-gray-400">
                    {footerContent.companyInfo.description}
                  </p>
                )}
              </motion.div>

              {/* Footer links */}
              {Object.entries(footerContent.footerLinks).map(
                ([category, links], categoryIndex) => (
                  <motion.div key={category} variants={itemVariants}>
                    {isEditing ? (
                      <div className="relative">
                        <input
                          value={category}
                          onChange={(e) => {
                            const newCategory = e.target.value;
                            setFooterContent((prev) => {
                              const newLinks = { ...prev.footerLinks };
                              newLinks[newCategory] = newLinks[category];
                              delete newLinks[category];
                              return { ...prev, footerLinks: newLinks };
                            });
                          }}
                          maxLength={25}
                          className={`w-full mb-4 font-medium text-white bg-transparent border-b ${
                            category.length >= 25 ? "border-red-500" : ""
                          }`}
                        />
                        <div className="text-right text-xs text-gray-300 mt-1 -mb-2">
                          {category.length}/25
                          {category.length >= 25 && (
                            <span className="ml-2 text-red-300 font-bold">
                              Character limit reached!
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <h4 className="mb-4 font-medium text-white">
                        {category}
                      </h4>
                    )}
                    <ul className="space-y-3">
                      {links.map((link, linkIndex) => (
                        <motion.li
                          key={linkIndex}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{
                            delay: categoryIndex * 0.1 + linkIndex * 0.05,
                            duration: 0.5,
                          }}
                          whileHover={{ x: 5 }}
                        >
                          {isEditing ? (
                            <div className="flex items-center">
                              <input
                                value={link.name}
                                onChange={(e) =>
                                  updateFooterLink(
                                    category,
                                    linkIndex,
                                    "name",
                                    e.target.value
                                  )
                                }
                                className="w-full mr-2 text-gray-400 bg-transparent border-b"
                              />
                              <input
                                value={link.href}
                                onChange={(e) =>
                                  updateFooterLink(
                                    category,
                                    linkIndex,
                                    "href",
                                    e.target.value
                                  )
                                }
                                className="w-full mr-2 text-gray-400 bg-transparent border-b"
                              />
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() =>
                                  removeFooterLink(category, linkIndex)
                                }
                              >
                                ×
                              </Button>
                            </div>
                          ) : (
                            <a
                              href={link.href}
                              className="text-gray-400 transition-colors hover:text-primary"
                            >
                              {link.name}
                            </a>
                          )}
                        </motion.li>
                      ))}
                      {isEditing && (
                        <motion.li
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Button
                            onClick={() => addFooterLink(category)}
                            className="text-green-600"
                          >
                            + Add Link
                          </Button>
                        </motion.li>
                      )}
                    </ul>
                  </motion.div>
                )
              )}
            </div>
          </motion.div>
        </div>
      </motion.footer>
    </>
  );
}