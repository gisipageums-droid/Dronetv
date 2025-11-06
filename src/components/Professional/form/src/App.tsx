import { useEffect, useState } from "react";
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
import { AlertTriangle, X } from "lucide-react";
import { toast } from "sonner";

// ✅ Token Validation API URL
const TOKEN_VALIDATION_API_URL =
  "https://zhjkyvzz15.execute-api.ap-south-1.amazonaws.com/dev/";

// ================== Token validation function ====================
const validateUserTokens = async (
  email: string
): Promise<{
  message: string;
  success: boolean;
  tokenBalance: number;
  userExists: boolean;
}> => {
  try {
    const response = await axios.post(
      TOKEN_VALIDATION_API_URL,
      { email },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    // faild case
    if (
      response.data?.tokenBalance < 100 ||
      (response.data?.success === false && response.data?.userExists)
    ) {
      return {
        success: false,
        tokenBalance: response.data.tokenBalance,
        message:
          response.data.message ||
          "Insufficient tokens to create a template. Please purchase more tokens.",
        userExists: true,
      };
    }

    // success case
    return {
      success: true,
      tokenBalance: response.data.tokenBalance,
      message: response.data.message || "Token validation successful",
      userExists: response.data?.userExists,
    };
  } catch (error: unknown) {
    console.error("Token validation error:", error);
    return {
      message: "Token validation error",
      success: false,
      tokenBalance: 0,
      userExists: false,
    };
  }
};

// ================== Token Modal Component ========================
const TokenValidationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  message: string;
  onPurchaseTokens?: () => void;
  totalToken: number;
}> = ({ isOpen, onClose, message, onPurchaseTokens, totalToken }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <AlertTriangle className="w-6 h-6 text-yellow-500 mr-2" />
            <h3 className="text-lg font-semibold text-slate-900">
              Insufficient Tokens
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-slate-700 mb-4">{message}</p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-700">
              {`Each website generation requires 100 tokens but you have ${totalToken}. You can purchase more
              tokens to continue.`}
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>

          {onPurchaseTokens && (
            <button
              onClick={onPurchaseTokens}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Purchase Tokens
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

function AppInner() {
  const { isLogin, user } = useUserAuth();
  const { current, next, prev, goTo } = useFormSteps(7); // 6 steps + summary
  const [steps, setSteps] = useState<any[]>([]);
  const [resumeData, setResumeData] = useState(null);
  const { data, setData, updateField } = useForm(); //update field ive added for prefill
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [step1Valid, setStep1Valid] = useState(false); // ✅ Step1 validation state
  const [submissionId, setSubmissionId] = useState<string | null>(null); // ✅ Add state for submissionId
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [tokenValidation, setTokenValidation] = useState<{
    message: string;
    totalToken: number;
  }>();

  // ---- NEW: get URL params ----
  const { userId, professionalId } = useParams<{
    userId?: string;
    professionalId?: string;
  }>();

  // --- admin state ---
  const [adminOpen, setAdminOpen] = useState(false);
  const admin = true; // toggle this to show/hide admin panel

  const location = useLocation();
  const navigate = useNavigate();
  const templateIdFromState = location.state?.templateId;

  const [formLoader, setFormLoader] = useState(true);

  useEffect(() => {
    const loadForm = async () => {
      try {
        // Always fetch form structure
        const formStructure = await fetchFormStructure();
        setSteps(formStructure.steps);
        setFormLoader(false);

        if (userId && professionalId) {
          setFormLoader(true);
          // setLoading(true);
          const res = await fetch(
            `https://ec1amurqr9.execute-api.ap-south-1.amazonaws.com/dev/${userId}/${professionalId}`
          );
          const userData = await res.json();
          setFormLoader(false);
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

  // ================== Token validation before submission =================
  const validateBeforeSubmit = async (): Promise<boolean> => {
    const userEmail = isLogin ? user?.userData?.email : data.basicInfo?.email;

    try {
      const tokenResult = await validateUserTokens(userEmail);

      if (!tokenResult.success || tokenResult.tokenBalance < 100) {
        setTokenValidation({
          message: tokenResult.message,
          totalToken: tokenResult.tokenBalance,
        });
        setShowTokenModal(true);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Token validation failed:", error);
      toast.warning(
        "Token validation service is temporarily unavailable. Proceeding with submission..."
      );
      return true;
    }
  };

  const handlePurchaseTokens = () => {
    setShowTokenModal(false);
    // Redirect to token purchase page - update the URL as needed
    window.open("/pricing", "_blank");
  };

  const handleSubmit = async () => {
    // First validate tokens
    const canProceed = await validateBeforeSubmit();
    if (!canProceed) {
      return;
    }

    setLoading(true);
    setSuccess(false);
    const email = isLogin ? user?.userData?.email : data.basicInfo?.email;

    try {
      // ✅ Use existing submissionId (if editing) or generate a new one (if creating)
      const finalSubmissionId = submissionId || `draft-${Date.now()}`;

      const payload = {
        userId: email,
        username: data.basicInfo.user_name || "dummyusername",
        submissionId: finalSubmissionId, // ✅ Same used for draftId
        draftId: finalSubmissionId, // ✅ Keep same value
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
        console.log("temps id", templateIdFromState);
        navigate(
          `/professional/edit/${finalSubmissionId}/${email}/template=${templateIdFromState}`
        );
      }, 30000);
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Submission failed");
    }
  };

  if (formLoader)
    return (
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
    );

  if (!steps.length) return <div>Loading...</div>;

  const StepComponent = [Step1, Step2, Step3, Step4, Step5, Step6, Summary][
    current
  ];
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
            <p className="text-sm text-gray-800">
              AI-Powered Website Generator
            </p>
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
                  <span className="text-[10px]">
                    {s.title || `Step ${index + 1}`}
                  </span>
                </button>
                {index < 4 && (
                  <span className="mx-2 text-gray-500 font-bold select-none">
                    -
                  </span>
                )}
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
        <div className="bg-white border-2 border-yellow-300 shadow-md rounded-xl p-6">
          {current === 0 ? (
            <Step1 step={stepData} setStepValid={setStep1Valid} />
          ) : current === 5 ? (
            <Step6
              step={stepData}
              allSteps={steps}
              onSubmit={(data) => setResumeData(data)}
            />
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

        {/* Token Validation Modal */}
        <TokenValidationModal
          isOpen={showTokenModal}
          onClose={() => setShowTokenModal(false)}
          message={tokenValidation?.message || "Token validation error"}
          onPurchaseTokens={handlePurchaseTokens}
          totalToken={tokenValidation?.totalToken || 0}
        />
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