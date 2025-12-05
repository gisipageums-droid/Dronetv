// import { Code, Database, Cloud, Edit2, Globe, Loader2, Plus, Save, Smartphone, Trash2, X, Zap } from 'lucide-react';
// import { motion } from 'motion/react';
// import { useCallback, useEffect, useRef, useState } from 'react';
// import { toast } from 'sonner';

// // Import your static skill images
// import skill1 from '../../../../../../Images/skill1.png';
// import skill2 from '../../../../../../Images/skill2.png';
// import skill3 from '../../../../../../Images/skill3.jpeg';
// import skill4 from '../../../../../../Images/skill4.png';
// import skill5 from '../../../../../../Images/skill5.jpeg';

// // Text limits
// const TEXT_LIMITS = {
//   HEADER_TITLE: 60,
//   HEADER_SUBTITLE: 200,
//   SKILL_TITLE: 40,
//   SKILL_DESCRIPTION: 200,
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
//   variant?: 'outline' | 'default' | 'danger';
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
//     danger: "bg-red-600 text-white hover:bg-red-700"
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

// interface Skill {
//   id: string;
//   icon?: any;
//   title: string;
//   description: string;
//   level: number;
// }

// interface SkillsData {
//   skills: Skill[];
//   header: {
//     title: string;
//     subtitle: string;
//   };
// }

// interface SkillsProps {
//   skillsData?: SkillsData;
//   onStateChange?: (data: SkillsData) => void;
//   userId?: string;
//   professionalId?: string;
//   templateSelection?: string;
// }

// export function Skills({ skillsData, onStateChange }: SkillsProps) {
//   const [isEditing, setIsEditing] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [dataLoaded, setDataLoaded] = useState(false);
//   const [isVisible, setIsVisible] = useState(false);
//   const skillsRef = useRef<HTMLDivElement>(null);

//   // Auto-save states
//   const [isAutoSaving, setIsAutoSaving] = useState(false);
//   const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
//   const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);
//   const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();

//   // Array of imported skill images
//   const skillImages = [skill1, skill2, skill3, skill4, skill5];

//   // Initialize with skillsData or empty structure
//   const [data, setData] = useState<SkillsData>(() =>
//     skillsData || {
//       skills: [],
//       header: {
//         title: "My Skills",
//         subtitle: "A comprehensive set of technical skills and expertise built through years of hands-on experience and continuous learning."
//       }
//     }
//   );

//   const [tempData, setTempData] = useState<SkillsData>(() =>
//     skillsData || {
//       skills: [],
//       header: {
//         title: "My Skills",
//         subtitle: "A comprehensive set of technical skills and expertise built through years of hands-on experience and continuous learning."
//       }
//     }
//   );

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

//   // Modified icon rendering logic - using static images
//   const renderSkillIcon = (skill: Skill, index: number) => {
//     // Use modulo to cycle through images if there are more skills than images
//     const imageIndex = index % skillImages.length;
//     const imageSrc = skillImages[imageIndex];

//     return (
//       <div className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden border-2 border-yellow-400">
//         <img
//           src={imageSrc}
//           alt={skill.title}
//           className="w-full h-full object-cover"
//         />
//       </div>
//     );
//   };

//   // Notify parent of state changes
//   useEffect(() => {
//     if (onStateChange) {
//       onStateChange(data);
//     }
//   }, [data]);

//   // Update data when skillsData prop changes
//   useEffect(() => {
//     if (skillsData) {
//       setData(skillsData);
//       setTempData(skillsData);
//       setDataLoaded(true);
//     }
//   }, [skillsData]);

//   // Intersection observer
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => setIsVisible(entry.isIntersecting),
//       { threshold: 0.1 }
//     );
//     if (skillsRef.current) observer.observe(skillsRef.current);
//     return () => {
//       if (skillsRef.current) observer.unobserve(skillsRef.current);
//     };
//   }, []);

//   // Fake API fetch - simplified since we're using props
//   const fetchSkillsData = async () => {
//     if (skillsData) {
//       // If skillsData is provided via props, use it directly
//       setData(skillsData);
//       setTempData(skillsData);
//       setDataLoaded(true);
//     } else {
//       // Only show loading if no data is provided
//       setIsLoading(true);
//       try {
//         // Simulate API call delay
//         await new Promise(resolve => setTimeout(resolve, 800));
//         // If no skillsData provided, keep the empty/default state
//         setDataLoaded(true);
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   };

//   useEffect(() => {
//     if (isVisible && !dataLoaded && !isLoading) {
//       fetchSkillsData();
//     }
//   }, [isVisible, dataLoaded, isLoading, skillsData]);

