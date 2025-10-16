import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Star } from "lucide-react";
import { motion } from "motion/react";

export default function Testimonials({ testimonialsData }) {
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

  const cardVariants = {
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

  return (
    <motion.section
      id="testimonial"
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
            {testimonialsData.headline.title}
          </h2>
          <p className="text-lg text-muted-foreground">
            {testimonialsData.headline.description}
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          transition={{duration: 0.8}}
          animate={{opacity:[0,1],y:[50,0]}}
          viewport={{ once: true }}
        >
          {testimonialsData.testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-card border-border hover:shadow-xl transition-all duration-300 hover:border-primary/30">
                <CardContent className="p-8">
                  {/* Rating */}
                  <div className="flex space-x-1 mb-4">
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
                        <Star className="h-5 w-5 fill-primary text-primary" />
                      </motion.div>
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-card-foreground mb-6 leading-relaxed">
                    <span className="text-card-foreground leading-relaxed">
                      {testimonial.quote}
                    </span>
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center space-x-4">
                    <motion.div
                      className="w-12 h-12 rounded-full overflow-hidden"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Note: ImageWithFallback component would be used here if we had it */}
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        {testimonial.name.charAt(0)}
                      </div>
                    </motion.div>
                    <div>
                      <div className="font-medium text-card-foreground">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats section */}
        <motion.div
          className="mt-16 pt-16 border-t border-border"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {testimonialsData.stats.map((stat, index) => (
              <motion.div
                key={index}
                className="group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                whileHover={{ y: -3 }}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-3xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {stat.value}
                  </div>
                </motion.div>
                <div className="text-muted-foreground">{stat.label}</div>
                <motion.div
                  className="w-8 h-1 bg-primary/30 group-hover:bg-primary transition-colors mt-2 mx-auto rounded-full"
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}