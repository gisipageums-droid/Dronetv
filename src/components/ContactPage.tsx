import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
} from "lucide-react";
import { ADMIN_API, LAMBDA } from '../lib/apiConfig';
import CompactHero from './common/CompactHero';

const TOPIC_MESSAGE: Record<string, string> = {
  "list-rpto":
    "I run a DGCA-approved RPTO and would like to list it on DroneTv.in's Training section.\n\nRPTO name:\nDGCA approval number:\nLocation:\nWebsite (if any):\n\n(We'll follow up for a copy of your DGCA approval certificate.)",
};

const ContactPage = () => {
  const topic =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("topic") || ""
      : "";
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: TOPIC_MESSAGE[topic] || "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(ADMIN_API ? `${ADMIN_API}/contact` : `${LAMBDA.contact}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (res.ok) {
        setIsSubmitted(true);
        setFormData({ name: "", phone: "", email: "", message: "" });
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        alert(result.error || "Something went wrong");
      }
    } catch {
      alert("Network error, please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "https://www.facebook.com/dronetv.in", color: "hover:text-status-info" },
    { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/dronetv.in/", color: "hover:text-status-error" },
    { name: "Twitter", icon: Twitter, href: "https://x.com/indiadronetv", color: "hover:text-status-info" },
    { name: "YouTube", icon: Youtube, href: "https://www.youtube.com/@indiadronetv", color: "hover:text-status-error" },
  ];

  return (
    <div className="pt-20 min-h-screen bg-surface-main">
      {/* Hero */}
      <CompactHero
        title={<>Get In <span>Touch</span></>}
        stats={[
          { n: '24h', l: 'Response' },
          { n: 'bd@', l: 'dronetv.in' },
        ]}
      />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-surface-card rounded-xl border border-ink-light shadow-sm p-8">
            <h2 className="text-xl font-bold text-ink mb-6">Send Us a Message</h2>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-ink-paragraph mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 rounded-xl border border-ink-light bg-ink-offwhite focus:outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow text-ink placeholder-ink-caption text-sm transition-all"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-ink-paragraph mb-1.5">Phone *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    pattern="^\+?[1-9]\d{7,14}$"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    title="Enter a valid phone number with optional country code"
                    className="w-full px-4 py-3 rounded-xl border border-ink-light bg-ink-offwhite focus:outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow text-ink placeholder-ink-caption text-sm transition-all"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-ink-paragraph mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 rounded-xl border border-ink-light bg-ink-offwhite focus:outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow text-ink placeholder-ink-caption text-sm transition-all"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-ink-paragraph mb-1.5">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us how we can help you..."
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-ink-light bg-ink-offwhite focus:outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow text-ink placeholder-ink-caption text-sm transition-all resize-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-ink text-white px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-ink-charcoal transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  <span>{isLoading ? "Sending..." : "Send Message"}</span>
                </button>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="bg-status-success rounded-full p-5 w-16 h-16 mx-auto mb-5 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-ink mb-3">Message Sent!</h3>
                <p className="text-sm text-ink-caption mb-4">We'll get back to you within 24 hours.</p>
                <div className="text-sm text-ink-caption">
                  <p>Need immediate help? Call us at</p>
                  <p className="font-semibold text-ink-paragraph">+91 7520123555</p>
                </div>
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-surface-card rounded-xl border border-ink-light shadow-sm p-8">
              <h2 className="text-xl font-bold text-ink mb-6">Get In Touch</h2>
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="bg-brand-yellow rounded-full p-3 flex-shrink-0">
                    <Mail className="h-5 w-5 text-ink" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-ink-caption uppercase tracking-wide mb-0.5">Email</p>
                    <p className="text-sm font-semibold text-ink">bd@dronetv.in</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-brand-yellow rounded-full p-3 flex-shrink-0">
                    <Phone className="h-5 w-5 text-ink" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-ink-caption uppercase tracking-wide mb-0.5">Phone</p>
                    <p className="text-sm font-semibold text-ink">+91 7520123555</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-brand-yellow rounded-full p-3 flex-shrink-0">
                    <MapPin className="h-5 w-5 text-ink" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-ink-caption uppercase tracking-wide mb-0.5">Office</p>
                    <p className="text-sm font-semibold text-ink">DroneTv 5A/6B, White Waters,<br />Timber Lake Colony, Shaikpet,<br />Hyderabad - 500008 India</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-surface-card rounded-xl border border-ink-light shadow-sm p-8">
              <h2 className="text-xl font-bold text-ink mb-2">Follow Us</h2>
              <p className="text-sm text-ink-caption mb-5">Stay connected for the latest drone industry updates.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group flex items-center gap-3 p-3.5 rounded-xl border border-ink-light hover:border-brand-yellow transition-all ${social.color}`}
                    >
                      <div className="bg-brand-yellow rounded-full p-2 group-hover:scale-110 transition-transform">
                        <IconComponent className="h-4 w-4 text-ink" />
                      </div>
                      <span className="text-sm font-semibold text-ink-charcoal">{social.name}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
