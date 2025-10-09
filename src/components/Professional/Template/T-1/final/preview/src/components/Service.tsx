import React from "react";
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
  Monitor,
  Briefcase,
  Lightbulb,
  Cpu,
  Cloud,
  Shield,
  Server,
} from "lucide-react";

interface Service {
  id: number;
  title: string;
  shortDescription: string;
  fullDescription: string;
  icon: string;
  color: string;
  features: string[];
  pricing: string;
  deliveryTime: string;
}

export interface ServiceContent {
  subtitle: string;
  heading: string;
  description: string;
  services: Service[];
}

interface ServiceProps {
  content?: ServiceContent;
}

const defaultContent: ServiceContent = {
  subtitle: "professional services to transform your business",
  heading: "What I Do",
  description: "comprehensive services tailored to your needs",
  services: [],
};

const Service: React.FC<ServiceProps> = ({ content }) => {
  const serviceContent = content || defaultContent;
  const [hoveredService, setHoveredService] = React.useState<number | null>(null);

  const availableIcons = React.useMemo(
    () => ({
      Globe,
      Smartphone,
      Database,
      Code,
      Palette,
      Zap,
      Monitor,
      Briefcase,
      Lightbulb,
      Cpu,
      Cloud,
      Shield,
      Server,
    }),
    []
  );

  return (
    <section id="services" className="py-20 bg-gray-50 dark:bg-gray-800">
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
            {serviceContent.heading.split(" ")[0]}{" "}
            <span className="text-orange-400">
              {serviceContent.heading.split(" ").slice(1).join(" ")}
            </span>
          </h2>
          <p className="max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-400">
            {serviceContent.description}
          </p>
        </motion.div>

        {/* Services Grid or Empty State */}
        {serviceContent.services.length === 0 ? (
          <div className="py-20 text-center">
            <p className="mb-4 text-lg text-gray-500 dark:text-gray-400">
              No services available yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 mb-16 md:grid-cols-2 lg:grid-cols-3">
            {serviceContent.services.map((service, index) => {
              const IconComponent =
                availableIcons[service.icon as keyof typeof availableIcons] ||
                Code;

              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.06 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  onHoverStart={() => setHoveredService(service.id)}
                  onHoverEnd={() => setHoveredService(null)}
                  className="relative p-8 transition-all duration-300 bg-white border border-gray-100 shadow-xl rounded-2xl group dark:bg-gray-900 hover:shadow-2xl dark:border-gray-800"
                >
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${service.color} mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
                    {service.title}
                  </h3>

                  <motion.p
                    layout
                    className="mb-6 leading-relaxed text-gray-600 transition-all duration-300 dark:text-gray-400"
                  >
                    {hoveredService === service.id
                      ? service.fullDescription
                      : service.shortDescription}
                  </motion.p>

                  <ul className="mb-6 space-y-2">
                    {service.features.map((feature, idx) => (
                      <motion.li
                        key={`${service.id}-feat-${idx}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={
                          hoveredService === service.id
                            ? { opacity: 1, x: 0 }
                            : { opacity: 0.9, x: 0 }
                        }
                        transition={{
                          delay:
                            hoveredService === service.id
                              ? idx * 0.06
                              : 0,
                        }}
                        className="flex items-center text-sm text-gray-600 dark:text-gray-400"
                      >
                        <Check className="flex-shrink-0 w-4 h-4 mr-2 text-green-500" />
                        {feature}
                      </motion.li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between p-4 mb-6 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Pricing
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

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full bg-orange-400 ${service.color} text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg`}
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </motion.button>

                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${service.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}
                  />
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Service;