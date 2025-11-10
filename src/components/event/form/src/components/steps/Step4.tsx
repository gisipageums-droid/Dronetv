// // import React, { useState } from "react";
// // import { useForm } from "../../context/FormContext";
// // import { Wrench, Plus, Minus, Briefcase } from "lucide-react";

// // export const Step4 = ({ step }: { step: any }) => {
// //   const { data, addArrayItem, removeArrayItem, updateField } = useForm();
// //   const [errors, setErrors] = useState<{ [key: string]: string }>({});

// //   const validateField = (
// //     key: "projects" | "services",
// //     field: string,
// //     value: string
// //   ) => {
// //     let error = "";
// //     if (field === "description" && key === "projects") {
// //       if (value && value.length < 200)
// //         error = "Project description should be at least 200 characters.";
// //     }
// //     if (field === "serviceDetails" && key === "services") {
// //       if (value && value.length < 200)
// //         error = "Service details should be at least 200 characters.";
// //     }
// //     return error;
// //   };

// //   const handleChange = (
// //     key: "projects" | "services",
// //     index: number,
// //     field: string,
// //     value: string
// //   ) => {
// //     const arr = [...data[key]];
// //     arr[index] = { ...arr[index], [field]: value };
// //     updateField(key, arr);

// //     // ✅ Validate input
// //     const errorMsg = validateField(key, field, value);
// //     setErrors((prev) => ({
// //       ...prev,
// //       [`${key}-${index}-${field}`]: errorMsg,
// //     }));
// //   };

// //   const renderSection = (
// //     key: "projects" | "services",
// //     section: any,
// //     color: string
// //   ) => {
// //     const items = data[key] || [];
// //     const colorMap: any = { blue: "blue", green: "green" };

// //     return (
// //       <div className={`bg-${colorMap[color]}-50 rounded-lg p-3`}>
// //         {/* Header */}
// //         <div className="flex justify-between items-center mb-3">
// //           <h3 className={`text-sm font-bold text-${colorMap[color]}-900 flex items-center`}>
// //             {key === "services" && <Wrench className="w-5 h-5 mr-2" />}
// //             {key === "projects" && <Briefcase className="w-5 h-5 mr-2" />}
// //             {key.charAt(0).toUpperCase() + key.slice(1)}
// //           </h3>

// //           <button
// //             type="button"
// //             onClick={() => addArrayItem(key, {})}
// //             className={`flex items-center px-3 py-1 text-white text-sm rounded-md ${
// //               key === "projects" ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"
// //             }`}
// //           >
// //             <Plus className="w-4 h-4 mr-2" />
// //             Add {key.slice(0, -1)}
// //           </button>
// //         </div>

// //         {/* Items List */}
// //         <div className="space-y-2">
// //           {items.map((item, idx) => (
// //             <div key={idx} className="bg-white p-3 rounded-md border shadow-sm">
// //               {section.fields.map((f: any) => {
// //                 const errKey = `${key}-${idx}-${f.id}`;
// //                 const errorMsg = errors[errKey];

// //                 return (
// //                   <div key={f.id} className="mb-3">
// //                     <label className="block mb-1 font-medium">{f.label}</label>
// //                     {f.type === "textarea" ? (
// //                       <textarea
// //                         value={item[f.id] || ""}
// //                         onChange={(e) =>
// //                           handleChange(key, idx, f.id, e.target.value)
// //                         }
// //                         className={`border p-2 w-full rounded focus:ring-2 focus:ring-yellow-400 ${
// //                           errorMsg ? "border-red-500" : ""
// //                         }`}
// //                         rows={2}
// //                         maxLength={1000}
// //                       />
// //                     ) : (
// //                       <input
// //                         type={f.type}
// //                         value={item[f.id] || ""}
// //                         onChange={(e) =>
// //                           handleChange(key, idx, f.id, e.target.value)
// //                         }
// //                         className="border p-2 w-full rounded focus:ring-2 focus:ring-yellow-400"
// //                       />
// //                     )}
// //                     {f.type === "textarea" && (
// //                       <div className="text-xs text-slate-500 mt-1">
// //                         {(item[f.id] || "").length}/1000 characters
// //                       </div>
// //                     )}
// //                     {errorMsg && (
// //                       <div className="text-xs text-red-600 mt-1">{errorMsg}</div>
// //                     )}
// //                   </div>
// //                 );
// //               })}

