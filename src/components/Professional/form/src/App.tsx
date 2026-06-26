import React, { useEffect, useState } from "react";
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
import { EVENTS_API, PROFESSIONAL_API, LAMBDA } from '../../../../lib/apiConfig';

// ✅ Token Validation API URL
const TOKEN_VALIDATION_API_URL =
  EVENTS_API ? `${EVENTS_API}/` : `${LAMBDA.eventsFormBase}/`;

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
  const { isLogin, user, isAdminLogin } = useUserAuth();
  const { current, next, prev } = useFormSteps(7); // 6 steps + summary
  const [steps, setSteps] = useState<any[]>([]);
  const [resumeData, setResumeData] = useState(null);
  const { data, setData, updateField } = useForm(); //update field ive added for prefill
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [step1Valid, setStep1Valid] = useState(false);
  const [showStep1Error, setShowStep1Error] = useState(false);
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

  const location = useLocation();
  const navigate = useNavigate();
  const templateIdFromState = location.state?.templateId;
  const [formLoader, setFormLoader] = useState(true);

  useEffect(() => {
    if (
      templateIdFromState &&
      !data.templateSelection &&
      !userId &&
      !professionalId
    ) {
      updateField("templateSelection", templateIdFromState);
    }
  }, [
    templateIdFromState,
    data.templateSelection,
    userId,
    professionalId,
    updateField,
  ]);

  useEffect(() => {
    const loadForm = async () => {
      try {
        const formStructure = await fetchFormStructure();
        setSteps(formStructure.steps);
        setFormLoader(false);

        if (userId && professionalId) {
          setFormLoader(true);

          const res = await fetch(
            PROFESSIONAL_API ? `${PROFESSIONAL_API}/${userId}/${professionalId}` : `${LAMBDA.profFormLoad}/${userId}/${professionalId}`
          );
          const userData = await res.json();
          setFormLoader(false);

          if (userData.submissionId || userData.draftId) {
            localStorage.setItem(
              "oldSubmissionId",
              userData.submissionId || userData.draftId
            );
            setSubmissionId(userData.submissionId || userData.draftId);
          }

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

          setResumeData(userData.resumeData || null);

          if (userData.templateSelection) {
            updateField("templateSelection", userData.templateSelection);
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


  // ================== Token validation before submission =================
  const validateBeforeSubmit = async (): Promise<boolean> => {
    const userEmail = isLogin ? (user?.email || user?.userData?.email) : (data.addressInformation?.email || data.basicInfo?.email);

    try {
      if (isAdminLogin) {
        return true;
      }
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
    window.open("/user-buy", "_blank");
  };

  const handleNextWithValidation = () => {
    if (current === 0 && !step1Valid) {
      setShowStep1Error(true);
      return;
    }
    setShowStep1Error(false);
    next();
  };

  const handleSubmit = async () => {
    const canProceed = await validateBeforeSubmit();
    if (!canProceed) {
      return;
    }

    setLoading(true);
    setSuccess(false);
    const email = isLogin ? user?.userData?.email : (data.addressInformation?.email || data.basicInfo?.email);

    try {
      const finalSubmissionId = submissionId || `draft-${Date.now()}`;
      const templateId = data.templateSelection || templateIdFromState || 1;

      const payload = {
        userId: email,
        username: data.basicInfo.user_name || "dummyusername",
        submissionId: finalSubmissionId,
        draftId: finalSubmissionId,
        aiTriggeredAt: Date.now(),
        formData: data,
        mediaLinks: {},
        uploadedFiles: {},
        resumeData: resumeData || {},
        processingMethod: "separate_upload",
        status: "ai_processing",
        templateSelection: templateId || "",
        updatedAt: Date.now(),
        version: "2.4",
      };

      let response;

      if (userId && professionalId) {
        response = await axios.put(
          PROFESSIONAL_API ? `${PROFESSIONAL_API}/${userId}/${professionalId}` : `${LAMBDA.profUpdate}/${userId}/${professionalId}`,
          payload
        );
      } else {
        response = await submitForm(payload);
      }

      setSuccess(true);
      try {
        localStorage.removeItem("professionalFormDraft");
      } catch (e) {
        console.error("Failed to clear local draft after submit", e);
      }

      setTimeout(() => setLoading(false), 71000);
      setTimeout(
        () =>
          navigate(
            `/professional/edit/${finalSubmissionId}/${email}/template=${templateId}`
          ),
        71000
      );
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
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>

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
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="flex items-center justify-center w-9 h-9 rounded-full bg-black/10 hover:bg-black/20 transition-colors"
              aria-label="Go to home page"
              title="Back to Home"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </a>
            <div>
              <h1 className="text-xl font-bold text-black">DroneTV</h1>
              <p className="text-sm text-gray-800">AI-Powered Website Generator</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-700">Drone • AI • GIS</p>
            <p className="text-xs text-gray-600">One form, instant website</p>
          </div>
        </div>
      </div>

      {loading && <Loader />}

      <div className="bg-yellow-100 w-full pt-3 pb-2">
        <div className="bg-yellow-100 max-w-4xl mx-auto px-4">
          {/* --- Stepper --- */}
          <div className="flex items-center justify-between mb-3">
            {steps.slice(0, 6).map((s: any, index: number) => (
              <React.Fragment key={s.id}>
                <div className="flex flex-col items-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 flex-shrink-0 ${
                    index < current
                      ? "bg-amber-400 border-amber-400 text-white"
                      : index === current
                      ? "bg-black border-black text-yellow-300"
                      : "bg-white border-gray-300 text-gray-400"
                  }`}>
                    {index < current ? (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className={`text-[9px] mt-0.5 text-center leading-tight w-12 truncate ${
                    index === current ? "font-semibold text-black" : "text-gray-400"
                  }`}>
                    {s.title?.split(' ')[0] || `Step ${index + 1}`}
                  </span>
                </div>
                {index < 5 && (
                  <div className={`flex-1 h-0.5 mx-1 mb-4 ${index < current ? "bg-amber-400" : "bg-gray-300"}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* --- Progress Bar --- */}
          {current < 6 && (
            <div className="w-full mb-2">
              <div className="flex justify-end mb-0.5 text-xs font-semibold text-gray-600">
                {progress}% complete
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-amber-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-4 space-y-4 relative">
        {/* --- Admin Button --- */}
        {isAdminLogin && current < 5 && (
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
            <Step1 step={stepData} setStepValid={setStep1Valid} showErrors={showStep1Error} />
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
          {current > 0 ? (
            <button
              onClick={prev}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {current < 6 ? (
            <button
              onClick={handleNextWithValidation}
              className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded"
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
