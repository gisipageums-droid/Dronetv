const decodeHTML = (str: string): string => {
  if (!str) return '';
  const txt = document.createElement('textarea');
  txt.innerHTML = str;
  return txt.value;
};

const isCleanTitle = (title: string): boolean =>
  !!title?.trim() && !/^\s*'\s*\+|\+\s*'\s*$|\$el\.|outerHTML|\.prop\s*\(|\beval\b/i.test(title);

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

  const filteredServices = (
    activeCategory === "All"
      ? serviceData.services
      : serviceData.services.filter((s) => s.category === activeCategory)
  ).filter((s) => isCleanTitle(s.title));

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
      {(hasServices || hasHeading) && (
        <motion.section id="services" className="py-20 bg-background theme-transition">
          <div className="max-w-7xl mx-auto px-4">
            {/* Header */}
            <div className="text-center mb-8">
              {serviceData.heading.head && serviceData.heading.head.length > 0 && (
                <h2 className="text-3xl font-bold">{serviceData.heading.head}</h2>
              )}
              {serviceData.heading.desc && serviceData.heading.desc.length > 0 && (
                <p className="text-muted-foreground text-center">{serviceData.heading.desc}</p>
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
                  <Card key={index} className="relative flex flex-col h-full border-2 shadow-lg hover:shadow-xl shadow-gray-500">
                    <div className="h-40 overflow-hidden relative flex-shrink-0" style={{ background: 'linear-gradient(135deg, #fb923c 0%, #c2410c 100%)' }}>
                      {service.image && /^https?:\/\//.test(service.image) ? (
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="1.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                            </svg>
                          </div>
                          <span style={{ color: 'white', fontWeight: 600, fontSize: 12, textAlign: 'center', padding: '0 8px' }}>{service.category || 'Service'}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col flex-grow p-6">
                      <div className="flex-shrink-0 mb-4">
                        <CardTitle className="line-clamp-2 min-h-[3rem]">{decodeHTML(service.title)}</CardTitle>
                      </div>
                      <div className="flex-grow mb-4">
                        <p className="text-sm text-muted-foreground line-clamp-3 min-h-[4rem] text-justify">
                          {decodeHTML(service.description)}
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

          {/* Modal - REDUCED SIZE */}
          <AnimatePresence>
            {isModalOpen && selectedServiceIndex !== null && (
              <motion.div
                className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[99999999999999]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeModal}
              >
                <motion.div
                  className="bg-card rounded-xl w-full max-w-2xl p-6 relative max-h-[70vh] overflow-y-auto"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ type: "spring", damping: 25 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={closeModal}
                    className="absolute top-3 right-3 bg-gray-500 hover:bg-gray-600 rounded-full p-1.5 transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>

                  <div className="space-y-4">
                    {/* Title */}
                    <h2 className="text-xl font-bold pr-8">
                      {serviceData.services[selectedServiceIndex].title}
                    </h2>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed text-justify">
                      {serviceData.services[selectedServiceIndex].detailedDescription}
                    </p>

                    {/* Benefits */}
                    <div>
                      <h3 className="font-semibold text-sm mb-2">Key Benefits</h3>
                      <ul className="space-y-1.5">
                        {serviceData.services[selectedServiceIndex].benefits.map((b, bi) => (
                          <li key={bi} className="flex gap-2 text-sm">
                            <CheckCircle className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="leading-tight text-justify">{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Process */}
                    <div>
                      <h3 className="font-semibold text-sm mb-2">Our Process</h3>
                      <ol className="space-y-1.5 text-sm">
                        {serviceData.services[selectedServiceIndex].process.map((p, pi) => (
                          <li key={pi} className="leading-tight text-justify">
                            <span className="font-medium mr-2">{pi + 1}.</span>
                            {p}
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Pricing & Timeline */}
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      {serviceData.services[selectedServiceIndex].pricing && serviceData.services[selectedServiceIndex].pricing.trim().length > 0 &&(
                      <div>
                        <h3 className="font-semibold text-sm mb-1">Pricing</h3>
                        <p className="text-sm text-justify">{serviceData.services[selectedServiceIndex].pricing}</p>
                      </div>)}
                      {serviceData.services[selectedServiceIndex].timeline && serviceData.services[selectedServiceIndex].timeline.trim().length > 0 &&(
                      <div>
                        <h3 className="font-semibold text-sm mb-1">Timeline</h3>
                        <p className="text-sm text-justify">{serviceData.services[selectedServiceIndex].timeline}</p>
                      </div>)}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      )}
    </>
  );
}