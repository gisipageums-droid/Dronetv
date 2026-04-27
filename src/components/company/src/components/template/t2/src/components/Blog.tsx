import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Calendar, User, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";

export default function Blog() {
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAllPosts, setShowAllPosts] = useState(false);
  // Slider state for long content in modal
  const [slides, setSlides] = useState<string[]>([]);
  const [slideIndex, setSlideIndex] = useState(0);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [blogPosts, setBlogPosts] = useState<any[]>([
    {
      id: 1,
      title: "The Future of Digital Transformation",
      excerpt:
        "Explore how emerging technologies are reshaping business operations and creating new opportunities for growth.",
      image:
        "https://images.unsplash.com/photo-1661956602116-aa6865609028?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Technology",
      date: "Dec 15, 2024",
      author: "Sarah Chen",
      content: `
        <p>Digital transformation is no longer a choice but a necessity for businesses looking to stay competitive in today's rapidly evolving market. The integration of AI, cloud computing, and IoT has revolutionized how companies operate and deliver value to customers.</p>
        <h3>Key Trends Shaping 2024</h3>
        <p>Artificial Intelligence continues to be at the forefront, with machine learning algorithms optimizing everything from customer service to supply chain management. Cloud-native architectures are enabling unprecedented scalability and flexibility.</p>
        <p>The rise of edge computing is bringing processing power closer to data sources, reducing latency and enabling real-time decision making. Meanwhile, cybersecurity remains a critical concern as digital footprints expand.</p>
      `,
    },
    {
      id: 2,
      title: "Sustainable Business Practices",
      excerpt:
        "Learn how companies are integrating sustainability into their core operations while maintaining profitability.",
      image:
        "https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Sustainability",
      date: "Dec 10, 2024",
      author: "Marcus Johnson",
      content: `
        <p>Sustainability has evolved from a corporate social responsibility initiative to a core business strategy. Companies leading in this space are discovering that environmental responsibility and profitability are not mutually exclusive.</p>
        <h3>The Business Case for Sustainability</h3>
        <p>Research shows that sustainable companies often outperform their peers in the long run. They benefit from reduced operational costs, improved brand reputation, and increased customer loyalty.</p>
        <p>Investors are increasingly considering ESG (Environmental, Social, and Governance) factors when making investment decisions, putting pressure on companies to transparently report their sustainability efforts.</p>
      `,
    },
    {
      id: 3,
      title: "Remote Work Best Practices",
      excerpt:
        "Discover strategies for maintaining productivity and team cohesion in distributed work environments.",
      image:
        "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Work Culture",
      date: "Dec 5, 2024",
      author: "Emily Rodriguez",
      content: `
        <p>The shift to remote work has fundamentally changed how organizations operate. While offering flexibility, it also presents unique challenges in maintaining productivity and company culture.</p>
        <h3>Building Effective Remote Teams</h3>
        <p>Successful remote work requires more than just technology—it demands a shift in management style and communication practices. Regular check-ins, clear expectations, and trust are essential components.</p>
        <p>Companies are investing in digital collaboration tools and virtual team-building activities to maintain connection and camaraderie among distributed team members.</p>
      `,
    },
    {
      id: 4,
      title: "AI in Customer Experience",
      excerpt:
        "How artificial intelligence is revolutionizing customer service and personalization strategies.",
      image:
        "https://images.unsplash.com/photo-1534723328310-e82dad3ee43f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "AI",
      date: "Nov 28, 2024",
      author: "David Kim",
      content: `
        <p>Artificial Intelligence is transforming customer experience by enabling hyper-personalization, predictive support, and seamless interactions across multiple channels.</p>
        <h3>Personalization at Scale</h3>
        <p>AI algorithms analyze customer data to deliver tailored recommendations, content, and offers. This level of personalization was previously impossible to achieve at scale.</p>
        <p>Chatbots and virtual assistants powered by natural language processing are providing 24/7 support, handling routine inquiries while escalating complex issues to human agents.</p>
      `,
    },
    {
      id: 5,
      title: "The Power of Data Analytics",
      excerpt:
        "Unlock actionable insights from your data to drive strategic business decisions and foster innovation.",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
      category: "Data",
      date: "Nov 20, 2024",
      author: "Laura Benetti",
      content: `
        <p>In the digital age, data is one of the most valuable assets a company possesses. However, raw data is useless without proper analysis. Data analytics provides the tools and techniques to transform vast amounts of information into actionable insights.</p>
        <h3>Making Informed Decisions</h3>
        <p>By leveraging predictive analytics and machine learning, businesses can forecast trends, understand customer behavior, and optimize operations with unprecedented accuracy. This data-driven approach minimizes guesswork and maximizes ROI.</p>
      `,
    },
    {
      id: 6,
      title: "Modern Marketing Strategies",
      excerpt:
        "Navigate the digital landscape with effective marketing strategies that resonate with today's consumers.",
      image:
        "https://images.unsplash.com/photo-1557862921-37829c790f19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
      category: "Marketing",
      date: "Nov 12, 2024",
      author: "James Carter",
      content: `
        <p>The marketing landscape is constantly evolving. Strategies that worked yesterday may not work today. Modern marketing is about creating authentic connections with your audience through a multi-channel approach.</p>
        <h3>Key Channels for Success</h3>
        <p>Content marketing, social media engagement, and personalized email campaigns are crucial pillars of a successful modern marketing strategy. The key is to provide value first, building trust and loyalty over time.</p>
      `,
    },
  ]);

  const [header, setHeader] = useState({
    badge: "Our Blog",
    title: "Latest Insights & Updates",
    desc: "Stay informed with our expert perspectives on industry trends, best practices, and innovative solutions.",
  });

  const displayedPosts = showAllPosts ? blogPosts : blogPosts.slice(0, 4);

  const openModal = (post: any) => {
    setSelectedPost(post);
    // Split content into slide-sized chunks (by paragraphs/headings)
    try {
      const raw = post?.content || "";
      const parts = raw
        .split(/<(?:p|h3|h2)[^>]*>/i)
        .map((s: string) => s.replace(/<\/(?:p|h3|h2)>/gi, "").trim())
        .filter((s: string) => s.length > 0)
        .map((s: string) => `<p>${s}</p>`);
      setSlides(parts.length > 0 ? parts : [raw]);
      setSlideIndex(0);
    } catch (e) {
      setSlides([post?.content || ""]);
      setSlideIndex(0);
    }
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
    document.body.style.overflow = "auto";
  };

  return (
    <section id='blog' className='py-20 bg-background theme-transition'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <motion.div
          className='text-center mb-16'
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className='inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary mb-6'
            whileHover={{ scale: 1.05 }}
          >
            {isEditing ? (
              <input
                type='text'
                value={header.badge}
                onChange={(e) =>
                  setHeader((h) => ({ ...h, badge: e.target.value }))
                }
                className='font-medium bg-transparent border-b text-center'
              />
            ) : (
              <span className='font-medium'>{header.badge}</span>
            )}
          </motion.div>

          {isEditing ? (
            <input
              type='text'
              value={header.title}
              onChange={(e) =>
                setHeader((h) => ({ ...h, title: e.target.value }))
              }
              className='text-3xl md:text-4xl text-foreground mb-6 w-full text-center bg-transparent border-b font-bold'
            />
          ) : (
            <h2 className='text-3xl md:text-4xl text-foreground mb-6'>
              {header.title}
            </h2>
          )}

          {isEditing ? (
            <textarea
              value={header.desc}
              onChange={(e) =>
                setHeader((h) => ({ ...h, desc: e.target.value }))
              }
              className='text-lg text-muted-foreground max-w-2xl mx-auto w-full text-center bg-transparent border-b'
              rows={2}
            />
          ) : (
            <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
              {header.desc}
            </p>
          )}
        </motion.div>

        {/* Blog Grid */}
        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {displayedPosts.map((post, index) => (
            <motion.article
              key={post.id}
              className='bg-card rounded-xl shadow-xl  shadow-gray-500 hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer border-2'
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              {/* Image */}
              <div className='relative h-48 overflow-hidden'>
                <ImageWithFallback
                  src={post.image}
                  alt={post.title}
                  className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
                />
                {isEditing && (
                  <input
                    type='file'
                    accept='image/*'
                    className='absolute bottom-2 left-2 text-xs'
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setBlogPosts((prev) =>
                            prev.map((p, i) =>
                              i === index
                                ? { ...p, image: reader.result as string }
                                : p
                            )
                          );
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                )}
                <div className='absolute top-4 left-4'>
                  <span className='px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full'>
                    {isEditing ? (
                      <input
                        value={post.category}
                        onChange={(e) =>
                          setBlogPosts((prev) =>
                            prev.map((p, i) =>
                              i === index
                                ? { ...p, category: e.target.value }
                                : p
                            )
                          )
                        }
                        className='text-xs font-medium text-primary-foreground bg-transparent border-b'
                      />
                    ) : (
                      post.category
                    )}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className='p-6'>
                <div className='flex items-center text-xs text-muted-foreground mb-3'>
                  <Calendar className='w-3 h-3 mr-1' />
                  {isEditing ? (
                    <input
                      value={post.date}
                      onChange={(e) =>
                        setBlogPosts((prev) =>
                          prev.map((p, i) =>
                            i === index ? { ...p, date: e.target.value } : p
                          )
                        )
                      }
                      className='text-xs text-muted-foreground mr-4 bg-transparent border-b'
                    />
                  ) : (
                    <span className='text-xs text-muted-foreground mr-4'>
                      {post.date}
                    </span>
                  )}
                  <User className='w-3 h-3 mr-1' />
                  {isEditing ? (
                    <input
                      value={post.author}
                      onChange={(e) =>
                        setBlogPosts((prev) =>
                          prev.map((p, i) =>
                            i === index ? { ...p, author: e.target.value } : p
                          )
                        )
                      }
                      className='text-xs text-muted-foreground bg-transparent border-b'
                    />
                  ) : (
                    <span className='text-xs text-muted-foreground'>
                      {post.author}
                    </span>
                  )}
                </div>

                {isEditing ? (
                  <>
                    <input
                      value={post.title}
                      onChange={(e) =>
                        setBlogPosts((prev) =>
                          prev.map((p, i) =>
                            i === index ? { ...p, title: e.target.value } : p
                          )
                        )
                      }
                      className='font-semibold text-card-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2 w-full border-b bg-transparent'
                    />
                    <textarea
                      value={post.excerpt}
                      onChange={(e) =>
                        setBlogPosts((prev) =>
                          prev.map((p, i) =>
                            i === index ? { ...p, excerpt: e.target.value } : p
                          )
                        )
                      }
                      className='text-muted-foreground text-sm mb-4 line-clamp-3 w-full border-b bg-transparent'
                    />
                  </>
                ) : (
                  <>
                    <h3 className='font-semibold text-card-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2'>
                      {post.title}
                    </h3>
                    <p className='text-muted-foreground text-sm mb-4 line-clamp-3'>
                      {post.excerpt}
                    </p>
                  </>
                )}

                <motion.button
                  className='w-full mt-4 py-2 bg-primary/10 text-primary rounded-lg font-medium flex items-center justify-center gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300'
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openModal(post)}
                >
                  Read More
                  <ArrowRight className='w-4 h-4 transition-transform group-hover:translate-x-1' />
                </motion.button>
                {isEditing && (
                  <Button
                    size='sm'
                    variant='destructive'
                    className='mt-2'
                    onClick={() =>
                      setBlogPosts((prev) => prev.filter((_, i) => i !== index))
                    }
                  >
                    Remove
                  </Button>
                )}
              </div>
            </motion.article>
          ))}
          {isEditing && (
            <div className='flex items-center justify-center'>
              <Button
                onClick={() =>
                  setBlogPosts((prev) => [
                    ...prev,
                    {
                      id: Date.now(),
                      title: "New Blog Post",
                      excerpt: "Blog post excerpt...",
                      image: "",
                      category: "New Category",
                      date: "",
                      author: "",
                      content: "<p>Blog content...</p>",
                    },
                  ])
                }
                className='text-green-600'
              >
                + Add Blog Post
              </Button>
            </div>
          )}
        </div>
        {/* Show More Button */}
        <div className='flex justify-center mt-6'>
          {!showAllPosts && blogPosts.length > 4 && (
            <Button onClick={() => setShowAllPosts(true)}>Show More</Button>
          )}
          {showAllPosts && blogPosts.length > 4 && (
            <Button
              onClick={() => setShowAllPosts(false)}
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
        {isModalOpen && selectedPost && (
          <motion.div
            className='fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className='bg-card rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto'
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className='relative'>
                <ImageWithFallback
                  src={selectedPost.image}
                  alt={selectedPost.title}
                  className='w-full h-64 object-cover'
                />
                <button
                  onClick={closeModal}
                  className='absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors'
                >
                  <X className='w-4 h-4' />
                </button>
                <div className='absolute top-4 left-4'>
                  <span className='px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full'>
                    <span className='text-sm font-medium text-primary-foreground'>
                      {selectedPost.category}
                    </span>
                  </span>
                </div>
              </div>

              {/* Modal Content */}
              <div className='p-8'>
                <div className='flex items-center text-sm text-muted-foreground mb-4'>
                  <Calendar className='w-4 h-4 mr-1' />
                  <span className='text-sm text-muted-foreground mr-6'>
                    {selectedPost.date}
                  </span>

                  <User className='w-4 h-4 mr-1' />
                  <span className='text-sm text-muted-foreground mr-6'>
                    {selectedPost.author}
                  </span>
                </div>
                <h2 className='text-2xl font-bold text-card-foreground mb-6'>
                  {selectedPost.title}
                </h2>

                {/* Slider content */}
                <div className='prose prose-gray max-w-none text-card-foreground text-justify'
                  dangerouslySetInnerHTML={{ __html: slides[slideIndex] || "" }}
                />

                {slides.length > 1 && (
                  <div className='mt-6 flex items-center justify-between'>
                    <Button
                      variant='secondary'
                      onClick={() => setSlideIndex((i) => Math.max(0, i - 1))}
                      disabled={slideIndex === 0}
                    >
                      Previous
                    </Button>
                    <div className='text-sm text-muted-foreground'>
                      {slideIndex + 1} / {slides.length}
                    </div>
                    <Button
                      onClick={() => setSlideIndex((i) => Math.min(slides.length - 1, i + 1))}
                      disabled={slideIndex === slides.length - 1}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
