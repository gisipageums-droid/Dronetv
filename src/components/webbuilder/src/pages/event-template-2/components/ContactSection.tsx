import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, Ticket } from 'lucide-react';

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    ticketType: 'general',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
    setFormData({ name: '', email: '', phone: '', ticketType: 'general', message: '' });
    
    // Reset success message after 3 seconds
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const ticketTypes = [
    { value: 'general', label: 'General Admission - $199', description: 'Access to all sessions and exhibitions' },
    { value: 'vip', label: 'VIP Pass - $399', description: 'Premium access with networking events' },
    { value: 'exhibitor', label: 'Exhibitor Pass - $599', description: 'Booth space and exhibition privileges' },
    { value: 'student', label: 'Student Pass - $99', description: 'Discounted rate for students' }
  ];

  return (
    <section id="contact" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 data-aos="fade-up" className="text-4xl md:text-6xl font-bold text-[#FFD400] mb-4">
            Register <span className="text-white">Now</span>
          </h2>
          <div data-aos="fade-up" data-aos-delay="200" className="w-32 h-1 bg-[#FFD400] mx-auto mb-6"></div>
          <p data-aos="fade-up" data-aos-delay="400" className="text-gray-300 text-lg max-w-3xl mx-auto">
            Secure your spot at the most exciting drone technology event of the year. Limited passes available!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Registration Form */}
          <div data-aos="fade-right">
            <div className="bg-black/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-800">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-[#FF0000] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Ticket size={32} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#FFD400] mb-2">
                  Get Your Pass
                </h3>
                <p className="text-gray-400">
                  Join 5000+ attendees at the ultimate drone expo
                </p>
              </div>
              
              {isSubmitted && (
                <div className="bg-green-900/50 border border-green-600 rounded-2xl p-4 mb-6 flex items-center gap-3">
                  <CheckCircle className="text-green-400" size={20} />
                  <span className="text-green-300 font-medium">
                    Registration successful! Check your email for confirmation details.
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
                      className="w-full px-6 py-4 bg-gray-800/50 border-2 border-gray-700 rounded-2xl focus:border-[#FFD400] focus:bg-gray-800 transition-all duration-300 text-white placeholder-transparent peer"
                      placeholder="Your name"
                    />
                    <label className="absolute left-6 top-4 text-gray-400 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm peer-focus:text-[#FFD400] peer-valid:top-1 peer-valid:text-sm">
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
                      className="w-full px-6 py-4 bg-gray-800/50 border-2 border-gray-700 rounded-2xl focus:border-[#FFD400] focus:bg-gray-800 transition-all duration-300 text-white placeholder-transparent peer"
                      placeholder="your@email.com"
                    />
                    <label className="absolute left-6 top-4 text-gray-400 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm peer-focus:text-[#FFD400] peer-valid:top-1 peer-valid:text-sm">
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
                    className="w-full px-6 py-4 bg-gray-800/50 border-2 border-gray-700 rounded-2xl focus:border-[#FFD400] focus:bg-gray-800 transition-all duration-300 text-white placeholder-transparent peer"
                    placeholder="+1 (555) 123-4567"
                  />
                  <label className="absolute left-6 top-4 text-gray-400 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm peer-focus:text-[#FFD400] peer-valid:top-1 peer-valid:text-sm">
                    Phone Number
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-3">Select Pass Type *</label>
                  <div className="space-y-3">
                    {ticketTypes.map((ticket) => (
                      <label key={ticket.value} className="flex items-start gap-3 p-4 bg-gray-800/30 rounded-xl cursor-pointer hover:bg-gray-800/50 transition-colors">
                        <input
                          type="radio"
                          name="ticketType"
                          value={ticket.value}
                          checked={formData.ticketType === ticket.value}
                          onChange={handleInputChange}
                          className="mt-1 text-[#FF0000] focus:ring-[#FF0000]"
                        />
                        <div>
                          <div className="text-white font-semibold">{ticket.label}</div>
                          <div className="text-gray-400 text-sm">{ticket.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="group relative">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-6 py-4 bg-gray-800/50 border-2 border-gray-700 rounded-2xl focus:border-[#FFD400] focus:bg-gray-800 transition-all duration-300 text-white placeholder-transparent peer resize-none"
                    placeholder="Any special requirements or questions?"
                  />
                  <label className="absolute left-6 top-4 text-gray-400 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm peer-focus:text-[#FFD400] peer-valid:top-1 peer-valid:text-sm">
                    Additional Information
                  </label>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#FF0000] hover:bg-[#FF0000]/90 disabled:bg-gray-600 text-white py-4 px-8 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 transform hover:scale-105 disabled:transform-none shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing Registration...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Register Now
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Event Info & Map */}
          <div data-aos="fade-left">
            {/* Map Placeholder */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl h-64 flex items-center justify-center mb-8 border border-gray-700">
              <div className="text-center">
                <MapPin size={48} className="text-[#FFD400] mx-auto mb-4" />
                <p className="text-white text-lg font-medium">Expo Center Location</p>
                <p className="text-sm text-gray-400">Interactive map integration</p>
              </div>
            </div>
            
            {/* Contact Info Cards */}
            <div className="space-y-6">
              <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 hover:border-[#FFD400]/50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#FF0000] rounded-full flex items-center justify-center group-hover:bg-[#FFD400] transition-colors">
                    <Mail size={20} className="text-white group-hover:text-black" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#FFD400] group-hover:text-white transition-colors">Email</h4>
                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors">register@futureoflightexpo.com</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 hover:border-[#FFD400]/50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#FF0000] rounded-full flex items-center justify-center group-hover:bg-[#FFD400] transition-colors">
                    <Phone size={20} className="text-white group-hover:text-black" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#FFD400] group-hover:text-white transition-colors">Phone</h4>
                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors">+1 (555) EXPO-2025</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 hover:border-[#FFD400]/50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#FF0000] rounded-full flex items-center justify-center group-hover:bg-[#FFD400] transition-colors">
                    <MapPin size={20} className="text-white group-hover:text-black" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#FFD400] group-hover:text-white transition-colors">Venue</h4>
                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors">Los Angeles Convention Center<br />1201 S Figueroa St, LA 90015</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Early Bird Offer */}
            <div className="mt-8 bg-gradient-to-r from-[#FFD400] to-[#FFD400]/80 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-black mb-4">
                🎉 Early Bird Special
              </h3>
              <p className="text-black/80 mb-4">
                Register before June 1st and save up to 40% on all pass types!
              </p>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-black">From $99</span>
                <span className="text-lg text-black/60 line-through">$199</span>
                <span className="bg-[#FF0000] text-white px-2 py-1 rounded text-sm font-semibold">
                  40% OFF
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;