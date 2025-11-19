import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryItem {
  type: string;
  src: string;
  title: string;
}

interface GalleryContent {
  title: string;
  titleHighlight: string;
  subtitle: string;
  items: GalleryItem[];
}

interface GallerySectionProps {
  galleryData?: GalleryContent;
}

/** Default data structure */
const defaultGalleryContent: GalleryContent = {
  title: "Exhibitors",
  titleHighlight: "Interview",
  subtitle: "Catch our exclusive interviews with top exhibitors sharing their insights and innovations.",
  items: [
    {
      type: 'video',
      src: 'https://www.youtube.com/embed/tZw1ouQhef0?autoplay=0&mute=1&controls=1&loop=1&playlist=tZw1ouQhef0',
      title: 'Video 1'
    },
    {
      type: 'video',
      src: 'https://www.youtube.com/embed/Mwn-_bvzkYA?autoplay=0&mute=1&controls=1&loop=1&playlist=Mwn-_bvzkYA',
      title: 'Video 2'
    }
  ]
};

const GallerySection: React.FC<GallerySectionProps> = ({ galleryData }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Use prop data or default values
  const galleryContent = galleryData || defaultGalleryContent;

  // Helper function to convert YouTube URLs to embed format
  const convertToEmbedUrl = (url: string): string => {
    if (!url) return "";
    
    // If it's already an embed URL, return as is
    if (url.includes('youtube.com/embed/')) {
      return url;
    }
    
    // Extract video ID from different YouTube URL formats
    let videoId = '';
    
    // Handle youtu.be format
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    }
    // Handle youtube.com/watch format
    else if (url.includes('youtube.com/watch')) {
      const urlParams = new URLSearchParams(url.split('?')[1]);
      videoId = urlParams.get('v') || '';
    }
    
    // If we found a video ID, create embed URL with controls for gallery
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=0&mute=1&controls=1&loop=1&playlist=${videoId}`;
    }
    
    // Return original URL if we can't parse it
    return url;
  };

  // Custom carousel navigation
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % galleryContent.items.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + galleryContent.items.length) % galleryContent.items.length);
  };

  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            {galleryContent.title} <span className="text-[#FF0000]">{galleryContent.titleHighlight}</span>
          </h2>
          <div className="w-24 h-1 bg-[#FFD400] mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {galleryContent.subtitle}
          </p>
        </div>

        <div className="relative">
          {galleryContent.items.length === 0 ? (
            <div className="text-center py-16 bg-gray-100 rounded-2xl">
              <p className="text-gray-500 text-lg">No videos available</p>
            </div>
          ) : (
            <>
              <div className="relative overflow-hidden rounded-2xl shadow-lg">
                <iframe
                  key={galleryContent.items[currentSlide]?.src}
                  src={convertToEmbedUrl(galleryContent.items[currentSlide]?.src || '')}
                  title={galleryContent.items[currentSlide]?.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-[530px] rounded-xl"
                ></iframe>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                  <h3 className="text-white font-semibold text-lg">{galleryContent.items[currentSlide]?.title}</h3>
                </div>
              </div>
              {galleryContent.items.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-colors"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-colors"
                  >
                    <ChevronRight size={24} />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {galleryContent.items.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          currentSlide === index ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;