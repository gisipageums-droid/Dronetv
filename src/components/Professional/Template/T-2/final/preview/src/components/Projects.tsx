import { ExternalLink, Github } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { AnimatedButton } from './AnimatedButton';
import { ImageWithFallback } from './figma/ImageWithFallback';

// Define types for Project data
interface Project {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  tags: string[];
  github: string;
  live: string;
  date: string;
  category: string;
  featured: boolean;
  client: string;
}

interface ProjectsData {
  subtitle: string;
  heading: string;
  description: string;
  projects: Project[];
  categories: string[];
}

// Props interface
interface ProjectsProps {
  projectData?: ProjectsData;
}

export function Projects({ projectData }: ProjectsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const projectsRef = useRef<HTMLDivElement>(null);

  // Default empty data
  const defaultProjectsData: ProjectsData = {
    subtitle: "",
    heading: "",
    description: "",
    projects: [],
    categories: [""]
  };

  const [data, setData] = useState<ProjectsData>(defaultProjectsData);

  // Initialize data when projectData prop changes
  useEffect(() => {
    if (projectData) {
      setData(projectData);
      setDataLoaded(true);
    }
  }, [projectData]);

  // Process projects data for display
  const processProjectsData = () => {
    if (!data.projects || data.projects.length === 0) {
      return [];
    }

    return data.projects.map((project) => ({
      id: project.id,
      title: project.title,
      description: project.description || project.longDescription,
      image: project.image,
      technologies: project.tags || [project.category],
      liveUrl: project.live || '#',
      githubUrl: project.github || '#',
      featured: project.featured || false,
      category: project.category,
      date: project.date
    }));
  };

  const projects = processProjectsData();

  // Filter projects by category
  const filteredProjects = projects.filter(project => 
    activeCategory === "All" || project.category === activeCategory
  );

  // Safe string splitting for heading
  const renderHeading = () => {
    const heading = data?.heading || "";
    const words = heading.split(' ');

    if (words.length > 1) {
      return (
        <>
          {words[0]}{' '}
          <span className="text-yellow-500">
            {words.slice(1).join(' ')}
          </span>
        </>
      );
    }
    return heading;
  };

  // If no projectData provided, return loading state
  if (!projectData && !dataLoaded) {
    return (
      <section id="projects" className="py-20 bg-background hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-8 bg-gray-300 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3 mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse bg-card rounded-2xl overflow-hidden shadow-lg border border-border h-full">
                <div className="w-full aspect-[16/9] bg-gray-300"></div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-5/6 mb-4"></div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <div className="w-16 h-6 bg-gray-300 rounded-full"></div>
                    <div className="w-20 h-6 bg-gray-300 rounded-full"></div>
                  </div>
                  <div className="mt-auto pt-4">
                    <div className="flex space-x-3">
                      <div className="h-10 bg-gray-300 rounded flex-1"></div>
                      <div className="h-10 bg-gray-300 rounded flex-1"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={projectsRef} id="projects" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          {data.subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-lg text-yellow-500 mb-2"
            >
              {data.subtitle}
            </motion.p>
          )}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl text-foreground mb-4"
          >
            {renderHeading()}
          </motion.h2>
          {data.description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              {data.description}
            </motion.p>
          )}
        </motion.div>

        {/* Categories Filter */}
        {data.categories && data.categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {data.categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-yellow-400 text-gray-900 shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>
        )}

        {/* Projects Grid - Updated to 2 columns like the first component */}
        {filteredProjects.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-8">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-border flex flex-col h-full"
              >
                {/* Project Image - Updated to 16:9 aspect ratio */}
                <div className="relative overflow-hidden bg-gray-100 aspect-[16/9]">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    <ImageWithFallback
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 hover:opacity-100 transition-all duration-300 flex space-x-4">
                      {project.liveUrl !== '#' && (
                        <motion.a
                          href={project.liveUrl}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-yellow-400 text-gray-900 p-2 rounded-full"
                        >
                          <ExternalLink size={20} />
                        </motion.a>
                      )}
                      {project.githubUrl !== '#' && (
                        <motion.a
                          href={project.githubUrl}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-white text-gray-900 p-2 rounded-full"
                        >
                          <Github size={20} />
                        </motion.a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Project Content - Updated to match first component */}
                <div className="p-6 flex flex-col flex-1">
                  {/* Project Title */}
                  <h3 className="text-xl text-foreground mb-3">{project.title}</h3>

                  {/* Project Description */}
                  <p className="text-muted-foreground mb-4 leading-relaxed flex-1">
                    {project.description}
                  </p>

                  {/* Project Tags */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Project Meta */}
                  <div className="flex justify-between items-center mb-4 text-sm text-muted-foreground">
                    <span className="bg-gray-100 px-3 py-1 rounded-full">{project.category}</span>
                    <span>{project.date}</span>
                  </div>

                  {/* Project Links - Fixed at bottom */}
                  <div className="mt-auto pt-4">
                    <div className="flex space-x-3">
                      {project.liveUrl !== '#' && (
                        <a
                          href={project.liveUrl}
                          className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex-1 text-center"
                        >
                          Live Demo
                        </a>
                      )}
                      {project.githubUrl !== '#' && (
                        <a
                          href={project.githubUrl}
                          className="inline-flex items-center justify-center px-4 py-2 bg-transparent text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex-1 text-center"
                        >
                          <Github className="w-4 h-4 mr-2" />
                          Code
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {data.projects && data.projects.length === 0 
                ? "Project portfolio is currently being updated"
                : "No projects data available"
              }
            </p>
          </div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <AnimatedButton href="#contact" size="lg">
            {data.projects && data.projects.length > 0 ? "View All Projects" : "Get In Touch"}
          </AnimatedButton>
        </motion.div>
      </div>
    </section>
  );
}