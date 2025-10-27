import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Edit2, Save, X, Loader2, Upload } from "lucide-react";
import Cropper from "react-easy-crop";
import HeroBackground from "../public/images/Hero/HeroBackground.jpg";

// Sample images (replace with your actual imports)
const Hero1 = "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800";
const Hero3 =
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400";
const Cust1 =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100";
const Cust2 =
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100";
const Cust3 =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100";
const Cust4 =
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100";
const Cust5 =
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100";
const Cust6 =
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100";

const customerImages = [Cust1, Cust2, Cust3, Cust4, Cust5, Cust6];

const itemVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
};

const imageVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

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

export default function EditableHero({
  heroData,
  onStateChange,
  userId,
  publishedId,
  templateSelection,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef(null);

  // Crop modal state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImage, setCropImage] = useState(null);
  const [cropField, setCropField] = useState(null);
  const [cropIndex, setCropIndex] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);

  // Pending image files for S3 upload
  const [pendingImageFiles, setPendingImageFiles] = useState({
    hero1Image: null,
    hero3Image: null,
    customerImages: Array(6).fill(null),
  });

  // Default content with images
  const defaultContent = heroData || {
    heading: "A healthy meal delivered",
    subheading: "to your door, every single day",
    description:
      "The smart 365-days-per-year food subscription that will make you eat healthy again. Tailored to your personal tastes and nutritional needs.",
    primaryBtn: "Start eating well",
    secondaryBtn: "Learn more",
    primaryButtonLink: "#cta",
    secondaryButtonLink: "#how",
    trustText: "Over 250,000+ meals delivered last year!",
    hero1Image: Hero1,
    hero3Image: Hero3,
    customerImages: customerImages,
  };

  // Consolidated state
  const [heroState, setHeroState] = useState(defaultContent);
  const [tempHeroState, setTempHeroState] = useState(defaultContent);

  useEffect(() => {
    if (onStateChange) {
      onStateChange(heroState);
    }
  }, [heroState, onStateChange]);

  // Intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => {
      if (heroRef.current) observer.unobserve(heroRef.current);
    };
  }, []);

  // Fake API fetch
  const fetchHeroData = async () => {
    setIsLoading(true);
    try {
      const response = await new Promise((resolve) =>
        setTimeout(() => resolve(defaultContent), 1200)
      );
      setHeroState(response);
      setTempHeroState(response);
      setDataLoaded(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible && !dataLoaded && !isLoading) {
      fetchHeroData();
    }
  }, [isVisible, dataLoaded, isLoading]);

  const handleEdit = () => {
    setIsEditing(true);
    setTempHeroState(heroState);
  };

  const handleSave = async () => {
    if (!userId || !publishedId || !templateSelection) {
      console.error("Missing user information for upload");
      return;
    }

    try {
      setIsSaving(true);

      let updatedState = { ...tempHeroState };
      let uploadPromises = [];

      // Upload hero1Image if there's a pending file
      if (pendingImageFiles.hero1Image) {
        const formData = new FormData();
        formData.append("file", pendingImageFiles.hero1Image);
        formData.append("sectionName", "hero");
        formData.append("imageField", "hero1Image" + Date.now());
        formData.append("templateSelection", templateSelection);

        uploadPromises.push(
          fetch(
            `https://o66ziwsye5.execute-api.ap-south-1.amazonaws.com/prod/upload-image/${userId}/${publishedId}`,
            {
              method: "POST",
              body: formData,
            }
          ).then(async (response) => {
            if (response.ok) {
              const uploadData = await response.json();
              updatedState.hero1Image = uploadData.imageUrl;
              console.log("Hero1 image uploaded to S3:", uploadData.imageUrl);
            } else {
              const errorData = await response.json();
              console.error(
                `Hero1 image upload failed: ${
                  errorData.message || "Unknown error"
                }`
              );
              throw new Error(`Hero1 upload failed`);
            }
          })
        );
      }

      // Upload hero3Image if there's a pending file
      if (pendingImageFiles.hero3Image) {
        const formData = new FormData();
        formData.append("file", pendingImageFiles.hero3Image);
        formData.append("sectionName", "hero");
        formData.append("imageField", "hero3Image" + Date.now());
        formData.append("templateSelection", templateSelection);

        uploadPromises.push(
          fetch(
            `https://o66ziwsye5.execute-api.ap-south-1.amazonaws.com/prod/upload-image/${userId}/${publishedId}`,
            {
              method: "POST",
              body: formData,
            }
          ).then(async (response) => {
            if (response.ok) {
              const uploadData = await response.json();
              updatedState.hero3Image = uploadData.imageUrl;
              console.log("Hero3 image uploaded to S3:", uploadData.imageUrl);
            } else {
              const errorData = await response.json();
              console.error(
                `Hero3 image upload failed: ${
                  errorData.message || "Unknown error"
                }`
              );
              throw new Error(`Hero3 upload failed`);
            }
          })
        );
      }

      // Upload customer images if there are pending files
      for (let i = 0; i < pendingImageFiles.customerImages.length; i++) {
        if (pendingImageFiles.customerImages[i]) {
          const formData = new FormData();
          formData.append("file", pendingImageFiles.customerImages[i]);
          formData.append("sectionName", "hero");
          formData.append("imageField", `customerImage` + Date.now());
          formData.append("templateSelection", templateSelection);

          uploadPromises.push(
            fetch(
              `https://o66ziwsye5.execute-api.ap-south-1.amazonaws.com/prod/upload-image/${userId}/${publishedId}`,
              {
                method: "POST",
                body: formData,
              }
            ).then(async (response) => {
              if (response.ok) {
                const uploadData = await response.json();
                updatedState.customerImages[i] = uploadData.imageUrl;
                console.log(
                  `Customer image ${i} uploaded to S3:`,
                  uploadData.imageUrl
                );
              } else {
                const errorData = await response.json();
                console.error(
                  `Customer image ${i} upload failed: ${
                    errorData.message || "Unknown error"
                  }`
                );
                throw new Error(`Customer image ${i} upload failed`);
              }
            })
          );
        }
      }

      // Wait for all uploads to complete
      if (uploadPromises.length > 0) {
        await Promise.all(uploadPromises);
      }

      // Clear pending files
      setPendingImageFiles({
        hero1Image: null,
        hero3Image: null,
        customerImages: Array(6).fill(null),
      });

      // Update both states with the new URLs
      setHeroState(updatedState);
      setTempHeroState(updatedState);

      setIsEditing(false);
      console.log("Hero section saved successfully");
    } catch (error) {
      console.error("Error saving hero section:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTempHeroState(heroState);
    setPendingImageFiles({
      hero1Image: null,
      hero3Image: null,
      customerImages: Array(6).fill(null),
    });
    setIsEditing(false);
  };

  // Open crop modal
  const openCropModal = (file, field, index = null) => {
    const reader = new FileReader();
    reader.onload = () => {
      setCropImage(reader.result);
      setCropField(field);
      setCropIndex(index);
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

      if (cropField === "hero1Image" || cropField === "hero3Image") {
        setPendingImageFiles((prev) => ({ ...prev, [cropField]: croppedFile }));

        const reader = new FileReader();
        reader.onload = () => {
          setTempHeroState((prev) => ({ ...prev, [cropField]: reader.result }));
        };
        reader.readAsDataURL(croppedFile);
      } else if (cropField === "customerImage") {
        setPendingImageFiles((prev) => {
          const updatedCustomerFiles = [...prev.customerImages];
          updatedCustomerFiles[cropIndex] = croppedFile;
          return { ...prev, customerImages: updatedCustomerFiles };
        });

        const reader = new FileReader();
        reader.onload = () => {
          const updatedCustomerImages = [...tempHeroState.customerImages];
          updatedCustomerImages[cropIndex] = reader.result;
          setTempHeroState((prev) => ({
            ...prev,
            customerImages: updatedCustomerImages,
          }));
        };
        reader.readAsDataURL(croppedFile);
      }

      setCropModalOpen(false);
    } catch (error) {
      console.error("Error cropping image:", error);
    }
  };

  // Image upload handlers with validation
  const handleImageUpload = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      console.error("Invalid file type");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      console.error("File size exceeds 5MB limit");
      return;
    }

    openCropModal(file, field);
  };

  // Customer image upload handler with validation
  const handleCustomerImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      console.error("Invalid file type");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      console.error("File size exceeds 5MB limit");
      return;
    }

    openCropModal(file, "customerImage", index);
  };

  // Stable update functions with useCallback
  const updateTempContent = useCallback((field, value) => {
    setTempHeroState((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Memoized EditableText
  const EditableText = useMemo(() => {
    return ({
      value,
      field,
      multiline = false,
      className = "",
      placeholder = "",
    }) => {
      const handleChange = (e) => {
        updateTempContent(field, e.target.value);
      };

      const baseClasses =
        "w-full bg-white/10 backdrop-blur-sm border-2 border-dashed border-yellow-300 rounded focus:border-yellow-400 focus:outline-none text-white placeholder-gray-300";

      if (multiline) {
        return (
          <textarea
            value={value}
            onChange={handleChange}
            className={`${baseClasses} p-3 resize-none ${className}`}
            placeholder={placeholder}
            rows={4}
          />
        );
      }

      return (
        <input
          type="text"
          value={value}
          onChange={handleChange}
          className={`${baseClasses} p-2 ${className}`}
          placeholder={placeholder}
        />
      );
    };
  }, [updateTempContent]);

  return (
    <>
      <section
        id="home"
        ref={heroRef}
        className="relative h-100vh flex items-center py-52 sm:px-6 lg:px-8 lg:pb-32"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${HeroBackground}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "scroll",
        }}
      >
        {isLoading && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-30">
            <div className="bg-white rounded-lg p-6 shadow-lg flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              <span className="text-gray-700">Loading content...</span>
            </div>
          </div>
        )}

        <div className="absolute top-40 right-4 z-50">
          {!isEditing ? (
            <Button
              onClick={handleEdit}
              variant="outline"
              size="sm"
              className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-md"
              disabled={isLoading}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white shadow-md"
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isSaving ? "Saving..." : "Save"}
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                size="sm"
                className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-md"
                disabled={isSaving}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full ">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center">
            <motion.div
              className="space-y-8 text-center lg:text-left order-2 lg:order-1"
              initial="hidden"
              animate="visible"
              variants={itemVariants}
            >
              {!isEditing ? (
                <motion.h1
                  className="text-3xl sm:text-4xl md:text-5xl xl:text-3xl font-bold text-white leading-tight px-2 sm:px-0"
                  variants={itemVariants}
                >
                  {heroState.heading}
                  <span className="block text-yellow-400 mt-2">
                    {heroState.subheading}
                  </span>
                </motion.h1>
              ) : (
                <div className="space-y-4">
                  <EditableText
                    value={tempHeroState.heading}
                    field="heading"
                    className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold leading-tight"
                    placeholder="Main heading"
                  />
                  <EditableText
                    value={tempHeroState.subheading}
                    field="subheading"
                    className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold text-yellow-400"
                    placeholder="Sub heading"
                  />
                </div>
              )}

              {!isEditing ? (
                <motion.p
                  className="text-base sm:text-md lg:text-md text-gray-200 max-w-2xl mx-auto lg:mx-0 px-2 sm:px-0 leading-relaxed"
                  variants={itemVariants}
                >
                  {heroState.description}
                </motion.p>
              ) : (
                <EditableText
                  value={tempHeroState.description}
                  field="description"
                  multiline
                  className="text-base sm:text-lg lg:text-xl text-gray-200 leading-relaxed"
                  placeholder="Hero description"
                />
              )}

              {!isEditing ? (
                <motion.div
                  className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start px-2 sm:px-0"
                  variants={itemVariants}
                >
                  <a
                    href={heroState.primaryButtonLink}
                    className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 rounded-full px-8 py-4 font-semibold transition-all duration-300 transform hover:scale-105 inline-block text-center"
                  >
                    {heroState.primaryBtn}
                  </a>
                  <a
                    href={heroState.secondaryButtonLink}
                    className="text-white border border-white hover:bg-white hover:text-gray-900 rounded-full px-8 py-4 font-semibold transition-all duration-300 inline-block text-center"
                  >
                    {heroState.secondaryBtn}
                  </a>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  <EditableText
                    value={tempHeroState.primaryBtn}
                    field="primaryBtn"
                    placeholder="Primary button text"
                  />
                  <EditableText
                    value={tempHeroState.secondaryBtn}
                    field="secondaryBtn"
                    placeholder="Secondary button text"
                  />
                  <EditableText
                    value={tempHeroState.primaryButtonLink}
                    field="primaryButtonLink"
                    placeholder="Primary button link"
                  />
                  <EditableText
                    value={tempHeroState.secondaryButtonLink}
                    field="secondaryButtonLink"
                    placeholder="Secondary button link"
                  />
                </div>
              )}

              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-6 pt-8 px-2 sm:px-0"
                variants={itemVariants}
              >
                <div className="flex -space-x-2">
                  {tempHeroState.customerImages.map((img, i) => (
                    <motion.div
                      key={i}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white shadow-lg bg-cover bg-center relative"
                      style={{ backgroundImage: `url('${img}')` }}
                      whileHover={{ scale: 1.2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {isEditing && (
                        <label className="absolute inset-0 bg-black/70 opacity-0 hover:opacity-100 flex items-center justify-center rounded-full cursor-pointer transition-opacity">
                          <Upload className="w-4 h-4 text-white" />
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleCustomerImageUpload(e, i)}
                          />
                        </label>
                      )}
                      {isEditing && pendingImageFiles.customerImages[i] && (
                        <div className="absolute -bottom-6 left-0 text-xs text-orange-300 bg-black/70 px-1 rounded">
                          Pending
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
                {!isEditing ? (
                  <span className="text-sm sm:text-base text-white font-normal">
                    {heroState.trustText}
                  </span>
                ) : (
                  <EditableText
                    value={tempHeroState.trustText}
                    field="trustText"
                    placeholder="Trust text"
                    className="text-sm sm:text-base text-white"
                  />
                )}
              </motion.div>
            </motion.div>

            <motion.div
              className="relative order-1 lg:order-2 flex justify-center lg:justify-end px-4 sm:px-0"
              initial="hidden"
              animate="visible"
              variants={itemVariants}
            >
              <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl">
                <motion.div className="relative" variants={imageVariants}>
                  <div className="relative">
                    <img
                      src={
                        isEditing
                          ? tempHeroState.hero1Image
                          : heroState.hero1Image
                      }
                      alt="Innovation showcase"
                      className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-3xl shadow-2xl"
                    />
                    {isEditing && (
                      <label className="absolute bottom-2 right-2 bg-black/70 text-white p-2 rounded cursor-pointer hover:bg-black/90 transition-colors">
                        <Upload className="w-4 h-4" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, "hero1Image")}
                        />
                      </label>
                    )}
                    {isEditing && pendingImageFiles.hero1Image && (
                      <div className="absolute top-2 left-2 text-xs text-orange-300 bg-black/70 px-2 py-1 rounded">
                        Pending upload: {pendingImageFiles.hero1Image.name}
                      </div>
                    )}
                  </div>
                  <motion.div
                    className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 lg:-bottom-8 lg:-left-8"
                    variants={imageVariants}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="relative">
                      <img
                        src={
                          isEditing
                            ? tempHeroState.hero3Image
                            : heroState.hero3Image
                        }
                        alt="Tech innovation"
                        className="w-48 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-cover rounded-2xl shadow-xl border-4 border-white"
                      />
                      {isEditing && (
                        <label className="absolute bottom-1 right-1 bg-black/70 text-white p-1 rounded cursor-pointer hover:bg-black/90 transition-colors">
                          <Upload className="w-3 h-3" />
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageUpload(e, "hero3Image")}
                          />
                        </label>
                      )}
                      {isEditing && pendingImageFiles.hero3Image && (
                        <div className="absolute -top-6 left-0 text-xs text-orange-300 bg-black/70 px-1 rounded">
                          Pending
                        </div>
                      )}
                    </div>
                  </motion.div>
                  <motion.div
                    className="absolute -top-6 -right-6 w-16 h-16 sm:w-20 sm:h-20 bg-yellow-400 rounded-full opacity-80"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6, type: "spring", stiffness: 300 }}
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Crop Modal */}
      {cropModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[999999]">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Crop Image</h3>
            <div className="relative w-full h-96 bg-gray-900 rounded-lg overflow-hidden">
              <Cropper
                image={cropImage}
                crop={crop}
                zoom={zoom}
                aspect={cropField === "customerImage" ? 1 : 4 / 3}
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
