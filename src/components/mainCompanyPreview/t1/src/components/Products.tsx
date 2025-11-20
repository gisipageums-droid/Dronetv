import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion"; // ✅ fixed import
import { Star, CheckCircle, X } from "lucide-react";

// Custom Card Components
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-md overflow-hidden ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={className}>{children}</div>
);

// Custom Badge Component
const Badge = ({ children, className = "" }) => (
  <span
    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${className}`}
  >
    {children}
  </span>
);

// Custom Button Component
const Button = ({ children, onClick, className = "", size = "md" }) => {
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-2.5 text-base",
  };

  return (
    <button
      onClick={onClick}
      className={`font-medium rounded-lg transition-all duration-200 bg-yellow-400 text-gray-900 hover:bg-yellow-500 shadow-sm hover:shadow-md ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
};

export default function Products({ productData }) {
  const [selected, setSelected] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // ✅ Fix: Safe data extraction (in case heading not defined)
  const content = {
    sectionTitle:
      productData?.heading?.title ||
      productData?.sectionTitle ||
      "Products",
    sectionSubtitle:
      productData?.heading?.heading ||
      productData?.sectionSubtitle ||
      "Our Products",
    sectionDescription:
      productData?.heading?.description ||
      productData?.sectionDescription ||
      "",
    trustText: productData?.heading?.trust || productData?.trustText || "",
    products: productData?.products || [],
    categories: [
      "All",
      ...(productData?.products
        ? new Set(productData.products.map((p) => p.category))
        : []),
    ],
    benefits: productData?.benefits || [],
  };

  const filtered =
    selected === "All"
      ? content.products
      : content.products.filter((p) => p.category === selected);

  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    document.body.style.overflow = "unset";
  };

  return content.products && content.products.length > 0 && (
    <section
      id="product"
      ref={sectionRef}
      className="py-20 bg-gradient-to-b from-gray-50 to-white scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium mb-4">
            Our Products
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            {content.sectionTitle}
          </h2>
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">
            {content.sectionSubtitle}
          </h3>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto text-justify">
            {content.sectionDescription}
            {content.trustText && (
              <span className="font-bold text-yellow-600">
                {" "}
                {content.trustText}
              </span>
            )}
          </p>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex gap-3 justify-center mb-12 flex-wrap"
        >
          {content.categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelected(cat)}
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${selected === cat
                  ? "bg-yellow-400 text-gray-900 shadow-lg scale-105"
                  : "bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg"
                }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {filtered.map((product, index) => (
            <motion.div
              key={product.id || index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <Card className="h-full flex flex-col hover:shadow-xl transition-all duration-300 group relative">
                {product.isPopular && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-yellow-400 text-gray-900 shadow-md">
                      <Star className="w-3 h-3 mr-1" fill="currentColor" />
                      Popular
                    </Badge>
                  </div>
                )}

                <CardContent className="p-0 flex flex-col h-full">
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <div className="mb-3">
                      <Badge
                        className={`${product.categoryColor ||
                          "bg-gray-100 text-gray-700"
                          }`}
                      >
                        {product.category}
                      </Badge>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {product.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 flex-1 text-justify">
                      {product.description
                        ? product.description.slice(0, 30) + "..."
                        : ""}
                    </p>

                    <Button
                      size="sm"
                      className="w-full hover:scale-105"
                      onClick={() => openModal(product)}
                    >
                      View Details →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && selectedProduct && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
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
              <div className="relative h-64 overflow-hidden">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-2 transition-colors shadow-lg"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 text-gray-900" />
                </button>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge
                      className={`${selectedProduct.categoryColor ||
                        "bg-yellow-400 text-gray-900"
                        }`}
                    >
                      {selectedProduct.category}
                    </Badge>
                    {selectedProduct.isPopular && (
                      <Badge className="bg-yellow-400 text-gray-900">
                        <Star className="w-3 h-3 mr-1" fill="currentColor" />
                        Popular
                      </Badge>
                    )}
                  </div>
                  <h2 className="text-3xl font-bold text-white">
                    {selectedProduct.title}
                  </h2>
                </div>
              </div>

              {/* Modal Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-16rem)] p-8">
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    About This Product
                  </h3>
                  <p className="text-gray-700 text-base leading-relaxed mb-4 text-justify">
                    {selectedProduct.detailedDescription ||
                      selectedProduct.description}
                  </p>
                </div>

                {selectedProduct.features?.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="text-yellow-600">✨</span> All Features
                    </h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {selectedProduct.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex gap-3 items-start bg-yellow-50 p-4 rounded-lg"
                        >
                          <CheckCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedProduct.specifications && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="text-blue-600">📋</span> Specifications
                    </h3>
                    <div className="bg-blue-50 rounded-xl p-6">
                      <div className="space-y-3">
                        {Object.entries(selectedProduct.specifications).map(
                          ([key, value], idx) => (
                            <div
                              key={idx}
                              className="flex justify-between items-center border-b border-blue-100 pb-2 last:border-0"
                            >
                              <span className="font-medium text-gray-700">
                                {key}:
                              </span>
                              <span className="text-gray-900">{value}</span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {selectedProduct.pricing && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                      <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <span className="text-green-600">💰</span> Pricing
                      </h3>
                      <p className="text-gray-900 text-xl font-bold text-justify">
                        {selectedProduct.pricing}
                      </p>
                    </div>
                  )}
                  {selectedProduct.timeline && (
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                      <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <span className="text-purple-600">⏱️</span> Delivery
                        Timeline
                      </h3>
                      <p className="text-gray-900 text-xl font-bold text-justify">
                        {selectedProduct.timeline}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-center gap-4">
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
