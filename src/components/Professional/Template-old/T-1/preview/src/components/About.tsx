import React from "react";
import { motion } from "framer-motion";
import { Award, Calendar, MapPin, Users } from "lucide-react";

const About: React.FC = () => {
  const aboutContent = {
    title: "About Me",
    subtitle:
      "Passionate developer with a love for creating innovative solutions that bridge the gap between design and technology.",
    heading: "Building Digital Dreams Into Reality",
    description1:
      "I'm a passionate full-stack developer with over 5 years of experience in creating exceptional digital experiences. My journey began with a Computer Science degree and has evolved through working with startups, agencies, and enterprise clients.",
    description2:
      "I specialize in modern web technologies including React, Node.js, TypeScript, and cloud platforms. My approach combines technical expertise with a deep understanding of user experience to deliver solutions that not only work flawlessly but also delight users.",
    description3:
      "When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, or mentoring aspiring developers in my community.",
    yearsExperience: "5+",
    projectsCompleted: "50+",
    happyClients: "30+",
    countriesServed: "10+",
    skills: ["React", "TypeScript", "Node.js", "Python", "AWS", "MongoDB"],
    imageSrc:
      "https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=800",
  };

  const stats = [
    {
      icon: Calendar,
      label: "Years Experience",
      value: aboutContent.yearsExperience,
    },
    {
      icon: Award,
      label: "Projects Completed",
      value: aboutContent.projectsCompleted,
    },
    { icon: Users, label: "Happy Clients", value: aboutContent.happyClients },
    {
      icon: MapPin,
      label: "Countries Served",
      value: aboutContent.countriesServed,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Section Header */}
          <motion.div
            variants={itemVariants}
            className="text-center mb-16 relative"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              <span className="text-gray-900 dark:text-white">
                {aboutContent.title.split(" ")[0]}
              </span>{" "}
              <span className="text-blue-500 dark:text-orange-500">
                {aboutContent.title.split(" ").slice(1).join(" ")}
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {aboutContent.subtitle}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Image */}
            <motion.div variants={itemVariants} className="relative">
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={aboutContent.imageSrc}
                  alt="About me"
                  className="w-full h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-accent-orange/20 to-accent-yellow/20"></div>
              </div>
            </motion.div>

            {/* Right Side - Content */}
            <motion.div variants={itemVariants} className="space-y-6">
              {/* <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                {aboutContent.heading}
              </h3> */}

              <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                <p>{aboutContent.description1}</p>
                <p>{aboutContent.description2}</p>
                <p>{aboutContent.description3}</p>
              </div>

              {/* Skills Highlight */}
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Core Expertise
                </h4>
                <div className="flex flex-wrap gap-3">
                  {aboutContent.skills.map((skill, index) => (
                    <motion.span
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      className="px-4 py-2 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-orange-500/30 rounded-full text-orange-500 font-medium"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Stats Section */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-gray-200 dark:border-gray-700"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent-yellow/10 to-accent-red/10 rounded-full mb-4 group-hover:from-accent-yellow/20 group-hover:to-accent-red/20 transition-all duration-200">
                  <stat.icon className="w-8 h-8 text-orange-500" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
