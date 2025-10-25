import { Edit2, Loader2, Save, Upload, X } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { AnimatedButton } from "./AnimatedButton";
import { ImageWithFallback } from "./figma/ImageWithFallback";

// Standardized Button component
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

interface AboutData {
  heading: string;
  subtitle: string;
  description1: string;
  description2: string;
  skills: string[];
  imageSrc: string;
  buttonText?: string;
}

interface AboutProps {
  aboutData?: AboutData;
  onStateChange?: (data: AboutData) => void;
  userId?: string;
  professionalId?: string;
  templateSelection?: string;
}

export function About({
  aboutData,
  onStateChange,
  userId,
  professionalId,
  templateSelection,
}: AboutProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const aboutRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pending image file for S3 upload
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);

  // Initialize with props data or empty structure
  const [data, setData] = useState<AboutData>(aboutData || {
    heading: "",
    subtitle: "",
    description1: "",
    description2: "",
    skills: [''],
    imageSrc: "",
    buttonText: ""
  });
  const [tempData, setTempData] = useState<AboutData>(aboutData || {
    heading: "",
    subtitle: "",
    description1: "",
    description2: "",
    skills: [''],
    imageSrc: "",
    buttonText: ""
  });

  // FIX: Use ref for onStateChange to prevent infinite loops
  const onStateChangeRef = useRef(onStateChange);
  useEffect(() => {
    onStateChangeRef.current = onStateChange;
  }, [onStateChange]);

  // FIX: Track previous data to avoid unnecessary updates
  const prevDataRef = useRef<AboutData>();

  // Sync with props data when it changes
  useEffect(() => {
    if (aboutData) {
      setData(aboutData);
      setTempData(aboutData);
    }
  }, [aboutData]);

  // FIX: Safe state change notification without infinite loop
  useEffect(() => {
    if (onStateChangeRef.current && prevDataRef.current !== data) {
      onStateChangeRef.current(data);
      prevDataRef.current = data;
    }
  }, [data]);

  // Intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (aboutRef.current) observer.observe(aboutRef.current);
    return () => {
      if (aboutRef.current) observer.unobserve(aboutRef.current);
    };
  }, []);

  // Calculate displayData based on editing state
  const displayData = isEditing ? tempData : data;

  const handleEdit = () => {
    setIsEditing(true);
    setTempData({ ...data });
    setPendingImageFile(null);
  };

  // Save function with S3 upload
  const handleSave = async () => {
    try {
      setIsUploading(true);

      // Create a copy of tempData to update with S3 URL
      let updatedData = { ...tempData };

      // Upload image if there's a pending file
      if (pendingImageFile) {
        if (!userId || !professionalId || !templateSelection) {
          toast.error('Missing user information. Please refresh and try again.');
          return;
        }

        const formData = new FormData();
        formData.append('file', pendingImageFile);
        formData.append('userId', userId);
        formData.append('fieldName', 'about_image');

        const uploadResponse = await fetch(`https://ow3v94b9gf.execute-api.ap-south-1.amazonaws.com/dev/`, {
          method: 'POST',
          body: formData,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          updatedData.imageSrc = uploadData.s3Url;
          console.log('About image uploaded to S3:', uploadData.s3Url);
        } else {
          const errorData = await uploadResponse.json();
          toast.error(`Image upload failed: ${errorData.message || 'Unknown error'}`);
          return;
        }
      }

      // Clear pending file
      setPendingImageFile(null);

      // Save the updated data with S3 URL
      setIsSaving(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update both states with the new URL
      setData(updatedData);
      setTempData(updatedData);

      setIsEditing(false);
      toast.success('About section saved successfully');

    } catch (error) {
      console.error('Error saving about section:', error);
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
      setTempData(prev => ({
        ...prev,
        imageSrc: e.target?.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  // Stable update functions with useCallback
  const updateTempContent = useCallback((field: keyof AboutData, value: string) => {
    setTempData(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateSkill = useCallback((index: number, value: string) => {
    setTempData(prevData => {
      const updatedSkills = [...prevData.skills];
      updatedSkills[index] = value;
      return { ...prevData, skills: updatedSkills };
    });
  }, []);

  const addSkill = useCallback(() => {
    setTempData(prevData => ({
      ...prevData,
      skills: [...prevData.skills, "New skill"]
    }));
  }, []);

  const removeSkill = useCallback((index: number) => {
    setTempData(prevData => {
      if (prevData.skills.length <= 1) {
        toast.error("You must have at least one skill");
        return prevData;
      }
      return {
        ...prevData,
        skills: prevData.skills.filter((_, i) => i !== index)
      };
    });
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
      isSkill = false,
      skillIndex,
    }: {
      value: string;
      field?: keyof AboutData;
      multiline?: boolean;
      className?: string;
      placeholder?: string;
      rows?: number;
      isSkill?: boolean;
      skillIndex?: number;
    }) => {
      const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        if (isSkill && skillIndex !== undefined) {
          updateSkill(skillIndex, newValue);
        } else if (field) {
          updateTempContent(field, newValue);
        }
      };

      const baseClasses = "w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none";

      if (multiline) {
        return (
          <textarea
            value={value}
            onChange={handleChange}
            className={`${baseClasses} p-2 resize-none ${className}`}
            placeholder={placeholder}
            rows={rows}
          />
        );
      }

      return (
        <input
          type='text'
          value={value}
          onChange={handleChange}
          className={`${baseClasses} p-1 ${className}`}
          placeholder={placeholder}
        />
      );
    };
  }, [updateTempContent, updateSkill]);

  // Check if there's any meaningful data to display
  const hasData = data.heading ||
    data.subtitle ||
    data.description1 ||
    data.description2 ||
    (data.skills.length > 0 && data.skills[0] !== '') ||
    data.imageSrc;

  // No data state - show empty state with option to add data
  if (!isEditing && !hasData) {
    return (
      <section ref={aboutRef} id="about" className="relative py-5 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Edit Controls */}
          <div className='text-right mb-8'>
            <Button
              onClick={handleEdit}
              size='sm'
              className='bg-red-500 hover:bg-red-600 text-white shadow-md'
            >
              <Edit2 className='w-4 h-4 mr-2' />
              Add About Content
            </Button>
          </div>

          {/* Empty State */}
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">👤</span>
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                No About Content Found
              </h3>
              <p className="text-muted-foreground mb-8">
                Tell your story and showcase your skills to help visitors get to know you better.
              </p>
              <Button
                onClick={handleEdit}
                size='lg'
                className='bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg'
              >
                <Edit2 className='w-5 h-5 mr-2' />
                Add About Content
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={aboutRef} id="about" className="relative py-5 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Edit Controls */}
        <div className='text-right z-50 mb-20'>
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
              {isEditing && (
                <Button
                  onClick={addSkill}
                  variant='outline'
                  size='sm'
                  className='bg-blue-50 hover:bg-blue-100 text-blue-700 shadow-md'
                >
                  Add Skill
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content - Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            {isEditing && (
              <div className="absolute top-2 right-2 z-10">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  size="sm"
                  variant="outline"
                  className="bg-white/90 backdrop-blur-sm shadow-md text-black hover:bg-gray-100"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Change Image
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                {pendingImageFile && (
                  <p className="text-xs text-orange-600 mt-1 bg-white p-1 rounded">
                    Image selected: {pendingImageFile.name}
                  </p>
                )}
              </div>
            )}

            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-yellow-400 rounded-3xl transform -rotate-6"></div>
              <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl">
                {displayData.imageSrc ? (
                  <img
                    src={displayData.imageSrc}
                    alt="About me"
                    className="w-full h-96 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23f3f4f6" width="400" height="400"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="18" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EProfile Image%3C/text%3E%3C/svg%3E';
                    }}
                  />
                ) : (
                  <div className="w-full h-96 flex items-center justify-center bg-gray-200">
                    <p className="text-gray-400 text-sm">No image uploaded</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6 relative"
          >
            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {isEditing ? (
                <div className="space-y-4">
                  <EditableText
                    value={displayData.heading}
                    field="heading"
                    className="text-3xl sm:text-4xl font-bold text-foreground"
                    placeholder="Main heading"
                  />
                  <EditableText
                    value={displayData.subtitle}
                    field="subtitle"
                    className="text-xl text-yellow-500 font-semibold"
                    placeholder="Subtitle"
                  />
                </div>
              ) : (
                <div>
                  {displayData.heading && (
                    <h2 className="text-3xl sm:text-4xl text-foreground font-bold">
                      {displayData.heading}
                    </h2>
                  )}
                  {displayData.subtitle && (
                    <p className="text-xl text-yellow-500 font-semibold mt-2">
                      {displayData.subtitle}
                    </p>
                  )}
                </div>
              )}
            </motion.div>

            {/* Description 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              {isEditing ? (
                <EditableText
                  value={displayData.description1}
                  field="description1"
                  multiline
                  className="text-lg text-muted-foreground leading-relaxed"
                  rows={3}
                  placeholder="First description paragraph"
                />
              ) : (
                displayData.description1 && (
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {displayData.description1}
                  </p>
                )
              )}
            </motion.div>

            {/* Description 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              {isEditing ? (
                <EditableText
                  value={displayData.description2}
                  field="description2"
                  multiline
                  className="text-lg text-muted-foreground leading-relaxed"
                  rows={3}
                  placeholder="Second description paragraph"
                />
              ) : (
                displayData.description2 && (
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {displayData.description2}
                  </p>
                )
              )}
            </motion.div>

            {/* Skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              {displayData.skills.map((skill, index) => (
                <div key={index} className="flex items-center space-x-3 group">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  {isEditing ? (
                    <div className="flex items-center gap-2 w-full">
                      <EditableText
                        value={skill}
                        isSkill
                        skillIndex={index}
                        className="text-gray-700 flex-1"
                        placeholder="Skill description"
                      />
                      <Button
                        onClick={() => removeSkill(index)}
                        size="sm"
                        variant="outline"
                        className="bg-red-50 hover:bg-red-100 text-red-700 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    skill && <span className="text-gray-700">{skill}</span>
                  )}
                </div>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              viewport={{ once: true }}
            >
              <AnimatedButton href="#contact" size="lg">
                {displayData.buttonText || "Let's Connect"}
              </AnimatedButton>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
