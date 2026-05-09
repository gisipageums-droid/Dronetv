import { useState } from "react";
import { FormData } from "./types/form";
import { useLocation,useNavigate } from "react-router-dom";
import Step1CompanyCategory from "./components/steps/Step1CompanyCategory";
import Step3SectorsServed from "./components/steps/Step3SectorsServed";
import Step4BusinessCategories from "./components/steps/Step4BusinessCategories";
import Step5ProductsServices from "./components/steps/Step5ProductsServices";
import Step7PromotionBilling from "./components/steps/Step7PromotionBilling";
import Step8MediaUploads from "./components/steps/Step8MediaUploads";
import { AIGenerationLoader } from "./components/AIGenerationLoader";
import {useTemplate} from "../../../../../context/context"
import { toast } from "react-toastify";

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
  aiServicesOther: "",
  gnssSolutions: [],
  gnssSolutionsOther: "",
  gnssProducts: [],
  gnssProductsOther: "",
  gnssServices: [],
  gnssServicesOther: "",
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

// ── Form submission API
const FORM_SUBMIT_API_URL = "https://14exr8c8g0.execute-api.ap-south-1.amazonaws.com/prod/drafts";

function App() {
  const [companyNameStatus, setCompanyNameStatus] = useState<null | { available: boolean; suggestions?: string[]; message: string }>(null);
  const [isCheckingName, setIsCheckingName] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const { setDraftDetails } = useTemplate();

  const navigate = useNavigate();

  // Get templateId from navigation state
  const location = useLocation();
  const templateId = location.state?.templateId;
  initialFormData.templateSelection = templateId || "";

  // ── Check company name availability
  const checkCompanyName = async (name: string) => {
    if (!name || name.length < 2) {
      setCompanyNameStatus(null);
      return;
    }
    setIsCheckingName(true);
    try {
      const res = await fetch(`https://14exr8c8g0.execute-api.ap-south-1.amazonaws.com/prod/drafts/check-name?name=${encodeURIComponent(name)}`);
      const data = await res.json();
      setCompanyNameStatus(data);
    } catch (err) {
      setCompanyNameStatus({ available: false, message: "Error checking name" });
    } finally {
      setIsCheckingName(false);
    }
  };

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  // ── Submit Step 1 data → list the company immediately
  const handleStep1Submit = async () => {
    if (!formData.companyName || !formData.directorEmail) {
      toast.error("Please fill Company Name and Director Email before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        userId: formData.directorEmail,
        templateSelection: formData.templateSelection || templateId || "",
        templateDetails: {
          id: null,
          name: "",
          value: formData.templateSelection || templateId || "",
        },
        formData: {
          ...formData,
          submittedAt: new Date().toISOString(),
        },
        uploadedFiles: {},
        batchInfo: {
          isLastBatch: true,
          timestamp: Date.now(),
          processingMethod: "step1_immediate_submit",
        },
      };

      const response = await fetch(FORM_SUBMIT_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      // Store draft details in context so downstream pages can use them
      setDraftDetails(data);

      toast.success("🎉 Company listed successfully! You will receive a confirmation email shortly.", {
        toastId: "company-listed",
        autoClose: 5000,
      });

      // Navigate back to the companies listing page
      setTimeout(() => {
        navigate("/companies");
      }, 2000);

    } catch (error: any) {
      console.error("❌ Step 1 submission failed:", error);
      toast.error("Failed to list your company. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Step1CompanyCategory
      formData={formData}
      updateFormData={updateFormData}
      onNext={handleStep1Submit}
      onPrev={() => navigate(-1)}
      isValid={!isSubmitting}
      isFirstStep={true}
      checkCompanyName={checkCompanyName}
      companyNameStatus={companyNameStatus}
      isCheckingName={isCheckingName}
      isSubmitting={isSubmitting}
    />
  );
}

export default App;
