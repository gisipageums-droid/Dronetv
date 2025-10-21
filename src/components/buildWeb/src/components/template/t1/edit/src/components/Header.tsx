import React, { useCallback, useEffect, useRef, useState } from "react";
import { Edit2, Save, Upload, X, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "react-toastify";
import Cropper from "react-easy-crop";

const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number }
): Promise<Blob> => {
  const image = new Image();
  image.src = imageSrc;
  // allow CORS-safe images if needed
  image.crossOrigin = "anonymous";

  return new Promise<Blob>((resolve, reject) => {
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

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

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Canvas is empty"));
            return;
          }
          resolve(blob);
        },
        "image/jpeg",
        0.95
      );
    };
    image.onerror = (err) => reject(err);
  });
};

interface HeaderProps {
  headerData?: {
    logo?: string;
    name?: string;
  };
  onStateChange?: (state: any) => void;
  userId?: string;
  publishedId?: string;
  templateSelection?: string;
}

export default function Header({
  headerData,
  onStateChange,
  userId,
  publishedId,
  templateSelection,
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [pendingLogoFile, setPendingLogoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Crop modal state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImage, setCropImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);

  // Combined state
  const [headerState, setHeaderState] = useState({
    logoSrc: headerData?.logo || "/images/logos/logo.svg",
    companyName: headerData?.name || "Your Company",
    navItems: [
      "Home",
      "About",
      "Profile",
      "Product",
      "Services",
      "Testimonials",
      "Blog",
      "Gallery",
    ],
  });

  useEffect(() => {
    if (onStateChange) onStateChange(headerState);
  }, [headerState, onStateChange]);

  const toggleMobileMenu = () => setIsMobileMenuOpen((v) => !v);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const openCropModal = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setCropImage(reader.result as string);
      setOriginalFile(file);
      setCropModalOpen(true);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    };
    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback((_: any, croppedAreaPixelsParam: any) => {
    setCroppedAreaPixels(croppedAreaPixelsParam);
  }, []);

  const applyCrop = async () => {
    try {
      if (!cropImage || !croppedAreaPixels) return;
      const croppedBlob = await getCroppedImg(cropImage, croppedAreaPixels);
      if (!originalFile) return;
      const croppedFile = new File([croppedBlob], originalFile.name, {
        type: "image/jpeg",
      });

      setPendingLogoFile(croppedFile);

      const reader = new FileReader();
      reader.onloadend = () => {
        setHeaderState((prev) => ({ ...prev, logoSrc: reader.result as string }));
      };
      reader.readAsDataURL(croppedFile);

      setCropModalOpen(false);
      toast.success("Logo cropped successfully");
    } catch (error) {
      console.error("Error cropping image:", error);
      toast.error("Error cropping image. Please try again.");
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      e.target.value = "";
      return;
    }

    e.target.value = "";
    openCropModal(file);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setPendingLogoFile(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPendingLogoFile(null);
    // Optionally revert preview if you kept an unsaved preview; currently we keep previous headerState.logoSrc
  };

  const handleSave = async () => {
    try {
      setIsUploading(true);

      if (pendingLogoFile) {
        if (!userId || !publishedId || !templateSelection) {
          console.error("Missing required props:", { userId, publishedId, templateSelection });
          toast.error("Missing user information. Please refresh and try again.");
          return;
        }

        const formData = new FormData();
        formData.append("file", pendingLogoFile);
        formData.append("sectionName", "header");
        formData.append("imageField", "logoSrc" + Date.now());
        formData.append("templateSelection", templateSelection);

        const uploadResponse = await fetch(
          `https://o66ziwsye5.execute-api.ap-south-1.amazonaws.com/prod/upload-image/${userId}/${publishedId}`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          setHeaderState((prev) => ({ ...prev, logoSrc: uploadData.imageUrl }));
          setPendingLogoFile(null);
          console.log("Logo uploaded to S3:", uploadData.imageUrl);
        } else {
          const errorData = await uploadResponse.json().catch(() => ({}));
          console.error("Logo upload failed:", errorData);
          toast.error(`Logo upload failed: ${errorData.message || "Unknown error"}`);
          return;
        }
      }

      setIsEditing(false);
      toast.success("Header section saved");
    } catch (error) {
      console.error("Error saving header section:", error);
      toast.error("Error saving changes. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <motion.header
        className="fixed top-14 left-0 right-0 w-full z-50 bg-white shadow-md border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          {/* 3-column layout: left (logo), center (nav), right (controls) */}
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* LEFT: Logo + Company */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative">
                <motion.div
                  className="flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <motion.img
                    src={headerState.logoSrc}
                    alt="Logo"
                    className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 object-contain rounded-full"
                    animate={{
                      y: [0, -4, 0],
                      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                    }}
                  />
                </motion.div>

                {/* Upload popover appears below logo while editing */}
                {isEditing && (
                  <div className="absolute left-[50px] top-full mt-2 bg-white/95 p-2 rounded shadow border border-gray-200 w-44">
                    <p className="text-xs mb-1 text-gray-600 text-center">Upload Logo</p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center justify-center gap-2 w-full px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                    >
                      <Upload size={14} /> Choose
                    </button>
                    {pendingLogoFile && (
                      <p className="text-xs text-orange-600 mt-1 text-center truncate px-1">
                        {pendingLogoFile.name}
                      </p>
                    )}
                  </div>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </div>

              <div className="min-w-0">
                {isEditing ? (
                  <input
                    type="text"
                    value={headerState.companyName}
                    onChange={(e) =>
                      setHeaderState((prev) => ({ ...prev, companyName: e.target.value }))
                    }
                    className="px-2 py-1 border rounded bg-white text-sm w-28 sm:w-36 md:w-48 max-w-full"
                    placeholder="Company name"
                  />
                ) : (
                  <span className="font-semibold text-sm sm:text-base text-gray-800 dark:text-gray-100 truncate">
                    {headerState.companyName}
                  </span>
                )}
              </div>
            </div>

            {/* CENTER: Desktop nav (centered). Hidden on small screens. */}
            <nav className="hidden md:flex items-center gap-4 lg:gap-6 flex-1 justify-center px-4">
              {headerState.navItems.map((item, index) =>
                isEditing ? (
                  <input
                    key={index}
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const updated = [...headerState.navItems];
                      updated[index] = e.target.value;
                      setHeaderState((prev) => ({ ...prev, navItems: updated }));
                    }}
                    className="px-2 py-1 border rounded text-sm w-20 lg:w-24 bg-white"
                    placeholder={`Nav ${index + 1}`}
                  />
                ) : (
                  <a
                    key={index}
                    href={`#${item.toLowerCase()}`}
                    className="text-gray-700 hover:text-yellow-600 transition-colors duration-200 font-medium text-sm lg:text-base whitespace-nowrap"
                  >
                    {item}
                  </a>
                )
              )}
            </nav>

            {/* RIGHT: Controls + mobile menu button */}
            <div className="flex items-center gap-3">
              {/* Edit / Save / Cancel Controls */}
              <div className="flex items-center">
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSave}
                      disabled={isUploading}
                      className={`flex items-center gap-2 px-3 py-1.5 ${
                        isUploading ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
                      } text-white rounded-md text-sm transition-all`}
                    >
                      {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                      <span className="hidden sm:inline">{isUploading ? "Uploading..." : "Save"}</span>
                    </button>

                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-3 py-1.5 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded-md text-sm"
                    >
                      <X size={14} />
                      <span className="hidden sm:inline">Cancel</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md text-sm"
                  >
                    <Edit2 size={14} />
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                )}
              </div>

              {/* Mobile menu toggle */}
              <div className="md:hidden">
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Toggle menu"
                >
                  <svg
                    className="h-5 w-5 sm:h-6 sm:w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {isMobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile nav panel */}
      <div
        className={`fixed top-14 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 transition-all duration-300 md:hidden ${
          isMobileMenuOpen ? "max-h-96 opacity-100 shadow-lg" : "max-h-0 opacity-0 pointer-events-none"
        } overflow-y-auto`}
      >
        <div className="px-4 pt-3 pb-4 space-y-2">
          {headerState.navItems.map((item, index) =>
            isEditing ? (
              <div key={index} className="flex items-center">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const updated = [...headerState.navItems];
                    updated[index] = e.target.value;
                    setHeaderState((prev) => ({ ...prev, navItems: updated }));
                  }}
                  className="w-full px-3 py-2 border rounded text-base bg-white"
                  placeholder={`Nav ${index + 1}`}
                />
              </div>
            ) : (
              <a
                key={index}
                href={`#${item.toLowerCase()}`}
                className="block px-3 py-2 text-gray-700 hover:text-yellow-600 hover:bg-gray-50 rounded-md transition-colors duration-200 font-medium text-base"
                onClick={() => {
                  closeMobileMenu();
                }}
              >
                {item}
              </a>
            )
          )}
        </div>
      </div>

      {/* Spacer so content doesn't hide under fixed header */}
      <div className="h-14 sm:h-16" />

      {/* Crop Modal */}
      {cropModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[99999999] p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-2xl mx-auto">
            <h3 className="text-lg sm:text-xl font-bold mb-4 text-gray-900">Crop Logo</h3>
            <div className="relative w-full h-64 sm:h-80 md:h-96 bg-gray-900 rounded-lg overflow-hidden">
              <Cropper
                image={cropImage || ""}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Zoom</label>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={applyCrop}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
              >
                Apply Crop
              </button>
              <button
                onClick={() => setCropModalOpen(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 py-2 px-4 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
