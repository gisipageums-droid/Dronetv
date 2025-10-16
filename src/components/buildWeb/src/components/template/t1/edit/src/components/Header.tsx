import { Edit2, Save, Upload, X, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState, useCallback } from "react";
import { toast } from "react-toastify";
import Cropper from "react-easy-crop";

// Crop helper function
const getCroppedImg = async (imageSrc, pixelCrop) => {
  const image = new Image();
  image.src = imageSrc;

  return new Promise((resolve, reject) => {
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

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
    image.onerror = reject;
  });
};

export default function Header({ 
  headerData, 
  onStateChange, 
  userId, 
  publishedId, 
  templateSelection 
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [pendingLogoFile, setPendingLogoFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Crop modal state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImage, setCropImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);

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

  // Add this useEffect to notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(headerState);
    }
  }, [headerState, onStateChange]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // Open crop modal
  const openCropModal = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setCropImage(reader.result);
      setOriginalFile(file);
      setCropModalOpen(true);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    };
    reader.readAsDataURL(file);
  };

  // Handle crop complete
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Apply crop
  const applyCrop = async () => {
    try {
      const croppedBlob = await getCroppedImg(cropImage, croppedAreaPixels);
      const croppedFile = new File([croppedBlob], originalFile.name, {
        type: "image/jpeg",
      });

      // Store the cropped file for upload on Save
      setPendingLogoFile(croppedFile);

      // Show immediate local preview of cropped image
      const reader = new FileReader();
      reader.onloadend = () => {
        setHeaderState((prev) => ({
          ...prev,
          logoSrc: reader.result,
        }));
      };
      reader.readAsDataURL(croppedFile);

      setCropModalOpen(false);
      toast.success("Logo cropped successfully");
    } catch (error) {
      console.error("Error cropping image:", error);
      toast.error("Error cropping image. Please try again.");
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      toast.error("File size must be less than 5MB");
      return;
    }

    // Reset file input
    e.target.value = '';

    // Open crop modal instead of directly setting the file
    openCropModal(file);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setPendingLogoFile(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPendingLogoFile(null);
  };

  // Updated Save button handler - uploads image and stores S3 URL
  const handleSave = async () => {
    try {
      setIsUploading(true);

      // If there's a pending logo, upload it first
      if (pendingLogoFile) {
        if (!userId || !publishedId || !templateSelection) {
          console.error("Missing required props:", {
            userId,
            publishedId,
            templateSelection,
          });
          toast.error(
            "Missing user information. Please refresh and try again."
          );
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
          // Replace local preview with S3 URL
          setHeaderState((prev) => ({
            ...prev,
            logoSrc: uploadData.imageUrl,
          }));
          setPendingLogoFile(null); // Clear pending file
          console.log("Logo uploaded to S3:", uploadData.imageUrl);
        } else {
          const errorData = await uploadResponse.json();
          console.error("Logo upload failed:", errorData);
          toast.error(
            `Logo upload failed: ${errorData.message || "Unknown error"}`
          );
          return;
        }
      }

      // Exit edit mode
      setIsEditing(false);
      toast.success("Header section saved with S3 URLs ready for publish");
    } catch (error) {
      console.error("Error saving header section:", error);
      toast.error("Error saving changes. Please try again.");
      // Keep in edit mode so user can retry
    } finally {
      setIsUploading(false);
    }
  };

  const headerStyles = {
    position: "fixed",
    top: "56px",
    left: "0",
    right: "0",
    width: "100%",
    zIndex: 1000,
    backgroundColor: "white",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    borderBottom: "1px solid #e5e7eb",
    transition: "all 0.5s ease",
  };

  const mobileMenuStyles = {
    position: "fixed",
    top: "112px",
    left: "0",
    right: "0",
    zIndex: 999,
    backgroundColor: "white",
    borderTop: "1px solid #e5e7eb",
    maxHeight: isMobileMenuOpen ? "384px" : "0",
    opacity: isMobileMenuOpen ? "1" : "0",
    overflow: "hidden",
    transition: "all 0.3s ease-in-out",
  };

  return (
    <>
      <motion.header
        style={headerStyles}
        className="dark:bg-gray-900 dark:border-gray-700"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between h-16">
            <div className="absolute top-1 right-12 md:right-2 z-20">
              {isEditing ? (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={isUploading}
                    className={`flex items-center gap-1 px-2 py-1 ${
                      isUploading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-500 hover:bg-green-600"
                    } text-white rounded shadow text-xs`}
                  >
                    {isUploading ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Save size={12} />
                    )}{" "}
                    {isUploading ? "Uploading..." : "Save"}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-1 px-2 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded shadow text-xs"
                  >
                    <X size={12} /> Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-1 px-2 py-1 bg-gray-200 text-gray-700 rounded shadow hover:bg-gray-300 text-xs"
                >
                  <Edit2 size={12} /> Edit
                </button>
              )}
            </div>

            {/* Logo + Company Name */}
            <motion.div
              className="flex flex-row gap-2 items-center text-xl sm:text-2xl font-bold text-red-500 dark:text-yellow-400 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
            >
              {/* Enhanced Logo with Animations */}
              <div className="relative">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    rotate: 0,
                    transition: {
                      duration: 0.8,
                      type: "spring",
                      stiffness: 120,
                    },
                  }}
                  whileHover={{
                    scale: 1.2,
                    rotate: 360,
                    transition: { duration: 0.5 },
                  }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <motion.img
                    src={headerState.logoSrc}
                    alt="Logo"
                    className="h-4 w-4 sm:h-6 sm:w-6 object-contain rounded-full"
                    animate={{
                      y: [0, -5, 0],
                      transition: {
                        duration: 3,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                      },
                    }}
                  />
                </motion.div>

                {isEditing && (
                  <div className="absolute -bottom-14 left-0 bg-white/90 p-2 rounded shadow-lg">
                    <p className="text-xs mb-1 text-gray-600">Upload Logo:</p>
                    <motion.button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1 p-1 bg-gray-200 rounded shadow text-xs hover:bg-gray-300"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Upload size={12} /> Choose File
                    </motion.button>
                    {pendingLogoFile && (
                      <p className="text-xs text-orange-600 mt-1 max-w-[150px] truncate">
                        Selected: {pendingLogoFile.name}
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

              {/* Editable Company Name */}
              {isEditing ? (
                <input
                  type="text"
                  value={headerState.companyName}
                  onChange={(e) =>
                    setHeaderState((prev) => ({
                      ...prev,
                      companyName: e.target.value,
                    }))
                  }
                  className="px-2 py-1 border rounded bg-white text-sm"
                  placeholder="Company Name"
                />
              ) : (
                <span>{headerState.companyName}</span>
              )}
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4 mr-20">
              {headerState.navItems.map((item, index) =>
                isEditing ? (
                  <input
                    key={index}
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const updated = [...headerState.navItems];
                      updated[index] = e.target.value;
                      setHeaderState((prev) => ({
                        ...prev,
                        navItems: updated,
                      }));
                    }}
                    className="px-2 py-1 border rounded text-sm w-20 bg-white"
                    placeholder={`Nav ${index + 1}`}
                  />
                ) : (
                  <a
                    key={index}
                    href={`#${item.toLowerCase()}`}
                    className="text-black hover:text-yellow-600 transition-colors duration-300 font-medium"
                  >
                    {item}
                  </a>
                )
              )}
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <svg
                  className="h-6 w-6 transition-transform duration-200"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  style={{
                    transform: isMobileMenuOpen
                      ? "rotate(90deg)"
                      : "rotate(0deg)",
                  }}
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Navigation Menu */}
      <div
        style={{ ...mobileMenuStyles }}
        className="md:hidden dark:bg-gray-900 dark:border-gray-700"
      >
        <div className="flex gap-3 w-[100%] flex-col px-4 pt-2 pb-3 space-y-1 sm:px-6">
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
                className="w-full px-2 py-1 border rounded text-base bg-white"
                placeholder={`Nav ${index + 1}`}
              />
            ) : (
              <a
                key={index}
                href={`#${item.toLowerCase()}`}
                className="text-black hover:text-yellow-600 transition-colors duration-300 font-medium"
                onClick={closeMobileMenu}
              >
                {item}
              </a>
            )
          )}
        </div>
      </div>

      {/* Crop Modal */}
      {cropModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Crop Logo</h3>
            <div className="relative w-full h-96 bg-gray-900 rounded-lg overflow-hidden">
              <Cropper
                image={cropImage}
                crop={crop}
                zoom={zoom}
                aspect={1} // Square aspect ratio for logo
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zoom
              </label>
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
            <div className="flex gap-3 mt-6">
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