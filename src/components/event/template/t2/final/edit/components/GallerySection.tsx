import { useState, useCallback, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Edit2, Loader2, Save, Plus, Trash2, Upload } from 'lucide-react';
import { toast } from 'react-toastify';
import Cropper from 'react-easy-crop';

// Text limits
const TEXT_LIMITS = {
  SUBTITLE: 100,
  HEADING: 60,
  DESCRIPTION: 300,
  CAPTION: 200,
};

// Custom Button component
const CustomButton = ({
  children,
  onClick,
  variant,
  size,
  className,
  disabled,
  ...props
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'outline' | 'default';
  size?: 'sm' | 'default';
  className?: string;
  disabled?: boolean;
}) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    outline: "border border-gray-300 bg-transparent hover:bg-gray-50",
    default: "bg-blue-600 text-white hover:bg-blue-700",
  };
  const sizes = {
    sm: "h-8 px-3 text-sm",
    default: "h-10 px-4",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant] || variants.default} ${sizes[size] || sizes.default} ${className || ""}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

// Data interfaces
interface GalleryImage {
  id: string;
  url: string;
  caption: string;
  category?: string;
}

interface GalleryData {
  subtitle: string;
  heading: string;
  description: string;
  images: GalleryImage[];
}

interface GalleryProps {
  galleryData?: GalleryData;
  onStateChange?: (data: GalleryData) => void;
  userId?: string;
  professionalId?: string;
  templateSelection?: string;
}

// Default data
const defaultData: GalleryData = {
  subtitle: "Event Gallery",
  heading: "Moments That Matter",
  description: "Relive the best moments from our previous events and get a glimpse of what awaits you.",
  images: [
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25mZXJlbmNlJTIwYXVkaWVuY2V8ZW58MXx8fHwxNzYyMzk2NTc5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      caption: 'Engaged audience at keynote presentation',
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1759873066311-ce4966c249ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBldmVudCUyMG5ldHdvcmtpbmd8ZW58MXx8fHwxNzYyNDQxMjEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      caption: 'Networking sessions connecting professionals',
    },
    {
      id: '3',
      url: 'https://images.unsplash.com/photo-1758923530808-b66d8eb24370?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBleGhpYml0aW9uJTIgaGFsbHxlbnwxfHx8fDE3NjI0MDk2NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      caption: 'Exhibition hall showcasing innovations',
    },
  ]
};

// Editable Text Component
const EditableText = ({ 
  value, 
  onChange, 
  multiline = false, 
  className = "", 
  placeholder = "", 
  charLimit, 
  rows = 3 
}: {
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  className?: string;
  placeholder?: string;
  charLimit?: number;
  rows?: number;
}) => (
  <div className="relative">
    {multiline ? (
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full bg-white/80 backdrop-blur-sm border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 ${className}`}
          placeholder={placeholder}
          rows={rows}
          maxLength={charLimit}
        />
        {charLimit && (
          <div className="absolute bottom-2 right-2 text-xs text-gray-500">
            {value.length}/{charLimit}
          </div>
        )}
      </div>
    ) : (
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full bg-white/80 backdrop-blur-sm border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 ${className}`}
          placeholder={placeholder}
          maxLength={charLimit}
        />
        {charLimit && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
            {value.length}/{charLimit}
          </div>
        )}
      </div>
    )}
  </div>
);

