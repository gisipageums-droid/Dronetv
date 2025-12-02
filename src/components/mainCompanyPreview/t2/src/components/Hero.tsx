import { motion } from "motion/react";

export default function Hero({ heroData }) {
  // Use heroData directly without any fallbacks
  const heroState = heroData || {};

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
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
        ease: "easeInOut",
      },
    },
  };

  return (
    <section
      id="home"
      className="pt-20 mt-[4rem] pb-16 bg-background relative overflow-hidden theme-transition"
    >
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
              {/* Badge - Using heroData.badgeText */}
              {heroState.badgeText && (
                <motion.div
                  className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary border border-primary/20 mb-4"
                  variants={itemVariants}
                >
                  <span className="font-bold text-sm">
                    {heroState.badgeText}
                  </span>
                </motion.div>
              )}

              {/* Heading */}
              <motion.div variants={itemVariants}>
                <h1 className="text-4xl md:text-6xl text-foreground leading-tight text-justify">
                  {heroState.heading}
                </h1>
              </motion.div>

              {/* Description */}
              <motion.div variants={itemVariants} className="max-w-lg text-justify">
                <p className="text-xl text-red-500">
                  {heroState.description}
                </p>
              </motion.div>
            </div>

            {/* Buttons */}
            {heroState.primaryBtn && (
              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                variants={itemVariants}
              >
                <button
                  size="lg"
                  className="bg-primary text-primary-foreground shadow-xl px-6 py-3 rounded-lg flex items-center"
                >
                  <a href="#contact">{heroState.primaryBtn}</a>
                </button>
              </motion.div>
            )}

            {/* Trust text */}
            {heroState.trustText && (
              <motion.div
                className="flex items-center space-x-6 pt-4"
                variants={itemVariants}
              >
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 bg-primary rounded-full border-2 border-background" />
                    <div className="w-8 h-8 bg-primary/80 rounded-full border-2 border-background" />
                    <div className="w-8 h-8 bg-red-accent rounded-full border-2 border-background" />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {heroState.trustText}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Stats */}
            {heroState.stats && heroState.stats.length > 0 && (
              <motion.div
                className="grid grid-cols-3 gap-8 pt-8"
                variants={itemVariants}
              >
                {heroState.stats.map((s) => (
                  <div key={s.id} className="group">
                    <div className={`text-2xl font-bold group-hover:text-${s.color}`}>
                      {s.value}
                    </div>
                    <div className="text-muted-foreground">{s.label}</div>
                    <div
                      className={`w-8 h-1 bg-${s.color}/30 group-hover:bg-${s.color} mt-1`}
                    />
                  </div>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Hero Image */}
          <motion.div
            className="relative"
            initial="hidden"
            animate="visible"
            variants={itemVariants}
          >
            {/* Main image container */}
            <div className="relative w-full -mt-6 md:-mt-8 xl:-mt-10">
              <motion.div
                className="relative"
                variants={imageVariants}
              >
                <div className="relative flex justify-center">
                  {/* Main Hero Image */}
                  <div className="relative">
                    {heroState.heroImage ? (
                      <img
                        src={heroState.heroImage}
                        alt="Modern business team collaborating"
                        className="w-full max-w-full h-auto object-contain rounded-3xl shadow-2xl"
                        style={{
                          maxHeight: '360px',
                          width: 'auto',
                          margin: '0 auto'
                        }}
                      />
                    ) : (
                      <div className="w-full max-w-full h-64 bg-gray-200 rounded-3xl shadow-2xl flex items-center justify-center">
                        <span className="text-gray-500">Hero Image</span>
                      </div>
                    )}
                  </div>

                  {/* Small overlapping image */}
                  <motion.div
                    className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 lg:-bottom-8 lg:-left-8"
                    variants={imageVariants}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="relative">
                      {heroState.hero3Image ? (
                        <img
                          src={heroState.hero3Image}
                          alt="Additional business context"
                          className="block w-auto h-auto max-w-[200px] max-h-[200px] object-contain rounded-2xl shadow-xl border-4 border-white bg-white"
                        />
                      ) : (
                        <div className="block w-32 h-24 bg-gray-200 rounded-2xl shadow-xl border-4 border-white flex items-center justify-center">
                          <span className="text-gray-500 text-xs">Small Image</span>
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* Decorative circle */}
                  <motion.div
                    className="absolute -top-6 -right-6 w-16 h-16 sm:w-20 sm:h-20 bg-yellow-400 rounded-full opacity-80"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6, type: "spring", stiffness: 300 }}
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}