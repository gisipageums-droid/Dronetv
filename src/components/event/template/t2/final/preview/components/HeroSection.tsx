import { useState, useEffect } from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'motion/react';

interface HeroData {
  subtitle: string;
  titlePart1: string;
  titlePart2: string;
  description: string;
  primaryButton: string;
  secondaryButton: string;
  eventInfo: {
    date: string;
    location: string;
    attendees: string;
  };
}

interface HeroProps {
  heroData?: any;
}

const defaultData: HeroData = {
  subtitle: "Tech Innovation Summit 2024",
  titlePart1: "Tech",
  titlePart2: "Innovation Summit",
  description: "Annual technology conference focusing on AI, Machine Learning, and Cloud Computing innovations. Join industry leaders for networking and knowledge sharing.",
  primaryButton: "Register Now",
  secondaryButton: "View Schedule",
  eventInfo: {
    date: "March 15, 2024",
    location: "Bangalore Convention Center",
    attendees: "500+ Expected"
  }
};

const splitEventName = (eventName: string) => {
  const words = eventName.split(' ');
  if (words.length <= 1) {
    return { part1: eventName, part2: '' };
  }
  
  const midPoint = Math.ceil(words.length / 2);
  const part1 = words.slice(0, midPoint).join(' ');
  const part2 = words.slice(midPoint).join(' ');
  
  return { part1, part2 };
};

const transformHeroData = (apiData: any): HeroData => {
  if (!apiData) return defaultData;

  const { part1, part2 } = splitEventName(apiData.eventName);
  
  return {
    subtitle: apiData.tagline,
    titlePart1: part1,
    titlePart2: part2,
    description: apiData.description || defaultData.description,
    primaryButton: apiData.ctaButtons?.[0]?.text,
    secondaryButton: apiData.ctaButtons?.[1]?.text,
    eventInfo: {
      date: apiData.date,
      location: apiData.location,
      attendees: "200+ Expected"
    }
  };
};

export function HeroSection({ heroData }: HeroProps) {
  const [data, setData] = useState<HeroData>(defaultData);

  useEffect(() => {
    if (heroData) {
      const transformedData = transformHeroData(heroData);
      setData(transformedData);
    }
  }, [heroData]);

  const displayData = data;

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-yellow-50 pt-[4rem]">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 right-10 w-72 h-72 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-20 left-1/2 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-60"
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-amber-500 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-block mb-6 px-6 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-amber-200 shadow-sm"
          >
            <span className="text-amber-700">{displayData.subtitle}</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-gray-900 mb-6 leading-tight"
          >
            <span className="block text-4xl sm:text-6xl md:text-7xl lg:text-8xl">{displayData.titlePart1}</span>
            <span className="block text-4xl sm:text-6xl md:text-7xl lg:text-8xl mt-2 bg-amber-600 bg-clip-text text-transparent">
              {displayData.titlePart2}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto px-4"
          >
            {displayData.description}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16 px-4"
          >
            <Button
              size="lg"
              className="bg-yellow-400 hover:from-yellow-500 hover:to-amber-600 text-gray-900 px-8 py-6 text-base sm:text-lg shadow-lg"
              onClick={() => { window.location.hash = '#contact'; }}
            >
              {displayData.primaryButton}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-gray-300 text-gray-900 px-8 py-6 text-base sm:text-lg shadow-lg"
              onClick={() => { window.location.hash = '#events'; }}
            >
              {displayData.secondaryButton}
            </Button>
          </motion.div>

          {/* Event Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto px-4 mb-4"
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-amber-200 hover:scale-105 transition-transform duration-300">
              <Calendar className="w-8 h-8 text-amber-600 mx-auto mb-3" />
              <p className="text-gray-600 mb-1 text-sm">Date</p>
              <p className="text-gray-900">{displayData.eventInfo.date}</p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-amber-200 hover:scale-105 transition-transform duration-300">
              <MapPin className="w-8 h-8 text-amber-600 mx-auto mb-3" />
              <p className="text-gray-600 mb-1 text-sm">Location</p>
              <p className="text-gray-900">{displayData.eventInfo.location}</p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-amber-200 hover:scale-105 transition-transform duration-300 sm:col-span-2 md:col-span-1">
              <Users className="w-8 h-8 text-amber-600 mx-auto mb-3" />
              <p className="text-gray-600 mb-1 text-sm">Attendees</p>
              <p className="text-gray-900">{displayData.eventInfo.attendees}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}