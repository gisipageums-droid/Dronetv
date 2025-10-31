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
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef(null);

  // Default content with images
  const defaultContent = heroData || {
    heading: "A healthy meal delivered",
    subheading: "to your door, every single day",
    description:
      "The smart 365-days-per-year food subscription that will make you eat healthy again. Tailored to your personal tastes and nutritional needs.",
    primaryBtn: "Start eating well",
    secondaryBtn: "Learn more",
    primaryButtonLink: "#cta",
    secondaryButtonLink: "#how",
    trustText: "Over 250,000+ meals delivered last year!",
    hero1Image: Hero1,
    hero3Image: Hero3,
    customerImages: customerImages,
  };

  // Consolidated state
  const [heroState, setHeroState] = useState(defaultContent);
  const [tempHeroState, setTempHeroState] = useState(defaultContent);

  // Cropping states (same as Header.tsx)
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

  // Pending image files for S3 upload
  const [pendingImageFiles, setPendingImageFiles] = useState({
    hero1Image: null,
    hero3Image: null,
    customerImages: Array(6).fill(null),
  });

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

  // Logo cropping functionality (same as Header.tsx)
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
      setAspectRatio(field === "customerImage" ? 1 : 4/3); // Square for customer images, standard for others
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
    };
    reader.readAsDataURL(file);

    e.target.value = "";
  };

  // Cropper functions (same as Header.tsx)
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

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

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
      pixelCrop.width,
      pixelCrop.height
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

      const { file, previewUrl } = await getCroppedImg(
        imageToCrop,
        croppedAreaPixels,
        rotation
      );

      // Update preview immediately based on field type
      if (cropField === "hero1Image" || cropField === "hero3Image") {
        setTempHeroState((prev) => ({ ...prev, [cropField]: previewUrl }));
        setPendingImageFiles((prev) => ({ ...prev, [cropField]: file }));
      } else if (cropField === "customerImage" && cropIndex !== null) {
        const updatedCustomerImages = [...tempHeroState.customerImages];
        updatedCustomerImages[cropIndex] = previewUrl;
        setTempHeroState((prev) => ({ 
          ...prev, 
          customerImages: updatedCustomerImages 
        }));

        setPendingImageFiles((prev) => {
          const updatedCustomerFiles = [...prev.customerImages];
          updatedCustomerFiles[cropIndex] = file;
          return { ...prev, customerImages: updatedCustomerFiles };
        });
      }

      setShowCropper(false);
      setImageToCrop(null);
      setOriginalFile(null);
    } catch (error) {
      console.error("Error cropping image:", error);
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

  const handleSave = async () => {
    if (!userId || !publishedId || !templateSelection) {
      console.error("Missing user information for upload");
      return;
    }

    try {
      setIsSaving(true);

      let updatedState = { ...tempHeroState };
      let uploadPromises = [];

      // Upload hero1Image if there's a pending file
      if (pendingImageFiles.hero1Image) {
        const formData = new FormData();
        formData.append("file", pendingImageFiles.hero1Image);
        formData.append("sectionName", "hero");
        formData.append("imageField", "hero1Image" + Date.now());
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
              updatedState.hero1Image = uploadData.imageUrl;
              console.log("Hero1 image uploaded to S3:", uploadData.imageUrl);
            } else {
              const errorData = await response.json();
              console.error(
                `Hero1 image upload failed: ${
                  errorData.message || "Unknown error"
                }`
              );
              throw new Error(`Hero1 upload failed`);
            }
          })
        );
      }

      // Upload hero3Image if there's a pending file
      if (pendingImageFiles.hero3Image) {
        const formData = new FormData();
        formData.append("file", pendingImageFiles.hero3Image);
        formData.append("sectionName", "hero");
        formData.append("imageField", "hero3Image" + Date.now());
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
              updatedState.hero3Image = uploadData.imageUrl;
              console.log("Hero3 image uploaded to S3:", uploadData.imageUrl);
            } else {
              const errorData = await response.json();
              console.error(
                `Hero3 image upload failed: ${
                  errorData.message || "Unknown error"
                }`
              );
              throw new Error(`Hero3 upload failed`);
            }
          })
        );
      }

      // Upload customer images if there are pending files
      for (let i = 0; i < pendingImageFiles.customerImages.length; i++) {
        if (pendingImageFiles.customerImages[i]) {
          const formData = new FormData();
          formData.append("file", pendingImageFiles.customerImages[i]);
          formData.append("sectionName", "hero");
          formData.append("imageField", `customerImage` + Date.now());
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
                updatedState.customerImages[i] = uploadData.imageUrl;
                console.log(
                  `Customer image ${i} uploaded to S3:`,
                  uploadData.imageUrl
                );
              } else {
                const errorData = await response.json();
                console.error(
                  `Customer image ${i} upload failed: ${
                    errorData.message || "Unknown error"
                  }`
                );
                throw new Error(`Customer image ${i} upload failed`);
              }
            })
          );
        }
      }

      // Wait for all uploads to complete
      if (uploadPromises.length > 0) {
        await Promise.all(uploadPromises);
      }

      // Clear pending files
      setPendingImageFiles({
        hero1Image: null,
        hero3Image: null,
        customerImages: Array(6).fill(null),
      });

      // Update both states with the new URLs
      setHeroState(updatedState);
      setTempHeroState(updatedState);

      setIsEditing(false);
      console.log("Hero section saved successfully");
    } catch (error) {
      console.error("Error saving hero section:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTempHeroState(heroState);
    setPendingImageFiles({
      hero1Image: null,
      hero3Image: null,
      customerImages: Array(6).fill(null),
    });
    setIsEditing(false);
  };

  // Stable update functions with useCallback
  const updateTempContent = useCallback((field, value) => {
    setTempHeroState((prev) => ({ ...prev, [field]: value }));
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
              value={value}
              onChange={handleChange}
              className={`${baseClasses} p-3 resize-none ${className}`}
              placeholder={placeholder}
              rows={4}
              maxLength={maxLength}
            />
          ) : (
            <input
              type="text"
              value={value}
              onChange={handleChange}
              className={`${baseClasses} p-2 ${className}`}
              placeholder={placeholder}
              maxLength={maxLength}
            />
          )}
          {maxLength && (
            <div className="text-right text-xs text-gray-300 mt-1">
              {value.length}/{maxLength}
            </div>
          )}
        </div>
      );
    };
  }, [updateTempContent]);

  return (
    <>
      {/* Cropping Modal - Same as Header.tsx */}
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
            <div className="flex-1 relative bg-gray-900 min-h-0">
              <div className="relative w-full h-full">
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
            </div>

            {/* Controls - Same as Header.tsx */}
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              {/* Aspect Ratio Buttons */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Aspect Ratio:</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setAspectRatio(1)}
                    className={`px-3 py-2 text-sm rounded border ${
                      aspectRatio === 1 
                        ? 'bg-blue-500 text-white border-blue-500' 
                        : 'bg-white text-gray-700 border-gray-300'
                    }`}
                  >
                    1:1 (Square)
                  </button>
                  <button
                    onClick={() => setAspectRatio(4/3)}
                    className={`px-3 py-2 text-sm rounded border ${
                      aspectRatio === 4/3 
                        ? 'bg-blue-500 text-white border-blue-500' 
                        : 'bg-white text-gray-700 border-gray-300'
                    }`}
                  >
                    4:3 (Standard)
                  </button>
                  <button
                    onClick={() => setAspectRatio(16/9)}
                    className={`px-3 py-2 text-sm rounded border ${
                      aspectRatio === 16/9 
                        ? 'bg-blue-500 text-white border-blue-500' 
                        : 'bg-white text-gray-700 border-gray-300'
                    }`}
                  >
                    16:9 (Widescreen)
                  </button>
                </div>
              </div>

              {/* Zoom Control */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">Zoom</span>
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
      
      {/* Rest of the hero section remains exactly the same */}
      <section
        id="home"
        ref={heroRef}
        className="relative h-100vh flex items-center py-52 sm:px-6 lg:px-8 lg:pb-32"
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
              <Button
                onClick={handleSave}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white shadow-md"
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isSaving ? "Saving..." : "Save"}
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
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center">
            <motion.div
              className="space-y-8 text-center lg:text-left order-2 lg:order-1"
              initial="hidden"
              animate="visible"
              variants={itemVariants}
            >
              {!isEditing ? (
                <motion.h1
                  className="text-3xl sm:text-4xl md:text-5xl xl:text-3xl font-bold text-white leading-tight px-2 sm:px-0"
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
                    className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold leading-tight"
                    placeholder="Main heading"
                    maxLength={100}
                  />
                  <EditableText
                    value={tempHeroState.subheading}
                    field="subheading"
                    className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold text-yellow-400"
                    placeholder="Sub heading"
                    maxLength={200}
                  />
                </div>
              )}

              {!isEditing ? (
                <motion.p
                  className="text-base sm:text-md lg:text-md text-gray-200 max-w-2xl mx-auto lg:mx-0 px-2 sm:px-0 leading-relaxed"
                  variants={itemVariants}
                >
                  {heroState.description}
                </motion.p>
              ) : (
                <EditableText
                  value={tempHeroState.description}
                  field="description"
                  multiline
                  className="text-base sm:text-lg lg:text-xl text-gray-200 leading-relaxed"
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
                    href={heroState.primaryButtonLink}
                    className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 rounded-full px-8 py-4 font-semibold transition-all duration-300 transform hover:scale-105 inline-block text-center"
                  >
                    {heroState.primaryBtn}
                  </a>
                  <a
                    href={heroState.secondaryButtonLink}
                    className="text-white border border-white hover:bg-white hover:text-gray-900 rounded-full px-8 py-4 font-semibold transition-all duration-300 inline-block text-center"
                  >
                    {heroState.secondaryBtn}
                  </a>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  <EditableText
                    value={tempHeroState.primaryBtn}
                    field="primaryBtn"
                    placeholder="Primary button text"
                    maxLength={50}
                  />
                  <EditableText
                    value={tempHeroState.secondaryBtn}
                    field="secondaryBtn"
                    placeholder="Secondary button text"
                    maxLength={50}
                  />
                  <EditableText
                    value={tempHeroState.primaryButtonLink}
                    field="primaryButtonLink"
                    placeholder="Primary button link"
                    maxLength={200}
                  />
                  <EditableText
                    value={tempHeroState.secondaryButtonLink}
                    field="secondaryButtonLink"
                    placeholder="Secondary button link"
                    maxLength={200}
                  />
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
                      {isEditing && pendingImageFiles.customerImages[i] && (
                        <div className="absolute -bottom-6 left-0 text-xs text-orange-300 bg-black/70 px-1 rounded">
                          Pending
                        </div>
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
                    maxLength={100}
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
                      className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-3xl shadow-2xl"
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
                    {isEditing && pendingImageFiles.hero1Image && (
                      <div className="absolute top-2 left-2 text-xs text-orange-300 bg-black/70 px-2 py-1 rounded">
                        Pending upload
                      </div>
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
                        className="w-48 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-cover rounded-2xl shadow-xl border-4 border-white"
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
                      {isEditing && pendingImageFiles.hero3Image && (
                        <div className="absolute -top-6 left-0 text-xs text-orange-300 bg-black/70 px-1 rounded">
                          Pending
                        </div>
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