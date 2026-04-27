import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import { Star, Quote } from 'lucide-react';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      position: 'Real Estate Agent',
      company: 'Premium Properties',
      image: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 5,
      text: 'Alex delivered exceptional aerial photography for our luxury property listings. The quality and professionalism exceeded our expectations completely.'
    },
    {
      id: 2,
      name: 'Michael Chen',
      position: 'Construction Manager',
      company: 'BuildTech Solutions',
      image: 'https://images.pexels.com/photos/1310522/pexels-photo-1310522.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 5,
      text: 'Outstanding drone services for our construction documentation. The time-lapse videos helped us track progress and communicate with stakeholders effectively.'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      position: 'Marketing Director',
      company: 'Creative Agency',
      image: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 5,
      text: 'The aerial cinematography brought our brand campaign to life. Alex\'s creative vision and technical expertise made all the difference in our project success.'
    },
    {
      id: 4,
      name: 'David Thompson',
      position: 'Event Coordinator',
      company: 'Elite Events',
      image: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 5,
      text: 'Professional drone coverage for our outdoor events. The team was reliable, efficient, and delivered stunning footage that captured every important moment.'
    },
    {
      id: 5,
      name: 'Lisa Wang',
      position: 'Tourism Manager',
      company: 'Coastal Tourism Board',
      image: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 5,
      text: 'Incredible aerial footage of our coastal attractions. The videos significantly boosted our tourism campaign and helped showcase our region beautifully.'
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 data-aos="fade-up" className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-4">
            Client <span className="text-[#FF0000]">Testimonials</span>
          </h2>
          <div data-aos="fade-up" data-aos-delay="200" className="w-24 h-1 bg-[#FFD400] mx-auto mb-6"></div>
          <p data-aos="fade-up" data-aos-delay="400" className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Don't just take my word for it. Here's what my clients say about working with me.
          </p>
        </div>

        <div data-aos="fade-up" data-aos-delay="600" className="relative">
          <Swiper
            modules={[Pagination, Navigation, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            pagination={{ clickable: true }}
            navigation={true}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 }
            }}
            className="testimonials-swiper"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 h-full relative group hover:shadow-xl transition-all duration-300">
                  {/* Quote Icon */}
                  <div className="absolute top-6 right-6 text-[#FFD400] opacity-50 group-hover:opacity-100 transition-opacity">
                    <Quote size={32} />
                  </div>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={16} className="text-[#FFD400] fill-current" />
                    ))}
                  </div>
                  
                  {/* Testimonial Text */}
                  <p className="text-gray-700 dark:text-gray-300 mb-6 italic leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  
                  {/* Client Info */}
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="relative">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FFD400] to-[#FF0000] opacity-0 group-hover:opacity-20 transition-opacity"></div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-black dark:text-white">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {testimonial.position}
                      </p>
                      <p className="text-xs text-[#FF0000] font-medium">
                        {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Call to Action */}
        <div data-aos="fade-up" data-aos-delay="800" className="text-center mt-16">
          <div className="bg-[#FFD400] rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-black mb-4">
              Ready to Work Together?
            </h3>
            <p className="text-black/80 mb-6">
              Join these satisfied clients and let's create something amazing together.
            </p>
            <button className="bg-[#FF0000] hover:bg-[#FF0000]/90 text-white px-8 py-3 rounded-full font-semibold transition-colors">
              Start Your Project
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;