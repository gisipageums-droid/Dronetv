// import React, { useEffect, useRef } from 'react';
// import Typed from 'typed.js';
// import { Download, MessageCircle } from 'lucide-react';

// const HeroSection: React.FC = () => {
//   const typedRef = useRef<HTMLSpanElement>(null);
//   const typedInstance = useRef<Typed | null>(null);

//   useEffect(() => {
//     if (typedRef.current) {
//       typedInstance.current = new Typed(typedRef.current, {
//         strings: [
//           'DGCA RPAS Instructor',
//           'Aerospace Educator',
//           'Drone Pilot Trainer',
//           'Flight Mechanics Expert'
//         ],
//         typeSpeed: 50,
//         backSpeed: 30,
//         backDelay: 2000,
//         loop: true,
//         showCursor: true,
//         cursorChar: '|',
//       });
//     }

//     return () => {
//       if (typedInstance.current) {
//         typedInstance.current.destroy();
//       }
//     };
//   }, []);

//   return (
//     <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
//       {/* Animated Background */}
//       <div className="absolute inset-0 bg-gradient-to-br from-[#FFD400] via-[#FFD400]/90 to-[#FFD400]/80">
//         <div
//           className="absolute inset-0 opacity-20"
//           style={{
//             backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
//           }}
//         ></div>
//       </div>

//       <div className="container mx-auto px-4 relative z-10">
//         <div className="text-center max-w-4xl mx-auto">
//           <div data-aos="fade-up" data-aos-delay="300">
//             <h1 className="text-6xl md:text-8xl font-bold text-black mb-6 leading-tight">
//               Sumit <span className="text-[#FF0000]">Krishnan</span>
//             </h1>
//           </div>

//           <div data-aos="fade-up" data-aos-delay="600" className="mb-8">
//             <div className="text-2xl md:text-3xl font-semibold text-black">
//               I'm a <span ref={typedRef} className="text-[#FF0000]"></span>
//             </div>
//           </div>

//           <div data-aos="fade-up" data-aos-delay="900" className="mb-12">
//             <p className="text-lg md:text-xl text-black/80 max-w-2xl mx-auto leading-relaxed">
//               Empowering India’s drone workforce with certified training, real-world simulations, and aerospace expertise. Based at India Drone Academy, Hyderabad.
//             </p>
//           </div>

         

//           {/* Scroll Indicator */}
//           {/* <div data-aos="fade-up" data-aos-delay="1500" className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
//             <div className="w-6 h-10 border-2 border-black rounded-full flex justify-center">
//               <div className="w-1 h-3 bg-black rounded-full animate-bounce mt-2"></div>
//             </div>
//           </div> */}
//         </div>
//       </div>

//       {/* Floating Elements */}
//       <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-[#FF0000] rounded-full animate-ping"></div>
//       <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-black rounded-full animate-pulse"></div>
//       <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-[#FF0000] rounded-full animate-bounce"></div>
//     </section>
//   );
// };

// export default HeroSection;


import React, { useEffect, useRef } from 'react';
import Typed from 'typed.js';
import { Download, MessageCircle } from 'lucide-react';

