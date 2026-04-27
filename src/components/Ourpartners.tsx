import React from "react";

const OurPartners = () => (
  <section className="py-20 bg-yellow-300 min-h-[50vh] flex flex-col items-center justify-center">
    <h2 className="text-4xl md:text-5xl font-black text-black mb-10 tracking-tight">
      Our Partners
    </h2>
    <div className="max-w-3xl w-full mx-auto rounded-3xl overflow-hidden shadow-2xl border-2 border-black/10 bg-[#f1ee8e] flex items-center justify-center">
      <img
        src="/images/partners.jpg" // Change path as needed
        alt="Partner Banner"
        className="w-full h-72 md:h-96 object-contain"
        style={{ background: "transparent" }}
      />
    </div>
  </section>
);

export default OurPartners;
