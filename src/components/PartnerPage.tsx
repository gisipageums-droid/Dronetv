import React, { useState } from 'react';
import { Handshake, Building2, Brain, Calendar, GraduationCap, Users, Eye, Award, TrendingUp, Mail, Phone, MapPin, CheckCircle, Send } from 'lucide-react';

const PartnerPage = () => {
const [formData, setFormData] = useState({
  name: '',
  email: '',
  phone: '',
  whatsapp: '',
  organization: '',
  message: ''
});

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

 const handleInputChange = (e : React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement> ) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: value
  }));
};
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  const payload = {
    name: formData.name.trim(),
    email: formData.email.trim(),
    phone: formData.phone.trim(),
    whatsapp: formData.whatsapp.trim(),
    organization: formData.organization.trim(),
    message: formData.message.trim()
  };

  try {
    const response = await fetch('https://0etsqrl2k1.execute-api.ap-south-1.amazonaws.com/postdronetvpartner', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (response.ok) {
      setIsSubmitted(true);
    } else {
      alert("Failed to submit: " + result.error);
    }
  } catch (error) {
    if( error instanceof Error) {
    alert("Network error: " + error.message);
    } else {
      alert("An unexpected error occurred.");
    }
  } finally {
    setIsLoading(false);
  }
};

  const partnerTypes = [
    {
      icon: Building2,
      title: "Drone Manufacturers",
      description: "Leading manufacturers of commercial and consumer drones looking to showcase their latest innovations."
    },
    {
      icon: Brain,
      title: "AI System Developers",
      description: "Companies developing artificial intelligence solutions for autonomous flight and drone applications."
    },
    {
      icon: Calendar,
      title: "Event Organizers",
      description: "Organizations hosting conferences, workshops, and industry events in the drone technology space."
    },
    {
      icon: GraduationCap,
      title: "Educational Institutions",
      description: "Universities and training centers offering drone technology courses and certification programs."
    },
    {
      icon: Users,
      title: "Industry Players",
      description: "Service providers, consultants, and other professionals contributing to the drone ecosystem."
    }
  ];

  const benefits = [
    {
      icon: Eye,
      title: "Increased Visibility",
      description: "Reach over 100,000+ active users in the drone technology community worldwide."
    },
    {
      icon: Award,
      title: "Exclusive Content",
      description: "Create featured content, sponsored videos, and thought leadership articles on our platform."
    },
    {
      icon: TrendingUp,
      title: "Industry Exposure",
      description: "Gain exposure at industry events, conferences, and networking opportunities."
    },
    {
      icon: Users,
      title: "Community Access",
      description: "Connect directly with professionals, enthusiasts, and decision-makers in your target market."
    },
    {
      icon: Building2,
      title: "Brand Recognition",
      description: "Build brand awareness and establish thought leadership in the drone technology industry."
    },
    {
      icon: Handshake,
      title: "Strategic Partnerships",
      description: "Form valuable partnerships with other industry leaders and innovative companies."
    }
  ];

  return (
    <div className="min-h-screen bg-yellow-400 pt-16">
      {/* Hero Section */}
      <section className="py-3 bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-500 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-200/30 rounded-full animate-pulse blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-yellow-600/20 rounded-full animate-pulse blur-2xl" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-2xl md:text-5xl font-black text-black mb-2 tracking-tight">
            Partner With Us

          </h1>
          <p className="text-xl text-black/80 max-w-2xl mx-auto mb-4">
            Partner with Drone TV to connect and innovate globally.
          </p>
          <div className="w-24 h-1 bg-black mx-auto rounded-full"></div>
        </div>
      </section>

      {/* Why Partner With Us Section */}
      <section className="py-4 bg-gradient-to-b from-yellow-400 to-yellow-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-black mb-6">
                Why Partner With Drone TV?
              </h2>
              <div className="space-y-4 text-lg text-black/80 leading-relaxed">
                <p>
                  Drone TV is the world's leading platform for drone technology education, reaching over 100,000 active professionals, enthusiasts, and decision-makers across the globe.
                </p>
                <p>
                  Our platform offers unparalleled visibility in the drone, AI, and GIS industries, connecting you with the right audience to showcase your innovations, products, and services.
                </p>
                <p>
                  By partnering with us, you gain access to exclusive content opportunities, industry exposure, and a community of forward-thinking professionals who are shaping the future of autonomous flight technology.
                </p>
              </div>
              <div className="mt-8">
                <button className="bg-black text-[#f1ee8e] px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Become a Partner
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-[#f1ee8e] rounded-3xl p-8 shadow-2xl">
                <img
                  src="/images/partner.png"
                  alt="Partnership Opportunities"
                  className="w-full h-64 object-cover rounded-2xl mb-6"
                />
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-black mb-4">Join Our Growing Network</h3>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-black text-black">100K+</div>
                      <div className="text-sm text-gray-600">Active Users</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-black text-black">50+</div>
                      <div className="text-sm text-gray-600">Partners</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-black text-black">25+</div>
                      <div className="text-sm text-gray-600">Countries</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who Can Join Section */}
      <section className="py-20 bg-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-black mb-4">
              Who Can Join Our Partnership Program?
            </h2>
            <p className="text-lg text-black/80 max-w-2xl mx-auto">
              We welcome partnerships with various organizations across the drone technology ecosystem
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {partnerTypes.map((type, index) => {
              const IconComponent = type.icon;

              return (
                <div
                  key={type.title}
                  className="bg-[#f1ee8e] rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:scale-105"
                  style={{
                    animationDelay: `${index * 150}ms`,
                    animation: `fadeInUp 0.8s ease-out ${index * 150}ms both`
                  }}
                >
                  <div className="text-center">
                    <div className="bg-yellow-400 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                      <IconComponent className="h-10 w-10 text-black" />
                    </div>
                    <h3 className="text-xl font-bold text-black mb-4">{type.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{type.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Partner Benefits Section */}
      <section className="py-20 bg-gradient-to-b from-yellow-400 to-yellow-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-black mb-4">
              Partnership Benefits
            </h2>
            <p className="text-lg text-black/80 max-w-2xl mx-auto">
              Discover the exclusive advantages of partnering with Drone TV
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;

              return (
                <div
                  key={benefit.title}
                  className="bg-[#f1ee8e] rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:scale-105"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: `fadeInUp 0.8s ease-out ${index * 100}ms both`
                  }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="bg-yellow-400 rounded-full p-3 flex-shrink-0">
                      <IconComponent className="h-6 w-6 text-black" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-black mb-2">{benefit.title}</h3>
                      <p className="text-gray-600 leading-relaxed text-sm">{benefit.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Partnership Form Section */}
      <section className="py-20 bg-yellow-400">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-black mb-4">
              Ready to Partner With Us?
            </h2>
            <p className="text-lg text-black/80 max-w-2xl mx-auto">
              Fill out the form below and our partnership team will get back to you within 24 hours
            </p>
          </div>

          <div className="bg-[#f1ee8e] rounded-3xl p-12 shadow-2xl">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold text-black mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-black placeholder-gray-600 transition-all duration-300 resize-none"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-bold text-black mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-black placeholder-gray-600 transition-all duration-300 resize-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-bold text-black mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-black placeholder-gray-600 transition-all duration-300 resize-none"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="whatsapp" className="block text-sm font-bold text-black mb-2">
                      WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      id="whatsapp"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                      placeholder="Enter your WhatsApp number"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-black placeholder-gray-600 transition-all duration-300 resize-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="organization" className="block text-sm font-bold text-black mb-2">
                    Organization Name *
                  </label>
                  <input
                    type="text"
                    id="organization"
                    name="organization"
                    value={formData.organization}
                    onChange={handleInputChange}
                    placeholder="Enter your organization name"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-black placeholder-gray-600 transition-all duration-300 resize-none"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-bold text-black mb-2">
                    Message / Partnership Details *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us about your organization and how you'd like to partner with Drone TV..."
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-black placeholder-gray-600 transition-all duration-300 resize-none"
                    required
                  ></textarea>
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-black text-[#f1ee8e] px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto shadow-lg"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-[#f1ee8e] border-t-[#f1ee8e] rounded-full animate-spin"></div>
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                    <span>{isLoading ? 'Submitting...' : 'Become a Partner'}</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="bg-green-500 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-[#f1ee8e]" />
                </div>
                <h3 className="text-2xl font-bold text-black mb-4">Thank You for Your Interest!</h3>
                <p className="text-gray-600 mb-6">
                  We've received your partnership application and our team will review it shortly.
                </p>
                <div className="text-sm text-gray-500">
                  <p>Need immediate assistance? Contact us at:</p>
                  <p className="font-semibold">partnership@dronetv.in</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-16 bg-gradient-to-b from-yellow-400 to-yellow-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold text-black mb-8">Get In Touch</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-center gap-3 text-black">
              <Mail className="h-5 w-5" />
              <span className="font-medium">partnership@dronetv.in</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-black">
              <Phone className="h-5 w-5" />
              <span className="font-medium">+91 7520123555</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-black">
              <MapPin className="h-5 w-5" />
              <span className="font-medium">Hyderabad - 500008 India</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PartnerPage;