import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Calendar, User, ArrowRight, ZoomIn } from "lucide-react";
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

  // Cropping states
  const [showCropper, setShowCropper] = useState(false);
  const [croppingIndex, setCroppingIndex] = useState<number | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  // rotation removed due to artifacts (use zoom + crop only)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);

  // Merged all state into a single object
  const [blogSection, setBlogSection] = useState(blogData);

  // Add this useEffect to notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(blogSection);
    }
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

  // Handle blog image selection - now opens cropper
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

    if (!ctx) throw new Error("Canvas 2D context not available");

    // Set canvas size to the crop size
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // Draw the selected area directly -- rotation intentionally removed
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

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("Failed to create image blob"));

          const fileName = originalFile
            ? `cropped-blog-${croppingIndex}-${originalFile.name}`
            : `cropped-blog-modal-${Date.now()}.jpg`;

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

  // Apply crop and set pending file
  const applyCrop = async () => {
    try {
      if (!imageToCrop || !croppedAreaPixels) return;

      const { file, previewUrl } = await getCroppedImg(
        imageToCrop,
        croppedAreaPixels
      );

      // Update preview immediately with blob URL (temporary)
      if (croppingIndex !== null) {
        setBlogSection((prev) => ({
          ...prev,
          posts: prev.posts.map((p, i) =>
            i === croppingIndex ? { ...p, image: previewUrl } : p
          ),
        }));
        setPendingImages((prev) => ({ ...prev, [croppingIndex]: file }));
      } else if (selectedPost) {
        setSelectedPost((s: any) => ({ ...s, image: previewUrl }));
        setPendingImages((prev) => ({ ...prev, modal: file }));
      }

      console.log("Blog image cropped, file ready for upload:", file);
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
  };

  // Reset zoom and rotation
  const resetCropSettings = () => {
    setZoom(1);
    setCrop({ x: 0, y: 0 });
  };

  // Save handler - uploads all pending images
  const handleSave = async () => {
    try {
      setIsUploading(true);

      // Upload all pending images
      for (const [indexStr, file] of Object.entries(pendingImages)) {
        const index = indexStr === "modal" ? null : parseInt(indexStr);

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
        formData.append("sectionName", "blog");
        formData.append(
          "imageField",
          index !== null ? `posts[${index}].image` : "modal.image" + Date.now()
        );
        formData.append("templateSelection", templateSelection);

        console.log("Uploading blog image to S3:", file);

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
          if (index !== null) {
            setBlogSection((prev) => ({
              ...prev,
              posts: prev.posts.map((p, i) =>
                i === index ? { ...p, image: uploadData.imageUrl } : p
              ),
            }));
          }
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
      toast.success("Blog section saved with S3 URLs!");
    } catch (error) {
      console.error("Error saving blog section:", error);
      toast.error("Error saving changes. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      {/* Image Cropper Modal - Same as Hero */}
      {showCropper && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/90 z-[99999999] flex items-center justify-center p-2 sm:p-3"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl max-w-4xl w-full max-h-[86vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-2 border-b border-gray-200 sm:p-3 bg-gray-50">
              <h3 className="text-base font-semibold text-gray-800">
                Crop Image
              </h3>
              <button
                onClick={cancelCrop}
                className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Cropper Area - Fully Responsive */}
            <div className="relative flex-1 bg-gray-900">
              <div className="relative w-full h-[44vh] sm:h-[50vh] md:h-[56vh] lg:h-[60vh]">
                <Cropper
                  image={imageToCrop || undefined}
                  crop={crop}
                  zoom={zoom}
                  aspect={4 / 3}
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
            <div className="p-2 border-t border-gray-200 sm:p-3 bg-gray-50">
              <div className="grid grid-cols-2 gap-2">
                {/* Zoom Control */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-gray-700">
                      <ZoomIn className="w-4 h-4" /> Zoom
                    </span>
                    <span className="text-gray-600">{zoom.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer 
              [&::-webkit-slider-thumb]:appearance-none 
              [&::-webkit-slider-thumb]:h-3.5 
              [&::-webkit-slider-thumb]:w-3.5 
              [&::-webkit-slider-thumb]:rounded-full 
              [&::-webkit-slider-thumb]:bg-blue-500"
                  />
                </div>

                {/* Rotation removed - use zoom + crop only */}
              </div>

              {/* Action Buttons - Equal Width & Responsive */}
              <div className="grid grid-cols-1 gap-2 mt-3 sm:grid-cols-3">
                <button
                  onClick={resetCropSettings}
                  className="w-full border border-gray-300 text-gray-700 hover:bg-gray-100 rounded py-1.5 text-sm"
                >
                  Reset
                </button>

                <button
                  onClick={cancelCrop}
                  className="w-full border border-gray-300 text-gray-700 hover:bg-gray-100 rounded py-1.5 text-sm"
                >
                  Cancel
                </button>

                <button
                  onClick={applyCrop}
                  className="w-full bg-green-600 hover:bg-green-700 text-white rounded py-1.5 text-sm"
                >
                  Apply Crop
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      {/* Main Blog Section */}
      <section id="blog" className="py-20 bg-background theme-transition">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Edit/Save Buttons */}
          <div className="flex justify-end mt-6">
            {isEditing ? (
              <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ y: -1, scaleX: 1.1 }}
                onClick={handleSave}
                disabled={isUploading}
                className={`${
                  isUploading
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
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center px-4 py-2 mb-6 rounded-full bg-primary/10 text-primary"
              whileHover={{ scale: 1.05 }}
            >
              {isEditing ? (
                <input
                  type="text"
                  value={blogSection.header.badge}
                  onChange={(e) =>
                    setBlogSection((prev) => ({
                      ...prev,
                      header: { ...prev.header, badge: e.target.value },
                    }))
                  }
                  className="font-medium text-center bg-transparent border-b"
                />
              ) : (
                <span className="text-lg font-semibold">
                  {blogSection.header.badge}
                </span>
              )}
            </motion.div>

            {isEditing ? (
              <input
                type="text"
                value={blogSection.header.title}
                onChange={(e) =>
                  setBlogSection((prev) => ({
                    ...prev,
                    header: { ...prev.header, title: e.target.value },
                  }))
                }
                className="w-full mb-6 text-3xl font-bold text-center bg-transparent border-b md:text-4xl text-foreground"
              />
            ) : (
              <h2 className="mb-6 text-3xl md:text-4xl text-foreground">
                {blogSection.header.title}
              </h2>
            )}

            {isEditing ? (
              <textarea
                value={blogSection.header.desc}
                onChange={(e) =>
                  setBlogSection((prev) => ({
                    ...prev,
                    header: { ...prev.header, desc: e.target.value },
                  }))
                }
                className="w-full max-w-2xl mx-auto text-lg text-center bg-transparent border-b text-muted-foreground"
                rows={2}
              />
            ) : (
              <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
                {blogSection.header.desc}
              </p>
            )}
          </motion.div>

          {/* Blog Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {displayedPosts.map((post, index) => (
              <motion.article
                key={post.id}
                className="flex flex-col h-full overflow-hidden transition-all duration-300 border-2 shadow-lg cursor-pointer bg-card rounded-xl hover:shadow-xl shadow-gray-500 group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                {/* Image */}
                <div className="relative flex-shrink-0 h-48 overflow-hidden">
                  <ImageWithFallback
                    src={post.image}
                    alt={post.title}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                  />
                  {isEditing && (
                    <motion.div
                      animate={{ scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="absolute p-1 rounded bottom-2 left-2 bg-white/80"
                    >
                      <input
                        type="file"
                        accept="image/*"
                        className="w-full text-xs cursor-pointer"
                        onChange={(e) => handleBlogImageSelect(index, e)}
                      />
                      {pendingImages[index] && (
                        <p className="mt-1 text-xs text-green-600">
                          ✓ Image cropped and ready to upload
                        </p>
                      )}
                    </motion.div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary text-primary-foreground">
                      {isEditing ? (
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
                          className="text-xs font-medium bg-transparent border-b text-primary-foreground"
                        />
                      ) : (
                        post.category
                      )}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-grow p-6">
                  <div className="flex items-center flex-shrink-0 mb-3 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3 mr-1" />
                    {isEditing ? (
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
                        className="mr-4 text-xs bg-transparent border-b text-muted-foreground"
                      />
                    ) : (
                      <span className="mr-4 text-xs text-muted-foreground">
                        {post.date}
                      </span>
                    )}
                    <User className="w-3 h-3 mr-1" />
                    {isEditing ? (
                      <input
                        value={post.author}
                        onChange={(e) =>
                          setBlogSection((prev) => ({
                            ...prev,
                            posts: prev.posts.map((p, i) =>
                              i === index ? { ...p, author: e.target.value } : p
                            ),
                          }))
                        }
                        className="text-xs bg-transparent border-b text-muted-foreground"
                      />
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        {post.author}
                      </span>
                    )}
                  </div>

                  <div className="flex-grow mb-4">
                    {isEditing ? (
                      <>
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
                          className="font-semibold text-card-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2 w-full border-b bg-transparent min-h-[3rem]"
                        />
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
                          className="text-muted-foreground text-sm line-clamp-3 w-full border-b bg-transparent min-h-[4.5rem]"
                        />
                      </>
                    ) : (
                      <>
                        <h3 className="font-semibold text-card-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2 min-h-[3rem]">
                          {post.title}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-3 min-h-[4.5rem]">
                          {post.excerpt}
                        </p>
                      </>
                    )}
                  </div>

                  <div className="mt-auto">
                    <motion.button
                      className="flex items-center justify-center w-full gap-2 py-2 font-medium transition-all duration-300 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
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
                        className="w-full mt-2 hover:scale-105"
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
              className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            >
              <motion.div
                className="bg-card relative top-[3.5rem] shadow-2xl rounded-xl max-w-4xl  w-full max-h-[75vh] overflow-y-auto"
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
                    className="object-cover w-full h-64"
                  />
                  <button
                    onClick={closeModal}
                    className="absolute flex items-center justify-center w-8 h-8 transition-colors bg-white rounded-full shadow-md top-4 right-4 hover:bg-gray-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 text-sm font-medium rounded-full bg-primary text-primary-foreground">
                      {isEditing ? (
                        <input
                          value={selectedPost.category}
                          onChange={(e) =>
                            setSelectedPost((s: any) => ({
                              ...s,
                              category: e.target.value,
                            }))
                          }
                          className="text-sm font-medium bg-transparent border-b text-primary-foreground"
                        />
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
                  <div className="flex items-center mb-4 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-1" />
                    {isEditing ? (
                      <input
                        value={selectedPost.date}
                        onChange={(e) =>
                          setSelectedPost((s: any) => ({
                            ...s,
                            date: e.target.value,
                          }))
                        }
                        className="mr-6 text-sm bg-transparent border-b text-muted-foreground"
                      />
                    ) : (
                      <span className="mr-6 text-sm text-muted-foreground">
                        {selectedPost.date}
                      </span>
                    )}

                    <User className="w-4 h-4 mr-1" />
                    {isEditing ? (
                      <input
                        value={selectedPost.author}
                        onChange={(e) =>
                          setSelectedPost((s: any) => ({
                            ...s,
                            author: e.target.value,
                          }))
                        }
                        className="mr-6 text-sm bg-transparent border-b text-muted-foreground"
                      />
                    ) : (
                      <span className="mr-6 text-sm text-muted-foreground">
                        {selectedPost.author}
                      </span>
                    )}
                  </div>

                  {isEditing ? (
                    <>
                      <input
                        value={selectedPost.title}
                        onChange={(e) =>
                          setSelectedPost((s: any) => ({
                            ...s,
                            title: e.target.value,
                          }))
                        }
                        className="w-full mb-4 text-2xl font-bold bg-transparent border-b text-card-foreground"
                      />

                      <textarea
                        value={selectedPost.content}
                        onChange={(e) =>
                          setSelectedPost((s: any) => ({
                            ...s,
                            content: e.target.value,
                          }))
                        }
                        className="w-full h-48 p-2 mb-4 prose bg-transparent border prose-gray max-w-none text-card-foreground"
                      />

                      <div className="mb-4">
                        <label className="block mb-1 text-sm">
                          Change Image
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleBlogImageSelect(null, e)}
                          className="text-sm"
                        />
                        {pendingImages["modal"] && (
                          <p className="mt-1 text-xs text-green-600">
                            ✓ Image cropped and ready to upload
                          </p>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 className="mb-6 text-2xl font-bold text-card-foreground">
                        {selectedPost.title}
                      </h2>
                      <div
                        className="prose prose-gray max-w-none text-card-foreground"
                        dangerouslySetInnerHTML={{
                          __html: selectedPost.content,
                        }}
                      />
                    </>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t">
                  {isEditing && (
                    <Button
                      onClick={() => saveModalChanges()}
                      className="text-white bg-green-600"
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
