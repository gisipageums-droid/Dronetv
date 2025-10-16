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
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "react-toastify";
import Cropper from "react-easy-crop";

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

export default function Services({
  serviceData,
  onStateChange,
  userId,
  publishedId,
  templateSelection,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedServiceIndex, setSelectedServiceIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingImages, setPendingImages] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Crop modal state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImage, setCropImage] = useState(null);
  const [cropField, setCropField] = useState(null);
  const [cropIndex, setCropIndex] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);

  // Create a temporary state for editing
  const [servicesSection, setServicesSection] = useState(serviceData);
  const [tempServicesSection, setTempServicesSection] = useState(serviceData);

  // Update content when serviceData changes
  useEffect(() => {
    if (serviceData) {
      setServicesSection(serviceData);
      setTempServicesSection(serviceData);
    }
  }, [serviceData]);

  // Notify parent of state changes
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

  // Crop modal functions
  const openCropModal = (file, field, index = null) => {
    const reader = new FileReader();
    reader.onload = () => {
      setCropImage(reader.result);
      setCropField(field);
      setCropIndex(index);
      setOriginalFile(file);
      setCropModalOpen(true);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    };
    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const applyCrop = async () => {
    try {
      const croppedBlob = await getCroppedImg(cropImage, croppedAreaPixels);
      const croppedFile = new File([croppedBlob], originalFile.name, {
        type: "image/jpeg",
      });

      // For service images
      if (cropField === "serviceImage") {
        setPendingImages((prev) => ({ ...prev, [cropIndex]: croppedFile }));

        const reader = new FileReader();
        reader.onload = () => {
          setTempServicesSection((prev) => ({
            ...prev,
            services: prev.services.map((service, i) =>
              i === cropIndex ? { ...service, image: reader.result } : service
            ),
          }));
        };
        reader.readAsDataURL(croppedFile);
      }

      setCropModalOpen(false);
      toast.success("Image cropped successfully");
    } catch (error) {
      console.error("Error cropping image:", error);
      toast.error("Error cropping image");
    }
  };

  // Handlers
  const updateServiceField = (index, field, value) => {
    setTempServicesSection((prev) => ({
      ...prev,
      services: prev.services.map((s, i) =>
        i === index ? { ...s, [field]: value } : s
      ),
    }));

    // Update categories if needed
    if (
      field === "category" &&
      !tempServicesSection.categories.includes(value)
    ) {
      setTempServicesSection((prev) => ({
        ...prev,
        categories: [...prev.categories, value],
      }));
    }
  };

  const updateServiceList = (index, field, listIndex, value) => {
    setTempServicesSection((prev) => ({
      ...prev,
      services: prev.services.map((s, i) =>
        i === index
          ? {
              ...s,
              [field]: s[field].map((item, li) =>
                li === listIndex ? value : item
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

  // Updated image selection with crop feature
  const handleServiceImageSelect = (index, e) => {
    const file = e.target.files?.[0];
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

    // Open crop modal instead of directly updating
    openCropModal(file, "serviceImage", index);
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

  // Update heading fields
  const updateHeading = (field, value) => {
    setTempServicesSection((prev) => ({
      ...prev,
      heading: {
        ...prev.heading,
        [field]: value,
      },
    }));
  };

  // EditableText component for consistent styling
  const EditableText = useMemo(
    () =>
      ({
        value,
        onChange,
        multiline = false,
        className = "",
        placeholder = "",
      }) => {
        const baseClasses =
          "w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none";
        if (multiline) {
          return (
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
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
            onChange={(e) => onChange(e.target.value)}
            className={`${baseClasses} p-1 ${className}`}
            placeholder={placeholder}
          />
        );
      },
    []
  );

  // Use the appropriate content based on editing mode
  const displayContent = isEditing ? tempServicesSection : servicesSection;

  return (
    <motion.section id="services" className="py-20 theme-transition relative">
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
        <div className="text-center mb-8">
          {isEditing ? (
            <>
              <EditableText
                value={tempServicesSection.heading.head}
                onChange={(val) => updateHeading("head", val)}
                className="text-3xl font-bold mb-2"
                placeholder="Section heading"
              />
              <EditableText
                value={tempServicesSection.heading.desc}
                onChange={(val) => updateHeading("desc", val)}
                multiline={true}
                className="text-muted-foreground"
                placeholder="Section description"
              />
            </>
          ) : (
            <>
              <span className="inline-block mx-auto px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
                Our Services
              </span>
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
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {displayContent.categories.map((cat, i) => (
            <div key={i} className="flex items-center gap-2">
              {isEditing ? (
                <input
                  value={cat}
                  onChange={(e) =>
                    setTempServicesSection((prev) => ({
                      ...prev,
                      categories: prev.categories.map((c, idx) =>
                        idx === i ? e.target.value : c
                      ),
                    }))
                  }
                  className="w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1"
                />
              ) : (
                <Button
                  key={i}
                  onClick={() => {
                    setActiveCategory(cat);
                  }}
                  className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                    activeCategory === cat
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service, index) => (
            <Card key={index} className="relative overflow-hidden shadow-sm">
              <div className="h-44 overflow-hidden relative">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <span className="px-3 py-1 bg-orange-400 text-white text-xs font-medium rounded-full">
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
              <CardHeader>
                {isEditing ? (
                  <EditableText
                    value={service.title}
                    onChange={(val) => updateServiceField(index, "title", val)}
                    className="font-bold"
                    placeholder="Service title"
                  />
                ) : (
                  <CardTitle>{service.title}</CardTitle>
                )}
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <>
                    <EditableText
                      value={service.description}
                      onChange={(val) =>
                        updateServiceField(index, "description", val)
                      }
                      multiline={true}
                      placeholder="Service description"
                    />
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <EditableText
                        value={service.category}
                        onChange={(val) =>
                          updateServiceField(index, "category", val)
                        }
                        placeholder="Service category"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-600 mb-4 flex-1">
                      {service.description}
                    </p>
                  </>
                )}

                <div className="mt-4 flex gap-2 ">
                  <Button
                    className={` ${
                      isEditing ? "" : "w-full"
                    } hover:scale-105 bg-orange-400 hover:bg-orange-600 text-white`}
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
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50"
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
                        <div className="flex gap-2 w-full">
                          <input
                            value={b}
                            onChange={(e) =>
                              updateServiceList(
                                selectedServiceIndex,
                                "benefits",
                                bi,
                                e.target.value
                              )
                            }
                            className="w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1"
                          />
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
                        <div className="flex gap-2 w-full">
                          <input
                            value={p}
                            onChange={(e) =>
                              updateServiceList(
                                selectedServiceIndex,
                                "process",
                                pi,
                                e.target.value
                              )
                            }
                            className="w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1"
                          />
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

      {/* Crop Modal */}
      {cropModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Crop Image</h3>
            <div className="relative w-full h-96 bg-gray-900 rounded-lg overflow-hidden">
              <Cropper
                image={cropImage}
                crop={crop}
                zoom={zoom}
                aspect={4 / 3}
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
    </motion.section>
  );
}