// import { Edit2, Loader2, Plus, Quote, Save, Star, Trash2, X } from 'lucide-react';
// import { motion } from 'motion/react';
// import { useCallback, useEffect, useState } from 'react';
// import { toast } from 'sonner';

// // Text limits
// const TEXT_LIMITS = {
//   SUBTITLE: 100,
//   HEADING: 60,
//   DESCRIPTION: 300,
//   TESTIMONIAL_CONTENT: 500,
//   CLIENT_NAME: 40,
//   CLIENT_POSITION: 40,
//   PROJECT: 30,
//   DATE: 20,
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
//       className={`${baseClasses} ${variants[variant || 'default']} ${
//         sizes[size || 'default']
//       } ${className || ""}`}
//       onClick={onClick}
//       disabled={disabled}
//       {...props}
//     >
//       {children}
//     </button>
//   );
// };

// // Define types for Testimonial data based on your JSON
// interface Testimonial {
//   id: number;
//   name: string;
//   position: string;
//   content: string;
//   rating: number;
//   project: string;
//   date: string;
// }

// interface TestimonialsData {
//   subtitle: string;
//   heading: string;
//   description: string;
//   testimonials: Testimonial[];
// }

// // Props interface
// interface TestimonialsProps {
//   testimonialsData?: TestimonialsData;
//   onStateChange?: (data: TestimonialsData) => void;

// }

// export function Testimonials({
//   testimonialsData,
//   onStateChange,

// }: TestimonialsProps) {
//   const [isEditing, setIsEditing] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);

//   // Initialize with props data or empty structure
//   const [data, setData] = useState<TestimonialsData>(testimonialsData || {
//     subtitle: "",
//     heading: "",
//     description: "",
//     testimonials: []
//   });
//   const [tempData, setTempData] = useState<TestimonialsData>(testimonialsData || {
//     subtitle: "",
//     heading: "",
//     description: "",
//     testimonials: []
//   });

//   // Calculate displayData based on editing state
//   const displayData = isEditing ? tempData : data;

//   // Sync with props data when it changes
//   useEffect(() => {
//     if (testimonialsData) {
//       setData(testimonialsData);
//       setTempData(testimonialsData);
//     }
//   }, [testimonialsData]);

//   // Notify parent of state changes
//   useEffect(() => {
//     if (onStateChange) {
//       onStateChange(data);
//     }
//   }, [data]);

//   const handleEdit = () => {
//     setIsEditing(true);
//     setTempData({ ...data });
//   };

//   // Save function
//   const handleSave = async () => {
//     try {
//       setIsSaving(true);

//       // Simulate save API call
//       await new Promise((resolve) => setTimeout(resolve, 1000));

//       // Update data state
//       setData(tempData);

//       setIsEditing(false);
//       toast.success('Testimonials section saved successfully');

