import { motion } from "framer-motion";
import { Edit2, Loader2, Plus, Save, Trash2, Upload, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "../components/ui/button";
import Cropper from "react-easy-crop";

const itemVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
};

// Default placeholder image or use an empty string
const DEFAULT_PLACEHOLDER_IMAGE = "/placeholder-company-logo.png";

export default function EditableUsedBy({
  usedByData,
  onStateChange,
  userId,
  publishedId,
  templateSelection,
  isPublished = false,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const fileInputRefs = useRef({});

  // Enhanced crop modal state (same as Header.tsx and Hero.tsx)
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [cropCompanyId, setCropCompanyId] = useState(null);

  // Pending image files for S3 upload
  const [pendingImageFiles, setPendingImageFiles] = useState({});

  // Safe default content structure with fallbacks
  const defaultCompanies = usedByData?.companies || [
    { id: 1, name: "Company 1", image: DEFAULT_PLACEHOLDER_IMAGE },
    { id: 2, name: "Company 2", image: DEFAULT_PLACEHOLDER_IMAGE },
    { id: 3, name: "Company 3", image: DEFAULT_PLACEHOLDER_IMAGE },
    { id: 4, name: "Company 4", image: DEFAULT_PLACEHOLDER_IMAGE },
    { id: 5, name: "Company 5", image: DEFAULT_PLACEHOLDER_IMAGE },
  ];

  const defaultContent = {
    title: usedByData?.title || "USED BY",
    companies: defaultCompanies,
  };

  // Consolidated state
  const [contentState, setContentState] = useState(defaultContent);
  const [tempContentState, setTempContentState] = useState(defaultContent);

  // Notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(contentState);
    }
  }, [contentState, onStateChange]);

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

  // Data fetching
  const fetchUsedByData = async () => {
    if (isPublished) return; // Don't fetch if published

    setIsLoading(true);
    try {
      // Simulate API call
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            title: usedByData?.title || "USED BY",
            companies: usedByData?.companies || defaultCompanies,
          });
        }, 1200);
      });

      setContentState(response);
      setTempContentState(response);
      setDataLoaded(true);
    } catch (error) {
      console.error("Error fetching used-by data:", error);
      // Keep default content on error
      setContentState(defaultContent);
      setTempContentState(defaultContent);
      setDataLoaded(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when component becomes visible
  useEffect(() => {
    if (isVisible && !dataLoaded && !isLoading && !isPublished) {
      fetchUsedByData();
    }
  }, [isVisible, dataLoaded, isLoading, isPublished]);

  const handleEdit = () => {
    if (isPublished) {
      toast.info("Cannot edit published template");
      return;
    }
    setIsEditing(true);
    setTempContentState(contentState);
    setPendingImageFiles({});
  };

  // Enhanced cropper functions (same as Header.tsx and Hero.tsx)
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

      // Store the file for upload on Save
      setPendingImageFiles((prev) => ({
        ...prev,
        [cropCompanyId]: file,
      }));

      // Show immediate local preview
      setTempContentState((prev) => ({
        ...prev,
        companies: prev.companies.map((company) =>
          company.id === cropCompanyId
            ? { ...company, image: previewUrl }
            : company
        ),
      }));

      setCropModalOpen(false);
      setImageToCrop(null);
      setOriginalFile(null);
      toast.success("Logo cropped successfully");
    } catch (error) {
      console.error("Error cropping image:", error);
      toast.error("Error cropping image. Please try again.");
    }
  };

  const cancelCrop = () => {
    setCropModalOpen(false);
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

  // Enhanced image upload handler (same as Header.tsx)
  const handleImageUpload = useCallback(
    (companyId, event) => {
      if (isPublished) {
        toast.info("Cannot edit published template");
        return;
      }

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

      const reader = new FileReader();
      reader.onloadend = () => {
        setImageToCrop(reader.result);
        setOriginalFile(file);
        setCropCompanyId(companyId);
        setCropModalOpen(true);
        setAspectRatio(1); // Square for logos
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setRotation(0);
      };
      reader.readAsDataURL(file);

      event.target.value = "";
    },
    [isPublished]
  );

  // Save function
  const handleSave = async () => {
    try {
      setIsUploading(true);

      // Create a copy of tempContentState to update with S3 URLs
      let updatedState = { ...tempContentState };

      // Upload all pending images
      for (const [companyIdStr, file] of Object.entries(pendingImageFiles)) {
        const companyId = parseInt(companyIdStr);

        if (!userId || !publishedId || !templateSelection) {
          toast.error(
            "Missing user information. Please refresh and try again."
          );
          return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("sectionName", "usedBy");
        formData.append("imageField", `company-${companyId}` + Date.now());
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
          // Update the company image with S3 URL
          updatedState.companies = updatedState.companies.map((company) =>
            company.id === companyId
              ? { ...company, image: uploadData.imageUrl }
              : company
          );
        } else {
          const errorData = await uploadResponse.json();
          toast.error(
            `Image upload failed: ${errorData.message || "Unknown error"}`
          );
          return;
        }
      }

      // Clear pending files
      setPendingImageFiles({});

      // Save the updated state with S3 URLs
      setIsSaving(true);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate save API call

      // Update both states with the new URLs
      setContentState(updatedState);
      setTempContentState(updatedState);

      setIsEditing(false);
      toast.success("Used By section saved successfully!");
    } catch (error) {
      console.error("Error saving used by section:", error);
      toast.error("Error saving changes. Please try again.");
    } finally {
      setIsUploading(false);
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTempContentState(contentState);
    setPendingImageFiles({});
    setIsEditing(false);
  };

  // Update functions
  const updateTempContent = useCallback(
    (field, value) => {
      if (isPublished) return;
      setTempContentState((prev) => ({ ...prev, [field]: value }));
    },
    [isPublished]
  );

  const updateCompanyName = useCallback(
    (companyId, newName) => {
      if (isPublished) return;
      setTempContentState((prev) => ({
        ...prev,
        companies: prev.companies.map((company) =>
          company.id === companyId ? { ...company, name: newName } : company
        ),
      }));
    },
    [isPublished]
  );

  const addCompany = useCallback(() => {
    if (isPublished) {
      toast.info("Cannot edit published template");
      return;
    }
    setTempContentState((prev) => {
      const newId = Math.max(0, ...prev.companies.map((c) => c.id)) + 1;
      return {
        ...prev,
        companies: [
          ...prev.companies,
          { id: newId, name: "New Company", image: DEFAULT_PLACEHOLDER_IMAGE },
        ],
      };
    });
  }, [isPublished]);

  const removeCompany = useCallback(
    (companyId) => {
      if (isPublished) {
        toast.info("Cannot edit published template");
        return;
      }
      setTempContentState((prev) => ({
        ...prev,
        companies: prev.companies.filter((company) => company.id !== companyId),
      }));
    },
    [isPublished]
  );

  // Memoized EditableText component
  const EditableText = useMemo(() => {
    return ({
      value,
      field,
      companyId,
      className = "",
      placeholder = "",
      maxLength = null,
    }) => {
      if (isPublished) {
        return <span className={className}>{value}</span>;
      }

      const handleChange = (e) => {
        if (maxLength && e.target.value.length > maxLength) {
          return;
        }
        if (field === "title") {
          updateTempContent("title", e.target.value);
        } else if (field === "companyName" && companyId) {
          updateCompanyName(companyId, e.target.value);
        }
      };

      return (
        <div className="relative">
          <input
            type="text"
            value={value}
            onChange={handleChange}
            className={`w-full bg-white border-2 border-dashed border-blue-300 rounded p-2 focus:border-blue-500 focus:outline-none text-center ${className}`}
            placeholder={placeholder}
            disabled={isPublished}
            maxLength={maxLength}
          />
          {maxLength && (
            <div className="text-right text-xs text-gray-500 mt-1">
              {value.length}/{maxLength}
            </div>
          )}
        </div>
      );
    };
  }, [updateTempContent, updateCompanyName, isPublished]);

  const displayContent = isEditing ? tempContentState : contentState;

  // Auto-scroll functionality
  const duplicatedCompanies = useMemo(() => {
    return [...displayContent.companies, ...displayContent.companies];
  }, [displayContent.companies]);

  // Safe image source
  const getImageSrc = (image) => {
    return image && image !== DEFAULT_PLACEHOLDER_IMAGE
      ? image
      : DEFAULT_PLACEHOLDER_IMAGE;
  };

  return (
    <>
      {/* Enhanced Crop Modal (same as Header.tsx and Hero.tsx) */}
      {cropModalOpen && (
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
                Crop Company Logo
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

      <section ref={sectionRef} className="py-16 bg-white relative">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-30">
            <div className="bg-white rounded-lg p-6 shadow-lg flex items-center gap-3 border">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              <span className="text-gray-700">Loading content...</span>
            </div>
          </div>
        )}

        {/* Edit Controls */}
        {!isPublished && (
          <div className="absolute top-4 right-4 z-20">
            {!isEditing ? (
              <Button
                onClick={handleEdit}
                variant="outline"
                size="sm"
                className="bg-white hover:bg-gray-50 shadow-lg border-2 border-gray-200 hover:border-blue-300"
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
                  className="bg-green-600 hover:bg-green-700 text-white shadow-lg"
                  disabled={isSaving || isUploading}
                >
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : isSaving ? (
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
                  variant="outline"
                  size="sm"
                  className="bg-white hover:bg-gray-50 shadow-lg border-2"
                  disabled={isSaving || isUploading}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4">
          {/* Title Section */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={itemVariants}
          >
            {isEditing ? (
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                  Section Title
                </label>
                <div className="max-w-xs mx-auto">
                  <EditableText
                    value={displayContent.title}
                    field="title"
                    className="text-gray-400 text-lg font-medium"
                    placeholder="Section title"
                    maxLength={35}
                  />
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-400 text-lg mb-8">
                {displayContent.title}
              </p>
            )}
          </motion.div>

          {/* Companies Section */}
          {isEditing ? (
            <motion.div
              className="space-y-6"
              initial="hidden"
              animate="visible"
              variants={itemVariants}
            >
              <div className="text-center">
                <Button
                  onClick={addCompany}
                  variant="outline"
                  size="sm"
                  className="bg-blue-50 hover:bg-blue-100 border-blue-300 text-blue-700"
                  disabled={isPublished}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Company
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {displayContent.companies.map((company) => (
                  <motion.div
                    key={company.id}
                    className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300"
                    variants={itemVariants}
                  >
                    <div className="space-y-3">
                      {/* Company Image - Editable */}
                      <div className="text-center">
                        <div className="relative inline-block">
                          <img
                            src={getImageSrc(company.image)}
                            alt={company.name}
                            className="h-12 mx-auto opacity-60 grayscale"
                            onError={(e) => {
                              e.target.src = DEFAULT_PLACEHOLDER_IMAGE;
                            }}
                          />
                          {isEditing && (
                            <label className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded cursor-pointer">
                              <Upload className="w-4 h-4 text-white" />
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) =>
                                  handleImageUpload(company.id, e)
                                }
                                disabled={isPublished}
                              />
                            </label>
                          )}
                        </div>
                        {isEditing && (
                          <Button
                            onClick={() =>
                              fileInputRefs.current[company.id]?.click()
                            }
                            variant="outline"
                            size="sm"
                            className="mt-2 text-xs"
                            disabled={isPublished}
                          >
                            <Upload className="w-3 h-3 mr-1" />
                            Change Logo
                          </Button>
                        )}
                        <input
                          ref={(el) => (fileInputRefs.current[company.id] = el)}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(company.id, e)}
                          className="hidden"
                          disabled={isPublished}
                        />
                        {isEditing && pendingImageFiles[company.id] && (
                          <div className="text-xs text-orange-600 mt-1">
                            Pending: {pendingImageFiles[company.id].name}
                          </div>
                        )}
                      </div>

                      {/* Company Name */}
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Company Name
                        </label>
                        <EditableText
                          value={company.name}
                          field="companyName"
                          companyId={company.id}
                          className="text-sm"
                          placeholder="Company name"
                          maxLength={100}
                        />
                      </div>

                      {/* Remove Button */}
                      {isEditing && displayContent.companies.length > 1 && (
                        <Button
                          onClick={() => removeCompany(company.id)}
                          variant="outline"
                          size="sm"
                          className="w-full bg-red-50 hover:bg-red-100 border-red-300 text-red-700"
                          disabled={isPublished}
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Remove
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            // Auto-scroll animation for non-edit mode
            <motion.div
              className="w-full overflow-hidden relative py-4"
              initial="hidden"
              animate="visible"
              variants={itemVariants}
            >
              <style>
                {`
                  @keyframes scroll {
                    from { transform: translateX(0); }
                    to { transform: translateX(calc(-50% - 1rem)); }
                  }
                  .scroll-container {
                    display: flex;
                    width: max-content;
                    animation: scroll 20s linear infinite;
                  }
                  .scroll-container:hover {
                    animation-play-state: paused;
                  }
                `}
              </style>

              <div className="relative flex overflow-x-hidden">
                <div className="scroll-container">
                  {/* First set of logos */}
                  {displayContent.companies.map((company, i) => (
                    <motion.div
                      key={`first-${company.id}-${i}`}
                      className="flex-shrink-0 mx-6"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <img
                        src={getImageSrc(company.image)}
                        alt={company.name}
                        className="h-12 opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-300"
                        onError={(e) => {
                          e.target.src = DEFAULT_PLACEHOLDER_IMAGE;
                        }}
                      />
                    </motion.div>
                  ))}
                  {/* Duplicate set for seamless scrolling */}
                  {displayContent.companies.map((company, i) => (
                    <motion.div
                      key={`second-${company.id}-${i}`}
                      className="flex-shrink-0 mx-6"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <img
                        src={getImageSrc(company.image)}
                        alt={company.name}
                        className="h-12 opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-300"
                        onError={(e) => {
                          e.target.src = DEFAULT_PLACEHOLDER_IMAGE;
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Gradient Overlays */}
              <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
              <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
            </motion.div>
          )}
        </div>

        {/* Editing Instructions */}
        {isEditing && !isPublished && (
          <div className="max-w-7xl mx-auto px-4 mt-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-700 text-center">
                <strong>Edit Mode:</strong> Modify the section title, add/remove
                companies, change company names, and upload new logos. Click
                Save to keep your changes.
              </p>
            </div>
          </div>
        )}

        {/* Published Mode Notice */}
        {isPublished && (
          <div className="max-w-7xl mx-auto px-4 mt-8">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-700 text-center">
                <strong>Published Template:</strong> This section is view-only
                and cannot be edited.
              </p>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
