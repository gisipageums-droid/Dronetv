import React, { useState } from "react";
import { Edit, Save, X } from "lucide-react";

const AboutSection: React.FC = () => {
  const [editMode, setEditMode] = useState(false);

  const [aboutContent, setAboutContent] = useState({
    heading: "Drone Expo & Conference 2025",
    subText:
      "Join us in Mumbai for the premier Drone Expo & Conference where technology, innovation, and opportunity converge. Explore industry advancements across UAVs, Robotics, AR/VR, Geospatial, and more.",
    features: [
      {
        title: "Business Meeting Lounge",
        description:
          "Engage in key discussions and networking with decision-makers.",
      },
      {
        title: "Drone Expo App",
        description:
          "Navigate the expo with interactive maps, schedules, and exhibitor details.",
      },
      {
        title: "Technical Conference",
        description:
          "Explore trends and advancements in technical sessions from industry leaders.",
      },
      {
        title: "Networking Opportunities",
        description:
          "Foster partnerships with innovators, regulators, and business leaders.",
      },
    ],
    zonesTitle: "Special",
    zonesTitleHighlight: "Zones",
    zonesSubtitle: "Discover specialized areas designed for different aspects of the drone industry.",
    zones: [
      {
        title: "Start-up Zone",
        description:
          "Platform for emerging companies in the drone sector to network, gain insights, and seek investments.",
      },
      {
        title: "Education Zone",
        description:
          "Showcase for institutions offering Remote Pilot Training and drone tech courses to engage potential students.",
      },
      {
        title: "Student Zone",
        description:
          "A space for students to present ideas, learn about the drone industry, and connect with professionals.",
      },
      {
        title: "Innovation Zone",
        description:
          "Hub for groundbreaking drone technologies and concepts, ideal for new product showcases.",
      },
    ],
  });

  const [backupContent, setBackupContent] = useState(aboutContent);

  const handleEditToggle = () => {
    if (!editMode) {
      setBackupContent(aboutContent); // store before edit
    }
    setEditMode(!editMode);
  };

  const handleCancel = () => {
    setAboutContent(backupContent); // restore backup
    setEditMode(false);
  };

  return (
    <section id="about" className="py-20 bg-white">
      <div className="relative container max-w-7xl mx-auto px-4">
        {/* Edit / Save / Cancel */}
        <div className="absolute top-0 right-2 z-30 flex gap-3">
          {editMode ? (
            <>
              <button
                onClick={handleEditToggle}
                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                <Save size={18} /> Save
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                <X size={18} /> Cancel
              </button>
            </>
          ) : (
            <button
              onClick={handleEditToggle}
              className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg border border-white/30 hover:bg-green-600 transition"
            >
              <Edit size={18} /> Edit
            </button>
          )}
        </div>

        {/* Heading */}
        <div className="text-center mb-16">
          {editMode ? (
            <input
              type="text"
              value={aboutContent.heading}
              onChange={(e) =>
                setAboutContent({ ...aboutContent, heading: e.target.value })
              }
              className="text-4xl md:text-5xl font-bold text-black mb-4 px-3 py-2 rounded-md w-full"
            />
          ) : (
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
              {aboutContent.heading}
            </h2>
          )}
          <div className="w-24 h-1 bg-[#FFD400] mx-auto mb-6"></div>

          {editMode ? (
            <textarea
              value={aboutContent.subText}
              onChange={(e) =>
                setAboutContent({ ...aboutContent, subText: e.target.value })
              }
              className="text-gray-600 text-lg max-w-4xl mx-auto leading-relaxed w-full border px-3 py-2 rounded-md"
            />
          ) : (
            <p className="text-gray-600 text-lg max-w-4xl mx-auto leading-relaxed">
              {aboutContent.subText}
            </p>
          )}
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
          {aboutContent.features.map((item, index) => (
            <div
              key={index}
              className="bg-gray-50 p-6 rounded-xl border-[solid] border-[black] border-[1px] shadow-md hover:bg-[#FFD400] hover:text-black transition-all duration-300"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#FF0000] text-white mb-4 text-xl font-bold">
                {item.title.charAt(0).toUpperCase()}
              </div>
              {editMode ? (
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => {
                    const updated = [...aboutContent.features];
                    updated[index].title = e.target.value;
                    setAboutContent({ ...aboutContent, features: updated });
                  }}
                  className="text-xl font-semibold mb-2 px-2 py-1 rounded-md w-full"
                />
              ) : (
                <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
              )}
              {editMode ? (
                <textarea
                  value={item.description}
                  onChange={(e) => {
                    const updated = [...aboutContent.features];
                    updated[index].description = e.target.value;
                    setAboutContent({ ...aboutContent, features: updated });
                  }}
                  className="text-gray-600 w-full px-2 py-1 rounded-md"
                />
              ) : (
                <p className="text-gray-600">{item.description}</p>
              )}
            </div>
          ))}
        </div>

        {/* Zones */}
        <div className="text-center mb-16">
          {editMode ? (
            <>
              <div className="flex items-center justify-center gap-2 mb-4">
                <input
                  type="text"
                  value={aboutContent.zonesTitle}
                  onChange={(e) => setAboutContent({ ...aboutContent, zonesTitle: e.target.value })}
                  className="text-3xl font-bold text-[#FFD400] bg-transparent border-b-2 border-gray-300 focus:border-blue-500 outline-none text-center"
                />
                <input
                  type="text"
                  value={aboutContent.zonesTitleHighlight}
                  onChange={(e) => setAboutContent({ ...aboutContent, zonesTitleHighlight: e.target.value })}
                  className="text-3xl font-bold text-black bg-transparent border-b-2 border-gray-300 focus:border-blue-500 outline-none text-center"
                />
              </div>
              <textarea
                value={aboutContent.zonesSubtitle}
                onChange={(e) => setAboutContent({ ...aboutContent, zonesSubtitle: e.target.value })}
                className="text-gray-600 text-lg max-w-3xl mx-auto bg-transparent border-2 border-gray-300 focus:border-blue-500 outline-none p-2 rounded-md w-full resize-none"
                rows={2}
              />
            </>
          ) : (
            <>
              <h3 className="text-3xl font-bold text-black mb-4">
                <span className="text-[#FFD400]">{aboutContent.zonesTitle}</span> {aboutContent.zonesTitleHighlight}
              </h3>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                {aboutContent.zonesSubtitle}
              </p>
            </>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {aboutContent.zones.map((zone, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-md border-[solid] border-[1px] border-yellow-400 hover:shadow-xl transition-all "
            >
              {editMode ? (
                <input
                  type="text"
                  value={zone.title}
                  onChange={(e) => {
                    const updated = [...aboutContent.zones];
                    updated[index].title = e.target.value;
                    setAboutContent({ ...aboutContent, zones: updated });
                  }}
                  className="text-xl font-semibold text-[#FF0000] mb-2 px-2 py-1 rounded-md w-full"
                />
              ) : (
                <h4 className="text-xl font-semibold text-[#FF0000] mb-2">
                  {zone.title}
                </h4>
              )}
              {editMode ? (
                <textarea
                  value={zone.description}
                  onChange={(e) => {
                    const updated = [...aboutContent.zones];
                    updated[index].description = e.target.value;
                    setAboutContent({ ...aboutContent, zones: updated });
                  }}
                  className="text-gray-700 w-full px-2 py-1 rounded-md"
                />
              ) : (
                <p className="text-gray-700 leading-relaxed">{zone.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
