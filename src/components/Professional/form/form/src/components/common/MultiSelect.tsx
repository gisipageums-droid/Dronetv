// interface MultiSelectProps {
//   options: string[];
//   selected: string[];
//   onChange: (selected: string[]) => void;
// }

import { Check } from "lucide-react";

// export const MultiSelect = ({ options, selected, onChange }: MultiSelectProps) => {
//   const toggle = (value: string) => {
//     if (selected.includes(value)) onChange(selected.filter(s => s !== value));
//     else onChange([...selected, value]);
//   };
//   return (
//     // <div className="flex flex-wrap gap-2">
//     //   {options.map(opt => (
//     //     <button
//     //       key={opt}
//     //       type="button"
//     //       onClick={() => toggle(opt)}
//     //       className={`px-3 py-1 rounded border ${selected.includes(opt) ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
//     //     >
//     //       {opt}
//     //     </button>
//     //   ))}
//     // </div>
//     <div className="flex flex-wrap gap-4">
//   {options.map(opt => (
//     <button
//       key={opt}
//       type="button"
//       onClick={() => toggle(opt)}
//       className={`h-24 w-40 rounded-lg border-2 border-gray-200 text-lg font-medium transition-colors
//         ${
//           selected.includes(opt)
//             ? 'bg-blue-400 text-white hover:bg-blue-500'
//             : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
//         }`}
//     >
//       {opt}
//     </button>
//   ))}
// </div>

//   );
// };




interface MultiSelectProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  variant?: 'categories' | 'subcategories';
}

export const MultiSelect = ({ options, selected, onChange, variant = 'categories' }: MultiSelectProps) => {
  const toggle = (value: string) => {
    if (selected.includes(value)) onChange(selected.filter(s => s !== value));
    else onChange([...selected, value]);
  };

  const baseClass = variant === 'categories'
    // ? 'h-24 w-40 rounded-lg border-2 border-gray-200 text-lg font-medium transition-colors'
    ? 'h-24 w-40 rounded-lg border-2 border-gray-200 text-lg font-medium transition-colors'
    : 'h-16 w-32 rounded-md border border-gray-300 text-base';

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {options.map(opt => (
        // <button
        //   key={opt}
        //   type="button"
        //   onClick={() => toggle(opt)}
        //   className={`${baseClass} ${
        //     selected.includes(opt)
        //       ? variant === 'categories' ? 'bg-yellow-100 border-2 border-yellow-300 text-brown-800 hover:bg-yellow-400' : 'h-8 w-64 bg-blue-200 text-blue-800 border-2 border-blue-400 hover:bg-blue-100'
        //       : variant === 'categories' ? ' text-black-800 border-2 border-yellow-300 hover:bg-yellow-100 border-2 border-brown-500 ' : ' h-8 w-64 bg-yellow-50 border-2 border-grey-400 text-black-800 hover:bg-blue-200'
        //   }`}
        // >
        //   {opt}
        // </button>


       <button
  key={opt}
  type="button"
  onClick={() => toggle(opt)}
  className={`${baseClass} flex items-center justify-center gap-2 ${
    selected.includes(opt)
      ? variant === "categories"
        ? "bg-yellow-100 border-2 border-yellow-300 text-brown-800 hover:bg-yellow-400"
        : "h-8 w-40  text-xs bg-blue-200 text-blue-800 border-2 border-blue-400 hover:bg-blue-100"
      : variant === "categories"
        ? "text-black-800 border-2 border-yellow-300 hover:bg-yellow-100 border-2 border-brown-500"
        : "h-8 w-40  text-xs bg-yellow-50 border-2 border-gray-200 text-black-800 hover:bg-blue-200"
  }`}
>
  {/* Show checkbox ONLY if variant !== categories */}
  {variant !== "categories" && (
    selected.includes(opt) ? (
      <span className="w-4 h-4 flex items-center justify-center rounded-sm border border-blue-500 bg-blue-500">
        <Check className="w-3 h-3 text-white" />
      </span>
    ) : (
      <span className="w-4 h-4 border border-gray-400 rounded-sm"></span>
    )
  )}

  {/* Label */}
  <span>{opt}</span>
</button>



      ))}
    </div>
  );
};
