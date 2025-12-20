// import React, { useState, useRef, useEffect } from "react";
// import { StepProps } from "../../types/form";
// import { Building2, User, Phone, Globe, X, Mail, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
// import { FormInput } from "../FormInput";
// import { PhoneInput } from "../PhoneInput";
// import { CountryStateSelect } from "../CountryStateSelect";
// import { FormStep } from "../FormStep";
// import { useUserAuth } from "../../../../../../../context/context";
// import axios from "axios";
// import "./step1.css";

// interface Step1CompanyCategoryProps extends StepProps {
//   checkCompanyName: (name: string) => void;
//   companyNameStatus: {
//     available: boolean;
//     suggestions?: string[];
//     message: string;
//   } | null;
//   isCheckingName: boolean;
// }

// // Custom Date Picker Component
// interface ScrollColumnProps {
//   items: Array<{ value: string; label: string }>;
//   selectedValue: string;
//   onSelect: (value: string) => void;
//   setIsScrolling: (isScrolling: boolean) => void; // Added prop
// }

// const ScrollColumn = React.forwardRef<HTMLDivElement, ScrollColumnProps>(
//   ({ items, selectedValue, onSelect, setIsScrolling }, ref) => {
//     const handleClick = (value: string) => {
//       // Vital Fix: Tell parent we are done scrolling so it can auto-center
//       setIsScrolling(false);
//       onSelect(value);
//     };

//     return (
//       <div
//         ref={ref}
//         className="flex-1 h-32 overflow-y-auto scrollbar-hide snap-y snap-mandatory"
//         style={{
//           scrollBehavior: "smooth",
//           WebkitOverflowScrolling: "touch",
//         }}
//       >
//         {/* Top padding */}
//         <div className="h-12"></div>

//         {items.map((item) => (
//           <div
//             key={item.value}
//             data-value={item.value}
//             className={`h-12 flex items-center justify-center snap-center transition-all duration-200 cursor-pointer
//               ${
//                 selectedValue === item.value
//                   ? "text-amber-600 font-bold text-lg scale-105 rounded-lg mx-1"
//                   : "text-gray-500 hover:text-gray-700"
//               }`}
//             onClick={() => handleClick(item.value)}
//           >
//             {item.label}
//           </div>
//         ))}

//         {/* Bottom padding */}
//         <div className="h-12"></div>
//       </div>
//     );
//   }
// );

// ScrollColumn.displayName = "ScrollColumn";

// // --- Main Component ---

// const ScrollDatePicker: React.FC<{
//   value: string;
//   onChange: (date: string) => void;
// }> = ({ value, onChange }) => {
//   // Parse the initial value or use current date as default
//   const parseDate = (dateStr: string) => {
//     if (!dateStr) {
//       const now = new Date();
//       return {
//         day: now.getDate().toString().padStart(2, "0"),
//         month: (now.getMonth() + 1).toString().padStart(2, "0"),
//         year: now.getFullYear().toString(),
//       };
//     }

//     try {
//       const [year, month, day] = dateStr.split("-");
//       return {
//         day: day || new Date().getDate().toString().padStart(2, "0"),
//         month: month || (new Date().getMonth() + 1).toString().padStart(2, "0"),
//         year: year || new Date().getFullYear().toString(),
//       };
//     } catch (error) {
//       const now = new Date();
//       return {
//         day: now.getDate().toString().padStart(2, "0"),
//         month: (now.getMonth() + 1).toString().padStart(2, "0"),
//         year: now.getFullYear().toString(),
//       };
//     }
//   };

//   const [selectedDate, setSelectedDate] = useState(() => parseDate(value));
//   const [isScrolling, setIsScrolling] = useState(false);

//   const days = Array.from({ length: 31 }, (_, i) =>
//     (i + 1).toString().padStart(2, "0")
//   );
//   const months = [
//     { name: "January", value: "01" },
//     { name: "February", value: "02" },
//     { name: "March", value: "03" },
//     { name: "April", value: "04" },
//     { name: "May", value: "05" },
//     { name: "June", value: "06" },
//     { name: "July", value: "07" },
//     { name: "August", value: "08" },
//     { name: "September", value: "09" },
//     { name: "October", value: "10" },
//     { name: "November", value: "11" },
//     { name: "December", value: "12" },
//   ];

//   const currentYear = new Date().getFullYear();
//   const years = Array.from({ length: 100 }, (_, i) =>
//     (currentYear - i).toString()
//   );

//   const dayRef = useRef<HTMLDivElement>(null);
//   const monthRef = useRef<HTMLDivElement>(null);
//   const yearRef = useRef<HTMLDivElement>(null);

//   const handleDateChange = (
//     type: "day" | "month" | "year",
//     newValue: string
//   ) => {
//     const newDate = {
//       ...selectedDate,
//       [type]: newValue,
//     };

//     // Validate the date (especially for February and leap years)
//     const day = parseInt(newDate.day);
//     const month = parseInt(newDate.month);
//     const year = parseInt(newDate.year);

//     let validatedDay = newDate.day;

//     // Check if the selected day is valid for the selected month and year
//     if (type !== "day") {
//       const daysInMonth = new Date(year, month, 0).getDate();
//       if (day > daysInMonth) {
//         validatedDay = daysInMonth.toString().padStart(2, "0");
//       }
//     }

//     const finalDate = {
//       ...newDate,
//       day: validatedDay,
//     };

//     setSelectedDate(finalDate);

//     // Format date as YYYY-MM-DD
//     const dateString = `${finalDate.year}-${finalDate.month}-${finalDate.day}`;
//     onChange(dateString);
//   };

//   // --- FIX 2: Dependency Array Logic ---
//   useEffect(() => {
//     if (isScrolling) return;

//     const scrollToSelected = (
//       container: HTMLDivElement | null,
//       selectedValue: string
//     ) => {
//       if (!container) return;

//       setTimeout(() => {
//         const selectedElement = container.querySelector(
//           `[data-value="${selectedValue}"]`
//         );
//         if (selectedElement) {
//           const containerHeight = container.clientHeight;
//           const elementTop = (selectedElement as HTMLElement).offsetTop;
//           const elementHeight = (selectedElement as HTMLElement).clientHeight;
//           container.scrollTo({
//             top: elementTop - (containerHeight - elementHeight) / 2,
//             behavior: "smooth",
//           });
//         }
//       }, 100);
//     };

//     scrollToSelected(dayRef.current, selectedDate.day);
//     scrollToSelected(monthRef.current, selectedDate.month);
//     scrollToSelected(yearRef.current, selectedDate.year);

//     // REMOVED 'isScrolling' from this dependency array
//   }, [selectedDate.day, selectedDate.month, selectedDate.year]);

//   // Update when value prop changes from parent
//   useEffect(() => {
//     if (value && !isScrolling) {
//       const parsed = parseDate(value);
//       // Only update if actually different to prevent loops
//       if (
//         parsed.day !== selectedDate.day ||
//         parsed.month !== selectedDate.month ||
//         parsed.year !== selectedDate.year
//       ) {
//         setSelectedDate(parsed);
//       }
//     }
//   }, [value, isScrolling]);

//   // Handle scroll events to prevent reset during user interaction
//   useEffect(() => {
//     const containers = [dayRef.current, monthRef.current, yearRef.current];

//     const handleScrollStart = () => {
//       setIsScrolling(true);
//     };

//     const handleScrollEnd = () => {
//       setTimeout(() => {
//         setIsScrolling(false);
//       }, 150);
//     };

