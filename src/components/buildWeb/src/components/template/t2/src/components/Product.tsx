import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Monitor,
  Smartphone,
  Cloud,
  BarChart3,
  Zap,
  X,
  CheckCircle,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion, AnimatePresence } from "motion/react";
import { desc, head } from "motion/react-client";

export default function Product() {
  const [isEditing, setIsEditing] = useState(false);
  const [products, setProducts] = useState<any[]>([
    {
      icon: Monitor,
      title: "Business Dashboard Pro",
      category: "Analytics Platform",
      image:
        "https://images.unsplash.com/photo-1575388902449-6bca946ad549?auto=format&fit=crop&w=1080&q=80",
      description:
        "Real-time business intelligence dashboard with comprehensive performance metrics.",
      features: [
        "Real-time Analytics",
        "Custom Reports",
        "Data Visualization",
        "Multi-platform Support",
      ],
      isPopular: true,
      categoryColor: "bg-blue-100 text-blue-800",
      detailedDescription: "Our business dashboard delivers deep insights...",
      pricing: "From $5,000",
      timeline: "4-6 weeks",
    },
    {
      icon: Smartphone,
      title: "Mobile Workforce App",
      category: "Mobile Solution",
      image:
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1080&q=80",
      description:
        "Comprehensive mobile solution for remote team management and collaboration.",
      features: [
        "Team Communication",
        "Task Management",
        "Time Tracking",
        "GPS Services",
      ],
      isPopular: false,
      categoryColor: "bg-green-100 text-green-800",
      detailedDescription: "Manage your workforce remotely with efficiency...",
      pricing: "From $2,500",
      timeline: "2-4 weeks",
    },
    {
      icon: Cloud,
      title: "Cloud Infrastructure Suite",
      category: "Cloud Platform",
      image:
        "https://images.unsplash.com/photo-1676378280996-cff6b481d701?auto=format&fit=crop&w=1080&q=80",
      description:
        "Scalable cloud infrastructure with enterprise-grade security and reliability.",
      features: [
        "Auto-scaling",
        "Advanced Security",
        "99.9% Uptime",
        "24/7 Monitoring",
      ],
      isPopular: false,
      categoryColor: "bg-purple-100 text-purple-800",
      detailedDescription: "Cloud-native infrastructure to scale seamlessly...",
      pricing: "Custom Pricing",
      timeline: "8-12 weeks",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics Engine",
      category: "Data Intelligence",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1080&q=80",
      description:
        "Powerful analytics engine with predictive insights and machine learning capabilities.",
      features: [
        "Predictive Analytics",
        "ML Models",
        "Big Data Processing",
        "Custom Algorithms",
      ],
      isPopular: false,
      categoryColor: "bg-orange-100 text-orange-800",
      detailedDescription:
        "Unlock predictive insights with our analytics engine...",
      pricing: "From $10,000",
      timeline: "12-20 weeks",
    },
  ]);

  const [visibleCount, setVisibleCount] = useState(4);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [heading, setHeading] = useState<any[]>({
    title: "Our Products",
    heading: "Innovative Solutions Built for Success",
    description:
      "Discover our suite of cutting-edge products designed to streamline operations, boost productivity, and drive exceptional results for your business.",
    trust: "for your business.",
  });
  const [benefits, setBenefits] = useState<any[]>([
    {
      icon: "30",
      color: "red-accent",
      title: "30-Day Free Trial",
      desc: "Try all features risk-free with our comprehensive trial period.",
    },
    {
      icon: "99%",
      color: "primary",
      title: "99% Uptime Guarantee",
      desc: "Enterprise-grade reliability with industry-leading uptime SLA.",
    },
    {
      icon: "∞",
      color: "gradient",
      title: "Unlimited Scalability",
      desc: "Grow without limits with our cloud-native architecture.",
    },
  ]);

  const updateBenefit = (index: number, field: string, value: string) => {
    setBenefits((prev) =>
      prev.map((b, i) => (i === index ? { ...b, [field]: value } : b))
    );
  };

  const addBenefit = () => {
    setBenefits((prev) => [
      ...prev,
      {
        icon: "",
        color: "primary",
        title: "New Benefit",
        desc: "Benefit description...",
      },
    ]);
  };

  const removeBenefit = (index: number) => {
    setBenefits((prev) => prev.filter((_, i) => i !== index));
  };

  const updateProductField = (index: number, field: string, value: any) => {
    setProducts((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
  };

  const updateFeature = (index: number, fIndex: number, value: string) => {
    setProducts((prev) =>
      prev.map((p, i) =>
        i === index
          ? {
              ...p,
              features: p.features.map((f: string, fi: number) =>
                fi === fIndex ? value : f
              ),
            }
          : p
      )
    );
  };

  const addFeature = (index: number) => {
    setProducts((prev) =>
      prev.map((p, i) =>
        i === index ? { ...p, features: [...p.features, "New Feature"] } : p
      )
    );
  };

  const removeFeature = (index: number, fIndex: number) => {
    setProducts((prev) =>
      prev.map((p, i) =>
        i === index
          ? {
              ...p,
              features: p.features.filter(
                (_: string, fi: number) => fi !== fIndex
              ),
            }
          : p
      )
    );
  };

  const handleImageUpload = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProductField(index, "image", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addProduct = () => {
    setProducts((prev) => [
      ...prev,
      {
        icon: Monitor,
        title: "New Product",
        category: "New Category",
        image: "https://via.placeholder.com/600x400?text=New+Product",
        description: "New product description...",
        features: ["New Feature"],
        isPopular: false,
        categoryColor: "bg-gray-100 text-gray-800",
        detailedDescription: "Detailed description for new product...",
        pricing: "TBD",
        timeline: "TBD",
      },
    ]);
  };

  const removeProduct = (index: number) => {
    setProducts((prev) => prev.filter((_, i) => i !== index));
  };

  const openModal = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <motion.section
      id='product'
      className='py-20 bg-secondary theme-transition'
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='text-center max-w-3xl mx-auto mb-16'>
          {isEditing ? (
            <>
              <div className='inline-flex items-center px-4 py-2 bg-red-accent/10 rounded-full text-red-accent mb-4'>
                <Zap className='w-4 h-4 mr-2' />
                <input
                  type='text'
                  value={heading.title}
                  onChange={(e) =>
                    setHeading((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className='border-b font-medium bg-transparent'
                />
              </div>

              <input
                type='text'
                value={heading.heading}
                onChange={(e) =>
                  setHeading((prev) => ({ ...prev, heading: e.target.value }))
                }
                className='border-b font-medium bg-transparent block w-full text-3xl md:text-4xl text-foreground mb-4'
              />
              <input
                type='text'
                className='border-b font-medium bg-transparent block w-full text-3xl md:text-4xl text-foreground mb-4'
                value={heading.description}
                onChange={(e) =>
                  setHeading((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />

              <input
                type='text'
                value={heading.trust}
                onChange={(e) =>
                  setHeading((prev) => ({ ...prev, trust: e.target.value }))
                }
                className='border-b font-medium bg-transparent block w-full text-3xl md:text-4xl text-foreground mb-4'
              />
            </>
          ) : (
            <>
              <div className='inline-flex items-center px-4 py-2 bg-red-accent/10 rounded-full text-red-accent mb-4'>
                <Zap className='w-4 h-4 mr-2' />
                <span className='font-medium'> {heading.title}</span>
              </div>
              <h2 className='text-3xl md:text-4xl text-foreground mb-4'>
                {heading.heading}
              </h2>

              <p className='text-lg text-muted-foreground inline'>
                {heading.description}
              </p>
              <p className='text-lg text-muted-foreground inline font-bold text-foreground'>
                {" "}
                {heading.trust}
              </p>
            </>
          )}
        </div>

        {/* Products Grid */}
        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16'>
          {products.slice(0, visibleCount).map((product, index) => {
            const IconComponent = product.icon;
            return (
              <Card
                key={index}
                className='group h-full relative overflow-hidden border-2 shadow-lg hover:shadow-xl shadow-gray-500'
              >
                <div className='relative h-32 overflow-hidden'>
                  <ImageWithFallback
                    src={product.image}
                    alt={product.title}
                    className='w-full h-full object-cover'
                  />
                  {isEditing && (
                    <input
                      type='file'
                      accept='image/*'
                      className='absolute bottom-2 px-2 inline z-10 text-black hover:text-white hover:bg-black bg-gray-200 rounded-xl left-2 text-xs'
                      onChange={(e) => handleImageUpload(index, e)}
                    />
                  )}
                  <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent' />
                  <div className='absolute top-2 left-2'>
                    <Badge
                      className={`${product.categoryColor} border-0 text-xs`}
                    >
                      {isEditing ? (
                        <input
                          value={product.category}
                          onChange={(e) =>
                            updateProductField(
                              index,
                              "category",
                              e.target.value
                            )
                          }
                          className='border-b text-xs bg-transparent'
                        />
                      ) : (
                        product.category
                      )}
                    </Badge>
                  </div>
                  {product.isPopular && (
                    <div className='absolute top-2 right-2 bg-red-accent text-white px-2 py-1 rounded-full text-xs font-bold flex items-center'>
                      <Zap className='w-2 h-2 mr-1' /> Bestseller
                    </div>
                  )}
                  <div className='absolute bottom-2 left-2'>
                    <div
                      className={`w-8 h-8 ${
                        product.isPopular ? "bg-red-accent/90" : "bg-primary/90"
                      } rounded-lg flex items-center justify-center`}
                    >
                      <IconComponent className='h-4 w-4 text-white' />
                    </div>
                  </div>
                </div>
                <CardHeader>
                  {isEditing ? (
                    <input
                      value={product.title}
                      onChange={(e) =>
                        updateProductField(index, "title", e.target.value)
                      }
                      className='border-b w-full'
                    />
                  ) : (
                    <CardTitle>{product.title}</CardTitle>
                  )}
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <textarea
                      value={product.description}
                      onChange={(e) =>
                        updateProductField(index, "description", e.target.value)
                      }
                      className='border-b w-full'
                    />
                  ) : (
                    <p className='text-sm text-muted-foreground'>
                      {product.description}
                    </p>
                  )}
                  <ul className='space-y-1 mt-3'>
                    {product.features.map((f: string, fi: number) => (
                      <li
                        key={fi}
                        className='text-xs text-muted-foreground flex items-center'
                      >
                        <div className='w-1 h-1 bg-primary rounded-full mr-2' />
                        {isEditing ? (
                          <div className='flex flex-col gap-1 w-full'>
                            <input
                              value={f}
                              onChange={(e) =>
                                updateFeature(index, fi, e.target.value)
                              }
                              className='border-b w-full'
                            />
                            <button
                              onClick={() => removeFeature(index, fi)}
                              className='text-xs text-red-500'
                            >
                              ✕ Remove
                            </button>
                          </div>
                        ) : (
                          <span>{f}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                  {isEditing && (
                    <button
                      onClick={() => addFeature(index)}
                      className='text-xs text-green-600 mt-2'
                    >
                      + Add Feature
                    </button>
                  )}
                  <div className='mt-4 flex gap-2'>
                    <Button size='sm' onClick={() => openModal(product)}>
                      View Details
                    </Button>
                    {isEditing && (
                      <Button
                        size='sm'
                        variant='destructive'
                        onClick={() => removeProduct(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {isEditing && (
            <Card className='flex items-center justify-center border-dashed'>
              <Button onClick={addProduct} className='text-green-600'>
                + Add Product
              </Button>
            </Card>
          )}
        </div>

        {/* Load More / Show Less */}
        <div className='flex justify-center mt-6'>
          {visibleCount < products.length && (
            <Button onClick={() => setVisibleCount((prev) => prev + 4)}>
              Load More
            </Button>
          )}
          {visibleCount >= products.length && products.length > 4 && (
            <Button
              onClick={() => setVisibleCount(4)}
              variant='secondary'
              className='ml-4'
            >
              Show Less
            </Button>
          )}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && selectedProduct && (
          <motion.div
            className='fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <div
              className='bg-card rounded-xl w-full max-w-3xl p-6 relative overflow-y-auto max-h-[90vh]'
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className='absolute top-4 right-4 bg-white rounded-full p-2'
              >
                <X className='w-5 h-5' />
              </button>

              {isEditing ? (
                <input
                  value={selectedProduct.title}
                  onChange={(e) =>
                    updateProductField(
                      products.findIndex(
                        (p) => p.title === selectedProduct.title
                      ),
                      "title",
                      e.target.value
                    )
                  }
                  className='border-b w-full text-2xl font-bold mb-4'
                />
              ) : (
                <h2 className='text-2xl font-bold mb-4'>
                  {selectedProduct.title}
                </h2>
              )}

              {isEditing ? (
                <textarea
                  value={selectedProduct.detailedDescription}
                  onChange={(e) =>
                    updateProductField(
                      products.findIndex(
                        (p) => p.title === selectedProduct.title
                      ),
                      "detailedDescription",
                      e.target.value
                    )
                  }
                  className='border-b w-full mb-4'
                />
              ) : (
                <p className='text-muted-foreground mb-4'>
                  {selectedProduct.detailedDescription}
                </p>
              )}

              {/* Pricing & Timeline */}
              <div className='grid grid-cols-2 gap-6'>
                <div>
                  <h3 className='font-semibold mb-2'>Pricing</h3>
                  {isEditing ? (
                    <input
                      value={selectedProduct.pricing}
                      onChange={(e) =>
                        updateProductField(
                          products.findIndex(
                            (p) => p.title === selectedProduct.title
                          ),
                          "pricing",
                          e.target.value
                        )
                      }
                      className='border-b w-full'
                    />
                  ) : (
                    <p>{selectedProduct.pricing}</p>
                  )}
                </div>
                <div>
                  <h3 className='font-semibold mb-2'>Timeline</h3>
                  {isEditing ? (
                    <input
                      value={selectedProduct.timeline}
                      onChange={(e) =>
                        updateProductField(
                          products.findIndex(
                            (p) => p.title === selectedProduct.title
                          ),
                          "timeline",
                          e.target.value
                        )
                      }
                      className='border-b w-full'
                    />
                  ) : (
                    <p>{selectedProduct.timeline}</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
