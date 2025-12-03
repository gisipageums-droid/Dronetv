// import { Edit2, Loader2, Save, Upload, X, ZoomIn, ZoomOut } from "lucide-react";

// import { motion } from "motion/react";
// import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import { toast } from "sonner";
// import { AnimatedButton } from "./AnimatedButton";
// import { ImageWithFallback } from "./figma/ImageWithFallback";
// import Cropper from 'react-easy-crop';

// // Text limits
// const TEXT_LIMITS = {
//   HEADING: 60,
//   SUBTITLE: 100,
//   DESCRIPTION1: 500,
//   DESCRIPTION2: 500,
//   SKILL: 40,
//   BUTTON_TEXT: 30,
// };

// // Standardized Button component
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
//       className={`${baseClasses} ${variants[variant || 'default']} ${sizes[size || 'default']
//         } ${className || ""}`}
//       onClick={onClick}
//       disabled={disabled}
//       {...props}
//     >
//       {children}
//     </button>
//   );
// };

// interface AboutData {
//   heading: string;
//   subtitle: string;
//   description1: string;
//   description2: string;
//   skills: string[];
//   imageSrc: string;
//   buttonText?: string;
// }

// interface AboutProps {
//   aboutData?: AboutData;
//   onStateChange?: (data: AboutData) => void;
//   userId?: string;
//   professionalId?: string;
//   templateSelection?: string;
// }

// export function About({
//   aboutData,
//   onStateChange,
//   userId,
//   professionalId,
//   templateSelection,
// }: AboutProps) {
//   const [isEditing, setIsEditing] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);
//   const [isVisible, setIsVisible] = useState(false);
//   const aboutRef = useRef<HTMLDivElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const aboutImageContainerRef = useRef<HTMLDivElement>(null);

//   // Pending image file for S3 upload
//   const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);

//   // Cropping states
//   const [showCropper, setShowCropper] = useState(false);
//   const [crop, setCrop] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);
//   const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
//   const [imageToCrop, setImageToCrop] = useState(null);
//   const [originalFile, setOriginalFile] = useState(null);
//   const [aspectRatio] = useState(4 / 3); // Fixed 4:3 aspect ratio

//   // Initialize with props data or empty structure
//   const [data, setData] = useState<AboutData>(aboutData || {
//     heading: "",
//     subtitle: "",
//     description1: "",
//     description2: "",
//     skills: [''],
//     imageSrc: "",
//     buttonText: ""
//   });
//   const [tempData, setTempData] = useState<AboutData>(aboutData || {
//     heading: "",
//     subtitle: "",
//     description1: "",
//     description2: "",
//     skills: [''],
//     imageSrc: "",
//     buttonText: ""
//   });

//   // FIX: Use ref for onStateChange to prevent infinite loops
//   const onStateChangeRef = useRef(onStateChange);
//   useEffect(() => {
//     onStateChangeRef.current = onStateChange;
//   }, [onStateChange]);

//   // FIX: Track previous data to avoid unnecessary updates
//   const prevDataRef = useRef<AboutData>();
//   useEffect(() => {
//     if (onStateChangeRef.current && prevDataRef.current !== data) {
//       onStateChangeRef.current(data);
//       prevDataRef.current = data;
//     }
//   }, [data]);

//   // Sync with props data when it changes
//   useEffect(() => {
//     if (aboutData) {
//       setData(aboutData);
//       setTempData(aboutData);
//     }
//   }, [aboutData]);

//   // Intersection observer
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => setIsVisible(entry.isIntersecting),
//       { threshold: 0.1 }
//     );
//     if (aboutRef.current) observer.observe(aboutRef.current);
//     return () => {
//       if (aboutRef.current) observer.unobserve(aboutRef.current);
//     };
//   }, []);

//   // Calculate displayData based on editing state
//   const displayData = isEditing ? tempData : data;

//   const handleEdit = () => {
//     setIsEditing(true);
//     setTempData({ ...data });
//     setPendingImageFile(null);
//   };

//   // Cropper functions
//   const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
//     setCroppedAreaPixels(croppedAreaPixels);
//   }, []);

//   // Helper function to create image element
//   const createImage = (url) =>
//     new Promise((resolve, reject) => {
//       const image = new Image();
//       image.addEventListener('load', () => resolve(image));
//       image.addEventListener('error', (error) => reject(error));
//       image.setAttribute('crossOrigin', 'anonymous');
//       image.src = url;
//     });

//   // Function to get cropped image
//   const getCroppedImg = async (imageSrc, pixelCrop) => {
//     const image = await createImage(imageSrc);
//     const canvas = document.createElement('canvas');
//     const ctx = canvas.getContext('2d');

//     canvas.width = pixelCrop.width;
//     canvas.height = pixelCrop.height;

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
//       canvas.toBlob((blob) => {
//         const fileName = originalFile ?
//           `cropped-about-${originalFile.name}` :
//           `cropped-about-${Date.now()}.jpg`;

//         const file = new File([blob], fileName, {
//           type: 'image/jpeg',
//           lastModified: Date.now()
//         });

//         const previewUrl = URL.createObjectURL(blob);

//         resolve({
//           file,
//           previewUrl
//         });
//       }, 'image/jpeg', 0.95);
//     });
//   };

//   // Handle image selection - opens cropper
//   const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     if (!file.type.startsWith('image/')) {
//       toast.error('Please select an image file');
//       return;
//     }

//     if (file.size > 5 * 1024 * 1024) { // 5MB limit
//       toast.error('File size must be less than 5MB');
//       return;
//     }

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setImageToCrop(reader.result);
//       setOriginalFile(file);
//       setShowCropper(true);
//       setZoom(1);
//       setCrop({ x: 0, y: 0 });
//     };
//     reader.readAsDataURL(file);

//     // Clear the file input
//     event.target.value = '';
//   };

//   // Apply crop and set pending file
//   const applyCrop = async () => {
//     try {
//       if (!imageToCrop || !croppedAreaPixels) return;

//       const { file, previewUrl } = await getCroppedImg(imageToCrop, croppedAreaPixels);

//       // Update preview immediately with blob URL (temporary)
//       setTempData(prev => ({
//         ...prev,
//         imageSrc: previewUrl,
//       }));
//       setPendingImageFile(file);

//       console.log('About image cropped, file ready for upload:', file);
//       toast.success('Image cropped successfully! Click Save to upload to S3.');
//       setShowCropper(false);
//       setImageToCrop(null);
//       setOriginalFile(null);
//     } catch (error) {
//       console.error('Error cropping image:', error);
//       toast.error('Error cropping image. Please try again.');
//     }
//   };

//   // Cancel cropping
//   const cancelCrop = () => {
//     setShowCropper(false);
//     setImageToCrop(null);
//     setOriginalFile(null);
//     setCrop({ x: 0, y: 0 });
//     setZoom(1);
//   };

//   // Reset zoom
//   const resetCropSettings = () => {
//     setZoom(1);
//     setCrop({ x: 0, y: 0 });
//   };

//   // Save function with S3 upload
//   const handleSave = async () => {
//     try {
//       setIsUploading(true);

//       // Create a copy of tempData to update with S3 URL
//       let updatedData = { ...tempData };

//       // Upload image if there's a pending file
//       if (pendingImageFile) {
//         if (!userId || !professionalId || !templateSelection) {
//           toast.error('Missing user information. Please refresh and try again.');
//           return;
//         }

//         const formData = new FormData();
//         formData.append('file', pendingImageFile);
//         formData.append('userId', userId);
//         formData.append('fieldName', 'about_image');

//         const uploadResponse = await fetch(`https://ow3v94b9gf.execute-api.ap-south-1.amazonaws.com/dev/`, {
//           method: 'POST',
//           body: formData,
//         });

//         if (uploadResponse.ok) {
//           const uploadData = await uploadResponse.json();
//           updatedData.imageSrc = uploadData.s3Url;
//           console.log('About image uploaded to S3:', uploadData.s3Url);
//         } else {
//           const errorData = await uploadResponse.json();
//           toast.error(`Image upload failed: ${errorData.message || 'Unknown error'}`);
//           return;
//         }
//       }

//       // Clear pending file
//       setPendingImageFile(null);

//       // Save the updated data with S3 URL
//       setIsSaving(true);
//       await new Promise((resolve) => setTimeout(resolve, 1000));

//       // Update both states with the new URL
//       setData(updatedData);
//       setTempData(updatedData);

//       setIsEditing(false);
//       toast.success('About section saved successfully');

//     } catch (error) {
//       console.error('Error saving about section:', error);
//       toast.error('Error saving changes. Please try again.');
//     } finally {
//       setIsUploading(false);
//       setIsSaving(false);
//     }
//   };

//   const handleCancel = () => {
//     setTempData({ ...data });
//     setPendingImageFile(null);
//     setIsEditing(false);
//   };

