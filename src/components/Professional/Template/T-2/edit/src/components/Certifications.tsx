// import { Award, Calendar, ChevronLeft, ChevronRight, Edit2, ExternalLink, Loader2, Plus, Save, Trash2, Upload, X, ZoomIn, ZoomOut } from 'lucide-react';
// import { AnimatePresence, motion } from 'motion/react';
// import { useCallback, useEffect, useRef, useState } from 'react';
// import { toast } from 'sonner';
// import { ImageWithFallback } from './figma/ImageWithFallback';
// import Cropper from 'react-easy-crop';

// // Text limits
// const TEXT_LIMITS = {
//   SUBTITLE: 100,
//   HEADING: 60,
//   DESCRIPTION: 300,
//   CERT_TITLE: 60,
//   CERT_ISSUER: 40,
//   CERT_DATE: 20,
//   CERT_DESCRIPTION: 300,
//   CERT_URL: 200,
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
//   variant?: 'outline' | 'default';
//   size?: 'sm' | 'default';
//   className?: string;
//   disabled?: boolean;
//   [key: string]: any;
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

// interface Certification {
//   id: string;
//   title: string;
//   issuer: string;
//   date: string;
//   image: string;
//   description: string;
//   credentialUrl?: string;
// }

// interface CertificationsData {
//   subtitle: string;
//   heading: string;
//   description: string;
//   certifications: Certification[];
// }

// const defaultData: CertificationsData = {
//   subtitle: "",
//   heading: "",
//   description: "",
//   certifications: []
// };

// interface CertificationsProps {
//   certData?: CertificationsData;
//   onStateChange?: (data: CertificationsData) => void;
//   userId?: string;
//   professionalId?: string;
//   templateSelection?: string;
// }

// export function Certifications({ certData, onStateChange, userId, professionalId, templateSelection }: CertificationsProps) {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [direction, setDirection] = useState(0);
//   const [isEditing, setIsEditing] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);
//   const [isVisible, setIsVisible] = useState(false);
//   const certificationsRef = useRef<HTMLDivElement>(null);
//   const fileInputRefs = useRef<Record<string, HTMLInputElement>>({});

//   // Pending image files for S3 upload
//   const [pendingImageFiles, setPendingImageFiles] = useState<Record<string, File>>({});

//   // Cropping states - UPDATED WITH ZOOM OUT LOGIC
//   const [showCropper, setShowCropper] = useState(false);
//   const [currentCroppingCert, setCurrentCroppingCert] = useState<string | null>(null);
//   const [crop, setCrop] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);
//   const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
//   const [imageToCrop, setImageToCrop] = useState(null);
//   const [originalFile, setOriginalFile] = useState(null);
//   const [aspectRatio, setAspectRatio] = useState(4 / 3);

//   // Initialize with props data or empty structure
//   const [data, setData] = useState<CertificationsData>(certData || defaultData);
//   const [tempData, setTempData] = useState<CertificationsData>(certData || defaultData);

//   // FIX: Use ref for onStateChange to prevent infinite loops
//   const onStateChangeRef = useRef(onStateChange);
//   useEffect(() => {
//     onStateChangeRef.current = onStateChange;
//   }, [onStateChange]);

//   // FIX: Track previous data to avoid unnecessary updates
//   const prevDataRef = useRef<CertificationsData>();

//   // Sync with props data when it changes
//   useEffect(() => {
//     if (certData) {
//       setData(certData);
//       setTempData(certData);
//     }
//   }, [certData]);

//   // FIX: Safe state change notification without infinite loop
//   useEffect(() => {
//     if (onStateChangeRef.current && prevDataRef.current !== data) {
//       onStateChangeRef.current(data);
//       prevDataRef.current = data;
//     }
//   }, [data]);

//   // Intersection observer
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => setIsVisible(entry.isIntersecting),
//       { threshold: 0.1 }
//     );
//     if (certificationsRef.current) observer.observe(certificationsRef.current);
//     return () => {
//       if (certificationsRef.current) observer.unobserve(certificationsRef.current);
//     };
//   }, []);

//   // Calculate displayData based on editing state
//   const displayData = isEditing ? tempData : data;

//   const handleEdit = () => {
//     setIsEditing(true);
//     setTempData({ ...data });
//     setPendingImageFiles({});
//   };

//   // Cropper functions - UPDATED WITH ZOOM OUT LOGIC
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
//           `cropped-certification-${originalFile.name}` :
//           `cropped-certification-${Date.now()}.jpg`;

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
//   const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>, certId: string) => {
//     const file = event.target.files?.[0];
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
//       setCurrentCroppingCert(certId);
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
//       if (!imageToCrop || !croppedAreaPixels || !currentCroppingCert) return;

//       const { file, previewUrl } = await getCroppedImg(imageToCrop, croppedAreaPixels);

//       // Update preview immediately with blob URL (temporary)
//       setTempData(prevData => ({
//         ...prevData,
//         certifications: prevData.certifications.map(cert =>
//           cert.id === currentCroppingCert ? { ...cert, image: previewUrl } : cert
//         )
//       }));

//       // Store the file for upload on Save
//       setPendingImageFiles(prev => ({ ...prev, [currentCroppingCert]: file }));

//       console.log('Certification image cropped, file ready for upload:', file);
//       toast.success('Image cropped successfully! Click Save to upload to S3.');
//       setShowCropper(false);
//       setImageToCrop(null);
//       setOriginalFile(null);
//       setCurrentCroppingCert(null);
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
//     setCurrentCroppingCert(null);
//     setCrop({ x: 0, y: 0 });
//     setZoom(1);
//   };

//   // Zoom functions - ADDED ZOOM OUT LOGIC
//   const handleZoomIn = () => {
//     setZoom(prev => Math.min(5, +(prev + 0.1).toFixed(2)));
//   };

//   const handleZoomOut = () => {
//     setZoom(prev => Math.max(0.1, +(prev - 0.1).toFixed(2)));
//   };

//   const handleZoomChange = (value: number) => {
//     setZoom(Math.max(0.1, Math.min(5, value)));
//   };

//   // Reset zoom - UPDATED WITH ZOOM OUT LOGIC
//   const resetCropSettings = () => {
//     setZoom(1);
//     setCrop({ x: 0, y: 0 });
//   };

