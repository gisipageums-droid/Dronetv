// import { useState } from "react";
// import { FormData } from "./types/form";
// import { useLocation,useNavigate } from "react-router-dom";
// import Step1CompanyCategory from "./components/steps/Step1CompanyCategory";
// import Step3SectorsServed from "./components/steps/Step3SectorsServed";
// import Step4BusinessCategories from "./components/steps/Step4BusinessCategories";
// import Step5ProductsServices from "./components/steps/Step5ProductsServices";
// import Step7PromotionBilling from "./components/steps/Step7PromotionBilling";
// import Step8MediaUploads from "./components/steps/Step8MediaUploads";
// import { AIGenerationLoader } from "./components/AIGenerationLoader";
// import {useTemplate} from "../../../../../context/context"
// import { toast } from "react-toastify";

// // ---- initial form state ----
// const initialFormData: FormData = {
//   companyCategory: [],
//   companyName: "",
//   yearEstablished: "",
//   directorName: "",
//   directorPhone: "",
//   directorEmail: "",
//   altContactName: "",
//   altContactPhone: "",
//   altContactEmail: "",
//   websiteUrl: "",
//   companyProfileLink: "",
//   promoVideoFiveMinUrl: "",
//   promoVideoOneMinUrl: "",
//   officeAddress: "",
//   city: "",
//   state: "",
//   country: "",
//   postalCode: "",
//   legalName: "",
//   gstin: "",
//   cinOrUdyamOrPan: "",
//   supportEmail: "",
//   whatsappLink: "",
//   socialLinks: {
//     linkedin: "",
//     facebook: "",
//     instagram: "",
//     youtube: "",
//     website: "",
//   },
//   operatingHours: "",
//   promoCode: "",
//   sectorsServed: [],
//   sectorsOther: "",
//   mainCategories: [],
//   otherMainCategories: "",
//   geographyOfOperations: [],
//   coverageType: "",
//   manufacturingSubcategories: [],
//   manufOther: "",
//   dgcaTypeCertificateUrl: "",
//   serviceSubcategories: [],
//   servicesOther: "",
//   trainingTypes: [],
//   trainingOther: "",
//   rptoAuthorisationCertificateUrl: "",
//   photoVideoSubcategories: [],
//   photoVideoOther: "",
//   softwareSubcategories: [],
//   softwareOther: "",
//   aiSolutions: [],
//   aiSolutionsOther: "",
//   aiProducts: [],
//   aiProductsOther: "",
//   aiServices: [],
//   aiServicesOther: "",
//   gnssSolutions: [],
//   gnssSolutionsOther: "",
//   gnssProducts: [],
//   gnssProductsOther: "",
//   gnssServices: [],
//   gnssServicesOther: "",
//   heroBackgroundUrl: "",
//   primaryCtaText: "",
//   primaryCtaLink: "",
//   secondaryCtaText: "",
//   secondaryCtaLink: "",
//   aboutTitle: "",
//   aboutImageUrl: "",
//   aboutExperienceYears: 0,
//   aboutTeamExperience: "",
//   companyValuesSelection: [],
//   servicesTitle: "",
//   servicesDescription: "",
//   services: [],
//   productsTitle: "",
//   productCategories: "",
//   products: [],
//   clientsTitle: "",
//   clients: [],
//   testimonials: [],
//   contactTitle: "",
//   contactEmail: "",
//   contactPhone: "",
//   addressLine: "",
//   pinCode: "",
//   mapEmbedUrl: "",
//   contactFormText: "",
//   submitButtonText: "",
//   footerLogoUrl: "",
//   footerDescriptionDraft: "",
//   footerText: "",
//   footerEmail: "",
//   footerPhone: "",
//   footerAddress: "",
//   footerNavLinks: [],
//   newsletterEnabled: false,
//   newsletterDescription: "",
//   promoFormats: [],
//   billingContactName: "",
//   billingContactEmail: "",
//   billingGstDetails: "",
//   billingAddress: "",
//   paymentMethod: "",
//   acceptTerms: false,
//   acceptPrivacy: false,
//   companyLogoUrl: "",
//   brochurePdfUrl: "",
//   cataloguePdfUrl: "",
//   caseStudiesUrl: "",
//   brandGuidelinesUrl: "",
//   templateId: "",
// };

