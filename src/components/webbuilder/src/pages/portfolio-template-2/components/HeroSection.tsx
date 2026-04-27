import React, { useEffect, useRef, useState } from 'react';
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
  imagePaths?: string[];
  description?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  fullName = "Dev R",
  profilePicture = "/images/dev.png",
  rotatingTitles = "Founder and CEO of IPage Group|Voice-over-IP Systems Specialist|Geospatial Innovation Advocate|Drone Services Strategist",
  tagline = "Leading IPage UM Services since 2008 across Singapore and India",
  location = "Singapore & Hyderabad, India",
  primaryColor = "#FFD400",
  accentColor = "#FF0000",
  button1Text = "Contact Me",
  button1Link = "#contact",
  button2Text = "Download CV",
  button2Link = "#",
  imagePaths = [
    '/images/dev.png',
    '/images/1.png',
    '/images/7.png',
    '/images/11.png',
    '/images/28.png',
    '/images/36.png',
  ],
  description = "Leading IPage UM Services since 2008 across Singapore and India—driving innovation in Drone Technology, GIS, AI, and custom IT solutions. From national-scale mapping to founding India Drone Academy and Drone TV, I'm committed to building scalable geospatial ecosystems that transform how data is captured, visualized, and acted upon."
}) => {
  const typedRef = useRef<HTMLSpanElement>(null);
  const typedInstance = useRef<Typed | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const nameParts = fullName.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ');

  useEffect(() => {
    if (typedRef.current) {
      const titlesArray = rotatingTitles.split('|').map(title => title.trim()).filter(Boolean);
      
      typedInstance.current = new Typed(typedRef.current, {
        strings: titlesArray.length > 0 ? titlesArray : [
          'Founder and CEO of IPage Group',
          'Voice-over-IP Systems Specialist',
          'Geospatial Innovation Advocate',
          'Drone Services Strategist'
        ],
        typeSpeed: 60,
        backSpeed: 40,
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % imagePaths.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [imagePaths.length]);

  return (
    <section id="home" className="min-h-screen bg-white dark:bg-gray-900 flex items-center pt-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Section */}
          <div className="space-y-8">
            <h1 
              className="text-5xl lg:text-7xl font-bold text-black dark:text-white leading-tight"
              data-aos="fade-right"
            >
              Hello, I'm <br />
              <span className="inline-flex gap-2">
                <span style={{ color: accentColor }}>{firstName}</span>
                <span style={{ color: primaryColor }}>{lastName}</span>
              </span>
            </h1>

            <div 
              className="text-2xl lg:text-3xl font-medium text-black dark:text-white" 
              data-aos="fade-right" 
              data-aos-delay="600"
            >
              <span ref={typedRef}></span>
            </div>
            
            <p 
              className="text-lg text-gray-600 dark:text-gray-400 max-w-lg leading-relaxed" 
              data-aos="fade-right" 
              data-aos-delay="900"
            >
              {description}
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 mt-6" data-aos="fade-right" data-aos-delay="1200">
              {button1Text && (
                <a
                  href={button1Link}
                  className="group relative overflow-hidden rounded-full font-bold px-6 py-3 transition-all duration-300 transform hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%)`,
                    color: '#000',
                    boxShadow: `0 4px 16px rgba(${hexToRgb(primaryColor)}, 0.3)`
                  }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <MessageCircle size={18} /> {button1Text}
                  </span>
                </a>
              )}
              
              {button2Text && (
                <a
                  href={button2Link}
                  className="group relative overflow-hidden border-2 border-gray-800 dark:border-gray-200 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Download size={18} /> {button2Text}
                  </span>
                </a>
              )}
            </div>
          </div>

          {/* Right Section - Image Carousel */}
          <div className="relative flex items-center justify-center" data-aos="fade-left" data-aos-delay="400">
            <div 
              className="relative w-[500px] h-[500px] rounded-[50%] flex items-center justify-center overflow-hidden shadow-md"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}20, ${accentColor}20)`
              }}
            >
              <img
                src={profilePicture || imagePaths[currentImageIndex]}
                alt={fullName}
                className="w-full h-full object-cover transition-opacity duration-1000 ease-in-out rounded-[50%]"
              />

              {/* Decorative dots */}
              <div 
                className="absolute top-5 left-5 w-3 h-3 rounded-full"
                style={{ backgroundColor: primaryColor }}
              ></div>
              <div 
                className="absolute bottom-5 left-10 w-3 h-3 rounded-full"
                style={{ backgroundColor: primaryColor }}
              ></div>
              <div 
                className="absolute top-5 right-5 w-2 h-2 rounded-full"
                style={{ backgroundColor: accentColor }}
              ></div>
              <div 
                className="absolute bottom-5 right-5 w-2 h-2 rounded-full"
                style={{ backgroundColor: accentColor }}
              ></div>
            </div>
          </div>
        </div>
      </div>
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