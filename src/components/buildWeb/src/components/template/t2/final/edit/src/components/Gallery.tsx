// components/Gallery.tsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Edit, Save, Plus, Trash2 } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { toast } from "react-toastify";

const Gallery = ({galleryData,onStateChange, userId, publishedId, templateSelection }) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [pendingImages, setPendingImages] = useState<Record<number, File>>({});
  const { theme } = useTheme();
  
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

  // Add a new image
  const addImage = () => {
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

  // Image selection handler
  const handleGalleryImageSelect = async (index, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('File size must be less than 5MB');
      return;
    }

    // Store the file for upload on Save
    setPendingImages(prev => ({ ...prev, [index]: file }));
    
    // Show immediate local preview
    const reader = new FileReader();
    reader.onloadend = () => {
      updateImageField(index, "url", reader.result);
    };
    reader.readAsDataURL(file);
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
        formData.append('imageField', `images[${index}].url`);
        formData.append('templateSelection', templateSelection);

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
          return; // Don't exit edit mode
        }
      }
      
      // Clear pending images
      setPendingImages({});
      // Exit edit mode
      setIsEditing(false);
      toast.success('Gallery section saved with S3 URLs ready for publish');

    } catch (error) {
      console.error('Error saving gallery section:', error);
      toast.error('Error saving changes. Please try again.');
      // Keep in edit mode so user can retry
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
    <section 
      id="gallery" 
      className={`py-20 theme-transition ${
        theme === "dark" 
          ? "bg-[#1f1f1f] text-gray-100" 
          : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              className="bg-yellow-500 text-black px-4 py-2 rounded cursor-pointer hover:shadow-2xl shadow-xl hover:font-semibold flex items-center gap-2"
            >
              <Edit size={16} />
              Edit
            </motion.button>
          )}
        </div>

        <div className="text-center mb-16">
          {isEditing ? (
            <>
              <input
                type="text"
                value={contentState.heading.title}
                onChange={(e) => updateHeaderField("title", e.target.value)}
                className="text-3xl font-bold mb-4 border-b bg-transparent text-center"
              />
              <textarea
                value={contentState.heading.description}
                onChange={(e) => updateHeaderField("description", e.target.value)}
                className="text-lg max-w-3xl mx-auto border-b bg-transparent text-center w-full"
              />
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold mb-4">{contentState.heading.title}</h2>
              <p className="text-lg max-w-3xl mx-auto">
                {contentState.heading.description}
              </p>
            </>
          )}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-6">
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
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No image</span>
                  </div>
                )}
                
                {isEditing && (
                  <motion.div
                    animate={{opacity:[0,1], scale:[0.8,1]}}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{scale:0.9}}
                    transition={{ duration: 0.3 }}
                    className="absolute mx-2 bottom-2 left-2 z-50 bg-white/80 p-1 rounded"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="text-xs w-full cursor-pointer"
                      onChange={(e) => handleGalleryImageSelect(index, e)}
                    />
                    {pendingImages[index] && (
                      <p className="text-xs text-orange-600 mt-1">
                        Image selected: {pendingImages[index].name} (will upload on save)
                      </p>
                    )}
                  </motion.div>
                )}
                
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-end">
                  <div className="p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-full">
                    {isEditing ? (
                      <>
                        <input
                          value={image.title}
                          onChange={(e) => updateImageField(index, "title", e.target.value)}
                          className="font-semibold bg-transparent border-b w-full mb-1"
                        />
                        <input
                          value={image.category}
                          onChange={(e) => updateImageField(index, "category", e.target.value)}
                          className="text-sm bg-transparent border-b w-full"
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
                    className="absolute top-2 right-2 text-white p-1 bg-red-500 rounded-full"
                  >
                    <Trash2 size={16} />
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
          
          {isEditing && (
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
      </div>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div className="fixed top-[8rem] inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70"
          >
            <X size={24} />
          </button>
          
          <button
            onClick={goToPrev}
            className="absolute left-4 text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70"
          >
            <ChevronLeft size={32} />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70"
          >
            <ChevronRight size={32} />
          </button>

          <div className="max-w-4xl w-full max-h-full">
            <img
              src={contentState.images[selectedImage].url}
              alt={contentState.images[selectedImage].title}
              className="w-full h-auto max-h-full object-contain"
            />
            <div className="text-white text-center mt-4">
              <h3 className="text-xl font-semibold">{contentState.images[selectedImage].title}</h3>
              <p className="text-gray-300">{contentState.images[selectedImage].category}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;