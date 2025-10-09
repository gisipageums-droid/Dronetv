
import { useForm } from "../../context/FormContext";
import { Wrench, Plus, Minus, Briefcase } from "lucide-react";

export const Step4 = ({ step }: { step: any }) => {
  const { data, addArrayItem, removeArrayItem, updateField } = useForm();

  const handleChange = (
    key: "projects" | "services",
    index: number,
    field: string,
    value: string
  ) => {
    const arr = [...data[key]];
    arr[index] = { ...arr[index], [field]: value };
    updateField(key, arr);
  };

  const renderSection = (
    key: "projects" | "services",
    section: any,
    color: string
  ) => {
    const items = data[key] || [];
    const colorMap: any = { blue: "blue", green: "green", yellow: "yellow" };

    return (
      <div className={`bg-${colorMap[color]}-50 rounded-lg p-3`}>
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <h3 className={`text-sm font-bold text-${colorMap[color]}-900 flex items-center`}>
            {key === "services" && <Wrench className="w-5 h-5 mr-2" />}
            {key === "projects" && <Briefcase className="w-5 h-5 mr-2" />}
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </h3>
    
          <button
  type="button"
  onClick={() => addArrayItem(key, {})}
  className={`flex items-center px-3 py-1 text-white text-sm rounded-md ${
    key === "projects" ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"
  }`}
>
  <Plus className="w-4 h-4 mr-2" />
  Add {key.slice(0, -1)}
</button>

        </div>

        {/* Items List */}
        <div className="space-y-2">
          {items.length === 0 && (
            <div
            className={`text-center py-4 bg-white rounded-md border-2 border-dashed border-${colorMap[color]}-200`}
            >
              {key === "services" && (
                <Wrench className="w-8 h-8 text-green-300 mx-auto mb-2" />
              )
            }
            {key === "projects" && <Briefcase className="w-8 h-8 text-blue-300 mx-auto mb-2" />}
              <p className={`text-${colorMap[color]}-600 text-sm font-medium`}>
                No {key} added yet
              </p>
              <p className={`text-${colorMap[color]}-500 text-xs`}>
                Click "Add {key.slice(0, -1)}" to start
              </p>
            </div>
          )}

          {items.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-3 rounded-md border shadow-sm"
            >
              {section.fields.map((f: any) => (
                <div key={f.id} className="mb-3">
                  <label className="block mb-1 font-medium">{f.label}</label>
                  {f.type === "textarea" ? (
                    <textarea
                      value={item[f.id] || ""}
                      onChange={(e) =>
                        handleChange(key, idx, f.id, e.target.value)
                      }
                      className="border p-2 w-full rounded focus:ring-2 focus:ring-yellow-400"
                      rows={2}
                      maxLength={200}
                    />
                  ) : (
                    <input
                      type={f.type}
                      value={item[f.id] || ""}
                      onChange={(e) =>
                        handleChange(key, idx, f.id, e.target.value)
                      }
                      className="border p-2 w-full rounded focus:ring-2 focus:ring-yellow-400"
                    />
                  )}
                  {f.type === "textarea" && (
                    <div className="text-xs text-slate-500 mt-1">
                      {(item[f.id] || "").length}/200 characters
                    </div>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={() => removeArrayItem(key, idx)}
                className="p-1 text-red-600 hover:bg-red-50 rounded-md flex items-center gap-1"
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