// //               <button
// //                 type="button"
// //                 onClick={() => removeArrayItem(key, idx)}
// //                 className="p-1 text-red-600 hover:bg-red-50 rounded-md flex items-center gap-1"
// //               >
// //                 <Minus className="w-4 h-4" /> Remove
// //               </button>
// //             </div>
// //           ))}
// //         </div>
// //       </div>
// //     );
// //   };

// //   return (
// //     <div className="space-y-6">
// //       <h2 className="text-xl font-semibold mb-4">{step.title}</h2>
// //       {step.projects && renderSection("projects", step.projects, "blue")}
// //       {step.services && renderSection("services", step.services, "green")}
// //     </div>
// //   );
// // };



// import React, { useState } from "react";
// import { useForm } from "../../context/FormContext";
// import { Plus, Minus, User, Palette, Users } from "lucide-react";

// interface Speaker {
//   name: string;
//   designation: string;
//   organization: string;
//   day: string;
//   sequence: number;
// }

// interface Theme {
//   day: string;
//   themeTitle: string;
//   details: string;
// }

// interface Partner {
//   partnerName: string;
// }

// export const Step4 = ({ step, setStepValid }: { step: any; setStepValid?: (valid: boolean) => void }) => {
//   const { data, addArrayItem, removeArrayItem, updateField } = useForm();
//   const [errors, setErrors] = useState<{ [key: string]: string }>({});

//   // Initialize data if not present
//   const speakers = data.speakers || [];
//   const themes = data.themes || [];
//   const partners = data.partners || [];

//   // Validation function
//   const validateField = (
//     key: "speakers" | "themes" | "partners",
//     field: string,
//     value: string,
//     index: number
//   ) => {
//     let error = "";
    
//     if (field === "name" && key === "speakers") {
//       if (!value.trim()) error = "Speaker name is required";
//     }
    
//     if (field === "themeTitle" && key === "themes") {
//       if (!value.trim()) error = "Theme title is required";
//     }
    
//     if (field === "partnerName" && key === "partners") {
//       if (!value.trim()) error = "Partner name is required";
//     }
    
//     return error;
//   };

//   const handleChange = (
//     key: "speakers" | "themes" | "partners",
//     index: number,
//     field: string,
//     value: string
//   ) => {
//     const arr = [...data[key] || []];
//     arr[index] = { ...arr[index], [field]: value };
//     updateField(key, arr);

//     // Validate input
//     const errorMsg = validateField(key, field, value, index);
//     setErrors((prev) => ({
//       ...prev,
//       [`${key}-${index}-${field}`]: errorMsg,
//     }));
//   };

//   const baseInputClasses = "border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm w-full";
//   const baseTextareaClasses = "border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm w-full min-h-[80px] resize-vertical";

//   // Render speakers section
//   const renderSpeakers = () => {
//     return (
//       <div className="space-y-6 p-6 bg-yellow-50 rounded-xl shadow-md">
//         <div className="flex justify-between items-center">
//           <div>
//             <h3 className="text-lg font-semibold text-slate-900 flex items-center">
//               <User className="w-5 h-5 mr-2" />
//               Speakers
//             </h3>
//             <p className="text-sm text-slate-600 mt-1">
//               Add speakers, panelists, and presenters for your event
//             </p>
//           </div>
//           <button
//             type="button"
//             onClick={() => addArrayItem("speakers", {
//               name: "",
//               designation: "",
//               organization: "",
//               day: "",
//               sequence: speakers.length + 1
//             })}
//             className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center"
//           >
//             <Plus className="w-4 h-4 mr-2" />
//             Add Speaker
//           </button>
//         </div>

