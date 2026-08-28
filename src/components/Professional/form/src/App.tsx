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
import { toast } from "sonner";
import { PROFESSIONAL_API, LAMBDA } from '../../../../lib/apiConfig';

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
        setFormLoader(false);
      }
    };

    loadForm();
  }, [userId, professionalId, setData]);


  const handleNextWithValidation = () => {
    if (current === 0 && !step1Valid) {
      setShowStep1Error(true);
      // Required-field errors render inline next to each field, which can be
      // far above wherever the user is scrolled to (e.g. Social Media Links
      // at the bottom) — without this, clicking Next looked like a no-op.
      toast.error("Please fill in all required fields marked above.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setShowStep1Error(false);
    next();
  };

  const handleSubmit = async () => {
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
      <div className="fixed inset-0 bg-status-info flex items-center justify-center z-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-status-info border-t-transparent rounded-full animate-spin"></div>

          <p className="text-white text-lg">
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
      <div className="bg-gradient-to-r from-brand-yellow to-brand-yellow shadow-lg border-b border-brand-yellow-soft">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-ink/10 hover:bg-ink-charcoal/20 transition-colors"
              aria-label="Go back"
              title="Back"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold text-ink">DroneTV</h1>
              <p className="text-sm text-ink-charcoal">AI-Powered Website Generator</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-ink-paragraph">Drone • AI • GIS</p>
            <p className="text-xs text-ink-paragraph">One form, instant website</p>
          </div>
        </div>
      </div>

      {loading && <Loader />}

      <div className="bg-brand-yellow-soft w-full pt-3 pb-2">
        <div className="bg-brand-yellow-soft max-w-4xl mx-auto px-4">
          {/* --- Stepper --- */}
          <div className="flex items-center justify-between mb-3">
            {steps.slice(0, 6).map((s: any, index: number) => (
              <React.Fragment key={s.id}>
                <div className="flex flex-col items-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 flex-shrink-0 ${
                    index < current
                      ? "bg-brand-yellow border-brand-yellow text-ink"
                      : index === current
                      ? "bg-ink border-ink text-brand-yellow-soft"
                      : "bg-surface-card border-ink-light text-ink-caption"
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
                    index === current ? "font-semibold text-ink" : "text-ink-caption"
                  }`}>
                    {s.title?.split(' ')[0] || `Step ${index + 1}`}
                  </span>
                </div>
                {index < 5 && (
                  <div className={`flex-1 h-0.5 mx-1 mb-4 ${index < current ? "bg-brand-yellow" : "bg-ink-light"}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* --- Progress Bar --- */}
          {current < 6 && (
            <div className="w-full mb-2">
              <div className="flex justify-end mb-0.5 text-xs font-semibold text-ink-paragraph">
                {progress}% complete
              </div>
              <div className="w-full bg-ink-light rounded-full h-2">
                <div
                  className="bg-brand-yellow h-2 rounded-full transition-all duration-300"
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
              className="px-4 py-2 bg-brand-yellow hover:bg-brand-gold text-ink font-medium rounded"
            >
              Open Admin Panel
            </button>
          </div>
        )}

        {/* --- Step Content Container --- */}
        <div key={current} className="bg-surface-card border-2 border-brand-yellow-soft shadow-md rounded-xl p-6 animate-step-slide-up">
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
              className="px-4 py-2 bg-ink-light hover:bg-ink-light rounded"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {current < 6 ? (
            <button
              onClick={handleNextWithValidation}
              className="px-4 py-2 bg-brand-yellow hover:bg-brand-gold text-ink font-medium rounded"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-status-success hover:bg-status-success text-white font-medium rounded"
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
