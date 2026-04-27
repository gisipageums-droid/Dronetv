// import React from 'react';
// import { Facebook, Twitter, Instagram, Linkedin, Youtube, ArrowUp } from 'lucide-react';

// const Footer: React.FC = () => {
//   const scrollToTop = () => {
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const socialLinks = [
//     { icon: <Facebook size={20} />, href: '#', label: 'Facebook' },
//     { icon: <Twitter size={20} />, href: '#', label: 'Twitter' },
//     { icon: <Instagram size={20} />, href: '#', label: 'Instagram' },
//     { icon: <Linkedin size={20} />, href: '#', label: 'LinkedIn' },
//     { icon: <Youtube size={20} />, href: '#', label: 'YouTube' },
//   ];

//   const quickLinks = [
//     { name: 'About', href: '#about' },
//     { name: 'Services', href: '#services' },
//     { name: 'Portfolio', href: '#portfolio' },
//     { name: 'Contact', href: '#contact' },
//   ];

//   const services = [
//     'Aerial Photography',
//     'Drone Cinematography',
//     'UAV Development',
//     'Consulting & Training',
//   ];

//   return (
//     <footer className="bg-black text-white relative overflow-hidden">
//       {/* Background Pattern */}
//       <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23FFD400%22%20fill-opacity=%220.05%22%3E%3Cpath%20d=%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-10"></div>
      
//       <div className="container mx-auto px-4 py-16 relative z-10">
//         <div className="grid md:grid-cols-4 gap-8 mb-12">
//           {/* Brand */}
//           <div className="md:col-span-2">
//             <div className="text-3xl font-bold mb-4">
//               Drone<span className="text-[#FFD400]">TV</span>
//             </div>
//             <p className="text-gray-400 mb-6 max-w-md">
//               Professional drone services capturing the world from above. 
//               Specializing in aerial photography, cinematography, and UAV development.
//             </p>
            
//             {/* Social Links */}
//             <div className="flex gap-4">
//               {socialLinks.map((social, index) => (
//                 <a
//                   key={index}
//                   href={social.href}
//                   aria-label={social.label}
//                   className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-[#FF0000] hover:bg-gray-700 transition-all duration-300 transform hover:scale-110"
//                 >
//                   {social.icon}
//                 </a>
//               ))}
//             </div>
//           </div>
          
//           {/* Quick Links */}
//           <div>
//             <h3 className="text-xl font-bold mb-4 text-[#FFD400]">Quick Links</h3>
//             <ul className="space-y-2">
//               {quickLinks.map((link, index) => (
//                 <li key={index}>
//                   <a
//                     href={link.href}
//                     className="text-gray-400 hover:text-[#FFD400] transition-colors duration-300 hover:translate-x-1 transform inline-block"
//                   >
//                     {link.name}
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </div>
          
//           {/* Services */}
//           <div>
//             <h3 className="text-xl font-bold mb-4 text-[#FFD400]">Services</h3>
//             <ul className="space-y-2">
//               {services.map((service, index) => (
//                 <li key={index} className="text-gray-400 hover:text-[#FFD400] transition-colors duration-300">
//                   {service}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
        
//         {/* Newsletter */}
//         <div className="bg-gray-900 rounded-2xl p-8 mb-12">
//           <div className="text-center">
//             <h3 className="text-2xl font-bold mb-4">
//               Stay Updated with <span className="text-[#FFD400]">DroneTV</span>
//             </h3>
//             <p className="text-gray-400 mb-6">
//               Get the latest updates on drone technology, photography tips, and exclusive offers.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
//               <input
//                 type="email"
//                 placeholder="Enter your email"
//                 className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#FF0000] focus:border-transparent transition-all duration-300 text-white placeholder-gray-400"
//               />
//               <button className="bg-[#FF0000] hover:bg-[#FF0000]/90 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
//                 Subscribe
//               </button>
//             </div>
//           </div>
//         </div>
        
//         {/* Bottom Bar */}
//         <div className="border-t border-gray-800 pt-8">
//           <div className="flex flex-col md:flex-row justify-between items-center">
//             <div className="text-gray-400 text-sm mb-4 md:mb-0">
//               © 2024 DroneTV. All rights reserved. | Privacy Policy | Terms of Service
//             </div>
            
//             <div className="flex items-center gap-4">
//               <span className="text-gray-400 text-sm">Back to top</span>
//               <button
//                 onClick={scrollToTop}
//                 className="w-10 h-10 bg-[#FF0000] rounded-full flex items-center justify-center text-white hover:bg-[#FF0000]/90 transition-all duration-300 transform hover:scale-110"
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

import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin, ArrowUp } from 'lucide-react';

