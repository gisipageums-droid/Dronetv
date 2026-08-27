import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Edit2, Save, X } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";

export default function Contact({ content, onStateChange }) {
  const defaultContent = {
    title: "Get In Touch",
    description:
      "Ready to transform your business? Let's start a conversation about how we can help you achieve your goals with our expert solutions.",
    formTitle: "Send us a message",
    formDescription: "We'll get back to you within 24 hours during business days.",
    ctaButton: "Send Message",
    businessHours: ["Mon - Fri: 9:00 AM - 6:00 PM", "Sat: 10:00 AM - 2:00 PM", "Closed on Sundays"],
  };

  const [isEditing, setIsEditing] = useState(false);
  const [contactData, setContactData] = useState({ ...defaultContent, ...content, businessHours: Array.isArray(content?.businessHours) ? content.businessHours : defaultContent.businessHours });
  const [tempData, setTempData] = useState(contactData);

  useEffect(() => {
    if (!isEditing) {
      const merged = { ...defaultContent, ...content, businessHours: Array.isArray(content?.businessHours) ? content.businessHours : defaultContent.businessHours };
      setContactData(merged);
      setTempData(merged);
    }
  }, [content]);

  useEffect(() => {
    if (onStateChange) onStateChange(contactData);
  }, [contactData, onStateChange]);

  const handleEdit = () => {
    setTempData({ ...contactData });
    setIsEditing(true);
  };

  const handleSave = () => {
    setContactData({ ...tempData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempData({ ...contactData });
    setIsEditing(false);
  };

  const update = (field: string, value: string) => {
    setTempData((prev) => ({ ...prev, [field]: value }));
  };

  const display = isEditing ? tempData : contactData;

  return (
    <section
      id="contact"
      className="py-20 bg-ink-offwhite dark:bg-gray-900 transition-colors duration-500 scroll-mt-20 relative"
    >
      {/* Edit Controls */}
      <div className="absolute top-4 right-4 z-10">
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="flex items-center gap-1 bg-surface-card border border-ink-light text-ink-paragraph hover:bg-ink-offwhite shadow-md px-3 py-1.5 rounded-md text-sm font-medium"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-1 bg-status-success hover:bg-status-success text-white px-3 py-1.5 rounded-md text-sm font-medium shadow-md"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-1 bg-surface-card border border-ink-light text-ink-paragraph hover:bg-ink-offwhite px-3 py-1.5 rounded-md text-sm font-medium shadow-md"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          {isEditing ? (
            <div className="space-y-3">
              <input
                value={tempData.title}
                onChange={(e) => update("title", e.target.value)}
                className="w-full max-w-md mx-auto block text-4xl font-bold text-ink text-center bg-white/80 border-2 border-dashed border-status-info/40 rounded p-1 focus:border-status-info focus:outline-none"
                maxLength={80}
              />
              <textarea
                value={tempData.description}
                onChange={(e) => update("description", e.target.value)}
                className="w-full max-w-2xl mx-auto block text-ink-paragraph text-lg text-center bg-white/80 border-2 border-dashed border-status-info/40 rounded p-2 focus:border-status-info focus:outline-none resize-none"
                rows={3}
                maxLength={300}
              />
            </div>
          ) : (
            <>
              <h2 className="text-4xl font-bold text-ink dark:text-white mb-3">
                {display.title}
              </h2>
              <p className="text-ink-paragraph dark:text-gray-300 max-w-2xl mx-auto text-lg">
                {display.description}
              </p>
            </>
          )}
        </div>

        {/* Main Card */}
        <div className="grid grid-cols-1 justify-center gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="col-span-2 bg-surface-card dark:bg-gray-800 rounded-2xl shadow-md p-8 lg:p-10"
          >
            {isEditing ? (
              <div className="space-y-3 mb-6">
                <input
                  value={tempData.formTitle}
                  onChange={(e) => update("formTitle", e.target.value)}
                  className="w-full text-xl font-semibold text-ink bg-white/80 border-2 border-dashed border-status-info/40 rounded p-1 focus:border-status-info focus:outline-none"
                  maxLength={80}
                />
                <textarea
                  value={tempData.formDescription}
                  onChange={(e) => update("formDescription", e.target.value)}
                  className="w-full text-ink-caption text-sm bg-white/80 border-2 border-dashed border-status-info/40 rounded p-1 focus:border-status-info focus:outline-none resize-none"
                  rows={2}
                  maxLength={200}
                />
              </div>
            ) : (
              <>
                <h3 className="text-xl font-semibold text-ink dark:text-white mb-2">
                  {display.formTitle}
                </h3>
                <p className="text-ink-caption dark:text-gray-300 mb-6 text-sm">
                  {display.formDescription}
                </p>
              </>
            )}

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-ink-paragraph dark:text-gray-300">First Name</label>
                  <Input placeholder="rahul" className="bg-ink-light dark:bg-gray-700 text-ink dark:text-white border-ink-light dark:border-gray-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-ink-paragraph dark:text-gray-300">Last Name</label>
                  <Input placeholder="sharma" className="bg-ink-light dark:bg-gray-700 text-ink dark:text-white border-ink-light dark:border-gray-600" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-ink-paragraph dark:text-gray-300">Email</label>
                  <Input type="email" placeholder="rahul@company.com" className="bg-ink-light dark:bg-gray-700 text-ink dark:text-white border-ink-light dark:border-gray-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-ink-paragraph dark:text-gray-300">Company</label>
                  <Input placeholder="Your Company" className="bg-ink-light dark:bg-gray-700 text-ink dark:text-white border-ink-light dark:border-gray-600" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-ink-paragraph dark:text-gray-300">Subject</label>
                <select className="w-full rounded-md border border-ink-light dark:border-gray-600 px-3 py-2 bg-ink-light dark:bg-gray-700 text-ink dark:text-white focus:ring-2 focus:ring-brand-yellow transition-all duration-200">
                  <option>General Inquiry</option>
                  <option>Sales Inquiry</option>
                  <option>Products Inquiry</option>
                  <option>Services Inquiry</option>
                  <option>Support Inquiry</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-ink-paragraph dark:text-gray-300">Message</label>
                <Textarea rows={4} placeholder="Tell us about your project and how we can help..." className="resize-none bg-ink-light dark:bg-gray-700 text-ink dark:text-white border-ink-light dark:border-gray-600" />
              </div>
              {isEditing ? (
                <div>
                  <label className="block text-xs text-ink-caption mb-1">Button Label</label>
                  <input
                    value={tempData.ctaButton}
                    onChange={(e) => update("ctaButton", e.target.value)}
                    className="w-full bg-white/80 border-2 border-dashed border-status-info/40 rounded p-2 focus:border-status-info focus:outline-none text-sm"
                    maxLength={50}
                  />
                </div>
              ) : (
                <Button className="w-full bg-brand-yellow hover:bg-brand-gold dark:bg-yellow-500 dark:hover:bg-yellow-600 text-white font-semibold py-4 transition-colors duration-300 text-lg">
                  {display.ctaButton}
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
