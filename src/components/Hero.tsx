import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroWithVideo: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative h-[90vh] w-full overflow-hidden bg-black">
      {/* Background Video aligned to right */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <iframe
          src="https://www.youtube.com/embed/YGQlo3NNKTk?autoplay=1&mute=1&controls=0&loop=1&playlist=YGQlo3NNKTk"
          className="w-[130vw] h-full object-cover transform translate-x-1/6 pointer-events-none"
          title="Drone TV Video"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        ></iframe>

        {/* Gradient overlay from left */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>
      </div>

      {/* Foreground Content aligned to left */}
      <div className="relative z-10 h-full w-full flex items-center">
        <div className="pl-10 pr-4 max-w-2xl text-white">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            <span className="block">Explore the Future</span>
            <span className="block text-yellow-400">of Drone Technology</span>
          </h1>

          <div className="flex flex-wrap gap-4">
            <button
              className="bg-yellow-400 text-black px-6 py-3 rounded-md font-bold hover:bg-yellow-500 transition"
              onClick={() => navigate('/videos')}
            >
              Watch Now
            </button>
            <button
              className="bg-yellow-400 text-black px-6 py-3 rounded-md font-bold hover:bg-yellow-500 transition"
              onClick={() => navigate('/services')}
            >
              Browse Categories
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <ChevronDown className="h-8 w-8 text-yellow-300" />
      </div>
    </section>
  );
};

export default HeroWithVideo;
