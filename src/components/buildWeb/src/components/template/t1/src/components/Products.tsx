import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
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

export default function Products() {
  const [selected, setSelected] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Static product data
  const productData = {
    heading: {
      title: "Our Products",
      heading: "Innovative Solutions for Modern Businesses",
      description: "Discover our suite of cutting-edge products designed to streamline your operations and drive growth.",
      trust: "Trusted by 500+ companies worldwide"
    },
    categories: ["All", "Platform", "Analytics", "Collaboration", "Automation", "Security"],
    benefits: [
      {
        icon: "🚀",
        title: "Fast Implementation",
        desc: "Get up and running in days, not months with our easy-to-deploy solutions",
        color: "primary"
      },
      {
        icon: "🛡️",
        title: "Enterprise Security",
        desc: "Bank-level security and compliance to protect your sensitive data",
        color: "red-accent"
      },
      {
        icon: "📈",
        title: "Proven Results",
        desc: "Join thousands of businesses that have seen significant ROI with our products",
        color: "primary"
      }
    ],
    products: [
      {
        id: 1,
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop",
        title: "Innovation Platform Pro",
        description: "Comprehensive platform for managing digital transformation and innovation workflows",
        category: "Platform",
        categoryColor: "bg-blue-100 text-blue-700",
        isPopular: true,
        detailedDescription: "Our flagship Innovation Platform Pro is designed to help enterprises manage their entire innovation lifecycle. From idea generation to execution, our platform provides the tools and insights needed to drive meaningful change and stay ahead of the competition.",
        features: [
          "AI-powered idea generation and evaluation",
          "Real-time collaboration tools for distributed teams",
          "Advanced analytics and performance tracking",
          "Customizable workflow automation",
          "Integration with popular tools like Slack, Jira, and Salesforce",
          "Mobile app for on-the-go innovation",
          "Enterprise-grade security and compliance"
        ],
        specifications: {
          "Users": "Unlimited",
          "Storage": "1TB included",
          "Integrations": "50+ pre-built",
          "Support": "24/7 premium",
          "API Access": "Full REST API",
          "Compliance": "SOC 2, GDPR, HIPAA"
        },
        pricing: "Starting at $499/month",
        timeline: "Setup in 24 hours"
      },
      {
        id: 2,
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop",
        title: "Analytics Intelligence Suite",
        description: "Advanced analytics and business intelligence tools for data-driven decision making",
        category: "Analytics",
        categoryColor: "bg-green-100 text-green-700",
        isPopular: false,
        detailedDescription: "Transform your raw data into actionable insights with our Analytics Intelligence Suite. Leverage machine learning and advanced visualization to uncover trends, predict outcomes, and make informed business decisions.",
        features: [
          "Real-time dashboard with customizable widgets",
          "Predictive analytics and forecasting",
          "Automated report generation",
          "Data visualization with interactive charts",
          "Multi-source data integration",
          "Custom KPI tracking",
          "Export to PDF/Excel/PPT"
        ],
        specifications: {
          "Data Sources": "Unlimited connections",
          "Refresh Rate": "Real-time updates",
          "Storage": "500GB included",
          "Users": "Up to 25 seats",
          "Historical Data": "5 years retention",
          "API Rate Limit": "10,000 calls/hour"
        },
        pricing: "$299/month",
        timeline: "Ready in 48 hours"
      },
      {
        id: 3,
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop",
        title: "Team Collaboration Hub",
        description: "Seamless collaboration tools for modern remote and hybrid teams",
        category: "Collaboration",
        categoryColor: "bg-purple-100 text-purple-700",
        isPopular: true,
        detailedDescription: "Break down communication barriers with our Team Collaboration Hub. Designed for the modern workplace, this platform brings together messaging, video calls, file sharing, and project management in one intuitive interface.",
        features: [
          "HD video conferencing with 100 participants",
          "Unlimited messaging and file sharing",
          "Project management with Kanban boards",
          "Screen sharing and remote control",
          "Meeting recordings and transcripts",
          "Integration with calendar and email",
          "Advanced search and archiving"
        ],
        specifications: {
          "Participants": "Up to 100 video calls",
          "Storage": "250GB team storage",
          "File Size Limit": "2GB per file",
          "Retention": "Unlimited message history",
          "Guests": "Unlimited guest access",
          "Security": "End-to-end encryption"
        },
        pricing: "$199/month for teams",
        timeline: "Instant activation"
      },
      {
        id: 4,
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop",
        title: "Workflow Automation Engine",
        description: "Automate repetitive tasks and streamline business processes with AI",
        category: "Automation",
        categoryColor: "bg-orange-100 text-orange-700",
        isPopular: false,
        detailedDescription: "Our Workflow Automation Engine uses artificial intelligence to identify and automate repetitive tasks across your organization. Save time, reduce errors, and focus on what matters most.",
        features: [
          "Drag-and-drop workflow builder",
          "AI-powered task identification",
          "Custom automation triggers",
          "Integration with 100+ apps",
          "Error handling and notifications",
          "Performance analytics",
          "Multi-step automation sequences"
        ],
        specifications: {
          "Automations": "Unlimited workflows",
          "Triggers": "Custom conditions",
          "Apps": "100+ integrations",
          "Execution Time": "Near real-time",
          "Support": "Business hours + emergency",
          "Backups": "Daily automated"
        },
        pricing: "$349/month",
        timeline: "Setup in 1 week"
      },
      {
        id: 5,
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop",
        title: "Enterprise Security Shield",
        description: "Comprehensive security solution for protecting sensitive business data",
        category: "Security",
        categoryColor: "bg-red-100 text-red-700",
        isPopular: true,
        detailedDescription: "Protect your business from cyber threats with our Enterprise Security Shield. This comprehensive solution includes threat detection, data encryption, access control, and compliance management.",
        features: [
          "Real-time threat detection and response",
          "Advanced encryption for data at rest and in transit",
          "Multi-factor authentication and SSO",
          "Compliance reporting for SOC 2, GDPR, HIPAA",
          "Security awareness training",
          "Incident response planning",
          "24/7 security monitoring"
        ],
        specifications: {
          "Threat Detection": "Real-time AI monitoring",
          "Encryption": "AES-256 bit",
          "Compliance": "15+ frameworks",
          "Monitoring": "24/7 SOC team",
          "Response Time": "< 15 minutes",
          "Backup": "Geo-redundant storage"
        },
        pricing: "Custom pricing",
        timeline: "Deployment in 2 weeks"
      },
      {
        id: 6,
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop",
        title: "Customer Success Platform",
        description: "Tools to understand, engage, and retain your customers effectively",
        category: "Platform",
        categoryColor: "bg-blue-100 text-blue-700",
        isPopular: false,
        detailedDescription: "Boost customer satisfaction and retention with our Customer Success Platform. Track customer health, automate engagement, and identify growth opportunities with comprehensive analytics.",
        features: [
          "Customer health scoring",
          "Automated engagement campaigns",
          "NPS and CSAT tracking",
          "Churn prediction alerts",
          "Customer journey mapping",
          "Integration with CRM systems",
          "Custom reporting dashboards"
        ],
        specifications: {
          "Customers": "Unlimited contacts",
          "Surveys": "Unlimited responses",
          "Integrations": "30+ CRMs supported",
          "Data Retention": "7 years",
          "API Access": "Full access included",
          "Support": "Dedicated CSM"
        },
        pricing: "$399/month",
        timeline: "Ready in 3 days"
      },
      {
        id: 7,
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop",
        title: "Marketing Automation Pro",
        description: "End-to-end marketing automation for lead generation and conversion",
        category: "Automation",
        categoryColor: "bg-orange-100 text-orange-700",
        isPopular: true,
        detailedDescription: "Streamline your marketing efforts with our comprehensive automation platform. From lead capture to conversion tracking, manage your entire marketing funnel in one place.",
        features: [
          "Multi-channel campaign management",
          "Lead scoring and segmentation",
          "Email marketing automation",
          "Social media scheduling",
          "ROI tracking and analytics",
          "A/B testing capabilities",
          "CRM integration"
        ],
        specifications: {
          "Contacts": "Up to 50,000",
          "Emails": "Unlimited sending",
          "Channels": "Email, Social, SMS",
          "Analytics": "Real-time dashboards",
          "A/B Tests": "Unlimited variations",
          "Support": "Marketing experts"
        },
        pricing: "$449/month",
        timeline: "Setup in 5 days"
      },
      {
        id: 8,
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop",
        title: "Data Visualization Studio",
        description: "Create stunning interactive data visualizations and reports",
        category: "Analytics",
        categoryColor: "bg-green-100 text-green-700",
        isPopular: false,
        detailedDescription: "Turn complex data into compelling visual stories with our Data Visualization Studio. Create interactive dashboards, reports, and infographics that drive understanding and action.",
        features: [
          "Drag-and-drop chart builder",
          "100+ visualization templates",
          "Real-time data connections",
          "Collaborative editing",
          "Export to multiple formats",
          "Embeddable charts and dashboards",
          "Advanced customization options"
        ],
        specifications: {
          "Templates": "100+ pre-built",
          "Data Sources": "Unlimited connections",
          "Export Formats": "PDF, PNG, SVG, HTML",
          "Collaborators": "Up to 10 editors",
          "Refresh Rate": "15-minute intervals",
          "Storage": "100GB included"
        },
        pricing: "$249/month",
        timeline: "Instant access"
      }
    ]
  };

  // Extract data from productData
  const content = {
    sectionTitle: productData.heading.title,
    sectionSubtitle: productData.heading.heading,
    sectionDescription: productData.heading.description,
    trustText: productData.heading.trust,
    products: productData.products,
    categories: productData.categories,
    benefits: productData.benefits,
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

  return (
    <section
      id="product"
      ref={sectionRef}
      className="py-20 bg-gradient-to-b from-gray-50 to-white scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
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
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
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
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex gap-3 justify-center mb-12 flex-wrap"
        >
          {content.categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelected(cat)}
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                selected === cat
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
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
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
                        className={`${product.categoryColor || "bg-gray-100 text-gray-700"}`}
                      >
                        {product.category}
                      </Badge>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {product.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 flex-1">
                      {product.description.slice(0, 30) + "..."}
                    </p>

                    {/* {product.features && product.features.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-sm mb-2 text-gray-900">
                          Key Features:
                        </h4>
                        <ul className="text-xs text-gray-600 space-y-1.5">
                          {product.features.slice(0, 3).map((feature, idx) => (
                            <li key={idx} className="flex items-start">
                              <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-2 mt-1.5 flex-shrink-0"></div>
                              <span>{feature}</span>
                            </li>
                          ))}
                          {product.features.length > 3 && (
                            <li className="text-yellow-600 font-medium text-xs">
                              +{product.features.length - 3} more features
                            </li>
                          )}
                        </ul>
                      </div>
                    )} */}

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

        {/* Benefits Section */}
        {/* {content.benefits && content.benefits.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16"
          >
            <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">
              Why Choose Our Products?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {content.benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                  }
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
                >
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 text-3xl
                      ${
                        benefit.color === "red-accent"
                          ? "bg-red-100 text-red-600"
                          : benefit.color === "primary"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                  >
                    {benefit.icon}
                  </div>
                  <h4 className="font-bold text-lg mb-3 text-gray-900">
                    {benefit.title}
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {benefit.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )} */}
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
              className="bg-white rounded-2xl w-full max-w-4xl max-h-[70vh] overflow-hidden shadow-2xl"
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
                      className={`${selectedProduct.categoryColor || "bg-yellow-400 text-gray-900"}`}
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
                {/* Description */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    About This Product
                  </h3>
                  <p className="text-gray-700 text-base leading-relaxed mb-4">
                    {selectedProduct.detailedDescription ||
                      selectedProduct.description}
                  </p>
                </div>

                {/* All Features */}
                {selectedProduct.features &&
                  selectedProduct.features.length > 0 && (
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

                {/* Specifications */}
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

                {/* Pricing & Timeline */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {selectedProduct.pricing && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                      <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <span className="text-green-600">💰</span> Pricing
                      </h3>
                      <p className="text-gray-900 text-xl font-bold">
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
                      <p className="text-gray-900 text-xl font-bold">
                        {selectedProduct.timeline}
                      </p>
                    </div>
                  )}
                </div>

                {/* CTA Button */}
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