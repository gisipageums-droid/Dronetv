import { useForm } from "../../context/FormContext";
import { useState } from "react";

interface SkillNode {
  name: string;
  id?: string;
  subcategories?: SkillNode[];
}

interface SkillContainerProps {
  level: number;
  nodes: SkillNode[];
  expandedPath: SkillNode[];
  onClick: (node: SkillNode, level: number, parents: string[]) => void;
  selectedSkills: string[];
  parents: string[];
}

const containerClasses = (level: number) => {
  if (level === 0) return "bg-transparent border-0"; // clear top-level
  if (level === 1) return "bg-blue-50 border border-blue-200"; // 2nd level
  return "bg-white border border-gray-200"; // deeper levels
};

const SkillContainer = ({
  level,
  nodes,
  expandedPath,
  onClick,
  selectedSkills,
  parents,
}: SkillContainerProps) => {
  return (
    <div className={`p-3 rounded-lg ${containerClasses(level)} space-y-2`}>
      {nodes.map((node) => {
        const isLeaf = !node.subcategories || node.subcategories.length === 0;
        const isExpanded =
          expandedPath.length > level &&
          expandedPath[level]?.name === node.name;
        const isSelected = selectedSkills.includes(node.name);

        return (
          <div key={node.id || node.name}>
            {/* Checkbox + Label */}
            <div
              onClick={() => onClick(node, level, parents)}
              className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer ${
                isSelected ? "bg-yellow-100" : "hover:bg-yellow-50"
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onClick(node, level, parents)}
                className="w-3 h-3"
              />
              <span className="text-xs font-medium">{node.name}</span>
            </div>

            {/* Children */}
            {isExpanded && node.subcategories && node.subcategories.length > 0 && (
              <div className="ml-4 mt-2">
                <SkillContainer
                  level={level + 1}
                  nodes={node.subcategories}
                  expandedPath={expandedPath}
                  onClick={onClick}
                  selectedSkills={selectedSkills}
                  parents={[...parents, node.name]}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};


export const Step3 = ({ step }: { step: any }) => {
  const { data, updateField } = useForm();
  const [expandedPath, setExpandedPath] = useState<SkillNode[]>([]);

  const toggleExpand = (node: SkillNode, level: number, parents: string[]) => {
    const isLeaf = !node.subcategories || node.subcategories.length === 0;
    const current = new Set(data.skills);

    if (isLeaf) {
      const fullPath = [...parents, node.name];
      if (current.has(node.name)) {
        current.delete(node.name);
      } else {
        fullPath.forEach((s) => current.add(s));
      }
      updateField("skills", Array.from(current));
    } else {
      // toggle parent node
      if (current.has(node.name)) {
        current.delete(node.name);
      } else {
        current.add(node.name);
      }
      updateField("skills", Array.from(current));

      // expand/collapse
      if (expandedPath[level]?.name === node.name) {
        setExpandedPath(expandedPath.slice(0, level));
      } else {
        setExpandedPath([...expandedPath.slice(0, level), node]);
      }
    }
  };

  // Freeform skill handling (same as before)
  const handleFreeformKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const value = e.currentTarget.value.trim().replace(",", "");
      if (value && !data.freeformSkills.includes(value)) {
        updateField("freeformSkills", [...data.freeformSkills, value]);
      }
      e.currentTarget.value = "";
    }
  };

  const removeFreeformSkill = (skill: string) => {
    updateField(
      "freeformSkills",
      data.freeformSkills.filter((s) => s !== skill)
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{step.title}</h2>

      {/* Recursive Skill Tree */}
      <SkillContainer
        level={0}
        nodes={step.skills?.tree || []}
        expandedPath={expandedPath}
        onClick={toggleExpand}
        selectedSkills={data.skills || []}
        parents={[]}
      />

      {/* Freeform Skills */}
      {step.skills?.freeformSkills?.enabled && (
        <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-white border border-yellow-200">
          <label className="block mb-2 font-medium text-xs">
            {step.skills.freeformSkills.placeholder}
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {data.freeformSkills.map((skill) => (
              <span
                key={skill}
                className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700 flex items-center gap-1"
              >
                {skill}
                <button
                  onClick={() => removeFreeformSkill(skill)}
                  className="text-red-500 font-bold text-xs"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            className="border p-2 w-full rounded text-xs focus:ring-2 focus:ring-yellow-400"
            placeholder="Type and press Enter or comma..."
            onKeyDown={handleFreeformKeyDown}
          />
        </div>
      )}
    </div>
  );
};
