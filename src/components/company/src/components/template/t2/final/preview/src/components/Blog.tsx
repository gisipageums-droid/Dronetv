import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, User, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';

export default function Blog({ blogData }) {
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAllPosts, setShowAllPosts] = useState(false);

  const displayedPosts = showAllPosts ? blogData.posts : blogData.posts.slice(0, 4);

  const openModal = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <section id="blog" className="py-20 bg-background theme-transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <span className="font-semibold text-lg">{blogData.header.badge}</span>
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl text-foreground mb-6">{blogData.header.title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{blogData.header.desc}</p>
        </motion.div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayedPosts.map((post, index) => (
            <motion.article
              key={post.id}
              className="bg-card rounded-xl border-2 shadow-lg hover:shadow-xl  shadow-gray-500 transition-all duration-300 overflow-hidden group cursor-pointer flex flex-col h-full"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden flex-shrink-0">
                <ImageWithFallback
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center text-xs text-muted-foreground mb-3 flex-shrink-0">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span className="text-xs text-muted-foreground mr-4">{post.date}</span>
                  <User className="w-3 h-3 mr-1" />
                  <span className="text-xs text-muted-foreground">{post.author}</span>
                </div>

                <div className="flex-grow mb-4">
                  <h3 className="font-semibold text-card-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2 min-h-[3rem]">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-3 min-h-[4.5rem]">
                    {post.excerpt}
                  </p>
                </div>

                <div className="mt-auto">
                  <motion.button
                    className="w-full py-2 bg-primary/10 text-primary rounded-lg font-medium flex items-center justify-center gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => openModal(post)}
                  >
                    Read More
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </motion.button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
          
        {/* Show More Button */}
        <div className="flex justify-center mt-6">
          {!showAllPosts && blogData.posts.length > 4 && (
            <Button onClick={() => setShowAllPosts(true)}>
              Show More
            </Button>
          )}
          {showAllPosts && blogData.posts.length > 4 && (
            <Button
              onClick={() => setShowAllPosts(false)}
              variant="secondary"
              className="ml-4"
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
            className="fixed inset-0 backdrop-blur-xl flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="bg-card relative top-[3.5rem] shadow-2xl rounded-xl max-w-4xl w-full max-h-[75vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="relative">
                <ImageWithFallback
                  src={selectedPost.image}
                  alt={selectedPost.title}
                  className="w-full h-64 object-cover"
                />
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                    <span className="text-sm font-medium text-primary-foreground">{selectedPost.category}</span>
                  </span>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-8">
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span className="text-sm text-muted-foreground mr-6">{selectedPost.date}</span>
                  <User className="w-4 h-4 mr-1" />
                  <span className="text-sm text-muted-foreground mr-6">{selectedPost.author}</span>
                </div>

                <h2 className="text-2xl font-bold text-card-foreground mb-6">{selectedPost.title}</h2>
                <div
                  className="prose prose-gray max-w-none text-card-foreground"
                  dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                />
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t">
                <Button variant="secondary" onClick={closeModal}>
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}