import { Quote, Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    position: 'CEO, TechCorp',
    rating: 5,
    review: "John delivered an exceptional e-commerce platform that exceeded our expectations. His attention to detail and technical expertise helped us increase our conversion rate by 40%."
  },
  {
    name: 'Michael Chen',
    position: 'CTO, StartupCo',
    rating: 5,
    review: "Working with John was a game-changer for our startup. He built our entire tech stack from scratch and helped us scale from 0 to 10,000 users in just 6 months."
  },
  {
    name: 'Emily Rodriguez',
    position: 'Product Manager, InnovateLabs',
    rating: 5,
    review: "John's ability to translate complex requirements into elegant solutions is remarkable. He developed our fintech dashboard that handles millions of transactions daily."
  }
];

export function SimpleTestimonials() {
  return (
    <section className="py-20 bg-yellow-50 dark:bg-yellow-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl text-foreground mb-4">
            What <span className="text-yellow-500">Clients Say</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Don't just take my word for it. Here's what my clients have to say 
            about working with me and the results we've achieved together.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              {/* Quote Icon */}
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mb-4">
                <Quote className="w-6 h-6 text-gray-900" />
              </div>

              {/* Stars */}
              <div className="flex space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Review */}
              <p className="text-muted-foreground leading-relaxed mb-6">
                "{testimonial.review}"
              </p>

              {/* Client Info */}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center">
                  <span className="text-gray-900 text-lg">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h4 className="text-foreground mb-1">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.position}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
         <div className="text-center mt-16">
          <div className="bg-card rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl text-foreground mb-4">
              Ready to be the next success story?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Join the growing list of satisfied clients who have transformed 
              their businesses with innovative digital solutions.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center px-8 py-3 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Start Your Success Story
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}