import { Edit2, Save, Upload, X, Loader2, RotateCw, ZoomIn } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState, useCallback } from "react";
import { toast } from "react-toastify";
import Cropper from "react-easy-crop";
import logo from "/logos/logo.svg"

export default function Header({
  headerData,
  onStateChange,
  userId,
  publishedId,
  templateSelection,
}) {
  // Character limits
  const CHAR_LIMITS = {
    companyName: 50,
    navItem: 50,
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [pendingLogoFile, setPendingLogoFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const logoImgRef = useRef<HTMLImageElement | null>(null);

  // Enhanced crop modal state with advanced features
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);

  // Advanced cropping states
  const [mediaSize, setMediaSize] = useState<{ width: number; height: number; naturalWidth: number; naturalHeight: number } | null>(null);
  const [cropAreaSize, setCropAreaSize] = useState<{ width: number; height: number } | null>(null);
  const [minZoomDynamic, setMinZoomDynamic] = useState(0.1);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState("original");
  const [logoDimensions, setLogoDimensions] = useState({ width: 50, height: 50 });
  const PAN_STEP = 10;

  // Fixed state initialization
  const [headerState, setHeaderState] = useState(() => {
    return headerData || {
      logoSrc: logo,
      companyName: "Your Company",
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
    };
  });

  // Load logo dimensions when logo URL changes
  useEffect(() => {
    if (headerState.logoSrc && (headerState.logoSrc.startsWith("data:") || headerState.logoSrc.startsWith("http"))) {
      const img = new Image();
      img.onload = () => {
        // Calculate dimensions while maintaining aspect ratio
        const maxSize = 60;
        let width = img.naturalWidth;
        let height = img.naturalHeight;

        // Maintain aspect ratio while fitting within maxSize
        if (width > height) {
          height = (height / width) * maxSize;
          width = maxSize;
        } else {
          width = (width / height) * maxSize;
          height = maxSize;
        }

        // Ensure minimum size
        const minSize = 25;
        if (width < minSize) {
          height = (height / width) * minSize;
          width = minSize;
        }
        if (height < minSize) {
          width = (width / height) * minSize;
          height = minSize;
        }

        // Additional constraint: Ensure height doesn't exceed header height
        const maxHeaderHeight = 45;
        if (height > maxHeaderHeight) {
          width = (width / height) * maxHeaderHeight;
          height = maxHeaderHeight;
        }

        setLogoDimensions({
          width: Math.round(width),
          height: Math.round(height)
        });
      };
      img.src = headerState.logoSrc;
    } else {
      setLogoDimensions({ width: 50, height: 50 });
    }
  }, [headerState.logoSrc]);

  // Allow more zoom-out; do not enforce cover when media/crop sizes change
  useEffect(() => {
    if (mediaSize && cropAreaSize) {
      setMinZoomDynamic(0.1);
    }
  }, [mediaSize, cropAreaSize]);

  // Arrow keys to pan image inside crop area when cropper is open
  const nudge = useCallback((dx: number, dy: number) => {
    setCrop((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
  }, []);

  useEffect(() => {
    if (!cropModalOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); nudge(-PAN_STEP, 0); }
      else if (e.key === "ArrowRight") { e.preventDefault(); nudge(PAN_STEP, 0); }
      else if (e.key === "ArrowUp") { e.preventDefault(); nudge(0, -PAN_STEP); }
      else if (e.key === "ArrowDown") { e.preventDefault(); nudge(0, PAN_STEP); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [cropModalOpen, nudge]);

  // Add this useEffect to notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(headerState);
    }
  }, [headerState, onStateChange]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // Get aspect ratio value based on selection
  const getAspectRatio = () => {
    switch (selectedAspectRatio) {
      case "1:1":
        return 1;
      case "16:9":
        return 16 / 9;
      case "original":
      default:
        return logoDimensions.width / logoDimensions.height;
    }
  };

  // Get display text for aspect ratio
  const getAspectRatioText = () => {
    switch (selectedAspectRatio) {
      case "1:1":
        return "1:1";
      case "16:9":
        return "16:9";
      case "original":
      default:
        return `${logoDimensions.width}:${logoDimensions.height}`;
    }
  };

  // Enhanced image upload handler with advanced cropping
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
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
      setImageToCrop(reader.result);
      setOriginalFile(file);
      setCropModalOpen(true);
      setSelectedAspectRatio("original");
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
    };
    reader.readAsDataURL(file);

    e.target.value = "";
  };

  // Enhanced cropper functions
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  // Function to upload image to AWS
  const uploadImageToAWS = async (file, imageField) => {
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

  // Updated getCroppedImg function with dynamic sizing
  const getCroppedImg = async (imageSrc, pixelCrop, rotation = 0) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Calculate output dimensions based on selected aspect ratio
    let outputWidth, outputHeight;
    let displayWidth, displayHeight;

    switch (selectedAspectRatio) {
      case "1:1":
        outputWidth = 200;
        outputHeight = 200;
        displayWidth = 45;
        displayHeight = 45;
        break;
      case "16:9":
        outputWidth = 320;
        outputHeight = 180;
        displayWidth = 55;
        displayHeight = 31;
        break;
      case "original":
      default:
        const maxHeaderSize = 45;
        outputWidth = logoDimensions.width > 200 ? 200 : logoDimensions.width;
        outputHeight = logoDimensions.height > 200 ? 200 : logoDimensions.height;

        if (logoDimensions.width > maxHeaderSize || logoDimensions.height > maxHeaderSize) {
          if (logoDimensions.width > logoDimensions.height) {
            displayWidth = maxHeaderSize;
            displayHeight = (logoDimensions.height / logoDimensions.width) * maxHeaderSize;
          } else {
            displayHeight = maxHeaderSize;
            displayWidth = (logoDimensions.width / logoDimensions.height) * maxHeaderSize;
          }
        } else {
          displayWidth = logoDimensions.width;
          displayHeight = logoDimensions.height;
        }
        break;
    }

    canvas.width = outputWidth;
    canvas.height = outputHeight;

    ctx.translate(outputWidth / 2, outputHeight / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-outputWidth / 2, -outputHeight / 2);

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
          const fileName = originalFile
            ? `cropped-logo-${originalFile.name.replace(/\.[^.]+$/, "")}.png`
            : `cropped-logo-${Date.now()}.png`;

          const file = new File([blob], fileName, {
            type: "image/png",
            lastModified: Date.now(),
          });

          const previewUrl = URL.createObjectURL(blob);

          resolve({
            file,
            previewUrl,
            dimensions: {
              width: Math.round(displayWidth),
              height: Math.round(displayHeight)
            }
          });
        },
        "image/png"
      );
    });
  };

  const applyCrop = async () => {
    try {
      if (!imageToCrop || !croppedAreaPixels) {
        toast.error("Please select an area to crop");
        return;
      }

      setIsUploading(true);

      const { file, previewUrl, dimensions } = await getCroppedImg(
        imageToCrop,
        croppedAreaPixels,
        rotation
      );

      // Update logo dimensions with display dimensions
      setLogoDimensions(dimensions);

      // Show immediate local preview of cropped image
      setHeaderState((prev) => ({
        ...prev,
        logoSrc: previewUrl,
      }));

      // UPLOAD TO AWS IMMEDIATELY
      const awsImageUrl = await uploadImageToAWS(file, "logoSrc");

      if (awsImageUrl) {
        // Update with actual S3 URL
        setHeaderState((prev) => ({
          ...prev,
          logoSrc: awsImageUrl,
        }));
        setPendingLogoFile(null);
        toast.success("Logo cropped and uploaded to AWS successfully!");
      } else {
        // If upload fails, keep the preview URL and set as pending
        setPendingLogoFile(file);
        toast.warning("Logo cropped but upload failed. It will be saved locally.");
      }

      setCropModalOpen(false);
      setImageToCrop(null);
      setOriginalFile(null);
    } catch (error) {
      console.error("Error cropping image:", error);
      toast.error("Error cropping image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const cancelCrop = () => {
    setCropModalOpen(false);
    setImageToCrop(null);
    setOriginalFile(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
  };

  const resetCropSettings = () => {
    setZoom(1);
    setRotation(0);
    setCrop({ x: 0, y: 0 });
  };

  // Updated Save button handler - only handles text changes and failed uploads now
  const handleSave = async () => {
    try {
      setIsUploading(true);

      // Upload any pending logo that failed during automatic upload
      if (pendingLogoFile) {
        const awsImageUrl = await uploadImageToAWS(pendingLogoFile, "logoSrc");
        if (awsImageUrl) {
          setHeaderState((prev) => ({
            ...prev,
            logoSrc: awsImageUrl,
          }));
          setPendingLogoFile(null);
        } else {
          toast.error("Failed to upload logo");
          return;
        }
      }

      // Exit edit mode
      setIsEditing(false);
      toast.success("Header section saved!");
    } catch (error) {
      console.error("Error saving header section:", error);
      toast.error("Error saving changes. Please try again.");
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
          <div className="flex items-center justify-center gap-[16rem] h-16 mx-auto min-w-7xl ">
            {/* Responsive Edit/Save Button Container */}
            <div className="absolute md:right-0 right-[60px]  z-[999999999]">
              {isEditing ? (
                <button
                  onClick={handleSave}
                  disabled={isUploading}
                  className={`flex items-center gap-1 px-3 py-2 md:px-4 md:py-2 ${isUploading
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
                      <Save size={16} className="inline mr-1" />
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
                  <motion.img
                    ref={logoImgRef}
                    src={headerState.logoSrc || logo}
                    alt="Logo"
                    style={{
                      width: `${logoDimensions.width}px`,
                      height: `${logoDimensions.height}px`,
                      maxHeight: '45px',
                    }}
                    className="rounded-xl cursor-pointer group-hover:scale-110 transition-all duration-300 object-contain"
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
                <div className="flex flex-col min-w-[120px]">
                  <input
                    type="text"
                    value={headerState.companyName}
                    onChange={(e) =>
                      setHeaderState((prev) => ({
                        ...prev,
                        companyName: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 text-sm bg-white border rounded md:text-base min-w-[120px]"
                    placeholder="Company Name"
                    maxLength={CHAR_LIMITS.companyName}
                    style={{
                      width: "100%",
                      minWidth: "120px",
                      maxWidth: "200px"
                    }}
                  />
                  <div className="text-xs text-gray-500 text-right mt-1">
                    {headerState.companyName.length}/{CHAR_LIMITS.companyName} characters
                  </div>
                </div>
              ) : (
                <span className="text-lg sm:text-xl md:text-2xl flex-shrink-0">
                  {headerState.companyName}
                </span>
              )}
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="items-center hidden mr-16 space-x-4 md:flex lg:space-x-6 lg:mr-20">
              {headerState.navItems.map((item, index) =>
                isEditing ? (
                  <div key={index} className="flex flex-col">
                    <input
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
                      maxLength={CHAR_LIMITS.navItem}
                    />
                    <div className="text-xs text-gray-500 text-right mt-1">
                      {item.length}/{CHAR_LIMITS.navItem} characters
                    </div>
                  </div>
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
              <div key={index} className="flex flex-col p-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const updated = [...headerState.navItems];
                    updated[index] = e.target.value;
                    setHeaderState((prev) => ({ ...prev, navItems: updated }));
                  }}
                  className="w-full px-3 py-2 text-base bg-white border rounded"
                  placeholder={`Navigation Item ${index + 1}`}
                  maxLength={CHAR_LIMITS.navItem}
                />
                <div className="text-xs text-gray-500 text-right mt-1">
                  {item.length}/{CHAR_LIMITS.navItem} characters
                </div>
              </div>
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

        {/* Edit Mode Instructions */}
        {isEditing && (
          <div className="p-4 bg-blue-50 border-t border-blue-200">
            <p className="text-sm text-blue-800 mb-2">
              <strong>Edit Mode Active:</strong> Character limits:
            </p>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• <strong>Company Name:</strong> {CHAR_LIMITS.companyName} characters</li>
              <li>• <strong>Navigation Items:</strong> {CHAR_LIMITS.navItem} characters each</li>
            </ul>
          </div>
        )}
      </div>

      {/* Enhanced Crop Modal with Advanced Features */}
      {cropModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/90 z-[99999999] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl max-w-4xl w-full h-[80vh] flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
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

            {/* Aspect Ratio Selection */}
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
                  Original
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

            {/* Cropper Area */}
            <div className={`flex-1 relative bg-gray-900 min-h-0 ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}>
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
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

            {/* Controls */}
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
          </motion.div>
        </motion.div>
      )}
    </>
  );
}