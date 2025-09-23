// import React, { useState, useCallback } from 'react';
// import { FormStep } from '../FormStep';
// import { FormInput } from '../FormInput';
// import { StepProps } from '../../types/form';
// import { Building2, Calendar, User, Phone, Mail, Globe } from 'lucide-react';

// // Add debounce utility (you can install lodash or use this simple version)
// const debounce = (func: Function, wait: number) => {
//   let timeout: NodeJS.Timeout;
//   return function executedFunction(...args: any[]) {
//     const later = () => {
//       clearTimeout(timeout);
//       func(...args);
//     };
//     clearTimeout(timeout);
//     timeout = setTimeout(later, wait);
//   };
// };

// const Step1CompanyBasics: React.FC<StepProps> = ({
//   formData,
//   updateFormData,
//   onNext,
//   onPrev,
//   isValid,
// }) => {
//   // Add name validation state
//   const [nameValidation, setNameValidation] = useState<{
//     checking: boolean;
//     available: boolean | null;
//     suggestions: string[];
//     message: string;
//     error?: string;
//   }>({
//     checking: false,
//     available: null,
//     suggestions: [],
//     message: ""
//   });

//   // Company name availability checker
//   const checkCompanyName = useCallback(
//     debounce(async (name: string) => {
//       if (!name || name.length < 3) {
//         setNameValidation(prev => ({ 
//           ...prev, 
//           available: null, 
//           message: "",
//           suggestions: []
//         }));
//         return;
//       }
      
//       setNameValidation(prev => ({ ...prev, checking: true }));
      
//       try {
//         const response = await fetch(
//           `https://14exr8c8g0.execute-api.ap-south-1.amazonaws.com/prod/drafts/check-name?name=${name}`,
//           {
//             method: 'GET',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//           }
//         );
        
//         if (!response.ok) {
//           throw new Error(`HTTP ${response.status}`);
//         }
        
//         const result = await response.json();
        
//         setNameValidation({
//           checking: false,
//           available: result.available,
//           suggestions: result.suggestions || [],
//           message: result.message || "",
//           error: result.error
//         });
        
//       } catch (error: any) {
//         console.error('Name validation error:', error);
//         setNameValidation(prev => ({ 
//           ...prev, 
//           checking: false,
//           available: null, // Don't block on error
//           message: "Unable to verify name availability",
//           error: error.message
//         }));
//       }
//     }, 800), // Wait 800ms after user stops typing
//     []
//   );

//   // Enhanced form validation
//   const isFormValidWithName = isValid && nameValidation.available !== false;

//   return (
//     <FormStep
//       title="Company Basic Details"
//       description="Tell us about your company's basic information"
//       onNext={onNext}
//       onPrev={onPrev}
//       isValid={isFormValidWithName}
//       isFirstStep={true}
//       currentStep={1}
//       totalSteps={6}
//     >
//       <div className="space-y-8">
//         {/* Company Information */}
//         <div className="bg-blue-50 rounded-lg p-6">
//           <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
//             <Building2 className="w-6 h-6 mr-3" />
//             Company Information
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
//             {/* Enhanced Company Name Field */}
//             <div className="relative md:col-span-2">
//               <FormInput
//                 label="Company Name"
//                 value={formData.companyName}
//                 onChange={(value) => {
//                   updateFormData({ companyName: value });
//                   if (value.length >= 3) {
//                     checkCompanyName(value);
//                   } else {
//                     setNameValidation(prev => ({ 
//                       ...prev, 
//                       available: null, 
//                       message: "",
//                       suggestions: []
//                     }));
//                   }
//                 }}
//                 required
//                 placeholder="Enter your company name"
//               />
              
//               {/* Real-time validation feedback */}
//               {nameValidation.checking && (
//                 <div className="text-blue-600 text-sm mt-2 flex items-center">
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
//                   Checking availability...
//                 </div>
//               )}

//               {nameValidation.available === true && (
//                 <div className="text-green-600 text-sm mt-2 flex items-center">
//                   <span className="w-4 h-4 rounded-full bg-green-500 text-white text-xs flex items-center justify-center mr-2">✓</span>
//                   Available! Great choice.
//                 </div>
//               )}

//               {nameValidation.available === false && (
//                 <div className="mt-3 p-4 bg-red-50 border border-red-200 rounded-lg">
//                   <p className="text-red-700 text-sm font-medium mb-3">
//                     {nameValidation.message}
//                   </p>
                  
//                   {nameValidation.suggestions.length > 0 && (
//                     <div>
//                       <p className="text-sm text-red-600 mb-2 font-medium">
//                         Try these alternatives:
//                       </p>
//                       <div className="flex flex-wrap gap-2">
//                         {nameValidation.suggestions.map((suggestion, index) => (
//                           <button
//                             key={index}
//                             type="button"
//                             onClick={() => {
//                               updateFormData({ companyName: suggestion });
//                               checkCompanyName(suggestion);
//                             }}
//                             className="px-3 py-1.5 bg-white border border-red-300 hover:bg-red-50 text-red-700 rounded-md text-sm transition-colors hover:border-red-400"
//                           >
//                             {suggestion}
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {nameValidation.error && nameValidation.available === null && (
//                 <div className="text-amber-600 text-sm mt-2">
//                   ⚠ {nameValidation.message} - You can continue, but the name may not be unique.
//                 </div>
//               )}
//             </div>

//             <FormInput
//               label="Year Established"
//               type="number"
//               value={formData.yearEstablished}
//               onChange={(value) => updateFormData({ yearEstablished: parseInt(value) || new Date().getFullYear() })}
//               required
//               placeholder="YYYY"
//             />
//             <FormInput
//               label="Website URL"
//               type="url"
//               value={formData.websiteUrl}
//               onChange={(value) => updateFormData({ websiteUrl: value })}
//               required
//               placeholder="https://www.yourcompany.com"
//             />
//             <FormInput
//               label="Promotional Code"
//               value={formData.promoCode}
//               onChange={(value) => updateFormData({ promoCode: value })}
//               required
//               placeholder="Enter promotional code"
//             />
//           </div>
//         </div>

//         {/* Rest of your existing form sections remain unchanged */}
//         {/* Director Information */}
//         <div className="bg-green-50 rounded-lg p-6">
//           {/* ... existing director fields ... */}
//         </div>

//         {/* Alternative Contact */}
//         <div className="bg-purple-50 rounded-lg p-6">
//           {/* ... existing contact fields ... */}
//         </div>

//         {/* Address Information */}
//         <div className="bg-orange-50 rounded-lg p-6">
//           {/* ... existing address fields ... */}
//         </div>

//         {/* Optional Information */}
//         <div className="bg-slate-50 rounded-lg p-6">
//           {/* ... existing optional fields ... */}
//         </div>
//       </div>
//     </FormStep>
//   );
// };

// export default Step1CompanyBasics;