//   const handleEdit = () => {
//     setIsEditing(true);
//     setTempData({ ...data });
//     setHasUnsavedChanges(false);
//   };

//   const handleSave = async () => {
//     try {
//       setIsSaving(true);

//       // Update data state
//       setData(tempData);
//       setHasUnsavedChanges(false);
//       setLastSavedTime(new Date());

//       setIsEditing(false);
//       toast.success('Skills section saved successfully');

//     } catch (error) {
//       console.error('Error saving skills section:', error);
//       toast.error('Error saving changes. Please try again.');
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleCancel = () => {
//     setTempData({ ...data });
//     setHasUnsavedChanges(false);
//     setIsEditing(false);

//     // Clear any pending auto-save
//     if (autoSaveTimeoutRef.current) {
//       clearTimeout(autoSaveTimeoutRef.current);
//     }
//   };

//   // Stable update functions with useCallback and auto-save scheduling
//   const updateSkill = useCallback((index: number, field: keyof Skill, value: any) => {
//     const updatedSkills = [...tempData.skills];
//     updatedSkills[index] = { ...updatedSkills[index], [field]: value };
//     setTempData({ ...tempData, skills: updatedSkills });
//     scheduleAutoSave();
//   }, [tempData, scheduleAutoSave]);

//   const updateHeader = useCallback((field: keyof SkillsData['header'], value: string) => {
//     setTempData(prev => ({
//       ...prev,
//       header: { ...prev.header, [field]: value }
//     }));
//     scheduleAutoSave();
//   }, [scheduleAutoSave]);

//   const addSkill = useCallback(() => {
//     const newSkill: Skill = {
//       id: Date.now().toString(),
//       title: "New Skill",
//       description: "Skill description",
//       level: 50
//     };
//     setTempData({
//       ...tempData,
//       skills: [...tempData.skills, newSkill]
//     });
//     scheduleAutoSave();
//   }, [tempData, scheduleAutoSave]);

//   const removeSkill = useCallback((index: number) => {
//     const updatedSkills = tempData.skills.filter((_, i) => i !== index);
//     setTempData({ ...tempData, skills: updatedSkills });
//     scheduleAutoSave();
//   }, [tempData, scheduleAutoSave]);

//   const displayData = isEditing ? tempData : data;

//   // Loading state - only show if we're actually loading and have no data
//   if ((isLoading && !dataLoaded) || (!dataLoaded && displayData.skills.length === 0)) {
//     return (
//       <section ref={skillsRef} id="skills" className="py-20 bg-yellow-50 dark:bg-yellow-900/20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <Loader2 className="w-8 h-8 animate-spin mx-auto text-yellow-500" />
//           <p className="text-muted-foreground mt-4">Loading skills data...</p>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section ref={skillsRef} id="skills" className="py-20 bg-yellow-50 dark:bg-yellow-900/20">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Edit Controls with Auto-save Status */}
//         <div className='text-right mb-8'>
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
//               className='bg-red-500 hover:bg-red-600 shadow-md'
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
//                 variant='danger'
//                 size='sm'
//                 className='bg-red-600 hover:bg-red-700 text-white shadow-md'
//                 disabled={isSaving}
//               >
//                 <X className='w-4 h-4 mr-2' />
//                 Cancel
//               </Button>
//               <Button
//                 onClick={addSkill}
//                 variant='outline'
//                 size='sm'
//                 className='bg-blue-50 hover:bg-blue-100 text-blue-700 shadow-md'
//               >
//                 <Plus className='w-4 h-4 mr-2' />
//                 Add Skill
//               </Button>
//             </div>
//           )}
//         </div>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           viewport={{ once: true }}
//           className="text-center mb-16 "
//         >
//           {isEditing ? (
//             <>
//               <div className="relative">
//                 <input
//                   type="text"
//                   value={displayData.header.title}
//                   onChange={(e) => updateHeader('title', e.target.value)}
//                   className="text-3xl sm:text-4xl text-foreground mb-4 bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 text-center w-full max-w-md mx-auto"
//                   maxLength={TEXT_LIMITS.HEADER_TITLE}
//                 />
//                 <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
//                   {displayData.header.title.length}/{TEXT_LIMITS.HEADER_TITLE}
//                 </div>
//               </div>
//               <div className="relative">
//                 <textarea
//                   value={displayData.header.subtitle}
//                   onChange={(e) => updateHeader('subtitle', e.target.value)}
//                   className="text-lg text-muted-foreground max-w-2xl mx-auto bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 w-full"
//                   rows={2}
//                   maxLength={TEXT_LIMITS.HEADER_SUBTITLE}
//                 />
//                 <div className="absolute right-2 bottom-2 text-xs text-gray-500">
//                   {displayData.header.subtitle.length}/{TEXT_LIMITS.HEADER_SUBTITLE}
//                 </div>
//               </div>
//             </>
//           ) : (
//             <>
//               <h2 className="text-3xl sm:text-4xl text-foreground mb-4">
//                 {displayData.header.title}
//               </h2>
//               <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
//                 {displayData.header.subtitle}
//               </p>
//             </>
//           )}
//         </motion.div>

//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {displayData.skills.map((skill, index) => (
//             <motion.div
//               key={skill.id}
//               initial={{ opacity: 0, y: 50 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: index * 0.1 }}
//               viewport={{ once: true }}
//               whileHover={{ y: -10 }}
//               className="bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 relative"
//             >
//               {isEditing && (
//                 <Button
//                   onClick={() => removeSkill(index)}
//                   size='sm'
//                   variant='danger'
//                   className='absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white p-1'
//                 >
//                   <Trash2 className='w-3 h-3' />
//                 </Button>
//               )}

//               {/* Icon Display */}
//               <motion.div
//                 whileHover={{ scale: 1.1 }}
//                 transition={{ duration: 0.5 }}
//                 className="flex items-center justify-center mb-4"
//               >
//                 {renderSkillIcon(skill, index)}
//               </motion.div>

//               {isEditing ? (
//                 <>
//                   <div className="relative mb-2">
//                     <input
//                       type="text"
//                       value={skill.title}
//                       onChange={(e) => updateSkill(index, 'title', e.target.value)}
//                       className="text-xl text-foreground bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1 w-full"
//                       maxLength={TEXT_LIMITS.SKILL_TITLE}
//                     />
//                     <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
//                       {skill.title.length}/{TEXT_LIMITS.SKILL_TITLE}
//                     </div>
//                   </div>
//                   <div className="relative mb-4">
//                     <textarea
//                       value={skill.description}
//                       onChange={(e) => updateSkill(index, 'description', e.target.value)}
//                       className="text-muted-foreground bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1 w-full"
//                       rows={2}
//                       maxLength={TEXT_LIMITS.SKILL_DESCRIPTION}
//                     />
//                     <div className="absolute right-2 bottom-2 text-xs text-gray-500">
//                       {skill.description.length}/{TEXT_LIMITS.SKILL_DESCRIPTION}
//                     </div>
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <h3 className="text-xl text-foreground mb-2">{skill.title}</h3>
//                   <p className="text-muted-foreground mb-4 text-justify">{skill.description}</p>
//                 </>
//               )}

//               {/* Progress Bar */}
//               <div className="relative">
//                 <div className="flex justify-between text-sm text-muted-foreground mb-2">
//                   <span>Proficiency</span>
//                   {isEditing ? (
//                     <input
//                       type="number"
//                       value={skill.level}
//                       onChange={(e) => updateSkill(index, 'level', parseInt(e.target.value))}
//                       className="w-16 bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1 text-right"
//                       min="0"
//                       max="100"
//                     />
//                   ) : (
//                     <span>{skill.level}%</span>
//                   )}
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-2">
//                   <motion.div
//                     initial={{ width: 0 }}
//                     whileInView={{ width: `${skill.level}%` }}
//                     transition={{ duration: 1, delay: index * 0.1 }}
//                     viewport={{ once: true }}
//                     className="bg-yellow-400 h-2 rounded-full"
//                   />
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

import {
  Code,
  Database,
  Cloud,
  Edit2,
  Globe,
  Loader2,
  Plus,
  Save,
  Smartphone,
  Trash2,
  X,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// Import your static skill images
import skill1 from "../../../../../../Images/skill1.png";
import skill2 from "../../../../../../Images/skill2.png";
import skill3 from "../../../../../../Images/skill3.jpeg";
import skill4 from "../../../../../../Images/skill4.png";
import skill5 from "../../../../../../Images/skill5.jpeg";

// Text limits
const TEXT_LIMITS = {
  HEADER_TITLE: 60,
  HEADER_SUBTITLE: 200,
  SKILL_TITLE: 40,
  SKILL_DESCRIPTION: 200,
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
  variant?: "outline" | "default" | "danger";
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
    danger: "bg-red-600 text-white hover:bg-red-700",
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

interface Skill {
  id: string;
  icon?: any;
  title: string;
  description: string;
  level: number;
}

interface SkillsData {
  skills: Skill[];
  header: {
    title: string;
    subtitle: string;
  };
}

interface SkillsProps {
  skillsData?: SkillsData;
  onStateChange?: (data: SkillsData) => void;
  userId?: string;
  professionalId?: string;
  templateSelection?: string;
}

export function Skills({ skillsData, onStateChange }: SkillsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const skillsRef = useRef<HTMLDivElement>(null);

  // Auto-save states - Added from Hero.tsx
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();
  const lastSavedDataRef = useRef<SkillsData | null>(null);

  // FIX: Use ref for onStateChange to prevent infinite loops
  const onStateChangeRef = useRef(onStateChange);
  useEffect(() => {
    onStateChangeRef.current = onStateChange;
  }, [onStateChange]);

  // Array of imported skill images
  const skillImages = [skill1, skill2, skill3, skill4, skill5];

  // Initialize with skillsData or empty structure
  const [data, setData] = useState<SkillsData>(
    () =>
      skillsData || {
        skills: [],
        header: {
          title: "My Skills",
          subtitle:
            "A comprehensive set of technical skills and expertise built through years of hands-on experience and continuous learning.",
        },
      }
  );

  const [tempData, setTempData] = useState<SkillsData>(
    () =>
      skillsData || {
        skills: [],
        header: {
          title: "My Skills",
          subtitle:
            "A comprehensive set of technical skills and expertise built through years of hands-on experience and continuous learning.",
        },
      }
  );

  // Auto-save functionality - Added from Hero.tsx
  const performAutoSave = useCallback(async (dataToSave: SkillsData) => {
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
    (updatedData: SkillsData) => {
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

  // Modified icon rendering logic - using static images
  const renderSkillIcon = (skill: Skill, index: number) => {
    // Use modulo to cycle through images if there are more skills than images
    const imageIndex = index % skillImages.length;
    const imageSrc = skillImages[imageIndex];

    return (
      <div className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden border-2 border-yellow-400">
        <img
          src={imageSrc}
          alt={skill.title}
          className="w-full h-full object-cover"
        />
      </div>
    );
  };

  // Notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(data);
    }
  }, [data]);

  // Update data when skillsData prop changes
  useEffect(() => {
    if (skillsData) {
      setData(skillsData);
      setTempData(skillsData);
      lastSavedDataRef.current = skillsData;
      setDataLoaded(true);
    }
  }, [skillsData]);

  // Intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (skillsRef.current) observer.observe(skillsRef.current);
    return () => {
      if (skillsRef.current) observer.unobserve(skillsRef.current);
    };
  }, []);

  // Fake API fetch - simplified since we're using props
  const fetchSkillsData = async () => {
    if (skillsData) {
      // If skillsData is provided via props, use it directly
      setData(skillsData);
      setTempData(skillsData);
      lastSavedDataRef.current = skillsData;
      setDataLoaded(true);
    } else {
      // Only show loading if no data is provided
      setIsLoading(true);
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        // If no skillsData provided, keep the empty/default state
        setDataLoaded(true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (isVisible && !dataLoaded && !isLoading) {
      fetchSkillsData();
    }
  }, [isVisible, dataLoaded, isLoading, skillsData]);

  const handleEdit = () => {
    setIsEditing(true);
    setTempData({ ...data });
    setHasUnsavedChanges(false);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Clear any pending auto-save
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setData(tempData);
      lastSavedDataRef.current = tempData;
      setIsEditing(false);
      setHasUnsavedChanges(false);

      if (onStateChangeRef.current) {
        onStateChangeRef.current(tempData);
      }

      toast.success("Skills section saved successfully!");
    } catch (error) {
      console.error("Error saving skills section:", error);
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
  const updateSkill = useCallback(
    (index: number, field: keyof Skill, value: any) => {
      setTempData((prev) => {
        const updatedSkills = [...prev.skills];
        updatedSkills[index] = { ...updatedSkills[index], [field]: value };
        const updated = { ...prev, skills: updatedSkills };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  const updateHeader = useCallback(
    (field: keyof SkillsData["header"], value: string) => {
      setTempData((prev) => {
        const updated = {
          ...prev,
          header: { ...prev.header, [field]: value },
        };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  const addSkill = useCallback(() => {
    setTempData((prev) => {
      const newSkill: Skill = {
        id: Date.now().toString(),
        title: "New Skill",
        description: "Skill description",
        level: 50,
      };
      const updated = {
        ...prev,
        skills: [...prev.skills, newSkill],
      };
      scheduleAutoSave(updated);
      return updated;
    });
  }, [scheduleAutoSave]);

  const removeSkill = useCallback(
    (index: number) => {
      setTempData((prev) => {
        const updatedSkills = prev.skills.filter((_, i) => i !== index);
        const updated = { ...prev, skills: updatedSkills };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  const displayData = isEditing ? tempData : data;

  // Loading state - only show if we're actually loading and have no data
  if (
    (isLoading && !dataLoaded) ||
    (!dataLoaded && displayData.skills.length === 0)
  ) {
    return (
      <section
        ref={skillsRef}
        id="skills"
        className="py-20 bg-yellow-50 dark:bg-yellow-900/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-yellow-500" />
          <p className="text-muted-foreground mt-4">Loading skills data...</p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={skillsRef}
      id="skills"
      className="py-20 bg-yellow-50 dark:bg-yellow-900/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Edit Controls with Auto-save Status */}
        <div className="text-right mb-8">
          {/* Auto-save Status - Updated to match Hero.tsx */}
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
              className="bg-red-500 hover:bg-red-600 shadow-md"
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
                variant="danger"
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white shadow-md"
                disabled={isSaving}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={addSkill}
                variant="outline"
                size="sm"
                className="bg-blue-50 hover:bg-blue-100 text-blue-700 shadow-md"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Skill
              </Button>
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16 "
        >
          {isEditing ? (
            <>
              <div className="relative">
                <input
                  type="text"
                  value={displayData.header.title}
                  onChange={(e) => updateHeader("title", e.target.value)}
                  className="text-3xl sm:text-4xl text-foreground mb-4 bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 text-center w-full max-w-md mx-auto"
                  maxLength={TEXT_LIMITS.HEADER_TITLE}
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                  {displayData.header.title.length}/{TEXT_LIMITS.HEADER_TITLE}
                </div>
              </div>
              <div className="relative">
                <textarea
                  value={displayData.header.subtitle}
                  onChange={(e) => updateHeader("subtitle", e.target.value)}
                  className="text-lg text-muted-foreground max-w-2xl mx-auto bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 w-full"
                  rows={2}
                  maxLength={TEXT_LIMITS.HEADER_SUBTITLE}
                />
                <div className="absolute right-2 bottom-2 text-xs text-gray-500">
                  {displayData.header.subtitle.length}/
                  {TEXT_LIMITS.HEADER_SUBTITLE}
                </div>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-3xl sm:text-4xl text-foreground mb-4">
                {displayData.header.title}
              </h2>
              <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto">
                {displayData.header.subtitle}
              </p>
            </>
          )}
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayData.skills.map((skill, index) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 relative"
            >
              {isEditing && (
                <Button
                  onClick={() => removeSkill(index)}
                  size="sm"
                  variant="danger"
                  className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white p-1"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              )}

              {/* Icon Display */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-center mb-4"
              >
                {renderSkillIcon(skill, index)}
              </motion.div>

              {isEditing ? (
                <>
                  <div className="relative mb-2">
                    <input
                      type="text"
                      value={skill.title}
                      onChange={(e) =>
                        updateSkill(index, "title", e.target.value)
                      }
                      className="text-xl text-foreground bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1 w-full"
                      maxLength={TEXT_LIMITS.SKILL_TITLE}
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                      {skill.title.length}/{TEXT_LIMITS.SKILL_TITLE}
                    </div>
                  </div>
                  <div className="relative mb-4">
                    <textarea
                      value={skill.description}
                      onChange={(e) =>
                        updateSkill(index, "description", e.target.value)
                      }
                      className="text-muted-foreground bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1 w-full"
                      rows={2}
                      maxLength={TEXT_LIMITS.SKILL_DESCRIPTION}
                    />
                    <div className="absolute right-2 bottom-2 text-xs text-gray-500">
                      {skill.description.length}/{TEXT_LIMITS.SKILL_DESCRIPTION}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-xl text-foreground mb-2">
                    {skill.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 text-justify">
                    {skill.description}
                  </p>
                </>
              )}

              {/* Progress Bar */}
              <div className="relative">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Proficiency</span>
                  {isEditing ? (
                    <input
                      type="number"
                      value={skill.level}
                      onChange={(e) =>
                        updateSkill(index, "level", parseInt(e.target.value))
                      }
                      className="w-16 bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1 text-right"
                      min="0"
                      max="100"
                    />
                  ) : (
                    <span>{skill.level}%</span>
                  )}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-yellow-400 h-2 rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
