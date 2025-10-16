import { motion } from "framer-motion";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Edit2, Save, X, Upload, Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { toast } from "react-toastify";
import Cropper from "react-easy-crop";
import BusinessInsider from "../public/images/logos/BusinessInsider.png";
import Forbes from "../public/images/logos/Forbes.png";
import TechCrunch from "../public/images/logos/TechCrunch.png";
import TheNewYorkTimes from "../public/images/logos/TheNewYorkTimes.png";
import USAToday from "../public/images/logos/USAToday.png";

const itemVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
};

// Default placeholder image
const DEFAULT_PLACEHOLDER_IMAGE = "/placeholder-company-logo.png";

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

export default function EditableUsedBy({ 
  usedByData, 
  onStateChange, 
  userId, 
  publishedId, 
  templateSelection, 
  isPublished = false 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const fileInputRefs = useRef({});

  // Crop modal state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImage, setCropImage] = useState(null);
  const [cropCompanyId, setCropCompanyId] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);

  // Pending image files for S3 upload
  const [pendingImageFiles, setPendingImageFiles] = useState({});

  // Safe default content structure with fallbacks
  const defaultCompanies = [
    { image: BusinessInsider, name: "Business Insider", id: 1 },
    { image: Forbes, name: "Forbes", id: 2 },
    { image: TechCrunch, name: "TechCrunch", id: 3 },
    { image: TheNewYorkTimes, name: "NY Times", id: 4 },
    { image: USAToday, name: "USA Today", id: 5 },
  ];

  const defaultContent = {
    title: usedByData?.title || "USED BY",
    companies: usedByData?.companies || defaultCompanies,
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

  // Save function with crop functionality
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

  // Open crop modal
  const openCropModal = (file, companyId) => {
    const reader = new FileReader();
    reader.onload = () => {
      setCropImage(reader.result);
      setCropCompanyId(companyId);
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

      // Store the file for upload on Save
      setPendingImageFiles((prev) => ({
        ...prev,
        [cropCompanyId]: croppedFile,
      }));

      // Show immediate local preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setTempContentState((prev) => ({
          ...prev,
          companies: prev.companies.map((company) =>
            company.id === cropCompanyId
              ? { ...company, image: e.target.result }
              : company
          ),
        }));
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
        // 5MB limit
        toast.error("File size must be less than 5MB");
        return;
      }

      // Open crop modal instead of direct upload
      openCropModal(file, companyId);
    },
    [isPublished]
  );

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
    return ({ value, field, companyId, className = "", placeholder = "" }) => {
      if (isPublished) {
        return <span className={className}>{value}</span>;
      }

      const handleChange = (e) => {
        if (field === "title") {
          updateTempContent("title", e.target.value);
        } else if (field === "companyName" && companyId) {
          updateCompanyName(companyId, e.target.value);
        }
      };

      return (
        <input
          type="text"
          value={value}
          onChange={handleChange}
          className={`w-full bg-white border-2 border-dashed border-blue-300 rounded p-2 focus:border-blue-500 focus:outline-none text-center ${className}`}
          placeholder={placeholder}
          disabled={isPublished}
        />
      );
    };
  }, [updateTempContent, updateCompanyName, isPublished]);

  const displayContent = isEditing ? tempContentState : contentState;

  // Auto-scroll functionality with duplicated companies for seamless loop
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
              className="w-full overflow-hidden relative"
              initial="hidden"
              animate="visible"
              variants={itemVariants}
            >
              <style>
                {`
                  @keyframes marquee {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-50%); }
                  }
                  .animate-marquee {
                    animation: marquee 30s linear infinite;
                  }
                  .hover-pause:hover .animate-marquee {
                    animation-play-state: paused;
                  }
                `}
              </style>

              <div className="hover-pause">
                <motion.div
                  className="flex gap-12 items-center animate-marquee"
                  transition={{ duration: 0.8 }}
                >
                  {duplicatedCompanies.map((company, i) => (
                    <motion.div
                      key={`${company.id}-${i}`}
                      className="flex-shrink-0"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <img
                        src={getImageSrc(company.image)}
                        alt={company.name}
                        className="h-8 opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-300"
                        onError={(e) => {
                          e.target.src = DEFAULT_PLACEHOLDER_IMAGE;
                        }}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Gradient fade effects on sides */}
              <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-white to-transparent z-10"></div>
              <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-white to-transparent z-10"></div>
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

      {/* Crop Modal */}
      {cropModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-xl font-bold mb-4 text-gray-900">
              Crop Company Logo
            </h3>
            <div className="relative w-full h-96 bg-gray-900 rounded-lg overflow-hidden">
              <Cropper
                image={cropImage}
                crop={crop}
                zoom={zoom}
                aspect={1} // Square aspect ratio for logos
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
    </>
  );
}