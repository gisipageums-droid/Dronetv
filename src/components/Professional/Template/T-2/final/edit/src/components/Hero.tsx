// import { Edit2, Loader2, Save, Upload, X, ZoomIn, ZoomOut } from 'lucide-react';

// import { motion } from 'motion/react';
// import { createPortal } from 'react-dom';

// import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// import { toast } from 'sonner';
// import Cropper from 'react-easy-crop';

// // Text limits
// const TEXT_LIMITS = {
//   SUBTITLE: 100,
//   HEADING: 60,
//   DESCRIPTION: 800,
// };

// // Custom Button component
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

// // Define types for Hero data based on backend structure
// interface CTAButton {
//   variant: string;
//   text: string;
//   href: string;
// }

// interface HeroData {
//   name: string;
//   title: string;
//   description: string;
//   image: string;
//   // Support both old structure (buttons) and new structure (ctaButtons)
//   buttons?: {
//     work: string;
//     contact: string;
//   };
//   ctaButtons?: CTAButton[];
// }

// // Props interface
// interface HeroProps {
//   heroData?: Partial<HeroData>;
//   onStateChange?: (data: HeroData) => void;
//   userId?: string;
//   professionalId?: string;
//   templateSelection?: string;
// }

// export function Hero({ heroData, onStateChange, userId, professionalId, templateSelection }: HeroProps) {
//   const [isEditing, setIsEditing] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);
//   const [dataLoaded, setDataLoaded] = useState(false);
//   const [isVisible, setIsVisible] = useState(false);
//   const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);

//   // Cropping states
//   const [showCropper, setShowCropper] = useState(false);
//   const [crop, setCrop] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);
//   const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
//   const [imageToCrop, setImageToCrop] = useState(null);
//   const [originalFile, setOriginalFile] = useState(null);
//   const [aspectRatio] = useState(4 / 3); // Fixed 4:3 aspect ratio

//   const heroRef = useRef<HTMLDivElement>(null);
//   const descriptionRef = useRef<HTMLDivElement>(null);

//   // Helper function to transform backend data to component format
//   const transformHeroData = useCallback((backendData: Partial<HeroData>): HeroData => {
//     // Handle buttons transformation - convert ctaButtons array to buttons object
//     let buttons = { work: "", contact: "" };

//     if (backendData.ctaButtons && backendData.ctaButtons.length > 0) {
//       // Use the first button for "work" and second for "contact" if available
//       buttons = {
//         work: backendData.ctaButtons[0]?.text || "",
//         contact: backendData.ctaButtons[1]?.text || backendData.ctaButtons[0]?.text || ""
//       };
//     } else if (backendData.buttons) {
//       // Fallback to existing buttons structure
//       buttons = backendData.buttons;
//     }

//     return {
//       name: backendData.name || "",
//       title: backendData.title || "",
//       description: backendData.description || "",
//       image: backendData.image || "",

//       buttons,
//       // Keep original ctaButtons for saving back to backend if needed
//       ctaButtons: backendData.ctaButtons
//     };
//   }, []);

//   // Helper function to transform component data back to backend format
//   const transformToBackendFormat = useCallback((componentData: HeroData): HeroData => {
//     // If we had original ctaButtons structure, maintain it
//     if (componentData.ctaButtons) {
//       const updatedCtaButtons = [...componentData.ctaButtons];

//       // Update the text of existing buttons
//       if (updatedCtaButtons[0]) {
//         updatedCtaButtons[0].text = componentData.buttons?.work || updatedCtaButtons[0].text;
//       }
//       if (updatedCtaButtons[1]) {
//         updatedCtaButtons[1].text = componentData.buttons?.contact || updatedCtaButtons[1].text;
//       }

//       return {
//         ...componentData,
//         ctaButtons: updatedCtaButtons
//       };
//     }

//     // If no ctaButtons existed, create them from buttons
//     return {
//       ...componentData,
//       ctaButtons: [
//         {
//           variant: "primary",
//           text: componentData.buttons?.work || "View Work",
//           href: "#projects"
//         },
//         {
//           variant: "secondary",
//           text: componentData.buttons?.contact || "Contact Me",
//           href: "#contact"
//         }
//       ]
//     };
//   }, []);

//   // Initialize with empty data structure
//   const [data, setData] = useState<HeroData>({
//     name: "",
//     title: "",
//     description: "",
//     image: "",
//     buttons: {
//       work: "",
//       contact: ""
//     }
//   });

//   const [tempData, setTempData] = useState<HeroData>({
//     name: "",
//     title: "",
//     description: "",
//     image: "",
//     buttons: {
//       work: "",
//       contact: ""
//     }
//   });

//   // Data loading effect
//   useEffect(() => {
//     if (heroData) {
//       const transformedData = transformHeroData(heroData);
//       setData(transformedData);
//       setTempData(transformedData);
//       setDataLoaded(true);
//       setIsLoading(false);
//     } else if (!dataLoaded) {
//       setIsLoading(true);
//       const timer = setTimeout(() => {
//         setDataLoaded(true);
//         setIsLoading(false);
//       }, 1200);
//       return () => clearTimeout(timer);
//     }
//   }, [heroData, dataLoaded, transformHeroData]);

//   // Intersection observer
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => setIsVisible(entry.isIntersecting),
//       { threshold: 0.1 }
//     );
//     if (heroRef.current) observer.observe(heroRef.current);
//     return () => {
//       if (heroRef.current) observer.unobserve(heroRef.current);
//     };
//   }, []);

//   // Lock body scroll while cropper is open
//   useEffect(() => {
//     if (showCropper) {
//       const prev = document.body.style.overflow;
//       document.body.style.overflow = 'hidden';
//       return () => {
//         document.body.style.overflow = prev;
//       };
//     }
//   }, [showCropper]);

//   // Trigger loading when component becomes visible
//   useEffect(() => {
//     if (isVisible && !dataLoaded && !isLoading) {
//       setIsLoading(true);
//       const timer = setTimeout(() => {
//         if (heroData) {
//           const transformedData = transformHeroData(heroData);
//           setData(transformedData);
//           setTempData(transformedData);
//         }
//         setDataLoaded(true);
//         setIsLoading(false);
//       }, 500);

//       return () => clearTimeout(timer);
//     }
//   }, [isVisible, dataLoaded, isLoading, heroData, transformHeroData]);

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
//           `cropped-hero-${originalFile.name}` :
//           `cropped-hero-${Date.now()}.jpg`;

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
//   const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     if (!file.type.startsWith('image/')) {
//       toast.error('Please select an image file');
//       return;
//     }

//     if (file.size > 5 * 1024 * 1024) {
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
//     e.target.value = '';
//   };

//   // Apply crop and set pending file
//   const applyCrop = async () => {
//     try {
//       if (!imageToCrop || !croppedAreaPixels) return;

//       const { file, previewUrl } = await getCroppedImg(imageToCrop, croppedAreaPixels);

//       // Update preview immediately with blob URL (temporary)
//       setTempData(prev => ({
//         ...prev,
//         image: previewUrl
//       }));
//       setPendingImageFile(file);

//       console.log('Hero image cropped, file ready for upload:', file);
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

//   // Save function
//   const handleSave = async () => {
//     try {
//       setIsSaving(true);

//       if (pendingImageFile) {
//         setIsUploading(true);
//       }

//       let updatedData = { ...tempData };

//       // Upload image only if there's a pending file
//       if (pendingImageFile) {
//         if (!userId || !professionalId || !templateSelection) {
//           toast.error('Missing user information. Please refresh and try again.');
//           setIsUploading(false);
//           setIsSaving(false);
//           return;
//         }

//         const formData = new FormData();
//         formData.append('file', pendingImageFile);
//         formData.append('userId', userId);
//         formData.append('fieldName', 'heroImage');

//         const uploadResponse = await fetch(`https://ow3v94b9gf.execute-api.ap-south-1.amazonaws.com/dev/`, {
//           method: 'POST',
//           body: formData,
//         });

//         if (uploadResponse.ok) {
//           const uploadData = await uploadResponse.json();
//           updatedData.image = uploadData.s3Url;
//         } else {
//           const errorData = await uploadResponse.json();
//           toast.error(`Image upload failed: ${errorData.message || 'Unknown error'}`);
//           setIsUploading(false);
//           setIsSaving(false);
//           return;
//         }
//       }

//       // Transform data back to backend format before saving
//       const backendData = transformToBackendFormat(updatedData);

//       // Simulate API call
//       await new Promise((resolve) => setTimeout(resolve, 1000));

//       setData(updatedData);
//       setTempData(updatedData);
//       setPendingImageFile(null);
//       setIsEditing(false);

//       if (onStateChange) {
//         onStateChange(backendData);
//       }

//       toast.success(pendingImageFile
//         ? 'Hero section saved with new image!'
//         : 'Hero section updated successfully!');

