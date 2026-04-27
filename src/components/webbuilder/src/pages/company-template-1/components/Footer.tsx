import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from 'lucide-react';

interface SocialLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  [key: string]: string | undefined;
}

interface FooterProps {
  footerLogo?: string;
  footerText?: string;
  footerNavLinks?: { label: string; link: string }[];
  socialLinks?: SocialLinks;
  email?: string;
  phone?: string;
  address?: string;
  services?: string[];
}

const Footer: React.FC<FooterProps> = ({
  footerLogo,
  footerText = '© 2025 DroneTech. All rights reserved.',
  footerNavLinks = [
    { label: 'Home', link: '#home' },
    { label: 'About', link: '#about' },
    { label: 'Services', link: '#services' },
    { label: 'Products', link: '#products' },
    { label: 'Contact', link: '#contact' }
  ],
  socialLinks = {},
  email = "info@dronetech.com",
  phone = "+91 98765 43210",
  address = "Bangalore, Karnataka",
  services = [
    'Aerial Surveying',
    'Agricultural Monitoring',
    'Security & Surveillance',
    'Custom UAV Solutions',
    'Training & Support',
  ]
}) => {

  const renderedSocialLinks = [
    socialLinks.facebook ? { icon: <Facebook size={20} />, href: socialLinks.facebook, label: 'Facebook' } : undefined,
    socialLinks.twitter ? { icon: <Twitter size={20} />, href: socialLinks.twitter, label: 'Twitter' } : undefined,
    socialLinks.instagram ? { icon: <Instagram size={20} />, href: socialLinks.instagram, label: 'Instagram' } : undefined,
    socialLinks.linkedin ? { icon: <Linkedin size={20} />, href: socialLinks.linkedin, label: 'LinkedIn' } : undefined,
    socialLinks.youtube ? { icon: <Youtube size={20} />, href: socialLinks.youtube, label: 'YouTube' } : undefined,
  ].filter((link): link is { icon: JSX.Element; href: string; label: string } => !!link);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="md:col-span-1">
            <div className="mb-4 flex items-center gap-3">
              {footerLogo ? (
                <img src={footerLogo} alt="Logo" className="h-14 w-18 object-contain rounded-full" />
              ) : (
                <span className="text-3xl font-bold">
                  <span className="text-[#FFD400]">Drone</span>
                  <span className="text-[#FF0000]">Tech</span>
                </span>
              )}
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Leading provider of advanced drone solutions for surveying, agriculture,
              security, and custom applications across India.
            </p>
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-[#FF0000]" />
                <span className="text-gray-400">{email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-[#FF0000]" />
                <span className="text-gray-400">{phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-[#FF0000]" />
                <span className="text-gray-400">{address}</span>
              </div>
            </div>
          </div>
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-[#FFD400]">Quick Links</h3>
            <ul className="space-y-2">
              {footerNavLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection(link.link)}
                    className="text-gray-400 hover:text-[#FFD400] transition-colors duration-300 hover:translate-x-1 transform inline-block"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {/* Services */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-[#FFD400]">Services</h3>
            <ul className="space-y-2">
              {services.map((service, index) => (
                <li key={index} className="text-gray-400 hover:text-[#FFD400] transition-colors duration-300">
                  {service}
                </li>
              ))}
            </ul>
          </div>
          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-[#FFD400]">Stay Updated</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter for the latest drone technology updates.
            </p>
            <div className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#FF0000] focus:border-transparent transition-all duration-300 text-white placeholder-gray-400"
              />
              <button className="bg-[#FF0000] hover:bg-[#FF0000]/90 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              {footerText}
            </div>
            {/* Social Links */}
            <div className="flex gap-4">
              {renderedSocialLinks.length > 0 ? (
                renderedSocialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social!.href}
                    aria-label={social!.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#FF0000] transition-all duration-300 transform hover:scale-110"
                  >
                    {social!.icon}
                  </a>
                ))
              ) : (
                <>
                  <span className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400">
                    <Facebook size={20} />
                  </span>
                  <span className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400">
                    <Twitter size={20} />
                  </span>
                  <span className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400">
                    <Instagram size={20} />
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
