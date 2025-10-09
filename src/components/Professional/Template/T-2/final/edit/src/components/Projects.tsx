import { Edit2, ExternalLink, Github, Loader2, Plus, Save, Trash2, Upload, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { ImageWithFallback } from './figma/ImageWithFallback';

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

// Define types for Project data based on your JSON
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

// Empty default data for Projects section
const defaultProjectsData: ProjectsData = {
  subtitle: "",
  heading: "",
  description: "",
  projects: [],
  categories: []
};

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
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const projectsRef = useRef<HTMLDivElement>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement>>({});
  
  // Pending image files for S3 upload
  const [pendingImageFiles, setPendingImageFiles] = useState<Record<string, File>>({});

  const [data, setData] = useState<ProjectsData>(defaultProjectsData);
  const [tempData, setTempData] = useState<ProjectsData>(defaultProjectsData);

  // Calculate displayData here, before any functions that use it
  const displayData = isEditing ? tempData : data;

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

  // Filter projects by category
  const filteredProjects = displayData.projects.filter(project => 
    activeCategory === "All" || project.category === activeCategory
  );

  // Notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(data);
    }
  }, [data]);

  // Intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (projectsRef.current) observer.observe(projectsRef.current);
    return () => {
      if (projectsRef.current) observer.unobserve(projectsRef.current);
    };
  }, []);

  // Fake API fetch
  const fetchProjectsData = async () => {
    setIsLoading(true);
    try {
      const response = await new Promise<ProjectsData>((resolve) =>
        setTimeout(() => resolve(projectsData || defaultProjectsData), 1200)
      );
      setData(response);
      setTempData(response);
      setDataLoaded(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible && !dataLoaded && !isLoading) {
      fetchProjectsData();
    }
  }, [isVisible, dataLoaded, isLoading, projectsData]);

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

      setPendingImageFiles({});
      setIsSaving(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setData(updatedData);
      setTempData(updatedData);
      
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

    setPendingImageFiles(prev => ({ ...prev, [projectId]: file }));

    const reader = new FileReader();
    reader.onload = (e) => {
      const updatedProjects = tempData.projects.map(project =>
        project.id.toString() === projectId ? { ...project, image: e.target?.result as string } : project
      );
      setTempData({ ...tempData, projects: updatedProjects });
    };
    reader.readAsDataURL(file);
  };

  // Update functions
  const updateProject = useCallback((index: number, field: keyof Project, value: any) => {
    const updatedProjects = [...tempData.projects];
    updatedProjects[index] = { ...updatedProjects[index], [field]: value };
    setTempData({ ...tempData, projects: updatedProjects });
  }, [tempData]);

  const updateTag = useCallback((projectIndex: number, tagIndex: number, value: string) => {
    const updatedProjects = [...tempData.projects];
    const updatedTags = [...updatedProjects[projectIndex].tags];
    updatedTags[tagIndex] = value;
    updatedProjects[projectIndex].tags = updatedTags;
    setTempData({ ...tempData, projects: updatedProjects });
  }, [tempData]);

  const addTag = useCallback((projectIndex: number) => {
    const updatedProjects = [...tempData.projects];
    updatedProjects[projectIndex].tags.push('New Tag');
    setTempData({ ...tempData, projects: updatedProjects });
  }, [tempData]);

  const removeTag = useCallback((projectIndex: number, tagIndex: number) => {
    const updatedProjects = [...tempData.projects];
    updatedProjects[projectIndex].tags = updatedProjects[projectIndex].tags.filter((_, i) => i !== tagIndex);
    setTempData({ ...tempData, projects: updatedProjects });
  }, [tempData]);

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
    setTempData({
      ...tempData,
      projects: [...tempData.projects, newProject]
    });
  }, [tempData]);

  const removeProject = useCallback((index: number) => {
    if (tempData.projects.length <= 1) {
      toast.error("You must have at least one project");
      return;
    }
    const updatedProjects = tempData.projects.filter((_, i) => i !== index);
    setTempData({ ...tempData, projects: updatedProjects });
  }, [tempData]);

  const updateSection = useCallback((field: keyof Omit<ProjectsData, 'projects' | 'categories'>, value: string) => {
    setTempData({
      ...tempData,
      [field]: value
    });
  }, [tempData]);

  const updateCategory = useCallback((index: number, value: string) => {
    const updatedCategories = [...tempData.categories];
    updatedCategories[index] = value;
    setTempData({ ...tempData, categories: updatedCategories });
  }, [tempData]);

  const addCategory = useCallback(() => {
    setTempData({
      ...tempData,
      categories: [...tempData.categories, 'New Category']
    });
  }, [tempData]);

  const removeCategory = useCallback((index: number) => {
    if (tempData.categories.length <= 1) {
      toast.error("You must have at least one category");
      return;
    }
    const updatedCategories = tempData.categories.filter((_, i) => i !== index);
    setTempData({ ...tempData, categories: updatedCategories });
  }, [tempData]);

  // Loading state
  if (isLoading) {
    return (
      <section ref={projectsRef} id="projects" className="relative py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-yellow-500" />
          <p className="text-muted-foreground mt-4">Loading projects data...</p>
        </div>
      </section>
    );
  }

  return (
    <section ref={projectsRef} id="projects" className="relative py-20 bg-background">
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
                value={displayData.subtitle || ""}
                onChange={(e) => updateSection('subtitle', e.target.value)}
                className="text-lg text-yellow-500 mb-2 bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 text-center w-full max-w-md mx-auto"
                placeholder="Subtitle"
              />
              <input
                type="text"
                value={displayData.heading || ""}
                onChange={(e) => updateSection('heading', e.target.value)}
                className="text-3xl sm:text-4xl text-foreground mb-4 bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 text-center w-full max-w-md mx-auto"
                placeholder="Heading"
              />
              <textarea
                value={displayData.description || ""}
                onChange={(e) => updateSection('description', e.target.value)}
                className="text-lg text-muted-foreground max-w-2xl mx-auto bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 w-full"
                rows={2}
                placeholder="Description"
              />
            </>
          ) : (
            <>
              {displayData.subtitle && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="text-lg text-yellow-500 mb-2"
                >
                  {displayData.subtitle}
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
              {displayData.description && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  viewport={{ once: true }}
                  className="text-lg text-muted-foreground max-w-2xl mx-auto"
                >
                  {displayData.description}
                </motion.p>
              )}
            </>
          )}
        </motion.div>

        {/* Categories Filter */}
        {!isEditing && displayData.categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {displayData.categories.map((category) => (
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

        {/* Categories Editor */}
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mb-12 p-6 bg-gray-50 rounded-2xl"
          >
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {displayData.categories.map((category, index) => (
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
                <div className="relative overflow-hidden">
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
                    <ImageWithFallback
                      src={project.image}
                      alt={project.title}
                      className="w-full h-48 object-cover"
                      fallbackSrc=""
                    />
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