// import { useState, useEffect, useRef, useCallback, ChangeEvent } from "react";
// import type { Area } from "react-easy-crop/types";
// import {
//   Edit2,
//   Check,
//   X,
//   Plus,
//   Trash2,
//   Upload,
//   Loader2,
//   Save,
// } from "lucide-react";
// import { Button } from "../components/ui/button";
// import { toast } from "react-toastify";
// import Cropper from "react-easy-crop";
// import { motion } from "motion/react";
// import user from "/images/user.png";

// interface Testimonial {
//   name: string;
//   rating?: number;
//   image?: string;
//   role?: string;
//   quote?: string;
// }

// interface TestimonialsContent {
//   headline: {
//     title: string;
//     description: string;
//   };
//   testimonials: Testimonial[];
// }

// interface EditableTestimonialsProps {
//   content?: TestimonialsContent;
//   onStateChange?: (data: TestimonialsContent) => void;
//   userId?: string | number;
//   publishedId?: string | number;
//   templateSelection?: string;
// }

// export default function EditableTestimonials({
//   content,
//   onStateChange,
//   userId,
//   publishedId,
//   templateSelection,
// }: EditableTestimonialsProps) {
//   // Character limits
//   const CHAR_LIMITS = {
//     title: 100,
//     description: 200,
//     name: 100,
//     role: 100,
//     quote: 500,
//     statValue: 20,
//     statLabel: 50,
//   };

//   const initialData: TestimonialsContent = content ?? {
//     headline: { title: "", description: "" },
//     testimonials: [],
//   };

//   const [isEditing, setIsEditing] = useState<boolean>(false);
//   const [isSaving, setIsSaving] = useState<boolean>(false);
//   const [isUploading, setIsUploading] = useState<boolean>(false);
//   const [current, setCurrent] = useState<number>(0);
//   const [editingId, setEditingId] = useState<number | null>(null);
//   const [editingField, setEditingField] = useState<keyof Testimonial | null>(
//     null
//   );
//   const [tempValue, setTempValue] = useState<string>("");
//   const [pendingImages, setPendingImages] = useState<Record<number, File>>({});

//   const [cropModalOpen, setCropModalOpen] = useState<boolean>(false);
//   const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState<number>(1);
//   const [rotation, setRotation] = useState<number>(0);
//   const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
//   const [imageToCrop, setImageToCrop] = useState<string | null>(null);
//   const [originalFile, setOriginalFile] = useState<File | null>(null);
//   const [aspectRatio, setAspectRatio] = useState<number>(1);
//   const [cropIndex, setCropIndex] = useState<number | null>(null);

//   const [testimonialsData, setTestimonialsData] =
//     useState<TestimonialsContent>(initialData);
//   const [tempData, setTempData] = useState<TestimonialsContent>(initialData);

//   const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

//   useEffect(() => {
//     if (content) {
//       setTestimonialsData(content);
//       setTempData(content);
//     }
//   }, [content]);

//   useEffect(() => {
//     if (onStateChange) {
//       onStateChange(testimonialsData);
//     }
//   }, [testimonialsData, onStateChange]);

//   useEffect(() => {
//     if (!isEditing && tempData.testimonials.length > 0) {
//       const interval = setInterval(
//         () => setCurrent((c) => (c + 1) % tempData.testimonials.length),
//         5000
//       );
//       return () => clearInterval(interval);
//     }
//     return;
//   }, [tempData.testimonials.length, isEditing]);

//   const handleImageUpload = (
//     testimonialIndex: number,
//     event: ChangeEvent<HTMLInputElement>
//   ) => {
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

//     // Set cropIndex BEFORE opening the modal
//     setCropIndex(testimonialIndex);

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       // reader.result can be string | ArrayBuffer | null; we only accept string
//       const result = reader.result;
//       if (typeof result === "string") {
//         setImageToCrop(result);
//         setOriginalFile(file);
//         setCropModalOpen(true);
//         setAspectRatio(1); // Square for testimonial images
//         setCrop({ x: 0, y: 0 });
//         setZoom(1);
//         setRotation(0);
//       } else {
//         toast.error("Failed to read image file");
//       }
//     };
//     reader.readAsDataURL(file);

//     // clear input so same file can be picked again if needed
//     if (event.target) {
//       event.target.value = "";
//     }
//   };

//   const onCropComplete = useCallback(
//     (_croppedArea: Area, croppedArea: Area) => {
//       setCroppedAreaPixels(croppedArea);
//     },
//     []
//   );

//   const createImage = (url: string): Promise<HTMLImageElement> =>
//     new Promise((resolve, reject) => {
//       const image = new Image();
//       image.addEventListener("load", () => resolve(image));
//       image.addEventListener("error", (error) => reject(error));
//       image.setAttribute("crossOrigin", "anonymous");
//       image.src = url;
//     });

