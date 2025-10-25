import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Award, Calendar, MapPin, Users, Edit, Save, X } from "lucide-react";
import { toast } from "sonner";

export interface AboutContent {
  heading: string;
  subtitle: string;
  description1: string;
  description2: string;
  description3: string;
  imageSrc: string;
  skills: string[];
  // stats
  projectsCompleted: string;
  countriesServed: string;
  yearsExperience: string;
  happyClients: string;
  // stats: {
  //   yearsExperience: string;
  //   projectsCompleted: string;
  //   happyClients: string;
  //   skillsCount: string;
  // };
}
interface AboutProps {
  content: AboutContent;
  onSave?: (updated: AboutContent) => void;
  userId?: string | undefined;
}

const About: React.FC<AboutProps> = ({ content, onSave, userId }) => {
  const [aboutContent, setAboutContent] = useState<AboutContent>(content);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [skillsInput, setSkillsInput] = useState("");

  useEffect(() => {
    if (content) {
      setAboutContent(content);
    }
  }, [content]);

  useEffect(() => {
    if (isEditing) {
      setSkillsInput(aboutContent.skills.join(", "));
    }
  }, [isEditing, aboutContent.skills]);

  const stats = [
    {
      icon: Calendar,
      label: "Years Experience",
      value: aboutContent.yearsExperience,
      key: "yearsExperience" as const,
    },
    {
      icon: Award,
      label: "Projects Completed",
      value: aboutContent.projectsCompleted,
      key: "projectsCompleted" as const,
    },
    {
      icon: Users,
      label: "Happy Clients",
      value: aboutContent.happyClients,
      key: "happyClients" as const,
    },
    {
      icon: MapPin,
      label: "Countries Served",
      value: aboutContent.countriesServed,
      key: "countriesServed" as const,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  const handleContentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setAboutContent((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    statKey: keyof AboutContent
  ) => {
    const { value } = e.target;
    setAboutContent((prev) => ({
      ...prev,
      [statKey]: value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setAboutContent((prev) => ({
            ...prev,
            imageSrc: reader.result as string,
          }));
        }
      };
      reader.readAsDataURL(file);

      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", userId || "");
      formData.append("fieldName", "AboutImage");

      try {
        const uploadResponse = await fetch(
          `https://ow3v94b9gf.execute-api.ap-south-1.amazonaws.com/dev/`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          setAboutContent((prev) => ({
            ...prev,
            imageSrc: uploadData.s3Url,
          }));
          toast.success("Image uploaded successfully!");
        } else {
          const errorData = await uploadResponse.json();
          toast.error(
            `Image upload failed: ${errorData.message || "Unknown error"}`
          );
        }
      } catch {
        toast.error("Image upload failed due to network error.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSave = () => {
    const skillsArray = skillsInput
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0);

    const updated = { ...aboutContent, skills: skillsArray };
    setAboutContent(updated);
    onSave?.(updated);
    setIsEditing(false);
    toast.success("About section updated successfully!");
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
            <div className="absolute top-0 right-0 px-4 py-2">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSave}
                    className="p-2 text-gray-900 dark:text-white bg-green-500 hover:bg-green-600 rounded-full transition-colors"
                    title="Save Changes"
                  >
                    <Save className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => {
                      setAboutContent(content);
                      setSkillsInput(content.skills.join(", "));
                      setIsEditing(false);
                      toast.info("Changes discarded");
                    }}
                    className="p-2 text-gray-900 dark:text-white bg-red-500 hover:bg-red-600 rounded-full transition-colors"
                    title="Cancel"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full transition-colors"
                  title="Edit Section"
                >
                  <Edit className="w-6 h-6" />
                </button>
              )}
            </div>

            {isEditing ? (
              <input
                name="heading"
                value={aboutContent.heading}
                onChange={handleContentChange}
                className="w-full bg-gray-100 dark:bg-gray-800 text-center text-4xl lg:text-5xl font-bold text-gray-600 dark:text-gray-400 max-w-3xl mx-auto rounded-lg p-2 resize-none border-2 focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none mb-4"
              />
            ) : (
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                <span className="text-gray-900 dark:text-white">
                  {aboutContent.heading.split(" ")[0]}
                </span>{" "}
                <span className="text-blue-500 dark:text-orange-500">
                  {aboutContent.heading.split(" ").slice(1).join(" ")}
                </span>
              </h2>
            )}

            {isEditing ? (
              <textarea
                name="subtitle"
                value={aboutContent.subtitle}
                onChange={handleContentChange}
                className="w-full bg-gray-100 dark:bg-gray-800 text-center text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto rounded-lg p-2 resize-none border-2 focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none"
                rows={2}
              />
            ) : (
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                {aboutContent.subtitle}
              </p>
            )}
          </motion.div>

          {/* Content + Image */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Image */}
            <motion.div variants={itemVariants} className="relative">
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={aboutContent.imageSrc}
                  alt="About me"
                  className="w-full h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-yellow-500/20"></div>
                {isEditing &&
                  (!isUploading ? (
                    <motion.label
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/40 text-white font-semibold text-lg"
                    >
                      Click to change image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </motion.label>
                  ) : (
                    <div className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/40 text-white font-semibold text-lg">
                      Uploading...
                    </div>
                  ))}
              </div>
            </motion.div>

            {/* Right - Descriptions + Skills */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                {isEditing ? (
                  <>
                    <textarea
                      name="description1"
                      value={aboutContent.description1}
                      onChange={handleContentChange}
                      className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg p-2 resize-none border-2 focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none"
                      rows={3}
                    />
                    <textarea
                      name="description2"
                      value={aboutContent.description2}
                      onChange={handleContentChange}
                      className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg p-2 resize-none border-2 focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none"
                      rows={4}
                    />
                    <textarea
                      name="description3"
                      value={aboutContent.description3}
                      onChange={handleContentChange}
                      className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg p-2 resize-none border-2 focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none"
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

              {/* Skills */}
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Core Expertise
                </h4>
                {isEditing ? (
                  <input
                    type="text"
                    value={skillsInput}
                    onChange={(e) => setSkillsInput(e.target.value)}
                    className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg p-2 border-2 focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none"
                  />
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {aboutContent.skills.length > 0 ? (
                      aboutContent.skills.map((skill, index) => (
                        <motion.span
                          key={index}
                          whileHover={{ scale: 1.05 }}
                          className="px-4 py-2 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-orange-500/30 rounded-full text-orange-500 font-medium"
                        >
                          {skill}
                        </motion.span>
                      ))
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 italic">
                        No skills specified
                      </p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Stats */}
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
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-500/10 to-red-500/10 rounded-full mb-4 group-hover:from-yellow-500/20 group-hover:to-red-500/20 transition-all duration-200">
                  <stat.icon className="w-8 h-8 text-orange-500" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {isEditing ? (
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) => handleStatChange(e, stat.key)}
                      className="w-20 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white text-center rounded-lg border-2 focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none"
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
