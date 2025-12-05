// import {
//   Edit2,
//   Loader2,
//   Plus,
//   Save,
//   Trash2,
//   Upload,
//   X,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";
// import { motion } from "motion/react";
// import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import { toast } from "react-toastify";
// import { Badge } from "./ui/badge";
// import Cropper from "react-easy-crop";

// // Custom Button component
// const Button = ({
//   children,
//   onClick,
//   variant,
//   size,
//   className,
//   disabled,
//   ...props
// }) => {
//   const baseClasses =
//     "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
//   const variants = {
//     outline: "border border-gray-300 bg-transparent hover:bg-gray-50",
//     default: "bg-blue-600 text-white hover:bg-blue-700",
//   };
//   const sizes = {
//     sm: "h-8 px-3 text-sm",
//     default: "h-10 px-4",
//   };

//   return (
//     <button
//       className={`${baseClasses} ${variants[variant] || variants.default} ${sizes[size] || sizes.default
//         } ${className || ""}`}
//       onClick={onClick}
//       disabled={disabled}
//       {...props}
//     >
//       {children}
//     </button>
//   );
// };

// // Enhanced crop helper function (same as Header)
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

// export default function EditableGallerySection({
//   galleryData,
//   onStateChange,
//   userId,
//   publishedId,
//   templateSelection,
// }) {
//   const [isEditing, setIsEditing] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);
//   const [dataLoaded, setDataLoaded] = useState(false);
//   const [isVisible, setIsVisible] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [pendingImages, setPendingImages] = useState({});

//   // Enhanced crop modal state (same as Header)
//   const [cropModalOpen, setCropModalOpen] = useState(false);
//   const [crop, setCrop] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);
//   const [rotation, setRotation] = useState(0);
//   const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
//   const [imageToCrop, setImageToCrop] = useState(null);
//   const [originalFile, setOriginalFile] = useState(null);
//   const [aspectRatio, setAspectRatio] = useState(4 / 3);
//   const [cropIndex, setCropIndex] = useState(null);

//   const sectionRef = useRef(null);
//   const fileInputRefs = useRef([]);

//   // Default galleryData structure matching Gallery2.tsx
//   const defaultgalleryData = galleryData;

//   // Consolidated state
//   const [galleryState, setGalleryState] = useState(defaultgalleryData);
//   const [tempGalleryState, setTempGalleryState] = useState(defaultgalleryData);

//   // Notify parent of state changes
//   useEffect(() => {
//     if (onStateChange) {
//       onStateChange(galleryState);
//     }
//   }, [galleryState, onStateChange]);

//   // Initialize with galleryData if provided
//   useEffect(() => {
//     if (galleryData) {
//       setGalleryState(galleryData);
//       setTempGalleryState(galleryData);
//       setDataLoaded(true);
//     }
//   }, [galleryData]);

//   // Intersection Observer for visibility
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         setIsVisible(entry.isIntersecting);
//       },
//       { threshold: 0.1 }
//     );

//     if (sectionRef.current) {
//       observer.observe(sectionRef.current);
//     }

//     return () => {
//       if (sectionRef.current) {
//         observer.unobserve(sectionRef.current);
//       }
//     };
//   }, []);

//   const handleEdit = () => {
//     setIsEditing(true);
//     setTempGalleryState(galleryState);
//     setPendingImages({});
//   };

//   // Save function with S3 upload for multiple images
//   const handleSave = async () => {
//     try {
//       setIsUploading(true);

//       // Create a copy of tempGalleryState to update with S3 URLs
//       let updatedState = { ...tempGalleryState };
//       let updatedImages = [...updatedState.images];

//       // Upload all pending images
//       for (const [indexStr, file] of Object.entries(pendingImages)) {
//         const index = parseInt(indexStr);

//         if (!userId || !publishedId || !templateSelection) {
//           toast.error(
//             "Missing user information. Please refresh and try again."
//           );
//           return;
//         }

//         const formData = new FormData();
//         formData.append("file", file);
//         formData.append("sectionName", "gallery");
//         formData.append("imageField", `images[${index}].url` + Date.now());
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
//           updatedImages[index] = {
//             ...updatedImages[index],
//             url: uploadData.imageUrl,
//           };
//           console.log(
//             `Gallery image ${index} uploaded to S3:`,
//             uploadData.imageUrl
//           );
//         } else {
//           const errorData = await uploadResponse.json();
//           toast.error(
//             `Image upload failed: ${errorData.message || "Unknown error"}`
//           );
//           return;
//         }
//       }

//       // Update images array with new URLs
//       updatedState.images = updatedImages;

//       // Clear pending files
//       setPendingImages({});

//       // Save the updated state with S3 URLs
//       setIsSaving(true);
//       await new Promise((resolve) => setTimeout(resolve, 1000));

//       // Update both states with the new URLs
//       setGalleryState(updatedState);
//       setTempGalleryState(updatedState);

//       setIsEditing(false);
//       toast.success("Gallery section saved with S3 URLs ready for publish");
//     } catch (error) {
//       console.error("Error saving gallery section:", error);
//       toast.error("Error saving changes. Please try again.");
//     } finally {
//       setIsUploading(false);
//       setIsSaving(false);
//     }
//   };

//   const handleCancel = () => {
//     setTempGalleryState(galleryState);
//     setPendingImages({});
//     setIsEditing(false);
//   };

//   // Update functions for header
//   const updateHeaderField = useCallback((field, value) => {
//     // Apply character limits for header fields
//     let processedValue = value;

//     if (field === "title" && value.length > 100) {
//       processedValue = value.slice(0, 100);
//     } else if (field === "description" && value.length > 200) {
//       processedValue = value.slice(0, 200);
//     }

//     setTempGalleryState((prev) => ({
//       ...prev,
//       heading: {
//         ...prev.heading,
//         [field]: processedValue,
//       },
//     }));
//   }, []);

//   // Update functions for images
//   const updateImageField = useCallback((index, field, value) => {
//     // Apply character limits based on field type
//     let processedValue = value;

//     if (field === "title" && value.length > 100) {
//       processedValue = value.slice(0, 100);
//     } else if (field === "category" && value.length > 50) {
//       processedValue = value.slice(0, 50);
//     } else if (field === "description" && value.length > 500) {
//       processedValue = value.slice(0, 500);
//     }

//     setTempGalleryState((prev) => ({
//       ...prev,
//       images: prev.images.map((img, i) =>
//         i === index ? { ...img, [field]: processedValue } : img
//       ),
//     }));
//   }, []);

//   // Add new image
//   const addImage = useCallback(() => {
//     setTempGalleryState((prev) => ({
//       ...prev,
//       images: [
//         ...prev.images,
//         {
//           id: Date.now(),
//           url: null,
//           title: "New Image",
//           category: "Portfolio",
//           description: "New image description",
//           isPopular: false,
//         },
//       ],
//     }));
//   }, []);

//   // Remove image
//   const removeImage = useCallback((index) => {
//     setTempGalleryState((prev) => ({
//       ...prev,
//       images: prev.images.filter((_, i) => i !== index),
//     }));

//     // Also remove from pending files if it exists
//     setPendingImages((prev) => {
//       const newPending = { ...prev };
//       delete newPending[index];
//       return newPending;
//     });
//   }, []);

//   // Enhanced cropper functions (same as Header)
//   const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
//     setCroppedAreaPixels(croppedAreaPixels);
//   }, []);

//   // Enhanced image upload handler with crop modal (same as Header)
//   const handleImageUpload = useCallback((index, event) => {
//     const file = event.target.files?.[0];
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
//       setCropIndex(index);
//       setCropModalOpen(true);
//       setAspectRatio(4 / 3); // Default aspect ratio for gallery images
//       setCrop({ x: 0, y: 0 });
//       setZoom(1);
//       setRotation(0);
//     };
//     reader.readAsDataURL(file);

//     if (event.target) {
//       event.target.value = "";
//     }
//   }, []);

//   // Apply crop function (same as Header)
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
//       setPendingImages((prev) => ({ ...prev, [cropIndex]: file }));

//       // Show immediate local preview of cropped image
//       updateImageField(cropIndex, "url", previewUrl);

//       setCropModalOpen(false);
//       setImageToCrop(null);
//       setOriginalFile(null);
//       toast.success("Image cropped successfully");
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

//   // Lightbox functions
//   const openLightbox = (index) => {
//     if (!isEditing) {
//       setSelectedImage(index);
//     }
//   };

//   const closeLightbox = () => {
//     setSelectedImage(null);
//   };

