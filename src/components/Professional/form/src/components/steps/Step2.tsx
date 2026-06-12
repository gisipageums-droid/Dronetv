import { useForm } from "../../context/FormContext";
import { MultiSelect } from "../common/MultiSelect";

interface Subcategory {
  parent: string;
  name: string;
}

export const Step2 = ({ step, allSteps }: { step: any; allSteps: any[] }) => {
  const { data, updateField } = useForm();

  // Step1 categories from JSON
  const step1 = allSteps.find((s) => s.id === "step1");
  const selectedCategories: string[] = data.categories || [];

  const noCategoriesSelected = selectedCategories.length === 0;

  // Handle changes for a particular category
  const handleChange = (category: string, vals: string[]) => {
    const transformed: Subcategory[] = vals.map((name) => ({ parent: category, name }));
    const newSubcategories = [
      ...(data.subcategories || []).filter((sc) => sc.parent !== category),
      ...transformed
    ];
    updateField("subcategories", newSubcategories);
  };

  // Predefined colors for containers
  const containerColors = ["bg-amber-50 border border-amber-300", "bg-amber-50 border border-amber-300"];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">{step.title}</h2>

      {noCategoriesSelected && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
          <span className="text-amber-500 text-xl mt-0.5">ℹ</span>
          <div>
            <p className="text-amber-800 font-medium text-sm">No categories selected yet</p>
            <p className="text-amber-700 text-sm mt-1">Go back to Step 1 and select at least one Professional Category to see subcategory options here. This step is optional.</p>
          </div>
        </div>
      )}

      {!noCategoriesSelected &&
        selectedCategories.map((catName, index) => {
          const catObj = step1?.categories?.available?.find((c: any) => c.name === catName);
          const subcategoryOptions = catObj?.subcategories?.map((sc: any) => sc.name) || [];
          const selectedForCategory = (data.subcategories || [])
            .filter((sc) => sc.parent === catName)
            .map((sc) => sc.name);

          const colorClass = containerColors[index % containerColors.length];

          return (
            <div
              key={catName}
              className={`border ${colorClass} p-4 rounded-lg shadow-sm space-y-2`}
            >
              <h3 className="font-semibold text-gray-700">{catName}</h3>
              <MultiSelect
                options={subcategoryOptions}
                selected={selectedForCategory}
                onChange={(vals) => handleChange(catName, vals)} variant="subcategories"
              />
            </div>
          );
        })}
    </div>
  );
};