//     } catch (error) {
//       console.error('Error saving hero section:', error);
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

//   // Safe data accessor functions
//   const getButtons = useCallback(() => {
//     return {
//       work: tempData?.buttons?.work || "",
//       contact: tempData?.buttons?.contact || "",
//     };
//   }, [tempData]);

//   const getStats = useCallback(() => {
//     return {
//       projects: tempData?.stats?.projects || "",
//       experience: tempData?.stats?.experience || "",
//       satisfaction: tempData?.stats?.satisfaction || "",
//     };
//   }, [tempData]);

//   // Text validation functions
//   const validateTextLength = (text: string, limit: number) => {
//     return text.length <= limit;
//   };

//   // Stable update functions with useCallback
//   const updateTempContent = useCallback((field: keyof HeroData, value: string) => {
//     setTempData((prev) => ({
//       ...prev,
//       [field]: value
//     }));
//   }, []);

//   const updateStat = useCallback((stat: keyof HeroData['stats'], value: string) => {
//     setTempData(prev => ({
//       ...prev,
//       stats: {
//         ...prev.stats,
//         [stat]: value
//       }
//     }));
//   }, []);

//   const updateButton = useCallback((button: keyof HeroData['buttons'], value: string) => {
//     setTempData(prev => ({
//       ...prev,
//       buttons: {
//         ...prev.buttons,
//         [button]: value
//       }
//     }));
//   }, []);

//   // Memoized EditableText component with character limits - FIXED VERSION
//   const EditableText = useMemo(() => {
//     const EditableTextComponent = ({
//       value,
//       field,
//       multiline = false,
//       className = "",
//       placeholder = "",
//       rows = 3,
//       statField,
//       buttonField,
//       charLimit,
//     }: {
//       value: string;
//       field?: keyof HeroData;
//       multiline?: boolean;
//       className?: string;
//       placeholder?: string;
//       rows?: number;
//       statField?: keyof HeroData['stats'];
//       buttonField?: keyof HeroData['buttons'];
//       charLimit?: number;
//     }) => {
//       const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//         const newValue = e.target.value;

//         // Apply character limit if specified
//         if (charLimit && newValue.length > charLimit) {
//           return; // Don't update if over limit
//         }

//         if (statField) {
//           updateStat(statField, newValue);
//         } else if (buttonField) {
//           updateButton(buttonField, newValue);
//         } else if (field) {
//           updateTempContent(field, newValue);
//         }
//       };

//       const baseClasses = "w-full bg-white/10 backdrop-blur-sm border-2 border-dashed border-yellow-300 rounded focus:border-yellow-400 focus:outline-none text-white placeholder-gray-300";
//       const currentLength = value?.length || 0;
//       const isOverLimit = charLimit && currentLength > charLimit;

//       return (
//         <div className="relative">
//           {multiline ? (
//             <div className="relative">
//               <textarea
//                 value={value || ''}
//                 onChange={handleChange}
//                 className={`${baseClasses} p-3 resize-y overflow-auto whitespace-pre-wrap break-words ${className} ${
//                   isOverLimit ? 'border-red-400' : ''
//                 }`}
//                 placeholder={placeholder}
//                 rows={rows}
//                 style={{ whiteSpace: 'pre-wrap' }}
//               />
//               {charLimit && (
//                 <div className={`absolute bottom-2 right-2 text-xs ${
//                   isOverLimit ? 'text-red-400' : 'text-gray-400'
//                 }`}>
//                   {currentLength}/{charLimit}
//                 </div>
//               )}
//             </div>
//           ) : (
//             <div className="relative">
//               <input
//                 type='text'
//                 value={value || ''}
//                 onChange={handleChange}
//                 className={`${baseClasses} p-2 ${className} ${
//                   isOverLimit ? 'border-red-400' : ''
//                 }`}
//                 placeholder={placeholder}
//               />
//               {charLimit && (
//                 <div className={`absolute -bottom-6 right-0 text-xs ${
//                   isOverLimit ? 'text-red-400' : 'text-gray-400'
//                 }`}>
//                   {currentLength}/{charLimit}
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       );
//     };
//     return EditableTextComponent;
//   }, [updateTempContent, updateStat, updateButton]);

//   // Safe display data
//   const displayData = isEditing ? tempData : data;
//   const safeButtons = getButtons();
//   const safeStats = getStats();

//   // Animation variants
//   const itemVariants = {
//     hidden: { y: 50, opacity: 0 },
//     visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
//   };

//   const imageVariants = {
//     hidden: { scale: 0.8, opacity: 0 },
//     visible: {
//       scale: 1,
//       opacity: 1,
//       transition: { duration: 0.6, ease: "easeOut" },
//     },
//   };

//   if (isLoading) {
//     return (
//       <section
//         ref={heroRef}
//         className="min-h-screen mt-[4rem] flex items-center justify-center bg-gradient-to-br from-background to-yellow-50 dark:from-background dark:to-yellow-900/20 pt-20"
//       >
//         <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-30">
//           <div className='bg-white rounded-lg p-6 shadow-lg flex items-center gap-3'>
//             <Loader2 className='w-5 h-5 animate-spin text-blue-600' />
//             <span className='text-gray-700'>Loading content...</span>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section
//       id="home"
//       ref={heroRef}
//       className="min-h-screen flex items-center bg-gradient-to-br from-background to-yellow-50 dark:from-background dark:to-yellow-900/20 pt-20 relative"
//     >
//       {/* Image Cropper Modal */}
//       {showCropper &&
//         createPortal(
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="fixed inset-0 bg-black/90 z-[2147483647] flex items-center justify-center p-4"
//             style={{ zIndex: 2147483647 }}
//           >
//             <motion.div
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               className="bg-white rounded-xl max-w-6xl w-full h-[90vh] flex flex-col"
//             >
//               {/* Header */}
//               <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
//                 <h3 className="text-lg font-semibold text-gray-800">
//                   Crop Hero Image (4:3 Aspect Ratio)
//                 </h3>
//                 <button
//                   onClick={cancelCrop}
//                   className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
//                 >
//                   <X className="w-5 h-5 text-gray-600" />
//                 </button>
//               </div>

//               {/* Cropper Area */}
//               <div className="flex-1 relative bg-gray-900 min-h-0">
//                 <Cropper
//                   image={imageToCrop}
//                   crop={crop}
//                   zoom={zoom}
//                   aspect={aspectRatio}
//                   onCropChange={setCrop}
//                   onZoomChange={setZoom}
//                   onCropComplete={onCropComplete}
//                   showGrid={false}
//                   cropShape="rect"
//                   minZoom={0.1}
//                   maxZoom={5}
//                   restrictPosition={false}
//                   zoomWithScroll={true}
//                   zoomSpeed={0.2}
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

//               {/* Controls */}
//               <div className="p-4 bg-gray-50 border-t border-gray-200">
//                 {/* Aspect Ratio Info */}
//                 <div className="mb-4">
//                   <p className="text-sm font-medium text-gray-700 mb-2">
//                     Aspect Ratio: <span className="text-blue-600">4:3 (Standard)</span>
//                   </p>
//                 </div>

//                 {/* Zoom Control */}
//                 <div className="space-y-2 mb-4">
//                   <div className="flex items-center justify-between text-sm">
//                     <span className="flex items-center gap-2 text-gray-700">
//                       <ZoomIn className="w-4 h-4" />
//                       Zoom
//                     </span>
//                     <span className="text-gray-600">{zoom.toFixed(1)}x</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <button
//                       type="button"
//                       onClick={() => setZoom((z) => Math.max(0.1, +(z - 0.1).toFixed(2)))}
//                       className="p-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
//                     >
//                       <ZoomOut className="w-4 h-4" />
//                     </button>
//                   <input
//                     type="range"
//                     value={zoom}
//                     min={0.1}
//                     max={5}
//                     step={0.1}
//                     onChange={(e) => setZoom(Number(e.target.value))}
//                     className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
//                   />
//                     <button
//                       type="button"
//                       onClick={() => setZoom((z) => Math.min(5, +(z + 0.1).toFixed(2)))}
//                       className="p-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
//                     >
//                       <ZoomIn className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="grid grid-cols-3 gap-3">
//                   <button
//                     onClick={resetCropSettings}
//                     className="w-full border border-gray-300 text-gray-700 hover:bg-gray-100 rounded py-2 text-sm font-medium"
//                   >
//                     Reset
//                   </button>
//                   <button
//                     onClick={cancelCrop}
//                     className="w-full border border-gray-300 text-gray-700 hover:bg-gray-100 rounded py-2 text-sm font-medium"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={applyCrop}
//                     className="w-full bg-green-600 hover:bg-green-700 text-white rounded py-2 text-sm font-medium"
//                   >
//                     Apply Crop
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>,
//           document.body
//         )}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-20">
//         <div className="grid lg:grid-cols-2 gap-12 items-center">
//           {/* Left Content */}
//           <motion.div
//             className="space-y-8 order-2 lg:order-1"
//             initial='hidden'
//             animate='visible'
//             variants={itemVariants}
//           >
//             <motion.h1
//               className="text-4xl sm:text-5xl lg:text-6xl text-foreground leading-tight"
//               variants={itemVariants}
//             >
//               Hi, I'm{' '}
//               {isEditing ? (
//                 <EditableText
//                   value={displayData.name}
//                   field='name'
//                   className="text-yellow-500 p-1"
//                   placeholder="Your name"
//                   charLimit={TEXT_LIMITS.HEADING}
//                 />
//               ) : (
//                 <span className="text-yellow-500">{displayData.name}</span>
//               )}
//             </motion.h1>

