import React from "react";
import { motion } from "framer-motion";
import { Code, Github, Linkedin, Mail, Heart, ArrowUp } from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#skills", label: "Skills" },
    { href: "#projects", label: "Projects" },
  ];

  const moreLinks = [
    // { href: "#certifications", label: "Certifications" },
    { href: "#services", label: "Services" },
    { href: "#testimonials", label: "Testimonials" },
    // { href: "#contact", label: "Contact" },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-dark-300 border-t border-gray-200 dark:border-gray-800">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 lg:col-span-2">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center space-x-2 mb-4"
            >
              <Code className="w-8 h-8 text-orange-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                John Doe
              </span>
            </motion.div>

            <p className="text-gray-400 mb-6 leading-relaxed max-w-md">
              Full-Stack Developer passionate about creating exceptional digital
              experiences. I build modern, scalable applications that make a
              difference.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              <motion.a
                whileHover={{ y: -2, scale: 1.1 }}
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-accent-yellow hover:bg-accent-yellow/20 transition-all duration-200"
              >
                <Github className="w-5 h-5" />
              </motion.a>
              <motion.a
                whileHover={{ y: -2, scale: 1.1 }}
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-accent-orange hover:bg-accent-orange/20 transition-all duration-200"
              >
                <Linkedin className="w-5 h-5" />
              </motion.a>
              <motion.a
                whileHover={{ y: -2, scale: 1.1 }}
                href="mailto:john.doe@example.com"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-accent-red hover:bg-accent-red/20 transition-all duration-200"
              >
                <Mail className="w-5 h-5" />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-700 dark:text-white font-semibold mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <motion.button
                    whileHover={{ x: 5 }}
                    onClick={() => scrollToSection(link.href)}
                    className="text-gray-400 hover:text-accent-orange transition-colors duration-200 text-left"
                  >
                    {link.label}
                  </motion.button>
                </li>
              ))}
            </ul>
          </div>

          {/* More Links */}
          <div>
            <h3 className="text-gray-700 dark:text-white font-semibold mb-4">
              More
            </h3>
            <ul className="space-y-2">
              {moreLinks.map((link) => (
                <li key={link.href}>
                  <motion.button
                    whileHover={{ x: 5 }}
                    onClick={() => scrollToSection(link.href)}
                    className="text-gray-400 hover:text-accent-orange transition-colors duration-200 text-left"
                  >
                    {link.label}
                  </motion.button>
                </li>
              ))}
            </ul>

            {/* Newsletter Signup */}
            <div className="mt-6">
              <h4 className="text-gray-700 dark:text-white font-medium mb-2">
                Stay Updated
              </h4>
              <p className="text-gray-400 text-sm mb-3">
                Get notified about new projects and insights.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-gray-300 placeholder-gray-500 text-sm focus:border-accent-orange focus:outline-none"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-orange-400 text-white rounded-r-lg text-sm font-medium hover:shadow-lg transition-all duration-200"
                >
                  Join
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center text-gray-400 text-sm mb-4 md:mb-0">
              <span>© {currentYear} John Doe. Made with</span>
              <Heart className="w-4 h-4 mx-1 text-accent-red fill-current" />
              <span>and lots of ☕</span>
            </div>

            <div className="flex items-center space-x-6 text-sm">
              <motion.a
                whileHover={{ y: -1 }}
                href="#"
                className="text-gray-400 hover:text-accent-orange transition-colors duration-200"
              >
                Privacy Policy
              </motion.a>
              <motion.a
                whileHover={{ y: -1 }}
                href="#"
                className="text-gray-400 hover:text-accent-orange transition-colors duration-200"
              >
                Terms of Service
              </motion.a>
              <motion.button
                whileHover={{ y: -2, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={scrollToTop}
                className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center text-black hover:shadow-lg transition-all duration-200 animate-bounce"
              >
                <ArrowUp className="w-6 h-6" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark-300 to-transparent opacity-50 pointer-events-none" />
    </footer>
  );
};

export default Footer;
