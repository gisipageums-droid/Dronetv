import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion"; // ✅ fixed import
import { Star, CheckCircle, X } from "lucide-react";

// Custom Card Components
const Card = ({ children, className = "" }) => (
  <div className={`bg-surface-card rounded-xl shadow-md overflow-hidden ${className}`}>
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
      type="button"
      onClick={onClick}
      className={`font-medium rounded-lg transition-all duration-200 bg-brand-yellow text-ink hover:bg-brand-gold shadow-sm hover:shadow-md ${sizeClasses[size]} ${className}`}
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
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.overflow = 'hidden';
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
  };

  const closeModal = () => {
    document.documentElement.style.overflow = '';
    document.body.style.paddingRight = '';
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return content.products && content.products.length > 0 && (
    <section
      id="product"
      ref={sectionRef}
      className="py-20 bg-gradient-to-b from-ink-offwhite to-white scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 bg-brand-yellow-soft text-brand-gold rounded-full text-sm font-medium mb-4">
            Our Products
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-ink mb-3">
            {content.sectionTitle}
          </h2>
          <h3 className="text-2xl font-semibold text-ink-paragraph mb-4">
            {content.sectionSubtitle}
          </h3>
          <p className="text-lg text-ink-paragraph max-w-3xl mx-auto ">
            {content.sectionDescription}
            {content.trustText && (
              <span className="font-bold text-brand-gold">
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
                ? "bg-brand-yellow text-ink shadow-lg scale-105"
                : "bg-surface-card text-ink-paragraph hover:bg-ink-offwhite shadow-md hover:shadow-lg"
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
                    <Badge className="bg-brand-yellow text-ink shadow-md">
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
                          "bg-ink-light text-ink-paragraph"
                          }`}
                      >
                        {product.category}
                      </Badge>
                    </div>

                    <h3 className="text-xl text-center font-bold text-ink mb-3">
                      {product.title}
                    </h3>

                    <p className="text-ink-paragraph text-sm mb-4 flex-1">
                      {product.description
                        // ? product.description.slice(0, 30) + "..."
                        ? product.description : ""}
                    </p>



                     {product.features && product.features.length > 0 && (
      <div className="mb-4">
        <h4 className="font-semibold mb-2 text-sm text-ink-paragraph">Key Features:</h4>
        <ul className="text-xs text-ink-paragraph space-y-1">
          {product.features.slice(0, 3).map((feature, idx) => (
            <li key={idx} className="flex items-start">
              <div className="w-1.5 h-1.5 bg-brand-yellow rounded-full mr-2 mt-1 flex-shrink-0"></div>
              <span>{feature}</span>
            </li>
          ))}
          {product.features.length > 3 && (
            <li className="text-xs text-ink-caption italic">
              + {product.features.length - 3} more features...
            </li>
          )}
        </ul>
      </div>
    )}





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
      className="fixed inset-0 bg-ink/60 backdrop-blur-sm flex items-center justify-center p-4 z-[99999999]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={closeModal}
    >
      <motion.div
        className="bg-surface-card rounded-xl w-full max-w-4xl max-h-[85vh] overflow-hidden shadow-xl flex flex-col"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button — outside overflow-hidden image div so it's never clipped */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); closeModal(); }}
          className="absolute top-3 right-3 bg-surface-card rounded-full p-2.5 shadow-lg z-20"
          aria-label="Close modal"
          style={{ minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <X className="w-5 h-5 text-ink" />
        </button>

        {/* Modal Header with Image */}
        <div className="relative h-32 sm:h-36 overflow-hidden flex-shrink-0">
          <img
            src={selectedProduct.image}
            alt={selectedProduct.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent"></div>
          <div className="absolute bottom-2 left-3 right-3">
            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
              <Badge
                className={`text-xs ${selectedProduct.categoryColor ||
                  "bg-brand-yellow text-ink"
                  }`}
              >
                {selectedProduct.category}
              </Badge>
              {selectedProduct.isPopular && (
                <Badge className="bg-brand-yellow text-ink text-xs">
                  <Star className="w-2.5 h-2.5 mr-0.5" fill="currentColor" />
                  Popular
                </Badge>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white leading-tight line-clamp-2">
              {selectedProduct.title}
            </h2>
          </div>
        </div>

        {/* Modal Content - Compact */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4">
          <div className="mb-3">
            <h3 className="text-base font-bold text-ink mb-2">
              About This Product
            </h3>
            <p className="text-ink-paragraph text-sm leading-relaxed mb-3 line-clamp-3">
              {selectedProduct.detailedDescription ||
                selectedProduct.description}
            </p>
          </div>

          {selectedProduct.features?.length > 0 && (
            <div className="mb-3">
              <h3 className="text-base font-bold text-ink mb-2 flex items-center gap-1.5">
                <span className="text-brand-gold text-sm">✨</span> Features
              </h3>
              <div className="space-y-1.5">
                {selectedProduct.features.slice(0, 4).map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex gap-2 items-start"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-brand-gold mt-0.5 flex-shrink-0" />
                    <span className="text-ink-paragraph text-xs sm:text-sm">
                      {feature}
                    </span>
                  </div>
                ))}
                {selectedProduct.features.length > 4 && (
                  <div className="text-xs text-ink-caption italic ml-5.5">
                    + {selectedProduct.features.length - 4} more features
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedProduct.specifications && (
            <div className="mb-3">
              <h3 className="text-base font-bold text-ink mb-2 flex items-center gap-1.5">
                <span className="text-status-info text-sm">📋</span> Specifications
              </h3>
              <div className="bg-status-info/10 rounded-lg p-3">
                <div className="space-y-1.5">
                  {Object.entries(selectedProduct.specifications).slice(0, 3).map(
                    ([key, value], idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center"
                      >
                        <span className="font-medium text-ink-paragraph text-xs sm:text-sm">
                          {key}:
                        </span>
                        <span className="text-ink text-xs sm:text-sm">
                          {value}
                        </span>
                      </div>
                    )
                  )}
                  {Object.entries(selectedProduct.specifications).length > 3 && (
                    <div className="text-xs text-ink-caption italic text-center pt-1">
                      + {Object.entries(selectedProduct.specifications).length - 3} more specs
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 mb-4">
            {selectedProduct.pricing && (
              <div className="bg-gradient-to-br from-status-success/10 to-status-success/10 p-2.5 rounded-lg border border-status-success/25">
                <h3 className="font-bold text-ink mb-1 flex items-center gap-1 text-xs sm:text-sm">
                  <span className="text-status-success">💰</span> Price
                </h3>
                <p className="text-ink text-sm font-bold truncate">
                  {selectedProduct.pricing}
                </p>
              </div>
            )}
            {selectedProduct.timeline && (
              <div className="bg-gradient-to-br from-brand-gold/10 to-status-error/10 p-2.5 rounded-lg border border-brand-gold/25">
                <h3 className="font-bold text-ink mb-1 flex items-center gap-1 text-xs sm:text-sm">
                  <span className="text-brand-gold">⏱️</span> Delivery
                </h3>
                <p className="text-ink text-sm font-bold truncate">
                  {selectedProduct.timeline}
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-center pt-2 border-t border-ink-light">
            <Button 
              onClick={closeModal} 
              className="px-4 py-1.5 text-sm"
              size="sm"
            >
              Close
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
