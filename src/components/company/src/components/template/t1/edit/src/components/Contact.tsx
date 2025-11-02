// import { useState, useEffect } from "react";
// import { motion } from "motion/react";
// import { Input } from "../components/ui/input";
// import { Button } from "../components/ui/button";
// import { Textarea } from "../components/ui/textarea";
// import { Edit2, Save, X, Loader2, Plus, Trash2 } from "lucide-react";
// import { toast } from "react-toastify";

// // Define EditableText outside component to prevent re-creation and focus loss
// const EditableText = ({
//   value,
//   onChange,
//   multiline = false,
//   className = "",
//   placeholder = "",
// }) => {
//   const baseClasses =
//     "w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none";
//   if (multiline) {
//     return (
//       <textarea
//         value={value || ""}
//         onChange={(e) => onChange(e.target.value)}
//         className={`${baseClasses} p-2 resize-none ${className}`}
//         placeholder={placeholder}
//         rows={3}
//       />
//     );
//   }
//   return (
//     <input
//       type="text"
//       value={value || ""}
//       onChange={(e) => onChange(e.target.value)}
//       className={`${baseClasses} p-1 ${className}`}
//       placeholder={placeholder}
//     />
//   );
// };

// export default function EditableContact({
//   content,
//   onStateChange,
//   userId,
//   publishedId,
//   templateSelection,
// }) {
//   const defaultContent = {
//     title: "Get In Touch",
//     description:
//       "Ready to transform your business? Let's start a conversation about how we can help you achieve your goals with our expert solutions.",
//     formTitle: "Send us a message",
//     formDescription:
//       "We'll get back to you within 24 hours during business days.",
//     ctaButton: "Send Message",
//     businessHoursTitle: "Business Hours",
//     businessHours: [
//       "Mon - Fri: 9:00 AM - 6:00 PM EST",
//       "Sat: 10:00 AM - 2:00 PM EST",
//       "Closed on Sundays",
//     ],
//     consultationTitle: "Ready to Get Started?",
//     consultationDescription:
//       "Schedule a free consultation to discuss your business needs",
//     consultationButton: "Book Free Consultation",
//   };

//   const [isEditing, setIsEditing] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);
//   const [contactData, setContactData] = useState(defaultContent);
//   const [tempData, setTempData] = useState(defaultContent);

//   // Safe data access helper
//   const getBusinessHours = (data) => {
//     if (!data.businessHours) return defaultContent.businessHours;
//     if (Array.isArray(data.businessHours)) return data.businessHours;
//     // If it's not an array but exists, wrap it in an array
//     return [data.businessHours];
//   };

//   // Update when prop changes
//   useEffect(() => {
//     if (content) {
//       const mergedData = {
//         ...defaultContent,
//         ...content,
//         // Ensure businessHours is always an array
//         businessHours: getBusinessHours(content),
//       };
//       setContactData(mergedData);
//       setTempData(mergedData);
//     }
//   }, [content]);

//   // Notify parent of state changes
//   useEffect(() => {
//     if (onStateChange) {
//       onStateChange(contactData);
//     }
//   }, [contactData, onStateChange]);

//   const handleEdit = () => {
//     setIsEditing(true);
//     setTempData(contactData);
//   };

//   const handleCancel = () => {
//     setTempData(contactData);
//     setIsEditing(false);
//   };

//   const handleSave = async () => {
//     try {
//       setIsSaving(true);
//       await new Promise((resolve) => setTimeout(resolve, 1000));

//       // Ensure businessHours is an array before saving
//       const dataToSave = {
//         ...tempData,
//         businessHours: getBusinessHours(tempData),
//       };

//       setContactData(dataToSave);
//       setIsEditing(false);
//       toast.success("Contact section saved successfully");

//       // Notify parent only after saving
//       if (onStateChange) onStateChange(dataToSave);
//     } catch (error) {
//       console.error("Error saving contact section:", error);
//       toast.error("Error saving changes. Please try again.");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const updateField = (field, value) => {
//     setTempData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const updateBusinessHour = (index, value) => {
//     setTempData((prev) => {
//       const currentHours = getBusinessHours(prev);
//       return {
//         ...prev,
//         businessHours: currentHours.map((hour, i) =>
//           i === index ? value : hour
//         ),
//       };
//     });
//   };

//   const addBusinessHour = () => {
//     setTempData((prev) => {
//       const currentHours = getBusinessHours(prev);
//       return {
//         ...prev,
//         businessHours: [...currentHours, "New business hour"],
//       };
//     });
//   };