//   const getCroppedImg = async (
//     imageSrc: string,
//     pixelCrop: Area,
//     rotation = 0
//   ): Promise<{ file: File; previewUrl: string }> => {
//     const image = await createImage(imageSrc);
//     const canvas = document.createElement("canvas");
//     const ctx = canvas.getContext("2d");

//     canvas.width = pixelCrop.width;
//     canvas.height = pixelCrop.height;

//     if (!ctx) {
//       throw new Error("Could not get canvas context");
//     }

//     ctx.translate(pixelCrop.width / 2, pixelCrop.height / 2);
//     ctx.rotate((rotation * Math.PI) / 180);
//     ctx.translate(-pixelCrop.width / 2, -pixelCrop.height / 2);

//     // image is HTMLImageElement which is a CanvasImageSource
//     ctx.drawImage(
//       image as CanvasImageSource,
//       pixelCrop.x,
//       pixelCrop.y,
//       pixelCrop.width,
//       pixelCrop.height,
//       0,
//       0,
//       pixelCrop.width,
//       pixelCrop.height
//     );

//     return new Promise((resolve, reject) => {
//       canvas.toBlob(
//         (blob) => {
//           if (!blob) {
//             reject(new Error("Failed to create blob"));
//             return;
//           }

//           const fileName = originalFile?.name
//             ? `cropped-${originalFile.name}`
//             : `cropped-image-${Date.now()}.jpg`;

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
//       if (!imageToCrop || !croppedAreaPixels || cropIndex === null) {
//         console.error("Please select an area to crop or cropIndex is null");
//         return;
//       }

//       const result = await getCroppedImg(
//         imageToCrop,
//         croppedAreaPixels,
//         rotation
//       );

//       // result is typed, destructure safely
//       const { file, previewUrl } = result;

//       // Store the cropped file for upload on Save
//       setPendingImages((prev) => ({ ...prev, [cropIndex]: file }));

//       // Show immediate local preview of cropped image
//       setTempData((prev: TestimonialsContent) => ({
//         ...prev,
//         testimonials: prev.testimonials.map((testimonial, idx) =>
//           idx === (cropIndex ?? -1)
//             ? { ...testimonial, image: previewUrl }
//             : testimonial
//         ),
//       }));

//       setCropModalOpen(false);
//       setImageToCrop(null);
//       setOriginalFile(null);
//       setCropIndex(null); // Reset cropIndex
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
//     setCropIndex(null);
//   };

//   const resetCropSettings = () => {
//     setZoom(1);
//     setRotation(0);
//     setCrop({ x: 0, y: 0 });
//   };

//   const handleEdit = () => {
//     setIsEditing(true);
//     setTempData(testimonialsData);
//   };

//   const handleCancel = () => {
//     setTempData(testimonialsData);
//     setPendingImages({});
//     setIsEditing(false);
//   };

//   const handleSave = async () => {
//     try {
//       setIsUploading(true);

//       // Create a copy of tempData to update with S3 URLs
//       const updatedData: TestimonialsContent = { ...tempData };

//       // Upload all pending images
//       for (const [testimonialIdStr, file] of Object.entries(pendingImages)) {
//         const testimonialId = parseInt(testimonialIdStr, 10);

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
//         formData.append("sectionName", "testimonials");
//         formData.append(
//           "imageField",
//           `testimonials[${testimonialId}].image` + Date.now()
//         );
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
//           // Update the testimonial image in our local copy
//           updatedData.testimonials = updatedData.testimonials.map(
//             (testimonial, index) =>
//               index === testimonialId
//                 ? { ...testimonial, image: uploadData.imageUrl }
//                 : testimonial
//           );
//           console.log("Image uploaded to S3:", uploadData.imageUrl);
//         } else {
//           const errorData = await uploadResponse.json();
//           console.error("Image upload failed:", errorData);
//           toast.error(
//             `Image upload failed: ${errorData.message || "Unknown error"}`
//           );
//           return; // Don't exit edit mode
//         }
//       }

//       // Clear pending images
//       setPendingImages({});

//       // Simulate save delay
//       setIsSaving(true);
//       await new Promise((resolve) => setTimeout(resolve, 1000));

//       // Update both states with the new content including S3 URLs
//       setTestimonialsData(updatedData);
//       setTempData(updatedData);

//       // Exit edit mode
//       setIsEditing(false);
//       toast.success(
//         "Testimonials section saved with S3 URLs ready for publish"
//       );
//     } catch (error) {
//       console.error("Error saving testimonials section:", error);
//       toast.error("Error saving changes. Please try again.");
//       // Keep in edit mode so user can retry
//     } finally {
//       setIsUploading(false);
//       setIsSaving(false);
//     }
//   };

//   const updateHeadlineField = (
//     field: keyof TestimonialsContent["headline"],
//     value: string
//   ) => {
//     setTempData((prev: TestimonialsContent) => ({
//       ...prev,
//       headline: {
//         ...prev.headline,
//         [field]: value,
//       },
//     }));
//   };