//     containers.forEach((container) => {
//       if (container) {
//         container.addEventListener("scroll", handleScrollStart);
//         container.addEventListener("scrollend", handleScrollEnd);
//         container.addEventListener("touchmove", handleScrollStart);
//         container.addEventListener("touchend", handleScrollEnd);
//       }
//     });

//     return () => {
//       containers.forEach((container) => {
//         if (container) {
//           container.removeEventListener("scroll", handleScrollStart);
//           container.removeEventListener("scrollend", handleScrollEnd);
//           container.removeEventListener("touchmove", handleScrollStart);
//           container.removeEventListener("touchend", handleScrollEnd);
//         }
//       });
//     };
//   }, []);

//   return (
//     <div className="bg-white border border-amber-200 rounded-xl p-4 date-picker-card animate-fade-in-up">
//       <div className="text-center mb-4">
//         <h3 className="font-semibold text-gray-800">Date of Incorporation</h3>
//         <p className="text-xs text-gray-600 mt-1">
//           Select your company's incorporation date
//         </p>
//       </div>

//       {/* Date Picker */}
//       <div className="flex items-center justify-between mb-2 px-4">
//         <div className="flex-1 text-center">
//           <span className="text-xs font-medium text-gray-500">DAY</span>
//         </div>
//         <div className="flex-1 text-center">
//           <span className="text-xs font-medium text-gray-500">MONTH</span>
//         </div>
//         <div className="flex-1 text-center">
//           <span className="text-xs font-medium text-gray-500">YEAR</span>
//         </div>
//       </div>

//       <div className="relative">
//         {/* Selection Highlight */}
//         <div className="absolute left-0 right-0 top-20 transform -translate-y-1/2 h-8 bg-amber-100 border-2 border-amber-300 rounded-lg pointer-events-none date-picker-highlight"></div>

//         <div className="flex items-stretch h-32 relative z-10">
//           {/* Day Column */}
//           <ScrollColumn
//             ref={dayRef}
//             items={days.map((day) => ({
//               value: day,
//               label: parseInt(day).toString(),
//             }))}
//             selectedValue={selectedDate.day}
//             onSelect={(value) => handleDateChange("day", value)}
//             setIsScrolling={setIsScrolling}
//           />

//           {/* Month Column */}
//           <ScrollColumn
//             ref={monthRef}
//             items={months.map((month) => ({
//               value: month.value,
//               label: month.name.substring(0, 3),
//             }))}
//             selectedValue={selectedDate.month}
//             onSelect={(value) => handleDateChange("month", value)}
//             setIsScrolling={setIsScrolling}
//           />

//           {/* Year Column */}
//           <ScrollColumn
//             ref={yearRef}
//             items={years.map((year) => ({ value: year, label: year }))}
//             selectedValue={selectedDate.year}
//             onSelect={(value) => handleDateChange("year", value)}
//             setIsScrolling={setIsScrolling}
//           />
//         </div>
//       </div>

//       {/* Selected Date Display */}
//       <div className="text-center mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
//         <p className="text-sm text-gray-600">Selected Date</p>
//         <p className="font-semibold text-amber-700">
//           {parseInt(selectedDate.day)}{" "}
//           {months.find((m) => m.value === selectedDate.month)?.name}{" "}
//           {selectedDate.year}
//         </p>
//       </div>
//     </div>
//   );
// };
// const Step1CompanyCategory: React.FC<Step1CompanyCategoryProps> = ({
//   formData,
//   updateFormData,
//   onNext,
//   onPrev,
//   isValid,
//   checkCompanyName,
//   companyNameStatus,
//   isCheckingName,
// }) => {
//   const categoryOptions = [
//     {
//       value: "Drone",
//       description: "UAV manufacturing, services, and training",
//     },
//     {
//       value: "AI",
//       description: "Artificial intelligence solutions and products",
//     },
//     {
//       value: "GIS",
//       description: "Geographic Information Systems and GNSS/GPS/DGPS",
//     },
//   ];

//   // State for email verification modal
//   const { isLogin, setAccountEmail } = useUserAuth();
//   const [showEmailModal, setShowEmailModal] = useState(!isLogin);
//   const [checkingEmail, setCheckingEmail] = useState(false);
//   const [emailCheckResult, setEmailCheckResult] = useState<{
//     exists: boolean;
//     message: string;
//   } | null>(null);
//   const [tempDirectorEmail, setTempDirectorEmail] = useState(formData.directorEmail || "");
//   const [emailFieldTouched, setEmailFieldTouched] = useState(false);

//   const handleCategoryChange = (selected: string[]) => {
//     updateFormData({ companyCategory: selected });
//   };

//   // Function to check if email exists
//   const checkEmailExists = async (email: string) => {
//     if (!email) return;

//     setCheckingEmail(true);
//     setEmailCheckResult(null);

//     try {
//       const response = await axios.post(
//         "https://eqzkmjhfbc.execute-api.ap-south-1.amazonaws.com/dev1/",
//         { email }
//       );

//       const emailExists = response.data.exists;

//       setEmailCheckResult({
//         exists: emailExists,
//         message: response.data.message,
//       });

//       if (emailExists) {
//         setAccountEmail(email);
//         setTimeout(() => {
//           setShowEmailModal(false);
//           setEmailCheckResult(null);
//         }, 1500);
//       }
//     } catch (error) {
//       console.error("Error checking email:", error);
//       setEmailCheckResult({
//         exists: false,
//         message: "Error checking email. Please try again.",
//       });
//     } finally {
//       setCheckingEmail(false);
//     }
//   };

//   // Function to handle director email change in main form
//   const handleDirectorEmailChange = (value: string) => {
//     updateFormData({ directorEmail: value });
//     setTempDirectorEmail(value);
//   };

//   // Function to handle focus on director email field
//   const handleDirectorEmailFocus = () => {
//     if (!isLogin && !emailFieldTouched) {
//       setTempDirectorEmail(formData.directorEmail || "");
//       setShowEmailModal(true);
//       setEmailFieldTouched(true);
//     }
//   };

//   // Function to handle modal submission
//   const handleModalSubmit = () => {
//     if (tempDirectorEmail) {
//       checkEmailExists(tempDirectorEmail);
//     }
//   };

//   // Function to close modal when email doesn't exist
//   const handleModalClose = () => {
//     setShowEmailModal(false);
//     setEmailCheckResult(null);
//   };

//   // Function to handle modal input change
//   const handleModalEmailChange = (value: string) => {
//     setTempDirectorEmail(value);
//     updateFormData({ directorEmail: value });
//   };

//   // Handle date change from the custom picker
//   const handleDateChange = (date: string) => {
//     updateFormData({ yearEstablished: date });
//   };

//   React.useEffect(() => {
//     console.log("Form data updated:", formData);
//   }, [formData]);

//   return (
//     <>
//       <FormStep
//         title="Company Information"
//         description="Select your company category and provide basic details"
//         onNext={onNext}
//         onPrev={onPrev}
//         isValid={isValid}
//         isFirstStep={true}
//         currentStep={1}
//         totalSteps={6}
//       >
//         <div className="space-y-6">
//           {/* Company Category */}
//           <div>
//             <h2 className="mb-2 text-lg font-bold text-slate-900">
//               Company Category
//             </h2>
//             <p className="mb-4 text-sm text-slate-600">
//               Select your company's main business category (you can select multiple)
//             </p>

