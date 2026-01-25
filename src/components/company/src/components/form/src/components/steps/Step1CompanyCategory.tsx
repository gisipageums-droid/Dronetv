import React, { useState, useRef, useEffect } from "react";
import { StepProps } from "../../types/form";
import { Building2, User, Phone, Globe, Mail, AlertCircle, ChevronDown, CheckCircle, Calendar, Upload, Lock, MapPin, Briefcase, FileText, X, Edit2, ExternalLink } from "lucide-react";
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
  setIsScrolling: (value: boolean) => void;
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

// Custom Read-only Date Display
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

// Custom Personal Information Date Picker
const PersonalDatePicker: React.FC<{
  value: string;
  onChange: (date: string) => void;
  disabled?: boolean;
}> = ({ value, onChange, disabled = false }) => {
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
    if (disabled) return;

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
    if (disabled) return;

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
  }, [disabled]);

  return (
    <div className={`bg-white border rounded-xl p-4 ${disabled ? 'border-gray-300 bg-gray-50' : 'border-amber-200'}`}>
      <div className="text-center mb-4">
        <h3 className="font-semibold text-gray-800">Date of Birth</h3>
        <p className="text-xs text-gray-600 mt-1">
          Select your date of birth
        </p>
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
        <div className="absolute left-0 right-0 top-20 transform -translate-y-1/2 h-8 bg-amber-100 border-2 border-amber-300 rounded-lg pointer-events-none"></div>

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

// Custom Personal Information Date Picker
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
        <h3 className="font-semibold text-gray-800">Date of Incorporation</h3>
        <p className="text-xs text-gray-600 mt-1">
          Select your company's incorporation date
        </p>
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
        <div className="absolute left-0 right-0 top-20 transform -translate-y-1/2 h-8 bg-amber-100 border-2 border-amber-300 rounded-lg pointer-events-none date-picker-highlight"></div>

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

interface NameWithTitleProps {
  label: string;
  titleValue: string;
  nameValue: string;
  onTitleChange: (value: string) => void;
  onNameChange: (value: string) => void;
  required?: boolean;
  namePlaceholder?: string;
  disabled?: boolean;
  nameDisabled?: boolean;
}

const NameWithTitle: React.FC<NameWithTitleProps> = ({
  label,
  titleValue,
  nameValue,
  onTitleChange,
  onNameChange,
  required = false,
  namePlaceholder = "Full name",
  disabled = false,
  nameDisabled = false
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
      <div className={`flex items-stretch border rounded-lg transition-colors ${disabled || nameDisabled ? 'border-gray-300 bg-gray-50' : 'border-gray-300 hover:border-amber-400 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500'}`}>
        <div className="relative flex-shrink-0">
          <select
            value={titleValue || ''}
            onChange={(e) => onTitleChange(e.target.value)}
            disabled={disabled}
            className="h-10 pl-3 pr-8 text-sm bg-white border-0 rounded-l-lg focus:outline-none focus:ring-0 appearance-none text-gray-700 disabled:bg-gray-50 disabled:text-gray-500"
            style={{ minWidth: '80px' }}
          >
            {genderOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-px bg-gray-300 group-hover:bg-gray-400 transition-colors"></div>
        </div>

        <div className="flex-1">
          <input
            type="text"
            value={nameValue}
            onChange={(e) => onNameChange(e.target.value)}
            disabled={nameDisabled}
            required={required && !nameDisabled}
            placeholder={namePlaceholder}
            className="w-full h-10 px-3 text-sm border-0 rounded-r-lg focus:outline-none focus:ring-0 text-gray-700 placeholder-gray-400 bg-white disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>
      </div>
    </div>
  );
};

// Reusable Consent Modal Component
const ConsentModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999999999999999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full max-h-[85vh] overflow-hidden flex flex-col border border-blue-100 pb-2 animate-scale-in">
        {/* Modal Header */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white">
          <h2 className="text-xl font-bold text-slate-800">User Consent for Identity Verification</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors text-slate-400 hover:text-slate-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto bg-white">
          <div className="text-sm text-slate-700 space-y-6">
            <p className="leading-relaxed">
              By proceeding, I hereby provide my explicit and informed consent to <strong>DroneTV (dronetv.in)</strong> to collect, use, and verify my Aadhar/Company information for the limited purpose of identity and profile verification on the platform.
            </p>

            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 text-base">Purpose of Collection</h3>
              <p className="font-medium text-slate-600">My information will be used solely for:</p>
              <ul className="space-y-2">
                {[
                  "Verifying my identity and/or company details",
                  "Listing my professional profile or company on DroneTV",
                  "Establishing authenticity and trust for platform users",
                  "Compliance with applicable Indian laws and regulations"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-600 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-base">Information Collected</h3>

              <div className="space-y-3">
                <h4 className="font-semibold text-slate-800">For Individuals (Professionals)</h4>
                <p className="text-slate-600">With my consent, DroneTV may access and verify the following information:</p>
                <ul className="space-y-2">
                  {[
                    "Name, Date of birth, and Address",
                    "Aadhaar-based identity details through OTP authentication",
                    "Documents shared via DigiLocker (such as Aadhaar, PAN, or professional certificates)"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-600 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2">
                <h4 className="font-semibold text-slate-800 mb-1">For Companies</h4>
                <p className="text-slate-700 italic text-[1.05rem]">
                  Company verification details will be provided separately during the GST verification process.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <p className="text-slate-600 text-[0.85rem]">
                By checking the consent box, you acknowledge that you have read, understood, and agree to these terms of identity verification.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-2 bg-[#2563EB] text-white font-medium rounded-md hover:bg-blue-700 transition-all shadow-sm active:scale-[0.98]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// UPDATED: Combined Aadhar Section with SINGLE LINE HORIZONTAL LAYOUT
const CombinedAadharSection: React.FC<{
  aadharNumber: string;
  onAadharChange: (value: string) => void;
  onVerifyAadhar: () => void;
  isVerified: boolean;
  isVerifying: boolean;
  onDataVerified?: (data: any) => void;
  onConsentChange?: (checked: boolean) => void;
  consentAccepted?: boolean;
  onDigiLockerLogin: () => void;
}> = ({ aadharNumber, onAadharChange, onVerifyAadhar, isVerified, isVerifying, onDataVerified, onConsentChange, consentAccepted, onDigiLockerLogin }) => {
  const [localConsent, setLocalConsent] = useState(false);
  const [showAadharField, setShowAadharField] = useState(false);
  const [digiLockerClicked, setDigiLockerClicked] = useState(false);
  const [showConsentDetails, setShowConsentDetails] = useState(false);

  const formatAadharNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');

    // Format as XXXX-XXXX-XXXX
    if (digits.length <= 4) {
      return digits;
    } else if (digits.length <= 8) {
      return `${digits.slice(0, 4)}-${digits.slice(4)}`;
    } else {
      return `${digits.slice(0, 4)}-${digits.slice(4, 8)}-${digits.slice(8, 12)}`;
    }
  };

  const handleChange = (value: string) => {
    const formatted = formatAadharNumber(value);
    onAadharChange(formatted);
  };

  const handleConsentChange = (checked: boolean) => {
    setLocalConsent(checked);

    if (onConsentChange) {
      onConsentChange(checked);
    }

    // Reset DigiLocker click state if consent is unchecked
    if (!checked) {
      setDigiLockerClicked(false);
      setShowAadharField(false);
      setShowConsentDetails(false);
    }
  };

  const handleDigiLockerClick = () => {
    if (!localConsent) return;

    // Set that DigiLocker button was clicked
    setDigiLockerClicked(true);
    setShowAadharField(true);

    // Call the original DigiLocker login function
    onDigiLockerLogin();
  };

  // NEW: Auto-verify when Aadhar number is complete
  useEffect(() => {
    if (aadharNumber.replace(/\D/g, '').length === 12 && !isVerified) {
      // Simulate API call to verify Aadhar
      const verifyData = {
        fullName: "Kavali Jayanth Sree Kumar",
        dateOfBirth: "2002-09-25",
        gender: "Male",
        relationshipType: "C/o",
        relationshipName: "Kavali Venkatesh",
        address: "H No 13-153 NLB Nagar Quthbullapur, Near Hanuman Temple Shapur Nagar Jeedimetla",
        city: "Medchal-malkajgiri",
        postalCode: "500055",
        country: "India",
        state: "Telangana",
        phoneNumber: "+91 9876543210",
        email: "jayanth.kavali@example.com"
      };

      if (onDataVerified) {
        onDataVerified(verifyData);
      }
    }
  }, [aadharNumber, isVerified, onDataVerified]);

  // Hide Aadhar field when verification is complete
  useEffect(() => {
    if (isVerified) {
      setShowAadharField(false);
    }
  }, [isVerified]);

  return (
    <div className="bg-[#FFF9E5] border border-amber-200 rounded-xl p-6 shadow-sm">
      <div className="border-b border-amber-200 pb-3 mb-4 flex justify-between items-center">
        <h3 className="text-slate-900 font-semibold select-none">
          Aadhar Verification
        </h3>
        {isVerified && (
          <div className="flex items-center text-green-600">
            <CheckCircle className="w-4 h-4 mr-1" />
            <span className="text-xs font-medium">Verified</span>
          </div>
        )}
      </div>

      {/* SINGLE LINE HORIZONTAL LAYOUT */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
        {/* LEFT SIDE: DigiLocker Banner and Consent - Single line layout */}
        <div className="flex-1">
          <div className="mb-3">
            <h3 className="font-semibold text-slate-900 text-base">Verify Through Aadhar</h3>
            <p className="text-slate-600 text-sm mt-0.5">Automatically fill your basic information using DigiLocker</p>
          </div>

          {/* Single line with checkbox, terms link and button side by side */}
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-start space-x-2">
              <div className="flex items-center h-5 mt-0.5">
                <input
                  id="aadhar-consent-checkbox"
                  type="checkbox"
                  checked={localConsent}
                  onChange={(e) => handleConsentChange(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-300 rounded cursor-pointer"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="aadhar-consent-checkbox" className="text-sm text-slate-800 cursor-pointer">
                  I consent to Aadhar verification
                </label>
                <button
                  type="button"
                  onClick={() => setShowConsentDetails(true)}
                  className="text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-center mt-1 text-left"
                >
                  View consent details
                  <ChevronDown className="w-3 h-3 ml-1" />
                </button>
              </div>
            </div>

            <button
              onClick={handleDigiLockerClick}
              type="button"
              disabled={!localConsent}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 whitespace-nowrap ${localConsent
                ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                : 'bg-blue-300 text-white cursor-not-allowed'
                }`}
            >
              Fill Aadhar Details
            </button>
          </div>

          {/* Helper text for Aadhar verification */}
          {!isVerified && localConsent && (
            <div className="mt-3">
              <p className="text-[10px] text-blue-600">
                Click "Fill Aadhar Details" to redirect to DigiLocker for secure verification.
              </p>
            </div>
          )}
          {!isVerified && !localConsent && (
            <div className="mt-3">
              <p className="text-[10px] text-blue-600">
                Please select the consent checkbox to enable Aadhar verification.
              </p>
            </div>
          )}

          {/* Consent Details Modal */}
          <ConsentModal
            isOpen={showConsentDetails}
            onClose={() => setShowConsentDetails(false)}
          />
        </div>

        {/* COMMENTED OUT: Aadhar Number Input - User requested to remove input field but keep button for DigiLocker redirect */}
        {/* {showAadharField && !isVerified && (
          <div className="flex-1 md:max-w-xs">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-700">
                Aadhar Number <span className="text-red-500">*</span>
              </label>
              <div>
                <input
                  type="text"
                  value={aadharNumber}
                  onChange={(e) => handleChange(e.target.value)}
                  placeholder="XXXX-XXXX-XXXX"
                  disabled={isVerified}
                  className="w-full h-10 px-3 text-sm border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-slate-800 placeholder-slate-400 bg-white disabled:bg-amber-50 disabled:text-slate-500"
                  maxLength={14}
                />
              </div>
            </div>
          </div>
        )} */}

        {/* Show Aadhar number display when verified */}
        {isVerified && (
          <div className="flex-1 md:max-w-xs">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-700">
                Aadhar Number <span className="text-green-600">✓</span>
              </label>
              <div className="w-full h-10 px-3 text-sm border border-green-300 rounded-lg bg-green-50 flex items-center">
                <span className="text-slate-800">{aadharNumber}</span>
                <CheckCircle className="w-4 h-4 ml-2 text-green-600" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// NEW: PAN Verification Section with manual inputs
const PANVerificationSection: React.FC<{
  panNumber: string;
  onPanChange: (value: string) => void;
  fullName: string;
  onNameChange: (value: string) => void;
  dob: string;
  onDobChange: (value: string) => void;
  onVerify: () => void;
  isVerifying: boolean;
  isVerified: boolean;
}> = ({ panNumber, onPanChange, fullName, onNameChange, dob, onDobChange, onVerify, isVerifying, isVerified }) => {
  return (
    <div className="mb-6 p-4 bg-white border border-blue-200 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-bold text-slate-900">
          PAN Verification
        </h3>
        {isVerified && <span className="text-xs text-green-600 flex items-center"><CheckCircle className="w-3 h-3 mr-1" /> Verified</span>}
      </div>
      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormInput
            label="PAN Number"
            value={panNumber}
            onChange={(value) => onPanChange(value.toUpperCase())}
            placeholder="Enter PAN Number"
            maxLength={10}
            disabled={isVerified}
          />
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-700">Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => onDobChange(e.target.value)}
              disabled={isVerified}
              className="w-full h-10 px-3 text-sm border border-gray-200 rounded bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 disabled:bg-gray-50 disabled:text-slate-500"
            />
          </div>
        </div>
        <FormInput
          label="Full Name (as on PAN)"
          value={fullName}
          onChange={onNameChange}
          placeholder="Enter Name"
          disabled={isVerified}
        />

        {!isVerified && (
          <button
            type="button"
            onClick={onVerify}
            disabled={isVerifying || !panNumber || !fullName || !dob}
            className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isVerifying ? "Verifying..." : "Verify PAN"}
          </button>
        )}
      </div>
    </div>
  );
};

// UPDATED: GST Verification Section Component with State & Pincode from API and Manual Address
const GSTVerificationSection: React.FC<{
  gstNumber: string;
  onGSTChange: (value: string) => void;
  onVerifyGST: () => void;
  formData: any;
  updateFormData: (data: any) => void;
  isVerified: boolean;
  isVerifying: boolean;
  verifiedData?: {
    companyName: string;
    legalName: string;
    gstNumber: string;
    companyAddress: string;
    state: string;
    registrationDate: string;
    businessType: string;
    pincode?: string;
    cin?: string;
    udyamRegistrationNumber?: string;
    pan?: string;
  };
  address: string;
  onAddressChange: (value: string) => void;
  onVerifiedDataChange?: (data: any) => void;
  // PAN Props
  panNumber: string;
  onPanChange: (value: string) => void;
  panName: string;
  onPanNameChange: (value: string) => void;
  panDob: string;
  onPanDobChange: (value: string) => void;
  onVerifyPAN: () => void;
  isVerifyingPAN: boolean;
  isPANVerified: boolean;
}> = ({ gstNumber, onGSTChange, onVerifyGST, isVerified, isVerifying, verifiedData, address, onAddressChange, onVerifiedDataChange, formData, updateFormData,
  panNumber, onPanChange, panName, onPanNameChange, panDob, onPanDobChange, onVerifyPAN, isVerifyingPAN, isPANVerified
}) => {
    const [localConsent, setLocalConsent] = useState(false);
    const [showConsentDetails, setShowConsentDetails] = useState(false);

    const formatGSTNumber = (value: string) => {
      // Remove all non-alphanumeric characters
      const cleaned = value.replace(/[^a-zA-Z0-9]/g, '');
      // GST format: 22AAAAA0000A1Z5 (15 characters)
      return cleaned.toUpperCase();
    };

    const handleChange = (value: string) => {
      const formatted = formatGSTNumber(value);
      onGSTChange(formatted);
    };

    const handleConsentChange = (checked: boolean) => {
      setLocalConsent(checked);
      if (!checked) {
        setShowConsentDetails(false);
      }
    };

    const isValidFormat = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gstNumber);
    const isValidLength = gstNumber.length === 15;
    const isValidGST = isValidFormat && isValidLength;

    // Load verified GST data from localStorage on component mount (excluding GST number)
    React.useEffect(() => {
      const savedGSTData = localStorage.getItem('verifiedGSTData');
      if (savedGSTData) {
        try {
          const parsedData = JSON.parse(savedGSTData);
          // Only load verified data if GST number matches current input
          // Don't auto-populate GST number field - keep it empty initially
          if (parsedData.gstNumber && gstNumber && parsedData.gstNumber === gstNumber) {
            if (onVerifiedDataChange) {
              onVerifiedDataChange(parsedData);
            }
            // Don't trigger verification here - only when explicitly requested
            // The UI will be updated by the parent component's state
          }
        } catch (error) {
          console.error('Failed to load GST data from localStorage:', error);
          localStorage.removeItem('verifiedGSTData');
        }
      }
    }, [gstNumber]);

    const handleVerifyClick = () => {
      if (isValidFormat) {
        onVerifyGST();
      }
    };

    // Save verified GST data to localStorage when verification is successful
    React.useEffect(() => {
      if (isVerified && verifiedData) {
        const dataToStore = {
          ...verifiedData,
          gstNumber: gstNumber,
          timestamp: new Date().getTime()
        };
        localStorage.setItem('verifiedGSTData', JSON.stringify(dataToStore));
      }
    }, [isVerified, verifiedData, gstNumber]);

    // Handle verified data change - Extract only state and pincode from API
    const handleVerifiedDataChange = (data: any) => {
      // Extract state and pincode from API data
      // The full address from API should NOT populate the address field
      const updatedData = {
        ...data,
        companyAddress: "", // Keep address empty for manual entry
        state: data.state || "",
        pincode: data.pincode || "",
        // Ensure we're not overriding existing values with undefined
        ...(data.companyName && { companyName: data.companyName }),
        ...(data.legalName && { legalName: data.legalName }),
        ...(data.registrationDate && { registrationDate: data.registrationDate }),
        ...(data.cin && { cin: data.cin }),
        ...(data.udyamRegistrationNumber && { udyamRegistrationNumber: data.udyamRegistrationNumber })
      };

      if (onVerifiedDataChange) {
        onVerifiedDataChange(updatedData);
      }
      // DO NOT auto-populate the address field
      // Keep address field empty for manual entry
    };

    // Handle address change (manual entry)
    const handleAddressChange = (value: string) => {
      onAddressChange(value);
    };

    // NEW: Combined State and Pincode input field from API
    const StatePincodeInput = React.useMemo(() => (
      <div className="space-y-1">
        <div className="text-xs text-slate-500 font-medium">
          State & Pincode<span className="text-red-500">*</span>
        </div>
        <input
          type="text"
          value={`${verifiedData?.state || ""}${verifiedData?.pincode ? ` - ${verifiedData.pincode}` : ""}`}
          onChange={(e) => {
            const value = e.target.value;
            // Parse state and pincode from combined field
            const dashIndex = value.indexOf(' - ');
            let state = value;
            let pincode = "";

            if (dashIndex > -1) {
              state = value.substring(0, dashIndex);
              pincode = value.substring(dashIndex + 3);
            }

            handleVerifiedDataChange({
              ...(verifiedData || {}),
              state: state.trim(),
              pincode: pincode.trim()
            });
          }}
          placeholder="State - Pincode (e.g., Telangana - 500055)"
          className="w-full h-10 px-3 text-sm border border-gray-200 rounded bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
        />
        {verifiedData?.state && (
          <p className="text-xs text-green-600 mt-1">From GST data</p>
        )}
      </div>
    ), [verifiedData?.state, verifiedData?.pincode]);

    return (
      <div className="bg-[#F0F8FF] border border-blue-200 rounded-xl p-6 shadow-sm">
        <div className="border-b border-blue-200 pb-3 mb-4 flex justify-between items-center">
          <h3 className="text-slate-900 font-semibold select-none">
            Verify GST
          </h3>
          {isVerified && (
            <div className="flex items-center text-green-600">
              <CheckCircle className="w-4 h-4 mr-1" />
              <span className="text-xs font-medium">Verified</span>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="mb-4">
            <h3 className="font-semibold text-slate-900 text-base">Verify Through GST</h3>
            <p className="text-slate-600 text-sm mt-0.5">Automatically fill your company details using GST Portal</p>
          </div>

          {/* GST Input Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-700">
                GST Number {isVerified ? <span className="text-green-600">✓</span> : <span className="text-red-500">*</span>}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={gstNumber}
                  onChange={(e) => handleChange(e.target.value)}
                  placeholder="22AAAAA0000A1Z5"
                  disabled={isVerified}
                  className={`flex-1 h-10 px-3 text-sm border rounded-lg focus:outline-none focus:ring-2 text-slate-800 placeholder-slate-400 ${isVerified
                    ? 'border-green-300 bg-green-50'
                    : 'border-blue-300 bg-white focus:ring-blue-400 focus:border-blue-400'
                    }`}
                  maxLength={15}
                />
                {!isVerified && (
                  <button
                    type="button"
                    onClick={handleVerifyClick}
                    disabled={isVerifying || !isValidGST || !localConsent}
                    className={`px-4 py-2 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center ${
                      isValidGST && localConsent && !isVerifying
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-blue-300 text-white cursor-not-allowed'
                    }`}
                  >
                    {isVerifying ? (
                      <>
                        <div className="w-4 h-4 mr-2 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                        Verifying...
                      </>
                    ) : (
                      "Verify"
                    )}
                  </button>
                )}
              </div>
              {!isVerified && !isValidFormat && gstNumber.length > 0 && (
                <p className="text-[10px] text-red-500">Invalid GST format</p>
              )}
              {!isVerified && isValidGST && !localConsent && (
                <p className="text-[10px] text-blue-600 mt-1">
                  Please select the below consent checkbox to enable verification.
                </p>
              )}
            </div>

            {/* Consent Section - Now directly below the input */}
            <div className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center h-5 mt-0.5">
                <input
                  id="gst-consent-checkbox"
                  type="checkbox"
                  checked={localConsent}
                  onChange={(e) => handleConsentChange(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-300 rounded cursor-pointer"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="gst-consent-checkbox" className="text-sm text-slate-800 cursor-pointer">
                  I consent to GST verification
                </label>
                <button
                  type="button"
                  onClick={() => setShowConsentDetails(true)}
                  className="text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-center mt-1 text-left"
                >
                  View consent details
                  <ChevronDown className="w-3 h-3 ml-1" />
                </button>
              </div>
            </div>
          </div>

          {/* Consent Details Modal */}
          <ConsentModal
            isOpen={showConsentDetails}
            onClose={() => setShowConsentDetails(false)}
          />
        </div>

        {isVerified && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center text-green-700 mb-2">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">GST Number Verified Successfully</span>
            </div>
            <p className="text-xs text-green-600">
              Your GST details have been verified. State & Pincode have been auto-filled. Please enter your registered address manually.
            </p>
          </div>
        )}

        {/* GST Details Section - now always visible */}
        <div className="border border-blue-200 rounded-lg bg-white">
          <div className="p-3 bg-blue-50 border-b border-blue-200 rounded-t-lg">
            <h4 className="text-sm font-semibold text-slate-800 flex items-center">
              <Briefcase className="w-4 h-4 mr-2 text-blue-600" />
              {isVerified ? "Verified Company Details" : "Company Details"}
            </h4>
          </div>

          <div className="p-4 space-y-3">
            {/* Company Name */}
            <div className="space-y-1">
              <div className="flex items-center text-xs text-slate-500 font-medium">
                Company Name (Trade Name)<span className="text-red-500">*</span>
              </div>
              <input
                type="text"
                value={verifiedData?.companyName || ""}
                onChange={(e) => handleVerifiedDataChange({ ...(verifiedData || {}), companyName: e.target.value })}
                placeholder="Enter company name"
                disabled={isVerified}
                className="w-full h-10 px-3 text-sm border border-gray-200 rounded bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 disabled:bg-gray-50 disabled:text-slate-500"
              />
            </div>

            <div className="space-y-1">
              <div className="text-xs text-slate-500 font-medium">
                Legal Name <span className="text-red-500">*</span>
              </div>
              <input
                type="text"
                value={verifiedData?.legalName || ""}
                onChange={(e) => handleVerifiedDataChange({ ...(verifiedData || {}), legalName: e.target.value })}
                placeholder="Enter Legal Name"
                className="w-full h-10 px-3 text-sm border border-gray-200 rounded bg-white text-slate-700 font-mono focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
            </div>

            {/* SINGLE Address Field - EMPTY for manual entry */}
            <div className="space-y-1">
              <div className="flex items-center text-xs text-slate-500 font-medium w-full">
                <div className="flex items-center">
                  <MapPin className="w-3 h-3 mr-1 text-blue-600" />
                  Registered Address <span className="text-red-500">*</span>
                </div>
              </div>
              <textarea
                value={address}
                onChange={(e) => handleAddressChange(e.target.value)}
                placeholder="Enter complete registered address (excluding state and pincode)"
                rows={3}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 resize-none"
              />
              <p className="text-xs text-red-500 mt-1">
                Please provide the full address as registered with the GST portal (excluding state and pincode).
              </p>
            </div>
          </div>

          {/* Combined State & Pincode Field from API */}
          <div className="grid grid-cols-3 gap-3 p-4">
            {/* Combined State & Pincode Field */}
            <div className="col-span-2">
              {StatePincodeInput}
            </div>

            {/* Registration Date */}
            <div className="space-y-1">
              <div className="text-xs text-slate-500 font-medium">
                Date of Incorporation<span className="text-red-500">*</span>
              </div>
              <input
                type="text"
                value={verifiedData?.registrationDate || ""}
                onChange={(e) => handleVerifiedDataChange({ ...(verifiedData || {}), registrationDate: e.target.value })}
                placeholder="DD/MM/YYYY"
                className="w-full h-10 px-3 text-sm border border-gray-200 rounded bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
            </div>
          </div>

          {/* Communication Address */}
          <div className="col-span-3 space-y-2 p-4 pt-0">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700">
                Communication Address <span className="text-red-500">*</span>
              </label>
              <label className="flex items-center space-x-2 text-sm text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.sameAsRegisteredAddress || false}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    updateFormData({
                      ...formData,
                      sameAsRegisteredAddress: isChecked,
                      communicationAddress: isChecked
                        ? `${address}${verifiedData?.state || verifiedData?.pincode ? ', ' : ''}${verifiedData?.state || ''}${verifiedData?.state && verifiedData?.pincode ? ' - ' : ''}${verifiedData?.pincode || ''}`
                        : ''
                    });
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span>Same as Registered Address</span>
              </label>
            </div>
            <textarea
              value={formData.sameAsRegisteredAddress
                ? `${address}${verifiedData?.state || verifiedData?.pincode ? ', ' : ''}${verifiedData?.state || ''}${verifiedData?.state && verifiedData?.pincode ? ' - ' : ''}${verifiedData?.pincode || ''}`
                : (formData.communicationAddress || '')}
              onChange={(e) => updateFormData({ ...formData, communicationAddress: e.target.value })}
              placeholder="Enter communication address"
              rows={3}
              disabled={formData.sameAsRegisteredAddress}
              className={`w-full px-3 py-2 text-sm border ${formData.sameAsRegisteredAddress ? 'bg-gray-50' : 'bg-white'} border-gray-200 rounded text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 resize-none`}
            />
          </div>
        </div>

        {/* PAN Verification Section - Hidden but kept in DOM */}
        <div className="mt-6 hidden">
          <PANVerificationSection
            panNumber={panNumber}
            onPanChange={onPanChange}
            fullName={panName}
            onNameChange={onPanNameChange}
            dob={panDob}
            onDobChange={onPanDobChange}
            onVerify={onVerifyPAN}
            isVerifying={isVerifyingPAN}
            isVerified={isPANVerified}
          />
        </div>

        {/* Business Field */}
        <div className="space-y-1 mt-4">
          <div className="text-xs text-slate-500 font-medium">
            Business Entity Type <span className="text-red-500">*</span>
          </div>
          <input
            type="text"
            value={formData.businessField || ""}
            onChange={(e) => updateFormData({ ...formData, businessField: e.target.value })}
            placeholder="Enter your business field (e.g., IT Services, Manufacturing)"
            className="w-full h-10 px-3 text-sm border border-gray-200 rounded bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          />
        </div>

        {/* PAN Number */}
        <div className="space-y-1 mt-4">
          <div className="text-xs text-slate-500 font-medium">
            PAN Number <span className="text-red-500">*</span>
          </div>
          <input
            type="text"
            value={formData.panNumber || ""}
            onChange={(e) => updateFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
            placeholder="Enter PAN Number (e.g., ABCDE1234F)"
            maxLength={10}
            className="w-full h-10 px-3 text-sm border border-gray-200 rounded bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          />
          {formData.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber) && (
            <p className="text-xs text-red-500 mt-1">Please enter a valid PAN number (e.g., ABCDE1234F)</p>
          )}
        </div>

        {/* Nature of Business */}
        <div className="space-y-1 mt-4">
          <div className="text-xs text-slate-500 font-medium">
            Nature of Business <span className="text-red-500">*</span>
          </div>
          <input
            type="text"
            value={formData.natureOfBusiness || ""}
            onChange={(e) => updateFormData({ ...formData, natureOfBusiness: e.target.value })}
            placeholder="Enter Nature of Business (e.g., Retail Business, Trading)"
            className="w-full h-10 px-3 text-sm border border-gray-200 rounded bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          />
        </div>

        {/* Corporate Identity Number (CIN) */}
        <div className="space-y-1 mt-4">
          <div className="text-xs text-slate-500 font-medium">
            Corporate Identity Number (CIN)
          </div>
          <input
            type="text"
            value={verifiedData?.cin || ""}
            onChange={(e) => handleVerifiedDataChange({ ...(verifiedData || {}), cin: e.target.value })}
            placeholder="Enter CIN"
            className="w-full h-10 px-3 text-sm border border-gray-200 rounded bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          />
        </div>

        {/*UDYAM Registration Number*/}
        <div className="space-y-1 mt-4">
          <div className="text-xs text-slate-500 font-medium">
            UDYAM Registration Number
          </div>
          <input
            type="text"
            value={verifiedData?.udyamRegistrationNumber || ""}
            onChange={(e) => handleVerifiedDataChange({ ...(verifiedData || {}), udyamRegistrationNumber: e.target.value })}
            placeholder="Enter UDYAM Registration Number"
            className="w-full h-10 px-3 text-sm border border-gray-200 rounded bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          />
        </div>

        <div className="mt-4">
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
        </div>

        <div className="mt-4">
          <FormInput
            label="Promotional Code"
            value={formData.promoCode}
            onChange={(value) => updateFormData({ promoCode: value })}
            placeholder="Enter promotional code"
          />
        </div>
      </div>
    );
  };

// Basic Information Section Component - ALL FIELDS STATIC when verified
const BasicInformationSection: React.FC<{
  formData: any;
  updateFormData: (data: any) => void;
  verifiedData?: {
    fullName: string;
    dateOfBirth: string;
    gender: string;
    relationshipType: string;
    relationshipName: string;
    address: string;
    city: string;
    postalCode: string;
    country?: string;
    state?: string;
  };
  isVerified: boolean;
  onBasicInfoUpdate?: (field: string, value: string) => void;
  onPanUpdate?: (panNumber: string) => void;
}> = ({ formData, updateFormData, verifiedData, isVerified, onBasicInfoUpdate, onPanUpdate }) => {
  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ];

  const relationshipOptions = [
    { value: "C/o", label: "C/o" },
    { value: "S/o", label: "S/o" },
    { value: "D/o", label: "D/o" },
  ];

  const handlePersonalDateChange = (date: string) => {
    updateFormData({ dateOfBirth: date });
    if (onBasicInfoUpdate) {
      onBasicInfoUpdate('dateOfBirth', date);
    }
  };

  // Parse relationship from verified data
  useEffect(() => {
    if (verifiedData && verifiedData.relationshipType && verifiedData.relationshipName) {
      updateFormData({
        fullName: verifiedData.fullName,
        dateOfBirth: verifiedData.dateOfBirth,
        gender: verifiedData.gender,
        relationshipType: verifiedData.relationshipType,
        relationshipName: verifiedData.relationshipName,
        basicAddress: verifiedData.address,
        basicCity: verifiedData.city,
        basicPostalCode: verifiedData.postalCode,
        basicCountry: verifiedData.country || "India",
        basicState: verifiedData.state || ""
      });

      // NEW: Notify parent about the updates
      if (onBasicInfoUpdate) {
        onBasicInfoUpdate('fullName', verifiedData.fullName);
        onBasicInfoUpdate('gender', verifiedData.gender);
      }
    }
  }, [verifiedData, updateFormData, onBasicInfoUpdate]);

  const handleFullNameChange = (value: string) => {
    updateFormData({ fullName: value });
    // NEW: Notify parent about the update
    if (onBasicInfoUpdate) {
      onBasicInfoUpdate('fullName', value);
    }
  };

  const handleGenderChange = (value: string) => {
    updateFormData({ gender: value });
    // NEW: Notify parent about the update
    if (onBasicInfoUpdate) {
      onBasicInfoUpdate('gender', value);
    }
  };

  // Handle PAN Number change
  const handlePanChange = (value: string) => {
    updateFormData({ panNumber: value });
    // NEW: Notify parent about PAN update
    if (onPanUpdate) {
      onPanUpdate(value);
    }
  };

  return (
    <div className="bg-[#FFF9E5] border border-amber-200 rounded-xl p-6 shadow-sm">
      <div className="border-b border-amber-200 pb-3 mb-4 flex justify-between items-center">
        <h2 className="text-slate-900 font-semibold">
          Basic Information
        </h2>
        {isVerified && (
          <div className="flex items-center text-green-600">
            <Lock className="w-4 h-4 mr-1" />
            <span className="text-xs font-medium">Verified & Locked</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {/* Full Name - NON-EDITABLE when verified */}
        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-700">
            Full Name <span className="text-red-500">* *</span>
          </label>
          <input
            type="text"
            value={formData.fullName || ""}
            onChange={(e) => handleFullNameChange(e.target.value)}
            required
            placeholder="Enter your full name"
            disabled={isVerified}
            className="w-full h-10 px-3 text-sm border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-slate-800 placeholder-slate-400 bg-white disabled:bg-amber-50 disabled:text-slate-500"
          />
          {isVerified && (
            <p className="mt-1 text-xs text-green-600">
              Verified from Aadhar
            </p>
          )}
        </div>

        {/* Date of Birth - NON-EDITABLE when verified */}
        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-700">
            Date of Birth <span className="text-red-500">* *</span>
          </label>
          {isVerified ? (
            <ReadOnlyDateDisplay value={formData.dateOfBirth || ""} />
          ) : (
            <PersonalDatePicker
              value={formData.dateOfBirth || ""}
              onChange={handlePersonalDateChange}
              disabled={isVerified}
            />
          )}
        </div>

        {/* Gender and Relationship in same row - Both NON-EDITABLE when verified */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-700">
              Gender <span className="text-red-500">* *</span>
            </label>
            <div className="relative">
              <select
                value={formData.gender || ""}
                onChange={(e) => handleGenderChange(e.target.value)}
                disabled={isVerified}
                className="w-full h-10 px-3 text-sm border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-slate-800 appearance-none bg-white disabled:bg-amber-50 disabled:text-slate-500"
              >
                <option value="">Select Gender</option>
                {genderOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-700">
              C/o, S/o, D/o <span className="text-red-500">* *</span>
            </label>
            <div className={`flex items-stretch border rounded-lg transition-colors ${isVerified ? 'border-amber-300 bg-amber-50' : 'border-amber-300 hover:border-amber-400 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500'}`}>
              <div className="relative flex-shrink-0">
                <select
                  value={formData.relationshipType || ""}
                  onChange={(e) => updateFormData({ relationshipType: e.target.value })}
                  disabled={isVerified}
                  className="h-10 pl-3 pr-8 text-sm bg-white border-0 rounded-l-lg focus:outline-none focus:ring-0 appearance-none text-slate-800 disabled:bg-amber-50 disabled:text-slate-500"
                  style={{ minWidth: '80px' }}
                >
                  <option value="">Select</option>
                  {relationshipOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-px bg-amber-300"></div>
              </div>

              <div className="flex-1">
                <input
                  type="text"
                  value={formData.relationshipName || ""}
                  onChange={(e) => updateFormData({ relationshipName: e.target.value })}
                  required
                  disabled={isVerified}
                  placeholder="Enter relative's name"
                  className="w-full h-10 px-3 text-sm border-0 rounded-r-lg focus:outline-none focus:ring-0 text-slate-800 placeholder-slate-400 bg-white disabled:bg-amber-50 disabled:text-slate-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Address Section - NON-EDITABLE when verified */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-xs font-medium text-slate-700">
              Address <span className="text-red-500">*</span>
            </label>
            {isVerified && (
              <span className="text-xs text-green-600">Verified</span>
            )}
          </div>
          <textarea
            value={formData.basicAddress || ""}
            onChange={(e) => updateFormData({ basicAddress: e.target.value })}
            required
            disabled={isVerified}
            placeholder="Complete address with building details"
            rows={2}
            className="w-full px-3 py-2 text-sm border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-slate-800 placeholder-slate-400 disabled:bg-amber-50 disabled:text-slate-500"
          />
        </div>

        {/* City/District and Country in same row - Both NON-EDITABLE when verified */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-700">
              City/District <span className="text-red-500">* *</span>
            </label>
            <input
              type="text"
              value={formData.basicCity || ""}
              onChange={(e) => updateFormData({ basicCity: e.target.value })}
              required
              disabled={isVerified}
              placeholder="Enter city or district"
              className="w-full h-10 px-3 text-sm border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-slate-800 placeholder-slate-400 bg-white disabled:bg-amber-50 disabled:text-slate-500"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-700">
              Country <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={formData.basicCountry || ""}
                onChange={(e) => updateFormData({ basicCountry: e.target.value })}
                disabled={isVerified}
                className="w-full h-10 px-3 text-sm border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-slate-800 appearance-none bg-white disabled:bg-amber-50 disabled:text-slate-500"
              >
                <option value="">Select Country</option>
                <option value="India">India</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
                <option value="Japan">Japan</option>
                <option value="China">China</option>
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Pin Code and State in same row - Both NON-EDITABLE when verified */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-700">
              Pin Code <span className="text-red-500">* *</span>
            </label>
            <input
              type="text"
              value={formData.basicPostalCode || ""}
              onChange={(e) => updateFormData({ basicPostalCode: e.target.value })}
              required
              disabled={isVerified}
              placeholder="Enter 6-digit pin code"
              maxLength={6}
              className="w-full h-10 px-3 text-sm border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-slate-800 placeholder-slate-400 bg-white disabled:bg-amber-50 disabled:text-slate-500"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-700">
              State <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={formData.basicState || ""}
                onChange={(e) => updateFormData({ basicState: e.target.value })}
                disabled={isVerified || !formData.basicCountry}
                className="w-full h-10 px-3 text-sm border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-slate-800 appearance-none bg-white disabled:bg-amber-50 disabled:text-slate-500"
              >
                <option value="">
                  {formData.basicCountry ? "Select State" : "Select country first"}
                </option>
                {formData.basicCountry === "India" && (
                  <>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="West Bengal">West Bengal</option>
                  </>
                )}
                {formData.basicCountry === "United States" && (
                  <>
                    <option value="California">California</option>
                    <option value="Texas">Texas</option>
                    <option value="New York">New York</option>
                    <option value="Florida">Florida</option>
                    <option value="Illinois">Illinois</option>
                  </>
                )}
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>
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
  // DigiLocker State
  const [digiToken, setDigiToken] = useState<string | null>(null);
  const [digiState, setDigiState] = useState<string | null>(null);
  const [startPolling, setStartPolling] = useState(false);
  const [showAadharConsentModal, setShowAadharConsentModal] = React.useState(false);
  const [aadharConsentAccepted, setAadharConsentAccepted] = React.useState(false);

  // NEW: State for PAN Verification
  const [panNumber, setPanNumber] = useState(formData.panNumber || "");
  const [panName, setPanName] = useState(formData.fullName || "");
  const [panDob, setPanDob] = useState(formData.dateOfBirth || "");
  const [verifyingPan, setVerifyingPan] = useState(false);
  const [panVerified, setPanVerified] = useState(false);

  const handleVerifyPAN = () => {
    setVerifyingPan(true);
    // Simulate API call
    setTimeout(() => {
      setVerifyingPan(false);
      setPanVerified(true);
      // Update form data
      updateFormData({
        socialLinks: {
          ...formData.socialLinks,
          pan: panNumber
        }
      });
    }, 1500);
  };

  // NEW: State for GST Verification - Restore only if verified
  const [gstNumber, setGSTNumber] = useState(() => {
    const savedGstData = localStorage.getItem('gstSectionData');
    if (savedGstData) {
      try {
        const parsedData = JSON.parse(savedGstData);
        if (parsedData.gstVerified && parsedData.gstin) {
          return parsedData.gstin;
        }
      } catch (error) {
        console.error('Failed to restore GST number:', error);
      }
    }
    return "";
  });
  const [gstVerified, setGSTVerified] = useState(() => {
    const savedGstData = localStorage.getItem('gstSectionData');
    if (savedGstData) {
      try {
        const parsedData = JSON.parse(savedGstData);
        return parsedData.gstVerified || false;
      } catch (error) {
        return false;
      }
    }
    return false;
  });
  const [verifyingGST, setVerifyingGST] = useState(false);
  const [verifiedGSTData, setVerifiedGSTData] = useState<{
    companyName: string;
    legalName: string;
    gstNumber: string;
    companyAddress: string;
    state: string;
    registrationDate: string;
    businessType: string;
    pincode?: string;
    cin?: string;
    udyamRegistrationNumber?: string;
    pan?: string;
  } | null>(null);
  const [gstAddress, setGstAddress] = useState(() => {
    const savedGstData = localStorage.getItem('gstSectionData');
    if (savedGstData) {
      try {
        const parsedData = JSON.parse(savedGstData);
        if (parsedData.gstVerified && parsedData.gstAddress) {
          return parsedData.gstAddress;
        }
      } catch (error) {
        console.error('Failed to restore GST address:', error);
      }
    }
    return "";
  });

  // NEW: Update GST number in form data
  useEffect(() => {
    updateFormData({ gstin: gstNumber });
  }, [gstNumber, updateFormData]);

  // NEW: Handle GST number change
  const handleGSTChange = (value: string) => {
    setGSTNumber(value);
    // Reset verification if GST number changes
    if (gstVerified) {
      setGSTVerified(false);
      setVerifiedGSTData(null);
      setGstAddress(""); // Clear address when GST changes
    }
  };

  // Handle GST address change
  const handleGstAddressChange = (value: string) => {
    setGstAddress(value);
  };

  // NEW: Handle GST verification - Extract ONLY state and pincode from API
  const handleVerifyGST = async () => {
    // Regex for GSTIN: 2 digits(State) + 5 chars(PAN) + 4 digits(PAN) + 1 char(PAN) + 1 digit(Entity) + Z + 1 char(Check)
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

    if (!gstRegex.test(gstNumber)) {
      // Invalid GST format - stop execution
      return;
    }

    if (gstNumber.length >= 15) {
      setVerifyingGST(true);

      try {
        // 1. Get Access Token with CORS headers
        const tokenResponse = await axios.post(
          "https://ocr.meon.co.in/get_token",
          {
            "company_id": "67132",
            "email": "dev@ipageums.com",
            "password": "dev@ipageums.com"
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          }
        );

        if (tokenResponse.data.success) {
          const token = tokenResponse.data.token;

          // 2. Search Business Name by GST using the obtained token
          const gstResponse = await axios.post(
            "https://ocr.meon.co.in/gst/search_business_name",
            { "gst_number": gstNumber },
            {
              headers: {
                "Authorization": `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
              }
            }
          );

          console.log("GST API Response:", gstResponse.data);

          const apiData = gstResponse.data?.data?.[0] || gstResponse.data?.data || gstResponse.data;

          if (apiData) {
            const companyName = apiData.business_name || "";
            const legalName = ""; // Keep legal name empty for manual entry
            const panNumber = apiData.business_pan || "";

            // Parse address to extract state and pincode
            let extractedState = "";
            let extractedPincode = "";

            if (apiData.business_address) {
              const addressParts = apiData.business_address.split(", ");
              if (addressParts.length >= 2) {
                // Last part should contain pincode
                const lastPart = addressParts[addressParts.length - 1];
                const pincodeMatch = lastPart.match(/\d{6}/);
                if (pincodeMatch) {
                  extractedPincode = pincodeMatch[0];
                }

                // First part should be state
                extractedState = addressParts[0] || "";
              }
            }

            // Extract ONLY state and pincode from API
            // DO NOT populate the address field
            const verifiedData = {
              companyName: companyName,
              legalName: "", // Keep legal name empty for manual entry
              gstNumber: apiData.gst_number || gstNumber,
              companyAddress: "", // EMPTY - for manual entry
              state: extractedState,
              pincode: extractedPincode,
              registrationDate: apiData.business_registration_date || "",
              businessType: apiData.nature_of_business || apiData.business_entity_type || "",
              businessEntityType: apiData.business_entity_type || "",
              natureOfBusiness: apiData.nature_of_business || "",
              cin: "", // Will be filled manually
              udyamRegistrationNumber: "", // Will be filled manually
              pan: panNumber
            };

            setVerifiedGSTData(verifiedData);
            setGSTVerified(true);

            // Keep address field empty for manual entry
            setGstAddress("");

            // Sync with Company Information section
            const updates: any = {};

            if (verifiedData.companyName) {
              updates.companyName = verifiedData.companyName;
            }

            // Update PAN number from GST API response
            if (verifiedData.pan) {
              updates.panNumber = verifiedData.pan;
              setPanNumber(verifiedData.pan);
              // Also update social links PAN
              updates.socialLinks = {
                ...formData.socialLinks,
                pan: verifiedData.pan
              };
            }

            // Update Business Entity Type from GST API response
            if (verifiedData.businessEntityType) {
              updates.businessField = verifiedData.businessEntityType;
            }

            // Update Nature of Business from GST API response
            if (verifiedData.natureOfBusiness) {
              updates.natureOfBusiness = verifiedData.natureOfBusiness;
            }

            // Parse and sync Year Established (Date of Incorporation)
            if (verifiedData.registrationDate && verifiedData.registrationDate.includes('/')) {
              const [d, m, y] = verifiedData.registrationDate.split('/');
              if (d && m && y) {
                // Convert DD/MM/YYYY to YYYY-MM-DD for ScrollDatePicker
                updates.yearEstablished = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
              }
            } else if (verifiedData.registrationDate && verifiedData.registrationDate.includes('-')) {
              // Handle YYYY-MM-DD if that's what API sends
              updates.yearEstablished = verifiedData.registrationDate;
            }

            if (Object.keys(updates).length > 0) {
              updateFormData(updates);
            }
          } else {
            console.error("No data found for this GST number");
          }
        } else {
          console.error("Token generation failed:", tokenResponse.data);
        }
      } catch (error) {
        console.error("Error verifying GST:", error);
      } finally {
        setVerifyingGST(false);
      }
    }
  };

  // REMOVED: Initialize DigiLocker Token on Mount (Now handled in handleDigiLockerLogin)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('digi_callback')) {
      // If we're coming back from DigiLocker, restore state and start polling
      const storedToken = localStorage.getItem('digi_client_token');
      const storedState = localStorage.getItem('digi_state');

      if (storedToken && storedState) {
        setDigiToken(storedToken);
        setDigiState(storedState);
        setStartPolling(true);

        // Clean up the URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  // useRefs to ensure polling interval doesn't reset on every render
  const updateFormDataRef = useRef(updateFormData);
  const digiTokenRef = useRef(digiToken);
  const digiStateRef = useRef(digiState);
  const formDataRef = useRef(formData);

  useEffect(() => {
    updateFormDataRef.current = updateFormData;
    digiTokenRef.current = digiToken;
    digiStateRef.current = digiState;
    formDataRef.current = formData;
  }, [updateFormData, digiToken, digiState, formData]);

  // Command Step 89: Robust Polling for DigiLocker Data
  useEffect(() => {
    let interval: any;

    if (startPolling) {
      console.log("Starting DigiLocker polling...");

      const poll = async () => {
        const token = digiTokenRef.current;
        const state = digiStateRef.current;

        if (!token || !state) {
          console.log("Missing token or state for polling");
          return;
        }

        try {
          // console.log("Polling send_entire_data...");
          const response = await axios.post("https://digilocker.meon.co.in/v2/send_entire_data", {
            "client_token": token,
            "state": state
          });

          // console.log("Polling Response:", response.data);

          if (response.data.success && response.data.status === 'success') {
            const data = response.data.data;
            const currentFormData = formDataRef.current;

            console.log("DigiLocker Data Found:", data);

            // Parse Date of Birth (DD-MM-YYYY to YYYY-MM-DD or as is)
            let formattedDob = "";
            if (data.dob) {
              // Assuming API returns DD-MM-YYYY
              const parts = data.dob.split('-');
              if (parts.length === 3) {
                formattedDob = `${parts[2]}-${parts[1]}-${parts[0]}`; // YYYY-MM-DD
                // Or keep DD-MM-YYYY if your form expects it? 
                // Based on Step1 logic, usually YYYY-MM-DD for date inputs.
                // But wait, the PersonalDatePicker might handle strings differently.
                // Let's stick to standard YYYY-MM-DD if possible.
                // Just in case check if it's already YYYY-MM-DD? Unlikely from this API.
                // Actually, data.dob is "25-09-2002"
              } else {
                formattedDob = data.dob;
              }
            }

            // Parse Relationship
            let relType = "C/o";
            let relName = "";
            if (data.fathername) {
              if (data.fathername.startsWith("C/o ")) {
                relType = "C/o";
                relName = data.fathername.substring(4);
              } else if (data.fathername.startsWith("S/o ")) {
                relType = "S/o";
                relName = data.fathername.substring(4);
              } else if (data.fathername.startsWith("D/o ")) {
                relType = "D/o";
                relName = data.fathername.substring(4);
              } else {
                relName = data.fathername;
              }
            }

            // Director Info
            const fullName = data.name || "";
            let directorPrefix = "Mr";
            if (data.gender === "Female") directorPrefix = "Mrs";

            // Update Form Data - Director Name, Address, and Aadhar Number
            updateFormDataRef.current({
              directorPrefix: directorPrefix as 'Mr' | 'Mrs' | 'Ms',
              directorName: fullName,
              directorAddress: data.aadhar_address || "",
              aadharNumber: data.aadhar_no || ""
            });

            setAadharVerified(true);
            setVerifiedAadharData({
              fullName: fullName,
              dateOfBirth: formattedDob,
              gender: data.gender,
              relationshipType: relType,
              relationshipName: relName,
              address: data.aadhar_address,
              city: data.dist,
              postalCode: data.pincode,
              country: data.country || "India",
              state: data.state,
              phoneNumber: data.mobile || "+91 9876543210",
              email: data.email || "director@example.com"
            });

            // Stop polling
            setStartPolling(false);
          } else {
            // console.log("DigiLocker data not yet available, continuing poll...");
          }
        } catch (error) {
          console.error("Error polling DigiLocker:", error);
        }
      };

      interval = setInterval(poll, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [startPolling]); // Dependencies minimal to ensure interval Persistence

  // Handle DigiLocker login
  const handleDigiLockerLogin = async (fromConsent = false) => {
    if (!fromConsent && !aadharConsentAccepted) {
      setShowAadharConsentModal(true);
      return;
    }

    try {
      // 1. Get Access Token (API 1)
      const tokenResponse = await axios.post("https://digilocker.meon.co.in/get_access_token", {
        "company_name": "ipage",
        "secret_token": "lwHaBrdbfda67P3uO5jbC7HElp6cpBQb"
      });

      if (tokenResponse.data.status) {
        const { client_token, state } = tokenResponse.data;

        // Store in localStorage and state
        localStorage.setItem('digi_client_token', client_token);
        localStorage.setItem('digi_state', state);
        setDigiToken(client_token);
        setDigiState(state);

        // Start Polling (API 3) automatically after API 1
        setStartPolling(true);

        // 2. Generate URL (API 2)
        const currentUrl = window.location.origin + window.location.pathname;
        const localRedirectUrl = `${currentUrl}?digi_callback=true`;

        const urlResponse = await axios.post("https://digilocker.meon.co.in/digi_url", {
          "client_token": client_token,
          "redirect_url": localRedirectUrl,
          "company_name": "ipage",
          "documents": "aadhaar,pan",
          "pan_name": "RAHUL KUMAR",
          "pan_no": "CAPUD4335K",
          "other_documents": []
        });

        if (urlResponse.data.status === 'success' && urlResponse.data.url) {
          // Redirect the current window to the response URL
          window.location.href = urlResponse.data.url;
        } else {
          console.error("Failed to generate DigiLocker URL:", urlResponse.data);
          alert("Unable to generate DigiLocker URL. Please try again.");
        }
      } else {
        console.error("Failed to get DigiLocker access token:", tokenResponse.data);
        alert("DigiLocker initialization failed. Please try again.");
      }
    } catch (error) {
      console.error("Error in DigiLocker flow:", error);
      alert("An error occurred during DigiLocker login. Please try again.");
    }
  };

  // NEW: Save GST section form data to localStorage whenever it changes
  useEffect(() => {
    const gstSectionData = {
      businessField: formData.businessField || "",
      panNumber: formData.panNumber || "",
      natureOfBusiness: formData.natureOfBusiness || "",
      cin: verifiedGSTData?.cin || "",
      udyamRegistrationNumber: verifiedGSTData?.udyamRegistrationNumber || "",
      websiteUrl: formData.websiteUrl || "",
      promoCode: formData.promoCode || "",
      gstin: gstNumber,
      gstAddress: gstAddress,
      communicationAddress: formData.communicationAddress || "",
      sameAsRegisteredAddress: formData.sameAsRegisteredAddress || false,
      // Save all verified GST data
      verifiedGSTData: verifiedGSTData ? {
        companyName: verifiedGSTData.companyName || "",
        legalName: verifiedGSTData.legalName || "",
        gstNumber: verifiedGSTData.gstNumber || "",
        companyAddress: verifiedGSTData.companyAddress || "",
        state: verifiedGSTData.state || "",
        pincode: verifiedGSTData.pincode || "",
        registrationDate: verifiedGSTData.registrationDate || "",
        businessType: verifiedGSTData.businessType || "",
        businessEntityType: verifiedGSTData.businessEntityType || "",
        natureOfBusiness: verifiedGSTData.natureOfBusiness || "",
        cin: verifiedGSTData.cin || "",
        udyamRegistrationNumber: verifiedGSTData.udyamRegistrationNumber || "",
        pan: verifiedGSTData.pan || ""
      } : null,
      gstVerified: gstVerified,
      timestamp: new Date().getTime()
    };

    localStorage.setItem('gstSectionData', JSON.stringify(gstSectionData));
  }, [
    formData.businessField,
    formData.panNumber,
    formData.natureOfBusiness,
    formData.websiteUrl,
    formData.promoCode,
    formData.communicationAddress,
    formData.sameAsRegisteredAddress,
    verifiedGSTData,
    gstNumber,
    gstAddress,
    gstVerified
  ]);

  // NEW: Restore GST section form data from localStorage on mount
  useEffect(() => {
    const savedGstData = localStorage.getItem('gstSectionData');
    if (savedGstData) {
      try {
        const parsedData = JSON.parse(savedGstData);
        const updates: any = {};

        // Restore form data fields
        if (parsedData.businessField) updates.businessField = parsedData.businessField;
        if (parsedData.panNumber) updates.panNumber = parsedData.panNumber;
        if (parsedData.natureOfBusiness) updates.natureOfBusiness = parsedData.natureOfBusiness;
        if (parsedData.websiteUrl) updates.websiteUrl = parsedData.websiteUrl;
        if (parsedData.promoCode) updates.promoCode = parsedData.promoCode;
        if (parsedData.communicationAddress) updates.communicationAddress = parsedData.communicationAddress;
        if (parsedData.sameAsRegisteredAddress !== undefined) updates.sameAsRegisteredAddress = parsedData.sameAsRegisteredAddress;

        // Restore GST number only if it was verified
        if (parsedData.gstVerified && parsedData.gstin) {
          setGSTNumber(parsedData.gstin);
          updates.gstin = parsedData.gstin;
        }

        // Restore address - CRITICAL: Must restore for verified GST
        if (parsedData.gstAddress) {
          setGstAddress(parsedData.gstAddress);
          console.log('Restored GST address:', parsedData.gstAddress);
        }

        // Restore complete verified GST data - THIS IS CRITICAL
        if (parsedData.verifiedGSTData) {
          // Set the verified data state immediately
          setVerifiedGSTData(parsedData.verifiedGSTData);
          console.log('Restored verified GST data:', parsedData.verifiedGSTData);

          // Also add these to formData so they persist across the app
          if (parsedData.verifiedGSTData.companyName) {
            updates.companyName = parsedData.verifiedGSTData.companyName;
          }
          if (parsedData.verifiedGSTData.pan) {
            updates.panNumber = parsedData.verifiedGSTData.pan;
            setPanNumber(parsedData.verifiedGSTData.pan);
          }
          if (parsedData.verifiedGSTData.registrationDate) {
            // Parse and sync Year Established (Date of Incorporation)
            if (parsedData.verifiedGSTData.registrationDate.includes('/')) {
              const [d, m, y] = parsedData.verifiedGSTData.registrationDate.split('/');
              if (d && m && y) {
                updates.yearEstablished = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
              }
            }
          }
        }

        // Restore GST verification status
        if (parsedData.gstVerified !== undefined) {
          setGSTVerified(parsedData.gstVerified);
        }

        // Update formData with all restored values
        if (Object.keys(updates).length > 0) {
          updateFormData(updates);
        }

        console.log('Restored GST section data from localStorage:', parsedData);
      } catch (error) {
        console.error('Failed to load GST section data from localStorage:', error);
      }
    }
  }, []); // Run only once on mount

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
  const { setAccountEmail } = useUserAuth();
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [emailCheckResult, setEmailCheckResult] = useState<{
    exists: boolean;
    message: string;
  } | null>(null);
  const [tempDirectorEmail, setTempDirectorEmail] = useState(formData.directorEmail || "");
  const [emailFieldTouched, setEmailFieldTouched] = useState(false);

  // State for Aadhar verification
  const [isVerifyingAadhar, setIsVerifyingAadhar] = useState(false);
  const [aadharVerified, setAadharVerified] = useState(false);
  const [verifiedAadharData, setVerifiedAadharData] = useState<any>(null);

  // NEW: Handle Aadhar data verification callback
  const handleAadharDataVerified = (data: any) => {
    // Determine prefix based on gender
    let directorPrefix: 'Mr' | 'Mrs' | 'Ms' = "Mr";
    if (data.gender === "Female") {
      directorPrefix = "Mrs";
    } else if (data.gender === "Other") {
      directorPrefix = "Ms";
    }

    // Update ALL form fields with verified data
    updateFormData({
      // Basic Information
      fullName: data.fullName,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      relationshipType: data.relationshipType,
      relationshipName: data.relationshipName,
      basicAddress: data.address,
      basicCity: data.city,
      basicPostalCode: data.postalCode,
      basicCountry: data.country || "India",
      basicState: data.state,
      aadharVerified: true,

      // PAN from verified data
      panNumber: data.panNumber || formData.panNumber,

      // Director/MD Information - AUTO-POPULATED
      directorPrefix: directorPrefix,
      directorName: data.fullName, // Auto-populate from verified full name
      directorPhone: data.phoneNumber || "+91 9876543210", // Auto-populate from verified phone
      directorAddress: data.address, // Auto-populate director address from verified data
      directorEmail: data.email || tempDirectorEmail,
    });

    // Update Trade Information PAN from Basic Information PAN
    updateFormData({
      socialLinks: {
        ...formData.socialLinks,
        pan: data.panNumber
      }
    });

    setAadharVerified(true);
    setIsVerifyingAadhar(false);
  };

  const handleCategoryChange = (selected: string[]) => {
    updateFormData({ companyCategory: selected });
  };

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

  const handleVerifyAadhar = async () => {
    if (!formData.aadharNumber || formData.aadharNumber.replace(/\D/g, '').length !== 12) {
      return;
    }

    setIsVerifyingAadhar(true);

    setTimeout(() => {
      const verifiedData = {
        fullName: "Kavali Jayanth Sree Kumar",
        dateOfBirth: "2002-09-25",
        gender: "Male",
        relationshipType: "C/o",
        relationshipName: "Kavali Venkatesh",
        address: "H No 13-153 NLB Nagar Quthbullapur, Near Hanuman Temple Shapur Nagar Jeedimetla",
        city: "Medchal-malkajgiri",
        postalCode: "500055",
        country: "India",
        state: "Telangana",
        phoneNumber: "+91 9876543210",
        email: "jayanth.kavali@example.com",
        panNumber: "ABCDE1234F"
      };

      handleAadharDataVerified(verifiedData);
    }, 1500);
  };

  const handleDirectorEmailChange = (value: string) => {
    updateFormData({ directorEmail: value });
    setTempDirectorEmail(value);
  };

  const handleModalSubmit = () => {
    if (tempDirectorEmail) {
      checkEmailExists(tempDirectorEmail);
    }
  };

  const handleModalClose = () => {
    setShowEmailModal(false);
    setEmailCheckResult(null);
  };

  const handleModalEmailChange = (value: string) => {
    setTempDirectorEmail(value);
    updateFormData({ directorEmail: value });
  };

  const handleDateChange = (date: string) => {
    updateFormData({ yearEstablished: date });
  };

  const handleAadharChange = (value: string) => {
    updateFormData({ aadharNumber: value });
    if (aadharVerified) {
      setAadharVerified(false);
      updateFormData({
        aadharVerified: false,
        fullName: "",
        dateOfBirth: "",
        gender: "",
        relationshipType: "",
        relationshipName: "",
        basicAddress: "",
        basicCity: "",
        basicPostalCode: "",
        basicCountry: "",
        basicState: "",
        panNumber: "",
        directorName: "",
        directorPhone: "",
        directorEmail: "",
        officeAddress: "",
        city: "",
        postalCode: "",
        state: "",
        socialLinks: {
          ...formData.socialLinks,
          pan: ""
        }
      });
    }
  };

  useEffect(() => {
    console.log("Form data updated:", formData);
  }, [formData]);

  const EmailVerificationModal = () => {
    if (!showEmailModal) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="relative w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Verify Email</h3>
            <button
              onClick={handleModalClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Please enter your email address to check if it's already registered.
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              value={tempDirectorEmail}
              onChange={(e) => handleModalEmailChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="director@company.com"
              autoFocus
            />
          </div>

          {emailCheckResult && (
            <div className={`mb-4 p-3 rounded-lg ${emailCheckResult.exists ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              <div className="flex items-center">
                {emailCheckResult.exists ? (
                  <CheckCircle className="w-5 h-5 mr-2" />
                ) : (
                  <AlertCircle className="w-5 h-5 mr-2" />
                )}
                <p className="text-sm">{emailCheckResult.message}</p>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              onClick={handleModalClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleModalSubmit}
              disabled={checkingEmail || !tempDirectorEmail}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {checkingEmail ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 mr-2 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                  Checking...
                </div>
              ) : (
                "Verify Email"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const AadharConsentModal = () => {
    if (!showAadharConsentModal) return null;

    const handleModalClick = (e: React.MouseEvent) => {
      e.stopPropagation();
    };

    const handleBackdropClick = () => {
      setShowAadharConsentModal(false);
    };

    const handleProceed = () => {
      if (aadharConsentAccepted) {
        setShowAadharConsentModal(false);
        // Call handleDigiLockerLogin with fromConsent=true to bypass the consent check
        handleDigiLockerLogin(true);
      }
    };

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        onClick={handleBackdropClick}
      >
        <div
          className="relative w-full max-w-2xl p-6 bg-white rounded-lg shadow-xl mx-4 max-h-[90vh] overflow-y-auto"
          onClick={handleModalClick}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">User Consent for Identity Verification</h3>
            <button
              type="button"
              onClick={handleBackdropClick}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-4 text-sm text-gray-700 space-y-4">
            <p>
              By proceeding, I hereby provide my explicit and informed consent to DroneTV (dronetv.in)
              to collect, use, and verify my information for the limited purpose of identity and
              profile verification on the platform.
            </p>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Purpose of Collection</h4>
              <p className="mb-2">My information will be used solely for:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Verifying my identity and/or company details</li>
                <li>Listing my professional profile or company on DroneTV</li>
                <li>Establishing authenticity and trust for platform users</li>
                <li>Compliance with applicable Indian laws and regulations</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Information Collected</h4>
              <p className="font-medium mb-1">For Individuals (Professionals)</p>
              <p className="mb-2">
                With my consent, DroneTV may access and verify the following information:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Name, Date of birth, and Address</li>
                <li>Aadhaar-based identity details through OTP authentication</li>
                <li>Documents shared via DigiLocker (such as Aadhaar, PAN, or professional certificates)</li>
              </ul>
            </div>

            <div>
              <p className="font-medium">For Companies</p>
              <p className="text-gray-600 italic mt-1">
                Company verification details will be provided separately during the GST verification process.
              </p>
            </div>

            <div className="pt-3 border-t border-gray-200">
              <p className="text-gray-600 text-sm">
                By checking the consent box, you acknowledge that you have read, understood,
                and agree to these terms of identity verification.
              </p>
            </div>
          </div>

          <div className="flex items-start mb-6">
            <div className="flex items-center h-5">
              <input
                id="aadhar-consent"
                type="checkbox"
                checked={aadharConsentAccepted}
                onChange={(e) => {
                  setAadharConsentAccepted(e.target.checked);
                }}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
              />
            </div>
            <label
              htmlFor="aadhar-consent"
              className="ml-2 block text-sm text-gray-900 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setAadharConsentAccepted(!aadharConsentAccepted);
              }}
            >
              I have read and agree to the User Consent for Identity Verification terms above.
            </label>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleBackdropClick}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleProceed}
              disabled={!aadharConsentAccepted}
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${aadharConsentAccepted
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-blue-300 cursor-not-allowed'
                }`}
            >
              Proceed with Aadhar Verification
            </button>
          </div>
        </div>
      </div>
    );
  };

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
        <div className="space-y-12 pb-10">
          {/* Company Category */}
          <div className="space-y-4">
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

          <GSTVerificationSection
            gstNumber={gstNumber}
            onGSTChange={handleGSTChange}
            onVerifyGST={handleVerifyGST}
            isVerified={gstVerified}
            isVerifying={verifyingGST}
            verifiedData={verifiedGSTData || undefined}
            address={gstAddress}
            onAddressChange={handleGstAddressChange}
            onVerifiedDataChange={(data) => setVerifiedGSTData(data)}
            formData={formData}
            updateFormData={updateFormData}
            panNumber={panNumber}
            onPanChange={setPanNumber}
            panName={panName}
            onPanNameChange={setPanName}
            panDob={panDob}
            onPanDobChange={setPanDob}
            onVerifyPAN={handleVerifyPAN}
            isVerifyingPAN={verifyingPan}
            isPANVerified={panVerified}
          />

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

          {/* Director/MD Details Section */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Director/MD Details
              </h2>
              <p className="text-sm text-slate-600">
                Tell us about your basic information
              </p>
            </div>

            <div className="space-y-10">
              {/* UPDATED: Combined Aadhar Section with SINGLE LINE HORIZONTAL LAYOUT */}
              <CombinedAadharSection
                aadharNumber={formData.aadharNumber || ""}
                onAadharChange={handleAadharChange}
                onVerifyAadhar={handleVerifyAadhar}
                isVerified={aadharVerified}
                isVerifying={isVerifyingAadhar}
                onDataVerified={handleAadharDataVerified}
                onConsentChange={(checked) => setAadharConsentAccepted(checked)}
                consentAccepted={aadharConsentAccepted}
                onDigiLockerLogin={handleDigiLockerLogin}
              />

              {/* Director/MD Information - Updated layout with phone below address */}
              <div className="p-3 bg-yellow-100 border rounded-lg border-amber-200">
                <h3 className="flex items-center mb-2 text-sm font-bold text-amber-900">
                  <User className="w-5 h-5 mr-2" />
                  Director/MD Information {aadharVerified && (
                    <span className="ml-2 text-xs text-green-600">(Auto-filled from Aadhar)</span>
                  )}
                </h3>
                <div className="space-y-3">
                  {/* Director Name with integrated Title - NON-EDITABLE when verified */}
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
                    disabled={aadharVerified}
                    nameDisabled={aadharVerified}
                  />

                  {/* Director Address - Full width */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-gray-700">
                        Director Address <span className="text-red-500">*</span>
                      </label>
                    </div>
                    <FormInput
                      label=""
                      type="textarea"
                      value={formData.directorAddress || ""}
                      onChange={(value) => updateFormData({ directorAddress: value })}
                      required={false}
                      placeholder="Enter complete address"
                      rows={3}
                      disabled={aadharVerified}
                    />
                  </div>

                  {/* Phone and Email in same row - Below address */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Director Phone - EDITABLE even when verified */}
                    <PhoneInput
                      label="Director Phone"
                      value={formData.directorPhone}
                      onChange={(value) => updateFormData({ directorPhone: value })}
                      required
                      placeholder="Enter phone number"
                      disabled={false}
                    />

                    {/* Director Email */}
                    <FormInput
                      label="Director Email"
                      type="email"
                      value={formData.directorEmail}
                      onChange={handleDirectorEmailChange}
                      required
                      placeholder="director@company.com"
                      disabled={false}
                    />
                  </div>

                  {/* Info message about auto-population */}
                  {aadharVerified && (
                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
                      <p><strong>Note:</strong> Director Name and Address are verified from Aadhar and cannot be changed. Other fields can be updated as needed.</p>
                    </div>
                  )}
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
                    required={false}
                    namePlaceholder="Full name"
                  />

                  <PhoneInput
                    label="Contact Phone"
                    value={formData.altContactPhone}
                    onChange={(value) => updateFormData({ altContactPhone: value })}
                    required={false}
                    placeholder="Enter phone number"
                  />
                  <div className="md:col-span-2">
                    <FormInput
                      label="Contact Email"
                      type="email"
                      value={formData.altContactEmail}
                      onChange={(value) => updateFormData({ altContactEmail: value })}
                      required={false}
                      placeholder="contact@company.com"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FormStep>

      <AadharConsentModal />
      <EmailVerificationModal />
    </>
  );
};

export default Step1CompanyCategory;