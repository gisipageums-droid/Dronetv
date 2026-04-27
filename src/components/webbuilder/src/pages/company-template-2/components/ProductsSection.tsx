import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { ArrowRight, Eye } from 'lucide-react';

const ProductsSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const categories = ['All', 'Surveillance', 'Agriculture', 'Custom'];

  const products = [
    {
      id: 1,
      name: 'SkyGuard Pro',
      category: 'Surveillance',
      image: 'https://images.pexels.com/photos/442587/pexels-photo-442587.jpeg?auto=compress&cs=tinysrgb&w=600',
      specs: 'Thermal Camera, 8-hour Flight, Real-time Streaming',
      description: 'Advanced surveillance drone with thermal imaging and extended flight capabilities for security operations.',
      price: 'Contact for Pricing'
    },
    {
      id: 2,
      name: 'AgriMax Elite',
      category: 'Agriculture',
      image: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=600',
      specs: 'Multispectral Sensors, AI Analysis, 50L Spray Tank',
      description: 'Precision agriculture drone with crop monitoring and automated spraying capabilities.',
      price: 'Starting at $45,000'
    },
    {
      id: 3,
      name: 'StealthWing X1',
      category: 'Surveillance',
      image: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=600',
      specs: 'Stealth Design, Silent Operation, 12-hour Endurance',
      description: 'Military-grade stealth drone for covert surveillance and reconnaissance missions.',
      price: 'Government Pricing'
    },
    {
      id: 4,
      name: 'CustomFlex Platform',
      category: 'Custom',
      image: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=600',
      specs: 'Modular Design, Custom Payloads, Scalable Architecture',
      description: 'Fully customizable drone platform designed for specialized industrial applications.',
      price: 'Quote on Request'
    },
    {
      id: 5,
      name: 'CropScout AI',
      category: 'Agriculture',
      image: 'https://images.pexels.com/photos/1595108/pexels-photo-1595108.jpeg?auto=compress&cs=tinysrgb&w=600',
      specs: 'AI-Powered Analysis, Weather Resistant, Auto-Return',
      description: 'Smart agricultural drone with AI-powered crop analysis and autonomous operation.',
      price: 'Starting at $28,000'
    },
    {
      id: 6,
      name: 'UrbanEye 360',
      category: 'Surveillance',
      image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=600',
      specs: '360° Camera, Crowd Detection, Emergency Response',
      description: 'Urban surveillance drone with 360-degree monitoring and emergency response capabilities.',
      price: 'Starting at $35,000'
    }
  ];

  const filteredProducts = activeFilter === 'All' 
    ? products 
    : products.filter(product => product.category === activeFilter);

  return (
    <section id="products" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 data-aos="fade-up" className="text-4xl md:text-6xl font-bold text-[#FFD400] mb-4">
            Our <span className="text-white">Fleet</span>
          </h2>
          <div data-aos="fade-up" data-aos-delay="200" className="w-32 h-1 bg-[#FFD400] mx-auto mb-6"></div>
          <p data-aos="fade-up" data-aos-delay="400" className="text-gray-300 text-lg max-w-3xl mx-auto">
            Cutting-edge drone technology engineered for superior performance across diverse mission requirements.
          </p>
        </div>

        {/* Filter Buttons */}
        <div data-aos="fade-up" data-aos-delay="600" className="flex justify-center mb-12">
          <div className="flex flex-wrap gap-4 p-2 bg-black/50 backdrop-blur-sm rounded-full border border-gray-800">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  activeFilter === category
                    ? 'bg-[#FF0000] text-white shadow-lg transform scale-105'
                    : 'text-gray-400 hover:text-[#FFD400] hover:bg-white/5'
                }`}
              >
                {category}
                {activeFilter === category && (
                  <span className="ml-2 w-2 h-0.5 bg-[#FFD400] inline-block"></span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Products Carousel */}
        <div data-aos="fade-up" data-aos-delay="800">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation={true}
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 }
            }}
            className="products-swiper"
          >
            {filteredProducts.map((product) => (
              <SwiperSlide key={product.id}>
                <div className="group bg-black/50 backdrop-blur-sm rounded-3xl overflow-hidden border border-gray-800 hover:border-[#FFD400]/50 transition-all duration-500 transform hover:scale-105">
                  {/* Image */}
                  <div className="relative overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-[#FF0000] text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {product.category}
                      </span>
                    </div>
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button className="bg-[#FFD400] text-black px-6 py-2 rounded-full font-semibold hover:bg-[#FFD400]/90 transition-colors flex items-center gap-2">
                        <Eye size={16} />
                        View Details
                      </button>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#FFD400] mb-2 group-hover:text-white transition-colors">
                      {product.name}
                    </h3>
                    
                    <p className="text-sm text-[#FF0000] font-semibold mb-3 bg-[#FF0000]/10 px-3 py-1 rounded-full inline-block">
                      {product.specs}
                    </p>
                    
                    <p className="text-gray-400 mb-4 leading-relaxed group-hover:text-gray-300 transition-colors">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-[#FFD400] font-bold">{product.price}</span>
                      <button className="group/btn flex items-center gap-2 text-[#FF0000] font-semibold hover:text-[#FFD400] transition-colors">
                        <span>Learn More</span>
                        <ArrowRight size={16} className="transform group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <style jsx>{`
        .products-swiper .swiper-button-next,
        .products-swiper .swiper-button-prev {
          color: #FFD400;
        }
        .products-swiper .swiper-pagination-bullet {
          background: #FFD400;
          opacity: 0.5;
        }
        .products-swiper .swiper-pagination-bullet-active {
          background: #FF0000;
          opacity: 1;
        }
      `}</style>
    </section>
  );
};

export default ProductsSection;