//   const updateTestimonialField = (
//     index: number,
//     field: keyof Testimonial,
//     value: string | number | undefined
//   ) => {
//     setTempData((prev: TestimonialsContent) => ({
//       ...prev,
//       testimonials: prev.testimonials.map((testimonial, i) =>
//         i === index ? { ...testimonial, [field]: value } : testimonial
//       ),
//     }));
//   };

//   const addTestimonial = () => {
//     const newTestimonial: Testimonial = {
//       name: "New Client",
//       rating: 5.0,
//       image:
//         "https://tamilnaducouncil.ac.in/wp-content/uploads/2020-04/dummy-avatar.jpg",
//       role: "Position",
//       quote: "Add testimonial quote here.",
//     };
//     setTempData((prev: TestimonialsContent) => ({
//       ...prev,
//       testimonials: [...prev.testimonials, newTestimonial],
//     }));
//   };

//   const deleteTestimonial = (index: number) => {
//     // allow deleting to zero testimonials — just update array and reset current
//     setTempData((prev: TestimonialsContent) => {
//       const newTestimonials = prev.testimonials.filter((_, i) => i !== index);
//       // adjust current index if necessary
//       setCurrent((cur) => {
//         if (newTestimonials.length === 0) return 0;
//         if (cur >= newTestimonials.length) return 0;
//         return cur;
//       });
//       return {
//         ...prev,
//         testimonials: newTestimonials,
//       };
//     });
//   };

//   const startEditField = (
//     id: number,
//     field: keyof Testimonial,
//     currentValue: string
//   ) => {
//     setEditingId(id);
//     setEditingField(field);
//     setTempValue(currentValue);
//   };

//   const saveFieldEdit = () => {
//     if (editingId !== null && editingField) {
//       updateTestimonialField(editingId, editingField, tempValue);
//     }
//     cancelEdit();
//   };

//   const cancelEdit = () => {
//     setEditingId(null);
//     setEditingField(null);
//     setTempValue("");
//   };

//   const renderStars = (rating?: number) => {
//     const stars: JSX.Element[] = [];
//     const rate = rating ?? 0;
//     for (let i = 1; i <= 5; i++) {
//       stars.push(
//         <span
//           key={i}
//           className={i <= rate ? "text-yellow-400" : "text-gray-300"}
//         >
//           ★
//         </span>
//       );
//     }
//     return stars;
//   };

//   const EditableField = ({
//     testimonial,
//     index,
//     field,
//     className = "",
//     multiline = false,
//   }: {
//     testimonial: Testimonial;
//     index: number;
//     field: keyof Testimonial;
//     className?: string;
//     multiline?: boolean;
//   }) => {
//     const isCurrentlyEditing = editingId === index && editingField === field;
//     const value = testimonial[field] as string | undefined;

//     // Get character limit based on field type
//     const getCharLimit = () => {
//       switch (field) {
//         case "name":
//           return CHAR_LIMITS.name;
//         case "role":
//           return CHAR_LIMITS.role;
//         case "quote":
//           return CHAR_LIMITS.quote;
//         default:
//           return 100;
//       }
//     };

//     const charLimit = getCharLimit();

//     if (isCurrentlyEditing) {
//       return (
//         <div className="flex flex-col gap-2 w-full">
//           <div className="flex items-center gap-2">
//             {multiline ? (
//               <textarea
//                 value={tempValue}
//                 onChange={(e) => setTempValue(e.target.value)}
//                 className="flex-1 px-2 py-1 border border-blue-300 rounded resize-none"
//                 rows={3}
//                 maxLength={charLimit}
//                 autoFocus
//               />
//             ) : (
//               <input
//                 type="text"
//                 value={tempValue}
//                 onChange={(e) => setTempValue(e.target.value)}
//                 className="flex-1 px-2 py-1 border border-blue-300 rounded"
//                 maxLength={charLimit}
//                 autoFocus
//               />
//             )}
//             <button
//               onClick={saveFieldEdit}
//               className="p-1 text-green-600 hover:text-green-800"
//             >
//               <Check size={16} />
//             </button>
//             <button
//               onClick={cancelEdit}
//               className="p-1 text-red-600 hover:text-red-800"
//             >
//               <X size={16} />
//             </button>
//           </div>
//           <div className="text-xs text-gray-500 text-right">
//             {tempValue.length}/{charLimit} characters
//           </div>
//         </div>
//       );
//     }

//     return (
//       <div className={`group relative ${className}`}>
//         {multiline ? (
//           <blockquote className="text-lg text-gray-700 italic text-justify">
//             "{value}"
//           </blockquote>
//         ) : (
//           <span>{value}</span>
//         )}
//         <button
//           onClick={() => startEditField(index, field, (value as string) ?? "")}
//           className="opacity-0 group-hover:opacity-100 absolute -right-6 top-0 p-1 text-gray-400 hover:text-blue-600 transition-all duration-200"
//         >
//           <Edit2 size={14} />
//         </button>
//       </div>
//     );
//   };

//   return (
//     <section
//       id="testimonials"
//       className="bg-gray-50 py-16 scroll-mt-20 relative"
//     >
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

