import React from "react";

interface CTA {
  text?: string;
  link?: string;
}

interface HeroSectionProps {
  headline?: string;
  subheadline?: string;
  background?: string;
  primaryCTA?: CTA;
  secondaryCTA?: CTA;
  companyLogo?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  headline = "Welcome!",
  subheadline = "Your UAV journey starts here.",
  background = "",
  primaryCTA,
  secondaryCTA,
  companyLogo,
}) => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background with parallax effect */}
      {background ? (
        <div className="absolute inset-0 transform scale-110 transition-transform duration-1000 ease-out">
          <img
            src={background}
            alt="Hero Background"
            className="w-full h-full object-cover object-center"
            style={{ 
              filter: 'brightness(0.7) contrast(1.1)'
            }}
          />
        </div>
      ) : (
        <div 
          className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600"
        />
      )}

      {/* Dynamic gradient overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-black/80 via-gray-900/60 to-black/90 opacity-80"
      />

      {/* Animated particles background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-400 rounded-full"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-blue-400 rounded-full"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
        <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-green-400 rounded-full"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center justify-center text-center px-6 py-8 mt-16">
        
        {/* Company Logo with floating animation */}
{companyLogo && (
  <div 
    className="mb-6 transform transition-all duration-1000 ease-out opacity-0"
    style={{
      animationDelay: '0.2s',
      animation: 'fadeInScale 1.5s ease-out 0.2s both'
    }}
  >
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 rounded-full blur-lg opacity-40"></div>
      <img
        src={companyLogo}
        alt="Company Logo"
        className="relative h-16 w-16 md:h-20 md:w-20 bg-white shadow-2xl object-contain border-4 border-yellow-400 transition-transform duration-300 hover:scale-110 hover:rotate-12" // <-- no rounded-full!
      />
    </div>
  </div>
)}


        {/* Main Headline with typing effect style */}
        <h1
          className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight opacity-0 transform translate-y-12 transition-all duration-1000 ease-out"
          style={{
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 0 30px rgba(255, 215, 0, 0.5)',
            animationDelay: '0.5s',
            filter: 'drop-shadow(2px 4px 8px rgba(0,0,0,0.8))',
            animation: 'fadeInUp 1s ease-out 0.5s both'
          }}
        >
          {headline}
        </h1>

        {/* Subheadline with fade-in effect */}
        <p
          className="text-lg md:text-2xl text-gray-100 mb-8 max-w-4xl mx-auto font-light leading-relaxed opacity-0 transform translate-y-12 transition-all duration-1000 ease-out"
          style={{
            animationDelay: '0.8s',
            textShadow: '0 2px 12px rgba(0,0,0,0.8)',
            animation: 'fadeInUp 1s ease-out 0.8s both'
          }}
        >
          {subheadline}
        </p>

        {/* CTA Buttons with staggered animations */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          {primaryCTA?.link && primaryCTA?.text && (
            <a
              href={primaryCTA.link}
              className="group relative overflow-hidden rounded-full font-bold text-base md:text-lg px-8 py-3 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 opacity-0 translate-y-12"
              style={{
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                color: '#000',
                boxShadow: '0 8px 32px rgba(255, 215, 0, 0.4), 0 4px 16px rgba(0,0,0,0.2)',
                animationDelay: '1.1s',
                minWidth: '180px',
                animation: 'fadeInUp 1s ease-out 1.1s both'
              }}
            >
              <span className="relative z-10">{primaryCTA.text}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </a>
          )}
          
          {secondaryCTA?.link && secondaryCTA?.text && (
            <a
              href={secondaryCTA.link}
              className="group relative overflow-hidden border-2 border-white text-white hover:text-black px-8 py-3 rounded-full font-bold text-base md:text-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 backdrop-blur-sm opacity-0 translate-y-12"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(255, 255, 255, 0.1), 0 4px 16px rgba(0,0,0,0.2)',
                animationDelay: '1.4s',
                minWidth: '180px',
                animation: 'fadeInUp 1s ease-out 1.4s both'
              }}
            >
              <span className="relative z-10">{secondaryCTA.text}</span>
              <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </a>
          )}
        </div>

        {/* Scroll indicator */}
        <div 
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 opacity-0"
          style={{ 
            animation: 'fadeInUp 1s ease-out 2s both'
          }}
        >
          <div 
            className="w-6 h-10 border-2 border-white rounded-full flex justify-center opacity-60 animate-bounce"
          >
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;