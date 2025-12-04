// components/Profile.tsx
import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";

const Profile = ({ profileData }) => {
  const { theme } = useTheme();

  return (
    <section
      id="our-team"
      className={`py-20 theme-transition ${theme === "dark" ? "bg-black text-gray-100" : "bg-gray-50 text-gray-900"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">{profileData.heading}</h2>
          <p className="text-lg max-w-3xl mx-auto text-center">{profileData.subheading}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {profileData.teamMembers.map((member) => (
            <motion.div
              key={member.id}
              className={`rounded-lg overflow-hidden shadow-lg ${theme === "dark" ? "bg-gray-900" : "bg-white"
                }`}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative h-60 overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
                {/* <div 
                  className="absolute bottom-0 left-0 w-full h-16 bg-opacity-90"
                  style={{ backgroundColor: "#facc15" }}
                ></div> */}
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-1 ">{member.name}</h3>
                <p className="font-medium mb-3" style={{ color: "#facc15" }}>
                  {member.role}
                </p>
                <p
                  className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"
                    } text-justify`}
                >
                  {member.bio}
                </p>
                <div className="flex justify-center mt-4 space-x-3">
                  {/* <a
                    href={member.socialLinks.twitter}
                    target="_blank"
                    className={`p-2 rounded-full ${
                      theme === "dark"
                        ? "bg-gray-800 hover:bg-gray-500"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    aria-label="X (formerly Twitter)"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <a
                    href={member.socialLinks.linkedin}
                    target="_blank"
                    className={`p-2 rounded-full ${
                      theme === "dark"
                        ? "bg-gray-800 hover:bg-gray-500"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    aria-label="LinkedIn"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a> */}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Profile;
