import { useState } from "react";
import { Card, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { X, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Services({ serviceData }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedServiceIndex, setSelectedServiceIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);

  const filteredServices =
    activeCategory === "All"
      ? serviceData.services
      : serviceData.services.filter((s) => s.category === activeCategory);

  const visibleServices = filteredServices.slice(0, visibleCount);

  // Check if all serviceData values are empty
  const hasHeading = (serviceData.heading?.head && serviceData.heading.head.length > 0) || 
                     (serviceData.heading?.desc && serviceData.heading.desc.length > 0);
  const hasCategories = serviceData.categories && serviceData.categories.length > 0 && 
                        serviceData.categories.some(cat => cat && cat.length > 0);
  const hasServices = serviceData.services && serviceData.services.length > 0;

  // Return null if no content exists
  if (!hasHeading && !hasCategories && !hasServices) {
    return null;
  }

  const openModal = (index) => {
    setSelectedServiceIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedServiceIndex(null);
  };

  return (
    <>
      {(hasServices||hasHeading)&& (
        <motion.section id="services" className="py-20 bg-background theme-transition">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          {serviceData.heading.head && serviceData.heading.head.length > 0 && (
            <h2 className="text-3xl font-bold">{serviceData.heading.head}</h2>
          )}
          {serviceData.heading.desc && serviceData.heading.desc.length > 0 && (
            <p className="text-muted-foreground">{serviceData.heading.desc}</p>
          )}
        </div>

        {/* Filter */}
        {serviceData.categories && serviceData.categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {serviceData.categories.map((cat, i) => (
              <Button
                key={i}
                onClick={() => {
                  setActiveCategory(cat);
                  setVisibleCount(6);
                }}
                className={
                  activeCategory === cat
                    ? "bg-primary cursor-pointer text-white"
                    : "bg-card text-card-foreground cursor-pointer"
                }
              >
                {cat}
              </Button>
            ))}
          </div>
        )}

        {/* Services Grid */}
        {visibleServices.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleServices.map((service, index) => (
              <Card key={index} className="relative flex flex-col h-full border-2 shadow-lg hover:shadow-xl  shadow-gray-500">
                <div className="h-40 overflow-hidden relative flex-shrink-0">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col flex-grow p-6">
                  <div className="flex-shrink-0 mb-4">
                    <CardTitle className="line-clamp-2 min-h-[3rem]">{service.title}</CardTitle>
                  </div>
                  <div className="flex-grow mb-4">
                    <p className="text-sm text-muted-foreground line-clamp-3 min-h-[4rem]">
                      {service.description}
                    </p>
                    <p className="text-xs mt-1 italic text-gray-500">
                      Category: {service.category}
                    </p>
                  </div>
                  <div className="mt-auto">
                    <Button className="cursor-pointer hover:scale-105 w-full" size="sm" onClick={() => openModal(index)}>
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Load More & Show Less */}
        {visibleServices.length > 0 && (
          <div className="flex justify-center mt-6">
            {visibleCount < filteredServices.length && (
              <Button onClick={() => setVisibleCount((prev) => prev + 6)}>
                Load More
              </Button>
            )}
            {visibleCount >= filteredServices.length && filteredServices.length > 3 && (
              <Button
                onClick={() => setVisibleCount(3)}
                variant="secondary"
                className="ml-4"
              >
                Show Less
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && selectedServiceIndex !== null && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <div
              className="bg-card rounded-xl w-full max-w-3xl p-6 relative top-16 h-180 z-100 overflow-y-auto max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-gray-500 rounded-full p-2"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-2xl font-bold mb-4">{serviceData.services[selectedServiceIndex].title}</h2>
              <p className="text-muted-foreground mb-4">
                {serviceData.services[selectedServiceIndex].detailedDescription}
              </p>

              {/* Benefits */}
              <h3 className="font-semibold mb-2">Key Benefits</h3>
              <ul className="space-y-2 mb-4">
                {serviceData.services[selectedServiceIndex].benefits.map((b, bi) => (
                  <li key={bi} className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              {/* Process */}
              <h3 className="font-semibold mb-2">Our Process</h3>
              <ol className="space-y-2 mb-4">
                {serviceData.services[selectedServiceIndex].process.map((p, pi) => (
                  <li key={pi}>
                    <span>{p}</span>
                  </li>
                ))}
              </ol>

              {/* Pricing & Timeline */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Pricing</h3>
                  <p>{serviceData.services[selectedServiceIndex].pricing}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Timeline</h3>
                  <p>{serviceData.services[selectedServiceIndex].timeline}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
        </motion.section>
      )}
    </>
  );
}