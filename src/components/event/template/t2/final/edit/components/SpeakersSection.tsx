import { useState, useCallback, useEffect, useRef } from 'react';
import { Linkedin, Twitter, User, Edit2, Loader2, Save, X, Plus, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import Cropper from 'react-easy-crop';

// Text limits
const TEXT_LIMITS = {
  SUBTITLE: 100,
  HEADING: 60,
  DESCRIPTION: 300,
  SPEAKER_NAME: 40,
  SPEAKER_ROLE: 60,
  SPEAKER_COMPANY: 60,
  SPEAKER_TOPIC: 100,
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
interface Speaker {
  id: string;
  name: string;
  role: string;
  company: string;
  topic: string;
  image?: string;
  bio?: string;
  color: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}

interface SpeakersData {
  subtitle: string;
  heading: string;
  description: string;
  speakers: Speaker[];
}

interface SpeakersProps {
  speakersData?: SpeakersData;
  onStateChange?: (data: SpeakersData) => void;
  userId?: string;
  eventId?: string;
  templateSelection?: string;
}

// Color options for speakers
const colorOptions = [
  'from-yellow-400 to-amber-500',
  'from-amber-400 to-orange-500',
  'from-yellow-300 to-amber-400',
  'from-amber-500 to-yellow-600',
  'from-yellow-400 to-amber-600',
  'from-amber-400 to-yellow-500',
  'from-blue-400 to-blue-600',
  'from-green-400 to-green-600',
  'from-purple-400 to-purple-600',
  'from-pink-400 to-pink-600',
];

// Default speakers data
const defaultSpeakersData: SpeakersData = {
  "subtitle": "expert speakers",
  "heading": "Meet Our Speakers",
  "description": "Industry leaders and experts",
  "speakers": [
    {
      "image": "https://images.unsplash.com/photo-1674081955099-9a290e8f5947?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTg4ODN8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHNwZWFrZXIlMjBwcmVzZW50YXRpb24lMjBjb25mZXJlbmNlJTIwaGVhZHNob3R8ZW58MHwxfHx8MTc2MjY3MTYyN3ww&ixlib=rb-4.1.0&q=80&w=1080",
      "socialLinks": {
        "twitter": "",
        "linkedin": ""
      },
      "role": "EXACT role",
      "name": "EXACT NAME from brochure",
      "bio": "100-150 word professional bio",
      "topic": "Session topic",
      "company": "EXACT company",
      "id": "1",
      "color": "from-yellow-400 to-amber-500"
    }
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

export function SpeakersSection({ speakersData, onStateChange, userId, eventId, templateSelection }: SpeakersProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [data, setData] = useState<SpeakersData>(defaultSpeakersData);
  const [tempData, setTempData] = useState<SpeakersData>(defaultSpeakersData);
  const [pendingImages, setPendingImages] = useState<{ file: File; speakerId: string }[]>([]);

  // Cropping states
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  // Zoom constants
  const MIN_ZOOM = 0.1;
  const MAX_ZOOM = 3;
  const ZOOM_STEP = 0.1;

  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [croppingForSpeaker, setCroppingForSpeaker] = useState<string | null>(null);
  const [aspectRatio] = useState(1 / 1); // Square aspect for profile images

  // Initialize data from props
  useEffect(() => {
    if (speakersData && !dataLoaded) {
      console.log('Initializing speakers data:', speakersData);

      // Transform API data to component format with proper fallbacks
      const transformedSpeakers = speakersData.speakers?.map(speaker => ({
        id: speaker.id || Date.now().toString(),
        name: speaker.name || 'New Speaker',
        role: speaker.role || 'Position',
        company: speaker.company || 'Company',
        topic: speaker.topic || 'Speaking Topic',
        bio: speaker.bio || 'Professional bio',
        image: speaker.image,
        color: speaker.color || colorOptions[Math.floor(Math.random() * colorOptions.length)],
        socialLinks: speaker.socialLinks || {
          linkedin: '',
          twitter: '',
          website: ''
        }
      })) || [];

      const transformedData: SpeakersData = {
        subtitle: speakersData.subtitle || "expert speakers",
        heading: speakersData.heading || "Meet Our Speakers",
        description: speakersData.description || "Industry leaders and experts",
        speakers: transformedSpeakers
      };

      setData(transformedData);
      setTempData(transformedData);
      setDataLoaded(true);

      // Notify parent of initial state
      if (onStateChange) {
        onStateChange(transformedData);
      }
    } else if (!speakersData && !dataLoaded) {
      // Use default data if no props provided
      setData(defaultSpeakersData);
      setTempData(defaultSpeakersData);
      setDataLoaded(true);

      if (onStateChange) {
        onStateChange(defaultSpeakersData);
      }
    }
  }, [speakersData, dataLoaded, onStateChange]);

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
  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>, speakerId: string) => {
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

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageToCrop(reader.result);
      setOriginalFile(file);
      setCroppingForSpeaker(speakerId);
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
        const file = new File([blob], `speaker-${Date.now()}.jpg`, {
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
      if (!imageToCrop || !croppedAreaPixels || !croppingForSpeaker) return;

      const { file, previewUrl } = await getCroppedImg(imageToCrop, croppedAreaPixels);

      // Add to pending images
      setPendingImages(prev => [...prev, { file, speakerId: croppingForSpeaker }]);

      // Update preview immediately
      const updatedSpeakers = tempData.speakers.map(speaker =>
        speaker.id === croppingForSpeaker
          ? { ...speaker, image: previewUrl }
          : speaker
      );
      setTempData(prev => ({ ...prev, speakers: updatedSpeakers }));

      toast.success('Speaker image updated! Click Save to upload to S3.');
      setShowCropper(false);
      setImageToCrop(null);
      setOriginalFile(null);
      setCroppingForSpeaker(null);
    } catch (error) {
      console.error('Error cropping image:', error);
      toast.error('Error cropping image. Please try again.');
    }
  };

  const cancelCrop = () => {
    setShowCropper(false);
    setImageToCrop(null);
    setOriginalFile(null);
    setCroppingForSpeaker(null);
  };

  const uploadImageToS3 = async (file: File, fieldName: string): Promise<string> => {
    if (!userId) {
      throw new Error('User ID is required for image upload');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);
    formData.append('fieldName', fieldName + Date.now());

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
        const updatedSpeakers = [...tempData.speakers];

        for (const pending of pendingImages) {
          try {
            const s3Url = await uploadImageToS3(pending.file, `speaker-image-${pending.speakerId}`);

            const speakerIndex = updatedSpeakers.findIndex(s => s.id === pending.speakerId);
            if (speakerIndex !== -1) {
              updatedSpeakers[speakerIndex].image = s3Url;
            }
          } catch (error) {
            console.error(`Error uploading image for speaker ${pending.speakerId}:`, error);
            toast.error(`Failed to upload speaker image. Please try again.`);
            setIsUploading(false);
            setIsSaving(false);
            return;
          }
        }

        setTempData(prev => ({ ...prev, speakers: updatedSpeakers }));
      }

      // Save to API if eventId and userId are provided
      if (userId && eventId) {
        try {
          const saveResponse = await fetch('/api/save-speakers', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId,
              eventId,
              speakersData: tempData
            })
          });

          if (!saveResponse.ok) {
            throw new Error('Failed to save speakers data');
          }

          const result = await saveResponse.json();
          console.log('Save successful:', result);
        } catch (apiError) {
          console.error('API save error:', apiError);
          // Continue with local state update even if API fails
          toast.warning('Changes saved locally but failed to sync with server.');
        }
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update local state
      setData(tempData);
      setPendingImages([]);
      setIsEditing(false);

      if (onStateChange) {
        onStateChange(tempData);
      }

      toast.success(pendingImages.length > 0
        ? 'Speakers section saved with new images!'
        : 'Speakers section updated successfully!');
    } catch (error) {
      console.error('Error saving speakers:', error);
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

  // Speaker management functions
  const addSpeaker = useCallback(() => {
    const newSpeaker: Speaker = {
      id: Date.now().toString(),
      name: 'New Speaker',
      role: 'Position',
      company: 'Company',
      topic: 'Speaking Topic',
      bio: 'Professional bio',
      color: colorOptions[Math.floor(Math.random() * colorOptions.length)],
      socialLinks: {}
    };
    setTempData(prev => ({
      ...prev,
      speakers: [...prev.speakers, newSpeaker]
    }));
  }, []);

  const removeSpeaker = useCallback((speakerId: string) => {
    const updatedSpeakers = tempData.speakers.filter(speaker => speaker.id !== speakerId);
    setTempData(prev => ({ ...prev, speakers: updatedSpeakers }));

    // Remove any pending upload for this speaker
    setPendingImages(prev => prev.filter(p => p.speakerId !== speakerId));
  }, [tempData.speakers]);

  const updateSpeaker = useCallback((speakerId: string, field: keyof Speaker, value: string) => {
    const updatedSpeakers = tempData.speakers.map(speaker =>
      speaker.id === speakerId ? { ...speaker, [field]: value } : speaker
    );
    setTempData(prev => ({ ...prev, speakers: updatedSpeakers }));
  }, [tempData.speakers]);

  const updateSpeakerColor = useCallback((speakerId: string, color: string) => {
    const updatedSpeakers = tempData.speakers.map(speaker =>
      speaker.id === speakerId ? { ...speaker, color } : speaker
    );
    setTempData(prev => ({ ...prev, speakers: updatedSpeakers }));
  }, [tempData.speakers]);

  const updateSocialLink = useCallback((speakerId: string, platform: keyof Speaker['socialLinks'], value: string) => {
    const updatedSpeakers = tempData.speakers.map(speaker =>
      speaker.id === speakerId
        ? {
          ...speaker,
          socialLinks: { ...speaker.socialLinks, [platform]: value }
        }
        : speaker
    );
    setTempData(prev => ({ ...prev, speakers: updatedSpeakers }));
  }, [tempData.speakers]);

  const updateField = useCallback((field: keyof SpeakersData, value: string) => {
    setTempData(prev => ({ ...prev, [field]: value }));
  }, []);

  const displayData = isEditing ? tempData : data;

  return (
    <section id="speakers" className="py-16 sm:py-20 md:py-24 bg-white">
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
                Edit Speakers
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
                  onClick={addSpeaker}
                  variant="outline"
                  size="sm"
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 shadow-md"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Speaker
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

          {/* Speakers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {displayData.speakers.map((speaker) => (
              <div
                key={speaker.id}
                className="group relative bg-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-amber-300 hover:shadow-2xl transition-all duration-300"
              >
                {/* Edit Controls Overlay */}
                {isEditing && (
                  <div className="absolute top-2 right-2 z-10 flex gap-1">
                    <CustomButton
                      onClick={() => removeSpeaker(speaker.id)}
                      size="sm"
                      className="bg-red-500 hover:bg-red-600 text-white p-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </CustomButton>
                  </div>
                )}

                {/* Speaker Header */}
                <div className={`relative h-40 bg-yellow-200 flex items-center justify-center ${speaker.color}`}>
                  {speaker.image ? (
                    <img
                      src={speaker.image}
                      alt={speaker.name}
                      className="w-20 h-20 rounded-full object-cover shadow-lg group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <User className="w-10 h-10 text-gray-700" />
                    </div>
                  )}

                  {/* Image Upload (Edit Mode) */}
                  {isEditing && (
                    <label className="absolute bottom-2 right-2 cursor-pointer bg-black/70 text-white p-1 rounded text-xs hover:bg-black/90 transition-colors">
                      <Upload className="w-3 h-3" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageSelect(e, speaker.id)}
                      />
                    </label>
                  )}
                </div>

                {/* Speaker Content */}
                <div className="p-6">
                  {isEditing ? (
                    <div className="space-y-3">
                      <EditableText
                        value={speaker.name}
                        onChange={(value) => updateSpeaker(speaker.id, 'name', value)}
                        className="text-gray-900 text-lg sm:text-xl font-semibold"
                        placeholder="Speaker name"
                        charLimit={TEXT_LIMITS.SPEAKER_NAME}
                      />
                      <EditableText
                        value={speaker.role}
                        onChange={(value) => updateSpeaker(speaker.id, 'role', value)}
                        className="text-amber-600 text-sm sm:text-base"
                        placeholder="Speaker role"
                        charLimit={TEXT_LIMITS.SPEAKER_ROLE}
                      />
                      <EditableText
                        value={speaker.company}
                        onChange={(value) => updateSpeaker(speaker.id, 'company', value)}
                        className="text-gray-600 text-sm"
                        placeholder="Company"
                        charLimit={TEXT_LIMITS.SPEAKER_COMPANY}
                      />



                      {/* Topic */}
                      <EditableText
                        value={speaker.topic}
                        onChange={(value) => updateSpeaker(speaker.id, 'topic', value)}
                        multiline
                        className="text-gray-700 text-sm sm:text-base"
                        placeholder="Speaking topic"
                        charLimit={TEXT_LIMITS.SPEAKER_TOPIC}
                        rows={2}
                      />

                      {/* Bio */}
                      <EditableText
                        value={speaker.bio || ''}
                        onChange={(value) => updateSpeaker(speaker.id, 'bio', value)}
                        multiline
                        className="text-gray-600 text-sm"
                        placeholder="Speaker bio"
                        rows={3}
                      />
                    </div>
                  ) : (
                    <>
                      <h3 className="text-gray-900 mb-2 text-lg sm:text-xl group-hover:text-amber-600 transition-colors">
                        {speaker.name}
                      </h3>
                      <p className="text-amber-600 mb-1 text-sm sm:text-base">{speaker.role}</p>
                      <p className="text-gray-600 mb-4 text-sm">{speaker.company}</p>
                      <div className="pt-4 border-t border-gray-100">
                        <p className="text-gray-700 text-sm sm:text-base mb-2">
                          <span className="text-gray-500">Topic: </span>
                          {speaker.topic}
                        </p>
                        {speaker.bio && (
                          <p className="text-gray-600 text-sm mt-2">{speaker.bio}</p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}

            {/* Add New Speaker Card (edit mode) */}
            {isEditing && (
              <div
                className="group relative bg-gray-50 rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-all duration-300 min-h-[400px]"
                onClick={addSpeaker}
              >
                <div className="text-center p-6">
                  <Plus className="w-12 h-12 text-gray-400 group-hover:text-blue-400 mx-auto mb-4" />
                  <p className="text-gray-500 group-hover:text-blue-400 font-semibold">Add New Speaker</p>
                  <p className="text-gray-400 text-sm mt-2">Click to add a new speaker</p>
                </div>
              </div>
            )}
          </div>

          {/* Empty State */}
          {displayData.speakers.length === 0 && !isEditing && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">No Speakers Added</h4>
                <p className="text-gray-600 mb-6">Add speakers to showcase your event presenters.</p>
                <CustomButton
                  onClick={handleEdit}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Speakers
                </CustomButton>
              </div>
            </div>
          )}

          {/* Cropper Modal */}
          {showCropper && (
            <div className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4">
              <div className="bg-white rounded-xl max-w-4xl w-full h-[80vh] flex flex-col">
                <div className="p-4 border-b flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Crop Speaker Image</h3>
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
                    minZoom={MIN_ZOOM}
                    maxZoom={MAX_ZOOM}
                    zoomWithScroll={false}
                    restrictPosition={false}
                    cropShape="round"
                    showGrid={false}
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
        </div>
      </div>
    </section>
  );
}