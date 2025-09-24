import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Tag,
  Edit,
  Save,
  Plus,
  Trash2,
  Image as ImageIcon,
  X,
} from "lucide-react";

const initialProjects = [
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

const Projects: React.FC = () => {
  const [projects, setProjects] = useState(initialProjects);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [currentProject, setCurrentProject] = useState<any | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (editingProjectId !== null) {
      const projectToEdit = projects.find((p) => p.id === editingProjectId);
      if (projectToEdit) {
        setCurrentProject({ ...projectToEdit });
      }
    } else {
      setCurrentProject(null);
    }
  }, [editingProjectId, projects]);

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

  const handleEditClick = (id: number) => {
    setEditingProjectId(id);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSaveClick = () => {
    if (currentProject) {
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === currentProject.id ? currentProject : project
        )
      );
    }
    setEditingProjectId(null);
    setCurrentProject(null);
  };

  const handleAddProject = () => {
    if (!currentProject || !currentProject.title) return;
    const newId =
      projects.length > 0 ? Math.max(...projects.map((p) => p.id)) + 1 : 1;
    const newProject = {
      ...currentProject,
      id: newId,
      image: imagePreview || currentProject.image,
      tags: currentProject.tags,
    };
    setProjects((prevProjects) => [...prevProjects, newProject]);
    setIsAdding(false);
    setCurrentProject({
      title: "",
      description: "",
      tags: [""],
      github: "",
      live: "",
      date: "",
      category: "",
      image: "",
    });
    setImageFile(null);
    setImagePreview(null);
  };

  const handleDeleteProject = (id: number) => {
    setProjects((prevProjects) =>
      prevProjects.filter((project) => project.id !== id)
    );
  };

  const handleProjectChange = (field: string, value: string) => {
    if (currentProject) {
      setCurrentProject({ ...currentProject, [field]: value });
    }
  };

  const handleTagChange = (value: string) => {
    if (currentProject) {
      setCurrentProject({
        ...currentProject,
        tags: value.split(",").map((tag) => tag.trim()),
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      if (currentProject) {
        setCurrentProject({ ...currentProject, image: imageUrl });
      } else {
        setCurrentProject({
          ...currentProject,
          image: imageUrl,
        });
      }
    } else {
      setImagePreview(null);
    }
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
            <div
              className={`absolute top-0 right-0 px-4 py-2 rounded-full flex items-center gap-2 font-semibold shadow-lg transition-all duration-300 hover:scale-105`}
            >
              {isEditing ? (
                <div className="absolute top-0 right-0 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className=" p-2 text-gray-900 dark:text-white bg-green-500 hover:bg-green-600 rounded-full transition-colors"
                    title="Save Changes"
                  >
                    <Save className="w-6 h-6" />
                  </button>

                  <button
                    onClick={() => setIsEditing(false)}
                    className=" p-2 text-gray-900 dark:text-white bg-green-500 hover:bg-green-600 rounded-full transition-colors"
                    title="Cancel"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="absolute top-0 right-0 p-2 text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full transition-colors"
                  title="Edit Section"
                >
                  <Edit className="w-6 h-6" />
                </button>
              )}
            </div>

            {isEditing && (
              <button
                onClick={() => {
                  setIsAdding(true);
                  setCurrentProject({
                    title: "",
                    description: "",
                    tags: [""],
                    github: "",
                    live: "",
                    date: "",
                    category: "",
                    image: "",
                  });
                }}
                className="absolute top-0 right-24 p-2 text-white bg-blue-500 hover:bg-blue-600 rounded-full transition-colors"
                title="Add New Project"
              >
                <Plus className="w-6 h-6" />
              </button>
            )}

            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Featured <span className="text-orange-500">Projects</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              A showcase of my recent work, demonstrating expertise across
              various technologies and industries.
            </p>
          </motion.div>

          {/* New Project Form */}
          {isAdding && (
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 mb-8 shadow-lg transition-all duration-300 relative"
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Add New Project
              </h3>

              <div className="flex flex-col space-y-4">
                <div className="relative">
                  <input
                    type="file"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept="image/*"
                  />
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center text-gray-500 dark:text-gray-400">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Project Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <ImageIcon className="w-12 h-12 mb-2" />
                        <span>Click to upload image</span>
                      </div>
                    )}
                  </div>
                </div>

                <input
                  type="text"
                  name="title"
                  value={currentProject?.title || ""}
                  onChange={(e) => handleProjectChange("title", e.target.value)}
                  placeholder="Project Title"
                  className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
                />
                <textarea
                  name="description"
                  value={currentProject?.description || ""}
                  onChange={(e) =>
                    handleProjectChange("description", e.target.value)
                  }
                  placeholder="Project Description"
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg resize-none"
                />
                <input
                  type="text"
                  name="tags"
                  value={currentProject?.tags.join(", ") || ""}
                  onChange={(e) => handleTagChange(e.target.value)}
                  placeholder="Tags (e.g., React, Node.js)"
                  className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="github"
                    value={currentProject?.github || ""}
                    onChange={(e) =>
                      handleProjectChange("github", e.target.value)
                    }
                    placeholder="GitHub Link"
                    className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
                  />
                  <input
                    type="text"
                    name="live"
                    value={currentProject?.live || ""}
                    onChange={(e) =>
                      handleProjectChange("live", e.target.value)
                    }
                    placeholder="Live Demo Link"
                    className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
                  />
                  <input
                    type="text"
                    name="date"
                    value={currentProject?.date || ""}
                    onChange={(e) =>
                      handleProjectChange("date", e.target.value)
                    }
                    placeholder="Date (e.g., 2024)"
                    className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
                  />
                  <input
                    type="text"
                    name="category"
                    value={currentProject?.category || ""}
                    onChange={(e) =>
                      handleProjectChange("category", e.target.value)
                    }
                    placeholder="Category (e.g., Web Dev)"
                    className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <motion.button
                    onClick={() => setIsAdding(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={handleAddProject}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold"
                  >
                    Save Project
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                whileHover={{ y: isEditing ? 0 : -10 }}
                className="group bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 relative"
              >
                {isEditing && (
                  <div className="absolute top-2 right-2 z-20 flex space-x-2">
                    {editingProjectId !== project.id ? (
                      <button
                        onClick={() => handleEditClick(project.id)}
                        className="p-1 bg-gray-700 hover:bg-gray-600 rounded-full text-white transition-colors"
                        title="Edit This Project"
                      >
                        <Edit className="w-6 h-6" />
                      </button>
                    ) : (
                      <button
                        onClick={handleSaveClick}
                        className="p-1 bg-green-500 hover:bg-green-600 rounded-full text-white transition-colors"
                        title="Save This Project"
                      >
                        <Save className="w-6 h-6" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="p-1 bg-red-500 hover:bg-red-600 rounded-full text-white transition-colors"
                      title="Delete This Project"
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                  </div>
                )}

                {/* Project Image */}
                <div className="relative overflow-hidden">
                  {editingProjectId === project.id ? (
                    <div className="relative">
                      <label
                        htmlFor="file"
                        className="absolute z-10 inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white flex-col"
                      >
                        <ImageIcon className="w-12 h-12 mb-2" />
                        <span>Click to change image</span>

                        <input
                          id="file"
                          type="file"
                          onChange={handleImageChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          accept="image/*"
                        />
                      </label>

                      <img
                        src={
                          imagePreview ||
                          currentProject?.image ||
                          project.image ||
                          imageFile
                        }
                        alt={project.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300 filter blur-sm"
                      />
                    </div>
                  ) : (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  )}
                </div>

                {/* Project Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4 mr-1" />
                      {editingProjectId === project.id ? (
                        <input
                          type="text"
                          name="date"
                          value={currentProject?.date || ""}
                          onChange={(e) =>
                            handleProjectChange("date", e.target.value)
                          }
                          className="w-16 bg-transparent text-gray-900 dark:text-white"
                        />
                      ) : (
                        project.date
                      )}
                    </div>
                    <div className="flex items-center text-sm text-accent-orange">
                      <Tag className="w-4 h-4 mr-1" />
                      {editingProjectId === project.id ? (
                        <input
                          type="text"
                          name="category"
                          value={currentProject?.category || ""}
                          onChange={(e) =>
                            handleProjectChange("category", e.target.value)
                          }
                          className="w-24 bg-transparent text-gray-900 dark:text-white"
                        />
                      ) : (
                        project.category
                      )}
                    </div>
                  </div>

                  {editingProjectId === project.id ? (
                    <input
                      type="text"
                      name="title"
                      value={currentProject?.title || ""}
                      onChange={(e) =>
                        handleProjectChange("title", e.target.value)
                      }
                      className="w-full text-xl font-bold bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white mb-3"
                    />
                  ) : (
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-accent-orange transition-colors duration-200">
                      {project.title}
                    </h3>
                  )}

                  {editingProjectId === project.id ? (
                    <textarea
                      name="description"
                      value={currentProject?.description || ""}
                      onChange={(e) =>
                        handleProjectChange("description", e.target.value)
                      }
                      className="w-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white mb-4 rounded p-2 resize-none"
                      rows={3}
                    />
                  ) : (
                    <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                      {project.description}
                    </p>
                  )}

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {editingProjectId === project.id ? (
                      <input
                        type="text"
                        name="tags"
                        value={currentProject?.tags.join(", ") || ""}
                        onChange={(e) => handleTagChange(e.target.value)}
                        className="w-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded p-2"
                        placeholder="Separate tags with commas"
                      />
                    ) : (
                      project.tags.map((tag, index) => (
                        <span
                          key={tag + index}
                          className="px-3 py-1 bg-gradient-to-r from-accent-yellow/10 to-accent-orange/10 border border-accent-orange/30 rounded-full text-sm text-accent-orange font-medium"
                        >
                          {tag}
                        </span>
                      ))
                    )}
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