//   const removeBusinessHour = (index) => {
//     setTempData((prev) => {
//       const currentHours = getBusinessHours(prev);
//       if (currentHours.length > 1) {
//         return {
//           ...prev,
//           businessHours: currentHours.filter((_, i) => i !== index),
//         };
//       }
//       return prev;
//     });
//   };

//   const displayData = isEditing ? tempData : contactData;
//   const displayBusinessHours = getBusinessHours(displayData);

//   return (
//     <section
//       id="contact"
//       className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-500 scroll-mt-20 relative"
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
//               {isSaving ? (
//                 <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//               ) : (
//                 <Save className="w-4 h-4 mr-2" />
//               )}
//               {isSaving ? "Saving..." : "Save"}
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
//         {/* Header */}
//         <div className="text-center mb-12">
//           {isEditing ? (
//             <EditableText
//               value={tempData.title}
//               onChange={(val) => updateField("title", val)}
//               className="text-4xl font-bold text-gray-900 dark:text-white mb-3 text-center"
//               placeholder="Section Title"
//             />
//           ) : (
//             <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
//               {displayData.title}
//             </h2>
//           )}

//           {isEditing ? (
//             <EditableText
//               value={tempData.description}
//               onChange={(val) => updateField("description", val)}
//               multiline
//               className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg text-center"
//               placeholder="Section Description"
//             />
//           ) : (
//             <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
//               {displayData.description}
//             </p>
//           )}
//         </div>

//         {/* Main Card */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Left: Contact Form */}
//           <motion.div
//             initial={{ opacity: 0, x: -30 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.6 }}
//             viewport={{ once: true }}
//             className="col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 lg:p-10"
//           >
//             {isEditing ? (
//               <EditableText
//                 value={tempData.formTitle}
//                 onChange={(val) => updateField("formTitle", val)}
//                 className="text-xl font-semibold text-gray-900 dark:text-white mb-2"
//                 placeholder="Form Title"
//               />
//             ) : (
//               <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
//                 {displayData.formTitle}
//               </h3>
//             )}

//             {isEditing ? (
//               <EditableText
//                 value={tempData.formDescription}
//                 onChange={(val) => updateField("formDescription", val)}
//                 className="text-gray-500 dark:text-gray-300 mb-6 text-sm"
//                 placeholder="Form Description"
//               />
//             ) : (
//               <p className="text-gray-500 dark:text-gray-300 mb-6 text-sm">
//                 {displayData.formDescription}
//               </p>
//             )}

//             <div className="space-y-6">
//               <div className="grid md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
//                     First Name
//                   </label>
//                   <Input
//                     placeholder="John"
//                     className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
//                     Last Name
//                   </label>
//                   <Input
//                     placeholder="Doe"
//                     className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
//                   />
//                 </div>
//               </div>

//               <div className="grid md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
//                     Email
//                   </label>
//                   <Input
//                     type="email"
//                     placeholder="john@company.com"
//                     className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
//                     Company
//                   </label>
//                   <Input
//                     placeholder="Your Company"
//                     className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
//                   Subject
//                 </label>
//                 <select className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-400 transition-all duration-200">
//                   <option>General Inquiry</option>
//                   <option>Sales Inquiry</option>
//                   <option>Products Inquiry</option>
//                   <option>Services Inquiry</option>
//                   <option>Support Inquiry</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
//                   Message
//                 </label>
//                 <Textarea
//                   rows={4}
//                   placeholder="Tell us about your project and how we can help..."
//                   className="resize-none bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
//                 />
//               </div>

//               {isEditing ? (
//                 <EditableText
//                   value={tempData.ctaButton}
//                   onChange={(val) => updateField("ctaButton", val)}
//                   className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-4 px-4 rounded-md transition-colors duration-300 text-lg text-center"
//                   placeholder="Button Text"
//                 />
//               ) : (
//                 <Button className="w-full bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-white font-semibold py-4 transition-colors duration-300 text-lg">
//                   {displayData.ctaButton}
//                 </Button>
//               )}
//             </div>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0, x: 30 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.8 }}
//             viewport={{ once: true }}
//             className="space-y-6"
//           >
//             {/* <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
//               {isEditing ? (
//                 <EditableText
//                   value={tempData.businessHoursTitle}
//                   onChange={(val) => updateField("businessHoursTitle", val)}
//                   className="text-lg font-semibold text-gray-900 dark:text-white mb-3"
//                   placeholder="Business Hours Title"
//                 />
//               ) : (
//                 <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
//                   {displayData.businessHoursTitle}
//                 </h4>
//               )}

