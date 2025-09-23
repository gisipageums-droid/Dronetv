import { motion, useMotionValue } from "framer-motion";
import { Star, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

export default function Products({ productData }) {
  const [selected, setSelected] = useState("All");
  const [selectedProductIndex, setSelectedProductIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const sectionRef = useRef(null);

  // Auto-scroll animation values
  const x = useMotionValue(0);
  const speed = 0.5;

  // Extract data from productData prop
  const content = {
    sectionTitle: productData.heading.title,
    sectionSubtitle: productData.heading.heading,
    sectionDescription: productData.heading.description,
    trustText: productData.heading.trust,
    products: productData.products,
    categories: ["All", ...new Set(productData.products.map((p) => p.category))],
    benefits: productData.benefits || [],
  };

  const filtered = selected === "All"
    ? content.products
    : content.products.filter((p) => p.category === selected);

  // Duplicate products for seamless auto-scroll
  const duplicatedProducts = showAll ? filtered : [...filtered, ...filtered];

  // Auto-scroll animation effect
  useEffect(() => {
    if (showAll) return; // stop animation if showing all in grid
    
    let animationFrame;

    const animate = () => {
      if (!isHovered) {
        x.set(x.get() - speed);
        // Reset to 0 if fully scrolled (duplicate loop)
        const productWidth = 320; // approximate card width
        if (Math.abs(x.get()) >= (filtered.length / 2) * productWidth) x.set(0);
      }
      animationFrame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [isHovered, x, filtered.length, showAll]);

  const openModal = (index) => {
    setSelectedProductIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProductIndex(null);
  };

  const renderBenefits = () => {
    if (!content.benefits || content.benefits.length === 0) return null;

    return (
      <div className='mt-16 grid grid-cols-1 md:grid-cols-3 gap-8'>
        {content.benefits.map((benefit, index) => (
          <div
            key={index}
            className='text-center p-6 bg-white rounded-lg shadow-sm'
          >
            <div
              className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 text-2xl font-bold
                ${
                  benefit.color === "red-accent"
                    ? "bg-red-100 text-red-600"
                    : benefit.color === "primary"
                    ? "bg-yellow-100 text-yellow-400"
                    : "bg-yellow-100 text-yellow-400"
                }`}
            >
              {benefit.icon}
            </div>
            <h4 className='font-semibold text-lg mb-2'>{benefit.title}</h4>
            <p className='text-gray-600 text-sm'>{benefit.desc}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <section
      id="product"    
      ref={sectionRef}
      className='max-w-7xl mx-auto py-20 bg-gray-50 relative overflow-hidden'
    >
      <div className='container mx-auto px-4'>
        <div className='flex justify-between items-center mb-8'>
          <div>
            <h2 className='text-4xl font-bold mb-2'>
              {content.sectionTitle}
            </h2>
            <h3 className='text-2xl font-semibold mb-2'>
              {content.sectionSubtitle}
            </h3>
            <p className='text-gray-600'>
              {content.sectionDescription}
              {content.trustText && (
                <span className='font-semibold text-yellow-400'>
                  {" "}
                  {content.trustText}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Categories */}
        <div className='flex gap-4 justify-center mt-6 flex-wrap mb-16'>
          {content.categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelected(cat);
                setShowAll(false);
              }}
              className={`px-6 py-2 rounded-full transition-colors ${
                selected === cat
                  ? "bg-yellow-400 text-gray-900"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Display */}
      <div className='container mx-auto px-4'>
        {showAll ? (
          // Grid view when "show all" is enabled
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {filtered.map((product, index) => (
              <Card
                key={product.id}
                className='shadow-md rounded-xl overflow-hidden relative bg-white hover:shadow-lg transition-shadow duration-300'
              >
                {product.isPopular && (
                  <div className='absolute top-4 right-4 z-10'>
                    <Badge className='bg-yellow-400 text-white'>
                      <Star className='w-3 h-3 mr-1' fill='currentColor' />
                      Popular
                    </Badge>
                  </div>
                )}

                <CardContent className='p-0'>
                  <div className='relative'>
                    <img
                      src={product.image}
                      alt={product.title}
                      className='w-full h-48 object-cover'
                    />
                  </div>

                  <div className='p-6'>
                    <div className='flex items-center justify-between mb-3'>
                      <Badge className={product.categoryColor}>
                        {product.category}
                      </Badge>
                    </div>

                    <h3 className='text-xl font-bold mb-3'>
                      {product.title}
                    </h3>

                    <p className='text-gray-600 mb-4'>
                      {product.description}
                    </p>

                    {product.features && product.features.length > 0 && (
                      <div className='mb-4'>
                        <h4 className='font-semibold mb-2 text-sm'>
                          Features:
                        </h4>
                        <ul className='text-sm text-gray-600 space-y-1'>
                          {product.features.map((feature, idx) => (
                            <li key={idx} className='flex items-center'>
                              <div className='w-1.5 h-1.5 bg-yellow-400 rounded-full mr-2 flex-shrink-0'></div>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <Button 
                      size="sm" 
                      className="hover:scale-105" 
                      onClick={() => openModal(index)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          // Auto-scroll view
          <div
            className='overflow-x-hidden'
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <motion.div className='flex gap-6' style={{ x }}>
              {duplicatedProducts.map((product, i) => (
                <Card
                  key={`${product.id}-${i}`}
                  className='group flex-none w-80 overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-xl'
                >
                  <div className='relative'>
                    <img
                      src={product.image}
                      alt={product.title}
                      className='w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500'
                    />
                    {product.isPopular && (
                      <Badge className='absolute top-4 right-4 bg-yellow-400 text-white'>
                        <Star className='w-3 h-3 mr-1' fill='currentColor' />
                        Popular
                      </Badge>
                    )}
                    <Badge className='absolute top-4 left-4 bg-yellow-400 text-gray-900'>
                      {product.category}
                    </Badge>
                  </div>
                  <CardContent className='p-6 bg-white'>
                    <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                      {product.title}
                    </h3>
                    <p className='text-gray-600 mb-4'>{product.description}</p>
                    <button 
                      className='text-red-500 font-medium hover:text-red-600'
                      onClick={() => {
                        const originalIndex = content.products.findIndex(p => p.id === product.id);
                        if (originalIndex !== -1) openModal(originalIndex);
                      }}
                    >
                      Learn More →
                    </button>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </div>
        )}

        {!showAll && (
          <div className='text-center mt-8'>
            <button
              onClick={() => setShowAll(true)}
              className='px-6 py-2 bg-yellow-400 rounded-full text-gray-900 font-medium hover:bg-yellow-500 transition'
            >
              Load More
            </button>
          </div>
        )}

      
      </div>

      {/* Modal */}
      {isModalOpen && selectedProductIndex !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-xl w-full max-w-3xl p-6 relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 bg-gray-500 text-white rounded-full p-2"
            > 
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold mb-4">
              {content.products[selectedProductIndex].title}
            </h2>

            <p className="text-gray-600 mb-4">
              {content.products[selectedProductIndex].detailedDescription}
            </p>

            {/* Pricing & Timeline */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Pricing</h3>
                <p>{content.products[selectedProductIndex].pricing}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Timeline</h3>
                <p>{content.products[selectedProductIndex].timeline}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}