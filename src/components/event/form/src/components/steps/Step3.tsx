

// import { useForm } from "../../context/FormContext";
// import { useState } from "react";

// interface Section {
//   title: string;
//   description: string;
// }

// interface Zone {
//   zoneTitle: string;
//   description: string;
// }

// export const Step3 = ({ step, setStepValid }: { step: any; setStepValid?: (valid: boolean) => void }) => {
//   const { data, updateField } = useForm();

//   // Initialize data if not present
//   const sections = data.sections || [];
//   const zones = data.zones || [];

//   // Add new section
//   const addSection = () => {
//     const newSections = [...sections, { title: "", description: "" }];
//     updateField("sections", newSections);
//   };

//   // Update section field
//   const updateSection = (index: number, field: keyof Section, value: string) => {
//     const newSections = [...sections];
//     newSections[index] = { ...newSections[index], [field]: value };
//     updateField("sections", newSections);
//   };

//   // Remove section
//   const removeSection = (index: number) => {
//     const newSections = sections.filter((_, i) => i !== index);
//     updateField("sections", newSections);
//   };

//   // Add new zone
//   const addZone = () => {
//     const newZones = [...zones, { zoneTitle: "", description: "" }];
//     updateField("zones", newZones);
//   };

//   // Update zone field
//   const updateZone = (index: number, field: keyof Zone, value: string) => {
//     const newZones = [...zones];
//     newZones[index] = { ...newZones[index], [field]: value };
//     updateField("zones", newZones);
//   };

//   // Remove zone
//   const removeZone = (index: number) => {
//     const newZones = zones.filter((_, i) => i !== index);
//     updateField("zones", newZones);
//   };

//   const baseInputClasses = "border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm w-full";
//   const baseTextareaClasses = "border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm w-full min-h-[100px] resize-vertical";

//   return (
//     <div className="space-y-8">
//       <h2 className="text-2xl font-bold text-amber-900 border-b border-amber-300 pb-2 mb-6">
//         {step.title}
//       </h2>

//       {/* Sections Section */}
//       <div className="space-y-6 p-6 bg-yellow-50 rounded-xl shadow-md">
//         <div className="flex justify-between items-center">
//           <div>
//             <h3 className="text-lg font-semibold text-slate-900">Event Sections</h3>
//             <p className="text-sm text-slate-600 mt-1">
//               Organize your event into logical sections or areas
//             </p>
//           </div>
//           <button
//             type="button"
//             onClick={addSection}
//             className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
//           >
//             Add Section
//           </button>
//         </div>

//         {sections.length === 0 ? (
//           <div className="text-center py-8 text-slate-500 bg-white rounded-lg border-2 border-dashed border-amber-200">
//             <p className="font-medium">No sections added yet</p>
//             <p className="text-sm mt-1">Click "Add Section" to create event sections</p>
//           </div>
//         ) : (
//           <div className="space-y-6">
//             {sections.map((section: Section, index: number) => (
//               <div key={index} className="p-6 bg-white rounded-lg border border-amber-200 space-y-4">
//                 <div className="flex justify-between items-center">
//                   <h4 className="font-semibold text-slate-800">
//                     Section {index + 1}
//                   </h4>
//                   <button
//                     type="button"
//                     onClick={() => removeSection(index)}
//                     className="text-red-500 hover:text-red-700 text-sm font-medium transition"
//                   >
//                     Remove Section
//                   </button>
//                 </div>
                
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block mb-1 font-medium text-slate-800 text-sm">
//                       Section Title *
//                     </label>
//                     <input
//                       type="text"
//                       value={section.title}
//                       onChange={(e) => updateSection(index, 'title', e.target.value)}
//                       placeholder="e.g., Main Conference, Workshop Area, Networking Lounge"
//                       className={baseInputClasses}
//                       required
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block mb-1 font-medium text-slate-800 text-sm">
//                       Description
//                     </label>
//                     <textarea
//                       value={section.description}
//                       onChange={(e) => updateSection(index, 'description', e.target.value)}
//                       placeholder="Describe what happens in this section, activities, schedule, etc."
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

