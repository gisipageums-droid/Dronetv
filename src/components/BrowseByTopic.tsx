import React, { useState } from 'react';
import { Zap as Drone, Brain, Map, ArrowRight, Play, Users, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BrowseByTopic = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const navigate = useNavigate();

  const topics = [
    {
      id: 1,
      name: "Drone Technology",
      icon: Drone,
      description: "Explore cutting-edge drone hardware, software innovations, and revolutionary applications across industries",
      count: "150+ Videos",
      subcategories: ["Commercial Drones", "Racing Drones", "Military Applications", "Delivery Systems"],
      stats: { videos: 150, companies: 45, events: 12 },
      image: "https://images.pexels.com/photos/442587/pexels-photo-442587.jpeg?auto=compress&cs=tinysrgb&w=600",
      trending: "+25% this month"
    },
    {
      id: 2,
      name: "Artificial Intelligence",
      icon: Brain,
      description: "Discover AI algorithms powering autonomous flight, computer vision, and intelligent decision-making systems",
      count: "89+ Videos",
      subcategories: ["Machine Learning", "Computer Vision", "Neural Networks", "Autonomous Navigation"],
      stats: { videos: 89, companies: 32, events: 8 },
      image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600",
      trending: "+40% this month"
    },
    {
      id: 3,
      name: "GIS & Mapping",
      icon: Map,
      description: "Geographic information systems, precision mapping solutions, and spatial data analysis for aerial surveying",
      count: "67+ Videos",
      subcategories: ["Aerial Surveying", "3D Mapping", "Land Management", "Environmental Monitoring"],
      stats: { videos: 67, companies: 28, events: 6 },
      image: "https://images.pexels.com/photos/1034662/pexels-photo-1034662.jpeg?auto=compress&cs=tinysrgb&w=600",
      trending: "+18% this month"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-500 relative overflow-hidden min-h-screen">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-yellow-200/20 rounded-full animate-pulse blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-600/20 rounded-full animate-pulse blur-3xl" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-yellow-500/10 rounded-full animate-spin-slow blur-2xl"></div>
        {/* Floating geometric shapes */}
        <div className="absolute top-20 right-20 w-16 h-16 bg-yellow-600/20 rotate-45 animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-20 w-12 h-12 bg-yellow-400/30 rounded-full animate-ping" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black text-black mb-4 tracking-tight">
            Browse by Topic
          </h2>
          <p className="text-xl text-black/80 max-w-3xl mx-auto mb-8">
            Dive deep into specialized content areas and discover cutting-edge innovations across drone technology, artificial intelligence, and geographic information systems
          </p>
          <div className="w-24 h-1 bg-black mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-12 ">
          {topics.map((topic, index) => {
            const IconComponent = topic.icon;
            const isHovered = hoveredCard === topic.id;

            return (
              <div
                key={topic.id}
                className="group relative overflow-hidden rounded-3xl transition-all duration-700 cursor-pointer transform hover:scale-105 hover:-rotate-2 opacity-100 translate-y-0"
                style={{
                  animationDelay: `${index * 200}ms`,
                  animation: `fadeInUp 0.8s ease-out ${index * 200}ms both`
                }}
                onMouseEnter={() => setHoveredCard(topic.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => navigate('/videos')}
                role="button"
                tabIndex={0}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={topic.image}
                    alt={topic.name}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                  />
                  {/* Black overlay with subtle yellow glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/85 to-black/90 transition-all duration-500"></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70 transition-all duration-500"></div>
                {/* Yellow Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 via-transparent to-yellow-600/20 opacity-70 group-hover:opacity-90 transition-all duration-500"></div>
                {/* Animated Border with Yellow Glow */}
                <div className="absolute inset-0 rounded-3xl border-2 border-yellow-400/40 group-hover:border-yellow-400/80 transition-all duration-500 shadow-lg group-hover:shadow-yellow-400/30"></div>
                {/* Yellow Glow on Hover */}
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 shadow-2xl shadow-yellow-400/40"></div>

                {/* Content */}
                <div className="relative p-4 sm:p-6 lg:p-8  flex flex-col">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-xl scale-150 group-hover:scale-200 transition-all duration-700"></div>
                      <div className="relative bg-yellow-400/20 backdrop-blur-sm rounded-full p-3 sm:p-4 group-hover:scale-110 transition-all duration-500 border border-yellow-400/30 group-hover:shadow-lg group-hover:shadow-yellow-400/30">
                        <IconComponent className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-400 drop-shadow-lg" />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-yellow-400 font-semibold text-sm mb-1">{topic.count}</div>
                      <div className="text-yellow-300 text-xs flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {topic.trending}
                      </div>
                    </div>
                  </div>

                  {/* Topic Name */}
                  <h3 className="text-xl sm:text-2xl font-black text-yellow-200 mb-3 sm:mb-4 group-hover:scale-105 transition-all duration-500 drop-shadow-lg group-hover:text-yellow-300">
                    {topic.name}
                  </h3>
                  {/* Description */}
                  <p className="text-sm sm:text-base text-yellow-200 leading-relaxed mb-3 sm:mb-4 group-hover:text-yellow-300 transition-colors duration-300">
                    {topic.description}
                  </p>
                  {/* Subcategories */}
                  <div className="mb-3 sm:mb-4 flex-grow">
                    <h4 className="text-yellow-400 font-semibold mb-2 sm:mb-3 text-xs sm:text-sm">Popular Topics:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {topic.subcategories.map((sub, idx) => (
                        <div
                          key={sub}
                          className="bg-yellow-400/10 backdrop-blur-sm rounded-lg px-2 sm:px-3 py-1 sm:py-2 text-yellow-300 text-xs font-medium border border-yellow-400/20 group-hover:bg-yellow-400/20 group-hover:border-yellow-400/40 group-hover:text-yellow transition-all duration-300"
                          style={{ transitionDelay: `${idx * 100}ms` }}
                        >
                          {sub}
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-3 sm:mb-4">
                    <div className="text-center">
                      <div className="text-yellow-400 font-bold text-base sm:text-lg">{topic.stats.videos}</div>
                      <div className="text-yellow-300 text-xs">Videos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-yellow-400 font-bold text-base sm:text-lg">{topic.stats.companies}</div>
                      <div className="text-yellow-300 text-xs">Companies</div>
                    </div>
                    <div className="text-center">
                      <div className="text-yellow-400 font-bold text-base sm:text-lg">{topic.stats.events}</div>
                      <div className="text-yellow-300 text-xs">Events</div>
                    </div>
                  </div>
                  {/* CTA Button */}
                  <div className="flex justify-center mt-auto">
                    <div className="flex justify-center mt-auto">
                      <button
                        className="bg-yellow-400/20 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3 border border-yellow-400/30 group hover:bg-yellow-400/30 hover:scale-105 hover:border-yellow-400/50 hover:shadow-lg hover:shadow-yellow-400/30 transition-all duration-500 flex items-center gap-2"
                        // onClick handled by card itself
                        tabIndex={-1}
                        type="button"
                      >
                        <Play className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400" />
                        <span className="text-yellow-400 font-semibold text-sm sm:text-base">
                          Explore Content
                        </span>
                        <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 group-hover:translate-x-1 transition-transform duration-300" />
                      </button>
                    </div>
                  </div>
                </div>
                {/* Enhanced Floating Particles */}
                <div className="absolute inset-0 overflow-hidden rounded-3xl">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-yellow-400/40 rounded-full animate-float"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        animationDuration: `${2 + Math.random() * 3}s`
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BrowseByTopic;
