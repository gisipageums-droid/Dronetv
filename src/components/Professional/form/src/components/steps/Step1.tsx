// import { useForm } from "../../context/FormContext";
// import { MultiSelect } from "../common/MultiSelect";

// export const Step1 = ({ step }: { step: any }) => {
//   const { data, updateField } = useForm();

//   return (<>
//       {/* Step Title */}
//       <h2 className="text-2xl font-bold text-amber-900 border-b border-amber-300 pb-2 mb-4">
//         {step.title}
//       </h2>

//       {/* Categories on Top */}
//       {step.categories && (
//         <div className="mb-6">
//           <h3 className="text-lg font-semibold text-slate-900 mb-3">Professional Category</h3>
//           <p className="text-sm text-slate-600 mb-2">
//             Select your Professional's main business category (you can select multiple)
//           </p>
//           <div className="flex justify-center">
//             <MultiSelect
//               options={step.categories.available.map((c: any) => c.name)}
//               selected={data.categories}
//               onChange={vals => updateField('categories', vals)}
//               variant="categories"
//               />
//           </div>
//         </div>
//       )}

//           <div className="space-y-6 p-6 bg-yellow-50 rounded-xl shadow-md">
//       {/* Basic Info Fields */}
//       <div className="space-y-6">
//         {step.basicInfo?.fields.map((f: any) => (
//           <div key={f.id} className="flex flex-col">
//             <label className="mb-1 font-semibold text-slate-900">{f.label}</label>
//             <input
//               type={f.type}
//               required={f.required}
//               placeholder={f.placeholder || ""}
//               className="border border-amber-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition "
//               value={data.basicInfo[f.id] || ''}
//               onChange={e =>
//                 updateField('basicInfo', { ...data.basicInfo, [f.id]: e.target.value })
//               }
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//               </>
//   );
// };








// import { useState, useEffect } from "react";
// import { useForm } from "../../context/FormContext";
// import { MultiSelect } from "../common/MultiSelect";

// export const Step1 = ({ step }: { step: any }) => {
//   const { data, updateField } = useForm();

//   // Username availability state
//   const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
//   const [checking, setChecking] = useState(false);

//   // Check username availability when user types
//   useEffect(() => {
//     const username = data.basicInfo.user_name;
//     if (!username) {
//       setUsernameAvailable(null);
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
//             body: JSON.stringify({ username }),
//           }
//         );
//         const json = await res.json();
//         setUsernameAvailable(json.available);
//       } catch (err) {
//         console.error(err);
//         setUsernameAvailable(null);
//       } finally {
//         setChecking(false);
//       }
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [data.basicInfo.user_name]);

//   // Handle next step or form submission
//   const handleNext = () => {
//     if (usernameAvailable === false) {
//       alert("Please choose a different username. This one is taken.");
//       return;
//     }
//     // Continue your existing next step logic
//     step.next?.(); // if you have a next function
//   };

//   return (
//     <>
//       {/* Step Title */}
//       <h2 className="text-2xl font-bold text-amber-900 border-b border-amber-300 pb-2 mb-4">
//         {step.title}
//       </h2>

//       {/* Categories on Top */}
//       {step.categories && (
//         <div className="mb-6">
//           <h3 className="text-lg font-semibold text-slate-900 mb-3">Professional Category</h3>
//           <p className="text-sm text-slate-600 mb-2">
//             Select your Professional's main business category (you can select multiple)
//           </p>
//           <div className="flex justify-center">
//             <MultiSelect
//               options={step.categories.available.map((c: any) => c.name)}
//               selected={data.categories}
//               onChange={(vals) => updateField("categories", vals)}
//               variant="categories"
//             />
//           </div>
//         </div>
//       )}

