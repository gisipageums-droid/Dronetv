import React from "react";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      position: "CEO, TechStart Inc.",
      company: "TechStart Inc.",
      image:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
      content:
        "John delivered an exceptional e-commerce platform that exceeded our expectations. His attention to detail and ability to understand our business needs made the entire process smooth and efficient.",
      rating: 5,
      project: "E-Commerce Platform",
    },
    {
      id: 2,
      name: "Michael Chen",
      position: "CTO, DataFlow Solutions",
      company: "DataFlow Solutions",
      image:
        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400",
      content:
        "Working with John was a game-changer for our company. He transformed our complex data requirements into an intuitive platform that our team loves using. Highly recommended!",
      rating: 5,
      project: "Data Analytics Dashboard",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      position: "Product Manager, InnovateLab",
      company: "InnovateLab",
      image:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
      content:
        "Johns expertise in both frontend and backend development allowed us to build a cohesive product. His communication skills and proactive approach made our collaboration seamless.",
      rating: 5,
      project: "Project Management Tool",
    },
    {
      id: 4,
      name: "David Thompson",
      position: "Founder, EduTech Pro",
      company: "EduTech Pro",
      image:
        "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400",
      content:
        "John built our learning management system from the ground up. The scalability and user experience he delivered have been crucial to our success. A true professional!",
      rating: 5,
      project: "Learning Management System",
    },
    {
      id: 5,
      name: "Lisa Wang",
      position: "Marketing Director, GrowthCo",
      company: "GrowthCo",
      image:
        "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400",
      content:
        "The mobile app John developed for us has received fantastic user feedback. His ability to translate our vision into a beautiful, functional product was impressive.",
      rating: 5,
      project: "Mobile Application",
    },
  ];

  return (
    <section id="testimonials" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            What Clients <span className="text-orange-400">Say</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Don't just take my word for it. Here's what my clients have to say
            about working with me.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              {/* Quote Icon */}
              <div className="flex justify-end mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-accent-yellow to-accent-orange rounded-full flex items-center justify-center">
                  <Quote className="w-5 h-5 text-black dark:text-white" />
                </div>
              </div>

              {/* Testimonial Content */}
              <blockquote className="text-gray-700 dark:text-gray-300 mb-6 italic leading-relaxed">
                "{testimonial.content}"
              </blockquote>

              {/* Rating */}
              <div className="flex space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-yellow-500 fill-yellow-500"
                  />
                ))}
              </div>

              {/* Client Info */}
              <div className="flex items-center space-x-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </h3>
                  <p className="text-orange-500 font-medium text-sm">
                    {testimonial.position}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-xs">
                    {testimonial.company}
                  </p>
                </div>
              </div>

              {/* Project Tag */}
              <div className="mt-4 pt-4 border-t border-orange-500 dark:border-gray-700">
                <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-accent-yellow/20 to-accent-orange/20 border border-orange-500 rounded-full">
                  <span className="text-orange-500 font-medium text-sm">
                    {testimonial.project}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Client Logos Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Trusted by Amazing Companies
          </h3>

          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {[
              "TechStart",
              "DataFlow",
              "InnovateLab",
              "EduTech Pro",
              "GrowthCo",
            ].map((company, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1, opacity: 1 }}
                className="px-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg font-bold text-gray-700 dark:text-gray-300"
              >
                {company}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
