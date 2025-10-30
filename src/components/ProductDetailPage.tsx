import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Star, Heart, ShoppingCart, Truck, Shield, Award, Plus, Minus, Share2, Plane } from 'lucide-react';
import LoadingScreen from './loadingscreen';
interface ProductFeature {
  icon: React.ReactNode;
  text: string;
}

interface Product {
  id: string;
  name: string;
  shortDescription: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  images: string[];
  features: ProductFeature[];
  specifications: Record<string, string>;
  description: string;
  shipping: {
    standard: string;
    express: string;
    free: string;
  };
  warranty: string;
  category: string;
}

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState('description');
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch product data from API
  useEffect(() => {
    const fetchProductDetails = () => {
      setLoading(true);
      setError(null);

      const API_URL = `https://f8wb4qay22.execute-api.ap-south-1.amazonaws.com/frontend-services-or-product/product/details/${id}`;

      axios
        .get(API_URL)
        .then((response) => {
          const responseData = response.data;

          if (responseData.status && responseData.data) {
            const apiData = responseData.data;

            // Check if it's a single product or services array
            if (apiData.products && apiData.products.products && apiData.products.products.length > 0) {
              // Handle products data
              const productData = apiData.products.products[0];
              const mappedProduct: Product = {
                id: id || "unknown",
                name: productData.title || "Product",
                shortDescription: productData.description || "",
                price: parseFloat(productData.pricing?.replace(/[^0-9.]/g, "") || "0"),
                originalPrice: parseFloat(productData.pricing?.replace(/[^0-9.]/g, "") || "0") * 1.2,
                discount: 20,
                rating: 4.5,
                reviewCount: 150,
                inStock: true,
                images: [productData.image || "/images/product1.png"],
                features: (productData.features || []).map((feature: string) => ({
                  icon: <Plane className="w-5 h-5 text-yellow-700" />,
                  text: feature
                })),
                specifications: {
                  "Category": productData.category || "General",
                  "Timeline": productData.timeline || "N/A",
                  "Pricing": productData.pricing || "Contact for pricing"
                },
                description: productData.detailedDescription || productData.description || "",
                shipping: {
                  standard: "5-7 business days",
                  express: "2-3 business days",
                  free: "Free shipping"
                },
                warranty: "1 Year Manufacturer Warranty",
                category: productData.category || "Products"
              };
              setProduct(mappedProduct);
            } else if (apiData.services && apiData.services.services && apiData.services.services.length > 0) {
              // Handle services data
              const serviceData = apiData.services.services[0];
              const mappedProduct: Product = {
                id: id || "unknown",
                name: serviceData.title || "Service",
                shortDescription: serviceData.description || "",
                price: parseFloat(serviceData.pricing?.replace(/[^0-9.]/g, "") || "0"),
                originalPrice: parseFloat(serviceData.pricing?.replace(/[^0-9.]/g, "") || "0") * 1.2,
                discount: 20,
                rating: 4.5,
                reviewCount: 150,
                inStock: true,
                images: [serviceData.image || "/images/service1.jpg"],
                features: (serviceData.features || []).map((feature: string) => ({
                  icon: <Plane className="w-5 h-5 text-yellow-700" />,
                  text: feature
                })),
                specifications: {
                  "Category": serviceData.category || "Services",
                  "Timeline": serviceData.timeline || "N/A",
                  "Pricing": serviceData.pricing || "Contact for pricing",
                  "Benefits": serviceData.benefits ? serviceData.benefits.join(", ") : "N/A",
                  "Process": serviceData.process ? serviceData.process.join(", ") : "N/A"
                },
                description: serviceData.detailedDescription || serviceData.description || "",
                shipping: {
                  standard: "5-7 business days",
                  express: "2-3 business days",
                  free: "Free shipping"
                },
                warranty: "1 Year Service Warranty",
                category: serviceData.category || "Services"
              };
              setProduct(mappedProduct);
            } else {
              setError("No product or service data found");
            }
          } else {
            setError("Invalid response format");
          }
        })
        .catch((error) => {
          console.error("API Error:", error);
          setError("Failed to fetch product details");
        })
        .finally(() => {
          setLoading(false);
        });
    };

    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  if (loading) {
    return (
    <LoadingScreen
        logoSrc="images/logo.png"
        loadingText="Loading Companies..."
      />
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center pt-16 min-h-screen bg-yellow-400">
        <div className="text-center">
          <p className="mb-4 text-xl font-semibold text-red-600">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 text-yellow-400 bg-black rounded-lg transition-colors hover:bg-gray-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center pt-16 min-h-screen bg-yellow-400">
        <div className="text-center">
          <p className="text-xl font-semibold text-black">Product not found.</p>
        </div>
      </div>
    );
  }

  const handleImageHover = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!showZoom) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const handleQuantityChange = (change: number) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="pt-16 min-h-screen bg-yellow-400">
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 mb-16 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="overflow-hidden relative bg-white rounded-3xl shadow-lg">
              <div
                className="relative w-full h-[500px] cursor-zoom-in bg-white rounded-xl"
                onMouseEnter={() => setShowZoom(true)}
                onMouseLeave={() => setShowZoom(false)}
                onMouseMove={handleImageHover}
              >
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full transition-transform duration-300"
                />

                {showZoom && (
                  <div
                    className="absolute inset-0 bg-no-repeat rounded-xl opacity-0 transition-opacity duration-300 pointer-events-none hover:opacity-100"
                    style={{
                      backgroundImage: `url(${product.images[selectedImage]})`,
                      backgroundSize: '200%',
                      backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`
                    }}
                  />
                )}
              </div>

            </div>
            <div className="flex overflow-x-auto space-x-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${selectedImage === index ? 'border-black shadow-lg' : 'border-gray-300 hover:border-gray-400'}`}
                >
                  <img src={image} alt={`${product.name} view ${index + 1}`} className="object-cover w-full h-full" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="mb-4 text-3xl font-black text-black md:text-4xl">{product.name}</h1>
              <div className="flex gap-4 items-center mb-4">
                <div className="flex gap-1 items-center">
                  {renderStars(product.rating)}
                  <span className="ml-2 font-semibold text-black">{product.rating}</span>
                </div>
                <span className="text-black/70">({product.reviewCount} reviews)</span>
              </div>
              <p className="text-lg text-black/80">{product.shortDescription}</p>
            </div>

            <div className="p-6 bg-white rounded-2xl shadow-lg">
              <div className="flex gap-4 items-center mb-4">
                <span className="text-3xl font-black text-black">₹{product.price}</span>
                {/* {product.originalPrice > product.price && (
                  <span className="text-xl text-gray-500 line-through">${product.originalPrice}</span>
                )} */}
                {product.discount > 0 && (
                  <span className="px-2 py-1 text-sm font-bold text-red-800 bg-red-100 rounded-full">Save ${product.originalPrice - product.price}</span>
                )}
              </div>
              <div className="flex gap-2 items-center mb-4 text-green-600">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">In Stock - Ready to Ship</span>
              </div>

              {/* Quantity Section */}
              <div className="space-y-4">
                <div className="flex gap-4 items-center">
                  <span className="font-semibold text-black">Quantity:</span>
                  <div className="flex items-center rounded-xl border-2 border-gray-300">
                    <button onClick={() => handleQuantityChange(-1)} className="p-2 hover:bg-gray-100">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 font-semibold">{quantity}</span>
                    <button onClick={() => handleQuantityChange(1)} className="p-2 hover:bg-gray-100">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 px-6 py-4 text-lg font-bold text-white bg-black rounded-xl hover:bg-gray-800">
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`px-4 py-4 rounded-xl border-2 transition-all ${isWishlisted ? 'text-red-600 bg-red-50 border-red-300' : 'text-gray-600 bg-white border-gray-300'}`}
                  >
                    <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                  <button className="px-4 py-4 text-gray-600 rounded-xl border-2 border-gray-300">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Key Features */}
            <div className="p-6 bg-white rounded-2xl shadow-lg">
              <h3 className="mb-4 text-xl font-bold text-black">Key Features</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex gap-3 items-center p-3 bg-yellow-50 rounded-xl">
                    {feature.icon}
                    <span className="text-sm font-medium text-black">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Info */}
            <div className="p-6 bg-white rounded-2xl shadow-lg">
              <h3 className="mb-4 text-xl font-bold text-black">Shipping & Returns</h3>
              <div className="space-y-3">
                <div className="flex gap-3 items-center">
                  <Truck className="w-5 h-5 text-green-600" />
                  <span className="text-black">{product.shipping.free}</span>
                </div>
                <div className="flex gap-3 items-center">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span className="text-black">{product.warranty}</span>
                </div>
                <div className="flex gap-3 items-center">
                  <Award className="w-5 h-5 text-yellow-600" />
                  <span className="text-black">30-day return policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Information Tabs */}
        <div className="overflow-hidden mb-16 bg-white rounded-3xl shadow-lg">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {['description', 'specifications'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 font-semibold capitalize transition-all ${activeTab === tab ? 'text-black border-b-2 border-black bg-yellow-50' : 'text-gray-600 hover:text-black hover:bg-gray-50'}`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {activeTab === 'description' && (
              <div className="max-w-none prose">
                <h3 className="mb-4 text-2xl font-bold text-black">Product Description</h3>
                <div className="space-y-4 leading-relaxed text-gray-700">
                  {product.description.split('\n\n').map((paragraph: string, index: number) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div>
                <h3 className="mb-6 text-2xl font-bold text-black">Technical Specifications</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center p-4 bg-yellow-50 rounded-xl">
                      <span className="font-semibold text-black">{key}:</span>
                      <span className="text-gray-700">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* {activeTab === 'reviews' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-black">Customer Reviews</h3>
                  <button className="flex gap-2 items-center px-6 py-3 font-semibold text-white bg-black rounded-xl transition-all hover:bg-gray-800">
                    <MessageCircle className="w-4 h-4" />
                    Write a Review
                  </button>
                </div>

                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="pb-6 border-b border-gray-200 last:border-b-0">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex gap-3 items-center">
                          <div className="flex justify-center items-center w-10 h-10 bg-gray-300 rounded-full">
                            <span className="font-bold text-gray-600">{review.author[0]}</span>
                          </div>
                          <div>
                            <div className="font-semibold text-black">{review.author}</div>
                            <div className="text-sm text-gray-500">{review.date}</div>
                          </div>
                        </div>
                        <div className="flex gap-1 items-center">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      <h4 className="mb-2 font-semibold text-black">{review.title}</h4>
                      <p className="mb-3 text-gray-700">{review.text}</p>
                      <div className="flex gap-4 items-center text-sm text-gray-500">
                        <button className="transition-colors hover:text-black">
                          Helpful ({review.helpful})
                        </button>
                        <button className="transition-colors hover:text-black">
                          Reply
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
