import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import {
  CheckCircle,
  Eye,
  Target,
  Rocket,
  Globe,
  Users,
  Heart,
  Shield,
  Lightbulb,
  X,
  ZoomIn,
} from "lucide-react";
import { toast } from "react-toastify";
import Cropper from "react-easy-crop";

export default function About({
  aboutData,
  onStateChange,
  userId,
  publishedId,
  templateSelection,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [pendingImageFile, setPendingImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Cropping states
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);

  // Map the emoji icons to Lucide React components
  const iconMap = {
    "🛡️": Shield,
    "💡": Lightbulb,
    "🎯": Target,
    // Add more mappings as needed
  };

  // Consolidated state
  const [aboutState, setAboutState] = useState({
    aboutTitle: "About Our Company",
    description1:
      aboutData?.description1 ||
      "We are a forward-thinking company dedicated to helping businesses achieve their full potential through innovative solutions and strategic partnerships.",
    description2:
      aboutData?.description2 ||
      "Founded with the vision of transforming how companies operate in the digital age, we combine cutting-edge technology with deep industry expertise to deliver exceptional results for our clients.",
    features: [
      "10+ years of industry experience",
      "Award-winning team of experts",
      "Proven track record of success",
      "Customer-first approach",
    ],
    metric1Num: "5+",
    metric1Label: "Years Experience",
    metric2Num: "20+",
    metric2Label: "Projects Completed",
    visionBadge: "Our Vision",
    visionTitle: "Shaping the Future Together",
    visionDesc:
      aboutData?.vision ||
      "We envision a world where technology and human ingenuity combine to create sustainable solutions that empower businesses to thrive while making a positive impact on society and the environment.",
    visionPillars: aboutData?.visionPillars
      ? aboutData.visionPillars.map((pillar) => ({
          ...pillar,
          icon: iconMap[pillar.icon] || Globe, // Fallback to Globe if icon not found
        }))
      : [
          {
            icon: Globe,
            title: "Global Impact",
            description:
              "Expanding our reach to serve clients across continents while maintaining our commitment to excellence.",
          },
          {
            icon: Users,
            title: "Community Building",
            description:
              "Creating ecosystems where businesses thrive together through collaboration and shared growth.",
          },
          {
            icon: Rocket,
            title: "Innovation First",
            description:
              "Continuously pushing boundaries with cutting-edge technologies and forward-thinking strategies.",
          },
          {
            icon: Heart,
            title: "Sustainable Growth",
            description:
              "Balancing profitability with social responsibility and environmental consciousness.",
          },
        ],
    missionTitle: "Our Mission",
    missionDesc:
      aboutData?.mission ||
      "To empower businesses of all sizes with innovative solutions that drive growth, foster sustainability, and create lasting value for stakeholders, communities, and the world at large.",
    imageUrl:
      "https://images.unsplash.com/photo-1748346918817-0b1b6b2f9bab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBvZmZpY2UlMjBzcGFjZSUyMG1vZGVybnxlbnwxfHx8fDE3NTU2MTgzNjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  });

  // Add this useEffect to notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(aboutState);
    }
  }, [aboutState, onStateChange]);

  // Update function for simple fields
  const updateField = (field, value) => {
    setAboutState((prev) => ({ ...prev, [field]: value }));
  };

  // Update function for features
  const updateFeature = (index, value) => {
    setAboutState((prev) => ({
      ...prev,
      features: prev.features.map((f, i) => (i === index ? value : f)),
    }));
  };

  // Add a new feature
  const addFeature = () => {
    setAboutState((prev) => ({
      ...prev,
      features: [...prev.features, "New Feature"],
    }));
  };

  // Update function for vision pillars
  const updatePillar = (index, field, value) => {
    setAboutState((prev) => ({
      ...prev,
      visionPillars: prev.visionPillars.map((p, i) =>
        i === index ? { ...p, [field]: value } : p
      ),
    }));
  };

  // Image selection handler - now opens cropper
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageToCrop(reader.result);
      setOriginalFile(file);
      setShowCropper(true);
      setZoom(1);
      setCrop({ x: 0, y: 0 });
    };
    reader.readAsDataURL(file);

    // Clear the file input
    e.target.value = "";
  };

  // Cropper functions
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Helper function to create image element
  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  // Function to get cropped image
  const getCroppedImg = async (imageSrc, pixelCrop) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Set canvas size to the desired crop size
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    // Draw the cropped image
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          const fileName = originalFile
            ? `cropped-${originalFile.name}`
            : `cropped-about-${Date.now()}.jpg`;

          const file = new File([blob], fileName, {
            type: "image/jpeg",
            lastModified: Date.now(),
          });

          const previewUrl = URL.createObjectURL(blob);

          resolve({
            file,
            previewUrl,
          });
        },
        "image/jpeg",
        0.95
      );
    });
  };

  // Apply crop and set pending file
  const applyCrop = async () => {
    try {
      if (!imageToCrop || !croppedAreaPixels) {
        toast.error("Please select an area to crop");
        return;
      }

      const { file, previewUrl } = await getCroppedImg(
        imageToCrop,
        croppedAreaPixels
      );

      // Update preview immediately with blob URL (temporary)
      updateField("imageUrl", previewUrl);

      // Set the actual file for upload on save
      setPendingImageFile(file);
      console.log("About image cropped, file ready for upload:", file);

      toast.success("Image cropped successfully! Click Save to upload to S3.");
      setShowCropper(false);
      setImageToCrop(null);
      setOriginalFile(null);
    } catch (error) {
      console.error("Error cropping image:", error);
      toast.error("Error cropping image. Please try again.");
    }
  };

  // Cancel cropping
  const cancelCrop = () => {
    setShowCropper(false);
    setImageToCrop(null);
    setOriginalFile(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  // Reset zoom and rotation
  const resetCropSettings = () => {
    setZoom(1);
    setCrop({ x: 0, y: 0 });
  };

  // Updated Save button handler - uploads cropped image to S3
  const handleSave = async () => {
    try {
      setIsUploading(true);

      // If there's a pending image, upload it first
      if (pendingImageFile) {
        if (!userId || !publishedId || !templateSelection) {
          console.error("Missing required props:", {
            userId,
            publishedId,
            templateSelection,
          });
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
          // Replace local preview with S3 URL
          updateField("imageUrl", uploadData.imageUrl);
          setPendingImageFile(null); // Clear pending file
          console.log("Image uploaded to S3:", uploadData.imageUrl);
        } else {
          const errorData = await uploadResponse.json();
          console.error("Image upload failed:", errorData);
          toast.error(
            `Image upload failed: ${errorData.message || "Unknown error"}`
          );
          return; // Don't exit edit mode
        }
      }

      // Exit edit mode
      setIsEditing(false);
      toast.success("About section saved with S3 URLs ready for publish");
    } catch (error) {
      console.error("Error saving about section:", error);
      toast.error("Error saving changes. Please try again.");
      // Keep in edit mode so user can retry
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      {/* Image Cropper Modal */}
      {showCropper && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/90 z-[99999999] flex items-center justify-center p-2 sm:p-3"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl max-w-4xl w-full max-h-[86vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-2 sm:p-3 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="text-base font-semibold text-gray-800">
                Crop Image
              </h3>
              <button
                onClick={cancelCrop}
                className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Cropper Area */}
            <div className="flex-1 relative bg-gray-900">
              <div className="relative w-full h-[44vh] sm:h-[50vh] md:h-[56vh] lg:h-[60vh]">
                <Cropper
                  image={imageToCrop || undefined}
                  crop={crop}
                  zoom={zoom}
                  aspect={4 / 3}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                  showGrid={false}
                  cropShape="rect"
                  style={{
                    containerStyle: {
                      position: "relative",
                      width: "100%",
                      height: "100%",
                    },
                    cropAreaStyle: {
                      border: "2px solid white",
                      borderRadius: "8px",
                    },
                  }}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="p-2 sm:p-3 bg-gray-50 border-t border-gray-200">
              <div className="grid grid-cols-1 gap-2">
                {/* Zoom */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-gray-700">
                      <ZoomIn className="w-4 h-4" /> Zoom
                    </span>
                    <span className="text-gray-600">{zoom.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:h-3.5
              [&::-webkit-slider-thumb]:w-3.5
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-blue-500"
                  />
                </div>

                {/* Rotation removed - use zoom + crop only */}
              </div>

              {/* Buttons - Equal Width Responsive */}
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={resetCropSettings}
                  className="w-full border border-gray-300 text-gray-700 hover:bg-gray-100 rounded py-1.5 text-sm"
                >
                  Reset
                </button>

                <button
                  onClick={cancelCrop}
                  className="w-full border border-gray-300 text-gray-700 hover:bg-gray-100 rounded py-1.5 text-sm"
                >
                  Cancel
                </button>

                <button
                  onClick={applyCrop}
                  className="w-full bg-green-600 hover:bg-green-700 text-white rounded py-1.5 text-sm"
                >
                  Apply Crop
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      <section id="about" className="py-20 bg-secondary theme-transition">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Edit / Save */}
          <div className="flex justify-end mt-6">
            {isEditing ? (
              <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ y: -1, scaleX: 1.1 }}
                onClick={handleSave}
                disabled={isUploading}
                className={`${
                  isUploading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:shadow-2xl"
                } text-white px-4 py-2 rounded shadow-xl hover:font-semibold`}
              >
                {isUploading ? "Uploading..." : "Save"}
              </motion.button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ y: -1, scaleX: 1.1 }}
                onClick={() => setIsEditing(true)}
                className="bg-yellow-500 text-black px-4 py-2 rounded cursor-pointer  hover:shadow-2xl shadow-xl hover:font-semibold"
              >
                Edit
              </motion.button>
            )}
          </div>

          {/* Main About Section */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Image */}
            <motion.div
              className="relative rounded-2xl overflow-hidden shadow-xl"
              whileInView={{ opacity: [0, 1], x: [-50, 0] }}
              transition={{ duration: 0.8 }}
            >
              <img
                src={aboutState.imageUrl}
                alt="About"
                className="w-full h-[400px] object-cover"
              />
              {isEditing && (
                <div className="absolute bottom-4 left-4 bg-white/80 p-2 rounded shadow">
                  <p className="text-sm mb-1">Change About Image:</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="text-sm border-2 border-dashed border-muted-foreground p-2 rounded w-full"
                  />
                  {pendingImageFile && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ Image cropped and ready to upload
                    </p>
                  )}
                </div>
              )}
            </motion.div>

            {/* Content */}
            <div className="space-y-8">
              <motion.div
                className="space-y-4"
                whileInView={{ opacity: [0, 1], x: [50, 0] }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {isEditing ? (
                  <input
                    value={aboutState.aboutTitle}
                    onChange={(e) => updateField("aboutTitle", e.target.value)}
                    className="bg-transparent border-b border-primary text-3xl md:text-4xl text-foreground outline-none"
                  />
                ) : (
                  <h2 className="text-3xl md:text-4xl text-foreground">
                    {aboutState.aboutTitle}
                  </h2>
                )}
                {isEditing ? (
                  <textarea
                    value={aboutState.description1}
                    onChange={(e) =>
                      updateField("description1", e.target.value)
                    }
                    className="w-full bg-transparent border-b border-muted-foreground text-lg text-muted-foreground outline-none"
                  />
                ) : (
                  <p className="text-lg text-muted-foreground">
                    {aboutState.description1}
                  </p>
                )}
                {isEditing ? (
                  <textarea
                    value={aboutState.description2}
                    onChange={(e) =>
                      updateField("description2", e.target.value)
                    }
                    className="w-full bg-transparent border-b border-muted-foreground text-muted-foreground outline-none"
                  />
                ) : (
                  <p className="text-muted-foreground">
                    {aboutState.description2}
                  </p>
                )}
              </motion.div>

              {/* Features list */}
              <motion.div
                whileInView={{ opacity: [0, 1], x: [-50, 0] }}
                transition={{ duration: 1, delay: 0.5, ease: "backOut" }}
                className="space-y-3"
              >
                {aboutState.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    {isEditing ? (
                      <input
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        className="bg-transparent border-b border-muted-foreground text-muted-foreground outline-none"
                      />
                    ) : (
                      <span className="text-muted-foreground">{feature}</span>
                    )}
                  </div>
                ))}
                {isEditing && (
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.1 }}
                    onClick={addFeature}
                    className="text-green-600 cursor-pointer text-sm mt-2"
                  >
                    + Add Feature
                  </motion.button>
                )}
              </motion.div>

              {/* Company metrics */}
              <motion.div className="grid grid-cols-2 gap-6 pt-6">
                <div className="text-center p-4 bg-card rounded-lg shadow-sm">
                  {isEditing ? (
                    <input
                      value={aboutState.metric1Num}
                      onChange={(e) =>
                        updateField("metric1Num", e.target.value)
                      }
                      className="bg-transparent border-b border-foreground text-2xl font-bold outline-none"
                    />
                  ) : (
                    <motion.div
                      whileInView={{ opacity: [0, 1], y: [-15, 3, -3, 0] }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                      className="text-2xl font-bold text-card-foreground"
                    >
                      {aboutState.metric1Num}
                    </motion.div>
                  )}
                  {isEditing ? (
                    <input
                      value={aboutState.metric1Label}
                      onChange={(e) =>
                        updateField("metric1Label", e.target.value)
                      }
                      className="bg-transparent border-b border-muted-foreground text-muted-foreground outline-none"
                    />
                  ) : (
                    <motion.div
                      whileInView={{ opacity: [0, 1], y: [15, -3, 3, 0] }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                      className="text-muted-foreground"
                    >
                      {aboutState.metric1Label}
                    </motion.div>
                  )}
                </div>
                <div className="text-center p-4 bg-card rounded-lg shadow-sm">
                  {isEditing ? (
                    <input
                      value={aboutState.metric2Num}
                      onChange={(e) =>
                        updateField("metric2Num", e.target.value)
                      }
                      className="bg-transparent border-b border-foreground text-2xl font-bold outline-none"
                    />
                  ) : (
                    <motion.div
                      whileInView={{ opacity: [0, 1], y: [-15, 3, -3, 0] }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                      className="text-2xl font-bold text-card-foreground"
                    >
                      {aboutState.metric2Num}
                    </motion.div>
                  )}
                  {isEditing ? (
                    <input
                      value={aboutState.metric2Label}
                      onChange={(e) =>
                        updateField("metric2Label", e.target.value)
                      }
                      className="bg-transparent border-b border-muted-foreground text-muted-foreground outline-none"
                    />
                  ) : (
                    <motion.div
                      whileInView={{ opacity: [0, 1], y: [15, -3, 3, 0] }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                      className="text-muted-foreground"
                    >
                      {aboutState.metric2Label}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Vision Section */}
          <motion.div className="text-center mb-16">
            {isEditing ? (
              <input
                value={aboutState.visionBadge}
                onChange={(e) => updateField("visionBadge", e.target.value)}
                className="bg-transparent border-b border-primary text-primary outline-none"
              />
            ) : (
              <motion.div
                whileInView={{ opacity: [0, 1], y: [-20, 0] }}
                transition={{ duration: 0.5, ease: "backInOut" }}
                className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary mb-6"
              >
                <Eye className="w-4 h-4 mr-2" />
                <span className="font-semibold text-xl">
                  {aboutState.visionBadge}
                </span>
              </motion.div>
            )}

            {isEditing ? (
              <input
                value={aboutState.visionTitle}
                onChange={(e) => updateField("visionTitle", e.target.value)}
                className="bg-transparent border-b border-foreground text-3xl md:text-4xl outline-none"
              />
            ) : (
              <motion.h2
                whileInView={{ opacity: [0, 1], x: [-20, 0] }}
                transition={{ duration: 1, ease: "backInOut" }}
                className="text-3xl md:text-4xl text-foreground mb-6"
              >
                {aboutState.visionTitle}
              </motion.h2>
            )}

            {isEditing ? (
              <textarea
                value={aboutState.visionDesc}
                onChange={(e) => updateField("visionDesc", e.target.value)}
                className="w-full bg-transparent border-b border-muted-foreground text-lg text-muted-foreground outline-none"
              />
            ) : (
              <motion.p
                whileInView={{ opacity: [0, 1], x: [20, 0] }}
                transition={{ duration: 1, ease: "backOut" }}
                className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12"
              >
                {aboutState.visionDesc}
              </motion.p>
            )}

            {/* Vision Pillars */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {aboutState.visionPillars.map((pillar, index) => {
                const Icon = pillar.icon;
                return (
                  <motion.div
                    whileInView={{ opacity: [0, 1], scale: [0, 1] }}
                    transition={{ duration: 1, ease: "backInOut" }}
                    key={index}
                    className="text-center p-6 bg-card rounded-xl shadow-sm hover:shadow-lg"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    {isEditing ? (
                      <input
                        value={pillar.title}
                        onChange={(e) =>
                          updatePillar(index, "title", e.target.value)
                        }
                        className="bg-transparent border-b border-foreground font-semibold outline-none"
                      />
                    ) : (
                      <h3 className="font-semibold text-card-foreground mb-3">
                        {pillar.title}
                      </h3>
                    )}
                    {isEditing ? (
                      <textarea
                        value={pillar.description}
                        onChange={(e) =>
                          updatePillar(index, "description", e.target.value)
                        }
                        className="w-full bg-transparent border-b border-muted-foreground text-sm text-muted-foreground outline-none"
                      />
                    ) : (
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {pillar.description}
                      </p>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Mission Section */}
          <motion.div className="bg-gradient-to-r from-primary/5 to-red-accent/5 rounded-2xl p-12 text-center">
            <Target className="w-12 h-12 text-primary mx-auto mb-6" />
            {isEditing ? (
              <input
                value={aboutState.missionTitle}
                onChange={(e) => updateField("missionTitle", e.target.value)}
                className="bg-transparent border-b border-foreground text-2xl font-semibold outline-none"
              />
            ) : (
              <motion.h3
                whileInView={{ opacity: [0, 1], scale: [0, 1], y: [-20, 0] }}
                transition={{ duration: 1, ease: "backInOut" }}
                className="text-2xl font-semibold text-foreground mb-6"
              >
                {aboutState.missionTitle}
              </motion.h3>
            )}
            {isEditing ? (
              <textarea
                value={aboutState.missionDesc}
                onChange={(e) => updateField("missionDesc", e.target.value)}
                className="w-full bg-transparent border-b border-muted-foreground text-lg text-muted-foreground outline-none"
              />
            ) : (
              <motion.p
                whileInView={{ opacity: [0, 1], x: [-40, 0] }}
                transition={{ duration: 1, ease: "backInOut" }}
                className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed"
              >
                {aboutState.missionDesc}
              </motion.p>
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
}
