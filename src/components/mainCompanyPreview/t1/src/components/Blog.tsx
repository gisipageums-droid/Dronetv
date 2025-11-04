import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useState, useEffect } from "react";
// import blog1 from "/images/blog/blog1.jpg";
// import blog2 from "/images/blog/blog2.jpg";
// import blog3 from "/images/blog/blog3.jpg";
import { motion, AnimatePresence } from "framer-motion";

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
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center mt-12 bg-black/70 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto my-auto m-5"
        onClick={(e) => e.stopPropagation()}
        style={{ margin: "1rem" }}
      >
        {/* Close Button - Fixed positioning */}
        <button
          className="absolute -top-0.5 -right-0.5 z-[1010]  hover:bg-gray-600 rounded-full p-2 text-white transition-colors shadow-lg flex items-center justify-center"
          onClick={onClose}
          aria-label="Close modal"
          style={{ width: "32px", height: "32px" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Hero Image */}
        <div className="relative">
          <img
            src={blog.image}
            className="w-full h-48 object-cover rounded-t-xl"
            alt={blog.title}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <div className="flex justify-between items-center">
              <div className="text-white">
                <span className="text-xs bg-indigo-600 px-2 py-1 rounded-full">
                  {blog.category}
                </span>
                <p className="text-xs mt-1 opacity-90">
                  {blog.date} • {blog.readTime || "5 min read"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {blog.title}
          </h1>

          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
            {blog.excerpt}
          </p>

          {/* Blog Outline if available */}
          {blog.outline && blog.outline.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                In this article:
              </h3>
              <ul className="space-y-1 text-sm">
                {blog.outline.map((item: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="text-indigo-600 dark:text-indigo-400 mr-2 mt-1">
                      •
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Main Content */}
          <div className="text-gray-700 dark:text-gray-300 leading-7 space-y-4 text-sm">
            {blog.content ? (
              <div dangerouslySetInnerHTML={{ __html: blog.content }} />
            ) : (
              <>
                <p>
                  Drone technology is rapidly transforming industries across
                  India, offering innovative solutions that were once considered
                  impossible. From agriculture to construction, the applications
                  of drone technology are vast and continually expanding.
                </p>

                <p>
                  In the agricultural sector, drones equipped with multispectral
                  sensors can monitor crop health, detect pest infestations, and
                  optimize irrigation. This technology enables farmers to make
                  data-driven decisions, resulting in increased yields and
                  reduced resource consumption.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                  The Future of Drone Technology
                </h3>

                <p>
                  As regulations evolve and technology advances, we can expect
                  to see even more innovative applications of drones in various
                  sectors. The integration of AI and machine learning with drone
                  technology will further enhance their capabilities, making
                  them indispensable tools for businesses looking to gain a
                  competitive edge.
                </p>
              </>
            )}
          </div>

          {/* Keywords if available */}
          {blog.keywords && blog.keywords.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-xs font-semibold text-gray-900 dark:text-white mb-2">
                Keywords:
              </h4>
              <div className="flex flex-wrap gap-1">
                {blog.keywords.map((keyword: string, index: number) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-xs rounded-full"
                  >
                    #{keyword}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function Blog({ blogData }: { blogData?: any }) {
  // Extract data from blogData prop or use defaults
  const defaultContent = {
    header: {
      title: blogData?.header?.title,
      desc: blogData?.header?.desc,
    },
    posts:
      blogData?.posts?.map((post, index) => ({
        id: post.id || index + 1,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        image: post.image || [blog1, blog2, blog3][index % 3],
        category: post.category,
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
        author: post.author || "",
        readTime: post.readTime || "",
        outline: post.outline || [],
        keywords: post.keywords || [],
      })) || [],
  };

  const [content] = useState(defaultContent);
  const [selectedBlog, setSelectedBlog] = useState(null);

  return (
    blogData?.posts &&
    blogData?.posts.length > 0 && (
      <>
        <motion.section
          id="blog"
          className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-500 scroll-mt-20 relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
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
                      <Card className="relative shadow-lg dark:bg-gray-700 transition-all duration-300 overflow-hidden h-[480px]">
                        <div className="relative">
                          <motion.img
                            src={b.image}
                            className="w-full h-48 object-cover"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                        <CardContent className="p-6 space-y-3">
                          <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                            <span>{b.date}</span>
                            <motion.span
                              className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
                              whileHover={{ scale: 1.05 }}
                            >
                              {b.category}
                            </motion.span>
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            {b.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 h-full overflow-auto">
                            {b.excerpt}
                          </p>
                          <div className="flex justify-between items-center mt-4 absolute bottom-4">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              <span>{b.author}</span>
                              <span className="mx-2">•</span>
                              <span>{b.readTime}</span>
                            </div>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button
                                variant="ghost"
                                className="text-red-500 dark:text-red-400 hover:text-red-600"
                                onClick={() => setSelectedBlog(b)}
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

        {/* Blog Details Modal */}
        {selectedBlog && (
          <BlogModal
            blog={selectedBlog}
            onClose={() => setSelectedBlog(null)}
          />
        )}
      </>
    )
  );
}
