import { useForm } from "../../context/FormContext";
import { MultiSelect } from "../common/MultiSelect";

export const Step1 = ({ step }: { step: any }) => {
  const { data, updateField } = useForm();

  return (<>
      {/* Step Title */}
      <h2 className="text-2xl font-bold text-amber-900 border-b border-amber-300 pb-2 mb-4">
        {step.title}
      </h2>

      {/* Categories on Top */}
      {step.categories && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-3">Company Category</h3>
          <p className="text-sm text-slate-600 mb-2">
            Select your company's main business category (you can select multiple)
          </p>
          <div className="flex justify-center">
            <MultiSelect
              options={step.categories.available.map((c: any) => c.name)}
              selected={data.categories}
              onChange={vals => updateField('categories', vals)}
              variant="categories"
              />
          </div>
        </div>
      )}

          <div className="space-y-6 p-6 bg-yellow-50 rounded-xl shadow-md">
      {/* Basic Info Fields */}
      <div className="space-y-6">
        {step.basicInfo?.fields.map((f: any) => (
          <div key={f.id} className="flex flex-col">
            <label className="mb-1 font-semibold text-slate-900">{f.label}</label>
            <input
              type={f.type}
              required={f.required}
              placeholder={f.placeholder || ""}
              className="border border-amber-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition "
              value={data.basicInfo[f.id] || ''}
              onChange={e =>
                updateField('basicInfo', { ...data.basicInfo, [f.id]: e.target.value })
              }
            />
          </div>
        ))}
      </div>
    </div>
              </>
  );
};
