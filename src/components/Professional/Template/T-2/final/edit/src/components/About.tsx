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
  title: string;
  highlightedText: string;
  description1: string;
  description2: string;
  skills: string[];
  buttonText: string;
  imageUrl: string;
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

  // Pending image file for S3 upload - SAME PATTERN AS HERO
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);

  const defaultData = {
  title: "About",
  highlightedText: "Me",
  description1:aboutData.description1||
    "I'm a passionate full-stack developer with over 3 years of experience creating digital solutions that make a difference. I specialize in modern web technologies and love turning complex problems into simple, beautiful designs.",
  description2:aboutData.description2||
    "When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, or sharing my knowledge through technical writing and mentoring.",
  skills: aboutData.skills||[
    "Frontend: React, Vue.js, TypeScript",
    "Backend: Node.js, Python, PostgreSQL",
    "Cloud: AWS, Docker, Kubernetes",
  ],
  buttonText: "Let's Work Together",
  imageUrl:aboutData.imageSrc||
    "https://images.unsplash.com/photo-1695634621121-691d54259d37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBwb3J0Zm9saW8lMjBkZXNpZ258ZW58MXx8fHwxNzU3NDg4OTI1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
};


  const [data, setData] = useState<AboutData>(defaultData);
  const [tempData, setTempData] = useState<AboutData>(defaultData);

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
    if (aboutRef.current) observer.observe(aboutRef.current);
    return () => {
      if (aboutRef.current) observer.unobserve(aboutRef.current);
    };
  }, []);

  // Fake API fetch - SAME LOGIC AS HERO
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
    setPendingImageFile(null); // Clear pending file - SAME AS HERO
  };

  // Save function with S3 upload - SAME PATTERN AS HERO
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

      // Clear pending file - SAME AS HERO
      setPendingImageFile(null);

      // Save the updated data with S3 URL
      setIsSaving(true);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate save API call

      // Update both states with the new URL - SAME AS HERO
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
    setPendingImageFile(null); // Clear pending file - SAME AS HERO
    setIsEditing(false);
  };

  // Image upload handler with validation - SAME PATTERN AS HERO
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
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
    setPendingImageFile(file);

    // Show immediate local preview - SAME AS HERO
    const reader = new FileReader();
    reader.onload = (e) => {
      setTempData((prev) => ({
        ...prev,
        imageSrc: e.target?.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  // Stable update functions with useCallback - SAME PATTERN AS HERO
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

  // Memoized EditableText component - SAME PATTERN AS HERO
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
  // console.log("----------ii", displayData)

  // Loading state - SAME PATTERN AS HERO
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
      <div className="max-w-7xl mx-auto  px-4 sm:px-6 lg:px-8">
        {/* Edit Controls */}
        <div className='text-right z-50  mb-20'>
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
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl text-foreground"
            >
              {isEditing ? (
                <div className="flex items-center">
                  <EditableText
                    value={displayData.title}
                    field="title"
                    className="mr-2"
                    placeholder="Title"
                  />
                  <EditableText
                    value={displayData.highlightedText}
                    field="highlightedText"
                    className="mr-2"
                    placeholder="Title"
                  />
                </div>
              ) : (
                <>
                  {displayData.heading}<span className="text-yellow-500">{displayData.highlightedText}</span>
                </>
              )}
            </motion.h2>

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
                Let's Connect
              </AnimatedButton>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}