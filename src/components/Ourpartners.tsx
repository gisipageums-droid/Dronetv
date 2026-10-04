import React from "react";
import { PARTNER_LOGO_SLUGS, partnerLogoPath, partnerName } from "../lib/partners";

const OurPartners = () => (
  <section className="py-20 bg-brand-yellow-soft">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-black text-ink tracking-tight">
          Our Partners
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-brand-yellow to-brand-gold mx-auto rounded-full mt-4"></div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-5">
        {PARTNER_LOGO_SLUGS.map((slug) => {
          const name = partnerName(slug);
          return (
            <div
              key={slug}
              className="bg-surface-card rounded-[20px] border border-surface-cardborder shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col items-center justify-center gap-3 p-5 h-36 sm:h-40"
            >
              {/* Fixed-size wrapper (not just max-h/max-w on the <img>
              itself) so a wide, short partner logo gets a real bounding box
              to center within instead of the card's own flex sizing, which
              could push part of a logo outside the visible card. */}
              <div className="w-full h-16 sm:h-20 flex items-center justify-center">
                <img
                  src={partnerLogoPath(slug)}
                  alt={name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <p className="text-xs font-semibold text-ink-charcoal text-center line-clamp-2">{name}</p>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

export default OurPartners;
