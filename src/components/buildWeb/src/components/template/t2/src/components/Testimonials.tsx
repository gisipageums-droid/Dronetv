import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "motion/react";

// Default data for testimonials
const defaultTestimonialsData = {
  headline: {
    title: "What Our Clients Say",
    description: "Don't just take our word for it. Here's what our satisfied clients have to say about working with us."
  },
  testimonials: [
    {
      name: "Sarah Johnson",
      role: "CEO, TechStart Inc.",
      image: "https://images.unsplash.com/photo-1613473350016-1fe047d6d360?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGV4ZWN1dGl2ZSUyMHBvcnRyYWl0fGVufDF8fHx8MTc1NTYxODQxNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      quote: "Working with this company has been a game-changer for our business. Their expertise and dedication to our success is unmatched.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Founder, Innovation Labs",
      image: "https://images.unsplash.com/photo-1584940120505-117038d90b05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHBlcnNvbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc1NTU1MzI2OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      quote: "The results speak for themselves. We've seen a 300% increase in efficiency since implementing their solutions.",
      rating: 5,
    },
    {
      name: "David Rodriguez",
      role: "Director, Global Enterprises",
      image: "https://images.unsplash.com/photo-1629507208649-70919ca33793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1hbiUyMHN1aXQlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTU1ODYzOTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      quote: "Professional, reliable, and results-driven. They've helped us scale our operations beyond what we thought possible.",
      rating: 5,
    },
    {
      name: "Emily Watson",
      role: "Marketing Director, GrowthCo",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc1NTYxODQxNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      quote: "Outstanding service and incredible results. The team went above and beyond to deliver exactly what we needed.",
      rating: 5,
    },
    {
      name: "James Wilson",
      role: "CTO, TechInnovate",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc1NTU4NjM5MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      quote: "Their attention to detail and technical expertise helped us solve complex challenges with elegant solutions.",
      rating: 4,
    }
  ]
};

export default function Testimonials({testimonialsData = defaultTestimonialsData}) {
  // Use provided data or default data
  const data = testimonialsData || defaultTestimonialsData;
  
  // Duplicate testimonials for marquee loop (showing 3 at a time)
  const duplicatedTestimonials = [...data.testimonials, ...data.testimonials];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  return (
    <motion.section
      className="py-20 bg-background theme-transition"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl text-foreground mb-4">
            {data.headline.title}
          </h2>
          <p className="text-lg text-muted-foreground">
            {data.headline.description}
          </p>
        </motion.div>

        {/* Testimonials Marquee Container */}
        <div className="group w-full overflow-hidden">
          <style>
            {`
              @keyframes marquee {
                0% { transform: translateX(0%); }
                100% { transform: translateX(-50%); }
              }
              .animate-marquee {
                animation: marquee 60s linear infinite;
              }
              .group:hover .animate-marquee {
                animation-play-state: paused;
              }
            `}
          </style>

          {/* Marquee layout */}
          <motion.div
            className="flex gap-8 animate-marquee"
            variants={containerVariants}
            transition={{duration: 0.8}}
            animate={{opacity:[0,1],y:[50,0]}}
            viewport={{ once: true }}
          >
            {duplicatedTestimonials.map((testimonial, index) => (
              <div key={index} className="flex-shrink-0 w-80 lg:w-96">
                <TestimonialCard 
                  testimonial={testimonial}
                  index={index % data.testimonials.length}
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

// Testimonial Card Component
function TestimonialCard({ testimonial, index }) {
  return (
    <motion.div
      variants={{
        hidden: { y: 50, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1,
          transition: {
            duration: 0.8,
            ease: "easeOut",
          },
        },
      }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <div className="bg-card border-border hover:shadow-xl transition-all duration-300 hover:border-primary/30 h-full flex flex-col rounded-lg border">
        <div className="p-8 flex flex-col flex-grow">
          {/* Rating */}
          <div className="flex space-x-1 mb-4 flex-shrink-0">
            {[...Array(testimonial.rating)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.1 + i * 0.05,
                  duration: 0.4,
                  type: "spring",
                }}
                whileHover={{ scale: 1.2 }}
              >
                <svg 
                  className="h-5 w-5 fill-primary text-primary" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </motion.div>
            ))}
          </div>

          {/* Quote */}
          <div className="flex-grow mb-6">
            <blockquote className="text-card-foreground leading-relaxed min-h-[120px]">
              <span className="text-card-foreground leading-relaxed line-clamp-6">
                {testimonial.quote}
              </span>
            </blockquote>
          </div>

          {/* Author */}
          <div className="flex items-center space-x-4 mt-auto">
            <motion.div
              className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <ImageWithFallback
                src={testimonial.image}
                alt={testimonial.name}
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div className="flex-grow min-w-0">
              <div className="font-medium text-card-foreground truncate">
                {testimonial.name}
              </div>
              <div className="text-sm text-muted-foreground truncate">
                {testimonial.role}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}