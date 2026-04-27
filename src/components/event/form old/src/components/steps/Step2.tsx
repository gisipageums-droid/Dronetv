// // import { useForm } from "../../context/FormContext";
// // import { MultiSelect } from "../common/MultiSelect";

// // interface Subcategory {
// //   parent: string;
// //   name: string;
// // }

// // export const Step2 = ({ step, allSteps }: { step: any; allSteps: any[] }) => {
// //   const { data, updateField } = useForm();

// //   // Step1 categories from JSON
// //   const step1 = allSteps.find((s) => s.id === "step1");
// //   const selectedCategories: string[] = data.categories || [];

// //   const noCategoriesSelected = selectedCategories.length === 0;

// //   // Handle changes for a particular category
// //   const handleChange = (category: string, vals: string[]) => {
// //     const transformed: Subcategory[] = vals.map((name) => ({ parent: category, name }));
// //     const newSubcategories = [
// //       ...(data.subcategories || []).filter((sc) => sc.parent !== category),
// //       ...transformed
// //     ];
// //     updateField("subcategories", newSubcategories);
// //   };

// //   // Predefined colors for containers
// //   const containerColors = ["bg-yellow-50 border-2 border-yellow-300 border-blue-200", "bg-yellow-50 border-2 border-yellow-300 border-green-200"];

// //   return (
// //     <div className="space-y-6">
// //       <h2 className="text-2xl font-semibold text-gray-800">{step.title}</h2>

// //       {noCategoriesSelected && (
// //         <p className="text-red-500">{step.note || "User must first select categories in Step 1"}</p>
// //       )}

// //       {!noCategoriesSelected &&
// //         selectedCategories.map((catName, index) => {
// //           const catObj = step1?.categories?.available?.find((c: any) => c.name === catName);
// //           const subcategoryOptions = catObj?.subcategories?.map((sc: any) => sc.name) || [];
// //           const selectedForCategory = (data.subcategories || [])
// //             .filter((sc) => sc.parent === catName)
// //             .map((sc) => sc.name);

// //           const colorClass = containerColors[index % containerColors.length];

// //           return (
// //             <div
// //               key={catName}
// //               className={`border ${colorClass} p-4 rounded-lg shadow-sm space-y-2`}
// //             >
// //               <h3 className="font-semibold text-gray-700">{catName}</h3>
// //               <MultiSelect
// //                 options={subcategoryOptions}
// //                 selected={selectedForCategory}
// //                 onChange={(vals) => handleChange(catName, vals)} variant="subcategories"
// //               />
// //             </div>
// //           );
// //         })}
// //     </div>
// //   );
// // };


// import { useState } from "react";
// import { useForm } from "../../context/FormContext";

// interface CTAButton {
//   label: string;
//   link: string;
// }

// export const Step2 = ({ step, setStepValid }: { step: any; setStepValid?: (valid: boolean) => void }) => {
//   const { data, updateField } = useForm();

//   // Initialize data if not present
//   const highlights = data.highlights || [];
//   const ctaButtons = data.ctaButtons || [];

//   // Add new highlight
//   const addHighlight = () => {
//     const newHighlights = [...highlights, { highlightText: "" }];
//     updateField("highlights", newHighlights);
//   };

//   // Update highlight text
//   const updateHighlight = (index: number, text: string) => {
//     const newHighlights = [...highlights];
//     newHighlights[index] = { ...newHighlights[index], highlightText: text };
//     updateField("highlights", newHighlights);
//   };

//   // Remove highlight
//   const removeHighlight = (index: number) => {
//     const newHighlights = highlights.filter((_, i) => i !== index);
//     updateField("highlights", newHighlights);
//   };

//   // Add new CTA button
//   const addCTAButton = () => {
//     const newCTAs = [...ctaButtons, { label: "", link: "" }];
//     updateField("ctaButtons", newCTAs);
//   };

//   // Update CTA button field
//   const updateCTAButton = (index: number, field: keyof CTAButton, value: string) => {
//     const newCTAs = [...ctaButtons];
//     newCTAs[index] = { ...newCTAs[index], [field]: value };
//     updateField("ctaButtons", newCTAs);
//   };

//   // Remove CTA button
//   const removeCTAButton = (index: number) => {
//     const newCTAs = ctaButtons.filter((_, i) => i !== index);
//     updateField("ctaButtons", newCTAs);
//   };

//   // Validation effect (optional - you can add if needed)
//   // useEffect(() => {
//   //   // Add validation logic here if required
//   //   setStepValid?.(true);
//   // }, [highlights, ctaButtons, setStepValid]);

//   const baseInputClasses = "border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm w-full";

//   return (
//     <div className="space-y-8">
//       <h2 className="text-2xl font-bold text-amber-900 border-b border-amber-300 pb-2 mb-6">
//         {step.title}
//       </h2>