//         {speakers.length === 0 ? (
//           <div className="text-center py-8 text-slate-500 bg-white rounded-lg border-2 border-dashed border-amber-200">
//             <User className="w-12 h-12 mx-auto mb-3 text-slate-400" />
//             <p className="font-medium">No speakers added yet</p>
//             <p className="text-sm mt-1">Add your event speakers to get started</p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {speakers.map((speaker: Speaker, index: number) => (
//               <div key={index} className="p-6 bg-white rounded-lg border border-amber-200 space-y-4">
//                 <div className="flex justify-between items-center">
//                   <h4 className="font-semibold text-slate-800">
//                     Speaker {index + 1}
//                   </h4>
//                   <button
//                     type="button"
//                     onClick={() => removeArrayItem("speakers", index)}
//                     className="text-red-500 hover:text-red-700 text-sm font-medium transition flex items-center"
//                   >
//                     <Minus className="w-4 h-4 mr-1" />
//                     Remove
//                   </button>
//                 </div>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block mb-1 font-medium text-slate-800 text-sm">
//                       Name *
//                     </label>
//                     <input
//                       type="text"
//                       value={speaker.name || ""}
//                       onChange={(e) => handleChange("speakers", index, "name", e.target.value)}
//                       placeholder="Full name of the speaker"
//                       className={baseInputClasses}
//                       required
//                     />
//                     {errors[`speakers-${index}-name`] && (
//                       <div className="text-xs text-red-600 mt-1">{errors[`speakers-${index}-name`]}</div>
//                     )}
//                   </div>
                  
//                   <div>
//                     <label className="block mb-1 font-medium text-slate-800 text-sm">
//                       Designation
//                     </label>
//                     <input
//                       type="text"
//                       value={speaker.designation || ""}
//                       onChange={(e) => handleChange("speakers", index, "designation", e.target.value)}
//                       placeholder="e.g., CEO, Professor, Author"
//                       className={baseInputClasses}
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block mb-1 font-medium text-slate-800 text-sm">
//                       Organization
//                     </label>
//                     <input
//                       type="text"
//                       value={speaker.organization || ""}
//                       onChange={(e) => handleChange("speakers", index, "organization", e.target.value)}
//                       placeholder="Company or institution"
//                       className={baseInputClasses}
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block mb-1 font-medium text-slate-800 text-sm">
//                       Day
//                     </label>
//                     <input
//                       type="text"
//                       value={speaker.day || ""}
//                       onChange={(e) => handleChange("speakers", index, "day", e.target.value)}
//                       placeholder="e.g., Day 1, Opening Day"
//                       className={baseInputClasses}
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block mb-1 font-medium text-slate-800 text-sm">
//                       Sequence
//                     </label>
//                     <input
//                       type="number"
//                       value={speaker.sequence || ""}
//                       onChange={(e) => handleChange("speakers", index, "sequence", e.target.value)}
//                       placeholder="Order of appearance"
//                       className={baseInputClasses}
//                       min="1"
//                     />
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   };

//   // Render themes section
//   const renderThemes = () => {
//     return (
//       <div className="space-y-6 p-6 bg-yellow-50 rounded-xl shadow-md">
//         <div className="flex justify-between items-center">
//           <div>
//             <h3 className="text-lg font-semibold text-slate-900 flex items-center">
//               <Palette className="w-5 h-5 mr-2" />
//               Event Themes
//             </h3>
//             <p className="text-sm text-slate-600 mt-1">
//               Define the main themes or topics for each day of your event
//             </p>
//           </div>
//           <button
//             type="button"
//             onClick={() => addArrayItem("themes", {
//               day: "",
//               themeTitle: "",
//               details: ""
//             })}
//             className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center"
//           >
//             <Plus className="w-4 h-4 mr-2" />
//             Add Theme
//           </button>
//         </div>

