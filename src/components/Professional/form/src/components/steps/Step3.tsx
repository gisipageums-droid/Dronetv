// import { useForm } from "../../context/FormContext";
// import { useState } from "react";

// interface SkillNode {
//   name: string;
//   id?: string;
//   subcategories?: SkillNode[];
// }

// interface SkillContainerProps {
//   level: number;
//   nodes: SkillNode[];
//   expandedPath: SkillNode[];
//   onClick: (node: SkillNode, level: number, parents: string[]) => void;
//   selectedSkills: string[];
//   parents: string[];
// }

// const containerClasses = (level: number) => {
//   if (level === 0) return "bg-transparent border-0"; // clear top-level
//   if (level === 1) return "bg-blue-50 border border-blue-200"; // 2nd level
//   return "bg-white border border-gray-200"; // deeper levels
// };

// const SkillContainer = ({
//   level,
//   nodes,
//   expandedPath,
//   onClick,
//   selectedSkills,
//   parents,
// }: SkillContainerProps) => {
//   return (
//     <div className={`p-3 rounded-lg ${containerClasses(level)} space-y-2`}>
//       {nodes.map((node) => {
//         const isLeaf = !node.subcategories || node.subcategories.length === 0;
//         const isExpanded =
//           expandedPath.length > level &&
//           expandedPath[level]?.name === node.name;
//         const isSelected = selectedSkills.includes(node.name);

//         return (
//           <div key={node.id || node.name}>
//             {/* Checkbox + Label */}
//             <div
//               onClick={() => onClick(node, level, parents)}
//               className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer ${
//                 isSelected ? "bg-yellow-100" : "hover:bg-yellow-50"
//               }`}
//             >
//               <input
//                 type="checkbox"
//                 checked={isSelected}
//                 onChange={() => onClick(node, level, parents)}
//                 className="w-3 h-3"
//               />
//               <span className="text-xs font-medium">{node.name}</span>
//             </div>

//             {/* Children */}
//             {isExpanded && node.subcategories && node.subcategories.length > 0 && (
//               <div className="ml-4 mt-2">
//                 <SkillContainer
//                   level={level + 1}
//                   nodes={node.subcategories}
//                   expandedPath={expandedPath}
//                   onClick={onClick}
//                   selectedSkills={selectedSkills}
//                   parents={[...parents, node.name]}
//                 />
//               </div>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// };


// export const Step3 = ({ step }: { step: any }) => {
//   const { data, updateField } = useForm();
//   const [expandedPath, setExpandedPath] = useState<SkillNode[]>([]);

//   const toggleExpand = (node: SkillNode, level: number, parents: string[]) => {
//     const isLeaf = !node.subcategories || node.subcategories.length === 0;
//     const current = new Set(data.skills);

//     if (isLeaf) {
//       const fullPath = [...parents, node.name];
//       if (current.has(node.name)) {
//         current.delete(node.name);
//       } else {
//         fullPath.forEach((s) => current.add(s));
//       }
//       updateField("skills", Array.from(current));
//     } else {
//       // toggle parent node
//       if (current.has(node.name)) {
//         current.delete(node.name);
//       } else {
//         current.add(node.name);
//       }
//       updateField("skills", Array.from(current));

//       // expand/collapse
//       if (expandedPath[level]?.name === node.name) {
//         setExpandedPath(expandedPath.slice(0, level));
//       } else {
//         setExpandedPath([...expandedPath.slice(0, level), node]);
//       }
//     }
//   };

//   // Freeform skill handling (same as before)
//   const handleFreeformKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter" || e.key === ",") {
//       e.preventDefault();
//       const value = e.currentTarget.value.trim().replace(",", "");
//       if (value && !data.freeformSkills.includes(value)) {
//         updateField("freeformSkills", [...data.freeformSkills, value]);
//       }
//       e.currentTarget.value = "";
//     }
//   };

//   const removeFreeformSkill = (skill: string) => {
//     updateField(
//       "freeformSkills",
//       data.freeformSkills.filter((s) => s !== skill)
//     );
//   };

//   return (
//     <div className="space-y-6">
//       <h2 className="text-xl font-semibold">{step.title}</h2>

//       {/* Recursive Skill Tree */}
//       <SkillContainer
//         level={0}
//         nodes={step.skills?.tree || []}
//         expandedPath={expandedPath}
//         onClick={toggleExpand}
//         selectedSkills={data.skills || []}
//         parents={[]}
//       />

