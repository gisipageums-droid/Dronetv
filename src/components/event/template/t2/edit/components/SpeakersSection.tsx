// import React from 'react';
// import { Linkedin, Twitter, ExternalLink } from 'lucide-react';

// const SpeakersSection: React.FC = () => {
//   const speakers = [
//     {
//       id: 1,
//       name: 'Dr. Alex Rivera',
//       title: 'Chief Innovation Officer',
//       company: 'AeroTech Dynamics',
//       topic: 'The Next Generation of Autonomous Flight',
//       image: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
//       linkedin: '#',
//       twitter: '#',
//       featured: true
//     },
//     {
//       id: 2,
//       name: 'Sarah Chen',
//       title: 'Lead Engineer',
//       company: 'SkyVision Systems',
//       topic: 'AI-Powered Navigation Systems',
//       image: 'https://images.pexels.com/photos/1310522/pexels-photo-1310522.jpeg?auto=compress&cs=tinysrgb&w=400',
//       linkedin: '#',
//       twitter: '#',
//       featured: true
//     },
//     {
//       id: 3,
//       name: 'Marcus Johnson',
//       title: 'Founder & CEO',
//       company: 'DroneFlow Corp',
//       topic: 'Commercial Drone Applications',
//       image: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=400',
//       linkedin: '#',
//       twitter: '#',
//       featured: false
//     },
//     {
//       id: 4,
//       name: 'Dr. Emily Watson',
//       title: 'Research Director',
//       company: 'Future Flight Labs',
//       topic: 'Sustainable Aviation Technology',
//       image: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=400',
//       linkedin: '#',
//       twitter: '#',
//       featured: false
//     },
//     {
//       id: 5,
//       name: 'James Park',
//       title: 'Head of R&D',
//       company: 'Autonomous Systems Inc',
//       topic: 'Swarm Intelligence in Drones',
//       image: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
//       linkedin: '#',
//       twitter: '#',
//       featured: false
//     },
//     {
//       id: 6,
//       name: 'Dr. Lisa Kumar',
//       title: 'Technology Evangelist',
//       company: 'NextGen Aviation',
//       topic: 'Urban Air Mobility Solutions',
//       image: 'https://images.pexels.com/photos/1851415/pexels-photo-1851415.jpeg?auto=compress&cs=tinysrgb&w=400',
//       linkedin: '#',
//       twitter: '#',
//       featured: false
//     }
//   ];

//   const featuredSpeakers = speakers.filter(speaker => speaker.featured);
//   const regularSpeakers = speakers.filter(speaker => !speaker.featured);

//   return (
//     <section id="speakers" className="py-20 bg-gray-900">
//       <div className="container mx-auto px-4">
//         <div className="text-center mb-16">
//           <h2 data-aos="fade-up" className="text-4xl md:text-6xl font-bold text-[#FFD400] mb-4">
//             Featured <span className="text-white">Speakers</span>
//           </h2>
//           <div data-aos="fade-up" data-aos-delay="200" className="w-32 h-1 bg-[#FFD400] mx-auto mb-6"></div>
//           <p data-aos="fade-up" data-aos-delay="400" className="text-gray-300 text-lg max-w-3xl mx-auto">
//             Learn from visionary leaders and technical experts who are shaping the future of drone technology.
//           </p>
//         </div>

//         {/* Featured Speakers */}
//         <div className="mb-20">
//           <h3 data-aos="fade-up" className="text-2xl font-bold text-white text-center mb-12">
//             Keynote Speakers
//           </h3>
//           <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
//             {featuredSpeakers.map((speaker, index) => (
//               <div 
//                 key={speaker.id}
//                 data-aos="fade-up" 
//                 data-aos-delay={index * 200}
//                 className="group relative bg-black/50 backdrop-blur-sm rounded-3xl overflow-hidden border border-gray-800 hover:border-[#FFD400]/50 transition-all duration-500 transform hover:scale-105"
//               >
//                 {/* Featured Badge */}
//                 <div className="absolute top-4 right-4 z-10">
//                   <span className="bg-[#FF0000] text-white px-3 py-1 rounded-full text-xs font-semibold">
//                     KEYNOTE
//                   </span>
//                 </div>