//   const goToNext = () => {
//     if (selectedImage !== null) {
//       setSelectedImage((prev) =>
//         prev === tempGalleryState.images.length - 1 ? 0 : prev + 1
//       );
//     }
//   };

//   const goToPrev = () => {
//     if (selectedImage !== null) {
//       setSelectedImage((prev) =>
//         prev === 0 ? tempGalleryState.images.length - 1 : prev - 1
//       );
//     }
//   };

//   // Memoized EditableText component with character limits
//   const EditableText = useMemo(() => {
//     return ({
//       value,
//       field,
//       multiline = false,
//       className = "",
//       placeholder = "",
//       onChange = null,
//       maxLength = null,
//     }) => {
//       const handleChange = (e) => {
//         if (onChange) {
//           onChange(e);
//         } else {
//           updateHeaderField(field, e.target.value);
//         }
//       };

//       const baseClasses =
//         "w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none";

//       // Show character count if maxLength is provided
//       const charCount = maxLength ? (
//         <div className="text-xs text-gray-500 text-right mt-1">
//           {value?.length || 0}/{maxLength}
//         </div>
//       ) : null;

//       if (multiline) {
//         return (
//           <div>
//             <textarea
//               value={value || ""}
//               onChange={(e) => {
//                 if (!maxLength || e.target.value.length <= maxLength) {
//                   handleChange(e);
//                 }
//               }}
//               className={`${baseClasses} p-2 resize-none ${className}`}
//               placeholder={placeholder}
//               rows={3}
//               maxLength={maxLength}
//             />
//             {charCount}
//           </div>
//         );
//       }

//       return (
//         <div>
//           <input
//             type="text"
//             value={value || ""}
//             onChange={(e) => {
//               if (!maxLength || e.target.value.length <= maxLength) {
//                 handleChange(e);
//               }
//             }}
//             className={`${baseClasses} p-1 ${className}`}
//             placeholder={placeholder}
//             maxLength={maxLength}
//           />
//           {charCount}
//         </div>
//       );
//     };
//   }, [updateHeaderField]);

//   const displaygalleryData = isEditing ? tempGalleryState : galleryState;

//   return (
//     <section
//       id="gallery"
//       ref={sectionRef}
//       className={`${displaygalleryData?.images?.length > 0 ? "py-24" : "py-2"
//         } bg-gradient-to-b from-yellow-50/30 via-white to-yellow-50/20 scroll-mt-20 relative`}
//     >
//       {/* Loading Overlay */}
//       {isLoading && (
//         <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-20">
//           <div className="bg-white rounded-lg p-6 shadow-lg flex items-center gap-3">
//             <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
//             <span className="text-gray-700">Loading galleryData...</span>
//           </div>
//         </div>
//       )}

//       {/* Edit Controls */}
//       <div className="absolute top-4 right-4 z-10">
//         {!isEditing ? (
//           <Button
//             onClick={handleEdit}
//             variant="outline"
//             size="sm"
//             className="bg-white hover:bg-gray-50 shadow-md"
//           >
//             <Edit2 className="w-4 h-4 mr-2" />
//             Edit
//           </Button>
//         ) : (
//           <div className="flex gap-2">
//             <Button
//               onClick={handleSave}
//               size="sm"
//               className="bg-green-600 hover:bg-green-700 text-white shadow-md"
//               disabled={isSaving || isUploading}
//             >
//               {isUploading ? (
//                 <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//               ) : isSaving ? (
//                 <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//               ) : (
//                 <Save className="w-4 h-4 mr-2" />
//               )}
//               {isUploading ? "Uploading..." : isSaving ? "Saving..." : "Save"}
//             </Button>
//             <Button
//               onClick={handleCancel}
//               variant="outline"
//               size="sm"
//               className="bg-white hover:bg-gray-50 shadow-md"
//               disabled={isSaving || isUploading}
//             >
//               <X className="w-4 h-4 mr-2" />
//               Cancel
//             </Button>
//           </div>
//         )}
//       </div>

//       <div className="max-w-7xl mx-auto px-6">
//         {/* Section Header */}
//         <div className="text-center mb-16">
//           {displaygalleryData?.images?.length > 0 && (
//             <motion.div
//               initial={{ opacity: 0, scale: 0.8 }}
//               animate={isVisible ? { opacity: 1, scale: 1 } : {}}
//               transition={{ duration: 0.6, ease: "easeOut" }}
//               className="inline-block mb-4"
//             >
//               <Badge className="bg-[#ffeb3b] text-gray-900 px-5 py-2 shadow-md">
//                 Our Gallery
//               </Badge>
//             </motion.div>
//           )}

//           {isEditing ? (
//             <div className="space-y-4">
//               <EditableText
//                 value={displaygalleryData?.heading?.title}
//                 field="title"
//                 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center"
//                 placeholder="Gallery Title"
//                 maxLength={35}
//               />
//               <EditableText
//                 value={displaygalleryData?.heading?.description}
//                 field="description"
//                 multiline={true}
//                 className="text-gray-600 max-w-2xl mx-auto text-lg text-center"
//                 placeholder="Gallery description"
//                 maxLength={100}
//               />
//             </div>
//           ) : (
//             <>
//               <motion.h2
//                 initial={{ opacity: 0, y: 30 }}
//                 animate={isVisible ? { opacity: 1, y: 0 } : {}}
//                 transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
//                 className="text-3xl md:text-4xl font-extrabold text-gray-900"
//               >
//                 {displaygalleryData?.heading?.title}
//               </motion.h2>

//               <motion.p
//                 initial={{ opacity: 0, y: 30 }}
//                 animate={isVisible ? { opacity: 1, y: 0 } : {}}
//                 transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
//                 className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg"
//               >
//                 {displaygalleryData?.heading?.description}
//               </motion.p>
//             </>
//           )}
//         </div>

//         {/* Gallery Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {displaygalleryData?.images?.map((image, index) => (
//             <motion.div
//               key={image.id}
//               initial={{ opacity: 0, y: 50 }}
//               animate={isVisible ? { opacity: 1, y: 0 } : {}}
//               transition={{
//                 delay: 0.5 + index * 0.1,
//                 duration: 0.8,
//                 ease: [0.16, 1, 0.3, 1],
//               }}
//               whileHover={{
//                 y: isEditing ? 0 : -5,
//                 scale: isEditing ? 1 : 1.02,
//               }}
//               className={`overflow-hidden rounded-lg shadow-md cursor-pointer group ${"bg-white"}`}
//               onClick={() => openLightbox(index)}
//             >
//               <div className="relative overflow-hidden">
//                 {image.url ? (
//                   <img
//                     src={image.url}
//                     alt={image.title}
//                     className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110 scale-110"
//                     onError={(e) => {
//                       e.currentTarget.src =
//                         "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&h=600&fit=crop";
//                     }}
//                   />
//                 ) : (
//                   <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
//                     <span className="text-gray-500">No image</span>
//                   </div>
//                 )}

//                 {isEditing && (
//                   <div className="absolute top-2 left-2 z-10 flex flex-col gap-2">
//                     <Button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         fileInputRefs.current[index]?.click();
//                       }}
//                       size="sm"
//                       variant="outline"
//                       className="bg-white/90 backdrop-blur-sm shadow-md"
//                     >
//                       <Upload className="w-4 h-4 mr-2" />
//                       Change
//                     </Button>
//                     <input
//                       ref={(el) => (fileInputRefs.current[index] = el)}
//                       type="file"
//                       accept="image/*"
//                       onChange={(e) => handleImageUpload(index, e)}
//                       className="hidden"
//                     />
//                     {pendingImages[index] && (
//                       <p className="text-xs text-orange-600 bg-white p-1 rounded">
//                         {pendingImages[index].name}
//                       </p>
//                     )}
//                   </div>
//                 )}

