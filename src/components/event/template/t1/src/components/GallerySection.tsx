import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const galleryItems = [
  {
    type: "video",
    src: "https://www.youtube.com/embed/tZw1ouQhef0?autoplay=0&mute=1&controls=1&loop=1&playlist=tZw1ouQhef0",
    title: "Drone Innovation Video 1",
  },
  {
    type: "video",
    src: "https://www.youtube.com/embed/Mwn-_bvzkYA?autoplay=0&mute=1&controls=1&loop=1&playlist=Mwn-_bvzkYA",
    title: "Drone Innovation Video 2",
  },
  {
    type: "video",
    src: "https://www.youtube.com/embed/UBf6wACbMwY?autoplay=0&mute=1&controls=1&loop=1&playlist=UBf6wACbMwY",
    title: "Drone Innovation Video 3",
  },
  {
    type: "video",
    src: "https://www.youtube.com/embed/4lMdajZ0kGg?autoplay=0&mute=1&controls=1&loop=1&playlist=4lMdajZ0kGg",
    title: "Drone Innovation Video 4",
  },
  {
    type: "video",
    src: "https://www.youtube.com/embed/KL-vhCrcWjY?autoplay=0&mute=1&controls=1&loop=1&playlist=KL-vhCrcWjY",
    title: "Drone Innovation Video 5",
  },
];

const GallerySection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Custom carousel navigation
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % galleryItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + galleryItems.length) % galleryItems.length
    );
  };

  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-16 relative">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Exhibitors <span className="text-[#FF0000]">Interview</span>
          </h2>
          <div className="w-24 h-1 bg-[#FFD400] mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Catch our exclusive interviews with top exhibitors sharing their
            insights and innovations.
          </p>
        </div>

        <div className="relative">
          <div className="relative overflow-hidden rounded-2xl shadow-lg">
            <iframe
              src={galleryItems[currentSlide].src}
              title={galleryItems[currentSlide].title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-[500px] rounded-xl"
            ></iframe>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
              <h3 className="text-white font-semibold text-lg">
                {galleryItems[currentSlide].title}
              </h3>
            </div>
          </div>
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
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