// function App() {
// const [companyNameStatus, setCompanyNameStatus] = useState<null | { available: boolean; suggestions?: string[]; message: string }>(null);
// const [isCheckingName, setIsCheckingName] = useState(false);

//   const [currentStep, setCurrentStep] = useState(1);
 
//   const [formData, setFormData] = useState<FormData>(initialFormData);
//   const { draftDetails, setAIGenData, AIGenData } = useTemplate();
    
//   const navigate = useNavigate(); // Use the useNavigate hook

// //function to check company name availability

// const checkCompanyName = async (name: string) => {
//   if (!name || name.length < 2) {
//     setCompanyNameStatus(null);
//     return;
//   }
//   setIsCheckingName(true);
//   try {
//     const res = await fetch(`https://14exr8c8g0.execute-api.ap-south-1.amazonaws.com/prod/drafts/check-name?name=${encodeURIComponent(name)}`);
//     const data = await res.json();
//     setCompanyNameStatus(data);
    
//   } catch (err) {
//     setCompanyNameStatus({ available: false, message: "Error checking name" });
//   } finally {
//     setIsCheckingName(false);
//   }
// };


//   const API = "https://3l8nvxqw1a.execute-api.ap-south-1.amazonaws.com/prod/api/draft";
//   //  const Dummyapi = "https://3l8nvxqw1a.execute-api.ap-south-1.amazonaws.com/prod/api/draft/alok-12345/draft-alok-aerospace-2025-002?template=template-2";

//   console.log("draftDetails:",draftDetails);
//     // Add a state for API call loading
//   const [isApiLoading, setIsApiLoading] = useState(false);

//     async function handleClick() {
//       try {
//         setIsApiLoading(true);
//         const response = await fetch(`${API}/${draftDetails.userId}/${draftDetails.draftId}?template=template-${draftDetails.templateSelection}`);
//         // const response = await fetch(`${Dummyapi}`);
        
//         const data = await response.json();
//         if (response.ok) {
          
//           toast.success("AI generates the data successfully",{toastId: "ai-success"})          
//           // Use navigate function instead of Navigate component
//           // console.log("data:",data);
          
//             setAIGenData(data);
//             // console.log("AIgen:", AIGenData);
//             navigate(`/edit/template/${draftDetails.templateSelection ===1?"t1":"t2"}`);
          
  
          
//         } else {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     }
  

//   // Get templateId from navigation state
//   const location = useLocation();
//   const templateId = location.state?.templateId;
//   // console.log(templateId);
//   initialFormData.templateSelection = templateId || "";
//   // console.log("templateSelection: ", initialFormData.templateSelection);

//   // ✅ new: track draftId & selectedTemplate
//   const [draftId, setDraftId] = useState<string | undefined>(undefined);
//   const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templateId); // this comes from your template selection UI
//   const [userId] = useState<string>("user-123"); // replace with real auth/user context

//   const [isGenerating, setIsGenerating] = useState(false);
//   const [isComplete, setIsComplete] = useState(false);

//   const updateFormData = (data: Partial<FormData>) => {
//     setFormData((prev) => ({ ...prev, ...data }));
//   };

