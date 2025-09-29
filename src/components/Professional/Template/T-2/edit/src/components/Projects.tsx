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

// Define types for Project data
interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  liveUrl: string;
  githubUrl: string;
}

interface ProjectsData {
  projects: Project[];
  sectionTitle: string;
  sectionDescription: string;
  viewAllButton: string;
}

// Default data for Projects section
const defaultProjectsData: ProjectsData = {
  projects: [
    {
      id: '1',
      title: 'E-Commerce Platform',
      description: 'A full-stack e-commerce solution built with React, Node.js, and PostgreSQL. Features include user authentication, payment processing, and admin dashboard.',
      image: 'https://images.unsplash.com/photo-1604510417956-f4d74192b25c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHdvcmtzcGFjZSUyMHNldHVwfGVufDF8fHx8MTc1NzM5NjUwNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
      liveUrl: '#',
      githubUrl: '#'
    },
    {
      id: '2',
      title: 'Task Management App',
      description: 'A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.',
      image: 'https://images.unsplash.com/photo-1718220216044-006f43e3a9b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b3Jrc3BhY2UlMjBvZmZpY2V8ZW58MXx8fHwxNzU3NDg4NDYwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      technologies: ['Vue.js', 'Express', 'Socket.io', 'MongoDB'],
      liveUrl: '#',
      githubUrl: '#'
    },
    {
      id: '3',
      title: 'Weather Dashboard',
      description: 'A responsive weather application with location-based forecasts, interactive maps, and detailed weather analytics.',
      image: 'https://images.unsplash.com/photo-1695634621121-691d54259d37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBwb3J0Zm9saW8lMjBkZXNpZ258ZW58MXx8fHwxNzU3NDg4OTI1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      technologies: ['React', 'TypeScript', 'Chart.js', 'OpenWeather API'],
      liveUrl: '#',
      githubUrl: '#'
    }
  ],
  sectionTitle: 'Featured Projects',
  sectionDescription: 'A showcase of my recent work and projects that demonstrate my skills and passion for creating innovative solutions.',
  viewAllButton: 'View All Projects'
};

// Props interface
interface ProjectsProps {
  projectsData?: ProjectsData;
  onStateChange?: (data: ProjectsData) => void;
  userId?: string;
  publishedId?: string;
  templateSelection?: string;
}

