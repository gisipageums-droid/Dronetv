import React from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';

const HeroSection: React.FC = () => {
  const scrollToNext = () => {
    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.pexels.com/photos/442587/pexels-photo-442587.jpeg?auto=compress&cs=tinysrgb&w=1920")'
        }}
      >
        <div className="absolute inset-0 bg-black/80"></div>
      </div>

      {/* Floating Drone SVG */}
      <div className="absolute top-1/4 right-1/4 opacity-10 animate-float">
        <svg width="200" height="120" viewBox="0 0 200 120" className="text-[#FFD400]">
          <rect x="80" y="50" width="40" height="20" rx="10" fill="currentColor" />
          <circle cx="60" cy="30" r="20" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin" style={{ animationDuration: '0.1s' }} />
          <circle cx="140" cy="30" r="20" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin" style={{ animationDuration: '0.1s' }} />
          <circle cx="60" cy="90" r="20" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin" style={{ animationDuration: '0.1s' }} />
          <circle cx="140" cy="90" r="20" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin" style={{ animationDuration: '0.1s' }} />
          <line x1="80" y1="60" x2="60" y2="30" stroke="currentColor" strokeWidth="3" />
          <line x1="120" y1="60" x2="140" y2="30" stroke="currentColor" strokeWidth="3" />
          <line x1="80" y1="60" x2="60" y2="90" stroke="currentColor" strokeWidth="3" />
          <line x1="120" y1="60" x2="140" y2="90" stroke="currentColor" strokeWidth="3" />
        </svg>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="max-w-5xl mx-auto">
          <h1 
            data-aos="fade-up" 
            data-aos-delay="300"
            className="text-6xl md:text-8xl font-bold text-[#FFD400] mb-6 leading-tight"
          >
            Empowering the Future of <span className="text-white">Flight</span>
          </h1>
          
          <p 
            data-aos="fade-up" 
            data-aos-delay="600"
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Revolutionary drone technology solutions for defense, agriculture, surveillance, and beyond. 
            Leading the aerial innovation revolution across industries.
          </p>

          <div 
            data-aos="fade-up" 
            data-aos-delay="900"
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <button className="group bg-[#FFD400] hover:bg-[#FFD400]/90 text-black px-8 py-4 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-3 transform hover:scale-105 shadow-lg hover:shadow-xl">
              <span>Explore Fleet</span>
              <ArrowRight size={20} className="transform group-hover:translate-x-1 transition-transform" />
            </button>

            <button className="group bg-[#FF0000] hover:bg-[#FF0000]/90 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-3 transform hover:scale-105 shadow-lg hover:shadow-xl">
              <span>Get Quote</span>
              <ArrowRight size={20} className="transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div 
          data-aos="fade-up" 
          data-aos-delay="1200"
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <button 
            onClick={scrollToNext}
            className="flex flex-col items-center text-[#FFD400] hover:text-white transition-colors group"
          >
            <span className="text-sm mb-2 font-medium">Discover More</span>
            <ChevronDown size={24} className="animate-bounce group-hover:text-[#FF0000]" />
          </button>
        </div>
      </div>

      {/* Animated Particles */}
      <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-[#FF0000] rounded-full animate-ping"></div>
      <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-[#FFD400] rounded-full animate-pulse"></div>
      <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-[#FF0000] rounded-full animate-bounce opacity-60"></div>
    </section>
  );
};

export default HeroSection;