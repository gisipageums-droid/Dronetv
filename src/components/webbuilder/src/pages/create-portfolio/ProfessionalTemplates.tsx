// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { ArrowLeft, ArrowRight, Eye } from 'lucide-react';

// const ProfessionalTemplates: React.FC = () => {
//   const navigate = useNavigate();

//   const templates = [
//     {
//       id: '1',
//       name: 'Template 1',
//       description: 'Modern and clean design with yellow hero section and professional layout',
//       image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600',
//       features: ['Yellow Hero Section', 'Grid Portfolio', 'Testimonials Carousel', 'Contact Form'],
//       previewUrl: '/portfolio-template-1'
//     },
//     {
//       id: '2',
//       name: 'Template 2',
//       description: 'Split-screen layout with timeline skills and masonry portfolio grid',
//       image: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=600',
//       features: ['Split Hero Layout', 'Timeline Skills', 'Masonry Portfolio', 'Blog Section'],
//       previewUrl: '/portfolio-template-2'
//     }
//   ];

//   const handleTemplateSelect = (templateId: string) => {
//     // Store selected template in localStorage for the form
//     localStorage.setItem('selectedTemplateId', templateId);
//     navigate('/create-portfolio/professional/form');
//   };

//   const handlePreview = (previewUrl: string) => {
//     window.open(previewUrl, '_blank');
//   };

//   return (
//     <div className="min-h-screen bg-surface-main">
//       {/* Header */}
//       <header className="bg-ink text-white py-6">
//         <div className="container mx-auto px-4">
//           <div className="flex items-center justify-between">
//             <div className="text-2xl font-bold">
//               Drone<span className="text-[#F8C400]">TV</span>
//             </div>
//             <nav>
//               <button 
//                 onClick={() => navigate('/create-portfolio')}
//                 className="flex items-center gap-2 text-white hover:text-[#F8C400] transition-colors"
//               >
//                 <ArrowLeft size={20} />
//                 Back to Categories
//               </button>
//             </nav>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="py-20">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-16">
//             <h1 className="text-5xl font-bold text-ink mb-6">
//               Choose Your <span className="text-[#DC2626]">Template</span>
//             </h1>
//             <div className="w-24 h-1 bg-[#F8C400] mx-auto mb-6"></div>
//             <p className="text-ink-paragraph text-xl max-w-2xl mx-auto">
//               Select a professional template that best represents your style and customize it to your needs
//             </p>
//           </div>

//           {/* Template Cards */}
//           <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
//             {templates.map((template) => (
//               <div
//                 key={template.id}
//                 className="bg-surface-card rounded-3xl shadow-2xl overflow-hidden border border-ink-light hover:shadow-3xl transition-all duration-500 transform hover:scale-105"
//               >
//                 {/* Template Preview */}
//                 <div className="relative h-64 overflow-hidden">
//                   <img 
//                     src={template.image} 
//                     alt={template.name}
//                     className="w-full h-full object-cover"
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent"></div>
                  
//                   {/* Preview Button */}
//                   <button
//                     onClick={() => handlePreview(template.previewUrl)}
//                     className="absolute top-4 right-4 bg-white/90 hover:bg-surface-card text-ink p-2 rounded-full transition-colors"
//                   >
//                     <Eye size={20} />
//                   </button>
                  
//                   <div className="absolute bottom-4 left-4">
//                     <h3 className="text-2xl font-bold text-white mb-1">{template.name}</h3>
//                   </div>
//                 </div>

//                 {/* Template Info */}
//                 <div className="p-8">
//                   <p className="text-ink-paragraph mb-6 text-lg leading-relaxed">
//                     {template.description}
//                   </p>

//                   {/* Features */}
//                   <div className="mb-8">
//                     <h4 className="font-semibold text-ink mb-3">Key Features:</h4>
//                     <div className="grid grid-cols-2 gap-2">
//                       {template.features.map((feature, index) => (
//                         <div key={index} className="flex items-center gap-2">
//                           <div className="w-2 h-2 bg-[#DC2626] rounded-full"></div>
//                           <span className="text-ink-paragraph text-sm">{feature}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="flex gap-4">
//                     <button
//                       onClick={() => handleTemplateSelect(template.id)}
//                       className="flex-1 bg-[#DC2626] hover:bg-[#DC2626]/90 text-white py-3 px-6 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105"
//                     >
//                       <span>Customize This Template</span>
//                       <ArrowRight size={20} />
//                     </button>
                    
//                     <button
//                       onClick={() => handlePreview(template.previewUrl)}
//                       className="border-2 border-[#F8C400] text-ink hover:bg-[#F8C400] py-3 px-6 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2"
//                     >
//                       <Eye size={20} />
//                       Preview
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Help Section */}
//           <div className="mt-20 bg-[#F8C400] rounded-3xl p-12 text-center">
//             <h2 className="text-3xl font-bold text-ink mb-4">
//               Need Help Choosing?
//             </h2>
//             <p className="text-ink/80 text-lg mb-6">
//               Both templates are fully customizable and mobile-responsive. You can always preview them before making your final decision.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <button
//                 onClick={() => handlePreview('/portfolio-template-1')}
//                 className="bg-ink hover:bg-ink-charcoal text-white px-6 py-3 rounded-full font-semibold transition-colors"
//               >
//                 Preview Template 1
//               </button>
//               <button
//                 onClick={() => handlePreview('/portfolio-template-2')}
//                 className="bg-ink hover:bg-ink-charcoal text-white px-6 py-3 rounded-full font-semibold transition-colors"
//               >
//                 Preview Template 2
//               </button>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default ProfessionalTemplates;