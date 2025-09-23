import { Button } from "./ui/button";
import { Menu, X, Edit2, Save, Upload } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "./ThemeProvider";
import logo from "../img/logo/logo.svg";
import { toast } from "react-toastify";

export default function Header({ headerData, onStateChange, userId, publishedId, templateSelection }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [pendingLogoFile, setPendingLogoFile] = useState(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  const [content, setContent] = useState({
    logoLetter: headerData?.logo || logo,
    companyName: headerData?.name || "Company",
    navItems: [
      { id: 1, label: "Home", href: "#home", color: "primary" },
      { id: 2, label: "About", href: "#about", color: "primary" },
      { id: 3, label: "Services", href: "#services", color: "red-accent" },
      { id: 4, label: "Product", href: "#product", color: "primary" },
      { id: 5, label: "Gallery", href: "#gallery", color: "primary" },
      { id: 6, label: "Blog", href: "#blog", color: "primary" },
      { id: 7, label: "Contact", href: "#contact", color: "primary" },
    ],
    ctaText: "Get Started",
  });

  // Notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(content);
    }
  }, [content, onStateChange]);

  const updateContent = (field: string, value: string) => {
    setContent((prev) => ({ ...prev, [field]: value }));
  };

  const updateNavItem = (id: number, field: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      navItems: prev.navItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addNavItem = () => {
    setContent((prev) => ({
      ...prev,
      navItems: [
        ...prev.navItems,
        { id: Date.now(), label: "New", href: "#", color: "primary" },
      ],
    }));
  };

  const removeNavItem = (id: number) => {
    setContent((prev) => ({
      ...prev,
      navItems: prev.navItems.filter((item) => item.id !== id),
    }));
  };

  // Logo upload functionality
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('File size must be less than 5MB');
      return;
    }

    // Store the file for upload on Save
    setPendingLogoFile(file);
    
    // Show immediate local preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setContent(prev => ({ ...prev, logoLetter: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  // Save button handler with S3 upload
  const handleSave = async () => {
    try {
      setIsUploading(true);

      // If there's a pending logo, upload it first
      if (pendingLogoFile) {
        if (!userId || !publishedId || !templateSelection) {
          console.error('Missing required props:', { userId, publishedId, templateSelection });
          toast.error('Missing user information. Please refresh and try again.');
          return;
        }
        
        const formData = new FormData();
        formData.append('file', pendingLogoFile);
        formData.append('sectionName', 'header');
        formData.append('imageField', 'logoLetter');
        formData.append('templateSelection', templateSelection);

        const uploadResponse = await fetch(`https://o66ziwsye5.execute-api.ap-south-1.amazonaws.com/prod/upload-image/${userId}/${publishedId}`, {
          method: 'POST',
          body: formData,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          // Replace local preview with S3 URL
          setContent(prev => ({ ...prev, logoLetter: uploadData.imageUrl }));
          setPendingLogoFile(null); // Clear pending file
          console.log('Logo uploaded to S3:', uploadData.imageUrl);
        } else {
          const errorData = await uploadResponse.json();
          console.error('Logo upload failed:', errorData);
          toast.error(`Logo upload failed: ${errorData.message || 'Unknown error'}`);
          return; // Don't exit edit mode
        }
      }
      
      // Exit edit mode
      setIsEditing(false);
      toast.success('Header section saved with S3 URLs ready for publish');

    } catch (error) {
      console.error('Error saving header section:', error);
      toast.error('Error saving changes. Please try again.');
      // Keep in edit mode so user can retry
    } finally {
      setIsUploading(false);
    }
  };

  const menuVariants = {
    closed: { opacity: 0, height: 0, transition: { duration: 0.3 } },
    open: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.3, staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    closed: { opacity: 0, x: -20 },
    open: { opacity: 1, x: 0 },
  };

  return (
    <motion.header
      className={`fixed top-16 left-0 right-0 border-b z-10 ${
        theme === "dark"
          ? "bg-gray-800 border-gray-700 text-gray-300"
          : "bg-white border-gray-200"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <motion.div
              className="relative w-8 h-8  rounded-lg flex items-center justify-center mr-2 shadow-md overflow-hidden"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              {isEditing ? (
                <div className="relative w-full h-full">
                  <img
                    src={content.logoLetter}
                    alt="Logo"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-white text-xs p-1 bg-blue-500 rounded"
                    >
                      <Upload size={12} />
                    </button>
                  </div>
                </div>
              ) : (
                <img
                  src={content.logoLetter}
                  alt="Logo"
                  className="w-full h-full object-contain"
                />
              )}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </motion.div>
            {isEditing ? (
              <input
                type="text"
                value={content.companyName}
                onChange={(e) => updateContent("companyName", e.target.value)}
                className="bg-transparent border-b border-primary text-xl font-bold outline-none max-w-[140px] truncate"
              />
            ) : (
              <motion.span className="text-xl font-bold text-black">
                {content.companyName}
              </motion.span>
            )}
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6 flex-wrap max-w-[600px] overflow-hidden">
            {content.navItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-2">
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) =>
                        updateNavItem(item.id, "label", e.target.value)
                      }
                      className="bg-white border px-2 py-1 rounded text-sm outline-none max-w-[100px] truncate"
                    />
                    <input
                      type="text"
                      value={item.href}
                      onChange={(e) =>
                        updateNavItem(item.id, "href", e.target.value)
                      }
                      className="bg-white border px-2 py-1 rounded text-xs text-gray-500 outline-none max-w-[120px] truncate"
                      placeholder="URL"
                    />
                    <button
                      onClick={() => removeNavItem(item.id)}
                      className="text-red-500 text-xs"
                    >
                      ✕
                    </button>
                  </>
                ) : (
                  <motion.a
                    href={item.href}
                    className={`font-medium relative group ${
                      theme === "dark"
                        ? "text-gray-300 hover:text-gray-200"
                        : "text-gray-700 hover:text-primary"
                    }`}
                    whileHover={{ y: -2 }}
                  >
                    {item.label}
                    <motion.span
                      className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-${item.color} transition-all group-hover:w-full`}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.a>
                )}
              </div>
            ))}
            {isEditing && (
              <button
                onClick={addNavItem}
                className="text-green-600 text-sm font-medium"
              >
                + Add
              </button>
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {isEditing ? (
              <input
                type="text"
                value={content.ctaText}
                onChange={(e) => updateContent("ctaText", e.target.value)}
                className="bg-white border px-3 py-1 rounded font-medium outline-none max-w-[120px] truncate"
              />
            ) : (
              <Button className="bg-primary text-black hover:bg-primary/90 shadow-lg transition-all duration-300">
                {content.ctaText}
              </Button>
            )}

            <ThemeToggle />

            {/* Edit/Save Buttons */}
            {isEditing ? (
              <motion.button 
                whileTap={{scale:0.9}}
                whileHover={{y:-1,scaleX:1.1}}
                onClick={handleSave}
                disabled={isUploading}
                className={`${
                  isUploading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-green-600 hover:font-semibold'
                } text-white px-4 py-2 rounded cursor-pointer hover:shadow-2xl shadow-xl`}
              >
                {isUploading ? 'Uploading...' : <><Save size={16} className="inline mr-1" /> Save</>}
              </motion.button>
            ) : (
              <motion.button 
                whileTap={{scale:0.9}}
                whileHover={{y:-1,scaleX:1.1}}
                onClick={() => setIsEditing(true)}
                className="bg-yellow-500 text-black px-4 py-2 rounded cursor-pointer hover:shadow-2xl shadow-xl hover:font-semibold"
              >
                <Edit2 size={16} className="inline mr-1" /> Edit
              </motion.button>
            )}
          </div>

          {/* Mobile menu button */}
          <motion.div className="md:hidden">
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary transition-colors p-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              animate={{ rotate: isMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden border-t border-gray-200 overflow-hidden"
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <motion.nav className="flex flex-col space-y-4 py-4">
                {content.navItems.map((item, index) => (
                  <motion.a
                    key={item.id}
                    href={item.href}
                    className={`text-gray-700 hover:text-${item.color} transition-colors py-2 px-4 rounded-lg hover:bg-${item.color}/10`}
                    variants={itemVariants}
                    whileHover={{ x: 10, scale: 1.02 }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </motion.a>
                ))}
                <Button className="bg-primary text-black hover:bg-primary/90 w-full mt-4 shadow-lg">
                  {content.ctaText}
                </Button>
              </motion.nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}