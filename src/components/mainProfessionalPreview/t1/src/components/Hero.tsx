import React from "react";
import { motion } from "framer-motion";

export interface HeroContent {
  name: string;
  title: string;
  description: string;
  image: string;
  socials: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    github?: string;
    email?: string;
    phone?: string;
  };
}

interface HeroProps {
  content: HeroContent;
}

const Hero: React.FC<HeroProps> = ({ content }) => {
  return (
    <section
      id="home"
      className="bg-surface-card dark:bg-gray-900 transition-colors duration-300 pt-40"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-40 relative">
        {/* Hero Content */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left Side */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold text-ink dark:text-white">
                {/* Hi, I'm{" "} */}
                <span className="text-status-warning">
                  {content.name}
                </span>
              </h1>

              <p className="text-xl lg:text-2xl font-semibold text-ink dark:text-white">
                {content.title}
              </p>

              <p className="text-lg text-justify lg:text-xl text-ink-paragraph dark:text-gray-300">
                {content.description}
              </p>
            </div>

            <motion.div className="grid grid-cols-2 gap-4 pt-4">
              <a
                href="#projects"
                className="px-8 py-4 rounded-full font-semibold text-xs md:text-lg border-2 transition-all duration-300 hover:scale-105 border-brand-yellow hover:bg-brand-yellow text-ink dark:text-white hover:text-white text-center"
              >
                View My Work
              </a>

              <a
                href="#contact"
                className="px-8 py-4 rounded-full font-semibold text-xs md:text-lg border-2 transition-all duration-300 hover:scale-105 border-brand-yellow hover:bg-brand-yellow text-ink dark:text-white hover:text-white text-center"
              >
                Get In Touch
              </a>
            </motion.div>
          </div>

          {/* Right Side - Profile Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-80 h-80 lg:w-96 lg:h-96 rounded-full p-1 bg-gradient-to-r from-brand-yellow to-brand-gold">
              <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center relative">
                <img
                  src={content.image}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 rounded-full opacity-10 bg-brand-yellow animate-pulse" />
          <div className="absolute bottom-20 right-10 w-24 h-24 rounded-full opacity-10 bg-status-warning animate-bounce" />
          <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full opacity-5 bg-status-error animate-pulse" />
          <div className="absolute bottom-0 left-1/1 w-10 h-10 rounded-full opacity-5 bg-status-error animate-bounce-slow" />
          <div className="absolute top-1 left-1/4 w-8 h-8 rounded-full opacity-5 bg-status-error animate-bounce-slow" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