//             <motion.div
//               variants={itemVariants}
//             >
//               {isEditing ? (
//                 <div className="min-h-[120px]">
//                   <EditableText
//                     value={displayData.description}
//                     field='description'
//                     multiline
//                     className="text-lg text-yellow-500 p-1 min-h-[120px]"
//                     placeholder="Your description"
//                     rows={4}
//                     charLimit={TEXT_LIMITS.DESCRIPTION}
//                   />
//                 </div>
//               ) : (
//                 <div
//                   ref={descriptionRef}
//                   className="text-xl text-justify text-muted-foreground leading-relaxed whitespace-pre-wrap break-words"
//                 >
//                   {displayData.description}
//                 </div>
//               )}
//             </motion.div>

//             <motion.div
//               className="flex flex-col sm:flex-row gap-4 mt-4"
//               variants={itemVariants}
//             >
//               {isEditing ? (
//                 <>
//                   <EditableText
//                     value={safeButtons.work}
//                     buttonField='work'
//                     className="px-6 py-3 rounded-lg text-yellow-500 text-center"
//                     placeholder="Work button text"
//                     charLimit={TEXT_LIMITS.SUBTITLE}
//                   />
//                   <EditableText
//                     value={safeButtons.contact}
//                     buttonField='contact'
//                     className="px-6 py-3 text-yellow-500 rounded-lg text-center"
//                     placeholder="Contact button text"
//                     charLimit={TEXT_LIMITS.SUBTITLE}
//                   />
//                 </>
//               ) : (
//                 <>
//                   <a
//                     href="#projects"
//                     className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                   >
//                     {safeButtons.work}
//                   </a>
//                   <a
//                     href="#contact"
//                     className="inline-flex items-center justify-center px-6 py-3 bg-transparent text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
//                   >
//                     {safeButtons.contact}
//                   </a>
//                 </>
//               )}
//             </motion.div>
//           </motion.div>

//           {/* Right Content - User Image with Edit Button on Top */}
//           <motion.div
//             className="relative order-1 lg:order-2"
//             initial='hidden'
//             animate='visible'
//             variants={imageVariants}
//           >
//             {/* Edit Controls - Now placed on top of the image container */}
//             <div className='absolute -top-4 right-4 z-20'>
//               {!isEditing ? (
//                 <Button
//                   onClick={handleEdit}
//                   size='sm'
//                   className='bg-red-500 hover:bg-red-600 shadow-md'
//                   disabled={isLoading}
//                 >
//                   <Edit2 className='w-4 h-4 mr-2' />
//                   Edit
//                 </Button>
//               ) : (
//                 <div className='flex gap-2 justify-end'>
//                   <Button
//                     onClick={handleSave}
//                     size='sm'
//                     className='bg-green-600 hover:bg-green-700 text-white shadow-md'
//                     disabled={isSaving || isUploading}
//                   >
//                     {isUploading ? (
//                       <Loader2 className='w-4 h-4 mr-2 animate-spin' />
//                     ) : isSaving ? (
//                       <Loader2 className='w-4 h-4 mr-2 animate-spin' />
//                     ) : (
//                       <Save className='w-4 h-4 mr-2' />
//                     )}
//                     {isUploading ? "Uploading..." : isSaving ? "Saving..." : "Save"}
//                   </Button>
//                   <Button
//                     onClick={handleCancel}
//                     size='sm'
//                     className='bg-red-400 hover:bg-red-600 shadow-md'
//                     disabled={isSaving || isUploading}
//                   >
//                     <X className='w-4 h-4 mr-2' />
//                     Cancel
//                   </Button>
//                 </div>
//               )}
//             </div>

//             <motion.div
//               className="relative"
//               whileHover={{ scale: 1.05 }}
//               transition={{ duration: 0.3, ease: "easeInOut" }}
//             >
//               <motion.div
//                 className="absolute inset-0 bg-yellow-400 rounded-3xl transform rotate-6"
//               ></motion.div>
//               <motion.div
//                 className="relative bg-card rounded-3xl overflow-hidden shadow-2xl"
//                 whileHover={{
//                   boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
//                   y: -5
//                 }}
//                 transition={{ duration: 0.3, ease: "easeInOut" }}
//               >
//                 <div className="relative">
//                   <img
//                     src={displayData.image}
//                     alt={`${displayData.name} - ${displayData.title}`}
//                     className="w-full h-96 object-cover object-center transition-transform duration-300 hover:scale-110"
//                   />
//                   {isEditing && (
//                     <div className='absolute bottom-2 right-2 flex flex-col gap-2'>
//                       <div className="bg-black/70 text-white p-2 rounded">
//                         <label className='cursor-pointer hover:bg-black/90 transition-colors flex items-center gap-2'>
//                           <Upload className='w-4 h-4' />
//                           Change Image
//                           <input
//                             type='file'
//                             accept='image/*'
//                             className='hidden'
//                             onChange={handleImageSelect}
//                           />
//                         </label>
//                         {pendingImageFile && (
//                           <div className='text-xs text-orange-300 mt-1'>
//                             Pending upload: {pendingImageFile.name}
//                           </div>
//                         )}
//                         <div className='text-xs text-gray-300 mt-1'>
//                           Recommended: 600×800px (3:4 ratio) - Portrait
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </motion.div>
//             </motion.div>
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   );
// }

// // Add default props
// Hero.defaultProps = {
//   heroData: undefined,
//   onStateChange: undefined,
//   userId: '',
//   professionalId: '',
//   templateSelection: '',
// };

// import { Edit2, Loader2, Save, Upload, X, ZoomIn, ZoomOut } from 'lucide-react';

// import { motion } from 'motion/react';
// import { createPortal } from 'react-dom';

// import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// import { toast } from 'sonner';
// import Cropper from 'react-easy-crop';

// // Text limits
// const TEXT_LIMITS = {
//   SUBTITLE: 100,
//   HEADING: 60,
//   DESCRIPTION: 800,
// };

// // Custom Button component
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

// // Define types for Hero data based on backend structure
// interface CTAButton {
//   variant: string;
//   text: string;
//   href: string;
// }

// interface HeroData {
//   name: string;
//   title: string;
//   description: string;
//   image: string;
//   // Support both old structure (buttons) and new structure (ctaButtons)
//   buttons?: {
//     work: string;
//     contact: string;
//   };
//   ctaButtons?: CTAButton[];
// }

// // Props interface
// interface HeroProps {
//   heroData?: Partial<HeroData>;
//   onStateChange?: (data: HeroData) => void;
//   userId?: string;
//   professionalId?: string;
//   templateSelection?: string;
// }

// export function Hero({ heroData, onStateChange, userId, professionalId, templateSelection }: HeroProps) {
//   const [isEditing, setIsEditing] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);
//   const [dataLoaded, setDataLoaded] = useState(false);
//   const [isVisible, setIsVisible] = useState(false);
//   const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);

//   // Auto-save states
//   const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
//   const [isAutoSaving, setIsAutoSaving] = useState(false);
//   const [lastSaved, setLastSaved] = useState<Date | null>(null);
//   const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();
//   const lastSavedDataRef = useRef<HeroData | null>(null);

//   // Cropping states
//   const [showCropper, setShowCropper] = useState(false);
//   const [crop, setCrop] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);
//   const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
//   const [imageToCrop, setImageToCrop] = useState(null);
//   const [originalFile, setOriginalFile] = useState(null);
//   const [aspectRatio] = useState(4 / 3); // Fixed 4:3 aspect ratio

//   const heroRef = useRef<HTMLDivElement>(null);
//   const descriptionRef = useRef<HTMLDivElement>(null);

//   // Helper function to transform backend data to component format
//   const transformHeroData = useCallback((backendData: Partial<HeroData>): HeroData => {
//     // Handle buttons transformation - convert ctaButtons array to buttons object
//     let buttons = { work: "", contact: "" };

//     if (backendData.ctaButtons && backendData.ctaButtons.length > 0) {
//       // Use the first button for "work" and second for "contact" if available
//       buttons = {
//         work: backendData.ctaButtons[0]?.text || "",
//         contact: backendData.ctaButtons[1]?.text || backendData.ctaButtons[0]?.text || ""
//       };
//     } else if (backendData.buttons) {
//       // Fallback to existing buttons structure
//       buttons = backendData.buttons;
//     }

