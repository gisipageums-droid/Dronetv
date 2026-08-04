import React from "react";
import { Target, Users, Lightbulb, Award } from "lucide-react";

const AboutSection: React.FC = () => {
  const aboutContent = {
    heading: "Drone Expo & Conference 2026",
    subText:
      "Join us in Mumbai for the premier Drone Expo & Conference where technology, innovation, and opportunity converge. Explore industry advancements across UAVs, Robotics, AR/VR, Geospatial, and more.",
    features: [
      {
        icon: <Target size={32} />,
        title: "Business Meeting Lounge",
        description:
          "Engage in key discussions and networking with decision-makers.",
      },
      {
        icon: <Lightbulb size={32} />,
        title: "Drone Expo App",
        description:
          "Navigate the expo with interactive maps, schedules, and exhibitor details.",
      },
      {
        icon: <Award size={32} />,
        title: "Technical Conference",
        description:
          "Explore trends and advancements in technical sessions from industry leaders.",
      },
      {
        icon: <Users size={32} />,
        title: "Networking Opportunities",
        description:
          "Foster partnerships with innovators, regulators, and business leaders.",
      },
    ],
    zones: [
      {
        title: "Young Innovators Zone",
        description:
          "A dedicated space for young minds, students, and emerging innovators to showcase ideas, explore drone technology, and connect with industry leaders shaping the future of UAVs.",
      },
    ],
  };

  return (
    <section id="about" className="py-20 bg-surface-card">
      <div className="relative container max-w-7xl mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-ink mb-4">
            {aboutContent.heading}
          </h2>
          <div className="w-24 h-1 bg-[#F8C400] mx-auto mb-6"></div>
          <p className="text-ink-paragraph text-lg max-w-4xl mx-auto leading-relaxed">
            {aboutContent.subText}
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
          {aboutContent.features.map((item, index) => (
            <div
              key={index}
              className="bg-ink-offwhite p-6 rounded-xl shadow-md hover:bg-[#F8C400] hover:text-ink transition-all duration-300"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#DC2626] text-white mb-4">
                {item.icon}
              </div>
              <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
              <p className="text-ink-paragraph">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Zones */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-ink mb-4">
            <span className="text-[#F8C400]">Specialized Zones</span> to Explore
          </h3>
          <p className="text-ink-paragraph text-lg max-w-3xl mx-auto">
            Discover our dedicated zone for young innovators and future leaders in drone technology.
          </p>
        </div>

        <div className="grid md:grid-cols-1 max-w-2xl mx-auto gap-10">
          {aboutContent.zones.map((zone, index) => (
            <div
              key={index}
              className="bg-surface-card p-6 rounded-2xl shadow-md border border-brand-yellow-soft hover:shadow-xl transition-all"
            >
              <h4 className="text-xl font-semibold text-[#DC2626] mb-2">
                {zone.title}
              </h4>
              <p className="text-ink-paragraph leading-relaxed">{zone.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;