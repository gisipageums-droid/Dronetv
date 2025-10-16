import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Phone,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Button } from "./ui/button";

export default function Footer() {
  const [isEditing, setIsEditing] = useState(false);

  const [companyInfo, setCompanyInfo] = useState({
    logoText: "C",
    companyName: "Company",
    description:
      "We help businesses transform and grow with innovative solutions, expert guidance, and proven strategies that deliver exceptional results.",
    email: "hello@company.com",
    phone: "+1 (555) 123-4567",
  });

  const [footerLinks, setFooterLinks] = useState({
    Company: [
      { name: "About Us", href: "#about" },
      { name: "Our Team", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Contact", href: "#contact" },
    ],
    Services: [
      { name: "Strategy Consulting", href: "#services" },
      { name: "Team Development", href: "#services" },
      { name: "Digital Transformation", href: "#services" },
      { name: "Performance Optimization", href: "#services" },
    ],
    Resources: [
      { name: "Blog", href: "#" },
      { name: "Case Studies", href: "#" },
      { name: "Whitepapers", href: "#" },
      { name: "Documentation", href: "#" },
    ],
    Legal: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Cookie Policy", href: "#" },
      { name: "GDPR", href: "#" },
    ],
  });

  const [socialLinks, setSocialLinks] = useState([
    { name: "Facebook", icon: Facebook, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "LinkedIn", icon: Linkedin, href: "#" },
    { name: "Instagram", icon: Instagram, href: "#" },
  ]);

  const [newsletter, setNewsletter] = useState({
    title: "Stay updated",
    description: "Get the latest news and insights delivered to your inbox.",
    buttonText: "Subscribe",
  });

  const [bottomFooter, setBottomFooter] = useState({
    copyright: "© 2024 Company. All rights reserved.",
    links: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Cookies", href: "#" },
    ],
  });

  // Handlers for company info
  const updateCompanyInfo = (field, value) => {
    setCompanyInfo((prev) => ({ ...prev, [field]: value }));
  };

  // Handlers for footer links
  const updateFooterLink = (category, index, field, value) => {
    setFooterLinks((prev) => ({
      ...prev,
      [category]: prev[category].map((link, i) =>
        i === index ? { ...link, [field]: value } : link
      ),
    }));
  };

  const addFooterLink = (category) => {
    setFooterLinks((prev) => ({
      ...prev,
      [category]: [...prev[category], { name: "New Link", href: "#" }],
    }));
  };

  const removeFooterLink = (category, index) => {
    setFooterLinks((prev) => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index),
    }));
  };

  // Handlers for social links
  const updateSocialLink = (index, field, value) => {
    setSocialLinks((prev) =>
      prev.map((link, i) => (i === index ? { ...link, [field]: value } : link))
    );
  };

  const addSocialLink = () => {
    setSocialLinks((prev) => [
      ...prev,
      { name: "New Social", icon: Facebook, href: "#" },
    ]);
  };

  const removeSocialLink = (index) => {
    setSocialLinks((prev) => prev.filter((_, i) => i !== index));
  };

  // Handlers for newsletter
  const updateNewsletter = (field, value) => {
    setNewsletter((prev) => ({ ...prev, [field]: value }));
  };

  // Handlers for bottom footer
  const updateBottomFooter = (field, value) => {
    setBottomFooter((prev) => ({ ...prev, [field]: value }));
  };

  const updateBottomFooterLink = (index, field, value) => {
    setBottomFooter((prev) => ({
      ...prev,
      links: prev.links.map((link, i) =>
        i === index ? { ...link, [field]: value } : link
      ),
    }));
  };

  const addBottomFooterLink = () => {
    setBottomFooter((prev) => ({
      ...prev,
      links: [...prev.links, { name: "New Link", href: "#" }],
    }));
  };

  const removeBottomFooterLink = (index) => {
    setBottomFooter((prev) => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index),
    }));
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
      className='bg-black text-white theme-transition'
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Main footer content */}
        <motion.div
          className='py-16'
          variants={containerVariants}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
        >
          <div className='grid lg:grid-cols-5 gap-8'>
            {/* Company info */}
            <motion.div
              className='lg:col-span-2 space-y-6'
              variants={itemVariants}
            >
              <motion.div
                className='flex items-center'
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className='w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-2'
                  whileHover={{
                    rotate: 360,
                    boxShadow: "0 0 20px rgba(250, 204, 21, 0.4)",
                  }}
                  transition={{ duration: 0.6 }}
                >
                  {isEditing ? (
                    <input
                      value={companyInfo.logoText}
                      onChange={(e) =>
                        updateCompanyInfo("logoText", e.target.value)
                      }
                      className='text-black font-bold text-lg w-4 bg-transparent border-b'
                    />
                  ) : (
                    <span className='text-black font-bold text-lg'>
                      {companyInfo.logoText}
                    </span>
                  )}
                </motion.div>
                {isEditing ? (
                  <input
                    value={companyInfo.companyName}
                    onChange={(e) =>
                      updateCompanyInfo("companyName", e.target.value)
                    }
                    className='text-xl font-bold text-white bg-transparent border-b w-full'
                  />
                ) : (
                  <span className='text-xl font-bold text-white'>
                    {companyInfo.companyName}
                  </span>
                )}
              </motion.div>

              {isEditing ? (
                <textarea
                  value={companyInfo.description}
                  onChange={(e) =>
                    updateCompanyInfo("description", e.target.value)
                  }
                  className='text-gray-400 max-w-md w-full bg-transparent border-b'
                  rows={3}
                />
              ) : (
                <p className='text-gray-400 max-w-md'>
                  {companyInfo.description}
                </p>
              )}
            </motion.div>

            {/* Footer links */}
            {Object.entries(footerLinks).map(
              ([category, links], categoryIndex) => (
                <motion.div key={category} variants={itemVariants}>
                  {isEditing ? (
                    <input
                      value={category}
                      onChange={(e) => {
                        const newCategory = e.target.value;
                        setFooterLinks((prev) => {
                          const newLinks = { ...prev };
                          newLinks[newCategory] = newLinks[category];
                          delete newLinks[category];
                          return newLinks;
                        });
                      }}
                      className='font-medium text-white mb-4 bg-transparent border-b w-full'
                    />
                  ) : (
                    <h4 className='font-medium text-white mb-4'>{category}</h4>
                  )}
                  <ul className='space-y-3'>
                    {links.map((link, linkIndex) => (
                      <motion.li
                        key={linkIndex}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          delay: categoryIndex * 0.1 + linkIndex * 0.05,
                          duration: 0.5,
                        }}
                        whileHover={{ x: 5 }}
                      >
                        {isEditing ? (
                          <div className='flex items-center'>
                            <input
                              value={link.name}
                              onChange={(e) =>
                                updateFooterLink(
                                  category,
                                  linkIndex,
                                  "name",
                                  e.target.value
                                )
                              }
                              className='text-gray-400 bg-transparent border-b w-full mr-2'
                            />
                            <input
                              value={link.href}
                              onChange={(e) =>
                                updateFooterLink(
                                  category,
                                  linkIndex,
                                  "href",
                                  e.target.value
                                )
                              }
                              className='text-gray-400 bg-transparent border-b w-full mr-2'
                            />
                            <Button
                              size='sm'
                              variant='destructive'
                              onClick={() =>
                                removeFooterLink(category, linkIndex)
                              }
                            >
                              ×
                            </Button>
                          </div>
                        ) : (
                          <a
                            href={link.href}
                            className='text-gray-400 hover:text-primary transition-colors'
                          >
                            {link.name}
                          </a>
                        )}
                      </motion.li>
                    ))}
                    {isEditing && (
                      <li>
                        <Button
                          onClick={() => addFooterLink(category)}
                          className='text-green-600'
                        >
                          + Add Link
                        </Button>
                      </li>
                    )}
                  </ul>
                </motion.div>
              )
            )}
          </div>
        </motion.div>


      </div>
    </motion.footer>
  );
}