//       {/* Freeform Skills */}
//       {step.skills?.freeformSkills?.enabled && (
//         <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-white border border-yellow-200">
//           <label className="block mb-2 font-medium text-xs">
//             {step.skills.freeformSkills.placeholder}
//           </label>
//           <div className="flex flex-wrap gap-2 mb-2">
//             {data.freeformSkills.map((skill) => (
//               <span
//                 key={skill}
//                 className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700 flex items-center gap-1"
//               >
//                 {skill}
//                 <button
//                   onClick={() => removeFreeformSkill(skill)}
//                   className="text-red-500 font-bold text-xs"
//                 >
//                   ×
//                 </button>
//               </span>
//             ))}
//           </div>
//           <input
//             type="text"
//             className="border p-2 w-full rounded text-xs focus:ring-2 focus:ring-yellow-400"
//             placeholder="Type and press Enter or comma..."
//             onKeyDown={handleFreeformKeyDown}
//           />
//         </div>
//       )}
//     </div>
//   );
// };






// import { useForm } from "../../context/FormContext";
// import { useEffect, useState } from "react";

// interface SkillNode {
//   name: string;
//   id?: string;
//   subcategories?: SkillNode[];
// }

// interface SkillContainerProps {
//   level: number;
//   nodes: SkillNode[];
//   expandedPaths: string[][]; // multiple expanded paths
//   onClick: (node: SkillNode, level: number, parents: string[]) => void;
//   selectedSkills: string[];
//   parents: string[];
// }

// const containerClasses = (level: number) => {
//   if (level === 0) return "bg-transparent border-0";
//   if (level === 1) return "bg-blue-50 border border-blue-200";
//   return "bg-white border border-gray-200";
// };

// const SkillContainer = ({
//   level,
//   nodes,
//   expandedPaths,
//   onClick,
//   selectedSkills,
//   parents,
// }: SkillContainerProps) => {
//   return (
//     <div className={`p-3 rounded-lg ${containerClasses(level)} space-y-2`}>
//       {nodes.map((node) => {
//         const isLeaf = !node.subcategories || node.subcategories.length === 0;

//         // check if current node is part of any expanded path
//         const isExpanded = expandedPaths.some(
//           (path) => path[level] === node.name
//         );
//         const isSelected = selectedSkills.includes(node.name);

//         return (
//           <div key={node.id || node.name}>
//             {/* Checkbox + Label */}
//             <div
//               onClick={() => onClick(node, level, parents)}
//               className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer ${
//                 isSelected ? "bg-yellow-100" : "hover:bg-yellow-50"
//               }`}
//             >
//               <input
//                 type="checkbox"
//                 checked={isSelected}
//                 onChange={() => onClick(node, level, parents)}
//                 className="w-3 h-3"
//               />
//               <span className="text-xs font-medium">{node.name}</span>
//             </div>

//             {/* Children */}
//             {isExpanded && node.subcategories?.length > 0 && (
//               <div className="ml-4 mt-2">
//                 <SkillContainer
//                   level={level + 1}
//                   nodes={node.subcategories}
//                   expandedPaths={expandedPaths}
//                   onClick={onClick}
//                   selectedSkills={selectedSkills}
//                   parents={[...parents, node.name]}
//                 />
//               </div>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export const Step3 = ({ step }: { step: any }) => {
//   const { data, updateField } = useForm();
//   const [expandedPaths, setExpandedPaths] = useState<string[][]>([]); // multiple paths

//   // const toggleExpand = (node: SkillNode, level: number, parents: string[]) => {
//   //   const isLeaf = !node.subcategories || node.subcategories.length === 0;
//   //   const current = new Set(data.skills);

//   //   if (isLeaf) {
//   //     const fullPath = [...parents, node.name];
//   //     if (current.has(node.name)) {
//   //       current.delete(node.name);
//   //     } else {
//   //       fullPath.forEach((s) => current.add(s));
//   //     }
//   //     updateField("skills", Array.from(current));
//   //   } else {
//   //     if (current.has(node.name)) {
//   //       current.delete(node.name);
//   //     } else {
//   //       current.add(node.name);
//   //     }
//   //     updateField("skills", Array.from(current));

//   //     // Toggle expansion for this branch
//   //     const pathToNode = [...parents, node.name];
//   //     const alreadyExpanded = expandedPaths.some(
//   //       (p) => JSON.stringify(p.slice(0, pathToNode.length)) === JSON.stringify(pathToNode)
//   //     );

