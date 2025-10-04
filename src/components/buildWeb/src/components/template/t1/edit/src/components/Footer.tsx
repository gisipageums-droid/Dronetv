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
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export default function EditableFooter({
  content,
  onStateChange,
  userId,
  publishedId,
  templateSelection,
}) {
  // Initialize with data from props or use default structure
  const initialData = {
    brand: {
      name: content.name,
      description:
        "Innovative solutions for modern businesses. Transform your operations with our expert guidance and cutting-edge technology.",
      logoUrl: content.logo,
    },
  
    contact: {
      email: "hello@innovativelabs.com",
      phone: "+1 (555) 123-4567",
      address: "San Francisco, CA 94105",
    },
    sections: [
      {
        id: 1,
        title: "Company",
        links: [
          { id: 1, text: "About Us", href: "#about" },
          { id: 2, text: "Our Team", href: "#team" },
          { id: 3, text: "Careers", href: "#careers" },
          { id: 4, text: "News & Press", href: "#news" },
        ],
      },
      {
        id: 2,
        title: "Services",
        links: [
          { id: 1, text: "Consulting", href: "#consulting" },
          { id: 2, text: "Development", href: "#development" },
          { id: 3, text: "Support & Maintenance", href: "#support" },
          { id: 4, text: "Training", href: "#training" },
        ],
      },
    ],
    socialMedia: [
      {
        id: 1,
        name: "Facebook",
        icon: "Facebook",
        href: "#",
        hoverColor: "hover:bg-blue-600",
      },
      {
        id: 2,
        name: "GitHub",
        icon: "Github",
        href: "#",
        hoverColor: "hover:bg-gray-700",
      },
      {
        id: 3,
        name: "LinkedIn",
        icon: "Linkedin",
        href: "#",
        hoverColor: "hover:bg-blue-600",
      },
      {
        id: 4,
        name: "Instagram",
        icon: "Instagram",
        href: "#",
        hoverColor: "hover:bg-pink-600",
      },
    ],
    legalLinks: [
      { id: 1, text: "Privacy Policy", href: "#privacy" },
      { id: 2, text: "Terms of Service", href: "#terms" },
      { id: 3, text: "Status", href: "#status" },
      { id: 4, text: "Sitemap", href: "#sitemap" },
    ],
    copyright: "© 2024 Innovative Labs. All rights reserved.",
  };

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [footerData, setFooterData] = useState(initialData);
  const [tempData, setTempData] = useState(initialData);
  const [pendingLogoFile, setPendingLogoFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

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

    // Store the file for upload on Save
    setPendingLogoFile(file);

    // Show immediate local preview
    const reader = new FileReader();
    reader.onloadend = () => {
      updateNestedField("brand.logoUrl", reader.result);
    };
    reader.readAsDataURL(file);
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
        formData.append("imageField", "logoUrl");
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
          logoUrl: updatedLogoUrl
        }
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
    setTempData(prev => ({
      ...prev,
      brand: { ...prev.brand, [field]: value }
    }));
  };

 

  const updateContact = (field, value) => {
    setTempData(prev => ({
      ...prev,
      contact: { ...prev.contact, [field]: value }
    }));
  };

  const updateSectionTitle = (sectionIndex, value) => {
    setTempData(prev => ({
      ...prev,
      sections: prev.sections.map((section, index) =>
        index === sectionIndex ? { ...section, title: value } : section
      )
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
        className='bg-gray-900 border-t border-gray-800 relative'
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}>
        <div className='max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 lg:py-12 relative'>
          {/* Edit Toggle - positioned in top right */}
          <div className='absolute top-4 right-4 z-10'>
            {!isEditing ? (
              <Button
                onClick={handleEdit}
                className="bg-yellow-400 hover:bg-yellow-500 text-black"
                size='sm'
              >
                <Edit2 className='w-3 h-3 mr-1' />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  size='sm'
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                  ) : (
                    <Save className='w-3 h-3 mr-1' />
                  )}
                  {isSaving ? (isUploading ? 'Uploading...' : 'Saving...') : 'Save'}
                </Button>
                <Button
                  onClick={handleCancel}
                  className="bg-gray-600 hover:bg-gray-700 text-white"
                  size='sm'
                >
                  <X className='w-3 h-3 mr-1' />
                  Cancel
                </Button>
              </div>
            )}
          </div>
          
          {/* Main Footer Content */}
          <motion.div 
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 text-center md:text-left'
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Brand Section */}
            <motion.div 
              className='col-span-1 md:col-span-2 lg:col-span-1'
              variants={itemVariants}
            >
              <div className='flex items-center justify-center md:justify-start space-x-3 mb-4'>
                <span className='flex flex-row gap-2 text-xl font-bold text-red-500'>
                  <div className="relative">
                    <img
                      src={tempData.brand.logoUrl}
                      alt='Logo'
                      className='h-4 w-4 sm:h-6 sm:w-6 object-contain'
                      style={{
                        filter: isEditing ? "brightness(0.7)" : "none",
                      }}
                    />
                    {isEditing && (
                      <div className="absolute -bottom-14 left-0 bg-white/90 p-2 rounded shadow-lg">
                        <p className="text-xs mb-1 text-gray-600">Upload Logo:</p>
                        <motion.button
                          onClick={() => fileInputRef.current?.click()}
                          className='flex items-center gap-1 p-1 bg-gray-200 rounded shadow text-xs hover:bg-gray-300'
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
                      type='file'
                      ref={fileInputRef}
                      accept='image/*'
                      onChange={handleLogoUpload}
                      className='hidden'
                    />
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempData.brand.name}
                      onChange={(e) => updateBrand("name", e.target.value)}
                      placeholder="Brand name"
                      className="w-full p-1 border border-gray-600 rounded bg-gray-800 text-white text-sm"
                    />
                  ) : (
                    tempData.brand.name
                  )}
                </span>
              </div>

              {isEditing ? (
                <div className='mb-4'>
                  <label className='block text-xs text-gray-400 mb-1'>
                    Description:
                  </label>
                  <textarea
                    value={tempData.brand.description}
                    onChange={(e) => updateBrand("description", e.target.value)}
                    placeholder="Brand description"
                    className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white text-sm resize-none"
                    rows={3}
                  />
                </div>
              ) : (
                <p className='text-gray-300 text-sm leading-relaxed mb-6'>
                  {tempData.brand.description}
                </p>
              )}

            
            </motion.div>

            {/* Dynamic Sections */}
            {tempData.sections.map((section, sectionIndex) => (
              <motion.div 
                key={section.id} 
                className='col-span-1'
                variants={itemVariants}
              >
                <div className='flex items-center justify-center md:justify-start mb-4'>
                  {isEditing ? (
                    <div className="flex items-center w-full">
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => updateSectionTitle(sectionIndex, e.target.value)}
                        placeholder="Section title"
                        className="w-full p-1 border border-gray-600 rounded bg-gray-800 text-white text-sm font-semibold flex-1"
                      />
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
                    <h4 className='font-semibold text-white'>
                      {section.title}
                    </h4>
                  )}
                </div>

                <ul className='space-y-3 text-sm'>
                  {section.links.map((link) => (
                    <li key={link.id} className='flex items-center gap-2'>
                      {isEditing ? (
                        <div className='flex-1 space-y-1'>
                          <input
                            type="text"
                            value={link.text}
                            onChange={(e) => updateSectionLink(section.id, link.id, "text", e.target.value)}
                            placeholder="Link text"
                            className="w-full p-1 border border-gray-600 rounded bg-gray-800 text-white text-xs"
                          />
                          <input
                            type="text"
                            value={link.href}
                            onChange={(e) => updateSectionLink(section.id, link.id, "href", e.target.value)}
                            placeholder="Link URL"
                            className="w-full p-1 border border-gray-600 rounded bg-gray-800 text-white text-xs"
                          />
                        </div>
                      ) : (
                        <a
                          href={link.href}
                          className='text-gray-300 hover:text-blue-400 transition-colors duration-200 flex-1'
                        >
                          {link.text}
                        </a>
                      )}

                      {isEditing && (
                        <button
                          onClick={() => removeSectionLink(section.id, link.id)}
                          className='text-red-400 hover:text-red-300 p-1'
                        >
                          <Trash2 className='w-3 h-3' />
                        </button>
                      )}
                    </li>
                  ))}

                  {isEditing && (
                    <li>
                      <button
                        onClick={() => addSectionLink(section.id)}
                        className='text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm'
                      >
                        <Plus className='w-3 h-3' />
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
            <motion.div 
              className='col-span-1'
              variants={itemVariants}>
              <h4 className='font-semibold text-white mb-4'>Get in Touch</h4>

              {/* Contact Info */}
              <div className='space-y-3 mb-6 text-sm'>
                <div className='flex items-start justify-center md:justify-start space-x-3 text-gray-300'>
                  <Mail className='w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0' />
                  {isEditing ? (
                    <input
                      type="email"
                      value={tempData.contact.email}
                      onChange={(e) => updateContact("email", e.target.value)}
                      placeholder="Email address"
                      className="w-full p-1 border border-gray-600 rounded bg-gray-800 text-white text-xs flex-1"
                    />
                  ) : (
                    <span className="blur-[3px] select-none">{tempData.contact.email}</span>
                  )}
                </div>

                <div className='flex items-start justify-center md:justify-start space-x-3 text-gray-300'>
                  <Phone className='w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0' />
                  {isEditing ? (
                    <input
                      type="tel"
                      value={tempData.contact.phone}
                      onChange={(e) => updateContact("phone", e.target.value)}
                      placeholder="Phone number"
                      className="w-full p-1 border border-gray-600 rounded bg-gray-800 text-white text-xs flex-1"
                    />
                  ) : (
                    <span className="blur-[3px] select-none">{tempData.contact.phone}</span>
                  )}
                </div>

                <div className='flex items-start justify-center md:justify-start space-x-3 text-gray-300'>
                  <MapPin className='w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0' />
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempData.contact.address}
                      onChange={(e) => updateContact("address", e.target.value)}
                      placeholder="Address"
                      className="w-full p-1 border border-gray-600 rounded bg-gray-800 text-white text-xs flex-1"
                    />
                  ) : (
                    <span className="blur-[3px] select-none">{tempData.contact.address}</span>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.footer>
    </>
  );
}