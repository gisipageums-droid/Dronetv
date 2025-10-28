import { useState, useEffect, useCallback } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { toast } from "react-toastify";
import { X, RotateCw, ZoomIn } from "lucide-react";
import Cropper from 'react-easy-crop';

export default function Clients({clientData, onStateChange, userId, publishedId, templateSelection}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Cropping states
  const [showCropper, setShowCropper] = useState(false);
  const [croppingFor, setCroppingFor] = useState(null); // { index: number }
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [pendingImages, setPendingImages] = useState({});

  // Merged all state into a single object
  const [clientsSection, setClientsSection] = useState(clientData);

  // Add this useEffect to notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(clientsSection);
    }
  }, [clientsSection, onStateChange]);

  // Handlers for clients
  const updateClient = (idx, field, value) => {
    setClientsSection(prev => ({
      ...prev,
      clients: prev.clients.map((c, i) => (i === idx ? { ...c, [field]: value } : c))
    }));
  };
  
  const removeClient = (idx) => {
    setClientsSection(prev => ({
      ...prev,
      clients: prev.clients.filter((_, i) => i !== idx)
    }));
  };
  
  const addClient = () => {
    setClientsSection(prev => ({
      ...prev,
      clients: [...prev.clients, { name: "New Client", image: "" }]
    }));
  };

  // Handlers for stats
  const updateStat = (idx, field, value) => {
    setClientsSection(prev => ({
      ...prev,
      stats: prev.stats.map((s, i) => (i === idx ? { ...s, [field]: value } : s))
    }));
  };
  
  const removeStat = (idx) => {
    setClientsSection(prev => ({
      ...prev,
      stats: prev.stats.filter((_, i) => i !== idx)
    }));
  };
  
  const addStat = () => {
    setClientsSection(prev => ({
      ...prev,
      stats: [...prev.stats, { value: "New", label: "New Stat" }]
    }));
  };

  // Image cropping functionality
  const handleClientImageSelect = (index, e) => {
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
      setCroppingFor({ index });
      setShowCropper(true);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
    };
    reader.readAsDataURL(file);
    
    e.target.value = '';
  };

  // Cropper functions
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

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
          `cropped-${originalFile.name}` : 
          `cropped-client-${Date.now()}.jpg`;
        
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

  const applyCrop = async () => {
    try {
      if (!imageToCrop || !croppedAreaPixels) {
        toast.error('Please select an area to crop');
        return;
      }

      const { file, previewUrl } = await getCroppedImg(imageToCrop, croppedAreaPixels, rotation);
      
      // Update preview immediately
      updateClient(croppingFor.index, "image", previewUrl);
      
      // Set the file for upload on save
      setPendingImages(prev => ({
        ...prev,
        [croppingFor.index]: file
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

  const cancelCrop = () => {
    setShowCropper(false);
    setImageToCrop(null);
    setOriginalFile(null);
    setCroppingFor(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
  };

  const resetCropSettings = () => {
    setZoom(1);
    setRotation(0);
    setCrop({ x: 0, y: 0 });
  };

  // Save handler - uploads all pending images
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
        formData.append('sectionName', 'clients');
        formData.append('imageField', `clients[${index}].image`+Date.now());
        formData.append('templateSelection', templateSelection);

        const uploadResponse = await fetch(`https://o66ziwsye5.execute-api.ap-south-1.amazonaws.com/prod/upload-image/${userId}/${publishedId}`, {
          method: 'POST',
          body: formData,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          updateClient(index, "image", uploadData.imageUrl);
          console.log('Client image uploaded to S3:', uploadData.imageUrl);
        } else {
          const errorData = await uploadResponse.json();
          console.error('Client image upload failed:', errorData);
          toast.error(`Image upload failed: ${errorData.message || 'Unknown error'}`);
          return;
        }
      }
      
      // Clear pending images
      setPendingImages({});
      setIsEditing(false);
      toast.success('Clients section saved with S3 URLs!');

    } catch (error) {
      console.error('Error saving clients section:', error);
      toast.error('Error saving changes. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Duplicate clients for marquee loop
  const duplicatedClients = [...clientsSection.clients, ...clientsSection.clients];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const logoVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <>
      {/* Image Cropper Modal */}
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
            <div className="p-2 sm:p-3 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="text-base font-semibold text-gray-800">
                Crop Client Image
              </h3>
              <button
                onClick={cancelCrop}
                className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Cropper Area - Responsive Height */}
            <div className="flex-1 relative bg-gray-900">
              <div className="relative w-full h-[44vh] sm:h-[50vh] md:h-[56vh] lg:h-[60vh]">
                <Cropper
                  image={imageToCrop}
                  crop={crop}
                  zoom={zoom}
                  rotation={rotation}
                  aspect={1} // Square aspect ratio for client images
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
            <div className="p-2 sm:p-3 bg-gray-50 border-t border-gray-200">
              <div className="grid grid-cols-1 gap-2">
                {/* Zoom Control */}
                <div className="space-y-1.5">
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
                    className="w-full h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
                  />
                </div>

                {/* Rotation Control */}
                {/* <div className="space-y-1.5">
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
                    className="w-full h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
                  />
                </div> */}
              </div>

              {/* Action Buttons - Equal Width & Responsive */}
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  onClick={resetCropSettings}
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-100 py-1.5 text-sm"
                >
                  Reset
                </Button>

                <Button
                  variant="outline"
                  onClick={cancelCrop}
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-100 py-1.5 text-sm"
                >
                  Cancel
                </Button>

                <Button
                  onClick={applyCrop}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-1.5 text-sm"
                >
                  Apply Crop
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      <motion.section
        id='clients'
        className="py-20 bg-background theme-transition"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-6xl mx-auto px-6">

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

          {/* Section Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {isEditing ? (
              <>
                <input
                  value={clientsSection.headline.title}
                  onChange={(e) =>
                    setClientsSection(prev => ({
                      ...prev,
                      headline: { ...prev.headline, title: e.target.value }
                    }))
                  }
                  className="text-3xl md:text-4xl font-bold text-foreground mb-4 w-full text-center border-b bg-transparent"
                />
                <textarea
                  value={clientsSection.headline.description}
                  onChange={(e) =>
                    setClientsSection(prev => ({
                      ...prev,
                      headline: { ...prev.headline, description: e.target.value }
                    }))
                  }
                  className="text-lg text-muted-foreground w-full text-center border-b bg-transparent"
                  rows={2}
                />
              </>
            ) : (
              <>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {clientsSection.headline.title}
                </h2>
                <p className="text-muted-foreground text-lg">
                  {clientsSection.headline.description}
                </p>
              </>
            )}
          </motion.div>

          {/* Marquee Container */}
          <div className="group w-full overflow-hidden">
            <style>
              {`
                @keyframes marquee {
                  0% { transform: translateX(0%); }
                  100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                  animation: marquee 40s linear infinite;
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
                <Button onClick={addClient} className="cursor-pointer text-green-600">
                  + Add Client
                </Button>
              </motion.div>
            )}

            <motion.div
              className="flex gap-10 items-start text-center animate-marquee"
              variants={containerVariants}
              whileInView={{opacity:[0,1],y:[-50,0]}}
              transition={{duration:1}}
              viewport={{ once: true }}
            >
              {duplicatedClients.map((client, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center flex-shrink-0 w-32 cursor-pointer"
                  variants={logoVariants}
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="w-20 h-20 rounded-full overflow-hidden shadow-md border border-border relative"
                    whileHover={{
                      borderColor: "var(--color-primary)",
                      boxShadow: "0 10px 25px rgba(250, 204, 21, 0.3)",
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <ImageWithFallback
                      src={client.image}
                      alt={`${client.name} logo`}
                      className="w-full h-full object-cover"
                    />
                    {isEditing && (
                      <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity font-bold cursor-pointer">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleClientImageSelect(
                            index % clientsSection.clients.length,
                            e
                          )}
                        />
                      </label>
                    )}
                  </motion.div>
                  <motion.div
                    className="mt-3"
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isEditing ? (
                      <>
                        <input
                          value={client.name}
                          onChange={(e) =>
                            updateClient(
                              index % clientsSection.clients.length,
                              "name",
                              e.target.value
                            )
                          }
                          className="text-sm font-medium text-card-foreground border-b bg-transparent w-full text-center"
                        />
                        {pendingImages[index % clientsSection.clients.length] && (
                          <p className="text-xs text-green-600 mt-1">
                            ✓ Image ready to upload
                          </p>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          className="mt-2 hover:scale-105 cursor-pointer"
                          onClick={() => removeClient(index % clientsSection.clients.length)}
                        >
                          Remove
                        </Button>
                      </>
                    ) : (
                      <p className="text-sm font-medium text-card-foreground group-hover:text-primary transition-colors">
                        {client.name}
                      </p>
                    )}
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>
    </>
  );
}
