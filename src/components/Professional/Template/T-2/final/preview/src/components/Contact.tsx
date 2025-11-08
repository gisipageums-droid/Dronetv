import { Globe, Loader2, Mail, MapPin, Phone, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { AnimatedButton } from './AnimatedButton';
import { toast } from 'react-toastify';
import axios from 'axios';

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

interface ContactProps {
  contactData: ContactData;
  professionalId: string;
}

// Icon mapping
const iconMap: { [key: string]: React.ComponentType<any> } = {
  Mail, Phone, MapPin, Globe, Send, Github: Mail, Linkedin: Phone, Twitter: MapPin, Instagram: Globe
};

// Static form fields - not editable (same as in first Contact.tsx)
const staticFormFields = [
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
    name: "phone",
    label: "Phone Number",
    type: "tel",
    required: false
  },
  {
    name: "subject",
    label: "Subject",
    type: "select",
    required: true,
    options: ["General Inquiry", "Sales Inquiry", "Products Inquiry", "Services Inquiry", "Support Inquiry"]
  },
  {
    name: "message",
    label: "Message",
    type: "textarea",
    required: true,
    rows: 6
  }
];

export function Contact({ contactData, professionalId }: ContactProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});

  // Initialize form data
  useState(() => {
    const initialFormData: Record<string, string> = {};
    staticFormFields.forEach(field => {
      initialFormData[field.name] = '';
    });
    setFormData(initialFormData);
  });

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
      // Send form data as JSON body using POST
      const res = await axios.post(
        'https://l7p8i65gl5.execute-api.ap-south-1.amazonaws.com/prod/',
        { professionalId, ...formData },
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (res.status === 200) {
        toast.success("Message sent successfully!");
      }

      // Reset form
      const resetFormData: Record<string, string> = {};
      staticFormFields.forEach(field => {
        resetFormData[field.name] = '';
      });
      setFormData(resetFormData);

    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(contactData.form.errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-yellow-50 dark:bg-yellow-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-lg uppercase tracking-wider text-muted-foreground mb-4">
            {contactData.subtitle}
          </p>
          <h2 className="text-3xl sm:text-4xl text-foreground mb-4">
            {contactData.heading}
          </h2>
          <p className="text-lg text-muted-foreground">
            {contactData.description}
          </p>
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
            {/* Contact Info Cards */}


            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="pt-8"
            >
              <h4 className="text-foreground mb-4">Follow me on</h4>
              <div className="flex flex-wrap gap-3">
                {contactData.socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 bg-card text-foreground rounded-lg shadow hover:shadow-md transition-all duration-300 ${social.color} border border-border`}
                  >
                    {social.label}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl p-8 shadow-lg border-2 border-white"
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
                  <label htmlFor={field.name} className="block text-foreground mb-2">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>

                  {/* Field input rendering */}
                  {field.type === 'textarea' ? (
                    <textarea
                      id={field.name}
                      name={field.name}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleFormChange(field.name, e.target.value)}
                      rows={field.rows || 4}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300 resize-none bg-background text-foreground"
                      required={field.required}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      id={field.name}
                      name={field.name}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleFormChange(field.name, e.target.value)}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300 bg-background text-foreground"
                      required={field.required}
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
                      value={formData[field.name] || ''}
                      onChange={(e) => handleFormChange(field.name, e.target.value)}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300 bg-background text-foreground"
                      required={field.required}
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
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5 mr-2" />
                  )}
                  {isSubmitting ? "Sending..." : contactData.form.submitText}
                </AnimatedButton>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}