//   // Save function with S3 upload
//   const handleSave = async () => {
//     try {
//       setIsUploading(true);

//       // Create a copy of tempData to update with S3 URLs
//       let updatedData = { ...tempData };

//       // Upload images for certifications with pending files
//       for (const [certId, file] of Object.entries(pendingImageFiles)) {
//         if (!userId || !professionalId || !templateSelection) {
//           toast.error('Missing user information. Please refresh and try again.');
//           return;
//         }

//         const formData = new FormData();
//         formData.append('file', file);
//         formData.append('userId', userId);
//         formData.append('fieldName', `certification_${certId}`);

//         const uploadResponse = await fetch(`https://ow3v94b9gf.execute-api.ap-south-1.amazonaws.com/dev/`, {
//           method: 'POST',
//           body: formData,
//         });

//         if (uploadResponse.ok) {
//           const uploadData = await uploadResponse.json();
//           // Update the certification image with the S3 URL
//           updatedData.certifications = updatedData.certifications.map(cert =>
//             cert.id === certId ? { ...cert, image: uploadData.s3Url } : cert
//           );
//           console.log('Certification image uploaded to S3:', uploadData.s3Url);
//         } else {
//           const errorData = await uploadResponse.json();
//           toast.error(`Image upload failed: ${errorData.message || 'Unknown error'}`);
//           return;
//         }
//       }

//       // Clear pending files
//       setPendingImageFiles({});

//       // Save the updated data with S3 URLs
//       setIsSaving(true);
//       await new Promise((resolve) => setTimeout(resolve, 1000));

//       // Update both states with the new URLs
//       setData(updatedData);
//       setTempData(updatedData);

//       setIsEditing(false);
//       toast.success('Certifications saved successfully');

//     } catch (error) {
//       console.error('Error saving certifications:', error);
//       toast.error('Error saving changes. Please try again.');
//     } finally {
//       setIsUploading(false);
//       setIsSaving(false);
//     }
//   };

//   const handleCancel = () => {
//     setTempData({ ...data });
//     setPendingImageFiles({});
//     setIsEditing(false);
//   };

//   // Stable update functions with useCallback
//   const updateCertification = useCallback((index: number, field: keyof Certification, value: string) => {
//     setTempData(prevData => {
//       const updatedCerts = [...prevData.certifications];
//       updatedCerts[index] = { ...updatedCerts[index], [field]: value };
//       return { ...prevData, certifications: updatedCerts };
//     });
//   }, []);

//   const updateHeader = useCallback((field: keyof Omit<CertificationsData, 'certifications'>, value: string) => {
//     setTempData(prevData => ({
//       ...prevData,
//       [field]: value
//     }));
//   }, []);

//   // Memoized functions
//   const addCertification = useCallback(() => {
//     const newCert: Certification = {
//       id: Date.now().toString(),
//       title: "New Certification",
//       issuer: "Issuer Name",
//       date: "2024",
//       image: "",
//       description: "Certification description",
//       credentialUrl: ""
//     };
//     setTempData(prevData => ({
//       ...prevData,
//       certifications: [...prevData.certifications, newCert]
//     }));
//     // Set current index to the new certification
//     setCurrentIndex(tempData.certifications.length);
//   }, [tempData.certifications.length]);

//   const removeCertification = useCallback((index: number) => {
//     setTempData(prevData => {

//       const updatedCerts = prevData.certifications.filter((_, i) => i !== index);

//       // Adjust current index if needed
//       if (currentIndex >= updatedCerts.length) {
//         setCurrentIndex(Math.max(0, updatedCerts.length - 1));
//       }

//       return { ...prevData, certifications: updatedCerts };
//     });
//   }, [currentIndex]);

//   // Navigation functions
//   const nextSlide = () => {
//     if (!displayData.certifications || displayData.certifications.length === 0) return;
//     setDirection(1);
//     setCurrentIndex((prev) => (prev + 1) % displayData.certifications.length);
//   };

//   const prevSlide = () => {
//     if (!displayData.certifications || displayData.certifications.length === 0) return;
//     setDirection(-1);
//     setCurrentIndex((prev) => (prev - 1 + displayData.certifications.length) % displayData.certifications.length);
//   };

//   const goToSlide = (index: number) => {
//     if (!displayData.certifications || displayData.certifications.length === 0) return;
//     setDirection(index > currentIndex ? 1 : -1);
//     setCurrentIndex(index);
//   };

//   const slideVariants = {
//     enter: (direction: number) => ({
//       x: direction > 0 ? 1000 : -1000,
//       opacity: 0
//     }),
//     center: {
//       zIndex: 1,
//       x: 0,
//       opacity: 1
//     },
//     exit: (direction: number) => ({
//       zIndex: 0,
//       x: direction < 0 ? 1000 : -1000,
//       opacity: 0
//     })
//   };

//   // Check if there's any meaningful data to display
//   const hasData = data.certifications.length > 0 ||
//                   data.subtitle ||
//                   data.heading ||
//                   data.description;

//   // No data state - show empty state with option to add data
//   if (!isEditing && !hasData) {
//     return (
//       <section ref={certificationsRef} id="certifications" className="py-20 bg-gradient-to-br from-yellow-50 to-background dark:from-yellow-900/20 dark:to-background">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           {/* Edit Controls */}
//           <div className='text-right mb-8'>
//             <Button
//               onClick={handleEdit}
//               size='sm'
//               className='bg-red-500 hover:bg-red-600 shadow-md text-white'
//             >
//               <Edit2 className='w-4 h-4 mr-2' />
//               Add Certifications
//             </Button>
//           </div>

