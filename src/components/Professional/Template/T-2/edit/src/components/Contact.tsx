import { Edit2, Globe, Loader2, Mail, MapPin, Phone, Save, Send, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { AnimatedButton } from './AnimatedButton';
import { toast } from 'sonner';

// Custom Button component (consistent with other components)
const Button = ({
  children,
  onClick,
  variant,
  size,
  className,
  disabled,
  ...props
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: string;
  size?: string;
  className?: string;
  disabled?: boolean;
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variants: Record<string, string> = {
    outline: "border border-gray-300 bg-transparent hover:bg-gray-50",
    default: "bg-blue-600 text-white hover:bg-blue-700",
  };
  const sizes: Record<string, string> = {
    sm: "h-8 px-3 text-sm",
    default: "h-10 px-4",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant || 'default']} ${sizes[size || 'default']
        } ${className || ""}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

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
}

interface FormData {
  submitEndpoint: string;
  fields: FormField[];
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
      href: "mailto:example@gmail.com"
    },
    {
      icon: "Phone",
      label: "Phone",
      value: "+91-99999-99999",
      href: "tel:919999999999"
    },
    {
      icon: "MapPin",
      label: "Location",
      value: "India",
      href: "#"
    },
    {
      icon: "Globe",
      label: "Website",
      value: "www.professional.dev",
      href: "#"
    }
  ],
  socialLinks: [
    {
      icon: "Github",
      label: "GitHub",
      href: "#",
      color: "hover:text-gray-900"
    },
    {
      icon: "Linkedin",
      label: "LinkedIn",
      href: "#",
      color: "hover:text-blue-600"
    },
    {
      icon: "Twitter",
      label: "Twitter",
      href: "#",
      color: "hover:text-blue-400"
    },
    {
      icon: "Instagram",
      label: "Instagram",
      href: "#",
      color: "hover:text-pink-500"
    }
  ],
  form: {
    submitEndpoint: "/api/contact",
    fields: [
      {
        name: "name",
        label: "Full Name",
        type: "text",
        required: true
      },
      {
        name: "email",
        label: "Email Address",
        type: "email",
        required: true
      },
      {
        name: "subject",
        label: "Subject",
        type: "text",
        required: true
      },
      {
        name: "message",
        label: "Message",
        type: "textarea",
        required: true,
        rows: 6
      }
    ],
    submitText: "Send Message",
    successMessage: "Thank you! I'll get back to you soon.",
    errorMessage: "Something went wrong. Please try again."
  },
  availability: {
    message: "Available for new projects",
    responseTime: "Usually responds within 24 hours",
    status: "available"
  }
};

interface ContactProps {
  contactData?: ContactData;
  onStateChange?: (data: ContactData) => void;
  userId?: string;
  professionalId?: string;
  templateSelection?: string;
}