//   // Step 1 validation logic
//   const validateStep1 = () => {
//     // Company Category: at least 1
//     if (!formData.companyCategory || formData.companyCategory.length === 0) {
//       toast.error("Please select at least one Company Category.");
//       return false;
//     }
//     // Company Name: required
//     if (!formData.companyName || formData.companyName.trim() === "") {
//       toast.error("Company Name is required.");
//       return false;
//     }
//     // Website URL: required
//     if (!formData.websiteUrl || formData.websiteUrl.trim() === "") {
//       toast.error("Website URL is required.");
//       return false;
//     }
//     // Director/MD Information required
//     if (!formData.directorName || formData.directorName.trim() === "") {
//       toast.error("Director Name is required.");
//       return false;
//     }
//     if (!formData.directorPhone || formData.directorPhone.trim() === "") {
//       toast.error("Director Phone is required.");
//       return false;
//     }
//     if (!formData.directorEmail || formData.directorEmail.trim() === "") {
//       toast.error("Director Email is required.");
//       return false;
//     }
//     // Alternative Contact required
//     if (!formData.altContactName || formData.altContactName.trim() === "") {
//       toast.error("Alternative Contact Name is required.");
//       return false;
//     }
//     if (!formData.altContactPhone || formData.altContactPhone.trim() === "") {
//       toast.error("Alternative Contact Phone is required.");
//       return false;
//     }
//     if (!formData.altContactEmail || formData.altContactEmail.trim() === "") {
//       toast.error("Alternative Contact Email is required.");
//       return false;
//     }
//     // Address Information required
//     if (!formData.officeAddress || formData.officeAddress.trim() === "") {
//       toast.error("Office Address is required.");
//       return false;
//     }
//     if (!formData.country || formData.country.trim() === "") {
//       toast.error("Country is required.");
//       return false;
//     }
//     if (!formData.state || formData.state.trim() === "") {
//       toast.error("State is required.");
//       return false;
//     }
//     if (!formData.city || formData.city.trim() === "") {
//       toast.error("City is required.");
//       return false;
//     }
//     if (!formData.postalCode || formData.postalCode.trim() === "") {
//       toast.error("Postal Code is required.");
//       return false;
//     }
//     // All other fields in Company Information are optional
//     // Legal Information is optional
//     return true;
//   };

//   // Step 3 validation logic
//   const validateStep3 = () => {
//     if (!formData.sectorsServed || typeof formData.sectorsServed !== "object") {
//       toast.error("Please select at least one sector.");
//       return false;
//     }
//     // Check if at least one selected category has at least one sector selected
//     const hasAny = formData.companyCategory.some(
//       (cat) =>
//         Array.isArray(formData.sectorsServed[cat]) &&
//         formData.sectorsServed[cat].length > 0
//     );
//     if (!hasAny) {
//       toast.error("Please select at least one sector for your company category.");
//       return false;
//     }
//     return true;
//   };

//   // Step 4 validation logic
//   const validateStep4 = () => {
//     if (!formData.mainCategories || formData.mainCategories.length === 0) {
//       toast.error("Please select at least one Main Business Category.");
//       return false;
//     }
//     if (!formData.geographyOfOperations || formData.geographyOfOperations.length === 0) {
//       toast.error("Please select at least one Geography of Operations.");
//       return false;
//     }
//     return true;
//   };

//   // Step 5 validation logic
//   const validateStep5 = () => {
//     if (!formData.services || formData.services.length === 0) {
//       toast.error("Please add at least one service.");
//       return false;
//     }
//     if (!formData.products || formData.products.length === 0) {
//       toast.error("Please add at least one product.");
//       return false;
//     }
//     return true;
//   };

//   // Step 7 validation logic
//   const validateStep7 = () => {
//     if (!formData.promoFormats || formData.promoFormats.length === 0) {
//       toast.error("Please select at least one Promotion Preference.");
//       return false;
//     }
//     if (!formData.acceptTerms || !formData.acceptPrivacy) {
//       toast.error("Please accept Terms & Conditions and Privacy Policy to continue.");
//       return false;
//     }
//     return true;
//   };

//   // Step 8 validation logic
//   const validateStep8 = () => {
//     if (!formData.companyLogoUrl || typeof formData.companyLogoUrl !== "string" || !formData.companyLogoUrl.startsWith("http")) {
//       toast.error("Please upload your company logo in Brand & Site Images.");
//       return false;
//     }
//     return true;
//   };

