import { motion } from "motion/react";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Edit2, Save, X, Upload, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import Cropper from "react-easy-crop";
import img from "../public/images/About/About.jpg";

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

export default function EditableAbout({
  aboutData,
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
  // Local preview URL for immediate display
  const [localPreviewUrl, setLocalPreviewUrl] = useState(null);

  // Default content structure based on the provided JSON
  const defaultContent = {
    companyName: aboutData?.companyName || "",
    industry: aboutData?.industry || "Drone Technology Solutions",
    established: aboutData?.established || "",
    headquarters: aboutData?.headquarters || "",
    description1:
      aboutData?.description1 ||
      "Founded in 2020 by [Founder's Name], [Company Name] was born from a vision to provide reliable and innovative drone services. Driven by a passion for cutting-edge technology and a commitment",
    description2:
      aboutData?.description2 ||
      "to safety, we aimed to redefine aerial data acquisition. Our early projects focused on building a strong foundation of expertise",
    mission:
      aboutData?.mission ||
      "To provide safe, reliable, and innovative drone technology solutions that empower businesses and improve lives.",
    vision:
      aboutData?.vision ||
      "To be the leading provider of cutting-edge drone technology, shaping the future of aerial data acquisition and analysis.",
    officeImage: aboutData?.officeImage || img,
    certifications: aboutData?.certifications || [
      "DGCA Remote Pilot License",
      "Professional Drone Operations Certification",
      "Advanced Aerial Photography Training",
    ],
    achievements: aboutData?.achievements || [
      "500+ Successful Drone Operations Completed",
      "DGCA Certified Pilots and Operations",
      "99.8% Project Success Rate Achieved",
    ],
  };

  // Consolidated state
  const [aboutState, setAboutState] = useState(defaultContent);
  const [tempAboutState, setTempAboutState] = useState(defaultContent);

  // Notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(aboutState);
    }
  }, [aboutState, onStateChange]);

  // Initialize with aboutData when it changes
  useEffect(() => {
    if (aboutData) {
      const updatedState = {
        ...defaultContent,
        ...aboutData,
        officeImage: aboutData.officeImage || defaultContent.officeImage,
      };
      
      setAboutState(updatedState);
      setTempAboutState(updatedState);
      setDataLoaded(true);
    }
  }, [aboutData]);

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

  // Clean up local preview URL when component unmounts or when editing ends
  useEffect(() => {
    return () => {
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
      }
    };
  }, [localPreviewUrl]);

  // Simulate API call to fetch data from database
  const fetchAboutData = async () => {
    setIsLoading(true);
    try {
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve(defaultContent);
        }, 1500);
      });

      setAboutState(response);
      setTempAboutState(response);
      setDataLoaded(true);
    } catch (error) {
      console.error("Error fetching about data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when component becomes visible
  useEffect(() => {
    if (isVisible && !dataLoaded && !isLoading && !aboutData) {
      fetchAboutData();
    }
  }, [isVisible, dataLoaded, isLoading, aboutData]);

  const handleEdit = () => {
    setIsEditing(true);
    setTempAboutState(aboutState);
    setPendingImageFile(null);
    setLocalPreviewUrl(null);
  };

  // Fixed Save function with proper image handling
  const handleSave = async () => {
    try {
      setIsUploading(true);

      let finalImageUrl = tempAboutState.officeImage;

      // Upload office image if there's a pending file
      if (pendingImageFile) {
        if (!userId || !publishedId || !templateSelection) {
          toast.error("Missing user information. Please refresh and try again.");
          setIsUploading(false);
          return;
        }

        try {
          const formData = new FormData();
          formData.append("file", pendingImageFile);
          formData.append("sectionName", "about");
          formData.append("imageField", "officeImage" + Date.now());
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
            finalImageUrl = uploadData.imageUrl;
            console.log("Office image uploaded to S3:", uploadData.imageUrl);
            toast.success("Image uploaded successfully!");
          } else {
            const errorData = await uploadResponse.json();
            toast.error(`Image upload failed: ${errorData.message || "Unknown error"}`);
            setIsUploading(false);
            return;
          }
        } catch (uploadError) {
          console.error("Upload error:", uploadError);
          toast.error("Image upload failed. Please try again.");
          setIsUploading(false);
          return;
        }
      }

      // Create the final updated state
      const updatedState = {
        ...tempAboutState,
        officeImage: finalImageUrl,
      };

      // Simulate API call delay
      setIsSaving(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update both states with the new data
      setAboutState(updatedState);
      setTempAboutState(updatedState);

      // Clean up preview URL and pending file
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
        setLocalPreviewUrl(null);
      }
      setPendingImageFile(null);

      setIsEditing(false);
      toast.success("About section saved successfully!");
    } catch (error) {
      console.error("Error saving about section:", error);
      toast.error("Error saving changes. Please try again.");
    } finally {
      setIsUploading(false);
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTempAboutState(aboutState);
    
    // Clean up preview URL
    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl);
    }
    
    setLocalPreviewUrl(null);
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

      // Create and store local preview URL for immediate display
      const previewUrl = URL.createObjectURL(croppedFile);

      // Clean up previous preview URL if exists
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
      }

      setLocalPreviewUrl(previewUrl);
      toast.success("Image cropped! Click Save to upload.");

      setCropModalOpen(false);
    } catch (error) {
      console.error("Error cropping image:", error);
      toast.error("Error cropping image. Please try again.");
    }
  };

  // Simplified image source handler
  const getImageSource = () => {
    // During editing with a new image selected, show local preview
    if (isEditing && localPreviewUrl) {
      return localPreviewUrl;
    }

    // During editing without new image, show current temp image
    if (isEditing && tempAboutState.officeImage) {
      return getImageUrl(tempAboutState.officeImage);
    }

    // When not editing, show saved image from aboutState
    if (aboutState.officeImage) {
      return getImageUrl(aboutState.officeImage);
    }

    // Fallback to default image
    return getImageUrl(img);
  };

  // Helper function to extract URL from different image formats
  const getImageUrl = (image) => {
    if (!image) return "https://via.placeholder.com/500x300?text=Office+Image";
    
    if (typeof image === "string") {
      return image;
    } else if (image.src) {
      return image.src;
    } else if (image.url) {
      return image.url;
    }
    
    return "https://via.placeholder.com/500x300?text=Office+Image";
  };

  // Stable update function with useCallback
  const updateTempContent = useCallback((field, value) => {
    setTempAboutState((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Update functions for arrays
  const updateCertification = useCallback((index, value) => {
    setTempAboutState((prev) => {
      const updatedCertifications = [...prev.certifications];
      updatedCertifications[index] = value;
      return { ...prev, certifications: updatedCertifications };
    });
  }, []);

  const updateAchievement = useCallback((index, value) => {
    setTempAboutState((prev) => {
      const updatedAchievements = [...prev.achievements];
      updatedAchievements[index] = value;
      return { ...prev, achievements: updatedAchievements };
    });
  }, []);

  // Add new items to arrays
  const addCertification = useCallback(() => {
    setTempAboutState((prev) => ({
      ...prev,
      certifications: [...prev.certifications, "New Certification"],
    }));
  }, []);

  const addAchievement = useCallback(() => {
    setTempAboutState((prev) => ({
      ...prev,
      achievements: [...prev.achievements, "New Achievement"],
    }));
  }, []);

  // Remove items from arrays
  const removeCertification = useCallback((index) => {
    setTempAboutState((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }));
  }, []);

  const removeAchievement = useCallback((index) => {
    setTempAboutState((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index),
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
      toast.error("File size must be less than 5MB");
      return;
    }

    // Open crop modal instead of direct upload
    openCropModal(file);

    // Clear the file input to allow selecting the same file again
    event.target.value = "";
  }, [localPreviewUrl]);

  // Memoized EditableText component to prevent recreation
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
          updateTempContent(field, e.target.value);
        }
      };

      const baseClasses =
        "w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none transition-colors duration-200";

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

  const displayContent = isEditing ? tempAboutState : aboutState;

  return (
    <>
      <section
        id="about"
        ref={sectionRef}
        className="py-20 bg-gradient-to-b from-blue-50 to-white scroll-mt-20 relative"
      >
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-blue-50/80 flex items-center justify-center z-20">
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
                className="bg-white hover:bg-gray-50 shadow-md border-gray-300"
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
                  className="bg-white hover:bg-gray-50 shadow-md border-gray-300"
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
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div>
                <Badge className="bg-yellow-400 text-gray-900 mb-4">
                  About Company
                </Badge>

                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  About {displayContent.companyName}
                </h2>
              </div>

              {/* Company Info Grid */}
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-gray-500 text-xs uppercase tracking-wide">
                      Company
                    </p>
                    {isEditing ? (
                      <EditableText
                        value={displayContent.companyName}
                        field="companyName"
                        placeholder="Company name"
                        className="w-full"
                      />
                    ) : (
                      <p className="font-semibold text-gray-900">
                        {displayContent.companyName}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-500 text-xs uppercase tracking-wide">
                      Industry
                    </p>
                    {isEditing ? (
                      <EditableText
                        value={displayContent.industry}
                        field="industry"
                        placeholder="Industry"
                        className="w-full"
                      />
                    ) : (
                      <p className="font-semibold text-gray-900">
                        {displayContent.industry}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-500 text-xs uppercase tracking-wide">
                      Established
                    </p>
                    {isEditing ? (
                      <EditableText
                        value={displayContent.established}
                        field="established"
                        placeholder="Year established"
                        className="w-full"
                      />
                    ) : (
                      <p className="font-semibold text-gray-900">
                        {displayContent.established}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-500 text-xs uppercase tracking-wide">
                      Headquarters
                    </p>
                    {isEditing ? (
                      <EditableText
                        value={displayContent.headquarters}
                        field="headquarters"
                        placeholder="Headquarters location"
                        className="w-full"
                      />
                    ) : (
                      <p className="font-semibold text-gray-900">
                        {displayContent.headquarters}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                {isEditing ? (
                  <>
                    <EditableText
                      value={displayContent.description1}
                      field="description1"
                      multiline={true}
                      className="text-gray-600 leading-relaxed text-base"
                      placeholder="Company description part 1"
                    />
                    <EditableText
                      value={displayContent.description2}
                      field="description2"
                      multiline={true}
                      className="text-gray-600 leading-relaxed text-base"
                      placeholder="Company description part 2"
                    />
                  </>
                ) : (
                  <>
                    <p className="text-gray-600 leading-relaxed text-base">
                      {displayContent.description1}
                    </p>
                    <p className="text-gray-600 leading-relaxed text-base">
                      {displayContent.description2}
                    </p>
                  </>
                )}
              </div>

              {/* Mission & Vision */}
              <div className="space-y-4">
                <div className="bg-blue-100 rounded-lg p-5 border-l-4 border-blue-600">
                  <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="text-blue-600">🎯</span> Mission
                  </h3>
                  {isEditing ? (
                    <EditableText
                      value={displayContent.mission}
                      field="mission"
                      multiline={true}
                      className="text-gray-700 text-sm leading-relaxed w-full"
                      placeholder="Mission statement"
                    />
                  ) : (
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {displayContent.mission}
                    </p>
                  )}
                </div>
                <div className="bg-purple-100 rounded-lg p-5 border-l-4 border-purple-600">
                  <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="text-purple-600">👁️</span> Vision
                  </h3>
                  {isEditing ? (
                    <EditableText
                      value={displayContent.vision}
                      field="vision"
                      multiline={true}
                      className="text-gray-700 text-sm leading-relaxed w-full"
                      placeholder="Vision statement"
                    />
                  ) : (
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {displayContent.vision}
                    </p>
                  )}
                </div>
              </div>

              {/* Certifications - Mobile */}
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 block lg:hidden">
                <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
                  <span className="text-green-600">✓</span> Certifications
                </h3>
                {isEditing ? (
                  <div className="space-y-3">
                    {displayContent.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={cert}
                          onChange={(e) =>
                            updateCertification(index, e.target.value)
                          }
                          className="w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 text-sm"
                          placeholder="Certification"
                        />
                        <Button
                          onClick={() => removeCertification(index)}
                          size="sm"
                          variant="outline"
                          className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      onClick={addCertification}
                      size="sm"
                      variant="outline"
                      className="bg-green-50 hover:bg-green-100 text-green-700 mt-2 border-green-200"
                    >
                      <Plus className="w-3 h-3 mr-1" /> Add Certification
                    </Button>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {displayContent.certifications.map((cert, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-gray-700 text-sm"
                      >
                        <span className="text-green-600 mt-0.5">•</span>
                        <span>{cert}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Achievements - Mobile */}
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 block lg:hidden">
                <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
                  <span className="text-yellow-600">🏆</span> Achievements
                </h3>
                {isEditing ? (
                  <div className="space-y-3">
                    {displayContent.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={achievement}
                          onChange={(e) =>
                            updateAchievement(index, e.target.value)
                          }
                          className="w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 text-sm"
                          placeholder="Achievement"
                        />
                        <Button
                          onClick={() => removeAchievement(index)}
                          size="sm"
                          variant="outline"
                          className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      onClick={addAchievement}
                      size="sm"
                      variant="outline"
                      className="bg-green-50 hover:bg-green-100 text-green-700 mt-2 border-green-200"
                    >
                      <Plus className="w-3 h-3 mr-1" /> Add Achievement
                    </Button>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {displayContent.achievements.map((achievement, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-gray-700 text-sm"
                      >
                        <span className="text-yellow-600 mt-0.5">•</span>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-4"
            >
              <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
                {isEditing && (
                  <div className="absolute top-4 right-4 z-10">
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      size="sm"
                      variant="outline"
                      className="bg-white/90 backdrop-blur-sm shadow-md border-gray-300 hover:bg-white"
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
                  <div className="absolute top-16 right-4 z-10 bg-orange-100 text-orange-800 text-xs p-2 rounded shadow-md border border-orange-200">
                    <div className="font-medium">New image selected:</div>
                    <div className="truncate max-w-[200px]">
                      {pendingImageFile.name}
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent mix-blend-multiply"></div>
                <img
                  src={getImageSource()}
                  alt="Office"
                  className="w-full h-auto object-cover transition-opacity duration-300"
                  onError={(e) => {
                    console.error("Image failed to load:", e);
                    e.target.src = "https://via.placeholder.com/500x300?text=Office+Image";
                  }}
                />
                {isEditing && (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="text-white font-medium bg-black/50 px-3 py-2 rounded-lg">
                      Click Change Image to upload
                    </span>
                  </div>
                )}
              </div>

              {/* Certifications - Desktop */}
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hidden lg:block">
                <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
                  <span className="text-green-600">✓</span> Certifications
                </h3>
                {isEditing ? (
                  <div className="space-y-3">
                    {displayContent.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={cert}
                          onChange={(e) =>
                            updateCertification(index, e.target.value)
                          }
                          className="w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 text-sm"
                          placeholder="Certification"
                        />
                        <Button
                          onClick={() => removeCertification(index)}
                          size="sm"
                          variant="outline"
                          className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      onClick={addCertification}
                      size="sm"
                      variant="outline"
                      className="bg-green-50 hover:bg-green-100 text-green-700 mt-2 border-green-200"
                    >
                      <Plus className="w-3 h-3 mr-1" /> Add Certification
                    </Button>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {displayContent.certifications.map((cert, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-gray-700 text-sm"
                      >
                        <span className="text-green-600 mt-0.5">•</span>
                        <span>{cert}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Achievements - Desktop */}
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hidden lg:block">
                <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
                  <span className="text-yellow-600">🏆</span> Achievements
                </h3>
                {isEditing ? (
                  <div className="space-y-3">
                    {displayContent.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={achievement}
                          onChange={(e) =>
                            updateAchievement(index, e.target.value)
                          }
                          className="w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 text-sm"
                          placeholder="Achievement"
                        />
                        <Button
                          onClick={() => removeAchievement(index)}
                          size="sm"
                          variant="outline"
                          className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      onClick={addAchievement}
                      size="sm"
                      variant="outline"
                      className="bg-green-50 hover:bg-green-100 text-green-700 mt-2 border-green-200"
                    >
                      <Plus className="w-3 h-3 mr-1" /> Add Achievement
                    </Button>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {displayContent.achievements.map((achievement, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-gray-700 text-sm"
                      >
                        <span className="text-yellow-600 mt-0.5">•</span>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Crop Modal */}
      {cropModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[999999]">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Crop Office Image </h3>
            <div className="relative w-full h-96 bg-gray-900 rounded-lg overflow-hidden">
              <Cropper
                image={cropImage}
                crop={crop}
                zoom={zoom}
                aspect={4 / 3} // Standard rectangular aspect ratio for office images
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