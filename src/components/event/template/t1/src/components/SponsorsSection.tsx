import React from 'react';

const partners = [
  {
    category: 'Supported By',
    logo: 'https://www.droneexpo.in/mailer/FI-1771484813.png',
  },
  {
    category: 'Association Partner',
    logo: 'https://www.droneexpo.in/mailer/FI-1749725856.jpg',
  },
  {
    category: 'Education Partner',
    logo: 'https://www.droneexpo.in/mailer/FI-1739769626.webp',
  },
  {
    category: 'Digital Broadcast Partner',
    logo: 'https://www.droneexpo.in/mailer/FI-1742802212.jpg',
  },
  {
    category: 'Training Partner',
    logo: 'https://www.droneexpo.in/mailer/FI-1742801923.jpg',
  },
  {
    category: 'Training Partner',
    logo: 'https://www.droneexpo.in/mailer/FI-1771484800.png',
  },
  {
    category: 'Media Partner',
    logo: 'https://www.droneexpo.in/mailer/FI-1771498887.png',
  },
  {
    category: 'Organised By',
    logo: 'https://www.droneexpo.in/mailer/FI-1730695201.webp',
  },
  {
    category: 'Associated Event',
    logo: 'https://www.fireindia.net/mailer/FI-1761908291.png',
  },
];

const SponsorsSection: React.FC = () => {
  return (
    <section id="sponsors" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        <h2 data-aos="fade-up" className="text-4xl md:text-5xl font-bold text-black mb-6">
          Our <span className="text-[#FF0000]">Partners</span>
        </h2>
        <div data-aos="fade-up" data-aos-delay="200" className="w-24 h-1 bg-[#FFD400] mx-auto mb-14"></div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {partners.map((partner, index) => (
            <div
              key={index}
              data-aos="zoom-in"
              data-aos-delay={index * 80}
              className="bg-white rounded-2xl shadow-md p-5 flex flex-col items-center justify-center gap-3 hover:shadow-xl transition-all duration-300"
            >
              <img
                src={partner.logo}
                alt={partner.category}
                className="h-16 w-auto object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide text-center">
                {partner.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SponsorsSection;