//                 <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-end">
//                   <div className="p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-full">
//                     {isEditing ? (
//                       <>
//                         <div>
//                           <input
//                             value={image.title}
//                             onChange={(e) =>
//                               updateImageField(index, "title", e.target.value)
//                             }
//                             className="font-semibold bg-transparent border-b w-full mb-1 text-white placeholder-gray-300"
//                             placeholder="Image title"
//                             maxLength={35}
//                           />
//                           <div className="text-xs text-gray-300 text-right">
//                             {image.title?.length || 0}/100
//                           </div>
//                         </div>
//                         <div>
//                           <input
//                             value={image.category}
//                             onChange={(e) =>
//                               updateImageField(
//                                 index,
//                                 "category",
//                                 e.target.value
//                               )
//                             }
//                             className="text-sm bg-transparent border-b w-full text-white placeholder-gray-300"
//                             placeholder="Image category"
//                             maxLength={50}
//                           />
//                           <div className="text-xs text-gray-300 text-right">
//                             {image?.category?.length || 0}/50
//                           </div>
//                         </div>
//                         <div>
//                           <textarea
//                             value={image?.description}
//                             onChange={(e) =>
//                               updateImageField(
//                                 index,
//                                 "description",
//                                 e.target.value
//                               )
//                             }
//                             className="text-xs bg-transparent border-b w-full mt-1 text-white placeholder-gray-300 resize-none"
//                             placeholder="Image description"
//                             rows={2}
//                             maxLength={500}
//                           />
//                           <div className="text-xs text-gray-300 text-right">
//                             {image?.description?.length || 0}/500
//                           </div>
//                         </div>
//                       </>
//                     ) : (
//                       <>
//                         <h3 className="font-semibold">{image?.title}</h3>
//                         <p className="text-sm">{image?.category}</p>
//                         <p className="text-xs mt-1 opacity-90">
//                           {image?.description}
//                         </p>
//                       </>
//                     )}
//                   </div>
//                 </div>

//                 {isEditing && (
//                   <Button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       removeImage(index);
//                     }}
//                     size="sm"
//                     variant="outline"
//                     className="absolute top-2 right-2 bg-red-50 hover:bg-red-100 text-red-700"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                   </Button>
//                 )}
//               </div>
//             </motion.div>
//           ))}

//           {/* Add new image button in edit mode */}
//           {displaygalleryData?.images?.length < 6 && isEditing && (
//             <motion.div
//               initial={{ opacity: 0, y: 50 }}
//               animate={isVisible ? { opacity: 1, y: 0 } : {}}
//               transition={{
//                 delay: 0.5 + displaygalleryData?.images?.length * 0.1,
//                 duration: 0.8,
//                 ease: [0.16, 1, 0.3, 1],
//               }}
//               className="rounded-lg flex items-center justify-center border-dashed bg-white border-2 border-gray-300 cursor-pointer h-full min-h-[256px]"
//               onClick={addImage}
//             >
//               <div className="flex flex-col items-center p-6 text-green-600">
//                 <Plus size={32} />
//                 <span className="mt-2">Add Image</span>
//               </div>
//             </motion.div>
//           )}
//         </div>

//         {displaygalleryData?.images?.length >= 6 && isEditing && (
//           <p className="mt-6 w-full border border-gray-200 px-2 py-4 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium">
//             You alredy have 6 image's for adding new image you can edit existing
//             images or remove one then add new!
//           </p>
//         )}
//       </div>

//       {/* Lightbox Modal */}
//       {selectedImage !== null && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="fixed top-[8rem] inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
//         >
//           <button
//             onClick={closeLightbox}
//             className="absolute top-4 right-4 text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 z-10"
//           >
//             <X size={24} />
//           </button>

//           <button
//             onClick={goToPrev}
//             className="absolute left-4 text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 z-10"
//           >
//             <ChevronLeft size={32} />
//           </button>

//           <button
//             onClick={goToNext}
//             className="absolute right-4 text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 z-10"
//           >
//             <ChevronRight size={32} />
//           </button>

//           <div className="max-w-4xl w-full max-h-full">
//             <img
//               src={displaygalleryData?.images[selectedImage].url}
//               alt={displaygalleryData?.images[selectedImage].title}
//               className="w-full h-auto max-h-full object-contain scale-110"
//             />
//             <div className="text-white text-center mt-4">
//               <h3 className="text-xl font-semibold">
//                 {displaygalleryData?.images[selectedImage]?.title}
//               </h3>
//               <p className="text-gray-300">
//                 {displaygalleryData?.images[selectedImage]?.category}
//               </p>
//               <p className="text-gray-400 text-sm mt-2">
//                 {displaygalleryData?.images[selectedImage]?.description}
//               </p>
//             </div>
//           </div>
//         </motion.div>
//       )}

//       {/* Enhanced Crop Modal (same as Header) */}
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
//                 Crop Image
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
//                 <p className="text-sm font-medium text-gray-700 mb-2">
//                   Aspect Ratio:
//                 </p>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => setAspectRatio(1)}
//                     className={`px-3 py-2 text-sm rounded border ${aspectRatio === 1
//                         ? "bg-blue-500 text-white border-blue-500"
//                         : "bg-white text-gray-700 border-gray-300"
//                       }`}
//                   >
//                     1:1 (Square)
//                   </button>
//                   <button
//                     onClick={() => setAspectRatio(4 / 3)}
//                     className={`px-3 py-2 text-sm rounded border ${aspectRatio === 4 / 3
//                         ? "bg-blue-500 text-white border-blue-500"
//                         : "bg-white text-gray-700 border-gray-300"
//                       }`}
//                   >
//                     4:3 (Standard)
//                   </button>
//                   <button
//                     onClick={() => setAspectRatio(16 / 9)}
//                     className={`px-3 py-2 text-sm rounded border ${aspectRatio === 16 / 9
//                         ? "bg-blue-500 text-white border-blue-500"
//                         : "bg-white text-gray-700 border-gray-300"
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
//                   <span className="text-gray-600">{zoom?.toFixed(1)}x</span>
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
//     </section>
//   );
// }

// import {
//   Edit2,
//   Loader2,
//   Plus,
//   Save,
//   Trash2,
//   Upload,
//   X,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";
// import { motion } from "motion/react";
// import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import { toast } from "react-toastify";
// import { Badge } from "./ui/badge";
// import Cropper from "react-easy-crop";

// // Custom Button component
// const Button = ({
//   children,
//   onClick,
//   variant,
//   size,
//   className,
//   disabled,
//   ...props
// }) => {
//   const baseClasses =
//     "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
//   const variants = {
//     outline: "border border-gray-300 bg-transparent hover:bg-gray-50",
//     default: "bg-blue-600 text-white hover:bg-blue-700",
//   };
//   const sizes = {
//     sm: "h-8 px-3 text-sm",
//     default: "h-10 px-4",
//   };

//   return (
//     <button
//       className={`${baseClasses} ${variants[variant] || variants.default} ${sizes[size] || sizes.default
//         } ${className || ""}`}
//       onClick={onClick}
//       disabled={disabled}
//       {...props}
//     >
//       {children}
//     </button>
//   );
// };

// // Enhanced crop helper function (same as Header)
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

// export default function EditableGallerySection({
//   galleryData,
//   onStateChange,
//   userId,
//   publishedId,
//   templateSelection,
// }) {
//   const [isEditing, setIsEditing] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);
//   const [dataLoaded, setDataLoaded] = useState(false);
//   const [isVisible, setIsVisible] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [pendingImages, setPendingImages] = useState({});

//   // Auto-save state
//   const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);
//   const [lastSaved, setLastSaved] = useState<Date | null>(null);

//   // Enhanced crop modal state (same as Header)
//   const [cropModalOpen, setCropModalOpen] = useState(false);
//   const [crop, setCrop] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);
//   const [rotation, setRotation] = useState(0);
//   const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
//   const [imageToCrop, setImageToCrop] = useState(null);
//   const [originalFile, setOriginalFile] = useState(null);
//   const [aspectRatio, setAspectRatio] = useState(4 / 3);
//   const [cropIndex, setCropIndex] = useState(null);

//   const sectionRef = useRef(null);
//   const fileInputRefs = useRef([]);

//   // Default galleryData structure matching Gallery2.tsx
//   const defaultgalleryData = galleryData;

//   // Consolidated state
//   const [galleryState, setGalleryState] = useState(defaultgalleryData);
//   const [tempGalleryState, setTempGalleryState] = useState(defaultgalleryData);

//   // Notify parent of state changes
//   useEffect(() => {
//     if (onStateChange) {
//       onStateChange(galleryState);
//     }
//   }, [galleryState, onStateChange]);

//   // Initialize with galleryData if provided
//   useEffect(() => {
//     if (galleryData) {
//       setGalleryState(galleryData);
//       setTempGalleryState(galleryData);
//       setDataLoaded(true);
//     }
//   }, [galleryData]);

//   // Intersection Observer for visibility
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         setIsVisible(entry.isIntersecting);
//       },
//       { threshold: 0.1 }
//     );

//     if (sectionRef.current) {
//       observer.observe(sectionRef.current);
//     }

//     return () => {
//       if (sectionRef.current) {
//         observer.unobserve(sectionRef.current);
//       }
//     };
//   }, []);

//   // Auto-save effect
//   useEffect(() => {
//     if (isEditing && autoSaveTimeout) {
//       clearTimeout(autoSaveTimeout);
//     }