//           {/* Empty State */}
//           {/* <div className="text-center py-16">
//             <div className="max-w-md mx-auto">
//               <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
//                 <Award className="w-12 h-12 text-gray-400" />
//               </div>
//               <h3 className="text-2xl font-semibold text-foreground mb-4">
//                 No Certifications Found
//               </h3>
//               <p className="text-muted-foreground mb-8">
//                 Showcase your professional certifications, awards, and achievements to build credibility and trust with your audience.
//               </p>
//               <Button
//                 onClick={handleEdit}
//                 size='lg'
//                 className='bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg'
//               >
//                 <Plus className='w-5 h-5 mr-2' />
//                 Add Your First Certification
//               </Button>
//             </div>
//           </div> */}
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section ref={certificationsRef} id="certifications" className="py-20 text-justify bg-gradient-to-br from-yellow-50 to-background dark:from-yellow-900/20 dark:to-background">
//       {/* Image Cropper Modal - UPDATED WITH ZOOM OUT LOGIC */}
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
//                 Crop Certification Image (4:3 Standard)
//               </h3>
//               <button
//                 onClick={cancelCrop}
//                 className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-600" />
//               </button>
//             </div>

//             {/* Cropper Area - UPDATED WITH ZOOM OUT PROPS */}
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
//                     // border: "2px solid white",
//                     borderRadius: "8px",
//                   },
//                 }}
//               />
//             </div>

//             {/* Controls - UPDATED WITH ZOOM OUT BUTTONS */}
//             <div className="p-4 bg-gray-50 border-t border-gray-200">
//               {/* Aspect Ratio Info */}
//               <div className="mb-4">
//                 <p className="text-sm font-medium text-gray-700 mb-2">
//                   Aspect Ratio: <span className="text-blue-600">4:3 (Standard)</span>
//                 </p>
//               </div>

//               {/* Zoom Control - UPDATED WITH ZOOM OUT BUTTON */}
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
//                     onClick={handleZoomOut}
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
//                     onChange={(e) => handleZoomChange(Number(e.target.value))}
//                     className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
//                   />
//                   <button
//                     type="button"
//                     onClick={handleZoomIn}
//                     className="p-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
//                   >
//                     <ZoomIn className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>

//               {/* Action Buttons - UPDATED LAYOUT */}
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
//               <Button
//                 onClick={addCertification}
//                 variant='outline'
//                 size='sm'
//                 className='bg-blue-50 hover:bg-blue-100 text-blue-700 shadow-md'
//               >
//                 <Plus className='w-4 h-4 mr-2' />
//                 Add Certification
//               </Button>
//             </div>
//           )}
//         </div>

//         {/* Section Header */}
//         <motion.div
//           className="text-center mb-16"
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6 }}
//         >
//           <div className="flex items-center justify-center mb-4">
//             <Award className="w-8 h-8 text-yellow-500 mr-3" />
//             {isEditing ? (
//               <div className="relative">
//                 <input
//                   type="text"
//                   value={displayData.heading || ""}
//                   onChange={(e) => updateHeader('heading', e.target.value)}
//                   className="text-3xl sm:text-4xl lg:text-5xl text-foreground bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 text-center"
//                   placeholder="Certifications & Awards"
//                   maxLength={TEXT_LIMITS.HEADING}
//                 />
//                 <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
//                   {displayData.heading?.length || 0}/{TEXT_LIMITS.HEADING}
//                 </div>
//               </div>
//             ) : (
//               <h2 className="text-3xl sm:text-4xl lg:text-5xl text-foreground">
//                 {displayData.heading }
//               </h2>
//             )}
//           </div>
//           {isEditing ? (
//             <>
//               <div className="relative">
//                 <input
//                   type="text"
//                   value={displayData.subtitle || ""}
//                   onChange={(e) => updateHeader('subtitle', e.target.value)}
//                   className="text-xl text-yellow-600 mb-4 max-w-3xl mx-auto bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 w-full text-center"
//                   placeholder="Subtitle (e.g., Professional Credentials)"
//                   maxLength={TEXT_LIMITS.SUBTITLE}
//                 />
//                 <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
//                   {displayData.subtitle?.length || 0}/{TEXT_LIMITS.SUBTITLE}
//                 </div>
//               </div>
//               <div className="relative">
//                 <textarea
//                   value={displayData.description || ""}
//                   onChange={(e) => updateHeader('description', e.target.value)}
//                   className="text-lg text-muted-foreground max-w-3xl mx-auto bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 w-full"
//                   rows={2}
//                   placeholder="Description of your certifications and achievements"
//                   maxLength={TEXT_LIMITS.DESCRIPTION}
//                 />
//                 <div className="absolute right-2 bottom-2 text-xs text-gray-500">
//                   {displayData.description?.length || 0}/{TEXT_LIMITS.DESCRIPTION}
//                 </div>
//               </div>
//             </>
//           ) : (
//             <>
//               {displayData.subtitle && (
//                 <p className="text-xl text-yellow-600 mb-4 max-w-3xl mx-auto">
//                   {displayData.subtitle}
//                 </p>
//               )}
//               {displayData.description && (
//                 <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
//                   {displayData.description}
//                 </p>
//               )}
//             </>
//           )}
//         </motion.div>

