import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import {
  X,
  CheckCircle,
  Edit2,
  Save,
  Upload,
  Loader2,
  Plus,
  Trash2,
  RotateCw,
  ZoomIn,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "react-toastify";
import Cropper from "react-easy-crop";

export default function Services({
  serviceData,
  onStateChange,
  userId,
  publishedId,
  templateSelection,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedServiceIndex, setSelectedServiceIndex] = useState<
    number | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingImages, setPendingImages] = useState<Record<number, File>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [addingCategoryFor, setAddingCategoryFor] = useState<number | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");

  // Enhanced crop modal state (same as Header.tsx)
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImage, setCropImage] = useState(null);
  const [cropField, setCropField] = useState(null);
  const [cropIndex, setCropIndex] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(4 / 3);

  // Create a temporary state for editing like in Products.tsx
  const [servicesSection, setServicesSection] = useState(serviceData);
  const [tempServicesSection, setTempServicesSection] = useState(serviceData);

  // Update content when serviceData changes
  useEffect(() => {
    if (serviceData) {
      setServicesSection(serviceData);
      setTempServicesSection(serviceData);
    }
  }, [serviceData]);

  // Add this useEffect to notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(servicesSection);
    }
  }, [servicesSection, onStateChange]);

  // Get categories from services
  const filteredServices =
    activeCategory === "All"
      ? isEditing
        ? tempServicesSection.services
        : servicesSection.services
      : (isEditing
        ? tempServicesSection.services
        : servicesSection.services
      ).filter((s) => s.category === activeCategory);

  // Enhanced image upload handler (same as Header.tsx)
  const handleServiceImageSelect = (index, e) => {
    const file = e.target.files?.[0];
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
      setCropImage(reader.result);
      setCropField("serviceImage");
      setCropIndex(index);
      setOriginalFile(file);
      setCropModalOpen(true);
      setAspectRatio(4 / 3); // Standard aspect ratio for service images
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
    };
    reader.readAsDataURL(file);

    e.target.value = "";
  };

  // Enhanced cropper functions (same as Header.tsx)
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
      if (!cropImage || !croppedAreaPixels) {
        console.error("Please select an area to crop");
        return;
      }

      const { file, previewUrl } = await getCroppedImg(
        cropImage,
        croppedAreaPixels,
        rotation
      );

      // For service images
      if (cropField === "serviceImage") {
        setPendingImages((prev) => ({ ...prev, [cropIndex]: file }));

        // Show immediate local preview of cropped image
        setTempServicesSection((prev) => ({
          ...prev,
          services: prev.services.map((service, i) =>
            i === cropIndex ? { ...service, image: previewUrl } : service
          ),
        }));
      }

      setCropModalOpen(false);
      setCropImage(null);
      setOriginalFile(null);
      toast.success("Image cropped successfully");
    } catch (error) {
      console.error("Error cropping image:", error);
      toast.error("Error cropping image. Please try again.");
    }
  };

  const cancelCrop = () => {
    setCropModalOpen(false);
    setCropImage(null);
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

  // Handlers
  const updateServiceField = (index, field, value) => {
    // Apply character limits based on field type
    let processedValue = value;

    if (field === "title" && value.length > 100) {
      processedValue = value.slice(0, 100);
    } else if (field === "description" && value.length > 500) {
      processedValue = value.slice(0, 1000);
    } else if (field === "detailedDescription" && value.length > 1000) {
      processedValue = value.slice(0, 1000);
    } else if (field === "category" && value.length > 50) {
      processedValue = value.slice(0, 50);
    } else if (field === "pricing" && value.length > 100) {
      processedValue = value.slice(0, 100);
    } else if (field === "timeline" && value.length > 100) {
      processedValue = value.slice(0, 100);
    }

    setTempServicesSection((prev) => ({
      ...prev,
      services: prev.services.map((s, i) =>
        i === index ? { ...s, [field]: processedValue } : s
      ),
    }));

    // Update categories if needed
    if (
      field === "category" &&
      !tempServicesSection.categories.includes(processedValue)
    ) {
      setTempServicesSection((prev) => ({
        ...prev,
        categories: [...prev.categories, processedValue],
      }));
    }
  };

  const updateServiceList = (index, field, listIndex, value) => {
    // Apply character limit for list items (benefits, process steps)
    let processedValue = value;
    if (value.length > 200) {
      processedValue = value.slice(0, 200);
    }

    setTempServicesSection((prev) => ({
      ...prev,
      services: prev.services.map((s, i) =>
        i === index
          ? {
            ...s,
            [field]: s[field].map((item, li) =>
              li === listIndex ? processedValue : item
            ),
          }
          : s
      ),
    }));
  };

  const addToList = (index, field) => {
    setTempServicesSection((prev) => ({
      ...prev,
      services: prev.services.map((s, i) =>
        i === index ? { ...s, [field]: [...s[field], "New Item"] } : s
      ),
    }));
  };

  const removeFromList = (index, field, listIndex) => {
    setTempServicesSection((prev) => ({
      ...prev,
      services: prev.services.map((s, i) =>
        i === index
          ? {
            ...s,
            [field]: s[field].filter((_, li) => li !== listIndex),
          }
          : s
      ),
    }));
  };

  // Updated Save button handler - uploads images and stores S3 URLs
  const handleSave = async () => {
    try {
      setIsUploading(true);

      // Create a copy of the current tempServicesSection to update with S3 URLs
      let updatedServices = { ...tempServicesSection };

      // Upload all pending images
      for (const [indexStr, file] of Object.entries(pendingImages)) {
        const index = parseInt(indexStr);

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
        formData.append("sectionName", "services");
        formData.append("imageField", `services[${index}].image` + Date.now());
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
          // Update the service image in our local copy
          updatedServices.services = updatedServices.services.map(
            (service, i) =>
              i === index ? { ...service, image: uploadData.imageUrl } : service
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
      setServicesSection(updatedServices);
      setTempServicesSection(updatedServices);

      // Exit edit mode
      setIsEditing(false);
      toast.success("Services section saved with S3 URLs ready for publish");
    } catch (error) {
      console.error("Error saving services section:", error);
      toast.error("Error saving changes. Please try again.");
      // Keep in edit mode so user can retry
    } finally {
      setIsUploading(false);
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTempServicesSection(servicesSection);
    setPendingImages({});
    setIsEditing(false);
  };

  const addService = () => {
    const newService = {
      title: "New Service",
      category: "New Category",
      image: "https://via.placeholder.com/600x400?text=New+Service",
      description: "Service description goes here...",
      features: ["New Feature"],
      detailedDescription: "Detailed description for the new service...",
      benefits: ["New Benefit"],
      process: ["New Step"],
      pricing: "Custom pricing",
      timeline: "TBD",
    };

    setTempServicesSection((prev) => ({
      ...prev,
      services: [...prev.services, newService],
    }));

    if (!tempServicesSection.categories.includes("New Category")) {
      setTempServicesSection((prev) => ({
        ...prev,
        categories: [...prev.categories, "New Category"],
      }));
    }
  };

  const removeService = (index) => {
    setTempServicesSection((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }));
  };

  const addCategory = () => {
    const newCategory = `New Category ${tempServicesSection.categories.length}`;
    if (!tempServicesSection.categories.includes(newCategory)) {
      setTempServicesSection((prev) => ({
        ...prev,
        categories: [...prev.categories, newCategory],
      }));
    }
  };

  const removeCategory = (cat) => {
    if (cat !== "All") {
      setTempServicesSection((prev) => ({
        ...prev,
        categories: prev.categories.filter((c) => c !== cat),
        services: prev.services.map((s) =>
          s.category === cat ? { ...s, category: "Uncategorized" } : s
        ),
      }));
    }
  };

  const openModal = (service, index) => {
    setSelectedServiceIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedServiceIndex(null);
  };

  // Update heading fields with character limits
  const updateHeading = (field, value) => {
    let processedValue = value;

    if (field === "head" && value.length > 100) {
      processedValue = value.slice(0, 100);
    } else if (field === "desc" && value.length > 200) {
      processedValue = value.slice(0, 200);
    }

    setTempServicesSection((prev) => ({
      ...prev,
      heading: {
        ...prev.heading,
        [field]: processedValue,
      },
    }));
  };

  // EditableText component for consistent styling (like in Products.tsx)
  const EditableText = useMemo(
    () =>
      ({
        value,
        onChange,
        multiline = false,
        className = "",
        placeholder = "",
        maxLength = null,
      }) => {
        const baseClasses =
          "w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none";

        // Show character count if maxLength is provided
        const charCount = maxLength ? (
          <div className="text-xs text-gray-500 text-right mt-1">
            {value.length}/{maxLength}
          </div>
        ) : null;

        if (multiline) {
          return (
            <div>
              <textarea
                value={value}
                onChange={(e) => {
                  if (!maxLength || e.target.value.length <= maxLength) {
                    onChange(e.target.value);
                  }
                }}
                className={`${baseClasses} p-2 resize-none ${className}`}
                placeholder={placeholder}
                rows={3}
                maxLength={maxLength}
              />
              {charCount}
            </div>
          );
        }
        return (
          <div>
            <input
              type="text"
              value={value}
              onChange={(e) => {
                if (!maxLength || e.target.value.length <= maxLength) {
                  onChange(e.target.value);
                }
              }}
              className={`${baseClasses} p-1 ${className}`}
              placeholder={placeholder}
              maxLength={maxLength}
            />
            {charCount}
          </div>
        );
      },
    []
  );

  // Use the appropriate content based on editing mode
  const displayContent = isEditing ? tempServicesSection : servicesSection;

  return (
    <motion.section
      id="services"
      className={`${servicesSection?.services &&
        servicesSection?.services.length > 0 &&
        "py-20 "
        }  theme-transition relative`}
    >
      {/* Edit Controls */}
      <div className="absolute top-4 right-4 z-10">
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
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

      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-6">
          {isEditing ? (
            <>
              <EditableText
                value={tempServicesSection.heading.head}
                onChange={(val) => updateHeading("head", val)}
                className="text-3xl font-bold mb-2"
                placeholder="Section heading"
                maxLength={50}
              />
              <EditableText
                value={tempServicesSection.heading.desc}
                onChange={(val) => updateHeading("desc", val)}
                multiline={true}
                className="text-muted-foreground"
                placeholder="Section description"
                maxLength={50}
              />
            </>
          ) : (
            <>
              {servicesSection?.services &&
                servicesSection?.services.length > 0 && (
                  <span className="inline-block mx-auto px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
                    Our Services
                  </span>
                )}
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {displayContent.heading.head}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {displayContent.heading.desc}
              </p>
            </>
          )}
        </div>

        {/* Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-3">
          {displayContent.categories.map((cat, i) => (
            <div key={i} className="flex items-center gap-2">
              {isEditing ? (
                <input
                  value={cat}
                  onChange={(e) => {
                    if (e.target.value.length <= 50) {
                      setTempServicesSection((prev) => ({
                        ...prev,
                        categories: prev.categories.map((c, idx) =>
                          idx === i ? e.target.value : c
                        ),
                      }));
                    }
                  }}
                  className="w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1"
                  maxLength={50}
                />
              ) : (
                <Button
                  key={i}
                  onClick={() => {
                    setActiveCategory(cat);
                  }}
                  className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${activeCategory === cat
                    ? "bg-orange-400 text-white shadow-lg scale-105"
                    : "bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg"
                    }`}
                >
                  {cat}
                </Button>
              )}
              {isEditing && cat !== "All" && (
                <button
                  onClick={() => removeCategory(cat)}
                  className="text-red-500 text-xs"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          {isEditing && (
            <Button
              onClick={addCategory}
              size="sm"
              variant="outline"
              className="bg-green-50 hover:bg-green-100 text-green-700"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Category
            </Button>
          )}
        </div>

        {/* Services Grid */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
          {filteredServices.map((service, index) => (
            <Card key={index} className="relative overflow-hidden w-[220px] min-h-[360px] rounded-2xl shadow-md border border-gray-100 bg-white flex flex-col">
              <div className="h-32 overflow-hidden relative rounded-t-2xl">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover object-center scale-110"
                />
                <div className="absolute top-3 right-3">
                  <span className="px-3 py-1 bg-orange-400 text-white text-xs font-medium rounded-full shadow">
                    {service.category}
                  </span>
                </div>
                {isEditing && (
                  <div className="absolute bottom-2 left-2 bg-white/80 p-1 rounded">
                    <Button
                      onClick={() =>
                        document
                          .getElementById(`image-upload-${index}`)
                          ?.click()
                      }
                      size="sm"
                      variant="outline"
                      className="text-xs"
                    >
                      <Upload className="w-3 h-3 mr-1" />
                      Change
                    </Button>
                    <input
                      id={`image-upload-${index}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleServiceImageSelect(index, e)}
                    />
                    {pendingImages[index] && (
                      <p className="text-xs text-orange-600 mt-1">
                        Image selected: {pendingImages[index].name}
                      </p>
                    )}
                  </div>
                )}
              </div>
              <CardHeader className="px-4 pt-4 pb-2">
                {isEditing ? (
                  <EditableText
                    value={service.title}
                    onChange={(val) => updateServiceField(index, "title", val)}
                    className="font-bold text-base"
                    placeholder="Service title"
                    maxLength={50}
                  />
                ) : (
                  <CardTitle className="text-base leading-snug">{service.title}</CardTitle>
                )}
              </CardHeader>
              <CardContent className="px-4 pb-4 flex flex-col flex-1">
                {isEditing ? (
                  <>
                    <EditableText
                      value={service.description}
                      onChange={(val) => updateServiceField(index, "description", val)}
                      multiline={true}
                      className="text-sm"
                      placeholder="Service description"
                      maxLength={1000}
                    />
                    <div className="mt-2 space-y-2">
                      <label className="block text-xs font-medium text-gray-700">
                        Category
                      </label>
                      <select
                        value={service.category}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === "__add_new__") {
                            setAddingCategoryFor(index);
                            setNewCategoryName("");
                          } else {
                            updateServiceField(index, "category", val);
                            setAddingCategoryFor(null);
                          }
                        }}
                        className="w-full bg-white/80 border-2 border-dashed border-blue-300 rounded p-1 text-sm"
                      >
                        {displayContent.categories.map((c, i) => (
                          <option key={i} value={c}>
                            {c}
                          </option>
                        ))}
                        <option value="__add_new__">+ Add new category</option>
                      </select>
                      {addingCategoryFor === index && (
                        <div className="flex items-center gap-2">
                          <input
                            value={newCategoryName}
                            onChange={(e) => {
                              if (e.target.value.length <= 50) setNewCategoryName(e.target.value);
                            }}
                            placeholder="New category name"
                            className="flex-1 bg-white/80 border-2 border-dashed border-blue-300 rounded p-1 text-sm"
                            maxLength={50}
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                            onClick={() => {
                              const name = newCategoryName.trim();
                              if (!name) return;
                              setTempServicesSection((prev) => ({
                                ...prev,
                                categories: prev.categories.includes(name)
                                  ? prev.categories
                                  : [...prev.categories, name],
                                services: prev.services.map((s, i) =>
                                  i === index ? { ...s, category: name } : s
                                ),
                              }));
                              setAddingCategoryFor(null);
                              setNewCategoryName("");
                            }}
                          >
                            Add
                          </Button>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-600 mb-3 flex-1 h-[64px] overflow-auto">
                      {service.description}
                    </p>
                  </>
                )}

                <div className="mt-auto flex gap-2 ">
                  <Button
                    className={` ${isEditing ? "" : "w-full"} bg-orange-400 hover:bg-orange-500 text-white rounded-md`}
                    size="sm"
                    onClick={() => openModal(service, index)}
                  >
                    View Details →
                  </Button>
                  {isEditing && (
                    <Button
                      className="cursor-pointer hover:scale-105"
                      size="sm"
                      variant="destructive"
                      onClick={() => removeService(index)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Remove
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          {isEditing && (
            <Card className="flex items-center justify-center border-dashed">
              <Button
                onClick={addService}
                className="text-green-600 cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Service
              </Button>
            </Card>
          )}
        </div>
      </div>

      {/* Service Details Modal */}
      <AnimatePresence>
        {isModalOpen && selectedServiceIndex !== null && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-[9999999] max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <div
              className="bg-card rounded-xl w-full max-w-3xl p-6 relative top-11 h-[42rem] z-100 overflow-y-auto max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-gray-500 rounded-full p-2"
              >
                <X className="w-5 h-5" />
              </button>

              {isEditing ? (
                <EditableText
                  value={
                    tempServicesSection.services[selectedServiceIndex].title
                  }
                  onChange={(val) =>
                    updateServiceField(selectedServiceIndex, "title", val)
                  }
                  className="text-2xl font-bold mb-4"
                  placeholder="Service title"
                  maxLength={50}
                />
              ) : (
                <h2 className="text-2xl font-bold mb-4">
                  {displayContent.services[selectedServiceIndex].title}
                </h2>
              )}

              {isEditing ? (
                <EditableText
                  value={
                    tempServicesSection.services[selectedServiceIndex]
                      .detailedDescription
                  }
                  onChange={(val) =>
                    updateServiceField(
                      selectedServiceIndex,
                      "detailedDescription",
                      val
                    )
                  }
                  multiline={true}
                  className="mb-4"
                  placeholder="Detailed description"
                  maxLength={1000}
                />
              ) : (
                <p className="text-muted-foreground mb-4">
                  {
                    displayContent.services[selectedServiceIndex]
                      .detailedDescription
                  }
                </p>
              )}

              {/* Benefits */}
              <h3 className="font-semibold mb-2">Key Benefits</h3>
              <ul className="space-y-2 mb-4">
                {displayContent.services[selectedServiceIndex].benefits.map(
                  (b, bi) => (
                    <li key={bi} className="flex gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                      {isEditing ? (
                        <div className="flex gap-2 w-full items-start">
                          <div className="w-full">
                            <input
                              value={b}
                              onChange={(e) => {
                                if (e.target.value.length <= 200) {
                                  updateServiceList(
                                    selectedServiceIndex,
                                    "benefits",
                                    bi,
                                    e.target.value
                                  );
                                }
                              }}
                              className="w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1"
                              maxLength={200}
                            />
                            <div className="text-xs text-gray-500 text-right mt-1">
                              {b.length}/200
                            </div>
                          </div>
                          <Button
                            onClick={() =>
                              removeFromList(
                                selectedServiceIndex,
                                "benefits",
                                bi
                              )
                            }
                            size="sm"
                            variant="outline"
                            className="bg-red-50 hover:bg-red-100 text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <span>{b}</span>
                      )}
                    </li>
                  )
                )}
              </ul>
              {isEditing && (
                <Button
                  onClick={() => addToList(selectedServiceIndex, "benefits")}
                  size="sm"
                  variant="outline"
                  className="bg-green-50 hover:bg-green-100 text-green-700 mb-4"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Benefit
                </Button>
              )}

              {/* Process */}
              <h3 className="font-semibold mb-2">Our Process</h3>
              <ol className="space-y-2 mb-4">
                {displayContent.services[selectedServiceIndex].process.map(
                  (p, pi) => (
                    <li key={pi} className="flex gap-2">
                      <span className="font-semibold">{pi + 1}.</span>
                      {isEditing ? (
                        <div className="flex gap-2 w-full items-start">
                          <div className="w-full">
                            <input
                              value={p}
                              onChange={(e) => {
                                if (e.target.value.length <= 200) {
                                  updateServiceList(
                                    selectedServiceIndex,
                                    "process",
                                    pi,
                                    e.target.value
                                  );
                                }
                              }}
                              className="w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1"
                              maxLength={200}
                            />
                            <div className="text-xs text-gray-500 text-right mt-1">
                              {p.length}/200
                            </div>
                          </div>
                          <Button
                            onClick={() =>
                              removeFromList(
                                selectedServiceIndex,
                                "process",
                                pi
                              )
                            }
                            size="sm"
                            variant="outline"
                            className="bg-red-50 hover:bg-red-100 text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <span>{p}</span>
                      )}
                    </li>
                  )
                )}
              </ol>
              {isEditing && (
                <Button
                  onClick={() => addToList(selectedServiceIndex, "process")}
                  size="sm"
                  variant="outline"
                  className="bg-green-50 hover:bg-green-100 text-green-700 mb-4"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Step
                </Button>
              )}

              {/* Pricing & Timeline */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Pricing</h3>
                  {isEditing ? (
                    <EditableText
                      value={
                        tempServicesSection.services[selectedServiceIndex]
                          .pricing
                      }
                      onChange={(val) =>
                        updateServiceField(selectedServiceIndex, "pricing", val)
                      }
                      placeholder="Pricing information"
                      maxLength={50}
                    />
                  ) : (
                    <p>
                      {displayContent.services[selectedServiceIndex].pricing}
                    </p>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Timeline</h3>
                  {isEditing ? (
                    <EditableText
                      value={
                        tempServicesSection.services[selectedServiceIndex]
                          .timeline
                      }
                      onChange={(val) =>
                        updateServiceField(
                          selectedServiceIndex,
                          "timeline",
                          val
                        )
                      }
                      placeholder="Timeline information"
                      maxLength={35}
                    />
                  ) : (
                    <p>
                      {displayContent.services[selectedServiceIndex].timeline}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Crop Modal (same as Header.tsx) */}
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
                Crop Service Image
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
                  image={cropImage}
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
                  className="w-full bg-green-600 hover:bg-green-700 text-white rounded py-2 text-sm font-medium"
                >
                  Apply Crop
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.section>
  );
}
