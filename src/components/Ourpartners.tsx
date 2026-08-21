import React from "react";

const PARTNER_LOGOS = [
  "telangana-govt", "andhra-govt", "odisha-govt", "jharkhand-govt", "telangana-police", "ap-police",
  "construction-skill-dev", "ncc-urban", "pioneer", "corteva", "apgenco", "siri-sampada",
  "aparna", "vensa", "ctrls", "vensa-breeze", "dsr-sr", "vpr",
  "vasavi", "rajapushpa", "vamsiram", "ameya", "my-home-avatar", "sunyuga",
  "aarvi", "aspire-spaces", "eesha", "pristine-properties", "margana", "botanika",
];

const OurPartners = () => (
  <section className="py-20 bg-surface-main">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-black text-ink tracking-tight">
          Our Partners
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-brand-yellow to-brand-gold mx-auto rounded-full mt-4"></div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-5">
        {PARTNER_LOGOS.map((slug) => (
          <div
            key={slug}
            className="bg-surface-card border border-surface-cardborder rounded-2xl shadow-sm hover:shadow-md transition-shadow flex items-center justify-center p-4 h-24 sm:h-28"
          >
            <img
              src={`/images/partners/${slug}.png`}
              alt={slug.replace(/-/g, " ")}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default OurPartners;