interface SocialLinks {
  whatsapp?: string;
  github?: string;
  instagram?: string;
  linkedin?: string;
  [key: string]: string | undefined;
}

interface FooterProps {
  footerLogo?: string;
  footerText?: string;
  socialLinks?: SocialLinks;
  email?: string;
  phone?: string;
  location?: string;
  services?: Array<{ title: string; description: string }>;
  primaryColor?: string;
  accentColor?: string;
}

const Footer: React.FC<FooterProps> = ({
  footerLogo,
  footerText = '© 2025 DroneTV | Built with by IPAGEUM Services / Drone TV Team',
  socialLinks = {},
  email = "bd@ipageums.com",
  phone = "+65 9006 2901",
  location = "Singapore & Hyderabad, India",
  services = [],
  primaryColor = "#FFD400",
  accentColor = "#FF0000"
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderedSocialLinks = [
    socialLinks.instagram ? { icon: <Instagram size={20} />, href: socialLinks.instagram, label: 'Instagram' } : undefined,
    socialLinks.linkedin ? { icon: <Linkedin size={20} />, href: socialLinks.linkedin, label: 'LinkedIn' } : undefined,
    socialLinks.github ? { icon: <Youtube size={20} />, href: socialLinks.github, label: 'YouTube' } : undefined,
    socialLinks.whatsapp ? { icon: <Twitter size={20} />, href: socialLinks.whatsapp, label: 'Twitter' } : undefined,
  ].filter((link): link is { icon: JSX.Element; href: string; label: string } => !!link);

  const quickLinks = [
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Contact', href: '#contact' },
  ];

  // Default services if none provided
  const defaultServices = [
    'Aerial Photography',
    'Drone Cinematography',
    'UAV Development',
    'Consulting & Training',
  ];

  const displayServices = services.length > 0 
    ? services.map(service => service.title) 
    : defaultServices;

  return (
    <footer className="bg-black text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22${encodeURIComponent(primaryColor)}%22%20fill-opacity=%220.05%22%3E%3Cpath%20d=%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-10"></div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="text-3xl font-bold mb-4">
              Drone<span className="text-[#FFD400]" style={{ color: primaryColor }}>TV</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Leading IPage UM Services since 2008 across Singapore and India—driving innovation in 
              Drone Technology, GIS, AI, and custom IT solutions.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4">
              {renderedSocialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-110"
                  style={{ backgroundColor: social.label === 'Twitter' ? '#1DA1F2' : '', color: social.label === 'Twitter' ? 'white' : '' }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4" style={{ color: primaryColor }}>Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 transform inline-block"
                    style={{ '--tw-text-opacity': 1, color: `rgba(${hexToRgb(primaryColor)}, var(--tw-text-opacity))` } as React.CSSProperties}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h3 className="text-xl font-bold mb-4" style={{ color: primaryColor }}>Services</h3>
            <ul className="space-y-2">
              {displayServices.map((service, index) => (
                <li key={index} className="text-gray-400 hover:text-white transition-colors duration-300">
                  {service}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Contact Info */}
        <div className="bg-gray-900 rounded-2xl p-8 mb-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <Mail size={24} className="flex-shrink-0" style={{ color: accentColor }} />
              <div>
                <h4 className="font-bold mb-1">Email</h4>
                <a href={`mailto:${email}`} className="text-gray-400 hover:text-white transition-colors">
                  {email}
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Phone size={24} className="flex-shrink-0" style={{ color: accentColor }} />
              <div>
                <h4 className="font-bold mb-1">Phone</h4>
                <a href={`tel:${phone.replace(/\D/g, '')}`} className="text-gray-400 hover:text-white transition-colors">
                  {phone}
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <MapPin size={24} className="flex-shrink-0" style={{ color: accentColor }} />
              <div>
                <h4 className="font-bold mb-1">Location</h4>
                <p className="text-gray-400">{location}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              {footerText}
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm">Back to top</span>
              <button
                onClick={scrollToTop}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110"
                style={{ backgroundColor: accentColor }}
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

// Helper function to convert hex to rgb
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? 
    `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` 
    : '255, 212, 0'; // Default to primary color if conversion fails
}

export default Footer;