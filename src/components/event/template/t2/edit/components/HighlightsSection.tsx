// import React from 'react';
// import { Zap, Trophy, Users, Rocket } from 'lucide-react';

// const HighlightsSection: React.FC = () => {
//   const highlights = [
//     {
//       icon: <Zap size={48} />,
//       title: 'Drone Racing Championship',
//       description: 'Watch professional pilots compete in high-speed racing competitions with cutting-edge FPV drones.',
//       color: 'from-[#FF0000] to-[#FF0000]/80'
//     },
//     {
//       icon: <Trophy size={48} />,
//       title: 'Innovation Awards',
//       description: 'Discover groundbreaking drone technologies and vote for the most innovative products of the year.',
//       color: 'from-[#FFD400] to-[#FFD400]/80'
//     },
//     {
//       icon: <Users size={48} />,
//       title: 'Networking Hub',
//       description: 'Connect with industry leaders, investors, and fellow enthusiasts in dedicated networking zones.',
//       color: 'from-purple-500 to-purple-400'
//     },
//     {
//       icon: <Rocket size={48} />,
//       title: 'Live Demonstrations',
//       description: 'Experience hands-on demos of the latest drone technologies, from mapping to delivery systems.',
//       color: 'from-blue-500 to-blue-400'
//     }
//   ];

//   return (
//     <section id="highlights" className="py-20 bg-black">
//       <div className="container mx-auto px-4">
//         <div className="text-center mb-16">
//           <h2 data-aos="fade-up" className="text-4xl md:text-6xl font-bold text-[#FFD400] mb-4">
//             What's <span className="text-white">Happening</span>
//           </h2>
//           <div data-aos="fade-up" data-aos-delay="200" className="w-32 h-1 bg-[#FFD400] mx-auto mb-6"></div>
//           <p data-aos="fade-up" data-aos-delay="400" className="text-gray-300 text-lg max-w-3xl mx-auto">
//             Immerse yourself in the ultimate drone experience with competitions, demonstrations, and networking opportunities.
//           </p>
//         </div>

//         <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
//           {highlights.map((highlight, index) => (
//             <div 
//               key={index}
//               data-aos="fade-up" 
//               data-aos-delay={index * 200}
//               className="group relative bg-gray-900/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-800 hover:border-[#FFD400]/50 transition-all duration-500 transform hover:scale-105 overflow-hidden"
//             >
//               {/* Gradient Background */}
//               <div className={`absolute inset-0 bg-gradient-to-br ${highlight.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
              
//               <div className="relative z-10">
//                 {/* Icon */}
//                 <div className="w-20 h-20 bg-[#FF0000] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#FFD400] group-hover:scale-110 transition-all duration-300">
//                   <div className="text-white group-hover:text-black transition-colors">
//                     {highlight.icon}
//                   </div>
//                 </div>
                
//                 {/* Content */}
//                 <h3 className="text-xl font-bold text-[#FFD400] mb-4 group-hover:text-white transition-colors">
//                   {highlight.title}
//                 </h3>
                
//                 <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
//                   {highlight.description}
//                 </p>

//                 {/* Hover Arrow */}
//                 <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                   <div className="flex items-center gap-2 text-[#FF0000] font-semibold">
//                     <span>Learn More</span>
//                     <div className="w-0 group-hover:w-6 h-0.5 bg-[#FF0000] transition-all duration-300"></div>
//                     <span>→</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Animated Border */}
//               <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-[#FFD400]/30 transition-colors duration-500"></div>
//             </div>
//           ))}
//         </div>

//         {/* Call to Action */}
//         <div data-aos="fade-up" data-aos-delay="800" className="text-center mt-16">
//           <div className="bg-gradient-to-r from-[#FFD400] to-[#FFD400]/80 rounded-3xl p-12 max-w-3xl mx-auto">
//             <h3 className="text-3xl font-bold text-black mb-4">
//               Ready to Experience the Future?
//             </h3>
//             <p className="text-black/80 mb-8 text-lg">
//               Join thousands of drone enthusiasts, industry professionals, and technology pioneers.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <button className="bg-[#FF0000] hover:bg-[#FF0000]/90 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
//                 Register Now
//               </button>
//               <button className="border-2 border-black text-black hover:bg-black hover:text-white px-8 py-4 rounded-full font-semibold transition-all duration-300">
//                 View Schedule
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default HighlightsSection;



import React, { useState } from "react";
import { Zap, Trophy, Users, Rocket, Edit, Save } from "lucide-react";

