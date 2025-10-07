import React, { useState, useEffect } from "react";
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
  Phone,
} from "lucide-react";
import { toast } from "sonner";

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
  content?: HeroContent;
  onSave?: (updatedContent: HeroContent) => void;
  userId: string | undefined;
}

const Hero: React.FC<HeroProps> = ({ content, onSave, userId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [heroContent, setHeroContent] = useState<HeroContent>({
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

  // update state if props change
  useEffect(() => {
    if (content) setHeroContent(content);
  }, [content]);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", userId!);
      formData.append("fieldName", "heroImage");

      const uploadResponse = await fetch(
        `https://ow3v94b9gf.execute-api.ap-south-1.amazonaws.com/dev/`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (uploadResponse.ok) {
        const uploadData = await uploadResponse.json();
        setHeroContent((prev) => ({
          ...prev,
          image: uploadData.s3Url,
        }));
        toast.success("Image uploaded successfully!");
      } else {
        const errorData = await uploadResponse.json();
        toast.error(
          `Image upload failed: ${errorData.message || "Unknown error"}`
        );
        return;
      }

      setIsUploading(false);
    }
  };

  const handleSave = () => {
    if (onSave) onSave(heroContent); // ✅ update parent state
    toast.success("Hero section updated successfully!");
    setIsEditing(false);
  };

  const socialLinks = [
    {
      name: "Twitter",
      icon: Twitter,
      url: heroContent.socials.twitter,
      color: "hover:text-blue-400",
      key: "twitter",
    },
    {
      name: "Instagram",
      icon: Instagram,
      url: heroContent.socials.instagram,
      color: "hover:text-pink-400",
      key: "instagram",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: heroContent.socials.linkedin,
      color: "hover:text-blue-600",
      key: "linkedin",
    },
    {
      name: "GitHub",
      icon: Github,
      url: heroContent.socials.github,
      color: "hover:text-gray-400",
      key: "github",
    },
    {
      name: "Email",
      icon: Mail,
      url: heroContent.socials.email
        ? `mailto:${heroContent.socials.email}`
        : undefined,
      color: "hover:text-green-400",
      key: "email",
    },
    {
      name: "Phone",
      icon: Phone,
      url: heroContent.socials.phone
        ? `tel:${heroContent.socials.phone}`
        : undefined,
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
        {/* Edit Button */}
        <div className="absolute top-10 right-8 px-4 py-2 rounded-full flex items-center gap-2 font-semibold shadow-lg transition-all duration-300 hover:scale-105">
          {isEditing ? (
            <div className="absolute top-0 right-0 flex items-center justify-center gap-2">
              <button
                onClick={handleSave}
                className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-full"
              >
                <Save className="w-6 h-6" />
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="absolute top-0 right-0 p-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-full"
            >
              <Edit className="w-6 h-6" />
            </button>
          )}
        </div>

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
              {isEditing ? (
                <input
                  type="text"
                  value={heroContent.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="text-4xl lg:text-6xl font-bold p-4 rounded-xl w-full border"
                />
              ) : (
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white">
                  Hi, I'm{" "}
                  <span className="text-orange-400">{heroContent.name}</span>
                </h1>
              )}

              {isEditing ? (
                <input
                  type="text"
                  value={heroContent.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className="text-xl lg:text-2xl font-semibold p-3 rounded-lg w-full border"
                />
              ) : (
                <p className="text-xl lg:text-2xl font-semibold text-blue-600 dark:text-orange-400">
                  {heroContent.title}
                </p>
              )}

              {isEditing ? (
                <textarea
                  value={heroContent.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="text-lg p-4 rounded-lg w-full border resize-none"
                  rows={4}
                />
              ) : (
                <p className="text-lg lg:text-xl text-gray-700 dark:text-gray-300">
                  {heroContent.description}
                </p>
              )}
            </div>

            {/* Social Links */}
            <div className="flex flex-wrap gap-6 items-center pt-2">
              {isEditing ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                  {socialLinks.map((social) => (
                    <div key={social.name} className="flex items-center gap-2">
                      <social.icon className="w-5 h-5" />
                      <input
                        type="text"
                        value={
                          heroContent.socials[
                            social.key as keyof typeof heroContent.socials
                          ] || ""
                        }
                        onChange={(e) =>
                          handleChange(`socials.${social.key}`, e.target.value)
                        }
                        className="flex-1 text-sm p-2 rounded-lg border"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex gap-3">
                  {socialLinks.map((social) =>
                    heroContent.socials[
                      social.key as keyof typeof heroContent.socials
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
              )}
            </div>

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
          <div className="flex justify-center lg:justify-end">
            <div className="w-80 h-80 lg:w-96 lg:h-96 rounded-full p-1 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-600">
              <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center relative">
                {isEditing ? (
                  !isUploading ? (
                    <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white cursor-pointer">
                      <Upload className="w-10 h-10" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white cursor-pointer">
                      <p className="text-center text-lg font-bold">
                        Loading...
                      </p>
                    </div>
                  )
                ) : null}
                <img
                  src={heroContent.image}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
