// import React, { useState } from 'react';
// import { Mail, Phone, MapPin, Send, CheckCircle, Ticket } from 'lucide-react';

// const ContactSection: React.FC = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     ticketType: 'general',
//     message: ''
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isSubmitted, setIsSubmitted] = useState(false);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);
    
//     // Simulate form submission
//     await new Promise(resolve => setTimeout(resolve, 1000));
    
//     setIsSubmitting(false);
//     setIsSubmitted(true);
//     setFormData({ name: '', email: '', phone: '', ticketType: 'general', message: '' });
    
//     // Reset success message after 3 seconds
//     setTimeout(() => setIsSubmitted(false), 3000);
//   };

//   const ticketTypes = [
//     { value: 'general', label: 'General Admission - $199', description: 'Access to all sessions and exhibitions' },
//     { value: 'vip', label: 'VIP Pass - $399', description: 'Premium access with networking events' },
//     { value: 'exhibitor', label: 'Exhibitor Pass - $599', description: 'Booth space and exhibition privileges' },
//     { value: 'student', label: 'Student Pass - $99', description: 'Discounted rate for students' }
//   ];

//   return (
//     <section id="contact" className="py-20 bg-gray-900">
//       <div className="container mx-auto px-4">
//         <div className="text-center mb-16">
//           <h2 data-aos="fade-up" className="text-4xl md:text-6xl font-bold text-[#FFD400] mb-4">
//             Register <span className="text-white">Now</span>
//           </h2>
//           <div data-aos="fade-up" data-aos-delay="200" className="w-32 h-1 bg-[#FFD400] mx-auto mb-6"></div>
//           <p data-aos="fade-up" data-aos-delay="400" className="text-gray-300 text-lg max-w-3xl mx-auto">
//             Secure your spot at the most exciting drone technology event of the year. Limited passes available!
//           </p>
//         </div>

//         <div className="grid lg:grid-cols-2 gap-16">
//           {/* Registration Form */}
//           <div data-aos="fade-right">
//             <div className="bg-black/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-800">
//               <div className="text-center mb-8">
//                 <div className="w-16 h-16 bg-[#FF0000] rounded-full flex items-center justify-center mx-auto mb-4">
//                   <Ticket size={32} className="text-white" />
//                 </div>
//                 <h3 className="text-2xl font-bold text-[#FFD400] mb-2">
//                   Get Your Pass
//                 </h3>
//                 <p className="text-gray-400">
//                   Join 5000+ attendees at the ultimate drone expo
//                 </p>
//               </div>
              
//               {isSubmitted && (
//                 <div className="bg-green-900/50 border border-green-600 rounded-2xl p-4 mb-6 flex items-center gap-3">
//                   <CheckCircle className="text-green-400" size={20} />
//                   <span className="text-green-300 font-medium">
//                     Registration successful! Check your email for confirmation details.
//                   </span>
//                 </div>
//               )}
              
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 <div className="grid md:grid-cols-2 gap-6">
//                   <div className="group relative">
//                     <input
//                       type="text"
//                       name="name"
//                       value={formData.name}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-6 py-4 bg-gray-800/50 border-2 border-gray-700 rounded-2xl focus:border-[#FFD400] focus:bg-gray-800 transition-all duration-300 text-white placeholder-transparent peer"
//                       placeholder="Your name"
//                     />
//                     <label className="absolute left-6 top-4 text-gray-400 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm peer-focus:text-[#FFD400] peer-valid:top-1 peer-valid:text-sm">
//                       Full Name *
//                     </label>
//                   </div>
                  
//                   <div className="group relative">
//                     <input
//                       type="email"
//                       name="email"
//                       value={formData.email}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-6 py-4 bg-gray-800/50 border-2 border-gray-700 rounded-2xl focus:border-[#FFD400] focus:bg-gray-800 transition-all duration-300 text-white placeholder-transparent peer"
//                       placeholder="your@email.com"
//                     />
//                     <label className="absolute left-6 top-4 text-gray-400 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm peer-focus:text-[#FFD400] peer-valid:top-1 peer-valid:text-sm">
//                       Email Address *
//                     </label>
//                   </div>
//                 </div>
                