//   // Stable update functions with useCallback
//   const updateTempContent = useCallback((field: keyof AboutData, value: string) => {
//     setTempData(prev => ({ ...prev, [field]: value }));
//   }, []);

//   const updateSkill = useCallback((index: number, value: string) => {
//     setTempData(prevData => {
//       const updatedSkills = [...prevData.skills];
//       updatedSkills[index] = value;
//       return { ...prevData, skills: updatedSkills };
//     });
//   }, []);

//   const addSkill = useCallback(() => {
//     setTempData(prevData => ({
//       ...prevData,
//       skills: [...prevData.skills, "New skill"]
//     }));
//   }, []);

//   const removeSkill = useCallback((index: number) => {
//     setTempData(prevData => {
//       if (prevData.skills.length <= 1) {
//         toast.error("You must have at least one skill");
//         return prevData;
//       }
//       return {
//         ...prevData,
//         skills: prevData.skills.filter((_, i) => i !== index)
//       };
//     });
//   }, []);

//   // Memoized EditableText component
//   const EditableText = useMemo(() => {
//     return ({
//       value,
//       field,
//       multiline = false,
//       className = "",
//       placeholder = "",
//       rows = 3,
//       isSkill = false,
//       skillIndex,
//     }: {
//       value: string;
//       field?: keyof AboutData;
//       multiline?: boolean;
//       className?: string;
//       placeholder?: string;
//       rows?: number;
//       isSkill?: boolean;
//       skillIndex?: number;
//     }) => {
//       const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//         const newValue = e.target.value;
//         if (isSkill && skillIndex !== undefined) {
//           updateSkill(skillIndex, newValue);
//         } else if (field) {
//           updateTempContent(field, newValue);
//         }
//       };

//       const getMaxLength = () => {
//         if (isSkill) return TEXT_LIMITS.SKILL;
//         if (field === 'heading') return TEXT_LIMITS.HEADING;
//         if (field === 'subtitle') return TEXT_LIMITS.SUBTITLE;
//         if (field === 'description1' || field === 'description2') return TEXT_LIMITS.DESCRIPTION1;
//         if (field === 'buttonText') return TEXT_LIMITS.BUTTON_TEXT;
//         return undefined;
//       };

//       const maxLength = getMaxLength();
//       const currentLength = value?.length || 0;

//       const baseClasses = "w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none";

//       if (multiline) {
//         return (
//           <div className="relative">
//             <textarea
//               value={value}
//               onChange={handleChange}
//               className={`${baseClasses} p-2 resize-none ${className}`}
//               placeholder={placeholder}
//               rows={rows}
//               maxLength={maxLength}
//             />
//             {maxLength && (
//               <div className="absolute right-2 bottom-2 text-xs text-gray-500">
//                 {currentLength}/{maxLength}
//               </div>
//             )}
//           </div>
//         );
//       }

//       return (
//         <div className="relative">
//           <input
//             type='text'
//             value={value}
//             onChange={handleChange}
//             className={`${baseClasses} p-1 ${className}`}
//             placeholder={placeholder}
//             maxLength={maxLength}
//           />
//           {maxLength && (
//             <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
//               {currentLength}/{maxLength}
//             </div>
//           )}
//         </div>
//       );
//     };
//   }, [updateTempContent, updateSkill]);

//   // Check if there's any meaningful data to display
//   const hasData = data.heading ||
//                   data.subtitle ||
//                   data.description1 ||
//                   data.description2 ||
//                   (data.skills.length > 0 && data.skills[0] !== '') ||
//                   data.imageSrc;

//   // No data state - show empty state with option to add data
//   if (!isEditing && !hasData) {
//     return (
//       <section ref={aboutRef} id="about" className="relative py-20 bg-background">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           {/* Edit Controls */}
//           <div className='text-right mb-8'>
//             <Button
//               onClick={handleEdit}
//               size='sm'
//               className='bg-red-500 hover:bg-red-600 text-white shadow-md'
//             >
//               <Edit2 className='w-4 h-4 mr-2' />
//               Add About Content
//             </Button>
//           </div>

//           {/* Empty State */}
//           <div className="text-center py-16">
//             <div className="max-w-md mx-auto">
//               <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
//                 <span className="text-2xl">👤</span>
//               </div>
//               <h3 className="text-2xl font-semibold text-foreground mb-4">
//                 No About Content Found
//               </h3>
//               <p className="text-muted-foreground mb-8">
//                 Tell your story and showcase your skills to help visitors get to know you better.
//               </p>
//               <Button
//                 onClick={handleEdit}
//                 size='lg'
//                 className='bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg'
//               >
//                 <Edit2 className='w-5 h-5 mr-2' />
//                 Add About Content
//               </Button>
//             </div>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section ref={aboutRef} id="about" className="relative text-justify py-20 bg-background">
//       {/* Image Cropper Modal */}
//       {showCropper && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="fixed inset-0 bg-black/90 z-[99999999] flex items-center justify-center p-4"
//         >
//           <motion.div
//             initial={{ scale: 0.9, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             className="bg-white rounded-xl max-w-6xl w-full h-[90vh] flex flex-col" // Increased max-width to max-w-6xl
//           >
//             {/* Header */}
//             <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
//               <h3 className="text-lg font-semibold text-gray-800">
//                 Crop About Image (4:3 Aspect Ratio)
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
//               <Cropper
//                 image={imageToCrop}
//                 crop={crop}
//                 zoom={zoom}
//                 aspect={aspectRatio}
//                 onCropChange={setCrop}
//                 onZoomChange={setZoom}
//                 onCropComplete={onCropComplete}
//                 showGrid={false}
//                 cropShape="rect"
//                 minZoom={0.1}
//                 maxZoom={5}
//                 restrictPosition={false}
//                 zoomWithScroll={true}
//                 zoomSpeed={0.2}
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
//               {/* Aspect Ratio Info */}
//               <div className="mb-4">
//                 <p className="text-sm font-medium text-gray-700 mb-2">
//                   Aspect Ratio: <span className="text-blue-600">4:3 (Standard)</span>
//                 </p>
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
//                 <div className="flex items-center gap-2">
//                   <button
//                     type="button"
//                     onClick={() => setZoom((z) => Math.max(0.1, +(z - 0.1).toFixed(2)))}
//                     className="p-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
//                   >
//                     <ZoomOut className="w-4 h-4" />
//                   </button>
//                   <input
//                     type="range"
//                     value={zoom}
//                     min={0.1}
//                     max={5}
//                     step={0.1}
//                     onChange={(e) => setZoom(Number(e.target.value))}
//                     className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setZoom((z) => Math.min(5, +(z + 0.1).toFixed(2)))}
//                     className="p-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
//                   >
//                     <ZoomIn className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>

//               {/* Action Buttons - Moved to bottom and centered */}
//               <div className="flex justify-center gap-3 pt-4">
//                 <button
//                   onClick={resetCropSettings}
//                   className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded text-sm font-medium transition-colors"
//                 >
//                   Reset Zoom
//                 </button>
//                 <button
//                   onClick={cancelCrop}
//                   className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded text-sm font-medium transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={applyCrop}
//                   className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium transition-colors"
//                 >
//                   Apply Crop
//                 </button>
//               </div>
//             </div>
//           </motion.div>
//         </motion.div>
//       )}

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Edit Controls */}
//         <div className='text-right z-50 mb-20'>
//           {!isEditing ? (
//             <Button
//               onClick={handleEdit}
//               size='sm'
//               className='bg-red-500 hover:bg-red-600 text-white shadow-md'
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
//                 disabled={isSaving || isUploading}
//               >
//                 {isUploading ? (
//                   <Loader2 className='w-4 h-4 mr-2 animate-spin' />
//                 ) : isSaving ? (
//                   <Loader2 className='w-4 h-4 mr-2 animate-spin' />
//                 ) : (
//                   <Save className='w-4 h-4 mr-2' />
//                 )}
//                 {isUploading ? "Uploading..." : isSaving ? "Saving..." : "Save"}
//               </Button>
//               <Button
//                 onClick={handleCancel}
//                 size='sm'
//                 className='bg-red-500 hover:bg-red-600 shadow-md text-white'
//                 disabled={isSaving || isUploading}
//               >
//                 <X className='w-4 h-4 mr-2' />
//                 Cancel
//               </Button>
//               {isEditing && (
//                 <Button
//                   onClick={addSkill}
//                   variant='outline'
//                   size='sm'
//                   className='bg-blue-50 hover:bg-blue-100 text-blue-700 shadow-md'
//                 >
//                   Add Skill
//                 </Button>
//               )}
//             </div>
//           )}
//         </div>

