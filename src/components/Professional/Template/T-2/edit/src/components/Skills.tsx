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
      className={`${baseClasses} ${variants[variant || 'default']} ${
        sizes[size || 'default']
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

const defaultData: SkillsData = {
  skills: [
    {
      id: '1',
      icon: Code,
      title: 'Frontend Development',
      description: 'React, Vue.js, TypeScript, Tailwind CSS',
      level: 95
    },
    {
      id: '2',
      icon: Database,
      title: 'Backend Development',
      description: 'Node.js, Python, PostgreSQL, MongoDB',
      level: 90
    },
    {
      id: '3',
      icon: Cloud,
      title: 'Cloud & DevOps',
      description: 'AWS, Docker, Kubernetes, CI/CD',
      level: 85
    },
    {
      id: '4',
      icon: Smartphone,
      title: 'Mobile Development',
      description: 'React Native, Flutter, iOS/Android',
      level: 80
    },
    {
      id: '5',
      icon: Globe,
      title: 'Web Design',
      description: 'UI/UX, Figma, Adobe XD, Responsive Design',
      level: 88
    },
    {
      id: '6',
      icon: Zap,
      title: 'Performance',
      description: 'Optimization, SEO, Analytics, Testing',
      level: 92
    }
  ],
  header: {
    title: "My Skills",
    subtitle: "A comprehensive set of technical skills and expertise built through years of hands-on experience and continuous learning."
  }
};

interface SkillsProps {
  skillsData?: SkillsData;
  onStateChange?: (data: SkillsData) => void;
  userId?: string;
  publishedId?: string;
  templateSelection?: string;
}

export function Skills({ skillsData, onStateChange, userId, publishedId, templateSelection }: SkillsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const skillsRef = useRef<HTMLDivElement>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement>>({});
  
  // Pending icon files for S3 upload - SAME PATTERN AS HERO
  const [pendingIconFiles, setPendingIconFiles] = useState<Record<string, File>>({});

  const [data, setData] = useState<SkillsData>(defaultData);
  const [tempData, setTempData] = useState<SkillsData>(defaultData);

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
    if (skillsRef.current) observer.observe(skillsRef.current);
    return () => {
      if (skillsRef.current) observer.unobserve(skillsRef.current);
    };
  }, []);

  // Fake API fetch - SAME LOGIC AS HERO
  const fetchSkillsData = async () => {
    setIsLoading(true);
    try {
      const response = await new Promise<SkillsData>((resolve) =>
        setTimeout(() => resolve(skillsData || defaultData), 1200)
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
      fetchSkillsData();
    }
  }, [isVisible, dataLoaded, isLoading, skillsData]);

  const handleEdit = () => {
    setIsEditing(true);
    setTempData({ ...data });
    setPendingIconFiles({}); // Clear pending files - SAME AS HERO
  };

  // Save function with S3 upload - SAME PATTERN AS HERO
  const handleSave = async () => {
    try {
      setIsUploading(true);
      
      // Create a copy of tempData to update with S3 URLs
      let updatedData = { ...tempData };

      // Upload icon images for skills with pending files
      for (const [skillId, file] of Object.entries(pendingIconFiles)) {
        if (!userId || !publishedId || !templateSelection) {
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

      // Clear pending files - SAME AS HERO
      setPendingIconFiles({});

      // Save the updated data with S3 URLs
      setIsSaving(true);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate save API call
      
      // Update both states with the new URLs - SAME AS HERO
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
    setPendingIconFiles({}); // Clear pending files - SAME AS HERO
    setIsEditing(false);
  };

  // Icon upload handler with validation - SAME PATTERN AS HERO
  const handleIconUpload = (event: React.ChangeEvent<HTMLInputElement>, skillId: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type and size - SAME AS HERO
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB limit for icons
      toast.error('File size must be less than 2MB');
      return;
    }

    // Store the file for upload on Save - SAME PATTERN AS HERO
    setPendingIconFiles(prev => ({ ...prev, [skillId]: file }));

    // Show immediate local preview - SAME AS HERO
    const reader = new FileReader();
    reader.onload = (e) => {
      const updatedSkills = tempData.skills.map(skill =>
        skill.id === skillId ? { ...skill, iconUrl: e.target?.result as string, icon: undefined } : skill
      );
      setTempData({ ...tempData, skills: updatedSkills });
    };
    reader.readAsDataURL(file);
  };

  // Stable update functions with useCallback - SAME PATTERN AS HERO
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

  // Loading state - SAME PATTERN AS HERO
  if (isLoading || !displayData.skills || displayData.skills.length === 0) {
    return (
      <section ref={skillsRef} id="skills" className="py-20 bg-yellow-50 dark:bg-yellow-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-yellow-500" />
          <p className="text-muted-foreground mt-4">Loading skills data...</p>
        </div>
      </section>
    );
  }

  return (
    <section ref={skillsRef} id="skills" className="py-20 bg-yellow-50 dark:bg-yellow-900/20">
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
                
                {skill.iconUrl ? (
                  <ImageWithFallback
                    src={skill.iconUrl}
                    alt={skill.title}
                    className="w-8 h-8 object-contain"
                  />
                ) : skill.icon ? (
                  <skill.icon className="w-8 h-8 text-gray-900" />
                ) : (
                  <Zap className="w-8 h-8 text-gray-900" />
                )}
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