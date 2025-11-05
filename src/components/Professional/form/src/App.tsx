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
import axios from "axios";
import { useUserAuth } from "../../../context/context";
function AppInner() {
  const {isLogin,user} = useUserAuth();
  const { current, next, prev, goTo } = useFormSteps(7); // 6 steps + summary
  const [steps, setSteps] = useState<any[]>([]);
  const [resumeData, setResumeData] = useState(null);
  const { data ,setData , updateField } = useForm(); //update field ive added for prefill
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [step1Valid, setStep1Valid] = useState(false); // ✅ Step1 validation state
    const [submissionId, setSubmissionId] = useState<string | null>(null); // ✅ Add state for submissionId

  // ---- NEW: get URL params ----
const { userId, professionalId } = useParams<{ userId?: string; professionalId?: string }>();


  // --- admin state ---
  const [adminOpen, setAdminOpen] = useState(false);
  const admin = true; // toggle this to show/hide admin panel

  const location = useLocation();
  const navigate = useNavigate();
  const templateIdFromState = location.state?.templateId;


  const [formLoader,setFormLoader]=useState(true)


useEffect(() => {
  const loadForm = async () => {
    try {
      // Always fetch form structure
      const formStructure = await fetchFormStructure();
      setSteps(formStructure.steps);
      setFormLoader(false)

      if (userId && professionalId) {
        setFormLoader(true)
        // setLoading(true);
        const res = await fetch(
          `https://ec1amurqr9.execute-api.ap-south-1.amazonaws.com/dev/${userId}/${professionalId}`
        );
        const userData = await res.json();
        setFormLoader(false)
        // ✅ NEW: Store the old submissionId (or draftId)
        if (userData.submissionId || userData.draftId) {
          localStorage.setItem(
            "oldSubmissionId",
            userData.submissionId || userData.draftId
          );
          // added
          setSubmissionId(userData.submissionId || userData.draftId);

        }

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

        // ✅ Extract templateSelection from prefill data
        if (userData.templateSelection) {
          updateField("templateSelection", userData.templateSelection);
          // Or setTemplateSelection(userData.templateSelection);
        }

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
  const email =isLogin ? user?.userData?.email : data.basicInfo?.email;

  try {
    // ✅ Use existing submissionId (if editing) or generate a new one (if creating)
    const finalSubmissionId = submissionId || `draft-${Date.now()}`;

    const payload = {
      userId: email,
      username: data.basicInfo.user_name || "dummyusername",
      submissionId: finalSubmissionId,  // ✅ Same used for draftId
      draftId: finalSubmissionId,       // ✅ Keep same value
      aiTriggeredAt: Date.now(),
      formData: data,
      mediaLinks: {},
      uploadedFiles: {},
      resumeData: resumeData || {},
      processingMethod: "separate_upload",
      status: "ai_processing",
      templateSelection:templateIdFromState || "",
      updatedAt: Date.now(),
      version: "2.4",
    };

    console.log("payload:", payload);

    let response;

    // ✅ If form is prefilled → update (PUT)
    if (userId && professionalId) {
      response = await axios.put(
        `https://tvlifa6840.execute-api.ap-south-1.amazonaws.com/prod/${userId}/${professionalId}`,
        payload
      );
      console.log("Update response:", response.data);
    } 
    // ✅ Otherwise → create new (POST)
    else {
      response = await submitForm(payload);
      console.log("Create response:", response);
    }

    setSuccess(true);
    
    // Clear localStorage draft after successful submission
    try {
      localStorage.removeItem("professionalFormDraft");
    } catch (e) {
      console.error("Failed to clear local draft after submit", e);
    }
    
    setTimeout(() => setLoading(false), 30000);

    setTimeout(() => {
      console.log("temps id",templateIdFromState);
      navigate(`/professional/edit/${finalSubmissionId}/${email}/template=${templateIdFromState}`);
      
    }, 30000);
  } catch (err) {
    console.error(err);
    setLoading(false);
    alert("Submission failed");
  }
};


  if(formLoader)return(
     <div className="fixed inset-0 bg-indigo-900 flex items-center justify-center z-50">
      <div className="text-center">
        {/* Loader */}
        <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        
        {/* Message */}
        <p className="text-blue-200 text-lg">
          Please wait while we load your form
        </p>
      </div>
    </div>
  )




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