//         {themes.length === 0 ? (
//           <div className="text-center py-8 text-slate-500 bg-white rounded-lg border-2 border-dashed border-amber-200">
//             <Palette className="w-12 h-12 mx-auto mb-3 text-slate-400" />
//             <p className="font-medium">No themes added yet</p>
//             <p className="text-sm mt-1">Add daily themes to structure your event</p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {themes.map((theme: Theme, index: number) => (
//               <div key={index} className="p-6 bg-white rounded-lg border border-amber-200 space-y-4">
//                 <div className="flex justify-between items-center">
//                   <h4 className="font-semibold text-slate-800">
//                     Theme {index + 1}
//                   </h4>
//                   <button
//                     type="button"
//                     onClick={() => removeArrayItem("themes", index)}
//                     className="text-red-500 hover:text-red-700 text-sm font-medium transition flex items-center"
//                   >
//                     <Minus className="w-4 h-4 mr-1" />
//                     Remove
//                   </button>
//                 </div>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block mb-1 font-medium text-slate-800 text-sm">
//                       Day
//                     </label>
//                     <input
//                       type="text"
//                       value={theme.day || ""}
//                       onChange={(e) => handleChange("themes", index, "day", e.target.value)}
//                       placeholder="e.g., Day 1, Final Day"
//                       className={baseInputClasses}
//                     />
//                   </div>
                  
//                   <div className="md:col-span-2">
//                     <label className="block mb-1 font-medium text-slate-800 text-sm">
//                       Theme Title *
//                     </label>
//                     <input
//                       type="text"
//                       value={theme.themeTitle || ""}
//                       onChange={(e) => handleChange("themes", index, "themeTitle", e.target.value)}
//                       placeholder="e.g., Innovation & Technology, Sustainability, Future Trends"
//                       className={baseInputClasses}
//                       required
//                     />
//                     {errors[`themes-${index}-themeTitle`] && (
//                       <div className="text-xs text-red-600 mt-1">{errors[`themes-${index}-themeTitle`]}</div>
//                     )}
//                   </div>
                  
//                   <div className="md:col-span-2">
//                     <label className="block mb-1 font-medium text-slate-800 text-sm">
//                       Theme Details
//                     </label>
//                     <textarea
//                       value={theme.details || ""}
//                       onChange={(e) => handleChange("themes", index, "details", e.target.value)}
//                       placeholder="Describe the focus, topics, and activities for this theme"
//                       className={baseTextareaClasses}
//                       rows={3}
//                     />
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   };

//   // Render partners section
//   const renderPartners = () => {
//     return (
//       <div className="space-y-6 p-6 bg-yellow-50 rounded-xl shadow-md">
//         <div className="flex justify-between items-center">
//           <div>
//             <h3 className="text-lg font-semibold text-slate-900 flex items-center">
//               <Users className="w-5 h-5 mr-2" />
//               Partners & Sponsors
//             </h3>
//             <p className="text-sm text-slate-600 mt-1">
//               List your event partners, sponsors, and collaborators
//             </p>
//           </div>
//           <button
//             type="button"
//             onClick={() => addArrayItem("partners", { partnerName: "" })}
//             className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center"
//           >
//             <Plus className="w-4 h-4 mr-2" />
//             Add Partner
//           </button>
//         </div>

//         {partners.length === 0 ? (
//           <div className="text-center py-8 text-slate-500 bg-white rounded-lg border-2 border-dashed border-amber-200">
//             <Users className="w-12 h-12 mx-auto mb-3 text-slate-400" />
//             <p className="font-medium">No partners added yet</p>
//             <p className="text-sm mt-1">Add your event partners and sponsors</p>
//           </div>
//         ) : (
//           <div className="space-y-3">
//             {partners.map((partner: Partner, index: number) => (
//               <div key={index} className="flex items-center gap-3 p-4 bg-white rounded-lg border border-amber-200">
//                 <div className="flex-1">
//                   <input
//                     type="text"
//                     value={partner.partnerName || ""}
//                     onChange={(e) => handleChange("partners", index, "partnerName", e.target.value)}
//                     placeholder="Organization name"
//                     className={baseInputClasses}
//                     required
//                   />
//                   {errors[`partners-${index}-partnerName`] && (
//                     <div className="text-xs text-red-600 mt-1">{errors[`partners-${index}-partnerName`]}</div>
//                   )}
//                 </div>
//                 <button
//                   type="button"
//                   onClick={() => removeArrayItem("partners", index)}
//                   className="text-red-500 hover:text-red-700 p-2 transition"
//                   title="Remove partner"
//                 >
//                   <Minus className="w-4 h-4" />
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="space-y-8">
//       <h2 className="text-2xl font-bold text-amber-900 border-b border-amber-300 pb-2 mb-6">
//         {step.title}
//       </h2>

