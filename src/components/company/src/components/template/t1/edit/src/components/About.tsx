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
const getCroppedImg = async (imageSrc, pixelCrop, rotation = 0) => {
  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

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
        const fileName = `cropped-image-${Date.now()}.jpg`;
        const file = new File([blob], fileName, {
          type: "image/jpeg",
          lastModified: Date.now(),
        });
        const previewUrl = URL.createObjectURL(blob);
        resolve({ file, previewUrl });
      },
      "image/jpeg",
      0.95
    );
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

  // Auto-save state
  const [autoSaveTimeout, setAutoSaveTimeout] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Enhanced crop modal state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(4 / 3);

  // Pending image file for S3 upload
  const [pendingImageFile, setPendingImageFile] = useState(null);
  // Local preview URL for immediate display
  const [localPreviewUrl, setLocalPreviewUrl] = useState(null);

  // Default content structure based on the provided JSON (without companyName)
  const defaultContent = {
    industry: aboutData?.industry || "Drone Technology Solutions",
    established: aboutData?.established || "",
    headquarters: aboutData?.headquarters || "",
    description1:
      aboutData?.description1 ||
      "Founded in 2020 by [Founder's Name], our company was born from a vision to provide reliable and innovative drone services. Driven by a passion for cutting-edge technology and a commitment",
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
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
    };
  }, [localPreviewUrl, autoSaveTimeout]);

  // Auto-save effect
  useEffect(() => {
    if (isEditing && hasUnsavedChanges) {
      // Clear existing timeout
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }

      // Set new timeout for auto-save
      const timeout = setTimeout(() => {
        handleAutoSave();
      }, 2000); // Auto-save after 2 seconds of inactivity

      setAutoSaveTimeout(timeout);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [tempAboutState, isEditing, hasUnsavedChanges]);

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
    setHasUnsavedChanges(false);
  };

  // Auto-save function
  // const handleAutoSave = async () => {
  //   if (!isEditing || !hasUnsavedChanges) return;

  //   try {
  //     setIsSaving(true);
      
  //     let finalImageUrl = tempAboutState.officeImage;

  //     // Upload office image if there's a pending file
  //     if (pendingImageFile) {
  //       if (!userId || !publishedId || !templateSelection) {
  //         console.error("Missing user information for image upload");
  //         return;
  //       }

  //       try {
  //         setIsUploading(true);
  //         const formData = new FormData();
  //         formData.append("file", pendingImageFile);
  //         formData.append("sectionName", "about");
  //         formData.append("imageField", "officeImage" + Date.now());
  //         formData.append("templateSelection", templateSelection);

  //         const uploadResponse = await fetch(
  //           `https://o66ziwsye5.execute-api.ap-south-1.amazonaws.com/prod/upload-image/${userId}/${publishedId}`,
  //           {
  //             method: "POST",
  //             body: formData,
  //           }
  //         );

  //         if (uploadResponse.ok) {
  //           const uploadData = await uploadResponse.json();
  //           finalImageUrl = uploadData.imageUrl;
  //           console.log("Office image auto-uploaded to S3:", uploadData.imageUrl);
  //         } else {
  //           const errorData = await uploadResponse.json();
  //           console.error("Image auto-upload failed:", errorData.message || "Unknown error");
  //           // Don't toast error for auto-save to avoid annoying the user
  //         }
  //       } catch (uploadError) {
  //         console.error("Auto-upload error:", uploadError);
  //         // Don't toast error for auto-save
  //       } finally {
  //         setIsUploading(false);
  //       }
  //     }

  //     // Create the final updated state
  //     const updatedState = {
  //       ...tempAboutState,
  //       officeImage: finalImageUrl,
  //     };

  //     // Simulate API call delay for text content
  //     await new Promise((resolve) => setTimeout(resolve, 500));

  //     // Update the main state with the new data
  //     setAboutState(updatedState);

  //     // Clean up preview URL and pending file if image was uploaded
  //     if (pendingImageFile && finalImageUrl !== tempAboutState.officeImage) {
  //       if (localPreviewUrl) {
  //         URL.revokeObjectURL(localPreviewUrl);
  //         setLocalPreviewUrl(null);
  //       }
  //       setPendingImageFile(null);
  //     }

  //     setLastSaved(new Date());
  //     setHasUnsavedChanges(false);
      
  //     // Show subtle auto-save indicator
  //     toast.info("Changes auto-saved", {
  //       autoClose: 1000,
  //       hideProgressBar: true,
  //     });
  //   } catch (error) {
  //     console.error("Error auto-saving about section:", error);
  //     // Don't show error toast for auto-save failures
  //   } finally {
  //     setIsSaving(false);
  //   }
  // };


  // Auto-save function
