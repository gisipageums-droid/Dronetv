// import { useState, useEffect } from "react";
// import { useForm } from "../../context/FormContext";
// import { MultiSelect } from "../common/MultiSelect";
// import { PhoneInput } from "../common/PhoneInput";
// import { CountryStateSelect } from "../common/CountryStateSelect";
// import { DatePicker } from "../common/DatePicker";

// export const Step1 = ({ step, setStepValid }: { step: any; setStepValid?: (valid: boolean) => void }) => {
//   const { data, updateField } = useForm();

//   const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
//   const [checking, setChecking] = useState(false);

//   // Check username availability when user types
//   useEffect(() => {
//     const user_name = data.basicInfo?.user_name || "";
//     if (!user_name) {
//       setUsernameAvailable(null);
//       setStepValid?.(true);
//       return;
//     }

//     const timer = setTimeout(async () => {
//       try {
//         setChecking(true);
//         const res = await fetch(
//           "https://0x1psamlyh.execute-api.ap-south-1.amazonaws.com/dev/professional-username-check",
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ user_name }),
//           }
//         );
//         const json = await res.json();
//         setUsernameAvailable(json.available);
//         setStepValid?.(json.available);
//       } catch (err) {
//         console.error(err);
//         setUsernameAvailable(null);
//         setStepValid?.(true);
//       } finally {
//         setChecking(false);
//       }
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [data.basicInfo?.user_name, setStepValid]);

//   // Render input field based on type
//   const renderInputField = (f: any, section: any) => {
//     const baseClasses = "border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm";

//     // Handle country and state fields with dynamic API
//     if ((f.id === "country" || f.id === "state") && (section.id === "basicInfo" || section.id === "addressInformation")) {
//       // For country and state fields, we'll handle them together in the section rendering
//       // This is a placeholder that won't be used since we'll render CountryStateSelect directly
//       return null;
//     }

//     // Handle gender dropdown
//     if (f.id === "gender") {
//       return (
//         <select
//           className={baseClasses}
//           value={data[section.id]?.[f.id] || ""}
//           onChange={(e) =>
//             updateField(section.id, { 
//               ...data[section.id], 
//               [f.id]: e.target.value 
//             })
//           }
//         >
//           <option value="">Select Gender</option>
//           <option value="male">Male</option>
//           <option value="female">Female</option>
//           <option value="non-binary">Non-binary</option>
//           <option value="prefer-not-to-say">Prefer not to say</option>
//         </select>
//       );
//     }

//     // Handle phone fields with IDD functionality
//     const isPhoneField = f.type === "tel" || 
//                         f.id.toLowerCase().includes("phone") || 
//                         f.id.toLowerCase().includes("mobile") || 
//                         f.id.toLowerCase().includes("contact");
    
//     if (isPhoneField) {
//       return (
//         <PhoneInput
//           value={data[section.id]?.[f.id] || ""}
//           onChange={(value) =>
//             updateField(section.id, { 
//               ...data[section.id], 
//               [f.id]: value 
//             })
//           }
//           placeholder={f.placeholder || "Enter phone number"}
//           required={f.required}
//           className=""
//         />
//       );
//     }

//     // Handle date fields with calendar UI
//     const isDateField = f.type === "date" || 
//                        f.id.toLowerCase().includes("date") || 
//                        f.id.toLowerCase().includes("birth") || 
//                        f.id.toLowerCase().includes("dob") || 
//                        f.id.toLowerCase().includes("established") || 
//                        f.id.toLowerCase().includes("incorporation");
    
//     if (isDateField) {
//       return (
//         <DatePicker
//           label={f.label}
//           value={data[section.id]?.[f.id] || ""}
//           onChange={(value) =>
//             updateField(section.id, { 
//               ...data[section.id], 
//               [f.id]: value 
//             })
//           }
//           required={f.required}
//           placeholder={f.placeholder || "Select date"}
//         />
//       );
//     }

//     return (
//       <input
//         type={f.type}
//         required={f.required}
//         placeholder={f.placeholder || ""}
//         className={`${baseClasses} ${
//           section.id === "basicInfo" && f.id === "user_name" && usernameAvailable === false
//             ? "border-red-500 focus:ring-red-300"
//             : ""
//         }`}
//         value={data[section.id]?.[f.id] || ""}
//         onChange={(e) =>
//           updateField(section.id, { 
//             ...data[section.id], 
//             [f.id]: e.target.value 
//           })
//         }
//       />
//     );
//   };

//   // Render a section
//   const renderSection = (section: any) => {
//     // Check if this section should use 2-column layout
//     const useTwoColumns = section.id === "socialMediaLinks" || section.id === "alternateContact";
    
//     return (
//       <div key={section.id} className="space-y-4 p-6 bg-yellow-50 rounded-xl shadow-md mb-6">
//         <h3 className="text-lg font-semibold text-slate-900 border-b border-amber-200 pb-2">
//           {section.title}
//         </h3>
        
//         {useTwoColumns ? (
//           // 2-column grid layout
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {section.fields.map((f: any) => {
//               // Skip country and state fields as they will be rendered together
//               if (f.id === "country" || f.id === "state") return null;
              
//               // Check if this is a date field (DatePicker handles its own label)
//               const isDateField = f.type === "date" || 
//                                  f.id.toLowerCase().includes("date") || 
//                                  f.id.toLowerCase().includes("birth") || 
//                                  f.id.toLowerCase().includes("dob") || 
//                                  f.id.toLowerCase().includes("established") || 
//                                  f.id.toLowerCase().includes("incorporation");
              
//               return (
//                 <div key={f.id} className="flex flex-col">
//                   {!isDateField && (
//                     <label className="mb-1 font-medium text-slate-800 text-sm">
//                       {f.label}
//                       {f.required && <span className="text-red-500 ml-1">*</span>}
//                     </label>
//                   )}
//                   {renderInputField(f, section)}
//                 </div>
//               );
//             })}
            
//             {/* Render CountryStateSelect if this section has country/state fields */}
//             {section.fields.some((f: any) => f.id === "country" || f.id === "state") && (
//               <div className="md:col-span-2">
//                 <CountryStateSelect
//                   countryValue={data[section.id]?.country || ""}
//                   stateValue={data[section.id]?.state || ""}
//                   onCountryChange={(value) => updateField(section.id, { 
//                     ...data[section.id], 
//                     country: value 
//                   })}
//                   onStateChange={(value) => updateField(section.id, { 
//                     ...data[section.id], 
//                     state: value 
//                   })}
//                   countryRequired={section.fields.find((f: any) => f.id === "country")?.required}
//                   stateRequired={section.fields.find((f: any) => f.id === "state")?.required}
//                 />
//               </div>
//             )}
//           </div>
//         ) : (
//           // Single column layout for basicInfo and addressInformation
//           <div className="space-y-4">
//             {section.fields.map((f: any) => {
//               // Skip country and state fields as they will be rendered together
//               if (f.id === "country" || f.id === "state") return null;
              
//               // Check if this is a date field (DatePicker handles its own label)
//               const isDateField = f.type === "date" || 
//                                  f.id.toLowerCase().includes("date") || 
//                                  f.id.toLowerCase().includes("birth") || 
//                                  f.id.toLowerCase().includes("dob") || 
//                                  f.id.toLowerCase().includes("established") || 
//                                  f.id.toLowerCase().includes("incorporation");
              
//               return (
//                 <div key={f.id} className="flex flex-col">
//                   {!isDateField && (
//                     <label className="mb-1 font-medium text-slate-800 text-sm">
//                       {f.label}
//                       {f.required && <span className="text-red-500 ml-1">*</span>}
//                     </label>
//                   )}
//                   {renderInputField(f, section)}
//                   {section.id === "basicInfo" && f.id === "user_name" && data.basicInfo?.user_name && (
//                     <span className={`text-xs mt-1 ${
//                       usernameAvailable === false ? 'text-red-600' : 
//                       usernameAvailable === true ? 'text-green-600' : 'text-gray-600'
//                     }`}>
//                       {checking
//                         ? "Checking availability..."
//                         : usernameAvailable === false
//                         ? "❌ Username is taken"
//                         : usernameAvailable === true
//                         ? "✅ Username is available"
//                         : ""}
//                     </span>
//                   )}
//                 </div>
//               );
//             })}
            
//             {/* Render CountryStateSelect if this section has country/state fields */}
//             {section.fields.some((f: any) => f.id === "country" || f.id === "state") && (
//               <CountryStateSelect
//                 countryValue={data[section.id]?.country || ""}
//                 stateValue={data[section.id]?.state || ""}
//                 onCountryChange={(value) => updateField(section.id, { 
//                   ...data[section.id], 
//                   country: value 
//                 })}
//                 onStateChange={(value) => updateField(section.id, { 
//                   ...data[section.id], 
//                   state: value 
//                 })}
//                 countryRequired={section.fields.find((f: any) => f.id === "country")?.required}
//                 stateRequired={section.fields.find((f: any) => f.id === "state")?.required}
//               />
//             )}
//           </div>
//         )}
//       </div>
//     );
//   };

//   // Reorder sections to desired sequence
//   const getOrderedSections = () => {
//     if (!step.sections) return [];
    
//     const basicInfo = step.sections.find((s: any) => s.id === "basicInfo");
//     const addressInfo = step.sections.find((s: any) => s.id === "addressInformation");
//     const alternateContact = step.sections.find((s: any) => s.id === "alternateContact");
//     const socialMedia = step.sections.find((s: any) => s.id === "socialMediaLinks");
    
//     return [basicInfo, addressInfo, alternateContact, socialMedia].filter(Boolean);
//   };

//   return (
//     <>
//       <h2 className="text-2xl font-bold text-amber-900 border-b border-amber-300 pb-2 mb-6">
//         {step.title}
//       </h2>

//       {step.categories && (
//         <div className="mb-8">
//           <h3 className="text-lg font-semibold text-slate-900 mb-3">Professional Category</h3>
//           <p className="text-sm text-slate-600 mb-4">
//             Select your Professional's main business category (you can select multiple)
//           </p>
//           <div className="flex justify-center">
//             <MultiSelect
//               options={step.categories.available}
//               selected={data.categories}
//               onChange={(vals) => updateField("categories", vals)}
//               variant="categories"
//             />
//           </div>
//         </div>
//       )}

//       {/* Render All Sections in Correct Order */}
//       {step.sections ? (
//         getOrderedSections().map(renderSection)
//       ) : (
//         /* Fallback for old structure - render only basicInfo */
//         <div className="space-y-4 p-6 bg-yellow-50 rounded-xl shadow-md">
//           <div className="space-y-4">
//             {step.basicInfo?.fields.map((f: any) => (
//               <div key={f.id} className="flex flex-col">
//                 <label className="mb-1 font-semibold text-slate-900 text-sm">{f.label}</label>
//                 <input
//                   type={f.type}
//                   required={f.required}
//                   placeholder={f.placeholder || ""}
//                   className={`border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm
//                     ${
//                       f.id === "user_name" && usernameAvailable === false
//                         ? "border-red-500 focus:ring-red-300"
//                         : ""
//                     }`}
//                   value={data.basicInfo?.[f.id] || ""}
//                   onChange={(e) =>
//                     updateField("basicInfo", { ...data.basicInfo, [f.id]: e.target.value })
//                   }
//                 />
//                 {f.id === "user_name" && data.basicInfo?.user_name && (
//                   <span className="text-xs mt-1">
//                     {checking
//                       ? "Checking availability..."
//                       : usernameAvailable === false
//                       ? "Username is taken"
//                       : usernameAvailable === true
//                       ? "Username is available"
//                       : ""}
//                   </span>
//                 )}
//               </div>
//             ))}
//           </div>
          
//         </div>
//       )}
//     </>
//   );
// };


// import { useState, useEffect } from "react";
// import { useForm } from "../../context/FormContext";
// import { MultiSelect } from "../common/MultiSelect";
// import { PhoneInput } from "../common/PhoneInput";
// import { CountryStateSelect } from "../common/CountryStateSelect";
// import { DatePicker } from "../common/DatePicker";

// export const Step1 = ({ step, setStepValid }: { step: any; setStepValid?: (valid: boolean) => void }) => {
//   const { data, updateField } = useForm();

//   const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
//   const [checking, setChecking] = useState(false);

//   // Check username availability when user types
//   useEffect(() => {
//     const user_name = data.basicInfo?.user_name || "";
//     if (!user_name) {
//       setUsernameAvailable(null);
//       setStepValid?.(true);
//       return;
//     }

//     const timer = setTimeout(async () => {
//       try {
//         setChecking(true);
//         const res = await fetch(
//           "https://0x1psamlyh.execute-api.ap-south-1.amazonaws.com/dev/professional-username-check",
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ user_name }),
//           }
//         );
//         const json = await res.json();
//         setUsernameAvailable(json.available);
//         setStepValid?.(json.available);
//       } catch (err) {
//         console.error(err);
//         setUsernameAvailable(null);
//         setStepValid?.(true);
//       } finally {
//         setChecking(false);
//       }
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [data.basicInfo?.user_name, setStepValid]);

