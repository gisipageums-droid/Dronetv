// import React, { useState, useEffect, useRef } from "react";
// import { createPortal } from "react-dom";
// import { motion } from "framer-motion";
// import Cropper from "react-easy-crop";
// import {
//   Save,
//   Upload,
//   Edit,
//   X,
//   Crop,
//   Check,
//   ZoomIn,
//   ZoomOut,
// } from "lucide-react";
// import { toast } from "sonner";

// export interface HeroContent {
//   name: string;
//   title: string;
//   description: string;
//   image: string;
//   socials: {
//     twitter?: string;
//     instagram?: string;
//     linkedin?: string;
//     github?: string;
//     email?: string;
//     phone?: string;
//   };
// }

// interface HeroProps {
//   content: HeroContent;
//   onSave: (updatedContent: HeroContent) => void;
//   userId: string | undefined;
// }

// const Hero: React.FC<HeroProps> = ({ content, onSave, userId }) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);
//   const [heroContent, setHeroContent] = useState<HeroContent>(content);
//   const [originalContent, setOriginalContent] = useState<HeroContent>(content);

//   // Character limits
//   const CHAR_LIMITS = {
//     name: 50,
//     title: 100,
//     description: 500,
//     socials: 100,
//   };

//   // Cropping states
//   const [isCropping, setIsCropping] = useState(false);
//   const [imageToCrop, setImageToCrop] = useState<string>("");
//   const [zoom, setZoom] = useState(1);
//   const [crop, setCrop] = useState({ x: 0, y: 0 });
//   const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
//   const [isDragging, setIsDragging] = useState(false);
//   const [imageLoaded, setImageLoaded] = useState(false);
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   // update local state if props change
//   useEffect(() => {
//     if (content) {
//       setHeroContent(content);
//       setOriginalContent(content);
//     }
//   }, [content]);

//   // lock body scroll when cropping
//   useEffect(() => {
//     if (isCropping) {
//       const prev = document.body.style.overflow;
//       document.body.style.overflow = "hidden";
//       return () => {
//         document.body.style.overflow = prev;
//       };
//     }
//   }, [isCropping]);

//   const handleChange = (field: string, value: string) => {
//     if (field.startsWith("socials.")) {
//       const socialKey = field.split(".")[1];
//       setHeroContent((prev) => ({
//         ...prev,
//         socials: { ...prev.socials, [socialKey]: value },
//       }));
//     } else {
//       setHeroContent((prev) => ({ ...prev, [field]: value }));
//     }
//   };

//   const getCharCountColor = (current: number, max: number) => {
//     if (current >= max) return "text-red-500";
//     if (current >= max * 0.9) return "text-yellow-500";
//     return "text-gray-500";
//   };

//   const getCroppedImage = async (): Promise<Blob> => {
//     return new Promise((resolve, reject) => {
//       const canvas = canvasRef.current;
//       if (!canvas || !croppedAreaPixels || !imageToCrop) {
//         reject(new Error("Missing canvas or crop data"));
//         return;
//       }
//       const ctx = canvas.getContext("2d");
//       if (!ctx) {
//         reject(new Error("Could not get canvas context"));
//         return;
//       }
//       const outputSize = 500;
//       canvas.width = outputSize;
//       canvas.height = outputSize;
//       const img = new Image();
//       img.crossOrigin = "anonymous";
//       img.src = imageToCrop;
//       img.onload = () => {
//         const { x, y, width, height } = croppedAreaPixels as any;
//         ctx.beginPath();
//         ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2);
//         ctx.closePath();
//         ctx.clip();
//         ctx.drawImage(
//           img,
//           x,
//           y,
//           width,
//           height,
//           0,
//           0,
//           outputSize,
//           outputSize
//         );
//         canvas.toBlob(
//           (blob) => {
//             if (blob) resolve(blob);
//             else reject(new Error("Failed to create blob"));
//           },
//           "image/jpeg",
//           0.95
//         );
//       };
//     });
//   };

