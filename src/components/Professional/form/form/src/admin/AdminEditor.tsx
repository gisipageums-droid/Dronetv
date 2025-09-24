// import { useEffect, useState } from "react";

// interface AdminEditorProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// export const AdminEditor = ({ isOpen, onClose }: AdminEditorProps) => {
//   const [formData, setFormData] = useState<any>(null);
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);

//   // Fetch current structure on open
//   useEffect(() => {
//     if (isOpen) {
//       setLoading(true);
//       fetch("https://qemducz8gc.execute-api.ap-south-1.amazonaws.com/formstructure")
//         .then((res) => res.json())
//         .then((data) => {
//           setFormData(data);
//         })
//         .catch((err) => {
//           console.error("Failed to fetch form structure:", err);
//           alert("Failed to fetch form structure");
//         })
//         .finally(() => setLoading(false));
//     }
//   }, [isOpen]);

//   if (!isOpen) return null;

//   // Update step title or sections
//   const handleChange = (stepIndex: number, key: string, value: any) => {
//     const updated = [...formData.steps];
//     updated[stepIndex] = { ...updated[stepIndex], [key]: value };
//     setFormData({ ...formData, steps: updated });
//   };

//   // Update individual fields
//   const handleFieldChange = (
//     stepIndex: number,
//     section: string,
//     fieldIndex: number,
//     key: string,
//     value: any
//   ) => {
//     const updated = [...formData.steps];
//     updated[stepIndex][section].fields[fieldIndex][key] = value;
//     setFormData({ ...formData, steps: updated });
//   };

//   // Add new field
//   const handleAddField = (stepIndex: number, section: string) => {
//     const updated = [...formData.steps];
//     const fields = updated[stepIndex][section]?.fields || [];
//     fields.push({
//       id: `field-${Date.now()}`,
//       label: "New Field",
//       type: "text",
//       required: false,
//     });
//     updated[stepIndex][section].fields = fields;
//     setFormData({ ...formData, steps: updated });
//   };

//   // Save to backend (PUT full structure)
//   const handleSave = async () => {
//     setSaving(true);
//     try {
//       const res = await fetch(
//         // "https://7xbk5owl68.execute-api.ap-south-1.amazonaws.com/formstructure",
//         "https://0i53elbzf2.execute-api.ap-south-1.amazonaws.com/dev/update-form-data",
//         {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(formData),
//         }
//       );
//       if (!res.ok) throw new Error("Save failed");
//       alert("Form structure updated successfully!");
//       onClose();
//     } catch (err) {
//       console.error(err);
//       alert("Failed to save changes");
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
//       <div className="bg-white w-4/5 max-h-[90vh] overflow-y-auto rounded-xl shadow-lg p-6 space-y-6">
//         {/* Header */}
//         <div className="flex justify-between items-center border-b pb-2">
//           <h2 className="text-2xl font-bold text-yellow-700">Admin Editor</h2>
//           <button onClick={onClose} className="text-gray-600 hover:text-black text-lg">✕</button>
//         </div>

//         {/* Loading / Content */}
//         {loading ? (
//           <p>Loading form structure...</p>
//         ) : (
//           <>
//             {formData?.steps?.map((step: any, stepIndex: number) => (
//               <div key={step.id} className="p-4 border rounded-lg shadow-sm bg-gradient-to-r from-blue-50 to-white">
//                 <h3 className="font-semibold text-lg mb-2">{step.title || `Step ${stepIndex + 1}`}</h3>

//                 {/* Title editor */}
//                 <div className="mb-4">
//                   <label className="text-sm font-medium">Step Title</label>
//                   <input
//                     type="text"
//                     value={step.title || ""}
//                     onChange={(e) => handleChange(stepIndex, "title", e.target.value)}
//                     className="border p-2 w-full rounded"
//                   />
//                 </div>