//               <ul className="text-gray-600 dark:text-gray-300 space-y-1 text-sm">
//                 {displayBusinessHours.map((hour, index) => (
//                   <li key={index} className="flex items-center">
//                     {isEditing ? (
//                       <div className="flex items-center gap-2 w-full">
//                         <input
//                           value={hour}
//                           onChange={(e) =>
//                             updateBusinessHour(index, e.target.value)
//                           }
//                           className="w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1 text-sm"
//                         />
//                         {displayBusinessHours.length > 1 && (
//                           <Button
//                             onClick={() => removeBusinessHour(index)}
//                             size="sm"
//                             variant="outline"
//                             className="bg-red-50 hover:bg-red-100 text-red-700"
//                           >
//                             <Trash2 className="w-3 h-3" />
//                           </Button>
//                         )}
//                       </div>
//                     ) : (
//                       hour
//                     )}
//                   </li>
//                 ))}
//               </ul>

//               {isEditing && (
//                 <Button
//                   onClick={addBusinessHour}
//                   size="sm"
//                   variant="outline"
//                   className="mt-3 bg-green-50 hover:bg-green-100 text-green-700"
//                 >
//                   <Plus className="w-3 h-3 mr-1" />
//                   Add Business Hour
//                 </Button>
//               )}
//             </div> */}

//             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 text-center">
//               {isEditing ? (
//                 <EditableText
//                   value={tempData.consultationTitle}
//                   onChange={(val) => updateField("consultationTitle", val)}
//                   className="text-lg font-semibold text-gray-900 dark:text-white mb-2"
//                   placeholder="Consultation Title"
//                 />
//               ) : (
//                 <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
//                   {displayData.consultationTitle}
//                 </h4>
//               )}

//               {isEditing ? (
//                 <EditableText
//                   value={tempData.consultationDescription}
//                   onChange={(val) =>
//                     updateField("consultationDescription", val)
//                   }
//                   multiline
//                   className="text-gray-600 dark:text-gray-300 text-sm mb-4 w-full"
//                   placeholder="Consultation Description"
//                 />
//               ) : (
//                 <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
//                   {displayData.consultationDescription}
//                 </p>
//               )}

//               {isEditing ? (
//                 <EditableText
//                   value={tempData.consultationButton}
//                   onChange={(val) => updateField("consultationButton", val)}
//                   className="w-full bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md font-semibold transition-colors duration-300 text-center"
//                   placeholder="Consultation Button Text"
//                 />
//               ) : (
//                 <Button className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md font-semibold transition-colors duration-300">
//                   {displayData.consultationButton}
//                 </Button>
//               )}
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   );
// }

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Edit2, Save, X, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

// Define EditableText outside component to prevent re-creation and focus loss
const EditableText = ({
  value,
  onChange,
  multiline = false,
  className = "",
  placeholder = "",
  maxLength = 100,
  showCharCount = false
}) => {
  const baseClasses =
    "w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none";

  return (
    <div className="w-full">
      {multiline ? (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className={`${baseClasses} p-2 resize-none ${className}`}
          placeholder={placeholder}
          rows={3}
          maxLength={maxLength}
        />
      ) : (
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className={`${baseClasses} p-1 ${className}`}
          placeholder={placeholder}
          maxLength={maxLength}
        />
      )}
      {showCharCount && (
        <div className="text-xs text-gray-500 text-right mt-1">
          {(value || "").length}/{maxLength} characters
        </div>
      )}
    </div>
  );
};

