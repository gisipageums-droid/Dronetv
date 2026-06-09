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

const defaultCompanies: Company[] = [
  { id: 1, name: "Company 1", image: "" },
  { id: 2, name: "Company 2", image: "" },
  { id: 3, name: "Company 3", image: "" },
  { id: 4, name: "Company 4", image: "" },
  { id: 5, name: "Company 5", image: "" },
];

const defaultContent: UsedByData = {
  title: "USED BY",
  companies: defaultCompanies,
};

const LogoPlaceholder = ({ name }: { name: string }) => (
  <div
    style={{
      height: 48,
      minWidth: 100,
      background: '#f3f4f6',
      borderRadius: 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 16px',
    }}
  >
    <span style={{ color: '#9ca3af', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>
      {name || 'Partner'}
    </span>
  </div>
);

const CompanyLogo = ({ company }: { company: Company }) => {
  const hasValidUrl = company.image && /^https?:\/\//.test(company.image);

  if (hasValidUrl) {
    return (
      <div style={{ position: 'relative' }}>
        <img
          src={company.image}
          alt={company.name}
          className="h-12 opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-300"
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