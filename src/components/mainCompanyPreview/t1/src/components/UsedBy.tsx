import React from "react";
import { motion } from "framer-motion";

const itemVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
};

interface Company {
  id: number;
  name: string;
  image: string;
}

interface UsedByData {
  title: string;
  companies: Company[];
}

interface UsedByProps {
  usedByData?: UsedByData;
}

// Map well-known company names to stable public logos
const KNOWN_LOGOS: Record<string, string> = {
  "Business Insider": "/logos/BusinessInsider.png",
  "Forbes": "/logos/Forbes.png",
  "TechCrunch": "/logos/TechCrunch.png",
  "NY Times": "/logos/TheNewYorkTimes.png",
  "The New York Times": "/logos/TheNewYorkTimes.png",
  "USA Today": "/logos/USAToday.png",
};

const FALLBACK_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='48'%3E%3Crect width='120' height='48' rx='6' fill='%23f3f4f6'/%3E%3Ctext x='60' y='30' font-family='sans-serif' font-size='12' fill='%239ca3af' text-anchor='middle'%3ELogo%3C/text%3E%3C/svg%3E";

const defaultCompanies: Company[] = [
  { id: 1, name: "Business Insider", image: "" },
  { id: 2, name: "Forbes", image: "" },
  { id: 3, name: "TechCrunch", image: "" },
  { id: 4, name: "NY Times", image: "" },
  { id: 5, name: "USA Today", image: "" },
];

const defaultContent: UsedByData = {
  title: "USED BY",
  companies: defaultCompanies,
};

const CompanyLogo = ({ company }: { company: Company }) => {
  // Prefer known stable logo, then stored image if non-empty and not a stale /assets/ hash path
  const stableUrl = KNOWN_LOGOS[company.name];
  const storedIsStable = company.image && !company.image.startsWith('/assets/');
  const src = stableUrl || (storedIsStable ? company.image : null);

  if (src) {
    return (
      <img
        src={src}
        alt={company.name}
        className="h-12 opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-300"
        onError={(e) => {
          (e.target as HTMLImageElement).src = FALLBACK_SVG;
        }}
      />
    );
  }

  return (
    <img
      src={FALLBACK_SVG}
      alt={company.name}
      className="h-12 opacity-60"
    />
  );
};

const UsedBy: React.FC<UsedByProps> = ({ usedByData }) => {
  const content = usedByData || defaultContent;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial="hidden" animate="visible" variants={itemVariants}>
          <p className="text-center text-gray-400 text-lg mb-8">
            {content.title}
          </p>
        </motion.div>

        <motion.div
          className="w-full overflow-hidden relative py-4"
          initial="hidden"
          animate="visible"
          variants={itemVariants}
        >
          <style>
            {`
              @keyframes scroll {
                from { transform: translateX(0); }
                to { transform: translateX(calc(-50% - 1rem)); }
              }
              .scroll-container {
                display: flex;
                width: max-content;
                animation: scroll 20s linear infinite;
              }
              .scroll-container:hover {
                animation-play-state: paused;
              }
            `}
          </style>

          <div className="relative flex overflow-x-hidden">
            <div className="scroll-container">
              {content.companies.map((company, i) => (
                <motion.div
                  key={`first-${company.id}-${i}`}
                  className="flex-shrink-0 mx-6"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <CompanyLogo company={company} />
                </motion.div>
              ))}
              {content.companies.map((company, i) => (
                <motion.div
                  key={`second-${company.id}-${i}`}
                  className="flex-shrink-0 mx-6"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <CompanyLogo company={company} />
                </motion.div>
              ))}
            </div>
          </div>

          <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default UsedBy;