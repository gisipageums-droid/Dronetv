// // components/Profile.tsx
// import React, { useState, useEffect, useCallback } from "react";
// import { motion } from "framer-motion";
// import { useTheme } from "./ThemeProvider";
// import { toast } from "react-toastify";
// import { X, Zap, Edit, Save, Plus, Trash2, ZoomIn } from "lucide-react";
// import Cropper from "react-easy-crop";

// const Profile = ({
//   profileData,
//   onStateChange,
//   userId,
//   publishedId,
//   templateSelection,
// }) => {
//   const { theme } = useTheme();
//   const [isEditing, setIsEditing] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);
//   const [pendingImages, setPendingImages] = useState<Record<number, File>>({});

//   // Cropping states
//   const [showCropper, setShowCropper] = useState(false);
//   const [croppingIndex, setCroppingIndex] = useState<number | null>(null);
//   const [crop, setCrop] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);
//   const [rotation, setRotation] = useState(0);
//   const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
//   const [imageToCrop, setImageToCrop] = useState(null);
//   const [originalFile, setOriginalFile] = useState(null);
//   const [aspectRatio, setAspectRatio] = useState(3 / 4);
//   const [mediaSize, setMediaSize] = useState<{ width: number; height: number; naturalWidth: number; naturalHeight: number } | null>(null);
//   const [cropAreaSize, setCropAreaSize] = useState<{ width: number; height: number } | null>(null);
//   const [minZoomDynamic, setMinZoomDynamic] = useState(0.1);
//   const [isDragging, setIsDragging] = useState(false);
//   const PAN_STEP = 10;

//   // Consolidated state
//   const [contentState, setContentState] = useState(profileData);

//   // Add this useEffect to notify parent of state changes
//   useEffect(() => {
//     if (onStateChange) {
//       onStateChange(contentState);
//     }
//   }, [contentState, onStateChange]);

//   // Allow more zoom-out; do not enforce cover when media/crop sizes change
//   useEffect(() => {
//     if (mediaSize && cropAreaSize) {
//       setMinZoomDynamic(0.1);
//     }
//   }, [mediaSize, cropAreaSize]);

//   // Arrow keys to pan image inside crop area when cropper is open
//   const nudge = useCallback((dx: number, dy: number) => {
//     setCrop((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
//   }, []);

//   useEffect(() => {
//     if (!showCropper) return;
//     const onKeyDown = (e: KeyboardEvent) => {
//       if (e.key === "ArrowLeft") { e.preventDefault(); nudge(-PAN_STEP, 0); }
//       else if (e.key === "ArrowRight") { e.preventDefault(); nudge(PAN_STEP, 0); }
//       else if (e.key === "ArrowUp") { e.preventDefault(); nudge(0, -PAN_STEP); }
//       else if (e.key === "ArrowDown") { e.preventDefault(); nudge(0, PAN_STEP); }
//     };
//     window.addEventListener("keydown", onKeyDown);
//     return () => window.removeEventListener("keydown", onKeyDown);
//   }, [showCropper, nudge]);

//   // Update function for team members
//   const updateTeamMemberField = (index, field, value) => {
//     setContentState((prev) => ({
//       ...prev,
//       teamMembers: prev.teamMembers.map((m, i) =>
//         i === index ? { ...m, [field]: value } : m
//       ),
//     }));
//   };

//   // Add a new team member
//   const addTeamMember = () => {
//     setContentState((prev) => ({
//       ...prev,
//       teamMembers: [
//         ...prev.teamMembers,
//         {
//           id: Date.now(),
//           name: "New Member",
//           role: "New Role",
//           image: null,
//           bio: "Team member bio...",
//           socialLinks: {
//             twitter: "#",
//             linkedin: "#",
//           },
//         },
//       ],
//     }));
//   };

//   // Remove a team member
//   const removeTeamMember = (index) => {
//     setContentState((prev) => ({
//       ...prev,
//       teamMembers: prev.teamMembers.filter((_, i) => i !== index),
//     }));
//   };

//   // Update social links
//   const updateSocialLink = (index, platform, value) => {
//     setContentState((prev) => ({
//       ...prev,
//       teamMembers: prev.teamMembers.map((m, i) =>
//         i === index
//           ? {
//               ...m,
//               socialLinks: { ...m.socialLinks, [platform]: value },
//             }
//           : m
//       ),
//     }));
//   };

//   // Image selection handler - now opens cropper
//   const handleTeamMemberImageSelect = async (index, e) => {
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
//       setCroppingIndex(index);
//       setShowCropper(true);
//       setAspectRatio(1); // Enforce square 1:1
//       setCrop({ x: 0, y: 0 });
//       setZoom(1);
//       setRotation(0);
//     };
//     reader.readAsDataURL(file);

//     // Clear the file input
//     e.target.value = "";
//   };

//   // Cropper functions
//   const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
//     setCroppedAreaPixels(croppedAreaPixels);
//   }, []);

//   // Helper function to create image element
//   const createImage = (url) =>
//     new Promise((resolve, reject) => {
//       const image = new Image();
//       image.addEventListener("load", () => resolve(image));
//       image.addEventListener("error", (error) => reject(error));
//       image.setAttribute("crossOrigin", "anonymous");
//       image.src = url;
//     });

//   // Function to get cropped image
//   const getCroppedImg = async (imageSrc, pixelCrop, rotation = 0) => {
//     const image = await createImage(imageSrc);
//     const canvas = document.createElement("canvas");
//     const ctx = canvas.getContext("2d");

//     // Fixed output size for 1:1 ratio (like Hero's fixed export behavior)
//     const outputWidth = 600;
//     const outputHeight = 600;

//     canvas.width = outputWidth;
//     canvas.height = outputHeight;

//     ctx.drawImage(
//       image,
//       pixelCrop.x,
//       pixelCrop.y,
//       pixelCrop.width,
//       pixelCrop.height,
//       0,
//       0,
//       outputWidth,
//       outputHeight
//     );

//     return new Promise((resolve) => {
//       canvas.toBlob(
//         (blob) => {
//           const fileName = originalFile
//             ? `cropped-profile-${croppingIndex}-${originalFile.name}`
//             : `cropped-profile-${croppingIndex}-${Date.now()}.jpg`;

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

//   // Apply crop and set pending file
//   const applyCrop = async () => {
//     try {
//       if (!imageToCrop || !croppedAreaPixels || croppingIndex === null) return;

//       const { file, previewUrl } = await getCroppedImg(
//         imageToCrop,
//         croppedAreaPixels,
//         rotation
//       );

//       // Update preview immediately with blob URL (temporary)
//       updateTeamMemberField(croppingIndex, "image", previewUrl);

//       // Set the actual file for upload on save
//       setPendingImages((prev) => ({ ...prev, [croppingIndex]: file }));
//       console.log("Profile image cropped, file ready for upload:", file);

//       toast.success("Image cropped successfully! Click Save to upload to S3.");
//       setShowCropper(false);
//       setImageToCrop(null);
//       setOriginalFile(null);
//       setCroppingIndex(null);
//     } catch (error) {
//       console.error("Error cropping image:", error);
//       toast.error("Error cropping image. Please try again.");
//     }
//   };

//   // Cancel cropping
//   const cancelCrop = () => {
//     setShowCropper(false);
//     setImageToCrop(null);
//     setOriginalFile(null);
//     setCroppingIndex(null);
//     setCrop({ x: 0, y: 0 });
//     setZoom(1);
//     setRotation(0);
//   };

//   // Reset zoom and rotation
//   const resetCropSettings = () => {
//     setZoom(1);
//     setRotation(0);
//     setCrop({ x: 0, y: 0 });
//   };

//   // Save button handler - uploads images and stores S3 URLs
//   const handleSave = async () => {
//     try {
//       setIsUploading(true);

//       // Upload all pending images
//       for (const [indexStr, file] of Object.entries(pendingImages)) {
//         const index = parseInt(indexStr);

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
//         formData.append("file", file);
//         formData.append("sectionName", "profile");
//         formData.append(
//           "imageField",
//           `teamMembers[${index}].image` + Date.now()
//         );
//         formData.append("templateSelection", templateSelection);

