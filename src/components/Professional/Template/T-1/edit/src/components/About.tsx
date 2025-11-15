import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Cropper from "react-easy-crop";
import {
  Award,
  Calendar,
  Users,
  Edit,
  Save,
  X,
  Crop,
  Check,
  ZoomIn,
  ZoomOut,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

export interface AboutContent {
  heading: string;
  subtitle: string;
  description1: string;
  description2: string;
  description3: string;
  imageSrc: string;
  skills: string[];
}

interface AboutProps {
  content: AboutContent;
  onSave?: (updated: AboutContent) => void;
  userId?: string | undefined;
}

const About: React.FC<AboutProps> = ({ content, onSave, userId }) => {
  const [aboutContent, setAboutContent] = useState<AboutContent>(content);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [skillsInput, setSkillsInput] = useState("");

  // Character limits
  const CHAR_LIMITS = {
    heading: 100,
    subtitle: 200,
    description1: 1000,
    description2: 500,
    description3: 200,
    skills: 500,
    stats: 10,
  };

  // Cropping states
  const [isCropping, setIsCropping] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string>("");
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);


  useEffect(() => {
    if (content) {
      setAboutContent(content);
    }
  }, [content]);

  useEffect(() => {
    if (isEditing) {
      setSkillsInput(aboutContent.skills.join(", "));
    }
  }, [isEditing, aboutContent.skills]);

  const getCharCountColor = (current: number, max: number) => {
    if (current >= max) return "text-red-500";
    if (current >= max * 0.9) return "text-yellow-500";
    return "text-gray-500";
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  const handleContentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setAboutContent((prev) => ({ ...prev, [name]: value }));
  };

  // Image cropping functions
  const getCroppedImage = async (): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const canvas = canvasRef.current;
      if (!canvas || !croppedAreaPixels || !imageToCrop) {
        reject(new Error("Missing canvas or crop data"));
        return;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }
      const outputWidth = 600;
      const outputHeight = 600;
      canvas.width = outputWidth;
      canvas.height = outputHeight;
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imageToCrop;
      img.onload = () => {
        const { x, y, width, height } = croppedAreaPixels as any;
        ctx.drawImage(
          img,
          x,
          y,
          width,
          height,
          0,
          0,
          outputWidth,
          outputHeight
        );
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Failed to create blob"));
          },
          "image/jpeg",
          0.95
        );
      };
    });
  };

  const handleCropConfirm = async () => {
    try {
      const croppedBlob = await getCroppedImage();
      const croppedFile = new File([croppedBlob], "cropped-about-image.jpg", {
        type: "image/jpeg",
      });

      // Convert to base64 for immediate preview
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setAboutContent((prev) => ({
            ...prev,
            imageSrc: reader.result as string,
          }));
        }
      };
      reader.readAsDataURL(croppedFile);

      setIsUploading(true);
      setIsCropping(false);
      setImageLoaded(false);

      // Upload cropped image
      const formData = new FormData();
      formData.append("file", croppedFile);
      formData.append("userId", userId!);
      formData.append("fieldName", "aboutImage");

      const uploadResponse = await fetch(
        `https://ow3v94b9gf.execute-api.ap-south-1.amazonaws.com/dev/`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (uploadResponse.ok) {
        const uploadData = await uploadResponse.json();
        setAboutContent((prev) => ({
          ...prev,
          imageSrc: uploadData.s3Url,
        }));
        toast.success("Image uploaded successfully!");
      } else {
        const errorData = await uploadResponse.json();
        toast.error(
          `Image upload failed: ${errorData.message || "Unknown error"}`
        );
      }

      setIsUploading(false);
    } catch (error) {
      console.error("Error cropping image:", error);
      toast.error("Failed to crop image");
      setIsCropping(false);
      setIsUploading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setImageToCrop(reader.result as string);
          setIsCropping(true);
          setZoom(1);
          setCrop({ x: 0, y: 0 });
          setImageLoaded(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 5));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.1));
  };

  const handleSave = () => {
    const skillsArray = skillsInput
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0);

    const updated = { ...aboutContent, skills: skillsArray };
    setAboutContent(updated);
    onSave?.(updated);
    setIsEditing(false);
    toast.success("About section updated successfully!");
  };

  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Section Header */}
          <motion.div
            variants={itemVariants}
            className="text-center mb-16 relative"
          >
            <div className="absolute top-0 right-0 px-4 py-2">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSave}
                    className="p-3 text-gray-900 dark:text-white bg-green-500 hover:bg-green-600 rounded-full transition-colors"
                    title="Save Changes"
                  >
                    <Save className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => {
                      setAboutContent(content);
                      setSkillsInput(content.skills.join(", "));
                      setIsEditing(false);
                      toast.info("Changes discarded");
                    }}
                    className="p-3 text-gray-900 dark:text-white bg-red-500 hover:bg-red-600 rounded-full transition-colors"
                    title="Cancel"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-3 text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full transition-colors"
                  title="Edit Section"
                >
                  <Edit className="w-6 h-6" />
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-2">
                <input
                  name="heading"
                  value={aboutContent.heading}
                  onChange={handleContentChange}
                  maxLength={CHAR_LIMITS.heading}
                  className="w-full bg-gray-100 dark:bg-gray-800 text-center text-4xl lg:text-5xl font-bold text-gray-600 dark:text-gray-400 max-w-3xl mx-auto rounded-lg p-2 resize-none border-2 focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none mb-4"
                />
                <div
                  className={`text-sm text-right ${getCharCountColor(
                    aboutContent.heading.length,
                    CHAR_LIMITS.heading
                  )}`}
                >
                  {aboutContent.heading.length}/{CHAR_LIMITS.heading}
                </div>
              </div>
            ) : (
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                <span className="text-gray-900 dark:text-white">
                  {aboutContent.heading.split(" ")[0]}
                </span>{" "}
                <span className="text-orange-500">
                  {aboutContent.heading.split(" ").slice(1).join(" ")}
                </span>
              </h2>
            )}

            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  name="subtitle"
                  value={aboutContent.subtitle}
                  onChange={handleContentChange}
                  maxLength={CHAR_LIMITS.subtitle}
                  className="w-full bg-gray-100 dark:bg-gray-800 text-center text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto rounded-lg p-2 resize-none border-2 focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none"
                  rows={2}
                />
                <div
                  className={`text-sm text-right ${getCharCountColor(
                    aboutContent.subtitle.length,
                    CHAR_LIMITS.subtitle
                  )}`}
                >
                  {aboutContent.subtitle.length}/{CHAR_LIMITS.subtitle}
                </div>
              </div>
            ) : (
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                {aboutContent.subtitle}
              </p>
            )}
          </motion.div>

          {/* Content + Image */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left - Image */}
            <motion.div variants={itemVariants} className="relative">
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={aboutContent.imageSrc}
                  alt="About me"
                  className="w-full h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-yellow-500/20"></div>
                {isEditing &&
                  (!isUploading ? (
                    <motion.label
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/40 text-white font-semibold text-lg"
                    >
                      <Upload className="w-10 h-10 mr-2" />
                      Click to change image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </motion.label>
                  ) : (
                    <div className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/40 text-white font-semibold text-lg">
                      Uploading...
                    </div>
                  ))}
              </div>
            </motion.div>

            {/* Right - Descriptions + Skills */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                {isEditing ? (
                  <>
                    <div className="space-y-1">
                      <textarea
                        name="description1"
                        value={aboutContent.description1}
                        onChange={handleContentChange}
                        maxLength={CHAR_LIMITS.description1}
                        className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg p-2 resize-none border-2 focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none"
                        rows={3}
                      />
                      <div
                        className={`text-sm text-right ${getCharCountColor(
                          aboutContent.description1.length,
                          CHAR_LIMITS.description1
                        )}`}
                      >
                        {aboutContent.description1.length}/
                        {CHAR_LIMITS.description1}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <textarea
                        name="description2"
                        value={aboutContent.description2}
                        onChange={handleContentChange}
                        maxLength={CHAR_LIMITS.description2}
                        className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg p-2 resize-none border-2 focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none"
                        rows={4}
                      />
                      <div
                        className={`text-sm text-right ${getCharCountColor(
                          aboutContent.description2.length,
                          CHAR_LIMITS.description2
                        )}`}
                      >
                        {aboutContent.description2.length}/
                        {CHAR_LIMITS.description2}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <textarea
                        name="description3"
                        value={aboutContent.description3}
                        onChange={handleContentChange}
                        maxLength={CHAR_LIMITS.description3}
                        className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg p-2 resize-none border-2 focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none"
                        rows={3}
                      />
                      <div
                        className={`text-sm text-right ${getCharCountColor(
                          aboutContent.description3.length,
                          CHAR_LIMITS.description3
                        )}`}
                      >
                        {aboutContent.description3.length}/
                        {CHAR_LIMITS.description3}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <p>{aboutContent.description1}</p>
                    <p>{aboutContent.description2}</p>
                    <p>{aboutContent.description3}</p>
                  </>
                )}
              </div>

              {/* Skills */}
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Core Expertise
                </h4>
                {isEditing ? (
                  <div className="space-y-1">
                    <input
                      type="text"
                      value={skillsInput}
                      onChange={(e) => setSkillsInput(e.target.value)}
                      maxLength={CHAR_LIMITS.skills}
                      className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg p-2 border-2 focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none"
                    />
                    <div
                      className={`text-sm text-right ${getCharCountColor(
                        skillsInput.length,
                        CHAR_LIMITS.skills
                      )}`}
                    >
                      {skillsInput.length}/{CHAR_LIMITS.skills}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {aboutContent.skills.length > 0 ? (
                      aboutContent.skills.map((skill, index) => (
                        <motion.span
                          key={index}
                          whileHover={{ scale: 1.05 }}
                          className="px-4 py-2 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-orange-500/30 rounded-full text-orange-500 font-medium"
                        >
                          {skill}
                        </motion.span>
                      ))
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 italic">
                        No skills specified
                      </p>
                    )}
                  </div>
                )}

                {isEditing && (
                  <p className="text-center text-xs rounded-lg text-gray-400">
                    Data should be separated by commas (e.g., data1, data2,
                    data3)
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Image Cropping Modal */}
      {isCropping && (
        <div className="fixed inset-0 bg-black/90 z-[9999999] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl">
            <div className="flex justify-between items-center px-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Crop className="w-6 h-6" />
                Crop Image
              </h3>
              <button
                onClick={() => setIsCropping(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-900 dark:text-white" />
              </button>
            </div>

            <div className="p-6">
              <div
                className={`relative h-96 bg-gray-900 rounded-lg overflow-hidden mb-6 ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
              >
                <Cropper
                  image={imageToCrop}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="rect"
                  showGrid={true}
                  minZoom={0.1}
                  maxZoom={5}
                  restrictPosition={false}
                  zoomWithScroll={true}
                  zoomSpeed={0.2}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={(_c, p) => setCroppedAreaPixels(p)}
                  onMediaLoaded={() => setImageLoaded(true)}
                  onInteractionStart={() => setIsDragging(true)}
                  onInteractionEnd={() => setIsDragging(false)}
                />
              </div>

              <div className="space-y-2">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-white">
                      Zoom
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={handleZoomOut}
                        className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                      >
                        <ZoomOut className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleZoomIn}
                        className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <input
                    type="range"
                    min={0.1}
                    max={5}
                    step={0.01}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>


              </div>
            </div>

            <div className="flex gap-3 justify-end px-1 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setIsCropping(false)}
                className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCropConfirm}
                disabled={!imageLoaded}
                className="px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="w-5 h-5" />
                Crop & Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden canvas for cropping */}
      <canvas ref={canvasRef} className="hidden" />
    </section>
  );
};

export default About;
