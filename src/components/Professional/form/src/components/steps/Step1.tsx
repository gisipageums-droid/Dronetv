import React, { useState, useEffect, useRef } from "react";
import { useForm } from "../../context/FormContext";
import { MultiSelect } from "../common/MultiSelect";
import { Cloud, ChevronDown } from "lucide-react";

// Redirect Modal Component
const RedirectModal = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] backdrop-blur-sm">
    <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl animate-fade-in-up">
      <div className="flex justify-center mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Cloud className="w-12 h-12 text-blue-600 fill-blue-50" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-4 bg-blue-600 rounded-t-full mt-1"></div>
            </div>
          </div>
          <div className="text-left leading-none">
            <h3 className="text-2xl font-bold text-blue-700 tracking-tight">DigiLocker</h3>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mt-1">Document Wallet to Empower Citizens</p>
          </div>
        </div>
      </div>

      <h2 className="text-xl text-gray-800 font-medium mb-8">Redirecting back to Requester...</h2>

      <button
        onClick={onClose}
        className="w-full bg-[#4F9CF9] hover:bg-blue-500 text-white font-semibold py-3.5 rounded-xl mb-4 transition-all shadow-lg shadow-blue-200 transform hover:-translate-y-0.5"
      >
        Continue
      </button>

      <p className="text-xs text-gray-500 leading-relaxed">
        Please click continue if you are not automatically redirected.
      </p>
    </div>
  </div>
);
import { PhoneInput } from "../common/PhoneInput";
import { CountryStateSelect } from "../common/CountryStateSelect";

// Custom Date Picker Component
interface ScrollColumnProps {
  items: Array<{ value: string; label: string }>;
  selectedValue: string;
  onSelect: (value: string) => void;
  setIsScrolling: (isScrolling: boolean) => void;
}

const ScrollColumn = React.forwardRef<HTMLDivElement, ScrollColumnProps>(
  ({ items, selectedValue, onSelect, setIsScrolling }, ref) => {
    const handleClick = (value: string) => {
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
        <div className="h-12"></div>
      </div>
    );
  }
);

ScrollColumn.displayName = "ScrollColumn";

// Read-only Date Picker Component
const ReadOnlyDateDisplay: React.FC<{
  value: string;
}> = ({ value }) => {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Not set";

    try {
      const [year, month, day] = dateStr.split("-");
      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      const monthName = monthNames[parseInt(month) - 1] || month;
      return `${parseInt(day)} ${monthName} ${year}`;
    } catch (error) {
      return dateStr;
    }
  };

  return (
    <div className="border border-amber-200 rounded-lg p-3 bg-amber-50">
      <div className="text-center">
        <p className="text-sm text-gray-600">Date of Birth</p>
        <p className="font-semibold text-amber-700 text-lg">
          {formatDate(value)}
        </p>
      </div>
    </div>
  );
};

// OTP Verification Modal Component
const OTPVerificationModal = ({
  aadharNumber,
  onVerify,
  onClose,
  onResend
}: {
  aadharNumber: string;
  onVerify: (otp: string) => void;
  onClose: () => void;
  onResend: () => void;
}) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  useEffect(() => {
    // Auto-focus first input
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Set that user has started typing
    if (value && !hasStartedTyping) {
      setHasStartedTyping(true);
    }

    // Clear errors and success when user types
    if (value) {
      setError("");
      setSuccess("");
    }

    // Auto-focus next input
    if (value && index < 5) {
      setTimeout(() => {
        inputRefs.current[index + 1]?.focus();
      }, 10);
    }

    // Auto-verify if all 6 digits are filled
    if (newOtp.every(digit => digit !== "")) {
      // Don't auto-verify, let user click the button
      setError("");
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join("");

    // Check if all 6 digits are filled
    if (otpString.length !== 6) {
      setError("Please enter all 6 digits");
      setSuccess("");

      // Focus on the first empty input
      const firstEmptyIndex = otp.findIndex(digit => digit === "");
      if (firstEmptyIndex !== -1 && inputRefs.current[firstEmptyIndex]) {
        inputRefs.current[firstEmptyIndex]?.focus();
      }

      return;
    }

    setIsVerifying(true);
    setError("");
    setSuccess("");

    // Simulate API call
    setTimeout(() => {
      setIsVerifying(false);
      if (otpString === "123456") { // For demo purposes
        setSuccess("✅ Aadhar verification successful!");

        // Call onVerify after a short delay to show success message
        setTimeout(() => {
          onVerify(otpString);
        }, 1500);
      } else {
        setError("Invalid OTP. Please try again.");
        setSuccess("");

        // Clear OTP and refocus first input on invalid OTP
        setOtp(["", "", "", "", "", ""]);
        setHasStartedTyping(false);
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      }
    }, 1500);
  };

  const handleResend = () => {
    setTimeLeft(60);
    setOtp(["", "", "", "", "", ""]);
    setError("");
    setSuccess("");
    setHasStartedTyping(false);
    onResend();
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  };

  const maskedAadhar = aadharNumber.replace(/(\d{4})(\d{4})(\d{4})/, "$1-XXXX-$3");

  // Determine if we should show the "enter all digits" error
  const shouldShowAllDigitsError =
    hasStartedTyping &&
    otp.some(digit => digit === "") &&
    !success;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm animate-fade-in-up my-auto">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800">Verify Aadhar Number</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ×
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Enter 6-digit OTP sent to your Aadhar registered mobile
          </p>
        </div>

        {/* Aadhar Info */}
        <div className="p-4 bg-blue-50 mx-4 mt-3 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Aadhar Number</p>
              <p className="text-base font-semibold text-gray-800">{maskedAadhar}</p>
            </div>
            <div className="text-green-600">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* OTP Input */}
        <div className="p-4">
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              6-digit OTP
            </label>
            <div className="flex justify-between space-x-1">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onFocus={() => {
                    // When user focuses on any input after starting, show error if not complete
                    if (hasStartedTyping && otp.some(d => d === "") && !success) {
                      setError("Please enter all 6 digits");
                    }
                  }}
                  className="w-10 h-12 text-center text-xl font-bold border-2 border-amber-300 rounded-lg focus:border-amber-500 focus:ring-1 focus:ring-amber-200 outline-none transition"
                />
              ))}
            </div>

            {/* Success message */}
            {success && (
              <p className="text-green-600 text-xs mt-2 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {success}
              </p>
            )}

            {/* Show error message when user has started typing but hasn't completed all digits */}
            {shouldShowAllDigitsError && (
              <p className="text-red-600 text-xs mt-2 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Please enter all 6 digits
              </p>
            )}

            {/* Show invalid OTP error */}
            {error === "Invalid OTP. Please try again." && (
              <p className="text-red-600 text-xs mt-2 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
            )}
          </div>

          {/* Timer */}
          <div className="mb-4">
            <p className="text-xs text-gray-600 text-center">
              {timeLeft > 0 ? (
                <>
                  OTP expires in <span className="font-semibold text-red-600">{timeLeft}</span> seconds
                </>
              ) : (
                <span className="text-red-600">OTP has expired</span>
              )}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col space-y-2">
            <button
              onClick={handleVerify}
              disabled={isVerifying || otp.some(d => d === "") || success}
              className={`w-full font-medium py-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm
                ${success
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-amber-600 hover:bg-amber-700 text-white"
                }`}
            >
              {isVerifying ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </>
              ) : success ? (
                "✓ Verified Successfully"
              ) : (
                "Verify OTP"
              )}
            </button>

            <button
              onClick={handleResend}
              disabled={timeLeft > 0 || success}
              className="w-full border border-amber-600 text-amber-600 hover:bg-amber-50 font-medium py-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Resend OTP {timeLeft > 0 && `(${timeLeft}s)`}
            </button>

            <button
              onClick={onClose}
              className="w-full text-gray-600 hover:text-gray-800 font-medium py-2.5 rounded-lg transition text-sm"
            >
              Cancel Verification
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">
              <strong className="text-gray-700">Note:</strong> OTP is sent to the mobile number registered with your Aadhar.
              If you haven't received it, check your SMS inbox or try resending.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Consent Modal Component