//                 {/* Sections */}
//                 {["basicInfo", "projects", "services", "media"].map((section) =>
//                   step[section]?.fields ? (
//                     <div key={section} className="mb-4">
//                       <h4 className="font-medium capitalize">{section}</h4>
//                       {step[section].fields.map((field: any, fieldIndex: number) => (
//                         <div key={field.id} className="grid grid-cols-4 gap-2 items-center mb-2">
//                           <input
//                             type="text"
//                             value={field.label}
//                             onChange={(e) =>
//                               handleFieldChange(stepIndex, section, fieldIndex, "label", e.target.value)
//                             }
//                             className="border p-2 rounded col-span-2"
//                           />
//                           <select
//                             value={field.type}
//                             onChange={(e) =>
//                               handleFieldChange(stepIndex, section, fieldIndex, "type", e.target.value)
//                             }
//                             className="border p-2 rounded"
//                           >
//                             <option value="text">Text</option>
//                             <option value="email">Email</option>
//                             <option value="textarea">Textarea</option>
//                             <option value="file">File</option>
//                             <option value="image">Image</option>
//                           </select>
//                           <label className="flex items-center space-x-2">
//                             <input
//                               type="checkbox"
//                               checked={field.required}
//                               onChange={(e) =>
//                                 handleFieldChange(stepIndex, section, fieldIndex, "required", e.target.checked)
//                               }
//                             />
//                             <span>Required</span>
//                           </label>
//                         </div>
//                       ))}
//                       <button
//                         onClick={() => handleAddField(stepIndex, section)}
//                         className="mt-2 px-3 py-1 bg-green-500 text-white rounded"
//                       >
//                         + Add Field
//                       </button>
//                     </div>
//                   ) : null
//                 )}
//               </div>
//             ))}
//           </>
//         )}

//         {/* Footer */}
//         <div className="flex justify-end gap-3 mt-6">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
//             disabled={saving}
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSave}
//             className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 rounded font-medium"
//             disabled={saving}
//           >
//             {saving ? "Saving..." : "Save Changes"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };







// import { useEffect, useState } from "react";

// interface AdminEditorProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// export const AdminEditor = ({ isOpen, onClose }: AdminEditorProps) => {
//   const [formData, setFormData] = useState<any>(null);
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);

//   // Utility: generate ID from label
//   const generateIdFromLabel = (label: string) => {
//     if (!label) return `field-${Date.now()}`;
//     return label
//       .trim()
//       .toLowerCase()
//       .replace(/[^a-z0-9]+/g, "_")
//       .replace(/^_|_$/g, "");
//   };

//   // Fetch form structure
//   useEffect(() => {
//     if (isOpen) {
//       setLoading(true);
//       fetch("https://qemducz8gc.execute-api.ap-south-1.amazonaws.com/formstructure")
//         .then((res) => res.json())
//         .then((data) => setFormData(data))
//         .catch((err) => {
//           console.error("Failed to fetch form structure:", err);
//           alert("Failed to fetch form structure");
//         })
//         .finally(() => setLoading(false));
//     }
//   }, [isOpen]);

//   if (!isOpen) return null;

//   // Update step title
//   const handleChange = (stepIndex: number, key: string, value: any) => {
//     setFormData((prev: any) => {
//       const steps = prev.steps.map((s: any, i: number) =>
//         i === stepIndex ? { ...s, [key]: value } : s
//       );
//       return { ...prev, steps };
//     });
//   };

//   // Update field
//   const handleFieldChange = (
//     stepIndex: number,
//     section: string,
//     fieldIndex: number,
//     key: string,
//     value: any
//   ) => {
//     setFormData((prev: any) => {
//       const steps = prev.steps.map((s: any, i: number) => {
//         if (i !== stepIndex) return s;

//         const fields = s[section].fields.map((f: any, j: number) => {
//           if (j !== fieldIndex) return f;
//           return { ...f, [key]: value };
//         });

//         return { ...s, [section]: { ...s[section], fields } };
//       });

//       return { ...prev, steps };
//     });
//   };

//   // Add new draft field
//   const handleAddField = (stepIndex: number, section: string) => {
//     setFormData((prev: any) => {
//       const steps = prev.steps.map((s: any, i: number) => {
//         if (i !== stepIndex) return s;

//         const newField = {
//           id: `field-${Date.now()}`, // temporary ID
//           label: "",
//           type: "text",
//           required: false,
//           status: "draft", // new draft field
//         };

//         return {
//           ...s,
//           [section]: {
//             ...s[section],
//             fields: [...(s[section]?.fields || []), newField],
//           },
//         };
//       });

