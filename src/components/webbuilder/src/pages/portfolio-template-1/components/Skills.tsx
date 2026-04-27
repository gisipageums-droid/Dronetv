// import React from 'react';
// import { GraduationCap, Plane, Activity, BookOpen, Mic, ClipboardList, Cpu, Users } from 'lucide-react';

// const Skills: React.FC = () => {
//   const skillCategories = [
//     {
//       title: 'Drone Training',
//       icon: <GraduationCap size={24} />,
//       skills: [
//         { name: 'RPAS Instructor (DGCA)', level: 98 },
//         { name: 'Ground School & Simulators', level: 95 },
//         { name: 'Practical Flying Sessions', level: 92 },
//       ]
//     },
//     {
//       title: 'Aerospace Expertise',
//       icon: <Plane size={24} />,
//       skills: [
//         { name: 'Flight Dynamics & Stability', level: 93 },
//         { name: 'CFD & Wind Tunnel Testing', level: 91 },
//         { name: 'Curriculum Development', level: 90 },
//       ]
//     },
//     {
//       title: 'Professional Skills',
//       icon: <BookOpen size={24} />,
//       skills: [
//         { name: 'Technical Writing & Research', level: 94 },
//         { name: 'Public Speaking & Presentations', level: 89 },
//         { name: 'Conference & Event Management', level: 88 },
//       ]
//     }
//   ];

//   const certifications = [
//     { icon: <Cpu size={20} />, title: 'DGCA RPAS Instructor', desc: 'Medium & Small Class Certified' },
//     { icon: <BookOpen size={20} />, title: 'Published Author', desc: '“Fundamentals of Propulsion” & 7 Research Papers' },
//     { icon: <Users size={20} />, title: 'Conference Organizer', desc: 'ICASAS – 2019, Airworthiness & Safety' },
//   ];

//   return (
//     <section id="skills" className="py-20 bg-gray-50 dark:bg-gray-800">
//       <div className="container mx-auto px-4">
//         <div className="text-center mb-16">
//           <h2 data-aos="fade-up" className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-4">
//             My <span className="text-[#FF0000]">Skills</span>
//           </h2>
//           <div data-aos="fade-up" data-aos-delay="200" className="w-24 h-1 bg-[#FFD400] mx-auto"></div>
//         </div>

//         {/* Skills Grid */}
//         <div className="grid md:grid-cols-3 gap-8 mb-16">
//           {skillCategories.map((category, index) => (
//             <div
//               key={index}
//               data-aos="fade-up"
//               data-aos-delay={index * 200}
//               className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
//             >
//               <div className="flex items-center gap-4 mb-6">
//                 <div className="w-12 h-12 bg-[#FF0000] rounded-full flex items-center justify-center text-white">
//                   {category.icon}
//                 </div>
//                 <h3 className="text-xl font-bold text-black dark:text-white">{category.title}</h3>
//               </div>

//               <div className="space-y-4">
//                 {category.skills.map((skill, skillIndex) => (
//                   <div key={skillIndex}>
//                     <div className="flex justify-between items-center mb-2">
//                       <span className="text-gray-700 dark:text-gray-300 font-medium">{skill.name}</span>
//                       <span className="text-[#FF0000] font-bold">{skill.level}%</span>
//                     </div>
//                     <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
//                       <div
//                         className="bg-gradient-to-r from-[#FFD400] to-[#FF0000] h-2 rounded-full transition-all duration-1000 ease-out"
//                         style={{ width: `${skill.level}%` }}
//                       ></div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Certifications */}
//         <div data-aos="fade-up" className="bg-black rounded-2xl p-8">
//           <h3 className="text-2xl font-bold text-white text-center mb-8">
//             Certifications & <span className="text-[#FFD400]">Achievements</span>
//           </h3>

//           <div className="grid md:grid-cols-3 gap-6">
//             {certifications.map((cert, index) => (
//               <div
//                 key={index}
//                 className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-300"
//               >
//                 <div className="w-10 h-10 bg-[#FF0000] rounded-full flex items-center justify-center text-white flex-shrink-0">
//                   {cert.icon}
//                 </div>
//                 <div>
//                   <h4 className="text-white font-semibold">{cert.title}</h4>
//                   <p className="text-gray-400 text-sm">{cert.desc}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Skills;

import React from 'react';
import { GraduationCap, Plane, BookOpen, Cpu, Users } from 'lucide-react';