//         console.log("Uploading profile image to S3:", file);

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
//           updateTeamMemberField(index, "image", uploadData.imageUrl);
//           console.log("Image uploaded to S3:", uploadData.imageUrl);
//         } else {
//           const errorData = await uploadResponse.json();
//           console.error("Image upload failed:", errorData);
//           toast.error(
//             `Image upload failed: ${errorData.message || "Unknown error"}`
//           );
//           return;
//         }
//       }

//       // Clear pending images
//       setPendingImages({});
//       // Exit edit mode
//       setIsEditing(false);
//       toast.success("Profile section saved with S3 URLs!");
//     } catch (error) {
//       console.error("Error saving profile section:", error);
//       toast.error("Error saving changes. Please try again.");
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   return (
//     <>
//       {/* Image Cropper Modal - Profile (Same as Clients) */}
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
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-800">
//                   Crop Profile Image
//                 </h3>
//                 <p className="text-sm text-gray-600 mt-1">
//                   Recommended: 100×100px (1:1 ratio) - square
//                 </p>
//               </div>
//               <button
//                 onClick={cancelCrop}
//                 className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-600" />
//               </button>
//             </div>

//             {/* Cropper Area */}
//             <div className={`flex-1 relative bg-gray-900 min-h-0 ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}>
//               <Cropper
//                 image={imageToCrop}
//                 crop={crop}
//                 zoom={zoom}
//                 rotation={rotation}
//                 aspect={aspectRatio}
//                 minZoom={minZoomDynamic}
//                 maxZoom={5}
//                 restrictPosition={false}
//                 zoomWithScroll={true}
//                 zoomSpeed={0.2}
//                 onCropChange={setCrop}
//                 onZoomChange={setZoom}
//                 onCropComplete={onCropComplete}
//                 onMediaLoaded={(ms) => setMediaSize(ms)}
//                 onCropAreaChange={(area) => setCropAreaSize(area)}
//                 onInteractionStart={() => setIsDragging(true)}
//                 onInteractionEnd={() => setIsDragging(false)}
//                 showGrid={true}
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
//                   {/* <button
//                     onClick={() => setAspectRatio(3 / 4)}
//                     className={`px-3 py-2 text-sm rounded border ${
//                       aspectRatio === 3 / 4
//                         ? "bg-blue-500 text-white border-blue-500"
//                         : "bg-white text-gray-700 border-gray-300"
//                     }`}
//                   >
//                     3:4 (Portrait)
//                   </button>
//                   <button
//                     onClick={() => setAspectRatio(1)}
//                     className={`px-3 py-2 text-sm rounded border ${
//                       aspectRatio === 1
//                         ? "bg-blue-500 text-white border-blue-500"
//                         : "bg-white text-gray-700 border-gray-300"
//                     }`}
//                   >
//                     1:1 (Square)
//                   </button> */}
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
//                 <div className="flex items-center gap-3">
//                   <button
//                     type="button"
//                     aria-label="Zoom out"
//                     onClick={() => setZoom((z) => Math.max(minZoomDynamic, parseFloat((z - 0.1).toFixed(2))))}
//                     className="px-3 py-1 border rounded text-gray-700 hover:bg-gray-100"
//                   >
//                     −
//                   </button>
//                   <input
//                     type="range"
//                     value={zoom}
//                     min={minZoomDynamic}
//                     max={5}
//                     step={0.1}
//                     onChange={(e) => setZoom(Number(e.target.value))}
//                     className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
//                   />
//                   <button
//                     type="button"
//                     aria-label="Zoom in"
//                     onClick={() => setZoom((z) => Math.min(5, parseFloat((z + 0.1).toFixed(2))))}
//                     className="px-3 py-1 border rounded text-gray-700 hover:bg-gray-100"
//                   >
//                     +
//                   </button>
//                 </div>
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

//       {/* Main Profile Section */}
//       <section
//         id="our-team"
//         className={`py-20 theme-transition ${
//           theme === "dark"
//             ? "bg-black text-gray-100"
//             : "bg-gray-50 text-gray-900"
//         }`}
//       >
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           {/* Edit/Save Buttons */}
//           <div className="flex justify-end mb-6">
//             {isEditing ? (
//               <motion.button
//                 whileTap={{ scale: 0.9 }}
//                 whileHover={{ y: -1, scaleX: 1.1 }}
//                 onClick={handleSave}
//                 disabled={isUploading}
//                 className={`${
//                   isUploading
//                     ? "bg-gray-400 cursor-not-allowed"
//                     : "bg-green-600 hover:shadow-2xl"
//                 } text-white px-4 py-2 rounded shadow-xl hover:font-semibold flex items-center gap-2`}
//               >
//                 <Save size={16} />
//                 {isUploading ? "Uploading..." : "Save"}
//               </motion.button>
//             ) : (
//               <motion.button
//                 whileTap={{ scale: 0.9 }}
//                 whileHover={{ y: -1, scaleX: 1.1 }}
//                 onClick={() => setIsEditing(true)}
//                 className="bg-yellow-500 text-black px-4 py-2 rounded cursor-pointer hover:shadow-2xl shadow-xl hover:font-semibold flex items-center gap-2"
//               >
//                 <Edit size={16} />
//                 Edit
//               </motion.button>
//             )}
//           </div>

//           <div className="text-center mb-16">
//             {isEditing ? (
//               <div className="relative">
//                 <input
//                   type="text"
//                   value={contentState.heading}
//                   onChange={(e) =>
//                     setContentState((prev) => ({
//                       ...prev,
//                       heading: e.target.value,
//                     }))
//                   }
//                   maxLength={100}
//                   className={`text-3xl font-bold mb-4 border-b bg-transparent text-center w-full ${
//                     contentState.heading.length >= 100 ? "border-red-500" : ""
//                   }`}
//                 />
//                 <div className="text-right text-xs text-gray-500 mt-1">
//                   {contentState.heading.length}/100
//                   {contentState.heading.length >= 100 && (
//                     <span className="ml-2 text-red-500 font-bold">
//                       Character limit reached!
//                     </span>
//                   )}
//                 </div>
//               </div>
//             ) : (
//               <h2 className="text-3xl font-bold mb-4">
//                 {contentState.heading}
//               </h2>
//             )}

//             {isEditing ? (
//               <div className="relative">
//                 <textarea
//                   value={contentState.subheading}
//                   onChange={(e) =>
//                     setContentState((prev) => ({
//                       ...prev,
//                       subheading: e.target.value,
//                     }))
//                   }
//                   maxLength={200}
//                   className={`text-lg max-w-3xl mx-auto border-b bg-transparent text-center w-full ${
//                     contentState.subheading.length >= 200
//                       ? "border-red-500"
//                       : ""
//                   }`}
//                 />
//                 <div className="text-right text-xs text-gray-500 mt-1">
//                   {contentState.subheading.length}/200
//                   {contentState.subheading.length >= 200 && (
//                     <span className="ml-2 text-red-500 font-bold">
//                       Character limit reached!
//                     </span>
//                   )}
//                 </div>
//               </div>
//             ) : (
//               <p className="text-lg max-w-3xl mx-auto">
//                 {contentState.subheading}
//               </p>
//             )}
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {contentState.teamMembers.map((member, index) => (
//               <motion.div
//                 key={member.id}
//                 className={`rounded-lg overflow-hidden shadow-lg ${
//                   theme === "dark" ? "bg-gray-900" : "bg-white"
//                 }`}
//                 whileHover={{ y: -5 }}
//                 transition={{ duration: 0.2 }}
//               >
//                 <div className="relative h-60 overflow-hidden">
//                   <img
//                     src={member.image}
//                     alt={member.name}
//                     className="w-full h-full object-cover"
//                   />

//                   {isEditing && (
//                     <motion.div
//                       animate={{ opacity: [0, 1], scale: [0.8, 1] }}
//                       whileHover={{ scale: 1.1 }}
//                       whileTap={{ scale: 0.9 }}
//                       transition={{ duration: 0.3 }}
//                       className="absolute mx-2 bottom-2 left-2 z-50 bg-white/80 p-1 rounded"
//                     >
//                       <div className="text-xs text-gray-600 mb-1">
//                         Recommended: 100×100px (1:1)
//                       </div>
//                       <input
//                         type="file"
//                         accept="image/*"
//                         className="text-xs w-full cursor-pointer font-bold"
//                         onChange={(e) => handleTeamMemberImageSelect(index, e)}
//                       />
//                       {pendingImages[index] && (
//                         <p className="text-xs text-green-600 mt-1">
//                           ✓ Image cropped and ready to upload
//                         </p>
//                       )}
//                     </motion.div>
//                   )}
//                 </div>
//                 <div className="p-6 text-center">
//                   {isEditing ? (
//                     <div className="relative">
//                       <input
//                         value={member.name}
//                         onChange={(e) =>
//                           updateTeamMemberField(index, "name", e.target.value)
//                         }
//                         maxLength={50}
//                         className={`text-xl font-semibold mb-1 border-b bg-transparent text-center w-full ${
//                           member.name.length >= 50 ? "border-red-500" : ""
//                         }`}
//                       />
//                       <div className="text-right text-xs text-gray-500 mt-1">
//                         {member.name.length}/50
//                         {member.name.length >= 50 && (
//                           <span className="ml-2 text-red-500 font-bold">
//                             Character limit reached!
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   ) : (
//                     <h3 className="text-xl font-semibold mb-1">
//                       {member.name}
//                     </h3>
//                   )}

//                   {isEditing ? (
//                     <div className="relative">
//                       <input
//                         value={member.role}
//                         onChange={(e) =>
//                           updateTeamMemberField(index, "role", e.target.value)
//                         }
//                         maxLength={60}
//                         className={`font-medium mb-3 border-b bg-transparent text-center w-full ${
//                           member.role.length >= 60 ? "border-red-500" : ""
//                         }`}
//                         style={{ color: "#facc15" }}
//                       />
//                       <div className="text-right text-xs text-gray-500 mt-1">
//                         {member.role.length}/60
//                         {member.role.length >= 60 && (
//                           <span className="ml-2 text-red-500 font-bold">
//                             Character limit reached!
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   ) : (
//                     <p
//                       className="font-medium mb-3"
//                       style={{ color: "#facc15" }}
//                     >
//                       {member.role}
//                     </p>
//                   )}

//                   {isEditing ? (
//                     <textarea
//                       value={member.bio}
//                       onChange={(e) =>
//                         updateTeamMemberField(index, "bio", e.target.value)
//                       }
//                       maxLength={200}
//                       className={`text-sm border-b bg-transparent text-center w-full ${
//                         theme === "dark" ? "text-gray-300" : "text-gray-600"
//                       } ${
//                         member.bio.length >= 200
//                           ? "border-red-500"
//                           : member.bio.length >= 180
//                           ? "border-orange-500"
//                           : ""
//                       }`}
//                     />
//                   ) : (
//                     <p
//                       className={`text-sm ${
//                         theme === "dark" ? "text-gray-300" : "text-gray-600"
//                       }`}
//                     >
//                       {member.bio}
//                     </p>
//                   )}

//                   <div className="flex justify-center mt-4 space-x-3">
//                     {isEditing ? (
//                       <>
//                         <input
//                           value={member.socialLinks.twitter}
//                           onChange={(e) =>
//                             updateSocialLink(index, "twitter", e.target.value)
//                           }
//                           className="text-xs border-b bg-transparent text-center w-20"
//                           placeholder="Twitter URL"
//                         />
//                         <input
//                           value={member.socialLinks.linkedin}
//                           onChange={(e) =>
//                             updateSocialLink(index, "linkedin", e.target.value)
//                           }
//                           className="text-xs border-b bg-transparent text-center w-20"
//                           placeholder="LinkedIn URL"
//                         />
//                       </>
//                     ) : (
//                       <>
//                         {/* <a
//                           href={member.socialLinks.twitter}
//                           target="_blank"
//                           className={`p-2 rounded-full ${
//                             theme === "dark"
//                               ? "bg-gray-800 hover:bg-gray-500"
//                               : "bg-gray-100 hover:bg-gray-200"
//                           }`}
//                           aria-label="X (formerly Twitter)"
//                         >
//                           <svg
//                             className="w-4 h-4"
//                             fill="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
//                           </svg>
//                         </a>
//                         <a
//                           href={member.socialLinks.linkedin}
//                           target="_blank"
//                           className={`p-2 rounded-full ${
//                             theme === "dark"
//                               ? "bg-gray-800 hover:bg-gray-500"
//                               : "bg-gray-100 hover:bg-gray-200"
//                           }`}
//                           aria-label="LinkedIn"
//                         >
//                           <svg
//                             className="w-4 h-4"
//                             fill="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
//                           </svg>
//                         </a> */}
//                       </>
//                     )}
//                   </div>

//                   {isEditing && (
//                     <motion.button
//                       whileHover={{ scale: 1.1 }}
//                       whileTap={{ scale: 0.9 }}
//                       onClick={() => removeTeamMember(index)}
//                       className="mt-4 text-red-500 text-sm flex items-center justify-center gap-1 mx-auto"
//                     >
//                       <Trash2 size={14} />
//                       Remove
//                     </motion.button>
//                   )}
//                 </div>
//               </motion.div>
//             ))}

//             {isEditing && (
//               <motion.div
//                 className={`rounded-lg flex items-center justify-center border-dashed ${
//                   theme === "dark"
//                     ? "bg-gray-900 border-gray-700"
//                     : "bg-white border-gray-300"
//                 } border-2`}
//                 whileHover={{ scale: 1.02 }}
//               >
//                 <motion.button
//                   onClick={addTeamMember}
//                   className="flex flex-col items-center p-6 text-green-600"
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.9 }}
//                 >
//                   <Plus size={32} />
//                   <span className="mt-2">Add Team Member</span>
//                 </motion.button>
//               </motion.div>
//             )}
//           </div>
//         </div>
//       </section>
//     </>
//   );
// };

// export default Profile;


// // components/Profile.tsx
// import React, { useState, useEffect, useCallback } from "react";
// import { motion } from "framer-motion";
// import { useTheme } from "./ThemeProvider";
// import { toast } from "react-toastify";
// import { X, Zap, Edit, Save, Plus, Trash2, ZoomIn, CheckCircle } from "lucide-react";
// import Cropper from "react-easy-crop";

// const Profile = ({
//   profileData,
//   onStateChange,
//   userId,
//   publishedId,
//   templateSelection,
// }) => {
//   const { theme } = useTheme();
//   const [isEditing, setIsEditing] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);
//   const [pendingImages, setPendingImages] = useState<Record<number, File>>({});

//   // Cropping states
//   const [showCropper, setShowCropper] = useState(false);
//   const [croppingIndex, setCroppingIndex] = useState<number | null>(null);
//   const [crop, setCrop] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);
//   const [rotation, setRotation] = useState(0);
//   const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
//   const [imageToCrop, setImageToCrop] = useState(null);
//   const [originalFile, setOriginalFile] = useState(null);
//   const [aspectRatio, setAspectRatio] = useState(3 / 4);
//   const [mediaSize, setMediaSize] = useState<{ width: number; height: number; naturalWidth: number; naturalHeight: number } | null>(null);
//   const [cropAreaSize, setCropAreaSize] = useState<{ width: number; height: number } | null>(null);
//   const [minZoomDynamic, setMinZoomDynamic] = useState(0.1);
//   const [isDragging, setIsDragging] = useState(false);
//   const PAN_STEP = 10;

//   // Consolidated state
//   const [contentState, setContentState] = useState(profileData);

//   // Auto-update parent when contentState changes
//   useEffect(() => {
//     if (onStateChange) {
//       onStateChange(contentState);
//     }
//   }, [contentState, onStateChange]);

//   // Auto-save when images are uploaded
//   useEffect(() => {
//     const autoSaveImages = async () => {
//       const pendingEntries = Object.entries(pendingImages);
//       if (pendingEntries.length > 0 && !isUploading) {
//         await handleImageUpload();
//       }
//     };

//     autoSaveImages();
//   }, [pendingImages]);

//   // Allow more zoom-out; do not enforce cover when media/crop sizes change
//   useEffect(() => {
//     if (mediaSize && cropAreaSize) {
//       setMinZoomDynamic(0.1);
//     }
//   }, [mediaSize, cropAreaSize]);

//   // Arrow keys to pan image inside crop area when cropper is open
//   const nudge = useCallback((dx: number, dy: number) => {
//     setCrop((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
//   }, []);

//   useEffect(() => {
//     if (!showCropper) return;
//     const onKeyDown = (e: KeyboardEvent) => {
//       if (e.key === "ArrowLeft") { e.preventDefault(); nudge(-PAN_STEP, 0); }
//       else if (e.key === "ArrowRight") { e.preventDefault(); nudge(PAN_STEP, 0); }
//       else if (e.key === "ArrowUp") { e.preventDefault(); nudge(0, -PAN_STEP); }
//       else if (e.key === "ArrowDown") { e.preventDefault(); nudge(0, PAN_STEP); }
//     };
//     window.addEventListener("keydown", onKeyDown);
//     return () => window.removeEventListener("keydown", onKeyDown);
//   }, [showCropper, nudge]);

//   // Update function for heading - now auto-updates
//   const updateHeading = (value) => {
//     setContentState((prev) => ({
//       ...prev,
//       heading: value,
//     }));
//   };

//   // Update function for subheading - now auto-updates
//   const updateSubheading = (value) => {
//     setContentState((prev) => ({
//       ...prev,
//       subheading: value,
//     }));
//   };

//   // Update function for team members - now auto-updates
//   const updateTeamMemberField = (index, field, value) => {
//     setContentState((prev) => ({
//       ...prev,
//       teamMembers: prev.teamMembers.map((m, i) =>
//         i === index ? { ...m, [field]: value } : m
//       ),
//     }));
//   };

//   // Add a new team member - now auto-updates
//   const addTeamMember = () => {
//     setContentState((prev) => ({
//       ...prev,
//       teamMembers: [
//         ...prev.teamMembers,
//         {
//           id: Date.now(),
//           name: "New Member",
//           role: "New Role",
//           image: null,
//           bio: "Team member bio...",
//           socialLinks: {
//             twitter: "#",
//             linkedin: "#",
//           },
//         },
//       ],
//     }));
//   };

//   // Remove a team member - now auto-updates
//   const removeTeamMember = (index) => {
//     setContentState((prev) => ({
//       ...prev,
//       teamMembers: prev.teamMembers.filter((_, i) => i !== index),
//     }));
//   };

//   // Update social links - now auto-updates
//   const updateSocialLink = (index, platform, value) => {
//     setContentState((prev) => ({
//       ...prev,
//       teamMembers: prev.teamMembers.map((m, i) =>
//         i === index
//           ? {
//               ...m,
//               socialLinks: { ...m.socialLinks, [platform]: value },
//             }
//           : m
//       ),
//     }));
//   };

//   // Image selection handler - now opens cropper
//   const handleTeamMemberImageSelect = async (index, e) => {
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
//       setCroppingIndex(index);
//       setShowCropper(true);
//       setAspectRatio(1); // Enforce square 1:1
//       setCrop({ x: 0, y: 0 });
//       setZoom(1);
//       setRotation(0);
//     };
//     reader.readAsDataURL(file);

//     // Clear the file input
//     e.target.value = "";
//   };

//   // Cropper functions
//   const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
//     setCroppedAreaPixels(croppedAreaPixels);
//   }, []);

//   // Helper function to create image element
//   const createImage = (url) =>
//     new Promise((resolve, reject) => {
//       const image = new Image();
//       image.addEventListener("load", () => resolve(image));
//       image.addEventListener("error", (error) => reject(error));
//       image.setAttribute("crossOrigin", "anonymous");
//       image.src = url;
//     });

//   // Function to get cropped image
//   const getCroppedImg = async (imageSrc, pixelCrop, rotation = 0) => {
//     const image = await createImage(imageSrc);
//     const canvas = document.createElement("canvas");
//     const ctx = canvas.getContext("2d");

//     // Fixed output size for 1:1 ratio (like Hero's fixed export behavior)
//     const outputWidth = 600;
//     const outputHeight = 600;

//     canvas.width = outputWidth;
//     canvas.height = outputHeight;

//     ctx.drawImage(
//       image,
//       pixelCrop.x,
//       pixelCrop.y,
//       pixelCrop.width,
//       pixelCrop.height,
//       0,
//       0,
//       outputWidth,
//       outputHeight
//     );

//     return new Promise((resolve) => {
//       canvas.toBlob(
//         (blob) => {
//           const fileName = originalFile
//             ? `cropped-profile-${croppingIndex}-${originalFile.name}`
//             : `cropped-profile-${croppingIndex}-${Date.now()}.jpg`;

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

//   // Apply crop and set pending file - now auto-uploads
//   const applyCrop = async () => {
//     try {
//       if (!imageToCrop || !croppedAreaPixels || croppingIndex === null) return;

//       const { file, previewUrl } = await getCroppedImg(
//         imageToCrop,
//         croppedAreaPixels,
//         rotation
//       );

//       // Update preview immediately with blob URL (temporary)
//       updateTeamMemberField(croppingIndex, "image", previewUrl);

//       // Set the actual file for auto-upload
//       setPendingImages((prev) => ({ ...prev, [croppingIndex]: file }));
//       console.log("Profile image cropped, file ready for auto-upload:", file);

//       toast.success("Image cropped successfully! Auto-uploading to S3...");
//       setShowCropper(false);
//       setImageToCrop(null);
//       setOriginalFile(null);
//       setCroppingIndex(null);
//     } catch (error) {
//       console.error("Error cropping image:", error);
//       toast.error("Error cropping image. Please try again.");
//     }
//   };

//   // Cancel cropping
//   const cancelCrop = () => {
//     setShowCropper(false);
//     setImageToCrop(null);
//     setOriginalFile(null);
//     setCroppingIndex(null);
//     setCrop({ x: 0, y: 0 });
//     setZoom(1);
//     setRotation(0);
//   };

//   // Reset zoom and rotation
//   const resetCropSettings = () => {
//     setZoom(1);
//     setRotation(0);
//     setCrop({ x: 0, y: 0 });
//   };

//   // Separate function to handle image upload only
//   const handleImageUpload = async () => {
//     try {
//       setIsUploading(true);
//       const uploadPromises = [];

//       // Create upload promises for all pending images
//       for (const [indexStr, file] of Object.entries(pendingImages)) {
//         const index = parseInt(indexStr);

//         if (!userId || !publishedId || !templateSelection) {
//           console.error("Missing required props:", {
//             userId,
//             publishedId,
//             templateSelection,
//           });
//           toast.error(
//             "Missing user information. Please refresh and try again."
//           );
//           continue;
//         }

//         const formData = new FormData();
//         formData.append("file", file);
//         formData.append("sectionName", "profile");
//         formData.append(
//           "imageField",
//           `teamMembers[${index}].image` + Date.now()
//         );
//         formData.append("templateSelection", templateSelection);

//         console.log("Auto-uploading profile image to S3:", file);

//         const uploadPromise = fetch(
//           `https://o66ziwsye5.execute-api.ap-south-1.amazonaws.com/prod/upload-image/${userId}/${publishedId}`,
//           {
//             method: "POST",
//             body: formData,
//           }
//         ).then(async (uploadResponse) => {
//           if (uploadResponse.ok) {
//             const uploadData = await uploadResponse.json();
//             // Replace local preview with S3 URL
//             updateTeamMemberField(index, "image", uploadData.imageUrl);
//             console.log("Image auto-uploaded to S3:", uploadData.imageUrl);
//             return { success: true, index };
//           } else {
//             const errorData = await uploadResponse.json();
//             console.error("Image auto-upload failed:", errorData);
//             throw new Error(errorData.message || "Upload failed");
//           }
//         });

//         uploadPromises.push(uploadPromise);
//       }

//       // Wait for all uploads to complete
//       const results = await Promise.allSettled(uploadPromises);
      
//       const successfulUploads = results.filter(result => result.status === 'fulfilled').length;
//       const failedUploads = results.filter(result => result.status === 'rejected').length;

//       if (successfulUploads > 0) {
//         toast.success(`${successfulUploads} image(s) auto-uploaded successfully!`);
//       }
//       if (failedUploads > 0) {
//         toast.error(`${failedUploads} image(s) failed to upload. Please try again.`);
//       }

//       // Clear only successfully uploaded images from pending
//       const successfulIndices = results
//         .filter(result => result.status === 'fulfilled')
//         .map(result => result.value.index);
      
//       setPendingImages(prev => {
//         const updated = { ...prev };
//         successfulIndices.forEach(index => {
//           delete updated[index];
//         });
//         return updated;
//       });

//     } catch (error) {
//       console.error("Error in auto-upload:", error);
//       toast.error("Error auto-uploading images. Please try again.");
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   // Updated Save button handler - now only handles non-image changes and exits edit mode
//   const handleSave = async () => {
//     try {
//       // If there are pending images, upload them first
//       if (Object.keys(pendingImages).length > 0) {
//         await handleImageUpload();
//       }
      
//       // Exit edit mode
//       setIsEditing(false);
//       toast.success("Profile section saved!");
//     } catch (error) {
//       console.error("Error saving profile section:", error);
//       toast.error("Error saving changes. Please try again.");
//     }
//   };

//   return (
//     <>
//       {/* Image Cropper Modal - Profile (Same as Clients) */}
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
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-800">
//                   Crop Profile Image
//                 </h3>
//                 <p className="text-sm text-gray-600 mt-1">
//                   Recommended: 100×100px (1:1 ratio) - square
//                 </p>
//               </div>
//               <button
//                 onClick={cancelCrop}
//                 className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-600" />
//               </button>
//             </div>

//             {/* Cropper Area */}
//             <div className={`flex-1 relative bg-gray-900 min-h-0 ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}>
//               <Cropper
//                 image={imageToCrop}
//                 crop={crop}
//                 zoom={zoom}
//                 rotation={rotation}
//                 aspect={aspectRatio}
//                 minZoom={minZoomDynamic}
//                 maxZoom={5}
//                 restrictPosition={false}
//                 zoomWithScroll={true}
//                 zoomSpeed={0.2}
//                 onCropChange={setCrop}
//                 onZoomChange={setZoom}
//                 onCropComplete={onCropComplete}
//                 onMediaLoaded={(ms) => setMediaSize(ms)}
//                 onCropAreaChange={(area) => setCropAreaSize(area)}
//                 onInteractionStart={() => setIsDragging(true)}
//                 onInteractionEnd={() => setIsDragging(false)}
//                 showGrid={true}
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
//                     onClick={() => setAspectRatio(4 / 3)}
//                     className={`px-3 py-2 text-sm rounded border ${
//                       aspectRatio === 4 / 3
//                         ? "bg-blue-500 text-white border-blue-500"
//                         : "bg-white text-gray-700 border-gray-300"
//                     }`}
//                   >
//                     4:3 (Standard)
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
//                 <div className="flex items-center gap-3">
//                   <button
//                     type="button"
//                     aria-label="Zoom out"
//                     onClick={() => setZoom((z) => Math.max(minZoomDynamic, parseFloat((z - 0.1).toFixed(2))))}
//                     className="px-3 py-1 border rounded text-gray-700 hover:bg-gray-100"
//                   >
//                     −
//                   </button>
//                   <input
//                     type="range"
//                     value={zoom}
//                     min={minZoomDynamic}
//                     max={5}
//                     step={0.1}
//                     onChange={(e) => setZoom(Number(e.target.value))}
//                     className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
//                   />
//                   <button
//                     type="button"
//                     aria-label="Zoom in"
//                     onClick={() => setZoom((z) => Math.min(5, parseFloat((z + 0.1).toFixed(2))))}
//                     className="px-3 py-1 border rounded text-gray-700 hover:bg-gray-100"
//                   >
//                     +
//                   </button>
//                 </div>
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

//       {/* Main Profile Section */}
//       <section
//         id="our-team"
//         className={`py-20 theme-transition ${
//           theme === "dark"
//             ? "bg-black text-gray-100"
//             : "bg-gray-50 text-gray-900"
//         }`}
//       >
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           {/* Edit/Save Buttons */}
//           <div className="flex justify-end mb-6">
//             {isEditing ? (
//               <motion.button
//                 whileTap={{ scale: 0.9 }}
//                 whileHover={{ y: -1, scaleX: 1.1 }}
//                 onClick={handleSave}
//                 disabled={isUploading}
//                 className={`${
//                   isUploading
//                     ? "bg-gray-400 cursor-not-allowed"
//                     : "bg-green-600 hover:shadow-2xl"
//                 } text-white px-4 py-2 rounded shadow-xl hover:font-semibold flex items-center gap-2`}
//               >
//                 <Save size={16} />
//                 {isUploading ? "Uploading..." : "Save & Exit"}
//               </motion.button>
//             ) : (
//               <motion.button
//                 whileTap={{ scale: 0.9 }}
//                 whileHover={{ y: -1, scaleX: 1.1 }}
//                 onClick={() => setIsEditing(true)}
//                 className="bg-yellow-500 text-black px-4 py-2 rounded cursor-pointer hover:shadow-2xl shadow-xl hover:font-semibold flex items-center gap-2"
//               >
//                 <Edit size={16} />
//                 Edit
//               </motion.button>
//             )}
//           </div>

//           {/* Auto-update status indicator */}
//           {isEditing && (
//             <div className="flex items-center justify-end mb-4 text-sm text-green-600">
//               <CheckCircle className="w-4 h-4 mr-1" />
//               Auto-saving changes...
//             </div>
//           )}

//           <div className="text-center mb-16">
//             {isEditing ? (
//               <div className="relative">
//                 <input
//                   type="text"
//                   value={contentState.heading}
//                   onChange={(e) => updateHeading(e.target.value)}
//                   maxLength={100}
//                   className={`text-3xl font-bold mb-4 border-b bg-transparent text-center w-full ${
//                     contentState.heading.length >= 100 ? "border-red-500" : ""
//                   }`}
//                 />
//                 <div className="text-right text-xs text-gray-500 mt-1">
//                   {contentState.heading.length}/100
//                   {contentState.heading.length >= 100 && (
//                     <span className="ml-2 text-red-500 font-bold">
//                       Character limit reached!
//                     </span>
//                   )}
//                 </div>
//               </div>
//             ) : (
//               <h2 className="text-3xl font-bold mb-4">
//                 {contentState.heading}
//               </h2>
//             )}

//             {isEditing ? (
//               <div className="relative">
//                 <textarea
//                   value={contentState.subheading}
//                   onChange={(e) => updateSubheading(e.target.value)}
//                   maxLength={200}
//                   className={`text-lg max-w-3xl mx-auto border-b bg-transparent text-center w-full ${
//                     contentState.subheading.length >= 200
//                       ? "border-red-500"
//                       : ""
//                   }`}
//                 />
//                 <div className="text-right text-xs text-gray-500 mt-1">
//                   {contentState.subheading.length}/200
//                   {contentState.subheading.length >= 200 && (
//                     <span className="ml-2 text-red-500 font-bold">
//                       Character limit reached!
//                     </span>
//                   )}
//                 </div>
//               </div>
//             ) : (
//               <p className="text-lg max-w-3xl mx-auto">
//                 {contentState.subheading}
//               </p>
//             )}
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {contentState.teamMembers.map((member, index) => (
//               <motion.div
//                 key={member.id}
//                 className={`rounded-lg overflow-hidden shadow-lg ${
//                   theme === "dark" ? "bg-gray-900" : "bg-white"
//                 }`}
//                 whileHover={{ y: -5 }}
//                 transition={{ duration: 0.2 }}
//               >
//                 <div className="relative h-60 overflow-hidden">
//                   <img
//                     src={member.image}
//                     alt={member.name}
//                     className="w-full h-full object-cover"
//                   />

//                   {isEditing && (
//                     <motion.div
//                       animate={{ opacity: [0, 1], scale: [0.8, 1] }}
//                       whileHover={{ scale: 1.1 }}
//                       whileTap={{ scale: 0.9 }}
//                       transition={{ duration: 0.3 }}
//                       className="absolute mx-2 bottom-2 left-2 z-50 bg-white/80 p-1 rounded"
//                     >
//                       <div className="text-xs text-gray-600 mb-1">
//                         Recommended: 100×100px (1:1)
//                       </div>
//                       <input
//                         type="file"
//                         accept="image/*"
//                         className="text-xs w-full cursor-pointer font-bold"
//                         onChange={(e) => handleTeamMemberImageSelect(index, e)}
//                       />
//                       {pendingImages[index] && (
//                         <p className="text-xs text-green-600 mt-1">
//                           ✓ Image cropped and ready to upload
//                         </p>
//                       )}
//                     </motion.div>
//                   )}
//                 </div>
//                 <div className="p-6 text-center">
//                   {isEditing ? (
//                     <div className="relative">
//                       <input
//                         value={member.name}
//                         onChange={(e) =>
//                           updateTeamMemberField(index, "name", e.target.value)
//                         }
//                         maxLength={50}
//                         className={`text-xl font-semibold mb-1 border-b bg-transparent text-center w-full ${
//                           member.name.length >= 50 ? "border-red-500" : ""
//                         }`}
//                       />
//                       <div className="text-right text-xs text-gray-500 mt-1">
//                         {member.name.length}/50
//                         {member.name.length >= 50 && (
//                           <span className="ml-2 text-red-500 font-bold">
//                             Character limit reached!
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   ) : (
//                     <h3 className="text-xl font-semibold mb-1">
//                       {member.name}
//                     </h3>
//                   )}

//                   {isEditing ? (
//                     <div className="relative">
//                       <input
//                         value={member.role}
//                         onChange={(e) =>
//                           updateTeamMemberField(index, "role", e.target.value)
//                         }
//                         maxLength={60}
//                         className={`font-medium mb-3 border-b bg-transparent text-center w-full ${
//                           member.role.length >= 60 ? "border-red-500" : ""
//                         }`}
//                         style={{ color: "#facc15" }}
//                       />
//                       <div className="text-right text-xs text-gray-500 mt-1">
//                         {member.role.length}/60
//                         {member.role.length >= 60 && (
//                           <span className="ml-2 text-red-500 font-bold">
//                             Character limit reached!
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   ) : (
//                     <p
//                       className="font-medium mb-3"
//                       style={{ color: "#facc15" }}
//                     >
//                       {member.role}
//                     </p>
//                   )}

//                   {isEditing ? (
//                     <textarea
//                       value={member.bio}
//                       onChange={(e) =>
//                         updateTeamMemberField(index, "bio", e.target.value)
//                       }
//                       maxLength={200}
//                       className={`text-sm border-b bg-transparent text-center w-full ${
//                         theme === "dark" ? "text-gray-300" : "text-gray-600"
//                       } ${
//                         member.bio.length >= 200
//                           ? "border-red-500"
//                           : member.bio.length >= 180
//                           ? "border-orange-500"
//                           : ""
//                       }`}
//                     />
//                   ) : (
//                     <p
//                       className={`text-sm ${
//                         theme === "dark" ? "text-gray-300" : "text-gray-600"
//                       }`}
//                     >
//                       {member.bio}
//                     </p>
//                   )}

//                   <div className="flex justify-center mt-4 space-x-3">
//                     {isEditing ? (
//                       <>
//                         <input
//                           value={member.socialLinks.twitter}
//                           onChange={(e) =>
//                             updateSocialLink(index, "twitter", e.target.value)
//                           }
//                           className="text-xs border-b bg-transparent text-center w-20"
//                           placeholder="Twitter URL"
//                         />
//                         <input
//                           value={member.socialLinks.linkedin}
//                           onChange={(e) =>
//                             updateSocialLink(index, "linkedin", e.target.value)
//                           }
//                           className="text-xs border-b bg-transparent text-center w-20"
//                           placeholder="LinkedIn URL"
//                         />
//                       </>
//                     ) : (
//                       <>
//                         {/* Social icons remain commented out as in original */}
//                       </>
//                     )}
//                   </div>

//                   {isEditing && (
//                     <motion.button
//                       whileHover={{ scale: 1.1 }}
//                       whileTap={{ scale: 0.9 }}
//                       onClick={() => removeTeamMember(index)}
//                       className="mt-4 text-red-500 text-sm flex items-center justify-center gap-1 mx-auto"
//                     >
//                       <Trash2 size={14} />
//                       Remove
//                     </motion.button>
//                   )}
//                 </div>
//               </motion.div>
//             ))}

//             {isEditing && (
//               <motion.div
//                 className={`rounded-lg flex items-center justify-center border-dashed ${
//                   theme === "dark"
//                     ? "bg-gray-900 border-gray-700"
//                     : "bg-white border-gray-300"
//                 } border-2`}
//                 whileHover={{ scale: 1.02 }}
//               >
//                 <motion.button
//                   onClick={addTeamMember}
//                   className="flex flex-col items-center p-6 text-green-600"
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.9 }}
//                 >
//                   <Plus size={32} />
//                   <span className="mt-2">Add Team Member</span>
//                 </motion.button>
//               </motion.div>
//             )}
//           </div>
//         </div>
//       </section>
//     </>
//   );
// };

// export default Profile;



import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";
import { toast } from "react-toastify";
import { X, Zap, Edit, Save, Plus, Trash2, ZoomIn, CheckCircle } from "lucide-react";
import Cropper from "react-easy-crop";

const Profile = ({
  profileData,
  onStateChange,
  userId,
  publishedId,
  templateSelection,
}) => {
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [pendingImages, setPendingImages] = useState<Record<number, File>>({});

  // Cropping states
  const [showCropper, setShowCropper] = useState(false);
  const [croppingIndex, setCroppingIndex] = useState<number | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(3 / 4);
  const [mediaSize, setMediaSize] = useState<{ width: number; height: number; naturalWidth: number; naturalHeight: number } | null>(null);
  const [cropAreaSize, setCropAreaSize] = useState<{ width: number; height: number } | null>(null);
  const [minZoomDynamic, setMinZoomDynamic] = useState(0.1);
  const [isDragging, setIsDragging] = useState(false);
  const PAN_STEP = 10;

  // Consolidated state
  const [contentState, setContentState] = useState(profileData);

  // Auto-update parent when contentState changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(contentState);
    }
  }, [contentState, onStateChange]);

  // NEW: Function to upload image to AWS
  const uploadImageToAWS = async (file, imageField) => {
    if (!userId || !publishedId || !templateSelection) {
      console.error("Missing required props:", {
        userId,
        publishedId,
        templateSelection,
      });
      toast.error("Missing user information. Please refresh and try again.");
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("sectionName", "profile");
    formData.append("imageField", `${imageField}_${Date.now()}`);
    formData.append("templateSelection", templateSelection);

    console.log(`Uploading ${imageField} to S3:`, file);

    try {
      const uploadResponse = await fetch(
        `https://o66ziwsye5.execute-api.ap-south-1.amazonaws.com/prod/upload-image/${userId}/${publishedId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (uploadResponse.ok) {
        const uploadData = await uploadResponse.json();
        console.log(`${imageField} uploaded to S3:`, uploadData.imageUrl);
        return uploadData.imageUrl;
      } else {
        const errorData = await uploadResponse.json();
        console.error(`${imageField} upload failed:`, errorData);
        toast.error(
          `${imageField} upload failed: ${errorData.message || "Unknown error"}`
        );
        return null;
      }
    } catch (error) {
      console.error(`Error uploading ${imageField}:`, error);
      toast.error(`Error uploading image. Please try again.`);
      return null;
    }
  };

  // Allow more zoom-out; do not enforce cover when media/crop sizes change
  useEffect(() => {
    if (mediaSize && cropAreaSize) {
      setMinZoomDynamic(0.1);
    }
  }, [mediaSize, cropAreaSize]);

  // Arrow keys to pan image inside crop area when cropper is open
  const nudge = useCallback((dx: number, dy: number) => {
    setCrop((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
  }, []);

  useEffect(() => {
    if (!showCropper) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); nudge(-PAN_STEP, 0); }
      else if (e.key === "ArrowRight") { e.preventDefault(); nudge(PAN_STEP, 0); }
      else if (e.key === "ArrowUp") { e.preventDefault(); nudge(0, -PAN_STEP); }
      else if (e.key === "ArrowDown") { e.preventDefault(); nudge(0, PAN_STEP); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showCropper, nudge]);

  // Update function for heading - now auto-updates
  const updateHeading = (value) => {
    setContentState((prev) => ({
      ...prev,
      heading: value,
    }));
  };

  // Update function for subheading - now auto-updates
  const updateSubheading = (value) => {
    setContentState((prev) => ({
      ...prev,
      subheading: value,
    }));
  };

  // Update function for team members - now auto-updates
  const updateTeamMemberField = (index, field, value) => {
    setContentState((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.map((m, i) =>
        i === index ? { ...m, [field]: value } : m
      ),
    }));
  };

  // Add a new team member - now auto-updates
  const addTeamMember = () => {
    setContentState((prev) => ({
      ...prev,
      teamMembers: [
        ...prev.teamMembers,
        {
          id: Date.now(),
          name: "New Member",
          role: "New Role",
          image: null,
          bio: "Team member bio...",
          socialLinks: {
            twitter: "#",
            linkedin: "#",
          },
        },
      ],
    }));
  };

  // Remove a team member - now auto-updates
  const removeTeamMember = (index) => {
    setContentState((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index),
    }));
  };

  // Update social links - now auto-updates
  const updateSocialLink = (index, platform, value) => {
    setContentState((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.map((m, i) =>
        i === index
          ? {
              ...m,
              socialLinks: { ...m.socialLinks, [platform]: value },
            }
          : m
      ),
    }));
  };

  // Image selection handler - now opens cropper
  const handleTeamMemberImageSelect = async (index, e) => {
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
      setCroppingIndex(index);
      setShowCropper(true);
      setAspectRatio(1); // Enforce square 1:1
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
    };
    reader.readAsDataURL(file);

    // Clear the file input
    e.target.value = "";
  };

  // Cropper functions
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Helper function to create image element
  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  // Function to get cropped image
  const getCroppedImg = async (imageSrc, pixelCrop, rotation = 0) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Fixed output size for 1:1 ratio (like Hero's fixed export behavior)
    const outputWidth = 600;
    const outputHeight = 600;

    canvas.width = outputWidth;
    canvas.height = outputHeight;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      outputWidth,
      outputHeight
    );

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          const fileName = originalFile
            ? `cropped-profile-${croppingIndex}-${originalFile.name}`
            : `cropped-profile-${croppingIndex}-${Date.now()}.jpg`;

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

  // Apply crop and UPLOAD IMMEDIATELY to AWS - UPDATED
  const applyCrop = async () => {
    try {
      if (!imageToCrop || !croppedAreaPixels || croppingIndex === null) return;

      setIsUploading(true);

      const { file, previewUrl } = await getCroppedImg(
        imageToCrop,
        croppedAreaPixels,
        rotation
      );

      // Show preview immediately with blob URL (temporary)
      updateTeamMemberField(croppingIndex, "image", previewUrl);

      // UPLOAD TO AWS IMMEDIATELY
      const imageField = `teamMembers[${croppingIndex}].image`;
      const awsImageUrl = await uploadImageToAWS(file, imageField);

      if (awsImageUrl) {
        // Update with actual S3 URL
        updateTeamMemberField(croppingIndex, "image", awsImageUrl);
        
        // Remove from pending images since it's uploaded
        setPendingImages((prev) => {
          const newPending = { ...prev };
          delete newPending[croppingIndex];
          return newPending;
        });
        
        toast.success("Profile image cropped and uploaded to AWS successfully!");
      } else {
        // If upload fails, keep the preview URL and set as pending
        setPendingImages((prev) => ({ ...prev, [croppingIndex]: file }));
        toast.warning("Image cropped but upload failed. It will be saved locally.");
      }

      setShowCropper(false);
      setImageToCrop(null);
      setOriginalFile(null);
      setCroppingIndex(null);
    } catch (error) {
      console.error("Error cropping image:", error);
      toast.error("Error cropping image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Cancel cropping
  const cancelCrop = () => {
    setShowCropper(false);
    setImageToCrop(null);
    setOriginalFile(null);
    setCroppingIndex(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
  };

  // Reset zoom and rotation
  const resetCropSettings = () => {
    setZoom(1);
    setRotation(0);
    setCrop({ x: 0, y: 0 });
  };

  // Separate function to handle image upload only (for failed uploads)
  const handleImageUpload = async () => {
    try {
      setIsUploading(true);
      const uploadPromises = [];

      // Create upload promises for all pending images
      for (const [indexStr, file] of Object.entries(pendingImages)) {
        const index = parseInt(indexStr);

        const imageField = `teamMembers[${index}].image`;
        const uploadPromise = uploadImageToAWS(file, imageField).then((awsImageUrl) => {
          if (awsImageUrl) {
            updateTeamMemberField(index, "image", awsImageUrl);
            return { success: true, index };
          } else {
            throw new Error("Upload failed");
          }
        });

        uploadPromises.push(uploadPromise);
      }

      // Wait for all uploads to complete
      const results = await Promise.allSettled(uploadPromises);
      
      const successfulUploads = results.filter(result => result.status === 'fulfilled').length;
      const failedUploads = results.filter(result => result.status === 'rejected').length;

      if (successfulUploads > 0) {
        toast.success(`${successfulUploads} image(s) uploaded successfully!`);
      }
      if (failedUploads > 0) {
        toast.error(`${failedUploads} image(s) failed to upload. Please try again.`);
      }

      // Clear only successfully uploaded images from pending
      const successfulIndices = results
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value.index);
      
      setPendingImages(prev => {
        const updated = { ...prev };
        successfulIndices.forEach(index => {
          delete updated[index];
        });
        return updated;
      });

    } catch (error) {
      console.error("Error in upload:", error);
      toast.error("Error uploading images. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Updated Save button handler - now only handles non-image changes and exits edit mode
  const handleSave = async () => {
    try {
      // If there are pending images, upload them first
      if (Object.keys(pendingImages).length > 0) {
        await handleImageUpload();
      }
      
      // Exit edit mode
      setIsEditing(false);
      toast.success("Profile section saved!");
    } catch (error) {
      console.error("Error saving profile section:", error);
      toast.error("Error saving changes. Please try again.");
    }
  };

  return (
    <>
      {/* Image Cropper Modal - Profile (Same as Clients) */}
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
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Crop Profile Image
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Recommended: 100×100px (1:1 ratio) - square
                </p>
              </div>
              <button
                onClick={cancelCrop}
                className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Cropper Area */}
            <div className={`flex-1 relative bg-gray-900 min-h-0 ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}>
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={aspectRatio}
                minZoom={minZoomDynamic}
                maxZoom={5}
                restrictPosition={false}
                zoomWithScroll={true}
                zoomSpeed={0.2}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                onMediaLoaded={(ms) => setMediaSize(ms)}
                onCropAreaChange={(area) => setCropAreaSize(area)}
                onInteractionStart={() => setIsDragging(true)}
                onInteractionEnd={() => setIsDragging(false)}
                showGrid={true}
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
                    onClick={() => setAspectRatio(4 / 3)}
                    className={`px-3 py-2 text-sm rounded border ${
                      aspectRatio === 4 / 3
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-700 border-gray-300"
                    }`}
                  >
                    4:3 (Standard)
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
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label="Zoom out"
                    onClick={() => setZoom((z) => Math.max(minZoomDynamic, parseFloat((z - 0.1).toFixed(2))))}
                    className="px-3 py-1 border rounded text-gray-700 hover:bg-gray-100"
                  >
                    −
                  </button>
                  <input
                    type="range"
                    value={zoom}
                    min={minZoomDynamic}
                    max={5}
                    step={0.1}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
                  />
                  <button
                    type="button"
                    aria-label="Zoom in"
                    onClick={() => setZoom((z) => Math.min(5, parseFloat((z + 0.1).toFixed(2))))}
                    className="px-3 py-1 border rounded text-gray-700 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
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
                  disabled={isUploading}
                  className={`w-full ${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white rounded py-2 text-sm`}
                >
                  {isUploading ? "Uploading..." : "Apply Crop"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Main Profile Section */}
      <section
        id="our-team"
        className={`py-20 theme-transition ${
          theme === "dark"
            ? "bg-black text-gray-100"
            : "bg-gray-50 text-gray-900"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Edit/Save Buttons */}
          <div className="flex justify-end mb-6">
            {isEditing ? (
              <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ y: -1, scaleX: 1.1 }}
                onClick={handleSave}
                disabled={isUploading}
                className={`${
                  isUploading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:shadow-2xl"
                } text-white px-4 py-2 rounded shadow-xl hover:font-semibold flex items-center gap-2`}
              >
                <Save size={16} />
                {isUploading ? "Uploading..." : "Save & Exit"}
              </motion.button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ y: -1, scaleX: 1.1 }}
                onClick={() => setIsEditing(true)}
                className="bg-yellow-500 text-black px-4 py-2 rounded cursor-pointer hover:shadow-2xl shadow-xl hover:font-semibold flex items-center gap-2"
              >
                <Edit size={16} />
                Edit
              </motion.button>
            )}
          </div>

          {/* Auto-update status indicator */}
          {isEditing && (
            <div className="flex items-center justify-end mb-4 text-sm text-green-600">
              <CheckCircle className="w-4 h-4 mr-1" />
              Auto-saving changes...
            </div>
          )}

          <div className="text-center mb-16">
            {isEditing ? (
              <div className="relative">
                <input
                  type="text"
                  value={contentState.heading}
                  onChange={(e) => updateHeading(e.target.value)}
                  maxLength={100}
                  className={`text-3xl font-bold mb-4 border-b bg-transparent text-center w-full ${
                    contentState.heading.length >= 100 ? "border-red-500" : ""
                  }`}
                />
                <div className="text-right text-xs text-gray-500 mt-1">
                  {contentState.heading.length}/100
                  {contentState.heading.length >= 100 && (
                    <span className="ml-2 text-red-500 font-bold">
                      Character limit reached!
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <h2 className="text-3xl font-bold mb-4">
                {contentState.heading}
              </h2>
            )}

            {isEditing ? (
              <div className="relative">
                <textarea
                  value={contentState.subheading}
                  onChange={(e) => updateSubheading(e.target.value)}
                  maxLength={200}
                  className={`text-lg max-w-3xl mx-auto border-b bg-transparent text-center w-full ${
                    contentState.subheading.length >= 200
                      ? "border-red-500"
                      : ""
                  }`}
                />
                <div className="text-right text-xs text-gray-500 mt-1">
                  {contentState.subheading.length}/200
                  {contentState.subheading.length >= 200 && (
                    <span className="ml-2 text-red-500 font-bold">
                      Character limit reached!
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-lg max-w-3xl mx-auto">
                {contentState.subheading}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contentState.teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                className={`rounded-lg overflow-hidden shadow-lg ${
                  theme === "dark" ? "bg-gray-900" : "bg-white"
                }`}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />

                  {isEditing && (
                    <motion.div
                      animate={{ opacity: [0, 1], scale: [0.8, 1] }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="absolute mx-2 bottom-2 left-2 z-50 bg-white/80 p-1 rounded"
                    >
                      <div className="text-xs text-gray-600 mb-1">
                        Recommended: 100×100px (1:1)
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="text-xs w-full cursor-pointer font-bold"
                        onChange={(e) => handleTeamMemberImageSelect(index, e)}
                      />
                      {pendingImages[index] && (
                        <p className="text-xs text-green-600 mt-1">
                          ✓ Image cropped and ready to upload
                        </p>
                      )}
                    </motion.div>
                  )}
                </div>
                <div className="p-6 text-center">
                  {isEditing ? (
                    <div className="relative">
                      <input
                        value={member.name}
                        onChange={(e) =>
                          updateTeamMemberField(index, "name", e.target.value)
                        }
                        maxLength={50}
                        className={`text-xl font-semibold mb-1 border-b bg-transparent text-center w-full ${
                          member.name.length >= 50 ? "border-red-500" : ""
                        }`}
                      />
                      <div className="text-right text-xs text-gray-500 mt-1">
                        {member.name.length}/50
                        {member.name.length >= 50 && (
                          <span className="ml-2 text-red-500 font-bold">
                            Character limit reached!
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <h3 className="text-xl font-semibold mb-1">
                      {member.name}
                    </h3>
                  )}

                  {isEditing ? (
                    <div className="relative">
                      <input
                        value={member.role}
                        onChange={(e) =>
                          updateTeamMemberField(index, "role", e.target.value)
                        }
                        maxLength={60}
                        className={`font-medium mb-3 border-b bg-transparent text-center w-full ${
                          member.role.length >= 60 ? "border-red-500" : ""
                        }`}
                        style={{ color: "#facc15" }}
                      />
                      <div className="text-right text-xs text-gray-500 mt-1">
                        {member.role.length}/60
                        {member.role.length >= 60 && (
                          <span className="ml-2 text-red-500 font-bold">
                            Character limit reached!
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p
                      className="font-medium mb-3"
                      style={{ color: "#facc15" }}
                    >
                      {member.role}
                    </p>
                  )}

                  {isEditing ? (
                    <textarea
                      value={member.bio}
                      onChange={(e) =>
                        updateTeamMemberField(index, "bio", e.target.value)
                      }
                      maxLength={200}
                      className={`text-sm border-b bg-transparent text-center w-full ${
                        theme === "dark" ? "text-gray-300" : "text-gray-600"
                      } ${
                        member.bio.length >= 200
                          ? "border-red-500"
                          : member.bio.length >= 180
                          ? "border-orange-500"
                          : ""
                      }`}
                    />
                  ) : (
                    <p
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {member.bio}
                    </p>
                  )}

                  <div className="flex justify-center mt-4 space-x-3">
                    {isEditing ? (
                      <>
                        <input
                          value={member.socialLinks.twitter}
                          onChange={(e) =>
                            updateSocialLink(index, "twitter", e.target.value)
                          }
                          className="text-xs border-b bg-transparent text-center w-20"
                          placeholder="Twitter URL"
                        />
                        <input
                          value={member.socialLinks.linkedin}
                          onChange={(e) =>
                            updateSocialLink(index, "linkedin", e.target.value)
                          }
                          className="text-xs border-b bg-transparent text-center w-20"
                          placeholder="LinkedIn URL"
                        />
                      </>
                    ) : (
                      <>
                        {/* Social icons remain commented out as in original */}
                      </>
                    )}
                  </div>

                  {isEditing && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeTeamMember(index)}
                      className="mt-4 text-red-500 text-sm flex items-center justify-center gap-1 mx-auto"
                    >
                      <Trash2 size={14} />
                      Remove
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}

            {isEditing && (
              <motion.div
                className={`rounded-lg flex items-center justify-center border-dashed ${
                  theme === "dark"
                    ? "bg-gray-900 border-gray-700"
                    : "bg-white border-gray-300"
                } border-2`}
                whileHover={{ scale: 1.02 }}
              >
                <motion.button
                  onClick={addTeamMember}
                  className="flex flex-col items-center p-6 text-green-600"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Plus size={32} />
                  <span className="mt-2">Add Team Member</span>
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Profile;