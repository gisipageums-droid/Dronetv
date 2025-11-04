import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Zap, X } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

export default function Product({ productData }) {
  const [visibleCount, setVisibleCount] = useState(4);
  const [selectedProductIndex, setSelectedProductIndex] = useState<
    number | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (index) => {
    setSelectedProductIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProductIndex(null);
  };

  // Check if all productData values are empty
  const hasHeading = (productData.heading.title.length > 0) ||
                     (productData.heading.heading.length > 0) ||
                     (productData.heading.description.length > 0) ||
                     (productData.heading.trust.length > 0);
  const hasBenefits = productData.benefits && productData.benefits.length > 0;
  const hasProducts = productData.products && productData.products.length > 0;
// console.log(hasProducts);


  return (
    <>
    {(hasHeading || hasProducts )&&(
    <motion.section
      id="product"
      className="py-20 bg-secondary theme-transition"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          {productData.heading.title && productData.heading.title.length > 0 && (
            <div className="inline-flex items-center px-4 py-2 bg-red-accent/10 rounded-full text-red-accent mb-4">
              <Zap className="w-4 h-4 mr-2" />
              <span className="font-medium">{productData.heading.title}</span>
            </div>
          )}
          {productData.heading.heading && productData.heading.heading.length > 0 && (
            <h2 className="text-3xl md:text-4xl text-foreground mb-4">
              {productData.heading.heading}
            </h2>
          )}
          {productData.heading.description && productData.heading.description.length > 0 && (
            <p className="text-lg text-muted-foreground inline">
              {productData.heading.description}
            </p>
          )}
          {productData.heading.trust && productData.heading.trust.length > 0 && (
            <p className="text-lg text-muted-foreground inline font-bold text-foreground">
              {" "}
              {productData.heading.trust}
            </p>
          )}
        </div>

        {/* Products Grid */}
        {hasProducts && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {productData.products.slice(0, visibleCount).map((product, index) => (
              <Card
                key={index}
                className="group h-full relative overflow-hidden flex flex-col border-2 shadow-lg hover:shadow-xl  shadow-gray-500"
              >
                <div className="relative h-32 overflow-hidden flex-shrink-0">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute top-2 left-2">
                    <Badge
                      className={`${product.categoryColor} border-0 text-xs`}
                    >
                      {product.category}
                    </Badge>
                  </div>
                  {product.isPopular && (
                    <div className="absolute top-2 right-2 bg-red-accent text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                      <Zap className="w-2 h-2 mr-1" /> Bestseller
                    </div>
                  )}
                </div>
                <div className="flex flex-col flex-grow p-6">
                  <div className="flex-shrink-0 mb-4">
                    <CardTitle className="line-clamp-2 min-h-[3rem]">
                      {product.title}
                    </CardTitle>
                  </div>
                  <div className="flex-grow mb-4">
                    <p className="text-sm text-muted-foreground line-clamp-3 min-h-[4rem]">
                      {product.description}
                    </p>
                    <ul className="space-y-1 mt-3 min-h-[3rem]">
                      {product.features.map((f, fi) => (
                        <li
                          key={fi}
                          className="text-xs text-muted-foreground flex items-center"
                        >
                          <div className="w-1 h-1 bg-primary rounded-full mr-2 flex-shrink-0" />
                          <span className="line-clamp-1">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-auto">
                    <Button
                      size="sm"
                      className="hover:scale-105 w-full"
                      onClick={() => openModal(index)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Load More / Show Less */}
        {hasProducts && (
          <div className="flex justify-center mt-6">
            {visibleCount < productData.products.length && (
              <Button onClick={() => setVisibleCount((prev) => prev + 4)}>
                Load More
              </Button>
            )}
            {visibleCount >= productData.products.length &&
              productData.products.length > 4 && (
                <Button
                  onClick={() => setVisibleCount(4)}
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
        {isModalOpen && selectedProductIndex !== null && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <div
              className="bg-card rounded-xl w-full max-w-3xl p-6 relative overflow-y-auto max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-white rounded-full p-2"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-2xl font-bold mb-4">
                {productData.products[selectedProductIndex].title}
              </h2>

              <p className="text-muted-foreground mb-4">
                {productData.products[selectedProductIndex].detailedDescription}
              </p>

              {/* Pricing & Timeline */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Pricing</h3>
                  <p>{productData.products[selectedProductIndex].pricing}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Timeline</h3>
                  <p>{productData.products[selectedProductIndex].timeline}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>)}
      </>
  );
}
