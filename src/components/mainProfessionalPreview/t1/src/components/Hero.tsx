import React from "react";
import { motion } from "framer-motion";
import {
  Twitter,
  Instagram,
  Linkedin,
  Github,
  Mail,
  Phone,
} from "lucide-react";

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
  const socialLinks = [
    {
      name: "Twitter",
      icon: Twitter,
      url: content.socials.twitter,
      color: "hover:text-blue-400",
      key: "twitter",
    },
    {
      name: "Instagram",
      icon: Instagram,
      url: content.socials.instagram,
      color: "hover:text-pink-400",
      key: "instagram",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: content.socials.linkedin,
      color: "hover:text-blue-600",
      key: "linkedin",
    },
    {
      name: "GitHub",
      icon: Github,
      url: content.socials.github,
      color: "hover:text-gray-400",
      key: "github",
    },
    {
      name: "Email",
      icon: Mail,
      url: content.socials.email
        ? `mailto:${content.socials.email}`
        : undefined,
      color: "hover:text-green-400",
      key: "email",
    },
    {
      name: "Phone",
      icon: Phone,
      url: content.socials.phone ? `tel:${content.socials.phone}` : undefined,
      color: "hover:text-purple-400",
      key: "phone",
    },
  ];

  return (
    <section
      id="home"
      className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 pt-40"
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
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white">
                {/* Hi, I'm{" "} */}
                <span className="text-blue-500 dark:text-orange-500">
                  {content.name}
                </span>
              </h1>

              <p className="text-xl lg:text-2xl font-semibold text-blue-600 dark:text-orange-400">
                {content.title}
              </p>

              <p className="text-lg lg:text-xl text-gray-700 dark:text-gray-300">
                {content.description}
              </p>
            </div>

            {/* Social Links */}
            {/* <div className="flex flex-wrap gap-6 items-center pt-2">
              <div className="flex gap-3">
                {socialLinks.map((social) =>
                  content.socials[
                    social.key as keyof typeof content.socials
                  ] ? (
                    <a
                      key={social.name}
                      href={social.url}
                      target={
                        social.name === "Email" || social.name === "Phone"
                          ? "_self"
                          : "_blank"
                      }
                      rel="noreferrer"
                      className={`p-2 rounded-full bg-gray-100 dark:bg-gray-800 ${social.color}`}
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ) : null
                )}
              </div>
            </div> */}

            <motion.div className="grid grid-cols-2 gap-4 pt-4">
              <button className="px-8 py-4 rounded-full font-semibold text-xs md:text-lg border-2 transition-all duration-300 hover:scale-105 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white dark:border-yellow-400 dark:text-yellow-400 dark:hover:bg-yellow-400 dark:hover:text-gray-900">
                View My Work
              </button>

              <button className="px-8 py-4 rounded-full font-semibold text-xs md:text-lg border-2 transition-all duration-300 hover:scale-105 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white dark:border-yellow-400 dark:text-yellow-400 dark:hover:bg-yellow-400 dark:hover:text-gray-900">
                Get In Touch
              </button>
            </motion.div>
          </div>

          {/* Right Side - Profile Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-80 h-80 lg:w-96 lg:h-96 rounded-full p-1 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-600">
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
          <div className="absolute top-20 left-10 w-32 h-32 rounded-full opacity-10 bg-purple-500 dark:bg-yellow-400 animate-pulse" />
          <div className="absolute bottom-20 right-10 w-24 h-24 rounded-full opacity-10 bg-blue-500 dark:bg-orange-500 animate-bounce" />
          <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full opacity-5 bg-indigo-500 dark:bg-red-500 animate-pulse" />
          <div className="absolute bottom-0 left-1/1 w-10 h-10 rounded-full opacity-5 bg-indigo-500 dark:bg-red-500 animate-bounce-slow" />
          <div className="absolute top-1 left-1/4 w-8 h-8 rounded-full opacity-5 bg-indigo-500 dark:bg-red-500 animate-bounce-slow" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
