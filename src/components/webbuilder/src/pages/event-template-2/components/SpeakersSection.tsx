import React from 'react';
import { Linkedin, Twitter, ExternalLink } from 'lucide-react';

const SpeakersSection: React.FC = () => {
  const speakers = [
    {
      id: 1,
      name: 'Dr. Alex Rivera',
      title: 'Chief Innovation Officer',
      company: 'AeroTech Dynamics',
      topic: 'The Next Generation of Autonomous Flight',
      image: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
      linkedin: '#',
      twitter: '#',
      featured: true
    },
    {
      id: 2,
      name: 'Sarah Chen',
      title: 'Lead Engineer',
      company: 'SkyVision Systems',
      topic: 'AI-Powered Navigation Systems',
      image: 'https://images.pexels.com/photos/1310522/pexels-photo-1310522.jpeg?auto=compress&cs=tinysrgb&w=400',
      linkedin: '#',
      twitter: '#',
      featured: true
    },
    {
      id: 3,
      name: 'Marcus Johnson',
      title: 'Founder & CEO',
      company: 'DroneFlow Corp',
      topic: 'Commercial Drone Applications',
      image: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=400',
      linkedin: '#',
      twitter: '#',
      featured: false
    },
    {
      id: 4,
      name: 'Dr. Emily Watson',
      title: 'Research Director',
      company: 'Future Flight Labs',
      topic: 'Sustainable Aviation Technology',
      image: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=400',
      linkedin: '#',
      twitter: '#',
      featured: false
    },
    {
      id: 5,
      name: 'James Park',
      title: 'Head of R&D',
      company: 'Autonomous Systems Inc',
      topic: 'Swarm Intelligence in Drones',
      image: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
      linkedin: '#',
      twitter: '#',
      featured: false
    },
    {
      id: 6,
      name: 'Dr. Lisa Kumar',
      title: 'Technology Evangelist',
      company: 'NextGen Aviation',
      topic: 'Urban Air Mobility Solutions',
      image: 'https://images.pexels.com/photos/1851415/pexels-photo-1851415.jpeg?auto=compress&cs=tinysrgb&w=400',
      linkedin: '#',
      twitter: '#',
      featured: false
    }
  ];

  const featuredSpeakers = speakers.filter(speaker => speaker.featured);
  const regularSpeakers = speakers.filter(speaker => !speaker.featured);

  return (
    <section id="speakers" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 data-aos="fade-up" className="text-4xl md:text-6xl font-bold text-[#FFD400] mb-4">
            Featured <span className="text-white">Speakers</span>
          </h2>
          <div data-aos="fade-up" data-aos-delay="200" className="w-32 h-1 bg-[#FFD400] mx-auto mb-6"></div>
          <p data-aos="fade-up" data-aos-delay="400" className="text-gray-300 text-lg max-w-3xl mx-auto">
            Learn from visionary leaders and technical experts who are shaping the future of drone technology.
          </p>
        </div>

        {/* Featured Speakers */}
        <div className="mb-20">
          <h3 data-aos="fade-up" className="text-2xl font-bold text-white text-center mb-12">
            Keynote Speakers
          </h3>
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {featuredSpeakers.map((speaker, index) => (
              <div 
                key={speaker.id}
                data-aos="fade-up" 
                data-aos-delay={index * 200}
                className="group relative bg-black/50 backdrop-blur-sm rounded-3xl overflow-hidden border border-gray-800 hover:border-[#FFD400]/50 transition-all duration-500 transform hover:scale-105"
              >
                {/* Featured Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-[#FF0000] text-white px-3 py-1 rounded-full text-xs font-semibold">
                    KEYNOTE
                  </span>
                </div>

                {/* Image */}
                <div className="relative h-80 overflow-hidden">
                  <img 
                    src={speaker.image} 
                    alt={speaker.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                  
                  {/* Social Links */}
                  <div className="absolute bottom-6 left-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <a 
                      href={speaker.linkedin}
                      className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-[#FF0000] hover:bg-[#FF0000] hover:text-white transition-colors"
                    >
                      <Linkedin size={18} />
                    </a>
                    <a 
                      href={speaker.twitter}
                      className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-[#FF0000] hover:bg-[#FF0000] hover:text-white transition-colors"
                    >
                      <Twitter size={18} />
                    </a>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-[#FFD400] mb-2 group-hover:text-white transition-colors">
                    {speaker.name}
                  </h3>
                  <p className="text-[#FFD400] font-semibold mb-1">{speaker.title}</p>
                  <p className="text-gray-400 mb-4">{speaker.company}</p>
                  <div className="border-t border-gray-800 pt-4">
                    <p className="text-sm text-gray-500 mb-2">Speaking on:</p>
                    <p className="text-white font-medium">{speaker.topic}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regular Speakers Grid */}
        <div>
          <h3 data-aos="fade-up" className="text-2xl font-bold text-white text-center mb-12">
            Expert Panel
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {regularSpeakers.map((speaker, index) => (
              <div 
                key={speaker.id}
                data-aos="fade-up" 
                data-aos-delay={index * 100}
                className="group bg-black/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-800 hover:border-[#FFD400]/50 transition-all duration-500 transform hover:scale-105"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={speaker.image} 
                    alt={speaker.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-[#FF0000]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <ExternalLink size={24} className="text-white" />
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <h4 className="text-lg font-bold text-white mb-1 group-hover:text-[#FFD400] transition-colors">
                    {speaker.name}
                  </h4>
                  <p className="text-[#FFD400] text-sm font-semibold mb-1">{speaker.title}</p>
                  <p className="text-gray-500 text-sm mb-3">{speaker.company}</p>
                  <p className="text-gray-400 text-xs">{speaker.topic}</p>
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