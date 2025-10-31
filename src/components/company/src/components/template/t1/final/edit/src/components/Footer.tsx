import {
  ArrowRight,
  Edit2,
  Facebook,
  Github,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Plus,
  Save,
  Trash2,
  Twitter,
  Upload,
  X,
  Loader2,
  RotateCw,
  ZoomIn,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import Cropper from "react-easy-crop";

// Enhanced crop helper function (same as Header)
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
        const fileName = `cropped-image-${Date.now()}.jpg`;
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

export default function EditableFooter({
  content,
  onStateChange,
  userId,
  publishedId,
  templateSelection,
}) {
  // Character limits
  const CHAR_LIMITS = {
    brandName: 100,
    brandDescription: 200,
    sectionTitle: 100,
    linkText: 100,
    linkUrl: 500,
    contactEmail: 100,
    contactPhone: 50,
    contactAddress: 200,
    socialName: 50,
    socialUrl: 500,
    legalText: 100,
    legalUrl: 500,
  };

  // Initialize with data from props or use default structure
  const initialData = content;

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [footerData, setFooterData] = useState(initialData);
  const [tempData, setTempData] = useState(initialData);
  const [pendingLogoFile, setPendingLogoFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Enhanced crop modal state (same as Header)
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(1);

  // Update state when content prop changes
  useEffect(() => {
    if (content) {
      setFooterData(initialData);
      setTempData(initialData);
    }
  }, [content]);

  // Notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(footerData);
    }
  }, [footerData, onStateChange]);

  // Enhanced cropper functions (same as Header)
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Enhanced image upload handler with crop modal (same as Header)
  const handleLogoUpload = (e) => {
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
      setAspectRatio(1); // Square for logo
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
    };
    reader.readAsDataURL(file);

    if (e.target) {
      e.target.value = "";
    }
  };

  // Apply crop function (same as Header)
  const applyCrop = async () => {
    try {
      if (!imageToCrop || !croppedAreaPixels) {
        console.error("Please select an area to crop");
        return;
      }

      const { file, previewUrl } = await getCroppedImg(
        imageToCrop,
        croppedAreaPixels,
        rotation
      );

      // Store the cropped file for upload on Save
      setPendingLogoFile(file);

      // Show immediate local preview of cropped image
      updateNestedField("brand.logoUrl", previewUrl);

      setCropModalOpen(false);
      setImageToCrop(null);
      setOriginalFile(null);
      toast.success("Logo cropped successfully");
    } catch (error) {
      console.error("Error cropping image:", error);
      toast.error("Error cropping image. Please try again.");
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

  const handleEdit = () => {
    setIsEditing(true);
    setTempData(footerData);
  };

  const handleCancel = () => {
    setTempData(footerData);
    setIsEditing(false);
    setPendingLogoFile(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setIsUploading(true);

    try {
      let updatedLogoUrl = tempData.brand.logoUrl;

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
        formData.append("sectionName", "footer");
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
          // Update the logo URL to the S3 URL
          updatedLogoUrl = uploadData.imageUrl;
          setPendingLogoFile(null);
        } else {
          const errorData = await uploadResponse.json();
          console.error("Logo upload failed:", errorData);
          toast.error(
            `Logo upload failed: ${errorData.message || "Unknown error"}`
          );
          return;
        }
      }

      // Create updated data with the new logo URL
      const updatedData = {
        ...tempData,
        brand: {
          ...tempData.brand,
          logoUrl: updatedLogoUrl,
        },
      };

      // Now save the updated data
      setFooterData(updatedData);
      setTempData(updatedData);
      setIsEditing(false);
      toast.success("Footer saved successfully");
    } catch (error) {
      console.error("Error saving footer:", error);
      toast.error("Error saving changes. Please try again.");
    } finally {
      setIsSaving(false);
      setIsUploading(false);
    }
  };

  const updateNestedField = (path, value) => {
    setTempData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let current = newData;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;

      return newData;
    });
  };

  // Simplified update functions similar to Footer2.tsx
  const updateBrand = (field, value) => {
    setTempData((prev) => ({
      ...prev,
      brand: { ...prev.brand, [field]: value },
    }));
  };

  const updateContact = (field, value) => {
    setTempData((prev) => ({
      ...prev,
      contact: { ...prev.contact, [field]: value },
    }));
  };

  const updateSectionTitle = (sectionIndex, value) => {
    setTempData((prev) => ({
      ...prev,
      sections: prev.sections.map((section, index) =>
        index === sectionIndex ? { ...section, title: value } : section
      ),
    }));
  };

  const addSectionLink = (sectionId) => {
    setTempData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              links: [
                ...section.links,
                {
                  id: Date.now(),
                  text: "New Link",
                  href: "#new",
                },
              ],
            }
          : section
      ),
    }));
  };

  const removeSectionLink = (sectionId, linkId) => {
    setTempData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              links: section.links.filter((link) => link.id !== linkId),
            }
          : section
      ),
    }));
  };

  const updateSectionLink = (sectionId, linkId, field, value) => {
    setTempData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              links: section.links.map((link) =>
                link.id === linkId ? { ...link, [field]: value } : link
              ),
            }
          : section
      ),
    }));
  };

  const addSection = () => {
    setTempData((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          id: Date.now(),
          title: "New Section",
          links: [{ id: Date.now() + 1, text: "New Link", href: "#" }],
        },
      ],
    }));
  };

  const removeSection = (sectionId) => {
    if (tempData.sections.length > 1) {
      setTempData((prev) => ({
        ...prev,
        sections: prev.sections.filter((section) => section.id !== sectionId),
      }));
    }
  };

  const updateSocialMedia = (index, field, value) => {
    setTempData((prev) => ({
      ...prev,
      socialMedia: prev.socialMedia.map((social, i) =>
        i === index ? { ...social, [field]: value } : social
      ),
    }));
  };

  const addSocialMedia = () => {
    setTempData((prev) => ({
      ...prev,
      socialMedia: [
        ...prev.socialMedia,
        {
          id: Date.now(),
          name: "New Social",
          icon: "Facebook",
          href: "#",
          hoverColor: "hover:bg-blue-600",
        },
      ],
    }));
  };

  const removeSocialMedia = (id) => {
    if (tempData.socialMedia.length > 1) {
      setTempData((prev) => ({
        ...prev,
        socialMedia: prev.socialMedia.filter((social) => social.id !== id),
      }));
    }
  };

  const updateLegalLink = (index, field, value) => {
    setTempData((prev) => ({
      ...prev,
      legalLinks: prev.legalLinks.map((link, i) =>
        i === index ? { ...link, [field]: value } : link
      ),
    }));
  };

  const addLegalLink = () => {
    setTempData((prev) => ({
      ...prev,
      legalLinks: [
        ...prev.legalLinks,
        { id: Date.now(), text: "New Link", href: "#" },
      ],
    }));
  };

  const removeLegalLink = (id) => {
    if (tempData.legalLinks.length > 1) {
      setTempData((prev) => ({
        ...prev,
        legalLinks: prev.legalLinks.filter((link) => link.id !== id),
      }));
    }
  };

  const getSocialIcon = (iconName) => {
    const icons = {
      Facebook: Facebook,
      Github: Github,
      Linkedin: Linkedin,
      Instagram: Instagram,
      Twitter: Twitter,
    };
    const IconComponent = icons[iconName] || Facebook;
    return <IconComponent className="w-4 h-4" />;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <>
      {/* Footer Preview/Edit */}
      <motion.footer
        className="bg-gray-900 border-t border-gray-800 relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* Edit Toggle - positioned in top right */}
        <div className="absolute top-4 right-4 z-10">
          {!isEditing ? (
            <Button
              onClick={handleEdit}
              className="bg-gray-100 hover:bg-gray-400 text-black"
              size="sm"
            >
              <Edit2 className="w-3 h-3 mr-1" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white"
                size="sm"
                disabled={isSaving || isUploading}
              >
                {isUploading ? (
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                ) : isSaving ? (
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                ) : (
                  <Save className="w-3 h-3 mr-1" />
                )}
                {isUploading ? "Uploading..." : isSaving ? "Saving..." : "Save"}
              </Button>
              <Button
                onClick={handleCancel}
                className="bg-gray-600 hover:bg-gray-700 text-white"
                size="sm"
                disabled={isSaving || isUploading}
              >
                <X className="w-3 h-3 mr-1" />
                Cancel
              </Button>
            </div>
          )}
        </div>
        
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 lg:py-12 relative">
          {/* Main Footer Content */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-16 text-center md:text-left"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Brand Section */}
            <motion.div
              className="col-span-1 md:col-span-2 lg:col-span-1"
              variants={itemVariants}
            >
              <div className="flex items-center justify-center md:justify-start space-x-3 mb-4">
                <span className="flex flex-row gap-2 text-xl font-bold text-red-500">
                  <div className="relative">
                    <img
                      src={tempData.brand.logoUrl}
                      alt="Logo"
                      className="h-4 w-4 sm:h-6 sm:w-6 object-contain"
                      style={{
                        filter: isEditing ? "brightness(0.7)" : "none",
                      }}
                    />
                    {isEditing && (
                      <div className="absolute -bottom-14 left-0 bg-white/90 p-2 rounded shadow-lg">
                        <p className="text-xs mb-1 text-gray-600">
                          Upload Logo:
                        </p>
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
                  {isEditing ? (
                    <div className="flex-1">
                      <input
                        type="text"
                        value={tempData.brand.name}
                        onChange={(e) => updateBrand("name", e.target.value)}
                        placeholder="Brand name"
                        className="w-full p-1 border border-gray-600 rounded bg-gray-800 text-white text-sm"
                        maxLength={CHAR_LIMITS.brandName}
                      />
                      <div className="text-xs text-gray-500 text-right mt-1">
                        {tempData.brand.name.length}/{CHAR_LIMITS.brandName} characters
                      </div>
                    </div>
                  ) : (
                    tempData.brand.name
                  )}
                </span>
              </div>

              {isEditing ? (
                <div className="mb-4">
                  <label className="block text-xs text-gray-400 mb-1">
                    Description:
                  </label>
                  <textarea
                    value={tempData.brand.description}
                    onChange={(e) => updateBrand("description", e.target.value)}
                    placeholder="Brand description"
                    className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white text-sm resize-none"
                    rows={3}
                    maxLength={CHAR_LIMITS.brandDescription}
                  />
                  <div className="text-xs text-gray-500 text-right mt-1">
                    {tempData.brand.description.length}/{CHAR_LIMITS.brandDescription} characters
                  </div>
                </div>
              ) : (
                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  {tempData.brand.description}
                </p>
              )}
            </motion.div>

            {/* Dynamic Sections */}
            {tempData.sections.map((section, sectionIndex) => (
              <motion.div
                key={section.id}
                className="col-span-1"
                variants={itemVariants}
              >
                <div className="flex items-center justify-center md:justify-start mb-4">
                  {isEditing ? (
                    <div className="flex items-center w-full">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={section.title}
                          onChange={(e) =>
                            updateSectionTitle(sectionIndex, e.target.value)
                          }
                          placeholder="Section title"
                          className="w-full p-1 border border-gray-600 rounded bg-gray-800 text-white text-sm font-semibold"
                          maxLength={CHAR_LIMITS.sectionTitle}
                        />
                        <div className="text-xs text-gray-500 text-right mt-1">
                          {section.title.length}/{CHAR_LIMITS.sectionTitle} characters
                        </div>
                      </div>
                      {tempData.sections.length > 1 && (
                        <Button
                          onClick={() => removeSection(section.id)}
                          size="sm"
                          variant="destructive"
                          className="ml-2"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  ) : (
                    <h4 className="font-semibold text-white">
                      {section.title}
                    </h4>
                  )}
                </div>

                <ul className="space-y-3 text-sm">
                  {section.links.map((link) => (
                    <li key={link.id} className="flex items-center gap-2">
                      {isEditing ? (
                        <div className="flex-1 space-y-1">
                          <div>
                            <input
                              type="text"
                              value={link.text}
                              onChange={(e) =>
                                updateSectionLink(
                                  section.id,
                                  link.id,
                                  "text",
                                  e.target.value
                                )
                              }
                              placeholder="Link text"
                              className="w-full p-1 border border-gray-600 rounded bg-gray-800 text-white text-xs"
                              maxLength={CHAR_LIMITS.linkText}
                            />
                            <div className="text-xs text-gray-500 text-right mt-1">
                              {link.text.length}/{CHAR_LIMITS.linkText} characters
                            </div>
                          </div>
                          <div>
                            <input
                              type="text"
                              value={link.href}
                              onChange={(e) =>
                                updateSectionLink(
                                  section.id,
                                  link.id,
                                  "href",
                                  e.target.value
                                )
                              }
                              placeholder="Link URL"
                              className="w-full p-1 border border-gray-600 rounded bg-gray-800 text-white text-xs"
                              maxLength={CHAR_LIMITS.linkUrl}
                            />
                            <div className="text-xs text-gray-500 text-right mt-1">
                              {link.href.length}/{CHAR_LIMITS.linkUrl} characters
                            </div>
                          </div>
                        </div>
                      ) : (
                        <a
                          href={link.href}
                          className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex-1"
                        >
                          {link.text}
                        </a>
                      )}

                      {isEditing && (
                        <button
                          onClick={() => removeSectionLink(section.id, link.id)}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </li>
                  ))}

                  {isEditing && (
                    <li>
                      <button
                        onClick={() => addSectionLink(section.id)}
                        className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm"
                      >
                        <Plus className="w-3 h-3" />
                        Add Link
                      </button>
                    </li>
                  )}
                </ul>
              </motion.div>
            ))}

            {/* Add Section Button */}
            {isEditing && (
              <motion.div
                className="col-span-1 flex items-center justify-center"
                variants={itemVariants}
              >
                <Button
                  onClick={addSection}
                  size="sm"
                  variant="outline"
                  className="text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Section
                </Button>
              </motion.div>
            )}

            {/* Contact & Social Media */}
            {/* <motion.div 
              className='col-span-1'
              variants={itemVariants}>
              <h4 className='font-semibold text-white mb-4'>Get in Touch</h4>

              
              <div className='space-y-3 mb-6 text-sm'>
                <div className='flex items-start justify-center md:justify-start space-x-3 text-gray-300'>
                  <Mail className='w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0' />
                  {isEditing ? (
                    <div className="flex-1">
                      <input
                        type="email"
                        value={tempData.contact.email}
                        onChange={(e) => updateContact("email", e.target.value)}
                        placeholder="Email address"
                        className="w-full p-1 border border-gray-600 rounded bg-gray-800 text-white text-xs"
                        maxLength={CHAR_LIMITS.contactEmail}
                      />
                      <div className="text-xs text-gray-500 text-right mt-1">
                        {tempData.contact.email.length}/{CHAR_LIMITS.contactEmail} characters
                      </div>
                    </div>
                  ) : (
                    <span className="blur-[3px] select-none">{tempData.contact.email}</span>
                  )}
                </div>

                <div className='flex items-start justify-center md:justify-start space-x-3 text-gray-300'>
                  <Phone className='w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0' />
                  {isEditing ? (
                    <div className="flex-1">
                      <input
                        type="tel"
                        value={tempData.contact.phone}
                        onChange={(e) => updateContact("phone", e.target.value)}
                        placeholder="Phone number"
                        className="w-full p-1 border border-gray-600 rounded bg-gray-800 text-white text-xs"
                        maxLength={CHAR_LIMITS.contactPhone}
                      />
                      <div className="text-xs text-gray-500 text-right mt-1">
                        {tempData.contact.phone.length}/{CHAR_LIMITS.contactPhone} characters
                      </div>
                    </div>
                  ) : (
                    <span className="blur-[3px] select-none">{tempData.contact.phone}</span>
                  )}
                </div>

                <div className='flex items-start justify-center md:justify-start space-x-3 text-gray-300'>
                  <MapPin className='w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0' />
                  {isEditing ? (
                    <div className="flex-1">
                      <input
                        type="text"
                        value={tempData.contact.address}
                        onChange={(e) => updateContact("address", e.target.value)}
                        placeholder="Address"
                        className="w-full p-1 border border-gray-600 rounded bg-gray-800 text-white text-xs"
                        maxLength={CHAR_LIMITS.contactAddress}
                      />
                      <div className="text-xs text-gray-500 text-right mt-1">
                        {tempData.contact.address.length}/{CHAR_LIMITS.contactAddress} characters
                      </div>
                    </div>
                  ) : (
                    <span className="blur-[3px] select-none">{tempData.contact.address}</span>
                  )}
                </div>
              </div>
            </motion.div> */}
          </motion.div>

          {/* Edit Mode Instructions */}
          {isEditing && (
            <motion.div
              className="mt-8 p-4 bg-blue-900/50 rounded-lg border border-blue-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-sm text-blue-300 mb-2">
                <strong>Edit Mode Active:</strong> Character limits:
              </p>
              <ul className="text-xs text-blue-300 space-y-1">
                <li>• <strong>Brand Name:</strong> {CHAR_LIMITS.brandName} characters</li>
                <li>• <strong>Brand Description:</strong> {CHAR_LIMITS.brandDescription} characters</li>
                <li>• <strong>Section Titles:</strong> {CHAR_LIMITS.sectionTitle} characters</li>
                <li>• <strong>Link Text:</strong> {CHAR_LIMITS.linkText} characters</li>
                <li>• <strong>Link URLs:</strong> {CHAR_LIMITS.linkUrl} characters</li>
              </ul>
            </motion.div>
          )}
        </div>
      </motion.footer>

      {/* Enhanced Crop Modal (same as Header) */}
      {cropModalOpen && (
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
                <X className="w-5 h-5 text-gray-600" />
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

            {/* Controls */}
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              {/* Aspect Ratio Buttons */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Aspect Ratio:</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setAspectRatio(1)}
                    className={`px-3 py-2 text-sm rounded border ${
                      aspectRatio === 1 
                        ? 'bg-blue-500 text-white border-blue-500' 
                        : 'bg-white text-gray-700 border-gray-300'
                    }`}
                  >
                    1:1 (Square)
                  </button>
                  <button
                    onClick={() => setAspectRatio(4/3)}
                    className={`px-3 py-2 text-sm rounded border ${
                      aspectRatio === 4/3 
                        ? 'bg-blue-500 text-white border-blue-500' 
                        : 'bg-white text-gray-700 border-gray-300'
                    }`}
                  >
                    4:3 (Standard)
                  </button>
                  <button
                    onClick={() => setAspectRatio(16/9)}
                    className={`px-3 py-2 text-sm rounded border ${
                      aspectRatio === 16/9 
                        ? 'bg-blue-500 text-white border-blue-500' 
                        : 'bg-white text-gray-700 border-gray-300'
                    }`}
                  >
                    16:9 (Widescreen)
                  </button>
                </div>
              </div>

              {/* Zoom Control */}
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
                  className="w-full bg-green-600 hover:bg-green-700 text-white rounded py-2 text-sm font-medium"
                >
                  Apply Crop
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}