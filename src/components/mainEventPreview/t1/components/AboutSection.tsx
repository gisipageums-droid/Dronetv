


// import React from "react";

// interface AboutSectionProps {
//   aboutData?: {
//     heading: string;
//     subText: string;
//     features: {
//       title: string;
//       description: string;
//     }[];
//     zonesTitle: string;
//     zonesTitleHighlight: string;
//     zonesSubtitle: string;
//     zones: {
//       title: string;
//       description: string;
//     }[];
//   };
// }

// const AboutSection: React.FC<AboutSectionProps> = ({ aboutData }) => {
//   // Default data structure
//   const defaultAboutContent = {
//     heading: "demo Event",
//     subText: "Create 2-3 sentence event description",
//     features: [
//       {
//         title: "Feature 1",
//         description: "Feature description"
//       }
//     ],
//     zonesTitle: "Special",
//     zonesTitleHighlight: "Zones",
//     zonesSubtitle: "Discover specialized areas designed for different aspects of the event.",
//     zones: [
//       {
//         title: "Zone Title",
//         description: "Zone description"
//       }
//     ]
//   };

//   // Use prop data or default values
//   const aboutContent = aboutData || defaultAboutContent;

//   return (
//     <section id="about" className="py-20 bg-white">
//       <div className="container max-w-7xl mx-auto px-4">
//         {/* Heading */}
//         <div className="text-center mb-16">
//           <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
//             {aboutContent.heading}
//           </h2>
//           <div className="w-24 h-1 bg-[#FFD400] mx-auto mb-6"></div>
//           <p className="text-gray-600 text-lg max-w-4xl mx-auto leading-relaxed text-justify">
//             {aboutContent.subText}
//           </p>
//         </div>

//         {/* Features Section */}
//         <div className="mb-12">
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
//             {aboutContent.features.map((item, index) => (
//               <div
//                 key={index}
//                 className="bg-gray-50 p-6 rounded-xl border-[solid] border-[black] border-[1px] shadow-md hover:bg-[#FFD400] hover:text-black transition-all duration-300"
//               >
//                 <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#FF0000] text-white mb-4 text-xl font-bold">
//                   {item.title.charAt(0).toUpperCase()}
//                 </div>
//                 <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
//                 <p className="text-gray-600">{item.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Zones Section */}
//         <div className="text-center mb-16">
//           <h3 className="text-3xl font-bold text-black mb-4">
//             <span className="text-[#FFD400]">{aboutContent.zonesTitle}</span> {aboutContent.zonesTitleHighlight}
//           </h3>
//           <p className="text-gray-600 text-lg max-w-3xl mx-auto text-justify">
//             {aboutContent.zonesSubtitle}
//           </p>
//         </div>

//         <div className="mb-12">
//           <div className="grid md:grid-cols-2 gap-10">
//             {aboutContent.zones.map((zone, index) => (
//               <div
//                 key={index}
//                 className="bg-white p-6 rounded-2xl shadow-md border-[solid] border-[1px] border-yellow-400 hover:shadow-xl transition-all"
//               >
//                 <h4 className="text-xl font-semibold text-[#FF0000] mb-2">
//                   {zone.title}
//                 </h4>
//                 <p className="text-gray-700 leading-relaxed">{zone.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default AboutSection;




import React from "react";

interface AboutSectionProps {
  aboutData?: {
    heading: string;
    subText: string;
    features: {
      title: string;
      description: string;
    }[];
    zonesTitle: string;
    zonesTitleHighlight: string;
    zonesSubtitle: string;
    zones: {
      title: string;
      description: string;
    }[];
  };
}

