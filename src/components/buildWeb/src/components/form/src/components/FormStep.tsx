// FormStep.tsx - Updated with skip button
import React from 'react';
import { ChevronLeft, ChevronRight, SkipForward } from 'lucide-react';
import { motion } from "motion/react";

interface FormStepProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  onNext?: () => void;
  onPrev?: () => void;
  onSkip?: () => void; // New skip handler
  onStepClick?: (step: number) => void;
  isValid?: boolean;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  showSkip?: boolean; // New prop to control skip button visibility
  currentStep: number;
  totalSteps?: number;
}

export const FormStep: React.FC<FormStepProps> = ({
  title,
  description,
  children,
  onNext,
  onPrev,
  onSkip, // New prop
  onStepClick,
  isValid = true,
  isFirstStep = false,
  isLastStep = false,
  showSkip = false, // Default to false
  currentStep,
  totalSteps = 6,
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100">
      {/* Header - unchanged */}
      <div className="bg-gradient-to-r from-yellow-400 to-amber-400 shadow-lg border-b border-amber-300">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-black">DroneTV</h1>
              <p className="text-sm text-gray-800">AI-Powered Website Generator</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-700">Drone • AI • GIS</p>
              <p className="text-xs text-gray-600">One form, instant website</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar - unchanged */}
      <div className="bg-yellow-100 shadow-sm border-b border-amber-200">
        <div className="max-w-4xl mx-auto px-6 py-3">
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
                        ? 'bg-black text-yellow-400 shadow-md'
                        : isCompleted
                        ? 'bg-amber-200 text-amber-900 hover:bg-amber-300 cursor-pointer'
                        : 'bg-yellow-200 text-gray-700 hover:bg-yellow-300 cursor-pointer'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs mr-1 ${
                      isActive
                        ? 'bg-yellow-400 text-black'
                        : isCompleted
                        ? 'bg-amber-600 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {isCompleted ? '✓' : stepNumber}
                    </span>
                    {stepTitle}
                  </button>
                  {index < stepTitles.length - 1 && (
                    <div className={`w-4 h-0.5 mx-1 ${
                      isCompleted ? 'bg-amber-400' : 'bg-yellow-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-800">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-gray-600">
              {Math.round((currentStep / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-yellow-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-amber-500 to-yellow-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Page Title */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-black mb-1">{title}</h1>
          {description && (
            <p className="text-sm text-gray-700">{description}</p>
          )}
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-md border border-amber-200 p-4 mb-4">
          {children}
        </div>

        {/* Navigation - Updated with skip button */}
        <div className="flex justify-between items-center bg-white rounded-lg shadow-md border border-amber-200 p-3">
          <button
            onClick={onPrev}
            disabled={isFirstStep}
            className={`flex items-center px-4 py-2 rounded-md font-medium transition-all ${
              isFirstStep
                ? 'bg-yellow-100 text-gray-400 cursor-not-allowed'
                : 'bg-yellow-200 text-gray-700 hover:bg-yellow-300 hover:shadow-md'
            }`}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </button>

          <div className="flex gap-2">
            {/* Skip Button - Only show for steps 2-5 */}
            {showSkip && !isLastStep && (
              <motion.button
               whileInView={{opacity:[0,1] , y:[-5,0]}}
               transition={{duration:0.5,ease:"easeIn"}}
               whileHover={{y:[0,-2]}}
               whileTap={{scale:[1,0.9]}}
                onClick={onSkip}
                className="flex items-center px-4 py-2 rounded-md bg-green-500 text-gray-700 font-medium transition-all hover:bg-gray-300 hover:shadow-md"
              >
                <SkipForward className="w-4 h-4 mr-1" />
                Skip This Step
              </motion.button>
            )}

            {/* Next/Submit Button */}
            <motion.button
           
             whileInView={{opacity:[0,1] , y:[-5,0]}}
               transition={{duration:0.5,ease:"easeIn"}}
               whileHover={{y:[0,-2]}}
               whileTap={{scale:[1,0.9]}}
              onClick={onNext}
              disabled={!isValid}
              className={`flex items-center px-6 py-2 rounded-md font-medium transition-all ${
                !isValid
                  ? 'bg-yellow-100 text-gray-400 cursor-not-allowed'
                  : isLastStep
                  ? 'bg-black text-white hover:bg-amber-700  hover:shadow-md'
                  : 'bg-black text-yellow-400 hover:gt-gray-800  hover:shadow-md'
              }`}
            >
              {isLastStep ? 'Submit Form' : 'Next Step'}
              {!isLastStep && <ChevronRight className="w-4 h-4 ml-1" />}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};