// About.tsx - Full Updated Code
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
  Handshake,
  X,
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
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(4 / 3);

  // Map the string icons to Lucide React components
  const iconMap = {
    Shield: Shield,
    Lightbulb: Lightbulb,
    Target: Target,
    Handshake: Handshake,
    Globe: Globe,
    Users: Users,
    Rocket: Rocket,
    Heart: Heart,
  };

  // Function to process aboutData and ensure icons are proper components
  const processAboutData = (data) => {
    if (!data) return null;

    return {
      ...data,
      visionPillars:
        data.visionPillars &&
        data.visionPillars.map((pillar) => ({
          ...pillar,
          icon: iconMap[pillar.icon] || Globe,
        })),
    };
  };

  // Consolidated state
  const [aboutState, setAboutState] = useState(processAboutData(aboutData));

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
      setAspectRatio(4 / 3);
      setZoom(1);
      setRotation(0);
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
  const getCroppedImg = async (imageSrc, pixelCrop, rotation = 0) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Set canvas size to the desired crop size
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // Translate and rotate the context
    ctx.translate(pixelCrop.width / 2, pixelCrop.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-pixelCrop.width / 2, -pixelCrop.height / 2);

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
        croppedAreaPixels,
        rotation
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
    setRotation(0);
  };

  // Reset zoom and rotation
  const resetCropSettings = () => {
    setZoom(1);
    setRotation(0);
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
        formData.append("imageField", "imageUrl" + Date.now());
        formData.append("templateSelection", templateSelection);

        console.log("Uploading about image to S3:", pendingImageFile);

        const uploadResponse = await fetch(
          `https://o66ziwsye5.execute-api.ap-south-1.amazonaws.com/prod/upload-image/${userId}/${publishedId}`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          // Update with actual S3 URL, not blob URL
          updateField("imageUrl", uploadData.imageUrl);
          setPendingImageFile(null);
          console.log("Image uploaded to S3:", uploadData.imageUrl);
          toast.success("About image uploaded to S3 successfully!");
        } else {
          const errorData = await uploadResponse.json();
          console.error("Image upload failed:", errorData);
          toast.error(
            `Image upload failed: ${errorData.message || "Unknown error"}`
          );
          return;
        }
      }

      // Exit edit mode
      setIsEditing(false);
      toast.success("About section saved with S3 URLs!");
    } catch (error) {
      console.error("Error saving about section:", error);
      toast.error("Error saving changes. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      {/* Image Cropper Modal - Standardized like Clients */}
      {showCropper && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/90 z-[99999999] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl max-w-4xl w-full h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800">
                Crop About Image
              </h3>
              <button
                onClick={cancelCrop}
                className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Cropper Area */}
            <div className="flex-1 relative bg-gray-900 min-h-0">
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={aspectRatio}
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

            {/* Controls */}
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              {/* Aspect Ratio Buttons */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Aspect Ratio:
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setAspectRatio(1)}
                    className={`px-3 py-2 text-sm rounded border ${
                      aspectRatio === 1
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-700 border-gray-300"
                    }`}
                  >
                    1:1 (Square)
                  </button>
                  <button
                    onClick={() => setAspectRatio(4 / 3)}
                    className={`px-3 py-2 text-sm rounded border ${
                      aspectRatio === 4 / 3
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-700 border-gray-300"
                    }`}
                  >
                    4:3 (Standard)
                  </button>
                  <button
                    onClick={() => setAspectRatio(16 / 9)}
                    className={`px-3 py-2 text-sm rounded border ${
                      aspectRatio === 16 / 9
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-700 border-gray-300"
                    }`}
                  >
                    16:9 (Widescreen)
                  </button>
                </div>
              </div>

              {/* Zoom Control */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-gray-700">
                    Zoom
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
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={resetCropSettings}
                  className="w-full border border-gray-300 text-gray-700 hover:bg-gray-100 rounded py-2 text-sm font-medium"
                >
                  Reset
                </button>
                <button
                  onClick={cancelCrop}
                  className="w-full border border-gray-300 text-gray-700 hover:bg-gray-100 rounded py-2 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={applyCrop}
                  className="w-full bg-green-600 hover:bg-green-700 text-white rounded py-2 text-sm font-medium"
                >
                  Apply Crop
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Main About Section */}
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
              {/* Recommended Size Above Image */}
              {isEditing && (
                <div className="absolute top-2 left-2 right-2 bg-black/70 text-white text-xs p-1 rounded z-10 text-center">
                  Recommended: 800×600px (4:3 ratio)
                </div>
              )}
              <img
                src={aboutState.imageUrl}
                alt="About"
                className="w-full h-[400px] object-cover"
              />
              {isEditing && (
                <div className="absolute bottom-4 left-4 right-4 bg-white/80 p-2 rounded shadow z-50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="text-sm cursor-pointer font-bold w-full text-center border-2 border-dashed border-muted-foreground p-2 rounded"
                  />
                  {pendingImageFile && (
                    <p className="text-xs text-green-600 mt-1 text-center">
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
                    className="bg-transparent border-b border-primary text-3xl md:text-4xl text-foreground outline-none w-full"
                  />
                ) : (
                  <h2 className="text-3xl md:text-4xl text-foreground">
                    {aboutState.aboutTitle}
                  </h2>
                )}
                {isEditing ? (
                  <div className="relative">
                    <textarea
                      value={aboutState.description1}
                      onChange={(e) =>
                        updateField("description1", e.target.value)
                      }
                      maxLength={500}
                      className={`w-full bg-transparent border-b text-lg text-muted-foreground outline-none ${
                        aboutState.description1.length >= 500
                          ? "border-red-500"
                          : "border-muted-foreground"
                      }`}
                    />
                    <div className="flex justify-between items-center mt-1">
                      <div>
                        {aboutState.description1.length >= 500 && (
                          <span className="text-red-500 text-xs font-bold">
                            ⚠️ Character limit reached!
                          </span>
                        )}
                      </div>
                      <div
                        className={`text-xs ${
                          aboutState.description1.length >= 500
                            ? "text-red-500"
                            : "text-gray-500"
                        }`}
                      >
                        {aboutState.description1.length}/500
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-lg text-muted-foreground">
                    {aboutState.description1}
                  </p>
                )}
                {isEditing ? (
                  <div className="relative">
                    <textarea
                      value={aboutState.description2}
                      onChange={(e) =>
                        updateField("description2", e.target.value)
                      }
                      maxLength={500}
                      className={`w-full bg-transparent border-b text-muted-foreground outline-none ${
                        aboutState.description2.length >= 500
                          ? "border-red-500"
                          : "border-muted-foreground"
                      }`}
                    />
                    <div className="flex justify-between items-center mt-1">
                      <div>
                        {aboutState.description2.length >= 500 && (
                          <span className="text-red-500 text-xs font-bold">
                            ⚠️ Character limit reached!
                          </span>
                        )}
                      </div>
                      <div
                        className={`text-xs ${
                          aboutState.description2.length >= 500
                            ? "text-red-500"
                            : "text-gray-500"
                        }`}
                      >
                        {aboutState.description2.length}/500
                      </div>
                    </div>
                  </div>
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
                        className="bg-transparent border-b border-muted-foreground text-muted-foreground outline-none w-full"
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
                    <div className="relative">
                      <input
                        value={aboutState.metric1Num}
                        onChange={(e) =>
                          updateField("metric1Num", e.target.value)
                        }
                        maxLength={15}
                        className={`bg-transparent border-b border-foreground text-2xl font-bold outline-none w-full text-center ${
                          aboutState.metric1Num.length >= 15
                            ? "border-red-500"
                            : ""
                        }`}
                      />
                      <div className="text-right text-xs text-gray-500 mt-1">
                        {aboutState.metric1Num.length}/15
                        {aboutState.metric1Num.length >= 15 && (
                          <span className="ml-2 text-red-500 font-bold">
                            Limit reached!
                          </span>
                        )}
                      </div>
                    </div>
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
                    <div className="relative mt-2">
                      <input
                        value={aboutState.metric1Label}
                        onChange={(e) =>
                          updateField("metric1Label", e.target.value)
                        }
                        maxLength={25}
                        className={`bg-transparent border-b border-muted-foreground text-muted-foreground outline-none w-full text-center ${
                          aboutState.metric1Label.length >= 25
                            ? "border-red-500"
                            : ""
                        }`}
                      />
                      <div className="text-right text-xs text-gray-500 mt-1">
                        {aboutState.metric1Label.length}/25
                        {aboutState.metric1Label.length >= 25 && (
                          <span className="ml-2 text-red-500 font-bold">
                            Limit reached!
                          </span>
                        )}
                      </div>
                    </div>
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
                    <div className="relative">
                      <input
                        value={aboutState.metric2Num}
                        onChange={(e) =>
                          updateField("metric2Num", e.target.value)
                        }
                        maxLength={15}
                        className={`bg-transparent border-b border-foreground text-2xl font-bold outline-none w-full text-center ${
                          aboutState.metric2Num.length >= 15
                            ? "border-red-500"
                            : ""
                        }`}
                      />
                      <div className="text-right text-xs text-gray-500 mt-1">
                        {aboutState.metric2Num.length}/15
                        {aboutState.metric2Num.length >= 15 && (
                          <span className="ml-2 text-red-500 font-bold">
                            Limit reached!
                          </span>
                        )}
                      </div>
                    </div>
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
                    <div className="relative mt-2">
                      <input
                        value={aboutState.metric2Label}
                        onChange={(e) =>
                          updateField("metric2Label", e.target.value)
                        }
                        maxLength={25}
                        className={`bg-transparent border-b border-muted-foreground text-muted-foreground outline-none w-full text-center ${
                          aboutState.metric2Label.length >= 25
                            ? "border-red-500"
                            : ""
                        }`}
                      />
                      <div className="text-right text-xs text-gray-500 mt-1">
                        {aboutState.metric2Label.length}/25
                        {aboutState.metric2Label.length >= 25 && (
                          <span className="ml-2 text-red-500 font-bold">
                            Limit reached!
                          </span>
                        )}
                      </div>
                    </div>
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
              <div className="relative">
                <input
                  value={aboutState.visionBadge}
                  onChange={(e) => updateField("visionBadge", e.target.value)}
                  maxLength={25}
                  className={`bg-transparent border-b border-primary text-primary outline-none ${
                    aboutState.visionBadge.length >= 25 ? "border-red-500" : ""
                  }`}
                />
                <div className="text-right text-xs text-gray-500 mt-1">
                  {aboutState.visionBadge.length}/25
                  {aboutState.visionBadge.length >= 25 && (
                    <span className="ml-2 text-red-500 font-bold">
                      Limit reached!
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <motion.div
                whileInView={{ opacity: [0, 1], y: [-20, 0] }}
                transition={{ duration: 0.5, ease: "backInOut" }}
                className="inline-flex items-center px-4 py-2 bg-red-accent/10 rounded-full text-primary mb-6"
              >
                <Eye className="text-lg mr-2 text-red-500" />
                <span className="font-medium text-red-500 text-lg">
                  {aboutState.visionBadge}
                </span>
              </motion.div>
            )}

            {isEditing ? (
              <div className="relative">
                <input
                  value={aboutState.visionTitle}
                  onChange={(e) => updateField("visionTitle", e.target.value)}
                  maxLength={80}
                  className={`bg-transparent border-b border-foreground text-3xl md:text-4xl outline-none w-full text-center ${
                    aboutState.visionTitle.length >= 80 ? "border-red-500" : ""
                  }`}
                />
                <div className="text-right text-xs text-gray-500 mt-1">
                  {aboutState.visionTitle.length}/80
                  {aboutState.visionTitle.length >= 80 && (
                    <span className="ml-2 text-red-500 font-bold">
                      Limit reached!
                    </span>
                  )}
                </div>
              </div>
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
              <div className="relative">
                <textarea
                  value={aboutState.visionDesc}
                  onChange={(e) => updateField("visionDesc", e.target.value)}
                  maxLength={300}
                  className={`w-full bg-transparent border-b border-muted-foreground text-lg text-muted-foreground outline-none text-center ${
                    aboutState.visionDesc.length >= 300 ? "border-red-500" : ""
                  }`}
                />
                <div className="text-right text-xs text-gray-500 mt-1">
                  {aboutState.visionDesc.length}/300
                  {aboutState.visionDesc.length >= 300 && (
                    <span className="ml-2 text-red-500 font-bold">
                      Limit reached!
                    </span>
                  )}
                </div>
              </div>
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
                      <div className="relative mb-4">
                        <input
                          value={pillar.title}
                          onChange={(e) =>
                            updatePillar(index, "title", e.target.value)
                          }
                          maxLength={40}
                          className={`bg-transparent border-b border-foreground font-semibold outline-none w-full text-center ${
                            pillar.title.length >= 40 ? "border-red-500" : ""
                          }`}
                        />
                        <div className="text-right text-xs text-gray-500 mt-1">
                          {pillar.title.length}/40
                          {pillar.title.length >= 40 && (
                            <span className="ml-2 text-red-500 font-bold">
                              Limit reached!
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <h3 className="font-semibold text-card-foreground mb-3">
                        {pillar.title}
                      </h3>
                    )}

                    {isEditing ? (
                      <div className="relative">
                        <textarea
                          value={pillar.description}
                          onChange={(e) =>
                            updatePillar(index, "description", e.target.value)
                          }
                          maxLength={150}
                          className={`w-full bg-transparent border-b border-muted-foreground text-sm text-muted-foreground outline-none text-center ${
                            pillar.description.length >= 150
                              ? "border-red-500"
                              : ""
                          }`}
                        />
                        <div className="text-right text-xs text-gray-500 mt-1">
                          {pillar.description.length}/150
                          {pillar.description.length >= 150 && (
                            <span className="ml-2 text-red-500 font-bold">
                              Limit reached!
                            </span>
                          )}
                        </div>
                      </div>
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
              <div className="relative mb-6">
                <input
                  value={aboutState.missionTitle}
                  onChange={(e) => updateField("missionTitle", e.target.value)}
                  maxLength={60}
                  className={`bg-transparent border-b border-foreground text-2xl font-semibold outline-none w-full text-center ${
                    aboutState.missionTitle.length >= 60 ? "border-red-500" : ""
                  }`}
                />
                <div className="text-right text-xs text-gray-500 mt-1">
                  {aboutState.missionTitle.length}/60
                  {aboutState.missionTitle.length >= 60 && (
                    <span className="ml-2 text-red-500 font-bold">
                      Limit reached!
                    </span>
                  )}
                </div>
              </div>
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
              <div className="relative">
                <textarea
                  value={aboutState.missionDesc}
                  onChange={(e) => updateField("missionDesc", e.target.value)}
                  maxLength={400}
                  className={`w-full bg-transparent border-b border-muted-foreground text-lg text-muted-foreground outline-none text-center ${
                    aboutState.missionDesc.length >= 400 ? "border-red-500" : ""
                  }`}
                />
                <div className="text-right text-xs text-gray-500 mt-1">
                  {aboutState.missionDesc.length}/400
                  {aboutState.missionDesc.length >= 400 && (
                    <span className="ml-2 text-red-500 font-bold">
                      Limit reached!
                    </span>
                  )}
                </div>
              </div>
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
