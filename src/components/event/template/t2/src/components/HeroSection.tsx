import { Calendar, MapPin, Users } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'motion/react';

export function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-surface-main">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-brand-yellow-soft rounded-full mix-blend-multiply filter blur-3xl opacity-70"
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
          className="absolute top-40 right-10 w-72 h-72 bg-brand-yellow-soft rounded-full mix-blend-multiply filter blur-3xl opacity-70"
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
          className="absolute -bottom-20 left-1/2 w-96 h-96 bg-brand-yellow rounded-full mix-blend-multiply filter blur-3xl opacity-60"
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
            className="absolute w-2 h-2 bg-brand-gold rounded-full"
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
            className="inline-block mb-6 px-6 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-brand-yellow-soft shadow-sm"
          >
            <span className="text-brand-gold">Annual Conference 2025</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-ink mb-6 leading-tight"
          >
            <span className="block text-4xl sm:text-6xl md:text-7xl lg:text-8xl">Transform</span>
            <span className="block text-4xl sm:text-6xl md:text-7xl lg:text-8xl mt-2 bg-brand-gold bg-clip-text text-transparent">The Future</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl md:text-2xl text-ink-paragraph mb-12 max-w-3xl mx-auto px-4"
          >
            Join industry leaders, innovators, and visionaries for three days of inspiration, networking, and breakthrough ideas
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16 px-4"
          >
            <Button
              size="lg"
              className="bg-brand-yellow hover:from-brand-gold hover:to-brand-gold text-ink px-8 py-6 text-base sm:text-lg shadow-lg"
            >
              Get Your Tickets
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-ink text-ink hover:bg-ink-charcoal hover:text-white px-8 py-6 text-base sm:text-lg bg-white/70 backdrop-blur-sm"
            >
              View Schedule
            </Button>
          </motion.div>

          {/* Event Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto px-4 mb-4"
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-brand-yellow-soft hover:scale-105 transition-transform duration-300">
              <Calendar className="w-8 h-8 text-brand-gold mx-auto mb-3" />
              <p className="text-ink-paragraph mb-1 text-sm">Date</p>
              <p className="text-ink">March 15-17, 2025</p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-brand-yellow-soft hover:scale-105 transition-transform duration-300">
              <MapPin className="w-8 h-8 text-brand-gold mx-auto mb-3" />
              <p className="text-ink-paragraph mb-1 text-sm">Location</p>
              <p className="text-ink">New York, USA</p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-brand-yellow-soft hover:scale-105 transition-transform duration-300 sm:col-span-2 md:col-span-1">
              <Users className="w-8 h-8 text-brand-gold mx-auto mb-3" />
              <p className="text-ink-paragraph mb-1 text-sm">Attendees</p>
              <p className="text-ink">2000+ Expected</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
      >
        <div className="w-6 h-10 border-2 border-ink rounded-full flex items-start justify-center p-2">
          <motion.div
            className="w-1.5 h-3 bg-ink rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}
