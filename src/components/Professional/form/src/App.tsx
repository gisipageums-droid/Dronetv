// import { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { fetchFormStructure, submitForm } from "./api/formApi";
// import { Step1 } from "./components/steps/Step1";
// import { Step2 } from "./components/steps/Step2";
// import { Step3 } from "./components/steps/Step3";
// import { Step4 } from "./components/steps/Step4";
// import { Step5 } from "./components/steps/Step5";
// import Step6 from "./components/steps/step6"
// import { Summary } from "./components/steps/Summary";
// import { FormProvider, useForm } from "./context/FormContext";
// import { useFormSteps } from "./hooks/useFormSteps";
// import { Loader } from "./components/Loader";
// import { AdminEditor } from "./admin/AdminEditor";

// // --- Loader Component ---
// // const Loader = ({ message }: { message: string }) => (
// //   <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
// //     <div className="bg-white rounded-lg p-6 flex flex-col items-center shadow-lg space-y-4">
// //       <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
// //       <span className="text-gray-700 font-medium">{message}</span>
// //     </div>
// //   </div>
// // );

// function AppInner() {
//   // const { data, resetForm } = useForm();
//   // const { current, next, prev, goTo } = useFormSteps(6); // 5 steps + summary
//   const { current, next, prev, goTo } = useFormSteps(7); // 6 steps + summary

//   const [steps, setSteps] = useState<any[]>([]);

//   const [resumeData, setResumeData] = useState(null);



//   const { data } = useForm();
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);
//   // --- admin state ---
//   const [adminOpen, setAdminOpen] = useState(false);
//   const admin = true; // toggle this to show/hide admin panel
//   // const admin = false; // toggle this to show/hide admin panel



//   // enable this for template fetching
//     const location = useLocation();
//     const navigate = useNavigate()
//   const templateIdFromState = location.state?.templateId; 
//   // console.log("Template ID from state:", templateIdFromState);




//   useEffect(() => {
//     fetchFormStructure().then((res) => setSteps(res.steps));
//   }, []);

//   const draftId= `draft-${Date.now()}`
//   const handleSubmit = async () => {
//     // window.location.href ="/professional/Greeting"
//     setLoading(true);
//     setSuccess(false);


//     const email = data.basicInfo?.email || "unknown@example.com";


//     try {
//       const payload = {
//         userId: email,
//         submissionId: `draft-${Date.now()}`,
//         draftId: draftId,
//         aiTriggeredAt: Date.now(),
//         formData: data,       // plain JS object, not DynamoDB format
//         mediaLinks: {},       // keep empty objects if nothing yet
//         uploadedFiles: {},
//           resumeData: resumeData || {},
//         processingMethod: "separate_upload",
//         status: "ai_processing",
//         templateSelection: templateIdFromState||"",
//         updatedAt: Date.now(),
//         version: "2.4",
//       };

//       const tempRes= await submitForm(payload);  // plain JSON
//       console.log(tempRes);
      

//       setSuccess(true);
//       setTimeout(() => setLoading(false), 30000);
//       setTimeout(() => {

//         // window.location.href = `/professional/edit/${draftId}/${email}/template=${templateIdFromState}`; 
//         navigate(`/professional/edit/${draftId}/${email}/template=${templateIdFromState}`)
//       }, 30000);
//     } catch (err) {
//       console.error(err);
//       setLoading(false);
//       alert("Submission failed");
//     }
//   };



//   if (!steps.length) return <div>Loading...</div>;

//   const StepComponent = [Step1, Step2, Step3, Step4, Step5, Step6, Summary][current];
//   const stepData = steps[current] || {};

//   // Progress percentage for first 5 steps
//   const progress = current < 6 ? Math.round((current / 5) * 100) : 0;

//   return (
//     <>
//       {/* Header */}
//       <div className="bg-gradient-to-r from-yellow-400 to-amber-400 shadow-lg border-b border-amber-300">
//         <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
//           <div>
//             <h1 className="text-xl font-bold text-black">DroneTV</h1>
//             <p className="text-sm text-gray-800">AI-Powered Website Generator</p>
//           </div>
//           <div className="text-right">
//             <p className="text-xs text-gray-700">Drone • AI • GIS</p>
//             <p className="text-xs text-gray-600">One form, instant website</p>
//           </div>
//         </div>
//       </div>
//       {/* <div className="bg-yellow-100"> */}
//       {/* <div className="max-w-4xl mx-auto p-6 space-y-6 relative"> */}

