
// import { Button } from "./ui/button";
// import {
//   Menu,
//   X,
//   Edit2,
//   Save,
//   Upload,
//   X as XIcon,
//   RotateCw,
//   ZoomIn,
//   Loader2,
// } from "lucide-react";
// import { useState, useEffect, useRef, useCallback } from "react";
// import { motion, AnimatePresence } from "motion/react";
// import { ThemeToggle } from "./ThemeToggle";
// import { useTheme } from "./ThemeProvider";
// import logo from "/images/Drone tv .in.jpg";
// import { toast } from "react-toastify";
// import Cropper from "react-easy-crop";

// export default function Header({
//   headerData,
//   onStateChange,
//   userId,
//   publishedId,
//   templateSelection,
// }) {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const { theme } = useTheme();
//   // classes used when editing: ensure text is white in dark mode, black in light mode
//   const editInputClasses =
//     theme === "dark" ? "text-white border-white" : "text-black border-gray-800";
//   const ctaButtonThemeClasses =
//     theme === "dark"
//       ? "bg-yellow-400 border border-white text-white hover:bg-white/10"
//       : "bg-yellow-400 border border-gray-200 text-black hover:bg-white/10";
//   const [isEditing, setIsEditing] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement | null>(null);
//   const logoImgRef = useRef<HTMLImageElement | null>(null);

//   // Track initial state to detect changes
//   const initialHeaderState = useRef(null);

//   // Logo dimensions state - FIXED: Smaller default size
//   const [logoDimensions, setLogoDimensions] = useState({ width: 50, height: 50 });

//   // Aspect ratio selection state
//   const [selectedAspectRatio, setSelectedAspectRatio] = useState("original"); // "original", "1:1", "16:9"

//   const [content, setContent] = useState(() => {
//     const initialState = {
//       logoUrl: headerData?.logo || logo,
//       companyName: headerData?.name || "Company",
//       navItems: [
//         { id: 1, label: "Home", href: "#home", color: "primary" },
//         { id: 2, label: "About", href: "#about", color: "primary" },
//         { id: 3, label: "Our Team", href: "#our-team", color: "primary" },
//         { id: 4, label: "Product", href: "#product", color: "primary" },
//         { id: 5, label: "Services", href: "#services", color: "red-accent" },
//         { id: 6, label: "Gallery", href: "#gallery", color: "primary" },
//         { id: 7, label: "Blog", href: "#blog", color: "primary" },
//         { id: 8, label: "Testimonial", href: "#testimonial", color: "primary" },
//         { id: 9, label: "Clients", href: "#clients", color: "primary" },
//       ],
//       ctaText: "Get Started",
//     };
//     initialHeaderState.current = initialState;
//     return initialState;
//   });

//   // Auto-save timeout reference
//   const autoSaveTimeoutRef = useRef(null);

//   // choose container width based on companyName length (adjust threshold as needed)
//   const containerMaxClass =
//     (content?.companyName || "").trim().length > 30 /* threshold */
//       ? "min-w-[1270px]"
//       : "max-w-7xl";

//   // Cropping states - ENHANCED WITH ADVANCED LOGIC
//   const [showCropper, setShowCropper] = useState(false);
//   const [crop, setCrop] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);
//   const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
//   const [imageToCrop, setImageToCrop] = useState(null);
//   const [originalFile, setOriginalFile] = useState(null);
//   const [mediaSize, setMediaSize] = useState<{ width: number; height: number; naturalWidth: number; naturalHeight: number } | null>(null);
//   const [cropAreaSize, setCropAreaSize] = useState<{ width: number; height: number } | null>(null);
//   const [minZoomDynamic, setMinZoomDynamic] = useState(0.1);
//   const [isDragging, setIsDragging] = useState(false);
//   const PAN_STEP = 10;

//   // Load logo dimensions when logo URL changes - FIXED: Smaller max size
//   useEffect(() => {
//     if (content.logoUrl && (content.logoUrl.startsWith("data:") || content.logoUrl.startsWith("http"))) {
//       const img = new Image();
//       img.onload = () => {
//         // Calculate dimensions while maintaining aspect ratio - REDUCED MAX SIZE
//         const maxSize = 77; // Reduced from 80 to 60 to prevent overflow
//         let width = img.naturalWidth;
//         let height = img.naturalHeight;

//         // Maintain aspect ratio while fitting within maxSize
//         if (width > height) {
//           height = (height / width) * maxSize;
//           width = maxSize;
//         } else {
//           width = (width / height) * maxSize;
//           height = maxSize;
//         }

//         // Ensure minimum size
//         const minSize = 25; // Reduced from 30 to 25
//         if (width < minSize) {
//           height = (height / width) * minSize;
//           width = minSize;
//         }
//         if (height < minSize) {
//           width = (width / height) * minSize;
//           height = minSize;
//         }

//         // Additional constraint: Ensure height doesn't exceed header height
//         const maxHeaderHeight = 45; // Header height is 64px (h-16), so 45px is safe
//         if (height > maxHeaderHeight) {
//           width = (width / height) * maxHeaderHeight;
//           height = maxHeaderHeight;
//         }

//         setLogoDimensions({
//           width: Math.round(width),
//           height: Math.round(height)
//         });
//       };
//       img.src = content.logoUrl;
//     } else {
//       // Reset to default size for text logos
//       setLogoDimensions({ width: 50, height: 50 });
//     }
//   }, [content.logoUrl]);

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

//   // Notify parent of state changes
//   useEffect(() => {
//     if (onStateChange) {
//       onStateChange(content);
//     }
//   }, [content, onStateChange]);

//   const updateContent = (field: string, value: string) => {
//     setContent((prev) => ({ ...prev, [field]: value }));
//   };

//   // Auto-save function for text changes
//   const autoSaveChanges = useCallback(async () => {
//     if (!isEditing) return;

