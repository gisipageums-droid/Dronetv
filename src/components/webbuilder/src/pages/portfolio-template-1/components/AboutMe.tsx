// import React from 'react';
// import { Mail, Phone, MapPin } from 'lucide-react';

// interface ContactInfo {
//   type: 'email' | 'phone' | 'location';
//   value: string;
//   label: string;
// }

// interface AboutMeProps {
//   title?: string;
//   highlightText?: string;
//   subtitle?: string;
//   description?: string;
//   additionalDescription?: string;
//   experienceYears?: number;
//   profileImage?: string;
//   signatureText?: string;
//   contactInfo?: ContactInfo[];
// }

// const AboutMe: React.FC<AboutMeProps> = ({
//   title = 'About Me',
//   highlightText = 'Me',
//   subtitle = 'DGCA RPAS Instructor & Aerospace Educator',
//   description = 'I am a DGCA-certified Remotely Piloted Aircraft Instructor (Medium & Small Class) with over 11 years of combined experience in drone operations and aerospace education. I currently train drone pilots at India Drone Academy, Hyderabad.',
//   additionalDescription = 'Previously an Assistant Professor of Aerospace Engineering, I’ve authored a book titled <i>Fundamentals of Propulsion</i>, published 7 research papers, and organized ICASAS-2019. I specialize in drone pilot training, flight dynamics, and UAV curriculum development.',
//   experienceYears = 11,
//   profileImage = '/images/sumit.jpg',
//   signatureText = 'Sumit Krishnan',
//   contactInfo = [
//     {
//       type: 'email',
//       value: 'sumit@indiadroneacademy.com',
//       label: 'Email:'
//     },
//     {
//       type: 'phone',
//       value: '+91-9580120509',
//       label: 'Phone:'
//     },
//     {
//       type: 'location',
//       value: 'Hyderabad, Telangana',
//       label: 'Location:'
//     }
//   ]
// }) => {
//   const iconMap = {
//     email: <Mail size={20} className="text-white" />,
//     phone: <Phone size={20} className="text-white" />,
//     location: <MapPin size={20} className="text-white" />
//   };

//   return (
//     <section id="about" className="py-20 bg-white dark:bg-gray-900">
//       <div className="container mx-auto px-4">
//         <div className="text-center mb-16">
//           <h2 data-aos="fade-up" className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-4">
//             {title} <span className="text-[#FF0000]">{highlightText}</span>
//           </h2>
//           <div data-aos="fade-up" data-aos-delay="200" className="w-24 h-1 bg-[#FFD400] mx-auto"></div>
//         </div>

//         <div className="grid md:grid-cols-2 gap-16 items-center">
//           {/* Profile Image */}
//           <div data-aos="fade-right" className="relative">
//             <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
//               <img 
//                 src={profileImage} 
//                 alt={signatureText} 
//                 className="w-full h-98 object-cover transition-transform duration-500 group-hover:scale-110"
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//             </div>
            
//             {/* Floating Badge */}
//             <div className="absolute -bottom-6 -right-6 bg-[#FFD400] text-black px-6 py-3 rounded-full font-bold shadow-lg">
//               {experienceYears}+ Years Experience
//             </div>
//           </div>

//           {/* Content */}
//           <div data-aos="fade-left">
//             <h3 className="text-3xl font-bold text-black dark:text-white mb-6">
//               {subtitle}
//             </h3>
            
//             <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
//               {description}
//             </p>
            
//             <p 
//               className="text-gray-700 dark:text-gray-300 mb-8 leading-relaxed"
//               dangerouslySetInnerHTML={{ __html: additionalDescription }}
//             />

//             {/* Contact Info */}
//             <div className="space-y-4 mb-8">
//               {contactInfo.map((info, index) => (
//                 <div key={index} className="flex items-center gap-4">
//                   <div className="w-12 h-12 bg-[#FF0000] rounded-full flex items-center justify-center">
//                     {iconMap[info.type]}
//                   </div>
//                   <div>
//                     <span className="text-gray-600 dark:text-gray-400">{info.label}</span>
//                     <p className="text-black dark:text-white font-semibold">{info.value}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Signature */}
//             <div className="relative">
//               <div className="text-4xl font-bold text-[#FFD400] opacity-50">
//                 {signatureText}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default AboutMe;

