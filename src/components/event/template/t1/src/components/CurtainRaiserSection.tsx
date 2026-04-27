import React from 'react';
import { Calendar, MapPin, Video } from 'lucide-react';

const CurtainRaiserSection: React.FC = () => {
  return (
    <section className="py-16 bg-black text-white">
      <div className="container mx-auto px-4 text-center">
        <div data-aos="fade-up" className="inline-block bg-[#FFD400] text-black text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full mb-6">
          Upcoming
        </div>

        <h2 data-aos="fade-up" data-aos-delay="100" className="text-3xl md:text-4xl font-bold mb-4">
          Curtain Raiser — <span className="text-[#FFD400]">Drone Expo 2026</span>
        </h2>

        <div data-aos="fade-up" data-aos-delay="200" className="w-20 h-1 bg-[#FF0000] mx-auto mb-8"></div>

        <div data-aos="fade-up" data-aos-delay="300" className="flex flex-wrap justify-center gap-8 mb-10 text-gray-300">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-[#FFD400]" />
            <span>26th February 2026</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={18} className="text-[#FFD400]" />
            <span>Bengaluru</span>
          </div>
          <div className="flex items-center gap-2">
            <Video size={18} className="text-[#FFD400]" />
            <span>Live Coverage by Drone TV</span>
          </div>
        </div>

        <p data-aos="fade-up" data-aos-delay="400" className="text-gray-400 text-base max-w-2xl mx-auto">
          Join us for the official Curtain Raiser of Drone Expo 2026 in Bengaluru. Drone TV will be present on the ground capturing exclusive videos and photographs, which will be shared on the same day.
        </p>
      </div>
    </section>
  );
};

export default CurtainRaiserSection;