interface Skill {
  name: string;
  proficiency: number;
}

interface SkillCategory {
  title: string;
  icon: JSX.Element;
  skills: Skill[];
}

interface Certification {
  title: string;
  description: string;
  icon: JSX.Element;
}

interface SkillsProps {
  skills?: Array<{
    name: string;
    category: string;
    proficiency: number;
  }>;
  certifications?: Array<{
    title: string;
    description: string;
  }>;
  primaryColor?: string;
  accentColor?: string;
}

const Skills: React.FC<SkillsProps> = ({
  skills = [],
  certifications = [],
  primaryColor = "#FFD400",
  accentColor = "#FF0000"
}) => {
  // Categorize skills from API
  const categorizeSkills = (): SkillCategory[] => {
    if (skills.length === 0) {
      return [
        {
          title: 'Business Skills',
          icon: <BookOpen size={24} />,
          skills: [
            { name: 'Business Strategy', proficiency: 90 },
            { name: 'Business Development', proficiency: 92 },
            { name: 'Business Planning', proficiency: 94 },
          ]
        },
        {
          title: 'Technical Skills',
          icon: <Cpu size={24} />,
          skills: [
            { name: 'UAV Technology', proficiency: 88 },
            { name: 'GIS Solutions', proficiency: 85 },
            { name: 'AI Integration', proficiency: 82 },
          ]
        },
        {
          title: 'Leadership',
          icon: <Users size={24} />,
          skills: [
            { name: 'Team Management', proficiency: 95 },
            { name: 'Project Leadership', proficiency: 93 },
            { name: 'Strategic Planning', proficiency: 91 },
          ]
        }
      ];
    }

    // Group skills by category from API
    const categories: Record<string, Skill[]> = {};
    
    skills.forEach(skill => {
      if (!categories[skill.category]) {
        categories[skill.category] = [];
      }
      categories[skill.category].push({
        name: skill.name,
        proficiency: skill.proficiency
      });
    });

    // Map to SkillCategory format with appropriate icons
    return Object.entries(categories).map(([category, skills], index) => {
      let icon = <BookOpen size={24} />;
      switch (category) {
        case 'Frontend':
          icon = <Cpu size={24} />;
          break;
        case 'Backend':
          icon = <Cpu size={24} />;
          break;
        case 'Leadership':
          icon = <Users size={24} />;
          break;
        default:
          icon = <BookOpen size={24} />;
      }

      return {
        title: category,
        icon,
        skills: skills.slice(0, 3) // Limit to 3 skills per category
      };
    });
  };

  const skillCategories = categorizeSkills();

  // Prepare certifications from API or use defaults
  const displayCertifications: Certification[] = certifications.length > 0
    ? certifications.map(cert => ({
        title: cert.title,
        description: cert.description,
        icon: <BookOpen size={20} />
      }))
    : [
        {
          title: 'DGCA Certified',
          description: 'RPAS Instructor for drone training programs',
          icon: <GraduationCap size={20} />
        },
        {
          title: 'Published Author',
          description: 'Multiple research papers on drone technology',
          icon: <BookOpen size={20} />
        },
        {
          title: 'Conference Speaker',
          description: 'Regular speaker at international drone conferences',
          icon: <Users size={20} />
        }
      ];

  return (
    <section id="skills" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-4">
            My <span style={{ color: accentColor }}>Skills</span>
          </h2>
          <div className="w-24 h-1 mx-auto" style={{ backgroundColor: primaryColor }}></div>
        </div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {skillCategories.map((category, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-6">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: accentColor }}
                >
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold text-black dark:text-white">{category.title}</h3>
              </div>

              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{skill.name}</span>
                      <span className="font-bold" style={{ color: accentColor }}>{skill.proficiency}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ 
                          width: `${skill.proficiency}%`,
                          background: `linear-gradient(to right, ${primaryColor}, ${accentColor})`
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Certifications */}
        <div className="bg-black rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-white text-center mb-8">
            Certifications & <span style={{ color: primaryColor }}>Achievements</span>
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {displayCertifications.map((cert, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-300"
              >
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0"
                  style={{ backgroundColor: accentColor }}
                >
                  {cert.icon}
                </div>
                <div>
                  <h4 className="text-white font-semibold">{cert.title}</h4>
                  <p className="text-gray-400 text-sm">{cert.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;