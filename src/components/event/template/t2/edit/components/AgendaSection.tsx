// import React, { useState } from 'react';
// import { Clock, MapPin, User, Calendar } from 'lucide-react';

// const AgendaSection: React.FC = () => {
//   const [activeDay, setActiveDay] = useState(1);

//   const schedule = {
//     1: [
//       {
//         time: '8:00 AM',
//         title: 'Registration & Welcome Coffee',
//         speaker: 'Event Team',
//         location: 'Main Entrance',
//         type: 'registration',
//         duration: '1 hour'
//       },
//       {
//         time: '9:00 AM',
//         title: 'Opening Keynote: The Future of Autonomous Flight',
//         speaker: 'Dr. Alex Rivera',
//         location: 'Main Stage',
//         type: 'keynote',
//         duration: '45 minutes'
//       },
//       {
//         time: '10:00 AM',
//         title: 'Drone Racing Championship - Qualifying Rounds',
//         speaker: 'Professional Pilots',
//         location: 'Racing Arena',
//         type: 'competition',
//         duration: '2 hours'
//       },
//       {
//         time: '12:00 PM',
//         title: 'Innovation Showcase & Networking Lunch',
//         speaker: 'All Attendees',
//         location: 'Exhibition Hall',
//         type: 'networking',
//         duration: '1.5 hours'
//       },
//       {
//         time: '1:30 PM',
//         title: 'Panel: AI in Commercial Drone Applications',
//         speaker: 'Sarah Chen, Marcus Johnson',
//         location: 'Tech Theater',
//         type: 'panel',
//         duration: '1 hour'
//       },
//       {
//         time: '3:00 PM',
//         title: 'Live Demo: Advanced Navigation Systems',
//         speaker: 'SkyVision Systems',
//         location: 'Demo Zone',
//         type: 'demo',
//         duration: '45 minutes'
//       },
//       {
//         time: '4:00 PM',
//         title: 'Startup Pitch Competition',
//         speaker: 'Emerging Companies',
//         location: 'Innovation Stage',
//         type: 'competition',
//         duration: '2 hours'
//       },
//       {
//         time: '6:00 PM',
//         title: 'Day 1 Wrap-up & Evening Networking',
//         speaker: 'Event Organizers',
//         location: 'Rooftop Lounge',
//         type: 'networking',
//         duration: '2 hours'
//       }
//     ],
//     2: [
//       {
//         time: '9:00 AM',
//         title: 'Day 2 Welcome & Coffee',
//         speaker: 'Event Team',
//         location: 'Main Entrance',
//         type: 'registration',
//         duration: '30 minutes'
//       },
//       {
//         time: '9:30 AM',
//         title: 'Keynote: Urban Air Mobility Revolution',
//         speaker: 'Dr. Lisa Kumar',
//         location: 'Main Stage',
//         type: 'keynote',
//         duration: '45 minutes'
//       },
//       {
//         time: '10:30 AM',
//         title: 'Drone Racing Championship - Finals',
//         speaker: 'Top Pilots',
//         location: 'Racing Arena',
//         type: 'competition',
//         duration: '2 hours'
//       },
//       {
//         time: '12:30 PM',
//         title: 'Awards Lunch & Recognition Ceremony',
//         speaker: 'Industry Leaders',
//         location: 'Grand Ballroom',
//         type: 'ceremony',
//         duration: '1.5 hours'
//       },
//       {
//         time: '2:00 PM',
//         title: 'Workshop: Building Your First Autonomous Drone',
//         speaker: 'Dr. Emily Watson',
//         location: 'Workshop Lab',
//         type: 'workshop',
//         duration: '2 hours'
//       },
//       {
//         time: '4:30 PM',
//         title: 'Panel: Future of Drone Regulations',
//         speaker: 'Industry Experts',
//         location: 'Policy Theater',
//         type: 'panel',
//         duration: '1 hour'
//       },
//       {
//         time: '5:30 PM',
//         title: 'Closing Ceremony & Innovation Awards',
//         speaker: 'Event Organizers',
//         location: 'Main Stage',
//         type: 'ceremony',
//         duration: '1 hour'
//       },
//       {
//         time: '7:00 PM',
//         title: 'After Party & Final Networking',
//         speaker: 'All Attendees',
//         location: 'Expo Grounds',
//         type: 'networking',
//         duration: '3 hours'
//       }
//     ]
//   };

