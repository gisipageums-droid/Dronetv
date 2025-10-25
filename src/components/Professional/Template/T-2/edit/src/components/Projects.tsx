import { Edit2, ExternalLink, Github, Loader2, Plus, Save, Trash2, Upload, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

// Custom Button component
const Button = ({
  children,
  onClick,
  variant,
  size,
  className,
  disabled,
  ...props
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: string;
  size?: string;
  className?: string;
  disabled?: boolean;
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variants: Record<string, string> = {
    outline: "border border-gray-300 bg-transparent hover:bg-gray-50",
    default: "bg-blue-600 text-white hover:bg-blue-700",
  };
  const sizes: Record<string, string> = {
    sm: "h-8 px-3 text-sm",
    default: "h-10 px-4",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant || 'default']} ${sizes[size || 'default']
        } ${className || ""}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

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
  projectsData?: ProjectsData;
  onStateChange?: (data: ProjectsData) => void;
  userId?: string;
  professionalId?: string;
  templateSelection?: string;
}

export function Projects({ projectsData, onStateChange, userId, professionalId, templateSelection }: ProjectsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const fileInputRefs = useRef<Record<string, HTMLInputElement>>({});

  // Pending image files for S3 upload
  const [pendingImageFiles, setPendingImageFiles] = useState<Record<string, File>>({});

  // Initialize with props data or empty structure
  const [data, setData] = useState<ProjectsData>(projectsData || {
    subtitle: "",
    heading: "",
    description: "",
    projects: [],
    categories: []
  });
  const [tempData, setTempData] = useState<ProjectsData>(projectsData || {
    subtitle: "",
    heading: "",
    description: "",
    projects: [],
    categories: []
  });

  // Calculate displayData based on editing state
  const displayData = isEditing ? tempData : data;

  // Use displayData for filtered projects to ensure consistency
  const filteredProjects = displayData.projects.filter(project =>
    activeCategory === "All" || project.category === activeCategory
  );

  // Safe string splitting for heading
  const renderHeading = () => {
    const heading = displayData?.heading || "Featured Projects";
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

  // Sync with props data when it changes
  useEffect(() => {
    if (projectsData) {
      setData(projectsData);
      setTempData(projectsData);
    }
  }, [projectsData]);

  // Notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(data);
    }
  }, [data]);

  const handleEdit = () => {
    setIsEditing(true);
    setTempData({ ...data });
    setPendingImageFiles({});
  };

  // Save function with S3 upload
  const handleSave = async () => {
    try {
      setIsUploading(true);

      let updatedData = { ...tempData };

      // Upload images for projects with pending files
      for (const [projectId, file] of Object.entries(pendingImageFiles)) {
        if (!userId || !professionalId || !templateSelection) {
          toast.error('Missing user information. Please refresh and try again.');
          return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', userId);
        formData.append('fieldName', `project_${projectId}`);

        const uploadResponse = await fetch(`https://ow3v94b9gf.execute-api.ap-south-1.amazonaws.com/dev/`, {
          method: 'POST',
          body: formData,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          updatedData.projects = updatedData.projects.map(project =>
            project.id.toString() === projectId ? { ...project, image: uploadData.s3Url } : project
          );
        } else {
          const errorData = await uploadResponse.json();
          toast.error(`Image upload failed: ${errorData.message || 'Unknown error'}`);
          return;
        }
      }

      // Clear pending files and update state immediately
      setPendingImageFiles({});

      // Update both data and tempData to ensure UI consistency
      setData(updatedData);
      setTempData(updatedData);

      setIsSaving(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Set editing to false AFTER state updates
      setIsEditing(false);
      toast.success('Projects section saved successfully');

    } catch (error) {
      console.error('Error saving projects section:', error);
      toast.error('Error saving changes. Please try again.');
    } finally {
      setIsUploading(false);
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTempData({ ...data });
    setPendingImageFiles({});
    setIsEditing(false);
  };

  // Image upload handler
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, projectId: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    // Store the file for later S3 upload
    setPendingImageFiles(prev => ({ ...prev, [projectId]: file }));

    // Create preview with FileReader
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setTempData(prevData => ({
        ...prevData,
        projects: prevData.projects.map(project =>
          project.id.toString() === projectId
            ? { ...project, image: dataUrl }
            : project
        )
      }));
    };
    reader.readAsDataURL(file);
  };

  // Update functions
  const updateProject = useCallback((index: number, field: keyof Project, value: any) => {
    setTempData(prevData => {
      const updatedProjects = [...prevData.projects];
      updatedProjects[index] = { ...updatedProjects[index], [field]: value };
      return { ...prevData, projects: updatedProjects };
    });
  }, []);

  const updateTag = useCallback((projectIndex: number, tagIndex: number, value: string) => {
    setTempData(prevData => {
      const updatedProjects = [...prevData.projects];
      const updatedTags = [...updatedProjects[projectIndex].tags];
      updatedTags[tagIndex] = value;
      updatedProjects[projectIndex] = { ...updatedProjects[projectIndex], tags: updatedTags };
      return { ...prevData, projects: updatedProjects };
    });
  }, []);

  const addTag = useCallback((projectIndex: number) => {
    setTempData(prevData => {
      const updatedProjects = [...prevData.projects];
      updatedProjects[projectIndex] = {
        ...updatedProjects[projectIndex],
        tags: [...updatedProjects[projectIndex].tags, 'New Tag']
      };
      return { ...prevData, projects: updatedProjects };
    });
  }, []);

  const removeTag = useCallback((projectIndex: number, tagIndex: number) => {
    setTempData(prevData => {
      const updatedProjects = [...prevData.projects];
      updatedProjects[projectIndex] = {
        ...updatedProjects[projectIndex],
        tags: updatedProjects[projectIndex].tags.filter((_, i) => i !== tagIndex)
      };
      return { ...prevData, projects: updatedProjects };
    });
  }, []);

  const addProject = useCallback(() => {
    const newProject: Project = {
      id: Date.now(),
      title: 'New Project',
      description: 'Add a short description for your project here.',
      longDescription: 'Add a detailed description for your project here.',
      image: '',
      tags: ['Technology 1', 'Technology 2'],
      github: 'https://github.com/username/project',
      live: 'https://project-demo.com',
      date: '2024',
      category: 'Development',
      featured: false,
      client: ''
    };
    setTempData(prevData => ({
      ...prevData,
      projects: [...prevData.projects, newProject]
    }));
  }, []);

  const removeProject = useCallback((index: number) => {
    setTempData(prevData => {
      if (prevData.projects.length <= 1) {
        toast.error("You must have at least one project");
        return prevData;
      }
      return {
        ...prevData,
        projects: prevData.projects.filter((_, i) => i !== index)
      };
    });
  }, []);

  const updateSection = useCallback((field: keyof Omit<ProjectsData, 'projects' | 'categories'>, value: string) => {
    setTempData(prevData => ({
      ...prevData,
      [field]: value
    }));
  }, []);

  const updateCategory = useCallback((index: number, value: string) => {
    setTempData(prevData => {
      const updatedCategories = [...prevData.categories];
      updatedCategories[index] = value;
      return { ...prevData, categories: updatedCategories };
    });
  }, []);

  const addCategory = useCallback(() => {
    setTempData(prevData => ({
      ...prevData,
      categories: [...prevData.categories, 'New Category']
    }));
  }, []);

  const removeCategory = useCallback((index: number) => {
    setTempData(prevData => {
      if (prevData.categories.length <= 1) {
        toast.error("You must have at least one category");
        return prevData;
      }
      return {
        ...prevData,
        categories: prevData.categories.filter((_, i) => i !== index)
      };
    });
  }, []);

  return (
    <section id="projects" className="relative py-5 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Edit Controls */}
        <div className='text-right mb-20'>
          {!isEditing ? (
            <Button
              onClick={handleEdit}
              size='sm'
              className='bg-red-500 hover:bg-red-600 text-white shadow-md'
            >
              <Edit2 className='w-4 h-4 mr-2' />
              Edit
            </Button>
          ) : (
            <div className='flex gap-2 justify-end'>
              <Button
                onClick={handleSave}
                size='sm'
                className='bg-green-600 hover:bg-green-700 text-white shadow-md'
                disabled={isSaving || isUploading}
              >
                {isUploading ? (
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                ) : isSaving ? (
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                ) : (
                  <Save className='w-4 h-4 mr-2' />
                )}
                {isUploading ? "Uploading..." : isSaving ? "Saving..." : "Save"}
              </Button>
              <Button
                onClick={handleCancel}
                size='sm'
                className='bg-red-500 hover:bg-red-600 shadow-md text-white'
                disabled={isSaving || isUploading}
              >
                <X className='w-4 h-4 mr-2' />
                Cancel
              </Button>
              <Button
                onClick={addProject}
                variant='outline'
                size='sm'
                className='bg-blue-50 hover:bg-blue-100 text-blue-700 shadow-md'
              >
                <Plus className='w-4 h-4 mr-2' />
                Add Project
              </Button>
            </div>
          )}
        </div>

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          {isEditing ? (
            <>
              <input
                type="text"
                value={tempData.subtitle || ""}
                onChange={(e) => updateSection('subtitle', e.target.value)}
                className="text-lg text-yellow-500 mb-2 bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 text-center w-full max-w-md mx-auto"
                placeholder="Subtitle"
              />
              <input
                type="text"
                value={tempData.heading || ""}
                onChange={(e) => updateSection('heading', e.target.value)}
                className="text-3xl sm:text-4xl text-foreground mb-4 bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 text-center w-full max-w-md mx-auto"
                placeholder="Heading"
              />
              <textarea
                value={tempData.description || ""}
                onChange={(e) => updateSection('description', e.target.value)}
                className="text-lg text-muted-foreground max-w-2xl mx-auto bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 w-full"
                rows={2}
                placeholder="Description"
              />
            </>
          ) : (
            <>
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
            </>
          )}
        </motion.div>

        {/* Categories Filter */}
        {!isEditing && data.categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            <button
              onClick={() => setActiveCategory("All")}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${activeCategory === "All"
                  ? 'bg-yellow-400 text-gray-900 shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              All
            </button>
            {data.categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${activeCategory === category
                    ? 'bg-yellow-400 text-gray-900 shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {category}
              </button>
            ))}
          </motion.div>
        )}

        {/* Categories Editor */}
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mb-12 p-6 bg-gray-50 rounded-2xl"
          >
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {tempData.categories.map((category, index) => (
                <div key={index} className="flex items-center gap-2 bg-white px-3 py-1 rounded-full">
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => updateCategory(index, e.target.value)}
                    className="bg-transparent border-none outline-none"
                  />
                  <button
                    onClick={() => removeCategory(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <button
                onClick={addCategory}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-all duration-300"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-border relative"
              >
                {isEditing && (
                  <Button
                    onClick={() => removeProject(index)}
                    size='sm'
                    variant='outline'
                    className='absolute top-2 right-2 bg-red-50 hover:bg-red-100 text-red-700 p-1 z-10'
                  >
                    <Trash2 className='w-3 h-3' />
                  </Button>
                )}

                {/* Project Image */}
                <div className="relative overflow-hidden bg-gray-100">
                  <motion.div transition={{ duration: 0.3 }}>
                    {isEditing && (
                      <div className="absolute top-2 left-2 z-10">
                        <Button
                          onClick={() => fileInputRefs.current[project.id.toString()]?.click()}
                          size="sm"
                          variant="outline"
                          className="bg-white/90 backdrop-blur-sm shadow-md text-black hover:bg-gray-100"
                        >
                          <Upload className="w-4 h-4 mr-2 text-black" />
                          Upload
                        </Button>
                        <input
                          ref={el => fileInputRefs.current[project.id.toString()] = el as HTMLInputElement}
                          type='file'
                          accept='image/*'
                          onChange={(e) => handleImageUpload(e, project.id.toString())}
                          className='hidden'
                        />
                        {pendingImageFiles[project.id.toString()] && (
                          <p className='text-xs text-orange-600 mt-1 bg-white p-1 rounded'>
                            {pendingImageFiles[project.id.toString()].name}
                          </p>
                        )}
                      </div>
                    )}
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200"%3E%3Crect fill="%23f3f4f6" width="400" height="200"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="18" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    ) : (
                      <div className="w-full h-48 flex items-center justify-center bg-gray-200">
                        <p className="text-gray-400 text-sm">No image uploaded</p>
                      </div>
                    )}
                  </motion.div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 hover:opacity-100 transition-all duration-300 flex space-x-4">
                      <motion.a
                        href={project.live}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-yellow-400 text-gray-900 p-2 rounded-full"
                      >
                        <ExternalLink size={20} />
                      </motion.a>
                      <motion.a
                        href={project.github}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white text-gray-900 p-2 rounded-full"
                      >
                        <Github size={20} />
                      </motion.a>
                    </div>
                  </div>
                </div>

                {/* Project Content */}
                <div className="p-6">
                  {/* Project Title */}
                  {isEditing ? (
                    <input
                      type="text"
                      value={project.title}
                      onChange={(e) => updateProject(index, 'title', e.target.value)}
                      className="text-xl text-foreground mb-2 w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1"
                    />
                  ) : (
                    <h3 className="text-xl text-foreground mb-2">{project.title}</h3>
                  )}

                  {/* Project Description */}
                  {isEditing ? (
                    <textarea
                      value={project.description}
                      onChange={(e) => updateProject(index, 'description', e.target.value)}
                      className="text-muted-foreground mb-4 leading-relaxed w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1"
                      rows={3}
                    />
                  ) : (
                    <p className="text-muted-foreground mb-4 leading-relaxed">{project.description}</p>
                  )}

                  {/* Project Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm flex items-center gap-2"
                      >
                        {isEditing ? (
                          <>
                            <input
                              type="text"
                              value={tag}
                              onChange={(e) => updateTag(index, tagIndex, e.target.value)}
                              className="bg-transparent border-none outline-none w-20"
                            />
                            <button
                              onClick={() => removeTag(index, tagIndex)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </>
                        ) : (
                          tag
                        )}
                      </span>
                    ))}
                    {isEditing && (
                      <button
                        onClick={() => addTag(index)}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-all duration-300"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Project Meta */}
                  {isEditing ? (
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <input
                        type="text"
                        value={project.category}
                        onChange={(e) => updateProject(index, 'category', e.target.value)}
                        placeholder="Category"
                        className="w-full p-2 bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={project.date}
                        onChange={(e) => updateProject(index, 'date', e.target.value)}
                        placeholder="Date"
                        className="w-full p-2 bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  ) : (
                    <div className="flex justify-between items-center mb-4 text-sm text-muted-foreground">
                      <span className="bg-gray-100 px-3 py-1 rounded-full">{project.category}</span>
                      <span>{project.date}</span>
                    </div>
                  )}

                  {/* Project Links */}
                  {isEditing ? (
                    <div className="flex flex-col space-y-2">
                      <input
                        type="text"
                        value={project.live}
                        onChange={(e) => updateProject(index, 'live', e.target.value)}
                        placeholder="Live Demo URL"
                        className="w-full p-2 bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={project.github}
                        onChange={(e) => updateProject(index, 'github', e.target.value)}
                        placeholder="GitHub URL"
                        className="w-full p-2 bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  ) : (
                    <div className="flex space-x-3">
                      <a
                        href={project.live}
                        className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex-1"
                      >
                        Live Demo
                      </a>
                      <a
                        href={project.github}
                        className="inline-flex items-center justify-center px-4 py-2 bg-transparent text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex-1"
                      >
                        <Github className="w-4 h-4 mr-2" />
                        Code
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          !isEditing && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No projects to display. Click "Edit" to add projects.</p>
            </div>
          )
        )}
      </div>
    </section>
  );
}
