import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Tag,
  Edit,
  Save,
  Plus,
  Trash2,
  X,
  Crop,
  Check,
  ZoomIn,
  ZoomOut,
  Upload,
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

  // Character limits
  const CHAR_LIMITS = {
    heading: 100,
    description: 500,
    projectTitle: 100,
    projectDescription: 1000,
    tags: 300,
    github: 500,
    live: 500,
    date: 20,
    category: 50,
  };

  // Cropping states
  const [isCropping, setIsCropping] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string>("");
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const getCharCountColor = (current: number, max: number) => {
    if (current >= max) return "text-red-500";
    if (current >= max * 0.9) return "text-yellow-500";
    return "text-gray-500";
  };

  // Image cropping functions
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const getCroppedImage = async (): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const canvas = canvasRef.current;
      const image = imageRef.current;
      const container = containerRef.current;

      if (!canvas || !image || !container) {
        reject(new Error("Canvas, image, or container not found"));
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      // Output size - rectangular for Project images (800x600)
      const outputWidth = 800;
      const outputHeight = 600;
      canvas.width = outputWidth;
      canvas.height = outputHeight;

      // Get container dimensions
      const containerRect = container.getBoundingClientRect();

      // Crop area dimensions - rectangular for Project section
      const cropWidth = 400;
      const cropHeight = 300;

      // Calculate the center of the crop area in the container
      const centerX = containerRect.width / 2;
      const centerY = containerRect.height / 2;

      // Get image dimensions and position
      const imgRect = image.getBoundingClientRect();
      const containerLeft = containerRect.left;
      const containerTop = containerRect.top;

      // Calculate image position relative to container
      const imgX = imgRect.left - containerLeft;
      const imgY = imgRect.top - containerTop;

      // Calculate the crop area in the original image coordinates
      const scaleX = image.naturalWidth / imgRect.width;
      const scaleY = image.naturalHeight / imgRect.height;

      // Calculate source coordinates (what part of the original image to crop)
      const sourceX = (centerX - imgX - cropWidth / 2) * scaleX;
      const sourceY = (centerY - imgY - cropHeight / 2) * scaleY;
      const sourceWidth = cropWidth * scaleX;
      const sourceHeight = cropHeight * scaleY;

      // Draw the cropped rectangular image
      ctx.drawImage(
        image,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        outputWidth,
        outputHeight
      );

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to create blob"));
          }
        },
        "image/jpeg",
        0.95
      );
    });
  };

  const handleCropConfirm = async () => {
    try {
      const croppedBlob = await getCroppedImage();
      const croppedFile = new File([croppedBlob], "cropped-project-image.jpg", {
        type: "image/jpeg",
      });

      // Convert to base64 for immediate preview
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setCurrentProject((prev) =>
            prev ? { ...prev, image: reader.result as string } : prev
          );
        }
      };
      reader.readAsDataURL(croppedFile);

      setIsUploading(true);
      setIsCropping(false);
      setImageLoaded(false);

      // Upload cropped image
      const formData = new FormData();
      formData.append("file", croppedFile);
      formData.append("userId", userId!);
      formData.append("fieldName", "projectImage");

      const uploadResponse = await fetch(
        `https://ow3v94b9gf.execute-api.ap-south-1.amazonaws.com/dev/`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (uploadResponse.ok) {
        const uploadData = await uploadResponse.json();
        setCurrentProject((prev) =>
          prev ? { ...prev, image: uploadData.s3Url } : prev
        );
        toast.success("Image uploaded successfully!");
      } else {
        const errorData = await uploadResponse.json();
        toast.error(
          `Image upload failed: ${errorData.message || "Unknown error"}`
        );
      }

      setIsUploading(false);
    } catch (error) {
      console.error("Error cropping image:", error);
      toast.error("Failed to crop image");
      setIsCropping(false);
      setIsUploading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setImageToCrop(reader.result as string);
          setIsCropping(true);
          setScale(1);
          setPosition({ x: 0, y: 0 });
          setImageLoaded(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 1));
  };

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

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingProjectId(null);
    setCurrentProject(null);
    toast.success("Cancel update");
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
                    className="p-3 text-white bg-green-500 rounded-full transition-colors hover:bg-green-600"
                    title="Save Changes"
                  >
                    <Save className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="p-3 text-white bg-red-500 rounded-full transition-colors hover:bg-red-600"
                    title="Cancel"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-3 text-gray-900 bg-gray-200 rounded-full transition-colors dark:text-white dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                  title="Edit Section"
                >
                  <Edit className="w-6 h-6" />
                </button>
              )}
            </div>

            {isEditing && (
              <button
                onClick={startAddingProject}
                className="absolute top-0 right-28 p-3 text-white bg-blue-500 rounded-full transition-colors hover:bg-blue-600"
                title="Add New Project"
              >
                <Plus className="w-6 h-6" />
              </button>
            )}

            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-1">
                  <input
                    type="text"
                    value={projectContent.heading}
                    onChange={(e) =>
                      handleContentTextChange("heading", e.target.value)
                    }
                    maxLength={CHAR_LIMITS.heading}
                    className="p-2 mx-auto w-full max-w-2xl text-4xl font-bold text-gray-900 bg-gray-100 rounded-lg border-2 lg:text-5xl dark:bg-gray-800 dark:text-white focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none"
                    placeholder="Section heading"
                  />
                  <div
                    className={`text-sm text-right max-w-2xl mx-auto ${getCharCountColor(
                      projectContent.heading.length,
                      CHAR_LIMITS.heading
                    )}`}
                  >
                    {projectContent.heading.length}/{CHAR_LIMITS.heading}
                  </div>
                </div>
                <div className="space-y-1">
                  <textarea
                    value={projectContent.description}
                    onChange={(e) =>
                      handleContentTextChange("description", e.target.value)
                    }
                    maxLength={CHAR_LIMITS.description}
                    className="p-2 mx-auto w-full max-w-3xl text-xl text-gray-600 bg-gray-100 rounded-lg border-2 resize-none dark:bg-gray-800 dark:text-gray-400 focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none"
                    rows={2}
                    placeholder="Section description"
                  />
                  <div
                    className={`text-sm text-right max-w-3xl mx-auto ${getCharCountColor(
                      projectContent.description.length,
                      CHAR_LIMITS.description
                    )}`}
                  >
                    {projectContent.description.length}/
                    {CHAR_LIMITS.description}
                  </div>
                </div>
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
                  <label className="flex flex-col justify-center items-center p-6 text-center text-gray-500 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:border-gray-600 dark:text-gray-400">
                    <Upload className="mb-2 w-12 h-12" />
                    <span>Click to upload project image</span>
                    <input
                      type="file"
                      onChange={handleImageUpload}
                      className="hidden"
                      accept="image/*"
                    />
                  </label>
                  {currentProject?.image && (
                    <div className="mt-4">
                      <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                        Image Preview:
                      </p>
                      <img
                        src={currentProject.image}
                        alt="Project Preview"
                        className="object-cover w-full h-48 rounded-lg"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <input
                    type="text"
                    value={currentProject?.title || ""}
                    onChange={(e) =>
                      handleProjectChange("title", e.target.value)
                    }
                    maxLength={CHAR_LIMITS.projectTitle}
                    placeholder="Project Title"
                    className="px-4 py-2 w-full text-gray-900 bg-white rounded-lg border border-gray-300 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none"
                  />
                  <div
                    className={`text-sm text-right ${getCharCountColor(
                      currentProject?.title?.length || 0,
                      CHAR_LIMITS.projectTitle
                    )}`}
                  >
                    {currentProject?.title?.length || 0}/
                    {CHAR_LIMITS.projectTitle}
                  </div>
                </div>

                <div className="space-y-1">
                  <textarea
                    value={currentProject?.description || ""}
                    onChange={(e) =>
                      handleProjectChange("description", e.target.value)
                    }
                    maxLength={CHAR_LIMITS.projectDescription}
                    placeholder="Project Description"
                    rows={3}
                    className="px-4 py-2 w-full text-gray-900 bg-white rounded-lg border border-gray-300 resize-none dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none"
                  />
                  <div
                    className={`text-sm text-right ${getCharCountColor(
                      currentProject?.description?.length || 0,
                      CHAR_LIMITS.projectDescription
                    )}`}
                  >
                    {currentProject?.description?.length || 0}/
                    {CHAR_LIMITS.projectDescription}
                  </div>
                </div>

                <div className="space-y-1">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    maxLength={CHAR_LIMITS.tags}
                    placeholder="Tags (comma separated, e.g., React, Node.js)"
                    className="px-4 py-2 w-full text-gray-900 bg-white rounded-lg border border-gray-300 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none"
                  />
                  <div
                    className={`text-sm text-right ${getCharCountColor(
                      tagInput.length,
                      CHAR_LIMITS.tags
                    )}`}
                  >
                    {tagInput.length}/{CHAR_LIMITS.tags}
                  </div>
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
                    className="px-6 py-2 font-semibold text-white bg-orange-500 rounded-lg"
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
                          <Upload className="mb-2 w-12 h-12" />
                          <span>Change image</span>
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
                          <div className="space-y-1">
                            <input
                              type="text"
                              value={currentProject?.date || ""}
                              onChange={(e) =>
                                handleProjectChange("date", e.target.value)
                              }
                              maxLength={CHAR_LIMITS.date}
                              className="w-16 text-gray-900 bg-transparent border-b border-gray-300 dark:text-white dark:border-gray-600 focus:outline-none"
                            />
                            <div
                              className={`text-xs text-right ${getCharCountColor(
                                currentProject?.date?.length || 0,
                                CHAR_LIMITS.date
                              )}`}
                            >
                              {currentProject?.date?.length || 0}/
                              {CHAR_LIMITS.date}
                            </div>
                          </div>
                        ) : (
                          project.date
                        )}
                      </div>
                      <div className="flex items-center text-sm text-orange-500">
                        <Tag className="mr-1 w-4 h-4" />
                        {editingProjectId === project.id ? (
                          <div className="space-y-1">
                            <input
                              type="text"
                              value={currentProject?.category || ""}
                              onChange={(e) =>
                                handleProjectChange("category", e.target.value)
                              }
                              maxLength={CHAR_LIMITS.category}
                              className="w-24 text-gray-900 bg-transparent border-b border-gray-300 dark:text-white dark:border-gray-600 focus:outline-none"
                            />
                            <div
                              className={`text-xs text-right ${getCharCountColor(
                                currentProject?.category?.length || 0,
                                CHAR_LIMITS.category
                              )}`}
                            >
                              {currentProject?.category?.length || 0}/
                              {CHAR_LIMITS.category}
                            </div>
                          </div>
                        ) : (
                          project.category
                        )}
                      </div>
                    </div>

                    {editingProjectId === project.id ? (
                      <div className="space-y-1">
                        <input
                          type="text"
                          value={currentProject?.title || ""}
                          onChange={(e) =>
                            handleProjectChange("title", e.target.value)
                          }
                          maxLength={CHAR_LIMITS.projectTitle}
                          className="mb-3 w-full text-xl font-bold text-gray-900 bg-transparent border-b border-gray-300 dark:text-white dark:border-gray-600 focus:outline-none"
                        />
                        <div
                          className={`text-xs text-right ${getCharCountColor(
                            currentProject?.title?.length || 0,
                            CHAR_LIMITS.projectTitle
                          )}`}
                        >
                          {currentProject?.title?.length || 0}/
                          {CHAR_LIMITS.projectTitle}
                        </div>
                      </div>
                    ) : (
                      <h3 className="mb-3 text-xl font-bold text-gray-900 transition-colors duration-200 dark:text-white group-hover:text-orange-500">
                        {project.title}
                      </h3>
                    )}

                    {editingProjectId === project.id ? (
                      <div className="space-y-1">
                        <textarea
                          value={currentProject?.description || ""}
                          onChange={(e) =>
                            handleProjectChange("description", e.target.value)
                          }
                          maxLength={CHAR_LIMITS.projectDescription}
                          className="p-2 mb-4 w-full text-gray-900 bg-transparent rounded border border-gray-300 resize-none dark:text-white dark:border-gray-600 focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none"
                          rows={3}
                        />
                        <div
                          className={`text-xs text-right ${getCharCountColor(
                            currentProject?.description?.length || 0,
                            CHAR_LIMITS.projectDescription
                          )}`}
                        >
                          {currentProject?.description?.length || 0}/
                          {CHAR_LIMITS.projectDescription}
                        </div>
                      </div>
                    ) : (
                      <p className="mb-4 leading-relaxed text-gray-600 dark:text-gray-300">
                        {project.description}
                      </p>
                    )}

                    {/* Tech Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {editingProjectId === project.id ? (
                        <div className="space-y-1 w-full">
                          <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            maxLength={CHAR_LIMITS.tags}
                            className="p-2 w-full text-gray-900 bg-transparent rounded border border-gray-300 dark:text-white dark:border-gray-600 focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none"
                            placeholder="Separate tags with commas"
                          />
                          <div
                            className={`text-xs text-right ${getCharCountColor(
                              tagInput.length,
                              CHAR_LIMITS.tags
                            )}`}
                          >
                            {tagInput.length}/{CHAR_LIMITS.tags}
                          </div>
                        </div>
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

                      {isEditing && (
                        <p className="text-center text-xs text-gray-400">
                          Tags should be separated by commas (e.g., data1,
                          data2, data3)
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Image Cropping Modal */}
      {isCropping && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Crop className="w-6 h-6" />
                Crop Project Image
              </h3>
              <button
                onClick={() => setIsCropping(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-900 dark:text-white" />
              </button>
            </div>

            <div className="p-6">
              <div
                ref={containerRef}
                className="relative h-96 bg-gray-900 rounded-lg overflow-hidden mb-6 cursor-move select-none"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {/* Rectangular crop overlay for Project section */}
                <div className="absolute inset-0 pointer-events-none z-10">
                  <svg className="w-full h-full">
                    <defs>
                      <mask id="rectMask">
                        <rect width="100%" height="100%" fill="white" />
                        <rect
                          x="50%"
                          y="50%"
                          width="400"
                          height="300"
                          fill="black"
                          transform="translate(-200, -150)"
                        />
                      </mask>
                    </defs>
                    <rect
                      width="100%"
                      height="100%"
                      fill="rgba(0,0,0,0.5)"
                      mask="url(#rectMask)"
                    />
                    <rect
                      x="50%"
                      y="50%"
                      width="400"
                      height="300"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeDasharray="10,5"
                      transform="translate(-200, -150)"
                    />
                  </svg>
                </div>

                <img
                  ref={imageRef}
                  src={imageToCrop}
                  alt="Crop preview"
                  onLoad={handleImageLoad}
                  className="absolute select-none z-0"
                  style={{
                    maxHeight: "100%",
                    maxWidth: "100%",
                    height: "auto",
                    width: "auto",
                    left: "50%",
                    top: "50%",
                    transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(${scale})`,
                    transformOrigin: "center",
                    opacity: imageLoaded ? 1 : 0,
                    transition: imageLoaded ? "none" : "opacity 0.3s",
                  }}
                  draggable={false}
                />

                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center text-white">
                    <p>Loading image...</p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-white">
                      Zoom
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={handleZoomOut}
                        className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                      >
                        <ZoomOut className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleZoomIn}
                        className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.01}
                    value={scale}
                    onChange={(e) => setScale(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  Drag to reposition • Use slider or buttons to zoom
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setIsCropping(false)}
                className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCropConfirm}
                disabled={!imageLoaded}
                className="px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="w-5 h-5" />
                Crop & Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden canvas for cropping */}
      <canvas ref={canvasRef} className="hidden" />
    </section>
  );
};

export default Projects;
