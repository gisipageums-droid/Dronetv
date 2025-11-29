import React, { useEffect, useState } from "react";
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
} from "lucide-react";
import { motion } from "framer-motion";

// Import your static skill images
import skill1 from '../../../../Professional/Images/skill1.png';
import skill2 from '../../../../Professional/Images/skill2.png';
import skill3 from '../../../../Professional/Images/skill3.jpeg';
import skill4 from '../../../../Professional/Images/skill4.png';
import skill5 from '../../../../Professional/Images/skill5.jpeg';

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
  heading: string;
  subtitle: string;
  categories: SkillCategory[];
  technologies: string[];
}

interface SkillsProps {
  content: SkillContent;
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

const Skills: React.FC<SkillsProps> = ({ content }) => {
  const [skillContent, setSkillContent] = useState<SkillContent | null>(null);

  // Array of imported skill images
  const skillImages = [skill1, skill2, skill3, skill4, skill5];

  // Function to get image for category based on index
  const getCategoryImage = (categoryIndex: number) => {
    const imageIndex = categoryIndex % skillImages.length;
    return skillImages[imageIndex];
  };

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
    }
  }, [content]);

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
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              <span className="text-gray-900 dark:text-white">
                {skillContent.heading.split(" ")[0]}
              </span>{" "}
              <span className="text-orange-500">
                {skillContent.heading.split(" ").slice(1).join(" ")}
              </span>
            </h2>

            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto text-justify">
              {skillContent.subtitle}
            </p>
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {skillContent.categories.map((category, categoryIndex) => (
              <div
                key={categoryIndex}
                className="bg-gray-50 dark:bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 dark:border-gray-700 hover:border-orange-500/50 transition-all duration-300 hover:scale-[1.01] relative group shadow-2xl dark:shadow-none transform translate-y-12 animate-[slideUp_0.8s_ease-out_forwards]"
                style={{ animationDelay: `${0.8 + categoryIndex * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center flex-1">
                    {/* Replaced first letter icon with image */}
                    <div className="w-12 h-12 flex items-center justify-center overflow-hidden rounded-full mr-3 border-2">
                      <img
                        src={getCategoryImage(categoryIndex)}
                        alt={category.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {category.title}
                    </h3>
                  </div>
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
                            <span className="text-gray-700 dark:text-gray-200 font-medium truncate">
                              {skill.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-yellow-500 font-semibold text-lg">
                              {skill.level}%
                            </span>
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

            <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
              {skillContent.technologies &&
                skillContent.technologies.length > 0 ? (
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;