//   // Render input field based on type
//   const renderInputField = (f: any, section: any) => {
//     const baseClasses = "border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm";

//     // Handle country and state fields with dynamic API
//     if ((f.id === "country" || f.id === "state") && (section.id === "basicInfo" || section.id === "addressInformation")) {
//       // For country and state fields, we'll handle them together in the section rendering
//       // This is a placeholder that won't be used since we'll render CountryStateSelect directly
//       return null;
//     }

//     // Handle gender dropdown
//     if (f.id === "gender") {
//       return (
//         <select
//           className={baseClasses}
//           value={data[section.id]?.[f.id] || ""}
//           onChange={(e) =>
//             updateField(section.id, { 
//               ...data[section.id], 
//               [f.id]: e.target.value 
//             })
//           }
//         >
//           <option value="">Select Gender</option>
//           <option value="male">Male</option>
//           <option value="female">Female</option>
//           <option value="non-binary">Non-binary</option>
//           <option value="prefer-not-to-say">Prefer not to say</option>
//         </select>
//       );
//     }

//     // Handle phone fields with IDD functionality - ONLY for specific contact phone field
//     const isContactPhoneField = section.id === "alternateContact" && f.id === "contactPhone";
    
//     if (isContactPhoneField) {
//       return (
//         <PhoneInput
//           value={data[section.id]?.[f.id] || ""}
//           onChange={(value) =>
//             updateField(section.id, { 
//               ...data[section.id], 
//               [f.id]: value 
//             })
//           }
//           placeholder={f.placeholder || "Enter phone number"}
//           required={f.required}
//           className=""
//         />
//       );
//     }

//     // For other phone-like fields, use regular input
//     const isPhoneField = (f.type === "tel" || 
//                         f.id.toLowerCase().includes("phone") || 
//                         f.id.toLowerCase().includes("mobile") || 
//                         f.id.toLowerCase().includes("contact")) && 
//                         !isContactPhoneField; // Exclude the specific contact phone field
    
//     if (isPhoneField) {
//       return (
//         <input
//           type="tel"
//           required={f.required}
//           placeholder={f.placeholder || ""}
//           className={baseClasses}
//           value={data[section.id]?.[f.id] || ""}
//           onChange={(e) =>
//             updateField(section.id, { 
//               ...data[section.id], 
//               [f.id]: e.target.value 
//             })
//           }
//         />
//       );
//     }

//     // Handle date fields with calendar UI
//     const isDateField = f.type === "date" || 
//                        f.id.toLowerCase().includes("date") || 
//                        f.id.toLowerCase().includes("birth") || 
//                        f.id.toLowerCase().includes("dob") || 
//                        f.id.toLowerCase().includes("established") || 
//                        f.id.toLowerCase().includes("incorporation");
    
//     if (isDateField) {
//       return (
//         <DatePicker
//           label={f.label}
//           value={data[section.id]?.[f.id] || ""}
//           onChange={(value) =>
//             updateField(section.id, { 
//               ...data[section.id], 
//               [f.id]: value 
//             })
//           }
//           required={f.required}
//           placeholder={f.placeholder || "Select date"}
//         />
//       );
//     }

//     return (
//       <input
//         type={f.type}
//         required={f.required}
//         placeholder={f.placeholder || ""}
//         className={`${baseClasses} ${
//           section.id === "basicInfo" && f.id === "user_name" && usernameAvailable === false
//             ? "border-red-500 focus:ring-red-300"
//             : ""
//         }`}
//         value={data[section.id]?.[f.id] || ""}
//         onChange={(e) =>
//           updateField(section.id, { 
//             ...data[section.id], 
//             [f.id]: e.target.value 
//           })
//         }
//       />
//     );
//   };

//   // Render a section
//   const renderSection = (section: any) => {
//     // Check if this section should use 2-column layout
//     const useTwoColumns = section.id === "socialMediaLinks" || section.id === "alternateContact";
    
//     return (
//       <div key={section.id} className="space-y-4 p-6 bg-yellow-50 rounded-xl shadow-md mb-6">
//         <h3 className="text-lg font-semibold text-slate-900 border-b border-amber-200 pb-2">
//           {section.title}
//         </h3>
        
//         {useTwoColumns ? (
//           // 2-column grid layout
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {section.fields.map((f: any) => {
//               // Skip country and state fields as they will be rendered together
//               if (f.id === "country" || f.id === "state") return null;
              
//               // Check if this is a date field (DatePicker handles its own label)
//               const isDateField = f.type === "date" || 
//                                  f.id.toLowerCase().includes("date") || 
//                                  f.id.toLowerCase().includes("birth") || 
//                                  f.id.toLowerCase().includes("dob") || 
//                                  f.id.toLowerCase().includes("established") || 
//                                  f.id.toLowerCase().includes("incorporation");
              
//               return (
//                 <div key={f.id} className="flex flex-col">
//                   {!isDateField && (
//                     <label className="mb-1 font-medium text-slate-800 text-sm">
//                       {f.label}
//                       {f.required && <span className="text-red-500 ml-1">*</span>}
//                     </label>
//                   )}
//                   {renderInputField(f, section)}
//                 </div>
//               );
//             })}
            
//             {/* Render CountryStateSelect if this section has country/state fields */}
//             {section.fields.some((f: any) => f.id === "country" || f.id === "state") && (
//               <div className="md:col-span-2">
//                 <CountryStateSelect
//                   countryValue={data[section.id]?.country || ""}
//                   stateValue={data[section.id]?.state || ""}
//                   onCountryChange={(value) => updateField(section.id, { 
//                     ...data[section.id], 
//                     country: value 
//                   })}
//                   onStateChange={(value) => updateField(section.id, { 
//                     ...data[section.id], 
//                     state: value 
//                   })}
//                   countryRequired={section.fields.find((f: any) => f.id === "country")?.required}
//                   stateRequired={section.fields.find((f: any) => f.id === "state")?.required}
//                 />
//               </div>
//             )}
//           </div>
//         ) : (
//           // Single column layout for basicInfo and addressInformation
//           <div className="space-y-4">
//             {section.fields.map((f: any) => {
//               // Skip country and state fields as they will be rendered together
//               if (f.id === "country" || f.id === "state") return null;
              
//               // Check if this is a date field (DatePicker handles its own label)
//               const isDateField = f.type === "date" || 
//                                  f.id.toLowerCase().includes("date") || 
//                                  f.id.toLowerCase().includes("birth") || 
//                                  f.id.toLowerCase().includes("dob") || 
//                                  f.id.toLowerCase().includes("established") || 
//                                  f.id.toLowerCase().includes("incorporation");
              
//               return (
//                 <div key={f.id} className="flex flex-col">
//                   {!isDateField && (
//                     <label className="mb-1 font-medium text-slate-800 text-sm">
//                       {f.label}
//                       {f.required && <span className="text-red-500 ml-1">*</span>}
//                     </label>
//                   )}
//                   {renderInputField(f, section)}
//                   {section.id === "basicInfo" && f.id === "user_name" && data.basicInfo?.user_name && (
//                     <span className={`text-xs mt-1 ${
//                       usernameAvailable === false ? 'text-red-600' : 
//                       usernameAvailable === true ? 'text-green-600' : 'text-gray-600'
//                     }`}>
//                       {checking
//                         ? "Checking availability..."
//                         : usernameAvailable === false
//                         ? "❌ Username is taken"
//                         : usernameAvailable === true
//                         ? "✅ Username is available"
//                         : ""}
//                     </span>
//                   )}
//                 </div>
//               );
//             })}
            
//             {/* Render CountryStateSelect if this section has country/state fields */}
//             {section.fields.some((f: any) => f.id === "country" || f.id === "state") && (
//               <CountryStateSelect
//                 countryValue={data[section.id]?.country || ""}
//                 stateValue={data[section.id]?.state || ""}
//                 onCountryChange={(value) => updateField(section.id, { 
//                   ...data[section.id], 
//                   country: value 
//                 })}
//                 onStateChange={(value) => updateField(section.id, { 
//                   ...data[section.id], 
//                   state: value 
//                 })}
//                 countryRequired={section.fields.find((f: any) => f.id === "country")?.required}
//                 stateRequired={section.fields.find((f: any) => f.id === "state")?.required}
//               />
//             )}
//           </div>
//         )}
//       </div>
//     );
//   };

//   // Reorder sections to desired sequence
//   const getOrderedSections = () => {
//     if (!step.sections) return [];
    
//     const basicInfo = step.sections.find((s: any) => s.id === "basicInfo");
//     const addressInfo = step.sections.find((s: any) => s.id === "addressInformation");
//     const alternateContact = step.sections.find((s: any) => s.id === "alternateContact");
//     const socialMedia = step.sections.find((s: any) => s.id === "socialMediaLinks");
    
//     return [basicInfo, addressInfo, alternateContact, socialMedia].filter(Boolean);
//   };

//   return (
//     <>
//       <h2 className="text-2xl font-bold text-amber-900 border-b border-amber-300 pb-2 mb-6">
//         {step.title}
//       </h2>

//       {step.categories && (
//         <div className="mb-8">
//           <h3 className="text-lg font-semibold text-slate-900 mb-3">Professional Category</h3>
//           <p className="text-sm text-slate-600 mb-4">
//             Select your Professional's main business category (you can select multiple)
//           </p>
//           <div className="flex justify-center">
//             <MultiSelect
//               options={step.categories.available}
//               selected={data.categories}
//               onChange={(vals) => updateField("categories", vals)}
//               variant="categories"
//             />
//           </div>
//         </div>
//       )}

//       {/* Render All Sections in Correct Order */}
//       {step.sections ? (
//         getOrderedSections().map(renderSection)
//       ) : (
//         /* Fallback for old structure - render only basicInfo */
//         <div className="space-y-4 p-6 bg-yellow-50 rounded-xl shadow-md">
//           <div className="space-y-4">
//             {step.basicInfo?.fields.map((f: any) => (
//               <div key={f.id} className="flex flex-col">
//                 <label className="mb-1 font-semibold text-slate-900 text-sm">{f.label}</label>
//                 <input
//                   type={f.type}
//                   required={f.required}
//                   placeholder={f.placeholder || ""}
//                   className={`border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm
//                     ${
//                       f.id === "user_name" && usernameAvailable === false
//                         ? "border-red-500 focus:ring-red-300"
//                         : ""
//                     }`}
//                   value={data.basicInfo?.[f.id] || ""}
//                   onChange={(e) =>
//                     updateField("basicInfo", { ...data.basicInfo, [f.id]: e.target.value })
//                   }
//                 />
//                 {f.id === "user_name" && data.basicInfo?.user_name && (
//                   <span className="text-xs mt-1">
//                     {checking
//                       ? "Checking availability..."
//                       : usernameAvailable === false
//                       ? "Username is taken"
//                       : usernameAvailable === true
//                       ? "Username is available"
//                       : ""}
//                   </span>
//                 )}
//               </div>
//             ))}
//           </div>
          
//         </div>
//       )}
//     </>
//   );
// };

// import { useState, useEffect } from "react";
// import { useForm } from "../../context/FormContext";
// import { MultiSelect } from "../common/MultiSelect";
// import { PhoneInput } from "../common/PhoneInput";
// import { CountryStateSelect } from "../common/CountryStateSelect";
// import { DatePicker } from "../common/DatePicker";

// export const Step1 = ({ step, setStepValid }: { step: any; setStepValid?: (valid: boolean) => void }) => {
//   const { data, updateField } = useForm();

//   const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
//   const [checking, setChecking] = useState(false);
//   const [originalUsername, setOriginalUsername] = useState<string | null>(null);

//   // Set original username when component mounts or when data loads
//   useEffect(() => {
//     if (data.basicInfo?.user_name && !originalUsername) {
//       setOriginalUsername(data.basicInfo.user_name);
//       // Mark as available since it's the user's own username
//       setUsernameAvailable(true);
//       setStepValid?.(true);
//     }
//   }, [data.basicInfo?.user_name, originalUsername, setStepValid]);

//   // Check username availability when user types
//   useEffect(() => {
//     const user_name = data.basicInfo?.user_name || "";
    
//     if (!user_name) {
//       setUsernameAvailable(null);
//       setStepValid?.(true);
//       return;
//     }

//     // If username is the same as original (user's own username), don't check
//     if (originalUsername && user_name === originalUsername) {
//       setUsernameAvailable(true);
//       setStepValid?.(true);
//       return;
//     }

//     const timer = setTimeout(async () => {
//       try {
//         setChecking(true);
//         const res = await fetch(
//           "https://0x1psamlyh.execute-api.ap-south-1.amazonaws.com/dev/professional-username-check",
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ user_name }),
//           }
//         );
//         const json = await res.json();
//         setUsernameAvailable(json.available);
//         setStepValid?.(json.available);
//       } catch (err) {
//         console.error(err);
//         setUsernameAvailable(null);
//         setStepValid?.(true);
//       } finally {
//         setChecking(false);
//       }
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [data.basicInfo?.user_name, originalUsername, setStepValid]);

