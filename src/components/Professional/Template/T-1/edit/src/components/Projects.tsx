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
import { toast } from "sonner";

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
  onSave: (updatedContent: ProjectContent) => void;
  userId?: string | undefined;
}

const Projects: React.FC<ProjectsProps> = ({ content, onSave, userId }) => {
  const [projectContent, setProjectContent] = useState<ProjectContent>(content);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [tagInput, setTagInput] = useState<string>("");

  // ✅ Only update local state when content prop changes from parent
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
  }, [content]); // Only depend on content prop

  useEffect(() => {
    if (editingProjectId !== null) {
      const projectToEdit = projectContent.projects.find(
        (p) => p.id === editingProjectId
      );
      if (projectToEdit) {
        setCurrentProject({ ...projectToEdit });
        setTagInput(projectToEdit.tags ? projectToEdit.tags.join(", ") : "");
      }
    } else {
      setCurrentProject(null);
      setTagInput("");
    }
  }, [editingProjectId, projectContent.projects]);

  useEffect(() => {
    if (isAdding && !currentProject) {
      setCurrentProject(getNewProjectTemplate());
      setTagInput("");
    }
  }, [isAdding, currentProject]);

  const handleSaveSection = () => {
    onSave(projectContent);
    setIsEditing(false);
    setEditingProjectId(null);
    toast.success("Projects section updated!");
  };

  const handleEditClick = (id: number) => {
    setEditingProjectId(id);
    setIsAdding(false);
  };

  const handleSaveProject = () => {
    if (!currentProject) return;

    const parsedTags = tagInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const updatedProject = { ...currentProject, tags: parsedTags };

    const updatedProjects = projectContent.projects.map((p) =>
      p.id === updatedProject.id ? updatedProject : p
    );
    const updatedContent = { ...projectContent, projects: updatedProjects };
    setProjectContent(updatedContent);
    onSave(updatedContent);
    setEditingProjectId(null);
    setCurrentProject(null);
    setTagInput("");
    toast.success("Project updated!");
  };

  const handleAddProject = () => {
    if (!currentProject || !currentProject.title.trim()) {
      toast.error("Project title is required");
      return;
    }

    const newId =
      projectContent.projects.length > 0
        ? Math.max(...projectContent.projects.map((p) => p.id)) + 1
        : 1;

    const tagsFromInput = tagInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const newProject: Project = {
      ...currentProject,
      id: newId,
      tags: tagsFromInput,
      featured: currentProject.featured || false,
    };

    // ✅ Create updated content with new project
    const updatedContent = {
      ...projectContent,
      projects: [...projectContent.projects, newProject],
    };

    // ✅ Update local state
    setProjectContent(updatedContent);

    // ✅ Update parent state
    onSave(updatedContent);

    setIsAdding(false);
    setCurrentProject(null);
    setTagInput("");
    toast.success("Project added!");
  };

  const handleDeleteProject = (id: number) => {
    const updatedContent = {
      ...projectContent,
      projects: projectContent.projects.filter((p) => p.id !== id),
    };
    setProjectContent(updatedContent);
    onSave(updatedContent);
    toast.success("Project removed");
  };

  const handleProjectChange = (
    field: keyof Project,
    value: string | boolean
  ) => {
    if (!currentProject) return;
    setCurrentProject({ ...currentProject, [field]: value } as Project);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!userId) {
      toast.error("User ID is required for image upload");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        setCurrentProject((prev) =>
          prev ? { ...prev, image: reader.result as string } : prev
        );
      }
    };
    reader.readAsDataURL(file);

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", userId);
      formData.append("fieldName", "ProjectImage");

      const res = await fetch(
        `https://ow3v94b9gf.execute-api.ap-south-1.amazonaws.com/dev/`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Upload failed: ${res.status} - ${errorText}`);
      }

      const data = await res.json();

      setCurrentProject((prev) =>
        prev ? { ...prev, image: data.s3Url } : prev
      );

      toast.success("Image uploaded successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(
        err instanceof Error
          ? err.message
          : "Image upload failed. Please try again."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingProjectId(null);
    setCurrentProject(null);
    setTagInput("");
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setCurrentProject(null);
    setTagInput("");
  };

  const startAddingProject = () => {
    setIsAdding(true);
    setEditingProjectId(null);
    setCurrentProject(getNewProjectTemplate());
    setTagInput("");
  };

  const getNewProjectTemplate = (): Project => ({
    id: 0,
    title: "",
    description: "",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop",
    tags: [],
    github: "",
    live: "",
    date: new Date().getFullYear().toString(),
    category: "",
    featured: false,
  });

  const handleContentTextChange = (
    field: keyof ProjectContent,
    value: string
  ) => {
    setProjectContent((prev) => ({ ...prev, [field]: value }));
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

  console.log("Projects render - projects:", projectContent.projects);

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
            <div className="flex absolute top-0 right-0 gap-2 items-center">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSaveSection}
                    className="p-2 text-white bg-green-500 rounded-full transition-colors hover:bg-green-600"
                    title="Save Changes"
                  >
                    <Save className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="p-2 text-white bg-red-500 rounded-full transition-colors hover:bg-red-600"
                    title="Cancel"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-gray-900 bg-gray-200 rounded-full transition-colors dark:text-white dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                  title="Edit Section"
                >
                  <Edit className="w-6 h-6" />
                </button>
              )}
            </div>

            {isEditing && (
              <button
                onClick={startAddingProject}
                className="absolute top-0 right-24 p-2 text-white bg-blue-500 rounded-full transition-colors hover:bg-blue-600"
                title="Add New Project"
              >
                <Plus className="w-6 h-6" />
              </button>
            )}

            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={projectContent.heading}
                  onChange={(e) =>
                    handleContentTextChange("heading", e.target.value)
                  }
                  className="p-2 mx-auto w-full max-w-2xl text-4xl font-bold text-gray-900 bg-gray-100 rounded-lg border-2 lg:text-5xl dark:bg-gray-800 dark:text-white focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none"
                  placeholder="Section heading"
                />
                <textarea
                  value={projectContent.description}
                  onChange={(e) =>
                    handleContentTextChange("description", e.target.value)
                  }
                  className="p-2 mx-auto w-full max-w-3xl text-xl text-gray-600 bg-gray-100 rounded-lg border-2 resize-none dark:bg-gray-800 dark:text-gray-400 focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none"
                  rows={2}
                  placeholder="Section description"
                />
              </div>
            ) : (
              <>
                <h2 className="mb-4 text-4xl font-bold text-gray-900 lg:text-5xl dark:text-white">
                  {projectContent.heading.split(" ")[0]}{" "}
                  <span className="text-orange-500">
                    {projectContent.heading.split(" ").slice(1).join(" ")}
                  </span>
                </h2>
                <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-400">
                  {projectContent.description}
                </p>
              </>
            )}
          </motion.div>

          {/* Add New Project Form */}
          {isAdding && (
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="relative p-6 mb-8 bg-gray-50 rounded-2xl shadow-lg transition-all duration-300 dark:bg-gray-800"
            >
              <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                Add New Project
              </h3>

              <div className="flex flex-col space-y-4">
                <div className="relative">
                  <input
                    type="file"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept="image/*"
                    disabled={isUploading}
                  />
                  <div className="p-6 text-center text-gray-500 rounded-lg border-2 border-gray-300 border-dashed dark:border-gray-600 dark:text-gray-400">
                    {currentProject?.image ? (
                      <img
                        src={currentProject.image}
                        alt="Project Preview"
                        className="object-cover w-full h-48 rounded-lg"
                      />
                    ) : (
                      <div className="flex flex-col justify-center items-center">
                        <ImageIcon className="mb-2 w-12 h-12" />
                        <span>
                          {isUploading ? "Uploading..." : "Click to upload"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <input
                  type="text"
                  value={currentProject?.title || ""}
                  onChange={(e) => handleProjectChange("title", e.target.value)}
                  placeholder="Project Title"
                  className="px-4 py-2 w-full text-gray-900 bg-white rounded-lg border border-gray-300 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none"
                />
                <textarea
                  value={currentProject?.description || ""}
                  onChange={(e) =>
                    handleProjectChange("description", e.target.value)
                  }
                  placeholder="Project Description"
                  rows={3}
                  className="px-4 py-2 w-full text-gray-900 bg-white rounded-lg border border-gray-300 resize-none dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none"
                />

                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Tags (comma separated, e.g., React, Node.js)"
                  className="px-4 py-2 w-full text-gray-900 bg-white rounded-lg border border-gray-300 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none"
                />

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="url"
                    value={currentProject?.github || ""}
                    onChange={(e) =>
                      handleProjectChange("github", e.target.value)
                    }
                    placeholder="GitHub Link"
                    className="px-4 py-2 w-full text-gray-900 bg-white rounded-lg border border-gray-300 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none"
                  />
                  <input
                    type="url"
                    value={currentProject?.live || ""}
                    onChange={(e) =>
                      handleProjectChange("live", e.target.value)
                    }
                    placeholder="Live Demo Link"
                    className="px-4 py-2 w-full text-gray-900 bg-white rounded-lg border border-gray-300 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={currentProject?.date || ""}
                    onChange={(e) =>
                      handleProjectChange("date", e.target.value)
                    }
                    placeholder="Date (e.g., 2024)"
                    className="px-4 py-2 w-full text-gray-900 bg-white rounded-lg border border-gray-300 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={currentProject?.category || ""}
                    onChange={(e) =>
                      handleProjectChange("category", e.target.value)
                    }
                    placeholder="Category (e.g., Web Development)"
                    className="px-4 py-2 w-full text-gray-900 bg-white rounded-lg border border-gray-300 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <motion.button
                    onClick={handleCancelAdd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 font-semibold text-gray-900 bg-gray-200 rounded-lg dark:bg-gray-700 dark:text-white"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={handleAddProject}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 font-semibold text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-lg"
                    disabled={!currentProject?.title?.trim() || isUploading}
                  >
                    {isUploading ? "Uploading..." : "Save Project"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Projects Grid */}
          {projectContent.projects.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-lg text-gray-500 dark:text-gray-400">
                No projects to display yet.
              </p>
              {isEditing && (
                <button
                  onClick={startAddingProject}
                  className="px-6 py-2 mt-4 text-white bg-blue-500 rounded-lg transition-colors hover:bg-blue-600"
                >
                  Add Your First Project
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {projectContent.projects.map((project) => (
                <motion.div
                  key={project.id}
                  // variants={itemVariants}
                  whileHover={{ y: isEditing ? 0 : -10 }}
                  className="overflow-hidden relative bg-gray-50 rounded-2xl shadow-lg transition-all duration-300 group dark:bg-gray-800 hover:shadow-2xl"
                >
                  {/* Card edit actions */}
                  {isEditing && (
                    <div className="flex absolute top-2 right-2 z-20 space-x-2">
                      {editingProjectId !== project.id ? (
                        <button
                          onClick={() => handleEditClick(project.id)}
                          className="p-1 text-white bg-gray-700 rounded-full transition-colors hover:bg-gray-600"
                          title="Edit This Project"
                        >
                          <Edit className="w-6 h-6" />
                        </button>
                      ) : (
                        <button
                          onClick={handleSaveProject}
                          className="p-1 text-white bg-green-500 rounded-full transition-colors hover:bg-green-600"
                          title="Save This Project"
                          disabled={isUploading}
                        >
                          <Save className="w-6 h-6" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="p-1 text-white bg-red-500 rounded-full transition-colors hover:bg-red-600"
                        title="Delete This Project"
                      >
                        <Trash2 className="w-6 h-6" />
                      </button>
                    </div>
                  )}

                  {/* Image */}
                  <div className="overflow-hidden relative">
                    {editingProjectId === project.id ? (
                      <div className="relative">
                        <label className="flex absolute inset-0 z-10 flex-col justify-center items-center text-white cursor-pointer bg-black/50">
                          <ImageIcon className="mb-2 w-12 h-12" />
                          <span>
                            {isUploading ? "Uploading..." : "Change image"}
                          </span>
                          <input
                            type="file"
                            onChange={handleImageUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            accept="image/*"
                            disabled={isUploading}
                          />
                        </label>
                        <img
                          src={currentProject?.image || project.image}
                          alt={project.title}
                          className="object-cover w-full h-48 filter blur-sm transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                    ) : (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="object-cover w-full h-48 transition-transform duration-300 group-hover:scale-110"
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="mr-1 w-4 h-4" />
                        {editingProjectId === project.id ? (
                          <input
                            type="text"
                            value={currentProject?.date || ""}
                            onChange={(e) =>
                              handleProjectChange("date", e.target.value)
                            }
                            className="w-16 text-gray-900 bg-transparent border-b border-gray-300 dark:text-white dark:border-gray-600 focus:outline-none"
                          />
                        ) : (
                          project.date
                        )}
                      </div>
                      <div className="flex items-center text-sm text-orange-500">
                        <Tag className="mr-1 w-4 h-4" />
                        {editingProjectId === project.id ? (
                          <input
                            type="text"
                            value={currentProject?.category || ""}
                            onChange={(e) =>
                              handleProjectChange("category", e.target.value)
                            }
                            className="w-24 text-gray-900 bg-transparent border-b border-gray-300 dark:text-white dark:border-gray-600 focus:outline-none"
                          />
                        ) : (
                          project.category
                        )}
                      </div>
                    </div>

                    {editingProjectId === project.id ? (
                      <input
                        type="text"
                        value={currentProject?.title || ""}
                        onChange={(e) =>
                          handleProjectChange("title", e.target.value)
                        }
                        className="mb-3 w-full text-xl font-bold text-gray-900 bg-transparent border-b border-gray-300 dark:text-white dark:border-gray-600 focus:outline-none"
                      />
                    ) : (
                      <h3 className="mb-3 text-xl font-bold text-gray-900 transition-colors duration-200 dark:text-white group-hover:text-orange-500">
                        {project.title}
                      </h3>
                    )}

                    {editingProjectId === project.id ? (
                      <textarea
                        value={currentProject?.description || ""}
                        onChange={(e) =>
                          handleProjectChange("description", e.target.value)
                        }
                        className="p-2 mb-4 w-full text-gray-900 bg-transparent rounded border border-gray-300 resize-none dark:text-white dark:border-gray-600 focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none"
                        rows={3}
                      />
                    ) : (
                      <p className="mb-4 leading-relaxed text-gray-600 dark:text-gray-300">
                        {project.description}
                      </p>
                    )}

                    {/* Tech Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {editingProjectId === project.id ? (
                        <input
                          type="text"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          className="p-2 w-full text-gray-900 bg-transparent rounded border border-gray-300 dark:text-white dark:border-gray-600 focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none"
                          placeholder="Separate tags with commas"
                        />
                      ) : (
                        project.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 text-sm font-medium text-orange-500 bg-gradient-to-r rounded-full border from-yellow-500/10 to-orange-500/10 border-orange-500/30"
                          >
                            {tag}
                          </span>
                        ))
                      )}
                    </div>

                    {/* Links */}
                    <div className="flex space-x-4">
                      {editingProjectId === project.id ? (
                        <>
                          <input
                            type="url"
                            value={currentProject?.github || ""}
                            onChange={(e) =>
                              handleProjectChange("github", e.target.value)
                            }
                            placeholder="GitHub URL"
                            className="flex-1 text-gray-900 bg-transparent border-b border-gray-300 dark:text-white dark:border-gray-600 focus:outline-none"
                          />
                          <input
                            type="url"
                            value={currentProject?.live || ""}
                            onChange={(e) =>
                              handleProjectChange("live", e.target.value)
                            }
                            placeholder="Live Demo URL"
                            className="flex-1 text-gray-900 bg-transparent border-b border-gray-300 dark:text-white dark:border-gray-600 focus:outline-none"
                          />
                        </>
                      ) : (
                        <>
                          <a
                            href={project.github}
                            target={
                              project.github?.startsWith("/")
                                ? "_self"
                                : "_blank"
                            }
                            rel="noopener noreferrer"
                            className="text-gray-600 transition-colors dark:text-gray-400 hover:text-orange-500"
                          >
                            GitHub
                          </a>
                          <a
                            href={project.live}
                            target={
                              project.live?.startsWith("/") ? "_self" : "_blank"
                            }
                            rel="noopener noreferrer"
                            className="text-gray-600 transition-colors dark:text-gray-400 hover:text-orange-500"
                          >
                            Live Demo
                          </a>
                        </>
                      )}
                    </div>
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
