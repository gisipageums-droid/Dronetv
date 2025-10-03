import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Briefcase, Globe, Smartphone, Server } from 'lucide-react';

interface Service {
  id: number;
  title: string;
  issuer: string;
  date: string;
  icon: any;
}

const services: Service[] = [
  {
    id: 1,
    title: 'Web Development',
    issuer: 'Full-Stack Solutions',
    date: '2020 - Present',
    icon: Globe,
  },
  {
    id: 2,
    title: 'Mobile App Development',
    issuer: 'iOS & Android',
    date: '2021 - Present',
    icon: Smartphone,
  },
  {
    id: 3,
    title: 'Backend Development',
    issuer: 'Server & API Solutions',
    date: '2020 - Present',
    icon: Server,
  }
];

export function Services() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % services.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + services.length) % services.length);
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

  const CurrentIcon = services[currentIndex].icon;

  return (
    <section id="services" className="py-20 bg-gradient-to-br from-red-50 to-background dark:from-red-900/20 dark:to-background">
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
            <Briefcase className="w-8 h-8 text-red-500 mr-3" />
            <h2 className="text-3xl sm:text-4xl lg:text-5xl text-foreground">
              My <span className="text-red-500">Services</span>
            </h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Professional services tailored to bring your digital vision to life
          </p>
        </motion.div>

        {/* Services Slider */}
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
                className="absolute inset-0 flex items-center justify-center"
              >
                {/* Service Card Content */}
                <div className="w-full h-full p-8 flex flex-col items-center justify-center bg-gradient-to-br from-card to-red-50 dark:from-card dark:to-red-900/20">
                  {/* Service Icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: 0.1 
                    }}
                    className="w-24 h-24 bg-gradient-to-br from-red-500 to-yellow-500 rounded-2xl flex items-center justify-center mb-8 shadow-lg"
                  >
                    <CurrentIcon className="w-12 h-12 text-white" />
                  </motion.div>

                  {/* Service Title */}
                  <motion.h3 
                    className="text-3xl lg:text-4xl text-foreground mb-4 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {services[currentIndex].title}
                  </motion.h3>

                  {/* Service Details */}
                  <motion.div 
                    className="text-center mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <p className="text-lg text-red-600 dark:text-red-400">
                      {services[currentIndex].issuer}
                    </p>
                    <p className="text-muted-foreground">
                      {services[currentIndex].date}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:text-red-600 transition-all duration-300 hover:scale-110 z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:text-red-600 transition-all duration-300 hover:scale-110 z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-3">
            {services.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-red-500 scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Service Stats */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="text-center">
            <div className="text-3xl text-red-500 mb-2">50+</div>
            <p className="text-muted-foreground">Projects Delivered</p>
          </div>
          <div className="text-center">
            <div className="text-3xl text-red-500 mb-2">30+</div>
            <p className="text-muted-foreground">Happy Clients</p>
          </div>
          <div className="text-center">
            <div className="text-3xl text-red-500 mb-2">5+</div>
            <p className="text-muted-foreground">Years Experience</p>
          </div>
          <div className="text-center">
            <div className="text-3xl text-red-500 mb-2">100%</div>
            <p className="text-muted-foreground">Satisfaction Rate</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}