//     setIsSaving(true);
//     try {
//       // Simulate API call or state persistence
//       await new Promise(resolve => setTimeout(resolve, 500));

//       // Update initial state reference to current state
//       initialHeaderState.current = content;

//       toast.success("Changes saved automatically!");
//     } catch (error) {
//       console.error("Auto-save failed:", error);
//       toast.error("Auto-save failed. Please try again.");
//     } finally {
//       setIsSaving(false);
//     }
//   }, [isEditing, content]);

//   // Effect to trigger auto-save when text content changes
//   useEffect(() => {
//     if (isEditing) {
//       // Clear existing timeout
//       if (autoSaveTimeoutRef.current) {
//         clearTimeout(autoSaveTimeoutRef.current);
//       }

//       // Set new timeout for auto-save (1 second delay)
//       autoSaveTimeoutRef.current = setTimeout(() => {
//         autoSaveChanges();
//       }, 1000);
//     }

//     return () => {
//       if (autoSaveTimeoutRef.current) {
//         clearTimeout(autoSaveTimeoutRef.current);
//       }
//     };
//   }, [content.ctaText, content.companyName, isEditing, autoSaveChanges]);

//   // NEW: Function to upload image to AWS
//   const uploadImageToAWS = async (file, imageField) => {
//     if (!userId || !publishedId || !templateSelection) {
//       console.error("Missing required props:", {
//         userId,
//         publishedId,
//         templateSelection,
//       });
//       toast.error("Missing user information. Please refresh and try again.");
//       return null;
//     }

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("sectionName", "header");
//     formData.append("imageField", `${imageField}_${Date.now()}`);
//     formData.append("templateSelection", templateSelection);

//     console.log(`Uploading ${imageField} to S3:`, file);

//     try {
//       const uploadResponse = await fetch(
//         `https://o66ziwsye5.execute-api.ap-south-1.amazonaws.com/prod/upload-image/${userId}/${publishedId}`,
//         {
//           method: "POST",
//           body: formData,
//         }
//       );

//       if (uploadResponse.ok) {
//         const uploadData = await uploadResponse.json();
//         console.log(`${imageField} uploaded to S3:`, uploadData.imageUrl);
//         return uploadData.imageUrl;
//       } else {
//         const errorData = await uploadResponse.json();
//         console.error(`${imageField} upload failed:`, errorData);
//         toast.error(
//           `${imageField} upload failed: ${errorData.message || "Unknown error"}`
//         );
//         return null;
//       }
//     } catch (error) {
//       console.error(`Error uploading ${imageField}:`, error);
//       toast.error(`Error uploading image. Please try again.`);
//       return null;
//     }
//   };

//   // Handle cancel editing
//   const handleCancel = () => {
//     // Reset to initial state
//     setContent(initialHeaderState.current);
//     setIsEditing(false);
//   };

//   // Logo cropping functionality - UPDATED WITH ADVANCED LOGIC
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
//       setZoom(1);
//       setCrop({ x: 0, y: 0 });
//       // Reset to original aspect ratio when new image is loaded
//       setSelectedAspectRatio("original");
//     };
//     reader.readAsDataURL(file);

//     e.target.value = "";
//   };

//   // Get aspect ratio value based on selection
//   const getAspectRatio = () => {
//     switch (selectedAspectRatio) {
//       case "1:1":
//         return 1;
//       case "16:9":
//         return 16 / 9;
//       case "original":
//       default:
//         return logoDimensions.width / logoDimensions.height;
//     }
//   };

//   // Get display text for aspect ratio
//   const getAspectRatioText = () => {
//     switch (selectedAspectRatio) {
//       case "1:1":
//         return "1:1";
//       case "16:9":
//         return "16:9";
//       case "original":
//       default:
//         return `${logoDimensions.width}:${logoDimensions.height}`;
//     }
//   };

//   // Cropper functions - FROM ADVANCED LOGIC
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

//   // Function to get cropped image - UPDATED WITH PROPER DIMENSIONS TO PREVENT OVERFLOW
//   const getCroppedImg = async (imageSrc, pixelCrop) => {
//     const image = await createImage(imageSrc);
//     const canvas = document.createElement("canvas");
//     const ctx = canvas.getContext("2d");

//     // Calculate output dimensions based on selected aspect ratio
//     let outputWidth, outputHeight;
//     let displayWidth, displayHeight; // For header display

//     switch (selectedAspectRatio) {
//       case "1:1":
//         // Square - use smaller dimensions for header display
//         outputWidth = 200;
//         outputHeight = 200;
//         displayWidth = 45;  // Reduced from 50 to 45 to prevent overflow
//         displayHeight = 45; // Reduced from 50 to 45 to prevent overflow
//         break;
//       case "16:9":
//         // Landscape - 16:9 ratio with reduced height
//         outputWidth = 320;
//         outputHeight = 180;
//         displayWidth = 55;  // Reduced from 60 to 55
//         displayHeight = 31; // Reduced from 34 to 31 (55 * 9/16)
//         break;
//       case "original":
//       default:
//         // Use original logo dimensions with header constraints
//         const maxHeaderSize = 45; // Maximum size to fit in header
//         outputWidth = logoDimensions.width > 200 ? 200 : logoDimensions.width;
//         outputHeight = logoDimensions.height > 200 ? 200 : logoDimensions.height;

//         // Ensure display dimensions don't overflow header
//         if (logoDimensions.width > maxHeaderSize || logoDimensions.height > maxHeaderSize) {
//           if (logoDimensions.width > logoDimensions.height) {
//             displayWidth = maxHeaderSize;
//             displayHeight = (logoDimensions.height / logoDimensions.width) * maxHeaderSize;
//           } else {
//             displayHeight = maxHeaderSize;
//             displayWidth = (logoDimensions.width / logoDimensions.height) * maxHeaderSize;
//           }
//         } else {
//           displayWidth = logoDimensions.width;
//           displayHeight = logoDimensions.height;
//         }
//         break;
//     }

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
//           const pngName = originalFile
//             ? `cropped-logo-${originalFile.name.replace(/\.[^.]+$/, "")}.png`
//             : `cropped-logo-${Date.now()}.png`;

