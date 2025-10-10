// import React from 'react';
// import { ExternalLink } from 'lucide-react';

// const ExhibitorsSection: React.FC = () => {
//   const exhibitors = [
//     {
//       name: 'AeroTech Dynamics',
//       logo: 'https://images.pexels.com/photos/1851415/pexels-photo-1851415.jpeg?auto=compress&cs=tinysrgb&w=200',
//       category: 'Manufacturing',
//       description: 'Leading manufacturer of commercial and industrial drone systems.',
//       website: '#',
//       booth: 'A-101'
//     },
//     {
//       name: 'SkyVision Systems',
//       logo: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=200',
//       category: 'Software',
//       description: 'AI-powered flight control and navigation software solutions.',
//       website: '#',
//       booth: 'B-205'
//     },
//     {
//       name: 'DroneFlow Corp',
//       logo: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=200',
//       category: 'Services',
//       description: 'Professional drone services for mapping, inspection, and delivery.',
//       website: '#',
//       booth: 'C-150'
//     },
//     {
//       name: 'Future Flight Labs',
//       logo: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=200',
//       category: 'Research',
//       description: 'Cutting-edge research in autonomous flight and swarm intelligence.',
//       website: '#',
//       booth: 'D-075'
//     },
//     {
//       name: 'Autonomous Systems Inc',
//       logo: 'https://images.pexels.com/photos/1310522/pexels-photo-1310522.jpeg?auto=compress&cs=tinysrgb&w=200',
//       category: 'Hardware',
//       description: 'Advanced sensors and hardware components for UAV systems.',
//       website: '#',
//       booth: 'E-320'
//     },
//     {
//       name: 'NextGen Aviation',
//       logo: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=200',
//       category: 'Innovation',
//       description: 'Urban air mobility and next-generation aircraft development.',
//       website: '#',
//       booth: 'F-180'
//     },
//     {
//       name: 'PropTech Solutions',
//       logo: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=200',
//       category: 'Components',
//       description: 'High-performance propellers and motor systems for drones.',
//       website: '#',
//       booth: 'G-245'
//     },
//     {
//       name: 'CloudNav Systems',
//       logo: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=200',
//       category: 'Cloud',
//       description: 'Cloud-based fleet management and data analytics platforms.',
//       website: '#',
//       booth: 'H-110'
//     }
//   ];

//   const getCategoryColor = (category: string) => {
//     switch (category) {
//       case 'Manufacturing': return 'bg-[#FF0000] text-white';
//       case 'Software': return 'bg-[#FFD400] text-black';
//       case 'Services': return 'bg-blue-500 text-white';
//       case 'Research': return 'bg-purple-500 text-white';
//       case 'Hardware': return 'bg-green-500 text-white';
//       case 'Innovation': return 'bg-orange-500 text-white';
//       case 'Components': return 'bg-indigo-500 text-white';
//       case 'Cloud': return 'bg-cyan-500 text-white';
//       default: return 'bg-gray-500 text-white';
//     }
//   };

//   return (
//     <section id="exhibitors" className="py-20 bg-gray-900">
//       <div className="container mx-auto px-4">
//         <div className="text-center mb-16">
//           <h2 data-aos="fade-up" className="text-4xl md:text-6xl font-bold text-[#FFD400] mb-4">
//             Our <span className="text-white">Exhibitors</span>
//           </h2>
//           <div data-aos="fade-up" data-aos-delay="200" className="w-32 h-1 bg-[#FFD400] mx-auto mb-6"></div>
//           <p data-aos="fade-up" data-aos-delay="400" className="text-gray-300 text-lg max-w-3xl mx-auto">
//             Discover innovative products and services from leading companies in the drone industry.
//           </p>
//         </div>

//         {/* Exhibitors Grid */}
//         <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
//           {exhibitors.map((exhibitor, index) => (
//             <div 
//               key={index}
//               data-aos="fade-up" 
//               data-aos-delay={index * 100}
//               className="group bg-black/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-800 hover:border-[#FFD400]/50 transition-all duration-500 transform hover:scale-105"
//             >
//               {/* Logo */}
//               <div className="relative h-32 bg-white/5 flex items-center justify-center p-4">
//                 <img 
//                   src={exhibitor.logo} 
//                   alt={exhibitor.name}
//                   className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
//                 />
//                 <div className="absolute top-2 right-2">
//                   <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(exhibitor.category)}`}>
//                     {exhibitor.category}
//                   </span>
//                 </div>
//               </div>
              
//               {/* Content */}
//               <div className="p-6">
//                 <div className="flex items-center justify-between mb-3">
//                   <h3 className="text-lg font-bold text-white group-hover:text-[#FFD400] transition-colors">
//                     {exhibitor.name}
//                   </h3>
//                   <span className="text-[#FF0000] font-semibold text-sm">
//                     {exhibitor.booth}
//                   </span>
//                 </div>
                
