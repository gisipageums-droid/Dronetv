// import { Briefcase, Calendar, ChevronLeft, ChevronRight, Edit2, ExternalLink, Loader2, Plus, Save, Trash2, Upload, X, ZoomIn, ZoomOut } from 'lucide-react';
// import { AnimatePresence, motion } from 'motion/react';
// import { useCallback, useEffect, useRef, useState } from 'react';
// import { toast } from 'sonner';
// import Cropper from 'react-easy-crop';

// // Text limits
// const TEXT_LIMITS = {
//   SUBTITLE: 100,
//   HEADING: 60,
//   DESCRIPTION: 300,
//   SERVICE_TITLE: 50,
//   SERVICE_DESCRIPTION: 200,
// };

// // Custom Button component
// const Button = ({
//     children,
//     onClick,
//     variant,
//     size,
//     className,
//     disabled,
//     ...props
// }: {
//     children: React.ReactNode;
//     onClick?: () => void;
//     variant?: 'outline' | 'default';
//     size?: 'sm' | 'default';
//     className?: string;
//     disabled?: boolean;
//     [key: string]: any;
// }) => {
//     const baseClasses =
//         "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
//     const variants = {
//         outline: "border border-gray-300 bg-transparent hover:bg-gray-50",
//         default: "bg-blue-600 text-white hover:bg-blue-700",
//     };
//     const sizes = {
//         sm: "h-8 px-3 text-sm",
//         default: "h-10 px-4",
//     };

//     return (
//         <button
//             className={`${baseClasses} ${variants[variant || 'default']} ${sizes[size || 'default']
//                 } ${className || ""}`}
//             onClick={onClick}
//             disabled={disabled}
//             {...props}
//         >
//             {children}
//         </button>
//     );
// };

// interface Service {
//     id: string;
//     title: string;
//     description: string;
//     image: string;
//     icon?: string;
// }

// interface ServicesData {
//     subtitle: string;
//     heading: string;
//     description: string;
//     services: Service[];
// }

// interface ServicesProps {
//     servicesData?: ServicesData;
//     onStateChange?: (data: ServicesData) => void;
//     userId?: string;
//     professionalId?: string;
//     templateSelection?: string;
// }

// export function Services({ servicesData, onStateChange, userId, professionalId, templateSelection }: ServicesProps) {
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const [direction, setDirection] = useState(0);
//     const [isEditing, setIsEditing] = useState(false);
//     const [isSaving, setIsSaving] = useState(false);
//     const [isUploading, setIsUploading] = useState(false);
//     const [isVisible, setIsVisible] = useState(false);
//     const servicesRef = useRef<HTMLDivElement>(null);
//     const fileInputRefs = useRef<Record<string, HTMLInputElement>>({});
    
//     // Pending image files for S3 upload
//     const [pendingImageFiles, setPendingImageFiles] = useState<Record<string, File>>({});

//     // Cropping states
//     const [showCropper, setShowCropper] = useState(false);
//     const [currentCroppingService, setCurrentCroppingService] = useState<string | null>(null);
//     const [crop, setCrop] = useState({ x: 0, y: 0 });
//     const [zoom, setZoom] = useState(1);
//     const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
//     const [imageToCrop, setImageToCrop] = useState(null);
//     const [originalFile, setOriginalFile] = useState(null);
//     const [aspectRatio] = useState(4 / 3);

//     // Initialize with props data or empty structure
//     const [data, setData] = useState<ServicesData>(servicesData || {
//         subtitle: "",
//         heading: "",
//         description: "",
//         services: []
//     });
//     const [tempData, setTempData] = useState<ServicesData>(servicesData || {
//         subtitle: "",
//         heading: "",
//         description: "",
//         services: []
//     });

//     // Use ref for onStateChange to prevent infinite loops
//     const onStateChangeRef = useRef(onStateChange);
//     useEffect(() => {
//         onStateChangeRef.current = onStateChange;
//     }, [onStateChange]);

//     // Track previous data to avoid unnecessary updates
//     const prevDataRef = useRef<ServicesData>();

//     // Sync with props data when it changes
//     useEffect(() => {
//         if (servicesData) {
//             setData(servicesData);
//             setTempData(servicesData);
//         }
//     }, [servicesData]);

//     // Safe state change notification without infinite loop
//     useEffect(() => {
//         if (onStateChangeRef.current && prevDataRef.current !== data) {
//             onStateChangeRef.current(data);
//             prevDataRef.current = data;
//         }
//     }, [data]);

//     // Intersection observer
//     useEffect(() => {
//         const observer = new IntersectionObserver(
//             ([entry]) => setIsVisible(entry.isIntersecting),
//             { threshold: 0.1 }
//         );
//         if (servicesRef.current) observer.observe(servicesRef.current);
//         return () => {
//             if (servicesRef.current) observer.unobserve(servicesRef.current);
//         };
//     }, []);

//     // Calculate displayData based on editing state
//     const displayData = isEditing ? tempData : data;

//     const handleEdit = () => {
//         setIsEditing(true);
//         setTempData({ ...data });
//         setPendingImageFiles({});
//     };

//     // Cropper functions
//     const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
//         setCroppedAreaPixels(croppedAreaPixels);
//     }, []);

//     // Helper function to create image element
//     const createImage = (url) =>
//         new Promise((resolve, reject) => {
//             const image = new Image();
//             image.addEventListener('load', () => resolve(image));
//             image.addEventListener('error', (error) => reject(error));
//             image.setAttribute('crossOrigin', 'anonymous');
//             image.src = url;
//         });

//     // Function to get cropped image
//     const getCroppedImg = async (imageSrc, pixelCrop) => {
//         const image = await createImage(imageSrc);
//         const canvas = document.createElement('canvas');
//         const ctx = canvas.getContext('2d');

//         canvas.width = pixelCrop.width;
//         canvas.height = pixelCrop.height;

//         ctx.drawImage(
//             image,
//             pixelCrop.x,
//             pixelCrop.y,
//             pixelCrop.width,
//             pixelCrop.height,
//             0,
//             0,
//             pixelCrop.width,
//             pixelCrop.height
//         );

//         return new Promise((resolve) => {
//             canvas.toBlob((blob) => {
//                 const fileName = originalFile ? 
//                     `cropped-service-${originalFile.name}` : 
//                     `cropped-service-${Date.now()}.jpg`;
                
//                 const file = new File([blob], fileName, { 
//                     type: 'image/jpeg',
//                     lastModified: Date.now()
//                 });
                
//                 const previewUrl = URL.createObjectURL(blob);
                
//                 resolve({ 
//                     file, 
//                     previewUrl 
//                 });
//             }, 'image/jpeg', 0.95);
//         });
//     };

//     // Handle image selection - opens cropper
//     const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>, serviceId: string) => {
//         const file = event.target.files?.[0];
//         if (!file) return;

//         if (!file.type.startsWith('image/')) {
//             toast.error('Please select an image file');
//             return;
//         }

//         if (file.size > 5 * 1024 * 1024) {
//             toast.error('File size must be less than 5MB');
//             return;
//         }

//         const reader = new FileReader();
//         reader.onloadend = () => {
//             setImageToCrop(reader.result);
//             setOriginalFile(file);
//             setCurrentCroppingService(serviceId);
//             setShowCropper(true);
//             setZoom(1);
//             setCrop({ x: 0, y: 0 });
//         };
//         reader.readAsDataURL(file);
        
//         // Clear the file input
//         event.target.value = '';
//     };

