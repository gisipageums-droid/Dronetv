import React, { useState } from 'react';
import { Edit, Save, X } from 'lucide-react';

const SponsorsSection: React.FC = () => {
  const [editMode, setEditMode] = useState(false);

  const [sponsorsContent, setSponsorsContent] = useState({
    title: "Our",
    titleHighlight: "Partners",
    partners: [
      {header:"KNOWLEDGE PARTNERS",image:"/images/knowledge.png"},
      {header:"EDUCATION PARTNER",image:"/images/ASSOCIATIONPARTNER2.png"},
      {header:"DIGITAL BROADCAST PARTNER",image:"/images/ASSOCIATIONPARTNER3.png"},
      {header:"TRAINING PARTNER",image:"/images/ASSOCIATIONPARTNER4.png"},
      {header:"ASSOCIATION PARTNER",image:"/images/ASSOCIATIONPARTNER5.png"},
    ]
  });

  const [backupContent, setBackupContent] = useState(sponsorsContent);

  const handleEditToggle = () => {
    if (!editMode) {
      setBackupContent(sponsorsContent);
    }
    setEditMode(!editMode);
  };

  const handleCancel = () => {
    setSponsorsContent(backupContent);
    setEditMode(false);
  };
  return (
    <section id="sponsors" className="py-20 bg-white relative">
      <div className="container mx-auto px-4 text-center">
        {/* Edit/Save/Cancel Buttons */}
        <div className="absolute top-6 right-6 z-30 flex gap-3">
          {editMode ? (
            <>
              <button
                onClick={handleEditToggle}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
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
              className="flex items-center gap-2 bg-black/60 text-white px-4 py-2 rounded-lg border border-white/30 hover:bg-black/80 transition"
            >
              <Edit size={18} /> Edit
            </button>
          )}
        </div>

        {/* Title */}
        <h2 data-aos="fade-up" className="text-4xl md:text-5xl font-bold text-black mb-6">
          {editMode ? (
            <div className="flex gap-2 justify-center items-center">
              <input
                type="text"
                value={sponsorsContent.title}
                onChange={(e) =>
                  setSponsorsContent({ ...sponsorsContent, title: e.target.value })
                }
                className="bg-white text-black px-2 py-1 rounded-md border border-gray-300"
              />
              <input
                type="text"
                value={sponsorsContent.titleHighlight}
                onChange={(e) =>
                  setSponsorsContent({ ...sponsorsContent, titleHighlight: e.target.value })
                }
                className="bg-white text-red-600 px-2 py-1 rounded-md border border-gray-300"
              />
            </div>
          ) : (
            <>
              {sponsorsContent.title} <span className="text-[#FF0000]">{sponsorsContent.titleHighlight}</span>
            </>
          )}
        </h2>
        <div data-aos="fade-up" data-aos-delay="200" className="w-24 h-1 bg-[#FFD400] mx-auto mb-10"></div>

        <div data-aos="zoom-in" data-aos-delay="400" className="max-w-6xl mx-auto rounded-[28px] bg-white shadow-xl p-6 md:p-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-12 items-center">
            {sponsorsContent.partners.map((partner, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-4">
                {editMode ? (
                  <div className="flex flex-col gap-2 w-full">
                    <input
                      type="text"
                      value={partner.header}
                      onChange={(e) => {
                        const newPartners = [...sponsorsContent.partners];
                        newPartners[i] = { ...partner, header: e.target.value };
                        setSponsorsContent({ ...sponsorsContent, partners: newPartners });
                      }}
                      className="bg-white text-black px-2 py-1 rounded-md border border-gray-300 text-sm"
                    />
                    <input
                      type="text"
                      value={partner.image}
                      onChange={(e) => {
                        const newPartners = [...sponsorsContent.partners];
                        newPartners[i] = { ...partner, image: e.target.value };
                        setSponsorsContent({ ...sponsorsContent, partners: newPartners });
                      }}
                      placeholder="Image URL"
                      className="bg-white text-black px-2 py-1 rounded-md border border-gray-300 text-sm"
                    />
                  </div>
                ) : (
                  <>
                    <h3 className="text-xs sm:text-sm font-semibold tracking-wide text-gray-800 uppercase">{partner.header}</h3>
                    <img
                      src={partner.image}
                      alt={partner.header}
                      className="mx-auto h-14 sm:h-16 md:h-20 w-auto object-contain"
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SponsorsSection;
