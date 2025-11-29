import { Award, Calendar, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Certificate {
  id: string | number;
  title: string;
  issuer: string;
  date: string;
  image: string;
  description: string;
  credentialUrl?: string;
}

interface CertificationsProps {
  certificationsData?: {
    heading?: string;
    description?: string;
    subtitle?: string;
    certifications?: Certificate[];
    stats?: {
      [key: string]: string;
    };
  };
}

export function Certifications({ certificationsData }: CertificationsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // If no certificationsData provided, return loading state
  if (!certificationsData) {
    return (
      <section id="certifications" className="py-20 bg-gradient-to-br from-yellow-50 to-background dark:from-yellow-900/20 dark:to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-8 bg-gray-300 rounded w-1/2 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3 mx-auto"></div>
          </div>
          <div className="relative max-w-5xl mx-auto">
            <div className="animate-pulse relative h-96 overflow-hidden rounded-2xl bg-gray-300 shadow-2xl"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-4xl mx-auto">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="text-center">
                <div className="h-8 bg-gray-300 rounded w-16 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-20 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Use certifications array from API or fallback to empty array
  const certificates = certificationsData.certifications || [];

  const nextSlide = () => {
    if (certificates.length <= 1) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % certificates.length);
  };

  const prevSlide = () => {
    if (certificates.length <= 1) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + certificates.length) % certificates.length);
  };

  const goToSlide = (index: number) => {
    if (certificates.length <= 1) return;
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  // Process stats data
  const processStatsData = () => {
    if (!certificationsData.stats) return [];

    return Object.entries(certificationsData.stats).map(([key, value]) => ({
      number: value,
      label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
    }));
  };

  const stats = processStatsData();

  return (
    <section id="certifications" className="py-20 text-justify bg-gradient-to-br from-yellow-50 to-background dark:from-yellow-900/20 dark:to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {certificationsData.heading && (
            <div className="flex items-center justify-center mb-4">
              <Award className="w-8 h-8 text-yellow-500 mr-3" />
              <h2 className="text-3xl sm:text-4xl lg:text-5xl text-foreground">
                {certificationsData.heading}
              </h2>
            </div>
          )}
          {certificationsData.description && (
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4 text-justify">
              {certificationsData.description}
            </p>
          )}
          {certificationsData.subtitle && (
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-justify">
              {certificationsData.subtitle}
            </p>
          )}
        </motion.div>

        {/* Certification Slider */}
        {certificates.length > 0 ? (
          <div className="relative max-w-5xl mx-auto">
            <div className="relative h-96 overflow-hidden rounded-2xl bg-card shadow-2xl">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                  className="absolute inset-0 grid md:grid-cols-2 gap-0"
                >
                  {/* Certificate Image */}
                  <div className="relative">
                    <ImageWithFallback
                      src={certificates[currentIndex].image}
                      alt={certificates[currentIndex].title}
                      className="w-full h-full object-cover"
                      fallbackSrc="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
                  </div>

                  {/* Certificate Details */}
                  <div className="p-8 flex flex-col justify-center bg-gradient-to-br from-card to-yellow-50 dark:from-card dark:to-yellow-900/20">
                    <div className="mb-6">
                      <h3 className="text-2xl lg:text-3xl text-foreground mb-2">
                        {certificates[currentIndex].title}
                      </h3>
                      <div className="flex items-center text-yellow-600 mb-4">
                        <Calendar className="w-5 h-5 mr-2" />
                        <span className="text-lg">
                          {certificates[currentIndex].issuer} • {certificates[currentIndex].date}
                        </span>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-6 leading-relaxed text-justify">
                      {certificates[currentIndex].description}
                    </p>

                    {certificates[currentIndex].credentialUrl && certificates[currentIndex].credentialUrl !== '#' && (
                      <a
                        href={certificates[currentIndex].credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-yellow-600 hover:text-yellow-700 transition-colors group"
                      >
                        <span className="mr-2">View Credential</span>
                        <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </a>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Arrows - Only show if multiple certificates */}
            {certificates.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:text-yellow-600 transition-all duration-300 hover:scale-110 z-10"
                  aria-label="Previous certificate"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:text-yellow-600 transition-all duration-300 hover:scale-110 z-10"
                  aria-label="Next certificate"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Dots Indicator - Only show if multiple certificates */}
            {certificates.length > 1 && (
              <div className="flex justify-center mt-8 space-x-3">
                {certificates.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                        ? 'bg-yellow-500 scale-125'
                        : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    aria-label={`Go to certificate ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">
              No certifications available
            </p>
          </div>
        )}

        {/* Certificate Stats */}
        {stats.length > 0 && (
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-3xl font-bold text-yellow-500 mb-2">{stat.number}</div>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}