//                 <p className="text-gray-400 text-sm mb-4 leading-relaxed">
//                   {exhibitor.description}
//                 </p>
                
//                 <a 
//                   href={exhibitor.website}
//                   className="inline-flex items-center gap-2 text-[#FFD400] hover:text-white transition-colors text-sm font-semibold"
//                 >
//                   <span>Visit Booth</span>
//                   <ExternalLink size={14} />
//                 </a>
//               </div>

//               {/* Hover Effect */}
//               <div className="absolute inset-0 bg-gradient-to-t from-[#FF0000]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
//             </div>
//           ))}
//         </div>

//         {/* Floor Plan CTA */}
//         <div data-aos="fade-up" data-aos-delay="800" className="text-center">
//           <div className="bg-black/50 backdrop-blur-sm rounded-3xl p-12 max-w-3xl mx-auto border border-gray-800">
//             <h3 className="text-3xl font-bold text-white mb-4">
//               Explore the Exhibition Floor
//             </h3>
//             <p className="text-gray-400 mb-8 text-lg">
//               Navigate through 100+ exhibitor booths showcasing the latest in drone technology, 
//               from hardware innovations to software solutions.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <button className="bg-[#FF0000] hover:bg-[#FF0000]/90 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
//                 Download Floor Plan
//               </button>
//               <button className="border-2 border-[#FFD400] text-[#FFD400] hover:bg-[#FFD400] hover:text-black px-8 py-4 rounded-full font-semibold transition-all duration-300">
//                 Book Your Booth
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Stats */}
//         <div data-aos="fade-up" data-aos-delay="1000" className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
//           <div className="text-center">
//             <div className="text-3xl font-bold text-[#FF0000] mb-2">100+</div>
//             <div className="text-gray-400">Exhibitors</div>
//           </div>
//           <div className="text-center">
//             <div className="text-3xl font-bold text-[#FF0000] mb-2">25+</div>
//             <div className="text-gray-400">Countries</div>
//           </div>
//           <div className="text-center">
//             <div className="text-3xl font-bold text-[#FF0000] mb-2">50+</div>
//             <div className="text-gray-400">Product Launches</div>
//           </div>
//           <div className="text-center">
//             <div className="text-3xl font-bold text-[#FF0000] mb-2">10K+</div>
//             <div className="text-gray-400">Sq Ft Exhibition</div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ExhibitorsSection;




import React, { useState } from "react";
import { ExternalLink, Edit, Save, Upload, X } from "lucide-react";

