import React from 'react';
import { ExternalLink } from 'lucide-react';

const ExhibitorsSection: React.FC = () => {
  const exhibitors = [
    {
      name: 'AeroTech Dynamics',
      logo: 'https://images.pexels.com/photos/1851415/pexels-photo-1851415.jpeg?auto=compress&cs=tinysrgb&w=200',
      category: 'Manufacturing',
      description: 'Leading manufacturer of commercial and industrial drone systems.',
      website: '#',
      booth: 'A-101'
    },
    {
      name: 'SkyVision Systems',
      logo: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=200',
      category: 'Software',
      description: 'AI-powered flight control and navigation software solutions.',
      website: '#',
      booth: 'B-205'
    },
    {
      name: 'DroneFlow Corp',
      logo: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=200',
      category: 'Services',
      description: 'Professional drone services for mapping, inspection, and delivery.',
      website: '#',
      booth: 'C-150'
    },
    {
      name: 'Future Flight Labs',
      logo: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=200',
      category: 'Research',
      description: 'Cutting-edge research in autonomous flight and swarm intelligence.',
      website: '#',
      booth: 'D-075'
    },
    {
      name: 'Autonomous Systems Inc',
      logo: 'https://images.pexels.com/photos/1310522/pexels-photo-1310522.jpeg?auto=compress&cs=tinysrgb&w=200',
      category: 'Hardware',
      description: 'Advanced sensors and hardware components for UAV systems.',
      website: '#',
      booth: 'E-320'
    },
    {
      name: 'NextGen Aviation',
      logo: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=200',
      category: 'Innovation',
      description: 'Urban air mobility and next-generation aircraft development.',
      website: '#',
      booth: 'F-180'
    },
    {
      name: 'PropTech Solutions',
      logo: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=200',
      category: 'Components',
      description: 'High-performance propellers and motor systems for drones.',
      website: '#',
      booth: 'G-245'
    },
    {
      name: 'CloudNav Systems',
      logo: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=200',
      category: 'Cloud',
      description: 'Cloud-based fleet management and data analytics platforms.',
      website: '#',
      booth: 'H-110'
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Manufacturing': return 'bg-[#DC2626] text-white';
      case 'Software': return 'bg-[#F8C400] text-ink';
      case 'Services': return 'bg-status-info text-white';
      case 'Research': return 'bg-brand-gold text-white';
      case 'Hardware': return 'bg-status-success text-white';
      case 'Innovation': return 'bg-status-warning text-white';
      case 'Components': return 'bg-status-info text-white';
      case 'Cloud': return 'bg-status-info text-white';
      default: return 'bg-ink-caption text-white';
    }
  };

  return (
    <section id="exhibitors" className="py-20 bg-ink">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 data-aos="fade-up" className="text-4xl md:text-6xl font-bold text-[#F8C400] mb-4">
            Our <span className="text-white">Exhibitors</span>
          </h2>
          <div data-aos="fade-up" data-aos-delay="200" className="w-32 h-1 bg-[#F8C400] mx-auto mb-6"></div>
          <p data-aos="fade-up" data-aos-delay="400" className="text-ink-light text-lg max-w-3xl mx-auto">
            Discover innovative products and services from leading companies in the drone industry.
          </p>
        </div>

        {/* Exhibitors Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {exhibitors.map((exhibitor, index) => (
            <div 
              key={index}
              data-aos="fade-up" 
              data-aos-delay={index * 100}
              className="group bg-ink/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-ink-charcoal hover:border-[#F8C400]/50 transition-all duration-500 transform hover:scale-105"
            >
              {/* Logo */}
              <div className="relative h-32 bg-white/5 flex items-center justify-center p-4">
                <img 
                  src={exhibitor.logo} 
                  alt={exhibitor.name}
                  className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                />
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(exhibitor.category)}`}>
                    {exhibitor.category}
                  </span>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-white group-hover:text-[#F8C400] transition-colors">
                    {exhibitor.name}
                  </h3>
                  <span className="text-[#DC2626] font-semibold text-sm">
                    {exhibitor.booth}
                  </span>
                </div>
                
                <p className="text-ink-caption text-sm mb-4 leading-relaxed">
                  {exhibitor.description}
                </p>
                
                <a 
                  href={exhibitor.website}
                  className="inline-flex items-center gap-2 text-[#F8C400] hover:text-white transition-colors text-sm font-semibold"
                >
                  <span>Visit Booth</span>
                  <ExternalLink size={14} />
                </a>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#DC2626]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Floor Plan CTA */}
        <div data-aos="fade-up" data-aos-delay="800" className="text-center">
          <div className="bg-ink/50 backdrop-blur-sm rounded-3xl p-12 max-w-3xl mx-auto border border-ink-charcoal">
            <h3 className="text-3xl font-bold text-white mb-4">
              Explore the Exhibition Floor
            </h3>
            <p className="text-ink-caption mb-8 text-lg">
              Navigate through 100+ exhibitor booths showcasing the latest in drone technology, 
              from hardware innovations to software solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-[#DC2626] hover:bg-[#DC2626]/90 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
                Download Floor Plan
              </button>
              <button className="border-2 border-[#F8C400] text-[#F8C400] hover:bg-[#F8C400] hover:text-ink px-8 py-4 rounded-full font-semibold transition-all duration-300">
                Book Your Booth
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div data-aos="fade-up" data-aos-delay="1000" className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-[#DC2626] mb-2">100+</div>
            <div className="text-ink-caption">Exhibitors</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#DC2626] mb-2">25+</div>
            <div className="text-ink-caption">Countries</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#DC2626] mb-2">50+</div>
            <div className="text-ink-caption">Product Launches</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#DC2626] mb-2">10K+</div>
            <div className="text-ink-caption">Sq Ft Exhibition</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExhibitorsSection;