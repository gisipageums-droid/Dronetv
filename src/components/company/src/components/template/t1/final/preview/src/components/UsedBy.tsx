import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

const LogoPlaceholder = ({ name }: { name: string }) => (
  <div
    style={{
      height: 40,
      minWidth: 90,
      background: '#f3f4f6',
      borderRadius: 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 14px',
    }}
  >
    <span style={{ color: '#9ca3af', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>
      {name || 'Partner'}
    </span>
  </div>
);

const CompanyLogo = ({ company }) => {
  const hasValidUrl = company.image && /^https?:\/\//.test(company.image);

  if (hasValidUrl) {
    return (
      <div style={{ position: 'relative' }}>
        <img
          src={company.image}
          alt={company.name}
          className="h-8 opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-300"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.style.display = 'none';
            const fallback = img.nextElementSibling as HTMLElement;
            if (fallback) fallback.style.display = 'flex';
          }}
        />
        <div style={{ display: 'none' }}>
          <LogoPlaceholder name={company.name} />
        </div>
      </div>
    );
  }

  return <LogoPlaceholder name={company.name} />;
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