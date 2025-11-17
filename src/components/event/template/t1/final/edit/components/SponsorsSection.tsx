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

// === Remembered zoom logic constants ===
const REMEMBERED_MIN_ZOOM = 0.5;
const REMEMBERED_MAX_ZOOM = 4;
const REMEMBERED_ZOOM_STEP = 0.1;

const SponsorsSection: React.FC<SponsorsSectionProps> = ({
  sponsorsData,
  onStateChange,
  userId,
  eventId,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [sponsorsContent, setSponsorsContent] = useState<SponsorsDataContent>(defaultSponsorsContent);
  const [backupContent, setBackupContent] = useState<SponsorsDataContent>(defaultSponsorsContent);
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);

  // Cropping states
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [croppingForPartner, setCroppingForPartner] = useState<string | null>(null);
  const [aspectRatio] = useState(3 / 2); // Better aspect for logos

  // Use the remembered fixed minZoom
  const [minZoom] = useState<number>(REMEMBERED_MIN_ZOOM);
  const cropperContainerRef = useRef<HTMLDivElement | null>(null);

  const ensurePartnerIds = (partnersInput: any[]): Partner[] => {
    return partnersInput.map((p, idx) => {
      if (p && p.id) return { id: String(p.id), header: p.header ?? "Partner", image: p.image ?? "/images/partner-placeholder.png" };
      const newId = (typeof crypto !== "undefined" && (crypto as any).randomUUID)
        ? (crypto as any).randomUUID()
        : `temp-${Date.now()}-${idx}`;
      return { id: newId, header: p.header ?? "Partner", image: p.image ?? "/images/partner-placeholder.png" };
    });
  };

  useEffect(() => {
    if (sponsorsData && sponsorsData.title && Array.isArray(sponsorsData.partners)) {
      const normalized: SponsorsDataContent = {
        title: sponsorsData.title,
        titleHighlight: sponsorsData.titleHighlight ?? "",
        partners: ensurePartnerIds(sponsorsData.partners),
      };
      setSponsorsContent(normalized);
      setBackupContent(normalized);
    }
  }, [sponsorsData]);

  // ---------- Image / crop helpers ----------
  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>, partnerId?: string) => {
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
    };
    reader.readAsDataURL(file);
    e.currentTarget.value = "";
  }, []);

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

  const getCroppedImg = async (imageSrc: string, pixelCrop: any): Promise<{ file: File; previewUrl: string }> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get canvas context");

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
        if (!blob) throw new Error("Canvas is empty");
        const file = new File([blob], `sponsor-${Date.now()}.jpg`, {
          type: "image/jpeg",
          lastModified: Date.now(),
        });
        const previewUrl = URL.createObjectURL(blob);
        resolve({ file, previewUrl });
      }, "image/jpeg", 0.95);
    });
  };

  const applyCrop = async () => {
    try {
      if (!imageToCrop || !croppedAreaPixels || croppingForPartner === null) return;

      const { file, previewUrl } = await getCroppedImg(imageToCrop, croppedAreaPixels);

      if (croppingForPartner === NEW_SENTINEL) {
        const tempId = `temp-${Date.now()}`;
        const newPartner: Partner = {
          id: tempId,
          header: "New Partner",
          image: previewUrl,
        };

        setSponsorsContent((prev) => ({ ...prev, partners: [...prev.partners, newPartner] }));
        setPendingImages((prev) => [...prev, { file, partnerId: tempId, isNew: true }]);
        toast.success("Partner added! Click Save to upload logo to S3.");
      } else {
        setSponsorsContent((prev) => {
          const partners = prev.partners.map((p) =>
            p.id === croppingForPartner ? { ...p, image: previewUrl } : p
          );
          return { ...prev, partners };
        });

        setPendingImages((prev) => [...prev, { file, partnerId: croppingForPartner }]);
        toast.success("Logo updated! Click Save to upload to S3.");
      }

      setShowCropper(false);
      setImageToCrop(null);
      setOriginalFile(null);
      setCroppingForPartner(null);
      setCroppedAreaPixels(null);
      setZoom(1);
      setCrop({ x: 0, y: 0 });
    } catch (error) {
      console.error("Error cropping image:", error);
      toast.error("Error cropping image. Please try again.");
    }
  };

  const cancelCrop = () => {
    setShowCropper(false);
    setImageToCrop(null);
    setOriginalFile(null);
    setCroppingForPartner(null);
    setCroppedAreaPixels(null);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
  };

  // ---------- Wheel and keyboard handlers for panning/zooming ----------
  const handleWheel = (e: React.WheelEvent) => {
    // prevent page scroll while cropper open
    e.preventDefault();

    const delta = e.deltaY; // positive when scrolling down
    // If user holds ctrl/cmd -> zoom
    if (e.ctrlKey || e.metaKey) {
      // scale zoom change; invert sign so wheel down -> zoom out
      const zoomChange = -delta * 0.0015;
      setZoom((z) => {
        const next = +(z + zoomChange).toFixed(3);
        return Math.max(REMEMBERED_MIN_ZOOM, Math.min(REMEMBERED_MAX_ZOOM, next));
      });
      return;
    }

    // If shift held -> horizontal pan, else vertical pan
    const panFactor = 0.06; // tweak sensitivity
    if (e.shiftKey) {
      setCrop((c) => ({ x: +(c.x - delta * panFactor).toFixed(3), y: c.y }));
    } else {
      setCrop((c) => ({ x: c.x, y: +(c.y - delta * panFactor).toFixed(3) }));
    }
  };

  useEffect(() => {
    if (!showCropper) return;

    const handleKey = (ev: KeyboardEvent) => {
      const step = 2; // pixels-ish, react-easy-crop expects percentages-ish; tuned by divider
      if (ev.key === "ArrowUp") {
        ev.preventDefault();
        setCrop((c) => ({ x: c.x, y: +(c.y - step * 0.03).toFixed(3) }));
      } else if (ev.key === "ArrowDown") {
        ev.preventDefault();
        setCrop((c) => ({ x: c.x, y: +(c.y + step * 0.03).toFixed(3) }));
      } else if (ev.key === "ArrowLeft") {
        ev.preventDefault();
        setCrop((c) => ({ x: +(c.x - step * 0.03).toFixed(3), y: c.y }));
      } else if (ev.key === "ArrowRight") {
        ev.preventDefault();
        setCrop((c) => ({ x: +(c.x + step * 0.03).toFixed(3), y: c.y }));
      } else if ((ev.ctrlKey || ev.metaKey) && (ev.key === "+" || ev.key === "=")) {
        // ctrl + + to zoom in
        setZoom((z) => Math.min(REMEMBERED_MAX_ZOOM, +(z + REMEMBERED_ZOOM_STEP).toFixed(2)));
      } else if ((ev.ctrlKey || ev.metaKey) && ev.key === "-") {
        setZoom((z) => Math.max(REMEMBERED_MIN_ZOOM, +(z - REMEMBERED_ZOOM_STEP).toFixed(2)));
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [showCropper]);

  // ---------- Upload to S3 (API) ----------
  const uploadImageToS3 = async (file: File, fieldName: string): Promise<string> => {
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

  // ---------- Edit / Save / Cancel logic ----------
  const handleEditToggle = () => {
    if (editMode && onStateChange) {
      onStateChange(sponsorsContent);
    } else {
      setBackupContent(sponsorsContent);
    }
    setEditMode((v) => !v);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      if (pendingImages.length > 0) {
        setIsUploading(true);

        const updatedPartners = [...sponsorsContent.partners];

        for (const pending of pendingImages) {
          try {
            const s3Url = await uploadImageToS3(pending.file, `sponsor-logo-${pending.partnerId}`);

            const idx = updatedPartners.findIndex((p) => p.id === pending.partnerId);
            if (idx !== -1) {
              updatedPartners[idx].image = s3Url;
              if (pending.isNew) {
                updatedPartners[idx].id = Date.now().toString();
              }
            } else {
              updatedPartners.push({
                id: pending.isNew ? Date.now().toString() : pending.partnerId,
                header: "New Partner",
                image: s3Url,
              });
            }
          } catch (err) {
            console.error(`Error uploading ${pending.partnerId}`, err);
            toast.error("Failed to upload logo. Please try again.");
            setIsUploading(false);
            setIsSaving(false);
            return;
          }
        }

        setSponsorsContent((prev) => ({ ...prev, partners: updatedPartners }));
        setPendingImages([]);
      }

      await new Promise((r) => setTimeout(r, 400));
      setEditMode(false);
      if (onStateChange) onStateChange({ ...sponsorsContent });
      toast.success("Sponsors saved successfully!");
    } catch (err) {
      console.error("Error saving sponsors:", err);
      toast.error("Error saving changes. Please try again.");
    } finally {
      setIsSaving(false);
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setSponsorsContent(backupContent);
    setPendingImages([]);
    setEditMode(false);
  };

  // ---------- Add / remove partners ----------
  const addPartner = () => {
    const tempId = `temp-${Date.now()}`;
    const newPartner: Partner = {
      id: tempId,
      header: "New Partner",
      image: "/images/partner-placeholder.png",
    };
    setSponsorsContent((prev) => ({ ...prev, partners: [...prev.partners, newPartner] }));
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
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const removePartner = (partnerId: string) => {
    setSponsorsContent((prev) => ({ ...prev, partners: prev.partners.filter((p) => p.id !== partnerId) }));
    setPendingImages((prev) => prev.filter((pi) => pi.partnerId !== partnerId));
  };

  const updatePartnerHeader = (partnerId: string, header: string) => {
    setSponsorsContent((prev) => ({
      ...prev,
      partners: prev.partners.map((p) => (p.id === partnerId ? { ...p, header } : p)),
    }));
  };

  // ---------- RENDER ----------
  return (
    <section id="sponsors" className="py-20 bg-white relative">
      <div className="container mx-auto px-4 text-center">
        <div className="absolute top-6 right-6 z-30 flex gap-3">
          {editMode ? (
            <>
              <button
                onClick={handleSave}
                disabled={isSaving || isUploading}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {isUploading || isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save size={18} />}
                {isUploading ? "Uploading..." : isSaving ? "Saving..." : "Save"}
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
              <input
                type="text"
                value={sponsorsContent.title}
                onChange={(e) => setSponsorsContent({ ...sponsorsContent, title: e.target.value })}
                className="border px-2 py-1 rounded"
              />
              <input
                type="text"
                value={sponsorsContent.titleHighlight}
                onChange={(e) => setSponsorsContent({ ...sponsorsContent, titleHighlight: e.target.value })}
                className="border px-2 py-1 rounded text-red-600"
              />
            </div>
          ) : (
            <>
              {sponsorsContent.title} <span className="text-red-600">{sponsorsContent.titleHighlight}</span>
            </>
          )}
        </h2>

        <div className="w-24 h-1 bg-[#FFD400] mx-auto mb-10"></div>

        <div className="max-w-6xl mx-auto rounded-[28px] bg-white shadow-xl p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-12">
            {sponsorsContent.partners.map((partner) => (
              <div key={partner.id} className="relative text-center flex flex-col items-center gap-4">
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
                    <input
                      type="text"
                      value={partner.header}
                      onChange={(e) => updatePartnerHeader(partner.id, e.target.value)}
                      className="border px-2 py-1 rounded text-sm w-full"
                    />

                    <div className="relative group">
                      <img
                        src={partner.image}
                        alt={partner.header}
                        className="h-20 object-contain border-2 border-dashed border-gray-300 rounded-lg"
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
                    <span className="text-xs text-gray-500">Click logo to replace</span>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xs sm:text-sm font-semibold uppercase">{partner.header}</h3>
                    <img
                      src={partner.image}
                      alt={partner.header}
                      className="h-20 object-contain"
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

        {/* Cropper Modal */}
        {showCropper && (
          <div className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full h-[80vh] flex flex-col">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-semibold">Crop Logo</h3>
                <button onClick={cancelCrop} className="p-1 hover:bg-gray-200 rounded">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* IMPORTANT: attach ref and wheel handler to wrapper */}
              <div
                ref={cropperContainerRef}
                onWheel={handleWheel}
                className="flex-1 relative"
                role="region"
                aria-label="Cropper area (use wheel to pan/zoom: ctrl+wheel to zoom, shift+wheel to horizontal pan)"
              >
                <Cropper
                  image={imageToCrop || undefined}
                  crop={crop}
                  zoom={zoom}
                  aspect={aspectRatio}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                  minZoom={REMEMBERED_MIN_ZOOM}
                  maxZoom={REMEMBERED_MAX_ZOOM}
                  restrictPosition={false} // as remembered
                  showGrid={false}
                />
              </div>

              {/* Controls implementing the remembered zoom logic */}
              <div className="p-4 border-t flex gap-4 items-center">
                <span className="text-sm text-gray-600">Zoom:</span>

                <div className="flex items-center gap-2 w-full">
                  <button
                    onClick={() => setZoom((z) => Math.max(REMEMBERED_MIN_ZOOM, +(z - REMEMBERED_ZOOM_STEP).toFixed(2)))}
                    className="px-3 py-1.5 text-sm rounded border bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    type="button"
                  >
                    −
                  </button>

                  <input
                    type="range"
                    value={zoom}
                    min={REMEMBERED_MIN_ZOOM}
                    max={REMEMBERED_MAX_ZOOM}
                    step={REMEMBERED_ZOOM_STEP}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="flex-1"
                  />

                  <button
                    onClick={() => setZoom((z) => Math.min(REMEMBERED_MAX_ZOOM, +(z + REMEMBERED_ZOOM_STEP).toFixed(2)))}
                    className="px-3 py-1.5 text-sm rounded border bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    type="button"
                  >
                    +
                  </button>

                  <button
                    onClick={() => setZoom(1)}
                    className="px-3 py-1.5 text-sm rounded border bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    type="button"
                  >
                    1x
                  </button>
                </div>

                <button onClick={applyCrop} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                  Apply Crop
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SponsorsSection;
