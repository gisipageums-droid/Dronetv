// import React from 'react';
// import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';

// const HeroSection: React.FC = () => {
//   return (
//     <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
//       {/* Animated Background */}
//       <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
//         {/* Animated Particles */}
//         <div className="absolute inset-0">
//           {[...Array(20)].map((_, i) => (
//             <div
//               key={i}
//               className="absolute w-2 h-2 bg-[#FFD400] rounded-full animate-pulse opacity-30"
//               style={{
//                 left: `${Math.random() * 100}%`,
//                 top: `${Math.random() * 100}%`,
//                 animationDelay: `${Math.random() * 3}s`,
//                 animationDuration: `${2 + Math.random() * 2}s`
//               }}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Floating Drone Animation */}
//       <div className="absolute top-1/4 right-1/4 opacity-10 animate-float">
//         <svg width="300" height="200" viewBox="0 0 300 200" className="text-[#FFD400]">
//           <rect x="130" y="90" width="40" height="20" rx="10" fill="currentColor" />
//           <circle cx="110" cy="70" r="25" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin" style={{ animationDuration: '0.1s' }} />
//           <circle cx="190" cy="70" r="25" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin" style={{ animationDuration: '0.1s' }} />
//           <circle cx="110" cy="130" r="25" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin" style={{ animationDuration: '0.1s' }} />
//           <circle cx="190" cy="130" r="25" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin" style={{ animationDuration: '0.1s' }} />
//           <line x1="130" y1="100" x2="110" y2="70" stroke="currentColor" strokeWidth="3" />
//           <line x1="170" y1="100" x2="190" y2="70" stroke="currentColor" strokeWidth="3" />
//           <line x1="130" y1="100" x2="110" y2="130" stroke="currentColor" strokeWidth="3" />
//           <line x1="170" y1="100" x2="190" y2="130" stroke="currentColor" strokeWidth="3" />
//           <circle cx="150" cy="100" r="6" fill="#FF0000" />
//         </svg>
//       </div>

//       {/* Content */}
//       <div className="container mx-auto px-4 relative z-10 text-center">
//         <div className="max-w-5xl mx-auto">
//           {/* Badge */}
//           <div 
//             data-aos="fade-up" 
//             data-aos-delay="300"
//             className="inline-flex items-center gap-2 bg-[#FF0000]/20 border border-[#FF0000] rounded-full px-6 py-2 mb-8"
//           >
//             <div className="w-2 h-2 bg-[#FF0000] rounded-full animate-pulse"></div>
//             <span className="text-[#FF0000] font-semibold">Limited Passes Available</span>
//           </div>

//           <h1 
//             data-aos="fade-up" 
//             data-aos-delay="600"
//             className="text-6xl md:text-8xl font-bold text-[#FFD400] mb-6 leading-tight"
//           >
//             Future of <span className="text-white">Flight</span> Expo 2025
//           </h1>
          
//           <p 
//             data-aos="fade-up" 
//             data-aos-delay="900"
//             className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
//           >
//             Experience the most innovative drone technologies, witness thrilling competitions, 
//             and connect with industry pioneers at the ultimate aerial technology showcase.
//           </p>

//           {/* Event Details */}
//           <div 
//             data-aos="fade-up" 
//             data-aos-delay="1200"
//             className="flex flex-wrap justify-center gap-8 mb-12 text-white"
//           >
//             <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
//               <Calendar size={20} className="text-[#FFD400]" />
//               <span>July 20-21, 2025</span>
//             </div>
//             <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
//               <MapPin size={20} className="text-[#FFD400]" />
//               <span>Expo Center, Los Angeles</span>
//             </div>
//             <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
//               <Users size={20} className="text-[#FFD400]" />
//               <span>5000+ Attendees</span>
//             </div>
//           </div>

//           <div 
//             data-aos="fade-up" 
//             data-aos-delay="1500"
//             className="flex flex-col sm:flex-row gap-6 justify-center"
//           >
//             <button className="group bg-[#FFD400] hover:bg-[#FFD400]/90 text-black px-8 py-4 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-3 transform hover:scale-105 shadow-lg hover:shadow-xl">
//               <span>Book Your Stall</span>
//               <ArrowRight size={20} className="transform group-hover:translate-x-1 transition-transform" />
//             </button>

//             <button className="group bg-[#FF0000] hover:bg-[#FF0000]/90 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-3 transform hover:scale-105 shadow-lg hover:shadow-xl">
//               <span>Attend Event</span>
//               <ArrowRight size={20} className="transform group-hover:translate-x-1 transition-transform" />
//             </button>
//           </div>

//           {/* Stats */}
//           <div 
//             data-aos="fade-up" 
//             data-aos-delay="1800"
//             className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16"
//           >
//             <div className="text-center">
//               <div className="text-3xl font-bold text-[#FF0000] mb-2">100+</div>
//               <div className="text-sm text-gray-400">Exhibitors</div>
//             </div>
//             <div className="text-center">
//               <div className="text-3xl font-bold text-[#FF0000] mb-2">50+</div>
//               <div className="text-sm text-gray-400">Speakers</div>
//             </div>
//             <div className="text-center">
//               <div className="text-3xl font-bold text-[#FF0000] mb-2">20+</div>
//               <div className="text-sm text-gray-400">Competitions</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Floating Elements */}
//       <div className="absolute top-1/3 left-1/4 w-4 h-4 bg-[#FF0000] rounded-full animate-ping opacity-75"></div>
//       <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-[#FFD400] rounded-full animate-pulse"></div>
//       <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-[#FF0000] rounded-full animate-bounce opacity-60"></div>
//     </section>
//   );
// };

