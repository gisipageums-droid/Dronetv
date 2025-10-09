// Testimonials.tsx (non-editable version)
import React from "react";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

export interface Testimonial {
  id: number;
  name: string;
  position: string;
  company: string;
  image: string;
  content: string;
  rating: number;
  project: string;
  date?: string;
}

export interface TestimonialContent {
  subtitle: string;
  heading: string;
  description: string;
  testimonials: Testimonial[];
}

interface TestimonialsProps {
  content?: TestimonialContent;
}

const defaultContent: TestimonialContent = {
  subtitle: "client success stories and feedback",
  heading: "What Clients Say",
  description: "testimonials from satisfied clients",
  testimonials: [],
};

const Testimonials: React.FC<TestimonialsProps> = ({ content }) => {
  const testimonialContent = content || defaultContent;

  return (
    <section id="testimonials" className="py-20 bg-white dark:bg-gray-900">
      <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-gray-900 lg:text-5xl dark:text-white">
            {testimonialContent.heading.split(" ").slice(0, -1).join(" ")}{" "}
            <span className="text-orange-400">
              {testimonialContent.heading.split(" ").slice(-1)}
            </span>
          </h2>
          <p className="max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-400">
            {testimonialContent.description}
          </p>
        </motion.div>

        {/* Testimonials Grid or Empty State */}
        {testimonialContent.testimonials.length === 0 ? (
          <div className="py-20 text-center">
            <p className="mb-4 text-lg text-gray-500 dark:text-gray-400">
              No testimonials available yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 mb-16 md:grid-cols-2 lg:grid-cols-3">
            {testimonialContent.testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="relative p-6 transition-all duration-300 shadow-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl hover:shadow-2xl"
              >
                <div className="flex justify-end mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500">
                    <Quote className="w-5 h-5 text-black dark:text-white" />
                  </div>
                </div>

                <blockquote className="mb-6 italic leading-relaxed text-gray-700 dark:text-gray-300">
                  "{testimonial.content}"
                </blockquote>

                <div className="flex mb-4 space-x-1">
                  {[...Array(Math.max(0, testimonial.rating))].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-500 fill-yellow-500"
                    />
                  ))}
                </div>

                <div className="flex items-center space-x-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="object-cover w-12 h-12 rounded-full"
                    onError={(e) => {
                      // Fallback for broken images
                      (
                        e.target as HTMLImageElement
                      ).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        testimonial.name
                      )}&background=random`;
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h3>
                    <p className="text-sm font-medium text-orange-500">
                      {testimonial.position}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {testimonial.company}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="inline-flex items-center px-3 py-1 border rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-orange-500/30">
                    <span className="text-sm font-medium text-orange-500">
                      {testimonial.project}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Trusted Companies Section */}
        {testimonialContent.testimonials.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h3 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">
              Trusted by Amazing Companies
            </h3>

            <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
              {Array.from(
                new Set(testimonialContent.testimonials.map((t) => t.company))
              ).map((company, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.1, opacity: 1 }}
                  className="px-6 py-3 font-bold text-gray-700 bg-gray-100 rounded-lg dark:bg-gray-800 dark:text-gray-300"
                >
                  {company}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;