//       <div className="max-w-6xl mx-auto px-6">
//         <div className="text-center mb-12">
//           {/* Editable Title */}
//           {isEditing ? (
//             <div className="flex flex-col items-center justify-center gap-2 mb-4">
//               <input
//                 type="text"
//                 value={tempData.headline.title}
//                 onChange={(e) => updateHeadlineField("title", e.target.value)}
//                 className="text-3xl font-bold text-gray-900 px-2 py-1 border border-blue-300 rounded text-center"
//                 maxLength={CHAR_LIMITS.title}
//               />
//               <div className="text-xs text-gray-500">
//                 {tempData.headline.title.length}/{CHAR_LIMITS.title} characters
//               </div>
//             </div>
//           ) : (
//             <div className="mb-4">
//               <h2 className="text-3xl font-bold text-gray-900">
//                 {tempData.headline.title}
//               </h2>
//             </div>
//           )}

//           {/* Editable Description */}
//           {isEditing ? (
//             <div className="flex flex-col items-center justify-center gap-2">
//               <textarea
//                 value={tempData.headline.description}
//                 onChange={(e) =>
//                   updateHeadlineField("description", e.target.value)
//                 }
//                 className="text-gray-600 max-w-2xl px-2 py-1 border border-blue-300 rounded resize-none"
//                 rows={2}
//                 maxLength={CHAR_LIMITS.description}
//               />
//               <div className="text-xs text-gray-500">
//                 {tempData.headline.description.length}/{CHAR_LIMITS.description}{" "}
//                 characters
//               </div>
//             </div>
//           ) : (
//             <p className="text-gray-600 max-w-2xl mx-auto text-justify">
//               {tempData.headline.description}
//             </p>
//           )}
//         </div>

//         <div className="relative overflow-hidden">
//           <div
//             className="flex transition-transform duration-500 ease-in-out"
//             style={{ transform: `translateX(-${current * 100}%)` }}
//           >
//             {tempData.testimonials.map((testimonial, index) => (
//               <div key={index} className="w-full flex-shrink-0">
//                 <div className="mx-4 bg-white shadow-lg border-0 rounded-lg relative">
//                   {/* Delete Button - REMOVED the condition that checks testimonials.length > 1 */}
//                   {isEditing && (
//                     <button
//                       onClick={() => deleteTestimonial(index)}
//                       className="absolute top-2 right-2 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full z-10"
//                     >
//                       <Trash2 size={16} />
//                     </button>
//                   )}

//                   <div className="p-8 text-center">
//                     <div className="mb-6">
//                       <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden relative">
//                         <img
//                           src={testimonial.image || user}
//                           alt={testimonial.name}
//                           className="w-full h-full object-cover scale-110"
//                         />
//                         {isEditing && (
//                           <>
//                             <input
//                               type="file"
//                               accept="image/*"
//                               ref={(el) => (fileInputRefs.current[index] = el)}
//                               onChange={(e) => handleImageUpload(index, e)}
//                               className="hidden"
//                             />
//                             <button
//                               onClick={() =>
//                                 fileInputRefs.current[index]?.click()
//                               }
//                               className="absolute bottom-0 right-0 bg-white/80 p-1 rounded-full"
//                             >
//                               <Upload size={12} />
//                             </button>
//                             {pendingImages[index] && (
//                               <p className="absolute -bottom-6 text-xs text-orange-600 bg-white/80 p-1 rounded">
//                                 Image selected: {pendingImages[index].name}
//                               </p>
//                             )}
//                           </>
//                         )}
//                       </div>
//                       <h3 className="font-semibold text-xl text-gray-900 mb-2">
//                         <EditableField
//                           testimonial={testimonial}
//                           index={index}
//                           field="name"
//                         />
//                       </h3>
//                       <div className="flex justify-center mb-2">
//                         {renderStars(testimonial.rating)}
//                       </div>
//                     </div>

//                     <div className="mb-6">
//                       <EditableField
//                         testimonial={testimonial}
//                         index={index}
//                         field="quote"
//                         multiline={true}
//                       />
//                     </div>

//                     <div className="border-t pt-6">
//                       <p className="text-gray-600 text-justify">
//                         <EditableField
//                           testimonial={testimonial}
//                           index={index}
//                           field="role"
//                         />
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Controls */}
//         <div className="flex justify-center items-center mt-8 space-x-4">
//           {/* Add Button */}
//           {isEditing && (
//             <button
//               onClick={addTestimonial}
//               className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
//             >
//               <Plus size={16} />
//               Add Testimonial
//             </button>
//           )}