//     // Apply crop and set pending file
//     const applyCrop = async () => {
//         try {
//             if (!imageToCrop || !croppedAreaPixels || !currentCroppingService) return;

//             const { file, previewUrl } = await getCroppedImg(imageToCrop, croppedAreaPixels);
            
//             // Update preview immediately with blob URL (temporary)
//             setTempData(prevData => ({
//                 ...prevData,
//                 services: prevData.services.map(service =>
//                     service.id === currentCroppingService ? { ...service, image: previewUrl } : service
//                 )
//             }));
            
//             // Store the file for upload on Save
//             setPendingImageFiles(prev => ({ ...prev, [currentCroppingService]: file }));

//             console.log('Service image cropped, file ready for upload:', file);
//             toast.success('Image cropped successfully! Click Save to upload to S3.');
//             setShowCropper(false);
//             setImageToCrop(null);
//             setOriginalFile(null);
//             setCurrentCroppingService(null);
//         } catch (error) {
//             console.error('Error cropping image:', error);
//             toast.error('Error cropping image. Please try again.');
//         }
//     };

//     // Cancel cropping
//     const cancelCrop = () => {
//         setShowCropper(false);
//         setImageToCrop(null);
//         setOriginalFile(null);
//         setCurrentCroppingService(null);
//         setCrop({ x: 0, y: 0 });
//         setZoom(1);
//     };

//     // Reset zoom
//     const resetCropSettings = () => {
//         setZoom(1);
//         setCrop({ x: 0, y: 0 });
//     };

//     // Save function with S3 upload
//     const handleSave = async () => {
//         try {
//             setIsUploading(true);
            
//             let updatedData = { ...tempData };

//             // Upload images for services with pending files
//             for (const [serviceId, file] of Object.entries(pendingImageFiles)) {
//                 if (!userId || !professionalId || !templateSelection) {
//                     toast.error('Missing user information. Please refresh and try again.');
//                     return;
//                 }

//                 const formData = new FormData();
//                 formData.append('file', file);
//                 formData.append('userId', userId);
//                 formData.append('fieldName', `service_${serviceId}`);

//                 const uploadResponse = await fetch(`https://ow3v94b9gf.execute-api.ap-south-1.amazonaws.com/dev/`, {
//                     method: 'POST',
//                     body: formData,
//                 });

//                 if (uploadResponse.ok) {
//                     const uploadData = await uploadResponse.json();
//                     updatedData.services = updatedData.services.map(service =>
//                         service.id === serviceId ? { ...service, image: uploadData.s3Url } : service
//                     );
//                     console.log('Service image uploaded to S3:', uploadData.s3Url);
//                 } else {
//                     const errorData = await uploadResponse.json();
//                     toast.error(`Image upload failed: ${errorData.message || 'Unknown error'}`);
//                     return;
//                 }
//             }

//             // Clear pending files
//             setPendingImageFiles({});

//             // Save the updated data with S3 URLs
//             setIsSaving(true);
//             await new Promise((resolve) => setTimeout(resolve, 1000));
            
//             // Update both states with the new URLs
//             setData(updatedData);
//             setTempData(updatedData);
            
//             setIsEditing(false);
//             toast.success('Services saved successfully');

//         } catch (error) {
//             console.error('Error saving services:', error);
//             toast.error('Error saving changes. Please try again.');
//         } finally {
//             setIsUploading(false);
//             setIsSaving(false);
//         }
//     };

//     const handleCancel = () => {
//         setTempData({ ...data });
//         setPendingImageFiles({});
//         setIsEditing(false);
//     };

//     // Stable update functions with useCallback
//     const updateService = useCallback((index: number, field: keyof Service, value: string) => {
//         setTempData(prevData => {
//             const updatedServices = [...prevData.services];
//             updatedServices[index] = { ...updatedServices[index], [field]: value };
//             return { ...prevData, services: updatedServices };
//         });
//     }, []);

//     const updateHeader = useCallback((field: keyof Omit<ServicesData, 'services'>, value: string) => {
//         setTempData(prevData => ({
//             ...prevData,
//             [field]: value
//         }));
//     }, []);

//     // Memoized functions
//     const addService = useCallback(() => {
//         const newService: Service = {
//             id: Date.now().toString(),
//             title: "New Service",
//             description: "Service description",
//             image: ""
//         };
//         setTempData(prevData => ({
//             ...prevData,
//             services: [...prevData.services, newService]
//         }));
//         // Set current index to the new service
//         setCurrentIndex(tempData.services.length);
//     }, [tempData.services.length]);

//     const removeService = useCallback((index: number) => {
//         setTempData(prevData => {
//             // if (prevData.services.length <= 1) {
//             //     toast.error("You must have at least one service");
//             //     return prevData;
//             // }
            
//             const updatedServices = prevData.services.filter((_, i) => i !== index);
            
//             // Adjust current index if needed
//             if (currentIndex >= updatedServices.length) {
//                 setCurrentIndex(Math.max(0, updatedServices.length - 1));
//             }
            
//             return { ...prevData, services: updatedServices };
//         });
//     }, [currentIndex]);

//     // Navigation functions
//     const nextSlide = () => {
//         if (!displayData.services || displayData.services.length === 0) return;
//         setDirection(1);
//         setCurrentIndex((prev) => (prev + 1) % displayData.services.length);
//     };

//     const prevSlide = () => {
//         if (!displayData.services || displayData.services.length === 0) return;
//         setDirection(-1);
//         setCurrentIndex((prev) => (prev - 1 + displayData.services.length) % displayData.services.length);
//     };

//     const goToSlide = (index: number) => {
//         if (!displayData.services || displayData.services.length === 0) return;
//         setDirection(index > currentIndex ? 1 : -1);
//         setCurrentIndex(index);
//     };

//     const slideVariants = {
//         enter: (direction: number) => ({
//             x: direction > 0 ? 1000 : -1000,
//             opacity: 0
//         }),
//         center: {
//             zIndex: 1,
//             x: 0,
//             opacity: 1
//         },
//         exit: (direction: number) => ({
//             zIndex: 0,
//             x: direction < 0 ? 1000 : -1000,
//             opacity: 0
//         })
//     };

//     // Check if there's any meaningful data to display
//     const hasData = data.services.length > 0 || 
//                     data.subtitle || 
//                     data.heading || 
//                     data.description;

//     // No data state - show empty state with option to add data
//     if (!isEditing && !hasData) {
//         return (
//             <section ref={servicesRef} id="services" className="py-20 bg-gradient-to-br from-red-50 to-background dark:from-red-900/20 dark:to-background">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                     {/* Edit Controls */}
//                     <div className='text-right mb-8'>
//                         <Button
//                             onClick={handleEdit}
//                             size='sm'
//                             className='bg-red-500 hover:bg-red-600 shadow-md text-white'
//                         >
//                             <Edit2 className='w-4 h-4 mr-2' />
//                             Add Services
//                         </Button>
//                     </div>

//                     {/* Empty State
//                     <div className="text-center py-16">
//                         <div className="max-w-md mx-auto">
//                             <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
//                                 <Briefcase className="w-12 h-12 text-gray-400" />
//                             </div>
//                             <h3 className="text-2xl font-semibold text-foreground mb-4">
//                                 No Services Found
//                             </h3>
//                             <p className="text-muted-foreground mb-8">
//                                 Showcase your professional services and expertise to attract potential clients and demonstrate your capabilities.
//                             </p>
//                             <Button
//                                 onClick={handleEdit}
//                                 size='lg'
//                                 className='bg-red-500 hover:bg-red-600 text-white shadow-lg'
//                             >
//                                 <Plus className='w-5 h-5 mr-2' />
//                                 Add Your First Service
//                             </Button>
//                         </div>
//                     </div> */}
//                 </div>
//             </section>
//         );
//     }

