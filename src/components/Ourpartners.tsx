import React from "react";

const PARTNER_LOGOS = [
  "telangana-govt", "andhra-govt", "odisha-govt", "jharkhand-govt", "telangana-police", "ap-police",
  "construction-skill-dev", "ncc-urban", "pioneer", "corteva", "apgenco", "siri-sampada",
  "aparna", "vensa", "ctrls", "vensa-breeze", "dsr-sr", "vpr",
  "vasavi", "rajapushpa", "vamsiram", "ameya", "my-home-avatar", "sunyuga",
  "aarvi", "aspire-spaces", "eesha", "pristine-properties", "margana", "botanika",
];

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
        {PARTNER_LOGOS.map((slug) => {
          const name = slug
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");
          return (
            <div
              key={slug}
              className="bg-[#f1ee8e] rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col items-center justify-center gap-2 p-4 h-32 sm:h-36"
            >
              {/* Fixed-size wrapper (not just max-h/max-w on the <img>
              itself) so a wide, short partner logo gets a real bounding box
              to center within instead of the card's own flex sizing, which
              could push part of a logo outside the visible card. */}
              <div className="w-full h-16 sm:h-20 flex items-center justify-center">
                <img
                  src={`/images/partners/${slug}.png`}
                  alt={name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <p className="text-xs font-semibold text-ink text-center line-clamp-2">{name}</p>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

export default OurPartners;