//       {renderSpeakers()}
//       {renderThemes()}
//       {renderPartners()}

//       {/* Summary Preview */}
//       {(speakers.length > 0 || themes.length > 0 || partners.length > 0) && (
//         <div className="p-6 bg-amber-50 rounded-xl border border-amber-200">
//           <h3 className="font-semibold text-amber-900 mb-4">Event Overview</h3>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
//             {speakers.length > 0 && (
//               <div>
//                 <h4 className="font-medium text-amber-800 mb-2">Speakers ({speakers.length})</h4>
//                 <div className="space-y-1">
//                   {speakers.slice(0, 3).map((speaker: Speaker, index: number) => (
//                     <div key={index} className="bg-white p-2 rounded border border-amber-100">
//                       <div className="font-medium">{speaker.name || "Unnamed Speaker"}</div>
//                       {speaker.designation && (
//                         <div className="text-xs text-slate-600">{speaker.designation}</div>
//                       )}
//                     </div>
//                   ))}
//                   {speakers.length > 3 && (
//                     <div className="text-xs text-slate-500">+{speakers.length - 3} more speakers</div>
//                   )}
//                 </div>
//               </div>
//             )}
            
//             {themes.length > 0 && (
//               <div>
//                 <h4 className="font-medium text-amber-800 mb-2">Themes ({themes.length})</h4>
//                 <div className="space-y-1">
//                   {themes.slice(0, 3).map((theme: Theme, index: number) => (
//                     <div key={index} className="bg-white p-2 rounded border border-amber-100">
//                       <div className="font-medium">{theme.themeTitle || "Untitled Theme"}</div>
//                       {theme.day && (
//                         <div className="text-xs text-slate-600">{theme.day}</div>
//                       )}
//                     </div>
//                   ))}
//                   {themes.length > 3 && (
//                     <div className="text-xs text-slate-500">+{themes.length - 3} more themes</div>
//                   )}
//                 </div>
//               </div>
//             )}
            
//             {partners.length > 0 && (
//               <div>
//                 <h4 className="font-medium text-amber-800 mb-2">Partners ({partners.length})</h4>
//                 <div className="space-y-1">
//                   {partners.slice(0, 5).map((partner: Partner, index: number) => (
//                     <div key={index} className="bg-white p-2 rounded border border-amber-100">
//                       <div className="font-medium">{partner.partnerName || "Unnamed Partner"}</div>
//                     </div>
//                   ))}
//                   {partners.length > 5 && (
//                     <div className="text-xs text-slate-500">+{partners.length - 5} more partners</div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };


import React, { useState } from "react";
import { useForm } from "../../context/FormContext";
import { Plus, Minus, User, Palette, Users } from "lucide-react";

interface Speaker {
  name: string;
  designation: string;
  organization: string;
  day: string;
  sequence: number;
}

interface Theme {
  day: string;
  themeTitle: string;
  details: string;
}

interface Partner {
  partnerName: string;
}

