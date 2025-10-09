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
      color: "from-blue-500 to-cyan-500",
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
      color: "from-purple-500 to-pink-500",
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
      color: "from-green-500 to-emerald-500",
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
      color: "from-orange-500 to-red-500",
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
      color: "from-pink-500 to-rose-500",
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
      color: "from-yellow-500 to-orange-500",
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
    <section id="services" className="py-20 bg-gray-50 dark:bg-gray-800">
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
            My <span className="text-orange-400">Services</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Comprehensive development solutions tailored to bring your ideas to
            life with modern technologies and best practices.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => {
            const Icon = service.icon;
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
                className="group relative bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-800"
              >
                {/* Service Icon */}
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${service.color} mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-8 h-8 text-black dark:text-white" />
                </div>

                {/* Service Title */}
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {service.title}
                </h3>

                {/* Service Description */}
                <motion.p
                  layout
                  className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed transition-all duration-300"
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
                      className="flex items-center text-sm text-gray-600 dark:text-gray-400"
                    >
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </motion.li>
                  ))}
                </ul>

                {/* Pricing and Timeline */}
                <div className="flex justify-between items-center mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Starting at
                    </p>
                    <p
                      className={`font-bold bg-gradient-to-r ${service.color} bg-clip-text text-transparent`}
                    >
                      {service.pricing}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Delivery
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {service.deliveryTime}
                    </p>
                  </div>
                </div>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full bg-orange-500 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 group-hover:shadow-lg`}
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </motion.button>

                {/* Hover Effect Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${service.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Why Choose Me Section */}
        {/* <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center bg-white dark:bg-gray-900 rounded-3xl p-8 lg:p-12 shadow-xl"
        >
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Why Choose My Services?
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                Quality Focused
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Clean, maintainable code following industry best practices and
                standards.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                Fast Delivery
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Efficient development process with regular updates and on-time
                delivery.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                Full Support
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Ongoing maintenance and support to ensure your project stays
                up-to-date.
              </p>
            </div>
          </div>
        </motion.div> */}
      </div>
    </section>
  );
};

export default Service;
