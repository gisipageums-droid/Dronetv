
import { motion } from "framer-motion";
import {
  Edit2,
  Loader2,
  Plus,
  Save,
  Star,
  Trash2,
  Upload,
  X,
  RotateCw,
  Check,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import Cropper from "react-easy-crop";

export default function EditableProducts({
  productData,
  onStateChange,
  userId,
  publishedId,
  templateSelection,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [selected, setSelected] = useState("All");
  const [selectedProductIndex, setSelectedProductIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sectionRef = useRef(null);
  const fileInputRefs = useRef({});
  const [addingCategoryFor, setAddingCategoryFor] = useState<number | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");

  // Enhanced crop modal state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(4 / 3);
  const [cropField, setCropField] = useState(null);
  const [cropIndex, setCropIndex] = useState(null);

  // Auto-save state
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingUploadsRef = useRef<Map<number, { file: File; previewUrl: string }>>(new Map());
  const changesCountRef = useRef(0);
  const hasChangesRef = useRef(false);

  // Auto-save configuration
  const AUTO_SAVE_DELAY = 2000; // 2 seconds delay for auto-save
  const MIN_CHANGES_FOR_AUTO_SAVE = 1;

  // Extract data from productData prop or use defaults
  const defaultContent = useMemo(() => {
    if (productData) {
      // Get unique categories from products
      const categories = [
        "All",
        ...new Set(productData.products.map((p) => p.category)),
      ];

      return {
        sectionTitle: productData.sectionTitle || "Products",
        sectionSubtitle: productData.sectionSubtitle || "Our Products",
        sectionDescription: productData.sectionDescription || "Discover our suite of innovative products.",
        trustText: productData.trustText || "",
        products: productData.products.map((product, index) => ({
          id: index + 1,
          image: product.image,
          title: product.title,
          description: product.description,
          detailedDescription: product.detailedDescription,
          category: product.category,
          features: product.features || [],
          isPopular: product.isPopular || false,
          categoryColor: product.categoryColor || "bg-gray-100 text-gray-800",
          pricing: product.pricing,
          timeline: product.timeline,
        })),
        categories: categories,
        benefits: productData.benefits || [],
      };
    }

    // Fallback default content
    return {
      sectionTitle: "Products",
      sectionSubtitle: "Our Products",
      sectionDescription: "Discover our suite of innovative products.",
      trustText: "",
      products: [],
      categories: ["All"],
      benefits: [],
    };
  }, [productData]);

  const [content, setContent] = useState(defaultContent);
  const [tempContent, setTempContent] = useState(defaultContent);

  // Update content when productData changes
  useEffect(() => {
    if (productData) {
      setContent(defaultContent);
      setTempContent(defaultContent);
      setDataLoaded(true);
    }
  }, [productData, defaultContent]);

  // Auto-save effect
  useEffect(() => {
    if (!isEditing || !hasUnsavedChanges || changesCountRef.current < MIN_CHANGES_FOR_AUTO_SAVE) {
      return;
    }

    // Clear any existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Set new timeout for auto-save
    autoSaveTimeoutRef.current = setTimeout(() => {
      performAutoSave();
    }, AUTO_SAVE_DELAY);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [tempContent, isEditing, hasUnsavedChanges]);

  // Notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(content);
    }
  }, [content, onStateChange]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => sectionRef.current && observer.unobserve(sectionRef.current);
  }, []);

  const displayContent = isEditing ? tempContent : content;
  const filtered =
    selected === "All"
      ? displayContent.products
      : displayContent.products.filter((p) => p.category === selected);

  // Mark changes when content is updated
  const markChanges = () => {
    setHasUnsavedChanges(true);
    changesCountRef.current += 1;
    hasChangesRef.current = true;
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

  // Upload cropped image to AWS S3
  const uploadImageToS3 = async (file, productId) => {
    try {
      if (!userId || !publishedId || !templateSelection) {
        console.error("Missing required props for upload");
        return null;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("sectionName", "products");
      formData.append("imageField", `product-${productId}-${Date.now()}`);
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
        console.log("Image uploaded to S3:", uploadData.imageUrl);
        toast.success("Product image uploaded to AWS!");
        return uploadData.imageUrl;
      } else {
        const errorData = await uploadResponse.json();
        console.error("Image upload failed:", errorData);
        throw new Error(errorData.message || "Upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  // Enhanced image upload handler with immediate upload after crop
  const handleImageUpload = (productId, event) => {
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

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageToCrop(reader.result);
      setOriginalFile(file);
      setCropModalOpen(true);
      setCropField("productImage");
      setCropIndex(productId);
      setAspectRatio(4 / 3); // Standard aspect ratio for product images
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
    };
    reader.readAsDataURL(file);

    event.target.value = "";
  };

  const applyCrop = async () => {
    try {
      setIsUploading(true);
      if (!imageToCrop || !croppedAreaPixels || !cropIndex) {
        console.error("Missing required data for cropping");
        return;
      }

      const { file, previewUrl } = await getCroppedImg(
        imageToCrop,
        croppedAreaPixels,
        rotation
      );

      // Upload image directly to AWS
      const awsImageUrl = await uploadImageToS3(file, cropIndex);

      if (awsImageUrl) {
        // Update state with AWS URL
        setTempContent((prev) => ({
          ...prev,
          products: prev.products.map((product) =>
            product.id === cropIndex
              ? { ...product, image: awsImageUrl }
              : product
          ),
        }));

        markChanges(); // Mark changes for auto-save
      } else {
        // Fallback to local preview if AWS upload fails
        setTempContent((prev) => ({
          ...prev,
          products: prev.products.map((product) =>
            product.id === cropIndex
              ? { ...product, image: previewUrl }
              : product
          ),
        }));
        toast.info("Using local preview. AWS upload failed.");
      }

      setCropModalOpen(false);
      setImageToCrop(null);
      setOriginalFile(null);
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
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
  };

  const resetCropSettings = () => {
    setZoom(1);
    setRotation(0);
    setCrop({ x: 0, y: 0 });
  };

  const fetchProductsData = async () => {
    setIsLoading(true);
    try {
      if (productData) {
        setContent(defaultContent);
        setTempContent(defaultContent);
        setDataLoaded(true);
      }
    } catch (error) {
      console.error("Error fetching products data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-save handler
  const performAutoSave = async () => {
    if (!hasUnsavedChanges || changesCountRef.current < MIN_CHANGES_FOR_AUTO_SAVE) {
      return;
    }

    try {
      setIsAutoSaving(true);

      // Update both states
      setContent(tempContent);
      setHasUnsavedChanges(false);
      changesCountRef.current = 0;
      hasChangesRef.current = false;
      setLastSaved(new Date());

      // Notify parent
      if (onStateChange) {
        onStateChange(tempContent);
      }

      toast.success("Products saved automatically!", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: true,
      });
    } catch (error) {
      console.error("Error during auto-save:", error);
      toast.error("Auto-save failed. Please save manually.");
    } finally {
      setIsAutoSaving(false);
    }
  };

  // Manual save button handler (for backward compatibility)
  const handleSave = async () => {
    await performAutoSave();
    setIsEditing(false);
  };

  useEffect(() => {
    if (isVisible && !dataLoaded && !isLoading && !productData) {
      fetchProductsData();
    }
  }, [isVisible, dataLoaded, isLoading, productData]);

  const handleEdit = () => {
    setIsEditing(true);
    setTempContent(content);
    setHasUnsavedChanges(false);
    changesCountRef.current = 0;
    hasChangesRef.current = false;
  };

  const handleCancel = () => {
    setTempContent(content);
    pendingUploadsRef.current.clear();
    setIsEditing(false);
    setHasUnsavedChanges(false);
    changesCountRef.current = 0;
  };

  const updateProductField = (productId, field, value) => {
    // Apply character limits based on field type
    let processedValue = value;

    if (field === "title" && value.length > 50) {
      processedValue = value.slice(0, 50);
    } else if (field === "description" && value.length > 500) {
      processedValue = value.slice(0, 500);
    } else if (field === "detailedDescription" && value.length > 1000) {
      processedValue = value.slice(0, 1000);
    } else if (field === "category" && value.length > 50) {
      processedValue = value.slice(0, 50);
    } else if (field === "pricing" && value.length > 100) {
      processedValue = value.slice(0, 100);
    } else if (field === "timeline" && value.length > 100) {
      processedValue = value.slice(0, 100);
    }

    setTempContent((prev) => {
      if (prev.products.find(p => p.id === productId)?.[field] === processedValue) return prev;
      markChanges();
      return {
        ...prev,
        products: prev.products.map((product) =>
          product.id === productId
            ? { ...product, [field]: processedValue }
            : product
        ),
      };
    });
  };

  const updateFeature = (productId, fIndex, value) => {
    // Apply character limit for features
    let processedValue = value;
    if (value.length > 35) {
      processedValue = value.slice(0, 35);
    }

    setTempContent((prev) => {
      const product = prev.products.find(p => p.id === productId);
      if (product.features[fIndex] === processedValue) return prev;
      markChanges();
      return {
        ...prev,
        products: prev.products.map((product) =>
          product.id === productId
            ? {
              ...product,
              features: product.features.map((f, fi) =>
                fi === fIndex ? processedValue : f
              ),
            }
            : product
        ),
      };
    });
  };

  const addFeature = (productId) => {
    setTempContent((prev) => {
      markChanges();
      return {
        ...prev,
        products: prev.products.map((product) =>
          product.id === productId
            ? { ...product, features: [...product.features, "New Feature"] }
            : product
        ),
      };
    });
  };

  const removeFeature = (productId, fIndex) => {
    setTempContent((prev) => {
      markChanges();
      return {
        ...prev,
        products: prev.products.map((product) =>
          product.id === productId
            ? {
              ...product,
              features: product.features.filter((_, fi) => fi !== fIndex),
            }
            : product
        ),
      };
    });
  };

  const addProduct = () => {
    const newId = Math.max(...tempContent.products.map((p) => p.id), 0) + 1;
    setTempContent((prev) => {
      markChanges();
      return {
        ...prev,
        products: [
          ...prev.products,
          {
            id: newId,
            title: "New Product",
            description: "Product description",
            detailedDescription: "Detailed product description",
            category: "Technology",
            image: null,
            features: ["Feature 1", "Feature 2"],
            isPopular: false,
            categoryColor: "bg-gray-100 text-gray-800",
            pricing: "Contact for pricing",
            timeline: "TBD",
          },
        ],
      };
    });
  };

  const removeProduct = (productId) => {
    setTempContent((prev) => {
      markChanges();
      return {
        ...prev,
        products: prev.products.filter((product) => product.id !== productId),
      };
    });
  };

  const addCategory = () => {
    const newCategory = prompt("Enter new category name:");
    if (newCategory && !tempContent.categories.includes(newCategory)) {
      setTempContent((prev) => {
        markChanges();
        return {
          ...prev,
          categories: [...prev.categories, newCategory],
        };
      });
    }
  };

  const removeCategory = (categoryToRemove) => {
    setTempContent((prev) => {
      markChanges();
      return {
        ...prev,
        categories: prev.categories.filter((cat) => cat !== categoryToRemove),
        products: prev.products.map((product) =>
          product.category === categoryToRemove
            ? { ...product, category: "Technology" }
            : product
        ),
      };
    });
  };

  const openModal = (productId) => {
    const index = tempContent.products.findIndex((p) => p.id === productId);
    setSelectedProductIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProductIndex(null);
  };

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
            {value?.length}/{maxLength}
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

  // Update section fields with change tracking
  const updateSectionField = (field, value) => {
    setTempContent((prev) => {
      if (prev[field] === value) return prev;
      markChanges();
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const updateBenefitField = (index, field, value) => {
    // Apply character limits for benefits
    let processedValue = value;

    if (field === "title" && value.length > 100) {
      processedValue = value.slice(0, 100);
    } else if (field === "desc" && value.length > 200) {
      processedValue = value.slice(0, 200);
    } else if (field === "icon" && value.length > 10) {
      processedValue = value.slice(0, 10);
    }

    setTempContent((prev) => {
      if (prev.benefits[index][field] === processedValue) return prev;
      markChanges();
      return {
        ...prev,
        benefits: prev.benefits.map((benefit, i) =>
          i === index ? { ...benefit, [field]: processedValue } : benefit
        ),
      };
    });
  };

  const addBenefit = () => {
    setTempContent((prev) => {
      markChanges();
      return {
        ...prev,
        benefits: [
          ...prev.benefits,
          {
            icon: "⭐",
            title: "New Benefit",
            desc: "Benefit description",
            color: "primary",
          },
        ],
      };
    });
  };

  const removeBenefit = (index) => {
    setTempContent((prev) => {
      markChanges();
      return {
        ...prev,
        benefits: prev.benefits.filter((_, i) => i !== index),
      };
    });
  };

  const renderBenefits = () => {
    const benefits = isEditing ? tempContent.benefits : displayContent.benefits;
    if (!benefits || benefits.length === 0) return null;

    return (
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className="text-center p-6 bg-white rounded-lg shadow-sm relative"
          >
            <div
              className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 text-2xl font-bold
              ${benefit.color === "red-accent"
                  ? "bg-red-100 text-red-600"
                  : benefit.color === "primary"
                    ? "bg-yellow-100 text-yellow-400"
                    : "bg-yellow-100 text-yellow-400"
                }`}
            >
              {isEditing ? (
                <input
                  value={benefit.icon}
                  onChange={(e) =>
                    updateBenefitField(index, "icon", e.target.value)
                  }
                  className="w-full text-2xl text-center bg-transparent border-b"
                  placeholder="Icon (emoji or SVG)"
                  maxLength={10}
                />
              ) : (
                benefit.icon
              )}
            </div>
            {isEditing ? (
              <input
                value={benefit.title}
                onChange={(e) =>
                  updateBenefitField(index, "title", e.target.value)
                }
                className="font-semibold text-lg mb-2 w-full text-center bg-transparent border-b"
                placeholder="Benefit Title"
                maxLength={35}
              />
            ) : (
              <h4 className="font-semibold text-lg mb-2">{benefit.title}</h4>
            )}
            {isEditing ? (
              <textarea
                value={benefit.desc}
                onChange={(e) =>
                  updateBenefitField(index, "desc", e.target.value)
                }
                className="text-gray-600 text-sm w-full bg-transparent border-b"
                placeholder="Benefit Description"
                rows={2}
                maxLength={100}
              />
            ) : (
              <p className="text-gray-600 text-sm">{benefit.desc}</p>
            )}
            {isEditing && (
              <Button
                size="sm"
                variant="destructive"
                className="absolute top-2 right-2"
                onClick={() => removeBenefit(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
        {isEditing && (
          <Button
            onClick={addBenefit}
            size="sm"
            variant="outline"
            className="mt-4"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Benefit
          </Button>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <section ref={sectionRef} className="max-w-7xl mx-auto py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading products...</p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="product"
      ref={sectionRef}
      className={`${tempContent?.products && tempContent?.products.length > 0 && "py-20"
        } bg-gray-50 relative overflow-hidden`}
    >
      {/* Auto-save indicator */}
      {isEditing && (
        <div className="absolute top-4 left-4 z-10">
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md">
            {isAutoSaving ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
                <span className="text-xs text-gray-700">Saving...</span>
              </>
            ) : hasUnsavedChanges ? (
              <>
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-700">Unsaved changes</span>
              </>
            ) : (
              <>
                <Check className="w-3 h-3 text-green-600" />
                <span className="text-xs text-gray-700">
                  Saved {lastSaved && lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </>
            )}
          </div>
        </div>
      )}

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
              disabled={isAutoSaving || isUploading}
            >
              {isAutoSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isAutoSaving ? "Saving..." : "Save Now"}
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              size="sm"
              className="bg-white hover:bg-gray-50 shadow-md"
              disabled={isAutoSaving || isUploading}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div className="text-center mx-auto">
            {tempContent?.products && tempContent?.products.length > 0 && (
              <span className="inline-block px-4 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium mb-4">
                Our Products
              </span>
            )}

            {/* Section Title */}
            {isEditing ? (
              <EditableText
                value={tempContent.sectionTitle}
                onChange={(val) => updateSectionField("sectionTitle", val)}
                className="text-4xl font-bold mb-2"
                placeholder="Section Title"
                maxLength={100}
              />
            ) : (
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                {displayContent.sectionTitle}
              </h2>
            )}

            {/* Section Subtitle */}
            {isEditing ? (
              <EditableText
                value={tempContent.sectionSubtitle}
                onChange={(val) => updateSectionField("sectionSubtitle", val)}
                className="text-2xl font-semibold mb-2"
                placeholder="Section Subtitle"
                maxLength={100}
              />
            ) : (
              <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                {displayContent.sectionSubtitle}
              </h3>
            )}

            {/* Section Description */}
            {isEditing ? (
              <div className="mb-2">
                <EditableText
                  value={tempContent.sectionDescription}
                  onChange={(val) => updateSectionField("sectionDescription", val)}
                  className="text-gray-600"
                  multiline={true}
                  placeholder="Section Description"
                  maxLength={500}
                />
              </div>
            ) : (
              // <p className="text-lg text-justify text-gray-600 max-w-3xl mx-auto mb-2">
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-2">
                {displayContent.sectionDescription}
              </p>
            )}

            {/* Trust Text (if exists) */}
            {displayContent.trustText && (
              isEditing ? (
                <EditableText
                  value={tempContent.trustText}
                  onChange={(val) => updateSectionField("trustText", val)}
                  className="font-bold text-yellow-600"
                  placeholder="Trust text (e.g., 'for your business')"
                  maxLength={100}
                />
              ) : (
                <p className="font-bold text-yellow-600">
                  {displayContent.trustText}
                </p>
              )
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-4 justify-center mt-6 flex-wrap mb-16">
          {displayContent.categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelected(cat)}
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${selected === cat
                ? "bg-yellow-400 text-gray-900 shadow-lg scale-105"
                : "bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg"
                }`}
            >
              {cat}
              {isEditing && cat !== "All" && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    removeCategory(cat);
                  }}
                  className="ml-2 text-xs text-red-600 hover:text-red-800 cursor-pointer"
                >
                  ✕
                </span>
              )}
            </button>
          ))}
          {isEditing && (
            <Button onClick={addCategory} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-1" /> Add Category
            </Button>
          )}
        </div>
      </div>

      {/* Products Display */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <Card
              key={product.id}
              className="shadow-md rounded-xl overflow-hidden relative bg-white hover:shadow-lg transition-shadow duration-300"
            >
              {product.isPopular && (
                <div className="absolute top-4 left-4 z-10">
                  <Badge className="bg-yellow-400 text-white">
                    <Star className="w-3 h-3 mr-1" fill="currentColor" />
                    Popular
                  </Badge>
                </div>
              )}

              <CardContent className="p-0 flex justify-between flex-col">
                <div className="relative">
                  <img
                    src={
                      product.image ||
                      "https://via.placeholder.com/320x180?text=Product+Image"
                    }
                    alt={product.title}
                    className="w-full h-48 object-cover scale-110"
                  />
                  {isEditing && (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        ref={(el) => (fileInputRefs.current[product.id] = el)}
                        onChange={(e) => handleImageUpload(product.id, e)}
                        className="hidden"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute top-2 right-2 bg-white/80"
                        onClick={() =>
                          fileInputRefs.current[product.id]?.click()
                        }
                      >
                        <Upload className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Badge
                      className={
                        product.categoryColor || "bg-gray-100 text-gray-800"
                      }
                    >
                      {isEditing ? (
                        <div className="w-full">
                          <select
                            value={product.category}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === "__add_new__") {
                                setAddingCategoryFor(product.id);
                                setNewCategoryName("");
                              } else {
                                updateProductField(product.id, "category", val);
                                setAddingCategoryFor(null);
                              }
                            }}
                            className="w-full bg-white/80 border-2 border-dashed border-blue-300 rounded p-1 text-xs"
                          >
                            {displayContent.categories.map((c, i) => (
                              <option key={i} value={c}>{c}</option>
                            ))}
                            <option value="__add_new__">+ Add new category</option>
                          </select>
                          {addingCategoryFor === product.id && (
                            <div className="mt-2 flex items-center gap-2">
                              <input
                                value={newCategoryName}
                                onChange={(e) => {
                                  if (e.target.value.length <= 50) setNewCategoryName(e.target.value);
                                }}
                                placeholder="New category name"
                                className="flex-1 bg-white/80 border-2 border-dashed border-blue-300 rounded p-1 text-xs"
                                maxLength={50}
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs"
                                onClick={() => {
                                  const name = newCategoryName.trim();
                                  if (!name) return;
                                  setTempContent((prev) => {
                                    markChanges();
                                    return {
                                      ...prev,
                                      categories: prev.categories.includes(name)
                                        ? prev.categories
                                        : [...prev.categories, name],
                                      products: prev.products.map((p) =>
                                        p.id === product.id ? { ...p, category: name } : p
                                      ),
                                    };
                                  });
                                  setAddingCategoryFor(null);
                                  setNewCategoryName("");
                                }}
                              >
                                Add
                              </Button>
                            </div>
                          )}
                        </div>
                      ) : (
                        product.category
                      )}
                    </Badge>
                  </div>

                  {isEditing ? (
                    <EditableText
                      value={product.title}
                      onChange={(val) =>
                        updateProductField(product.id, "title", val)
                      }
                      className="text-xl font-bold mb-3"
                      placeholder="Product Title"
                      maxLength={50}
                    />
                  ) : (
                    <h3 className="text-xl font-bold mb-3 text-center">{product.title}</h3>
                  )}

                  {isEditing ? (
                    <EditableText
                      value={product.description}
                      onChange={(val) =>
                        updateProductField(product.id, "description", val)
                      }
                      multiline
                      className="text-gray-600 mb-4"
                      placeholder="Product Description"
                      maxLength={150}
                    />
                  ) : (
                    <p className="text-gray-600 mb-4">
                      {/* {product.description?.slice(0, 20) + "..."} */}
                      {product.description}
                    </p>
                  )}

                  {/* {product.features && product.features.length > 0 && (
                    <div className="mb-4">
                      {isEditing && (
                        <h4 className="font-semibold mb-2 text-sm">
                          Features:
                        </h4>
                      )}
                      <ul className="text-sm text-gray-600 space-y-1">
                        {product.features.map((feature, idx) => (
                          <li key={idx} className={`flex items-center`}>
                            {isEditing && (
                              <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-2 flex-shrink-0"></div>
                            )}
                            {isEditing ? (
                              <div className="flex items-center gap-2 w-full">
                                <input
                                  value={feature}
                                  onChange={(e) =>
                                    updateFeature(
                                      product.id,
                                      idx,
                                      e.target.value
                                    )
                                  }
                                  className="w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1 text-xs"
                                  placeholder="Feature"
                                  maxLength={35}
                                />
                                <Button
                                  onClick={() => removeFeature(product.id, idx)}
                                  size="sm"
                                  variant="outline"
                                  className="bg-red-50 hover:bg-red-100 text-red-700"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            ) : (
                              ""
                            )}
                          </li>
                        ))}
                      </ul>
                      {isEditing && (
                        <Button
                          onClick={() => addFeature(product.id)}
                          size="sm"
                          variant="outline"
                          className="bg-green-50 hover:bg-green-100 text-green-700 mt-2"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add Feature
                        </Button>
                      )}
                    </div>
                  )} */}

                    {product.features && product.features.length > 0 && (
  <div className="mb-4">
    {isEditing ? (
      <h4 className="font-semibold mb-2 text-sm">Features:</h4>
    ) : (
      <h4 className="font-semibold mb-2 text-sm">Key Features:</h4>
    )}
    <ul className="text-sm text-gray-600 space-y-1">
      {product.features.map((feature, idx) => (
        <li key={idx} className="flex items-center">
          {/* Bullet point for both views */}
          <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-2 flex-shrink-0"></div>
          
          {isEditing ? (
            <div className="flex items-center gap-2 w-full">
              <input
                value={feature}
                onChange={(e) => updateFeature(product.id, idx, e.target.value)}
                className="w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1 text-xs"
                placeholder="Feature"
                maxLength={35}
              />
              <Button
                onClick={() => removeFeature(product.id, idx)}
                size="sm"
                variant="outline"
                className="bg-red-50 hover:bg-red-100 text-red-700"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          ) : (
            // Normal view - display the feature text
            <span>{feature}</span>
          )}
        </li>
      ))}
    </ul>
    {isEditing && (
      <Button
        onClick={() => addFeature(product.id)}
        size="sm"
        variant="outline"
        className="bg-green-50 hover:bg-green-100 text-green-700 mt-2"
      >
        <Plus className="w-3 h-3 mr-1" />
        Add Feature
      </Button>
    )}
  </div>
)}

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className={`hover:scale-105 ${!isEditing && "w-full"}`}
                      onClick={() => openModal(product.id)}
                    >
                      View Details
                    </Button>
                    {isEditing && (
                      <Button
                        onClick={() => removeProduct(product.id)}
                        size="sm"
                        variant="destructive"
                        className="hover:scale-105"
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Remove
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {isEditing && (
          <Button onClick={addProduct} size="sm" className="mt-6">
            <Plus className="w-4 h-4 mr-1" /> Add Product
          </Button>
        )}
      </div>

      {/* Benefits Section */}
      {renderBenefits()}

      {/* Product Details Modal */}
      {isModalOpen && selectedProductIndex !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-xl w-full max-w-3xl p-6 relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 bg-gray-500 text-white rounded-full p-2"
            >
              <X className="w-5 h-5" />
            </button>

            {isEditing ? (
              <EditableText
                value={tempContent.products[selectedProductIndex].title}
                onChange={(val) =>
                  updateProductField(
                    tempContent.products[selectedProductIndex].id,
                    "title",
                    val
                  )
                }
                className="text-2xl font-bold mb-4"
                placeholder="Product Title"
                maxLength={50}
              />
            ) : (
              <h2 className="text-2xl font-bold mb-4">
                {tempContent.products[selectedProductIndex].title}
              </h2>
            )}

            {isEditing ? (
              <EditableText
                value={
                  tempContent.products[selectedProductIndex].detailedDescription
                }
                onChange={(val) =>
                  updateProductField(
                    tempContent.products[selectedProductIndex].id,
                    "detailedDescription",
                    val
                  )
                }
                multiline
                className="mb-4"
                placeholder="Detailed Description"
                maxLength={1000}
              />
            ) : (
              <p className="text-gray-600 mb-4">
                {tempContent.products[selectedProductIndex].detailedDescription}
              </p>
            )}

            {/* Pricing & Timeline */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Pricing</h3>
                {isEditing ? (
                  <EditableText
                    value={tempContent.products[selectedProductIndex].pricing}
                    onChange={(val) =>
                      updateProductField(
                        tempContent.products[selectedProductIndex].id,
                        "pricing",
                        val
                      )
                    }
                    placeholder="Pricing Information"
                    maxLength={35}
                  />
                ) : (
                  <p>{tempContent.products[selectedProductIndex].pricing}</p>
                )}
              </div>
              <div>
                <h3 className="font-semibold mb-2">Timeline</h3>
                {isEditing ? (
                  <EditableText
                    value={tempContent.products[selectedProductIndex].timeline}
                    onChange={(val) =>
                      updateProductField(
                        tempContent.products[selectedProductIndex].id,
                        "timeline",
                        val
                      )
                    }
                    placeholder="Timeline Information"
                    maxLength={35}
                  />
                ) : (
                  <p>{tempContent.products[selectedProductIndex].timeline}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

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
            <div className="flex-1 relative bg-gray-900 min-h-0">
              <div className="relative w-full h-full">
                <Cropper
                  image={imageToCrop}
                  crop={crop}
                  zoom={zoom}
                  rotation={rotation}
                  aspect={aspectRatio}
                  minZoom={0.5}
                  maxZoom={4}
                  restrictPosition={false}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onRotationChange={setRotation}
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
                  className="w-full border border-gray-300 text-gray-700 hover:bg-gray-100 rounded py-2 text-sm font-medium flex items-center justify-center gap-2"
                >
                  <RotateCw className="w-4 h-4" />
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
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 inline mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Apply & Upload"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}