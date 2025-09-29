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

interface FooterData {
  portfolio: {
    title: string;
    description: string;
  };
  quickLinks: {
    title: string;
    links: string[];
  };
  contact: {
    title: string;
    email: string;
    phone: string;
    location: string;
  };
  socialLinks: string[];
}

const defaultFooterData: FooterData = {
  portfolio: {
    title: "Portfolio",
    description: "Creating amazing digital experiences with passion and precision. Let's build something incredible together."
  },
  quickLinks: {
    title: "Quick Links",
    links: ['Home', 'About', 'Skills', 'Projects', 'Clients', 'Reviews', 'Contact']
  },
  contact: {
    title: "Get In Touch",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA"
  },
  socialLinks: ['LinkedIn', 'GitHub', 'Twitter']
};

interface FooterProps {
  footerData?: FooterData;
  onStateChange?: (data: FooterData) => void;
  userId?: string;
  publishedId?: string;
  templateSelection?: string;
}

export function Footer({ footerData, onStateChange, userId, publishedId, templateSelection }: FooterProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const footerRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<FooterData>(defaultFooterData);
  const [tempData, setTempData] = useState<FooterData>(defaultFooterData);

  // Notify parent of state changes - SAME AS HERO
  useEffect(() => {
    if (onStateChange) {
      onStateChange(data);
    }
  }, [data]);

  // Intersection observer - SAME AS HERO
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

  // Fake API fetch - SAME LOGIC AS HERO
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

  // Save function - SAME PATTERN AS HERO
  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Save the updated data
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate save API call
      
      // Update both states - SAME AS HERO
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

  // Stable update functions with useCallback - SAME PATTERN AS HERO
  const updatePortfolio = useCallback((field: keyof FooterData['portfolio'], value: string) => {
    setTempData(prev => ({
      ...prev,
      portfolio: { ...prev.portfolio, [field]: value }
    }));
  }, []);

  const updateQuickLinks = useCallback((field: keyof FooterData['quickLinks'], value: string | string[]) => {
    setTempData(prev => ({
      ...prev,
      quickLinks: { ...prev.quickLinks, [field]: value }
    }));
  }, []);

  const updateContact = useCallback((field: keyof FooterData['contact'], value: string) => {
    setTempData(prev => ({
      ...prev,
      contact: { ...prev.contact, [field]: value }
    }));
  }, []);

  const updateQuickLink = useCallback((index: number, value: string) => {
    const updatedLinks = [...tempData.quickLinks.links];
    updatedLinks[index] = value;
    setTempData(prev => ({
      ...prev,
      quickLinks: { ...prev.quickLinks, links: updatedLinks }
    }));
  }, [tempData.quickLinks.links]);

  const addQuickLink = useCallback(() => {
    setTempData(prev => ({
      ...prev,
      quickLinks: {
        ...prev.quickLinks,
        links: [...prev.quickLinks.links, 'New Link']
      }
    }));
  }, []);

  const removeQuickLink = useCallback((index: number) => {
    if (tempData.quickLinks.links.length <= 1) {
      toast.error("You must have at least one quick link");
      return;
    }
    const updatedLinks = tempData.quickLinks.links.filter((_, i) => i !== index);
    setTempData(prev => ({
      ...prev,
      quickLinks: { ...prev.quickLinks, links: updatedLinks }
    }));
  }, [tempData.quickLinks.links]);

  const displayData = isEditing ? tempData : data;
  const currentYear = new Date().getFullYear();

  // Loading state - SAME PATTERN AS HERO
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

        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={displayData.portfolio.title}
                  onChange={(e) => updatePortfolio('title', e.target.value)}
                  className="w-full text-2xl font-bold text-white bg-gray-800 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2"
                />
                <textarea
                  value={displayData.portfolio.description}
                  onChange={(e) => updatePortfolio('description', e.target.value)}
                  className="w-full text-sm text-gray-400 bg-gray-800 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 resize-none"
                  rows={3}
                />
              </>
            ) : (
              <>
                <h3 className="text-2xl">{displayData.portfolio.title}</h3>
                <p className="leading-relaxed text-gray-400">
                  {displayData.portfolio.description}
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
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={displayData.quickLinks.title}
                  onChange={(e) => updateQuickLinks('title', e.target.value)}
                  className="w-full text-lg font-bold text-yellow-400 bg-gray-800 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2"
                />
                <div className="space-y-2">
                  {displayData.quickLinks.links.map((link, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={link}
                        onChange={(e) => updateQuickLink(index, e.target.value)}
                        className="flex-1 text-sm text-gray-400 bg-gray-800 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2"
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
                    Add Link
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h4 className="text-lg text-yellow-400">{displayData.quickLinks.title}</h4>
                <div className="space-y-2">
                  {displayData.quickLinks.links.map((link, index) => (
                    <motion.a
                      key={index}
                      href={`#${link === 'Reviews' ? 'testimonials' : link === 'Clients' ? 'clients' : link.toLowerCase()}`}
                      whileHover={{ x: 5, color: '#fbbf24' }}
                      transition={{ duration: 0.2 }}
                      className="block text-gray-400 transition-colors duration-300 hover:text-yellow-400"
                    >
                      {link}
                    </motion.a>
                  ))}
                </div>
              </>
            )}
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={displayData.contact.title}
                  onChange={(e) => updateContact('title', e.target.value)}
                  className="w-full text-lg font-bold text-yellow-400 bg-gray-800 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2"
                />
                <div className="space-y-2">
                  <input
                    type="text"
                    value={displayData.contact.email}
                    onChange={(e) => updateContact('email', e.target.value)}
                    className="w-full text-sm text-gray-400 bg-gray-800 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2"
                    placeholder="Email"
                  />
                  <input
                    type="text"
                    value={displayData.contact.phone}
                    onChange={(e) => updateContact('phone', e.target.value)}
                    className="w-full text-sm text-gray-400 bg-gray-800 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2"
                    placeholder="Phone"
                  />
                  <input
                    type="text"
                    value={displayData.contact.location}
                    onChange={(e) => updateContact('location', e.target.value)}
                    className="w-full text-sm text-gray-400 bg-gray-800 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2"
                    placeholder="Location"
                  />
                </div>
              </>
            ) : (
              <>
                <h4 className="text-lg text-yellow-400">{displayData.contact.title}</h4>
                <div className="space-y-2 text-gray-400">
                  <p>{displayData.contact.email}</p>
                  <p>{displayData.contact.phone}</p>
                  <p>{displayData.contact.location}</p>
                </div>
              </>
            )}
            
            <div className="flex pt-4 space-x-4">
              {displayData.socialLinks.map((social, index) => (
                <motion.a
                  key={social}
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-gray-400 transition-colors duration-300 hover:text-yellow-400"
                >
                  {social}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="pt-8 mt-8 text-center border-t border-gray-800"
        >
          <p className="flex justify-center items-center space-x-2 text-gray-400">
            <span>© {currentYear} John Doe. Made with</span>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
            >
              <Heart className="w-4 h-4 text-red-500 fill-current" />
            </motion.span>
            <span>and lots of coffee</span>
          </p>
        </motion.div>
      </div>
    </footer>
  );
}