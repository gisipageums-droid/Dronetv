import React from 'react';
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';

const Footer: React.FC = () => {
  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Speakers', href: '#speakers' },
    { name: 'Agenda', href: '#agenda' },
    { name: 'Contact', href: '#contact' },
  ];

  const socialLinks = [
    { icon: <Facebook size={20} />, href: 'https://www.facebook.com/DroneExpo.in/', label: 'Facebook' },
    // { icon: <Twitter size={20} />, href: '#', label: 'Twitter' },
    { icon: <Instagram size={20} />, href: 'https://www.instagram.com/droneexpo.in/', label: 'Instagram' },
    { icon: <Linkedin size={20} />, href: 'https://www.linkedin.com/company/droneexpo', label: 'LinkedIn' },
    { icon: <Youtube size={20} />, href: 'https://www.youtube.com/@droneexpo', label: 'YouTube' },
  ];

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
          {/* Contact Info */}
          <div className="md:col-span-2">
            <div className="h-16 w-44 mb-4">
              <img
                src="/images/expologo.png"
                alt="Drone Expo Logo"
                className="h-full w-full object-contain"
              />
            </div>

            <p className="text-gray-400 mb-6 leading-relaxed">
              Drone Expo is a leading drone technology platform enabling
              innovators, professionals, and companies to collaborate and grow
              globally.
            </p>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-[#FF0000]" />
                <span className="text-gray-400">
                  info@droneexpo.in
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={16} className="text-[#FF0000]" />
                <span className="text-gray-400 leading-snug">
                  +91 9354688923, +91 8882210038, <br />
                  +91 738837522
                </span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-[#FF0000]" />
                <span className="text-gray-400 leading-snug">
                  D-4 LSC, A Block, Naraina Vihar, <br />
                  New Delhi - 110028
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-[#FFD400]">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-gray-400 hover:text-[#FFD400] transition-all duration-300 hover:translate-x-1 transform inline-block"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-[#FFD400]">
              Stay Updated
            </h3>
            <p className="text-gray-400 mb-4">
              Subscribe to get the latest news and drone expo updates.
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

        {/* Footer Bottom */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 Drone Expo. All rights reserved.
            </div>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#FF0000] transition-all duration-300 transform hover:scale-110"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
