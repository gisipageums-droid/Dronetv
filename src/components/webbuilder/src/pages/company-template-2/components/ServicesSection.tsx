import React from 'react';
import { Shield, Zap, Camera, Settings } from 'lucide-react';

const ServicesSection: React.FC = () => {
  const services = [
    {
      icon: <Shield size={48} />,
      title: 'Defense & Security',
      description: 'Advanced surveillance and reconnaissance systems for military and security applications with real-time intelligence gathering.',
      features: ['Tactical Surveillance', 'Border Monitoring', 'Threat Detection', 'Night Vision Systems']
    },
    {
      icon: <Zap size={48} />,
      title: 'Smart Agriculture',
      description: 'Precision farming solutions with crop monitoring, health analysis, and automated spraying systems for maximum yield.',
      features: ['Crop Health Analysis', 'Precision Spraying', 'Yield Optimization', 'Weather Monitoring']
    },
    {
      icon: <Camera size={48} />,
      title: 'Aerial Surveying',
      description: 'High-precision mapping and surveying services for construction, mining, and infrastructure development projects.',
      features: ['3D Mapping', 'Topographic Surveys', 'Progress Monitoring', 'Volume Calculations']
    },
    {
      icon: <Settings size={48} />,
      title: 'Custom Solutions',
      description: 'Tailored drone systems designed for specific industry needs with custom payloads and specialized capabilities.',
      features: ['Custom Hardware', 'Specialized Payloads', 'Industry Integration', 'Training & Support']
    }
  ];

  return (
    <section id="services" className="py-20 bg-ink">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 data-aos="fade-up" className="text-4xl md:text-6xl font-bold text-[#F8C400] mb-4">
            Our <span className="text-white">Services</span>
          </h2>
          <div data-aos="fade-up" data-aos-delay="200" className="w-32 h-1 bg-[#F8C400] mx-auto mb-6"></div>
          <p data-aos="fade-up" data-aos-delay="400" className="text-ink-light text-lg max-w-3xl mx-auto">
            Comprehensive drone solutions engineered for excellence across defense, agriculture, surveying, and specialized applications.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              data-aos="fade-up" 
              data-aos-delay={index * 200}
              className="group relative bg-ink/30 backdrop-blur-sm rounded-3xl p-8 border border-ink-charcoal hover:border-[#F8C400]/50 transition-all duration-500 overflow-hidden"
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#DC2626]/5 to-[#F8C400]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                {/* Icon */}
                <div className="w-20 h-20 bg-[#DC2626] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#F8C400] group-hover:scale-110 transition-all duration-300">
                  <div className="text-white group-hover:text-ink transition-colors">
                    {service.icon}
                  </div>
                </div>
                
                {/* Content */}
                <h3 className="text-2xl font-bold text-[#F8C400] mb-4 group-hover:text-white transition-colors">
                  {service.title}
                </h3>
                
                <p className="text-ink-caption mb-6 leading-relaxed group-hover:text-ink-light transition-colors">
                  {service.description}
                </p>
                
                {/* Features */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#DC2626] rounded-full group-hover:bg-[#F8C400] transition-colors"></div>
                      <span className="text-sm text-ink-caption group-hover:text-ink-caption transition-colors">{feature}</span>
                    </div>
                  ))}
                </div>
                
                {/* CTA */}
                <button className="group/btn flex items-center gap-2 text-[#DC2626] font-semibold hover:text-[#F8C400] transition-colors">
                  <span>Learn More</span>
                  <div className="w-0 group-hover/btn:w-6 h-0.5 bg-current transition-all duration-300"></div>
                  <span className="transform group-hover/btn:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;