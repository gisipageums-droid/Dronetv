import React from 'react';
import { Mail, Phone, MapPin, Award } from 'lucide-react';

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
  experienceYears?: string;
  profileImage?: string;
  signatureText?: string;
  contactInfo?: ContactInfo[];
  primaryColor?: string;
  accentColor?: string;
  bio?: string;
  email?: string;
  phone?: string;
  location?: string;
  quote?: string;
  position?: string;
}

const AboutMe: React.FC<AboutMeProps> = ({
  title = 'Dev R',
  highlightText = '',
  subtitle = 'Founder & CEO — IPage UM Services (Singapore & India)',
  description = '',
  additionalDescription = '',
  experienceYears = '16',
  profileImage = '/images/dev.png',
  signatureText = 'Dev R',
  contactInfo,
  primaryColor = '#FFD400',
  accentColor = '#FF0000',
  bio = '',
  email = 'bd@ipageums.com',
  phone = '+65 9006 2901',
  location = 'Singapore & Hyderabad, India',
  quote = 'Broadcasting the future of drones — one innovation, one story at a time.',
  position = 'Driving Innovation in Drone Technology | GIS | AI | IT Solutions'
}) => {
  // Build contact info from API data if not provided
  const defaultContactInfo: ContactInfo[] = [
    {
      type: 'email',
      value: email,
      label: 'Email'
    },
    {
      type: 'phone',
      value: phone,
      label: 'WhatsApp'
    },
    {
      type: 'location',
      value: location,
      label: 'Location'
    }
  ];

  const finalContactInfo = contactInfo || defaultContactInfo;
  const finalDescription = description || bio || 'As the Founder & CEO of IPage UM Services Pte Ltd (Singapore) and IPage UM Services Pvt Ltd (India), I bring over 16 years of expertise across UAV technology, GIS, AI, and IT solutions. In India, I led national-scale projects like Amaravati with Surbana Jurong and infrastructure initiatives like Polavaram and Kaleshwaram, using drones and geospatial analytics for smarter governance. I also established India Drone Academy, a DGCA-certified training institute, and created DroneTV to broadcast global drone innovations and insights. Our platforms now power real-time mapping, smart data portals, and immersive UAV learning ecosystems.';
  const finalProfileImage = profileImage;

  const iconMap = {
    email: <Mail size={20} className="text-white" />,
    phone: <Phone size={20} className="text-white" />,
    location: <MapPin size={20} className="text-white" />
  };

  return (
    <section id="about" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Profile Card */}
          <div data-aos="fade-up" className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden">
            {/* Header with Profile Photo */}
            <div 
              className="relative p-12 text-center"
              style={{ background: `linear-gradient(to right, ${primaryColor}, ${primaryColor}80)` }}
            >
              <div className="relative inline-block">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl mx-auto group">
                  <img
                    src={finalProfileImage}
                    alt={signatureText}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div 
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: accentColor }}
                >
                  <Award size={16} className="text-white" />
                </div>
              </div>

              <h2 className="text-3xl font-bold text-black mt-6 mb-2">{title}</h2>
              <p className="text-black/80 text-lg font-medium text-center">
                {subtitle}
              </p>
              <p className="text-black/70 text-base mt-2">
                {position}
              </p>
            </div>

            {/* Content */}
            <div className="p-12">
              <div className="grid md:grid-cols-2 gap-12">
                {/* Bio */}
                <div>
                  <h3 className="text-2xl font-bold text-black dark:text-white mb-6">About Me</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {finalDescription}
                  </p>
                  {additionalDescription && (
                    <p 
                      className="text-gray-600 dark:text-gray-400 leading-relaxed mt-4"
                      dangerouslySetInnerHTML={{ __html: additionalDescription }}
                    />
                  )}
                </div>

                {/* Contact Info */}
                <div>
                  <h3 className="text-2xl font-bold text-black dark:text-white mb-6">Get In Touch</h3>

                  <div className="space-y-6">
                    {finalContactInfo.map((info, index) => (
                      <div key={index} className="flex items-center gap-4 group">
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
                          style={{ backgroundColor: accentColor }}
                        >
                          {iconMap[info.type]}
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{info.label}</div>
                          <div className="text-black dark:text-white font-semibold">{info.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Signature */}
                  <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <div 
                      className="text-3xl font-bold opacity-60 transform -rotate-2"
                      style={{ color: primaryColor }}
                    >
                      {signatureText}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      "{quote}"
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;