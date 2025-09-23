import { motion } from "motion/react";
import BusinessInsider from "../public/images/logos/BusinessInsider.png";
import Forbes from "../public/images/logos/Forbes.png";
import TechCrunch from "../public/images/logos/TechCrunch.png";
import TheNewYorkTimes from "../public/images/logos/TheNewYorkTimes.png";
import USAToday from "../public/images/logos/USAToday.png";

const companies = [
  { image: BusinessInsider, name: "Business Insider" },
  { image: Forbes, name: "Forbes" },
  { image: TechCrunch, name: "TechCrunch" },
  { image: TheNewYorkTimes, name: "NY Times" },
  { image: USAToday, name: "USA Today" },
];

export default function UsedBy() {
  // Duplicate companies for seamless looping
  const duplicatedCompanies = [...companies, ...companies];
  
  return (
    <section className='py-16 bg-white'>
      <div className='max-w-7xl mx-auto px-4'>
        <p className='text-center text-gray-400 text-lg mb-8'>USED BY</p>
        
        {/* Marquee Container */}
        <div className="w-full overflow-hidden relative">
          <style>
            {`
              @keyframes marquee {
                0% { transform: translateX(0%); }
                100% { transform: translateX(-50%); }
              }
              .animate-marquee {
                animation: marquee 30s linear infinite;
              }
              .hover-pause:hover .animate-marquee {
                animation-play-state: paused;
              }
            `}
          </style>
          
          <div className="hover-pause">
            <motion.div 
              className="flex gap-12 items-center animate-marquee"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {duplicatedCompanies.map((c, i) => (
                <motion.div 
                  key={i} 
                  className="flex-shrink-0"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <img
                    src={c.image}
                    alt={c.name}
                    className='h-8 opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-300'
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
          
          {/* Gradient fade effects on sides */}
          <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-white to-transparent z-10"></div>
          <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-white to-transparent z-10"></div>
        </div>
      </div>
    </section>
  );
}