//                 {/* Image */}
//                 <div className="relative h-80 overflow-hidden">
//                   <img 
//                     src={speaker.image} 
//                     alt={speaker.name}
//                     className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                  
//                   {/* Social Links */}
//                   <div className="absolute bottom-6 left-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                     <a 
//                       href={speaker.linkedin}
//                       className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-[#FF0000] hover:bg-[#FF0000] hover:text-white transition-colors"
//                     >
//                       <Linkedin size={18} />
//                     </a>
//                     <a 
//                       href={speaker.twitter}
//                       className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-[#FF0000] hover:bg-[#FF0000] hover:text-white transition-colors"
//                     >
//                       <Twitter size={18} />
//                     </a>
//                   </div>
//                 </div>
                
//                 {/* Content */}
//                 <div className="p-8">
//                   <h3 className="text-2xl font-bold text-[#FFD400] mb-2 group-hover:text-white transition-colors">
//                     {speaker.name}
//                   </h3>
//                   <p className="text-[#FFD400] font-semibold mb-1">{speaker.title}</p>
//                   <p className="text-gray-400 mb-4">{speaker.company}</p>
//                   <div className="border-t border-gray-800 pt-4">
//                     <p className="text-sm text-gray-500 mb-2">Speaking on:</p>
//                     <p className="text-white font-medium">{speaker.topic}</p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Regular Speakers Grid */}
//         <div>
//           <h3 data-aos="fade-up" className="text-2xl font-bold text-white text-center mb-12">
//             Expert Panel
//           </h3>
//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {regularSpeakers.map((speaker, index) => (
//               <div 
//                 key={speaker.id}
//                 data-aos="fade-up" 
//                 data-aos-delay={index * 100}
//                 className="group bg-black/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-800 hover:border-[#FFD400]/50 transition-all duration-500 transform hover:scale-105"
//               >
//                 {/* Image */}
//                 <div className="relative h-48 overflow-hidden">
//                   <img 
//                     src={speaker.image} 
//                     alt={speaker.name}
//                     className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  
//                   {/* Hover Overlay */}
//                   <div className="absolute inset-0 bg-[#FF0000]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
//                     <ExternalLink size={24} className="text-white" />
//                   </div>
//                 </div>
                
//                 {/* Content */}
//                 <div className="p-6">
//                   <h4 className="text-lg font-bold text-white mb-1 group-hover:text-[#FFD400] transition-colors">
//                     {speaker.name}
//                   </h4>
//                   <p className="text-[#FFD400] text-sm font-semibold mb-1">{speaker.title}</p>
//                   <p className="text-gray-500 text-sm mb-3">{speaker.company}</p>
//                   <p className="text-gray-400 text-xs">{speaker.topic}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default SpeakersSection;








// import React, { useState } from "react";
// import { Linkedin, Twitter, ExternalLink, Edit, Save } from "lucide-react";

// const SpeakersSection: React.FC = () => {
//   const [editMode, setEditMode] = useState(false);

//   const [sectionData, setSectionData] = useState({
//     heading: "Featured Speakers",
//     subHeading: "Keynote Speakers",
//     description:
//       "Learn from visionary leaders and technical experts who are shaping the future of drone technology.",
//     panelHeading: "Expert Panel",
//     speakers: [
//       {
//         id: 1,
//         name: "Dr. Alex Rivera",
//         title: "Chief Innovation Officer",
//         company: "AeroTech Dynamics",
//         topic: "The Next Generation of Autonomous Flight",
//         image:
//           "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400",
//         linkedin: "#",
//         twitter: "#",
//         featured: true,
//       },
//       {
//         id: 2,
//         name: "Sarah Chen",
//         title: "Lead Engineer",
//         company: "SkyVision Systems",
//         topic: "AI-Powered Navigation Systems",
//         image:
//           "https://images.pexels.com/photos/1310522/pexels-photo-1310522.jpeg?auto=compress&cs=tinysrgb&w=400",
//         linkedin: "#",
//         twitter: "#",
//         featured: true,
//       },
//       {
//         id: 3,
//         name: "Marcus Johnson",
//         title: "Founder & CEO",
//         company: "DroneFlow Corp",
//         topic: "Commercial Drone Applications",
//         image:
//           "https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=400",
//         linkedin: "#",
//         twitter: "#",
//         featured: false,
//       },
//     ],
//   });

