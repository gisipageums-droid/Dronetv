import {
  Globe,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { AnimatedButton } from "./AnimatedButton";
import { toast } from "sonner";

interface ContactInfo {
  icon: string;
  label: string;
  value: string;
  href: string;
}

interface SocialLink {
  icon: string;
  label: string;
  href: string;
  color: string;
}

interface FormField {
  name: string;
  label: string;
  type: string;
  required: boolean;
  rows?: number;
  options?: string[];
}

interface FormData {
  submitEndpoint: string;
  submitText: string;
  successMessage: string;
  errorMessage: string;
}

interface Availability {
  message: string;
  responseTime: string;
  status: string;
}

interface ContactData {
  subtitle: string;
  heading: string;
  description: string;
  contactInfo: ContactInfo[];
  socialLinks: SocialLink[];
  form: FormData;
  availability: Availability;
}

const defaultContactData: ContactData = {
  subtitle: "ready to start your next project",
  heading: "Let's Work Together",
  description: "available for new opportunities and collaborations",
  contactInfo: [
    {
      icon: "Mail",
      label: "Email",
      value: "example@gmail.com",
      href: "mailto:example@gmail.com",
    },
    {
      icon: "Phone",
      label: "Phone",
      value: "+91-99999-99999",
      href: "tel:919999999999",
    },
    {
      icon: "MapPin",
      label: "Location",
      value: "India",
      href: "#",
    },
    {
      icon: "Globe",
      label: "Website",
      value: "www.professional.dev",
      href: "#",
    },
  ],
  socialLinks: [
    {
      icon: "Github",
      label: "GitHub",
      href: "#",
      color: "hover:text-gray-900",
    },
    {
      icon: "Linkedin",
      label: "LinkedIn",
      href: "#",
      color: "hover:text-blue-600",
    },
    {
      icon: "Twitter",
      label: "Twitter",
      href: "#",
      color: "hover:text-blue-400",
    },
    {
      icon: "Instagram",
      label: "Instagram",
      href: "#",
      color: "hover:text-pink-500",
    },
  ],
  form: {
    submitEndpoint: "/api/contact",
    submitText: "Send Message",
    successMessage: "Thank you! I'll get back to you soon.",
    errorMessage: "Something went wrong. Please try again.",
  },
  availability: {
    message: "Available for new projects",
    responseTime: "Usually responds within 24 hours",
    status: "available",
  },
};

interface ContactProps {
  contactData?: ContactData;
  onStateChange?: (data: ContactData) => void;
}

// Icon mapping
const iconMap: { [key: string]: React.ComponentType<any> } = {
  Mail,
  Phone,
  MapPin,
  Globe,
  Send,
  Github: Mail,
  Linkedin: Phone,
  Twitter: MapPin,
  Instagram: Globe,
};

// Static form fields - not editable
const staticFormFields: FormField[] = [
  {
    name: "name",
    label: "Full Name",
    type: "text",
    required: true,
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    required: true,
  },
  {
    name: "phone",
    label: "Phone Number",
    type: "tel",
    required: false,
  },
  {
    name: "subject",
    label: "Subject",
    type: "select",
    required: true,
    options: [
      "General Inquiry",
      "Sales Inquiry",
      "Products Inquiry",
      "Servicess Inquiry",
      "Support Inquiry",
    ],
  },
  {
    name: "message",
    label: "Message",
    type: "textarea",
    required: true,
    rows: 6,
  },
];

const fieldPlaceholders: Record<string, string> = {
  name: "Rahul sharma",
  email: "rahulsharma@example.com",
  phone: "+91 98765 43210",
  subject: "Select a subject",
  message: "Write your message here...",
};

export function Contact({ contactData, onStateChange }: ContactProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  const [data, setData] = useState<ContactData>(defaultContactData);
  const [tempData, setTempData] = useState<ContactData>(defaultContactData);

  const [formData, setFormData] = useState<Record<string, string>>({});

  // Notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(data);
    }
  }, [data]);

  // Initialize form data
  useEffect(() => {
    const initialFormData: Record<string, string> = {};
    staticFormFields.forEach((field) => {
      initialFormData[field.name] = "";
    });
    setFormData(initialFormData);
  }, []);

  // Fake API fetch
  const fetchContactData = async () => {
    setIsLoading(true);
    try {
      const response = await new Promise<ContactData>((resolve) =>
        setTimeout(() => resolve(contactData || defaultContactData), 1200)
      );
      setData(response);
      setTempData(response);
      setDataLoaded(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!dataLoaded && !isLoading) {
      fetchContactData();
    }
  }, [dataLoaded, isLoading, contactData]);

  const handleEdit = () => {
    setIsEditing(true);
    setTempData({ ...data });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setData(tempData);
      setIsEditing(false);
      toast.success("Contact section saved successfully");
    } catch (error) {
      console.error("Error saving contact section:", error);
      toast.error("Error saving changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTempData({ ...data });
    setIsEditing(false);
  };

  const handleFormChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call to the submit endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Form submitted:", formData);
      toast.success(data.form.successMessage);

      // Reset form
      const resetFormData: Record<string, string> = {};
      staticFormFields.forEach((field) => {
        resetFormData[field.name] = "";
      });
      setFormData(resetFormData);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(data.form.errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update contact info
  const updateContactInfo = (
    index: number,
    field: keyof ContactInfo,
    value: string
  ) => {
    setTempData((prev) => ({
      ...prev,
      contactInfo: prev.contactInfo.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  // Update social links
  const updateSocialLink = (
    index: number,
    field: keyof SocialLink,
    value: string
  ) => {
    setTempData((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  // Update form settings
  const updateFormSetting = (field: keyof FormData, value: string) => {
    setTempData((prev) => ({
      ...prev,
      form: {
        ...prev.form,
        [field]: value,
      },
    }));
  };

  // Update availability
  const updateAvailability = (field: keyof Availability, value: string) => {
    setTempData((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        [field]: value,
      },
    }));
  };

  // Update text content
  const updateTextContent = (field: keyof ContactData, value: string) => {
    setTempData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const displayData = isEditing ? tempData : data;

  // Loading state
  if (isLoading) {
    return (
      <section
        id="contact"
        className="py-20 bg-yellow-50 dark:bg-yellow-900/20"
      >
        <div className="px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
          <Loader2 className="w-8 h-8 mx-auto text-yellow-500 animate-spin" />
          <p className="mt-4 text-muted-foreground">
            Loading contact section...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="contact"
      className="relative py-20 bg-yellow-50 dark:bg-yellow-900/20"
    >

      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          {isEditing ? (
            <div className="max-w-2xl mx-auto space-y-4">
              <input
                type="text"
                value={displayData.subtitle}
                onChange={(e) => updateTextContent("subtitle", e.target.value)}
                className="w-full px-4 py-2 text-lg tracking-wider uppercase border-2 border-blue-300 border-dashed rounded text-muted-foreground bg-white/80 focus:border-blue-500 focus:outline-none"
                placeholder="Subtitle"
              />
              <input
                type="text"
                value={displayData.heading}
                onChange={(e) => updateTextContent("heading", e.target.value)}
                className="w-full px-4 py-2 text-3xl text-center border-2 border-blue-300 border-dashed rounded sm:text-4xl text-foreground bg-white/80 focus:border-blue-500 focus:outline-none"
                placeholder="Main Heading"
              />
              <input
                type="text"
                value={displayData.description}
                onChange={(e) =>
                  updateTextContent("description", e.target.value)
                }
                className="w-full px-4 py-2 text-lg border-2 border-blue-300 border-dashed rounded text-muted-foreground bg-white/80 focus:border-blue-500 focus:outline-none"
                placeholder="Description"
              />
            </div>
          ) : (
            <>
              <p className="mb-4 text-lg tracking-wider uppercase text-muted-foreground">
                {displayData.subtitle}
              </p>
              <h2 className="mb-4 text-3xl sm:text-4xl text-foreground">
                {displayData.heading}
              </h2>
              <p className="text-lg text-muted-foreground">
                {displayData.description}
              </p>
            </>
          )}
        </motion.div>

        <div className="max-w-2xl mx-auto">


          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="p-4 sm:p-6 lg:p-8 shadow-lg bg-card rounded-2xl mx-auto"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Static Form Fields - Not Editable */}
              {staticFormFields.map((field, index) => (
                <motion.div
                  key={field.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <label
                    htmlFor={field.name}
                    className="block mb-2 text-sm sm:text-base text-foreground"
                  >
                    {field.label}
                    {field.required && (
                      <span className="ml-1 text-red-500">*</span>
                    )}
                  </label>

                  {/* Field input rendering */}
                  {field.type === "textarea" ? (
                    <textarea
                      id={field.name}
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={(e) =>
                        handleFormChange(field.name, e.target.value)
                      }
                      rows={field.rows || 4}
                      className="w-full px-4 py-3 transition-all duration-300 border rounded-lg resize-none border-border focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-background text-foreground text-sm sm:text-base min-h-[120px]"
                      placeholder={fieldPlaceholders[field.name] || field.label}
                      required={field.required}
                      disabled={isEditing}
                    />
                  ) : field.type === "select" ? (
                    <select
                      id={field.name}
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={(e) =>
                        handleFormChange(field.name, e.target.value)
                      }
                      className="w-full px-4 py-3 transition-all duration-300 border rounded-lg border-border focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-background text-foreground text-sm sm:text-base min-h-[44px]"
                      required={field.required}
                      disabled={isEditing}
                    >
                      <option value="">Select a subject</option>
                      {field.options?.map((option, optionIndex) => (
                        <option key={optionIndex} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      id={field.name}
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={(e) =>
                        handleFormChange(field.name, e.target.value)
                      }
                      className="w-full px-4 py-3 transition-all duration-300 border rounded-lg border-border focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-background text-foreground text-sm sm:text-base min-h-[44px]"
                      placeholder={fieldPlaceholders[field.name] || field.label}
                      required={field.required}
                      disabled={isEditing}
                    />
                  )}
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <AnimatedButton
                  size="lg"
                  className="w-full"
                  type="submit"
                  disabled={isSubmitting || isEditing}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5 mr-2" />
                  )}
                  {isSubmitting ? "Sending..." : displayData.form.submitText}
                </AnimatedButton>
              </motion.div>

              {isEditing && (
                <div className="pt-4 space-y-3 border-t border-border">
                  <input
                    type="text"
                    value={displayData.form.successMessage}
                    onChange={(e) =>
                      updateFormSetting("successMessage", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-blue-300 border-dashed rounded bg-white/80 focus:border-blue-500 focus:outline-none"
                    placeholder="Success Message"
                  />
                  <input
                    type="text"
                    value={displayData.form.errorMessage}
                    onChange={(e) =>
                      updateFormSetting("errorMessage", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-blue-300 border-dashed rounded bg-white/80 focus:border-blue-500 focus:outline-none"
                    placeholder="Error Message"
                  />
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
