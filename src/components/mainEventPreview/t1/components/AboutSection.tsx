import React from "react";

interface AboutSectionProps {
  aboutData?: {
    heading: string;
    subText: string;
    features: {
      title: string;
      description: string;
    }[];
    zonesTitle: string;
    zonesTitleHighlight: string;
    zonesSubtitle: string;
    zones: {
      title: string;
      description: string;
    }[];
  };
}

const AboutSection: React.FC<AboutSectionProps> = ({ aboutData }) => {
  // Default data structure
  const defaultAboutContent = {
    heading: "demo Event",
    subText: "Create 2-3 sentence event description",
    features: [
      {
        title: "Feature 1",
        description: "Feature description"
      }
    ],
    zonesTitle: "Special",
    zonesTitleHighlight: "Zones",
    zonesSubtitle: "Discover specialized areas designed for different aspects of the event.",
    zones: [
      {
        title: "Zone Title",
        description: "Zone description"
      }
    ]
  };

  // Use prop data or default values
  const aboutContent = aboutData || defaultAboutContent;

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            {aboutContent.heading}
          </h2>
          <div className="w-24 h-1 bg-[#FFD400] mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg max-w-4xl mx-auto leading-relaxed text-justify">
            {aboutContent.subText}
          </p>
        </div>

        {/* Features Section */}
        <div className="mb-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
            {aboutContent.features.map((item, index) => (
              <div
                key={index}
                className="bg-gray-50 p-6 rounded-xl border-[solid] border-[black] border-[1px] shadow-md hover:bg-[#FFD400] hover:text-black transition-all duration-300"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#FF0000] text-white mb-4 text-xl font-bold">
                  {item.title.charAt(0).toUpperCase()}
                </div>
                <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Zones Section */}
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-black mb-4">
            <span className="text-[#FFD400]">{aboutContent.zonesTitle}</span> {aboutContent.zonesTitleHighlight}
          </h3>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto text-justify">
            {aboutContent.zonesSubtitle}
          </p>
        </div>

        <div className="mb-12">
          <div className="grid md:grid-cols-2 gap-10">
            {aboutContent.zones.map((zone, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-md border-[solid] border-[1px] border-yellow-400 hover:shadow-xl transition-all"
              >
                <h4 className="text-xl font-semibold text-[#FF0000] mb-2">
                  {zone.title}
                </h4>
                <p className="text-gray-700 leading-relaxed">{zone.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;