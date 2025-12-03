import React, { useState, useEffect, useCallback, useRef } from "react";
import { Edit, Save, X, Plus, Trash2, Upload, Loader2 } from "lucide-react";
import Cropper from "react-easy-crop";
import { toast } from "sonner";

interface Partner {
  id: string;
  header: string;
  image: string;
}

interface SponsorsDataContent {
  title: string;
  titleHighlight: string;
  partners: Partner[];
}

interface SponsorsSectionProps {
  sponsorsData?: SponsorsDataContent;
  onStateChange?: (data: SponsorsDataContent) => void;
  userId?: string;
  eventId?: string;
}

const defaultSponsorsContent: SponsorsDataContent = {
  title: "Our",
  titleHighlight: "Partners",
  partners: [
    { id: "1", header: "Partner Category", image: "/images/partner1.png" },
    { id: "2", header: "Partner Category", image: "/images/partner2.png" },
    { id: "3", header: "Partner Category", image: "/images/partner3.png" },
  ],
};

interface PendingImage {
  file: File;
  partnerId: string;
  isNew?: boolean;
}

const NEW_SENTINEL = "__NEW__";

// === Sponsors Logo Dimensions - Fixed similar to Header ===
const SPONSORS_LOGO_DIMENSIONS = { width: 160, height: 80 }; // Fixed size for sponsor logos

// === Aspect ratio selection ===
type AspectRatioType = "original" | "1:1" | "3:2" | "16:9";

