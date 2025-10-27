import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { X, Calendar, Clock, User } from "lucide-react";

// Custom Card Component
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={className}>{children}</div>
);

// Custom Button Component
const Button = ({ children, onClick, className = "", variant = "primary" }) => {
  const variantClasses = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white",
    ghost: "text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
  };

  return (
    <button
      onClick={onClick}
      className={`font-medium rounded-lg transition-all duration-200 inline-flex items-center justify-center px-4 py-2 ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const cardHoverVariants = {
  rest: { y: 0 },
  hover: {
    y: -5,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
};

function BlogModal({ blog, onClose }) {
  // Handle escape key to close modal
  const handleEscape = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  // Prevent background scrolling when modal is open
  useState(() => {
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  });

  return (
    <motion.div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
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
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-2 transition-colors shadow-lg"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-900" />
          </button>
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-medium rounded-full">
                {blog.category}
              </span>
            </div>
            <h2 className="text-3xl font-bold text-white">{blog.title}</h2>
            <div className="flex items-center gap-4 mt-3 text-white/90 text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{blog.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{blog.readTime || "5 min read"}</span>
              </div>
              {blog.author && (
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{blog.author}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-16rem)] p-8">
          {/* Excerpt */}
          <div className="mb-8">
            <p className="text-lg text-gray-700 leading-relaxed">
              {blog.excerpt}
            </p>
          </div>

          {/* Blog Outline if available */}
          {blog.outline && blog.outline.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-indigo-600">📋</span> In this article:
              </h3>
              <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                <ul className="space-y-3">
                  {blog.outline.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-indigo-600 mr-3 mt-1 text-lg">
                        •
                      </span>
                      <span className="text-gray-700">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="mb-8">
            <div className="text-gray-700 leading-7 space-y-6 text-base">
              {blog.content ? (
                <div dangerouslySetInnerHTML={{ __html: blog.content }} />
              ) : (
                <>
                  <p>
                    Drone technology is rapidly transforming industries across
                    India, offering innovative solutions that were once
                    considered impossible. From agriculture to construction, the
                    applications of drone technology are vast and continually
                    expanding.
                  </p>

                  <p>
                    In the agricultural sector, drones equipped with
                    multispectral sensors can monitor crop health, detect pest
                    infestations, and optimize irrigation. This technology
                    enables farmers to make data-driven decisions, resulting in
                    increased yields and reduced resource consumption.
                  </p>

                  <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">
                    The Future of Drone Technology
                  </h3>

                  <p>
                    As regulations evolve and technology advances, we can expect
                    to see even more innovative applications of drones in
                    various sectors. The integration of AI and machine learning
                    with drone technology will further enhance their
                    capabilities, making them indispensable tools for businesses
                    looking to gain a competitive edge.
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Keywords if available */}
          {blog.keywords && blog.keywords.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                Keywords:
              </h4>
              <div className="flex flex-wrap gap-2">
                {blog.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-indigo-100 text-indigo-800 text-sm rounded-full border border-indigo-200"
                  >
                    #{keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA Button */}
          <div className="flex justify-center pt-6 border-t border-gray-200">
            <Button
              onClick={onClose}
              className="px-8"
            >
              Close Article
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Blog() {
  const [selectedBlog, setSelectedBlog] = useState(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Static blog data
  const blogData = {
    header: {
      title: "Latest Blogs & Insights",
      desc: "Stay updated with our latest insights, trends, and innovations in technology and business."
    },
    posts: [
      {
        id: 1,
        title: "The Future of AI in Business Transformation",
        excerpt: "Discover how artificial intelligence is revolutionizing business operations, from automation to predictive analytics, and what it means for your organization's future.",
        content: `
          <p>Artificial Intelligence is no longer a futuristic concept—it's a present-day reality transforming how businesses operate and compete. In this comprehensive guide, we explore the practical applications of AI that are driving real business value today.</p>
          
          <h3>Automation and Efficiency</h3>
          <p>AI-powered automation is handling repetitive tasks with unprecedented accuracy and speed. From customer service chatbots to automated data entry, businesses are achieving significant cost savings while improving service quality.</p>
          
          <h3>Predictive Analytics</h3>
          <p>Machine learning algorithms can analyze historical data to predict future trends, customer behavior, and market shifts. This enables proactive decision-making and strategic planning.</p>
          
          <h3>Personalized Customer Experiences</h3>
          <p>AI systems can deliver hyper-personalized experiences by analyzing customer data and behavior patterns, leading to increased engagement and conversion rates.</p>
        `,
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&h=300&fit=crop",
        category: "Artificial Intelligence",
        date: "Aug 20, 2025",
        readTime: "6 min read",
        author: "Sarah Chen",
        outline: [
          "AI-driven automation benefits",
          "Predictive analytics in business",
          "Customer experience personalization",
          "Implementation strategies",
          "Future AI trends"
        ],
        keywords: ["AI", "Automation", "Machine Learning", "Business", "Innovation"]
      },
      {
        id: 2,
        title: "Innovation Trends Shaping 2025 and Beyond",
        excerpt: "Explore the key innovation trends that are set to redefine industries and create new opportunities for growth and disruption in the coming years.",
        content: `
          <p>As we look toward 2025, several innovation trends are emerging that promise to reshape the business landscape. Understanding these trends is crucial for staying competitive.</p>
          
          <h3>Sustainable Technology</h3>
          <p>Green tech and sustainable solutions are becoming mainstream, driven by consumer demand and regulatory pressures. Companies are investing in circular economy models and carbon-neutral operations.</p>
          
          <h3>Edge Computing Expansion</h3>
          <p>With the growth of IoT devices, edge computing is becoming essential for real-time data processing and reducing latency in critical applications.</p>
          
          <h3>Human-AI Collaboration</h3>
          <p>The future isn't about AI replacing humans, but about humans and AI working together to achieve better outcomes than either could alone.</p>
        `,
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop",
        category: "Innovation",
        date: "Aug 18, 2025",
        readTime: "5 min read",
        author: "Marcus Johnson",
        outline: [
          "Sustainable technology solutions",
          "Edge computing applications",
          "Human-AI collaboration models",
          "Digital transformation strategies",
          "Emerging market opportunities"
        ],
        keywords: ["Innovation", "Technology", "Sustainability", "Digital Transformation", "Trends"]
      },
      {
        id: 3,
        title: "Building Resilient Tech Strategies for Uncertain Times",
        excerpt: "Learn how to develop technology strategies that can withstand market volatility and adapt to changing business environments while maintaining growth momentum.",
        content: `
          <p>In today's rapidly changing business environment, resilience is no longer optional—it's essential for survival and growth. This article outlines strategies for building tech resilience.</p>
          
          <h3>Cloud-Native Architecture</h3>
          <p>Adopting cloud-native approaches provides the scalability and flexibility needed to respond quickly to changing market conditions and customer demands.</p>
          
          <h3>Cybersecurity Resilience</h3>
          <p>With increasing cyber threats, building robust security frameworks that can detect, respond to, and recover from attacks is critical for business continuity.</p>
          
          <h3>Agile Development Practices</h3>
          <p>Implementing agile methodologies allows organizations to pivot quickly and deliver value continuously, even in uncertain conditions.</p>
        `,
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop",
        category: "Strategy",
        date: "Aug 15, 2025",
        readTime: "7 min read",
        author: "Dr. Elena Rodriguez",
        outline: [
          "Cloud-native architecture benefits",
          "Cybersecurity best practices",
          "Agile methodology implementation",
          "Risk management frameworks",
          "Business continuity planning"
        ],
        keywords: ["Resilience", "Strategy", "Cloud", "Security", "Agile"]
      },
      {
        id: 4,
        title: "The Rise of Quantum Computing in Business Applications",
        excerpt: "Quantum computing is moving from theoretical research to practical business applications. Discover how this technology could solve complex problems beyond classical computing capabilities.",
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&h=300&fit=crop",
        category: "Quantum Computing",
        date: "Aug 12, 2025",
        readTime: "8 min read",
        author: "Dr. Alex Thompson",
        outline: [
          "Quantum computing fundamentals",
          "Current business applications",
          "Industry-specific use cases",
          "Implementation challenges",
          "Future developments"
        ],
        keywords: ["Quantum", "Computing", "Innovation", "Technology", "Research"]
      },
      {
        id: 5,
        title: "Sustainable Tech: Building Greener Digital Solutions",
        excerpt: "Explore how technology companies are reducing their environmental footprint while developing solutions that help other industries become more sustainable.",
        image: "https://images.unsplash.com/photo-1568992688065-536aad8a12f6?w=500&h=300&fit=crop",
        category: "Sustainability",
        date: "Aug 10, 2025",
        readTime: "5 min read",
        author: "Lisa Wang",
        outline: [
          "Green data center initiatives",
          "Energy-efficient coding practices",
          "Sustainable product design",
          "Carbon footprint measurement",
          "Regulatory compliance"
        ],
        keywords: ["Sustainability", "Green Tech", "Environment", "Innovation", "ESG"]
      },
      {
        id: 6,
        title: "The Metaverse: Next Frontier for Business Engagement",
        excerpt: "As virtual worlds evolve, businesses are exploring new ways to engage customers, train employees, and create innovative products in the metaverse.",
        image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=500&h=300&fit=crop",
        category: "Emerging Tech",
        date: "Aug 8, 2025",
        readTime: "6 min read",
        author: "Ryan Cooper",
        outline: [
          "Metaverse business models",
          "Virtual customer experiences",
          "Employee training applications",
          "Technical infrastructure requirements",
          "ROI measurement strategies"
        ],
        keywords: ["Metaverse", "Virtual Reality", "Digital Engagement", "Innovation", "Technology"]
      }
    ]
  };

  const content = {
    header: blogData.header,
    posts: blogData.posts.map((post, index) => ({
      ...post,
      date: post.date
    })),
  };

  const openModal = (blog) => {
    setSelectedBlog(blog);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedBlog(null);
    document.body.style.overflow = "unset";
  };

  return (
    <>
      <motion.section
        ref={sectionRef}
        id="blog"
        className="py-20 bg-gray-50 scroll-mt-20 relative"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
              Our Blog
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {content.header.title}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {content.header.desc}
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <AnimatePresence>
              {content.posts.map((b) => (
                <motion.div
                  key={b.id}
                  variants={itemVariants}
                  layout
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    variants={cardHoverVariants}
                    initial="rest"
                    whileHover="hover"
                  >
                    <Card className="shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer">
                      <div className="relative overflow-hidden">
                        <motion.img
                          src={b.image}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                          alt={b.title}
                        />
                        <div className="absolute top-3 right-3">
                          <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-medium rounded-full">
                            {b.category}
                          </span>
                        </div>
                      </div>
                      <CardContent className="p-6 space-y-3">
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{b.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{b.readTime || "5 min read"}</span>
                          </div>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                          {b.title}
                        </h3>
                        <p className="text-gray-600 line-clamp-3">
                          {b.excerpt}
                        </p>
                        <div className="flex justify-between items-center mt-4">
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            {b.author && (
                              <>
                                <User className="w-4 h-4" />
                                <span>{b.author}</span>
                              </>
                            )}
                          </div>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              variant="ghost"
                              className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                              onClick={() => openModal(b)}
                            >
                              Read More →
                            </Button>
                          </motion.div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.section>

      {/* Modal */}
      <AnimatePresence>
        {selectedBlog && <BlogModal blog={selectedBlog} onClose={closeModal} />}
      </AnimatePresence>
    </>
  );
}