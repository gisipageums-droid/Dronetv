import { Edit2, Loader2, Save, Upload, X } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { AnimatedButton } from "./AnimatedButton";
import { ImageWithFallback } from "./figma/ImageWithFallback";

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
  variant?: "outline" | "default" | "danger";
  size?: "sm" | "default";
  className?: string;
  disabled?: boolean;
  [key: string]: any;
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    outline: "border border-gray-400 text-gray-800 bg-white hover:bg-gray-100",
    default: "bg-blue-600 text-white hover:bg-blue-700",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };
  const sizes = {
    sm: "h-8 px-3 text-sm",
    default: "h-10 px-4",
  };

  return (
    <button
      className={`${baseClasses} ${
        variants[variant || "default"]
      } ${sizes[size || "default"]} ${className || ""}`}
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

const defaultData: AboutData = {
  title: "About",
  highlightedText: "Me",
  description1:
    "I'm a passionate full-stack developer with over 3 years of experience creating digital solutions that make a difference. I specialize in modern web technologies and love turning complex problems into simple, beautiful designs.",
  description2:
    "When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, or sharing my knowledge through technical writing and mentoring.",
  skills: [
    "Frontend: React, Vue.js, TypeScript",
    "Backend: Node.js, Python, PostgreSQL",
    "Cloud: AWS, Docker, Kubernetes",
  ],
  buttonText: "Let's Work Together",
  imageUrl:
    "https://images.unsplash.com/photo-1695634621121-691d54259d37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBwb3J0Zm9saW8lMjBkZXNpZ258ZW58MXx8fHwxNzU3NDg4OTI1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
};

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
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);

  const [data, setData] = useState<AboutData>(aboutData || defaultData);
  const [tempData, setTempData] = useState<AboutData>(
    aboutData || defaultData
  );

  const handleEdit = () => {
    setIsEditing(true);
    setTempData({ ...data });
    setPendingImageFile(null);
  };

  const handleSave = async () => {
    try {
      setIsUploading(true);
      let updatedData = { ...tempData };

      if (pendingImageFile) {
        if (!userId || !publishedId || !templateSelection) {
          toast.error(
            "Missing user information. Please refresh and try again."
          );
          return;
        }

        const formData = new FormData();
        formData.append("file", pendingImageFile);
        formData.append("sectionName", "about");
        formData.append("imageField", "imageUrl");
        formData.append("templateSelection", templateSelection);

        const uploadResponse = await fetch(
          `https://o66ziwsye5.execute-api.ap-south-1.amazonaws.com/prod/upload-image/${userId}/${publishedId}`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          updatedData.imageUrl = uploadData.imageUrl;
        } else {
          const errorData = await uploadResponse.json();
          toast.error(
            `Image upload failed: ${errorData.message || "Unknown error"}`
          );
          return;
        }
      }

      setPendingImageFile(null);
      setIsSaving(true);

      const response = await fetch(`/api/about/${userId}/${publishedId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: updatedData,
          templateSelection,
        }),
      });

      if (response.ok) {
        const savedData = await response.json();
        setData(savedData);
        if (onStateChange) onStateChange(savedData);
        setIsEditing(false);
        toast.success("About section saved successfully");
      } else {
        throw new Error("Failed to save data");
      }
    } catch (error) {
      toast.error("Error saving changes. Please try again.");
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

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setPendingImageFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setTempData((prev) => ({
        ...prev,
        imageUrl: e.target?.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const updateTempContent = (field: keyof AboutData, value: string) => {
    setTempData((prev) => ({ ...prev, [field]: value }));
  };

  const updateSkill = (index: number, value: string) => {
    const updatedSkills = [...tempData.skills];
    updatedSkills[index] = value;
    setTempData({ ...tempData, skills: updatedSkills });
  };

  const displayData = isEditing ? tempData : data;

  return (
    <section id="about" className="relative py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  src={displayData.imageUrl}
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
            {/* Edit Controls inside right column */}
            <div className="absolute top-0 right-0">
              {!isEditing ? (
                <Button
                  onClick={handleEdit}
                  size="sm"
                  className="bg-red-500 hover:bg-red-600 text-white shadow-md"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={handleSave}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white shadow-md"
                    disabled={isSaving || isUploading}
                  >
                    {isSaving || isUploading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    {isUploading
                      ? "Uploading..."
                      : isSaving
                      ? "Saving..."
                      : "Save"}
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="danger"
                    size="sm"
                    className="shadow-md"
                    disabled={isSaving || isUploading}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>

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
                  <input
                    type="text"
                    value={displayData.title}
                    onChange={(e) =>
                      updateTempContent("title", e.target.value)
                    }
                    className="bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1 mr-2"
                  />
                  <span className="text-yellow-500">
                    <input
                      type="text"
                      value={displayData.highlightedText}
                      onChange={(e) =>
                        updateTempContent("highlightedText", e.target.value)
                      }
                      className="bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1 text-yellow-500"
                    />
                  </span>
                </div>
              ) : (
                <>
                  {displayData.title}{" "}
                  <span className="text-yellow-500">
                    {displayData.highlightedText}
                  </span>
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
                <textarea
                  value={displayData.description1}
                  onChange={(e) =>
                    updateTempContent("description1", e.target.value)
                  }
                  className="w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 text-lg text-muted-foreground leading-relaxed"
                  rows={3}
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
                <textarea
                  value={displayData.description2}
                  onChange={(e) =>
                    updateTempContent("description2", e.target.value)
                  }
                  className="w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 text-lg text-muted-foreground leading-relaxed"
                  rows={3}
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
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) => updateSkill(index, e.target.value)}
                      className="w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1 text-gray-700"
                    />
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
              {isEditing ? (
                <input
                  type="text"
                  value={displayData.buttonText}
                  onChange={(e) =>
                    updateTempContent("buttonText", e.target.value)
                  }
                  className="bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1 mb-2"
                />
              ) : null}
              <AnimatedButton href="#contact" size="lg">
                {displayData.buttonText}
              </AnimatedButton>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}