import { motion } from "motion/react";
import { Button } from "./ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

const containerVariants = { 
  hidden: { opacity: 0 }, 
  visible: { 
    opacity: 1, 
    transition: { 
      staggerChildren: 0.3, 
      delayChildren: 0.2 
    } 
  } 
};

const itemVariants = { 
  hidden: { y: 50, opacity: 0 }, 
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { 
      duration: 0.8, 
      ease: "easeOut" 
    } 
  } 
};

const imageVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const floatingVariants = { 
  animate: { 
    y: [-10, 10, -10], 
    transition: { 
      duration: 4, 
      repeat: Infinity, 
      ease: "easeInOut" 
    } 
  } 
};

export default function Hero({ heroData }) {
  // Safe data access with fallbacks
  const heroState = heroData || {};
  
  // Fallback values for all required fields
  const safeData = {
    badgeText: heroState.badgeText || "Trusted by 20+ Companies",
    heading: heroState.heading || "Transform Your Business with",
    highlight: heroState.highlight || "Innovation",
    description: heroState.description || "We help companies scale and grow with cutting-edge solutions, expert guidance, and proven strategies that deliver exceptional results",
    highlightDesc: heroState.highlightDesc || "exceptional results",
    primaryBtn: heroState.primaryBtn || "Get Started Today",
    trustText: heroState.trustText || "Join 20+ satisfied clients",
    stats: heroState.stats || [
      { id: 1, value: "20+", label: "Happy Clients", color: "red-accent" },
      { id: 2, value: "80%", label: "Success Rate", color: "red-accent" },
      { id: 3, value: "24/7", label: "Support", color: "primary" },
    ],
    heroImage: heroState.heroImage || heroState.hero1Image || "https://images.unsplash.com/photo-1698047682129-c3e217ac08b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBidXNpbmVzcyUyMHRlYW0lMjBvZmZpY2V8ZW58MXx8fHwxNzU1NjE4MzQ4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    hero3Image: heroState.hero3Image || heroState.smallImage || "https://images.unsplash.com/photo-1552664730-d307ca884978?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=400"
  };

  return (
    <section id="home" className="pt-20 mt-[4rem] pb-16 bg-background relative overflow-hidden theme-transition">
      {/* Background decorations */}
      <motion.div 
        className="absolute top-20 right-0 w-72 h-72 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" 
        animate={{ scale: [1, 1.1, 1], rotate: [0, 180, 360] }} 
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }} 
      />
      <motion.div 
        className="absolute bottom-0 left-0 w-96 h-96 bg-primary/3 rounded-full translate-y-1/2 -translate-x-1/2" 
        animate={{ scale: [1, 1.2, 1], rotate: [0, -180, -360] }} 
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }} 
      />
      <motion.div 
        className="absolute top-40 right-20 w-20 h-20 bg-red-accent/10 rounded-full" 
        variants={floatingVariants} 
        animate="animate" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div 
            className="space-y-8" 
            variants={containerVariants} 
            initial="hidden" 
            animate="visible"
          >
            <div className="space-y-4">
              {/* Badge */}
              <motion.div 
                className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary border border-primary/20 mb-4" 
                variants={itemVariants}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                <span className="font-medium text-sm">{safeData.badgeText}</span>
              </motion.div>

              {/* Heading */}
              <motion.div variants={itemVariants}>
                <h1 className="text-4xl md:text-6xl text-foreground leading-tight">
                  {safeData.heading} <span className="text-primary">{safeData.highlight}</span>
                </h1>
              </motion.div>

              {/* Description */}
              <motion.div variants={itemVariants}>
                <p className="text-xl text-muted-foreground max-w-lg inline">
                  {safeData.description} <span className="text-red-accent font-semibold">{safeData.highlightDesc}</span>.
                </p>
              </motion.div>
            </div>

            {/* Buttons */}
            <motion.div className="flex flex-col sm:flex-row gap-4" variants={itemVariants}>
              <Button size="lg" className="bg-primary text-primary-foreground shadow-xl">
                <a href="#contact">
                  {safeData.primaryBtn}
                </a>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>

            {/* Trust text */}
            <motion.div className="flex items-center space-x-6 pt-4" variants={itemVariants}>
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-primary rounded-full border-2 border-background" />
                  <div className="w-8 h-8 bg-primary/80 rounded-full border-2 border-background" />
                  <div className="w-8 h-8 bg-red-accent rounded-full border-2 border-background" />
                </div>
                <span className="text-sm text-muted-foreground">{safeData.trustText}</span>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div className="grid grid-cols-3 gap-8 pt-8" variants={itemVariants}>
              {safeData.stats.map((s) => (
                <div key={s.id} className="group">
                  <div className={`text-2xl font-bold group-hover:text-${s.color}`}>{s.value}</div>
                  <div className="text-muted-foreground">{s.label}</div>
                  <div className={`w-8 h-1 bg-${s.color}/30 group-hover:bg-${s.color} mt-1`} />
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div 
            className="relative" 
            initial="hidden" 
            animate="visible" 
            variants={itemVariants}
          >
            {/* Main image container */}
            <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto">
              <motion.div className="relative" variants={imageVariants}>
                <div className="relative">
                  <img
                    src={safeData.heroImage}
                    alt="Modern business team collaborating"
                    className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-3xl shadow-2xl"
                  />
                </div>
                
                {/* Small overlapping image */}
                <motion.div
                  className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 lg:-bottom-8 lg:-left-8"
                  variants={imageVariants}
                  transition={{ delay: 0.3 }}
                >
                  <div className="relative">
                    <img
                      src={safeData.hero3Image}
                      alt="Additional business context"
                      className="w-48 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-cover rounded-2xl shadow-xl border-4 border-white"
                    />
                  </div>
                </motion.div>

                {/* Decorative circle */}
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