//   const featuredSpeakers = sectionData.speakers.filter((s) => s.featured);
//   const regularSpeakers = sectionData.speakers.filter((s) => !s.featured);

//   // 🔹 Handle field updates
//   const handleChange = (id: number | null, field: string, value: string) => {
//     if (id === null) {
//       setSectionData({ ...sectionData, [field]: value });
//     } else {
//       setSectionData({
//         ...sectionData,
//         speakers: sectionData.speakers.map((s) =>
//           s.id === id ? { ...s, [field]: value } : s
//         ),
//       });
//     }
//   };

//   return (
//     <section id="speakers" className="py-20 bg-gray-900 relative">
//       {/* Edit button */}
//       <button
//         onClick={() => setEditMode(!editMode)}
//         className="absolute top-6 right-6 z-20 px-4 py-2 bg-[#FFD400] text-black font-bold rounded-lg flex items-center gap-2 hover:bg-yellow-400 transition"
//       >
//         {editMode ? <Save size={18} /> : <Edit size={18} />}
//         {editMode ? "Save" : "Edit"}
//       </button>

//       <div className="container mx-auto px-4">
//         {/* Section Heading */}
//         <div className="text-center mb-16">
//           {editMode ? (
//             <input
//               type="text"
//               value={sectionData.heading}
//               onChange={(e) => handleChange(null, "heading", e.target.value)}
//               className="text-4xl md:text-6xl font-bold text-[#FFD400] bg-transparent border-b border-gray-500 text-center w-full"
//             />
//           ) : (
//             <h2
//               data-aos="fade-up"
//               className="text-4xl md:text-6xl font-bold text-[#FFD400] mb-4"
//             >
//               {sectionData.heading} <span className="text-white">Speakers</span>
//             </h2>
//           )}

//           <div className="w-32 h-1 bg-[#FFD400] mx-auto mb-6"></div>

//           {editMode ? (
//             <textarea
//               value={sectionData.description}
//               onChange={(e) =>
//                 handleChange(null, "description", e.target.value)
//               }
//               className="text-gray-300 text-lg max-w-3xl mx-auto bg-transparent border border-gray-500 p-2 w-full"
//             />
//           ) : (
//             <p className="text-gray-300 text-lg max-w-3xl mx-auto">
//               {sectionData.description}
//             </p>
//           )}
//         </div>

//         {/* Featured Speakers */}
//         <div className="mb-20">
//           {editMode ? (
//             <input
//               type="text"
//               value={sectionData.subHeading}
//               onChange={(e) => handleChange(null, "subHeading", e.target.value)}
//               className="text-2xl font-bold text-white text-center mb-12 bg-transparent border-b border-gray-500 w-full"
//             />
//           ) : (
//             <h3 className="text-2xl font-bold text-white text-center mb-12">
//               {sectionData.subHeading}
//             </h3>
//           )}

//           <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
//             {featuredSpeakers.map((speaker, index) => (
//               <div
//                 key={speaker.id}
//                 className="group relative bg-black/50 backdrop-blur-sm rounded-3xl overflow-hidden border border-gray-800"
//               >
//                 <div className="relative h-80 overflow-hidden">
//                   {editMode ? (
//                     <input
//                       type="text"
//                       value={speaker.image}
//                       onChange={(e) =>
//                         handleChange(speaker.id, "image", e.target.value)
//                       }
//                       className="w-full text-xs bg-black/70 text-white p-1 border-b border-gray-600"
//                       placeholder="Image URL"
//                     />
//                   ) : (
//                     <img
//                       src={speaker.image}
//                       alt={speaker.name}
//                       className="w-full h-full object-cover"
//                     />
//                   )}
//                 </div>

