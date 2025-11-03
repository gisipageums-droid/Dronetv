import { useState, useEffect } from "react";
import { useForm } from "../../context/FormContext";
import { MultiSelect } from "../common/MultiSelect";
import { countries, indianStates } from "../../data/countries"; // Adjust path as needed

export const Step1 = ({ step, setStepValid }: { step: any; setStepValid?: (valid: boolean) => void }) => {
  const { data, updateField } = useForm();

  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");

  // Check username availability when user types
  useEffect(() => {
    const username = data.basicInfo?.user_name || "";
    if (!username) {
      setUsernameAvailable(null);
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
            body: JSON.stringify({ username }),
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
  }, [data.basicInfo?.user_name, setStepValid]);

  // Render input field based on type
  const renderInputField = (f: any, section: any) => {
    const baseClasses = "border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm";

    // Handle dropdown for country
    if (f.id === "country" && (section.id === "basicInfo" || section.id === "addressInformation")) {
      return (
        <select
          className={baseClasses}
          value={data[section.id]?.[f.id] || ""}
          onChange={(e) => {
            updateField(section.id, { 
              ...data[section.id], 
              [f.id]: e.target.value 
            });
            if (section.id === "addressInformation") {
              setSelectedCountry(e.target.value);
            }
          }}
        >
          <option value="">Select Country</option>
          {countries.map((country) => (
            <option key={country.value} value={country.value}>
              {country.label}
            </option>
          ))}
        </select>
      );
    }

    // Handle dropdown for state (address section only)
    if (f.id === "state" && section.id === "addressInformation") {
      const stateOptions = selectedCountry === "IN" ? indianStates : [];
      
      return (
        <select
          className={baseClasses}
          value={data[section.id]?.[f.id] || ""}
          onChange={(e) =>
            updateField(section.id, { 
              ...data[section.id], 
              [f.id]: e.target.value 
            })
          }
        >
          <option value="">Select State</option>
          {stateOptions.map((state) => (
            <option key={state.value} value={state.value}>
              {state.label}
            </option>
          ))}
        </select>
      );
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
              [f.id]: e.target.value 
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

    return (
      <input
        type={f.type}
        required={f.required}
        placeholder={f.placeholder || ""}
        className={`${baseClasses} ${
          section.id === "basicInfo" && f.id === "user_name" && usernameAvailable === false
            ? "border-red-500 focus:ring-red-300"
            : ""
        }`}
        value={data[section.id]?.[f.id] || ""}
        onChange={(e) =>
          updateField(section.id, { 
            ...data[section.id], 
            [f.id]: e.target.value 
          })
        }
      />
    );
  };

  // Render a section
  const renderSection = (section: any) => {
    // Check if this section should use 2-column layout
    const useTwoColumns = section.id === "socialMediaLinks" || section.id === "alternateContact";
    
    return (
      <div key={section.id} className="space-y-4 p-6 bg-yellow-50 rounded-xl shadow-md mb-6">
        <h3 className="text-lg font-semibold text-slate-900 border-b border-amber-200 pb-2">
          {section.title}
        </h3>
        
        {useTwoColumns ? (
          // 2-column grid layout
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {section.fields.map((f: any) => (
              <div key={f.id} className="flex flex-col">
                <label className="mb-1 font-medium text-slate-800 text-sm">
                  {f.label}
                  {f.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {renderInputField(f, section)}
              </div>
            ))}
          </div>
        ) : (
          // Single column layout for basicInfo and addressInformation
          <div className="space-y-4">
            {section.fields.map((f: any) => (
              <div key={f.id} className="flex flex-col">
                <label className="mb-1 font-medium text-slate-800 text-sm">
                  {f.label}
                  {f.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {renderInputField(f, section)}
                {section.id === "basicInfo" && f.id === "user_name" && data.basicInfo?.user_name && (
                  <span className={`text-xs mt-1 ${
                    usernameAvailable === false ? 'text-red-600' : 
                    usernameAvailable === true ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {checking
                      ? "Checking availability..."
                      : usernameAvailable === false
                      ? "❌ Username is taken"
                      : usernameAvailable === true
                      ? "✅ Username is available"
                      : ""}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Reorder sections to desired sequence
  const getOrderedSections = () => {
    if (!step.sections) return [];
    
    const basicInfo = step.sections.find((s: any) => s.id === "basicInfo");
    const addressInfo = step.sections.find((s: any) => s.id === "addressInformation");
    const alternateContact = step.sections.find((s: any) => s.id === "alternateContact");
    const socialMedia = step.sections.find((s: any) => s.id === "socialMediaLinks");
    
    return [basicInfo, addressInfo, alternateContact, socialMedia].filter(Boolean);
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-amber-900 border-b border-amber-300 pb-2 mb-6">
        {step.title}
      </h2>

      {step.categories && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-3">Professional Category</h3>
          <p className="text-sm text-slate-600 mb-4">
            Select your Professional's main business category (you can select multiple)
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
                <label className="mb-1 font-semibold text-slate-900 text-sm">{f.label}</label>
                <input
                  type={f.type}
                  required={f.required}
                  placeholder={f.placeholder || ""}
                  className={`border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm
                    ${
                      f.id === "user_name" && usernameAvailable === false
                        ? "border-red-500 focus:ring-red-300"
                        : ""
                    }`}
                  value={data.basicInfo?.[f.id] || ""}
                  onChange={(e) =>
                    updateField("basicInfo", { ...data.basicInfo, [f.id]: e.target.value })
                  }
                />
                {f.id === "user_name" && data.basicInfo?.user_name && (
                  <span className="text-xs mt-1">
                    {checking
                      ? "Checking availability..."
                      : usernameAvailable === false
                      ? "Username is taken"
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