const ExhibitorsSection: React.FC = () => {
  const [editMode, setEditMode] = useState(false);

  const [sectionData, setSectionData] = useState({
    heading: "Our Exhibitors",
    subheading: "Discover innovative products and services from leading companies in the drone industry.",
    cta: {
      title: "Explore the Exhibition Floor",
      description:
        "Navigate through 100+ exhibitor booths showcasing the latest in drone technology, from hardware innovations to software solutions.",
      buttons: ["Download Floor Plan", "Book Your Booth"],
    },
    stats: [
      { value: "100+", label: "Exhibitors" },
      { value: "25+", label: "Countries" },
      { value: "50+", label: "Product Launches" },
      { value: "10K+", label: "Sq Ft Exhibition" },
    ],
    exhibitors: [
      {
        name: "AeroTech Dynamics",
        logo:
          "https://images.pexels.com/photos/1851415/pexels-photo-1851415.jpeg?auto=compress&cs=tinysrgb&w=200",
        category: "Manufacturing",
        description: "Leading manufacturer of commercial and industrial drone systems.",
        website: "#",
        booth: "A-101",
      },
      {
        name: "SkyVision Systems",
        logo:
          "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=200",
        category: "Software",
        description: "AI-powered flight control and navigation software solutions.",
        website: "#",
        booth: "B-205",
      },
      {
        name: "DroneFlow Corp",
        logo:
          "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=200",
        category: "Services",
        description: "Professional drone services for mapping, inspection, and delivery.",
        website: "#",
        booth: "C-150",
      },
      {
        name: "Future Flight Labs",
        logo:
          "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=200",
        category: "Research",
        description: "Cutting-edge research in autonomous flight and swarm intelligence.",
        website: "#",
        booth: "D-075",
      },
      {
        name: "Autonomous Systems Inc",
        logo:
          "https://images.pexels.com/photos/1310522/pexels-photo-1310522.jpeg?auto=compress&cs=tinysrgb&w=200",
        category: "Hardware",
        description: "Advanced sensors and hardware components for UAV systems.",
        website: "#",
        booth: "E-320",
      },
      {
        name: "NextGen Aviation",
        logo:
          "https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=200",
        category: "Innovation",
        description: "Urban air mobility and next-generation aircraft development.",
        website: "#",
        booth: "F-180",
      },
      {
        name: "PropTech Solutions",
        logo:
          "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=200",
        category: "Components",
        description: "High-performance propellers and motor systems for drones.",
        website: "#",
        booth: "G-245",
      },
      {
        name: "CloudNav Systems",
        logo:
          "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=200",
        category: "Cloud",
        description: "Cloud-based fleet management and data analytics platforms.",
        website: "#",
        booth: "H-110",
      },
    ],
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Manufacturing":
        return "bg-[#FF0000] text-white";
      case "Software":
        return "bg-[#FFD400] text-black";
      case "Services":
        return "bg-blue-500 text-white";
      case "Research":
        return "bg-purple-500 text-white";
      case "Hardware":
        return "bg-green-500 text-white";
      case "Innovation":
        return "bg-orange-500 text-white";
      case "Components":
        return "bg-indigo-500 text-white";
      case "Cloud":
        return "bg-cyan-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const handleImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileUrl = URL.createObjectURL(e.target.files[0]);
      const newExhibitors = [...sectionData.exhibitors];
      newExhibitors[index].logo = fileUrl;
      setSectionData({ ...sectionData, exhibitors: newExhibitors });
    }
  };

  const handleImageRemove = (index: number) => {
    const newExhibitors = [...sectionData.exhibitors];
    newExhibitors[index].logo = "";
    setSectionData({ ...sectionData, exhibitors: newExhibitors });
  };

  return (
    <section id="exhibitors" className="py-20 bg-gray-900 relative">
      {/* Edit Button */}
      <button
        onClick={() => setEditMode(!editMode)}
        className="absolute top-4 right-4 bg-[#FFD400] text-black px-4 py-2 rounded-full font-semibold flex items-center gap-2"
      >
        {editMode ? <Save size={16} /> : <Edit size={16} />}
        {editMode ? "Save" : "Edit"}
      </button>

      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          {editMode ? (
            <input
              className="text-4xl md:text-6xl font-bold text-center text-[#FFD400] bg-transparent border-b border-gray-500 focus:outline-none w-full"
              value={sectionData.heading}
              onChange={(e) => setSectionData({ ...sectionData, heading: e.target.value })}
            />
          ) : (
            <h2 className="text-4xl md:text-6xl font-bold text-[#FFD400] mb-4">{sectionData.heading}</h2>
          )}
          <div className="w-32 h-1 bg-[#FFD400] mx-auto mb-6"></div>
          {editMode ? (
            <textarea
              className="text-gray-300 text-lg max-w-3xl mx-auto bg-transparent border border-gray-600 p-2 rounded w-full"
              value={sectionData.subheading}
              onChange={(e) => setSectionData({ ...sectionData, subheading: e.target.value })}
            />
          ) : (
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">{sectionData.subheading}</p>
          )}
        </div>

        {/* Exhibitors Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {sectionData.exhibitors.map((exhibitor, index) => (
            <div
              key={index}
              className="group bg-black/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-800"
            >
              {/* Logo */}
              <div className="relative h-32 bg-white/5 flex items-center justify-center p-4">
                {exhibitor.logo ? (
                  <img src={exhibitor.logo} alt={exhibitor.name} className="max-w-full max-h-full object-contain" />
                ) : (
                  <span className="text-gray-500">No Image</span>
                )}
                <div className="absolute top-2 right-2 flex gap-2 items-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(exhibitor.category)}`}>
                    {editMode ? (
                      <input
                        className="bg-transparent border-b border-gray-500 text-xs"
                        value={exhibitor.category}
                        onChange={(e) => {
                          const newEx = [...sectionData.exhibitors];
                          newEx[index].category = e.target.value;
                          setSectionData({ ...sectionData, exhibitors: newEx });
                        }}
                      />
                    ) : (
                      exhibitor.category
                    )}
                  </span>
                  {editMode && (
                    <>
                      <label className="cursor-pointer">
                        <Upload size={14} className="text-[#FFD400]" />
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(index, e)} />
                      </label>
                      <button onClick={() => handleImageRemove(index)}>
                        <X size={14} className="text-red-500" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  {editMode ? (
                    <input
                      className="text-lg font-bold text-white bg-transparent border-b border-gray-500"
                      value={exhibitor.name}
                      onChange={(e) => {
                        const newEx = [...sectionData.exhibitors];
                        newEx[index].name = e.target.value;
                        setSectionData({ ...sectionData, exhibitors: newEx });
                      }}
                    />
                  ) : (
                    <h3 className="text-lg font-bold text-white">{exhibitor.name}</h3>
                  )}
                  {editMode ? (
                    <input
                      className="text-[#FF0000] font-semibold text-sm bg-transparent border-b border-gray-500"
                      value={exhibitor.booth}
                      onChange={(e) => {
                        const newEx = [...sectionData.exhibitors];
                        newEx[index].booth = e.target.value;
                        setSectionData({ ...sectionData, exhibitors: newEx });
                      }}
                    />
                  ) : (
                    <span className="text-[#FF0000] font-semibold text-sm">{exhibitor.booth}</span>
                  )}
                </div>

                {editMode ? (
                  <textarea
                    className="text-gray-400 text-sm mb-4 bg-transparent border border-gray-600 p-1 rounded w-full"
                    value={exhibitor.description}
                    onChange={(e) => {
                      const newEx = [...sectionData.exhibitors];
                      newEx[index].description = e.target.value;
                      setSectionData({ ...sectionData, exhibitors: newEx });
                    }}
                  />
                ) : (
                  <p className="text-gray-400 text-sm mb-4">{exhibitor.description}</p>
                )}

                {editMode ? (
                  <input
                    className="text-sm font-semibold bg-transparent border-b border-gray-500 text-[#FFD400] w-full"
                    value={exhibitor.website}
                    onChange={(e) => {
                      const newEx = [...sectionData.exhibitors];
                      newEx[index].website = e.target.value;
                      setSectionData({ ...sectionData, exhibitors: newEx });
                    }}
                  />
                ) : (
                  <a href={exhibitor.website} className="inline-flex items-center gap-2 text-[#FFD400] text-sm font-semibold">
                    <span>Visit Booth</span>
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Floor Plan CTA */}
        <div className="text-center">
          <div className="bg-black/50 backdrop-blur-sm rounded-3xl p-12 max-w-3xl mx-auto border border-gray-800">
            {editMode ? (
              <input
                className="text-3xl font-bold text-white mb-4 bg-transparent border-b border-gray-500 w-full"
                value={sectionData.cta.title}
                onChange={(e) => setSectionData({ ...sectionData, cta: { ...sectionData.cta, title: e.target.value } })}
              />
            ) : (
              <h3 className="text-3xl font-bold text-white mb-4">{sectionData.cta.title}</h3>
            )}
            {editMode ? (
              <textarea
                className="text-gray-400 mb-8 text-lg bg-transparent border border-gray-600 p-2 rounded w-full"
                value={sectionData.cta.description}
                onChange={(e) => setSectionData({ ...sectionData, cta: { ...sectionData.cta, description: e.target.value } })}
              />
            ) : (
              <p className="text-gray-400 mb-8 text-lg">{sectionData.cta.description}</p>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {sectionData.cta.buttons.map((btn, i) =>
                editMode ? (
                  <input
                    key={i}
                    className="bg-transparent border-b border-gray-500 text-center"
                    value={btn}
                    onChange={(e) => {
                      const newBtns = [...sectionData.cta.buttons];
                      newBtns[i] = e.target.value;
                      setSectionData({ ...sectionData, cta: { ...sectionData.cta, buttons: newBtns } });
                    }}
                  />
                ) : (
                  <button
                    key={i}
                    className={`px-8 py-4 rounded-full font-semibold transition-all duration-300 ${
                      i === 0
                        ? "bg-[#FF0000] hover:bg-[#FF0000]/90 text-white"
                        : "border-2 border-[#FFD400] text-[#FFD400] hover:bg-[#FFD400] hover:text-black"
                    }`}
                  >
                    {btn}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
          {sectionData.stats.map((stat, i) => (
            <div key={i} className="text-center">
              {editMode ? (
                <input
                  className="text-3xl font-bold text-[#FF0000] mb-2 bg-transparent border-b border-gray-500 text-center"
                  value={stat.value}
                  onChange={(e) => {
                    const newStats = [...sectionData.stats];
                    newStats[i].value = e.target.value;
                    setSectionData({ ...sectionData, stats: newStats });
                  }}
                />
              ) : (
                <div className="text-3xl font-bold text-[#FF0000] mb-2">{stat.value}</div>
              )}
              {editMode ? (
                <input
                  className="text-gray-400 bg-transparent border-b border-gray-500 text-center"
                  value={stat.label}
                  onChange={(e) => {
                    const newStats = [...sectionData.stats];
                    newStats[i].label = e.target.value;
                    setSectionData({ ...sectionData, stats: newStats });
                  }}
                />
              ) : (
                <div className="text-gray-400">{stat.label}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExhibitorsSection;
