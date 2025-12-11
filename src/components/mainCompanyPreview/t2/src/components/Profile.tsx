
import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";

// Import local avatar images .- adjust  the path based on your project structure
import maleAvatar from "../../../../../../public/logos/maleAvatar.png";
import femaleAvatar from "../../../../../../public/logos/femaleAvatar.png";
import neutralAvatar from "../../../../../../public/logos/maleAvatar.png";

const Profile = ({ profileData }) => {
  const { theme } = useTheme();

  // Function to get avatar based on directorPrefix
  const getAvatar = (prefix) => {
    if (!prefix) return neutralAvatar;
    
    const cleanPrefix = prefix.toLowerCase().trim();
    
    if (cleanPrefix === "mr") {
      return maleAvatar;
    } else if (cleanPrefix === "mrs" || cleanPrefix === "ms") {
      return femaleAvatar;
    } else {
      return neutralAvatar;
    }
  };

  // Function to get the team member image - checks for valid image first, then falls back to avatar
  const getTeamMemberImage = (member) => {
    // If member has a valid image URL (not empty or null), use it
    if (member.image && member.image.trim() !== "" && member.image !== null) {
      return member.image;
    }
    
    // If member has a prefix field, use that for avatar
    if (member.prefix) {
      return getAvatar(member.prefix);
    }
    
    // If member has directorPrefix field, use that for avatar
    if (member.directorPrefix) {
      return getAvatar(member.directorPrefix);
    }
    
    // Default to neutral avatar
    return neutralAvatar;
  };

  // Function to get prefix display name
  const getPrefixDisplayName = (prefix) => {
    if (!prefix) return "";
    
    switch (prefix.toLowerCase()) {
      case "mr": return "Mr.";
      case "mrs": return "Mrs.";
      case "ms": return "Ms.";
      default: return "";
    }
  };

  // Helper to extract prefix from member
  const getMemberPrefix = (member) => {
    return member.prefix || member.directorPrefix || "";
  };

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
          {profileData.teamMembers.map((member) => {
            const memberPrefix = getMemberPrefix(member);
            const prefixDisplay = getPrefixDisplayName(memberPrefix);
            
            return (
              <motion.div
                key={member.id}
                className={`rounded-lg overflow-hidden shadow-lg ${theme === "dark" ? "bg-gray-900" : "bg-white"
                  }`}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={getTeamMemberImage(member)}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback if image fails to load
                      e.target.onerror = null;
                      e.target.src = getAvatar(memberPrefix);
                    }}
                  />
                </div>
                <div className="p-6 text-center">
                  {/* Show prefix if available */}
                  {prefixDisplay && (
                    <div className="text-sm text-gray-500 mb-1">
                      {prefixDisplay}
                    </div>
                  )}
                  
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
                    {/* Social icons (commented out as in original) */}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Profile;