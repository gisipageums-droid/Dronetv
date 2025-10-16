import {
  Edit2,
  Loader2,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Badge } from "./ui/badge";
import Cropper from "react-easy-crop";

// Custom Button component
const Button = ({
  children,
  onClick,
  variant,
  size,
  className,
  disabled,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    outline: "border border-gray-300 bg-transparent hover:bg-gray-50",
    default: "bg-blue-600 text-white hover:bg-blue-700",
  };
  const sizes = {
    sm: "h-8 px-3 text-sm",
    default: "h-10 px-4",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant] || variants.default} ${
        sizes[size] || sizes.default
      } ${className || ""}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

// Crop helper function
const getCroppedImg = async (imageSrc, pixelCrop) => {
  const image = new Image();
  image.src = imageSrc;

  return new Promise((resolve, reject) => {
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

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

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Canvas is empty"));
            return;
          }
          resolve(blob);
        },
        "image/jpeg",
        0.95
      );
    };
    image.onerror = reject;
  });
};

export default function EditableGallerySection({
  galleryData,
  onStateChange,
  userId,
  publishedId,
  templateSelection,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [pendingImages, setPendingImages] = useState({});

  // Crop modal state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImage, setCropImage] = useState(null);
  const [cropIndex, setCropIndex] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);

  const sectionRef = useRef(null);
  const fileInputRefs = useRef([]);

  // Default galleryData structure
  const defaultGalleryData = galleryData;

  // Consolidated state
  const [galleryState, setGalleryState] = useState(defaultGalleryData);
  const [tempGalleryState, setTempGalleryState] = useState(defaultGalleryData);

  // Notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(galleryState);
    }
  }, [galleryState, onStateChange]);

  // Initialize with galleryData if provided
  useEffect(() => {
    if (galleryData) {
      setGalleryState(galleryData);
      setTempGalleryState(galleryData);
      setDataLoaded(true);
    }
  }, [galleryData]);

  // Intersection Observer for visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setTempGalleryState(galleryState);
    setPendingImages({});
  };

  // Save function with S3 upload for multiple images
  const handleSave = async () => {
    try {
      setIsUploading(true);

      // Create a copy of tempGalleryState to update with S3 URLs
      let updatedState = { ...tempGalleryState };
      let updatedImages = [...updatedState.images];

      // Upload all pending images
      for (const [indexStr, file] of Object.entries(pendingImages)) {
        const index = parseInt(indexStr);

        if (!userId || !publishedId || !templateSelection) {
          toast.error(
            "Missing user information. Please refresh and try again."
          );
          return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("sectionName", "gallery");
        formData.append("imageField", `images[${index}].url` + Date.now());
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
          updatedImages[index] = {
            ...updatedImages[index],
            url: uploadData.imageUrl,
          };
          console.log(
            `Gallery image ${index} uploaded to S3:`,
            uploadData.imageUrl
          );
        } else {
          const errorData = await uploadResponse.json();
          toast.error(
            `Image upload failed: ${errorData.message || "Unknown error"}`
          );
          return;
        }
      }

      // Update images array with new URLs
      updatedState.images = updatedImages;

      // Clear pending files
      setPendingImages({});

      // Save the updated state with S3 URLs
      setIsSaving(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update both states with the new URLs
      setGalleryState(updatedState);
      setTempGalleryState(updatedState);

      setIsEditing(false);
      toast.success("Gallery section saved with S3 URLs ready for publish");
    } catch (error) {
      console.error("Error saving gallery section:", error);
      toast.error("Error saving changes. Please try again.");
    } finally {
      setIsUploading(false);
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTempGalleryState(galleryState);
    setPendingImages({});
    setIsEditing(false);
  };

  // Update functions for header
  const updateHeaderField = useCallback((field, value) => {
    setTempGalleryState((prev) => ({
      ...prev,
      heading: {
        ...prev.heading,
        [field]: value,
      },
    }));
  }, []);

  // Update functions for images
  const updateImageField = useCallback((index, field, value) => {
    setTempGalleryState((prev) => ({
      ...prev,
      images: prev.images.map((img, i) =>
        i === index ? { ...img, [field]: value } : img
      ),
    }));
  }, []);

  // Add new image
  const addImage = useCallback(() => {
    setTempGalleryState((prev) => ({
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
  }, []);

  // Remove image
  const removeImage = useCallback((index) => {
    setTempGalleryState((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));

    // Also remove from pending files if it exists
    setPendingImages((prev) => {
      const newPending = { ...prev };
      delete newPending[index];
      return newPending;
    });
  }, []);

  // Open crop modal
  const openCropModal = (file, index) => {
    const reader = new FileReader();
    reader.onload = () => {
      setCropImage(reader.result);
      setCropIndex(index);
      setOriginalFile(file);
      setCropModalOpen(true);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    };
    reader.readAsDataURL(file);
  };

  // Handle crop complete
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Apply crop
  const applyCrop = async () => {
    try {
      const croppedBlob = await getCroppedImg(cropImage, croppedAreaPixels);
      const croppedFile = new File([croppedBlob], originalFile.name, {
        type: "image/jpeg",
      });

      // Store the cropped file for upload on Save
      setPendingImages((prev) => ({ ...prev, [cropIndex]: croppedFile }));

      // Show immediate local preview
      const reader = new FileReader();
      reader.onload = (e) => {
        updateImageField(cropIndex, "url", e.target.result);
      };
      reader.readAsDataURL(croppedFile);

      setCropModalOpen(false);
      toast.success("Image cropped successfully");
    } catch (error) {
      console.error("Error cropping image:", error);
      toast.error("Error cropping image. Please try again.");
    }
  };

  // Image upload handler with crop
  const handleImageUpload = useCallback(
    (index, event) => {
      const file = event.target.files[0];
      if (!file) return;

      // Validate file type and size
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      // Open crop modal
      openCropModal(file, index);
    },
    [updateImageField]
  );

  // Lightbox functions
  const openLightbox = (index) => {
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
        prev === tempGalleryState.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const goToPrev = () => {
    if (selectedImage !== null) {
      setSelectedImage((prev) =>
        prev === 0 ? tempGalleryState.images.length - 1 : prev - 1
      );
    }
  };

  // Memoized EditableText component
  const EditableText = useMemo(() => {
    return ({
      value,
      field,
      multiline = false,
      className = "",
      placeholder = "",
      onChange = null,
    }) => {
      const handleChange = (e) => {
        if (onChange) {
          onChange(e);
        } else {
          updateHeaderField(field, e.target.value);
        }
      };

      const baseClasses =
        "w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none";

      if (multiline) {
        return (
          <textarea
            value={value || ""}
            onChange={handleChange}
            className={`${baseClasses} p-2 resize-none ${className}`}
            placeholder={placeholder}
            rows={3}
          />
        );
      }

      return (
        <input
          type="text"
          value={value || ""}
          onChange={handleChange}
          className={`${baseClasses} p-1 ${className}`}
          placeholder={placeholder}
        />
      );
    };
  }, [updateHeaderField]);

  const displayGalleryData = isEditing ? tempGalleryState : galleryState;

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="py-24 bg-gradient-to-b from-yellow-50/30 via-white to-yellow-50/20 scroll-mt-20 relative"
    >
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-20">
          <div className="bg-white rounded-lg p-6 shadow-lg flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <span className="text-gray-700">Loading gallery data...</span>
          </div>
        </div>
      )}

      {/* Edit Controls */}
      <div className="absolute top-4 right-4 z-10">
        {!isEditing ? (
          <Button
            onClick={handleEdit}
            variant="outline"
            size="sm"
            className="bg-white hover:bg-gray-50 shadow-md"
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
              {isUploading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isUploading ? "Uploading..." : isSaving ? "Saving..." : "Save"}
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              size="sm"
              className="bg-white hover:bg-gray-50 shadow-md"
              disabled={isSaving || isUploading}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-block mb-4"
          >
            <Badge className="bg-[#ffeb3b] text-gray-900 px-5 py-2 shadow-md">
              Our Gallery
            </Badge>
          </motion.div>

          {isEditing ? (
            <div className="space-y-4">
              <EditableText
                value={displayGalleryData.heading.title}
                field="title"
                className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center"
                placeholder="Gallery Title"
              />
              <EditableText
                value={displayGalleryData.heading.description}
                field="description"
                multiline={true}
                className="text-gray-600 max-w-2xl mx-auto text-lg text-center"
                placeholder="Gallery description"
              />
            </div>
          ) : (
            <>
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
                className="text-3xl md:text-4xl font-extrabold text-gray-900"
              >
                {displayGalleryData.heading.title}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
                className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg"
              >
                {displayGalleryData.heading.description}
              </motion.p>
            </>
          )}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayGalleryData.images.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: 0.5 + index * 0.1,
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{
                y: isEditing ? 0 : -5,
                scale: isEditing ? 1 : 1.02,
              }}
              className={`overflow-hidden rounded-lg shadow-md cursor-pointer group ${"bg-white"}`}
              onClick={() => openLightbox(index)}
            >
              <div className="relative overflow-hidden">
                {image.url ? (
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&h=600&fit=crop";
                    }}
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No image</span>
                  </div>
                )}

                {isEditing && (
                  <div className="absolute top-2 left-2 z-10 flex flex-col gap-2">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRefs.current[index]?.click();
                      }}
                      size="sm"
                      variant="outline"
                      className="bg-white/90 backdrop-blur-sm shadow-md"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Change
                    </Button>
                    <input
                      ref={(el) => (fileInputRefs.current[index] = el)}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(index, e)}
                      className="hidden"
                    />
                    {pendingImages[index] && (
                      <p className="text-xs text-orange-600 bg-white p-1 rounded">
                        {pendingImages[index].name}
                      </p>
                    )}
                  </div>
                )}

                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-end">
                  <div className="p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-full">
                    {isEditing ? (
                      <>
                        <input
                          value={image.title}
                          onChange={(e) =>
                            updateImageField(index, "title", e.target.value)
                          }
                          className="font-semibold bg-transparent border-b w-full mb-1 text-white placeholder-gray-300"
                          placeholder="Image title"
                        />
                        <input
                          value={image.category}
                          onChange={(e) =>
                            updateImageField(index, "category", e.target.value)
                          }
                          className="text-sm bg-transparent border-b w-full text-white placeholder-gray-300"
                          placeholder="Image category"
                        />
                        <textarea
                          value={image.description}
                          onChange={(e) =>
                            updateImageField(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          className="text-xs bg-transparent border-b w-full mt-1 text-white placeholder-gray-300 resize-none"
                          placeholder="Image description"
                          rows={2}
                        />
                      </>
                    ) : (
                      <>
                        <h3 className="font-semibold">{image.title}</h3>
                        <p className="text-sm">{image.category}</p>
                        <p className="text-xs mt-1 opacity-90">
                          {image.description}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(index);
                    }}
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2 bg-red-50 hover:bg-red-100 text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </motion.div>
          ))}

          {/* Add new image button in edit mode */}
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: 0.5 + displayGalleryData.images.length * 0.1,
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="rounded-lg flex items-center justify-center border-dashed bg-white border-2 border-gray-300 cursor-pointer h-full min-h-[256px]"
              onClick={addImage}
            >
              <div className="flex flex-col items-center p-6 text-green-600">
                <Plus size={32} />
                <span className="mt-2">Add Image</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed top-[8rem] inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 z-10"
          >
            <X size={24} />
          </button>

          <button
            onClick={goToPrev}
            className="absolute left-4 text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 z-10"
          >
            <ChevronLeft size={32} />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 z-10"
          >
            <ChevronRight size={32} />
          </button>

          <div className="max-w-4xl w-full max-h-full">
            <img
              src={displayGalleryData.images[selectedImage].url}
              alt={displayGalleryData.images[selectedImage].title}
              className="w-full h-auto max-h-full object-contain"
            />
            <div className="text-white text-center mt-4">
              <h3 className="text-xl font-semibold">
                {displayGalleryData.images[selectedImage].title}
              </h3>
              <p className="text-gray-300">
                {displayGalleryData.images[selectedImage].category}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                {displayGalleryData.images[selectedImage].description}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Crop Modal */}
      {cropModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Crop Image</h3>
            <div className="relative w-full h-96 bg-gray-900 rounded-lg overflow-hidden">
              <Cropper
                image={cropImage}
                crop={crop}
                zoom={zoom}
                aspect={4 / 3}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zoom
              </label>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={applyCrop}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
              >
                Apply Crop
              </button>
              <button
                onClick={() => setCropModalOpen(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 py-2 px-4 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}