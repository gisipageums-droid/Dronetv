// import React from 'react';
// import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin, ArrowUp } from 'lucide-react';

// const Footer: React.FC = () => {
//   const scrollToTop = () => {
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const quickLinks = [
//     { name: 'Home', href: '#home' },
//     { name: 'Highlights', href: '#highlights' },
//     { name: 'Speakers', href: '#speakers' },
//     { name: 'Schedule', href: '#schedule' },
//     { name: 'Register', href: '#contact' },
//   ];

//   const socialLinks = [
//     { icon: <Facebook size={20} />, href: '#', label: 'Facebook', color: 'hover:text-blue-400' },
//     { icon: <Twitter size={20} />, href: '#', label: 'Twitter', color: 'hover:text-blue-300' },
//     { icon: <Instagram size={20} />, href: '#', label: 'Instagram', color: 'hover:text-pink-400' },
//     { icon: <Linkedin size={20} />, href: '#', label: 'LinkedIn', color: 'hover:text-blue-500' },
//     { icon: <Youtube size={20} />, href: '#', label: 'YouTube', color: 'hover:text-red-400' },
//   ];

//   const scrollToSection = (href: string) => {
//     const element = document.querySelector(href);
//     if (element) {
//       element.scrollIntoView({ behavior: 'smooth' });
//     }
//   };

//   return (
//     <footer className="bg-black text-white border-t border-gray-800">
//       <div className="container mx-auto px-4 py-16">
//         <div className="grid md:grid-cols-4 gap-8 mb-12">
//           {/* Event Info */}
//           <div className="md:col-span-2">
//             <div className="text-3xl font-bold mb-6">
//               <span className="text-[#FFD400]">Future of</span>
//               <span className="text-[#FF0000]">Flight</span>
//             </div>
//             <p className="text-gray-400 mb-6 leading-relaxed">
//               The ultimate drone technology expo bringing together innovators, competitors, 
//               and enthusiasts for an unforgettable experience in aerial innovation.
//             </p>
            
//             {/* Event Details */}
//             <div className="space-y-3">
//               <div className="flex items-center gap-3 group">
//                 <Mail size={16} className="text-[#FF0000] group-hover:text-[#FFD400] transition-colors" />
//                 <span className="text-gray-400 group-hover:text-white transition-colors">register@futureoflightexpo.com</span>
//               </div>
//               <div className="flex items-center gap-3 group">
//                 <Phone size={16} className="text-[#FF0000] group-hover:text-[#FFD400] transition-colors" />
//                 <span className="text-gray-400 group-hover:text-white transition-colors">+1 (555) EXPO-2025</span>
//               </div>
//               <div className="flex items-center gap-3 group">
//                 <MapPin size={16} className="text-[#FF0000] group-hover:text-[#FFD400] transition-colors" />
//                 <span className="text-gray-400 group-hover:text-white transition-colors">Los Angeles, CA</span>
//               </div>
//             </div>
//           </div>
          
//           {/* Quick Links */}
//           <div>
//             <h3 className="text-xl font-bold mb-6 text-[#FFD400]">Quick Links</h3>
//             <ul className="space-y-3">
//               {quickLinks.map((link, index) => (
//                 <li key={index}>
//                   <button
//                     onClick={() => scrollToSection(link.href)}
//                     className="text-gray-400 hover:text-[#FFD400] transition-colors duration-300 hover:translate-x-2 transform inline-block"
//                   >
//                     {link.name}
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           </div>
          
//           {/* Newsletter */}
//           <div>
//             <h3 className="text-xl font-bold mb-6 text-[#FFD400]">Stay Connected</h3>
//             <p className="text-gray-400 mb-6">
//               Get updates on speakers, competitions, and exclusive expo content.
//             </p>
//             <div className="flex flex-col gap-3">
//               <input
//                 type="email"
//                 placeholder="Enter your email"
//                 className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#FFD400] focus:border-transparent transition-all duration-300 text-white placeholder-gray-400"
//               />
//               <button className="bg-[#FF0000] hover:bg-[#FF0000]/90 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
//                 Subscribe
//               </button>
//             </div>
//           </div>
//         </div>
        
//         {/* Bottom Bar */}
//         <div className="border-t border-gray-800 pt-8">
//           <div className="flex flex-col md:flex-row justify-between items-center">
//             <div className="text-gray-400 text-sm mb-4 md:mb-0">
//               © 2025 Future of Flight Expo. All rights reserved. | Privacy Policy | Terms of Service
//             </div>
            
//             <div className="flex items-center gap-6">
//               {/* Social Links */}
//               <div className="flex gap-4">
//                 {socialLinks.map((social, index) => (
//                   <a
//                     key={index}
//                     href={social.href}
//                     aria-label={social.label}
//                     className={`w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-[#FF0000] ${social.color} transition-all duration-300 transform hover:scale-110 hover:bg-gray-700`}
//                   >
//                     {social.icon}
//                   </a>
//                 ))}
//               </div>
              
//               {/* Back to Top */}
//               <button
//                 onClick={scrollToTop}
//                 className="w-10 h-10 bg-[#FFD400] rounded-full flex items-center justify-center text-black hover:bg-[#FFD400]/90 transition-all duration-300 transform hover:scale-110 shadow-lg"
//               >
//                 <ArrowUp size={20} />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;




import React, { useState } from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin, ArrowUp, Edit2 } from 'lucide-react';