//        {/* {loading && <Loader message={success ? "Created Successfully!" : "Submitting..."} />}  */}
//        {loading &&
//         <Loader />}
     
//       {/* <Loader onComplete={() => setLoading(false)}  /> */}


//       <div className="bg-yellow-100 w-full py-4 ">
//         <div className="bg-yellow-100 max-w-4xl mx-auto  ">



//           {/* --- Step Navigation Chips --- */}
//           <div className="flex flex-wrap items-center gap-2 mb-4 justify-center">
//             {steps.slice(0, 6).map((s: any, index: number) => (
//               <div key={s.id} className="flex items-center">
//                 {/* Step Button */}
//                 <button
//                   onClick={() => goTo(index)}
//                   className={`flex items-center gap-2 px-3 py-1 rounded-md text-xs font-medium transition-colors ${index === current
//                       ? "bg-black text-yellow-200 shadow"
//                       : index < current
//                         ? "bg-yellow-200 text-black hover:bg-black-300"
//                         : "bg-yellow-100 text-gray-600 hover:bg-yellow-300"
//                     }`}
//                 >
//                   {/* Number Circle */}
//                   <div
//                     className={`w-4 h-4 flex items-center justify-center rounded-full text-[10px] font-bold ${index === current
//                         ? "bg-yellow-400 text-black"
//                         : index < current
//                           ? "bg-yellow-400 text-white"
//                           : "bg-gray-300 text-black"
//                       }`}
//                   >
//                     {index + 1}
//                   </div>

//                   {/* Step title */}
//                   <span className="text-[10px]">{s.title || `Step ${index + 1}`}</span>
//                 </button>

//                 {/* Separator */}
//                 {index < 4 && (
//                   <span className="mx-2 text-gray-500 font-bold select-none">-</span>
//                 )}
//               </div>
//             ))}
//           </div>


//           {/* --- Progress Percentage and Bar (hidden on summary) --- */}
//           {current < 6 && (
//             <div className="w-full mb-6">
//               <div className="flex justify-end mb-1 text-sm font-semibold text-gray-700">
//                 {progress}% complete
//               </div>
//               <div className="w-full bg-gray-200 rounded-lg h-4">
//                 <div
//                   className="bg-yellow-400 h-4 rounded-lg transition-all duration-300"
//                   style={{ width: `${progress}%` }}
//                 ></div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>



//       {/* added */}
//       <div className="max-w-4xl mx-auto p-6 space-y-6 relative">

//         {/* --- Admin Button (only if admin flag true) --- */}
//          {admin && current < 5 && (
//           <div className="flex justify-end -mt-2">
//             <button
//               onClick={() => setAdminOpen(true)}
//               className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded"
//             >
//               Open Admin Panel
//             </button>
//           </div>
//         )} 

//         {/* --- Step Content Container --- */}
//         <div className="bg-white border-2  border-yellow-300 shadow-md rounded-xl p-6 border border-gray-200">
//           {/* <StepComponent step={stepData} allSteps={steps} /> */}




//           {current === 5 ? (   // Step6 is index 5 (0-based)
//   <Step6 step={stepData} allSteps={steps} onSubmit={(data) => setResumeData(data)} />
// ) : (
//   <StepComponent step={stepData} allSteps={steps} />
// )}





//         </div>

//         {/* --- Navigation Buttons ---
//         {current < 6 && (
//           <div className="flex justify-between mt-6">
//             <button
//               onClick={prev}
//               disabled={current === 0}
//               className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
//             >
//               Back
//             </button>
//             {current < 6 ? (
//               <button
//                 onClick={next}
//                 className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded"
//               >
//                 Next
//               </button>
//             ) : (
//               <button
//                 onClick={handleSubmit}
//                 className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded"
//               >
//                 Submit
//               </button>
//             )}
//           </div>
//         )} */}

// {/* --- Navigation Buttons --- */}
// <div className="flex justify-between mt-6">
//   <button
//     onClick={prev}
//     disabled={current === 0}
//     className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
//   >
//     Back
//   </button>

//   {current < 6 ? (
//     <button
//       onClick={next}
//       className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded"
//     >
//       Next
//     </button>
//   ) : (
//     <button
//       onClick={handleSubmit}
//       className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded"
//     >
//       Submit
//     </button>
//   )}
// </div>


