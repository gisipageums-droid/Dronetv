import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Hero({ heroData }) {
  // If no heroData provided, return loading state
  if (!heroData) {
    return (
      <section id="home" className="min-h-screen flex items-center bg-gradient-to-br from-background to-surface-main dark:from-background dark:to-yellow-900/20 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Loading state */}
            <div className="space-y-8">
              <div className="animate-pulse space-y-4">
                <div className="h-12 bg-ink-light rounded w-3/4"></div>
                <div className="h-4 bg-ink-light rounded"></div>
                <div className="h-4 bg-ink-light rounded w-5/6"></div>
                <div className="flex gap-4 mt-6">
                  <div className="h-12 bg-ink-light rounded w-32"></div>
                  <div className="h-12 bg-ink-light rounded w-32"></div>
                </div>
              </div>
            </div>
            <div className="animate-pulse">
              <div className="bg-ink-light rounded-3xl w-full h-96"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="home" className="min-h-screen flex items-center bg-gradient-to-br from-background to-surface-main dark:from-background dark:to-yellow-900/20 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl text-foreground leading-tight">
              {"Hi, I'm"}{' '}
              <span className="text-brand-gold">{heroData.name}</span>
            </h1>

            <p className="text-xl text-justify text-muted-foreground leading-relaxed">
              {heroData.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              {heroData.ctaButtons && heroData.ctaButtons.map((button, index) => (
                <a
                  key={index}
                  href={button.href}
                  className={`inline-flex items-center justify-center px-6 py-3 rounded-lg transition-colors ${
                    button.variant === 'primary' 
                      ? 'bg-status-info text-white hover:bg-status-info' 
                      : 'bg-transparent text-status-info border border-status-info hover:bg-status-info/10'
                  }`}
                >
                  {button.text}
                </a>
              ))}
            </div>
          </div>

          {/* Right Content - User Image */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <motion.div 
                className="absolute inset-0 bg-brand-yellow rounded-3xl transform rotate-6"
                whileHover={{ rotate: 8, scale: 1.02 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              ></motion.div>
              <motion.div 
                className="relative bg-card rounded-3xl overflow-hidden shadow-2xl"
                whileHover={{ 
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  y: -5
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <ImageWithFallback
                  src={heroData.image}
                  alt={`${heroData.name || "Professional"} - ${heroData.title || "Technology Professional"}`}
                  className="w-full h-96 object-cover object-center transition-transform duration-300 hover:scale-110"
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}