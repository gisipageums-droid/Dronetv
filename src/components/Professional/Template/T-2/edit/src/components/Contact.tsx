import { Loader2, Send } from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { AnimatedButton } from "./AnimatedButton";
import { toast } from "sonner";

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

interface ContactData {
  subtitle: string;
  heading: string;
  description: string;
  form: FormData;
}

const defaultContactData: ContactData = {
  subtitle: "ready to start your next project",
  heading: "Let's Work Together",
  description: "available for new opportunities and collaborations",
  form: {
    submitEndpoint: "/api/contact",
    submitText: "Send Message",
    successMessage: "Thank you! I'll get back to you soon.",
    errorMessage: "Something went wrong. Please try again.",
  },
};

interface ContactProps {
  contactData?: ContactData;
}

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
      "Services Inquiry",
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
  name: "Rahul sharma ",
  email: "rahulsharma@example.com",
  phone: "+91 98765 43210",
  subject: "Select a subject",
  message: "Write your message here...",
};

export function Contact({ contactData }: ContactProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<ContactData>(defaultContactData);
  const [formData, setFormData] = useState<Record<string, string>>({});

  // Initialize form data
  useEffect(() => {
    const initialFormData: Record<string, string> = {};
    staticFormFields.forEach((field) => {
      initialFormData[field.name] = "";
    });
    setFormData(initialFormData);
  }, []);

  // Set contact data
  useEffect(() => {
    if (contactData) {
      setData(contactData);
    }
  }, [contactData]);

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

  return (
    <section
      id="contact"
      className="py-20 bg-yellow-50 dark:bg-yellow-900/20"
    >
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <p className="mb-4 text-lg tracking-wider uppercase text-muted-foreground">
            {data.subtitle}
          </p>
          <h2 className="mb-4 text-3xl sm:text-4xl text-foreground">
            {data.heading}
          </h2>
          <p className="text-lg text-muted-foreground">
            {data.description}
          </p>
        </motion.div>

        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="p-4 sm:p-6 lg:p-8 shadow-lg bg-card rounded-2xl mx-auto"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
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
                    {isSubmitting ? "Sending..." : data.form.submitText}
                  </AnimatedButton>
                </motion.div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
