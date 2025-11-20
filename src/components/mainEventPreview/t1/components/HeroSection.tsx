import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeroSectionProps {
  heroData?: {
    title: string;
    date: string;
    time: string;
    location: string;
    eventDate: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    videoUrl: string;
    highlights: string[];
    btn1: string;
    btn2: string;
  };
}

const HeroSection: React.FC<HeroSectionProps> = ({ heroData }) => {
  const navigate = useNavigate();

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isEventStarted: false,
    isEventExpired: false
  });

  // Use prop data or default values
  const heroContent = heroData || {
    title: "demo Event",
    date: " to ",
    time: " - ",
    location: ", ",
    eventDate: "T:00",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    videoUrl: "",
    highlights: [
      "Highlight 1",
      "Highlight 2"
    ],
    btn1: "Register to Visit",
    btn2: "Exhibitor Enquiry",
  };

  // Helper function to convert YouTube URLs to embed format
  const convertToEmbedUrl = (url: string): string => {
    if (!url) return "";
    
    // If it's already an embed URL, return as is
    if (url.includes('youtube.com/embed/')) {
      return url;
    }
    
    // Extract video ID from different YouTube URL formats
    let videoId = '';
    
    // Handle youtu.be format
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    }
    // Handle youtube.com/watch format
    else if (url.includes('youtube.com/watch')) {
      const urlParams = new URLSearchParams(url.split('?')[1]);
      videoId = urlParams.get('v') || '';
    }
    
    // If we found a video ID, create embed URL with autoplay parameters
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&modestbranding=1&showinfo=0&rel=0`;
    }
    
    // Return original URL if we can't parse it
    return url;
  };

  // Countdown timer effect
  useEffect(() => {
    const updateCountdown = () => {
      if (!heroContent.eventDate || !heroContent.endDate || !heroContent.endTime) return;
      
      const now = new Date().getTime();
      const eventStartTime = new Date(heroContent.eventDate).getTime();
      const eventEndTime = new Date(`${heroContent.endDate}T${heroContent.endTime}:00`).getTime();
      const distanceToStart = eventStartTime - now;
      const distanceToEnd = eventEndTime - now;

      // Event hasn't started yet - show countdown
      if (distanceToStart > 0) {
        const days = Math.floor(distanceToStart / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distanceToStart % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distanceToStart % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distanceToStart % (1000 * 60)) / 1000);

        setCountdown({
          days,
          hours,
          minutes,
          seconds,
          isEventStarted: false,
          isEventExpired: false
        });
      }
      // Event is currently running (started but not ended)
      else if (distanceToEnd > 0) {
        setCountdown({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isEventStarted: true,
          isEventExpired: false
        });
      }
      // Event has ended - show expired
      else {
        setCountdown({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isEventStarted: false,
          isEventExpired: true
        });
      }
    };

    // Update immediately
    updateCountdown();
    
    // Update every second
    const timer = setInterval(updateCountdown, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, [heroContent.eventDate, heroContent.endDate, heroContent.endTime]);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* YouTube Video BG */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <iframe
          key={heroContent.videoUrl}
          className="w-full h-full object-cover"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            minHeight: "100vh",
          }}
          src={convertToEmbedUrl(heroContent.videoUrl || "https://www.youtube.com/embed/tZrpJmS_f40?autoplay=1&mute=1&controls=0&loop=1&playlist=tZrpJmS_f40&modestbranding=1&showinfo=0&rel=0")}
          title="Event Background Video"
          frameBorder="0"
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
        />
        <div className="absolute inset-0 bg-black/60 z-10"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-20 text-center pt-32">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-bold text-[#FFD400] mb-6 leading-tight">
            {heroContent.title}
          </h1>

          {/* Date / Time / Location */}
          <div className="flex flex-wrap justify-center gap-6 mb-8 text-white">
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-[#FFD400]" />
              <span>{heroContent.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={20} className="text-[#FFD400]" />
              <span>{heroContent.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={20} className="text-[#FFD400]" />
              <span>{heroContent.location}</span>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="mb-8">
            {countdown.isEventExpired ? (
              <div className="text-center">
                <div className="inline-block bg-orange-300/20 backdrop-blur-sm rounded-2xl px-8 py-4 border border-red-400/30">
                  <h3 className="text-2xl md:text-3xl font-bold text-green-400 mb-2">✅ Event has been completed</h3>
                  <p className="text-white text-lg">This event has ended</p>
                </div>
              </div>
            ) : countdown.isEventStarted ? (
              <div className="text-center">
                <div className="inline-block bg-green-500/20 backdrop-blur-sm rounded-2xl px-8 py-4 border border-green-400/30">
                  <h3 className="text-2xl md:text-3xl font-bold text-green-400 mb-2">🎉 Event is Live!</h3>
                  <p className="text-white text-lg">Join us now at the event</p>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <h3 className="text-xl md:text-2xl font-semibold text-white mb-4">Event Starts In</h3>
                <div className="flex justify-center gap-4 md:gap-6">
                  <div className="bg-black/40 backdrop-blur-sm rounded-xl px-4 py-3 md:px-6 md:py-4 border border-white/20">
                    <div className="text-2xl md:text-3xl font-bold text-[#FFD400]">{countdown.days}</div>
                    <div className="text-sm md:text-base text-white/80">Days</div>
                  </div>
                  <div className="bg-black/40 backdrop-blur-sm rounded-xl px-4 py-3 md:px-6 md:py-4 border border-white/20">
                    <div className="text-2xl md:text-3xl font-bold text-[#FFD400]">{countdown.hours}</div>
                    <div className="text-sm md:text-base text-white/80">Hours</div>
                  </div>
                  <div className="bg-black/40 backdrop-blur-sm rounded-xl px-4 py-3 md:px-6 md:py-4 border border-white/20">
                    <div className="text-2xl md:text-3xl font-bold text-[#FFD400]">{countdown.minutes}</div>
                    <div className="text-sm md:text-base text-white/80">Minutes</div>
                  </div>
                  <div className="bg-black/40 backdrop-blur-sm rounded-xl px-4 py-3 md:px-6 md:py-4 border border-white/20">
                    <div className="text-2xl md:text-3xl font-bold text-[#FFD400]">{countdown.seconds}</div>
                    <div className="text-sm md:text-base text-white/80">Seconds</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Highlights */}
          <div className="text-white text-lg max-w-3xl mx-auto mb-10 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-left">
            {heroContent.highlights.map((highlight, i) => (
              <p key={i}>• {highlight}</p>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button 
              onClick={() => scrollToSection("#contact")}
              className="group bg-[#FFD400] hover:bg-[#FFD400]/90 text-black px-8 py-4 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-3 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span>{heroContent.btn1}</span>
              <ArrowRight
                size={20}
                className="transform group-hover:translate-x-1 transition-transform"
              />
            </button>

            <button 
              onClick={() => scrollToSection("#contact")}
              className="group border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-3 transform hover:scale-105"
            >
              <span>{heroContent.btn2}</span>
              <ArrowRight
                size={20}
                className="transform group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;