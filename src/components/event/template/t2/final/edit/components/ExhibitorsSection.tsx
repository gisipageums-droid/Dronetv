import { useEffect, useRef, useState, useCallback } from 'react';
import { Building2, ExternalLink, Edit2, Loader2, Save, X, Plus, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import Cropper from 'react-easy-crop';
import { motion } from 'motion/react'; // Add motion import

// Text limits
const TEXT_LIMITS = {
  SUBTITLE: 100,
  HEADING: 60,
  DESCRIPTION: 300,
  EXHIBITOR_NAME: 60,
  EXHIBITOR_CATEGORY: 40,
  EXHIBITOR_BOOTH: 20,
  CTA_TITLE: 80,
  CTA_DESCRIPTION: 200,
  BUTTON_TEXT: 30,
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
interface Exhibitor {
  id: string;
  name: string;
  category: string;
  booth: string;
  logo?: string;
  description?: string;
  website?: string;
}

interface ExhibitorsData {
  subtitle: string;
  heading: string;
  description: string;
  exhibitors: Exhibitor[];
  cta?: {
    title: string;
    description: string;
    buttonText: string;
  };
}

interface ExhibitorsProps {
  exhibitorsData?: any;
  onStateChange?: (data: ExhibitorsData) => void;
  userId?: string;
  eventId?: string;
  templateSelection?: string;
}

// Default CTA data
const defaultCta = {
  title: 'Interested in Exhibiting?',
  description: 'Join our community of innovators and showcase your products to thousands of industry professionals.',
  buttonText: 'Become an Exhibitor'
};

// Pending image interface
interface PendingImage {
  file: File;
  exhibitorId: string;
  isNew?: boolean;
}

// Helper function to create default data from provided structure
const createDefaultData = (): ExhibitorsData => {
  const providedData = {
    subtitle: "event partners",
    heading: "Exhibitors & Sponsors",
    description: "Meet our partners, sponsors, and exhibitors",
    exhibitors: [
      {
        website: "#",
        name: "DataTech Innovations",
        description: "DataTech Innovations specializes in cutting-edge data analytics software for enterprises.",
        logo: "https://images.unsplash.com/photo-1590771032931-7d04f2020c36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTg4ODN8MHwxfHNlYXJjaHwxfHx0cmFkZSUyMHNob3clMjBib290aCUyMGV4aGliaXRpb24lMjBzdGFuZCUyMGJ1c2luZXNzJTIwZXhwb3xlbnwwfDF8fHwxNzYyNjcxNjI3fDA&ixlib=rb-4.1.0&q=80&w=1080",
        id: "2",
        category: "Data Analytics",
        booth: "Booth A2"
      }
    ]
  };

  return {
    subtitle: providedData.subtitle,
    heading: providedData.heading,
    description: providedData.description,
    exhibitors: providedData.exhibitors,
    cta: defaultCta
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

export function ExhibitorsSection({ exhibitorsData, onStateChange, userId, eventId, templateSelection }: ExhibitorsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [data, setData] = useState<ExhibitorsData>(createDefaultData());
  const [tempData, setTempData] = useState<ExhibitorsData>(createDefaultData());
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
  const [croppingForExhibitor, setCroppingForExhibitor] = useState<string | null>(null);
  const [aspectRatio] = useState(1 / 1); // Square aspect for logos
  const cropperContainerRef = useRef<HTMLDivElement>(null);

  // Remove the old scrollRef and animationRef since we'll use CSS marquee
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize data from props
  useEffect(() => {
    if (exhibitorsData && !dataLoaded) {
      const transformedData: ExhibitorsData = {
        subtitle: exhibitorsData.subtitle || "event partners",
        heading: exhibitorsData.heading || "Exhibitors & Sponsors",
        description: exhibitorsData.description || "Meet our partners, sponsors, and exhibitors",
        exhibitors: exhibitorsData.exhibitors || [],
        cta: exhibitorsData.cta || defaultCta
      };
      setData(transformedData);
      setTempData(transformedData);
      setDataLoaded(true);
    } else if (!dataLoaded) {
      // Use default data if no exhibitorsData provided
      setData(createDefaultData());
      setTempData(createDefaultData());
      setDataLoaded(true);
    }
  }, [exhibitorsData, dataLoaded]);

  // Notify parent of state changes
  useEffect(() => {
    if (onStateChange && dataLoaded) {
      onStateChange(data);
    }
  }, [data, dataLoaded]);

  // Calculate grid layout for edit mode
  const getGridLayout = useCallback(() => {
    const exhibitorCount = tempData.exhibitors.length;

    if (exhibitorCount <= 4) {
      // Single row for 1-4 exhibitors
      return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
    } else if (exhibitorCount <= 8) {
      // Two rows for 5-8 exhibitors
      return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
    } else {
      // Multiple rows with 4 columns for more than 8
      return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
    }
  }, [tempData.exhibitors.length]);

  // Image handling functions
  const handleImageSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>, exhibitorId: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageToCrop(reader.result as string);
      setOriginalFile(file);
      setCroppingForExhibitor(exhibitorId);
      setShowCropper(true);
      setZoom(1);
      setCrop({ x: 0, y: 0 });
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  }, []);

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
        const file = new File([blob], `exhibitor-logo-${Date.now()}.jpg`, {
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
      if (!imageToCrop || !croppedAreaPixels || !croppingForExhibitor) return;

      const { file, previewUrl } = await getCroppedImg(imageToCrop, croppedAreaPixels);

      // Update the exhibitor with the cropped image preview
      updateExhibitor(croppingForExhibitor, 'logo', previewUrl);

      // Add to pending images for S3 upload on save
      setPendingImages(prev => [...prev, { file, exhibitorId: croppingForExhibitor }]);

      toast.success('Logo cropped successfully! Click Save to upload to S3.');
      setShowCropper(false);
      setImageToCrop(null);
      setOriginalFile(null);
      setCroppingForExhibitor(null);
    } catch (error) {
      console.error('Error cropping image:', error);
      toast.error('Error cropping image. Please try again.');
    }
  };

  const cancelCrop = useCallback(() => {
    setShowCropper(false);
    setImageToCrop(null);
    setCroppingForExhibitor(null);
    setOriginalFile(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  }, []);

  // S3 Upload function
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

  const handleEdit = () => {
    setIsEditing(true);
    setTempData({ ...data });
    setPendingImages([]);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Handle image uploads to S3 first if any
      if (pendingImages.length > 0) {
        setIsUploading(true);
        const updatedExhibitors = [...tempData.exhibitors];

        for (const pending of pendingImages) {
          try {
            const s3Url = await uploadImageToS3(pending.file, `exhibitor-logo-${pending.exhibitorId}`);

            const exhibitorIndex = updatedExhibitors.findIndex(exhibitor => exhibitor.id === pending.exhibitorId);
            if (exhibitorIndex !== -1) {
              updatedExhibitors[exhibitorIndex].logo = s3Url;
            }
          } catch (error) {
            console.error(`Error uploading logo for exhibitor ${pending.exhibitorId}:`, error);
            toast.error(`Failed to upload logo. Please try again.`);
            setIsUploading(false);
            setIsSaving(false);
            return;
          }
        }

        setTempData(prev => ({ ...prev, exhibitors: updatedExhibitors }));
      }

      // Simulate API call for saving exhibitors data
      await new Promise(resolve => setTimeout(resolve, 500));

      setData(tempData);
      setPendingImages([]);
      setIsEditing(false);

      if (onStateChange) {
        onStateChange(tempData);
      }

      toast.success(pendingImages.length > 0
        ? 'Exhibitors saved with new logos!'
        : 'Exhibitors updated successfully!');
    } catch (error) {
      console.error('Error saving exhibitors:', error);
      toast.error('Error saving changes. Please try again.');
    } finally {
      setIsSaving(false);
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setTempData({ ...data });
    setIsEditing(false);
    setPendingImages([]);
    setShowCropper(false);
  };

  // Exhibitor management functions
  const addExhibitor = useCallback(() => {
    const newExhibitor: Exhibitor = {
      id: `exhibitor-${Date.now()}`,
      name: 'New Exhibitor',
      category: 'Category',
      booth: 'Booth A1',
      description: '',
      website: ''
    };

    setTempData(prev => ({
      ...prev,
      exhibitors: [...prev.exhibitors, newExhibitor]
    }));
  }, []);

  const removeExhibitor = useCallback((exhibitorId: string) => {
    setTempData(prev => ({
      ...prev,
      exhibitors: prev.exhibitors.filter(exhibitor => exhibitor.id !== exhibitorId)
    }));
  }, []);

  const updateExhibitor = useCallback((exhibitorId: string, field: keyof Exhibitor, value: string) => {
    setTempData(prev => ({
      ...prev,
      exhibitors: prev.exhibitors.map(exhibitor =>
        exhibitor.id === exhibitorId ? { ...exhibitor, [field]: value } : exhibitor
      )
    }));
  }, []);

  const updateField = useCallback((field: keyof ExhibitorsData, value: string) => {
    setTempData(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateCta = useCallback((field: keyof NonNullable<ExhibitorsData['cta']>, value: string) => {
    setTempData(prev => ({
      ...prev,
      cta: {
        ...prev.cta!,
        [field]: value
      }
    }));
  }, []);

  const displayData = isEditing ? tempData : data;

  // Duplicate exhibitors for marquee loop (same as testimonials)
  const duplicatedExhibitors = [...displayData.exhibitors, ...displayData.exhibitors];

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
    <section id="exhibitors" className="py-16 sm:py-20 md:py-24 bg-yellow-50 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto mb-12 sm:mb-16">
          {/* Edit Controls */}
          <div className="text-right mb-8">
            {!isEditing ? (
              <CustomButton
                onClick={handleEdit}
                size="sm"
                className="bg-red-500 hover:bg-red-600 shadow-md text-white"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Exhibitors
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
                  onClick={addExhibitor}
                  variant="outline"
                  size="sm"
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 shadow-md"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Exhibitor
                </CustomButton>
              </div>
            )}
          </div>

          {/* Header */}
          <div className="text-center">
            {isEditing ? (
              <>
                <div className="inline-block mb-4 px-4 py-2 bg-white rounded-full border border-amber-200 shadow-sm">
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
                <div className="inline-block mb-4 px-4 py-2 bg-white rounded-full border border-amber-200 shadow-sm">
                  <span className="text-red-700 text-xl font-semibold">{displayData.subtitle}</span>
                </div>
                <h2 className="text-gray-900 mb-4 text-3xl sm:text-4xl md:text-5xl">{displayData.heading}</h2>
                <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4">
                  {displayData.description}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Improved Exhibitors Layout */}
      <div className="relative">
        {isEditing ? (
          // Grid layout for edit mode
          <div className={`container mx-auto px-4 sm:px-6`}>
            <div className={`max-w-6xl mx-auto grid ${getGridLayout()} gap-6 pb-4`}>
              {displayData.exhibitors.map((exhibitor) => (
                <div
                  key={exhibitor.id}
                  className="group bg-white p-6 sm:p-8 rounded-2xl border-2 border-amber-200 hover:border-amber-400 hover:shadow-xl transition-all duration-300 relative"
                >
                  {/* Edit Controls Overlay */}
                  <div className="absolute top-2 right-2 z-10 flex gap-1">
                    <CustomButton
                      onClick={() => removeExhibitor(exhibitor.id)}
                      size="sm"
                      className="bg-red-500 hover:bg-red-600 text-white p-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </CustomButton>
                  </div>

                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative overflow-hidden">
                      {exhibitor.logo ? (
                        <img
                          src={exhibitor.logo}
                          alt={exhibitor.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Building2 className="w-6 h-6 text-white" />
                      )}

                      {/* Logo Upload */}
                      <label className="absolute inset-0 cursor-pointer bg-black/0 hover:bg-black/30 flex items-center justify-center transition-colors">
                        <Upload className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageSelect(e, exhibitor.id)}
                        />
                      </label>
                    </div>

                    <EditableText
                      value={exhibitor.booth}
                      onChange={(value) => updateExhibitor(exhibitor.id, 'booth', value)}
                      className="px-3 py-1 bg-yellow-100 text-amber-700 rounded-full text-xs sm:text-sm text-center"
                      placeholder="Booth number"
                      charLimit={TEXT_LIMITS.EXHIBITOR_BOOTH}
                    />
                  </div>

                  <div className="space-y-3">
                    <EditableText
                      value={exhibitor.name}
                      onChange={(value) => updateExhibitor(exhibitor.id, 'name', value)}
                      className="text-gray-900 text-lg sm:text-xl font-semibold"
                      placeholder="Exhibitor name"
                      charLimit={TEXT_LIMITS.EXHIBITOR_NAME}
                    />
                    <EditableText
                      value={exhibitor.category}
                      onChange={(value) => updateExhibitor(exhibitor.id, 'category', value)}
                      className="text-amber-600 text-sm sm:text-base"
                      placeholder="Category"
                      charLimit={TEXT_LIMITS.EXHIBITOR_CATEGORY}
                    />
                    <EditableText
                      value={exhibitor.description || ''}
                      onChange={(value) => updateExhibitor(exhibitor.id, 'description', value)}
                      multiline
                      className="text-gray-600 text-sm"
                      placeholder="Description (optional)"
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Marquee layout for non-editing (same as testimonials)
          <div className="group w-full overflow-hidden">
            <style>
              {`
                @keyframes marquee {
                  0% { transform: translateX(0%); }
                  100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                  animation: marquee 60s linear infinite;
                }
                .group:hover .animate-marquee {
                  animation-play-state: paused;
                }
              `}
            </style>

            <motion.div
              className="flex gap-8 animate-marquee"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.2,
                    delayChildren: 0.3,
                  },
                },
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {duplicatedExhibitors.map((exhibitor, index) => (
                <motion.div
                  key={`${exhibitor.id}-${index}`}
                  variants={{
                    hidden: { y: 50, opacity: 0 },
                    visible: {
                      y: 0,
                      opacity: 1,
                      transition: {
                        duration: 0.8,
                        ease: "easeOut",
                      },
                    },
                  }}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0 w-80 sm:w-96"
                >
                  <div className="group bg-white p-6 sm:p-8 rounded-2xl border-2 border-amber-200 hover:border-amber-400 hover:shadow-xl transition-all duration-300 relative h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative overflow-hidden">
                        {exhibitor.logo ? (
                          <img
                            src={exhibitor.logo}
                            alt={exhibitor.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Building2 className="w-6 h-6 text-white" />
                        )}
                      </div>

                      <span className="px-3 py-1 bg-yellow-100 text-amber-700 rounded-full text-xs sm:text-sm">
                        {exhibitor.booth}
                      </span>
                    </div>

                    <h3 className="text-gray-900 mb-2 text-lg sm:text-xl group-hover:text-amber-600 transition-colors">
                      {exhibitor.name}
                    </h3>
                    <p className="text-amber-600 mb-4 text-sm sm:text-base">{exhibitor.category}</p>
                    {exhibitor.description && (
                      <p className="text-gray-600 text-sm mb-4">{exhibitor.description}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {displayData.exhibitors.length === 0 && !isEditing && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Building2 className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No Exhibitors Added</h4>
            <p className="text-gray-600 mb-6">Add exhibitors to showcase your event partners.</p>
            <CustomButton
              onClick={handleEdit}
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Exhibitors
            </CustomButton>
          </div>
        </div>
      )}

      {/* Cropper Modal */}
      {showCropper && (
        <div className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full h-[80vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Crop Exhibitor Logo</h3>
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
    </section>
  );
}