//         {/* Certification Slider - Only show if there are certifications or we're editing */}
//         {(displayData.certifications.length > 0 || isEditing) ? (
//           <div className="relative max-w-5xl mx-auto">
//             <div className="relative h-96 overflow-hidden rounded-2xl bg-card shadow-2xl">
//               <AnimatePresence initial={false} custom={direction}>
//                 {displayData.certifications.length > 0 ? (
//                   <motion.div
//                     key={currentIndex}
//                     custom={direction}
//                     variants={slideVariants}
//                     initial="enter"
//                     animate="center"
//                     exit="exit"
//                     transition={{
//                       x: { type: "spring", stiffness: 300, damping: 30 },
//                       opacity: { duration: 0.2 }
//                     }}
//                     className="absolute inset-0 grid md:grid-cols-2 gap-0"
//                   >
//                     {/* Certification Image */}
//                     <div className="relative">
//                       {isEditing && (
//                         <div className='absolute top-2 right-2 z-10'>
//                           <div className="bg-white/90 backdrop-blur-sm shadow-md rounded p-2">
//                             <Button
//                               onClick={() => fileInputRefs.current[displayData.certifications[currentIndex]?.id]?.click()}
//                               size="sm"
//                               variant="outline"
//                               className="bg-white text-black hover:bg-gray-100"
//                             >
//                               <Upload className='w-4 h-4 mr-2' />
//                               Change Image
//                             </Button>
//                             <input
//                               ref={el => {
//                                 if (displayData.certifications[currentIndex]?.id) {
//                                   fileInputRefs.current[displayData.certifications[currentIndex].id] = el as HTMLInputElement;
//                                 }
//                               }}
//                               type='file'
//                               accept='image/*'
//                               onChange={(e) => handleImageSelect(e, displayData.certifications[currentIndex]?.id || '')}
//                               className='hidden'
//                             />
//                             {pendingImageFiles[displayData.certifications[currentIndex]?.id || ''] && (
//                               <p className='text-xs text-orange-600 mt-1 bg-white p-1 rounded'>
//                                 {pendingImageFiles[displayData.certifications[currentIndex]?.id || '']?.name}
//                               </p>
//                             )}
//                             <div className='text-xs text-gray-500 mt-1 text-center'>
//                               Recommended: 600×450px (4:3 ratio)
//                             </div>
//                           </div>
//                         </div>
//                       )}
//                       {displayData.certifications[currentIndex]?.image ? (
//                         <img
//                           src={displayData.certifications[currentIndex]?.image}
//                           alt={displayData.certifications[currentIndex]?.title || 'Certification image'}
//                           className="w-full h-full object-cover scale-110"
//                           onError={(e) => {
//                             const target = e.target as HTMLImageElement;
//                             target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="500" height="300"%3E%3Crect fill="%23f3f4f6" width="500" height="300"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="18" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ECertificate Image%3C/text%3E%3C/svg%3E';
//                           }}
//                         />
//                       ) : (
//                         <div className="w-full h-full flex items-center justify-center bg-gray-200">
//                           <p className="text-gray-400 text-sm">No image uploaded</p>
//                         </div>
//                       )}
//                       <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
//                     </div>

//                     {/* Certification Details */}
//                     <div className="p-8 flex flex-col justify-center bg-gradient-to-br from-card to-yellow-50 dark:from-card dark:to-yellow-900/20">
//                       {isEditing && (
//                         <Button
//                           onClick={() => removeCertification(currentIndex)}
//                           size='sm'
//                           variant='outline'
//                           className='absolute top-2 right-2 bg-red-50 hover:bg-red-100 text-red-700 p-1'
//                         >
//                           <Trash2 className='w-4 h-4' />
//                         </Button>
//                       )}

//                       <div className="mb-6">
//                         {isEditing ? (
//                           <div className="relative">
//                             <input
//                               type="text"
//                               value={displayData.certifications[currentIndex]?.title || ''}
//                               onChange={(e) => updateCertification(currentIndex, 'title', e.target.value)}
//                               className="w-full text-2xl lg:text-3xl text-foreground mb-2 bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2"
//                               placeholder="Certification Title"
//                               maxLength={TEXT_LIMITS.CERT_TITLE}
//                             />
//                             <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
//                               {displayData.certifications[currentIndex]?.title?.length || 0}/{TEXT_LIMITS.CERT_TITLE}
//                             </div>
//                           </div>
//                         ) : (
//                           <h3 className="text-2xl lg:text-3xl text-foreground mb-2">
//                             {displayData.certifications[currentIndex]?.title || ''}
//                           </h3>
//                         )}

//                         <div className="flex items-center text-yellow-600 mb-4">
//                           <Calendar className="w-5 h-5 mr-2" />
//                           {isEditing ? (
//                             <div className="flex gap-2 w-full">
//                               <div className="relative flex-1">
//                                 <input
//                                   type="text"
//                                   value={displayData.certifications[currentIndex]?.issuer || ''}
//                                   onChange={(e) => updateCertification(currentIndex, 'issuer', e.target.value)}
//                                   className="bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1 text-lg w-full"
//                                   placeholder="Issuer"
//                                   maxLength={TEXT_LIMITS.CERT_ISSUER}
//                                 />
//                                 <div className="absolute right-1 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
//                                   {displayData.certifications[currentIndex]?.issuer?.length || 0}/{TEXT_LIMITS.CERT_ISSUER}
//                                 </div>
//                               </div>
//                               <span>•</span>
//                               <div className="relative">
//                                 <input
//                                   type="text"
//                                   value={displayData.certifications[currentIndex]?.date || ''}
//                                   onChange={(e) => updateCertification(currentIndex, 'date', e.target.value)}
//                                   className="bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1 text-lg w-20"
//                                   placeholder="Date"
//                                   maxLength={TEXT_LIMITS.CERT_DATE}
//                                 />
//                                 <div className="absolute right-1 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
//                                   {displayData.certifications[currentIndex]?.date?.length || 0}/{TEXT_LIMITS.CERT_DATE}
//                                 </div>
//                               </div>
//                             </div>
//                           ) : (
//                             <span className="text-lg">{displayData.certifications[currentIndex]?.issuer || ''} • {displayData.certifications[currentIndex]?.date || ''}</span>
//                           )}
//                         </div>
//                       </div>

//                       {isEditing ? (
//                         <div className="relative">
//                           <textarea
//                             value={displayData.certifications[currentIndex]?.description || ''}
//                             onChange={(e) => updateCertification(currentIndex, 'description', e.target.value)}
//                             className="w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 text-muted-foreground mb-6 leading-relaxed"
//                             rows={4}
//                             placeholder="Certification description"
//                             maxLength={TEXT_LIMITS.CERT_DESCRIPTION}
//                           />
//                           <div className="absolute right-2 bottom-2 text-xs text-gray-500">
//                             {displayData.certifications[currentIndex]?.description?.length || 0}/{TEXT_LIMITS.CERT_DESCRIPTION}
//                           </div>
//                         </div>
//                       ) : (
//                         <p className="text-muted-foreground mb-6 leading-relaxed">
//                           {displayData.certifications[currentIndex]?.description || ''}
//                         </p>
//                       )}

