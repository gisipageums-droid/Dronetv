import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

interface FooterLink {
  href: string;
  label: string;
}

interface SocialLink {
  icon: string;
  label: string;
  href: string;
  color: string;
}

interface ContactInfo {
  email: string;
  location: string;
  availability: string;
}

interface FooterData {
  logoText: string;
  tagline: string;
  description: string;
  quickLinks: FooterLink[];
  moreLinks: FooterLink[];
  socialLinks: SocialLink[];
  copyright: string;
  contactInfo: ContactInfo;
  builtWith: string;
}

const defaultFooterData: FooterData = {
  logoText: "Professional",
  tagline: "Professional Technology Professional Solutions",
  description: "Delivering exceptional results through expertise in modern technologies. Committed to innovation, quality, and client success.",
  quickLinks: [
    { href: "#about", label: "About Me" },
    { href: "#skills", label: "Skills" },
    { href: "#projects", label: "Portfolio" },
    { href: "#services", label: "Services" }
  ],
  moreLinks: [
    { href: "#testimonials", label: "Testimonials" },
    { href: "#contact", label: "Contact" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" }
  ],
  socialLinks: [
    {
      icon: "Linkedin",
      label: "LinkedIn Profile",
      href: "https://linkedin.com/in/professional",
      color: "hover:text-blue-600"
    },
    {
      icon: "Github",
      label: "GitHub Profile",
      href: "https://github.com/professional",
      color: "hover:text-gray-900 dark:hover:text-white"
    },
    {
      icon: "Twitter",
      label: "Twitter Profile",
      href: "https://twitter.com/professional",
      color: "hover:text-blue-400"
    },
    {
      icon: "Mail",
      label: "Email Contact",
      href: "mailto:contact@professional.com",
      color: "hover:text-green-500"
    },
    {
      icon: "Instagram",
      label: "Instagram",
      href: "#",
      color: "hover:text-pink-500"
    }
  ],
  copyright: "© 2024 Professional. All rights reserved.",
  contactInfo: {
    email: "contact@professional.com",
    location: "India",
    availability: "Available for new projects"
  },
  builtWith: "Built with passion and modern technology"
};

interface FooterProps {
  footerData?: FooterData;
}

export function Footer({ footerData }: FooterProps) {
  const [isVisible, setIsVisible] = useState(false);
  const footerRef = useRef<HTMLDivElement>(null);

  // Use provided data or default
  const data = footerData || defaultFooterData;
  const currentYear = new Date().getFullYear();

  // Intersection observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (footerRef.current) observer.observe(footerRef.current);
    return () => {
      if (footerRef.current) observer.unobserve(footerRef.current);
    };
  }, []);

  return (
    <footer ref={footerRef} className="py-12 text-white bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-4 md:col-span-2"
          >
            <h3 className="text-2xl font-bold text-white">{data.logoText}</h3>
            <p className="text-lg text-yellow-400">{data.tagline}</p>
            <p className="leading-relaxed text-gray-400">
              {data.description}
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h4 className="text-lg font-semibold text-yellow-400">Quick Links</h4>
            <div className="space-y-2">
              {data.quickLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.href}
                  whileHover={{ x: 5, color: '#fbbf24' }}
                  transition={{ duration: 0.2 }}
                  className="block text-gray-400 transition-colors duration-300 hover:text-yellow-400"
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* More Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h4 className="text-lg font-semibold text-yellow-400">More Links</h4>
            <div className="space-y-2">
              {data.moreLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.href}
                  whileHover={{ x: 5, color: '#fbbf24' }}
                  transition={{ duration: 0.2 }}
                  className="block text-gray-400 transition-colors duration-300 hover:text-yellow-400"
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Contact & Social Links */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="grid gap-8 md:grid-cols-2 mt-8 pt-8 border-t border-gray-800"
        >
          {/* Contact Info */}
         

          
        {/* </motion.div> */} 

      </div>
    </footer>
  );
}