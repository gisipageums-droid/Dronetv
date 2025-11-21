import React, { useState, useEffect, useRef } from "react";
import { useForm } from "../../context/FormContext";
import axios from "axios";

// Custom Date Picker Component (same as in Step1CompanyCategory)
const ScrollDatePicker: React.FC<{
  value: string;
  onChange: (date: string) => void;
  title?: string;
  description?: string;
}> = ({ value, onChange, title = "Date", description = "Select date" }) => {
  // ... (keep all the existing ScrollDatePicker code as is)
  // [Previous ScrollDatePicker implementation remains unchanged]
};

export const Step1 = ({
  step,
  setStepValid,
}: {
  step: any;
  setStepValid?: (valid: boolean) => void;
}) => {
  const { data, updateField } = useForm();

  // Character limits configuration
  const characterLimits = {
    eventTitle: 25,
    eventTagline: 50,
    eventDescription: 200,
    venueName: 25,
    venueAddress: 200,
  };

  // State for event title availability check
  const [eventTitleStatus, setEventTitleStatus] = useState<{
    available: boolean;
    suggestions?: string[];
    message: string;
  } | null>(null);
  const [isCheckingEventTitle, setIsCheckingEventTitle] = useState(false);
  const eventTitleCheckTimer = useRef<NodeJS.Timeout | null>(null);

  // Auto-fill today's date and current time when countdown is enabled and target date is empty
  useEffect(() => {
    if (data.countdownEnabled && !data.countdownTargetDate) {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const nowString = `${year}-${month}-${day}T${hours}:${minutes}`;
      updateField("countdownTargetDate", nowString);
    }
  }, [data.countdownEnabled, data.countdownTargetDate, updateField]);

  // Validation effect for required fields - UPDATED VERSION
  useEffect(() => {
    if (!step.fields) return;

    const requiredFields = step.fields.filter((field: any) => field.required);
    const isValid = requiredFields.every((field: any) => {
      const value = data[field.id];
      return value !== undefined && value !== null && value !== "";
    });

    setStepValid?.(isValid);
  }, [data, step.fields, setStepValid]);

  // Function to check event title availability
  const checkEventTitle = async (title: string) => {
    if (!title.trim()) {
      setEventTitleStatus(null);
      return;
    }

    setIsCheckingEventTitle(true);
    try {
      const response = await axios.get(
        `https://9fszydao5h.execute-api.ap-south-1.amazonaws.com/prod/events/check-name?name=${encodeURIComponent(title)}`
      );
      
      setEventTitleStatus(response.data);
    } catch (error) {
      console.error("Error checking event title:", error);
      setEventTitleStatus({
        available: false,
        message: "Error checking event title availability. Please try again.",
      });
    } finally {
      setIsCheckingEventTitle(false);
    }
  };

  // Debounced event title check
  const handleEventTitleChange = (value: string) => {
    updateField("eventTitle", value);

    // Clear existing timer
    if (eventTitleCheckTimer.current) {
      clearTimeout(eventTitleCheckTimer.current);
    }

    // Set new timer for debounced API call
    if (value.trim()) {
      eventTitleCheckTimer.current = setTimeout(() => {
        checkEventTitle(value);
      }, 500); // 500ms debounce
    } else {
      setEventTitleStatus(null);
    }
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (eventTitleCheckTimer.current) {
        clearTimeout(eventTitleCheckTimer.current);
      }
    };
  }, []);

  // Handle date change for countdown target
  const handleCountdownDateChange = (date: string, time: string) => {
    if (date && time) {
      const dateTimeString = `${date}T${time}`;
      updateField("countdownTargetDate", dateTimeString);
    } else if (date) {
      // If only date is provided, keep existing time or set to 00:00
      const currentValue = data.countdownTargetDate || "";
      const currentTime = currentValue.includes("T")
        ? currentValue.split("T")[1]
        : "00:00";
      updateField("countdownTargetDate", `${date}T${currentTime}`);
    } else if (time) {
      // If only time is provided, keep existing date
      const currentValue = data.countdownTargetDate || "";
      const currentDate = currentValue.includes("T")
        ? currentValue.split("T")[0]
        : new Date().toISOString().split("T")[0];
      updateField("countdownTargetDate", `${currentDate}T${time}`);
    }
  };

  // Render input field based on type
  const renderInputField = (field: any) => {
    const baseClasses =
      "border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm w-full";
    const currentValue = data[field.id] || "";
    const charLimit = characterLimits[field.id as keyof typeof characterLimits];
    const charsRemaining = charLimit ? charLimit - currentValue.length : null;

    // Handle countdownTargetDate with custom date picker and time picker on separate lines
    if (field.id === "countdownTargetDate") {
      const currentDate = currentValue.includes("T")
        ? currentValue.split("T")[0]
        : currentValue;
      const currentTime = currentValue.includes("T")
        ? currentValue.split("T")[1]
        : "00:00";

      return (
        <div className="space-y-3">
          {/* Custom Date Picker - Full width on first line */}
          <div>
            <label className="mb-1 font-medium text-slate-800 text-sm block">
              Date
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <ScrollDatePicker
              value={currentDate}
              onChange={(value) =>
                handleCountdownDateChange(value, currentTime)
              }
              title="Countdown Target Date"
              description="Select the target date for countdown"
            />
          </div>

          {/* Time Input - Full width on second line */}
          <div>
            <label className="mb-1 font-medium text-slate-800 text-sm block">
              Time
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="time"
              className={baseClasses}
              value={currentTime}
              onChange={(e) =>
                handleCountdownDateChange(currentDate, e.target.value)
              }
              required={field.required}
              style={{
                colorScheme: "light",
              }}
            />
          </div>
        </div>
      );
    }

    // Handle eventTitle field with availability check
    if (field.id === "eventTitle") {
      return (
        <div className="relative">
          <input
            type={field.type}
            className={`${baseClasses} ${charLimit ? "pr-10" : ""} ${
              eventTitleStatus && !eventTitleStatus.available
                ? "border-red-300 focus:ring-red-400"
                : eventTitleStatus?.available
                ? "border-green-300 focus:ring-green-400"
                : ""
            }`}
            value={currentValue}
            onChange={(e) => {
              if (charLimit && e.target.value.length > charLimit) {
                e.target.value = e.target.value.slice(0, charLimit);
              }
              handleEventTitleChange(e.target.value);
            }}
            required={field.required}
            placeholder={field.placeholder || ""}
            maxLength={charLimit}
          />
          {charLimit && (
            <div
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-xs ${
                charsRemaining && charsRemaining < 10
                  ? "text-red-500"
                  : "text-slate-500"
              }`}
            >
              {charsRemaining}
            </div>
          )}

          {/* Event Title Availability Status */}
          {isCheckingEventTitle && (
            <div className="absolute left-0 top-full mt-1 text-xs text-blue-600">
              Checking availability...
            </div>
          )}
          {eventTitleStatus && !eventTitleStatus.available && (
            <div className="absolute left-0 top-full mt-1">
              <div className="text-xs text-red-600 mb-1">
                {eventTitleStatus.message}
              </div>
              {eventTitleStatus.suggestions && eventTitleStatus.suggestions.length > 0 && (
                <div className="text-xs text-amber-700">
                  <span className="font-medium">Suggestions:</span>{" "}
                  {eventTitleStatus.suggestions.join(", ")}
                </div>
              )}
            </div>
          )}
          {eventTitleStatus && eventTitleStatus.available && (
            <div className="absolute left-0 top-full mt-1 text-xs text-green-600">
              {eventTitleStatus.message || "Event title is available!"}
            </div>
          )}
        </div>
      );
    }

    // Handle date fields with custom ScrollDatePicker
    if (field.type === "date") {
      const fieldTitles: { [key: string]: string } = {
        startDate: "Start Date",
        endDate: "End Date",
      };

      const fieldDescriptions: { [key: string]: string } = {
        startDate: "Select the event start date",
        endDate: "Select the event end date",
      };

      return (
        <ScrollDatePicker
          value={currentValue}
          onChange={(value) => updateField(field.id, value)}
          title={fieldTitles[field.id] || "Date"}
          description={fieldDescriptions[field.id] || "Select date"}
        />
      );
    }

    // Handle time fields
    if (field.type === "time") {
      return (
        <input
          type="time"
          className={baseClasses}
          value={currentValue}
          onChange={(e) => updateField(field.id, e.target.value)}
          required={field.required}
        />
      );
    }

    // Handle datetime fields
    if (field.type === "datetime") {
      return (
        <input
          type="datetime-local"
          className={baseClasses}
          value={currentValue}
          onChange={(e) => updateField(field.id, e.target.value)}
          required={field.required}
        />
      );
    }

    // Handle textarea fields
    if (field.type === "textarea") {
      return (
        <div className="relative">
          <textarea
            className={`${baseClasses} min-h-[100px] resize-vertical pr-10`}
            value={currentValue}
            onChange={(e) => {
              if (charLimit && e.target.value.length > charLimit) {
                e.target.value = e.target.value.slice(0, charLimit);
              }
              updateField(field.id, e.target.value);
            }}
            required={field.required}
            placeholder={field.placeholder || ""}
            rows={4}
            maxLength={charLimit}
          />
          {charLimit && (
            <div
              className={`absolute bottom-2 right-2 text-xs ${
                charsRemaining && charsRemaining < 10
                  ? "text-red-500"
                  : "text-slate-500"
              }`}
            >
              {charsRemaining}
            </div>
          )}
        </div>
      );
    }

    // Handle checkbox fields
    if (field.type === "checkbox") {
      return (
        <div className="flex items-center">
          <input
            type="checkbox"
            className="w-4 h-4 text-amber-600 border-amber-300 rounded focus:ring-amber-500"
            checked={data[field.id] || false}
            onChange={(e) => updateField(field.id, e.target.checked)}
          />
          <label className="ml-2 text-sm text-slate-700">
            Enable countdown
          </label>
        </div>
      );
    }

    // Default text input with character limit
    return (
      <div className="relative">
        <input
          type={field.type}
          className={`${baseClasses} ${charLimit ? "pr-10" : ""}`}
          value={currentValue}
          onChange={(e) => {
            if (charLimit && e.target.value.length > charLimit) {
              e.target.value = e.target.value.slice(0, charLimit);
            }
            updateField(field.id, e.target.value);
          }}
          required={field.required}
          placeholder={field.placeholder || ""}
          maxLength={charLimit}
        />
        {charLimit && (
          <div
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-xs ${
              charsRemaining && charsRemaining < 10
                ? "text-red-500"
                : "text-slate-500"
            }`}
          >
            {charsRemaining}
          </div>
        )}
      </div>
    );
  };

  // Generate human-readable label from field ID
  const generateLabel = (fieldId: string): string => {
    const labelMap: { [key: string]: string } = {
      eventTitle: "Event Title",
      eventTagline: "Event Tagline",
      startDate: "Start Date",
      endDate: "End Date",
      timeStart: "Start Time",
      timeEnd: "End Time",
      venueName: "Venue Name",
      venueAddress: "Venue Address",
      organizer: "Organizer",
      eventDescription: "Event Description",
      countdownEnabled: "Enable Countdown",
      countdownTargetDate: "Countdown Target Date & Time",
    };

    return (
      labelMap[fieldId] ||
      fieldId
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase())
    );
  };

  // Group fields for better layout
  const groupFields = () => {
    if (!step.fields) return [];

    const groups = [
      {
        title: "Event Details",
        fields: step.fields.filter((f: any) =>
          ["eventTitle", "eventTagline", "eventDescription"].includes(f.id)
        ),
      },
      {
        title: "Date & Time",
        fields: step.fields.filter((f: any) =>
          ["startDate", "endDate", "timeStart", "timeEnd"].includes(f.id)
        ),
      },
      {
        title: "Venue Information",
        fields: step.fields.filter((f: any) =>
          ["venueName", "venueAddress"].includes(f.id)
        ),
      },
      {
        title: "Organizer",
        fields: step.fields.filter((f: any) => ["organizer"].includes(f.id)),
      },
      {
        title: "Countdown Settings",
        fields: step.fields.filter((f: any) =>
          ["countdownEnabled", "countdownTargetDate"].includes(f.id)
        ),
      },
    ];

    return groups.filter((group) => group.fields.length > 0);
  };

  const fieldGroups = groupFields();

  return (
    <>
      <h2 className="text-2xl font-bold text-amber-900 border-b border-amber-300 pb-2 mb-6">
        {step.title}
      </h2>

      <div className="space-y-8">
        {fieldGroups.map((group, index) => (
          <div
            key={index}
            className="space-y-4 p-6 bg-yellow-50 rounded-xl shadow-md"
          >
            <h3 className="text-lg font-semibold text-slate-900 border-b border-amber-200 pb-2">
              {group.title}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {group.fields.map((field: any) => {
                // Special handling for countdown fields - show target date only when enabled
                if (
                  field.id === "countdownTargetDate" &&
                  !data.countdownEnabled
                ) {
                  return null;
                }

                // Full width for certain fields
                const isFullWidth = [
                  "eventDescription",
                  "venueAddress",
                  "eventTagline",
                  "countdownTargetDate", // Make countdown date+time full width
                  "startDate", // Make date pickers full width
                  "endDate", // Make date pickers full width
                ].includes(field.id);

                const charLimit =
                  characterLimits[field.id as keyof typeof characterLimits];

                return (
                  <div
                    key={field.id}
                    className={`flex flex-col ${
                      isFullWidth ? "md:col-span-2" : ""
                    }`}
                  >
                    {/* Don't show label for date fields since ScrollDatePicker has its own title */}
                    {field.type !== "date" &&
                      field.id !== "countdownTargetDate" && (
                        <label className="mb-1 font-medium text-slate-800 text-sm">
                          {generateLabel(field.id)}
                          {field.required && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                          {charLimit && (
                            <span className="text-slate-500 text-xs font-normal ml-2">
                              (max {charLimit} characters)
                            </span>
                          )}
                        </label>
                      )}
                    {renderInputField(field)}

                    {/* Helper text for specific fields */}
                    {field.id === "countdownTargetDate" && (
                      <p className="text-xs text-slate-500 mt-1">
                        Set the date and time for the countdown timer
                      </p>
                    )}

                    {field.id === "eventTagline" && (
                      <p className="text-xs text-slate-500 mt-1">
                        A catchy phrase that summarizes your event
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};