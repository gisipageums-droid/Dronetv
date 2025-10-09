import { Cloud, Code, Database, Globe, Smartphone, Zap } from 'lucide-react';
import { motion } from 'motion/react';

// Icon mapping for skill categories
const iconMap = {
  "JavaScript": Code,
  "Python": Code,
  "React": Globe,
  "Node.js": Database,
  "Database Design": Database,
  "Problem Solving": Zap,
  "Frontend": Code,
  "Backend": Database,
  "Cloud": Cloud,
  "Mobile": Smartphone,
  "Design": Globe,
  "Performance": Zap,
  "Development": Code,
  "Database": Database,
  "DevOps": Cloud,
  "UI/UX": Globe,
  "Testing": Zap,
  "Technology": Code
};

export function Skills({ skillData }) {

  
  // If no skillData provided, return loading state
  if (!skillData) {
    return (
      <section id="skills" className="py-20 bg-yellow-50 dark:bg-yellow-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-8 bg-gray-300 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3 mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse bg-card rounded-2xl p-6 shadow-lg">
                <div className="w-16 h-16 bg-gray-300 rounded-full mb-4"></div>
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
                <div className="h-2 bg-gray-300 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Process skills data from backend API response
  const processSkillsData = () => {
    const skills = [];

    // Process categories if they exist in the API response
    if (skillData.categories && Array.isArray(skillData.categories)) {
      skillData.categories.forEach(category => {
        if (category.skills && Array.isArray(category.skills)) {
          category.skills.forEach(skill => {
            const IconComponent = iconMap[skill.name] || Code;
            skills.push({
              icon: IconComponent,
              title: skill.name,
              description: `${skill.name} expertise in ${category.title.toLowerCase()}`,
              level: skill.level,
              category: category.title
            });
          });
        }
      });
    }

    // If no categories found, try to process technologies array
    if (skills.length === 0 && skillData.technologies && Array.isArray(skillData.technologies)) {
      skillData.technologies.forEach((tech, index) => {
        const IconComponent = iconMap[tech] || Code;
        const defaultLevels = [95, 90, 85, 80, 75, 70];
        const level = defaultLevels[index % defaultLevels.length];
        
        skills.push({
          icon: IconComponent,
          title: tech,
          description: `Expertise in ${tech}`,
          level: level
        });
      });
    }

    return skills;
  };

  const skills = processSkillsData();

  return (
    <section id="skills" className="py-20 bg-yellow-50 dark:bg-yellow-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl text-foreground mb-4">
            {skillData.heading || "Technical Skills"}
          </h2>
          {skillData.description && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
              {skillData.description}
            </p>
          )}
          {skillData.subtitle && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {skillData.subtitle}
            </p>
          )}
        </motion.div>

        {skills.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skills.map((skill, index) => (
              <motion.div
                key={`${skill.title}-${index}`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mb-4"
                >
                  <skill.icon className="w-8 h-8 text-gray-900" />
                </motion.div>

                <h3 className="text-xl text-foreground mb-2">{skill.title}</h3>
                <p className="text-muted-foreground mb-4">{skill.description}</p>

                {/* Progress Bar */}
                <div className="relative">
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>Proficiency</span>
                    <span>{skill.level}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="bg-yellow-400 h-2 rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {skillData.technologies && skillData.technologies.length === 0 
                ? "Skills data is currently being updated"
                : "No skills data available"
              }
            </p>
          </div>
        )}
      </div>
    </section>
  );
}