//     return (
//         <section ref={servicesRef} id="services" className="py-20 bg-gradient-to-br from-red-50 to-background dark:from-red-900/20 dark:to-background">
//             {/* Image Cropper Modal */}
//             {showCropper && (
//                 <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     className="fixed inset-0 bg-black/90 z-[99999999] flex items-center justify-center p-4"
//                 >
//                     <motion.div
//                         initial={{ scale: 0.9, opacity: 0 }}
//                         animate={{ scale: 1, opacity: 1 }}
//                         className="bg-white rounded-xl max-w-4xl w-full h-[90vh] flex flex-col"
//                     >
//                         {/* Header */}
//                         <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
//                             <h3 className="text-lg font-semibold text-gray-800">
//                                 Crop Service Image (4:3 Standard)
//                             </h3>
//                             <button
//                                 onClick={cancelCrop}
//                                 className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
//                             >
//                                 <X className="w-5 h-5 text-gray-600" />
//                             </button>
//                         </div>

//                         {/* Cropper Area */}
//                         <div className="flex-1 relative bg-gray-900 min-h-0">
//                             <Cropper
//                                 image={imageToCrop}
//                                 crop={crop}
//                                 zoom={zoom}
//                                 aspect={aspectRatio}
//                                 onCropChange={setCrop}
//                                 onZoomChange={setZoom}
//                                 onCropComplete={onCropComplete}
//                                 showGrid={false}
//                                 cropShape="rect"
//                                 minZoom={0.1}
//                                 maxZoom={5}
//                                 restrictPosition={false}
//                                 zoomWithScroll={true}
//                                 zoomSpeed={0.2}
//                                 style={{
//                                     containerStyle: {
//                                         position: "relative",
//                                         width: "100%",
//                                         height: "100%",
//                                     },
//                                     cropAreaStyle: {
//                                         border: "2px solid white",
//                                         borderRadius: "8px",
//                                     },
//                                 }}
//                             />
//                         </div>

//                         {/* Controls */}
//                         <div className="p-4 bg-gray-50 border-t border-gray-200">
//                             {/* Aspect Ratio Info */}
//                             <div className="mb-4">
//                                 <p className="text-sm font-medium text-gray-700 mb-2">
//                                     Aspect Ratio: <span className="text-blue-600">4:3 (Standard)</span>
//                                 </p>
//                             </div>

//                             {/* Zoom Control */
//                             }
//                             <div className="space-y-2 mb-4">
//                                 <div className="flex items-center justify-between text-sm">
//                                     <span className="flex items-center gap-2 text-gray-700">
//                                         <ZoomIn className="w-4 h-4" />
//                                         Zoom
//                                     </span>
//                                     <span className="text-gray-600">{zoom.toFixed(1)}x</span>
//                                 </div>
//                                 <div className="flex items-center gap-2">
//                                     <button
//                                         type="button"
//                                         onClick={() => setZoom((z) => Math.max(0.1, +(z - 0.1).toFixed(2)))}
//                                         className="p-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
//                                     >
//                                         <ZoomOut className="w-4 h-4" />
//                                     </button>
//                                     <input
//                                         type="range"
//                                         value={zoom}
//                                         min={0.1}
//                                         max={5}
//                                         step={0.1}
//                                         onChange={(e) => setZoom(Number(e.target.value))}
//                                         className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
//                                     />
//                                     <button
//                                         type="button"
//                                         onClick={() => setZoom((z) => Math.min(5, +(z + 0.1).toFixed(2)))}
//                                         className="p-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
//                                     >
//                                         <ZoomIn className="w-4 h-4" />
//                                     </button>
//                                 </div>
//                             </div>

//                             {/* Action Buttons */}
//                             <div className="grid grid-cols-3 gap-3">
//                                 <button
//                                     onClick={resetCropSettings}
//                                     className="w-full border border-gray-300 text-gray-700 hover:bg-gray-100 rounded py-2 text-sm font-medium"
//                                 >
//                                     Reset
//                                 </button>
//                                 <button
//                                     onClick={cancelCrop}
//                                     className="w-full border border-gray-300 text-gray-700 hover:bg-gray-100 rounded py-2 text-sm font-medium"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     onClick={applyCrop}
//                                     className="w-full bg-green-600 hover:bg-green-700 text-white rounded py-2 text-sm font-medium"
//                                 >
//                                     Apply Crop
//                                 </button>
//                             </div>
//                         </div>
//                     </motion.div>
//                 </motion.div>
//             )}

//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                 {/* Edit Controls */}
//                 <div className='text-right mb-8'>
//                     {!isEditing ? (
//                         <Button
//                             onClick={handleEdit}
//                             size='sm'
//                             className='bg-red-500 hover:bg-red-600 shadow-md text-white'
//                         >
//                             <Edit2 className='w-4 h-4 mr-2' />
//                             Edit
//                         </Button>
//                     ) : (
//                         <div className='flex gap-2 justify-end'>
//                             <Button
//                                 onClick={handleSave}
//                                 size='sm'
//                                 className='bg-green-600 hover:bg-green-700 text-white shadow-md'
//                                 disabled={isSaving || isUploading}
//                             >
//                                 {isUploading ? (
//                                     <Loader2 className='w-4 h-4 mr-2 animate-spin' />
//                                 ) : isSaving ? (
//                                     <Loader2 className='w-4 h-4 mr-2 animate-spin' />
//                                 ) : (
//                                     <Save className='w-4 h-4 mr-2' />
//                                 )}
//                                 {isUploading ? "Uploading..." : isSaving ? "Saving..." : "Save"}
//                             </Button>
//                             <Button
//                                 onClick={handleCancel}
//                                 size='sm'
//                                 className='bg-red-500 hover:bg-red-600 shadow-md text-white'
//                                 disabled={isSaving || isUploading}
//                             >
//                                 <X className='w-4 h-4 mr-2' />
//                                 Cancel
//                             </Button>
//                             <Button
//                                 onClick={addService}
//                                 variant='outline'
//                                 size='sm'
//                                 className='bg-blue-50 hover:bg-blue-100 text-blue-700 shadow-md'
//                             >
//                                 <Plus className='w-4 h-4 mr-2' />
//                                 Add Service
//                             </Button>
//                         </div>
//                     )}
//                 </div>

