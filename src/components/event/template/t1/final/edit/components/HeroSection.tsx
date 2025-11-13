import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Clock, ArrowRight, Edit, Save, X } from "lucide-react";

const HeroSection: React.FC = () => {
  const [editMode, setEditMode] = useState(false);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isEventStarted: false,
    isEventExpired: false
  });

  // Helper function for ordinal suffixes
  const getOrdinalSuffix = (day: number): string => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  // Helper function to convert YouTube URLs to embed format
  const convertToEmbedUrl = (url: string): string => {
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

  const [heroContent, setHeroContent] = useState({
    title: "Drone Expo 2025",
    date: "25th – 27th September 2025",
    time: "9:00 AM - 6:00 PM",
    location: "Bombay Exhibition Centre, NESCO, Mumbai",
    eventDate: "2025-09-25T09:00:00", // September 25, 2025 at 9:00 AM
    startDate: "2025-09-25",
    endDate: "2025-09-27",
    startTime: "09:00",
    endTime: "18:00",
    videoUrl: "https://www.youtube.com/embed/tZrpJmS_f40?autoplay=1&mute=1&controls=0&loop=1&playlist=tZrpJmS_f40&modestbranding=1&showinfo=0&rel=0",
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

  const [backupContent, setBackupContent] = useState(heroContent);

  // Countdown timer effect
  useEffect(() => {
    const updateCountdown = () => {
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
          key={heroContent.videoUrl} // Force reload when URL changes
          className="w-full h-full object-cover"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            minHeight: "100vh",
          }}
          src={convertToEmbedUrl(heroContent.videoUrl)}
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
          {/* Edit/Save/Cancel Buttons */}
          <div className="absolute top-20 right-6 z-30 flex gap-3">
            {editMode ? (
              <>
                <button
                  onClick={handleEditToggle}
                  className="flex items-center my-20 gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  <Save size={18} /> Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center my-20 gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
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

          {/* Countdown Timer */}
          <div className="mb-8">
            {countdown.isEventExpired ? (
              <div className="text-center">
                <div className="inline-block bg-red-500/20 backdrop-blur-sm rounded-2xl px-8 py-4 border border-red-400/30">
                  <h3 className="text-2xl md:text-3xl font-bold text-red-400 mb-2">❌ Event is Expired</h3>
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

          {/* Editable Event Date Range (affects countdown) */}
          {editMode && (
            <div className="mb-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-white block mb-2">Start Date:</label>
                  <input
                    type="date"
                    value={heroContent.startDate}
                    onChange={(e) => {
                      const newStartDate = e.target.value;
                      const eventDateTime = `${newStartDate}T${heroContent.startTime}:00`;
                      setHeroContent({ 
                        ...heroContent, 
                        startDate: newStartDate,
                        eventDate: eventDateTime
                      });
                    }}
                    className="bg-white text-black px-3 py-2 rounded-md w-full"
                  />
                </div>
                <div>
                  <label className="text-white block mb-2">End Date:</label>
                  <input
                    type="date"
                    value={heroContent.endDate}
                    onChange={(e) =>
                      setHeroContent({ ...heroContent, endDate: e.target.value })
                    }
                    className="bg-white text-black px-3 py-2 rounded-md w-full"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-white block mb-2">Start Time:</label>
                  <input
                    type="time"
                    value={heroContent.startTime}
                    onChange={(e) => {
                      const newStartTime = e.target.value;
                      const eventDateTime = `${heroContent.startDate}T${newStartTime}:00`;
                      setHeroContent({ 
                        ...heroContent, 
                        startTime: newStartTime,
                        eventDate: eventDateTime
                      });
                    }}
                    className="bg-white text-black px-3 py-2 rounded-md w-full"
                  />
                </div>
                <div>
                  <label className="text-white block mb-2">End Time:</label>
                  <input
                    type="time"
                    value={heroContent.endTime}
                    onChange={(e) =>
                      setHeroContent({ ...heroContent, endTime: e.target.value })
                    }
                    className="bg-white text-black px-3 py-2 rounded-md w-full"
                  />
                </div>
              </div>
              <div className="text-center">
                <button
                  onClick={() => {
                    // Auto-generate display date from selected dates
                    const startDate = new Date(heroContent.startDate);
                    const endDate = new Date(heroContent.endDate);
                    const startDay = startDate.getDate();
                    const endDay = endDate.getDate();
                    const month = startDate.toLocaleDateString('en-US', { month: 'long' });
                    const year = startDate.getFullYear();
                    
                    // Format start and end times
                    const startTimeFormatted = new Date(`2000-01-01T${heroContent.startTime}:00`).toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit', 
                      hour12: true 
                    });
                    const endTimeFormatted = new Date(`2000-01-01T${heroContent.endTime}:00`).toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit', 
                      hour12: true 
                    });
                    
                    const displayDate = startDay === endDay 
                      ? `${startDay}${getOrdinalSuffix(startDay)} ${month} ${year}`
                      : `${startDay}${getOrdinalSuffix(startDay)} – ${endDay}${getOrdinalSuffix(endDay)} ${month} ${year}`;
                    
                    const displayTime = `${startTimeFormatted} - ${endTimeFormatted}`;
                    
                    setHeroContent({ 
                      ...heroContent, 
                      date: displayDate,
                      time: displayTime
                    });
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Update Display Date & Time
                </button>
              </div>
            </div>
          )}

          {/* Video URL Section */}
          {editMode && (
            <div className="mb-6">
              <div>
                <label className="text-white block mb-2">Background Video URL:</label>
                <input
                  type="url"
                  value={heroContent.videoUrl}
                  onChange={(e) =>
                    setHeroContent({ ...heroContent, videoUrl: e.target.value })
                  }
                  placeholder="Paste any YouTube URL (will be auto-converted)"
                  className="bg-white text-black px-3 py-2 rounded-md w-full max-w-lg"
                />
                <div className="text-gray-300 text-sm mt-2 space-y-1">
                  <p><strong>Supported formats:</strong></p>
                  <p>• https://youtu.be/VIDEO_ID</p>
                  <p>• https://www.youtube.com/watch?v=VIDEO_ID</p>
                  <p>• https://www.youtube.com/embed/VIDEO_ID</p>
                  <p className="text-yellow-300 mt-2"><strong>✨ Auto-converts to embed format with autoplay!</strong></p>
                </div>
              </div>
            </div>
          )}

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
