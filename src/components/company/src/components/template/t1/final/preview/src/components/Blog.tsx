import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { X, Calendar, Clock, User } from "lucide-react";

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

function BlogModal({ blog, onClose }: { blog: any; onClose: () => void }) {
  // Handle escape key to close modal
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl"
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
            className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-2 transition-colors shadow-lg dark:bg-gray-700 dark:hover:bg-gray-600"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-900 dark:text-white" />
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
        <div className="overflow-y-auto max-h-[calc(70vh-16rem)] p-8">
          {/* Excerpt */}
          <div className="mb-8">
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {blog.excerpt}
            </p>
          </div>

          {/* Blog Outline if available */}
          {blog.outline && blog.outline.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="text-indigo-600">📋</span> In this article:
              </h3>
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-xl border border-indigo-100 dark:border-indigo-800">
                <ul className="space-y-3">
                  {blog.outline.map((item: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="text-indigo-600 dark:text-indigo-400 mr-3 mt-1 text-lg">
                        •
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">
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
            <div className="text-gray-700 dark:text-gray-300 leading-7 space-y-6 text-base">
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

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
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
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Keywords:
              </h4>
              <div className="flex flex-wrap gap-2">
                {blog.keywords.map((keyword: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-sm rounded-full border border-indigo-200 dark:border-indigo-700"
                  >
                    #{keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA Button */}
          <div className="flex justify-center pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              onClick={onClose}
              className="px-8 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Close Article
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Blog({ blogData }) {
  const [selectedBlog, setSelectedBlog] = useState(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Use the blogData prop directly
  const content = {
    header: blogData.header,
    posts: blogData.posts.map((post, index) => ({
      ...post,
      date: post.date
        ? new Date(post.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
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
        className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-500 scroll-mt-20 relative"
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
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {content.header.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {content.header.desc}
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
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
                    <Card className="shadow-lg dark:bg-gray-700 transition-all duration-300 overflow-hidden group cursor-pointer">
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
                        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{b.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{b.readTime || "5 min read"}</span>
                          </div>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {b.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                          {b.excerpt}
                        </p>
                        <div className="flex justify-between items-center mt-4">
                          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
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
                              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
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
