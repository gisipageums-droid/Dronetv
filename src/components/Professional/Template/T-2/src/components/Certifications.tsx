import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Award, Calendar, ExternalLink } from 'lucide-react';

interface Certificate {
  id: number;
  title: string;
  issuer: string;
  date: string;
  image: string;
  description: string;
  credentialUrl?: string;
}

const certificates: Certificate[] = [
  {
    id: 1,
    title: "Full Stack Web Development",
    issuer: "Tech Academy",
    date: "2023",
    image: "https://images.unsplash.com/photo-1752937326758-f130e633b422?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjZXJ0aWZpY2F0ZSUyMGRpcGxvbWElMjBhY2hpZXZlbWVudHxlbnwxfHx8fDE3NTc1ODc1NDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Comprehensive certification covering React, Node.js, databases, and modern web development practices. Intensive 6-month program with hands-on projects.",
    credentialUrl: "#"
  },
  {
    id: 2,
    title: "Advanced JavaScript Programming",
    issuer: "Code Institute",
    date: "2022",
    image: "https://images.unsplash.com/photo-1565229284535-2cbbe3049123?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2RpbmclMjBjZXJ0aWZpY2F0aW9uJTIwcHJvZ3JhbW1pbmd8ZW58MXx8fHwxNTc1ODc1NDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "In-depth study of JavaScript ES6+, async programming, design patterns, and performance optimization techniques for modern web applications.",
    credentialUrl: "#"
  },
  {
    id: 3,
    title: "React Developer Certification",
    issuer: "Meta (Facebook)",
    date: "2023",
    image: "https://images.unsplash.com/photo-1554306274-f23873d9a26c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkZXZlbG9wbWVudCUyMGNvdXJzZSUyMGNvbXBsZXRpb258ZW58MXx8fHwxNzU3NTkxMTEzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Official Meta certification covering React fundamentals, hooks, state management, testing, and advanced patterns for building scalable applications.",
    credentialUrl: "#"
  },
  {
    id: 4,
    title: "Cloud Computing AWS",
    issuer: "Amazon Web Services",
    date: "2024",
    image: "https://images.unsplash.com/photo-1752937326758-f130e633b422?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjZXJ0aWZpY2F0ZSUyMGRpcGxvbWElMjBhY2hpZXZlbWVudHxlbnwxfHx8fDE3NTc1ODc1NDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "AWS Solutions Architect certification covering cloud infrastructure, serverless computing, security, and scalable application deployment.",
    credentialUrl: "#"
  }
];

export function Certifications() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % certificates.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + certificates.length) % certificates.length);
  };

  const goToSlide = (index: number) => {
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

  return (
    <section id="certifications" className="py-20 bg-gradient-to-br from-yellow-50 to-background dark:from-yellow-900/20 dark:to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center mb-4">
            <Award className="w-8 h-8 text-yellow-500 mr-3" />
            <h2 className="text-3xl sm:text-4xl lg:text-5xl text-foreground">
              Certifications & <span className="text-yellow-500">Achievements</span>
            </h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Continuous learning and professional development through industry-recognized certifications
          </p>
        </motion.div>

        {/* Certification Slider */}
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
                      <span className="text-lg">{certificates[currentIndex].issuer} • {certificates[currentIndex].date}</span>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {certificates[currentIndex].description}
                  </p>

                  <button className="inline-flex items-center text-yellow-600 hover:text-yellow-700 transition-colors group">
                    <span className="mr-2">View Credential</span>
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:text-yellow-600 transition-all duration-300 hover:scale-110 z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:text-yellow-600 transition-all duration-300 hover:scale-110 z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-3">
            {certificates.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-yellow-500 scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Certificate Stats */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="text-center">
            <div className="text-3xl text-yellow-500 mb-2">{certificates.length}+</div>
            <p className="text-muted-foreground">Certifications</p>
          </div>
          <div className="text-center">
            <div className="text-3xl text-yellow-500 mb-2">500+</div>
            <p className="text-muted-foreground">Hours of Learning</p>
          </div>
          <div className="text-center">
            <div className="text-3xl text-yellow-500 mb-2">15+</div>
            <p className="text-muted-foreground">Skills Mastered</p>
          </div>
          <div className="text-center">
            <div className="text-3xl text-yellow-500 mb-2">100%</div>
            <p className="text-muted-foreground">Pass Rate</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}