import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

interface ContactInfo {
  type: 'email' | 'phone' | 'location';
  value: string;
  label: string;
}

interface AboutMeProps {
  title?: string;
  highlightText?: string;
  subtitle?: string;
  description?: string;
  additionalDescription?: string;
  experienceYears?: string; // Changed to string to match API
  profileImage?: string;
  signatureText?: string;
  contactInfo?: ContactInfo[];
  primaryColor?: string;
  accentColor?: string;
  bio?: string;
  email?: string;
  phone?: string;
  location?: string;
}

const AboutMe: React.FC<AboutMeProps> = ({
  title = 'About Me',
  highlightText = 'Me',
  subtitle = 'Founder and CEO of IPage Group',
  description = '', // Will use bio if not provided
  additionalDescription = '', // Optional additional text
  experienceYears = '16', // From API timestamp
  profileImage = '',
  signatureText = 'Dev R', // From API fullName
  contactInfo, // Will build from API
  primaryColor = '#FFD400',
  accentColor = '#FF0000',
  bio = '',
  email = '',
  phone = '',
  location = ''
}) => {
  // Build contact info from API data if not provided
  const defaultContactInfo: ContactInfo[] = [
    {
      type: 'email',
      value: email || 'bd@ipageums.com',
      label: 'Email:'
    },
    {
      type: 'phone',
      value: phone || '+65 9006 2901',
      label: 'Phone:'
    },
    {
      type: 'location',
      value: location || 'Singapore & Hyderabad, India',
      label: 'Location:'
    }
  ];

  const finalContactInfo = contactInfo || defaultContactInfo;
  const finalDescription = description || bio || 'Leading IPage UM Services since 2008 across Singapore and India—driving innovation in Drone Technology, GIS, AI, and custom IT solutions.';
  const finalProfileImage = profileImage || 'https://professional-img.s3.ap-south-1.amazonaws.com/portfolio-images/258964443767/profilePicture.jpg';

  const iconMap = {
    email: <Mail size={20} className="text-white" />,
    phone: <Phone size={20} className="text-white" />,
    location: <MapPin size={20} className="text-white" />
  };

  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 data-aos="fade-up" className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-4">
            {title} <span style={{ color: accentColor }}>{highlightText}</span>
          </h2>
          <div 
            data-aos="fade-up" 
            data-aos-delay="200" 
            className="w-24 h-1 mx-auto"
            style={{ backgroundColor: primaryColor }}
          ></div>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Profile Image */}
          <div data-aos="fade-right" className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
              <img 
                src={finalProfileImage} 
                alt={signatureText} 
                className="w-full h-98 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            {/* Floating Badge */}
            <div 
              className="absolute -bottom-6 -right-6 text-black px-6 py-3 rounded-full font-bold shadow-lg"
              style={{ backgroundColor: primaryColor }}
            >
              {experienceYears}+ Years Experience
            </div>
          </div>

          {/* Content */}
          <div data-aos="fade-left">
            <h3 className="text-3xl font-bold text-black dark:text-white mb-6">
              {subtitle}
            </h3>
            
            <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
              {finalDescription}
            </p>
            
            {additionalDescription && (
              <p 
                className="text-gray-700 dark:text-gray-300 mb-8 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: additionalDescription }}
              />
            )}

            {/* Contact Info */}
            <div className="space-y-4 mb-8">
              {finalContactInfo.map((info, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: accentColor }}
                  >
                    {iconMap[info.type]}
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">{info.label}</span>
                    <p className="text-black dark:text-white font-semibold">{info.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Signature */}
            <div className="relative">
              <div 
                className="text-4xl font-bold opacity-50"
                style={{ color: primaryColor }}
              >
                {signatureText}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;