// import React, { useState, useEffect, useRef } from "react";
// import Cropper from "react-easy-crop";
// import { motion } from "framer-motion";
// import {
//   Calendar,
//   Tag,
//   Edit,
//   Save,
//   Plus,
//   Trash2,
//   X,
//   Crop,
//   Check,
//   ZoomIn,
//   ZoomOut,
//   Upload,
// } from "lucide-react";
// import { toast } from "sonner";

// interface Project {
//   id: number;
//   title: string;
//   description: string;
//   image: string;
//   tags: string[];
//   github: string;
//   live: string;
//   date: string;
//   category: string;
//   featured?: boolean;
// }

// export interface ProjectContent {
//   subtitle: string;
//   heading: string;
//   description: string;
//   projects: Project[];
//   categories?: string[];
// }

// interface ProjectsProps {
//   content: ProjectContent;
//   onSave: (updatedContent: ProjectContent) => void;
//   userId?: string | undefined;
// }

// const Projects: React.FC<ProjectsProps> = ({ content, onSave, userId }) => {
//   const [projectContent, setProjectContent] = useState<ProjectContent>(content);
//   const [isEditing, setIsEditing] = useState(false);
//   const [isAdding, setIsAdding] = useState(false);
//   const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
//   const [currentProject, setCurrentProject] = useState<Project | null>(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const [tagInput, setTagInput] = useState<string>("");

//   // Character limits
//   const CHAR_LIMITS = {
//     heading: 100,
//     description: 500,
//     projectTitle: 100,
//     projectDescription: 1000,
//     tags: 300,
//     github: 500,
//     live: 500,
//     date: 20,
//     category: 50,
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

//   // ✅ Only update local state when content prop changes from parent
//   useEffect(() => {
//     const processedProjects = (content.projects || []).map((project) => ({
//       ...project,
//       id:
//         typeof project.id === "number"
//           ? project.id
//           : Math.floor(Number(project.id)) || Date.now(),
//       tags: Array.isArray(project.tags) ? project.tags : [],
//       featured: Boolean(project.featured),
//     }));

//     setProjectContent({
//       ...content,
//       projects: processedProjects,
//     });
//   }, [content]); // Only depend on content prop

//   useEffect(() => {
//     if (editingProjectId !== null) {
//       const projectToEdit = projectContent.projects.find(
//         (p) => p.id === editingProjectId
//       );
//       if (projectToEdit) {
//         setCurrentProject({ ...projectToEdit });
//         setTagInput(projectToEdit.tags ? projectToEdit.tags.join(", ") : "");
//       }
//     } else {
//       setCurrentProject(null);
//       setTagInput("");
//     }
//   }, [editingProjectId, projectContent.projects]);

//   useEffect(() => {
//     if (isAdding && !currentProject) {
//       setCurrentProject(getNewProjectTemplate());
//       setTagInput("");
//     }
//   }, [isAdding, currentProject]);

//   const getCharCountColor = (current: number, max: number) => {
//     if (current >= max) return "text-red-500";
//     if (current >= max * 0.9) return "text-yellow-500";
//     return "text-gray-500";
//   };

//   // Image cropping functions
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
//       const outputWidth = 800;
//       const outputHeight = 600;
//       canvas.width = outputWidth;
//       canvas.height = outputHeight;
//       const img = new Image();
//       img.crossOrigin = "anonymous";
//       img.src = imageToCrop;
//       img.onload = () => {
//         const { x, y, width, height } = croppedAreaPixels as any;
//         ctx.drawImage(
//           img,
//           x,
//           y,
//           width,
//           height,
//           0,
//           0,
//           outputWidth,
//           outputHeight
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
//       const croppedFile = new File([croppedBlob], "cropped-project-image.jpg", {
//         type: "image/jpeg",
//       });

