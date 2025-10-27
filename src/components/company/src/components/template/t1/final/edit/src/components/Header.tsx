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
  templateSelection,
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
  const [headerState, setHeaderState] = useState(headerData);

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
          logoSrc: reader.result as string,
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

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    // Open crop modal instead of directly setting the file
    openCropModal(file);
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
        formData.append("imageField", "logoSrc" + Date.now()); // This will map to the logo field in your PUT lambda
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
            logoUrl: uploadData.imageUrl,
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

  const headerStyles: React.CSSProperties = {
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

  const mobileMenuStyles: React.CSSProperties = {
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
        <div className="relative w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 mx-auto max-w-7xl ">
            {/* Responsive Edit/Save Button Container */}
            <div className="absolute md:right-0 right-[60px]  z-[999999999]">
              {isEditing ? (
                <button
                  onClick={handleSave}
                  disabled={isUploading}
                  className={`flex items-center gap-1 px-3 py-2 md:px-4 md:py-2 ${
                    isUploading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600"
                  } text-white rounded-lg shadow text-sm md:text-base transition-all duration-200 min-w-[40px] md:min-w-[50px]`}
                >
                  {isUploading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span className="">Saving...</span>
                    </>
                  ) : (
                    <>
                      <span className="">Save</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1 px-3 py-2 md:px-4 md:py-2 bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300 text-sm md:text-base transition-all duration-200 w-[30px] md:min-w-[40px]"
                >
                  <Edit2 size={16} />
                  <span className="hidden xs:inline">Edit</span>
                </button>
              )}
            </div>

            {/* Logo + Company Name */}
            <motion.div
              className="flex flex-row items-center gap-2 text-xl font-bold text-red-500 transition-colors duration-300 sm:text-2xl dark:text-yellow-400"
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
                    className="object-contain w-8 h-8 rounded-full sm:h-8 sm:w-8 md:h-10 md:w-10"
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
                  <div className="absolute left-0 z-30 p-2 rounded shadow-lg -bottom-16 bg-white/90">
                    <p className="mb-1 text-xs text-gray-600">Upload Logo:</p>
                    <motion.button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center justify-center w-full gap-1 p-2 text-xs bg-gray-200 rounded shadow hover:bg-gray-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Upload size={12} /> Choose File
                    </motion.button>
                    {pendingLogoFile && (
                      <p className="text-xs text-orange-600 mt-1 max-w-[120px] truncate">
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
                  className="table w-32 px-3 py-2 text-sm bg-white border rounded md:text-base"
                  placeholder="Company Name"
                />
              ) : (
                <span className="text-lg sm:text-xl md:text-2xl">
                  {headerState.companyName}
                </span>
              )}
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="items-center hidden mr-16 space-x-4 md:flex lg:space-x-6 lg:mr-20">
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
                    className="w-24 px-3 py-2 text-sm bg-white border rounded lg:w-28"
                    placeholder={`Nav ${index + 1}`}
                  />
                ) : (
                  <a
                    key={index}
                    href={`#${item.toLowerCase()}`}
                    className="text-sm font-medium text-black transition-colors duration-300 hover:text-yellow-600 lg:text-base"
                  >
                    {item}
                  </a>
                )
              )}
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex items-center space-x-2 md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="p-2 transition-colors duration-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <svg
                  className="w-6 h-6 transition-transform duration-200"
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
        <div className="flex gap-1 w-[100%] flex-col ">
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
                className="w-full px-3 py-2 text-base bg-white border rounded"
                placeholder={`Navigation Item ${index + 1}`}
              />
            ) : (
              <a
                key={index}
                href={`#${item.toLowerCase()}`}
                className="px-3 py-2 font-medium text-black transition-colors duration-300 rounded-lg hover:text-yellow-600 hover:bg-gray-50"
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
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[999999] p-4">
          <div className="w-full max-w-2xl p-4 mx-auto bg-white rounded-lg md:p-6">
            <h3 className="mb-4 text-lg font-bold text-gray-900 md:text-xl">Crop Logo</h3>
            <div className="relative w-full h-64 overflow-hidden bg-gray-900 rounded-lg md:h-80 lg:h-96">
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
              <label className="block mb-2 text-sm font-medium text-gray-700">
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
            <div className="flex flex-col gap-3 mt-6 sm:flex-row">
              <button
                onClick={applyCrop}
                className="flex-1 px-4 py-3 text-sm font-semibold text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700 md:text-base"
              >
                Apply Crop
              </button>
              <button
                onClick={() => setCropModalOpen(false)}
                className="flex-1 px-4 py-3 text-sm font-semibold text-gray-900 transition-colors bg-gray-300 rounded-lg hover:bg-gray-400 md:text-base"
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