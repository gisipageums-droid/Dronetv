import { Edit2, Loader2, Save, Upload, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

// Define types for Hero data
interface HeroData {
  name: string;
  title: string;
  description: string;
  imageUrl: string;
  stats: {
    projects: string;
    experience: string;
    satisfaction: string;
  };
  buttons: {
    work: string;
    contact: string;
  };
}

// Default data for Hero section
const defaultHeroData: HeroData = {
  name: "John Doe",
  title: "Full-Stack Developer",
  description: "A passionate Full-Stack Developer creating amazing digital experiences with modern technologies and innovative solutions.",
  imageUrl: "https://images.unsplash.com/photo-1634133472760-e5c2bd346787?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0JTIwZGV2ZWxvcGVyfGVufDF8fHx8MTc1NzQ4OTAwMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  stats: {
    projects: "50+",
    experience: "3+",
    satisfaction: "100%"
  },
  buttons: {
    work: "View My Work",
    contact: "Get In Touch"
  }
};

// Safe data merger function
const mergeHeroData = (incomingData?: Partial<HeroData>): HeroData => {
  if (!incomingData) {
    return defaultHeroData;
  }

  return {
    name: incomingData.name || defaultHeroData.name,
    title: incomingData.title || defaultHeroData.title,
    description: incomingData.description || defaultHeroData.description,
    imageUrl: incomingData.imageUrl || defaultHeroData.imageUrl,
    stats: {
      projects: incomingData.stats?.projects || defaultHeroData.stats.projects,
      experience: incomingData.stats?.experience || defaultHeroData.stats.experience,
      satisfaction: incomingData.stats?.satisfaction || defaultHeroData.stats.satisfaction,
    },
    buttons: {
      work: incomingData.buttons?.work || defaultHeroData.buttons.work,
      contact: incomingData.buttons?.contact || defaultHeroData.buttons.contact,
    }
  };
};

// Animation variants
const itemVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
};

const imageVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

// Props interface
interface HeroProps {
  heroData?: Partial<HeroData>;
  onStateChange?: (data: HeroData) => void;
  userId?: string;
  publishedId?: string;
  templateSelection?: string;
}

