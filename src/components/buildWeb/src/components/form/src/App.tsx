import React, { useState, useEffect } from "react";
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

function App() {
  const [currentStep, setCurrentStep] = useState(1);
 
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const { draftDetails, setAIGenData, AIGenData } = useTemplate();
    
  const navigate = useNavigate(); // Use the useNavigate hook
  
    const API = "https://3l8nvxqw1a.execute-api.ap-south-1.amazonaws.com/prod/api/draft";
  //  const Dummyapi = "https://3l8nvxqw1a.execute-api.ap-south-1.amazonaws.com/prod/api/draft/alok-12345/draft-alok-aerospace-2025-002?template=template-2";

  console.log("draftDetails:",draftDetails);
    // Add a state for API call loading
  const [isApiLoading, setIsApiLoading] = useState(false);

    async function handleClick() {
      try {
        setIsApiLoading(true);
        const response = await fetch(`${API}/${draftDetails.userId}/${draftDetails.draftId}?template=template-${draftDetails.templateSelection}`);
        // const response = await fetch(`${Dummyapi}`);
        
        const data = await response.json();
        if (response.ok) {
          
          toast.success("AI generates the data successfully",{toastId: "ai-success"})          
          // Use navigate function instead of Navigate component
          // console.log("data:",data);
          
            setAIGenData(data);
            // console.log("AIgen:", AIGenData);
            navigate(`/edit/template/${draftDetails.templateSelection ===1?"t1":"t2"}`);
          
  
          
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  

  // Get templateId from navigation state
  const location = useLocation();
  const templateId = location.state?.templateId;
  // console.log(templateId);
  initialFormData.templateSelection = templateId || "";
  // console.log("templateSelection: ", initialFormData.templateSelection);

  // ✅ new: track draftId & selectedTemplate
  const [draftId, setDraftId] = useState<string | undefined>(undefined);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templateId); // this comes from your template selection UI
  const [userId] = useState<string>("user-123"); // replace with real auth/user context

  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 6) {
      setIsGenerating(true);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerationComplete = () => {
    setIsGenerating(false);
    setIsComplete(true);
  };

  const renderStep = () => {
    const stepProps = {
      formData,
      updateFormData,
      onNext: nextStep,
      onPrev: prevStep,
      onStepClick: (step: number) => setCurrentStep(step),
      isValid: true,
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
            formData={formData} // ✅ pass current form data
            updateFormData={updateFormData} // ✅ so uploads update state
            userId={userId}
            draftId={draftId}
            selectedTemplateId={selectedTemplateId}
            onNext={nextStep} // ✅ prevent "onNext is not a function"
            onPrev={prevStep} // ✅ allow going back if needed
            onSaveSuccess={(newDraftId) => setDraftId(newDraftId)} // ✅ store draftId
            isValid={true} // ✅ for consistency with other steps
          />
        );
      default:
        return <Step1CompanyCategory {...stepProps} />;
    }
  };

  if (isGenerating) {
    return <AIGenerationLoader onComplete={handleGenerationComplete} />;
  }

  if (isComplete) {
    // Show loading indicator while API call is in progress
    if (isApiLoading) {
      return (
        <div className="fixed inset-0 bg-indigo-900 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse mb-6">
              <svg className="w-12 h-12 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Loading Your Website
            </h1>
            <p className="text-blue-200 text-lg">
              Please wait while we prepare your website data
            </p>
          </div>
        </div>
      );
    }
    
    // Call handleClick after a short delay when isComplete becomes true
      handleClick();
    
    return null;
  }

  return <div>{renderStep()}</div>;
}

export default App;
