

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Edit,
  Save,
  Plus,
  Trash2,
} from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { toast } from "react-toastify";
import Cropper from "react-easy-crop";

const Gallery = ({
  galleryData,
  onStateChange,
  userId,
  publishedId,
  templateSelection,
}) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [pendingImages, setPendingImages] = useState<Record<number, File>>({});

  // Cropping states
  const [showCropper, setShowCropper] = useState(false);
  const [croppingIndex, setCroppingIndex] = useState<number | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [mediaSize, setMediaSize] = useState<{ width: number; height: number; naturalWidth: number; naturalHeight: number } | null>(null);
  const [cropAreaSize, setCropAreaSize] = useState<{ width: number; height: number } | null>(null);
  const [minZoomDynamic, setMinZoomDynamic] = useState(0.1);
  const [isDragging, setIsDragging] = useState(false);
  const PAN_STEP = 10;

  // Track initial state to detect changes
  const initialGalleryState = useRef(null);

  useEffect(() => {
    if (mediaSize && cropAreaSize) {
      setMinZoomDynamic(0.1);
    }
  }, [mediaSize, cropAreaSize]);

  // Arrow keys to pan image inside crop area when cropper is open
  const nudge = useCallback((dx: number, dy: number) => {
    setCrop((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
  }, []);

  useEffect(() => {
    if (!showCropper) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); nudge(-PAN_STEP, 0); }
      else if (e.key === "ArrowRight") { e.preventDefault(); nudge(PAN_STEP, 0); }
      else if (e.key === "ArrowUp") { e.preventDefault(); nudge(0, -PAN_STEP); }
      else if (e.key === "ArrowDown") { e.preventDefault(); nudge(0, PAN_STEP); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showCropper, nudge]);

  // Consolidated state with new structure
  const [contentState, setContentState] = useState(() => {
    const initialState = galleryData || {
      heading: {
        title: "Our Work Gallery",
        description:
          "Showcasing 0+ years of professional excellence and successful project deliveries",
      },
      categories: [
        "All",
        "Portfolio",
        "Professional Services",
        "Client Projects",
      ],
      images: [
        {
          id: 1.0,
          url: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80",
          title: "Professional Work 1",
          category: "Portfolio",
          description:
            "Showcase of our professional services - Professional Work 1",
          isPopular: true,
        },
        {
          id: 2.0,
          url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
          title: "Professional Work 2",
          category: "Portfolio",
          description:
            "Showcase of our professional services - Professional Work 2",
          isPopular: true,
        },
        {
          id: 3.0,
          url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
          title: "Professional Work 3",
          category: "Portfolio",
          description:
            "Showcase of our professional services - Professional Work 3",
          isPopular: false,
        },
        {
          id: 4.0,
          url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
          title: "Professional Work 4",
          category: "Portfolio",
          description:
            "Showcase of our professional services - Professional Work 4",
          isPopular: false,
        },
        {
          id: 5.0,
          url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
          title: "Professional Work 5",
          category: "Portfolio",
          description:
            "Showcase of our professional services - Professional Work 5",
          isPopular: false,
        },
        {
          id: 6.0,
          url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80",
          title: "Professional Work 6",
          category: "Portfolio",
          description:
            "Showcase of our professional services - Professional Work 6",
          isPopular: false,
        },
      ],
    };
    initialGalleryState.current = initialState;
    return initialState;
  });

  // Add this useEffect to notify parent of state changes immediately
  useEffect(() => {
    if (onStateChange) {
      onStateChange(contentState);
    }

    // Check if there are any changes from initial state
    const hasChanges = JSON.stringify(contentState) !== JSON.stringify(initialGalleryState.current);
    setHasUnsavedChanges(hasChanges);
  }, [contentState, onStateChange]);

  // Update function for gallery images - now updates immediately
  const updateImageField = (index, field, value) => {
    setContentState((prev) => ({
      ...prev,
      images: prev.images.map((img, i) =>
        i === index ? { ...img, [field]: value } : img
      ),
    }));
  };

  // Add a new image - with maximum 6 images limit - now updates immediately
  const addImage = () => {
    if (contentState.images.length >= 6) {
      toast.error("Maximum 6 images allowed in gallery");
      return;
    }

    setContentState((prev) => ({
      ...prev,
      images: [
        ...prev.images,
        {
          id: Date.now(),
          url: null,
          title: "New Image",
          category: "Portfolio",
          description: "New image description",
          isPopular: false,
        },
      ],
    }));
  };

  // Remove an image - now updates immediately
  const removeImage = (index) => {
    setContentState((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Update function for header - now updates immediately
  const updateHeaderField = (field, value) => {
    setContentState((prev) => ({
      ...prev,
      heading: {
        ...prev.heading,
        [field]: value,
      },
    }));
  };

  // NEW: Function to upload image to AWS
  const uploadImageToAWS = async (file, imageField) => {
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
    formData.append("sectionName", "gallery");
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
        return uploadData.imageUrl;
      } else {
        const errorData = await uploadResponse.json();
        console.error(`${imageField} upload failed:`, errorData);
        toast.error(
          `${imageField} upload failed: ${errorData.message || "Unknown error"}`
        );
        return null;
      }
    } catch (error) {
      console.error(`Error uploading ${imageField}:`, error);
      toast.error(`Error uploading image. Please try again.`);
      return null;
    }
  };

  // Handle cancel editing
  const handleCancel = () => {
    // Reset to initial state
    setContentState(initialGalleryState.current);
    setPendingImages({});
    setHasUnsavedChanges(false);
    setIsEditing(false);
  };

  // Image selection handler - now opens cropper
  const handleGalleryImageSelect = async (index, e) => {
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
      setCroppingIndex(index);
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

  // Function to get cropped image - FIXED FOR 4:3 RATIO
  const getCroppedImg = async (imageSrc, pixelCrop) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Fixed output size for 4:3 ratio
    const outputWidth = 600;
    const outputHeight = 450;

    canvas.width = outputWidth;
    canvas.height = outputHeight;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      outputWidth,
      outputHeight
    );

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          const pngName = originalFile
            ? `cropped-gallery-${croppingIndex}-${originalFile.name.replace(/\.[^.]+$/, "")}.png`
            : `cropped-gallery-${croppingIndex}-${Date.now()}.png`;

          const file = new File([blob as BlobPart], pngName, {
            type: "image/png",
            lastModified: Date.now(),
          });

          const previewUrl = URL.createObjectURL(blob as Blob);

          resolve({
            file,
            previewUrl,
          });
        },
        "image/png"
      );
    });
  };

  // Apply crop and UPLOAD IMMEDIATELY to AWS - UPDATED
  const applyCrop = async () => {
    try {
      if (!imageToCrop || !croppedAreaPixels || croppingIndex === null) return;

      setIsUploading(true);

      const { file, previewUrl } = await getCroppedImg(
        imageToCrop,
        croppedAreaPixels
      );

      // Show preview immediately with blob URL (temporary)
      updateImageField(croppingIndex, "url", previewUrl);

      // UPLOAD TO AWS IMMEDIATELY
      const imageField = `images[${croppingIndex}].url`;
      const awsImageUrl = await uploadImageToAWS(file, imageField);

      if (awsImageUrl) {
        // Update with actual S3 URL
        updateImageField(croppingIndex, "url", awsImageUrl);

        // Remove from pending images since it's uploaded
        setPendingImages((prev) => {
          const newPending = { ...prev };
          delete newPending[croppingIndex];
          return newPending;
        });

        toast.success("Image cropped and uploaded to AWS successfully!");
      } else {
        // If upload fails, keep the preview URL and set as pending
        setPendingImages((prev) => ({ ...prev, [croppingIndex]: file }));
        toast.warning("Image cropped but upload failed. It will be saved locally.");
      }

      setShowCropper(false);
      setImageToCrop(null);
      setOriginalFile(null);
      setCroppingIndex(null);
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
    setCroppingIndex(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  // Reset zoom and rotation
  const resetCropSettings = () => {
    setZoom(1);
    setCrop({ x: 0, y: 0 });
  };

  // Save button handler - only handles text changes and failed uploads now
  const handleSave = async () => {
    try {
      setIsUploading(true);

      // Upload any pending images that failed during automatic upload
      for (const [indexStr, file] of Object.entries(pendingImages)) {
        const index = parseInt(indexStr);

        const imageField = `images[${index}].url`;
        const awsImageUrl = await uploadImageToAWS(file, imageField);

        if (awsImageUrl) {
          // Replace local preview with S3 URL
          updateImageField(index, "url", awsImageUrl);
        } else {
          toast.error(`Failed to upload image for gallery item ${index}`);
          return;
        }
      }

      // Update initial state reference to current state
      initialGalleryState.current = contentState;
      setHasUnsavedChanges(false);

      // Clear pending images
      setPendingImages({});
      // Exit edit mode
      setIsEditing(false);
      toast.success("Gallery section saved!");
    } catch (error) {
      console.error("Error saving gallery section:", error);
      toast.error("Error saving changes. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const openLightbox = (index: number) => {
    if (!isEditing) {
      setSelectedImage(index);
    }
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const goToNext = () => {
    if (selectedImage !== null) {
      setSelectedImage((prev) =>
        prev === contentState.images.length - 1 ? 0 : prev! + 1
      );
    }
  };

  const goToPrev = () => {
    if (selectedImage !== null) {
      setSelectedImage((prev) =>
        prev === 0 ? contentState.images.length - 1 : prev! - 1
      );
    }
  };

  const { theme } = useTheme();

  return (
    <>
      {/* Image Cropper Modal - FIXED ASPECT RATIO */}
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
                Crop Gallery Image (4:3 Ratio)
              </h3>
              <button
                onClick={cancelCrop}
                className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Cropper Area */}
            <div className={`flex-1 relative bg-gray-900 min-h-0 ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}>
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                aspect={4 / 3} // ✅ FIXED ASPECT RATIO
                minZoom={minZoomDynamic}
                maxZoom={5}
                restrictPosition={false}
                zoomWithScroll={true}
                zoomSpeed={0.2}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                onMediaLoaded={(ms) => setMediaSize(ms)}
                onCropAreaChange={(area, areaPixels) => setCropAreaSize(area)}
                onInteractionStart={() => setIsDragging(true)}
                onInteractionEnd={() => setIsDragging(false)}
                showGrid={true} // ✅ Better alignment
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
                  max={5}
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
                  className={`w-full ${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white rounded py-2 text-sm font-medium`}
                >
                  {isUploading ? "Uploading..." : "Apply Crop"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Main Gallery Section */}
      <section
        id="gallery"
        className={`theme-transition ${theme === "dark"
          ? "bg-[#1f1f1f] text-gray-100"
          : "bg-gray-50 text-gray-900"
          }`}
      >
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Edit/Save Buttons */}
          <div className="flex justify-end mb-6 gap-2">
            {isEditing ? (
              <>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ y: -1, scaleX: 1.05 }}
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 text-white bg-gray-500 rounded shadow-xl hover:bg-gray-600 hover:font-semibold"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ y: -1, scaleX: 1.1 }}
                  onClick={handleSave}
                  disabled={isUploading}
                  className={`${isUploading
                    ? "bg-gray-400 cursor-not-allowed"
                    : hasUnsavedChanges || Object.keys(pendingImages).length > 0
                      ? "bg-green-600 hover:shadow-2xl"
                      : "bg-gray-400 cursor-not-allowed"
                    } text-white px-4 py-2 rounded shadow-xl hover:font-semibold flex items-center gap-2`}
                >
                  <Save size={16} />
                  {isUploading ? "Uploading..." : "Save"}
                </motion.button>
              </>
            ) : (
              <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ y: -1, scaleX: 1.1 }}
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 text-black bg-yellow-500 rounded shadow-xl cursor-pointer hover:shadow-2xl hover:font-semibold"
              >
                <Edit size={16} />
                Edit
              </motion.button>
            )}
          </div>

          <div className="mb-16 text-center">
            {isEditing ? (
              <>
                <div className="relative">
                  <input
                    type="text"
                    value={contentState.heading.title}
                    onChange={(e) => updateHeaderField("title", e.target.value)}
                    maxLength={80}
                    className={`mb-4 text-3xl font-bold text-center bg-transparent border-b w-full ${contentState.heading.title.length >= 80
                      ? "border-red-500"
                      : ""
                      }`}
                  />
                  <div className="text-right text-xs text-gray-500 mt-1">
                    {contentState.heading.title.length}/80
                    {contentState.heading.title.length >= 80 && (
                      <span className="ml-2 text-red-500 font-bold">
                        Character limit reached!
                      </span>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    value={contentState.heading.description}
                    onChange={(e) =>
                      updateHeaderField("description", e.target.value)
                    }
                    maxLength={250}
                    className={`w-full max-w-3xl mx-auto text-lg text-center bg-transparent border-b ${contentState.heading.description.length >= 250
                      ? "border-red-500"
                      : ""
                      }`}
                  />
                  <div className="text-right text-xs text-gray-500 mt-1">
                    {contentState.heading.description.length}/250
                    {contentState.heading.description.length >= 250 && (
                      <span className="ml-2 text-red-500 font-bold">
                        Character limit reached!
                      </span>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2 className="mb-4 text-3xl font-bold">
                  {contentState.heading.title}
                </h2>
                <p className="max-w-3xl mx-auto text-lg">
                  {contentState.heading.description}
                </p>
              </>
            )}
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {contentState.images.map((image, index) => (
              <motion.div
                key={image.id}
                className={`overflow-hidden rounded-lg shadow-md cursor-pointer group ${theme === "dark" ? "bg-gray-800" : "bg-white"
                  }`}
                whileHover={{ y: isEditing ? 0 : -5 }}
                onClick={() => openLightbox(index)}
              >
                <div className="relative overflow-hidden aspect-[4/3]"> {/* ✅ Fixed aspect ratio */}
                  {/* Recommended Size Above Image */}
                  {isEditing && (
                    <div className="absolute top-2 left-2 right-2 bg-black/70 text-white text-xs p-1 rounded z-10 text-center">
                      Recommended: 600×450px (4:3 ratio)
                    </div>
                  )}

                  {image.url ? (
                    <img
                      src={image.url}
                      alt={image.title}
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110" // ✅ Full coverage
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gray-200">
                      <span className="text-gray-500">No image</span>
                    </div>
                  )}

                  {isEditing && (
                    <motion.div
                      animate={{ opacity: [0, 1], scale: [0.8, 1] }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="absolute bottom-2 left-2 right-2 bg-black/80 p-2 rounded z-50"
                    >
                      <input
                        type="file"
                        accept="image/*"
                        className="w-full text-xs cursor-pointer font-bold text-white"
                        onChange={(e) => handleGalleryImageSelect(index, e)}
                      />
                      {pendingImages[index] && (
                        <p className="text-xs text-green-400 mt-1 text-center">
                          ✓ Image cropped and ready to upload
                        </p>
                      )}
                    </motion.div>
                  )}

                  {isEditing && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(index);
                      }}
                      className="absolute p-1 text-white bg-red-500 rounded-full top-12 right-2"
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  )}
                </div>

                {/* Description section below the image */}
                <div className="p-4">
                  {isEditing ? (
                    <>
                      <input
                        value={image.title}
                        onChange={(e) =>
                          updateImageField(index, "title", e.target.value)
                        }
                        className={`w-full mb-2 font-semibold bg-transparent border-b ${theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        placeholder="Image Title"
                      />
                      <input
                        value={image.category}
                        onChange={(e) =>
                          updateImageField(index, "category", e.target.value)
                        }
                        className={`w-full text-sm bg-transparent border-b ${theme === "dark" ? "text-gray-300" : "text-gray-600"
                          }`}
                        placeholder="Category"
                      />
                      <textarea
                        value={image.description}
                        onChange={(e) =>
                          updateImageField(index, "description", e.target.value)
                        }
                        className={`w-full mt-2 text-xs bg-transparent border-b ${theme === "dark" ? "text-gray-400" : "text-gray-500"
                          }`}
                        placeholder="Image description"
                        rows="2"
                      />
                    </>
                  ) : (
                    <>
                      <h3 className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"
                        }`}>
                        {image.title}
                      </h3>
                      <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}>
                        {image.category}
                      </p>
                      <p className={`mt-2 text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}>
                        {image.description}
                      </p>
                    </>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Show Add Image button only when there are less than 6 images */}
            {isEditing && contentState.images.length < 6 && (
              <motion.div
                className={`rounded-lg flex items-center justify-center border-dashed ${theme === "dark"
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-300"
                  } border-2 cursor-pointer aspect-[4/3]`} // ✅ Same aspect ratio
                whileHover={{ scale: 1.02 }}
                onClick={addImage}
              >
                <div className="flex flex-col items-center p-6 text-green-600">
                  <Plus size={32} />
                  <span className="mt-2">Add Image</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Show message when maximum images reached */}
          {isEditing && contentState.images.length >= 6 && (
            <div className="p-4 mt-6 text-center border border-yellow-200 rounded-lg bg-yellow-50">
              <p className="text-yellow-700">
                Maximum 6 images reached. Remove an image to add a new one.
              </p>
            </div>
          )}
        </div>

        {/* Lightbox Modal */}
        {selectedImage !== null && (
          <div className="fixed top-[8rem] inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            <button
              onClick={closeLightbox}
              className="absolute p-2 text-white bg-black bg-opacity-50 rounded-full top-4 right-4 hover:bg-opacity-70"
            >
              <X size={24} />
            </button>

            <button
              onClick={goToPrev}
              className="absolute p-2 text-white bg-black bg-opacity-50 rounded-full left-4 hover:bg-opacity-70"
            >
              <ChevronLeft size={32} />
            </button>

            <button
              onClick={goToNext}
              className="absolute p-2 text-white bg-black bg-opacity-50 rounded-full right-4 hover:bg-opacity-70"
            >
              <ChevronRight size={32} />
            </button>

            <div className="w-full max-w-4xl max-h-full">
              <img
                src={contentState.images[selectedImage].url}
                alt={contentState.images[selectedImage].title}
                className="object-contain w-full h-auto max-h-full"
              />
              <div className="mt-4 text-center text-white">
                <h3 className="text-xl font-semibold">
                  {contentState.images[selectedImage].title}
                </h3>
                <p className="text-gray-300">
                  {contentState.images[selectedImage].category}
                </p>
                <p className="mt-2 text-gray-400">
                  {contentState.images[selectedImage].description}
                </p>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default Gallery;