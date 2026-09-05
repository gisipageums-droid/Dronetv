import React, { useState, useRef, useEffect } from 'react';
import { Play, Eye, Clock } from 'lucide-react';

const PopularVideos = () => {
  const [visibleCards, setVisibleCards] = useState(new Set());
  const [playing, setPlaying] = useState(new Set());
  const [thumbFailed, setThumbFailed] = useState(new Set());
  const observerRef = useRef(null);

 const videos = [
    {
    id: 3,
    title: "Dr. Pranay Kumar on Industry-Scale Drone Integration at Drone Expo 2025",
    description:
      "Dr. Pranay Kumar, COO of BBPL Aero, shares expert insights on how drone technology is transforming agriculture, infrastructure, logistics, and more. His briefing outlines a roadmap for intelligent UAV adoption and strategic industry integration in India.",
    thumbnail: "https://img.youtube.com/vi/7Emdg4-WgQo/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/7Emdg4-WgQo",
    category: "Drone",
    views: "15.2K",
    duration: "6:33"
  },


  {
    id: 2,
    title: "Voices from Drone Expo 2025 – Featuring Dev R, Founder of Drone TV",
    description:
      "Drone TV captures the spirit of Drone Expo 2025 — candid interviews, expert insights, and bold visions shaping India’s UAV ecosystem. Dev R, Founder of Drone TV, shares: 'Drone TV is the voice of the drone ecosystem — a platform where innovators, startups, and entrepreneurs can express their vision and connect with the world.'",
    thumbnail: "https://img.youtube.com/vi/W2kpIo1Xlj4/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/W2kpIo1Xlj4",
    category: "Events",
    views: "8.9K",
    duration: "12:15"
  },
  {
    id: 6,
    title: "Payal Highlights Innovation at Drone Expo 2025",
    description:
      "In this feature, Payal from the Drone Expo team shares her take on the most innovative drone stalls. From standout tech to collaborative spirit, she captures the futuristic energy of Drone Expo 2025.",
    thumbnail: "https://img.youtube.com/vi/ykgVmoq5UXc/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/ykgVmoq5UXc",
    category: "GIS",
    views: "7.8K",
    duration: "9:51"
  },
    {
    id: 5,
    title: "Teja from Corteva on Drone-Powered Agriculture at Drone Expo 2025",
    description:
      "Drone TV interviews Teja from Corteva Agriscience to explore how drones are transforming agriculture. From precision spraying to crop monitoring, Corteva uses drone tech to boost sustainability and productivity.",
    thumbnail: "https://img.youtube.com/vi/9SUglQh93cQ/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/9SUglQh93cQ",
    category: "AI",
    views: "11.3K",
    duration: "14:07"
  },
  {
    id: 4,
    title: "Carbon Light’s Innovation in Drone Design – Rini Bansal at Drone Expo 2025",
    description:
      "Rini Bansal from Carbon Light shares insights on their carbon fiber components and lightweight drone frames at Drone Expo 2025. Learn how their tech enhances endurance, payload, and performance — making them a top name for drone OEMs.",
    thumbnail: "https://img.youtube.com/vi/bIOSkyj6xSk/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/bIOSkyj6xSk",
    category: "Drone",
    views: "9.7K",
    duration: "10:28"
  },

  
    {
    id: 1,
    title: "Gowrav Reddy on Drone Tech for Indian Agriculture",
    description:
      "At Drone Expo, Gowrav Reddy, Founder of CropWings, highlights how drone technology can address India's agri crisis—reducing pesticide overuse, minimizing crop protection costs, and connecting farmers with certified drone operators for safer, smarter farming.",
    thumbnail: "https://img.youtube.com/vi/hRt9Op9nD7M/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/hRt9Op9nD7M",
    category: "Agritech",
    views: "12.5K",
    duration: "8:42"
  }
];

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = parseInt(entry.target.dataset.id);
            setVisibleCards(prev => new Set([...prev, id]));
          }
        });
      },
      { threshold: 0.1 }
    );

    const cards = document.querySelectorAll('[data-id]');
    cards.forEach(card => observerRef.current.observe(card));

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const getCategoryColor = (category) => {
    switch (category) {
      case 'AI': return 'bg-gradient-to-r from-status-error to-status-error';
      case 'GIS': return 'bg-gradient-to-r from-ink to-ink-charcoal';
      case 'Drone': return 'bg-gradient-to-r from-status-error to-ink';
      default: return 'bg-gradient-to-r from-ink-charcoal to-ink';
    }
  };

  return (
  <section className="py-20 bg-brand-yellow-soft relative overflow-hidden">
  {/* Background Pattern */}
  <div className="absolute inset-0 opacity-5">
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `radial-gradient(circle at 25% 25%, #000000 2px, transparent 2px)`,
        backgroundSize: '50px 50px',
      }}
    ></div>
  </div>

  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-6xl font-black text-ink mb-4 tracking-tight">
        <span className="text-ink">Popular Videos</span>
      </h2>
      <div className="w-24 h-1 bg-gradient-to-r from-ink to-status-error mx-auto rounded-full"></div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {videos.map((video, index) => (
        <div
          key={video.id}
          data-id={video.id}
          className={`group bg-[#f1ee8e] rounded-2xl lg:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 cursor-pointer transform hover:scale-105 hover:-rotate-1`}
          style={{ transitionDelay: `${index * 150}ms` }}
        >
          <div className="relative aspect-video overflow-hidden bg-ink">
            {playing.has(video.id) ? (
              <iframe
                src={`${video.videoUrl.replace("watch?v=", "embed/")}?autoplay=1`}
                title={video.title}
                className="w-full h-full rounded-2xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              // Click-to-play on the real thumbnail instead of auto-loading
              // every video's iframe up front - a video with embedding
              // restricted by its own channel used to render YouTube's raw
              // "can't play this video here" placeholder full-size and
              // looked like a broken scrolling image; now it degrades to a
              // still thumbnail + Watch button (or a "Watch on YouTube"
              // link if even the thumbnail 404s) instead of a dead embed.
              <button
                type="button"
                onClick={() => setPlaying(prev => new Set([...prev, video.id]))}
                className="group/play absolute inset-0 w-full h-full"
                aria-label={`Play ${video.title}`}
              >
                {thumbFailed.has(video.id) ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-ink-charcoal text-white">
                    <Play className="w-10 h-10" />
                    <span className="text-sm font-semibold">Watch on YouTube</span>
                  </div>
                ) : (
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={() => setThumbFailed(prev => new Set([...prev, video.id]))}
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/play:bg-black/35 transition-colors">
                  <div className="w-14 h-14 rounded-full bg-status-error/90 flex items-center justify-center shadow-lg group-hover/play:scale-110 transition-transform">
                    <Play className="w-6 h-6 text-white fill-white ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 flex items-center gap-2 text-white text-xs font-semibold bg-black/60 rounded-full px-2.5 py-1">
                  <Eye className="w-3 h-3" /> {video.views}
                  <Clock className="w-3 h-3 ml-1" /> {video.duration}
                </div>
              </button>
            )}
          </div>

          <div className="p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-ink mb-2 group-hover:text-status-error transition-colors duration-300">
              {video.title}
            </h3>
            <p className="text-sm sm:text-base text-ink-paragraph mb-4 line-clamp-2">
              {video.description}
            </p>

            
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

  );
};

export default PopularVideos;