//                 {/* Section Header */}
//                 <motion.div
//                     className="text-center mb-16"
//                     initial={{ opacity: 0, y: 30 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     viewport={{ once: true }}
//                     transition={{ duration: 0.6 }}
//                 >
//                     <div className="flex items-center justify-center mb-4">
//                         <Briefcase className="w-8 h-8 text-red-500 mr-3" />
//                         {isEditing ? (
//                             <div className="relative">
//                                 <input
//                                     type="text"
//                                     value={displayData.heading || ""}
//                                     onChange={(e) => updateHeader('heading', e.target.value)}
//                                     className="text-3xl sm:text-4xl lg:text-5xl text-foreground bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 text-center"
//                                     placeholder="Services"
//                                     maxLength={TEXT_LIMITS.HEADING}
//                                 />
//                                 <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
//                                     {displayData.heading?.length || 0}/{TEXT_LIMITS.HEADING}
//                                 </div>
//                             </div>
//                         ) : (
//                             <h2 className="text-3xl sm:text-4xl lg:text-5xl text-foreground">
//                                 {displayData.heading }
//                             </h2>
//                         )}
//                     </div>
//                     {isEditing ? (
//                         <>
//                             <div className="relative">
//                                 <input
//                                     type="text"
//                                     value={displayData.subtitle || ""}
//                                     onChange={(e) => updateHeader('subtitle', e.target.value)}
//                                     className="text-xl text-red-600 mb-4 max-w-3xl mx-auto bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 w-full text-center"
//                                     placeholder="Subtitle (e.g., Professional Services)"
//                                     maxLength={TEXT_LIMITS.SUBTITLE}
//                                 />
//                                 <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
//                                     {displayData.subtitle?.length || 0}/{TEXT_LIMITS.SUBTITLE}
//                                 </div>
//                             </div>
//                             <div className="relative">
//                                 <textarea
//                                     value={displayData.description || ""}
//                                     onChange={(e) => updateHeader('description', e.target.value)}
//                                     className="text-lg text-muted-foreground max-w-3xl mx-auto bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 w-full"
//                                     rows={2}
//                                     placeholder="Description of your services"
//                                     maxLength={TEXT_LIMITS.DESCRIPTION}
//                                 />
//                                 <div className="absolute right-2 bottom-2 text-xs text-gray-500">
//                                     {displayData.description?.length || 0}/{TEXT_LIMITS.DESCRIPTION}
//                                 </div>
//                             </div>
//                         </>
//                     ) : (
//                         <>
//                             {displayData.subtitle && (
//                                 <p className="text-xl text-red-600 mb-4 max-w-3xl mx-auto">
//                                     {displayData.subtitle}
//                                 </p>
//                             )}
//                             {displayData.description && (
//                                 <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
//                                     {displayData.description}
//                                 </p>
//                             )}
//                         </>
//                     )}
//                 </motion.div>

//                 {/* Services Slider - Only show if there are services or we're editing */}
//                 {(displayData.services.length > 0 || isEditing) ? (
//                     <div className="relative max-w-5xl mx-auto">
//                         <div className="relative h-96 overflow-hidden rounded-2xl bg-card shadow-2xl">
//                             <AnimatePresence initial={false} custom={direction}>
//                                 {displayData.services.length > 0 ? (
//                                     <motion.div
//                                         key={currentIndex}
//                                         custom={direction}
//                                         variants={slideVariants}
//                                         initial="enter"
//                                         animate="center"
//                                         exit="exit"
//                                         transition={{
//                                             x: { type: "spring", stiffness: 300, damping: 30 },
//                                             opacity: { duration: 0.2 }
//                                         }}
//                                         className="absolute inset-0 grid md:grid-cols-2 gap-0"
//                                     >
//                                         {/* Service Image - UPDATED to match Certifications component */}
//                                         <div className="relative aspect-[4/3]">
//                                             {isEditing && (
//                                                 <div className='absolute top-2 right-2 z-10'>
//                                                     <div className="bg-white/90 backdrop-blur-sm shadow-md rounded p-2">
//                                                         <Button
//                                                             onClick={() => fileInputRefs.current[displayData.services[currentIndex]?.id]?.click()}
//                                                             size="sm"
//                                                             variant="outline"
//                                                             className="bg-white text-black hover:bg-gray-100"
//                                                         >
//                                                             <Upload className='w-4 h-4 mr-2' />
//                                                             Change Image
//                                                         </Button>
//                                                         <input
//                                                             ref={el => {
//                                                                 if (displayData.services[currentIndex]?.id) {
//                                                                     fileInputRefs.current[displayData.services[currentIndex].id] = el as HTMLInputElement;
//                                                                 }
//                                                             }}
//                                                             type='file'
//                                                             accept='image/*'
//                                                             onChange={(e) => handleImageSelect(e, displayData.services[currentIndex]?.id || '')}
//                                                             className='hidden'
//                                                         />
//                                                         {pendingImageFiles[displayData.services[currentIndex]?.id || ''] && (
//                                                             <p className='text-xs text-orange-600 mt-1 bg-white p-1 rounded'>
//                                                                 {pendingImageFiles[displayData.services[currentIndex]?.id || '']?.name}
//                                                             </p>
//                                                         )}
//                                                         <div className='text-xs text-gray-500 mt-1 text-center'>
//                                                             Recommended: 800×600px (4:3 ratio)
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             )}
//                                             {displayData.services[currentIndex]?.image ? (
//                                                 <img
//                                                     src={displayData.services[currentIndex]?.image}
//                                                     alt={displayData.services[currentIndex]?.title || 'Service image'}
//                                                     className="w-full h-full object-cover scale-110"
//                                                     onError={(e) => {
//                                                         const target = e.target as HTMLImageElement;
//                                                         target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="500" height="300"%3E%3Crect fill="%23f3f4f6" width="500" height="300"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="18" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EService Image%3C/text%3E%3C/svg%3E';
//                                                     }}
//                                                 />
//                                             ) : (
//                                                 <div className="w-full h-full flex items-center justify-center bg-gray-200">
//                                                     <p className="text-gray-400 text-sm">No image uploaded</p>
//                                                 </div>
//                                             )}
//                                             <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
//                                         </div>

//                                         {/* Service Details - Fixed height container */}
//                                         <div className="p-8 flex flex-col justify-center bg-gradient-to-br from-card to-red-50 dark:from-card dark:to-red-900/20">
//                                             {isEditing && (
//                                                 <Button
//                                                     onClick={() => removeService(currentIndex)}
//                                                     size='sm'
//                                                     variant='outline'
//                                                     className='absolute top-2 right-2 bg-red-50 hover:bg-red-100 text-red-700 p-1'
//                                                 >
//                                                     <Trash2 className='w-4 h-4' />
//                                                 </Button>
//                                             )}

//                                             <div className="flex-1 flex flex-col justify-center">
//                                                 <div className="mb-6">
//                                                     {isEditing ? (
//                                                         <div className="relative">
//                                                             <input
//                                                                 type="text"
//                                                                 value={displayData.services[currentIndex]?.title || ''}
//                                                                 onChange={(e) => updateService(currentIndex, 'title', e.target.value)}
//                                                                 className="w-full text-2xl lg:text-3xl text-foreground mb-2 bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2"
//                                                                 placeholder="Service Title"
//                                                                 maxLength={TEXT_LIMITS.SERVICE_TITLE}
//                                                             />
//                                                             <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
//                                                                 {displayData.services[currentIndex]?.title?.length || 0}/{TEXT_LIMITS.SERVICE_TITLE}
//                                                             </div>
//                                                         </div>
//                                                     ) : (
//                                                         <h3 className="text-2xl lg:text-3xl text-foreground mb-2">
//                                                             {displayData.services[currentIndex]?.title || ''}
//                                                         </h3>
//                                                     )}
//                                                 </div>