//   //     if (alreadyExpanded) {
//   //       setExpandedPaths(expandedPaths.filter(
//   //         (p) => JSON.stringify(p.slice(0, pathToNode.length)) !== JSON.stringify(pathToNode)
//   //       ));
//   //     } else {
//   //       setExpandedPaths([...expandedPaths, pathToNode]);
//   //     }
//   //   }
//   // };



  
//   // ✅ Auto-expand all parent levels for prefilled skills
//   useEffect(() => {
//     if (step.skills?.tree && data.skills?.length > 0) {
//       const allPaths: string[][] = [];

//       const findAllPaths = (
//         nodes: SkillNode[],
//         targetNames: string[],
//         currentPath: string[] = []
//       ) => {
//         for (const node of nodes) {
//           const newPath = [...currentPath, node.name];
//           if (targetNames.includes(node.name)) {
//             allPaths.push(newPath);
//           }
//           if (node.subcategories) {
//             findAllPaths(node.subcategories, targetNames, newPath);
//           }
//         }
//       };

//       findAllPaths(step.skills.tree, data.skills);
//       setExpandedPaths(allPaths);
//     }
//   }, [step, data.skills]);

//   // Freeform input handling
//   const handleFreeformKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter" || e.key === ",") {
//       e.preventDefault();
//       const value = e.currentTarget.value.trim().replace(",", "");
//       if (value && !data.freeformSkills.includes(value)) {
//         updateField("freeformSkills", [...data.freeformSkills, value]);
//       }
//       e.currentTarget.value = "";
//     }
//   };

//   const removeFreeformSkill = (skill: string) => {
//     updateField(
//       "freeformSkills",
//       data.freeformSkills.filter((s) => s !== skill)
//     );
//   };

//   return (
//     <div className="space-y-6">
//       <h2 className="text-xl font-semibold">{step.title}</h2>

//       {/* Recursive Skill Tree */}
//       <SkillContainer
//         level={0}
//         nodes={step.skills?.tree || []}
//         expandedPaths={expandedPaths}
//         onClick={toggleExpand}
//         selectedSkills={data.skills || []}
//         parents={[]}
//       />

//       {/* Freeform Skills */}
//       {step.skills?.freeformSkills?.enabled && (
//         <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-white border border-yellow-200">
//           <label className="block mb-2 font-medium text-xs">
//             {step.skills.freeformSkills.placeholder}
//           </label>
//           <div className="flex flex-wrap gap-2 mb-2">
//             {data.freeformSkills.map((skill) => (
//               <span
//                 key={skill}
//                 className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700 flex items-center gap-1"
//               >
//                 {skill}
//                 <button
//                   onClick={() => removeFreeformSkill(skill)}
//                   className="text-red-500 font-bold text-xs"
//                 >
//                   ×
//                 </button>
//               </span>
//             ))}
//           </div>
//           <input
//             type="text"
//             className="border p-2 w-full rounded text-xs focus:ring-2 focus:ring-yellow-400"
//             placeholder="Type and press Enter or comma..."
//             onKeyDown={handleFreeformKeyDown}
//           />
//         </div>
//       )}

//       {/* ✅ Selected Skills Summary */}
//       {(data.skills?.length > 0 || data.freeformSkills?.length > 0) && (
//         <div className="mt-4">
//           <h3 className="text-sm font-semibold mb-2 text-gray-700">
//             Selected Skills:
//           </h3>
//           <div className="flex flex-wrap gap-2">
//             {[...(data.skills || []), ...(data.freeformSkills || [])].map((skill) => (
//               <button
//                 key={skill}
//                 className="px-3 py-1 bg-yellow-200 text-black text-xs rounded-full border border-yellow-400 hover:bg-yellow-300"
//               >
//                 {skill}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };



// final working one with all parent unselect logic working


// import { useForm } from "../../context/FormContext";
// import { useEffect, useState } from "react";

// interface SkillNode {
//   name: string;
//   id?: string;
//   subcategories?: SkillNode[];
// }

// interface SkillContainerProps {
//   level: number;
//   nodes: SkillNode[];
//   expandedPaths: string[][]; // multiple expanded paths
//   onClick: (node: SkillNode, level: number, parents: string[]) => void;
//   selectedSkills: string[];
//   parents: string[];
// }

