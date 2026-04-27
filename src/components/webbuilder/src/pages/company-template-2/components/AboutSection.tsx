import React from 'react';
import { Target, Eye, Award, Users } from 'lucide-react';

const AboutSection: React.FC = () => {
  const values = [
    {
      icon: <Target size={32} />,
      title: 'Mission',
      description: 'To revolutionize industries through cutting-edge drone technology and unparalleled service excellence.'
    },
    {
      icon: <Eye size={32} />,
      title: 'Vision',
      description: 'To be the global leader in autonomous flight systems, shaping the future of aerial innovation.'
    },
    {
      icon: <Award size={32} />,
      title: 'Excellence',
      description: 'Delivering superior quality, reliability, and performance in every drone solution we create.'
    },
    {
      icon: <Users size={32} />,
      title: 'Partnership',
      description: 'Building lasting relationships with clients through trust, innovation, and exceptional support.'
    }
  ];

  return (
    <section id="about" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 data-aos="fade-up" className="text-4xl md:text-6xl font-bold text-[#FFD400] mb-4">
            About <span className="text-white">DroneFlight</span>
          </h2>
          <div data-aos="fade-up" data-aos-delay="200" className="w-32 h-1 bg-[#FFD400] mx-auto mb-6"></div>
          <p data-aos="fade-up" data-aos-delay="400" className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
            Leading the drone revolution with innovative technology solutions that transform industries and empower businesses to reach new heights.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Image */}
          <div data-aos="fade-right">
            <div className="relative group">
              <img 
                src="https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Advanced Drone Technology"
                className="w-full h-96 object-cover rounded-2xl shadow-2xl group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-[#FFD400]/30">
                  <h3 className="text-[#FFD400] font-bold text-lg mb-2">Next-Gen Technology</h3>
                  <p className="text-gray-300 text-sm">Pioneering autonomous flight systems with AI-powered navigation and advanced sensor integration.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div data-aos="fade-left">
            <div className="space-y-8">
              <div>
                <h3 className="text-3xl font-bold text-white mb-6">
                  Pioneering Aerial Innovation Since <span className="text-[#FF0000]">2018</span>
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  DroneFlight stands at the forefront of unmanned aerial vehicle technology, delivering 
                  cutting-edge solutions that redefine what's possible in the skies. Our expertise spans 
                  defense, agriculture, surveillance, and custom industrial applications.
                </p>
                <p className="text-gray-300 text-lg leading-relaxed">
                  With a team of world-class engineers and visionaries, we've successfully deployed 
                  over 10,000 drone systems globally, serving Fortune 500 companies and government 
                  agencies across 25+ countries.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gray-900/50 rounded-lg border border-gray-800 hover:border-[#FFD400]/50 transition-colors">
                  <div className="text-2xl font-bold text-[#FF0000] mb-1">10K+</div>
                  <div className="text-sm text-gray-400">Drones Deployed</div>
                </div>
                <div className="text-center p-4 bg-gray-900/50 rounded-lg border border-gray-800 hover:border-[#FFD400]/50 transition-colors">
                  <div className="text-2xl font-bold text-[#FF0000] mb-1">25+</div>
                  <div className="text-sm text-gray-400">Countries Served</div>
                </div>
                <div className="text-center p-4 bg-gray-900/50 rounded-lg border border-gray-800 hover:border-[#FFD400]/50 transition-colors">
                  <div className="text-2xl font-bold text-[#FF0000] mb-1">500+</div>
                  <div className="text-sm text-gray-400">Enterprise Clients</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div 
              key={index}
              data-aos="fade-up" 
              data-aos-delay={index * 200}
              className="group bg-gray-900/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-800 hover:border-[#FFD400]/50 transition-all duration-500 hover:transform hover:scale-105"
            >
              <div className="w-16 h-16 bg-[#FF0000] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#FFD400] group-hover:text-black transition-all duration-300">
                <div className="text-white group-hover:text-black transition-colors">
                  {value.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold text-[#FFD400] mb-4 text-center group-hover:text-white transition-colors">
                {value.title}
              </h3>
              <p className="text-gray-400 text-center leading-relaxed group-hover:text-gray-300 transition-colors">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;