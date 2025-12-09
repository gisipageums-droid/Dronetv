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
          className={i <= rate ? "text-yellow-400" : "text-gray-300"}
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
      className="bg-gray-50 py-16 scroll-mt-20"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="mb-4">
            <h2 className="text-3xl font-bold text-gray-900">
              {testimonialsData.headline.title}
            </h2>
          </div>
          
          <p className="text-gray-600 max-w-2xl mx-auto text-base">
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
                <div className="mx-4 bg-white shadow-lg border-0 rounded-lg">
                  <div className="p-8 text-center">
                    <div className="mb-6">
                      <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                        <img
                          src={testimonial.image || (testimonial.gender === "male" ? maleAvatar : femaleAvatar)}
                          alt={testimonial.name}
                          className="w-full h-full object-cover scale-110"
                        />
                      </div>
                      <h3 className="font-semibold text-xl text-gray-900 mb-2">
                        {testimonial.name}
                      </h3>
                      
                      <div className="flex justify-center mb-2">
                        {renderStars(testimonial.rating)}
                      </div>
                    </div>

                    <div className="mb-6">
                      <blockquote className="text-lg text-gray-700 italic text-justify">
                        "{testimonial.quote}"
                      </blockquote>
                    </div>

                    <div className="border-t pt-6">
                      <p className="text-gray-600 text-justify">
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
                      ? "bg-blue-600"
                      : "bg-gray-300 hover:bg-gray-400"
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