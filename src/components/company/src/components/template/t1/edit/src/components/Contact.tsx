import { motion } from "motion/react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";

export default function Contact({ content }) {
  const defaultContent = {
    title: "Get In Touch",
    description:
      "Ready to transform your business? Let's start a conversation about how we can help you achieve your goals with our expert solutions.",
    formTitle: "Send us a message",
    formDescription:
      "We'll get back to you within 24 hours during business days.",
    ctaButton: "Send Message",
    businessHoursTitle: "Business Hours",
    businessHours: [
      "Mon - Fri: 9:00 AM - 6:00 PM EST",
      "Sat: 10:00 AM - 2:00 PM EST",
      "Closed on Sundays",
    ],

  };

  // Merge default content with provided content
  const contactData = {
    ...defaultContent,
    ...content,
    businessHours: Array.isArray(content?.businessHours) 
      ? content.businessHours 
      : defaultContent.businessHours
  };

  return (
    <section
      id="contact"
      className="py-20 bg-ink-offwhite dark:bg-gray-900 transition-colors duration-500 scroll-mt-20"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-ink dark:text-white mb-3">
            {contactData.title}
          </h2>
          <p className="text-ink-paragraph dark:text-gray-300 max-w-2xl mx-auto text-lg">
            {contactData.description}
          </p>
        </div>

        {/* Main Card */}
        <div className="grid grid-cols-1 justify-center gap-8">
          {/* Left: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="col-span-2 bg-surface-card dark:bg-gray-800 rounded-2xl shadow-md p-8 lg:p-10"
          >
            <h3 className="text-xl font-semibold text-ink dark:text-white mb-2">
              {contactData.formTitle}
            </h3>
            <p className="text-ink-caption dark:text-gray-300 mb-6 text-sm">
              {contactData.formDescription}
            </p>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-ink-paragraph dark:text-gray-300">
                    First Name
                  </label>
                  <Input
                    placeholder="rahul"
                    className="bg-ink-light dark:bg-gray-700 text-ink dark:text-white border-ink-light dark:border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-ink-paragraph dark:text-gray-300">
                    Last Name
                  </label>
                  <Input
                    placeholder="sharma"
                    className="bg-ink-light dark:bg-gray-700 text-ink dark:text-white border-ink-light dark:border-gray-600"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-ink-paragraph dark:text-gray-300">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="rahul@company.com"
                    className="bg-ink-light dark:bg-gray-700 text-ink dark:text-white border-ink-light dark:border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-ink-paragraph dark:text-gray-300">
                    Company
                  </label>
                  <Input
                    placeholder="Your Company"
                    className="bg-ink-light dark:bg-gray-700 text-ink dark:text-white border-ink-light dark:border-gray-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-ink-paragraph dark:text-gray-300">
                  Subject
                </label>
                <select className="w-full rounded-md border border-ink-light dark:border-gray-600 px-3 py-2 bg-ink-light dark:bg-gray-700 text-ink dark:text-white focus:ring-2 focus:ring-brand-yellow transition-all duration-200">
                  <option>General Inquiry</option>
                  <option>Sales Inquiry</option>
                  <option>Products Inquiry</option>
                  <option>Services Inquiry</option>
                  <option>Support Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-ink-paragraph dark:text-gray-300">
                  Message
                </label>
                <Textarea
                  rows={4}
                  placeholder="Tell us about your project and how we can help..."
                  className="resize-none bg-ink-light dark:bg-gray-700 text-ink dark:text-white border-ink-light dark:border-gray-600"
                />
              </div>

              <Button className="w-full bg-brand-yellow hover:bg-brand-gold dark:bg-yellow-500 dark:hover:bg-yellow-600 text-white font-semibold py-4 transition-colors duration-300 text-lg">
                {contactData.ctaButton}
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Business Hours Section - Commented out */}
            {/* <div className="bg-surface-card dark:bg-gray-800 rounded-2xl shadow-md p-6">
              <h4 className="text-lg font-semibold text-ink dark:text-white mb-3">
                {contactData.businessHoursTitle}
              </h4>
              <ul className="text-ink-paragraph dark:text-gray-300 space-y-1 text-sm">
                {contactData.businessHours.map((hour, index) => (
                  <li key={index}>{hour}</li>
                ))}
              </ul>
            </div> */}

            {/* Consultation Section */}
            {/* <div className="bg-surface-card dark:bg-gray-800 rounded-2xl shadow-md p-6 text-center">
              <h4 className="text-lg font-semibold text-ink dark:text-white mb-2">
                {contactData.consultationTitle}
              </h4>
              <p className="text-ink-paragraph dark:text-gray-300 text-sm mb-4">
                {contactData.consultationDescription}
              </p>
              <Button className="bg-status-error hover:bg-status-error text-white px-5 py-2 rounded-md font-semibold transition-colors duration-300">
                {contactData.consultationButton}
              </Button>
            </div> */}
          </motion.div>
        </div>
      </div>
    </section>
  );
}