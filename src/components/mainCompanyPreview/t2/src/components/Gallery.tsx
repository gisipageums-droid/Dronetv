// components/Gallery.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "./ThemeProvider";

const Gallery = ({ galleryData }) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const { theme } = useTheme();
  
  // Use the provided data structure with default fallback
  const contentState = galleryData || {
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
  };

  const openLightbox = (index: number) => {
    setSelectedImage(index);
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
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">{contentState.heading.title}</h2>
          <p className="text-lg max-w-3xl mx-auto">
            {contentState.heading.description}
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {contentState.images.map((image, index) => (
            <motion.div
              key={image.id}
              className={`overflow-hidden rounded-lg shadow-md cursor-pointer group ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              }`}
              whileHover={{ y: -5 }}
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
                
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-end">
                  <div className="p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-full">
                    <h3 className="font-semibold">{image.title}</h3>
                    <p className="text-sm">{image.category}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
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