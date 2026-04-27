// Blog.tsx - Full Updated Code with Enhanced Cropping Logic
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Calendar, User, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { toast } from "react-toastify";
import Cropper from "react-easy-crop";

export default function Blog({
  blogData,
  onStateChange,
  userId,
  publishedId,
  templateSelection,
}) {
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAllPosts, setShowAllPosts] = useState(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [pendingImages, setPendingImages] = useState<Record<number, File>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Cropping states - ENHANCED WITH GALLERY LOGIC
  const [showCropper, setShowCropper] = useState(false);
  const [croppingIndex, setCroppingIndex] = useState<number | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [mediaSize, setMediaSize] = useState<{ width: number; height: number; naturalWidth: number; naturalHeight: number } | null>(null);
  const [cropAreaSize, setCropAreaSize] = useState<{ width: number; height: number } | null>(null);
  const [minZoomDynamic, setMinZoomDynamic] = useState(0.1);
  const [isDragging, setIsDragging] = useState(false);
  const PAN_STEP = 10;

  const [prevZoom, setPrevZoom] = useState(1);

  // Track initial state to detect changes
  const initialBlogState = useRef(null);

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

  // Merged all state into a single object
  const [blogSection, setBlogSection] = useState(() => {
    const initialState = blogData || {
      header: {
        badge: "Our Blog",
        title: "Latest Insights & Updates",
        desc: "Stay updated with the latest industry trends, company news, and expert insights from our team."
      },
      posts: [
        {
          id: 1,
          title: "The Future of Digital Transformation",
          excerpt: "Exploring how digital transformation is reshaping industries and creating new opportunities for growth and innovation.",
          image: "https://images.unsplash.com/photo-1552664730-d307ca884978?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1lZXRpbmd8ZW58MXx8fHwxNzU1NjE5MDEzfDA&ixlib=rb-4.1.0&q=80&w=400",
          category: "Technology",
          date: "March 15, 2024",
          author: "Sarah Johnson",
          content: "<p>Digital transformation is no longer just a buzzword—it's a fundamental shift in how businesses operate and deliver value to customers. In this post, we explore the key trends shaping the future of digital transformation and how companies can adapt to stay competitive.</p>"
        },
        // ... more default posts
      ]
    };
    initialBlogState.current = initialState;
    return initialState;
  });

  // Add this useEffect to notify parent of state changes immediately
  useEffect(() => {
    if (onStateChange) {
      onStateChange(blogSection);
    }

    // Check if there are any changes from initial state
    const hasChanges = JSON.stringify(blogSection) !== JSON.stringify(initialBlogState.current);
    setHasUnsavedChanges(hasChanges);
  }, [blogSection, onStateChange]);

  const displayedPosts = showAllPosts
    ? blogSection.posts
    : blogSection.posts.slice(0, 4);

  const openModal = (post: any) => {
    setSelectedPost({ ...post });
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
    document.body.style.overflow = "auto";
  };

  const saveModalChanges = () => {
    if (!selectedPost) return;
    setBlogSection((prev) => ({
      ...prev,
      posts: prev.posts.map((p) =>
        p.id === selectedPost.id ? selectedPost : p
      ),
    }));
    setIsModalOpen(false);
    setSelectedPost(null);
    document.body.style.overflow = "auto";
  };

  // NEW: Function to upload image to AWS
  const uploadImageToAWS = async (file, imageField) => {
    if (!userId || !publishedId || !templateSelection) {
      console.error("Missing required props:", {
        userId,
        publishedId,
        templateSelection,
      });
      toast.error("Missing user information. Please refresh and try again.");
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("sectionName", "blog");
    formData.append("imageField", `${imageField}_${Date.now()}`);
    formData.append("templateSelection", templateSelection);

    console.log(`Uploading ${imageField} to S3:`, file);

    try {
      const uploadResponse = await fetch(
        `https://o66ziwsye5.execute-api.ap-south-1.amazonaws.com/prod/upload-image/${userId}/${publishedId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (uploadResponse.ok) {
        const uploadData = await uploadResponse.json();
        console.log(`${imageField} uploaded to S3:`, uploadData.imageUrl);
        return uploadData.imageUrl;
      } else {
        const errorData = await uploadResponse.json();
        console.error(`${imageField} upload failed:`, errorData);
        toast.error(
          `${imageField} upload failed: ${errorData.message || "Unknown error"}`
        );
        return null;
      }
    } catch (error) {
      console.error(`Error uploading ${imageField}:`, error);
      toast.error(`Error uploading image. Please try again.`);
      return null;
    }
  };

  // Handle blog image selection - UPDATED WITH GALLERY LOGIC
  const handleBlogImageSelect = async (
    index: number | null,
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
      setZoom(1);
      setCrop({ x: 0, y: 0 });
    };
    reader.readAsDataURL(file);

    // Clear the file input
    e.target.value = "";
  };

  // Cropper functions - FROM GALLERY
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Helper function to create image element - FROM GALLERY
  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  // Function to get cropped image - UPDATED WITH FIXED 4:3 RATIO
  const getCroppedImg = async (imageSrc, pixelCrop) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Fixed output size for 4:3 ratio - SAME AS GALLERY
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
          const pngName = originalFile
            ? `cropped-blog-${croppingIndex}-${originalFile.name.replace(/\.[^.]+$/, "")}.png`
            : `cropped-blog-modal-${Date.now()}.png`;

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

  // Apply crop and UPLOAD IMMEDIATELY to AWS - UPDATED
  const applyCrop = async () => {
    try {
      if (!imageToCrop || !croppedAreaPixels) return;

      setIsUploading(true);

      const { file, previewUrl } = await getCroppedImg(
        imageToCrop,
        croppedAreaPixels
      );

      // Show preview immediately with blob URL (temporary)
      if (croppingIndex !== null) {
        setBlogSection((prev) => ({
          ...prev,
          posts: prev.posts.map((p, i) =>
            i === croppingIndex ? { ...p, image: previewUrl } : p
          ),
        }));
      } else if (selectedPost) {
        setSelectedPost((s: any) => ({ ...s, image: previewUrl }));
      }

      // UPLOAD TO AWS IMMEDIATELY
      const imageField = croppingIndex !== null ? `posts[${croppingIndex}].image` : "modal.image";
      const awsImageUrl = await uploadImageToAWS(file, imageField);

      if (awsImageUrl) {
        // Update with actual S3 URL
        if (croppingIndex !== null) {
          setBlogSection((prev) => ({
            ...prev,
            posts: prev.posts.map((p, i) =>
              i === croppingIndex ? { ...p, image: awsImageUrl } : p
            ),
          }));
        } else if (selectedPost) {
          setSelectedPost((s: any) => ({ ...s, image: awsImageUrl }));
        }

        // Remove from pending images since it's uploaded
        setPendingImages((prev) => {
          const newPending = { ...prev };
          if (croppingIndex !== null) {
            delete newPending[croppingIndex];
          } else {
            delete newPending["modal"];
          }
          return newPending;
        });

        toast.success("Image cropped and uploaded to AWS successfully!");
      } else {
        // If upload fails, keep the preview URL and set as pending
        if (croppingIndex !== null) {
          setPendingImages((prev) => ({ ...prev, [croppingIndex]: file }));
        } else {
          setPendingImages((prev) => ({ ...prev, modal: file }));
        }
        toast.warning("Image cropped but upload failed. It will be saved locally.");
      }

      setShowCropper(false);
      setImageToCrop(null);
      setOriginalFile(null);
      setCroppingIndex(null);
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
    setCroppingIndex(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  // Reset zoom and rotation - UPDATED
  const resetCropSettings = () => {
    setZoom(1);
    setCrop({ x: 0, y: 0 });
  };

  // Handle cancel editing
  const handleCancel = () => {
    // Reset to initial state
    setBlogSection(initialBlogState.current);
    setPendingImages({});
    setHasUnsavedChanges(false);
    setIsEditing(false);
  };

  // Save handler - only handles text changes and failed uploads now
  const handleSave = async () => {
    try {
      setIsUploading(true);

      // Upload any pending images that failed during automatic upload
      for (const [indexStr, file] of Object.entries(pendingImages)) {
        const index = indexStr === "modal" ? null : parseInt(indexStr);

        const imageField = index !== null ? `posts[${index}].image` : "modal.image";
        const awsImageUrl = await uploadImageToAWS(file, imageField);

        if (awsImageUrl) {
          // Replace local preview with S3 URL
          if (index !== null) {
            setBlogSection((prev) => ({
              ...prev,
              posts: prev.posts.map((p, i) =>
                i === index ? { ...p, image: awsImageUrl } : p
              ),
            }));
          }
        } else {
          toast.error(`Failed to upload image for post ${indexStr}`);
          return;
        }
      }

      // Update initial state reference to current state
      initialBlogState.current = blogSection;
      setHasUnsavedChanges(false);

      // Clear pending images
      setPendingImages({});
      // Exit edit mode
      setIsEditing(false);
      toast.success("Blog section saved!");
    } catch (error) {
      console.error("Error saving blog section:", error);
      toast.error("Error saving changes. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      {/* Image Cropper Modal - UPDATED WITH GALLERY STYLING AND LOGIC */}
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
              <h3 className="text-lg font-semibold text-gray-800">
                Crop Blog Image (4:3 Ratio)
              </h3>
              <button
                onClick={cancelCrop}
                className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Cropper Area */}
            <div className={`flex-1 relative bg-gray-900 min-h-0 ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}>
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                aspect={4 / 3} // ✅ FIXED 4:3 ASPECT RATIO LIKE GALLERY
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
                showGrid={true} // ✅ Better alignment like Gallery
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
                  className={`w-full ${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white rounded py-2 text-sm font-medium`}
                >
                  {isUploading ? "Uploading..." : "Apply Crop"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Main Blog Section */}
      <section id="blog" className=" bg-background theme-transition">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Edit/Save Buttons */}
          <div className="flex justify-end mt-6 gap-2">
            {isEditing ? (
              <>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ y: -1, scaleX: 1.05 }}
                  onClick={handleCancel}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded shadow-xl hover:font-semibold"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ y: -1, scaleX: 1.1 }}
                  onClick={handleSave}
                  disabled={isUploading}
                  className={`${isUploading
                    ? "bg-gray-400 cursor-not-allowed"
                    : hasUnsavedChanges || Object.keys(pendingImages).length > 0
                      ? "bg-green-600 hover:shadow-2xl"
                      : "bg-gray-400 cursor-not-allowed"
                    } text-white px-4 py-2 rounded shadow-xl hover:font-semibold`}
                >
                  {isUploading ? "Uploading..." : "Save"}
                </motion.button>
              </>
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

          {/* Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >

            {isEditing ? (
              <motion.div
                className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <div className="relative">
                  <input
                    type="text"
                    value={blogSection.header.badge}
                    onChange={(e) =>
                      setBlogSection((prev) => ({
                        ...prev,
                        header: { ...prev.header, badge: e.target.value },
                      }))
                    }
                    maxLength={25}
                    className={`font-medium bg-transparent border-b text-center ${blogSection.header.badge.length >= 25
                      ? "border-red-500"
                      : ""
                      }`}
                  />
                  <div className="text-right text-xs text-gray-500 mt-1">
                    {blogSection.header.badge.length}/25
                    {blogSection.header.badge.length >= 25 && (
                      <span className="ml-2 text-red-500 font-bold">
                        Limit reached!
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>

            ) : (
              blogSection.header.badge.length > 0 && (
                <motion.div
                  className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary mb-6"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="font-semibold text-lg">
                    {blogSection.header.badge}
                  </span>
                </motion.div>
              )
            )}

            {isEditing ? (
              <div className="relative">
                <input
                  type="text"
                  value={blogSection.header.title}
                  onChange={(e) =>
                    setBlogSection((prev) => ({
                      ...prev,
                      header: { ...prev.header, title: e.target.value },
                    }))
                  }
                  maxLength={80}
                  className={`text-3xl md:text-4xl text-foreground mb-6 w-full text-center bg-transparent border-b font-bold ${blogSection.header.title.length >= 80
                    ? "border-red-500"
                    : ""
                    }`}
                />
                <div className="text-right text-xs text-gray-500 mt-1">
                  {blogSection.header.title.length}/80
                  {blogSection.header.title.length >= 80 && (
                    <span className="ml-2 text-red-500 font-bold">
                      Limit reached!
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <h2 className="text-3xl md:text-4xl text-foreground mb-6">
                {blogSection.header.title}
              </h2>
            )}

            {isEditing ? (
              <div className="relative">
                <textarea
                  value={blogSection.header.desc}
                  onChange={(e) =>
                    setBlogSection((prev) => ({
                      ...prev,
                      header: { ...prev.header, desc: e.target.value },
                    }))
                  }
                  maxLength={200}
                  className={`text-lg text-muted-foreground max-w-2xl mx-auto w-full text-center bg-transparent border-b ${blogSection.header.desc.length >= 200
                    ? "border-red-500"
                    : ""
                    }`}
                  rows={2}
                />
                <div className="text-right text-xs text-gray-500 mt-1">
                  {blogSection.header.desc.length}/200
                  {blogSection.header.desc.length >= 200 && (
                    <span className="ml-2 text-red-500 font-bold">
                      Limit reached!
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-center">
                {blogSection.header.desc}
              </p>
            )}
          </motion.div>

          {/* Blog Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayedPosts.map((post, index) => (
              <motion.article
                key={post.id}
                className="bg-card rounded-xl border-2 shadow-lg hover:shadow-xl  shadow-gray-500 transition-all duration-300 overflow-hidden group cursor-pointer flex flex-col h-full"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden flex-shrink-0">
                  <ImageWithFallback
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Category at the top */}
                  <div className="absolute top-2 left-2">
                    <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                      {isEditing ? (
                        <div className="relative">
                          <input
                            value={post.category}
                            onChange={(e) =>
                              setBlogSection((prev) => ({
                                ...prev,
                                posts: prev.posts.map((p, i) =>
                                  i === index
                                    ? { ...p, category: e.target.value }
                                    : p
                                ),
                              }))
                            }
                            maxLength={40}
                            className={`text-xs font-medium text-primary-foreground bg-transparent border-b ${post.category.length >= 40 ? "border-red-500" : ""
                              }`}
                          />
                          <div className="text-right text-xs text-gray-500 mt-1">
                            {post.category.length}/40
                            {post.category.length >= 40 && (
                              <span className="ml-2 text-red-500 font-bold">
                                Limit reached!
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        post.category
                      )}
                    </span>
                  </div>

                  {isEditing && (
                    <motion.div
                      animate={{ scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="absolute bottom-2 left-2 right-2 bg-white/80 p-2 rounded z-50"
                    >
                      {/* Recommendation text connected with select image */}
                      <div className="text-xs text-gray-600 mb-1 text-center">
                        Recommended: 600×450px (4:3 ratio)
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="text-xs font-bold w-full cursor-pointer text-center"
                        onChange={(e) => handleBlogImageSelect(index, e)}
                      />
                      {pendingImages[index] && (
                        <p className="text-xs text-green-600 mt-1 text-center">
                          ✓ Image cropped and ready to upload
                        </p>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center text-xs text-muted-foreground mb-3 flex-shrink-0">
                    <Calendar className="w-3 h-3 mr-1" />
                    {isEditing ? (
                      <div className="relative mr-4">
                        <input
                          value={post.date}
                          onChange={(e) =>
                            setBlogSection((prev) => ({
                              ...prev,
                              posts: prev.posts.map((p, i) =>
                                i === index ? { ...p, date: e.target.value } : p
                              ),
                            }))
                          }
                          maxLength={20}
                          className={`text-xs text-muted-foreground bg-transparent border-b ${post.date.length >= 20 ? "border-red-500" : ""
                            }`}
                        />
                        <div className="text-right text-xs text-gray-500 mt-1">
                          {post.date.length}/20
                          {post.date.length >= 20 && (
                            <span className="ml-2 text-red-500 font-bold">
                              Limit reached!
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground mr-4">
                        {post.date}
                      </span>
                    )}
                    <User className="w-3 h-3 mr-1" />
                    {isEditing ? (
                      <div className="relative">
                        <input
                          value={post.author}
                          onChange={(e) =>
                            setBlogSection((prev) => ({
                              ...prev,
                              posts: prev.posts.map((p, i) =>
                                i === index
                                  ? { ...p, author: e.target.value }
                                  : p
                              ),
                            }))
                          }
                          maxLength={30}
                          className={`text-xs text-muted-foreground bg-transparent border-b ${post.author.length >= 30 ? "border-red-500" : ""
                            }`}
                        />
                        <div className="text-right text-xs text-gray-500 mt-1">
                          {post.author.length}/30
                          {post.author.length >= 30 && (
                            <span className="ml-2 text-red-500 font-bold">
                              Limit reached!
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        {post.author}
                      </span>
                    )}
                  </div>

                  <div className="flex-grow mb-4">
                    {isEditing ? (
                      <>
                        <div className="relative mb-3">
                          <input
                            value={post.title}
                            onChange={(e) =>
                              setBlogSection((prev) => ({
                                ...prev,
                                posts: prev.posts.map((p, i) =>
                                  i === index
                                    ? { ...p, title: e.target.value }
                                    : p
                                ),
                              }))
                            }
                            maxLength={100}
                            className={`font-semibold text-card-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2 w-full border-b bg-transparent min-h-[3rem] ${post.title.length >= 100 ? "border-red-500" : ""
                              }`}
                          />
                          <div className="text-right text-xs text-gray-500 mt-1">
                            {post.title.length}/100
                            {post.title.length >= 100 && (
                              <span className="ml-2 text-red-500 font-bold">
                                Limit reached!
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="relative">
                          <textarea
                            value={post.excerpt}
                            onChange={(e) =>
                              setBlogSection((prev) => ({
                                ...prev,
                                posts: prev.posts.map((p, i) =>
                                  i === index
                                    ? { ...p, excerpt: e.target.value }
                                    : p
                                ),
                              }))
                            }
                            maxLength={200}
                            className={`text-muted-foreground text-sm line-clamp-3 w-full border-b bg-transparent min-h-[4.5rem] ${post.excerpt.length >= 200 ? "border-red-500" : ""
                              }`}
                          />
                          <div className="text-right text-xs text-gray-500 mt-1">
                            {post.excerpt.length}/200
                            {post.excerpt.length >= 200 && (
                              <span className="ml-2 text-red-500 font-bold">
                                Limit reached!
                              </span>
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <h3 className="font-semibold text-card-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2 min-h-[3rem]">
                          {post.title}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-3 min-h-[4.5rem] text-justify">
                          {post.excerpt}
                        </p>
                      </>
                    )}
                  </div>

                  <div className="mt-auto">
                    <motion.button
                      className="w-full py-2 bg-primary/10 text-primary rounded-lg font-medium flex items-center justify-center gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => openModal(post)}
                    >
                      Read More
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </motion.button>
                    {isEditing && (
                      <Button
                        size="sm"
                        variant="destructive"
                        className="mt-2 w-full hover:scale-105"
                        onClick={() =>
                          setBlogSection((prev) => ({
                            ...prev,
                            posts: prev.posts.filter((_, i) => i !== index),
                          }))
                        }
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}

            {isEditing && (
              <motion.div
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
                className="flex items-center justify-center"
              >
                <Button
                  onClick={() =>
                    setBlogSection((prev) => ({
                      ...prev,
                      posts: [
                        ...prev.posts,
                        {
                          id: Date.now(),
                          title: "New Blog Post",
                          excerpt: "Blog post excerpt...",
                          image: null,
                          category: "New Category",
                          date: "",
                          author: "",
                          content: "<p>Blog content...</p>",
                        },
                      ],
                    }))
                  }
                  className="text-green-600 min-h-[400px] w-full"
                >
                  + Add Blog Post
                </Button>
              </motion.div>
            )}
          </div>

          {/* Show More Button */}
          <div className="flex justify-center mt-6">
            {!showAllPosts && blogSection.posts.length > 4 && (
              <Button onClick={() => setShowAllPosts(true)}>Show More</Button>
            )}
            {showAllPosts && blogSection.posts.length > 4 && (
              <Button
                onClick={() => setShowAllPosts(false)}
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
          {isModalOpen && selectedPost && (
            <motion.div
              className="fixed inset-0 bg-black/20 flex items-center justify-center p-4 z-[99999999999999]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            >
              <motion.div
                className="bg-card relative top-[3.5rem] shadow-2xl rounded-xl max-w-4xl  w-full max-h-[70vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="relative">
                  <ImageWithFallback
                    src={selectedPost.image}
                    alt={selectedPost.title}
                    className="w-full h-64 object-cover"
                  />
                  <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {/* Category at the top in modal */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                      {isEditing ? (
                        <div className="relative">
                          <input
                            value={selectedPost.category}
                            onChange={(e) =>
                              setSelectedPost((s: any) => ({
                                ...s,
                                category: e.target.value,
                              }))
                            }
                            maxLength={20}
                            className={`text-sm font-medium text-primary-foreground bg-transparent border-b ${selectedPost.category.length >= 20
                              ? "border-red-500"
                              : ""
                              }`}
                          />
                          <div className="text-right text-xs text-gray-500 mt-1">
                            {selectedPost.category.length}/20
                            {selectedPost.category.length >= 20 && (
                              <span className="ml-2 text-red-500 font-bold">
                                Limit reached!
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm font-medium text-primary-foreground">
                          {selectedPost.category}
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-8">
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <Calendar className="w-4 h-4 mr-1" />
                    {isEditing ? (
                      <div className="relative mr-6">
                        <input
                          value={selectedPost.date}
                          onChange={(e) =>
                            setSelectedPost((s: any) => ({
                              ...s,
                              date: e.target.value,
                            }))
                          }
                          maxLength={20}
                          className={`text-sm text-muted-foreground bg-transparent border-b ${selectedPost.date.length >= 20
                            ? "border-red-500"
                            : ""
                            }`}
                        />
                        <div className="text-right text-xs text-gray-500 mt-1">
                          {selectedPost.date.length}/20
                          {selectedPost.date.length >= 20 && (
                            <span className="ml-2 text-red-500 font-bold">
                              Limit reached!
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground mr-6">
                        {selectedPost.date}
                      </span>
                    )}

                    <User className="w-4 h-4 mr-1" />
                    {isEditing ? (
                      <div className="relative mr-6">
                        <input
                          value={selectedPost.author}
                          onChange={(e) =>
                            setSelectedPost((s: any) => ({
                              ...s,
                              author: e.target.value,
                            }))
                          }
                          maxLength={30}
                          className={`text-sm text-muted-foreground bg-transparent border-b ${selectedPost.author.length >= 30
                            ? "border-red-500"
                            : ""
                            }`}
                        />
                        <div className="text-right text-xs text-gray-500 mt-1">
                          {selectedPost.author.length}/30
                          {selectedPost.author.length >= 30 && (
                            <span className="ml-2 text-red-500 font-bold">
                              Limit reached!
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground mr-6">
                        {selectedPost.author}
                      </span>
                    )}
                  </div>

                  {isEditing ? (
                    <>
                      <div className="relative mb-4">
                        <input
                          value={selectedPost.title}
                          onChange={(e) =>
                            setSelectedPost((s: any) => ({
                              ...s,
                              title: e.target.value,
                            }))
                          }
                          maxLength={100}
                          className={`text-2xl font-bold text-card-foreground mb-4 w-full bg-transparent border-b ${selectedPost.title.length >= 100
                            ? "border-red-500"
                            : ""
                            }`}
                        />
                        <div className="text-right text-xs text-gray-500 mt-1">
                          {selectedPost.title.length}/100
                          {selectedPost.title.length >= 100 && (
                            <span className="ml-2 text-red-500 font-bold">
                              Limit reached!
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="relative">
                        <textarea
                          value={selectedPost.content}
                          onChange={(e) =>
                            setSelectedPost((s: any) => ({
                              ...s,
                              content: e.target.value,
                            }))
                          }
                          maxLength={5000}
                          className={`prose prose-gray max-w-none text-card-foreground w-full h-48 mb-4 border bg-transparent p-2 ${selectedPost.content.length >= 5000
                            ? "border-red-500"
                            : ""
                            }`}
                        />
                        <div className="text-right text-xs text-gray-500 mt-1">
                          {selectedPost.content.length}/5000
                          {selectedPost.content.length >= 5000 && (
                            <span className="ml-2 text-red-500 font-bold">
                              Limit reached!
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="text-xs text-gray-600 mb-1">
                          Recommended: 600×450px (4:3 ratio)
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleBlogImageSelect(null, e)}
                          className="text-sm"
                        />
                        {pendingImages["modal"] && (
                          <p className="text-xs text-green-600 mt-1">
                            ✓ Image cropped and ready to upload
                          </p>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold text-card-foreground mb-6">
                        {selectedPost.title}
                      </h2>
                      <div
                        className="prose prose-gray max-w-none text-card-foreground text-justify"
                        dangerouslySetInnerHTML={{
                          __html: selectedPost.content,
                        }}
                        // {selectedPost.map((post: any) => post.content)}
                      />
                    </>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t">
                  {isEditing && (
                    <Button
                      onClick={() => saveModalChanges()}
                      className="bg-green-600 text-white"
                    >
                      Save Changes
                    </Button>
                  )}
                  <Button variant="secondary" onClick={closeModal}>
                    {isEditing ? "Close (Discard)" : "Close"}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </>
  );
}