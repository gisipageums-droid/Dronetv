import React from "react";

interface Partner {
  id: string;
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
  userId?: string;
}

const defaultSponsorsContent: SponsorsDataContent = {
  title: "Our",
  titleHighlight: "Partners",
  partners: [
    { id: "1", header: "Partner Category", image: "/images/partner1.png" },
    { id: "2", header: "Partner Category", image: "/images/partner2.png" },
    { id: "3", header: "Partner Category", image: "/images/partner3.png" },
  ],
};

const SponsorsSection: React.FC<SponsorsSectionProps> = ({
  sponsorsData,
  userId,
}) => {
  // Use prop data or default values
  const sponsorsContent = sponsorsData || defaultSponsorsContent;

  return (
    <section id="sponsors" className="py-20 bg-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
          {sponsorsContent.title} <span className="text-red-600">{sponsorsContent.titleHighlight}</span>
        </h2>

        <div className="w-24 h-1 bg-[#FFD400] mx-auto mb-10"></div>

        <div className="max-w-6xl mx-auto rounded-[28px] bg-white shadow-xl p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-12">
            {sponsorsContent.partners.map((partner) => (
              <div key={partner.id} className="text-center flex flex-col items-center gap-4">
                <h3 className="text-xs sm:text-sm font-semibold uppercase">{partner.header}</h3>
                <img
                  src={partner.image}
                  alt={partner.header}
                  className="h-20 object-contain rounded-[8px]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='60'%3E%3Crect width='100' height='60' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-size='10' text-anchor='middle'%3EImage Missing%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SponsorsSection;