//     return {
//       name: backendData.name || "",
//       title: backendData.title || "",
//       description: backendData.description || "",
//       image: backendData.image || "",

//       buttons,
//       // Keep original ctaButtons for saving back to backend if needed
//       ctaButtons: backendData.ctaButtons
//     };
//   }, []);

//   // Helper function to transform component data back to backend format
//   const transformToBackendFormat = useCallback((componentData: HeroData): HeroData => {
//     // If we had original ctaButtons structure, maintain it
//     if (componentData.ctaButtons) {
//       const updatedCtaButtons = [...componentData.ctaButtons];

//       // Update the text of existing buttons
//       if (updatedCtaButtons[0]) {
//         updatedCtaButtons[0].text = componentData.buttons?.work || updatedCtaButtons[0].text;
//       }
//       if (updatedCtaButtons[1]) {
//         updatedCtaButtons[1].text = componentData.buttons?.contact || updatedCtaButtons[1].text;
//       }

//       return {
//         ...componentData,
//         ctaButtons: updatedCtaButtons
//       };
//     }

//     // If no ctaButtons existed, create them from buttons
//     return {
//       ...componentData,
//       ctaButtons: [
//         {
//           variant: "primary",
//           text: componentData.buttons?.work || "View Work",
//           href: "#projects"
//         },
//         {
//           variant: "secondary",
//           text: componentData.buttons?.contact || "Contact Me",
//           href: "#contact"
//         }
//       ]
//     };
//   }, []);

//   // Initialize with empty data structure
//   const [data, setData] = useState<HeroData>({
//     name: "",
//     title: "",
//     description: "",
//     image: "",
//     buttons: {
//       work: "",
//       contact: ""
//     }
//   });

//   const [tempData, setTempData] = useState<HeroData>({
//     name: "",
//     title: "",
//     description: "",
//     image: "",
//     buttons: {
//       work: "",
//       contact: ""
//     }
//   });

//   // Auto-save functionality
//   const performAutoSave = useCallback(async (dataToSave: HeroData) => {
//     try {
//       setIsAutoSaving(true);

//       // Transform data back to backend format before saving
//       const backendData = transformToBackendFormat(dataToSave);

//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 500));

//       if (onStateChange) {
//         onStateChange(backendData);
//       }

//       lastSavedDataRef.current = dataToSave;
//       setLastSaved(new Date());
//       setHasUnsavedChanges(false);

//       console.log("Auto-save completed:", dataToSave);
//     } catch (error) {
//       console.error("Auto-save failed:", error);
//       toast.error("Failed to auto-save changes");
//     } finally {
//       setIsAutoSaving(false);
//     }
//   }, [onStateChange, transformToBackendFormat]);

//   const scheduleAutoSave = useCallback((updatedData: HeroData) => {
//     setHasUnsavedChanges(true);

//     // Clear existing timeout
//     if (autoSaveTimeoutRef.current) {
//       clearTimeout(autoSaveTimeoutRef.current);
//     }

//     // Schedule new auto-save
//     autoSaveTimeoutRef.current = setTimeout(() => {
//       performAutoSave(updatedData);
//     }, 2000); // 2 second delay
//   }, [performAutoSave]);

//   // Cleanup timeout on unmount
//   useEffect(() => {
//     return () => {
//       if (autoSaveTimeoutRef.current) {
//         clearTimeout(autoSaveTimeoutRef.current);
//       }
//     };
//   }, []);

//   // Data loading effect
//   useEffect(() => {
//     if (heroData) {
//       const transformedData = transformHeroData(heroData);
//       setData(transformedData);
//       setTempData(transformedData);
//       lastSavedDataRef.current = transformedData;
//       setDataLoaded(true);
//       setIsLoading(false);
//     } else if (!dataLoaded) {
//       setIsLoading(true);
//       const timer = setTimeout(() => {
//         setDataLoaded(true);
//         setIsLoading(false);
//       }, 1200);
//       return () => clearTimeout(timer);
//     }
//   }, [heroData, dataLoaded, transformHeroData]);

//   // Intersection observer
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => setIsVisible(entry.isIntersecting),
//       { threshold: 0.1 }
//     );
//     if (heroRef.current) observer.observe(heroRef.current);
//     return () => {
//       if (heroRef.current) observer.unobserve(heroRef.current);
//     };
//   }, []);

//   // Lock body scroll while cropper is open
//   useEffect(() => {
//     if (showCropper) {
//       const prev = document.body.style.overflow;
//       document.body.style.overflow = 'hidden';
//       return () => {
//         document.body.style.overflow = prev;
//       };
//     }
//   }, [showCropper]);

//   // Trigger loading when component becomes visible
//   useEffect(() => {
//     if (isVisible && !dataLoaded && !isLoading) {
//       setIsLoading(true);
//       const timer = setTimeout(() => {
//         if (heroData) {
//           const transformedData = transformHeroData(heroData);
//           setData(transformedData);
//           setTempData(transformedData);
//           lastSavedDataRef.current = transformedData;
//         }
//         setDataLoaded(true);
//         setIsLoading(false);
//       }, 500);

//       return () => clearTimeout(timer);
//     }
//   }, [isVisible, dataLoaded, isLoading, heroData, transformHeroData]);

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
//           `cropped-hero-${originalFile.name}` :
//           `cropped-hero-${Date.now()}.jpg`;

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

//   // Upload image to S3
//   const uploadImageToS3 = async (file: File): Promise<string> => {
//     if (!userId || !professionalId) {
//       throw new Error('Missing user information');
//     }

//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('userId', userId);
//     formData.append('fieldName', 'heroImage');

//     const uploadResponse = await fetch(`https://ow3v94b9gf.execute-api.ap-south-1.amazonaws.com/dev/`, {
//       method: 'POST',
//       body: formData,
//     });

//     if (!uploadResponse.ok) {
//       const errorData = await uploadResponse.json();
//       throw new Error(errorData.message || 'Upload failed');
//     }

//     const uploadData = await uploadResponse.json();
//     return uploadData.s3Url;
//   };

//   // Handle image selection - opens cropper
//   const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     if (!file.type.startsWith('image/')) {
//       toast.error('Please select an image file');
//       return;
//     }

//     if (file.size > 5 * 1024 * 1024) {
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
//     e.target.value = '';
//   };

//   // Apply crop and automatically upload to S3
//   const applyCrop = async () => {
//     try {
//       if (!imageToCrop || !croppedAreaPixels) return;

//       setIsUploading(true);

//       const { file, previewUrl } = await getCroppedImg(imageToCrop, croppedAreaPixels);

//       // Update preview immediately with blob URL (temporary)
//       const updatedData = {
//         ...tempData,
//         image: previewUrl
//       };
//       setTempData(updatedData);
//       scheduleAutoSave(updatedData);

//       // Upload to S3 immediately
//       try {
//         const s3Url = await uploadImageToS3(file);

//         // Update with S3 URL
//         const finalUpdatedData = {
//           ...tempData,
//           image: s3Url
//         };
//         setTempData(finalUpdatedData);
//         performAutoSave(finalUpdatedData); // Immediate save with S3 URL

//         toast.success('Image uploaded and saved successfully!');
//       } catch (uploadError) {
//         console.error('Upload failed:', uploadError);
//         toast.error('Image upload failed, but local copy is saved');
//         // Content with blob URL is already saved via auto-save
//       }

//       setShowCropper(false);
//       setImageToCrop(null);
//       setOriginalFile(null);
//       setIsUploading(false);

//     } catch (error) {
//       console.error('Error cropping image:', error);
//       toast.error('Failed to crop image');
//       setShowCropper(false);
//       setIsUploading(false);
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

//   // Manual save function
//   const handleSave = async () => {
//     try {
//       setIsSaving(true);

//       // Clear any pending auto-save
//       if (autoSaveTimeoutRef.current) {
//         clearTimeout(autoSaveTimeoutRef.current);
//       }

//       // Upload image if there's a pending file
//       if (pendingImageFile) {
//         setIsUploading(true);
//         try {
//           const s3Url = await uploadImageToS3(pendingImageFile);
//           tempData.image = s3Url;
//           setPendingImageFile(null);
//         } catch (uploadError) {
//           console.error('Upload failed:', uploadError);
//           toast.error('Image upload failed');
//           setIsUploading(false);
//           setIsSaving(false);
//           return;
//         }
//       }

//       // Transform data back to backend format before saving
//       const backendData = transformToBackendFormat(tempData);

//       // Simulate API call
//       await new Promise((resolve) => setTimeout(resolve, 1000));

//       setData(tempData);
//       lastSavedDataRef.current = tempData;
//       setPendingImageFile(null);
//       setIsEditing(false);
//       setHasUnsavedChanges(false);