// Icon mapping
const iconMap: { [key: string]: React.ComponentType<any> } = {
  Mail, Phone, MapPin, Globe, Send, Github: Mail, Linkedin: Phone, Twitter: MapPin, Instagram: Globe
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
    data.form.fields.forEach(field => {
      initialFormData[field.name] = '';
    });
    setFormData(initialFormData);
  }, [data.form.fields]);

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
      toast.success('Contact section saved successfully');

    } catch (error) {
      console.error('Error saving contact section:', error);
      toast.error('Error saving changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTempData({ ...data });
    setIsEditing(false);
  };

  const handleFormChange = (fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call to the submit endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log('Form submitted:', formData);
      toast.success(data.form.successMessage);

      // Reset form
      const resetFormData: Record<string, string> = {};
      data.form.fields.forEach(field => {
        resetFormData[field.name] = '';
      });
      setFormData(resetFormData);

    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(data.form.errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update contact info
  const updateContactInfo = (index: number, field: keyof ContactInfo, value: string) => {
    setTempData(prev => ({
      ...prev,
      contactInfo: prev.contactInfo.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  // Update social links
  const updateSocialLink = (index: number, field: keyof SocialLink, value: string) => {
    setTempData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  // Update form fields
  const updateFormField = (index: number, field: keyof FormField, value: string | number | boolean) => {
    setTempData(prev => ({
      ...prev,
      form: {
        ...prev.form,
        fields: prev.form.fields.map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        )
      }
    }));
  };

  // Update form settings
  const updateFormSetting = (field: keyof FormData, value: string) => {
    setTempData(prev => ({
      ...prev,
      form: {
        ...prev.form,
        [field]: value
      }
    }));
  };

  // Update availability
  const updateAvailability = (field: keyof Availability, value: string) => {
    setTempData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [field]: value
      }
    }));
  };

  // Update text content
  const updateTextContent = (field: keyof ContactData, value: string) => {
    setTempData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const displayData = isEditing ? tempData : data;

  // Loading state
  if (isLoading) {
    return (
      <section id="contact" className="py-5 bg-yellow-50 dark:bg-yellow-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-yellow-500" />
          <p className="mt-4 text-muted-foreground">Loading contact section...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-5 bg-yellow-50 dark:bg-yellow-900/20 relative">
      {/* Edit/Save Controls */}
      <div className="absolute top-4 right-4 z-10">
        {!isEditing ? (
          <Button
            onClick={handleEdit}
            size='sm'
            className='bg-red-500 hover:bg-red-600 shadow-md text-white'
          >
            <Edit2 className='w-4 h-4 mr-2' />
            Edit Contact
          </Button>
        ) : (
          <div className='flex gap-2'>
            <Button
              onClick={handleSave}
              size='sm'
              className='bg-green-600 hover:bg-green-700 text-white shadow-md'
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className='w-4 h-4 mr-2 animate-spin' />
              ) : (
                <Save className='w-4 h-4 mr-2' />
              )}
              {isSaving ? "Saving..." : "Save"}
            </Button>
            <Button
              onClick={handleCancel}
              size='sm'
              className='bg-red-500 hover:bg-red-600 shadow-md text-white'
              disabled={isSaving}
            >
              <X className='w-4 h-4 mr-2' />
              Cancel
            </Button>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          {isEditing ? (
            <div className="space-y-4 max-w-2xl mx-auto">

              <input
                type="text"
                value={displayData.subtitle}
                onChange={(e) => updateTextContent('subtitle', e.target.value)}
                className="text-lg uppercase tracking-wider text-muted-foreground bg-white/80 border-2 border-dashed border-blue-300 rounded px-4 py-2 w-full focus:border-blue-500 focus:outline-none"
                placeholder="Subtitle"
              />
              <input
                type="text"
                value={displayData.heading}
                onChange={(e) => updateTextContent('heading', e.target.value)}
                className="text-3xl sm:text-4xl text-foreground bg-white/80 border-2 border-dashed border-blue-300 rounded px-4 py-2 w-full focus:border-blue-500 focus:outline-none text-center"
                placeholder="Main Heading"
              />
              <input
                type="text"
                value={displayData.description}
                onChange={(e) => updateTextContent('description', e.target.value)}
                className="text-lg text-muted-foreground bg-white/80 border-2 border-dashed border-blue-300 rounded px-4 py-2 w-full focus:border-blue-500 focus:outline-none"
                placeholder="Description"
              />
            </div>
          ) : (
            <>
              <p className="text-lg uppercase tracking-wider text-muted-foreground mb-4">
                {displayData.subtitle}
              </p>
              <h2 className="text-3xl sm:text-4xl text-foreground mb-4">
                {displayData.heading}
              </h2>
              <p className="text-lg text-muted-foreground">
                {displayData.description}
              </p>
            </>
          )}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Availability Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-card rounded-lg p-6 shadow-md"
            >
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={displayData.availability.message}
                    onChange={(e) => updateAvailability('message', e.target.value)}
                    className="w-full px-3 py-2 bg-white/80 border border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none"
                    placeholder="Availability Message"
                  />
                  <input
                    type="text"
                    value={displayData.availability.responseTime}
                    onChange={(e) => updateAvailability('responseTime', e.target.value)}
                    className="w-full px-3 py-2 bg-white/80 border border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none"
                    placeholder="Response Time"
                  />
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-3 h-3 rounded-full ${displayData.availability.status === 'available'
                      ? 'bg-green-500'
                      : 'bg-yellow-500'
                      }`} />
                    <span className="text-foreground font-medium">
                      {displayData.availability.message}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {displayData.availability.responseTime}
                  </p>
                </>
              )}
            </motion.div>

            <div className="space-y-6">
              {displayData.contactInfo.map((info, index) => {


                const IconComponent = iconMap[info.icon] || Mail;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ x: 10 }}
                    className="flex items-center space-x-4"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.3 }}
                      className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center"
                    >
                      <IconComponent className="w-6 h-6 text-gray-900" />
                    </motion.div>
                    <div className="flex-1">
                      {isEditing ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={info.label}
                            onChange={(e) => updateContactInfo(index, 'label', e.target.value)}
                            className="w-full px-2 py-1 bg-white/80 border border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none"
                            placeholder="Label"
                          />
                          <input
                            type="text"
                            value={info.value}
                            onChange={(e) => updateContactInfo(index, 'value', e.target.value)}
                            className="w-full px-2 py-1 bg-white/80 border border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none"
                            placeholder="Value"
                          />
                          <input
                            type="text"
                            value={info.href}
                            onChange={(e) => updateContactInfo(index, 'href', e.target.value)}
                            className="w-full px-2 py-1 bg-white/80 border border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none"
                            placeholder="Link"
                          />
                        </div>
                      ) : (
                        <div className='max-w-[130px] md:max-w-full overflow-hidden'>
                          <h4 className="text-sm md:text-base text-foreground mb-1">{info.label}</h4>
                          <a
                            href={info.href}
                            className="text-xs md:text-sm w-full text-muted-foreground hover:text-yellow-500 transition-colors duration-300 break-words"
                          >
                            {info.value}
                          </a>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="pt-8"
            >
              <h4 className="text-sm md:text-base text-foreground mb-4">Follow me on</h4>
              {isEditing ? (
                <div className="space-y-3">
                  {displayData.socialLinks.map((social, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={social.label}
                        onChange={(e) => updateSocialLink(index, 'label', e.target.value)}
                        className="flex-1 px-3 py-2 bg-white/80 border border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none text-sm"
                        placeholder="Social Media Name"
                      />
                      <input
                        type="text"
                        value={social.href}
                        onChange={(e) => updateSocialLink(index, 'href', e.target.value)}
                        className="flex-1 px-3 py-2 bg-white/80 border border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none text-sm"
                        placeholder="Link"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {displayData.socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-3 py-1 md:px-4 md:py-2 bg-card text-foreground rounded-lg shadow hover:shadow-md transition-all duration-300 ${social.color} border border-border text-sm md:text-base`}
                    >
                      {social.label}
                    </motion.a>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl p-8 shadow-lg"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {displayData.form.fields.map((field, index) => (
                <motion.div
                  key={field.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  {isEditing ? (
                    <div className="space-y-2 mb-3">
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) => updateFormField(index, 'label', e.target.value)}
                        className="w-full px-3 py-2 bg-white/80 border border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none"
                        placeholder="Field Label"
                      />
                      <div className="flex gap-2">
                        <select
                          value={field.type}
                          onChange={(e) => updateFormField(index, 'type', e.target.value)}
                          className="flex-1 px-3 py-2 bg-white/80 border border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none"
                        >
                          <option value="text">Text</option>
                          <option value="email">Email</option>
                          <option value="textarea">Textarea</option>
                        </select>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={field.required}
                            onChange={(e) => updateFormField(index, 'required', e.target.checked)}
                            className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                          />
                          Required
                        </label>
                      </div>
                    </div>
                  ) : (
                    <label htmlFor={field.name} className="block text-foreground mb-2">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                  )}

                  {field.type === 'textarea' ? (
                    <textarea
                      id={field.name}
                      name={field.name}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleFormChange(field.name, e.target.value)}
                      rows={field.rows || 4}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300 resize-none bg-background text-foreground"
                      required={field.required}
                      disabled={isEditing}
                    />
                  ) : (
                    <input
                      type={field.type}
                      id={field.name}
                      name={field.name}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleFormChange(field.name, e.target.value)}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300 bg-background text-foreground"
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
                  {isEditing ? (
                    <input
                      type="text"
                      value={displayData.form.submitText}
                      onChange={(e) => updateFormSetting('submitText', e.target.value)}
                      className="bg-transparent border-none focus:outline-none text-white w-32"
                      placeholder="Button Text"
                    />
                  ) : (
                    isSubmitting ? "Sending..." : displayData.form.submitText
                  )}
                </AnimatedButton>
              </motion.div>

              {isEditing && (
                <div className="space-y-3 pt-4 border-t border-border">
                  <input
                    type="text"
                    value={displayData.form.successMessage}
                    onChange={(e) => updateFormSetting('successMessage', e.target.value)}
                    className="w-full px-3 py-2 bg-white/80 border border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none"
                    placeholder="Success Message"
                  />
                  <input
                    type="text"
                    value={displayData.form.errorMessage}
                    onChange={(e) => updateFormSetting('errorMessage', e.target.value)}
                    className="w-full px-3 py-2 bg-white/80 border border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none"
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
