import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Edit2, Plus, Save, Trash2, Upload, X, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import Cropper from "react-easy-crop";

const itemVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
};

// Default placeholder image or use an empty string
const DEFAULT_PLACEHOLDER_IMAGE = "/placeholder-company-logo.png";

interface Company {
  id: number;
  name: string;
  image: string;
}

interface UsedByData {
  title: string;
  companies: Company[];
}

interface EditableUsedByProps {
  usedByData?: UsedByData;
  onStateChange?: (data: UsedByData) => void;
  userId?: string;
  publishedId?: string;
  templateSelection?: string;
  isPublished?: boolean;
}

const EditableUsedBy: React.FC<EditableUsedByProps> = ({
  usedByData,
  onStateChange,
  userId,
  publishedId,
  templateSelection,
  isPublished = false,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Track changes for auto-save
  const hasUnsavedChanges = useRef(false);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();
  const previousContentRef = useRef<any>(null);

  // Crop modal state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [cropCompanyId, setCropCompanyId] = useState<number | null>(null);

  // Default companies
  const defaultCompanies: Company[] = [
    { id: 1, name: "Company 1", image: DEFAULT_PLACEHOLDER_IMAGE },
    { id: 2, name: "Company 2", image: DEFAULT_PLACEHOLDER_IMAGE },
    { id: 3, name: "Company 3", image: DEFAULT_PLACEHOLDER_IMAGE },
    { id: 4, name: "Company 4", image: DEFAULT_PLACEHOLDER_IMAGE },
    { id: 5, name: "Company 5", image: DEFAULT_PLACEHOLDER_IMAGE },
  ];

  const defaultContent: UsedByData = {
    title: usedByData?.title || "USED BY",
    companies: usedByData?.companies || defaultCompanies,
  };

  // Initialize with prop data or default values
  const [content, setContent] = useState<UsedByData>(defaultContent);
  const [backupContent, setBackupContent] = useState<UsedByData>(defaultContent);

  // Update local state when prop data changes
  useEffect(() => {
    if (usedByData) {
      setContent(usedByData);
      setBackupContent(usedByData);
      previousContentRef.current = usedByData;
    }
  }, [usedByData]);

  // Auto-save function
  const autoSave = useCallback(async () => {
    if (!onStateChange || !editMode || !hasUnsavedChanges.current) return;

    setIsSaving(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onStateChange(content);
    setLastSaved(new Date());
    setIsSaving(false);
    hasUnsavedChanges.current = false; // Reset changes flag after save
  }, [content, editMode, onStateChange]);

  // Debounced auto-save effect - only triggers when content actually changes
  useEffect(() => {
    // Skip if not in edit mode or no changes detected
    if (!editMode || !onStateChange || !hasUnsavedChanges.current) return;

    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Set new timeout for auto-save (1 second debounce)
    autoSaveTimeoutRef.current = setTimeout(() => {
      autoSave();
    }, 1000);

    // Cleanup timeout on unmount or when dependencies change
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [content, editMode, autoSave, onStateChange]);

  // Effect to detect actual changes in content
  useEffect(() => {
    // Skip initial render and when not in edit mode
    if (previousContentRef.current === null || !editMode) {
      previousContentRef.current = content;
      return;
    }

    // Check if content actually changed
    const hasChanged = JSON.stringify(previousContentRef.current) !== JSON.stringify(content);
    
    if (hasChanged) {
      hasUnsavedChanges.current = true;
      previousContentRef.current = content;
    }
  }, [content, editMode]);

  const handleEditToggle = () => {
    if (isPublished) {
      toast.info("Cannot edit published template");
      return;
    }

    if (!editMode) {
      setBackupContent(content); // Save current before editing
      hasUnsavedChanges.current = false; // Reset changes flag when entering edit mode
    } else {
      // When exiting edit mode, save if there are unsaved changes
      if (hasUnsavedChanges.current && onStateChange) {
        onStateChange(content);
        setLastSaved(new Date());
        hasUnsavedChanges.current = false;
      }
    }
    setEditMode(!editMode);
  };

  const handleCancel = () => {
    setContent(backupContent); // Restore backup
    if (onStateChange) {
      onStateChange(backupContent); // Sync with parent
    }
    setEditMode(false);
    hasUnsavedChanges.current = false; // Reset changes flag
  };

  const handleSave = async () => {
    if (!onStateChange) return;

    try {
      setIsSaving(true);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      
      onStateChange(content);
      setLastSaved(new Date());
      setEditMode(false);
      hasUnsavedChanges.current = false;
      
      toast.success("Used By section saved successfully!");
    } catch (error) {
      console.error("Error saving used by section:", error);
      toast.error("Error saving changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Update functions
  const updateTitle = (value: string) => {
    if (value.length > 35) {
      toast.error("Title cannot exceed 35 characters");
      return;
    }
    setContent(prev => ({ ...prev, title: value }));
  };

  const updateCompanyName = (companyId: number, newName: string) => {
    if (newName.length > 100) {
      toast.error("Company name cannot exceed 100 characters");
      return;
    }
    setContent(prev => ({
      ...prev,
      companies: prev.companies.map(company =>
        company.id === companyId ? { ...company, name: newName } : company
      ),
    }));
  };

  const addCompany = () => {
    const newId = Math.max(0, ...content.companies.map(c => c.id)) + 1;
    setContent(prev => ({
      ...prev,
      companies: [
        ...prev.companies,
        { id: newId, name: "New Company", image: DEFAULT_PLACEHOLDER_IMAGE },
      ],
    }));
  };

  const removeCompany = (companyId: number) => {
    if (content.companies.length <= 1) {
      toast.error("Cannot remove the last company");
      return;
    }
    setContent(prev => ({
      ...prev,
      companies: prev.companies.filter(company => company.id !== companyId),
    }));
  };

  // Upload image to AWS S3
  const uploadImageToAWS = async (file: File, companyId: number): Promise<string | null> => {
    if (!userId || !publishedId || !templateSelection) {
      console.error("Missing required props for image upload");
      toast.error("Missing user information. Please refresh and try again.");
      return null;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("sectionName", "usedBy");
      formData.append("imageField", `company-${companyId}-${Date.now()}`);
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
        console.log(`Company logo ${companyId} uploaded to S3:`, uploadData.imageUrl);
        return uploadData.imageUrl;
      } else {
        const errorData = await uploadResponse.json();
        console.error("Image upload failed:", errorData);
        toast.error(`Image upload failed: ${errorData.message || "Unknown error"}`);
        return null;
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error uploading image. Please try again.");
      return null;
    }
  };

  // Cropper functions
  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  const getCroppedImg = async (imageSrc: string, pixelCrop: any, rotation = 0) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) throw new Error("Canvas context not found");

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

    return new Promise<{ file: File; previewUrl: string }>((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          
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

  // Apply crop function
  const applyCrop = async () => {
    if (!imageToCrop || !croppedAreaPixels || !cropCompanyId) return;

    try {
      setIsUploading(true);
      
      const { file, previewUrl } = await getCroppedImg(
        imageToCrop,
        croppedAreaPixels,
        rotation
      );

      // Upload cropped image to AWS
      const imageUrl = await uploadImageToAWS(file, cropCompanyId);

      if (imageUrl) {
        // Update content with AWS URL
        setContent(prev => ({
          ...prev,
          companies: prev.companies.map(company =>
            company.id === cropCompanyId
              ? { ...company, image: imageUrl }
              : company
          ),
        }));

        toast.success("Logo cropped and uploaded successfully");
      }

      // Cleanup
      URL.revokeObjectURL(previewUrl);
      setCropModalOpen(false);
      setImageToCrop(null);
      setOriginalFile(null);
      setCropCompanyId(null);
      resetCropSettings();
    } catch (error) {
      console.error("Error cropping image:", error);
      toast.error("Error cropping image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const cancelCrop = () => {
    setCropModalOpen(false);
    setImageToCrop(null);
    setOriginalFile(null);
    setCropCompanyId(null);
    resetCropSettings();
  };

  const resetCropSettings = () => {
    setZoom(1);
    setRotation(0);
    setCrop({ x: 0, y: 0 });
    setAspectRatio(1);
  };

  // Image upload handler
  const handleImageUpload = (companyId: number, event: React.ChangeEvent<HTMLInputElement>) => {
    if (isPublished) {
      toast.info("Cannot edit published template");
      return;
    }

    const file = event.target.files?.[0];
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
      setImageToCrop(reader.result as string);
      setOriginalFile(file);
      setCropCompanyId(companyId);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);

    event.target.value = "";
  };

  // Safe image source
  const getImageSrc = (image: string) => {
    return image && image !== DEFAULT_PLACEHOLDER_IMAGE
      ? image
      : DEFAULT_PLACEHOLDER_IMAGE;
  };

  return (
    <>
      {/* Enhanced Crop Modal */}
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
                  image={imageToCrop || ""}
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
                  disabled={isUploading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white rounded py-2 text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                  ) : (
                    "Apply Crop"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      <section className="py-16 bg-white relative">
        {/* Auto-save status */}
        {editMode && onStateChange && (
          <div className="absolute top-4 left-4 z-30 flex gap-2 items-center text-sm text-gray-500 bg-white/80 px-3 py-1 rounded-lg">
            {isSaving ? (
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                Auto-saving...
              </span>
            ) : lastSaved ? (
              <span>Auto-saved {lastSaved.toLocaleTimeString()}</span>
            ) : (
              <span>No changes to save</span>
            )}
          </div>
        )}

        {/* Edit/Save/Cancel Buttons */}
        <div className="absolute top-4 right-4 z-20 flex gap-3">
          {editMode ? (
            <>
              <button
                onClick={handleSave}
                disabled={isSaving || isUploading}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                {isSaving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                <X size={18} /> Cancel
              </button>
            </>
          ) : (
            !isPublished && (
              <button
                onClick={handleEditToggle}
                className="flex items-center gap-2 bg-black/60 text-white px-4 py-2 rounded-lg border border-white/30 hover:bg-black/80 transition"
              >
                <Edit2 size={18} /> Edit
              </button>
            )
          )}
        </div>

        <div className="max-w-7xl mx-auto px-4">
          {/* Title Section */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={itemVariants}
          >
            {editMode ? (
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                  Section Title
                </label>
                <div className="max-w-xs mx-auto">
                  <input
                    type="text"
                    value={content.title}
                    onChange={(e) => updateTitle(e.target.value)}
                    className="w-full bg-white border-2 border-blue-300 rounded p-2 focus:border-blue-500 focus:outline-none text-center text-lg font-medium"
                    placeholder="Section title"
                    maxLength={35}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Press Enter to save</span>
                    <span>{content.title.length}/35</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-400 text-lg mb-8">
                {content.title}
              </p>
            )}
          </motion.div>

          {/* Companies Section */}
          {editMode ? (
            <motion.div
              className="space-y-6"
              initial="hidden"
              animate="visible"
              variants={itemVariants}
            >
              <div className="text-center">
                <button
                  onClick={addCompany}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  <Plus size={18} />
                  Add Company
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {content.companies.map((company) => (
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
                              (e.target as HTMLImageElement).src = DEFAULT_PLACEHOLDER_IMAGE;
                            }}
                          />
                          {editMode && (
                            <label className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded cursor-pointer">
                              <Upload className="w-4 h-4 text-white" />
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleImageUpload(company.id, e)}
                              />
                            </label>
                          )}
                        </div>
                        {editMode && (
                          <button
                            onClick={() => {
                              const input = document.createElement("input");
                              input.type = "file";
                              input.accept = "image/*";
                              input.onchange = (e) => handleImageUpload(company.id, e as any);
                              input.click();
                            }}
                            className="mt-2 text-xs bg-gray-200 hover:bg-gray-300 text-gray-800 px-2 py-1 rounded"
                          >
                            <Upload className="w-3 h-3 mr-1 inline" />
                            Change Logo
                          </button>
                        )}
                      </div>

                      {/* Company Name */}
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Company Name
                        </label>
                        <input
                          type="text"
                          value={company.name}
                          onChange={(e) => updateCompanyName(company.id, e.target.value)}
                          className="w-full bg-white border border-gray-300 rounded p-2 text-sm"
                          maxLength={100}
                        />
                        <div className="text-xs text-gray-500 text-right mt-1">
                          {company.name.length}/100
                        </div>
                      </div>

                      {/* Remove Button */}
                      {editMode && content.companies.length > 1 && (
                        <button
                          onClick={() => removeCompany(company.id)}
                          className="w-full bg-red-50 hover:bg-red-100 border border-red-300 text-red-700 px-3 py-1 rounded text-sm"
                        >
                          <Trash2 className="w-3 h-3 mr-1 inline" />
                          Remove
                        </button>
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
                  {content.companies.map((company, i) => (
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
                          (e.target as HTMLImageElement).src = DEFAULT_PLACEHOLDER_IMAGE;
                        }}
                      />
                    </motion.div>
                  ))}
                  {/* Duplicate set for seamless scrolling */}
                  {content.companies.map((company, i) => (
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
                          (e.target as HTMLImageElement).src = DEFAULT_PLACEHOLDER_IMAGE;
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
      </section>
    </>
  );
};

export default EditableUsedBy;