//                 <div className="p-8">
//                   {editMode ? (
//                     <>
//                       <input
//                         type="text"
//                         value={speaker.name}
//                         onChange={(e) =>
//                           handleChange(speaker.id, "name", e.target.value)
//                         }
//                         className="w-full mb-2 bg-transparent border-b border-gray-500 text-[#FFD400]"
//                       />
//                       <input
//                         type="text"
//                         value={speaker.title}
//                         onChange={(e) =>
//                           handleChange(speaker.id, "title", e.target.value)
//                         }
//                         className="w-full mb-2 bg-transparent border-b border-gray-500 text-white"
//                       />
//                       <input
//                         type="text"
//                         value={speaker.company}
//                         onChange={(e) =>
//                           handleChange(speaker.id, "company", e.target.value)
//                         }
//                         className="w-full mb-2 bg-transparent border-b border-gray-500 text-gray-400"
//                       />
//                       <textarea
//                         value={speaker.topic}
//                         onChange={(e) =>
//                           handleChange(speaker.id, "topic", e.target.value)
//                         }
//                         className="w-full bg-transparent border border-gray-500 text-white p-2"
//                       />
//                     </>
//                   ) : (
//                     <>
//                       <h3 className="text-2xl font-bold text-[#FFD400] mb-2">
//                         {speaker.name}
//                       </h3>
//                       <p className="text-[#FFD400] font-semibold mb-1">
//                         {speaker.title}
//                       </p>
//                       <p className="text-gray-400 mb-4">{speaker.company}</p>
//                       <p className="text-white">{speaker.topic}</p>
//                     </>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Regular Speakers */}
//         <div>
//           {editMode ? (
//             <input
//               type="text"
//               value={sectionData.panelHeading}
//               onChange={(e) =>
//                 handleChange(null, "panelHeading", e.target.value)
//               }
//               className="text-2xl font-bold text-white text-center mb-12 bg-transparent border-b border-gray-500 w-full"
//             />
//           ) : (
//             <h3 className="text-2xl font-bold text-white text-center mb-12">
//               {sectionData.panelHeading}
//             </h3>
//           )}

//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {regularSpeakers.map((speaker) => (
//               <div
//                 key={speaker.id}
//                 className="group bg-black/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-800"
//               >
//                 {editMode ? (
//                   <input
//                     type="text"
//                     value={speaker.image}
//                     onChange={(e) =>
//                       handleChange(speaker.id, "image", e.target.value)
//                     }
//                     className="w-full text-xs bg-black/70 text-white p-1 border-b border-gray-600"
//                     placeholder="Image URL"
//                   />
//                 ) : (
//                   <img
//                     src={speaker.image}
//                     alt={speaker.name}
//                     className="h-48 w-full object-cover"
//                   />
//                 )}
//                 <div className="p-6">
//                   {editMode ? (
//                     <>
//                       <input
//                         type="text"
//                         value={speaker.name}
//                         onChange={(e) =>
//                           handleChange(speaker.id, "name", e.target.value)
//                         }
//                         className="w-full mb-1 bg-transparent border-b border-gray-500 text-white"
//                       />
//                       <input
//                         type="text"
//                         value={speaker.title}
//                         onChange={(e) =>
//                           handleChange(speaker.id, "title", e.target.value)
//                         }
//                         className="w-full mb-1 bg-transparent border-b border-gray-500 text-[#FFD400]"
//                       />
//                       <input
//                         type="text"
//                         value={speaker.company}
//                         onChange={(e) =>
//                           handleChange(speaker.id, "company", e.target.value)
//                         }
//                         className="w-full mb-1 bg-transparent border-b border-gray-500 text-gray-400"
//                       />
//                       <textarea
//                         value={speaker.topic}
//                         onChange={(e) =>
//                           handleChange(speaker.id, "topic", e.target.value)
//                         }
//                         className="w-full bg-transparent border border-gray-500 text-white p-2"
//                       />
//                     </>
//                   ) : (
//                     <>
//                       <h4 className="text-lg font-bold text-white mb-1">
//                         {speaker.name}
//                       </h4>
//                       <p className="text-[#FFD400] text-sm font-semibold mb-1">
//                         {speaker.title}
//                       </p>
//                       <p className="text-gray-500 text-sm mb-3">
//                         {speaker.company}
//                       </p>
//                       <p className="text-gray-400 text-xs">{speaker.topic}</p>
//                     </>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default SpeakersSection;




