import React from 'react';
import { Instagram, Linkedin, Youtube, Twitter, Mail, Phone, MapPin, ArrowUp } from 'lucide-react';

interface SocialLinks {
  whatsapp?: string;
  github?: string;
  instagram?: string;
  linkedin?: string;
  [key: string]: string | undefined;
}

interface QuickLink {
  name: string;
  href: string;
}

interface FooterProps {
  brandName?: string;
  brandHighlight?: string;
  brandDescription?: string;
  footerLogo?: string;
  footerText?: string;
  socialLinks?: SocialLinks;
  email?: string;
  phone?: string;
  location?: string;
  quickLinks?: QuickLink[];
  services?: Array<{ title: string; description?: string }>;
  primaryColor?: string;
  accentColor?: string;
}

const Footer: React.FC<FooterProps> = ({
  brandName = "Drone",
  brandHighlight = "TV",
  brandDescription = "Leading IPage UM Services since 2008 across Singapore and India—driving innovation in Drone Technology, GIS, AI, and custom IT solutions.",
  footerLogo,
  footerText = '© 2025 DroneTV | Built with by IPAGEUM Services / Drone TV Team',
  socialLinks = {},
  email = "bd@ipageums.com",
  phone = "+65 9006 2901",
  location = "Singapore & Hyderabad, India",
  quickLinks = [
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Contact', href: '#contact' },
  ],
  services = [],
  primaryColor = "#FFD400",
  accentColor = "#FF0000"
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderedSocialLinks = [
    socialLinks.instagram && { icon: <Instagram size={20} />, href: socialLinks.instagram, label: 'Instagram' },
    socialLinks.linkedin && { icon: <Linkedin size={20} />, href: socialLinks.linkedin, label: 'LinkedIn' },
    socialLinks.github && { icon: <Youtube size={20} />, href: socialLinks.github, label: 'YouTube' },
    socialLinks.whatsapp && { icon: <Twitter size={20} />, href: socialLinks.whatsapp, label: 'Twitter' },
  ].filter(Boolean) as { icon: JSX.Element; href: string; label: string }[];

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
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg%20width='60'%20height='60'%20viewBox='0%200%2060%2060'%20xmlns='http://www.w3.org/2000/svg'%3E%3Cg%20fill='none'%20fill-rule='evenodd'%3E%3Cg%20fill='${encodeURIComponent(primaryColor)}'%20fill-opacity='0.05'%3E%3Cpath%20d='M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            {footerLogo ? (
              <img src={footerLogo} alt={`${brandName} Logo`} className="h-12 mb-4" />
            ) : (
              <div className="text-3xl font-bold mb-4">
                {brandName}
                <span style={{ color: primaryColor }}>{brandHighlight}</span>
              </div>
            )}
            <p className="text-gray-400 mb-6 max-w-md">{brandDescription}</p>
            
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
                    style={{ color: `rgba(${hexToRgb(primaryColor)}, 1)` }}
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
            <ContactItem icon={<Mail size={24} style={{ color: accentColor }} />} title="Email" value={email} link={`mailto:${email}`} />
            <ContactItem icon={<Phone size={24} style={{ color: accentColor }} />} title="Phone" value={phone} link={`tel:${phone.replace(/\D/g, '')}`} />
            <ContactItem icon={<MapPin size={24} style={{ color: accentColor }} />} title="Location" value={location} />
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

// Contact Info Subcomponent
const ContactItem: React.FC<{ icon: JSX.Element; title: string; value: string; link?: string }> = ({ icon, title, value, link }) => (
  <div className="flex items-center gap-4">
    {icon}
    <div>
      <h4 className="font-bold mb-1">{title}</h4>
      {link ? (
        <a href={link} className="text-gray-400 hover:text-white transition-colors">
          {value}
        </a>
      ) : (
        <p className="text-gray-400">{value}</p>
      )}
    </div>
  </div>
);

// Helper: Hex to RGB
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '255, 212, 0';
}

export default Footer;
