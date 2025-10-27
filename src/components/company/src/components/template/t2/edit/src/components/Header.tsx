import { Button } from "./ui/button";
import { Menu, X, Edit2, Save, Upload, X as XIcon, RotateCw, ZoomIn } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "./ThemeProvider";
import logo from "/images/Drone tv .in.jpg";
import { toast } from "react-toastify";
import Cropper from 'react-easy-crop';

export default function Header({ headerData, onStateChange, userId, publishedId, templateSelection }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [pendingLogoFile, setPendingLogoFile] = useState(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  const [content, setContent] = useState({
    logoUrl: headerData?.logo,
    companyName: headerData?.name || "Company",
    navItems: [
      { id: 1, label: "Home", href: "#home", color: "primary" },
      { id: 2, label: "About", href: "#about", color: "primary" },
      { id: 3, label: "Our Team", href: "#our-team", color: "primary" },
      { id: 4, label: "Product", href: "#product", color: "primary" },
      { id: 5, label: "Services", href: "#services", color: "red-accent" },
      { id: 6, label: "Gallery", href: "#gallery", color: "primary" },
      { id: 7, label: "Blog", href: "#blog", color: "primary" },
      { id: 8, label: "Testimonial", href: "#testimonial", color: "primary" },
      { id: 9, label: "Clients", href: "#clients", color: "primary" },
    ],
    ctaText: "Get Started",
  });

  // Cropping states
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);

  // Notify parent of state changes
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
      setShowCropper(true);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
    };
    reader.readAsDataURL(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Cropper functions
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getCroppedImg = async (imageSrc, pixelCrop, rotation = 0) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

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
      canvas.toBlob((blob) => {
        const fileName = originalFile ? 
          `cropped-${originalFile.name}` : 
          `cropped-logo-${Date.now()}.jpg`;
        
        const file = new File([blob], fileName, { 
          type: 'image/jpeg',
          lastModified: Date.now()
        });
        
        const previewUrl = URL.createObjectURL(blob);
        
        resolve({ 
          file, 
          previewUrl 
        });
      }, 'image/jpeg', 0.95);
    });
  };

  const applyCrop = async () => {
    try {
      if (!imageToCrop || !croppedAreaPixels) {
        toast.error('Please select an area to crop');
        return;
      }

      const { file, previewUrl } = await getCroppedImg(imageToCrop, croppedAreaPixels, rotation);
      
      // Update preview immediately
      setContent(prev => ({ ...prev, logoUrl: previewUrl }));
      
      // Set the file for upload on save
      setPendingLogoFile(file);

      toast.success('Logo cropped successfully! Click Save to upload to S3.');
      setShowCropper(false);
      setImageToCrop(null);
      setOriginalFile(null);
    } catch (error) {
      console.error('Error cropping logo:', error);
      toast.error('Error cropping logo. Please try again.');
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
          console.error('Missing required props:', { userId, publishedId, templateSelection });
          toast.error('Missing user information. Please refresh and try again.');
          return;
        }
        
        const formData = new FormData();
        formData.append('file', pendingLogoFile);
        formData.append('sectionName', 'header');
        formData.append('imageField', 'logoUrl');
        formData.append('templateSelection', templateSelection);

        const uploadResponse = await fetch(`https://o66ziwsye5.execute-api.ap-south-1.amazonaws.com/prod/upload-image/${userId}/${publishedId}`, {
          method: 'POST',
          body: formData,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          // Replace local preview with S3 URL
          setContent(prev => ({ ...prev, logoUrl: uploadData.imageUrl }));
          setPendingLogoFile(null); // Clear pending file
          console.log('Logo uploaded to S3:', uploadData.imageUrl);
        } else {
          const errorData = await uploadResponse.json();
          console.error('Logo upload failed:', errorData);
          toast.error(`Logo upload failed: ${errorData.message || 'Unknown error'}`);
          return; // Don't exit edit mode
        }
      }
      
      // Exit edit mode
      setIsEditing(false);
      toast.success('Header section saved with S3 URLs ready for publish');

    } catch (error) {
      console.error('Error saving header section:', error);
      toast.error('Error saving changes. Please try again.');
      // Keep in edit mode so user can retry
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
      {/* Image Cropper Modal */}
     {showCropper && (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="fixed inset-0 bg-black/90 z-[99999999] flex items-center justify-center p-2 sm:p-3"
  >
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white rounded-xl max-w-4xl w-full max-h-[86vh] overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="p-2 sm:p-3 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <h3 className="text-base font-semibold text-gray-800">Crop Logo</h3>
        <button
          onClick={cancelCrop}
          className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
          aria-label="Close cropper"
        >
          <XIcon className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Cropper Area */}
      <div className="flex-1 relative bg-gray-900">
        <div className="relative w-full h-[44vh] sm:h-[50vh] md:h-[56vh] lg:h-[60vh]">
          <Cropper
            image={imageToCrop}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={1} // Square aspect ratio for logos
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            showGrid={false}
            cropShape="rect"
            style={{
              containerStyle: { position: "relative", width: "100%", height: "100%" },
              cropAreaStyle: { border: "2px solid white", borderRadius: "8px" },
            }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="p-2 sm:p-3 bg-gray-50 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-2">
          {/* Zoom */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-gray-700">
                <ZoomIn className="w-4 h-4" /> Zoom
              </span>
              <span className="text-gray-600">{zoom.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
            />
          </div>

          {/* Rotation */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-gray-700">
                <RotateCw className="w-4 h-4" /> Rotation
              </span>
              <span className="text-gray-600">{rotation}°</span>
            </div>
            <input
              type="range"
              value={rotation}
              min={0}
              max={360}
              step={1}
              onChange={(e) => setRotation(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
            />
          </div>
        </div>

        {/* Action Buttons - equal width & responsive */}
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            onClick={resetCropSettings}
            className="w-full border border-gray-300 text-gray-700 hover:bg-gray-100 rounded py-1.5 text-sm"
          >
            Reset
          </button>

          <button
            onClick={cancelCrop}
            className="w-full border border-gray-300 text-gray-700 hover:bg-gray-100 rounded py-1.5 text-sm"
          >
            Cancel
          </button>

          <button
            onClick={applyCrop}
            className="w-full bg-green-600 hover:bg-green-700 text-white rounded py-1.5 text-sm"
          >
            Apply Crop
          </button>
        </div>
      </div>
    </motion.div>
  </motion.div>
)}


      {/* === Updated header: background black + white text === */}
      <motion.header
        className={`fixed top-[4rem] left-0 right-0 border-b z-50  ${
          theme === "dark"
            ? "bg-gray-800 border-gray-700 text-gray-300"
            : "bg-white border-gray-200"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0 max-w-[200px]">
              <motion.div
                className="w-8 h-8 rounded-lg flex items-center justify-center mr-2 flex-shrink-0"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                {isEditing ? (
                  <div className="relative w-full h-full">
                    
                    <img
                      src={content.logoUrl||logo}
                      alt="Logo"
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-white text-xs p-1 bg-blue-500 rounded"
                      >
                        <Upload size={12} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <img
                    src={content.logoUrl||logo}
                    alt="Logo"
                    className="w-full h-full object-contain"
                  />
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </motion.div>
              {isEditing ? (
                <input
                  type="text"
                  value={content.companyName}
                  onChange={(e) => updateContent("companyName", e.target.value)}
                  className="bg-transparent border-b border-white text-xl font-bold outline-none max-w-[140px] truncate text-white"
                />
              ) : (
                <motion.span className={`text-xl font-bold truncate ${
          theme === "dark"
            ? "bg-gray-800 border-gray-700 text-gray-300"
            : "bg-white border-gray-200 "
        }`}>
                  {content.companyName}
                </motion.span>
              )}
            </div>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center justify-center flex-1 mx-4">
              
              <div className="flex items-center space-x-6 flex-wrap justify-center">
                {content.navItems.map((item) => (
                  <motion.a
                    key={item.id}
                    href={item.href}
                    className={`font-medium relative group whitespace-nowrap hover:text-gray-300 ${
          theme === "dark"
            ? "bg-gray-800 border-gray-700 text-gray-300"
            : "bg-white border-gray-200"
        }`}
                    whileHover={{ y: -2 }}
                  >
                    {item.label}
                    <motion.span
                      className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full`}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.a>
                ))}
              </div>
            </nav>

            {/* Right side */}
            <div className="flex  items-center space-x-4 flex-shrink-0">
              {isEditing ? (
                <input
                  type="text"
                  value={content.ctaText}
                  onChange={(e) => updateContent("ctaText", e.target.value)}
                  className="bg-transparent  border px-3 py-1 rounded font-medium outline-none max-w-[120px] truncate text-white"
                />
              ) : (
                // CTA styled for dark background: transparent with white border & white text
                <Button className="bg-yellow-400 border border-white text-white hover:bg-white/10 shadow-lg transition-all duration-300 whitespace-nowrap px-4 py-2">
                  <a href="#contact" className="text-white">
                    {content.ctaText}
                  </a>
                </Button>
              )}

              <ThemeToggle />

              {/* Edit/Save Buttons */}
              {isEditing ? (
                <motion.button 
                  whileTap={{scale:0.9}}
                  whileHover={{y:-1,scaleX:1.1}}
                  onClick={handleSave}
                  disabled={isUploading}
                  className={`${
                    isUploading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-green-600 hover:font-semibold'
                  } text-white px-4 py-2 rounded cursor-pointer hover:shadow-2xl shadow-xl whitespace-nowrap`}
                >
                  {isUploading ? 'Uploading...' : <><Save size={16} className="inline mr-1" /> Save</>}
                </motion.button>
              ) : (
                <motion.button 
                  whileTap={{scale:0.9}}
                  whileHover={{y:-1,scaleX:1.1}}
                  onClick={() => setIsEditing(true)}
                  className="bg-yellow-400 text-black px-4 py-2 rounded cursor-pointer hover:shadow-2xl shadow-xl hover:font-semibold whitespace-nowrap"
                >
                 Edit
                </motion.button>
              )}
            </div>

            {/* Mobile menu button */}
            <motion.div className="lg:hidden flex-shrink-0">
              <motion.button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={` hover:text-gray-400 transition-colors p-2 ${
          theme === "dark"
            ? "bg-gray-800 border-gray-700 text-gray-300"
            : "bg-white border-gray-200 text-gray-800"
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

          {/* Mobile Nav */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                className={`lg:hidden  border-t border-gray-700 overflow-hidden bg-black ${
          theme === "dark"
            ? "bg-gray-800 border-gray-700 "
            : "bg-white border-gray-200 text-black"
        }`}
                variants={menuVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                <motion.nav className="flex flex-col space-y-4 py-4 px-4">
                  {content.navItems.map((item, index) => (
                    <motion.a
                      key={item.id}
                      href={item.href}
                      className={`  hover:text-gray-300 transition-colors py-2 px-4 rounded-lg hover:bg-white/5  ${theme === "dark"
                        ? "bg-gray-800 border-gray-700 "
                        : "bg-white border-gray-200 text-black"
                      }`}
                      variants={itemVariants}
                      whileHover={{ x: 10, scale: 1.02 }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </motion.a>
                  ))}
                  <Button className={` border bg-yellow-400 border-white hover:bg-white/10 w-full mt-4 shadow-lg px-4 py-2 ${
          theme === "dark"
            ? "text-black"
            : " border-gray-200 text-black"
        }`}>
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
