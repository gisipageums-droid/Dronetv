import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { Star, Quote } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  position: string;
  company?: string;
  image?: string;
  rating: number;
  text: string;
}

interface TestimonialsProps {
  apiResponse: {
    testimonials: Array<{
      M: {
        name: { S: string };
        rating: { N: string };
        photo?: {
          M: {
            preview?: { NULL: boolean };
            file?: { M: Record<string, unknown> };
          };
        };
        role?: { S: string };
        quote: { S: string };
        company?: { S: string };
      };
    }>;
    testimonials_0__photo?: string;
    // Add other photo URLs if you have more testimonials
  };
}

const Testimonials: React.FC<TestimonialsProps> = ({ apiResponse }) => {
  // Transform the API response into a more usable format
  const processTestimonials = (): Testimonial[] => {
    return apiResponse.testimonials.map((testimonial, index) => {
      const photoUrl = apiResponse[`testimonials_${index}__photo` as keyof typeof apiResponse];
      
      return {
        id: `testimonial-${index}`,
        name: testimonial.M.name.S || 'Anonymous',
        position: testimonial.M.role?.S || 'Client',
        company: testimonial.M.company?.S,
        image: photoUrl as string || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        rating: parseInt(testimonial.M.rating.N) || 5,
        text: testimonial.M.quote.S
      };
    });
  };

  const testimonials = processTestimonials();

  return (
    <section id="testimonials" className="py-20 bg-ink">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 data-aos="fade-up" className="text-4xl md:text-5xl font-bold text-white mb-4">
            Client <span className="text-[#F8C400]">Testimonials</span>
          </h2>
          <div data-aos="fade-up" data-aos-delay="200" className="w-24 h-1 bg-[#DC2626] mx-auto mb-6"></div>
          <p data-aos="fade-up" data-aos-delay="400" className="text-ink-caption max-w-2xl mx-auto">
            Don't just take my word for it. Here's what my clients say about working with me.
          </p>
        </div>

        {testimonials.length > 0 ? (
          <div data-aos="fade-up" data-aos-delay="600" className="relative">
            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              pagination={{ 
                clickable: true,
                bulletClass: 'swiper-pagination-bullet testimonial-bullet',
                bulletActiveClass: 'swiper-pagination-bullet-active testimonial-bullet-active'
              }}
              autoplay={{ 
                delay: 4000, 
                disableOnInteraction: false,
                pauseOnMouseEnter: true
              }}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
              }}
              className="testimonials-swiper-2 pb-16"
            >
              {testimonials.map((testimonial) => (
                <SwiperSlide key={testimonial.id}>
                  <div className="relative bg-ink rounded-3xl p-8 h-full shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 border border-[#F8C400]/20">
                    {/* Quote Icon */}
                    <div className="absolute -top-4 left-8 w-8 h-8 bg-[#DC2626] rounded-full flex items-center justify-center">
                      <Quote size={16} className="text-white" />
                    </div>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-6 mt-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} size={16} className="text-[#F8C400] fill-current" />
                      ))}
                    </div>
                    
                    {/* Testimonial Text */}
                    <p className="text-ink-light mb-8 italic leading-relaxed text-lg">
                      "{testimonial.text}"
                    </p>
                    
                    {/* Client Info */}
                    <div className="flex items-center gap-4 mt-auto pt-6 border-t border-ink-charcoal">
                      <div className="relative">
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name}
                          className="w-14 h-14 rounded-full object-cover border-2 border-[#F8C400]"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';
                          }}
                        />
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#F8C400]/20 to-[#DC2626]/20"></div>
                      </div>
                      
                      <div>
                        <h4 className="font-bold text-white text-lg">
                          {testimonial.name}
                        </h4>
                        <p className="text-[#F8C400] text-sm font-medium">
                          {testimonial.position}
                        </p>
                        {testimonial.company && (
                          <p className="text-ink-caption text-xs">
                            {testimonial.company}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-ink-caption">No testimonials available at the moment.</p>
          </div>
        )}

        {/* Call to Action */}
        <div data-aos="fade-up" data-aos-delay="800" className="text-center mt-16">
          <div className="bg-gradient-to-r from-[#F8C400] to-[#F8C400]/80 rounded-3xl p-12 max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold text-ink mb-4">
              Ready to Create Something Amazing?
            </h3>
            <p className="text-ink/80 mb-8 text-lg">
              Join these satisfied clients and let's bring your vision to life with stunning aerial content.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-[#DC2626] hover:bg-[#DC2626]/90 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
                Start Your Project
              </button>
              <button className="border-2 border-ink text-ink hover:bg-ink-charcoal hover:text-white px-8 py-4 rounded-full font-semibold transition-all duration-300">
                View Portfolio
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .testimonial-bullet {
          background: #F8C400 !important;
          opacity: 0.5 !important;
          width: 12px !important;
          height: 12px !important;
        }
        .testimonial-bullet-active {
          background: #DC2626 !important;
          opacity: 1 !important;
          transform: scale(1.2) !important;
        }
      `}</style>
    </section>
  );
};

export default Testimonials;