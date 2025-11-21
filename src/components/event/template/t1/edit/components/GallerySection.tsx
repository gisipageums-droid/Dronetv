import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Edit, Save, X, Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

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
  onStateChange?: (data: GalleryContent) => void;
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

const GallerySection: React.FC<GallerySectionProps> = ({ galleryData, onStateChange }) => {
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [galleryContent, setGalleryContent] = useState<GalleryContent>(defaultGalleryContent);
  const [backupContent, setBackupContent] = useState<GalleryContent>(defaultGalleryContent);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-save timeout reference
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();

  // Update local state when prop data changes
  useEffect(() => {
    if (galleryData) {
      setGalleryContent(galleryData);
      setBackupContent(galleryData);
    }
  }, [galleryData]);

  // Auto-save function
  const autoSave = useCallback(async () => {
    if (!onStateChange || !editMode) return;

    setIsSaving(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onStateChange(galleryContent);
    setLastSaved(new Date());
    setIsSaving(false);
  }, [galleryContent, editMode, onStateChange]);

  // Debounced auto-save effect
  useEffect(() => {
    if (editMode && onStateChange) {
      // Clear existing timeout
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      // Set new timeout for auto-save (1 second debounce)
      autoSaveTimeoutRef.current = setTimeout(() => {
        autoSave();
      }, 1000);

      // Cleanup timeout on unmount or when dependencies change
      return () => {
        if (autoSaveTimeoutRef.current) {
          clearTimeout(autoSaveTimeoutRef.current);
        }
      };
    }
  }, [galleryContent, editMode, autoSave, onStateChange]);

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

  const handleEditToggle = () => {
    if (!editMode) {
      setBackupContent(galleryContent);
    }
    setEditMode(!editMode);
  };

  const handleCancel = () => {
    setGalleryContent(backupContent);
    if (onStateChange) {
      onStateChange(backupContent); // Sync with parent
    }
    setEditMode(false);
  };

  // Handle input changes for gallery items
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, field: keyof GalleryItem) => {
    const newItems = [...galleryContent.items];
    newItems[index] = { ...newItems[index], [field]: e.target.value };
    const updatedContent = { ...galleryContent, items: newItems };
    setGalleryContent(updatedContent);
  };

  // Add a new gallery item
  const handleAddVideo = () => {
    const newItem: GalleryItem = { 
      type: 'video', 
      src: '', 
      title: 'New Video' 
    };
    const updatedContent = { 
      ...galleryContent, 
      items: [...galleryContent.items, newItem] 
    };
    setGalleryContent(updatedContent);
  };

  // Remove a gallery item
  const handleRemoveVideo = (index: number) => {
    const newItems = galleryContent.items.filter((_, i) => i !== index);
    const updatedContent = { ...galleryContent, items: newItems };
    setGalleryContent(updatedContent);
    
    // Adjust current slide if needed
    if (currentSlide >= newItems.length) {
      setCurrentSlide(Math.max(0, newItems.length - 1));
    }
  };

  // Update header fields
  const updateHeaderField = (field: keyof Pick<GalleryContent, 'title' | 'titleHighlight' | 'subtitle'>, value: string) => {
    setGalleryContent(prev => ({
      ...prev,
      [field]: value
    }));
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
          <div className="absolute top-0 right-0 flex gap-3 items-center">
            {/* Auto-save status */}
            {editMode && onStateChange && (
              <div className="text-sm text-gray-600 mr-2 bg-gray-100 px-3 py-1 rounded-lg hidden sm:block">
                {isSaving ? (
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    Saving...
                  </span>
                ) : lastSaved ? (
                  <span>Auto-saved {lastSaved.toLocaleTimeString()}</span>
                ) : null}
              </div>
            )}
            
            {editMode ? (
              <>
                <button
                  onClick={handleEditToggle}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg border border-green-700 hover:bg-green-700 transition"
                >
                  <Save size={18} /> Done
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
                <div>
                  <input
                    type="text"
                    value={galleryContent.title}
                    onChange={(e) => updateHeaderField('title', e.target.value)}
                    maxLength={50}
                    className="text-4xl md:text-5xl font-bold text-black bg-transparent border-b-2 border-gray-300 focus:border-blue-500 outline-none text-center"
                  />
                  <div className="text-sm text-gray-500 text-right mt-1">
                    {galleryContent.title.length}/50
                  </div>
                </div>
                <div>
                  <input
                    type="text"
                    value={galleryContent.titleHighlight}
                    onChange={(e) => updateHeaderField('titleHighlight', e.target.value)}
                    maxLength={50}
                    className="text-4xl md:text-5xl font-bold text-[#FF0000] bg-transparent border-b-2 border-gray-300 focus:border-blue-500 outline-none text-center"
                  />
                  <div className="text-sm text-gray-500 text-right mt-1">
                    {galleryContent.titleHighlight.length}/50
                  </div>
                </div>
              </div>
              <div className="w-24 h-1 bg-[#FFD400] mx-auto mb-6"></div>
              <div className="max-w-2xl mx-auto">
                <textarea
                  value={galleryContent.subtitle}
                  onChange={(e) => updateHeaderField('subtitle', e.target.value)}
                  maxLength={200}
                  className="text-gray-600 text-lg bg-transparent border-2 border-gray-300 focus:border-blue-500 outline-none p-2 rounded-md w-full resize-none"
                  rows={2}
                />
                <div className="text-sm text-gray-500 text-right mt-1">
                  {galleryContent.subtitle.length}/200
                </div>
              </div>
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
            {galleryContent.items.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No videos added yet.</p>
                <button
                  onClick={handleAddVideo}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 transition-colors shadow-lg mx-auto"
                >
                  <Plus size={18} /> Add First Video
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {galleryContent.items.map((item: GalleryItem, index: number) => (
                    <div key={index} className="flex flex-col gap-2 p-4 bg-gray-100 rounded-2xl shadow-md border border-gray-200">
                      <div>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handleInputChange(e, index, 'title')}
                          maxLength={100}
                          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                          placeholder="Video Title"
                        />
                        <div className="text-xs text-gray-500 text-right mt-1">
                          {item.title.length}/100
                        </div>
                      </div>
                      <div>
                        <input
                          type="url"
                          value={item.src}
                          onChange={(e) => handleInputChange(e, index, 'src')}
                          maxLength={500}
                          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                          placeholder="Paste any YouTube URL (will be auto-converted)"
                        />
                        <div className="text-xs text-gray-500 text-right mt-1">
                          {item.src.length}/500
                        </div>
                      </div>
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
              </>
            )}
          </div>
        ) : (
          <div className="relative">
            {galleryContent.items.length === 0 ? (
              <div className="text-center py-16 bg-gray-100 rounded-2xl">
                <p className="text-gray-500 text-lg">No videos available</p>
                <p className="text-gray-400 text-sm mt-2">Add videos in edit mode</p>
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
        )}
      </div>
    </section>
  );
};

export default GallerySection;