import { useState, useCallback, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Edit2, Loader2, Save, Plus, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import Cropper from 'react-easy-crop';

// Text limits
const TEXT_LIMITS = {
  SUBTITLE: 100,
  HEADING: 60,
  DESCRIPTION: 300,
  CAPTION: 200,
  CATEGORY: 50,
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
  onStateChange?: (data: GalleryData) => void;
  userId?: string;
  eventId?: string;
  templateSelection?: string;
}

// Category options
const categoryOptions = [
  'keynote',
  'networking',
  'workshop',
  'exhibition',
  'panel',
  'registration',
  'break',
  'closing'
];

// Pending image interface
interface PendingImage {
  file: File;
  imageId: string;
  isNew?: boolean;
}

// Helper function to create default data from provided structure
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

export function GallerySection({ galleryData, onStateChange, userId, eventId }: GalleryProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [data, setData] = useState<GalleryData>(createDefaultData());
  const [tempData, setTempData] = useState<GalleryData>(createDefaultData());
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);

  // Cropping states
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  // Zoom constants
  const MIN_ZOOM = 0.1;
  const MAX_ZOOM = 3;
  const ZOOM_STEP = 0.1;
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [croppingForImage, setCroppingForImage] = useState<string | null>(null);
  const [aspectRatio] = useState(4 / 3);
  const cropperContainerRef = useRef<HTMLDivElement>(null);

  // Initialize data from backend props
  useEffect(() => {
    if (galleryData && !dataLoaded) {
      // Use the provided gallery data directly
      const transformedData: GalleryData = {
        subtitle: galleryData.subtitle || "event memories",
        heading: galleryData.heading || "Event Gallery",
        description: galleryData.description || "Highlights and memorable moments from our events",
        images: galleryData.images || []
      };
      setData(transformedData);
      setTempData(transformedData);
      setDataLoaded(true);
    } else if (!dataLoaded) {
      // Use default data if no props provided
      setData(createDefaultData());
      setTempData(createDefaultData());
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

  // Image handling functions
  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>, imageId?: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    // Check image limit
    if (!imageId && tempData.images.length >= 6) {
      toast.error('Maximum 6 images allowed in gallery');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageToCrop(reader.result as string);
      setOriginalFile(file);
      setCroppingForImage(imageId || 'new');
      setShowCropper(true);
      setZoom(1);
      setCrop({ x: 0, y: 0 });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }, [tempData.images.length]);

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
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

  const getCroppedImg = async (imageSrc: string, pixelCrop: any): Promise<{ file: File; previewUrl: string }> => {
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
        const previewUrl = URL.createObjectURL(blob);
        resolve({ file, previewUrl });
      }, 'image/jpeg', 0.95);
    });
  };

  const applyCrop = async () => {
    try {
      if (!imageToCrop || !croppedAreaPixels || !croppingForImage) return;

      const { file, previewUrl } = await getCroppedImg(imageToCrop, croppedAreaPixels);

      if (croppingForImage === 'new') {
        // Add new image to tempData immediately
        const newImage: GalleryImage = {
          id: `temp-${Date.now()}`,
          url: previewUrl,
          caption: 'New image',
          category: 'keynote'
        };

        const updatedImages = [...tempData.images, newImage];
        setTempData(prev => ({ ...prev, images: updatedImages }));

        // Add to pendingImages for S3 upload
        setPendingImages(prev => [...prev, { file, imageId: newImage.id, isNew: true }]);

        toast.success('Image added! Click Save to upload to S3.');
      } else {
        // Replace existing image
        const updatedImages = tempData.images.map(img =>
          img.id === croppingForImage ? { ...img, url: previewUrl } : img
        );
        setTempData(prev => ({ ...prev, images: updatedImages }));

        // Add to pendingImages for S3 upload
        setPendingImages(prev => [...prev, { file, imageId: croppingForImage }]);

        toast.success('Image replaced! Click Save to upload to S3.');
      }

      setShowCropper(false);
      setImageToCrop(null);
      setOriginalFile(null);
      setCroppingForImage(null);
    } catch (error) {
      console.error('Error cropping image:', error);
      toast.error('Error cropping image. Please try again.');
    }
  };

  const cancelCrop = () => {
    setShowCropper(false);
    setImageToCrop(null);
    setOriginalFile(null);
    setCroppingForImage(null);
  };

  const uploadImageToS3 = async (file: File, fieldName: string): Promise<string> => {
    if (!userId) {
      throw new Error('User ID is required for image upload');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);
    formData.append(`fieldName`, fieldName + Date.now());

    const uploadResponse = await fetch(`https://ow3v94b9gf.execute-api.ap-south-1.amazonaws.com/dev/events-image-update`, {
      method: 'POST',
      body: formData,
    });

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json();
      throw new Error(errorData.message || 'Image upload failed');
    }

    const uploadData = await uploadResponse.json();
    return uploadData.s3Url;
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Handle image uploads to S3
      if (pendingImages.length > 0) {
        setIsUploading(true);
        const updatedImages = [...tempData.images];

        for (const pending of pendingImages) {
          try {
            const s3Url = await uploadImageToS3(pending.file, `gallery-image-${pending.imageId}`);

            const imageIndex = updatedImages.findIndex(img => img.id === pending.imageId);
            if (imageIndex !== -1) {
              updatedImages[imageIndex].url = s3Url;
              // Replace temp ID with permanent one for new images
              if (pending.isNew) {
                updatedImages[imageIndex].id = Date.now().toString();
              }
            }
          } catch (error) {
            console.error(`Error uploading image ${pending.imageId}:`, error);
            toast.error(`Failed to upload image. Please try again.`);
            setIsUploading(false);
            setIsSaving(false);
            return;
          }
        }

        setTempData(prev => ({ ...prev, images: updatedImages }));
      }

      // Simulate API call for saving gallery data
      await new Promise(resolve => setTimeout(resolve, 500));

      setData(tempData);
      setPendingImages([]);
      setIsEditing(false);

      if (onStateChange) {
        onStateChange(tempData);
      }

      toast.success(pendingImages.length > 0
        ? 'Gallery saved with new images!'
        : 'Gallery updated successfully!');
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

  // Gallery management functions
  const addImage = useCallback(() => {
    // Check image limit
    if (tempData.images.length >= 6) {
      toast.error('Maximum 6 images allowed in gallery');
      return;
    }

    // Trigger file input for new image
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => handleImageSelect(e as any);
    input.click();
  }, [tempData.images.length, handleImageSelect]);

  const removeImage = useCallback((imageId: string) => {
    const updatedImages = tempData.images.filter(img => img.id !== imageId);
    setTempData(prev => ({ ...prev, images: updatedImages }));

    // Remove any pending upload for this image
    setPendingImages(prev => prev.filter(p => p.imageId !== imageId));
  }, [tempData.images]);

  const updateImageCaption = useCallback((imageId: string, caption: string) => {
    const updatedImages = tempData.images.map(img =>
      img.id === imageId ? { ...img, caption } : img
    );
    setTempData(prev => ({ ...prev, images: updatedImages }));
  }, [tempData.images]);

  const updateImageCategory = useCallback((imageId: string, category: string) => {
    const updatedImages = tempData.images.map(img =>
      img.id === imageId ? { ...img, category } : img
    );
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

  // Check if maximum images reached
  const maxImagesReached = displayData.images.length >= 6;

  // Handle wheel events for zooming and panning
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (!showCropper) return;
    e.preventDefault();

    if (e.ctrlKey || e.metaKey) {
      // Zoom with Ctrl/Cmd + Wheel
      const delta = e.deltaY > 0 ? -1 : 1;
      setZoom(prev => {
        const newZoom = prev + (delta * ZOOM_STEP);
        return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoom));
      });
    } else if (e.shiftKey) {
      // Horizontal pan with Shift + Wheel
      setCrop(prev => ({
        ...prev,
        x: Math.max(-100, Math.min(100, prev.x - e.deltaY * 0.1))
      }));
    } else {
      // Vertical pan with Wheel
      setCrop(prev => ({
        ...prev,
        y: Math.max(-100, Math.min(100, prev.y + e.deltaY * 0.1))
      }));
    }
  }, [showCropper, ZOOM_STEP, MIN_ZOOM, MAX_ZOOM]);

  // Handle keyboard events for zoom and pan
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showCropper) return;

      // Prevent default for all handled keys
      const handledKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', '+', '-', '='];
      if (handledKeys.includes(e.key)) {
        e.preventDefault();
      }

      // Handle arrow keys for panning
      const panStep = 10;
      switch (e.key) {
        case 'ArrowUp':
          setCrop(prev => ({ ...prev, y: Math.min(prev.y + panStep, 100) }));
          break;
        case 'ArrowDown':
          setCrop(prev => ({ ...prev, y: Math.max(prev.y - panStep, -100) }));
          break;
        case 'ArrowLeft':
          setCrop(prev => ({ ...prev, x: Math.min(prev.x + panStep, 100) }));
          break;
        case 'ArrowRight':
          setCrop(prev => ({ ...prev, x: Math.max(prev.x - panStep, -100) }));
          break;
        case '-':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            setZoom(prev => Math.max(MIN_ZOOM, prev - ZOOM_STEP));
          }
          break;
        case '+':
        case '=':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            setZoom(prev => Math.min(MAX_ZOOM, prev + ZOOM_STEP));
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showCropper, ZOOM_STEP, MIN_ZOOM, MAX_ZOOM]);

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
                  disabled={isSaving || isUploading}
                >
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : isSaving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {isUploading ? "Uploading..." : isSaving ? "Saving..." : "Save"}
                </CustomButton>
                <CustomButton
                  onClick={handleCancel}
                  size="sm"
                  className="bg-red-500 hover:bg-red-600 text-white shadow-md"
                  disabled={isSaving || isUploading}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </CustomButton>
                <CustomButton
                  onClick={addImage}
                  variant="outline"
                  size="sm"
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 shadow-md"
                  disabled={maxImagesReached}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Image {maxImagesReached && '(Max 6)'}
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

          {/* Image Counter */}
          {isEditing && (
            <div className="text-center mb-6">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {displayData.images.length} / 6 images
              </span>
              {maxImagesReached && (
                <p className="text-red-600 text-sm mt-2">Maximum 6 images reached. Remove some images to add new ones.</p>
              )}
            </div>
          )}

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
                    <div className="flex justify-between items-start">
                      <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded capitalize">
                        {image.category}
                      </span>
                      <CustomButton
                        onClick={() => removeImage(image.id)}
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
                          onChange={(e) => handleImageSelect(e, image.id)}
                        />
                      </label>
                      <div className="space-y-2">
                        <select
                          value={image.category}
                          onChange={(e) => updateImageCategory(image.id, e.target.value)}
                          className="w-full p-1 text-sm bg-black/50 text-white rounded border border-gray-300"
                        >
                          {categoryOptions.map(category => (
                            <option key={category} value={category} className="capitalize">
                              {category}
                            </option>
                          ))}
                        </select>
                        <EditableText
                          value={image.caption}
                          onChange={(value) => updateImageCaption(image.id, value)}
                          className="text-white bg-black/50 text-sm"
                          placeholder="Image caption"
                          charLimit={TEXT_LIMITS.CAPTION}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Hover Overlay (non-edit mode) */}
                {!isEditing && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                      <span className="inline-block px-2 py-1 bg-blue-500 text-white text-xs rounded capitalize mb-2">
                        {image.category}
                      </span>
                      <p className="text-white text-sm sm:text-base">{image.caption}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Add New Image Card (edit mode) */}
            {isEditing && !maxImagesReached && (
              <div
                className="group relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-blue-400 transition-all duration-300"
                onClick={addImage}
              >
                <div className="text-center">
                  <Plus className="w-8 h-8 text-gray-400 group-hover:text-blue-400 mx-auto mb-2" />
                  <p className="text-gray-500 group-hover:text-blue-400">Add Image</p>
                  <p className="text-gray-400 text-xs mt-1">{displayData.images.length}/6</p>
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
                <p className="text-gray-600 mb-6">Add up to 6 images to showcase your event gallery.</p>
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
                <div
                  className="flex-1 relative"
                  ref={cropperContainerRef}
                  onWheel={handleWheel}
                >
                  <Cropper
                    image={imageToCrop || undefined}
                    crop={crop}
                    zoom={zoom}
                    aspect={aspectRatio}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                    minZoom={MIN_ZOOM}
                    maxZoom={MAX_ZOOM}
                    zoomWithScroll={false}
                    restrictPosition={false}
                    onWheelRequest={e => {
                      // Allow zooming with Ctrl/Cmd + Wheel
                      if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        return false;
                      }
                      return true;
                    }}
                    style={{
                      containerStyle: {
                        backgroundColor: '#000',
                      },
                      cropAreaStyle: {
                        border: '2px solid white',
                      },
                    }}
                  />
                </div>
                <div className="p-4 border-t flex flex-wrap gap-4 items-center">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => setZoom(prev => Math.max(MIN_ZOOM, prev - ZOOM_STEP))}
                      className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={zoom <= MIN_ZOOM}
                    >
                      -
                    </button>
                    <input
                      type="range"
                      value={zoom}
                      min={MIN_ZOOM}
                      max={MAX_ZOOM}
                      step={ZOOM_STEP}
                      onChange={(e) => setZoom(Number(e.target.value))}
                      className="w-24 sm:w-32"
                    />
                    <button
                      onClick={() => setZoom(prev => Math.min(MAX_ZOOM, prev + ZOOM_STEP))}
                      className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={zoom >= MAX_ZOOM}
                    >
                      +
                    </button>
                    <button
                      onClick={() => setZoom(1)}
                      className="px-2 h-8 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                    >
                      1x
                    </button>
                    <span className="text-sm text-gray-600">({zoom.toFixed(1)}x)</span>
                  </div>
                  <div className="flex-1 text-right">
                    <button
                      onClick={applyCrop}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Apply Crop
                    </button>
                  </div>
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