//           const file = new File([blob], pngName, {
//             type: "image/png",
//             lastModified: Date.now(),
//           });

//           const previewUrl = URL.createObjectURL(blob);

//           resolve({
//             file,
//             previewUrl,
//             dimensions: {
//               width: Math.round(displayWidth),  // Use display dimensions for header
//               height: Math.round(displayHeight) // Use display dimensions for header
//             }
//           });
//         },
//         "image/png"
//       );
//     });
//   };

//   // Apply crop and UPLOAD IMMEDIATELY to AWS - UPDATED WITH AUTO-SAVE
//   const applyCrop = async () => {
//     try {
//       if (!imageToCrop || !croppedAreaPixels) {
//         toast.error("Please select an area to crop");
//         return;
//       }

//       setIsUploading(true);

//       const { file, previewUrl, dimensions } = await getCroppedImg(
//         imageToCrop,
//         croppedAreaPixels
//       );

//       // Update logo dimensions with display dimensions
//       setLogoDimensions(dimensions);

//       // Show preview immediately with blob URL (temporary)
//       setContent((prev) => ({ ...prev, logoUrl: previewUrl }));

//       // AUTO UPLOAD TO AWS IMMEDIATELY
//       const awsImageUrl = await uploadImageToAWS(file, "logoUrl");

//       if (awsImageUrl) {
//         // Update with actual S3 URL and trigger auto-save
//         setContent((prev) => ({ ...prev, logoUrl: awsImageUrl }));
//         toast.success("Logo cropped and uploaded to AWS successfully!");

//         // Auto-save the changes
//         if (isEditing) {
//           setIsSaving(true);
//           try {
//             await new Promise(resolve => setTimeout(resolve, 500));
//             initialHeaderState.current = { ...content, logoUrl: awsImageUrl };
//             toast.success("Logo updated automatically!");
//           } catch (error) {
//             console.error("Auto-save failed:", error);
//             toast.error("Auto-save failed. Please try again.");
//           } finally {
//             setIsSaving(false);
//           }
//         }
//       } else {
//         // If upload fails, keep the preview URL
//         toast.warning("Logo cropped but AWS upload failed. Using local version.");

//         // Still auto-save with local URL
//         if (isEditing) {
//           setIsSaving(true);
//           try {
//             await new Promise(resolve => setTimeout(resolve, 500));
//             initialHeaderState.current = { ...content, logoUrl: previewUrl };
//             toast.success("Logo updated with local version!");
//           } catch (error) {
//             console.error("Auto-save failed:", error);
//             toast.error("Auto-save failed. Please try again.");
//           } finally {
//             setIsSaving(false);
//           }
//         }
//       }

//       setShowCropper(false);
//       setImageToCrop(null);
//       setOriginalFile(null);
//     } catch (error) {
//       console.error("Error cropping logo:", error);
//       toast.error("Error cropping logo. Please try again.");
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   // Cancel cropping - UPDATED
//   const cancelCrop = () => {
//     setShowCropper(false);
//     setImageToCrop(null);
//     setOriginalFile(null);
//     setCrop({ x: 0, y: 0 });
//     setZoom(1);
//   };

//   // Reset zoom and rotation - UPDATED
//   const resetCropSettings = () => {
//     setZoom(1);
//     setCrop({ x: 0, y: 0 });
//   };

//   // Save button handler - now only for manual saving if needed
//   const handleSave = async () => {
//     try {
//       setIsUploading(true);

//       // Update initial state reference to current state
//       initialHeaderState.current = content;

