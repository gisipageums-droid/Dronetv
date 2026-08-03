import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FormStepProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  onNext?: () => void;
  onPrev?: () => void;
  onStepClick?: (step: number) => void;
  isValid?: boolean;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  currentStep: number;
  totalSteps?: number;
}

export const FormStep: React.FC<FormStepProps> = ({
  title,
  description,
  children,
  onNext,
  onPrev,
  onStepClick,
  isValid = true,
  isFirstStep = false,
  isLastStep = false,
  currentStep,
  totalSteps = 7,
}) => {
  const stepTitles = [
    'Company Info',
    'Sectors Served',
    'Business Categories',
    'Products & Services',
    'Promotion & Billing',
    'Media Uploads'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-main to-brand-yellow-soft">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-yellow to-brand-yellow shadow-lg border-b border-brand-yellow-soft">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-ink">DroneTV</h1>
              <p className="text-sm text-ink-charcoal">AI-Powered Website Generator</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-ink-paragraph">Drone • AI • GIS</p>
              <p className="text-xs text-ink-paragraph">One form, instant website</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-brand-yellow-soft shadow-sm border-b border-brand-yellow-soft">
        <div className="max-w-4xl mx-auto px-6 py-3">
          {/* Step Navigation */}
          <div className="flex items-center justify-between mb-3 overflow-x-auto pb-2">
            {stepTitles.map((stepTitle, index) => {
              const stepNumber = index + 1;
              const isActive = stepNumber === currentStep;
              const isCompleted = stepNumber < currentStep;
              
              return (
                <div key={stepNumber} className="flex items-center">
                  <button
                    onClick={() => onStepClick ? onStepClick(stepNumber) : null}
                    className={`flex items-center px-2 py-1 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-ink text-brand-yellow shadow-md'
                        : isCompleted
                        ? 'bg-brand-yellow-soft text-brand-gold hover:bg-brand-yellow-soft cursor-pointer'
                        : 'bg-brand-yellow-soft text-ink-paragraph hover:bg-brand-yellow-soft cursor-pointer'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs mr-1 ${
                      isActive
                        ? 'bg-brand-yellow text-ink'
                        : isCompleted
                        ? 'bg-brand-gold text-ink'
                        : 'bg-ink-light text-ink-paragraph'
                    }`}>
                      {isCompleted ? '✓' : stepNumber}
                    </span>
                    {stepTitle}
                  </button>
                  {index < stepTitles.length - 1 && (
                    <div className={`w-4 h-0.5 mx-1 ${
                      isCompleted ? 'bg-brand-yellow' : 'bg-brand-yellow-soft'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-ink-charcoal">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-ink-paragraph">
              {Math.round((currentStep / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-brand-yellow-soft rounded-full h-2">
            <div
              className="bg-gradient-to-r from-brand-gold to-brand-gold h-2 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <form
        className="max-w-4xl mx-auto px-6 py-6"
        onSubmit={(e) => {
          e.preventDefault();
          onNext && onNext();
        }}
      >
        {/* Page Title */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-ink mb-1">{title}</h1>
          {description && (
            <p className="text-sm text-ink-paragraph">{description}</p>
          )}
        </div>

        {/* Content */}
        <div className="bg-surface-card rounded-lg shadow-md border border-brand-yellow-soft p-4 mb-4">
          {children}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center bg-surface-card rounded-lg shadow-md border border-brand-yellow-soft p-3">
          <button
            type="button"
            onClick={onPrev}
            disabled={isFirstStep}
            className={`flex items-center px-4 py-2 rounded-md font-medium transition-all ${
              isFirstStep
                ? 'bg-brand-yellow-soft text-ink-caption cursor-not-allowed'
                : 'bg-brand-yellow-soft text-ink-paragraph hover:bg-brand-yellow-soft hover:shadow-md'
            }`}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </button>

          <button
            type="submit"
            disabled={!isValid}
            className={`flex items-center px-6 py-2 rounded-md font-medium transition-all ${
              !isValid
                ? 'bg-brand-yellow-soft text-ink-caption cursor-not-allowed'
                : isLastStep
                ? 'bg-gradient-to-r from-brand-gold to-brand-gold text-white hover:from-brand-gold hover:to-brand-gold hover:shadow-md'
                : 'bg-gradient-to-r from-ink to-ink-charcoal text-brand-yellow hover:from-ink-charcoal hover:to-ink hover:shadow-md'
            }`}
          >
            {isLastStep ? 'Submit Form' : 'Next Step'}
            {!isLastStep && <ChevronRight className="w-4 h-4 ml-1" />}
          </button>
        </div>
      </form>
    </div>
  );
};