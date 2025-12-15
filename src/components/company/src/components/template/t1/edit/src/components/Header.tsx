import { Edit2, Upload, X, Loader2, Save } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import logo from "/logos/logo.svg";

export default function Header({
  headerData,
  onStateChange,
  userId,
  publishedId,
  templateSelection,
}: any) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const logoImgRef = useRef<HTMLImageElement | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Fixed logo dimensions - 77px width, 65px height
  const [logoDimensions, setLogoDimensions] = useState({
    width: 77,
    height: 65,
  });

  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [tempLogoSrc, setTempLogoSrc] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Combined state - static version (no edit mode for text)
  const [headerState, setHeaderState] = useState({
    logoSrc: headerData?.logo || logo,
    companyName: headerData?.name || "Your Company",
    navItems: [
      "Home",
      "About",
      "Profile",
      "Services",
      "Product",
      "Gallery",
      "Blog",
      "Testimonials",
    ],
  });

  // Auto-save timeout reference
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fixed logo dimensions - always 77x65
  useEffect(() => {
    setLogoDimensions({ width: 77, height: 65 });
  }, [headerState.logoSrc, tempLogoSrc, isEditMode]);

  // Add this useEffect to notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(headerState);
    }
  }, [headerState, onStateChange]);

  // Auto-save function
  const autoSaveChanges = async () => {
    if (!isEditMode) return;

    setIsSaving(true);

    try {
      // Simulate API call or state persistence
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Update the main state with temp changes
      if (tempLogoSrc) {
        setHeaderState((prev) => ({
          ...prev,
          logoSrc: tempLogoSrc,
        }));
      }

      toast.success("Changes saved automatically!");
    } catch (error) {
      console.error("Auto-save failed:", error);
      toast.error("Auto-save failed. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Effect to trigger auto-save when changes are made
  useEffect(() => {
    if (isEditMode && tempLogoSrc && tempLogoSrc !== headerState.logoSrc) {
      // Clear existing timeout
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      // Set new timeout for auto-save (1 second delay)
      autoSaveTimeoutRef.current = setTimeout(() => {
        autoSaveChanges();
      }, 1000);
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [tempLogoSrc, isEditMode, headerState.logoSrc]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // Direct image upload handler (no cropping)
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    processImageFile(file);
    e.target.value = "";
  };

  // Process image file (used by both file input and drag-drop)
  const processImageFile = async (file: File) => {
    // Validate file type and size
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setIsUploading(true);

    try {
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempLogoSrc(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to AWS
      const awsImageUrl = await uploadImageToAWS(file, "logoSrc");

      if (awsImageUrl) {
        setTempLogoSrc(awsImageUrl);
        toast.success("Logo uploaded successfully!");
      } else {
        toast.error("Upload failed. Please try again.");
        setTempLogoSrc(null);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error uploading image. Please try again.");
      setTempLogoSrc(null);
    } finally {
      setIsUploading(false);
    }
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isEditMode) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (!isEditMode) {
      toast.warning("Please enable edit mode first");
      return;
    }

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      processImageFile(file);
    }
  };

  // Function to upload image to AWS
  const uploadImageToAWS = async (file: File, imageField: string) => {
    if (!userId || !publishedId || !templateSelection) {
      console.error("Missing required props:", {
        userId,
        publishedId,
        templateSelection,
      });
      toast.error("Missing user information. Please refresh and try again.");
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("sectionName", "header");
    formData.append("imageField", `${imageField}_${Date.now()}`);
    formData.append("templateSelection", templateSelection);

    console.log(`Uploading ${imageField} to S3:`, file);

    try {
      const uploadResponse = await fetch(
        `https://o66ziwsye5.execute-api.ap-south-1.amazonaws.com/prod/upload-image/${userId}/${publishedId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (uploadResponse.ok) {
        const uploadData = await uploadResponse.json();
        console.log(`${imageField} uploaded to S3:`, uploadData.imageUrl);
        return uploadData.imageUrl;
      } else {
        const errorData = await uploadResponse.json();
        console.error(`${imageField} upload failed:`, errorData);
        toast.error(
          `${imageField} upload failed: ${errorData.message || "Unknown error"}`
        );
        return null;
      }
    } catch (error) {
      console.error(`Error uploading ${imageField}:`, error);
      toast.error(`Error uploading image. Please try again.`);
      return null;
    }
  };

  // Function to trigger file input for logo upload
  const handleEditLogo = () => {
    setIsEditMode(true);
    setTempLogoSrc(headerState.logoSrc);
  };

  // Function to handle logo click in edit mode
  const handleLogoClick = () => {
    if (isEditMode) {
      fileInputRef.current?.click();
    }
  };

  // Function to manually save changes (kept for consistency)
  const handleSave = () => {
    if (tempLogoSrc) {
      setHeaderState((prev) => ({
        ...prev,
        logoSrc: tempLogoSrc,
      }));
    }
    setIsEditMode(false);
    setTempLogoSrc(null);
    toast.success("Changes saved!");
  };

  // Function to cancel editing
  const handleCancel = () => {
    setIsEditMode(false);
    setTempLogoSrc(null);
    toast.info("Changes cancelled");
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
        <div className="relative w-full px-4 sm:px-6 lg:px-8 pt-2">
          {/* Edit/Save/Cancel Buttons */}
          <div className="absolute right-[40px] md:right-0 top-[25%]  z-[999999999]">
            {!isEditMode ? (
              <button
                onClick={handleEditLogo}
                className="flex items-center gap-1 px-3 py-2 md:px-4 md:py-2 bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300 text-sm md:text-base transition-all duration-200 min-w-[40px] md:min-w-[50px]"
              >
                <Edit2 size={16} />
                <span className="hidden xs:inline">Edit Logo</span>
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`flex items-center gap-1 px-3 py-2 ${isSaving
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                    } text-white rounded-lg shadow text-sm transition-all duration-200`}
                >
                  {isSaving ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  <span className="hidden xs:inline">
                    {isSaving ? "Saving..." : "Save"}
                  </span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-1 px-3 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 text-sm transition-all duration-200"
                >
                  <X size={16} />
                  <span className="hidden xs:inline">Cancel</span>
                </button>
              </div>
            )}
          </div>

          {/* Auto-save indicator */}
          {isSaving && (
            <div className="absolute right-2 top-2 z-[999999999]">
              <div className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded text-xs">
                <Loader2 size={12} className="animate-spin" />
                Auto-saving...
              </div>
            </div>
          )}

          <div className="flex items-center justify-between h-[65px] mx-auto max-w-7xl ">
            {/* Logo + Company Name */}
            <motion.div
              className="flex flex-row items-center gap-2 text-xl font-bold text-red-500 transition-colors duration-300 sm:text-2xl dark:text-yellow-400"
              whileHover={{ scale: 1.05 }}
            >
              {/* Enhanced Logo with Animations */}
              <div className="relative flex-shrink-0">
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
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <div className="relative">
                    <div
                      className={`relative transition-all duration-300 ${isEditMode
                        ? "cursor-pointer ring-2 rounded-lg"
                        : ""
                        } ${isDragOver
                          ? "ring-4 ring-green-500 bg-green-50 scale-105"
                          : isEditMode
                            ? "ring-blue-500"
                            : ""
                        } h-[65px] min-w-[77px] max-w-[200px] flex items-center justify-center`}
                      onClick={handleLogoClick}
                      onDragEnter={handleDragEnter}
                      onDragLeave={handleDragLeave}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    >
                      <motion.img
                        ref={logoImgRef}
                        src={
                          isEditMode && tempLogoSrc
                            ? tempLogoSrc
                            : headerState.logoSrc
                        }
                        alt="Logo"
                        className={`rounded-xl transition-all duration-300 object-contain h-[65px] min-w-[77px] max-w-[200px] ${isDragOver ? "opacity-50" : ""
                          }`}
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

                      {/* Upload Icon Overlay - Show only in edit mode */}
                      {isEditMode && !isDragOver && (
                        <div className="absolute inset-0 bg-black bg-opacity-30 rounded-xl flex items-center justify-center transition-opacity duration-300">
                          <div className="bg-white p-1.5 rounded-full shadow-lg">
                            <Upload size={14} className="text-gray-700" />
                          </div>
                          <span className="absolute bottom-1 text-xs text-white bg-black bg-opacity-50 px-1 rounded">
                            Click or drag to upload
                          </span>
                        </div>
                      )}

                      {/* Drag Over Overlay */}
                      {isDragOver && (
                        <div className="absolute inset-0 bg-green-500 bg-opacity-20 rounded-xl flex items-center justify-center border-2 border-dashed border-green-500">
                          <div className="bg-white p-2 rounded-full shadow-lg">
                            <Upload size={18} className="text-green-600" />
                          </div>
                          <span className="absolute bottom-1 text-xs text-green-700 bg-white bg-opacity-90 px-2 py-0.5 rounded font-semibold">
                            Drop image here
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </div>
            </motion.div>

            {/* Desktop Navigation - Static */}
            <nav className="items-center hidden mr-16 space-x-4 md:flex lg:space-x-6 lg:mr-20">
              {headerState.navItems.map((item, index) => (
                <a
                  key={index}
                  href={`#${item.toLowerCase()}`}
                  className="text-sm font-medium text-black transition-colors duration-300 hover:text-yellow-600 lg:text-base"
                >
                  {item}
                </a>
              ))}
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

      {/* Mobile Navigation Menu - Static */}
      <div
        style={{ ...mobileMenuStyles }}
        className="md:hidden dark:bg-gray-900 dark:border-gray-700"
      >
        <div className="flex gap-1 w-[100%] flex-col ">
          {headerState.navItems.map((item, index) => (
            <a
              key={index}
              href={`#${item.toLowerCase()}`}
              className="px-3 py-2 font-medium text-black transition-colors duration-300 rounded-lg hover:text-yellow-600 hover:bg-gray-50"
              onClick={closeMobileMenu}
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}