const handleAutoSave = async () => {
  if (!isEditing || !hasUnsavedChanges) return;

  try {
    setIsSaving(true);
    
    let finalImageUrl = tempAboutState.officeImage;

    // Upload office image if there's a pending file
    if (pendingImageFile) {
      if (!userId || !publishedId || !templateSelection) {
        console.error("Missing user information for image upload");
        return;
      }

      try {
        setIsUploading(true);
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
          console.log("Office image auto-uploaded to S3:", uploadData.imageUrl);
        } else {
          const errorData = await uploadResponse.json();
          console.error("Image auto-upload failed:", errorData.message || "Unknown error");
          // Don't toast error for auto-save to avoid annoying the user
        }
      } catch (uploadError) {
        console.error("Auto-upload error:", uploadError);
        // Don't toast error for auto-save
      } finally {
        setIsUploading(false);
      }
    }

    // Create the final updated state
    const updatedState = {
      ...tempAboutState,
      officeImage: finalImageUrl,
    };

    // Simulate API call delay for text content
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Update the main state with the new data
    setAboutState(updatedState);
    
    // ALSO UPDATE TEMP STATE - This is the key fix!
    setTempAboutState(updatedState);

    // Clean up preview URL and pending file if image was uploaded
    if (pendingImageFile && finalImageUrl !== tempAboutState.officeImage) {
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
        setLocalPreviewUrl(null);
      }
      setPendingImageFile(null);
    }

    setLastSaved(new Date());
    setHasUnsavedChanges(false);
    
    // Show subtle auto-save indicator
    toast.info("Changes auto-saved", {
      autoClose: 1000,
      hideProgressBar: true,
    });
  } catch (error) {
    console.error("Error auto-saving about section:", error);
    // Don't show error toast for auto-save failures
  } finally {
    setIsSaving(false);
  }
}; 


  // Enhanced cropper functions
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

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
      setPendingImageFile(file);

      // Create and store local preview URL for immediate display
      // Clean up previous preview URL if exists
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
      }

      setLocalPreviewUrl(previewUrl);
      setHasUnsavedChanges(true); // Trigger auto-save

      setCropModalOpen(false);
      setImageToCrop(null);
      setOriginalFile(null);
      toast.success("Image cropped successfully! Changes will be auto-saved.");
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

  // Enhanced image upload handler
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

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageToCrop(reader.result);
      setOriginalFile(file);
      setCropModalOpen(true);
      setAspectRatio(4 / 3); // Standard for office images
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
    };
    reader.readAsDataURL(file);

    // Clear the file input to allow selecting the same file again
    event.target.value = "";
  }, []);

  // Manual Save function (for when user explicitly clicks save)
  const handleSave = async () => {
    try {
      setIsUploading(true);
      setIsSaving(true);

      let finalImageUrl = tempAboutState.officeImage;

      // Upload office image if there's a pending file
      if (pendingImageFile) {
        if (!userId || !publishedId || !templateSelection) {
          toast.error(
            "Missing user information. Please refresh and try again."
          );
          setIsUploading(false);
          setIsSaving(false);
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
            toast.error(
              `Image upload failed: ${errorData.message || "Unknown error"}`
            );
            setIsUploading(false);
            setIsSaving(false);
            return;
          }
        } catch (uploadError) {
          console.error("Upload error:", uploadError);
          toast.error("Image upload failed. Please try again.");
          setIsUploading(false);
          setIsSaving(false);
          return;
        }
      }

      // Create the final updated state
      const updatedState = {
        ...tempAboutState,
        officeImage: finalImageUrl,
      };

      // Simulate API call delay
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
      setHasUnsavedChanges(false);
      setLastSaved(new Date());
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
    setHasUnsavedChanges(false);
    
    // Clear any pending auto-save
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
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

  // Stable update function with useCallback - now triggers auto-save
  const updateTempContent = useCallback((field, value) => {
    setTempAboutState((prev) => {
      const newState = { ...prev, [field]: value };
      setHasUnsavedChanges(true);
      return newState;
    });
  }, []);

  // Update functions for arrays - now trigger auto-save
  const updateCertification = useCallback((index, value) => {
    setTempAboutState((prev) => {
      const updatedCertifications = [...prev.certifications];
      updatedCertifications[index] = value;
      const newState = { ...prev, certifications: updatedCertifications };
      setHasUnsavedChanges(true);
      return newState;
    });
  }, []);

  const updateAchievement = useCallback((index, value) => {
    setTempAboutState((prev) => {
      const updatedAchievements = [...prev.achievements];
      updatedAchievements[index] = value;
      const newState = { ...prev, achievements: updatedAchievements };
      setHasUnsavedChanges(true);
      return newState;
    });
  }, []);

  // Add new items to arrays - now trigger auto-save
  const addCertification = useCallback(() => {
    setTempAboutState((prev) => {
      const newState = {
        ...prev,
        certifications: [...prev.certifications, "New Certification"],
      };
      setHasUnsavedChanges(true);
      return newState;
    });
  }, []);

  const addAchievement = useCallback(() => {
    setTempAboutState((prev) => {
      const newState = {
        ...prev,
        achievements: [...prev.achievements, "New Achievement"],
      };
      setHasUnsavedChanges(true);
      return newState;
    });
  }, []);

  // Remove items from arrays - now trigger auto-save
  const removeCertification = useCallback((index) => {
    setTempAboutState((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }));
    setHasUnsavedChanges(true);
  }, []);

  const removeAchievement = useCallback((index) => {
    setTempAboutState((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index),
    }));
    setHasUnsavedChanges(true);
  }, []);

  // Memoized EditableText component to prevent recreation
  const EditableText = useMemo(() => {
    return ({
      value,
      field,
      multiline = false,
      className = "",
      placeholder = "",
      onChange = null,
      maxLength = null,
    }) => {
      const handleChange = (e) => {
        if (maxLength && e.target.value.length > maxLength) {
          return;
        }
        if (onChange) {
          onChange(e);
        } else {
          updateTempContent(field, e.target.value);
        }
      };

      const baseClasses =
        "w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none transition-colors duration-200";

      return (
        <div className="relative">
          {multiline ? (
            <textarea
              value={value}
              onChange={handleChange}
              className={`${baseClasses} p-2 resize-none ${className}`}
              placeholder={placeholder}
              rows={3}
              maxLength={maxLength}
            />
          ) : (
            <input
              type="text"
              value={value}
              onChange={handleChange}
              className={`${baseClasses} p-1 ${className}`}
              placeholder={placeholder}
              maxLength={maxLength}
            />
          )}
          {maxLength && (
            <div className="text-right text-xs text-gray-500 mt-1">
              {value.length}/{maxLength}
            </div>
          )}
        </div>
      );
    };
  }, [updateTempContent]);

  const displayContent = isEditing ? tempAboutState : aboutState;

  return (
    <>
      {/* Enhanced Crop Modal */}
      {cropModalOpen && (
        <motion.div

          className="fixed inset-0 bg-black/90 z-[99999999] flex items-center justify-center p-4"
        >
          <motion.div
            
            className="bg-white rounded-xl max-w-4xl w-full h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800">
                Crop Office Image
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
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setZoom((z) => Math.max(0.5, +(z - 0.1).toFixed(2)))
                    }
                    className="px-3 py-1.5 text-sm rounded border bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
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
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setZoom((z) => Math.min(4, +(z + 0.1).toFixed(2)))
                    }
                    className="px-3 py-1.5 text-sm rounded border bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoom(1)}
                    className="px-3 py-1.5 text-sm rounded border bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
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

        {/* Auto-save indicator */}
        {isEditing && (isSaving || isUploading) && (
          <div className="absolute top-4 left-4 z-10 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
            <Loader2 className="w-3 h-3 animate-spin" />
            Auto-saving...
          </div>
        )}

        {isEditing && lastSaved && !isSaving && !isUploading && (
          <div className="absolute top-4 left-4 z-10 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
            Last saved: {lastSaved.toLocaleTimeString()}
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
              
              className="space-y-6"
            >
              <div>
                <Badge className="bg-yellow-400 text-gray-900 mb-4">
                  About Company
                </Badge>

                {/* Updated heading without companyName */}
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  About Us
                </h2>
              </div>

              {/* Company Info Grid - Now with 3 columns (removed companyName) */}
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  {/* Industry */}
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
                        maxLength={50}
                      />
                    ) : (
                      <p className="font-semibold text-gray-900">
                        {displayContent.industry}
                      </p>
                    )}
                  </div>
                  
                  {/* Established */}
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
                        maxLength={50}
                      />
                    ) : (
                      <p className="font-semibold text-gray-900">
                        {displayContent.established}
                      </p>
                    )}
                  </div>
                  
                  {/* Headquarters */}
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
                        maxLength={50}
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
                      maxLength={600}
                    />
                    <EditableText
                      value={displayContent.description2}
                      field="description2"
                      multiline={true}
                      className="text-gray-600 leading-relaxed text-base"
                      placeholder="Company description part 2"
                      maxLength={600}
                    />
                  </>
                ) : (
                  <>
                    <p className="text-gray-600 leading-relaxed text-base text-justify">
                      {displayContent.description1}
                    </p>
                    <p className="text-gray-600 leading-relaxed text-base text-justify">
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
                      className="text-gray-700 text-sm leading-relaxed w-full text-justify"
                      placeholder="Mission statement"
                      maxLength={600}
                    />
                  ) : (
                    <p className="text-gray-700 text-sm leading-relaxed ">
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
                      className="text-gray-700 text-sm leading-relaxed w-full text-justify"
                      placeholder="Vision statement"
                      maxLength={600}
                    />
                  ) : (
                    <p className="text-gray-700 text-sm leading-relaxed ">
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
                          onChange={(e) => {
                            if (e.target.value.length <= 100) {
                              updateCertification(index, e.target.value);
                            }
                          }}
                          className="w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 text-sm"
                          placeholder="Certification"
                          maxLength={100}
                        />
                        <div className="text-xs text-gray-500 whitespace-nowrap">
                          {cert.length}/100
                        </div>
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
                        <span className="text-justify">{cert}</span>
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
                          onChange={(e) => {
                            if (e.target.value.length <= 100) {
                              updateAchievement(index, e.target.value);
                            }
                          }}
                          className="w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 text-sm"
                          placeholder="Achievement"
                          maxLength={100}
                        />
                        <div className="text-xs text-gray-500 whitespace-nowrap">
                          {achievement.length}/100
                        </div>
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
                        <span className="text-justify">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>

            <motion.div
             
              className="space-y-4"
            >
              <div
                className="relative overflow-hidden rounded-2xl shadow-2xl group cursor-pointer"
                onClick={() => {
                  if (isEditing) fileInputRef.current?.click();
                }}
              >
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
                  className="w-full h-auto object-cover transition-opacity duration-300 scale-110"
                  onClick={() => {
                    if (isEditing) fileInputRef.current?.click();
                  }}
                  onError={(e) => {
                    console.error("Image failed to load:", e);
                    e.target.src =
                      "https://via.placeholder.com/500x300?text=Office+Image";
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
                          onChange={(e) => {
                            if (e.target.value.length <= 100) {
                              updateCertification(index, e.target.value);
                            }
                          }}
                          className="w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 text-sm"
                          placeholder="Certification"
                          maxLength={100}
                        />
                        <div className="text-xs text-gray-500 whitespace-nowrap">
                          {cert.length}/100
                        </div>
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
                        <span className="text-justify">{cert}</span>
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
                          onChange={(e) => {
                            if (e.target.value.length <= 100) {
                              updateAchievement(index, e.target.value);
                            }
                          }}
                          className="w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 text-sm"
                          placeholder="Achievement"
                          maxLength={100}
                        />
                        <div className="text-xs text-gray-500 whitespace-nowrap">
                          {achievement.length}/100
                        </div>
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
                        <span className="text-justify">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}