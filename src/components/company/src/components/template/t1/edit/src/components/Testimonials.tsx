import { useState, useEffect, useRef, useCallback } from "react";
import {
  Edit2,
  Check,
  X,
  Plus,
  Trash2,
  Upload,
  Loader2,
  Save,
  RotateCw,
  ZoomIn,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { toast } from "react-toastify";
import Cropper from "react-easy-crop";
import { motion } from "motion/react";
import user from "/images/user.png"
export default function EditableTestimonials({
  content,
  onStateChange,
  userId,
  publishedId,
  templateSelection,
}) {
  // Character limits
  const CHAR_LIMITS = {
    title: 100,
    description: 200,
    name: 100,
    role: 100,
    quote: 500,
    statValue: 20,
    statLabel: 50,
  };

  // Initialize with data from props or use default structure
  const initialData = content;
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [current, setCurrent] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [editingStatIndex, setEditingStatIndex] = useState(null);
  const [editingStatField, setEditingStatField] = useState(null);
  const [pendingImages, setPendingImages] = useState<Record<number, File>>({});

  // Enhanced crop modal state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [cropIndex, setCropIndex] = useState(null);

  const [testimonialsData, setTestimonialsData] = useState(initialData);
  const [tempData, setTempData] = useState(initialData);

  const fileInputRefs = useRef({});

  // Update state when content prop changes
  useEffect(() => {
    if (content) {
      setTestimonialsData(content);
      setTempData(content);
    }
  }, [content]);

  // Notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(testimonialsData);
    }
  }, [testimonialsData, onStateChange]);

  useEffect(() => {
    if (!isEditing) {
      const interval = setInterval(
        () => setCurrent((c) => (c + 1) % tempData.testimonials.length),
        5000
      );
      return () => clearInterval(interval);
    }
  }, [tempData.testimonials.length, isEditing]);

  // Enhanced image upload handler
  const handleImageUpload = (testimonialIndex, event) => {
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
      setImageToCrop(reader.result);
      setOriginalFile(file);
      setCropModalOpen(true);
      setAspectRatio(1); // Square for testimonial images
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
    };
    reader.readAsDataURL(file);

    event.target.value = "";
  };

  // Enhanced cropper functions
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
      if (!imageToCrop || !croppedAreaPixels || cropIndex === null) {
        console.error("Please select an area to crop or cropIndex is null");
        return;
      }

      const { file, previewUrl } = await getCroppedImg(
        imageToCrop,
        croppedAreaPixels,
        rotation
      );

      // Store the cropped file for upload on Save
      setPendingImages((prev) => ({ ...prev, [cropIndex]: file }));

      // Show immediate local preview of cropped image
      setTempData((prev) => ({
        ...prev,
        testimonials: prev.testimonials.map((testimonial, index) =>
          index === cropIndex ? { ...testimonial, image: previewUrl } : testimonial
        ),
      }));

      setCropModalOpen(false);
      setImageToCrop(null);
      setOriginalFile(null);
      setCropIndex(null); // Reset cropIndex
      toast.success("Image cropped successfully");
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
    setCropIndex(null); // Reset cropIndex
  };

  const resetCropSettings = () => {
    setZoom(1);
    setRotation(0);
    setCrop({ x: 0, y: 0 });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setTempData(testimonialsData);
  };

  const handleCancel = () => {
    setTempData(testimonialsData);
    setPendingImages({});
    setIsEditing(false);
  };

  // Updated Save button handler - uploads images and stores S3 URLs
  const handleSave = async () => {
    try {
      setIsUploading(true);

      // Create a copy of tempData to update with S3 URLs
      let updatedData = { ...tempData };

      // Upload all pending images
      for (const [testimonialIdStr, file] of Object.entries(pendingImages)) {
        const testimonialId = parseInt(testimonialIdStr);

        if (!userId || !publishedId || !templateSelection) {
          console.error("Missing required props:", {
            userId,
            publishedId,
            templateSelection,
          });
          toast.error(
            "Missing user information. Please refresh and try again."
          );
          return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("sectionName", "testimonials");
        formData.append(
          "imageField",
          `testimonials[${testimonialId}].image` + Date.now()
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
          // Update the testimonial image in our local copy
          updatedData.testimonials = updatedData.testimonials.map(
            (testimonial, index) =>
              index === testimonialId
                ? { ...testimonial, image: uploadData.imageUrl }
                : testimonial
          );
          console.log("Image uploaded to S3:", uploadData.imageUrl);
        } else {
          const errorData = await uploadResponse.json();
          console.error("Image upload failed:", errorData);
          toast.error(
            `Image upload failed: ${errorData.message || "Unknown error"}`
          );
          return; // Don't exit edit mode
        }
      }

      // Clear pending images
      setPendingImages({});

      // Simulate save delay
      setIsSaving(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update both states with the new content including S3 URLs
      setTestimonialsData(updatedData);
      setTempData(updatedData);

      // Exit edit mode
      setIsEditing(false);
      toast.success(
        "Testimonials section saved with S3 URLs ready for publish"
      );
    } catch (error) {
      console.error("Error saving testimonials section:", error);
      toast.error("Error saving changes. Please try again.");
      // Keep in edit mode so user can retry
    } finally {
      setIsUploading(false);
      setIsSaving(false);
    }
  };

  const updateHeadlineField = (field, value) => {
    // Apply character limits for header fields
    let processedValue = value;
    
    if (field === "title" && value.length > CHAR_LIMITS.title) {
      processedValue = value.slice(0, CHAR_LIMITS.title);
    } else if (field === "description" && value.length > CHAR_LIMITS.description) {
      processedValue = value.slice(0, CHAR_LIMITS.description);
    }

    setTempData((prev) => ({
      ...prev,
      headline: {
        ...prev.headline,
        [field]: processedValue,
      },
    }));
  };

  const updateTestimonialField = (index, field, value) => {
    // Apply character limits based on field type
    let processedValue = value;
    
    if (field === "name" && value.length > CHAR_LIMITS.name) {
      processedValue = value.slice(0, CHAR_LIMITS.name);
    } else if (field === "role" && value.length > CHAR_LIMITS.role) {
      processedValue = value.slice(0, CHAR_LIMITS.role);
    } else if (field === "quote" && value.length > CHAR_LIMITS.quote) {
      processedValue = value.slice(0, CHAR_LIMITS.quote);
    }

    setTempData((prev) => ({
      ...prev,
      testimonials: prev.testimonials.map((testimonial, i) =>
        i === index ? { ...testimonial, [field]: processedValue } : testimonial
      ),
    }));
  };

  const updateStatField = (index, field, value) => {
    // Apply character limits for stats
    let processedValue = value;
    
    if (field === "value" && value.length > CHAR_LIMITS.statValue) {
      processedValue = value.slice(0, CHAR_LIMITS.statValue);
    } else if (field === "label" && value.length > CHAR_LIMITS.statLabel) {
      processedValue = value.slice(0, CHAR_LIMITS.statLabel);
    }

    setTempData((prev) => ({
      ...prev,
      stats: prev.stats.map((stat, i) =>
        i === index ? { ...stat, [field]: processedValue } : stat
      ),
    }));
  };

  const addTestimonial = () => {
    const newTestimonial = {
      name: "New Client",
      rating: 5.0,
      image:
        "https://tamilnaducouncil.ac.in/wp-content/uploads/2020-04/dummy-avatar.jpg",
      role: "Position",
      quote: "Add testimonial quote here.",
    };
    setTempData((prev) => ({
      ...prev,
      testimonials: [...prev.testimonials, newTestimonial],
    }));
  };

  const deleteTestimonial = (index) => {
    if (tempData.testimonials.length > 1) {
      setTempData((prev) => ({
        ...prev,
        testimonials: prev.testimonials.filter((_, i) => i !== index),
      }));
      if (current >= tempData.testimonials.length - 1) {
        setCurrent(0);
      }
    }
  };

  const addStat = () => {
    const newStat = {
      value: "New Value",
      label: "New Label",
    };
    setTempData((prev) => ({
      ...prev,
      stats: [...prev.stats, newStat],
    }));
  };

  const deleteStat = (index) => {
    if (tempData.stats.length > 1) {
      setTempData((prev) => ({
        ...prev,
        stats: prev.stats.filter((_, i) => i !== index),
      }));
    }
  };

  const startEditField = (id, field, currentValue) => {
    setEditingId(id);
    setEditingField(field);
    setTempValue(currentValue);
  };

  const saveFieldEdit = () => {
    if (editingId !== null && editingField) {
      updateTestimonialField(editingId, editingField, tempValue);
    }
    cancelEdit();
  };

  const startStatEdit = (index, field, currentValue) => {
    setEditingStatIndex(index);
    setEditingStatField(field);
    setTempValue(currentValue);
  };

  const saveStatEdit = () => {
    if (editingStatIndex !== null && editingStatField) {
      updateStatField(editingStatIndex, editingStatField, tempValue);
    }
    cancelStatEdit();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingField(null);
    setTempValue("");
  };

  const cancelStatEdit = () => {
    setEditingStatIndex(null);
    setEditingStatField(null);
    setTempValue("");
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={i <= rating ? "text-yellow-400" : "text-gray-300"}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const EditableText = ({ value, onEdit, isLarge = false, className = "" }) => (
    <div className={`group relative ${className}`}>
      <span className={isLarge ? "text-3xl font-bold" : ""}>{value}</span>
      <button
        onClick={onEdit}
        className="opacity-0 group-hover:opacity-100 absolute -right-6 top-0 p-1 text-gray-400 hover:text-blue-600 transition-all duration-200"
      >
        <Edit2 size={14} />
      </button>
    </div>
  );

  const EditableField = ({
    testimonial,
    index,
    field,
    className = "",
    multiline = false,
  }) => {
    const isCurrentlyEditing = editingId === index && editingField === field;
    const value = testimonial[field];

    // Get character limit based on field type
    const getCharLimit = () => {
      switch (field) {
        case "name":
          return CHAR_LIMITS.name;
        case "role":
          return CHAR_LIMITS.role;
        case "quote":
          return CHAR_LIMITS.quote;
        default:
          return 100;
      }
    };

    const charLimit = getCharLimit();

    if (isCurrentlyEditing) {
      return (
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center gap-2">
            {multiline ? (
              <textarea
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="flex-1 px-2 py-1 border border-blue-300 rounded resize-none"
                rows={3}
                maxLength={charLimit}
                autoFocus
              />
            ) : (
              <input
                type="text"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="flex-1 px-2 py-1 border border-blue-300 rounded"
                maxLength={charLimit}
                autoFocus
              />
            )}
            <button
              onClick={saveFieldEdit}
              className="p-1 text-green-600 hover:text-green-800"
            >
              <Check size={16} />
            </button>
            <button
              onClick={cancelEdit}
              className="p-1 text-red-600 hover:text-red-800"
            >
              <X size={16} />
            </button>
          </div>
          <div className="text-xs text-gray-500 text-right">
            {tempValue.length}/{charLimit} characters
          </div>
        </div>
      );
    }

    return (
      <div className={`group relative ${className}`}>
        {multiline ? (
          <blockquote className="text-lg text-gray-700 italic">
            "{value}"
          </blockquote>
        ) : (
          <span>{value}</span>
        )}
        <button
          onClick={() => startEditField(index, field, value)}
          className="opacity-0 group-hover:opacity-100 absolute -right-6 top-0 p-1 text-gray-400 hover:text-blue-600 transition-all duration-200"
        >
          <Edit2 size={14} />
        </button>
      </div>
    );
  };

  const EditableStatField = ({ stat, index, field, className = "" }) => {
    const isCurrentlyEditing =
      editingStatIndex === index && editingStatField === field;
    const value = stat[field];

    // Get character limit based on field type
    const charLimit = field === "value" ? CHAR_LIMITS.statValue : CHAR_LIMITS.statLabel;

    if (isCurrentlyEditing) {
      return (
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="flex-1 px-2 py-1 border border-blue-300 rounded text-center"
              maxLength={charLimit}
              autoFocus
            />
            <button
              onClick={saveStatEdit}
              className="p-1 text-green-600 hover:text-green-800"
            >
              <Check size={16} />
            </button>
            <button
              onClick={cancelStatEdit}
              className="p-1 text-red-600 hover:text-red-800"
            >
              <X size={16} />
            </button>
          </div>
          <div className="text-xs text-gray-500 text-right">
            {tempValue.length}/{charLimit} characters
          </div>
        </div>
      );
    }

    return (
      <div className={`group relative ${className}`}>
        <span>{value}</span>
        <button
          onClick={() => startStatEdit(index, field, value)}
          className="opacity-0 group-hover:opacity-100 absolute -right-6 top-0 p-1 text-gray-400 hover:text-blue-600 transition-all duration-200"
        >
          <Edit2 size={14} />
        </button>
      </div>
    );
  };

  return (
    <section
      id="testimonials"
      className="bg-gray-50 py-16 scroll-mt-20 relative"
    >
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

      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          {/* Editable Title */}
          {isEditing ? (
            <div className="flex flex-col items-center justify-center gap-2 mb-4">
              <input
                type="text"
                value={tempData.headline.title}
                onChange={(e) => updateHeadlineField("title", e.target.value)}
                className="text-3xl font-bold text-gray-900 px-2 py-1 border border-blue-300 rounded text-center"
                maxLength={CHAR_LIMITS.title}
              />
              <div className="text-xs text-gray-500">
                {tempData.headline.title.length}/{CHAR_LIMITS.title} characters
              </div>
            </div>
          ) : (
            <div className="mb-4">
              <h2 className="text-3xl font-bold text-gray-900">
                {tempData.headline.title}
              </h2>
            </div>
          )}

          {/* Editable Description */}
          {isEditing ? (
            <div className="flex flex-col items-center justify-center gap-2">
              <textarea
                value={tempData.headline.description}
                onChange={(e) =>
                  updateHeadlineField("description", e.target.value)
                }
                className="text-gray-600 max-w-2xl px-2 py-1 border border-blue-300 rounded resize-none"
                rows={2}
                maxLength={CHAR_LIMITS.description}
              />
              <div className="text-xs text-gray-500">
                {tempData.headline.description.length}/{CHAR_LIMITS.description} characters
              </div>
            </div>
          ) : (
            <p className="text-gray-600 max-w-2xl mx-auto">
              {tempData.headline.description}
            </p>
          )}
        </div>

        {/* Stats Section */}
        {/* {tempData.stats && tempData.stats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {tempData.stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm text-center relative"
              >
                {isEditing && (
                  <button
                    onClick={() => deleteStat(index)}
                    className="absolute top-2 right-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full z-10"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  <EditableStatField stat={stat} index={index} field="value" />
                </div>
                <div className="text-gray-600">
                  <EditableStatField stat={stat} index={index} field="label" />
                </div>
              </div>
            ))}
            {isEditing && (
              <button
                onClick={addStat}
                className="flex flex-col items-center justify-center bg-gray-100 p-6 rounded-lg shadow-sm text-center hover:bg-gray-200 transition-colors duration-200"
              >
                <Plus size={24} className="text-gray-500 mb-2" />
                <span className="text-gray-600">Add Stat</span>
              </button>
            )}
          </div>
        )} */}

        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {tempData.testimonials.map((testimonial, index) => (
              <div key={index} className="w-full flex-shrink-0">
                <div className="mx-4 bg-white shadow-lg border-0 rounded-lg relative">
                  {/* Delete Button */}
                  {isEditing && tempData.testimonials.length > 1 && (
                    <button
                      onClick={() => deleteTestimonial(index)}
                      className="absolute top-2 right-2 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full z-10"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}

                  <div className="p-8 text-center">
                    <div className="mb-6">
                      <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden relative">
                        <img
                          src={testimonial.image || user}
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                        {isEditing && (
                          <>
                            <input
                              type="file"
                              accept="image/*"
                              ref={(el) => (fileInputRefs.current[index] = el)}
                              onChange={(e) => handleImageUpload(index, e)}
                              className="hidden"
                            />
                            <button
                              onClick={() =>
                                fileInputRefs.current[index]?.click()
                              }
                              className="absolute bottom-0 right-0 bg-white/80 p-1 rounded-full"
                            >
                              <Upload size={12} />
                            </button>
                            {pendingImages[index] && (
                              <p className="absolute -bottom-6 text-xs text-orange-600 bg-white/80 p-1 rounded">
                                Image selected: {pendingImages[index].name}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                      <h3 className="font-semibold text-xl text-gray-900 mb-2">
                        <EditableField
                          testimonial={testimonial}
                          index={index}
                          field="name"
                        />
                      </h3>
                      <div className="flex justify-center mb-2">
                        {renderStars(testimonial.rating)}
                      </div>
                    </div>

                    <div className="mb-6">
                      <EditableField
                        testimonial={testimonial}
                        index={index}
                        field="quote"
                        multiline={true}
                      />
                    </div>

                    <div className="border-t pt-6">
                      <p className="text-gray-600">
                        <EditableField
                          testimonial={testimonial}
                          index={index}
                          field="role"
                        />
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
          {isEditing && (
            <button
              onClick={addTestimonial}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              <Plus size={16} />
              Add Testimonial
            </button>
          )}

          {/* Pagination Dots */}
          {tempData.testimonials.length > 0 && (
            <div className="flex space-x-2">
              {tempData.testimonials.map((_, index) => (
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

        {/* Instructions for Edit Mode */}
        {/* {isEditing && (
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 mb-2">
              <strong>Edit Mode Active:</strong> You can now:
            </p>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>
                • <strong>Edit existing content:</strong> Hover over any text
                and click the edit icon
              </li>
              <li>
                • <strong>Add new testimonials:</strong> Click the green "Add
                Testimonial" button
              </li>
              <li>
                • <strong>Delete testimonials:</strong> Click the red trash icon
                on any testimonial
              </li>
              <li>
                • <strong>Add/Edit stats:</strong> Edit the statistics section
                below the headline
              </li>
              <li>
                • <strong>Upload images:</strong> Click the upload icon on
                testimonial images
              </li>
              <li>
                • <strong>Crop images:</strong> After selecting an image, you
                can crop it before uploading
              </li>
              <li>
                • <strong>Navigate:</strong> Use the dots below to switch
                between testimonials while editing
              </li>
              <li>
                • <strong>Character Limits:</strong> 
                Title: {CHAR_LIMITS.title}, 
                Description: {CHAR_LIMITS.description}, 
                Name: {CHAR_LIMITS.name}, 
                Role: {CHAR_LIMITS.role}, 
                Quote: {CHAR_LIMITS.quote}
              </li>
            </ul>
          </div>
        )} */}
      </div>

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
                <p className="text-sm font-medium text-gray-700 mb-2">Aspect Ratio:</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setAspectRatio(1)}
                    className={`px-3 py-2 text-sm rounded border ${
                      aspectRatio === 1 
                        ? 'bg-blue-500 text-white border-blue-500' 
                        : 'bg-white text-gray-700 border-gray-300'
                    }`}
                  >
                    1:1 (Square)
                  </button>
                  <button
                    onClick={() => setAspectRatio(4/3)}
                    className={`px-3 py-2 text-sm rounded border ${
                      aspectRatio === 4/3 
                        ? 'bg-blue-500 text-white border-blue-500' 
                        : 'bg-white text-gray-700 border-gray-300'
                    }`}
                  >
                    4:3 (Standard)
                  </button>
                  <button
                    onClick={() => setAspectRatio(16/9)}
                    className={`px-3 py-2 text-sm rounded border ${
                      aspectRatio === 16/9 
                        ? 'bg-blue-500 text-white border-blue-500' 
                        : 'bg-white text-gray-700 border-gray-300'
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
    </section>
  );
}