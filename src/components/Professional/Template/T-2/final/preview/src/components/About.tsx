import { motion } from 'motion/react';
import { AnimatedButton } from './AnimatedButton';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function About({ aboutData }) {
  // If no aboutData provided, return null or loading state
  if (!aboutData) {
    return (
      <section id="about" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Loading state */}
            <div className="animate-pulse">
              <div className="absolute inset-0 bg-yellow-400 rounded-3xl transform -rotate-6"></div>
              <div className="relative bg-gray-300 rounded-3xl overflow-hidden shadow-2xl w-full h-96"></div>
            </div>
            <div className="space-y-6">
              <div className="h-8 bg-gray-300 rounded w-1/2"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                <div className="h-4 bg-gray-300 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content - Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-yellow-400 rounded-3xl transform -rotate-6"></div>
              <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src={aboutData.imageSrc}
                  alt="About me"
                  className="w-full h-96 object-cover"
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl text-foreground"
            >
              {aboutData.heading?.includes("Me") ? aboutData.heading : "About Me"}
              {aboutData.heading && !aboutData.heading.includes("Me") && (
                <span className="text-yellow-500"> Me</span>
              )}
            </motion.h2>

            {aboutData.subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="text-lg text-muted-foreground font-semibold"
              >
                {aboutData.subtitle}
              </motion.p>
            )}

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-lg text-muted-foreground leading-relaxed"
            >
              {aboutData.description1}
            </motion.p>

            {aboutData.description2 && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
                className="text-lg text-muted-foreground leading-relaxed"
              >
                {aboutData.description2}
              </motion.p>
            )}

            {aboutData.description3 && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                viewport={{ once: true }}
                className="text-lg text-muted-foreground leading-relaxed"
              >
                {aboutData.description3}
              </motion.p>
            )}

            {/* Stats highlights */}
            {aboutData.stats && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                {aboutData.stats.yearsExperience && (
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span className="text-gray-700">{aboutData.stats.yearsExperience} Years Experience</span>
                  </div>
                )}
                {aboutData.stats.projectsCompleted && (
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span className="text-gray-700">{aboutData.stats.projectsCompleted} Projects Completed</span>
                  </div>
                )}
                {aboutData.stats.happyClients && (
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span className="text-gray-700">{aboutData.stats.happyClients} Happy Clients</span>
                  </div>
                )}
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              viewport={{ once: true }}
            >
              {aboutData.downloadCV ? (
                <AnimatedButton href={aboutData.downloadCV.href} size="lg">
                  {aboutData.downloadCV.text}
                </AnimatedButton>
              ) : (
                <AnimatedButton href="#contact" size="lg">
                  Let's Work Together
                </AnimatedButton>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}