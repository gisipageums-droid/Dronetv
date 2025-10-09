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

// Define types for Hero data based on backend structure
interface CTAButton {
  variant: string;
  text: string;
  href: string;
}

interface HeroData {
  name: string;
  title: string;
  description: string;
  image: string;
  // Support both old structure (buttons) and new structure (ctaButtons)
  buttons?: {
    work: string;
    contact: string;
  };
  ctaButtons?: CTAButton[];
}

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
  
  // Helper function to transform backend data to component format
  const transformHeroData = useCallback((backendData: Partial<HeroData>): HeroData => {
    // Handle buttons transformation - convert ctaButtons array to buttons object
    let buttons = { work: "", contact: "" };
    
    if (backendData.ctaButtons && backendData.ctaButtons.length > 0) {
      // Use the first button for "work" and second for "contact" if available
      buttons = {
        work: backendData.ctaButtons[0]?.text || "",
        contact: backendData.ctaButtons[1]?.text || backendData.ctaButtons[0]?.text || ""
      };
    } else if (backendData.buttons) {
      // Fallback to existing buttons structure
      buttons = backendData.buttons;
    }
    
    return {
      name: backendData.name || "",
      title: backendData.title || "",
      description: backendData.description || "",
      image: backendData.image || "",
      
      buttons,
      // Keep original ctaButtons for saving back to backend if needed
      ctaButtons: backendData.ctaButtons
    };
  }, []);

  // Helper function to transform component data back to backend format
  const transformToBackendFormat = useCallback((componentData: HeroData): HeroData => {
    // If we had original ctaButtons structure, maintain it
    if (componentData.ctaButtons) {
      const updatedCtaButtons = [...componentData.ctaButtons];
      
      // Update the text of existing buttons
      if (updatedCtaButtons[0]) {
        updatedCtaButtons[0].text = componentData.buttons?.work || updatedCtaButtons[0].text;
      }
      if (updatedCtaButtons[1]) {
        updatedCtaButtons[1].text = componentData.buttons?.contact || updatedCtaButtons[1].text;
      }
      
      return {
        ...componentData,
        ctaButtons: updatedCtaButtons
      };
    }
    
    // If no ctaButtons existed, create them from buttons
    return {
      ...componentData,
      ctaButtons: [
        {
          variant: "primary",
          text: componentData.buttons?.work || "View Work",
          href: "#projects"
        },
        {
          variant: "secondary", 
          text: componentData.buttons?.contact || "Contact Me",
          href: "#contact"
        }
      ]
    };
  }, []);

  // Initialize with empty data structure
  const [data, setData] = useState<HeroData>({
    name: "",
    title: "",
    description: "",
    image: "",
    buttons: {
      work: "",
      contact: ""
    }
  });
  
  const [tempData, setTempData] = useState<HeroData>({
    name: "",
    title: "",
    description: "",
    image: "",
    buttons: {
      work: "",
      contact: ""
    }
  });

  // Data loading effect
  useEffect(() => {
    if (heroData) {
      const transformedData = transformHeroData(heroData);
      setData(transformedData);
      setTempData(transformedData);
      setDataLoaded(true);
      setIsLoading(false);
    } else if (!dataLoaded) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setDataLoaded(true);
        setIsLoading(false);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [heroData, dataLoaded, transformHeroData]);

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
        if (heroData) {
          const transformedData = transformHeroData(heroData);
          setData(transformedData);
          setTempData(transformedData);
        }
        setDataLoaded(true);
        setIsLoading(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, dataLoaded, isLoading, heroData, transformHeroData]);

  const handleEdit = () => {
    setIsEditing(true);
    setTempData({ ...data });
    setPendingImageFile(null);
  };

  // Save function
  const handleSave = async () => {
    try {
      setIsSaving(true);
      
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
          updatedData.image = uploadData.s3Url;
        } else {
          const errorData = await uploadResponse.json();
          toast.error(`Image upload failed: ${errorData.message || 'Unknown error'}`);
          setIsUploading(false);
          setIsSaving(false);
          return;
        }
      }

      // Transform data back to backend format before saving
      const backendData = transformToBackendFormat(updatedData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setData(updatedData);
      setTempData(updatedData);
      setPendingImageFile(null);
      setIsEditing(false);
      
      if (onStateChange) {
        onStateChange(backendData);
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

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setPendingImageFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setTempData((prev) => ({
        ...prev,
        image: e.target?.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  // Safe data accessor functions
  const getButtons = useCallback(() => {
    return {
      work: tempData?.buttons?.work || "",
      contact: tempData?.buttons?.contact || "",
    };
  }, [tempData]);

  const getStats = useCallback(() => {
    return {
      projects: tempData?.stats?.projects || "",
      experience: tempData?.stats?.experience || "",
      satisfaction: tempData?.stats?.satisfaction || "",
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
      className="min-h-screen flex items-center bg-gradient-to-br from-background to-yellow-50 dark:from-background dark:to-yellow-900/20 pt-20"
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
                    src={displayData.image}
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