//   const getTypeStyle = (type: string) => {
//     switch (type) {
//       case 'keynote': return { bg: 'bg-[#FF0000]', text: 'text-white', border: 'border-[#FF0000]' };
//       case 'panel': return { bg: 'bg-[#FFD400]', text: 'text-black', border: 'border-[#FFD400]' };
//       case 'workshop': return { bg: 'bg-blue-500', text: 'text-white', border: 'border-blue-500' };
//       case 'demo': return { bg: 'bg-green-500', text: 'text-white', border: 'border-green-500' };
//       case 'competition': return { bg: 'bg-purple-500', text: 'text-white', border: 'border-purple-500' };
//       case 'networking': return { bg: 'bg-orange-500', text: 'text-white', border: 'border-orange-500' };
//       case 'ceremony': return { bg: 'bg-indigo-500', text: 'text-white', border: 'border-indigo-500' };
//       case 'registration': return { bg: 'bg-gray-500', text: 'text-white', border: 'border-gray-500' };
//       default: return { bg: 'bg-gray-500', text: 'text-white', border: 'border-gray-500' };
//     }
//   };

//   return (
//     <section id="schedule" className="py-20 bg-black">
//       <div className="container mx-auto px-4">
//         <div className="text-center mb-16">
//           <h2 data-aos="fade-up" className="text-4xl md:text-6xl font-bold text-[#FFD400] mb-4">
//             Event <span className="text-white">Schedule</span>
//           </h2>
//           <div data-aos="fade-up" data-aos-delay="200" className="w-32 h-1 bg-[#FFD400] mx-auto mb-6"></div>
//           <p data-aos="fade-up" data-aos-delay="400" className="text-gray-300 text-lg max-w-3xl mx-auto">
//             Two action-packed days of competitions, demonstrations, workshops, and networking opportunities.
//           </p>
//         </div>

//         {/* Day Tabs */}
//         <div data-aos="fade-up" data-aos-delay="600" className="flex justify-center mb-12">
//           <div className="flex bg-gray-800 rounded-full p-2 border border-gray-700">
//             {[1, 2].map((day) => (
//               <button
//                 key={day}
//                 onClick={() => setActiveDay(day)}
//                 className={`flex items-center gap-2 px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
//                   activeDay === day
//                     ? 'bg-[#FF0000] text-white shadow-lg transform scale-105'
//                     : 'text-gray-400 hover:text-[#FFD400]'
//                 }`}
//               >
//                 <Calendar size={16} />
//                 Day {day}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Schedule Grid */}
//         <div className="max-w-6xl mx-auto">
//           <div className="grid gap-6">
//             {schedule[activeDay as keyof typeof schedule].map((session, index) => {
//               const typeStyle = getTypeStyle(session.type);
//               return (
//                 <div 
//                   key={index}
//                   data-aos="fade-up" 
//                   data-aos-delay={index * 100}
//                   className="group bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 hover:border-[#FFD400]/50 transition-all duration-300 hover:transform hover:scale-[1.02]"
//                 >
//                   <div className="flex flex-col lg:flex-row lg:items-center gap-6">
//                     {/* Time & Type */}
//                     <div className="flex-shrink-0 lg:w-48">
//                       <div className="text-2xl font-bold text-[#FFD400] mb-2">{session.time}</div>
//                       <div className="flex items-center gap-2 mb-2">
//                         <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${typeStyle.bg} ${typeStyle.text}`}>
//                           {session.type}
//                         </span>
//                         <span className="text-gray-500 text-sm">{session.duration}</span>
//                       </div>
//                     </div>

//                     {/* Content */}
//                     <div className="flex-1">
//                       <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#FFD400] transition-colors">
//                         {session.title}
//                       </h3>
                      
//                       <div className="flex flex-wrap gap-6 text-sm text-gray-400">
//                         <div className="flex items-center gap-2">
//                           <User size={16} className="text-[#FFD400]" />
//                           <span>{session.speaker}</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <MapPin size={16} className="text-[#FFD400]" />
//                           <span>{session.location}</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <Clock size={16} className="text-[#FFD400]" />
//                           <span>{session.duration}</span>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Action Button */}
//                     <div className="flex-shrink-0">
//                       <button className="bg-[#FF0000] hover:bg-[#FF0000]/90 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
//                         Add to Calendar
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* Download Schedule CTA */}
//         <div data-aos="fade-up" data-aos-delay="800" className="text-center mt-16">
//           <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto border border-gray-800">
//             <h3 className="text-2xl font-bold text-white mb-4">
//               Download Full Schedule
//             </h3>
//             <p className="text-gray-400 mb-6">
//               Get the complete event schedule with detailed session information and speaker bios.
//             </p>
//             <button className="bg-[#FFD400] hover:bg-[#FFD400]/90 text-black px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
//               Download PDF Schedule
//             </button>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default AgendaSection;