// const containerClasses = (level: number) => {
//   if (level === 0) return "bg-transparent border-0";
//   if (level === 1) return "bg-blue-50 border border-blue-200";
//   return "bg-white border border-gray-200";
// };

// const SkillContainer = ({
//   level,
//   nodes,
//   expandedPaths,
//   onClick,
//   selectedSkills,
//   parents,
// }: SkillContainerProps) => {
//   return (
//     <div className={`p-3 rounded-lg ${containerClasses(level)} space-y-2`}>
//       {nodes.map((node) => {
//         const isLeaf = !node.subcategories || node.subcategories.length === 0;

//         // check if current node is part of any expanded path
//         const isExpanded = expandedPaths.some((path) => path[level] === node.name);
//         const isSelected = selectedSkills.includes(node.name);

//         return (
//           <div key={node.id || node.name}>
//             {/* Checkbox + Label */}
//             <div
//               onClick={() => onClick(node, level, parents)}
//               className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer ${
//                 isSelected ? "bg-yellow-100" : "hover:bg-yellow-50"
//               }`}
//             >
//               <input
//                 type="checkbox"
//                 checked={isSelected}
//                 onChange={() => onClick(node, level, parents)}
//                 className="w-3 h-3"
//               />
//               <span className="text-xs font-medium">{node.name}</span>
//             </div>

//             {/* Children */}
//             {isExpanded && node.subcategories?.length > 0 && (
//               <div className="ml-4 mt-2">
//                 <SkillContainer
//                   level={level + 1}
//                   nodes={node.subcategories}
//                   expandedPaths={expandedPaths}
//                   onClick={onClick}
//                   selectedSkills={selectedSkills}
//                   parents={[...parents, node.name]}
//                 />
//               </div>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export const Step3 = ({ step }: { step: any }) => {
//   const { data, updateField } = useForm();
//   const [expandedPaths, setExpandedPaths] = useState<string[][]>([]);

//   // ✅ Toggle with recursive deselection logic
//   const toggleExpand = (node: SkillNode, level: number, parents: string[]) => {
//     const isLeaf = !node.subcategories || node.subcategories.length === 0;
//     const current = new Set(data.skills);

//     // Helper: recursively get all descendants
//     const getAllDescendants = (n: SkillNode): string[] => {
//       if (!n.subcategories || n.subcategories.length === 0) return [];
//       return n.subcategories.flatMap((child) => [child.name, ...getAllDescendants(child)]);
//     };

//     if (isLeaf) {
//       if (current.has(node.name)) {
//         current.delete(node.name);
//       } else {
//         current.add(node.name);
//       }
//     } else {
//       if (current.has(node.name)) {
//         // ❌ Unselect parent and all its children
//         current.delete(node.name);
//         const allChildren = getAllDescendants(node);
//         allChildren.forEach((childName) => current.delete(childName));
//       } else {
//         // ✅ Select only parent
//         current.add(node.name);
//       }

//       // Toggle expansion for this branch
//       const pathToNode = [...parents, node.name];
//       const alreadyExpanded = expandedPaths.some(
//         (p) => JSON.stringify(p.slice(0, pathToNode.length)) === JSON.stringify(pathToNode)
//       );

//       if (alreadyExpanded) {
//         setExpandedPaths(
//           expandedPaths.filter(
//             (p) => JSON.stringify(p.slice(0, pathToNode.length)) !== JSON.stringify(pathToNode)
//           )
//         );
//       } else {
//         setExpandedPaths([...expandedPaths, pathToNode]);
//       }
//     }

//     updateField("skills", Array.from(current));
//   };

//   // ✅ Auto-expand prefilled skills
//   useEffect(() => {
//     if (step.skills?.tree && data.skills?.length > 0) {
//       const allPaths: string[][] = [];

//       const findAllPaths = (
//         nodes: SkillNode[],
//         targetNames: string[],
//         currentPath: string[] = []
//       ) => {
//         for (const node of nodes) {
//           const newPath = [...currentPath, node.name];
//           if (targetNames.includes(node.name)) {
//             allPaths.push(newPath);
//           }
//           if (node.subcategories) {
//             findAllPaths(node.subcategories, targetNames, newPath);
//           }
//         }
//       };

//       findAllPaths(step.skills.tree, data.skills);
//       setExpandedPaths(allPaths);
//     }
//   }, [step, data.skills]);

