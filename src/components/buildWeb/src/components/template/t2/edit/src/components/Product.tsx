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
  RotateCw,
  ZoomIn
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "react-toastify";
import Cropper from 'react-easy-crop';

export default function Product({productData, onStateChange,userId, publishedId, templateSelection}) {
  const [isEditing, setIsEditing] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);
  const [selectedProductIndex, setSelectedProductIndex] = useState<number | null>(null);
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

  // Consolidated state
  const [contentState, setContentState] = useState(productData);

  // Add this useEffect to notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(contentState);
    }
  }, [contentState, onStateChange]);

  // Update function for simple fields
  const updateField = (section, field, value) => {
    setContentState(prev => ({ 
      ...prev, 
      [section]: { ...prev[section], [field]: value } 
    }));
  };

  // Update function for products
  const updateProductField = (index, field, value) => {
    setContentState(prev => ({
      ...prev,
      products: prev.products.map((p, i) => i === index ? { ...p, [field]: value } : p)
    }));
  };

  // Update function for product features
  const updateFeature = (index, fIndex, value) => {
    setContentState(prev => ({
      ...prev,
      products: prev.products.map((p, i) =>
        i === index
          ? {
              ...p,
              features: p.features.map((f, fi) => fi === fIndex ? value : f)
            }
          : p
      )
    }));
  };

  // Add a new feature to a product
  const addFeature = (index) => {
    setContentState(prev => ({
      ...prev,
      products: prev.products.map((p, i) =>
        i === index ? { ...p, features: [...p.features, "New Feature"] } : p
      )
    }));
  };

  // Remove a feature from a product
  const removeFeature = (index, fIndex) => {
    setContentState(prev => ({
      ...prev,
      products: prev.products.map((p, i) =>
        i === index
          ? {
              ...p,
              features: p.features.filter((_, fi) => fi !== fIndex)
            }
          : p
      )
    }));
  };

  // Image selection handler - now opens cropper
  const handleProductImageSelect = async (index, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageToCrop(reader.result);
      setOriginalFile(file);
      setCroppingIndex(index);
      setShowCropper(true);
      setZoom(1);
      setRotation(0);
      setCrop({ x: 0, y: 0 });
    };
    reader.readAsDataURL(file);
    
    // Clear the file input
    e.target.value = '';
  };

  // Cropper functions
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Helper function to create image element
  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  // Function to get cropped image
  const getCroppedImg = async (imageSrc, pixelCrop, rotation = 0) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

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
      canvas.toBlob((blob) => {
        const fileName = originalFile ? 
          `cropped-product-${croppingIndex}-${originalFile.name}` : 
          `cropped-product-${croppingIndex}-${Date.now()}.jpg`;
        
        const file = new File([blob], fileName, { 
          type: 'image/jpeg',
          lastModified: Date.now()
        });
        
        const previewUrl = URL.createObjectURL(blob);
        
        resolve({ 
          file, 
          previewUrl 
        });
      }, 'image/jpeg', 0.95);
    });
  };

  // Apply crop and set pending file
  const applyCrop = async () => {
    try {
      if (!imageToCrop || !croppedAreaPixels || croppingIndex === null) return;

      const { file, previewUrl } = await getCroppedImg(imageToCrop, croppedAreaPixels, rotation);
      
      // Update preview immediately with blob URL (temporary)
      updateProductField(croppingIndex, "image", previewUrl);
      
      // Set the actual file for upload on save
      setPendingImages(prev => ({ ...prev, [croppingIndex]: file }));
      console.log('Product image cropped, file ready for upload:', file);

      toast.success('Image cropped successfully! Click Save to upload to S3.');
      setShowCropper(false);
      setImageToCrop(null);
      setOriginalFile(null);
      setCroppingIndex(null);
    } catch (error) {
      console.error('Error cropping image:', error);
      toast.error('Error cropping image. Please try again.');
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
          console.error('Missing required props:', { userId, publishedId, templateSelection });
          toast.error('Missing user information. Please refresh and try again.');
          return;
        }
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('sectionName', 'products');
        formData.append('imageField', `products[${index}].image`+Date.now());
        formData.append('templateSelection', templateSelection);

        console.log('Uploading product image to S3:', file);

        const uploadResponse = await fetch(`https://o66ziwsye5.execute-api.ap-south-1.amazonaws.com/prod/upload-image/${userId}/${publishedId}`, {
          method: 'POST',
          body: formData,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          // Replace local preview with S3 URL
          updateProductField(index, "image", uploadData.imageUrl);
          console.log('Image uploaded to S3:', uploadData.imageUrl);
        } else {
          const errorData = await uploadResponse.json();
          console.error('Image upload failed:', errorData);
          toast.error(`Image upload failed: ${errorData.message || 'Unknown error'}`);
          return;
        }
      }
      
      // Clear pending images
      setPendingImages({});
      // Exit edit mode
      setIsEditing(false);
      toast.success('Products section saved with S3 URLs!');

    } catch (error) {
      console.error('Error saving products section:', error);
      toast.error('Error saving changes. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Add a new product
  const addProduct = () => {
    setContentState(prev => ({
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
      ]
    }));
  };

  // Remove a product
  const removeProduct = (index) => {
    setContentState(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index)
    }));
  };

  // Update function for benefits
  const updateBenefit = (index, field, value) => {
    setContentState(prev => ({
      ...prev,
      benefits: prev.benefits.map((b, i) => i === index ? { ...b, [field]: value } : b)
    }));
  };

  // Add a new benefit
  const addBenefit = () => {
    setContentState(prev => ({
      ...prev,
      benefits: [
        ...prev.benefits,
        {
          icon: "",
          color: "primary",
          title: "New Benefit",
          desc: "Benefit description...",
        },
      ]
    }));
  };

  // Remove a benefit
  const removeBenefit = (index) => {
    setContentState(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
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
      {/* Image Cropper Modal - Same as Hero */}
      {showCropper && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="fixed inset-0 bg-black/90 z-[999999] flex items-center justify-center p-2 sm:p-3"
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white rounded-xl max-w-4xl w-full max-h-[86vh] overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="p-2 sm:p-3 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <h3 className="text-base font-semibold text-gray-800">Crop Image</h3>
        <button
          onClick={cancelCrop}
          className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
          aria-label="Close cropper"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Cropper Area */}
      <div className="flex-1 relative bg-gray-900">
        <div className="relative w-full h-[44vh] sm:h-[50vh] md:h-[56vh] lg:h-[60vh]">
          <Cropper
            image={imageToCrop}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
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

      {/* Controls - compact responsive */}
      <div className="p-2 sm:p-3 bg-gray-50 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-2">
          {/* Zoom */}
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
              className="w-full h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
            />
          </div>

          {/* Rotation */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-gray-700">
                <RotateCw className="w-4 h-4" /> Rotation
              </span>
              <span className="text-gray-600">{rotation}°</span>
            </div>
            <input
              type="range"
              value={rotation}
              min={0}
              max={360}
              step={1}
              onChange={(e) => setRotation(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
            />
          </div>
        </div>

        {/* Action Buttons - equal width & responsive */}
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
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


      {/* Main Product Section */}
      <motion.section
        id="product"
        className="py-20 bg-secondary theme-transition"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Edit/Save Buttons */}
          <div className="flex justify-end mt-6">
            {isEditing ? (
              <motion.button 
                whileTap={{scale:0.9}}
                whileHover={{y:-1,scaleX:1.1}}
                onClick={handleSave}
                disabled={isUploading}
                className={`${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:shadow-2xl'} text-white px-4 py-2 rounded shadow-xl hover:font-semibold`}
              >
                {isUploading ? 'Uploading...' : 'Save'}
              </motion.button>
            ) : (
              <motion.button 
                whileTap={{scale:0.9}}
                whileHover={{y:-1,scaleX:1.1}}
                onClick={() => setIsEditing(true)} 
                className="bg-yellow-500 text-black px-4 py-2 rounded cursor-pointer  hover:shadow-2xl shadow-xl hover:font-semibold"
              >
                Edit
              </motion.button>
            )}
          </div>

          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            {isEditing ? (
              <>
                <div className="inline-flex items-center px-4 py-2 bg-red-accent/10 rounded-full text-red-accent mb-4">
                  <Zap className="w-4 h-4 mr-2" />
                  <input
                    type="text"
                    value={contentState.heading.title}
                    onChange={(e) => updateField("heading", "title", e.target.value)}
                    className="border-b font-medium bg-transparent"
                  />
                </div>

                <input
                  type="text"
                  value={contentState.heading.heading}
                  onChange={(e) => updateField("heading", "heading", e.target.value)}
                  className="border-b font-medium bg-transparent block w-full text-3xl md:text-4xl text-foreground mb-4"
                />
                <input
                  type="text"
                  className="border-b font-medium bg-transparent block w-full text-3xl md:text-4xl text-foreground mb-4"
                  value={contentState.heading.description}
                  onChange={(e) => updateField("heading", "description", e.target.value)}
                />

                <input
                  type="text"
                  value={contentState.heading.trust}
                  onChange={(e) => updateField("heading", "trust", e.target.value)}
                  className="border-b font-medium bg-transparent block w-full text-3xl md:text-4xl text-foreground mb-4"
                />
              </>
            ) : (
              <>
                <div className="inline-flex items-center px-4 py-2 bg-red-accent/10 rounded-full text-red-accent mb-4">
                  <Zap className="w-4 h-4 mr-2" />
                  <span className="font-medium"> {contentState.heading.title}</span>
                </div>
                <h2 className="text-3xl md:text-4xl text-foreground mb-4">
                  {contentState.heading.heading}
                </h2>

                <p className="text-lg text-muted-foreground inline">
                  {contentState.heading.description}
                </p>
                <p className="text-lg text-muted-foreground inline font-bold text-foreground">
                  {" "}
                  {contentState.heading.trust}
                </p>
              </>
            )}
          </div>

          {/* Products Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contentState.products.slice(0, visibleCount).map((product, index) => {
              return (
                <Card
                  key={index}
                  className="group h-full relative overflow-hidden flex flex-col border-2 shadow-lg hover:shadow-xl  shadow-gray-500"
                >
                  <div className="relative h-32 overflow-hidden flex-shrink-0">
                    <ImageWithFallback
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                    {isEditing && (
                      <motion.div
                        animate={{ scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className="absolute mx-2 bottom-2 left-2  z-50 bg-white/80 p-1 rounded"
                      >
                        <input
                          type="file"
                          accept="image/*"
                          className="text-xs w-full cursor-pointer"
                          onChange={(e) => handleProductImageSelect(index, e)}
                        />
                        {pendingImages[index] && (
                          <p className="text-xs text-green-600 mt-1">
                            ✓ Image cropped and ready to upload
                          </p>
                        )}
                      </motion.div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute top-2 left-2">
                      <Badge
                        className={`${product.categoryColor} border-0 text-xs`}
                      >
                        {isEditing ? (
                          <input
                            value={product.category}
                            onChange={(e) =>
                              updateProductField(index, "category", e.target.value)
                            }
                            className="border-b text-xs bg-transparent"
                          />
                        ) : (
                          product.category
                        )}
                      </Badge>
                    </div>
                    {product.isPopular && (
                      <div className="absolute top-2 right-2 bg-red-accent text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                        <Zap className="w-2 h-2 mr-1" /> Bestseller
                      </div>
                    )}
                    
                  </div>
                  <div className="flex flex-col flex-grow p-6">
                    <div className="flex-shrink-0 mb-4">
                      {isEditing ? (
                        <input
                          value={product.title}
                          onChange={(e) =>
                            updateProductField(index, "title", e.target.value)
                          }
                          className="border-b w-full font-bold text-lg"
                        />
                      ) : (
                        <CardTitle className="line-clamp-2 min-h-[3rem]">{product.title}</CardTitle>
                      )}
                    </div>
                    <div className="flex-grow mb-4">
                      {isEditing ? (
                        <textarea
                          value={product.description}
                          onChange={(e) =>
                            updateProductField(index, "description", e.target.value)
                          }
                          className="border-b w-full min-h-[4rem]"
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground line-clamp-3 min-h-[4rem]">
                          {product.description}
                        </p>
                      )}
                      <ul className="space-y-1 mt-3 min-h-[3rem]">
                        {product.features.map((f, fi) => (
                          <li
                            key={fi}
                            className="text-xs text-muted-foreground flex items-center"
                          >
                            <div className="w-1 h-1 bg-primary rounded-full mr-2 flex-shrink-0" />
                            {isEditing ? (
                              <div className="flex flex-col gap-1 w-full">
                                <input
                                  value={f}
                                  onChange={(e) =>
                                    updateFeature(index, fi, e.target.value)
                                  }
                                  className="border-b w-full"
                                />
                                <motion.button
                                whileHover={{scale:1.1}}
                         whileTap={{scale:0.9}}
                                  onClick={() => removeFeature(index, fi)}
                                  className="text-xs cursor-pointer text-red-500"
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
                       whileHover={{scale:1.1}}
                       whileTap={{scale:0.9}}
                        onClick={() => addFeature(index)}
                        className="text-xs text-green-600 mt-2 mb-4"
                      >
                        + Add Feature
                      </motion.button>
                    )}
                    <div className="mt-auto flex gap-2">
                      <Button size="sm" className="hover:scale-105 flex-1" onClick={() => openModal(index)}>
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
                <Button onClick={addProduct} className="hover:scale-105 text-green-600">
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
            {visibleCount >= contentState.products.length && contentState.products.length > 4 && (
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
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50"
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
                  className="absolute top-4 right-4 bg-white rounded-full p-2"
                >
                  <X className="w-5 h-5" />
                </button>

                {isEditing ? (
                  <input
                    value={contentState.products[selectedProductIndex].title}
                    onChange={(e) =>
                      updateProductField(selectedProductIndex, "title", e.target.value)
                    }
                    className="border-b w-full text-2xl font-bold mb-4"
                  />
                ) : (
                  <h2 className="text-2xl font-bold mb-4">
                    {contentState.products[selectedProductIndex].title}
                  </h2>
                )}

                {isEditing ? (
                  <textarea
                    value={contentState.products[selectedProductIndex].detailedDescription}
                    onChange={(e) =>
                      updateProductField(selectedProductIndex, "detailedDescription", e.target.value)
                    }
                    className="border-b w-full mb-4"
                  />
                ) : (
                  <p className="text-muted-foreground mb-4">
                    {contentState.products[selectedProductIndex].detailedDescription}
                  </p>
                )}

                {/* Pricing & Timeline */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Pricing</h3>
                    {isEditing ? (
                      <input
                        value={contentState.products[selectedProductIndex].pricing}
                        onChange={(e) =>
                          updateProductField(selectedProductIndex, "pricing", e.target.value)
                        }
                        className="border-b w-full"
                      />
                    ) : (
                      <p>{contentState.products[selectedProductIndex].pricing}</p>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Timeline</h3>
                    {isEditing ? (
                      <input
                        value={contentState.products[selectedProductIndex].timeline}
                        onChange={(e) =>
                          updateProductField(selectedProductIndex, "timeline", e.target.value)
                        }
                        className="border-b w-full"
                      />
                    ) : (
                      <p>{contentState.products[selectedProductIndex].timeline}</p>
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
