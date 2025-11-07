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

interface ServicesProps {
    serviceData?: {
        heading?: string;
        subtitle?: string;
        description?: string;
        services?: Service[];
    };
}

export function Services({ serviceData }: ServicesProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    // Use dynamic data from props or fallback to empty array
    const services = serviceData?.services || [];

    const nextSlide = () => {
        if (services.length === 0) return;
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % services.length);
    };

    const prevSlide = () => {
        if (services.length === 0) return;
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + services.length) % services.length);
    };

    const goToSlide = (index: number) => {
        if (services.length === 0) return;
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

    // Loading state
    if (!serviceData) {
        return (
            <section id="services" className="py-20 bg-gradient-to-br from-red-50 to-background dark:from-red-900/20 dark:to-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="flex items-center justify-center mb-4">
                            <Briefcase className="w-8 h-8 text-red-500 mr-3" />
                            <div className="h-10 bg-gray-300 rounded w-48 mx-auto"></div>
                        </div>
                        <div className="h-6 bg-gray-300 rounded w-32 mx-auto mb-2"></div>
                        <div className="h-4 bg-gray-300 rounded w-64 mx-auto"></div>
                    </div>
                    <div className="relative max-w-5xl mx-auto">
                        <div className="relative h-96 overflow-hidden rounded-2xl bg-gray-200 animate-pulse">
                            <div className="w-full h-full flex">
                                <div className="w-1/2 bg-gray-300"></div>
                                <div className="w-1/2 p-8 flex flex-col justify-center">
                                    <div className="h-8 bg-gray-300 rounded w-3/4 mx-auto mb-4"></div>
                                    <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
                                    <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto mb-2"></div>
                                    <div className="h-4 bg-gray-300 rounded w-1/3 mx-auto"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

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
                            {serviceData.heading || "My Services"}
                        </h2>
                    </div>
                    {serviceData.subtitle && (
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="text-xl text-red-600 mb-4 max-w-3xl mx-auto"
                        >
                            {serviceData.subtitle}
                        </motion.p>
                    )}
                    {serviceData.description && (
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            viewport={{ once: true }}
                            className="text-lg text-muted-foreground max-w-3xl mx-auto"
                        >
                            {serviceData.description}
                        </motion.p>
                    )}
                </motion.div>

                {/* Services Slider - Only show if services exist */}
                {services.length > 0 ? (
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
                                    {/* Service Image - Updated to match the first component */}
                                    <div className="relative aspect-[4/3]">
                                        {services[currentIndex]?.image ? (
                                            <ImageWithFallback
                                                src={services[currentIndex].image}
                                                alt={services[currentIndex].title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                                <p className="text-gray-400 text-sm">No image uploaded</p>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
                                    </div>

                                    {/* Service Details - Updated to match the first component */}
                                    <div className="p-8 flex flex-col justify-center bg-gradient-to-br from-card to-red-50 dark:from-card dark:to-red-900/20">
                                        <div className="flex-1 flex flex-col justify-center">
                                            <div className="mb-6">
                                                {/* Service Title */}
                                                <motion.h3
                                                    className="text-2xl lg:text-3xl text-foreground mb-2"
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.2 }}
                                                >
                                                    {services[currentIndex].title}
                                                </motion.h3>

                                                {/* Service Details (Issuer and Date) */}
                                                <motion.div
                                                    className="flex items-center text-red-600 mb-4"
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.3 }}
                                                >
                                                    <span className="text-lg">{services[currentIndex].issuer} • {services[currentIndex].date}</span>
                                                </motion.div>
                                            </div>

                                            {/* Service Description */}
                                            <motion.p
                                                className="text-muted-foreground leading-relaxed flex-1"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.4 }}
                                            >
                                                {services[currentIndex].description}
                                            </motion.p>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Navigation Arrows - Only show if multiple services */}
                        {services.length > 1 && (
                            <>
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
                            </>
                        )}
                    </div>
                ) : (
                    <div className='h-0 w-0 hidden'></div>
                )}
            </div>
        </section>
    );
}