//   // Freeform input handling
//   const handleFreeformKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter" || e.key === ",") {
//       e.preventDefault();
//       const value = e.currentTarget.value.trim().replace(",", "");
//       if (value && !data.freeformSkills.includes(value)) {
//         updateField("freeformSkills", [...data.freeformSkills, value]);
//       }
//       e.currentTarget.value = "";
//     }
//   };

//   const removeFreeformSkill = (skill: string) => {
//     updateField(
//       "freeformSkills",
//       data.freeformSkills.filter((s) => s !== skill)
//     );
//   };

//   return (
//     <div className="space-y-6">
//       <h2 className="text-xl font-semibold">{step.title}</h2>

//       {/* Recursive Skill Tree */}
//       <SkillContainer
//         level={0}
//         nodes={step.skills?.tree || []}
//         expandedPaths={expandedPaths}
//         onClick={toggleExpand}
//         selectedSkills={data.skills || []}
//         parents={[]}
//       />

//       {/* Freeform Skills */}
//       {step.skills?.freeformSkills?.enabled && (
//         <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-white border border-yellow-200">
//           <label className="block mb-2 font-medium text-xs">
//             {step.skills.freeformSkills.placeholder}
//           </label>
//           <div className="flex flex-wrap gap-2 mb-2">
//             {data.freeformSkills.map((skill) => (
//               <span
//                 key={skill}
//                 className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700 flex items-center gap-1"
//               >
//                 {skill}
//                 <button
//                   onClick={() => removeFreeformSkill(skill)}
//                   className="text-red-500 font-bold text-xs"
//                 >
//                   ×
//                 </button>
//               </span>
//             ))}
//           </div>
//           <input
//             type="text"
//             className="border p-2 w-full rounded text-xs focus:ring-2 focus:ring-yellow-400"
//             placeholder="Type and press Enter or comma..."
//             onKeyDown={handleFreeformKeyDown}
//           />
//         </div>
//       )}

//       {/* ✅ Selected Skills Summary */}
//       {(data.skills?.length > 0 || data.freeformSkills?.length > 0) && (
//         <div className="mt-4">
//           <h3 className="text-sm font-semibold mb-2 text-gray-700">Selected Skills:</h3>
//           <div className="flex flex-wrap gap-2">
//             {[...(data.skills || []), ...(data.freeformSkills || [])].map((skill) => (
//               <button
//                 key={skill}
//                 className="px-3 py-1 bg-yellow-200 text-black text-xs rounded-full border border-yellow-400 hover:bg-yellow-300"
//               >
//                 {skill}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };








import { useForm } from "../../context/FormContext";
import { useEffect, useState } from "react";

interface SkillNode {
  name: string;
  id?: string;
  subcategories?: SkillNode[];
}

interface SkillContainerProps {
  level: number;
  nodes: SkillNode[];
  expandedPaths: string[][]; // multiple expanded paths
  onClick: (node: SkillNode, level: number, parents: string[]) => void;
  selectedSkills: string[];
  parents: string[];
}

const containerClasses = (level: number) => {
  if (level === 0) return "bg-transparent border-0";
  if (level === 1) return "bg-blue-50 border border-blue-200";
  return "bg-white border border-gray-200";
};

