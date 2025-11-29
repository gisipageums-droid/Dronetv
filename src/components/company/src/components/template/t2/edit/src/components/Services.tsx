import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { X, CheckCircle, ZoomIn } from "lucide-react";
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
  const [visibleCount, setVisibleCount] = useState(3);
  const [pendingImages, setPendingImages] = useState<Record<number, File>>({});
  const [isUploading, setIsUploading] = useState(false);

  // Cropping states
  const [showCropper, setShowCropper] = useState(false);
  const [croppingIndex, setCroppingIndex] = useState<number | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [prevZoom, setPrevZoom] = useState(1);
  const [mediaSize, setMediaSize] = useState<{
    width: number;
    height: number;
    naturalWidth: number;
    naturalHeight: number;
  } | null>(null);
  const [cropAreaSize, setCropAreaSize] = useState<{ width: number; height: number } | null>(null);
  const [minZoomDynamic, setMinZoomDynamic] = useState(0.5);

  useEffect(() => {
    setPrevZoom(zoom);
  }, [zoom]);

  // Compute dynamic min zoom (free pan/zoom)
  useEffect(() => {
    if (mediaSize && cropAreaSize) {
      const coverW = cropAreaSize.width / mediaSize.width;
      const coverH = cropAreaSize.height / mediaSize.height;
      const computedMin = Math.max(coverW, coverH, 0.1);
      setMinZoomDynamic(computedMin);
      setZoom((z) => (z < computedMin ? computedMin : z));
    }
  }, [mediaSize, cropAreaSize]);

  // Merged all state into a single object
  const [servicesSection, setServicesSection] = useState(serviceData);

  // Add this useEffect to notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(servicesSection);
    }
  }, [servicesSection, onStateChange]);

  // Get categories from services
  const filteredServices =
    activeCategory === "All"
      ? servicesSection.services
      : servicesSection.services.filter((s) => s.category === activeCategory);

  const visibleServices = filteredServices.slice(0, visibleCount);

  // Handlers
  const updateServiceField = (index: number, field: string, value: any) => {
    setServicesSection((prev) => ({
      ...prev,
      services: prev.services.map((s, i) =>
        i === index ? { ...s, [field]: value } : s
      ),
    }));
  };

  const updateServiceList = (
    index: number,
    field: "features" | "benefits" | "process",
    listIndex: number,
    value: string
  ) => {
    setServicesSection((prev) => ({
      ...prev,
      services: prev.services.map((s, i) =>
        i === index
          ? {
            ...s,
            [field]: s[field].map((item: string, li: number) =>
              li === listIndex ? value : item
            ),
          }
          : s
      ),
    }));
  };

  const addToList = (
    index: number,
    field: "features" | "benefits" | "process"
  ) => {
    setServicesSection((prev) => ({
      ...prev,
      services: prev.services.map((s, i) =>
        i === index ? { ...s, [field]: [...s[field], "New Item"] } : s
      ),
    }));
  };

  const removeFromList = (
    index: number,
    field: "features" | "benefits" | "process",
    listIndex: number
  ) => {
    setServicesSection((prev) => ({
      ...prev,
      services: prev.services.map((s, i) =>
        i === index
          ? {
            ...s,
            [field]: s[field].filter(
              (_: string, li: number) => li !== listIndex
            ),
          }
          : s
      ),
    }));
  };

  // Image selection handler - now opens cropper
  const handleServiceImageSelect = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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
      setImageToCrop(reader.result);
      setOriginalFile(file);
      setCroppingIndex(index);
      setShowCropper(true);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
    };
    reader.readAsDataURL(file);

    // Clear the file input
    e.target.value = "";
  };

  // Cropper functions
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Helper function to create image element
  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  // Function to get cropped image
  const getCroppedImg = async (imageSrc, pixelCrop, rotation = 0) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Fixed output size for 16:9 ratio
    const outputWidth = 1600;
    const outputHeight = 900;

    canvas.width = outputWidth;
    canvas.height = outputHeight;

    // Fill background to avoid transparency
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

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
          const pngName = originalFile
            ? `cropped-service-${croppingIndex}-${originalFile.name.replace(/\.[^.]+$/, "")}.png`
            : `cropped-service-${croppingIndex}-${Date.now()}.png`;

          const file = new File([blob], pngName, {
            type: "image/png",
            lastModified: Date.now(),
          });

          const previewUrl = URL.createObjectURL(blob);

          resolve({
            file,
            previewUrl,
          });
        },
        "image/png"
      );
    });
  };

  // Apply crop and set pending file
  const applyCrop = async () => {
    try {
      if (!imageToCrop || !croppedAreaPixels || croppingIndex === null) return;

      const { file, previewUrl } = await getCroppedImg(
        imageToCrop,
        croppedAreaPixels,
        rotation
      );

      // Update preview immediately with blob URL (temporary)
      updateServiceField(croppingIndex, "image", previewUrl);

      // Set the actual file for upload on save
      setPendingImages((prev) => ({ ...prev, [croppingIndex]: file }));
      console.log("Service image cropped, file ready for upload:", file);

      toast.success("Image cropped successfully! Click Save to upload to S3.");
      setShowCropper(false);
      setImageToCrop(null);
      setOriginalFile(null);
      setCroppingIndex(null);
    } catch (error) {
      console.error("Error cropping image:", error);
      toast.error("Error cropping image. Please try again.");
    }
  };

  // Cancel cropping
  const cancelCrop = () => {
    setShowCropper(false);
    setImageToCrop(null);
    setOriginalFile(null);
    setCroppingIndex(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
  };

  // Reset zoom and rotation
  const resetCropSettings = () => {
    setZoom(1);
    setRotation(0);
    setCrop({ x: 0, y: 0 });
  };

  // Updated Save button handler - uploads images and stores S3 URLs
  const handleSave = async () => {
    try {
      setIsUploading(true);

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

        console.log("Uploading service image to S3:", file);

        const uploadResponse = await fetch(
          `https://o66ziwsye5.execute-api.ap-south-1.amazonaws.com/prod/upload-image/${userId}/${publishedId}`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          // Replace local preview with S3 URL
          updateServiceField(index, "image", uploadData.imageUrl);
          console.log("Image uploaded to S3:", uploadData.imageUrl);
        } else {
          const errorData = await uploadResponse.json();
          console.error("Image upload failed:", errorData);
          toast.error(
            `Image upload failed: ${errorData.message || "Unknown error"}`
          );
          return;
        }
      }

      // Clear pending images
      setPendingImages({});
      // Exit edit mode
      setIsEditing(false);
      toast.success("Services section saved with S3 URLs!");
    } catch (error) {
      console.error("Error saving services section:", error);
      toast.error("Error saving changes. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const addService = () => {
    const newService = {
      title: "New Service",
      category: "New Category",
      image: null,
      description: "Service description goes here...",
      features: ["New Feature"],
      detailedDescription: "Detailed description for the new service...",
      benefits: ["New Benefit"],
      process: ["New Step"],
      pricing: "Custom pricing",
      timeline: "TBD",
    };

    setServicesSection((prev) => ({
      ...prev,
      services: [...prev.services, newService],
    }));

    if (!servicesSection.categories.includes("New Category")) {
      setServicesSection((prev) => ({
        ...prev,
        categories: [...prev.categories, "New Category"],
      }));
    }
  };

  const removeService = (index: number) => {
    setServicesSection((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }));
  };

  const addCategory = () => {
    const newCategory = `New Category ${servicesSection.categories.length}`;
    if (!servicesSection.categories.includes(newCategory)) {
      setServicesSection((prev) => ({
        ...prev,
        categories: [...prev.categories, newCategory],
      }));
    }
  };

  const removeCategory = (cat: string) => {
    if (cat !== "All") {
      setServicesSection((prev) => ({
        ...prev,
        categories: prev.categories.filter((c) => c !== cat),
        services: prev.services.map((s) =>
          s.category === cat ? { ...s, category: "Uncategorized" } : s
        ),
      }));
    }
  };

  const openModal = (service: any, index: number) => {
    setSelectedServiceIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedServiceIndex(null);
  };

  return (
    <>
      {/* Image Cropper Modal - Services (Same as Clients) */}
      {showCropper && (
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
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Crop Service Image</h3>
                <p className="mt-1 text-sm text-gray-600">Recommended: 1600×900px (16:9 ratio) - WideScreen</p>
              </div>
              <button
                onClick={cancelCrop}
                className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Cropper Area */}
            <div className="flex-1 relative bg-gray-900 min-h-0">
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={16 / 9}
                minZoom={minZoomDynamic}
                maxZoom={5}
                restrictPosition={false}
                zoomWithScroll={true}
                zoomSpeed={0.2}
                onMediaLoaded={(ms) => setMediaSize(ms)}
                onCropAreaChange={(area) => setCropAreaSize(area)}
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

            {/* Controls */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              {/* Zoom Control */}
              <div className="mb-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-gray-700">
                    <ZoomIn className="w-4 h-4" />
                    Zoom
                  </span>
                  <span className="text-gray-600">{zoom.toFixed(1)}x</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label="Zoom out"
                    onClick={() => setZoom((z) => Math.max(minZoomDynamic, parseFloat((z - 0.1).toFixed(2))))}
                    className="px-3 py-1 border rounded text-gray-700 hover:bg-gray-100"
                  >
                    −
                  </button>
                  <input
                    type="range"
                    value={zoom}
                    min={minZoomDynamic}
                    max={5}
                    step={0.1}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
                  />
                  <button
                    type="button"
                    aria-label="Zoom in"
                    onClick={() => setZoom((z) => Math.min(5, parseFloat((z + 0.1).toFixed(2))))}
                    className="px-3 py-1 border rounded text-gray-700 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={resetCropSettings}
                  className="w-full py-2 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
                >
                  Reset
                </button>
                <button
                  onClick={cancelCrop}
                  className="w-full py-2 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={applyCrop}
                  className="w-full py-2 text-sm text-white bg-green-600 rounded hover:bg-green-700"
                >
                  Apply Crop
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Main Services Section */}
      <motion.section
        id="services"
        className="py-20 bg-background theme-transition text-justify"
      >
        <div className="px-4 mx-auto max-w-7xl">
          {/* Edit/Save Buttons */}
          <div className="flex justify-end mt-6">
            {isEditing ? (
              <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ y: -1, scaleX: 1.1 }}
                onClick={handleSave}
                disabled={isUploading}
                className={`${isUploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:shadow-2xl"
                  } text-white px-4 py-2 rounded shadow-xl hover:font-semibold`}
              >
                {isUploading ? "Uploading..." : "Save"}
              </motion.button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ y: -1, scaleX: 1.1 }}
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 text-black bg-yellow-500 rounded shadow-xl cursor-pointer hover:shadow-2xl hover:font-semibold"
              >
                Edit
              </motion.button>
            )}
          </div>

          {/* Header */}
          <div className="mb-8 text-center">
            {isEditing ? (
              <>
                <div className="relative mb-4">
                  <input
                    type="text"
                    className={`text-3xl font-bold block text-center w-full border-b ${servicesSection.heading.head.length >= 60
                      ? "border-red-500"
                      : ""
                      }`}
                    value={servicesSection.heading.head}
                    onChange={(e) =>
                      setServicesSection((prev) => ({
                        ...prev,
                        heading: { ...prev.heading, head: e.target.value },
                      }))
                    }
                    maxLength={60}
                  />
                  <div
                    className={`absolute right-0 -bottom-5 text-xs ${servicesSection.heading.head.length >= 60
                      ? "text-red-500 font-bold animate-pulse"
                      : servicesSection.heading.head.length > 50
                        ? "text-red-500"
                        : "text-gray-400"
                      }`}
                  >
                    {servicesSection.heading.head.length >= 60
                      ? "MAXIMUM LENGTH REACHED"
                      : `${servicesSection.heading.head.length}/60`}
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    className={`text-muted-foreground block w-full text-center border-b ${servicesSection.heading.desc.length >= 120
                      ? "border-red-500"
                      : ""
                      }`}
                    value={servicesSection.heading.desc}
                    onChange={(e) =>
                      setServicesSection((prev) => ({
                        ...prev,
                        heading: { ...prev.heading, desc: e.target.value },
                      }))
                    }
                    maxLength={120}
                  />
                  <div
                    className={`absolute right-0 -bottom-5 text-xs ${servicesSection.heading.desc.length >= 120
                      ? "text-red-500 font-bold animate-pulse"
                      : servicesSection.heading.desc.length > 100
                        ? "text-red-500"
                        : "text-gray-400"
                      }`}
                  >
                    {servicesSection.heading.desc.length >= 120
                      ? "MAXIMUM LENGTH REACHED"
                      : `${servicesSection.heading.desc.length}/120`}
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold">
                  {servicesSection.heading.head}
                </h2>
                <p className="text-muted-foreground text-justify">
                  {servicesSection.heading.desc}
                </p>
              </>
            )}
          </div>

          {/* Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {servicesSection.categories.map((cat, i) => (
              <div key={i} className="flex items-center gap-2">
                {isEditing ? (
                  <div className="relative">
                    <input
                      value={cat}
                      onChange={(e) =>
                        setServicesSection((prev) => ({
                          ...prev,
                          categories: prev.categories.map((c, idx) =>
                            idx === i ? e.target.value : c
                          ),
                        }))
                      }
                      maxLength={40}
                      className={`px-2 border-b pr-10 ${cat.length >= 40 ? "border-red-500" : ""
                        }`}
                    />
                    <div
                      className={`absolute right-1 top-1/2 transform -translate-y-1/2 text-[10px] ${cat.length >= 40
                        ? "text-red-500 font-bold"
                        : cat.length > 30
                          ? "text-red-500"
                          : "text-gray-400"
                        }`}
                    >
                      {cat.length >= 40 ? "MAX" : `${cat.length}`}
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={() => {
                      setActiveCategory(cat);
                      setVisibleCount(6); // reset load more
                    }}
                    className={
                      activeCategory === cat
                        ? "bg-primary cursor-pointer text-white"
                        : "bg-card text-card-foreground cursor-pointer"
                    }
                  >
                    {cat}
                  </Button>
                )}
                {isEditing && cat !== "All" && (
                  <button
                    onClick={() => removeCategory(cat)}
                    className="text-xs text-red-500"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            {isEditing && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
                onClick={addCategory}
                className="text-sm font-medium text-green-600"
              >
                + Add Category
              </motion.button>
            )}
          </div>

          {/* Services Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visibleServices.map((service, index) => (
              <Card
                key={index}
                className="relative flex flex-col h-full border-2 shadow-lg hover:shadow-xl shadow-gray-500"
              >
                <div className="relative flex-shrink-0 h-40 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="object-cover w-full h-full scale-110"
                  />
                  {isEditing && (
                    <motion.div
                      animate={{ scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="absolute p-1 rounded bottom-2 left-2 bg-white/80"
                    >
                      <div className="mb-1 text-xs text-gray-600">
                        Recommended: 1600×900px (16:9)
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="w-full text-xs font-bold cursor-pointer"
                        onChange={(e) => handleServiceImageSelect(index, e)}
                      />
                      {pendingImages[index] && (
                        <p className="mt-1 text-xs text-green-600">
                          ✓ Image cropped and ready to upload
                        </p>
                      )}
                    </motion.div>
                  )}
                </div>
                <div className="flex flex-col flex-grow p-6">
                  <div className="flex-shrink-0 mb-4">
                    {isEditing ? (
                      <div className="relative">
                        <input
                          value={service.title}
                          onChange={(e) =>
                            updateServiceField(index, "title", e.target.value)
                          }
                          maxLength={50}
                          className={`border-b w-full font-bold text-lg pr-12 ${service.title.length >= 50 ? "border-red-500" : ""
                            }`}
                        />
                        <div
                          className={`absolute right-0 top-1/2 transform -translate-y-1/2 text-xs ${service.title.length >= 50
                            ? "text-red-500 font-bold"
                            : service.title.length > 40
                              ? "text-red-500"
                              : "text-gray-400"
                            }`}
                        >
                          {service.title.length >= 50
                            ? "MAX"
                            : `${service.title.length}/50`}
                        </div>
                      </div>
                    ) : (
                      <CardTitle className="line-clamp-2 min-h-[3rem]">
                        {service.title}
                      </CardTitle>
                    )}
                  </div>
                  <div className="flex-grow mb-4">
                    {isEditing ? (
                      <>
                        <div className="relative">
                          <textarea
                            value={service.description}
                            onChange={(e) =>
                              updateServiceField(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            maxLength={120}
                            className={`border-b w-full min-h-[4rem] resize-none pr-12 ${service.description.length >= 120
                              ? "border-red-500"
                              : ""
                              }`}
                          />
                          <div
                            className={`absolute right-2 bottom-1 text-xs ${service.description.length >= 120
                              ? "text-red-500 font-bold"
                              : service.description.length > 100
                                ? "text-red-500"
                                : "text-gray-400"
                              }`}
                          >
                            {service.description.length >= 120
                              ? "MAX"
                              : `${service.description.length}/120`}
                          </div>
                        </div>

                        <div className="relative mt-2">
                          <input
                            value={service.category}
                            onChange={(e) =>
                              updateServiceField(
                                index,
                                "category",
                                e.target.value
                              )
                            }
                            maxLength={60}
                            className={`w-full border-b pr-10 ${service.category.length >= 60
                              ? "border-red-500"
                              : ""
                              }`}
                          />
                          <div
                            className={`absolute right-1 top-1/2 transform -translate-y-1/2 text-xs ${service.category.length >= 60
                              ? "text-red-500 font-bold"
                              : service.category.length > 50
                                ? "text-red-500"
                                : "text-gray-400"
                              }`}
                          >
                            {service.category.length >= 60
                              ? "MAX"
                              : `${service.category.length}/60`}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-muted-foreground line-clamp-3 min-h-[4rem] text-justify">
                          {service.description}
                        </p>
                        <p className="mt-1 text-xs italic text-gray-500 text-justify">
                          Category: {service.category}
                        </p>
                      </>
                    )}
                  </div>

                  <div className="flex gap-2 mt-auto">
                    <Button
                      className="flex-1 cursor-pointer hover:scale-105"
                      size="sm"
                      onClick={() => openModal(service, index)}
                    >
                      View Details
                    </Button>
                    {isEditing && (
                      <Button
                        className="cursor-pointer hover:scale-105"
                        size="sm"
                        variant="destructive"
                        onClick={() => removeService(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
            {isEditing && (
              <Card className="flex items-center justify-center border-dashed min-h-[350px]">
                <Button
                  onClick={addService}
                  className="text-green-600 cursor-pointer hover:scale-105"
                >
                  + Add Service
                </Button>
              </Card>
            )}
          </div>

          {/* Load More & Show Less */}
          <div className="flex justify-center mt-6">
            {visibleCount < filteredServices.length && (
              <Button onClick={() => setVisibleCount((prev) => prev + 6)}>
                Load More
              </Button>
            )}
            {visibleCount >= filteredServices.length &&
              filteredServices.length > 3 && (
                <Button
                  onClick={() => setVisibleCount(3)}
                  variant="secondary"
                  className="ml-4"
                >
                  Show Less
                </Button>
              )}
          </div>
        </div>

        {/* Modal - REDUCED SIZE */}
        <AnimatePresence>
          {isModalOpen && selectedServiceIndex !== null && (
            <motion.div
              className="fixed inset-0 z-[99999999999999] flex items-center justify-center p-4 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            >
              <div
                className="bg-card rounded-xl w-full max-w-2xl p-4 relative overflow-y-auto max-h-[70vh]"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={closeModal}
                  className="absolute p-2 bg-gray-500 rounded-full top-3 right-3"
                >
                  <X className="w-4 h-4" />
                </button>

                {isEditing ? (
                  <div className="relative">
                    <input
                      value={
                        servicesSection.services[selectedServiceIndex].title
                      }
                      onChange={(e) =>
                        updateServiceField(
                          selectedServiceIndex,
                          "title",
                          e.target.value
                        )
                      }
                      maxLength={60}
                      className={`border-b w-full text-xl font-bold mb-3 pr-16 ${servicesSection.services[selectedServiceIndex].title
                        .length >= 60
                        ? "border-red-500"
                        : ""
                        }`}
                    />
                    <div
                      className={`absolute right-0 top-1/2 transform -translate-y-1/2 text-xs ${servicesSection.services[selectedServiceIndex].title
                        .length >= 60
                        ? "text-red-500 font-bold animate-pulse"
                        : servicesSection.services[selectedServiceIndex].title
                          .length > 50
                          ? "text-red-500"
                          : "text-gray-400"
                        }`}
                    >
                      {servicesSection.services[selectedServiceIndex].title
                        .length >= 60
                        ? "MAX REACHED"
                        : `${servicesSection.services[selectedServiceIndex].title.length}/60`}
                    </div>
                  </div>
                ) : (
                  <h2 className="mb-3 text-xl font-bold">
                    {servicesSection.services[selectedServiceIndex].title}
                  </h2>
                )}

                {isEditing ? (
                  <div className="relative">
                    <textarea
                      value={
                        servicesSection.services[selectedServiceIndex]
                          .detailedDescription
                      }
                      onChange={(e) =>
                        updateServiceField(
                          selectedServiceIndex,
                          "detailedDescription",
                          e.target.value
                        )
                      }
                      maxLength={1000}
                      rows={3}
                      className={`border-b w-full mb-3 resize-none pr-16 ${servicesSection.services[selectedServiceIndex]
                        .detailedDescription.length >= 1000
                        ? "border-red-500"
                        : ""
                        }`}
                    />
                    <div
                      className={`absolute right-2 bottom-2 text-xs ${servicesSection.services[selectedServiceIndex]
                        .detailedDescription.length >= 1000
                        ? "text-red-500 font-bold animate-pulse"
                        : servicesSection.services[selectedServiceIndex]
                          .detailedDescription.length > 900
                          ? "text-red-500"
                          : "text-gray-400"
                        }`}
                    >
                      {servicesSection.services[selectedServiceIndex]
                        .detailedDescription.length >= 1000
                        ? "MAX REACHED"
                        : `${servicesSection.services[selectedServiceIndex].detailedDescription.length}/1000`}
                    </div>
                  </div>
                ) : (
                  <p className="mb-3 text-sm text-muted-foreground text-justify">
                    {
                      servicesSection.services[selectedServiceIndex]
                        .detailedDescription
                    }
                  </p>
                )}

                {/* Benefits */}
                <h3 className="mb-2 text-sm font-semibold">Key Benefits</h3>
                <ul className="mb-3 space-y-1">
                  {servicesSection.services[selectedServiceIndex].benefits.map(
                    (b: string, bi: number) => (
                      <li key={bi} className="flex gap-2">
                        <CheckCircle className="w-3 h-3 mt-1 text-green-500" />
                        {isEditing ? (
                          <div className="flex flex-col w-full gap-1">
                            <div className="relative">
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
                                maxLength={80}
                                className={`border-b w-full pr-10 text-sm ${b.length >= 80 ? "border-red-500" : ""
                                  }`}
                              />
                              <div
                                className={`absolute right-0 top-1/2 transform -translate-y-1/2 text-[10px] ${b.length >= 80
                                  ? "text-red-500 font-bold"
                                  : b.length > 70
                                    ? "text-red-500"
                                    : "text-gray-400"
                                  }`}
                              >
                                {b.length >= 80 ? "MAX" : `${b.length}`}
                              </div>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() =>
                                removeFromList(
                                  selectedServiceIndex,
                                  "benefits",
                                  bi
                                )
                              }
                              className="text-xs text-red-500"
                            >
                              ✕ Remove
                            </motion.button>
                          </div>
                        ) : (
                          <span className="text-sm">{b}</span>
                        )}
                      </li>
                    )
                  )}
                </ul>
                {isEditing && (
                  <button
                    onClick={() => addToList(selectedServiceIndex, "benefits")}
                    className="mb-3 text-xs text-green-600"
                  >
                    + Add Benefit
                  </button>
                )}

                {/* Process */}
                <h3 className="mb-2 text-sm font-semibold">Our Process</h3>
                <ol className="mb-3 space-y-1">
                  {servicesSection.services[selectedServiceIndex].process.map(
                    (p: string, pi: number) => (
                      <li key={pi}>
                        {isEditing ? (
                          <div className="flex flex-col w-full gap-1">
                            <div className="relative">
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
                                maxLength={80}
                                className={`border-b w-full pr-10 text-sm ${p.length >= 80 ? "border-red-500" : ""
                                  }`}
                              />
                              <div
                                className={`absolute right-0 top-1/2 transform -translate-y-1/2 text-[10px] ${p.length >= 80
                                  ? "text-red-500 font-bold"
                                  : p.length > 70
                                    ? "text-red-500"
                                    : "text-gray-400"
                                  }`}
                              >
                                {p.length >= 80 ? "MAX" : `${p.length}`}
                              </div>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() =>
                                removeFromList(
                                  selectedServiceIndex,
                                  "process",
                                  pi
                                )
                              }
                              className="text-xs text-red-500"
                            >
                              ✕ Remove
                            </motion.button>
                          </div>
                        ) : (
                          <span className="text-sm">{p}</span>
                        )}
                      </li>
                    )
                  )}
                </ol>
                {isEditing && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => addToList(selectedServiceIndex, "process")}
                    className="mb-3 text-xs text-green-600"
                  >
                    + Add Step
                  </motion.button>
                )}

                {/* Pricing & Timeline */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="mb-2 text-sm font-semibold">Pricing</h3>
                    {isEditing ? (
                      <div className="relative">
                        <input
                          value={
                            servicesSection.services[selectedServiceIndex]
                              .pricing
                          }
                          onChange={(e) =>
                            updateServiceField(
                              selectedServiceIndex,
                              "pricing",
                              e.target.value
                            )
                          }
                          maxLength={30}
                          className={`border-b w-full pr-10 text-sm ${servicesSection.services[selectedServiceIndex]
                            .pricing.length >= 30
                            ? "border-red-500"
                            : ""
                            }`}
                        />
                        <div
                          className={`absolute right-0 top-1/2 transform -translate-y-1/2 text-xs ${servicesSection.services[selectedServiceIndex]
                            .pricing.length >= 30
                            ? "text-red-500 font-bold"
                            : servicesSection.services[selectedServiceIndex]
                              .pricing.length > 25
                              ? "text-red-500"
                              : "text-gray-400"
                            }`}
                        >
                          {servicesSection.services[selectedServiceIndex]
                            .pricing.length >= 30
                            ? "MAX"
                            : `${servicesSection.services[selectedServiceIndex].pricing.length}/30`}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-justify">
                        {servicesSection.services[selectedServiceIndex].pricing}
                      </p>
                    )}
                  </div>
                  <div>
                    <h3 className="mb-2 text-sm font-semibold">Timeline</h3>
                    {isEditing ? (
                      <div className="relative">
                        <input
                          value={
                            servicesSection.services[selectedServiceIndex]
                              .timeline
                          }
                          onChange={(e) =>
                            updateServiceField(
                              selectedServiceIndex,
                              "timeline",
                              e.target.value
                            )
                          }
                          maxLength={60}
                          className={`border-b w-full pr-10 text-sm ${servicesSection.services[selectedServiceIndex]
                            .timeline.length >= 60
                            ? "border-red-500"
                            : ""
                            }`}
                        />
                        <div
                          className={`absolute right-0 top-1/2 transform -translate-y-1/2 text-xs ${servicesSection.services[selectedServiceIndex]
                            .timeline.length >= 60
                            ? "text-red-500 font-bold"
                            : servicesSection.services[selectedServiceIndex]
                              .timeline.length > 50
                              ? "text-red-500"
                              : "text-gray-400"
                            }`}
                        >
                          {servicesSection.services[selectedServiceIndex]
                            .timeline.length >= 60
                            ? "MAX"
                            : `${servicesSection.services[selectedServiceIndex].timeline.length}/60`}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-justify">
                        {
                          servicesSection.services[selectedServiceIndex]
                            .timeline
                        }
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>
    </>
  );
}