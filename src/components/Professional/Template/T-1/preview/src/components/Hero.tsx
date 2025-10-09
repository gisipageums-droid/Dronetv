import React from "react";
import { motion } from "framer-motion";
import { Twitter, Instagram, Linkedin, Github, Mail } from "lucide-react";

const Hero: React.FC = () => {
  const heroContent = {
    name: "John Doe",
    title: "Full-Stack Developer",
    description:
      "I create exceptional digital experiences that blend beautiful design with powerful functionality. Passionate about clean code, user experience, and building products that make a difference.",
    image:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=800",
    socials: {
      twitter: "https://twitter.com/johndoe",
      instagram: "https://instagram.com/johndoe",
      linkedin: "https://linkedin.com/in/johndoe",
      github: "https://github.com/johndoe",
      email: "john@example.com",
    },
  };

  const socialLinks = [
    {
      name: "Twitter",
      icon: Twitter,
      url: heroContent.socials.twitter,
      color: "hover:text-blue-400",
    },
    {
      name: "Instagram",
      icon: Instagram,
      url: heroContent.socials.instagram,
      color: "hover:text-pink-400",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: heroContent.socials.linkedin,
      color: "hover:text-blue-600",
    },
    {
      name: "GitHub",
      icon: Github,
      url: heroContent.socials.github,
      color: "hover:text-gray-400",
    },
    {
      name: "Email",
      icon: Mail,
      url: `mailto:${heroContent.socials.email}`,
      color: "hover:text-green-400",
    },
  ];

  return (
    <section
      id="home"
      className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 pt-40"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-40 relative">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left Side - Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <motion.h1 className="text-4xl lg:text-6xl xl:text-7xl font-bold leading-tight text-blue-500 dark:text-orange-500">
                Hi, I'm{" "}{heroContent.name}
              </motion.h1>

              <motion.p className="text-xl lg:text-2xl xl:text-3xl font-semibold text-blue-600 dark:text-orange-400">
                {heroContent.title}
              </motion.p>

              <motion.p className="text-lg lg:text-xl leading-relaxed max-w-2xl text-gray-700 dark:text-gray-300">
                {heroContent.description}
              </motion.p>
            </div>

            {/* Social Links */}
            <motion.div className="flex flex-wrap gap-6 items-center pt-2">
              <div className="flex gap-3">
                {socialLinks.map((social) => {
                  const url = social.name === "Email" ? social.url : social.url;
                  if (
                    !url ||
                    (social.name === "Email" && !heroContent.socials.email)
                  )
                    return null;

                  return (
                    <motion.a
                      key={social.name}
                      href={url}
                      target={social.name === "Email" ? "_self" : "_blank"}
                      rel={social.name === "Email" ? "" : "noopener noreferrer"}
                      whileHover={{ scale: 1.2, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-2 rounded-full transition-all duration-300 bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 ${social.color} hover:shadow-lg group`}
                      title={`Follow on ${social.name}`}
                    >
                      <social.icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>

            {/* CTA Buttons - only in view mode */}
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
          <motion.div className="flex justify-center lg:justify-end">
            <div className="w-80 h-80 lg:w-96 lg:h-96 rounded-full p-1 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-600 dark:from-yellow-400 dark:via-orange-500 dark:to-red-500">
              <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-purple-500/10 to-blue-600/10 dark:from-yellow-400/10 dark:to-red-500/10 flex items-center justify-center relative">
                <div className="w-full h-full relative">
                  <img
                    src={heroContent.image}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Background decorative elements */}
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