//   const nextStep = () => {
//     // Only validate on step 1, 3, 4, 5, 7, and 8
//     if (currentStep === 1) {
//       if (!validateStep1()) return;
//     }
//     if (currentStep === 2) {
//       if (!validateStep3()) return;
//     }
//     if (currentStep === 3) {
//       if (!validateStep4()) return;
//     }
//     if (currentStep === 4) {
//       if (!validateStep5()) return;
//     }
//     if (currentStep === 5) {
//       if (!validateStep7()) return;
//     }
//     if (currentStep === 6) {
//       if (!validateStep8()) return;
//     }
//     if (currentStep < 6) {
//       setCurrentStep(currentStep + 1);
//     } else if (currentStep === 6) {
//       setIsGenerating(true);
//     }
//   };

//   const prevStep = () => {
//     if (currentStep > 1) {
//       setCurrentStep(currentStep - 1);
//     }
//   };

//   const handleGenerationComplete = () => {
//     setIsGenerating(false);
//     setIsComplete(true);
//   };

//   const renderStep = () => {
//     const stepProps = {
//       formData,
//       updateFormData,
//       onNext: nextStep,
//       onPrev: prevStep,
//       onStepClick: (step: number) => setCurrentStep(step),
//       isValid: true,
//     };

//     switch (currentStep) {
//       case 1:
//         return <Step1CompanyCategory 
//         {...stepProps} 
//          checkCompanyName={checkCompanyName}
//         companyNameStatus={companyNameStatus}
//         isCheckingName={isCheckingName}
//         />;
//       case 2:
//         return <Step3SectorsServed {...stepProps} />;
//       case 3:
//         return <Step4BusinessCategories {...stepProps} />;
//       case 4:
//         return <Step5ProductsServices {...stepProps} />;
//       case 5:
//         return <Step7PromotionBilling {...stepProps} />;
//       case 6:
//         return (
//           <Step8MediaUploads
//             formData={formData} // ✅ pass current form data
//             updateFormData={updateFormData} // ✅ so uploads update state
//             userId={userId}
//             draftId={draftId}
//             selectedTemplateId={selectedTemplateId}
//             onNext={nextStep} // ✅ prevent "onNext is not a function"
//             onPrev={prevStep} // ✅ allow going back if needed
//             onSaveSuccess={(newDraftId) => setDraftId(newDraftId)} // ✅ store draftId
//             isValid={true} // ✅ for consistency with other steps
//           />
//         );
//       default:
//         return <Step1CompanyCategory {...stepProps} />;
//     }
//   };

//   if (isGenerating) {
//     return <AIGenerationLoader onComplete={handleGenerationComplete} />;
//   }

//   if (isComplete) {
//     // Show loading indicator while API call is in progress
//     if (isApiLoading) {
//       return (
//         <div className="fixed inset-0 bg-indigo-900 flex items-center justify-center z-50">
//           <div className="text-center">
//             <div className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse mb-6">
//               <svg className="w-12 h-12 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//               </svg>
//             </div>
//             <h1 className="text-3xl font-bold text-white mb-2">
//               Loading Your Website
//             </h1>
//             <p className="text-blue-200 text-lg">
//               Please wait while we prepare your website data
//             </p>
//           </div>
//         </div>
//       );
//     }
    
//     // Call handleClick after a short delay when isComplete becomes true
//       handleClick();
    
//     return null;
//   }

//   return <div>{renderStep()}</div>;
// }

// export default App;





