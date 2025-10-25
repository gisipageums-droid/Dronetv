import { Cloud, Code, Database, Edit2, Globe, Loader2, Plus, Save, Smartphone, Trash2, Upload, X, Zap } from 'lucide-react';
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
  variant?: 'outline' | 'default' | 'danger';
  size?: 'sm' | 'default';
  className?: string;
  disabled?: boolean;
  [key: string]: any;
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    outline: "border border-gray-300 bg-transparent hover:bg-gray-50",
    default: "bg-blue-600 text-white hover:bg-blue-700",
    danger: "bg-red-600 text-white hover:bg-red-700"
  };
  const sizes = {
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

interface Skill {
  id: string;
  icon?: any;
  iconUrl?: string;
  title: string;
  description: string;
  level: number;
}

interface SkillsData {
  skills: Skill[];
  header: {
    title: string;
    subtitle: string;
  };
}

// Remove the defaultData constant since we'll use dynamic data

interface SkillsProps {
  skillsData?: SkillsData;
  onStateChange?: (data: SkillsData) => void;
  userId?: string;
  professionalId?: string;
  templateSelection?: string;
}

export function Skills({ skillsData, onStateChange, userId, professionalId, templateSelection }: SkillsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const skillsRef = useRef<HTMLDivElement>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement>>({});

  // Pending icon files for S3 upload
  const [pendingIconFiles, setPendingIconFiles] = useState<Record<string, File>>({});

  // Initialize with skillsData or empty structure
  const [data, setData] = useState<SkillsData>(() =>
    skillsData || {
      skills: [],
      header: {
        title: "My Skills",
        subtitle: "A comprehensive set of technical skills and expertise built through years of hands-on experience and continuous learning."
      }
    }
  );

  const [tempData, setTempData] = useState<SkillsData>(() =>
    skillsData || {
      skills: [],
      header: {
        title: "My Skills",
        subtitle: "A comprehensive set of technical skills and expertise built through years of hands-on experience and continuous learning."
      }
    }
  );

  // Helper function to get icon component from string name
  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      Code, Database, Cloud, Smartphone, Globe, Zap, Cpu: Zap // Add Cpu with Zap as fallback
    };
    return iconMap[iconName] || Zap; // Fallback to Zap if icon not found
  };

  // Modified icon rendering logic
  const renderSkillIcon = (skill: Skill) => {
    // Priority 1: iconUrl (uploaded image)
    if (skill.iconUrl) {
      return (
        <ImageWithFallback
          src={skill.iconUrl}
          alt={skill.title}
          className="w-8 h-8 object-contain"
        />
      );
    }

    // Priority 2: icon (can be either component or string)
    if (skill.icon) {
      // If icon is a string (from backend), get the component
      if (typeof skill.icon === 'string') {
        const IconComponent = getIconComponent(skill.icon);
        return <IconComponent className="w-8 h-8 text-gray-900" />;
      }
      // If icon is already a component (default case)
      const IconComponent = skill.icon;
      return <IconComponent className="w-8 h-8 text-gray-900" />;
    }

    // Priority 3: fallback icon
    return <Zap className="w-8 h-8 text-gray-900" />;
  };

  // Notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(data);
    }
  }, [data]);

  // Update data when skillsData prop changes
  useEffect(() => {
    if (skillsData) {
      setData(skillsData);
      setTempData(skillsData);
      setDataLoaded(true);
    }
  }, [skillsData]);

  // Intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (skillsRef.current) observer.observe(skillsRef.current);
    return () => {
      if (skillsRef.current) observer.unobserve(skillsRef.current);
    };
  }, []);

  // Fake API fetch - simplified since we're using props
  const fetchSkillsData = async () => {
    if (skillsData) {
      // If skillsData is provided via props, use it directly
      setData(skillsData);
      setTempData(skillsData);
      setDataLoaded(true);
    } else {
      // Only show loading if no data is provided
      setIsLoading(true);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        // If no skillsData provided, keep the empty/default state
        setDataLoaded(true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (isVisible && !dataLoaded && !isLoading) {
      fetchSkillsData();
    }
  }, [isVisible, dataLoaded, isLoading, skillsData]);

  const handleEdit = () => {
    setIsEditing(true);
    setTempData({ ...data });
    setPendingIconFiles({}); // Clear pending files
  };

  // Save function with S3 upload
  const handleSave = async () => {
    try {
      setIsUploading(true);

      // Create a copy of tempData to update with S3 URLs
      let updatedData = { ...tempData };

      // Upload icon images for skills with pending files
      for (const [skillId, file] of Object.entries(pendingIconFiles)) {
        if (!userId || !professionalId || !templateSelection) {
          toast.error('Missing user information. Please refresh and try again.');
          return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', userId);
        formData.append('fieldName', `skill_icon_${skillId}`);

        const uploadResponse = await fetch(`https://ow3v94b9gf.execute-api.ap-south-1.amazonaws.com/dev/`, {
          method: 'POST',
          body: formData,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          // Update the skill icon with the S3 URL
          updatedData.skills = updatedData.skills.map(skill =>
            skill.id === skillId ? { ...skill, iconUrl: uploadData.s3Url, icon: undefined } : skill
          );
          console.log('Skill icon uploaded to S3:', uploadData.s3Url);
        } else {
          const errorData = await uploadResponse.json();
          toast.error(`Icon upload failed: ${errorData.message || 'Unknown error'}`);
          return;
        }
      }

      // Clear pending files
      setPendingIconFiles({});

      // Save the updated data with S3 URLs
      setIsSaving(true);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate save API call

      // Update both states with the new URLs
      setData(updatedData);
      setTempData(updatedData);

      setIsEditing(false);
      toast.success('Skills section saved with S3 URLs ready for publish');

    } catch (error) {
      console.error('Error saving skills section:', error);
      toast.error('Error saving changes. Please try again.');
    } finally {
      setIsUploading(false);
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTempData({ ...data });
    setPendingIconFiles({}); // Clear pending files
    setIsEditing(false);
  };

  // Icon upload handler with validation
  const handleIconUpload = (event: React.ChangeEvent<HTMLInputElement>, skillId: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB limit for icons
      toast.error('File size must be less than 2MB');
      return;
    }

    // Store the file for upload on Save
    setPendingIconFiles(prev => ({ ...prev, [skillId]: file }));

    // Show immediate local preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const updatedSkills = tempData.skills.map(skill =>
        skill.id === skillId ? { ...skill, iconUrl: e.target?.result as string, icon: undefined } : skill
      );
      setTempData({ ...tempData, skills: updatedSkills });
    };
    reader.readAsDataURL(file);
  };

  // Stable update functions with useCallback
  const updateSkill = useCallback((index: number, field: keyof Skill, value: any) => {
    const updatedSkills = [...tempData.skills];
    updatedSkills[index] = { ...updatedSkills[index], [field]: value };
    setTempData({ ...tempData, skills: updatedSkills });
  }, [tempData]);

  const updateHeader = useCallback((field: keyof SkillsData['header'], value: string) => {
    setTempData(prev => ({
      ...prev,
      header: { ...prev.header, [field]: value }
    }));
  }, []);

  const addSkill = useCallback(() => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      title: "New Skill",
      description: "Skill description",
      level: 50
    };
    setTempData({
      ...tempData,
      skills: [...tempData.skills, newSkill]
    });
  }, [tempData]);

  const removeSkill = useCallback((index: number) => {
    if (tempData.skills.length <= 1) {
      toast.error("You must have at least one skill");
      return;
    }

    const updatedSkills = tempData.skills.filter((_, i) => i !== index);
    setTempData({ ...tempData, skills: updatedSkills });
  }, [tempData]);

  const displayData = isEditing ? tempData : data;

  // Loading state - only show if we're actually loading and have no data
  if ((isLoading && !dataLoaded) || (!dataLoaded && displayData.skills.length === 0)) {
    return (
      <section ref={skillsRef} id="skills" className="py-5 bg-yellow-50 dark:bg-yellow-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-yellow-500" />
          <p className="text-muted-foreground mt-4">Loading skills data...</p>
        </div>
      </section>
    );
  }

  return (
    <section ref={skillsRef} id="skills" className="py-5 bg-yellow-50 dark:bg-yellow-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Edit Controls */}
        <div className='text-right mb-8'>
          {!isEditing ? (
            <Button
              onClick={handleEdit}
              size='sm'
              className='bg-red-500 hover:bg-red-600 shadow-md'
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
                variant='danger'
                size='sm'
                className='bg-red-600 hover:bg-red-700 text-white shadow-md'
                disabled={isSaving || isUploading}
              >
                <X className='w-4 h-4 mr-2' />
                Cancel
              </Button>
              <Button
                onClick={addSkill}
                variant='outline'
                size='sm'
                className='bg-blue-50 hover:bg-blue-100 text-blue-700 shadow-md'
              >
                <Plus className='w-4 h-4 mr-2' />
                Add Skill
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
                value={displayData.header.title}
                onChange={(e) => updateHeader('title', e.target.value)}
                className="text-3xl sm:text-4xl text-foreground mb-4 bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 text-center w-full max-w-md mx-auto"
              />
              <textarea
                value={displayData.header.subtitle}
                onChange={(e) => updateHeader('subtitle', e.target.value)}
                className="text-lg text-muted-foreground max-w-2xl mx-auto bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 w-full"
                rows={2}
              />
            </>
          ) : (
            <>
              <h2 className="text-3xl sm:text-4xl text-foreground mb-4">
                {displayData.header.title}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {displayData.header.subtitle}
              </p>
            </>
          )}
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayData.skills.map((skill, index) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 relative"
            >
              {isEditing && (
                <Button
                  onClick={() => removeSkill(index)}
                  size='sm'
                  variant='danger'
                  className='absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white p-1'
                >
                  <Trash2 className='w-3 h-3' />
                </Button>
              )}

              {/* Icon Upload/Display */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: isEditing ? 0 : 360 }}
                transition={{ duration: 0.5 }}
                className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mb-4 relative"
              >
                {isEditing && (
                  <Button
                    onClick={() => fileInputRefs.current[skill.id]?.click()}
                    size='sm'
                    className='absolute -top-1 -right-1 bg-white/90 backdrop-blur-sm shadow-md p-1'
                  >
                    <Upload className='w-3 h-3 text-black' />
                    <input
                      ref={el => fileInputRefs.current[skill.id] = el as HTMLInputElement}
                      type='file'
                      accept='image/*'
                      onChange={(e) => handleIconUpload(e, skill.id)}
                      className='hidden'
                    />
                  </Button>
                )}

                {pendingIconFiles[skill.id] && (
                  <p className='absolute -bottom-6 text-xs text-orange-600 bg-white p-1 rounded'>
                    Icon selected
                  </p>
                )}

                {/* Use the new render function */}
                {renderSkillIcon(skill)}
              </motion.div>

              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={skill.title}
                    onChange={(e) => updateSkill(index, 'title', e.target.value)}
                    className="text-xl text-foreground mb-2 bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1 w-full"
                  />
                  <textarea
                    value={skill.description}
                    onChange={(e) => updateSkill(index, 'description', e.target.value)}
                    className="text-muted-foreground mb-4 bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1 w-full"
                    rows={2}
                  />
                </>
              ) : (
                <>
                  <h3 className="text-xl text-foreground mb-2">{skill.title}</h3>
                  <p className="text-muted-foreground mb-4">{skill.description}</p>
                </>
              )}

              {/* Progress Bar */}
              <div className="relative">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Proficiency</span>
                  {isEditing ? (
                    <input
                      type="number"
                      value={skill.level}
                      onChange={(e) => updateSkill(index, 'level', parseInt(e.target.value))}
                      className="w-16 bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1 text-right"
                      min="0"
                      max="100"
                    />
                  ) : (
                    <span>{skill.level}%</span>
                  )}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-yellow-400 h-2 rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
