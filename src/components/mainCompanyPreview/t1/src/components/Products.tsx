import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

export default function Products({ productData, publishedId }) {
  const [selected, setSelected] = useState("All");
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const navigate = useNavigate();

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
        ? new Set(productData.products.map((p) => p.category).filter(Boolean))
        : []),
    ],
    benefits: productData?.benefits || [],
  };

  // Each product's index in the ORIGINAL (unfiltered) array is kept as _idx
  // so the id matches the `${publishedId}-${idx}` scheme the marketplace
  // listing (ProductsPageV2.tsx) already uses for the same records — the
  // filtered position would not line up with that scheme.
  const productsWithIndex = content.products.map((p, idx) => ({ ...p, _idx: idx }));
  const filtered =
    selected === "All"
      ? productsWithIndex
      : productsWithIndex.filter((p) => p.category === selected);

  const goToDetails = (product) => {
    navigate(`/product/${publishedId}-${product._idx}`);
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
                    <img referrerPolicy="no-referrer"
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
                      onClick={() => goToDetails(product)}
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

    </section>
  );
}
