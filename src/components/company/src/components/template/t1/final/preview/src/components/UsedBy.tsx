import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

const KNOWN_LOGOS: Record<string, string> = {
  "Business Insider": "/logos/BusinessInsider.png",
  "Forbes": "/logos/Forbes.png",
  "TechCrunch": "/logos/TechCrunch.png",
  "NY Times": "/logos/TheNewYorkTimes.png",
  "The New York Times": "/logos/TheNewYorkTimes.png",
  "USA Today": "/logos/USAToday.png",
};

const FALLBACK_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='48'%3E%3Crect width='120' height='48' rx='6' fill='%23f3f4f6'/%3E%3Ctext x='60' y='30' font-family='sans-serif' font-size='12' fill='%239ca3af' text-anchor='middle'%3ELogo%3C/text%3E%3C/svg%3E";

const CompanyLogo = ({ company }) => {
  const stableUrl = KNOWN_LOGOS[company.name];
  const storedIsStable = company.image && !company.image.startsWith('/assets/');
  const src = stableUrl || (storedIsStable ? company.image : null);

  return (
    <img
      src={src || FALLBACK_SVG}
      alt={company.name}
      className="h-8 opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-300"
      onError={(e) => {
        (e.target as HTMLImageElement).src = FALLBACK_SVG;
      }}
    />
  );
};

export default function UsedBy({ usedByData }) {
  const containerRef = useRef(null);
  const duplicatedCompanies = [...usedByData.companies, ...usedByData.companies];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrame;
    let position = 0;
    const speed = 1;

    const animate = () => {
      position -= speed;
      if (Math.abs(position) >= container.scrollWidth / 2) {
        position = 0;
      }
      container.style.transform = `translateX(${position}px)`;
      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <section className='py-16 bg-white relative overflow-hidden'>
      <div className='max-w-7xl mx-auto px-4'>
        <p className='text-center text-gray-400 text-lg mb-8'>
          {usedByData.title}
        </p>

        <div className="relative w-full overflow-hidden">
          <motion.div
            ref={containerRef}
            className="flex gap-12 items-center whitespace-nowrap"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {duplicatedCompanies.map((company, i) => (
              <motion.div
                key={`${company.id || i}-${i}`}
                className='flex-shrink-0 inline-flex items-center'
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <CompanyLogo company={company} />
              </motion.div>
            ))}
          </motion.div>

          <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-white to-transparent z-10"></div>
          <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-white to-transparent z-10"></div>
        </div>
      </div>
    </section>
  );
}