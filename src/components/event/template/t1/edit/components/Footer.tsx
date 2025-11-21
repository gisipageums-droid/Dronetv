import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
} from "lucide-react";

interface QuickLink {
  name: string;
  href: string;
}

interface SocialLink {
  icon: string;
  href: string;
  label: string;
}

interface FooterContent {
  eventName: string;
  description: string;
  quickLinksTitle: string;
  quickLinks: QuickLink[];
  socialLinks: SocialLink[];
}

interface FooterProps {
  footerData?: FooterContent;
  onStateChange?: (data: FooterContent) => void;
}

/** Default data structure */
const defaultFooterContent: FooterContent = {
  eventName: "demo Event",
  description: "Event description",
  quickLinksTitle: "Quick Links",
  quickLinks: [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Speakers", href: "#speakers" },
    { name: "Agenda", href: "#agenda" },
    { name: "Contact", href: "#contact" },
  ],
  socialLinks: [
    { icon: "Facebook", href: "https://facebook.com", label: "Facebook" },
    { icon: "Instagram", href: "https://instagram.com", label: "Instagram" },
    { icon: "Linkedin", href: "https://linkedin.com", label: "LinkedIn" },
    { icon: "Youtube", href: "https://youtube.com", label: "YouTube" },
  ],
};

const Footer: React.FC<FooterProps> = ({ footerData, onStateChange }) => {
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [footerContent, setFooterContent] =
    useState<FooterContent>(defaultFooterContent);
  const [backupContent, setBackupContent] =
    useState<FooterContent>(defaultFooterContent);

  // Auto-save timeout reference
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();

  // Update local state when prop data changes
  useEffect(() => {
    if (footerData) {
      setFooterContent(footerData);
      setBackupContent(footerData);
    }
  }, [footerData]);

  // Auto-save function
  const autoSave = useCallback(async () => {
    if (!onStateChange || !editMode) return;

    setIsSaving(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    onStateChange(footerContent);
    setLastSaved(new Date());
    setIsSaving(false);
  }, [footerContent, editMode, onStateChange]);

  // Debounced auto-save effect
  useEffect(() => {
    if (editMode && onStateChange) {
      // Clear existing timeout
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      // Set new timeout for auto-save (1 second debounce)
      autoSaveTimeoutRef.current = setTimeout(() => {
        autoSave();
      }, 1000);

      // Cleanup timeout on unmount or when dependencies change
      return () => {
        if (autoSaveTimeoutRef.current) {
          clearTimeout(autoSaveTimeoutRef.current);
        }
      };
    }
  }, [footerContent, editMode, autoSave, onStateChange]);

  const handleEditToggle = () => {
    if (!editMode) {
      setBackupContent(footerContent);
    }
    setEditMode(!editMode);
  };

  const handleCancel = () => {
    setFooterContent(backupContent);
    if (onStateChange) {
      onStateChange(backupContent); // Sync with parent
    }
    setEditMode(false);
  };

  // Update header fields
  const updateHeaderField = (
    field: keyof Pick<
      FooterContent,
      "eventName" | "description" | "quickLinksTitle"
    >,
    value: string
  ) => {
    setFooterContent((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Update quick link
  const updateQuickLink = (
    index: number,
    field: keyof QuickLink,
    value: string
  ) => {
    const newQuickLinks = [...footerContent.quickLinks];
    newQuickLinks[index] = {
      ...newQuickLinks[index],
      [field]: value,
    };
    setFooterContent((prev) => ({
      ...prev,
      quickLinks: newQuickLinks,
    }));
  };

  // Update social link
  const updateSocialLink = (
    index: number,
    field: keyof SocialLink,
    value: string
  ) => {
    const newSocialLinks = [...footerContent.socialLinks];
    newSocialLinks[index] = {
      ...newSocialLinks[index],
      [field]: value,
    };
    setFooterContent((prev) => ({
      ...prev,
      socialLinks: newSocialLinks,
    }));
  };

  // Add new quick link
  const addQuickLink = () => {
    const newQuickLink: QuickLink = { name: "New Link", href: "#" };
    const updatedContent = {
      ...footerContent,
      quickLinks: [...footerContent.quickLinks, newQuickLink],
    };
    setFooterContent(updatedContent);
  };

  // Remove quick link
  const removeQuickLink = (index: number) => {
    const updatedQuickLinks = footerContent.quickLinks.filter(
      (_, i) => i !== index
    );
    const updatedContent = {
      ...footerContent,
      quickLinks: updatedQuickLinks,
    };
    setFooterContent(updatedContent);
  };

  // Add new social link
  const addSocialLink = () => {
    const newSocialLink: SocialLink = {
      icon: "Facebook",
      href: "https://",
      label: "Social Media",
    };
    const updatedContent = {
      ...footerContent,
      socialLinks: [...footerContent.socialLinks, newSocialLink],
    };
    setFooterContent(updatedContent);
  };

  // Remove social link
  const removeSocialLink = (index: number) => {
    const updatedSocialLinks = footerContent.socialLinks.filter(
      (_, i) => i !== index
    );
    const updatedContent = {
      ...footerContent,
      socialLinks: updatedSocialLinks,
    };
    setFooterContent(updatedContent);
  };

  const getSocialIcon = (iconName: string) => {
    switch (iconName) {
      case "Facebook":
        return <Facebook size={20} />;
      case "Twitter":
        return <Twitter size={20} />;
      case "Instagram":
        return <Instagram size={20} />;
      case "Linkedin":
        return <Linkedin size={20} />;
      case "Youtube":
        return <Youtube size={20} />;
      default:
        return <Facebook size={20} />;
    }
  };

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-black text-white relative">
      <div className="container mx-auto px-4 py-16">
        {/* Edit/Save/Cancel Buttons */}
        <div className="absolute top-6 right-6 z-30 flex gap-3 items-center">
          {/* Auto-save status */}
          {editMode && onStateChange && (
            <div className="text-sm text-gray-400 mr-2 bg-gray-800 px-3 py-1 rounded-lg hidden sm:block">
              {isSaving ? (
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  Saving...
                </span>
              ) : lastSaved ? (
                <span>Auto-saved {lastSaved.toLocaleTimeString()}</span>
              ) : null}
            </div>
          )}

          {editMode ? (
            <>
              <button
                onClick={handleEditToggle}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                <Save size={18} /> Done
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                <X size={18} /> Cancel
              </button>
            </>
          ) : (
            <button
              onClick={handleEditToggle}
              className="flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-lg border border-white/30 hover:bg-white/30 transition"
            >
              <Edit size={18} /> Edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Event Info */}
          <div className="md:col-span-2">
            <div className="mb-6">
              {editMode ? (
                <div>
                  <input
                    type="text"
                    value={footerContent.eventName}
                    onChange={(e) =>
                      updateHeaderField("eventName", e.target.value)
                    }
                    maxLength={50}
                    placeholder="Event Name"
                    className="bg-white text-black px-3 py-2 rounded-md text-2xl font-bold w-full"
                  />
                  <div className="text-xs text-gray-500 text-right mt-1">
                    {footerContent.eventName.length}/50
                  </div>
                </div>
              ) : (
                <h2 className="text-2xl md:text-3xl font-bold text-[#FFD400] mb-4">
                  {footerContent.eventName}
                </h2>
              )}
            </div>

            {editMode ? (
              <div>
                <textarea
                  value={footerContent.description}
                  onChange={(e) =>
                    updateHeaderField("description", e.target.value)
                  }
                  maxLength={200}
                  className="mb-6 leading-relaxed bg-white text-black px-3 py-2 rounded-md w-full h-24 resize-y"
                  placeholder="Event description"
                />
                <div className="text-xs text-gray-500 text-right mt-1">
                  {footerContent.description.length}/200
                </div>
              </div>
            ) : (
              <p className="text-gray-400 mb-6 leading-relaxed">
                {footerContent.description}
              </p>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              {editMode ? (
                <div className="flex-1">
                  <input
                    type="text"
                    value={footerContent.quickLinksTitle}
                    onChange={(e) =>
                      updateHeaderField("quickLinksTitle", e.target.value)
                    }
                    maxLength={50}
                    className="text-xl font-bold bg-white text-black px-2 py-1 rounded-md w-full"
                  />
                  <div className="text-xs text-gray-500 text-right mt-1">
                    {footerContent.quickLinksTitle.length}/50
                  </div>
                </div>
              ) : (
                <h3 className="text-xl font-bold text-[#FFD400]">
                  {footerContent.quickLinksTitle}
                </h3>
              )}
              {editMode && (
                <button
                  onClick={addQuickLink}
                  className="flex items-center gap-1 bg-blue-600 text-white px-2 py-1 rounded-md text-sm hover:bg-blue-700 transition"
                >
                  <Plus size={14} /> Add
                </button>
              )}
            </div>

            <ul className="space-y-2">
              {footerContent.quickLinks.map((link, index) => (
                <li key={index} className="flex items-center gap-2">
                  {editMode ? (
                    <>
                      <div className="flex gap-2 flex-1">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={link.name}
                            onChange={(e) =>
                              updateQuickLink(index, "name", e.target.value)
                            }
                            maxLength={50}
                            className="bg-white text-black px-2 py-1 rounded-md text-sm w-full"
                            placeholder="Link Name"
                          />
                          <div className="text-xs text-gray-500 text-right mt-1">
                            {link.name.length}/50
                          </div>
                        </div>
                        <div className="flex-1">
                          <input
                            type="text"
                            value={link.href}
                            onChange={(e) =>
                              updateQuickLink(index, "href", e.target.value)
                            }
                            maxLength={200}
                            className="bg-white text-black px-2 py-1 rounded-md text-sm w-full"
                            placeholder="Link URL"
                          />
                          <div className="text-xs text-gray-500 text-right mt-1">
                            {link.href.length}/200
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeQuickLink(index)}
                        className="p-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                        title="Remove Link"
                      >
                        <Trash2 size={14} />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="text-gray-400 hover:text-[#FFD400] transition-all duration-300 hover:translate-x-1 transform inline-block"
                    >
                      {link.name}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Links Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row items-center gap-4 w-full">
              <div className="flex items-center gap-2 mb-4 md:mb-0">
                <span className="text-gray-400">Follow us:</span>
                {editMode && (
                  <button
                    onClick={addSocialLink}
                    className="flex items-center gap-1 bg-blue-600 text-white px-2 py-1 rounded-md text-sm hover:bg-blue-700 transition"
                  >
                    <Plus size={14} /> Add Social
                  </button>
                )}
              </div>

              <div className="flex gap-4 flex-wrap">
                {footerContent.socialLinks.map((social, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center relative"
                  >
                    {editMode ? (
                      <div className="flex gap-2 mb-2 p-2 bg-gray-800 rounded-lg">
                        <select
                          value={social.icon}
                          onChange={(e) =>
                            updateSocialLink(index, "icon", e.target.value)
                          }
                          className="bg-white text-black px-2 py-1 rounded-md text-sm"
                        >
                          <option value="Facebook">Facebook</option>
                          <option value="Twitter">Twitter</option>
                          <option value="Instagram">Instagram</option>
                          <option value="Linkedin">LinkedIn</option>
                          <option value="Youtube">YouTube</option>
                        </select>
                        <div>
                          <input
                            type="text"
                            value={social.href}
                            onChange={(e) =>
                              updateSocialLink(index, "href", e.target.value)
                            }
                            maxLength={200}
                            placeholder="URL"
                            className="bg-white text-black px-2 py-1 rounded-md text-sm"
                          />
                          <div className="text-xs text-gray-500 text-right mt-1">
                            {social.href.length}/200
                          </div>
                        </div>
                        <div>
                          <input
                            type="text"
                            value={social.label}
                            onChange={(e) =>
                              updateSocialLink(index, "label", e.target.value)
                            }
                            maxLength={50}
                            placeholder="Label"
                            className="bg-white text-black px-2 py-1 rounded-md text-sm"
                          />
                          <div className="text-xs text-gray-500 text-right mt-1">
                            {social.label.length}/50
                          </div>
                        </div>
                        <button
                          onClick={() => removeSocialLink(index)}
                          className="p-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                          title="Remove Social Link"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ) : (
                      <a
                        href={social.href}
                        aria-label={social.label}
                        className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#FF0000] transition-all duration-300 transform hover:scale-110"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {getSocialIcon(social.icon)}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>
              © {new Date().getFullYear()} {footerContent.eventName}. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
