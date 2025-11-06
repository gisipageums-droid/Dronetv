import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Clock, ArrowRight, Edit, Save, X } from "lucide-react";

const HeroSection: React.FC = () => {
  const [editMode, setEditMode] = useState(false);

  const [heroContent, setHeroContent] = useState({
    title: "Drone Expo 2025",
    date: "25th – 27th September 2025",
    time: "9:00 AM - 6:00 PM",
    location: "Bombay Exhibition Centre, NESCO, Mumbai",
    eventDate: "2025-09-25T09:00:00", // default event date
    highlights: [
      "Interaction with Key Buyers",
      "Launch New Products",
      "Showcase Your Products & Services",
      "Understand Market Competition",
      "Build Brand Awareness",
      "Know About Visitors",
    ],
    btn1: "Register to Visit",
    btn2: "Exhibitor Enquiry",
  });

  const [backupContent, setBackupContent] = useState(heroContent); // for cancel

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const eventDate = new Date(heroContent.eventDate).getTime();
      const now = new Date().getTime();
      const distance = eventDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [heroContent.eventDate]);

  const handleEditToggle = () => {
    if (!editMode) {
      setBackupContent(heroContent); // save current before editing
    }
    setEditMode(!editMode);
  };

  const handleCancel = () => {
    setHeroContent(backupContent); // restore backup
    setEditMode(false);
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* YouTube Video BG */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <iframe
          className="w-full h-full object-cover"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            minHeight: "100vh",
          }}
          src="https://www.youtube.com/embed/tZrpJmS_f40?autoplay=1&mute=1&controls=0&loop=1&playlist=tZrpJmS_f40&modestbranding=1&showinfo=0&rel=0"
          title="Drone Expo Background"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
        <div className="absolute inset-0 bg-black/60 z-10"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-20 text-center pt-32">
        <div className="max-w-4xl mx-auto">
          {/* Edit/Save/Cancel Buttons */}
          <div className="absolute top-16 right-6 z-30 flex gap-3">
            {editMode ? (
              <>
                <button
                  onClick={handleEditToggle}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  <Save size={18} /> Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  <X size={18} /> Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleEditToggle}
                className="flex items-center gap-2 bg-black/60 text-white px-4 py-2 rounded-lg border border-white/30 hover:bg-black/80 transition"
              >
                <Edit size={18} /> Edit
              </button>
            )}
          </div>

          {/* Title */}
          {editMode ? (
            <input
              type="text"
              value={heroContent.title}
              onChange={(e) =>
                setHeroContent({ ...heroContent, title: e.target.value })
              }
              className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight px-4 py-2 rounded-md w-full"
            />
          ) : (
            <h1 className="text-5xl md:text-7xl font-bold text-[#FFD400] mb-6 leading-tight">
              {heroContent.title}
            </h1>
          )}

          {/* Date / Time / Location */}
          <div className="flex flex-wrap justify-center gap-6 mb-8 text-white">
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-[#FFD400]" />
              {editMode ? (
                <input
                  type="text"
                  value={heroContent.date}
                  onChange={(e) =>
                    setHeroContent({ ...heroContent, date: e.target.value })
                  }
                  className="bg-white text-black px-2 py-1 rounded-md"
                />
              ) : (
                <span>{heroContent.date}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Clock size={20} className="text-[#FFD400]" />
              {editMode ? (
                <input
                  type="text"
                  value={heroContent.time}
                  onChange={(e) =>
                    setHeroContent({ ...heroContent, time: e.target.value })
                  }
                  className="bg-white text-black px-2 py-1 rounded-md"
                />
              ) : (
                <span>{heroContent.time}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={20} className="text-[#FFD400]" />
              {editMode ? (
                <input
                  type="text"
                  value={heroContent.location}
                  onChange={(e) =>
                    setHeroContent({ ...heroContent, location: e.target.value })
                  }
                  className="bg-white text-black px-2 py-1 rounded-md"
                />
              ) : (
                <span>{heroContent.location}</span>
              )}
            </div>
          </div>

          {/* Editable Event Date (affects countdown) */}
          {editMode && (
            <div className="mb-6">
              <label className="text-white block mb-2">Event Start Date:</label>
              <input
                type="datetime-local"
                value={heroContent.eventDate}
                onChange={(e) =>
                  setHeroContent({ ...heroContent, eventDate: e.target.value })
                }
                className="bg-white text-black px-3 py-2 rounded-md"
              />
            </div>
          )}

          {/* Countdown Timer */}
          <div className="grid grid-cols-4 gap-4 max-w-md mx-auto mb-12">
            {[
              { label: "Days", value: timeLeft.days },
              { label: "Hours", value: timeLeft.hours },
              { label: "Minutes", value: timeLeft.minutes },
              { label: "Seconds", value: timeLeft.seconds },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-black/50 backdrop-blur-sm rounded-lg p-4 border border-[#FFD400]/30"
              >
                <div className="text-2xl font-bold text-[#FFD400]">
                  {item.value.toString().padStart(2, "0")}
                </div>
                <div className="text-sm text-gray-300">{item.label}</div>
              </div>
            ))}
          </div>

          {/* Highlights */}
          <div className="text-white text-lg max-w-3xl mx-auto mb-10 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-left">
            {heroContent.highlights.map((highlight, i) =>
              editMode ? (
                <input
                  key={i}
                  type="text"
                  value={highlight}
                  onChange={(e) => {
                    const newHighlights = [...heroContent.highlights];
                    newHighlights[i] = e.target.value;
                    setHeroContent({
                      ...heroContent,
                      highlights: newHighlights,
                    });
                  }}
                  className="bg-white text-black px-2 py-1 rounded-md w-full"
                />
              ) : (
                <p key={i}>• {highlight}</p>
              )
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="group bg-[#FFD400] hover:bg-[#FFD400]/90 text-black px-8 py-4 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-3 transform hover:scale-105 shadow-lg hover:shadow-xl">
              {editMode ? (
                <input
                  type="text"
                  value={heroContent.btn1}
                  onChange={(e) =>
                    setHeroContent({ ...heroContent, btn1: e.target.value })
                  }
                  className="bg-white text-black px-2 py-1 rounded-md"
                />
              ) : (
                <span>{heroContent.btn1}</span>
              )}
              <ArrowRight
                size={20}
                className="transform group-hover:translate-x-1 transition-transform"
              />
            </button>

            <button className="group border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-3 transform hover:scale-105">
              {editMode ? (
                <input
                  type="text"
                  value={heroContent.btn2}
                  onChange={(e) =>
                    setHeroContent({ ...heroContent, btn2: e.target.value })
                  }
                  className="bg-white text-black px-2 py-1 rounded-md"
                />
              ) : (
                <span>{heroContent.btn2}</span>
              )}
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