import { useState, useEffect } from "react";
import { FormData } from "./types/form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Step1CompanyCategory from "./components/steps/Step1CompanyCategory";
import Step3SectorsServed from "./components/steps/Step3SectorsServed";
import Step4BusinessCategories from "./components/steps/Step4BusinessCategories";
import Step5ProductsServices from "./components/steps/Step5ProductsServices";
import Step7PromotionBilling from "./components/steps/Step7PromotionBilling";
import Step8MediaUploads from "./components/steps/Step8MediaUploads";
import { AIGenerationLoader } from "./components/AIGenerationLoader";
import { useTemplate } from "../../../../../context/context";
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
  const [companyNameStatus, setCompanyNameStatus] = useState<null | { available: boolean; suggestions?: string[]; message: string }>(null);
  const [isCheckingName, setIsCheckingName] = useState(false);

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const { draftDetails, setAIGenData, AIGenData } = useTemplate();
  const navigate = useNavigate();
  const location = useLocation();
  

  // ✅ extract params for prefill
  const params = useParams<{ publicId?: string; userId?: string; draftId?: string }>();
  const { publicId, userId: urlUserId, draftId: urlDraftId } = params;

  // ✅ loading state for prefill
  const [isApiLoading, setIsApiLoading] = useState(false);

  // ✅ prefill form logic
  useEffect(() => {
    const fetchDraftData = async () => {
      if (publicId && urlUserId && urlDraftId) {
        try {
          setIsApiLoading(true);
          const API_URL = `https://l0jg1d9hnc.execute-api.ap-south-1.amazonaws.com/dev/${publicId}/${urlUserId}/${urlDraftId}`;
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
      }
    };

    fetchDraftData();
  }, [publicId, urlUserId, urlDraftId, setAIGenData]);

  // function to check company name availability
  const checkCompanyName = async (name: string) => {
    if (!name || name.length < 2) {
      setCompanyNameStatus(null);
      return;
    }
    setIsCheckingName(true);
    try {
      const res = await fetch(
        `https://14exr8c8g0.execute-api.ap-south-1.amazonaws.com/prod/drafts/check-name?name=${encodeURIComponent(name)}`
      );
      const data = await res.json();
      setCompanyNameStatus(data);
    } catch (err) {
      setCompanyNameStatus({ available: false, message: "Error checking name" });
    } finally {
      setIsCheckingName(false);
    }
  };

  const API = "https://3l8nvxqw1a.execute-api.ap-south-1.amazonaws.com/prod/api/draft";

  async function handleClick() {
    try {
      setIsApiLoading(true);
      const response = await fetch(`${API}/${draftDetails.userId}/${draftDetails.draftId}?template=template-${draftDetails.templateSelection}`);
      const data = await response.json();
      if (response.ok) {
        toast.success("AI generates the data successfully", { toastId: "ai-success" });
        setAIGenData(data);
        navigate(`/edit/template/${draftDetails.templateSelection === 1 ? "t1" : "t2"}`);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const templateId = location.state?.templateId;
  initialFormData.templateSelection = templateId || "";

  const [draftId, setDraftId] = useState<string | undefined>(undefined);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templateId);
  const [userId] = useState<string>("user-123");

  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  // Step 1 validation logic
  const validateStep1 = () => {
    // Company Category: at least 1
    if (!formData.companyCategory || formData.companyCategory.length === 0) {
      toast.error("Please select at least one Company Category.");
      return false;
    }
    // Company Name: required
    if (!formData.companyName || formData.companyName.trim() === "") {
      toast.error("Company Name is required.");
      return false;
    }
    // Website URL: required
    if (!formData.websiteUrl || formData.websiteUrl.trim() === "") {
      toast.error("Website URL is required.");
      return false;
    }
    // Director/MD Information required
    if (!formData.directorName || formData.directorName.trim() === "") {
      toast.error("Director Name is required.");
      return false;
    }
    if (!formData.directorPhone || formData.directorPhone.trim() === "") {
      toast.error("Director Phone is required.");
      return false;
    }
    if (!formData.directorEmail || formData.directorEmail.trim() === "") {
      toast.error("Director Email is required.");
      return false;
    }
    // Alternative Contact required
    if (!formData.altContactName || formData.altContactName.trim() === "") {
      toast.error("Alternative Contact Name is required.");
      return false;
    }
    if (!formData.altContactPhone || formData.altContactPhone.trim() === "") {
      toast.error("Alternative Contact Phone is required.");
      return false;
    }
    if (!formData.altContactEmail || formData.altContactEmail.trim() === "") {
      toast.error("Alternative Contact Email is required.");
      return false;
    }
    // Address Information required
    if (!formData.officeAddress || formData.officeAddress.trim() === "") {
      toast.error("Office Address is required.");
      return false;
    }
    if (!formData.country || formData.country.trim() === "") {
      toast.error("Country is required.");
      return false;
    }
    if (!formData.state || formData.state.trim() === "") {
      toast.error("State is required.");
      return false;
    }
    if (!formData.city || formData.city.trim() === "") {
      toast.error("City is required.");
      return false;
    }
    if (!formData.postalCode || formData.postalCode.trim() === "") {
      toast.error("Postal Code is required.");
      return false;
    }
    // All other fields in Company Information are optional
    // Legal Information is optional
    return true;
  };

  // Step 3 validation logic
  const validateStep3 = () => {
    if (!formData.sectorsServed || typeof formData.sectorsServed !== "object") {
      toast.error("Please select at least one sector.");
      return false;
    }
    // Check if at least one selected category has at least one sector selected
    const hasAny = formData.companyCategory.some(
      (cat) =>
        Array.isArray(formData.sectorsServed[cat]) &&
        formData.sectorsServed[cat].length > 0
    );
    if (!hasAny) {
      toast.error("Please select at least one sector for your company category.");
      return false;
    }
    return true;
  };

  // Step 4 validation logic
  const validateStep4 = () => {
    if (!formData.mainCategories || formData.mainCategories.length === 0) {
      toast.error("Please select at least one Main Business Category.");
      return false;
    }
    if (!formData.geographyOfOperations || formData.geographyOfOperations.length === 0) {
      toast.error("Please select at least one Geography of Operations.");
      return false;
    }
    return true;
  };

  // Step 5 validation logic
  const validateStep5 = () => {
    if (!formData.services || formData.services.length === 0) {
      toast.error("Please add at least one service.");
      return false;
    }
    if (!formData.products || formData.products.length === 0) {
      toast.error("Please add at least one product.");
      return false;
    }
    return true;
  };

  // Step 7 validation logic
  const validateStep7 = () => {
    if (!formData.promoFormats || formData.promoFormats.length === 0) {
      toast.error("Please select at least one Promotion Preference.");
      return false;
    }
    if (!formData.acceptTerms || !formData.acceptPrivacy) {
      toast.error("Please accept Terms & Conditions and Privacy Policy to continue.");
      return false;
    }
    return true;
  };

  // Step 8 validation logic
  const validateStep8 = () => {
    if (!formData.companyLogoUrl || typeof formData.companyLogoUrl !== "string" || !formData.companyLogoUrl.startsWith("http")) {
      toast.error("Please upload your company logo in Brand & Site Images.");
      return false;
    }
    return true;
  };

  const nextStep = () => {
    // Only validate on step 1, 3, 4, 5, 7, and 8
    if (currentStep === 1) {
      if (!validateStep1()) return;
    }
    if (currentStep === 2) {
      if (!validateStep3()) return;
    }
    if (currentStep === 3) {
      if (!validateStep4()) return;
    }
    if (currentStep === 4) {
      if (!validateStep5()) return;
    }
    if (currentStep === 5) {
      if (!validateStep7()) return;
    }
    if (currentStep === 6) {
      if (!validateStep8()) return;
    }
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
        return (
          <Step1CompanyCategory
            {...stepProps}
            checkCompanyName={checkCompanyName}
            companyNameStatus={companyNameStatus}
            isCheckingName={isCheckingName}
          />
        );
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
            userId={userId}
            draftId={draftId}
            selectedTemplateId={selectedTemplateId}
            onNext={nextStep}
            onPrev={prevStep}
            onSaveSuccess={(newDraftId) => setDraftId(newDraftId)}
            isValid={true}
          />
        );
      default:
        return <Step1CompanyCategory {...stepProps} />;
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

  if (isGenerating) {
    return <AIGenerationLoader onComplete={handleGenerationComplete} />;
  }

  if (isComplete) {
    if (isApiLoading) {
      return (
        <div className="fixed inset-0 bg-indigo-900 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse mb-6">
              <svg
                className="w-12 h-12 text-white animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 
1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Loading Your Website</h1>
            <p className="text-blue-200 text-lg">Please wait while we prepare your website data</p>
          </div>
        </div>
      );
    }

    handleClick();
    return null;
  }

  return <div>{renderStep()}</div>;
}

export default App;
