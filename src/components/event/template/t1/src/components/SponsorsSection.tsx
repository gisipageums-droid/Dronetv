import React from 'react';

const SponsorsSection: React.FC = () => {
  return (
    <section id="sponsors" className="py-20 bg-white">
      <div className="container mx-auto px-4 text-center">
        <h2 data-aos="fade-up" className="text-4xl md:text-5xl font-bold text-black mb-6">
          Our <span className="text-[#FF0000]">Partners</span>
        </h2>
        <div data-aos="fade-up" data-aos-delay="200" className="w-24 h-1 bg-[#FFD400] mx-auto mb-10"></div>

        <div data-aos="zoom-in" data-aos-delay="400" className="max-w-6xl mx-auto">
          <img
            src="/images/sponsers.png"
            alt="Our Partners"
            className="w-full h-auto rounded-3xl shadow-xl object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default SponsorsSection;