//   // Render input field based on type
//   const renderInputField = (f: any, section: any) => {
//     const baseClasses = "border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm";

//     // Handle country and state fields with dynamic API
//     if ((f.id === "country" || f.id === "state") && (section.id === "basicInfo" || section.id === "addressInformation")) {
//       // For country and state fields, we'll handle them together in the section rendering
//       // This is a placeholder that won't be used since we'll render CountryStateSelect directly
//       return null;
//     }

//     // Handle gender dropdown
//     if (f.id === "gender") {
//       return (
//         <select
//           className={baseClasses}
//           value={data[section.id]?.[f.id] || ""}
//           onChange={(e) =>
//             updateField(section.id, { 
//               ...data[section.id], 
//               [f.id]: e.target.value 
//             })
//           }
//         >
//           <option value="">Select Gender</option>
//           <option value="male">Male</option>
//           <option value="female">Female</option>
//           <option value="non-binary">Non-binary</option>
//           <option value="prefer-not-to-say">Prefer not to say</option>
//         </select>
//       );
//     }

//     // Handle phone fields with IDD functionality - ONLY for specific contact phone field
//     const isContactPhoneField = section.id === "alternateContact" && f.id === "contactPhone";
    
//     if (isContactPhoneField) {
//       return (
//         <PhoneInput
//           value={data[section.id]?.[f.id] || ""}
//           onChange={(value) =>
//             updateField(section.id, { 
//               ...data[section.id], 
//               [f.id]: value 
//             })
//           }
//           placeholder={f.placeholder || "Enter phone number"}
//           required={f.required}
//           className=""
//         />
//       );
//     }

//     // For other phone-like fields, use regular input
//     const isPhoneField = (f.type === "tel" || 
//                         f.id.toLowerCase().includes("phone") || 
//                         f.id.toLowerCase().includes("mobile") || 
//                         f.id.toLowerCase().includes("contact")) && 
//                         !isContactPhoneField; // Exclude the specific contact phone field
    
//     if (isPhoneField) {
//       return (
//         <input
//           type="tel"
//           required={f.required}
//           placeholder={f.placeholder || ""}
//           className={baseClasses}
//           value={data[section.id]?.[f.id] || ""}
//           onChange={(e) =>
//             updateField(section.id, { 
//               ...data[section.id], 
//               [f.id]: e.target.value 
//             })
//           }
//         />
//       );
//     }

//     // Handle date fields with calendar UI
//     const isDateField = f.type === "date" || 
//                        f.id.toLowerCase().includes("date") || 
//                        f.id.toLowerCase().includes("birth") || 
//                        f.id.toLowerCase().includes("dob") || 
//                        f.id.toLowerCase().includes("established") || 
//                        f.id.toLowerCase().includes("incorporation");
    
//     if (isDateField) {
//       return (
//         <DatePicker
//           label={f.label}
//           value={data[section.id]?.[f.id] || ""}
//           onChange={(value) =>
//             updateField(section.id, { 
//               ...data[section.id], 
//               [f.id]: value 
//             })
//           }
//           required={f.required}
//           placeholder={f.placeholder || "Select date"}
//         />
//       );
//     }

//     return (
//       <input
//         type={f.type}
//         required={f.required}
//         placeholder={f.placeholder || ""}
//         className={`${baseClasses} ${
//           section.id === "basicInfo" && f.id === "user_name" && usernameAvailable === false
//             ? "border-red-500 focus:ring-red-300"
//             : ""
//         }`}
//         value={data[section.id]?.[f.id] || ""}
//         onChange={(e) =>
//           updateField(section.id, { 
//             ...data[section.id], 
//             [f.id]: e.target.value 
//           })
//         }
//       />
//     );
//   };

//   // Render a section
//   const renderSection = (section: any) => {
//     // Check if this section should use 2-column layout
//     const useTwoColumns = section.id === "socialMediaLinks" || section.id === "alternateContact";
    
//     return (
//       <div key={section.id} className="space-y-4 p-6 bg-yellow-50 rounded-xl shadow-md mb-6">
//         <h3 className="text-lg font-semibold text-slate-900 border-b border-amber-200 pb-2">
//           {section.title}
//         </h3>
        
