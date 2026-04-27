import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';

const HeroSection: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const eventDate = new Date('2026-04-17T09:00:00').getTime();
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = eventDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* YouTube Video BG */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <iframe
          className="w-full h-full object-cover"
          style={{
            position: 'absolute',
            top: 0, left: 0, width: '100%', height: '100%',
            minHeight: '100vh'
          }}
          src="https://www.youtube.com/embed/tZrpJmS_f40?autoplay=1&mute=1&controls=0&loop=1&playlist=tZrpJmS_f40&modestbranding=1&showinfo=0&rel=0"
          title="Drone Expo Background"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60 z-10"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-20 text-center pt-32">
        <div className="max-w-4xl mx-auto">
          <h1
            data-aos="fade-up"
            data-aos-delay="300"
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Drone <span className="text-[#FFD400]">Expo 2026</span>
          </h1>

          {/* Paid Event Badge */}
          <div data-aos="fade-up" data-aos-delay="400" className="flex justify-center mb-4">
            <span className="bg-[#FF0000] text-white text-sm font-bold px-5 py-2 rounded-full uppercase tracking-widest shadow-lg">
              Paid Event
            </span>
          </div>

          <div
            data-aos="fade-up"
            data-aos-delay="600"
            className="flex flex-wrap justify-center gap-6 mb-8 text-white"
          >
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-[#FFD400]" />
              <span>17th – 18th April 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={20} className="text-[#FFD400]" />
              <span>9:00 AM - 6:00 PM</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={20} className="text-[#FFD400]" />
              <span>Bangalore International Exhibition Centre, Bengaluru</span>
            </div>
          </div>

          {/* Countdown Timer */}
          <div
            data-aos="fade-up"
            data-aos-delay="900"
            className="grid grid-cols-4 gap-4 max-w-md mx-auto mb-12"
          >
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Minutes', value: timeLeft.minutes },
              { label: 'Seconds', value: timeLeft.seconds }
            ].map((item, index) => (
              <div key={index} className="bg-black/50 backdrop-blur-sm rounded-lg p-4 border border-[#FFD400]/30">
                <div className="text-2xl font-bold text-[#FFD400]">{item.value.toString().padStart(2, '0')}</div>
                <div className="text-sm text-gray-300">{item.label}</div>
              </div>
            ))}
          </div>

          {/* Event Highlights */}
          <div className="text-white text-lg max-w-3xl mx-auto space-y-2 mb-10">
            <p>• Interaction with Key Buyers</p>
            <p>• Launch New Products</p>
            <p>• Showcase Your Products & Services</p>
            <p>• Understand Market Competition</p>
            <p>• Build Brand Awareness</p>
            <p>• Know About Visitors</p>
          </div>

          {/* Buttons */}
          <div
            data-aos="fade-up"
            data-aos-delay="1200"
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <a
              href="https://www.droneexpo.in/visitor-registration"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-[#FFD400] hover:bg-[#FFD400]/90 text-black px-8 py-4 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-3 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span>Register to Visit</span>
              <ArrowRight size={20} className="transform group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="https://www.droneexpo.in/exhibitor-registration"
              target="_blank"
              rel="noopener noreferrer"
              className="group border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-3 transform hover:scale-105"
            >
              <span>Exhibitor Enquiry</span>
              <ArrowRight size={20} className="transform group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