//                 <div className="group relative">
//                   <input
//                     type="tel"
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleInputChange}
//                     className="w-full px-6 py-4 bg-gray-800/50 border-2 border-gray-700 rounded-2xl focus:border-[#FFD400] focus:bg-gray-800 transition-all duration-300 text-white placeholder-transparent peer"
//                     placeholder="+1 (555) 123-4567"
//                   />
//                   <label className="absolute left-6 top-4 text-gray-400 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm peer-focus:text-[#FFD400] peer-valid:top-1 peer-valid:text-sm">
//                     Phone Number
//                   </label>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-400 mb-3">Select Pass Type *</label>
//                   <div className="space-y-3">
//                     {ticketTypes.map((ticket) => (
//                       <label key={ticket.value} className="flex items-start gap-3 p-4 bg-gray-800/30 rounded-xl cursor-pointer hover:bg-gray-800/50 transition-colors">
//                         <input
//                           type="radio"
//                           name="ticketType"
//                           value={ticket.value}
//                           checked={formData.ticketType === ticket.value}
//                           onChange={handleInputChange}
//                           className="mt-1 text-[#FF0000] focus:ring-[#FF0000]"
//                         />
//                         <div>
//                           <div className="text-white font-semibold">{ticket.label}</div>
//                           <div className="text-gray-400 text-sm">{ticket.description}</div>
//                         </div>
//                       </label>
//                     ))}
//                   </div>
//                 </div>
                
//                 <div className="group relative">
//                   <textarea
//                     name="message"
//                     value={formData.message}
//                     onChange={handleInputChange}
//                     rows={4}
//                     className="w-full px-6 py-4 bg-gray-800/50 border-2 border-gray-700 rounded-2xl focus:border-[#FFD400] focus:bg-gray-800 transition-all duration-300 text-white placeholder-transparent peer resize-none"
//                     placeholder="Any special requirements or questions?"
//                   />
//                   <label className="absolute left-6 top-4 text-gray-400 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm peer-focus:text-[#FFD400] peer-valid:top-1 peer-valid:text-sm">
//                     Additional Information
//                   </label>
//                 </div>
                
//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="w-full bg-[#FF0000] hover:bg-[#FF0000]/90 disabled:bg-gray-600 text-white py-4 px-8 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 transform hover:scale-105 disabled:transform-none shadow-lg hover:shadow-xl"
//                 >
//                   {isSubmitting ? (
//                     <>
//                       <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                       Processing Registration...
//                     </>
//                   ) : (
//                     <>
//                       <Send size={20} />
//                       Register Now
//                     </>
//                   )}
//                 </button>
//               </form>
//             </div>
//           </div>

//           {/* Event Info & Map */}
//           <div data-aos="fade-left">
//             {/* Map Placeholder */}
//             <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl h-64 flex items-center justify-center mb-8 border border-gray-700">
//               <div className="text-center">
//                 <MapPin size={48} className="text-[#FFD400] mx-auto mb-4" />
//                 <p className="text-white text-lg font-medium">Expo Center Location</p>
//                 <p className="text-sm text-gray-400">Interactive map integration</p>
//               </div>
//             </div>
            
//             {/* Contact Info Cards */}
//             <div className="space-y-6">
//               <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 hover:border-[#FFD400]/50 transition-colors group">
//                 <div className="flex items-center gap-4">
//                   <div className="w-12 h-12 bg-[#FF0000] rounded-full flex items-center justify-center group-hover:bg-[#FFD400] transition-colors">
//                     <Mail size={20} className="text-white group-hover:text-black" />
//                   </div>
//                   <div>
//                     <h4 className="font-semibold text-[#FFD400] group-hover:text-white transition-colors">Email</h4>
//                     <p className="text-gray-400 group-hover:text-gray-300 transition-colors">register@futureoflightexpo.com</p>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 hover:border-[#FFD400]/50 transition-colors group">
//                 <div className="flex items-center gap-4">
//                   <div className="w-12 h-12 bg-[#FF0000] rounded-full flex items-center justify-center group-hover:bg-[#FFD400] transition-colors">
//                     <Phone size={20} className="text-white group-hover:text-black" />
//                   </div>
//                   <div>
//                     <h4 className="font-semibold text-[#FFD400] group-hover:text-white transition-colors">Phone</h4>
//                     <p className="text-gray-400 group-hover:text-gray-300 transition-colors">+1 (555) EXPO-2025</p>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 hover:border-[#FFD400]/50 transition-colors group">
//                 <div className="flex items-center gap-4">
//                   <div className="w-12 h-12 bg-[#FF0000] rounded-full flex items-center justify-center group-hover:bg-[#FFD400] transition-colors">
//                     <MapPin size={20} className="text-white group-hover:text-black" />
//                   </div>
//                   <div>
//                     <h4 className="font-semibold text-[#FFD400] group-hover:text-white transition-colors">Venue</h4>
//                     <p className="text-gray-400 group-hover:text-gray-300 transition-colors">Los Angeles Convention Center<br />1201 S Figueroa St, LA 90015</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Early Bird Offer */}
//             <div className="mt-8 bg-gradient-to-r from-[#FFD400] to-[#FFD400]/80 rounded-2xl p-6">
//               <h3 className="text-xl font-bold text-black mb-4">
//                 🎉 Early Bird Special
//               </h3>
//               <p className="text-black/80 mb-4">
//                 Register before June 1st and save up to 40% on all pass types!
//               </p>
//               <div className="flex items-center gap-4">
//                 <span className="text-2xl font-bold text-black">From $99</span>
//                 <span className="text-lg text-black/60 line-through">$199</span>
//                 <span className="bg-[#FF0000] text-white px-2 py-1 rounded text-sm font-semibold">
//                   40% OFF
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ContactSection;




