import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Code,
  Smartphone,
  Globe,
  Database,
  Palette,
  Zap,
  ArrowRight,
  Check,
} from "lucide-react";

const Service: React.FC = () => {
  const [hoveredService, setHoveredService] = useState<number | null>(null);

  const services = [
    {
      id: 1,
      title: "Web Development",
      shortDescription:
        "Modern, responsive websites built with cutting-edge technologies",
      fullDescription:
        "Custom web applications using React, Next.js, and modern frameworks. Focus on performance, SEO, and user experience.",
      icon: Globe,
      color: "from-status-info to-status-info",
      features: [
        "Responsive Design",
        "SEO Optimized",
        "Fast Performance",
        "Modern Frameworks",
      ],
      pricing: "Starting at $2,500",
      deliveryTime: "2-4 weeks",
    },
    {
      id: 2,
      title: "Mobile App Development",
      shortDescription: "Native and cross-platform mobile applications",
      fullDescription:
        "iOS and Android apps built with React Native and Flutter. Native performance with cross-platform efficiency.",
      icon: Smartphone,
      color: "from-brand-gold to-status-error",
      features: [
        "Cross-Platform",
        "Native Performance",
        "App Store Ready",
        "Push Notifications",
      ],
      pricing: "Starting at $5,000",
      deliveryTime: "4-8 weeks",
    },
    {
      id: 3,
      title: "Backend Development",
      shortDescription: "Scalable server-side solutions and APIs",
      fullDescription:
        "Robust backend systems using Node.js, Python, and cloud services. RESTful APIs and microservices architecture.",
      icon: Database,
      color: "from-status-success to-status-success",
      features: [
        "RESTful APIs",
        "Database Design",
        "Cloud Integration",
        "Scalable Architecture",
      ],
      pricing: "Starting at $3,000",
      deliveryTime: "3-6 weeks",
    },
    {
      id: 4,
      title: "Full-Stack Development",
      shortDescription: "Complete end-to-end application development",
      fullDescription:
        "Comprehensive solutions covering frontend, backend, database, and deployment. One-stop development service.",
      icon: Code,
      color: "from-status-warning to-status-error",
      features: [
        "End-to-End Solution",
        "Database Integration",
        "DevOps Setup",
        "Maintenance Support",
      ],
      pricing: "Starting at $7,500",
      deliveryTime: "6-12 weeks",
    },
    {
      id: 5,
      title: "UI/UX Design",
      shortDescription: "Beautiful, user-centered design solutions",
      fullDescription:
        "Modern interface design with focus on user experience. Wireframing, prototyping, and design systems.",
      icon: Palette,
      color: "from-status-error to-status-error",
      features: [
        "User Research",
        "Wireframing",
        "Prototyping",
        "Design Systems",
      ],
      pricing: "Starting at $1,500",
      deliveryTime: "1-3 weeks",
    },
    {
      id: 6,
      title: "Performance Optimization",
      shortDescription: "Speed up and optimize existing applications",
      fullDescription:
        "Improve application performance, reduce loading times, and enhance user experience through optimization.",
      icon: Zap,
      color: "from-brand-gold to-status-warning",
      features: [
        "Speed Optimization",
        "Code Refactoring",
        "Bundle Analysis",
        "Performance Monitoring",
      ],
      pricing: "Starting at $1,000",
      deliveryTime: "1-2 weeks",
    },
  ];

  return (
    <section id="services" className="py-20 bg-ink-offwhite dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-ink dark:text-white mb-4">
            My <span className="text-status-warning">Services</span>
          </h2>
          <p className="text-xl text-ink-paragraph dark:text-gray-400 max-w-3xl mx-auto">
            Comprehensive development solutions tailored to bring your ideas to
            life with modern technologies and best practices.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => {
            const isHovered = hoveredService === service.id;

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                onHoverStart={() => setHoveredService(service.id)}
                onHoverEnd={() => setHoveredService(null)}
                className="group relative bg-surface-card dark:bg-gray-900 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-ink-light dark:border-gray-800"
              >
                {/* Service Icon */}
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r  mb-6 transition-transform duration-300 bg-brand-gold text-xl font-extrabold`}
                >
                  <span className="uppercase text-white">
                    {service.title[0]}
                  </span>
                </div>

                {/* Service Title */}
                <h3 className="text-2xl font-bold text-ink dark:text-white mb-3">
                  {service.title}
                </h3>

                {/* Service Description */}
                <motion.p
                  layout
                  className="text-ink-paragraph dark:text-gray-400 mb-6 leading-relaxed transition-all duration-300"
                >
                  {isHovered
                    ? service.fullDescription
                    : service.shortDescription}
                </motion.p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={
                        isHovered
                          ? { opacity: 1, x: 0 }
                          : { opacity: 0.7, x: 0 }
                      }
                      transition={{ delay: isHovered ? idx * 0.1 : 0 }}
                      className="flex items-center text-sm text-ink-paragraph dark:text-gray-400"
                    >
                      <Check className="w-4 h-4 text-status-success mr-2 flex-shrink-0" />
                      {feature}
                    </motion.li>
                  ))}
                </ul>

                {/* CTA Button */}
                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full bg-status-warning text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 group-hover:shadow-lg`}
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </motion.a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Service;
