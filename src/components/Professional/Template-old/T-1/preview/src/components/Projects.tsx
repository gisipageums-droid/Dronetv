import React from "react";
import { motion } from "framer-motion";
import { Calendar, Tag } from "lucide-react";

const Projects: React.FC = () => {
  const projects = [
    {
      id: 1,
      title: "E-Commerce Platform",
      description:
        "A full-stack e-commerce solution with payment integration, inventory management, and admin dashboard. Built with React, Node.js, and PostgreSQL.",
      image:
        "https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800",
      tags: ["React", "Node.js", "PostgreSQL", "Stripe"],
      github: "#",
      live: "#",
      date: "2024",
      category: "Web Development",
    },
    {
      id: 2,
      title: "Task Management App",
      description:
        "A collaborative project management tool with real-time updates, team collaboration features, and advanced analytics dashboard.",
      image:
        "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800",
      tags: ["Vue.js", "Express", "Socket.io", "MongoDB"],
      github: "#",
      live: "#",
      date: "2024",
      category: "Web Application",
    },
    {
      id: 3,
      title: "AI Content Generator",
      description:
        "An AI-powered content generation platform that helps businesses create engaging content using advanced machine learning algorithms.",
      image:
        "https://images.pexels.com/photos/3861972/pexels-photo-3861972.jpeg?auto=compress&cs=tinysrgb&w=800",
      tags: ["Python", "Django", "TensorFlow", "React"],
      github: "#",
      live: "#",
      date: "2023",
      category: "AI/ML",
    },
    {
      id: 4,
      title: "Fitness Tracking Mobile App",
      description:
        "Cross-platform mobile app for fitness tracking with workout planning, progress monitoring, and social features.",
      image:
        "https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=800",
      tags: ["React Native", "Firebase", "Redux", "Charts.js"],
      github: "#",
      live: "#",
      date: "2023",
      category: "Mobile App",
    },
    {
      id: 5,
      title: "Real Estate Platform",
      description:
        "A comprehensive real estate platform with property listings, virtual tours, mortgage calculator, and agent management system.",
      image:
        "https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=800",
      tags: ["Next.js", "Prisma", "Cloudinary", "Tailwind"],
      github: "#",
      live: "#",
      date: "2023",
      category: "Web Platform",
    },
    {
      id: 6,
      title: "Learning Management System",
      description:
        "Educational platform with course management, video streaming, progress tracking, and interactive assignments.",
      image:
        "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800",
      tags: ["React", "Node.js", "AWS", "WebRTC"],
      github: "#",
      live: "#",
      date: "2022",
      category: "EdTech",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section id="projects" className="py-20 bg-white dark:bg-gray-900">
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
              Featured <span className="text-orange-500">Projects</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              A showcase of my recent work, demonstrating expertise across
              various technologies and industries.
            </p>
          </motion.div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="group bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 relative"
              >
                {/* Project Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Project Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4 mr-1" />
                      {project.date}
                    </div>
                    <div className="flex items-center text-sm text-accent-orange">
                      <Tag className="w-4 h-4 mr-1" />
                      {project.category}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-accent-orange transition-colors duration-200">
                    {project.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, index) => (
                      <span
                        key={tag + index}
                        className="px-3 py-1 bg-gradient-to-r from-accent-yellow/10 to-accent-orange/10 border border-accent-orange/30 rounded-full text-sm text-accent-orange font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
