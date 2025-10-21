import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { Edit2, Save, X, Plus, Trash2, Loader2, Upload } from "lucide-react";
import blog1 from "../public/images/blog/blog1.jpg";
import blog2 from "../public/images/blog/blog2.jpg";
import blog3 from "../public/images/blog/blog3.jpg";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import Cropper from "react-easy-crop";

// Crop helper function (same as in Hero.tsx)
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

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const cardHoverVariants = {
  rest: { y: 0 },
  hover: {
    y: -5,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
};

function BlogModal({ blog, onClose }: { blog: any; onClose: () => void }) {
  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center mt-12 bg-black/70 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto my-auto m-5"
        onClick={(e) => e.stopPropagation()}
        style={{ margin: "1rem" }}
      >
        {/* Close Button - Fixed positioning */}
        <button
          className="absolute -top-0.5 -right-0.5 z-[1010]  hover:bg-gray-600 rounded-full p-2 text-white transition-colors shadow-lg flex items-center justify-center"
          onClick={onClose}
          aria-label="Close modal"
          style={{ width: "32px", height: "32px" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Hero Image */}
        <div className="relative">
          <img
            src={blog.image}
            className="w-full h-48 object-cover rounded-t-xl"
            alt={blog.title}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <div className="flex justify-between items-center">
              <div className="text-white">
                <span className="text-xs bg-indigo-600 px-2 py-1 rounded-full">
                  {blog.category}
                </span>
                <p className="text-xs mt-1 opacity-90">
                  {blog.date} • {blog.readTime || "5 min read"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {blog.title}
          </h1>

          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
            {blog.excerpt}
          </p>

          {/* Blog Outline if available */}
          {blog.outline && blog.outline.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                In this article:
              </h3>
              <ul className="space-y-1 text-sm">
                {blog.outline.map((item: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="text-indigo-600 dark:text-indigo-400 mr-2 mt-1">
                      •
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Main Content */}
          <div className="text-gray-700 dark:text-gray-300 leading-7 space-y-4 text-sm">
            {blog.content ? (
              <div dangerouslySetInnerHTML={{ __html: blog.content }} />
            ) : (
              <>
                <p>
                  Drone technology is rapidly transforming industries across
                  India, offering innovative solutions that were once considered
                  impossible. From agriculture to construction, the applications
                  of drone technology are vast and continually expanding.
                </p>

                <p>
                  In the agricultural sector, drones equipped with multispectral
                  sensors can monitor crop health, detect pest infestations, and
                  optimize irrigation. This technology enables farmers to make
                  data-driven decisions, resulting in increased yields and
                  reduced resource consumption.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                  The Future of Drone Technology
                </h3>

                <p>
                  As regulations evolve and technology advances, we can expect
                  to see even more innovative applications of drones in various
                  sectors. The integration of AI and machine learning with drone
                  technology will further enhance their capabilities, making
                  them indispensable tools for businesses looking to gain a
                  competitive edge.
                </p>
              </>
            )}
          </div>

          {/* Keywords if available */}
          {blog.keywords && blog.keywords.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-xs font-semibold text-gray-900 dark:text-white mb-2">
                Keywords:
              </h4>
              <div className="flex flex-wrap gap-1">
                {blog.keywords.map((keyword: string, index: number) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-xs rounded-full"
                  >
                    #{keyword}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function Blog({
  onStateChange,
  blogData,
  userId,
  publishedId,
  templateSelection,
}: {
  onStateChange: (state: any) => void;
  blogData?: any;
  userId?: string;
  publishedId?: string;
  templateSelection?: string;
}) {
  // Extract data from blogData prop or use defaults
  const defaultContent = {
    header: {
      title: blogData?.header?.title || "Latest Blog Posts",
      desc:
        blogData?.header?.desc ||
        "Stay updated with our latest insights and stories",
    },
    posts:
      blogData?.posts?.map((post, index) => ({
        id: post.id || index + 1,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        image: post.image || [blog1, blog2, blog3][index % 3],
        category: post.category,
        date: post.date
          ? new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
        author: post.author || "",
        readTime: post.readTime || "",
        outline: post.outline || [],
        keywords: post.keywords || [],
      })) || [],
  };

  const [content, setContent] = useState(defaultContent);
  const [tempContent, setTempContent] = useState(defaultContent);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [pendingImages, setPendingImages] = useState<Record<number, File>>({});
  const sectionRef = useRef(null);

  // Crop modal state (same as in Hero.tsx)
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImage, setCropImage] = useState(null);
  const [cropField, setCropField] = useState(null);
  const [cropIndex, setCropIndex] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);

  // Update content when blogData changes
  useEffect(() => {
    setContent(defaultContent);
    setTempContent(defaultContent);
  }, [blogData]);

  // Notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(content);
    }
  }, [content, onStateChange]);

  // Crop modal functions (same as in Hero.tsx)
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

      // For blog images
      if (cropField === "blogImage") {
        setPendingImages((prev) => ({ ...prev, [cropIndex]: croppedFile }));

        const reader = new FileReader();
        reader.onload = () => {
          setTempContent((prev) => ({
            ...prev,
            posts: prev.posts.map((post) =>
              post.id === cropIndex ? { ...post, image: reader.result } : post
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

  // EditableText component following Services.tsx pattern
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

  const handleEdit = () => {
    setIsEditing(true);
    setTempContent(content);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempContent(content);
    setPendingImages({});
  };

  // Updated image upload handler with crop feature
  const handleImageUpload = (id: number, event) => {
    const file = event.target.files[0];
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
    openCropModal(file, "blogImage", id);
  };

  const handleSave = async () => {
    try {
      setIsUploading(true);

      // Create a copy of tempContent to update with S3 URLs
      let updatedContent = { ...tempContent };

      // Upload all pending images
      for (const [postIdStr, file] of Object.entries(pendingImages)) {
        const postId = parseInt(postIdStr);

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
        formData.append("imageField", `posts[${postId}].image` + Date.now());
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
          // Update the post image in our local copy
          updatedContent.posts = updatedContent.posts.map((post) =>
            post.id === postId ? { ...post, image: uploadData.imageUrl } : post
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
      setContent(updatedContent);
      setTempContent(updatedContent);

      // Exit edit mode
      setIsEditing(false);
      toast.success("Blog section saved with S3 URLs ready for publish");
    } catch (error) {
      console.error("Error saving blog section:", error);
      toast.error("Error saving changes. Please try again.");
      // Keep in edit mode so user can retry
    } finally {
      setIsUploading(false);
      setIsSaving(false);
    }
  };

  const handleAddBlog = () => {
    const newBlog = {
      id: Date.now(),
      title: "New Blog Title",
      excerpt: "Short excerpt...",
      content: "Full blog content...",
      image: blog1,
      category: "General",
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      author: "Admin",
      readTime: "5 min read",
      outline: [],
      keywords: [],
    };
    setTempContent({
      ...tempContent,
      posts: [...tempContent.posts, newBlog],
    });
  };

  const handleDeleteBlog = (id: number) => {
    setTempContent({
      ...tempContent,
      posts: tempContent.posts.filter((b) => b.id !== id),
    });
  };

  const updateBlogField = useCallback((id, field, value) => {
    setTempContent((prev) => ({
      ...prev,
      posts: prev.posts.map((b) =>
        b.id === id ? { ...b, [field]: value } : b
      ),
    }));
  }, []);

  const updateHeaderField = (field, value) => {
    setTempContent((prev) => ({
      ...prev,
      header: {
        ...prev.header,
        [field]: value,
      },
    }));
  };

  const displayContent = isEditing ? tempContent : content;

  return (
    <>
      <motion.section
        ref={sectionRef}
        id="blog"
        className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-500 scroll-mt-20 relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
      >
        {/* Edit Controls */}
        <motion.div
          className="absolute top-4 right-6 flex gap-2 z-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {!isEditing ? (
            <Button
              onClick={handleEdit}
              className="bg-white shadow-md"
              variant="outline"
              size="sm"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Blogs
            </Button>
          ) : (
            <>
              <Button
                onClick={handleSave}
                size="sm"
                className="bg-green-600 text-white"
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
                className="bg-white"
                disabled={isSaving || isUploading}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleAddBlog}
                size="sm"
                className="bg-blue-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Blog
              </Button>
            </>
          )}
        </motion.div>

        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {isEditing ? (
              <>
                <EditableText
                  value={tempContent.header.title}
                  onChange={(val) => updateHeaderField("title", val)}
                  className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
                  placeholder="Blog section title"
                />
                <EditableText
                  value={tempContent.header.desc}
                  onChange={(val) => updateHeaderField("desc", val)}
                  className="text-gray-600 dark:text-gray-600"
                  multiline
                  placeholder="Blog section description"
                />
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {displayContent.header.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {displayContent.header.desc}
                </p>
              </>
            )}
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <AnimatePresence>
              {displayContent.posts.map((b) => (
                <motion.div
                  key={b.id}
                  variants={itemVariants}
                  layout
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    variants={cardHoverVariants}
                    initial="rest"
                    whileHover="hover"
                  >
                    <Card className="shadow-lg dark:bg-gray-700 transition-all duration-300 overflow-hidden">
                      <div className="relative">
                        <motion.img
                          src={b.image}
                          className="w-full h-48 object-cover"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        />
                        {isEditing && (
                          <motion.div
                            className="absolute bottom-2 right-2"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            <label className="flex items-center gap-2 bg-white/90 dark:bg-gray-800/90 p-2 rounded shadow cursor-pointer">
                              <Upload className="w-4 h-4 text-gray-600 dark:text-gray-200" />
                              <span className="text-sm text-gray-700 dark:text-gray-200">
                                Change
                              </span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) =>
                                  e.target.files && handleImageUpload(b.id, e)
                                }
                              />
                            </label>
                            {pendingImages[b.id] && (
                              <p className="text-xs text-orange-600 bg-white/80 p-1 rounded mt-1">
                                Image selected: {pendingImages[b.id].name}
                              </p>
                            )}
                          </motion.div>
                        )}
                      </div>
                      <CardContent className="p-6 space-y-3">
                        {isEditing ? (
                          <>
                            <div className="grid grid-cols-2 gap-2">
                              <EditableText
                                value={b.date}
                                onChange={(val) =>
                                  updateBlogField(b.id, "date", val)
                                }
                                placeholder="Date"
                                className="text-sm"
                              />
                              <EditableText
                                value={b.readTime}
                                onChange={(val) =>
                                  updateBlogField(b.id, "readTime", val)
                                }
                                placeholder="Read time"
                                className="text-sm"
                              />
                            </div>
                            <EditableText
                              value={b.category}
                              onChange={(val) =>
                                updateBlogField(b.id, "category", val)
                              }
                              placeholder="Category"
                            />
                            <EditableText
                              value={b.author}
                              onChange={(val) =>
                                updateBlogField(b.id, "author", val)
                              }
                              placeholder="Author"
                            />
                            <EditableText
                              value={b.title}
                              onChange={(val) =>
                                updateBlogField(b.id, "title", val)
                              }
                              placeholder="Blog title"
                              className="font-bold"
                            />
                            <EditableText
                              value={b.excerpt}
                              onChange={(val) =>
                                updateBlogField(b.id, "excerpt", val)
                              }
                              multiline
                              placeholder="Blog excerpt"
                            />
                            <EditableText
                              value={b.content}
                              multiline
                              onChange={(val) =>
                                updateBlogField(b.id, "content", val)
                              }
                              placeholder="Blog content"
                            />

                            {/* Delete Button */}
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button
                                onClick={() => handleDeleteBlog(b.id)}
                                variant="outline"
                                size="sm"
                                className="bg-red-600 text-white mt-2"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </Button>
                            </motion.div>
                          </>
                        ) : (
                          <>
                            <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                              <span>{b.date}</span>
                              <motion.span
                                className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
                                whileHover={{ scale: 1.05 }}
                              >
                                {b.category}
                              </motion.span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                              {b.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                              {b.excerpt}
                            </p>
                            <div className="flex justify-between items-center mt-4">
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                <span>{b.author}</span>
                                <span className="mx-2">•</span>
                                <span>{b.readTime}</span>
                              </div>
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Button
                                  variant="ghost"
                                  className="text-red-500 dark:text-red-400 hover:text-red-600"
                                  onClick={() => setSelectedBlog(b)}
                                >
                                  Read More →
                                </Button>
                              </motion.div>
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.section>

      {/* Blog Details Modal */}
      {selectedBlog && (
        <BlogModal blog={selectedBlog} onClose={() => setSelectedBlog(null)} />
      )}

      {/* Crop Modal */}
      {cropModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999999]">
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
    </>
  );
}
