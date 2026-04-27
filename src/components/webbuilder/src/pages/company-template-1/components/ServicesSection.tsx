import React from 'react';
import { Camera, Zap, Shield, Settings, Plus, Trash2 } from 'lucide-react';

// Icon map for demonstration—add more as needed
const defaultIconMap: Record<string, React.ReactNode> = {
  camera: <Camera size={38} />,
  zap: <Zap size={38} />,
    shield: <Shield size={38} />,
  settings: <Settings size={38} />,
};

type Service = {
  title: string;
  description: string;
  icon: string;
};

interface ServicesSectionProps {
  servicesTitle: string;
  servicesDescription: string;
  services: Service[];
  iconMap?: Record<string, React.ReactNode>;
}

const ServicesSection: React.FC<ServicesSectionProps> = ({
  servicesTitle,
  servicesDescription,
  services,
  iconMap = defaultIconMap, // Use the default if not provided
}) => (
  <section className="w-full py-16 md:py-24 bg-[#FFD400] relative" style={{ minHeight: '100vh' }}>
    {/* Decorative blurred elements */}
    <div className="pointer-events-none absolute inset-0 opacity-10 select-none z-0">
      <div className="absolute top-20 left-10 w-32 h-32 bg-[#FF0000] rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-[#FF0000] rounded-full blur-3xl opacity-50"></div>
    </div>

    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-black mb-6 leading-tight">
          {servicesTitle}
        </h2>
        {/* Decorative line */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="h-1 w-20 bg-[#FF0000] rounded-full"></div>
          <div className="h-1 w-12 bg-black rounded-full"></div>
          <div className="h-1 w-6 bg-white rounded-full"></div>
        </div>
        <p className="text-lg md:text-xl lg:text-2xl text-black/80 max-w-4xl mx-auto leading-relaxed font-medium">
          {servicesDescription}
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 overflow-visible">
        {services.map((service, idx) => (
          <div
            key={service.title + idx}
            className="group relative bg-white rounded-3xl p-8 lg:p-10 shadow-2xl border-4 border-transparent hover:border-[#FF0000] transition-all duration-500 transform hover:-translate-y-3 hover:scale-105"
            style={{ minHeight: '300px' }}
          >
            {/* Background gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFD400]/10 to-[#FF0000]/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            {/* Content */}
            <div className="relative z-10 text-center">
              {/* Icon Container */}
              <div className="inline-flex items-center justify-center w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-[#FF0000] to-[#FF0000]/80 rounded-2xl mb-6 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <div className="text-white group-hover:scale-110 transition-transform duration-500">
                  {iconMap[service.icon] ||
                    <span className="w-10 h-10 bg-gray-300 rounded-full inline-block"></span>
                  }
                </div>
              </div>
              {/* Title */}
              <h3 className="text-2xl lg:text-3xl font-bold text-black mb-4 group-hover:text-[#FF0000] transition-colors duration-300">
                {service.title}
              </h3>
              {/* Description */}
              <p className="text-base lg:text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                {service.description}
              </p>
            </div>
            {/* Decorative accents */}
            <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-[#FFD400] to-[#FF0000] rounded-bl-2xl rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-[#FFD400] to-[#FF0000] group-hover:w-20 transition-all duration-500 rounded-full"></div>
          </div>
        ))}
      </div>

      {/* Bottom dots */}
      <div className="flex justify-center mt-16">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#FF0000] rounded-full"></div>
          <div className="w-2 h-2 bg-black rounded-full"></div>
          <div className="w-1 h-1 bg-white rounded-full"></div>
        </div>
      </div>
    </div>
  </section>
);

export default ServicesSection;
