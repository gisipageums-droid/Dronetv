import React, { useState } from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Edit,
  Save,
  X,
} from "lucide-react";

const Footer: React.FC = () => {
  const [editMode, setEditMode] = useState(false);

  const [footerContent, setFooterContent] = useState({
    eventName: "Drone Expo 2025",
    description:
      "Drone Expo is a leading drone technology platform enabling innovators, professionals, and companies to collaborate and grow globally.",
    quickLinksTitle: "Quick Links",
    quickLinks: [
      { name: "Home", href: "#home" },
      { name: "About", href: "#about" },
      { name: "Speakers", href: "#speakers" },
      { name: "Agenda", href: "#agenda" },
      { name: "Contact", href: "#contact" },
    ],
    socialLinks: [
      {
        icon: "Facebook",
        href: "https://www.facebook.com/DroneExpo.in/",
        label: "Facebook",
      },
      {
        icon: "Instagram",
        href: "https://www.instagram.com/droneexpo.in/",
        label: "Instagram",
      },
      {
        icon: "Linkedin",
        href: "https://www.linkedin.com/company/droneexpo",
        label: "LinkedIn",
      },
      {
        icon: "Youtube",
        href: "https://www.youtube.com/@droneexpo",
        label: "YouTube",
      },
    ],
  });

  const [backupContent, setBackupContent] = useState(footerContent);

  const handleEditToggle = () => {
    if (!editMode) {
      setBackupContent(footerContent);
    }
    setEditMode(!editMode);
  };

  const handleCancel = () => {
    setFooterContent(backupContent);
    setEditMode(false);
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
        <div className="absolute top-6 right-6 z-30 flex gap-3">
          {editMode ? (
            <>
              <button
                onClick={handleEditToggle}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                <Save size={18} /> Save
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
                <input
                  type="text"
                  value={footerContent.eventName}
                  onChange={(e) =>
                    setFooterContent({
                      ...footerContent,
                      eventName: e.target.value,
                    })
                  }
                  placeholder="Event Name"
                  className="bg-white text-black px-3 py-2 rounded-md text-2xl font-bold w-full"
                />
              ) : (
                <h2 className="text-2xl md:text-3xl font-bold text-[#FFD400] mb-4">
                  {footerContent.eventName}
                </h2>
              )}
            </div>

            {editMode ? (
              <textarea
                value={footerContent.description}
                onChange={(e) =>
                  setFooterContent({
                    ...footerContent,
                    description: e.target.value,
                  })
                }
                className="text-gray-400 mb-6 leading-relaxed bg-white text-black px-2 py-1 rounded-md w-full h-24"
              />
            ) : (
              <p className="text-gray-400 mb-6 leading-relaxed">
                {footerContent.description}
              </p>
            )}
          </div>

          {/* Quick Links */}
          <div>
            {editMode ? (
              <input
                type="text"
                value={footerContent.quickLinksTitle}
                onChange={(e) =>
                  setFooterContent({
                    ...footerContent,
                    quickLinksTitle: e.target.value,
                  })
                }
                className="text-xl font-bold mb-4 text-[#FFD400] bg-white text-black px-2 py-1 rounded-md"
              />
            ) : (
              <h3 className="text-xl font-bold mb-4 text-[#FFD400]">
                {footerContent.quickLinksTitle}
              </h3>
            )}
            <ul className="space-y-2">
              {footerContent.quickLinks.map((link, index) => (
                <li key={index}>
                  {editMode ? (
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={link.name}
                        onChange={(e) => {
                          const newQuickLinks = [...footerContent.quickLinks];
                          newQuickLinks[index] = {
                            ...link,
                            name: e.target.value,
                          };
                          setFooterContent({
                            ...footerContent,
                            quickLinks: newQuickLinks,
                          });
                        }}
                        className="bg-white text-black px-2 py-1 rounded-md text-sm flex-1"
                      />
                      <input
                        type="text"
                        value={link.href}
                        onChange={(e) => {
                          const newQuickLinks = [...footerContent.quickLinks];
                          newQuickLinks[index] = {
                            ...link,
                            href: e.target.value,
                          };
                          setFooterContent({
                            ...footerContent,
                            quickLinks: newQuickLinks,
                          });
                        }}
                        className="bg-white text-black px-2 py-1 rounded-md text-sm flex-1"
                      />
                    </div>
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

          {/* Newsletter
          <div>
            {editMode ? (
              <input
                type="text"
                value={footerContent.newsletterTitle}
                onChange={(e) =>
                  setFooterContent({ ...footerContent, newsletterTitle: e.target.value })
                }
                className="text-xl font-bold mb-4 text-[#FFD400] bg-white text-black px-2 py-1 rounded-md"
              />
            ) : (
              <h3 className="text-xl font-bold mb-4 text-[#FFD400]">
                {footerContent.newsletterTitle}
              </h3>
            )}
            {editMode ? (
              <textarea
                value={footerContent.newsletterDescription}
                onChange={(e) =>
                  setFooterContent({ ...footerContent, newsletterDescription: e.target.value })
                }
                className="text-gray-400 mb-4 bg-white text-black px-2 py-1 rounded-md w-full h-16"
              />
            ) : (
              <p className="text-gray-400 mb-4">
                {footerContent.newsletterDescription}
              </p>
            )}
            <div className="flex flex-col gap-3">
              {editMode ? (
                <input
                  type="text"
                  value={footerContent.emailPlaceholder}
                  onChange={(e) =>
                    setFooterContent({ ...footerContent, emailPlaceholder: e.target.value })
                  }
                  className="bg-white text-black px-2 py-1 rounded-md"
                />
              ) : (
                <input
                  type="email"
                  placeholder={footerContent.emailPlaceholder}
                  className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#FF0000] focus:border-transparent transition-all duration-300 text-white placeholder-gray-400"
                />
              )}
            </div>
          </div> */}

          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex gap-4">
              {footerContent.socialLinks.map((social, index) => (
                <div key={index} className="flex flex-col items-center">
                  {editMode ? (
                    <div className="flex gap-2 mb-2">
                      <select
                        value={social.icon}
                        onChange={(e) => {
                          const newSocialLinks = [...footerContent.socialLinks];
                          newSocialLinks[index] = {
                            ...social,
                            icon: e.target.value,
                          };
                          setFooterContent({
                            ...footerContent,
                            socialLinks: newSocialLinks,
                          });
                        }}
                        className="bg-white text-black px-2 py-1 rounded-md text-sm"
                      >
                        <option value="Facebook">Facebook</option>
                        <option value="Twitter">Twitter</option>
                        <option value="Instagram">Instagram</option>
                        <option value="Linkedin">LinkedIn</option>
                        <option value="Youtube">YouTube</option>
                      </select>
                      <input
                        type="text"
                        value={social.href}
                        onChange={(e) => {
                          const newSocialLinks = [...footerContent.socialLinks];
                          newSocialLinks[index] = {
                            ...social,
                            href: e.target.value,
                          };
                          setFooterContent({
                            ...footerContent,
                            socialLinks: newSocialLinks,
                          });
                        }}
                        placeholder="URL"
                        className="bg-white text-black px-2 py-1 rounded-md text-sm"
                      />
                      <input
                        type="text"
                        value={social.label}
                        onChange={(e) => {
                          const newSocialLinks = [...footerContent.socialLinks];
                          newSocialLinks[index] = {
                            ...social,
                            label: e.target.value,
                          };
                          setFooterContent({
                            ...footerContent,
                            socialLinks: newSocialLinks,
                          });
                        }}
                        placeholder="Label"
                        className="bg-white text-black px-2 py-1 rounded-md text-sm"
                      />
                    </div>
                  ) : (
                    <a
                      href={social.href}
                      aria-label={social.label}
                      className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#FF0000] transition-all duration-300 transform hover:scale-110"
                    >
                      {getSocialIcon(social.icon)}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
