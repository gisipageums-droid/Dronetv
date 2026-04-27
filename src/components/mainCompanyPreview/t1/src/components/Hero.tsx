import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { useEffect, useState, useRef } from "react";
import HeroBackground from "../public/images/Hero/HeroBackground.jpg";

// Sample images (replace with your actual imports)
const Hero1 = "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800";
const Hero3 = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400";
const Cust1 = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100";
const Cust2 = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100";
const Cust3 = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100";
const Cust4 = "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100";
const Cust5 = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100";
const Cust6 = "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100";

const customerImages = [Cust1, Cust2, Cust3, Cust4, Cust5, Cust6];

const itemVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
};

const imageVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function EditableHero({
  heroData,
  onStateChange,

}) {
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef(null);

  // Default content with images
  const defaultContent = {
    heading: heroData?.heading || "A healthy meal delivered",
    subheading: heroData?.subheading || "to your door, every single day",
    description:
      heroData?.description ||
      "The smart 365-days-per-year food subscription that will make you eat healthy again. Tailored to your personal tastes and nutritional needs.",
    primaryBtn: heroData?.primaryBtn || "Start eating well",
    secondaryBtn: heroData?.secondaryBtn || "Learn more",
    primaryButtonLink: heroData?.primaryButtonLink || "#cta",
    secondaryButtonLink: heroData?.secondaryButtonLink || "#how",
    trustText: heroData?.trustText || "Over 250,000+ meals delivered last year!",
    hero1Image: heroData?.hero1Image || Hero1,
    hero3Image: heroData?.hero3Image || Hero3,
    customerImages: heroData?.customerImages || customerImages,
    badgeText: heroData?.badgeText || "Your Company",
  };

  // Consolidated state
  const [heroState, setHeroState] = useState({
    ...defaultContent,
    badgeText: heroData?.badgeText || "Your Company"
  });

  useEffect(() => {
    if (onStateChange) {
      onStateChange(heroState);
    }
  }, [heroState, onStateChange]);

  // Intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => {
      if (heroRef.current) observer.unobserve(heroRef.current);
    };
  }, []);

  // Fake API fetch
  const fetchHeroData = async () => {
    setIsLoading(true);
    try {
      const response = await new Promise((resolve) =>
        setTimeout(() => resolve(defaultContent), 1200)
      );
      setHeroState(response);
      setDataLoaded(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible && !dataLoaded && !isLoading) {
      fetchHeroData();
    }
  }, [isVisible, dataLoaded, isLoading]);

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative h-100vh flex items-center py-52 px-4 sm:px-6 lg:px-8 lg:pb-32"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${HeroBackground}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "scroll",
      }}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-30">
          <div className="bg-white rounded-lg p-6 shadow-lg flex items-center gap-3">
            <div className="w-5 h-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
            <span className="text-gray-700">Loading content...</span>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <p className="text-lg sm:text-xl md:text-2xl text-justify text-[red] relative z-20 mb-8 inline-block font-bold">
          {heroState.badgeText}
        </p>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center">
          <motion.div
            className="space-y-8 text-center lg:text-left order-2 lg:order-1"
            initial="hidden"
            animate="visible"
            variants={itemVariants}
          >
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl xl:text-3xl font-bold text-white leading-tight px-2 sm:px-0 text-left"
              variants={itemVariants}
            >
              {heroState.heading}
              <span className="block text-yellow-400 mt-2">
                {heroState.subheading}
              </span>
            </motion.h1>

            <motion.p
              className="text-base sm:text-md lg:text-md text-gray-200 max-w-2xl mx-auto lg:mx-0 px-2 sm:px-0 leading-relaxed"
              variants={itemVariants}
            >
              {heroState.description}
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start px-2 sm:px-0"
              variants={itemVariants}
            >
              <a
                href="#contact"
                className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 rounded-full px-8 py-4 font-semibold transition-all duration-300 transform hover:scale-105 inline-block text-center"
              >
                {heroState.primaryBtn}
              </a>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-6 pt-8 px-2 sm:px-0"
              variants={itemVariants}
            >
              <div className="flex -space-x-2">
                {heroState.customerImages.map((img, i) => (
                  <motion.div
                    key={i}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white shadow-lg bg-cover bg-center"
                    style={{ backgroundImage: `url('${img}')` }}
                    whileHover={{ scale: 1.2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  />
                ))}
              </div>
              <span className="text-sm sm:text-base text-white font-normal">
                {heroState.trustText}
              </span>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative order-1 lg:order-2 flex justify-center lg:justify-end px-4 sm:px-0"
            initial="hidden"
            animate="visible"
            variants={itemVariants}
          >
            <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl">
              <motion.div className="relative" variants={imageVariants}>
                <div className="relative">
                  <img
                    src={heroState.hero1Image}
                    alt="Innovation showcase"
                    className="w-full h-auto max-h-[70vh] object-contain rounded-3xl shadow-2xl scale-110"
                  />
                </div>
                <motion.div
                  className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 lg:-bottom-8 lg:-left-8"
                  variants={imageVariants}
                  transition={{ delay: 0.3 }}
                >
                  <div className="relative">
                    <img
                      src={heroState.hero3Image}
                      alt="Tech innovation"
                      className="w-auto max-w-[12rem] sm:max-w-[8rem] lg:max-w-[10rem] h-auto object-contain rounded-2xl shadow-xl border-4 border-white scale-110"
                    />
                  </div>
                </motion.div>
                <motion.div
                  className="absolute -top-6 -right-6 w-16 h-16 sm:w-20 sm:h-20 bg-yellow-400 rounded-full opacity-80"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, type: "spring", stiffness: 300 }}
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}