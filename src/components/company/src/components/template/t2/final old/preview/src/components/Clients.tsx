import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "motion/react";

export default function Clients({ clientData }) {
  // Duplicate clients for marquee loop
  const duplicatedClients = [...clientData.clients, ...clientData.clients];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const logoVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.section
      id="clients"
      className="py-20 bg-background theme-transition"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {clientData.headline.title}
          </h2>
          <p className="text-muted-foreground text-lg">
            {clientData.headline.description}
          </p>
        </motion.div>

        {/* Marquee Container */}
        <div className="group w-full overflow-hidden">
          <style>
            {`
              @keyframes marquee {
                0% { transform: translateX(0%); }
                100% { transform: translateX(-50%); }
              }
              .animate-marquee {
                animation: marquee 40s linear infinite;
              }
              .group:hover .animate-marquee {
                animation-play-state: paused;
              }
            `}
          </style>
          <motion.div
            className="flex gap-10 items-start text-center animate-marquee"
            variants={containerVariants}
            whileInView={{opacity:[0,1],y:[-50,0]}}
            transition={{duration:1}}
            viewport={{ once: true }}
          >
            {duplicatedClients.map((client, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center flex-shrink-0 w-32 cursor-pointer"
                variants={logoVariants}
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="w-20 h-20 rounded-full overflow-hidden shadow-md border border-border"
                  whileHover={{
                    borderColor: "var(--color-primary)",
                    boxShadow: "0 10px 25px rgba(250, 204, 21, 0.3)",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <ImageWithFallback
                    src={client.image}
                    alt={`${client.name} logo`}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <motion.div
                  className="mt-3"
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="text-sm font-medium text-card-foreground group-hover:text-primary transition-colors">
                    {client.name}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>


      </div>
    </motion.section>
  );
}