//     return () => {
//       if (autoSaveTimeout) {
//         clearTimeout(autoSaveTimeout);
//       }
//     };
//   }, [isEditing]);

//   // Upload image to AWS S3
//   const uploadImageToAWS = async (file: File, index: number): Promise<string | null> => {
//     if (!userId || !publishedId || !templateSelection) {
//       console.error("Missing required props for image upload");
//       toast.error("Missing user information. Please refresh and try again.");
//       return null;
//     }

//     try {
//       const formData = new FormData();
//       formData.append("file", file);
//       formData.append("sectionName", "gallery");
//       formData.append("imageField", `images[${index}].url-${Date.now()}`);
//       formData.append("templateSelection", templateSelection);

//       const uploadResponse = await fetch(
//         `https://o66ziwsye5.execute-api.ap-south-1.amazonaws.com/prod/upload-image/${userId}/${publishedId}`,
//         {
//           method: "POST",
//           body: formData,
//         }
//       );

//       if (uploadResponse.ok) {
//         const uploadData = await uploadResponse.json();
//         console.log(`Gallery image ${index} uploaded to S3:`, uploadData.imageUrl);
//         return uploadData.imageUrl;
//       } else {
//         const errorData = await uploadResponse.json();
//         console.error("Image upload failed:", errorData);
//         toast.error(`Image upload failed: ${errorData.message || "Unknown error"}`);
//         return null;
//       }
//     } catch (error) {
//       console.error("Error uploading image:", error);
//       toast.error("Error uploading image. Please try again.");
//       return null;
//     }
//   };

//   // Auto-save function
//   const autoSave = useCallback(async () => {
//     if (!isEditing) return;

//     try {
//       setIsSaving(true);

//       // Upload any pending images first
//       let updatedState = { ...tempGalleryState };
//       const uploadedImages: Record<number, string> = {};

//       for (const [indexStr, file] of Object.entries(pendingImages)) {
//         const index = parseInt(indexStr);
//         const imageUrl = await uploadImageToAWS(file, index);
        
//         if (imageUrl) {
//           uploadedImages[index] = imageUrl;
//           // Update the image in our local copy
//           updatedState.images = updatedState.images.map((img, i) =>
//             i === index ? { ...img, url: imageUrl } : img
//           );
//         }
//       }

//       // Clear pending images that were successfully uploaded
//       if (Object.keys(uploadedImages).length > 0) {
//         setPendingImages((prev) => {
//           const newPending = { ...prev };
//           Object.keys(uploadedImages).forEach(id => {
//             delete newPending[parseInt(id)];
//           });
//           return newPending;
//         });
//       }

//       // Update state with any changes and uploaded images
//       setGalleryState(updatedState);
//       setTempGalleryState(updatedState);
//       setLastSaved(new Date());

//       // Show auto-save notification (less intrusive than regular save)
//       toast.info("Changes auto-saved", { 
//         autoClose: 1000,
//         hideProgressBar: true 
//       });

//     } catch (error) {
//       console.error("Error during auto-save:", error);
//       // Don't show error toast for auto-save to avoid being annoying
//     } finally {
//       setIsSaving(false);
//     }
//   }, [isEditing, tempGalleryState, pendingImages, userId, publishedId, templateSelection]);

//   // Schedule auto-save
//   const scheduleAutoSave = useCallback(() => {
//     if (!isEditing) return;

//     if (autoSaveTimeout) {
//       clearTimeout(autoSaveTimeout);
//     }

//     const timeout = setTimeout(() => {
//       autoSave();
//     }, 2000); // Auto-save after 2 seconds of inactivity

//     setAutoSaveTimeout(timeout);
//   }, [isEditing, autoSave]);

//   const handleEdit = () => {
//     setIsEditing(true);
//     setTempGalleryState(galleryState);
//     setPendingImages({});
//   };

//   // Save function with S3 upload for multiple images
//   const handleSave = async () => {
//     try {
//       setIsUploading(true);
//       setIsSaving(true);

//       // Upload any remaining pending images
//       let updatedState = { ...tempGalleryState };

//       for (const [indexStr, file] of Object.entries(pendingImages)) {
//         const index = parseInt(indexStr);
//         const imageUrl = await uploadImageToAWS(file, index);

//         if (imageUrl) {
//           updatedState.images = updatedState.images.map((img, i) =>
//             i === index ? { ...img, url: imageUrl } : img
//           );
//         }
//       }

//       // Clear pending images
//       setPendingImages({});

//       // Update both states with the new content including S3 URLs
//       setGalleryState(updatedState);
//       setTempGalleryState(updatedState);

//       setIsEditing(false);
//       setLastSaved(new Date());
//       toast.success("Gallery section saved successfully");
//     } catch (error) {
//       console.error("Error saving gallery section:", error);
//       toast.error("Error saving changes. Please try again.");
//     } finally {
//       setIsUploading(false);
//       setIsSaving(false);
//     }
//   };

//   const handleCancel = () => {
//     setTempGalleryState(galleryState);
//     setPendingImages({});
//     setIsEditing(false);
    
//     // Clear any pending auto-save
//     if (autoSaveTimeout) {
//       clearTimeout(autoSaveTimeout);
//       setAutoSaveTimeout(null);
//     }
//   };

//   // Update functions for header
//   const updateHeaderField = useCallback((field, value) => {
//     // Apply character limits for header fields
//     let processedValue = value;

//     if (field === "title" && value.length > 100) {
//       processedValue = value.slice(0, 100);
//     } else if (field === "description" && value.length > 200) {
//       processedValue = value.slice(0, 200);
//     }

//     setTempGalleryState((prev) => ({
//       ...prev,
//       heading: {
//         ...prev.heading,
//         [field]: processedValue,
//       },
//     }));

//     scheduleAutoSave(); // Trigger auto-save on header field update
//   }, [scheduleAutoSave]);

//   // Update functions for images
//   const updateImageField = useCallback((index, field, value) => {
//     // Apply character limits based on field type
//     let processedValue = value;

//     if (field === "title" && value.length > 100) {
//       processedValue = value.slice(0, 100);
//     } else if (field === "category" && value.length > 50) {
//       processedValue = value.slice(0, 50);
//     } else if (field === "description" && value.length > 500) {
//       processedValue = value.slice(0, 500);
//     }

//     setTempGalleryState((prev) => ({
//       ...prev,
//       images: prev.images.map((img, i) =>
//         i === index ? { ...img, [field]: processedValue } : img
//       ),
//     }));

//     scheduleAutoSave(); // Trigger auto-save on image field update
//   }, [scheduleAutoSave]);

//   // Add new image
//   const addImage = useCallback(() => {
//     setTempGalleryState((prev) => ({
//       ...prev,
//       images: [
//         ...prev.images,
//         {
//           id: Date.now(),
//           url: null,
//           title: "New Image",
//           category: "Portfolio",
//           description: "New image description",
//           isPopular: false,
//         },
//       ],
//     }));
    
//     scheduleAutoSave(); // Trigger auto-save for new image addition
//   }, [scheduleAutoSave]);

//   // Remove image
//   const removeImage = useCallback((index) => {
//     setTempGalleryState((prev) => ({
//       ...prev,
//       images: prev.images.filter((_, i) => i !== index),
//     }));

//     // Also remove from pending files if it exists
//     setPendingImages((prev) => {
//       const newPending = { ...prev };
//       delete newPending[index];
//       return newPending;
//     });

//     scheduleAutoSave(); // Trigger auto-save for deletion
//   }, [scheduleAutoSave]);

//   // Enhanced cropper functions (same as Header)
//   const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
//     setCroppedAreaPixels(croppedAreaPixels);
//   }, []);

//   // Enhanced image upload handler with crop modal (same as Header)
//   const handleImageUpload = useCallback((index, event) => {
//     const file = event.target.files?.[0];
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
//       setCropIndex(index);
//       setCropModalOpen(true);
//       setAspectRatio(4 / 3); // Default aspect ratio for gallery images
//       setCrop({ x: 0, y: 0 });
//       setZoom(1);
//       setRotation(0);
//     };
//     reader.readAsDataURL(file);

//     if (event.target) {
//       event.target.value = "";
//     }
//   }, []);

//   // Apply crop function with direct AWS upload
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

//       // Upload cropped image directly to AWS
//       setIsUploading(true);
//       const imageUrl = await uploadImageToAWS(file, cropIndex);

