import React from 'react';
import { Facebook, Instagram, Youtube, Heart, ArrowUp } from 'lucide-react';

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117Z" />
  </svg>
);

const Footer = () => {
  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: 'https://www.facebook.com/dronetv.in', color: 'hover:text-blue-600' },
    { name: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/dronetv.in/', color: 'hover:text-pink-600' },
    { name: 'X', icon: XIcon, href: 'https://x.com/indiadronetv', color: 'hover:text-gray-900' },
    { name: 'YouTube', icon: Youtube, href: 'https://www.youtube.com/@indiadronetv', color: 'hover:text-red-600' }
  ];

  const footerLinks = [
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms of Service', href: '/terms-and-conditions' },
    { name: 'Contact', href: '/contact' }
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-500 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-yellow-200/20 rounded-full animate-pulse blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-yellow-600/20 rounded-full animate-pulse blur-3xl" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center">
            {/* Logo */}
            <div className="mb-8 group">
              <img
                src="/images/logo.png"
                alt="Drone TV Logo"
                className="w-64 h-24 mx-auto cursor-pointer group-hover:scale-110 transition-all duration-300"
              />
              <div className="w-16 h-1 bg-black mx-auto mt-2 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </div>

            {/* Social Media Icons */}
            <div className="flex items-center gap-6 mb-8">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group text-black ${social.color} transition-all duration-300 transform hover:scale-125 hover:-translate-y-1`}
                    aria-label={social.name}
                  >
                    <div className="w-12 h-12 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full border border-white/30 group-hover:bg-white/30 transition-all duration-300">
                      <IconComponent className="h-6 w-6" />
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Footer Links */}
            <div className="flex flex-wrap justify-center gap-8 mb-8">
              {footerLinks.map((link, index) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="relative text-black hover:text-gray-800 transition-all duration-300 font-medium group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="relative z-10">{link.name}</span>
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </a>
              ))}
            </div>

            {/* Copyright */}
            <div className="text-center text-black/80 mb-8">
              <p className="flex items-center justify-center gap-2 text-lg">
                &copy; 2024 Drone TV. Built with <Heart className="h-5 w-5 text-red-500 fill-red-500" /> for the global drone community.
              </p>
            </div>


            {/* Back to Top Button */}
            <button
              onClick={scrollToTop}
              className="group bg-black/20 backdrop-blur-sm text-black p-3 rounded-full border border-black/30 hover:bg-black/30 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
              aria-label="Back to top"
            >
              <ArrowUp className="h-6 w-6 group-hover:animate-bounce" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