//         <div className="grid lg:grid-cols-2 gap-12 items-start">
//           {/* Left Content - Image */}
//           <motion.div
//             initial={{ opacity: 0, x: -50 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.8 }}
//             viewport={{ once: true }}
//             className="relative"
//           >
//             {isEditing && (
//               <div className="absolute top-2 right-2 z-10">
//                 <div className="bg-white/90 backdrop-blur-sm shadow-md rounded p-2">
//                   <Button
//                     onClick={() => fileInputRef.current?.click()}
//                     size="sm"
//                     variant="outline"
//                     className="bg-white text-black hover:bg-gray-100"
//                   >
//                     <Upload className="w-4 h-4 mr-2" />
//                     Change Image
//                   </Button>
//                   <input
//                     ref={fileInputRef}
//                     type="file"
//                     accept="image/*"
//                     onChange={handleImageSelect}
//                     className="hidden"
//                   />
//                   {pendingImageFile && (
//                     <p className="text-xs text-orange-600 mt-1 bg-white p-1 rounded">
//                       Image selected: {pendingImageFile.name}
//                     </p>
//                   )}
//                   <div className='text-xs text-gray-500 mt-1 text-center'>
//                     Recommended: {Math.round(aboutImageContainerRef.current?.offsetWidth || 400)}×{Math.round((aboutImageContainerRef.current?.offsetWidth || 400) * (4/3))}px (3:4 ratio) - Portrait
//                   </div>
//                 </div>
//               </div>
//             )}

//             <motion.div
//               ref={aboutImageContainerRef}
//               whileHover={{ scale: 1.05 }}
//               transition={{ duration: 0.3 }}
//               className="relative"
//             >
//               <div className="absolute inset-0 bg-yellow-400 rounded-3xl transform -rotate-6"></div>
//               <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl">
//                 {displayData.imageSrc ? (
//                   <img
//                     src={displayData.imageSrc}
//                     alt="About me"
//                     className="w-full h-96 object-cover"
//                     onError={(e) => {
//                       const target = e.target as HTMLImageElement;
//                       target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23f3f4f6" width="400" height="400"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="18" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EProfile Image%3C/text%3E%3C/svg%3E';
//                     }}
//                   />
//                 ) : (
//                   <div className="w-full h-96 flex items-center justify-center bg-gray-200">
//                     <p className="text-gray-400 text-sm">No image uploaded</p>
//                   </div>
//                 )}
//               </div>
//             </motion.div>
//           </motion.div>

//           {/* Right Content */}
//           <motion.div
//             initial={{ opacity: 0, x: 50 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.8 }}
//             viewport={{ once: true }}
//             className="space-y-6 relative"
//           >
//             {/* Heading */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 0.2 }}
//               viewport={{ once: true }}
//             >
//               {isEditing ? (
//                 <div className="space-y-4">
//                   <EditableText
//                     value={displayData.heading}
//                     field="heading"
//                     className="text-3xl sm:text-4xl font-bold text-foreground"
//                     placeholder="Main heading"
//                   />
//                   <EditableText
//                     value={displayData.subtitle}
//                     field="subtitle"
//                     className="text-xl text-yellow-500 font-semibold"
//                     placeholder="Subtitle"
//                   />
//                 </div>
//               ) : (
//                 <div>
//                   {displayData.heading && (
//                     <h2 className="text-3xl sm:text-4xl text-foreground font-bold">
//                       {displayData.heading}
//                     </h2>
//                   )}
//                   {displayData.subtitle && (
//                     <p className="text-xl text-yellow-500 font-semibold mt-2">
//                       {displayData.subtitle}
//                     </p>
//                   )}
//                 </div>
//               )}
//             </motion.div>

//             {/* Description 1 */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 0.4 }}
//               viewport={{ once: true }}
//             >
//               {isEditing ? (
//                 <EditableText
//                   value={displayData.description1}
//                   field="description1"
//                   multiline
//                   className="text-lg text-muted-foreground leading-relaxed"
//                   rows={3}
//                   placeholder="First description paragraph"
//                 />
//               ) : (
//                 displayData.description1 && (
//                   <p className="text-lg text-muted-foreground leading-relaxed">
//                     {displayData.description1}
//                   </p>
//                 )
//               )}
//             </motion.div>

//             {/* Description 2 */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 0.6 }}
//               viewport={{ once: true }}
//             >
//               {isEditing ? (
//                 <EditableText
//                   value={displayData.description2}
//                   field="description2"
//                   multiline
//                   className="text-lg text-muted-foreground leading-relaxed"
//                   rows={3}
//                   placeholder="Second description paragraph"
//                 />
//               ) : (
//                 displayData.description2 && (
//                   <p className="text-lg text-muted-foreground leading-relaxed">
//                     {displayData.description2}
//                   </p>
//                 )
//               )}
//             </motion.div>

//             {/* Skills */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 0.8 }}
//               viewport={{ once: true }}
//               className="space-y-4"
//             >
//               {displayData.skills.map((skill, index) => (
//                 <div key={index} className="flex items-center space-x-3 group">
//                   <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
//                   {isEditing ? (
//                     <div className="flex items-center gap-2 w-full">
//                       <EditableText
//                         value={skill}
//                         isSkill
//                         skillIndex={index}
//                         className="text-gray-700 flex-1"
//                         placeholder="Skill description"
//                       />
//                       <Button
//                         onClick={() => removeSkill(index)}
//                         size="sm"
//                         variant="outline"
//                         className="bg-red-50 hover:bg-red-100 text-red-700 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
//                       >
//                         <X className="w-3 h-3" />
//                       </Button>
//                     </div>
//                   ) : (
//                     skill && <span className="text-gray-700">{skill}</span>
//                   )}
//                 </div>
//               ))}
//             </motion.div>

//             {/* CTA Button */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 1 }}
//               viewport={{ once: true }}
//             >
//               {isEditing ? (
//                 <div className="relative">
//                   <EditableText
//                     value={displayData.buttonText || "Let's Connect"}
//                     field="buttonText"
//                     className="inline-block"
//                     placeholder="Button text"
//                   />
//                 </div>
//               ) : (
//                 <AnimatedButton href="#contact" size="lg">
//                   {displayData.buttonText || "Let's Connect"}
//                 </AnimatedButton>
//               )}
//             </motion.div>
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   );
// }

// import { Edit2, Loader2, Save, Upload, X, ZoomIn, ZoomOut } from "lucide-react";

// import { motion } from "motion/react";
// import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import { toast } from "sonner";
// import { AnimatedButton } from "./AnimatedButton";
// import { ImageWithFallback } from "./figma/ImageWithFallback";
// import Cropper from 'react-easy-crop';

// // Text limits
// const TEXT_LIMITS = {
//   HEADING: 60,
//   SUBTITLE: 100,
//   DESCRIPTION1: 500,
//   DESCRIPTION2: 500,
//   SKILL: 40,
//   BUTTON_TEXT: 30,
// };

// // Standardized Button component
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
//       className={`${baseClasses} ${variants[variant || 'default']} ${sizes[size || 'default']
//         } ${className || ""}`}
//       onClick={onClick}
//       disabled={disabled}
//       {...props}
//     >
//       {children}
//     </button>
//   );
// };

// interface AboutData {
//   heading: string;
//   subtitle: string;
//   description1: string;
//   description2: string;
//   skills: string[];
//   imageSrc: string;
//   buttonText?: string;
// }

// interface AboutProps {
//   aboutData?: AboutData;
//   onStateChange?: (data: AboutData) => void;
//   userId?: string;
//   professionalId?: string;
//   templateSelection?: string;
// }

// export function About({
//   aboutData,
//   onStateChange,
//   userId,
//   professionalId,
//   templateSelection,
// }: AboutProps) {
//   const [isEditing, setIsEditing] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);
//   const [isVisible, setIsVisible] = useState(false);
//   const aboutRef = useRef<HTMLDivElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const aboutImageContainerRef = useRef<HTMLDivElement>(null);

//   // Auto-save states
//   const [isAutoSaving, setIsAutoSaving] = useState(false);
//   const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
//   const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);
//   const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();

//   // Pending image file for S3 upload
//   const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);

//   // Cropping states
//   const [showCropper, setShowCropper] = useState(false);
//   const [crop, setCrop] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);
//   const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
//   const [imageToCrop, setImageToCrop] = useState(null);
//   const [originalFile, setOriginalFile] = useState(null);
//   const [aspectRatio] = useState(4 / 3); // Fixed 4:3 aspect ratio

//   // Auto-upload states
//   const [isAutoUploading, setIsAutoUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);

//   // Initialize with props data or empty structure
//   const [data, setData] = useState<AboutData>(aboutData || {
//     heading: "",
//     subtitle: "",
//     description1: "",
//     description2: "",
//     skills: [''],
//     imageSrc: "",
//     buttonText: ""
//   });
//   const [tempData, setTempData] = useState<AboutData>(aboutData || {
//     heading: "",
//     subtitle: "",
//     description1: "",
//     description2: "",
//     skills: [''],
//     imageSrc: "",
//     buttonText: ""
//   });

//   // Auto-save effect
//   useEffect(() => {
//     return () => {
//       // Cleanup timeout on unmount
//       if (autoSaveTimeoutRef.current) {
//         clearTimeout(autoSaveTimeoutRef.current);
//       }
//     };
//   }, []);

