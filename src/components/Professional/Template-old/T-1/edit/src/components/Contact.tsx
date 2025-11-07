import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Send,
  Mail,
  Phone,
  MapPin,
  Github as GithubIcon,
  Linkedin,
  Twitter as TwitterIcon,
  CheckCircle,
  AlertCircle,
  Edit,
  Save,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface SocialLink {
  icon: string;
  label: string;
  href: string;
  color: string;
}

export interface ContactContent {
  subtitle: string;
  heading: string;
  description: string;
  socialLinks: SocialLink[];
}

interface ContactProps {
  content: ContactContent;
  onSave: (updatedContent: ContactContent) => void;
}

const defaultContent: ContactContent = {
  subtitle: "get in touch with me",
  heading: "Let's Work Together",
  description:
    "I'm always open to discussing new opportunities and creative projects. Let's bring your ideas to life!",
  socialLinks: [
    {
      icon: "Github",
      label: "GitHub",
      href: "https://github.com/johndoe",
      color: "hover:bg-gray-900 hover:text-white",
    },
    {
      icon: "Linkedin",
      label: "LinkedIn",
      href: "https://linkedin.com/in/johndoe",
      color: "hover:bg-blue-600 hover:text-white",
    },
    {
      icon: "Twitter",
      label: "Twitter",
      href: "https://twitter.com/johndoe",
      color: "hover:bg-blue-400 hover:text-white",
    },
  ],
};