const SponsorsSection: React.FC<SponsorsSectionProps> = ({
  sponsorsData,
  onStateChange,
  userId,
  eventId,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [sponsorsContent, setSponsorsContent] = useState<SponsorsDataContent>(
    defaultSponsorsContent
  );
  const [backupContent, setBackupContent] = useState<SponsorsDataContent>(
    defaultSponsorsContent
  );

  // Track changes for auto-save
  const hasUnsavedChanges = useRef(false);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();
  const previousSponsorsContentRef = useRef<any>(null);

  // Cropping states - ENHANCED WITH ASPECT RATIO OPTIONS (Similar to Header)
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [croppingForPartner, setCroppingForPartner] = useState<string | null>(null);
  
  // Aspect ratio selection state (Similar to Header)
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<AspectRatioType>("original");
  
  // Media size and crop area size for dynamic zoom
  const [mediaSize, setMediaSize] = useState<{ width: number; height: number; naturalWidth: number; naturalHeight: number } | null>(null);
  const [cropAreaSize, setCropAreaSize] = useState<{ width: number; height: number } | null>(null);
  const [minZoomDynamic, setMinZoomDynamic] = useState(0.1);
  const [isDragging, setIsDragging] = useState(false);
  
  // Arrow key panning
  const PAN_STEP = 10;

  const ensurePartnerIds = (partnersInput: any[]): Partner[] => {
    return partnersInput.map((p, idx) => {
      if (p && p.id)
        return {
          id: String(p.id),
          header: p.header ?? "Partner",
          image: p.image ?? "/images/partner-placeholder.png",
        };
      const newId =
        typeof crypto !== "undefined" && (crypto as any).randomUUID
          ? (crypto as any).randomUUID()
          : `temp-${Date.now()}-${idx}`;
      return {
        id: newId,
        header: p.header ?? "Partner",
        image: p.image ?? "/images/partner-placeholder.png",
      };
    });
  };

  useEffect(() => {
    if (
      sponsorsData &&
      sponsorsData.title &&
      Array.isArray(sponsorsData.partners)
    ) {
      const normalized: SponsorsDataContent = {
        title: sponsorsData.title,
        titleHighlight: sponsorsData.titleHighlight ?? "",
        partners: ensurePartnerIds(sponsorsData.partners),
      };
      setSponsorsContent(normalized);
      setBackupContent(normalized);
      previousSponsorsContentRef.current = normalized;
    }
  }, [sponsorsData]);

  // Allow more zoom-out; do not enforce cover when media/crop sizes change (Similar to Header)
  useEffect(() => {
    if (mediaSize && cropAreaSize) {
      setMinZoomDynamic(0.1);
    }
  }, [mediaSize, cropAreaSize]);

  // Arrow keys to pan image inside crop area when cropper is open (Similar to Header)
  const nudge = useCallback((dx: number, dy: number) => {
    setCrop((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
  }, []);

  useEffect(() => {
    if (!showCropper) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); nudge(-PAN_STEP, 0); }
      else if (e.key === "ArrowRight") { e.preventDefault(); nudge(PAN_STEP, 0); }
      else if (e.key === "ArrowUp") { e.preventDefault(); nudge(0, -PAN_STEP); }
      else if (e.key === "ArrowDown") { e.preventDefault(); nudge(0, PAN_STEP); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showCropper, nudge]);

  // Auto-save function
  const autoSave = useCallback(async () => {
    if (!onStateChange || !editMode || !hasUnsavedChanges.current) return;

    setIsSaving(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onStateChange(sponsorsContent);
    setLastSaved(new Date());
    setIsSaving(false);
    hasUnsavedChanges.current = false;
  }, [sponsorsContent, editMode, onStateChange]);

  // Debounced auto-save effect
  useEffect(() => {
    if (!editMode || !onStateChange || !hasUnsavedChanges.current) return;

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      autoSave();
    }, 1000);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [sponsorsContent, editMode, autoSave, onStateChange]);

  // Effect to detect actual changes in sponsorsContent
  useEffect(() => {
    if (previousSponsorsContentRef.current === null || !editMode) {
      previousSponsorsContentRef.current = sponsorsContent;
      return;
    }

    const hasChanged = JSON.stringify(previousSponsorsContentRef.current) !== JSON.stringify(sponsorsContent);
    
    if (hasChanged) {
      hasUnsavedChanges.current = true;
      previousSponsorsContentRef.current = sponsorsContent;
    }
  }, [sponsorsContent, editMode]);

  // Get aspect ratio value based on selection (Similar to Header)
  const getAspectRatio = () => {
    switch (selectedAspectRatio) {
      case "1:1":
        return 1;
      case "3:2":
        return 3 / 2;
      case "16:9":
        return 16 / 9;
      case "original":
      default:
        return SPONSORS_LOGO_DIMENSIONS.width / SPONSORS_LOGO_DIMENSIONS.height;
    }
  };

  // Get display text for aspect ratio (Similar to Header)
  const getAspectRatioText = () => {
    switch (selectedAspectRatio) {
      case "1:1":
        return "1:1";
      case "3:2":
        return "3:2";
      case "16:9":
        return "16:9";
      case "original":
      default:
        return `${SPONSORS_LOGO_DIMENSIONS.width}:${SPONSORS_LOGO_DIMENSIONS.height}`;
    }
  };

  // ---------- Image / crop helpers ----------
  const handleImageSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, partnerId?: string) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImageToCrop(reader.result as string);
        setOriginalFile(file);
        setCroppingForPartner(partnerId ?? NEW_SENTINEL);
        setShowCropper(true);
        setZoom(1);
        setCrop({ x: 0, y: 0 });
        // Reset to original aspect ratio when new image is loaded (Similar to Header)
        setSelectedAspectRatio("original");
      };
      reader.readAsDataURL(file);
      e.currentTarget.value = "";
    },
    []
  );

  const onCropComplete = useCallback((_: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  // Function to get cropped image - UPDATED WITH FIXED DIMENSIONS (Similar to Header)
  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: any
  ): Promise<{ file: File; previewUrl: string }> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get canvas context");

    // Fixed output dimensions - 160x80 (Similar to Header's 77x45)
    const outputWidth = SPONSORS_LOGO_DIMENSIONS.width;
    const outputHeight = SPONSORS_LOGO_DIMENSIONS.height;

    canvas.width = outputWidth;
    canvas.height = outputHeight;

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
          if (!blob) throw new Error("Canvas is empty");
          const file = new File([blob], `sponsor-${Date.now()}.jpg`, {
            type: "image/jpeg",
            lastModified: Date.now(),
          });
          const previewUrl = URL.createObjectURL(blob);
          resolve({ file, previewUrl });
        },
        "image/jpeg",
        0.95
      );
    });
  };

  // Auto-upload to AWS after cropping
  const uploadImageToS3 = async (
    file: File,
    fieldName: string
  ): Promise<string> => {
    if (!userId) {
      throw new Error("User ID is required for image upload");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);
    formData.append("fieldName", fieldName + Date.now());

    const uploadResponse = await fetch(
      `https://ow3v94b9gf.execute-api.ap-south-1.amazonaws.com/dev/events-image-update`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json().catch(() => ({}));
      throw new Error(errorData.message || "Image upload failed");
    }

    const uploadData = await uploadResponse.json();
    return uploadData.s3Url;
  };

  // Apply crop and UPLOAD IMMEDIATELY to AWS - UPDATED WITH AUTO-SAVE (Similar to Header)
  const applyCrop = async () => {
    try {
      if (!imageToCrop || !croppedAreaPixels || croppingForPartner === null)
        return;

      setIsUploading(true);
      const { file, previewUrl } = await getCroppedImg(
        imageToCrop,
        croppedAreaPixels
      );

      // Auto-upload to AWS immediately after cropping
      let s3Url = previewUrl;
      try {
        s3Url = await uploadImageToS3(
          file,
          `sponsor-logo-${croppingForPartner === NEW_SENTINEL ? 'new' : croppingForPartner}`
        );
        toast.success("Logo uploaded successfully!");
      } catch (uploadError) {
        console.error("Error uploading to S3:", uploadError);
        toast.error("Logo cropped but upload failed. Using local preview.");
      }

      if (croppingForPartner === NEW_SENTINEL) {
        const tempId = `temp-${Date.now()}`;
        const newPartner: Partner = {
          id: tempId,
          header: "New Partner",
          image: s3Url,
        };

        setSponsorsContent((prev) => ({
          ...prev,
          partners: [...prev.partners, newPartner],
        }));
      } else {
        setSponsorsContent((prev) => {
          const partners = prev.partners.map((p) =>
            p.id === croppingForPartner ? { ...p, image: s3Url } : p
          );
          return { ...prev, partners };
        });
      }

      setShowCropper(false);
      setImageToCrop(null);
      setOriginalFile(null);
      setCroppingForPartner(null);
      setCroppedAreaPixels(null);
      setZoom(1);
      setCrop({ x: 0, y: 0 });
      setMediaSize(null);
      setCropAreaSize(null);
    } catch (error) {
      console.error("Error cropping image:", error);
      toast.error("Error cropping image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Cancel cropping - UPDATED (Similar to Header)
  const cancelCrop = () => {
    setShowCropper(false);
    setImageToCrop(null);
    setOriginalFile(null);
    setCroppingForPartner(null);
    setCroppedAreaPixels(null);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
    setMediaSize(null);
    setCropAreaSize(null);
  };

  // Reset zoom and rotation - UPDATED (Similar to Header)
  const resetCropSettings = () => {
    setZoom(1);
    setCrop({ x: 0, y: 0 });
  };

  // ---------- Edit / Save / Cancel logic ----------
  const handleEditToggle = () => {
    if (!editMode) {
      setBackupContent(sponsorsContent);
      hasUnsavedChanges.current = false;
    } else {
      if (hasUnsavedChanges.current && onStateChange) {
        onStateChange(sponsorsContent);
        setLastSaved(new Date());
        hasUnsavedChanges.current = false;
      }
    }
    setEditMode((v) => !v);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await new Promise((r) => setTimeout(r, 400));
      setEditMode(false);
      toast.success("Sponsors saved successfully!");
    } catch (err) {
      console.error("Error saving sponsors:", err);
      toast.error("Error saving changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setSponsorsContent(backupContent);
    if (onStateChange) {
      onStateChange(backupContent);
    }
    setEditMode(false);
    hasUnsavedChanges.current = false;
  };

  // ---------- Add / remove partners ----------
  const addPartner = () => {
    const tempId = `temp-${Date.now()}`;
    const newPartner: Partner = {
      id: tempId,
      header: "New Partner",
      image: "/images/partner-placeholder.png",
    };
    setSponsorsContent((prev) => ({
      ...prev,
      partners: [...prev.partners, newPartner],
    }));
  };

  const addPartnerWithImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImageToCrop(reader.result as string);
        setOriginalFile(file);
        setCroppingForPartner(NEW_SENTINEL);
        setShowCropper(true);
        setZoom(1);
        setCrop({ x: 0, y: 0 });
        setSelectedAspectRatio("original");
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const removePartner = (partnerId: string) => {
    setSponsorsContent((prev) => ({
      ...prev,
      partners: prev.partners.filter((p) => p.id !== partnerId),
    }));
  };

  const updatePartnerHeader = (partnerId: string, header: string) => {
    setSponsorsContent((prev) => ({
      ...prev,
      partners: prev.partners.map((p) =>
        p.id === partnerId ? { ...p, header } : p
      ),
    }));
  };

  // Update header fields
  const updateHeaderField = (field: 'title' | 'titleHighlight', value: string) => {
    setSponsorsContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // ---------- RENDER ----------
  return (
    <section id="sponsors" className="py-20 bg-white relative">
      <div className="container mx-auto px-4 text-center">
        <div className="absolute top-6 right-6 z-30 flex gap-3 items-center">
          {/* Auto-save status */}
          {editMode && onStateChange && (
            <div className="text-sm text-gray-600 mr-2 bg-white/80 px-3 py-1 rounded-lg hidden sm:block">
              {isSaving ? (
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  Saving...
                </span>
              ) : lastSaved ? (
                <span>Auto-saved {lastSaved.toLocaleTimeString()}</span>
              ) : (
                <span>No changes to save</span>
              )}
            </div>
          )}
          
          {editMode ? (
            <>
              <button
                onClick={handleEditToggle}
                disabled={isSaving || isUploading}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                Done
              </button>

              <button
                onClick={handleCancel}
                disabled={isSaving || isUploading}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                <X size={18} />
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={handleEditToggle}
              className="flex items-center gap-2 bg-black/70 text-white px-4 py-2 rounded-lg hover:bg-black"
            >
              <Edit size={18} />
              Edit
            </button>
          )}
        </div>

        {editMode && (
          <div className="mb-6 flex gap-2 justify-center">
            <button
              onClick={addPartner}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Plus size={18} />
              Add Partner (Text Only)
            </button>
            <button
              onClick={addPartnerWithImage}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              <Upload size={18} />
              Add Partner with Logo
            </button>
          </div>
        )}

        <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
          {editMode ? (
            <div className="flex gap-2 justify-center">
              <div>
                <input
                  type="text"
                  value={sponsorsContent.title}
                  onChange={(e) => updateHeaderField('title', e.target.value)}
                  maxLength={50}
                  className="border px-2 py-1 rounded"
                />
                <div className="text-xs text-gray-500 text-right mt-1">
                  {sponsorsContent.title.length}/50
                </div>
              </div>
              <div>
                <input
                  type="text"
                  value={sponsorsContent.titleHighlight}
                  onChange={(e) => updateHeaderField('titleHighlight', e.target.value)}
                  maxLength={50}
                  className="border px-2 py-1 rounded text-red-600"
                />
                <div className="text-xs text-gray-500 text-right mt-1">
                  {sponsorsContent.titleHighlight.length}/50
                </div>
              </div>
            </div>
          ) : (
            <>
              {sponsorsContent.title}{" "}
              <span className="text-red-600">
                {sponsorsContent.titleHighlight}
              </span>
            </>
          )}
        </h2>

        <div className="w-24 h-1 bg-[#FFD400] mx-auto mb-10"></div>

        <div className="max-w-6xl mx-auto rounded-[28px] bg-white shadow-xl p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-12">
            {sponsorsContent.partners.map((partner) => (
              <div
                key={partner.id}
                className="relative text-center flex flex-col items-center gap-4"
              >
                {editMode && (
                  <button
                    onClick={() => removePartner(partner.id)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-7 h-7 flex justify-center items-center hover:bg-red-700"
                  >
                    <Trash2 size={14} />
                  </button>
                )}

                {editMode ? (
                  <div className="flex flex-col gap-2 w-full items-center">
                    <div className="w-full">
                      <input
                        type="text"
                        value={partner.header}
                        onChange={(e) =>
                          updatePartnerHeader(partner.id, e.target.value)
                        }
                        maxLength={100}
                        className="border px-2 py-1 rounded text-sm w-full"
                      />
                      <div className="text-xs text-gray-500 text-right mt-1">
                        {partner.header.length}/100
                      </div>
                    </div>

                    <div className="relative group">
                      <img
                        src={partner.image}
                        alt={partner.header}
                        style={{
                          width: `${SPONSORS_LOGO_DIMENSIONS.width}px`,
                          height: `${SPONSORS_LOGO_DIMENSIONS.height}px`,
                        }}
                        className="object-cover border-2 border-dashed border-gray-300 rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='60'%3E%3Crect width='100' height='60' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-size='10' text-anchor='middle'%3EImage Missing%3C/text%3E%3C/svg%3E";
                        }}
                      />
                      <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg cursor-pointer flex items-center justify-center">
                        <Upload className="w-6 h-6 text-white" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageSelect(e, partner.id)}
                        />
                      </label>
                    </div>
                    <span className="text-xs text-gray-500">
                      Click logo to replace (160x80)
                    </span>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xs sm:text-sm font-semibold uppercase">
                      {partner.header}
                    </h3>
                    <img
                      src={partner.image}
                      alt={partner.header}
                      style={{
                        width: `${SPONSORS_LOGO_DIMENSIONS.width}px`,
                        height: `${SPONSORS_LOGO_DIMENSIONS.height}px`,
                      }}
                      className="object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='60'%3E%3Crect width='100' height='60' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-size='10' text-anchor='middle'%3EImage Missing%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Cropper Modal - UPDATED WITH ASPECT RATIO OPTIONS (Similar to Header) */}
        {showCropper && (
          <div className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full h-[80vh] flex flex-col">
              <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-800">
                  Crop Logo ({getAspectRatioText()} Ratio)
                </h3>
                <button
                  onClick={cancelCrop}
                  className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Aspect Ratio Selection (Similar to Header) */}
              <div className="p-4 border-b border-gray-200 bg-white">
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm font-medium text-gray-700 mr-2">Aspect Ratio:</span>
                  <button
                    onClick={() => setSelectedAspectRatio("original")}
                    className={`px-3 py-1 text-sm rounded border ${selectedAspectRatio === "original"
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                      }`}
                  >
                    {SPONSORS_LOGO_DIMENSIONS.width}:{SPONSORS_LOGO_DIMENSIONS.height} (Fixed)
                  </button>
                  <button
                    onClick={() => setSelectedAspectRatio("1:1")}
                    className={`px-3 py-1 text-sm rounded border ${selectedAspectRatio === "1:1"
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                      }`}
                  >
                    1:1 (Square)
                  </button>
                  <button
                    onClick={() => setSelectedAspectRatio("3:2")}
                    className={`px-3 py-1 text-sm rounded border ${selectedAspectRatio === "3:2"
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                      }`}
                  >
                    3:2 (Standard)
                  </button>
                  <button
                    onClick={() => setSelectedAspectRatio("16:9")}
                    className={`px-3 py-1 text-sm rounded border ${selectedAspectRatio === "16:9"
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                      }`}
                  >
                    16:9 (Landscape)
                  </button>
                </div>
              </div>

              {/* Cropper Area with dynamic sizing (Similar to Header) */}
              <div className={`flex-1 relative bg-gray-900 min-h-0 ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}>
                <Cropper
                  image={imageToCrop || undefined}
                  crop={crop}
                  zoom={zoom}
                  aspect={getAspectRatio()}
                  minZoom={minZoomDynamic}
                  maxZoom={5}
                  restrictPosition={false}
                  zoomWithScroll={true}
                  zoomSpeed={0.2}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                  onMediaLoaded={(ms) => setMediaSize(ms)}
                  onCropAreaChange={(area, areaPixels) => setCropAreaSize(area)}
                  onInteractionStart={() => setIsDragging(true)}
                  onInteractionEnd={() => setIsDragging(false)}
                  showGrid={true}
                  cropShape="rect"
                  style={{
                    containerStyle: {
                      position: "relative",
                      width: "100%",
                      height: "100%",
                    },
                    cropAreaStyle: {
                      border: "2px solid white",
                      borderRadius: "8px",
                    },
                  }}
                />
              </div>

              {/* Controls (Similar to Header) */}
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                {/* Zoom Control */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-gray-700">
                      Zoom
                    </span>
                    <span className="text-gray-600">{zoom.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    value={zoom}
                    min={minZoomDynamic}
                    max={5}
                    step={0.1}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
                  />
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={resetCropSettings}
                    className="w-full border border-gray-300 text-gray-700 hover:bg-gray-100 rounded py-2 text-sm font-medium"
                  >
                    Reset
                  </button>
                  <button
                    onClick={cancelCrop}
                    className="w-full border border-gray-300 text-gray-700 hover:bg-gray-100 rounded py-2 text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={applyCrop}
                    disabled={isUploading}
                    className={`w-full ${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white rounded py-2 text-sm font-medium`}
                  >
                    {isUploading ? "Uploading..." : "Apply Crop"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SponsorsSection;