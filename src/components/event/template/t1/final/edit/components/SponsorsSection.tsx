import React from 'react';

const SponsorsSection: React.FC = () => {
  let obj=[

    {header:"KNOWLEDGE PARTNERS",image:"/images/knowledge.png"},
    {header:"EDUCATION PARTNER",image:"/images/ASSOCIATIONPARTNER2.png"},
    {header:"DIGITAL BROADCAST PARTNER",image:"/images/ASSOCIATIONPARTNER3.png"},
    {header:"TRAINING PARTNER",image:"/images/ASSOCIATIONPARTNER4.png"},
    {header:"ASSOCIATION PARTNER",image:"/images/ASSOCIATIONPARTNER5.png"},
  ]
  return (
    <section id="sponsors" className="py-20 bg-white">
      <div className="container mx-auto px-4 text-center">
        <h2 data-aos="fade-up" className="text-4xl md:text-5xl font-bold text-black mb-6">
          Our <span className="text-[#FF0000]">Partners </span>
        </h2>
        <div data-aos="fade-up" data-aos-delay="200" className="w-24 h-1 bg-[#FFD400] mx-auto mb-10"></div>

        <div data-aos="zoom-in" data-aos-delay="400" className="max-w-6xl mx-auto rounded-[28px] bg-white shadow-xl p-6 md:p-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-12 items-center">
            {obj.map((v, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-4">
                <h3 className="text-xs sm:text-sm font-semibold tracking-wide text-gray-800 uppercase">{v.header}</h3>
                <img
                  src={v.image}
                  alt={v.header}
                  className="mx-auto h-14 sm:h-16 md:h-20 w-auto object-contain"
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