//       if (onStateChange) {
//         onStateChange(backendData);
//       }

//       toast.success('Hero section saved successfully!');

//     } catch (error) {
//       console.error('Error saving hero section:', error);
//       toast.error('Error saving changes. Please try again.');
//     } finally {
//       setIsUploading(false);
//       setIsSaving(false);
//     }
//   };

//   const handleCancel = () => {
//     // Clear any pending auto-save
//     if (autoSaveTimeoutRef.current) {
//       clearTimeout(autoSaveTimeoutRef.current);
//     }

//     setTempData(lastSavedDataRef.current || data);
//     setPendingImageFile(null);
//     setHasUnsavedChanges(false);
//     setIsEditing(false);
//     toast.info('Changes discarded');
//   };

//   // Safe data accessor functions
//   const getButtons = useCallback(() => {
//     return {
//       work: tempData?.buttons?.work || "",
//       contact: tempData?.buttons?.contact || "",
//     };
//   }, [tempData]);

//   const getStats = useCallback(() => {
//     return {
//       projects: tempData?.stats?.projects || "",
//       experience: tempData?.stats?.experience || "",
//       satisfaction: tempData?.stats?.satisfaction || "",
//     };
//   }, [tempData]);

//   // Text validation functions
//   const validateTextLength = (text: string, limit: number) => {
//     return text.length <= limit;
//   };

//   // Stable update functions with useCallback
//   const updateTempContent = useCallback((field: keyof HeroData, value: string) => {
//     setTempData((prev) => {
//       const updated = {
//         ...prev,
//         [field]: value
//       };
//       scheduleAutoSave(updated);
//       return updated;
//     });
//   }, [scheduleAutoSave]);

//   const updateStat = useCallback((stat: keyof HeroData['stats'], value: string) => {
//     setTempData(prev => {
//       const updated = {
//         ...prev,
//         stats: {
//           ...prev.stats,
//           [stat]: value
//         }
//       };
//       scheduleAutoSave(updated);
//       return updated;
//     });
//   }, [scheduleAutoSave]);

//   const updateButton = useCallback((button: keyof HeroData['buttons'], value: string) => {
//     setTempData(prev => {
//       const updated = {
//         ...prev,
//         buttons: {
//           ...prev.buttons,
//           [button]: value
//         }
//       };
//       scheduleAutoSave(updated);
//       return updated;
//     });
//   }, [scheduleAutoSave]);

//   // Memoized EditableText component with character limits
//   const EditableText = useMemo(() => {
//     const EditableTextComponent = ({
//       value,
//       field,
//       multiline = false,
//       className = "",
//       placeholder = "",
//       rows = 3,
//       statField,
//       buttonField,
//       charLimit,
//     }: {
//       value: string;
//       field?: keyof HeroData;
//       multiline?: boolean;
//       className?: string;
//       placeholder?: string;
//       rows?: number;
//       statField?: keyof HeroData['stats'];
//       buttonField?: keyof HeroData['buttons'];
//       charLimit?: number;
//     }) => {
//       const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//         const newValue = e.target.value;

//         // Apply character limit if specified
//         if (charLimit && newValue.length > charLimit) {
//           return; // Don't update if over limit
//         }

//         if (statField) {
//           updateStat(statField, newValue);
//         } else if (buttonField) {
//           updateButton(buttonField, newValue);
//         } else if (field) {
//           updateTempContent(field, newValue);
//         }
//       };

//       const baseClasses = "w-full bg-white/10 backdrop-blur-sm border-2 border-dashed border-yellow-300 rounded focus:border-yellow-400 focus:outline-none text-white placeholder-gray-300";
//       const currentLength = value?.length || 0;
//       const isOverLimit = charLimit && currentLength > charLimit;

//       return (
//         <div className="relative">
//           {multiline ? (
//             <div className="relative">
//               <textarea
//                 value={value || ''}
//                 onChange={handleChange}
//                 className={`${baseClasses} p-3 resize-y overflow-auto whitespace-pre-wrap break-words ${className} ${
//                   isOverLimit ? 'border-red-400' : ''
//                 }`}
//                 placeholder={placeholder}
//                 rows={rows}
//                 style={{ whiteSpace: 'pre-wrap' }}
//               />
//               {charLimit && (
//                 <div className={`absolute bottom-2 right-2 text-xs ${
//                   isOverLimit ? 'text-red-400' : 'text-gray-400'
//                 }`}>
//                   {currentLength}/{charLimit}
//                 </div>
//               )}
//             </div>
//           ) : (
//             <div className="relative">
//               <input
//                 type='text'
//                 value={value || ''}
//                 onChange={handleChange}
//                 className={`${baseClasses} p-2 ${className} ${
//                   isOverLimit ? 'border-red-400' : ''
//                 }`}
//                 placeholder={placeholder}
//               />
//               {charLimit && (
//                 <div className={`absolute -bottom-6 right-0 text-xs ${
//                   isOverLimit ? 'text-red-400' : 'text-gray-400'
//                 }`}>
//                   {currentLength}/{charLimit}
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       );
//     };
//     return EditableTextComponent;
//   }, [updateTempContent, updateStat, updateButton]);

//   // Safe display data
//   const displayData = isEditing ? tempData : data;
//   const safeButtons = getButtons();
//   const safeStats = getStats();

//   // Animation variants
//   const itemVariants = {
//     hidden: { y: 50, opacity: 0 },
//     visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
//   };

//   const imageVariants = {
//     hidden: { scale: 0.8, opacity: 0 },
//     visible: {
//       scale: 1,
//       opacity: 1,
//       transition: { duration: 0.6, ease: "easeOut" },
//     },
//   };

//   if (isLoading) {
//     return (
//       <section
//         ref={heroRef}
//         className="min-h-screen mt-[4rem] flex items-center justify-center bg-gradient-to-br from-background to-yellow-50 dark:from-background dark:to-yellow-900/20 pt-20"
//       >
//         <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-30">
//           <div className='bg-white rounded-lg p-6 shadow-lg flex items-center gap-3'>
//             <Loader2 className='w-5 h-5 animate-spin text-blue-600' />
//             <span className='text-gray-700'>Loading content...</span>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section
//       id="home"
//       ref={heroRef}
//       className="min-h-screen flex items-center bg-gradient-to-br from-background to-yellow-50 dark:from-background dark:to-yellow-900/20 pt-20 relative"
//     >
//       {/* Image Cropper Modal */}
//       {showCropper &&
//         createPortal(
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="fixed inset-0 bg-black/90 z-[2147483647] flex items-center justify-center p-4"
//             style={{ zIndex: 2147483647 }}
//           >
//             <motion.div
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               className="bg-white rounded-xl max-w-6xl w-full h-[90vh] flex flex-col"
//             >
//               {/* Header */}
//               <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
//                 <h3 className="text-lg font-semibold text-gray-800">
//                   Crop Hero Image (4:3 Aspect Ratio)
//                   {isUploading && (
//                     <span className="ml-2 text-blue-600 text-sm flex items-center gap-1">
//                       <Loader2 className="w-4 h-4 animate-spin" />
//                       Uploading...
//                     </span>
//                   )}
//                 </h3>
//                 <button
//                   onClick={cancelCrop}
//                   className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
//                   disabled={isUploading}
//                 >
//                   <X className="w-5 h-5 text-gray-600" />
//                 </button>
//               </div>

//               {/* Cropper Area */}
//               <div className="flex-1 relative bg-gray-900 min-h-0">
//                 <Cropper
//                   image={imageToCrop}
//                   crop={crop}
//                   zoom={zoom}
//                   aspect={aspectRatio}
//                   onCropChange={setCrop}
//                   onZoomChange={setZoom}
//                   onCropComplete={onCropComplete}
//                   showGrid={false}
//                   cropShape="rect"
//                   minZoom={0.1}
//                   maxZoom={5}
//                   restrictPosition={false}
//                   zoomWithScroll={true}
//                   zoomSpeed={0.2}
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

//               {/* Controls */}
//               <div className="p-4 bg-gray-50 border-t border-gray-200">
//                 {/* Aspect Ratio Info */}
//                 <div className="mb-4">
//                   <p className="text-sm font-medium text-gray-700 mb-2">
//                     Aspect Ratio: <span className="text-blue-600">4:3 (Standard)</span>
//                   </p>
//                 </div>

