import React from "react";
import { motion } from "framer-motion";

const itemVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
};

// Default placeholder image
const DEFAULT_PLACEHOLDER_IMAGE = "/placeholder-company-logo.png";

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

// Default companies
const defaultCompanies: Company[] = [
  { id: 1, name: "Company 1", image: DEFAULT_PLACEHOLDER_IMAGE },
  { id: 2, name: "Company 2", image: DEFAULT_PLACEHOLDER_IMAGE },
  { id: 3, name: "Company 3", image: DEFAULT_PLACEHOLDER_IMAGE },
  { id: 4, name: "Company 4", image: DEFAULT_PLACEHOLDER_IMAGE },
  { id: 5, name: "Company 5", image: DEFAULT_PLACEHOLDER_IMAGE },
];

const defaultContent: UsedByData = {
  title: "USED BY",
  companies: defaultCompanies,
};

const UsedBy: React.FC<UsedByProps> = ({ usedByData }) => {
  const content = usedByData || defaultContent;

  // Safe image source
  const getImageSrc = (image: string) => {
    return image && image !== DEFAULT_PLACEHOLDER_IMAGE
      ? image
      : DEFAULT_PLACEHOLDER_IMAGE;
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Title Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={itemVariants}
        >
          <p className="text-center text-gray-400 text-lg mb-8">
            {content.title}
          </p>
        </motion.div>

        {/* Companies Section - Auto-scroll animation */}
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
              {/* First set of logos */}
              {content.companies.map((company, i) => (
                <motion.div
                  key={`first-${company.id}-${i}`}
                  className="flex-shrink-0 mx-6"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <img
                    src={getImageSrc(company.image)}
                    alt={company.name}
                    className="h-12 opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_PLACEHOLDER_IMAGE;
                    }}
                  />
                </motion.div>
              ))}
              {/* Duplicate set for seamless scrolling */}
              {content.companies.map((company, i) => (
                <motion.div
                  key={`second-${company.id}-${i}`}
                  className="flex-shrink-0 mx-6"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <img
                    src={getImageSrc(company.image)}
                    alt={company.name}
                    className="h-12 opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_PLACEHOLDER_IMAGE;
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Gradient Overlays */}
          <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default UsedBy;