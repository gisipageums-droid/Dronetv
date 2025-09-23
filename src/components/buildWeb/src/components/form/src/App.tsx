


import { useState, useEffect } from "react";
import { FormData } from "./types/form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Step1CompanyCategory from "./components/steps/Step1CompanyCategory";
import Step3SectorsServed from "./components/steps/Step3SectorsServed";
import Step4BusinessCategories from "./components/steps/Step4BusinessCategories";
import Step5ProductsServices from "./components/steps/Step5ProductsServices";
import Step7PromotionBilling from "./components/steps/Step7PromotionBilling";
import Step8MediaUploads from "./components/steps/Step8MediaUploads";
import { useTemplate } from "../../../../../context/context";

// ---- initial form state ----
const initialFormData: FormData = {
  companyCategory: [],
  companyName: "",
  yearEstablished: "",
  directorName: "",
  directorPhone: "",
  directorEmail: "",
  altContactName: "",
  altContactPhone: "",
  altContactEmail: "",
  websiteUrl: "",
  companyProfileLink: "",
  promoVideoFiveMinUrl: "",
  promoVideoOneMinUrl: "",
  officeAddress: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
  legalName: "",
  gstin: "",
  cinOrUdyamOrPan: "",
  supportEmail: "",
  whatsappLink: "",
  socialLinks: {
    linkedin: "",
    facebook: "",
    instagram: "",
    youtube: "",
    website: "",
  },
  operatingHours: "",
  promoCode: "",
  sectorsServed: [],
  sectorsOther: "",
  mainCategories: [],
  subCategories: [],
  subSubCategories: [],
  otherMainCategories: "",
  geographyOfOperations: [],
  coverageType: "",
  manufacturingSubcategories: [],
  manufOther: "",
  dgcaTypeCertificateUrl: "",
  serviceSubcategories: [],
  servicesOther: "",
  trainingTypes: [],
  trainingOther: "",
  rptoAuthorisationCertificateUrl: "",
  photoVideoSubcategories: [],
  photoVideoOther: "",
  softwareSubcategories: [],
  softwareOther: "",
  aiSolutions: [],
  aiSolutionsOther: "",
  aiProducts: [],
  aiProductsOther: "",
  aiServices: [],
  aiServicesOther: [],
  gnssSolutions: [],
  gnssSolutionsOther: [],
  gnssProducts: [],
  gnssProductsOther: [],
  gnssServices: [],
  gnssServicesOther: [],
  heroBackgroundUrl: "",
  primaryCtaText: "",
  primaryCtaLink: "",
  secondaryCtaText: "",
  secondaryCtaLink: "",
  aboutTitle: "",
  aboutImageUrl: "",
  aboutExperienceYears: 0,
  aboutTeamExperience: "",
  companyValuesSelection: [],
  servicesTitle: "",
  servicesDescription: "",
  services: [],
  productsTitle: "",
  productCategories: "",
  products: [],
  clientsTitle: "",
  clients: [],
  testimonials: [],
  contactTitle: "",
  contactEmail: "",
  contactPhone: "",
  addressLine: "",
  pinCode: "",
  mapEmbedUrl: "",
  contactFormText: "",
  submitButtonText: "",
  footerLogoUrl: "",
  footerDescriptionDraft: "",
  footerText: "",
  footerEmail: "",
  footerPhone: "",
  footerAddress: "",
  footerNavLinks: [],
  newsletterEnabled: false,
  newsletterDescription: "",
  promoFormats: [],
  billingContactName: "",
  billingContactEmail: "",
  billingGstDetails: "",
  billingAddress: "",
  paymentMethod: "",
  acceptTerms: false,
  acceptPrivacy: false,
  companyLogoUrl: "",
  brochurePdfUrl: "",
  cataloguePdfUrl: "",
  caseStudiesUrl: "",
  brandGuidelinesUrl: "",
  templateId: "",
};

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const { setAIGenData } = useTemplate();
  const [isApiLoading, setIsApiLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const templateId = location.state?.templateId || "";

  // Extract dynamic params from URL
  const params = useParams<{ publicId?: string; userId?: string; draftId?: string }>();
  const { publicId, userId, draftId } = params;

  const [companyNameStatus, setCompanyNameStatus] = useState<null | { available: boolean; suggestions?: string[]; message: string }>(null);
  const [isCheckingName, setIsCheckingName] = useState(false);

  // Fetch data if URL contains params
  useEffect(() => {
    const fetchDraftData = async () => {
      if (publicId && userId && draftId) {
        try {
          const API_URL = `https://l0jg1d9hnc.execute-api.ap-south-1.amazonaws.com/dev/${publicId}/${userId}/${draftId}`;
          const response = await fetch(API_URL);
          const data = await response.json();

          if (data?.formData) {
            console.log("Fetched formData:", data.formData);
            setFormData((prev) => ({ ...prev, ...data.formData }));
            setAIGenData(data);
          } else {
            console.error("API returned invalid data:", data);
          }
        } catch (error) {
          console.error("Error fetching draft data:", error);
        } finally {
          setIsApiLoading(false);
        }
      } else {
        // No params → open empty form
        setIsApiLoading(false);
      }
    };

    fetchDraftData();
  }, [publicId, userId, draftId, setAIGenData]);

  // Update form data locally
  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  // Submit logic
  const handleSubmit = async () => {
    if (userId && draftId) {
      try {
        const PUT_URL = `https://c2x3twl1q8.execute-api.ap-south-1.amazonaws.com/dev/${userId}/${draftId}`;
        const res = await fetch(PUT_URL, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ formData }),
        });

        if (!res.ok) throw new Error("Failed to save form");
        const result = await res.json();
        console.log("Form saved:", result);
        alert("Form saved successfully!");
      } catch (err) {
        console.error("Save error:", err);
        alert("Failed to save form!");
      }
    } else {
      alert("No draftId/userId found. Cannot save!");
    }
  };

  // Navigation
  const nextStep = () => {
    if (currentStep < 6) setCurrentStep(currentStep + 1);
  };
  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // Step rendering
  const renderStep = () => {
    const stepProps = {
      formData,
      updateFormData,
      onNext: nextStep,
      onPrev: prevStep,
      onStepClick: (step: number) => setCurrentStep(step),
      isValid: true,
      checkCompanyName,
      companyNameStatus,
      isCheckingName,
    };

    switch (currentStep) {
      case 1:
        return <Step1CompanyCategory {...stepProps} />;
      case 2:
        return <Step3SectorsServed {...stepProps} />;
      case 3:
        return <Step4BusinessCategories {...stepProps} />;
      case 4:
        return <Step5ProductsServices {...stepProps} />;
      case 5:
        return <Step7PromotionBilling {...stepProps} />;
      case 6:
        return (
          <Step8MediaUploads
            formData={formData}
            updateFormData={updateFormData}
            userId={userId || "dev@local"}
            draftId={draftId || "draft-local"}
            selectedTemplateId={templateId}
            onNext={nextStep}
            onPrev={prevStep}
            onSaveSuccess={handleSubmit}
            isValid={true}
          />
        );
      default:
        return <Step1CompanyCategory {...stepProps} />;
    }
  };

  // Check name API (unchanged)
  const checkCompanyName = async (name: string) => {
    if (!name || name.length < 2) {
      setCompanyNameStatus(null);
      return;
    }
    setIsCheckingName(true);
    try {
      const res = await fetch(
        `https://14exr8c8g0.execute-api.ap-south-1.amazonaws.com/prod/drafts/check-name?name=${encodeURIComponent(
          name
        )}`
      );
      const data = await res.json();
      setCompanyNameStatus(data);
    } catch {
      setCompanyNameStatus({ available: false, message: "Error checking name" });
    } finally {
      setIsCheckingName(false);
    }
  };

  if (isApiLoading) {
    return (
      <div className="fixed inset-0 bg-indigo-900 flex items-center justify-center z-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Loading form data...</h1>
          <p className="text-blue-200 text-lg">Please wait while we prefill your form</p>
        </div>
      </div>
    );
  }

  return <div>{renderStep()}</div>;
}

export default App;