//                       {isEditing ? (
//                         <div className="relative">
//                           <input
//                             type="text"
//                             value={displayData.certifications[currentIndex]?.credentialUrl || ''}
//                             onChange={(e) => updateCertification(currentIndex, 'credentialUrl', e.target.value)}
//                             className="w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2"
//                             placeholder="Credential URL (optional)"
//                             maxLength={TEXT_LIMITS.CERT_URL}
//                           />
//                           <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
//                             {displayData.certifications[currentIndex]?.credentialUrl?.length || 0}/{TEXT_LIMITS.CERT_URL}
//                           </div>
//                         </div>
//                       ) : displayData.certifications[currentIndex]?.credentialUrl && displayData.certifications[currentIndex]?.credentialUrl !== '#' ? (
//                         <a
//                           href={displayData.certifications[currentIndex]?.credentialUrl}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="inline-flex items-center text-yellow-600 hover:text-yellow-700 transition-colors group"
//                         >
//                           <span className="mr-2">View Credential</span>
//                           <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
//                         </a>
//                       ) : null}
//                     </div>
//                   </motion.div>
//                 ) : (
//                   // Empty state when editing but no certifications added yet
//                   <div className="absolute inset-0 flex items-center justify-center bg-card">
//                     <div className="text-center p-8">
//                       <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//                       <h3 className="text-xl font-semibold text-foreground mb-2">
//                         No Certifications Added
//                       </h3>
//                       <p className="text-muted-foreground mb-6">
//                         Add your first certification to showcase your achievements.
//                       </p>
//                       <Button
//                         onClick={addCertification}
//                         size='lg'
//                         className='bg-yellow-500 hover:bg-yellow-600 text-white'
//                       >
//                         <Plus className='w-5 h-5 mr-2' />
//                         Add First Certification
//                       </Button>
//                     </div>
//                   </div>
//                 )}
//               </AnimatePresence>
//             </div>

//             {/* Navigation Arrows - Only show if there are certifications */}
//             {displayData.certifications.length > 0 && (
//               <>
//                 <button
//                   onClick={prevSlide}
//                   className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:text-yellow-600 transition-all duration-300 hover:scale-110 z-10"
//                 >
//                   <ChevronLeft className="w-6 h-6" />
//                 </button>
//                 <button
//                   onClick={nextSlide}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:text-yellow-600 transition-all duration-300 hover:scale-110 z-10"
//                 >
//                   <ChevronRight className="w-6 h-6" />
//                 </button>