import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, Ticket, Edit2 } from 'lucide-react';

const ContactSection: React.FC = () => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    ticketType: 'general',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Editable Content States
  const [heading, setHeading] = useState('Register');
  const [subHeading, setSubHeading] = useState('Now');
  const [description, setDescription] = useState(
    "Secure your spot at the most exciting drone technology event of the year. Limited passes available!"
  );
  const [ticketTypes, setTicketTypes] = useState([
    { value: 'general', label: 'General Admission - $199', description: 'Access to all sessions and exhibitions' },
    { value: 'vip', label: 'VIP Pass - $399', description: 'Premium access with networking events' },
    { value: 'exhibitor', label: 'Exhibitor Pass - $599', description: 'Booth space and exhibition privileges' },
    { value: 'student', label: 'Student Pass - $99', description: 'Discounted rate for students' }
  ]);
  const [contactInfo, setContactInfo] = useState([
    { type: 'email', label: 'Email', value: 'register@futureoflightexpo.com' },
    { type: 'phone', label: 'Phone', value: '+1 (555) EXPO-2025' },
    { type: 'venue', label: 'Venue', value: 'Los Angeles Convention Center\n1201 S Figueroa St, LA 90015' }
  ]);
  const [earlyBird, setEarlyBird] = useState({
    title: '🎉 Early Bird Special',
    text: 'Register before June 1st and save up to 40% on all pass types!',
    fromPrice: 'From $99',
    originalPrice: '$199',
    discount: '40% OFF'
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTicketChange = (index: number, field: string, value: string) => {
    const updated = [...ticketTypes];
    updated[index][field] = value;
    setTicketTypes(updated);
  };

  const handleContactChange = (index: number, value: string) => {
    const updated = [...contactInfo];
    updated[index].value = value;
    setContactInfo(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', phone: '', ticketType: 'general', message: '' });

    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <section id="contact" className="py-20 bg-gray-900 relative">
      {/* Edit Button */}
      <button
        onClick={() => setEditing(!editing)}
        className="absolute top-6 right-6 z-20 bg-[#FFD400] hover:bg-[#FFD400]/90 text-black px-4 py-2 rounded-full font-semibold transition-all flex items-center gap-2"
      >
        <Edit2 size={16} />
        {editing ? 'Done' : 'Edit'}
      </button>

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          {editing ? (
            <input
              value={heading}
              onChange={e => setHeading(e.target.value)}
              className="text-4xl md:text-6xl font-bold text-[#FFD400] mb-2 bg-transparent border-b border-[#FFD400] text-center"
            />
          ) : (
            <h2 className="text-4xl md:text-6xl font-bold text-[#FFD400] mb-2">
              {heading}{' '}
              <span className="text-white">
                {editing ? (
                  <input
                    value={subHeading}
                    onChange={e => setSubHeading(e.target.value)}
                    className="text-white bg-transparent border-b border-white"
                  />
                ) : (
                  subHeading
                )}
              </span>
            </h2>
          )}

          {editing ? (
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="text-gray-300 text-lg max-w-3xl mx-auto bg-transparent border border-gray-600 p-2 rounded w-full"
            />
          ) : (
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">{description}</p>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Registration Form */}
          <div data-aos="fade-right">
            <div className="bg-black/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-800">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-[#FF0000] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Ticket size={32} className="text-white" />
                </div>
                {editing ? (
                  <input
                    value={earlyBird.title}
                    onChange={e => setEarlyBird(prev => ({ ...prev, title: e.target.value }))}
                    className="text-2xl font-bold text-[#FFD400] mb-2 bg-transparent border-b border-[#FFD400] text-center"
                  />
                ) : (
                  <h3 className="text-2xl font-bold text-[#FFD400] mb-2">Get Your Pass</h3>
                )}
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
                    {ticketTypes.map((ticket, index) => (
                      <label
                        key={ticket.value}
                        className="flex items-start gap-3 p-4 bg-gray-800/30 rounded-xl cursor-pointer hover:bg-gray-800/50 transition-colors"
                      >
                        {editing ? (
                          <div className="flex flex-col gap-1 w-full">
                            <input
                              value={ticket.label}
                              onChange={e => handleTicketChange(index, 'label', e.target.value)}
                              className="bg-transparent text-white border-b border-white px-1 py-0.5 rounded"
                            />
                            <textarea
                              value={ticket.description}
                              onChange={e => handleTicketChange(index, 'description', e.target.value)}
                              className="bg-transparent text-gray-300 border-b border-gray-500 px-1 py-0.5 rounded resize-none"
                            />
                          </div>
                        ) : (
                          <>
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
                          </>
                        )}
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
          <div data-aos="fade-left" className="space-y-6">
            {/* Map */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl h-64 flex items-center justify-center mb-8 border border-gray-700">
              <div className="text-center">
                <MapPin size={48} className="text-[#FFD400] mx-auto mb-4" />
                {editing ? (
                  <textarea
                    value={contactInfo[2].value}
                    onChange={e => handleContactChange(2, e.target.value)}
                    className="bg-transparent text-white border-b border-white p-1 rounded w-full resize-none text-center"
                  />
                ) : (
                  <>
                    <p className="text-white text-lg font-medium">Expo Center Location</p>
                    <p className="text-sm text-gray-400">{contactInfo[2].value}</p>
                  </>
                )}
              </div>
            </div>

            {/* Contact Cards */}
            {contactInfo.slice(0, 2).map((info, index) => (
              <div
                key={index}
                className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 hover:border-[#FFD400]/50 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#FF0000] rounded-full flex items-center justify-center group-hover:bg-[#FFD400] transition-colors">
                    {info.type === 'email' ? <Mail size={20} className="text-white group-hover:text-black" /> : <Phone size={20} className="text-white group-hover:text-black" />}
                  </div>
                  <div className="flex-1">
                    {editing ? (
                      <input
                        value={info.value}
                        onChange={e => handleContactChange(index, e.target.value)}
                        className="bg-transparent text-white border-b border-white w-full px-1 py-0.5 rounded"
                      />
                    ) : (
                      <>
                        <h4 className="font-semibold text-[#FFD400] group-hover:text-white transition-colors">{info.label}</h4>
                        <p className="text-gray-400 group-hover:text-gray-300 transition-colors">{info.value}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Early Bird */}
            <div className="mt-8 bg-gradient-to-r from-[#FFD400] to-[#FFD400]/80 rounded-2xl p-6">
              {editing ? (
                <div className="flex flex-col gap-2">
                  <input
                    value={earlyBird.title}
                    onChange={e => setEarlyBird(prev => ({ ...prev, title: e.target.value }))}
                    className="bg-transparent font-bold text-black text-xl border-b border-black px-1 py-0.5 rounded"
                  />
                  <textarea
                    value={earlyBird.text}
                    onChange={e => setEarlyBird(prev => ({ ...prev, text: e.target.value }))}
                    className="bg-transparent text-black border-b border-black px-1 py-0.5 rounded resize-none"
                  />
                  <div className="flex items-center gap-4">
                    <input
                      value={earlyBird.fromPrice}
                      onChange={e => setEarlyBird(prev => ({ ...prev, fromPrice: e.target.value }))}
                      className="bg-transparent font-bold text-black border-b border-black px-1 py-0.5 rounded"
                    />
                    <input
                      value={earlyBird.originalPrice}
                      onChange={e => setEarlyBird(prev => ({ ...prev, originalPrice: e.target.value }))}
                      className="bg-transparent text-black/60 line-through border-b border-black/50 px-1 py-0.5 rounded"
                    />
                    <input
                      value={earlyBird.discount}
                      onChange={e => setEarlyBird(prev => ({ ...prev, discount: e.target.value }))}
                      className="bg-[#FF0000] text-white px-2 py-1 rounded text-sm font-semibold"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-black mb-4">{earlyBird.title}</h3>
                  <p className="text-black/80 mb-4">{earlyBird.text}</p>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-black">{earlyBird.fromPrice}</span>
                    <span className="text-lg text-black/60 line-through">{earlyBird.originalPrice}</span>
                    <span className="bg-[#FF0000] text-white px-2 py-1 rounded text-sm font-semibold">{earlyBird.discount}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