const AboutSection: React.FC<AboutSectionProps> = ({ aboutData }) => {
  // Default data structure with updated content
  const defaultAboutContent = {
    heading: "Next-Gen Tech Summit 2024",
    subText: "Join the forefront of innovation at our premier technology conference. Connect with industry leaders, explore cutting-edge solutions, and shape the future of digital transformation in an immersive learning environment.",
    features: [
      {
        title: "AI & Machine Learning",
        description: "Explore the latest advancements in artificial intelligence and machine learning applications across industries."
      },
      {
        title: "Cloud Infrastructure",
        description: "Discover scalable cloud solutions and hybrid architectures for modern enterprise needs."
      },
      {
        title: "Cybersecurity",
        description: "Learn about next-generation security frameworks and threat mitigation strategies."
      }
    ],
    zonesTitle: "Interactive",
    zonesTitleHighlight: "Experiences",
    zonesSubtitle: "Engage with hands-on demonstrations, live workshops, and networking opportunities designed to maximize your learning.",
    zones: [
      {
        title: "Innovation Lab",
        description: "Test cutting-edge prototypes and collaborate on real-world tech challenges with industry experts."
      },
      {
        title: "Networking Hub",
        description: "Connect with peers, mentors, and potential collaborators in our dedicated networking space."
      }
    ]
  };

  const aboutContent = aboutData || defaultAboutContent;

  // Array of logo URLs for features
  const featureLogoUrls = [
    "https://img.icons8.com/color/96/000000/artificial-intelligence.png",
    "https://img.icons8.com/color/96/000000/cloud.png",
    "https://img.icons8.com/color/96/000000/security-checked.png",
    "https://img.icons8.com/color/96/000000/blockchain-technology.png",
    "https://img.icons8.com/color/96/000000/internet-of-things.png",
    "https://img.icons8.com/color/96/000000/data-analytics.png",
    "https://img.icons8.com/color/96/000000/robotics.png",
    "https://img.icons8.com/color/96/000000/virtual-reality.png",
    "https://img.icons8.com/color/96/000000/innovation.png",
    "https://img.icons8.com/color/96/000000/collaboration.png",
    "https://img.icons8.com/color/96/000000/workshop.png",
    "https://img.icons8.com/color/96/000000/networking.png"
  ];

  // Function to get a logo URL for a feature based on index
  const getFeatureLogoUrl = (index: number) => {
    return featureLogoUrls[index % featureLogoUrls.length];
  };

  return (
    <section id="about" className="py-20 bg-white text-justify">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            {aboutContent.heading}
          </h2>
          <div className="w-24 h-1 bg-[#FFD400] mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg max-w-4xl mx-auto leading-relaxed text-center">
            {aboutContent.subText}
          </p>
        </div>

        {/* Features Section */}
        <div className="mb-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
            {aboutContent.features.map((item, index) => (
              <div
                key={index}
                className="bg-gray-50 p-6 rounded-xl border-[solid] border-[black] border-[1px] shadow-md hover:bg-[#FFD400] hover:text-black transition-all duration-300"
              >
                {/* Logo Image for Feature */}
                <div className="w-16 h-16 flex items-center justify-center mb-4">
                  <img 
                    src={getFeatureLogoUrl(index)} 
                    alt={`${item.title} logo`}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = featureLogoUrls[0];
                    }}
                  />
                </div>
                
                <h4 className="text-xl font-semibold mb-2 text-center">{item.title}</h4>
                <p className="text-gray-600 text-center">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Zones Section */}
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-black mb-4">
            <span className="text-[#FFD400]">{aboutContent.zonesTitle}</span> {aboutContent.zonesTitleHighlight}
          </h3>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto text-center">
            {aboutContent.zonesSubtitle}
          </p>
        </div>

        <div className="mb-12">
          <div className="grid md:grid-cols-2 gap-10">
            {aboutContent.zones.map((zone, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-md border-[solid] border-[1px] border-yellow-400 hover:shadow-xl transition-all"
              >
                <h4 className="text-xl font-semibold text-[#FF0000] mb-2 text-center">
                  {zone.title}
                </h4>
                <p className="text-gray-700 leading-relaxed text-center">{zone.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;