// import React, { useState } from 'react';
// import { Clock, MapPin, User, Calendar, Edit, Save } from 'lucide-react';

// const AgendaSection: React.FC = () => {
//   const [activeDay, setActiveDay] = useState(1);
//   const [isEditing, setIsEditing] = useState(false);

//   const [sectionTitle, setSectionTitle] = useState("Event Schedule");
//   const [sectionSubtitle, setSectionSubtitle] = useState("Two action-packed days of competitions, demonstrations, workshops, and networking opportunities.");
//   const [ctaTitle, setCtaTitle] = useState("Download Full Schedule");
//   const [ctaDescription, setCtaDescription] = useState("Get the complete event schedule with detailed session information and speaker bios.");
//   const [ctaButton, setCtaButton] = useState("Download PDF Schedule");

//   const [schedule, setSchedule] = useState({
//     1: [
//       { time: '8:00 AM', title: 'Registration & Welcome Coffee', speaker: 'Event Team', location: 'Main Entrance', type: 'registration', duration: '1 hour' },
//       { time: '9:00 AM', title: 'Opening Keynote: The Future of Autonomous Flight', speaker: 'Dr. Alex Rivera', location: 'Main Stage', type: 'keynote', duration: '45 minutes' },
//       { time: '10:00 AM', title: 'Drone Racing Championship - Qualifying Rounds', speaker: 'Professional Pilots', location: 'Racing Arena', type: 'competition', duration: '2 hours' },
//       { time: '12:00 PM', title: 'Innovation Showcase & Networking Lunch', speaker: 'All Attendees', location: 'Exhibition Hall', type: 'networking', duration: '1.5 hours' },
//       { time: '1:30 PM', title: 'Panel: AI in Commercial Drone Applications', speaker: 'Sarah Chen, Marcus Johnson', location: 'Tech Theater', type: 'panel', duration: '1 hour' },
//       { time: '3:00 PM', title: 'Live Demo: Advanced Navigation Systems', speaker: 'SkyVision Systems', location: 'Demo Zone', type: 'demo', duration: '45 minutes' },
//       { time: '4:00 PM', title: 'Startup Pitch Competition', speaker: 'Emerging Companies', location: 'Innovation Stage', type: 'competition', duration: '2 hours' },
//       { time: '6:00 PM', title: 'Day 1 Wrap-up & Evening Networking', speaker: 'Event Organizers', location: 'Rooftop Lounge', type: 'networking', duration: '2 hours' }
//     ],
//     2: [
//       { time: '9:00 AM', title: 'Day 2 Welcome & Coffee', speaker: 'Event Team', location: 'Main Entrance', type: 'registration', duration: '30 minutes' },
//       { time: '9:30 AM', title: 'Keynote: Urban Air Mobility Revolution', speaker: 'Dr. Lisa Kumar', location: 'Main Stage', type: 'keynote', duration: '45 minutes' },
//       { time: '10:30 AM', title: 'Drone Racing Championship - Finals', speaker: 'Top Pilots', location: 'Racing Arena', type: 'competition', duration: '2 hours' },
//       { time: '12:30 PM', title: 'Awards Lunch & Recognition Ceremony', speaker: 'Industry Leaders', location: 'Grand Ballroom', type: 'ceremony', duration: '1.5 hours' },
//       { time: '2:00 PM', title: 'Workshop: Building Your First Autonomous Drone', speaker: 'Dr. Emily Watson', location: 'Workshop Lab', type: 'workshop', duration: '2 hours' },
//       { time: '4:30 PM', title: 'Panel: Future of Drone Regulations', speaker: 'Industry Experts', location: 'Policy Theater', type: 'panel', duration: '1 hour' },
//       { time: '5:30 PM', title: 'Closing Ceremony & Innovation Awards', speaker: 'Event Organizers', location: 'Main Stage', type: 'ceremony', duration: '1 hour' },
//       { time: '7:00 PM', title: 'After Party & Final Networking', speaker: 'All Attendees', location: 'Expo Grounds', type: 'networking', duration: '3 hours' }
//     ]
//   });

