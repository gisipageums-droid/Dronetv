// import React, { useEffect, useRef, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Quote,
//   Star,
//   Plus,
//   Edit3,
//   Trash2,
//   Save,
//   X,
//   Edit,
//   Upload,
//   Crop,
//   Check,
//   ZoomIn,
//   ZoomOut,
// } from "lucide-react";
// import { toast } from "sonner";

// export interface Testimonial {
//   id: number;
//   name: string;
//   position: string;
//   company: string;
//   image: string;
//   content: string;
//   rating: number;
//   project: string;
//   date?: string;
// }

// export interface TestimonialContent {
//   subtitle: string;
//   heading: string;
//   description: string;
//   testimonials: Testimonial[];
// }

// interface TestimonialsProps {
//   content?: TestimonialContent;
//   onSave: (updatedContent: TestimonialContent) => void;
//   userId?: string;
// }

// const defaultContent: TestimonialContent = {
//   subtitle: "client success stories and feedback",
//   heading: "What Clients Say",
//   description: "testimonials from satisfied clients",
//   testimonials: [],
// };

// const Testimonials: React.FC<TestimonialsProps> = ({
//   content,
//   onSave,
//   userId,
// }) => {
//   const [testimonialContent, setTestimonialContent] =
//     useState<TestimonialContent>(defaultContent);
//   const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [editingId, setEditingId] = useState<number | null>(null);
//   const [isAddingNew, setIsAddingNew] = useState(false);

//   // Store original content for cancel functionality
//   const [originalContent, setOriginalContent] =
//     useState<TestimonialContent>(defaultContent);
//   const [originalTestimonials, setOriginalTestimonials] = useState<
//     Testimonial[]
//   >([]);

//   // Character limits
//   const CHAR_LIMITS = {
//     heading: 100,
//     description: 500,
//     name: 50,
//     position: 100,
//     company: 100,
//     project: 100,
//     content: 1000,
//     imageUrl: 500,
//   };

//   // Form state
//   type FormData = Omit<Testimonial, "id">;
//   const [formData, setFormData] = useState<FormData>({
//     name: "",
//     position: "",
//     company: "",
//     image: "",
//     content: "",
//     rating: 5,
//     project: "",
//     date: new Date().getFullYear().toString(),
//   });
//   const [isUploading, setIsUploading] = useState(false);
//   const nameRef = useRef<HTMLInputElement | null>(null);

//   // Cropping states
//   const [isCropping, setIsCropping] = useState(false);
//   const [imageToCrop, setImageToCrop] = useState<string>("");
//   const [scale, setScale] = useState(1);
//   const [position, setPosition] = useState({ x: 0, y: 0 });
//   const [isDragging, setIsDragging] = useState(false);
//   const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
//   const [imageLoaded, setImageLoaded] = useState(false);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const imageRef = useRef<HTMLImageElement>(null);
//   const containerRef = useRef<HTMLDivElement>(null);

//   // Initialize content
//   useEffect(() => {
//     if (!content) return;

//     const processedTestimonials = (content.testimonials ?? []).map((t) => ({
//       ...t,
//       id: typeof t.id === "number" ? Math.floor(t.id) : parseInt(String(t.id)),
//       rating: Math.floor(t.rating || 5),
//     }));

//     const newContent = {
//       subtitle: content.subtitle ?? defaultContent.subtitle,
//       heading: content.heading ?? defaultContent.heading,
//       description: content.description ?? defaultContent.description,
//       testimonials: processedTestimonials,
//     };

//     setTestimonialContent(newContent);
//     setTestimonials(processedTestimonials);

//     // Store original content for cancel functionality
//     setOriginalContent(newContent);
//     setOriginalTestimonials(processedTestimonials);
//   }, [content]);

//   // Form handlers
//   const setFormField = (k: keyof FormData, v: any) =>
//     setFormData((p) => ({ ...p, [k]: v }));

//   // Auto-focus effect for form
//   useEffect(() => {
//     if ((isAddingNew || editingId !== null) && isEditMode) {
//       const t = setTimeout(() => {
//         nameRef.current?.focus();
//         const el = nameRef.current;
//         if (el) el.setSelectionRange(el.value.length, el.value.length);
//       }, 40);
//       return () => clearTimeout(t);
//     }
//   }, [isAddingNew, editingId, isEditMode]);

//   const getCharCountColor = (current: number, max: number) => {
//     if (current >= max) return "text-red-500";
//     if (current >= max * 0.9) return "text-yellow-500";
//     return "text-gray-500";
//   };

//   // Image cropping functions
//   const handleMouseDown = (e: React.MouseEvent) => {
//     e.preventDefault();
//     setIsDragging(true);
//     setDragStart({
//       x: e.clientX - position.x,
//       y: e.clientY - position.y,
//     });
//   };

//   const handleMouseMove = (e: React.MouseEvent) => {
//     if (!isDragging) return;
//     e.preventDefault();
//     setPosition({
//       x: e.clientX - dragStart.x,
//       y: e.clientY - dragStart.y,
//     });
//   };

//   const handleMouseUp = () => {
//     setIsDragging(false);
//   };

//   const handleTouchStart = (e: React.TouchEvent) => {
//     const touch = e.touches[0];
//     setIsDragging(true);
//     setDragStart({
//       x: touch.clientX - position.x,
//       y: touch.clientY - position.y,
//     });
//   };

//   const handleTouchMove = (e: React.TouchEvent) => {
//     if (!isDragging) return;
//     const touch = e.touches[0];
//     setPosition({
//       x: touch.clientX - dragStart.x,
//       y: touch.clientY - dragStart.y,
//     });
//   };

//   const handleTouchEnd = () => {
//     setIsDragging(false);
//   };

//   const getCroppedImage = async (): Promise<Blob> => {
//     return new Promise((resolve, reject) => {
//       const canvas = canvasRef.current;
//       const image = imageRef.current;
//       const container = containerRef.current;

//       if (!canvas || !image || !container) {
//         reject(new Error("Canvas, image, or container not found"));
//         return;
//       }

//       const ctx = canvas.getContext("2d");
//       if (!ctx) {
//         reject(new Error("Could not get canvas context"));
//         return;
//       }

//       // Output size - circular for Testimonial avatars (200x200)
//       const outputSize = 200;
//       canvas.width = outputSize;
//       canvas.height = outputSize;

//       // Get container dimensions
//       const containerRect = container.getBoundingClientRect();
//       const cropRadius = 80; // Same as the circle radius in the overlay

//       // Calculate the center of the crop area in the container
//       const centerX = containerRect.width / 2;
//       const centerY = containerRect.height / 2;

//       // Get image dimensions and position
//       const imgRect = image.getBoundingClientRect();
//       const containerLeft = containerRect.left;
//       const containerTop = containerRect.top;

//       // Calculate image position relative to container
//       const imgX = imgRect.left - containerLeft;
//       const imgY = imgRect.top - containerTop;

//       // Calculate the crop area in the original image coordinates
//       const scaleX = image.naturalWidth / imgRect.width;
//       const scaleY = image.naturalHeight / imgRect.height;