//       if (imageUrl) {
//         // Update content with AWS URL directly
//         setTempGalleryState((prev) => ({
//           ...prev,
//           images: prev.images.map((img, i) =>
//             i === cropIndex ? { ...img, url: imageUrl } : img
//           ),
//         }));

//         // Also update main state for immediate consistency
//         setGalleryState((prev) => ({
//           ...prev,
//           images: prev.images.map((img, i) =>
//             i === cropIndex ? { ...img, url: imageUrl } : img
//           ),
//         }));

//         toast.success("Image cropped and uploaded successfully");
//       }

//       setCropModalOpen(false);
//       setImageToCrop(null);
//       setOriginalFile(null);
//     } catch (error) {
//       console.error("Error cropping image:", error);
//       toast.error("Error cropping image. Please try again.");
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

//   // Lightbox functions
//   const openLightbox = (index) => {
//     if (!isEditing) {
//       setSelectedImage(index);
//     }
//   };

//   const closeLightbox = () => {
//     setSelectedImage(null);
//   };

//   const goToNext = () => {
//     if (selectedImage !== null) {
//       setSelectedImage((prev) =>
//         prev === tempGalleryState.images.length - 1 ? 0 : prev + 1
//       );
//     }
//   };

//   const goToPrev = () => {
//     if (selectedImage !== null) {
//       setSelectedImage((prev) =>
//         prev === 0 ? tempGalleryState.images.length - 1 : prev - 1
//       );
//     }
//   };

//   // Memoized EditableText component with character limits
//   const EditableText = useMemo(() => {
//     return ({
//       value,
//       field,
//       multiline = false,
//       className = "",
//       placeholder = "",
//       onChange = null,
//       maxLength = null,
//     }) => {
//       const handleChange = (e) => {
//         if (onChange) {
//           onChange(e);
//         } else {
//           updateHeaderField(field, e.target.value);
//         }
//       };

//       const baseClasses =
//         "w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none";

//       // Show character count if maxLength is provided
//       const charCount = maxLength ? (
//         <div className="text-xs text-gray-500 text-right mt-1">
//           {value?.length || 0}/{maxLength}
//         </div>
//       ) : null;

//       if (multiline) {
//         return (
//           <div>
//             <textarea
//               value={value || ""}
//               onChange={(e) => {
//                 if (!maxLength || e.target.value.length <= maxLength) {
//                   handleChange(e);
//                 }
//               }}
//               className={`${baseClasses} p-2 resize-none ${className}`}
//               placeholder={placeholder}
//               rows={3}
//               maxLength={maxLength}
//             />
//             {charCount}
//           </div>
//         );
//       }

//       return (
//         <div>
//           <input
//             type="text"
//             value={value || ""}
//             onChange={(e) => {
//               if (!maxLength || e.target.value.length <= maxLength) {
//                 handleChange(e);
//               }
//             }}
//             className={`${baseClasses} p-1 ${className}`}
//             placeholder={placeholder}
//             maxLength={maxLength}
//           />
//           {charCount}
//         </div>
//       );
//     };
//   }, [updateHeaderField]);

//   const displaygalleryData = isEditing ? tempGalleryState : galleryState;

//   return (
//     <section
//       id="gallery"
//       ref={sectionRef}
//       className={`${displaygalleryData?.images?.length > 0 ? "py-24" : "py-2"
//         } bg-gradient-to-b from-yellow-50/30 via-white to-yellow-50/20 scroll-mt-20 relative`}
//     >
//       {/* Auto-save indicator */}
//       {isEditing && (
//         <motion.div
//           className="absolute top-4 left-4 flex items-center gap-2 text-xs text-gray-500 z-10"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//         >
//           {isSaving ? (
//             <>
//               <Loader2 className="w-3 h-3 animate-spin" />
//               <span>Auto-saving...</span>
//             </>
//           ) : lastSaved ? (
//             <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
//           ) : null}
//         </motion.div>
//       )}

//       {/* Loading Overlay */}
//       {isLoading && (
//         <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-20">
//           <div className="bg-white rounded-lg p-6 shadow-lg flex items-center gap-3">
//             <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
//             <span className="text-gray-700">Loading galleryData...</span>
//           </div>
//         </div>
//       )}

//       {/* Edit Controls */}
//       <div className="absolute top-4 right-4 z-10">
//         {!isEditing ? (
//           <Button
//             onClick={handleEdit}
//             variant="outline"
//             size="sm"
//             className="bg-white hover:bg-gray-50 shadow-md"
//           >
//             <Edit2 className="w-4 h-4 mr-2" />
//             Edit
//           </Button>
//         ) : (
//           <div className="flex gap-2">
//             <Button
//               onClick={handleSave}
//               size="sm"
//               className="bg-green-600 hover:bg-green-700 text-white shadow-md"
//               disabled={isSaving || isUploading}
//             >
//               {isUploading ? (
//                 <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//               ) : isSaving ? (
//                 <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//               ) : (
//                 <Save className="w-4 h-4 mr-2" />
//               )}
//               {isUploading ? "Uploading..." : isSaving ? "Saving..." : "Save"}
//             </Button>
//             <Button
//               onClick={handleCancel}
//               variant="outline"
//               size="sm"
//               className="bg-white hover:bg-gray-50 shadow-md"
//               disabled={isSaving || isUploading}
//             >
//               <X className="w-4 h-4 mr-2" />
//               Cancel
//             </Button>
//           </div>
//         )}
//       </div>

//       <div className="max-w-7xl mx-auto px-6">
//         {/* Section Header */}
//         <div className="text-center mb-16">
//           {displaygalleryData?.images?.length > 0 && (
//             <motion.div
//               initial={{ opacity: 0, scale: 0.8 }}
//               animate={isVisible ? { opacity: 1, scale: 1 } : {}}
//               transition={{ duration: 0.6, ease: "easeOut" }}
//               className="inline-block mb-4"
//             >
//               <Badge className="bg-[#ffeb3b] text-gray-900 px-5 py-2 shadow-md">
//                 Our Gallery
//               </Badge>
//             </motion.div>
//           )}

//           {isEditing ? (
//             <div className="space-y-4">
//               <EditableText
//                 value={displaygalleryData?.heading?.title}
//                 field="title"
//                 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center"
//                 placeholder="Gallery Title"
//                 maxLength={35}
//               />
//               <EditableText
//                 value={displaygalleryData?.heading?.description}
//                 field="description"
//                 multiline={true}
//                 className="text-gray-600 max-w-2xl mx-auto text-lg text-center"
//                 placeholder="Gallery description"
//                 maxLength={100}
//               />
//             </div>
//           ) : (
//             <>
//               <motion.h2
//                 initial={{ opacity: 0, y: 30 }}
//                 animate={isVisible ? { opacity: 1, y: 0 } : {}}
//                 transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
//                 className="text-3xl md:text-4xl font-extrabold text-gray-900"
//               >
//                 {displaygalleryData?.heading?.title}
//               </motion.h2>

//               <motion.p
//                 initial={{ opacity: 0, y: 30 }}
//                 animate={isVisible ? { opacity: 1, y: 0 } : {}}
//                 transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
//                 className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg"
//               >
//                 {displaygalleryData?.heading?.description}
//               </motion.p>
//             </>
//           )}
//         </div>

//         {/* Gallery Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {displaygalleryData?.images?.map((image, index) => (
//             <motion.div
//               key={image.id}
//               initial={{ opacity: 0, y: 50 }}
//               animate={isVisible ? { opacity: 1, y: 0 } : {}}
//               transition={{
//                 delay: 0.5 + index * 0.1,
//                 duration: 0.8,
//                 ease: [0.16, 1, 0.3, 1],
//               }}
//               whileHover={{
//                 y: isEditing ? 0 : -5,
//                 scale: isEditing ? 1 : 1.02,
//               }}
//               className={`overflow-hidden rounded-lg shadow-md cursor-pointer group ${"bg-white"}`}
//               onClick={() => openLightbox(index)}
//             >
//               <div className="relative overflow-hidden">
//                 {image.url ? (
//                   <img
//                     src={image.url}
//                     alt={image.title}
//                     className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110 scale-110"
//                     onError={(e) => {
//                       e.currentTarget.src =
//                         "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&h=600&fit=crop";
//                     }}
//                   />
//                 ) : (
//                   <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
//                     <span className="text-gray-500">No image</span>
//                   </div>
//                 )}

