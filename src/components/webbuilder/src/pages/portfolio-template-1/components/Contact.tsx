// import React, { useState } from 'react';
// import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

// const Contact: React.FC = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     subject: '',
//     message: ''
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isSubmitted, setIsSubmitted] = useState(false);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     await new Promise(resolve => setTimeout(resolve, 1000));
//     setIsSubmitting(false);
//     setIsSubmitted(true);
//     setFormData({ name: '', email: '', subject: '', message: '' });
//     setTimeout(() => setIsSubmitted(false), 3000);
//   };

//   return (
//     <section id="contact" className="py-20 bg-gray-50 dark:bg-gray-800">
//       <div className="container mx-auto px-4">
//         <div className="text-center mb-16">
//           <h2 data-aos="fade-up" className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-4">
//             Get In <span className="text-[#FF0000]">Touch</span>
//           </h2>
//           <div data-aos="fade-up" data-aos-delay="200" className="w-24 h-1 bg-[#FFD400] mx-auto mb-6"></div>
//           <p data-aos="fade-up" data-aos-delay="400" className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
//             Connect with me for drone training, aerospace education, or research collaboration. I'm currently based in Hyderabad and actively mentoring drone pilots across India.
//           </p>
//         </div>

//         <div className="grid lg:grid-cols-2 gap-16">
//           <div data-aos="fade-right">
//             <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg">
//               <h3 className="text-2xl font-bold text-black dark:text-white mb-6">Send me a message</h3>
//               {isSubmitted && (
//                 <div className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 rounded-lg p-4 mb-6 flex items-center gap-3">
//                   <CheckCircle className="text-green-600 dark:text-green-400" size={20} />
//                   <span className="text-green-800 dark:text-green-200">Message sent successfully! I'll get back to you soon.</span>
//                 </div>
//               )}
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 <div className="grid md:grid-cols-2 gap-6">
//                   <div className="group">
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name *</label>
//                     <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#FF0000] focus:border-transparent transition-all duration-300 text-black dark:text-white" placeholder="Your name" />
//                   </div>
//                   <div className="group">
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email *</label>
//                     <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#FF0000] focus:border-transparent transition-all duration-300 text-black dark:text-white" placeholder="your@email.com" />
//                   </div>
//                 </div>
//                 <div className="group">
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject *</label>
//                   <input type="text" name="subject" value={formData.subject} onChange={handleInputChange} required className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#FF0000] focus:border-transparent transition-all duration-300 text-black dark:text-white" placeholder="Training inquiry / Partnership" />
//                 </div>
//                 <div className="group">
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message *</label>
//                   <textarea name="message" value={formData.message} onChange={handleInputChange} required rows={6} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#FF0000] focus:border-transparent transition-all duration-300 text-black dark:text-white resize-none" placeholder="Tell me how I can help you..." />
//                 </div>
//                 <button type="submit" disabled={isSubmitting} className="w-full bg-[#FF0000] hover:bg-[#FF0000]/90 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105 disabled:transform-none">
//                   {isSubmitting ? (<><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> Sending...</>) : (<><Send size={20} />Send Message</>)}
//                 </button>
//               </form>
//             </div>
//           </div>

//           <div data-aos="fade-left">
//             <div className="space-y-8">
//               <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg">
//                 <h3 className="text-2xl font-bold text-black dark:text-white mb-6">Contact Information</h3>
//                 <div className="space-y-6">
//                   <div className="flex items-center gap-4">
//                     <div className="w-12 h-12 bg-[#FF0000] rounded-full flex items-center justify-center">
//                       <Mail size={20} className="text-white" />
//                     </div>
//                     <div>
//                       <h4 className="font-semibold text-black dark:text-white">Primary Email</h4>
//                       <p className="text-gray-600 dark:text-gray-400">sumit@indiadroneacademy.com</p>
//                       <p className="text-gray-600 dark:text-gray-400">sumitkrishnan99@gmail.com</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-4">
//                     <div className="w-12 h-12 bg-[#FF0000] rounded-full flex items-center justify-center">
//                       <Phone size={20} className="text-white" />
//                     </div>
//                     <div>
//                       <h4 className="font-semibold text-black dark:text-white">Phone</h4>
//                       <p className="text-gray-600 dark:text-gray-400">+91-9580120509</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-4">
//                     <div className="w-12 h-12 bg-[#FF0000] rounded-full flex items-center justify-center">
//                       <MapPin size={20} className="text-white" />
//                     </div>
//                     <div>
//                       <h4 className="font-semibold text-black dark:text-white">Location</h4>
//                       <p className="text-gray-600 dark:text-gray-400">Hyderabad & Lucknow, India</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="bg-[#FFD400] rounded-2xl p-8">
//                 <h3 className="text-2xl font-bold text-black mb-4">Available for Training & Collaborations</h3>
//                 <p className="text-black/80 mb-6">I’m actively involved in drone pilot training, curriculum development, and UAV-based research. Feel free to connect for academic sessions, workshops, or institutional partnerships.</p>
//                 <div className="grid grid-cols-2 gap-4 text-sm">
//                   <div>
//                     <strong className="text-black">Response Time:</strong>
//                     <p className="text-black/70">Within 24–48 hours</p>
//                   </div>
//                   <div>
//                     <strong className="text-black">Session Availability:</strong>
//                     <p className="text-black/70">Slots open this month</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Contact;


