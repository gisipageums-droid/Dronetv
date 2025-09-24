import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Save,
  Upload,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  Mail,
  Edit,
  X,
} from "lucide-react";

const Hero: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [heroContent, setHeroContent] = useState({
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
  });

  const handleChange = (field: string, value: string) => {
    if (field.startsWith("socials.")) {
      const socialKey = field.split(".")[1];
      setHeroContent((prev) => ({
        ...prev,
        socials: { ...prev.socials, [socialKey]: value },
      }));
    } else {
      setHeroContent((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setHeroContent((prev) => ({
            ...prev,
            image: reader.result as string,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
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
      className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 pt-28"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-40 relative">
        {/* Edit Button */}
        <div
          className={`absolute top-10 right-8 px-4 py-2 rounded-full flex items-center gap-2 font-semibold shadow-lg transition-all duration-300 hover:scale-105`}
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

        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left Side - Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              {isEditing ? (
                <motion.input
                  type="text"
                  value={heroContent.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="text-4xl lg:text-6xl font-bold p-4 rounded-xl w-full border-2 transition-colors duration-300 bg-white text-gray-900 border-gray-200 focus:border-purple-500 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:focus:border-yellow-400 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-20 dark:focus:ring-yellow-400"
                  placeholder="Your Name"
                />
              ) : (
                <motion.h1 className="text-4xl lg:text-6xl xl:text-7xl font-bold leading-tight text-gray-900 dark:text-white">
                  Hi, I'm{" "}
                  <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 dark:from-yellow-400 dark:via-orange-500 dark:to-red-500 bg-clip-text text-transparent">
                    {heroContent.name}
                  </span>
                </motion.h1>
              )}

              {isEditing ? (
                <motion.input
                  type="text"
                  value={heroContent.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className="text-xl lg:text-2xl font-semibold p-3 rounded-lg w-full border-2 transition-colors duration-300 bg-white text-gray-900 border-gray-200 focus:border-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-20 dark:focus:ring-orange-400"
                  placeholder="Your Title"
                />
              ) : (
                <motion.p className="text-xl lg:text-2xl xl:text-3xl font-semibold text-blue-600 dark:text-orange-400">
                  {heroContent.title}
                </motion.p>
              )}

              {isEditing ? (
                <motion.textarea
                  value={heroContent.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="text-lg leading-relaxed p-4 rounded-lg w-full border-2 transition-colors duration-300 resize-none bg-white text-gray-900 border-gray-200 focus:border-purple-500 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:focus:border-yellow-400 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-20 dark:focus:ring-yellow-400"
                  rows={4}
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <motion.p className="text-lg lg:text-xl leading-relaxed max-w-2xl text-gray-700 dark:text-gray-300">
                  {heroContent.description}
                </motion.p>
              )}
            </div>

            {/* Social Links */}
            <motion.div className="flex flex-wrap gap-6 items-center pt-2">
              {isEditing ? (
                <div className="w-full space-y-3">
                  <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3">
                    Social Links
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {socialLinks.map((social) => (
                      <div
                        key={social.name}
                        className="flex items-center gap-2"
                      >
                        <social.icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        <input
                          type="url"
                          placeholder={`${social.name} URL`}
                          value={
                            social.name === "Email"
                              ? heroContent.socials.email
                              : social.url
                          }
                          onChange={(e) =>
                            handleChange(
                              `socials.${social.name.toLowerCase()}`,
                              e.target.value
                            )
                          }
                          className="flex-1 text-sm p-2 rounded-lg border transition-colors duration-300 bg-white text-gray-900 border-gray-200 focus:border-purple-500 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-20 dark:focus:ring-yellow-400"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex gap-3">
                    {socialLinks.map((social) => {
                      const url =
                        social.name === "Email" ? social.url : social.url;
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
                          rel={
                            social.name === "Email" ? "" : "noopener noreferrer"
                          }
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
                </div>
              )}
            </motion.div>

            {/* CTA Buttons - only in view mode */}
            {!isEditing && (
              <motion.div className="grid grid-cols-2 gap-4 pt-4">
                <button className="px-8 py-4 rounded-full font-semibold text-xs md:text-lg border-2 transition-all duration-300 hover:scale-105 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white dark:border-yellow-400 dark:text-yellow-400 dark:hover:bg-yellow-400 dark:hover:text-gray-900">
                  View My Work
                </button>

                <button className="px-8 py-4 rounded-full font-semibold text-xs md:text-lg border-2 transition-all duration-300 hover:scale-105 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white dark:border-yellow-400 dark:text-yellow-400 dark:hover:bg-yellow-400 dark:hover:text-gray-900">
                  Get In Touch
                </button>
              </motion.div>
            )}
          </div>

          {/* Right Side - Profile Image */}
          <motion.div className="flex justify-center lg:justify-end">
            <div className="w-80 h-80 lg:w-96 lg:h-96 rounded-full p-1 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-600 dark:from-yellow-400 dark:via-orange-500 dark:to-red-500">
              <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-purple-500/10 to-blue-600/10 dark:from-yellow-400/10 dark:to-red-500/10 flex items-center justify-center relative">
                <div className="w-full h-full relative">
                  {isEditing ? (
                    <div className="relative w-full h-full flex flex-col items-center justify-center">
                      <img
                        src={heroContent.image}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-full"
                      />

                      <motion.label
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="absolute inset-0 px-4 py-2 rounded-full cursor-pointer text-lg font-semibold transition-all duration-300 flex items-center justify-center flex-col gap-2 text-white bg-black/40"
                      >
                        <Upload className="w-12 h-12" />
                        Change Photo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </motion.label>
                    </div>
                  ) : (
                    <img
                      src={heroContent.image}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-full"
                    />
                  )}
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