//   // Auto-save function
//   const performAutoSave = useCallback(async () => {
//     if (!hasUnsavedChanges || !isEditing) return;

//     setIsAutoSaving(true);
//     try {
//       // Upload any pending images first
//       await uploadPendingImages();

//       // Update data state
//       setData(tempData);
//       setHasUnsavedChanges(false);
//       setLastSavedTime(new Date());

//       toast.success('Changes auto-saved successfully');
//     } catch (error) {
//       console.error('Auto-save failed:', error);
//       toast.error('Auto-save failed. Please save manually.');
//     } finally {
//       setIsAutoSaving(false);
//     }
//   }, [hasUnsavedChanges, isEditing, tempData]);

//   // Schedule auto-save
//   const scheduleAutoSave = useCallback(() => {
//     if (!isEditing) return;

//     setHasUnsavedChanges(true);

//     // Clear existing timeout
//     if (autoSaveTimeoutRef.current) {
//       clearTimeout(autoSaveTimeoutRef.current);
//     }

//     // Set new timeout
//     autoSaveTimeoutRef.current = setTimeout(() => {
//       performAutoSave();
//     }, 2000);
//   }, [isEditing, performAutoSave]);

//   // Upload pending images function
//   const uploadPendingImages = async (): Promise<boolean> => {
//     if (!pendingImageFile) return true;

//     try {
//       setIsAutoUploading(true);
//       setUploadProgress(0);

//       if (!userId || !professionalId || !templateSelection) {
//         toast.error('Missing user information. Please refresh and try again.');
//         return false;
//       }

//       const formData = new FormData();
//       formData.append('file', pendingImageFile);
//       formData.append('userId', userId);
//       formData.append('fieldName', 'about_image');

//       const uploadResponse = await fetch(`https://ow3v94b9gf.execute-api.ap-south-1.amazonaws.com/dev/`, {
//         method: 'POST',
//         body: formData,
//       });

//       if (uploadResponse.ok) {
//         const uploadData = await uploadResponse.json();

//         // Update tempData with the new S3 URL
//         setTempData(prev => ({
//           ...prev,
//           imageSrc: uploadData.s3Url
//         }));

//         // Remove pending file
//         setPendingImageFile(null);
//         setUploadProgress(100);
//         return true;
//       } else {
//         const errorData = await uploadResponse.json();
//         throw new Error(errorData.message || 'Upload failed');
//       }
//     } catch (error) {
//       console.error('Image upload failed:', error);
//       toast.error(`Image upload failed: ${error.message}`);
//       return false;
//     } finally {
//       setIsAutoUploading(false);
//       setUploadProgress(0);
//     }
//   };

//   // Auto-upload image after cropping
//   const autoUploadImage = async (file: File): Promise<string | null> => {
//     if (!userId || !professionalId || !templateSelection) {
//       toast.error('Missing user information for upload.');
//       return null;
//     }

//     try {
//       setIsAutoUploading(true);
//       setUploadProgress(50);

//       const formData = new FormData();
//       formData.append('file', file);
//       formData.append('userId', userId);
//       formData.append('fieldName', 'about_image');

//       const uploadResponse = await fetch(`https://ow3v94b9gf.execute-api.ap-south-1.amazonaws.com/dev/`, {
//         method: 'POST',
//         body: formData,
//       });

//       if (uploadResponse.ok) {
//         const uploadData = await uploadResponse.json();
//         setUploadProgress(100);
//         toast.success('Image uploaded successfully!');
//         return uploadData.s3Url;
//       } else {
//         const errorData = await uploadResponse.json();
//         throw new Error(errorData.message || 'Upload failed');
//       }
//     } catch (error) {
//       console.error('Auto-upload failed:', error);
//       toast.error(`Image upload failed: ${error.message}`);
//       return null;
//     } finally {
//       setIsAutoUploading(false);
//       setUploadProgress(0);
//     }
//   };

//   // FIX: Use ref for onStateChange to prevent infinite loops
//   const onStateChangeRef = useRef(onStateChange);
//   useEffect(() => {
//     onStateChangeRef.current = onStateChange;
//   }, [onStateChange]);

//   // FIX: Track previous data to avoid unnecessary updates
//   const prevDataRef = useRef<AboutData>();
//   useEffect(() => {
//     if (onStateChangeRef.current && prevDataRef.current !== data) {
//       onStateChangeRef.current(data);
//       prevDataRef.current = data;
//     }
//   }, [data]);

//   // Sync with props data when it changes
//   useEffect(() => {
//     if (aboutData) {
//       setData(aboutData);
//       setTempData(aboutData);
//     }
//   }, [aboutData]);

//   // Intersection observer
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => setIsVisible(entry.isIntersecting),
//       { threshold: 0.1 }
//     );
//     if (aboutRef.current) observer.observe(aboutRef.current);
//     return () => {
//       if (aboutRef.current) observer.unobserve(aboutRef.current);
//     };
//   }, []);

//   // Calculate displayData based on editing state
//   const displayData = isEditing ? tempData : data;

//   const handleEdit = () => {
//     setIsEditing(true);
//     setTempData({ ...data });
//     setPendingImageFile(null);
//     setHasUnsavedChanges(false);
//   };

//   // Cropper functions
//   const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
//     setCroppedAreaPixels(croppedAreaPixels);
//   }, []);

//   // Helper function to create image element
//   const createImage = (url) =>
//     new Promise((resolve, reject) => {
//       const image = new Image();
//       image.addEventListener('load', () => resolve(image));
//       image.addEventListener('error', (error) => reject(error));
//       image.setAttribute('crossOrigin', 'anonymous');
//       image.src = url;
//     });

//   // Function to get cropped image
//   const getCroppedImg = async (imageSrc, pixelCrop) => {
//     const image = await createImage(imageSrc);
//     const canvas = document.createElement('canvas');
//     const ctx = canvas.getContext('2d');

//     canvas.width = pixelCrop.width;
//     canvas.height = pixelCrop.height;

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
//       canvas.toBlob((blob) => {
//         const fileName = originalFile ?
//           `cropped-about-${originalFile.name}` :
//           `cropped-about-${Date.now()}.jpg`;

//         const file = new File([blob], fileName, {
//           type: 'image/jpeg',
//           lastModified: Date.now()
//         });

//         const previewUrl = URL.createObjectURL(blob);

//         resolve({
//           file,
//           previewUrl
//         });
//       }, 'image/jpeg', 0.95);
//     });
//   };

//   // Handle image selection - opens cropper
//   const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     if (!file.type.startsWith('image/')) {
//       toast.error('Please select an image file');
//       return;
//     }

//     if (file.size > 5 * 1024 * 1024) { // 5MB limit
//       toast.error('File size must be less than 5MB');
//       return;
//     }

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setImageToCrop(reader.result);
//       setOriginalFile(file);
//       setShowCropper(true);
//       setZoom(1);
//       setCrop({ x: 0, y: 0 });
//     };
//     reader.readAsDataURL(file);

//     // Clear the file input
//     event.target.value = '';
//   };

//   // Apply crop and auto-upload
//   const applyCrop = async () => {
//     try {
//       if (!imageToCrop || !croppedAreaPixels) return;

//       setIsAutoUploading(true);
//       setUploadProgress(0);

//       const { file, previewUrl } = await getCroppedImg(imageToCrop, croppedAreaPixels);

//       // Auto-upload the cropped image
//       setUploadProgress(30);
//       const s3Url = await autoUploadImage(file);

//       if (s3Url) {
//         // Update with S3 URL directly
//         setTempData(prev => ({
//           ...prev,
//           imageSrc: s3Url
//         }));

//         // Schedule auto-save for the content change
//         scheduleAutoSave();

//         toast.success('Image cropped and uploaded successfully!');
//       } else {
//         // Fallback: use preview URL and store file for manual save
//         setTempData(prev => ({
//           ...prev,
//           imageSrc: previewUrl
//         }));

//         // Store the file for manual upload
//         setPendingImageFile(file);
//         scheduleAutoSave();
//         toast.warning('Image cropped but upload failed. Changes will be auto-saved.');
//       }

//       setShowCropper(false);
//       setImageToCrop(null);
//       setOriginalFile(null);
//     } catch (error) {
//       console.error('Error cropping image:', error);
//       toast.error('Error cropping image. Please try again.');
//     } finally {
//       setIsAutoUploading(false);
//       setUploadProgress(0);
//     }
//   };

//   // Cancel cropping
//   const cancelCrop = () => {
//     setShowCropper(false);
//     setImageToCrop(null);
//     setOriginalFile(null);
//     setCrop({ x: 0, y: 0 });
//     setZoom(1);
//   };

//   // Reset zoom
//   const resetCropSettings = () => {
//     setZoom(1);
//     setCrop({ x: 0, y: 0 });
//   };

