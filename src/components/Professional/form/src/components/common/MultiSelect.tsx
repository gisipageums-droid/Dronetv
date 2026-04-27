// // interface MultiSelectProps {
// //   options: string[];
// //   selected: string[];
// //   onChange: (selected: string[]) => void;
// // }

// import { Check } from "lucide-react";

// // export const MultiSelect = ({ options, selected, onChange }: MultiSelectProps) => {
// //   const toggle = (value: string) => {
// //     if (selected.includes(value)) onChange(selected.filter(s => s !== value));
// //     else onChange([...selected, value]);
// //   };
// //   return (
// //     // <div className="flex flex-wrap gap-2">
// //     //   {options.map(opt => (
// //     //     <button
// //     //       key={opt}
// //     //       type="button"
// //     //       onClick={() => toggle(opt)}
// //     //       className={`px-3 py-1 rounded border ${selected.includes(opt) ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
// //     //     >
// //     //       {opt}
// //     //     </button>
// //     //   ))}
// //     // </div>
// //     <div className="flex flex-wrap gap-4">
// //   {options.map(opt => (
// //     <button
// //       key={opt}
// //       type="button"
// //       onClick={() => toggle(opt)}
// //       className={`h-24 w-40 rounded-lg border-2 border-gray-200 text-lg font-medium transition-colors
// //         ${
// //           selected.includes(opt)
// //             ? 'bg-blue-400 text-white hover:bg-blue-500'
// //             : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
// //         }`}
// //     >
// //       {opt}
// //     </button>
// //   ))}
// // </div>

// //   );
// // };




// interface MultiSelectProps {
//   options: string[];
//   selected: string[];
//   onChange: (selected: string[]) => void;
//   variant?: 'categories' | 'subcategories';
// }

// export const MultiSelect = ({ options, selected, onChange, variant = 'categories' }: MultiSelectProps) => {
//   const toggle = (value: string) => {
//     if (selected.includes(value)) onChange(selected.filter(s => s !== value));
//     else onChange([...selected, value]);
//   };

//   const baseClass = variant === 'categories'
//     // ? 'h-24 w-40 rounded-lg border-2 border-gray-200 text-lg font-medium transition-colors'
//     ? 'h-24 w-40 rounded-lg border-2 border-gray-200 text-lg font-medium transition-colors'
//     : 'h-16 w-32 rounded-md border border-gray-300 text-base';

//   return (
//     <div className="flex flex-wrap gap-4 justify-center">
//       {options.map(opt => (
//         // <button
//         //   key={opt}
//         //   type="button"
//         //   onClick={() => toggle(opt)}
//         //   className={`${baseClass} ${
//         //     selected.includes(opt)
//         //       ? variant === 'categories' ? 'bg-yellow-100 border-2 border-yellow-300 text-brown-800 hover:bg-yellow-400' : 'h-8 w-64 bg-blue-200 text-blue-800 border-2 border-blue-400 hover:bg-blue-100'
//         //       : variant === 'categories' ? ' text-black-800 border-2 border-yellow-300 hover:bg-yellow-100 border-2 border-brown-500 ' : ' h-8 w-64 bg-yellow-50 border-2 border-grey-400 text-black-800 hover:bg-blue-200'
//         //   }`}
//         // >
//         //   {opt}
//         // </button>


//        <button
//   key={opt}
//   type="button"
//   onClick={() => toggle(opt)}
//   className={`${baseClass} flex items-center justify-center gap-2 ${
//     selected.includes(opt)
//       ? variant === "categories"
//         ? "bg-yellow-100 border-2 border-yellow-300 text-brown-800 hover:bg-yellow-400"
//         : "h-8 w-40  text-xs bg-blue-200 text-blue-800 border-2 border-blue-400 hover:bg-blue-100"
//       : variant === "categories"
//         ? "text-black-800 border-2 border-yellow-300 hover:bg-yellow-100 border-2 border-brown-500"
//         : "h-8 w-40  text-xs bg-yellow-50 border-2 border-gray-200 text-black-800 hover:bg-blue-200"
//   }`}
// >
//   {/* Show checkbox ONLY if variant !== categories */}
//   {variant !== "categories" && (
//     selected.includes(opt) ? (
//       <span className="w-4 h-4 flex items-center justify-center rounded-sm border border-blue-500 bg-blue-500">
//         <Check className="w-3 h-3 text-white" />
//       </span>
//     ) : (
//       <span className="w-4 h-4 border border-gray-400 rounded-sm"></span>
//     )
//   )}