//     } catch (error) {
//       console.error('Error saving testimonials section:', error);
//       toast.error('Error saving changes. Please try again.');
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleCancel = () => {
//     setTempData({ ...data });
//     setIsEditing(false);
//   };

//   // Stable update functions with useCallback
//   const updateTestimonial = useCallback((index: number, field: keyof Testimonial, value: any) => {
//     setTempData(prevData => {
//       const updatedTestimonials = [...prevData.testimonials];
//       updatedTestimonials[index] = { ...updatedTestimonials[index], [field]: value };
//       return { ...prevData, testimonials: updatedTestimonials };
//     });
//   }, []);

//   const updateRating = useCallback((index: number, rating: number) => {
//     setTempData(prevData => {
//       const updatedTestimonials = [...prevData.testimonials];
//       updatedTestimonials[index] = { ...updatedTestimonials[index], rating };
//       return { ...prevData, testimonials: updatedTestimonials };
//     });
//   }, []);

//   const addTestimonial = useCallback(() => {
//     const newTestimonial: Testimonial = {
//       id: Date.now(),
//       name: 'New Client',
//       position: 'Position',
//       content: 'Add a testimonial review here...',
//       rating: 5,
//       project: 'Project Type',
//       date: '2024'
//     };
//     setTempData(prevData => ({
//       ...prevData,
//       testimonials: [...prevData.testimonials, newTestimonial]
//     }));
//   }, []);

//   const removeTestimonial = useCallback((index: number) => {
//     setTempData(prevData => {
//       // if (prevData.testimonials.length <= 1) {
//       //   toast.error("You must have at least one testimonial");
//       //   return prevData;
//       // }

//       const updatedTestimonials = prevData.testimonials.filter((_, i) => i !== index);
//       return { ...prevData, testimonials: updatedTestimonials };
//     });
//   }, []);

//   const updateSection = useCallback((field: keyof Omit<TestimonialsData, 'testimonials'>, value: string) => {
//     setTempData(prevData => ({
//       ...prevData,
//       [field]: value
//     }));
//   }, []);

//   // Safe string splitting for heading
//   const renderHeading = () => {
//     const heading = displayData?.heading ;
//     const words = heading.split(' ');

//     if (words.length > 1) {
//       return (
//         <>
//           {words[0]}{' '}
//           <span className="text-yellow-500">
//             {words.slice(1).join(' ')}
//           </span>
//         </>
//       );
//     }
//     return heading;
//   };

//   return (
//     <section id="testimonials" className="relative text-justify py-20 bg-background">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Edit Controls */}
//         <div className='text-right mb-20'>
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
//                 disabled={isSaving}
//               >
//                 {isSaving ? (
//                   <Loader2 className='w-4 h-4 mr-2 animate-spin' />
//                 ) : (
//                   <Save className='w-4 h-4 mr-2' />
//                 )}
//                 {isSaving ? "Saving..." : "Save"}
//               </Button>
//               <Button
//                 onClick={handleCancel}
//                 size='sm'
//                 className='bg-red-500 hover:bg-red-600 shadow-md text-white'
//                 disabled={isSaving}
//               >
//                 <X className='w-4 h-4 mr-2' />
//                 Cancel
//               </Button>
//               <Button
//                 onClick={addTestimonial}
//                 variant='outline'
//                 size='sm'
//                 className='bg-blue-50 hover:bg-blue-100 text-blue-700 shadow-md'
//               >
//                 <Plus className='w-4 h-4 mr-2' />
//                 Add Testimonial
//               </Button>
//             </div>
//           )}
//         </div>

//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           viewport={{ once: true }}
//           className="text-center mb-16"
//         >
//           {isEditing ? (
//             <>
//               <div className="relative">
//                 <input
//                   type="text"
//                   value={tempData.subtitle || ""}
//                   onChange={(e) => updateSection('subtitle', e.target.value)}
//                   className="text-lg text-yellow-500 mb-2 bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 text-center w-full max-w-md mx-auto"
//                   placeholder="Subtitle"
//                   maxLength={TEXT_LIMITS.SUBTITLE}
//                 />
//                 <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
//                   {tempData.subtitle?.length || 0}/{TEXT_LIMITS.SUBTITLE}
//                 </div>
//               </div>
//               <div className="relative">
//                 <input
//                   type="text"
//                   value={tempData.heading || ""}
//                   onChange={(e) => updateSection('heading', e.target.value)}
//                   className="text-3xl sm:text-4xl text-foreground mb-4 bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 text-center w-full max-w-md mx-auto"
//                   placeholder="Heading"
//                   maxLength={TEXT_LIMITS.HEADING}
//                 />
//                 <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
//                   {tempData.heading?.length || 0}/{TEXT_LIMITS.HEADING}
//                 </div>
//               </div>
//               <div className="relative">
//                 <textarea
//                   value={tempData.description || ""}
//                   onChange={(e) => updateSection('description', e.target.value)}
//                   className="text-lg text-muted-foreground max-w-2xl mx-auto bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 w-full"
//                   rows={2}
//                   placeholder="Description"
//                   maxLength={TEXT_LIMITS.DESCRIPTION}
//                 />
//                 <div className="absolute right-2 bottom-2 text-xs text-gray-500">
//                   {tempData.description?.length || 0}/{TEXT_LIMITS.DESCRIPTION}
//                 </div>
//               </div>
//             </>
//           ) : (
//             <>
//               {data.subtitle && (
//                 <motion.p
//                   initial={{ opacity: 0, y: 20 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.6, delay: 0.2 }}
//                   viewport={{ once: true }}
//                   className="text-lg text-yellow-500 mb-2"
//                 >
//                   {data.subtitle}
//                 </motion.p>
//               )}
//               <motion.h2
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6, delay: 0.4 }}
//                 viewport={{ once: true }}
//                 className="text-3xl sm:text-4xl text-foreground mb-4"
//               >
//                 {renderHeading()}
//               </motion.h2>
//               {data.description && (
//                 <motion.p
//                   initial={{ opacity: 0, y: 20 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.6, delay: 0.6 }}
//                   viewport={{ once: true }}
//                   className="text-lg text-muted-foreground max-w-2xl mx-auto"
//                 >
//                   {data.description}
//                 </motion.p>
//               )}
//             </>
//           )}
//         </motion.div>

