import { Briefcase, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Service {
    id: number;
    title: string;
    issuer: string;
    date: string;
    image: string;
    description: string;
}

const services: Service[] = [
    {
        id: 1,
        title: 'Web Development',
        issuer: 'Full-Stack Solutions',
        date: '2020 - Present',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop',
        description: 'Custom web applications built with modern technologies'
    },
    {
        id: 2,
        title: 'Mobile App Development',
        issuer: 'iOS & Android',
        date: '2021 - Present',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
        description: 'Cross-platform mobile applications for iOS and Android'
    },
    {
        id: 3,
        title: 'Backend Development',
        issuer: 'Server & API Solutions',
        date: '2020 - Present',
        image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=600&h=400&fit=crop',
        description: 'Robust backend systems and API development'
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

    // Safe string splitting for heading
    const renderHeading = () => {
        const heading = "My Services";
        const words = heading.split(' ');

        if (words.length > 1) {
            return (
                <>
                    {words[0]}{' '}
                    <span className="text-red-500">
                        {words.slice(1).join(' ')}
                    </span>
                </>
            );
        }
        return heading;
    };

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
                            {renderHeading()}
                        </h2>
                    </div>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="text-lg text-red-500 mb-2"
                    >
                        professional services
                    </motion.p>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        viewport={{ once: true }}
                        className="text-xl text-muted-foreground max-w-3xl mx-auto"
                    >
                        Professional services tailored to bring your digital vision to life
                    </motion.p>
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
                                <div className="w-full h-full flex bg-gradient-to-br from-card to-red-50 dark:from-card dark:to-red-900/20">
                                    {/* Service Image */}
                                    <div className="w-1/2 relative">
                                        <motion.div transition={{ duration: 0.3 }}>
                                            <ImageWithFallback
                                                src={services[currentIndex].image}
                                                alt={services[currentIndex].title}
                                                className="w-full h-full object-cover"
                                            />
                                        </motion.div>
                                    </div>

                                    {/* Service Content */}
                                    <div className="w-1/2 p-8 flex flex-col items-center justify-center">
                                        {/* Service Title */}
                                        <motion.h3
                                            className="text-3xl lg:text-4xl text-foreground mb-4 text-center"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            {services[currentIndex].title}
                                        </motion.h3>

                                        {/* Service Description */}
                                        <motion.p
                                            className="text-muted-foreground mb-4 leading-relaxed text-center"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            {services[currentIndex].description}
                                        </motion.p>

                                        {/* Service Details */}
                                        <motion.div
                                            className="text-center"
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
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                                        ? 'bg-red-500 scale-125'
                                        : 'bg-gray-300 hover:bg-gray-400'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}