//   // Save function with S3 upload (preserved for manual save)
//   const handleSave = async () => {
//     try {
//       setIsUploading(true);
//       setIsSaving(true);

//       // Upload any remaining pending images
//       const uploadSuccess = await uploadPendingImages();
//       if (!uploadSuccess) {
//         return;
//       }

//       // Update data state
//       setData(tempData);
//       setHasUnsavedChanges(false);
//       setLastSavedTime(new Date());

//       setIsEditing(false);
//       toast.success('About section saved successfully');

//     } catch (error) {
//       console.error('Error saving about section:', error);
//       toast.error('Error saving changes. Please try again.');
//     } finally {
//       setIsUploading(false);
//       setIsSaving(false);
//     }
//   };

//   const handleCancel = () => {
//     setTempData({ ...data });
//     setPendingImageFile(null);
//     setHasUnsavedChanges(false);
//     setIsEditing(false);

//     // Clear any pending auto-save
//     if (autoSaveTimeoutRef.current) {
//       clearTimeout(autoSaveTimeoutRef.current);
//     }
//   };

//   // Stable update functions with useCallback and auto-save scheduling
//   const updateTempContent = useCallback((field: keyof AboutData, value: string) => {
//     setTempData(prev => ({ ...prev, [field]: value }));
//     scheduleAutoSave();
//   }, [scheduleAutoSave]);

//   const updateSkill = useCallback((index: number, value: string) => {
//     setTempData(prevData => {
//       const updatedSkills = [...prevData.skills];
//       updatedSkills[index] = value;
//       return { ...prevData, skills: updatedSkills };
//     });
//     scheduleAutoSave();
//   }, [scheduleAutoSave]);

//   const addSkill = useCallback(() => {
//     setTempData(prevData => ({
//       ...prevData,
//       skills: [...prevData.skills, "New skill"]
//     }));
//     scheduleAutoSave();
//   }, [scheduleAutoSave]);

//   const removeSkill = useCallback((index: number) => {
//     setTempData(prevData => {
//       if (prevData.skills.length <= 1) {
//         toast.error("You must have at least one skill");
//         return prevData;
//       }
//       return {
//         ...prevData,
//         skills: prevData.skills.filter((_, i) => i !== index)
//       };
//     });
//     scheduleAutoSave();
//   }, [scheduleAutoSave]);

//   // Memoized EditableText component
//   const EditableText = useMemo(() => {
//     return ({
//       value,
//       field,
//       multiline = false,
//       className = "",
//       placeholder = "",
//       rows = 3,
//       isSkill = false,
//       skillIndex,
//     }: {
//       value: string;
//       field?: keyof AboutData;
//       multiline?: boolean;
//       className?: string;
//       placeholder?: string;
//       rows?: number;
//       isSkill?: boolean;
//       skillIndex?: number;
//     }) => {
//       const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//         const newValue = e.target.value;
//         if (isSkill && skillIndex !== undefined) {
//           updateSkill(skillIndex, newValue);
//         } else if (field) {
//           updateTempContent(field, newValue);
//         }
//       };

//       const getMaxLength = () => {
//         if (isSkill) return TEXT_LIMITS.SKILL;
//         if (field === 'heading') return TEXT_LIMITS.HEADING;
//         if (field === 'subtitle') return TEXT_LIMITS.SUBTITLE;
//         if (field === 'description1' || field === 'description2') return TEXT_LIMITS.DESCRIPTION1;
//         if (field === 'buttonText') return TEXT_LIMITS.BUTTON_TEXT;
//         return undefined;
//       };

//       const maxLength = getMaxLength();
//       const currentLength = value?.length || 0;

//       const baseClasses = "w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none";

//       if (multiline) {
//         return (
//           <div className="relative">
//             <textarea
//               value={value}
//               onChange={handleChange}
//               className={`${baseClasses} p-2 resize-none ${className}`}
//               placeholder={placeholder}
//               rows={rows}
//               maxLength={maxLength}
//             />
//             {maxLength && (
//               <div className="absolute right-2 bottom-2 text-xs text-gray-500">
//                 {currentLength}/{maxLength}
//               </div>
//             )}
//           </div>
//         );
//       }

//       return (
//         <div className="relative">
//           <input
//             type='text'
//             value={value}
//             onChange={handleChange}
//             className={`${baseClasses} p-1 ${className}`}
//             placeholder={placeholder}
//             maxLength={maxLength}
//           />
//           {maxLength && (
//             <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
//               {currentLength}/{maxLength}
//             </div>
//           )}
//         </div>
//       );
//     };
//   }, [updateTempContent, updateSkill]);

//   // Check if there's any meaningful data to display
//   const hasData = data.heading ||
//                   data.subtitle ||
//                   data.description1 ||
//                   data.description2 ||
//                   (data.skills.length > 0 && data.skills[0] !== '') ||
//                   data.imageSrc;

//   // No data state - show empty state with option to add data
//   if (!isEditing && !hasData) {
//     return (
//       <section ref={aboutRef} id="about" className="relative py-20 bg-background">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           {/* Edit Controls */}
//           <div className='text-right mb-8'>
//             <Button
//               onClick={handleEdit}
//               size='sm'
//               className='bg-red-500 hover:bg-red-600 text-white shadow-md'
//             >
//               <Edit2 className='w-4 h-4 mr-2' />
//               Add About Content
//             </Button>
//           </div>

//           {/* Empty State */}
//           <div className="text-center py-16">
//             <div className="max-w-md mx-auto">
//               <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
//                 <span className="text-2xl">👤</span>
//               </div>
//               <h3 className="text-2xl font-semibold text-foreground mb-4">
//                 No About Content Found
//               </h3>
//               <p className="text-muted-foreground mb-8">
//                 Tell your story and showcase your skills to help visitors get to know you better.
//               </p>
//               <Button
//                 onClick={handleEdit}
//                 size='lg'
//                 className='bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg'
//               >
//                 <Edit2 className='w-5 h-5 mr-2' />
//                 Add About Content
//               </Button>
//             </div>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section ref={aboutRef} id="about" className="relative text-justify py-20 bg-background">
//       {/* Image Cropper Modal with Auto-upload Progress */}
//       {showCropper && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="fixed inset-0 bg-black/90 z-[99999999] flex items-center justify-center p-4"
//         >
//           <motion.div
//             initial={{ scale: 0.9, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             className="bg-white rounded-xl max-w-6xl w-full h-[90vh] flex flex-col"
//           >
//             {/* Header */}
//             <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
//               <h3 className="text-lg font-semibold text-gray-800">
//                 Crop About Image (4:3 Aspect Ratio)
//                 {isAutoUploading && (
//                   <span className="ml-2 text-blue-600 text-sm">Uploading... {uploadProgress}%</span>
//                 )}
//               </h3>
//               <button
//                 onClick={cancelCrop}
//                 className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
//                 disabled={isAutoUploading}
//               >
//                 <X className="w-5 h-5 text-gray-600" />
//               </button>
//             </div>

//             {/* Cropper Area */}
//             <div className="flex-1 relative bg-gray-900 min-h-0">
//               <Cropper
//                 image={imageToCrop}
//                 crop={crop}
//                 zoom={zoom}
//                 aspect={aspectRatio}
//                 onCropChange={setCrop}
//                 onZoomChange={setZoom}
//                 onCropComplete={onCropComplete}
//                 showGrid={false}
//                 cropShape="rect"
//                 minZoom={0.1}
//                 maxZoom={5}
//                 restrictPosition={false}
//                 zoomWithScroll={true}
//                 zoomSpeed={0.2}
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

//             {/* Upload Progress Bar */}
//             {isAutoUploading && (
//               <div className="px-4 pt-2">
//                 <div className="w-full bg-gray-200 rounded-full h-2">
//                   <div
//                     className="bg-blue-600 h-2 rounded-full transition-all duration-300"
//                     style={{ width: `${uploadProgress}%` }}
//                   ></div>
//                 </div>
//               </div>
//             )}

//             {/* Controls */}
//             <div className="p-4 bg-gray-50 border-t border-gray-200">
//               {/* Aspect Ratio Info */}
//               <div className="mb-4">
//                 <p className="text-sm font-medium text-gray-700 mb-2">
//                   Aspect Ratio: <span className="text-blue-600">4:3 (Standard)</span>
//                 </p>
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
//                 <div className="flex items-center gap-2">
//                   <button
//                     type="button"
//                     onClick={() => setZoom((z) => Math.max(0.1, +(z - 0.1).toFixed(2)))}
//                     className="p-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
//                     disabled={isAutoUploading}
//                   >
//                     <ZoomOut className="w-4 h-4" />
//                   </button>
//                   <input
//                     type="range"
//                     value={zoom}
//                     min={0.1}
//                     max={5}
//                     step={0.1}
//                     onChange={(e) => setZoom(Number(e.target.value))}
//                     className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
//                     disabled={isAutoUploading}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setZoom((z) => Math.min(5, +(z + 0.1).toFixed(2)))}
//                     className="p-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
//                     disabled={isAutoUploading}
//                   >
//                     <ZoomIn className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>

