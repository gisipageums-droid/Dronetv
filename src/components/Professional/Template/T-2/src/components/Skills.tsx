import { motion } from 'motion/react';
import { Code, Database, Cloud, Smartphone, Globe, Zap } from 'lucide-react';

const skills = [
  {
    icon: Code,
    title: 'Frontend Development',
    description: 'React, Vue.js, TypeScript, Tailwind CSS',
    level: 95
  },
  {
    icon: Database,
    title: 'Backend Development',
    description: 'Node.js, Python, PostgreSQL, MongoDB',
    level: 90
  },
  {
    icon: Cloud,
    title: 'Cloud & DevOps',
    description: 'AWS, Docker, Kubernetes, CI/CD',
    level: 85
  },
  {
    icon: Smartphone,
    title: 'Mobile Development',
    description: 'React Native, Flutter, iOS/Android',
    level: 80
  },
  {
    icon: Globe,
    title: 'Web Design',
    description: 'UI/UX, Figma, Adobe XD, Responsive Design',
    level: 88
  },
  {
    icon: Zap,
    title: 'Performance',
    description: 'Optimization, SEO, Analytics, Testing',
    level: 92
  }
];

export function Skills() {
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
            My <span className="text-yellow-500">Skills</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A comprehensive set of technical skills and expertise built through 
            years of hands-on experience and continuous learning.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.title}
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
      </div>
    </section>
  );
}