//       return { ...prev, steps };
//     });
//   };

//   // Confirm draft field → generate ID
//   const handleConfirmField = (
//     stepIndex: number,
//     section: string,
//     fieldIndex: number
//   ) => {
//     setFormData((prev: any) => {
//       const steps = prev.steps.map((s: any, i: number) => {
//         if (i !== stepIndex) return s;

//         const fields = s[section].fields.map((f: any, j: number) => {
//           if (j !== fieldIndex) return f;

//           const newId = generateIdFromLabel(f.label || `field-${Date.now()}`);
//           return { ...f, id: newId, status: "confirmed" };
//         });

//         return { ...s, [section]: { ...s[section], fields } };
//       });

//       return { ...prev, steps };
//     });
//   };

//   // Cancel draft field → remove
//   const handleCancelField = (
//     stepIndex: number,
//     section: string,
//     fieldIndex: number
//   ) => {
//     setFormData((prev: any) => {
//       const steps = prev.steps.map((s: any, i: number) => {
//         if (i !== stepIndex) return s;

//         const fields = s[section].fields.filter((_: any, j: number) => j !== fieldIndex);

//         return { ...s, [section]: { ...s[section], fields } };
//       });

//       return { ...prev, steps };
//     });
//   };

//   // Save to backend
//   const handleSave = async () => {
//     setSaving(true);
//     try {
//       const res = await fetch(
//         "https://0i53elbzf2.execute-api.ap-south-1.amazonaws.com/dev/update-form-data",
//         {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(formData),
//         }
//       );
//       if (!res.ok) throw new Error("Save failed");
//       alert("Form structure updated successfully!");
//       onClose();
//     } catch (err) {
//       console.error(err);
//       alert("Failed to save changes");
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
//       <div className="bg-white w-4/5 max-h-[90vh] overflow-y-auto rounded-xl shadow-lg p-6 space-y-6">
//         {/* Header */}
//         <div className="flex justify-between items-center border-b pb-2">
//           <h2 className="text-2xl font-bold text-yellow-700">Admin Editor</h2>
//           <button onClick={onClose} className="text-gray-600 hover:text-black text-lg">
//             ✕
//           </button>
//         </div>

//         {/* Loading / Content */}
//         {loading ? (
//           <p>Loading form structure...</p>
//         ) : (
//           <>
//             {formData?.steps?.map((step: any, stepIndex: number) => (
//               <div
//                 key={step.id}
//                 className="p-4 border rounded-lg shadow-sm bg-gradient-to-r from-blue-50 to-white"
//               >
//                 <h3 className="font-semibold text-lg mb-2">
//                   {step.title || `Step ${stepIndex + 1}`}
//                 </h3>

//                 {/* Step Title */}
//                 <div className="mb-4">
//                   <label className="text-sm font-medium">Step Title</label>
//                   <input
//                     type="text"
//                     value={step.title || ""}
//                     onChange={(e) => handleChange(stepIndex, "title", e.target.value)}
//                     className="border p-2 w-full rounded"
//                   />
//                 </div>

//                 {/* Sections */}
//                 {["basicInfo", "projects", "services", "media"].map((section) =>
//                   step[section]?.fields ? (
//                     <div key={section} className="mb-4">
//                       <h4 className="font-medium capitalize">{section}</h4>
//                       {step[section].fields.map((field: any, fieldIndex: number) => (
//                         <div
//                           key={field.id}
//                           className="grid grid-cols-5 gap-2 items-center mb-2"
//                         >
//                           <input
//                             type="text"
//                             value={field.label}
//                             onChange={(e) =>
//                               handleFieldChange(stepIndex, section, fieldIndex, "label", e.target.value)
//                             }
//                             className="border p-2 rounded col-span-2"
//                           />
//                           <select
//                             value={field.type}
//                             onChange={(e) =>
//                               handleFieldChange(stepIndex, section, fieldIndex, "type", e.target.value)
//                             }
//                             className="border p-2 rounded"
//                           >
//                             <option value="text">Text</option>
//                             <option value="email">Email</option>
//                             <option value="textarea">Textarea</option>
//                             <option value="file">File</option>
//                             <option value="image">Image</option>
//                           </select>
//                           <label className="flex items-center space-x-2">
//                             <input
//                               type="checkbox"
//                               checked={field.required}
//                               onChange={(e) =>
//                                 handleFieldChange(stepIndex, section, fieldIndex, "required", e.target.checked)
//                               }
//                             />
//                             <span>Required</span>
//                           </label>