//                 {isEditing && (
//                   <div className="absolute top-2 left-2 z-10 flex flex-col gap-2">
//                     <Button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         fileInputRefs.current[index]?.click();
//                       }}
//                       size="sm"
//                       variant="outline"
//                       className="bg-white/90 backdrop-blur-sm shadow-md"
//                     >
//                       <Upload className="w-4 h-4 mr-2" />
//                       Change
//                     </Button>
//                     <input
//                       ref={(el) => (fileInputRefs.current[index] = el)}
//                       type="file"
//                       accept="image/*"
//                       onChange={(e) => handleImageUpload(index, e)}
//                       className="hidden"
//                     />
//                   </div>
//                 )}

//                 <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-end">
//                   <div className="p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-full">
//                     {isEditing ? (
//                       <>
//                         <div>
//                           <input
//                             value={image.title}
//                             onChange={(e) =>
//                               updateImageField(index, "title", e.target.value)
//                             }
//                             className="font-semibold bg-transparent border-b w-full mb-1 text-white placeholder-gray-300"
//                             placeholder="Image title"
//                             maxLength={35}
//                           />
//                           <div className="text-xs text-gray-300 text-right">
//                             {image.title?.length || 0}/100
//                           </div>
//                         </div>
//                         <div>
//                           <input
//                             value={image.category}
//                             onChange={(e) =>
//                               updateImageField(
//                                 index,
//                                 "category",
//                                 e.target.value
//                               )
//                             }
//                             className="text-sm bg-transparent border-b w-full text-white placeholder-gray-300"
//                             placeholder="Image category"
//                             maxLength={50}
//                           />
//                           <div className="text-xs text-gray-300 text-right">
//                             {image?.category?.length || 0}/50
//                           </div>
//                         </div>
//                         <div>
//                           <textarea
//                             value={image?.description}
//                             onChange={(e) =>
//                               updateImageField(
//                                 index,
//                                 "description",
//                                 e.target.value
//                               )
//                             }
//                             className="text-xs bg-transparent border-b w-full mt-1 text-white placeholder-gray-300 resize-none"
//                             placeholder="Image description"
//                             rows={2}
//                             maxLength={500}
//                           />
//                           <div className="text-xs text-gray-300 text-right">
//                             {image?.description?.length || 0}/500
//                           </div>
//                         </div>
//                       </>
//                     ) : (
//                       <>
//                         <h3 className="font-semibold">{image?.title}</h3>
//                         <p className="text-sm">{image?.category}</p>
//                         <p className="text-xs mt-1 opacity-90">
//                           {image?.description}
//                         </p>
//                       </>
//                     )}
//                   </div>
//                 </div>

//                 {isEditing && (
//                   <Button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       removeImage(index);
//                     }}
//                     size="sm"
//                     variant="outline"
//                     className="absolute top-2 right-2 bg-red-50 hover:bg-red-100 text-red-700"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                   </Button>
//                 )}
//               </div>
//             </motion.div>
//           ))}

//           {/* Add new image button in edit mode */}
//           {displaygalleryData?.images?.length < 6 && isEditing && (
//             <motion.div
//               initial={{ opacity: 0, y: 50 }}
//               animate={isVisible ? { opacity: 1, y: 0 } : {}}
//               transition={{
//                 delay: 0.5 + displaygalleryData?.images?.length * 0.1,
//                 duration: 0.8,
//                 ease: [0.16, 1, 0.3, 1],
//               }}
//               className="rounded-lg flex items-center justify-center border-dashed bg-white border-2 border-gray-300 cursor-pointer h-full min-h-[256px]"
//               onClick={addImage}
//             >
//               <div className="flex flex-col items-center p-6 text-green-600">
//                 <Plus size={32} />
//                 <span className="mt-2">Add Image</span>
//               </div>
//             </motion.div>
//           )}
//         </div>

//         {displaygalleryData?.images?.length >= 6 && isEditing && (
//           <p className="mt-6 w-full border border-gray-200 px-2 py-4 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium">
//             You alredy have 6 image's for adding new image you can edit existing
//             images or remove one then add new!
//           </p>
//         )}
//       </div>

//       {/* Lightbox Modal */}
//       {selectedImage !== null && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="fixed top-[8rem] inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
//         >
//           <button
//             onClick={closeLightbox}
//             className="absolute top-4 right-4 text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 z-10"
//           >
//             <X size={24} />
//           </button>

//           <button
//             onClick={goToPrev}
//             className="absolute left-4 text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 z-10"
//           >
//             <ChevronLeft size={32} />
//           </button>

//           <button
//             onClick={goToNext}
//             className="absolute right-4 text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 z-10"
//           >
//             <ChevronRight size={32} />
//           </button>

//           <div className="max-w-4xl w-full max-h-full">
//             <img
//               src={displaygalleryData?.images[selectedImage].url}
//               alt={displaygalleryData?.images[selectedImage].title}
//               className="w-full h-auto max-h-full object-contain scale-110"
//             />
//             <div className="text-white text-center mt-4">
//               <h3 className="text-xl font-semibold">
//                 {displaygalleryData?.images[selectedImage]?.title}
//               </h3>
//               <p className="text-gray-300">
//                 {displaygalleryData?.images[selectedImage]?.category}
//               </p>
//               <p className="text-gray-400 text-sm mt-2">
//                 {displaygalleryData?.images[selectedImage]?.description}
//               </p>
//             </div>
//           </div>
//         </motion.div>
//       )}

//       {/* Enhanced Crop Modal (same as Header) */}
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
//                 Crop Image
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
//                 <p className="text-sm font-medium text-gray-700 mb-2">
//                   Aspect Ratio:
//                 </p>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => setAspectRatio(1)}
//                     className={`px-3 py-2 text-sm rounded border ${aspectRatio === 1
//                         ? "bg-blue-500 text-white border-blue-500"
//                         : "bg-white text-gray-700 border-gray-300"
//                       }`}
//                   >
//                     1:1 (Square)
//                   </button>
//                   <button
//                     onClick={() => setAspectRatio(4 / 3)}
//                     className={`px-3 py-2 text-sm rounded border ${aspectRatio === 4 / 3
//                         ? "bg-blue-500 text-white border-blue-500"
//                         : "bg-white text-gray-700 border-gray-300"
//                       }`}
//                   >
//                     4:3 (Standard)
//                   </button>
//                   <button
//                     onClick={() => setAspectRatio(16 / 9)}
//                     className={`px-3 py-2 text-sm rounded border ${aspectRatio === 16 / 9
//                         ? "bg-blue-500 text-white border-blue-500"
//                         : "bg-white text-gray-700 border-gray-300"
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
//                   <span className="text-gray-600">{zoom?.toFixed(1)}x</span>
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
//                     <Loader2 className="w-4 h-4 animate-spin mx-auto" />
//                   ) : (
//                     "Apply Crop"
//                   )}
//                 </button>
//               </div>
//             </div>
//           </motion.div>
//         </motion.div>
//       )}
//     </section>
//   );
// }
import {
  Edit2,
  Loader2,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Badge } from "./ui/badge";
import Cropper from "react-easy-crop";

// Custom Button component
const Button = ({
  children,
  onClick,
  variant,
  size,
  className,
  disabled,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    outline: "border border-gray-300 bg-transparent hover:bg-gray-50",
    default: "bg-blue-600 text-white hover:bg-blue-700",
  };
  const sizes = {
    sm: "h-8 px-3 text-sm",
    default: "h-10 px-4",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant] || variants.default} ${sizes[size] || sizes.default
        } ${className || ""}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

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

