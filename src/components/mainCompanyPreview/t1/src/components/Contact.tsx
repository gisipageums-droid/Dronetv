

import { useState } from "react";
import { motion } from "motion/react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { toast } from "react-toastify";
import { LEADS_API, AUTH_API, LAMBDA } from '../../../../../lib/apiConfig';

export default function Contact({ content, publishedId }) {
  const contactData = content;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    subject: "General Inquiry",
    message: "",
    category: "Enterprise",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Explicit validation instead of relying only on the browser's native
    // required-field popup - that popup can silently fail to render when
    // the field lives inside a framer-motion animated (transformed)
    // ancestor, which this form does, making the button look like it does
    // nothing at all on some mobile browsers.
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.message) {
      toast.error("Please fill in all required fields (name, email, phone, and message).");
      return;
    }
    if (!publishedId) {
      toast.error("This company page isn't fully loaded yet - please refresh and try again.");
      return;
    }

    setLoading(true);

    const payload = {
      publishedId: publishedId,
      ...formData,
    };

    try {
      const response = await fetch(
        LEADS_API ? `${LEADS_API}/company` : `${LAMBDA.profile}/leads-resource/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        // alert("✅ Message sent successfully!");
        toast.success("✅ Message sent successfully!");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          company: "",
          subject: "General Inquiry",
          message: "",
          category: "Enterprise",
        });
      } else {
        toast.error(
          "❌ Message could not be sent. Please try again or contact the company directly."
        );
      }
    } catch (error) {
      console.error("Error:", error);
      // alert("❌ Something went wrong while sending your message.");
      toast.error("❌ Something went wrong while sending your message.");
    } finally {
      setLoading(false);
    }
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
            {contactData?.title || "Get In Touch"}
          </h2>
          <p className="text-ink-paragraph dark:text-gray-300 max-w-2xl mx-auto text-lg ">
            {contactData?.description ||
              "Ready to transform your business? Let's start a conversation about how we can help you achieve your goals with our expert solutions."}
          </p>
        </div>

        {/* Main Card */}
        <div className="grid grid-cols-1  gap-8">
          {/* Left: Contact Form - opacity-only fade, no x transform. A
          transform on this wrapper made tap-to-focus on the inputs
          unreliable on mobile (first tap could land while the transform was
          still resolving and fail to register), requiring multiple taps
          before typing worked. */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="col-span-2 bg-surface-card dark:bg-gray-800 rounded-2xl shadow-md p-8 lg:p-10"
          >
            <h3 className="text-xl font-semibold text-ink dark:text-white mb-2">
              Send us a message
            </h3>
            <p className="text-ink-caption dark:text-gray-300 mb-6 text-sm text-justify">
              We'll get back to you within 24 hours during business days.
            </p>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* First & Last Name */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-ink-paragraph dark:text-gray-300">
                    First Name
                  </label>
                  <Input
                    name="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-ink-paragraph dark:text-gray-300">
                    Last Name
                  </label>
                  <Input
                    name="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Email & Company */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-ink-paragraph dark:text-gray-300">
                    Email
                  </label>
                  <Input
                    type="email"
                    name="email"
                    placeholder="john@company.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-ink-paragraph dark:text-gray-300">
                    Company
                  </label>
                  <Input
                    name="company"
                    placeholder="Your Company"
                    value={formData.company}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium mb-2 text-ink-paragraph dark:text-gray-300">
                  Phone
                </label>
                <Input
                  name="phone"
                  placeholder="+1234567890"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium mb-2 text-ink-paragraph dark:text-gray-300">
                  Subject
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full rounded-md border border-ink-light dark:border-gray-600 px-3 py-2 bg-ink-light dark:bg-gray-700 text-ink dark:text-white focus:ring-2 focus:ring-brand-yellow transition-all duration-200"
                >
                  <option>General Inquiry</option>
                  <option>Sales Inquiry</option>
                  <option>Products Inquiry</option>
                  <option>Services Inquiry</option>
                  <option>Support Inquiry</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium mb-2 text-ink-paragraph dark:text-gray-300">
                  Message
                </label>
                <Textarea
                  name="message"
                  rows={4}
                  placeholder="Tell us about your project and how we can help..."
                  className="resize-none bg-ink-light dark:bg-gray-700 text-ink dark:text-white border-ink-light dark:border-gray-600"
                  value={formData.message}
                  onChange={handleChange}
                />
              </div>

              {/* Send Message Button - mb-16 keeps it clear of the
              site-wide fixed ScrollingFooter ticker (h-10, always pinned to
              the viewport bottom), which otherwise sits on top of this
              full-width button once scrolled near the end of the page,
              making it untappable */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full mb-16 bg-brand-yellow hover:bg-brand-gold dark:bg-yellow-500 dark:hover:bg-yellow-600 text-white font-semibold py-4 transition-colors duration-300 text-lg"
              >
                {loading
                  ? "Sending..."
                  : contactData?.ctaButton || "Send Message"}
              </Button>
            </form>
          </motion.div>

          {/* Right: Info Panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Business Hours Card */}
            {/* <div className="bg-surface-card dark:bg-gray-800 rounded-2xl shadow-md p-6">
              <h4 className="text-lg font-semibold text-ink dark:text-white mb-3">
                Business Hours
              </h4>
              <ul className="text-ink-paragraph dark:text-gray-300 space-y-1 text-sm">
                <li>Mon - Fri: 9:00 AM - 6:00 PM EST</li>
                <li>Sat: 10:00 AM - 2:00 PM EST</li>
                <li>Closed on Sundays</li>
              </ul>
            </div> */}

            {/* Consultation Card */}
            {/* <div className="bg-surface-card dark:bg-gray-800 rounded-2xl shadow-md p-6 text-center">
              <h4 className="text-lg font-semibold text-ink dark:text-white mb-2">
                Ready to Get Started?
              </h4>
              <p className="text-ink-paragraph dark:text-gray-300 text-sm mb-4 text-justify">
                Schedule a free consultation to discuss your business needs
              </p>
              <Button className="bg-status-error hover:bg-status-error text-white px-5 py-2 rounded-md font-semibold transition-colors duration-300">
                Book Free Consultation
              </Button>
            </div> */}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