const HighlightsSection: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);

  const [content, setContent] = useState({
    heading: "What's Happening",
    subheading:
      "Immerse yourself in the ultimate drone experience with competitions, demonstrations, and networking opportunities.",
    highlights: [
      {
        icon: <Zap size={48} />,
        title: "Drone Racing Championship",
        description:
          "Watch professional pilots compete in high-speed racing competitions with cutting-edge FPV drones.",
        color: "from-[#FF0000] to-[#FF0000]/80",
      },
      {
        icon: <Trophy size={48} />,
        title: "Innovation Awards",
        description:
          "Discover groundbreaking drone technologies and vote for the most innovative products of the year.",
        color: "from-[#FFD400] to-[#FFD400]/80",
      },
      {
        icon: <Users size={48} />,
        title: "Networking Hub",
        description:
          "Connect with industry leaders, investors, and fellow enthusiasts in dedicated networking zones.",
        color: "from-purple-500 to-purple-400",
      },
      {
        icon: <Rocket size={48} />,
        title: "Live Demonstrations",
        description:
          "Experience hands-on demos of the latest drone technologies, from mapping to delivery systems.",
        color: "from-blue-500 to-blue-400",
      },
    ],
    ctaHeading: "Ready to Experience the Future?",
    ctaText:
      "Join thousands of drone enthusiasts, industry professionals, and technology pioneers.",
    ctaButtons: {
      primary: "Register Now",
      secondary: "View Schedule",
    },
  });

  const handleChange = (
    field: string,
    value: string,
    highlightIndex?: number
  ) => {
    if (highlightIndex !== undefined) {
      const updatedHighlights = [...content.highlights];
      (updatedHighlights[highlightIndex] as any)[field] = value;
      setContent({ ...content, highlights: updatedHighlights });
    } else {
      setContent({ ...content, [field]: value });
    }
  };

  const handleCtaButtonChange = (btn: "primary" | "secondary", value: string) =>
    setContent({
      ...content,
      ctaButtons: { ...content.ctaButtons, [btn]: value },
    });

  return (
    <section id="highlights" className="py-20 bg-black relative">
      {/* Edit Button */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFD400] text-black font-semibold shadow-md hover:bg-yellow-400 transition"
        >
          {isEditing ? <Save size={18} /> : <Edit size={18} />}
          {isEditing ? "Save" : "Edit"}
        </button>
      </div>

      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-16">
          {isEditing ? (
            <input
              value={content.heading}
              onChange={(e) => handleChange("heading", e.target.value)}
              className="text-4xl md:text-6xl font-bold text-[#FFD400] mb-4 bg-gray-800 px-4 py-2 rounded-md text-center"
            />
          ) : (
            <h2
              data-aos="fade-up"
              className="text-4xl md:text-6xl font-bold text-[#FFD400] mb-4"
            >
              {content.heading}
            </h2>
          )}

          <div
            data-aos="fade-up"
            data-aos-delay="200"
            className="w-32 h-1 bg-[#FFD400] mx-auto mb-6"
          ></div>

          {isEditing ? (
            <textarea
              value={content.subheading}
              onChange={(e) => handleChange("subheading", e.target.value)}
              className="text-gray-300 text-lg max-w-3xl mx-auto bg-gray-800 px-4 py-2 rounded-md w-full text-center"
            />
          ) : (
            <p
              data-aos="fade-up"
              data-aos-delay="400"
              className="text-gray-300 text-lg max-w-3xl mx-auto"
            >
              {content.subheading}
            </p>
          )}
        </div>

        {/* Highlights */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {content.highlights.map((highlight, index) => (
            <div
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 200}
              className="group relative bg-gray-900/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-800 hover:border-[#FFD400]/50 transition-all duration-500 transform hover:scale-105 overflow-hidden"
            >
              {/* Gradient Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${highlight.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
              ></div>

              <div className="relative z-10">
                {/* Icon */}
                <div className="w-20 h-20 bg-[#FF0000] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#FFD400] group-hover:scale-110 transition-all duration-300">
                  <div className="text-white group-hover:text-black transition-colors">
                    {highlight.icon}
                  </div>
                </div>

                {/* Content (Editable) */}
                {isEditing ? (
                  <div className="flex flex-col gap-3">
                    <input
                      value={highlight.title}
                      onChange={(e) =>
                        handleChange("title", e.target.value, index)
                      }
                      className="w-full px-3 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-[#FFD400]"
                    />
                    <textarea
                      value={highlight.description}
                      onChange={(e) =>
                        handleChange("description", e.target.value, index)
                      }
                      rows={3}
                      className="w-full px-3 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-[#FFD400]"
                    />
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-bold text-[#FFD400] mb-4 group-hover:text-white transition-colors">
                      {highlight.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                      {highlight.description}
                    </p>
                  </>
                )}

                {/* Hover Arrow */}
                {!isEditing && (
                  <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center gap-2 text-[#FF0000] font-semibold">
                      <span>Learn More</span>
                      <div className="w-0 group-hover:w-6 h-0.5 bg-[#FF0000] transition-all duration-300"></div>
                      <span>→</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Animated Border */}
              <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-[#FFD400]/30 transition-colors duration-500"></div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          data-aos="fade-up"
          data-aos-delay="800"
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-[#FFD400] to-[#FFD400]/80 rounded-3xl p-12 max-w-3xl mx-auto">
            {isEditing ? (
              <input
                value={content.ctaHeading}
                onChange={(e) => handleChange("ctaHeading", e.target.value)}
                className="text-3xl font-bold text-black mb-4 bg-white/70 px-4 py-2 rounded-md w-full text-center"
              />
            ) : (
              <h3 className="text-3xl font-bold text-black mb-4">
                {content.ctaHeading}
              </h3>
            )}

            {isEditing ? (
              <textarea
                value={content.ctaText}
                onChange={(e) => handleChange("ctaText", e.target.value)}
                className="text-black/80 mb-8 text-lg bg-white/70 px-4 py-2 rounded-md w-full text-center"
              />
            ) : (
              <p className="text-black/80 mb-8 text-lg">{content.ctaText}</p>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isEditing ? (
                <>
                  <input
                    value={content.ctaButtons.primary}
                    onChange={(e) =>
                      handleCtaButtonChange("primary", e.target.value)
                    }
                    className="px-4 py-2 rounded-md bg-white/70 text-center"
                  />
                  <input
                    value={content.ctaButtons.secondary}
                    onChange={(e) =>
                      handleCtaButtonChange("secondary", e.target.value)
                    }
                    className="px-4 py-2 rounded-md bg-white/70 text-center"
                  />
                </>
              ) : (
                <>
                  <button className="bg-[#FF0000] hover:bg-[#FF0000]/90 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
                    {content.ctaButtons.primary}
                  </button>
                  <button className="border-2 border-black text-black hover:bg-black hover:text-white px-8 py-4 rounded-full font-semibold transition-all duration-300">
                    {content.ctaButtons.secondary}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HighlightsSection;