export default function EditableGallerySection({
  galleryData,
  onStateChange,
  userId,
  publishedId,
  templateSelection,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [pendingImages, setPendingImages] = useState({});

  // Auto-save state
  const [lastSaved, setLastSaved] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Enhanced crop modal state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(4 / 3);
  const [cropIndex, setCropIndex] = useState(null);

  const sectionRef = useRef(null);
  const fileInputRefs = useRef([]);

  // Refs for latest state to avoid closure issues
  const tempGalleryStateRef = useRef(galleryData);
  const pendingImagesRef = useRef({});
  const isEditingRef = useRef(isEditing);

  // Default galleryData structure matching Gallery2.tsx
  const defaultgalleryData = galleryData;

  // Consolidated state
  const [galleryState, setGalleryState] = useState(defaultgalleryData);
  const [tempGalleryState, setTempGalleryState] = useState(defaultgalleryData);

  // Update refs when state changes
  useEffect(() => {
    tempGalleryStateRef.current = tempGalleryState;
    pendingImagesRef.current = pendingImages;
    isEditingRef.current = isEditing;
  }, [tempGalleryState, pendingImages, isEditing]);

  // Notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(galleryState);
    }
  }, [galleryState, onStateChange]);

  // Initialize with galleryData if provided
  useEffect(() => {
    if (galleryData) {
      setGalleryState(galleryData);
      setTempGalleryState(galleryData);
      setDataLoaded(true);
    }
  }, [galleryData]);

  // Intersection Observer for visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Auto-save effect
  useEffect(() => {
    if (isEditing && hasUnsavedChanges) {
      const timeout = setTimeout(() => {
        handleAutoSave();
      }, 2000); // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(timeout);
    }
  }, [tempGalleryState, hasUnsavedChanges, isEditing]);

  // Upload image to AWS S3
  const uploadImageToAWS = async (file, index) => {
    if (!userId || !publishedId || !templateSelection) {
      console.error("Missing required props for image upload");
      toast.error("Missing user information. Please refresh and try again.");
      return null;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("sectionName", "gallery");
      formData.append("imageField", `images[${index}].url-${Date.now()}`);
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
        console.log(`Gallery image ${index} uploaded to S3:`, uploadData.imageUrl);
        return uploadData.imageUrl;
      } else {
        const errorData = await uploadResponse.json();
        console.error("Image upload failed:", errorData);
        toast.error(`Image upload failed: ${errorData.message || "Unknown error"}`);
        return null;
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error uploading image. Please try again.");
      return null;
    }
  };

  // Auto-save function
  const handleAutoSave = async () => {
    if (!isEditingRef.current || !hasUnsavedChanges) return;

    try {
      setIsSaving(true);

      // Upload any pending images first
      let updatedState = { ...tempGalleryStateRef.current };
      const uploadedImages = {};

      for (const [indexStr, file] of Object.entries(pendingImagesRef.current)) {
        const index = parseInt(indexStr);
        const imageUrl = await uploadImageToAWS(file, index);
        
        if (imageUrl) {
          uploadedImages[index] = imageUrl;
          // Update the image in our local copy
          updatedState.images = updatedState.images.map((img, i) =>
            i === index ? { ...img, url: imageUrl } : img
          );
        }
      }

      // Clear pending images that were successfully uploaded
      if (Object.keys(uploadedImages).length > 0) {
        setPendingImages((prev) => {
          const newPending = { ...prev };
          Object.keys(uploadedImages).forEach(id => {
            delete newPending[parseInt(id)];
          });
          return newPending;
        });
      }

      // Update state with any changes and uploaded images
      setGalleryState(updatedState);
      setTempGalleryState(updatedState);
      setLastSaved(new Date());
      setHasUnsavedChanges(false);

      // Show auto-save notification
      toast.info("Changes auto-saved", { 
        autoClose: 1000,
        hideProgressBar: true 
      });

    } catch (error) {
      console.error("Error during auto-save:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setTempGalleryState(galleryState);
    setPendingImages({});
    setHasUnsavedChanges(false);
  };

  // Save function with S3 upload for multiple images
  const handleSave = async () => {
    try {
      setIsUploading(true);
      setIsSaving(true);

      // Upload any remaining pending images
      let updatedState = { ...tempGalleryState };

      for (const [indexStr, file] of Object.entries(pendingImages)) {
        const index = parseInt(indexStr);
        const imageUrl = await uploadImageToAWS(file, index);

        if (imageUrl) {
          updatedState.images = updatedState.images.map((img, i) =>
            i === index ? { ...img, url: imageUrl } : img
          );
        }
      }

      // Clear pending images
      setPendingImages({});

      // Update both states with the new content including S3 URLs
      setGalleryState(updatedState);
      setTempGalleryState(updatedState);

      setIsEditing(false);
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      toast.success("Gallery section saved successfully");
    } catch (error) {
      console.error("Error saving gallery section:", error);
      toast.error("Error saving changes. Please try again.");
    } finally {
      setIsUploading(false);
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTempGalleryState(galleryState);
    setPendingImages({});
    setIsEditing(false);
    setHasUnsavedChanges(false);
  };

  // Update functions for header
  const updateHeaderField = useCallback((field, value) => {
    // Apply character limits for header fields
    let processedValue = value;

    if (field === "title" && value.length > 100) {
      processedValue = value.slice(0, 100);
    } else if (field === "description" && value.length > 200) {
      processedValue = value.slice(0, 200);
    }

    setTempGalleryState((prev) => ({
      ...prev,
      heading: {
        ...prev.heading,
        [field]: processedValue,
      },
    }));
    setHasUnsavedChanges(true);
  }, []);

  // Update functions for images
  const updateImageField = useCallback((index, field, value) => {
    // Apply character limits based on field type
    let processedValue = value;

    if (field === "title" && value.length > 100) {
      processedValue = value.slice(0, 100);
    } else if (field === "category" && value.length > 50) {
      processedValue = value.slice(0, 50);
    } else if (field === "description" && value.length > 500) {
      processedValue = value.slice(0, 500);
    }

    setTempGalleryState((prev) => ({
      ...prev,
      images: prev.images.map((img, i) =>
        i === index ? { ...img, [field]: processedValue } : img
      ),
    }));
    setHasUnsavedChanges(true);
  }, []);

  // Add new image
  const addImage = useCallback(() => {
    setTempGalleryState((prev) => ({
      ...prev,
      images: [
        ...prev.images,
        {
          id: Date.now(),
          url: null,
          title: "New Image",
          category: "Portfolio",
          description: "New image description",
          isPopular: false,
        },
      ],
    }));
    setHasUnsavedChanges(true);
  }, []);

  // Remove image
  const removeImage = useCallback((index) => {
    setTempGalleryState((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));

    // Also remove from pending files if it exists
    setPendingImages((prev) => {
      const newPending = { ...prev };
      delete newPending[index];
      return newPending;
    });
    setHasUnsavedChanges(true);
  }, []);

  // Enhanced cropper functions
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Enhanced image upload handler with crop modal
  const handleImageUpload = useCallback((index, event) => {
    const file = event.target.files?.[0];
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
      setCropIndex(index);
      setCropModalOpen(true);
      setAspectRatio(4 / 3); // Default aspect ratio for gallery images
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
    };
    reader.readAsDataURL(file);

    if (event.target) {
      event.target.value = "";
    }
  }, []);

  // Apply crop function with direct AWS upload
  const applyCrop = async () => {
    try {
      if (!imageToCrop || !croppedAreaPixels) {
        console.error("Please select an area to crop");
        return;
      }

      const { file, previewUrl } = await getCroppedImg(
        imageToCrop,
        croppedAreaPixels,
        rotation
      );

      // Upload cropped image directly to AWS
      setIsUploading(true);
      const imageUrl = await uploadImageToAWS(file, cropIndex);

      if (imageUrl) {
        // Update content with AWS URL directly
        setTempGalleryState((prev) => ({
          ...prev,
          images: prev.images.map((img, i) =>
            i === cropIndex ? { ...img, url: imageUrl } : img
          ),
        }));

        // Also update main state for immediate consistency
        setGalleryState((prev) => ({
          ...prev,
          images: prev.images.map((img, i) =>
            i === cropIndex ? { ...img, url: imageUrl } : img
          ),
        }));

        setHasUnsavedChanges(true);
        toast.success("Image cropped and uploaded successfully");
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

  // Lightbox functions
  const openLightbox = (index) => {
    if (!isEditing) {
      setSelectedImage(index);
    }
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const goToNext = () => {
    if (selectedImage !== null) {
      setSelectedImage((prev) =>
        prev === tempGalleryState.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const goToPrev = () => {
    if (selectedImage !== null) {
      setSelectedImage((prev) =>
        prev === 0 ? tempGalleryState.images.length - 1 : prev - 1
      );
    }
  };

  // Fixed EditableText component without auto-save interference
  const EditableText = useMemo(
    () =>
      ({
        value,
        field,
        multiline = false,
        className = "",
        placeholder = "",
        onChange = null,
        maxLength = null,
      }) => {
        const baseClasses =
          "w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none transition-colors duration-200";

        const handleChange = (e) => {
          let newValue = e.target.value;
          
          // Apply maxLength if specified
          if (maxLength && newValue.length > maxLength) {
            newValue = newValue.slice(0, maxLength);
          }
          
          if (onChange) {
            onChange(e);
          } else {
            updateHeaderField(field, newValue);
          }
        };

        // Show character count if maxLength is provided
        const charCount = maxLength ? (
          <div className="text-xs text-gray-500 text-right mt-1">
            {value?.length || 0}/{maxLength}
          </div>
        ) : null;

        if (multiline) {
          return (
            <div>
              <textarea
                value={value || ""}
                onChange={handleChange}
                className={`${baseClasses} p-2 resize-none ${className}`}
                placeholder={placeholder}
                rows={3}
                maxLength={maxLength || undefined}
              />
              {charCount}
            </div>
          );
        }

        return (
          <div>
            <input
              type="text"
              value={value || ""}
              onChange={handleChange}
              className={`${baseClasses} p-1 ${className}`}
              placeholder={placeholder}
              maxLength={maxLength || undefined}
            />
            {charCount}
          </div>
        );
      },
    [updateHeaderField]
  );

  // Fixed inline input handlers
  const handleInlineInputChange = (index, field, value) => {
    if (field === "title" && value.length > 100) {
      value = value.slice(0, 100);
    } else if (field === "category" && value.length > 50) {
      value = value.slice(0, 50);
    } else if (field === "description" && value.length > 500) {
      value = value.slice(0, 500);
    }

    updateImageField(index, field, value);
  };

  const displaygalleryData = isEditing ? tempGalleryState : galleryState;

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className={`${displaygalleryData?.images?.length > 0 ? "py-24" : "py-2"
        } bg-gradient-to-b from-yellow-50/30 via-white to-yellow-50/20 scroll-mt-20 relative`}
    >
      {/* Auto-save indicator */}
      {isEditing && (
        <motion.div
          className="absolute top-4 left-4 flex items-center gap-2 text-xs text-gray-500 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Auto-saving...</span>
            </>
          ) : lastSaved ? (
            <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
          ) : null}
          {hasUnsavedChanges && !isSaving && (
            <span className="text-amber-500">• Unsaved changes</span>
          )}
        </motion.div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-20">
          <div className="bg-white rounded-lg p-6 shadow-lg flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <span className="text-gray-700">Loading galleryData...</span>
          </div>
        </div>
      )}

      {/* Edit Controls */}
      <div className="absolute top-4 right-4 z-10">
        {!isEditing ? (
          <Button
            onClick={handleEdit}
            variant="outline"
            size="sm"
            className="bg-white hover:bg-gray-50 shadow-md"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white shadow-md"
              disabled={isSaving || isUploading}
            >
              {isUploading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isUploading ? "Uploading..." : isSaving ? "Saving..." : "Save"}
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              size="sm"
              className="bg-white hover:bg-gray-50 shadow-md"
              disabled={isSaving || isUploading}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          {displaygalleryData?.images?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="inline-block mb-4"
            >
              <Badge className="bg-[#ffeb3b] text-gray-900 px-5 py-2 shadow-md">
                Our Gallery
              </Badge>
            </motion.div>
          )}

          {isEditing ? (
            <div className="space-y-4">
              <EditableText
                value={displaygalleryData?.heading?.title}
                field="title"
                className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center"
                placeholder="Gallery Title"
                maxLength={35}
              />
              <EditableText
                value={displaygalleryData?.heading?.description}
                field="description"
                multiline={true}
                className="text-gray-600 max-w-2xl mx-auto text-lg text-center"
                placeholder="Gallery description"
                maxLength={100}
              />
            </div>
          ) : (
            <>
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
                className="text-3xl md:text-4xl font-extrabold text-gray-900"
              >
                {displaygalleryData?.heading?.title}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
                // className="text-gray-600 text-justify mt-4 max-w-2xl mx-auto text-lg"
                className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg"
              >
                {displaygalleryData?.heading?.description}
              </motion.p>
            </>
          )}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displaygalleryData?.images?.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: 0.5 + index * 0.1,
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{
                y: isEditing ? 0 : -5,
                scale: isEditing ? 1 : 1.02,
              }}
              className={`overflow-hidden rounded-lg shadow-md cursor-pointer group ${"bg-white"}`}
              onClick={() => openLightbox(index)}
            >
              <div className="relative overflow-hidden">
                {image.url ? (
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110 scale-110"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&h=600&fit=crop";
                    }}
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No image</span>
                  </div>
                )}

                {isEditing && (
                  <div className="absolute top-2 left-2 z-10 flex flex-col gap-2">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRefs.current[index]?.click();
                      }}
                      size="sm"
                      variant="outline"
                      className="bg-white/90 backdrop-blur-sm shadow-md"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Change
                    </Button>
                    <input
                      ref={(el) => (fileInputRefs.current[index] = el)}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(index, e)}
                      className="hidden"
                    />
                  </div>
                )}

                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-end">
                  <div className="p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-full">
                    {isEditing ? (
                      <>
                        <div>
                          <input
                            value={image.title || ""}
                            onChange={(e) =>
                              handleInlineInputChange(index, "title", e.target.value)
                            }
                            className="font-semibold bg-transparent border-b w-full mb-1 text-white placeholder-gray-300"
                            placeholder="Image title"
                            maxLength={100}
                          />
                          <div className="text-xs text-gray-300 text-right">
                            {image.title?.length || 0}/100
                          </div>
                        </div>
                        <div>
                          <input
                            value={image.category || ""}
                            onChange={(e) =>
                              handleInlineInputChange(index, "category", e.target.value)
                            }
                            className="text-sm bg-transparent border-b w-full text-white placeholder-gray-300"
                            placeholder="Image category"
                            maxLength={50}
                          />
                          <div className="text-xs text-gray-300 text-right">
                            {image.category?.length || 0}/50
                          </div>
                        </div>
                        <div>
                          <textarea
                            value={image.description || ""}
                            onChange={(e) =>
                              handleInlineInputChange(index, "description", e.target.value)
                            }
                            className="text-xs bg-transparent border-b w-full mt-1 text-white placeholder-gray-300 resize-none"
                            placeholder="Image description"
                            rows={2}
                            maxLength={500}
                          />
                          <div className="text-xs text-gray-300 text-right">
                            {image.description?.length || 0}/500
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <h3 className="font-semibold">{image.title}</h3>
                        <p className="text-sm">{image.category}</p>
                        <p className="text-xs mt-1 opacity-90">
                          {image.description}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(index);
                    }}
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2 bg-red-50 hover:bg-red-100 text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </motion.div>
          ))}

          {/* Add new image button in edit mode */}
          {displaygalleryData?.images?.length < 6 && isEditing && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: 0.5 + displaygalleryData?.images?.length * 0.1,
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="rounded-lg flex items-center justify-center border-dashed bg-white border-2 border-gray-300 cursor-pointer h-full min-h-[256px]"
              onClick={addImage}
            >
              <div className="flex flex-col items-center p-6 text-green-600">
                <Plus size={32} />
                <span className="mt-2">Add Image</span>
              </div>
            </motion.div>
          )}
        </div>

        {displaygalleryData?.images?.length >= 6 && isEditing && (
          <p className="mt-6 w-full border border-gray-200 px-2 py-4 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium">
            You alredy have 6 image's for adding new image you can edit existing
            images or remove one then add new!
          </p>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed top-[8rem] inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 z-10"
          >
            <X size={24} />
          </button>

          <button
            onClick={goToPrev}
            className="absolute left-4 text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 z-10"
          >
            <ChevronLeft size={32} />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 z-10"
          >
            <ChevronRight size={32} />
          </button>

          <div className="max-w-4xl w-full max-h-full">
            <img
              src={displaygalleryData?.images[selectedImage].url}
              alt={displaygalleryData?.images[selectedImage].title}
              className="w-full h-auto max-h-full object-contain scale-110"
            />
            <div className="text-white text-center mt-4">
              <h3 className="text-xl font-semibold">
                {displaygalleryData?.images[selectedImage]?.title}
              </h3>
              <p className="text-gray-300">
                {displaygalleryData?.images[selectedImage]?.category}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                {displaygalleryData?.images[selectedImage]?.description}
              </p>
            </div>
          </div>
        </motion.div>
      )}

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
                Crop Image
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
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Aspect Ratio:
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setAspectRatio(1)}
                    className={`px-3 py-2 text-sm rounded border ${aspectRatio === 1
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-700 border-gray-300"
                      }`}
                  >
                    1:1 (Square)
                  </button>
                  <button
                    onClick={() => setAspectRatio(4 / 3)}
                    className={`px-3 py-2 text-sm rounded border ${aspectRatio === 4 / 3
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-700 border-gray-300"
                      }`}
                  >
                    4:3 (Standard)
                  </button>
                  <button
                    onClick={() => setAspectRatio(16 / 9)}
                    className={`px-3 py-2 text-sm rounded border ${aspectRatio === 16 / 9
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
                  <span className="text-gray-700">Zoom</span>
                  <span className="text-gray-600">{zoom?.toFixed(1)}x</span>
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
                  disabled={isUploading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white rounded py-2 text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
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
    </section>
  );
}