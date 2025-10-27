// components/Gallery.tsx
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Edit, Save, Plus, Trash2, RotateCw, ZoomIn } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { toast } from "react-toastify";
import Cropper from 'react-easy-crop';

const Gallery = ({galleryData,onStateChange, userId, publishedId, templateSelection }) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [pendingImages, setPendingImages] = useState<Record<number, File>>({});
  const { theme } = useTheme();
  
  // Cropping states
  const [showCropper, setShowCropper] = useState(false);
  const [croppingIndex, setCroppingIndex] = useState<number | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  
  // Consolidated state with new structure
  const [contentState, setContentState] = useState(galleryData || {
    heading: {
      title: "Our Work Gallery",
      description: "Showcasing 0+ years of professional excellence and successful project deliveries"
    },
    categories: [
      "All",
      "Portfolio",
      "Professional Services",
      "Client Projects"
    ],
    images: [
      {
        id: 1.0,
        url: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80",
        title: "Professional Work 1",
        category: "Portfolio",
        description: "Showcase of our professional services - Professional Work 1",
        isPopular: true
      },
      {
        id: 2.0,
        url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
        title: "Professional Work 2",
        category: "Portfolio",
        description: "Showcase of our professional services - Professional Work 2",
        isPopular: true
      },
      {
        id: 3.0,
        url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
        title: "Professional Work 3",
        category: "Portfolio",
        description: "Showcase of our professional services - Professional Work 3",
        isPopular: false
      },
      {
        id: 4.0,
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
        title: "Professional Work 4",
        category: "Portfolio",
        description: "Showcase of our professional services - Professional Work 4",
        isPopular: false
      },
      {
        id: 5.0,
        url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
        title: "Professional Work 5",
        category: "Portfolio",
        description: "Showcase of our professional services - Professional Work 5",
        isPopular: false
      },
      {
        id: 6.0,
        url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80",
        title: "Professional Work 6",
        category: "Portfolio",
        description: "Showcase of our professional services - Professional Work 6",
        isPopular: false
      }
    ]
  });

  // Add this useEffect to notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(contentState);
    }
  }, [contentState, onStateChange]);

  // Update function for gallery images
  const updateImageField = (index, field, value) => {
    setContentState(prev => ({
      ...prev,
      images: prev.images.map((img, i) => 
        i === index ? { ...img, [field]: value } : img
      )
    }));
  };

  // Add a new image - with maximum 6 images limit
  const addImage = () => {
    if (contentState.images.length >= 6) {
      toast.error('Maximum 6 images allowed in gallery');
      return;
    }
    
    setContentState(prev => ({
      ...prev,
      images: [
        ...prev.images,
        {
          id: Date.now(),
          url: null,
          title: "New Image",
          category: "Portfolio",
          description: "New image description",
          isPopular: false
        }
      ]
    }));
  };

  // Remove an image
  const removeImage = (index) => {
    setContentState(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Update function for header
  const updateHeaderField = (field, value) => {
    setContentState(prev => ({
      ...prev,
      heading: {
        ...prev.heading,
        [field]: value
      }
    }));
  };

  // Image selection handler - now opens cropper
  const handleGalleryImageSelect = async (index, e) => {
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
          `cropped-gallery-${croppingIndex}-${originalFile.name}` : 
          `cropped-gallery-${croppingIndex}-${Date.now()}.jpg`;
        
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
      updateImageField(croppingIndex, "url", previewUrl);
      
      // Set the actual file for upload on save
      setPendingImages(prev => ({ ...prev, [croppingIndex]: file }));
      console.log('Gallery image cropped, file ready for upload:', file);

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

  // Save button handler - uploads images and stores S3 URLs
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
        formData.append('sectionName', 'gallery');
        formData.append('imageField', `images[${index}].url`+Date.now());
        formData.append('templateSelection', templateSelection);

        console.log('Uploading gallery image to S3:', file);

        const uploadResponse = await fetch(`https://o66ziwsye5.execute-api.ap-south-1.amazonaws.com/prod/upload-image/${userId}/${publishedId}`, {
          method: 'POST',
          body: formData,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          // Replace local preview with S3 URL
          updateImageField(index, "url", uploadData.imageUrl);
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
      toast.success('Gallery section saved with S3 URLs!');

    } catch (error) {
      console.error('Error saving gallery section:', error);
      toast.error('Error saving changes. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const openLightbox = (index: number) => {
    if (!isEditing) {
      setSelectedImage(index);
    }
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const goToNext = () => {
    if (selectedImage !== null) {
      setSelectedImage((prev) => (prev === contentState.images.length - 1 ? 0 : prev! + 1));
    }
  };

  const goToPrev = () => {
    if (selectedImage !== null) {
      setSelectedImage((prev) => (prev === 0 ? contentState.images.length - 1 : prev! - 1));
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
      <div className="relative flex-1 bg-gray-900">
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
              containerStyle: { position: "relative", width: "100%", height: "100%" },
              cropAreaStyle: { border: "2px solid white", borderRadius: "8px" },
            }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="p-2 border-t border-gray-200 sm:p-3 bg-gray-50">
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

        {/* Action Buttons - equal width */}
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

      {/* Main Gallery Section */}
      <section 
        id="gallery" 
        className={`py-20 theme-transition ${
          theme === "dark" 
            ? "bg-[#1f1f1f] text-gray-100" 
            : "bg-gray-50 text-gray-900"
        }`}
      >
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Edit/Save Buttons */}
          <div className="flex justify-end mb-6">
            {isEditing ? (
              <motion.button 
                whileTap={{scale:0.9}}
                whileHover={{y:-1,scaleX:1.1}}
                onClick={handleSave}
                disabled={isUploading}
                className={`${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:shadow-2xl'} text-white px-4 py-2 rounded shadow-xl hover:font-semibold flex items-center gap-2`}
              >
                <Save size={16} />
                {isUploading ? 'Uploading...' : 'Save'}
              </motion.button>
            ) : (
              <motion.button 
                whileTap={{scale:0.9}}
                whileHover={{y:-1,scaleX:1.1}}
                onClick={() => setIsEditing(true)} 
                className="flex items-center gap-2 px-4 py-2 text-black bg-yellow-500 rounded shadow-xl cursor-pointer hover:shadow-2xl hover:font-semibold"
              >
                <Edit size={16} />
                Edit
              </motion.button>
            )}
          </div>

          <div className="mb-16 text-center">
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={contentState.heading.title}
                  onChange={(e) => updateHeaderField("title", e.target.value)}
                  className="mb-4 text-3xl font-bold text-center bg-transparent border-b"
                />
                <textarea
                  value={contentState.heading.description}
                  onChange={(e) => updateHeaderField("description", e.target.value)}
                  className="w-full max-w-3xl mx-auto text-lg text-center bg-transparent border-b"
                />
              </>
            ) : (
              <>
                <h2 className="mb-4 text-3xl font-bold">{contentState.heading.title}</h2>
                <p className="max-w-3xl mx-auto text-lg">
                  {contentState.heading.description}
                </p>
              </>
            )}
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {contentState.images.map((image, index) => (
              <motion.div
                key={image.id}
                className={`overflow-hidden rounded-lg shadow-md cursor-pointer group ${
                  theme === "dark" ? "bg-gray-800" : "bg-white"
                }`}
                whileHover={{ y: isEditing ? 0 : -5 }}
                onClick={() => openLightbox(index)}
              >
                <div className="relative overflow-hidden">
                  {image.url ? (
                    <img
                      src={image.url}
                      alt={image.title}
                      className="object-cover w-full h-64 transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-64 bg-gray-200">
                      <span className="text-gray-500">No image</span>
                    </div>
                  )}
                  
                  {isEditing && (
                    <motion.div
                      animate={{opacity:[0,1], scale:[0.8,1]}}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{scale:0.9}}
                      transition={{ duration: 0.3 }}
                      className="absolute z-50 p-1 mx-2 rounded bottom-2 left-2 bg-white/80"
                    >
                      <input
                        type="file"
                        accept="image/*"
                        className="w-full text-xs cursor-pointer"
                        onChange={(e) => handleGalleryImageSelect(index, e)}
                      />
                      {pendingImages[index] && (
                        <p className="mt-1 text-xs text-green-600">
                          ✓ Image cropped and ready to upload
                        </p>
                      )}
                    </motion.div>
                  )}
                  
                  <div className="absolute inset-0 flex items-end transition-all duration-300 bg-black bg-opacity-0 group-hover:bg-opacity-30">
                    <div className="w-full p-4 text-white transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                      {isEditing ? (
                        <>
                          <input
                            value={image.title}
                            onChange={(e) => updateImageField(index, "title", e.target.value)}
                            className="w-full mb-1 font-semibold bg-transparent border-b"
                          />
                          <input
                            value={image.category}
                            onChange={(e) => updateImageField(index, "category", e.target.value)}
                            className="w-full text-sm bg-transparent border-b"
                          />
                        </>
                      ) : (
                        <>
                          <h3 className="font-semibold">{image.title}</h3>
                          <p className="text-sm">{image.category}</p>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {isEditing && (
                    <motion.button
                      whileHover={{scale:1.1}}
                      whileTap={{scale:0.9}}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(index);
                      }}
                      className="absolute p-1 text-white bg-red-500 rounded-full top-2 right-2"
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
            
            {/* Show Add Image button only when there are less than 6 images */}
            {isEditing && contentState.images.length < 6 && (
              <motion.div 
                className={`rounded-lg flex items-center justify-center border-dashed ${
                  theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"
                } border-2 cursor-pointer`}
                whileHover={{ scale: 1.02 }}
                onClick={addImage}
              >
                <div className="flex flex-col items-center p-6 text-green-600">
                  <Plus size={32} />
                  <span className="mt-2">Add Image</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Show message when maximum images reached */}
          {isEditing && contentState.images.length >= 6 && (
            <div className="p-4 mt-6 text-center border border-yellow-200 rounded-lg bg-yellow-50">
              <p className="text-yellow-700">
                Maximum 6 images reached. Remove an image to add a new one.
              </p>
            </div>
          )}
        </div>

        {/* Lightbox Modal */}
        {selectedImage !== null && (
          <div className="fixed top-[8rem] inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            <button
              onClick={closeLightbox}
              className="absolute p-2 text-white bg-black bg-opacity-50 rounded-full top-4 right-4 hover:bg-opacity-70"
            >
              <X size={24} />
            </button>
            
            <button
              onClick={goToPrev}
              className="absolute p-2 text-white bg-black bg-opacity-50 rounded-full left-4 hover:bg-opacity-70"
            >
              <ChevronLeft size={32} />
            </button>
            
            <button
              onClick={goToNext}
              className="absolute p-2 text-white bg-black bg-opacity-50 rounded-full right-4 hover:bg-opacity-70"
            >
              <ChevronRight size={32} />
            </button>

            <div className="w-full max-w-4xl max-h-full">
              <img
                src={contentState.images[selectedImage].url}
                alt={contentState.images[selectedImage].title}
                className="object-contain w-full h-auto max-h-full"
              />
              <div className="mt-4 text-center text-white">
                <h3 className="text-xl font-semibold">{contentState.images[selectedImage].title}</h3>
                <p className="text-gray-300">{contentState.images[selectedImage].category}</p>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default Gallery;
