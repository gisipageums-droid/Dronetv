// Footer.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Code,
  Github,
  Linkedin,
  Mail,
  Heart,
  ArrowUp,
  Save,
  X,
  Edit,
} from "lucide-react";
import { toast } from "sonner";

export interface SocialLink {
  name: string;
  href: string;
  icon: "Github" | "Linkedin" | "Mail";
}

export interface LinkItem {
  href: string;
  label: string;
}

export interface NewsletterContent {
  title: string;
  description: string;
  placeholder: string;
  buttonText: string;
}

export interface BottomSectionContent {
  copyrightText: string;
  afterCopyrightText: string;
  privacyPolicy: LinkItem;
  termsOfService: LinkItem;
}

export interface FooterContent {
  personalInfo: {
    name: string;
    description: string;
  };
  socialLinks: SocialLink[];
  quickLinks: LinkItem[];
  moreLinks: LinkItem[];
  newsletter: NewsletterContent;
  bottomSection: BottomSectionContent;
}

interface FooterProps {
  content: FooterContent;
  onSave?: (content: FooterContent) => void;
}

const Footer: React.FC<FooterProps> = ({ content, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState<FooterContent>(content);
  const currentYear = new Date().getFullYear();

  const handleSave = () => {
    if (onSave) onSave(editedContent);
    toast.success("Footer updated successfully")
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedContent(content);
    toast.success("Cancel update")
    setIsEditing(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Github":
        return Github;
      case "Linkedin":
        return Linkedin;
      case "Mail":
        return Mail;
      default:
        return Github;
    }
  };

  const getIconColor = (iconName: string) => {
    switch (iconName) {
      case "Github":
        return "text-accent-yellow hover:bg-accent-yellow/20";
      case "Linkedin":
        return "text-accent-orange hover:bg-accent-orange/20";
      case "Mail":
        return "text-accent-red hover:bg-accent-red/20";
      default:
        return "text-accent-yellow hover:bg-accent-yellow/20";
    }
  };

  return (
    <footer className="bg-dark-300 border-t border-gray-200 dark:border-gray-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 relative z-10">
        {onSave && (
          <div className="absolute top-6 right-6 z-20 flex gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="p-3 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-md hover:shadow-lg transition-all"
                  title="Save updates"
                >
                  <Save className="w-5 h-5" />
                </button>
                <button
                  onClick={handleCancel}
                  className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md hover:shadow-lg transition-all"
                  title="Cancel updates"
                >
                  <X className="w-5 h-5" />
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="p-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-full shadow-md hover:shadow-lg transition-all"
                title="Edit footer section"
              >
                <Edit className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Info Section */}
          <div className="col-span-1 lg:col-span-2">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center space-x-2 mb-4"
            >
              <Code className="w-8 h-8 text-orange-400" />
              {isEditing ? (
                <input
                  type="text"
                  value={editedContent.personalInfo.name}
                  onChange={(e) =>
                    setEditedContent({
                      ...editedContent,
                      personalInfo: {
                        ...editedContent.personalInfo,
                        name: e.target.value,
                      },
                    })
                  }
                  className="text-2xl font-bold text-blue-500 dark:text-orange-500 bg-transparent border-b border-orange-400 focus:outline-none"
                />
              ) : (
                <span className="text-2xl font-bold text-blue-500 dark:text-orange-500">
                  {content.personalInfo.name}
                </span>
              )}
            </motion.div>

            {isEditing ? (
              <textarea
                value={editedContent.personalInfo.description}
                onChange={(e) =>
                  setEditedContent({
                    ...editedContent,
                    personalInfo: {
                      ...editedContent.personalInfo,
                      description: e.target.value,
                    },
                  })
                }
                className="w-full bg-gray-800 border border-gray-700 text-gray-300 rounded-lg p-3 focus:border-orange-500 focus:outline-none mb-6 resize-none"
                rows={3}
              />
            ) : (
              <p className="text-gray-400 mb-6 leading-relaxed max-w-md">
                {content.personalInfo.description}
              </p>
            )}

            {/* Social Links */}
            <div className="flex space-x-4">
              {editedContent.socialLinks.map((link, index) => {
                const IconComponent = getIconComponent(link.icon);
                const colorClass = getIconColor(link.icon);
                return (
                  <motion.div
                    key={index}
                    whileHover={{ y: -2, scale: 1.1 }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center bg-gray-800 ${colorClass}`}
                  >
                    {isEditing ? (
                      <div className="relative group w-full h-full flex items-center justify-center">
                        <IconComponent className="w-5 h-5" />
                        <input
                          type="text"
                          value={link.href}
                          onChange={(e) => {
                            const newSocialLinks = [
                              ...editedContent.socialLinks,
                            ];
                            newSocialLinks[index] = {
                              ...link,
                              href: e.target.value,
                            };
                            setEditedContent({
                              ...editedContent,
                              socialLinks: newSocialLinks,
                            });
                          }}
                          className="absolute top-12 left-1/2 -translate-x-1/2 w-32 text-xs bg-gray-900 text-white border border-gray-700 rounded p-1 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                          placeholder="URL"
                        />
                      </div>
                    ) : (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <IconComponent className="w-5 h-5" />
                      </a>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-700 dark:text-white font-semibold mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {editedContent.quickLinks.map((link, index) => (
                <li key={index}>
                  {isEditing ? (
                    <div className="flex flex-col gap-1 mb-2">
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => {
                          const newQuickLinks = [...editedContent.quickLinks];
                          newQuickLinks[index].label = e.target.value;
                          setEditedContent({
                            ...editedContent,
                            quickLinks: newQuickLinks,
                          });
                        }}
                        className="px-2 py-1 text-sm bg-gray-800 border border-gray-700 rounded text-gray-300 focus:border-orange-500"
                        placeholder="Label"
                      />
                      <input
                        type="text"
                        value={link.href}
                        onChange={(e) => {
                          const newQuickLinks = [...editedContent.quickLinks];
                          newQuickLinks[index].href = e.target.value;
                          setEditedContent({
                            ...editedContent,
                            quickLinks: newQuickLinks,
                          });
                        }}
                        className="px-2 py-1 text-sm bg-gray-800 border border-gray-700 rounded text-gray-300 focus:border-orange-500"
                        placeholder="#section"
                      />
                    </div>
                  ) : (
                    <motion.button
                      whileHover={{ x: 5 }}
                      onClick={() => scrollToSection(link.href)}
                      className="text-gray-400 hover:text-accent-orange transition"
                    >
                      {link.label}
                    </motion.button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* More + Newsletter */}
          <div>
            <h3 className="text-gray-700 dark:text-white font-semibold mb-4">
              More
            </h3>
            <ul className="space-y-2 mb-6">
              {editedContent.moreLinks.map((link, index) => (
                <li key={index}>
                  {isEditing ? (
                    <div className="flex flex-col gap-1 mb-2">
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => {
                          const newMoreLinks = [...editedContent.moreLinks];
                          newMoreLinks[index].label = e.target.value;
                          setEditedContent({
                            ...editedContent,
                            moreLinks: newMoreLinks,
                          });
                        }}
                        className="px-2 py-1 text-sm bg-gray-800 border border-gray-700 rounded text-gray-300 focus:border-orange-500"
                        placeholder="Label"
                      />
                      <input
                        type="text"
                        value={link.href}
                        onChange={(e) => {
                          const newMoreLinks = [...editedContent.moreLinks];
                          newMoreLinks[index].href = e.target.value;
                          setEditedContent({
                            ...editedContent,
                            moreLinks: newMoreLinks,
                          });
                        }}
                        className="px-2 py-1 text-sm bg-gray-800 border border-gray-700 rounded text-gray-300 focus:border-orange-500"
                        placeholder="#section"
                      />
                    </div>
                  ) : (
                    <motion.button
                      whileHover={{ x: 5 }}
                      onClick={() => scrollToSection(link.href)}
                      className="text-gray-400 hover:text-accent-orange transition"
                    >
                      {link.label}
                    </motion.button>
                  )}
                </li>
              ))}
            </ul>

            {/* Newsletter */}
            <div className="border-t border-gray-700 pt-4">
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editedContent.newsletter.title}
                    onChange={(e) =>
                      setEditedContent({
                        ...editedContent,
                        newsletter: {
                          ...editedContent.newsletter,
                          title: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-300 text-sm focus:border-orange-500"
                    placeholder="Newsletter Title"
                  />
                  <textarea
                    value={editedContent.newsletter.description}
                    onChange={(e) =>
                      setEditedContent({
                        ...editedContent,
                        newsletter: {
                          ...editedContent.newsletter,
                          description: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-300 text-sm focus:border-orange-500"
                    placeholder="Description"
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editedContent.newsletter.placeholder}
                      onChange={(e) =>
                        setEditedContent({
                          ...editedContent,
                          newsletter: {
                            ...editedContent.newsletter,
                            placeholder: e.target.value,
                          },
                        })
                      }
                      className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-300 text-sm focus:border-orange-500"
                      placeholder="Input Placeholder"
                    />
                    <input
                      type="text"
                      value={editedContent.newsletter.buttonText}
                      onChange={(e) =>
                        setEditedContent({
                          ...editedContent,
                          newsletter: {
                            ...editedContent.newsletter,
                            buttonText: e.target.value,
                          },
                        })
                      }
                      className="w-28 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-300 text-sm focus:border-orange-500"
                      placeholder="Button Text"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h4 className="text-gray-700 dark:text-white font-medium mb-2">
                    {content.newsletter.title}
                  </h4>
                  <p className="text-gray-400 text-sm mb-3">
                    {content.newsletter.description}
                  </p>
                  <div className="flex">
                    <input
                      type="email"
                      placeholder={content.newsletter.placeholder}
                      className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-gray-300 text-sm focus:border-orange-500"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-orange-400 text-white rounded-r-lg text-sm font-medium hover:shadow-lg"
                    >
                      {content.newsletter.buttonText}
                    </motion.button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-700 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center text-center md:text-left">
            © {currentYear}{" "}
            {isEditing ? (
              <input
                type="text"
                value={editedContent.personalInfo.name}
                onChange={(e) =>
                  setEditedContent({
                    ...editedContent,
                    personalInfo: {
                      ...editedContent.personalInfo,
                      name: e.target.value,
                    },
                  })
                }
                className="bg-transparent border-b border-gray-500 focus:border-orange-500 ml-1 px-1 text-gray-200 focus:outline-none"
              />
            ) : (
              <span className="mx-1">{content.personalInfo.name}</span>
            )}
            . {content.bottomSection.copyrightText}
            <Heart className="w-4 h-4 mx-1 text-accent-red fill-current" />
            {isEditing ? (
              <input
                type="text"
                value={editedContent.bottomSection.afterCopyrightText}
                onChange={(e) =>
                  setEditedContent({
                    ...editedContent,
                    bottomSection: {
                      ...editedContent.bottomSection,
                      afterCopyrightText: e.target.value,
                    },
                  })
                }
                className="bg-transparent border-b border-gray-500 focus:border-orange-500 ml-1 px-1 text-gray-200 focus:outline-none"
              />
            ) : (
              <span>{content.bottomSection.afterCopyrightText}</span>
            )}
          </div>

          <div className="flex items-center gap-6">
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={editedContent.bottomSection.privacyPolicy.label}
                  onChange={(e) =>
                    setEditedContent({
                      ...editedContent,
                      bottomSection: {
                        ...editedContent.bottomSection,
                        privacyPolicy: {
                          ...editedContent.bottomSection.privacyPolicy,
                          label: e.target.value,
                        },
                      },
                    })
                  }
                  className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-gray-300 text-sm focus:border-orange-500"
                />
                <input
                  type="text"
                  value={editedContent.bottomSection.termsOfService.label}
                  onChange={(e) =>
                    setEditedContent({
                      ...editedContent,
                      bottomSection: {
                        ...editedContent.bottomSection,
                        termsOfService: {
                          ...editedContent.bottomSection.termsOfService,
                          label: e.target.value,
                        },
                      },
                    })
                  }
                  className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-gray-300 text-sm focus:border-orange-500"
                />
              </>
            ) : (
              <>
                <motion.a
                  whileHover={{ y: -1 }}
                  href={content.bottomSection.privacyPolicy.href}
                  className="hover:text-accent-orange transition"
                >
                  {content.bottomSection.privacyPolicy.label}
                </motion.a>
                <motion.a
                  whileHover={{ y: -1 }}
                  href={content.bottomSection.termsOfService.href}
                  className="hover:text-accent-orange transition"
                >
                  {content.bottomSection.termsOfService.label}
                </motion.a>
              </>
            )}

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={scrollToTop}
              className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center text-black hover:shadow-lg animate-bounce"
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark-400 to-transparent opacity-40 pointer-events-none" />
    </footer>
  );
};

export default Footer;
