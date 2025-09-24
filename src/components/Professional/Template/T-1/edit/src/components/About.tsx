import React, { useState } from "react";
import { motion } from "framer-motion";
import { Award, Calendar, MapPin, Users, Edit, Save, X } from "lucide-react";

const About: React.FC = () => {
  const [aboutContent, setAboutContent] = useState({
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
  });

  const [isEditing, setIsEditing] = useState(false);

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

  const handleContentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setAboutContent((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleStatChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = e.target;
    const statKeys = [
      "yearsExperience",
      "projectsCompleted",
      "happyClients",
      "countriesServed",
    ] as const;
    const key = statKeys[index];
    setAboutContent((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleSkillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skillsArray = e.target.value.split(",").map((skill) => skill.trim());
    setAboutContent((prevState) => ({
      ...prevState,
      skills: skillsArray,
    }));
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
            <div
              className={`absolute top-0 right-0 px-4 py-2 rounded-full flex items-center gap-2 font-semibold shadow-lg transition-all duration-300 hover:scale-105`}
            >
              {isEditing ? (
                <div className="absolute top-0 right-0 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className=" p-2 text-gray-900 dark:text-white bg-green-500 hover:bg-green-600 rounded-full transition-colors"
                    title="Save Changes"
                  >
                    <Save className="w-6 h-6" />
                  </button>

                  <button
                    onClick={() => setIsEditing(false)}
                    className=" p-2 text-gray-900 dark:text-white bg-green-500 hover:bg-green-600 rounded-full transition-colors"
                    title="Cancel"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="absolute top-0 right-0 p-2 text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full transition-colors"
                  title="Edit Section"
                >
                  <Edit className="w-6 h-6" />
                </button>
              )}
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              About{" "}
              <span className="text-orange-500">
                Me
              </span>
            </h2>
            {isEditing ? (
              <textarea
                name="subtitle"
                value={aboutContent.subtitle}
                onChange={handleContentChange}
                className="w-full bg-gray-100 dark:bg-gray-800 text-center text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto rounded-lg p-2 resize-none"
                rows={2}
              />
            ) : (
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                {aboutContent.subtitle}
              </p>
            )}
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
              {isEditing ? (
                <input
                  type="text"
                  name="heading"
                  value={aboutContent.heading}
                  onChange={handleContentChange}
                  className="w-full text-3xl font-bold bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg p-2"
                />
              ) : (
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {aboutContent.heading}
                </h3>
              )}

              <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                {isEditing ? (
                  <>
                    <textarea
                      name="description1"
                      value={aboutContent.description1}
                      onChange={handleContentChange}
                      className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg p-2 resize-none"
                      rows={3}
                    />
                    <textarea
                      name="description2"
                      value={aboutContent.description2}
                      onChange={handleContentChange}
                      className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg p-2 resize-none"
                      rows={4}
                    />
                    <textarea
                      name="description3"
                      value={aboutContent.description3}
                      onChange={handleContentChange}
                      className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg p-2 resize-none"
                      rows={3}
                    />
                  </>
                ) : (
                  <>
                    <p>{aboutContent.description1}</p>
                    <p>{aboutContent.description2}</p>
                    <p>{aboutContent.description3}</p>
                  </>
                )}
              </div>

              {/* Skills Highlight */}
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Core Expertise
                </h4>
                {isEditing ? (
                  <input
                    type="text"
                    name="skills"
                    value={aboutContent.skills.join(", ")}
                    onChange={handleSkillChange}
                    className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg p-2"
                    placeholder="Separate skills with commas (e.g., React, Node.js)"
                  />
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {aboutContent.skills.map((skill, index) => (
                      <motion.span
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        className="px-4 py-2 bg-gradient-to-r from-accent-yellow/10 to-accent-orange/10 border border-accent-orange/30 rounded-full text-accent-orange font-medium"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                )}
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
                  <stat.icon className="w-8 h-8 text-accent-orange" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {isEditing ? (
                    <input
                      type="text"
                      name={
                        [
                          "yearsExperience",
                          "projectsCompleted",
                          "happyClients",
                          "countriesServed",
                        ][index]
                      }
                      value={stat.value}
                      onChange={(e) => handleStatChange(e, index)}
                      className="w-16 bg-gray-100 dark:bg-gray-800 text-center rounded-lg"
                    />
                  ) : (
                    stat.value
                  )}
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