//             <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
//               {categoryOptions.map(({ value, description }) => (
//                 <label
//                   key={value}
//                   className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
//                     formData.companyCategory.includes(value)
//                       ? "border-amber-500 bg-yellow-50 shadow-md"
//                       : "border-amber-300 hover:border-amber-400"
//                   }`}
//                 >
//                   <input
//                     type="checkbox"
//                     checked={formData.companyCategory.includes(value)}
//                     onChange={(e) => {
//                       if (e.target.checked) {
//                         handleCategoryChange([...formData.companyCategory, value]);
//                       } else {
//                         handleCategoryChange(formData.companyCategory.filter((cat) => cat !== value));
//                       }
//                     }}
//                     className="sr-only"
//                   />
//                   <h3 className={`text-lg font-bold mb-2 ${
//                     formData.companyCategory.includes(value) ? "text-amber-900" : "text-gray-700"
//                   }`}>
//                     {value}
//                   </h3>
//                   <p className={`text-xs text-center ${
//                     formData.companyCategory.includes(value) ? "text-amber-700" : "text-gray-500"
//                   }`}>
//                     {description}
//                   </p>
//                 </label>
//               ))}
//             </div>

//             {formData.companyCategory.length === 0 && (
//               <div className="py-4 text-center">
//                 <p className="text-gray-500">Please select at least one category to continue</p>
//               </div>
//             )}
//           </div>

//           {/* Company Basic Details */}
//           <div>
//             <h2 className="mb-2 text-lg font-bold text-slate-900">
//               Company Basic Details
//             </h2>
//             <p className="mb-4 text-sm text-slate-600">
//               Tell us about your company's basic information
//             </p>

//             <div className="space-y-4">
//               {/* Director Information */}
//               <div className="p-3 bg-yellow-100 border rounded-lg border-amber-200">
//                 <h3 className="flex items-center mb-2 text-sm font-bold text-amber-900">
//                   <User className="w-5 h-5 mr-2" />
//                   Director/MD Information
//                 </h3>
//                 <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
//                   <FormInput
//                     label="Director Name"
//                     value={formData.directorName}
//                     onChange={(value) => updateFormData({ directorName: value })}
//                     required
//                     placeholder="Full name"
//                   />
//                   <PhoneInput
//                     label="Director Phone"
//                     value={formData.directorPhone}
//                     onChange={(value) => updateFormData({ directorPhone: value })}
//                     required
//                     placeholder="Enter phone number"
//                   />

//                   <div className="md:col-span-2">
//                     <FormInput
//                       label="Director Email"
//                       type="email"
//                       value={formData.directorEmail}
//                       onChange={handleDirectorEmailChange}
//                       onFocus={handleDirectorEmailFocus}
//                       required
//                       placeholder="director@company.com"
//                     />
//                     {!isLogin && (
//                       <p className="mt-1 text-xs text-blue-600">
//                         Note: We'll verify this email to ensure it's not already registered
//                       </p>
//                     )}
//                   </div>

//                   <FormInput
//                     label="Director LinkedIn"
//                     type="url"
//                     value={formData.directorLinkedin || ""}
//                     onChange={(value) => updateFormData({ directorLinkedin: value })}
//                     placeholder="https://linkedin.com/in/username"
//                   />

//                   <FormInput
//                     label="Director Twitter"
//                     type="url"
//                     value={formData.directorTwitter || ""}
//                     onChange={(value) => updateFormData({ directorTwitter: value })}
//                     placeholder="https://twitter.com/username"
//                   />
//                 </div>
//               </div>

//               {/* Company Information */}
//               <div className="p-3 border rounded-lg bg-yellow-50 border-amber-200">
//                 <h3 className="flex items-center mb-2 text-sm font-bold text-amber-900">
//                   <Building2 className="w-5 h-5 mr-2" />
//                   Company Information
//                 </h3>
//                 <div className="relative grid grid-cols-1 gap-4 md:grid-cols-2">
//                   <FormInput
//                     label="Company Name"
//                     value={formData.companyName}
//                     onChange={(value) => {
//                       updateFormData({ companyName: value });
//                       checkCompanyName(value);
//                     }}
//                     required
//                     placeholder="Enter your company name"
//                     error={
//                       companyNameStatus && !companyNameStatus.available
//                         ? companyNameStatus.message
//                         : undefined
//                     }
//                   />
//                   {isCheckingName && (
//                     <div className="text-xs absolute left-[6.3rem] text-blue-600 mt-1">
//                       Checking availability...
//                     </div>
//                   )}
//                   {companyNameStatus && !companyNameStatus.available && companyNameStatus.suggestions && (
//                     <div className="text-xs absolute left-[9rem] top-[3.6rem] text-yellow-700 mt-1">
//                       Suggestions: {companyNameStatus.suggestions.join(", ")}
//                     </div>
//                   )}
//                   {companyNameStatus && companyNameStatus.available && (
//                     <div className="text-xs absolute left-2 top-[3.9rem] text-green-700">
//                       {companyNameStatus.message}
//                     </div>
//                   )}

//                   {/* Custom Date Picker */}
//                   <div className="md:col-span-2">
//                     <ScrollDatePicker
//                       value={formData.yearEstablished}
//                       onChange={handleDateChange}
//                     />
//                   </div>

//                   <FormInput
//                     label="Website URL"
//                     type="url"
//                     value={formData.websiteUrl}
//                     onChange={(value) => {
//                       let url = value.trim();
//                       if (url && !url.match(/^https:\/\/www\./i)) {
//                         url = `https://www.${url.replace(/^(https?:\/\/)?(www\.)?/i, '')}`;
//                       }
//                       updateFormData({ websiteUrl: url });
//                     }}
//                     required
//                     placeholder="https://www.yourcompany.com"
//                   />
//                   <FormInput
//                     label="Promotional Code"
//                     value={formData.promoCode}
//                     onChange={(value) => updateFormData({ promoCode: value })}
//                     placeholder="Enter promotional code"
//                   />
//                 </div>
//               </div>

//               {/* Legal Information */}
//               <div className="p-3 border rounded-lg bg-amber-50 border-amber-200">
//                 <h3 className="mb-2 text-sm font-bold text-amber-900">
//                   Trade Information (Optional)
//                 </h3>
//                 <div className="space-y-2">
//                   <FormInput
//                     label="Brand Name"
//                     value={formData.legalName || ""}
//                     onChange={(value) => updateFormData({ legalName: value })}
//                     placeholder="If different from brand name"
//                   />

//                   <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
//                     <FormInput
//                       label="GSTIN"
//                       value={formData.gstin || ""}
//                       onChange={(value) => updateFormData({ gstin: value })}
//                       placeholder="GST number"
//                     />
//                   </div>

