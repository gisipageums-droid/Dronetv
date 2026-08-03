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
// //     //       className={`px-3 py-1 rounded border ${selected.includes(opt) ? 'bg-status-info text-white' : 'bg-ink-light'}`}
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
// //       className={`h-24 w-40 rounded-lg border-2 border-ink-light text-lg font-medium transition-colors
// //         ${
// //           selected.includes(opt)
// //             ? 'bg-status-info text-white hover:bg-status-info'
// //             : 'bg-status-info/15 text-status-info hover:bg-status-info/25'
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
//     // ? 'h-24 w-40 rounded-lg border-2 border-ink-light text-lg font-medium transition-colors'
//     ? 'h-24 w-40 rounded-lg border-2 border-ink-light text-lg font-medium transition-colors'
//     : 'h-16 w-32 rounded-md border border-ink-light text-base';

//   return (
//     <div className="flex flex-wrap gap-4 justify-center">
//       {options.map(opt => (
//         // <button
//         //   key={opt}
//         //   type="button"
//         //   onClick={() => toggle(opt)}
//         //   className={`${baseClass} ${
//         //     selected.includes(opt)
//         //       ? variant === 'categories' ? 'bg-brand-yellow-soft border-2 border-brand-yellow-soft text-brown-800 hover:bg-brand-yellow' : 'h-8 w-64 bg-status-info/25 text-status-info border-2 border-status-info hover:bg-status-info/15'
//         //       : variant === 'categories' ? ' text-ink-800 border-2 border-brand-yellow-soft hover:bg-brand-yellow-soft border-2 border-brown-500 ' : ' h-8 w-64 bg-surface-main border-2 border-grey-400 text-ink-800 hover:bg-status-info/25'
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
//         ? "bg-brand-yellow-soft border-2 border-brand-yellow-soft text-brown-800 hover:bg-brand-yellow"
//         : "h-8 w-40  text-xs bg-status-info/25 text-status-info border-2 border-status-info hover:bg-status-info/15"
//       : variant === "categories"
//         ? "text-ink-800 border-2 border-brand-yellow-soft hover:bg-brand-yellow-soft border-2 border-brown-500"
//         : "h-8 w-40  text-xs bg-surface-main border-2 border-ink-light text-ink-800 hover:bg-status-info/25"
//   }`}
// >
//   {/* Show checkbox ONLY if variant !== categories */}
//   {variant !== "categories" && (
//     selected.includes(opt) ? (
//       <span className="w-4 h-4 flex items-center justify-center rounded-sm border border-status-info bg-status-info">
//         <Check className="w-3 h-3 text-white" />
//       </span>
//     ) : (
//       <span className="w-4 h-4 border border-ink-caption rounded-sm"></span>
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
//             //     ? "bg-brand-gold text-white border-brand-gold shadow-lg scale-105"
//             //     : "bg-surface-card text-ink-paragraph border-brand-yellow-soft hover:bg-surface-main hover:border-brand-yellow"
//             // }`}
//             className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all 
//               w-full h-24 justify-between ${
//               selected.includes(name)
//                 ? "bg-brand-gold text-white border-brand-gold shadow-lg scale-105"
//                 : "bg-surface-card text-ink-paragraph border-brand-yellow-soft hover:bg-surface-main hover:border-brand-yellow"
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
                  ? "bg-brand-yellow-soft text-brown border-brand-gold shadow-lg scale-105"
                  : "bg-status-info/25 text-status-info border-status-info hover:bg-status-info/15"
                : variant === "categories"
                  ? "bg-surface-card text-ink-paragraph border-brand-yellow-soft hover:bg-surface-main hover:border-brand-yellow"
                  : "bg-surface-main border-ink-light text-ink-800 hover:bg-status-info/25"
            }`}
          >
            {/* Checkbox for subcategories only */}
            {variant === "subcategories" && (
              selected.includes(name) ? (
                <span className="w-4 h-4 flex items-center justify-center rounded-sm border border-status-info bg-status-info">
                  ✓
                </span>
              ) : (
                <span className="w-4 h-4 border border-ink-caption rounded-sm"></span>
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