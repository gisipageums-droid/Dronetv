import { Edit2, Heart, Loader2, Save, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

// Custom Button component (consistent with other components)
const Button = ({
  children,
  onClick,
  variant,
  size,
  className,
  disabled,
  ...props
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: string;
  size?: string;
  className?: string;
  disabled?: boolean;
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variants: Record<string, string> = {
    outline: "border border-gray-300 bg-transparent hover:bg-gray-50",
    default: "bg-blue-600 text-white hover:bg-blue-700",
  };
  const sizes: Record<string, string> = {
    sm: "h-8 px-3 text-sm",
    default: "h-10 px-4",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant || 'default']} ${
        sizes[size || 'default']
      } ${className || ""}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

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
  onStateChange?: (data: FooterData) => void;
  userId?: string;
  professionalId?: string;
  templateSelection?: string;
}

export function Footer({ footerData, onStateChange, userId, professionalId, templateSelection }: FooterProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const footerRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<FooterData>(defaultFooterData);
  const [tempData, setTempData] = useState<FooterData>(defaultFooterData);

  // Notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(data);
    }
  }, [data]);

  // Intersection observer
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

  // Fake API fetch
  const fetchFooterData = async () => {
    setIsLoading(true);
    try {
      const response = await new Promise<FooterData>((resolve) =>
        setTimeout(() => resolve(footerData || defaultFooterData), 1200)
      );
      setData(response);
      setTempData(response);
      setDataLoaded(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible && !dataLoaded && !isLoading) {
      fetchFooterData();
    }
  }, [isVisible, dataLoaded, isLoading, footerData]);

  const handleEdit = () => {
    setIsEditing(true);
    setTempData({ ...data });
  };

  // Save function
  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Save the updated data
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate save API call
      
      // Update both states
      setData(tempData);
      
      setIsEditing(false);
      toast.success('Footer section saved successfully');

    } catch (error) {
      console.error('Error saving footer section:', error);
      toast.error('Error saving changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTempData({ ...data });
    setIsEditing(false);
  };

  // Update functions with useCallback
  const updateBasicField = useCallback((field: keyof FooterData, value: string) => {
    setTempData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const updateContactInfo = useCallback((field: keyof ContactInfo, value: string) => {
    setTempData(prev => ({
      ...prev,
      contactInfo: { ...prev.contactInfo, [field]: value }
    }));
  }, []);

  const updateQuickLink = useCallback((index: number, field: keyof FooterLink, value: string) => {
    const updatedLinks = [...tempData.quickLinks];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setTempData(prev => ({
      ...prev,
      quickLinks: updatedLinks
    }));
  }, [tempData.quickLinks]);

  const updateMoreLink = useCallback((index: number, field: keyof FooterLink, value: string) => {
    const updatedLinks = [...tempData.moreLinks];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setTempData(prev => ({
      ...prev,
      moreLinks: updatedLinks
    }));
  }, [tempData.moreLinks]);

  const updateSocialLink = useCallback((index: number, field: keyof SocialLink, value: string) => {
    const updatedLinks = [...tempData.socialLinks];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setTempData(prev => ({
      ...prev,
      socialLinks: updatedLinks
    }));
  }, [tempData.socialLinks]);

  const addQuickLink = useCallback(() => {
    setTempData(prev => ({
      ...prev,
      quickLinks: [...prev.quickLinks, { href: "#", label: "New Link" }]
    }));
  }, []);

  const addMoreLink = useCallback(() => {
    setTempData(prev => ({
      ...prev,
      moreLinks: [...prev.moreLinks, { href: "#", label: "New Link" }]
    }));
  }, []);

  const removeQuickLink = useCallback((index: number) => {
    if (tempData.quickLinks.length <= 1) {
      toast.error("You must have at least one quick link");
      return;
    }
    const updatedLinks = tempData.quickLinks.filter((_, i) => i !== index);
    setTempData(prev => ({
      ...prev,
      quickLinks: updatedLinks
    }));
  }, [tempData.quickLinks]);

  const removeMoreLink = useCallback((index: number) => {
    if (tempData.moreLinks.length <= 1) {
      toast.error("You must have at least one more link");
      return;
    }
    const updatedLinks = tempData.moreLinks.filter((_, i) => i !== index);
    setTempData(prev => ({
      ...prev,
      moreLinks: updatedLinks
    }));
  }, [tempData.moreLinks]);

  const removeSocialLink = useCallback((index: number) => {
    if (tempData.socialLinks.length <= 1) {
      toast.error("You must have at least one social link");
      return;
    }
    const updatedLinks = tempData.socialLinks.filter((_, i) => i !== index);
    setTempData(prev => ({
      ...prev,
      socialLinks: updatedLinks
    }));
  }, [tempData.socialLinks]);

  const displayData = isEditing ? tempData : data;
  const currentYear = new Date().getFullYear();

  // Loading state
  if (isLoading) {
    return (
      <footer ref={footerRef} className="py-12 text-white bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-yellow-500" />
          <p className="text-gray-400 mt-4">Loading footer data...</p>
        </div>
      </footer>
    );
  }

  // Helper function to get Lucide icons
  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = {
      Linkedin: Edit2, // Replace with actual Linkedin icon
      Github: Heart,   // Replace with actual Github icon
      Twitter: Save,   // Replace with actual Twitter icon
      Mail: X,         // Replace with actual Mail icon
      Instagram: Heart // Replace with actual Instagram icon
    };
    return icons[iconName] || Edit2;
  };

  return (
    <footer ref={footerRef} className="py-12 text-white bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Edit Controls */}
        <div className='text-right mb-8'>
          {!isEditing ? (
            <Button
              onClick={handleEdit}
              size='sm'
              className='bg-red-500 hover:bg-red-600 shadow-md text-white'
            >
              <Edit2 className='w-4 h-4 mr-2' />
              Edit Footer
            </Button>
          ) : (
            <div className='flex gap-2 justify-end'>
              <Button
                onClick={handleSave}
                size='sm'
                className='bg-green-600 hover:bg-green-700 text-white shadow-md'
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                ) : (
                  <Save className='w-4 h-4 mr-2' />
                )}
                {isSaving ? "Saving..." : "Save"}
              </Button>
              <Button
                onClick={handleCancel}
                size='sm'
                className='bg-red-500 hover:bg-red-600 shadow-md text-white'
                disabled={isSaving}
              >
                <X className='w-4 h-4 mr-2' />
                Cancel
              </Button>
            </div>
          )}
        </div>

        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-4 md:col-span-2"
          >
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={displayData.logoText}
                  onChange={(e) => updateBasicField('logoText', e.target.value)}
                  className="w-full text-2xl font-bold text-white bg-gray-800 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2"
                />
                <input
                  type="text"
                  value={displayData.tagline}
                  onChange={(e) => updateBasicField('tagline', e.target.value)}
                  className="w-full text-lg text-yellow-400 bg-gray-800 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2"
                />
                <textarea
                  value={displayData.description}
                  onChange={(e) => updateBasicField('description', e.target.value)}
                  className="w-full text-sm text-gray-400 bg-gray-800 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 resize-none"
                  rows={4}
                />
              </>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-white">{displayData.logoText}</h3>
                <p className="text-lg text-yellow-400">{displayData.tagline}</p>
                <p className="leading-relaxed text-gray-400">
                  {displayData.description}
                </p>
              </>
            )}
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
            {isEditing ? (
              <div className="space-y-2">
                {displayData.quickLinks.map((link, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => updateQuickLink(index, 'label', e.target.value)}
                      className="flex-1 text-sm text-gray-400 bg-gray-800 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2"
                      placeholder="Link Label"
                    />
                    <input
                      type="text"
                      value={link.href}
                      onChange={(e) => updateQuickLink(index, 'href', e.target.value)}
                      className="flex-1 text-sm text-gray-400 bg-gray-800 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2"
                      placeholder="Link URL"
                    />
                    <Button
                      onClick={() => removeQuickLink(index)}
                      size="sm"
                      variant="outline"
                      className="bg-red-50 hover:bg-red-100 text-red-700 p-1"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
                <Button
                  onClick={addQuickLink}
                  variant="outline"
                  size="sm"
                  className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700"
                >
                  Add Quick Link
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {displayData.quickLinks.map((link, index) => (
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
            )}
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
            {isEditing ? (
              <div className="space-y-2">
                {displayData.moreLinks.map((link, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => updateMoreLink(index, 'label', e.target.value)}
                      className="flex-1 text-sm text-gray-400 bg-gray-800 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2"
                      placeholder="Link Label"
                    />
                    <input
                      type="text"
                      value={link.href}
                      onChange={(e) => updateMoreLink(index, 'href', e.target.value)}
                      className="flex-1 text-sm text-gray-400 bg-gray-800 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2"
                      placeholder="Link URL"
                    />
                    <Button
                      onClick={() => removeMoreLink(index)}
                      size="sm"
                      variant="outline"
                      className="bg-red-50 hover:bg-red-100 text-red-700 p-1"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
                <Button
                  onClick={addMoreLink}
                  variant="outline"
                  size="sm"
                  className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700"
                >
                  Add More Link
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {displayData.moreLinks.map((link, index) => (
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
            )}
          </motion.div>
        </div>

        {/* Contact & Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="grid gap-8 md:grid-cols-2 mt-8 pt-8 border-t border-gray-800"
        >
          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-yellow-400">Contact Info</h4>
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={displayData.contactInfo.email}
                  onChange={(e) => updateContactInfo('email', e.target.value)}
                  className="w-full text-sm text-gray-400 bg-gray-800 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2"
                  placeholder="Email"
                />
                <input
                  type="text"
                  value={displayData.contactInfo.location}
                  onChange={(e) => updateContactInfo('location', e.target.value)}
                  className="w-full text-sm text-gray-400 bg-gray-800 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2"
                  placeholder="Location"
                />
                <input
                  type="text"
                  value={displayData.contactInfo.availability}
                  onChange={(e) => updateContactInfo('availability', e.target.value)}
                  className="w-full text-sm text-gray-400 bg-gray-800 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2"
                  placeholder="Availability"
                />
              </div>
            ) : (
              <div className="space-y-2 text-gray-400">
                <p>{displayData.contactInfo.email}</p>
                <p>{displayData.contactInfo.location}</p>
                <p>{displayData.contactInfo.availability}</p>
              </div>
            )}
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-yellow-400">Follow Me</h4>
            {isEditing ? (
              <div className="space-y-2">
                {displayData.socialLinks.map((social, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={social.label}
                      onChange={(e) => updateSocialLink(index, 'label', e.target.value)}
                      className="flex-1 text-sm text-gray-400 bg-gray-800 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2"
                      placeholder="Social Label"
                    />
                    <input
                      type="text"
                      value={social.href}
                      onChange={(e) => updateSocialLink(index, 'href', e.target.value)}
                      className="flex-1 text-sm text-gray-400 bg-gray-800 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2"
                      placeholder="Social URL"
                    />
                    <Button
                      onClick={() => removeSocialLink(index)}
                      size="sm"
                      variant="outline"
                      className="bg-red-50 hover:bg-red-100 text-red-700 p-1"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
                <Button
                  onClick={() => {
                    setTempData(prev => ({
                      ...prev,
                      socialLinks: [...prev.socialLinks, { 
                        icon: "Link", 
                        label: "New Social", 
                        href: "#", 
                        color: "hover:text-gray-400" 
                      }]
                    }))
                  }}
                  variant="outline"
                  size="sm"
                  className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700"
                >
                  Add Social Link
                </Button>
              </div>
            ) : (
              <div className="flex space-x-4">
                {displayData.socialLinks.map((social, index) => {
                  const IconComponent = getIconComponent(social.icon);
                  return (
                    <motion.a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`text-gray-400 transition-colors duration-300 ${social.color}`}
                      title={social.label}
                    >
                      <IconComponent className="w-5 h-5" />
                    </motion.a>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="pt-8 mt-8 text-center border-t border-gray-800"
        >
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={displayData.copyright.replace(`© ${currentYear}`, '').trim()}
                onChange={(e) => updateBasicField('copyright', `© ${currentYear} ${e.target.value}`)}
                className="w-full text-sm text-gray-400 bg-gray-800 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 text-center"
                placeholder="Copyright text"
              />
              <input
                type="text"
                value={displayData.builtWith}
                onChange={(e) => updateBasicField('builtWith', e.target.value)}
                className="w-full text-sm text-gray-400 bg-gray-800 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 text-center"
                placeholder="Built with text"
              />
            </div>
          ) : (
            <>
              <p className="text-gray-400">{displayData.copyright}</p>
              <p className="flex justify-center items-center space-x-2 text-gray-400 mt-2">
                <span>{displayData.builtWith}</span>
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                >
                  <Heart className="w-4 h-4 text-red-500 fill-current" />
                </motion.span>
              </p>
            </>
          )}
        </motion.div>
      </div>
    </footer>
  );
}