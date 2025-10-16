import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "./ThemeProvider";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme } = useTheme();

  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState({
    logoLetter: "C",
    companyName: "Company",
    navItems: [
      { id: 1, label: "Home", href: "#home", color: "primary" },
      { id: 2, label: "About", href: "#about", color: "primary" },
      { id: 3, label: "Our Team", href: "#our-team", color: "primary" },
      { id: 4, label: "Product", href: "#product", color: "primary" },
      { id: 5, label: "Services", href: "#services", color: "red-accent" },
      { id: 6, label: "Gallery", href: "#gallery", color: "primary" },
      { id: 7, label: "Blog", href: "#blog", color: "primary" },
      { id: 8, label: "Testimonial", href: "#testimonial", color: "primary" },
      { id: 9, label: "Clients", href: "#clients", color: "primary" },
    ],
    ctaText: "Get Started",
  });

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
      className={`fixed top-16 left-0 right-0 border-b z-50 ${
        theme === "dark"
          ? "bg-gray-800 border-gray-700 text-gray-300"
          : "bg-white border-gray-200"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <div className='flex items-center'>
            <motion.div
              className='w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-2 shadow-md'
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              {isEditing ? (
                <input
                  type='text'
                  value={content.logoLetter}
                  onChange={(e) =>
                    updateContent("logoLetter", e.target.value.slice(0, 1))
                  }
                  className='w-6 max-w-[32px] text-center bg-transparent border-b border-black font-bold text-lg outline-none'
                />
              ) : (
                <span className='text-black font-bold text-lg'>
                  {content.logoLetter}
                </span>
              )}
            </motion.div>
            {isEditing ? (
              <input
                type='text'
                value={content.companyName}
                onChange={(e) => updateContent("companyName", e.target.value)}
                className='bg-transparent border-b border-primary text-xl font-bold outline-none max-w-[140px] truncate'
              />
            ) : (
              <motion.span className='text-xl font-bold text-black'>
                {content.companyName}
              </motion.span>
            )}
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-6 flex-wrap max-w-[700px] overflow-hidden">
            {content.navItems.map((item) => (
              <div key={item.id} className='flex items-center space-x-2'>
                {isEditing ? (
                  <>
                    <input
                      type='text'
                      value={item.label}
                      onChange={(e) =>
                        updateNavItem(item.id, "label", e.target.value)
                      }
                      className='bg-white border px-2 py-1 rounded text-sm outline-none max-w-[100px] truncate'
                    />
                    <input
                      type='text'
                      value={item.href}
                      onChange={(e) =>
                        updateNavItem(item.id, "href", e.target.value)
                      }
                      className='bg-white border px-2 py-1 rounded text-xs text-gray-500 outline-none max-w-[120px] truncate'
                      placeholder='URL'
                    />
                    <button
                      onClick={() => removeNavItem(item.id)}
                      className='text-red-500 text-xs'
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
                className='text-green-600 text-sm font-medium'
              >
                + Add
              </button>
            )}
          </nav>

          {/* Right side */}
          <div className='flex items-center space-x-4'>
            {isEditing ? (
              <input
                type='text'
                value={content.ctaText}
                onChange={(e) => updateContent("ctaText", e.target.value)}
                className='bg-white border px-3 py-1 rounded font-medium outline-none max-w-[120px] truncate'
              />
            ) : (
              <Button className='bg-primary text-black hover:bg-primary/90 shadow-lg transition-all duration-300'>
                {content.ctaText}
              </Button>
            )}

            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <motion.div className='lg:hidden'>
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className='text-gray-700 hover:text-primary transition-colors p-2'
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              animate={{ rotate: isMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <AnimatePresence mode='wait'>
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className='md:hidden border-t border-gray-200 overflow-hidden'
              variants={menuVariants}
              initial='closed'
              animate='open'
              exit='closed'
            >
              <motion.nav className='flex flex-col space-y-4 py-4'>
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
                <Button className='bg-primary text-black hover:bg-primary/90 w-full mt-4 shadow-lg'>
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