//                                                 {isEditing ? (
//                                                     <div className="relative flex-1">
//                                                         <textarea
//                                                             value={displayData.services[currentIndex]?.description || ''}
//                                                             onChange={(e) => updateService(currentIndex, 'description', e.target.value)}
//                                                             className="w-full h-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 text-muted-foreground leading-relaxed resize-none"
//                                                             placeholder="Service description"
//                                                             maxLength={TEXT_LIMITS.SERVICE_DESCRIPTION}
//                                                         />
//                                                         <div className="absolute right-2 bottom-2 text-xs text-gray-500">
//                                                             {displayData.services[currentIndex]?.description?.length || 0}/{TEXT_LIMITS.SERVICE_DESCRIPTION}
//                                                         </div>
//                                                     </div>
//                                                 ) : (
//                                                     <p className="text-muted-foreground leading-relaxed flex-1">
//                                                         {displayData.services[currentIndex]?.description || ''}
//                                                     </p>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     </motion.div>
//                                 ) : (
//                                     // Empty state when editing but no services added yet
//                                     <div className="absolute inset-0 flex items-center justify-center bg-card">
//                                         <div className="text-center p-8">
//                                             <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//                                             <h3 className="text-xl font-semibold text-foreground mb-2">
//                                                 No Services Added
//                                             </h3>
//                                             <p className="text-muted-foreground mb-6">
//                                                 Add your first service to showcase your offerings.
//                                             </p>
//                                             <Button
//                                                 onClick={addService}
//                                                 size='lg'
//                                                 className='bg-red-500 hover:bg-red-600 text-white'
//                                             >
//                                                 <Plus className='w-5 h-5 mr-2' />
//                                                 Add First Service
//                                             </Button>
//                                         </div>
//                                     </div>
//                                 )}
//                             </AnimatePresence>
//                         </div>

//                         {/* Navigation Arrows - Only show if there are services */}
//                         {displayData.services.length > 0 && (
//                             <>
//                                 <button
//                                     onClick={prevSlide}
//                                     className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:text-red-600 transition-all duration-300 hover:scale-110 z-10"
//                                 >
//                                     <ChevronLeft className="w-6 h-6" />
//                                 </button>
//                                 <button
//                                     onClick={nextSlide}
//                                     className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:text-red-600 transition-all duration-300 hover:scale-110 z-10"
//                                 >
//                                     <ChevronRight className="w-6 h-6" />
//                                 </button>

//                                 {/* Dots Indicator - Only show if there are services */}
//                                 {displayData.services.length > 1 && (
//                                     <div className="flex justify-center mt-8 space-x-3">
//                                         {displayData.services.map((_, index) => (
//                                             <button
//                                                 key={index}
//                                                 onClick={() => goToSlide(index)}
//                                                 className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
//                                                         ? 'bg-red-500 scale-125'
//                                                         : 'bg-gray-300 hover:bg-gray-400'
//                                                     }`}
//                                             />
//                                         ))}
//                                     </div>
//                                 )}
//                             </>
//                         )}
//                     </div>
//                 ) : (
//                     // Message when there are headers but no services
//                     !isEditing && data.services.length === 0 && (
//                         <div className="text-center py-12">
//                             <div className="max-w-md mx-auto">
//                                 <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
//                                     <Briefcase className="w-8 h-8 text-gray-400" />
//                                 </div>
//                                 <h4 className="text-lg font-semibold text-foreground mb-2">
//                                     No Services Added
//                                 </h4>
//                                 <p className="text-muted-foreground mb-6">
//                                     You have section headers configured but no services. Add services to showcase your offerings.
//                                 </p>
//                                 <Button
//                                     onClick={handleEdit}
//                                     size='md'
//                                     className='bg-red-500 hover:bg-red-600 text-white'
//                                 >
//                                     <Plus className='w-4 h-4 mr-2' />
//                                     Add Services
//                                 </Button>
//                             </div>
//                         </div>
//                     )
//                 )}
//             </div>
//         </section>
//     );
// }

import { Briefcase, Calendar, ChevronLeft, ChevronRight, Edit2, ExternalLink, Loader2, Plus, Save, Trash2, Upload, X, ZoomIn, ZoomOut } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import Cropper from 'react-easy-crop';

// Text limits
const TEXT_LIMITS = {
  SUBTITLE: 100,
  HEADING: 60,
  DESCRIPTION: 300,
  SERVICE_TITLE: 50,
  SERVICE_DESCRIPTION: 200,
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
    variant?: 'outline' | 'default';
    size?: 'sm' | 'default';
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
            className={`${baseClasses} ${variants[variant || 'default']} ${sizes[size || 'default']
                } ${className || ""}`}
            onClick={onClick}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};

interface Service {
    id: string;
    title: string;
    description: string;
    image: string;
    icon?: string;
}

interface ServicesData {
    subtitle: string;
    heading: string;
    description: string;
    services: Service[];
}

interface ServicesProps {
    servicesData?: ServicesData;
    onStateChange?: (data: ServicesData) => void;
    userId?: string;
    professionalId?: string;
    templateSelection?: string;
}

