
import { Button } from "./ui/button";
import {
  Menu,
  X,
  Edit2,
  Save,
  Upload,
  X as XIcon,
  RotateCw,
  ZoomIn,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "./ThemeProvider";
import { toast } from "react-toastify";
import logo from "/images/Drone tv .in.jpg";
import Cropper from "react-easy-crop";


export default function Header({
  headerData,
  onStateChange,
  publishedId,
  userId,
  templateSelection,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [pendingLogoFile, setPendingLogoFile] = useState(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [content, setContent] = useState(headerData);

  // choose container width based on companyName length (adjust threshold as needed)
  const containerMaxClass =
    (content?.companyName || "").trim().length > 30 /* threshold */
      ? "min-w-[1270px]"
      : "max-w-7xl";

  // Cropping states
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(1); // Add aspect ratio state

  // Static navigation items
  const staticNavItems = [
    { id: 1, label: "Home", href: "#home", color: "primary" },
    { id: 2, label: "About", href: "#about", color: "primary" },
    { id: 3, label: "Our Team", href: "#our-team", color: "primary" },
    { id: 4, label: "Product", href: "#product", color: "primary" },
    { id: 5, label: "Services", href: "#services", color: "red-accent" },
    { id: 6, label: "Gallery", href: "#gallery", color: "primary" },
    { id: 7, label: "Blog", href: "#blog", color: "primary" },
    { id: 8, label: "Testimonial", href: "#testimonial", color: "primary" },
    { id: 9, label: "Clients", href: "#clients", color: "primary" },
  ];
  console.log("header data", content);

  // Smooth scroll function
  const scrollToSection = (href: string) => {
    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Handle navigation click
  const handleNavClick = (href: string) => {
    setIsMenuOpen(false); // Close mobile menu
    setTimeout(() => {
      scrollToSection(href);
    }, 100); // Small delay to ensure menu is closed before scrolling
  };

  // In each component, add:
  useEffect(() => {
    if (onStateChange) {
      onStateChange(content);
    }
  }, [content, onStateChange]);

  const updateContent = (field: string, value: string) => {
    setContent((prev) => ({ ...prev, [field]: value }));
  };

  // Logo cropping functionality
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setImageToCrop(reader.result);
      setOriginalFile(file);
      setShowCropper(true);
      setAspectRatio(1); // Set default aspect ratio
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
    };
    reader.readAsDataURL(file);

    e.target.value = "";
  };

  // Cropper functions
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

  const getCroppedImg = async (imageSrc, pixelCrop, rotation = 0) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.translate(pixelCrop.width / 2, pixelCrop.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-pixelCrop.width / 2, -pixelCrop.height / 2);

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
      canvas.toBlob(
        (blob) => {
          const fileName = originalFile
            ? `cropped-${originalFile.name}`
            : `cropped-logo-${Date.now()}.jpg`;

          const file = new File([blob], fileName, {
            type: "image/jpeg",
            lastModified: Date.now(),
          });

          const previewUrl = URL.createObjectURL(blob);

          resolve({
            file,
            previewUrl,
          });
        },
        "image/jpeg",
        0.95
      );
    });
  };

  const applyCrop = async () => {
    try {
      if (!imageToCrop || !croppedAreaPixels) {
        toast.error("Please select an area to crop");
        return;
      }

      const { file, previewUrl } = await getCroppedImg(
        imageToCrop,
        croppedAreaPixels,
        rotation
      );

      // Update preview immediately
      setContent((prev) => ({ ...prev, logoUrl: previewUrl }));

      // Set the file for upload on save
      setPendingLogoFile(file);

      toast.success("Logo cropped successfully! Click Save to upload to S3.");
      setShowCropper(false);
      setImageToCrop(null);
      setOriginalFile(null);
    } catch (error) {
      console.error("Error cropping logo:", error);
      toast.error("Error cropping logo. Please try again.");
    }
  };

  const cancelCrop = () => {
    setShowCropper(false);
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

  // Save button handler with S3 upload
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
        formData.append("imageField", "logoUrl" + Date.now());
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
          setContent((prev) => ({ ...prev, logoUrl: uploadData.imageUrl }));
          setPendingLogoFile(null); // Clear pending file
          console.log("Logo uploaded to S3:", uploadData.imageUrl);
        } else {
          const errorData = await uploadResponse.json();
          console.error("Logo upload failed:", errorData);
          toast.error(
            `Logo upload failed: ${errorData.message || "Unknown error"}`
          );
          return; // Don't exit edit mode
        }
      }

      // Exit edit mode
      setIsEditing(false);
      toast.success("Header section saved with S3 URLs!");
    } catch (error) {
      console.error("Error saving header section:", error);
      toast.error("Error saving changes. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const menuVariants = {
    closed: { opacity: 0, height: 0, transition: { duration: 0.3 } },
    open: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.3, staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    closed: { opacity: 0, x: -20 },
    open: { opacity: 1, x: 0 },
  };

  return (
    <>
      {/* Updated Cropping Modal - Matches Product.tsx styling */}
      {showCropper && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/90 z-[99999999] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl max-w-4xl w-full h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800">
                Crop Logo
              </h3>
              <button
                onClick={cancelCrop}
                className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
              >
                <XIcon className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Cropper Area */}
            <div className="flex-1 relative bg-gray-900 min-h-0">
              <div className="relative w-full h-full">
                <Cropper
                  image={imageToCrop}
                  crop={crop}
                  zoom={zoom}
                  rotation={rotation}
                  aspect={aspectRatio}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                  showGrid={false}
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
            </div>

            {/* Controls - Simplified like Product.tsx */}
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              {/* Aspect Ratio Buttons */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Aspect Ratio:</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setAspectRatio(1)}
                    className={`px-3 py-2 text-sm rounded border ${aspectRatio === 1
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300'
                      }`}
                  >
                    1:1 (Square)
                  </button>
                  <button
                    onClick={() => setAspectRatio(4 / 3)}
                    className={`px-3 py-2 text-sm rounded border ${aspectRatio === 4 / 3
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300'
                      }`}
                  >
                    4:3 (Standard)
                  </button>
                  <button
                    onClick={() => setAspectRatio(16 / 9)}
                    className={`px-3 py-2 text-sm rounded border ${aspectRatio === 16 / 9
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300'
                      }`}
                  >
                    16:9 (Widescreen)
                  </button>
                </div>
              </div>

              {/* Zoom Control - Simplified */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">Zoom</span>
                  <span className="text-gray-600">{zoom.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
                />
              </div>

              {/* Action Buttons - Consistent with Product.tsx */}
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
                  className="w-full bg-green-600 hover:bg-green-700 text-white rounded py-2 text-sm font-medium"
                >
                  Apply Crop
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Rest of the header code remains exactly the same */}
      <motion.header
        className={`fixed top-16 left-0 right-0 border-b z-10 ${theme === "dark"
          ? "bg-gray-800 border-gray-700 text-gray-300"
          : "bg-white border-gray-200"
          }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div
          className={`px-4 mx-auto lg:min-w-[1180px] ${containerMaxClass} sm:px-6 lg:px-16`}
        >
          <div className="flex items-center justify-between h-16">
            {/* Logo + Company - keep space and  long company names */}
            {/* <div className="flex items-center flex-shrink-0 min-w-0 mr-6 lg:mr-10">
              <motion.div
                className="relative flex items-center justify-center flex-shrink-0 w-8 h-8 mr-2 overflow-hidden rounded-lg shadow-md"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                {isEditing ? (
                  <div className="relative w-[56px] h-[56px]">
                    {content.logoUrl &&
                      (content.logoUrl.startsWith("data:") ||
                        content.logoUrl.startsWith("http")) ? (
                      <img
                        src={content.logoUrl || logo}
                        alt="Logo"
                        className="object-contain w-full h-full "
                      />
                    ) : (
                      <span className="text-lg font-bold text-black">
                        {content.logoUrl}
                      </span>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center transition-opacity bg-black bg-opacity-50 opacity-0 hover:opacity-100">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-1 text-xs text-white bg-blue-500 rounded"
                      >
                        <Upload size={12} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {content.logoUrl &&
                      (content.logoUrl.startsWith("data:") ||
                        content.logoUrl.startsWith("http")) ? (
                      <img
                        src={content.logoUrl || logo}
                        alt="Logo"
                        className="object-contain w-[70px] h-[70px]"
                      />
                    ) : (
                      <span className="text-lg font-bold text-black">
                        {content.logoUrl}
                      </span>
                    )}
                  </>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden font-bold"
                />
              </motion.div>
              {isEditing ? (
                <input
                  type="text"
                  value={content.companyName}
                  onChange={(e) => updateContent("companyName", e.target.value)}
                  className="bg-transparent border-b border-primary text-xl font-medium outline-none max-w-[140px] pr-2"
                />
              ) : (
                <motion.div className="flex items-center min-w-0">
                  <motion.span
                    className="lg:text-xl text-sm font-medium whitespace-nowrap max-w-[140px] lg:max-w-[260px]"
                    title={content.companyName}
                  >
                    {content.companyName}
                  </motion.span>
                </motion.div>
              )}
            </div> */}
            {/* <div className="flex items-center flex-shrink-0 min-w-0 mr-6 lg:mr-10">
  <div className="relative flex items-center justify-center flex-shrink-0 w-8 h-8 mr-2 overflow-hidden rounded-lg shadow-md">
    {isEditing ? (
      <div className="relative w-[56px] h-[56px]">
        {content.logoUrl &&
          (content.logoUrl.startsWith("data:") ||
            content.logoUrl.startsWith("http")) ? (
          <img
            src={content.logoUrl || logo}
            alt="Logo"
            className="object-contain w-full h-full "
          />
        ) : (
          <span className="text-lg font-bold text-black">
            {content.logoUrl}
          </span>
        )}
        <div className="absolute inset-0 flex items-center justify-center transition-opacity bg-black bg-opacity-50 opacity-0 hover:opacity-100">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-1 text-xs text-white bg-blue-500 rounded"
          >
            <Upload size={12} />
          </button>
        </div>
      </div>
    ) : (
      <>
        {content.logoUrl &&
          (content.logoUrl.startsWith("data:") ||
            content.logoUrl.startsWith("http")) ? (
          <img
            src={content.logoUrl || logo}
            alt="Logo"
            className="object-contain w-[70px] h-[70px]"
          />
        ) : (
          <span className="text-lg font-bold text-black">
            {content.logoUrl}
          </span>
        )}
      </>
    )}
    <input
      type="file"
      ref={fileInputRef}
      accept="image/*"
      onChange={handleLogoUpload}
      className="hidden font-bold"
    />
  </div>
  </div> */}
  <div className="flex items-center flex-shrink-0 min-w-0 mr-6 lg:mr-10">
  <div className="relative flex items-center justify-center flex-shrink-0 w-8 h-8 mr-2 overflow-hidden rounded-lg shadow-md">
    {/* Your logo code remains the same */}
    {isEditing ? (
      <div className="relative w-[56px] h-[56px]">
        {content.logoUrl &&
          (content.logoUrl.startsWith("data:") ||
            content.logoUrl.startsWith("http")) ? (
          <img
            src={content.logoUrl || logo}
            alt="Logo"
            className="object-contain w-full h-full "
          />
        ) : (
          <span className="text-lg font-bold text-black">
            {content.logoUrl}
          </span>
        )}
        <div className="absolute inset-0 flex items-center justify-center transition-opacity bg-black bg-opacity-50 opacity-0 hover:opacity-100">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-1 text-xs text-white bg-blue-500 rounded"
          >
            <Upload size={12} />
          </button>
        </div>
      </div>
    ) : (
      <>
        {content.logoUrl &&
          (content.logoUrl.startsWith("data:") ||
            content.logoUrl.startsWith("http")) ? (
          <img
            src={content.logoUrl || logo}
            alt="Logo"
            className="object-contain w-[70px] h-[70px]"
          />
        ) : (
          <span className="text-lg font-bold text-black">
            {content.logoUrl}
          </span>
        )}
      </>
    )}
    <input
      type="file"
      ref={fileInputRef}
      accept="image/*"
      onChange={handleLogoUpload}
      className="hidden font-bold"
    />
  </div>
  
  {/* Add this company name section back */}
  {isEditing ? (
    <input
      type="text"
      value={content.companyName}
      onChange={(e) => updateContent("companyName", e.target.value)}
      className="bg-transparent border-b border-primary text-xl font-medium outline-none max-w-[140px] pr-2"
    />
  ) : (
    <div className="flex items-center min-w-0">
      <span
        className="lg:text-xl text-sm font-medium whitespace-nowrap max-w-[140px] lg:max-w-[260px]"
        title={content.companyName}
      >
        {content.companyName}
      </span>
    </div>
  )}
</div>

            {/* Desktop Nav - Centered with proper spacing */}
            <nav className="items-center justify-center flex-1 hidden mx-4 lg:flex min-w-0">
              <div className="flex  items-center justify-center space-x-3">
                {staticNavItems.map((item) => (
                  <motion.a
                    key={item.id}
                    href={item.href}
                    className={`font-medium relative group whitespace-nowrap ${theme === "dark"
                      ? "text-gray-300 hover:text-gray-200"
                      : "text-gray-700 hover:text-primary"
                      }`}
                    whileHover={{ y: -2 }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.href);
                    }}
                  >
                    {item.label}
                    <motion.span
                      className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-${item.color} transition-all group-hover:w-full`}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.a>
                ))}
              </div>
            </nav>

            {/* Right side - Fixed width to prevent shifting */}
            <div className="flex items-center flex-shrink-0 space-x-1">
              {isEditing ? (
                <input
                  type="text"
                  value={content.ctaText}
                  onChange={(e) => updateContent("ctaText", e.target.value)}
                  className="bg-white border px-3 py-1 rounded font-medium outline-none max-w-[120px] "
                />
              ) : (
                <div className="hidden md:flex">
                  <Button
                    className="text-black transition-all duration-300 shadow-lg bg-primary hover:bg-primary/90 whitespace-nowrap "
                    onClick={() => handleNavClick("#contact")}
                  >
                    {content.ctaText}
                  </Button>
                </div>
              )}

              <ThemeToggle />

              {/* Edit/Save Buttons */}
              {isEditing ? (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ y: -1, scaleX: 1.1 }}
                  onClick={handleSave}
                  disabled={isUploading}
                  className={`${isUploading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:font-semibold"
                    } text-white px-4 py-2 rounded cursor-pointer hover:shadow-2xl shadow-xl whitespace-nowrap`}
                >
                  {isUploading ? (
                    "Uploading..."
                  ) : (
                    <>
                      <Save size={16} className="inline mr-1" /> Save
                    </>
                  )}
                </motion.button>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ y: -1, scaleX: 1.1 }}
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 text-black bg-yellow-500 rounded shadow-xl cursor-pointer hover:shadow-2xl hover:font-semibold whitespace-nowrap"
                >
                  Edit
                </motion.button>
              )}
            </div>

            {/* Mobile menu button */}
            <motion.div className="flex-shrink-0 lg:hidden">
              <motion.button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`hover:text-primary transition-colors p-2 ${theme === "dark"
                  ? "text-gray-300 hover:text-gray-200"
                  : "text-gray-700 hover:text-primary"
                  }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={{ rotate: isMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <AnimatePresence mode="wait">
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          </div>

          {/* Mobile Nav - Using static navigation items */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                className={`lg:hidden border-t border-gray-200 overflow-hidden ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white"
                  }`}
                variants={menuVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                <motion.nav className="flex flex-col py-4 space-y-4">
                  {staticNavItems.map((item, index) => (
                    <motion.a
                      key={item.id}
                      href={item.href}
                      className={`hover:text-${item.color} transition-colors py-2 px-4 rounded-lg hover:bg-${item.color}/10 cursor-pointer`}
                      variants={itemVariants}
                      whileHover={{ x: 10, scale: 1.02 }}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(item.href);
                      }}
                    >
                      {item.label}
                    </motion.a>
                  ))}
                  <Button
                    className="w-full mt-4 text-black shadow-lg bg-primary hover:bg-primary/90"
                    onClick={() => handleNavClick("#contact")}
                  >
                    {content.ctaText}
                  </Button>
                </motion.nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>
    </>
  );
}