//                 {/* Zoom Control */}
//                 <div className="space-y-2 mb-4">
//                   <div className="flex items-center justify-between text-sm">
//                     <span className="flex items-center gap-2 text-gray-700">
//                       <ZoomIn className="w-4 h-4" />
//                       Zoom
//                     </span>
//                     <span className="text-gray-600">{zoom.toFixed(1)}x</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <button
//                       type="button"
//                       onClick={() => setZoom((z) => Math.max(0.1, +(z - 0.1).toFixed(2)))}
//                       className="p-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
//                       disabled={isUploading}
//                     >
//                       <ZoomOut className="w-4 h-4" />
//                     </button>
//                   <input
//                     type="range"
//                     value={zoom}
//                     min={0.1}
//                     max={5}
//                     step={0.1}
//                     onChange={(e) => setZoom(Number(e.target.value))}
//                     className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
//                     disabled={isUploading}
//                   />
//                     <button
//                       type="button"
//                       onClick={() => setZoom((z) => Math.min(5, +(z + 0.1).toFixed(2)))}
//                       className="p-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
//                       disabled={isUploading}
//                     >
//                       <ZoomIn className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="grid grid-cols-3 gap-3">
//                   <button
//                     onClick={resetCropSettings}
//                     className="w-full border border-gray-300 text-gray-700 hover:bg-gray-100 rounded py-2 text-sm font-medium disabled:opacity-50"
//                     disabled={isUploading}
//                   >
//                     Reset
//                   </button>
//                   <button
//                     onClick={cancelCrop}
//                     className="w-full border border-gray-300 text-gray-700 hover:bg-gray-100 rounded py-2 text-sm font-medium disabled:opacity-50"
//                     disabled={isUploading}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={applyCrop}
//                     className="w-full bg-green-600 hover:bg-green-700 text-white rounded py-2 text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
//                     disabled={isUploading}
//                   >
//                     {isUploading ? (
//                       <>
//                         <Loader2 className="w-4 h-4 animate-spin" />
//                         Uploading...
//                       </>
//                     ) : (
//                       'Apply & Upload'
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>,
//           document.body
//         )}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-20">
//         <div className="grid lg:grid-cols-2 gap-12 items-center">
//           {/* Left Content */}
//           <motion.div
//             className="space-y-8 order-2 lg:order-1"
//             initial='hidden'
//             animate='visible'
//             variants={itemVariants}
//           >
//             {/* Auto-save indicator */}
//             {isEditing && (
//               <div className="flex items-center gap-2 text-sm">
//                 {isAutoSaving && (
//                   <div className="flex items-center gap-1 text-blue-500">
//                     <Loader2 className="w-4 h-4 animate-spin" />
//                     <span>Auto-saving...</span>
//                   </div>
//                 )}
//                 {hasUnsavedChanges && !isAutoSaving && (
//                   <div className="text-yellow-500">
//                     ● Unsaved changes
//                   </div>
//                 )}
//                 {lastSaved && !hasUnsavedChanges && !isAutoSaving && (
//                   <div className="text-green-500">
//                     ✓ Auto-saved {lastSaved.toLocaleTimeString()}
//                   </div>
//                 )}
//               </div>
//             )}

//             <motion.h1
//               className="text-4xl sm:text-5xl lg:text-6xl text-foreground leading-tight"
//               variants={itemVariants}
//             >
//               Hi, I'm{' '}
//               {isEditing ? (
//                 <EditableText
//                   value={displayData.name}
//                   field='name'
//                   className="text-yellow-500 p-1"
//                   placeholder="Your name"
//                   charLimit={TEXT_LIMITS.HEADING}
//                 />
//               ) : (
//                 <span className="text-yellow-500">{displayData.name}</span>
//               )}
//             </motion.h1>

//             <motion.div
//               variants={itemVariants}
//             >
//               {isEditing ? (
//                 <div className="min-h-[120px]">
//                   <EditableText
//                     value={displayData.description}
//                     field='description'
//                     multiline
//                     className="text-lg text-yellow-500 p-1 min-h-[120px]"
//                     placeholder="Your description"
//                     rows={4}
//                     charLimit={TEXT_LIMITS.DESCRIPTION}
//                   />
//                 </div>
//               ) : (
//                 <div
//                   ref={descriptionRef}
//                   className="text-xl text-justify text-muted-foreground leading-relaxed whitespace-pre-wrap break-words"
//                 >
//                   {displayData.description}
//                 </div>
//               )}
//             </motion.div>

//             <motion.div
//               className="flex flex-col sm:flex-row gap-4 mt-4"
//               variants={itemVariants}
//             >
//               {isEditing ? (
//                 <>
//                   <EditableText
//                     value={safeButtons.work}
//                     buttonField='work'
//                     className="px-6 py-3 rounded-lg text-yellow-500 text-center"
//                     placeholder="Work button text"
//                     charLimit={TEXT_LIMITS.SUBTITLE}
//                   />
//                   <EditableText
//                     value={safeButtons.contact}
//                     buttonField='contact'
//                     className="px-6 py-3 text-yellow-500 rounded-lg text-center"
//                     placeholder="Contact button text"
//                     charLimit={TEXT_LIMITS.SUBTITLE}
//                   />
//                 </>
//               ) : (
//                 <>
//                   <a
//                     href="#projects"
//                     className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                   >
//                     {safeButtons.work}
//                   </a>
//                   <a
//                     href="#contact"
//                     className="inline-flex items-center justify-center px-6 py-3 bg-transparent text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
//                   >
//                     {safeButtons.contact}
//                   </a>
//                 </>
//               )}
//             </motion.div>
//           </motion.div>

//           {/* Right Content - User Image with Edit Button on Top */}
//           <motion.div
//             className="relative order-1 lg:order-2"
//             initial='hidden'
//             animate='visible'
//             variants={imageVariants}
//           >
//             {/* Edit Controls - Now placed on top of the image container */}
//             <div className='absolute -top-4 right-4 z-20'>
//               {!isEditing ? (
//                 <Button
//                   onClick={handleEdit}
//                   size='sm'
//                   className='bg-red-500 hover:bg-red-600 shadow-md'
//                   disabled={isLoading}
//                 >
//                   <Edit2 className='w-4 h-4 mr-2' />
//                   Edit
//                 </Button>
//               ) : (
//                 <div className='flex gap-2 justify-end'>
//                   <Button
//                     onClick={handleSave}
//                     size='sm'
//                     className='bg-green-600 hover:bg-green-700 text-white shadow-md'
//                     disabled={isSaving || isUploading}
//                   >
//                     {isUploading ? (
//                       <Loader2 className='w-4 h-4 mr-2 animate-spin' />
//                     ) : isSaving ? (
//                       <Loader2 className='w-4 h-4 mr-2 animate-spin' />
//                     ) : (
//                       <Save className='w-4 h-4 mr-2' />
//                     )}
//                     {isUploading ? "Uploading..." : isSaving ? "Saving..." : "Save"}
//                   </Button>
//                   <Button
//                     onClick={handleCancel}
//                     size='sm'
//                     className='bg-red-400 hover:bg-red-600 shadow-md'
//                     disabled={isSaving || isUploading}
//                   >
//                     <X className='w-4 h-4 mr-2' />
//                     Cancel
//                   </Button>
//                 </div>
//               )}
//             </div>

//             <motion.div
//               className="relative"
//               whileHover={{ scale: 1.05 }}
//               transition={{ duration: 0.3, ease: "easeInOut" }}
//             >
//               <motion.div
//                 className="absolute inset-0 bg-yellow-400 rounded-3xl transform rotate-6"
//               ></motion.div>
//               <motion.div
//                 className="relative bg-card rounded-3xl overflow-hidden shadow-2xl"
//                 whileHover={{
//                   boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
//                   y: -5
//                 }}
//                 transition={{ duration: 0.3, ease: "easeInOut" }}
//               >
//                 <div className="relative">
//                   <img
//                     src={displayData.image}
//                     alt={`${displayData.name} - ${displayData.title}`}
//                     className="w-full h-96 object-cover object-center transition-transform duration-300 hover:scale-110"
//                   />
//                   {isEditing && (
//                     <div className='absolute bottom-2 right-2 flex flex-col gap-2'>
//                       <div className="bg-black/70 text-white p-2 rounded">
//                         <label className='cursor-pointer hover:bg-black/90 transition-colors flex items-center gap-2'>
//                           <Upload className='w-4 h-4' />
//                           Change Image
//                           <input
//                             type='file'
//                             accept='image/*'
//                             className='hidden'
//                             onChange={handleImageSelect}
//                           />
//                         </label>
//                         {pendingImageFile && (
//                           <div className='text-xs text-orange-300 mt-1'>
//                             Pending upload: {pendingImageFile.name}
//                           </div>
//                         )}
//                         <div className='text-xs text-gray-300 mt-1'>
//                           Recommended: 600×800px (3:4 ratio) - Portrait
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </motion.div>
//             </motion.div>
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   );
// }

// // Add default props
// Hero.defaultProps = {
//   heroData: undefined,
//   onStateChange: undefined,
//   userId: '',
//   professionalId: '',
//   templateSelection: '',
// };

import { Edit2, Loader2, Save, Upload, X, ZoomIn, ZoomOut } from "lucide-react";
import { motion } from "motion/react";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import Cropper from "react-easy-crop";

// Text limits
const TEXT_LIMITS = {
  SUBTITLE: 100,
  HEADING: 60,
  DESCRIPTION: 800,
};