import React, { useState } from "react";
import { Linkedin, Twitter, ExternalLink, Edit2, X, Upload } from "lucide-react";

const SpeakersSection: React.FC = () => {
  const [editMode, setEditMode] = useState(false);
  const [speakers, setSpeakers] = useState([
    {
      id: 1,
      name: "Dr. Alex Rivera",
      title: "Chief Innovation Officer",
      company: "AeroTech Dynamics",
      topic: "The Next Generation of Autonomous Flight",
      image:
        "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400",
      linkedin: "#",
      twitter: "#",
      featured: true,
    },
    {
      id: 2,
      name: "Sarah Chen",
      title: "Lead Engineer",
      company: "SkyVision Systems",
      topic: "AI-Powered Navigation Systems",
      image:
        "https://images.pexels.com/photos/1310522/pexels-photo-1310522.jpeg?auto=compress&cs=tinysrgb&w=400",
      linkedin: "#",
      twitter: "#",
      featured: true,
    },
    {
      id: 3,
      name: "Marcus Johnson",
      title: "Founder & CEO",
      company: "DroneFlow Corp",
      topic: "Commercial Drone Applications",
      image:
        "https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=400",
      linkedin: "#",
      twitter: "#",
      featured: false,
    },
    {
      id: 4,
      name: "Dr. Emily Watson",
      title: "Research Director",
      company: "Future Flight Labs",
      topic: "Sustainable Aviation Technology",
      image:
        "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=400",
      linkedin: "#",
      twitter: "#",
      featured: false,
    },
    {
      id: 5,
      name: "James Park",
      title: "Head of R&D",
      company: "Autonomous Systems Inc",
      topic: "Swarm Intelligence in Drones",
      image:
        "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400",
      linkedin: "#",
      twitter: "#",
      featured: false,
    },
    {
      id: 6,
      name: "Dr. Lisa Kumar",
      title: "Technology Evangelist",
      company: "NextGen Aviation",
      topic: "Urban Air Mobility Solutions",
      image:
        "https://images.pexels.com/photos/1851415/pexels-photo-1851415.jpeg?auto=compress&cs=tinysrgb&w=400",
      linkedin: "#",
      twitter: "#",
      featured: false,
    },
  ]);

  const featuredSpeakers = speakers.filter((s) => s.featured);
  const regularSpeakers = speakers.filter((s) => !s.featured);

  const handleTextChange = (id: number, field: string, value: string) => {
    setSpeakers((prev) =>
      prev.map((sp) => (sp.id === id ? { ...sp, [field]: value } : sp))
    );
  };

  const handleImageChange = (id: number, file: File | null) => {
    if (!file) {
      setSpeakers((prev) =>
        prev.map((sp) => (sp.id === id ? { ...sp, image: "" } : sp))
      );
      return;
    }
    const url = URL.createObjectURL(file);
    setSpeakers((prev) =>
      prev.map((sp) => (sp.id === id ? { ...sp, image: url } : sp))
    );
  };

  const EditableText = ({
    value,
    onChange,
    className,
  }: {
    value: string;
    onChange: (val: string) => void;
    className?: string;
  }) => (
    <div
      contentEditable={editMode}
      suppressContentEditableWarning
      onBlur={(e) => onChange(e.currentTarget.textContent || "")}
      className={className}
    >
      {value}
    </div>
  );

  return (
    <section id="speakers" className="py-20 bg-gray-900 relative">
      {/* Edit Button */}
      <button
        onClick={() => setEditMode(!editMode)}
        className="absolute top-4 right-4 bg-[#FFD400] text-black px-3 py-2 rounded-full flex items-center gap-2 shadow-lg"
      >
        <Edit2 size={16} />
        {editMode ? "Done" : "Edit"}
      </button>

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <EditableText
            value="Featured Speakers"
            onChange={() => {}}
            className="text-4xl md:text-6xl font-bold text-[#FFD400] mb-4"
          />
          <div className="w-32 h-1 bg-[#FFD400] mx-auto mb-6"></div>
          <EditableText
            value="Learn from visionary leaders and technical experts who are shaping the future of drone technology."
            onChange={() => {}}
            className="text-gray-300 text-lg max-w-3xl mx-auto"
          />
        </div>

        {/* Featured Speakers */}
        <div className="mb-20">
          <EditableText
            value="Keynote Speakers"
            onChange={() => {}}
            className="text-2xl font-bold text-white text-center mb-12"
          />
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {featuredSpeakers.map((speaker, index) => (
              <div
                key={speaker.id}
                className="group relative bg-black/50 backdrop-blur-sm rounded-3xl overflow-hidden border border-gray-800 hover:border-[#FFD400]/50 transition-all duration-500 transform hover:scale-105"
              >
                {/* Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-[#FF0000] text-white px-3 py-1 rounded-full text-xs font-semibold">
                    KEYNOTE
                  </span>
                </div>

                {/* Image */}
                <div className="relative h-80 overflow-hidden">
                  {speaker.image && (
                    <img
                      src={speaker.image}
                      alt={speaker.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>

                  {editMode && (
                    <div className="absolute top-2 left-2 flex gap-2">
                      <label className="bg-black/70 text-white p-1 rounded cursor-pointer">
                        <Upload size={16} />
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={(e) =>
                            handleImageChange(
                              speaker.id,
                              e.target.files?.[0] || null
                            )
                          }
                        />
                      </label>
                      <button
                        onClick={() => handleImageChange(speaker.id, null)}
                        className="bg-red-600 text-white p-1 rounded"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-8">
                  <EditableText
                    value={speaker.name}
                    onChange={(val) => handleTextChange(speaker.id, "name", val)}
                    className="text-2xl font-bold text-[#FFD400] mb-2 group-hover:text-white transition-colors"
                  />
                  <EditableText
                    value={speaker.title}
                    onChange={(val) =>
                      handleTextChange(speaker.id, "title", val)
                    }
                    className="text-[#FFD400] font-semibold mb-1"
                  />
                  <EditableText
                    value={speaker.company}
                    onChange={(val) =>
                      handleTextChange(speaker.id, "company", val)
                    }
                    className="text-gray-400 mb-4"
                  />
                  <div className="border-t border-gray-800 pt-4">
                    <p className="text-sm text-gray-500 mb-2">Speaking on:</p>
                    <EditableText
                      value={speaker.topic}
                      onChange={(val) =>
                        handleTextChange(speaker.id, "topic", val)
                      }
                      className="text-white font-medium"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regular Speakers */}
        <div>
          <EditableText
            value="Expert Panel"
            onChange={() => {}}
            className="text-2xl font-bold text-white text-center mb-12"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {regularSpeakers.map((speaker, index) => (
              <div
                key={speaker.id}
                className="group bg-black/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-800 hover:border-[#FFD400]/50 transition-all duration-500 transform hover:scale-105"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  {speaker.image && (
                    <img
                      src={speaker.image}
                      alt={speaker.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  {editMode && (
                    <div className="absolute top-2 left-2 flex gap-2">
                      <label className="bg-black/70 text-white p-1 rounded cursor-pointer">
                        <Upload size={16} />
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={(e) =>
                            handleImageChange(
                              speaker.id,
                              e.target.files?.[0] || null
                            )
                          }
                        />
                      </label>
                      <button
                        onClick={() => handleImageChange(speaker.id, null)}
                        className="bg-red-600 text-white p-1 rounded"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <EditableText
                    value={speaker.name}
                    onChange={(val) => handleTextChange(speaker.id, "name", val)}
                    className="text-lg font-bold text-white mb-1 group-hover:text-[#FFD400] transition-colors"
                  />
                  <EditableText
                    value={speaker.title}
                    onChange={(val) =>
                      handleTextChange(speaker.id, "title", val)
                    }
                    className="text-[#FFD400] text-sm font-semibold mb-1"
                  />
                  <EditableText
                    value={speaker.company}
                    onChange={(val) =>
                      handleTextChange(speaker.id, "company", val)
                    }
                    className="text-gray-500 text-sm mb-3"
                  />
                  <EditableText
                    value={speaker.topic}
                    onChange={(val) =>
                      handleTextChange(speaker.id, "topic", val)
                    }
                    className="text-gray-400 text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpeakersSection;