//   const getTypeStyle = (type: string) => {
//     switch (type) {
//       case 'keynote': return { bg: 'bg-[#FF0000]', text: 'text-white' };
//       case 'panel': return { bg: 'bg-[#FFD400]', text: 'text-black' };
//       case 'workshop': return { bg: 'bg-blue-500', text: 'text-white' };
//       case 'demo': return { bg: 'bg-green-500', text: 'text-white' };
//       case 'competition': return { bg: 'bg-purple-500', text: 'text-white' };
//       case 'networking': return { bg: 'bg-orange-500', text: 'text-white' };
//       case 'ceremony': return { bg: 'bg-indigo-500', text: 'text-white' };
//       case 'registration': return { bg: 'bg-gray-500', text: 'text-white' };
//       default: return { bg: 'bg-gray-500', text: 'text-white' };
//     }
//   };

//   return (
//     <section id="schedule" className="py-20 bg-black relative">
//       {/* Edit Button */}
//       <button
//         onClick={() => setIsEditing(!isEditing)}
//         className="absolute top-6 right-6 bg-gray-800 text-white px-4 py-2 rounded-full flex items-center gap-2"
//       >
//         {isEditing ? <Save size={16} /> : <Edit size={16} />}
//         {isEditing ? "Save" : "Edit"}
//       </button>

//       <div className="container mx-auto px-4">
//         <div className="text-center mb-16">
//           {isEditing ? (
//             <input
//               value={sectionTitle}
//               onChange={(e) => setSectionTitle(e.target.value)}
//               className="text-4xl md:text-6xl font-bold text-[#FFD400] mb-4 bg-transparent border-b border-gray-600 text-center"
//             />
//           ) : (
//             <h2 className="text-4xl md:text-6xl font-bold text-[#FFD400] mb-4">
//               {sectionTitle}
//             </h2>
//           )}

//           {isEditing ? (
//             <textarea
//               value={sectionSubtitle}
//               onChange={(e) => setSectionSubtitle(e.target.value)}
//               className="w-full text-gray-300 text-lg max-w-3xl mx-auto bg-transparent border-b border-gray-600 text-center"
//             />
//           ) : (
//             <p className="text-gray-300 text-lg max-w-3xl mx-auto">
//               {sectionSubtitle}
//             </p>
//           )}
//         </div>

//         {/* Day Tabs */}
//         <div className="flex justify-center mb-12">
//           <div className="flex bg-gray-800 rounded-full p-2 border border-gray-700">
//             {[1, 2].map((day) => (
//               <button
//                 key={day}
//                 onClick={() => setActiveDay(day)}
//                 className={`flex items-center gap-2 px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
//                   activeDay === day
//                     ? 'bg-[#FF0000] text-white shadow-lg transform scale-105'
//                     : 'text-gray-400 hover:text-[#FFD400]'
//                 }`}
//               >
//                 <Calendar size={16} />
//                 Day {day}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Schedule Grid */}
//         <div className="max-w-6xl mx-auto">
//           <div className="grid gap-6">
//             {schedule[activeDay as keyof typeof schedule].map((session, index) => {
//               const typeStyle = getTypeStyle(session.type);
//               return (
//                 <div
//                   key={index}
//                   className="group bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800"
//                 >
//                   <div className="flex flex-col lg:flex-row lg:items-center gap-6">
//                     {/* Time & Type */}
//                     <div className="flex-shrink-0 lg:w-48">
//                       {isEditing ? (
//                         <input
//                           value={session.time}
//                           onChange={(e) => {
//                             const updated = [...schedule[activeDay]];
//                             updated[index].time = e.target.value;
//                             setSchedule({ ...schedule, [activeDay]: updated });
//                           }}
//                           className="text-2xl font-bold text-[#FFD400] mb-2 bg-transparent border-b border-gray-600"
//                         />
//                       ) : (
//                         <div className="text-2xl font-bold text-[#FFD400] mb-2">{session.time}</div>
//                       )}
//                       <div className="flex items-center gap-2 mb-2">
//                         <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${typeStyle.bg} ${typeStyle.text}`}>
//                           {session.type}
//                         </span>
//                         {isEditing ? (
//                           <input
//                             value={session.duration}
//                             onChange={(e) => {
//                               const updated = [...schedule[activeDay]];
//                               updated[index].duration = e.target.value;
//                               setSchedule({ ...schedule, [activeDay]: updated });
//                             }}
//                             className="text-gray-500 text-sm bg-transparent border-b border-gray-600"
//                           />
//                         ) : (
//                           <span className="text-gray-500 text-sm">{session.duration}</span>
//                         )}
//                       </div>
//                     </div>

