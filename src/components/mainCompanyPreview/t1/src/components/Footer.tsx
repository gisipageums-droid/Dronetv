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
export default function Footer({ content }) {
  // Use the content prop directly
  let { isSubscribed, setIsSubscribed } = useState(false);
  const footerData = content;

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
                  src={footerData.brand.logoUrl || logo}
                  alt="Logo"
                  className="h-4 w-4 rounded-full md:h-8 md:w-8 object-contain"
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

          {/* Contact & Social Media */}
          {/* <motion.div className="col-span-1" variants={itemVariants}>
            <h4 className="font-semibold text-white mb-4">Get in Touch</h4>
            
            <div className="space-y-3 mb-6 text-sm">
              <div
                className={`flex items-start justify-center md:justify-start space-x-3 text-gray-300 ${
                  isSubscribed ? "" : "blur-[3px] select-none"
                }`}
              >
                <Mail className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="">{footerData.contact.email}</span>
              </div>

              <div
                className={`flex items-start justify-center md:justify-start space-x-3 text-gray-300 ${
                  isSubscribed ? "" : "blur-[3px] select-none"
                }`}
              >
                <Phone className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="">{footerData.contact.phone}</span>
              </div>

              <div className="flex items-start justify-center md:justify-start space-x-3 text-gray-300">
                <MapPin
                  className={`w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0 ${
                    isSubscribed ? "" : "blur-[3px] select-none"
                  }`}
                />
                <span
                  className={`${isSubscribed ? "" : "blur-[3px] select-none"}`}
                >
                  {footerData.contact.address}
                </span>
              </div>
            </div>
          </motion.div> */}
        </motion.div>
      </div>
    </motion.footer>
  );
}