//         {/* Testimonials Grid */}
//         {displayData.testimonials.length > 0 ? (
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {displayData.testimonials.map((testimonial, index) => (
//               <motion.div
//                 key={testimonial.id}
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6, delay: index * 0.1 }}
//                 viewport={{ once: true }}
//                 whileHover={{ scale: 1.05 }}
//                 className="bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 relative flex flex-col min-h-[400px]"
//               >
//                 {isEditing && (
//                   <Button
//                     onClick={() => removeTestimonial(index)}
//                     size='sm'
//                     variant='outline'
//                     className='absolute top-2 right-2 bg-red-50 hover:bg-red-100 text-red-700 p-1 z-10'
//                   >
//                     <Trash2 className='w-3 h-3' />
//                   </Button>
//                 )}

//                 {/* Quote Icon */}
//                 <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mb-4">
//                   <Quote className="w-6 h-6 text-gray-900" />
//                 </div>

//                 {/* Stars */}
//                 <div className="flex space-x-1 mb-4">
//                   {[...Array(5)].map((_, i) => (
//                     <button
//                       key={i}
//                       onClick={() => isEditing && updateRating(index, i + 1)}
//                       className={isEditing ? "cursor-pointer" : "cursor-default"}
//                     >
//                       <Star
//                         className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
//                       />
//                     </button>
//                   ))}
//                 </div>

//                 {/* Review - Fixed height with scroll if needed */}
//                 <div className="flex-1 mb-6 min-h-[120px] max-h-[120px] overflow-y-auto">
//                   {isEditing ? (
//                     <div className="relative h-full">
//                       <textarea
//                         value={testimonial.content}
//                         onChange={(e) => updateTestimonial(index, 'content', e.target.value)}
//                         className="text-muted-foreground leading-relaxed w-full h-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 resize-none"
//                         maxLength={TEXT_LIMITS.TESTIMONIAL_CONTENT}
//                       />
//                       <div className="absolute right-2 bottom-2 text-xs text-gray-500">
//                         {testimonial.content.length}/{TEXT_LIMITS.TESTIMONIAL_CONTENT}
//                       </div>
//                     </div>
//                   ) : (
//                     <p className="text-muted-foreground leading-relaxed">
//                       "{testimonial.content}"
//                     </p>
//                   )}
//                 </div>

//                 {/* Project and Date */}
//                 {isEditing ? (
//                   <div className="mb-4 space-y-2">
//                     <div className="relative">
//                       <input
//                         type="text"
//                         value={testimonial.project}
//                         onChange={(e) => updateTestimonial(index, 'project', e.target.value)}
//                         className="text-sm text-yellow-500 w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1"
//                         placeholder="Project type"
//                         maxLength={TEXT_LIMITS.PROJECT}
//                       />
//                       <div className="absolute right-1 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
//                         {testimonial.project.length}/{TEXT_LIMITS.PROJECT}
//                       </div>
//                     </div>
//                     <div className="relative">
//                       <input
//                         type="text"
//                         value={testimonial.date}
//                         onChange={(e) => updateTestimonial(index, 'date', e.target.value)}
//                         className="text-sm text-gray-500 w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1"
//                         placeholder="Date"
//                         maxLength={TEXT_LIMITS.DATE}
//                       />
//                       <div className="absolute right-1 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
//                         {testimonial.date.length}/{TEXT_LIMITS.DATE}
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="mb-4">
//                     <p className="text-sm text-yellow-500">{testimonial.project}</p>
//                     <p className="text-sm text-gray-500">{testimonial.date}</p>
//                   </div>
//                 )}

//                 {/* Client Info - Fixed at bottom */}
//                 <div className="flex items-center space-x-4 mt-auto pt-4 border-t border-gray-200">
//                   <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center flex-shrink-0">
//                     <span className="text-gray-900 text-lg">
//                       {testimonial.name.charAt(0)}
//                     </span>
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     {isEditing ? (
//                       <>
//                         <div className="relative mb-1">
//                           <input
//                             type="text"
//                             value={testimonial.name}
//                             onChange={(e) => updateTestimonial(index, 'name', e.target.value)}
//                             className="text-foreground w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1 truncate"
//                             placeholder="Client name"
//                             maxLength={TEXT_LIMITS.CLIENT_NAME}
//                           />
//                           <div className="absolute right-1 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
//                             {testimonial.name.length}/{TEXT_LIMITS.CLIENT_NAME}
//                           </div>
//                         </div>
//                         <div className="relative">
//                           <input
//                             type="text"
//                             value={testimonial.position}
//                             onChange={(e) => updateTestimonial(index, 'position', e.target.value)}
//                             className="text-sm text-muted-foreground w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1 truncate"
//                             placeholder="Position"
//                             maxLength={TEXT_LIMITS.CLIENT_POSITION}
//                           />
//                           <div className="absolute right-1 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
//                             {testimonial.position.length}/{TEXT_LIMITS.CLIENT_POSITION}
//                           </div>
//                         </div>
//                       </>
//                     ) : (
//                       <>
//                         <h4 className="text-foreground mb-1 truncate">{testimonial.name}</h4>
//                         <p className="text-sm text-muted-foreground truncate">{testimonial.position}</p>
//                       </>
//                     )}
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         ) : (
//           isEditing && (
//             <div className="text-center py-12">
//               <p className="text-muted-foreground text-lg">No testimonials to display. Click "addTestimonial" to add testimonials.</p>
//             </div>
//           )
//         )}
//       </div>
//     </section>
//   );
// }

import {
  Edit2,
  Loader2,
  Plus,
  Quote,
  Save,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// Text limits
const TEXT_LIMITS = {
  SUBTITLE: 100,
  HEADING: 60,
  DESCRIPTION: 300,
  TESTIMONIAL_CONTENT: 500,
  CLIENT_NAME: 40,
  CLIENT_POSITION: 40,
  PROJECT: 30,
  DATE: 20,
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

// Define types for Testimonial data based on your JSON
interface Testimonial {
  id: number;
  name: string;
  position: string;
  content: string;
  rating: number;
  project: string;
  date: string;
}

interface TestimonialsData {
  subtitle: string;
  heading: string;
  description: string;
  testimonials: Testimonial[];
}

// Props interface
interface TestimonialsProps {
  testimonialsData?: TestimonialsData;
  onStateChange?: (data: TestimonialsData) => void;
}

export function Testimonials({
  testimonialsData,
  onStateChange,
}: TestimonialsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Auto-save states
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();
  const lastSavedDataRef = useRef<TestimonialsData | null>(null);

  // Ref for onStateChange to prevent infinite loops
  const onStateChangeRef = useRef(onStateChange);
  useEffect(() => {
    onStateChangeRef.current = onStateChange;
  }, [onStateChange]);

  // Initialize with props data or empty structure
  const [data, setData] = useState<TestimonialsData>(
    testimonialsData || {
      subtitle: "",
      heading: "",
      description: "",
      testimonials: [],
    }
  );

  const [tempData, setTempData] = useState<TestimonialsData>(
    testimonialsData || {
      subtitle: "",
      heading: "",
      description: "",
      testimonials: [],
    }
  );

  // Auto-save functionality
  const performAutoSave = useCallback(async (dataToSave: TestimonialsData) => {
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
    (updatedData: TestimonialsData) => {
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
    if (testimonialsData) {
      setData(testimonialsData);
      setTempData(testimonialsData);
      lastSavedDataRef.current = testimonialsData;
    }
  }, [testimonialsData]);

  const handleEdit = () => {
    setIsEditing(true);
    setTempData({ ...data });
    setHasUnsavedChanges(false);
  };

  // Save function
  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Clear any pending auto-save
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      // Simulate save API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update data state
      setData(tempData);
      lastSavedDataRef.current = tempData;
      setIsEditing(false);
      setHasUnsavedChanges(false);

      if (onStateChangeRef.current) {
        onStateChangeRef.current(tempData);
      }

      toast.success("Testimonials section saved successfully");
    } catch (error) {
      console.error("Error saving testimonials section:", error);
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

  // Stable update functions with useCallback - Modified to include auto-save
  const updateTestimonial = useCallback(
    (index: number, field: keyof Testimonial, value: any) => {
      setTempData((prevData) => {
        const updatedTestimonials = [...prevData.testimonials];
        updatedTestimonials[index] = {
          ...updatedTestimonials[index],
          [field]: value,
        };
        const updated = { ...prevData, testimonials: updatedTestimonials };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  const updateRating = useCallback(
    (index: number, rating: number) => {
      setTempData((prevData) => {
        const updatedTestimonials = [...prevData.testimonials];
        updatedTestimonials[index] = { ...updatedTestimonials[index], rating };
        const updated = { ...prevData, testimonials: updatedTestimonials };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  const addTestimonial = useCallback(() => {
    const newTestimonial: Testimonial = {
      id: Date.now(),
      name: "New Client",
      position: "Position",
      content: "Add a testimonial review here...",
      rating: 5,
      project: "Project Type",
      date: "2024",
    };
    setTempData((prevData) => {
      const updated = {
        ...prevData,
        testimonials: [...prevData.testimonials, newTestimonial],
      };
      scheduleAutoSave(updated);
      return updated;
    });
  }, [scheduleAutoSave]);

  const removeTestimonial = useCallback(
    (index: number) => {
      setTempData((prevData) => {
        const updatedTestimonials = prevData.testimonials.filter(
          (_, i) => i !== index
        );
        const updated = { ...prevData, testimonials: updatedTestimonials };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  const updateSection = useCallback(
    (field: keyof Omit<TestimonialsData, "testimonials">, value: string) => {
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

  // Safe string splitting for heading
  const renderHeading = () => {
    const heading = data?.heading || "";
    const words = heading.split(" ");

    if (words.length > 1) {
      return (
        <>
          {words[0]}{" "}
          <span className="text-yellow-500">{words.slice(1).join(" ")}</span>
        </>
      );
    }
    return heading;
  };

  // Calculate displayData based on editing state
  const displayData = isEditing ? tempData : data;

  return (
    <section
      id="testimonials"
      className="relative text-justify py-20 bg-background"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Edit Controls */}
        <div className="text-right mb-20">
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
              {/* Auto-save indicator */}
              <div className="flex items-center gap-2 text-sm mr-4">
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
                disabled={isSaving}
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
                disabled={isSaving}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={addTestimonial}
                variant="outline"
                size="sm"
                className="bg-blue-50 hover:bg-blue-100 text-blue-700 shadow-md"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Testimonial
              </Button>
            </div>
          )}
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          {isEditing ? (
            <>
              <div className="relative">
                <input
                  type="text"
                  value={tempData.subtitle || ""}
                  onChange={(e) => updateSection("subtitle", e.target.value)}
                  className="text-lg text-yellow-500 mb-2 bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 text-center w-full max-w-md mx-auto"
                  placeholder="Subtitle"
                  maxLength={TEXT_LIMITS.SUBTITLE}
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                  {tempData.subtitle?.length || 0}/{TEXT_LIMITS.SUBTITLE}
                </div>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={tempData.heading || ""}
                  onChange={(e) => updateSection("heading", e.target.value)}
                  className="text-3xl sm:text-4xl text-foreground mb-4 bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 text-center w-full max-w-md mx-auto"
                  placeholder="Heading"
                  maxLength={TEXT_LIMITS.HEADING}
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                  {tempData.heading?.length || 0}/{TEXT_LIMITS.HEADING}
                </div>
              </div>
              <div className="relative">
                <textarea
                  value={tempData.description || ""}
                  onChange={(e) => updateSection("description", e.target.value)}
                  className="text-lg text-muted-foreground max-w-2xl mx-auto bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 w-full"
                  rows={2}
                  placeholder="Description"
                  maxLength={TEXT_LIMITS.DESCRIPTION}
                />
                <div className="absolute right-2 bottom-2 text-xs text-gray-500">
                  {tempData.description?.length || 0}/{TEXT_LIMITS.DESCRIPTION}
                </div>
              </div>
            </>
          ) : (
            <>
              {data.subtitle && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="text-lg text-yellow-500 mb-2"
                >
                  {data.subtitle}
                </motion.p>
              )}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl text-foreground mb-4 max-w-2xl mx-auto text-justify"
              >
                {renderHeading()}
              </motion.h2>
              {data.description && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  viewport={{ once: true }}
                  className="text-lg text-muted-foreground max-w-2xl mx-auto text-justify"
                >
                  {data.description}
                </motion.p>
              )}
            </>
          )}
        </motion.div>

        {/* Testimonials Grid */}
        {displayData.testimonials.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayData.testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 relative flex flex-col min-h-[400px]"
              >
                {isEditing && (
                  <Button
                    onClick={() => removeTestimonial(index)}
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2 bg-red-50 hover:bg-red-100 text-red-700 p-1 z-10"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}

                {/* Quote Icon */}
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mb-4">
                  <Quote className="w-6 h-6 text-gray-900" />
                </div>

                {/* Stars */}
                <div className="flex space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => isEditing && updateRating(index, i + 1)}
                      className={
                        isEditing ? "cursor-pointer" : "cursor-default"
                      }
                    >
                      <Star
                        className={`w-5 h-5 ${
                          i < testimonial.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                {/* Review - Fixed height with scroll if needed */}
                <div className="flex-1 mb-6 min-h-[120px] max-h-[120px] overflow-y-auto">
                  {isEditing ? (
                    <div className="relative h-full">
                      <textarea
                        value={testimonial.content}
                        onChange={(e) =>
                          updateTestimonial(index, "content", e.target.value)
                        }
                        className="text-muted-foreground leading-relaxed w-full h-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 resize-none"
                        maxLength={TEXT_LIMITS.TESTIMONIAL_CONTENT}
                      />
                      <div className="absolute right-2 bottom-2 text-xs text-gray-500">
                        {testimonial.content.length}/
                        {TEXT_LIMITS.TESTIMONIAL_CONTENT}
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground leading-relaxed">
                      "{testimonial.content}"
                    </p>
                  )}
                </div>

                {/* Project and Date */}
                {isEditing ? (
                  <div className="mb-4 space-y-2">
                    <div className="relative">
                      <input
                        type="text"
                        value={testimonial.project}
                        onChange={(e) =>
                          updateTestimonial(index, "project", e.target.value)
                        }
                        className="text-sm text-yellow-500 w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1"
                        placeholder="Project type"
                        maxLength={TEXT_LIMITS.PROJECT}
                      />
                      <div className="absolute right-1 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                        {testimonial.project.length}/{TEXT_LIMITS.PROJECT}
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={testimonial.date}
                        onChange={(e) =>
                          updateTestimonial(index, "date", e.target.value)
                        }
                        className="text-sm text-gray-500 w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1"
                        placeholder="Date"
                        maxLength={TEXT_LIMITS.DATE}
                      />
                      <div className="absolute right-1 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                        {testimonial.date.length}/{TEXT_LIMITS.DATE}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mb-4">
                    <p className="text-sm text-yellow-500">
                      {testimonial.project}
                    </p>
                    <p className="text-sm text-gray-500">{testimonial.date}</p>
                  </div>
                )}

                {/* Client Info - Fixed at bottom */}
                <div className="flex items-center space-x-4 mt-auto pt-4 border-t border-gray-200">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-900 text-lg">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    {isEditing ? (
                      <>
                        <div className="relative mb-1">
                          <input
                            type="text"
                            value={testimonial.name}
                            onChange={(e) =>
                              updateTestimonial(index, "name", e.target.value)
                            }
                            className="text-foreground w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1 truncate"
                            placeholder="Client name"
                            maxLength={TEXT_LIMITS.CLIENT_NAME}
                          />
                          <div className="absolute right-1 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                            {testimonial.name.length}/{TEXT_LIMITS.CLIENT_NAME}
                          </div>
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            value={testimonial.position}
                            onChange={(e) =>
                              updateTestimonial(
                                index,
                                "position",
                                e.target.value
                              )
                            }
                            className="text-sm text-muted-foreground w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1 truncate"
                            placeholder="Position"
                            maxLength={TEXT_LIMITS.CLIENT_POSITION}
                          />
                          <div className="absolute right-1 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                            {testimonial.position.length}/
                            {TEXT_LIMITS.CLIENT_POSITION}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <h4 className="text-foreground mb-1 truncate">
                          {testimonial.name}
                        </h4>
                        <p className="text-sm text-muted-foreground truncate">
                          {testimonial.position}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          isEditing && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No testimonials to display. Click "Add Testimonial" to add
                testimonials.
              </p>
            </div>
          )
        )}
      </div>
    </section>
  );
}
