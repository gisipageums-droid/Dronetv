import { Quote, Star } from 'lucide-react';
import { motion } from 'motion/react';

export function SimpleTestimonials({ testimonialData }) {
  // If no testimonialData provided, return loading state
  if (!testimonialData) {
    return (
      <section className="py-20 bg-white dark:bg-yellow-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-8 bg-gray-300 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3 mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="animate-pulse bg-card rounded-2xl p-6 shadow-lg min-h-[400px] flex flex-col">
                <div className="w-12 h-12 bg-gray-300 rounded-full mb-4"></div>
                <div className="flex space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-5 h-5 bg-gray-300 rounded"></div>
                  ))}
                </div>
                <div className="space-y-2 mb-6 flex-1">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-300 rounded w-4/6"></div>
                </div>
                <div className="flex items-center space-x-4 mt-auto pt-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-24"></div>
                    <div className="h-3 bg-gray-300 rounded w-32"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Process testimonials data from backend
  const processTestimonialsData = () => {
    if (!testimonialData.testimonials || testimonialData.testimonials.length === 0) {
      return [];
    }

    return testimonialData.testimonials.map((testimonial) => ({
      name: testimonial.name,
      position: testimonial.position,
      rating: testimonial.rating || 5,
      review: testimonial.content,
      project: testimonial.project,
      date: testimonial.date
    }));
  };

  const testimonials = processTestimonialsData();

  // Dynamic CTA data
  const ctaData = testimonialData.cta || {
    title: "Ready to be the next success story?",
    description: "Join the growing list of satisfied clients who have transformed their businesses with innovative digital solutions.",
    buttonText: "Start Your Success Story",
    buttonLink: "#contact"
  };

  return (
    <section className="py-20 bg-white dark:bg-yellow-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Fully Dynamic */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl text-foreground mb-4">
            {testimonialData.heading || "Client Testimonials"}
          </h2>
          {testimonialData.description && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
              {testimonialData.description}
            </p>
          )}
          {testimonialData.subtitle && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {testimonialData.subtitle}
            </p>
          )}
        </motion.div>

        {/* Testimonials Grid */}
        {testimonials.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={`${testimonial.name}-${index}`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="bg-card border-2 border-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col min-h-[400px]"
              >
                {/* Quote Icon */}
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mb-4">
                  <Quote className="w-6 h-6 text-gray-900" />
                </div>

                {/* Stars - Dynamic Rating */}
                <div className="flex space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Review - Dynamic Content with fixed height */}
                <div className="flex-1 mb-6 min-h-[120px] max-h-[120px] overflow-y-auto">
                  <p className="text-muted-foreground leading-relaxed">
                    "{testimonial.review}"
                  </p>
                </div>

                {/* Client Info - Fixed at bottom */}
                <div className="flex items-center space-x-4 mt-auto pt-4 border-t border-gray-200">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-900 text-lg font-semibold">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-foreground mb-1 truncate">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground truncate">
                      {testimonial.position}
                    </p>
                    {testimonial.project && (
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {testimonial.project}
                      </p>
                    )}
                    {testimonial.date && (
                      <p className="text-xs text-muted-foreground truncate">
                        {testimonial.date}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 hidden">
            <p className="text-muted-foreground text-lg">
              {testimonialData.emptyMessage || 
                (testimonialData.testimonials && testimonialData.testimonials.length === 0 
                  ? "Client testimonials are being updated"
                  : "No testimonials data available"
                )
              }
            </p>
          </div>
        )}

        {/* Bottom CTA - Fully Dynamic */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-card rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl text-foreground mb-4">
              {ctaData.title}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              {ctaData.description}
            </p>
            <motion.a
              href={ctaData.buttonLink}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-8 py-3 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {ctaData.buttonText}
            </motion.a>
          </div>
        </motion.div> */}
      </div>
    </section>
  );
}