import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Tag } from "lucide-react";

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  github: string;
  live: string;
  date: string;
  category: string;
  featured?: boolean;
}

export interface ProjectContent {
  subtitle: string;
  heading: string;
  description: string;
  projects: Project[];
  categories?: string[];
}

interface ProjectsProps {
  content: ProjectContent;
}

const Projects: React.FC<ProjectsProps> = ({ content }) => {
  const [projectContent, setProjectContent] = useState<ProjectContent>(content);

  // Process projects data when content changes
  useEffect(() => {
    const processedProjects = (content.projects || []).map((project) => ({
      ...project,
      id:
        typeof project.id === "number"
          ? project.id
          : Math.floor(Number(project.id)) || Date.now(),
      tags: Array.isArray(project.tags) ? project.tags : [],
      featured: Boolean(project.featured),
    }));

    setProjectContent({
      ...content,
      projects: processedProjects,
    });
  }, [content]);

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

  return (
    <section id="projects" className="py-20 bg-white dark:bg-gray-900">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="relative mb-16 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold text-gray-900 lg:text-5xl dark:text-white">
              {projectContent.heading.split(" ")[0]}{" "}
              <span className="text-orange-500">
                {projectContent.heading.split(" ").slice(1).join(" ")}
              </span>
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-400">
              {projectContent.description}
            </p>
          </motion.div>

          {/* Projects Grid */}
          {projectContent.projects.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-lg text-gray-500 dark:text-gray-400">
                No projects to display yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {projectContent.projects.map((project) => (
                <motion.div
                  key={project.id}
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                  className="overflow-hidden relative bg-gray-50 rounded-2xl shadow-lg transition-all duration-300 group dark:bg-gray-800 hover:shadow-2xl"
                >
                  {/* Image */}
                  <div className="overflow-hidden relative">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="object-cover w-full h-48 transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="mr-1 w-4 h-4" />
                        {project.date}
                      </div>
                      <div className="flex items-center text-sm text-orange-500">
                        <Tag className="mr-1 w-4 h-4" />
                        {project.category}
                      </div>
                    </div>

                    <h3 className="mb-3 text-xl font-bold text-gray-900 transition-colors duration-200 dark:text-white group-hover:text-orange-500">
                      {project.title}
                    </h3>

                    <p className="mb-4 leading-relaxed text-gray-600 dark:text-gray-300">
                      {project.description}
                    </p>

                    {/* Tech Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-sm font-medium text-orange-500 bg-gradient-to-r rounded-full border from-yellow-500/10 to-orange-500/10 border-orange-500/30"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Links */}
                    {/* <div className="flex space-x-4">
                      <a
                        href={project.github}
                        target={
                          project.github?.startsWith("/") ? "_self" : "_blank"
                        }
                        rel="noopener noreferrer"
                        className="text-gray-600 transition-colors dark:text-gray-400 hover:text-orange-500"
                      >
                        GitHub
                      </a>
                      <a
                        href={project.live}
                        target={project.live?.startsWith("/") ? "_self" : "_blank"}
                        rel="noopener noreferrer"
                        className="text-gray-600 transition-colors dark:text-gray-400 hover:text-orange-500"
                      >
                        Live Demo
                      </a>
                    </div> */}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
