import { ExternalLink, Github } from 'lucide-react';
import { motion } from 'motion/react';
import { AnimatedButton } from './AnimatedButton';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Projects({ projectData }) {
  // If no projectData provided, return loading state
  if (!projectData) {
    return (
      <section id="projects" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-8 bg-gray-300 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3 mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse bg-card rounded-2xl overflow-hidden shadow-lg border border-border">
                <div className="w-full h-48 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-5/6 mb-4"></div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <div className="w-16 h-6 bg-gray-300 rounded-full"></div>
                    <div className="w-20 h-6 bg-gray-300 rounded-full"></div>
                  </div>
                  <div className="flex space-x-3">
                    <div className="h-10 bg-gray-300 rounded flex-1"></div>
                    <div className="h-10 bg-gray-300 rounded flex-1"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Process projects data from backend
  const processProjectsData = () => {
    if (!projectData.projects || projectData.projects.length === 0) {
      return [];
    }

    return projectData.projects.map((project) => ({
      title: project.title,
      description: project.description || project.longDescription,
      image: project.image,
      technologies: project.tags || [project.category],
      liveUrl: project.live || '#',
      githubUrl: project.github || '#',
      featured: project.featured || false
    }));
  };

  const projects = processProjectsData();

  return (
    <section id="projects" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl text-foreground mb-4">
            {projectData.heading || "Featured Projects"}
            {projectData.heading && !projectData.heading.includes("Projects") && (
              <span className="text-yellow-500"> Projects</span>
            )}
          </h2>
          {projectData.description && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
              {projectData.description}
            </p>
          )}
          {projectData.subtitle && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {projectData.subtitle}
            </p>
          )}
        </motion.div>

        {projects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-border"
              >
                <div className="relative overflow-hidden">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ImageWithFallback
                      src={project.image}
                      alt={project.title}
                      className="w-full h-48 object-cover"
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

                <div className="p-6">
                  <h3 className="text-xl text-foreground mb-2">{project.title}</h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">{project.description}</p>

                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex space-x-3">
                    {project.liveUrl !== '#' && (
                      <AnimatedButton href={project.liveUrl} size="sm" className="flex-1">
                        Live Demo
                      </AnimatedButton>
                    )}
                    {project.githubUrl !== '#' && (
                      <AnimatedButton href={project.githubUrl} variant="secondary" size="sm" className="flex-1">
                        View Code
                      </AnimatedButton>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {projectData.projects && projectData.projects.length === 0 
                ? "Project portfolio is currently being updated"
                : "No projects data available"
              }
            </p>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <AnimatedButton href="#contact" size="lg">
            {projectData.projects && projectData.projects.length > 0 ? "View All Projects" : "Get In Touch"}
          </AnimatedButton>
        </motion.div>
      </div>
    </section>
  );
}