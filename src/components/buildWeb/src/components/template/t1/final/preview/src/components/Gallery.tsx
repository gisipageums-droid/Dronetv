import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Badge } from "../components/ui/badge";

export default function GallerySection({galleryData}) {
    const useScrollAnimation = () => {
        const [ref, setRef] = useState(null);
        const [isVisible, setIsVisible] = useState(false);

        useEffect(() => {
            if (!ref) return;

            const observer = new IntersectionObserver(
                ([entry]) => {
                    setIsVisible(entry.isIntersecting);
                },
                { threshold: 0.1 }
            );

            observer.observe(ref);
            return () => observer.unobserve(ref);
        }, [ref]);

        return [setRef, isVisible] as const;
    };

    const [galleryRef, galleryVisible] = useScrollAnimation();

    // Mock gallery images from Unsplash
    const galleryImages = galleryData?.images || [
        "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1529533520516-5e45b20d07a5?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1560806883-642f26c2825d?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=600&fit=crop",
    ];

    return (
        <section id="gallery"
            ref={galleryRef}
            className="py-24 bg-gradient-to-b from-yellow-50/30 via-white to-yellow-50/20 scroll-mt-20"
        >
            <div className="max-w-7xl mx-auto px-6">
                {/* Section Header — Animated */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={galleryVisible ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="inline-block mb-4"
                    >
                        <Badge className="bg-[#ffeb3b] text-gray-900 px-5 py-2 shadow-md">
                            Our Gallery
                        </Badge>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        animate={galleryVisible ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
                        className="text-3xl md:text-4xl font-extrabold text-gray-900"
                    >
                        Moments That Define Us
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={galleryVisible ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
                        className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg"
                    >
                        Explore snapshots of our workspace, team, events, and the innovation
                        that drives us every day.
                    </motion.p>
                </div>

                {/* Gallery Grid — with enhanced hover & animations */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {galleryImages.map((src, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 50, rotateX: 10 }}
                            animate={galleryVisible ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                            transition={{
                                delay: 0.5 + i * 0.1,
                                duration: 0.8,
                                ease: [0.16, 1, 0.3, 1], // easeOutQuart
                            }}
                            whileHover={{
                                scale: 1.05,
                                y: -10,
                                rotateX: 0,
                                boxShadow: "0 30px 40px -15px rgba(0,0,0,0.15)",
                                transition: { duration: 0.3, ease: "easeOut" },
                            }}
                            whileTap={{ scale: 0.98 }}
                            className="overflow-hidden rounded-2xl bg-white border border-yellow-100 cursor-pointer group"
                            style={{ willChange: "transform, box-shadow" }}
                        >
                            <div className="relative overflow-hidden h-60 md:h-72">
                                {/* GRADIENT OVERLAY on hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                {/* IMAGE with grayscale → color on hover */}
                                <img
                                    src={src}
                                    alt={`Gallery image ${i + 1}`}
                                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0 grayscale"
                                    style={{ backfaceVisibility: "hidden" }}
                                    onError={(e) => {
                                        e.currentTarget.src =
                                            "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&h=600&fit=crop";
                                    }}
                                />

                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        View
                                    </div>
                                </div>

                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}