//         {useTwoColumns ? (
//           // 2-column grid layout
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {section.fields.map((f: any) => {
//               // Skip country and state fields as they will be rendered together
//               if (f.id === "country" || f.id === "state") return null;
              
//               // Check if this is a date field (DatePicker handles its own label)
//               const isDateField = f.type === "date" || 
//                                  f.id.toLowerCase().includes("date") || 
//                                  f.id.toLowerCase().includes("birth") || 
//                                  f.id.toLowerCase().includes("dob") || 
//                                  f.id.toLowerCase().includes("established") || 
//                                  f.id.toLowerCase().includes("incorporation");
              
//               return (
//                 <div key={f.id} className="flex flex-col">
//                   {!isDateField && (
//                     <label className="mb-1 font-medium text-slate-800 text-sm">
//                       {f.label}
//                       {f.required && <span className="text-red-500 ml-1">*</span>}
//                     </label>
//                   )}
//                   {renderInputField(f, section)}
//                 </div>
//               );
//             })}
            
//             {/* Render CountryStateSelect if this section has country/state fields */}
//             {section.fields.some((f: any) => f.id === "country" || f.id === "state") && (
//               <div className="md:col-span-2">
//                 <CountryStateSelect
//                   countryValue={data[section.id]?.country || ""}
//                   stateValue={data[section.id]?.state || ""}
//                   onCountryChange={(value) => updateField(section.id, { 
//                     ...data[section.id], 
//                     country: value 
//                   })}
//                   onStateChange={(value) => updateField(section.id, { 
//                     ...data[section.id], 
//                     state: value 
//                   })}
//                   countryRequired={section.fields.find((f: any) => f.id === "country")?.required}
//                   stateRequired={section.fields.find((f: any) => f.id === "state")?.required}
//                 />
//               </div>
//             )}
//           </div>
//         ) : (
//           // Single column layout for basicInfo and addressInformation
//           <div className="space-y-4">
//             {section.fields.map((f: any) => {
//               // Skip country and state fields as they will be rendered together
//               if (f.id === "country" || f.id === "state") return null;
              
//               // Check if this is a date field (DatePicker handles its own label)
//               const isDateField = f.type === "date" || 
//                                  f.id.toLowerCase().includes("date") || 
//                                  f.id.toLowerCase().includes("birth") || 
//                                  f.id.toLowerCase().includes("dob") || 
//                                  f.id.toLowerCase().includes("established") || 
//                                  f.id.toLowerCase().includes("incorporation");
              
//               return (
//                 <div key={f.id} className="flex flex-col">
//                   {!isDateField && (
//                     <label className="mb-1 font-medium text-slate-800 text-sm">
//                       {f.label}
//                       {f.required && <span className="text-red-500 ml-1">*</span>}
//                     </label>
//                   )}
//                   {renderInputField(f, section)}
//                   {section.id === "basicInfo" && f.id === "user_name" && data.basicInfo?.user_name && (
//                     <span className={`text-xs mt-1 ${
//                       usernameAvailable === false ? 'text-red-600' : 
//                       usernameAvailable === true ? 'text-green-600' : 'text-gray-600'
//                     }`}>
//                       {checking
//                         ? "Checking availability..."
//                         : usernameAvailable === false
//                         ? "❌ Username is taken"
//                         : usernameAvailable === true && originalUsername && data.basicInfo.user_name === originalUsername
//                         ? "✅ Your username"
//                         : usernameAvailable === true
//                         ? "✅ Username is available"
//                         : ""}
//                     </span>
//                   )}
//                 </div>
//               );
//             })}
            
//             {/* Render CountryStateSelect if this section has country/state fields */}
//             {section.fields.some((f: any) => f.id === "country" || f.id === "state") && (
//               <CountryStateSelect
//                 countryValue={data[section.id]?.country || ""}
//                 stateValue={data[section.id]?.state || ""}
//                 onCountryChange={(value) => updateField(section.id, { 
//                   ...data[section.id], 
//                   country: value 
//                 })}
//                 onStateChange={(value) => updateField(section.id, { 
//                   ...data[section.id], 
//                   state: value 
//                 })}
//                 countryRequired={section.fields.find((f: any) => f.id === "country")?.required}
//                 stateRequired={section.fields.find((f: any) => f.id === "state")?.required}
//               />
//             )}
//           </div>
//         )}
//       </div>
//     );
//   };

//   // Reorder sections to desired sequence
//   const getOrderedSections = () => {
//     if (!step.sections) return [];
    
//     const basicInfo = step.sections.find((s: any) => s.id === "basicInfo");
//     const addressInfo = step.sections.find((s: any) => s.id === "addressInformation");
//     const alternateContact = step.sections.find((s: any) => s.id === "alternateContact");
//     const socialMedia = step.sections.find((s: any) => s.id === "socialMediaLinks");
    
//     return [basicInfo, addressInfo, alternateContact, socialMedia].filter(Boolean);
//   };

//   return (
//     <>
//       <h2 className="text-2xl font-bold text-amber-900 border-b border-amber-300 pb-2 mb-6">
//         {step.title}
//       </h2>

//       {step.categories && (
//         <div className="mb-8">
//           <h3 className="text-lg font-semibold text-slate-900 mb-3">Professional Category</h3>
//           <p className="text-sm text-slate-600 mb-4">
//             Select your Professional's main business category (you can select multiple)
//           </p>
//           <div className="flex justify-center">
//             <MultiSelect
//               options={step.categories.available}
//               selected={data.categories}
//               onChange={(vals) => updateField("categories", vals)}
//               variant="categories"
//             />
//           </div>
//         </div>
//       )}

//       {/* Render All Sections in Correct Order */}
//       {step.sections ? (
//         getOrderedSections().map(renderSection)
//       ) : (
//         /* Fallback for old structure - render only basicInfo */
//         <div className="space-y-4 p-6 bg-yellow-50 rounded-xl shadow-md">
//           <div className="space-y-4">
//             {step.basicInfo?.fields.map((f: any) => (
//               <div key={f.id} className="flex flex-col">
//                 <label className="mb-1 font-semibold text-slate-900 text-sm">{f.label}</label>
//                 <input
//                   type={f.type}
//                   required={f.required}
//                   placeholder={f.placeholder || ""}
//                   className={`border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm
//                     ${
//                       f.id === "user_name" && usernameAvailable === false
//                         ? "border-red-500 focus:ring-red-300"
//                         : ""
//                     }`}
//                   value={data.basicInfo?.[f.id] || ""}
//                   onChange={(e) =>
//                     updateField("basicInfo", { ...data.basicInfo, [f.id]: e.target.value })
//                   }
//                 />
//                 {f.id === "user_name" && data.basicInfo?.user_name && (
//                   <span className={`text-xs mt-1 ${
//                     usernameAvailable === false ? 'text-red-600' : 
//                     usernameAvailable === true && originalUsername && data.basicInfo.user_name === originalUsername
//                     ? 'text-green-600' : 'text-gray-600'
//                   }`}>
//                     {checking
//                       ? "Checking availability..."
//                       : usernameAvailable === false
//                       ? "Username is taken"
//                       : usernameAvailable === true && originalUsername && data.basicInfo.user_name === originalUsername
//                       ? "Your username"
//                       : usernameAvailable === true
//                       ? "Username is available"
//                       : ""}
//                   </span>
//                 )}
//               </div>
//             ))}
//           </div>
          
//         </div>
//       )}
//     </>
//   );
// };



// import { useState, useEffect } from "react";
// import { useForm } from "../../context/FormContext";
// import { DatePicker } from "../common/DatePicker";

// export const Step1 = ({ step, setStepValid }: { step: any; setStepValid?: (valid: boolean) => void }) => {
//   const { data, updateField } = useForm();

//   // Validation effect for required fields
//   useEffect(() => {
//     if (!step.fields) return;

//     const requiredFields = step.fields.filter((field: any) => field.required);
//     const isValid = requiredFields.every((field: any) => {
//       const value = data[field.id];
//       return value !== undefined && value !== null && value !== '';
//     });

//     setStepValid?.(isValid);
//   }, [data, step.fields, setStepValid]);

//   // Render input field based on type
//   const renderInputField = (field: any) => {
//     const baseClasses = "border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm w-full";

//     // Handle date fields
//     if (field.type === "date") {
//       return (
//         <DatePicker
//           value={data[field.id] || ""}
//           onChange={(value) => updateField(field.id, value)}
//           required={field.required}
//           placeholder="Select date"
//         />
//       );
//     }

//     // Handle time fields
//     if (field.type === "time") {
//       return (
//         <input
//           type="time"
//           className={baseClasses}
//           value={data[field.id] || ""}
//           onChange={(e) => updateField(field.id, e.target.value)}
//           required={field.required}
//         />
//       );
//     }

//     // Handle datetime fields
//     if (field.type === "datetime") {
//       return (
//         <input
//           type="datetime-local"
//           className={baseClasses}
//           value={data[field.id] || ""}
//           onChange={(e) => updateField(field.id, e.target.value)}
//           required={field.required}
//         />
//       );
//     }

//     // Handle textarea fields
//     if (field.type === "textarea") {
//       return (
//         <textarea
//           className={`${baseClasses} min-h-[100px] resize-vertical`}
//           value={data[field.id] || ""}
//           onChange={(e) => updateField(field.id, e.target.value)}
//           required={field.required}
//           placeholder={field.placeholder || ""}
//           rows={4}
//         />
//       );
//     }

//     // Handle checkbox fields
//     if (field.type === "checkbox") {
//       return (
//         <div className="flex items-center">
//           <input
//             type="checkbox"
//             className="w-4 h-4 text-amber-600 border-amber-300 rounded focus:ring-amber-500"
//             checked={data[field.id] || false}
//             onChange={(e) => updateField(field.id, e.target.checked)}
//           />
//           <label className="ml-2 text-sm text-slate-700">
//             Enable countdown
//           </label>
//         </div>
//       );
//     }

//     // Default text input
//     return (
//       <input
//         type={field.type}
//         className={baseClasses}
//         value={data[field.id] || ""}
//         onChange={(e) => updateField(field.id, e.target.value)}
//         required={field.required}
//         placeholder={field.placeholder || ""}
//       />
//     );
//   };

//   // Generate human-readable label from field ID
//   const generateLabel = (fieldId: string): string => {
//     const labelMap: { [key: string]: string } = {
//       eventTitle: "Event Title",
//       eventTagline: "Event Tagline",
//       startDate: "Start Date",
//       endDate: "End Date",
//       timeStart: "Start Time",
//       timeEnd: "End Time",
//       venueName: "Venue Name",
//       venueAddress: "Venue Address",
//       organizer: "Organizer",
//       eventDescription: "Event Description",
//       countdownEnabled: "Enable Countdown",
//       countdownTargetDate: "Countdown Target Date"
//     };

//     return labelMap[fieldId] || fieldId
//       .replace(/([A-Z])/g, ' $1')
//       .replace(/^./, str => str.toUpperCase());
//   };

//   // Group fields for better layout
//   const groupFields = () => {
//     if (!step.fields) return [];

//     const groups = [
//       {
//         title: "Event Details",
//         fields: step.fields.filter((f: any) => 
//           ['eventTitle', 'eventTagline', 'eventDescription'].includes(f.id)
//         )
//       },
//       {
//         title: "Date & Time",
//         fields: step.fields.filter((f: any) => 
//           ['startDate', 'endDate', 'timeStart', 'timeEnd'].includes(f.id)
//         )
//       },
//       {
//         title: "Venue Information",
//         fields: step.fields.filter((f: any) => 
//           ['venueName', 'venueAddress'].includes(f.id)
//         )
//       },
//       {
//         title: "Organizer",
//         fields: step.fields.filter((f: any) => 
//           ['organizer'].includes(f.id)
//         )
//       },
//       {
//         title: "Countdown Settings",
//         fields: step.fields.filter((f: any) => 
//           ['countdownEnabled', 'countdownTargetDate'].includes(f.id)
//         )
//       }
//     ];

//     return groups.filter(group => group.fields.length > 0);
//   };

//   const fieldGroups = groupFields();

//   return (
//     <>
//       <h2 className="text-2xl font-bold text-amber-900 border-b border-amber-300 pb-2 mb-6">
//         {step.title}
//       </h2>

//       <div className="space-y-8">
//         {fieldGroups.map((group, index) => (
//           <div key={index} className="space-y-4 p-6 bg-yellow-50 rounded-xl shadow-md">
//             <h3 className="text-lg font-semibold text-slate-900 border-b border-amber-200 pb-2">
//               {group.title}
//             </h3>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {group.fields.map((field: any) => {
//                 // Special handling for countdown fields - show target date only when enabled
//                 if (field.id === 'countdownTargetDate' && !data.countdownEnabled) {
//                   return null;
//                 }

//                 // Full width for certain fields
//                 const isFullWidth = [
//                   'eventDescription', 
//                   'venueAddress', 
//                   'eventTagline'
//                 ].includes(field.id);

//                 return (
//                   <div 
//                     key={field.id} 
//                     className={`flex flex-col ${isFullWidth ? 'md:col-span-2' : ''}`}
//                   >
//                     <label className="mb-1 font-medium text-slate-800 text-sm">
//                       {generateLabel(field.id)}
//                       {field.required && <span className="text-red-500 ml-1">*</span>}
//                     </label>
//                     {renderInputField(field)}
                    
//                     {/* Helper text for specific fields */}
//                     {field.id === 'countdownTargetDate' && (
//                       <p className="text-xs text-slate-500 mt-1">
//                         Set the date and time for the countdown timer
//                       </p>
//                     )}
                    
//                     {field.id === 'eventTagline' && (
//                       <p className="text-xs text-slate-500 mt-1">
//                         A catchy phrase that summarizes your event
//                       </p>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         ))}
//       </div>
//     </>
//   );
// };

// import { useState, useEffect } from "react";
// import { useForm } from "../../context/FormContext";
// import { DatePicker } from "../common/DatePicker";

// export const Step1 = ({ step, setStepValid }: { step: any; setStepValid?: (valid: boolean) => void }) => {
//   const { data, updateField } = useForm();

//   // Validation effect for required fields - SIMPLIFIED VERSION
//   useEffect(() => {
//     if (!step.fields) return;

//     const requiredFields = step.fields.filter((field: any) => field.required);
//     const isValid = requiredFields.every((field: any) => {
//       const value = data[field.id];
//       return value !== undefined && value !== null && value !== '';
//     });

//     setStepValid?.(isValid);
//   }, [data, step.fields, setStepValid]);

//   // Render input field based on type
//   const renderInputField = (field: any) => {
//     const baseClasses = "border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm w-full";

//     // Handle date fields
//     if (field.type === "date") {
//       return (
//         <DatePicker
//           value={data[field.id] || ""}
//           onChange={(value) => updateField(field.id, value)}
//           required={field.required}
//           placeholder="Select date"
//         />
//       );
//     }

//     // Handle time fields
//     if (field.type === "time") {
//       return (
//         <input
//           type="time"
//           className={baseClasses}
//           value={data[field.id] || ""}
//           onChange={(e) => updateField(field.id, e.target.value)}
//           required={field.required}
//         />
//       );
//     }

//     // Handle datetime fields
//     if (field.type === "datetime") {
//       return (
//         <input
//           type="datetime-local"
//           className={baseClasses}
//           value={data[field.id] || ""}
//           onChange={(e) => updateField(field.id, e.target.value)}
//           required={field.required}
//         />
//       );
//     }

//     // Handle textarea fields
//     if (field.type === "textarea") {
//       return (
//         <textarea
//           className={`${baseClasses} min-h-[100px] resize-vertical`}
//           value={data[field.id] || ""}
//           onChange={(e) => updateField(field.id, e.target.value)}
//           required={field.required}
//           placeholder={field.placeholder || ""}
//           rows={4}
//         />
//       );
//     }

//     // Handle checkbox fields
//     if (field.type === "checkbox") {
//       return (
//         <div className="flex items-center">
//           <input
//             type="checkbox"
//             className="w-4 h-4 text-amber-600 border-amber-300 rounded focus:ring-amber-500"
//             checked={data[field.id] || false}
//             onChange={(e) => updateField(field.id, e.target.checked)}
//           />
//           <label className="ml-2 text-sm text-slate-700">
//             Enable countdown
//           </label>
//         </div>
//       );
//     }

//     // Default text input
//     return (
//       <input
//         type={field.type}
//         className={baseClasses}
//         value={data[field.id] || ""}
//         onChange={(e) => updateField(field.id, e.target.value)}
//         required={field.required}
//         placeholder={field.placeholder || ""}
//       />
//     );
//   };

//   // Generate human-readable label from field ID
//   const generateLabel = (fieldId: string): string => {
//     const labelMap: { [key: string]: string } = {
//       eventTitle: "Event Title",
//       eventTagline: "Event Tagline",
//       startDate: "Start Date",
//       endDate: "End Date",
//       timeStart: "Start Time",
//       timeEnd: "End Time",
//       venueName: "Venue Name",
//       venueAddress: "Venue Address",
//       organizer: "Organizer",
//       eventDescription: "Event Description",
//       countdownEnabled: "Enable Countdown",
//       countdownTargetDate: "Countdown Target Date"
//     };

//     return labelMap[fieldId] || fieldId
//       .replace(/([A-Z])/g, ' $1')
//       .replace(/^./, str => str.toUpperCase());
//   };

//   // Group fields for better layout
//   const groupFields = () => {
//     if (!step.fields) return [];

//     const groups = [
//       {
//         title: "Event Details",
//         fields: step.fields.filter((f: any) => 
//           ['eventTitle', 'eventTagline', 'eventDescription'].includes(f.id)
//         )
//       },
//       {
//         title: "Date & Time",
//         fields: step.fields.filter((f: any) => 
//           ['startDate', 'endDate', 'timeStart', 'timeEnd'].includes(f.id)
//         )
//       },
//       {
//         title: "Venue Information",
//         fields: step.fields.filter((f: any) => 
//           ['venueName', 'venueAddress'].includes(f.id)
//         )
//       },
//       {
//         title: "Organizer",
//         fields: step.fields.filter((f: any) => 
//           ['organizer'].includes(f.id)
//         )
//       },
//       {
//         title: "Countdown Settings",
//         fields: step.fields.filter((f: any) => 
//           ['countdownEnabled', 'countdownTargetDate'].includes(f.id)
//         )
//       }
//     ];

//     return groups.filter(group => group.fields.length > 0);
//   };

//   const fieldGroups = groupFields();

//   return (
//     <>
//       <h2 className="text-2xl font-bold text-amber-900 border-b border-amber-300 pb-2 mb-6">
//         {step.title}
//       </h2>

//       <div className="space-y-8">
//         {fieldGroups.map((group, index) => (
//           <div key={index} className="space-y-4 p-6 bg-yellow-50 rounded-xl shadow-md">
//             <h3 className="text-lg font-semibold text-slate-900 border-b border-amber-200 pb-2">
//               {group.title}
//             </h3>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {group.fields.map((field: any) => {
//                 // Special handling for countdown fields - show target date only when enabled
//                 if (field.id === 'countdownTargetDate' && !data.countdownEnabled) {
//                   return null;
//                 }

//                 // Full width for certain fields
//                 const isFullWidth = [
//                   'eventDescription', 
//                   'venueAddress', 
//                   'eventTagline'
//                 ].includes(field.id);

//                 return (
//                   <div 
//                     key={field.id} 
//                     className={`flex flex-col ${isFullWidth ? 'md:col-span-2' : ''}`}
//                   >
//                     <label className="mb-1 font-medium text-slate-800 text-sm">
//                       {generateLabel(field.id)}
//                       {field.required && <span className="text-red-500 ml-1">*</span>}
//                     </label>
//                     {renderInputField(field)}
                    
//                     {/* Helper text for specific fields */}
//                     {field.id === 'countdownTargetDate' && (
//                       <p className="text-xs text-slate-500 mt-1">
//                         Set the date and time for the countdown timer
//                       </p>
//                     )}
                    
//                     {field.id === 'eventTagline' && (
//                       <p className="text-xs text-slate-500 mt-1">
//                         A catchy phrase that summarizes your event
//                       </p>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         ))}
//       </div>
//     </>
//   );
// };


// import { useState, useEffect } from "react";
// import { useForm } from "../../context/FormContext";
// import { DatePicker } from "../common/DatePicker";

// export const Step1 = ({ step, setStepValid }: { step: any; setStepValid?: (valid: boolean) => void }) => {
//   const { data, updateField } = useForm();

//   // Character limits configuration
//   const characterLimits = {
//     eventTitle: 25,
//     eventTagline: 50,
//     eventDescription: 200,
//     venueName: 25,
//     venueAddress: 200
//   };

//   // Validation effect for required fields - UPDATED VERSION
//   useEffect(() => {
//     if (!step.fields) return;

//     const requiredFields = step.fields.filter((field: any) => field.required);
//     const isValid = requiredFields.every((field: any) => {
//       const value = data[field.id];
//       return value !== undefined && value !== null && value !== '';
//     });

//     setStepValid?.(isValid);
//   }, [data, step.fields, setStepValid]);

//   // Render input field based on type
//   const renderInputField = (field: any) => {
//     const baseClasses = "border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm w-full";
//     const currentValue = data[field.id] || "";
//     const charLimit = characterLimits[field.id as keyof typeof characterLimits];
//     const charsRemaining = charLimit ? charLimit - currentValue.length : null;

//     // Handle date fields
//     if (field.type === "date") {
//       return (
//         <DatePicker
//           value={currentValue}
//           onChange={(value) => updateField(field.id, value)}
//           required={field.required}
//           placeholder="Select date"
//         />
//       );
//     }

//     // Handle time fields
//     if (field.type === "time") {
//       return (
//         <input
//           type="time"
//           className={baseClasses}
//           value={currentValue}
//           onChange={(e) => updateField(field.id, e.target.value)}
//           required={field.required}
//         />
//       );
//     }

//     // Handle datetime fields
//     if (field.type === "datetime") {
//       return (
//         <input
//           type="datetime-local"
//           className={baseClasses}
//           value={currentValue}
//           onChange={(e) => updateField(field.id, e.target.value)}
//           required={field.required}
//         />
//       );
//     }

//     // Handle textarea fields
//     if (field.type === "textarea") {
//       return (
//         <div className="relative">
//           <textarea
//             className={`${baseClasses} min-h-[100px] resize-vertical pr-10`}
//             value={currentValue}
//             onChange={(e) => {
//               if (charLimit && e.target.value.length > charLimit) {
//                 e.target.value = e.target.value.slice(0, charLimit);
//               }
//               updateField(field.id, e.target.value);
//             }}
//             required={field.required}
//             placeholder={field.placeholder || ""}
//             rows={4}
//             maxLength={charLimit}
//           />
//           {charLimit && (
//             <div className={`absolute bottom-2 right-2 text-xs ${
//               charsRemaining && charsRemaining < 10 ? 'text-red-500' : 'text-slate-500'
//             }`}>
//               {charsRemaining}
//             </div>
//           )}
//         </div>
//       );
//     }

//     // Handle checkbox fields
//     if (field.type === "checkbox") {
//       return (
//         <div className="flex items-center">
//           <input
//             type="checkbox"
//             className="w-4 h-4 text-amber-600 border-amber-300 rounded focus:ring-amber-500"
//             checked={data[field.id] || false}
//             onChange={(e) => updateField(field.id, e.target.checked)}
//           />
//           <label className="ml-2 text-sm text-slate-700">
//             Enable countdown
//           </label>
//         </div>
//       );
//     }

//     // Default text input with character limit
//     return (
//       <div className="relative">
//         <input
//           type={field.type}
//           className={`${baseClasses} ${charLimit ? 'pr-10' : ''}`}
//           value={currentValue}
//           onChange={(e) => {
//             if (charLimit && e.target.value.length > charLimit) {
//               e.target.value = e.target.value.slice(0, charLimit);
//             }
//             updateField(field.id, e.target.value);
//           }}
//           required={field.required}
//           placeholder={field.placeholder || ""}
//           maxLength={charLimit}
//         />
//         {charLimit && (
//           <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-xs ${
//             charsRemaining && charsRemaining < 10 ? 'text-red-500' : 'text-slate-500'
//           }`}>
//             {charsRemaining}
//           </div>
//         )}
//       </div>
//     );
//   };

//   // Generate human-readable label from field ID
//   const generateLabel = (fieldId: string): string => {
//     const labelMap: { [key: string]: string } = {
//       eventTitle: "Event Title",
//       eventTagline: "Event Tagline",
//       startDate: "Start Date",
//       endDate: "End Date",
//       timeStart: "Start Time",
//       timeEnd: "End Time",
//       venueName: "Venue Name",
//       venueAddress: "Venue Address",
//       organizer: "Organizer",
//       eventDescription: "Event Description",
//       countdownEnabled: "Enable Countdown",
//       countdownTargetDate: "Countdown Target Date"
//     };

//     return labelMap[fieldId] || fieldId
//       .replace(/([A-Z])/g, ' $1')
//       .replace(/^./, str => str.toUpperCase());
//   };

//   // Group fields for better layout
//   const groupFields = () => {
//     if (!step.fields) return [];

//     const groups = [
//       {
//         title: "Event Details",
//         fields: step.fields.filter((f: any) => 
//           ['eventTitle', 'eventTagline', 'eventDescription'].includes(f.id)
//         )
//       },
//       {
//         title: "Date & Time",
//         fields: step.fields.filter((f: any) => 
//           ['startDate', 'endDate', 'timeStart', 'timeEnd'].includes(f.id)
//         )
//       },
//       {
//         title: "Venue Information",
//         fields: step.fields.filter((f: any) => 
//           ['venueName', 'venueAddress'].includes(f.id)
//         )
//       },
//       {
//         title: "Organizer",
//         fields: step.fields.filter((f: any) => 
//           ['organizer'].includes(f.id)
//         )
//       },
//       {
//         title: "Countdown Settings",
//         fields: step.fields.filter((f: any) => 
//           ['countdownEnabled', 'countdownTargetDate'].includes(f.id)
//         )
//       }
//     ];

//     return groups.filter(group => group.fields.length > 0);
//   };

//   const fieldGroups = groupFields();

//   return (
//     <>
//       <h2 className="text-2xl font-bold text-amber-900 border-b border-amber-300 pb-2 mb-6">
//         {step.title}
//       </h2>

//       <div className="space-y-8">
//         {fieldGroups.map((group, index) => (
//           <div key={index} className="space-y-4 p-6 bg-yellow-50 rounded-xl shadow-md">
//             <h3 className="text-lg font-semibold text-slate-900 border-b border-amber-200 pb-2">
//               {group.title}
//             </h3>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {group.fields.map((field: any) => {
//                 // Special handling for countdown fields - show target date only when enabled
//                 if (field.id === 'countdownTargetDate' && !data.countdownEnabled) {
//                   return null;
//                 }

//                 // Full width for certain fields
//                 const isFullWidth = [
//                   'eventDescription', 
//                   'venueAddress', 
//                   'eventTagline'
//                 ].includes(field.id);

//                 const charLimit = characterLimits[field.id as keyof typeof characterLimits];

//                 return (
//                   <div 
//                     key={field.id} 
//                     className={`flex flex-col ${isFullWidth ? 'md:col-span-2' : ''}`}
//                   >
//                     <label className="mb-1 font-medium text-slate-800 text-sm">
//                       {generateLabel(field.id)}
//                       {field.required && <span className="text-red-500 ml-1">*</span>}
//                       {charLimit && (
//                         <span className="text-slate-500 text-xs font-normal ml-2">
//                           (max {charLimit} characters)
//                         </span>
//                       )}
//                     </label>
//                     {renderInputField(field)}
                    
//                     {/* Helper text for specific fields */}
//                     {field.id === 'countdownTargetDate' && (
//                       <p className="text-xs text-slate-500 mt-1">
//                         Set the date and time for the countdown timer
//                       </p>
//                     )}
                    
//                     {field.id === 'eventTagline' && (
//                       <p className="text-xs text-slate-500 mt-1">
//                         A catchy phrase that summarizes your event
//                       </p>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         ))}
//       </div>
//     </>
//   );
// };



// import { useState, useEffect } from "react";
// import { useForm } from "../../context/FormContext";
// import { DatePicker } from "../common/DatePicker";

// export const Step1 = ({ step, setStepValid }: { step: any; setStepValid?: (valid: boolean) => void }) => {
//   const { data, updateField } = useForm();

//   // Character limits configuration
//   const characterLimits = {
//     eventTitle: 25,
//     eventTagline: 50,
//     eventDescription: 200,
//     venueName: 25,
//     venueAddress: 200
//   };

//   // Auto-fill today's date when countdown is enabled and target date is empty
//   useEffect(() => {
//     if (data.countdownEnabled && !data.countdownTargetDate) {
//       const today = new Date();
//       const year = today.getFullYear();
//       const month = String(today.getMonth() + 1).padStart(2, '0');
//       const day = String(today.getDate()).padStart(2, '0');
//       const todayString = `${year}-${month}-${day}`;
//       updateField('countdownTargetDate', todayString);
//     }
//   }, [data.countdownEnabled, data.countdownTargetDate, updateField]);

//   // Validation effect for required fields - UPDATED VERSION
//   useEffect(() => {
//     if (!step.fields) return;

//     const requiredFields = step.fields.filter((field: any) => field.required);
//     const isValid = requiredFields.every((field: any) => {
//       const value = data[field.id];
//       return value !== undefined && value !== null && value !== '';
//     });

//     setStepValid?.(isValid);
//   }, [data, step.fields, setStepValid]);

//   // Render input field based on type
//   const renderInputField = (field: any) => {
//     const baseClasses = "border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm w-full";
//     const currentValue = data[field.id] || "";
//     const charLimit = characterLimits[field.id as keyof typeof characterLimits];
//     const charsRemaining = charLimit ? charLimit - currentValue.length : null;

//     // Handle date fields - including countdownTargetDate with the styled DatePicker
//     if (field.type === "date" || field.id === "countdownTargetDate") {
//       return (
//         <DatePicker
//           value={currentValue}
//           onChange={(value) => updateField(field.id, value)}
//           required={field.required}
//           placeholder="Select date"
//         />
//       );
//     }

//     // Handle time fields
//     if (field.type === "time") {
//       return (
//         <input
//           type="time"
//           className={baseClasses}
//           value={currentValue}
//           onChange={(e) => updateField(field.id, e.target.value)}
//           required={field.required}
//         />
//       );
//     }

//     // Handle datetime fields
//     if (field.type === "datetime") {
//       return (
//         <input
//           type="datetime-local"
//           className={baseClasses}
//           value={currentValue}
//           onChange={(e) => updateField(field.id, e.target.value)}
//           required={field.required}
//         />
//       );
//     }

//     // Handle textarea fields
//     if (field.type === "textarea") {
//       return (
//         <div className="relative">
//           <textarea
//             className={`${baseClasses} min-h-[100px] resize-vertical pr-10`}
//             value={currentValue}
//             onChange={(e) => {
//               if (charLimit && e.target.value.length > charLimit) {
//                 e.target.value = e.target.value.slice(0, charLimit);
//               }
//               updateField(field.id, e.target.value);
//             }}
//             required={field.required}
//             placeholder={field.placeholder || ""}
//             rows={4}
//             maxLength={charLimit}
//           />
//           {charLimit && (
//             <div className={`absolute bottom-2 right-2 text-xs ${
//               charsRemaining && charsRemaining < 10 ? 'text-red-500' : 'text-slate-500'
//             }`}>
//               {charsRemaining}
//             </div>
//           )}
//         </div>
//       );
//     }

//     // Handle checkbox fields
//     if (field.type === "checkbox") {
//       return (
//         <div className="flex items-center">
//           <input
//             type="checkbox"
//             className="w-4 h-4 text-amber-600 border-amber-300 rounded focus:ring-amber-500"
//             checked={data[field.id] || false}
//             onChange={(e) => updateField(field.id, e.target.checked)}
//           />
//           <label className="ml-2 text-sm text-slate-700">
//             Enable countdown
//           </label>
//         </div>
//       );
//     }

//     // Default text input with character limit
//     return (
//       <div className="relative">
//         <input
//           type={field.type}
//           className={`${baseClasses} ${charLimit ? 'pr-10' : ''}`}
//           value={currentValue}
//           onChange={(e) => {
//             if (charLimit && e.target.value.length > charLimit) {
//               e.target.value = e.target.value.slice(0, charLimit);
//             }
//             updateField(field.id, e.target.value);
//           }}
//           required={field.required}
//           placeholder={field.placeholder || ""}
//           maxLength={charLimit}
//         />
//         {charLimit && (
//           <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-xs ${
//             charsRemaining && charsRemaining < 10 ? 'text-red-500' : 'text-slate-500'
//           }`}>
//             {charsRemaining}
//           </div>
//         )}
//       </div>
//     );
//   };

//   // Generate human-readable label from field ID
//   const generateLabel = (fieldId: string): string => {
//     const labelMap: { [key: string]: string } = {
//       eventTitle: "Event Title",
//       eventTagline: "Event Tagline",
//       startDate: "Start Date",
//       endDate: "End Date",
//       timeStart: "Start Time",
//       timeEnd: "End Time",
//       venueName: "Venue Name",
//       venueAddress: "Venue Address",
//       organizer: "Organizer",
//       eventDescription: "Event Description",
//       countdownEnabled: "Enable Countdown",
//       countdownTargetDate: "Countdown Target Date"
//     };

//     return labelMap[fieldId] || fieldId
//       .replace(/([A-Z])/g, ' $1')
//       .replace(/^./, str => str.toUpperCase());
//   };

//   // Group fields for better layout
//   const groupFields = () => {
//     if (!step.fields) return [];

//     const groups = [
//       {
//         title: "Event Details",
//         fields: step.fields.filter((f: any) => 
//           ['eventTitle', 'eventTagline', 'eventDescription'].includes(f.id)
//         )
//       },
//       {
//         title: "Date & Time",
//         fields: step.fields.filter((f: any) => 
//           ['startDate', 'endDate', 'timeStart', 'timeEnd'].includes(f.id)
//         )
//       },
//       {
//         title: "Venue Information",
//         fields: step.fields.filter((f: any) => 
//           ['venueName', 'venueAddress'].includes(f.id)
//         )
//       },
//       {
//         title: "Organizer",
//         fields: step.fields.filter((f: any) => 
//           ['organizer'].includes(f.id)
//         )
//       },
//       {
//         title: "Countdown Settings",
//         fields: step.fields.filter((f: any) => 
//           ['countdownEnabled', 'countdownTargetDate'].includes(f.id)
//         )
//       }
//     ];

//     return groups.filter(group => group.fields.length > 0);
//   };

//   const fieldGroups = groupFields();

//   return (
//     <>
//       <h2 className="text-2xl font-bold text-amber-900 border-b border-amber-300 pb-2 mb-6">
//         {step.title}
//       </h2>

//       <div className="space-y-8">
//         {fieldGroups.map((group, index) => (
//           <div key={index} className="space-y-4 p-6 bg-yellow-50 rounded-xl shadow-md">
//             <h3 className="text-lg font-semibold text-slate-900 border-b border-amber-200 pb-2">
//               {group.title}
//             </h3>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {group.fields.map((field: any) => {
//                 // Special handling for countdown fields - show target date only when enabled
//                 if (field.id === 'countdownTargetDate' && !data.countdownEnabled) {
//                   return null;
//                 }

//                 // Full width for certain fields
//                 const isFullWidth = [
//                   'eventDescription', 
//                   'venueAddress', 
//                   'eventTagline'
//                 ].includes(field.id);

//                 const charLimit = characterLimits[field.id as keyof typeof characterLimits];

//                 return (
//                   <div 
//                     key={field.id} 
//                     className={`flex flex-col ${isFullWidth ? 'md:col-span-2' : ''}`}
//                   >
//                     <label className="mb-1 font-medium text-slate-800 text-sm">
//                       {generateLabel(field.id)}
//                       {field.required && <span className="text-red-500 ml-1">*</span>}
//                       {charLimit && (
//                         <span className="text-slate-500 text-xs font-normal ml-2">
//                           (max {charLimit} characters)
//                         </span>
//                       )}
//                     </label>
//                     {renderInputField(field)}
                    
//                     {/* Helper text for specific fields */}
//                     {field.id === 'countdownTargetDate' && (
//                       <p className="text-xs text-slate-500 mt-1">
//                         Set the date and time for the countdown timer
//                       </p>
//                     )}
                    
//                     {field.id === 'eventTagline' && (
//                       <p className="text-xs text-slate-500 mt-1">
//                         A catchy phrase that summarizes your event
//                       </p>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         ))}
//       </div>
//     </>
//   );
// };

// import { useState, useEffect } from "react";
// import { useForm } from "../../context/FormContext";
// import { DatePicker } from "../common/DatePicker";

// export const Step1 = ({ step, setStepValid }: { step: any; setStepValid?: (valid: boolean) => void }) => {
//   const { data, updateField } = useForm();

//   // Character limits configuration
//   const characterLimits = {
//     eventTitle: 25,
//     eventTagline: 50,
//     eventDescription: 200,
//     venueName: 25,
//     venueAddress: 200
//   };

//   // Auto-fill today's date and current time when countdown is enabled and target date is empty
//   useEffect(() => {
//     if (data.countdownEnabled && !data.countdownTargetDate) {
//       const now = new Date();
//       const year = now.getFullYear();
//       const month = String(now.getMonth() + 1).padStart(2, '0');
//       const day = String(now.getDate()).padStart(2, '0');
//       const hours = String(now.getHours()).padStart(2, '0');
//       const minutes = String(now.getMinutes()).padStart(2, '0');
//       const nowString = `${year}-${month}-${day}T${hours}:${minutes}`;
//       updateField('countdownTargetDate', nowString);
//     }
//   }, [data.countdownEnabled, data.countdownTargetDate, updateField]);

//   // Validation effect for required fields - UPDATED VERSION
//   useEffect(() => {
//     if (!step.fields) return;

//     const requiredFields = step.fields.filter((field: any) => field.required);
//     const isValid = requiredFields.every((field: any) => {
//       const value = data[field.id];
//       return value !== undefined && value !== null && value !== '';
//     });

//     setStepValid?.(isValid);
//   }, [data, step.fields, setStepValid]);

//   // Handle date change for countdown target
//   const handleCountdownDateChange = (date: string, time: string) => {
//     if (date && time) {
//       const dateTimeString = `${date}T${time}`;
//       updateField('countdownTargetDate', dateTimeString);
//     } else if (date) {
//       // If only date is provided, keep existing time or set to 00:00
//       const currentValue = data.countdownTargetDate || '';
//       const currentTime = currentValue.includes('T') ? currentValue.split('T')[1] : '00:00';
//       updateField('countdownTargetDate', `${date}T${currentTime}`);
//     } else if (time) {
//       // If only time is provided, keep existing date
//       const currentValue = data.countdownTargetDate || '';
//       const currentDate = currentValue.includes('T') ? currentValue.split('T')[0] : new Date().toISOString().split('T')[0];
//       updateField('countdownTargetDate', `${currentDate}T${time}`);
//     }
//   };

//   // Render input field based on type
//   const renderInputField = (field: any) => {
//     const baseClasses = "border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm w-full";
//     const currentValue = data[field.id] || "";
//     const charLimit = characterLimits[field.id as keyof typeof characterLimits];
//     const charsRemaining = charLimit ? charLimit - currentValue.length : null;

//     // Handle countdownTargetDate with combined date and time pickers
//     if (field.id === "countdownTargetDate") {
//       const currentDate = currentValue.includes('T') ? currentValue.split('T')[0] : currentValue;
//       const currentTime = currentValue.includes('T') ? currentValue.split('T')[1] : '00:00';
      
//       return (
//         <div className="flex gap-3 items-stretch">
//           <div className="flex-[70%]">
//             <DatePicker
//               value={currentDate}
//               onChange={(value) => handleCountdownDateChange(value, currentTime)}
//               required={field.required}
//               placeholder="Select date"
//             />
//           </div>
//           <div className="flex-[30%]">
//             <input
//               type="time"
//               className={`${baseClasses} h-[42px]`}
//               // className={`${baseClasses} h-full`}
//               value={currentTime}
//               onChange={(e) => handleCountdownDateChange(currentDate, e.target.value)}
//               required={field.required}
//               style={{
//                 colorScheme: 'light'
//               }}
//             />
//           </div>
//         </div>
//       );
//     }

//     // Handle date fields
//     if (field.type === "date") {
//       return (
//         <DatePicker
//           value={currentValue}
//           onChange={(value) => updateField(field.id, value)}
//           required={field.required}
//           placeholder="Select date"
//         />
//       );
//     }

//     // Handle time fields
//     if (field.type === "time") {
//       return (
//         <input
//           type="time"
//           className={baseClasses}
//           value={currentValue}
//           onChange={(e) => updateField(field.id, e.target.value)}
//           required={field.required}
//         />
//       );
//     }

//     // Handle datetime fields
//     if (field.type === "datetime") {
//       return (
//         <input
//           type="datetime-local"
//           className={baseClasses}
//           value={currentValue}
//           onChange={(e) => updateField(field.id, e.target.value)}
//           required={field.required}
//         />
//       );
//     }

//     // Handle textarea fields
//     if (field.type === "textarea") {
//       return (
//         <div className="relative">
//           <textarea
//             className={`${baseClasses} min-h-[100px] resize-vertical pr-10`}
//             value={currentValue}
//             onChange={(e) => {
//               if (charLimit && e.target.value.length > charLimit) {
//                 e.target.value = e.target.value.slice(0, charLimit);
//               }
//               updateField(field.id, e.target.value);
//             }}
//             required={field.required}
//             placeholder={field.placeholder || ""}
//             rows={4}
//             maxLength={charLimit}
//           />
//           {charLimit && (
//             <div className={`absolute bottom-2 right-2 text-xs ${
//               charsRemaining && charsRemaining < 10 ? 'text-red-500' : 'text-slate-500'
//             }`}>
//               {charsRemaining}
//             </div>
//           )}
//         </div>
//       );
//     }

//     // Handle checkbox fields
//     if (field.type === "checkbox") {
//       return (
//         <div className="flex items-center">
//           <input
//             type="checkbox"
//             className="w-4 h-4 text-amber-600 border-amber-300 rounded focus:ring-amber-500"
//             checked={data[field.id] || false}
//             onChange={(e) => updateField(field.id, e.target.checked)}
//           />
//           <label className="ml-2 text-sm text-slate-700">
//             Enable countdown
//           </label>
//         </div>
//       );
//     }

//     // Default text input with character limit
//     return (
//       <div className="relative">
//         <input
//           type={field.type}
//           className={`${baseClasses} ${charLimit ? 'pr-10' : ''}`}
//           value={currentValue}
//           onChange={(e) => {
//             if (charLimit && e.target.value.length > charLimit) {
//               e.target.value = e.target.value.slice(0, charLimit);
//             }
//             updateField(field.id, e.target.value);
//           }}
//           required={field.required}
//           placeholder={field.placeholder || ""}
//           maxLength={charLimit}
//         />
//         {charLimit && (
//           <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-xs ${
//             charsRemaining && charsRemaining < 10 ? 'text-red-500' : 'text-slate-500'
//           }`}>
//             {charsRemaining}
//           </div>
//         )}
//       </div>
//     );
//   };

//   // Generate human-readable label from field ID
//   const generateLabel = (fieldId: string): string => {
//     const labelMap: { [key: string]: string } = {
//       eventTitle: "Event Title",
//       eventTagline: "Event Tagline",
//       startDate: "Start Date",
//       endDate: "End Date",
//       timeStart: "Start Time",
//       timeEnd: "End Time",
//       venueName: "Venue Name",
//       venueAddress: "Venue Address",
//       organizer: "Organizer",
//       eventDescription: "Event Description",
//       countdownEnabled: "Enable Countdown",
//       countdownTargetDate: "Countdown Target Date & Time"
//     };

//     return labelMap[fieldId] || fieldId
//       .replace(/([A-Z])/g, ' $1')
//       .replace(/^./, str => str.toUpperCase());
//   };

//   // Group fields for better layout
//   const groupFields = () => {
//     if (!step.fields) return [];

//     const groups = [
//       {
//         title: "Event Details",
//         fields: step.fields.filter((f: any) => 
//           ['eventTitle', 'eventTagline', 'eventDescription'].includes(f.id)
//         )
//       },
//       {
//         title: "Date & Time",
//         fields: step.fields.filter((f: any) => 
//           ['startDate', 'endDate', 'timeStart', 'timeEnd'].includes(f.id)
//         )
//       },
//       {
//         title: "Venue Information",
//         fields: step.fields.filter((f: any) => 
//           ['venueName', 'venueAddress'].includes(f.id)
//         )
//       },
//       {
//         title: "Organizer",
//         fields: step.fields.filter((f: any) => 
//           ['organizer'].includes(f.id)
//         )
//       },
//       {
//         title: "Countdown Settings",
//         fields: step.fields.filter((f: any) => 
//           ['countdownEnabled', 'countdownTargetDate'].includes(f.id)
//         )
//       }
//     ];

//     return groups.filter(group => group.fields.length > 0);
//   };

//   const fieldGroups = groupFields();

//   return (
//     <>
//       <h2 className="text-2xl font-bold text-amber-900 border-b border-amber-300 pb-2 mb-6">
//         {step.title}
//       </h2>

//       <div className="space-y-8">
//         {fieldGroups.map((group, index) => (
//           <div key={index} className="space-y-4 p-6 bg-yellow-50 rounded-xl shadow-md">
//             <h3 className="text-lg font-semibold text-slate-900 border-b border-amber-200 pb-2">
//               {group.title}
//             </h3>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {group.fields.map((field: any) => {
//                 // Special handling for countdown fields - show target date only when enabled
//                 if (field.id === 'countdownTargetDate' && !data.countdownEnabled) {
//                   return null;
//                 }

//                 // Full width for certain fields
//                 const isFullWidth = [
//                   'eventDescription', 
//                   'venueAddress', 
//                   'eventTagline',
//                   'countdownTargetDate' // Make countdown date+time full width
//                 ].includes(field.id);

//                 const charLimit = characterLimits[field.id as keyof typeof characterLimits];

//                 return (
//                   <div 
//                     key={field.id} 
//                     className={`flex flex-col ${isFullWidth ? 'md:col-span-2' : ''}`}
//                   >
//                     <label className="mb-1 font-medium text-slate-800 text-sm">
//                       {generateLabel(field.id)}
//                       {field.required && <span className="text-red-500 ml-1">*</span>}
//                       {charLimit && (
//                         <span className="text-slate-500 text-xs font-normal ml-2">
//                           (max {charLimit} characters)
//                         </span>
//                       )}
//                     </label>
//                     {renderInputField(field)}
                    
//                     {/* Helper text for specific fields */}
//                     {field.id === 'countdownTargetDate' && (
//                       <p className="text-xs text-slate-500 mt-1">
//                         Set the date and time for the countdown timer
//                       </p>
//                     )}
                    
//                     {field.id === 'eventTagline' && (
//                       <p className="text-xs text-slate-500 mt-1">
//                         A catchy phrase that summarizes your event
//                       </p>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         ))}
//       </div>
//     </>
//   );
// };

import { useState, useEffect } from "react";
import { useForm } from "../../context/FormContext";
import { DatePicker } from "../common/DatePicker";

export const Step1 = ({ step, setStepValid }: { step: any; setStepValid?: (valid: boolean) => void }) => {
  const { data, updateField } = useForm();

  // Character limits configuration
  const characterLimits = {
    eventTitle: 25,
    eventTagline: 50,
    eventDescription: 200,
    venueName: 25,
    venueAddress: 200
  };

  // Auto-fill today's date and current time when countdown is enabled and target date is empty
  useEffect(() => {
    if (data.countdownEnabled && !data.countdownTargetDate) {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const nowString = `${year}-${month}-${day}T${hours}:${minutes}`;
      updateField('countdownTargetDate', nowString);
    }
  }, [data.countdownEnabled, data.countdownTargetDate, updateField]);

  // Validation effect for required fields - UPDATED VERSION
  useEffect(() => {
    if (!step.fields) return;

    const requiredFields = step.fields.filter((field: any) => field.required);
    const isValid = requiredFields.every((field: any) => {
      const value = data[field.id];
      return value !== undefined && value !== null && value !== '';
    });

    setStepValid?.(isValid);
  }, [data, step.fields, setStepValid]);

  // Handle date change for countdown target
  const handleCountdownDateChange = (date: string, time: string) => {
    if (date && time) {
      const dateTimeString = `${date}T${time}`;
      updateField('countdownTargetDate', dateTimeString);
    } else if (date) {
      // If only date is provided, keep existing time or set to 00:00
      const currentValue = data.countdownTargetDate || '';
      const currentTime = currentValue.includes('T') ? currentValue.split('T')[1] : '00:00';
      updateField('countdownTargetDate', `${date}T${currentTime}`);
    } else if (time) {
      // If only time is provided, keep existing date
      const currentValue = data.countdownTargetDate || '';
      const currentDate = currentValue.includes('T') ? currentValue.split('T')[0] : new Date().toISOString().split('T')[0];
      updateField('countdownTargetDate', `${currentDate}T${time}`);
    }
  };

  // Render input field based on type
  const renderInputField = (field: any) => {
    const baseClasses = "border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm w-full";
    const currentValue = data[field.id] || "";
    const charLimit = characterLimits[field.id as keyof typeof characterLimits];
    const charsRemaining = charLimit ? charLimit - currentValue.length : null;

    // Handle countdownTargetDate with date and time pickers on separate lines
    if (field.id === "countdownTargetDate") {
      const currentDate = currentValue.includes('T') ? currentValue.split('T')[0] : currentValue;
      const currentTime = currentValue.includes('T') ? currentValue.split('T')[1] : '00:00';
      
      return (
        <div className="space-y-3">
          {/* Date Picker - Full width on first line */}
          <div>
            <label className="mb-1 font-medium text-slate-800 text-sm block">
              Date
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <DatePicker
              value={currentDate}
              onChange={(value) => handleCountdownDateChange(value, currentTime)}
              required={field.required}
              placeholder="Select date"
            />
          </div>
          
          {/* Time Input - Full width on second line */}
          <div>
            <label className="mb-1 font-medium text-slate-800 text-sm block">
              Time
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="time"
              className={baseClasses}
              value={currentTime}
              onChange={(e) => handleCountdownDateChange(currentDate, e.target.value)}
              required={field.required}
              style={{
                colorScheme: 'light'
              }}
            />
          </div>
        </div>
      );
    }

    // Handle date fields
    if (field.type === "date") {
      return (
        <DatePicker
          value={currentValue}
          onChange={(value) => updateField(field.id, value)}
          required={field.required}
          placeholder="Select date"
        />
      );
    }

    // Handle time fields
    if (field.type === "time") {
      return (
        <input
          type="time"
          className={baseClasses}
          value={currentValue}
          onChange={(e) => updateField(field.id, e.target.value)}
          required={field.required}
        />
      );
    }

    // Handle datetime fields
    if (field.type === "datetime") {
      return (
        <input
          type="datetime-local"
          className={baseClasses}
          value={currentValue}
          onChange={(e) => updateField(field.id, e.target.value)}
          required={field.required}
        />
      );
    }

    // Handle textarea fields
    if (field.type === "textarea") {
      return (
        <div className="relative">
          <textarea
            className={`${baseClasses} min-h-[100px] resize-vertical pr-10`}
            value={currentValue}
            onChange={(e) => {
              if (charLimit && e.target.value.length > charLimit) {
                e.target.value = e.target.value.slice(0, charLimit);
              }
              updateField(field.id, e.target.value);
            }}
            required={field.required}
            placeholder={field.placeholder || ""}
            rows={4}
            maxLength={charLimit}
          />
          {charLimit && (
            <div className={`absolute bottom-2 right-2 text-xs ${
              charsRemaining && charsRemaining < 10 ? 'text-red-500' : 'text-slate-500'
            }`}>
              {charsRemaining}
            </div>
          )}
        </div>
      );
    }

    // Handle checkbox fields
    if (field.type === "checkbox") {
      return (
        <div className="flex items-center">
          <input
            type="checkbox"
            className="w-4 h-4 text-amber-600 border-amber-300 rounded focus:ring-amber-500"
            checked={data[field.id] || false}
            onChange={(e) => updateField(field.id, e.target.checked)}
          />
          <label className="ml-2 text-sm text-slate-700">
            Enable countdown
          </label>
        </div>
      );
    }

    // Default text input with character limit
    return (
      <div className="relative">
        <input
          type={field.type}
          className={`${baseClasses} ${charLimit ? 'pr-10' : ''}`}
          value={currentValue}
          onChange={(e) => {
            if (charLimit && e.target.value.length > charLimit) {
              e.target.value = e.target.value.slice(0, charLimit);
            }
            updateField(field.id, e.target.value);
          }}
          required={field.required}
          placeholder={field.placeholder || ""}
          maxLength={charLimit}
        />
        {charLimit && (
          <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-xs ${
            charsRemaining && charsRemaining < 10 ? 'text-red-500' : 'text-slate-500'
          }`}>
            {charsRemaining}
          </div>
        )}
      </div>
    );
  };

  // Generate human-readable label from field ID
  const generateLabel = (fieldId: string): string => {
    const labelMap: { [key: string]: string } = {
      eventTitle: "Event Title",
      eventTagline: "Event Tagline",
      startDate: "Start Date",
      endDate: "End Date",
      timeStart: "Start Time",
      timeEnd: "End Time",
      venueName: "Venue Name",
      venueAddress: "Venue Address",
      organizer: "Organizer",
      eventDescription: "Event Description",
      countdownEnabled: "Enable Countdown",
      countdownTargetDate: "Countdown Target Date & Time"
    };

    return labelMap[fieldId] || fieldId
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  };

  // Group fields for better layout
  const groupFields = () => {
    if (!step.fields) return [];

    const groups = [
      {
        title: "Event Details",
        fields: step.fields.filter((f: any) => 
          ['eventTitle', 'eventTagline', 'eventDescription'].includes(f.id)
        )
      },
      {
        title: "Date & Time",
        fields: step.fields.filter((f: any) => 
          ['startDate', 'endDate', 'timeStart', 'timeEnd'].includes(f.id)
        )
      },
      {
        title: "Venue Information",
        fields: step.fields.filter((f: any) => 
          ['venueName', 'venueAddress'].includes(f.id)
        )
      },
      {
        title: "Organizer",
        fields: step.fields.filter((f: any) => 
          ['organizer'].includes(f.id)
        )
      },
      {
        title: "Countdown Settings",
        fields: step.fields.filter((f: any) => 
          ['countdownEnabled', 'countdownTargetDate'].includes(f.id)
        )
      }
    ];

    return groups.filter(group => group.fields.length > 0);
  };

  const fieldGroups = groupFields();

  return (
    <>
      <h2 className="text-2xl font-bold text-amber-900 border-b border-amber-300 pb-2 mb-6">
        {step.title}
      </h2>

      <div className="space-y-8">
        {fieldGroups.map((group, index) => (
          <div key={index} className="space-y-4 p-6 bg-yellow-50 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold text-slate-900 border-b border-amber-200 pb-2">
              {group.title}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {group.fields.map((field: any) => {
                // Special handling for countdown fields - show target date only when enabled
                if (field.id === 'countdownTargetDate' && !data.countdownEnabled) {
                  return null;
                }

                // Full width for certain fields
                const isFullWidth = [
                  'eventDescription', 
                  'venueAddress', 
                  'eventTagline',
                  'countdownTargetDate' // Make countdown date+time full width
                ].includes(field.id);

                const charLimit = characterLimits[field.id as keyof typeof characterLimits];

                return (
                  <div 
                    key={field.id} 
                    className={`flex flex-col ${isFullWidth ? 'md:col-span-2' : ''}`}
                  >
                    <label className="mb-1 font-medium text-slate-800 text-sm">
                      {generateLabel(field.id)}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                      {charLimit && (
                        <span className="text-slate-500 text-xs font-normal ml-2">
                          (max {charLimit} characters)
                        </span>
                      )}
                    </label>
                    {renderInputField(field)}
                    
                    {/* Helper text for specific fields */}
                    {field.id === 'countdownTargetDate' && (
                      <p className="text-xs text-slate-500 mt-1">
                        Set the date and time for the countdown timer
                      </p>
                    )}
                    
                    {field.id === 'eventTagline' && (
                      <p className="text-xs text-slate-500 mt-1">
                        A catchy phrase that summarizes your event
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};