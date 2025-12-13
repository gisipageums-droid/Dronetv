import { Button } from "./ui/button";
import {
  Menu,
  X,
  Edit2,
  Save,
  Upload,
  Loader2,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "./ThemeProvider";
import { toast } from "react-toastify";
import logo from "/images/Drone tv .in.jpg";

export default function Header({
  headerData,
  onStateChange,
  publishedId,
  userId,
  templateSelection,
}: any) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const logoImgRef = useRef<HTMLImageElement | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Track initial state to detect changes
  const initialHeaderState = useRef(null);

  // Auto-save timeout reference
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // choose container width based on companyName length (adjust threshold as needed)
  const containerMaxClass =
    (headerData?.companyName || "").trim().length > 30 /* threshold */
      ? "min-w-[1270px]"
      : "max-w-7xl";

  // Logo dimensions state - FIXED: 77px width, 65px height
  const [logoDimensions, setLogoDimensions] = useState({ width: 77, height: 65 });

  // Initialize content state
  const [content, setContent] = useState(() => {
    const initialState = headerData || {
      companyName: "Your Company",
      ctaText: "Get Started",
      logoUrl: logo
    };
    initialHeaderState.current = initialState;
    return initialState;
  });

  // Fixed logo dimensions - always 77x65
  useEffect(() => {
    setLogoDimensions({ width: 77, height: 65 });
  }, [content.logoUrl]);

  // Static navigation items
  const staticNavItems = [
    { id: 1, label: "Home", href: "#home", color: "primary" },
    { id: 2, label: "About", href: "#about", color: "primary" },
    { id: 3, label: "Our Team", href: "#our-team", color: "primary" },
    { id: 4, label: "Product", href: "#product", color: "primary" },
    { id: 5, label: "Services", href: "#services", color: "red-accent" },
    { id: 6, label: "Gallery", href: "#gallery", color: "primary" },
    { id: 7, label: "Blog", href: "#blog", color: "primary" },
    { id: 8, label: "Testimonial", href: "#testimonial", color: "primary" },
    { id: 9, label: "Clients", href: "#clients", color: "primary" },
  ];
  console.log("header data", content);

  // Smooth scroll function
  const scrollToSection = (href: string) => {
    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Handle navigation click
  const handleNavClick = (href: string) => {
    setIsMenuOpen(false); // Close mobile menu
    setTimeout(() => {
      scrollToSection(href);
    }, 100); // Small delay to ensure menu is closed before scrolling
  };

  // Notify parent of state changes immediately
  useEffect(() => {
    if (onStateChange) {
      onStateChange(content);
    }
  }, [content, onStateChange]);

  // Auto-save function for text changes
  const autoSaveChanges = async () => {
    if (!isEditing) return;

    setIsSaving(true);
    try {
      // Simulate API call or state persistence
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update initial state reference to current state
      initialHeaderState.current = content;

      toast.success("Changes saved automatically!");
    } catch (error) {
      console.error("Auto-save failed:", error);
      toast.error("Auto-save failed. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Effect to trigger auto-save when text content changes
  useEffect(() => {
    if (isEditing) {
      // Clear existing timeout
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      // Set new timeout for auto-save (1 second delay)
      autoSaveTimeoutRef.current = setTimeout(() => {
        autoSaveChanges();
      }, 1000);
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [content.ctaText, content.companyName, isEditing]);

  // Update function - now updates immediately
  const updateContent = (field: string, value: string) => {
    setContent((prev) => ({ ...prev, [field]: value }));
  };

  // Function to upload image to AWS
  const uploadImageToAWS = async (file: File, imageField: string) => {
    if (!userId || !publishedId || !templateSelection) {
      console.error("Missing required props:", {
        userId,
        publishedId,
        templateSelection,
      });
      toast.error("Missing user information. Please refresh and try again.");
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("sectionName", "header");
    formData.append("imageField", `${imageField}_${Date.now()}`);
    formData.append("templateSelection", templateSelection);

    console.log(`Uploading ${imageField} to S3:`, file);

    try {
      const uploadResponse = await fetch(
        `https://o66ziwsye5.execute-api.ap-south-1.amazonaws.com/prod/upload-image/${userId}/${publishedId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (uploadResponse.ok) {
        const uploadData = await uploadResponse.json();
        console.log(`${imageField} uploaded to S3:`, uploadData.imageUrl);
        return uploadData.imageUrl;
      } else {
        const errorData = await uploadResponse.json();
        console.error(`${imageField} upload failed:`, errorData);
        toast.error(
          `${imageField} upload failed: ${errorData.message || "Unknown error"}`
        );
        return null;
      }
    } catch (error) {
      console.error(`Error uploading ${imageField}:`, error);
      toast.error(`Error uploading image. Please try again.`);
      return null;
    }
  };

  // Handle cancel editing
  const handleCancel = () => {
    // Reset to initial state
    setContent(initialHeaderState.current);
    setIsEditing(false);
  };

  // Direct image upload handler (no cropping)
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    processImageFile(file);
    e.target.value = "";
  };

  // Process image file (used by both file input and drag-drop)
  const processImageFile = async (file: File) => {
    // Validate file type and size
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setIsUploading(true);

    try {
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setContent((prev) => ({ ...prev, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);

      // Upload to AWS
      const awsImageUrl = await uploadImageToAWS(file, "logoUrl");

      if (awsImageUrl) {
        setContent((prev) => ({ ...prev, logoUrl: awsImageUrl }));
        toast.success("Logo uploaded successfully!");
      } else {
        toast.error("Upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error uploading image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isEditing) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (!isEditing) {
      toast.warning("Please enable edit mode first");
      return;
    }

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      processImageFile(file);
    }
  };

  // Save button handler - now only for manual saving if needed
  const handleSave = async () => {
    try {
      setIsUploading(true);

      // Update initial state reference to current state
      initialHeaderState.current = content;

      // Exit edit mode
      setIsEditing(false);
      toast.success("Header section saved!");
    } catch (error) {
      console.error("Error saving header section:", error);
      toast.error("Error saving changes. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Function to trigger file input
  const triggerFileInput = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.click();
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
    <>
      {/* Auto-save indicator */}

      {/* Rest of the header code with fixed logo sizing */}
      <motion.header
        className={`fixed top-16 left-0 right-0 border-b z-10 ${theme === "dark"
          ? "bg-gray-800 border-gray-700 text-gray-300"
          : "bg-white border-gray-200"
          }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div
          className={`px-4 mx-auto lg:min-w-[1180px] ${containerMaxClass} sm:px-6 lg:px-16`}
        >
          <div className="flex items-center justify-between  py-[1px] ">
            {/* Logo + Company */}
            <div className="flex items-center flex-shrink-0 min-w-0 mr-6 lg:mr-10">
              {/* Logo with drag-drop support */}
              <div className="relative flex items-center justify-center flex-shrink-0 mr-2  rounded-lg shadow-md group pt-[5px]">
                {isEditing ? (
                  <div
                    className={`relative transition-all duration-300 ${isDragOver
                      ? "ring-4 ring-green-500 bg-green-50 scale-105"
                      : "ring-2 ring-blue-500"
                      }`}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    {/* Clickable logo image */}
                    <div
                      className="cursor-pointer"
                      onClick={triggerFileInput}
                    >
                      {content.logoUrl &&
                        (content.logoUrl.startsWith("data:") ||
                          content.logoUrl.startsWith("http")) ? (
                        <img
                          ref={logoImgRef}
                          src={content.logoUrl || logo}
                          alt="Logo"
                          className={`group-hover:scale-110 transition-all duration-300 rounded-xl object-contain h-[65px] min-w-[77px] max-w-[200px] ${isDragOver ? "opacity-50" : ""
                            }`}
                        />
                      ) : (
                        <span
                          className="text-lg font-bold text-black flex items-center justify-center min-w-[77px] max-w-[200px]"
                          style={{
                            height: '65px',
                          }}
                        >
                          {content.logoUrl}
                        </span>
                      )}
                    </div>

                    {/* Upload Icon Overlay - Show only in edit mode when not dragging */}
                    {!isDragOver && (
                      <div
                        className="absolute inset-0 flex items-center justify-center transition-opacity bg-black bg-opacity-50 opacity-0 hover:opacity-100 rounded-xl cursor-pointer"
                        onClick={triggerFileInput}
                      >
                        <div className="p-2 bg-blue-500 rounded-full">
                          <Upload size={16} className="text-white" />
                        </div>
                        <span className="absolute bottom-1 text-xs text-white bg-black bg-opacity-70 px-2 py-0.5 rounded">
                          Click to upload
                        </span>
                      </div>
                    )}

                    {/* Drag Over Overlay */}
                    {isDragOver && (
                      <div
                        className="absolute inset-0 bg-green-500 bg-opacity-20 rounded-xl flex items-center justify-center border-2 border-dashed border-green-500 cursor-pointer"
                        onClick={triggerFileInput}
                      >
                        <div className="bg-white p-2 rounded-full shadow-lg">
                          <Upload size={18} className="text-green-600" />
                        </div>
                        <span className="absolute bottom-1 text-xs text-green-700 bg-white bg-opacity-90 px-2 py-0.5 rounded font-semibold">
                          Drop image here
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    {content.logoUrl &&
                      (content.logoUrl.startsWith("data:") ||
                        content.logoUrl.startsWith("http")) ? (
                      <img
                        ref={logoImgRef}
                        src={content.logoUrl || logo}
                        alt="Logo"
                        className="cursor-pointer group-hover:scale-110 transition-all duration-300 rounded-xl object-contain h-[65px] min-w-[77px] max-w-[200px]"
                      />
                    ) : (
                      <span
                        className="text-lg font-bold text-black flex items-center justify-center min-w-[77px] max-w-[200px]"
                        style={{
                          height: '65px',
                        }}
                      >
                        {content.logoUrl}
                      </span>
                    )}
                  </>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden font-bold"
                />
              </div>
            </div>

            {/* Desktop Nav - Centered with proper spacing */}
            <nav className="items-center justify-center flex-1 hidden mx-4 lg:flex min-w-0">
              <div className="flex  items-center justify-center space-x-3">
                {staticNavItems.map((item) => (
                  <motion.a
                    key={item.id}
                    href={item.href}
                    className={`font-medium relative group whitespace-nowrap ${theme === "dark"
                      ? "text-gray-300 hover:text-gray-200"
                      : "text-gray-700 hover:text-primary"
                      }`}
                    whileHover={{ y: -2 }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.href);
                    }}
                  >
                    {item.label}
                    <motion.span
                      className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-${item.color} transition-all group-hover:w-full`}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.a>
                ))}
              </div>
            </nav>
            {/* hello */}

            {/* Right side - Fixed width to prevent shifting */}
            <div className="flex items-center flex-shrink-0 space-x-1">
              {isEditing ? (
                <input
                  type="text"
                  value={content.ctaText}
                  onChange={(e) => updateContent("ctaText", e.target.value)}
                  className="bg-white border px-3 py-1 rounded font-medium outline-none max-w-[120px] "
                />
              ) : (
                <div className="hidden md:flex">
                  <Button
                    className="text-black transition-all duration-300 shadow-lg bg-primary hover:bg-primary/90 whitespace-nowrap "
                    onClick={() => handleNavClick("#contact")}
                  >
                    {content.ctaText}
                  </Button>
                </div>
              )}

              <ThemeToggle />

              {/* Edit/Save Buttons */}
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      whileHover={{ y: -1, scaleX: 1.05 }}
                      onClick={handleCancel}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded shadow-xl hover:font-semibold whitespace-nowrap"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      whileHover={{ y: -1, scaleX: 1.1 }}
                      onClick={handleSave}
                      disabled={isUploading || isSaving}
                      className={`${isUploading || isSaving
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:font-semibold"
                        } text-white px-4 py-2 rounded cursor-pointer hover:shadow-2xl shadow-xl whitespace-nowrap`}
                    >
                      {isUploading || isSaving ? (
                        "Saving..."
                      ) : (
                        <>
                          <Save size={16} className="inline mr-1" /> Save
                        </>
                      )}
                    </motion.button>
                  </>
                ) : (
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ y: -1, scaleX: 1.1 }}
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 text-black bg-yellow-500 rounded shadow-xl cursor-pointer hover:shadow-2xl hover:font-semibold whitespace-nowrap"
                  >
                    Edit
                  </motion.button>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <motion.div className="flex-shrink-0 lg:hidden">
              <motion.button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`hover:text-primary transition-colors p-2 ${theme === "dark"
                  ? "text-gray-300 hover:text-gray-200"
                  : "text-gray-700 hover:text-primary"
                  }`}
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

          {/* Mobile Nav - Using static navigation items */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                className={`lg:hidden border-t border-gray-200 overflow-hidden ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white"
                  }`}
                variants={menuVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                <motion.nav className="flex flex-col py-4 space-y-4">
                  {staticNavItems.map((item, index) => (
                    <motion.a
                      key={item.id}
                      href={item.href}
                      className={`hover:text-${item.color} transition-colors py-2 px-4 rounded-lg hover:bg-${item.color}/10 cursor-pointer`}
                      variants={itemVariants}
                      whileHover={{ x: 10, scale: 1.02 }}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(item.href);
                      }}
                    >
                      {item.label}
                    </motion.a>
                  ))}
                  <Button
                    className="w-full mt-4 text-black shadow-lg bg-primary hover:bg-primary/90"
                    onClick={() => handleNavClick("#contact")}
                  >
                    {content.ctaText}
                  </Button>
                </motion.nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>
    </>
  );
}