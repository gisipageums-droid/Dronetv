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

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
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
    { name: "Facebook", icon: Facebook, href: "https://www.facebook.com/dronetv.in", color: "hover:text-blue-600" },
    { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/dronetv.in/", color: "hover:text-pink-600" },
    { name: "Twitter", icon: Twitter, href: "https://x.com/indiadronetv", color: "hover:text-blue-400" },
    { name: "YouTube", icon: Youtube, href: "https://www.youtube.com/@indiadronetv", color: "hover:text-red-600" },
  ];

  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Contact</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">Get In <span className="text-yellow-400">Touch</span></h1>
            <p className="text-sm text-white/60 max-w-lg">Contact us — we're here to help and answer your questions.</p>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">24h</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Response</span>
            </div>
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">bd@</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">dronetv.in</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Send Us a Message</h2>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-gray-900 placeholder-gray-400 text-sm transition-all"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1.5">Phone *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    pattern="^\+?[1-9]\d{7,14}$"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    title="Enter a valid phone number with optional country code"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-gray-900 placeholder-gray-400 text-sm transition-all"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-gray-900 placeholder-gray-400 text-sm transition-all"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-1.5">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us how we can help you..."
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-gray-900 placeholder-gray-400 text-sm transition-all resize-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-black text-white px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                <div className="bg-green-500 rounded-full p-5 w-16 h-16 mx-auto mb-5 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Message Sent!</h3>
                <p className="text-sm text-gray-500 mb-4">We'll get back to you within 24 hours.</p>
                <div className="text-sm text-gray-400">
                  <p>Need immediate help? Call us at</p>
                  <p className="font-semibold text-gray-600">+91 7520123555</p>
                </div>
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Get In Touch</h2>
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="bg-yellow-400 rounded-full p-3 flex-shrink-0">
                    <Mail className="h-5 w-5 text-black" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-0.5">Email</p>
                    <p className="text-sm font-semibold text-gray-900">bd@dronetv.in</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-yellow-400 rounded-full p-3 flex-shrink-0">
                    <Phone className="h-5 w-5 text-black" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-0.5">Phone</p>
                    <p className="text-sm font-semibold text-gray-900">+91 7520123555</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-yellow-400 rounded-full p-3 flex-shrink-0">
                    <MapPin className="h-5 w-5 text-black" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-0.5">Office</p>
                    <p className="text-sm font-semibold text-gray-900">DroneTv 5A/6B, White Waters,<br />Timber Lake Colony, Shaikpet,<br />Hyderabad - 500008 India</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Follow Us</h2>
              <p className="text-sm text-gray-500 mb-5">Stay connected for the latest drone industry updates.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group flex items-center gap-3 p-3.5 rounded-xl border border-gray-200 hover:border-yellow-400 transition-all ${social.color}`}
                    >
                      <div className="bg-yellow-400 rounded-full p-2 group-hover:scale-110 transition-transform">
                        <IconComponent className="h-4 w-4 text-black" />
                      </div>
                      <span className="text-sm font-semibold text-gray-800">{social.name}</span>
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
