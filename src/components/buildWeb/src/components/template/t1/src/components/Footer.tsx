import {
  Mail,
  MapPin,
  Phone
} from "lucide-react";
import { motion } from "motion/react";

import logo from "../public/images/logos/logo.svg";

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center space-x-3 mb-6">
              <span className="flex flex-row gap-2 text-xl font-bold text-red-500">
                <motion.img
                  src={logo}
                  alt="Logo"
                  className="h-6 w-6 object-contain"
                  // Entrance animation
                  initial={{ opacity: 0, scale: 0.5, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.8, type: "spring", stiffness: 120 }}
                  // Floating effect (infinite)
                  whileInView={{
                    y: [0, -4, 0],
                    transition: {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  }}
                  // Interactive hover & tap
                  whileHover={{
                    rotate: [0, -5, 5, -5, 0],
                    scale: 1.2,
                    boxShadow: "0px 0px 15px rgba(255, 215, 0, 0.6)",
                    transition: { duration: 0.5 },
                  }}
                  whileTap={{ scale: 0.9 }}
                />
                Innovative Labs
              </span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-8 text-center md:text-left">
              Innovative solutions for modern businesses. Transform your
              operations with our expert guidance and cutting-edge technology.
            </p>
          </div>

          {/* Company Links */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-semibold text-white mb-6">Company</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <a
                  href="#home"
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-200"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-200"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#profile"
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-200"
                >
                  Profile
                </a>
              </li>
              <li>
                <a
                  href="#gallery"
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-200"
                >
                  Gallery
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Social Media */}
          <div className="flex flex-col items-center md:items-start md:col-span-2 lg:col-span-1">
            <h4 className="font-semibold text-white mb-6">Get in Touch</h4>

            {/* Contact Info */}
            <div className="space-y-5 mb-10 text-sm">
              <div className="flex items-start space-x-3 text-gray-300">
                <Mail className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="blur-[3px] select-none">hello@innovativelabs.com</span>
              </div>
              <div className="flex items-start space-x-3 text-gray-300">
                <Phone className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="blur-[3px] select-none">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-start space-x-3 text-gray-300">
                <MapPin className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="blur-[3px] select-none">San Francisco, CA 94105</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
