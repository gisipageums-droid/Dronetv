import React, { useState } from "react";
import { useForm } from "../../context/FormContext";
import { Wrench, Plus, Minus, Briefcase } from "lucide-react";

export const Step4 = ({ step }: { step: any }) => {
  const { data, addArrayItem, removeArrayItem, updateField } = useForm();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateField = (
    key: "projects" | "services",
    field: string,
    value: string
  ) => {
    let error = "";
    if (field === "description" && key === "projects") {
      if (value && value.length < 200)
        error = "Project description should be at least 200 characters.";
    }
    if (field === "serviceDetails" && key === "services") {
      if (value && value.length < 200)
        error = "Service details should be at least 200 characters.";
    }
    return error;
  };

  const handleChange = (
    key: "projects" | "services",
    index: number,
    field: string,
    value: string
  ) => {
    const arr = [...data[key]];
    arr[index] = { ...arr[index], [field]: value };
    updateField(key, arr);

    // ✅ Validate input
    const errorMsg = validateField(key, field, value);
    setErrors((prev) => ({
      ...prev,
      [`${key}-${index}-${field}`]: errorMsg,
    }));
  };

  const renderSection = (
    key: "projects" | "services",
    section: any,
    color: string
  ) => {
    const items = data[key] || [];
    const colorMap: any = { blue: "blue", green: "green" };

    return (
      <div className="bg-surface-main rounded-xl border border-brand-yellow-soft p-4 mb-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-bold text-ink flex items-center">
            {key === "services" && <Wrench className="w-4 h-4 mr-2 text-brand-gold" />}
            {key === "projects" && <Briefcase className="w-4 h-4 mr-2 text-brand-gold" />}
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </h3>

          <button
            type="button"
            onClick={() => addArrayItem(key, {})}
            className="flex items-center px-3 py-1 text-white text-sm rounded-lg bg-brand-gold hover:bg-brand-gold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add {key.slice(0, -1)}
          </button>
        </div>

        {/* Items List */}
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div key={idx} className="bg-surface-card p-3 rounded-md border shadow-sm">
              {section.fields.map((f: any) => {
                const errKey = `${key}-${idx}-${f.id}`;
                const errorMsg = errors[errKey];

                return (
                  <div key={f.id} className="mb-3">
                    <label className="block mb-1 font-medium">{f.label}</label>
                    {f.type === "textarea" ? (
                      <textarea
                        value={item[f.id] || ""}
                        onChange={(e) =>
                          handleChange(key, idx, f.id, e.target.value)
                        }
                        className={`border p-2 w-full rounded focus:ring-2 focus:ring-brand-yellow text-ink bg-surface-card ${
                          errorMsg ? "border-status-error" : ""
                        }`}
                        rows={2}
                        maxLength={1000}
                      />
                    ) : (
                      <input
                        type={f.type}
                        value={item[f.id] || ""}
                        onChange={(e) =>
                          handleChange(key, idx, f.id, e.target.value)
                        }
                        className="border p-2 w-full rounded focus:ring-2 focus:ring-brand-yellow text-ink bg-surface-card"
                      />
                    )}
                    {f.type === "textarea" && (
                      <div className="text-xs text-ink-caption mt-1">
                        {(item[f.id] || "").length}/1000 characters
                      </div>
                    )}
                    {errorMsg && (
                      <div className="text-xs text-status-error mt-1">{errorMsg}</div>
                    )}
                  </div>
                );
              })}

              <button
                type="button"
                onClick={() => removeArrayItem(key, idx)}
                className="p-1 text-status-error hover:bg-status-error/10 rounded-md flex items-center gap-1"
              >
                <Minus className="w-4 h-4" /> Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">{step.title}</h2>
      {step.projects && renderSection("projects", step.projects, "blue")}
      {step.services && renderSection("services", step.services, "green")}
    </div>
  );
};
