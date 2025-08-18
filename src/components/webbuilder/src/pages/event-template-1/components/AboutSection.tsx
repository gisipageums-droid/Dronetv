import React from 'react';
import { Target, Users, Lightbulb, Award } from 'lucide-react';

const AboutSection: React.FC = () => {
  const zones = [
    {
      title: 'Start-up Zone',
      description:
        'Platform for emerging companies in the drone sector to network, gain insights, and seek investments.',
    },
    {
      title: 'Education Zone',
      description:
        'Showcase for institutions offering Remote Pilot Training and drone tech courses to engage potential students.',
    },
    {
      title: 'Student Zone',
      description:
        'A space for students to present ideas, learn about the drone industry, and connect with professionals.',
    },
    {
      title: 'Innovation Zone',
      description:
        'Hub for groundbreaking drone technologies and concepts, ideal for new product showcases.',
    },
  ];

  const features = [
    {
      icon: <Target size={32} />, title: 'Business Meeting Lounge',
      description: 'Engage in key discussions and networking with decision-makers.'
    },
    {
      icon: <Lightbulb size={32} />, title: 'Drone Expo App',
      description: 'Navigate the expo with interactive maps, schedules, and exhibitor details.'
    },
    {
      icon: <Award size={32} />, title: 'Technical Conference',
      description: 'Explore trends and advancements in technical sessions from industry leaders.'
    },
    {
      icon: <Users size={32} />, title: 'Networking Opportunities',
      description: 'Foster partnerships with innovators, regulators, and business leaders.'
    },
  ];

  return (
   <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Drone <span className="text-[#FF0000]">Expo & Conference 2025</span>
          </h2>
          <div className="w-24 h-1 bg-[#FFD400] mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg max-w-4xl mx-auto leading-relaxed">
            Join us in Mumbai for the premier Drone Expo & Conference where technology, innovation, and opportunity converge.
            Explore industry advancements across UAVs, Robotics, AR/VR, Geospatial, and more.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
          {features.map((item, index) => (
            <div
              key={index}
              className="bg-gray-50 p-6 rounded-xl shadow-md hover:bg-[#FFD400] hover:text-black transition-all duration-300"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#FF0000] text-white mb-4">
                {item.icon}
              </div>
              <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
              <p className="text-gray-600 group-hover:text-black/80">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-black mb-4">
            <span className="text-[#FFD400]">Specialized Zones</span> to Explore
          </h3>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Discover dynamic pavilions focused on start-ups, education, students, and innovation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {zones.map((zone, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-md border border-yellow-100 hover:shadow-xl transition-all"
            >
              <h4 className="text-xl font-semibold text-[#FF0000] mb-2">{zone.title}</h4>
              <p className="text-gray-700 leading-relaxed">{zone.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
