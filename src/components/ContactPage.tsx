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
  X,
} from "lucide-react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = ( e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  
  e.preventDefault();
  setIsLoading(true);

  try {
    const res = await fetch('https://zlnlobchx7.execute-api.ap-south-1.amazonaws.com/contact', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const result = await res.json();
    console.log("Lambda response:", result);

    if (res.ok) {
      setIsSubmitted(true);
      setFormData({ name: "", phone: "", email: "", message: "" });
      setTimeout(() => setIsSubmitted(false), 5000);
    } else {
      alert(result.error || "Something went wrong");
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    alert("Network error, please try again.");
  } finally {
    setIsLoading(false);
  }
};


  const socialLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      href: "https://www.facebook.com/dronetv.in",
      color: "hover:text-blue-600",
    },
    {
      name: "Instagram",
      icon: Instagram,
      href: "https://www.instagram.com/dronetv.in/",
      color: "hover:text-pink-600",
    },
    {
      name: "Twitter",
      icon: X,
      href: "https://x.com/indiadronetv",
      color: "hover:text-blue-400",
    }, // Updated with X
    {
      name: "YouTube",
      icon: Youtube,
      href: "https://www.youtube.com/@indiadronetv",
      color: "hover:text-red-600",
    },
  ];

  return (
    <div className="min-h-screen bg-yellow-400 pt-16">
      {/* Hero Section */}
      <section className="py-3 bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-500 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-200/30 rounded-full animate-pulse blur-2xl"></div>
          <div
            className="absolute bottom-10 right-10 w-40 h-40 bg-yellow-600/20 rounded-full animate-pulse blur-2xl"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-2xl md:text-5xl font-black text-black mb-2 tracking-tight">
            Contact Us
          </h1>
          <p className="text-xl text-black/80 max-w-2xl mx-auto mb-4">
            Contact us—we're here to help and answer your questions.
          </p>
          <div className="w-24 h-1 bg-black mx-auto rounded-full"></div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-4 bg-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form Section */}
            <div className="bg-[#f1ee8e] rounded-3xl p-8 shadow-2xl">
              <h2 className="text-3xl font-black text-black mb-6">
                Send Us a Message
              </h2>

              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-bold text-black mb-2"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-black placeholder-gray-500 transition-all duration-300"
                      required
                      />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-bold text-black mb-2"
                      >
                      Phone *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      pattern="^\+?[1-9]\d{7,14}$"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      title="Enter a valid phone number with optional country code"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-black placeholder-gray-500 transition-all duration-300"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-bold text-black mb-2"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-black placeholder-gray-500 transition-all duration-300"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-bold text-black mb-2"
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us how we can help you..."
                      rows={6}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-black placeholder-gray-500 transition-all duration-300"
                      required
                    ></textarea>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-black text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <Send className="h-5 w-5" />
                      )}
                      <span>{isLoading ? "Sending..." : "Send Message"}</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-8">
                  <div className="bg-green-500 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <CheckCircle className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-black mb-4">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Thank you for reaching out to us. We've received your
                    message and will get back to you within 24 hours.
                  </p>
                  <div className="text-sm text-gray-500">
                    <p>Need immediate assistance?</p>
                    <p className="font-semibold">
                      Call us at +1 (555) 123-4567
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Contact Info Section */}
            <div className="space-y-8">
              {/* Our Info Section */}
              <div className="bg-[#f1ee8e] rounded-3xl p-8 shadow-2xl">
                <h2 className="text-3xl font-black text-black mb-6">
                  Get In Touch
                </h2>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-yellow-400 rounded-full p-4 flex-shrink-0">
                      <Mail className="h-6 w-6 text-black" />
                    </div>
                    <div>
                      <h3 className="font-bold text-black">Email Address</h3>
                      <p className="text-gray-600">bd@dronetv.in</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="bg-yellow-400 rounded-full p-4 flex-shrink-0">
                      <Phone className="h-6 w-6 text-black" />
                    </div>
                    <div>
                      <h3 className="font-bold text-black">Phone Number</h3>
                      <p className="text-gray-600">+91 7520123555</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="bg-yellow-400 rounded-full p-4 flex-shrink-0">
                      <MapPin className="h-6 w-6 text-black" />
                    </div>
                    <div>
                      <h3 className="font-bold text-black">Office Location</h3>
                      <p className="text-gray-600">
                        DroneTv 5A/6B, White Waters,
                      </p>
                      <p className="text-gray-600">
                        Timber Lake Colony, Shaikpet,
                      </p>
                      <p className="text-gray-600">Hyderabad - 500008 India</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media Section */}
              <div className="bg-[#f1ee8e]  rounded-3xl p-8 shadow-2xl">
                <h2 className="text-3xl font-black text-black mb-6">
                  Follow Us
                </h2>
                <p className="text-gray-600 mb-6">
                  Stay connected with us on social media for the latest updates,
                  news, and insights from the drone technology world.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  {socialLinks.map((social, index) => {
                    const IconComponent = social.icon;
                    return (
                      <a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        className={`group flex items-center space-x-3 p-4 rounded-xl border-2 border-gray-200 hover:border-yellow-400 transition-all duration-300 transform hover:scale-105 ${social.color}`}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="bg-yellow-400 rounded-full p-2 group-hover:scale-110 transition-transform duration-300">
                          <IconComponent className="h-5 w-5 text-black" />
                        </div>
                        <span className="font-semibold text-black group-hover:text-gray-800 transition-colors duration-300">
                          {social.name}
                        </span>
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Additional Info */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