//         {/* --- Admin Editor Overlay --- */}
//         <AdminEditor isOpen={adminOpen} onClose={() => setAdminOpen(false)} />
//       </div>
//     </>
//   );
// }

// export default function App() {
//   return (
//     <FormProvider>
//       <AppInner />
//     </FormProvider>
//   );
// }




import { useEffect, useState  } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { fetchFormStructure, submitForm } from "./api/formApi";
import { Step1 } from "./components/steps/Step1";
import { Step2 } from "./components/steps/Step2";
import { Step3 } from "./components/steps/Step3";
import { Step4 } from "./components/steps/Step4";
import { Step5 } from "./components/steps/Step5";
import Step6 from "./components/steps/step6";
import { Summary } from "./components/steps/Summary";
import { FormProvider, useForm } from "./context/FormContext";
import { useFormSteps } from "./hooks/useFormSteps";
import { Loader } from "./components/Loader";
import { AdminEditor } from "./admin/AdminEditor";

function AppInner() {
  const { current, next, prev, goTo } = useFormSteps(7); // 6 steps + summary
  const [steps, setSteps] = useState<any[]>([]);
  const [resumeData, setResumeData] = useState(null);
  const { data ,setData } = useForm();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [step1Valid, setStep1Valid] = useState(false); // ✅ Step1 validation state

  // ---- NEW: get URL params ----
const { userId, professionalId } = useParams<{ userId?: string; professionalId?: string }>();


  // --- admin state ---
  const [adminOpen, setAdminOpen] = useState(false);
  const admin = true; // toggle this to show/hide admin panel

  const location = useLocation();
  const navigate = useNavigate();
  const templateIdFromState = location.state?.templateId;


//   const [templateSelection, setTemplateSelection] = useState<number | string>(
//   location.state?.templateId || ""
// );


  // useEffect(() => {
  //   fetchFormStructure().then((res) => setSteps(res.steps));
  // }, []);



// useEffect(() => {
//   const loadForm = async () => {
//     try {
//       // fetch steps for all cases
//       const formStructure = await fetchFormStructure();
//       setSteps(formStructure.steps);

//       if (userId && professionalId) {
//         // fetch user-specific data
//         setLoading(true);
//         const res = await fetch(
//           `https://ec1amurqr9.execute-api.ap-south-1.amazonaws.com/dev/${userId}/${professionalId}`
//         );
//         const userData = await res.json();

//         if (userData.formData) {
//           const parsedFormData: any = {};
//           Object.keys(userData.formData).forEach((key) => {
//             try {
//               parsedFormData[key] = JSON.parse(userData.formData[key]);
//             } catch {
//               parsedFormData[key] = userData.formData[key];
//             }
//           });
//           setData(parsedFormData);
//         }

//         setResumeData(userData.resumeData || null);
//         setLoading(false);
//       }
//     } catch (err) {
//       console.error("Failed to load form data:", err);
//       setLoading(false);
//     }
//   };

//   loadForm();
// }, [userId, professionalId, setData]);







useEffect(() => {
  const loadForm = async () => {
    try {
      // Always fetch form structure
      const formStructure = await fetchFormStructure();
      setSteps(formStructure.steps);

      if (userId && professionalId) {
        setLoading(true);
        const res = await fetch(
          `https://ec1amurqr9.execute-api.ap-south-1.amazonaws.com/dev/${userId}/${professionalId}`
        );
        const userData = await res.json();

        // parse formData strings
        if (userData.formData) {
          const parsedFormData: any = {};
          Object.keys(userData.formData).forEach((key) => {
            try {
              parsedFormData[key] = JSON.parse(userData.formData[key]);
            } catch {
              parsedFormData[key] = userData.formData[key];
            }
          });
          setData(parsedFormData);
        }

        // Prefill resume data if any
        setResumeData(userData.resumeData || null);

        // Prefill templateSelection from API
        // if (userData.templateSelection) {
        //   setTemplateSelection(userData.templateSelection);
        // }

        setLoading(false);
      }
    } catch (err) {
      console.error("Failed to load form data:", err);
      setLoading(false);
    }
  };

  loadForm();
}, [userId, professionalId, setData]);



  const draftId = `draft-${Date.now()}`;
  const handleSubmit = async () => {
    setLoading(true);
    setSuccess(false);
    const email = data.basicInfo?.email || "unknown@example.com";

    try {
      const payload = {

        userId: email,
        username: data.basicInfo.user_name || "dummyusername",
        submissionId: `draft-${Date.now()}`,
        draftId: draftId,
        aiTriggeredAt: Date.now(),
        formData: data,
        mediaLinks: {},
        uploadedFiles: {},
        resumeData: resumeData || {},

        processingMethod: "separate_upload",
        status: "ai_processing",
        templateSelection: templateIdFromState || "",
        updatedAt: Date.now(),
        version: "2.4",
      };
      console.log("payload", payload)

      const tempRes = await submitForm(payload);
      console.log(tempRes);

      setSuccess(true);
      setTimeout(() => setLoading(false), 30000);
      setTimeout(() => {
        navigate(`/professional/edit/${draftId}/${email}/template=${templateIdFromState}`);
      }, 30000);
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Submission failed");
    }
  };

  if (!steps.length) return <div>Loading...</div>;

  const StepComponent = [Step1, Step2, Step3, Step4, Step5, Step6, Summary][current];
  const stepData = steps[current] || {};

  // Progress percentage for first 5 steps
  const progress = current < 6 ? Math.round((current / 5) * 100) : 0;

  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400 to-amber-400 shadow-lg border-b border-amber-300">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-black">DroneTV</h1>
            <p className="text-sm text-gray-800">AI-Powered Website Generator</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-700">Drone • AI • GIS</p>
            <p className="text-xs text-gray-600">One form, instant website</p>
          </div>
        </div>
      </div>

      {loading && <Loader />}

      <div className="bg-yellow-100 w-full py-4 ">
        <div className="bg-yellow-100 max-w-4xl mx-auto">
          {/* --- Step Navigation Chips --- */}
          <div className="flex flex-wrap items-center gap-2 mb-4 justify-center">
            {steps.slice(0, 6).map((s: any, index: number) => (
              <div key={s.id} className="flex items-center">
                <button
                  onClick={() => goTo(index)}
                  className={`flex items-center gap-2 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    index === current
                      ? "bg-black text-yellow-200 shadow"
                      : index < current
                      ? "bg-yellow-200 text-black hover:bg-black-300"
                      : "bg-yellow-100 text-gray-600 hover:bg-yellow-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 flex items-center justify-center rounded-full text-[10px] font-bold ${
                      index === current
                        ? "bg-yellow-400 text-black"
                        : index < current
                        ? "bg-yellow-400 text-white"
                        : "bg-gray-300 text-black"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="text-[10px]">{s.title || `Step ${index + 1}`}</span>
                </button>
                {index < 4 && <span className="mx-2 text-gray-500 font-bold select-none">-</span>}
              </div>
            ))}
          </div>

          {/* --- Progress Percentage and Bar --- */}
          {current < 6 && (
            <div className="w-full mb-6">
              <div className="flex justify-end mb-1 text-sm font-semibold text-gray-700">
                {progress}% complete
              </div>
              <div className="w-full bg-gray-200 rounded-lg h-4">
                <div
                  className="bg-yellow-400 h-4 rounded-lg transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6 relative">
        {/* --- Admin Button --- */}
        {admin && current < 5 && (
          <div className="flex justify-end -mt-2">
            <button
              onClick={() => setAdminOpen(true)}
              className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded"
            >
              Open Admin Panel
            </button>
          </div>
        )}

        {/* --- Step Content Container --- */}
        <div className="bg-white border-2 border-yellow-300 shadow-md rounded-xl p-6 border border-gray-200">
          {current === 0 ? (
            <Step1 step={stepData} setStepValid={setStep1Valid} />
          ) : current === 5 ? (
            <Step6 step={stepData} allSteps={steps} onSubmit={(data) => setResumeData(data)} />
          ) : (
            <StepComponent step={stepData} allSteps={steps} />
          )}
        </div>

        {/* --- Navigation Buttons --- */}
        <div className="flex justify-between mt-6">
          <button
            onClick={prev}
            disabled={current === 0}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
          >
            Back
          </button>

          {current < 6 ? (
            <button
              onClick={next}
              disabled={current === 0 && !step1Valid} // ✅ disable Next only on Step1 if invalid
              className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded disabled:opacity-50"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded"
            >
              Submit
            </button>
          )}
        </div>

        {/* --- Admin Editor Overlay --- */}
        <AdminEditor isOpen={adminOpen} onClose={() => setAdminOpen(false)} />
      </div>
    </>
  );
}

export default function App() {
  return (
    <FormProvider>
      <AppInner />
    </FormProvider>
  );
}
