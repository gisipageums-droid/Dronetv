import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { Star, Quote } from 'lucide-react';

const ClientsSection: React.FC = () => {
  const clients = [
    {
      name: 'Defense Systems Ltd',
      logo: 'https://images.pexels.com/photos/1851415/pexels-photo-1851415.jpeg?auto=compress&cs=tinysrgb&w=200',
      industry: 'Defense'
    },
    {
      name: 'AgriTech Solutions',
      logo: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=200',
      industry: 'Agriculture'
    },
    {
      name: 'SecureWatch Corp',
      logo: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=200',
      industry: 'Security'
    },
    {
      name: 'Mining Dynamics',
      logo: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=200',
      industry: 'Mining'
    },
    {
      name: 'Urban Planning Co',
      logo: 'https://images.pexels.com/photos/1310522/pexels-photo-1310522.jpeg?auto=compress&cs=tinysrgb&w=200',
      industry: 'Urban Planning'
    },
    {
      name: 'Energy Grid Systems',
      logo: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=200',
      industry: 'Energy'
    }
  ];

  const testimonials = [
    {
      name: 'Colonel Rajesh Sharma',
      position: 'Defense Operations Director',
      company: 'Defense Systems Ltd',
      image: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 5,
      text: 'DroneFlight\'s surveillance systems have exceeded our expectations. The precision and reliability are unmatched in critical defense operations.'
    },
    {
      name: 'Dr. Priya Mehta',
      position: 'Agricultural Technology Lead',
      company: 'AgriTech Solutions',
      image: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 5,
      text: 'The agricultural drones have revolutionized our farming operations. Crop yields increased by 40% with their precision monitoring technology.'
    },
    {
      name: 'Michael Chen',
      position: 'Security Operations Manager',
      company: 'SecureWatch Corp',
      image: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 5,
      text: 'Outstanding surveillance capabilities with real-time threat detection. DroneFlight has transformed our security infrastructure completely.'
    }
  ];

  return (
    <section id="clients" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        {/* Clients Section */}
        <div className="text-center mb-16">
          <h2 data-aos="fade-up" className="text-4xl md:text-6xl font-bold text-[#FFD400] mb-4">
            Trusted by the <span className="text-white">Best</span>
          </h2>
          <div data-aos="fade-up" data-aos-delay="200" className="w-32 h-1 bg-[#FFD400] mx-auto mb-6"></div>
          <p data-aos="fade-up" data-aos-delay="400" className="text-gray-300 text-lg">
            Leading organizations across defense, agriculture, and innovation trust our drone solutions.
          </p>
        </div>

        {/* Client Logos */}
        <div className="mb-20">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={30}
            slidesPerView={2}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop={true}
            breakpoints={{
              640: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 6 }
            }}
            className="clients-swiper"
          >
            {clients.map((client, index) => (
              <SwiperSlide key={index}>
                <div className="group flex flex-col items-center p-6 bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-800 hover:border-[#FFD400]/50 transition-all duration-300 transform hover:scale-105">
                  <div className="w-16 h-16 bg-gray-800 rounded-full mb-4 overflow-hidden group-hover:ring-4 group-hover:ring-[#FFD400]/30 transition-all grayscale group-hover:grayscale-0">
                    <img 
                      src={client.logo} 
                      alt={client.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-sm font-semibold text-white text-center mb-1 group-hover:text-[#FFD400] transition-colors">
                    {client.name}
                  </h3>
                  <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                    {client.industry}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Testimonials */}
        <div className="text-center mb-12">
          <h3 data-aos="fade-up" className="text-3xl font-bold text-white mb-4">
            What Our <span className="text-[#FFD400]">Partners Say</span>
          </h3>
          <div data-aos="fade-up" data-aos-delay="200" className="w-24 h-1 bg-[#FF0000] mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              data-aos="fade-up" 
              data-aos-delay={index * 200}
              className="group relative bg-gray-900/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-800 hover:border-[#FFD400]/50 transition-all duration-500 transform hover:scale-105"
            >
              {/* Quote Icon */}
              <div className="absolute -top-4 left-8 w-8 h-8 bg-[#FF0000] rounded-full flex items-center justify-center">
                <Quote size={16} className="text-white" />
              </div>
              
              {/* Rating */}
              <div className="flex items-center gap-1 mb-6 mt-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} className="text-[#FFD400] fill-current" />
                ))}
              </div>
              
              {/* Testimonial Text */}
              <p className="text-gray-300 mb-8 italic leading-relaxed text-lg group-hover:text-white transition-colors">
                "{testimonial.text}"
              </p>
              
              {/* Client Info */}
              <div className="flex items-center gap-4 pt-6 border-t border-gray-800 group-hover:border-gray-700 transition-colors">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#FFD400] group-hover:border-[#FF0000] transition-colors"
                />
                <div>
                  <h4 className="font-bold text-white text-lg group-hover:text-[#FFD400] transition-colors">
                    {testimonial.name}
                  </h4>
                  <p className="text-[#FFD400] text-sm font-medium">
                    {testimonial.position}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientsSection;