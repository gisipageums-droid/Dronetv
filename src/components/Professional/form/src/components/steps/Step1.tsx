import React, { useState, useEffect, useRef } from "react";
import { useForm } from "../../context/FormContext";
import { MultiSelect } from "../common/MultiSelect";
import { PhoneInput } from "../common/PhoneInput";
import { CountryStateSelect } from "../common/CountryStateSelect";

// Custom Date Picker Component (same as in Step1CompanyCategory)
interface ScrollColumnProps {
  items: Array<{ value: string; label: string }>;
  selectedValue: string;
  onSelect: (value: string) => void;
  setIsScrolling: (isScrolling: boolean) => void; // Added prop
}

const ScrollColumn = React.forwardRef<HTMLDivElement, ScrollColumnProps>(
  ({ items, selectedValue, onSelect, setIsScrolling }, ref) => {
    const handleClick = (value: string) => {
      // Vital Fix: Set scrolling to false so parent knows to auto-center
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

  // --- FIX 2: Check Dependencies ---
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

    // Removed 'isScrolling' from here so it doesn't snap back when you stop scrolling
  }, [selectedDate.day, selectedDate.month, selectedDate.year]);

  // Update when value prop changes from parent
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
        <h3 className="font-semibold text-gray-800">Date of Birth</h3>
        <p className="text-xs text-gray-600 mt-1">Select your date of birth</p>
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

  // Set original username when component mounts or when data loads
  useEffect(() => {
    if (data.basicInfo?.user_name && !originalUsername) {
      setOriginalUsername(data.basicInfo.user_name);
      // Mark as available since it's the user's own username
      setUsernameAvailable(true);
      setStepValid?.(true);
    }
  }, [data.basicInfo?.user_name, originalUsername, setStepValid]);

  // Check username availability when user types
  useEffect(() => {
    const user_name = data.basicInfo?.user_name || "";

    if (!user_name) {
      setUsernameAvailable(null);
      setStepValid?.(true);
      return;
    }

    // If username is the same as original (user's own username), don't check
    if (originalUsername && user_name === originalUsername) {
      setUsernameAvailable(true);
      setStepValid?.(true);
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
        setStepValid?.(json.available);
      } catch (err) {
        console.error(err);
        setUsernameAvailable(null);
        setStepValid?.(true);
      } finally {
        setChecking(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [data.basicInfo?.user_name, originalUsername, setStepValid]);

  // Render input field based on type
  const renderInputField = (f: any, section: any) => {
    const baseClasses =
      "border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm";

    // Handle country and state fields with dynamic API
    if (
      (f.id === "country" || f.id === "state") &&
      (section.id === "basicInfo" || section.id === "addressInformation")
    ) {
      // For country and state fields, we'll handle them together in the section rendering
      // This is a placeholder that won't be used since we'll render CountryStateSelect directly
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

    // Handle phone fields with IDD functionality - for basic info phone number AND alternate contact phone
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

    // For other phone-like fields, use regular input
    const isPhoneField =
      (f.type === "tel" ||
        f.id.toLowerCase().includes("phone") ||
        f.id.toLowerCase().includes("mobile") ||
        f.id.toLowerCase().includes("contact")) &&
      !isPhoneFieldWithCode; // Exclude the specific phone fields that use PhoneInput

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

    // Handle date fields with custom ScrollDatePicker UI
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

    // Special handling for username field - remove spaces
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
            // Remove spaces from the input value
            const value = e.target.value.replace(/\s/g, "");
            updateField(section.id, {
              ...data[section.id],
              [f.id]: value,
            });
          }}
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

  // Render a section
  // Render a section
  const renderSection = (section: any) => {
    // 1. Safe Data Access
    const sectionId = section.id;
    const currentSectionData = data[sectionId] || {};

    const useTwoColumns =
      sectionId === "socialMediaLinks" || sectionId === "alternateContact";

    return (
      <div
        key={sectionId}
        className="space-y-4 p-6 bg-yellow-50 rounded-xl shadow-md mb-6"
      >
        <h3 className="text-lg font-semibold text-slate-900 border-b border-amber-200 pb-2">
          {section.title}
        </h3>

        {useTwoColumns ? (
          // --- 2-COLUMN LAYOUT ---
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {section.fields.map((f: any) => {
              // Skip country/state here (rendered separately below)
              if (f.id === "country" || f.id === "state") return null;

              // Date Field Logic
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

            {/* Country/State Selection */}
            {section.fields.some(
              (f: any) => f.id === "country" || f.id === "state"
            ) && (
              <div className="md:col-span-2">
                <CountryStateSelect
                  countryValue={currentSectionData.country || ""}
                  stateValue={currentSectionData.state || ""}
                  onCountryChange={(value) => {
                    updateField(sectionId, {
                      country: value,
                      state: "", // Reset state when country changes
                    });
                  }}
                  onStateChange={(value) => {
                    // FIX: Send ONLY the changes.
                    updateField(sectionId, {
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
          // --- 1-COLUMN LAYOUT ---
          <div className="space-y-4">
            {section.fields.map((f: any) => {
              // Skip country/state here
              if (f.id === "country" || f.id === "state") return null;

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
                  
                  {/* Username Availability Message (Specific to Basic Info) */}
                  {section.id === "basicInfo" &&
                    f.id === "user_name" &&
                    data.basicInfo?.user_name && (
                      <span
                        className={`text-xs mt-1 ${
                          usernameAvailable === false
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
              );
            })}

            {/* Country/State Selection */}
            {section.fields.some(
              (f: any) => f.id === "country" || f.id === "state"
            ) && (
              <CountryStateSelect
                countryValue={currentSectionData.country || ""}
                stateValue={currentSectionData.state || ""}
                onCountryChange={(value) => {
                  updateField(sectionId, {
                    country: value,
                    state: "", // Reset state when country changes
                  });
                }}
                onStateChange={(value) => {
                  // FIX: Send ONLY the changes.
                  updateField(sectionId, {
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

  // Reorder sections to desired sequence
  const getOrderedSections = () => {
    if (!step.sections) return [];

    const basicInfo = step.sections.find((s: any) => s.id === "basicInfo");
    const addressInfo = step.sections.find(
      (s: any) => s.id === "addressInformation"
    );
    const alternateContact = step.sections.find(
      (s: any) => s.id === "alternateContact"
    );
    const socialMedia = step.sections.find(
      (s: any) => s.id === "socialMediaLinks"
    );

    return [basicInfo, addressInfo, alternateContact, socialMedia].filter(
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

      {/* Render All Sections in Correct Order */}
      {step.sections ? (
        getOrderedSections().map(renderSection)
      ) : (
        /* Fallback for old structure - render only basicInfo */
        <div className="space-y-4 p-6 bg-yellow-50 rounded-xl shadow-md">
          <div className="space-y-4">
            {step.basicInfo?.fields.map((f: any) => (
              <div key={f.id} className="flex flex-col">
                <label className="mb-1 font-semibold text-slate-900 text-sm">
                  {f.label}
                </label>
                {f.id === "Phonenumber" ? (
                  <PhoneInput
                    value={data.basicInfo?.[f.id] || ""}
                    onChange={(value) =>
                      updateField("basicInfo", {
                        ...data.basicInfo,
                        [f.id]: value,
                      })
                    }
                    placeholder={f.placeholder || "Enter phone number"}
                    required={f.required}
                    className=""
                  />
                ) : f.type === "date" ||
                  f.id.toLowerCase().includes("birth") ||
                  f.id.toLowerCase().includes("dob") ? (
                  <ScrollDatePicker
                    value={data.basicInfo?.[f.id] || ""}
                    onChange={(value) =>
                      updateField("basicInfo", {
                        ...data.basicInfo,
                        [f.id]: value,
                      })
                    }
                  />
                ) : (
                  <input
                    type={f.type}
                    required={f.required}
                    placeholder={f.placeholder || ""}
                    className={`border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm
                      ${f.id === "user_name" && usernameAvailable === false
                        ? "border-red-500 focus:ring-red-300"
                        : ""
                      }`}
                    value={data.basicInfo?.[f.id] || ""}
                    onChange={(e) => {
                      let value = e.target.value;
                      // Remove spaces for username field
                      if (f.id === "user_name") {
                        value = value.replace(/\s/g, "");
                      }
                      updateField("basicInfo", {
                        ...data.basicInfo,
                        [f.id]: value,
                      });
                    }}
                  />
                )}
                {f.id === "user_name" && data.basicInfo?.user_name && (
                  <span
                    className={`text-xs mt-1 ${usernameAvailable === false
                      ? "text-red-600"
                      : usernameAvailable === true &&
                        originalUsername &&
                        data.basicInfo.user_name === originalUsername
                        ? "text-green-600"
                        : "text-gray-600"
                      }`}
                  >
                    {checking
                      ? "Checking availability..."
                      : usernameAvailable === false
                        ? "Username is taken"
                        : usernameAvailable === true &&
                          originalUsername &&
                          data.basicInfo.user_name === originalUsername
                          ? "Your username"
                          : usernameAvailable === true
                            ? "Username is available"
                            : ""}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