//                     {/* Content */}
//                     <div className="flex-1">
//                       {isEditing ? (
//                         <input
//                           value={session.title}
//                           onChange={(e) => {
//                             const updated = [...schedule[activeDay]];
//                             updated[index].title = e.target.value;
//                             setSchedule({ ...schedule, [activeDay]: updated });
//                           }}
//                           className="text-xl font-bold text-white mb-3 bg-transparent border-b border-gray-600 w-full"
//                         />
//                       ) : (
//                         <h3 className="text-xl font-bold text-white mb-3">{session.title}</h3>
//                       )}

//                       <div className="flex flex-wrap gap-6 text-sm text-gray-400">
//                         <div className="flex items-center gap-2">
//                           <User size={16} className="text-[#FFD400]" />
//                           {isEditing ? (
//                             <input
//                               value={session.speaker}
//                               onChange={(e) => {
//                                 const updated = [...schedule[activeDay]];
//                                 updated[index].speaker = e.target.value;
//                                 setSchedule({ ...schedule, [activeDay]: updated });
//                               }}
//                               className="bg-transparent border-b border-gray-600"
//                             />
//                           ) : (
//                             <span>{session.speaker}</span>
//                           )}
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <MapPin size={16} className="text-[#FFD400]" />
//                           {isEditing ? (
//                             <input
//                               value={session.location}
//                               onChange={(e) => {
//                                 const updated = [...schedule[activeDay]];
//                                 updated[index].location = e.target.value;
//                                 setSchedule({ ...schedule, [activeDay]: updated });
//                               }}
//                               className="bg-transparent border-b border-gray-600"
//                             />
//                           ) : (
//                             <span>{session.location}</span>
//                           )}
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <Clock size={16} className="text-[#FFD400]" />
//                           <span>{session.duration}</span>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Action Button */}
//                     <div className="flex-shrink-0">
//                       {isEditing ? (
//                         <input
//                           value="Add to Calendar"
//                           disabled
//                           className="bg-[#FF0000] text-white px-6 py-2 rounded-full font-semibold"
//                         />
//                       ) : (
//                         <button className="bg-[#FF0000] text-white px-6 py-2 rounded-full font-semibold">
//                           Add to Calendar
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* Download Schedule CTA */}
//         <div className="text-center mt-16">
//           <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto border border-gray-800">
//             {isEditing ? (
//               <>
//                 <input
//                   value={ctaTitle}
//                   onChange={(e) => setCtaTitle(e.target.value)}
//                   className="text-2xl font-bold text-white mb-4 bg-transparent border-b border-gray-600 w-full"
//                 />
//                 <textarea
//                   value={ctaDescription}
//                   onChange={(e) => setCtaDescription(e.target.value)}
//                   className="text-gray-400 mb-6 w-full bg-transparent border-b border-gray-600"
//                 />
//                 <input
//                   value={ctaButton}
//                   onChange={(e) => setCtaButton(e.target.value)}
//                   className="bg-[#FFD400] text-black px-8 py-3 rounded-full font-semibold w-full"
//                 />
//               </>
//             ) : (
//               <>
//                 <h3 className="text-2xl font-bold text-white mb-4">{ctaTitle}</h3>
//                 <p className="text-gray-400 mb-6">{ctaDescription}</p>
//                 <button className="bg-[#FFD400] text-black px-8 py-3 rounded-full font-semibold">
//                   {ctaButton}
//                 </button>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default AgendaSection;




import React, { useState } from "react";
import {
  Clock,
  MapPin,
  User,
  Calendar as CalendarIcon,
  Edit,
  Save,
  X,
} from "lucide-react";

type Session = {
  id: number;
  time: string;
  title: string;
  speaker: string;
  location: string;
  type: string;
  duration: string;
  actionLabel?: string;
};

const nextId = (() => {
  let i = 100;
  return () => ++i;
})();

