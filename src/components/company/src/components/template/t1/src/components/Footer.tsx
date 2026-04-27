import {
  Facebook,
  Github,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import logo from"/logos/logo.svg"
export default function Footer() {
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Static footer data matching the exact UI structure
  const footerData = {
    brand: {
      logoUrl: logo,
      name: "Innovative Labs",
      description:
        "Transforming businesses with cutting-edge technology solutions. We help companies innovate, grow, and succeed in the digital age.",
    },
    sections: [
      {
        id: 1,
        title: "Quick Links",
        links: [
          { id: 1, text: "Home", href: "#home" },
          { id: 2, text: "Services", href: "#services" },
          { id: 3, text: "Products", href: "#products" },
          { id: 4, text: "About Us", href: "#about" },
          { id: 5, text: "Contact", href: "#contact" },
        ],
      },
      {
        id: 2,
        title: "Services",
        links: [
          { id: 1, text: "Web Development", href: "#services" },
          { id: 2, text: "Mobile Apps", href: "#services" },
          { id: 3, text: "UI/UX Design", href: "#services" },
          { id: 4, text: "Digital Marketing", href: "#services" },
          { id: 5, text: "Consulting", href: "#services" },
        ],
      },
      // {
      //   id: 3,
      //   title: "Contact",
      //   links: [
      //     { id: 1, text: "+1 (555) 123-4567", href: "tel:+15551234567" },
      //     { id: 2, text: "hello@innovatex.com", href: "mailto:hello@innovatex.com" },
      //     { id: 3, text: "123 Innovation Street", href: "#" }
      //   ]
      // }
    ],
  };

  const getSocialIcon = (iconName) => {
    const icons = {
      Facebook: Facebook,
      Github: Github,
      Linkedin: Linkedin,
      Instagram: Instagram,
      Twitter: Twitter,
    };
    const IconComponent = icons[iconName] || Facebook;
    return <IconComponent className="w-4 h-4" />;
  };

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
      className="bg-gray-900 border-t border-gray-800"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* Main Footer Content */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-16 text-center md:text-left"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Brand Section */}
          <motion.div
            className="col-span-1 md:col-span-2 lg:col-span-1"
            variants={itemVariants}
          >
            <div className="flex items-center justify-center md:justify-start space-x-3 mb-4">
              <span className="flex flex-row gap-2 text-xl font-bold text-yellow-400">
                <img
                  src={footerData.brand.logoUrl}
                  alt="Logo"
                  className="h-4 w-4 sm:h-6 sm:w-6 object-contain"
                />
                {footerData.brand.name}
              </span>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              {footerData.brand.description}
            </p>
          </motion.div>

          {/* Dynamic Sections */}
          {footerData.sections.map((section) => (
            <motion.div
              key={section.id}
              className="col-span-1"
              variants={itemVariants}
            >
              <div className="flex items-center justify-center md:justify-start mb-4">
                <h4 className="font-semibold text-white">{section.title}</h4>
              </div>

              <ul className="space-y-3 text-sm">
                {section.links.map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-blue-400 transition-colors duration-200"
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
