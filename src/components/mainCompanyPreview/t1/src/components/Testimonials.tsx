import { useState, useEffect } from "react";
import { motion } from "motion/react";
import maleAvatar from "/logos/maleAvatar.png";
import femaleAvatar from "/logos/femaleAvatar.png";

interface Testimonial {
  name: string;
  rating?: number;
  image?: string;
  role?: string;
  quote?: string;
  gender?: string;
}

interface TestimonialsContent {
  headline: {
    title: string;
    description: string;
  };
  testimonials: Testimonial[];
}

interface EditableTestimonialsProps {
  content?: TestimonialsContent;
}

export default function EditableTestimonials({
  content,
}: EditableTestimonialsProps) {
  const initialData: TestimonialsContent = content ?? {
    headline: { title: "", description: "" },
    testimonials: [],
  };

  const [current, setCurrent] = useState<number>(0);
  const [testimonialsData] = useState<TestimonialsContent>(initialData);

  // Auto-rotate testimonials
  useEffect(() => {
    if (testimonialsData.testimonials.length > 0) {
      const interval = setInterval(
        () => setCurrent((c) => (c + 1) % testimonialsData.testimonials.length),
        5000
      );
      return () => clearInterval(interval);
    }
  }, [testimonialsData.testimonials.length]);

  const renderStars = (rating?: number) => {
    const stars: JSX.Element[] = [];
    const rate = rating ?? 0;
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={i <= rate ? "text-brand-yellow" : "text-ink-light"}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return testimonialsData.testimonials && testimonialsData.testimonials.length > 0 && (
    <section
      id="testimonials"
      className="bg-ink-offwhite py-16 scroll-mt-20"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="mb-4">
            <h2 className="text-3xl font-bold text-ink">
              {testimonialsData.headline.title}
            </h2>
          </div>
          
          <p className="text-ink-paragraph max-w-2xl mx-auto text-base">
            {testimonialsData.headline.description}
          </p>
        </div>

        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {testimonialsData.testimonials.map((testimonial, index) => (
              <div key={index} className="w-full flex-shrink-0">
                <div className="mx-4 bg-surface-card shadow-lg border-0 rounded-lg">
                  <div className="p-8 text-center">
                    <div className="mb-6">
                      <div className="w-16 h-16 bg-status-info rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                        <img
                          src={testimonial.image || (testimonial.gender === "male" ? maleAvatar : femaleAvatar)}
                          alt={testimonial.name}
                          className="w-full h-full object-cover scale-110"
                        />
                      </div>
                      <h3 className="font-semibold text-xl text-ink mb-2">
                        {testimonial.name}
                      </h3>
                      
                      <div className="flex justify-center mb-2">
                        {renderStars(testimonial.rating)}
                      </div>
                    </div>

                    <div className="mb-6">
                      <blockquote className="text-lg text-ink-paragraph italic text-justify">
                        "{testimonial.quote}"
                      </blockquote>
                    </div>

                    <div className="border-t pt-6">
                      <p className="text-ink-paragraph text-justify">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Dots */}
        {testimonialsData.testimonials.length > 0 && (
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
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
          </div>
        )}
      </div>
    </section>
  );
}