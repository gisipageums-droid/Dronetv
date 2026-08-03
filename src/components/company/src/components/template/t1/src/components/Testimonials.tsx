import { useState, useEffect, useRef } from "react";

// Mock icons (replace with actual icons if available)
const Cust1 = () => <div className="w-8 h-8 bg-status-info rounded-full"></div>;
const Cust2 = () => <div className="w-8 h-8 bg-status-success rounded-full"></div>;
const Cust3 = () => <div className="w-8 h-8 bg-brand-gold rounded-full"></div>;
const Cust4 = () => <div className="w-8 h-8 bg-status-warning rounded-full"></div>;

const staticTestimonialsData = {
  headline: {
    title: "What Our Clients Say",
    description: "Real experiences from clients who have transformed their operations with our solutions.",
  },
  testimonials: [
    {
      id: 1,
      name: "Aarav Mehta",
      role: "CEO, BrightWave",
      quote: "Working with them was a game-changer for our business. Their innovative approach helped us achieve results we never thought possible.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Sarah Chen",
      role: "CTO, TechForward",
      quote: "They helped us achieve 3x growth in just 18 months. Their expertise and dedication are unmatched in the industry.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Michael Rodriguez",
      role: "Founder, InnovateLab",
      quote: "Their expertise transformed our entire business strategy. The ROI has been phenomenal and the partnership continues to deliver value.",
      rating: 4,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 4,
      name: "Emily Watson",
      role: "COO, CloudSync",
      quote: "The results exceeded all our expectations. Professional, reliable, and truly innovative in their solutions.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    }
  ],
  stats: [
    {
      value: "98%",
      label: "Client Satisfaction"
    },
    {
      value: "4.9/5",
      label: "Average Rating"
    },
    {
      value: "200+",
      label: "Projects Completed"
    },
    {
      value: "50+",
      label: "Clients Worldwide"
    }
  ]
};

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const sectionRef = useRef(null);

  // Use the static data
  const testimonialsData = staticTestimonialsData;

  useEffect(() => {
    if (testimonialsData.testimonials.length > 0) {
      const interval = setInterval(
        () => setCurrent((c) => (c + 1) % testimonialsData.testimonials.length),
        5000
      );
      return () => clearInterval(interval);
    }
  }, [testimonialsData.testimonials.length]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={i <= rating ? "text-brand-yellow" : "text-ink-light"}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <section
      id="testimonials"
      className="bg-ink-offwhite py-16 scroll-mt-20 relative"
      ref={sectionRef}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-ink mb-4">
            {testimonialsData.headline.title}
          </h2>
          <p className="text-ink-paragraph max-w-2xl mx-auto">
            {testimonialsData.headline.description}
          </p>
        </div>

        {/* Stats Section */}
        {/* {testimonialsData.stats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {testimonialsData.stats.map((stat, index) => (
              <div
                key={index}
                className="bg-surface-card p-6 rounded-lg shadow-sm text-center"
              >
                <div className="text-3xl font-bold text-status-info mb-2">
                  {stat.value}
                </div>
                <div className="text-ink-paragraph">{stat.label}</div>
              </div>
            ))}
          </div>
        )} */}

        {/* Testimonials Carousel */}
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {testimonialsData.testimonials.map((testimonial, index) => (
              <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                <div className="bg-surface-card shadow-lg border-0 rounded-lg h-full">
                  <div className="p-8 text-center h-full flex flex-col">
                    <div className="mb-6 flex-grow">
                      <div className="w-16 h-16 bg-status-info rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face";
                          }}
                        />
                      </div>
                      <h3 className="font-semibold text-xl text-ink mb-2">
                        {testimonial.name}
                      </h3>
                      <div className="flex justify-center mb-2">
                        {renderStars(testimonial.rating)}
                      </div>
                    </div>

                    <div className="mb-6 flex-grow">
                      <blockquote className="text-lg text-ink-paragraph italic leading-relaxed">
                        "{testimonial.quote}"
                      </blockquote>
                    </div>

                    <div className="border-t pt-6">
                      <p className="text-ink-paragraph font-medium">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Dots */}
        {testimonialsData.testimonials.length > 0 && (
          <div className="flex justify-center space-x-2 mt-8">
            {testimonialsData.testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  index === current
                    ? "bg-status-info"
                    : "bg-ink-light hover:bg-ink-caption"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}