//       <div className="space-y-6 p-6 bg-yellow-50 rounded-xl shadow-md">
//         {/* Basic Info Fields */}
//         <div className="space-y-6">
//           {step.basicInfo?.fields.map((f: any) => (
//             <div key={f.id} className="flex flex-col">
//               <label className="mb-1 font-semibold text-slate-900">{f.label}</label>
//               <input
//                 type={f.type}
//                 required={f.required}
//                 placeholder={f.placeholder || ""}
//                 className={`border rounded-lg p-3 focus:outline-none focus:ring-2 transition
//                   ${
//                     f.id === "user_name"
//                       ? usernameAvailable === false
//                         ? "border-red-500 focus:ring-red-300"
//                         : "border-amber-300 focus:ring-amber-400"
//                       : "border-amber-300 focus:ring-amber-400"
//                   }`}
//                 value={data.basicInfo[f.id] || ""}
//                 onChange={(e) =>
//                   updateField("basicInfo", { ...data.basicInfo, [f.id]: e.target.value })
//                 }
//               />
//               {/* Username availability feedback */}
//               {f.id === "user_name" && data.basicInfo.user_name && (
//                 <span className="text-sm mt-1">
//                   {checking
//                     ? "Checking availability..."
//                     : usernameAvailable === false
//                     ? "Username is taken"
//                     : usernameAvailable === true
//                     ? "Username is available"
//                     : ""}
//                 </span>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Next button */}
//       <div className="mt-6 flex justify-end">
//         <button
//           onClick={handleNext}
//           disabled={checking || usernameAvailable === false}
//           className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           Next
//         </button>
//       </div>
//     </>
//   );
// };









import { useState, useEffect } from "react";
import { useForm } from "../../context/FormContext";
import { MultiSelect } from "../common/MultiSelect";

export const Step1 = ({ step, setStepValid }: { step: any; setStepValid?: (valid: boolean) => void }) => {
  const { data, updateField } = useForm();

  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);

  // Check username availability when user types
  useEffect(() => {
    const username = data.basicInfo.user_name;
    if (!username) {
      setUsernameAvailable(null);
      setStepValid?.(true); // no username yet, allow next
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setChecking(true);
        const res = await fetch(
          "https://0x1psamlyh.execute-api.ap-south-1.amazonaws.com/dev/professional-username-check",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username }),
          }
        );
        const json = await res.json();
        setUsernameAvailable(json.available);
        setStepValid?.(json.available); // update validity for App.tsx button
      } catch (err) {
        console.error(err);
        setUsernameAvailable(null);
        setStepValid?.(true); // allow next if API fails
      } finally {
        setChecking(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [data.basicInfo.user_name, setStepValid]);

  return (
    <>
      <h2 className="text-2xl font-bold text-amber-900 border-b border-amber-300 pb-2 mb-4">
        {step.title}
      </h2>

      {step.categories && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-3">Professional Category</h3>
          <p className="text-sm text-slate-600 mb-2">
            Select your Professional's main business category (you can select multiple)
          </p>
          <div className="flex justify-center">
            <MultiSelect
              options={step.categories.available.map((c: any) => c.name)}
              selected={data.categories}
              onChange={(vals) => updateField("categories", vals)}
              variant="categories"
            />
          </div>
        </div>
      )}

      <div className="space-y-6 p-6 bg-yellow-50 rounded-xl shadow-md">
        <div className="space-y-6">
          {step.basicInfo?.fields.map((f: any) => (
            <div key={f.id} className="flex flex-col">
              <label className="mb-1 font-semibold text-slate-900">{f.label}</label>
              <input
                type={f.type}
                required={f.required}
                placeholder={f.placeholder || ""}
                className={`border rounded-lg p-3 focus:outline-none focus:ring-2 transition
                  ${
                    f.id === "user_name"
                      ? usernameAvailable === false
                        ? "border-red-500 focus:ring-red-300"
                        : "border-amber-300 focus:ring-amber-400"
                      : "border-amber-300 focus:ring-amber-400"
                  }`}
                value={data.basicInfo[f.id] || ""}
                onChange={(e) =>
                  updateField("basicInfo", { ...data.basicInfo, [f.id]: e.target.value })
                }
              />
              {f.id === "user_name" && data.basicInfo.user_name && (
                <span className="text-sm mt-1">
                  {checking
                    ? "Checking availability..."
                    : usernameAvailable === false
                    ? "Username is taken"
                    : usernameAvailable === true
                    ? "Username is available"
                    : ""}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