interface HeroSectionProps {
  fullName?: string;
  profilePicture?: string;
  rotatingTitles?: string;
  tagline?: string;
  location?: string;
  primaryColor?: string;
  accentColor?: string;
  button1Text?: string;
  button1Link?: string;
  button2Text?: string;
  button2Link?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  fullName = "Sumit Krishnan",
  profilePicture,
  rotatingTitles = "DGCA RPAS Instructor,Aerospace Educator,Drone Pilot Trainer,Flight Mechanics Expert",
  tagline = "Empowering India's drone workforce with certified training, real-world simulations, and aerospace expertise.",
  location = "Hyderabad, India",
  primaryColor = "#FFD400",
  accentColor = "#FF0000",
  button1Text = "Hire Me",
  button1Link = "#contact",
  button2Text = "Download CV",
  button2Link = "#",
}) => {
  const typedRef = useRef<HTMLSpanElement>(null);
  const typedInstance = useRef<Typed | null>(null);

  useEffect(() => {
    if (typedRef.current) {
      const titlesArray = rotatingTitles.split('|').map(title => title.trim()).filter(Boolean);
      
      typedInstance.current = new Typed(typedRef.current, {
        strings: titlesArray.length > 0 ? titlesArray : [
          'DGCA RPAS Instructor',
          'Aerospace Educator',
          'Drone Pilot Trainer',
          'Flight Mechanics Expert'
        ],
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 2000,
        loop: true,
        showCursor: true,
        cursorChar: '|',
      });
    }

    return () => {
      if (typedInstance.current) {
        typedInstance.current.destroy();
      }
    };
  }, [rotatingTitles]);

  // Extract first and last names for styling
  const nameParts = fullName.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ');

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Dynamic Background */}
      <div 
        className="absolute inset-0 transform scale-110 transition-transform duration-1000 ease-out"
        style={{
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}90 50%, ${primaryColor}80 100%)`
        }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      {/* Gradient Overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-black/80 via-gray-900/60 to-black/90 opacity-80"
      />

      {/* Animated particles */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-red-400 rounded-full animate-bounce"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto py-20">
          {/* Profile Picture with Animation */}
          {profilePicture && (
            <div 
              className="mb-8 transform transition-all duration-1000 ease-out opacity-0"
              style={{
                animationDelay: '0.2s',
                animation: 'fadeInScale 1.5s ease-out 0.2s both'
              }}
            >
              <div className="relative inline-block">
                <div 
                  className="absolute inset-0 rounded-full blur-lg opacity-40"
                  style={{
                    background: `linear-gradient(135deg, ${accentColor} 0%, ${primaryColor} 50%, ${accentColor} 100%)`
                  }}
                ></div>
                <img
                  src={profilePicture}
                  alt={fullName}
                  className="relative h-24 w-24 md:h-32 md:w-32 object-cover rounded-full shadow-2xl border-4 border-white transition-transform duration-300 hover:scale-110"
                />
              </div>
            </div>
          )}

          {/* Name with Dynamic Color */}
          <div data-aos="fade-up" data-aos-delay="300">
            <h1 
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 "
              style={{
                animation: 'fadeInUp 1s ease-out 0.5s both',
                // textShadow: '0 0 30px rgba(0,0,0,0.5)',
                // filter: 'drop-shadow(2px 4px 8px rgba(0,0,0,0.8))'
              }}
            >
              {firstName} <span style={{ color: accentColor }}>{lastName}</span>
            </h1>
          </div>

          {/* Rotating Titles */}
          <div 
            className="text-2xl md:text-3xl font-semibold mb-8 opacity-0"
            style={{
              animation: 'fadeInUp 1s ease-out 0.8s both',
              color: primaryColor
            }}
          >
            <span ref={typedRef}></span>
          </div>

          {/* Tagline */}
          <div 
            className="mb-12 opacity-0"
            style={{
              animation: 'fadeInUp 1s ease-out 1.1s both'
            }}
          >
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              {tagline}
            </p>
            {location && (
              <p className="mt-4 text-white/70">
                <i className="fas fa-map-marker-alt mr-2"></i> {location}
              </p>
            )}
          </div>

          {/* CTA Buttons */}
          <div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 opacity-0"
            style={{
              animation: 'fadeInUp 1s ease-out 1.4s both'
            }}
          >
            {button1Text && button1Link && (
              <a
                href={button1Link}
                className="group relative overflow-hidden rounded-full font-bold text-base md:text-lg px-8 py-3 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%)`,
                  color: '#000',
                  boxShadow: `0 8px 32px rgba(${hexToRgb(primaryColor)}, 0.4), 0 4px 16px rgba(0,0,0,0.2)`,
                  minWidth: '180px'
                }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <MessageCircle size={18} /> {button1Text}
                </span>
                <div 
                  className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left opacity-20"
                ></div>
              </a>
            )}
            
            {button2Text && button2Link && (
              <a
                href={button2Link}
                className="group relative overflow-hidden border-2 border-white text-white hover:text-black px-8 py-3 rounded-full font-bold text-base md:text-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 backdrop-blur-sm"
                style={{
                  minWidth: '180px'
                }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Download size={18} /> {button2Text}
                </span>
                <div 
                  className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left opacity-20"
                ></div>
              </a>
            )}
          </div>

          {/* Scroll Indicator */}
          <div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 opacity-0"
            style={{ 
              animation: 'fadeInUp 1s ease-out 2s both'
            }}
          >
            <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white rounded-full animate-bounce mt-2"></div>
            </div>
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

// Helper function to convert hex to rgb
function hexToRgb(hex: string) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? 
    `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` 
    : '255, 215, 0'; // fallback to gold color
}

export default HeroSection;