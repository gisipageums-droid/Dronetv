import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, MessageCircle } from 'lucide-react';

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', phone: '', message: '' });
    
    // Reset success message after 3 seconds
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <section id="contact" className="py-20 bg-ink">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 data-aos="fade-up" className="text-4xl md:text-6xl font-bold text-[#F8C400] mb-4">
            Let's <span className="text-white">Connect</span>
          </h2>
          <div data-aos="fade-up" data-aos-delay="200" className="w-32 h-1 bg-[#F8C400] mx-auto mb-6"></div>
          <p data-aos="fade-up" data-aos-delay="400" className="text-ink-light text-lg max-w-3xl mx-auto">
            Ready to revolutionize your operations with cutting-edge drone technology? Get in touch with our experts today.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div data-aos="fade-right">
            <div className="bg-ink/50 backdrop-blur-sm rounded-3xl p-8 border border-ink-charcoal">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-[#DC2626] rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle size={32} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#F8C400] mb-2">
                  Get a Quote
                </h3>
                <p className="text-ink-caption">
                  Tell us about your project requirements
                </p>
              </div>
              
              {isSubmitted && (
                <div className="bg-status-success/50 border border-status-success rounded-2xl p-4 mb-6 flex items-center gap-3">
                  <CheckCircle className="text-status-success" size={20} />
                  <span className="text-status-success/40 font-medium">
                    Message sent successfully! We'll get back to you within 24 hours.
                  </span>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="group relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-6 py-4 bg-ink-charcoal/50 border-2 border-ink-paragraph rounded-2xl focus:border-[#F8C400] focus:bg-ink-charcoal transition-all duration-300 text-white placeholder-transparent peer"
                      placeholder="Your name"
                    />
                    <label className="absolute left-6 top-4 text-ink-caption transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm peer-focus:text-[#F8C400] peer-valid:top-1 peer-valid:text-sm">
                      Full Name *
                    </label>
                  </div>
                  
                  <div className="group relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-6 py-4 bg-ink-charcoal/50 border-2 border-ink-paragraph rounded-2xl focus:border-[#F8C400] focus:bg-ink-charcoal transition-all duration-300 text-white placeholder-transparent peer"
                      placeholder="your@email.com"
                    />
                    <label className="absolute left-6 top-4 text-ink-caption transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm peer-focus:text-[#F8C400] peer-valid:top-1 peer-valid:text-sm">
                      Email Address *
                    </label>
                  </div>
                </div>
                
                <div className="group relative">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-ink-charcoal/50 border-2 border-ink-paragraph rounded-2xl focus:border-[#F8C400] focus:bg-ink-charcoal transition-all duration-300 text-white placeholder-transparent peer"
                    placeholder="+1 (555) 123-4567"
                  />
                  <label className="absolute left-6 top-4 text-ink-caption transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm peer-focus:text-[#F8C400] peer-valid:top-1 peer-valid:text-sm">
                    Phone Number
                  </label>
                </div>
                
                <div className="group relative">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-6 py-4 bg-ink-charcoal/50 border-2 border-ink-paragraph rounded-2xl focus:border-[#F8C400] focus:bg-ink-charcoal transition-all duration-300 text-white placeholder-transparent peer resize-none"
                    placeholder="Tell us about your project..."
                  />
                  <label className="absolute left-6 top-4 text-ink-caption transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm peer-focus:text-[#F8C400] peer-valid:top-1 peer-valid:text-sm">
                    Project Details *
                  </label>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#DC2626] hover:bg-[#DC2626]/90 disabled:bg-ink-paragraph text-white py-4 px-8 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 transform hover:scale-105 disabled:transform-none shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Map & Contact Info */}
          <div data-aos="fade-left">
            {/* Map Placeholder */}
            <div className="bg-ink-charcoal/50 backdrop-blur-sm rounded-3xl h-64 flex items-center justify-center mb-8 border border-ink-paragraph">
              <div className="text-center">
                <MapPin size={48} className="text-[#F8C400] mx-auto mb-4" />
                <p className="text-ink-caption text-lg font-medium">Interactive Map</p>
                <p className="text-sm text-ink-caption">Google Maps integration</p>
              </div>
            </div>
            
            {/* Contact Info Cards */}
            <div className="space-y-6">
              <div className="bg-ink/50 backdrop-blur-sm rounded-2xl p-6 border border-ink-charcoal hover:border-[#F8C400]/50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#DC2626] rounded-full flex items-center justify-center group-hover:bg-[#F8C400] transition-colors">
                    <Mail size={20} className="text-white group-hover:text-ink" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#F8C400] group-hover:text-white transition-colors">Email</h4>
                    <p className="text-ink-caption group-hover:text-ink-light transition-colors">contact@droneflight.com</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-ink/50 backdrop-blur-sm rounded-2xl p-6 border border-ink-charcoal hover:border-[#F8C400]/50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#DC2626] rounded-full flex items-center justify-center group-hover:bg-[#F8C400] transition-colors">
                    <Phone size={20} className="text-white group-hover:text-ink" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#F8C400] group-hover:text-white transition-colors">Phone</h4>
                    <p className="text-ink-caption group-hover:text-ink-light transition-colors">+1 (555) 123-DRONE</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-ink/50 backdrop-blur-sm rounded-2xl p-6 border border-ink-charcoal hover:border-[#F8C400]/50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#DC2626] rounded-full flex items-center justify-center group-hover:bg-[#F8C400] transition-colors">
                    <MapPin size={20} className="text-white group-hover:text-ink" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#F8C400] group-hover:text-white transition-colors">Address</h4>
                    <p className="text-ink-caption group-hover:text-ink-light transition-colors">Silicon Valley, CA 94025</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;