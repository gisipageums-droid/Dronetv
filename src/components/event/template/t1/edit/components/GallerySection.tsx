import React, { useState, useEffect } from 'react';
import { Edit2, Save, X, Plus, Trash2, ChevronLeft, ChevronRight, Edit } from 'lucide-react';

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
  const [galleryItems, setGalleryItems] = useState(initialGalleryItems);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Toggle edit mode and prepare the form data
  const toggleEditMode = () => {
    if (isEditMode) {
      setIsEditMode(false);
      setEditForm(null);
    } else {
      setIsEditMode(true);
      setEditForm([...galleryItems]);
    }
  };

  // Handle input changes for title and source
  const handleInputChange = (e, index, field) => {
    const newItems = [...editForm];
    newItems[index][field] = e.target.value;
    setEditForm(newItems);
  };

  // Add a new gallery item
  const handleAddVideo = () => {
    setEditForm(prev => [...prev, { type: 'video', src: '', title: '' }]);
  };

  // Remove a gallery item
  const handleRemoveVideo = (index) => {
    const newItems = editForm.filter((_, i) => i !== index);
    setEditForm(newItems);
  };

  // Save changes to the main state and exit edit mode
  const handleSave = () => {
    setGalleryItems(editForm);
    setIsEditMode(false);
  };

  // Custom carousel navigation
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % galleryItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
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
            Catch our exclusive interviews with top exhibitors sharing their insights and innovations.
          </p>
          <div className="absolute top-0 right-0">
            <button
              onClick={toggleEditMode}
              className={`px-6 py-2 rounded-lg font-semibold text-lg transition-all duration-300 ${
                isEditMode
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-green-500 text-white hover:bg-reeen-600'
              }`}
            >
              {isEditMode ? <span className='flex items-center gap-2'>
                <X size={18} /> Cancel
              </span> : <span className='flex items-center gap-2'>
                <Edit size={18} /> Edit
              </span>}
            </button>
          </div>
        </div>

        {isEditMode ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {editForm.map((item, index) => (
                <div key={index} className="flex flex-col gap-2 p-4 bg-gray-100 rounded-2xl shadow-md border border-gray-200">
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleInputChange(e, index, 'title')}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Video Title"
                  />
                  <input
                    type="text"
                    value={item.src}
                    onChange={(e) => handleInputChange(e, index, 'src')}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="YouTube Embed URL"
                  />
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
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 transition-colors shadow-lg"
              >
                <Save size={18} /> Save
              </button>
            </div>
          </div>
        ) : (
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
                <h3 className="text-white font-semibold text-lg">{galleryItems[currentSlide].title}</h3>
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
        )}
      </div>
    </section>
  );
};

export default GallerySection;