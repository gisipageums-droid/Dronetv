import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { Edit2, Save, X, Plus, Trash2, Edit, Upload, Loader2, User } from 'lucide-react';
import Cropper from 'react-easy-crop';
import { toast } from 'sonner';

interface Speaker {
  name: string;
  company: string;
  id: number;
  avatar: string;
  title: string;
}

interface SpeakerDay {
  day: string;
  speakers: Speaker[];
}

interface SpeakersHeaderContent {
  sectionTitle: string;
  eventTitle: string;
  subtitle: string;
}

interface SpeakersDataContent {
  speakers: SpeakerDay[];
  headerContent: SpeakersHeaderContent;
}

interface SpeakersSectionProps {
  speakersData?: SpeakersDataContent;
  onStateChange?: (data: SpeakersDataContent) => void;
  userId?: string;
  // Removed onFormDataChange and formData props as requested
}

/** Default data structure */
const defaultSpeakersData: SpeakersDataContent = {
  speakers: [
    {
      "day": "Day 1 (Date)",
      "speakers": [
        {
          "name": "Speaker Name",
          "company": "Organization",
          "id": 1,
          "avatar": "",
          "title": "Designation"
        }
      ]
    },
    {
      "day": "Day 2 (Date)",
      "speakers": []
    },
    {
      "day": "Day 3 (Date)",
      "speakers": []
    }
  ],
  "headerContent": {
    "sectionTitle": "Speakers",
    "eventTitle": "Professional Event",
    "subtitle": "Meet our distinguished speakers who will share their expertise and insights"
  }
};

// === Avatar Dimensions - Fixed for circular avatar ===
const AVATAR_DIMENSIONS = { width: 200, height: 200 }; // Fixed size for speaker avatars