//                   <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
//                     <FormInput
//                       label="CIN"
//                       value={formData.socialLinks?.cin || ""}
//                       onChange={(value) =>
//                         updateFormData({ socialLinks: { ...formData.socialLinks, cin: value } })
//                       }
//                       placeholder="Corporate Identity Number"
//                     />
//                     <FormInput
//                       label="UDYAM"
//                       value={formData.socialLinks?.udyam || ""}
//                       onChange={(value) =>
//                         updateFormData({ socialLinks: { ...formData.socialLinks, udyam: value } })
//                       }
//                       placeholder="UDYAM Registration Number"
//                     />
//                     <FormInput
//                       label="PAN"
//                       value={formData.socialLinks?.pan || ""}
//                       onChange={(value) =>
//                         updateFormData({ socialLinks: { ...formData.socialLinks, pan: value } })
//                       }
//                       placeholder="PAN Number"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Alternative Contact */}
//               <div className="p-3 border rounded-lg bg-amber-100 border-amber-200">
//                 <h3 className="flex items-center mb-2 text-sm font-bold text-amber-900">
//                   <Phone className="w-5 h-5 mr-2" />
//                   Alternative Contact
//                 </h3>
//                 <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
//                   <FormInput
//                     label="Contact Person Name"
//                     value={formData.altContactName}
//                     onChange={(value) => updateFormData({ altContactName: value })}
//                     required
//                     placeholder="Full name"
//                   />
//                   <PhoneInput
//                     label="Contact Phone"
//                     value={formData.altContactPhone}
//                     onChange={(value) => updateFormData({ altContactPhone: value })}
//                     required
//                     placeholder="Enter phone number"
//                   />
//                   <div className="md:col-span-2">
//                     <FormInput
//                       label="Contact Email"
//                       type="email"
//                       value={formData.altContactEmail}
//                       onChange={(value) => updateFormData({ altContactEmail: value })}
//                       required
//                       placeholder="contact@company.com"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Address Information */}
//               <div className="p-3 bg-yellow-200 border rounded-lg border-amber-200">
//                 <h3 className="flex items-center mb-2 text-sm font-bold text-amber-900">
//                   <Globe className="w-5 h-5 mr-2" />
//                   Address Information
//                 </h3>
//                 <div className="space-y-2">
//                   <FormInput
//                     label="Office Address"
//                     type="textarea"
//                     value={formData.officeAddress}
//                     onChange={(value) => updateFormData({ officeAddress: value })}
//                     required
//                     placeholder="Complete office address"
//                     rows={2}
//                   />
//                   <div className="grid grid-cols-1 gap-2 w-full md:grid-cols-2 lg:grid-cols-4">
//                     <div className="md:col-span-2">
//                       <CountryStateSelect
//                         countryValue={formData.country}
//                         stateValue={formData.state}
//                         onCountryChange={(value) => updateFormData({ country: value })}
//                         onStateChange={(value) => updateFormData({ state: value })}
//                         countryRequired
//                         stateRequired
//                         countryPlaceholder="Select Country"
//                         statePlaceholder="Select State"
//                       />
//                     </div>
//                     <FormInput
//                       label="City"
//                       value={formData.city}
//                       onChange={(value) => updateFormData({ city: value })}
//                       required
//                       placeholder="City"
//                     />
//                     <FormInput
//                       label="Postal Code"
//                       value={formData.postalCode}
//                       onChange={(value) => updateFormData({ postalCode: value })}
//                       required
//                       placeholder="PIN Code"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Social Media Links */}
//               <div className="p-3 border rounded-lg bg-amber-200 border-amber-200">
//                 <h3 className="flex items-center mb-2 text-sm font-bold text-amber-900">
//                   <Globe className="w-5 h-5 mr-2" />
//                   Social Media Links (Optional)
//                 </h3>
//                 <div className="space-y-2">
//                   <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
//                     <FormInput
//                       label="LinkedIn Profile"
//                       type="url"
//                       value={formData.socialLinks?.linkedin || ""}
//                       onChange={(value) =>
//                         updateFormData({ socialLinks: { ...formData.socialLinks, linkedin: value } })
//                       }
//                       placeholder="https://linkedin.com/company/yourcompany"
//                     />
//                     <FormInput
//                       label="Facebook Page"
//                       type="url"
//                       value={formData.socialLinks?.facebook || ""}
//                       onChange={(value) =>
//                         updateFormData({ socialLinks: { ...formData.socialLinks, facebook: value } })
//                       }
//                       placeholder="https://facebook.com/yourcompany"
//                     />
//                   </div>

//                   <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
//                     <FormInput
//                       label="Instagram Profile"
//                       type="url"
//                       value={formData.socialLinks?.instagram || ""}
//                       onChange={(value) =>
//                         updateFormData({ socialLinks: { ...formData.socialLinks, instagram: value } })
//                       }
//                       placeholder="https://instagram.com/yourcompany"
//                     />
//                     <FormInput
//                       label="Twitter/X Profile"
//                       type="url"
//                       value={formData.socialLinks?.twitter || ""}
//                       onChange={(value) =>
//                         updateFormData({ socialLinks: { ...formData.socialLinks, twitter: value } })
//                       }
//                       placeholder="https://twitter.com/yourcompany"
//                     />
//                   </div>

//                   <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
//                     <FormInput
//                       label="YouTube Channel"
//                       type="url"
//                       value={formData.socialLinks?.youtube || ""}
//                       onChange={(value) =>
//                         updateFormData({ socialLinks: { ...formData.socialLinks, youtube: value } })
//                       }
//                       placeholder="https://youtube.com/@yourcompany"
//                     />
//                     <FormInput
//                       label="Support Email"
//                       type="email"
//                       value={formData.supportEmail || ""}
//                       onChange={(value) => updateFormData({ supportEmail: value })}
//                       placeholder="support@company.com"
//                     />
//                   </div>

//                   <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
//                     <PhoneInput
//                       label="Support Contact Number"
//                       value={formData.supportContactNumber || ""}
//                       onChange={(value) => updateFormData({ supportContactNumber: value })}
//                       placeholder="Enter phone number"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </FormStep>

//       {/* Email Verification Modal */}
//       {showEmailModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
//           <div className="w-full max-w-md p-6 bg-white rounded-lg">
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-center">
//                 <Mail className="w-6 h-6 mr-2 text-blue-600" />
//                 <h3 className="text-lg font-bold capitalize text-slate-900">Verify user Email</h3>
//               </div>
//               <button onClick={handleModalClose} className="transition-colors text-slate-400 hover:text-slate-600">
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             <div className="mb-4">
//               <p className="mb-4 text-sm text-slate-600">
//                 We need to verify if this email is already associated with an existing account.
//                 Please enter the User email to continue.
//               </p>

//               <FormInput
//                 label="User Email"
//                 type="email"
//                 value={tempDirectorEmail}
//                 onChange={handleModalEmailChange}
//                 required
//                 placeholder="user@company.com"
//                 disabled={checkingEmail}
//               />

//               {emailCheckResult && (
//                 <div className={`mt-3 p-3 rounded-lg flex items-start ${
//                   emailCheckResult.exists ? "bg-green-50 border border-green-200" : "bg-blue-50 border border-blue-200"
//                 }`}>
//                   <AlertCircle className={`w-4 h-4 mt-0.5 mr-2 ${
//                     emailCheckResult.exists ? "text-green-600" : "text-blue-600"
//                   }`} />
//                   <div>
//                     <p className={`text-sm font-medium ${
//                       emailCheckResult.exists ? "text-green-800" : "text-blue-800"
//                     }`}>
//                       {emailCheckResult.message}
//                     </p>
//                     {emailCheckResult.exists && (
//                       <p className="mt-1 text-xs text-green-600">
//                         Email verified! This will be used for your existing account.
//                       </p>
//                     )}
//                     {!emailCheckResult.exists && (
//                       <p className="mt-1 text-xs text-blue-600">
//                         This email is not registered. Click Cancel to use this email for a new account.
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>

