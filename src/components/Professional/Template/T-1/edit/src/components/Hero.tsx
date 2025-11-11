import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import {
  Save,
  Upload,
  Edit,
  X,
  Crop,
  Check,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { toast } from "sonner";

export interface HeroContent {
  name: string;
  title: string;
  description: string;
  image: string;
  socials: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    github?: string;
    email?: string;
    phone?: string;
  };
}

interface HeroProps {
  content: HeroContent;
  onSave: (updatedContent: HeroContent) => void;
  userId: string | undefined;
}

const Hero: React.FC<HeroProps> = ({ content, onSave, userId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [heroContent, setHeroContent] = useState<HeroContent>(content);
  const [originalContent, setOriginalContent] = useState<HeroContent>(content);

  // Character limits
  const CHAR_LIMITS = {
    name: 50,
    title: 100,
    description: 500,
    socials: 100,
  };

  // Cropping states
  const [isCropping, setIsCropping] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string>("");
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // update local state if props change
  useEffect(() => {
    if (content) {
      setHeroContent(content);
      setOriginalContent(content);
    }
  }, [content]);

  // lock body scroll when cropping
  useEffect(() => {
    if (isCropping) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isCropping]);

  const handleChange = (field: string, value: string) => {
    if (field.startsWith("socials.")) {
      const socialKey = field.split(".")[1];
      setHeroContent((prev) => ({
        ...prev,
        socials: { ...prev.socials, [socialKey]: value },
      }));
    } else {
      setHeroContent((prev) => ({ ...prev, [field]: value }));
    }
  };

  const getCharCountColor = (current: number, max: number) => {
    if (current >= max) return "text-red-500";
    if (current >= max * 0.9) return "text-yellow-500";
    return "text-gray-500";
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const getCroppedImage = async (): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const canvas = canvasRef.current;
      const image = imageRef.current;
      const container = containerRef.current;

      if (!canvas || !image || !container) {
        reject(new Error("Canvas, image, or container not found"));
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      // Output size
      const outputSize = 500;
      canvas.width = outputSize;
      canvas.height = outputSize;

      // Get container dimensions
      const containerRect = container.getBoundingClientRect();
      const cropRadius = 120; // Same as the circle radius in the overlay

      // Calculate the center of the crop area in the container
      const centerX = containerRect.width / 2;
      const centerY = containerRect.height / 2;

      // Get image dimensions and position
      const imgRect = image.getBoundingClientRect();
      const containerLeft = containerRect.left;
      const containerTop = containerRect.top;

      // Calculate image position relative to container
      const imgX = imgRect.left - containerLeft;
      const imgY = imgRect.top - containerTop;

      // Calculate the crop area in the original image coordinates
      const scaleX = image.naturalWidth / imgRect.width;
      const scaleY = image.naturalHeight / imgRect.height;

      // Calculate source coordinates (what part of the original image to crop)
      const sourceX = (centerX - imgX - cropRadius) * scaleX;
      const sourceY = (centerY - imgY - cropRadius) * scaleY;
      const sourceSize = cropRadius * 2 * scaleX;

      // Draw the cropped circular image
      ctx.beginPath();
      ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      // Draw the image
      ctx.drawImage(
        image,
        sourceX,
        sourceY,
        sourceSize,
        sourceSize,
        0,
        0,
        outputSize,
        outputSize
      );

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to create blob"));
          }
        },
        "image/jpeg",
        0.95
      );
    });
  };

  const handleCropConfirm = async () => {
    try {
      const croppedBlob = await getCroppedImage();
      const croppedFile = new File([croppedBlob], "cropped-image.jpg", {
        type: "image/jpeg",
      });

      // Convert to base64 for immediate preview
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setHeroContent((prev) => ({
            ...prev,
            image: reader.result as string,
          }));
        }
      };
      reader.readAsDataURL(croppedFile);

      setIsUploading(true);
      setIsCropping(false);
      setImageLoaded(false);

      // Upload cropped image
      const formData = new FormData();
      formData.append("file", croppedFile);
      formData.append("userId", userId!);
      formData.append("fieldName", "heroImage");

      const uploadResponse = await fetch(
        `https://ow3v94b9gf.execute-api.ap-south-1.amazonaws.com/dev/`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (uploadResponse.ok) {
        const uploadData = await uploadResponse.json();
        setHeroContent((prev) => ({
          ...prev,
          image: uploadData.s3Url,
        }));
        toast.success("Image uploaded successfully!");
      } else {
        const errorData = await uploadResponse.json();
        toast.error(
          `Image upload failed: ${errorData.message || "Unknown error"}`
        );
      }

      setIsUploading(false);
    } catch (error) {
      console.error("Error cropping image:", error);
      toast.error("Failed to crop image");
      setIsCropping(false);
      setIsUploading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setImageToCrop(reader.result as string);
          setIsCropping(true);
          setScale(1);
          setPosition({ x: 0, y: 0 });
          setImageLoaded(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleSave = () => {
    if (onSave) onSave(heroContent);
    setOriginalContent(heroContent);
    toast.success("Hero section updated successfully!");
    setIsEditing(false);
  };

  const handleCancel = () => {
    setHeroContent(originalContent);
    setIsEditing(false);
    toast.info("Changes discarded");
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 1));
  };

  return (
    <section
      id="home"
      className="bg-white dark:bg-gray-900 transition-colors duration-300 pt-40"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-40 relative">
        {/* Edit Button */}
        <div className="absolute top-10 right-8 px-4 py-2 rounded-full flex items-center gap-2 font-semibold shadow-lg transition-all duration-300">
          {isEditing ? (
            <div className="absolute top-0 right-0 flex items-center justify-center gap-2">
              <button
                onClick={handleSave}
                title="save updates"
                className="p-3 bg-green-500 hover:bg-green-600 text-white rounded-full"
              >
                <Save className="w-6 h-6" />
              </button>
              <button
                onClick={handleCancel}
                title="cancel updates"
                className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              title="update hero section"
              className="absolute top-0 right-0 p-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-full"
            >
              <Edit className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Hero Content */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left Side */}
          <div className="space-y-8">
            <div className="space-y-6">
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={heroContent.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    maxLength={CHAR_LIMITS.name}
                    className="text-4xl lg:text-6xl font-bold p-4 rounded-xl w-full border"
                  />
                  <div
                    className={`text-sm text-right ${getCharCountColor(
                      heroContent.name.length,
                      CHAR_LIMITS.name
                    )}`}
                  >
                    {heroContent.name.length}/{CHAR_LIMITS.name}
                  </div>
                </div>
              ) : (
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white">
                  <span className="text-yellow-500 capitalize">
                    {heroContent.name}
                  </span>
                </h1>
              )}

              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={heroContent.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    maxLength={CHAR_LIMITS.title}
                    className="text-xl lg:text-2xl font-semibold p-3 rounded-lg w-full border"
                  />
                  <div
                    className={`text-sm text-right ${getCharCountColor(
                      heroContent.title.length,
                      CHAR_LIMITS.title
                    )}`}
                  >
                    {heroContent.title.length}/{CHAR_LIMITS.title}
                  </div>
                </div>
              ) : (
                <p className="text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white">
                  {heroContent.title}
                </p>
              )}

              {isEditing ? (
                <div className="space-y-2">
                  <textarea
                    value={heroContent.description}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    maxLength={CHAR_LIMITS.description}
                    className="text-lg p-4 rounded-lg w-full border resize-none"
                    rows={4}
                  />
                  <div
                    className={`text-sm text-right ${getCharCountColor(
                      heroContent.description.length,
                      CHAR_LIMITS.description
                    )}`}
                  >
                    {heroContent.description.length}/{CHAR_LIMITS.description}
                  </div>
                </div>
              ) : (
                <p className="text-lg lg:text-xl text-gray-700 dark:text-gray-300">
                  {heroContent.description}
                </p>
              )}
            </div>

            {!isEditing && (
              <motion.div className="grid grid-cols-2 gap-4 pt-4">
                <a
                  href="#projects"
                  className="px-8 py-4 rounded-full font-semibold text-xs md:text-lg border-2 transition-all duration-300 hover:scale-105 border-yellow-400 hover:bg-yellow-400 text-gray-900 dark:text-white hover:text-white text-center"
                >
                  View My Work
                </a>

                <a
                  href="#contact"
                  className="px-8 py-4 rounded-full font-semibold text-xs md:text-lg border-2 transition-all duration-300 hover:scale-105 border-yellow-400 hover:bg-yellow-400 text-gray-900 dark:text-white hover:text-white text-center"
                >
                  Get In Touch
                </a>
              </motion.div>
            )}
          </div>

          {/* Right Side - Profile Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-80 h-80 lg:w-96 lg:h-96 rounded-full p-1 bg-gradient-to-r from-yellow-500 via-orange-500 to-indigo-yellow-700">
              <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center relative">
                {isEditing ? (
                  !isUploading ? (
                    <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white cursor-pointer z-10">
                      <Upload className="w-10 h-10" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white z-10">
                      <p className="text-center text-lg font-bold">
                        Loading...
                      </p>
                    </div>
                  )
                ) : null}
                <img
                  src={heroContent.image}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 rounded-full opacity-10 bg-yellow-400 animate-pulse" />
          <div className="absolute bottom-20 right-10 w-24 h-24 rounded-full opacity-10 bg-orange-500 animate-bounce" />
          <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full opacity-5 bg-red-500 animate-pulse" />
          <div className="absolute bottom-0 left-1/1 w-10 h-10 rounded-full opacity-5 bg-red-500 animate-bounce-slow" />
          <div className="absolute top-1 left-1/4 w-8 h-8 rounded-full opacity-5 bg-red-500 animate-bounce-slow" />
        </div>
      </div>

      {/* Image Cropping Modal */}
      {isCropping &&
        createPortal(
          <div
            className="fixed inset-0 bg-black/90 z-[2147483647] flex items-center justify-center p-4"
            style={{ zIndex: 2147483647 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-3xl relative mx-4">
              <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Crop className="w-6 h-6" />
                  Crop Image
                </h3>
                <button
                  onClick={() => setIsCropping(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-900 dark:text-white" />
                </button>
              </div>

              <div className="p-6">
                <div
                  ref={containerRef}
                  className="relative h-72 bg-gray-900 rounded-lg overflow-hidden mb-6 cursor-move select-none"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  {/* Circular crop overlay */}
                  <div className="absolute inset-0 pointer-events-none z-10">
                    <svg className="w-full h-full">
                      <defs>
                        <mask id="circleMask">
                          <rect width="100%" height="100%" fill="white" />
                          <circle cx="50%" cy="50%" r="120" fill="black" />
                        </mask>
                      </defs>
                      <rect
                        width="100%"
                        height="100%"
                        fill="rgba(0,0,0,0.5)"
                        mask="url(#circleMask)"
                      />
                      <circle
                        cx="50%"
                        cy="50%"
                        r="120"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeDasharray="10,5"
                      />
                    </svg>
                  </div>

                  <img
                    ref={imageRef}
                    src={imageToCrop}
                    alt="Crop preview"
                    onLoad={handleImageLoad}
                    className="absolute select-none z-0"
                    style={{
                      maxHeight: "100%",
                      maxWidth: "100%",
                      height: "auto",
                      width: "auto",
                      left: "50%",
                      top: "50%",
                      transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(${scale})`,
                      transformOrigin: "center",
                      opacity: imageLoaded ? 1 : 0,
                      transition: imageLoaded ? "none" : "opacity 0.3s",
                    }}
                    draggable={false}
                  />

                  {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center text-white z-10">
                      <p className="text-lg">Loading image...</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-base font-medium text-gray-900 dark:text-white">
                        Zoom Control
                      </label>
                      <div className="flex gap-3">
                        <button
                          onClick={handleZoomOut}
                          className="p-3 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                          <ZoomOut className="w-5 h-5" />
                        </button>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[60px] text-center">
                          {Math.round(scale * 100)}%
                        </span>
                        <button
                          onClick={handleZoomIn}
                          className="p-3 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                          <ZoomIn className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={3}
                      step={0.01}
                      value={scale}
                      onChange={(e) => setScale(Number(e.target.value))}
                      className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-end p-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setIsCropping(false)}
                  className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCropConfirm}
                  disabled={!imageLoaded}
                  className="px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  <Check className="w-5 h-5" />
                  Crop & Upload Image
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Hidden canvas for cropping */}
      <canvas ref={canvasRef} className="hidden" />
    </section>
  );
};

export default Hero;
