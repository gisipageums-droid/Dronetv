
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Edit2, Save, X, Loader2, Upload, RotateCw, ZoomIn } from "lucide-react";
import Cropper from "react-easy-crop";
import HeroBackground from "../public/images/Hero/HeroBackground.jpg";

// Sample images (replace with your actual imports)
const Hero1 = "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800";
const Hero3 =
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400";
const Cust1 =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100";
const Cust2 =
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100";
const Cust3 =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100";
const Cust4 =
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100";
const Cust5 =
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100";
const Cust6 =
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100";

const customerImages = [Cust1, Cust2, Cust3, Cust4, Cust5, Cust6];

const itemVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
};

const imageVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function EditableHero({
  heroData,
  onStateChange,
  userId,
  publishedId,
  templateSelection,
  companyName,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState("idle"); // idle, saving, saved, error
  const heroRef = useRef(null);
  const saveTimeoutRef = useRef(null);
  const lastSavedStateRef = useRef(null);

  // Default content with images
  const defaultContent = {
    heading: heroData?.heading || "A healthy meal delivered",
    subheading: heroData?.subheading || "to your door, every single day",
    description:
      heroData?.description ||
      "The smart 365-days-per-year food subscription that will make you eat healthy again. Tailored to your personal tastes and nutritional needs.",
    primaryBtn: heroData?.primaryBtn || "Start eating well",
    secondaryBtn: heroData?.secondaryBtn || "Learn more",
    primaryButtonLink: heroData?.primaryButtonLink || "#cta",
    secondaryButtonLink: heroData?.secondaryButtonLink || "#how",
    trustText: heroData?.trustText || "Over 250,000+ meals delivered last year!",
    hero1Image: heroData?.hero1Image || Hero1,
    hero3Image: heroData?.hero3Image || Hero3,
    customerImages: heroData?.customerImages || customerImages,
    badgeText: heroData?.badgeText || "Your Company",
  };

  // Consolidated state
  const [heroState, setHeroState] = useState({
    ...defaultContent,
  });
  const [tempHeroState, setTempHeroState] = useState({
    ...defaultContent,
  });

  // Cropping states
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [cropField, setCropField] = useState(null);
  const [cropIndex, setCropIndex] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Auto-save functionality
  const autoSave = useCallback(async (stateToSave, imageField = null, imageFile = null) => {
    if (!userId || !publishedId || !templateSelection) {
      console.error("Missing user information for upload");
      return;
    }

    try {
      setAutoSaveStatus("saving");
      setIsSaving(true);

      let updatedState = { ...stateToSave };
      const uploadPromises = [];

      // Upload image if provided (from cropping)
      if (imageFile && imageField) {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("sectionName", "hero");
        formData.append("imageField", `${imageField}-${Date.now()}`);
        formData.append("templateSelection", templateSelection);

        uploadPromises.push(
          fetch(
            `https://o66ziwsye5.execute-api.ap-south-1.amazonaws.com/prod/upload-image/${userId}/${publishedId}`,
            {
              method: "POST",
              body: formData,
            }
          ).then(async (response) => {
            if (response.ok) {
              const uploadData = await response.json();

              // Update the appropriate field with the new URL
              if (imageField === "hero1Image") {
                updatedState.hero1Image = uploadData.imageUrl;
              } else if (imageField === "hero3Image") {
                updatedState.hero3Image = uploadData.imageUrl;
              } else if (imageField.startsWith("customerImage")) {
                const index = parseInt(imageField.split("-")[1]);
                const updatedCustomerImages = [...updatedState.customerImages];
                updatedCustomerImages[index] = uploadData.imageUrl;
                updatedState.customerImages = updatedCustomerImages;
              }

              console.log(`${imageField} uploaded to S3:`, uploadData.imageUrl);
              return uploadData.imageUrl;
            } else {
              const errorData = await response.json();
              console.error(`${imageField} upload failed:`, errorData.message || "Unknown error");
              throw new Error(`${imageField} upload failed`);
            }
          })
        );
      }

      // Wait for all uploads to complete
      if (uploadPromises.length > 0) {
        await Promise.all(uploadPromises);
      }

      // Update state with new URLs
      setHeroState(updatedState);
      setTempHeroState(updatedState);
      lastSavedStateRef.current = updatedState;

      setAutoSaveStatus("saved");

      // Reset status after 2 seconds
      setTimeout(() => {
        setAutoSaveStatus("idle");
      }, 2000);

      console.log("Hero section auto-saved successfully");
    } catch (error) {
      console.error("Error auto-saving hero section:", error);
      setAutoSaveStatus("error");

      // Reset error status after 3 seconds
      setTimeout(() => {
        setAutoSaveStatus("idle");
      }, 3000);
    } finally {
      setIsSaving(false);
      setIsUploadingImage(false);
    }
  }, [userId, publishedId, templateSelection]);

  // Debounced auto-save for text changes
  const scheduleAutoSave = useCallback((newState) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      autoSave(newState);
    }, 1000); // 1 second debounce
  }, [autoSave]);

  // Update temp state and schedule auto-save
  const updateTempContent = useCallback((field, value) => {
    setTempHeroState((prev) => {
      const newState = { ...prev, [field]: value };

      // Schedule auto-save only for text changes (not images)
      if (!field.includes("Image")) {
        scheduleAutoSave(newState);
      }

      return newState;
    });
  }, [scheduleAutoSave]);

  // Handle image upload and direct upload after cropping
  const handleImageUpload = (e, field, index = null) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      console.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      console.error("File size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageToCrop(reader.result);
      setOriginalFile(file);
      setCropField(field);
      setCropIndex(index);
      setShowCropper(true);

      // Lock aspect ratios
      if (field === "hero1Image") {
        setAspectRatio(1080 / 720);
      } else if (field === "hero3Image") {
        setAspectRatio(400 / 267);
      } else if (field === "customerImage") {
        setAspectRatio(1);
      } else {
        setAspectRatio(1080 / 720);
      }

      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
    };
    reader.readAsDataURL(file);

    e.target.value = "";
  };

  // Cropper functions
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  const getCroppedImg = async (imageSrc, pixelCrop, rotation = 0) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    let targetWidth = pixelCrop.width;
    let targetHeight = pixelCrop.height;
    if (cropField === "hero1Image") {
      targetWidth = 1080;
      targetHeight = 720;
    } else if (cropField === "hero3Image") {
      targetWidth = 400;
      targetHeight = 267;
    } else if (cropField === "customerImage") {
      targetWidth = pixelCrop.width;
      targetHeight = pixelCrop.height;
    }

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    ctx.translate(pixelCrop.width / 2, pixelCrop.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-pixelCrop.width / 2, -pixelCrop.height / 2);

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      targetWidth,
      targetHeight
    );

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          const fileName = originalFile
            ? `cropped-${originalFile.name}`
            : `cropped-image-${Date.now()}.jpg`;

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

  const applyCrop = async () => {
    try {
      if (!imageToCrop || !croppedAreaPixels) {
        console.error("Please select an area to crop");
        return;
      }

      setIsUploadingImage(true);
      const { file, previewUrl } = await getCroppedImg(
        imageToCrop,
        croppedAreaPixels,
        rotation
      );

      // Update preview immediately
      if (cropField === "hero1Image" || cropField === "hero3Image") {
        setTempHeroState((prev) => ({ ...prev, [cropField]: previewUrl }));
      } else if (cropField === "customerImage" && cropIndex !== null) {
        const updatedCustomerImages = [...tempHeroState.customerImages];
        updatedCustomerImages[cropIndex] = previewUrl;
        setTempHeroState((prev) => ({
          ...prev,
          customerImages: updatedCustomerImages
        }));
      }

      // Auto-upload the cropped image immediately
      let imageFieldName = cropField;
      if (cropField === "customerImage") {
        imageFieldName = `customerImage-${cropIndex}`;
      }

      await autoSave(tempHeroState, imageFieldName, file);

      setShowCropper(false);
      setImageToCrop(null);
      setOriginalFile(null);
    } catch (error) {
      console.error("Error cropping image:", error);
      setIsUploadingImage(false);
    }
  };

  const cancelCrop = () => {
    setShowCropper(false);
    setImageToCrop(null);
    setOriginalFile(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
  };

  const resetCropSettings = () => {
    setZoom(1);
    setRotation(0);
    setCrop({ x: 0, y: 0 });
  };

  // Manual save for final confirmation (optional)
  const handleManualSave = async () => {
    await autoSave(tempHeroState);
  };

  const handleCancel = () => {
    setTempHeroState(heroState);
    setIsEditing(false);
  };

  useEffect(() => {
    if (onStateChange) {
      onStateChange(heroState);
    }
  }, [heroState, onStateChange]);

  // Intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => {
      if (heroRef.current) observer.unobserve(heroRef.current);
    };
  }, []);

  // Fake API fetch
  const fetchHeroData = async () => {
    setIsLoading(true);
    try {
      const response = await new Promise((resolve) =>
        setTimeout(() => resolve(defaultContent), 1200)
      );
      setHeroState(response);
      setTempHeroState(response);
      lastSavedStateRef.current = response;
      setDataLoaded(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible && !dataLoaded && !isLoading) {
      fetchHeroData();
    }
  }, [isVisible, dataLoaded, isLoading]);

  const handleEdit = () => {
    setIsEditing(true);
    setTempHeroState(heroState);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Memoized EditableText
  const EditableText = useMemo(() => {
    return ({
      value,
      field,
      multiline = false,
      className = "",
      placeholder = "",
      maxLength = null,
    }) => {
      const handleChange = (e) => {
        if (maxLength && e.target.value.length > maxLength) {
          return;
        }
        updateTempContent(field, e.target.value);
      };

      const baseClasses =
        "w-full bg-white/10 backdrop-blur-sm border-2 border-dashed border-yellow-300 rounded focus:border-yellow-400 focus:outline-none text-white placeholder-gray-300";

      return (
        <div className="relative">
          {multiline ? (
            <textarea
              value={value ?? ""}
              onChange={handleChange}
              className={`${baseClasses} p-3 resize-none ${className}`}
              placeholder={placeholder}
              rows={4}
              maxLength={maxLength}
            />
          ) : (
            <input
              type="text"
              value={value ?? ""}
              onChange={handleChange}
              className={`${baseClasses} p-2 ${className}`}
              placeholder={placeholder}
              maxLength={maxLength}
            />
          )}
          {maxLength && (
            <div className=" mt-1 text-xs text-gray-300 whitespace-nowrap">
              {(value?.length ?? 0)}/{maxLength}
            </div>
          )}
        </div>
      );
    };
  }, [updateTempContent]);

  return (
    <>
      {/* Cropping Modal */}
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
                Crop Image {isUploadingImage && "(Uploading...)"}
              </h3>
              <button
                onClick={cancelCrop}
                className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
                disabled={isUploadingImage}
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Cropper Area */}
            <div className="flex-1 relative bg-gray-900 min-h-0">
              <div className="relative w-full h-full">
                <Cropper
                  image={imageToCrop}
                  crop={crop}
                  zoom={zoom}
                  rotation={rotation}
                  aspect={aspectRatio}
                  minZoom={0.5}
                  maxZoom={4}
                  restrictPosition={false}
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
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              {/* Zoom Control */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">Zoom</span>
                  <span className="text-gray-600">{zoom.toFixed(1)}x</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.1).toFixed(2)))}
                    className="px-3 py-1.5 text-sm rounded border bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    disabled={isUploadingImage}
                  >
                    −
                  </button>
                  <input
                    type="range"
                    value={zoom}
                    min={0.5}
                    max={4}
                    step={0.1}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
                    disabled={isUploadingImage}
                  />
                  <button
                    type="button"
                    onClick={() => setZoom((z) => Math.min(4, +(z + 0.1).toFixed(2)))}
                    className="px-3 py-1.5 text-sm rounded border bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    disabled={isUploadingImage}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoom(1)}
                    className="px-3 py-1.5 text-sm rounded border bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    disabled={isUploadingImage}
                  >
                    1x
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={resetCropSettings}
                  className="w-full border border-gray-300 text-gray-700 hover:bg-gray-100 rounded py-2 text-sm font-medium"
                  disabled={isUploadingImage}
                >
                  Reset
                </button>
                <button
                  onClick={cancelCrop}
                  className="w-full border border-gray-300 text-gray-700 hover:bg-gray-100 rounded py-2 text-sm font-medium"
                  disabled={isUploadingImage}
                >
                  Cancel
                </button>
                <button
                  onClick={applyCrop}
                  className="w-full bg-green-600 hover:bg-green-700 text-white rounded py-2 text-sm font-medium flex items-center justify-center"
                  disabled={isUploadingImage}
                >
                  {isUploadingImage ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  {isUploadingImage ? "Uploading..." : "Apply Crop"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Hero Section */}
      <section
        id="home"
        ref={heroRef}
        className="relative h-100vh flex items-center py-52 px-4 sm:px-6 lg:px-8 lg:pb-32"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${HeroBackground}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "scroll",
        }}
      >
        {isLoading && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-30">
            <div className="bg-white rounded-lg p-6 shadow-lg flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              <span className="text-gray-700">Loading content...</span>
            </div>
          </div>
        )}

        <div className="absolute top-40 right-4 z-50">
          {!isEditing ? (
            <Button
              onClick={handleEdit}
              variant="outline"
              size="sm"
              className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-md"
              disabled={isLoading}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              {/* Auto-save status indicator */}
              <div className="flex items-center gap-2 mr-2 text-sm text-white bg-black/50 px-3 py-1 rounded">
                {autoSaveStatus === "saving" && (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Saving...</span>
                  </>
                )}
                {autoSaveStatus === "saved" && (
                  <span className="text-green-400">✓ Saved</span>
                )}
                {autoSaveStatus === "error" && (
                  <span className="text-red-400">✗ Error</span>
                )}
                {autoSaveStatus === "idle" && (
                  <span className="text-gray-300">All changes saved</span>
                )}
              </div>

              <Button
                onClick={handleManualSave}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white shadow-md"
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isSaving ? "Saving..." : "Save Now"}
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                size="sm"
                className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-md"
                disabled={isSaving}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full ">
          {!isEditing ? (
            <p className="text-lg sm:text-xl md:text-2xl  text-[red] relative z-20 mb-8 inline-block font-bold ">{heroState.badgeText}</p>
          ) : (
            <EditableText
              value={tempHeroState.badgeText}
              field="badgeText"
              className="text-lg sm:text-xl md:text-2xl text-left text-[#facc15] relative z-20 mb-12 inline-block max-w-[530px]"
              placeholder="Company Name"
              maxLength={50}
            />
          )}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center">
            <motion.div
              className="space-y-8 text-center lg:text-left order-2 lg:order-1"
              initial="hidden"
              animate="visible"
              variants={itemVariants}
            >
              {!isEditing ? (
                <motion.h1
                  className="text-3xl sm:text-4xl md:text-5xl xl:text-3xl font-bold text-white leading-tight px-2 sm:px-0 text-left"
                  variants={itemVariants}
                >
                  {heroState.heading}
                  <span className="block text-yellow-400 mt-2">
                    {heroState.subheading}
                  </span>
                </motion.h1>
              ) : (
                <div className="space-y-4">
                  <EditableText
                    value={tempHeroState.heading}
                    field="heading"
                    className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold leading-tight text-left"
                    placeholder="Main heading"
                    maxLength={100}
                  />
                  <EditableText
                    value={tempHeroState.subheading}
                    field="subheading"
                    className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold text-yellow-400"
                    placeholder="Sub heading"
                    maxLength={100}
                  />
                </div>
              )}

              {!isEditing ? (
                <motion.p
                  className="text-base sm:text-md lg:text-md text-gray-200 max-w-2xl mx-auto lg:mx-0 px-2 sm:px-0 leading-relaxed "
                  variants={itemVariants}
                >
                  {heroState.description}
                </motion.p>
              ) : (
                <EditableText
                  value={tempHeroState.description}
                  field="description"
                  multiline
                  className="text-base sm:text-lg lg:text-xl text-gray-200 leading-relaxed "
                  placeholder="Hero description"
                  maxLength={500}
                />
              )}

              {!isEditing ? (
                <motion.div
                  className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start px-2 sm:px-0"
                  variants={itemVariants}
                >
                  <a
                    href="#contact"
                    className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 rounded-full px-8 py-4 font-semibold transition-all duration-300 transform hover:scale-105 inline-block text-center"
                  >
                    {heroState.primaryBtn}
                  </a>
                </motion.div>
              ) : (
                <div className="space-y-2">
                  <EditableText
                    value={tempHeroState.primaryBtn}
                    field="primaryBtn"
                    placeholder="Primary button text"
                    maxLength={50}
                  />
                  <div className="text-xs text-gray-300">This button redirects to the contact section.</div>
                </div>
              )}

              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-6 pt-8 px-2 sm:px-0"
                variants={itemVariants}
              >
                <div className="flex -space-x-2">
                  {tempHeroState.customerImages.map((img, i) => (
                    <motion.div
                      key={i}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white shadow-lg bg-cover bg-center relative"
                      style={{ backgroundImage: `url('${img}')` }}
                      whileHover={{ scale: 1.2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {isEditing && (
                        <label className="absolute inset-0 bg-black/70 opacity-0 hover:opacity-100 flex items-center justify-center rounded-full cursor-pointer transition-opacity">
                          <Upload className="w-4 h-4 text-white" />
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageUpload(e, "customerImage", i)}
                          />
                        </label>
                      )}
                    </motion.div>
                  ))}
                </div>
                {!isEditing ? (
                  <span className="text-sm sm:text-base text-white font-normal">
                    {heroState.trustText}
                  </span>
                ) : (
                  <EditableText
                    value={tempHeroState.trustText}
                    field="trustText"
                    placeholder="Trust text"
                    className="text-sm sm:text-base text-white"
                    maxLength={50}
                  />
                )}
              </motion.div>
            </motion.div>

            <motion.div
              className="relative order-1 lg:order-2 flex justify-center lg:justify-end px-4 sm:px-0"
              initial="hidden"
              animate="visible"
              variants={itemVariants}
            >
              <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl">
                <motion.div className="relative" variants={imageVariants}>
                  <div className="relative">
                    <img
                      src={
                        isEditing
                          ? tempHeroState.hero1Image
                          : heroState.hero1Image
                      }
                      alt="Innovation showcase"
                      className="w-full h-auto max-h-[70vh] object-contain rounded-3xl shadow-2xl scale-110"
                    />
                    {isEditing && (
                      <label className="absolute bottom-2 right-2 bg-black/70 text-white p-2 rounded cursor-pointer hover:bg-black/90 transition-colors">
                        <Upload className="w-4 h-4" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, "hero1Image")}
                        />
                      </label>
                    )}
                  </div>
                  <motion.div
                    className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 lg:-bottom-8 lg:-left-8"
                    variants={imageVariants}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="relative">
                      <img
                        src={
                          isEditing
                            ? tempHeroState.hero3Image
                            : heroState.hero3Image
                        }
                        alt="Tech innovation"
                        className="w-auto max-w-[12rem] sm:max-w-[8rem] lg:max-w-[10rem] h-auto object-contain rounded-2xl shadow-xl border-4 border-white scale-110"
                      />
                      {isEditing && (
                        <label className="absolute bottom-1 right-1 bg-black/70 text-white p-1 rounded cursor-pointer hover:bg-black/90 transition-colors">
                          <Upload className="w-3 h-3" />
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageUpload(e, "hero3Image")}
                          />
                        </label>
                      )}
                    </div>
                  </motion.div>
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
        </div>
      </section>
    </>
  );
}