export function Hero({ heroData, onStateChange, userId, publishedId, templateSelection }: HeroProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  
  const heroRef = useRef<HTMLDivElement>(null);
  
  // Initialize with safe merged data
  const [data, setData] = useState<HeroData>(() => mergeHeroData(heroData));
  const [tempData, setTempData] = useState<HeroData>(() => mergeHeroData(heroData));

  // Improved data loading effect
  useEffect(() => {
    if (heroData) {
      const mergedData = mergeHeroData(heroData);
      setData(mergedData);
      setTempData(mergedData);
      setDataLoaded(true);
      setIsLoading(false);
    } else if (!dataLoaded) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setData(defaultHeroData);
        setTempData(defaultHeroData);
        setDataLoaded(true);
        setIsLoading(false);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [heroData, dataLoaded]);

  // Intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => {
      if (heroRef.current) observer.unobserve(heroRef.current);
    };
  }, []);

  // Trigger loading when component becomes visible
  useEffect(() => {
    if (isVisible && !dataLoaded && !isLoading) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        const mergedData = mergeHeroData(heroData);
        setData(mergedData);
        setTempData(mergedData);
        setDataLoaded(true);
        setIsLoading(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, dataLoaded, isLoading, heroData]);

  const handleEdit = () => {
    setIsEditing(true);
    setTempData({ ...data });
    setPendingImageFile(null);
  };

  // Fixed Save function with better error handling
  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Only set uploading state if there's actually a file to upload
      if (pendingImageFile) {
        setIsUploading(true);
      }

      let updatedData = { ...tempData };

      // Upload image only if there's a pending file
      if (pendingImageFile) {
        if (!userId || !publishedId || !templateSelection) {
          toast.error('Missing user information. Please refresh and try again.');
          setIsUploading(false);
          setIsSaving(false);
          return;
        }

        const formData = new FormData();
        formData.append('file', pendingImageFile);
        formData.append('userId', userId);
        formData.append('fieldName', 'heroImage');

        const uploadResponse = await fetch(`https://ow3v94b9gf.execute-api.ap-south-1.amazonaws.com/dev/`, {
          method: 'POST',
          body: formData,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          updatedData.imageUrl = uploadData.s3Url;
        } else {
          const errorData = await uploadResponse.json();
          toast.error(`Image upload failed: ${errorData.message || 'Unknown error'}`);
          setIsUploading(false);
          setIsSaving(false);
          return;
        }
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setData(updatedData);
      setTempData(updatedData);
      setPendingImageFile(null);
      setIsEditing(false);
      
      // Notify parent component of state change
      if (onStateChange) {
        onStateChange(updatedData);
      }
      
      toast.success(pendingImageFile 
        ? 'Hero section saved with new image!' 
        : 'Hero section updated successfully!');

    } catch (error) {
      console.error('Error saving hero section:', error);
      toast.error('Error saving changes. Please try again.');
    } finally {
      setIsUploading(false);
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTempData({ ...data });
    setPendingImageFile(null);
    setIsEditing(false);
  };

  // Image upload handler with validation
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('File size must be less than 5MB');
      return;
    }

    // Store the file for upload on Save
    setPendingImageFile(file);

    // Show immediate local preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setTempData((prev) => ({
        ...prev,
        imageUrl: e.target?.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  // Safe data accessor functions
  const getButtons = useCallback(() => {
    return {
      work: tempData?.buttons?.work || defaultHeroData.buttons.work,
      contact: tempData?.buttons?.contact || defaultHeroData.buttons.contact,
    };
  }, [tempData]);

  const getStats = useCallback(() => {
    return {
      projects: tempData?.stats?.projects || defaultHeroData.stats.projects,
      experience: tempData?.stats?.experience || defaultHeroData.stats.experience,
      satisfaction: tempData?.stats?.satisfaction || defaultHeroData.stats.satisfaction,
    };
  }, [tempData]);

  // Stable update functions with useCallback
  const updateTempContent = useCallback((field: keyof HeroData, value: string) => {
    setTempData((prev) => ({ 
      ...prev, 
      [field]: value 
    }));
  }, []);

  const updateStat = useCallback((stat: keyof HeroData['stats'], value: string) => {
    setTempData(prev => ({
      ...prev,
      stats: { 
        ...prev.stats, 
        [stat]: value 
      }
    }));
  }, []);

  const updateButton = useCallback((button: keyof HeroData['buttons'], value: string) => {
    setTempData(prev => ({
      ...prev,
      buttons: { 
        ...prev.buttons, 
        [button]: value 
      }
    }));
  }, []);

  // Memoized EditableText component
  const EditableText = useMemo(() => {
    return ({
      value,
      field,
      multiline = false,
      className = "",
      placeholder = "",
      rows = 3,
      statField,
      buttonField,
    }: {
      value: string;
      field?: keyof HeroData;
      multiline?: boolean;
      className?: string;
      placeholder?: string;
      rows?: number;
      statField?: keyof HeroData['stats'];
      buttonField?: keyof HeroData['buttons'];
    }) => {
      const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        if (statField) {
          updateStat(statField, newValue);
        } else if (buttonField) {
          updateButton(buttonField, newValue);
        } else if (field) {
          updateTempContent(field, newValue);
        }
      };

      const baseClasses = "w-full bg-white/10 backdrop-blur-sm border-2 border-dashed border-yellow-300 rounded focus:border-yellow-400 focus:outline-none text-white placeholder-gray-300";

      if (multiline) {
        return (
          <textarea
            value={value || ''}
            onChange={handleChange}
            className={`${baseClasses} p-3 resize-none ${className}`}
            placeholder={placeholder}
            rows={rows}
          />
        );
      }

      return (
        <input
          type='text'
          value={value || ''}
          onChange={handleChange}
          className={`${baseClasses} p-2 ${className}`}
          placeholder={placeholder}
        />
      );
    };
  }, [updateTempContent, updateStat, updateButton]);

  // Safe display data
  const displayData = isEditing ? tempData : data;
  const safeButtons = getButtons();
  const safeStats = getStats();

  if (isLoading) {
    return (
      <section 
        ref={heroRef}
        className="min-h-screen mt-[4rem] flex items-center justify-center bg-gradient-to-br from-background to-yellow-50 dark:from-background dark:to-yellow-900/20 pt-20"
      >
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-30">
          <div className='bg-white rounded-lg p-6 shadow-lg flex items-center gap-3'>
            <Loader2 className='w-5 h-5 animate-spin text-blue-600' />
            <span className='text-gray-700'>Loading content...</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      id="home" 
      ref={heroRef}
      className="min-h-screen mt-20 flex items-center bg-gradient-to-br from-background to-yellow-50 dark:from-background dark:to-yellow-900/20 pt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Edit Controls */}
        <div className='text-right mb-8'>
          {!isEditing ? (
            <Button
              onClick={handleEdit}
              size='sm'
              className='bg-red-400 hover:bg-red-600 shadow-md'
              disabled={isLoading}
            >
              <Edit2 className='w-4 h-4 mr-2 ' />
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
                className='bg-red-400 hover:bg-red-600 shadow-md'
                disabled={isSaving || isUploading}
              >
                <X className='w-4 h-4 mr-2' />
                Cancel
              </Button>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            className="space-y-8"
            initial='hidden'
            animate='visible'
            variants={itemVariants}
          >
            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-6xl text-foreground leading-tight"
              variants={itemVariants}
            >
              Hi, I'm{' '}
              {isEditing ? (
                <EditableText
                  value={displayData.name}
                  field='name'
                  className="text-yellow-500 p-1"
                  placeholder="Your name"
                />
              ) : (
                <span className="text-yellow-500">{displayData.name}</span>
              )}
            </motion.h1>

            <motion.div variants={itemVariants}>
              {isEditing ? (
                <EditableText
                  value={displayData.description}
                  field='description'
                  multiline
                  className="text-lg text-yellow-500 p-1"
                  placeholder="Your description"
                  rows={3}
                />
              ) : (
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {displayData.description}
                </p>
              )}
            </motion.div>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              variants={itemVariants}
            >
              {isEditing ? (
                <>
                  <EditableText
                    value={safeButtons.work}
                    buttonField='work'
                    className="px-6 py-3 rounded-lg text-yellow-500 text-center"
                    placeholder="Work button text"
                  />
                  <EditableText
                    value={safeButtons.contact}
                    buttonField='contact'
                    className="px-6 py-3 text-yellow-500 rounded-lg text-center"
                    placeholder="Contact button text"
                  />
                </>
              ) : (
                <>
                  <a
                    href="#projects"
                    className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {safeButtons.work}
                  </a>
                  <a
                    href="#contact"
                    className="inline-flex items-center justify-center px-6 py-3 bg-transparent text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    {safeButtons.contact}
                  </a>
                </>
              )}
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="grid grid-cols-3 gap-8 pt-8"
              variants={itemVariants}
            >
              {(['projects', 'experience', 'satisfaction'] as const).map((stat, index) => (
                <div key={index} className="text-center">
                  {isEditing ? (
                    <EditableText
                      value={safeStats[stat]}
                      statField={stat}
                      className="text-3xl mb-2 p-1 w-16 text-center text-yellow-500 mx-auto"
                      placeholder="Value"
                    />
                  ) : (
                    <div className="text-3xl text-yellow-500 mb-2">
                      {safeStats[stat]}
                    </div>
                  )}
                  <p className="text-muted-foreground capitalize">
                    {stat === 'satisfaction' ? 'Client Satisfaction' :
                      stat === 'experience' ? 'Years Experience' :
                        stat}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - User Image */}
          <motion.div
            className="relative"
            initial='hidden'
            animate='visible'
            variants={imageVariants}
          >
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <motion.div
                className="absolute inset-0 bg-yellow-400 rounded-3xl transform rotate-6"
                whileHover={{ rotate: 8, scale: 1.02 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              ></motion.div>
              <motion.div
                className="relative bg-card rounded-3xl overflow-hidden shadow-2xl"
                whileHover={{
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  y: -5
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className="relative">
                  <img
                    src={displayData.imageUrl || defaultHeroData.imageUrl}
                    alt={`${displayData.name} - ${displayData.title}`}
                    className="w-full h-96 object-cover object-center transition-transform duration-300 hover:scale-110"
                  />
                  {isEditing && (
                    <label className='absolute bottom-2 right-2 bg-black/70 text-white p-2 rounded cursor-pointer hover:bg-black/90 transition-colors'>
                      <Upload className='w-4 h-4' />
                      <input
                        type='file'
                        accept='image/*'
                        className='hidden'
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                  {isEditing && pendingImageFile && (
                    <div className='absolute top-2 left-2 text-xs text-orange-300 bg-black/70 px-2 py-1 rounded'>
                      Pending upload: {pendingImageFile.name}
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Add default props
Hero.defaultProps = {
  heroData: undefined,
  onStateChange: undefined,
  userId: '',
  publishedId: '',
  templateSelection: '',
};