import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

interface ContactProps {
  primaryColor?: string;
  accentColor?: string;
  contactMessage?: string;
  email?: string;
  phone?: string;
  location?: string;
  socialLinks?: {
    whatsapp?: string;
    linkedin?: string;
    github?: string;
    instagram?: string;
  };
}

const Contact: React.FC<ContactProps> = ({
  primaryColor = '#FFD400',
  accentColor = '#FF0000',
  contactMessage = "Whether it's aerial mapping, drone training, or media partnerships—we're excited to collaborate with you. Reach out today!",
  email = 'bd@ipageums.com',
  phone = '+65 9006 2901',
  location = 'Singapore & Hyderabad, India',
  socialLinks = {}
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
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
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <section id="contact" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 data-aos="fade-up" className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-4">
            Get In <span style={{ color: accentColor }}>Touch</span>
          </h2>
          <div 
            data-aos="fade-up" 
            data-aos-delay="200" 
            className="w-24 h-1 mx-auto mb-6"
            style={{ backgroundColor: primaryColor }}
          ></div>
          <p data-aos="fade-up" data-aos-delay="400" className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            {contactMessage}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          <div data-aos="fade-right">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-black dark:text-white mb-6">Send me a message</h3>
              {isSubmitted && (
                <div className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 rounded-lg p-4 mb-6 flex items-center gap-3">
                  <CheckCircle className="text-green-600 dark:text-green-400" size={20} />
                  <span className="text-green-800 dark:text-green-200">Message sent successfully! I'll get back to you soon.</span>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name *</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleInputChange} 
                      required 
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-300 text-black dark:text-white" 
                      // style={{ focusRingColor: accentColor }}
                      placeholder="Your name" 
                    />
                  </div>
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email *</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleInputChange} 
                      required 
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-300 text-black dark:text-white" 
                      // style={{ focusRingColor: accentColor }}
                      placeholder="your@email.com" 
                    />
                  </div>
                </div>
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject *</label>
                  <input 
                    type="text" 
                    name="subject" 
                    value={formData.subject} 
                    onChange={handleInputChange} 
                    required 
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-300 text-black dark:text-white" 
                    // style={{ focusRingColor: accentColor }}
                    placeholder="Training inquiry / Partnership" 
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message *</label>
                  <textarea 
                    name="message" 
                    value={formData.message} 
                    onChange={handleInputChange} 
                    required 
                    rows={6} 
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-300 text-black dark:text-white resize-none" 
                    // style={{ focusRingColor: accentColor }}
                    placeholder="Tell me how I can help you..." 
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105 disabled:transform-none"
                  style={{ 
                    backgroundColor: accentColor,
                    color: '#fff',
                    opacity: isSubmitting ? 0.7 : 1
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> 
                      Sending...
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

          <div data-aos="fade-left">
            <div className="space-y-8">
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-black dark:text-white mb-6">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: accentColor }}
                    >
                      <Mail size={20} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-black dark:text-white">Primary Email</h4>
                      <p className="text-gray-600 dark:text-gray-400">{email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: accentColor }}
                    >
                      <Phone size={20} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-black dark:text-white">Phone</h4>
                      <p className="text-gray-600 dark:text-gray-400">{phone}</p>
                      {socialLinks.whatsapp && (
                        <a 
                          href={socialLinks.whatsapp} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-500 hover:underline"
                        >
                          Message on WhatsApp
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: accentColor }}
                    >
                      <MapPin size={20} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-black dark:text-white">Location</h4>
                      <p className="text-gray-600 dark:text-gray-400">{location}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div 
                className="rounded-2xl p-8"
                style={{ backgroundColor: primaryColor }}
              >
                <h3 className="text-2xl font-bold text-black mb-4">Available for Collaborations</h3>
                <p className="text-black/80 mb-6">We're actively involved in drone technology, GIS solutions, and AI integration. Connect with us for partnerships, training programs, or media collaborations.</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong className="text-black">Response Time:</strong>
                    <p className="text-black/70">Within 24–48 hours</p>
                  </div>
                  <div>
                    <strong className="text-black">Availability:</strong>
                    <p className="text-black/70">Global projects</p>
                  </div>
                </div>
                {socialLinks && (
                  <div className="mt-6 flex gap-4">
                    {socialLinks.linkedin && (
                      <a 
                        href={socialLinks.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-black hover:text-black/70 transition-colors"
                      >
                        <span className="sr-only">LinkedIn</span>
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                        </svg>
                      </a>
                    )}
                    {socialLinks.instagram && (
                      <a 
                        href={socialLinks.instagram} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-black hover:text-black/70 transition-colors"
                      >
                        <span className="sr-only">Instagram</span>
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748 1.15.748.353.137.882.3 1.857.344 1.023.047 1.351.058 3.807.058h.468c2.456 0 2.784-.011 3.807-.058.975-.045 1.504-.207 1.857-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.047-1.023.058-1.351.058-3.807v-.468c0-2.456-.011-2.784-.058-3.807-.045-.975-.207-1.504-.344-1.857a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                        </svg>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;