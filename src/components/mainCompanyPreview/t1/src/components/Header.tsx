import { Upload, X, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState, useCallback } from "react";
import { toast } from "react-toastify";
import Cropper from "react-easy-crop";
import logo from "/logos/logo.svg"

export default function Header({
  headerData,
  onStateChange,
  userId,
  publishedId,
  templateSelection,
}) {
  // Character limits
  const CHAR_LIMITS = {
    companyName: 50,
    navItem: 50,
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [pendingLogoFile, setPendingLogoFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const logoImgRef = useRef<HTMLImageElement | null>(null);

  // Enhanced crop modal state with advanced features
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);

  // Advanced cropping states
  const [mediaSize, setMediaSize] = useState<{ width: number; height: number; naturalWidth: number; naturalHeight: number } | null>(null);
  const [cropAreaSize, setCropAreaSize] = useState<{ width: number; height: number } | null>(null);
  const [minZoomDynamic, setMinZoomDynamic] = useState(0.1);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState("original");
  const [logoDimensions, setLogoDimensions] = useState({ width: 77, height: 50 });
  const PAN_STEP = 10;

  // Fixed state initialization
  const [headerState, setHeaderState] = useState(() => {
    return headerData || {
      logoSrc: logo,
      companyName: "Your Company",
      navItems: [
        "Home",
        "About",
        "Profile",
        "Services",
        "Product",
        "Gallery",
        "Blog",
        "Testimonials",
      ],
    };
  });

  // Load logo dimensions when logo URL changes
  useEffect(() => {
    if (headerState.logoSrc && (headerState.logoSrc.startsWith("data:") || headerState.logoSrc.startsWith("http"))) {
      const img = new Image();
      img.onload = () => {
        // Calculate dimensions while maintaining aspect ratio
        const maxSize = 77;
        let width = img.naturalWidth;
        let height = img.naturalHeight;

        // Maintain aspect ratio while fitting within maxSize
        if (width > height) {
          height = (height / width) * maxSize;
          width = maxSize;
        } else {
          width = (width / height) * maxSize;
          height = maxSize;
        }

        // Ensure minimum size
        const minSize = 25;
        if (width < minSize) {
          height = (height / width) * minSize;
          width = minSize;
        }
        if (height < minSize) {
          width = (width / height) * minSize;
          height = minSize;
        }

        // Additional constraint: Ensure height doesn't exceed header height
        const maxHeaderHeight = 45;
        if (height > maxHeaderHeight) {
          width = (width / height) * maxHeaderHeight;
          height = maxHeaderHeight;
        }

        setLogoDimensions({
          width: Math.round(width),
          height: Math.round(height)
        });
      };
      img.src = headerState.logoSrc;
    } else {
      setLogoDimensions({ width: 77, height: 50 });
    }
  }, [headerState.logoSrc]);

  // Allow more zoom-out; do not enforce cover when media/crop sizes change
  useEffect(() => {
    if (mediaSize && cropAreaSize) {
      setMinZoomDynamic(0.1);
    }
  }, [mediaSize, cropAreaSize]);

  // Arrow keys to pan image inside crop area when cropper is open
  const nudge = useCallback((dx: number, dy: number) => {
    setCrop((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
  }, []);

  useEffect(() => {
    if (!cropModalOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); nudge(-PAN_STEP, 0); }
      else if (e.key === "ArrowRight") { e.preventDefault(); nudge(PAN_STEP, 0); }
      else if (e.key === "ArrowUp") { e.preventDefault(); nudge(0, -PAN_STEP); }
      else if (e.key === "ArrowDown") { e.preventDefault(); nudge(0, PAN_STEP); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [cropModalOpen, nudge]);

  // Add this useEffect to notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(headerState);
    }
  }, [headerState, onStateChange]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // Get aspect ratio value based on selection
  const getAspectRatio = () => {
    switch (selectedAspectRatio) {
      case "1:1":
        return 1;
      case "16:9":
        return 16 / 9;
      case "original":
      default:
        return logoDimensions.width / logoDimensions.height;
    }
  };

  // Get display text for aspect ratio
  const getAspectRatioText = () => {
    switch (selectedAspectRatio) {
      case "1:1":
        return "1:1";
      case "16:9":
        return "16:9";
      case "original":
      default:
        return `${logoDimensions.width}:${logoDimensions.height}`;
    }
  };

  const headerStyles: React.CSSProperties = {
    position: "fixed",
    top: "56px",
    left: "0",
    right: "0",
    width: "100%",
    zIndex: 1000,
    backgroundColor: "white",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    borderBottom: "1px solid #e5e7eb",
    transition: "all 0.5s ease",
  };

  const mobileMenuStyles: React.CSSProperties = {
    position: "fixed",
    top: "112px",
    left: "0",
    right: "0",
    zIndex: 999,
    backgroundColor: "white",
    borderTop: "1px solid #e5e7eb",
    maxHeight: isMobileMenuOpen ? "384px" : "0",
    opacity: isMobileMenuOpen ? "1" : "0",
    overflow: "hidden",
    transition: "all 0.3s ease-in-out",
  };

  return (
    <>
      <motion.header
        style={headerStyles}
        className="dark:bg-gray-900 dark:border-gray-700"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-[8px]  mx-auto max-w-7xl ">
            {/* Logo + Company Name */}
            <motion.div
              className="flex flex-row items-center gap-2 text-xl font-bold text-red-500 transition-colors duration-300 sm:text-2xl dark:text-yellow-400"
              whileHover={{ scale: 1.05 }}
            >
              {/* Enhanced Logo with Animations */}
              <div className="relative flex-shrink-0">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    rotate: 0,
                    transition: {
                      duration: 0.8,
                      type: "spring",
                      stiffness: 120,
                    },
                  }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <div className="relative">
                    <motion.img
                      ref={logoImgRef}
                      src={headerState.logoSrc || logo}
                      alt="Logo"
                      style={{
                        width: `${logoDimensions.width}px`,
                        height: `${logoDimensions.height}px`,
                        maxHeight: '45px',
                      }}
                      className="rounded-xl cursor-pointer group-hover:scale-110 transition-all duration-300 object-contain"
                      animate={{
                        y: [0, -5, 0],
                        transition: {
                          duration: 3,
                          repeat: Infinity,
                          repeatType: "reverse",
                          ease: "easeInOut",
                        },
                      }}
                    />
                  </div>
                </motion.div>
              </div>

              {/* Company Name */}
              {/* <span className="text-lg sm:text-xl md:text-2xl flex-shrink-0">
                {headerState.companyName}
              </span> */}
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="items-center hidden mr-16 space-x-4 md:flex lg:space-x-6 lg:mr-20">
              {headerState.navItems.map((item, index) => (
                <a
                  key={index}
                  href={`#${item.toLowerCase()}`}
                  className="text-sm font-medium text-black transition-colors duration-300 hover:text-yellow-600 lg:text-base"
                >
                  {item}
                </a>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex items-center space-x-2 md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="p-2 transition-colors duration-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <svg
                  className="w-6 h-6 transition-transform duration-200"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  style={{
                    transform: isMobileMenuOpen
                      ? "rotate(90deg)"
                      : "rotate(0deg)",
                  }}
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Navigation Menu */}
      <div
        style={{ ...mobileMenuStyles }}
        className="md:hidden dark:bg-gray-900 dark:border-gray-700"
      >
        <div className="flex gap-1 w-[100%] flex-col ">
          {headerState.navItems.map((item, index) => (
            <a
              key={index}
              href={`#${item.toLowerCase()}`}
              className="px-3 py-2 font-medium text-black transition-colors duration-300 rounded-lg hover:text-yellow-600 hover:bg-gray-50"
              onClick={closeMobileMenu}
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}