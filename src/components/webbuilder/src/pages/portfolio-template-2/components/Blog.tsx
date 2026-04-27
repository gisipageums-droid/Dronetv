import React from 'react';
import { Calendar, ArrowRight, User } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
  url: string;
}

interface BlogProps {
  apiResponse: {
    blogPosts: Array<{
      M: {
        title: { S: string };
        excerpt: { S: string };
        url: { S: string };
        date?: { S: string };
        author?: { S: string };
        category?: { S: string };
        readTime?: { S: string };
        image?: {
          M: {
            preview?: { NULL: boolean };
            file?: { M: Record<string, unknown> };
          };
        };
      };
    }>;
    blogPosts_0__image?: string;
    // Add other image URLs if you have more blog posts
  };
}

const Blog: React.FC<BlogProps> = ({ apiResponse }) => {
  // Transform the API response into a more usable format
  const processBlogPosts = (): BlogPost[] => {
    return apiResponse.blogPosts.map((post, index) => {
      const imageUrl = apiResponse[`blogPosts_${index}__image` as keyof typeof apiResponse];
      
      return {
        id: `post-${index}`,
        title: post.M.title.S,
        excerpt: post.M.excerpt.S,
        image: imageUrl as string || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
        date: post.M.date?.S || new Date().toISOString().split('T')[0],
        author: post.M.author?.S || 'Unknown Author',
        category: post.M.category?.S || 'Uncategorized',
        readTime: post.M.readTime?.S || '5 min read',
        url: post.M.url.S
      };
    });
  };

  const blogPosts = processBlogPosts();

  return (
    <section id="blog" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 data-aos="fade-up" className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-4">
            Latest <span className="text-[#FF0000]">Blog Posts</span>
          </h2>
          <div data-aos="fade-up" data-aos-delay="200" className="w-24 h-1 bg-[#FFD400] mx-auto mb-6"></div>
          <p data-aos="fade-up" data-aos-delay="400" className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Stay updated with the latest insights, tips, and trends in drone technology and aerial photography.
          </p>
        </div>

        {blogPosts.length > 0 ? (
          <div className="max-w-6xl mx-auto space-y-8">
            {blogPosts.map((post, index) => (
              <div 
                key={post.id}
                data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
                data-aos-delay={index * 200}
                className={`group flex items-center gap-8 bg-white dark:bg-gray-900 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } flex-col lg:flex-row`}
              >
                {/* Image */}
                <div className="flex-1 relative overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-64 lg:h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-6 left-6">
                    <span className="bg-[#FF0000] text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-8 lg:p-12">
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>{new Date(post.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User size={16} />
                      <span>{post.author}</span>
                    </div>
                    <span className="text-[#FF0000] font-medium">{post.readTime}</span>
                  </div>

                  <h3 className="text-2xl lg:text-3xl font-bold text-black dark:text-white mb-4 group-hover:text-[#FF0000] transition-colors duration-300">
                    {post.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed text-lg">
                    {post.excerpt}
                  </p>

                  <a 
                    href={post.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group/btn inline-flex items-center gap-3 text-[#FF0000] font-semibold hover:gap-4 transition-all duration-300"
                  >
                    <span>Read More</span>
                    <ArrowRight size={20} className="transform group-hover/btn:translate-x-1 transition-transform duration-300" />
                    <div className="w-0 h-0.5 bg-[#FF0000] group-hover/btn:w-8 transition-all duration-300"></div>
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">No blog posts available at the moment.</p>
          </div>
        )}

        {/* View All Button */}
        <div data-aos="fade-up" data-aos-delay="800" className="text-center mt-16">
          <button className="bg-[#FFD400] hover:bg-[#FFD400]/90 text-black px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            View All Blog Posts
          </button>
        </div>
      </div>
    </section>
  );
};

export default Blog;