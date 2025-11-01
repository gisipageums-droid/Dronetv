import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "./ui/button";
import { ArrowRight, Play, CheckCircle, X } from "lucide-react";
import { toast } from "react-toastify";
import { motion } from "motion/react";
import Cropper from "react-easy-crop";

export default function Hero({
  heroData,
  onStateChange,
  userId,
  publishedId,
  templateSelection,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [pendingImageFile, setPendingImageFile] = useState(null);
  const [pendingSmallImageFile, setPendingSmallImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Cropping states
  const [showCropper, setShowCropper] = useState(false);
  const [croppingFor, setCroppingFor] = useState(null); // 'heroImage' or 'hero3Image'
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(4 / 3);

  // Consolidated state
  const [heroState, setHeroState] = useState({
    ...heroData,
    heroImage:
      heroData?.heroImage ||
      heroData?.heroImage ||
      "https://images.unsplash.com/photo-1698047682129-c3e217ac08b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBidXNpbmVzcyUyMHRlYW0lMjBvZmZpY2V8ZW58MXx8fHwxNzU1NjE4MzQ4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    hero3Image:
      heroData?.smallImage ||
      heroData?.hero3Image ||
      "https://images.unsplash.com/photo-1552664730-d307ca884978?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1lZXRpbmd8ZW58MXx8fHwxNzU1NjE5MDEzfDA&ixlib=rb-4.1.0&q=80&w=400",
  });

  // Add this useEffect to notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(heroState);
    }
  }, [heroState, onStateChange]);

  // Update function for simple fields
  const updateField = (field, value) => {
    setHeroState((prev) => ({ ...prev, [field]: value }));
  };

  // Stats functions
  const updateStat = (id, field, value) => {
    setHeroState((prev) => ({
      ...prev,
      stats: prev.stats.map((s) =>
        s.id === id ? { ...s, [field]: value } : s
      ),
    }));
  };

  const addStat = () => {
    setHeroState((prev) => ({
      ...prev,
      stats: [
        ...prev.stats,
        { id: Date.now(), value: "0", label: "New Stat", color: "primary" },
      ],
    }));
  };

  const removeStat = (id) => {
    setHeroState((prev) => ({
      ...prev,
      stats: prev.stats.filter((s) => s.id !== id),
    }));
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
      // Set aspect ratio for hero image
      setAspectRatio(4 / 3);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
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
      // Set aspect ratio for small image
      setAspectRatio(1);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
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

  // Function to get cropped image - FIXED to return proper file
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
          // Create a proper file with original file name or generate one
          const fileName = originalFile
            ? `cropped-${originalFile.name}`
            : `cropped-${croppingFor}-${Date.now()}.jpg`;

          const file = new File([blob], fileName, {
            type: "image/jpeg",
            lastModified: Date.now(),
          });

          // Create object URL for preview
          const previewUrl = URL.createObjectURL(blob);

          resolve({
            file,
            previewUrl,
          });
        },
        "image/jpeg",
        0.95
      ); // 95% quality
    });
  };

  // Apply crop and set pending file - FIXED
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
      updateField(croppingFor, previewUrl);

      // Set the actual file for upload on save
      if (croppingFor === "heroImage") {
        setPendingImageFile(file);
        console.log("Hero image cropped, file ready for upload:", file);
      } else {
        setPendingSmallImageFile(file);
        console.log("Small image cropped, file ready for upload:", file);
      }

      toast.success("Image cropped successfully! Click Save to upload to S3.");
      setShowCropper(false);
      setImageToCrop(null);
      setOriginalFile(null);
      setCroppingFor(null);
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
    setCroppingFor(null);
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

  // Updated Save button handler - uploads cropped images to S3 - FIXED
  // const handleSave = async () => {
  //   try {
  //     setIsUploading(true);

  //     // Upload main image if cropped
  //     if (pendingImageFile) {
  //       if (!userId || !publishedId || !templateSelection) {
  //         console.error("Missing required props:", {
  //           userId,
  //           publishedId,
  //           templateSelection,
  //         });
  //         toast.error(
  //           "Missing user information. Please refresh and try again."
  //         );
  //         return;
  //       }

  //       const formData = new FormData();
  //       formData.append("file", pendingImageFile);
  //       formData.append("sectionName", "hero");
  //       formData.append("imageField", "heroImage" + Date.now());
  //       formData.append("templateSelection", templateSelection);

  //       console.log("Uploading hero image to S3:", pendingImageFile);

  //       const uploadResponse = await fetch(
  //         `https://o66ziwsye5.execute-api.ap-south-1.amazonaws.com/prod/upload-image/${userId}/${publishedId}`,
  //         {
  //           method: "POST",
  //           body: formData,
  //         }
  //       );

  //       if (uploadResponse.ok) {
  //         const uploadData = await uploadResponse.json();
  //         // Update with actual S3 URL, not blob URL
  //         updateField("heroImage", uploadData.imageUrl);
  //         setPendingImageFile(null);
  //         console.log("Main image uploaded to S3:", uploadData.imageUrl);
  //         toast.success("Hero image uploaded to S3 successfully!");
  //       } else {
  //         const errorData = await uploadResponse.json();
  //         console.error("Main image upload failed:", errorData);
  //         toast.error(
  //           `Main image upload failed: ${errorData.message || "Unknown error"}`
  //         );
  //         return;
  //       }
  //     }

  //     // Upload small image if cropped
  //     if (pendingSmallImageFile) {
  //       if (!userId || !publishedId || !templateSelection) {
  //         console.error("Missing required props:", {
  //           userId,
  //           publishedId,
  //           templateSelection,
  //         });
  //         toast.error(
  //           "Missing user information. Please refresh and try again."
  //         );
  //         return;
  //       }

  //       const formData = new FormData();
  //       formData.append("file", pendingSmallImageFile);
  //       formData.append("sectionName", "hero");
  //       formData.append("imageField", "hero3Image");
  //       formData.append("templateSelection", templateSelection);

  //       console.log("Uploading small image to S3:", pendingSmallImageFile);

  //       const uploadResponse = await fetch(
  //         `https://o66ziwsye5.execute-api.ap-south-1.amazonaws.com/prod/upload-image/${userId}/${publishedId}`,
  //         {
  //           method: "POST",
  //           body: formData,
  //         }
  //       );

  //       if (uploadResponse.ok) {
  //         const uploadData = await uploadResponse.json();
  //         // Update with actual S3 URL, not blob URL
  //         updateField("hero3Image", uploadData.imageUrl);
  //         setPendingSmallImageFile(null);
  //         console.log("Small image uploaded to S3:", uploadData.imageUrl);
  //         toast.success("Small image uploaded to S3 successfully!");
  //       } else {
  //         const errorData = await uploadResponse.json();
  //         console.error("Small image upload failed:", errorData);
  //         toast.error(
  //           `Small image upload failed: ${errorData.message || "Unknown error"}`
  //         );
  //         return;
  //       }
  //     }

  //     // Exit edit mode
  //     setIsEditing(false);
  //     toast.success("Hero section saved with S3 URLs!");
  //   } catch (error) {
  //     console.error("Error saving hero section:", error);
  //     toast.error("Error saving changes. Please try again.");
  //   } finally {
  //     setIsUploading(false);
  //   }
  // };
  // Updated Save button handler - uploads cropped images to S3 - FIXED
  const handleSave = async () => {
    try {
      setIsUploading(true);

      // Upload main image if cropped
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
        formData.append("sectionName", "hero");
        // Use unique filename with timestamp to avoid conflicts
        formData.append("imageField", `heroImage_${Date.now()}`);
        formData.append("templateSelection", templateSelection);

        console.log("Uploading hero image to S3:", pendingImageFile);

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
          updateField("heroImage", uploadData.imageUrl);
          setPendingImageFile(null);
          console.log("Main image uploaded to S3:", uploadData.imageUrl);
          toast.success("Hero image uploaded to S3 successfully!");
        } else {
          const errorData = await uploadResponse.json();
          console.error("Main image upload failed:", errorData);
          toast.error(
            `Main image upload failed: ${errorData.message || "Unknown error"}`
          );
          return;
        }
      }

      // Upload small image if cropped
      if (pendingSmallImageFile) {
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
        formData.append("file", pendingSmallImageFile);
        formData.append("sectionName", "hero");
        // Use unique filename with timestamp to avoid conflicts
        formData.append("imageField", `hero3Image_${Date.now()}`);
        formData.append("templateSelection", templateSelection);

        console.log("Uploading small image to S3:", pendingSmallImageFile);

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
          updateField("hero3Image", uploadData.imageUrl);
          setPendingSmallImageFile(null);
          console.log("Small image uploaded to S3:", uploadData.imageUrl);
          toast.success("Small image uploaded to S3 successfully!");
        } else {
          const errorData = await uploadResponse.json();
          console.error("Small image upload failed:", errorData);
          toast.error(
            `Small image upload failed: ${errorData.message || "Unknown error"}`
          );
          return;
        }
      }

      // Exit edit mode
      setIsEditing(false);
      toast.success("Hero section saved with S3 URLs!");
    } catch (error) {
      console.error("Error saving hero section:", error);
      toast.error("Error saving changes. Please try again.");
    } finally {
      setIsUploading(false);
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
                Crop{" "}
                {croppingFor === "heroImage" ? "Hero Image" : "Small Image"}
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
                    className={`px-3 py-2 text-sm rounded border ${aspectRatio === 1
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white text-gray-700 border-gray-300"
                      }`}
                  >
                    1:1 (Square)
                  </button>
                  <button
                    onClick={() => setAspectRatio(4 / 3)}
                    className={`px-3 py-2 text-sm rounded border ${aspectRatio === 4 / 3
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white text-gray-700 border-gray-300"
                      }`}
                  >
                    4:3 (Standard)
                  </button>
                  <button
                    onClick={() => setAspectRatio(16 / 9)}
                    className={`px-3 py-2 text-sm rounded border ${aspectRatio === 16 / 9
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

      {/* Rest of your Hero component remains exactly the same */}
      <section
        id="home"
        className="pt-20 mt-[4rem] pb-16 bg-background relative overflow-hidden theme-transition"
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
                <motion.div
                  className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary border border-primary/20 mb-4"
                  variants={itemVariants}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {isEditing ? (
                    <div className="relative">
                      <input
                        value={heroState.badgeText}
                        onChange={(e) =>
                          updateField("badgeText", e.target.value)
                        }
                        maxLength={25}
                        className={`bg-transparent hover:bg-blue-200 border-b border-primary text-sm outline-none ${heroState.badgeText.length >= 25
                          ? "border-red-500"
                          : ""
                          }`}
                      />
                      <div className="absolute -bottom-5 left-0 text-xs text-red-500 font-bold">
                        {heroState.badgeText.length >= 25 && "Limit reached!"}
                      </div>
                    </div>
                  ) : (
                    <span className="font-bold text-sm">
                      {heroState.badgeText}
                    </span>
                  )}
                </motion.div>

                {/* Heading */}
                <motion.div variants={itemVariants}>
                  {isEditing ? (
                    <>
                      <div className="relative">
                        <textarea
                          value={heroState.heading}
                          onChange={(e) =>
                            updateField("heading", e.target.value)
                          }
                          maxLength={80}
                          className={`bg-transparent border-b border-foreground text-4xl md:text-6xl leading-tight outline-none w-full max-w-lg ${heroState.heading.length >= 80
                            ? "border-red-500"
                            : ""
                            }`}
                        />
                        <div className="text-right text-xs text-gray-500 mt-1">
                          {heroState.heading.length}/80
                          {heroState.heading.length >= 80 && (
                            <span className="ml-2 text-red-500 font-bold">
                              Limit reached!
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="relative">
                        <input
                          value={heroState.highlight}
                          onChange={(e) =>
                            updateField("highlight", e.target.value)
                          }
                          maxLength={30}
                          className={`bg-transparent border-b border-primary text-4xl md:text-6xl text-primary outline-none ${heroState.highlight.length >= 30
                            ? "border-red-500"
                            : ""
                            }`}
                        />
                        <div className="text-right text-xs text-gray-500 mt-1">
                          {heroState.highlight.length}/30
                          {heroState.highlight.length >= 30 && (
                            <span className="ml-2 text-red-500 font-bold">
                              Limit reached!
                            </span>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <h1 className="text-4xl md:text-6xl text-foreground leading-tight">
                      {heroState.heading}{" "}
                      <span className="text-primary">
                        {heroState.highlight}
                      </span>
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
                        className={`bg-transparent border-b text-xl text-muted-foreground outline-none w-full max-w-lg ${heroState.description.length >= 500
                          ? "border-red-500"
                          : "border-muted-foreground"
                          }`}
                      />
                      <div
                        className={`absolute right-0 top-full mt-1 text-xs ${heroState.description.length >= 500
                          ? "text-red-500"
                          : "text-gray-500"
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
                    <p className="text-xl text-muted-foreground max-w-lg inline">
                      {heroState.description}
                      <span className="text-red-accent font-semibold">
                        {heroState.highlightDesc}
                      </span>
                      .
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
                  <>
                    <div className="relative">
                      <input
                        value={heroState.primaryBtn}
                        onChange={(e) =>
                          updateField("primaryBtn", e.target.value)
                        }
                        maxLength={30}
                        className={`bg-transparent border-b border-primary outline-none max-w-[200px] ${heroState.primaryBtn.length >= 30
                          ? "border-red-500"
                          : ""
                          }`}
                      />
                      <div className="text-right text-xs text-gray-500 mt-1">
                        {heroState.primaryBtn.length}/30
                        {heroState.primaryBtn.length >= 30 && (
                          <span className="ml-2 text-red-500 font-bold">
                            Character limit reached!
                          </span>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <Button
                      size="lg"
                      className="bg-primary text-primary-foreground shadow-xl"
                    >
                      <a href="#contact">{heroState.primaryBtn}</a>
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </>
                )}
              </motion.div>

              {/* Trust text */}
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
                        className={`bg-transparent border-b border-muted-foreground text-sm outline-none ${heroState.trustText.length >= 60
                          ? "border-red-500"
                          : ""
                          }`}
                      />
                      <div className="text-right text-xs text-gray-500 mt-1">
                        {heroState.trustText.length}/60
                        {heroState.trustText.length >= 60 && (
                          <span className="ml-2 text-red-500 font-bold">
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

              {/* Stats */}
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
                            className={`bg-transparent border-b border-foreground font-bold text-2xl outline-none ${s.value.length >= 15 ? "border-red-500" : ""
                              }`}
                          />
                          <div className="text-right text-xs text-gray-500 mt-1">
                            {s.value.length}/15
                            {s.value.length >= 15 && (
                              <span className="ml-2 text-red-500 font-bold">
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
                            className={`bg-transparent border-b border-muted-foreground text-sm outline-none ${s.label.length >= 25 ? "border-red-500" : ""
                              }`}
                          />
                          <div className="text-right text-xs text-gray-500 mt-1">
                            {s.label.length}/25
                            {s.label.length >= 25 && (
                              <span className="ml-2 text-red-500 font-bold">
                                Limit reached!
                              </span>
                            )}
                          </div>
                        </div>

                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          whileHover={{ scale: 1.2 }}
                          onClick={() => removeStat(s.id)}
                          className="text-red-500 cursor-pointer text-xs"
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
            </motion.div>

            {/* Hero Image */}
            <motion.div
              className="relative"
              initial="hidden"
              animate="visible"
              variants={itemVariants}
            >
              {isEditing && (
                <div className="mb-4 space-y-4 p-2 bg-white/80 rounded shadow">
                  <div>
                    {/* Recommended Size Above Image */}
                    <div className="mb-2 bg-black/70 text-white text-xs p-1 rounded text-center">
                      Recommended: 1200×900px (4:3 ratio)
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleHeroImageSelect}
                      className="text-sm font-bold border-2 border-dashed border-muted-foreground p-2 rounded w-full"
                    />
                    {pendingImageFile && (
                      <p className="text-xs text-green-600 mt-1 text-center">
                        ✓ Image cropped and ready to upload
                      </p>
                    )}
                  </div>
                  <div>
                    {/* Recommended Size Above Image */}
                    <div className="mb-2 bg-black/70 text-white text-xs p-1 rounded text-center">
                      Recommended: 400×400px (1:1 ratio)
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSmallImageSelect}
                      className="text-sm border-2 border-dashed border-muted-foreground p-2 rounded w-full"
                    />
                    {pendingSmallImageFile && (
                      <p className="text-xs text-green-600 mt-1 text-center">
                        ✓ Small image cropped and ready to upload
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Main image container */}
              <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto">
                <motion.div className="relative" variants={imageVariants}>
                  <div className="relative">
                    <img
                      src={heroState.heroImage}
                      alt="Modern business team collaborating"
                      className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-3xl shadow-2xl"
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
                        className="w-48 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-cover rounded-2xl shadow-xl border-4 border-white"
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
                    transition={{ delay: 0.6, type: "spring", stiffness: 300 }}
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Edit/Save Buttons */}
          <div className="absolute top-4 right-4">
            {/* <div className="flex justify-end mt-6"> */}
            {isEditing ? (
              <motion.button
                whileHover={{ y: -1, scaleX: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleSave}
                disabled={isUploading}
                className={`${isUploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:shadow-2xl"
                  } text-white px-4 py-2 rounded shadow-xl hover:font-semibold`}
              >
                {isUploading ? "Uploading..." : "Save"}
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
      </section>
    </>
  );
}