//       {/* Highlights Section */}
//       <div className="space-y-6 p-6 bg-yellow-50 rounded-xl shadow-md">
//         <div className="flex justify-between items-center">
//           <h3 className="text-lg font-semibold text-slate-900">Event Highlights</h3>
//           <button
//             type="button"
//             onClick={addHighlight}
//             className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
//           >
//             Add Highlight
//           </button>
//         </div>
        
//         <p className="text-sm text-slate-600 mb-4">
//           Add key highlights or features of your event that will attract attendees
//         </p>

//         {highlights.length === 0 ? (
//           <div className="text-center py-8 text-slate-500">
//             <p>No highlights added yet.</p>
//             <p className="text-sm">Click "Add Highlight" to get started.</p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {highlights.map((highlight: any, index: number) => (
//               <div key={index} className="flex items-center gap-3 p-4 bg-white rounded-lg border border-amber-200">
//                 <div className="flex-1">
//                   <input
//                     type="text"
//                     value={highlight.highlightText || ""}
//                     onChange={(e) => updateHighlight(index, e.target.value)}
//                     placeholder="Enter event highlight (e.g., 'Keynote by Industry Leaders', 'Networking Sessions', etc.)"
//                     className={baseInputClasses}
//                   />
//                 </div>
//                 <button
//                   type="button"
//                   onClick={() => removeHighlight(index)}
//                   className="text-red-500 hover:text-red-700 p-2 transition"
//                   title="Remove highlight"
//                 >
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                   </svg>
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* CTA Buttons Section */}
//       <div className="space-y-6 p-6 bg-yellow-50 rounded-xl shadow-md">
//         <div className="flex justify-between items-center">
//           <h3 className="text-lg font-semibold text-slate-900">Call-to-Action Buttons</h3>
//           <button
//             type="button"
//             onClick={addCTAButton}
//             className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
//           >
//             Add CTA Button
//           </button>
//         </div>
        
//         <p className="text-sm text-slate-600 mb-4">
//           Add buttons that will help attendees take action (Register, Learn More, etc.)
//         </p>

//         {ctaButtons.length === 0 ? (
//           <div className="text-center py-8 text-slate-500">
//             <p>No CTA buttons added yet.</p>
//             <p className="text-sm">Click "Add CTA Button" to get started.</p>
//           </div>
//         ) : (
//           <div className="space-y-6">
//             {ctaButtons.map((cta: CTAButton, index: number) => (
//               <div key={index} className="p-6 bg-white rounded-lg border border-amber-200 space-y-4">
//                 <div className="flex justify-between items-center">
//                   <h4 className="font-medium text-slate-800">CTA Button {index + 1}</h4>
//                   <button
//                     type="button"
//                     onClick={() => removeCTAButton(index)}
//                     className="text-red-500 hover:text-red-700 text-sm font-medium transition"
//                   >
//                     Remove
//                   </button>
//                 </div>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block mb-1 font-medium text-slate-800 text-sm">
//                       Button Label *
//                     </label>
//                     <input
//                       type="text"
//                       value={cta.label}
//                       onChange={(e) => updateCTAButton(index, 'label', e.target.value)}
//                       placeholder="e.g., Register Now, Learn More, Get Tickets"
//                       className={baseInputClasses}
//                       required
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block mb-1 font-medium text-slate-800 text-sm">
//                       Link URL
//                     </label>
//                     <input
//                       type="url"
//                       value={cta.link}
//                       onChange={(e) => updateCTAButton(index, 'link', e.target.value)}
//                       placeholder="https://example.com/register"
//                       className={baseInputClasses}
//                     />
//                   </div>
//                 </div>

//                 {/* Preview */}
//                 <div className="pt-4 border-t border-amber-100">
//                   <label className="block mb-2 font-medium text-slate-800 text-sm">Preview:</label>
//                   <div className="flex flex-wrap gap-2">
//                     <button
//                       type="button"
//                       className={`px-6 py-2 rounded-lg font-medium text-sm transition ${
//                         cta.label 
//                           ? 'bg-amber-500 hover:bg-amber-600 text-white' 
//                           : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                       }`}
//                       disabled={!cta.label}
//                     >
//                       {cta.label || "Button Label"}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Helper Information */}
//       <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
//         <h4 className="font-semibold text-blue-900 mb-2">💡 Tips for this section:</h4>
//         <ul className="text-sm text-blue-800 space-y-1">
//           <li>• Highlights should be concise and compelling</li>
//           <li>• CTA buttons should have clear, action-oriented labels</li>
//           <li>• Include registration links, website URLs, or contact pages</li>
//           <li>• Test all links before publishing</li>
//         </ul>
//       </div>
//     </div>
//   );
// };



import { useState } from "react";
import { useForm } from "../../context/FormContext";

interface CTAButton {
  label: string;
  link: string;
}