export function Projects({ projectsData, onStateChange, userId, publishedId, templateSelection }: ProjectsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const projectsRef = useRef<HTMLDivElement>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement>>({});
  
  // Pending image files for S3 upload - SAME PATTERN AS HERO
  const [pendingImageFiles, setPendingImageFiles] = useState<Record<string, File>>({});

  const [data, setData] = useState<ProjectsData>(defaultProjectsData);
  const [tempData, setTempData] = useState<ProjectsData>(defaultProjectsData);

  // Notify parent of state changes - SAME AS HERO
  useEffect(() => {
    if (onStateChange) {
      onStateChange(data);
    }
  }, [data]);

  // Intersection observer - SAME AS HERO
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

  // Fake API fetch - SAME LOGIC AS HERO
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
    setPendingImageFiles({}); // Clear pending files - SAME AS HERO
  };

  // Save function with S3 upload - SAME PATTERN AS HERO
  const handleSave = async () => {
    try {
      setIsUploading(true);
      
      // Create a copy of tempData to update with S3 URLs
      let updatedData = { ...tempData };

      // Upload images for projects with pending files
      for (const [projectId, file] of Object.entries(pendingImageFiles)) {
        if (!userId || !publishedId || !templateSelection) {
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
          // Update the project image with the S3 URL
          updatedData.projects = updatedData.projects.map(project =>
            project.id === projectId ? { ...project, image: uploadData.s3Url } : project
          );
          console.log('Project image uploaded to S3:', uploadData.s3Url);
        } else {
          const errorData = await uploadResponse.json();
          toast.error(`Image upload failed: ${errorData.message || 'Unknown error'}`);
          return;
        }
      }

      // Clear pending files - SAME AS HERO
      setPendingImageFiles({});

      // Save the updated data with S3 URLs
      setIsSaving(true);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate save API call
      
      // Update both states with the new URLs - SAME AS HERO
      setData(updatedData);
      setTempData(updatedData);
      
      setIsEditing(false);
      toast.success('Projects section saved with S3 URLs ready for publish');

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
    setPendingImageFiles({}); // Clear pending files - SAME AS HERO
    setIsEditing(false);
  };

  // Image upload handler with validation - SAME PATTERN AS HERO
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, projectId: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type and size - SAME AS HERO
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit - SAME AS HERO
      toast.error('File size must be less than 5MB');
      return;
    }

    // Store the file for upload on Save - SAME PATTERN AS HERO
    setPendingImageFiles(prev => ({ ...prev, [projectId]: file }));

    // Show immediate local preview - SAME AS HERO
    const reader = new FileReader();
    reader.onload = (e) => {
      const updatedProjects = tempData.projects.map(project =>
        project.id === projectId ? { ...project, image: e.target?.result as string } : project
      );
      setTempData({ ...tempData, projects: updatedProjects });
    };
    reader.readAsDataURL(file);
  };

  // Stable update functions with useCallback - SAME PATTERN AS HERO
  const updateProject = useCallback((index: number, field: string, value: any) => {
    const updatedProjects = [...tempData.projects];
    updatedProjects[index] = { ...updatedProjects[index], [field]: value };
    setTempData({ ...tempData, projects: updatedProjects });
  }, [tempData]);

  const updateTechnology = useCallback((projectIndex: number, techIndex: number, value: string) => {
    const updatedProjects = [...tempData.projects];
    const updatedTechnologies = [...updatedProjects[projectIndex].technologies];
    updatedTechnologies[techIndex] = value;
    updatedProjects[projectIndex].technologies = updatedTechnologies;
    setTempData({ ...tempData, projects: updatedProjects });
  }, [tempData]);

  const addTechnology = useCallback((projectIndex: number) => {
    const updatedProjects = [...tempData.projects];
    updatedProjects[projectIndex].technologies.push('New Technology');
    setTempData({ ...tempData, projects: updatedProjects });
  }, [tempData]);

  const removeTechnology = useCallback((projectIndex: number, techIndex: number) => {
    const updatedProjects = [...tempData.projects];
    updatedProjects[projectIndex].technologies = updatedProjects[projectIndex].technologies.filter((_, i) => i !== techIndex);
    setTempData({ ...tempData, projects: updatedProjects });
  }, [tempData]);

  const addProject = useCallback(() => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: 'New Project',
      description: 'Add a description for your project here.',
      image: 'https://via.placeholder.com/400x300?text=Project+Image',
      technologies: ['Technology 1', 'Technology 2'],
      liveUrl: '#',
      githubUrl: '#'
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

  const updateSection = useCallback((field: keyof Omit<ProjectsData, 'projects'>, value: string) => {
    setTempData({
      ...tempData,
      [field]: value
    });
  }, [tempData]);

  const displayData = isEditing ? tempData : data;

  // Loading state - SAME PATTERN AS HERO
  if (isLoading || !displayData.projects || displayData.projects.length === 0) {
    return (
      <section ref={projectsRef} id="projects" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-yellow-500" />
          <p className="text-muted-foreground mt-4">Loading projects data...</p>
        </div>
      </section>
    );
  }

  return (
    <section ref={projectsRef} id="projects" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Edit Controls */}
        <div className='text-right mb-8'>
          {!isEditing ? (
            <Button
              onClick={handleEdit}
              size='sm'
              className='bg-red-500 hover:bg-red-600 shadow-md text-white'
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
                value={displayData.sectionTitle}
                onChange={(e) => updateSection('sectionTitle', e.target.value)}
                className="text-3xl sm:text-4xl text-foreground mb-4 bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 text-center w-full max-w-md mx-auto"
              />
              <textarea
                value={displayData.sectionDescription}
                onChange={(e) => updateSection('sectionDescription', e.target.value)}
                className="text-lg text-muted-foreground max-w-2xl mx-auto bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 w-full"
                rows={3}
              />
            </>
          ) : (
            <>
              <h2 className="text-3xl sm:text-4xl text-foreground mb-4">
                {displayData.sectionTitle.split(' ')[0]}{' '}
                <span className="text-yellow-500">
                  {displayData.sectionTitle.split(' ').slice(1).join(' ')}
                </span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {displayData.sectionDescription}
              </p>
            </>
          )}
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayData.projects.map((project, index) => (
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

              <div className="relative overflow-hidden">
                <motion.div transition={{ duration: 0.3 }}>
                  {isEditing && (
                    <div className="absolute top-2 left-2 z-10">
                      <Button
                        onClick={() => fileInputRefs.current[project.id]?.click()}
                        size="sm"
                        variant="outline"
                        className="bg-white/90 backdrop-blur-sm shadow-md text-black hover:bg-gray-100"
                      >
                        <Upload className="w-4 h-4 mr-2 text-black" />
                        Upload
                      </Button>

                      <input
                        ref={el => fileInputRefs.current[project.id] = el as HTMLInputElement}
                        type='file'
                        accept='image/*'
                        onChange={(e) => handleImageUpload(e, project.id)}
                        className='hidden'
                      />
                      {pendingImageFiles[project.id] && (
                        <p className='text-xs text-orange-600 mt-1 bg-white p-1 rounded'>
                          {pendingImageFiles[project.id].name}
                        </p>
                      )}
                    </div>
                  )}
                  <ImageWithFallback
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover"
                  />
                </motion.div>
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 hover:opacity-100 transition-all duration-300 flex space-x-4">
                    <motion.a
                      href={project.liveUrl}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-yellow-400 text-gray-900 p-2 rounded-full"
                    >
                      <ExternalLink size={20} />
                    </motion.a>
                    <motion.a
                      href={project.githubUrl}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white text-gray-900 p-2 rounded-full"
                    >
                      <Github size={20} />
                    </motion.a>
                  </div>
                </div>
              </div>

              <div className="p-6">
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

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm flex items-center gap-2"
                    >
                      {isEditing ? (
                        <>
                          <input
                            type="text"
                            value={tech}
                            onChange={(e) => updateTechnology(index, techIndex, e.target.value)}
                            className="bg-transparent border-none outline-none w-20"
                          />
                          <button
                            onClick={() => removeTechnology(index, techIndex)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </>
                      ) : (
                        tech
                      )}
                    </span>
                  ))}
                  {isEditing && (
                    <button
                      onClick={() => addTechnology(index)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-all duration-300"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <div className="flex flex-col space-y-2">
                    <input
                      type="text"
                      value={project.liveUrl}
                      onChange={(e) => updateProject(index, 'liveUrl', e.target.value)}
                      placeholder="Live Demo URL"
                      className="w-full p-2 bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={project.githubUrl}
                      onChange={(e) => updateProject(index, 'githubUrl', e.target.value)}
                      placeholder="GitHub URL"
                      className="w-full p-2 bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                ) : (
                  <div className="flex space-x-3">
                    <a
                      href={project.liveUrl}
                      className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex-1"
                    >
                      Live Demo
                    </a>
                    <a
                      href={project.githubUrl}
                      className="inline-flex items-center justify-center px-4 py-2 bg-transparent text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex-1"
                    >
                      View Code
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          {isEditing ? (
            <input
              type="text"
              value={displayData.viewAllButton}
              onChange={(e) => updateSection('viewAllButton', e.target.value)}
              className="inline-flex items-center px-6 py-3 bg-yellow-400 text-gray-900 rounded-lg bg-white/80 border-2 border-dashed border-blue-300 focus:border-blue-500 focus:outline-none text-center"
            />
          ) : (
            <a
              href="#contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 transition-colors"
            >
              {displayData.viewAllButton}
            </a>
          )}
        </motion.div>
      </div>
    </section>
  );
}