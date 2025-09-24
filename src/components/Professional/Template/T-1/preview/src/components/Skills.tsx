import React from "react";
import { motion } from "framer-motion";
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

const Skills: React.FC = () => {
  const skillContent = {
    subtitle:
      "A comprehensive toolkit built through years of experience and continuous learning.",
    categories: [
      {
        title: "Frontend Development",
        color: "from-accent-yellow to-accent-orange",
        skills: [
          { name: "React/Next.js", level: 95, icon: Code },
          { name: "TypeScript", level: 90, icon: Code },
          { name: "Tailwind CSS", level: 88, icon: Palette },
          { name: "Vue.js", level: 82, icon: Code },
        ],
      },
      {
        title: "Backend Development",
        color: "from-accent-orange to-accent-red",
        skills: [
          { name: "Node.js", level: 92, icon: Server },
          { name: "Python/Django", level: 88, icon: Server },
          { name: "GraphQL/REST", level: 85, icon: Database },
          { name: "PostgreSQL", level: 87, icon: Database },
        ],
      },
      {
        title: "Cloud & DevOps",
        color: "from-accent-red to-accent-yellow",
        skills: [
          { name: "AWS/Azure", level: 85, icon: Cloud },
          { name: "Docker/K8s", level: 80, icon: Settings },
          { name: "CI/CD", level: 83, icon: GitBranch },
          { name: "Monitoring", level: 78, icon: BarChart },
        ],
      },
      {
        title: "Mobile & Others",
        color: "from-accent-yellow via-accent-orange to-accent-red",
        skills: [
          { name: "React Native", level: 82, icon: Smartphone },
          { name: "Flutter", level: 75, icon: Smartphone },
          { name: "Security", level: 80, icon: Shield },
          { name: "Performance", level: 88, icon: Zap },
        ],
      },
    ],
    technologies: [
      "JavaScript",
      "TypeScript",
      "React",
      "Vue.js",
      "Node.js",
      "Python",
      "PostgreSQL",
      "MongoDB",
      "AWS",
      "Docker",
      "Kubernetes",
      "GraphQL",
      "Next.js",
      "Django",
      "Flutter",
      "React Native",
      "Tailwind CSS",
      "Firebase",
    ],
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  const progressVariants = {
    hidden: { width: 0 },
    visible: (level: number) => ({
      width: `${level}%`,
      transition: { duration: 1, delay: 0.5 },
    }),
  };

  return (
    <section
      id="skills"
      className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Section Header */}
          <motion.div
            variants={itemVariants}
            className="text-center mb-16 relative"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              My <span className="text-orange-500">Skills</span>
            </h2>

            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              {skillContent.subtitle}
            </p>
          </motion.div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {skillContent.categories.map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-gray-50 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:border-accent-orange/50 transition-all duration-300"
              >
                <div className="flex items-center mb-6">
                  <div
                    className={`w-4 h-4 rounded-full bg-gradient-to-r ${category.color} mr-3`}
                  />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {category.title}
                  </h3>
                </div>

                <div className="space-y-6">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skillIndex} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <skill.icon className="w-5 h-5 text-accent-orange mr-3" />
                          <span className="text-gray-700 dark:text-gray-200 font-medium">
                            {skill.name}
                          </span>
                        </div>

                        <span className="text-accent-yellow font-semibold">
                          {skill.level}%
                        </span>
                      </div>

                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <motion.div
                          variants={progressVariants}
                          initial="hidden"
                          whileInView="visible"
                          custom={skill.level}
                          viewport={{ once: true }}
                          className={`h-2 rounded-full bg-gradient-to-r ${category.color}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Technologies Showcase */}
          <motion.div variants={itemVariants} className="mt-16">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
              Technologies I Work With
            </h3>

            <div className="flex flex-wrap justify-center gap-4">
              {skillContent.technologies.map((tech, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gray-100 dark:bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-gray-600 rounded-full text-gray-700 dark:text-gray-200 hover:border-accent-orange hover:text-accent-orange transition-all duration-200 cursor-pointer"
                >
                  {tech}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