const SkillContainer = ({
  level,
  nodes,
  expandedPaths,
  onClick,
  selectedSkills,
  parents,
}: SkillContainerProps) => {
  return (
    <div className={`p-3 rounded-lg ${containerClasses(level)} space-y-2`}>
      {nodes.map((node) => {
        const hasChildren = Array.isArray(node.subcategories) && node.subcategories.length > 0;
        const isExpanded = expandedPaths.some((path) => path[level] === node.name);
        const isSelected = selectedSkills.includes(node.name);

        return (
          <div key={node.id || node.name}>
            {/* Checkbox + Label */}
            <div
              onClick={() => onClick(node, level, parents)}
              className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer ${
                isSelected ? "bg-yellow-100" : "hover:bg-yellow-50"
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onClick(node, level, parents)}
                className="w-3 h-3"
              />
              <span className="text-xs font-medium">{node.name}</span>
            </div>

            {/* Children */}
            {isExpanded && hasChildren && (
              <div className="ml-4 mt-2">
                <SkillContainer
                  level={level + 1}
                  nodes={node.subcategories ?? []} // ✅ Always array
                  expandedPaths={expandedPaths}
                  onClick={onClick}
                  selectedSkills={selectedSkills}
                  parents={[...parents, node.name]}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export const Step3 = ({ step }: { step: any }) => {
  const { data, updateField } = useForm();
  const [expandedPaths, setExpandedPaths] = useState<string[][]>([]);

  // ✅ Toggle logic with recursive deselection
  const toggleExpand = (node: SkillNode, level: number, parents: string[]) => {
    const current = new Set(data.skills);

    // Helper to get all descendants safely
    const getAllDescendants = (n: SkillNode): string[] => {
      if (!n.subcategories || n.subcategories.length === 0) return [];
      return n.subcategories.flatMap((child) => [child.name, ...getAllDescendants(child)]);
    };

    const hasChildren = Array.isArray(node.subcategories) && node.subcategories.length > 0;

    if (!hasChildren) {
      // leaf node
      if (current.has(node.name)) {
        current.delete(node.name);
      } else {
        current.add(node.name);
      }
    } else {
      if (current.has(node.name)) {
        // ❌ Unselect parent + all descendants
        current.delete(node.name);
        const allChildren = getAllDescendants(node);
        allChildren.forEach((childName) => current.delete(childName));
      } else {
        // ✅ Select only parent
        current.add(node.name);
      }

      // toggle expansion
      const pathToNode = [...parents, node.name];
      const alreadyExpanded = expandedPaths.some(
        (p) => JSON.stringify(p.slice(0, pathToNode.length)) === JSON.stringify(pathToNode)
      );

      if (alreadyExpanded) {
        setExpandedPaths(
          expandedPaths.filter(
            (p) => JSON.stringify(p.slice(0, pathToNode.length)) !== JSON.stringify(pathToNode)
          )
        );
      } else {
        setExpandedPaths([...expandedPaths, pathToNode]);
      }
    }

    updateField("skills", Array.from(current));
  };

  // ✅ Auto-expand all parent levels for prefilled skills
  useEffect(() => {
    if (step.skills?.tree && data.skills?.length > 0) {
      const allPaths: string[][] = [];

      const findAllPaths = (
        nodes: SkillNode[],
        targetNames: string[],
        currentPath: string[] = []
      ) => {
        for (const node of nodes) {
          const newPath = [...currentPath, node.name];
          if (targetNames.includes(node.name)) {
            allPaths.push(newPath);
          }
          if (node.subcategories) {
            findAllPaths(node.subcategories, targetNames, newPath);
          }
        }
      };

      findAllPaths(step.skills.tree, data.skills);
      setExpandedPaths(allPaths);
    }
  }, [step, data.skills]);

  // Freeform input handling
  const handleFreeformKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const value = e.currentTarget.value.trim().replace(",", "");
      if (value && !data.freeformSkills.includes(value)) {
        updateField("freeformSkills", [...data.freeformSkills, value]);
      }
      e.currentTarget.value = "";
    }
  };

  const removeFreeformSkill = (skill: string) => {
    updateField(
      "freeformSkills",
      data.freeformSkills.filter((s) => s !== skill)
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{step.title}</h2>

      {/* Recursive Skill Tree */}
      <SkillContainer
        level={0}
        nodes={step.skills?.tree || []}
        expandedPaths={expandedPaths}
        onClick={toggleExpand}
        selectedSkills={data.skills || []}
        parents={[]}
      />

      {/* Freeform Skills */}
      {step.skills?.freeformSkills?.enabled && (
        <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-white border border-yellow-200">
          <label className="block mb-2 font-medium text-xs">
            {step.skills.freeformSkills.placeholder}
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {data.freeformSkills.map((skill) => (
              <span
                key={skill}
                className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700 flex items-center gap-1"
              >
                {skill}
                <button
                  onClick={() => removeFreeformSkill(skill)}
                  className="text-red-500 font-bold text-xs"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            className="border p-2 w-full rounded text-xs focus:ring-2 focus:ring-yellow-400"
            placeholder="Type and press Enter or comma..."
            onKeyDown={handleFreeformKeyDown}
          />
        </div>
      )}

      {/* ✅ Selected Skills Summary */}
      {(data.skills?.length > 0 || data.freeformSkills?.length > 0) && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold mb-2 text-gray-700">Selected Skills:</h3>
          <div className="flex flex-wrap gap-2">
            {[...(data.skills || []), ...(data.freeformSkills || [])].map((skill) => (
              <button
                key={skill}
                className="px-3 py-1 bg-yellow-200 text-black text-xs rounded-full border border-yellow-400 hover:bg-yellow-300"
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