//       // Convert to base64 for immediate preview
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         if (reader.result) {
//           setCurrentProject((prev) =>
//             prev ? { ...prev, image: reader.result as string } : prev
//           );
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
//       formData.append("fieldName", "projectImage");

//       const uploadResponse = await fetch(
//         `https://ow3v94b9gf.execute-api.ap-south-1.amazonaws.com/dev/`,
//         {
//           method: "POST",
//           body: formData,
//         }
//       );

//       if (uploadResponse.ok) {
//         const uploadData = await uploadResponse.json();
//         setCurrentProject((prev) =>
//           prev ? { ...prev, image: uploadData.s3Url } : prev
//         );
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

//   const handleZoomIn = () => {
//     setZoom((prev) => Math.min(prev + 0.1, 5));
//   };

//   const handleZoomOut = () => {
//     setZoom((prev) => Math.max(prev - 0.1, 0.1));
//   };

//   const handleSaveSection = () => {
//     onSave(projectContent);
//     setIsEditing(false);
//     setEditingProjectId(null);
//     toast.success("Projects section updated!");
//   };

//   const handleEditClick = (id: number) => {
//     setEditingProjectId(id);
//     setIsAdding(false);
//   };

//   const handleSaveProject = () => {
//     if (!currentProject) return;

//     const parsedTags = tagInput
//       .split(",")
//       .map((t) => t.trim())
//       .filter(Boolean);

//     const updatedProject = { ...currentProject, tags: parsedTags };

//     const updatedProjects = projectContent.projects.map((p) =>
//       p.id === updatedProject.id ? updatedProject : p
//     );
//     const updatedContent = { ...projectContent, projects: updatedProjects };
//     setProjectContent(updatedContent);
//     onSave(updatedContent);
//     setEditingProjectId(null);
//     setCurrentProject(null);
//     setTagInput("");
//     toast.success("Project updated!");
//   };

//   const handleAddProject = async () => {
//     if (isUploading) {
//       toast.error("Please wait for the image upload to finish before saving.");
//       return;
//     }
//     if (!currentProject || !currentProject.title.trim()) {
//       toast.error("Project title is required");
//       return;
//     }

//     let finalImage = currentProject.image;

//     // If an image was selected but crop wasn't confirmed, finalize it now
//     if (!finalImage && imageToCrop && croppedAreaPixels) {
//       try {
//         setIsUploading(true);
//         const croppedBlob = await getCroppedImage();
//         const croppedFile = new File([croppedBlob], "cropped-project-image.jpg", {
//           type: "image/jpeg",
//         });

//         // Base64 preview immediately
//         const base64 = await new Promise<string>((resolve, reject) => {
//           const r = new FileReader();
//           r.onloadend = () => (r.result ? resolve(r.result as string) : reject(new Error("preview failed")));
//           r.readAsDataURL(croppedFile);
//         });
//         finalImage = base64;

//         // Try S3 upload if userId available
//         if (userId) {
//           const formData = new FormData();
//           formData.append("file", croppedFile);
//           formData.append("userId", userId);
//           formData.append("fieldName", "projectImage");
//           const uploadResponse = await fetch(
//             `https://ow3v94b9gf.execute-api.ap-south-1.amazonaws.com/dev/`,
//             { method: "POST", body: formData }
//           );
//           if (uploadResponse.ok) {
//             const uploadData = await uploadResponse.json();
//             finalImage = uploadData.s3Url || finalImage;
//           } else {
//             const err = await uploadResponse.json().catch(() => ({}));
//             toast.error(`Image upload failed: ${err.message || "Unknown error"}`);
//           }
//         }
//       } catch (e) {
//         console.error("Auto-crop on save failed:", e);
//         toast.error("Could not process image. You can try cropping again.");
//       } finally {
//         setIsUploading(false);
//       }
//     }

//     const newId =
//       projectContent.projects.length > 0
//         ? Math.max(...projectContent.projects.map((p) => p.id)) + 1
//         : 1;

//     const tagsFromInput = tagInput
//       .split(",")
//       .map((t) => t.trim())
//       .filter(Boolean);

//     const newProject: Project = {
//       ...currentProject,
//       id: newId,
//       image: finalImage || currentProject.image,
//       tags: tagsFromInput,
//       featured: currentProject.featured || false,
//     };

//     // ✅ Create updated content with new project
//     const updatedContent = {
//       ...projectContent,
//       projects: [...projectContent.projects, newProject],
//     };

//     // ✅ Update local state
//     setProjectContent(updatedContent);

//     // ✅ Update parent state
//     onSave(updatedContent);

//     setIsAdding(false);
//     setCurrentProject(null);
//     setTagInput("");
//     toast.success("Project added!");
//   };

//   const handleDeleteProject = (id: number) => {
//     const updatedContent = {
//       ...projectContent,
//       projects: projectContent.projects.filter((p) => p.id !== id),
//     };
//     setProjectContent(updatedContent);
//     onSave(updatedContent);
//     toast.success("Project removed");
//   };

//   const handleProjectChange = (
//     field: keyof Project,
//     value: string | boolean
//   ) => {
//     if (!currentProject) return;
//     setCurrentProject({ ...currentProject, [field]: value } as Project);
//   };

//   const handleCancelEdit = () => {
//     setIsEditing(false);
//     setEditingProjectId(null);
//     setCurrentProject(null);
//     toast.success("Cancel update");
//     setTagInput("");
//   };

//   const handleCancelAdd = () => {
//     setIsAdding(false);
//     setCurrentProject(null);
//     setTagInput("");
//   };

//   const startAddingProject = () => {
//     setIsAdding(true);
//     setEditingProjectId(null);
//     setCurrentProject(getNewProjectTemplate());
//     setTagInput("");
//   };

//   const getNewProjectTemplate = (): Project => ({
//     id: 0,
//     title: "",
//     description: "",
//     image:
//       "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop",
//     tags: [],
//     github: "",
//     live: "",
//     date: new Date().getFullYear().toString(),
//     category: "",
//     featured: false,
//   });

//   const handleContentTextChange = (
//     field: keyof ProjectContent,
//     value: string
//   ) => {
//     setProjectContent((prev) => ({ ...prev, [field]: value }));
//   };

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: { staggerChildren: 0.1, delayChildren: 0.2 },
//     },
//   };

//   const itemVariants = {
//     hidden: { y: 50, opacity: 0 },
//     visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
//   };

//   return (
//     <section id="projects" className="py-20 text-justify bg-white dark:bg-gray-900">
//       <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
//         <motion.div
//           variants={containerVariants}
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true, amount: 0.2 }}
//         >
//           {/* Header */}
//           <motion.div
//             variants={itemVariants}
//             className="relative mb-16 text-center"
//           >
//             <div className="flex absolute top-0 right-0 gap-2 items-center">
//               {isEditing ? (
//                 <>
//                   <button
//                     onClick={handleSaveSection}
//                     className="p-3 text-white bg-green-500 rounded-full transition-colors hover:bg-green-600"
//                     title="Save Changes"
//                   >
//                     <Save className="w-6 h-6" />
//                   </button>
//                   <button
//                     onClick={handleCancelEdit}
//                     className="p-3 text-white bg-red-500 rounded-full transition-colors hover:bg-red-600"
//                     title="Cancel"
//                   >
//                     <X className="w-6 h-6" />
//                   </button>
//                 </>
//               ) : (
//                 <button
//                   onClick={() => setIsEditing(true)}
//                   className="p-3 text-gray-900 bg-gray-200 rounded-full transition-colors dark:text-white dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
//                   title="Edit Section"
//                 >
//                   <Edit className="w-6 h-6" />
//                 </button>
//               )}
//             </div>

//             {isEditing && (
//               <button
//                 onClick={startAddingProject}
//                 className="absolute top-0 right-28 p-3 text-white bg-blue-500 rounded-full transition-colors hover:bg-blue-600"
//                 title="Add New Project"
//               >
//                 <Plus className="w-6 h-6" />
//               </button>
//             )}

//             {isEditing ? (
//               <div className="space-y-4">
//                 <div className="space-y-1">
//                   <input
//                     type="text"
//                     value={projectContent.heading}
//                     onChange={(e) =>
//                       handleContentTextChange("heading", e.target.value)
//                     }
//                     maxLength={CHAR_LIMITS.heading}
//                     className="p-2 mx-auto w-full max-w-2xl text-4xl font-bold text-gray-900 bg-gray-100 rounded-lg border-2 lg:text-5xl dark:bg-gray-800 dark:text-white focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none"
//                     placeholder="Section heading"
//                   />
//                   <div
//                     className={`text-sm text-right max-w-2xl mx-auto ${getCharCountColor(
//                       projectContent.heading.length,
//                       CHAR_LIMITS.heading
//                     )}`}
//                   >
//                     {projectContent.heading.length}/{CHAR_LIMITS.heading}
//                   </div>
//                 </div>
//                 <div className="space-y-1">
//                   <textarea
//                     value={projectContent.description}
//                     onChange={(e) =>
//                       handleContentTextChange("description", e.target.value)
//                     }
//                     maxLength={CHAR_LIMITS.description}
//                     className="p-2 mx-auto w-full max-w-3xl text-xl text-gray-600 bg-gray-100 rounded-lg border-2 resize-none dark:bg-gray-800 dark:text-gray-400 focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none"
//                     rows={2}
//                     placeholder="Section description"
//                   />
//                   <div
//                     className={`text-sm text-right max-w-3xl mx-auto ${getCharCountColor(
//                       projectContent.description.length,
//                       CHAR_LIMITS.description
//                     )}`}
//                   >
//                     {projectContent.description.length}/
//                     {CHAR_LIMITS.description}
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <>
//                 <h2 className="mb-4 text-4xl font-bold text-gray-900 lg:text-5xl dark:text-white">
//                   {projectContent.heading.split(" ")[0]}{" "}
//                   <span className="text-orange-500">
//                     {projectContent.heading.split(" ").slice(1).join(" ")}
//                   </span>
//                 </h2>
//                 <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-400">
//                   {projectContent.description}
//                 </p>
//               </>
//             )}
//           </motion.div>

