// import React, { useState } from 'react';
// import { ExternalLink, Eye, X } from 'lucide-react';

// const Portfolio: React.FC = () => {
//   const [activeFilter, setActiveFilter] = useState('All');
//   const [selectedProject, setSelectedProject] = useState<any>(null);

//   const categories = ['All', 'Drone Projects', 'Web Development', 'Design', 'Video'];

//   const projects = [
//     {
//       id: 1,
//       title: 'Coastal Aerial Survey',
//       category: 'Drone Projects',
//       image: 'https://images.pexels.com/photos/1438176/pexels-photo-1438176.jpeg?auto=compress&cs=tinysrgb&w=600',
//       description: 'Comprehensive aerial survey of coastal erosion patterns using advanced drone technology and photogrammetry.',
//       technologies: ['DJI Mavic 3', 'PPK GPS', 'Photogrammetry'],
//       size: 'large'
//     },
//     {
//       id: 2,
//       title: 'Real Estate Showcase',
//       category: 'Drone Projects',
//       image: 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=600',
//       description: 'Luxury property aerial photography and virtual tour creation.',
//       technologies: ['4K Video', '360° Photography', 'Virtual Tours'],
//       size: 'medium'
//     },
//     {
//       id: 3,
//       title: 'DroneTV Website',
//       category: 'Web Development',
//       image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600',
//       description: 'Modern responsive website for drone services company.',
//       technologies: ['React', 'TypeScript', 'Tailwind CSS'],
//       size: 'medium'
//     },
//     {
//       id: 4,
//       title: 'Corporate Branding',
//       category: 'Design',
//       image: 'https://images.pexels.com/photos/1851415/pexels-photo-1851415.jpeg?auto=compress&cs=tinysrgb&w=600',
//       description: 'Complete brand identity design for aerial photography company.',
//       technologies: ['Adobe Creative Suite', 'Brand Guidelines', 'Logo Design'],
//       size: 'small'
//     },
//     {
//       id: 5,
//       title: 'Construction Time-lapse',
//       category: 'Video',
//       image: 'https://images.pexels.com/photos/1098365/pexels-photo-1098365.jpeg?auto=compress&cs=tinysrgb&w=600',
//       description: 'Time-lapse documentation of construction project progress.',
//       technologies: ['Time-lapse', 'Progress Tracking', 'Reporting'],
//       size: 'large'
//     },
//     {
//       id: 6,
//       title: 'Flight Control App',
//       category: 'Web Development',
//       image: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=600',
//       description: 'Mobile application for drone flight planning and control.',
//       technologies: ['React Native', 'Flight APIs', 'GPS Integration'],
//       size: 'medium'
//     },
//     {
//       id: 7,
//       title: 'Event Coverage',
//       category: 'Video',
//       image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=600',
//       description: 'Professional aerial coverage of outdoor events and festivals.',
//       technologies: ['Live Streaming', 'Multi-angle', 'Post Production'],
//       size: 'small'
//     },
//     {
//       id: 8,
//       title: 'Agricultural Survey',
//       category: 'Drone Projects',
//       image: 'https://images.pexels.com/photos/1595108/pexels-photo-1595108.jpeg?auto=compress&cs=tinysrgb&w=600',
//       description: 'Precision agriculture monitoring and crop analysis.',
//       technologies: ['NDVI Imaging', 'Data Analysis', 'Crop Monitoring'],
//       size: 'medium'
//     }
//   ];

//   const filteredProjects = activeFilter === 'All' 
//     ? projects 
//     : projects.filter(project => project.category === activeFilter);

//   const getGridClass = (size: string) => {
//     switch (size) {
//       case 'large':
//         return 'md:col-span-2 md:row-span-2';
//       case 'medium':
//         return 'md:col-span-1 md:row-span-1';
//       case 'small':
//         return 'md:col-span-1 md:row-span-1';
//       default:
//         return 'md:col-span-1 md:row-span-1';
//     }
//   };

//   return (
//     <section id="portfolio" className="py-20 bg-white dark:bg-gray-900">
//       <div className="container mx-auto px-4">
//         <div className="text-center mb-16">
//           <h2 data-aos="fade-up" className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-4">
//             My <span className="text-[#FF0000]">Portfolio</span>
//           </h2>
//           <div data-aos="fade-up" data-aos-delay="200" className="w-24 h-1 bg-[#FFD400] mx-auto mb-6"></div>
//           <p data-aos="fade-up" data-aos-delay="400" className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
//             Explore my recent projects showcasing creativity, technical expertise, and innovative solutions.
//           </p>
//         </div>


