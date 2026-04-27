import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "./ui/button";
import { ArrowRight, Play, CheckCircle, X } from "lucide-react";
import { toast } from "react-toastify";
import { motion } from "motion/react";
import Cropper from "react-easy-crop";

export default function Hero({
  heroData,
  headerData,
  onStateChange,
  userId,
  publishedId,
  templateSelection,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [pendingSmallImageFile, setPendingSmallImageFile] =
    useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<
    "idle" | "saving" | "saved"
  >("idle");

  // Cropping states
  const [showCropper, setShowCropper] = useState(false);
  const [croppingFor, setCroppingFor] = useState<
    "heroImage" | "hero3Image" | null
  >(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(4 / 3);

  // Dynamic zoom calculation states
  const [mediaSize, setMediaSize] = useState<{
    width: number;
    height: number;
    naturalWidth: number;
    naturalHeight: number;
  } | null>(null);
  const [cropAreaSize, setCropAreaSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [minZoomDynamic, setMinZoomDynamic] = useState(0.5);
  const [prevZoom, setPrevZoom] = useState(1);

  // Consolidated state
  const [heroState, setHeroState] = useState({
    badgeText: headerData?.name || "Company",
    heading: heroData?.title || "Transform Your Business with Innovation",
    description:
      heroData?.subtitle ||
      "We help companies scale and grow with cutting-edge solutions, expert guidance, and proven strategies that deliver exceptional results.",
    primaryBtn: heroData?.primaryAction?.text || "Get Started Today",
    trustText: "Join 20+ satisfied clients",
    stats: [
      { id: 1, value: "20+", label: "Happy Clients", color: "red-accent" },
      { id: 2, value: "80%", label: "Success Rate", color: "red-accent" },
      { id: 3, value: "24/7", label: "Support", color: "primary" },
    ],
    heroImage:
      heroData?.heroImage ||
      "https://images.unsplash.com/photo-1698047682129-c3e217ac08b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBidXNpbmVzcyUyMHRlYW0lMjBvZmZpY2V8ZW58MXx8fHwxNzU1NjE4MzQ4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    hero3Image:
      heroData?.hero3Image ||
      "https://images.unsplash.com/photo-1552664730-d307ca884978?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1lZXRpbmd8ZW58MXx8fHwxNzU1NjE5MDEzfDA&ixlib=rb-4.1.0&q=80&w=400",
  });

  // Add this useEffect to notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(heroState);
    }
  }, [heroState, onStateChange]);

  // Auto-save status indicator
  useEffect(() => {
    if (isEditing && autoSaveStatus === "saving") {
      const timer = setTimeout(() => {
        setAutoSaveStatus("saved");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [autoSaveStatus, isEditing]);

  // Compute dynamic min zoom
  useEffect(() => {
    if (mediaSize && cropAreaSize) {
      const coverW = cropAreaSize.width / mediaSize.naturalWidth;
      const coverH = cropAreaSize.height / mediaSize.naturalHeight;
      const computedMin = Math.max(coverW, coverH, 0.5);
      setMinZoomDynamic(computedMin);
      setZoom((z) => (z < computedMin ? computedMin : z));
    }
  }, [mediaSize, cropAreaSize]);

  // Recenter when zooming out
  useEffect(() => {
    if (zoom < prevZoom) {
      setCrop({ x: 0, y: 0 });
    }
    setPrevZoom(zoom);
  }, [zoom]);

  // Update function for simple fields with auto-save
  const updateField = (field, value) => {
    setAutoSaveStatus("saving");
    setHeroState((prev) => ({ ...prev, [field]: value }));
  };

  // Stats functions with auto-save
  const updateStat = (id, field, value) => {
    setAutoSaveStatus("saving");
    setHeroState((prev) => ({
      ...prev,
      stats: prev.stats.map((s) =>
        s.id === id ? { ...s, [field]: value } : s
      ),
    }));
  };

  const addStat = () => {
    setAutoSaveStatus("saving");
    setHeroState((prev) => ({
      ...prev,
      stats: [
        ...prev.stats,
        { id: Date.now(), value: "0", label: "New Stat", color: "primary" },
      ],
    }));
  };

  const removeStat = (id) => {
    setAutoSaveStatus("saving");
    setHeroState((prev) => ({
      ...prev,
      stats: prev.stats.filter((s) => s.id !== id),
    }));
  };

  // Function to upload image to AWS immediately
  const uploadImageToAWS = async (file: File, imageField: string) => {
    if (!userId || !publishedId || !templateSelection) {
      console.error("Missing required props:", {
        userId,
        publishedId,
        templateSelection,
      });
      toast.error("Missing user information. Please refresh and try again.");
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("sectionName", "hero");
    formData.append("imageField", `${imageField}_${Date.now()}`);
    formData.append("templateSelection", templateSelection);

    console.log(`Uploading ${imageField} to S3:`, file);

    try {
      const uploadResponse = await fetch(
        `https://o66ziwsye5.execute-api.ap-south-1.amazonaws.com/prod/upload-image/${userId}/${publishedId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (uploadResponse.ok) {
        const uploadData = await uploadResponse.json();
        console.log(`${imageField} uploaded to S3:`, uploadData.imageUrl);
        toast.success(`${imageField} uploaded to S3 successfully!`);
        return uploadData.imageUrl;
      } else {
        const errorData = await uploadResponse.json();
        console.error(`${imageField} upload failed:`, errorData);
        toast.error(
          `Image upload failed: ${errorData.message || "Unknown error"}`
        );
        return null;
      }
    } catch (error) {
      console.error(`Error uploading ${imageField}:`, error);
      toast.error(`Error uploading image. Please try again.`);
      return null;
    }
  };

  // Image selection handlers - now open cropper
  const handleHeroImageSelect = (e) => {
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
      setCroppingFor("heroImage");
      setShowCropper(true);
      setAspectRatio(4 / 3);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    };
    reader.readAsDataURL(file);

    // Clear the file input
    e.target.value = "";
  };

  const handleSmallImageSelect = (e) => {
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
      setCroppingFor("hero3Image");
      setShowCropper(true);
      setAspectRatio(4 / 3);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
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

    if (!ctx) {
      throw new Error("Could not get canvas context");
    }

    // Set canvas size to the desired crop size
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

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

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Canvas is empty"));
            return;
          }

          const fileName = originalFile
            ? `cropped-${originalFile.name}`
            : `cropped-${croppingFor}-${Date.now()}.jpg`;

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

  // Apply crop and UPLOAD IMMEDIATELY to AWS
  const applyCrop = async () => {
    try {
      if (!imageToCrop || !croppedAreaPixels || !croppingFor) {
        toast.error("Please select an area to crop");
        return;
      }

      setIsUploading(true);

      const { file, previewUrl } = await getCroppedImg(
        imageToCrop,
        croppedAreaPixels
      );

      // Show preview immediately with blob URL (temporary)
      updateField(croppingFor, previewUrl);

      // UPLOAD TO AWS IMMEDIATELY
      const imageField =
        croppingFor === "heroImage" ? "heroImage" : "hero3Image";
      const awsImageUrl = await uploadImageToAWS(file, imageField);

      if (awsImageUrl) {
        // Update with actual S3 URL
        updateField(croppingFor, awsImageUrl);

        if (croppingFor === "heroImage") {
          setPendingImageFile(null);
        } else {
          setPendingSmallImageFile(null);
        }

        console.log(`${imageField} uploaded to S3:`, awsImageUrl);
      } else {
        // If upload fails, keep the file as pending
        if (croppingFor === "heroImage") {
          setPendingImageFile(file);
        } else {
          setPendingSmallImageFile(file);
        }
        toast.warning(
          "Image cropped but upload failed. It will be saved locally."
        );
      }

      setShowCropper(false);
      setImageToCrop(null);
      setOriginalFile(null);
      setCroppingFor(null);
      setCroppedAreaPixels(null);
    } catch (error) {
      console.error("Error cropping image:", error);
      toast.error("Error cropping image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Cancel cropping
  const cancelCrop = () => {
    setShowCropper(false);
    setImageToCrop(null);
    setOriginalFile(null);
    setCroppingFor(null);
    setCroppedAreaPixels(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  // Reset zoom and rotation
  const resetCropSettings = () => {
    setZoom(1);
    setCrop({ x: 0, y: 0 });
  };

  // Separate function to handle image upload only (for failed uploads)
  const handleImageUpload = async () => {
    const uploadPromises = [];

    if (pendingImageFile) {
      uploadPromises.push(
        uploadImageToAWS(pendingImageFile, "heroImage").then((awsImageUrl) => {
          if (awsImageUrl) {
            updateField("heroImage", awsImageUrl);
            setPendingImageFile(null);
            return { success: true, type: "heroImage" };
          } else {
            throw new Error("Hero image upload failed");
          }
        })
      );
    }

    if (pendingSmallImageFile) {
      uploadPromises.push(
        uploadImageToAWS(pendingSmallImageFile, "hero3Image").then(
          (awsImageUrl) => {
            if (awsImageUrl) {
              updateField("hero3Image", awsImageUrl);
              setPendingSmallImageFile(null);
              return { success: true, type: "hero3Image" };
            } else {
              throw new Error("Small image upload failed");
            }
          }
        )
      );
    }

    if (uploadPromises.length === 0) return true;

    try {
      setIsUploading(true);
      const results = await Promise.allSettled(uploadPromises);

      const successfulUploads = results.filter(
        (result) => result.status === "fulfilled"
      ).length;
      const failedUploads = results.filter(
        (result) => result.status === "rejected"
      ).length;

      if (successfulUploads > 0) {
        toast.success(`${successfulUploads} image(s) uploaded successfully!`);
      }
      if (failedUploads > 0) {
        toast.error(
          `${failedUploads} image(s) failed to upload. Please try again.`
        );
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in upload:", error);
      toast.error("Error uploading images. Please try again.");
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  // Updated Save button handler - now only handles pending images and exits edit mode
  const handleSave = async () => {
    try {
      // If there are pending images, upload them first
      if (pendingImageFile || pendingSmallImageFile) {
        const uploadSuccess = await handleImageUpload();
        if (!uploadSuccess) {
          return; // Don't exit edit mode if upload fails
        }
      }

      // Exit edit mode
      setIsEditing(false);
      setAutoSaveStatus("idle");
      toast.success("Hero section saved!");
    } catch (error) {
      console.error("Error saving hero section:", error);
      toast.error("Error saving changes. Please try again.");
    }
  };

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const imageVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <>
      {/* Image Cropper Modal */}
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
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Crop {croppingFor === "heroImage" ? "Hero" : "Small"} Image
                  (4:3 Ratio)
                </h3>
                <p className="text-sm text-gray-600">
                  Required Size:{" "}
                  {croppingFor === "heroImage" ? "1080×720px" : "400×267px"}
                </p>
              </div>
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
                aspect={aspectRatio}
                minZoom={minZoomDynamic}
                maxZoom={3}
                restrictPosition={true}
                onMediaLoaded={(ms) => setMediaSize(ms)}
                onCropAreaChange={(area) => setCropAreaSize(area)}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                showGrid={true}
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
              {/* Fixed Aspect Ratio Info */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Aspect Ratio:{" "}
                  <strong>
                    {croppingFor === "heroImage"
                      ? "1080:720 (3:2)"
                      : "400:267 (3:2)"}
                  </strong>
                </p>
                <p className="text-xs text-gray-600">
                  Output will be exactly{" "}
                  {croppingFor === "heroImage" ? "1080×720px" : "400×267px"}
                </p>
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
                  min={minZoomDynamic}
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
                  disabled={isUploading}
                  className={`w-full ${
                    isUploading
                      ? "bg-gray-400"
                      : "bg-green-600 hover:bg-green-700"
                  } text-white rounded py-2 text-sm font-medium`}
                >
                  {isUploading ? "Uploading..." : "Apply Crop"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Rest of your Hero component */}
      <section
        id="home"
        className="pt-20 mt-[5rem] pb-16 bg-background relative overflow-hidden theme-transition"
      >
        {/* Background decorations */}
        <motion.div
          className="absolute top-20 right-0 w-72 h-72 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2"
          animate={{ scale: [1, 1.1, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-primary/3 rounded-full translate-y-1/2 -translate-x-1/2"
          animate={{ scale: [1, 1.2, 1], rotate: [0, -180, -360] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-40 right-20 w-20 h-20 bg-red-accent/10 rounded-full"
          variants={floatingVariants}
          animate="animate"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Auto-save status and Edit/Save buttons - Combined in one row */}
          <div className="absolute top-4 right-4 z-50 pointer-events-auto">
            <div className="flex items-center gap-4">
              {/* Auto-save status on left */}
              {isEditing && (
                <div className="text-sm bg-white/80 backdrop-blur-sm rounded-lg px-3 py-1 shadow">
                  {autoSaveStatus === "saving" && (
                    <span className="text-yellow-600 animate-pulse">
                      Saving changes...
                    </span>
                  )}
                  {autoSaveStatus === "saved" && (
                    <span className="text-green-600 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Changes saved
                    </span>
                  )}
                </div>
              )}

              {/* Edit/Save button on right */}
              {isEditing ? (
                <motion.button
                  whileHover={{ y: -1, scaleX: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSave}
                  disabled={isUploading}
                  className={`${
                    isUploading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:shadow-2xl"
                  } text-white px-4 py-2 rounded shadow-xl hover:font-semibold`}
                >
                  {isUploading ? "Uploading..." : "Save & Exit"}
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ y: -1, scaleX: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsEditing(true)}
                  className="bg-yellow-500 text-black px-4 py-2 rounded cursor-pointer hover:shadow-2xl shadow-xl hover:font-semibold"
                >
                  Edit
                </motion.button>
              )}
            </div>
          </div>

          {/* Pending image upload notices */}
          {isEditing && (pendingImageFile || pendingSmallImageFile) && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <span className="font-medium">⚠️ Images ready for upload:</span>
                {pendingImageFile && ` ${pendingImageFile.name}`}
                {pendingSmallImageFile && ` ${pendingSmallImageFile.name}`}
                {' - Click "Save & Exit" to upload to S3'}
              </p>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div
              className="space-y-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="space-y-4">
                {/* Badge */}
                {(isEditing || heroState.badgeText) && (
                  <motion.div
                    className="inline-flex items-center px-4 py-2 bg-yellow-400 rounded-xl text-primary border border-primary/20 mb-4 min-h-[44px]"
                    variants={itemVariants}
                  >
                    {isEditing ? (
                      <div className="relative">
                        <input
                          value={heroState.badgeText}
                          onChange={(e) =>
                            updateField("badgeText", e.target.value)
                          }
                          maxLength={75}
                          placeholder="Enter company name/badge..."
                          className={`bg-transparent text-black border-b border-primary text-lg uppercase font-bold outline-none placeholder:text-gray-600 ${
                            heroState.badgeText.length >= 75
                              ? "border-red-500"
                              : ""
                          }`}
                        />
                        <div className="absolute -bottom-5 left-0 text-xs text-gray-500 font-bold">
                          {heroState.badgeText.length >= 75 && "Limit reached!"}
                        </div>
                      </div>
                    ) : (
                      <span className="font-bold text-lg text-black uppercase">
                        {heroState.badgeText}
                      </span>
                    )}
                  </motion.div>
                )}

                {/* Heading */}
                <motion.div variants={itemVariants}>
                  {isEditing ? (
                    <div className="relative">
                      <textarea
                        value={heroState.heading}
                        onChange={(e) => updateField("heading", e.target.value)}
                        maxLength={80}
                        className={`bg-transparent border-b border-foreground text-4xl md:text-6xl leading-tight outline-none w-full max-w-lg ${
                          heroState.heading.length >= 80 ? "border-red-500" : ""
                        }`}
                      />
                      <div className="text-right text-xs text-gray-500 mt-1">
                        {heroState.heading.length}/80
                        {heroState.heading.length >= 80 && (
                          <span className="ml-2 text-gray-500 font-bold">
                            Limit reached!
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <h1 className="text-4xl md:text-6xl text-foreground leading-tight text-left">
                      {heroState.heading}
                    </h1>
                  )}
                </motion.div>

                {/* Description */}
                <motion.div variants={itemVariants}>
                  {isEditing ? (
                    <div className="relative">
                      <textarea
                        value={heroState.description}
                        onChange={(e) =>
                          updateField("description", e.target.value)
                        }
                        maxLength={500}
                        className={`bg-transparent border-b text-xl text-muted-foreground outline-none w-full max-w-lg ${
                          heroState.description.length >= 500
                            ? "border-red-500"
                            : "border-muted-foreground"
                        }`}
                      />
                      <div
                        className={`absolute right-0 top-full mt-1 text-xs ${
                          heroState.description.length >= 500
                            ? "text-gray-500"
                            : "text-gray-200"
                        }`}
                      >
                        {heroState.description.length}/500
                        {heroState.description.length >= 500 && (
                          <span className="ml-2 font-bold">
                            Character limit reached!
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xl text-gray-700 dark:text-gray-300 max-w-lg text-justify">
                      {heroState.description}
                    </p>
                  )}
                </motion.div>
              </div>

              {/* Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                variants={itemVariants}
              >
                {isEditing ? (
                  <div className="relative">
                    <input
                      value={heroState.primaryBtn}
                      onChange={(e) =>
                        updateField("primaryBtn", e.target.value)
                      }
                      maxLength={30}
                      placeholder="Enter button text..."
                      className={`bg-transparent border-b border-primary outline-none max-w-[200px] placeholder:text-gray-500 ${
                        heroState.primaryBtn.length >= 30
                          ? "border-red-500"
                          : ""
                      }`}
                    />
                    <div className="text-right text-xs text-gray-500 mt-1">
                      {heroState.primaryBtn.length}/30
                      {heroState.primaryBtn.length >= 30 && (
                        <span className="ml-2 text-gray-500 font-bold">
                          Character limit reached!
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  heroState.primaryBtn && (
                    <Button
                      size="lg"
                      className="bg-yellow-100 hover:bg-yellow-200 text-primary-foreground shadow-xl"
                    >
                      <a href="#contact">{heroState.primaryBtn}</a>
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  )
                )}
              </motion.div>

              {/* Trust text */}
              {(isEditing || heroState.trustText) && (
                <motion.div
                  className="flex items-center space-x-6 pt-4"
                  variants={itemVariants}
                >
                  <div className="flex items-center space-x-2">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 bg-primary rounded-full border-2 border-background" />
                      <div className="w-8 h-8 bg-primary/80 rounded-full border-2 border-background" />
                      <div className="w-8 h-8 bg-red-accent rounded-full border-2 border-background" />
                    </div>
                    {isEditing ? (
                      <div className="relative">
                        <input
                          value={heroState.trustText}
                          onChange={(e) =>
                            updateField("trustText", e.target.value)
                          }
                          maxLength={60}
                          placeholder="Enter trust text (e.g., 'Trusted by 1000+ companies')"
                          className={`bg-transparent border-b border-muted-foreground text-sm outline-none placeholder:text-gray-500 ${
                            heroState.trustText.length >= 60
                              ? "border-red-500"
                              : ""
                          }`}
                        />
                        <div className="text-right text-xs text-gray-500 mt-1">
                          {heroState.trustText.length}/60
                          {heroState.trustText.length >= 60 && (
                            <span className="ml-2 text-gray-500 font-bold">
                              Character limit reached!
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        {heroState.trustText}
                      </span>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Stats */}
              {heroState.stats && heroState.stats.length > 0 && (
                <motion.div
                  className="grid grid-cols-3 gap-8 pt-8"
                  variants={itemVariants}
                >
                  {heroState.stats.map((s) => (
                    <div key={s.id} className="group">
                      {isEditing ? (
                        <div className="flex flex-col gap-1">
                          <div className="relative">
                            <input
                              value={s.value}
                              onChange={(e) =>
                                updateStat(s.id, "value", e.target.value)
                              }
                              maxLength={15}
                              className={`bg-transparent border-b border-foreground font-bold text-2xl outline-none ${
                                s.value.length >= 15 ? "border-red-500" : ""
                              }`}
                            />
                            <div className="text-right text-xs text-gray-500 mt-1">
                              {s.value.length}/15
                              {s.value.length >= 15 && (
                                <span className="ml-2 text-gray-500 font-bold">
                                  Limit reached!
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="relative">
                            <input
                              value={s.label}
                              onChange={(e) =>
                                updateStat(s.id, "label", e.target.value)
                              }
                              maxLength={25}
                              className={`bg-transparent border-b border-muted-foreground text-sm outline-none ${
                                s.label.length >= 25 ? "border-red-500" : ""
                              }`}
                            />
                            <div className="text-right text-xs text-gray-500 mt-1">
                              {s.label.length}/25
                              {s.label.length >= 25 && (
                                <span className="ml-2 text-gray-500 font-bold">
                                  Limit reached!
                                </span>
                              )}
                            </div>
                          </div>

                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            whileHover={{ scale: 1.2 }}
                            onClick={() => removeStat(s.id)}
                            className="text-gray-500 cursor-pointer text-xs"
                          >
                            ✕ Remove
                          </motion.button>
                        </div>
                      ) : (
                        <>
                          <div
                            className={`text-2xl font-bold group-hover:text-${s.color}`}
                          >
                            {s.value}
                          </div>
                          <div className="text-muted-foreground">{s.label}</div>
                          <div
                            className={`w-8 h-1 bg-${s.color}/30 group-hover:bg-${s.color} mt-1`}
                          />
                        </>
                      )}
                    </div>
                  ))}
                  {isEditing && (
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      whileHover={{ scale: 1.2 }}
                      onClick={addStat}
                      className="text-green-600 cursor-pointer shadow-sm  text-sm font-medium"
                    >
                      + Add Stat
                    </motion.button>
                  )}
                </motion.div>
              )}
            </motion.div>

            {/* Hero Image */}
            <motion.div
              className="relative"
              initial="hidden"
              animate="visible"
              variants={itemVariants}
            >
              {/* Main image container */}
              <div className="relative w-full">
                <motion.div className="relative" variants={imageVariants}>
                  <div className="relative flex justify-center">
                    {/* Main Hero Image */}
                    <div className="relative">
                      <img
                        src={heroState.heroImage}
                        alt="Modern business team collaborating"
                        className="w-full max-w-full h-auto object-contain rounded-3xl shadow-2xl scale-110"
                        style={{
                          maxHeight: "500px",
                          width: "auto",
                          margin: "0 auto",
                        }}
                      />
                      {isEditing && (
                        <label className="absolute bottom-2 right-2 bg-black/70 text-white p-2 rounded cursor-pointer hover:bg-black/90 transition-colors">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleHeroImageSelect}
                          />
                        </label>
                      )}
                    </div>

                    {/* Small overlapping image */}
                    <motion.div
                      className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 lg:-bottom-8 lg:-left-8"
                      variants={imageVariants}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="relative">
                        <img
                          src={heroState.hero3Image}
                          alt="Additional business context"
                          className="block w-auto h-auto max-w-[200px] max-h-[200px] object-contain rounded-2xl shadow-xl border-4 border-white bg-white scale-110"
                        />
                        {isEditing && (
                          <label className="absolute bottom-1 right-1 bg-black/70 text-white p-1 rounded cursor-pointer hover:bg-black/90 transition-colors">
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleSmallImageSelect}
                            />
                          </label>
                        )}
                      </div>
                    </motion.div>

                    {/* Decorative circle */}
                    <motion.div
                      className="absolute -top-6 -right-6 w-16 h-16 sm:w-20 sm:h-20 bg-yellow-400 rounded-full opacity-80"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: 0.6,
                        type: "spring",
                        stiffness: 300,
                      }}
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}