//           {/* Pagination Dots */}
//           {tempData.testimonials.length > 0 && (
//             <div className="flex space-x-2">
//               {tempData.testimonials.map((_, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setCurrent(index)}
//                   className={`w-3 h-3 rounded-full transition-colors duration-200 ${index === current
//                     ? "bg-blue-600"
//                     : "bg-gray-300 hover:bg-gray-400"
//                     }`}
//                   aria-label={`Go to testimonial ${index + 1}`}
//                 />
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Enhanced Crop Modal (same as Header.tsx) */}
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
//                 Crop Testimonial Image
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
//                   image={imageToCrop ?? undefined}
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
//                       ? "bg-blue-500 text-white border-blue-500"
//                       : "bg-white text-gray-700 border-gray-300"
//                       }`}
//                   >
//                     1:1 (Square)
//                   </button>
//                   <button
//                     onClick={() => setAspectRatio(4 / 3)}
//                     className={`px-3 py-2 text-sm rounded border ${aspectRatio === 4 / 3
//                       ? "bg-blue-500 text-white border-blue-500"
//                       : "bg-white text-gray-700 border-gray-300"
//                       }`}
//                   >
//                     4:3 (Standard)
//                   </button>
//                   <button
//                     onClick={() => setAspectRatio(16 / 9)}
//                     className={`px-3 py-2 text-sm rounded border ${aspectRatio === 16 / 9
//                       ? "bg-blue-500 text-white border-blue-500"
//                       : "bg-white text-gray-700 border-gray-300"
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
//     </section>
//   );
// }

