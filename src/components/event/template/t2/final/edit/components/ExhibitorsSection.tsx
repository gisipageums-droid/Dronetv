import { useEffect, useRef, useState, useCallback } from 'react';
import { Building2, ExternalLink, Edit2, Loader2, Save, X, Plus, Trash2, Upload } from 'lucide-react';
import { toast } from 'react-toastify';
import Cropper from 'react-easy-crop';

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
  cta: {
    title: string;
    description: string;
    buttonText: string;
  };
}

interface ExhibitorsProps {
  exhibitorsData?: ExhibitorsData;
  onStateChange?: (data: ExhibitorsData) => void;
  userId?: string;
  professionalId?: string;
  templateSelection?: string;
}

// Default data
const defaultData: ExhibitorsData = {
  subtitle: "Our Exhibitors",
  heading: "Discover Innovation",
  description: "Meet with leading companies showcasing the latest products, services, and solutions.",
  exhibitors: [
    { id: '1', name: 'TechCorp Global', category: 'Technology', booth: 'A-101' },
    { id: '2', name: 'Innovation Labs', category: 'R&D', booth: 'A-102' },
    { id: '3', name: 'Digital Dynamics', category: 'Digital Solutions', booth: 'B-201' },
    { id: '4', name: 'Future Ventures', category: 'Investment', booth: 'B-202' },
    { id: '5', name: 'NextGen Institute', category: 'Education', booth: 'C-301' },
    { id: '6', name: 'Startup Accelerator', category: 'Growth', booth: 'C-302' },
  ],
  cta: {
    title: 'Interested in Exhibiting?',
    description: 'Join our community of innovators and showcase your products to thousands of industry professionals.',
    buttonText: 'Become an Exhibitor'
  }
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

export function ExhibitorsSection({ exhibitorsData, onStateChange, userId, professionalId, templateSelection }: ExhibitorsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [data, setData] = useState<ExhibitorsData>(defaultData);
  const [tempData, setTempData] = useState<ExhibitorsData>(defaultData);
  const [pendingImages, setPendingImages] = useState<{file: File; exhibitorId: string}[]>([]);
  
  // Cropping states
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [croppingForExhibitor, setCroppingForExhibitor] = useState<string | null>(null);
  const [aspectRatio] = useState(1 / 1); // Square aspect for logos

  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize data from props
  useEffect(() => {
    if (exhibitorsData && !dataLoaded) {
      setData(exhibitorsData);
      setTempData(exhibitorsData);
      setDataLoaded(true);
    }
  }, [exhibitorsData, dataLoaded]);

  // Notify parent of state changes
  useEffect(() => {
    if (onStateChange && dataLoaded) {
      onStateChange(data);
    }
  }, [data, dataLoaded]);

  // Auto-scroll effect
  useEffect(() => {
    if (isEditing) return; // Disable auto-scroll in edit mode
    
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollPosition = 0;
    const scroll = () => {
      scrollPosition += 0.5;
      if (scrollPosition >= scrollContainer.scrollWidth / 2) {
        scrollPosition = 0;
      }
      scrollContainer.scrollLeft = scrollPosition;
    };

    const intervalId = setInterval(scroll, 20);
    return () => clearInterval(intervalId);
  }, [isEditing]);

  const handleEdit = () => {
    setIsEditing(true);
    setTempData({ ...data });
    setPendingImages([]);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Handle logo uploads
      if (pendingImages.length > 0) {
        setIsUploading(true);
        const updatedExhibitors = [...tempData.exhibitors];
        
        for (const pending of pendingImages) {
          // Simulate upload - replace with actual S3 upload
          await new Promise(resolve => setTimeout(resolve, 500));
          const imageUrl = URL.createObjectURL(pending.file);
          
          const exhibitorIndex = updatedExhibitors.findIndex(e => e.id === pending.exhibitorId);
          if (exhibitorIndex !== -1) {
            updatedExhibitors[exhibitorIndex].logo = imageUrl;
          }
        }
        
        tempData.exhibitors = updatedExhibitors;
      }

      await new Promise(resolve => setTimeout(resolve, 500));
      
      setData(tempData);
      setPendingImages([]);
      setIsEditing(false);
      toast.success('Exhibitors section saved successfully');
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
    setPendingImages([]);
    setIsEditing(false);
  };

  // Image handling functions
  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>, exhibitorId: string) => {
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
      setCroppingForExhibitor(exhibitorId);
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
        const file = new File([blob], `exhibitor-logo-${Date.now()}.jpg`, { 
          type: 'image/jpeg',
          lastModified: Date.now()
        });
        resolve(file);
      }, 'image/jpeg', 0.95);
    });
  };

  const applyCrop = async () => {
    try {
      if (!imageToCrop || !croppedAreaPixels || !croppingForExhibitor) return;
      
      const file = await getCroppedImg(imageToCrop, croppedAreaPixels);
      
      // Add to pending images
      setPendingImages(prev => [...prev, { file, exhibitorId: croppingForExhibitor }]);
      
      // Update preview immediately
      const previewUrl = URL.createObjectURL(file);
      const updatedExhibitors = tempData.exhibitors.map(exhibitor =>
        exhibitor.id === croppingForExhibitor 
          ? { ...exhibitor, logo: previewUrl }
          : exhibitor
      );
      setTempData(prev => ({ ...prev, exhibitors: updatedExhibitors }));
      
      toast.success('Exhibitor logo updated! Click Save to confirm.');
      setShowCropper(false);
      setImageToCrop(null);
      setOriginalFile(null);
      setCroppingForExhibitor(null);
    } catch (error) {
      console.error('Error cropping image:', error);
      toast.error('Error cropping image. Please try again.');
    }
  };

  const cancelCrop = () => {
    setShowCropper(false);
    setImageToCrop(null);
    setOriginalFile(null);
    setCroppingForExhibitor(null);
  };

  // Exhibitor management functions
  const addExhibitor = useCallback(() => {
    const newExhibitor: Exhibitor = {
      id: Date.now().toString(),
      name: 'New Exhibitor',
      category: 'Category',
      booth: 'A-100'
    };
    setTempData(prev => ({
      ...prev,
      exhibitors: [...prev.exhibitors, newExhibitor]
    }));
  }, []);

  const removeExhibitor = useCallback((exhibitorId: string) => {
    const updatedExhibitors = tempData.exhibitors.filter(exhibitor => exhibitor.id !== exhibitorId);
    setTempData(prev => ({ ...prev, exhibitors: updatedExhibitors }));
    
    // Remove any pending upload for this exhibitor
    setPendingImages(prev => prev.filter(p => p.exhibitorId !== exhibitorId));
  }, [tempData.exhibitors]);

  const updateExhibitor = useCallback((exhibitorId: string, field: keyof Exhibitor, value: string) => {
    const updatedExhibitors = tempData.exhibitors.map(exhibitor =>
      exhibitor.id === exhibitorId ? { ...exhibitor, [field]: value } : exhibitor
    );
    setTempData(prev => ({ ...prev, exhibitors: updatedExhibitors }));
  }, [tempData.exhibitors]);

  const updateCta = useCallback((field: keyof ExhibitorsData['cta'], value: string) => {
    setTempData(prev => ({
      ...prev,
      cta: { ...prev.cta, [field]: value }
    }));
  }, []);

  const updateField = useCallback((field: keyof ExhibitorsData, value: string) => {
    setTempData(prev => ({ ...prev, [field]: value }));
  }, []);

  const displayData = isEditing ? tempData : data;

  // Duplicate exhibitors for seamless loop (only in view mode)
  const duplicatedExhibitors = isEditing ? displayData.exhibitors : [...displayData.exhibitors, ...displayData.exhibitors];

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

      {/* Auto-scrolling Exhibitors */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-hidden pb-4"
          style={{ scrollBehavior: 'auto' }}
        >
          {duplicatedExhibitors.map((exhibitor, index) => (
            <div
              key={`${exhibitor.id}-${index}`}
              className="flex-shrink-0 w-80 sm:w-96 group bg-white p-6 sm:p-8 rounded-2xl border-2 border-amber-200 hover:border-amber-400 hover:shadow-xl transition-all duration-300 relative"
            >
              {/* Edit Controls Overlay */}
              {isEditing && index < displayData.exhibitors.length && (
                <div className="absolute top-2 right-2 z-10 flex gap-1">
                  <CustomButton
                    onClick={() => removeExhibitor(exhibitor.id)}
                    size="sm"
                    className="bg-red-500 hover:bg-red-600 text-white p-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </CustomButton>
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative">
                  {exhibitor.logo ? (
                    <img
                      src={exhibitor.logo}
                      alt={exhibitor.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  ) : (
                    <Building2 className="w-6 h-6 text-white" />
                  )}
                  
                  {/* Logo Upload (Edit Mode) */}
                  {isEditing && index < displayData.exhibitors.length && (
                    <label className="absolute -bottom-1 -right-1 cursor-pointer bg-black/70 text-white p-1 rounded text-xs hover:bg-black/90 transition-colors">
                      <Upload className="w-3 h-3" />
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handleImageSelect(e, exhibitor.id)} 
                      />
                    </label>
                  )}
                </div>
                
                {isEditing && index < displayData.exhibitors.length ? (
                  <EditableText
                    value={exhibitor.booth}
                    onChange={(value) => updateExhibitor(exhibitor.id, 'booth', value)}
                    className="px-3 py-1 bg-yellow-100 text-amber-700 rounded-full text-xs sm:text-sm text-center"
                    placeholder="Booth number"
                    charLimit={TEXT_LIMITS.EXHIBITOR_BOOTH}
                  />
                ) : (
                  <span className="px-3 py-1 bg-yellow-100 text-amber-700 rounded-full text-xs sm:text-sm">
                    {exhibitor.booth}
                  </span>
                )}
              </div>
              
              {isEditing && index < displayData.exhibitors.length ? (
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
                  <EditableText
                    value={exhibitor.website || ''}
                    onChange={(value) => updateExhibitor(exhibitor.id, 'website', value)}
                    className="text-sm"
                    placeholder="Website URL (optional)"
                  />
                </div>
              ) : (
                <>
                  <h3 className="text-gray-900 mb-2 text-lg sm:text-xl group-hover:text-amber-600 transition-colors">
                    {exhibitor.name}
                  </h3>
                  <p className="text-amber-600 mb-4 text-sm sm:text-base">{exhibitor.category}</p>
                  {exhibitor.description && (
                    <p className="text-gray-600 text-sm mb-4">{exhibitor.description}</p>
                  )}
                  {!isEditing && (
                    <button className="flex items-center gap-2 text-amber-600 hover:text-amber-700 group/link text-sm sm:text-base">
                      <span>Visit Booth</span>
                      <ExternalLink className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </button>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        {/* Gradient Overlays (only in view mode) */}
        {!isEditing && (
          <>
            <div className="absolute top-0 left-0 bottom-0 w-32 bg-yellow-50 to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 bottom-0 w-32 bg-yellow-50 to-transparent pointer-events-none" />
          </>
        )}
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 sm:px-6 mt-12 sm:mt-16">
        <div className="max-w-4xl mx-auto bg-yellow-400 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center shadow-xl">
          {isEditing ? (
            <div className="space-y-6">
              <EditableText
                value={displayData.cta.title}
                onChange={(value) => updateCta('title', value)}
                className="text-gray-900 text-2xl sm:text-3xl md:text-4xl font-bold"
                placeholder="CTA title"
                charLimit={TEXT_LIMITS.CTA_TITLE}
              />
              <EditableText
                value={displayData.cta.description}
                onChange={(value) => updateCta('description', value)}
                multiline
                className="text-gray-800 text-base sm:text-lg max-w-2xl mx-auto"
                placeholder="CTA description"
                charLimit={TEXT_LIMITS.CTA_DESCRIPTION}
                rows={3}
              />
              <EditableText
                value={displayData.cta.buttonText}
                onChange={(value) => updateCta('buttonText', value)}
                className="text-center"
                placeholder="Button text"
                charLimit={TEXT_LIMITS.BUTTON_TEXT}
              />
            </div>
          ) : (
            <>
              <h3 className="text-gray-900 mb-4 text-2xl sm:text-3xl md:text-4xl">{displayData.cta.title}</h3>
              <p className="text-gray-800 text-base sm:text-lg mb-6 max-w-2xl mx-auto">
                {displayData.cta.description}
              </p>
              <button className="px-6 sm:px-8 py-3 sm:py-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors text-sm sm:text-base">
                {displayData.cta.buttonText}
              </button>
            </>
          )}
        </div>
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
    </section>
  );
}