//                           {/* Draft controls */}
//                           {field.status === "draft" && (
//                             <div className="flex gap-1">
//                               <button
//                                 onClick={() => handleConfirmField(stepIndex, section, fieldIndex)}
//                                 className="px-2 py-1 bg-blue-500 text-white rounded"
//                               >
//                                 Add
//                               </button>
//                               <button
//                                 onClick={() => handleCancelField(stepIndex, section, fieldIndex)}
//                                 className="px-2 py-1 bg-red-500 text-white rounded"
//                               >
//                                 Cancel
//                               </button>
//                             </div>
//                           )}
//                         </div>
//                       ))}
//                       <button
//                         onClick={() => handleAddField(stepIndex, section)}
//                         className="mt-2 px-3 py-1 bg-green-500 text-white rounded"
//                       >
//                         + Add Field
//                       </button>
//                     </div>
//                   ) : null
//                 )}
//               </div>
//             ))}
//           </>
//         )}

//         {/* Footer */}
//         <div className="flex justify-end gap-3 mt-6">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
//             disabled={saving}
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSave}
//             className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 rounded font-medium"
//             disabled={saving}
//           >
//             {saving ? "Saving..." : "Save Changes"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };











import { useEffect, useState } from "react";

// Types
interface AdminEditorProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Field {
  id: string;
  label: string;
  type: string;
  required: boolean;
  draft?: boolean;
}

interface Category {
  id: string;
  name: string;
  type: "category" | "subcategory";
  subcategories: Category[];
  draft?: boolean;
}

interface Skill {
  id: string;
  name: string;
  subcategories?: Skill[];
  draft?: boolean;
}