export function Services({ servicesData, onStateChange, userId, professionalId, templateSelection }: ServicesProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isAutoSaving, setIsAutoSaving] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const servicesRef = useRef<HTMLDivElement>(null);
    const fileInputRefs = useRef<Record<string, HTMLInputElement>>({});
    
    // Auto-save state
    const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isMountedRef = useRef(true);

    // Pending image files for S3 upload
    const [pendingImageFiles, setPendingImageFiles] = useState<Record<string, File>>({});

    // Cropping states
    const [showCropper, setShowCropper] = useState(false);
    const [currentCroppingService, setCurrentCroppingService] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [imageToCrop, setImageToCrop] = useState(null);
    const [originalFile, setOriginalFile] = useState(null);
    const [aspectRatio] = useState(4 / 3);

    // Initialize with props data or empty structure
    const [data, setData] = useState<ServicesData>(servicesData || {
        subtitle: "",
        heading: "",
        description: "",
        services: []
    });
    const [tempData, setTempData] = useState<ServicesData>(servicesData || {
        subtitle: "",
        heading: "",
        description: "",
        services: []
    });

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            isMountedRef.current = false;
            if (autoSaveTimeoutRef.current) {
                clearTimeout(autoSaveTimeoutRef.current);
            }
        };
    }, []);

    // Use ref for onStateChange to prevent infinite loops
    const onStateChangeRef = useRef(onStateChange);
    useEffect(() => {
        onStateChangeRef.current = onStateChange;
    }, [onStateChange]);

    // Track previous data to avoid unnecessary updates
    const prevDataRef = useRef<ServicesData>();

    // Sync with props data when it changes
    useEffect(() => {
        if (servicesData) {
            setData(servicesData);
            setTempData(servicesData);
        }
    }, [servicesData]);

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
        if (servicesRef.current) observer.observe(servicesRef.current);
        return () => {
            if (servicesRef.current) observer.unobserve(servicesRef.current);
        };
    }, []);

    // Calculate displayData based on editing state
    const displayData = isEditing ? tempData : data;

    // Auto-save function for text content
    const performAutoSave = useCallback(async () => {
        if (!hasUnsavedChanges || !isMountedRef.current || !isEditing) return;

        try {
            setIsAutoSaving(true);
            
            // Simulate API call for auto-save
            await new Promise((resolve) => setTimeout(resolve, 800));
            
            if (isMountedRef.current) {
                setData(tempData);
                setHasUnsavedChanges(false);
                
                if (onStateChangeRef.current) {
                    onStateChangeRef.current(tempData);
                }
                
                toast.success('Changes auto-saved successfully');
            }
        } catch (error) {
            console.error('Error auto-saving services section:', error);
            if (isMountedRef.current) {
                toast.error('Auto-save failed. Changes not saved.');
            }
        } finally {
            if (isMountedRef.current) {
                setIsAutoSaving(false);
            }
        }
    }, [hasUnsavedChanges, isEditing, tempData]);

    // Schedule auto-save with debounce
    const scheduleAutoSave = useCallback(() => {
        if (autoSaveTimeoutRef.current) {
            clearTimeout(autoSaveTimeoutRef.current);
        }

        autoSaveTimeoutRef.current = setTimeout(() => {
            performAutoSave();
        }, 2000); // 2-second delay after user stops typing
    }, [performAutoSave]);

    // Auto-upload image function for AWS S3
    const uploadImageToS3 = useCallback(async (file: File, serviceId: string): Promise<string> => {
        if (!userId || !professionalId || !templateSelection) {
            throw new Error('Missing user information for image upload');
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', userId);
        formData.append('fieldName', `service_${serviceId}`);

        const uploadResponse = await fetch(`https://ow3v94b9gf.execute-api.ap-south-1.amazonaws.com/dev/`, {
            method: 'POST',
            body: formData,
        });

        if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json();
            throw new Error(errorData.message || 'Image upload failed');
        }

        const uploadData = await uploadResponse.json();
        return uploadData.s3Url;
    }, [userId, professionalId, templateSelection]);

    // Auto-upload image when cropping is completed
    const handleAutoImageUpload = useCallback(async (file: File, serviceId: string) => {
        try {
            setIsUploading(true);
            toast.info('Auto-uploading image to S3...');
            
            const s3Url = await uploadImageToS3(file, serviceId);
            
            // Update temp data with the new S3 URL
            setTempData(prevData => ({
                ...prevData,
                services: prevData.services.map(service =>
                    service.id === serviceId ? { ...service, image: s3Url } : service
                )
            }));

            // Clear pending file since it's now uploaded
            setPendingImageFiles(prev => {
                const newPending = { ...prev };
                delete newPending[serviceId];
                return newPending;
            });
            
            setHasUnsavedChanges(true);
            scheduleAutoSave();
            
            toast.success('Image auto-uploaded successfully!');
            return s3Url;
        } catch (error) {
            console.error('Error auto-uploading image:', error);
            toast.error('Failed to auto-upload image. You can save manually later.');
            // Keep the file as pending for manual save
            setPendingImageFiles(prev => ({ ...prev, [serviceId]: file }));
            throw error;
        } finally {
            setIsUploading(false);
        }
    }, [uploadImageToS3, scheduleAutoSave]);

    const handleEdit = () => {
        setIsEditing(true);
        setTempData({ ...data });
        setPendingImageFiles({});
        setHasUnsavedChanges(false);
        
        // Clear any pending auto-save when entering edit mode
        if (autoSaveTimeoutRef.current) {
            clearTimeout(autoSaveTimeoutRef.current);
        }
    };

    // Cropper functions
    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    // Helper function to create image element
    const createImage = (url) =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener('load', () => resolve(image));
            image.addEventListener('error', (error) => reject(error));
            image.setAttribute('crossOrigin', 'anonymous');
            image.src = url;
        });

    // Function to get cropped image
    const getCroppedImg = async (imageSrc, pixelCrop) => {
        const image = await createImage(imageSrc);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

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
            canvas.toBlob((blob) => {
                const fileName = originalFile ? 
                    `cropped-service-${originalFile.name}` : 
                    `cropped-service-${Date.now()}.jpg`;
                
                const file = new File([blob], fileName, { 
                    type: 'image/jpeg',
                    lastModified: Date.now()
                });
                
                const previewUrl = URL.createObjectURL(blob);
                
                resolve({ 
                    file, 
                    previewUrl 
                });
            }, 'image/jpeg', 0.95);
        });
    };

    // Handle image selection - opens cropper
    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>, serviceId: string) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size must be less than 5MB');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setImageToCrop(reader.result);
            setOriginalFile(file);
            setCurrentCroppingService(serviceId);
            setShowCropper(true);
            setZoom(1);
            setCrop({ x: 0, y: 0 });
        };
        reader.readAsDataURL(file);
        
        // Clear the file input
        event.target.value = '';
    };

    // Apply crop and auto-upload image
    const applyCrop = async () => {
        try {
            if (!imageToCrop || !croppedAreaPixels || !currentCroppingService) return;

            const { file, previewUrl } = await getCroppedImg(imageToCrop, croppedAreaPixels);
            
            // Update preview immediately with blob URL (temporary)
            setTempData(prevData => ({
                ...prevData,
                services: prevData.services.map(service =>
                    service.id === currentCroppingService ? { ...service, image: previewUrl } : service
                )
            }));
            
            console.log('Service image cropped, starting auto-upload...', file);
            
            // Auto-upload the cropped image to S3
            await handleAutoImageUpload(file, currentCroppingService);
            
            setShowCropper(false);
            setImageToCrop(null);
            setOriginalFile(null);
            setCurrentCroppingService(null);
        } catch (error) {
            console.error('Error cropping image:', error);
            toast.error('Error cropping image. Please try again.');
        }
    };

    // Cancel cropping
    const cancelCrop = () => {
        setShowCropper(false);
        setImageToCrop(null);
        setOriginalFile(null);
        setCurrentCroppingService(null);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
    };

    // Reset zoom
    const resetCropSettings = () => {
        setZoom(1);
        setCrop({ x: 0, y: 0 });
    };

    // Save function with S3 upload
    const handleSave = async () => {
        try {
            setIsSaving(true);
            
            // Clear any pending auto-save
            if (autoSaveTimeoutRef.current) {
                clearTimeout(autoSaveTimeoutRef.current);
            }

            let updatedData = { ...tempData };

            // Upload images for services with pending files that weren't auto-uploaded
            for (const [serviceId, file] of Object.entries(pendingImageFiles)) {
                if (!userId || !professionalId || !templateSelection) {
                    toast.error('Missing user information. Please refresh and try again.');
                    return;
                }

                setIsUploading(true);
                const s3Url = await uploadImageToS3(file, serviceId);
                updatedData.services = updatedData.services.map(service =>
                    service.id === serviceId ? { ...service, image: s3Url } : service
                );
                console.log('Service image uploaded to S3:', s3Url);
            }

            // Clear pending files
            setPendingImageFiles({});

            // Save the updated data with S3 URLs
            await new Promise((resolve) => setTimeout(resolve, 1000));
            
            // Update both states with the new URLs
            setData(updatedData);
            setTempData(updatedData);
            setHasUnsavedChanges(false);
            
            setIsEditing(false);
            toast.success('Services saved successfully');

        } catch (error) {
            console.error('Error saving services:', error);
            toast.error('Error saving changes. Please try again.');
        } finally {
            setIsUploading(false);
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setTempData({ ...data });
        setPendingImageFiles({});
        setHasUnsavedChanges(false);
        setIsEditing(false);
        
        // Clear any pending auto-save
        if (autoSaveTimeoutRef.current) {
            clearTimeout(autoSaveTimeoutRef.current);
        }
    };

    // Stable update functions with useCallback and auto-save scheduling
    const updateService = useCallback((index: number, field: keyof Service, value: string) => {
        setTempData(prevData => {
            const updatedServices = [...prevData.services];
            updatedServices[index] = { ...updatedServices[index], [field]: value };
            return { ...prevData, services: updatedServices };
        });
        setHasUnsavedChanges(true);
        scheduleAutoSave();
    }, [scheduleAutoSave]);

    const updateHeader = useCallback((field: keyof Omit<ServicesData, 'services'>, value: string) => {
        setTempData(prevData => ({
            ...prevData,
            [field]: value
        }));
        setHasUnsavedChanges(true);
        scheduleAutoSave();
    }, [scheduleAutoSave]);

    // Memoized functions with auto-save scheduling
    const addService = useCallback(() => {
        const newService: Service = {
            id: Date.now().toString(),
            title: "New Service",
            description: "Service description",
            image: ""
        };
        setTempData(prevData => ({
            ...prevData,
            services: [...prevData.services, newService]
        }));
        setHasUnsavedChanges(true);
        scheduleAutoSave();
        // Set current index to the new service
        setCurrentIndex(tempData.services.length);
    }, [tempData.services.length, scheduleAutoSave]);

    const removeService = useCallback((index: number) => {
        setTempData(prevData => {
            // if (prevData.services.length <= 1) {
            //     toast.error("You must have at least one service");
            //     return prevData;
            // }
            
            const updatedServices = prevData.services.filter((_, i) => i !== index);
            
            // Adjust current index if needed
            if (currentIndex >= updatedServices.length) {
                setCurrentIndex(Math.max(0, updatedServices.length - 1));
            }
            
            return { ...prevData, services: updatedServices };
        });
        setHasUnsavedChanges(true);
        scheduleAutoSave();
    }, [currentIndex, scheduleAutoSave]);

    // Navigation functions
    const nextSlide = () => {
        if (!displayData.services || displayData.services.length === 0) return;
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % displayData.services.length);
    };

    const prevSlide = () => {
        if (!displayData.services || displayData.services.length === 0) return;
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + displayData.services.length) % displayData.services.length);
    };

    const goToSlide = (index: number) => {
        if (!displayData.services || displayData.services.length === 0) return;
        setDirection(index > currentIndex ? 1 : -1);
        setCurrentIndex(index);
    };

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    // Check if there's any meaningful data to display
    const hasData = data.services.length > 0 || 
                    data.subtitle || 
                    data.heading || 
                    data.description;

    // No data state - show empty state with option to add data
    if (!isEditing && !hasData) {
        return (
            <section ref={servicesRef} id="services" className="py-20 bg-gradient-to-br from-red-50 to-background dark:from-red-900/20 dark:to-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Edit Controls */}
                    <div className='text-right mb-8'>
                        <Button
                            onClick={handleEdit}
                            size='sm'
                            className='bg-red-500 hover:bg-red-600 shadow-md text-white'
                        >
                            <Edit2 className='w-4 h-4 mr-2' />
                            Add Services
                        </Button>
                    </div>

                    {/* Empty State
                    <div className="text-center py-16">
                        <div className="max-w-md mx-auto">
                            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                                <Briefcase className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="text-2xl font-semibold text-foreground mb-4">
                                No Services Found
                            </h3>
                            <p className="text-muted-foreground mb-8">
                                Showcase your professional services and expertise to attract potential clients and demonstrate your capabilities.
                            </p>
                            <Button
                                onClick={handleEdit}
                                size='lg'
                                className='bg-red-500 hover:bg-red-600 text-white shadow-lg'
                            >
                                <Plus className='w-5 h-5 mr-2' />
                                Add Your First Service
                            </Button>
                        </div>
                    </div> */}
                </div>
            </section>
        );
    }

    return (
        <section ref={servicesRef} id="services" className="py-20 bg-gradient-to-br from-red-50 to-background dark:from-red-900/20 dark:to-background">
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
                        className="bg-white rounded-xl max-w-4xl w-full h-[90vh] flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Crop Service Image (4:3 Standard)
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
                                    Aspect Ratio: <span className="text-blue-600">4:3 (Standard)</span>
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
                                        onClick={() => setZoom((z) => Math.max(0.1, +(z - 0.1).toFixed(2)))}
                                        className="p-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
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
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setZoom((z) => Math.min(5, +(z + 0.1).toFixed(2)))}
                                        className="p-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
                                    >
                                        <ZoomIn className="w-4 h-4" />
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
                                        'Apply & Auto-Upload'
                                    )}
                                </button>
                            </div>
                            {isUploading && (
                                <div className="mt-2 text-center text-sm text-green-600">
                                    Auto-uploading to S3...
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Edit Controls */}
                <div className='text-right mb-8'>
                    {!isEditing ? (
                        <Button
                            onClick={handleEdit}
                            size='sm'
                            className='bg-red-500 hover:bg-red-600 shadow-md text-white'
                        >
                            <Edit2 className='w-4 h-4 mr-2' />
                            Edit
                        </Button>
                    ) : (
                        <div className='flex gap-2 justify-end items-center'>
                            {/* Auto-save status indicator */}
                            {(isAutoSaving || hasUnsavedChanges) && (
                                <div className="flex items-center gap-2 px-3 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-md border border-yellow-300">
                                    {isAutoSaving ? (
                                        <>
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                            Auto-saving...
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                                            Unsaved changes
                                        </>
                                    )}
                                </div>
                            )}
                            <Button
                                onClick={handleSave}
                                size='sm'
                                className='bg-green-600 hover:bg-green-700 text-white shadow-md'
                                disabled={isSaving || isUploading}
                            >
                                {isUploading ? (
                                    <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                                ) : isSaving ? (
                                    <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                                ) : (
                                    <Save className='w-4 h-4 mr-2' />
                                )}
                                {isUploading ? "Uploading..." : isSaving ? "Saving..." : "Save"}
                            </Button>
                            <Button
                                onClick={handleCancel}
                                size='sm'
                                className='bg-red-500 hover:bg-red-600 shadow-md text-white'
                                disabled={isSaving || isUploading}
                            >
                                <X className='w-4 h-4 mr-2' />
                                Cancel
                            </Button>
                            <Button
                                onClick={addService}
                                variant='outline'
                                size='sm'
                                className='bg-blue-50 hover:bg-blue-100 text-blue-700 shadow-md'
                            >
                                <Plus className='w-4 h-4 mr-2' />
                                Add Service
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
                        <Briefcase className="w-8 h-8 text-red-500 mr-3" />
                        {isEditing ? (
                            <div className="relative">
                                <input
                                    type="text"
                                    value={displayData.heading || ""}
                                    onChange={(e) => updateHeader('heading', e.target.value)}
                                    className="text-3xl sm:text-4xl lg:text-5xl text-foreground bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 text-center"
                                    placeholder="Services"
                                    maxLength={TEXT_LIMITS.HEADING}
                                />
                                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                                    {displayData.heading?.length || 0}/{TEXT_LIMITS.HEADING}
                                </div>
                            </div>
                        ) : (
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl text-foreground">
                                {displayData.heading }
                            </h2>
                        )}
                    </div>
                    {isEditing ? (
                        <>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={displayData.subtitle || ""}
                                    onChange={(e) => updateHeader('subtitle', e.target.value)}
                                    className="text-xl text-red-600 mb-4 max-w-3xl mx-auto bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 w-full text-center"
                                    placeholder="Subtitle (e.g., Professional Services)"
                                    maxLength={TEXT_LIMITS.SUBTITLE}
                                />
                                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                                    {displayData.subtitle?.length || 0}/{TEXT_LIMITS.SUBTITLE}
                                </div>
                            </div>
                            <div className="relative">
                                <textarea
                                    value={displayData.description || ""}
                                    onChange={(e) => updateHeader('description', e.target.value)}
                                    className="text-lg text-muted-foreground max-w-3xl mx-auto bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 w-full"
                                    rows={2}
                                    placeholder="Description of your services"
                                    maxLength={TEXT_LIMITS.DESCRIPTION}
                                />
                                <div className="absolute right-2 bottom-2 text-xs text-gray-500">
                                    {displayData.description?.length || 0}/{TEXT_LIMITS.DESCRIPTION}
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {displayData.subtitle && (
                                <p className="text-xl text-red-600 mb-4 max-w-3xl mx-auto">
                                    {displayData.subtitle}
                                </p>
                            )}
                            {displayData.description && (
                                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                                    {displayData.description}
                                </p>
                            )}
                        </>
                    )}
                </motion.div>

                {/* Services Slider - Only show if there are services or we're editing */}
                {(displayData.services.length > 0 || isEditing) ? (
                    <div className="relative max-w-5xl mx-auto">
                        <div className="relative h-96 overflow-hidden rounded-2xl bg-card shadow-2xl">
                            <AnimatePresence initial={false} custom={direction}>
                                {displayData.services.length > 0 ? (
                                    <motion.div
                                        key={currentIndex}
                                        custom={direction}
                                        variants={slideVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={{
                                            x: { type: "spring", stiffness: 300, damping: 30 },
                                            opacity: { duration: 0.2 }
                                        }}
                                        className="absolute inset-0 grid md:grid-cols-2 gap-0"
                                    >
                                        {/* Service Image - UPDATED to match Certifications component */}
                                        <div className="relative aspect-[4/3]">
                                            {isEditing && (
                                                <div className='absolute top-2 right-2 z-10'>
                                                    <div className="bg-white/90 backdrop-blur-sm shadow-md rounded p-2">
                                                        <Button
                                                            onClick={() => fileInputRefs.current[displayData.services[currentIndex]?.id]?.click()}
                                                            size="sm"
                                                            variant="outline"
                                                            className="bg-white text-black hover:bg-gray-100"
                                                        >
                                                            <Upload className='w-4 h-4 mr-2' />
                                                            Change Image
                                                        </Button>
                                                        <input
                                                            ref={el => {
                                                                if (displayData.services[currentIndex]?.id) {
                                                                    fileInputRefs.current[displayData.services[currentIndex].id] = el as HTMLInputElement;
                                                                }
                                                            }}
                                                            type='file'
                                                            accept='image/*'
                                                            onChange={(e) => handleImageSelect(e, displayData.services[currentIndex]?.id || '')}
                                                            className='hidden'
                                                        />
                                                        {pendingImageFiles[displayData.services[currentIndex]?.id || ''] && (
                                                            <p className='text-xs text-orange-600 mt-1 bg-white p-1 rounded'>
                                                                {pendingImageFiles[displayData.services[currentIndex]?.id || '']?.name}
                                                            </p>
                                                        )}
                                                        <div className='text-xs text-gray-500 mt-1 text-center'>
                                                            Recommended: 800×600px (4:3 ratio)
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {displayData.services[currentIndex]?.image ? (
                                                <img
                                                    src={displayData.services[currentIndex]?.image}
                                                    alt={displayData.services[currentIndex]?.title || 'Service image'}
                                                    className="w-full h-full object-cover scale-110"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="500" height="300"%3E%3Crect fill="%23f3f4f6" width="500" height="300"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="18" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EService Image%3C/text%3E%3C/svg%3E';
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                                    <p className="text-gray-400 text-sm">No image uploaded</p>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
                                        </div>

                                        {/* Service Details - Fixed height container */}
                                        <div className="p-8 flex flex-col justify-center bg-gradient-to-br from-card to-red-50 dark:from-card dark:to-red-900/20">
                                            {isEditing && (
                                                <Button
                                                    onClick={() => removeService(currentIndex)}
                                                    size='sm'
                                                    variant='outline'
                                                    className='absolute top-2 right-2 bg-red-50 hover:bg-red-100 text-red-700 p-1'
                                                >
                                                    <Trash2 className='w-4 h-4' />
                                                </Button>
                                            )}

                                            <div className="flex-1 flex flex-col justify-center">
                                                <div className="mb-6">
                                                    {isEditing ? (
                                                        <div className="relative">
                                                            <input
                                                                type="text"
                                                                value={displayData.services[currentIndex]?.title || ''}
                                                                onChange={(e) => updateService(currentIndex, 'title', e.target.value)}
                                                                className="w-full text-2xl lg:text-3xl text-foreground mb-2 bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2"
                                                                placeholder="Service Title"
                                                                maxLength={TEXT_LIMITS.SERVICE_TITLE}
                                                            />
                                                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                                                                {displayData.services[currentIndex]?.title?.length || 0}/{TEXT_LIMITS.SERVICE_TITLE}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <h3 className="text-2xl lg:text-3xl text-foreground mb-2">
                                                            {displayData.services[currentIndex]?.title || ''}
                                                        </h3>
                                                    )}
                                                </div>

                                                {isEditing ? (
                                                    <div className="relative flex-1">
                                                        <textarea
                                                            value={displayData.services[currentIndex]?.description || ''}
                                                            onChange={(e) => updateService(currentIndex, 'description', e.target.value)}
                                                            className="w-full h-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 text-muted-foreground leading-relaxed resize-none"
                                                            placeholder="Service description"
                                                            maxLength={TEXT_LIMITS.SERVICE_DESCRIPTION}
                                                        />
                                                        <div className="absolute right-2 bottom-2 text-xs text-gray-500">
                                                            {displayData.services[currentIndex]?.description?.length || 0}/{TEXT_LIMITS.SERVICE_DESCRIPTION}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="text-muted-foreground leading-relaxed flex-1">
                                                        {displayData.services[currentIndex]?.description || ''}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    // Empty state when editing but no services added yet
                                    <div className="absolute inset-0 flex items-center justify-center bg-card">
                                        <div className="text-center p-8">
                                            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-xl font-semibold text-foreground mb-2">
                                                No Services Added
                                            </h3>
                                            <p className="text-muted-foreground mb-6">
                                                Add your first service to showcase your offerings.
                                            </p>
                                            <Button
                                                onClick={addService}
                                                size='lg'
                                                className='bg-red-500 hover:bg-red-600 text-white'
                                            >
                                                <Plus className='w-5 h-5 mr-2' />
                                                Add First Service
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Navigation Arrows - Only show if there are services */}
                        {displayData.services.length > 0 && (
                            <>
                                <button
                                    onClick={prevSlide}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:text-red-600 transition-all duration-300 hover:scale-110 z-10"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={nextSlide}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:text-red-600 transition-all duration-300 hover:scale-110 z-10"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>

                                {/* Dots Indicator - Only show if there are services */}
                                {displayData.services.length > 1 && (
                                    <div className="flex justify-center mt-8 space-x-3">
                                        {displayData.services.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => goToSlide(index)}
                                                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                                                        ? 'bg-red-500 scale-125'
                                                        : 'bg-gray-300 hover:bg-gray-400'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                ) : (
                    // Message when there are headers but no services
                    !isEditing && data.services.length === 0 && (
                        <div className="text-center py-12">
                            <div className="max-w-md mx-auto">
                                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                    <Briefcase className="w-8 h-8 text-gray-400" />
                                </div>
                                <h4 className="text-lg font-semibold text-foreground mb-2">
                                    No Services Added
                                </h4>
                                <p className="text-muted-foreground mb-6">
                                    You have section headers configured but no services. Add services to showcase your offerings.
                                </p>
                                <Button
                                    onClick={handleEdit}
                                    size='md'
                                    className='bg-red-500 hover:bg-red-600 text-white'
                                >
                                    <Plus className='w-4 h-4 mr-2' />
                                    Add Services
                                </Button>
                            </div>
                        </div>
                    )
                )}
            </div>
        </section>
    );
}