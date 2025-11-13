import React, { useState } from 'react';
import { Edit, Save, X, Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const initialGalleryItems = [
  {
    type: 'video',
    src: 'https://www.youtube.com/embed/tZw1ouQhef0?autoplay=0&mute=1&controls=1&loop=1&playlist=tZw1ouQhef0',
    title: 'Drone Innovation Video 1'
  },
  {
    type: 'video',
    src: 'https://www.youtube.com/embed/Mwn-_bvzkYA?autoplay=0&mute=1&controls=1&loop=1&playlist=Mwn-_bvzkYA',
    title: 'Drone Innovation Video 2'
  },
  {
    type: 'video',
    src: 'https://www.youtube.com/embed/UBf6wACbMwY?autoplay=0&mute=1&controls=1&loop=1&playlist=UBf6wACbMwY',
    title: 'Drone Innovation Video 3'
  },
  {
    type: 'video',
    src: 'https://www.youtube.com/embed/4lMdajZ0kGg?autoplay=0&mute=1&controls=1&loop=1&playlist=4lMdajZ0kGg',
    title: 'Drone Innovation Video 4'
  },
  {
    type: 'video',
    src: 'https://www.youtube.com/embed/KL-vhCrcWjY?autoplay=0&mute=1&controls=1&loop=1&playlist=KL-vhCrcWjY',
    title: 'Drone Innovation Video 5'
  }
];

const GallerySection = () => {
  const [editMode, setEditMode] = useState(false);
  
  // Helper function to convert YouTube URLs to embed format
  const convertToEmbedUrl = (url: string): string => {
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

  const [galleryContent, setGalleryContent] = useState({
    title: "Exhibitors",
    titleHighlight: "Interview",
    subtitle: "Catch our exclusive interviews with top exhibitors sharing their insights and innovations.",
    items: initialGalleryItems
  });
  
  const [backupContent, setBackupContent] = useState(galleryContent);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleEditToggle = () => {
    if (!editMode) {
      setBackupContent(galleryContent);
    }
    setEditMode(!editMode);
  };

  const handleCancel = () => {
    setGalleryContent(backupContent);
    setEditMode(false);
  };

  // Handle input changes for gallery items
  const handleInputChange = (e, index, field) => {
    const newItems = [...galleryContent.items];
    newItems[index][field] = e.target.value;
    setGalleryContent({ ...galleryContent, items: newItems });
  };

  // Add a new gallery item
  const handleAddVideo = () => {
    const newItems = [...galleryContent.items, { type: 'video', src: '', title: '' }];
    setGalleryContent({ ...galleryContent, items: newItems });
  };

  // Remove a gallery item
  const handleRemoveVideo = (index) => {
    const newItems = galleryContent.items.filter((_, i) => i !== index);
    setGalleryContent({ ...galleryContent, items: newItems });
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
        <div className="text-center mb-16 relative">
          {/* Edit/Save/Cancel Buttons */}
          <div className="absolute top-0 right-0 flex gap-3">
            {editMode ? (
              <>
                <button
                  onClick={() => setEditMode(false)}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg border border-green-700 hover:bg-green-700 transition"
                >
                  <Save size={18} /> Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg border border-red-700 hover:bg-red-700 transition"
                >
                  <X size={18} /> Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleEditToggle}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg border border-blue-700 hover:bg-blue-700 transition"
              >
                <Edit size={18} /> Edit
              </button>
            )}
          </div>

          {editMode ? (
            <>
              <div className="flex items-center justify-center gap-2 mb-4">
                <input
                  type="text"
                  value={galleryContent.title}
                  onChange={(e) => setGalleryContent({ ...galleryContent, title: e.target.value })}
                  className="text-4xl md:text-5xl font-bold text-black bg-transparent border-b-2 border-gray-300 focus:border-blue-500 outline-none text-center"
                />
                <input
                  type="text"
                  value={galleryContent.titleHighlight}
                  onChange={(e) => setGalleryContent({ ...galleryContent, titleHighlight: e.target.value })}
                  className="text-4xl md:text-5xl font-bold text-[#FF0000] bg-transparent border-b-2 border-gray-300 focus:border-blue-500 outline-none text-center"
                />
              </div>
              <div className="w-24 h-1 bg-[#FFD400] mx-auto mb-6"></div>
              <textarea
                value={galleryContent.subtitle}
                onChange={(e) => setGalleryContent({ ...galleryContent, subtitle: e.target.value })}
                className="text-gray-600 text-lg max-w-2xl mx-auto bg-transparent border-2 border-gray-300 focus:border-blue-500 outline-none p-2 rounded-md w-full resize-none"
                rows={2}
              />
            </>
          ) : (
            <>
              <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
                {galleryContent.title} <span className="text-[#FF0000]">{galleryContent.titleHighlight}</span>
              </h2>
              <div className="w-24 h-1 bg-[#FFD400] mx-auto mb-6"></div>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                {galleryContent.subtitle}
              </p>
            </>
          )}
        </div>

        {editMode ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryContent.items.map((item: any, index: number) => (
                <div key={index} className="flex flex-col gap-2 p-4 bg-gray-100 rounded-2xl shadow-md border border-gray-200">
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleInputChange(e, index, 'title')}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Video Title"
                  />
                  <input
                    type="url"
                    value={item.src}
                    onChange={(e) => handleInputChange(e, index, 'src')}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Paste any YouTube URL (will be auto-converted)"
                  />
                  <div className="text-gray-500 text-xs mt-1">
                    <p>Supported: youtu.be, youtube.com/watch, youtube.com/embed</p>
                  </div>
                  <button
                    onClick={() => handleRemoveVideo(index)}
                    className="p-2 mt-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <Trash2 size={18} className="mx-auto" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={handleAddVideo}
                className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 transition-colors shadow-lg"
              >
                <Plus size={18} /> Add Video
              </button>
            </div>
          </div>
        ) : (
          <div className="relative">
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
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default GallerySection;