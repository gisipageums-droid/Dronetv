import React, { useState, useCallback } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, MessageCircle } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    
    const timer = setTimeout(() => setIsSubmitted(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const contactInfo = [
    {
      icon: <Mail size={20} className="text-white" />,
      title: "Email",
      content: "bd@ipageums.com"
    },
    {
      icon: <Phone size={20} className="text-white" />,
      title: "Phone",
      content: "+91 7799100040"
    },
    {
      icon: <MapPin size={20} className="text-white" />,
      title: "Locations",
      content: "Hyderabad | Singapore | India"
    }
  ];

  return (
    <section id="contact" className="py-20 bg-[#FFD400]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 data-aos="fade-up" className="text-4xl md:text-5xl font-bold text-black mb-4">
            Get in <span className="text-[#FF0000]">Touch with Us</span>
          </h2>
          <div data-aos="fade-up" data-aos-delay="200" className="w-24 h-1 bg-black mx-auto mb-6"></div>
          <p data-aos="fade-up" data-aos-delay="400" className="text-black/80 max-w-2xl mx-auto text-lg">
            Whether it's aerial mapping, drone training, or media partnerships—we're excited to collaborate with you. Reach out today!
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div data-aos="fade-up" data-aos-delay="600">
            <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-2xl">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-[#FF0000] rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle size={32} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-black mb-2">
                  Send us a message
                </h3>
                <p className="text-gray-600">
                  Our team typically replies within 24 hours.
                </p>
              </div>

              {isSubmitted && (
                <div className="bg-green-100 border border-green-400 rounded-2xl p-4 mb-6 flex items-center gap-3">
                  <CheckCircle className="text-green-600" size={20} />
                  <span className="text-green-800 font-medium">
                    Message sent successfully! We'll be in touch soon.
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {['name', 'email'].map((field) => (
                    <div key={field} className="group relative">
                      <input
                        type={field === 'email' ? 'email' : 'text'}
                        name={field}
                        value={formData[field as keyof typeof formData]}
                        onChange={handleInputChange}
                        required
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-[#FF0000] focus:bg-white transition-all duration-300 text-black placeholder-transparent peer"
                        placeholder={field === 'email' ? 'your@email.com' : 'Your name'}
                      />
                      <label className="absolute left-6 top-4 text-gray-500 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm peer-focus:text-[#FF0000] peer-valid:top-1 peer-valid:text-sm">
                        {field === 'email' ? 'Email Address *' : 'Your Name *'}
                      </label>
                    </div>
                  ))}
                </div>

                <div className="group relative">
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-[#FF0000] focus:bg-white transition-all duration-300 text-black placeholder-transparent peer"
                    placeholder="Subject"
                  />
                  <label className="absolute left-6 top-4 text-gray-500 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm peer-focus:text-[#FF0000] peer-valid:top-1 peer-valid:text-sm">
                    Subject *
                  </label>
                </div>

                <div className="group relative">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-[#FF0000] focus:bg-white transition-all duration-300 text-black placeholder-transparent peer resize-none"
                    placeholder="Your message..."
                  />
                  <label className="absolute left-6 top-4 text-gray-500 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm peer-focus:text-[#FF0000] peer-valid:top-1 peer-valid:text-sm">
                    Message *
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#FF0000] hover:bg-[#FF0000]/90 disabled:bg-gray-400 text-white py-4 px-8 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 transform hover:scale-105 disabled:transform-none shadow-lg hover:shadow-xl"
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

          {/* Optimized Contact Info */}
          <div data-aos="fade-up" data-aos-delay="800" className="grid md:grid-cols-3 gap-6 mt-12">
            {contactInfo.map((info, index) => (
              <div key={index} className="bg-black rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300">
                <div className="w-12 h-12 bg-[#FF0000] rounded-full flex items-center justify-center mx-auto mb-4">
                  {info.icon}
                </div>
                <h4 className="font-bold text-white mb-2">{info.title}</h4>
                <p className="text-gray-400">{info.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(Contact);