//               {/* Action Buttons - Moved to bottom and centered */}
//               <div className="flex justify-center gap-3 pt-4">
//                 <button
//                   onClick={resetCropSettings}
//                   className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded text-sm font-medium transition-colors"
//                   disabled={isAutoUploading}
//                 >
//                   Reset Zoom
//                 </button>
//                 <button
//                   onClick={cancelCrop}
//                   className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded text-sm font-medium transition-colors"
//                   disabled={isAutoUploading}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={applyCrop}
//                   className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium transition-colors flex items-center gap-2"
//                   disabled={isAutoUploading}
//                 >
//                   {isAutoUploading ? (
//                     <Loader2 className="w-4 h-4 animate-spin" />
//                   ) : null}
//                   {isAutoUploading ? 'Uploading...' : 'Apply & Upload'}
//                 </button>
//               </div>
//             </div>
//           </motion.div>
//         </motion.div>
//       )}

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Edit Controls with Auto-save Status */}
//         <div className='text-right z-50 mb-20'>
//           {/* Auto-save Status */}
//           {isEditing && (
//             <div className="flex items-center justify-end gap-4 mb-4 text-sm">
//               {hasUnsavedChanges && (
//                 <div className="flex items-center gap-2 text-orange-600">
//                   <div className="w-2 h-2 bg-orange-600 rounded-full animate-pulse"></div>
//                   Unsaved changes
//                 </div>
//               )}
//               {isAutoSaving && (
//                 <div className="flex items-center gap-2 text-blue-600">
//                   <Loader2 className="w-3 h-3 animate-spin" />
//                   Auto-saving...
//                 </div>
//               )}
//               {lastSavedTime && !hasUnsavedChanges && !isAutoSaving && (
//                 <div className="text-green-600">
//                   Saved {lastSavedTime.toLocaleTimeString()}
//                 </div>
//               )}
//             </div>
//           )}

//           {!isEditing ? (
//             <Button
//               onClick={handleEdit}
//               size='sm'
//               className='bg-red-500 hover:bg-red-600 text-white shadow-md'
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
//                 disabled={isSaving || isUploading}
//               >
//                 {isUploading ? (
//                   <Loader2 className='w-4 h-4 mr-2 animate-spin' />
//                 ) : isSaving ? (
//                   <Loader2 className='w-4 h-4 mr-2 animate-spin' />
//                 ) : (
//                   <Save className='w-4 h-4 mr-2' />
//                 )}
//                 {isUploading ? "Uploading..." : isSaving ? "Saving..." : "Save"}
//               </Button>
//               <Button
//                 onClick={handleCancel}
//                 size='sm'
//                 className='bg-red-500 hover:bg-red-600 shadow-md text-white'
//                 disabled={isSaving || isUploading}
//               >
//                 <X className='w-4 h-4 mr-2' />
//                 Cancel
//               </Button>
//               {isEditing && (
//                 <Button
//                   onClick={addSkill}
//                   variant='outline'
//                   size='sm'
//                   className='bg-blue-50 hover:bg-blue-100 text-blue-700 shadow-md'
//                 >
//                   Add Skill
//                 </Button>
//               )}
//             </div>
//           )}
//         </div>

//         <div className="grid lg:grid-cols-2 gap-12 items-start">
//           {/* Left Content - Image */}
//           <motion.div
//             initial={{ opacity: 0, x: -50 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.8 }}
//             viewport={{ once: true }}
//             className="relative"
//           >
//             {isEditing && (
//               <div className="absolute top-2 right-2 z-10">
//                 <div className="bg-white/90 backdrop-blur-sm shadow-md rounded p-2">
//                   <Button
//                     onClick={() => fileInputRef.current?.click()}
//                     size="sm"
//                     variant="outline"
//                     className="bg-white text-black hover:bg-gray-100"
//                   >
//                     <Upload className="w-4 h-4 mr-2" />
//                     Change Image
//                   </Button>
//                   <input
//                     ref={fileInputRef}
//                     type="file"
//                     accept="image/*"
//                     onChange={handleImageSelect}
//                     className="hidden"
//                   />
//                   {pendingImageFile && (
//                     <p className="text-xs text-orange-600 mt-1 bg-white p-1 rounded">
//                       Image selected: {pendingImageFile.name}
//                     </p>
//                   )}
//                   <div className='text-xs text-gray-500 mt-1 text-center'>
//                     Recommended: {Math.round(aboutImageContainerRef.current?.offsetWidth || 400)}×{Math.round((aboutImageContainerRef.current?.offsetWidth || 400) * (4/3))}px (3:4 ratio) - Portrait
//                   </div>
//                 </div>
//               </div>
//             )}

//             <motion.div
//               ref={aboutImageContainerRef}
//               whileHover={{ scale: 1.05 }}
//               transition={{ duration: 0.3 }}
//               className="relative"
//             >
//               <div className="absolute inset-0 bg-yellow-400 rounded-3xl transform -rotate-6"></div>
//               <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl">
//                 {displayData.imageSrc ? (
//                   <img
//                     src={displayData.imageSrc}
//                     alt="About me"
//                     className="w-full h-96 object-cover"
//                     onError={(e) => {
//                       const target = e.target as HTMLImageElement;
//                       target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23f3f4f6" width="400" height="400"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="18" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EProfile Image%3C/text%3E%3C/svg%3E';
//                     }}
//                   />
//                 ) : (
//                   <div className="w-full h-96 flex items-center justify-center bg-gray-200">
//                     <p className="text-gray-400 text-sm">No image uploaded</p>
//                   </div>
//                 )}
//               </div>
//             </motion.div>
//           </motion.div>

//           {/* Right Content */}
//           <motion.div
//             initial={{ opacity: 0, x: 50 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.8 }}
//             viewport={{ once: true }}
//             className="space-y-6 relative"
//           >
//             {/* Heading */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 0.2 }}
//               viewport={{ once: true }}
//             >
//               {isEditing ? (
//                 <div className="space-y-4">
//                   <EditableText
//                     value={displayData.heading}
//                     field="heading"
//                     className="text-3xl sm:text-4xl font-bold text-foreground"
//                     placeholder="Main heading"
//                   />
//                   <EditableText
//                     value={displayData.subtitle}
//                     field="subtitle"
//                     className="text-xl text-yellow-500 font-semibold"
//                     placeholder="Subtitle"
//                   />
//                 </div>
//               ) : (
//                 <div>
//                   {displayData.heading && (
//                     <h2 className="text-3xl sm:text-4xl text-foreground font-bold">
//                       {displayData.heading}
//                     </h2>
//                   )}
//                   {displayData.subtitle && (
//                     <p className="text-xl text-yellow-500 font-semibold mt-2">
//                       {displayData.subtitle}
//                     </p>
//                   )}
//                 </div>
//               )}
//             </motion.div>

//             {/* Description 1 */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 0.4 }}
//               viewport={{ once: true }}
//             >
//               {isEditing ? (
//                 <EditableText
//                   value={displayData.description1}
//                   field="description1"
//                   multiline
//                   className="text-lg text-muted-foreground leading-relaxed"
//                   rows={3}
//                   placeholder="First description paragraph"
//                 />
//               ) : (
//                 displayData.description1 && (
//                   <p className="text-lg text-muted-foreground leading-relaxed">
//                     {displayData.description1}
//                   </p>
//                 )
//               )}
//             </motion.div>

//             {/* Description 2 */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 0.6 }}
//               viewport={{ once: true }}
//             >
//               {isEditing ? (
//                 <EditableText
//                   value={displayData.description2}
//                   field="description2"
//                   multiline
//                   className="text-lg text-muted-foreground leading-relaxed"
//                   rows={3}
//                   placeholder="Second description paragraph"
//                 />
//               ) : (
//                 displayData.description2 && (
//                   <p className="text-lg text-muted-foreground leading-relaxed">
//                     {displayData.description2}
//                   </p>
//                 )
//               )}
//             </motion.div>

//             {/* Skills */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 0.8 }}
//               viewport={{ once: true }}
//               className="space-y-4"
//             >
//               {displayData.skills.map((skill, index) => (
//                 <div key={index} className="flex items-center space-x-3 group">
//                   <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
//                   {isEditing ? (
//                     <div className="flex items-center gap-2 w-full">
//                       <EditableText
//                         value={skill}
//                         isSkill
//                         skillIndex={index}
//                         className="text-gray-700 flex-1"
//                         placeholder="Skill description"
//                       />
//                       <Button
//                         onClick={() => removeSkill(index)}
//                         size="sm"
//                         variant="outline"
//                         className="bg-red-50 hover:bg-red-100 text-red-700 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
//                       >
//                         <X className="w-3 h-3" />
//                       </Button>
//                     </div>
//                   ) : (
//                     skill && <span className="text-gray-700">{skill}</span>
//                   )}
//                 </div>
//               ))}
//             </motion.div>

