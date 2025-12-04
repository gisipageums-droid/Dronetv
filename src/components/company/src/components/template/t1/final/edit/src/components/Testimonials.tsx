import React, { useState, useEffect, useCallback, useRef, ChangeEvent } from "react";
import type { Area } from "react-easy-crop/types";
import {
  Edit2,
  Plus,
  Trash2,
  Upload,
  Loader2,
  Save,
  X,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { toast } from "react-toastify";
import Cropper from "react-easy-crop";
import { motion } from "motion/react";
import user from "/images/user.png";

interface Testimonial {
  name: string;
  rating?: number;
  image?: string;
  role?: string;
  quote?: string;
}

interface TestimonialsContent {
  headline: {
    title: string;
    description: string;
  };
  testimonials: Testimonial[];
}

interface EditableTestimonialsProps {
  content?: TestimonialsContent;
  onStateChange?: (data: TestimonialsContent) => void;
  userId?: string | number;
  publishedId?: string | number;
  templateSelection?: string;
}

export default function EditableTestimonials({
  content,
  onStateChange,
  userId,
  publishedId,
  templateSelection,
}: EditableTestimonialsProps) {
  // Character limits
  const CHAR_LIMITS = {
    title: 100,
    description: 200,
    name: 100,
    role: 100,
    quote: 500,
  };

  const [editMode, setEditMode] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [current, setCurrent] = useState<number>(0);

  // Track changes for auto-save
  const hasUnsavedChanges = useRef(false);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();
  const previousContentRef = useRef<any>(null);

  // Crop modal state
  const [cropModalOpen, setCropModalOpen] = useState<boolean>(false);
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [aspectRatio, setAspectRatio] = useState<number>(1);
  const [cropIndex, setCropIndex] = useState<number | null>(null);

  // Default data
  const defaultTestimonials: Testimonial[] = [
    {
      name: "John Doe",
      rating: 5.0,
      image: "https://tamilnaducouncil.ac.in/wp-content/uploads/2020-04/dummy-avatar.jpg",
      role: "CEO, TechCorp",
      quote: "This event was absolutely amazing! The organization and content were top-notch.",
    },
    {
      name: "Jane Smith",
      rating: 4.5,
      image: "https://tamilnaducouncil.ac.in/wp-content/uploads/2020-04/dummy-avatar.jpg",
      role: "Marketing Director",
      quote: "Great networking opportunities and insightful sessions. Highly recommended!",
    },
    {
      name: "Robert Johnson",
      rating: 5.0,
      image: "https://tamilnaducouncil.ac.in/wp-content/uploads/2020-04/dummy-avatar.jpg",
      role: "Startup Founder",
      quote: "The best industry event I've attended this year. Will definitely come back!",
    },
  ];

  const defaultContent: TestimonialsContent = {
    headline: { 
      title: "What Our Attendees Say", 
      description: "Hear from our past attendees about their experience at our events. Real feedback from real people." 
    },
    testimonials: defaultTestimonials,
  };

  // Initialize with prop data or default values
  const [contentState, setContentState] = useState<TestimonialsContent>(defaultContent);
  const [backupContent, setBackupContent] = useState<TestimonialsContent>(defaultContent);

  // Update local state when prop data changes
  useEffect(() => {
    if (content) {
      setContentState(content);
      setBackupContent(content);
      previousContentRef.current = content;
    }
  }, [content]);

  // Auto-save function
  const autoSave = useCallback(async () => {
    if (!onStateChange || !editMode || !hasUnsavedChanges.current) return;

    setIsSaving(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onStateChange(contentState);
    setLastSaved(new Date());
    setIsSaving(false);
    hasUnsavedChanges.current = false; // Reset changes flag after save
  }, [contentState, editMode, onStateChange]);

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
  }, [contentState, editMode, autoSave, onStateChange]);

  // Effect to detect actual changes in content
  useEffect(() => {
    // Skip initial render and when not in edit mode
    if (previousContentRef.current === null || !editMode) {
      previousContentRef.current = contentState;
      return;
    }

    // Check if content actually changed
    const hasChanged = JSON.stringify(previousContentRef.current) !== JSON.stringify(contentState);
    
    if (hasChanged) {
      hasUnsavedChanges.current = true;
      previousContentRef.current = contentState;
    }
  }, [contentState, editMode]);

  // Carousel auto-rotate effect (only in non-edit mode)
  useEffect(() => {
    if (!editMode && contentState.testimonials.length > 1) {
      const interval = setInterval(
        () => setCurrent((c) => (c + 1) % contentState.testimonials.length),
        5000
      );
      return () => clearInterval(interval);
    }
  }, [contentState.testimonials.length, editMode]);

  const handleEditToggle = () => {
    if (!editMode) {
      setBackupContent(contentState); // Save current before editing
      hasUnsavedChanges.current = false; // Reset changes flag when entering edit mode
    } else {
      // When exiting edit mode, save if there are unsaved changes
      if (hasUnsavedChanges.current && onStateChange) {
        onStateChange(contentState);
        setLastSaved(new Date());
        hasUnsavedChanges.current = false;
      }
    }
    setEditMode(!editMode);
  };

  const handleCancel = () => {
    setContentState(backupContent); // Restore backup
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
      
      onStateChange(contentState);
      setLastSaved(new Date());
      setEditMode(false);
      hasUnsavedChanges.current = false;
      
      toast.success("Testimonials section saved successfully!");
    } catch (error) {
      console.error("Error saving testimonials section:", error);
      toast.error("Error saving changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Update functions
  const updateHeadline = (field: 'title' | 'description', value: string) => {
    if (field === 'title' && value.length > CHAR_LIMITS.title) {
      toast.error(`Title cannot exceed ${CHAR_LIMITS.title} characters`);
      return;
    }
    if (field === 'description' && value.length > CHAR_LIMITS.description) {
      toast.error(`Description cannot exceed ${CHAR_LIMITS.description} characters`);
      return;
    }
    
    setContentState(prev => ({
      ...prev,
      headline: {
        ...prev.headline,
        [field]: value
      }
    }));
  };

  const updateTestimonialField = (
    index: number,
    field: keyof Testimonial,
    value: string | number
  ) => {
    // Validate character limits
    if (field === 'name' && typeof value === 'string' && value.length > CHAR_LIMITS.name) {
      toast.error(`Name cannot exceed ${CHAR_LIMITS.name} characters`);
      return;
    }
    if (field === 'role' && typeof value === 'string' && value.length > CHAR_LIMITS.role) {
      toast.error(`Role cannot exceed ${CHAR_LIMITS.role} characters`);
      return;
    }
    if (field === 'quote' && typeof value === 'string' && value.length > CHAR_LIMITS.quote) {
      toast.error(`Quote cannot exceed ${CHAR_LIMITS.quote} characters`);
      return;
    }

    setContentState(prev => ({
      ...prev,
      testimonials: prev.testimonials.map((testimonial, i) =>
        i === index ? { ...testimonial, [field]: value } : testimonial
      )
    }));
  };

  const addTestimonial = () => {
    const newTestimonial: Testimonial = {
      name: "New Client",
      rating: 5.0,
      image: "https://tamilnaducouncil.ac.in/wp-content/uploads/2020-04/dummy-avatar.jpg",
      role: "Position",
      quote: "Add testimonial quote here.",
    };
    setContentState(prev => ({
      ...prev,
      testimonials: [...prev.testimonials, newTestimonial]
    }));
  };

  const deleteTestimonial = (index: number) => {
    if (contentState.testimonials.length <= 1) {
      toast.error("Cannot delete the last testimonial");
      return;
    }
    
    setContentState(prev => ({
      ...prev,
      testimonials: prev.testimonials.filter((_, i) => i !== index)
    }));
    
    // Adjust current index if necessary
    if (current >= contentState.testimonials.length - 1) {
      setCurrent(0);
    }
  };

  // Upload image to AWS S3
  const uploadImageToAWS = async (file: File, testimonialId: number): Promise<string | null> => {
    if (!userId || !publishedId || !templateSelection) {
      console.error("Missing required props for image upload");
      toast.error("Missing user information. Please refresh and try again.");
      return null;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("sectionName", "testimonials");
      formData.append(
        "imageField",
        `testimonials[${testimonialId}].image-${Date.now()}`
      );
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
        console.log(`Testimonial image ${testimonialId} uploaded to S3:`, uploadData.imageUrl);
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
  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedArea: Area) => {
      setCroppedAreaPixels(croppedArea);
    },
    []
  );

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: Area,
    rotation = 0
  ): Promise<{ file: File; previewUrl: string }> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Could not get canvas context");
    }

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.translate(pixelCrop.width / 2, pixelCrop.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-pixelCrop.width / 2, -pixelCrop.height / 2);

    ctx.drawImage(
      image as CanvasImageSource,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Failed to create blob"));
            return;
          }

          const fileName = originalFile?.name
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

  // Image upload handler
  const handleImageUpload = (
    testimonialIndex: number,
    event: ChangeEvent<HTMLInputElement>
  ) => {
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

    // Set cropIndex BEFORE opening the modal
    setCropIndex(testimonialIndex);

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setImageToCrop(result);
        setOriginalFile(file);
        setCropModalOpen(true);
        setAspectRatio(1); // Square for testimonial images
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setRotation(0);
      } else {
        toast.error("Failed to read image file");
      }
    };
    reader.readAsDataURL(file);

    // Clear input so same file can be picked again if needed
    if (event.target) {
      event.target.value = "";
    }
  };

  // Apply crop function with direct AWS upload
  const applyCrop = async () => {
    if (!imageToCrop || !croppedAreaPixels || cropIndex === null) return;

    try {
      setIsUploading(true);
      
      const result = await getCroppedImg(
        imageToCrop,
        croppedAreaPixels,
        rotation
      );

      const { file } = result;

      // Upload cropped image directly to AWS
      const imageUrl = await uploadImageToAWS(file, cropIndex);

      if (imageUrl) {
        // Update content with AWS URL directly
        setContentState(prev => ({
          ...prev,
          testimonials: prev.testimonials.map((testimonial, idx) =>
            idx === cropIndex
              ? { ...testimonial, image: imageUrl }
              : testimonial
          ),
        }));

        toast.success("Image cropped and uploaded successfully");
      }

      setCropModalOpen(false);
      setImageToCrop(null);
      setOriginalFile(null);
      setCropIndex(null);
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
    setCropIndex(null);
    resetCropSettings();
  };

  const resetCropSettings = () => {
    setZoom(1);
    setRotation(0);
    setCrop({ x: 0, y: 0 });
    setAspectRatio(1);
  };

  // Render stars for rating
  const renderStars = (rating?: number) => {
    const stars: JSX.Element[] = [];
    const rate = rating ?? 0;
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={i <= rate ? "text-yellow-400" : "text-gray-300"}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  // Safe image source
  const getImageSrc = (image?: string) => {
    return image || user;
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
                Crop Testimonial Image
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
                    onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.1).toFixed(2)))}
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
                    onClick={() => setZoom((z) => Math.min(4, +(z + 0.1).toFixed(2)))}
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

      <section
        id="testimonials"
        className="bg-gray-50 py-16 scroll-mt-20 relative"
      >
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
            <button
              onClick={handleEditToggle}
              className="flex items-center gap-2 bg-black/60 text-white px-4 py-2 rounded-lg border border-white/30 hover:bg-black/80 transition"
            >
              <Edit2 size={18} /> Edit
            </button>
          )}
        </div>

        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            {/* Editable Title */}
            {editMode ? (
              <div className="flex flex-col items-center justify-center gap-2 mb-4">
                <input
                  type="text"
                  value={contentState.headline.title}
                  onChange={(e) => updateHeadline('title', e.target.value)}
                  className="text-3xl font-bold text-gray-900 px-4 py-2 border-2 border-blue-300 rounded text-center w-full max-w-2xl"
                  maxLength={CHAR_LIMITS.title}
                />
                <div className="text-xs text-gray-500">
                  {contentState.headline.title.length}/{CHAR_LIMITS.title} characters
                </div>
              </div>
            ) : (
              <div className="mb-4">
                <h2 className="text-3xl font-bold text-gray-900">
                  {contentState.headline.title}
                </h2>
              </div>
            )}

            {/* Editable Description */}
            {editMode ? (
              <div className="flex flex-col items-center justify-center gap-2">
                <textarea
                  value={contentState.headline.description}
                  onChange={(e) => updateHeadline('description', e.target.value)}
                  className="text-gray-600 max-w-2xl px-4 py-2 border-2 border-blue-300 rounded resize-none w-full"
                  rows={2}
                  maxLength={CHAR_LIMITS.description}
                />
                <div className="text-xs text-gray-500">
                  {contentState.headline.description.length}/{CHAR_LIMITS.description} characters
                </div>
              </div>
            ) : (
              <p className="text-gray-600 max-w-2xl mx-auto text-justify">
                {contentState.headline.description}
              </p>
            )}
          </div>

          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {contentState.testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0">
                  <div className="mx-4 bg-white shadow-lg border-0 rounded-lg relative">
                    {/* Delete Button */}
                    {editMode && (
                      <button
                        onClick={() => deleteTestimonial(index)}
                        className="absolute top-2 right-2 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full z-10"
                        title="Delete testimonial"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}

                    <div className="p-8 text-center">
                      <div className="mb-6">
                        <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden relative">
                          <img
                            src={getImageSrc(testimonial.image)}
                            alt={testimonial.name}
                            className="w-full h-full object-cover scale-110"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = user;
                            }}
                          />
                          {editMode && (
                            <>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(index, e)}
                                className="hidden"
                                id={`testimonial-image-${index}`}
                              />
                              <label
                                htmlFor={`testimonial-image-${index}`}
                                className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-full cursor-pointer"
                                title="Change photo"
                              >
                                <Upload className="w-4 h-4 text-white" />
                              </label>
                            </>
                          )}
                        </div>
                        
                        {/* Editable Name */}
                        <h3 className="font-semibold text-xl text-gray-900 mb-2">
                          {editMode ? (
                            <div className="flex flex-col items-center">
                              <input
                                type="text"
                                value={testimonial.name}
                                onChange={(e) => updateTestimonialField(index, 'name', e.target.value)}
                                className="text-xl font-semibold text-center px-2 py-1 border border-gray-300 rounded"
                                maxLength={CHAR_LIMITS.name}
                              />
                              <div className="text-xs text-gray-500 mt-1">
                                {testimonial.name.length}/{CHAR_LIMITS.name}
                              </div>
                            </div>
                          ) : (
                            testimonial.name
                          )}
                        </h3>
                        
                        <div className="flex justify-center mb-2">
                          {editMode ? (
                            <div className="flex items-center gap-2">
                              <select
                                value={testimonial.rating || 5}
                                onChange={(e) => updateTestimonialField(index, 'rating', parseFloat(e.target.value))}
                                className="border border-gray-300 rounded px-2 py-1"
                              >
                                {[1, 2, 3, 4, 5].map(r => (
                                  <option key={r} value={r}>{r}.0</option>
                                ))}
                              </select>
                              <span className="text-gray-600">stars</span>
                            </div>
                          ) : (
                            renderStars(testimonial.rating)
                          )}
                        </div>
                      </div>

                      {/* Editable Quote */}
                      <div className="mb-6">
                        {editMode ? (
                          <div className="flex flex-col">
                            <textarea
                              value={testimonial.quote || ""}
                              onChange={(e) => updateTestimonialField(index, 'quote', e.target.value)}
                              className="text-lg text-gray-700 italic px-2 py-1 border border-gray-300 rounded resize-none"
                              rows={3}
                              maxLength={CHAR_LIMITS.quote}
                            />
                            <div className="text-xs text-gray-500 text-right mt-1">
                              {(testimonial.quote || "").length}/{CHAR_LIMITS.quote}
                            </div>
                          </div>
                        ) : (
                          <blockquote className="text-lg text-gray-700 italic text-justify">
                            "{testimonial.quote}"
                          </blockquote>
                        )}
                      </div>

                      {/* Editable Role */}
                      <div className="border-t pt-6">
                        <p className="text-gray-600 text-justify">
                          {editMode ? (
                            <div className="flex flex-col items-center">
                              <input
                                type="text"
                                value={testimonial.role || ""}
                                onChange={(e) => updateTestimonialField(index, 'role', e.target.value)}
                                className="text-gray-600 text-center px-2 py-1 border border-gray-300 rounded w-full max-w-xs"
                                maxLength={CHAR_LIMITS.role}
                              />
                              <div className="text-xs text-gray-500 mt-1">
                                {(testimonial.role || "").length}/{CHAR_LIMITS.role}
                              </div>
                            </div>
                          ) : (
                            testimonial.role
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center items-center mt-8 space-x-4">
            {/* Add Button */}
            {editMode && (
              <button
                onClick={addTestimonial}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                <Plus size={16} />
                Add Testimonial
              </button>
            )}

            {/* Pagination Dots */}
            {contentState.testimonials.length > 0 && (
              <div className="flex space-x-2">
                {contentState.testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrent(index)}
                    className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                      index === current
                        ? "bg-blue-600"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}