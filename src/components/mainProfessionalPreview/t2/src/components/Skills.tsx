import { Cloud, Code, Database, Globe, Loader2, Smartphone, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

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

  // Helper function to get icon component from string name
  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      Code, Database, Cloud, Smartphone, Globe, Zap, Cpu: Zap
    };
    return iconMap[iconName] || Zap;
  };

  // Icon rendering logic
  const renderSkillIcon = (skill: Skill) => {
    // Priority 1: iconUrl (uploaded image)
    if (skill.iconUrl) {
      return (
        <ImageWithFallback
          src={skill.iconUrl}
          alt={skill.title}
          className="w-8 h-8 object-contain"
        />
      );
    }
    
    // Priority 2: icon (can be either component or string)
    if (skill.icon) {
      // If icon is a string (from backend), get the component
      if (typeof skill.icon === 'string') {
        const IconComponent = getIconComponent(skill.icon);
        return <IconComponent className="w-8 h-8 text-gray-900" />;
      }
      // If icon is already a component (default case)
      const IconComponent = skill.icon;
      return <IconComponent className="w-8 h-8 text-gray-900" />;
    }
    
    // Priority 3: fallback icon
    return <Zap className="w-8 h-8 text-gray-900" />;
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
          <h2 className="text-3xl sm:text-4xl text-foreground mb-4">
            {data.header.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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
              whileHover={{ y: -10 }}
              className="bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {/* Icon Display */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mb-4"
              >
                {renderSkillIcon(skill)}
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