export const AdminEditor = ({ isOpen, onClose }: AdminEditorProps) => {
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);


  const updateSubcategory = (
  stepIndex: number,
  catIndex: number,
  subIndex: number,
  key: string,
  value: any
) => {
  setFormData((prev: any) => {
    const steps = prev.steps.map((s: any, i: number) => {
      if (i !== stepIndex) return s;
      const available = s.categories.available.map((c: Category, j: number) => {
        if (j !== catIndex) return c;
        const subcategories = c.subcategories.map((sub, k) => {
          if (k !== subIndex) return sub;
          return { ...sub, [key]: value };
        });
        return { ...c, subcategories };
      });
      return { ...s, categories: { ...s.categories, available } };
    });
    return { ...prev, steps };
  });
};





  // Generate ID from label/name
  const generateIdFromLabel = (label: string) =>
    label
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "");

  // Fetch form structure
  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    fetch("https://qemducz8gc.execute-api.ap-south-1.amazonaws.com/formstructure")
      .then((res) => res.json())
      .then((data) => setFormData(data))
      .catch((err) => alert("Failed to fetch form structure"))
      .finally(() => setLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  // ===== IMMUTABLE UPDATERS =====

  const updateStep = (stepIndex: number, newStep: any) => {
    setFormData((prev: any) => {
      const steps = [...prev.steps];
      steps[stepIndex] = newStep;
      return { ...prev, steps };
    });
  };

  // Fields update
  const updateField = (
    stepIndex: number,
    section: string,
    fieldIndex: number,
    key: string,
    value: any
  ) => {
    setFormData((prev: any) => {
      const steps = prev.steps.map((s: any, i: number) => {
        if (i !== stepIndex) return s;
        const fields = s[section].fields.map((f: Field, j: number) => {
          if (j !== fieldIndex) return f;
          return { ...f, [key]: value };
        });
        return { ...s, [section]: { ...s[section], fields } };
      });
      return { ...prev, steps };
    });
  };

  const addField = (stepIndex: number, section: string) => {
    setFormData((prev: any) => {
      const steps = prev.steps.map((s: any, i: number) => {
        if (i !== stepIndex) return s;
        const newField: Field = {
          id: `draft-${Date.now()}`,
          label: "New Field",
          type: "text",
          required: false,
          draft: true,
        };
        return { ...s, [section]: { ...s[section], fields: [...s[section].fields, newField] } };
      });
      return { ...prev, steps };
    });
  };

  const deleteField = (stepIndex: number, section: string, fieldIndex: number) => {
    setFormData((prev: any) => {
      const steps = prev.steps.map((s: any, i: number) => {
        if (i !== stepIndex) return s;
        const fields = s[section].fields.filter((_: any, j: number) => j !== fieldIndex);
        return { ...s, [section]: { ...s[section], fields } };
      });
      return { ...prev, steps };
    });
  };

  const confirmField = (stepIndex: number, section: string, fieldIndex: number) => {
    setFormData((prev: any) => {
      const steps = prev.steps.map((s: any, i: number) => {
        if (i !== stepIndex) return s;
        const fields = s[section].fields.map((f: Field, j: number) => {
          if (j !== fieldIndex) return f;
          return { ...f, id: generateIdFromLabel(f.label), draft: false };
        });
        return { ...s, [section]: { ...s[section], fields } };
      });
      return { ...prev, steps };
    });
  };

  // ===== CATEGORY/SUBCATEGORY =====
  const updateCategory = (
    stepIndex: number,
    catIndex: number,
    key: string,
    value: any
  ) => {
    setFormData((prev: any) => {
      const steps = prev.steps.map((s: any, i: number) => {
        if (i !== stepIndex) return s;
        const available = s.categories.available.map((c: Category, j: number) => {
          if (j !== catIndex) return c;
          return { ...c, [key]: value };
        });
        return { ...s, categories: { ...s.categories, available } };
      });
      return { ...prev, steps };
    });
  };

  const addCategory = (stepIndex: number) => {
    setFormData((prev: any) => {
      const steps = prev.steps.map((s: any, i: number) => {
        if (i !== stepIndex) return s;
        const newCat: Category = {
          id: `draft-${Date.now()}`,
          name: "New Category",
          type: "category",
          subcategories: [],
          draft: true,
        };
        return { ...s, categories: { ...s.categories, available: [...s.categories.available, newCat] } };
      });
      return { ...prev, steps };
    });
  };

  const deleteCategory = (stepIndex: number, catIndex: number) => {
    setFormData((prev: any) => {
      const steps = prev.steps.map((s: any, i: number) => {
        if (i !== stepIndex) return s;
        const available = s.categories.available.filter((_: any, j: number) => j !== catIndex);
        return { ...s, categories: { ...s.categories, available } };
      });
      return { ...prev, steps };
    });
  };

  const confirmCategory = (stepIndex: number, catIndex: number) => {
    setFormData((prev: any) => {
      const steps = prev.steps.map((s: any, i: number) => {
        if (i !== stepIndex) return s;
        const available = s.categories.available.map((c: Category, j: number) => {
          if (j !== catIndex) return c;
          return { ...c, id: generateIdFromLabel(c.name), draft: false };
        });
        return { ...s, categories: { ...s.categories, available } };
      });
      return { ...prev, steps };
    });
  };

  // Add/Delete subcategory
  const addSubcategory = (stepIndex: number, catIndex: number) => {
    setFormData((prev: any) => {
      const steps = prev.steps.map((s: any, i: number) => {
        if (i !== stepIndex) return s;
        const available = s.categories.available.map((c: Category, j: number) => {
          if (j !== catIndex) return c;
          const newSub: Category = {
            id: `draft-${Date.now()}`,
            name: "New Subcategory",
            type: "subcategory",
            subcategories: [],
            draft: true,
          };
          return { ...c, subcategories: [...c.subcategories, newSub] };
        });
        return { ...s, categories: { ...s.categories, available } };
      });
      return { ...prev, steps };
    });
  };

  const deleteSubcategory = (stepIndex: number, catIndex: number, subIndex: number) => {
    setFormData((prev: any) => {
      const steps = prev.steps.map((s: any, i: number) => {
        if (i !== stepIndex) return s;
        const available = s.categories.available.map((c: Category, j: number) => {
          if (j !== catIndex) return c;
          const subcategories = c.subcategories.filter((_: any, k: number) => k !== subIndex);
          return { ...c, subcategories };
        });
        return { ...s, categories: { ...s.categories, available } };
      });
      return { ...prev, steps };
    });
  };

  const confirmSubcategory = (stepIndex: number, catIndex: number, subIndex: number) => {
    setFormData((prev: any) => {
      const steps = prev.steps.map((s: any, i: number) => {
        if (i !== stepIndex) return s;
        const available = s.categories.available.map((c: Category, j: number) => {
          if (j !== catIndex) return c;
          const subcategories = c.subcategories.map((sub, k) => {
            if (k !== subIndex) return sub;
            return { ...sub, id: generateIdFromLabel(sub.name), draft: false };
          });
          return { ...c, subcategories };
        });
        return { ...s, categories: { ...s.categories, available } };
      });
      return { ...prev, steps };
    });
  };

  // ===== SKILLS TREE RECURSIVE =====
//   const updateSkill = (stepIndex: number, path: number[], key: string, value: any) => {
//     setFormData((prev: any) => {
//       const steps = prev.steps.map((s: any, i: number) => {
//         if (i !== stepIndex) return s;
//         const recursiveUpdate = (skills: Skill[], path: number[]): Skill[] => {
//           return skills.map((sk, idx) => {
//             if (idx !== path[0]) return sk;
//             if (path.length === 1) return { ...sk, [key]: value };
//             if (sk.subcategories) return { ...sk, subcategories: recursiveUpdate(sk.subcategories, path.slice(1)) };
//             return sk;
//           });
//         };
//         return { ...s, skills: { ...s.skills, tree: recursiveUpdate(s.skills.tree, path) } };
//       });
//       return { ...prev, steps };
//     });
//   };



const updateSkill = (stepIndex: number, path: number[], key: string, value: any) => {
  setFormData((prev: any) => {
    const steps = prev.steps.map((s: any, i: number) => {
      if (i !== stepIndex) return s;

      const recursiveUpdate = (skills: Skill[], path: number[]): Skill[] => {
        return skills.map((sk, idx) => {
          // ✅ match the right skill at this depth
          if (idx !== path[0]) return sk;

          // ✅ if we are at the target level (including root)
          if (path.length === 1) {
            return { ...sk, [key]: value };
          }

          // ✅ otherwise, recurse deeper
          if (sk.subcategories) {
            return {
              ...sk,
              subcategories: recursiveUpdate(sk.subcategories, path.slice(1)),
            };
          }

          return sk;
        });
      };

      return {
        ...s,
        skills: { ...s.skills, tree: recursiveUpdate(s.skills.tree, path) },
      };
    });

    return { ...prev, steps };
  });
};



//   const addSkill = (stepIndex: number, path: number[]) => {
//     setFormData((prev: any) => {
//       const steps = prev.steps.map((s: any, i: number) => {
//         if (i !== stepIndex) return s;
//         const recursiveAdd = (skills: Skill[], path: number[]): Skill[] => {
//           return skills.map((sk, idx) => {
//             if (idx !== path[0]) return sk;
//             if (path.length === 1) {
//               const newSkill: Skill = { id: `draft-${Date.now()}`, name: "New Skill", draft: true };
//               return { ...sk, subcategories: [...(sk.subcategories || []), newSkill] };
//             }
//             if (sk.subcategories) return { ...sk, subcategories: recursiveAdd(sk.subcategories, path.slice(1)) };
//             return sk;
//           });
//         };
//         return { ...s, skills: { ...s.skills, tree: recursiveAdd(s.skills.tree, path) } };
//       });
//       return { ...prev, steps };
//     });
//   };




const generateId = () => "_" + Math.random().toString(36).substr(2, 9);

const addSkill = (stepIndex: number, path: number[]) => {
  setFormData((prev: any) => {
    const steps = prev.steps.map((s: any, i: number) => {
      if (i !== stepIndex) return s;

      const newSkill: Skill = {
        id: generateId(),
        name: "New Skill",
        subcategories: [],
      };

      const recursiveAdd = (skills: Skill[], path: number[]): Skill[] => {
        if (path.length === 0) {
          // ✅ Add root-level parent
          return [...skills, newSkill];
        }

        return skills.map((sk, idx) => {
          if (idx !== path[0]) return sk;
          if (path.length === 1) {
            return {
              ...sk,
              subcategories: [...(sk.subcategories || []), newSkill],
            };
          }
          if (sk.subcategories) {
            return {
              ...sk,
              subcategories: recursiveAdd(sk.subcategories, path.slice(1)),
            };
          }
          return sk;
        });
      };

      return {
        ...s,
        skills: { ...s.skills, tree: recursiveAdd(s.skills.tree, path) },
      };
    });

    return { ...prev, steps };
  });
};



const deleteSkill = (stepIndex: number, path: number[]) => {
  setFormData((prev: any) => {
    const steps = prev.steps.map((s: any, i: number) => {
      if (i !== stepIndex) return s;

      const recursiveDelete = (skills: Skill[], path: number[]): Skill[] => {
        const mapped = skills.map((sk, idx) => {
          if (idx !== path[0]) return sk;

          // If we're at the target level, mark for deletion by returning null
          if (path.length === 1) {
            return null;
          }

          // Otherwise recurse into subcategories (if any)
          if (sk.subcategories) {
            return {
              ...sk,
              subcategories: recursiveDelete(sk.subcategories, path.slice(1)),
            };
          }

          return sk;
        });

        // Type guard: keep only actual Skill objects (remove the null markers)
        return mapped.filter((x): x is Skill => x !== null);
      };

      const tree = s?.skills?.tree || [];
      return { ...s, skills: { ...s.skills, tree: recursiveDelete(tree, path) } };
    });

    return { ...prev, steps };
  });
};


  const confirmSkill = (stepIndex: number, path: number[]) => {
    setFormData((prev: any) => {
      const steps = prev.steps.map((s: any, i: number) => {
        if (i !== stepIndex) return s;
        const recursiveConfirm = (skills: Skill[], path: number[]): Skill[] => {
          return skills.map((sk, idx) => {
            if (idx !== path[0]) return sk;
            if (path.length === 1) return { ...sk, id: generateIdFromLabel(sk.name), draft: false };
            if (sk.subcategories) return { ...sk, subcategories: recursiveConfirm(sk.subcategories, path.slice(1)) };
            return sk;
          });
        };
        return { ...s, skills: { ...s.skills, tree: recursiveConfirm(s.skills.tree, path) } };
      });
      return { ...prev, steps };
    });
  };

  // ===== SAVE =====
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(
        "https://0i53elbzf2.execute-api.ap-south-1.amazonaws.com/dev/update-form-data",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      if (!res.ok) throw new Error("Save failed");
      alert("Form saved successfully!");

       
      window.location.reload();
    

      onClose();
    } catch (err) {
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

  // ===== RENDER HELPERS =====

  const renderSkill = (skill: Skill, stepIndex: number, path: number[] = []) => (
    <div className="pl-4 border-l ml-2 my-1" key={skill.id}>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={skill.name}
          onChange={(e) => updateSkill(stepIndex, path, "name", e.target.value)}
          className="border p-1 rounded flex-1"
        />
        {skill.draft ? (
          <>
            <button onClick={() => confirmSkill(stepIndex, path)} className="px-1 bg-green-400 rounded">✔</button>
            <button onClick={() => deleteSkill(stepIndex, path)} className="px-1 bg-red-400 rounded">✖</button>
          </>
        ) : (
          <button onClick={() => deleteSkill(stepIndex, path)} className="px-1 bg-red-400 rounded">✖</button>
        )}
        <button onClick={() => addSkill(stepIndex, path)} className="px-1 bg-blue-400 rounded">＋</button>
      </div>
      {skill.subcategories && skill.subcategories.map((sk, idx) => renderSkill(sk, stepIndex, [...path, idx]))}
    </div>
  );

  // ===== RENDER =====
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-4/5 max-h-[90vh] overflow-y-auto rounded-xl shadow-lg p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-2xl font-bold text-yellow-700">Admin Editor</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-black text-lg">✕</button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {formData?.steps?.map((step: any, stepIndex: number) => (
              <div key={step.id} className="p-3 border rounded mb-4">
                <h3 className="font-bold">{step.title}</h3>

                {/* Basic fields */}
                {["basicInfo", "projects", "services", "media"].map((section) =>
                  step[section]?.fields?.length ? (
                    <div key={section} className="my-2">
                      <h4>{section}</h4>
                      {step[section].fields.map((f: Field, idx: number) => (
                        <div key={f.id} className="flex items-center space-x-2 my-1">
                          <input
                            type="text"
                            value={f.label}
                            onChange={(e) => updateField(stepIndex, section, idx, "label", e.target.value)}
                            className="border p-1 rounded flex-1"
                          />
                          {f.draft ? (
                            <>
                              <button onClick={() => confirmField(stepIndex, section, idx)} className="px-1 bg-green-400 rounded">✔</button>
                              <button onClick={() => deleteField(stepIndex, section, idx)} className="px-1 bg-red-400 rounded">✖</button>
                            </>
                          ) : (
                            <button onClick={() => deleteField(stepIndex, section, idx)} className="px-1 bg-red-400 rounded">✖</button>
                          )}
                        </div>
                      ))}
                      <button onClick={() => addField(stepIndex, section)} className="px-2 py-1 bg-blue-400 text-white rounded mt-1">＋ Add Field</button>
                    </div>
                  ) : null
                )}

                {/* Categories */}
                {step.categories?.available?.length && (
                  <div className="my-2">
                    <h4>Categories</h4>
                    {step.categories.available.map((cat: Category, cIdx: number) => (
                      <div key={cat.id} className="pl-2 border-l my-1">
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={cat.name}
                            onChange={(e) => updateCategory(stepIndex, cIdx, "name", e.target.value)}
                            className="border p-1 rounded flex-1"
                          />
                          {cat.draft ? (
                            <>
                              <button onClick={() => confirmCategory(stepIndex, cIdx)} className="px-1 bg-green-400 rounded">✔</button>
                              <button onClick={() => deleteCategory(stepIndex, cIdx)} className="px-1 bg-red-400 rounded">✖</button>
                            </>
                          ) : (
                            <button onClick={() => deleteCategory(stepIndex, cIdx)} className="px-1 bg-red-400 rounded">✖</button>
                          )}
                          <button onClick={() => addSubcategory(stepIndex, cIdx)} className="px-1 bg-blue-400 rounded">＋</button>
                        </div>
                        {cat.subcategories.map((sub, sIdx) => (
                          <div key={sub.id} className="pl-4 flex items-center space-x-2">
                            <input
                              type="text"
                              value={sub.name}
                            //   onChange={(e) => updateCategory(stepIndex, cIdx, "subcategories", sub.name)}
                            onChange={(e) =>
  updateSubcategory(stepIndex, cIdx, sIdx, "name", e.target.value)
}

                              className="border p-1 rounded flex-1"
                            />
                            {sub.draft ? (
                              <>
                                <button onClick={() => confirmSubcategory(stepIndex, cIdx, sIdx)} className="px-1 bg-green-400 rounded">✔</button>
                                <button onClick={() => deleteSubcategory(stepIndex, cIdx, sIdx)} className="px-1 bg-red-400 rounded">✖</button>
                              </>
                            ) : (
                              <button onClick={() => deleteSubcategory(stepIndex, cIdx, sIdx)} className="px-1 bg-red-400 rounded">✖</button>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                    <button onClick={() => addCategory(stepIndex)} className="px-2 py-1 bg-blue-400 text-white rounded mt-1">＋ Add Category</button>
                  </div>
                )}

                {/* Skills */}
                {step.skills?.tree?.length && (
                  <div className="my-2">
                    <h4>Skills</h4>
                    {/* {step.skills.tree.map((sk: Skill, idx: number) => renderSkill(sk, stepIndex, [idx]))} */}
                    <div className="space-y-2">
  {step.skills.tree.map((sk: Skill, idx: number) =>
    renderSkill(sk, stepIndex, [idx])
  )}

  {/* ✅ Add Parent Button */}
  <button
    type="button"
    onClick={() => addSkill(stepIndex, [])}
    className="mt-3 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
  >
    ➕ Add Parent Skill
  </button>
</div>

                  </div>
                )}
              </div>
            ))}
          </>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-yellow-400 rounded font-medium"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};
