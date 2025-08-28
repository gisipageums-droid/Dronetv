import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Button } from "./ui/button";

export default function Footer() {
  const [isEditing, setIsEditing] = useState(false);

  const [companyInfo, setCompanyInfo] = useState({
    logoText: "C",
    companyName: "Company",
    description: "We help businesses transform and grow with innovative solutions, expert guidance, and proven strategies that deliver exceptional results.",
    email: "hello@company.com",
    phone: "+1 (555) 123-4567"
  });

  const [footerLinks, setFooterLinks] = useState({
    Company: [
      { name: "About Us", href: "#about" },
      { name: "Our Team", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Contact", href: "#contact" }
    ],
    Services: [
      { name: "Strategy Consulting", href: "#services" },
      { name: "Team Development", href: "#services" },
      { name: "Digital Transformation", href: "#services" },
      { name: "Performance Optimization", href: "#services" }
    ],
    Resources: [
      { name: "Blog", href: "#" },
      { name: "Case Studies", href: "#" },
      { name: "Whitepapers", href: "#" },
      { name: "Documentation", href: "#" }
    ],
    Legal: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Cookie Policy", href: "#" },
      { name: "GDPR", href: "#" }
    ]
  });

  const [socialLinks, setSocialLinks] = useState([
    { name: "Facebook", icon: Facebook, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "LinkedIn", icon: Linkedin, href: "#" },
    { name: "Instagram", icon: Instagram, href: "#" }
  ]);

  const [newsletter, setNewsletter] = useState({
    title: "Stay updated",
    description: "Get the latest news and insights delivered to your inbox.",
    buttonText: "Subscribe"
  });

  const [bottomFooter, setBottomFooter] = useState({
    copyright: "© 2024 Company. All rights reserved.",
    links: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Cookies", href: "#" }
    ]
  });

  // Handlers for company info
  const updateCompanyInfo = (field, value) => {
    setCompanyInfo(prev => ({ ...prev, [field]: value }));
  };

  // Handlers for footer links
  const updateFooterLink = (category, index, field, value) => {
    setFooterLinks(prev => ({
      ...prev,
      [category]: prev[category].map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    }));
  };

  const addFooterLink = (category) => {
    setFooterLinks(prev => ({
      ...prev,
      [category]: [...prev[category], { name: "New Link", href: "#" }]
    }));
  };

  const removeFooterLink = (category, index) => {
    setFooterLinks(prev => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index)
    }));
  };

  // Handlers for social links
  const updateSocialLink = (index, field, value) => {
    setSocialLinks(prev => 
      prev.map((link, i) => i === index ? { ...link, [field]: value } : link)
    );
  };

  const addSocialLink = () => {
    setSocialLinks(prev => [...prev, { name: "New Social", icon: Facebook, href: "#" }]);
  };

  const removeSocialLink = (index) => {
    setSocialLinks(prev => prev.filter((_, i) => i !== index));
  };

  // Handlers for newsletter
  const updateNewsletter = (field, value) => {
    setNewsletter(prev => ({ ...prev, [field]: value }));
  };

  // Handlers for bottom footer
  const updateBottomFooter = (field, value) => {
    setBottomFooter(prev => ({ ...prev, [field]: value }));
  };

  const updateBottomFooterLink = (index, field, value) => {
    setBottomFooter(prev => ({
      ...prev,
      links: prev.links.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    }));
  };

  const addBottomFooterLink = () => {
    setBottomFooter(prev => ({
      ...prev,
      links: [...prev.links, { name: "New Link", href: "#" }]
    }));
  };

  const removeBottomFooterLink = (index) => {
    setBottomFooter(prev => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index)
    }));
  };

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
                  {isEditing ? (
                    <input
                      value={companyInfo.logoText}
                      onChange={(e) => updateCompanyInfo("logoText", e.target.value)}
                      className="text-black font-bold text-lg w-4 bg-transparent border-b"
                    />
                  ) : (
                    <span className="text-black font-bold text-lg">{companyInfo.logoText}</span>
                  )}
                </motion.div>
                {isEditing ? (
                  <input
                    value={companyInfo.companyName}
                    onChange={(e) => updateCompanyInfo("companyName", e.target.value)}
                    className="text-xl font-bold text-white bg-transparent border-b w-full"
                  />
                ) : (
                  <span className="text-xl font-bold text-white">{companyInfo.companyName}</span>
                )}
              </motion.div>
              
              {isEditing ? (
                <textarea
                  value={companyInfo.description}
                  onChange={(e) => updateCompanyInfo("description", e.target.value)}
                  className="text-gray-400 max-w-md w-full bg-transparent border-b"
                  rows={3}
                />
              ) : (
                <p className="text-gray-400 max-w-md">{companyInfo.description}</p>
              )}

              {/* Contact info */}
              <div className="space-y-3">
                <motion.div 
                  className="flex items-center space-x-3"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Mail className="h-5 w-5 text-primary" />
                  {isEditing ? (
                    <input
                      value={companyInfo.email}
                      onChange={(e) => updateCompanyInfo("email", e.target.value)}
                      className="text-gray-400 bg-transparent border-b w-full"
                    />
                  ) : (
                    <span className="text-gray-400">{companyInfo.email}</span>
                  )}
                </motion.div>
                <motion.div 
                  className="flex items-center space-x-3"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Phone className="h-5 w-5 text-primary" />
                  {isEditing ? (
                    <input
                      value={companyInfo.phone}
                      onChange={(e) => updateCompanyInfo("phone", e.target.value)}
                      className="text-gray-400 bg-transparent border-b w-full"
                    />
                  ) : (
                    <span className="text-gray-400">{companyInfo.phone}</span>
                  )}
                </motion.div>
              </div>

              {/* Social links */}
              <div className="flex space-x-4 flex-wrap">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <motion.div
                      key={index}
                      className="flex items-center mb-2"
                    >
                      <motion.a
                        href={social.href}
                        className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary hover:text-black transition-colors"
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
                      {isEditing && (
                        <div className="ml-2">
                          <input
                            value={social.name}
                            onChange={(e) => updateSocialLink(index, "name", e.target.value)}
                            className="text-white bg-transparent border-b w-24"
                          />
                          <input
                            value={social.href}
                            onChange={(e) => updateSocialLink(index, "href", e.target.value)}
                            className="text-white bg-transparent border-b w-24 ml-1"
                          />
                          <Button
                            size="sm"
                            variant="destructive"
                            className="ml-1"
                            onClick={() => removeSocialLink(index)}
                          >
                            ×
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
                {isEditing && (
                  <Button onClick={addSocialLink} className="text-green-600 mb-2">
                    + Add
                  </Button>
                )}
              </div>
            </motion.div>

            {/* Footer links */}
            {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
              <motion.div 
                key={category}
                variants={itemVariants}
              >
                {isEditing ? (
                  <input
                    value={category}
                    onChange={(e) => {
                      const newCategory = e.target.value;
                      setFooterLinks(prev => {
                        const newLinks = { ...prev };
                        newLinks[newCategory] = newLinks[category];
                        delete newLinks[category];
                        return newLinks;
                      });
                    }}
                    className="font-medium text-white mb-4 bg-transparent border-b w-full"
                  />
                ) : (
                  <h4 className="font-medium text-white mb-4">{category}</h4>
                )}
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
                      {isEditing ? (
                        <div className="flex items-center">
                          <input
                            value={link.name}
                            onChange={(e) => updateFooterLink(category, linkIndex, "name", e.target.value)}
                            className="text-gray-400 bg-transparent border-b w-full mr-2"
                          />
                          <input
                            value={link.href}
                            onChange={(e) => updateFooterLink(category, linkIndex, "href", e.target.value)}
                            className="text-gray-400 bg-transparent border-b w-full mr-2"
                          />
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeFooterLink(category, linkIndex)}
                          >
                            ×
                          </Button>
                        </div>
                      ) : (
                        <a
                          href={link.href}
                          className="text-gray-400 hover:text-primary transition-colors"
                        >
                          {link.name}
                        </a>
                      )}
                    </motion.li>
                  ))}
                  {isEditing && (
                    <li>
                      <Button onClick={() => addFooterLink(category)} className="text-green-600">
                        + Add Link
                      </Button>
                    </li>
                  )}
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
              {isEditing ? (
                <input
                  value={newsletter.title}
                  onChange={(e) => updateNewsletter("title", e.target.value)}
                  className="font-medium text-white mb-2 bg-transparent border-b"
                />
              ) : (
                <h4 className="font-medium text-white mb-2">{newsletter.title}</h4>
              )}
              {isEditing ? (
                <input
                  value={newsletter.description}
                  onChange={(e) => updateNewsletter("description", e.target.value)}
                  className="text-gray-400 bg-transparent border-b w-full"
                />
              ) : (
                <p className="text-gray-400">{newsletter.description}</p>
              )}
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
                {isEditing ? (
                  <input
                    value={newsletter.buttonText}
                    onChange={(e) => updateNewsletter("buttonText", e.target.value)}
                    className="font-medium text-black bg-transparent border-b w-full text-center"
                  />
                ) : (
                  <span className="font-medium text-black">{newsletter.buttonText}</span>
                )}
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
            {isEditing ? (
              <input
                value={bottomFooter.copyright}
                onChange={(e) => updateBottomFooter("copyright", e.target.value)}
                className="text-gray-400 text-sm bg-transparent border-b w-full md:w-auto"
              />
            ) : (
              <p className="text-gray-400 text-sm">{bottomFooter.copyright}</p>
            )}
            <div className="flex space-x-6 text-sm">
              {bottomFooter.links.map((link, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                  whileHover={{ y: -2 }}
                >
                  {isEditing ? (
                    <div className="flex items-center">
                      <input
                        value={link.name}
                        onChange={(e) => updateBottomFooterLink(index, "name", e.target.value)}
                        className="text-gray-400 bg-transparent border-b w-32 mr-2"
                      />
                      <input
                        value={link.href}
                        onChange={(e) => updateBottomFooterLink(index, "href", e.target.value)}
                        className="text-gray-400 bg-transparent border-b w-32 mr-2"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeBottomFooterLink(index)}
                      >
                        ×
                      </Button>
                    </div>
                  ) : (
                    <a 
                      href={link.href} 
                      className="text-gray-400 hover:text-primary transition-colors"
                    >
                      {link.name}
                    </a>
                  )}
                </motion.div>
              ))}
              {isEditing && (
                <Button onClick={addBottomFooterLink} className="text-green-600">
                  + Add
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Edit/Save Button */}
        <div className="flex justify-end mt-6 pb-6">
          {isEditing ? (
            <Button
              onClick={() => setIsEditing(false)}
              className="bg-green-600 text-white"
            >
              Save
            </Button>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-yellow-500 text-black"
            >
              Edit
            </Button>
          )}
        </div>
      </div>
    </motion.footer>
  );
}