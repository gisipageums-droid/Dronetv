import React, { useState, useEffect } from "react";
import { Edit, Save, X, Plus, Trash2 } from "lucide-react";

interface Partner {
  header: string;
  image: string;
}

interface SponsorsDataContent {
  title: string;
  titleHighlight: string;
  partners: Partner[];
}

interface SponsorsSectionProps {
  sponsorsData?: SponsorsDataContent;
  onStateChange?: (data: SponsorsDataContent) => void;
}

/** Default fallback content */
const defaultSponsorsContent: SponsorsDataContent = {
  title: "Our",
  titleHighlight: "Partners",
  partners: [
    { header: "Partner Category", image: "/images/partner1.png" },
    { header: "Partner Category", image: "/images/partner2.png" },
    { header: "Partner Category", image: "/images/partner3.png" },
  ],
};

const SponsorsSection: React.FC<SponsorsSectionProps> = ({
  sponsorsData,
  onStateChange,
}) => {
  const [editMode, setEditMode] = useState(false);

  const [sponsorsContent, setSponsorsContent] =
    useState<SponsorsDataContent>(defaultSponsorsContent);

  const [backupContent, setBackupContent] =
    useState<SponsorsDataContent>(defaultSponsorsContent);

  /**
   * ⭐ FIX #1 — Safe Render:
   * Do NOT render until actual data arrives
   * Prevents blank UI caused by empty initial parent state
   **/
  if (!sponsorsData || !sponsorsData.partners) {
    return null;
  }

  /**
   * ⭐ FIX #2 — Apply props only once when real data arrives
   * Prevents overwriting state with empty values during initial load
   */
  useEffect(() => {
    if (
      sponsorsData &&
      sponsorsData.title &&
      sponsorsData.partners.length > 0
    ) {
      setSponsorsContent(sponsorsData);
      setBackupContent(sponsorsData);
    }
  }, [sponsorsData]);

  const handleEditToggle = () => {
    if (editMode && onStateChange) {
      onStateChange(sponsorsContent);
    } else {
      setBackupContent(sponsorsContent);
    }

    setEditMode(!editMode);
  };

  const handleCancel = () => {
    setSponsorsContent(backupContent);
    setEditMode(false);
  };

  const addPartner = () => {
    const updated = {
      ...sponsorsContent,
      partners: [
        ...sponsorsContent.partners,
        { header: "New Partner", image: "/images/partner.png" },
      ],
    };

    setSponsorsContent(updated);
    onStateChange?.(updated);
  };

  const removePartner = (index: number) => {
    const updatedPartners = sponsorsContent.partners.filter(
      (_, i) => i !== index
    );

    const updated = {
      ...sponsorsContent,
      partners: updatedPartners,
    };

    setSponsorsContent(updated);
    onStateChange?.(updated);
  };

  return (
    <section id="sponsors" className="py-20 bg-white relative">
      <div className="container mx-auto px-4 text-center">
        {/* Edit / Save / Cancel */}
        <div className="absolute top-6 right-6 z-30 flex gap-3">
          {editMode ? (
            <>
              <button
                onClick={handleEditToggle}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                <Save size={18} />
                Save
              </button>

              <button
                onClick={handleCancel}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                <X size={18} />
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={handleEditToggle}
              className="flex items-center gap-2 bg-black/70 text-white px-4 py-2 rounded-lg hover:bg-black"
            >
              <Edit size={18} />
              Edit
            </button>
          )}
        </div>

        {editMode && (
          <div className="mb-6">
            <button
              onClick={addPartner}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Plus size={18} />
              Add Partner
            </button>
          </div>
        )}

        {/* Section Title */}
        <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
          {editMode ? (
            <div className="flex gap-2 justify-center">
              <input
                type="text"
                value={sponsorsContent.title}
                onChange={(e) =>
                  setSponsorsContent({
                    ...sponsorsContent,
                    title: e.target.value,
                  })
                }
                className="border px-2 py-1 rounded"
              />
              <input
                type="text"
                value={sponsorsContent.titleHighlight}
                onChange={(e) =>
                  setSponsorsContent({
                    ...sponsorsContent,
                    titleHighlight: e.target.value,
                  })
                }
                className="border px-2 py-1 rounded text-red-600"
              />
            </div>
          ) : (
            <>
              {sponsorsContent.title}{" "}
              <span className="text-red-600">
                {sponsorsContent.titleHighlight}
              </span>
            </>
          )}
        </h2>

        <div className="w-24 h-1 bg-[#FFD400] mx-auto mb-10"></div>

        {/* Partners Grid */}
        <div className="max-w-6xl mx-auto rounded-[28px] bg-white shadow-xl p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-12">
            {sponsorsContent.partners.map((partner, i) => (
              <div key={i} className="relative text-center flex flex-col items-center gap-4">
                {editMode && (
                  <button
                    onClick={() => removePartner(i)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-7 h-7 flex justify-center items-center hover:bg-red-700"
                  >
                    <Trash2 size={14} />
                  </button>
                )}

                {/* EDIT MODE */}
                {editMode ? (
                  <div className="flex flex-col gap-2 w-full">
                    <input
                      type="text"
                      value={partner.header}
                      onChange={(e) => {
                        const list = [...sponsorsContent.partners];
                        list[i].header = e.target.value;
                        setSponsorsContent({
                          ...sponsorsContent,
                          partners: list,
                        });
                      }}
                      className="border px-2 py-1 rounded text-sm"
                    />

                    <input
                      type="text"
                      value={partner.image}
                      onChange={(e) => {
                        const list = [...sponsorsContent.partners];
                        list[i].image = e.target.value;
                        setSponsorsContent({
                          ...sponsorsContent,
                          partners: list,
                        });
                      }}
                      className="border px-2 py-1 rounded text-sm"
                    />
                  </div>
                ) : (
                  <>
                    <h3 className="text-xs sm:text-sm font-semibold uppercase">
                      {partner.header}
                    </h3>
                    <img
                      src={partner.image}
                      alt={partner.header}
                      className="h-20 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='60'%3E%3Crect width='100' height='60' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-size='10' text-anchor='middle'%3EImage Missing%3C/text%3E%3C/svg%3E";
                      }}
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
