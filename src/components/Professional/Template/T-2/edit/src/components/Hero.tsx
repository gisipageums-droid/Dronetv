import { Edit2, Loader2, Save, Upload, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
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

// Props interface
interface HeroProps {
  heroData?: HeroData;
  onStateChange?: (data: HeroData) => void;
  userId?: string;
  publishedId?: string;
  templateSelection?: string;
}

export function Hero({ heroData, onStateChange, userId, publishedId, templateSelection }: HeroProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);

  const [data, setData] = useState<HeroData>(defaultHeroData);
  const [tempData, setTempData] = useState<HeroData>(defaultHeroData);

  // Load data from backend or props
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        if (heroData) {
          setData(heroData);
          setTempData(heroData);
        } else {
          // Fetch from backend API
          const response = await fetch(`/api/hero/${userId}/${publishedId}`);
          if (response.ok) {
            const backendData = await response.json();
            setData(backendData);
            setTempData(backendData);
          } else {
            // Use default data if fetch fails
            setData(defaultHeroData);
            setTempData(defaultHeroData);
          }
        }
      } catch (error) {
        console.error('Error loading hero data:', error);
        setData(defaultHeroData);
        setTempData(defaultHeroData);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [heroData, userId, publishedId]);

  const handleEdit = () => {
    setIsEditing(true);
    setTempData({ ...data });
    setPendingImageFile(null);
  };

  const handleSave = async () => {
    try {
      setIsUploading(true);

      // Create a copy of tempData to update with S3 URLs
      let updatedData = { ...tempData };

      // Upload image if there's a pending file
      if (pendingImageFile) {
        if (!userId || !publishedId || !templateSelection) {
          toast.error('Missing user information. Please refresh and try again.');
          return;
        }

        const formData = new FormData();
        formData.append('file', pendingImageFile);
        formData.append('sectionName', 'hero');
        formData.append('imageField', 'profileImage');
        formData.append('templateSelection', templateSelection);

        const uploadResponse = await fetch(`https://o66ziwsye5.execute-api.ap-south-1.amazonaws.com/prod/upload-image/${userId}/${publishedId}`, {
          method: 'POST',
          body: formData,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          updatedData.imageUrl = uploadData.imageUrl;
          console.log('Profile image uploaded to S3:', uploadData.imageUrl);
        } else {
          const errorData = await uploadResponse.json();
          toast.error(`Image upload failed: ${errorData.message || 'Unknown error'}`);
          return;
        }
      }

      // Clear pending file
      setPendingImageFile(null);

      // Save the updated data with S3 URLs
      setIsSaving(true);

      // Save to backend API
      const response = await fetch(`/api/hero/${userId}/${publishedId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: updatedData,
          templateSelection
        })
      });

      if (response.ok) {
        const savedData = await response.json();
        setData(savedData);
        if (onStateChange) {
          onStateChange(savedData);
        }
        setIsEditing(false);
        toast.success('Hero section saved successfully');
      } else {
        throw new Error('Failed to save data');
      }

    } catch (error) {
      console.error('Error saving hero data:', error);
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

  const updateField = (field: keyof HeroData, value: string) => {
    setTempData({ ...tempData, [field]: value });
  };

  const updateStat = (stat: keyof HeroData['stats'], value: string) => {
    setTempData({
      ...tempData,
      stats: { ...tempData.stats, [stat]: value }
    });
  };

  const updateButton = (button: keyof HeroData['buttons'], value: string) => {
    setTempData({
      ...tempData,
      buttons: { ...tempData.buttons, [button]: value }
    });
  };

  const displayData = isEditing ? tempData : data;

  if (isLoading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-yellow-50 dark:from-background dark:to-yellow-900/20 pt-20">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-yellow-500" />
          <p className="text-gray-600 mt-4">Loading hero data...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="home" className="min-h-screen flex items-center bg-gradient-to-br from-background to-yellow-50 dark:from-background dark:to-yellow-900/20 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
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
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl text-foreground leading-tight">
              Hi, I'm{' '}
              {isEditing ? (
                <input
                  type="text"
                  value={displayData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className="text-yellow-500 bg-transparent border-2 border-dashed border-yellow-300 rounded focus:border-yellow-500 focus:outline-none p-1"
                />
              ) : (
                <span className="text-yellow-500">{displayData.name}</span>
              )}
            </h1>

            {isEditing ? (
              <textarea
                value={displayData.description}
                onChange={(e) => updateField('description', e.target.value)}
                className="text-xl text-muted-foreground leading-relaxed w-full bg-transparent border-2 border-dashed border-gray-300 rounded focus:border-blue-500 focus:outline-none p-2"
                rows={3}
              />
            ) : (
              <p className="text-xl text-muted-foreground leading-relaxed">
                {displayData.description}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              {isEditing ? (
                <input
                  type="text"
                  value={displayData.buttons.work}
                  onChange={(e) => updateButton('work', e.target.value)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg border-2 border-dashed border-blue-300 focus:border-blue-500 focus:outline-none"
                />
              ) : (
                <a
                  href="#projects"
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {displayData.buttons.work}
                </a>
              )}

              {isEditing ? (
                <input
                  type="text"
                  value={displayData.buttons.contact}
                  onChange={(e) => updateButton('contact', e.target.value)}
                  className="px-6 py-3 bg-transparent text-blue-600 border border-blue-600 rounded-lg border-2 border-dashed border-blue-300 focus:border-blue-500 focus:outline-none"
                />
              ) : (
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center px-6 py-3 bg-transparent text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  {displayData.buttons.contact}
                </a>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              {['projects', 'experience', 'satisfaction'].map((stat, index) => (
                <div key={index} className="text-center">
                  {isEditing ? (
                    <input
                      type="text"
                      value={displayData.stats[stat as keyof HeroData['stats']]}
                      onChange={(e) => updateStat(stat as keyof HeroData['stats'], e.target.value)}
                      className="text-3xl text-yellow-500 mb-2 bg-transparent border-2 border-dashed border-yellow-300 rounded focus:border-yellow-500 focus:outline-none p-1 w-16 text-center"
                    />
                  ) : (
                    <div className="text-3xl text-yellow-500 mb-2">
                      {displayData.stats[stat as keyof HeroData['stats']]}
                    </div>
                  )}
                  <p className="text-muted-foreground capitalize">
                    {stat === 'satisfaction' ? 'Client Satisfaction' :
                      stat === 'experience' ? 'Years Experience' :
                        stat}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - User Image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {isEditing && (
              <div className='absolute top-4 right-4 z-10'>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  size="sm"
                  className="bg-black/40 hover:bg-black/60 text-white shadow-md backdrop-blur-sm"
                >
                  <Upload className="w-4 h-4 mr-2 text-white" />
                  Change Image
                </Button>

                <input
                  ref={fileInputRef}
                  type='file'
                  accept='image/*'
                  onChange={handleImageUpload}
                  className='hidden'
                />
                {pendingImageFile && (
                  <p className='text-xs text-orange-600 mt-1 bg-white p-1 rounded'>
                    Image selected: {pendingImageFile.name}
                  </p>
                )}
              </div>
            )}

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
                <img
                  src={displayData.imageUrl}
                  alt={`${displayData.name} - ${displayData.title}`}
                  className="w-full h-96 object-cover object-center transition-transform duration-300 hover:scale-110"
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}