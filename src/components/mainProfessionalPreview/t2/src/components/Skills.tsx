import { Cloud, Code, Database, Globe, Loader2, Smartphone, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import skill1 from '../../../../Professional/Images/skill1.png';
import skill2 from '../../../../Professional/Images/skill2.png';
import skill3 from '../../../../Professional/Images/skill3.jpeg';
import skill4 from '../../../../Professional/Images/skill4.png';
import skill5 from '../../../../Professional/Images/skill5.jpeg';

interface Skill {
  id: string;
  icon?: any;
  iconUrl?: string;
  title: string;
  description: string;
  level: number;
}

interface SkillsData {
  skills: Skill[];
  header: {
    title: string;
    subtitle: string;
  };
}

interface SkillsProps {
  skillsData?: SkillsData;
}

export function Skills({ skillsData }: SkillsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const skillsRef = useRef<HTMLDivElement>(null);

  // Initialize with skillsData or empty structure
  const [data, setData] = useState<SkillsData>(() =>
    skillsData || { skills: [], header: { title: 'My Skills', subtitle: 'A showcase of my technical skills and expertise.' } }
  );

  // Static images array
  const staticImages = [skill1, skill2, skill3, skill4, skill5];

  // Icon rendering logic - using static images with cycling
  const renderSkillIcon = (index: number) => {
    const imageIndex = index % staticImages.length;
    return (
      <ImageWithFallback
        src={staticImages[imageIndex]}
        alt="Skill icon"
        className="w-full h-full object-cover rounded-full"
      />
    );
  };

  // Update data when skillsData prop changes
  useEffect(() => {
    if (skillsData) {
      setData(skillsData);
      setDataLoaded(true);
    }
  }, [skillsData]);

  // Intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (skillsRef.current) observer.observe(skillsRef.current);
    return () => {
      if (skillsRef.current) observer.unobserve(skillsRef.current);
    };
  }, []);

  // Data fetch logic
  const fetchSkillsData = async () => {
    if (skillsData) {
      setData(skillsData);
      setDataLoaded(true);
    } else {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        setDataLoaded(true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (isVisible && !dataLoaded && !isLoading) {
      fetchSkillsData();
    }
  }, [isVisible, dataLoaded, isLoading, skillsData]);

  // Loading state
  if ((isLoading && !dataLoaded) || (!dataLoaded && data.skills.length === 0)) {
    return (
      <section ref={skillsRef} id="skills" className="py-20 bg-yellow-50 dark:bg-yellow-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-yellow-500" />
          <p className="text-muted-foreground mt-4">Loading skills data...</p>
        </div>
      </section>
    );
  }

  return (
    <section ref={skillsRef} id="skills" className="py-20 bg-yellow-50 dark:bg-yellow-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {data.header.title}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-center">
            {data.header.subtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.skills.map((skill, index) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{
                y: -10,
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
            >
              {/* Icon Display - Using static images with cycling */}
              <motion.div
                className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mb-4 overflow-hidden"
              >
                {renderSkillIcon(index)}
              </motion.div>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {skill.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed text-justify">
                {skill.description}
              </p>

              {/* Progress Bar */}
              <div className="relative">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span className="font-medium">Proficiency</span>
                  <span className="font-semibold">{skill.level}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="bg-yellow-400 h-3 rounded-full shadow-inner"
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