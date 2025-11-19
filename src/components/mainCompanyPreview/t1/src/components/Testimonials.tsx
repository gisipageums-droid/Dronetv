import { useState, useEffect, useRef } from "react";
import user from "/images/user.png"
export default function Testimonials({ content }) {
  const [current, setCurrent] = useState(0);
  const sectionRef = useRef(null);

  // Use the content prop directly
  const testimonialsData = content || {
    headline: {
      title: "What Our Clients Say",
      description: "Real experiences from clients who have transformed their operations with our drone solutions.",
    },
    testimonials: [],
    stats: []
  };

  useEffect(() => {
    const interval = setInterval(
      () => setCurrent((c) => (c + 1) % testimonialsData.testimonials.length),
      5000
    );
    return () => clearInterval(interval);
  }, [testimonialsData.testimonials.length]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={i <= rating ? "text-yellow-400" : "text-gray-300"}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <section
      id='testimonials'
      className='bg-gray-50 py-16 scroll-mt-20 relative'
      ref={sectionRef}
    >
      <div className='max-w-6xl mx-auto px-6'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold text-gray-900 mb-4'>
            {testimonialsData.headline.title}
          </h2>
          <p className='text-gray-600 max-w-2xl mx-auto text-justify'>
            {testimonialsData.headline.description}
          </p>
        </div>

        {/* Stats Section */}
        {/* {testimonialsData.stats.length > 0 && (
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6 mb-12'>
            {testimonialsData.stats.map((stat, index) => (
              <div
                key={index}
                className='bg-white p-6 rounded-lg shadow-sm text-center'
              >
                <div className='text-3xl font-bold text-blue-600 mb-2'>
                  {stat.value}
                </div>
                <div className='text-gray-600'>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )} */}

        <div className='relative overflow-hidden'>
          <div
            className='flex transition-transform duration-500 ease-in-out'
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {testimonialsData.testimonials.map((testimonial, index) => (
              <div key={index} className='w-full flex-shrink-0'>
                <div className='mx-4 bg-white shadow-lg border-0 rounded-lg'>
                  <div className='p-8 text-center'>
                    <div className='mb-6'>
                      <div className='w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden'>
                        <img
                          src={testimonial.image || user}
                          alt={testimonial.name}
                          className='w-full h-full object-cover'
                        />
                      </div>
                      <h3 className='font-semibold text-xl text-gray-900 mb-2'>
                        {testimonial.name}
                      </h3>
                      <div className='flex justify-center mb-2'>
                        {renderStars(testimonial.rating)}
                      </div>
                    </div>

                    <div className='mb-6'>
                      <blockquote className='text-lg text-gray-700 italic text-justify'>
                        "{testimonial.quote}"
                      </blockquote>
                    </div>

                    <div className='border-t pt-6'>
                      <p className='text-gray-600'>
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
          <div className='flex justify-center space-x-2 mt-8'>
            {testimonialsData.testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${index === current
                    ? "bg-blue-600"
                    : "bg-gray-300 hover:bg-gray-400"
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