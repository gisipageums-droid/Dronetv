import React, { useState, useEffect, useCallback } from "react";
import {
  Code,
  Database,
  Cloud,
  Smartphone,
  Palette,
  GitBranch,
  Server,
  Shield,
  Zap,
  Settings,
  BarChart,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface Skill {
  name: string;
  level: number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface SkillCategory {
  title: string;
  color: string;
  skills: Skill[];
}

export interface SkillContent {
  subtitle: string;
  categories: SkillCategory[];
  technologies: string[];
}

interface SkillsProps {
  content: SkillContent;
  onSave: (updatedContent: SkillContent) => void;
}

const getIconForSkill = (
  skillName: string
): React.ComponentType<React.SVGProps<SVGSVGElement>> => {
  const name = skillName.toLowerCase();
  if (name.includes("react") || name.includes("vue") || name.includes("js"))
    return Code;
  if (
    name.includes("database") ||
    name.includes("sql") ||
    name.includes("mongodb") ||
    name.includes("postgres")
  )
    return Database;
  if (name.includes("cloud") || name.includes("aws") || name.includes("azure"))
    return Cloud;
  if (
    name.includes("mobile") ||
    name.includes("flutter") ||
    name.includes("native")
  )
    return Smartphone;
  if (
    name.includes("css") ||
    name.includes("design") ||
    name.includes("tailwind")
  )
    return Palette;
  if (name.includes("git")) return GitBranch;
  if (
    name.includes("server") ||
    name.includes("node") ||
    name.includes("python") ||
    name.includes("django")
  )
    return Server;
  if (name.includes("security")) return Shield;
  if (name.includes("performance")) return Zap;
  if (
    name.includes("docker") ||
    name.includes("kubernetes") ||
    name.includes("ci/cd")
  )
    return Settings;
  if (name.includes("monitoring") || name.includes("analytics"))
    return BarChart;
  return Code;
};

const Skills: React.FC<SkillsProps> = ({ content, onSave }) => {
  const [skillContent, setSkillContent] = useState<SkillContent | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [technologiesInput, setTechnologiesInput] = useState("");

  useEffect(() => {
    if (content) {
      const processedContent = {
        ...content,
        categories: (content.categories || []).map((category) => ({
          ...category,
          skills: (category.skills || []).map((skill) => ({
            ...skill,
            icon: getIconForSkill(skill.name),
            level:
              typeof skill.level === "number"
                ? Math.max(0, Math.min(100, skill.level))
                : 50,
          })),
        })),
        technologies: content.technologies || [],
      };
      setSkillContent(processedContent);
      setTechnologiesInput((content.technologies || []).join(", "));
    }
  }, [content]);

  const handleSkillUpdate = useCallback(
    (
      categoryIndex: number,
      skillIndex: number,
      key: keyof Skill,
      value: string | number
    ) => {
      setSkillContent((prev) => {
        if (
          !prev ||
          categoryIndex < 0 ||
          categoryIndex >= prev.categories.length
        )
          return prev;

        const newCategories = [...prev.categories];
        const category = newCategories[categoryIndex];

        if (
          !category.skills ||
          skillIndex < 0 ||
          skillIndex >= category.skills.length
        )
          return prev;

        const newSkills = [...category.skills];
        const skill = { ...newSkills[skillIndex] };

        if (key === "name" && typeof value === "string") {
          skill.name = value;
          skill.icon = getIconForSkill(value);
        } else if (key === "level" && typeof value === "number") {
          skill.level = Math.max(0, Math.min(100, value));
        }

        newSkills[skillIndex] = skill;
        newCategories[categoryIndex] = { ...category, skills: newSkills };

        return { ...prev, categories: newCategories };
      });
    },
    []
  );

  const addNewSkill = (categoryIndex: number) => {
    if (
      !skillContent ||
      categoryIndex < 0 ||
      categoryIndex >= skillContent.categories.length
    )
      return;

    setSkillContent((prev) => {
      if (!prev) return prev;
      const newCategories = [...prev.categories];
      const category = newCategories[categoryIndex];

      newCategories[categoryIndex] = {
        ...category,
        skills: [
          ...(category.skills || []),
          {
            name: "New Skill",
            level: 50,
            icon: Code,
          },
        ],
      };

      return { ...prev, categories: newCategories };
    });
  };

  const removeSkill = (categoryIndex: number, skillIndex: number) => {
    if (
      !skillContent ||
      categoryIndex < 0 ||
      categoryIndex >= skillContent.categories.length
    )
      return;

    setSkillContent((prev) => {
      if (!prev) return prev;
      const newCategories = [...prev.categories];
      const category = newCategories[categoryIndex];

      if (
        !category.skills ||
        skillIndex < 0 ||
        skillIndex >= category.skills.length
      )
        return prev;

      const newSkills = [...category.skills];
      newSkills.splice(skillIndex, 1);

      newCategories[categoryIndex] = { ...category, skills: newSkills };
      return { ...prev, categories: newCategories };
    });
  };

  const addNewCategory = () => {
    if (!skillContent) return;

    const colors = [
      "from-red-500 to-pink-600",
      "from-yellow-500 to-orange-600",
      "from-indigo-500 to-purple-600",
      "from-cyan-500 to-blue-600",
      "from-emerald-500 to-green-600",
      "from-violet-500 to-purple-600",
    ];

    const newCategory: SkillCategory = {
      title: "New Category",
      color: colors[skillContent.categories.length % colors.length],
      skills: [],
    };

    setSkillContent((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        categories: [...prev.categories, newCategory],
      };
    });
  };

  const removeCategory = (categoryIndex: number) => {
    if (
      !skillContent ||
      categoryIndex < 0 ||
      categoryIndex >= skillContent.categories.length
    )
      return;

    setSkillContent((prev) => {
      if (!prev) return prev;
      const newCategories = [...prev.categories];
      newCategories.splice(categoryIndex, 1);
      return { ...prev, categories: newCategories };
    });
  };

  const handleTechnologiesChange = (value: string) => {
    setTechnologiesInput(value);
    
    // Parse technologies and update skillContent in real-time
    const technologiesArray = value
      .split(",")
      .map((tech) => tech.trim())
      .filter((tech) => tech.length > 0);

    setSkillContent((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        technologies: technologiesArray,
      };
    });
  };

  const handleSave = () => {
    if (!skillContent) return;

    // Create save data without React components
    const dataToSave: SkillContent = {
      subtitle: skillContent.subtitle,
      categories: skillContent.categories.map((cat) => ({
        title: cat.title,
        color: cat.color,
        skills: cat.skills.map((skill) => ({
          name: skill.name,
          level: skill.level,
          icon: Code, // This will be re-processed when loaded
        })),
      })),
      technologies: skillContent.technologies,
    };

    if (onSave) onSave(dataToSave);
    setIsEditing(false);
    toast.success("Skills updated successfully!");
  };

  const handleCancel = () => {
    if (content) {
      const processedContent = {
        ...content,
        categories: (content.categories || []).map((category) => ({
          ...category,
          skills: (category.skills || []).map((skill) => ({
            ...skill,
            icon: getIconForSkill(skill.name),
            level:
              typeof skill.level === "number"
                ? Math.max(0, Math.min(100, skill.level))
                : 50,
          })),
        })),
        technologies: content.technologies || [],
      };
      setSkillContent(processedContent);
      setTechnologiesInput((content.technologies || []).join(", "));
    }
    setIsEditing(false);
  };

  if (!skillContent) {
    return (
      <section
        id="skills"
        className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300 min-h-[80vh]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              My <span className="text-orange-500">Skills</span>
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              No skills data provided
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="skills"
      className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300 min-h-[80vh]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Content Wrapper */}
        <div className="opacity-0 animate-[fadeIn_1s_ease-out_0.2s_forwards]">
          {/* Header */}
          <div className="text-center mb-16 relative transform translate-y-12 animate-[slideUp_0.8s_ease-out_0.4s_forwards]">
            <div className="absolute top-0 right-0 px-4 py-2 flex items-center gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors shadow-lg"
                    title="Save Changes"
                  >
                    <Save className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleCancel}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                    title="Cancel Editing"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors shadow-lg"
                  title="Edit Skills"
                >
                  <Edit className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </button>
              )}
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              My <span className="text-orange-500">Skills</span>
            </h2>

            {isEditing ? (
              <textarea
                value={skillContent.subtitle || ""}
                onChange={(e) =>
                  setSkillContent((prev) => {
                    if (!prev) return prev;
                    return {
                      ...prev,
                      subtitle: e.target.value,
                    };
                  })
                }
                className="w-full bg-gray-100 dark:bg-gray-800 text-center text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto rounded-xl p-3 resize-none border-2 border-dashed border-gray-400 dark:border-gray-600 focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none transition-all shadow-inner"
                rows={2}
                placeholder="Enter subtitle describing your skills"
              />
            ) : (
              <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
                {skillContent.subtitle}
              </p>
            )}
          </div>

          {/* Add Category Button */}
          {isEditing && (
            <div className="text-center mb-12 w-full flex justify-center">
              <button
                onClick={addNewCategory}
                className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-full hover:scale-105 transition-all duration-300 flex items-center gap-2"
                title="Add a new skill category"
              >
                <Plus className="w-5 h-5" />
                Add New Category
              </button>
            </div>
          )}

          {/* Skills Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {skillContent.categories.map((category, categoryIndex) => (
              <div
                key={categoryIndex}
                className="bg-gray-50 dark:bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 dark:border-gray-700 hover:border-orange-500/50 transition-all duration-300 hover:scale-[1.01] relative group shadow-2xl dark:shadow-none transform translate-y-12 animate-[slideUp_0.8s_ease-out_forwards]"
                style={{ animationDelay: `${0.8 + categoryIndex * 0.1}s` }}
              >
                {/* Category Remove Button */}
                {isEditing && skillContent.categories.length > 1 && (
                  <button
                    onClick={() => removeCategory(categoryIndex)}
                    className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 shadow-md"
                    title="Remove Category"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}

                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center flex-1">
                    <Zap className="w-8 h-8 mr-2" />
                    {isEditing ? (
                      <input
                        type="text"
                        value={category.title || ""}
                        onChange={(e) => {
                          const newCategories = [...skillContent.categories];
                          if (newCategories[categoryIndex]) {
                            newCategories[categoryIndex] = {
                              ...newCategories[categoryIndex],
                              title: e.target.value,
                            };
                            setSkillContent((prev) => {
                              if (!prev) return prev;
                              return {
                                ...prev,
                                categories: newCategories,
                              };
                            });
                          }
                        }}
                        className="bg-gray-100 dark:bg-gray-800 text-2xl font-bold text-gray-900 dark:text-white rounded-lg p-2 border-2 border-dashed border-gray-400 dark:border-gray-600 focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none flex-1"
                        placeholder="Category Title"
                      />
                    ) : (
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {category.title}
                      </h3>
                    )}
                  </div>

                  {isEditing && (
                    <button
                      onClick={() => addNewSkill(categoryIndex)}
                      className="px-4 py-3.5 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors flex items-center gap-1 shadow-md ml-4"
                      title="Add Skill"
                    >
                      <Plus className="w-6 h-6" />
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  {!category.skills || category.skills.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 italic text-center py-4">
                      No skills in this category
                    </p>
                  ) : (
                    category.skills.map((skill, skillIndex) => (
                      <div key={skillIndex} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center flex-1 min-w-0">
                            <skill.icon className="w-6 h-6 text-orange-500 mr-4 flex-shrink-0" />
                            {isEditing ? (
                              <input
                                type="text"
                                value={skill.name || ""}
                                onChange={(e) =>
                                  handleSkillUpdate(
                                    categoryIndex,
                                    skillIndex,
                                    "name",
                                    e.target.value
                                  )
                                }
                                className="flex-1 min-w-0 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium rounded-lg p-2 mr-2 border-2 border-dashed border-gray-400 dark:border-gray-600 focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none"
                                placeholder="Skill name"
                              />
                            ) : (
                              <span className="text-gray-700 dark:text-gray-200 font-medium truncate">
                                {skill.name}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            {isEditing ? (
                              <>
                                <input
                                  type="number"
                                  min={0}
                                  max={100}
                                  value={skill.level || 0}
                                  onChange={(e) =>
                                    handleSkillUpdate(
                                      categoryIndex,
                                      skillIndex,
                                      "level",
                                      parseInt(e.target.value) || 0
                                    )
                                  }
                                  className="w-16 bg-gray-100 dark:bg-gray-800 text-center text-yellow-500 font-semibold rounded-lg p-2 border-2 border-dashed border-gray-400 dark:border-gray-600 focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none"
                                />
                                <button
                                  onClick={() =>
                                    removeSkill(categoryIndex, skillIndex)
                                  }
                                  className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-sm"
                                  title="Remove Skill"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <span className="text-yellow-500 font-semibold text-lg">
                                {skill.level}%
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner">
                          <div
                            className={`h-full rounded-full bg-orange-500 transition-all duration-1000 ease-out`}
                            style={{
                              width: `${skill.level || 0}%`,
                              transitionDelay: `${0.8 + categoryIndex * 0.1}s`,
                            }}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Technologies */}
          <div className="mt-20 transform translate-y-12 animate-[slideUp_0.8s_ease-out_1.2s_forwards]">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8 border-b-2 border-orange-500/50 pb-2 max-w-lg mx-auto">
              Technologies
            </h3>

            {isEditing ? (
              <>
                <input
                  type="text"
                  value={technologiesInput}
                  onChange={(e) => handleTechnologiesChange(e.target.value)}
                  className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg p-2 border-2 focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none max-w-4xl mx-auto block"
                  placeholder="Enter technologies separated by commas (e.g., JavaScript, React, Node.js)"
                />
                <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto mt-4">
                  {skillContent.technologies && skillContent.technologies.length > 0 ? (
                    skillContent.technologies.map((tech, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        className="px-5 py-2 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-orange-500/30 rounded-full text-orange-500 font-medium"
                      >
                        {tech}
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 italic">
                      No technologies specified
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
                {skillContent.technologies && skillContent.technologies.length > 0 ? (
                  skillContent.technologies.map((tech, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      className="px-5 py-2 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-orange-500/30 rounded-full text-orange-500 font-medium"
                    >
                      {tech}
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 italic">
                    No technologies specified
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;