//           {/* Add New Project Form */}
//           {isAdding && (
//             <motion.div
//               variants={itemVariants}
//               initial="hidden"
//               animate="visible"
//               className="relative p-6 mb-8 bg-gray-50 rounded-2xl shadow-lg transition-all duration-300 dark:bg-gray-800"
//             >
//               <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
//                 Add New Project
//               </h3>

//               <div className="flex flex-col space-y-4">
//                 <div className="relative">
//                   <label className="flex flex-col justify-center items-center p-6 text-center text-gray-500 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:border-gray-600 dark:text-gray-400">
//                     <Upload className="mb-2 w-12 h-12" />
//                     <span>Click to upload project image</span>
//                     <input
//                       type="file"
//                       onChange={handleImageUpload}
//                       className="hidden"
//                       accept="image/*"
//                     />
//                   </label>
//                   {currentProject?.image && (
//                     <div className="mt-4">
//                       <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
//                         Image Preview:
//                       </p>
//                       <img
//                         src={currentProject.image}
//                         alt="Project Preview"
//                         className="object-cover w-full h-48 rounded-lg"
//                       />
//                     </div>
//                   )}
//                 </div>

//                 <div className="space-y-1">
//                   <input
//                     type="text"
//                     value={currentProject?.title || ""}
//                     onChange={(e) =>
//                       handleProjectChange("title", e.target.value)
//                     }
//                     maxLength={CHAR_LIMITS.projectTitle}
//                     placeholder="Project Title"
//                     className="px-4 py-2 w-full text-gray-900 bg-white rounded-lg border border-gray-300 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none"
//                   />
//                   <div
//                     className={`text-sm text-right ${getCharCountColor(
//                       currentProject?.title?.length || 0,
//                       CHAR_LIMITS.projectTitle
//                     )}`}
//                   >
//                     {currentProject?.title?.length || 0}/
//                     {CHAR_LIMITS.projectTitle}
//                   </div>
//                 </div>

//                 <div className="space-y-1">
//                   <textarea
//                     value={currentProject?.description || ""}
//                     onChange={(e) =>
//                       handleProjectChange("description", e.target.value)
//                     }
//                     maxLength={CHAR_LIMITS.projectDescription}
//                     placeholder="Project Description"
//                     rows={3}
//                     className="px-4 py-2 w-full text-gray-900 bg-white rounded-lg border border-gray-300 resize-none dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none"
//                   />
//                   <div
//                     className={`text-sm text-right ${getCharCountColor(
//                       currentProject?.description?.length || 0,
//                       CHAR_LIMITS.projectDescription
//                     )}`}
//                   >
//                     {currentProject?.description?.length || 0}/
//                     {CHAR_LIMITS.projectDescription}
//                   </div>
//                 </div>

//                 <div className="space-y-1">
//                   <input
//                     type="text"
//                     value={tagInput}
//                     onChange={(e) => setTagInput(e.target.value)}
//                     maxLength={CHAR_LIMITS.tags}
//                     placeholder="Tags (comma separated, e.g., React, Node.js)"
//                     className="px-4 py-2 w-full text-gray-900 bg-white rounded-lg border border-gray-300 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none"
//                   />
//                   <div
//                     className={`text-sm text-right ${getCharCountColor(
//                       tagInput.length,
//                       CHAR_LIMITS.tags
//                     )}`}
//                   >
//                     {tagInput.length}/{CHAR_LIMITS.tags}
//                   </div>
//                 </div>

//                 <div className="flex justify-end space-x-4">
//                   <motion.button
//                     onClick={handleCancelAdd}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     className="px-6 py-2 font-semibold text-gray-900 bg-gray-200 rounded-lg dark:bg-gray-700 dark:text-white"
//                   >
//                     Cancel
//                   </motion.button>
//                   <motion.button
//                     onClick={handleAddProject}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     className="px-6 py-2 font-semibold text-white bg-orange-500 rounded-lg cursor-pointer"
//                     disabled={!currentProject?.title?.trim() || isUploading}
//                   >
//                     {isUploading ? "Uploading..." : "Save Project"}
//                   </motion.button>
//                 </div>
//               </div>
//             </motion.div>
//           )}

//           {/* Projects Grid */}
//           {projectContent.projects.length === 0 ? (
//             <div className="py-20 text-center">
//               <p className="text-lg text-gray-500 dark:text-gray-400">
//                 No projects to display yet.
//               </p>
//               {isEditing && (
//                 <button
//                   onClick={startAddingProject}
//                   className="px-6 py-2 mt-4 text-white bg-blue-500 rounded-lg transition-colors hover:bg-blue-600"
//                 >
//                   Add Your First Project
//                 </button>
//               )}
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
//               {projectContent.projects.map((project) => (
//                 <motion.div
//                   key={project.id}
//                   // variants={itemVariants}
//                   whileHover={{ y: isEditing ? 0 : -10 }}
//                   className="overflow-hidden relative bg-gray-50 rounded-2xl shadow-lg transition-all duration-300 group dark:bg-gray-800 hover:shadow-2xl"
//                 >
//                   {/* Card edit actions */}
//                   {isEditing && (
//                     <div className="flex absolute top-2 right-2 z-20 space-x-2">
//                       {editingProjectId !== project.id ? (
//                         <button
//                           onClick={() => handleEditClick(project.id)}
//                           className="p-1 text-white bg-gray-700 rounded-full transition-colors hover:bg-gray-600"
//                           title="Edit This Project"
//                         >
//                           <Edit className="w-6 h-6" />
//                         </button>
//                       ) : (
//                         <button
//                           onClick={handleSaveProject}
//                           className="p-1 text-white bg-green-500 rounded-full transition-colors hover:bg-green-600"
//                           title="Save This Project"
//                           disabled={isUploading}
//                         >
//                           <Save className="w-6 h-6" />
//                         </button>
//                       )}
//                       <button
//                         onClick={() => handleDeleteProject(project.id)}
//                         className="p-1 text-white bg-red-500 rounded-full transition-colors hover:bg-red-600"
//                         title="Delete This Project"
//                       >
//                         <Trash2 className="w-6 h-6" />
//                       </button>
//                     </div>
//                   )}