//             {/* CTA Button */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 1 }}
//               viewport={{ once: true }}
//             >
//               {isEditing ? (
//                 <div className="relative">
//                   <EditableText
//                     value={displayData.buttonText || "Let's Connect"}
//                     field="buttonText"
//                     className="inline-block"
//                     placeholder="Button text"
//                   />
//                 </div>
//               ) : (
//                 <AnimatedButton href="#contact" size="lg">
//                   {displayData.buttonText || "Let's Connect"}
//                 </AnimatedButton>
//               )}
//             </motion.div>
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   );
// }

import { Edit2, Loader2, Save, Upload, X, ZoomIn, ZoomOut } from "lucide-react";

import { motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { AnimatedButton } from "./AnimatedButton";
import Cropper from "react-easy-crop";

// Text limits
const TEXT_LIMITS = {
  HEADING: 60,
  SUBTITLE: 100,
  DESCRIPTION1: 500,
  DESCRIPTION2: 500,
  SKILL: 40,
  BUTTON_TEXT: 30,
};

// Standardized Button component
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

interface AboutData {
  heading: string;
  subtitle: string;
  description1: string;
  description2: string;
  skills: string[];
  imageSrc: string;
  buttonText?: string;
}

interface AboutProps {
  aboutData?: AboutData;
  onStateChange?: (data: AboutData) => void;
  userId?: string;
  professionalId?: string;
  templateSelection?: string;
}

export function About({
  aboutData,
  onStateChange,
  userId,
  professionalId,
  templateSelection,
}: AboutProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const aboutRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const aboutImageContainerRef = useRef<HTMLDivElement>(null);

  // Auto-save states
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();
  const lastSavedDataRef = useRef<AboutData | null>(null);

  // Cropping states
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [aspectRatio] = useState(4 / 3); // Fixed 4:3 aspect ratio

  // Initialize with props data or empty structure
  const [data, setData] = useState<AboutData>(
    aboutData || {
      heading: "",
      subtitle: "",
      description1: "",
      description2: "",
      skills: [""],
      imageSrc: "",
      buttonText: "",
    }
  );
  const [tempData, setTempData] = useState<AboutData>(
    aboutData || {
      heading: "",
      subtitle: "",
      description1: "",
      description2: "",
      skills: [""],
      imageSrc: "",
      buttonText: "",
    }
  );

  // FIX: Use ref for onStateChange to prevent infinite loops
  const onStateChangeRef = useRef(onStateChange);
  useEffect(() => {
    onStateChangeRef.current = onStateChange;
  }, [onStateChange]);

  // FIX: Track previous data to avoid unnecessary updates
  const prevDataRef = useRef<AboutData>();
  useEffect(() => {
    if (onStateChangeRef.current && prevDataRef.current !== data) {
      onStateChangeRef.current(data);
      prevDataRef.current = data;
    }
  }, [data]);

  // Sync with props data when it changes
  useEffect(() => {
    if (aboutData) {
      setData(aboutData);
      setTempData(aboutData);
      lastSavedDataRef.current = aboutData;
    }
  }, [aboutData]);

  // Auto-save functionality
  const performAutoSave = useCallback(async (dataToSave: AboutData) => {
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

      console.log("Auto-save completed:", dataToSave);
    } catch (error) {
      console.error("Auto-save failed:", error);
      toast.error("Failed to auto-save changes");
    } finally {
      setIsAutoSaving(false);
    }
  }, []);

  const scheduleAutoSave = useCallback(
    (updatedData: AboutData) => {
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

  // Intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (aboutRef.current) observer.observe(aboutRef.current);
    return () => {
      if (aboutRef.current) observer.unobserve(aboutRef.current);
    };
  }, []);

  // Calculate displayData based on editing state
  const displayData = isEditing ? tempData : data;

  const handleEdit = () => {
    setIsEditing(true);
    setTempData({ ...data });
    setHasUnsavedChanges(false);
  };

  // Cropper functions
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Helper function to create image element
  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  // Function to get cropped image
  const getCroppedImg = async (imageSrc: string, pixelCrop: any) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) throw new Error("Could not get canvas context");

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

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

    return new Promise<{ file: File; previewUrl: string }>((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) throw new Error("Could not create blob");

          const fileName = originalFile
            ? `cropped-about-${(originalFile as any).name}`
            : `cropped-about-${Date.now()}.jpg`;

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

  // Upload image to S3
  const uploadImageToS3 = async (file: File): Promise<string> => {
    if (!userId || !professionalId) {
      throw new Error("Missing user information");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);
    formData.append("fieldName", "about_image");

    const uploadResponse = await fetch(
      `https://ow3v94b9gf.execute-api.ap-south-1.amazonaws.com/dev/`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json();
      throw new Error(errorData.message || "Upload failed");
    }

    const uploadData = await uploadResponse.json();
    return uploadData.s3Url;
  };

  // Handle image selection - opens cropper
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      toast.error("File size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageToCrop(reader.result as any);
      setOriginalFile(file as any);
      setShowCropper(true);
      setZoom(1);
      setCrop({ x: 0, y: 0 });
    };
    reader.readAsDataURL(file);

    // Clear the file input
    event.target.value = "";
  };

  // Apply crop and automatically upload to S3
  const applyCrop = async () => {
    try {
      if (!imageToCrop || !croppedAreaPixels) return;

      setIsUploading(true);

      const { file, previewUrl } = await getCroppedImg(
        imageToCrop as string,
        croppedAreaPixels
      );

      // Update preview immediately with blob URL (temporary)
      const updatedData = {
        ...tempData,
        imageSrc: previewUrl,
      };
      setTempData(updatedData);
      scheduleAutoSave(updatedData);

      // Upload to S3 immediately
      try {
        const s3Url = await uploadImageToS3(file);

        // Update with S3 URL
        const finalUpdatedData = {
          ...tempData,
          imageSrc: s3Url,
        };
        setTempData(finalUpdatedData);
        performAutoSave(finalUpdatedData); // Immediate save with S3 URL

        toast.success("Image uploaded and saved successfully!");
      } catch (uploadError) {
        console.error("Upload failed:", uploadError);
        toast.error("Image upload failed, but local copy is saved");
        // Content with blob URL is already saved via auto-save
      }

      setShowCropper(false);
      setImageToCrop(null);
      setOriginalFile(null);
      setIsUploading(false);
    } catch (error) {
      console.error("Error cropping image:", error);
      toast.error("Failed to crop image");
      setShowCropper(false);
      setIsUploading(false);
    }
  };

  // Cancel cropping
  const cancelCrop = () => {
    setShowCropper(false);
    setImageToCrop(null);
    setOriginalFile(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  // Reset zoom
  const resetCropSettings = () => {
    setZoom(1);
    setCrop({ x: 0, y: 0 });
  };

  // Manual save function
  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Clear any pending auto-save
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      // Transform data back to backend format before saving
      const backendData = tempData;

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setData(tempData);
      lastSavedDataRef.current = tempData;
      setIsEditing(false);
      setHasUnsavedChanges(false);

      if (onStateChangeRef.current) {
        onStateChangeRef.current(backendData);
      }

      toast.success("About section saved successfully!");
    } catch (error) {
      console.error("Error saving about section:", error);
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

  // Stable update functions with useCallback and auto-save scheduling
  const updateTempContent = useCallback(
    (field: keyof AboutData, value: string) => {
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

  const updateSkill = useCallback(
    (index: number, value: string) => {
      setTempData((prevData) => {
        const updatedSkills = [...prevData.skills];
        updatedSkills[index] = value;
        const updated = {
          ...prevData,
          skills: updatedSkills,
        };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  const addSkill = useCallback(() => {
    setTempData((prevData) => {
      const updated = {
        ...prevData,
        skills: [...prevData.skills, "New skill"],
      };
      scheduleAutoSave(updated);
      return updated;
    });
  }, [scheduleAutoSave]);

  const removeSkill = useCallback(
    (index: number) => {
      setTempData((prevData) => {
        if (prevData.skills.length <= 1) {
          toast.error("You must have at least one skill");
          return prevData;
        }
        const updated = {
          ...prevData,
          skills: prevData.skills.filter((_, i) => i !== index),
        };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  // Memoized EditableText component
  const EditableText = useMemo(() => {
    return ({
      value,
      field,
      multiline = false,
      className = "",
      placeholder = "",
      rows = 3,
      isSkill = false,
      skillIndex,
    }: {
      value: string;
      field?: keyof AboutData;
      multiline?: boolean;
      className?: string;
      placeholder?: string;
      rows?: number;
      isSkill?: boolean;
      skillIndex?: number;
    }) => {
      const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => {
        const newValue = e.target.value;
        if (isSkill && skillIndex !== undefined) {
          updateSkill(skillIndex, newValue);
        } else if (field) {
          updateTempContent(field, newValue);
        }
      };

      const getMaxLength = () => {
        if (isSkill) return TEXT_LIMITS.SKILL;
        if (field === "heading") return TEXT_LIMITS.HEADING;
        if (field === "subtitle") return TEXT_LIMITS.SUBTITLE;
        if (field === "description1" || field === "description2")
          return TEXT_LIMITS.DESCRIPTION1;
        if (field === "buttonText") return TEXT_LIMITS.BUTTON_TEXT;
        return undefined;
      };

      const maxLength = getMaxLength();
      const currentLength = value?.length || 0;

      const baseClasses =
        "w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none";

      if (multiline) {
        return (
          <div className="relative">
            <textarea
              value={value}
              onChange={handleChange}
              className={`${baseClasses} p-2 resize-none ${className}`}
              placeholder={placeholder}
              rows={rows}
              maxLength={maxLength}
            />
            {maxLength && (
              <div className="absolute right-2 bottom-2 text-xs text-gray-500">
                {currentLength}/{maxLength}
              </div>
            )}
          </div>
        );
      }

      return (
        <div className="relative">
          <input
            type="text"
            value={value}
            onChange={handleChange}
            className={`${baseClasses} p-1 ${className}`}
            placeholder={placeholder}
            maxLength={maxLength}
          />
          {maxLength && (
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
              {currentLength}/{maxLength}
            </div>
          )}
        </div>
      );
    };
  }, [updateTempContent, updateSkill]);

  // Check if there's any meaningful data to display
  const hasData =
    data.heading ||
    data.subtitle ||
    data.description1 ||
    data.description2 ||
    (data.skills.length > 0 && data.skills[0] !== "") ||
    data.imageSrc;

  // No data state - show empty state with option to add data
  if (!isEditing && !hasData) {
    return (
      <section
        ref={aboutRef}
        id="about"
        className="relative py-20 bg-background"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Edit Controls */}
          <div className="text-right mb-8">
            <Button
              onClick={handleEdit}
              size="sm"
              className="bg-red-500 hover:bg-red-600 text-white shadow-md"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Add About Content
            </Button>
          </div>

          {/* Empty State */}
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">👤</span>
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                No About Content Found
              </h3>
              <p className="text-muted-foreground mb-8">
                Tell your story and showcase your skills to help visitors get to
                know you better.
              </p>
              <Button
                onClick={handleEdit}
                size="lg"
                className="bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg"
              >
                <Edit2 className="w-5 h-5 mr-2" />
                Add About Content
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={aboutRef}
      id="about"
      className="relative text-justify py-20 bg-background"
    >
      {/* Image Cropper Modal */}
      {showCropper && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/90 z-[99999999] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl max-w-6xl w-full h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800">
                Crop About Image (4:3 Aspect Ratio)
                {isUploading && (
                  <span className="ml-2 text-blue-600 text-sm flex items-center gap-1">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading...
                  </span>
                )}
              </h3>
              <button
                onClick={cancelCrop}
                className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
                disabled={isUploading}
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Cropper Area */}
            <div className="flex-1 relative bg-gray-900 min-h-0">
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                aspect={aspectRatio}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                showGrid={false}
                cropShape="rect"
                minZoom={0.1}
                maxZoom={5}
                restrictPosition={false}
                zoomWithScroll={true}
                zoomSpeed={0.2}
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
              {/* Aspect Ratio Info */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Aspect Ratio:{" "}
                  <span className="text-blue-600">4:3 (Standard)</span>
                </p>
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
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setZoom((z) => Math.max(0.1, +(z - 0.1).toFixed(2)))
                    }
                    className="p-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
                    disabled={isUploading}
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <input
                    type="range"
                    value={zoom}
                    min={0.1}
                    max={5}
                    step={0.1}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
                    disabled={isUploading}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setZoom((z) => Math.min(5, +(z + 0.1).toFixed(2)))
                    }
                    className="p-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
                    disabled={isUploading}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons - Moved to bottom and centered */}
              <div className="flex justify-center gap-3 pt-4">
                <button
                  onClick={resetCropSettings}
                  className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded text-sm font-medium transition-colors disabled:opacity-50"
                  disabled={isUploading}
                >
                  Reset Zoom
                </button>
                <button
                  onClick={cancelCrop}
                  className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded text-sm font-medium transition-colors disabled:opacity-50"
                  disabled={isUploading}
                >
                  Cancel
                </button>
                <button
                  onClick={applyCrop}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Apply & Upload"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Edit Controls with Auto-save Status */}
        <div className="text-right z-50 mb-20">
          {/* Auto-save Status */}
          {isEditing && (
            <div className="flex items-center justify-end gap-4 mb-4 text-sm">
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
              className="bg-red-500 hover:bg-red-600 text-white shadow-md"
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
                disabled={isSaving || isUploading}
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
                disabled={isSaving || isUploading}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              {isEditing && (
                <Button
                  onClick={addSkill}
                  variant="outline"
                  size="sm"
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 shadow-md"
                >
                  Add Skill
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Content - Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            {isEditing && (
              <div className="absolute top-2 right-2 z-10">
                <div className="bg-white/90 backdrop-blur-sm shadow-md rounded p-2">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    size="sm"
                    variant="outline"
                    className="bg-white text-black hover:bg-gray-100"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Change Image
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <div className="text-xs text-gray-500 mt-1 text-center">
                    Recommended:{" "}
                    {Math.round(
                      aboutImageContainerRef.current?.offsetWidth || 400
                    )}
                    ×
                    {Math.round(
                      (aboutImageContainerRef.current?.offsetWidth || 400) *
                        (4 / 3)
                    )}
                    px (3:4 ratio) - Portrait
                  </div>
                </div>
              </div>
            )}

            <motion.div
              ref={aboutImageContainerRef}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-yellow-400 rounded-3xl transform -rotate-6"></div>
              <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl">
                {displayData.imageSrc ? (
                  <img
                    src={displayData.imageSrc}
                    alt="About me"
                    className="w-full h-96 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23f3f4f6" width="400" height="400"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="18" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EProfile Image%3C/text%3E%3C/svg%3E';
                    }}
                  />
                ) : (
                  <div className="w-full h-96 flex items-center justify-center bg-gray-200">
                    <p className="text-gray-400 text-sm">No image uploaded</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6 relative"
          >
            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {isEditing ? (
                <div className="space-y-4">
                  <EditableText
                    value={displayData.heading}
                    field="heading"
                    className="text-3xl sm:text-4xl font-bold text-foreground"
                    placeholder="Main heading"
                  />
                  <EditableText
                    value={displayData.subtitle}
                    field="subtitle"
                    className="text-xl text-yellow-500 font-semibold"
                    placeholder="Subtitle"
                  />
                </div>
              ) : (
                <div>
                  {displayData.heading && (
                    <h2 className="text-3xl sm:text-4xl text-foreground font-bold">
                      {displayData.heading}
                    </h2>
                  )}
                  {displayData.subtitle && (
                    <p className="text-xl text-yellow-500 font-semibold mt-2">
                      {displayData.subtitle}
                    </p>
                  )}
                </div>
              )}
            </motion.div>

            {/* Description 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              {isEditing ? (
                <EditableText
                  value={displayData.description1}
                  field="description1"
                  multiline
                  className="text-lg text-muted-foreground leading-relaxed"
                  rows={3}
                  placeholder="First description paragraph"
                />
              ) : (
                displayData.description1 && (
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {displayData.description1}
                  </p>
                )
              )}
            </motion.div>

            {/* Description 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              {isEditing ? (
                <EditableText
                  value={displayData.description2}
                  field="description2"
                  multiline
                  className="text-lg text-muted-foreground leading-relaxed"
                  rows={3}
                  placeholder="Second description paragraph"
                />
              ) : (
                displayData.description2 && (
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {displayData.description2}
                  </p>
                )
              )}
            </motion.div>

            {/* Skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              {displayData.skills.map((skill, index) => (
                <div key={index} className="flex items-center space-x-3 group">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  {isEditing ? (
                    <div className="flex items-center gap-2 w-full">
                      <EditableText
                        value={skill}
                        isSkill
                        skillIndex={index}
                        className="text-gray-700 flex-1"
                        placeholder="Skill description"
                      />
                      <Button
                        onClick={() => removeSkill(index)}
                        size="sm"
                        variant="outline"
                        className="bg-red-50 hover:bg-red-100 text-red-700 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    skill && <span className="text-gray-700">{skill}</span>
                  )}
                </div>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              viewport={{ once: true }}
            >
              {isEditing ? (
                <div className="relative">
                  <EditableText
                    value={displayData.buttonText || "Let's Connect"}
                    field="buttonText"
                    className="inline-block"
                    placeholder="Button text"
                  />
                </div>
              ) : (
                <AnimatedButton href="#contact" size="lg">
                  {displayData.buttonText || "Let's Connect"}
                </AnimatedButton>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
