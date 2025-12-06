import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "./ui/card";
import { Star, X, ZoomIn } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { toast } from "react-toastify";
import Cropper from "react-easy-crop";
import user from "/images/user.png"

export default function Testimonials({
  testimonialsData,
  onStateChange,
  userId,
  publishedId,
  templateSelection,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Cropping states for testimonial images
  const [showCropper, setShowCropper] = useState(false);
  const [croppingFor, setCroppingFor] = useState(null); // { index, field }
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(4 / 3);

  // Dynamic zoom calculation states
  const [mediaSize, setMediaSize] = useState<{
    width: number;
    height: number;
    naturalWidth: number;
    naturalHeight: number;
  } | null>(null);
  const [cropAreaSize, setCropAreaSize] = useState<{ width: number; height: number } | null>(null);
  const [minZoomDynamic, setMinZoomDynamic] = useState(0.5);
  const [prevZoom, setPrevZoom] = useState(1);

  // Text field limits
  const TEXT_LIMITS = {
    headlineTitle: 60,
    headlineDescription: 120,
    testimonialQuote: 300,
    testimonialName: 40,
    testimonialRole: 60,
  };

  // Pending images for upload
  const [pendingTestimonialImages, setPendingTestimonialImages] = useState({});

  // Merged all state into a single object
  const [testimonialsSection, setTestimonialsSection] =
    useState(testimonialsData);

  // Add this useEffect to notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(testimonialsSection);
    }
  }, [testimonialsSection, onStateChange]);

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

  // Track previous zoom only (no auto recentre to allow free panning)
  useEffect(() => {
    setPrevZoom(zoom);
  }, [zoom]);

  // Handlers for testimonials
  const updateTestimonial = (idx, field, value) => {
    setTestimonialsSection((prev) => ({
      ...prev,
      testimonials: prev.testimonials.map((t, i) =>
        i === idx ? { ...t, [field]: value } : t
      ),
    }));
  };

  const removeTestimonial = (idx) => {
    setTestimonialsSection((prev) => ({
      ...prev,
      testimonials: prev.testimonials.filter((_, i) => i !== idx),
    }));
  };

  const addTestimonial = () => {
    setTestimonialsSection((prev) => ({
      ...prev,
      testimonials: [
        ...prev.testimonials,
        {
          name: "New Client",
          role: "Role, Company",
          image: "",
          quote: "New testimonial...",
          rating: 5,
        },
      ],
    }));
  };

  // Image selection handler for testimonials
  const handleTestimonialImageSelect = (e, index) => {
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
      setCroppingFor({ index, field: "image" });
      setShowCropper(true);
      setAspectRatio(4 / 3); // Default to 4:3 for testimonials
      // Reset crop settings
      setCrop({ x: 0, y: 0 });
      setZoom(1);
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
  const getCroppedImg = async (imageSrc, pixelCrop) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Set canvas size to the desired crop size
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // Draw the cropped image
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
          // Create a proper file with original file name or generate one
          const fileName = originalFile
            ? `cropped-${originalFile.name}`
            : `cropped-testimonial-${Date.now()}.jpg`;

          const file = new File([blob], fileName, {
            type: "image/jpeg",
            lastModified: Date.now(),
          });

          // Create object URL for preview
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

  // Apply crop for testimonial image
  const applyCrop = async () => {
    try {
      if (!imageToCrop || !croppedAreaPixels || !croppingFor) {
        toast.error("Please select an area to crop");
        return;
      }

      const { file, previewUrl } = await getCroppedImg(
        imageToCrop,
        croppedAreaPixels
      );

      // Update preview immediately with blob URL (temporary)
      updateTestimonial(croppingFor.index, croppingFor.field, previewUrl);

      // Set the actual file for upload on save
      setPendingTestimonialImages((prev) => ({
        ...prev,
        [`${croppingFor.index}`]: file,
      }));

      toast.success("Image cropped successfully! Click Save to upload to S3.");
      setShowCropper(false);
      setImageToCrop(null);
      setOriginalFile(null);
      setCroppingFor(null);
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
    setCroppingFor(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  // Reset zoom and rotation
  const resetCropSettings = () => {
    setZoom(1);
    setCrop({ x: 0, y: 0 });
  };

  // Save handler with image upload
  const handleSave = async () => {
    try {
      setIsUploading(true);

      // Upload testimonial images if any
      const uploadPromises = Object.entries(pendingTestimonialImages).map(
        async ([index, file]) => {
          if (!userId || !publishedId || !templateSelection) {
            console.error("Missing required props:", {
              userId,
              publishedId,
              templateSelection,
            });
            throw new Error("Missing user information");
          }

          const formData = new FormData();
          formData.append("file", file);
          formData.append("sectionName", "testimonials");
          formData.append("imageField", `testimonial-${index}-${Date.now()}`);
          formData.append("templateSelection", templateSelection);

          console.log(`Uploading testimonial image ${index} to S3:`, file);

          const uploadResponse = await fetch(
            `https://o66ziwsye5.execute-api.ap-south-1.amazonaws.com/prod/upload-image/${userId}/${publishedId}`,
            {
              method: "POST",
              body: formData,
            }
          );

          if (uploadResponse.ok) {
            const uploadData = await uploadResponse.json();
            // Update with actual S3 URL, not blob URL
            updateTestimonial(parseInt(index), "image", uploadData.imageUrl);
            console.log(
              `Testimonial image ${index} uploaded to S3:`,
              uploadData.imageUrl
            );
            return { index, success: true };
          } else {
            const errorData = await uploadResponse.json();
            console.error(
              `Testimonial image ${index} upload failed:`,
              errorData
            );
            throw new Error(
              `Testimonial image upload failed: ${errorData.message || "Unknown error"
              }`
            );
          }
        }
      );

      if (uploadPromises.length > 0) {
        await Promise.all(uploadPromises);
        toast.success("Testimonial images uploaded to S3 successfully!");
      }

      // Clear pending images
      setPendingTestimonialImages({});

      // Exit edit mode
      setIsEditing(false);
      toast.success("Testimonials section saved!");
    } catch (error) {
      console.error("Error saving testimonials section:", error);
      toast.error("Error saving changes. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Duplicate testimonials for marquee loop (showing 3 at a time)
  const duplicatedTestimonials = [
    ...testimonialsSection.testimonials,
    ...testimonialsSection.testimonials,
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <>
      {/* Image Cropper Modal - Testimonials (Same as Clients) */}
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
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Crop Testimonial Image (4:3 Ratio)
                </h3>
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
                aspect={aspectRatio}
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
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              {/* Aspect Ratio Button - Only 4:3 */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Aspect Ratio:
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setAspectRatio(4 / 3)}
                    className={`px-3 py-2 text-sm rounded border ${aspectRatio === 4 / 3
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-700 border-gray-300"
                      }`}
                  >
                    4:3 (Standard)
                  </button>
                </div>
              </div>

              {/* Zoom Control */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-gray-700">
                    <ZoomIn className="w-4 h-4" />
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
                  className="w-full border border-gray-300 text-gray-700 hover:bg-gray-100 rounded py-2 text-sm"
                >
                  Reset
                </button>
                <button
                  onClick={cancelCrop}
                  className="w-full border border-gray-300 text-gray-700 hover:bg-gray-100 rounded py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={applyCrop}
                  className="w-full bg-green-600 hover:bg-green-700 text-white rounded py-2 text-sm"
                >
                  Apply Crop
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      <motion.section
        id="testimonial"
        className="py-20 bg-background theme-transition"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                className="bg-yellow-500 text-black px-4 py-2 rounded cursor-pointer  hover:shadow-2xl shadow-xl hover:font-semibold"
              >
                Edit
              </motion.button>
            )}
          </div>

          {/* Headline */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {isEditing ? (
              <>
                <div className="relative">
                  <input
                    value={testimonialsSection.headline.title}
                    onChange={(e) =>
                      setTestimonialsSection((prev) => ({
                        ...prev,
                        headline: {
                          ...prev.headline,
                          title: e.target.value,
                        },
                      }))
                    }
                    maxLength={TEXT_LIMITS.headlineTitle}
                    className={`text-3xl md:text-4xl font-bold text-foreground bg-transparent border-b outline-none w-full max-w-2xl mx-auto text-center ${testimonialsSection.headline.title.length >=
                        TEXT_LIMITS.headlineTitle
                        ? "border-red-500"
                        : ""
                      }`}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <div>
                      {testimonialsSection.headline.title.length >=
                        TEXT_LIMITS.headlineTitle && (
                          <span className="text-red-500 font-bold">
                            ⚠️ Character limit reached!
                          </span>
                        )}
                    </div>
                    <div>
                      {testimonialsSection.headline.title.length}/
                      {TEXT_LIMITS.headlineTitle}
                    </div>
                  </div>
                </div>
                <div className="relative mt-4">
                  <textarea
                    value={testimonialsSection.headline.description}
                    onChange={(e) =>
                      setTestimonialsSection((prev) => ({
                        ...prev,
                        headline: {
                          ...prev.headline,
                          description: e.target.value,
                        },
                      }))
                    }
                    maxLength={TEXT_LIMITS.headlineDescription}
                    className={`text-lg text-muted-foreground bg-transparent border-b outline-none w-full max-w-3xl mx-auto text-center ${testimonialsSection.headline.description.length >=
                        TEXT_LIMITS.headlineDescription
                        ? "border-red-500"
                        : ""
                      }`}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <div>
                      {testimonialsSection.headline.description.length >=
                        TEXT_LIMITS.headlineDescription && (
                          <span className="text-red-500 font-bold">
                            ⚠️ Character limit reached!
                          </span>
                        )}
                    </div>
                    <div>
                      {testimonialsSection.headline.description.length}/
                      {TEXT_LIMITS.headlineDescription}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  {testimonialsSection.headline.title}
                </h2>
                <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto text-center">
                  {testimonialsSection.headline.description}
                </p>
              </>
            )}
          </motion.div>

          {/* Testimonials Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {testimonialsSection.testimonials.map((testimonial, idx) => (
              <motion.div key={idx} variants={cardVariants}>
                <Card className="h-full bg-card border-border shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6 h-full flex flex-col">
                    {/* Stars */}
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${i < testimonial.rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                            }`}
                        />
                      ))}
                    </div>

                    {/* Quote */}
                    {isEditing ? (
                      <div className="relative mb-6">
                        <textarea
                          value={testimonial.quote}
                          onChange={(e) =>
                            updateTestimonial(idx, "quote", e.target.value)
                          }
                          maxLength={TEXT_LIMITS.testimonialQuote}
                          className={`flex-1 text-muted-foreground bg-transparent border-b outline-none w-full resize-none min-h-[80px] ${testimonial.quote.length >=
                              TEXT_LIMITS.testimonialQuote
                              ? "border-red-500"
                              : ""
                            }`}
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <div>
                            {testimonial.quote.length >=
                              TEXT_LIMITS.testimonialQuote && (
                                <span className="text-red-500 font-bold">
                                  ⚠️ Character limit reached!
                                </span>
                              )}
                          </div>
                          <div>
                            {testimonial.quote.length}/
                            {TEXT_LIMITS.testimonialQuote}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="flex-1 text-muted-foreground mb-6 text-justify">
                        {testimonial.quote}
                      </p>
                    )}

                    {/* Author */}
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <ImageWithFallback
                          src={testimonial.image || user}
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full object-cover"
                          fallbackSrc="/api/placeholder/48/48"
                        />
                        {isEditing && (
                          <div className="absolute -bottom-1 -right-1">
                            <label className="bg-white border rounded-full p-1 cursor-pointer shadow-sm">
                              <svg
                                className="w-3 h-3 text-gray-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) =>
                                  handleTestimonialImageSelect(e, idx)
                                }
                              />
                            </label>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        {isEditing ? (
                          <>
                            <div className="relative">
                              <input
                                value={testimonial.name}
                                onChange={(e) =>
                                  updateTestimonial(idx, "name", e.target.value)
                                }
                                maxLength={TEXT_LIMITS.testimonialName}
                                className={`font-semibold text-card-foreground bg-transparent border-b outline-none w-full ${testimonial.name.length >=
                                    TEXT_LIMITS.testimonialName
                                    ? "border-red-500"
                                    : ""
                                  }`}
                              />
                              <div className="text-right text-xs text-gray-500 mt-1">
                                {testimonial.name.length}/
                                {TEXT_LIMITS.testimonialName}
                              </div>
                            </div>
                            <div className="relative">
                              <input
                                value={testimonial.role}
                                onChange={(e) =>
                                  updateTestimonial(idx, "role", e.target.value)
                                }
                                maxLength={TEXT_LIMITS.testimonialRole}
                                className={`text-sm text-muted-foreground bg-transparent border-b outline-none w-full ${testimonial.role.length >=
                                    TEXT_LIMITS.testimonialRole
                                    ? "border-red-500"
                                    : ""
                                  }`}
                              />
                              <div className="text-right text-xs text-gray-500 mt-1">
                                {testimonial.role.length}/
                                {TEXT_LIMITS.testimonialRole}
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <h4 className="font-semibold text-card-foreground truncate">
                              {testimonial.name}
                            </h4>
                            <p className="text-sm text-muted-foreground truncate text-justify">
                              {testimonial.role}
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Remove button in edit mode */}
                    {isEditing && (
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        whileHover={{ scale: 1.1 }}
                        onClick={() => removeTestimonial(idx)}
                        className="text-red-500 cursor-pointer text-sm mt-4 self-start"
                      >
                        ✕ Remove
                      </motion.button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Add testimonial button in edit mode */}
            {isEditing && (
              <motion.div
                variants={cardVariants}
                className="flex items-center justify-center"
              >
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.1 }}
                  onClick={addTestimonial}
                  className="w-full h-full min-h-[200px] border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                >
                  <div className="text-2xl mb-2">+</div>
                  <div>Add Testimonial</div>
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.section>
    </>
  );
}