import { useState, useEffect, useRef, useCallback, ChangeEvent } from "react";
import type { Area } from "react-easy-crop/types";
import {
  Edit2,
  Check,
  X,
  Plus,
  Trash2,
  Upload,
  Loader2,
  Save,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { toast } from "react-toastify";
import Cropper from "react-easy-crop";
import { motion } from "motion/react";
import user from "/images/user.png";

interface Testimonial {
  name: string;
  rating?: number;
  image?: string;
  role?: string;
  quote?: string;
}

interface TestimonialsContent {
  headline: {
    title: string;
    description: string;
  };
  testimonials: Testimonial[];
}

interface EditableTestimonialsProps {
  content?: TestimonialsContent;
  onStateChange?: (data: TestimonialsContent) => void;
  userId?: string | number;
  publishedId?: string | number;
  templateSelection?: string;
}

export default function EditableTestimonials({
  content,
  onStateChange,
  userId,
  publishedId,
  templateSelection,
}: EditableTestimonialsProps) {
  // Character limits
  const CHAR_LIMITS = {
    title: 100,
    description: 200,
    name: 100,
    role: 100,
    quote: 500,
    statValue: 20,
    statLabel: 50,
  };

  // Auto-save configuration
  const AUTO_SAVE_DELAY = 2000; // 2 seconds delay for auto-save
  const MIN_CHANGES_FOR_AUTO_SAVE = 1; // Minimum changes before auto-save

  const initialData: TestimonialsContent = content ?? {
    headline: { title: "", description: "" },
    testimonials: [],
  };

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [current, setCurrent] = useState<number>(0);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingField, setEditingField] = useState<keyof Testimonial | null>(
    null
  );
  const [tempValue, setTempValue] = useState<string>("");

  // Auto-save state
  const [autoSaveEnabled, setAutoSaveEnabled] = useState<boolean>(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);

  const [cropModalOpen, setCropModalOpen] = useState<boolean>(false);
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [aspectRatio, setAspectRatio] = useState<number>(1);
  const [cropIndex, setCropIndex] = useState<number | null>(null);

  const [testimonialsData, setTestimonialsData] =
    useState<TestimonialsContent>(initialData);
  const [tempData, setTempData] = useState<TestimonialsContent>(initialData);

  // Refs for auto-save
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const changesCountRef = useRef<number>(0);

  useEffect(() => {
    if (content) {
      setTestimonialsData(content);
      setTempData(content);
      setAutoSaveEnabled(true);
    }
  }, [content]);

  useEffect(() => {
    if (onStateChange) {
      onStateChange(testimonialsData);
    }
  }, [testimonialsData, onStateChange]);

  useEffect(() => {
    if (!isEditing && tempData.testimonials.length > 0) {
      const interval = setInterval(
        () => setCurrent((c) => (c + 1) % tempData.testimonials.length),
        5000
      );
      return () => clearInterval(interval);
    }
    return;
  }, [tempData.testimonials.length, isEditing]);

  // Auto-save effect
  useEffect(() => {
    if (!autoSaveEnabled || !unsavedChanges || changesCountRef.current < MIN_CHANGES_FOR_AUTO_SAVE) {
      return;
    }

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout for auto-save
    saveTimeoutRef.current = setTimeout(() => {
      performAutoSave();
    }, AUTO_SAVE_DELAY);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [tempData, autoSaveEnabled, unsavedChanges]);

  // Mark changes when content is updated
  const markChanges = () => {
    setUnsavedChanges(true);
    changesCountRef.current += 1;
  };

  const handleImageUpload = (
    testimonialIndex: number,
    event: ChangeEvent<HTMLInputElement>
  ) => {
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

    // Set cropIndex BEFORE opening the modal
    setCropIndex(testimonialIndex);

    const reader = new FileReader();
    reader.onloadend = () => {
      // reader.result can be string | ArrayBuffer | null; we only accept string
      const result = reader.result;
      if (typeof result === "string") {
        setImageToCrop(result);
        setOriginalFile(file);
        setCropModalOpen(true);
        setAspectRatio(1); // Square for testimonial images
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setRotation(0);
      } else {
        toast.error("Failed to read image file");
      }
    };
    reader.readAsDataURL(file);

    // clear input so same file can be picked again if needed
    if (event.target) {
      event.target.value = "";
    }
  };

  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedArea: Area) => {
      setCroppedAreaPixels(croppedArea);
    },
    []
  );

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: Area,
    rotation = 0
  ): Promise<{ file: File; previewUrl: string }> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    if (!ctx) {
      throw new Error("Could not get canvas context");
    }

    ctx.translate(pixelCrop.width / 2, pixelCrop.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-pixelCrop.width / 2, -pixelCrop.height / 2);

    // image is HTMLImageElement which is a CanvasImageSource
    ctx.drawImage(
      image as CanvasImageSource,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Failed to create blob"));
            return;
          }

          const fileName = originalFile?.name
            ? `cropped-${originalFile.name}`
            : `cropped-image-${Date.now()}.jpg`;

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

  // Upload image directly to AWS
  const uploadImageToAWS = async (file: File, index: number) => {
    if (!userId || !publishedId || !templateSelection) {
      toast.error("Missing user information. Please refresh and try again.");
      return null;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("sectionName", "testimonials");
      formData.append("imageField", `testimonial-${index}-${Date.now()}`);
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
        toast.success("Testimonial image uploaded to AWS!");
        return uploadData.imageUrl;
      } else {
        const errorData = await uploadResponse.json();
        toast.error(`Image upload failed: ${errorData.message || "Unknown error"}`);
        return null;
      }
    } catch (error) {
      console.error("Error uploading image to AWS:", error);
      toast.error("Error uploading image. Please try again.");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const applyCrop = async () => {
    try {
      if (!imageToCrop || !croppedAreaPixels || cropIndex === null) {
        console.error("Please select an area to crop or cropIndex is null");
        return;
      }

      const result = await getCroppedImg(
        imageToCrop,
        croppedAreaPixels,
        rotation
      );

      const { file, previewUrl } = result;

      // Upload image directly to AWS
      const awsImageUrl = await uploadImageToAWS(file, cropIndex);

      if (awsImageUrl) {
        // Update state with AWS URL
        setTempData((prev: TestimonialsContent) => ({
          ...prev,
          testimonials: prev.testimonials.map((testimonial, idx) =>
            idx === (cropIndex ?? -1)
              ? { ...testimonial, image: awsImageUrl }
              : testimonial
          ),
        }));

        markChanges(); // Mark changes for auto-save
      } else {
        // Fallback to local preview if AWS upload fails
        setTempData((prev: TestimonialsContent) => ({
          ...prev,
          testimonials: prev.testimonials.map((testimonial, idx) =>
            idx === (cropIndex ?? -1)
              ? { ...testimonial, image: previewUrl }
              : testimonial
          ),
        }));
        toast.info("Using local preview. AWS upload failed.");
      }

      setCropModalOpen(false);
      setImageToCrop(null);
      setOriginalFile(null);
      setCropIndex(null); // Reset cropIndex
    } catch (error) {
      console.error("Error cropping image:", error);
      toast.error("Error cropping image. Please try again.");
    }
  };

  const cancelCrop = () => {
    setCropModalOpen(false);
    setImageToCrop(null);
    setOriginalFile(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setCropIndex(null);
  };

  const resetCropSettings = () => {
    setZoom(1);
    setRotation(0);
    setCrop({ x: 0, y: 0 });
  };

  // Auto-save function
  const performAutoSave = async () => {
    if (!unsavedChanges || changesCountRef.current < MIN_CHANGES_FOR_AUTO_SAVE) {
      return;
    }

    try {
      setIsSaving(true);
      
      // Here you would call your actual save API
      // For now, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Update testimonials data with temp data
      setTestimonialsData(tempData);
      setUnsavedChanges(false);
      changesCountRef.current = 0;
      setLastSaved(new Date().toLocaleTimeString());
      
      // Optional: Show success message
      toast.success("Testimonials saved automatically!", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: true,
      });
    } catch (error) {
      console.error("Error auto-saving testimonials:", error);
      toast.error("Auto-save failed. Please save manually.");
    } finally {
      setIsSaving(false);
    }
  };

  // Manual save function (kept for backward compatibility)
  const handleSave = async () => {
    await performAutoSave();
  };

  const handleEdit = () => {
    setIsEditing(true);
    setTempData(testimonialsData);
    setUnsavedChanges(false);
    changesCountRef.current = 0;
  };

  const handleCancel = () => {
    setTempData(testimonialsData);
    setUnsavedChanges(false);
    changesCountRef.current = 0;
    setIsEditing(false);
  };

  const updateHeadlineField = (
    field: keyof TestimonialsContent["headline"],
    value: string
  ) => {
    setTempData((prev: TestimonialsContent) => {
      if (prev.headline[field] === value) return prev;
      markChanges();
      return {
        ...prev,
        headline: {
          ...prev.headline,
          [field]: value,
        },
      };
    });
  };

  const updateTestimonialField = (
    index: number,
    field: keyof Testimonial,
    value: string | number | undefined
  ) => {
    setTempData((prev: TestimonialsContent) => {
      if (prev.testimonials[index][field] === value) return prev;
      markChanges();
      return {
        ...prev,
        testimonials: prev.testimonials.map((testimonial, i) =>
          i === index ? { ...testimonial, [field]: value } : testimonial
        ),
      };
    });
  };

  const addTestimonial = () => {
    const newTestimonial: Testimonial = {
      name: "New Client",
      rating: 5.0,
      image:
        "https://tamilnaducouncil.ac.in/wp-content/uploads/2020-04/dummy-avatar.jpg",
      role: "Position",
      quote: "Add testimonial quote here.",
    };
    
    setTempData((prev: TestimonialsContent) => {
      markChanges();
      return {
        ...prev,
        testimonials: [...prev.testimonials, newTestimonial],
      };
    });
  };

  const deleteTestimonial = (index: number) => {
    setTempData((prev: TestimonialsContent) => {
      markChanges();
      const newTestimonials = prev.testimonials.filter((_, i) => i !== index);
      // adjust current index if necessary
      setCurrent((cur) => {
        if (newTestimonials.length === 0) return 0;
        if (cur >= newTestimonials.length) return 0;
        return cur;
      });
      return {
        ...prev,
        testimonials: newTestimonials,
      };
    });
  };

  const startEditField = (
    id: number,
    field: keyof Testimonial,
    currentValue: string
  ) => {
    setEditingId(id);
    setEditingField(field);
    setTempValue(currentValue);
  };

  const saveFieldEdit = () => {
    if (editingId !== null && editingField) {
      updateTestimonialField(editingId, editingField, tempValue);
    }
    cancelEdit();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingField(null);
    setTempValue("");
  };

  const renderStars = (rating?: number) => {
    const stars: JSX.Element[] = [];
    const rate = rating ?? 0;
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={i <= rate ? "text-yellow-400" : "text-gray-300"}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const EditableField = ({
    testimonial,
    index,
    field,
    className = "",
    multiline = false,
  }: {
    testimonial: Testimonial;
    index: number;
    field: keyof Testimonial;
    className?: string;
    multiline?: boolean;
  }) => {
    const isCurrentlyEditing = editingId === index && editingField === field;
    const value = testimonial[field] as string | undefined;

    // Get character limit based on field type
    const getCharLimit = () => {
      switch (field) {
        case "name":
          return CHAR_LIMITS.name;
        case "role":
          return CHAR_LIMITS.role;
        case "quote":
          return CHAR_LIMITS.quote;
        default:
          return 100;
      }
    };

    const charLimit = getCharLimit();

    if (isCurrentlyEditing) {
      return (
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center gap-2">
            {multiline ? (
              <textarea
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="flex-1 px-2 py-1 border border-blue-300 rounded resize-none"
                rows={3}
                maxLength={charLimit}
                autoFocus
              />
            ) : (
              <input
                type="text"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="flex-1 px-2 py-1 border border-blue-300 rounded"
                maxLength={charLimit}
                autoFocus
              />
            )}
            <button
              onClick={saveFieldEdit}
              className="p-1 text-green-600 hover:text-green-800"
            >
              <Check size={16} />
            </button>
            <button
              onClick={cancelEdit}
              className="p-1 text-red-600 hover:text-red-800"
            >
              <X size={16} />
            </button>
          </div>
          <div className="text-xs text-gray-500 text-right">
            {tempValue.length}/{charLimit} characters
          </div>
        </div>
      );
    }

    return (
      <div className={`group relative ${className}`}>
        {multiline ? (
          <blockquote className="text-lg text-gray-700 italic text-justify">
            "{value}"
          </blockquote>
        ) : (
          <span>{value}</span>
        )}
        <button
          onClick={() => startEditField(index, field, (value as string) ?? "")}
          className="opacity-0 group-hover:opacity-100 absolute -right-6 top-0 p-1 text-gray-400 hover:text-blue-600 transition-all duration-200"
        >
          <Edit2 size={14} />
        </button>
      </div>
    );
  };

  return (
    <section
      id="testimonials"
      className="bg-gray-50 py-16 scroll-mt-20 relative"
    >
      {/* Auto-save indicator */}
      {isEditing && (
        <div className="absolute top-4 left-4 z-10">
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md">
            {isSaving ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
                <span className="text-xs text-gray-700">Saving...</span>
              </>
            ) : unsavedChanges ? (
              <>
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-700">Unsaved changes</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-700">
                  Saved {lastSaved && `at ${lastSaved}`}
                </span>
              </>
            )}
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
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isSaving ? "Saving..." : "Save Now"}
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

      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          {/* Editable Title */}
          {isEditing ? (
            <div className="flex flex-col items-center justify-center gap-2 mb-4">
              <input
                type="text"
                value={tempData.headline.title}
                onChange={(e) => updateHeadlineField("title", e.target.value)}
                className="text-3xl font-bold text-gray-900 px-2 py-1 border border-blue-300 rounded text-center"
                maxLength={CHAR_LIMITS.title}
              />
              <div className="text-xs text-gray-500">
                {tempData.headline.title.length}/{CHAR_LIMITS.title} characters
              </div>
            </div>
          ) : (
            <div className="mb-4">
              <h2 className="text-3xl font-bold text-gray-900">
                {tempData.headline.title}
              </h2>
            </div>
          )}

          {/* Editable Description */}
          {/* {isEditing ? (
            <div className="flex flex-col items-center justify-center gap-2">
              <textarea
                value={tempData.headline.description}
                onChange={(e) =>
                  updateHeadlineField("description", e.target.value)
                }
                className="text-gray-600 max-w-2xl px-2 py-1 border border-blue-300 rounded resize-none"
                rows={2}
                maxLength={CHAR_LIMITS.description}
              />
              <div className="text-xs text-gray-500">
                {tempData.headline.description.length}/{CHAR_LIMITS.description}{" "}
                characters
              </div>
            </div>
          ) : (
            <p className="text-gray-600 max-w-2xl mx-auto">
            {/* <p className="text-gray-600 max-w-2xl mx-auto text-justify"> */}
              {/* {tempData.headline.description} */}
            {/* </p> */}
          {/* )}  */}

{/* Editable Description */}
{isEditing ? (
  <div className="flex flex-col items-center justify-center gap-2 w-full max-w-2xl mx-auto">
    <textarea
      value={tempData.headline.description}
      onChange={(e) =>
        updateHeadlineField("description", e.target.value)
      }
      className="w-full text-gray-600 text-base px-3 py-2 border-2 border-dashed border-blue-200 rounded-lg resize-none text-center focus:outline-none focus:border-blue-500 focus:border-solid"
      rows={2}
      maxLength={CHAR_LIMITS.description}
    />
    <div className="text-xs text-gray-500 self-end">
      {tempData.headline.description.length}/{CHAR_LIMITS.description}{" "}
      characters
    </div>
  </div>
) : (
  <p className="text-gray-600 max-w-2xl mx-auto text-base">
    {tempData.headline.description}
  </p>
)}

        </div>

        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {tempData.testimonials.map((testimonial, index) => (
              <div key={index} className="w-full flex-shrink-0">
                <div className="mx-4 bg-white shadow-lg border-0 rounded-lg relative">
                  {/* Delete Button */}
                  {isEditing && (
                    <button
                      onClick={() => deleteTestimonial(index)}
                      className="absolute top-2 right-2 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full z-10"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}

                  <div className="p-8 text-center">
                    <div className="mb-6">
                      <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden relative">
                        <img
                          src={testimonial.image || user}
                          alt={testimonial.name}
                          className="w-full h-full object-cover scale-110"
                        />
                        {isEditing && (
                          <>
                            <input
                              type="file"
                              accept="image/*"
                              ref={(el) => (fileInputRefs.current[index] = el)}
                              onChange={(e) => handleImageUpload(index, e)}
                              className="hidden"
                            />
                            <button
                              onClick={() =>
                                fileInputRefs.current[index]?.click()
                              }
                              className="absolute bottom-0 right-0 bg-white/80 p-1 rounded-full"
                            >
                              <Upload size={12} />
                            </button>
                          </>
                        )}
                      </div>
                      <h3 className="font-semibold text-xl text-gray-900 mb-2">
                        <EditableField
                          testimonial={testimonial}
                          index={index}
                          field="name"
                        />
                      </h3>
                      <div className="flex justify-center mb-2">
                        {renderStars(testimonial.rating)}
                      </div>
                    </div>

                    <div className="mb-6">
                      <EditableField
                        testimonial={testimonial}
                        index={index}
                        field="quote"
                        multiline={true}
                      />
                    </div>

                    <div className="border-t pt-6">
                      <p className="text-gray-600 text-justify">
                        <EditableField
                          testimonial={testimonial}
                          index={index}
                          field="role"
                        />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center items-center mt-8 space-x-4">
          {/* Add Button */}
          {isEditing && (
            <button
              onClick={addTestimonial}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              <Plus size={16} />
              Add Testimonial
            </button>
          )}

          {/* Pagination Dots */}
          {tempData.testimonials.length > 0 && (
            <div className="flex space-x-2">
              {tempData.testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-200 ${index === current
                    ? "bg-blue-600"
                    : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

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
                Crop Testimonial Image
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
                  image={imageToCrop ?? undefined}
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
                  disabled={isUploading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white rounded py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 inline mr-2 animate-spin" />
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
    </section>
  );
}