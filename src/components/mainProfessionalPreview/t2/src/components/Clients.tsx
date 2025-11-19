import { motion } from 'motion/react';
import { AnimatedButton } from './AnimatedButton';

interface ClientsProps {
  clientData?: {
    heading?: string;
    description?: string;
    subtitle?: string;
    stats?: {
      [key: string]: string;
    };
    clients?: Array<{
      name: string;
      industry?: string;
      logo?: string;
      website?: string;
    }>;
    cta?: {
      title?: string;
      description?: string;
      buttonText?: string;
      buttonLink?: string;
    };
  };
}

export function Clients({ clientData }: ClientsProps) {
  // If no clientData provided, return loading state
  if (!clientData) {
    return (
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-8 bg-gray-300 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3 mx-auto"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse text-center">
                <div className="h-12 bg-gray-300 rounded w-16 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-20 mx-auto"></div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse bg-gray-300 rounded-xl h-24"></div>
            ))}
          </div>
          <div className="animate-pulse bg-gray-300 rounded-2xl p-8 h-48"></div>
        </div>
      </section>
    );
  }

  // Process stats data
  const processStatsData = () => {
    if (!clientData.stats) return [];
    
    return Object.entries(clientData.stats).map(([key, value]) => ({
      number: value,
      label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
    }));
  };

  const stats = processStatsData();
  const clients = clientData.clients || [];

  return (
    <section className="py-20 text-justify bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Dynamic */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          {clientData.heading && (
            <h2 className="text-3xl sm:text-4xl text-foreground mb-4">
              {clientData.heading}
            </h2>
          )}
          {clientData.description && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
              {clientData.description}
            </p>
          )}
          {clientData.subtitle && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {clientData.subtitle}
            </p>
          )}
        </motion.div>

        {/* Stats - Dynamic */}
        {stats.length > 0 && (
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="text-center transition-transform duration-300"
              >
                <div className="text-3xl sm:text-4xl text-yellow-500 mb-2">{stat.number}</div>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Client Grid - Dynamic */}
        {clients.length > 0 ? (
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {clients.map((client, index) => (
              <motion.div
                key={client.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group bg-muted rounded-xl p-6 h-24 flex items-center justify-center hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-all duration-300"
              >
                <div className="text-center">
                  <div className="text-lg text-foreground group-hover:text-yellow-600 transition-colors duration-300 mb-1">
                    {client.name}
                  </div>
                  {client.industry && (
                    <div className="text-xs text-muted-foreground">{client.industry}</div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12 mb-12">
            <p className="text-muted-foreground text-lg">
              No clients data available
            </p>
          </div>
        )}

        {/* Call to Action - Dynamic */}
        {(clientData.cta?.title || clientData.cta?.description) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-center bg-gradient-to-r from-yellow-50 to-card dark:from-yellow-900/20 dark:to-card rounded-2xl p-8"
          >
            {clientData.cta.title && (
              <h3 className="text-2xl text-foreground mb-4">
                {clientData.cta.title}
              </h3>
            )}
            {clientData.cta.description && (
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                {clientData.cta.description}
              </p>
            )}
            {clientData.cta.buttonText && (
              <AnimatedButton 
                href={clientData.cta.buttonLink || "#contact"}
                size="lg"
              >
                {clientData.cta.buttonText}
              </AnimatedButton>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}