//                 {/* Dots Indicator - Only show if there are certifications */}
//                 {displayData.certifications.length > 1 && (
//                   <div className="flex justify-center mt-8 space-x-3">
//                     {displayData.certifications.map((_, index) => (
//                       <button
//                         key={index}
//                         onClick={() => goToSlide(index)}
//                         className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
//                             ? 'bg-yellow-500 scale-125'
//                             : 'bg-gray-300 hover:bg-gray-400'
//                           }`}
//                       />
//                     ))}
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         ) : (
//           // Message when there are headers but no certifications
//           !isEditing && data.certifications.length === 0 && (
//             <div className="text-center py-12">
//               <div className="max-w-md mx-auto">
//                 <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
//                   <Award className="w-8 h-8 text-gray-400" />
//                 </div>
//                 <h4 className="text-lg font-semibold text-foreground mb-2">
//                   No Certifications Added
//                 </h4>
//                 <p className="text-muted-foreground mb-6">
//                   You have section headers configured but no certifications. Add certifications to showcase your achievements.
//                 </p>
//                 <Button
//                   onClick={handleEdit}
//                   size='md'
//                   className='bg-yellow-500 hover:bg-yellow-600 text-white'
//                 >
//                   <Plus className='w-4 h-4 mr-2' />
//                   Add Certifications
//                 </Button>
//               </div>
//             </div>
//           )
//         )}
//       </div>
//     </section>
//   );
// }

import {
  Award,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Edit2,
  ExternalLink,
  Loader2,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import Cropper from "react-easy-crop";

// Text limits
const TEXT_LIMITS = {
  SUBTITLE: 100,
  HEADING: 60,
  DESCRIPTION: 300,
  CERT_TITLE: 60,
  CERT_ISSUER: 40,
  CERT_DATE: 20,
  CERT_DESCRIPTION: 300,
  CERT_URL: 200,
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
  variant?: "outline" | "default";
  size?: "sm" | "default";
  className?: string;
  disabled?: boolean;
  [key: string]: any;
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

interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  image: string;
  description: string;
  credentialUrl?: string;
}

interface CertificationsData {
  subtitle: string;
  heading: string;
  description: string;
  certifications: Certification[];
}

const defaultData: CertificationsData = {
  subtitle: "",
  heading: "",
  description: "",
  certifications: [],
};

interface CertificationsProps {
  certData?: CertificationsData;
  onStateChange?: (data: CertificationsData) => void;
  userId?: string;
  professionalId?: string;
  templateSelection?: string;
}

export function Certifications({
  certData,
  onStateChange,
  userId,
  professionalId,
  templateSelection,
}: CertificationsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const certificationsRef = useRef<HTMLDivElement>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement>>({});

  // Auto-save states
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();
  const lastSavedDataRef = useRef<CertificationsData | null>(null);

  // Pending image files for S3 upload
  const [pendingImageFiles, setPendingImageFiles] = useState<
    Record<string, File>
  >({});

  // Cropping states
  const [showCropper, setShowCropper] = useState(false);
  const [currentCroppingCert, setCurrentCroppingCert] = useState<string | null>(
    null
  );
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(4 / 3);

  // Initialize with props data or empty structure
  const [data, setData] = useState<CertificationsData>(certData || defaultData);
  const [tempData, setTempData] = useState<CertificationsData>(
    certData || defaultData
  );

  // Use ref for onStateChange to prevent infinite loops
  const onStateChangeRef = useRef(onStateChange);
  useEffect(() => {
    onStateChangeRef.current = onStateChange;
  }, [onStateChange]);

  // Track previous data to avoid unnecessary updates
  const prevDataRef = useRef<CertificationsData>();

  // Auto-save functionality
  const performAutoSave = useCallback(
    async (dataToSave: CertificationsData) => {
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
    },
    []
  );

  const scheduleAutoSave = useCallback(
    (updatedData: CertificationsData) => {
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

  // Sync with props data when it changes
  useEffect(() => {
    if (certData) {
      setData(certData);
      setTempData(certData);
      lastSavedDataRef.current = certData;
    }
  }, [certData]);

  // Safe state change notification without infinite loop
  useEffect(() => {
    if (onStateChangeRef.current && prevDataRef.current !== data) {
      onStateChangeRef.current(data);
      prevDataRef.current = data;
    }
  }, [data]);

  // Intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (certificationsRef.current) observer.observe(certificationsRef.current);
    return () => {
      if (certificationsRef.current)
        observer.unobserve(certificationsRef.current);
    };
  }, []);

  // Calculate displayData based on editing state
  const displayData = isEditing ? tempData : data;

  const handleEdit = () => {
    setIsEditing(true);
    setTempData({ ...data });
    setPendingImageFiles({});
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
            ? `cropped-certification-${originalFile.name}`
            : `cropped-certification-${Date.now()}.jpg`;

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
    formData.append("fieldName", "certification_image");

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
  const handleImageSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
    certId: string
  ) => {
    const file = event.target.files?.[0];
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
      setCurrentCroppingCert(certId);
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
      if (!imageToCrop || !croppedAreaPixels || !currentCroppingCert) return;

      setIsUploading(true);

      const { file } = await getCroppedImg(
        imageToCrop,
        croppedAreaPixels
      );

      // Upload to S3 immediately (don't use blob URL at all)
      try {
        const s3Url = await uploadImageToS3(file);

        // Update with S3 URL directly
        const finalUpdatedData = {
          ...tempData,
          certifications: tempData.certifications.map((cert) =>
            cert.id === currentCroppingCert ? { ...cert, image: s3Url } : cert
          ),
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
      setCurrentCroppingCert(null);
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
    setCurrentCroppingCert(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  // Zoom functions
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(5, +(prev + 0.1).toFixed(2)));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(0.1, +(prev - 0.1).toFixed(2)));
  };

  const handleZoomChange = (value: number) => {
    setZoom(Math.max(0.1, Math.min(5, value)));
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

      // Upload images for certifications with pending files
      for (const [certId, file] of Object.entries(pendingImageFiles)) {
        setIsUploading(true);
        try {
          const s3Url = await uploadImageToS3(file);
          tempData.certifications = tempData.certifications.map((cert) =>
            cert.id === certId ? { ...cert, image: s3Url } : cert
          );
        } catch (uploadError) {
          console.error("Upload failed:", uploadError);
          toast.error("Image upload failed");
          setIsUploading(false);
          setIsSaving(false);
          return;
        }
      }

      // Clear pending files
      setPendingImageFiles({});

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setData(tempData);
      lastSavedDataRef.current = tempData;
      setPendingImageFiles({});
      setIsEditing(false);
      setHasUnsavedChanges(false);

      if (onStateChangeRef.current) {
        onStateChangeRef.current(tempData);
      }

      toast.success("Certifications saved successfully!");
    } catch (error) {
      console.error("Error saving certifications:", error);
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
    setPendingImageFiles({});
    setHasUnsavedChanges(false);
    setIsEditing(false);
    toast.info("Changes discarded");
  };

  // Stable update functions with useCallback
  const updateCertification = useCallback(
    (index: number, field: keyof Certification, value: string) => {
      setTempData((prevData) => {
        const updatedCerts = [...prevData.certifications];
        updatedCerts[index] = { ...updatedCerts[index], [field]: value };
        const updated = { ...prevData, certifications: updatedCerts };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  const updateHeader = useCallback(
    (
      field: keyof Omit<CertificationsData, "certifications">,
      value: string
    ) => {
      setTempData((prevData) => {
        const updated = {
          ...prevData,
          [field]: value,
        };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  // Memoized functions
  const addCertification = useCallback(() => {
    const newCert: Certification = {
      id: Date.now().toString(),
      title: "New Certification",
      issuer: "Issuer Name",
      date: "2024",
      image: "",
      description: "Certification description",
      credentialUrl: "",
    };
    setTempData((prevData) => {
      const updated = {
        ...prevData,
        certifications: [...prevData.certifications, newCert],
      };
      scheduleAutoSave(updated);
      return updated;
    });
    // Set current index to the new certification
    setCurrentIndex(tempData.certifications.length);
  }, [tempData.certifications.length, scheduleAutoSave]);

  const removeCertification = useCallback(
    (index: number) => {
      setTempData((prevData) => {
        const updatedCerts = prevData.certifications.filter(
          (_, i) => i !== index
        );

        // Adjust current index if needed
        if (currentIndex >= updatedCerts.length) {
          setCurrentIndex(Math.max(0, updatedCerts.length - 1));
        }

        const updated = { ...prevData, certifications: updatedCerts };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [currentIndex, scheduleAutoSave]
  );

  // Navigation functions
  const nextSlide = () => {
    if (!displayData.certifications || displayData.certifications.length === 0)
      return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % displayData.certifications.length);
  };

  const prevSlide = () => {
    if (!displayData.certifications || displayData.certifications.length === 0)
      return;
    setDirection(-1);
    setCurrentIndex(
      (prev) =>
        (prev - 1 + displayData.certifications.length) %
        displayData.certifications.length
    );
  };

  const goToSlide = (index: number) => {
    if (!displayData.certifications || displayData.certifications.length === 0)
      return;
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  // Check if there's any meaningful data to display
  const hasData =
    data.certifications.length > 0 ||
    data.subtitle ||
    data.heading ||
    data.description;

  // No data state - show empty state with option to add data
  if (!isEditing && !hasData) {
    return (
      <section
        ref={certificationsRef}
        id="certifications"
        className="py-20 bg-gradient-to-br from-yellow-50 to-background dark:from-yellow-900/20 dark:to-background"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Edit Controls */}
          <div className="text-right mb-8">
            <Button
              onClick={handleEdit}
              size="sm"
              className="bg-red-500 hover:bg-red-600 shadow-md text-white"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Add Certifications
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={certificationsRef}
      id="certifications"
      className="py-20 text-justify bg-gradient-to-br from-yellow-50 to-background dark:from-yellow-900/20 dark:to-background"
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
                Crop Certification Image (4:3 Standard)
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
                    onClick={handleZoomOut}
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
                    onChange={(e) => handleZoomChange(Number(e.target.value))}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
                    disabled={isUploading}
                  />
                  <button
                    type="button"
                    onClick={handleZoomIn}
                    className="p-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
                    disabled={isUploading}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
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
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
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
        {/* Edit Controls */}
        <div className="text-right mb-8">
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
            <div className="flex gap-2 justify-end items-center">
              {/* Auto-save indicator */}
              <div className="flex items-center gap-2 mr-4 text-sm">
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
                size="sm"
                className="bg-red-500 hover:bg-red-600 shadow-md text-white"
                disabled={isSaving || isUploading}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={addCertification}
                variant="outline"
                size="sm"
                className="bg-blue-50 hover:bg-blue-100 text-blue-700 shadow-md"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Certification
              </Button>
            </div>
          )}
        </div>

        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center mb-4">
            <Award className="w-8 h-8 text-yellow-500 mr-3" />
            {isEditing ? (
              <div className="relative">
                <input
                  type="text"
                  value={displayData.heading || ""}
                  onChange={(e) => updateHeader("heading", e.target.value)}
                  className="text-3xl sm:text-4xl lg:text-5xl text-foreground bg-white/80 dark:bg-black/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 text-center"
                  placeholder="Certifications & Awards"
                  maxLength={TEXT_LIMITS.HEADING}
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                  {displayData.heading?.length || 0}/{TEXT_LIMITS.HEADING}
                </div>
              </div>
            ) : (
              <h2 className="text-3xl sm:text-4xl lg:text-5xl text-foreground">
                {displayData.heading}
              </h2>
            )}
          </div>
          {isEditing ? (
            <>
              <div className="relative">
                <input
                  type="text"
                  value={displayData.subtitle || ""}
                  onChange={(e) => updateHeader("subtitle", e.target.value)}
                  className="text-xl text-yellow-600 mb-4 max-w-3xl mx-auto bg-white/80 dark:bg-black/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 w-full text-center"
                  placeholder="Subtitle (e.g., Professional Credentials)"
                  maxLength={TEXT_LIMITS.SUBTITLE}
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                  {displayData.subtitle?.length || 0}/{TEXT_LIMITS.SUBTITLE}
                </div>
              </div>
              <div className="relative">
                <textarea
                  value={displayData.description || ""}
                  onChange={(e) => updateHeader("description", e.target.value)}
                  className="text-lg text-muted-foreground max-w-3xl mx-auto bg-white/80 dark:bg-black/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 w-full"
                  rows={2}
                  placeholder="Description of your certifications and achievements"
                  maxLength={TEXT_LIMITS.DESCRIPTION}
                />
                <div className="absolute right-2 bottom-2 text-xs text-gray-500">
                  {displayData.description?.length || 0}/
                  {TEXT_LIMITS.DESCRIPTION}
                </div>
              </div>
            </>
          ) : (
            <>
              {displayData.subtitle && (
                <p className="text-xl text-yellow-600 mb-4 max-w-3xl mx-auto text-center">
                  {displayData.subtitle}
                </p>
              )}
              {displayData.description && (
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center">
                  {displayData.description}
                </p>
              )}
            </>
          )}
        </motion.div>

        {/* Certification Slider - Only show if there are certifications or we're editing */}
        {displayData.certifications.length > 0 || isEditing ? (
          <div className="relative max-w-5xl mx-auto">
            <div className="relative h-96 overflow-hidden rounded-2xl bg-card shadow-2xl">
              <AnimatePresence initial={false} custom={direction}>
                {displayData.certifications.length > 0 ? (
                  <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 },
                    }}
                    className="absolute inset-0 grid md:grid-cols-2 gap-0"
                  >
                    {/* Certification Image */}
                    <div className="relative">
                      {isEditing && (
                        <div className="absolute top-2 right-2 z-10">
                          <div className="bg-white/90 dark:bg-black/90 backdrop-blur-sm shadow-md rounded p-2">
                            <Button
                              onClick={() =>
                                fileInputRefs.current[
                                  displayData.certifications[currentIndex]?.id
                                ]?.click()
                              }
                              size="sm"
                              variant="outline"
                              className="bg-white text-black hover:bg-gray-100"
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Change Image
                            </Button>
                            <input
                              ref={(el) => {
                                if (
                                  displayData.certifications[currentIndex]?.id
                                ) {
                                  fileInputRefs.current[
                                    displayData.certifications[currentIndex].id
                                  ] = el as HTMLInputElement;
                                }
                              }}
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleImageSelect(
                                  e,
                                  displayData.certifications[currentIndex]
                                    ?.id || ""
                                )
                              }
                              className="hidden"
                            />
                            {pendingImageFiles[
                              displayData.certifications[currentIndex]?.id || ""
                            ] && (
                              <p className="text-xs text-orange-600 mt-1 bg-white p-1 rounded">
                                {
                                  pendingImageFiles[
                                    displayData.certifications[currentIndex]
                                      ?.id || ""
                                  ]?.name
                                }
                              </p>
                            )}
                            <div className="text-xs text-gray-500 mt-1 text-center">
                              Recommended: 600×450px (4:3 ratio)
                            </div>
                          </div>
                        </div>
                      )}
                      {displayData.certifications[currentIndex]?.image ? (
                        <img
                          src={displayData.certifications[currentIndex]?.image}
                          alt={
                            displayData.certifications[currentIndex]?.title ||
                            "Certification image"
                          }
                          className="w-full h-full object-cover scale-110"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src =
                              'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="500" height="300"%3E%3Crect fill="%23f3f4f6" width="500" height="300"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="18" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ECertificate Image%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <p className="text-gray-400 text-sm">
                            No image uploaded
                          </p>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
                    </div>

                    {/* Certification Details */}
                    <div className="p-8 flex flex-col justify-center bg-gradient-to-br from-card to-yellow-50 dark:from-card dark:to-yellow-900/20">
                      {isEditing && (
                        <Button
                          onClick={() => removeCertification(currentIndex)}
                          size="sm"
                          variant="outline"
                          className="absolute top-2 right-2 bg-red-50 hover:bg-red-100 text-red-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}

                      <div className="mb-6">
                        {isEditing ? (
                          <div className="relative">
                            <input
                              type="text"
                              value={
                                displayData.certifications[currentIndex]
                                  ?.title || ""
                              }
                              onChange={(e) =>
                                updateCertification(
                                  currentIndex,
                                  "title",
                                  e.target.value
                                )
                              }
                              className="w-full text-2xl lg:text-3xl text-foreground mb-2 bg-white/80 dark:bg-black/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2"
                              placeholder="Certification Title"
                              maxLength={TEXT_LIMITS.CERT_TITLE}
                            />
                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                              {displayData.certifications[currentIndex]?.title
                                ?.length || 0}
                              /{TEXT_LIMITS.CERT_TITLE}
                            </div>
                          </div>
                        ) : (
                          <h3 className="text-2xl lg:text-3xl text-foreground mb-2">
                            {displayData.certifications[currentIndex]?.title ||
                              ""}
                          </h3>
                        )}

                        <div className="flex items-center text-yellow-600 mb-4">
                          <Calendar className="w-5 h-5 mr-2" />
                          {isEditing ? (
                            <div className="flex gap-2 w-full">
                              <div className="relative flex-1">
                                <input
                                  type="text"
                                  value={
                                    displayData.certifications[currentIndex]
                                      ?.issuer || ""
                                  }
                                  onChange={(e) =>
                                    updateCertification(
                                      currentIndex,
                                      "issuer",
                                      e.target.value
                                    )
                                  }
                                  className="bg-white/80 dark:bg-black/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1 text-lg w-full"
                                  placeholder="Issuer"
                                  maxLength={TEXT_LIMITS.CERT_ISSUER}
                                />
                                <div className="absolute right-1 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                                  {displayData.certifications[currentIndex]
                                    ?.issuer?.length || 0}
                                  /{TEXT_LIMITS.CERT_ISSUER}
                                </div>
                              </div>
                              <span>•</span>
                              <div className="relative">
                                <input
                                  type="text"
                                  value={
                                    displayData.certifications[currentIndex]
                                      ?.date || ""
                                  }
                                  onChange={(e) =>
                                    updateCertification(
                                      currentIndex,
                                      "date",
                                      e.target.value
                                    )
                                  }
                                  className="bg-white/80 dark:bg-black/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1 text-lg w-20"
                                  placeholder="Date"
                                  maxLength={TEXT_LIMITS.CERT_DATE}
                                />
                                <div className="absolute right-1 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                                  {displayData.certifications[currentIndex]
                                    ?.date?.length || 0}
                                  /{TEXT_LIMITS.CERT_DATE}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-lg">
                              {displayData.certifications[currentIndex]
                                ?.issuer || ""}{" "}
                              •{" "}
                              {displayData.certifications[currentIndex]?.date ||
                                ""}
                            </span>
                          )}
                        </div>
                      </div>

                      {isEditing ? (
                        <div className="relative">
                          <textarea
                            value={
                              displayData.certifications[currentIndex]
                                ?.description || ""
                            }
                            onChange={(e) =>
                              updateCertification(
                                currentIndex,
                                "description",
                                e.target.value
                              )
                            }
                            className="w-full bg-white/80 dark:bg-black/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 text-muted-foreground mb-6 leading-relaxed"
                            rows={4}
                            placeholder="Certification description"
                            maxLength={TEXT_LIMITS.CERT_DESCRIPTION}
                          />
                          <div className="absolute right-2 bottom-2 text-xs text-gray-500">
                            {displayData.certifications[currentIndex]
                              ?.description?.length || 0}
                            /{TEXT_LIMITS.CERT_DESCRIPTION}
                          </div>
                        </div>
                      ) : (
                        <p className="text-muted-foreground mb-6 leading-relaxed">
                          {displayData.certifications[currentIndex]
                            ?.description || ""}
                        </p>
                      )}

                      {isEditing ? (
                        <div className="relative">
                          <input
                            type="text"
                            value={
                              displayData.certifications[currentIndex]
                                ?.credentialUrl || ""
                            }
                            onChange={(e) =>
                              updateCertification(
                                currentIndex,
                                "credentialUrl",
                                e.target.value
                              )
                            }
                            className="w-full bg-white/80 dark:bg-black/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2"
                            placeholder="Credential URL (optional)"
                            maxLength={TEXT_LIMITS.CERT_URL}
                          />
                          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                            {displayData.certifications[currentIndex]
                              ?.credentialUrl?.length || 0}
                            /{TEXT_LIMITS.CERT_URL}
                          </div>
                        </div>
                      ) : displayData.certifications[currentIndex]
                          ?.credentialUrl &&
                        displayData.certifications[currentIndex]
                          ?.credentialUrl !== "#" ? (
                        <a
                          href={
                            displayData.certifications[currentIndex]
                              ?.credentialUrl
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-yellow-600 hover:text-yellow-700 transition-colors group"
                        >
                          <span className="mr-2">View Credential</span>
                          <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </a>
                      ) : null}
                    </div>
                  </motion.div>
                ) : (
                  // Empty state when editing but no certifications added yet
                  <div className="absolute inset-0 flex items-center justify-center bg-card">
                    <div className="text-center p-8">
                      <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        No Certifications Added
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Add your first certification to showcase your
                        achievements.
                      </p>
                      <Button
                        onClick={addCertification}
                        size="lg"
                        className="bg-yellow-500 hover:bg-yellow-600 text-white"
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        Add First Certification
                      </Button>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Navigation Arrows - Only show if there are certifications */}
            {displayData.certifications.length > 0 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:text-yellow-600 transition-all duration-300 hover:scale-110 z-10"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:text-yellow-600 transition-all duration-300 hover:scale-110 z-10"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Dots Indicator - Only show if there are certifications */}
                {displayData.certifications.length > 1 && (
                  <div className="flex justify-center mt-8 space-x-3">
                    {displayData.certifications.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentIndex
                            ? "bg-yellow-500 scale-125"
                            : "bg-gray-300 hover:bg-gray-400"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          // Message when there are headers but no certifications
          !isEditing &&
          data.certifications.length === 0 && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Award className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2">
                  No Certifications Added
                </h4>
                <p className="text-muted-foreground mb-6">
                  You have section headers configured but no certifications. Add
                  certifications to showcase your achievements.
                </p>
                <Button
                  onClick={handleEdit}
                  size="md"
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Certifications
                </Button>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
}