const initialSchedule: Record<number, Session[]> = {
  1: [
    { id: 1, time: "8:00 AM", title: "Registration & Welcome Coffee", speaker: "Event Team", location: "Main Entrance", type: "registration", duration: "1 hour", actionLabel: "Add to Calendar" },
    { id: 2, time: "9:00 AM", title: "Opening Keynote: The Future of Autonomous Flight", speaker: "Dr. Alex Rivera", location: "Main Stage", type: "keynote", duration: "45 minutes", actionLabel: "Add to Calendar" },
    { id: 3, time: "10:00 AM", title: "Drone Racing Championship - Qualifying Rounds", speaker: "Professional Pilots", location: "Racing Arena", type: "competition", duration: "2 hours", actionLabel: "Add to Calendar" },
    { id: 4, time: "12:00 PM", title: "Innovation Showcase & Networking Lunch", speaker: "All Attendees", location: "Exhibition Hall", type: "networking", duration: "1.5 hours", actionLabel: "Add to Calendar" },
    { id: 5, time: "1:30 PM", title: "Panel: AI in Commercial Drone Applications", speaker: "Sarah Chen, Marcus Johnson", location: "Tech Theater", type: "panel", duration: "1 hour", actionLabel: "Add to Calendar" },
    { id: 6, time: "3:00 PM", title: "Live Demo: Advanced Navigation Systems", speaker: "SkyVision Systems", location: "Demo Zone", type: "demo", duration: "45 minutes", actionLabel: "Add to Calendar" },
    { id: 7, time: "4:00 PM", title: "Startup Pitch Competition", speaker: "Emerging Companies", location: "Innovation Stage", type: "competition", duration: "2 hours", actionLabel: "Add to Calendar" },
    { id: 8, time: "6:00 PM", title: "Day 1 Wrap-up & Evening Networking", speaker: "Event Organizers", location: "Rooftop Lounge", type: "networking", duration: "2 hours", actionLabel: "Add to Calendar" },
  ],
  2: [
    { id: 9, time: "9:00 AM", title: "Day 2 Welcome & Coffee", speaker: "Event Team", location: "Main Entrance", type: "registration", duration: "30 minutes", actionLabel: "Add to Calendar" },
    { id: 10, time: "9:30 AM", title: "Keynote: Urban Air Mobility Revolution", speaker: "Dr. Lisa Kumar", location: "Main Stage", type: "keynote", duration: "45 minutes", actionLabel: "Add to Calendar" },
    { id: 11, time: "10:30 AM", title: "Drone Racing Championship - Finals", speaker: "Top Pilots", location: "Racing Arena", type: "competition", duration: "2 hours", actionLabel: "Add to Calendar" },
    { id: 12, time: "12:30 PM", title: "Awards Lunch & Recognition Ceremony", speaker: "Industry Leaders", location: "Grand Ballroom", type: "ceremony", duration: "1.5 hours", actionLabel: "Add to Calendar" },
    { id: 13, time: "2:00 PM", title: "Workshop: Building Your First Autonomous Drone", speaker: "Dr. Emily Watson", location: "Workshop Lab", type: "workshop", duration: "2 hours", actionLabel: "Add to Calendar" },
    { id: 14, time: "4:30 PM", title: "Panel: Future of Drone Regulations", speaker: "Industry Experts", location: "Policy Theater", type: "panel", duration: "1 hour", actionLabel: "Add to Calendar" },
    { id: 15, time: "5:30 PM", title: "Closing Ceremony & Innovation Awards", speaker: "Event Organizers", location: "Main Stage", type: "ceremony", duration: "1 hour", actionLabel: "Add to Calendar" },
    { id: 16, time: "7:00 PM", title: "After Party & Final Networking", speaker: "All Attendees", location: "Expo Grounds", type: "networking", duration: "3 hours", actionLabel: "Add to Calendar" },
  ],
};

const typeOptions = [
  "keynote",
  "panel",
  "workshop",
  "demo",
  "competition",
  "networking",
  "ceremony",
  "registration",
  "other",
];

const getTypeStyle = (type: string) => {
  switch (type) {
    case "keynote":
      return { bg: "bg-[#FF0000]", text: "text-white", border: "border-[#FF0000]" };
    case "panel":
      return { bg: "bg-[#FFD400]", text: "text-black", border: "border-[#FFD400]" };
    case "workshop":
      return { bg: "bg-blue-500", text: "text-white", border: "border-blue-500" };
    case "demo":
      return { bg: "bg-green-500", text: "text-white", border: "border-green-500" };
    case "competition":
      return { bg: "bg-purple-500", text: "text-white", border: "border-purple-500" };
    case "networking":
      return { bg: "bg-orange-500", text: "text-white", border: "border-orange-500" };
    case "ceremony":
      return { bg: "bg-indigo-500", text: "text-white", border: "border-indigo-500" };
    case "registration":
      return { bg: "bg-gray-500", text: "text-white", border: "border-gray-500" };
    default:
      return { bg: "bg-gray-500", text: "text-white", border: "border-gray-500" };
  }
};