//       // Calculate source coordinates (what part of the original image to crop)
//       const sourceX = (centerX - imgX - cropRadius) * scaleX;
//       const sourceY = (centerY - imgY - cropRadius) * scaleY;
//       const sourceSize = cropRadius * 2 * scaleX;

//       // Draw the cropped circular image
//       ctx.beginPath();
//       ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2);
//       ctx.closePath();
//       ctx.clip();

//       // Draw the image
//       ctx.drawImage(
//         image,
//         sourceX,
//         sourceY,
//         sourceSize,
//         sourceSize,
//         0,
//         0,
//         outputSize,
//         outputSize
//       );

//       canvas.toBlob(
//         (blob) => {
//           if (blob) {
//             resolve(blob);
//           } else {
//             reject(new Error("Failed to create blob"));
//           }
//         },
//         "image/jpeg",
//         0.95
//       );
//     });
//   };

//   const handleCropConfirm = async () => {
//     try {
//       const croppedBlob = await getCroppedImage();
//       const croppedFile = new File(
//         [croppedBlob],
//         "cropped-testimonial-image.jpg",
//         {
//           type: "image/jpeg",
//         }
//       );

//       // Convert to base64 for immediate preview
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         if (reader.result) {
//           setFormData((prev) => ({
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
//       formData.append("fieldName", "testimonialImage");

//       const uploadResponse = await fetch(
//         `https://ow3v94b9gf.execute-api.ap-south-1.amazonaws.com/dev/`,
//         {
//           method: "POST",
//           body: formData,
//         }
//       );

//       if (uploadResponse.ok) {
//         const uploadData = await uploadResponse.json();
//         setFormData((prev) => ({
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
//           setScale(1);
//           setPosition({ x: 0, y: 0 });
//           setImageLoaded(false);
//         }
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleImageLoad = () => {
//     setImageLoaded(true);
//   };

//   const handleZoomIn = () => {
//     setScale((prev) => Math.min(prev + 0.1, 3));
//   };

//   const handleZoomOut = () => {
//     setScale((prev) => Math.max(prev - 0.1, 1));
//   };

//   // Testimonial CRUD operations
//   const startEdit = (testimonial: Testimonial) => {
//     setFormData({
//       name: testimonial.name,
//       position: testimonial.position,
//       company: testimonial.company,
//       image: testimonial.image,
//       content: testimonial.content,
//       rating: testimonial.rating,
//       project: testimonial.project,
//       date: testimonial.date ?? new Date().getFullYear().toString(),
//     });
//     setEditingId(testimonial.id);
//     setIsAddingNew(false);
//   };

//   const handleAddNew = async () => {
//     if (!formData.name.trim() || !formData.content.trim()) {
//       toast.error("Please provide name and testimonial content.");
//       return;
//     }

//     const id =
//       testimonials.length > 0
//         ? Math.max(...testimonials.map((t) => t.id)) + 1
//         : 1;
//     const created: Testimonial = { ...formData, id };
//     const updated = [...testimonials, created];

//     setTestimonials(updated);
//     setTestimonialContent((p) => ({ ...p, testimonials: updated }));
//     setIsAddingNew(false);
//     resetForm();

//     toast.success("Testimonial added.");
//     onSave?.({ ...testimonialContent, testimonials: updated });
//   };

//   const handleSaveEdit = () => {
//     if (editingId == null) return;

//     const updated = testimonials.map((t) =>
//       t.id === editingId ? { ...t, ...formData } : t
//     );

//     setTestimonials(updated);
//     setTestimonialContent((p) => ({ ...p, testimonials: updated }));
//     setEditingId(null);
//     resetForm();

//     toast.success("Testimonial updated.");
//   };

//   const handleDelete = (id: number) => {
//     const updated = testimonials.filter((t) => t.id !== id);
//     setTestimonials(updated);
//     setTestimonialContent((p) => ({ ...p, testimonials: updated }));
//     toast.success("Testimonial removed.");
//     onSave?.({ ...testimonialContent, testimonials: updated });
//   };

//   const resetForm = () => {
//     setFormData({
//       name: "",
//       position: "",
//       company: "",
//       image: "",
//       content: "",
//       rating: 5,
//       project: "",
//       date: new Date().getFullYear().toString(),
//     });
//   };

//   const handleCancelForm = () => {
//     setEditingId(null);
//     setIsAddingNew(false);
//     resetForm();
//   };

//   // Section content handlers
//   const handleContentChange = (
//     field: keyof TestimonialContent,
//     value: string
//   ) => {
//     const updated = { ...testimonialContent, [field]: value };
//     setTestimonialContent(updated);
//   };

//   const handleSaveSection = () => {
//     onSave?.({ ...testimonialContent, testimonials });
//     setIsEditMode(false);
//     toast.success("Testimonials section saved.");

//     // Update original content after saving
//     setOriginalContent(testimonialContent);
//     setOriginalTestimonials(testimonials);
//   };

//   const handleCancelSection = () => {
//     // Revert to original content when canceling
//     setTestimonialContent(originalContent);
//     setTestimonials(originalTestimonials);
//     setIsEditMode(false);
//     resetForm();
//     setEditingId(null);
//     setIsAddingNew(false);
//     toast.success("Changes cancelled.");
//   };

//   // Render testimonial form
//   const renderTestimonialForm = () => (
//     <div
//       className="p-6 border-2 border-orange-300 border-dashed bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl dark:border-orange-600"
//       onMouseDown={(e) => e.stopPropagation()}
//       onPointerDown={(e) => e.stopPropagation()}
//     >
//       <div className="space-y-4">
//         <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//           <div className="space-y-1">
//             <input
//               ref={nameRef}
//               type="text"
//               placeholder="Name *"
//               value={formData.name}
//               onChange={(e) => setFormField("name", e.target.value)}
//               maxLength={CHAR_LIMITS.name}
//               className="w-full p-3 bg-white border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-orange-400 focus:outline-none"
//             />
//             <div
//               className={`text-sm text-right ${getCharCountColor(
//                 formData.name.length,
//                 CHAR_LIMITS.name
//               )}`}
//             >
//               {formData.name.length}/{CHAR_LIMITS.name}
//             </div>
//           </div>
//           <div className="space-y-1">
//             <input
//               type="text"
//               placeholder="Position"
//               value={formData.position}
//               onChange={(e) => setFormField("position", e.target.value)}
//               maxLength={CHAR_LIMITS.position}
//               className="w-full p-3 bg-white border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-orange-400 focus:outline-none"
//             />
//             <div
//               className={`text-sm text-right ${getCharCountColor(
//                 formData.position.length,
//                 CHAR_LIMITS.position
//               )}`}
//             >
//               {formData.position.length}/{CHAR_LIMITS.position}
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//           <div className="space-y-1">
//             <input
//               type="text"
//               placeholder="Company"
//               value={formData.company}
//               onChange={(e) => setFormField("company", e.target.value)}
//               maxLength={CHAR_LIMITS.company}
//               className="w-full p-3 bg-white border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-orange-400 focus:outline-none"
//             />
//             <div
//               className={`text-sm text-right ${getCharCountColor(
//                 formData.company.length,
//                 CHAR_LIMITS.company
//               )}`}
//             >
//               {formData.company.length}/{CHAR_LIMITS.company}
//             </div>
//           </div>
//           <div className="space-y-1">
//             <input
//               type="text"
//               placeholder="Project"
//               value={formData.project}
//               onChange={(e) => setFormField("project", e.target.value)}
//               maxLength={CHAR_LIMITS.project}
//               className="w-full p-3 bg-white border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-orange-400 focus:outline-none"
//             />
//             <div
//               className={`text-sm text-right ${getCharCountColor(
//                 formData.project.length,
//                 CHAR_LIMITS.project
//               )}`}
//             >
//               {formData.project.length}/{CHAR_LIMITS.project}
//             </div>
//           </div>
//         </div>

//         <div className="grid items-center grid-cols-1 gap-4 md:grid-cols-2">
//           <div className="space-y-1">
//             <input
//               type="url"
//               placeholder="Image URL"
//               value={formData.image}
//               onChange={(e) => setFormField("image", e.target.value)}
//               maxLength={CHAR_LIMITS.imageUrl}
//               className="w-full p-3 bg-white border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-orange-400 focus:outline-none"
//             />
//             <div
//               className={`text-sm text-right ${getCharCountColor(
//                 formData.image.length,
//                 CHAR_LIMITS.imageUrl
//               )}`}
//             >
//               {formData.image.length}/{CHAR_LIMITS.imageUrl}
//             </div>
//           </div>

//           <div className="flex items-center gap-2">
//             <label
//               className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer ${
//                 isUploading
//                   ? "bg-gray-400 cursor-not-allowed"
//                   : "bg-gray-100 dark:bg-gray-800"
//               }`}
//             >
//               <Upload className="w-4 h-4" />
//               <span className="text-sm">
//                 {isUploading ? "Uploading..." : "Upload & Crop Image"}
//               </span>
//               <input
//                 type="file"
//                 accept="image/*"
//                 className="hidden"
//                 disabled={isUploading}
//                 onChange={handleImageUpload}
//               />
//             </label>
//           </div>
//         </div>

//         {formData.image && (
//           <div className="flex justify-center">
//             <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-orange-400">
//               <img
//                 src={formData.image}
//                 alt="Avatar preview"
//                 className="w-full h-full object-cover"
//               />
//             </div>
//           </div>
//         )}

//         <div className="space-y-1">
//           <textarea
//             placeholder="Testimonial content *"
//             value={formData.content}
//             onChange={(e) => setFormField("content", e.target.value)}
//             maxLength={CHAR_LIMITS.content}
//             rows={4}
//             className="w-full p-3 bg-white border border-gray-300 rounded-lg resize-none dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-orange-400 focus:outline-none"
//           />
//           <div
//             className={`text-sm text-right ${getCharCountColor(
//               formData.content.length,
//               CHAR_LIMITS.content
//             )}`}
//           >
//             {formData.content.length}/{CHAR_LIMITS.content}
//           </div>
//         </div>

//         <div className="flex items-center space-x-2">
//           <label className="font-medium text-gray-700 dark:text-gray-300">
//             Rating:
//           </label>
//           <select
//             value={formData.rating}
//             onChange={(e) => setFormField("rating", parseInt(e.target.value))}
//             className="p-2 bg-white border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-orange-400 focus:outline-none"
//           >
//             {[1, 2, 3, 4, 5].map((rating) => (
//               <option key={rating} value={rating}>
//                 {rating} Star{rating !== 1 ? "s" : ""}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="flex space-x-2">
//           <button
//             onClick={editingId !== null ? handleSaveEdit : handleAddNew}
//             disabled={isUploading}
//             className={`flex items-center px-4 py-2 space-x-2 text-white transition-colors rounded-lg ${
//               isUploading
//                 ? "bg-green-400 cursor-not-allowed"
//                 : "bg-green-500 hover:bg-green-600"
//             }`}
//           >
//             <Save className="w-4 h-4" />
//             <span>{isUploading ? "Saving..." : "Save"}</span>
//           </button>
//           <button
//             onClick={handleCancelForm}
//             disabled={isUploading}
//             className={`flex items-center px-4 py-2 space-x-2 text-white transition-colors rounded-lg ${
//               isUploading
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-gray-500 hover:bg-gray-600"
//             }`}
//           >
//             <X className="w-4 h-4" />
//             <span>Cancel</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <section id="testimonials" className="py-20 bg-white dark:bg-gray-900">
//       <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
//         <div className="absolute top-0 right-0 px-4 py-2 flex items-center gap-2">
//           {isEditMode ? (
//             <>
//               <button
//                 onClick={handleSaveSection}
//                 className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors shadow-lg"
//                 title="Save Changes"
//               >
//                 <Save className="w-6 h-6" />
//               </button>
//               <button
//                 onClick={handleCancelSection}
//                 className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
//                 title="Cancel Editing"
//               >
//                 <X className="w-6 h-6" />
//               </button>
//             </>
//           ) : (
//             <button
//               onClick={() => setIsEditMode(true)}
//               className="p-3 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors shadow-lg"
//               title="Edit Skills"
//             >
//               <Edit className="w-6 h-6 text-gray-600 dark:text-gray-300" />
//             </button>
//           )}
//         </div>

//         <motion.div
//           initial={{ opacity: 0, y: 50 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           viewport={{ once: true }}
//           className="mb-16 text-center"
//         >
//           {isEditMode ? (
//             <div className="space-y-4">
//               <div className="space-y-1">
//                 <input
//                   type="text"
//                   value={testimonialContent.heading}
//                   onChange={(e) =>
//                     handleContentChange("heading", e.target.value)
//                   }
//                   maxLength={CHAR_LIMITS.heading}
//                   className="w-full max-w-2xl p-2 mx-auto text-4xl font-bold text-gray-900 bg-gray-100 border-2 rounded-lg lg:text-5xl dark:bg-gray-800 dark:text-white focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none"
//                   placeholder="Section heading"
//                 />
//                 <div
//                   className={`text-sm text-right max-w-2xl mx-auto ${getCharCountColor(
//                     testimonialContent.heading.length,
//                     CHAR_LIMITS.heading
//                   )}`}
//                 >
//                   {testimonialContent.heading.length}/{CHAR_LIMITS.heading}
//                 </div>
//               </div>
//               <div className="space-y-1">
//                 <textarea
//                   value={testimonialContent.description}
//                   onChange={(e) =>
//                     handleContentChange("description", e.target.value)
//                   }
//                   maxLength={CHAR_LIMITS.description}
//                   className="w-full max-w-3xl p-2 mx-auto text-xl text-gray-600 bg-gray-100 border-2 rounded-lg resize-none dark:bg-gray-800 dark:text-gray-400 focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none"
//                   rows={2}
//                   placeholder="Section description"
//                 />
//                 <div
//                   className={`text-sm text-right max-w-3xl mx-auto ${getCharCountColor(
//                     testimonialContent.description.length,
//                     CHAR_LIMITS.description
//                   )}`}
//                 >
//                   {testimonialContent.description.length}/
//                   {CHAR_LIMITS.description}
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <>
//               <h2 className="mb-4 text-4xl font-bold text-gray-900 lg:text-5xl dark:text-white">
//                 {testimonialContent.heading.split(" ").slice(0, -1).join(" ")}{" "}
//                 <span className="text-orange-400">
//                   {testimonialContent.heading.split(" ").slice(-1)}
//                 </span>
//               </h2>
//               <p className="max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-400">
//                 {testimonialContent.description}
//               </p>
//             </>
//           )}
//         </motion.div>

//         {isEditMode && (
//           <div className="mb-8 text-center">
//             <button
//               onClick={() => {
//                 setIsAddingNew(true);
//                 setEditingId(null);
//                 resetForm();
//               }}
//               className="inline-flex items-center px-6 py-3 space-x-2 text-white transition-colors bg-orange-500 rounded-lg hover:bg-orange-600"
//             >
//               <Plus className="w-5 h-5" />
//               <span>Add New Testimonial</span>
//             </button>
//           </div>
//         )}

//         <AnimatePresence>
//           {isEditMode && isAddingNew && (
//             <motion.div
//               initial={{ opacity: 0, y: -20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               className="mb-8"
//             >
//               {renderTestimonialForm()}
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {testimonials.length === 0 ? (
//           <div className="py-20 text-center">
//             <p className="mb-4 text-lg text-gray-500 dark:text-gray-400">
//               No testimonials available yet.
//             </p>
//             {isEditMode && (
//               <button
//                 onClick={() => {
//                   setIsAddingNew(true);
//                   setEditingId(null);
//                   resetForm();
//                 }}
//                 className="px-6 py-2 text-white transition-colors bg-orange-500 rounded-lg hover:bg-orange-600"
//               >
//                 Add Your First Testimonial
//               </button>
//             )}
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 gap-8 mb-16 md:grid-cols-2 lg:grid-cols-3">
//             <AnimatePresence>
//               {testimonials.map((testimonial, index) => (
//                 <motion.div
//                   key={testimonial.id}
//                   initial={{ opacity: 0, y: 50 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, scale: 0.8 }}
//                   transition={{ duration: 0.5, delay: index * 0.05 }}
//                   whileHover={{ y: -10, scale: 1.02 }}
//                   className="relative p-6 transition-all duration-300 shadow-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl hover:shadow-2xl"
//                 >
//                   {isEditMode && (
//                     <div className="absolute flex space-x-2 top-3 right-3">
//                       <button
//                         onClick={() => startEdit(testimonial)}
//                         className="p-2 text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600"
//                       >
//                         <Edit3 className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(testimonial.id)}
//                         className="p-2 text-white transition-colors bg-red-500 rounded-lg hover:bg-red-600"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </button>
//                     </div>
//                   )}

//                   {editingId === testimonial.id ? (
//                     renderTestimonialForm()
//                   ) : (
//                     <>
//                       <div className="flex justify-end mb-4">
//                         <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500">
//                           <Quote className="w-5 h-5 text-black dark:text-white" />
//                         </div>
//                       </div>

//                       <blockquote className="text-justify mb-6 italic leading-relaxed text-gray-700 dark:text-gray-300">
//                         "{testimonial.content}"
//                       </blockquote>

//                       <div className="flex mb-4 space-x-1">
//                         {[...Array(Math.max(0, testimonial.rating))].map(
//                           (_, i) => (
//                             <Star
//                               key={i}
//                               className="w-4 h-4 text-yellow-500 fill-yellow-500"
//                             />
//                           )
//                         )}
//                       </div>

//                       <div className="flex items-center space-x-4">
//                         <img
//                           src={testimonial.image}
//                           alt={testimonial.name}
//                           className="object-cover w-12 h-12 rounded-full"
//                           onError={(e) => {
//                             // Fallback for broken images
//                             (
//                               e.target as HTMLImageElement
//                             ).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
//                               testimonial.name
//                             )}&background=random`;
//                           }}
//                         />
//                         <div className="flex-1">
//                           <h3 className="font-bold text-gray-900 dark:text-white">
//                             {testimonial.name}
//                           </h3>
//                           <p className="text-sm font-medium text-orange-500">
//                             {testimonial.position}
//                           </p>
//                           <p className="text-xs text-gray-600 dark:text-gray-400">
//                             {testimonial.company}
//                           </p>
//                         </div>
//                       </div>

//                       <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
//                         <div className="inline-flex items-center px-3 py-1 border rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-orange-500/30">
//                           <span className="text-sm font-medium text-orange-500">
//                             {testimonial.project}
//                           </span>
//                         </div>
//                       </div>
//                     </>
//                   )}
//                 </motion.div>
//               ))}
//             </AnimatePresence>
//           </div>
//         )}

//         {testimonials.length > 0 && (
//           <motion.div
//             initial={{ opacity: 0, y: 50 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.2 }}
//             viewport={{ once: true }}
//             className="text-center"
//           >
//             <h3 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">
//               Trusted by Amazing Companies
//             </h3>

//             <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
//               {Array.from(new Set(testimonials.map((t) => t.company))).map(
//                 (company, idx) => (
//                   <motion.div
//                     key={idx}
//                     whileHover={{ scale: 1.1, opacity: 1 }}
//                     className="px-6 py-3 font-bold text-gray-700 bg-gray-100 rounded-lg dark:bg-gray-800 dark:text-gray-300"
//                   >
//                     {company}
//                   </motion.div>
//                 )
//               )}
//             </div>
//           </motion.div>
//         )}
//       </div>

//       {/* Image Cropping Modal */}
//       {isCropping && (
//         <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
//           <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl">
//             <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
//               <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
//                 <Crop className="w-6 h-6" />
//                 Crop Avatar Image
//               </h3>
//               <button
//                 onClick={() => setIsCropping(false)}
//                 className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
//               >
//                 <X className="w-6 h-6 text-gray-900 dark:text-white" />
//               </button>
//             </div>

//             <div className="p-6">
//               <div
//                 ref={containerRef}
//                 className="relative h-96 bg-gray-900 rounded-lg overflow-hidden mb-6 cursor-move select-none"
//                 onMouseDown={handleMouseDown}
//                 onMouseMove={handleMouseMove}
//                 onMouseUp={handleMouseUp}
//                 onMouseLeave={handleMouseUp}
//                 onTouchStart={handleTouchStart}
//                 onTouchMove={handleTouchMove}
//                 onTouchEnd={handleTouchEnd}
//               >
//                 {/* Circular crop overlay */}
//                 <div className="absolute inset-0 pointer-events-none z-10">
//                   <svg className="w-full h-full">
//                     <defs>
//                       <mask id="circleMask">
//                         <rect width="100%" height="100%" fill="white" />
//                         <circle cx="50%" cy="50%" r="80" fill="black" />
//                       </mask>
//                     </defs>
//                     <rect
//                       width="100%"
//                       height="100%"
//                       fill="rgba(0,0,0,0.5)"
//                       mask="url(#circleMask)"
//                     />
//                     <circle
//                       cx="50%"
//                       cy="50%"
//                       r="80"
//                       fill="none"
//                       stroke="white"
//                       strokeWidth="2"
//                       strokeDasharray="10,5"
//                     />
//                   </svg>
//                 </div>

//                 <img
//                   ref={imageRef}
//                   src={imageToCrop}
//                   alt="Crop preview"
//                   onLoad={handleImageLoad}
//                   className="absolute select-none z-0"
//                   style={{
//                     maxHeight: "100%",
//                     maxWidth: "100%",
//                     height: "auto",
//                     width: "auto",
//                     left: "50%",
//                     top: "50%",
//                     transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(${scale})`,
//                     transformOrigin: "center",
//                     opacity: imageLoaded ? 1 : 0,
//                     transition: imageLoaded ? "none" : "opacity 0.3s",
//                   }}
//                   draggable={false}
//                 />

//                 {!imageLoaded && (
//                   <div className="absolute inset-0 flex items-center justify-center text-white">
//                     <p>Loading image...</p>
//                   </div>
//                 )}
//               </div>

//               <div className="space-y-4">
//                 <div>
//                   <div className="flex items-center justify-between mb-2">
//                     <label className="text-sm font-medium text-gray-900 dark:text-white">
//                       Zoom
//                     </label>
//                     <div className="flex gap-2">
//                       <button
//                         onClick={handleZoomOut}
//                         className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
//                       >
//                         <ZoomOut className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={handleZoomIn}
//                         className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
//                       >
//                         <ZoomIn className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </div>
//                   <input
//                     type="range"
//                     min={1}
//                     max={3}
//                     step={0.01}
//                     value={scale}
//                     onChange={(e) => setScale(Number(e.target.value))}
//                     className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
//                   />
//                 </div>

//                 <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
//                   Drag to reposition • Use slider or buttons to zoom
//                 </p>
//               </div>
//             </div>

//             <div className="flex gap-3 justify-end p-6 border-t border-gray-200 dark:border-gray-700">
//               <button
//                 onClick={() => setIsCropping(false)}
//                 className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleCropConfirm}
//                 disabled={!imageLoaded}
//                 className="px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <Check className="w-5 h-5" />
//                 Crop & Upload
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Hidden canvas for cropping */}
//       <canvas ref={canvasRef} className="hidden" />
//     </section>
//   );
// };

// export default Testimonials;

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Quote,
  Star,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  Edit,
  Upload,
  Crop,
  Check,
  ZoomIn,
  ZoomOut,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import maleAvatar from "/logos/maleAvatar.png";
import femaleAvatar from "/logos/femaleAvatar.png";

export interface Testimonial {
  id: number;
  name: string;
  position: string;
  company: string;
  image: string;
  content: string;
  rating: number;
  project: string;
  date?: string;
  gender: "male" | "female";
}

export interface TestimonialContent {
  subtitle: string;
  heading: string;
  description: string;
  testimonials: Testimonial[];
}

interface TestimonialsProps {
  content?: TestimonialContent;
  onSave: (updatedContent: TestimonialContent) => void;
  userId?: string;
}

const defaultContent: TestimonialContent = {
  subtitle: "client success stories and feedback",
  heading: "What Clients Say",
  description: "testimonials from satisfied clients",
  testimonials: [],
};

const Testimonials: React.FC<TestimonialsProps> = ({
  content,
  onSave,
  userId,
}) => {
  const [testimonialContent, setTestimonialContent] =
    useState<TestimonialContent>(defaultContent);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Auto-save states
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);

  // Auto-save timeout ref
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Track if component is mounted to prevent state updates after unmount
  const isMounted = useRef(true);

  // Store original content for cancel functionality
  const [originalContent, setOriginalContent] =
    useState<TestimonialContent>(defaultContent);
  const [originalTestimonials, setOriginalTestimonials] = useState<
    Testimonial[]
  >([]);

  // Character limits
  const CHAR_LIMITS = {
    heading: 100,
    description: 500,
    name: 50,
    position: 100,
    company: 100,
    project: 100,
    content: 1000,
    imageUrl: 500,
  };

  // Form state
  type FormData = Omit<Testimonial, "id">;
  const [formData, setFormData] = useState<FormData>({
    name: "",
    position: "",
    company: "",
    image: "",
    content: "",
    rating: 5,
    project: "",
    date: new Date().getFullYear().toString(),
  });
  const [isUploading, setIsUploading] = useState(false);
  const nameRef = useRef<HTMLInputElement | null>(null);

  // Image upload progress state
  const [uploadProgress, setUploadProgress] = useState(0);

  // Cropping states
  const [isCropping, setIsCropping] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string>("");
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize component mount state
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      // Cleanup auto-save timeout on unmount
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  // Initialize content
  useEffect(() => {
    if (!content) return;

    const processedTestimonials = (content.testimonials ?? []).map((t) => ({
      ...t,
      id: typeof t.id === "number" ? Math.floor(t.id) : parseInt(String(t.id)),
      rating: Math.floor(t.rating || 5),
    }));

    const newContent = {
      subtitle: content.subtitle ?? defaultContent.subtitle,
      heading: content.heading ?? defaultContent.heading,
      description: content.description ?? defaultContent.description,
      testimonials: processedTestimonials,
    };

    setTestimonialContent(newContent);
    setTestimonials(processedTestimonials);

    // Store original content for cancel functionality
    setOriginalContent(newContent);
    setOriginalTestimonials(processedTestimonials);
    setHasUnsavedChanges(false);
  }, [content]);

  // Auto-save effect
  useEffect(() => {
    // Don't auto-save if not editing or no unsaved changes
    if (!isEditMode || !hasUnsavedChanges) return;

    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Set new timeout for auto-save
    autoSaveTimeoutRef.current = setTimeout(() => {
      performAutoSave();
    }, 2000); // 2-second delay

    // Cleanup timeout on unmount or dependency change
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [testimonialContent, testimonials, hasUnsavedChanges, isEditMode]);

  // Perform auto-save
  const performAutoSave = useCallback(async () => {
    if (!isMounted.current || !hasUnsavedChanges) return;

    try {
      setIsAutoSaving(true);

      // Call the save function
      onSave?.({ ...testimonialContent, testimonials });

      // Update state
      setHasUnsavedChanges(false);
      setLastSavedTime(new Date());

      // Update original content after saving
      setOriginalContent(testimonialContent);
      setOriginalTestimonials(testimonials);

      // Show subtle notification
      toast.success("Testimonials changes auto-saved", {
        duration: 1000,
        position: "bottom-right",
      });
    } catch (error) {
      console.error("Auto-save failed:", error);
      toast.error("Auto-save failed. Please save manually.");
    } finally {
      if (isMounted.current) {
        setIsAutoSaving(false);
      }
    }
  }, [testimonialContent, testimonials, hasUnsavedChanges, onSave]);

  // Form handlers
  const setFormField = (k: keyof FormData, v: any) => {
    setFormData((p) => ({ ...p, [k]: v }));
    // Mark as unsaved when form data changes (for new testimonials being created)
    if (isAddingNew) {
      setHasUnsavedChanges(true);
    }
  };

  // Auto-focus effect for form
  useEffect(() => {
    if ((isAddingNew || editingId !== null) && isEditMode) {
      const t = setTimeout(() => {
        nameRef.current?.focus();
        const el = nameRef.current;
        if (el) el.setSelectionRange(el.value.length, el.value.length);
      }, 40);
      return () => clearTimeout(t);
    }
  }, [isAddingNew, editingId, isEditMode]);

  const getCharCountColor = (current: number, max: number) => {
    if (current >= max) return "text-red-500";
    if (current >= max * 0.9) return "text-yellow-500";
    return "text-gray-500";
  };

  // Enhanced image upload function with progress tracking
  const uploadImageToS3 = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", userId!);
      formData.append("fieldName", "testimonialImage");

      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          setUploadProgress(progress);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response.s3Url);
          } catch (error) {
            reject(new Error("Failed to parse upload response"));
          }
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error("Upload failed due to network error"));
      });

      xhr.open(
        "POST",
        `https://ow3v94b9gf.execute-api.ap-south-1.amazonaws.com/dev/`
      );
      xhr.send(formData);
    });
  };

  // Image cropping functions
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const getCroppedImage = async (): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const canvas = canvasRef.current;
      const image = imageRef.current;
      const container = containerRef.current;

      if (!canvas || !image || !container) {
        reject(new Error("Canvas, image, or container not found"));
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      // Output size - circular for Testimonial avatars (200x200)
      const outputSize = 200;
      canvas.width = outputSize;
      canvas.height = outputSize;

      // Get container dimensions
      const containerRect = container.getBoundingClientRect();
      const cropRadius = 80; // Same as the circle radius in the overlay

      // Calculate the center of the crop area in the container
      const centerX = containerRect.width / 2;
      const centerY = containerRect.height / 2;

      // Get image dimensions and position
      const imgRect = image.getBoundingClientRect();
      const containerLeft = containerRect.left;
      const containerTop = containerRect.top;

      // Calculate image position relative to container
      const imgX = imgRect.left - containerLeft;
      const imgY = imgRect.top - containerTop;

      // Calculate the crop area in the original image coordinates
      const scaleX = image.naturalWidth / imgRect.width;
      const scaleY = image.naturalHeight / imgRect.height;

      // Calculate source coordinates (what part of the original image to crop)
      const sourceX = (centerX - imgX - cropRadius) * scaleX;
      const sourceY = (centerY - imgY - cropRadius) * scaleY;
      const sourceSize = cropRadius * 2 * scaleX;

      // Draw the cropped circular image
      ctx.beginPath();
      ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      // Draw the image
      ctx.drawImage(
        image,
        sourceX,
        sourceY,
        sourceSize,
        sourceSize,
        0,
        0,
        outputSize,
        outputSize
      );

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to create blob"));
          }
        },
        "image/jpeg",
        0.95
      );
    });
  };

  const handleCropConfirm = async () => {
    try {
      const croppedBlob = await getCroppedImage();
      const croppedFile = new File(
        [croppedBlob],
        "cropped-testimonial-image.jpg",
        {
          type: "image/jpeg",
        }
      );

      // Convert to base64 for immediate preview
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setFormData((prev) => ({
            ...prev,
            image: reader.result as string,
          }));
        }
      };
      reader.readAsDataURL(croppedFile);

      setIsUploading(true);
      setUploadProgress(0);
      setIsCropping(false);
      setImageLoaded(false);

      // Auto-upload cropped image to AWS S3 immediately
      try {
        const s3Url = await uploadImageToS3(croppedFile);

        setFormData((prev) => ({
          ...prev,
          image: s3Url,
        }));

        toast.success("Image uploaded successfully!");
      } catch (uploadError) {
        console.error("Image upload failed:", uploadError);
        toast.error(
          `Image upload failed: ${
            uploadError instanceof Error ? uploadError.message : "Unknown error"
          }`
        );
        // Keep the cropped image as base64 for manual save later
        toast.info("Cropped image saved locally. Save manually to persist.");
      }

      setIsUploading(false);
      setUploadProgress(0);
    } catch (error) {
      console.error("Error cropping image:", error);
      toast.error("Failed to crop image");
      setIsCropping(false);
      setIsUploading(false);
      setUploadProgress(0);
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
          setScale(1);
          setPosition({ x: 0, y: 0 });
          setImageLoaded(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 1));
  };

  // Testimonial CRUD operations
  const startEdit = (testimonial: Testimonial) => {
    setFormData({
      name: testimonial.name,
      position: testimonial.position,
      company: testimonial.company,
      image: testimonial.image,
      content: testimonial.content,
      rating: testimonial.rating,
      project: testimonial.project,
      date: testimonial.date ?? new Date().getFullYear().toString(),
      gender: testimonial.gender,
    });
    setEditingId(testimonial.id);
    setIsAddingNew(false);
  };

  const handleAddNew = async () => {
    if (!formData.name.trim() || !formData.content.trim()) {
      toast.error("Please provide name and testimonial content.");
      return;
    }

    const id =
      testimonials.length > 0
        ? Math.max(...testimonials.map((t) => t.id)) + 1
        : 1;
    const created: Testimonial = { ...formData, id };
    const updated = [...testimonials, created];

    setTestimonials(updated);
    setTestimonialContent((p) => ({ ...p, testimonials: updated }));
    setHasUnsavedChanges(true);
    setIsAddingNew(false);
    resetForm();

    toast.success("Testimonial added.");
  };

  const handleSaveEdit = () => {
    if (editingId == null) return;

    const updated = testimonials.map((t) =>
      t.id === editingId ? { ...t, ...formData } : t
    );

    setTestimonials(updated);
    setTestimonialContent((p) => ({ ...p, testimonials: updated }));
    setHasUnsavedChanges(true);
    setEditingId(null);
    resetForm();

    toast.success("Testimonial updated.");
  };

  const handleDelete = (id: number) => {
    const updated = testimonials.filter((t) => t.id !== id);
    setTestimonials(updated);
    setTestimonialContent((p) => ({ ...p, testimonials: updated }));
    setHasUnsavedChanges(true);
    toast.success("Testimonial removed.");
  };

  const resetForm = () => {
    setFormData({
      name: "",
      position: "",
      company: "",
      image: "",
      content: "",
      rating: 5,
      project: "",
      date: new Date().getFullYear().toString(),
      gender: "male",
    });
  };

  const handleCancelForm = () => {
    setEditingId(null);
    setIsAddingNew(false);
    resetForm();
  };

  // Section content handlers with auto-save tracking
  const handleContentChange = useCallback(
    (field: keyof TestimonialContent, value: string) => {
      setTestimonialContent((prev) => ({ ...prev, [field]: value }));
      setHasUnsavedChanges(true);
    },
    []
  );

  const handleSaveSection = () => {
    onSave?.({ ...testimonialContent, testimonials });
    setHasUnsavedChanges(false);
    setLastSavedTime(new Date());
    setIsEditMode(false);

    // Update original content after saving
    setOriginalContent(testimonialContent);
    setOriginalTestimonials(testimonials);

    toast.success("Testimonials section saved.");
  };

  const handleCancelSection = () => {
    // Revert to original content when canceling
    setTestimonialContent(originalContent);
    setTestimonials(originalTestimonials);
    setHasUnsavedChanges(false);
    setIsEditMode(false);
    resetForm();
    setEditingId(null);
    setIsAddingNew(false);
    toast.info("Changes discarded.");
  };

  const handleEditStart = () => {
    setIsEditMode(true);
    setHasUnsavedChanges(false);
  };

  // Format last saved time for display
  const formatLastSavedTime = () => {
    if (!lastSavedTime) return "Never";

    const now = new Date();
    const diffInSeconds = Math.floor(
      (now.getTime() - lastSavedTime.getTime()) / 1000
    );

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return lastSavedTime.toLocaleDateString();
  };

  // Render testimonial form
  const renderTestimonialForm = () => (
    <div
      className="p-6 border-2 border-orange-300 border-dashed bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl dark:border-orange-600"
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <input
              ref={nameRef}
              type="text"
              placeholder="Name *"
              value={formData.name}
              onChange={(e) => setFormField("name", e.target.value)}
              maxLength={CHAR_LIMITS.name}
              className="w-full p-3 bg-white border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
            <div
              className={`text-sm text-right ${getCharCountColor(
                formData.name.length,
                CHAR_LIMITS.name
              )}`}
            >
              {formData.name.length}/{CHAR_LIMITS.name}
            </div>
          </div>
          <div className="space-y-1">
            <input
              type="text"
              placeholder="Position"
              value={formData.position}
              onChange={(e) => setFormField("position", e.target.value)}
              maxLength={CHAR_LIMITS.position}
              className="w-full p-3 bg-white border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
            <div
              className={`text-sm text-right ${getCharCountColor(
                formData.position.length,
                CHAR_LIMITS.position
              )}`}
            >
              {formData.position.length}/{CHAR_LIMITS.position}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <input
              type="text"
              placeholder="Company"
              value={formData.company}
              onChange={(e) => setFormField("company", e.target.value)}
              maxLength={CHAR_LIMITS.company}
              className="w-full p-3 bg-white border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
            <div
              className={`text-sm text-right ${getCharCountColor(
                formData.company.length,
                CHAR_LIMITS.company
              )}`}
            >
              {formData.company.length}/{CHAR_LIMITS.company}
            </div>
          </div>
          <div className="space-y-1">
            <input
              type="text"
              placeholder="Project"
              value={formData.project}
              onChange={(e) => setFormField("project", e.target.value)}
              maxLength={CHAR_LIMITS.project}
              className="w-full p-3 bg-white border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
            <div
              className={`text-sm text-right ${getCharCountColor(
                formData.project.length,
                CHAR_LIMITS.project
              )}`}
            >
              {formData.project.length}/{CHAR_LIMITS.project}
            </div>
          </div>
        </div>

        <div className="grid items-center grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <input
              type="url"
              placeholder="Image URL"
              value={formData.image}
              onChange={(e) => setFormField("image", e.target.value)}
              maxLength={CHAR_LIMITS.imageUrl}
              className="w-full p-3 bg-white border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
            <div
              className={`text-sm text-right ${getCharCountColor(
                formData.image.length,
                CHAR_LIMITS.imageUrl
              )}`}
            >
              {formData.image.length}/{CHAR_LIMITS.imageUrl}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label
              className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer ${
                isUploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gray-100 dark:bg-gray-800"
              }`}
            >
              <Upload className="w-4 h-4" />
              <span className="text-sm">
                {isUploading ? "Uploading..." : "Upload & Crop Image"}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={isUploading}
                onChange={handleImageUpload}
              />
            </label>
          </div>
        </div>

        <div className="grid items-center grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <select
              value={formData.gender}
              onChange={(e) => setFormField("gender", e.target.value)}
              className="w-full p-3 bg-white border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-orange-400 focus:outline-none"
            >
              <option value={"male"}>Male</option>
              <option value={"female"}>Female</option>
            </select>
          </div>
        </div>

        {isUploading && (
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
            <div>Uploading... {Math.round(uploadProgress)}%</div>
            <div className="w-32 h-2 bg-gray-600 rounded-full mt-2 mx-auto overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {formData.image && (
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-orange-400">
              <img
                src={formData.image}
                alt="Avatar preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        <div className="space-y-1">
          <textarea
            placeholder="Testimonial content *"
            value={formData.content}
            onChange={(e) => setFormField("content", e.target.value)}
            maxLength={CHAR_LIMITS.content}
            rows={4}
            className="w-full p-3 bg-white border border-gray-300 rounded-lg resize-none dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-orange-400 focus:outline-none"
          />
          <div
            className={`text-sm text-right ${getCharCountColor(
              formData.content.length,
              CHAR_LIMITS.content
            )}`}
          >
            {formData.content.length}/{CHAR_LIMITS.content}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <label className="font-medium text-gray-700 dark:text-gray-300">
            Rating:
          </label>
          <select
            value={formData.rating}
            onChange={(e) => setFormField("rating", parseInt(e.target.value))}
            className="p-2 bg-white border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-orange-400 focus:outline-none"
          >
            {[1, 2, 3, 4, 5].map((rating) => (
              <option key={rating} value={rating}>
                {rating} Star{rating !== 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={editingId !== null ? handleSaveEdit : handleAddNew}
            disabled={isUploading}
            className={`flex items-center px-4 py-2 space-x-2 text-white transition-colors rounded-lg ${
              isUploading
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{isUploading ? "Saving..." : "Save"}</span>
          </button>
          <button
            onClick={handleCancelForm}
            disabled={isUploading}
            className={`flex items-center px-4 py-2 space-x-2 text-white transition-colors rounded-lg ${
              isUploading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gray-500 hover:bg-gray-600"
            }`}
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <section id="testimonials" className="py-20 bg-white dark:bg-gray-900">
      <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="absolute top-0 right-0 px-4 py-2 flex items-center gap-2">
          {isEditMode ? (
            <>
              {/* Auto-save indicator */}
              <div className="flex items-center gap-2 mr-2 text-sm text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-gray-800/80 px-3 py-2 rounded-full backdrop-blur-sm">
                {isAutoSaving ? (
                  <div className="flex items-center gap-1">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </div>
                ) : hasUnsavedChanges ? (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    <span>Unsaved changes</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Saved {formatLastSavedTime()}</span>
                  </div>
                )}
              </div>

              <button
                onClick={handleSaveSection}
                className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors shadow-lg"
                title="Save Changes"
              >
                <Save className="w-6 h-6" />
              </button>
              <button
                onClick={handleCancelSection}
                className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                title="Cancel Editing"
              >
                <X className="w-6 h-6" />
              </button>
            </>
          ) : (
            <button
              onClick={handleEditStart}
              className="p-3 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors shadow-lg"
              title="Edit Testimonials"
            >
              <Edit className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          {isEditMode ? (
            <div className="space-y-4">
              <div className="space-y-1">
                <input
                  type="text"
                  value={testimonialContent.heading}
                  onChange={(e) =>
                    handleContentChange("heading", e.target.value)
                  }
                  maxLength={CHAR_LIMITS.heading}
                  className="w-full max-w-2xl p-2 mx-auto text-4xl font-bold text-gray-900 bg-gray-100 border-2 rounded-lg lg:text-5xl dark:bg-gray-800 dark:text-white focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none"
                  placeholder="Section heading"
                />
                <div
                  className={`text-sm text-right max-w-2xl mx-auto ${getCharCountColor(
                    testimonialContent.heading.length,
                    CHAR_LIMITS.heading
                  )}`}
                >
                  {testimonialContent.heading.length}/{CHAR_LIMITS.heading}
                </div>
              </div>
              <div className="space-y-1">
                <textarea
                  value={testimonialContent.description}
                  onChange={(e) =>
                    handleContentChange("description", e.target.value)
                  }
                  maxLength={CHAR_LIMITS.description}
                  className="w-full max-w-3xl p-2 mx-auto text-xl text-gray-600 bg-gray-100 border-2 rounded-lg resize-none dark:bg-gray-800 dark:text-gray-400 focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none"
                  rows={2}
                  placeholder="Section description"
                />
                <div
                  className={`text-sm text-right max-w-3xl mx-auto ${getCharCountColor(
                    testimonialContent.description.length,
                    CHAR_LIMITS.description
                  )}`}
                >
                  {testimonialContent.description.length}/
                  {CHAR_LIMITS.description}
                </div>
              </div>
            </div>
          ) : (
            <>
              <h2 className="mb-4 text-4xl font-bold text-gray-900 lg:text-5xl dark:text-white">
                {testimonialContent.heading.split(" ").slice(0, -1).join(" ")}{" "}
                <span className="text-orange-400">
                  {testimonialContent.heading.split(" ").slice(-1)}
                </span>
              </h2>
              <p className="max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-400 text-center">
                {testimonialContent.description}
              </p>
            </>
          )}
        </motion.div>

        {isEditMode && (
          <div className="mb-8 text-center">
            <button
              onClick={() => {
                setIsAddingNew(true);
                setEditingId(null);
                resetForm();
              }}
              className="inline-flex items-center px-6 py-3 space-x-2 text-white transition-colors bg-orange-500 rounded-lg hover:bg-orange-600"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Testimonial</span>
            </button>
          </div>
        )}

        <AnimatePresence>
          {isEditMode && isAddingNew && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              {renderTestimonialForm()}
            </motion.div>
          )}
        </AnimatePresence>

        {testimonials.length === 0 ? (
          <div className="py-20 text-center">
            <p className="mb-4 text-lg text-gray-500 dark:text-gray-400">
              No testimonials available yet.
            </p>
            {isEditMode && (
              <button
                onClick={() => {
                  setIsAddingNew(true);
                  setEditingId(null);
                  resetForm();
                }}
                className="px-6 py-2 text-white transition-colors bg-orange-500 rounded-lg hover:bg-orange-600"
              >
                Add Your First Testimonial
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 mb-16 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="relative p-6 transition-all duration-300 shadow-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl hover:shadow-2xl"
                >
                  {isEditMode && (
                    <div className="absolute flex space-x-2 top-3 right-3">
                      <button
                        onClick={() => startEdit(testimonial)}
                        className="p-2 text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(testimonial.id)}
                        className="p-2 text-white transition-colors bg-red-500 rounded-lg hover:bg-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {editingId === testimonial.id ? (
                    renderTestimonialForm()
                  ) : (
                    <>
                      <div className="flex justify-end mb-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500">
                          <Quote className="w-5 h-5 text-black dark:text-white" />
                        </div>
                      </div>

                      <blockquote className="text-justify mb-6 italic leading-relaxed text-gray-700 dark:text-gray-300">
                        "{testimonial.content}"
                      </blockquote>

                      <div className="flex mb-4 space-x-1">
                        {[...Array(Math.max(0, testimonial.rating))].map(
                          (_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 text-yellow-500 fill-yellow-500"
                            />
                          )
                        )}
                      </div>

                      <div className="flex items-center space-x-4">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="object-cover w-12 h-12 rounded-full"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `${
                              testimonial.gender === "male"
                                ? maleAvatar
                                : femaleAvatar
                            }`;
                          }}
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 dark:text-white">
                            {testimonial.name}
                          </h3>
                          <p className="text-sm font-medium text-orange-500">
                            {testimonial.position}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {testimonial.company}
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="inline-flex items-center px-3 py-1 border rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-orange-500/30">
                          <span className="text-sm font-medium text-orange-500">
                            {testimonial.project}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {testimonials.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h3 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">
              Trusted by Amazing Companies
            </h3>

            <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
              {Array.from(new Set(testimonials.map((t) => t.company))).map(
                (company, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.1, opacity: 1 }}
                    className="px-6 py-3 font-bold text-gray-700 bg-gray-100 rounded-lg dark:bg-gray-800 dark:text-gray-300"
                  >
                    {company}
                  </motion.div>
                )
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Image Cropping Modal */}
      {isCropping && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Crop className="w-6 h-6" />
                Crop Avatar Image
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
                ref={containerRef}
                className="relative h-96 bg-gray-900 rounded-lg overflow-hidden mb-6 cursor-move select-none"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {/* Circular crop overlay */}
                <div className="absolute inset-0 pointer-events-none z-10">
                  <svg className="w-full h-full">
                    <defs>
                      <mask id="circleMask">
                        <rect width="100%" height="100%" fill="white" />
                        <circle cx="50%" cy="50%" r="80" fill="black" />
                      </mask>
                    </defs>
                    <rect
                      width="100%"
                      height="100%"
                      fill="rgba(0,0,0,0.5)"
                      mask="url(#circleMask)"
                    />
                    <circle
                      cx="50%"
                      cy="50%"
                      r="80"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeDasharray="10,5"
                    />
                  </svg>
                </div>

                <img
                  ref={imageRef}
                  src={imageToCrop}
                  alt="Crop preview"
                  onLoad={handleImageLoad}
                  className="absolute select-none z-0"
                  style={{
                    maxHeight: "100%",
                    maxWidth: "100%",
                    height: "auto",
                    width: "auto",
                    left: "50%",
                    top: "50%",
                    transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(${scale})`,
                    transformOrigin: "center",
                    opacity: imageLoaded ? 1 : 0,
                    transition: imageLoaded ? "none" : "opacity 0.3s",
                  }}
                  draggable={false}
                />

                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center text-white">
                    <p>Loading image...</p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-white">
                      Zoom
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={handleZoomOut}
                        className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                      >
                        <ZoomOut className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleZoomIn}
                        className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.01}
                    value={scale}
                    onChange={(e) => setScale(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  Drag to reposition • Use slider or buttons to zoom
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setIsCropping(false)}
                className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCropConfirm}
                disabled={!imageLoaded}
                className="px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="w-5 h-5" />
                Crop & Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden canvas for cropping */}
      <canvas ref={canvasRef} className="hidden" />
    </section>
  );
};

export default Testimonials;
