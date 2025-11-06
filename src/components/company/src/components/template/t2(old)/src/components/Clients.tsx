import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "motion/react";
import { Button } from "./ui/button";

export default function Clients() {
  const [isEditing, setIsEditing] = useState(false);

  const [headline, setHeadline] = useState({
    title: "Our Clients",
    description:
      "We're proud to collaborate with forward-thinking companies worldwide.",
  });

  const [clients, setClients] = useState([
    {
      name: "TechnoCore Solutions",
      image:
        "https://images.unsplash.com/photo-1662052955098-042b46e60c2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
    },
    {
      name: "GlobalVenture Inc",
      image:
        "https://images.unsplash.com/photo-1551263640-1c007852f616?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
    },
    {
      name: "InnovateBrand Co",
      image:
        "https://images.unsplash.com/photo-1618588429012-0559f1cbc5aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
    },
    {
      name: "FutureWorks Ltd",
      image:
        "https://images.unsplash.com/photo-1746047420047-03fc7a9b9226?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
    },
    {
      name: "NextGen Systems",
      image:
        "https://images.unsplash.com/photo-1712159018726-4564d92f3ec2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
    },
    {
      name: "ProBusiness Group",
      image:
        "https://images.unsplash.com/photo-1666790676906-0295230c121d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
    },
    {
      name: "Quantum Leap",
      image:
        "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
    },
  ]);

  const [stats, setStats] = useState([
    { value: "50+", label: "Trusted Partners" },
    { value: "25+", label: "Countries Served" },
    { value: "98%", label: "Client Satisfaction" },
    { value: "5+", label: "Years Partnership" },
  ]);

  // Handlers for clients
  const updateClient = (idx, field, value) => {
    setClients((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, [field]: value } : c))
    );
  };
  const removeClient = (idx) => {
    setClients((prev) => prev.filter((_, i) => i !== idx));
  };
  const addClient = () => {
    setClients((prev) => [...prev, { name: "New Client", image: "" }]);
  };

  // Handlers for stats
  const updateStat = (idx, field, value) => {
    setStats((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s))
    );
  };
  const removeStat = (idx) => {
    setStats((prev) => prev.filter((_, i) => i !== idx));
  };
  const addStat = () => {
    setStats((prev) => [...prev, { value: "New", label: "New Stat" }]);
  };

  // Duplicate clients for marquee loop
  const duplicatedClients = [...clients, ...clients];

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
      className='py-20 bg-background theme-transition'
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
    >
      <div className='max-w-6xl mx-auto px-6'>
        {/* Section Header */}
        <motion.div
          className='text-center mb-16'
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {isEditing ? (
            <>
              <input
                value={headline.title}
                onChange={(e) =>
                  setHeadline((h) => ({ ...h, title: e.target.value }))
                }
                className='text-3xl md:text-4xl font-bold text-foreground mb-4 w-full text-center border-b bg-transparent'
              />
              <textarea
                value={headline.description}
                onChange={(e) =>
                  setHeadline((h) => ({ ...h, description: e.target.value }))
                }
                className='text-lg text-muted-foreground w-full text-center border-b bg-transparent'
                rows={2}
              />
            </>
          ) : (
            <>
              <h2 className='text-3xl md:text-4xl font-bold text-foreground mb-4'>
                {headline.title}
              </h2>
              <p className='text-muted-foreground text-lg'>
                {headline.description}
              </p>
            </>
          )}
        </motion.div>

        {/* Marquee Container */}
        <div className='group w-full overflow-hidden'>
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
            className='flex gap-10 items-start text-center animate-marquee'
            variants={containerVariants}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
          >
            {duplicatedClients.map((client, index) => (
              <motion.div
                key={index}
                className='flex flex-col items-center flex-shrink-0 w-32 cursor-pointer'
                variants={logoVariants}
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className='w-20 h-20 rounded-full overflow-hidden shadow-md border border-border'
                  whileHover={{
                    borderColor: "var(--color-primary)",
                    boxShadow: "0 10px 25px rgba(250, 204, 21, 0.3)",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {isEditing ? (
                    <input
                      type='file'
                      accept='image/*'
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            updateClient(
                              index % clients.length,
                              "image",
                              reader.result as string
                            );
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className='w-full h-full'
                    />
                  ) : (
                    <ImageWithFallback
                      src={client.image}
                      alt={`${client.name} logo`}
                      className='w-full h-full object-cover'
                    />
                  )}
                </motion.div>
                <motion.div
                  className='mt-3'
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  {isEditing ? (
                    <>
                      <input
                        value={client.name}
                        onChange={(e) =>
                          updateClient(
                            index % clients.length,
                            "name",
                            e.target.value
                          )
                        }
                        className='text-sm font-medium text-card-foreground border-b bg-transparent w-full'
                      />
                      <Button
                        size='sm'
                        variant='destructive'
                        className='mt-2'
                        onClick={() => removeClient(index % clients.length)}
                      >
                        Remove
                      </Button>
                    </>
                  ) : (
                    <p className='text-sm font-medium text-card-foreground group-hover:text-primary transition-colors'>
                      {client.name}
                    </p>
                  )}
                </motion.div>
              </motion.div>
            ))}
            {isEditing && (
              <div className='flex items-center justify-center w-32'>
                <Button onClick={addClient} className='text-green-600'>
                  + Add Client
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
