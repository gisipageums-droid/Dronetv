import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Send,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "john.doe@example.com",
      href: "mailto:john.doe@example.com",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+1 (555) 123-4567",
      href: "tel:+15551234567",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "San Francisco, CA",
      href: "https://maps.google.com",
    },
  ];

  const socialLinks = [
    {
      icon: Github,
      label: "GitHub",
      href: "#",
      color: "hover:text-gray-900 dark:hover:text-white",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: "#",
      color: "hover:text-blue-600",
    },
    {
      icon: Twitter,
      label: "Twitter",
      href: "#",
      color: "hover:text-blue-400",
    },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.log(error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus("idle"), 5000);
    }
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
      className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Let's{" "}
              <span className="text-orange-500">
                Connect
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Ready to bring your ideas to life? I'd love to hear about your
              project and discuss how we can work together.
            </p>
          </motion.div>

          <div className=" max-w-2xl mx-auto">
            {/* Contact Form */}
            <motion.div variants={itemVariants} className="flex justify-center">
              <div className="w-full max-w-xl mx-auto bg-white dark:bg-gray-800 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <h3 className="text-2xl font-bold text-orange-500 mb-6">
                  Send Me a Message
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
                      >
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:border-accent-orange focus:ring-2 focus:ring-accent-orange/20 transition-all duration-200"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
                      >
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:border-accent-orange focus:ring-2 focus:ring-accent-orange/20 transition-all duration-200"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
                    >
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:border-accent-orange focus:ring-2 focus:ring-accent-orange/20 transition-all duration-200"
                      placeholder="Project Inquiry"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:border-accent-orange focus:ring-2 focus:ring-accent-orange/20 transition-all duration-200 resize-none"
                      placeholder="Tell me about your project..."
                    />
                  </div>

                  {/* Submit Status */}
                  {submitStatus !== "idle" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex items-center p-4 rounded-lg ${submitStatus === "success"
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
                    className="w-full bg-orange-500 text-white px-6 py-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-5 h-5 border-2 border-black border-t-transparent rounded-full mr-2"
                      />
                    ) : (
                      <Send className="w-5 h-5 mr-2" />
                    )}
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </motion.button>
                </form>
              </div>
            </motion.div>


          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
