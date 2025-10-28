import React from 'react';

interface Product {
  id: number;
  title: string;
  description: string;
  detailedDescription: string;
  image: string;
  category: string;
  categoryColor: string;
  pricing: string;
  timeline: string;
  features: string[];
  isPopular: boolean;
}

interface ProductData {
  sectionTitle?: string;
  sectionDescription?: string;
  sectionSubtitle?: string;
  trustText?: string;
  categories?: string[];
  benefits?: Array<{
    title: string;
    desc: string;
    icon: string;
    color: string;
  }>;
  products?: Product[];
}

interface ProductsProps {
  productData: ProductData;
}

export default function Products({ productData }: ProductsProps) {
  // Add safe access with optional chaining and fallbacks
  const {
    sectionTitle = "Our Products",
    sectionDescription = "Discover our innovative solutions",
    sectionSubtitle = "Products",
    products = [],
    benefits = [],
    categories = []
  } = productData || {};

  // Safe product access
  const productList = products || [];

  if (!productData) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground">Products</h2>
            <p className="text-muted-foreground mt-4">No product data available</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          {sectionSubtitle && (
            <span className="text-primary font-semibold text-lg">
              {sectionSubtitle}
            </span>
          )}
          <h2 className="text-4xl font-bold text-foreground mt-2">
            {sectionTitle}
          </h2>
          {sectionDescription && (
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              {sectionDescription}
            </p>
          )}
        </div>

        {/* Products Grid */}
        {productList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {productList.map((product, index) => (
              <div 
                key={product.id || index}
                className="bg-card rounded-lg shadow-lg overflow-hidden border border-border"
              >
                {/* Product Image */}
                {product.image && (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.title || 'Product image'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                {/* Product Content */}
                <div className="p-6">
                  {/* Category */}
                  {product.category && (
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${product.categoryColor || 'bg-blue-100 text-blue-800'}`}>
                      {product.category}
                    </span>
                  )}

                  {/* Title - Safe access with fallback */}
                  <h3 className="text-xl font-bold text-foreground mt-4 mb-2">
                    {product.title || 'Untitled Product'}
                  </h3>

                  {/* Description */}
                  {product.description && (
                    <p className="text-muted-foreground mb-4">
                      {product.description}
                    </p>
                  )}

                  {/* Pricing */}
                  {product.pricing && (
                    <div className="mb-4">
                      <span className="text-2xl font-bold text-primary">
                        {product.pricing}
                      </span>
                    </div>
                  )}

                  {/* Features */}
                  {product.features && product.features.length > 0 && (
                    <ul className="mb-4 space-y-1">
                      {product.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                          <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Timeline */}
                  {product.timeline && (
                    <p className="text-sm text-muted-foreground mb-4">
                      <strong>Delivery:</strong> {product.timeline}
                    </p>
                  )}

                  {/* Popular Badge */}
                  {product.isPopular && (
                    <span className="inline-block bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
                      Popular
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No products available at the moment.</p>
          </div>
        )}

        {/* Benefits Section */}
        {benefits.length > 0 && (
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center p-6 bg-card rounded-lg border border-border">
                <div className="text-2xl font-bold text-primary mb-2">
                  {benefit.icon}
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2">
                  {benefit.title}
                </h4>
                <p className="text-muted-foreground">
                  {benefit.desc}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}