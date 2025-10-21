import { Edit2, Loader2, Plus, Save, Trash2, Upload, X } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
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

// Custom Badge component
const Badge = ({ children, className }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
  >
    {children}
  </span>
);

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

export default function EditableCompanyProfile({
  profileData,
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
  const sectionRef = useRef(null);
  const fileInputRef = useRef(null);

  // Crop modal state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImage, setCropImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);

  // Pending image file for S3 upload
  const [pendingImageFile, setPendingImageFile] = useState(null);

  // Animation counters
  const hasAnimated = useRef(false);
  const [animatedCounters, setAnimatedCounters] = useState({
    growth: 0,
    team: 0,
    projects: 0,
  });

  // Default content structure
  const defaultContent = {
    companyName: profileData?.companyName || "Innovative Labs",
    establishedYear: profileData?.establishedYear || 2015,
    growthThisYear: profileData?.growthThisYear || 42,
    satisfiedCustomers: profileData?.satisfiedCustomers || 20,
    teamSize: profileData?.teamSize || 150,
    projectsDelivered: profileData?.projectsDelivered || 25,
    description:
      profileData?.description ||
      "Founded in 2015, we are a global innovation studio crafting digital experiences, scalable platforms, and future-ready strategies for industry leaders.",
    coreValues: profileData?.coreValues || [
      "Innovation First",
      "Client Obsessed",
      "Ownership & Accountability",
      "Grow Together",
    ],
    imageUrl:
      profileData?.imageUrl ||
      "https://images.unsplash.com/photo-1529533520516-5e45b20d07a5?w=800&h=600&fit=crop",
  };

  // Consolidated state
  const [profileState, setProfileState] = useState(defaultContent);
  const [tempProfileState, setTempProfileState] = useState(defaultContent);

  // Notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(profileState);
    }
  }, [profileState, onStateChange]);

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

  // Animate counters when section becomes visible
  useEffect(() => {
    if (!isVisible || hasAnimated.current) return;

    hasAnimated.current = true;

    const duration = 2000;

    const animateCounter = (start, end, setter) => {
      const increment = end > start ? 1 : -1;
      const totalSteps = Math.abs(end - start);
      const stepTime = Math.floor(duration / totalSteps);

      let current = start;
      const timer = setInterval(() => {
        current += increment;
        setter(current);
        if (current === end) clearInterval(timer);
      }, stepTime);

      return () => clearInterval(timer);
    };

    const timers = [
      animateCounter(
        animatedCounters.growth,
        tempProfileState.growthThisYear,
        (v) => setAnimatedCounters((prev) => ({ ...prev, growth: v }))
      ),
      animateCounter(animatedCounters.team, tempProfileState.teamSize, (v) =>
        setAnimatedCounters((prev) => ({ ...prev, team: v }))
      ),
      animateCounter(
        animatedCounters.projects,
        tempProfileState.projectsDelivered,
        (v) => setAnimatedCounters((prev) => ({ ...prev, projects: v }))
      ),
    ];

    return () => timers.forEach((clear) => clear && clear());
  }, [
    isVisible,
    tempProfileState.growthThisYear,
    tempProfileState.teamSize,
    tempProfileState.projectsDelivered,
  ]);

  // Simulate API call to fetch data from database
  const fetchProfileData = async () => {
    setIsLoading(true);
    try {
      // Replace this with your actual API call
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve(defaultContent);
        }, 1500); // Simulate network delay
      });

      setProfileState(response);
      setTempProfileState(response);
      setDataLoaded(true);
    } catch (error) {
      console.error("Error fetching profile data:", error);
      // Keep default content on error
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when component becomes visible
  useEffect(() => {
    if (isVisible && !dataLoaded && !isLoading) {
      fetchProfileData();
    }
  }, [isVisible, dataLoaded, isLoading]);

  const handleEdit = () => {
    setIsEditing(true);
    setTempProfileState(profileState);
    setPendingImageFile(null);
    // Reset animation for editing
    hasAnimated.current = false;
    setAnimatedCounters({
      growth: 0,
      team: 0,
      projects: 0,
    });
  };

  // Updated Save function with S3 upload
  const handleSave = async () => {
    try {
      setIsUploading(true);

      // Create a copy of tempProfileState to update with S3 URLs
      let updatedState = { ...tempProfileState };

      // Upload company image if there's a pending file
      if (pendingImageFile) {
        if (!userId || !publishedId || !templateSelection) {
          toast.error(
            "Missing user information. Please refresh and try again."
          );
          return;
        }

        const formData = new FormData();
        formData.append("file", pendingImageFile);
        formData.append("sectionName", "about");
        formData.append("imageField", "companyImage" + Date.now());
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
          updatedState.imageUrl = uploadData.imageUrl;
          console.log("Company image uploaded to S3:", uploadData.imageUrl);
        } else {
          const errorData = await uploadResponse.json();
          toast.error(
            `Image upload failed: ${errorData.message || "Unknown error"}`
          );
          return;
        }
      }

      // Clear pending file
      setPendingImageFile(null);

      // Save the updated state with S3 URLs
      setIsSaving(true);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate save API call

      // Update both states with the new URLs
      setProfileState(updatedState);
      setTempProfileState(updatedState);

      setIsEditing(false);
      toast.success("Company profile saved with S3 URLs ready for publish");
    } catch (error) {
      console.error("Error saving company profile:", error);
      toast.error("Error saving changes. Please try again.");
    } finally {
      setIsUploading(false);
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTempProfileState(profileState);
    setPendingImageFile(null);
    setIsEditing(false);
  };

  // Open crop modal
  const openCropModal = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setCropImage(reader.result);
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
      setPendingImageFile(croppedFile);

      // Show immediate local preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setTempProfileState((prev) => ({
          ...prev,
          imageUrl: e.target.result,
        }));
      };
      reader.readAsDataURL(croppedFile);

      setCropModalOpen(false);
      toast.success("Image cropped! Click Save to upload.");
    } catch (error) {
      console.error("Error cropping image:", error);
      toast.error("Error cropping image. Please try again.");
    }
  };

  // Stable update function with useCallback
  const updateTempContent = useCallback((field, value) => {
    setTempProfileState((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Update functions for arrays
  const updateCoreValue = useCallback((index, value) => {
    setTempProfileState((prev) => {
      const updatedCoreValues = [...prev.coreValues];
      updatedCoreValues[index] = value;
      return { ...prev, coreValues: updatedCoreValues };
    });
  }, []);

  // Add new items to arrays
  const addCoreValue = useCallback(() => {
    setTempProfileState((prev) => ({
      ...prev,
      coreValues: [...prev.coreValues, "New Value"],
    }));
  }, []);

  // Remove items from arrays
  const removeCoreValue = useCallback((index) => {
    setTempProfileState((prev) => ({
      ...prev,
      coreValues: prev.coreValues.filter((_, i) => i !== index),
    }));
  }, []);

  // Image upload handler with validation and crop
  const handleImageUpload = useCallback((event) => {
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
    openCropModal(file);

    // Clear the file input to allow selecting the same file again
    event.target.value = "";
  }, []);

  // Memoized EditableText component to prevent recreation
  const EditableText = useMemo(() => {
    return ({
      value,
      field,
      multiline = false,
      className = "",
      placeholder = "",
      onChange = null, // Allow custom onChange handler
    }) => {
      const handleChange = (e) => {
        if (onChange) {
          onChange(e); // Use custom handler if provided
        } else {
          updateTempContent(field, e.target.value); // Use default handler
        }
      };

      const baseClasses =
        "w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none";

      if (multiline) {
        return (
          <textarea
            value={value}
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
          value={value}
          onChange={handleChange}
          className={`${baseClasses} p-1 ${className}`}
          placeholder={placeholder}
        />
      );
    };
  }, [updateTempContent]);

  const displayContent = isEditing ? tempProfileState : profileState;
  const displayCounters = isEditing
    ? {
        growth: displayContent.growthThisYear,
        team: displayContent.teamSize,
        projects: displayContent.projectsDelivered,
      }
    : animatedCounters;

  return (
    <>
      <section
        id="profile"
        ref={sectionRef}
        className="py-24 bg-gradient-to-b from-white to-yellow-50/30 scroll-mt-20 relative"
      >
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-20">
            <div className="bg-white rounded-lg p-6 shadow-lg flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              <span className="text-gray-700">Loading content...</span>
            </div>
          </div>
        )}

        {/* Edit Controls - Only show after data is loaded */}
        {dataLoaded && (
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
        )}

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* LEFT SIDE — Company Image - Full Width & Height */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative w-full h-full min-h-[500px] lg:min-h-[600px]"
            >
              {isEditing && (
                <div className="absolute top-4 right-4 z-10">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    size="sm"
                    variant="outline"
                    className="bg-white/90 backdrop-blur-sm shadow-md"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Change Image
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              )}
              {isEditing && pendingImageFile && (
                <div className="absolute top-16 right-4 z-10 bg-orange-100 text-orange-800 text-xs p-2 rounded shadow-md max-w-[200px]">
                  <div className="font-medium">New image selected:</div>
                  <div className="truncate">{pendingImageFile.name}</div>
                </div>
              )}
              <div className="rounded-3xl overflow-hidden shadow-xl border border-yellow-100 w-full h-full">
                <img
                  src={
                    displayContent.imageUrl ||
                    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop"
                  }
                  alt={`${displayContent.companyName} Office`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback if image fails
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop";
                  }}
                />
              </div>
            </motion.div>

            {/* RIGHT SIDE — Company Info */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2, duration: 0.7 }}
              >
                <Badge className="bg-[#ffeb3b] text-gray-900 px-4 py-1.5 mb-4">
                  Since{" "}
                  {isEditing ? (
                    <input
                      type="number"
                      value={displayContent.establishedYear}
                      onChange={(e) =>
                        updateTempContent("establishedYear", e.target.value)
                      }
                      className="w-20 ml-1 bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1 text-center"
                      placeholder="Year"
                    />
                  ) : (
                    displayContent.establishedYear
                  )}
                </Badge>

                <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                  {isEditing ? (
                    <input
                      type="text"
                      value={displayContent.companyName}
                      onChange={(e) =>
                        updateTempContent("companyName", e.target.value)
                      }
                      className="w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 text-4xl md:text-5xl font-extrabold"
                      placeholder="Company name"
                    />
                  ) : (
                    displayContent.companyName
                  )}
                </h2>

                {isEditing ? (
                  <textarea
                    value={displayContent.description}
                    onChange={(e) =>
                      updateTempContent("description", e.target.value)
                    }
                    className="w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-3 resize-none text-lg text-gray-700 mt-4 max-w-xl"
                    placeholder="Company description"
                    rows={4}
                  />
                ) : (
                  <p className="text-lg text-gray-700 mt-4 max-w-xl">
                    {displayContent.description}
                  </p>
                )}
              </motion.div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-6 mt-8">
                {[
                  {
                    label: "Growth This Year",
                    value: `${displayCounters.growth}%`,
                    field: "growthThisYear",
                    delay: 0.4,
                  },
                  {
                    label: "Happy Clients",
                    value: `${displayContent.satisfiedCustomers}+`,
                    field: "satisfiedCustomers",
                    delay: 0.6,
                  },
                  {
                    label: "Team Members",
                    value: displayCounters.team,
                    field: "teamSize",
                    delay: 0.8,
                  },
                  {
                    label: "Projects Delivered",
                    value: displayCounters.projects,
                    field: "projectsDelivered",
                    delay: 1.0,
                  },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: stat.delay, duration: 0.6 }}
                    className="text-center p-6 bg-white/70 backdrop-blur rounded-2xl border border-yellow-100 hover:shadow-md transition-shadow"
                  >
                    {isEditing ? (
                      <div className="flex flex-col items-center">
                        <input
                          type="number"
                          value={displayContent[stat.field]}
                          onChange={(e) =>
                            updateTempContent(stat.field, e.target.value)
                          }
                          className="w-20 bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1 text-3xl md:text-4xl font-extrabold text-gray-900 text-center mb-1"
                          placeholder="Value"
                        />
                        <div className="text-xs md:text-sm text-gray-600 mt-2 uppercase tracking-wide">
                          {stat.label}
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="text-3xl md:text-4xl font-extrabold text-gray-900">
                          {stat.value}
                        </div>
                        <div className="text-xs md:text-sm text-gray-600 mt-2 uppercase tracking-wide">
                          {stat.label}
                        </div>
                      </>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Core Values */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={isVisible ? { opacity: 1 } : {}}
                transition={{ delay: 1.2, duration: 0.7 }}
                className="mt-8 space-y-4"
              >
                <h3 className="text-xl font-bold text-gray-900">
                  Our Core Values
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  {displayContent.coreValues.map((value, i) => (
                    <motion.div
                      key={i}
                      initial={{ x: -20, opacity: 0 }}
                      animate={isVisible ? { x: 0, opacity: 1 } : {}}
                      transition={{ delay: 1.3 + i * 0.1, duration: 0.5 }}
                      className="flex items-center gap-2 p-3 bg-yellow-50 rounded-xl"
                    >
                      <div className="w-2 h-2 bg-[#ffeb3b] rounded-full"></div>
                      {isEditing ? (
                        <div className="flex items-center gap-2 w-full">
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => updateCoreValue(i, e.target.value)}
                            className="flex-1 bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1"
                            placeholder="Core value"
                          />
                          <Button
                            onClick={() => removeCoreValue(i)}
                            size="sm"
                            variant="outline"
                            className="bg-red-50 hover:bg-red-100 text-red-700 p-1"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-gray-800 font-medium">{value}</span>
                      )}
                    </motion.div>
                  ))}
                  {isEditing && (
                    <Button
                      onClick={addCoreValue}
                      size="sm"
                      variant="outline"
                      className="bg-green-50 hover:bg-green-100 text-green-700 w-full"
                    >
                      <Plus className="w-3 h-3 mr-1" /> Add Value
                    </Button>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Crop Modal */}
      {cropModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999999]">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Crop Company Image</h3>
            <div className="relative w-full h-96 bg-gray-900 rounded-lg overflow-hidden">
              <Cropper
                image={cropImage}
                crop={crop}
                zoom={zoom}
                aspect={4 / 3} // Standard rectangular aspect ratio for company images
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