const ConsentModal = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[99999999999] backdrop-blur-sm p-4">
    <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl animate-fade-in-up relative overflow-hidden flex flex-col max-h-[90vh]">
      {/* Header */}
      <div className="p-6 border-b flex justify-between items-center bg-white sticky top-0 z-10">
        <h2 className="text-xl font-bold text-slate-800">User Consent for Identity Verification</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors p-1"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content Area with Yellow Stripe */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar space-y-6">
          <p className="text-[15px] text-slate-600 leading-relaxed">
            By proceeding, I hereby provide my explicit and informed consent to <strong className="text-slate-900">DroneTV (dronetv.in)</strong> to collect, use, and verify my Aadhar/Company information for the limited purpose of identity and profile verification on the platform.
          </p>

          <section>
            <h3 className="text-lg font-bold text-slate-800 mb-3">Purpose of Collection</h3>
            <p className="text-sm text-slate-600 mb-3 font-medium">My information will be used solely for:</p>
            <ul className="space-y-3">
              {[
                "Verifying my identity and/or company details",
                "Listing my professional profile or company on DroneTV",
                "Establishing authenticity and trust for platform users",
                "Compliance with applicable Indian laws and regulations"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-[14px] text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-800 mb-3">Information Collected</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-[15px] font-bold text-slate-800 mb-2">For Individuals (Professionals)</h4>
                <p className="text-sm text-slate-600 mb-3">With my consent, DroneTV may access and verify the following information:</p>
                <ul className="space-y-3">
                  {[
                    "Name, Date of birth, and Address",
                    "Aadhaar-based identity details through OTP authentication",
                    "Documents shared via DigiLocker (such as Aadhaar, PAN, or professional certificates)"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-[14px] text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </div>

        {/* Yellow Stripe on the right side of the content */}
        <div className="w-2 bg-yellow-400 h-full"></div>
      </div>

      {/* Footer */}
      <div className="p-4 bg-white flex justify-end sticky bottom-0 z-10">
        <button
          onClick={onClose}
          className="px-10 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold rounded-lg transition-all shadow-md active:scale-95"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

// Main ScrollDatePicker Component
const ScrollDatePicker: React.FC<{
  value: string;
  onChange: (date: string) => void;
}> = ({ value, onChange }) => {
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

    const day = parseInt(newDate.day);
    const month = parseInt(newDate.month);
    const year = parseInt(newDate.year);

    let validatedDay = newDate.day;

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
    const dateString = `${finalDate.year}-${finalDate.month}-${finalDate.day}`;
    onChange(dateString);
  };

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
  }, [selectedDate.day, selectedDate.month, selectedDate.year]);

  useEffect(() => {
    if (value && !isScrolling) {
      const parsed = parseDate(value);
      if (
        parsed.day !== selectedDate.day ||
        parsed.month !== selectedDate.month ||
        parsed.year !== selectedDate.year
      ) {
        setSelectedDate(parsed);
      }
    }
  }, [value, isScrolling]);

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
        <h3 className="font-semibold text-gray-800">Date of Birth</h3>
        <p className="text-xs text-gray-600 mt-1">Select your date of birth</p>
      </div>

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
        <div className="absolute left-0 right-0 top-20 transform -translate-y-1/2 h-12 bg-amber-100 border-2 border-amber-300 rounded-lg pointer-events-none date-picker-highlight"></div>

        <div className="flex items-stretch h-32 relative z-10">
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

          <ScrollColumn
            ref={yearRef}
            items={years.map((year) => ({ value: year, label: year }))}
            selectedValue={selectedDate.year}
            onSelect={(value) => handleDateChange("year", value)}
            setIsScrolling={setIsScrolling}
          />
        </div>
      </div>

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

// Read-only Display Components
const ReadOnlyField: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex flex-col">
    <label className="mb-1 font-medium text-slate-800 text-sm">{label}</label>
    <div className="border border-amber-200 rounded-lg p-3 bg-amber-50 text-gray-700">
      {value || <span className="text-gray-400 italic">Not set</span>}
    </div>
  </div>
);

const ReadOnlyTextArea: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex flex-col">
    <label className="mb-1 font-medium text-slate-800 text-sm">{label}</label>
    <div className="border border-amber-200 rounded-lg p-3 bg-amber-50 text-gray-700 min-h-[80px] whitespace-pre-wrap">
      {value || <span className="text-gray-400 italic">Not set</span>}
    </div>
  </div>
);

