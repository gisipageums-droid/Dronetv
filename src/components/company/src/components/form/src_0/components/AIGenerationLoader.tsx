import React, { useState, useEffect } from 'react';
import { Brain, Sparkles, Globe, Palette, FileText, Zap } from 'lucide-react';

interface AIGenerationLoaderProps {
  onComplete: () => void;
}

export const AIGenerationLoader: React.FC<AIGenerationLoaderProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    { icon: Brain, text: 'Analyzing your business information...', color: 'text-blue-600' },
    { icon: Palette, text: 'Generating color palette and design...', color: 'text-purple-600' },
    { icon: FileText, text: 'Creating website content...', color: 'text-green-600' },
    { icon: Globe, text: 'Building your website structure...', color: 'text-indigo-600' },
    { icon: Sparkles, text: 'Adding final touches and optimizations...', color: 'text-pink-600' },
    { icon: Zap, text: 'Your website is ready!', color: 'text-yellow-600' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 2000);
          return 100;
        }
        // Changed from +2 to +1 to slow down progress
        return prev + 1;
      });
    }, 500); // Increased interval from 300ms to 500ms

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(stepInterval);
          return steps.length - 1;
        }
        return prev + 1;
      });
    }, 8000); // Increased step interval from 2000ms to 8000ms

    return () => {
      clearInterval(interval);
      clearInterval(stepInterval);
    };
  }, [onComplete, steps.length]);

  return (
    <div className="fixed inset-0 bg-indigo-900 flex items-center justify-center z-50">
      <div className="max-w-md w-full mx-4">
        {/* Main Content */}
        <div className="text-center mb-8">
          <div className="relative mb-6">
            <div className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
              <Brain className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
              <Sparkles className="w-4 h-4 text-yellow-800" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-2">
            AI is Generating Your Website
          </h1>
          <p className="text-blue-200 text-lg">
            Please wait while we create your digital presence
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-blue-200 mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3">
            <div
              className="bg-blue-500  h-3 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Current Step */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            
            return (
              <div
                key={index}
                className={`flex items-center p-4 rounded-lg transition-all duration-500 ${
                  isActive
                    ? 'bg-white/10 border border-white/20 scale-105'
                    : isCompleted
                    ? 'bg-green-500/10 border border-green-500/20'
                    : 'bg-slate-800/50 border border-slate-700'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse'
                      : isCompleted
                      ? 'bg-green-500'
                      : 'bg-slate-600'
                  }`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span
                  className={`font-medium transition-all duration-300 ${
                    isActive
                      ? 'text-white'
                      : isCompleted
                      ? 'text-green-300'
                      : 'text-slate-400'
                  }`}
                >
                  {step.text}
                </span>
                {isActive && (
                  <div className="ml-auto">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
                {isCompleted && (
                  <div className="ml-auto">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-slate-400 text-sm">
            This usually takes 40-60 seconds {/* Updated from 30-60 to 40-60 */}
          </p>
        </div>
      </div>
    </div>
  );
};