const Contact: React.FC<ContactProps> = ({ content, onSave }) => {
  const [contactContent, setContactContent] =
    useState<ContactContent>(defaultContent);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSectionEditing, setIsSectionEditing] = useState(false);

  // Character limits
  const CHAR_LIMITS = {
    heading: 100,
    description: 500,
    contactLabel: 50,
    contactValue: 100,
    contactHref: 500,
    socialLabel: 50,
    socialHref: 500,
    availabilityMessage: 100,
    availabilityResponseTime: 100,
    formName: 100,
    formEmail: 100,
    formPhone: 100,
    formSubject: 100,
    formMessage: 2000,
  };

  const iconMap: {
    [key: string]: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  } = {
    Mail,
    Phone,
    MapPin,
    Github: GithubIcon,
    Linkedin,
    Twitter: TwitterIcon,
  };

  // Sync local content with parent prop
  useEffect(() => {
    if (content) {
      setContactContent(content);
    }
  }, [content]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const getCharCountColor = (current: number, max: number) => {
    if (current >= max) return "text-red-500";
    if (current >= max * 0.9) return "text-yellow-500";
    return "text-gray-500";
  };

  const handleContentChange = (
    field: keyof ContactContent,
    value: string | SocialLink[]
  ) => {
    const updated = { ...contactContent, [field]: value };
    setContactContent(updated);
  };

  const handleSocialLinkChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedSocialLinks = [...contactContent.socialLinks];
    updatedSocialLinks[index] = {
      ...updatedSocialLinks[index],
      [field]: value,
    };
    handleContentChange("socialLinks", updatedSocialLinks);
  };

  const handleAddSocialLink = () => {
    const newSocialLink: SocialLink = {
      icon: "Github",
      label: "New Social",
      href: "#",
      color: "hover:bg-gray-900 hover:text-white",
    };
    handleContentChange("socialLinks", [
      ...contactContent.socialLinks,
      newSocialLink,
    ]);
  };

  const handleRemoveSocialLink = (index: number) => {
    const updated = contactContent.socialLinks.filter((_, i) => i !== index);
    handleContentChange("socialLinks", updated);
  };

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "", phone: "" });
    } catch (error) {
      console.log(error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus("idle"), 5000);
    }
  };

  const handleSaveSection = () => {
    onSave(contactContent);
    setIsEditMode(false);
    setIsSectionEditing(false);
    toast.success("Contact section saved successfully!");
  };

  const handleCancelEdit = () => {
    setContactContent(content); // revert to original content
    setIsEditMode(false);
    setIsSectionEditing(false);
    toast.info("Changes discarded");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <section
      id="contact"
      className="py-20 transition-colors duration-300 bg-gray-50 dark:bg-gray-900"
    >
      <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Edit Mode Buttons */}
        <div className="absolute top-0 right-0 px-4 py-2 flex items-center gap-2">
          {isEditMode ? (
            <>
              <button
                onClick={handleSaveSection}
                className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors shadow-lg"
                title="Save Changes"
              >
                <Save className="w-6 h-6" />
              </button>
              <button
                onClick={handleCancelEdit}
                className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                title="Cancel Editing"
              >
                <X className="w-6 h-6" />
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setIsEditMode(true);
                setIsSectionEditing(true);
              }}
              className="p-3 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors shadow-lg"
              title="Edit Contact"
            >
              <Edit className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
          )}
        </div>

        {/* Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-16 text-center">
            {isSectionEditing ? (
              <div className="space-y-4">
                <div className="space-y-1">
                  <input
                    type="text"
                    value={contactContent.heading}
                    onChange={(e) =>
                      handleContentChange("heading", e.target.value)
                    }
                    maxLength={CHAR_LIMITS.heading}
                    className="w-full max-w-2xl p-2 mx-auto text-4xl font-bold text-gray-800 bg-gray-100 border-2 rounded-lg lg:text-5xl dark:bg-gray-800 dark:text-gray-100 focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none"
                    placeholder="Section heading"
                  />
                  <div
                    className={`text-sm text-right max-w-2xl mx-auto ${getCharCountColor(
                      contactContent.heading.length,
                      CHAR_LIMITS.heading
                    )}`}
                  >
                    {contactContent.heading.length}/{CHAR_LIMITS.heading}
                  </div>
                </div>
                <div className="space-y-1">
                  <textarea
                    value={contactContent.description}
                    onChange={(e) =>
                      handleContentChange("description", e.target.value)
                    }
                    maxLength={CHAR_LIMITS.description}
                    className="w-full max-w-3xl p-2 mx-auto text-xl text-gray-600 bg-gray-100 border-2 rounded-lg resize-none dark:bg-gray-800 dark:text-gray-300 focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none"
                    rows={2}
                    placeholder="Section description"
                  />
                  <div
                    className={`text-sm text-right max-w-3xl mx-auto ${getCharCountColor(
                      contactContent.description.length,
                      CHAR_LIMITS.description
                    )}`}
                  >
                    {contactContent.description.length}/
                    {CHAR_LIMITS.description}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <h2 className="mb-4 text-4xl font-bold text-gray-800 lg:text-5xl dark:text-gray-100">
                  {contactContent.heading.split(" ").slice(0, -1).join(" ")}{" "}
                  <span className="text-orange-500">
                    {contactContent.heading.split(" ").slice(-1)}
                  </span>
                </h2>
                <p className="max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-300">
                  {contactContent.description}
                </p>
              </>
            )}
          </motion.div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <motion.div variants={itemVariants}>
              <div className="p-8 transition-colors duration-300 bg-white border border-gray-200 dark:bg-gray-800 backdrop-blur-sm rounded-2xl dark:border-gray-700">
                <h3 className="mb-6 text-2xl font-bold text-orange-500">
                  Send Me a Message
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-1">
                      <label
                        htmlFor="name"
                        className="block mb-2 font-medium text-gray-700 dark:text-gray-300"
                      >
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        maxLength={CHAR_LIMITS.formName}
                        required
                        className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 transition-all duration-200 bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none"
                        placeholder="John Doe"
                      />
                      <div
                        className={`text-xs text-right ${getCharCountColor(
                          formData.name.length,
                          CHAR_LIMITS.formName
                        )}`}
                      >
                        {formData.name.length}/{CHAR_LIMITS.formName}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="email"
                        className="block mb-2 font-medium text-gray-700 dark:text-gray-300"
                      >
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        maxLength={CHAR_LIMITS.formEmail}
                        required
                        className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 transition-all duration-200 bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none"
                        placeholder="john@example.com"
                      />
                      <div
                        className={`text-xs text-right ${getCharCountColor(
                          formData.email.length,
                          CHAR_LIMITS.formEmail
                        )}`}
                      >
                        {formData.email.length}/{CHAR_LIMITS.formEmail}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-1">
                      <label
                        htmlFor="email"
                        className="block mb-2 font-medium text-gray-700 dark:text-gray-300"
                      >
                        Phone No *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleFormChange}
                        maxLength={CHAR_LIMITS.formPhone}
                        required
                        className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 transition-all duration-200 bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none"
                        placeholder="Phone no"
                      />
                      <div
                        className={`text-xs text-right ${getCharCountColor(
                          formData.phone.length,
                          CHAR_LIMITS.formPhone
                        )}`}
                      >
                        {formData.phone.length}/{CHAR_LIMITS.formPhone}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="subject"
                        className="block mb-2 font-medium text-gray-700 dark:text-gray-300"
                      >
                        Subject *
                      </label>

                      <select
                        name="subject"
                        id="subject"
                        value={formData.subject}
                        onChange={handleFormChange}
                        required
                        className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 transition-all duration-200 bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none"
                      >
                        <option>General Inquiry</option>
                        <option>Sales Inquiry</option>
                        <option>Products Inquiry</option>
                        <option>Services Inquiry</option>
                        <option>Support Inquiry</option>
                      </select>
                      <div
                        className={`text-xs text-right ${getCharCountColor(
                          formData.subject.length,
                          CHAR_LIMITS.formSubject
                        )}`}
                      >
                        {formData.subject.length}/{CHAR_LIMITS.formSubject}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="message"
                      className="block mb-2 font-medium text-gray-700 dark:text-gray-300"
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleFormChange}
                      maxLength={CHAR_LIMITS.formMessage}
                      required
                      rows={5}
                      className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 transition-all duration-200 bg-gray-100 border border-gray-300 rounded-lg resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none"
                      placeholder="Tell me about your project..."
                    />
                    <div
                      className={`text-xs text-right ${getCharCountColor(
                        formData.message.length,
                        CHAR_LIMITS.formMessage
                      )}`}
                    >
                      {formData.message.length}/{CHAR_LIMITS.formMessage}
                    </div>
                  </div>

                  {/* Submit Status */}
                  {submitStatus !== "idle" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex items-center p-4 rounded-lg ${
                        submitStatus === "success"
                          ? "bg-green-100 dark:bg-green-500/20 border border-green-400 dark:border-green-500/30 text-green-700 dark:text-green-400"
                          : "bg-red-100 dark:bg-red-500/20 border border-red-400 dark:border-red-500/30 text-red-700 dark:text-red-400"
                      }`}
                    >
                      {submitStatus === "success" ? (
                        <CheckCircle className="w-5 h-5 mr-2" />
                      ) : (
                        <AlertCircle className="w-5 h-5 mr-2" />
                      )}
                      <span>
                        {submitStatus === "success"
                          ? "Message sent successfully! I'll get back to you soon."
                          : "Failed to send message. Please try again."}
                      </span>
                    </motion.div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center justify-center w-full px-6 py-4 font-semibold text-white transition-all duration-200 bg-orange-500 rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-5 h-5 mr-2 border-2 border-black rounded-full border-t-transparent"
                      />
                    ) : (
                      <Send className="w-5 h-5 mr-2" />
                    )}
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </motion.button>
                </form>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div variants={itemVariants} className="space-y-8">
              {/* Social Links */}
              <div className="p-8 transition-colors duration-300 bg-gray-100 border border-gray-200 dark:bg-white/5 backdrop-blur-sm rounded-2xl dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Follow Me
                  </h3>
                  {isEditMode && (
                    <button
                      onClick={handleAddSocialLink}
                      className="px-3 py-1 text-sm text-white bg-green-500 rounded-lg hover:bg-green-600"
                    >
                      Add
                    </button>
                  )}
                </div>

                {isEditMode ? (
                  <div className="space-y-4">
                    {contactContent.socialLinks.map((social, index) => (
                      <div
                        key={index}
                        className="p-4 bg-white border border-orange-300 rounded-lg dark:bg-gray-800"
                      >
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <select
                            value={social.icon}
                            onChange={(e) =>
                              handleSocialLinkChange(
                                index,
                                "icon",
                                e.target.value
                              )
                            }
                            className="px-3 py-2 text-sm bg-gray-100 border rounded dark:bg-gray-700 focus:outline-none focus:border-orange-500"
                          >
                            <option value="Github">Github</option>
                            <option value="Linkedin">Linkedin</option>
                            <option value="Twitter">Twitter</option>
                          </select>
                          <div className="space-y-1">
                            <input
                              type="text"
                              value={social.label}
                              onChange={(e) =>
                                handleSocialLinkChange(
                                  index,
                                  "label",
                                  e.target.value
                                )
                              }
                              maxLength={CHAR_LIMITS.socialLabel}
                              placeholder="Label"
                              className="w-full px-3 py-2 text-sm bg-gray-100 border rounded dark:bg-gray-700 focus:outline-none focus:border-orange-500"
                            />
                            <div
                              className={`text-xs text-right ${getCharCountColor(
                                social.label.length,
                                CHAR_LIMITS.socialLabel
                              )}`}
                            >
                              {social.label.length}/{CHAR_LIMITS.socialLabel}
                            </div>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <input
                            type="url"
                            value={social.href}
                            onChange={(e) =>
                              handleSocialLinkChange(
                                index,
                                "href",
                                e.target.value
                              )
                            }
                            maxLength={CHAR_LIMITS.socialHref}
                            placeholder="URL"
                            className="w-full px-3 py-2 mb-3 text-sm bg-gray-100 border rounded dark:bg-gray-700 focus:outline-none focus:border-orange-500"
                          />
                          <div
                            className={`text-xs text-right ${getCharCountColor(
                              social.href.length,
                              CHAR_LIMITS.socialHref
                            )}`}
                          >
                            {social.href.length}/{CHAR_LIMITS.socialHref}
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleRemoveSocialLink(index)}
                            className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="flex space-x-4">
                      {contactContent.socialLinks.map((social, index) => {
                        const IconComponent =
                          iconMap[social.icon] || GithubIcon;
                        return (
                          <motion.a
                            key={index}
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            href={social.href}
                            className={`w-12 h-12 bg-gray-200 dark:bg-white/10 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 ${social.color} transition-all duration-200`}
                          >
                            <IconComponent className="w-6 h-6" />
                          </motion.a>
                        );
                      })}
                    </div>

                    <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                      Let's connect on social media and stay updated on my
                      latest projects and insights.
                    </p>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
