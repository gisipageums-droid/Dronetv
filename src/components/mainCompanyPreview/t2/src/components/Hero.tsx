import { Button } from "./ui/button";
import { ArrowRight, Play, CheckCircle } from "lucide-react";
import { motion } from "motion/react";

export default function Hero({ heroData }) {
  // Animations
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

  return (
    <section id="home" className="pt-20 mt-[4rem] pb-16 bg-background relative overflow-hidden theme-transition">
      {/* Background decorations */}
      <motion.div className="absolute top-20 right-0 w-72 h-72 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" animate={{ scale: [1, 1.1, 1], rotate: [0, 180, 360] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} />
      <motion.div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/3 rounded-full translate-y-1/2 -translate-x-1/2" animate={{ scale: [1, 1.2, 1], rotate: [0, -180, -360] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} />
      <motion.div className="absolute top-40 right-20 w-20 h-20 bg-red-accent/10 rounded-full" variants={floatingVariants} animate="animate" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div className="space-y-8" variants={containerVariants} initial="hidden" animate="visible">
            <div className="space-y-4">
              {/* Badge */}
              <motion.div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary border border-primary/20 mb-4" variants={itemVariants}>
                <CheckCircle className="w-4 h-4 mr-2" />
                <span className="font-medium text-sm">{heroData.badgeText}</span>
              </motion.div>

              {/* Heading */}
              <motion.div variants={itemVariants}>
                <h1 className="text-4xl md:text-6xl text-foreground leading-tight">
                  {heroData.heading} <span className="text-primary">{heroData.highlight}</span>
                </h1>
              </motion.div>

              {/* Description */}
              <motion.div variants={itemVariants}>
                <p className="text-xl text-muted-foreground max-w-lg inline">
                  {heroData.description} <span className="text-red-accent font-semibold">{heroData.highlightDesc}</span>.
                </p>
              </motion.div>
            </div>

            {/* Buttons */}
            <motion.div className="flex flex-col sm:flex-row gap-4" variants={itemVariants}>
              <Button size="lg" className="bg-primary text-primary-foreground shadow-xl">
                <a href="#contact">

                {heroData.primaryBtn}
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
                <span className="text-sm text-muted-foreground">{heroData.trustText}</span>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div className="grid grid-cols-3 gap-8 pt-8" variants={itemVariants}>
              {heroData.stats.map((s,index) => (
                <div key={index} className="group">
                  <div className={`text-2xl font-bold group-hover:text-${s.color}`}>{s.value}</div>
                  <div className="text-muted-foreground">{s.label}</div>
                  <div className={`w-8 h-1 bg-${s.color}/30 group-hover:bg-${s.color} mt-1`} />
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div className="relative" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.5 }}>
            <motion.div className="relative rounded-2xl overflow-hidden shadow-2xl" whileHover={{ scale: 1.02 }}>
              <img src={heroData.heroImage} alt="Modern business team collaborating" className="w-full h-[500px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              
              {/* Image overlay decorations */}
              <motion.div 
                className="absolute top-4 right-4 w-16 h-16 bg-primary/20 rounded-full backdrop-blur-sm"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />
              <motion.div 
                className="absolute top-4 left-4 w-12 h-12 bg-red-accent/20 rounded-full backdrop-blur-sm"
                variants={floatingVariants}
                animate="animate"
              />
            </motion.div>
            
            {/* Floating card */}
            <motion.div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-xl shadow-lg border border-border" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }}>
              <div className="flex items-center space-x-3">
                <motion.div 
                  className="w-3 h-3 bg-primary rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-sm font-medium">{heroData.cardText}</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}