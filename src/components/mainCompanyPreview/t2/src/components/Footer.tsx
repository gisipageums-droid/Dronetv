import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export default function Footer({ footerData }) {
let { isSubscribed, setIsSubscribed } = useState(false);

  // Create a mapping from social media names to their icon components
  const iconMap = {
    Facebook: Facebook,
    Twitter: Twitter,
    LinkedIn: Linkedin,
    Instagram: Instagram
  };

  // Function to process footerData and ensure icons are proper components
  const processFooterData = (data) => {
    if (!data) return null;
    
    return {
      ...data,
      socialLinks: data.socialLinks ? data.socialLinks.map(link => ({
        ...link,
        icon: iconMap[link.name] || Facebook // Fallback to Facebook if name not found
      })) : [
        { name: "Facebook", icon: Facebook, href: "#" },
        { name: "Twitter", icon: Twitter, href: "#" },
        { name: "LinkedIn", icon: Linkedin, href: "#" },
        { name: "Instagram", icon: Instagram, href: "#" }
      ]
    };
  };

  // Process the footer data
  const footerContent = processFooterData(footerData);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.footer 
      className="bg-black text-white theme-transition"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <motion.div 
          className="py-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Company info */}
            <motion.div 
              className="lg:col-span-2 space-y-6"
              variants={itemVariants}
            >
              <motion.div 
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-2"
                  whileHover={{ 
                    rotate: 360,
                    boxShadow: "0 0 20px rgba(250, 204, 21, 0.4)"
                  }}
                  transition={{ duration: 0.6 }}
                >
                  {/* <span className="text-black font-bold text-lg">{footerContent.companyInfo.logoText}</span> */}
                   <img
                      src={footerContent.companyInfo.logoText}
                      alt="Logo"
                      className="w-full h-full object-contain rounded-lg"
                    />
                </motion.div>
                <span className="text-xl font-bold text-white">{footerContent.companyInfo.companyName}</span>
              </motion.div>
              
              <p className="text-gray-400 max-w-md">{footerContent.companyInfo.description}</p>

              {/* Contact info */}
              <div className="space-y-3">
                <motion.div 
                  className="flex items-center space-x-3"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Mail className="h-5 w-5 text-primary" />
                  <span className={`text-gray-400 ${isSubscribed ? '' : 'bg-gray-400'}`}>{footerContent.companyInfo.email}</span>
                </motion.div>
                <motion.div 
                  className="flex items-center space-x-3"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Phone className="h-5 w-5 text-primary" />
                  <span className={`text-gray-400 ${isSubscribed ? '' : 'bg-gray-400'}`}>{footerContent.companyInfo.phone}</span>
                </motion.div>
              </div>

              {/* Social links */}
              <div className="flex space-x-4 flex-wrap">
                {footerContent.socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <motion.a
                      key={index}
                      href={social.href}
                      className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary hover:text-black transition-colors mb-2"
                      aria-label={social.name}
                      whileHover={{ 
                        scale: 1.1,
                        rotate: 360
                      }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      style={{ transitionDelay: `${index * 0.1}s` }}
                    >
                      <IconComponent className="h-5 w-5" />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>

            {/* Footer links */}
            {Object.entries(footerContent.footerLinks).map(([category, links], categoryIndex) => (
              <motion.div 
                key={category}
                variants={itemVariants}
              >
                <h4 className="font-medium text-white mb-4">{category}</h4>
                <ul className="space-y-3">
                  {links.map((link, linkIndex) => (
                    <motion.li 
                      key={linkIndex}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ 
                        delay: categoryIndex * 0.1 + linkIndex * 0.05,
                        duration: 0.5 
                      }}
                      whileHover={{ x: 5 }}
                    >
                      <a
                        href={link.href}
                        className="text-gray-400 hover:text-primary transition-colors"
                      >
                        {link.name}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Newsletter signup */}
        <motion.div 
          className="py-8 border-t border-gray-800"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div>
              <h4 className="font-medium text-white mb-2">{footerContent.newsletter.title}</h4>
              <p className="text-gray-400">{footerContent.newsletter.description}</p>
            </div>
            <motion.div 
              className="flex w-full md:w-auto max-w-md"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <motion.button 
                className="px-6 py-2 bg-primary text-black rounded-r-lg hover:bg-primary/90 transition-colors font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="font-medium text-black">{footerContent.newsletter.buttonText}</span>
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom footer */}
        <motion.div 
          className="py-6 border-t border-gray-800"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">{footerContent.bottomFooter.copyright}</p>
            <div className="flex space-x-6 text-sm">
              {footerContent.bottomFooter.links.map((link, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                  whileHover={{ y: -2 }}
                >
                  <a 
                    href={link.href} 
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}