export const Step2 = ({ step, setStepValid }: { step: any; setStepValid?: (valid: boolean) => void }) => {
  const { data, updateField } = useForm();

  // Initialize data if not present
  const highlights = data.highlights || [];
  const ctaButtons = data.ctaButtons || [];

  // Add new highlight
  const addHighlight = () => {
    const newHighlights = [...highlights, { highlightText: "" }];
    updateField("highlights", newHighlights);
  };

  // Update highlight text
  const updateHighlight = (index: number, text: string) => {
    const newHighlights = [...highlights];
    newHighlights[index] = { ...newHighlights[index], highlightText: text };
    updateField("highlights", newHighlights);
  };

  // Remove highlight
  const removeHighlight = (index: number) => {
    const newHighlights = highlights.filter((_, i) => i !== index);
    updateField("highlights", newHighlights);
  };

  // Add new CTA button
  const addCTAButton = () => {
    const newCTAs = [...ctaButtons, { label: "", link: "" }];
    updateField("ctaButtons", newCTAs);
  };

  // Update CTA button field
  const updateCTAButton = (index: number, field: keyof CTAButton, value: string) => {
    const newCTAs = [...ctaButtons];
    newCTAs[index] = { ...newCTAs[index], [field]: value };
    updateField("ctaButtons", newCTAs);
  };

  // Remove CTA button
  const removeCTAButton = (index: number) => {
    const newCTAs = ctaButtons.filter((_, i) => i !== index);
    updateField("ctaButtons", newCTAs);
  };

  const baseInputClasses = "border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm w-full";

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-amber-900 border-b border-amber-300 pb-2 mb-6">
        {step.title}
      </h2>

      {/* Highlights Section */}
      <div className="space-y-6 p-6 bg-yellow-50 rounded-xl shadow-md">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Event Highlights</h3>
          <p className="text-sm text-slate-600 mt-1">
            Add key highlights or features of your event that will attract attendees
          </p>
        </div>

        {highlights.length === 0 ? (
          <div className="text-center py-8 text-slate-500 border-2 border-dashed border-amber-200 rounded-lg">
            <p>No highlights added yet.</p>
            <p className="text-sm mt-1">Click "Add Highlight" to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {highlights.map((highlight: any, index: number) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-white rounded-lg border border-amber-200">
                <div className="flex-1">
                  <input
                    type="text"
                    value={highlight.highlightText || ""}
                    onChange={(e) => updateHighlight(index, e.target.value)}
                    placeholder="Enter event highlight (e.g., 'Keynote by Industry Leaders', 'Networking Sessions', etc.)"
                    className={baseInputClasses}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeHighlight(index)}
                  className="text-red-500 hover:text-red-700 p-2 transition"
                  title="Remove highlight"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add Highlight Button at Bottom */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={addHighlight}
            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg text-sm font-medium transition flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Highlight
          </button>
        </div>
      </div>

      {/* CTA Buttons Section */}
      <div className="space-y-6 p-6 bg-yellow-50 rounded-xl shadow-md">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Call-to-Action Buttons</h3>
          <p className="text-sm text-slate-600 mt-1">
            Add buttons that will help attendees take action (Register, Learn More, etc.)
          </p>
        </div>

        {ctaButtons.length === 0 ? (
          <div className="text-center py-8 text-slate-500 border-2 border-dashed border-amber-200 rounded-lg">
            <p>No CTA buttons added yet.</p>
            <p className="text-sm mt-1">Click "Add CTA Button" to get started.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {ctaButtons.map((cta: CTAButton, index: number) => (
              <div key={index} className="p-6 bg-white rounded-lg border border-amber-200 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-slate-800">CTA Button {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeCTAButton(index)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium transition"
                  >
                    Remove
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-medium text-slate-800 text-sm">
                      Button Label *
                    </label>
                    <input
                      type="text"
                      value={cta.label}
                      onChange={(e) => updateCTAButton(index, 'label', e.target.value)}
                      placeholder="e.g., Register Now, Learn More, Get Tickets"
                      className={baseInputClasses}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1 font-medium text-slate-800 text-sm">
                      Link URL
                    </label>
                    <input
                      type="url"
                      value={cta.link}
                      onChange={(e) => updateCTAButton(index, 'link', e.target.value)}
                      placeholder="https://example.com/register"
                      className={baseInputClasses}
                    />
                  </div>
                </div>

                {/* Preview */}
                <div className="pt-4 border-t border-amber-100">
                  <label className="block mb-2 font-medium text-slate-800 text-sm">Preview:</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className={`px-6 py-2 rounded-lg font-medium text-sm transition ${
                        cta.label 
                          ? 'bg-amber-500 hover:bg-amber-600 text-white' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={!cta.label}
                    >
                      {cta.label || "Button Label"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add CTA Button at Bottom */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={addCTAButton}
            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg text-sm font-medium transition flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add CTA Button
          </button>
        </div>
      </div>

      {/* Helper Information */}
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2">💡 Tips for this section:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Highlights should be concise and compelling</li>
          <li>• CTA buttons should have clear, action-oriented labels</li>
          <li>• Include registration links, website URLs, or contact pages</li>
          <li>• Test all links before publishing</li>
        </ul>
      </div>
    </div>
  );
};