// export default HeroSection;



import React, { useState } from "react";
import { Calendar, MapPin, Users, ArrowRight, Save, Edit } from "lucide-react";

interface HeroData {
  badge: string;
  title: string;
  subtitle: string;
  date: string;
  location: string;
  attendees: string;
  exhibitors: string;
  speakers: string;
  competitions: string;
}

const HeroSection: React.FC = () => {
  // Dummy data (later replace with API data)
  const [data, setData] = useState<HeroData>({
    badge: "Limited Passes Available",
    title: "Future of Flight Expo 2025",
    subtitle:
      "Experience the most innovative drone technologies, witness thrilling competitions, and connect with industry pioneers at the ultimate aerial technology showcase.",
    date: "July 20-21, 2025",
    location: "Expo Center, Los Angeles",
    attendees: "5000+ Attendees",
    exhibitors: "100+",
    speakers: "50+",
    competitions: "20+",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(data);

  const handleSave = () => {
    setData(form);
    setIsEditing(false);
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden "
    >
      {/* Edit Button
      <div className="absolute top-4 right-4 z-20">
        {isEditing ? (
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="absolute top-4 right-4 bg-[#FFD400] text-black px-3 py-2 rounded-full flex items-center gap-2 shadow-lg"
          >
            Edit
          </button>
        )}
      </div> */}

      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-[#FFD400] rounded-full animate-pulse opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Floating Drone Animation */}
      <div className="absolute top-1/4 right-1/4 opacity-10 animate-float">
        {/* (same SVG drone animation) */}
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="max-w-5xl mx-auto">
          {/* Badge */}
          {isEditing ? (
            <input
              className="border p-2 rounded mb-8 w-full text-center"
              value={form.badge}
              onChange={(e) => setForm({ ...form, badge: e.target.value })}
            />
          ) : (
            <div className="inline-flex items-center gap-2 bg-[#FF0000]/20 border border-[#FF0000] rounded-full px-6 py-2 mb-8">
              <div className="w-2 h-2 bg-[#FF0000] rounded-full animate-pulse"></div>
              <span className="text-[#FF0000] font-semibold">{data.badge}</span>
              
            </div>
          )}




          {/* Edit Button
      <div className="absolute top-20 right-4 z-20">
        {isEditing ? (
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="absolute top-4 right-4 bg-[#FFD400] text-black px-3 py-2 rounded-full flex items-center gap-2 shadow-lg"
          >
            Edit
          </button>
        )}
      </div> */}

<div className="absolute top-20 right-4 z-20">
  <button
    onClick={() => setIsEditing((s) => !s)}
    className="flex items-center gap-2 bg-[#FFD400] text-black px-4 py-2 rounded-full shadow-lg hover:bg-[#FFD400]/90 transition-all duration-300"
  >
    {isEditing ? <Save size={16} /> : <Edit size={16} />}
    <span>{isEditing ? "Save" : "Edit"}</span>
  </button>
</div>




          {/* Title */}
          {isEditing ? (
            <input
              className="border p-2 rounded mb-6 w-full text-center text-4xl font-bold"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          ) : (
            <h1 className="text-6xl md:text-8xl font-bold text-[#FFD400] mb-6 leading-tight">
              {data.title.split(" ").slice(0, 2).join(" ")}{" "}
              <span className="text-white">
                {data.title.split(" ").slice(2).join(" ")}
              </span>
            </h1>
          )}

          {/* Subtitle */}
          {isEditing ? (
            <textarea
              className="border p-2 rounded mb-8 w-full"
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
            />
          ) : (
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              {data.subtitle}
            </p>
          )}

          {/* Event Details */}
          <div className="flex flex-wrap justify-center gap-8 mb-12 text-white">
            {isEditing ? (
              <>
                <input
                  className="border p-2 rounded"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
                <input
                  className="border p-2 rounded"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
                <input
                  className="border p-2 rounded"
                  value={form.attendees}
                  onChange={(e) => setForm({ ...form, attendees: e.target.value })}
                />
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
                  <Calendar size={20} className="text-[#FFD400]" />
                  <span>{data.date}</span>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
                  <MapPin size={20} className="text-[#FFD400]" />
                  <span>{data.location}</span>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
                  <Users size={20} className="text-[#FFD400]" />
                  <span>{data.attendees}</span>
                </div>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16">
            {isEditing ? (
              <>
                <input
                  className="border p-2 rounded text-center"
                  value={form.exhibitors}
                  onChange={(e) =>
                    setForm({ ...form, exhibitors: e.target.value })
                  }
                />
                <input
                  className="border p-2 rounded text-center"
                  value={form.speakers}
                  onChange={(e) =>
                    setForm({ ...form, speakers: e.target.value })
                  }
                />
                <input
                  className="border p-2 rounded text-center"
                  value={form.competitions}
                  onChange={(e) =>
                    setForm({ ...form, competitions: e.target.value })
                  }
                />
              </>
            ) : (
              <>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#FF0000] mb-2">
                    {data.exhibitors}
                  </div>
                  <div className="text-sm text-gray-400">Exhibitors</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#FF0000] mb-2">
                    {data.speakers}
                  </div>
                  <div className="text-sm text-gray-400">Speakers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#FF0000] mb-2">
                    {data.competitions}
                  </div>
                  <div className="text-sm text-gray-400">Competitions</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