const Footer: React.FC = () => {
  const [editing, setEditing] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Editable state
  const [quickLinks, setQuickLinks] = useState([
    { name: 'Home', href: '#home' },
    { name: 'Highlights', href: '#highlights' },
    { name: 'Speakers', href: '#speakers' },
    { name: 'Schedule', href: '#schedule' },
    { name: 'Register', href: '#contact' },
  ]);

  const [socialLinks, setSocialLinks] = useState([
    { icon: <Facebook size={20} />, href: '#', label: 'Facebook', color: 'hover:text-blue-400' },
    { icon: <Twitter size={20} />, href: '#', label: 'Twitter', color: 'hover:text-blue-300' },
    { icon: <Instagram size={20} />, href: '#', label: 'Instagram', color: 'hover:text-pink-400' },
    { icon: <Linkedin size={20} />, href: '#', label: 'LinkedIn', color: 'hover:text-blue-500' },
    { icon: <Youtube size={20} />, href: '#', label: 'YouTube', color: 'hover:text-red-400' },
  ]);

  const [contactInfo, setContactInfo] = useState({
    email: 'register@futureoflightexpo.com',
    phone: '+1 (555) EXPO-2025',
    venue: 'Los Angeles, CA',
  });

  const [newsletterPlaceholder, setNewsletterPlaceholder] = useState('Enter your email');
  const [footerText, setFooterText] = useState('© 2025 Future of Flight Expo. All rights reserved. | Privacy Policy | Terms of Service');
  const [title, setTitle] = useState({ first: 'Future of', second: 'Flight' });
  const [description, setDescription] = useState(
    'The ultimate drone technology expo bringing together innovators, competitors, and enthusiasts for an unforgettable experience in aerial innovation.'
  );

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Editable Quick Links
  const handleQuickLinkChange = (index: number, value: string) => {
    const updated = [...quickLinks];
    updated[index].name = value;
    setQuickLinks(updated);
  };

  // Editable Social Links href
  const handleSocialLinkChange = (index: number, value: string) => {
    const updated = [...socialLinks];
    updated[index].href = value;
    setSocialLinks(updated);
  };

  return (
    <footer className="bg-black text-white border-t border-gray-800 relative">
      {/* Edit Button */}
      <button
        onClick={() => setEditing(!editing)}
        className="absolute top-6 right-6 z-20 bg-[#FFD400] hover:bg-[#FFD400]/90 text-black px-4 py-2 rounded-full font-semibold transition-all flex items-center gap-2"
      >
        <Edit2 size={16} />
        {editing ? 'Done' : 'Edit'}
      </button>

      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Event Info */}
          <div className="md:col-span-2">
            <div className="text-3xl font-bold mb-6">
              {editing ? (
                <>
                  <input
                    value={title.first}
                    onChange={e => setTitle(prev => ({ ...prev, first: e.target.value }))}
                    className="bg-transparent border-b border-[#FFD400] text-[#FFD400] text-3xl font-bold mr-2"
                  />
                  <input
                    value={title.second}
                    onChange={e => setTitle(prev => ({ ...prev, second: e.target.value }))}
                    className="bg-transparent border-b border-[#FF0000] text-[#FF0000] text-3xl font-bold"
                  />
                </>
              ) : (
                <>
                  <span className="text-[#FFD400]">{title.first}</span>
                  <span className="text-[#FF0000]">{title.second}</span>
                </>
              )}
            </div>
            {editing ? (
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="bg-transparent border border-gray-600 text-gray-400 p-2 rounded w-full mb-6"
              />
            ) : (
              <p className="text-gray-400 mb-6 leading-relaxed">{description}</p>
            )}

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 group">
                <Mail size={16} className="text-[#FF0000] group-hover:text-[#FFD400] transition-colors" />
                {editing ? (
                  <input
                    value={contactInfo.email}
                    onChange={e => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-transparent border-b border-white text-gray-400 px-1 py-0.5 rounded"
                  />
                ) : (
                  <span className="text-gray-400 group-hover:text-white transition-colors">{contactInfo.email}</span>
                )}
              </div>
              <div className="flex items-center gap-3 group">
                <Phone size={16} className="text-[#FF0000] group-hover:text-[#FFD400] transition-colors" />
                {editing ? (
                  <input
                    value={contactInfo.phone}
                    onChange={e => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
                    className="bg-transparent border-b border-white text-gray-400 px-1 py-0.5 rounded"
                  />
                ) : (
                  <span className="text-gray-400 group-hover:text-white transition-colors">{contactInfo.phone}</span>
                )}
              </div>
              <div className="flex items-center gap-3 group">
                <MapPin size={16} className="text-[#FF0000] group-hover:text-[#FFD400] transition-colors" />
                {editing ? (
                  <input
                    value={contactInfo.venue}
                    onChange={e => setContactInfo(prev => ({ ...prev, venue: e.target.value }))}
                    className="bg-transparent border-b border-white text-gray-400 px-1 py-0.5 rounded"
                  />
                ) : (
                  <span className="text-gray-400 group-hover:text-white transition-colors">{contactInfo.venue}</span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-[#FFD400]">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  {editing ? (
                    <input
                      value={link.name}
                      onChange={e => handleQuickLinkChange(index, e.target.value)}
                      className="bg-transparent border-b border-gray-500 text-gray-400 px-1 py-0.5 rounded w-full"
                    />
                  ) : (
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="text-gray-400 hover:text-[#FFD400] transition-colors duration-300 hover:translate-x-2 transform inline-block"
                    >
                      {link.name}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-[#FFD400]">Stay Connected</h3>
            <p className="text-gray-400 mb-6">
              Get updates on speakers, competitions, and exclusive expo content.
            </p>
            <div className="flex flex-col gap-3">
              <input
                type="email"
                placeholder={newsletterPlaceholder}
                onChange={editing ? e => setNewsletterPlaceholder(e.target.value) : undefined}
                className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#FFD400] focus:border-transparent transition-all duration-300 text-white placeholder-gray-400"
              />
              <button className="bg-[#FF0000] hover:bg-[#FF0000]/90 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {editing ? (
              <textarea
                value={footerText}
                onChange={e => setFooterText(e.target.value)}
                className="bg-transparent border border-gray-600 p-2 rounded w-full md:w-auto text-gray-400 mb-4 md:mb-0"
              />
            ) : (
              <div className="text-gray-400 text-sm mb-4 md:mb-0">{footerText}</div>
            )}

            <div className="flex items-center gap-6">
              {/* Social Links */}
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className={`w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-[#FF0000] ${social.color} transition-all duration-300 transform hover:scale-110 hover:bg-gray-700`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>

              {/* Back to Top */}
              <button
                onClick={scrollToTop}
                className="w-10 h-10 bg-[#FFD400] rounded-full flex items-center justify-center text-black hover:bg-[#FFD400]/90 transition-all duration-300 transform hover:scale-110 shadow-lg"
              >
                <ArrowUp size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