// Main Step1 Component
export const Step1 = ({
  step,
  setStepValid,
}: {
  step: any;
  setStepValid?: (valid: boolean) => void;
}) => {
  const { data, updateField } = useForm();

  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null
  );
  const [checking, setChecking] = useState(false);
  const [originalUsername, setOriginalUsername] = useState<string | null>(null);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [aadharVerified, setAadharVerified] = useState(false);
  const [aadharError, setAadharError] = useState("");
  const [copyAddress, setCopyAddress] = useState(false);

  // DigiLocker State
  const [digiLockerLoading, setDigiLockerLoading] = useState(false);
  const [isPollingDigiLocker, setIsPollingDigiLocker] = useState(false);
  const [digiLockerError, setDigiLockerError] = useState("");
  const [digiLockerSuccess, setDigiLockerSuccess] = useState(false);
  const [showRedirectModal, setShowRedirectModal] = useState(false);
  const [aadharConsent, setAadharConsent] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);

  // PINCODE TO STATE MAPPING FUNCTION
  const getStateFromPincode = (pincode: string) => {
    if (!pincode || pincode.length < 6) return "";

    const pincodeInt = parseInt(pincode);

    // Major Indian states by pincode ranges
    if (pincodeInt >= 500000 && pincodeInt <= 509000) return "Telangana";
    if (pincodeInt >= 110000 && pincodeInt <= 110099) return "Delhi";
    if (pincodeInt >= 400000 && pincodeInt <= 499999) return "Maharashtra";
    if (pincodeInt >= 560000 && pincodeInt <= 590000) return "Karnataka";
    if (pincodeInt >= 600000 && pincodeInt <= 641000) return "Tamil Nadu";
    if (pincodeInt >= 700000 && pincodeInt <= 749000) return "West Bengal";
    if (pincodeInt >= 800000 && pincodeInt <= 855000) return "Bihar";
    if (pincodeInt >= 302000 && pincodeInt <= 345000) return "Rajasthan";
    if (pincodeInt >= 140000 && pincodeInt <= 160000) return "Punjab";
    if (pincodeInt >= 360000 && pincodeInt <= 395000) return "Gujarat";

    return "";
  };

  // Handle DigiLocker Login
  const handleDigiLockerLogin = async () => {
    setDigiLockerLoading(true);
    setDigiLockerError("");
    try {
      // API 1: Get Access Token
      const tokenRes = await fetch("https://digilocker.meon.co.in/get_access_token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: "ipage",
          secret_token: "lwHaBrdbfda67P3uO5jbC7HElp6cpBQb"
        })
      });
      const tokenData = await tokenRes.json();

      if (!tokenData.status) {
        throw new Error("Failed to get access token");
      }

      const { client_token, state } = tokenData;
      localStorage.setItem("digilocker_token", client_token);
      localStorage.setItem("digilocker_state", state);

      // API 2: Get DigiLocker URL
      const currentUrl = window.location.origin + window.location.pathname;
      const redirectUrl = `${currentUrl}?digi_callback=true`;

      const urlRes = await fetch("https://digilocker.meon.co.in/digi_url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_token,
          redirect_url: redirectUrl,
          company_name: "ipage",
          documents: "aadhaar,pan",
          pan_name: "RAHUL KUMAR",
          pan_no: "CAPUD4335K",
          other_documents: []
        })
      });
      const urlData = await urlRes.json();

      if (urlData.status !== "success") {
        throw new Error(urlData.msg || "Failed to get DigiLocker URL");
      }

      // Open URL
      window.open(urlData.url, "_blank");

      // Start Polling
      setIsPollingDigiLocker(true);
      setDigiLockerLoading(false);

    } catch (err: any) {
      console.error(err);
      setDigiLockerError(err.message || "Something went wrong");
      setDigiLockerLoading(false);
    }
  };

  // Check for DigiLocker callback on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const hasDigiCallback = urlParams.get('digi_callback');
    const hasError = urlParams.has('error') || urlParams.has('error_description');

    // Check if we have stored DigiLocker tokens and user just returned from DigiLocker
    const storedToken = localStorage.getItem("digilocker_token");
    const storedState = localStorage.getItem("digilocker_state");

    if (hasError) {
      // User cancelled or error occurred
      setIsPollingDigiLocker(false);
      setDigiLockerLoading(false);
      setDigiLockerError("DigiLocker verification was cancelled or failed");
      localStorage.removeItem("digilocker_token");
      localStorage.removeItem("digilocker_state");
    } else if (hasDigiCallback) {
      // User returned from DigiLocker in the popup/redirect flow
      setShowRedirectModal(true);

      // Auto-close after 3 seconds
      setTimeout(() => {
        window.close();
      }, 3000);

      // Do NOT start polling here as this is the popup window
    } else if ((storedToken && storedState) && !digiLockerSuccess && !isPollingDigiLocker) {
      // User returned from DigiLocker (or refresh) in main window, start polling
      setIsPollingDigiLocker(true);
    }

    // Clean up URL parameters only if NOT in callback flow (to avoid removing params if we need them, though unlikely)
    if (hasError) {
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, []);

  // Poll DigiLocker Data with timeout
  useEffect(() => {
    let interval: NodeJS.Timeout;
    let timeout: NodeJS.Timeout;

    if (isPollingDigiLocker) {
      // Set timeout to stop polling after 5 minutes
      timeout = setTimeout(() => {
        setIsPollingDigiLocker(false);
        setDigiLockerError("DigiLocker verification timed out. Please try again.");
        localStorage.removeItem("digilocker_token");
        localStorage.removeItem("digilocker_state");
      }, 300000); // 5 minutes

      interval = setInterval(async () => {
        try {
          const client_token = localStorage.getItem("digilocker_token");
          const state = localStorage.getItem("digilocker_state");

          // Stop polling if we are in the popup window (checking callback param)
          const urlParams = new URLSearchParams(window.location.search);
          if (urlParams.get('digi_callback')) {
            clearInterval(interval);
            clearTimeout(timeout);
            return;
          }

          if (!client_token || !state) {
            setIsPollingDigiLocker(false);
            return;
          }

          const res = await fetch("https://digilocker.meon.co.in/v2/send_entire_data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ client_token, state })
          });
          const resData = await res.json();

          if (resData.success) {
            clearTimeout(timeout);
            setIsPollingDigiLocker(false);
            setDigiLockerSuccess(true);

            const aadharData = resData.data;

            let formattedDob = "";
            if (aadharData.dob) {
              const [d, m, y] = aadharData.dob.split("-");
              formattedDob = `${y}-${m}-${d}`;
            }

            let relType = "";
            let relName = "";
            if (aadharData.fathername) {
              if (aadharData.fathername.startsWith("C/o")) {
                relType = "C/o";
                relName = aadharData.fathername.replace("C/o", "").trim();
              } else if (aadharData.fathername.startsWith("S/o")) {
                relType = "S/o";
                relName = aadharData.fathername.replace("S/o", "").trim();
              } else if (aadharData.fathername.startsWith("D/o")) {
                relType = "D/o";
                relName = aadharData.fathername.replace("D/o", "").trim();
              } else {
                relType = "C/o";
                relName = aadharData.fathername;
              }
            }

            let formattedAadhar = "";
            if (aadharData.aadhar_no) {
              const aadharStr = aadharData.aadhar_no.toString();
              if (aadharStr.includes('x') || aadharStr.includes('X')) {
                const lastFourDigits = aadharStr.replace(/[xX]/g, '').slice(-4);
                if (lastFourDigits.length === 4) {
                  formattedAadhar = `XXXX-XXXX-${lastFourDigits}`;
                }
              } else {
                const digits = aadharStr.replace(/\D/g, '');
                if (digits.length === 12) {
                  formattedAadhar = `${digits.substring(0, 4)}-${digits.substring(4, 8)}-${digits.substring(8, 12)}`;
                }
              }
            }

            // Extract Name with fallbacks
            const extractedName = aadharData.name || aadharData.full_name || aadharData.userName || "";

            updateField("basicInfo", {
              ...data.basicInfo,
              fullName: extractedName,
              date_of_birth: formattedDob,
              gender: aadharData.gender ? aadharData.gender.toLowerCase() : "",
              aadhar_number: formattedAadhar,
              address: `${aadharData.house || ""}, ${aadharData.locality || ""}`.replace(/^, /, "").replace(/, $/, ""),
              city_district: aadharData.dist || "",
              state: aadharData.state || "",
              pincode: aadharData.pincode || "",
              country: aadharData.country || "India",
              relationship_type: relType,
              relationship_name: relName
            });

            // Also update communicationAddress
            // REMOVED: Do not auto-fill communicationAddress. It should only be filled if user checks "Same as above"


            setAadharVerified(true);

            localStorage.removeItem("digilocker_token");
            localStorage.removeItem("digilocker_state");
          }
        } catch (err) {
          console.error("Polling error", err);
        }
      }, 5000);
    }

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isPollingDigiLocker, data.basicInfo, data.communicationAddress, updateField]);

  // Debug: Log form data changes
  useEffect(() => {
    console.log("🔍 Step1 - Current form data:", {
      basicInfo: data.basicInfo,
      addressInformation: data.addressInformation,
      communicationAddress: data.communicationAddress,
      alternateContact: data.alternateContact
    });
  }, [data.basicInfo, data.addressInformation, data.communicationAddress, data.alternateContact]);

  // Set original username when component mounts or when data loads
  useEffect(() => {
    if (data.basicInfo?.user_name && !originalUsername) {
      setOriginalUsername(data.basicInfo.user_name);
      setUsernameAvailable(true);
    }
  }, [data.basicInfo?.user_name, originalUsername]);

  // Check username availability
  useEffect(() => {
    const user_name = data.basicInfo?.user_name || "";

    if (!user_name) {
      setUsernameAvailable(null);
      return;
    }

    if (originalUsername && user_name === originalUsername) {
      setUsernameAvailable(true);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setChecking(true);
        const res = await fetch(
          "https://0x1psamlyh.execute-api.ap-south-1.amazonaws.com/dev/professional-username-check",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_name }),
          }
        );
        const json = await res.json();
        setUsernameAvailable(json.available);
      } catch (err) {
        console.error(err);
        setUsernameAvailable(null);
      } finally {
        setChecking(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [data.basicInfo?.user_name, originalUsername]);

  // COMPREHENSIVE FORM VALIDATION
  useEffect(() => {
    // 1. Basic Info Validation
    const basicInfo = data.basicInfo || {};
    const isBasicInfoValid =
      basicInfo.fullName &&
      basicInfo.date_of_birth &&
      basicInfo.gender &&
      basicInfo.relationship_type &&
      basicInfo.relationship_name &&
      basicInfo.address &&
      basicInfo.city_district &&
      basicInfo.pincode &&
      basicInfo.country &&
      basicInfo.state &&
      basicInfo.aadhar_number &&
      (basicInfo.aadhar_number.replace(/\D/g, '').length === 12 ||
        (basicInfo.aadhar_number.includes('X') && basicInfo.aadhar_number.replace(/\D/g, '').length === 4)); // Allow 12 digits OR masked format

    // 2. Communication Address Validation
    const commAddress = data.communicationAddress || {};
    const isCommAddressValid =
      commAddress.address &&
      commAddress.postalCode &&
      commAddress.country &&
      commAddress.state;

    // 3. Address Information (Contact Info) Validation
    const addressInfo = data.addressInformation || {};
    const isUserAvailable = usernameAvailable === true || (originalUsername && basicInfo.user_name === originalUsername);

    const isAddressInfoValid =
      basicInfo.user_name &&
      isUserAvailable && // Username must be available
      addressInfo.email &&
      addressInfo.phoneNumber &&
      addressInfo.nationality &&
      addressInfo.designation &&
      addressInfo.tagline;

    // Combined Validity
    const isValid = isBasicInfoValid && isCommAddressValid && isAddressInfoValid;

    // Debugging Validation - helpful for identifying missing fields
    console.log("📝 Step1 Validation Status:", {
      isBasicInfoValid,
      isCommAddressValid,
      isAddressInfoValid,
      details: {
        aadharDigitCount: basicInfo.aadhar_number?.replace(/\D/g, '').length,
        hasUsername: !!basicInfo.user_name,
        isUsernameAvailable: usernameAvailable,
        hasEmail: !!addressInfo.email,
        hasPhone: !!addressInfo.phoneNumber,
        totalValid: !!isValid
      }
    });

    if (!isBasicInfoValid) {
      const missing = [];
      if (!basicInfo.fullName) missing.push("fullName");
      if (!basicInfo.date_of_birth) missing.push("dob");
      if (!basicInfo.gender) missing.push("gender");
      if (!basicInfo.relationship_type) missing.push("relType");
      if (!basicInfo.relationship_name) missing.push("relName");
      if (!basicInfo.address) missing.push("address");
      if (!basicInfo.city_district) missing.push("city");
      if (!basicInfo.pincode) missing.push("pincode");
      if (!basicInfo.state) missing.push("state");
      if (!basicInfo.aadhar_number) missing.push("aadhar");
      if (basicInfo.aadhar_number && (basicInfo.aadhar_number.replace(/\D/g, '').length !== 12 && basicInfo.aadhar_number.replace(/\D/g, '').length !== 4)) missing.push("aadhar_length_invalid");
      console.log("❌ Missing Basic Info:", missing);
    }

    if (!isCommAddressValid) {
      const missing = [];
      const comm = data.communicationAddress || {};
      if (!comm.address) missing.push("address");
      if (!comm.postalCode) missing.push("postalCode");
      if (!comm.country) missing.push("country");
      if (!comm.state) missing.push("state");
      console.log("❌ Missing Communication Address:", missing);
    }

    if (!isAddressInfoValid) {
      const missing = [];
      const info = data.addressInformation || {};
      if (!basicInfo.user_name) missing.push("user_name");
      if (!isUserAvailable) missing.push("username_taken_or_checking");
      if (!info.email) missing.push("email");
      if (!info.phoneNumber) missing.push("phoneNumber");
      if (!info.nationality) missing.push("nationality");
      if (!info.designation) missing.push("designation");
      if (!info.tagline) missing.push("tagline");
      console.log("❌ Missing Professional Information:", missing);
    }

    // Update Step Validity
    setStepValid?.(!!isValid);

  }, [
    data.basicInfo,
    data.communicationAddress,
    data.addressInformation,
    usernameAvailable,
    originalUsername,
    setStepValid
  ]);

  // Restore verification state if Aadhar is already populated with masked format (from DigiLocker)
  useEffect(() => {
    const currentAadhar = data.basicInfo?.aadhar_number;
    if (currentAadhar && (currentAadhar.includes('X') || currentAadhar.includes('x'))) {
      setAadharVerified(true);
      setDigiLockerSuccess(true);
      setIsPollingDigiLocker(false);
    }
  }, [data.basicInfo?.aadhar_number]);

  // Handle Aadhar input with auto-formatting
  const handleAadharChange = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');

    // Format as XXXX-XXXX-XXXX
    let formatted = digits;
    if (digits.length > 4) {
      formatted = digits.substring(0, 4) + '-' + digits.substring(4, 8);
    }
    if (digits.length > 8) {
      formatted = formatted + '-' + digits.substring(8, 12);
    }

    // Limit to 12 digits
    if (digits.length <= 12) {
      updateField("basicInfo", {
        ...data.basicInfo,
        aadhar_number: formatted
      });
      setAadharError("");

      // Show OTP modal when user has entered 12 digits
      // if (digits.length === 12 && !aadharVerified) {
      //   setShowOtpModal(true);
      // }
    }
  };

  // Handle OTP verification
  const handleOtpVerify = (otp: string) => {
    console.log("OTP Verified:", otp);
    setAadharVerified(true);
    setShowOtpModal(false);
    // Here you would typically make an API call to verify the OTP
  };

  // Handle OTP resend
  const handleOtpResend = () => {
    console.log("Resending OTP for Aadhar:", data.basicInfo?.aadhar_number);
    // Here you would typically make an API call to resend OTP
  };

  // Validate Aadhar number format
  const validateAadhar = (aadhar: string) => {
    const digits = aadhar.replace(/\D/g, '');
    return digits.length === 12;
  };

  // Enhanced: Check if all basic info address fields are filled
  const checkBasicInfoAddressFilled = () => {
    return (
      data.basicInfo?.address &&
      data.basicInfo?.city_district &&
      data.basicInfo?.pincode &&
      data.basicInfo?.country &&
      data.basicInfo?.state
    );
  };

  // Enhanced: Handle copy address checkbox - ONLY COPY WHEN CHECKED
  const handleCopyAddressChange = (checked: boolean) => {
    setCopyAddress(checked);

    if (checked) {
      // COPY ADDRESS ONLY WHEN CHECKBOX IS CHECKED
      updateField("communicationAddress", {
        ...data.communicationAddress,
        address: data.basicInfo?.address || "",
        city: data.basicInfo?.city_district || "",
        postalCode: data.basicInfo?.pincode || "",
        country: data.basicInfo?.country || "",
        state: data.basicInfo?.state || "",
      });
    } else {
      // Clear fields when unchecked
      updateField("communicationAddress", {
        ...data.communicationAddress,
        address: "",
        city: "",
        postalCode: "",
        country: "",
        state: "",
      });
    }
  };

  // REMOVED: The useEffect that was auto-updating communicationAddress
  // This was causing the issue - it was constantly syncing when basicInfo changed

  // NEW: Auto-detect state from pincode when pincode changes in basicInfo
  useEffect(() => {
    const pincode = data.basicInfo?.pincode || "";

    if (pincode.length === 6) {
      const detectedState = getStateFromPincode(pincode);

      if (detectedState && !data.basicInfo?.state) {
        // Update basicInfo state
        updateField("basicInfo", {
          ...data.basicInfo,
          state: detectedState
        });

        // Also update communicationAddress if copyAddress is checked
        if (copyAddress) {
          updateField("communicationAddress", {
            ...data.communicationAddress,
            state: detectedState
          });
        }
      }
    }
  }, [data.basicInfo?.pincode, copyAddress, data.basicInfo?.state, updateField]);

  // NEW: Auto-detect state from postalCode in communicationAddress
  useEffect(() => {
    const postalCode = data.communicationAddress?.postalCode || "";

    if (postalCode.length === 6) {
      const detectedState = getStateFromPincode(postalCode);

      if (detectedState && !data.communicationAddress?.state && !copyAddress) {
        updateField("communicationAddress", {
          ...data.communicationAddress,
          state: detectedState
        });
      }
    }
  }, [data.communicationAddress?.postalCode, copyAddress, data.communicationAddress?.state, updateField]);

  // Render input field based on type
  const renderInputField = (f: any, section: any) => {
    const baseClasses =
      "border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm";

    // Handle country and state fields
    if (
      (f.id === "country" || f.id === "state") &&
      (section.id === "basicInfo" || section.id === "addressInformation" || section.id === "communicationAddress")
    ) {
      return null;
    }

    // Handle gender dropdown
    if (f.id === "gender") {
      return (
        <select
          className={baseClasses}
          value={data[section.id]?.[f.id] || ""}
          onChange={(e) =>
            updateField(section.id, {
              ...data[section.id],
              [f.id]: e.target.value,
            })
          }
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="non-binary">Non-binary</option>
          <option value="prefer-not-to-say">Prefer not to say</option>
        </select>
      );
    }

    // Handle C/o, S/o, D/o dropdown
    if (f.id === "relationship_type") {
      return (
        <select
          className={baseClasses}
          value={data[section.id]?.[f.id] || ""}
          onChange={(e) =>
            updateField(section.id, {
              ...data[section.id],
              [f.id]: e.target.value,
            })
          }
        >
          <option value="">Select Relationship</option>
          <option value="C/o">C/o (Care of)</option>
          <option value="S/o">S/o (Son of)</option>
          <option value="D/o">D/o (Daughter of)</option>
        </select>
      );
    }

    // Handle phone fields with IDD functionality
    const isPhoneFieldWithCode =
      (section.id === "basicInfo" && f.id === "Phonenumber") ||
      (section.id === "alternateContact" && f.id === "contactPhone");

    if (isPhoneFieldWithCode) {
      return (
        <PhoneInput
          value={data[section.id]?.[f.id] || ""}
          onChange={(value) =>
            updateField(section.id, {
              ...data[section.id],
              [f.id]: value,
            })
          }
          placeholder={f.placeholder || "Enter phone number"}
          required={f.required}
          className=""
        />
      );
    }

    // For other phone-like fields
    const isPhoneField =
      (f.type === "tel" ||
        f.id.toLowerCase().includes("phone") ||
        f.id.toLowerCase().includes("mobile") ||
        f.id.toLowerCase().includes("contact")) &&
      !isPhoneFieldWithCode;

    if (isPhoneField) {
      return (
        <input
          type="tel"
          required={f.required}
          placeholder={f.placeholder || ""}
          className={baseClasses}
          value={data[section.id]?.[f.id] || ""}
          onChange={(e) =>
            updateField(section.id, {
              ...data[section.id],
              [f.id]: e.target.value,
            })
          }
        />
      );
    }

    // Handle date fields
    const isDateField =
      f.type === "date" ||
      f.id.toLowerCase().includes("date") ||
      f.id.toLowerCase().includes("birth") ||
      f.id.toLowerCase().includes("dob") ||
      f.id.toLowerCase().includes("established") ||
      f.id.toLowerCase().includes("incorporation");

    if (isDateField) {
      return (
        <ScrollDatePicker
          value={data[section.id]?.[f.id] || ""}
          onChange={(value) =>
            updateField(section.id, {
              ...data[section.id],
              [f.id]: value,
            })
          }
        />
      );
    }

    // Special handling for username field
    if (section.id === "basicInfo" && f.id === "user_name") {
      return (
        <input
          type={f.type}
          required={f.required}
          placeholder={f.placeholder || ""}
          className={`${baseClasses} ${usernameAvailable === false
            ? "border-red-500 focus:ring-red-300"
            : ""
            }`}
          value={data[section.id]?.[f.id] || ""}
          onChange={(e) => {
            const value = e.target.value.replace(/\s/g, "");
            updateField(section.id, {
              ...data[section.id],
              [f.id]: value,
            });
          }}
        />
      );
    }

    // Handle textarea for address
    if (f.id === "address") {
      return (
        <textarea
          required={f.required}
          placeholder={f.placeholder || ""}
          className={`${baseClasses} min-h-[80px]`}
          value={data[section.id]?.[f.id] || ""}
          onChange={(e) =>
            updateField(section.id, {
              ...data[section.id],
              [f.id]: e.target.value,
            })
          }
        />
      );
    }

    return (
      <input
        type={f.type}
        required={f.required}
        placeholder={f.placeholder || ""}
        className={baseClasses}
        value={data[section.id]?.[f.id] || ""}
        onChange={(e) =>
          updateField(section.id, {
            ...data[section.id],
            [f.id]: e.target.value,
          })
        }
      />
    );
  };

  // Enhanced: Render a section with checkbox at right corner for communication address
  const renderSection = (section: any) => {
    const sectionId = section.id;
    const currentSectionData = data[sectionId] || {};

    const useTwoColumns =
      sectionId === "socialMediaLinks" || sectionId === "alternateContact";

    // For basicInfo section, we want specific layout
    if (sectionId === "basicInfo") {
      // Check if Aadhar is verified to determine if fields should be read-only
      const isReadOnly = aadharVerified;

      return (
        <div
          key={sectionId}
          className="space-y-4 p-6 bg-yellow-50 rounded-xl shadow-md mb-6"
        >
          <div className="flex justify-between items-center border-b border-amber-200 pb-2">
            <h3 className="text-lg font-semibold text-slate-900">
              {section.title}
            </h3>
            {isReadOnly && (
              <div className="flex items-center text-green-600 text-sm">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Verified & Locked
              </div>
            )}
          </div>

          <div className="space-y-4">
            {/* Full Name */}
            {isReadOnly ? (
              <ReadOnlyField
                label="Full Name"
                value={data.basicInfo?.fullName || ""}
              />
            ) : (
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-slate-800 text-sm">
                  Full Name
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  required={true}
                  placeholder="Enter your full name"
                  className="border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm"
                  value={data.basicInfo?.fullName || ""}
                  onChange={(e) =>
                    updateField("basicInfo", {
                      ...data.basicInfo,
                      fullName: e.target.value,
                    })
                  }
                />
              </div>
            )}

            {/* Date of Birth */}
            {isReadOnly ? (
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-slate-800 text-sm">
                  Date of Birth
                </label>
                <ReadOnlyDateDisplay
                  value={data.basicInfo?.date_of_birth || ""}
                />
              </div>
            ) : (
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-slate-800 text-sm">
                  Date of Birth
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <ScrollDatePicker
                  value={data.basicInfo?.date_of_birth || ""}
                  onChange={(value) =>
                    updateField("basicInfo", {
                      ...data.basicInfo,
                      date_of_birth: value,
                    })
                  }
                />
              </div>
            )}

            {/* Gender */}
            {isReadOnly ? (
              <ReadOnlyField
                label="Gender"
                value={(() => {
                  const gender = data.basicInfo?.gender || "";
                  if (gender === "male") return "Male";
                  if (gender === "female") return "Female";
                  if (gender === "non-binary") return "Non-binary";
                  if (gender === "prefer-not-to-say") return "Prefer not to say";
                  return gender;
                })()}
              />
            ) : (
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-slate-800 text-sm">
                  Gender
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  className="border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm"
                  value={data.basicInfo?.gender || ""}
                  onChange={(e) =>
                    updateField("basicInfo", {
                      ...data.basicInfo,
                      gender: e.target.value,
                    })
                  }
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
            )}

            {/* C/o, S/o, D/o and Relationship Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Relationship Type */}
              {isReadOnly ? (
                <ReadOnlyField
                  label="C/o, S/o, D/o"
                  value={data.basicInfo?.relationship_type || ""}
                />
              ) : (
                <div className="flex flex-col">
                  <label className="mb-1 font-medium text-slate-800 text-sm">
                    C/o, S/o, D/o
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    className="border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm"
                    value={data.basicInfo?.relationship_type || ""}
                    onChange={(e) =>
                      updateField("basicInfo", {
                        ...data.basicInfo,
                        relationship_type: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Relationship</option>
                    <option value="C/o">C/o (Care of)</option>
                    <option value="S/o">S/o (Son of)</option>
                    <option value="D/o">D/o (Daughter of)</option>
                  </select>
                </div>
              )}

              {/* Relationship Name */}
              {isReadOnly ? (
                <ReadOnlyField
                  label="Relationship Name"
                  value={data.basicInfo?.relationship_name || ""}
                />
              ) : (
                <div className="flex flex-col">
                  <label className="mb-1 font-medium text-slate-800 text-sm">
                    Relationship Name
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    required={true}
                    placeholder="Enter relative's name"
                    className="border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm"
                    value={data.basicInfo?.relationship_name || ""}
                    onChange={(e) =>
                      updateField("basicInfo", {
                        ...data.basicInfo,
                        relationship_name: e.target.value,
                      })
                    }
                  />
                </div>
              )}
            </div>

            {/* Address */}
            {isReadOnly ? (
              <ReadOnlyTextArea
                label="Address"
                value={data.basicInfo?.address || ""}
              />
            ) : (
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-slate-800 text-sm">
                  Address
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <textarea
                  required={true}
                  placeholder="Complete address with building details"
                  className="border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm min-h-[80px]"
                  value={data.basicInfo?.address || ""}
                  onChange={(e) =>
                    updateField("basicInfo", {
                      ...data.basicInfo,
                      address: e.target.value,
                    })
                  }
                />
              </div>
            )}

            {/* City/District and Pin Code */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* City/District */}
              {isReadOnly ? (
                <ReadOnlyField
                  label="City/District"
                  value={data.basicInfo?.city_district || ""}
                />
              ) : (
                <div className="flex flex-col">
                  <label className="mb-1 font-medium text-slate-800 text-sm">
                    City/District
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    required={true}
                    placeholder="Enter city or district"
                    className="border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm"
                    value={data.basicInfo?.city_district || ""}
                    onChange={(e) =>
                      updateField("basicInfo", {
                        ...data.basicInfo,
                        city_district: e.target.value,
                      })
                    }
                  />
                </div>
              )}

              {/* Pin Code */}
              {isReadOnly ? (
                <ReadOnlyField
                  label="Pin Code"
                  value={data.basicInfo?.pincode || ""}
                />
              ) : (
                <div className="flex flex-col">
                  <label className="mb-1 font-medium text-slate-800 text-sm">
                    Pin Code
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required={true}
                    placeholder="Enter 6-digit pin code"
                    className="border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm"
                    value={data.basicInfo?.pincode || ""}
                    onChange={(e) =>
                      updateField("basicInfo", {
                        ...data.basicInfo,
                        pincode: e.target.value.replace(/[^0-9]/g, "").slice(0, 6),
                      })
                    }
                  />
                </div>
              )}
            </div>

            {/* Country and State Select for Basic Info */}
            <div className="md:col-span-2">
              {isReadOnly ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ReadOnlyField
                    label="Country"
                    value={data.basicInfo?.country || ""}
                  />
                  <ReadOnlyField
                    label="State"
                    value={data.basicInfo?.state || ""}
                  />
                </div>
              ) : (
                <CountryStateSelect
                  countryValue={data.basicInfo?.country || ""}
                  stateValue={data.basicInfo?.state || ""}
                  onCountryChange={(value) => {
                    console.log("🟡 Step1 - Basic Info Country changed to:", value);
                    updateField("basicInfo", {
                      ...data.basicInfo,
                      country: value,
                      state: "",
                    });
                  }}
                  onStateChange={(value) => {
                    console.log("🟡 Step1 - Basic Info State changed to:", value);
                    updateField("basicInfo", {
                      ...data.basicInfo,
                      state: value,
                    });
                  }}
                  countryRequired={true}
                  stateRequired={true}
                />
              )}
            </div>
          </div>
        </div>
      );
    }

    // ENHANCED: Communication Address Information Section with checkbox at right corner
    if (sectionId === "communicationAddress") {
      // Check if basic info is filled
      const isBasicInfoFilled = checkBasicInfoAddressFilled();

      return (
        <div
          key={sectionId}
          className="space-y-4 p-6 bg-yellow-50 rounded-xl shadow-md mb-6"
        >
          {/* Header with checkbox at the right corner */}
          <div className="flex justify-between items-center border-b border-amber-200 pb-2">
            <h3 className="text-lg font-semibold text-slate-900">
              Communication Address Information
            </h3>

            <div className="flex items-center space-x-2">
              {/* {!isBasicInfoFilled && !copyAddress && (
                <div className="text-xs text-gray-500">
                  Fill Basic Info first
                </div>
              )} */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="copyAddress"
                  checked={copyAddress}
                  onChange={(e) => handleCopyAddressChange(e.target.checked)}
                  disabled={!isBasicInfoFilled && !copyAddress}
                  className={`w-4 h-4 text-amber-600 border-amber-300 rounded focus:ring-amber-500 cursor-pointer`}
                />
                <label
                  htmlFor="copyAddress"
                  className={`ml-2 text-sm whitespace-nowrap text-slate-700 cursor-pointer`}
                >
                  Same as the above mentioned information
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Address */}
            <div className="flex flex-col">
              <label className="mb-1 font-medium text-slate-800 text-sm">
                Address
                <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                required={true}
                placeholder="Complete communication address with building details"
                className={`border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm min-h-[80px] `}
                value={data.communicationAddress?.address || ""}
                onChange={(e) =>
                  updateField("communicationAddress", {
                    ...data.communicationAddress,
                    address: e.target.value,
                  })
                }
              // disabled={copyAddress}
              // readOnly={copyAddress}
              />
              <div className="text-xs text-gray-500 mt-1">
                Complete communication address with building details
              </div>
              {copyAddress && (
                <div className="text-xs text-green-600 mt-1 flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Auto-filled from Basic Information
                </div>
              )}
            </div>

            {/* City Section */}
            <h3 className="text-md font-medium text-slate-800 -mb-2">City</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-slate-800 text-sm">
                  Your city
                </label>
                <input
                  type="text"
                  placeholder="Your city"
                  className={`border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm `}
                  value={data.communicationAddress?.city || ""}
                  onChange={(e) =>
                    updateField("communicationAddress", {
                      ...data.communicationAddress,
                      city: e.target.value,
                    })
                  }
                // disabled={copyAddress}
                // readOnly={copyAddress}
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1 font-medium text-slate-800 text-sm">
                  Postal Code
                  <span className="text-red-500 ml-1">*</span>
                </label>

                <input
                  type="text"
                  required={true}
                  maxLength={6}
                  placeholder="Postal code"
                  className={`border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm`}
                  value={data.communicationAddress?.postalCode || ""}
                  onChange={(e) => {
                    // Allow only numbers and max 6 digits
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);

                    updateField("communicationAddress", {
                      ...data.communicationAddress,
                      postalCode: value,
                    });

                    // Auto-detect state when postal code is entered
                    if (value.length === 6) {
                      const detectedState = getStateFromPincode(value);
                      if (detectedState && !copyAddress) {
                        setTimeout(() => {
                          updateField("communicationAddress", {
                            ...data.communicationAddress,
                            state: detectedState,
                            postalCode: value,
                          });
                        }, 100);
                      }
                    }
                  }}
                // disabled={copyAddress}
                // readOnly={copyAddress}
                />
                <div className="text-xs text-gray-500 mt-1">
                  Postal code
                </div>
              </div>
            </div>

            {/* Country and State - Using reusable component */}
            <div className="md:col-span-2">
              <CountryStateSelect
                countryValue={data.communicationAddress?.country || ""}
                stateValue={data.communicationAddress?.state || ""}
                onCountryChange={(value) =>
                  updateField("communicationAddress", {
                    ...data.communicationAddress,
                    country: value,
                    state: "", // Reset state when country changes
                  })
                }
                onStateChange={(value) =>
                  updateField("communicationAddress", {
                    ...data.communicationAddress,
                    state: value,
                  })
                }
                countryRequired={true}
                stateRequired={true}
              // disabled={copyAddress}
              />
            </div>

            {/* Show success message when state is auto-detected or copied */}
            {data.communicationAddress?.state && !copyAddress && (
              data.communicationAddress?.postalCode &&
              data.communicationAddress?.postalCode.length === 6 &&
              getStateFromPincode(data.communicationAddress.postalCode) === data.communicationAddress.state && (
                <div className="text-xs text-green-600 mt-1 flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  State auto-detected from postal code
                </div>
              )
            )}
          </div>
        </div>
      );
    }

    // For addressInformation section - Split into two sections
    if (sectionId === "addressInformation") {
      return (
        <div key={sectionId} className="space-y-6 mb-6">
          {/* Section 1: Contact Information */}
          <div className="space-y-4 p-6 bg-yellow-50 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold text-slate-900 border-b border-amber-200 pb-2">
              Professional Information
            </h3>

            <div className="space-y-4">
              {/* User Name */}
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-slate-800 text-sm">
                  User Name
                  <span className="text-red-500 ml-1">*</span>
                  <span className="ml-2 text-blue-500">https://www.dronetv.in/professional/{data.basicInfo?.user_name}</span>
                </label>
                <input
                  type="text"
                  required={true}
                  placeholder="Enter your username"
                  className={`border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm ${usernameAvailable === false
                    ? "border-red-500 focus:ring-red-300"
                    : ""
                    }`}
                  value={data.basicInfo?.user_name || ""}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\s/g, "");
                    updateField("basicInfo", {
                      ...data.basicInfo,
                      user_name: value,
                    });
                  }}
                />
                {data.basicInfo?.user_name && (
                  <span
                    className={`text-xs mt-1 ${usernameAvailable === false
                      ? "text-red-600"
                      : usernameAvailable === true
                        ? "text-green-600"
                        : "text-gray-600"
                      }`}
                  >
                    {checking
                      ? "Checking availability..."
                      : usernameAvailable === false
                        ? "❌ Username is taken"
                        : usernameAvailable === true &&
                          originalUsername &&
                          data.basicInfo.user_name === originalUsername
                          ? "✅ Your username"
                          : usernameAvailable === true
                            ? "✅ Username is available"
                            : ""}
                  </span>
                )}
              </div>

              {/* Email */}
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-slate-800 text-sm">
                  Email
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="email"
                  required={true}
                  placeholder="Enter your email address"
                  className="border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm"
                  value={data.addressInformation?.email || ""}
                  onChange={(e) =>
                    updateField("addressInformation", {
                      ...data.addressInformation,
                      email: e.target.value,
                    })
                  }
                />
              </div>

              {/* Phone Number */}
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-slate-800 text-sm">
                  Phone Number
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <PhoneInput
                  value={data.addressInformation?.phoneNumber || ""}
                  onChange={(value) =>
                    updateField("addressInformation", {
                      ...data.addressInformation,
                      phoneNumber: value,
                    })
                  }
                  placeholder="Enter phone number"
                  required={true}
                  className=""
                />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {/* Nationality/Country of Citizenship */}
            <div className="flex flex-col">
              <label className="mb-1 font-medium text-slate-800 text-sm">
                Nationality/Country of Citizenship
                <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                className="border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm"
                value={data.addressInformation?.nationality || ""}
                onChange={(e) =>
                  updateField("addressInformation", {
                    ...data.addressInformation,
                    nationality: e.target.value,
                  })
                }
              >
                <option value="">Select Nationality</option>
                <option value="indian">Indian</option>
                <option value="american">American</option>
                <option value="british">British</option>
                <option value="canadian">Canadian</option>
                <option value="australian">Australian</option>
                <option value="german">German</option>
                <option value="french">French</option>
                <option value="japanese">Japanese</option>
                <option value="chinese">Chinese</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Section 2: Professional Details */}
            <div className="space-y-4 p-6 bg-yellow-50 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold text-slate-900 border-b border-amber-200 pb-2">
                Professional Details
              </h3>



              {/* Profile Title/Designation */}
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-slate-800 text-sm">
                  Profile Title/Designation
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  required={true}
                  placeholder="e.g., Software Engineer, Marketing Manager, Consultant"
                  className="border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm"
                  value={data.addressInformation?.designation || ""}
                  onChange={(e) =>
                    updateField("addressInformation", {
                      ...data.addressInformation,
                      designation: e.target.value,
                    })
                  }
                />
              </div>

              {/* Professional Tagline */}
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-slate-800 text-sm">
                  Professional Tagline
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  required={true}
                  placeholder="A short, catchy phrase that describes your professional expertise"
                  className="border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm"
                  value={data.addressInformation?.tagline || ""}
                  onChange={(e) =>
                    updateField("addressInformation", {
                      ...data.addressInformation,
                      tagline: e.target.value,
                    })
                  }
                />
                <p className="text-xs text-gray-500 mt-1">
                  Example: "Transforming ideas into digital solutions" or "Building bridges between businesses and customers"
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        key={sectionId}
        className="space-y-4 p-6 bg-yellow-50 rounded-xl shadow-md mb-6"
      >
        <h3 className="text-lg font-semibold text-slate-900 border-b border-amber-200 pb-2">
          {section.title}
        </h3>

        {useTwoColumns ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {section.fields?.map((f: any) => {
              if (f.id === "country" || f.id === "state") return null;
              if (f.id === "aadhar_number") return null; // Skip Aadhar field in basic info

              const isDateField =
                f.type === "date" ||
                f.id.toLowerCase().includes("date") ||
                f.id.toLowerCase().includes("birth") ||
                f.id.toLowerCase().includes("dob") ||
                f.id.toLowerCase().includes("established") ||
                f.id.toLowerCase().includes("incorporation");

              return (
                <div key={f.id} className="flex flex-col">
                  {!isDateField && (
                    <label className="mb-1 font-medium text-slate-800 text-sm">
                      {f.label}
                      {f.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                  )}
                  {renderInputField(f, section)}
                </div>
              );
            })}

            {section.fields?.some(
              (f: any) => f.id === "country" || f.id === "state"
            ) && (
                <div className="md:col-span-2">
                  <CountryStateSelect
                    countryValue={currentSectionData.country || ""}
                    stateValue={currentSectionData.state || ""}
                    onCountryChange={(value) => {
                      console.log("🟡 Step1 - Country changed to:", value);
                      updateField(sectionId, {
                        ...currentSectionData,
                        country: value,
                        state: "",
                      });
                    }}
                    onStateChange={(value) => {
                      console.log("🟡 Step1 - State changed to:", value);
                      updateField(sectionId, {
                        ...currentSectionData,
                        state: value,
                      });
                    }}
                    countryRequired={
                      section.fields.find((f: any) => f.id === "country")
                        ?.required
                    }
                    stateRequired={
                      section.fields.find((f: any) => f.id === "state")?.required
                    }
                  />
                </div>
              )}
          </div>
        ) : (
          <div className="space-y-4">
            {section.fields?.map((f: any) => {
              if (f.id === "country" || f.id === "state") return null;
              if (f.id === "aadhar_number") return null; // Skip Aadhar field in basic info

              const isDateField =
                f.type === "date" ||
                f.id.toLowerCase().includes("date") ||
                f.id.toLowerCase().includes("birth") ||
                f.id.toLowerCase().includes("dob") ||
                f.id.toLowerCase().includes("established") ||
                f.id.toLowerCase().includes("incorporation");

              return (
                <div key={f.id} className="flex flex-col">
                  {!isDateField && (
                    <label className="mb-1 font-medium text-slate-800 text-sm">
                      {f.label}
                      {f.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                  )}
                  {renderInputField(f, section)}
                </div>
              );
            })}

            {section.fields?.some(
              (f: any) => f.id === "country" || f.id === "state"
            ) && (
                <CountryStateSelect
                  countryValue={currentSectionData.country || ""}
                  stateValue={currentSectionData.state || ""}
                  onCountryChange={(value) => {
                    console.log("🟡 Step1 - Country changed to:", value);
                    updateField(sectionId, {
                      ...currentSectionData,
                      country: value,
                      state: "",
                    });
                  }}
                  onStateChange={(value) => {
                    console.log("🟡 Step1 - State changed to:", value);
                    updateField(sectionId, {
                      ...currentSectionData,
                      state: value,
                    });
                  }}
                  countryRequired={
                    section.fields.find((f: any) => f.id === "country")?.required
                  }
                  stateRequired={
                    section.fields.find((f: any) => f.id === "state")?.required
                  }
                />
              )}
          </div>
        )}
      </div>
    );
  };

  // Reorder sections to desired sequence: Basic Info -> Communication Address -> Communication Information
  const getOrderedSections = () => {
    if (!step.sections) return [];

    const basicInfo = step.sections.find((s: any) => s.id === "basicInfo");
    const communicationAddress = step.sections.find(
      (s: any) => s.id === "communicationAddress"
    ) || {
      id: "communicationAddress",
      title: "Communication Address Information"
    };
    const addressInfo = step.sections.find(
      (s: any) => s.id === "addressInformation"
    );
    const alternateContact = step.sections.find(
      (s: any) => s.id === "alternateContact"
    );
    const socialMedia = step.sections.find(
      (s: any) => s.id === "socialMediaLinks"
    );

    return [basicInfo, communicationAddress, addressInfo, alternateContact, socialMedia].filter(
      Boolean
    );
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-amber-900 border-b border-amber-300 pb-2 mb-6">
        {step.title}
      </h2>

      {step.categories && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-3">
            Professional Category
          </h3>
          <p className="text-sm text-slate-600 mb-4">
            Select your Professional's main business category (you can select
            multiple)
          </p>
          <div className="flex justify-center">
            <MultiSelect
              options={step.categories.available}
              selected={data.categories}
              onChange={(vals) => updateField("categories", vals)}
              variant="categories"
            />
          </div>
        </div>
      )}

      {/* Aadhar Verification Section inspired by Image 0 */}
      <div className="space-y-4 p-6 bg-yellow-50 rounded-xl shadow-md mb-6 transition-all duration-300">
        <h3 className="text-lg font-semibold text-slate-900">
          Aadhar Verification
        </h3>
        <hr className="border-amber-200" />

        {(!aadharVerified && !digiLockerSuccess) ? (
          <div className="pt-2 animate-fade-in">
            <h4 className="text-md font-bold text-slate-900">Verify Through Aadhar</h4>
            <p className="text-sm text-slate-600 mt-1">
              Automatically fill your basic information using DigiLocker
            </p>

            <div className="flex flex-col md:flex-row md:items-center justify-between mt-8 gap-6 bg-white/50 p-4 rounded-xl border border-amber-100">
              <div className="flex flex-col">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="aadharConsent"
                    checked={aadharConsent}
                    onChange={(e) => setAadharConsent(e.target.checked)}
                    className="w-5 h-5 text-blue-600 border-amber-300 rounded focus:ring-blue-500 cursor-pointer transition-colors"
                  />
                  <label
                    htmlFor="aadharConsent"
                    className="text-slate-700 font-medium cursor-pointer select-none"
                  >
                    I consent to Aadhar verification
                  </label>
                </div>
                <button
                  className="text-blue-600 text-sm font-medium mt-1 flex items-center hover:underline ml-8 group text-left"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowConsentModal(true);
                  }}
                  type="button"
                >
                  View consent details <ChevronDown className="w-4 h-4 ml-1 group-hover:translate-y-0.5 transition-transform" />
                </button>
              </div>

              <button
                onClick={handleDigiLockerLogin}
                disabled={!aadharConsent || digiLockerLoading || isPollingDigiLocker}
                className={`px-8 py-3.5 rounded-xl font-bold text-white transition-all transform active:scale-[0.98]
                  ${aadharConsent && !digiLockerLoading && !isPollingDigiLocker
                    ? "bg-[#4F9CF9] hover:bg-blue-500 shadow-lg shadow-blue-200"
                    : "bg-blue-300 cursor-not-allowed opacity-70"
                  } flex items-center justify-center min-w-[220px]`}
              >
                {digiLockerLoading || isPollingDigiLocker ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connecting...
                  </>
                ) : (
                  "Fill Aadhar Details"
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Verified State - Sleek and premium looking */
          <div className="pt-2 animate-fade-in">
            <div className="flex flex-col md:flex-row items-center justify-between p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200 shadow-sm gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-100">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-green-900">Aadhar Verified</h4>
                  <p className="text-sm text-green-700 font-medium">Identity successfully verified via DigiLocker</p>
                </div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm px-6 py-3 rounded-xl border border-green-100 text-center md:text-right min-w-[200px]">
                <p className="text-[10px] text-green-800 uppercase font-black tracking-[0.2em] mb-1">Aadhar Number</p>
                <p className="text-2xl font-mono font-bold text-green-900 tracking-widest">{data.basicInfo?.aadhar_number}</p>
              </div>
            </div>
          </div>
        )}

        {digiLockerError && !aadharVerified && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200 flex items-start gap-3 animate-shake">
            <svg className="w-5 h-5 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-bold">Verification Failed</p>
              <p className="opacity-90">{digiLockerError}</p>
            </div>
          </div>
        )}
      </div>

      {/* Render All Sections in Correct Order */}
      {step.sections ? (
        getOrderedSections().map(renderSection)
      ) : (
        <div className="space-y-4 p-6 bg-yellow-50 rounded-xl shadow-md">
          <div className="space-y-4">
            {/* Basic Info fields as per new structure */}
            <div className="flex flex-col">
              <label className="mb-1 font-semibold text-slate-900 text-sm">
                Full Name
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                required={true}
                placeholder="Enter your full name"
                className="border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm"
                value={data.basicInfo?.fullName || ""}
                onChange={(e) =>
                  updateField("basicInfo", {
                    ...data.basicInfo,
                    fullName: e.target.value,
                  })
                }
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1 font-semibold text-slate-900 text-sm">
                Date of Birth
                <span className="text-red-500 ml-1">*</span>
              </label>
              <ScrollDatePicker
                value={data.basicInfo?.date_of_birth || ""}
                onChange={(value) =>
                  updateField("basicInfo", {
                    ...data.basicInfo,
                    date_of_birth: value,
                  })
                }
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1 font-semibold text-slate-900 text-sm">
                Gender
                <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                className="border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm"
                value={data.basicInfo?.gender || ""}
                onChange={(e) =>
                  updateField("basicInfo", {
                    ...data.basicInfo,
                    gender: e.target.value,
                  })
                }
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non-binary">Non-binary</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="mb-1 font-semibold text-slate-900 text-sm">
                  C/o, S/o, D/o
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  className="border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm"
                  value={data.basicInfo?.relationship_type || ""}
                  onChange={(e) =>
                    updateField("basicInfo", {
                      ...data.basicInfo,
                      relationship_type: e.target.value,
                    })
                  }
                >
                  <option value="">Select Relationship</option>
                  <option value="C/o">C/o (Care of)</option>
                  <option value="S/o">S/o (Son of)</option>
                  <option value="D/o">D/o (Daughter of)</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="mb-1 font-semibold text-slate-900 text-sm">
                  Relationship Name
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  required={true}
                  placeholder="Enter relative's name"
                  className="border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm"
                  value={data.basicInfo?.relationship_name || ""}
                  onChange={(e) =>
                    updateField("basicInfo", {
                      ...data.basicInfo,
                      relationship_name: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="mb-1 font-semibold text-slate-900 text-sm">
                Address
                <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                required={true}
                placeholder="Complete address with building details"
                className="border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm min-h-[80px]"
                value={data.basicInfo?.address || ""}
                onChange={(e) =>
                  updateField("basicInfo", {
                    ...data.basicInfo,
                    address: e.target.value,
                  })
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="mb-1 font-semibold text-slate-900 text-sm">
                  City/District
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  required={true}
                  placeholder="Enter city or district"
                  className="border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm"
                  value={data.basicInfo?.city_district || ""}
                  onChange={(e) =>
                    updateField("basicInfo", {
                      ...data.basicInfo,
                      city_district: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1 font-semibold text-slate-900 text-sm">
                  Pin Code
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required={true}
                  placeholder="Enter 6-digit pin code"
                  className="border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm"
                  value={data.basicInfo?.pincode || ""}
                  onChange={(e) =>
                    updateField("basicInfo", {
                      ...data.basicInfo,
                      pincode: e.target.value.replace(/[^0-9]/g, "").slice(0, 6),
                    })
                  }
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <CountryStateSelect
                countryValue={data.basicInfo?.country || ""}
                stateValue={data.basicInfo?.state || ""}
                onCountryChange={(value) => {
                  console.log("🟡 Step1 - Basic Info Country changed to:", value);
                  updateField("basicInfo", {
                    ...data.basicInfo,
                    country: value,
                    state: "",
                  });
                }}
                onStateChange={(value) => {
                  console.log("🟡 Step1 - Basic Info State changed to:", value);
                  updateField("basicInfo", {
                    ...data.basicInfo,
                    state: value,
                  });
                }}
                countryRequired={true}
                stateRequired={true}
              />
            </div>
          </div>
        </div>
      )}

      {/* OTP Verification Modal */}
      {/* {showOtpModal && data.basicInfo?.aadhar_number && (
        <OTPVerificationModal
          aadharNumber={data.basicInfo.aadhar_number}
          onVerify={handleOtpVerify}
          onClose={() => setShowOtpModal(false)}
          onResend={handleOtpResend}
        />
      )} */}

      {/* Redirect Modal */}
      {showRedirectModal && (
        <RedirectModal onClose={() => window.close()} />
      )}

      {/* Consent Details Modal */}
      {showConsentModal && (
        <ConsentModal onClose={() => setShowConsentModal(false)} />
      )}
    </>
  );
};