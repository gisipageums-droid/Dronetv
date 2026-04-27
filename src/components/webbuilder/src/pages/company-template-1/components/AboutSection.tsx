import React from 'react';
import { Target, Eye, Award } from 'lucide-react';

interface CompanyValue {
  icon: 'target' | 'eye' | 'award' | string;
  title: string;
  description: string;
}

interface AboutSectionProps {
  aboutTitle?: string;
  aboutDescription?: string;
  aboutTeamExperience?: string;
  aboutImage?: string;
  aboutExperienceYears?: number;
  companyValues?: CompanyValue[];
  videoEmbedUrl?: string;
}

const iconMap: Record<string, React.ReactNode> = {
  target: <Target size={28} />,
  eye: <Eye size={28} />,
  award: <Award size={28} />,
};

const AboutSection: React.FC<AboutSectionProps> = ({
  aboutTitle = 'About Our Company',
  aboutDescription,
  aboutTeamExperience,
  aboutImage,
  aboutExperienceYears,
  companyValues,
  videoEmbedUrl,
}) => {
  return (
    <section id="about" className="py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-red-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        
        {/* Desktop Layout (lg and above) */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-12 gap-8 items-start">
            
            {/* Left Column - Content */}
            <div className="col-span-5">
              <div className="sticky top-8">
                <h2 className="text-4xl xl:text-5xl font-black text-gray-900 mb-6 leading-tight">
                  {aboutTitle}
                </h2>
                
                {/* Decorative line */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-1 w-20 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"></div>
                  <div className="h-1 w-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full"></div>
                  <div className="h-1 w-6 bg-gray-300 rounded-full"></div>
                </div>

                {/* Description */}
                <div className="space-y-6 mb-10">
                  {aboutDescription && (
                    <p className="text-gray-700 text-lg xl:text-xl leading-relaxed font-medium">
                      {aboutDescription}
                    </p>
                  )}
                  {aboutTeamExperience && (
                    <p className="text-gray-600 text-lg leading-relaxed">
                      {aboutTeamExperience}
                    </p>
                  )}
                </div>

                {/* Experience Badge - Desktop */}
                {aboutExperienceYears && (
                  <div className="inline-flex items-center bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl p-1 shadow-xl">
                    <div className="bg-white rounded-xl px-6 py-4 flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-3xl font-black text-gray-900">
                          {aboutExperienceYears}+
                        </div>
                        <div className="text-sm font-bold text-gray-700">
                          Years
                        </div>
                      </div>
                      <div className="text-gray-700 font-semibold">
                        Experience
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Center Column - Image */}
            <div className="col-span-4">
              <div className="relative group">
                <div className="relative overflow-hidden rounded-3xl shadow-2xl transform transition-all duration-700 group-hover:scale-105">
                  {aboutImage ? (
                    <img
                      src={aboutImage}
                      alt={aboutTitle}
                      className="w-full h-80 xl:h-96 object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : videoEmbedUrl ? (
                    <iframe
                      src={videoEmbedUrl}
                      title="About Video"
                      className="w-full h-80 xl:h-96 rounded-3xl"
                      allowFullScreen
                    />
                  ) : (
                    <div className="w-full h-80 xl:h-96 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-300 rounded-full flex items-center justify-center">
                          <Eye className="w-8 h-8 text-gray-500" />
                        </div>
                        <p className="text-gray-500 font-medium">Media content</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Values */}
            <div className="col-span-3">
              {companyValues && companyValues.length > 0 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Values</h3>
                  {companyValues.map((value, idx) => (
                    <div
                      key={idx}
                      className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
                    >
                      {/* Background gradient on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-red-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <div className="relative z-10">
                        {/* Icon */}
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-500">
                          <div className="text-white transform group-hover:rotate-12 transition-transform duration-500">
                            {iconMap[value.icon] || <Target size={28} />}
                          </div>
                        </div>

                        {/* Title */}
                        <h4 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors duration-300">
                          {value.title}
                        </h4>

                        {/* Description */}
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {value.description}
                        </p>
                      </div>

                      {/* Decorative corner */}
                      <div className="absolute top-0 right-0 w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-bl-xl rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Layout (below lg) */}
        <div className="block lg:hidden">
          <div className="flex flex-col gap-10 md:gap-16 items-center">
            
            {/* Media Section */}
            <div className="w-full order-2 md:order-1">
              <div className="relative group">
                <div className="relative overflow-hidden rounded-3xl shadow-2xl transform transition-all duration-700 group-hover:scale-105">
                  {aboutImage ? (
                    <img
                      src={aboutImage}
                      alt={aboutTitle}
                      className="w-full h-64 md:h-80 object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : videoEmbedUrl ? (
                    <iframe
                      src={videoEmbedUrl}
                      title="About Video"
                      className="w-full h-64 md:h-80 rounded-3xl"
                      allowFullScreen
                    />
                  ) : (
                    <div className="w-full h-64 md:h-80 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-300 rounded-full flex items-center justify-center">
                          <Eye className="w-8 h-8 text-gray-500" />
                        </div>
                        <p className="text-gray-500 font-medium">Media content</p>
                      </div>
                    </div>
                  )}

                  {/* Experience Badge - Mobile */}
                  {aboutExperienceYears && (
                    <div className="absolute -bottom-6 -right-6">
                      <div className="relative">
                        <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full p-1 shadow-2xl">
                          <div className="bg-white rounded-full p-4">
                            <div className="text-center">
                              <div className="text-2xl font-black text-gray-900">
                                {aboutExperienceYears}+
                              </div>
                              <div className="text-xs font-bold text-gray-700 mt-1">
                                Years<br />Experience
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="w-full order-1 md:order-2">
              <div className="text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 leading-tight">
                  {aboutTitle}
                </h2>
                
                {/* Decorative line */}
                <div className="flex items-center gap-3 mb-6 justify-center md:justify-start">
                  <div className="h-1 w-16 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"></div>
                  <div className="h-1 w-8 bg-gradient-to-r from-red-500 to-red-600 rounded-full"></div>
                  <div className="h-1 w-4 bg-gray-300 rounded-full"></div>
                </div>

                {/* Description */}
                <div className="space-y-6 mb-8">
                  {aboutDescription && (
                    <p className="text-gray-700 text-lg leading-relaxed font-medium">
                      {aboutDescription}
                    </p>
                  )}
                  {aboutTeamExperience && (
                    <p className="text-gray-600 text-base leading-relaxed">
                      {aboutTeamExperience}
                    </p>
                  )}
                </div>

                {/* Company Values Grid - Mobile/Tablet */}
                {companyValues && companyValues.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {companyValues.map((value, idx) => (
                      <div
                        key={idx}
                        className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 min-h-[180px] flex flex-col justify-center"
                      >
                        {/* Background gradient on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-red-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        <div className="relative z-10 text-center">
                          {/* Icon */}
                          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-500">
                            <div className="text-white transform group-hover:rotate-12 transition-transform duration-500">
                              {iconMap[value.icon] || <Target size={24} />}
                            </div>
                          </div>

                          {/* Title */}
                          <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors duration-300">
                            {value.title}
                          </h3>

                          {/* Description */}
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {value.description}
                          </p>
                        </div>

                        {/* Decorative corner */}
                        <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-bl-2xl rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;