//         <div data-aos="fade-up" data-aos-delay="600" className="flex justify-center mb-12">
//           <div className="flex flex-wrap gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
//             {categories.map((category) => (
//               <button
//                 key={category}
//                 onClick={() => setActiveFilter(category)}
//                 className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
//                   activeFilter === category
//                     ? 'bg-[#FF0000] text-white shadow-lg transform scale-105'
//                     : 'text-gray-700 dark:text-gray-300 hover:text-[#FF0000] hover:bg-white dark:hover:bg-gray-700'
//                 }`}
//               >
//                 {category}
//               </button>
//             ))}
//           </div>
//         </div>

//                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[200px]">
//           {filteredProjects.map((project, index) => (
//             <div 
//               key={project.id}
//               data-aos="fade-up" 
//               data-aos-delay={index * 100}
//               className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 ${getGridClass(project.size)}`}
//             >
//               <img 
//                 src={project.image} 
//                 alt={project.title}
//                 className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//               />
              
        
//               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
//                 <div className="absolute bottom-0 left-0 right-0 p-6">
//                   <div className="mb-2">
//                     <span className="text-xs font-bold text-[#FFD400] bg-[#FFD400]/20 px-2 py-1 rounded-full">
//                       {project.category}
//                     </span>
//                   </div>
//                   <h3 className="text-white font-bold text-lg mb-2">{project.title}</h3>
//                   <p className="text-gray-300 text-sm mb-4 line-clamp-2">{project.description}</p>
                  
//                   <div className="flex gap-2">
//                     <button 
//                       onClick={() => setSelectedProject(project)}
//                       className="w-10 h-10 bg-[#FF0000] rounded-full flex items-center justify-center text-white hover:bg-[#FF0000]/80 transition-colors"
//                     >
//                       <Eye size={16} />
//                     </button>
//                     <button className="w-10 h-10 bg-[#FFD400] rounded-full flex items-center justify-center text-black hover:bg-[#FFD400]/80 transition-colors">
//                       <ExternalLink size={16} />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

      
//         {selectedProject && (
//           <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
//             <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//               <div className="relative">
//                 <img 
//                   src={selectedProject.image} 
//                   alt={selectedProject.title}
//                   className="w-full h-80 object-cover rounded-t-3xl"
//                 />
//                 <button 
//                   onClick={() => setSelectedProject(null)}
//                   className="absolute top-6 right-6 w-12 h-12 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
//                 >
//                   <X size={20} />
//                 </button>
//               </div>
              
//               <div className="p-8">
//                 <div className="flex items-center gap-2 mb-4">
//                   <span className="text-sm font-bold text-[#FF0000] bg-[#FF0000]/10 px-3 py-1 rounded-full">
//                     {selectedProject.category}
//                   </span>
//                 </div>
                
//                 <h2 className="text-3xl font-bold text-black dark:text-white mb-4">
//                   {selectedProject.title}
//                 </h2>
                
//                 <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg leading-relaxed">
//                   {selectedProject.description}
//                 </p>
                
//                 <div className="mb-8">
//                   <h3 className="text-lg font-semibold text-black dark:text-white mb-3">Technologies Used:</h3>
//                   <div className="flex flex-wrap gap-2">
//                     {selectedProject.technologies.map((tech: string, techIndex: number) => (
//                       <span 
//                         key={techIndex}
//                         className="bg-[#FFD400]/20 text-black dark:text-white px-3 py-1 rounded-full text-sm font-medium"
//                       >
//                         {tech}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
                
//                 <div className="flex gap-4">
//                   <button className="bg-[#FF0000] hover:bg-[#FF0000]/90 text-white px-8 py-3 rounded-full font-semibold transition-colors">
//                     View Live Project
//                   </button>
//                   <button className="border-2 border-[#FF0000] text-[#FF0000] hover:bg-[#FF0000] hover:text-white px-8 py-3 rounded-full font-semibold transition-colors">
//                     View Code
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// };
import React from 'react';

interface Project {
  title: string;
  description: string;
  category: string;
  image: string;
}

interface PortfolioProps {
  projects: Project[];
}

const Portfolio: React.FC<PortfolioProps> = ({ projects }) => {
  return (
    <section id="portfolio" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 data-aos="fade-up" className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-4">
            Project <span className="text-[#FF0000]">Gallery</span>
          </h2>
          <div data-aos="fade-up" data-aos-delay="200" className="w-24 h-1 bg-[#FFD400] mx-auto mb-6"></div>
          <p data-aos="fade-up" data-aos-delay="400" className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {projects.length > 0 
              ? "A collection of my recent projects and work."
              : "No projects to display at the moment."}
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <div
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className="overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500"
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-4 bg-white dark:bg-gray-800">
                <h3 className="text-xl font-semibold text-black dark:text-white">
                  {project.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {project.description}
                </p>
                <span className="inline-block mt-3 px-3 py-1 bg-[#FFD400] text-black rounded-full text-sm">
                  {project.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;