//       {/* Specialized Zones Section */}
//       <div className="space-y-6 p-6 bg-yellow-50 rounded-xl shadow-md">
//         <div className="flex justify-between items-center">
//           <div>
//             <h3 className="text-lg font-semibold text-slate-900">Specialized Zones</h3>
//             <p className="text-sm text-slate-600 mt-1">
//               Define specialized areas with specific purposes or activities
//             </p>
//           </div>
//           <button
//             type="button"
//             onClick={addZone}
//             className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
//           >
//             Add Zone
//           </button>
//         </div>

//         {zones.length === 0 ? (
//           <div className="text-center py-8 text-slate-500 bg-white rounded-lg border-2 border-dashed border-amber-200">
//             <p className="font-medium">No zones added yet</p>
//             <p className="text-sm mt-1">Click "Add Zone" to create specialized areas</p>
//           </div>
//         ) : (
//           <div className="space-y-6">
//             {zones.map((zone: Zone, index: number) => (
//               <div key={index} className="p-6 bg-white rounded-lg border border-amber-200 space-y-4">
//                 <div className="flex justify-between items-center">
//                   <h4 className="font-semibold text-slate-800">
//                     Zone {index + 1}
//                   </h4>
//                   <button
//                     type="button"
//                     onClick={() => removeZone(index)}
//                     className="text-red-500 hover:text-red-700 text-sm font-medium transition"
//                   >
//                     Remove Zone
//                   </button>
//                 </div>
                
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block mb-1 font-medium text-slate-800 text-sm">
//                       Zone Title *
//                     </label>
//                     <input
//                       type="text"
//                       value={zone.zoneTitle}
//                       onChange={(e) => updateZone(index, 'zoneTitle', e.target.value)}
//                       placeholder="e.g., VIP Lounge, Exhibition Hall, Startup Pavilion"
//                       className={baseInputClasses}
//                       required
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block mb-1 font-medium text-slate-800 text-sm">
//                       Description
//                     </label>
//                     <textarea
//                       value={zone.description}
//                       onChange={(e) => updateZone(index, 'description', e.target.value)}
//                       placeholder="Describe the purpose, features, and activities in this zone"
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

//       {/* Examples and Tips */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
//           <h4 className="font-semibold text-blue-900 mb-2">📋 Section Examples:</h4>
//           <ul className="text-sm text-blue-800 space-y-1">
//             <li>• Main Conference Hall</li>
//             <li>• Workshop Rooms</li>
//             <li>• Networking Area</li>
//             <li>• Exhibition Space</li>
//             <li>• Food & Beverage Zone</li>
//           </ul>
//         </div>

//         <div className="p-4 bg-green-50 rounded-lg border border-green-200">
//           <h4 className="font-semibold text-green-900 mb-2">🎯 Zone Examples:</h4>
//           <ul className="text-sm text-green-800 space-y-1">
//             <li>• VIP Lounge</li>
//             <li>• Startup Demo Area</li>
//             <li>• Media Center</li>
//             <li>• Sponsor Pavilion</li>
//             <li>• Innovation Lab</li>
//           </ul>
//         </div>
//       </div>

//       {/* Summary Preview */}
//       {(sections.length > 0 || zones.length > 0) && (
//         <div className="p-6 bg-amber-50 rounded-xl border border-amber-200">
//           <h3 className="font-semibold text-amber-900 mb-4">Event Layout Preview</h3>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {sections.length > 0 && (
//               <div>
//                 <h4 className="font-medium text-amber-800 mb-2">Sections ({sections.length})</h4>
//                 <div className="space-y-2">
//                   {sections.map((section: Section, index: number) => (
//                     <div key={index} className="bg-white p-3 rounded border border-amber-100">
//                       <div className="font-medium text-sm text-slate-800">{section.title || "Untitled Section"}</div>
//                       {section.description && (
//                         <div className="text-xs text-slate-600 mt-1 line-clamp-2">{section.description}</div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
            
//             {zones.length > 0 && (
//               <div>
//                 <h4 className="font-medium text-amber-800 mb-2">Zones ({zones.length})</h4>
//                 <div className="space-y-2">
//                   {zones.map((zone: Zone, index: number) => (
//                     <div key={index} className="bg-white p-3 rounded border border-amber-100">
//                       <div className="font-medium text-sm text-slate-800">{zone.zoneTitle || "Untitled Zone"}</div>
//                       {zone.description && (
//                         <div className="text-xs text-slate-600 mt-1 line-clamp-2">{zone.description}</div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };



