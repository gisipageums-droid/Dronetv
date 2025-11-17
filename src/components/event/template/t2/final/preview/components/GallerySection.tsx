import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryImage {
  id: string;
  url: string;
  caption: string;
  category: string;
}

interface GalleryData {
  subtitle: string;
  heading: string;
  description: string;
  images: GalleryImage[];
}

interface GalleryProps {
  galleryData?: any;
}

const createDefaultData = (): GalleryData => {
  const providedData = {
    subtitle: "event memories",
    heading: "Event Gallery",
    description: "Highlights and memorable moments from Tech Innovation Summit 2024",
    images: [
      {
        caption: "Opening keynote session",
        id: "1",
        category: "keynote",
        url: "https://images.unsplash.com/photo-1759873066311-ce4966c249ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTg4ODN8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGNvbmZlcmVuY2UlMjBuZXR3b3JraW5nJTIwcHJvZmVzc2lvbmFsJTIwZXZlbnR8ZW58MHwwfHx8MTc2MjY3MTYyOHww&ixlib=rb-4.1.0&q=80&w=1080"
      },
      {
        caption: "Networking session",
        id: "2",
        category: "networking",
        url: "https://images.unsplash.com/photo-1759873066311-ce4966c249ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTg4ODN8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGNvbmZlcmVuY2UlMjBuZXR3b3JraW5nJTIwcHJvZmVzc2lvbmFsJTIwZXZlbnR8ZW58MHwwfHx8MTc2MjY3MTYyOHww&ixlib=rb-4.1.0&q=80&w=1080"
      },
      {
        caption: "Workshop in progress",
        id: "3",
        category: "workshop",
        url: "https://images.unsplash.com/photo-1759873066311-ce4966c249ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTg4ODN8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGNvbmZlcmVuY2UlMjBuZXR3b3JraW5nJTIwcHJvZmVzc2lvbmFsJTIwZXZlbnR8ZW58MHwwfHx8MTc2MjY3MTYyOHww&ixlib=rb-4.1.0&q=80&w=1080"
      }
    ]
  };

  return {
    subtitle: providedData.subtitle,
    heading: providedData.heading,
    description: providedData.description,
    images: providedData.images
  };
};

export function GallerySection({ galleryData }: GalleryProps) {
  const [data, setData] = useState<GalleryData>(createDefaultData());
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  useEffect(() => {
    if (galleryData) {
      const transformedData: GalleryData = {
        subtitle: galleryData.subtitle || "event memories",
        heading: galleryData.heading || "Event Gallery",
        description: galleryData.description || "Highlights and memorable moments from our events",
        images: galleryData.images || []
      };
      setData(transformedData);
    }
  }, [galleryData]);

  const displayData = data;

  // Lightbox functions
  const handlePrevious = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? displayData.images.length - 1 : selectedImage - 1);
    }
  };

  const handleNext = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === displayData.images.length - 1 ? 0 : selectedImage + 1);
    }
  };

  return (
    <section id="gallery" className="py-16 sm:py-20 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-yellow-100 rounded-full">
              <span className="text-red-700 text-xl font-semibold">{displayData.subtitle}</span>
            </div>
            <h2 className="text-gray-900 mb-4 text-3xl sm:text-4xl md:text-5xl">{displayData.heading}</h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4">
              {displayData.description}
            </p>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {displayData.images.map((image, index) => (
              <div
                key={image.id}
                className="group relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300"
                onClick={() => setSelectedImage(index)}
              >
                <img
                  src={image.url}
                  alt={image.caption}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                    <span className="inline-block px-2 py-1 bg-blue-500 text-white text-xs rounded capitalize mb-2">
                      {image.category}
                    </span>
                    <p className="text-white text-sm sm:text-base">{image.caption}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {displayData.images.length === 0 && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 text-gray-400">📷</div>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">No Images Added</h4>
                <p className="text-gray-600">Add images to showcase your event gallery.</p>
              </div>
            </div>
          )}

          {/* Lightbox */}
          {selectedImage !== null && (
            <div
              className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedImage(null)}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 sm:top-6 right-4 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevious();
                }}
                className="absolute left-4 sm:left-6 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-4 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <div className="max-w-5xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                <img
                  src={displayData.images[selectedImage].url}
                  alt={displayData.images[selectedImage].caption}
                  className="max-w-full max-h-[80vh] object-contain rounded-lg"
                />
                <div className="text-center mt-4 sm:mt-6">
                  <span className="inline-block px-3 py-1 bg-blue-500 text-white text-sm rounded-full capitalize mb-2">
                    {displayData.images[selectedImage].category}
                  </span>
                  <p className="text-white text-base sm:text-lg">
                    {displayData.images[selectedImage].caption}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}