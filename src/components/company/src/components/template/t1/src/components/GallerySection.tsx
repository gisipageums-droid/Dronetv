import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Badge } from "./ui/badge";

const galleryData = {
  heading: {
    title: "Moments That Define Us",
    description:
      "Explore snapshots of our workspace, team, events, and the innovation that drives us every day.",
  },
  images: [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=600&fit=crop",
      title: "Innovation Hub",
      category: "Workspace",
      description:
        "Our state-of-the-art innovation lab where ideas come to life",
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1529533520516-5e45b20d07a5?w=600&h=600&fit=crop",
      title: "Team Collaboration",
      category: "Team",
      description: "Brainstorming sessions that fuel our creative process",
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=600&fit=crop",
      title: "Client Meeting",
      category: "Business",
      description: "Strategic discussions that shape successful partnerships",
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600&h=600&fit=crop",
      title: "Tech Workshop",
      category: "Events",
      description: "Hands-on workshops that push technological boundaries",
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1560806883-642f26c2825d?w=600&h=600&fit=crop",
      title: "Product Launch",
      category: "Milestones",
      description: "Celebrating the launch of our latest innovative product",
    },
    {
      id: 6,
      url: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=600&fit=crop",
      title: "Development Team",
      category: "Team",
      description: "Our dedicated team working on cutting-edge solutions",
    },
    {
      id: 7,
      url: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=600&h=600&fit=crop",
      title: "Design Studio",
      category: "Workspace",
      description: "Where user experience and design excellence meet",
    },
    {
      id: 8,
      url: "https://images.unsplash.com/photo-1542744173-05336fcc7ad4?w=600&h=600&fit=crop",
      title: "Strategy Session",
      category: "Business",
      description: "Planning the future of digital transformation",
    },
    {
      id: 9,
      url: "https://images.unsplash.com/photo-1565688534245-05d6b5be184a?w=600&h=600&fit=crop",
      title: "Award Ceremony",
      category: "Achievements",
      description: "Recognizing excellence and innovation in our industry",
    },
  ],
};

export default function GallerySection() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const sectionRef = useRef(null);

  // Intersection Observer for visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Lightbox functions
  const openLightbox = (index) => {
    setSelectedImage(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const goToNext = () => {
    if (selectedImage !== null) {
      setSelectedImage((prev) =>
        prev === galleryData.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const goToPrev = () => {
    if (selectedImage !== null) {
      setSelectedImage((prev) =>
        prev === 0 ? galleryData.images.length - 1 : prev - 1
      );
    }
  };

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="py-24 bg-gradient-to-b from-yellow-50/30 via-white to-yellow-50/20 scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-block mb-4"
          >
            <Badge className="bg-[#ffeb3b] text-gray-900 px-5 py-2 shadow-md">
              Our Gallery
            </Badge>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
            className="text-3xl md:text-4xl font-extrabold text-gray-900"
          >
            {galleryData.heading.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
            className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg"
          >
            {galleryData.heading.description}
          </motion.p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryData.images.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: 0.5 + index * 0.1,
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{
                y: -5,
                scale: 1.02,
              }}
              className="overflow-hidden rounded-lg shadow-md cursor-pointer group bg-white"
              onClick={() => openLightbox(index)}
            >
              <div className="relative overflow-hidden">
                {image.url ? (
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&h=600&fit=crop";
                    }}
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
                    <p className="text-xs mt-1 opacity-90">
                      {image.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed top-[8rem] inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 z-10"
          >
            <X size={24} />
          </button>

          <button
            onClick={goToPrev}
            className="absolute left-4 text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 z-10"
          >
            <ChevronLeft size={32} />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 z-10"
          >
            <ChevronRight size={32} />
          </button>

          <div className="max-w-4xl w-full max-h-full">
            <img
              src={galleryData.images[selectedImage].url}
              alt={galleryData.images[selectedImage].title}
              className="w-full h-auto max-h-full object-contain"
            />
            <div className="text-white text-center mt-4">
              <h3 className="text-xl font-semibold">
                {galleryData.images[selectedImage].title}
              </h3>
              <p className="text-gray-300">
                {galleryData.images[selectedImage].category}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                {galleryData.images[selectedImage].description}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </section>
  );
}
