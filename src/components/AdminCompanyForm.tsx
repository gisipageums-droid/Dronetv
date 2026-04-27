// pages/admincompanyform.tsx
import React, { useState } from 'react';
import { FormData } from './Admin/AdminForm/types/form';
import { useAdminFormDispatch, useAdminFormSelector } from './Admin/AdminForm/redux toolkit/store/hooks';
import { updateFormData as updateFormDataAction } from './Admin/AdminForm/redux toolkit/slices/adminFormSlice';
import Step1CompanyCategory from './Admin/AdminForm/Components/steps/Step1CompanyCategory';
import Step3SectorsServed from './Admin/AdminForm/Components/steps/Step3SectorsServed';
import Step4BusinessCategories from './Admin/AdminForm/Components/steps/Step4BusinessCategories';
import Step5ProductsServices from './Admin/AdminForm/Components/steps/Step5ProductsServices';
import Step7PromotionBilling from './Admin/AdminForm/Components/steps/Step7PromotionBilling';
import Step8MediaUploads from './Admin/AdminForm/Components/steps/Step8MediaUploads';
import { AIGenerationLoader } from './Admin/AdminForm/Components/AIGenerationLoader';
import { SuccessPage } from './Admin/AdminForm/Components/SuccessPage';

const AdminCompanyForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const dispatch = useAdminFormDispatch();
  const formData = useAdminFormSelector(state => state.adminForm);

  const updateFormData = (data: Partial<FormData>) => {
    dispatch(updateFormDataAction(data));
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
    <div className="flex flex-col w-full min-h-screen bg-gray-50">
      <div className="flex-1">
        {renderStep()}
      </div>
    </div>
  )
};

export default AdminCompanyForm;
