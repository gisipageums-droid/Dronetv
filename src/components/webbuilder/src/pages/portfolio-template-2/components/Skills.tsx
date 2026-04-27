import React from "react";
import {
  Briefcase,
  TrendingUp,
  ClipboardList,
  Target,
  FlaskConical,
  GraduationCap,
  // BookOpen,
  // Users,
  Cpu,
} from "lucide-react";

interface Skill {
  name: string;
  category: string;
  proficiency: number;
}

interface Certification {
  title: string;
  description: string;
}

interface SkillsProps {
  skills?: Skill[];
  certifications?: Certification[];
  primaryColor?: string;
  accentColor?: string;
}

const Skills: React.FC<SkillsProps> = ({
  skills = [],
  certifications = [],
  primaryColor = "#FFD400",
  accentColor = "#FF0000",
}) => {
  // Default skills if none passed
  const defaultSkills: Skill[] = [
    { name: "Business Strategy", category: "Business", proficiency: 95 },
    { name: "Business Development", category: "Business", proficiency: 93 },
    { name: "Business Planning", category: "Business", proficiency: 90 },
    { name: "Strategic Planning", category: "Business", proficiency: 92 },
    { name: "R&D Innovation", category: "Technical", proficiency: 88 },
  ];

  const skillData = skills.length > 0 ? skills : defaultSkills;

  // Icons mapping
  const iconMap: Record<string, JSX.Element> = {
    "Business Strategy": <Briefcase size={24} />,
    "Business Development": <TrendingUp size={24} />,
    "Business Planning": <ClipboardList size={24} />,
    "Strategic Planning": <Target size={24} />,
    "R&D Innovation": <FlaskConical size={24} />,
  };

  // Default certifications
  const defaultCerts = [
    {
      title: "DGCA Certified",
      description: "RPAS Instructor for drone training programs",
    },
    {
      title: "Published Author",
      description: "Multiple research papers on drone technology",
    },
    {
      title: "Conference Speaker",
      description: "Regular speaker at international drone conferences",
    },
  ];

  const certData = certifications.length > 0 ? certifications : defaultCerts;

  return (
    <section id="skills" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2
            data-aos="fade-up"
            className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-4"
          >
            Top <span style={{ color: accentColor }}>Skills</span>
          </h2>
          <div
            data-aos="fade-up"
            data-aos-delay="200"
            className="w-24 h-1 mx-auto mb-6"
            style={{ backgroundColor: primaryColor }}
          ></div>
          <p
            data-aos="fade-up"
            data-aos-delay="400"
            className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            A proven skill set focused on building, growing, and sustaining
            strategic business ventures across emerging and established markets.
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto relative">
          {/* Vertical Line */}
          <div
            className="absolute left-1/2 transform -translate-x-0.5 w-1 h-full hidden lg:block"
            style={{ backgroundColor: primaryColor }}
          ></div>

          <div className="space-y-12">
            {skillData.map((skill, index) => (
              <div
                key={index}
                data-aos="fade-up"
                data-aos-delay={index * 200}
                className={`flex items-center gap-8 ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
              >
                {/* Skill Card */}
                <div
                  className={`flex-1 ${
                    index % 2 === 0 ? "lg:text-right" : "lg:text-left"
                  }`}
                >
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <div
                      className={`flex items-center gap-4 mb-4 ${
                        index % 2 === 0
                          ? "lg:justify-end"
                          : "lg:justify-start"
                      } justify-start`}
                    >
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: accentColor }}
                      >
                        {iconMap[skill.name] || <Cpu size={24} />}
                      </div>
                      <h3 className="text-xl font-bold text-black dark:text-white">
                        {skill.name}
                      </h3>
                    </div>

                    {/* Description placeholder (could come from API in future) */}
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      {`Proven expertise in ${skill.name.toLowerCase()}.`}
                    </p>

                    {/* Progress */}
                    <div className="space-y-2">
                      <div
                        className={`flex justify-between items-center ${
                          index % 2 === 0
                            ? "lg:flex-row-reverse"
                            : "lg:flex-row"
                        } flex-row`}
                      >
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Proficiency
                        </span>
                        <span
                          className="text-sm font-bold"
                          style={{ color: accentColor }}
                        >
                          {skill.proficiency}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div
                          className="h-3 rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: `${skill.proficiency}%`,
                            background: `linear-gradient(to right, ${primaryColor}, ${accentColor})`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline Node */}
                <div
                  className="hidden lg:flex w-6 h-6 rounded-full border-4 shadow-lg z-10 flex-shrink-0"
                  style={{
                    backgroundColor: accentColor,
                    borderColor: "#fff",
                  }}
                ></div>

                {/* Spacer */}
                <div className="flex-1 hidden lg:block"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="mt-20 bg-black rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-white text-center mb-8">
            Certifications &{" "}
            <span style={{ color: primaryColor }}>Achievements</span>
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {certData.map((cert, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-300"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0"
                  style={{ backgroundColor: accentColor }}
                >
                  <GraduationCap size={20} />
                </div>
                <div>
                  <h4 className="text-white font-semibold">{cert.title}</h4>
                  <p className="text-gray-400 text-sm">{cert.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