//   const handleCropConfirm = async () => {
//     try {
//       const croppedBlob = await getCroppedImage();
//       const croppedFile = new File([croppedBlob], "cropped-image.jpg", {
//         type: "image/jpeg",
//       });

//       // Convert to base64 for immediate preview
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         if (reader.result) {
//           setHeroContent((prev) => ({
//             ...prev,
//             image: reader.result as string,
//           }));
//         }
//       };
//       reader.readAsDataURL(croppedFile);

//       setIsUploading(true);
//       setIsCropping(false);
//       setImageLoaded(false);

//       // Upload cropped image
//       const formData = new FormData();
//       formData.append("file", croppedFile);
//       formData.append("userId", userId!);
//       formData.append("fieldName", "heroImage");

//       const uploadResponse = await fetch(
//         `https://ow3v94b9gf.execute-api.ap-south-1.amazonaws.com/dev/`,
//         {
//           method: "POST",
//           body: formData,
//         }
//       );

//       if (uploadResponse.ok) {
//         const uploadData = await uploadResponse.json();
//         setHeroContent((prev) => ({
//           ...prev,
//           image: uploadData.s3Url,
//         }));
//         toast.success("Image uploaded successfully!");
//       } else {
//         const errorData = await uploadResponse.json();
//         toast.error(
//           `Image upload failed: ${errorData.message || "Unknown error"}`
//         );
//       }

//       setIsUploading(false);
//     } catch (error) {
//       console.error("Error cropping image:", error);
//       toast.error("Failed to crop image");
//       setIsCropping(false);
//       setIsUploading(false);
//     }
//   };

//   const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         if (reader.result) {
//           setImageToCrop(reader.result as string);
//           setIsCropping(true);
//           setZoom(1);
//           setCrop({ x: 0, y: 0 });
//           setImageLoaded(false);
//         }
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSave = () => {
//     if (onSave) onSave(heroContent);
//     setOriginalContent(heroContent);
//     toast.success("Hero section updated successfully!");
//     setIsEditing(false);
//   };

//   const handleCancel = () => {
//     setHeroContent(originalContent);
//     setIsEditing(false);
//     toast.info("Changes discarded");
//   };

//   const handleZoomIn = () => {
//     setZoom((prev) => Math.min(prev + 0.1, 5));
//   };

//   const handleZoomOut = () => {
//     setZoom((prev) => Math.max(prev - 0.1, 0.1));
//   };

//   return (
//     <section
//       id="home"
//       className="bg-white dark:bg-gray-900 transition-colors duration-300 pt-40"
//     >
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-40 relative">
//         {/* Edit Button */}
//         <div className="absolute top-10 right-8 px-4 py-2 rounded-full flex items-center gap-2 font-semibold shadow-lg transition-all duration-300">
//           {isEditing ? (
//             <div className="absolute top-0 right-0 flex items-center justify-center gap-2">
//               <button
//                 onClick={handleSave}
//                 title="save updates"
//                 className="p-3 bg-green-500 hover:bg-green-600 text-white rounded-full"
//               >
//                 <Save className="w-6 h-6" />
//               </button>
//               <button
//                 onClick={handleCancel}
//                 title="cancel updates"
//                 className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-full"
//               >
//                 <X className="w-6 h-6" />
//               </button>
//             </div>
//           ) : (
//             <button
//               onClick={() => setIsEditing(true)}
//               title="update hero section"
//               className="absolute top-0 right-0 p-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-full"
//             >
//               <Edit className="w-6 h-6" />
//             </button>
//           )}
//         </div>

//         {/* Hero Content */}
//         <motion.div
//           initial={{ y: 100, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ duration: 1, delay: 0.3 }}
//           className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
//         >
//           {/* Left Side */}
//           <div className="space-y-8">
//             <div className="space-y-6">
//               {isEditing ? (
//                 <div className="space-y-2">
//                   <input
//                     type="text"
//                     value={heroContent.name}
//                     onChange={(e) => handleChange("name", e.target.value)}
//                     maxLength={CHAR_LIMITS.name}
//                     className="text-4xl lg:text-6xl font-bold p-4 rounded-xl w-full border"
//                   />
//                   <div
//                     className={`text-sm text-right ${getCharCountColor(
//                       heroContent.name.length,
//                       CHAR_LIMITS.name
//                     )}`}
//                   >
//                     {heroContent.name.length}/{CHAR_LIMITS.name}
//                   </div>
//                 </div>
//               ) : (
//                 <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white">
//                   <span className="text-yellow-500 capitalize">
//                     {heroContent.name}
//                   </span>
//                 </h1>
//               )}

//               {isEditing ? (
//                 <div className="space-y-2">
//                   <input
//                     type="text"
//                     value={heroContent.title}
//                     onChange={(e) => handleChange("title", e.target.value)}
//                     maxLength={CHAR_LIMITS.title}
//                     className="text-xl lg:text-2xl font-semibold p-3 rounded-lg w-full border"
//                   />
//                   <div
//                     className={`text-sm text-right ${getCharCountColor(
//                       heroContent.title.length,
//                       CHAR_LIMITS.title
//                     )}`}
//                   >
//                     {heroContent.title.length}/{CHAR_LIMITS.title}
//                   </div>
//                 </div>
//               ) : (
//                 <p className="text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white">
//                   {heroContent.title}
//                 </p>
//               )}

//               {isEditing ? (
//                 <div className="space-y-2">
//                   <textarea
//                     value={heroContent.description}
//                     onChange={(e) =>
//                       handleChange("description", e.target.value)
//                     }
//                     maxLength={CHAR_LIMITS.description}
//                     className="text-lg p-4 rounded-lg w-full border resize-none"
//                     rows={4}
//                   />
//                   <div
//                     className={`text-sm text-right ${getCharCountColor(
//                       heroContent.description.length,
//                       CHAR_LIMITS.description
//                     )}`}
//                   >
//                     {heroContent.description.length}/{CHAR_LIMITS.description}
//                   </div>
//                 </div>
//               ) : (
//                 <p className="text-lg text-justify lg:text-xl text-gray-700 dark:text-gray-300">
//                   {heroContent.description}
//                 </p>
//               )}
//             </div>

//             {!isEditing && (
//               <motion.div className="grid grid-cols-2 gap-4 pt-4">
//                 <a
//                   href="#projects"
//                   className="px-8 py-4 rounded-full font-semibold text-xs md:text-lg border-2 transition-all duration-300 hover:scale-105 border-yellow-400 hover:bg-yellow-400 text-gray-900 dark:text-white hover:text-white text-center"
//                 >
//                   View My Work
//                 </a>

//                 <a
//                   href="#contact"
//                   className="px-8 py-4 rounded-full font-semibold text-xs md:text-lg border-2 transition-all duration-300 hover:scale-105 border-yellow-400 hover:bg-yellow-400 text-gray-900 dark:text-white hover:text-white text-center"
//                 >
//                   Get In Touch
//                 </a>
//               </motion.div>
//             )}
//           </div>

//           {/* Right Side - Profile Image */}
//           <div className="flex justify-center lg:justify-end">
//             <div className="w-80 h-80 lg:w-96 lg:h-96 rounded-full p-1 bg-gradient-to-r from-yellow-500 via-orange-500 to-indigo-yellow-700">
//               <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center relative">
//                 {isEditing ? (
//                   !isUploading ? (
//                     <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white cursor-pointer z-10">
//                       <Upload className="w-10 h-10" />
//                       <input
//                         type="file"
//                         accept="image/*"
//                         onChange={handleImageUpload}
//                         className="hidden"
//                       />
//                     </label>
//                   ) : (
//                     <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white z-10">
//                       <p className="text-center text-lg font-bold">
//                         Loading...
//                       </p>
//                     </div>
//                   )
//                 ) : null}
//                 <img
//                   src={heroContent.image}
//                   alt="Profile"
//                   className="w-full h-full object-cover rounded-full"
//                 />
//               </div>
//             </div>
//           </div>
//         </motion.div>

//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           <div className="absolute top-20 left-10 w-32 h-32 rounded-full opacity-10 bg-yellow-400 animate-pulse" />
//           <div className="absolute bottom-20 right-10 w-24 h-24 rounded-full opacity-10 bg-orange-500 animate-bounce" />
//           <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full opacity-5 bg-red-500 animate-pulse" />
//           <div className="absolute bottom-0 left-1/1 w-10 h-10 rounded-full opacity-5 bg-red-500 animate-bounce-slow" />
//           <div className="absolute top-1 left-1/4 w-8 h-8 rounded-full opacity-5 bg-red-500 animate-bounce-slow" />
//         </div>
//       </div>

//       {/* Image Cropping Modal */}
//       {isCropping &&
//         createPortal(
//           <div
//             className="fixed inset-0 bg-black/90 z-[2147483647] flex items-center justify-center p-4"
//             style={{ zIndex: 2147483647 }}
//           >
//             <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-3xl relative mx-4">
//               <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
//                 <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
//                   <Crop className="w-6 h-6" />
//                   Crop Image
//                 </h3>
//                 <button
//                   onClick={() => setIsCropping(false)}
//                   className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
//                 >
//                   <X className="w-6 h-6 text-gray-900 dark:text-white" />
//                 </button>
//               </div>

//               <div className="p-6">
//                 <div
//                   className={`relative h-72 bg-gray-900 rounded-lg overflow-hidden mb-6 ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
//                 >
//                   <Cropper
//                     image={imageToCrop}
//                     crop={crop}
//                     zoom={zoom}
//                     aspect={1}
//                     cropShape="round"
//                     showGrid={true}
//                     minZoom={0.1}
//                     maxZoom={5}
//                     restrictPosition={false}
//                     zoomWithScroll={true}
//                     zoomSpeed={0.2}
//                     onCropChange={setCrop}
//                     onZoomChange={setZoom}
//                     onCropComplete={(_c, p) => setCroppedAreaPixels(p)}
//                     onMediaLoaded={() => setImageLoaded(true)}
//                     onInteractionStart={() => setIsDragging(true)}
//                     onInteractionEnd={() => setIsDragging(false)}
//                   />
//                 </div>

//                 <div className="space-y-4">
//                   <div>
//                     <div className="flex items-center justify-between mb-3">
//                       <label className="text-base font-medium text-gray-900 dark:text-white">
//                         Zoom Control
//                       </label>
//                       <div className="flex gap-3">
//                         <button
//                           onClick={handleZoomOut}
//                           className="p-3 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
//                         >
//                           <ZoomOut className="w-5 h-5" />
//                         </button>
//                         <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[60px] text-center">
//                           {Math.round(zoom * 100)}%
//                         </span>
//                         <button
//                           onClick={handleZoomIn}
//                           className="p-3 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
//                         >
//                           <ZoomIn className="w-5 h-5" />
//                         </button>
//                       </div>
//                     </div>
//                     <input
//                       type="range"
//                       min={0.1}
//                       max={5}
//                       step={0.01}
//                       value={zoom}
//                       onChange={(e) => setZoom(Number(e.target.value))}
//                       className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="flex gap-4 justify-end p-6 border-t border-gray-200 dark:border-gray-700">
//                 <button
//                   onClick={() => setIsCropping(false)}
//                   className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleCropConfirm}
//                   disabled={!imageLoaded}
//                   className="px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
//                 >
//                   <Check className="w-5 h-5" />
//                   Crop & Upload Image
//                 </button>
//               </div>
//             </div>
//           </div>,
//           document.body
//         )}

//       {/* Hidden canvas for cropping */}
//       <canvas ref={canvasRef} className="hidden" />
//     </section>
//   );
// };

// export default Hero;

import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import Cropper from "react-easy-crop";
import {
  Save,
  Upload,
  Edit,
  X,
  Crop,
  Check,
  ZoomIn,
  ZoomOut,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

export interface HeroContent {
  name: string;
  title: string;
  description: string;
  image: string;
  socials: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    github?: string;
    email?: string;
    phone?: string;
  };
}

interface HeroProps {
  content: HeroContent;
  onSave: (updatedContent: HeroContent) => void;
  userId: string | undefined;
}

const Hero: React.FC<HeroProps> = ({ content, onSave, userId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [heroContent, setHeroContent] = useState<HeroContent>(content);
  const [originalContent, setOriginalContent] = useState<HeroContent>(content);

  // Auto-save states
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Character limits
  const CHAR_LIMITS = {
    name: 50,
    title: 100,
    description: 500,
    socials: 100,
  };

  // Cropping states
  const [isCropping, setIsCropping] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string>("");
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Update local state if props change
  useEffect(() => {
    if (content) {
      setHeroContent(content);
      setOriginalContent(content);
      setHasUnsavedChanges(false);
    }
  }, [content]);

  // Auto-save cleanup
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  // Lock body scroll when cropping
  useEffect(() => {
    if (isCropping) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isCropping]);

  // Auto-save function
  const performAutoSave = useCallback(async () => {
    if (!hasUnsavedChanges || !isEditing) return;

    setIsAutoSaving(true);
    
    try {
      onSave(heroContent);
      setLastSavedTime(new Date());
      setHasUnsavedChanges(false);
      
      console.log("Hero section auto-saved at", new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Hero auto-save failed:", error);
      toast.error("Auto-save failed. Changes not saved.");
    } finally {
      setIsAutoSaving(false);
    }
  }, [heroContent, hasUnsavedChanges, isEditing, onSave]);

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

  // Content change handler with auto-save
  const handleChange = useCallback((field: string, value: string) => {
    if (field.startsWith("socials.")) {
      const socialKey = field.split(".")[1];
      setHeroContent((prev) => ({
        ...prev,
        socials: { ...prev.socials, [socialKey]: value },
      }));
    } else {
      setHeroContent((prev) => ({ ...prev, [field]: value }));
    }
    scheduleAutoSave();
  }, [scheduleAutoSave]);

  const getCharCountColor = (current: number, max: number) => {
    if (current >= max) return "text-red-500";
    if (current >= max * 0.9) return "text-yellow-500";
    return "text-gray-500";
  };

  const getCroppedImage = async (): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const canvas = canvasRef.current;
      if (!canvas || !croppedAreaPixels || !imageToCrop) {
        reject(new Error("Missing canvas or crop data"));
        return;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }
      const outputSize = 500;
      canvas.width = outputSize;
      canvas.height = outputSize;
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imageToCrop;
      img.onload = () => {
        const { x, y, width, height } = croppedAreaPixels as any;
        ctx.beginPath();
        ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(
          img,
          x,
          y,
          width,
          height,
          0,
          0,
          outputSize,
          outputSize
        );
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Failed to create blob"));
          },
          "image/jpeg",
          0.95
        );
      };
    });
  };

  // Auto-upload image after cropping
  const handleCropConfirm = async () => {
    try {
      const croppedBlob = await getCroppedImage();
      const croppedFile = new File([croppedBlob], "cropped-image.jpg", {
        type: "image/jpeg",
      });

      // Convert to base64 for immediate preview
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          const tempImageSrc = reader.result as string;
          setHeroContent((prev) => ({
            ...prev,
            image: tempImageSrc,
          }));
          // Schedule auto-save for image change
          setHasUnsavedChanges(true);
          scheduleAutoSave();
        }
      };
      reader.readAsDataURL(croppedFile);

      setIsUploading(true);
      setIsCropping(false);
      setImageLoaded(false);

      // Upload cropped image to AWS S3 immediately
      const formData = new FormData();
      formData.append("file", croppedFile);
      formData.append("userId", userId!);
      formData.append("fieldName", "heroImage");

      const uploadResponse = await fetch(
        `https://ow3v94b9gf.execute-api.ap-south-1.amazonaws.com/dev/`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (uploadResponse.ok) {
        const uploadData = await uploadResponse.json();
        const s3ImageUrl = uploadData.s3Url;
        
        // Update with S3 URL
        setHeroContent((prev) => ({
          ...prev,
          image: s3ImageUrl,
        }));
        
        // Trigger save with the new S3 URL
        const updatedWithS3 = {
          ...heroContent,
          image: s3ImageUrl,
        };
        onSave(updatedWithS3);
        setLastSavedTime(new Date());
        setHasUnsavedChanges(false);
        
        toast.success("Image uploaded and saved successfully!");
      } else {
        const errorData = await uploadResponse.json();
        toast.error(
          `Image upload failed: ${errorData.message || "Unknown error"}`
        );
        // Keep the base64 image as fallback
        toast.info("Using local image version. Please try uploading again later.");
      }

      setIsUploading(false);
    } catch (error) {
      console.error("Error cropping image:", error);
      toast.error("Failed to crop image");
      setIsCropping(false);
      setIsUploading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setImageToCrop(reader.result as string);
          setIsCropping(true);
          setZoom(1);
          setCrop({ x: 0, y: 0 });
          setImageLoaded(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Manual save function
  const handleSave = () => {
    // Clear any pending auto-save
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    onSave(heroContent);
    setOriginalContent(heroContent);
    setLastSavedTime(new Date());
    setHasUnsavedChanges(false);
    setIsEditing(false);
    toast.success("Hero section updated successfully!");
  };

  // Manual cancel function
  const handleCancel = () => {
    // Clear any pending auto-save
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    setHeroContent(originalContent);
    setHasUnsavedChanges(false);
    setIsEditing(false);
    toast.info("Changes discarded");
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 5));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.1));
  };

  return (
    <section
      id="home"
      className="bg-white dark:bg-gray-900 transition-colors duration-300 pt-40"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-40 relative">
        {/* Edit Button */}
        <div className="absolute top-10 right-8 px-4 py-2 rounded-full flex items-center gap-2 font-semibold shadow-lg transition-all duration-300">
          {isEditing ? (
            <div className="absolute top-0 right-0 flex items-center justify-center gap-2">
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
                title="save updates"
                className="p-3 bg-green-500 hover:bg-green-600 text-white rounded-full"
              >
                <Save className="w-6 h-6" />
              </button>
              <button
                onClick={handleCancel}
                title="cancel updates"
                className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              title="update hero section"
              className="absolute top-0 right-0 p-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-full"
            >
              <Edit className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Hero Content */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left Side */}
          <div className="space-y-8">
            <div className="space-y-6">
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={heroContent.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    maxLength={CHAR_LIMITS.name}
                    className="text-4xl lg:text-6xl font-bold p-4 rounded-xl w-full border"
                  />
                  <div
                    className={`text-sm text-right ${getCharCountColor(
                      heroContent.name.length,
                      CHAR_LIMITS.name
                    )}`}
                  >
                    {heroContent.name.length}/{CHAR_LIMITS.name}
                  </div>
                </div>
              ) : (
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white">
                  <span className="text-yellow-500 capitalize">
                    {heroContent.name}
                  </span>
                </h1>
              )}

              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={heroContent.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    maxLength={CHAR_LIMITS.title}
                    className="text-xl lg:text-2xl font-semibold p-3 rounded-lg w-full border"
                  />
                  <div
                    className={`text-sm text-right ${getCharCountColor(
                      heroContent.title.length,
                      CHAR_LIMITS.title
                    )}`}
                  >
                    {heroContent.title.length}/{CHAR_LIMITS.title}
                  </div>
                </div>
              ) : (
                <p className="text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white">
                  {heroContent.title}
                </p>
              )}

              {isEditing ? (
                <div className="space-y-2">
                  <textarea
                    value={heroContent.description}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    maxLength={CHAR_LIMITS.description}
                    className="text-lg p-4 rounded-lg w-full border resize-none"
                    rows={4}
                  />
                  <div
                    className={`text-sm text-right ${getCharCountColor(
                      heroContent.description.length,
                      CHAR_LIMITS.description
                    )}`}
                  >
                    {heroContent.description.length}/{CHAR_LIMITS.description}
                  </div>
                </div>
              ) : (
                <p className="text-lg text-justify lg:text-xl text-gray-700 dark:text-gray-300">
                  {heroContent.description}
                </p>
              )}
            </div>

            {!isEditing && (
              <motion.div className="grid grid-cols-2 gap-4 pt-4">
                <a
                  href="#projects"
                  className="px-8 py-4 rounded-full font-semibold text-xs md:text-lg border-2 transition-all duration-300 hover:scale-105 border-yellow-400 hover:bg-yellow-400 text-gray-900 dark:text-white hover:text-white text-center"
                >
                  View My Work
                </a>

                <a
                  href="#contact"
                  className="px-8 py-4 rounded-full font-semibold text-xs md:text-lg border-2 transition-all duration-300 hover:scale-105 border-yellow-400 hover:bg-yellow-400 text-gray-900 dark:text-white hover:text-white text-center"
                >
                  Get In Touch
                </a>
              </motion.div>
            )}
          </div>

          {/* Right Side - Profile Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-80 h-80 lg:w-96 lg:h-96 rounded-full p-1 bg-gradient-to-r from-yellow-500 via-orange-500 to-indigo-yellow-700">
              <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center relative">
                {isEditing ? (
                  !isUploading ? (
                    <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white cursor-pointer z-10">
                      <Upload className="w-10 h-10" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white z-10">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <p className="text-center text-lg font-bold">
                          Uploading...
                        </p>
                      </div>
                    </div>
                  )
                ) : null}
                <img
                  src={heroContent.image}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 rounded-full opacity-10 bg-yellow-400 animate-pulse" />
          <div className="absolute bottom-20 right-10 w-24 h-24 rounded-full opacity-10 bg-orange-500 animate-bounce" />
          <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full opacity-5 bg-red-500 animate-pulse" />
          <div className="absolute bottom-0 left-1/1 w-10 h-10 rounded-full opacity-5 bg-red-500 animate-bounce-slow" />
          <div className="absolute top-1 left-1/4 w-8 h-8 rounded-full opacity-5 bg-red-500 animate-bounce-slow" />
        </div>
      </div>

      {/* Image Cropping Modal */}
      {isCropping &&
        createPortal(
          <div
            className="fixed inset-0 bg-black/90 z-[2147483647] flex items-center justify-center p-4"
            style={{ zIndex: 2147483647 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-3xl relative mx-4">
              <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Crop className="w-6 h-6" />
                  Crop Image
                </h3>
                <button
                  onClick={() => setIsCropping(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-900 dark:text-white" />
                </button>
              </div>

              <div className="p-6">
                <div
                  className={`relative h-72 bg-gray-900 rounded-lg overflow-hidden mb-6 ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
                >
                  <Cropper
                    image={imageToCrop}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    cropShape="round"
                    showGrid={true}
                    minZoom={0.1}
                    maxZoom={5}
                    restrictPosition={false}
                    zoomWithScroll={true}
                    zoomSpeed={0.2}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={(_c, p) => setCroppedAreaPixels(p)}
                    onMediaLoaded={() => setImageLoaded(true)}
                    onInteractionStart={() => setIsDragging(true)}
                    onInteractionEnd={() => setIsDragging(false)}
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-base font-medium text-gray-900 dark:text-white">
                        Zoom Control
                      </label>
                      <div className="flex gap-3">
                        <button
                          onClick={handleZoomOut}
                          className="p-3 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                          <ZoomOut className="w-5 h-5" />
                        </button>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[60px] text-center">
                          {Math.round(zoom * 100)}%
                        </span>
                        <button
                          onClick={handleZoomIn}
                          className="p-3 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                          <ZoomIn className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <input
                      type="range"
                      min={0.1}
                      max={5}
                      step={0.01}
                      value={zoom}
                      onChange={(e) => setZoom(Number(e.target.value))}
                      className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-end p-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setIsCropping(false)}
                  className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCropConfirm}
                  disabled={!imageLoaded || isUploading}
                  className="px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Crop & Upload Image
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Hidden canvas for cropping */}
      <canvas ref={canvasRef} className="hidden" />
    </section>
  );
};

export default Hero;