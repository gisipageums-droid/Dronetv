import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

export default function UsedBy({ usedByData }) {

  const containerRef = useRef(null);

  // Duplicate companies for seamless looping
  const duplicatedCompanies = [...usedByData.companies, ...usedByData.companies];
  console.log("preview icon", duplicatedCompanies);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrame;
    let position = 0;
    const speed = 0.2; // Adjust speed as needed

    const animate = () => {
      position -= speed;

      // Reset position when scrolled halfway (seamless loop)
      if (Math.abs(position) >= container.scrollWidth / 2) {
        position = 0;
      }

      container.style.transform = `translateX(${position}px)`;
      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  return (
    <section className='py-16 bg-white relative overflow-hidden'>
      <div className='max-w-7xl mx-auto px-4'>
        {/* Title Section */}
        <p className='text-center text-gray-400 text-lg mb-8 text-justify'>
          {usedByData.title}
        </p>

        {/* Companies Section with Auto Scroll */}
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
              console.log("company image", company.image),
              <motion.div
                key={`${company.id || i}-${Math.random()}`}
                className='flex-shrink-0 inline-flex items-center'
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <img
                  src={company.image}
                  alt={company.name}
                  className='h-8 opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-300'
                />

              </motion.div>
            ))}
          </motion.div>

          {/* Gradient fade effects on sides */}
          <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-white to-transparent z-10"></div>
          <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-white to-transparent z-10"></div>
        </div>
      </div>
    </section>
  );
}