//                   {/* Image */}
//                   <div className="overflow-hidden relative">
//                     {editingProjectId === project.id ? (
//                       <div className="relative">
//                         <label className="flex absolute inset-0 z-10 flex-col justify-center items-center text-white cursor-pointer bg-black/50">
//                           <Upload className="mb-2 w-12 h-12" />
//                           <span>Change image</span>
//                           <input
//                             type="file"
//                             onChange={handleImageUpload}
//                             className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                             accept="image/*"
//                             disabled={isUploading}
//                           />
//                         </label>
//                         <img
//                           src={currentProject?.image || project.image}
//                           alt={project.title}
//                           className="object-cover w-full h-48 filter blur-sm transition-transform duration-300 group-hover:scale-110"
//                         />
//                       </div>
//                     ) : (
//                       <img
//                         src={project.image}
//                         alt={project.title}
//                         className="object-cover w-full h-48 transition-transform duration-300 group-hover:scale-110"
//                       />
//                     )}
//                   </div>

//                   {/* Content */}
//                   <div className="p-6">
//                     <div className="flex justify-between items-center mb-3">
//                       <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
//                         <Calendar className="mr-1 w-4 h-4" />
//                         {editingProjectId === project.id ? (
//                           <div className="space-y-1">
//                             <input
//                               type="text"
//                               value={currentProject?.date || ""}
//                               onChange={(e) =>
//                                 handleProjectChange("date", e.target.value)
//                               }
//                               maxLength={CHAR_LIMITS.date}
//                               className="w-16 text-gray-900 bg-transparent border-b border-gray-300 dark:text-white dark:border-gray-600 focus:outline-none"
//                             />
//                             <div
//                               className={`text-xs text-right ${getCharCountColor(
//                                 currentProject?.date?.length || 0,
//                                 CHAR_LIMITS.date
//                               )}`}
//                             >
//                               {currentProject?.date?.length || 0}/
//                               {CHAR_LIMITS.date}
//                             </div>
//                           </div>
//                         ) : (
//                           project.date
//                         )}
//                       </div>
//                       <div className="flex items-center text-sm text-orange-500">
//                         <Tag className="mr-1 w-4 h-4" />
//                         {editingProjectId === project.id ? (
//                           <div className="space-y-1">
//                             <input
//                               type="text"
//                               value={currentProject?.category || ""}
//                               onChange={(e) =>
//                                 handleProjectChange("category", e.target.value)
//                               }
//                               maxLength={CHAR_LIMITS.category}
//                               className="w-24 text-gray-900 bg-transparent border-b border-gray-300 dark:text-white dark:border-gray-600 focus:outline-none"
//                             />
//                             <div
//                               className={`text-xs text-right ${getCharCountColor(
//                                 currentProject?.category?.length || 0,
//                                 CHAR_LIMITS.category
//                               )}`}
//                             >
//                               {currentProject?.category?.length || 0}/
//                               {CHAR_LIMITS.category}
//                             </div>
//                           </div>
//                         ) : (
//                           project.category
//                         )}
//                       </div>
//                     </div>

//                     {editingProjectId === project.id ? (
//                       <div className="space-y-1">
//                         <input
//                           type="text"
//                           value={currentProject?.title || ""}
//                           onChange={(e) =>
//                             handleProjectChange("title", e.target.value)
//                           }
//                           maxLength={CHAR_LIMITS.projectTitle}
//                           className="mb-3 w-full text-xl font-bold text-gray-900 bg-transparent border-b border-gray-300 dark:text-white dark:border-gray-600 focus:outline-none"
//                         />
//                         <div
//                           className={`text-xs text-right ${getCharCountColor(
//                             currentProject?.title?.length || 0,
//                             CHAR_LIMITS.projectTitle
//                           )}`}
//                         >
//                           {currentProject?.title?.length || 0}/
//                           {CHAR_LIMITS.projectTitle}
//                         </div>
//                       </div>
//                     ) : (
//                       <h3 className="mb-3 text-xl font-bold text-gray-900 transition-colors duration-200 dark:text-white group-hover:text-orange-500">
//                         {project.title}
//                       </h3>
//                     )}

//                     {editingProjectId === project.id ? (
//                       <div className="space-y-1">
//                         <textarea
//                           value={currentProject?.description || ""}
//                           onChange={(e) =>
//                             handleProjectChange("description", e.target.value)
//                           }
//                           maxLength={CHAR_LIMITS.projectDescription}
//                           className="p-2 mb-4 w-full text-gray-900 bg-transparent rounded border border-gray-300 resize-none dark:text-white dark:border-gray-600 focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none"
//                           rows={3}
//                         />
//                         <div
//                           className={`text-xs text-right ${getCharCountColor(
//                             currentProject?.description?.length || 0,
//                             CHAR_LIMITS.projectDescription
//                           )}`}
//                         >
//                           {currentProject?.description?.length || 0}/
//                           {CHAR_LIMITS.projectDescription}
//                         </div>
//                       </div>
//                     ) : (
//                       <p className="mb-4 leading-relaxed text-gray-600 dark:text-gray-300">
//                         {project.description}
//                       </p>
//                     )}

//                     {/* Tech Tags */}
//                     <div className="flex flex-wrap gap-2 mb-4">
//                       {editingProjectId === project.id ? (
//                         <div className="space-y-1 w-full">
//                           <input
//                             type="text"
//                             value={tagInput}
//                             onChange={(e) => setTagInput(e.target.value)}
//                             maxLength={CHAR_LIMITS.tags}
//                             className="p-2 w-full text-gray-900 bg-transparent rounded border border-gray-300 dark:text-white dark:border-gray-600 focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none"
//                             placeholder="Separate tags with commas"
//                           />
//                           <div
//                             className={`text-xs text-right ${getCharCountColor(
//                               tagInput.length,
//                               CHAR_LIMITS.tags
//                             )}`}
//                           >
//                             {tagInput.length}/{CHAR_LIMITS.tags}
//                           </div>
//                         </div>
//                       ) : (
//                         project.tags.map((tag, index) => (
//                           <span
//                             key={index}
//                             className="px-3 py-1 text-sm font-medium text-orange-500 bg-gradient-to-r rounded-full border from-yellow-500/10 to-orange-500/10 border-orange-500/30"
//                           >
//                             {tag}
//                           </span>
//                         ))
//                       )}