// Custom Button component
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

// Define types for Hero data based on backend structure
interface CTAButton {
  variant: string;
  text: string;
  href: string;
}

// FIX: Add missing stats interface
interface HeroStats {
  projects?: string;
  experience?: string;
  satisfaction?: string;
}

interface HeroData {
  name: string;
  title: string;
  description: string;
  image: string;
  // Support both old structure (buttons) and new structure (ctaButtons)
  buttons?: {
    work: string;
    contact: string;
  };
  ctaButtons?: CTAButton[];
  // FIX: Add missing stats property
  stats?: HeroStats;
}

// Props interface
interface HeroProps {
  heroData?: Partial<HeroData>;
  onStateChange?: (data: HeroData) => void;
  userId?: string;
  professionalId?: string;
  templateSelection?: string;
}

export function Hero({
  heroData,
  onStateChange,
  userId,
  professionalId,
  templateSelection,
}: HeroProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);

  // Auto-save states
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();
  const lastSavedDataRef = useRef<HeroData | null>(null);

  // Cropping states
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [aspectRatio] = useState(4 / 3); // Fixed 4:3 aspect ratio

  const heroRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);

  // FIX: Use ref for onStateChange to prevent infinite loops
  const onStateChangeRef = useRef(onStateChange);
  useEffect(() => {
    onStateChangeRef.current = onStateChange;
  }, [onStateChange]);

  // Helper function to transform backend data to component format
  const transformHeroData = useCallback(
    (backendData: Partial<HeroData>): HeroData => {
      // Handle buttons transformation - convert ctaButtons array to buttons object
      let buttons = { work: "", contact: "" };

      if (backendData.ctaButtons && backendData.ctaButtons.length > 0) {
        // Use the first button for "work" and second for "contact" if available
        buttons = {
          work: backendData.ctaButtons[0]?.text || "",
          contact:
            backendData.ctaButtons[1]?.text ||
            backendData.ctaButtons[0]?.text ||
            "",
        };
      } else if (backendData.buttons) {
        // Fallback to existing buttons structure
        buttons = backendData.buttons;
      }

      return {
        name: backendData.name || "",
        title: backendData.title || "",
        description: backendData.description || "",
        image: backendData.image || "",
        stats: backendData.stats || {},
        buttons,
        // Keep original ctaButtons for saving back to backend if needed
        ctaButtons: backendData.ctaButtons,
      };
    },
    []
  );

  // Helper function to transform component data back to backend format
  const transformToBackendFormat = useCallback(
    (componentData: HeroData): HeroData => {
      // If we had original ctaButtons structure, maintain it
      if (componentData.ctaButtons) {
        const updatedCtaButtons = [...componentData.ctaButtons];

        // Update the text of existing buttons
        if (updatedCtaButtons[0]) {
          updatedCtaButtons[0].text =
            componentData.buttons?.work || updatedCtaButtons[0].text;
        }
        if (updatedCtaButtons[1]) {
          updatedCtaButtons[1].text =
            componentData.buttons?.contact || updatedCtaButtons[1].text;
        }

        return {
          ...componentData,
          ctaButtons: updatedCtaButtons,
        };
      }

      // If no ctaButtons existed, create them from buttons
      return {
        ...componentData,
        ctaButtons: [
          {
            variant: "primary",
            text: componentData.buttons?.work || "View Work",
            href: "#projects",
          },
          {
            variant: "secondary",
            text: componentData.buttons?.contact || "Contact Me",
            href: "#contact",
          },
        ],
      };
    },
    []
  );

  // Initialize with empty data structure
  const [data, setData] = useState<HeroData>({
    name: "",
    title: "",
    description: "",
    image: "",
    buttons: {
      work: "",
      contact: "",
    },
    stats: {},
  });

  const [tempData, setTempData] = useState<HeroData>({
    name: "",
    title: "",
    description: "",
    image: "",
    buttons: {
      work: "",
      contact: "",
    },
    stats: {},
  });

  // Auto-save functionality
  const performAutoSave = useCallback(
    async (dataToSave: HeroData) => {
      try {
        setIsAutoSaving(true);

        // Transform data back to backend format before saving
        const backendData = transformToBackendFormat(dataToSave);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (onStateChangeRef.current) {
          onStateChangeRef.current(backendData);
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
    },
    [transformToBackendFormat]
  );

  const scheduleAutoSave = useCallback(
    (updatedData: HeroData) => {
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

  // Data loading effect
  useEffect(() => {
    if (heroData) {
      const transformedData = transformHeroData(heroData);
      setData(transformedData);
      setTempData(transformedData);
      lastSavedDataRef.current = transformedData;
      setDataLoaded(true);
      setIsLoading(false);
    } else if (!dataLoaded) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setDataLoaded(true);
        setIsLoading(false);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [heroData, dataLoaded, transformHeroData]);

  // Intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => {
      if (heroRef.current) observer.unobserve(heroRef.current);
    };
  }, []);

  // Lock body scroll while cropper is open
  useEffect(() => {
    if (showCropper) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [showCropper]);

  // Trigger loading when component becomes visible
  useEffect(() => {
    if (isVisible && !dataLoaded && !isLoading) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        if (heroData) {
          const transformedData = transformHeroData(heroData);
          setData(transformedData);
          setTempData(transformedData);
          lastSavedDataRef.current = transformedData;
        }
        setDataLoaded(true);
        setIsLoading(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isVisible, dataLoaded, isLoading, heroData, transformHeroData]);

  const handleEdit = () => {
    setIsEditing(true);
    setTempData({ ...data });
    setPendingImageFile(null);
    setHasUnsavedChanges(false);
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
  const getCroppedImg = async (imageSrc, pixelCrop) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

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

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          const fileName = originalFile
            ? `cropped-hero-${originalFile.name}`
            : `cropped-hero-${Date.now()}.jpg`;

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
    formData.append("fieldName", "heroImage");

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
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    };
    reader.readAsDataURL(file);

    // Clear the file input
    e.target.value = "";
  };

  // Apply crop and automatically upload to S3
  const applyCrop = async () => {
    try {
      if (!imageToCrop || !croppedAreaPixels) return;

      setIsUploading(true);

      const { file } = await getCroppedImg(imageToCrop, croppedAreaPixels);

      // Upload to S3 immediately (don't use blob URL at all)
      try {
        const s3Url = await uploadImageToS3(file);

        // Update with S3 URL directly
        const finalUpdatedData = {
          ...tempData,
          image: s3Url,
        };
        setTempData(finalUpdatedData);
        performAutoSave(finalUpdatedData); // Immediate save with S3 URL

        toast.success("Image uploaded and saved successfully!");
      } catch (uploadError) {
        console.error("Upload failed:", uploadError);
        toast.error("Image upload failed. Please try again.");
        setIsUploading(false);
        setShowCropper(false);
        return;
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

      // Upload image if there's a pending file
      if (pendingImageFile) {
        setIsUploading(true);
        try {
          const s3Url = await uploadImageToS3(pendingImageFile);
          tempData.image = s3Url;
          setPendingImageFile(null);
        } catch (uploadError) {
          console.error("Upload failed:", uploadError);
          toast.error("Image upload failed");
          setIsUploading(false);
          setIsSaving(false);
          return;
        }
      }

      // Transform data back to backend format before saving
      const backendData = transformToBackendFormat(tempData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setData(tempData);
      lastSavedDataRef.current = tempData;
      setPendingImageFile(null);
      setIsEditing(false);
      setHasUnsavedChanges(false);

      if (onStateChangeRef.current) {
        onStateChangeRef.current(backendData);
      }

      toast.success("Hero section saved successfully!");
    } catch (error) {
      console.error("Error saving hero section:", error);
      toast.error("Error saving changes. Please try again.");
    } finally {
      setIsUploading(false);
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Clear any pending auto-save
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    setTempData(lastSavedDataRef.current || data);
    setPendingImageFile(null);
    setHasUnsavedChanges(false);
    setIsEditing(false);
    toast.info("Changes discarded");
  };

  // Safe data accessor functions
  const getButtons = useCallback(() => {
    return {
      work: tempData?.buttons?.work || "",
      contact: tempData?.buttons?.contact || "",
    };
  }, [tempData]);

  const getStats = useCallback(() => {
    return {
      projects: tempData?.stats?.projects || "",
      experience: tempData?.stats?.experience || "",
      satisfaction: tempData?.stats?.satisfaction || "",
    };
  }, [tempData]);

  // Text validation functions
  const validateTextLength = (text: string, limit: number) => {
    return text.length <= limit;
  };

  // FIX: Stable update functions with useCallback - CORRECTED VERSION
  const updateTempContent = useCallback(
    (field: keyof HeroData, value: string) => {
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

  const updateStat = useCallback(
    (stat: keyof HeroStats, value: string) => {
      setTempData((prev) => {
        const updated = {
          ...prev,
          stats: {
            ...prev.stats,
            [stat]: value,
          },
        };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  const updateButton = useCallback(
    (button: keyof HeroData["buttons"], value: string) => {
      setTempData((prev) => {
        const updated = {
          ...prev,
          buttons: {
            ...prev.buttons,
            [button]: value,
          },
        };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  // FIX: Memoized EditableText component with character limits - CORRECTED VERSION
  const EditableText = useMemo(() => {
    const EditableTextComponent = ({
      value,
      field,
      multiline = false,
      className = "",
      placeholder = "",
      rows = 3,
      statField,
      buttonField,
      charLimit,
    }: {
      value: string;
      field?: keyof HeroData;
      multiline?: boolean;
      className?: string;
      placeholder?: string;
      rows?: number;
      statField?: keyof HeroStats;
      buttonField?: keyof HeroData["buttons"];
      charLimit?: number;
    }) => {
      const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => {
        const newValue = e.target.value;

        // Apply character limit if specified
        if (charLimit && newValue.length > charLimit) {
          return; // Don't update if over limit
        }

        if (statField) {
          updateStat(statField, newValue);
        } else if (buttonField) {
          updateButton(buttonField, newValue);
        } else if (field) {
          updateTempContent(field, newValue);
        }
      };

      const baseClasses =
        "w-full bg-white/80 dark:bg-black/80 backdrop-blur-sm border-2 border-dashed border-yellow-300 rounded focus:border-yellow-400 focus:outline-none text-gray-800 dark:text-white placeholder-gray-500";
      const currentLength = value?.length || 0;
      const isOverLimit = charLimit && currentLength > charLimit;

      return (
        <div className="relative">
          {multiline ? (
            <div className="relative">
              <textarea
                value={value || ""}
                onChange={handleChange}
                className={`${baseClasses} p-3 resize-y overflow-auto whitespace-pre-wrap break-words ${className} ${
                  isOverLimit ? "border-red-400" : ""
                }`}
                placeholder={placeholder}
                rows={rows}
                style={{ whiteSpace: "pre-wrap" }}
              />
              {charLimit && (
                <div
                  className={`absolute bottom-2 right-2 text-xs ${
                    isOverLimit ? "text-red-400" : "text-gray-400"
                  }`}
                >
                  {currentLength}/{charLimit}
                </div>
              )}
            </div>
          ) : (
            <div className="relative">
              <input
                type="text"
                value={value || ""}
                onChange={handleChange}
                className={`${baseClasses} p-2 ${className} ${
                  isOverLimit ? "border-red-400" : ""
                }`}
                placeholder={placeholder}
              />
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
          )}
        </div>
      );
    };
    return EditableTextComponent;
  }, [updateTempContent, updateStat, updateButton]);

  // Safe display data
  const displayData = isEditing ? tempData : data;
  const safeButtons = getButtons();
  const safeStats = getStats();

  // Animation variants
  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const imageVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  if (isLoading) {
    return (
      <section
        ref={heroRef}
        className="min-h-screen mt-[4rem] flex items-center justify-center bg-gradient-to-br from-background to-yellow-50 dark:from-background dark:to-yellow-900/20 pt-20"
      >
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-30">
          <div className="bg-white rounded-lg p-6 shadow-lg flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <span className="text-gray-700">Loading content...</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="home"
      ref={heroRef}
      className="min-h-screen flex items-center bg-gradient-to-br from-background to-yellow-50 dark:from-background dark:to-yellow-900/20 pt-20 relative"
    >
      {/* Image Cropper Modal */}
      {showCropper &&
        createPortal(
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/90 z-[2147483647] flex items-center justify-center p-4"
            style={{ zIndex: 2147483647 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-xl max-w-6xl w-full h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-800">
                  Crop Hero Image (4:3 Aspect Ratio)
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

                {/* Action Buttons */}
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={resetCropSettings}
                    className="w-full border border-gray-300 text-gray-700 hover:bg-gray-100 rounded py-2 text-sm font-medium disabled:opacity-50"
                    disabled={isUploading}
                  >
                    Reset
                  </button>
                  <button
                    onClick={cancelCrop}
                    className="w-full border border-gray-300 text-gray-700 hover:bg-gray-100 rounded py-2 text-sm font-medium disabled:opacity-50"
                    disabled={isUploading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={applyCrop}
                    className="w-full bg-green-600 hover:bg-green-700 text-white rounded py-2 text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
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
          </motion.div>,
          document.body
        )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            className="space-y-8 order-2 lg:order-1"
            initial="hidden"
            animate="visible"
            variants={itemVariants}
          >
            {/* Auto-save indicator */}
            {isEditing && (
              <div className="flex items-center gap-2 text-sm">
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

            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl text-foreground leading-tight"
              variants={itemVariants}
            >
              Hi, I'm{" "}
              {isEditing ? (
                <EditableText
                  value={displayData.name}
                  field="name"
                  className="text-yellow-500"
                  placeholder="Your name"
                  charLimit={TEXT_LIMITS.HEADING}
                />
              ) : (
                <span className="text-yellow-500">{displayData.name}</span>
              )}
            </motion.h1>

            <motion.div variants={itemVariants}>
              {isEditing ? (
                <div className="min-h-[120px]">
                  <EditableText
                    value={displayData.description}
                    field="description"
                    multiline
                    className="text-lg text-yellow-500 min-h-[120px]"
                    placeholder="Your description"
                    rows={4}
                    charLimit={TEXT_LIMITS.DESCRIPTION}
                  />
                </div>
              ) : (
                <div
                  ref={descriptionRef}
                  className="text-xl text-justify text-muted-foreground leading-relaxed whitespace-pre-wrap break-words"
                >
                  {displayData.description}
                </div>
              )}
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 mt-4"
              variants={itemVariants}
            >
              {isEditing ? (
                <>
                  <EditableText
                    value={safeButtons.work}
                    buttonField="work"
                    className="px-6 py-3 rounded-lg text-center bg-blue-600 text-black"
                    placeholder="Work button text"
                    charLimit={TEXT_LIMITS.SUBTITLE}
                  />
                  <EditableText
                    value={safeButtons.contact}
                    buttonField="contact"
                    className="px-6 py-3 rounded-lg text-center bg-transparent text-blue-600 border border-blue-600"
                    placeholder="Contact button text"
                    charLimit={TEXT_LIMITS.SUBTITLE}
                  />
                </>
              ) : (
                <>
                  <a
                    href="#projects"
                    className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {safeButtons.work}
                  </a>
                  <a
                    href="#contact"
                    className="inline-flex items-center justify-center px-6 py-3 bg-transparent text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    {safeButtons.contact}
                  </a>
                </>
              )}
            </motion.div>
          </motion.div>

          {/* Right Content - User Image with Edit Button on Top */}
          <motion.div
            className="relative order-1 lg:order-2"
            initial="hidden"
            animate="visible"
            variants={imageVariants}
          >
            {/* Edit Controls - Now placed on top of the image container */}
            <div className="absolute -top-4 right-4 z-20">
              {!isEditing ? (
                <Button
                  onClick={handleEdit}
                  size="sm"
                  className="bg-red-500 hover:bg-red-600 shadow-md"
                  disabled={isLoading}
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
                    {isUploading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : isSaving ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    {isUploading
                      ? "Uploading..."
                      : isSaving
                      ? "Saving..."
                      : "Save"}
                  </Button>
                  <Button
                    onClick={handleCancel}
                    size="sm"
                    className="bg-red-400 hover:bg-red-600 shadow-md"
                    disabled={isSaving || isUploading}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <motion.div className="absolute inset-0 bg-yellow-400 rounded-3xl transform rotate-6"></motion.div>
              <motion.div
                className="relative bg-card rounded-3xl overflow-hidden shadow-2xl"
                whileHover={{
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  y: -5,
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className="relative">
                  <img
                    src={displayData.image}
                    alt={`${displayData.name} - ${displayData.title}`}
                    className="w-full h-96 object-cover object-center transition-transform duration-300 hover:scale-110"
                  />
                  {isEditing && (
                    <div className="absolute bottom-2 right-2 flex flex-col gap-2">
                      <div className="bg-black/70 text-white p-2 rounded">
                        <label className="cursor-pointer hover:bg-black/90 transition-colors flex items-center gap-2">
                          <Upload className="w-4 h-4" />
                          Change Image
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageSelect}
                          />
                        </label>
                        {pendingImageFile && (
                          <div className="text-xs text-orange-300 mt-1">
                            Pending upload: {pendingImageFile.name}
                          </div>
                        )}
                        <div className="text-xs text-gray-300 mt-1">
                          Recommended: 600×800px (3:4 ratio) - Portrait
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Add default props
Hero.defaultProps = {
  heroData: undefined,
  onStateChange: undefined,
  userId: "",
  professionalId: "",
  templateSelection: "",
};
