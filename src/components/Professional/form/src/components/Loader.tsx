import { Brain, FileText, Globe, Palette, Sparkles, Zap } from "lucide-react";
import React, { useEffect, useState } from "react";

interface LoaderProps {
  onComplete?: () => void; // callback after loader completes
  duration?: number; // total duration in ms, default 70s
}

export const Loader: React.FC<LoaderProps> = ({
  onComplete,
  duration = 70000, // <-- increased from 30000 to 70000 (70 seconds)
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    { icon: Brain, text: "Analyzing your business information..." },
    { icon: Palette, text: "Generating color palette and design..." },
    { icon: FileText, text: "Creating website content..." },
    { icon: Globe, text: "Building your website structure..." },
    { icon: Sparkles, text: "Adding final touches and optimizations..." },
    { icon: Zap, text: "Your website is ready!" },
  ];

  useEffect(() => {
    const totalSteps = steps.length;
    const stepDuration = duration / totalSteps; // time per step
    const progressInterval = 100; // update progress every 100ms
    const totalTicks = duration / progressInterval;
    let tick = 0;

    const progressTimer = setInterval(() => {
      tick += 1;
      setProgress(Math.min(100, (tick / totalTicks) * 100));
    }, progressInterval);

    const stepTimer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(stepTimer);
          return steps.length - 1;
        }
        return prev + 1;
      });
    }, stepDuration);

    const completeTimer = setTimeout(() => {
      clearInterval(progressTimer);
      clearInterval(stepTimer);
      if (onComplete) onComplete();
    }, duration);

    return () => {
      clearInterval(progressTimer);
      clearInterval(stepTimer);
      clearTimeout(completeTimer);
    };
  }, [duration, onComplete, steps.length]);

  return (
    <div className="fixed inset-0 bg-ink flex items-center justify-center z-50 overflow-y-auto py-8">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <div className="relative mb-6">
            <div className="w-24 h-24 mx-auto bg-gradient-to-r from-brand-gold to-brand-yellow rounded-full flex items-center justify-center animate-pulse">
              <Brain className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-brand-yellow rounded-full flex items-center justify-center animate-bounce">
              <Sparkles className="w-4 h-4 text-brand-gold" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            AI is Generating Your Website
          </h1>
          <p className="text-ink-light text-lg">
            Please wait while we create your digital presence
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-ink-light mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-ink-paragraph rounded-full h-3">
            <div
              className="bg-brand-gold h-3 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;

            return (
              <div
                key={index}
                className={`flex items-center p-4 rounded-lg transition-all duration-500 ${isActive
                  ? "bg-white/10 border border-white/20 scale-105"
                  : isCompleted
                    ? "bg-status-success/10 border border-status-success/20"
                    : "bg-ink-charcoal/50 border border-ink-paragraph"
                  }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 transition-all duration-300 ${isActive
                    ? "bg-gradient-to-r from-brand-gold to-brand-yellow animate-pulse"
                    : isCompleted
                      ? "bg-status-success"
                      : "bg-ink-paragraph"
                    }`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span
                  className={`font-medium transition-all duration-300 ${isActive
                    ? "text-white"
                    : isCompleted
                      ? "text-status-success"
                      : "text-ink-caption"
                    }`}
                >
                  {step.text}
                </span>
                {isActive && (
                  <div className="ml-auto flex space-x-1">
                    <div className="w-2 h-2 bg-brand-gold rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-brand-gold rounded-full animate-bounce delay-150" />
                    <div className="w-2 h-2 bg-brand-gold rounded-full animate-bounce delay-300" />
                  </div>
                )}
                {isCompleted && (
                  <div className="ml-auto">
                    <div className="w-6 h-6 bg-status-success rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
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
          <p className="text-ink-caption text-sm">
            This usually takes ~70 seconds
          </p>
        </div>
      </div>
    </div>
  );
};