//                       {isEditing && (
//                         <p className="text-center text-xs text-gray-400">
//                           Tags should be separated by commas (e.g., data1,
//                           data2, data3)
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           )}
//         </motion.div>
//       </div>

//       {/* Image Cropping Modal */}
//       {isCropping && (
//         <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
//           <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl">
//             <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
//               <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
//                 <Crop className="w-6 h-6" />
//                 Crop Project Image
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
//                 className={`relative h-96 bg-gray-900 rounded-lg overflow-hidden mb-6 ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
//               >
//                 <Cropper
//                   image={imageToCrop}
//                   crop={crop}
//                   zoom={zoom}
//                   aspect={4 / 3}
//                   cropShape="rect"
//                   showGrid={true}
//                   minZoom={0.1}
//                   maxZoom={5}
//                   restrictPosition={false}
//                   zoomWithScroll={true}
//                   zoomSpeed={0.2}
//                   onCropChange={setCrop}
//                   onZoomChange={setZoom}
//                   onCropComplete={(_c, p) => setCroppedAreaPixels(p)}
//                   onMediaLoaded={() => setImageLoaded(true)}
//                   onInteractionStart={() => setIsDragging(true)}
//                   onInteractionEnd={() => setIsDragging(false)}
//                 />
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
//                     min={0.1}
//                     max={5}
//                     step={0.01}
//                     value={zoom}
//                     onChange={(e) => setZoom(Number(e.target.value))}
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

// export default Projects;

import React, { useState, useEffect, useRef, useCallback } from "react";
import Cropper from "react-easy-crop";
import { motion } from "framer-motion";
import {
  Calendar,
  Tag,
  Edit,
  Save,
  Plus,
  Trash2,
  X,
  Crop,
  Check,
  ZoomIn,
  ZoomOut,
  Upload,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  github: string;
  live: string;
  date: string;
  category: string;
  featured?: boolean;
}

export interface ProjectContent {
  subtitle: string;
  heading: string;
  description: string;
  projects: Project[];
  categories?: string[];
}

interface ProjectsProps {
  content: ProjectContent;
  onSave: (updatedContent: ProjectContent) => void;
  userId?: string | undefined;
}