//       // Exit edit mode
//       setIsEditing(false);
//       toast.success("Header section saved!");
//     } catch (error) {
//       console.error("Error saving header section:", error);
//       toast.error("Error saving changes. Please try again.");
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const menuVariants = {
//     closed: { opacity: 0, height: 0, transition: { duration: 0.3 } },
//     open: {
//       opacity: 1,
//       height: "auto",
//       transition: { duration: 0.3, staggerChildren: 0.1, delayChildren: 0.1 },
//     },
//   };

//   const itemVariants = {
//     closed: { opacity: 0, x: -20 },
//     open: { opacity: 1, x: 0 },
//   };

//   return (
//     <>
//       {/* Updated Cropping Modal - ENHANCED WITH ASPECT RATIO OPTIONS */}
//       {showCropper && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="fixed inset-0 bg-black/90 z-[99999999] flex items-center justify-center p-4"
//         >
//           <motion.div
//             initial={{ scale: 0.9, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             className="bg-white rounded-xl max-w-4xl w-full h-[80vh] flex flex-col"
//           >
//             {/* Header */}
//             <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
//               <h3 className="text-lg font-semibold text-gray-800">
//                 Crop Logo ({getAspectRatioText()} Ratio)
//               </h3>
//               <button
//                 onClick={cancelCrop}
//                 className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
//               >
//                 <XIcon className="w-5 h-5 text-gray-600" />
//               </button>
//             </div>

//             {/* Aspect Ratio Selection */}
//             <div className="p-4 border-b border-gray-200 bg-white">
//               <div className="flex flex-wrap gap-2">
//                 <span className="text-sm font-medium text-gray-700 mr-2">Aspect Ratio:</span>
//                 <button
//                   onClick={() => setSelectedAspectRatio("original")}
//                   className={`px-3 py-1 text-sm rounded border ${selectedAspectRatio === "original"
//                     ? "bg-blue-500 text-white border-blue-500"
//                     : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
//                     }`}
//                 >
//                   Original
//                 </button>
//                 <button
//                   onClick={() => setSelectedAspectRatio("1:1")}
//                   className={`px-3 py-1 text-sm rounded border ${selectedAspectRatio === "1:1"
//                     ? "bg-blue-500 text-white border-blue-500"
//                     : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
//                     }`}
//                 >
//                   1:1 (Square)
//                 </button>
//                 <button
//                   onClick={() => setSelectedAspectRatio("16:9")}
//                   className={`px-3 py-1 text-sm rounded border ${selectedAspectRatio === "16:9"
//                     ? "bg-blue-500 text-white border-blue-500"
//                     : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
//                     }`}
//                 >
//                   16:9 (Landscape)
//                 </button>
//               </div>
//             </div>

//             {/* Cropper Area */}
//             <div className={`flex-1 relative bg-gray-900 min-h-0 ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}>
//               <Cropper
//                 image={imageToCrop}
//                 crop={crop}
//                 zoom={zoom}
//                 aspect={getAspectRatio()} // Dynamic aspect ratio based on selection
//                 minZoom={minZoomDynamic}
//                 maxZoom={5}
//                 restrictPosition={false}
//                 zoomWithScroll={true}
//                 zoomSpeed={0.2}
//                 onCropChange={setCrop}
//                 onZoomChange={setZoom}
//                 onCropComplete={onCropComplete}
//                 onMediaLoaded={(ms) => setMediaSize(ms)}
//                 onCropAreaChange={(area, areaPixels) => setCropAreaSize(area)}
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
//               {/* Zoom Control */}
//               <div className="space-y-2 mb-4">
//                 <div className="flex items-center justify-between text-sm">
//                   <span className="flex items-center gap-2 text-gray-700">
//                     Zoom
//                   </span>
//                   <span className="text-gray-600">{zoom.toFixed(1)}x</span>
//                 </div>
//                 <input
//                   type="range"
//                   value={zoom}
//                   min={minZoomDynamic}
//                   max={5}
//                   step={0.1}
//                   onChange={(e) => setZoom(Number(e.target.value))}
//                   className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
//                 />
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
//                   className={`w-full ${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white rounded py-2 text-sm font-medium`}
//                 >
//                   {isUploading ? "Uploading..." : "Apply Crop"}
//                 </button>
//               </div>
//             </div>
//           </motion.div>
//         </motion.div>
//       )}

//       {/* Auto-save indicator */}
//       {isSaving && (
//         <div className="fixed top-20 right-4 z-[99999999]">
//           <div className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg shadow-lg text-sm">
//             <Loader2 size={16} className="animate-spin" />
//             Auto-saving...
//           </div>
//         </div>
//       )}

//       {/* === Updated header with proper spacing === */}
//       <motion.header
//         className={`fixed top-[4rem] left-0 right-0 border-b z-50  ${theme === "dark"
//           ? "bg-gray-800 border-gray-700 text-gray-300"
//           : "bg-white border-gray-200"
//           }`}
//         initial={{ y: -100 }}
//         animate={{ y: 0 }}
//         transition={{ duration: 0.6, ease: "easeOut" }}
//       >
//         <div
//           className={`px-4 mx-auto lg:min-w-[1180px] ${containerMaxClass} sm:px-6 lg:px-16`}
//         >
//           <div className="flex items-center justify-between h-16">
//             {/* Logo + Company - keep space and long company names */}
//             <div className="flex items-center flex-shrink-0 min-w-0 mr-6 lg:mr-10">
//               {/* Removed rotation animation from logo container */}
//               <div className="relative flex items-center justify-center flex-shrink-0 mr-2 overflow-hidden rounded-lg bg-transparent group">
//                 {isEditing ? (
//                   <div className="relative">
//                     {content.logoUrl &&
//                       (content.logoUrl.startsWith("data:") ||
//                         content.logoUrl.startsWith("http")) ? (
//                       <img
//                         ref={logoImgRef}
//                         src={content.logoUrl || logo}
//                         alt="Logo"
//                         style={{
//                           width: `${logoDimensions.width}px`,
//                           height: `${logoDimensions.height}px`,
//                           maxHeight: '45px', // Added max height constraint
//                         }}
//                         className="bg-transparent cursor-pointer group-hover:scale-110 transition-all duration-300 rounded-xl object-contain"
//                       />
//                     ) : (
//                       <span
//                         className="text-lg font-bold text-black"
//                         style={{
//                           width: `${logoDimensions.width}px`,
//                           height: `${logoDimensions.height}px`,
//                           display: 'flex',
//                           alignItems: 'center',
//                           justifyContent: 'center',
//                           maxHeight: '45px', // Added max height constraint
//                         }}
//                       >
//                         {content.logoUrl}
//                       </span>
//                     )}
//                     <div className="absolute inset-0 flex items-center justify-center transition-opacity bg-black bg-opacity-50 opacity-0 hover:opacity-100">
//                       <button
//                         onClick={() => fileInputRef.current?.click()}
//                         className="p-1 text-xs text-white bg-blue-500 rounded"
//                       >
//                         <Upload size={12} />
//                       </button>
//                     </div>
//                   </div>
//                 ) : (
//                   <div>
//                     {content.logoUrl &&
//                       (content.logoUrl.startsWith("data:") ||
//                         content.logoUrl.startsWith("http")) ? (
//                       <img
//                         ref={logoImgRef}
//                         src={content.logoUrl || logo}
//                         alt="Logo"
//                         style={{
//                           width: `${logoDimensions.width}px`,
//                           height: `${logoDimensions.height}px`,
//                           maxHeight: '45px', // Added max height constraint
//                         }}
//                         className="cursor-pointer group-hover:scale-110 transition-all duration-300 rounded-xl object-contain"
//                       />
//                     ) : (
//                       <span
//                         className="text-lg font-bold text-black"
//                         style={{
//                           width: `${logoDimensions.width}px`,
//                           height: `${logoDimensions.height}px`,
//                           display: 'flex',
//                           alignItems: 'center',
//                           justifyContent: 'center',
//                           maxHeight: '45px', // Added max height constraint
//                         }}
//                       >
//                         {content.logoUrl}
//                       </span>
//                     )}
//                   </div>
//                 )}
//                 <input
//                   type="file"
//                   ref={fileInputRef}
//                   accept="image/*"
//                   onChange={handleLogoUpload}
//                   className="hidden font-bold"
//                 />
//               </div>
//             </div>

//             {/* Desktop Nav - Centered with proper spacing */}
//             <nav className="items-center justify-center flex-1 hidden mx-4 lg:flex min-w-0">
//               <div className="flex items-center justify-center space-x-3">
//                 {content.navItems.map((item) => (
//                   <motion.a
//                     key={item.id}
//                     href={item.href}
//                     className={`font-medium relative group whitespace-nowrap ${theme === "dark"
//                       ? "text-gray-300 hover:text-gray-200"
//                       : "text-gray-700 hover:text-primary"
//                       }`}
//                     whileHover={{ y: -2 }}
//                   >
//                     {item.label}
//                     <motion.span
//                       className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-${item.color} transition-all group-hover:w-full`}
//                       transition={{ duration: 0.3 }}
//                     />
//                   </motion.a>
//                 ))}
//               </div>
//             </nav>

//             {/* Right side - Fixed width to prevent shifting */}
//             <div className="flex items-center flex-shrink-0 space-x-1">
//               {isEditing ? (
//                 <input
//                   type="text"
//                   value={content.ctaText}
//                   onChange={(e) => updateContent("ctaText", e.target.value)}
//                   className={`bg-white border px-3 py-1 rounded font-medium outline-none max-w-[120px] ${editInputClasses}`}
//                 />
//               ) : (
//                 <div className="hidden md:flex">
//                   <Button
//                     className={`${ctaButtonThemeClasses} transition-all duration-300 shadow-lg whitespace-nowrap`}
//                   >
//                     <a
//                       href="#contact"
//                       className={theme === "dark" ? "text-white" : "text-black"}
//                     >
//                       {content.ctaText}
//                     </a>
//                   </Button>
//                 </div>
//               )}

//               <ThemeToggle />

//               {/* Edit/Save Buttons */}
//               <div className="flex gap-2">
//                 {isEditing ? (
//                   <>
//                     <motion.button
//                       whileTap={{ scale: 0.9 }}
//                       whileHover={{ y: -1, scaleX: 1.05 }}
//                       onClick={handleCancel}
//                       className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded shadow-xl hover:font-semibold whitespace-nowrap"
//                     >
//                       Cancel
//                     </motion.button>
//                     <motion.button
//                       whileTap={{ scale: 0.9 }}
//                       whileHover={{ y: -1, scaleX: 1.1 }}
//                       onClick={handleSave}
//                       disabled={isUploading || isSaving}
//                       className={`${isUploading || isSaving
//                         ? "bg-gray-400 cursor-not-allowed"
//                         : "bg-green-600 hover:font-semibold"
//                         } text-white px-4 py-2 rounded cursor-pointer hover:shadow-2xl shadow-xl whitespace-nowrap`}
//                     >
//                       {isUploading || isSaving ? (
//                         "Saving..."
//                       ) : (
//                         <>
//                           <Save size={16} className="inline mr-1" /> Save
//                         </>
//                       )}
//                     </motion.button>
//                   </>
//                 ) : (
//                   <motion.button
//                     whileTap={{ scale: 0.9 }}
//                     whileHover={{ y: -1, scaleX: 1.1 }}
//                     onClick={() => setIsEditing(true)}
//                     className="px-4 py-2 text-black bg-yellow-500 rounded shadow-xl cursor-pointer hover:shadow-2xl hover:font-semibold whitespace-nowrap"
//                   >
//                     Edit
//                   </motion.button>
//                 )}
//               </div>
//             </div>

//             {/* Mobile menu button */}
//             <motion.div className="flex-shrink-0 lg:hidden">
//               <motion.button
//                 onClick={() => setIsMenuOpen(!isMenuOpen)}
//                 className={`hover:text-primary transition-colors p-2 ${theme === "dark"
//                   ? "text-gray-300 hover:text-gray-200"
//                   : "text-gray-700 hover:text-primary"
//                   }`}
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//                 animate={{ rotate: isMenuOpen ? 180 : 0 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <AnimatePresence mode="wait">
//                   {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
//                 </AnimatePresence>
//               </motion.button>
//             </motion.div>
//           </div>

//           {/* Mobile Nav */}
//           <AnimatePresence>
//             {isMenuOpen && (
//               <motion.div
//                 className={`lg:hidden border-t border-gray-200 overflow-hidden ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white"
//                   }`}
//                 variants={menuVariants}
//                 initial="closed"
//                 animate="open"
//                 exit="closed"
//               >
//                 <motion.nav className="flex flex-col py-4 space-y-4">
//                   {content.navItems.map((item, index) => (
//                     <motion.a
//                       key={item.id}
//                       href={item.href}
//                       className={`hover:text-${item.color
//                         } transition-colors py-2 px-4 rounded-lg hover:bg-${item.color
//                         }/10 cursor-pointer ${theme === "dark" ? "text-white" : "text-black"
//                         }`}
//                       variants={itemVariants}
//                       whileHover={{ x: 10, scale: 1.02 }}
//                       onClick={() => setIsMenuOpen(false)}
//                     >
//                       {item.label}
//                     </motion.a>
//                   ))}
//                   <Button
//                     className={`${ctaButtonThemeClasses} w-full mt-4 shadow-lg`}
//                   >
//                     {content.ctaText}
//                   </Button>
//                 </motion.nav>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       </motion.header>
//     </>
//   );
// }

import { Button } from "./ui/button";
import {
  Menu,
  X,
  Edit2,
  Save,
  Upload,
  X as XIcon,
  RotateCw,
  ZoomIn,
  Loader2,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "./ThemeProvider";
import logo from "/images/Drone tv .in.jpg";
import { toast } from "react-toastify";
import Cropper from "react-easy-crop";

export default function Header({
  headerData,
  onStateChange,
  userId,
  publishedId,
  templateSelection,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme } = useTheme();
  // classes used when editing: ensure text is white in dark mode, black in light mode
  const editInputClasses =
    theme === "dark" ? "text-white border-white" : "text-black border-gray-800";
  const ctaButtonThemeClasses =
    theme === "dark"
      ? "bg-yellow-400 border border-white text-white hover:bg-white/10"
      : "bg-yellow-400 border border-gray-200 text-black hover:bg-white/10";
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const logoImgRef = useRef<HTMLImageElement | null>(null);

  // Track initial state to detect changes
  const initialHeaderState = useRef(null);

  // Logo dimensions state - FIXED: 77px width, 45px height
  const [logoDimensions, setLogoDimensions] = useState({ width: 77, height: 45 });

  // Aspect ratio selection state
  const [selectedAspectRatio, setSelectedAspectRatio] = useState("original"); // "original", "1:1", "16:9"

  const [content, setContent] = useState(() => {
    const initialState = {
      logoUrl: headerData?.logo || logo,
      companyName: headerData?.name || "Company",
      navItems: [
        { id: 1, label: "Home", href: "#home", color: "primary" },
        { id: 2, label: "About", href: "#about", color: "primary" },
        { id: 3, label: "Our Team", href: "#our-team", color: "primary" },
        { id: 4, label: "Product", href: "#product", color: "primary" },
        { id: 5, label: "Services", href: "#services", color: "red-accent" },
        { id: 6, label: "Gallery", href: "#gallery", color: "primary" },
        { id: 7, label: "Blog", href: "#blog", color: "primary" },
        { id: 8, label: "Testimonial", href: "#testimonial", color: "primary" },
        { id: 9, label: "Clients", href: "#clients", color: "primary" },
      ],
      ctaText: "Get Started",
    };
    initialHeaderState.current = initialState;
    return initialState;
  });

  // Auto-save timeout reference
  const autoSaveTimeoutRef = useRef(null);

  // choose container width based on companyName length (adjust threshold as needed)
  const containerMaxClass =
    (content?.companyName || "").trim().length > 30 /* threshold */
      ? "min-w-[1270px]"
      : "max-w-7xl";

  // Cropping states - ENHANCED WITH ADVANCED LOGIC
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [mediaSize, setMediaSize] = useState<{ width: number; height: number; naturalWidth: number; naturalHeight: number } | null>(null);
  const [cropAreaSize, setCropAreaSize] = useState<{ width: number; height: number } | null>(null);
  const [minZoomDynamic, setMinZoomDynamic] = useState(0.1);
  const [isDragging, setIsDragging] = useState(false);
  const PAN_STEP = 10;

  // Fixed logo dimensions - always 77x45
  useEffect(() => {
    setLogoDimensions({ width: 77, height: 45 });
  }, [content.logoUrl]);

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

  // Notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(content);
    }
  }, [content, onStateChange]);

  const updateContent = (field: string, value: string) => {
    setContent((prev) => ({ ...prev, [field]: value }));
  };

  // Auto-save function for text changes
  const autoSaveChanges = useCallback(async () => {
    if (!isEditing) return;

    setIsSaving(true);
    try {
      // Simulate API call or state persistence
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update initial state reference to current state
      initialHeaderState.current = content;

      toast.success("Changes saved automatically!");
    } catch (error) {
      console.error("Auto-save failed:", error);
      toast.error("Auto-save failed. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }, [isEditing, content]);

  // Effect to trigger auto-save when text content changes
  useEffect(() => {
    if (isEditing) {
      // Clear existing timeout
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      // Set new timeout for auto-save (1 second delay)
      autoSaveTimeoutRef.current = setTimeout(() => {
        autoSaveChanges();
      }, 1000);
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [content.ctaText, content.companyName, isEditing, autoSaveChanges]);

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
    formData.append("sectionName", "header");
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

  // Handle cancel editing
  const handleCancel = () => {
    // Reset to initial state
    setContent(initialHeaderState.current);
    setIsEditing(false);
  };

  // Logo cropping functionality - UPDATED WITH ADVANCED LOGIC
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
      setZoom(1);
      setCrop({ x: 0, y: 0 });
      // Reset to original aspect ratio when new image is loaded
      setSelectedAspectRatio("original");
    };
    reader.readAsDataURL(file);

    e.target.value = "";
  };

  // Get aspect ratio value based on selection
  const getAspectRatio = () => {
    switch (selectedAspectRatio) {
      case "1:1":
        return 1;
      case "16:9":
        return 16 / 9;
      case "original":
      default:
        return 77 / 45; // Fixed aspect ratio based on 77x45
    }
  };

  // Get display text for aspect ratio
  const getAspectRatioText = () => {
    switch (selectedAspectRatio) {
      case "1:1":
        return "1:1";
      case "16:9":
        return "16:9";
      case "original":
      default:
        return "77:45";
    }
  };

  // Cropper functions - FROM ADVANCED LOGIC
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

  // Function to get cropped image - UPDATED WITH FIXED DIMENSIONS
  const getCroppedImg = async (imageSrc, pixelCrop) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Fixed output dimensions - 77x45
    const outputWidth = 77;
    const outputHeight = 45;

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
          const pngName = originalFile
            ? `cropped-logo-${originalFile.name.replace(/\.[^.]+$/, "")}.png`
            : `cropped-logo-${Date.now()}.png`;

          const file = new File([blob], pngName, {
            type: "image/png",
            lastModified: Date.now(),
          });

          const previewUrl = URL.createObjectURL(blob);

          resolve({
            file,
            previewUrl,
            dimensions: {
              width: 77,
              height: 45
            }
          });
        },
        "image/png"
      );
    });
  };

  // Apply crop and UPLOAD IMMEDIATELY to AWS - UPDATED WITH AUTO-SAVE
  const applyCrop = async () => {
    try {
      if (!imageToCrop || !croppedAreaPixels) {
        toast.error("Please select an area to crop");
        return;
      }

      setIsUploading(true);

      const { file, previewUrl, dimensions } = await getCroppedImg(
        imageToCrop,
        croppedAreaPixels
      );

      // Set fixed logo dimensions
      setLogoDimensions({ width: 77, height: 45 });

      // Show preview immediately with blob URL (temporary)
      setContent((prev) => ({ ...prev, logoUrl: previewUrl }));

      // AUTO UPLOAD TO AWS IMMEDIATELY
      const awsImageUrl = await uploadImageToAWS(file, "logoUrl");

      if (awsImageUrl) {
        // Update with actual S3 URL and trigger auto-save
        setContent((prev) => ({ ...prev, logoUrl: awsImageUrl }));
        toast.success("Logo cropped and uploaded to AWS successfully!");

        // Auto-save the changes
        if (isEditing) {
          setIsSaving(true);
          try {
            await new Promise(resolve => setTimeout(resolve, 500));
            initialHeaderState.current = { ...content, logoUrl: awsImageUrl };
            toast.success("Logo updated automatically!");
          } catch (error) {
            console.error("Auto-save failed:", error);
            toast.error("Auto-save failed. Please try again.");
          } finally {
            setIsSaving(false);
          }
        }
      } else {
        // If upload fails, keep the preview URL
        toast.warning("Logo cropped but AWS upload failed. Using local version.");

        // Still auto-save with local URL
        if (isEditing) {
          setIsSaving(true);
          try {
            await new Promise(resolve => setTimeout(resolve, 500));
            initialHeaderState.current = { ...content, logoUrl: previewUrl };
            toast.success("Logo updated with local version!");
          } catch (error) {
            console.error("Auto-save failed:", error);
            toast.error("Auto-save failed. Please try again.");
          } finally {
            setIsSaving(false);
          }
        }
      }

      setShowCropper(false);
      setImageToCrop(null);
      setOriginalFile(null);
    } catch (error) {
      console.error("Error cropping logo:", error);
      toast.error("Error cropping logo. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Cancel cropping - UPDATED
  const cancelCrop = () => {
    setShowCropper(false);
    setImageToCrop(null);
    setOriginalFile(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  // Reset zoom and rotation - UPDATED
  const resetCropSettings = () => {
    setZoom(1);
    setCrop({ x: 0, y: 0 });
  };

  // Save button handler - now only for manual saving if needed
  const handleSave = async () => {
    try {
      setIsUploading(true);

      // Update initial state reference to current state
      initialHeaderState.current = content;

      // Exit edit mode
      setIsEditing(false);
      toast.success("Header section saved!");
    } catch (error) {
      console.error("Error saving header section:", error);
      toast.error("Error saving changes. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const menuVariants = {
    closed: { opacity: 0, height: 0, transition: { duration: 0.3 } },
    open: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.3, staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    closed: { opacity: 0, x: -20 },
    open: { opacity: 1, x: 0 },
  };

  return (
    <>
      {/* Updated Cropping Modal - ENHANCED WITH ASPECT RATIO OPTIONS */}
      {showCropper && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/90 z-[99999999] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl max-w-4xl w-full h-[80vh] flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800">
                Crop Logo ({getAspectRatioText()} Ratio)
              </h3>
              <button
                onClick={cancelCrop}
                className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
              >
                <XIcon className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Aspect Ratio Selection */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium text-gray-700 mr-2">Aspect Ratio:</span>
                <button
                  onClick={() => setSelectedAspectRatio("original")}
                  className={`px-3 py-1 text-sm rounded border ${selectedAspectRatio === "original"
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                    }`}
                >
                  77:45 (Fixed)
                </button>
                <button
                  onClick={() => setSelectedAspectRatio("1:1")}
                  className={`px-3 py-1 text-sm rounded border ${selectedAspectRatio === "1:1"
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                    }`}
                >
                  1:1 (Square)
                </button>
                <button
                  onClick={() => setSelectedAspectRatio("16:9")}
                  className={`px-3 py-1 text-sm rounded border ${selectedAspectRatio === "16:9"
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                    }`}
                >
                  16:9 (Landscape)
                </button>
              </div>
            </div>

            {/* Cropper Area */}
            <div className={`flex-1 relative bg-gray-900 min-h-0 ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}>
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                aspect={getAspectRatio()} // Dynamic aspect ratio based on selection
                minZoom={minZoomDynamic}
                maxZoom={5}
                restrictPosition={false}
                zoomWithScroll={true}
                zoomSpeed={0.2}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                onMediaLoaded={(ms) => setMediaSize(ms)}
                onCropAreaChange={(area, areaPixels) => setCropAreaSize(area)}
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
              {/* Zoom Control */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-gray-700">
                    Zoom
                  </span>
                  <span className="text-gray-600">{zoom.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  value={zoom}
                  min={minZoomDynamic}
                  max={5}
                  step={0.1}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
                />
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
                  className={`w-full ${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white rounded py-2 text-sm font-medium`}
                >
                  {isUploading ? "Uploading..." : "Apply Crop"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Auto-save indicator */}
      {isSaving && (
        <div className="fixed top-20 right-4 z-[99999999]">
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg shadow-lg text-sm">
            <Loader2 size={16} className="animate-spin" />
            Auto-saving...
          </div>
        </div>
      )}

      {/* === Updated header with proper spacing === */}
      <motion.header
        className={`fixed top-[4rem] left-0 right-0 border-b z-50  ${theme === "dark"
          ? "bg-gray-800 border-gray-700 text-gray-300"
          : "bg-white border-gray-200"
          }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div
          className={`px-4 mx-auto lg:min-w-[1180px] ${containerMaxClass} sm:px-6 lg:px-16`}
        >
          <div className="flex items-center justify-between h-16">
            {/* Logo + Company - keep space and long company names */}
            <div className="flex items-center flex-shrink-0 min-w-0 mr-6 lg:mr-10">
              {/* Removed rotation animation from logo container */}
              <div className="relative flex items-center justify-center flex-shrink-0 mr-2 overflow-hidden rounded-lg bg-transparent group">
                {isEditing ? (
                  <div className="relative">
                    {content.logoUrl &&
                      (content.logoUrl.startsWith("data:") ||
                        content.logoUrl.startsWith("http")) ? (
                      <img
                        ref={logoImgRef}
                        src={content.logoUrl || logo}
                        alt="Logo"
                        style={{
                          width: '77px',
                          height: '45px',
                        }}
                        className="bg-transparent cursor-pointer group-hover:scale-110 transition-all duration-300 rounded-xl object-cover"
                      />
                    ) : (
                      <span
                        className="text-lg font-bold text-black flex items-center justify-center"
                        style={{
                          width: '77px',
                          height: '45px',
                        }}
                      >
                        {content.logoUrl}
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
                  <div>
                    {content.logoUrl &&
                      (content.logoUrl.startsWith("data:") ||
                        content.logoUrl.startsWith("http")) ? (
                      <img
                        ref={logoImgRef}
                        src={content.logoUrl || logo}
                        alt="Logo"
                        style={{
                          width: '77px',
                          height: '45px',
                        }}
                        className="cursor-pointer group-hover:scale-110 transition-all duration-300 rounded-xl object-cover"
                      />
                    ) : (
                      <span
                        className="text-lg font-bold text-black flex items-center justify-center"
                        style={{
                          width: '77px',
                          height: '45px',
                        }}
                      >
                        {content.logoUrl}
                      </span>
                    )}
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden font-bold"
                />
              </div>
            </div>

            {/* Desktop Nav - Centered with proper spacing */}
            <nav className="items-center justify-center flex-1 hidden mx-4 lg:flex min-w-0">
              <div className="flex items-center justify-center space-x-3">
                {content.navItems.map((item) => (
                  <motion.a
                    key={item.id}
                    href={item.href}
                    className={`font-medium relative group whitespace-nowrap ${theme === "dark"
                      ? "text-gray-300 hover:text-gray-200"
                      : "text-gray-700 hover:text-primary"
                      }`}
                    whileHover={{ y: -2 }}
                  >
                    {item.label}
                    <motion.span
                      className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-${item.color} transition-all group-hover:w-full`}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.a>
                ))}
              </div>
            </nav>

            {/* Right side - Fixed width to prevent shifting */}
            <div className="flex items-center flex-shrink-0 space-x-1">
              {isEditing ? (
                <input
                  type="text"
                  value={content.ctaText}
                  onChange={(e) => updateContent("ctaText", e.target.value)}
                  className={`bg-white border px-3 py-1 rounded font-medium outline-none max-w-[120px] ${editInputClasses}`}
                />
              ) : (
                <div className="hidden md:flex">
                  <Button
                    className={`${ctaButtonThemeClasses} transition-all duration-300 shadow-lg whitespace-nowrap`}
                  >
                    <a
                      href="#contact"
                      className={theme === "dark" ? "text-white" : "text-black"}
                    >
                      {content.ctaText}
                    </a>
                  </Button>
                </div>
              )}

              <ThemeToggle />

              {/* Edit/Save Buttons */}
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      whileHover={{ y: -1, scaleX: 1.05 }}
                      onClick={handleCancel}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded shadow-xl hover:font-semibold whitespace-nowrap"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      whileHover={{ y: -1, scaleX: 1.1 }}
                      onClick={handleSave}
                      disabled={isUploading || isSaving}
                      className={`${isUploading || isSaving
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:font-semibold"
                        } text-white px-4 py-2 rounded cursor-pointer hover:shadow-2xl shadow-xl whitespace-nowrap`}
                    >
                      {isUploading || isSaving ? (
                        "Saving..."
                      ) : (
                        <>
                          <Save size={16} className="inline mr-1" /> Save
                        </>
                      )}
                    </motion.button>
                  </>
                ) : (
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ y: -1, scaleX: 1.1 }}
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 text-black bg-yellow-500 rounded shadow-xl cursor-pointer hover:shadow-2xl hover:font-semibold whitespace-nowrap"
                  >
                    Edit
                  </motion.button>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <motion.div className="flex-shrink-0 lg:hidden">
              <motion.button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`hover:text-primary transition-colors p-2 ${theme === "dark"
                  ? "text-gray-300 hover:text-gray-200"
                  : "text-gray-700 hover:text-primary"
                  }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={{ rotate: isMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <AnimatePresence mode="wait">
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          </div>

          {/* Mobile Nav */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                className={`lg:hidden border-t border-gray-200 overflow-hidden ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white"
                  }`}
                variants={menuVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                <motion.nav className="flex flex-col py-4 space-y-4">
                  {content.navItems.map((item, index) => (
                    <motion.a
                      key={item.id}
                      href={item.href}
                      className={`hover:text-${item.color
                        } transition-colors py-2 px-4 rounded-lg hover:bg-${item.color
                        }/10 cursor-pointer ${theme === "dark" ? "text-white" : "text-black"
                        }`}
                      variants={itemVariants}
                      whileHover={{ x: 10, scale: 1.02 }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </motion.a>
                  ))}
                  <Button
                    className={`${ctaButtonThemeClasses} w-full mt-4 shadow-lg`}
                  >
                    {content.ctaText}
                  </Button>
                </motion.nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>
    </>
  );
}