import { useEffect, useRef, useState } from 'react';
import { Building2 } from 'lucide-react';
import { motion } from 'motion/react';

interface Exhibitor {
  id: string;
  name: string;
  category: string;
  booth: string;
  logo?: string;
  description?: string;
  website?: string;
}

interface ExhibitorsData {
  subtitle: string;
  heading: string;
  description: string;
  exhibitors: Exhibitor[];
}

interface ExhibitorsProps {
  exhibitorsData?: any;
}

const createDefaultData = (): ExhibitorsData => {
  const providedData = {
    subtitle: "event partners",
    heading: "Exhibitors & Sponsors",
    description: "Meet our partners, sponsors, and exhibitors",
    exhibitors: [
      {
        website: "#",
        name: "DataTech Innovations",
        description: "DataTech Innovations specializes in cutting-edge data analytics software for enterprises.",
        logo: "https://images.unsplash.com/photo-1590771032931-7d04f2020c36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTg4ODN8MHwxfHNlYXJjaHwxfHx0cmFkZSUyMHNob3clMjBib290aCUyMGV4aGliaXRpb24lMjBzdGFuZCUyMGJ1c2luZXNzJTIwZXhwb3xlbnwwfDF8fHwxNzYyNjcxNjI3fDA&ixlib=rb-4.1.0&q=80&w=1080",
        id: "2",
        category: "Data Analytics",
        booth: "Booth A2"
      }
    ]
  };

  return {
    subtitle: providedData.subtitle,
    heading: providedData.heading,
    description: providedData.description,
    exhibitors: providedData.exhibitors
  };
};

export function ExhibitorsSection({ exhibitorsData }: ExhibitorsProps) {
  const [data, setData] = useState<ExhibitorsData>(createDefaultData());
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (exhibitorsData) {
      const transformedData: ExhibitorsData = {
        subtitle: exhibitorsData.subtitle || "event partners",
        heading: exhibitorsData.heading || "Exhibitors & Sponsors",
        description: exhibitorsData.description || "Meet our partners, sponsors, and exhibitors",
        exhibitors: exhibitorsData.exhibitors || []
      };
      setData(transformedData);
    }
  }, [exhibitorsData]);

  const displayData = data;

  // Duplicate exhibitors for marquee loop
  const duplicatedExhibitors = [...displayData.exhibitors, ...displayData.exhibitors];

  return (
    <section id="exhibitors" className="py-16 sm:py-20 md:py-24 bg-yellow-50 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto mb-12 sm:mb-16">
          {/* Header */}
          <div className="text-center">
            <div className="inline-block mb-4 px-4 py-2 bg-white rounded-full border border-amber-200 shadow-sm">
              <span className="text-red-700 text-xl font-semibold">{displayData.subtitle}</span>
            </div>
            <h2 className="text-gray-900 mb-4 text-3xl sm:text-4xl md:text-5xl">{displayData.heading}</h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4">
              {displayData.description}
            </p>
          </div>
        </div>
      </div>

      {/* Exhibitors Marquee */}
      <div className="group w-full overflow-hidden">
        <style>
          {`
            @keyframes marquee {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-50%); }
            }
            .animate-marquee {
              animation: marquee 60s linear infinite;
            }
            .group:hover .animate-marquee {
              animation-play-state: paused;
            }
          `}
        </style>
        
        <motion.div
          className="flex gap-8 animate-marquee"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
              },
            },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {duplicatedExhibitors.map((exhibitor, index) => (
            <motion.div
              key={`${exhibitor.id}-${index}`}
              variants={{
                hidden: { y: 50, opacity: 0 },
                visible: {
                  y: 0,
                  opacity: 1,
                  transition: {
                    duration: 0.8,
                    ease: "easeOut",
                  },
                },
              }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              className="flex-shrink-0 w-80 sm:w-96"
            >
              <div className="group bg-white p-6 sm:p-8 rounded-2xl border-2 border-amber-200 hover:border-amber-400 hover:shadow-xl transition-all duration-300 relative h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative overflow-hidden">
                    {exhibitor.logo ? (
                      <img
                        src={exhibitor.logo}
                        alt={exhibitor.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Building2 className="w-6 h-6 text-white" />
                    )}
                  </div>
                  
                  <span className="px-3 py-1 bg-yellow-100 text-amber-700 rounded-full text-xs sm:text-sm">
                    {exhibitor.booth}
                  </span>
                </div>
                
                <h3 className="text-gray-900 mb-2 text-lg sm:text-xl group-hover:text-amber-600 transition-colors">
                  {exhibitor.name}
                </h3>
                <p className="text-amber-600 mb-4 text-sm sm:text-base">{exhibitor.category}</p>
                {exhibitor.description && (
                  <p className="text-gray-600 text-sm mb-4">{exhibitor.description}</p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Empty State */}
      {displayData.exhibitors.length === 0 && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Building2 className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No Exhibitors Added</h4>
            <p className="text-gray-600">Add exhibitors to showcase your event partners.</p>
          </div>
        </div>
      )}
    </section>
  );
}