export function GallerySection({ galleryData, onStateChange, userId, professionalId, templateSelection }: GalleryProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [data, setData] = useState<GalleryData>(defaultData);
  const [tempData, setTempData] = useState<GalleryData>(defaultData);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [pendingImages, setPendingImages] = useState<{file: File; index?: number}[]>([]);
  
  // Cropping states
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [croppingForIndex, setCroppingForIndex] = useState<number | 'new' | null>(null);
  const [aspectRatio] = useState(4 / 3);

  // Initialize data from props
  useEffect(() => {
    if (galleryData && !dataLoaded) {
      setData(galleryData);
      setTempData(galleryData);
      setDataLoaded(true);
    }
  }, [galleryData, dataLoaded]);

  // Notify parent of state changes
  useEffect(() => {
    if (onStateChange && dataLoaded) {
      onStateChange(data);
    }
  }, [data, dataLoaded]);

  const handleEdit = () => {
    setIsEditing(true);
    setTempData({ ...data });
    setPendingImages([]);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Handle image uploads
      if (pendingImages.length > 0) {
        setIsUploading(true);
        const updatedImages = [...tempData.images];
        
        for (const pending of pendingImages) {
          // Simulate upload - replace with actual S3 upload
          await new Promise(resolve => setTimeout(resolve, 500));
          const imageUrl = URL.createObjectURL(pending.file);
          
          if (pending.index !== undefined) {
            // Replace existing image
            updatedImages[pending.index].url = imageUrl;
          } else {
            // Add new image
            updatedImages.push({
              id: Date.now().toString(),
              url: imageUrl,
              caption: 'New image'
            });
          }
        }
        
        tempData.images = updatedImages;
      }

      await new Promise(resolve => setTimeout(resolve, 500));
      
      setData(tempData);
      setPendingImages([]);
      setIsEditing(false);
      toast.success('Gallery saved successfully');
    } catch (error) {
      console.error('Error saving gallery:', error);
      toast.error('Error saving changes. Please try again.');
    } finally {
      setIsSaving(false);
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setTempData({ ...data });
    setPendingImages([]);
    setIsEditing(false);
  };

  // Image handling functions
  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageToCrop(reader.result);
      setOriginalFile(file);
      setCroppingForIndex(index ?? 'new');
      setShowCropper(true);
      setZoom(1);
      setCrop({ x: 0, y: 0 });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }, []);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getCroppedImg = async (imageSrc: string, pixelCrop: any): Promise<File> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error('Could not get canvas context');

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) throw new Error('Canvas is empty');
        const file = new File([blob], `gallery-${Date.now()}.jpg`, { 
          type: 'image/jpeg',
          lastModified: Date.now()
        });
        resolve(file);
      }, 'image/jpeg', 0.95);
    });
  };

  const applyCrop = async () => {
    try {
      if (!imageToCrop || !croppedAreaPixels || croppingForIndex === null) return;
      
      const file = await getCroppedImg(imageToCrop, croppedAreaPixels);
      
      if (croppingForIndex === 'new') {
        // Add new image to pending
        setPendingImages(prev => [...prev, { file }]);
        toast.success('Image cropped! It will be added when you save.');
      } else {
        // Replace existing image
        setPendingImages(prev => [...prev, { file, index: croppingForIndex }]);
        
        // Update preview immediately
        const previewUrl = URL.createObjectURL(file);
        const updatedImages = [...tempData.images];
        updatedImages[croppingForIndex].url = previewUrl;
        setTempData(prev => ({ ...prev, images: updatedImages }));
        
        toast.success('Image replaced! Click Save to confirm.');
      }
      
      setShowCropper(false);
      setImageToCrop(null);
      setOriginalFile(null);
      setCroppingForIndex(null);
    } catch (error) {
      console.error('Error cropping image:', error);
      toast.error('Error cropping image. Please try again.');
    }
  };

  const cancelCrop = () => {
    setShowCropper(false);
    setImageToCrop(null);
    setOriginalFile(null);
    setCroppingForIndex(null);
  };

  // Gallery management functions
  const addImage = useCallback(() => {
    // Trigger file input for new image
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => handleImageSelect(e as any);
    input.click();
  }, [handleImageSelect]);

  const removeImage = useCallback((index: number) => {
    const updatedImages = tempData.images.filter((_, i) => i !== index);
    setTempData(prev => ({ ...prev, images: updatedImages }));
    
    // Also remove any pending upload for this index
    setPendingImages(prev => prev.filter(p => p.index !== index));
  }, [tempData.images]);

  const updateImageCaption = useCallback((index: number, caption: string) => {
    const updatedImages = [...tempData.images];
    updatedImages[index] = { ...updatedImages[index], caption };
    setTempData(prev => ({ ...prev, images: updatedImages }));
  }, [tempData.images]);

  const updateField = useCallback((field: keyof GalleryData, value: string) => {
    setTempData(prev => ({ ...prev, [field]: value }));
  }, []);

  const displayData = isEditing ? tempData : data;

  // Lightbox functions
  const handlePrevious = useCallback(() => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? displayData.images.length - 1 : selectedImage - 1);
    }
  }, [selectedImage, displayData.images.length]);

  const handleNext = useCallback(() => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === displayData.images.length - 1 ? 0 : selectedImage + 1);
    }
  }, [selectedImage, displayData.images.length]);

  return (
    <section id="gallery" className="py-16 sm:py-20 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Edit Controls */}
          <div className="text-right mb-8">
            {!isEditing ? (
              <CustomButton
                onClick={handleEdit}
                size="sm"
                className="bg-red-500 hover:bg-red-600 shadow-md text-white"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Gallery
              </CustomButton>
            ) : (
              <div className="flex gap-2 justify-end">
                <CustomButton
                  onClick={handleSave}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white shadow-md"
                  disabled={isSaving}
                >
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  {isSaving ? "Saving..." : "Save"}
                </CustomButton>
                <CustomButton
                  onClick={handleCancel}
                  size="sm"
                  className="bg-red-500 hover:bg-red-600 text-white shadow-md"
                  disabled={isSaving}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </CustomButton>
                <CustomButton
                  onClick={addImage}
                  variant="outline"
                  size="sm"
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 shadow-md"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Image
                </CustomButton>
              </div>
            )}
          </div>

          {/* Header */}
          <div className="text-center mb-12 sm:mb-16">
            {isEditing ? (
              <>
                <div className="inline-block mb-4 px-4 py-2 bg-yellow-100 rounded-full">
                  <EditableText
                    value={displayData.subtitle}
                    onChange={(value) => updateField('subtitle', value)}
                    className="text-red-700 text-xl font-semibold text-center"
                    placeholder="Section subtitle"
                    charLimit={TEXT_LIMITS.SUBTITLE}
                  />
                </div>
                <EditableText
                  value={displayData.heading}
                  onChange={(value) => updateField('heading', value)}
                  className="text-gray-900 mb-4 text-3xl sm:text-4xl md:text-5xl text-center"
                  placeholder="Section heading"
                  charLimit={TEXT_LIMITS.HEADING}
                />
                <EditableText
                  value={displayData.description}
                  onChange={(value) => updateField('description', value)}
                  multiline
                  className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4 text-center"
                  placeholder="Section description"
                  charLimit={TEXT_LIMITS.DESCRIPTION}
                  rows={2}
                />
              </>
            ) : (
              <>
                <div className="inline-block mb-4 px-4 py-2 bg-yellow-100 rounded-full">
                  <span className="text-red-700 text-xl font-semibold">{displayData.subtitle}</span>
                </div>
                <h2 className="text-gray-900 mb-4 text-3xl sm:text-4xl md:text-5xl">{displayData.heading}</h2>
                <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4">
                  {displayData.description}
                </p>
              </>
            )}
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {displayData.images.map((image, index) => (
              <div
                key={image.id}
                className="group relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300"
                onClick={() => !isEditing && setSelectedImage(index)}
              >
                <img
                  src={image.url}
                  alt={image.caption}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Edit Overlay */}
                {isEditing && (
                  <div className="absolute inset-0 bg-black/60 flex flex-col justify-between p-4">
                    <div className="flex justify-end">
                      <CustomButton
                        onClick={() => removeImage(index)}
                        size="sm"
                        className="bg-red-500 hover:bg-red-600 text-white p-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </CustomButton>
                    </div>
                    <div className="space-y-2">
                      <label className="cursor-pointer inline-flex items-center justify-center w-full py-1 bg-blue-600 text-white rounded text-sm">
                        <Upload className="w-3 h-3 mr-1" />
                        Replace
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => handleImageSelect(e, index)} 
                        />
                      </label>
                      <EditableText
                        value={image.caption}
                        onChange={(value) => updateImageCaption(index, value)}
                        className="text-white bg-black/50 text-sm"
                        placeholder="Image caption"
                        charLimit={TEXT_LIMITS.CAPTION}
                      />
                    </div>
                  </div>
                )}
                
                {/* Hover Overlay (non-edit mode) */}
                {!isEditing && (
                  <div className="absolute inset-0 bg-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                      <p className="text-white text-sm sm:text-base">{image.caption}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {/* Add New Image Card (edit mode) */}
            {isEditing && (
              <div
                className="group relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-blue-400 transition-all duration-300"
                onClick={addImage}
              >
                <div className="text-center">
                  <Plus className="w-8 h-8 text-gray-400 group-hover:text-blue-400 mx-auto mb-2" />
                  <p className="text-gray-500 group-hover:text-blue-400">Add Image</p>
                </div>
              </div>
            )}
          </div>

          {/* Empty State */}
          {displayData.images.length === 0 && !isEditing && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Plus className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">No Images Added</h4>
                <p className="text-gray-600 mb-6">Add images to showcase your event gallery.</p>
                <CustomButton
                  onClick={handleEdit}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Images
                </CustomButton>
              </div>
            </div>
          )}

          {/* Cropper Modal */}
          {showCropper && (
            <div className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4">
              <div className="bg-white rounded-xl max-w-4xl w-full h-[80vh] flex flex-col">
                <div className="p-4 border-b flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Crop Image</h3>
                  <button onClick={cancelCrop} className="p-1 hover:bg-gray-200 rounded">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex-1 relative">
                  <Cropper
                    image={imageToCrop}
                    crop={crop}
                    zoom={zoom}
                    aspect={aspectRatio}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                </div>
                <div className="p-4 border-t flex gap-4 items-center">
                  <span className="text-sm text-gray-600">Zoom:</span>
                  <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="flex-1"
                  />
                  <button 
                    onClick={applyCrop} 
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Apply Crop
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Lightbox */}
          {selectedImage !== null && !isEditing && (
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
                <p className="text-white text-center mt-4 sm:mt-6 text-base sm:text-lg">
                  {displayData.images[selectedImage].caption}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}