const AgendaSection: React.FC = () => {
  const [activeDay, setActiveDay] = useState<number>(1);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Section-level editable fields
  const [sectionTitle, setSectionTitle] = useState<string>("Event Schedule");
  const [sectionSubtitle, setSectionSubtitle] = useState<string>(
    "Two action-packed days of competitions, demonstrations, workshops, and networking opportunities."
  );
  const [ctaTitle, setCtaTitle] = useState<string>("Download Full Schedule");
  const [ctaDescription, setCtaDescription] = useState<string>(
    "Get the complete event schedule with detailed session information and speaker bios."
  );
  const [ctaButtonLabel, setCtaButtonLabel] = useState<string>("Download PDF Schedule");

  // core schedule state
  const [schedule, setSchedule] = useState<Record<number, Session[]>>(initialSchedule);

  // per-session update helper (immutable)
  const updateSessionField = (day: number, sessionId: number, field: keyof Session, value: string) => {
    setSchedule((prev) => {
      const daySessions = prev[day] ?? [];
      const updatedDaySessions = daySessions.map((s) => (s.id === sessionId ? { ...s, [field]: value } : s));
      return { ...prev, [day]: updatedDaySessions };
    });
  };

  // change session type (so color tag updates correctly)
  const changeSessionType = (day: number, sessionId: number, newType: string) => {
    updateSessionField(day, sessionId, "type", newType);
  };

  // delete session
  const deleteSession = (day: number, sessionId: number) => {
    setSchedule((prev) => {
      const daySessions = prev[day] ?? [];
      const filtered = daySessions.filter((s) => s.id !== sessionId);
      return { ...prev, [day]: filtered };
    });
  };

  // add session (keeps UI consistent — editing only)
  const addSession = (day: number) => {
    const newSession: Session = {
      id: nextId(),
      time: "TBD",
      title: "New Session",
      speaker: "TBD",
      location: "TBD",
      type: "other",
      duration: "TBD",
      actionLabel: "Add to Calendar",
    };
    setSchedule((prev) => {
      const daySessions = prev[day] ?? [];
      return { ...prev, [day]: [...daySessions, newSession] };
    });
  };

  return (
    <section id="schedule" className="py-20 bg-black relative">
      {/* Edit Button */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={() => setIsEditing((s) => !s)}
          className="flex items-center gap-2 bg-[#FFD400] text-black px-4 py-2 rounded-full"
        >
          {isEditing ? <Save size={16} /> : <Edit size={16} />}
          <span>{isEditing ? "Save" : "Edit"}</span>
        </button>
      </div>

      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          {isEditing ? (
            <input
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              className="text-4xl md:text-6xl font-bold text-[#FFD400] mb-4 bg-transparent border-b border-gray-600 text-center w-full max-w-3xl mx-auto"
            />
          ) : (
            <h2 className="text-4xl md:text-6xl font-bold text-[#FFD400] mb-4">{sectionTitle}</h2>
          )}

          <div className="w-32 h-1 bg-[#FFD400] mx-auto mb-6"></div>

          {isEditing ? (
            <textarea
              value={sectionSubtitle}
              onChange={(e) => setSectionSubtitle(e.target.value)}
              className="text-gray-300 text-lg max-w-3xl mx-auto bg-transparent border-b border-gray-600 text-center w-full"
            />
          ) : (
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">{sectionSubtitle}</p>
          )}
        </div>

        {/* Day Tabs */}
        <div className="flex justify-center mb-12">
          <div className="flex bg-gray-800 rounded-full p-2 border border-gray-700">
            {[1, 2].map((day) => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`flex items-center gap-2 px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeDay === day ? "bg-[#FF0000] text-white shadow-lg transform scale-105" : "text-gray-400 hover:text-[#FFD400]"
                }`}
              >
                <CalendarIcon size={16} />
                <span>Day {day}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-end mb-4">
            {isEditing && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => addSession(activeDay)}
                  className="px-4 py-2 bg-[#FFD400] text-black rounded-full font-semibold"
                >
                  + Add Session
                </button>
              </div>
            )}
          </div>

          <div className="grid gap-6">
            {(schedule[activeDay] ?? []).map((session, index) => {
              const typeStyle = getTypeStyle(session.type);
              return (
                <div
                  key={session.id}
                  className="group bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* Time & Type */}
                    <div className="flex-shrink-0 lg:w-48">
                      {isEditing ? (
                        <input
                          value={session.time}
                          onChange={(e) => updateSessionField(activeDay, session.id, "time", e.target.value)}
                          className="text-2xl font-bold text-[#FFD400] mb-2 bg-transparent border-b border-gray-600 w-full"
                        />
                      ) : (
                        <div className="text-2xl font-bold text-[#FFD400] mb-2">{session.time}</div>
                      )}

                      <div className="flex items-center gap-2 mb-2">
                        {isEditing ? (
                          <>
                            <select
                              value={session.type}
                              onChange={(e) => changeSessionType(activeDay, session.id, e.target.value)}
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${typeStyle.bg} ${typeStyle.text}`}
                            >
                              {typeOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>

                            <input
                              value={session.duration}
                              onChange={(e) => updateSessionField(activeDay, session.id, "duration", e.target.value)}
                              className="text-gray-500 text-sm bg-transparent border-b border-gray-600 ml-3"
                            />
                          </>
                        ) : (
                          <>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${typeStyle.bg} ${typeStyle.text}`}>
                              {session.type}
                            </span>
                            <span className="text-gray-500 text-sm">{session.duration}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      {isEditing ? (
                        <input
                          value={session.title}
                          onChange={(e) => updateSessionField(activeDay, session.id, "title", e.target.value)}
                          className="text-xl font-bold text-white mb-3 bg-transparent border-b border-gray-600 w-full"
                        />
                      ) : (
                        <h3 className="text-xl font-bold text-white mb-3">{session.title}</h3>
                      )}

                      <div className="flex flex-wrap gap-6 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-[#FFD400]" />
                          {isEditing ? (
                            <input
                              value={session.speaker}
                              onChange={(e) => updateSessionField(activeDay, session.id, "speaker", e.target.value)}
                              className="bg-transparent border-b border-gray-600"
                            />
                          ) : (
                            <span>{session.speaker}</span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-[#FFD400]" />
                          {isEditing ? (
                            <input
                              value={session.location}
                              onChange={(e) => updateSessionField(activeDay, session.id, "location", e.target.value)}
                              className="bg-transparent border-b border-gray-600"
                            />
                          ) : (
                            <span>{session.location}</span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-[#FFD400]" />
                          <span>{session.duration}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button & delete */}
                    <div className="flex-shrink-0 flex items-center gap-3">
                      {isEditing ? (
                        <input
                          value={session.actionLabel ?? "Add to Calendar"}
                          onChange={(e) => updateSessionField(activeDay, session.id, "actionLabel", e.target.value)}
                          className="px-4 py-2 rounded-full bg-[#FF0000] text-white font-semibold"
                        />
                      ) : (
                        <button className="bg-[#FF0000] hover:bg-[#FF0000]/90 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
                          {session.actionLabel ?? "Add to Calendar"}
                        </button>
                      )}

                      {isEditing && (
                        <button
                          onClick={() => deleteSession(activeDay, session.id)}
                          className="bg-red-600 p-2 rounded-full text-white"
                          title="Remove session"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Download Schedule CTA */}
        <div className="text-center mt-16">
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto border border-gray-800">
            {isEditing ? (
              <>
                <input
                  value={ctaTitle}
                  onChange={(e) => setCtaTitle(e.target.value)}
                  className="text-2xl font-bold text-white mb-4 bg-transparent border-b border-gray-600 w-full"
                />
                <textarea
                  value={ctaDescription}
                  onChange={(e) => setCtaDescription(e.target.value)}
                  className="text-gray-400 mb-6 w-full bg-transparent border-b border-gray-600"
                />
                <input
                  value={ctaButtonLabel}
                  onChange={(e) => setCtaButtonLabel(e.target.value)}
                  className="bg-[#FFD400] text-black px-8 py-3 rounded-full font-semibold w-full"
                />
              </>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-white mb-4">{ctaTitle}</h3>
                <p className="text-gray-400 mb-6">{ctaDescription}</p>
                <button className="bg-[#FFD400] hover:bg-[#FFD400]/90 text-black px-8 py-3 rounded-full font-semibold">
                  {ctaButtonLabel}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgendaSection;
