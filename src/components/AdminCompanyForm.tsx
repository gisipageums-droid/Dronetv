// pages/admincompanyform.tsx
import React, { useState } from 'react';
import { FormData } from './AdminForm/types/form';
import Step1CompanyCategory from './AdminForm/Components/steps/Step1CompanyCategory';
import Step3SectorsServed from './AdminForm/Components/steps/Step3SectorsServed';
import Step4BusinessCategories from './AdminForm/Components/steps/Step4BusinessCategories';
import Step5ProductsServices from './AdminForm/Components/steps/Step5ProductsServices';
import Step7PromotionBilling from './AdminForm/Components/steps/Step7PromotionBilling';
import Step8MediaUploads from './AdminForm/Components/steps/Step8MediaUploads';
import { AIGenerationLoader } from './AdminForm/Components/AIGenerationLoader';
import { SuccessPage } from './AdminForm/Components/SuccessPage';

const initialFormData: FormData = {
  // ✅ keep all your initial state here (same as before)
  companyCategory: [],
  companyName: '',
  yearEstablished: '',
  directorName: '',
  directorPhone: '',
  directorEmail: '',
  altContactName: '',
  altContactPhone: '',
  altContactEmail: '',
  websiteUrl: '',
  companyProfileLink: '',
  promoVideoFiveMinUrl: '',
  promoVideoOneMinUrl: '',
  officeAddress: '',
  city: '',
  state: '',
  country: '',
  postalCode: '',
  legalName: '',
  gstin: '',
  cinOrUdyamOrPan: '',
  supportEmail: '',
  whatsappLink: '',
  socialLinks: {
    linkedin: '',
    facebook: '',
    instagram: '',
    youtube: '',
    website: '',
  },
  operatingHours: '',
  promoCode: '',
  sectorsServed: [],
  sectorsOther: '',
  mainCategories: [],
  otherMainCategories: '',
  geographyOfOperations: [],
  coverageType: '',
  manufacturingSubcategories: [],
  manufOther: '',
  dgcaTypeCertificateUrl: '',
  serviceSubcategories: [],
  servicesOther: '',
  trainingTypes: [],
  trainingOther: '',
  rptoAuthorisationCertificateUrl: '',
  photoVideoSubcategories: [],
  photoVideoOther: '',
  softwareSubcategories: [],
  softwareOther: '',
  aiSolutions: [],
  aiSolutionsOther: '',
  aiProducts: [],
  aiProductsOther: '',
  aiServices: [],
  aiServicesOther: '',
  gnssSolutions: [],
  gnssSolutionsOther: '',
  gnssProducts: [],
  gnssProductsOther: '',
  gnssServices: [],
  gnssServicesOther: '',
  heroBackgroundUrl: '',
  primaryCtaText: '',
  primaryCtaLink: '',
  secondaryCtaText: '',
  secondaryCtaLink: '',
  aboutTitle: '',
  aboutImageUrl: '',
  aboutExperienceYears: 0,
  aboutTeamExperience: '',
  companyValuesSelection: [],
  servicesTitle: '',
  servicesDescription: '',
  services: [],
  productsTitle: '',
  productCategories: '',
  products: [],
  clientsTitle: '',
  clients: [],
  testimonials: [],
  contactTitle: '',
  contactEmail: '',
  contactPhone: '',
  addressLine: '',
  pinCode: '',
  mapEmbedUrl: '',
  contactFormText: '',
  submitButtonText: '',
  footerLogoUrl: '',
  footerDescriptionDraft: '',
  footerText: '',
  footerEmail: '',
  footerPhone: '',
  footerAddress: '',
  footerNavLinks: [],
  newsletterEnabled: false,
  newsletterDescription: '',
  promoFormats: [],
  billingContactName: '',
  billingContactEmail: '',
  billingGstDetails: '',
  billingAddress: '',
  paymentMethod: '',
  acceptTerms: false,
  acceptPrivacy: false,
  companyLogoUrl: '',
  brochurePdfUrl: '',
  cataloguePdfUrl: '',
  caseStudiesUrl: '',
  brandGuidelinesUrl: '',
};

const AdminCompanyForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const updateFormData = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
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

  // ✅ Render step logic
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
          <Step1CompanyCategory {...stepProps} />
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
        return <Step8MediaUploads {...stepProps} />;
      default:
        return (
          <div className="space-y-6">
            <Step1CompanyCategory {...stepProps} />
          </div>
        );
    }
  };

  // ✅ Top-level conditional rendering
  if (isGenerating) {
    return <AIGenerationLoader onComplete={handleGenerationComplete} />;
  }

  if (isComplete) {
    return <SuccessPage formData={formData} />;
  }

  return (
  <div className="w-full min-h-screen bg-gray-50 flex flex-col">
    <div className="flex-1">
      {renderStep()}
    </div>
  </div>
)
};

export default AdminCompanyForm;