import { useForm } from "../../context/FormContext";
import { useState } from "react";

interface Section {
  title: string;
  description: string;
}

interface Zone {
  zoneTitle: string;
  description: string;
}

export const Step3 = ({ step, setStepValid }: { step: any; setStepValid?: (valid: boolean) => void }) => {
  const { data, updateField } = useForm();

  // Initialize data if not present
  const sections = data.sections || [];
  const zones = data.zones || [];

  // Character limits configuration
  const characterLimits = {
    sectionTitle: 50,
    sectionDescription: 200,
    zoneTitle: 50,
    zoneDescription: 200
  };

  // Add new section
  const addSection = () => {
    const newSections = [...sections, { title: "", description: "" }];
    updateField("sections", newSections);
  };

  // Update section field
  const updateSection = (index: number, field: keyof Section, value: string) => {
    const newSections = [...sections];
    newSections[index] = { ...newSections[index], [field]: value };
    updateField("sections", newSections);
  };

  // Remove section
  const removeSection = (index: number) => {
    const newSections = sections.filter((_, i) => i !== index);
    updateField("sections", newSections);
  };

  // Add new zone
  const addZone = () => {
    const newZones = [...zones, { zoneTitle: "", description: "" }];
    updateField("zones", newZones);
  };

  // Update zone field
  const updateZone = (index: number, field: keyof Zone, value: string) => {
    const newZones = [...zones];
    newZones[index] = { ...newZones[index], [field]: value };
    updateField("zones", newZones);
  };

  // Remove zone
  const removeZone = (index: number) => {
    const newZones = zones.filter((_, i) => i !== index);
    updateField("zones", newZones);
  };

  const baseInputClasses = "border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm w-full";
  const baseTextareaClasses = "border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm w-full min-h-[100px] resize-vertical";

  // Helper function to render input with character counter
  const renderLimitedInput = (field: any, value: string, onChange: (value: string) => void, charLimit: number, placeholder: string) => {
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
          required={field.required}
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

  // Helper function to render textarea with character counter
  const renderLimitedTextarea = (field: any, value: string, onChange: (value: string) => void, charLimit: number, placeholder: string) => {
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
          rows={3}
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

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-amber-900 border-b border-amber-300 pb-2 mb-6">
        {step.title}
      </h2>

      {/* Sections Section */}
      <div className="space-y-6 p-6 bg-yellow-50 rounded-xl shadow-md">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Event Sections</h3>
          <p className="text-sm text-slate-600 mt-1">
            Organize your event into logical sections or areas
          </p>
        </div>

        {sections.length === 0 ? (
          <div className="text-center py-8 text-slate-500 bg-white rounded-lg border-2 border-dashed border-amber-200">
            <p className="font-medium">No sections added yet</p>
            <p className="text-sm mt-1">Click "Add Section" to create event sections</p>
          </div>
        ) : (
          <div className="space-y-6">
            {sections.map((section: Section, index: number) => (
              <div key={index} className="p-6 bg-white rounded-lg border border-amber-200 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-slate-800">
                    Section {index + 1}
                  </h4>
                  <button
                    type="button"
                    onClick={() => removeSection(index)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium transition"
                  >
                    Remove Section
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 font-medium text-slate-800 text-sm">
                      Section Title *
                      <span className="text-slate-500 text-xs font-normal ml-2">
                        (max {characterLimits.sectionTitle} characters)
                      </span>
                    </label>
                    {renderLimitedInput(
                      { required: true },
                      section.title,
                      (value) => updateSection(index, 'title', value),
                      characterLimits.sectionTitle,
                      "e.g., Main Conference, Workshop Area, Networking Lounge"
                    )}
                  </div>
                  
                  <div>
                    <label className="block mb-1 font-medium text-slate-800 text-sm">
                      Description
                      <span className="text-slate-500 text-xs font-normal ml-2">
                        (max {characterLimits.sectionDescription} characters)
                      </span>
                    </label>
                    {renderLimitedTextarea(
                      { required: false },
                      section.description,
                      (value) => updateSection(index, 'description', value),
                      characterLimits.sectionDescription,
                      "Describe what happens in this section, activities, schedule, etc."
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Section Button at Bottom Right */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={addSection}
            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg text-sm font-medium transition flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Section
          </button>
        </div>
      </div>

      {/* Specialized Zones Section */}
      <div className="space-y-6 p-6 bg-yellow-50 rounded-xl shadow-md">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Specialized Zones</h3>
          <p className="text-sm text-slate-600 mt-1">
            Define specialized areas with specific purposes or activities
          </p>
        </div>

        {zones.length === 0 ? (
          <div className="text-center py-8 text-slate-500 bg-white rounded-lg border-2 border-dashed border-amber-200">
            <p className="font-medium">No zones added yet</p>
            <p className="text-sm mt-1">Click "Add Zone" to create specialized areas</p>
          </div>
        ) : (
          <div className="space-y-6">
            {zones.map((zone: Zone, index: number) => (
              <div key={index} className="p-6 bg-white rounded-lg border border-amber-200 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-slate-800">
                    Zone {index + 1}
                  </h4>
                  <button
                    type="button"
                    onClick={() => removeZone(index)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium transition"
                  >
                    Remove Zone
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 font-medium text-slate-800 text-sm">
                      Zone Title *
                      <span className="text-slate-500 text-xs font-normal ml-2">
                        (max {characterLimits.zoneTitle} characters)
                      </span>
                    </label>
                    {renderLimitedInput(
                      { required: true },
                      zone.zoneTitle,
                      (value) => updateZone(index, 'zoneTitle', value),
                      characterLimits.zoneTitle,
                      "e.g., VIP Lounge, Exhibition Hall, Startup Pavilion"
                    )}
                  </div>
                  
                  <div>
                    <label className="block mb-1 font-medium text-slate-800 text-sm">
                      Description
                      <span className="text-slate-500 text-xs font-normal ml-2">
                        (max {characterLimits.zoneDescription} characters)
                      </span>
                    </label>
                    {renderLimitedTextarea(
                      { required: false },
                      zone.description,
                      (value) => updateZone(index, 'description', value),
                      characterLimits.zoneDescription,
                      "Describe the purpose, features, and activities in this zone"
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Zone Button at Bottom Right */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={addZone}
            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg text-sm font-medium transition flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Zone
          </button>
        </div>
      </div>

      {/* Examples and Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">📋 Section Examples:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Main Conference Hall</li>
            <li>• Workshop Rooms</li>
            <li>• Networking Area</li>
            <li>• Exhibition Space</li>
            <li>• Food & Beverage Zone</li>
          </ul>
        </div>

        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <h4 className="font-semibold text-green-900 mb-2">🎯 Zone Examples:</h4>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• VIP Lounge</li>
            <li>• Startup Demo Area</li>
            <li>• Media Center</li>
            <li>• Sponsor Pavilion</li>
            <li>• Innovation Lab</li>
          </ul>
        </div>
      </div>

      {/* Summary Preview */}
      {(sections.length > 0 || zones.length > 0) && (
        <div className="p-6 bg-amber-50 rounded-xl border border-amber-200">
          <h3 className="font-semibold text-amber-900 mb-4">Event Layout Preview</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sections.length > 0 && (
              <div>
                <h4 className="font-medium text-amber-800 mb-2">Sections ({sections.length})</h4>
                <div className="space-y-2">
                  {sections.map((section: Section, index: number) => (
                    <div key={index} className="bg-white p-3 rounded border border-amber-100">
                      <div className="font-medium text-sm text-slate-800">{section.title || "Untitled Section"}</div>
                      {section.description && (
                        <div className="text-xs text-slate-600 mt-1 line-clamp-2">{section.description}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {zones.length > 0 && (
              <div>
                <h4 className="font-medium text-amber-800 mb-2">Zones ({zones.length})</h4>
                <div className="space-y-2">
                  {zones.map((zone: Zone, index: number) => (
                    <div key={index} className="bg-white p-3 rounded border border-amber-100">
                      <div className="font-medium text-sm text-slate-800">{zone.zoneTitle || "Untitled Zone"}</div>
                      {zone.description && (
                        <div className="text-xs text-slate-600 mt-1 line-clamp-2">{zone.description}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};