//             <div className="flex justify-end space-x-3">
//               <button
//                 onClick={handleModalClose}
//                 className="px-4 py-2 font-medium transition-colors text-slate-600 hover:text-slate-800"
//                 disabled={checkingEmail}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleModalSubmit}
//                 disabled={!tempDirectorEmail || checkingEmail}
//                 className="flex items-center px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
//               >
//                 {checkingEmail ? (
//                   <>
//                     <div className="w-4 h-4 mr-2 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
//                     Checking...
//                   </>
//                 ) : (
//                   "Verify Email"
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Step1CompanyCategory;


import React, { useState, useRef, useEffect } from "react";
import { StepProps } from "../../types/form";
import { Building2, User, Phone, Globe, X, Mail, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { FormInput } from "../FormInput";
import { PhoneInput } from "../PhoneInput";
import { CountryStateSelect } from "../CountryStateSelect";
import { FormStep } from "../FormStep";
import { useUserAuth } from "../../../../../../../context/context";
import axios from "axios";
import "./step1.css";

interface Step1CompanyCategoryProps extends StepProps {
  checkCompanyName: (name: string) => void;
  companyNameStatus: {
    available: boolean;
    suggestions?: string[];
    message: string;
  } | null;
  isCheckingName: boolean;
}

// Custom Date Picker Component
interface ScrollColumnProps {
  items: Array<{ value: string; label: string }>;
  selectedValue: string;
  onSelect: (value: string) => void;
  setIsScrolling: (isScrolling: boolean) => void; // Added prop
}

const ScrollColumn = React.forwardRef<HTMLDivElement, ScrollColumnProps>(
  ({ items, selectedValue, onSelect, setIsScrolling }, ref) => {
    const handleClick = (value: string) => {
      // Vital Fix: Tell parent we are done scrolling so it can auto-center
      setIsScrolling(false);
      onSelect(value);
    };

    return (
      <div
        ref={ref}
        className="flex-1 h-32 overflow-y-auto scrollbar-hide snap-y snap-mandatory"
        style={{
          scrollBehavior: "smooth",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* Top padding */}
        <div className="h-12"></div>

        {items.map((item) => (
          <div
            key={item.value}
            data-value={item.value}
            className={`h-12 flex items-center justify-center snap-center transition-all duration-200 cursor-pointer
              ${selectedValue === item.value
                ? "text-amber-600 font-bold text-lg scale-105 rounded-lg mx-1"
                : "text-gray-500 hover:text-gray-700"
              }`}
            onClick={() => handleClick(item.value)}
          >
            {item.label}
          </div>
        ))}

        {/* Bottom padding */}
        <div className="h-12"></div>
      </div>
    );
  }
);

ScrollColumn.displayName = "ScrollColumn";

// --- Main Component ---



const ScrollDatePicker: React.FC<{
  value: string;
  onChange: (date: string) => void;
}> = ({ value, onChange }) => {
  // Parse the initial value or use current date as default
  const parseDate = (dateStr: string) => {
    if (!dateStr) {
      const now = new Date();
      return {
        day: now.getDate().toString().padStart(2, "0"),
        month: (now.getMonth() + 1).toString().padStart(2, "0"),
        year: now.getFullYear().toString(),
      };
    }

    try {
      const [year, month, day] = dateStr.split("-");
      return {
        day: day || new Date().getDate().toString().padStart(2, "0"),
        month: month || (new Date().getMonth() + 1).toString().padStart(2, "0"),
        year: year || new Date().getFullYear().toString(),
      };
    } catch (error) {
      const now = new Date();
      return {
        day: now.getDate().toString().padStart(2, "0"),
        month: (now.getMonth() + 1).toString().padStart(2, "0"),
        year: now.getFullYear().toString(),
      };
    }
  };

  const [selectedDate, setSelectedDate] = useState(() => parseDate(value));
  const [isScrolling, setIsScrolling] = useState(false);

  const days = Array.from({ length: 31 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );
  const months = [
    { name: "January", value: "01" },
    { name: "February", value: "02" },
    { name: "March", value: "03" },
    { name: "April", value: "04" },
    { name: "May", value: "05" },
    { name: "June", value: "06" },
    { name: "July", value: "07" },
    { name: "August", value: "08" },
    { name: "September", value: "09" },
    { name: "October", value: "10" },
    { name: "November", value: "11" },
    { name: "December", value: "12" },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) =>
    (currentYear - i).toString()
  );

  const dayRef = useRef<HTMLDivElement>(null);
  const monthRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);

  const handleDateChange = (
    type: "day" | "month" | "year",
    newValue: string
  ) => {
    const newDate = {
      ...selectedDate,
      [type]: newValue,
    };

    // Validate the date (especially for February and leap years)
    const day = parseInt(newDate.day);
    const month = parseInt(newDate.month);
    const year = parseInt(newDate.year);

    let validatedDay = newDate.day;

    // Check if the selected day is valid for the selected month and year
    if (type !== "day") {
      const daysInMonth = new Date(year, month, 0).getDate();
      if (day > daysInMonth) {
        validatedDay = daysInMonth.toString().padStart(2, "0");
      }
    }

    const finalDate = {
      ...newDate,
      day: validatedDay,
    };

    setSelectedDate(finalDate);

    // Format date as YYYY-MM-DD
    const dateString = `${finalDate.year}-${finalDate.month}-${finalDate.day}`;
    onChange(dateString);
  };

  // --- FIX 2: Dependency Array Logic ---
  useEffect(() => {
    if (isScrolling) return;

    const scrollToSelected = (
      container: HTMLDivElement | null,
      selectedValue: string
    ) => {
      if (!container) return;

      setTimeout(() => {
        const selectedElement = container.querySelector(
          `[data-value="${selectedValue}"]`
        );
        if (selectedElement) {
          const containerHeight = container.clientHeight;
          const elementTop = (selectedElement as HTMLElement).offsetTop;
          const elementHeight = (selectedElement as HTMLElement).clientHeight;
          container.scrollTo({
            top: elementTop - (containerHeight - elementHeight) / 2,
            behavior: "smooth",
          });
        }
      }, 100);
    };

    scrollToSelected(dayRef.current, selectedDate.day);
    scrollToSelected(monthRef.current, selectedDate.month);
    scrollToSelected(yearRef.current, selectedDate.year);

    // REMOVED 'isScrolling' from this dependency array
  }, [selectedDate.day, selectedDate.month, selectedDate.year]);

  // Update when value prop changes from parent
  useEffect(() => {
    if (value && !isScrolling) {
      const parsed = parseDate(value);
      // Only update if actually different to prevent loops
      if (
        parsed.day !== selectedDate.day ||
        parsed.month !== selectedDate.month ||
        parsed.year !== selectedDate.year
      ) {
        setSelectedDate(parsed);
      }
    }
  }, [value, isScrolling]);

  // Handle scroll events to prevent reset during user interaction
  useEffect(() => {
    const containers = [dayRef.current, monthRef.current, yearRef.current];

    const handleScrollStart = () => {
      setIsScrolling(true);
    };

    const handleScrollEnd = () => {
      setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    containers.forEach((container) => {
      if (container) {
        container.addEventListener("scroll", handleScrollStart);
        container.addEventListener("scrollend", handleScrollEnd);
        container.addEventListener("touchmove", handleScrollStart);
        container.addEventListener("touchend", handleScrollEnd);
      }
    });

    return () => {
      containers.forEach((container) => {
        if (container) {
          container.removeEventListener("scroll", handleScrollStart);
          container.removeEventListener("scrollend", handleScrollEnd);
          container.removeEventListener("touchmove", handleScrollStart);
          container.removeEventListener("touchend", handleScrollEnd);
        }
      });
    };
  }, []);

  return (
    <div className="bg-white border border-amber-200 rounded-xl p-4 date-picker-card animate-fade-in-up">
      <div className="text-center mb-4">
        <h3 className="font-semibold text-gray-800">Date of Incorporation</h3>
        <p className="text-xs text-gray-600 mt-1">
          Select your company's incorporation date
        </p>
      </div>

      {/* Date Picker */}
      <div className="flex items-center justify-between mb-2 px-4">
        <div className="flex-1 text-center">
          <span className="text-xs font-medium text-gray-500">DAY</span>
        </div>
        <div className="flex-1 text-center">
          <span className="text-xs font-medium text-gray-500">MONTH</span>
        </div>
        <div className="flex-1 text-center">
          <span className="text-xs font-medium text-gray-500">YEAR</span>
        </div>
      </div>

      <div className="relative">
        {/* Selection Highlight */}
        <div className="absolute left-0 right-0 top-20 transform -translate-y-1/2 h-8 bg-amber-100 border-2 border-amber-300 rounded-lg pointer-events-none date-picker-highlight"></div>

        <div className="flex items-stretch h-32 relative z-10">
          {/* Day Column */}
          <ScrollColumn
            ref={dayRef}
            items={days.map((day) => ({
              value: day,
              label: parseInt(day).toString(),
            }))}
            selectedValue={selectedDate.day}
            onSelect={(value) => handleDateChange("day", value)}
            setIsScrolling={setIsScrolling}
          />

          {/* Month Column */}
          <ScrollColumn
            ref={monthRef}
            items={months.map((month) => ({
              value: month.value,
              label: month.name.substring(0, 3),
            }))}
            selectedValue={selectedDate.month}
            onSelect={(value) => handleDateChange("month", value)}
            setIsScrolling={setIsScrolling}
          />

          {/* Year Column */}
          <ScrollColumn
            ref={yearRef}
            items={years.map((year) => ({ value: year, label: year }))}
            selectedValue={selectedDate.year}
            onSelect={(value) => handleDateChange("year", value)}
            setIsScrolling={setIsScrolling}
          />
        </div>
      </div>

      {/* Selected Date Display */}
      <div className="text-center mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
        <p className="text-sm text-gray-600">Selected Date</p>
        <p className="font-semibold text-amber-700">
          {parseInt(selectedDate.day)}{" "}
          {months.find((m) => m.value === selectedDate.month)?.name}{" "}
          {selectedDate.year}
        </p>
      </div>
    </div>
  );
};

// Custom Name with Title Component - Updated to match FormInput styling
interface NameWithTitleProps {
  label: string;
  titleValue: string;
  nameValue: string;
  onTitleChange: (value: string) => void;
  onNameChange: (value: string) => void;
  required?: boolean;
  namePlaceholder?: string;
}

const NameWithTitle: React.FC<NameWithTitleProps> = ({
  label,
  titleValue,
  nameValue,
  onTitleChange,
  onNameChange,
  required = false,
  namePlaceholder = "Full name"
}) => {
  const genderOptions = [
    { value: "Mr", label: "Mr" },
    { value: "Mrs", label: "Mrs" },
    { value: "Ms", label: "Ms" },
  ];

  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-gray-700">
        {label} {required && "*"}
      </label>
      <div className="flex items-stretch border border-gray-300 rounded-lg hover:border-amber-400 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500 transition-colors">
        {/* Title Dropdown - Styled to match other inputs */}
        <div className="relative flex-shrink-0">
          <select
            value={titleValue || ''}
            onChange={(e) => onTitleChange(e.target.value)}
            className="h-10 pl-3 pr-8 text-sm bg-white border-0 rounded-l-lg focus:outline-none focus:ring-0 appearance-none text-gray-700"
            style={{ minWidth: '80px' }}
          >
            {/* <option value="" className="text-gray-400">Title</option> */}
            {genderOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
          {/* Vertical divider */}

          {/* <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-px h-5 bg-gray-300"></div> */}
          <div className="absolute right-0 top-0 bottom-0 w-px bg-gray-300 group-hover:bg-gray-400 transition-colors"></div>
        </div>

        {/* Name Input */}
        <div className="flex-1">
          <input
            type="text"
            value={nameValue}
            onChange={(e) => onNameChange(e.target.value)}
            required={required}
            placeholder={namePlaceholder}
            className="w-full h-10 px-3 text-sm border-0 rounded-r-lg focus:outline-none focus:ring-0 text-gray-700 placeholder-gray-400 bg-white"
          />
        </div>
      </div>
    </div>
  );
};

const Step1CompanyCategory: React.FC<Step1CompanyCategoryProps> = ({
  formData,
  updateFormData,
  onNext,
  onPrev,
  isValid,
  checkCompanyName,
  companyNameStatus,
  isCheckingName,
}) => {
  const categoryOptions = [
    {
      value: "Drone",
      description: "UAV manufacturing, services, and training",
    },
    {
      value: "AI",
      description: "Artificial intelligence solutions and products",
    },
    {
      value: "GIS",
      description: "Geographic Information Systems and GNSS/GPS/DGPS",
    },
  ];

  // State for email verification modal
  const { isLogin, setAccountEmail } = useUserAuth();
  const [showEmailModal, setShowEmailModal] = useState(!isLogin);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [emailCheckResult, setEmailCheckResult] = useState<{
    exists: boolean;
    message: string;
  } | null>(null);
  const [tempDirectorEmail, setTempDirectorEmail] = useState(formData.directorEmail || "");
  const [emailFieldTouched, setEmailFieldTouched] = useState(false);

  const handleCategoryChange = (selected: string[]) => {
    updateFormData({ companyCategory: selected });
  };

  // Function to check if email exists
  const checkEmailExists = async (email: string) => {
    if (!email) return;

    setCheckingEmail(true);
    setEmailCheckResult(null);

    try {
      const response = await axios.post(
        "https://eqzkmjhfbc.execute-api.ap-south-1.amazonaws.com/dev1/",
        { email }
      );

      const emailExists = response.data.exists;

      setEmailCheckResult({
        exists: emailExists,
        message: response.data.message,
      });

      if (emailExists) {
        setAccountEmail(email);
        setTimeout(() => {
          setShowEmailModal(false);
          setEmailCheckResult(null);
        }, 1500);
      }
    } catch (error) {
      console.error("Error checking email:", error);
      setEmailCheckResult({
        exists: false,
        message: "Error checking email. Please try again.",
      });
    } finally {
      setCheckingEmail(false);
    }
  };

  // Function to handle director email change in main form
  const handleDirectorEmailChange = (value: string) => {
    updateFormData({ directorEmail: value });
    setTempDirectorEmail(value);
  };

  // Function to handle focus on director email field
  const handleDirectorEmailFocus = () => {
    if (!isLogin && !emailFieldTouched) {
      setTempDirectorEmail(formData.directorEmail || "");
      setShowEmailModal(true);
      setEmailFieldTouched(true);
    }
  };

  // Function to handle modal submission
  const handleModalSubmit = () => {
    if (tempDirectorEmail) {
      checkEmailExists(tempDirectorEmail);
    }
  };

  // Function to close modal when email doesn't exist
  const handleModalClose = () => {
    setShowEmailModal(false);
    setEmailCheckResult(null);
  };

  // Function to handle modal input change
  const handleModalEmailChange = (value: string) => {
    setTempDirectorEmail(value);
    updateFormData({ directorEmail: value });
  };

  // Handle date change from the custom picker
  const handleDateChange = (date: string) => {
    updateFormData({ yearEstablished: date });
  };

  React.useEffect(() => {
    console.log("Form data updated:", formData);
  }, [formData]);

  return (
    <>
      <FormStep
        title="Company Information"
        description="Select your company category and provide basic details"
        onNext={onNext}
        onPrev={onPrev}
        isValid={isValid}
        isFirstStep={true}
        currentStep={1}
        totalSteps={6}
      >
        <div className="space-y-6">
          {/* Company Category */}
          <div>
            <h2 className="mb-2 text-lg font-bold text-slate-900">
              Company Category
            </h2>
            <p className="mb-4 text-sm text-slate-600">
              Select your company's main business category (you can select multiple)
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {categoryOptions.map(({ value, description }) => (
                <label
                  key={value}
                  className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${formData.companyCategory.includes(value)
                    ? "border-amber-500 bg-yellow-50 shadow-md"
                    : "border-amber-300 hover:border-amber-400"
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.companyCategory.includes(value)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleCategoryChange([...formData.companyCategory, value]);
                      } else {
                        handleCategoryChange(formData.companyCategory.filter((cat) => cat !== value));
                      }
                    }}
                    className="sr-only"
                  />
                  <h3 className={`text-lg font-bold mb-2 ${formData.companyCategory.includes(value) ? "text-amber-900" : "text-gray-700"
                    }`}>
                    {value}
                  </h3>
                  <p className={`text-xs text-center ${formData.companyCategory.includes(value) ? "text-amber-700" : "text-gray-500"
                    }`}>
                    {description}
                  </p>
                </label>
              ))}
            </div>

            {formData.companyCategory.length === 0 && (
              <div className="py-4 text-center">
                <p className="text-gray-500">Please select at least one category to continue</p>
              </div>
            )}
          </div>

          {/* Company Basic Details */}
          <div>
            <h2 className="mb-2 text-lg font-bold text-slate-900">
              Company Basic Details
            </h2>
            <p className="mb-4 text-sm text-slate-600">
              Tell us about your company's basic information
            </p>

            <div className="space-y-4">
              {/* Director Information */}
              <div className="p-3 bg-yellow-100 border rounded-lg border-amber-200">
                <h3 className="flex items-center mb-2 text-sm font-bold text-amber-900">
                  <User className="w-5 h-5 mr-2" />
                  Director/MD Information
                </h3>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  {/* Director Name with integrated Title */}
                  <NameWithTitle
                    label="Director Name"
                    titleValue={formData.directorPrefix || ''}
                    nameValue={formData.directorName}
                    onTitleChange={(value) => updateFormData({
                      directorPrefix: value as 'Mr' | 'Mrs' | 'Ms'
                    })}
                    onNameChange={(value) => updateFormData({ directorName: value })}
                    required
                    namePlaceholder="Full name"
                  />

                  <PhoneInput
                    label="Director Phone"
                    value={formData.directorPhone}
                    onChange={(value) => updateFormData({ directorPhone: value })}
                    required
                    placeholder="Enter phone number"
                  />

                  <div className="md:col-span-2">
                    <FormInput
                      label="Director Email"
                      type="email"
                      value={formData.directorEmail}
                      onChange={handleDirectorEmailChange}
                      onFocus={handleDirectorEmailFocus}
                      required
                      placeholder="director@company.com"
                    />
                    {!isLogin && (
                      <p className="mt-1 text-xs text-blue-600">
                        Note: We'll verify this email to ensure it's not already registered
                      </p>
                    )}
                  </div>

                  <FormInput
                    label="Director LinkedIn"
                    type="url"
                    value={formData.directorLinkedin || ""}
                    onChange={(value) => updateFormData({ directorLinkedin: value })}
                    placeholder="https://linkedin.com/in/username"
                  />

                  <FormInput
                    label="Director Twitter"
                    type="url"
                    value={formData.directorTwitter || ""}
                    onChange={(value) => updateFormData({ directorTwitter: value })}
                    placeholder="https://twitter.com/username"
                  />
                </div>
              </div>

              {/* Company Information */}
              <div className="p-3 border rounded-lg bg-yellow-50 border-amber-200">
                <h3 className="flex items-center mb-2 text-sm font-bold text-amber-900">
                  <Building2 className="w-5 h-5 mr-2" />
                  Company Information
                </h3>
                <div className="relative grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormInput
                    label="Company Name"
                    value={formData.companyName}
                    onChange={(value) => {
                      updateFormData({ companyName: value });
                      checkCompanyName(value);
                    }}
                    required
                    placeholder="Enter your company name"
                    error={
                      companyNameStatus && !companyNameStatus.available
                        ? companyNameStatus.message
                        : undefined
                    }
                  />
                  {isCheckingName && (
                    <div className="text-xs absolute left-[6.3rem] text-blue-600 mt-1">
                      Checking availability...
                    </div>
                  )}
                  {companyNameStatus && !companyNameStatus.available && companyNameStatus.suggestions && (
                    <div className="text-xs absolute left-[9rem] top-[3.6rem] text-yellow-700 mt-1">
                      Suggestions: {companyNameStatus.suggestions.join(", ")}
                    </div>
                  )}
                  {companyNameStatus && companyNameStatus.available && (
                    <div className="text-xs absolute left-2 top-[3.9rem] text-green-700">
                      {companyNameStatus.message}
                    </div>
                  )}

                  {/* Custom Date Picker */}
                  <div className="md:col-span-2">
                    <ScrollDatePicker
                      value={formData.yearEstablished}
                      onChange={handleDateChange}
                    />
                  </div>

                  <FormInput
                    label="Website URL"
                    type="url"
                    value={formData.websiteUrl}
                    onChange={(value) => {
                      let url = value.trim();
                      if (url && !url.match(/^https:\/\/www\./i)) {
                        url = `https://www.${url.replace(/^(https?:\/\/)?(www\.)?/i, '')}`;
                      }
                      updateFormData({ websiteUrl: url });
                    }}
                    required
                    placeholder="https://www.yourcompany.com"
                  />
                  <FormInput
                    label="Promotional Code"
                    value={formData.promoCode}
                    onChange={(value) => updateFormData({ promoCode: value })}
                    placeholder="Enter promotional code"
                  />
                </div>
              </div>

              {/* Legal Information */}
              <div className="p-3 border rounded-lg bg-amber-50 border-amber-200">
                <h3 className="mb-2 text-sm font-bold text-amber-900">
                  Trade Information (Optional)
                </h3>
                <div className="space-y-2">
                  <FormInput
                    label="Brand Name"
                    value={formData.legalName || ""}
                    onChange={(value) => updateFormData({ legalName: value })}
                    placeholder="If different from brand name"
                  />

                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <FormInput
                      label="GSTIN"
                      value={formData.gstin || ""}
                      onChange={(value) => updateFormData({ gstin: value })}
                      placeholder="GST number"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                    <FormInput
                      label="CIN"
                      value={formData.socialLinks?.cin || ""}
                      onChange={(value) =>
                        updateFormData({ socialLinks: { ...formData.socialLinks, cin: value } })
                      }
                      placeholder="Corporate Identity Number"
                    />
                    <FormInput
                      label="UDYAM"
                      value={formData.socialLinks?.udyam || ""}
                      onChange={(value) =>
                        updateFormData({ socialLinks: { ...formData.socialLinks, udyam: value } })
                      }
                      placeholder="UDYAM Registration Number"
                    />
                    <FormInput
                      label="PAN"
                      value={formData.socialLinks?.pan || ""}
                      onChange={(value) =>
                        updateFormData({ socialLinks: { ...formData.socialLinks, pan: value } })
                      }
                      placeholder="PAN Number"
                    />
                  </div>
                </div>
              </div>

              {/* Alternative Contact */}
              <div className="p-3 border rounded-lg bg-amber-100 border-amber-200">
                <h3 className="flex items-center mb-2 text-sm font-bold text-amber-900">
                  <Phone className="w-5 h-5 mr-2" />
                  Alternative Contact
                </h3>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  {/* Contact Person Name with integrated Title */}
                  <NameWithTitle
                    label="Contact Person Name"
                    titleValue={formData.altContactGender || ''}
                    nameValue={formData.altContactName}
                    onTitleChange={(value) => updateFormData({
                      altContactGender: value as 'Mr' | 'Mrs' | 'Ms'
                    })}
                    onNameChange={(value) => updateFormData({ altContactName: value })}
                    required
                    namePlaceholder="Full name"
                  />

                  <PhoneInput
                    label="Contact Phone"
                    value={formData.altContactPhone}
                    onChange={(value) => updateFormData({ altContactPhone: value })}
                    required
                    placeholder="Enter phone number"
                  />
                  <div className="md:col-span-2">
                    <FormInput
                      label="Contact Email"
                      type="email"
                      value={formData.altContactEmail}
                      onChange={(value) => updateFormData({ altContactEmail: value })}
                      required
                      placeholder="contact@company.com"
                    />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="p-3 bg-yellow-200 border rounded-lg border-amber-200">
                <h3 className="flex items-center mb-2 text-sm font-bold text-amber-900">
                  <Globe className="w-5 h-5 mr-2" />
                  Address Information
                </h3>
                <div className="space-y-2">
                  <FormInput
                    label="Office Address"
                    type="textarea"
                    value={formData.officeAddress}
                    onChange={(value) => updateFormData({ officeAddress: value })}
                    required
                    placeholder="Complete office address"
                    rows={2}
                  />
                  <div className="grid grid-cols-1 gap-2 w-full md:grid-cols-2 lg:grid-cols-4">
                    <div className="md:col-span-2">
                      <CountryStateSelect
                        countryValue={formData.country}
                        stateValue={formData.state}
                        onCountryChange={(value) => updateFormData({ country: value })}
                        onStateChange={(value) => updateFormData({ state: value })}
                        countryRequired
                        stateRequired
                        countryPlaceholder="Select Country"
                        statePlaceholder="Select State"
                      />
                    </div>
                    <FormInput
                      label="City"
                      value={formData.city}
                      onChange={(value) => updateFormData({ city: value })}
                      required
                      placeholder="City"
                    />
                    <FormInput
                      label="Postal Code"
                      value={formData.postalCode}
                      onChange={(value) => updateFormData({ postalCode: value })}
                      required
                      placeholder="PIN Code"
                    />
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="p-3 border rounded-lg bg-amber-200 border-amber-200">
                <h3 className="flex items-center mb-2 text-sm font-bold text-amber-900">
                  <Globe className="w-5 h-5 mr-2" />
                  Social Media Links (Optional)
                </h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <FormInput
                      label="LinkedIn Profile"
                      type="url"
                      value={formData.socialLinks?.linkedin || ""}
                      onChange={(value) =>
                        updateFormData({ socialLinks: { ...formData.socialLinks, linkedin: value } })
                      }
                      placeholder="https://linkedin.com/company/yourcompany"
                    />
                    <FormInput
                      label="Facebook Page"
                      type="url"
                      value={formData.socialLinks?.facebook || ""}
                      onChange={(value) =>
                        updateFormData({ socialLinks: { ...formData.socialLinks, facebook: value } })
                      }
                      placeholder="https://facebook.com/yourcompany"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <FormInput
                      label="Instagram Profile"
                      type="url"
                      value={formData.socialLinks?.instagram || ""}
                      onChange={(value) =>
                        updateFormData({ socialLinks: { ...formData.socialLinks, instagram: value } })
                      }
                      placeholder="https://instagram.com/yourcompany"
                    />
                    <FormInput
                      label="Twitter/X Profile"
                      type="url"
                      value={formData.socialLinks?.twitter || ""}
                      onChange={(value) =>
                        updateFormData({ socialLinks: { ...formData.socialLinks, twitter: value } })
                      }
                      placeholder="https://twitter.com/yourcompany"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <FormInput
                      label="YouTube Channel"
                      type="url"
                      value={formData.socialLinks?.youtube || ""}
                      onChange={(value) =>
                        updateFormData({ socialLinks: { ...formData.socialLinks, youtube: value } })
                      }
                      placeholder="https://youtube.com/@yourcompany"
                    />
                    <FormInput
                      label="Support Email"
                      type="email"
                      value={formData.supportEmail || ""}
                      onChange={(value) => updateFormData({ supportEmail: value })}
                      placeholder="support@company.com"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <PhoneInput
                      label="Support Contact Number"
                      value={formData.supportContactNumber || ""}
                      onChange={(value) => updateFormData({ supportContactNumber: value })}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FormStep>

      {/* Email Verification Modal
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Mail className="w-6 h-6 mr-2 text-blue-600" />
                <h3 className="text-lg font-bold capitalize text-slate-900">Verify user Email</h3>
              </div>
              <button onClick={handleModalClose} className="transition-colors text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <p className="mb-4 text-sm text-slate-600">
                We need to verify if this email is already associated with an existing account.
                Please enter the User email to continue.
              </p>

              <FormInput
                label="User Email"
                type="email"
                value={tempDirectorEmail}
                onChange={handleModalEmailChange}
                required
                placeholder="user@company.com"
                disabled={checkingEmail}
              />

              {emailCheckResult && (
                <div className={`mt-3 p-3 rounded-lg flex items-start ${emailCheckResult.exists ? "bg-green-50 border border-green-200" : "bg-blue-50 border border-blue-200"
                  }`}>
                  <AlertCircle className={`w-4 h-4 mt-0.5 mr-2 ${emailCheckResult.exists ? "text-green-600" : "text-blue-600"
                    }`} />
                  <div>
                    <p className={`text-sm font-medium ${emailCheckResult.exists ? "text-green-800" : "text-blue-800"
                      }`}>
                      {emailCheckResult.message}
                    </p>
                    {emailCheckResult.exists && (
                      <p className="mt-1 text-xs text-green-600">
                        Email verified! This will be used for your existing account.
                      </p>
                    )}
                    {!emailCheckResult.exists && (
                      <p className="mt-1 text-xs text-blue-600">
                        This email is not registered. Click Cancel to use this email for a new account.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleModalClose}
                className="px-4 py-2 font-medium transition-colors text-slate-600 hover:text-slate-800"
                disabled={checkingEmail}
              >
                Cancel
              </button>
              <button
                onClick={handleModalSubmit}
                disabled={!tempDirectorEmail || checkingEmail}
                className="flex items-center px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                {checkingEmail ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                    Checking...
                  </>
                ) : (
                  "Verify Email"
                )}
              </button>
            </div>
          </div>
        </div>
      )} */}
    </>
  );
};

export default Step1CompanyCategory;