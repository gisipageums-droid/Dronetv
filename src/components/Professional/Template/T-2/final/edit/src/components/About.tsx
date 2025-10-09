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
  publishedId?: string;
  templateSelection?: string;
}

export function About({
  aboutData,
  onStateChange,
  userId,
  publishedId,
  templateSelection,
}: AboutProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const aboutRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pending image file for S3 upload
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);

  // Default data structure matching the provided format
  const defaultData: AboutData = {
    heading: aboutData?.heading ||"",
    subtitle: aboutData?.subtitle || "",
    description1: aboutData?.description1 || "",
    description2: aboutData?.description2 || "",
    skills: aboutData?.skills || [''],
    imageSrc: aboutData?.imageSrc || "",
    buttonText: aboutData?.buttonText || ""
  };

  const [data, setData] = useState<AboutData>(defaultData);
  const [tempData, setTempData] = useState<AboutData>(defaultData);

  // Initialize with provided aboutData
  useEffect(() => {
    if (aboutData) {
      setData(aboutData);
      setTempData(aboutData);
      setDataLoaded(true);
    }
  }, [aboutData]);

  // Notify parent of state changes
  useEffect(() => {
    if (onStateChange && dataLoaded) {
      onStateChange(data);
    }
  }, [data, dataLoaded]);

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

  // Fake API fetch
  const fetchAboutData = async () => {
    setIsLoading(true);
    try {
      const response = await new Promise<AboutData>((resolve) =>
        setTimeout(() => resolve(aboutData || defaultData), 1200)
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
      fetchAboutData();
    }
  }, [isVisible, dataLoaded, isLoading, aboutData]);

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
        if (!userId || !publishedId || !templateSelection) {
          toast.error('Missing user information. Please refresh and try again.');
          return;
        }

        const formData = new FormData();
        formData.append('file', pendingImageFile);
        formData.append('userId', userId);
        formData.append('fieldName', 'imageSrc');

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
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate save API call

      // Update both states with the new URL
      setData(updatedData);
      setTempData(updatedData);

      setIsEditing(false);
      toast.success('About section saved with S3 URL ready for publish');

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
      setTempData((prev) => ({
        ...prev,
        imageSrc: e.target?.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  // Stable update functions with useCallback
  const updateTempContent = useCallback((field: keyof AboutData, value: string) => {
    setTempData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const updateSkill = useCallback((index: number, value: string) => {
    const updatedSkills = [...tempData.skills];
    updatedSkills[index] = value;
    setTempData(prev => ({ ...prev, skills: updatedSkills }));
  }, [tempData.skills]);

  const addSkill = useCallback(() => {
    setTempData(prev => ({
      ...prev,
      skills: [...prev.skills, "New skill"]
    }));
  }, []);

  const removeSkill = useCallback((index: number) => {
    if (tempData.skills.length <= 1) {
      toast.error("You must have at least one skill");
      return;
    }
    const updatedSkills = tempData.skills.filter((_, i) => i !== index);
    setTempData(prev => ({ ...prev, skills: updatedSkills }));
  }, [tempData.skills]);

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

  const displayData = isEditing ? tempData : data;

  // Loading state
  if (isLoading) {
    return (
      <section ref={aboutRef} id="about" className="relative py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-yellow-500" />
          <p className="text-muted-foreground mt-4">Loading about data...</p>
        </div>
      </section>
    );
  }

  return (
    <section ref={aboutRef} id="about" className="relative py-20 bg-background">
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
                className='bg-red-500 hover:bg-red-600 shadow-md'
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
                  className="bg-white/90 backdrop-blur-sm shadow-md"
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
                <ImageWithFallback
                  src={displayData.imageSrc}
                  alt="About me"
                  className="w-full h-96 object-cover"
                />
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
                  <h2 className="text-3xl sm:text-4xl text-foreground font-bold">
                    {displayData.heading}
                  </h2>
                  <p className="text-xl text-yellow-500 font-semibold mt-2">
                    {displayData.subtitle}
                  </p>
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
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {displayData.description1}
                </p>
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
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {displayData.description2}
                </p>
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
                    <span className="text-gray-700">{skill}</span>
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