export const Step4 = ({ step, setStepValid }: { step: any; setStepValid?: (valid: boolean) => void }) => {
  const { data, addArrayItem, removeArrayItem, updateField } = useForm();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Initialize data if not present
  const speakers = data.speakers || [];
  const themes = data.themes || [];
  const partners = data.partners || [];

  // Character limits configuration
  const characterLimits = {
    themeTitle: 50,
    themeDetails: 200
  };

  // Validation function
  const validateField = (
    key: "speakers" | "themes" | "partners",
    field: string,
    value: string,
    index: number
  ) => {
    let error = '';
    
    if (field === "name" && key === "speakers") {
      if (!value.trim()) error = "Speaker name is required";
    }
    
    if (field === "themeTitle" && key === "themes") {
      if (!value.trim()) error = "Theme title is required";
    }
    
    if (field === "partnerName" && key === "partners") {
      if (!value.trim()) error = "Partner name is required";
    }
    
    return error;
  };

  const handleChange = (
    key: "speakers" | "themes" | "partners",
    index: number,
    field: string,
    value: string
  ) => {
    const arr = [...data[key] || []];
    arr[index] = { ...arr[index], [field]: value };
    updateField(key, arr);

    // Validate input
    const errorMsg = validateField(key, field, value, index);
    setErrors((prev) => ({
      ...prev,
      [`${key}-${index}-${field}`]: errorMsg,
    }));
  };

  const baseInputClasses = "border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm w-full";
  const baseTextareaClasses = "border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm w-full min-h-[80px] resize-vertical";

  // Helper function to render limited input
  const renderLimitedInput = (value: string, onChange: (value: string) => void, charLimit: number, placeholder: string, required = false) => {
    const charsRemaining = charLimit - (value?.length || 0);
    
    return (
      <div className="relative">
        <input
          type="text"
          value={value || ""}
          onChange={(e) => {
            if (e.target.value.length <= charLimit) {
              onChange(e.target.value);
            }
          }}
          placeholder={placeholder}
          className={`${baseInputClasses} ${charLimit ? 'pr-12' : ''}`}
          required={required}
          maxLength={charLimit}
        />
        {charLimit && (
          <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-xs ${
            charsRemaining < 10 ? 'text-red-500' : 'text-slate-500'
          }`}>
            {charsRemaining}
          </div>
        )}
      </div>
    );
  };

  // Helper function to render limited textarea
  const renderLimitedTextarea = (value: string, onChange: (value: string) => void, charLimit: number, placeholder: string, rows = 3) => {
    const charsRemaining = charLimit - (value?.length || 0);
    
    return (
      <div className="relative">
        <textarea
          value={value || ""}
          onChange={(e) => {
            if (e.target.value.length <= charLimit) {
              onChange(e.target.value);
            }
          }}
          placeholder={placeholder}
          className={`${baseTextareaClasses} ${charLimit ? 'pr-12' : ''}`}
          rows={rows}
          maxLength={charLimit}
        />
        {charLimit && (
          <div className={`absolute bottom-3 right-3 text-xs ${
            charsRemaining < 20 ? 'text-red-500' : 'text-slate-500'
          }`}>
            {charsRemaining}
          </div>
        )}
      </div>
    );
  };

  // Render speakers section
  const renderSpeakers = () => {
    return (
      <div className="space-y-6 p-6 bg-yellow-50 rounded-xl shadow-md">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Speakers
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Add speakers, panelists, and presenters for your event
          </p>
        </div>

        {speakers.length === 0 ? (
          <div className="text-center py-8 text-slate-500 bg-white rounded-lg border-2 border-dashed border-amber-200">
            <User className="w-12 h-12 mx-auto mb-3 text-slate-400" />
            <p className="font-medium">No speakers added yet</p>
            <p className="text-sm mt-1">Add your event speakers to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {speakers.map((speaker: Speaker, index: number) => (
              <div key={index} className="p-6 bg-white rounded-lg border border-amber-200 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-slate-800">
                    Speaker {index + 1}
                  </h4>
                  <button
                    type="button"
                    onClick={() => removeArrayItem("speakers", index)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium transition flex items-center"
                  >
                    <Minus className="w-4 h-4 mr-1" />
                    Remove
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-medium text-slate-800 text-sm">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={speaker.name || ""}
                      onChange={(e) => handleChange("speakers", index, "name", e.target.value)}
                      placeholder="Full name of the speaker"
                      className={baseInputClasses}
                      required
                    />
                    {errors[`speakers-${index}-name`] && (
                      <div className="text-xs text-red-600 mt-1">{errors[`speakers-${index}-name`]}</div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block mb-1 font-medium text-slate-800 text-sm">
                      Designation
                    </label>
                    <input
                      type="text"
                      value={speaker.designation || ""}
                      onChange={(e) => handleChange("speakers", index, "designation", e.target.value)}
                      placeholder="e.g., CEO, Professor, Author"
                      className={baseInputClasses}
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1 font-medium text-slate-800 text-sm">
                      Organization
                    </label>
                    <input
                      type="text"
                      value={speaker.organization || ""}
                      onChange={(e) => handleChange("speakers", index, "organization", e.target.value)}
                      placeholder="Company or institution"
                      className={baseInputClasses}
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1 font-medium text-slate-800 text-sm">
                      Day
                    </label>
                    <input
                      type="text"
                      value={speaker.day || ""}
                      onChange={(e) => handleChange("speakers", index, "day", e.target.value)}
                      placeholder="e.g., Day 1, Opening Day"
                      className={baseInputClasses}
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1 font-medium text-slate-800 text-sm">
                      Sequence
                    </label>
                    <input
                      type="number"
                      value={speaker.sequence || ""}
                      onChange={(e) => handleChange("speakers", index, "sequence", e.target.value)}
                      placeholder="Order of appearance"
                      className={baseInputClasses}
                      min="1"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Speaker Button at Bottom Right */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={() => addArrayItem("speakers", {
              name: "",
              designation: "",
              organization: "",
              day: "",
              sequence: speakers.length + 1
            })}
            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg text-sm font-medium transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Speaker
          </button>
        </div>
      </div>
    );
  };

  // Render themes section
  const renderThemes = () => {
    return (
      <div className="space-y-6 p-6 bg-yellow-50 rounded-xl shadow-md">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 flex items-center">
            <Palette className="w-5 h-5 mr-2" />
            Event Themes
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Define the main themes or topics for each day of your event
          </p>
        </div>

        {themes.length === 0 ? (
          <div className="text-center py-8 text-slate-500 bg-white rounded-lg border-2 border-dashed border-amber-200">
            <Palette className="w-12 h-12 mx-auto mb-3 text-slate-400" />
            <p className="font-medium">No themes added yet</p>
            <p className="text-sm mt-1">Add daily themes to structure your event</p>
          </div>
        ) : (
          <div className="space-y-4">
            {themes.map((theme: Theme, index: number) => (
              <div key={index} className="p-6 bg-white rounded-lg border border-amber-200 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-slate-800">
                    Theme {index + 1}
                  </h4>
                  <button
                    type="button"
                    onClick={() => removeArrayItem("themes", index)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium transition flex items-center"
                  >
                    <Minus className="w-4 h-4 mr-1" />
                    Remove
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-medium text-slate-800 text-sm">
                      Day
                    </label>
                    <input
                      type="text"
                      value={theme.day || ""}
                      onChange={(e) => handleChange("themes", index, "day", e.target.value)}
                      placeholder="e.g., Day 1, Final Day"
                      className={baseInputClasses}
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block mb-1 font-medium text-slate-800 text-sm">
                      Theme Title *
                      <span className="text-slate-500 text-xs font-normal ml-2">
                        (max {characterLimits.themeTitle} characters)
                      </span>
                    </label>
                    {renderLimitedInput(
                      theme.themeTitle || "",
                      (value) => handleChange("themes", index, "themeTitle", value),
                      characterLimits.themeTitle,
                      "e.g., Innovation & Technology, Sustainability, Future Trends",
                      true
                    )}
                    {errors[`themes-${index}-themeTitle`] && (
                      <div className="text-xs text-red-600 mt-1">{errors[`themes-${index}-themeTitle`]}</div>
                    )}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block mb-1 font-medium text-slate-800 text-sm">
                      Theme Details
                      <span className="text-slate-500 text-xs font-normal ml-2">
                        (max {characterLimits.themeDetails} characters)
                      </span>
                    </label>
                    {renderLimitedTextarea(
                      theme.details || "",
                      (value) => handleChange("themes", index, "details", value),
                      characterLimits.themeDetails,
                      "Describe the focus, topics, and activities for this theme"
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Theme Button at Bottom Right */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={() => addArrayItem("themes", {
              day: "",
              themeTitle: "",
              details: ""
            })}
            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg text-sm font-medium transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Theme
          </button>
        </div>
      </div>
    );
  };

  // Render partners section
  const renderPartners = () => {
    return (
      <div className="space-y-6 p-6 bg-yellow-50 rounded-xl shadow-md">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Partners & Sponsors
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            List your event partners, sponsors, and collaborators
          </p>
        </div>

        {partners.length === 0 ? (
          <div className="text-center py-8 text-slate-500 bg-white rounded-lg border-2 border-dashed border-amber-200">
            <Users className="w-12 h-12 mx-auto mb-3 text-slate-400" />
            <p className="font-medium">No partners added yet</p>
            <p className="text-sm mt-1">Add your event partners and sponsors</p>
          </div>
        ) : (
          <div className="space-y-3">
            {partners.map((partner: Partner, index: number) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-white rounded-lg border border-amber-200">
                <div className="flex-1">
                  <input
                    type="text"
                    value={partner.partnerName || ""}
                    onChange={(e) => handleChange("partners", index, "partnerName", e.target.value)}
                    placeholder="Organization name"
                    className={baseInputClasses}
                    required
                  />
                  {errors[`partners-${index}-partnerName`] && (
                    <div className="text-xs text-red-600 mt-1">{errors[`partners-${index}-partnerName`]}</div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeArrayItem("partners", index)}
                  className="text-red-500 hover:text-red-700 p-2 transition"
                  title="Remove partner"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add Partner Button at Bottom Right */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={() => addArrayItem("partners", { partnerName: "" })}
            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg text-sm font-medium transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Partner
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-amber-900 border-b border-amber-300 pb-2 mb-6">
        {step.title}
      </h2>

      {renderSpeakers()}
      {renderThemes()}
      {renderPartners()}

      {/* Summary Preview */}
      {(speakers.length > 0 || themes.length > 0 || partners.length > 0) && (
        <div className="p-6 bg-amber-50 rounded-xl border border-amber-200">
          <h3 className="font-semibold text-amber-900 mb-4">Event Overview</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            {speakers.length > 0 && (
              <div>
                <h4 className="font-medium text-amber-800 mb-2">Speakers ({speakers.length})</h4>
                <div className="space-y-1">
                  {speakers.slice(0, 3).map((speaker: Speaker, index: number) => (
                    <div key={index} className="bg-white p-2 rounded border border-amber-100">
                      <div className="font-medium">{speaker.name || "Unnamed Speaker"}</div>
                      {speaker.designation && (
                        <div className="text-xs text-slate-600">{speaker.designation}</div>
                      )}
                    </div>
                  ))}
                  {speakers.length > 3 && (
                    <div className="text-xs text-slate-500">+{speakers.length - 3} more speakers</div>
                  )}
                </div>
              </div>
            )}
            
            {themes.length > 0 && (
              <div>
                <h4 className="font-medium text-amber-800 mb-2">Themes ({themes.length})</h4>
                <div className="space-y-1">
                  {themes.slice(0, 3).map((theme: Theme, index: number) => (
                    <div key={index} className="bg-white p-2 rounded border border-amber-100">
                      <div className="font-medium">{theme.themeTitle || "Untitled Theme"}</div>
                      {theme.day && (
                        <div className="text-xs text-slate-600">{theme.day}</div>
                      )}
                    </div>
                  ))}
                  {themes.length > 3 && (
                    <div className="text-xs text-slate-500">+{themes.length - 3} more themes</div>
                  )}
                </div>
              </div>
            )}
            
            {partners.length > 0 && (
              <div>
                <h4 className="font-medium text-amber-800 mb-2">Partners ({partners.length})</h4>
                <div className="space-y-1">
                  {partners.slice(0, 5).map((partner: Partner, index: number) => (
                    <div key={index} className="bg-white p-2 rounded border border-amber-100">
                      <div className="font-medium">{partner.partnerName || "Unnamed Partner"}</div>
                    </div>
                  ))}
                  {partners.length > 5 && (
                    <div className="text-xs text-slate-500">+{partners.length - 5} more partners</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};