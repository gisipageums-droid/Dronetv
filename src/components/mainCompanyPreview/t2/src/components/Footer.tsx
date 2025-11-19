
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import logo from "/images/Drone tv .in.jpg";

export default function Footer({ footerData }) {
  // Create a mapping from social media names to their icon components
  const iconMap = {
    Facebook: Facebook,
    Twitter: Twitter,
    LinkedIn: Linkedin,
    Instagram: Instagram
  };

  let { isSubscribed, setIsSubscribed } = useState(false)
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

  // Filter out the "Legal" category from footerLinks
  const filteredFooterLinks = footerContent ?
    Object.entries(footerContent.footerLinks || {}).filter(([category]) => category !== "Legal")
    : [];

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
              <div className="flex items-center">
                <div className="w-[50px] h-[50px] rounded-xl flex items-center justify-center mr-3 group">
                  <img
                    src={footerContent?.companyInfo?.logoUrl || logo}
                    alt="Logo"
                    className="w-full h-full object-contain cursor-pointer group-hover:scale-110 transition-all duration-300 rounded-xl"
                  />
                </div>
                <span className="text-xl font-bold text-white">{footerContent?.companyInfo?.companyName}</span>
              </div>

              <p className="text-gray-400 max-w-md text-justify">{footerContent?.companyInfo?.description}</p>


            </motion.div>

            {/* Footer links - Filtered to exclude Legal */}
            {filteredFooterLinks.map(([category, links], categoryIndex) => (
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



      </div>
    </motion.footer>
  );
}