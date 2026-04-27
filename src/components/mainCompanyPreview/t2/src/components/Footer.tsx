import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Phone,
  Edit2,
  Save,
  Upload,
  X as XIcon,
  Loader2,
  Check,
  Plus,
  Trash2,
  ArrowRight,
  Github,
  MapPin,
  RotateCw,
  ZoomIn,
} from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "./ui/button";
import { toast } from "react-toastify";
import Cropper from "react-easy-crop";

export default function Footer({
  footerData,
  footerLogo,
}) {
  // Initialize with data from props or use default structure
  const initialData = {
    brand: {
      name: "Innovative Labs",
      description: "Innovative solutions for modern businesses. Transform your operations with our expert guidance and cutting-edge technology.",
      logoUrl: "/api/placeholder/32/32",
    },
    contact: {
      email: "hello@innovativelabs.com",
      phone: "+1 (555) 123-4567",
      address: "San Francisco, CA 94105",
    },
    sections: [
      {
        id: 1,
        title: "Company",
        links: [
          { id: 1, text: "About Us", href: "#about" },
          { id: 2, text: "Our Team", href: "#team" },
          { id: 3, text: "Careers", href: "#careers" },
          { id: 4, text: "News & Press", href: "#news" },
        ],
      },
      {
        id: 2,
        title: "Services",
        links: footerData?.services
          ? footerData.services.map((service, index) => ({
              id: index + 1,
              text: service.title,
              href: "#services",
            }))
          : [
              { id: 1, text: "Consulting", href: "#consulting" },
              { id: 2, text: "Development", href: "#development" },
              { id: 3, text: "Support & Maintenance", href: "#support" },
              { id: 4, text: "Training", href: "#training" },
            ],
      },
      {
        id: 3,
        title: "Resources",
        links: [
          { id: 1, text: "Blog", href: "#blog" },
          { id: 2, text: "Gallery", href: "#gallery" },
          { id: 3, text: "Privacy Policy", href: "#privacy" },
          { id: 4, text: "Terms of Service", href: "#terms" },
        ],
      },
    ],
    socialMedia: [
      {
        id: 1,
        name: "Facebook",
        icon: "Facebook",
        href: "#",
        hoverColor: "hover:bg-blue-600",
      },
      {
        id: 2,
        name: "Twitter",
        icon: "Twitter",
        href: "#",
        hoverColor: "hover:bg-blue-400",
      },
      {
        id: 3,
        name: "Instagram",
        icon: "Instagram",
        href: "#",
        hoverColor: "hover:bg-pink-600",
      },
      {
        id: 4,
        name: "LinkedIn",
        icon: "Linkedin",
        href: "#",
        hoverColor: "hover:bg-blue-700",
      },
    ],
    legalLinks: [
      { id: 1, text: "Privacy Policy", href: "#privacy" },
      { id: 2, text: "Terms of Service", href: "#terms" },
      { id: 3, text: "Cookie Policy", href: "#cookies" },
    ],
    copyright: "© 2024 Innovative Labs. All rights reserved.",
  };

  const [footerContent, setFooterContent] = useState(footerData||initialData);

  // Update state when content prop changes
  useEffect(() => {
    if (footerLogo) {
      const updatedData = {
        ...initialData,
        brand: {
          ...initialData.brand,
          logoUrl: footerLogo.logo || initialData.brand.logoUrl,
          name: footerLogo.name || initialData.brand.name,
        },
      };
      setFooterContent(updatedData);
    }
  }, [footerLogo, footerData]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.footer
      className="bg-gray-900 border-t border-gray-800 relative theme-transition"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 lg:py-12 relative">
        {/* Main Footer Content - Grid layout */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 text-left"
          variants={containerVariants}
        >
          {/* Brand Section */}
          <motion.div
            className="col-span-1 md:col-span-2 lg:col-span-1"
            variants={itemVariants}
          >
            <div className="flex items-center justify-start md:justify-start space-x-3 mb-4">
              <span className="flex flex-row gap-2 text-xl font-bold text-yellow-400 ">
                {footerContent.brand.name}
              </span>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              {footerContent.brand.description}
            </p>
          </motion.div>

          {/* Dynamic Sections */}
          {footerContent.sections.map((section, sectionIndex) => (
            <motion.div
              key={section.id}
              className="col-span-1"
              variants={itemVariants}
            >
              <div className="flex items-start justify-start md:justify-start mb-4">
                <h4 className="font-semibold text-white ">
                  {section.title}
                </h4>
              </div>

              <ul className="space-y-3 text-sm">
                {section.links.map((link) => (
                  <li key={link.id} className="flex items-center gap-2">
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex-1"
                    >
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.footer>
  );
}