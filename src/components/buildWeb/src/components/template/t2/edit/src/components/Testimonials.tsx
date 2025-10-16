import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "./ui/card";
import { Star, X, RotateCw, ZoomIn } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { toast } from "react-toastify";
import Cropper from 'react-easy-crop';

export default function Testimonials({testimonialsData, onStateChange, userId, publishedId, templateSelection}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Cropping states for testimonial images
  const [showCropper, setShowCropper] = useState(false);
  const [croppingFor, setCroppingFor] = useState(null); // { index, field }
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  
  // Pending images for upload
  const [pendingTestimonialImages, setPendingTestimonialImages] = useState({});

  // Merged all state into a single object
  const [testimonialsSection, setTestimonialsSection] = useState(testimonialsData);

  // Add this useEffect to notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(testimonialsSection);
    }
  }, [testimonialsSection, onStateChange]);

  // Handlers for testimonials
  const updateTestimonial = (idx, field, value) => {
    setTestimonialsSection(prev => ({
      ...prev,
      testimonials: prev.testimonials.map((t, i) => 
        i === idx ? { ...t, [field]: value } : t
      )
    }));
  };
  
  const removeTestimonial = (idx) => {
    setTestimonialsSection(prev => ({
      ...prev,
      testimonials: prev.testimonials.filter((_, i) => i !== idx)
    }));
  };
  
  const addTestimonial = () => {
    setTestimonialsSection(prev => ({
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
      ]
    }));
  };

  // Image selection handler for testimonials
  const handleTestimonialImageSelect = (e, index) => {
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
      setCroppingFor({ index, field: 'image' });
      setShowCropper(true);
      // Reset crop settings
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
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

    // Set canvas size to the desired crop size
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // Translate and rotate the context
    ctx.translate(pixelCrop.width / 2, pixelCrop.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-pixelCrop.width / 2, -pixelCrop.height / 2);

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
      canvas.toBlob((blob) => {
        // Create a proper file with original file name or generate one
        const fileName = originalFile ? 
          `cropped-${originalFile.name}` : 
          `cropped-testimonial-${Date.now()}.jpg`;
        
        const file = new File([blob], fileName, { 
          type: 'image/jpeg',
          lastModified: Date.now()
        });
        
        // Create object URL for preview
        const previewUrl = URL.createObjectURL(blob);
        
        resolve({ 
          file, 
          previewUrl 
        });
      }, 'image/jpeg', 0.95);
    });
  };

  // Apply crop for testimonial image
  const applyCrop = async () => {
    try {
      if (!imageToCrop || !croppedAreaPixels || !croppingFor) {
        toast.error('Please select an area to crop');
        return;
      }

      const { file, previewUrl } = await getCroppedImg(imageToCrop, croppedAreaPixels, rotation);
      
      // Update preview immediately with blob URL (temporary)
      updateTestimonial(croppingFor.index, croppingFor.field, previewUrl);
      
      // Set the actual file for upload on save
      setPendingTestimonialImages(prev => ({
        ...prev,
        [`${croppingFor.index}`]: file
      }));

      toast.success('Image cropped successfully! Click Save to upload to S3.');
      setShowCropper(false);
      setImageToCrop(null);
      setOriginalFile(null);
      setCroppingFor(null);
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
    setCroppingFor(null);
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

  // Save handler with image upload
  const handleSave = async () => {
    try {
      setIsUploading(true);

      // Upload testimonial images if any
      const uploadPromises = Object.entries(pendingTestimonialImages).map(async ([index, file]) => {
        if (!userId || !publishedId || !templateSelection) {
          console.error('Missing required props:', { userId, publishedId, templateSelection });
          throw new Error('Missing user information');
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('sectionName', 'testimonials');
        formData.append('imageField', `testimonial-${index}-${Date.now()}`);
        formData.append('templateSelection', templateSelection);

        console.log(`Uploading testimonial image ${index} to S3:`, file);

        const uploadResponse = await fetch(`https://o66ziwsye5.execute-api.ap-south-1.amazonaws.com/prod/upload-image/${userId}/${publishedId}`, {
          method: 'POST',
          body: formData,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          // Update with actual S3 URL, not blob URL
          updateTestimonial(parseInt(index), 'image', uploadData.imageUrl);
          console.log(`Testimonial image ${index} uploaded to S3:`, uploadData.imageUrl);
          return { index, success: true };
        } else {
          const errorData = await uploadResponse.json();
          console.error(`Testimonial image ${index} upload failed:`, errorData);
          throw new Error(`Testimonial image upload failed: ${errorData.message || 'Unknown error'}`);
        }
      });

      if (uploadPromises.length > 0) {
        await Promise.all(uploadPromises);
        toast.success('Testimonial images uploaded to S3 successfully!');
      }

      // Clear pending images
      setPendingTestimonialImages({});
      
      // Exit edit mode
      setIsEditing(false);
      toast.success('Testimonials section saved!');

    } catch (error) {
      console.error('Error saving testimonials section:', error);
      toast.error('Error saving changes. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Duplicate testimonials for marquee loop (showing 3 at a time)
  const duplicatedTestimonials = [...testimonialsSection.testimonials, ...testimonialsSection.testimonials];

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
      {/* Image Cropper Modal - Same as Hero */}
      {showCropper && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800">
                Crop Testimonial Image
              </h3>
              <button 
                onClick={cancelCrop}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            
            {/* Cropper Area */}
            <div className="flex-1 relative bg-gray-900">
              <div className="relative h-96 w-full">
                <Cropper
                  image={imageToCrop}
                  crop={crop}
                  zoom={zoom}
                  rotation={rotation}
                  aspect={1} // Square aspect ratio for testimonial images
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                  showGrid={false}
                  cropShape="rect"
                  style={{
                    containerStyle: {
                      position: 'relative',
                      width: '100%',
                      height: '100%',
                    },
                    cropAreaStyle: {
                      border: '2px solid white',
                      borderRadius: '8px',
                    }
                  }}
                />
              </div>
            </div>
            
            {/* Controls */}
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <div className="space-y-4">
                {/* Zoom Control */}
                <div className="space-y-2">
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
                    min={1}
                    max={3}
                    step={0.1}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
                  />
                </div>
                
                {/* Rotation Control */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-gray-700">
                      <RotateCw className="w-4 h-4" />
                      Rotation
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
                    className="w-full h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
                  />
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="mt-6 flex gap-3 justify-between">
                <Button
                  variant="outline"
                  onClick={resetCropSettings}
                  className="border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Reset
                </Button>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={cancelCrop}
                    className="border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={applyCrop}
                    className="bg-green-600 hover:bg-green-700 text-white px-6"
                  >
                    Apply Crop
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      <motion.section
        id='testimonial'
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
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {isEditing ? (
              <>
                <input
                  value={testimonialsSection.headline.title}
                  onChange={e => setTestimonialsSection(prev => ({
                    ...prev,
                    headline: { ...prev.headline, title: e.target.value }
                  }))}
                  className="text-3xl md:text-4xl text-foreground mb-4 w-full text-center bg-transparent border-b font-bold"
                />
                <textarea
                  value={testimonialsSection.headline.description}
                  onChange={e => setTestimonialsSection(prev => ({
                    ...prev,
                    headline: { ...prev.headline, description: e.target.value }
                  }))}
                  className="text-lg text-muted-foreground w-full text-center bg-transparent border-b"
                  rows={2}
                />
              </>
            ) : (
              <>
                <h2 className="text-3xl md:text-4xl text-foreground mb-4">
                {testimonialsSection.headline.title}
                </h2>
                <p className="text-lg text-muted-foreground">
                  {testimonialsSection.headline.description}
                </p>
              </>
            ) }
          </motion.div>

          {/* Testimonials Marquee Container */}
          <div className="group w-full overflow-hidden">
            <style>
              {`
                @keyframes marquee {
                  0% { transform: translateX(0%); }
                  100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                  animation: marquee 60s linear infinite;
                }
                .group:hover .animate-marquee {
                  animation-play-state: paused;
                }
              `}
            </style>
            
            {isEditing && (
              <motion.div 
                whileTap={{scale:0.9}}
                whileHover={{scale:1.1}}
                className="flex items-center justify-center mb-8"
              >
                <Button onClick={addTestimonial} className="text-green-600 cursor-pointer">
                  + Add Testimonial
                </Button>
              </motion.div>
            )}

            {isEditing ? (
              // Grid layout for editing
              <motion.div
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={containerVariants}
                transition={{duration: 0.8}}
                animate={{opacity:[0,1],y:[50,0]}}
                viewport={{ once: true }}
              >
                {testimonialsSection.testimonials.map((testimonial, index) => (
                  <TestimonialCard 
                    key={index}
                    testimonial={testimonial}
                    index={index}
                    isEditing={isEditing}
                    updateTestimonial={updateTestimonial}
                    removeTestimonial={removeTestimonial}
                    onImageSelect={handleTestimonialImageSelect}
                    hasPendingImage={pendingTestimonialImages[index]}
                  />
                ))}
              </motion.div>
            ) : (
              // Marquee layout for non-editing
              <motion.div
                className="flex gap-8 animate-marquee"
                variants={containerVariants}
                transition={{duration: 0.8}}
                animate={{opacity:[0,1],y:[50,0]}}
                viewport={{ once: true }}
              >
                {duplicatedTestimonials.map((testimonial, index) => (
                  <div key={index} className="flex-shrink-0 w-80 lg:w-96">
                    <TestimonialCard 
                      testimonial={testimonial}
                      index={index % testimonialsSection.testimonials.length}
                      isEditing={isEditing}
                      updateTestimonial={updateTestimonial}
                      removeTestimonial={removeTestimonial}
                      onImageSelect={handleTestimonialImageSelect}
                      hasPendingImage={pendingTestimonialImages[index % testimonialsSection.testimonials.length]}
                    />
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          
        </div>
      </motion.section>
    </>
  );
}

// Updated Testimonial Card Component with image upload
function TestimonialCard({ testimonial, index, isEditing, updateTestimonial, removeTestimonial, onImageSelect, hasPendingImage }) {
  return (
    <motion.div
      variants={{
        hidden: { y: 50, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1,
          transition: {
            duration: 0.8,
            ease: "easeOut",
          },
        },
      }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="bg-card border-border hover:shadow-xl transition-all duration-300 hover:border-primary/30 h-full flex flex-col">
        <CardContent className="p-8 flex flex-col flex-grow">
          {/* Rating */}
          <div className="flex space-x-1 mb-4 flex-shrink-0">
            {[...Array(testimonial.rating)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.1 + i * 0.05,
                  duration: 0.4,
                  type: "spring",
                }}
                whileHover={{ scale: 1.2 }}
              >
                <Star className="h-5 w-5 fill-primary text-primary" />
              </motion.div>
            ))}
          </div>

          {/* Quote */}
          <div className="flex-grow mb-6">
            {isEditing ? (
              <textarea
                value={testimonial.quote}
                onChange={(e) =>
                  updateTestimonial(index, "quote", e.target.value)
                }
                className="text-card-foreground leading-relaxed w-full border-b bg-transparent min-h-[120px]"
                rows={4}
              />
            ) : (
              <blockquote className="text-card-foreground leading-relaxed min-h-[120px]">
                <span className="text-card-foreground leading-relaxed line-clamp-6">
                  {testimonial.quote}
                </span>
              </blockquote>
            )}
          </div>

          {/* Author */}
          <div className="flex items-center space-x-4 mt-auto">
            <motion.div
              className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 relative"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <ImageWithFallback
                src={testimonial.image}
                alt={testimonial.name}
                className="w-full h-full object-cover"
              />
              {isEditing && (
                <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => onImageSelect(e, index)}
                  />
                </label>
              )}
              {hasPendingImage && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" title="Image ready for upload" />
              )}
            </motion.div>
            <div className="flex-grow min-w-0">
              {isEditing ? (
                <>
                  <input
                    value={testimonial.name}
                    onChange={(e) =>
                      updateTestimonial(index, "name", e.target.value)
                    }
                    className="font-medium text-card-foreground w-full border-b bg-transparent"
                  />
                  <input
                    value={testimonial.role}
                    onChange={(e) =>
                      updateTestimonial(index, "role", e.target.value)
                    }
                    className="text-sm text-muted-foreground w-full border-b bg-transparent mt-1"
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm">Rating:</span>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={testimonial.rating}
                      onChange={(e) =>
                        updateTestimonial(
                          index,
                          "rating",
                          Number(e.target.value)
                        )
                      }
                      className="w-16 border rounded px-2 py-1 text-sm"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="hover:scale-105 cursor-pointer ml-2"
                      onClick={() => removeTestimonial(index)}
                    >
                      Remove
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="font-medium text-card-foreground truncate">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-muted-foreground truncate">
                    {testimonial.role}
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}