export default function EditableContact({
  content,
  onStateChange,
  userId,
  publishedId,
  templateSelection,
}) {
  // Character limits
  const CHAR_LIMITS = {
    title: 100,
    description: 200,
    formTitle: 100,
    formDescription: 200,
    ctaButton: 50,
    businessHoursTitle: 100,
    businessHour: 100,
    consultationTitle: 100,
    consultationDescription: 200,
    consultationButton: 50,
  };

  const defaultContent = {
    title: "Get In Touch",
    description:
      "Ready to transform your business? Let's start a conversation about how we can help you achieve your goals with our expert solutions.",
    formTitle: "Send us a message",
    formDescription:
      "We'll get back to you within 24 hours during business days.",
    ctaButton: "Send Message",
    businessHoursTitle: "Business Hours",
    businessHours: [
      "Mon - Fri: 9:00 AM - 6:00 PM EST",
      "Sat: 10:00 AM - 2:00 PM EST",
      "Closed on Sundays",
    ],
    consultationTitle: "Ready to Get Started?",
    consultationDescription:
      "Schedule a free consultation to discuss your business needs",
    consultationButton: "Book Free Consultation",
  };

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [contactData, setContactData] = useState(defaultContent);
  const [tempData, setTempData] = useState(defaultContent);

  // Safe data access helper
  const getBusinessHours = (data) => {
    if (!data.businessHours) return defaultContent.businessHours;
    if (Array.isArray(data.businessHours)) return data.businessHours;
    // If it's not an array but exists, wrap it in an array
    return [data.businessHours];
  };

  // Update when prop changes
  useEffect(() => {
    if (content) {
      const mergedData = {
        ...defaultContent,
        ...content,
        // Ensure businessHours is always an array
        businessHours: getBusinessHours(content),
      };
      setContactData(mergedData);
      setTempData(mergedData);
    }
  }, [content]);

  // Notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(contactData);
    }
  }, [contactData, onStateChange]);

  const handleEdit = () => {
    setIsEditing(true);
    setTempData(contactData);
  };

  const handleCancel = () => {
    setTempData(contactData);
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Ensure businessHours is an array before saving
      const dataToSave = {
        ...tempData,
        businessHours: getBusinessHours(tempData),
      };

      setContactData(dataToSave);
      setIsEditing(false);
      toast.success("Contact section saved successfully");

      // Notify parent only after saving
      if (onStateChange) onStateChange(dataToSave);
    } catch (error) {
      console.error("Error saving contact section:", error);
      toast.error("Error saving changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (field, value) => {
    setTempData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateBusinessHour = (index, value) => {
    setTempData((prev) => {
      const currentHours = getBusinessHours(prev);
      return {
        ...prev,
        businessHours: currentHours.map((hour, i) =>
          i === index ? value : hour
        ),
      };
    });
  };

  const addBusinessHour = () => {
    setTempData((prev) => {
      const currentHours = getBusinessHours(prev);
      return {
        ...prev,
        businessHours: [...currentHours, "New business hour"],
      };
    });
  };

  const removeBusinessHour = (index) => {
    setTempData((prev) => {
      const currentHours = getBusinessHours(prev);
      if (currentHours.length > 1) {
        return {
          ...prev,
          businessHours: currentHours.filter((_, i) => i !== index),
        };
      }
      return prev;
    });
  };

  const displayData = isEditing ? tempData : contactData;
  const displayBusinessHours = getBusinessHours(displayData);

  return (
    <section
      id="contact"
      className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-500 scroll-mt-20 relative"
    >
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
              {isSaving ? "Saving..." : "Save"}
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
        {/* Header */}
        <div className="text-center mb-12">
          {isEditing ? (
            <div className="flex flex-col items-center justify-center">
              <EditableText
                value={tempData.title}
                onChange={(val) => updateField("title", val)}
                className="text-4xl font-bold text-gray-900 dark:text-white mb-3 text-center"
                placeholder="Section Title"
                maxLength={CHAR_LIMITS.title}
                showCharCount
              />
            </div>
          ) : (
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
              {displayData.title}
            </h2>
          )}

          {isEditing ? (
            <div className="flex flex-col items-center justify-center">
              <EditableText
                value={tempData.description}
                onChange={(val) => updateField("description", val)}
                multiline
                className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg text-center"
                placeholder="Section Description"
                maxLength={CHAR_LIMITS.description}
                showCharCount
              />
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
              {displayData.description}
            </p>
          )}
        </div>

        {/* Main Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 lg:p-10"
          >
            {isEditing ? (
              <div className="mb-2">
                <EditableText
                  value={tempData.formTitle}
                  onChange={(val) => updateField("formTitle", val)}
                  className="text-xl font-semibold text-gray-900 dark:text-white"
                  placeholder="Form Title"
                  maxLength={CHAR_LIMITS.formTitle}
                  showCharCount
                />
              </div>
            ) : (
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {displayData.formTitle}
              </h3>
            )}

            {isEditing ? (
              <div className="mb-6">
                <EditableText
                  value={tempData.formDescription}
                  onChange={(val) => updateField("formDescription", val)}
                  className="text-gray-500 dark:text-gray-300 text-sm"
                  placeholder="Form Description"
                  maxLength={CHAR_LIMITS.formDescription}
                  showCharCount
                />
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-300 mb-6 text-sm">
                {displayData.formDescription}
              </p>
            )}

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    First Name
                  </label>
                  <Input
                    placeholder="rahul"
                    className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Last Name
                  </label>
                  <Input
                    placeholder="sharma"
                    className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="rahul@company.com"
                    className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Company
                  </label>
                  <Input
                    placeholder="Your Company"
                    className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Subject
                </label>
                <select className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-400 transition-all duration-200">
                  <option>General Inquiry</option>
                  <option>Sales Inquiry</option>
                  <option>Products Inquiry</option>
                  <option>Services Inquiry</option>
                  <option>Support Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Message
                </label>
                <Textarea
                  rows={4}
                  placeholder="Tell us about your project and how we can help..."
                  className="resize-none bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                />
              </div>

              {isEditing ? (
                <div>
                  <EditableText
                    value={tempData.ctaButton}
                    onChange={(val) => updateField("ctaButton", val)}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-4 px-4 rounded-md transition-colors duration-300 text-lg text-center"
                    placeholder="Button Text"
                    maxLength={CHAR_LIMITS.ctaButton}
                    showCharCount
                  />
                </div>
              ) : (
                <Button className="w-full bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-white font-semibold py-4 transition-colors duration-300 text-lg">
                  {displayData.ctaButton}
                </Button>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Business Hours Section */}
            {/* <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
              {isEditing ? (
                <div className="mb-3">
                  <EditableText
                    value={tempData.businessHoursTitle}
                    onChange={(val) => updateField("businessHoursTitle", val)}
                    className="text-lg font-semibold text-gray-900 dark:text-white"
                    placeholder="Business Hours Title"
                    maxLength={CHAR_LIMITS.businessHoursTitle}
                    showCharCount
                  />
                </div>
              ) : (
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {displayData.businessHoursTitle}
                </h4>
              )}

              <ul className="text-gray-600 dark:text-gray-300 space-y-1 text-sm">
                {displayBusinessHours.map((hour, index) => (
                  <li key={index} className="flex items-center">
                    {isEditing ? (
                      <div className="w-full">
                        <div className="flex items-center gap-2 w-full">
                          <input
                            value={hour}
                            onChange={(e) =>
                              updateBusinessHour(index, e.target.value)
                            }
                            className="w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1 text-sm"
                            maxLength={CHAR_LIMITS.businessHour}
                          />
                          {displayBusinessHours.length > 1 && (
                            <Button
                              onClick={() => removeBusinessHour(index)}
                              size="sm"
                              variant="outline"
                              className="bg-red-50 hover:bg-red-100 text-red-700"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 text-right mt-1">
                          {hour.length}/{CHAR_LIMITS.businessHour} characters
                        </div>
                      </div>
                    ) : (
                      hour
                    )}
                  </li>
                ))}
              </ul>

              {isEditing && (
                <Button
                  onClick={addBusinessHour}
                  size="sm"
                  variant="outline"
                  className="mt-3 bg-green-50 hover:bg-green-100 text-green-700"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Business Hour
                </Button>
              )}
            </div> */}

            {/* Consultation Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 text-center">
              {isEditing ? (
                <div className="mb-2">
                  <EditableText
                    value={tempData.consultationTitle}
                    onChange={(val) => updateField("consultationTitle", val)}
                    className="text-lg font-semibold text-gray-900 dark:text-white"
                    placeholder="Consultation Title"
                    maxLength={CHAR_LIMITS.consultationTitle}
                    showCharCount
                  />
                </div>
              ) : (
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {displayData.consultationTitle}
                </h4>
              )}

              {isEditing ? (
                <div className="mb-4">
                  <EditableText
                    value={tempData.consultationDescription}
                    onChange={(val) =>
                      updateField("consultationDescription", val)
                    }
                    multiline
                    className="text-gray-600 dark:text-gray-300 text-sm w-full"
                    placeholder="Consultation Description"
                    maxLength={CHAR_LIMITS.consultationDescription}
                    showCharCount
                  />
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  {displayData.consultationDescription}
                </p>
              )}

              {isEditing ? (
                <div>
                  <EditableText
                    value={tempData.consultationButton}
                    onChange={(val) => updateField("consultationButton", val)}
                    className="w-full bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md font-semibold transition-colors duration-300 text-center"
                    placeholder="Consultation Button Text"
                    maxLength={CHAR_LIMITS.consultationButton}
                    showCharCount
                  />
                </div>
              ) : (
                <Button className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md font-semibold transition-colors duration-300">
                  {displayData.consultationButton}
                </Button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Instructions for Edit Mode */}
        {/* {isEditing && (
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 mb-2">
              <strong>Edit Mode Active:</strong> You can now edit all text with character limits:
            </p>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Titles:</strong> {CHAR_LIMITS.title} characters</li>
              <li>• <strong>Descriptions:</strong> {CHAR_LIMITS.description} characters</li>
              <li>• <strong>Button Text:</strong> {CHAR_LIMITS.ctaButton} characters</li>
              <li>• <strong>Business Hours:</strong> {CHAR_LIMITS.businessHour} characters per line</li>
            </ul>
          </div>
        )} */}
      </div>
    </section>
  );
}
