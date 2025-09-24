


// import { Brain, FileText, Globe, Palette, Sparkles, Zap } from "lucide-react";
// import React, { useEffect, useState } from "react";

// interface LoaderProps {
//   onComplete?: () => void; // callback after loader completes
//   duration?: number; // total duration in ms, default 30s
// }

// export const Loader: React.FC<LoaderProps> = ({
//   onComplete,
//   duration = 30000,

// }) => {
//   const [currentStep, setCurrentStep] = useState(0);
//   const [progress, setProgress] = useState(0);

//   const steps = [
//     { icon: Brain, text: "Analyzing your business information..." },
//     { icon: Palette, text: "Generating color palette and design..." },
//     { icon: FileText, text: "Creating website content..." },
//     { icon: Globe, text: "Building your website structure..." },
//     { icon: Sparkles, text: "Adding final touches and optimizations..." },
//     { icon: Zap, text: "Your website is ready!" },
//   ];
//  console.log({onComplete})
//   useEffect(() => {
//     const totalSteps = steps.length;
//     const stepDuration = duration / totalSteps; // time per step
//     const progressInterval = 100; // update progress every 100ms
//     const totalTicks = duration / progressInterval;
//     let tick = 0;

//     const progressTimer = setInterval(() => {
//       tick += 1;
//       setProgress(Math.min(100, (tick / totalTicks) * 100));
//     }, progressInterval);

//     const stepTimer = setInterval(() => {
//       setCurrentStep((prev) => {
//         if (prev >= steps.length - 1) {
//           clearInterval(stepTimer);
//           return steps.length - 1;
//         }
//         return prev + 1;
//       });
//     }, stepDuration);

//     const completeTimer = setTimeout(() => {
//       clearInterval(progressTimer);
//       clearInterval(stepTimer);
//       if (onComplete) onComplete();
//     }, duration);

//     return () => {
//       clearInterval(progressTimer);
//       clearInterval(stepTimer);
//       clearTimeout(completeTimer);
//     };
//   }, [duration, onComplete, steps.length]);

//   return (
//     <div className="fixed inset-0 bg-indigo-900 flex items-center justify-center z-50">
//       <div className="max-w-md w-full mx-4">
//         <div className="text-center mb-8">
//           <div className="relative mb-6">
//             <div className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
//               <Brain className="w-12 h-12 text-white" />
//             </div>
//             <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
//               <Sparkles className="w-4 h-4 text-yellow-800" />
//             </div>
//           </div>
//           <h1 className="text-3xl font-bold text-white mb-2">
//             AI is Generating Your Website
//           </h1>
//           <p className="text-blue-200 text-lg">
//             Please wait while we create your digital presence
//           </p>
//         </div>

//         {/* Progress Bar */}
//         <div className="mb-8">
//           <div className="flex justify-between text-sm text-blue-200 mb-2">
//             <span>Progress</span>
//             <span>{Math.round(progress)}%</span>
//           </div>
//           <div className="w-full bg-slate-700 rounded-full h-3">
//             <div
//               className="bg-blue-500 h-3 rounded-full transition-all duration-300 ease-out"
//               style={{ width: `${progress}%` }}
//             />
//           </div>
//         </div>

//         {/* Steps */}
//         <div className="space-y-4">
//           {steps.map((step, index) => {
//             const Icon = step.icon;
//             const isActive = index === currentStep;
//             const isCompleted = index < currentStep;

//             return (
//               <div
//                 key={index}
//                 className={`flex items-center p-4 rounded-lg transition-all duration-500 ${
//                   isActive
//                     ? "bg-white/10 border border-white/20 scale-105"
//                     : isCompleted
//                     ? "bg-green-500/10 border border-green-500/20"
//                     : "bg-slate-800/50 border border-slate-700"
//                 }`}
//               >
//                 <div
//                   className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 transition-all duration-300 ${
//                     isActive
//                       ? "bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse"
//                       : isCompleted
//                       ? "bg-green-500"
//                       : "bg-slate-600"
//                   }`}
//                 >
//                   <Icon className="w-5 h-5 text-white" />
//                 </div>
//                 <span
//                   className={`font-medium transition-all duration-300 ${
//                     isActive
//                       ? "text-white"
//                       : isCompleted
//                       ? "text-green-300"
//                       : "text-slate-400"
//                   }`}
//                 >
//                   {step.text}
//                 </span>
//                 {isActive && (
//                   <div className="ml-auto flex space-x-1">
//                     <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
//                     <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150" />
//                     <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-300" />
//                   </div>
//                 )}
//                 {isCompleted && (
//                   <div className="ml-auto">
//                     <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
//                       <svg
//                         className="w-4 h-4 text-white"
//                         fill="currentColor"
//                         viewBox="0 0 20 20"
//                       >
//                         <path
//                           fillRule="evenodd"
//                           d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>

//         {/* Footer */}
//         <div className="text-center mt-8">
//           <p className="text-slate-400 text-sm">
//             This usually takes ~30 seconds
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };
