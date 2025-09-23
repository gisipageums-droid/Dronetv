import {
  Edit2,
  Mail,
  MapPin,
  Phone,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "../components/ui/button";

export default function EditableFooter({ 
  content, 
  onStateChange, 
}) {
   // Initialize with data from props or use default structure
  const initialData = {
    brand: {
      name: content.name,
      description:
        "Innovative solutions for modern businesses. Transform your operations with our expert guidance and cutting-edge technology.",
      logoUrl: content.logo,
    },
    newsletter: {
      title: "Stay Updated",
      placeholder: "Enter your email",
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

  // Update state when content prop changes
  useEffect(() => {
    if (content) {
      setFooterData(content);
      setTempData(content);
    }
  }, [content]);

  // Notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(footerData);
    }
  }, [footerData, onStateChange]);

  const handleEdit = () => {
    setIsEditing(true);
    setTempData(footerData);
  };

  const handleCancel = () => {
    setTempData(footerData);
    setIsEditing(false);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setFooterData(tempData);
      setIsEditing(false);
      setIsSaving(false);
      toast.success('Footer saved successfully');
    }, 500);
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

  const EditableField = ({
    value,
    onChange,
    placeholder,
    multiline = false,
    className = "",
  }) => {
    if (multiline) {
      return (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full p-2 border border-gray-600 rounded bg-gray-800 text-white text-sm resize-none ${className}`}
          rows={3}
        />
      );
    }

    return (
      <input
        type='text'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full p-2 border border-gray-600 rounded bg-gray-800 text-white text-sm ${className}`}
      />
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <>
      {/* Footer Preview/Edit */}
      <motion.footer 
        className='bg-gray-900 border-t border-gray-800 relative'
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className='max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 relative'>
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
                  Save
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
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center md:text-left'
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Brand Section */}
            <motion.div 
              className='flex flex-col items-center md:items-start'
              variants={itemVariants}
            >
              <div className='flex items-center space-x-3 mb-6'>
                <span className='flex flex-row gap-2 text-xl font-bold text-red-500'>
                  <motion.img
                    src={tempData.brand.logoUrl}
                    alt='Logo'
                    className='h-6 w-6 object-contain'
                    // Entrance animation
                    initial={{ opacity: 0, scale: 0.5, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.8, type: "spring", stiffness: 120 }}
                    // Floating effect (infinite)
                    whileInView={{
                      y: [0, -4, 0],
                      transition: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                    }}
                    // Interactive hover & tap
                    whileHover={{
                      rotate: [0, -5, 5, -5, 0],
                      scale: 1.2,
                      boxShadow: "0px 0px 15px rgba(255, 215, 0, 0.6)",
                      transition: { duration: 0.5 },
                    }}
                    whileTap={{ scale: 0.9 }}
                  />
                  {isEditing ? (
                    <EditableField
                      value={tempData.brand.name}
                      onChange={(value) =>
                        updateNestedField("brand.name", value)
                      }
                      placeholder='Brand name'
                      className='bg-gray-800 border-gray-600'
                    />
                  ) : (
                    tempData.brand.name
                  )}
                </span>
              </div>

              {isEditing ? (
                <div className='mb-4'>
                  <label className='block text-xs text-gray-400 mb-1'>
                    Logo URL:
                  </label>
                  <EditableField
                    value={tempData.brand.logoUrl}
                    onChange={(value) =>
                      updateNestedField("brand.logoUrl", value)
                    }
                    placeholder='Logo URL'
                    className='mb-2'
                  />
                  <label className='block text-xs text-gray-400 mb-1'>
                    Description:
                  </label>
                  <EditableField
                    value={tempData.brand.description}
                    onChange={(value) =>
                      updateNestedField("brand.description", value)
                    }
                    placeholder='Brand description'
                    multiline={true}
                  />
                </div>
              ) : (
                <p className='text-gray-300 text-sm leading-relaxed mb-8 text-center md:text-left'>
                  {tempData.brand.description}
                </p>
              )}
            </motion.div>

            {/* Company Links */}
            {tempData.sections.map((section, sectionIndex) => (
              <motion.div 
                key={section.id} 
                className='flex flex-col items-center md:items-start'
                variants={itemVariants}
              >
                <div className='flex items-center justify-center md:justify-start mb-6'>
                  {isEditing ? (
                    <div className="flex items-center w-full">
                      <EditableField
                        value={section.title}
                        onChange={(value) => {
                          const newSections = [...tempData.sections];
                          newSections[sectionIndex] = {
                            ...newSections[sectionIndex],
                            title: value,
                          };
                          setTempData((prev) => ({
                            ...prev,
                            sections: newSections,
                          }));
                        }}
                        placeholder='Section title'
                        className='font-semibold text-white flex-1'
                      />
                    </div>
                  ) : (
                    <h4 className='font-semibold text-white'>
                      {section.title}
                    </h4>
                  )}
                </div>

                <ul className='space-y-4 text-sm'>
                  {section.links.map((link) => (
                    <li key={link.id} className='flex items-center gap-2'>
                      {isEditing ? (
                        <div className='flex-1 space-y-1'>
                          <EditableField
                            value={link.text}
                            onChange={(value) =>
                              updateSectionLink(
                                section.id,
                                link.id,
                                "text",
                                value
                              )
                            }
                            placeholder='Link text'
                            className='text-xs'
                          />
                          <EditableField
                            value={link.href}
                            onChange={(value) =>
                              updateSectionLink(
                                section.id,
                                link.id,
                                "href",
                                value
                              )
                            }
                            placeholder='Link URL'
                            className='text-xs'
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

            {/* Contact & Social Media */}
            <motion.div 
              className='flex flex-col items-center md:items-start md:col-span-2 lg:col-span-1'
              variants={itemVariants}
            >
              <h4 className='font-semibold text-white mb-6'>Get in Touch</h4>

              {/* Contact Info */}
              <div className='space-y-5 mb-10 text-sm'>
                <div className='flex items-start space-x-3 text-gray-300'>
                  <Mail className='w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0' />
                  {isEditing ? (
                    <EditableField
                      value={tempData.contact.email}
                      onChange={(value) =>
                        updateNestedField("contact.email", value)
                      }
                      placeholder='Email address'
                      className='flex-1 text-xs'
                    />
                  ) : (
                    <span className="blur-[3px] select-none">{tempData.contact.email}</span>
                  )}
                </div>

                <div className='flex items-start space-x-3 text-gray-300'>
                  <Phone className='w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0' />
                  {isEditing ? (
                    <EditableField
                      value={tempData.contact.phone}
                      onChange={(value) =>
                        updateNestedField("contact.phone", value)
                      }
                      placeholder='Phone number'
                      className='flex-1 text-xs'
                    />
                  ) : (
                    <span className="blur-[3px] select-none">{tempData.contact.phone}</span>
                  )}
                </div>

                <div className='flex items-start space-x-3 text-gray-300'>
                  <MapPin className='w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0' />
                  {isEditing ? (
                    <EditableField
                      value={tempData.contact.address}
                      onChange={(value) =>
                        updateNestedField("contact.address", value)
                      }
                      placeholder='Address'
                      className='flex-1 text-xs'
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