/* Main Component */
const SpeakersSection: React.FC<SpeakersSectionProps> = ({ 
  speakersData, 
  onStateChange,
  userId
}) => {
  /* --------------------------
      MAIN STATE WITH DYNAMIC DATA
     -------------------------- */
  const [localSpeakersData, setLocalSpeakersData] = useState<SpeakersDataContent>(defaultSpeakersData);
  const [backupData, setBackupData] = useState<SpeakersDataContent>(defaultSpeakersData);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  /* --------------------------
      OTHER STATES
     -------------------------- */
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Speaker>>({});
  const [activeDay, setActiveDay] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);

  // Avatar cropping states - UPDATED similar to SponsorsSection
  const [showAvatarCropper, setShowAvatarCropper] = useState(false);
  const [avatarCrop, setAvatarCrop] = useState({ x: 0, y: 0 });
  const [avatarZoom, setAvatarZoom] = useState(1);
  const [avatarCroppedAreaPixels, setAvatarCroppedAreaPixels] = useState<any>(null);
  const [avatarImageToCrop, setAvatarImageToCrop] = useState<string | null>(null);
  const [avatarOriginalFile, setAvatarOriginalFile] = useState<File | null>(null);
  const [avatarCroppingFor, setAvatarCroppingFor] = useState<{dayIndex: number, speakerIndex: number} | null>(null);
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);
  
  // Media size for dynamic zoom
  const [avatarMediaSize, setAvatarMediaSize] = useState<{ width: number; height: number; naturalWidth: number; naturalHeight: number } | null>(null);
  const [avatarCropAreaSize, setAvatarCropAreaSize] = useState<{ width: number; height: number } | null>(null);
  const [avatarMinZoomDynamic, setAvatarMinZoomDynamic] = useState(0.1);
  const [isDragging, setIsDragging] = useState(false);
  
  // Arrow key panning
  const PAN_STEP = 10;

  // Track changes for auto-save
  const hasUnsavedChanges = useRef(false);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();
  const previousSpeakersDataRef = useRef<any>(null);

  const { speakers, headerContent } = localSpeakersData;

  /* --------------------------
      Update local state when prop data changes
     -------------------------- */
  useEffect(() => {
    if (speakersData) {
      setLocalSpeakersData(speakersData);
      setBackupData(speakersData);
      previousSpeakersDataRef.current = speakersData;
    }
  }, [speakersData]);

  /* --------------------------
      Auto-save function
     -------------------------- */
  const autoSave = useCallback(async () => {
    if (!onStateChange || !isEditMode || !hasUnsavedChanges.current) return;

    setIsSaving(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onStateChange(localSpeakersData);
    setLastSaved(new Date());
    setIsSaving(false);
    hasUnsavedChanges.current = false; // Reset changes flag after save
  }, [localSpeakersData, isEditMode, onStateChange]);

  /* --------------------------
      Debounced auto-save effect - only triggers when content actually changes
     -------------------------- */
  useEffect(() => {
    // Skip if not in edit mode or no changes detected
    if (!isEditMode || !onStateChange || !hasUnsavedChanges.current) return;

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
  }, [localSpeakersData, isEditMode, autoSave, onStateChange]);

  /* --------------------------
      Effect to detect actual changes in speakers data
     -------------------------- */
  useEffect(() => {
    // Skip initial render and when not in edit mode
    if (previousSpeakersDataRef.current === null || !isEditMode) {
      previousSpeakersDataRef.current = localSpeakersData;
      return;
    }

    // Check if content actually changed
    const hasChanged = JSON.stringify(previousSpeakersDataRef.current) !== JSON.stringify(localSpeakersData);
    
    if (hasChanged) {
      hasUnsavedChanges.current = true;
      previousSpeakersDataRef.current = localSpeakersData;
    }
  }, [localSpeakersData, isEditMode]);

  // Allow more zoom-out when media/crop sizes change
  useEffect(() => {
    if (avatarMediaSize && avatarCropAreaSize) {
      setAvatarMinZoomDynamic(0.1);
    }
  }, [avatarMediaSize, avatarCropAreaSize]);

  // Arrow keys to pan image inside crop area when cropper is open
  const nudge = useCallback((dx: number, dy: number) => {
    setAvatarCrop((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
  }, []);

  useEffect(() => {
    if (!showAvatarCropper) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); nudge(-PAN_STEP, 0); }
      else if (e.key === "ArrowRight") { e.preventDefault(); nudge(PAN_STEP, 0); }
      else if (e.key === "ArrowUp") { e.preventDefault(); nudge(0, -PAN_STEP); }
      else if (e.key === "ArrowDown") { e.preventDefault(); nudge(0, PAN_STEP); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showAvatarCropper, nudge]);

  /* --------------------------
      Image Upload Functions (Same API as HeroSection and SponsorsSection)
     -------------------------- */
  const uploadImageToS3 = async (file: File, fieldName: string): Promise<string> => {
    if (!userId) {
      throw new Error('User ID is required for image upload');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);
    formData.append('fieldName', fieldName + Date.now());

    const uploadResponse = await fetch(
      `https://ow3v94b9gf.execute-api.ap-south-1.amazonaws.com/dev/events-image-update`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json().catch(() => ({}));
      throw new Error(errorData.message || 'Image upload failed');
    }

    const uploadData = await uploadResponse.json();
    return uploadData.s3Url;
  };

  // ---------- Image / crop helpers ----------
  const handleAvatarImageSelect = useCallback(
    (file: File, dayIndex: number, speakerIndex: number) => {
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
        setAvatarImageToCrop(reader.result as string);
        setAvatarOriginalFile(file);
        setAvatarCroppingFor({ dayIndex, speakerIndex });
        setShowAvatarCropper(true);
        setAvatarZoom(1);
        setAvatarCrop({ x: 0, y: 0 });
      };
      reader.readAsDataURL(file);
    },
    []
  );

  const onAvatarCropComplete = useCallback((_: any, croppedPixels: any) => {
    setAvatarCroppedAreaPixels(croppedPixels);
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  // Function to get circular cropped image - UPDATED WITH FIXED DIMENSIONS (circular)
  const getCircularCroppedImg = async (
    imageSrc: string,
    pixelCrop: any
  ): Promise<{ file: File; previewUrl: string }> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    // Fixed output dimensions - 200x200 (circular)
    const outputWidth = AVATAR_DIMENSIONS.width;
    const outputHeight = AVATAR_DIMENSIONS.height;
    const radius = Math.min(outputWidth, outputHeight) / 2;

    canvas.width = outputWidth;
    canvas.height = outputHeight;

    // Create circular clipping path
    ctx.beginPath();
    ctx.arc(radius, radius, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    // Draw cropped image in circle
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      outputWidth,
      outputHeight
    );

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) throw new Error('Canvas is empty');
          const file = new File([blob], `avatar-${Date.now()}.jpg`, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          const previewUrl = URL.createObjectURL(blob);
          resolve({ file, previewUrl });
        },
        'image/jpeg',
        0.95
      );
    });
  };

  // Apply crop and UPLOAD IMMEDIATELY to AWS - UPDATED WITH AUTO-SAVE
  const applyAvatarCrop = async () => {
    try {
      if (!avatarImageToCrop || !avatarCroppedAreaPixels || !avatarCroppingFor) return;

      setIsAvatarUploading(true);
      const { file, previewUrl } = await getCircularCroppedImg(
        avatarImageToCrop,
        avatarCroppedAreaPixels
      );

      // Auto-upload to AWS immediately after cropping
      let s3Url = previewUrl;
      try {
        s3Url = await uploadImageToS3(
          file,
          `speaker-avatar-${avatarCroppingFor.dayIndex}-${avatarCroppingFor.speakerIndex}`
        );
        toast.success('Avatar uploaded successfully!');
      } catch (uploadError) {
        console.error('Error uploading to S3:', uploadError);
        toast.error('Avatar cropped but upload failed. Using local preview.');
      }

      const { dayIndex, speakerIndex } = avatarCroppingFor;
      const updatedSpeakers = speakers.map((day, dIndex) =>
        dIndex === dayIndex
          ? {
              ...day,
              speakers: day.speakers.map((sp, sIndex) =>
                sIndex === speakerIndex
                  ? { ...sp, avatar: s3Url }
                  : sp
              )
            }
          : day
      );

      const updatedData = {
        ...localSpeakersData,
        speakers: updatedSpeakers
      };

      setLocalSpeakersData(updatedData);

      // Also update editForm if this speaker is being edited
      if (editingCard === `${dayIndex}-${speakerIndex}`) {
        setEditForm(prev => ({ ...prev, avatar: s3Url }));
      }

      closeAvatarCropper();
    } catch (error) {
      console.error('Error cropping image:', error);
      toast.error('Error cropping image. Please try again.');
    } finally {
      setIsAvatarUploading(false);
    }
  };

  // Cancel cropping - UPDATED
  const cancelAvatarCrop = () => {
    setShowAvatarCropper(false);
    setAvatarImageToCrop(null);
    setAvatarOriginalFile(null);
    setAvatarCroppingFor(null);
    setAvatarCroppedAreaPixels(null);
    setAvatarZoom(1);
    setAvatarCrop({ x: 0, y: 0 });
    setAvatarMediaSize(null);
    setAvatarCropAreaSize(null);
  };

  // Reset zoom and position - UPDATED
  const resetAvatarCropSettings = () => {
    setAvatarZoom(1);
    setAvatarCrop({ x: 0, y: 0 });
  };

  const closeAvatarCropper = cancelAvatarCrop;

  /* --------------------------
        Header Editing
     -------------------------- */
  const startHeaderEdit = () => {
    setBackupData(localSpeakersData);
    setIsEditMode(true);
    hasUnsavedChanges.current = false; // Reset changes flag when entering edit mode
  };

  const saveHeaderEdit = () => {
    // When exiting edit mode, save if there are unsaved changes
    if (hasUnsavedChanges.current && onStateChange) {
      onStateChange(localSpeakersData);
      setLastSaved(new Date());
      hasUnsavedChanges.current = false;
    }
    setEditingCard(null);
    setEditForm({});
    setIsEditMode(false);
  };

  const cancelHeaderEdit = () => {
    setLocalSpeakersData(backupData);
    if (onStateChange) {
      onStateChange(backupData); // Sync with parent
    }
    setIsEditMode(false);
    hasUnsavedChanges.current = false; // Reset changes flag
  };

  /* --------------------------
        Update Header Text
     -------------------------- */
  const updateHeaderField = (field: keyof SpeakersHeaderContent, value: string) => {
    const updatedData = {
      ...localSpeakersData,
      headerContent: { ...localSpeakersData.headerContent, [field]: value }
    };
    setLocalSpeakersData(updatedData);
  };

  /* --------------------------
        Update Speakers
     -------------------------- */
  const handleEdit = (dayIndex: number, speakerIndex: number, speaker: Speaker) => {
    setEditingCard(`${dayIndex}-${speakerIndex}`);
    setEditForm(speaker);
  };

  const handleSave = (dayIndex: number, speakerIndex: number) => {
    const updatedSpeakers = speakers.map((day, dIndex) =>
      dIndex === dayIndex
        ? {
            ...day,
            speakers: day.speakers.map((sp, sIndex) =>
              sIndex === speakerIndex
                ? { ...editForm, avatar: editForm.avatar || sp.avatar } as Speaker
                : sp
            )
          }
        : day
    );

    const updatedData = {
      ...localSpeakersData,
      speakers: updatedSpeakers
    };

    setLocalSpeakersData(updatedData);
    setEditingCard(null);
    setEditForm({});
  };

  const handleCancel = () => {
    setEditingCard(null);
  };

  const handleDelete = (dayIndex: number, speakerIndex: number) => {
    const updatedSpeakers = speakers.map((day, dIndex) =>
      dIndex === dayIndex
        ? {
            ...day,
            speakers: day.speakers.filter((_, sIndex) => sIndex !== speakerIndex)
          }
        : day
    );

    const updatedData = {
      ...localSpeakersData,
      speakers: updatedSpeakers
    };

    setLocalSpeakersData(updatedData);
  };

  const handleAddSpeaker = (dayIndex: number) => {
    const newSpeaker: Speaker = {
      id: Date.now(),
      name: 'New Speaker',
      title: '',
      company: '',
      avatar: ''
    };

    const updatedSpeakers = speakers.map((day, dIndex) =>
      dIndex === dayIndex
        ? { ...day, speakers: [...day.speakers, newSpeaker] }
        : day
    );

    const updatedData = {
      ...localSpeakersData,
      speakers: updatedSpeakers
    };

    setLocalSpeakersData(updatedData);

    const newIndex = speakers[dayIndex].speakers.length;
    setEditingCard(`${dayIndex}-${newIndex}`);
    setEditForm(newSpeaker);
  };

  /* --------------------------
          Day Editing
     -------------------------- */
  const handleDayEdit = (dayIndex: number, newValue: string) => {
    const updatedSpeakers = speakers.map((day, dIndex) =>
      dIndex === dayIndex
        ? { ...day, day: newValue }
        : day
    );

    const updatedData = {
      ...localSpeakersData,
      speakers: updatedSpeakers
    };

    setLocalSpeakersData(updatedData);
  };

  const handleAddDay = () => {
    const newDay: SpeakerDay = {
      day: `Day ${speakers.length + 1} (New Date)`,
      speakers: []
    };

    const updatedData = {
      ...localSpeakersData,
      speakers: [...speakers, newDay]
    };

    setLocalSpeakersData(updatedData);
    setActiveDay(speakers.length);
  };

  const handleRemoveDay = (dayIndex: number) => {
    if (speakers.length <= 1) return;

    const updatedSpeakers = speakers.filter((_, index) => index !== dayIndex);

    const updatedData = {
      ...localSpeakersData,
      speakers: updatedSpeakers
    };

    setLocalSpeakersData(updatedData);
    setActiveDay(Math.max(0, dayIndex - 1));
  };

  /* --------------------------
        Speaker Card Component
     -------------------------- */
  const SpeakerCard = memo(
    ({
      speaker,
      dayIndex,
      speakerIndex,
      isEditing,
      editForm,
      isEditMode,
      onEdit,
      onSave,
      onCancel,
      onDelete,
      onFormChange,
      onAvatarUpload,
      isAvatarUploading
    }: any) => {
      const handleAvatarClick = useCallback((e: React.MouseEvent) => {
        if (isEditMode) {
          e.preventDefault();
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = 'image/*';
          input.onchange = (event: any) => {
            const file = event.target.files?.[0];
            if (file && onAvatarUpload) {
              onAvatarUpload(file, dayIndex, speakerIndex);
            }
          };
          input.click();
        }
      }, [isEditMode, dayIndex, speakerIndex, onAvatarUpload]);

      // Function to render avatar - only image or default icon
      const renderAvatar = (avatarUrl: string | undefined, altText: string = 'Speaker') => {
        if (avatarUrl && avatarUrl.trim() !== '') {
          return (
            <img 
              src={avatarUrl} 
              alt={altText}
              className="w-full h-full object-cover rounded-full"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  const fallback = parent.querySelector('.avatar-fallback') as HTMLElement;
                  if (fallback) fallback.classList.remove('hidden');
                }
              }}
            />
          );
        }
        
        return (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-full">
            <User className="w-8 h-8 text-gray-500" />
          </div>
        );
      };

      // Get current avatar URL
      const currentAvatar = isEditing ? (editForm.avatar || speaker.avatar) : speaker.avatar;

      if (isEditing) {
        return (
          <div className="bg-white rounded-lg md:rounded-xl shadow-lg md:shadow-xl p-4 md:p-6 h-full">
            <div className="space-y-3 md:space-y-4 h-full flex flex-col">
              {/* Avatar Upload in Edit Mode */}
              <div className="flex flex-col items-center">
                <div 
                  className="relative group cursor-pointer"
                  onClick={handleAvatarClick}
                >
                  <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center">
                    {renderAvatar(currentAvatar, editForm.name || speaker.name)}
                    <div className="avatar-fallback hidden w-full h-full items-center justify-center bg-gray-200 rounded-full">
                      <User className="w-8 h-8 text-gray-500" />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                  {isAvatarUploading && (
                    <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    </div>
                  )}
                </div>
                <span className="text-xs text-gray-500 mt-2">
                  Click to change photo (200x200 circular)
                </span>
              </div>

              <div className="flex-grow space-y-3 md:space-y-4">
                <div>
                  <input
                    value={editForm.name || ''}
                    onChange={(e) => onFormChange({ ...editForm, name: e.target.value })}
                    maxLength={50}
                    className="w-full px-3 py-2 text-sm md:text-base border rounded-lg"
                    placeholder="Speaker Name"
                  />
                  <div className="text-xs text-gray-500 text-right mt-1">
                    {(editForm.name || '').length}/50
                  </div>
                </div>
                <div>
                  <input
                    value={editForm.title || ''}
                    onChange={(e) => onFormChange({ ...editForm, title: e.target.value })}
                    maxLength={100}
                    className="w-full px-3 py-2 text-sm md:text-base border rounded-lg"
                    placeholder="Title"
                  />
                  <div className="text-xs text-gray-500 text-right mt-1">
                    {(editForm.title || '').length}/100
                  </div>
                </div>
                <div>
                  <input
                    value={editForm.company || ''}
                    onChange={(e) => onFormChange({ ...editForm, company: e.target.value })}
                    maxLength={100}
                    className="w-full px-3 py-2 text-sm md:text-base border rounded-lg"
                    placeholder="Company"
                  />
                  <div className="text-xs text-gray-500 text-right mt-1">
                    {(editForm.company || '').length}/100
                  </div>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button 
                  onClick={onSave} 
                  className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm md:text-base flex items-center gap-1 flex-1 justify-center hover:bg-green-700 transition-colors"
                >
                  <Save size={14} className="md:w-4 md:h-4" /> 
                  <span className="hidden xs:inline">Done</span>
                  <span className="xs:hidden">Save</span>
                </button>
                <button 
                  onClick={onCancel} 
                  className="px-3 py-1.5 bg-gray-500 text-white rounded-lg text-sm md:text-base flex items-center gap-1 flex-1 justify-center hover:bg-gray-600 transition-colors"
                >
                  <X size={14} className="md:w-4 md:h-4" />
                  <span className="hidden xs:inline">Cancel</span>
                  <span className="xs:hidden">Cancel</span>
                </button>
              </div>
            </div>
          </div>
        );
      }

      return (
        <div className="group bg-white rounded-lg md:rounded-xl shadow-md md:shadow-lg p-4 md:p-6 relative h-full min-h-[200px] md:min-h-[250px] hover:shadow-lg transition-shadow duration-300">
          {isEditMode && (
            <div className="absolute top-2 right-2 flex gap-1 z-10">
              <button 
                onClick={onEdit} 
                className="p-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
              >
                <Edit2 size={12} className="md:w-3.5 md:h-3.5" />
              </button>
              <button 
                onClick={onDelete} 
                className="p-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors"
              >
                <Trash2 size={12} className="md:w-3.5 md:h-3.5" />
              </button>
            </div>
          )}

          {/* Avatar with upload capability in edit mode */}
          <div 
            className={`relative ${isEditMode ? 'cursor-pointer' : ''}`}
            onClick={isEditMode ? handleAvatarClick : undefined}
          >
            <div className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full overflow-hidden flex items-center justify-center">
              {renderAvatar(speaker.avatar, speaker.name)}
              <div className="avatar-fallback hidden w-full h-full items-center justify-center bg-gray-200 rounded-full">
                <User className="w-8 h-8 text-gray-500" />
              </div>
            </div>
            {isEditMode && (
              <>
                <div className="absolute inset-0 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                {isAvatarUploading && (
                  <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                )}
              </>
            )}
          </div>

          <h4 className="text-center font-bold mt-3 md:mt-4 text-sm md:text-base line-clamp-1">
            {speaker.name}
          </h4>
          {speaker.title && (
            <p className="text-justify text-xs md:text-sm mt-1 md:mt-2 line-clamp-2">
              {speaker.title}
            </p>
          )}
          {speaker.company && (
            <p className="text-justify text-xs md:text-sm text-gray-600 mt-1 line-clamp-2">
              {speaker.company}
            </p>
          )}
        </div>
      );
    }
  );

  SpeakerCard.displayName = 'SpeakerCard';

  /* --------------------------
            Render UI
     -------------------------- */
  return (
    <section id="speakers" className="py-12 md:py-20 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-3 sm:px-4 max-w-7xl relative">
        
        {/* Header */}
        <div className="text-center mb-10 md:mb-16 px-2">
          {isEditMode ? (
            <div className="max-w-3xl mx-auto space-y-4 px-4">
              <div>
                <input
                  type="text"
                  value={headerContent.eventTitle}
                  onChange={(e) => updateHeaderField("eventTitle", e.target.value)}
                  maxLength={100}
                  className="w-full text-2xl sm:text-3xl md:text-4xl font-bold px-4 py-2 md:py-3 border rounded-lg md:rounded-xl text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="text-xs text-gray-500 text-right mt-1">
                  {headerContent.eventTitle.length}/100
                </div>
              </div>

              <div>
                <input
                  type="text"
                  value={headerContent.sectionTitle}
                  onChange={(e) => updateHeaderField("sectionTitle", e.target.value)}
                  maxLength={100}
                  className="w-full text-xl sm:text-2xl font-bold px-4 py-2 md:py-3 border rounded-lg md:rounded-xl text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="text-xs text-gray-500 text-right mt-1">
                  {headerContent.sectionTitle.length}/100
                </div>
              </div>

              <div>
                <input
                  type="text"
                  value={headerContent.subtitle}
                  onChange={(e) => updateHeaderField("subtitle", e.target.value)}
                  maxLength={200}
                  className="w-full text-base md:text-lg px-4 py-2 md:py-3 border rounded-lg md:rounded-xl text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="text-xs text-gray-500 text-right mt-1">
                  {headerContent.subtitle.length}/200
                </div>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
                <span className="text-yellow-500 block md:inline">{headerContent.eventTitle}</span>
                <span className="block text-xl sm:text-2xl md:text-3xl text-gray-800 mt-2">{headerContent.sectionTitle}</span>
              </h2>
              <p className="text-gray-600 mt-3 md:mt-4 text-justify md:text-center px-4 sm:px-6 md:px-0 max-w-3xl mx-auto">
                {headerContent.subtitle}
              </p>
            </>
          )}

          {/* Edit Buttons */}
          <div className="absolute top-0 right-0 flex flex-col sm:flex-row gap-2 items-start sm:items-center p-2">
            {/* Auto-save status */}
            {isEditMode && onStateChange && (
              <div className="text-xs sm:text-sm text-gray-600 bg-white/90 px-2 sm:px-3 py-1 rounded-lg mb-2 sm:mb-0 shadow-sm">
                {isSaving ? (
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="hidden sm:inline">Saving...</span>
                    <span className="sm:hidden">Saving</span>
                  </span>
                ) : lastSaved ? (
                  <>
                    <span className="hidden sm:inline">Auto-saved {lastSaved.toLocaleTimeString()}</span>
                    <span className="sm:hidden">Saved</span>
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">No changes to save</span>
                    <span className="sm:hidden">Ready</span>
                  </>
                )}
              </div>
            )}
            
            {isEditMode ? (
              <div className="flex gap-2">
                <button 
                  onClick={saveHeaderEdit} 
                  className="px-4 py-2 sm:px-6 sm:py-3 bg-blue-600 text-white rounded-lg md:rounded-xl text-sm sm:text-base flex items-center gap-1 hover:bg-blue-700 transition-colors"
                >
                  <Save size={16} className="sm:w-4 sm:h-4" /> 
                  <span className="hidden sm:inline">Done</span>
                  <span className="sm:hidden">Save</span>
                </button>
                <button 
                  onClick={cancelHeaderEdit} 
                  className="px-4 py-2 sm:px-6 sm:py-3 bg-red-500 text-white rounded-lg md:rounded-xl text-sm sm:text-base flex items-center gap-1 hover:bg-red-600 transition-colors"
                >
                  <X size={16} className="sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Cancel</span>
                  <span className="sm:hidden">Cancel</span>
                </button>
              </div>
            ) : (
              <button 
                onClick={startHeaderEdit} 
                className="px-4 py-2 sm:px-6 sm:py-3 bg-green-500 text-white rounded-lg md:rounded-xl text-sm sm:text-base flex items-center gap-1 hover:bg-green-600 transition-colors"
              >
                <Edit size={16} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Edit</span>
                <span className="sm:hidden">Edit</span>
              </button>
            )}
          </div>
        </div>

        {/* Day Tabs */}
        <div className="flex flex-col sm:flex-row justify-center items-center mb-8 md:mb-12 gap-4">
          <div className="bg-white shadow-lg p-1 sm:p-2 rounded-xl md:rounded-2xl flex flex-wrap justify-center gap-1 sm:gap-2 max-w-full overflow-x-auto">
            {speakers.map((day, index) => (
              <div key={index} className="relative">
                {isEditMode ? (
                  <div>
                    <input
                      value={day.day}
                      onChange={(e) => handleDayEdit(index, e.target.value)}
                      onClick={() => setActiveDay(index)}
                      maxLength={50}
                      className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-lg md:rounded-xl border text-sm sm:text-base min-w-[120px] sm:min-w-0 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        activeDay === index ? 'bg-yellow-500 text-white border-yellow-500' : ''
                      }`}
                    />
                    <div className="text-xs text-gray-500 text-right mt-1">
                      {day.day.length}/50
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveDay(index)}
                    className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-lg md:rounded-xl text-sm sm:text-base whitespace-nowrap transition-colors ${
                      activeDay === index 
                        ? 'bg-yellow-400 text-black font-bold hover:bg-yellow-500' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {day.day}
                  </button>
                )}

                {isEditMode && speakers.length > 1 && (
                  <button
                    onClick={() => handleRemoveDay(index)}
                    className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white w-4 h-4 sm:w-5 sm:h-5 rounded-full text-xs flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          {isEditMode && (
            <button
              onClick={handleAddDay}
              className="px-3 sm:px-4 py-1 sm:py-2 bg-blue-600 text-white rounded-full text-sm sm:text-base flex items-center gap-1 whitespace-nowrap hover:bg-blue-700 transition-colors"
            >
              <Plus size={14} className="sm:w-4 sm:h-4" /> 
              <span className="hidden sm:inline">Add Day</span>
              <span className="sm:hidden">+ Day</span>
            </button>
          )}
        </div>

        {/* Speakers Grid */}
        <div className="px-2 sm:px-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-3">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
              {speakers[activeDay]?.day}
            </h3>

            {isEditMode && (
              <button
                onClick={() => handleAddSpeaker(activeDay)}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-green-600 text-white rounded-lg text-sm sm:text-base flex items-center gap-1 whitespace-nowrap hover:bg-green-700 transition-colors"
              >
                <Plus size={14} className="sm:w-4 sm:h-4" /> 
                <span className="hidden sm:inline">Add Speaker</span>
                <span className="sm:hidden">+ Speaker</span>
              </button>
            )}
          </div>

          {speakers[activeDay]?.speakers.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <p className="text-gray-500 text-lg">No speakers added for this day yet.</p>
              {isEditMode && (
                <button
                  onClick={() => handleAddSpeaker(activeDay)}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  + Add First Speaker
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {speakers[activeDay]?.speakers.map((speaker, index) => (
                <SpeakerCard
                  key={speaker.id}
                  speaker={speaker}
                  dayIndex={activeDay}
                  speakerIndex={index}
                  isEditing={editingCard === `${activeDay}-${index}`}
                  editForm={editForm}
                  isEditMode={isEditMode}
                  onEdit={() => handleEdit(activeDay, index, speaker)}
                  onSave={() => handleSave(activeDay, index)}
                  onCancel={handleCancel}
                  onDelete={() => handleDelete(activeDay, index)}
                  onFormChange={(data) => setEditForm(data)}
                  onAvatarUpload={(file: File) => handleAvatarImageSelect(file, activeDay, index)}
                  isAvatarUploading={isAvatarUploading}
                />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Avatar Cropper Modal - UPDATED WITH CIRCULAR CROP (Similar to SponsorsSection but circular) */}
      {showAvatarCropper && (
        <div className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full h-[80vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800">
                Crop Avatar (Circular {AVATAR_DIMENSIONS.width}x{AVATAR_DIMENSIONS.height})
              </h3>
              <button
                onClick={cancelAvatarCrop}
                className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Cropper Area with dynamic sizing (Similar to SponsorsSection but circular) */}
            <div className={`flex-1 relative bg-gray-900 min-h-0 ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}>
              <Cropper
                image={avatarImageToCrop || undefined}
                crop={avatarCrop}
                zoom={avatarZoom}
                aspect={1} // Fixed 1:1 aspect ratio for circular crop
                minZoom={avatarMinZoomDynamic}
                maxZoom={5}
                restrictPosition={false}
                zoomWithScroll={true}
                zoomSpeed={0.2}
                onCropChange={setAvatarCrop}
                onZoomChange={setAvatarZoom}
                onCropComplete={onAvatarCropComplete}
                onMediaLoaded={(ms) => setAvatarMediaSize(ms)}
                onCropAreaChange={(area, areaPixels) => setAvatarCropAreaSize(area)}
                onInteractionStart={() => setIsDragging(true)}
                onInteractionEnd={() => setIsDragging(false)}
                showGrid={true}
                cropShape="round" // Circular crop shape
                style={{
                  containerStyle: {
                    position: "relative",
                    width: "100%",
                    height: "100%",
                  },
                  cropAreaStyle: {
                    border: "2px solid white",
                    borderRadius: "50%", // Make it circular
                  },
                }}
              />
            </div>

            {/* Controls (Similar to SponsorsSection) */}
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              {/* Zoom Control */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-gray-700">
                    Zoom
                  </span>
                  <span className="text-gray-600">{avatarZoom.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  value={avatarZoom}
                  min={avatarMinZoomDynamic}
                  max={5}
                  step={0.1}
                  onChange={(e) => setAvatarZoom(Number(e.target.value))}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={resetAvatarCropSettings}
                  className="w-full border border-gray-300 text-gray-700 hover:bg-gray-100 rounded py-2 text-sm font-medium"
                >
                  Reset
                </button>
                <button
                  onClick={cancelAvatarCrop}
                  className="w-full border border-gray-300 text-gray-700 hover:bg-gray-100 rounded py-2 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={applyAvatarCrop}
                  disabled={isAvatarUploading}
                  className={`w-full ${isAvatarUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white rounded py-2 text-sm font-medium`}
                >
                  {isAvatarUploading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading...
                    </span>
                  ) : (
                    'Apply Crop'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default SpeakersSection;