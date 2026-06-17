import React, { useState, useRef } from 'react';
import { Handshake, Building2, Brain, Calendar, GraduationCap, Users, Eye, Award, TrendingUp, Mail, Phone, MapPin, CheckCircle, Send } from 'lucide-react';

const PartnerPage = () => {
  const formRef = useRef<HTMLDivElement>(null);
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
  const [submitError, setSubmitError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    setSubmitError('');
    try {
      const response = await fetch('https://0etsqrl2k1.execute-api.ap-south-1.amazonaws.com/postdronetvpartner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (response.ok) {
        setIsSubmitted(true);
      } else {
        setSubmitError(result.error || 'Submission failed. Please try again.');
      }
    } catch {
      setSubmitError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const partnerTypes = [
    { icon: Building2, title: "Drone Manufacturers", description: "Leading manufacturers of commercial and consumer drones looking to showcase their latest innovations." },
    { icon: Brain, title: "AI System Developers", description: "Companies developing artificial intelligence solutions for autonomous flight and drone applications." },
    { icon: Calendar, title: "Event Organizers", description: "Organizations hosting conferences, workshops, and industry events in the drone technology space." },
    { icon: GraduationCap, title: "Educational Institutions", description: "Universities and training centers offering drone technology courses and certification programs." },
    { icon: Users, title: "Industry Players", description: "Service providers, consultants, and other professionals contributing to the drone ecosystem." },
  ];

  const benefits = [
    { icon: Eye, title: "Increased Visibility", description: "Reach over 100,000+ active users in the drone technology community worldwide." },
    { icon: Award, title: "Exclusive Content", description: "Create featured content, sponsored videos, and thought leadership articles on our platform." },
    { icon: TrendingUp, title: "Industry Exposure", description: "Gain exposure at industry events, conferences, and networking opportunities." },
    { icon: Users, title: "Community Access", description: "Connect directly with professionals, enthusiasts, and decision-makers in your target market." },
    { icon: Building2, title: "Brand Recognition", description: "Build brand awareness and establish thought leadership in the drone technology industry." },
    { icon: Handshake, title: "Strategic Partnerships", description: "Form valuable partnerships with other industry leaders and innovative companies." },
  ];

  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Partner</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">Partner <span className="text-yellow-400">With Us</span></h1>
            <p className="text-sm text-white/60 max-w-lg">Partner with Drone TV to connect and innovate globally.</p>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">50+</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Partners</span>
            </div>
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">25+</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Countries</span>
            </div>
          </div>
        </div>
      </div>

      {/* Why Partner */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-5">Why Partner With Drone TV?</h2>
              <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                <p>Drone TV is the world's leading platform for drone technology education, reaching over 100,000 active professionals, enthusiasts, and decision-makers across the globe.</p>
                <p>Our platform offers unparalleled visibility in the drone, AI, and GIS industries, connecting you with the right audience to showcase your innovations, products, and services.</p>
                <p>By partnering with us, you gain access to exclusive content opportunities, industry exposure, and a community of forward-thinking professionals shaping the future of autonomous flight technology.</p>
              </div>
              <button
                onClick={() => {
                  const el = formRef.current;
                  if (el) {
                    const top = el.getBoundingClientRect().top + window.scrollY - 80;
                    window.scrollTo({ top, behavior: 'smooth' });
                  }
                }}
                className="mt-8 bg-black text-white px-7 py-3 rounded-xl font-bold text-sm hover:bg-gray-800 transition-all"
              >
                Become a Partner
              </button>
            </div>
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-8">
              <img src="/images/partner.png" alt="Partnership" className="w-full h-56 object-cover rounded-lg mb-6" />
              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-5">Join Our Growing Network</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-extrabold text-gray-900">100K+</div>
                    <div className="text-xs text-gray-500 mt-1">Active Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-extrabold text-gray-900">50+</div>
                    <div className="text-xs text-gray-500 mt-1">Partners</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-extrabold text-gray-900">25+</div>
                    <div className="text-xs text-gray-500 mt-1">Countries</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Who Can Join */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-1 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
            Who Can Partner With Us?
          </h2>
          <p className="text-sm text-gray-500">We welcome partnerships with various organizations across the drone technology ecosystem.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {partnerTypes.map((type) => {
            const IconComponent = type.icon;
            return (
              <div key={type.title} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="bg-yellow-400 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <IconComponent className="h-6 w-6 text-black" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-2">{type.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{type.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Partnership Benefits */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-1 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
              Partnership Benefits
            </h2>
            <p className="text-sm text-gray-500">Discover the exclusive advantages of partnering with Drone TV.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map((benefit) => {
              const IconComponent = benefit.icon;
              return (
                <div key={benefit.title} className="bg-gray-50 rounded-xl border border-gray-200 p-5 flex items-start gap-4">
                  <div className="bg-yellow-400 rounded-full p-2.5 flex-shrink-0">
                    <IconComponent className="h-5 w-5 text-black" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-1">{benefit.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Partnership Form */}
      <div ref={formRef} className="max-w-6xl mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Ready to Partner With Us?</h2>
            <p className="text-sm text-gray-500">Fill out the form and our team will get back to you within 24 hours.</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                    <input
                      type="text" id="name" name="name" value={formData.name} onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-gray-900 placeholder-gray-400 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address *</label>
                    <input
                      type="email" id="email" name="email" value={formData.email} onChange={handleInputChange}
                      placeholder="Enter your email address"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-gray-900 placeholder-gray-400 text-sm"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number *</label>
                    <input
                      type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-gray-900 placeholder-gray-400 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="whatsapp" className="block text-sm font-semibold text-gray-700 mb-1.5">WhatsApp Number</label>
                    <input
                      type="tel" id="whatsapp" name="whatsapp" value={formData.whatsapp} onChange={handleInputChange}
                      placeholder="Enter your WhatsApp number"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-gray-900 placeholder-gray-400 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="organization" className="block text-sm font-semibold text-gray-700 mb-1.5">Organization Name *</label>
                  <input
                    type="text" id="organization" name="organization" value={formData.organization} onChange={handleInputChange}
                    placeholder="Enter your organization name"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-gray-900 placeholder-gray-400 text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-1.5">Message / Partnership Details *</label>
                  <textarea
                    id="message" name="message" value={formData.message} onChange={handleInputChange}
                    placeholder="Tell us about your organization and how you'd like to partner with Drone TV..."
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-gray-900 placeholder-gray-400 text-sm resize-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-black text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  <span>{isLoading ? 'Submitting...' : 'Become a Partner'}</span>
                </button>
                {submitError && (
                  <p className="mt-3 text-sm text-red-600 text-center">{submitError}</p>
                )}
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="bg-green-500 rounded-full p-5 w-16 h-16 mx-auto mb-5 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Thank You for Your Interest!</h3>
                <p className="text-sm text-gray-500 mb-4">We've received your partnership application and our team will review it shortly.</p>
                <div className="text-sm text-gray-400">
                  <p>Need immediate assistance? Contact us at:</p>
                  <p className="font-semibold text-gray-600">bd@dronetv.in</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contact Strip */}
      <div className="bg-black">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-center gap-3 text-white/70">
              <Mail className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-medium">bd@dronetv.in</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-white/70">
              <Phone className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-medium">+91 7520123555</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-white/70">
              <MapPin className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-medium">Hyderabad - 500008 India</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerPage;