//   {/* Label */}
//   <span>{opt}</span>
// </button>



//       ))}
//     </div>
//   );
// };






// // MultiSelect component
// export const MultiSelect = ({ 
//   options, 
//   selected, 
//   onChange, 
//   variant 
// }: { 
//   options: any[]; // Change from string[] to any[]
//   selected: string[];
//   onChange: (vals: string[]) => void;
//   variant: "categories" | "subcategories";
// }) => {
//   return (
//     <div className="grid grid-cols-3 gap-4 justify-center">
//       {/* <div className="flex flex-wrap gap-4 justify-center"> */}
//       {options.map((option) => {
//         // Handle both string and object options
//         const name = typeof option === 'string' ? option : option.name;
//         const placeholder = typeof option === 'string' ? null : option.placeholder;
        
//         return (
//           <button
//             key={name}
//             type="button"
//             onClick={() => {
//               if (selected.includes(name)) {
//                 onChange(selected.filter(item => item !== name));
//               } else {
//                 onChange([...selected, name]);
//               }
//             }}
//             // className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all min-w-[140px] ${
//             //   selected.includes(name)
//             //     ? "bg-amber-500 text-white border-amber-600 shadow-lg scale-105"
//             //     : "bg-white text-gray-700 border-amber-300 hover:bg-amber-50 hover:border-amber-400"
//             // }`}
//             className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all 
//               w-full h-24 justify-between ${
//               selected.includes(name)
//                 ? "bg-amber-500 text-white border-amber-600 shadow-lg scale-105"
//                 : "bg-white text-gray-700 border-amber-300 hover:bg-amber-50 hover:border-amber-400"
//             }`}
//           >
//             <span className="font-semibold text-center">{name}</span>
            
//             {/* Show placeholder if it exists */}
//             {placeholder && (
//               <span className="text-xs mt-2 opacity-80 text-center leading-tight">
//                 {placeholder}
//               </span>
//             )}
//           </button>
//         );
//       })}
//     </div>
//   );
// };
// above is working fine but for subcategiries size issue persists



// MultiSelect component
export const MultiSelect = ({ 
  options, 
  selected, 
  onChange, 
  variant 
}: { 
  options: any[];
  selected: string[];
  onChange: (vals: string[]) => void;
  variant: "categories" | "subcategories";
}) => {
  return (
    <div className={variant === "categories" ? "grid grid-cols-3 gap-4 justify-center" : "flex flex-wrap gap-2 justify-center"}>
      {options.map((option) => {
        const name = typeof option === 'string' ? option : option.name;
        const placeholder = typeof option === 'string' ? null : option.placeholder;
        
        return (
          <button
            key={name}
            type="button"
            onClick={() => {
              if (selected.includes(name)) {
                onChange(selected.filter(item => item !== name));
              } else {
                onChange([...selected, name]);
              }
            }}
            className={`flex items-center justify-center rounded-lg border-2 transition-all ${
              variant === "categories" 
                ? "flex-col p-4 w-full h-24 justify-between" // Categories
                : "p-2 h-8 w-40 text-xs gap-2" // Subcategories (exact old style)
            } ${
              selected.includes(name)
                ? variant === "categories"
                  ? "bg-amber-100 text-brown border-amber-600 shadow-lg scale-105"
                  : "bg-blue-200 text-blue-800 border-blue-400 hover:bg-blue-100"
                : variant === "categories"
                  ? "bg-white text-gray-700 border-amber-300 hover:bg-amber-50 hover:border-amber-400"
                  : "bg-yellow-50 border-gray-200 text-black-800 hover:bg-blue-200"
            }`}
          >
            {/* Checkbox for subcategories only */}
            {variant === "subcategories" && (
              selected.includes(name) ? (
                <span className="w-4 h-4 flex items-center justify-center rounded-sm border border-blue-500 bg-blue-500">
                  ✓
                </span>
              ) : (
                <span className="w-4 h-4 border border-gray-400 rounded-sm"></span>
              )
            )}
            
            <span className={`font-semibold text-center ${
              variant === "subcategories" ? "text-xs" : ""
            }`}>
              {name}
            </span>
            
            {/* Show placeholder only for categories */}
            {variant === "categories" && placeholder && (
              <span className="text-xs mt-2 opacity-80 text-center leading-tight">
                {placeholder}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};