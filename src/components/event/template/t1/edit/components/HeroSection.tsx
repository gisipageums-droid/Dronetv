import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  Upload,
  Loader2,
} from "lucide-react";
import Cropper from "react-easy-crop";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface HeroSectionProps {
  heroData?: {
    title: string;
    date: string;
    time: string;
    location: string;
    eventDate: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    videoUrl: string;
    highlights: string[];
    btn1: string;
    btn2: string;
  };
  onStateChange?: (data: any) => void;
  formData?: {
    heroBanner?: {
      uploaded?: boolean;
      mediaType?: string;
      fileName?: string;
      uploading?: boolean;
      mediaUrl?: string;
      error?: string;
    };
    // Other formData properties
    [key: string]: any;
  };
  userId?: string;
  onFormDataChange?: (data: any) => void;
}

// === Aspect ratio selection ===
type AspectRatioType = "original" | "1:1" | "3:2" | "16:9";

// === Fixed dimensions for hero banner ===
const HERO_BANNER_DIMENSIONS = { width: 1200, height: 675 }; // 16:9 aspect ratio

const HeroSection: React.FC<HeroSectionProps> = ({
  heroData,
  onStateChange,
  formData,
  userId,
  onFormDataChange,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const navigate = useNavigate();

  // Track changes for auto-save
  const hasUnsavedChanges = useRef(false);
  const autoSaveTimeoutRef = React.useRef<NodeJS.Timeout>();
  const previousHeroContentRef = useRef<any>(null);

  // Cropping states - ENHANCED WITH ASPECT RATIO OPTIONS
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Aspect ratio selection state
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<AspectRatioType>("original");
  
  // Media size and crop area size for dynamic zoom
  const [mediaSize, setMediaSize] = useState<{ width: number; height: number; naturalWidth: number; naturalHeight: number } | null>(null);
  const [cropAreaSize, setCropAreaSize] = useState<{ width: number; height: number } | null>(null);
  const [minZoomDynamic, setMinZoomDynamic] = useState(0.1);
  const [isDragging, setIsDragging] = useState(false);
  
  // Arrow key panning
  const PAN_STEP = 10;

  // Initialize with prop data or default values
  const [heroContent, setHeroContent] = useState({
    title: "demo Event",
    date: " to ",
    time: " - ",
    location: ", ",
    eventDate: "T:00",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    videoUrl: "",
    highlights: ["Highlight 1", "Highlight 2"],
    btn1: "Register to Visit",
    btn2: "Exhibitor Enquiry",
  });

  const [backupContent, setBackupContent] = useState(heroContent);

  // Update local state when prop data changes
  useEffect(() => {
    if (heroData) {
      setHeroContent(heroData);
      setBackupContent(heroData);
      previousHeroContentRef.current = heroData;
    }
  }, [heroData]);

  // Allow more zoom-out; do not enforce cover when media/crop sizes change
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

  // Auto-save function
  const autoSave = useCallback(async () => {
    if (!onStateChange || !editMode || !hasUnsavedChanges.current) return;

    setIsSaving(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    onStateChange(heroContent);
    setLastSaved(new Date());
    setIsSaving(false);
    hasUnsavedChanges.current = false; // Reset changes flag after save
  }, [heroContent, editMode, onStateChange]);

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
  }, [heroContent, editMode, autoSave, onStateChange]);

  // Effect to detect actual changes in heroContent
  useEffect(() => {
    // Skip initial render and when not in edit mode
    if (previousHeroContentRef.current === null || !editMode) {
      previousHeroContentRef.current = heroContent;
      return;
    }

    // Check if content actually changed
    const hasChanged =
      JSON.stringify(previousHeroContentRef.current) !==
      JSON.stringify(heroContent);

    if (hasChanged) {
      hasUnsavedChanges.current = true;
      previousHeroContentRef.current = heroContent;
    }
  }, [heroContent, editMode]);

  // Get aspect ratio value based on selection
  const getAspectRatio = () => {
    switch (selectedAspectRatio) {
      case "1:1":
        return 1;
      case "3:2":
        return 3 / 2;
      case "16:9":
        return 16 / 9;
      case "original":
      default:
        return HERO_BANNER_DIMENSIONS.width / HERO_BANNER_DIMENSIONS.height;
    }
  };

  // Get display text for aspect ratio
  const getAspectRatioText = () => {
    switch (selectedAspectRatio) {
      case "1:1":
        return "1:1";
      case "3:2":
        return "3:2";
      case "16:9":
        return "16:9";
      case "original":
      default:
        return `${HERO_BANNER_DIMENSIONS.width}:${HERO_BANNER_DIMENSIONS.height}`;
    }
  };

  // Image Upload Handlers
  const handleImageSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setImageToCrop(reader.result as string);
        setOriginalFile(file);
        setShowCropper(true);
        setZoom(1);
        setCrop({ x: 0, y: 0 });
        // Reset to original aspect ratio when new image is loaded
        setSelectedAspectRatio("original");
      };
      reader.readAsDataURL(file);
      e.currentTarget.value = "";
    },
    []
  );

  const onCropComplete = useCallback((_: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  // Function to get cropped image - UPDATED WITH FIXED DIMENSIONS
  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: any
  ): Promise<{ file: File; previewUrl: string }> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get canvas context");

    // Fixed output dimensions - 1200x675 (16:9 aspect ratio)
    const outputWidth = HERO_BANNER_DIMENSIONS.width;
    const outputHeight = HERO_BANNER_DIMENSIONS.height;

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
          if (!blob) throw new Error("Canvas is empty");
          const file = new File([blob], `hero-banner-${Date.now()}.jpg`, {
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

  const uploadImageToS3 = async (
    file: File,
    fieldName: string
  ): Promise<string> => {
    if (!userId) {
      throw new Error("User ID is required for image upload");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);
    formData.append("fieldName", fieldName + Date.now());

    const uploadResponse = await fetch(
      `https://ow3v94b9gf.execute-api.ap-south-1.amazonaws.com/dev/events-image-update`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json().catch(() => ({}));
      throw new Error(errorData.message || "Image upload failed");
    }

    const uploadData = await uploadResponse.json();
    return uploadData.s3Url;
  };

  // Apply crop and UPLOAD IMMEDIATELY to AWS - UPDATED WITH AUTO-SAVE
  const applyCrop = async () => {
    try {
      if (!imageToCrop || !croppedAreaPixels) return;

      setIsUploading(true);
      const { file, previewUrl } = await getCroppedImg(
        imageToCrop,
        croppedAreaPixels
      );

      // Auto-upload to AWS immediately after cropping
      let s3Url = previewUrl;
      try {
        s3Url = await uploadImageToS3(file, "hero-banner");
        toast.success("Banner image uploaded successfully!");

        // Update formData with the new image details
        if (onFormDataChange) {
          if (formData) {
            onFormDataChange({
              ...formData, // Keep all existing form data
              heroBanner: {
                ...(formData.heroBanner || {}), // Preserve existing heroBanner properties if any
                uploaded: true,
                mediaType: "image",
                fileName: file.name,
                uploading: false,
                mediaUrl: s3Url,
                error: "",
              },
            });
          } else {
            // Create formData structure if it doesn't exist
            onFormDataChange({
              heroBanner: {
                uploaded: true,
                mediaType: "image",
                fileName: file.name,
                uploading: false,
                mediaUrl: s3Url,
                error: "",
              },
            });
          }
        }
      } catch (uploadError) {
        console.error("Error uploading to S3:", uploadError);
        toast.error("Image cropped but upload failed.");
        
        // Even if upload fails, still update local state with preview URL
        if (onFormDataChange) {
          if (formData) {
            onFormDataChange({
              ...formData,
              heroBanner: {
                ...(formData.heroBanner || {}),
                uploaded: false,
                mediaType: "image",
                fileName: file.name,
                uploading: false,
                mediaUrl: previewUrl,
                error: uploadError instanceof Error ? uploadError.message : "Upload failed",
              },
            });
          }
        }
      }

      setShowCropper(false);
      setImageToCrop(null);
      setOriginalFile(null);
      setZoom(1);
      setCrop({ x: 0, y: 0 });
      setMediaSize(null);
      setCropAreaSize(null);
    } catch (error) {
      console.error("Error cropping image:", error);
      toast.error("Error cropping image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Cancel cropping - UPDATED
  const cancelCrop = () => {
    setShowCropper(false);
    setImageToCrop(null);
    setOriginalFile(null);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
    setMediaSize(null);
    setCropAreaSize(null);
  };

  // Reset zoom and rotation - UPDATED
  const resetCropSettings = () => {
    setZoom(1);
    setCrop({ x: 0, y: 0 });
  };

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isEventStarted: false,
    isEventExpired: false,
  });

  // Helper function for ordinal suffixes
  const getOrdinalSuffix = (day: number): string => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  // Helper function to convert YouTube URLs to embed format
  const convertToEmbedUrl = (url: string): string => {
    if (!url) return "";

    // If it's already an embed URL, return as is
    if (url.includes("youtube.com/embed/")) {
      return url;
    }

    // Extract video ID from different YouTube URL formats
    let videoId = "";

    // Handle youtu.be format
    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1].split("?")[0];
    }
    // Handle youtube.com/watch format
    else if (url.includes("youtube.com/watch")) {
      const urlParams = new URLSearchParams(url.split("?")[1]);
      videoId = urlParams.get("v") || "";
    }

    // If we found a video ID, create embed URL with autoplay parameters
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&modestbranding=1&showinfo=0&rel=0`;
    }

    // Return original URL if we can't parse it
    return url;
  };

  // Countdown timer effect
  useEffect(() => {
    const updateCountdown = () => {
      if (
        !heroContent.eventDate ||
        !heroContent.endDate ||
        !heroContent.endTime
      )
        return;

      const now = new Date().getTime();
      const eventStartTime = new Date(heroContent.eventDate).getTime();
      const eventEndTime = new Date(
        `${heroContent.endDate}T${heroContent.endTime}:00`
      ).getTime();
      const distanceToStart = eventStartTime - now;
      const distanceToEnd = eventEndTime - now;

      // Event hasn't started yet - show countdown
      if (distanceToStart > 0) {
        const days = Math.floor(distanceToStart / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distanceToStart % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (distanceToStart % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((distanceToStart % (1000 * 60)) / 1000);

        setCountdown({
          days,
          hours,
          minutes,
          seconds,
          isEventStarted: false,
          isEventExpired: false,
        });
      }
      // Event is currently running (started but not ended)
      else if (distanceToEnd > 0) {
        setCountdown({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isEventStarted: true,
          isEventExpired: false,
        });
      }
      // Event has ended - show expired
      else {
        setCountdown({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isEventStarted: false,
          isEventExpired: true,
        });
      }
    };

    // Update immediately
    updateCountdown();

    // Update every second
    const timer = setInterval(updateCountdown, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, [heroContent.eventDate, heroContent.endDate, heroContent.endTime]);

  const handleEditToggle = () => {
    if (!editMode) {
      setBackupContent(heroContent); // save current before editing
      hasUnsavedChanges.current = false; // Reset changes flag when entering edit mode
    } else {
      // When exiting edit mode, save if there are unsaved changes
      if (hasUnsavedChanges.current && onStateChange) {
        onStateChange(heroContent);
        setLastSaved(new Date());
        hasUnsavedChanges.current = false;
      }
    }
    setEditMode(!editMode);
  };

  const handleCancel = () => {
    setHeroContent(backupContent); // restore backup
    if (onStateChange) {
      onStateChange(backupContent); // Sync with parent
    }
    setEditMode(false);
    hasUnsavedChanges.current = false; // Reset changes flag
  };

  // Helper function to update highlights
  const updateHighlight = (index: number, value: string) => {
    const newHighlights = [...heroContent.highlights];
    newHighlights[index] = value;
    setHeroContent({
      ...heroContent,
      highlights: newHighlights,
    });
  };

  // Function to add a new highlight
  const addHighlight = () => {
    setHeroContent({
      ...heroContent,
      highlights: [
        ...heroContent.highlights,
        `Highlight ${heroContent.highlights.length + 1}`,
      ],
    });
  };

  // Function to remove a highlight
  const removeHighlight = (index: number) => {
    // Don't remove if there's only one highlight left
    if (heroContent.highlights.length <= 1) return;

    const newHighlights = [...heroContent.highlights];
    newHighlights.splice(index, 1);
    setHeroContent({
      ...heroContent,
      highlights: newHighlights,
    });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* YouTube Video BG */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <iframe
          key={heroContent.videoUrl} // Force reload when URL changes
          className="w-full h-full object-cover"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            minHeight: "100vh",
          }}
          src={convertToEmbedUrl(
            heroContent.videoUrl ||
              "https://www.youtube.com/embed/tZrpJmS_f40?autoplay=1&mute=1&controls=0&loop=1&playlist=tZrpJmS_f40&modestbranding=1&showinfo=0&rel=0"
          )}
          title="Event Background Video"
          frameBorder="0"
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
        />
        <div className="absolute inset-0 bg-black/60 z-10"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-20 text-center pt-32">
        <div className="max-w-4xl mx-auto">
          {/* Edit/Save/Cancel Buttons */}
          <div className="absolute top-20 right-6 z-30 flex gap-3 items-center">
            {/* Auto-save status */}
            {editMode && onStateChange && (
              <div className="text-sm text-white mr-2 bg-black/40 px-3 py-1 rounded-lg hidden sm:block">
                {isSaving ? (
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    Saving...
                  </span>
                ) : lastSaved ? (
                  <span>Auto-saved {lastSaved.toLocaleTimeString()}</span>
                ) : (
                  <span>No changes to save</span>
                )}
              </div>
            )}

            {editMode ? (
              <>
                <button
                  onClick={handleEditToggle}
                  disabled={isSaving || isUploading}
                  className="flex items-center my-20 gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save size={18} />
                  )}
                  Done
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isSaving || isUploading}
                  className="flex items-center my-20 gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                >
                  <X size={18} /> Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleEditToggle}
                className="flex items-center gap-2 bg-black/60 text-white px-4 py-2 rounded-lg border border-white/30 hover:bg-black/80 transition"
              >
                <Edit size={18} /> Edit
              </button>
            )}
          </div>

          {/* Image Preview Section - Always show when image exists */}
          <div className="absolute top-[10rem] left-[3rem] z-30">
            {formData?.heroBanner?.mediaUrl ? (
              <div className="relative group">
                {/* Image Preview */}
                <img
                  src={formData.heroBanner.mediaUrl}
                  alt="Event Banner Preview"
                  className="w-32 h-32 object-cover rounded-lg border-4 border-white/50 shadow-lg transition-transform duration-300 hover:scale-105"
                />
                
                {/* Hover Overlay - Show upload button only in edit mode on hover */}
                {editMode && (
                  <div className="absolute inset-0 bg-black/70 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2">
                    <label className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer">
                      {isUploading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload size={18} />
                      )}
                      <span>Change Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageSelect}
                        disabled={isUploading}
                      />
                    </label>
                    <p className="text-white text-xs text-center px-2">
                      Click to upload new banner
                    </p>
                  </div>
                )}
                
                {/* Non-edit mode hover overlay */}
                {!editMode && (
                  <div className="absolute inset-0 bg-black/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white text-xs font-medium bg-black/70 px-2 py-1 rounded">
                      Banner Preview
                    </span>
                  </div>
                )}
              </div>
            ) : (
              // Show upload button when no image exists (edit mode only)
              editMode && (
                <label className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer">
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload size={18} />
                  )}
                  <span>Upload Banner Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageSelect}
                    disabled={isUploading}
                  />
                </label>
              )
            )}
          </div>

          {/* Title */}
          {editMode ? (
            <div className="mb-6">
              <input
                type="text"
                value={heroContent.title}
                onChange={(e) =>
                  setHeroContent({ ...heroContent, title: e.target.value })
                }
                placeholder="Event Title"
                maxLength={100}
                className="text-5xl md:text-7xl font-bold text-white mb-1 leading-tight px-4 py-2 rounded-md w-full max-w-2xl mx-auto bg-white/20 backdrop-blur-sm"
              />
              <div className="text-sm text-gray-300 text-right max-w-2xl mx-auto">
                {heroContent.title.length}/100
              </div>
            </div>
          ) : (
            <h1 className="text-5xl md:text-7xl font-bold text-[#FFD400] mb-6 leading-tight">
              {heroContent.title}
            </h1>
          )}

          {/* Date / Time / Location */}
          <div className="flex flex-wrap justify-center gap-6 mb-8 text-white">
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-[#FFD400]" />
              {editMode ? (
                <div className="flex flex-col">
                  <input
                    type="text"
                    value={heroContent.date}
                    onChange={(e) =>
                      setHeroContent({ ...heroContent, date: e.target.value })
                    }
                    placeholder="Date"
                    maxLength={50}
                    className="bg-white text-black px-2 py-1 rounded-md"
                  />
                  <div className="text-xs text-gray-300 text-right">
                    {heroContent.date.length}/50
                  </div>
                </div>
              ) : (
                <span>{heroContent.date}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Clock size={20} className="text-[#FFD400]" />
              {editMode ? (
                <div className="flex flex-col">
                  <input
                    type="text"
                    value={heroContent.time}
                    onChange={(e) =>
                      setHeroContent({ ...heroContent, time: e.target.value })
                    }
                    placeholder="Time"
                    maxLength={50}
                    className="bg-white text-black px-2 py-1 rounded-md"
                  />
                  <div className="text-xs text-gray-300 text-right">
                    {heroContent.time.length}/50
                  </div>
                </div>
              ) : (
                <span>{heroContent.time}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={20} className="text-[#FFD400]" />
              {editMode ? (
                <div className="flex flex-col">
                  <input
                    type="text"
                    value={heroContent.location}
                    onChange={(e) =>
                      setHeroContent({
                        ...heroContent,
                        location: e.target.value,
                      })
                    }
                    placeholder="Location"
                    maxLength={200}
                    className="bg-white text-black px-2 py-1 rounded-md"
                  />
                  <div className="text-xs text-gray-300 text-right">
                    {heroContent.location.length}/200
                  </div>
                </div>
              ) : (
                <span>{heroContent.location}</span>
              )}
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="mb-8">
            {countdown.isEventExpired ? (
              <div className="text-center">
                <div className="inline-block bg-orange-300/20 backdrop-blur-sm rounded-2xl px-8 py-4 border border-red-400/30">
                  <h3 className="text-2xl md:text-3xl font-bold text-green-400 mb-2">
                    ✅ Event has been completed
                  </h3>
                  <p className="text-white text-lg">This event has ended</p>
                </div>
              </div>
            ) : countdown.isEventStarted ? (
              <div className="text-center">
                <div className="inline-block bg-green-500/20 backdrop-blur-sm rounded-2xl px-8 py-4 border border-green-400/30">
                  <h3 className="text-2xl md:text-3xl font-bold text-green-400 mb-2">
                    🎉 Event is Live!
                  </h3>
                  <p className="text-white text-lg">Join us now at the event</p>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <h3 className="text-xl md:text-2xl font-semibold text-white mb-4">
                  Event Starts In
                </h3>
                <div className="flex justify-center gap-4 md:gap-6">
                  <div className="bg-black/40 backdrop-blur-sm rounded-xl px-4 py-3 md:px-6 md:py-4 border border-white/20">
                    <div className="text-2xl md:text-3xl font-bold text-[#FFD400]">
                      {countdown.days}
                    </div>
                    <div className="text-sm md:text-base text-white/80">
                      Days
                    </div>
                  </div>
                  <div className="bg-black/40 backdrop-blur-sm rounded-xl px-4 py-3 md:px-6 md:py-4 border border-white/20">
                    <div className="text-2xl md:text-3xl font-bold text-[#FFD400]">
                      {countdown.hours}
                    </div>
                    <div className="text-sm md:text-base text-white/80">
                      Hours
                    </div>
                  </div>
                  <div className="bg-black/40 backdrop-blur-sm rounded-xl px-4 py-3 md:px-6 md:py-4 border border-white/20">
                    <div className="text-2xl md:text-3xl font-bold text-[#FFD400]">
                      {countdown.minutes}
                    </div>
                    <div className="text-sm md:text-base text-white/80">
                      Minutes
                    </div>
                  </div>
                  <div className="bg-black/40 backdrop-blur-sm rounded-xl px-4 py-3 md:px-6 md:py-4 border border-white/20">
                    <div className="text-2xl md:text-3xl font-bold text-[#FFD400]">
                      {countdown.seconds}
                    </div>
                    <div className="text-sm md:text-base text-white/80">
                      Seconds
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Editable Event Date Range (affects countdown) */}
          {editMode && (
            <div className="mb-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-white block mb-2">Start Date:</label>
                  <input
                    type="date"
                    value={heroContent.startDate}
                    onChange={(e) => {
                      const newStartDate = e.target.value;
                      const eventDateTime = `${newStartDate}T${heroContent.startTime}:00`;
                      setHeroContent({
                        ...heroContent,
                        startDate: newStartDate,
                        eventDate: eventDateTime,
                      });
                    }}
                    className="bg-white text-black px-3 py-2 rounded-md w-full"
                  />
                </div>
                <div>
                  <label className="text-white block mb-2">End Date:</label>
                  <input
                    type="date"
                    value={heroContent.endDate}
                    onChange={(e) =>
                      setHeroContent({
                        ...heroContent,
                        endDate: e.target.value,
                      })
                    }
                    className="bg-white text-black px-3 py-2 rounded-md w-full"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-white block mb-2">Start Time:</label>
                  <input
                    type="time"
                    value={heroContent.startTime}
                    onChange={(e) => {
                      const newStartTime = e.target.value;
                      const eventDateTime = `${heroContent.startDate}T${newStartTime}:00`;
                      setHeroContent({
                        ...heroContent,
                        startTime: newStartTime,
                        eventDate: eventDateTime,
                      });
                    }}
                    className="bg-white text-black px-3 py-2 rounded-md w-full"
                  />
                </div>
                <div>
                  <label className="text-white block mb-2">End Time:</label>
                  <input
                    type="time"
                    value={heroContent.endTime}
                    onChange={(e) =>
                      setHeroContent({
                        ...heroContent,
                        endTime: e.target.value,
                      })
                    }
                    className="bg-white text-black px-3 py-2 rounded-md w-full"
                  />
                </div>
              </div>
              <div className="text-center">
                <button
                  onClick={() => {
                    // Auto-generate display date from selected dates
                    if (!heroContent.startDate) return;

                    const startDate = new Date(heroContent.startDate);
                    const endDate = new Date(heroContent.endDate);
                    const startDay = startDate.getDate();
                    const endDay = endDate.getDate();
                    const month = startDate.toLocaleDateString("en-US", {
                      month: "long",
                    });
                    const year = startDate.getFullYear();

                    // Format start and end times
                    const startTimeFormatted = heroContent.startTime
                      ? new Date(
                          `2000-01-01T${heroContent.startTime}:00`
                        ).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : "9:00 AM";

                    const endTimeFormatted = heroContent.endTime
                      ? new Date(
                          `2000-01-01T${heroContent.endTime}:00`
                        ).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : "6:00 PM";

                    const displayDate =
                      startDay === endDay
                        ? `${startDay}${getOrdinalSuffix(
                            startDay
                          )} ${month} ${year}`
                        : `${startDay}${getOrdinalSuffix(
                            startDay
                          )} – ${endDay}${getOrdinalSuffix(
                            endDay
                          )} ${month} ${year}`;

                    const displayTime = `${startTimeFormatted} - ${endTimeFormatted}`;

                    setHeroContent({
                      ...heroContent,
                      date: displayDate,
                      time: displayTime,
                    });
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Update Display Date & Time
                </button>
              </div>
            </div>
          )}

          {/* Video URL Section */}
          {editMode && (
            <div className="mb-6">
              <div>
                <label className="text-white block mb-2">
                  Background Video URL:
                </label>
                <input
                  type="url"
                  value={heroContent.videoUrl}
                  onChange={(e) =>
                    setHeroContent({ ...heroContent, videoUrl: e.target.value })
                  }
                  placeholder="Paste any YouTube URL (will be auto-converted)"
                  maxLength={500}
                  className="bg-white text-black px-3 py-2 rounded-md w-full max-w-lg"
                />
                <div className="text-gray-300 text-sm mt-1 text-right max-w-lg mx-auto">
                  {heroContent.videoUrl.length}/500
                </div>
                <div className="text-gray-300 text-sm mt-2 space-y-1">
                  <p>
                    <strong>Supported formats:</strong>
                  </p>
                  <p>• https://youtu.be/VIDEO_ID</p>
                  <p>• https://www.youtube.com/watch?v=VIDEO_ID</p>
                  <p>• https://www.youtube.com/embed/VIDEO_ID</p>
                  <p className="text-yellow-300 mt-2">
                    <strong>
                      ✨ Auto-converts to embed format with autoplay!
                    </strong>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Highlights Section with Add/Remove functionality */}
          <div className="text-white text-lg max-w-3xl mx-auto mb-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-left">
              {heroContent.highlights.map((highlight, i) =>
                editMode ? (
                  <div key={i} className="flex items-start gap-2">
                    <div className="flex-1 flex flex-col">
                      <input
                        type="text"
                        value={highlight}
                        onChange={(e) => updateHighlight(i, e.target.value)}
                        placeholder={`Highlight ${i + 1}`}
                        maxLength={200}
                        className="bg-white text-black px-3 py-2 rounded-md w-full"
                      />
                      <div className="text-xs text-gray-300 text-right mt-1">
                        {highlight.length}/200
                      </div>
                    </div>
                    <button
                      onClick={() => removeHighlight(i)}
                      disabled={heroContent.highlights.length <= 1}
                      className={`mt-2 p-2 rounded-md transition-colors ${
                        heroContent.highlights.length <= 1
                          ? "bg-gray-500 cursor-not-allowed"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                      title={
                        heroContent.highlights.length <= 1
                          ? "Cannot remove the last highlight"
                          : "Remove highlight"
                      }
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : (
                  <p key={i}>• {highlight}</p>
                )
              )}
            </div>

            {/* Add Highlight Button (only in edit mode) */}
            {editMode && (
              <div className="mt-4 flex justify-center">
                <button
                  onClick={addHighlight}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  <Plus size={18} /> Add Highlight
                </button>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <div className="group bg-[#FFD400] hover:bg-[#FFD400]/90 text-black px-8 py-4 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-3 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer">
              {editMode ? (
                <div className="flex flex-col items-center">
                  <input
                    type="text"
                    value={heroContent.btn1}
                    onChange={(e) =>
                      setHeroContent({ ...heroContent, btn1: e.target.value })
                    }
                    placeholder="Button 1 Text"
                    maxLength={50}
                    className="bg-white text-black px-2 py-1 rounded-md text-center"
                  />
                  <div className="text-xs text-gray-700 text-right mt-1">
                    {heroContent.btn1.length}/50
                  </div>
                </div>
              ) : (
                <span onClick={() => scrollToSection("#contact")}>
                  {heroContent.btn1}
                </span>
              )}
              <ArrowRight
                size={20}
                className="transform group-hover:translate-x-1 transition-transform"
              />
            </div>

            <div className="group border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-3 transform hover:scale-105 cursor-pointer">
              {editMode ? (
                <div className="flex flex-col items-center">
                  <input
                    type="text"
                    value={heroContent.btn2}
                    onChange={(e) =>
                      setHeroContent({ ...heroContent, btn2: e.target.value })
                    }
                    placeholder="Button 2 Text"
                    maxLength={50}
                    className="bg-white text-black px-2 py-1 rounded-md text-center"
                  />
                  <div className="text-xs text-gray-700 text-right mt-1">
                    {heroContent.btn2.length}/50
                  </div>
                </div>
              ) : (
                <span onClick={() => scrollToSection("#contact")}>
                  {heroContent.btn2}
                </span>
              )}
              <ArrowRight
                size={20}
                className="transform group-hover:translate-x-1 transition-transform"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Cropper Modal - UPDATED WITH ASPECT RATIO OPTIONS */}
      {showCropper && (
        <div className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full h-[80vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800">
                Crop Banner ({getAspectRatioText()} Ratio)
              </h3>
              <button
                onClick={cancelCrop}
                className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Aspect Ratio Selection */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium text-gray-700 mr-2">Aspect Ratio:</span>
                <button
                  onClick={() => setSelectedAspectRatio("original")}
                  className={`px-3 py-1 text-sm rounded border ${
                    selectedAspectRatio === "original"
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                  }`}
                >
                  {HERO_BANNER_DIMENSIONS.width}:{HERO_BANNER_DIMENSIONS.height} (Fixed)
                </button>
                <button
                  onClick={() => setSelectedAspectRatio("1:1")}
                  className={`px-3 py-1 text-sm rounded border ${
                    selectedAspectRatio === "1:1"
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                  }`}
                >
                  1:1 (Square)
                </button>
                <button
                  onClick={() => setSelectedAspectRatio("3:2")}
                  className={`px-3 py-1 text-sm rounded border ${
                    selectedAspectRatio === "3:2"
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                  }`}
                >
                  3:2 (Standard)
                </button>
                <button
                  onClick={() => setSelectedAspectRatio("16:9")}
                  className={`px-3 py-1 text-sm rounded border ${
                    selectedAspectRatio === "16:9"
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                  }`}
                >
                  16:9 (Landscape)
                </button>
              </div>
            </div>

            {/* Cropper Area with dynamic sizing */}
            <div className={`flex-1 relative bg-gray-900 min-h-0 ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}>
              <Cropper
                image={imageToCrop || ""}
                crop={crop}
                zoom={zoom}
                aspect={getAspectRatio()}
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
                showGrid={true}
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
                  className={`w-full ${
                    isUploading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                  } text-white rounded py-2 text-sm font-medium`}
                >
                  {isUploading ? "Uploading..." : "Apply Crop"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;