import React, { useState } from 'react';
import { Eye, Calendar, MapPin, ArrowRight, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';

const GalleryGlimpse = () => {
  const [hoveredImage, setHoveredImage] = useState(null);

  const galleryPreview = [
    {
      id: 1,
      src: "/images/1.png",
      title: "DroneWorld Conference 2024"
    },
    {
      id: 2,
      src: "/images/2.png",
      title: "AI Partnership Event"
    },
    {
      id: 3,
      src: "/images/3.png",
      title: "GIS Mapping Workshop"
    },
    {
      id: 4,
      src: "/images/4.png",
      title: "Technology Exhibition"
    },
    {
      id: 5,
      src: "/images/5.png",
      title: "Industry Panel Discussion"
    },
    {
      id: 6,
      src: "/images/6.png",
      title: "Product Launch Event"
    },
    {
      id: 7,
      src: "/images/7.png",
      title: "Team Building Retreat"
    },
    {
      id: 8,
      src: "/images/8.png",
      title: "Partnership Signing"
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-yellow-200 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-200/20 rounded-full animate-pulse blur-2xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-yellow-400/20 rounded-full animate-pulse blur-2xl" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-yellow-400 rounded-full p-3">
              <Camera className="h-6 w-6 sm:h-8 sm:w-8 text-black" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-black tracking-tight">
              <span className="">
                Photo Gallery
              </span>
            </h2>
          </div>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-6 sm:mb-8">
            A visual journey through our events, collaborations, and memorable moments
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto rounded-full"></div>
        </div>
        
        {/* Photo Grid Preview */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-6 space-y-4 sm:space-y-6 mb-12 sm:mb-16">
          {galleryPreview.map((image, index) => (
            <div
              key={image.id}
              className="break-inside-avoid group cursor-pointer"
              style={{ 
                animationDelay: `${index * 150}ms`,
                animation: `fadeInUp 0.6s ease-out ${index * 150}ms both`
              }}
              onMouseEnter={() => setHoveredImage(image.id)}
              onMouseLeave={() => setHoveredImage(null)}
            >
              <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
                <img
                  src={image.src}
                  alt={image.title}
                  className="w-full h-auto object-cover transition-all duration-700 group-hover:scale-110"
                />
                
                {/* Hover Overlay */}
                {/* <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="absolute inset-0 bg-black/60"></div>
                  <div className="relative bg-yellow-400 text-black px-4 py-2 rounded-full font-bold shadow-2xl transform scale-0 group-hover:scale-100 transition-all duration-500 hover:bg-yellow-300 flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <span>View</span>
                  </div>
                </div> */}

                {/* Title Overlay */}
                {/* <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <h3 className="text-white font-bold text-sm line-clamp-2">
                    {image.title}
                  </h3>
                </div> */}
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-3xl p-6 sm:p-8 lg:p-12 shadow-2xl max-w-4xl mx-auto">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-4 sm:mb-6">
              View Complete Photo Gallery
            </h3>
            <p className="text-black/80 mb-6 sm:mb-8 max-w-2xl mx-auto text-base sm:text-lg">
              Browse through hundreds of high-quality photos from our events, collaborations, workshops, and team moments. 
              Experience the visual story of our journey in drone technology.
            </p>
            <Link 
              to="/gallery"
             className="inline-flex items-center gap-3 bg-yellow-400 text-black px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-yellow-500 transition-all duration-300 transform hover:scale-105 shadow-lg"

            >
              <Camera className="h-5 w-5" />
              <span>Browse All Photos</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GalleryGlimpse;
