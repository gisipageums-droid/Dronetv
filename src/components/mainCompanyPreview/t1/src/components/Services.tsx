import { useState, useRef } from "react";
import { CheckCircle, X } from "lucide-react";
import { motion, AnimatePresence, useInView } from "motion/react";

const decodeHTML = (str: string): string => {
  if (!str) return '';
  const txt = document.createElement('textarea');
  txt.innerHTML = str;
  return txt.value;
};

const isCleanTitle = (title: string): boolean =>
  !!title?.trim() && !/^\s*'\s*\+|\+\s*'\s*$|\$el\.|outerHTML|\.prop\s*\(|\beval\b/i.test(title);

// Custom Card Components
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-md overflow-hidden ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }) => <div className="p-6 pb-3">{children}</div>;

const CardTitle = ({ children }) => (
  <h3 className="text-xl font-bold text-center text-gray-900">{children}</h3>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`px-6 pb-6 ${className}`}>{children}</div>
);

// Custom Button Component
const Button = ({
  children,
  onClick,
  className = "",
  variant = "primary",
  size = "md",
}) => {
  const baseClasses =
    "font-medium rounded-lg transition-all duration-200 inline-flex items-center justify-center";
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-2.5 text-base",
  };
  const variantClasses = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default function Services({ serviceData }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Filter services based on active category
  const filteredServices = (
    activeCategory === "All"
      ? serviceData.services
      : serviceData.services.filter((s) => s.category === activeCategory)
  ).filter((s) => isCleanTitle(s.title));

  const visibleServices = filteredServices.slice(0, visibleCount);

  const openModal = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.dataset.scrollY = String(scrollY);
  };

  const closeModal = () => {
    const scrollY = parseInt(document.body.dataset.scrollY || '0');
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, scrollY);
    setIsModalOpen(false);
    setSelectedService(null);
  };

  return serviceData.services && serviceData.services.length > 0 && (
    <section
      id="services"
      ref={sectionRef}
      className="py-20 bg-gradient-to-b from-blue-50 to-white scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
            Our Services
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {serviceData.heading.head}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto ">
            {serviceData.heading.desc}
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {serviceData.categories.map((cat, i) => (
            <button
              key={i}
              onClick={() => {
                setActiveCategory(cat);
                setVisibleCount(6);
              }}
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${activeCategory === cat
                  ? "bg-orange-400 text-white shadow-lg scale-105"
                  : "bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg"
                }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleServices.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <Card className="h-full flex flex-col hover:shadow-xl transition-shadow duration-300 group">
                <div className="h-48 overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #fb923c 0%, #c2410c 100%)' }}>
                  {service.image && /^https?:\/\//.test(service.image) ? (
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                      <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                        </svg>
                      </div>
                      <span style={{ color: 'white', fontWeight: 600, fontSize: 13, textAlign: 'center', padding: '0 12px' }}>{service.category || 'Service'}</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 bg-orange-400 text-white text-xs font-medium rounded-full">
                      {service.category}
                    </span>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>{decodeHTML(service.title)}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-sm text-gray-600 mb-4 flex-1 line-clamp-3 text-justify">
                    {decodeHTML(service.description)}
                  </p>

                  <Button
                    size="sm"
                    onClick={() => openModal(service)}
                    className="w-full hover:scale-105 bg-orange-400 hover:bg-orange-600"
                  >
                    View Details →
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Load More & Show Less */}
        {filteredServices.length > 6 && (
          <div className="flex justify-center gap-4 mt-12">
            {visibleCount < filteredServices.length && (
              <Button onClick={() => setVisibleCount((prev) => prev + 6)}>
                Load More Services
              </Button>
            )}
            {visibleCount > 6 && (
              <Button onClick={() => setVisibleCount(6)} variant="secondary">
                Show Less
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && selectedService && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[99999999]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header with Image */}
              <div className="relative h-64 overflow-hidden" style={{ background: 'linear-gradient(135deg, #fb923c 0%, #c2410c 100%)' }}>
                {selectedService.image && /^https?:\/\//.test(selectedService.image) && (
                  <img
                    src={selectedService.image}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-2 transition-colors shadow-lg"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 text-gray-900" />
                </button>
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full mb-3">
                    {selectedService.category}
                  </span>
                  <h2 className="text-3xl font-bold text-white">
                    {selectedService.title}
                  </h2>
                </div>
              </div>

              {/* Modal Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-16rem)] p-8">
                {/* Description */}
                <div className="mb-8">
                  <p className="text-gray-700 text-lg leading-relaxed text-justify">
                    {selectedService.detailedDescription ||
                      selectedService.description}
                  </p>
                </div>

                {/* Key Benefits */}
                {selectedService.benefits &&
                  selectedService.benefits.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="text-green-600">✓</span> Key Benefits
                      </h3>
                      <div className="grid md:grid-cols-2 gap-3">
                        {selectedService.benefits.map((benefit, bi) => (
                          <div
                            key={bi}
                            className="flex gap-3 items-start bg-green-50 p-4 rounded-lg"
                          >
                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 text-justify">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Process */}
                {selectedService.process &&
                  selectedService.process.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="text-blue-600">⚙️</span> Our Process
                      </h3>
                      <div className="space-y-4">
                        {selectedService.process.map((step, pi) => (
                          <div
                            key={pi}
                            className="flex gap-4 items-start bg-blue-50 p-4 rounded-lg"
                          >
                            <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                              {pi + 1}
                            </span>
                            <span className="text-gray-700 pt-1 text-justify">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Pricing & Timeline */}
                <div className="grid md:grid-cols-2 gap-6">
                  {selectedService.pricing && (
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl border border-orange-200">
                      <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <span className="text-yellow-600">💰</span> Pricing
                      </h3>
                      <p className="text-gray-700 text-lg font-semibold text-justify">
                        {selectedService.pricing}
                      </p>
                    </div>
                  )}
                  {selectedService.timeline && (
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                      <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <span className="text-purple-600">⏱️</span> Timeline
                      </h3>
                      <p className="text-gray-700 text-lg font-semibold text-justify">
                        {selectedService.timeline}
                      </p>
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <div className="mt-8 flex justify-center">
                  <Button onClick={closeModal} className="px-8">
                    Got it, thanks!
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
