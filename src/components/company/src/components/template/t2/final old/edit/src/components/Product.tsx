import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Monitor,
  Smartphone,
  Cloud,
  BarChart3,
  Zap,
  X,
  CheckCircle,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "react-toastify";
import Cropper from "react-easy-crop";

export default function Product({
  productData,
  onStateChange,
  userId,
  publishedId,
  templateSelection,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);
  const [selectedProductIndex, setSelectedProductIndex] = useState<
    number | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  const [aspectRatio, setAspectRatio] = useState(4 / 3);
  const [mediaSize, setMediaSize] = useState<{ width: number; height: number; naturalWidth: number; naturalHeight: number } | null>(null);
  const [cropAreaSize, setCropAreaSize] = useState<{ width: number; height: number } | null>(null);
  const [minZoomDynamic, setMinZoomDynamic] = useState(0.1);
  const [isDragging, setIsDragging] = useState(false);
  const PAN_STEP = 10;

  // Consolidated state
  const [contentState, setContentState] = useState(productData);

  // Add this useEffect to notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(contentState);
    }
  }, [contentState, onStateChange]);

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

  // Update function for simple fields
  const updateField = (section, field, value) => {
    setContentState((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  // Update function for products
  const updateProductField = (index, field, value) => {
    setContentState((prev) => ({
      ...prev,
      products: prev.products.map((p, i) =>
        i === index ? { ...p, [field]: value } : p
      ),
    }));
  };

  // Update function for product features
  const updateFeature = (index, fIndex, value) => {
    setContentState((prev) => ({
      ...prev,
      products: prev.products.map((p, i) =>
        i === index
          ? {
            ...p,
            features: p.features.map((f, fi) => (fi === fIndex ? value : f)),
          }
          : p
      ),
    }));
  };

  // Add a new feature to a product
  const addFeature = (index) => {
    setContentState((prev) => ({
      ...prev,
      products: prev.products.map((p, i) =>
        i === index ? { ...p, features: [...p.features, "New Feature"] } : p
      ),
    }));
  };

  // Remove a feature from a product
  const removeFeature = (index, fIndex) => {
    setContentState((prev) => ({
      ...prev,
      products: prev.products.map((p, i) =>
        i === index
          ? {
            ...p,
            features: p.features.filter((_, fi) => fi !== fIndex),
          }
          : p
      ),
    }));
  };

  // Image selection handler - now opens cropper
  const handleProductImageSelect = async (index, e) => {
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
      setAspectRatio(4 / 3);
      setZoom(1);
      setRotation(0);
      setCrop({ x: 0, y: 0 });
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

    // Fixed output size for 4:3 ratio (match Hero's fixed export behavior)
    const outputWidth = 600;
    const outputHeight = 450;

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
          const fileName = originalFile
            ? `cropped-product-${croppingIndex}-${originalFile.name}`
            : `cropped-product-${croppingIndex}-${Date.now()}.jpg`;

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
      updateProductField(croppingIndex, "image", previewUrl);

      // Set the actual file for upload on save
      setPendingImages((prev) => ({ ...prev, [croppingIndex]: file }));
      console.log("Product image cropped, file ready for upload:", file);

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
        formData.append("sectionName", "products");
        formData.append("imageField", `products[${index}].image` + Date.now());
        formData.append("templateSelection", templateSelection);

        console.log("Uploading product image to S3:", file);

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
          updateProductField(index, "image", uploadData.imageUrl);
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
      toast.success("Products section saved with S3 URLs!");
    } catch (error) {
      console.error("Error saving products section:", error);
      toast.error("Error saving changes. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Add a new product
  const addProduct = () => {
    setContentState((prev) => ({
      ...prev,
      products: [
        ...prev.products,
        {
          icon: Monitor,
          title: "New Product",
          category: "New Category",
          image: null,
          description: "New product description...",
          features: ["New Feature"],
          isPopular: false,
          categoryColor: "bg-gray-100 text-gray-800",
          detailedDescription: "Detailed description for new product...",
          pricing: "TBD",
          timeline: "TBD",
        },
      ],
    }));
  };

  // Remove a product
  const removeProduct = (index) => {
    setContentState((prev) => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index),
    }));
  };

  const openModal = (index) => {
    setSelectedProductIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProductIndex(null);
  };

  return (
    <>
      {/* Image Cropper Modal - Standardized like Clients */}
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
              <h3 className="text-lg font-semibold text-gray-800">
                Crop Product Image
              </h3>
              <button
                onClick={cancelCrop}
                className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Cropper Area */}
            <div className={`relative flex-1 min-h-0 bg-gray-900 ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}>
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={aspectRatio}
                minZoom={minZoomDynamic}
                maxZoom={5}
                restrictPosition={false}
                zoomWithScroll={true}
                zoomSpeed={0.2}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                onMediaLoaded={(ms) => setMediaSize(ms)}
                onCropAreaChange={(area) => setCropAreaSize(area)}
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
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              {/* Aspect Ratio Buttons */}
              <div className="mb-4">
                <p className="mb-2 text-sm font-medium text-gray-700">
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
              <div className="mb-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-gray-700">
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
                  className="w-full py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
                >
                  Reset
                </button>
                <button
                  onClick={cancelCrop}
                  className="w-full py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={applyCrop}
                  className="w-full py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700"
                >
                  Apply Crop
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Main Product Section */}
      <motion.section
        id="product"
        className=" bg-secondary theme-transition"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
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
          <div className="max-w-3xl mx-auto mb-16 text-center">
            {isEditing ? (
              <>
                <div className="inline-flex items-center px-4 py-2 mb-4 rounded-full bg-red-accent/10 text-red-accent">
                  <Zap className="w-4 h-4 mr-2" />
                  <div className="relative">
                    <input
                      type="text"
                      value={contentState.heading.title}
                      onChange={(e) =>
                        updateField("heading", "title", e.target.value)
                      }
                      maxLength={30}
                      className="pr-8 font-medium bg-transparent border-b"
                    />
                    <div
                      className={`absolute right-0 top-1/2 transform -translate-y-1/2 text-xs ${contentState.heading.title.length >= 30
                        ? "text-red-500 font-bold"
                        : contentState.heading.title.length > 25
                          ? "text-red-500"
                          : "text-gray-400"
                        }`}
                    >
                      {contentState.heading.title.length >= 30
                        ? "MAX"
                        : `${contentState.heading.title.length}/30`}
                    </div>
                  </div>
                </div>

                <div className="relative mb-4">
                  <input
                    type="text"
                    value={contentState.heading.heading}
                    onChange={(e) =>
                      updateField("heading", "heading", e.target.value)
                    }
                    maxLength={60}
                    className="block w-full mb-1 text-3xl font-medium text-center bg-transparent border-b md:text-4xl text-foreground"
                  />
                  <div
                    className={`absolute right-0 -bottom-4 text-xs ${contentState.heading.heading.length >= 60
                      ? "text-red-500 font-bold"
                      : contentState.heading.heading.length > 50
                        ? "text-red-500"
                        : "text-gray-400"
                      }`}
                  >
                    {contentState.heading.heading.length >= 60
                      ? "MAXIMUM LENGTH REACHED"
                      : `${contentState.heading.heading.length}/60`}
                  </div>
                </div>

                <div className="relative mb-4">
                  <input
                    type="text"
                    className="block w-full mb-1 text-3xl font-medium text-center bg-transparent border-b md:text-4xl text-foreground"
                    value={contentState.heading.description}
                    onChange={(e) =>
                      updateField("heading", "description", e.target.value)
                    }
                    maxLength={80}
                  />
                  <div
                    className={`absolute right-0 -bottom-4 text-xs ${contentState.heading.description.length >= 80
                      ? "text-red-500 font-bold"
                      : contentState.heading.description.length > 70
                        ? "text-red-500"
                        : "text-gray-400"
                      }`}
                  >
                    {contentState.heading.description.length >= 80
                      ? "MAXIMUM LENGTH REACHED"
                      : `${contentState.heading.description.length}/80`}
                  </div>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={contentState.heading.trust}
                    onChange={(e) =>
                      updateField("heading", "trust", e.target.value)
                    }
                    maxLength={50}
                    className="block w-full mb-1 text-3xl font-medium text-center bg-transparent border-b md:text-4xl text-foreground"
                  />
                  <div
                    className={`absolute right-0 -bottom-4 text-xs ${contentState.heading.trust.length >= 50
                      ? "text-red-500 font-bold"
                      : contentState.heading.trust.length > 40
                        ? "text-red-500"
                        : "text-gray-400"
                      }`}
                  >
                    {contentState.heading.trust.length >= 50
                      ? "MAX"
                      : `${contentState.heading.trust.length}/50`}
                  </div>
                </div>
              </>
            ) : (
              <>
                {contentState.heading.title.length > 0 ? (
                  <>
                    <div className="inline-flex items-center px-4 py-2 mb-4 rounded-full bg-red-accent/10 text-red-accent">
                      <Zap className="w-4 h-4 mr-2" />
                      <span className="font-medium">
                        {" "}
                        {contentState.heading.title}
                      </span>
                    </div>
                  </>
                ) : null}
                <h2 className="mb-4 text-3xl md:text-4xl text-foreground">
                  {contentState.heading.heading}
                </h2>

                <p className="inline text-lg text-muted-foreground">
                  {contentState.heading.description}
                </p>
                <p className="inline text-lg font-bold text-muted-foreground text-foreground">
                  {" "}
                  {contentState.heading.trust}
                </p>
              </>
            )}
          </div>

          {/* Products Grid */}
          <div className="grid gap-6 mb-16 md:grid-cols-2 lg:grid-cols-4">
            {contentState.products
              .slice(0, visibleCount)
              .map((product, index) => {
                return (
                  <Card
                    key={index}
                    className="relative flex flex-col h-full overflow-hidden border-2 shadow-lg group hover:shadow-xl shadow-gray-500"
                  >
                    <div className="relative flex-shrink-0 h-32 overflow-hidden">
                      <ImageWithFallback
                        src={product.image}
                        alt={product.title}
                        className="object-cover w-full h-full"
                      />

                      {/* Category at the top */}
                      <div className="absolute top-2 left-2">
                        <Badge
                          className={`${product.categoryColor} border-0 text-xs`}
                        >
                          {isEditing ? (
                            <div className="relative">
                              <input
                                value={product.category}
                                onChange={(e) =>
                                  updateProductField(
                                    index,
                                    "category",
                                    e.target.value
                                  )
                                }
                                maxLength={20}
                                className="pr-8 text-xs bg-transparent border-b"
                              />
                              <div
                                className={`absolute right-0 top-1/2 transform -translate-y-1/2 text-[10px] ${product.category.length >= 20
                                  ? "text-red-500 font-bold"
                                  : product.category.length > 15
                                    ? "text-red-500"
                                    : "text-gray-400"
                                  }`}
                              >
                                {product.category.length >= 20
                                  ? "MAX"
                                  : `${product.category.length}`}
                              </div>
                            </div>
                          ) : (
                            product.category
                          )}
                        </Badge>
                      </div>

                      {product.isPopular && (
                        <div className="absolute flex items-center px-2 py-1 text-xs font-bold text-white rounded-full top-2 right-2 bg-red-accent">
                          <Zap className="w-2 h-2 mr-1" /> Bestseller
                        </div>
                      )}

                      {isEditing && (
                        <motion.div
                          animate={{ scale: 1 }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          transition={{ duration: 0.3 }}
                          className="absolute z-50 p-2 rounded bottom-2 left-2 right-2 bg-white/80"
                        >
                          {/* Recommendation text connected with select image */}
                          <div className="mb-1 text-xs text-center text-gray-600">
                            Recommended: (16:9 ratio) - WideScreen
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            className="w-full text-xs font-bold text-center cursor-pointer"
                            onChange={(e) => handleProductImageSelect(index, e)}
                          />
                          {pendingImages[index] && (
                            <p className="mt-1 text-xs text-center text-green-600">
                              ✓ Image cropped and ready to upload
                            </p>
                          )}
                        </motion.div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    </div>
                    <div className="flex flex-col flex-grow p-6">
                      <div className="flex-shrink-0 mb-4">
                        {isEditing ? (
                          <div className="relative">
                            <input
                              value={product.title}
                              onChange={(e) =>
                                updateProductField(
                                  index,
                                  "title",
                                  e.target.value
                                )
                              }
                              maxLength={60}
                              className={`border-b w-full font-bold text-lg text-center pr-16 ${product.title.length >= 60
                                ? "border-red-500"
                                : ""
                                }`}
                            />
                            <div
                              className={`absolute right-0 top-1/2 transform -translate-y-1/2 text-xs ${product.title.length >= 60
                                ? "text-red-500 font-bold animate-pulse"
                                : product.title.length > 50
                                  ? "text-red-500"
                                  : "text-gray-400"
                                }`}
                            >
                              {product.title.length >= 60
                                ? "MAX REACHED"
                                : `${product.title.length}/60`}
                            </div>
                          </div>
                        ) : (
                          <CardTitle className="line-clamp-2 min-h-[3rem] text-center">
                            {product.title}
                          </CardTitle>
                        )}
                      </div>
                      <div className="flex-grow mb-4">
                        {isEditing ? (
                          <div className="relative">
                            <textarea
                              value={product.description}
                              onChange={(e) =>
                                updateProductField(
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                              maxLength={150}
                              className={`border-b w-full min-h-[4rem] text-center resize-none pr-16 ${product.description.length >= 150
                                ? "border-red-500"
                                : ""
                                }`}
                            />
                            <div
                              className={`absolute right-2 bottom-1 text-xs ${product.description.length >= 150
                                ? "text-red-500 font-bold animate-pulse"
                                : product.description.length > 130
                                  ? "text-red-500"
                                  : "text-gray-400"
                                }`}
                            >
                              {product.description.length >= 150
                                ? "MAX"
                                : `${product.description.length}/150`}
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground line-clamp-3 min-h-[4rem] text-center">
                            {product.description}
                          </p>
                        )}
                        <ul className="space-y-1 mt-3 min-h-[3rem]">
                          {product.features.map((f, fi) => (
                            <li
                              key={fi}
                              className="flex items-center text-xs text-muted-foreground"
                            >
                              <div className="flex-shrink-0 w-1 h-1 mr-2 rounded-full bg-primary" />
                              {isEditing ? (
                                <div className="flex flex-col w-full gap-1">
                                  <div className="relative">
                                    <input
                                      value={f}
                                      onChange={(e) =>
                                        updateFeature(index, fi, e.target.value)
                                      }
                                      maxLength={40}
                                      className={`border-b w-full pr-10 ${f.length >= 40 ? "border-red-500" : ""
                                        }`}
                                    />
                                    <div
                                      className={`absolute right-0 top-1/2 transform -translate-y-1/2 text-xs ${f.length >= 40
                                        ? "text-red-500 font-bold"
                                        : f.length > 35
                                          ? "text-red-500"
                                          : "text-gray-400"
                                        }`}
                                    >
                                      {f.length >= 40
                                        ? "MAX"
                                        : `${f.length}/40`}
                                    </div>
                                  </div>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => removeFeature(index, fi)}
                                    className="text-xs text-red-500 cursor-pointer"
                                  >
                                    ✕ Remove
                                  </motion.button>
                                </div>
                              ) : (
                                <span className="line-clamp-1">{f}</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {isEditing && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => addFeature(index)}
                          className="mt-2 mb-4 text-xs text-center text-green-600"
                        >
                          + Add Feature
                        </motion.button>
                      )}
                      <div className="flex gap-2 mt-auto">
                        <Button
                          size="sm"
                          className="flex-1 hover:scale-105"
                          onClick={() => openModal(index)}
                        >
                          View Details
                        </Button>
                        {isEditing && (
                          <Button
                            size="sm"
                            className="hover:scale-105"
                            variant="destructive"
                            onClick={() => removeProduct(index)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            {isEditing && (
              <Card className="flex items-center justify-center border-dashed min-h-[400px]">
                <Button
                  onClick={addProduct}
                  className="text-green-600 hover:scale-105"
                >
                  + Add Product
                </Button>
              </Card>
            )}
          </div>

          {/* Load More / Show Less */}
          <div className="flex justify-center mt-6">
            {visibleCount < contentState.products.length && (
              <Button onClick={() => setVisibleCount((prev) => prev + 4)}>
                Load More
              </Button>
            )}
            {visibleCount >= contentState.products.length &&
              contentState.products.length > 4 && (
                <Button
                  onClick={() => setVisibleCount(4)}
                  variant="secondary"
                  className="ml-4"
                >
                  Show Less
                </Button>
              )}
          </div>
        </div>

        {/* Modal */}
        <AnimatePresence>
          {isModalOpen && selectedProductIndex !== null && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            >
              <div
                className="bg-card rounded-xl w-full max-w-3xl p-6 relative overflow-y-auto max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={closeModal}
                  className="absolute p-2 bg-white rounded-full top-4 right-4"
                >
                  <X className="w-5 h-5" />
                </button>

                {isEditing ? (
                  <div className="relative">
                    <input
                      value={contentState.products[selectedProductIndex].title}
                      onChange={(e) =>
                        updateProductField(
                          selectedProductIndex,
                          "title",
                          e.target.value
                        )
                      }
                      maxLength={60}
                      className={`border-b w-full text-2xl font-bold mb-4 text-center pr-16 ${contentState.products[selectedProductIndex].title
                        .length >= 60
                        ? "border-red-500"
                        : ""
                        }`}
                    />
                    <div
                      className={`absolute right-0 top-1/2 transform -translate-y-1/2 text-xs ${contentState.products[selectedProductIndex].title
                        .length >= 60
                        ? "text-red-500 font-bold animate-pulse"
                        : contentState.products[selectedProductIndex].title
                          .length > 50
                          ? "text-red-500"
                          : "text-gray-400"
                        }`}
                    >
                      {contentState.products[selectedProductIndex].title
                        .length >= 60
                        ? "MAX REACHED"
                        : `${contentState.products[selectedProductIndex].title.length}/60`}
                    </div>
                  </div>
                ) : (
                  <h2 className="mb-4 text-2xl font-bold text-center">
                    {contentState.products[selectedProductIndex].title}
                  </h2>
                )}

                {isEditing ? (
                  <div className="relative">
                    <textarea
                      value={
                        contentState.products[selectedProductIndex]
                          .detailedDescription
                      }
                      onChange={(e) =>
                        updateProductField(
                          selectedProductIndex,
                          "detailedDescription",
                          e.target.value
                        )
                      }
                      maxLength={1000}
                      rows={4}
                      className={`border-b w-full mb-4 text-center resize-none pr-16 ${contentState.products[selectedProductIndex]
                        .detailedDescription.length >= 1000
                        ? "border-red-500"
                        : ""
                        }`}
                    />
                    <div
                      className={`absolute right-2 bottom-2 text-xs ${contentState.products[selectedProductIndex]
                        .detailedDescription.length >= 1000
                        ? "text-red-500 font-bold animate-pulse"
                        : contentState.products[selectedProductIndex]
                          .detailedDescription.length > 900
                          ? "text-red-500"
                          : "text-gray-400"
                        }`}
                    >
                      {contentState.products[selectedProductIndex]
                        .detailedDescription.length >= 1000
                        ? "MAX REACHED"
                        : `${contentState.products[selectedProductIndex].detailedDescription.length}/1000`}
                    </div>
                  </div>
                ) : (
                  <p className="mb-4 text-center text-muted-foreground">
                    {
                      contentState.products[selectedProductIndex]
                        .detailedDescription
                    }
                  </p>
                )}

                {/* Pricing & Timeline */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="mb-2 font-semibold">Pricing</h3>
                    {isEditing ? (
                      <div className="relative">
                        <input
                          value={
                            contentState.products[selectedProductIndex].pricing
                          }
                          onChange={(e) =>
                            updateProductField(
                              selectedProductIndex,
                              "pricing",
                              e.target.value
                            )
                          }
                          maxLength={30}
                          className={`border-b w-full pr-10 ${contentState.products[selectedProductIndex].pricing
                            .length >= 30
                            ? "border-red-500"
                            : ""
                            }`}
                        />
                        <div
                          className={`absolute right-0 top-1/2 transform -translate-y-1/2 text-xs ${contentState.products[selectedProductIndex].pricing
                            .length >= 30
                            ? "text-red-500 font-bold"
                            : contentState.products[selectedProductIndex]
                              .pricing.length > 25
                              ? "text-red-500"
                              : "text-gray-400"
                            }`}
                        >
                          {contentState.products[selectedProductIndex].pricing
                            .length >= 30
                            ? "MAX"
                            : `${contentState.products[selectedProductIndex].pricing.length}/30`}
                        </div>
                      </div>
                    ) : (
                      <p>
                        {contentState.products[selectedProductIndex].pricing}
                      </p>
                    )}
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold">Timeline</h3>
                    {isEditing ? (
                      <div className="relative">
                        <input
                          value={
                            contentState.products[selectedProductIndex].timeline
                          }
                          onChange={(e) =>
                            updateProductField(
                              selectedProductIndex,
                              "timeline",
                              e.target.value
                            )
                          }
                          maxLength={50}
                          className={`border-b w-full pr-10 ${contentState.products[selectedProductIndex].timeline
                            .length >= 50
                            ? "border-red-500"
                            : ""
                            }`}
                        />
                        <div
                          className={`absolute right-0 top-1/2 transform -translate-y-1/2 text-xs ${contentState.products[selectedProductIndex].timeline
                            .length >= 50
                            ? "text-red-500 font-bold"
                            : contentState.products[selectedProductIndex]
                              .timeline.length > 40
                              ? "text-red-500"
                              : "text-gray-400"
                            }`}
                        >
                          {contentState.products[selectedProductIndex].timeline
                            .length >= 50
                            ? "MAX"
                            : `${contentState.products[selectedProductIndex].timeline.length}/50`}
                        </div>
                      </div>
                    ) : (
                      <p>
                        {contentState.products[selectedProductIndex].timeline}
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
