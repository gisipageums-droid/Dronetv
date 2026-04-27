import { Quote, Star } from 'lucide-react';
import { motion } from 'motion/react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    position: 'CEO, TechCorp',
    company: 'TechCorp',
    image: 'https://images.unsplash.com/photo-1642522029691-029b5a432954?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBidXNpbmVzcyUyMG1lZXRpbmd8ZW58MXx8fHwxNzU3NDU1NjgyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 5,
    review: "John delivered an exceptional e-commerce platform that exceeded our expectations. His attention to detail and technical expertise helped us increase our conversion rate by 40%. The project was completed on time and within budget."
  },
  {
    name: 'Michael Chen',
    position: 'CTO, StartupCo',
    company: 'StartupCo',
    image: 'https://images.unsplash.com/photo-1698012184798-501b005288ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFydHVwJTIwY29tcGFueSUyMG9mZmljZXxlbnwxfHx8fDE3NTc0MDc2ODl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 5,
    review: "Working with John was a game-changer for our startup. He built our entire tech stack from scratch and helped us scale from 0 to 10,000 users in just 6 months. His strategic thinking and problem-solving skills are unmatched."
  },
  {
    name: 'Emily Rodriguez',
    position: 'Product Manager, InnovateLabs',
    company: 'InnovateLabs',
    image: 'https://images.unsplash.com/photo-1661347998996-dcf102498c63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwY29tcGFueSUyMGxvZ29zJTIwYnVzaW5lc3N8ZW58MXx8fHwxNzU3NTA3Njc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 5,
    review: "John's ability to translate complex requirements into elegant solutions is remarkable. He developed our fintech dashboard that handles millions of transactions daily. The performance and security standards he implemented are industry-leading."
  },
  {
    name: 'David Thompson',
    position: 'Founder, DigitalFirst',
    company: 'DigitalFirst',
    image: 'https://images.unsplash.com/photo-1642522029691-029b5a432954?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBidXNpbmVzcyUyMG1lZXRpbmd8ZW58MXx8fHwxNzU3NDU1NjgyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 5,
    review: "John transformed our healthcare platform with cutting-edge technology. His expertise in both frontend and backend development saved us from hiring multiple specialists. The final product is intuitive, secure, and scalable."
  },
  {
    name: 'Lisa Park',
    position: 'VP Engineering, CloudVentures',
    company: 'CloudVentures',
    image: 'https://images.unsplash.com/photo-1698012184798-501b005288ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFydHVwJTIwY29tcGFueSUyMG9mZmljZXxlbnwxfHx8fDE3NTc0MDc2ODl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 5,
    review: "Outstanding work on our SaaS platform! John not only delivered a robust application but also provided valuable insights on architecture and scalability. His code quality and documentation standards are exceptional."
  },
  {
    name: 'Robert Kim',
    position: 'Director of IT, NextGen Solutions',
    company: 'NextGen Solutions',
    image: 'https://images.unsplash.com/photo-1661347998996-dcf102498c63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwY29tcGFueSUyMGxvZ29zJTIwYnVzaW5lc3N8ZW58MXx8fHwxNzU3NTA3Njc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 5,
    review: "John's enterprise solution streamlined our entire workflow and increased productivity by 60%. His understanding of enterprise needs and ability to deliver enterprise-grade applications is truly impressive."
  }
];

export function Testimonials() {
  return (
    <section className="py-20 bg-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl text-gray-900 mb-4">
            What <span className="text-yellow-500">Clients Say</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don't just take my word for it. Here's what my clients have to say
            about working with me and the results we've achieved together.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {/* Quote Icon */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                viewport={{ once: true }}
                className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mb-4"
              >
                <Quote className="w-6 h-6 text-gray-900" />
              </motion.div>

              {/* Stars */}
              <div className="flex space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 + 0.3 + i * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  </motion.div>
                ))}
              </div>

              {/* Review */}
              <p className="text-gray-600 leading-relaxed mb-6">
                "{testimonial.review}"
              </p>

              {/* Client Info */}
              <div className="flex items-center space-x-4">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="relative"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center">
                      <span className="text-gray-900 text-lg">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                </motion.div>
                <div>
                  <h4 className="text-gray-900 mb-1">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.position}</p>
                  <p className="text-sm text-yellow-600">{testimonial.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg transition-colors duration-500">
            <h3 className="text-2xl text-gray-900 dark:text-white mb-4">
              Ready to be the next success story?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-xl mx-auto">
              Join the growing list of satisfied clients who have transformed
              their businesses with innovative digital solutions.
            </p>
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-8 py-3 bg-yellow-400 dark:bg-yellow-500 text-gray-900 dark:text-gray-900 rounded-lg hover:bg-yellow-500 dark:hover:bg-yellow-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Start Your Success Story
            </motion.a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}