const Projects: React.FC<ProjectsProps> = ({ content, onSave, userId }) => {
  const [projectContent, setProjectContent] = useState<ProjectContent>(content);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [tagInput, setTagInput] = useState<string>("");

  // Auto-save states
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Character limits
  const CHAR_LIMITS = {
    heading: 100,
    description: 500,
    projectTitle: 100,
    projectDescription: 1000,
    tags: 300,
    github: 500,
    live: 500,
    date: 20,
    category: 50,
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

  // ✅ Only update local state when content prop changes from parent
  useEffect(() => {
    const processedProjects = (content.projects || []).map((project) => ({
      ...project,
      id:
        typeof project.id === "number"
          ? project.id
          : Math.floor(Number(project.id)) || Date.now(),
      tags: Array.isArray(project.tags) ? project.tags : [],
      featured: Boolean(project.featured),
    }));

    setProjectContent({
      ...content,
      projects: processedProjects,
    });
    setHasUnsavedChanges(false);
  }, [content]); // Only depend on content prop

  // Auto-save cleanup
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (editingProjectId !== null) {
      const projectToEdit = projectContent.projects.find(
        (p) => p.id === editingProjectId
      );
      if (projectToEdit) {
        setCurrentProject({ ...projectToEdit });
        setTagInput(projectToEdit.tags ? projectToEdit.tags.join(", ") : "");
      }
    } else {
      setCurrentProject(null);
      setTagInput("");
    }
  }, [editingProjectId, projectContent.projects]);

  useEffect(() => {
    if (isAdding && !currentProject) {
      setCurrentProject(getNewProjectTemplate());
      setTagInput("");
    }
  }, [isAdding, currentProject]);

  // Auto-save function
  const performAutoSave = useCallback(async () => {
    if (!hasUnsavedChanges || !isEditing) return;

    setIsAutoSaving(true);
    
    try {
      onSave(projectContent);
      setLastSavedTime(new Date());
      setHasUnsavedChanges(false);
      
      console.log("Projects section auto-saved at", new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Projects auto-save failed:", error);
      toast.error("Auto-save failed. Changes not saved.");
    } finally {
      setIsAutoSaving(false);
    }
  }, [projectContent, hasUnsavedChanges, isEditing, onSave]);

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

  // Content text change handler with auto-save
  const handleContentTextChange = useCallback((
    field: keyof ProjectContent,
    value: string
  ) => {
    setProjectContent((prev) => ({ ...prev, [field]: value }));
    scheduleAutoSave();
  }, [scheduleAutoSave]);

  // Project change handler with auto-save
  const handleProjectChange = useCallback((
    field: keyof Project,
    value: string | boolean
  ) => {
    if (!currentProject) return;
    setCurrentProject({ ...currentProject, [field]: value } as Project);
    
    // If editing an existing project, update the main content and schedule auto-save
    if (editingProjectId !== null) {
      const updatedProjects = projectContent.projects.map((p) =>
        p.id === editingProjectId ? { ...currentProject, [field]: value } : p
      );
      setProjectContent(prev => ({ ...prev, projects: updatedProjects }));
      scheduleAutoSave();
    }
  }, [currentProject, editingProjectId, projectContent.projects, scheduleAutoSave]);

  // Tag input change handler with auto-save
  const handleTagInputChange = useCallback((value: string) => {
    setTagInput(value);
    
    // If editing an existing project, update the project tags and schedule auto-save
    if (editingProjectId !== null && currentProject) {
      const parsedTags = value
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      
      const updatedProject = { ...currentProject, tags: parsedTags };
      setCurrentProject(updatedProject);
      
      const updatedProjects = projectContent.projects.map((p) =>
        p.id === editingProjectId ? updatedProject : p
      );
      setProjectContent(prev => ({ ...prev, projects: updatedProjects }));
      scheduleAutoSave();
    }
  }, [currentProject, editingProjectId, projectContent.projects, scheduleAutoSave]);

  const getCharCountColor = (current: number, max: number) => {
    if (current >= max) return "text-red-500";
    if (current >= max * 0.9) return "text-yellow-500";
    return "text-gray-500";
  };

  // Image cropping functions
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
      const outputWidth = 800;
      const outputHeight = 600;
      canvas.width = outputWidth;
      canvas.height = outputHeight;
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imageToCrop;
      img.onload = () => {
        const { x, y, width, height } = croppedAreaPixels as any;
        ctx.drawImage(
          img,
          x,
          y,
          width,
          height,
          0,
          0,
          outputWidth,
          outputHeight
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
      const croppedFile = new File([croppedBlob], "cropped-project-image.jpg", {
        type: "image/jpeg",
      });

      // Convert to base64 for immediate preview
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          const tempImageSrc = reader.result as string;
          setCurrentProject((prev) =>
            prev ? { ...prev, image: tempImageSrc } : prev
          );
          // Schedule auto-save for image change if editing existing project
          if (editingProjectId !== null) {
            setHasUnsavedChanges(true);
            scheduleAutoSave();
          }
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
      formData.append("fieldName", "projectImage");

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
        setCurrentProject((prev) =>
          prev ? { ...prev, image: s3ImageUrl } : prev
        );
        
        // If editing existing project, trigger save with the new S3 URL
        if (editingProjectId !== null) {
          const updatedProjects = projectContent.projects.map((p) =>
            p.id === editingProjectId ? { ...currentProject!, image: s3ImageUrl } : p
          );
          const updatedContent = { ...projectContent, projects: updatedProjects };
          setProjectContent(updatedContent);
          onSave(updatedContent);
          setLastSavedTime(new Date());
          setHasUnsavedChanges(false);
        }
        
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

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 5));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.1));
  };

  // Manual save function
  const handleSaveSection = () => {
    // Clear any pending auto-save
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    onSave(projectContent);
    setLastSavedTime(new Date());
    setHasUnsavedChanges(false);
    setIsEditing(false);
    setEditingProjectId(null);
    toast.success("Projects section updated!");
  };

  const handleEditClick = (id: number) => {
    setEditingProjectId(id);
    setIsAdding(false);
  };

  const handleSaveProject = () => {
    if (!currentProject) return;

    // Clear any pending auto-save
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    const parsedTags = tagInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const updatedProject = { ...currentProject, tags: parsedTags };

    const updatedProjects = projectContent.projects.map((p) =>
      p.id === updatedProject.id ? updatedProject : p
    );
    const updatedContent = { ...projectContent, projects: updatedProjects };
    setProjectContent(updatedContent);
    onSave(updatedContent);
    setLastSavedTime(new Date());
    setHasUnsavedChanges(false);
    setEditingProjectId(null);
    setCurrentProject(null);
    setTagInput("");
    toast.success("Project updated!");
  };

  const handleAddProject = async () => {
    if (isUploading) {
      toast.error("Please wait for the image upload to finish before saving.");
      return;
    }
    if (!currentProject || !currentProject.title.trim()) {
      toast.error("Project title is required");
      return;
    }

    let finalImage = currentProject.image;

    // If an image was selected but crop wasn't confirmed, finalize it now
    if (!finalImage && imageToCrop && croppedAreaPixels) {
      try {
        setIsUploading(true);
        const croppedBlob = await getCroppedImage();
        const croppedFile = new File([croppedBlob], "cropped-project-image.jpg", {
          type: "image/jpeg",
        });

        // Base64 preview immediately
        const base64 = await new Promise<string>((resolve, reject) => {
          const r = new FileReader();
          r.onloadend = () => (r.result ? resolve(r.result as string) : reject(new Error("preview failed")));
          r.readAsDataURL(croppedFile);
        });
        finalImage = base64;

        // Try S3 upload if userId available
        if (userId) {
          const formData = new FormData();
          formData.append("file", croppedFile);
          formData.append("userId", userId);
          formData.append("fieldName", "projectImage");
          const uploadResponse = await fetch(
            `https://ow3v94b9gf.execute-api.ap-south-1.amazonaws.com/dev/`,
            { method: "POST", body: formData }
          );
          if (uploadResponse.ok) {
            const uploadData = await uploadResponse.json();
            finalImage = uploadData.s3Url || finalImage;
          } else {
            const err = await uploadResponse.json().catch(() => ({}));
            toast.error(`Image upload failed: ${err.message || "Unknown error"}`);
          }
        }
      } catch (e) {
        console.error("Auto-crop on save failed:", e);
        toast.error("Could not process image. You can try cropping again.");
      } finally {
        setIsUploading(false);
      }
    }

    const newId =
      projectContent.projects.length > 0
        ? Math.max(...projectContent.projects.map((p) => p.id)) + 1
        : 1;

    const tagsFromInput = tagInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const newProject: Project = {
      ...currentProject,
      id: newId,
      image: finalImage || currentProject.image,
      tags: tagsFromInput,
      featured: currentProject.featured || false,
    };

    // ✅ Create updated content with new project
    const updatedContent = {
      ...projectContent,
      projects: [...projectContent.projects, newProject],
    };

    // ✅ Update local state
    setProjectContent(updatedContent);

    // ✅ Update parent state
    onSave(updatedContent);

    setLastSavedTime(new Date());
    setHasUnsavedChanges(false);
    setIsAdding(false);
    setCurrentProject(null);
    setTagInput("");
    toast.success("Project added!");
  };

  const handleDeleteProject = (id: number) => {
    // Clear any pending auto-save
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    const updatedContent = {
      ...projectContent,
      projects: projectContent.projects.filter((p) => p.id !== id),
    };
    setProjectContent(updatedContent);
    onSave(updatedContent);
    setLastSavedTime(new Date());
    setHasUnsavedChanges(false);
    toast.success("Project removed");
  };

  const handleCancelEdit = () => {
    // Clear any pending auto-save
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    setIsEditing(false);
    setEditingProjectId(null);
    setCurrentProject(null);
    setHasUnsavedChanges(false);
    toast.info("Changes discarded");
    setTagInput("");
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setCurrentProject(null);
    setTagInput("");
  };

  const startAddingProject = () => {
    setIsAdding(true);
    setEditingProjectId(null);
    setCurrentProject(getNewProjectTemplate());
    setTagInput("");
  };

  const getNewProjectTemplate = (): Project => ({
    id: 0,
    title: "",
    description: "",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop",
    tags: [],
    github: "",
    live: "",
    date: new Date().getFullYear().toString(),
    category: "",
    featured: false,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <section id="projects" className="py-20 text-justify bg-white dark:bg-gray-900">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="relative mb-16 text-center"
          >
            <div className="flex absolute top-0 right-0 gap-2 items-center">
              {isEditing ? (
                <>
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
                    onClick={handleSaveSection}
                    className="p-3 text-white bg-green-500 rounded-full transition-colors hover:bg-green-600"
                    title="Save Changes"
                  >
                    <Save className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="p-3 text-white bg-red-500 rounded-full transition-colors hover:bg-red-600"
                    title="Cancel"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-3 text-gray-900 bg-gray-200 rounded-full transition-colors dark:text-white dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                  title="Edit Section"
                >
                  <Edit className="w-6 h-6" />
                </button>
              )}
            </div>

            {isEditing && (
              <button
                onClick={startAddingProject}
                className="absolute top-0 right-28 p-3 text-white bg-blue-500 rounded-full transition-colors hover:bg-blue-600"
                title="Add New Project"
              >
                <Plus className="w-6 h-6" />
              </button>
            )}

            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-1">
                  <input
                    type="text"
                    value={projectContent.heading}
                    onChange={(e) =>
                      handleContentTextChange("heading", e.target.value)
                    }
                    maxLength={CHAR_LIMITS.heading}
                    className="p-2 mx-auto w-full max-w-2xl text-4xl font-bold text-gray-900 bg-gray-100 rounded-lg border-2 lg:text-5xl dark:bg-gray-800 dark:text-white focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none"
                    placeholder="Section heading"
                  />
                  <div
                    className={`text-sm text-right max-w-2xl mx-auto ${getCharCountColor(
                      projectContent.heading.length,
                      CHAR_LIMITS.heading
                    )}`}
                  >
                    {projectContent.heading.length}/{CHAR_LIMITS.heading}
                  </div>
                </div>
                <div className="space-y-1">
                  <textarea
                    value={projectContent.description}
                    onChange={(e) =>
                      handleContentTextChange("description", e.target.value)
                    }
                    maxLength={CHAR_LIMITS.description}
                    className="p-2 mx-auto w-full max-w-3xl text-xl text-gray-600 bg-gray-100 rounded-lg border-2 resize-none dark:bg-gray-800 dark:text-gray-400 focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none"
                    rows={2}
                    placeholder="Section description"
                  />
                  <div
                    className={`text-sm text-right max-w-3xl mx-auto ${getCharCountColor(
                      projectContent.description.length,
                      CHAR_LIMITS.description
                    )}`}
                  >
                    {projectContent.description.length}/
                    {CHAR_LIMITS.description}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <h2 className="mb-4 text-4xl font-bold text-gray-900 lg:text-5xl dark:text-white">
                  {projectContent.heading.split(" ")[0]}{" "}
                  <span className="text-orange-500">
                    {projectContent.heading.split(" ").slice(1).join(" ")}
                  </span>
                </h2>
                <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-400">
                  {projectContent.description}
                </p>
              </>
            )}
          </motion.div>

          {/* Add New Project Form */}
          {isAdding && (
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="relative p-6 mb-8 bg-gray-50 rounded-2xl shadow-lg transition-all duration-300 dark:bg-gray-800"
            >
              <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                Add New Project
              </h3>

              <div className="flex flex-col space-y-4">
                <div className="relative">
                  <label className="flex flex-col justify-center items-center p-6 text-center text-gray-500 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:border-gray-600 dark:text-gray-400">
                    <Upload className="mb-2 w-12 h-12" />
                    <span>Click to upload project image</span>
                    <input
                      type="file"
                      onChange={handleImageUpload}
                      className="hidden"
                      accept="image/*"
                    />
                  </label>
                  {currentProject?.image && (
                    <div className="mt-4">
                      <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                        Image Preview:
                      </p>
                      <img
                        src={currentProject.image}
                        alt="Project Preview"
                        className="object-cover w-full h-48 rounded-lg"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <input
                    type="text"
                    value={currentProject?.title || ""}
                    onChange={(e) =>
                      handleProjectChange("title", e.target.value)
                    }
                    maxLength={CHAR_LIMITS.projectTitle}
                    placeholder="Project Title"
                    className="px-4 py-2 w-full text-gray-900 bg-white rounded-lg border border-gray-300 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none"
                  />
                  <div
                    className={`text-sm text-right ${getCharCountColor(
                      currentProject?.title?.length || 0,
                      CHAR_LIMITS.projectTitle
                    )}`}
                  >
                    {currentProject?.title?.length || 0}/
                    {CHAR_LIMITS.projectTitle}
                  </div>
                </div>

                <div className="space-y-1">
                  <textarea
                    value={currentProject?.description || ""}
                    onChange={(e) =>
                      handleProjectChange("description", e.target.value)
                    }
                    maxLength={CHAR_LIMITS.projectDescription}
                    placeholder="Project Description"
                    rows={3}
                    className="px-4 py-2 w-full text-gray-900 bg-white rounded-lg border border-gray-300 resize-none dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none"
                  />
                  <div
                    className={`text-sm text-right ${getCharCountColor(
                      currentProject?.description?.length || 0,
                      CHAR_LIMITS.projectDescription
                    )}`}
                  >
                    {currentProject?.description?.length || 0}/
                    {CHAR_LIMITS.projectDescription}
                  </div>
                </div>

                <div className="space-y-1">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => handleTagInputChange(e.target.value)}
                    maxLength={CHAR_LIMITS.tags}
                    placeholder="Tags (comma separated, e.g., React, Node.js)"
                    className="px-4 py-2 w-full text-gray-900 bg-white rounded-lg border border-gray-300 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none"
                  />
                  <div
                    className={`text-sm text-right ${getCharCountColor(
                      tagInput.length,
                      CHAR_LIMITS.tags
                    )}`}
                  >
                    {tagInput.length}/{CHAR_LIMITS.tags}
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <motion.button
                    onClick={handleCancelAdd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 font-semibold text-gray-900 bg-gray-200 rounded-lg dark:bg-gray-700 dark:text-white"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={handleAddProject}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 font-semibold text-white bg-orange-500 rounded-lg cursor-pointer"
                    disabled={!currentProject?.title?.trim() || isUploading}
                  >
                    {isUploading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Uploading...
                      </div>
                    ) : (
                      "Save Project"
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Projects Grid */}
          {projectContent.projects.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-lg text-gray-500 dark:text-gray-400">
                No projects to display yet.
              </p>
              {isEditing && (
                <button
                  onClick={startAddingProject}
                  className="px-6 py-2 mt-4 text-white bg-blue-500 rounded-lg transition-colors hover:bg-blue-600"
                >
                  Add Your First Project
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {projectContent.projects.map((project) => (
                <motion.div
                  key={project.id}
                  whileHover={{ y: isEditing ? 0 : -10 }}
                  className="overflow-hidden relative bg-gray-50 rounded-2xl shadow-lg transition-all duration-300 group dark:bg-gray-800 hover:shadow-2xl"
                >
                  {/* Card edit actions */}
                  {isEditing && (
                    <div className="flex absolute top-2 right-2 z-20 space-x-2">
                      {editingProjectId !== project.id ? (
                        <button
                          onClick={() => handleEditClick(project.id)}
                          className="p-1 text-white bg-gray-700 rounded-full transition-colors hover:bg-gray-600"
                          title="Edit This Project"
                        >
                          <Edit className="w-6 h-6" />
                        </button>
                      ) : (
                        <button
                          onClick={handleSaveProject}
                          className="p-1 text-white bg-green-500 rounded-full transition-colors hover:bg-green-600"
                          title="Save This Project"
                          disabled={isUploading}
                        >
                          <Save className="w-6 h-6" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="p-1 text-white bg-red-500 rounded-full transition-colors hover:bg-red-600"
                        title="Delete This Project"
                      >
                        <Trash2 className="w-6 h-6" />
                      </button>
                    </div>
                  )}

                  {/* Image */}
                  <div className="overflow-hidden relative">
                    {editingProjectId === project.id ? (
                      <div className="relative">
                        <label className="flex absolute inset-0 z-10 flex-col justify-center items-center text-white cursor-pointer bg-black/50">
                          <Upload className="mb-2 w-12 h-12" />
                          <span>Change image</span>
                          <input
                            type="file"
                            onChange={handleImageUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            accept="image/*"
                            disabled={isUploading}
                          />
                        </label>
                        <img
                          src={currentProject?.image || project.image}
                          alt={project.title}
                          className="object-cover w-full h-48 filter blur-sm transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                    ) : (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="object-cover w-full h-48 transition-transform duration-300 group-hover:scale-110"
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="mr-1 w-4 h-4" />
                        {editingProjectId === project.id ? (
                          <div className="space-y-1">
                            <input
                              type="text"
                              value={currentProject?.date || ""}
                              onChange={(e) =>
                                handleProjectChange("date", e.target.value)
                              }
                              maxLength={CHAR_LIMITS.date}
                              className="w-16 text-gray-900 bg-transparent border-b border-gray-300 dark:text-white dark:border-gray-600 focus:outline-none"
                            />
                            <div
                              className={`text-xs text-right ${getCharCountColor(
                                currentProject?.date?.length || 0,
                                CHAR_LIMITS.date
                              )}`}
                            >
                              {currentProject?.date?.length || 0}/
                              {CHAR_LIMITS.date}
                            </div>
                          </div>
                        ) : (
                          project.date
                        )}
                      </div>
                      <div className="flex items-center text-sm text-orange-500">
                        <Tag className="mr-1 w-4 h-4" />
                        {editingProjectId === project.id ? (
                          <div className="space-y-1">
                            <input
                              type="text"
                              value={currentProject?.category || ""}
                              onChange={(e) =>
                                handleProjectChange("category", e.target.value)
                              }
                              maxLength={CHAR_LIMITS.category}
                              className="w-24 text-gray-900 bg-transparent border-b border-gray-300 dark:text-white dark:border-gray-600 focus:outline-none"
                            />
                            <div
                              className={`text-xs text-right ${getCharCountColor(
                                currentProject?.category?.length || 0,
                                CHAR_LIMITS.category
                              )}`}
                            >
                              {currentProject?.category?.length || 0}/
                              {CHAR_LIMITS.category}
                            </div>
                          </div>
                        ) : (
                          project.category
                        )}
                      </div>
                    </div>

                    {editingProjectId === project.id ? (
                      <div className="space-y-1">
                        <input
                          type="text"
                          value={currentProject?.title || ""}
                          onChange={(e) =>
                            handleProjectChange("title", e.target.value)
                          }
                          maxLength={CHAR_LIMITS.projectTitle}
                          className="mb-3 w-full text-xl font-bold text-gray-900 bg-transparent border-b border-gray-300 dark:text-white dark:border-gray-600 focus:outline-none"
                        />
                        <div
                          className={`text-xs text-right ${getCharCountColor(
                            currentProject?.title?.length || 0,
                            CHAR_LIMITS.projectTitle
                          )}`}
                        >
                          {currentProject?.title?.length || 0}/
                          {CHAR_LIMITS.projectTitle}
                        </div>
                      </div>
                    ) : (
                      <h3 className="mb-3 text-xl font-bold text-gray-900 transition-colors duration-200 dark:text-white group-hover:text-orange-500">
                        {project.title}
                      </h3>
                    )}

                    {editingProjectId === project.id ? (
                      <div className="space-y-1">
                        <textarea
                          value={currentProject?.description || ""}
                          onChange={(e) =>
                            handleProjectChange("description", e.target.value)
                          }
                          maxLength={CHAR_LIMITS.projectDescription}
                          className="p-2 mb-4 w-full text-gray-900 bg-transparent rounded border border-gray-300 resize-none dark:text-white dark:border-gray-600 focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none"
                          rows={3}
                        />
                        <div
                          className={`text-xs text-right ${getCharCountColor(
                            currentProject?.description?.length || 0,
                            CHAR_LIMITS.projectDescription
                          )}`}
                        >
                          {currentProject?.description?.length || 0}/
                          {CHAR_LIMITS.projectDescription}
                        </div>
                      </div>
                    ) : (
                      <p className="mb-4 leading-relaxed text-gray-600 dark:text-gray-300">
                        {project.description}
                      </p>
                    )}

                    {/* Tech Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {editingProjectId === project.id ? (
                        <div className="space-y-1 w-full">
                          <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => handleTagInputChange(e.target.value)}
                            maxLength={CHAR_LIMITS.tags}
                            className="p-2 w-full text-gray-900 bg-transparent rounded border border-gray-300 dark:text-white dark:border-gray-600 focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none"
                            placeholder="Separate tags with commas"
                          />
                          <div
                            className={`text-xs text-right ${getCharCountColor(
                              tagInput.length,
                              CHAR_LIMITS.tags
                            )}`}
                          >
                            {tagInput.length}/{CHAR_LIMITS.tags}
                          </div>
                        </div>
                      ) : (
                        project.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 text-sm font-medium text-orange-500 bg-gradient-to-r rounded-full border from-yellow-500/10 to-orange-500/10 border-orange-500/30"
                          >
                            {tag}
                          </span>
                        ))
                      )}

                      {isEditing && (
                        <p className="text-center text-xs text-gray-400">
                          Tags should be separated by commas (e.g., data1,
                          data2, data3)
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Image Cropping Modal */}
      {isCropping && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Crop className="w-6 h-6" />
                Crop Project Image
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
                className={`relative h-96 bg-gray-900 rounded-lg overflow-hidden mb-6 ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
              >
                <Cropper
                  image={imageToCrop}
                  crop={crop}
                  zoom={zoom}
                  aspect={4 / 3}
                  cropShape="rect"
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
                    min={0.1}
                    max={5}
                    step={0.01}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
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
                disabled={!imageLoaded || isUploading}
                className="px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Crop & Upload
                  </>
                )}
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

export default Projects;