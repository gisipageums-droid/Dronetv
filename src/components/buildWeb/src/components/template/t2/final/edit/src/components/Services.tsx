import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { X, CheckCircle, RotateCw, ZoomIn } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "react-toastify";
import Cropper from 'react-easy-crop';

export default function Services({serviceData, onStateChange, userId, publishedId, templateSelection}) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedServiceIndex, setSelectedServiceIndex] = useState<number | null>(null);
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
    setServicesSection(prev => ({
      ...prev,
      services: prev.services.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    }));
    
    // Update categories if needed
    if (field === "category" && !servicesSection.categories.includes(value)) {
      setServicesSection(prev => ({
        ...prev,
        categories: [...prev.categories, value]
      }));
    }
  };

  const updateServiceList = (
    index: number,
    field: "features" | "benefits" | "process",
    listIndex: number,
    value: string
  ) => {
    setServicesSection(prev => ({
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
      )
    }));
  };

  const addToList = (index: number, field: "features" | "benefits" | "process") => {
    setServicesSection(prev => ({
      ...prev,
      services: prev.services.map((s, i) =>
        i === index ? { ...s, [field]: [...s[field], "New Item"] } : s
      )
    }));
  };

  const removeFromList = (
    index: number,
    field: "features" | "benefits" | "process",
    listIndex: number
  ) => {
    setServicesSection(prev => ({
      ...prev,
      services: prev.services.map((s, i) =>
        i === index
          ? {
              ...s,
              [field]: s[field].filter((_: string, li: number) => li !== listIndex),
            }
          : s
      )
    }));
  };

  // Image selection handler - now opens cropper
  const handleServiceImageSelect = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
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
          `cropped-service-${croppingIndex}-${originalFile.name}` : 
          `cropped-service-${croppingIndex}-${Date.now()}.jpg`;
        
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
      updateServiceField(croppingIndex, "image", previewUrl);
      
      // Set the actual file for upload on save
      setPendingImages(prev => ({ ...prev, [croppingIndex]: file }));
      console.log('Service image cropped, file ready for upload:', file);

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
        formData.append('sectionName', 'services');
        formData.append('imageField', `services[${index}].image`+Date.now());
        formData.append('templateSelection', templateSelection);

        console.log('Uploading service image to S3:', file);

        const uploadResponse = await fetch(`https://o66ziwsye5.execute-api.ap-south-1.amazonaws.com/prod/upload-image/${userId}/${publishedId}`, {
          method: 'POST',
          body: formData,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          // Replace local preview with S3 URL
          updateServiceField(index, "image", uploadData.imageUrl);
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
      toast.success('Services section saved with S3 URLs!');

    } catch (error) {
      console.error('Error saving services section:', error);
      toast.error('Error saving changes. Please try again.');
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
    
    setServicesSection(prev => ({
      ...prev,
      services: [...prev.services, newService]
    }));
    
    if (!servicesSection.categories.includes("New Category")) {
      setServicesSection(prev => ({
        ...prev,
        categories: [...prev.categories, "New Category"]
      }));
    }
  };

  const removeService = (index: number) => {
    setServicesSection(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const addCategory = () => {
    const newCategory = `New Category ${servicesSection.categories.length}`;
    if (!servicesSection.categories.includes(newCategory)) {
      setServicesSection(prev => ({
        ...prev,
        categories: [...prev.categories, newCategory]
      }));
    }
  };

  const removeCategory = (cat: string) => {
    if (cat !== "All") {
      setServicesSection(prev => ({
        ...prev,
        categories: prev.categories.filter((c) => c !== cat),
        services: prev.services.map((s) => 
          s.category === cat ? { ...s, category: "Uncategorized" } : s
        )
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
                Crop Image
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
                  aspect={4/3}
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
            
            {/* Controls - Same as Hero */}
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
                <button
                  onClick={resetCropSettings}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
                >
                  Reset
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={cancelCrop}
                    className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={applyCrop}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
                  >
                    Apply Crop
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Main Services Section */}
      <motion.section id="services" className="py-20 bg-background theme-transition">
        <div className="max-w-7xl mx-auto px-4">
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
                className="bg-yellow-500 text-black px-4 py-2 rounded cursor-pointer hover:shadow-2xl shadow-xl hover:font-semibold"
              >
                Edit
              </motion.button>
            )}
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            {isEditing ? (
              <>
                <input 
                  type="text" 
                  className="text-3xl font-bold block text-center w-full"  
                  value={servicesSection.heading.head} 
                  onChange={(e) => setServicesSection(prev => ({
                    ...prev,
                    heading: {...prev.heading, head: e.target.value}
                  }))}
                />
                <input 
                  type="text" 
                  className="text-muted-foreground block w-full text-center" 
                  value={servicesSection.heading.desc} 
                  onChange={(e) => setServicesSection(prev => ({
                    ...prev,
                    heading: {...prev.heading, desc: e.target.value}
                  }))}
                />
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold">{servicesSection.heading.head}</h2>
                <p className="text-muted-foreground">{servicesSection.heading.desc}</p>
              </>
            )}          
          </div>

          {/* Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {servicesSection.categories.map((cat, i) => (
              <div key={i} className="flex items-center gap-2">
                {isEditing ? (
                  <input
                    value={cat}
                    onChange={(e) =>
                      setServicesSection(prev => ({
                        ...prev,
                        categories: prev.categories.map((c, idx) => 
                          idx === i ? e.target.value : c
                        )
                      }))
                    }
                    className="border-b px-2"
                  />
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
                    className="text-red-500 text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            {isEditing && (
              <motion.button
                whileTap={{scale:0.9}}
                whileHover={{scale:1.1}}
                onClick={addCategory}
                className="text-green-600 text-sm font-medium"
              >
                + Add Category
              </motion.button>
            )}
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleServices.map((service, index) => (
              <Card key={index} className="relative flex flex-col h-full border-2 shadow-lg hover:shadow-xl  shadow-gray-500">
                <div className="h-40 overflow-hidden relative flex-shrink-0">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                  {isEditing && (
                    <motion.div
                      animate={{ scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="absolute bottom-2 left-2 bg-white/80 p-1 rounded"
                    >
                      <input
                        type="file"
                        accept="image/*"
                        className="text-xs w-full cursor-pointer"
                        onChange={(e) => handleServiceImageSelect(index, e)}
                      />
                      {pendingImages[index] && (
                        <p className="text-xs text-green-600 mt-1">
                          ✓ Image cropped and ready to upload
                        </p>
                      )}
                    </motion.div>
                  )}
                </div>
                <div className="flex flex-col flex-grow p-6">
                  <div className="flex-shrink-0 mb-4">
                    {isEditing ? (
                      <input
                        value={service.title}
                        onChange={(e) =>
                          updateServiceField(index, "title", e.target.value)
                        }
                        className="border-b w-full font-bold text-lg"
                      />
                    ) : (
                      <CardTitle className="line-clamp-2 min-h-[3rem]">{service.title}</CardTitle>
                    )}
                  </div>
                  <div className="flex-grow mb-4">
                    {isEditing ? (
                      <>
                        <textarea
                          value={service.description}
                          onChange={(e) =>
                            updateServiceField(index, "description", e.target.value)
                          }
                          className="border-b w-full min-h-[4rem]"
                        />
                        <input
                          value={service.category}
                          onChange={(e) =>
                            updateServiceField(index, "category", e.target.value)
                          }
                          className="border-b w-full mt-2"
                        />
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-muted-foreground line-clamp-3 min-h-[4rem]">
                          {service.description}
                        </p>
                        <p className="text-xs mt-1 italic text-gray-500">
                          Category: {service.category}
                        </p>
                      </>
                    )}
                  </div>

                  <div className="mt-auto flex gap-2">
                    <Button className="cursor-pointer hover:scale-105 flex-1" size="sm" onClick={() => openModal(service, index)}>
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
                <Button onClick={addService} className="text-green-600 cursor-pointer hover:scale-105">
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
            {visibleCount >= filteredServices.length && filteredServices.length > 3 && (
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

        {/* Modal */}
        <AnimatePresence>
          {isModalOpen && selectedServiceIndex !== null && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            >
              <div
                className="bg-card rounded-xl w-full max-w-3xl p-6 relative top-16 h-180 z-100 overflow-y-auto max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 bg-gray-500 rounded-full p-2"
                >
                  <X className="w-5 h-5" />
                </button>

                {isEditing ? (
                  <input
                    value={servicesSection.services[selectedServiceIndex].title}
                    onChange={(e) =>
                      updateServiceField(selectedServiceIndex, "title", e.target.value)
                    }
                    className="border-b w-full text-2xl font-bold mb-4"
                  />
                ) : (
                  <h2 className="text-2xl font-bold mb-4">{servicesSection.services[selectedServiceIndex].title}</h2>
                )}

                {isEditing ? (
                  <textarea
                    value={servicesSection.services[selectedServiceIndex].detailedDescription}
                    onChange={(e) =>
                      updateServiceField(selectedServiceIndex, "detailedDescription", e.target.value)
                    }
                    className="border-b w-full mb-4"
                  />
                ) : (
                  <p className="text-muted-foreground mb-4">
                    {servicesSection.services[selectedServiceIndex].detailedDescription}
                  </p>
                )}

                {/* Benefits */}
                <h3 className="font-semibold mb-2">Key Benefits</h3>
                <ul className="space-y-2 mb-4">
                  {servicesSection.services[selectedServiceIndex].benefits.map((b: string, bi: number) => (
                    <li key={bi} className="flex gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                      {isEditing ? (
                        <div className="flex flex-col gap-1 w-full">
                          <input
                            value={b}
                            onChange={(e) =>
                              updateServiceList(selectedServiceIndex, "benefits", bi, e.target.value)
                            }
                            className="border-b w-full"
                          />
                          <motion.button
                            whileHover={{scale:1.1}}
                            whileTap={{scale:0.9}}
                            onClick={() =>
                              removeFromList(selectedServiceIndex, "benefits", bi)
                            }
                            className="text-xs text-red-500"
                          >
                            ✕ Remove
                          </motion.button>
                        </div>
                      ) : (
                        <span>{b}</span>
                      )}
                    </li>
                  ))}
                </ul>
                {isEditing && (
                  <button
                    onClick={() =>
                      addToList(selectedServiceIndex, "benefits")
                    }
                    className="text-xs text-green-600 mb-4"
                  >
                    + Add Benefit
                  </button>
                )}

                {/* Process */}
                <h3 className="font-semibold mb-2">Our Process</h3>
                <ol className="space-y-2 mb-4">
                  {servicesSection.services[selectedServiceIndex].process.map((p: string, pi: number) => (
                    <li key={pi}>
                      {isEditing ? (
                        <div className="flex flex-col gap-1 w-full">
                          <input
                            value={p}
                            onChange={(e) =>
                              updateServiceList(selectedServiceIndex, "process", pi, e.target.value)
                            }
                            className="border-b w-full"
                          />
                          <motion.button
                            whileHover={{scale:1.1}}
                            whileTap={{scale:0.9}}
                            onClick={() =>
                              removeFromList(selectedServiceIndex, "process", pi)
                            }
                            className="text-xs text-red-500"
                          >
                            ✕ Remove
                          </motion.button>
                        </div>
                      ) : (
                        <span>{p}</span>
                      )}
                    </li>
                  ))}
                </ol>
                {isEditing && (
                  <motion.button
                    whileHover={{scale:1.1}}
                    whileTap={{scale:0.9}}
                    onClick={() =>
                      addToList(selectedServiceIndex, "process")
                    }
                    className="text-xs text-green-600 mb-4"
                  >
                    + Add Step
                  </motion.button>
                )}

                {/* Pricing & Timeline */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Pricing</h3>
                    {isEditing ? (
                      <input
                        value={servicesSection.services[selectedServiceIndex].pricing}
                        onChange={(e) =>
                          updateServiceField(selectedServiceIndex, "pricing", e.target.value)
                        }
                        className="border-b w-full"
                      />
                    ) : (
                      <p>{servicesSection.services[selectedServiceIndex].pricing}</p>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Timeline</h3>
                    {isEditing ? (
                      <input
                        value={servicesSection.services[selectedServiceIndex].timeline}
                        onChange={(e) =>
                          updateServiceField(selectedServiceIndex, "timeline", e.target.value)
                        }
                        className="border-b w-full"
                      />
                    ) : (
                      <p>{servicesSection.services[selectedServiceIndex].timeline}</p>
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