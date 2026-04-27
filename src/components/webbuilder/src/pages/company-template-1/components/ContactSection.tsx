import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send } from 'lucide-react';

interface ContactSectionProps {
  contactTitle: string;
  email: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pinCode: string;
  mapEmbedUrl: string;
  contactFormText: string;
  submitButtonText: string;
}

const ContactSection: React.FC<ContactSectionProps> = ({
  contactTitle,
  email,
  phone,
  addressLine,
  city,
  state,
  pinCode,
  mapEmbedUrl,
  contactFormText,
  submitButtonText,
}) => {
  // Basic local form state (demo)
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // TODO: Integrate with your backend API/mail service
  };

  return (
    <section className="w-full py-16 md:py-24 bg-[#FFD400] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#FF0000] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-[#FF0000] rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-black mb-6 leading-tight">
            {contactTitle}
          </h2>
          
          {/* Decorative line */}
          <div className="flex items-center gap-3 mb-8 justify-center">
            <div className="h-1 w-20 bg-[#FF0000] rounded-full"></div>
            <div className="h-1 w-12 bg-black rounded-full"></div>
            <div className="h-1 w-6 bg-white rounded-full"></div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Left Column - Contact Info & Map */}
          <div className="space-y-8">
            
            {/* Contact Details Card */}
            <div className="group relative bg-white rounded-3xl p-8 lg:p-10 shadow-2xl border-4 border-transparent hover:border-[#FF0000] transition-all duration-500 transform hover:-translate-y-3 hover:scale-105">
              {/* Background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFD400]/10 to-[#FF0000]/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <h3 className="text-2xl lg:text-3xl font-bold text-black mb-8 group-hover:text-[#FF0000] transition-colors duration-300">
                  Contact Details
                </h3>
                
                {/* Contact Items */}
                <div className="space-y-6">
                  {/* Phone */}
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#FF0000] to-[#FF0000]/80 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-600 mb-1">Phone</div>
                      <a 
                        href={`tel:${phone}`} 
                        className="text-lg font-bold text-[#FF0000] hover:text-[#FFD400] transition-colors duration-300"
                      >
                        {phone}
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#FF0000] to-[#FF0000]/80 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-600 mb-1">Email</div>
                      <a 
                        href={`mailto:${email}`} 
                        className="text-lg font-bold text-[#FF0000] hover:text-[#FFD400] transition-colors duration-300"
                      >
                        {email}
                      </a>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#FF0000] to-[#FF0000]/80 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-600 mb-1">Address</div>
                      <div className="text-base text-gray-700 leading-relaxed">
                        {addressLine}<br />
                        {city}, {state}, {pinCode}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-[#FFD400] to-[#FF0000] rounded-bl-2xl rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>

            {/* Map Card */}
            <div className="group relative bg-white rounded-3xl p-4 shadow-2xl border-4 border-transparent hover:border-[#FF0000] transition-all duration-500 transform hover:-translate-y-3 hover:scale-105">
              {/* Background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFD400]/10 to-[#FF0000]/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="h-64 lg:h-80 w-full rounded-2xl overflow-hidden shadow-lg">
                  <iframe
                    src={mapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Location Map"
                    className="transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>

              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-[#FFD400] to-[#FF0000] rounded-bl-2xl rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="group relative bg-white rounded-3xl p-8 lg:p-10 shadow-2xl border-4 border-transparent hover:border-[#FF0000] transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 h-fit">
            {/* Background gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFD400]/10 to-[#FF0000]/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <h3 className="text-2xl lg:text-3xl font-bold text-black mb-2 group-hover:text-[#FF0000] transition-colors duration-300">
                {contactFormText}
              </h3>
              
              {/* Decorative line */}
              <div className="flex items-center gap-2 mb-8">
                <div className="h-1 w-12 bg-[#FF0000] rounded-full"></div>
                <div className="h-1 w-8 bg-[#FFD400] rounded-full"></div>
                <div className="h-1 w-4 bg-black rounded-full"></div>
              </div>

              {!submitted ? (
                <form className="space-y-6" onSubmit={handleSubmit} autoComplete="off">
                  {/* Name Input */}
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#FFD400]/30 focus:border-[#FFD400] transition-all duration-300 text-gray-900 placeholder-gray-500 bg-gray-50 focus:bg-white"
                      placeholder="Your Name"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#FFD400]/30 focus:border-[#FFD400] transition-all duration-300 text-gray-900 placeholder-gray-500 bg-gray-50 focus:bg-white"
                      placeholder="Your Email"
                    />
                  </div>

                  {/* Message Textarea */}
                  <div className="relative">
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={5}
                      required
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#FFD400]/30 focus:border-[#FFD400] transition-all duration-300 text-gray-900 placeholder-gray-500 bg-gray-50 focus:bg-white resize-none"
                      placeholder="Your Message"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="group/btn relative w-full overflow-hidden rounded-xl font-bold text-lg px-8 py-4 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 bg-gradient-to-r from-[#FF0000] to-[#FF0000]/90 text-white hover:from-[#FFD400] hover:to-[#FFD400] hover:text-black shadow-lg hover:shadow-2xl"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      {submitButtonText}
                      <Send className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FFD400] to-[#FFD400] transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left"></div>
                  </button>
                </form>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#FFD400] to-[#FF0000] rounded-full mb-6 shadow-2xl">
                    <Send className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-[#FF0000] mb-4">Thank You!</div>
                  <div className="text-lg text-gray-700 leading-relaxed">
                    We've received your message and will get in touch with you soon.
                  </div>
                </div>
              )}
            </div>

            {/* Decorative corner accent */}
            <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-[#FFD400] to-[#FF0000] rounded-bl-2xl rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        </div>

        {/* Bottom decorative element */}
        <div className="flex justify-center mt-16">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#FF0000] rounded-full"></div>
            <div className="w-2 h-2 bg-black rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;