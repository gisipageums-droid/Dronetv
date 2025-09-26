// components/Profile.tsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";
import { toast } from "react-toastify";
import { X, Zap, Edit, Save, Plus, Trash2 } from "lucide-react";

const Profile = ({ profileData, onStateChange, userId, publishedId, templateSelection }) => {
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [pendingImages, setPendingImages] = useState<Record<number, File>>({});
  
  // Consolidated state
  const [contentState, setContentState] = useState(profileData);

  // Add this useEffect to notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(contentState);
    }
  }, [contentState, onStateChange]);

  // Update function for team members
  const updateTeamMemberField = (index, field, value) => {
    setContentState(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.map((m, i) => 
        i === index ? { ...m, [field]: value } : m
      )
    }));
  };

  // Update function for join team section
  const updateJoinTeamField = (field, value) => {
    setContentState(prev => ({
      ...prev,
      joinTeam: { ...prev.joinTeam, [field]: value }
    }));
  };

  // Add a new team member
  const addTeamMember = () => {
    setContentState(prev => ({
      ...prev,
      teamMembers: [
        ...prev.teamMembers,
        {
          id: Date.now(),
          name: "New Member",
          role: "New Role",
          image: null,
          bio: "Team member bio...",
          socialLinks: {
            twitter: "#",
            linkedin: "#"
          }
        }
      ]
    }));
  };

  // Remove a team member
  const removeTeamMember = (index) => {
    setContentState(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index)
    }));
  };

  // Update social links
  const updateSocialLink = (index, platform, value) => {
    setContentState(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.map((m, i) => 
        i === index ? { 
          ...m, 
          socialLinks: { ...m.socialLinks, [platform]: value } 
        } : m
      )
    }));
  };

  // Image selection handler
  const handleTeamMemberImageSelect = async (index, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('File size must be less than 5MB');
      return;
    }

    // Store the file for upload on Save
    setPendingImages(prev => ({ ...prev, [index]: file }));
    
    // Show immediate local preview
    const reader = new FileReader();
    reader.onloadend = () => {
      updateTeamMemberField(index, "image", reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Save button handler - uploads images and stores S3 URLs
  const handleSave = async () => {
    try {
      setIsUploading(true);

      // Upload all pending images
      for (const [indexStr, file] of Object.entries(pendingImages)) {
        const index = parseInt(indexStr);
        
        if (!userId || !publishedId || !templateSelection) {
          console.error('Missing required props:', { userId, publishedId, templateSelection });
          toast.error('Missing user information. Please refresh and try again.');
          return;
        }
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('sectionName', 'profile');
        formData.append('imageField', `teamMembers[${index}].image`);
        formData.append('templateSelection', templateSelection);

        const uploadResponse = await fetch(`https://o66ziwsye5.execute-api.ap-south-1.amazonaws.com/prod/upload-image/${userId}/${publishedId}`, {
          method: 'POST',
          body: formData,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          // Replace local preview with S3 URL
          updateTeamMemberField(index, "image", uploadData.imageUrl);
          console.log('Image uploaded to S3:', uploadData.imageUrl);
        } else {
          const errorData = await uploadResponse.json();
          console.error('Image upload failed:', errorData);
          toast.error(`Image upload failed: ${errorData.message || 'Unknown error'}`);
          return; // Don't exit edit mode
        }
      }
      
      // Clear pending images
      setPendingImages({});
      // Exit edit mode
      setIsEditing(false);
      toast.success('Profile section saved with S3 URLs ready for publish');

    } catch (error) {
      console.error('Error saving profile section:', error);
      toast.error('Error saving changes. Please try again.');
      // Keep in edit mode so user can retry
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section 
      id="profile" 
      className={`py-20 theme-transition ${
        theme === "dark" 
          ? "bg-black text-gray-100" 
          : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Edit/Save Buttons */}
        <div className="flex justify-end mb-6">
          {isEditing ? (
            <motion.button 
              whileTap={{scale:0.9}}
              whileHover={{y:-1,scaleX:1.1}}
              onClick={handleSave}
              disabled={isUploading}
              className={`${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:shadow-2xl'} text-white px-4 py-2 rounded shadow-xl hover:font-semibold flex items-center gap-2`}
            >
              <Save size={16} />
              {isUploading ? 'Uploading...' : 'Save'}
            </motion.button>
          ) : (
            <motion.button 
              whileTap={{scale:0.9}}
              whileHover={{y:-1,scaleX:1.1}}
              onClick={() => setIsEditing(true)} 
              className="bg-yellow-500 text-black px-4 py-2 rounded cursor-pointer hover:shadow-2xl shadow-xl hover:font-semibold flex items-center gap-2"
            >
              <Edit size={16} />
              Edit
            </motion.button>
          )}
        </div>

        <div className="text-center mb-16">
          {isEditing ? (
            <input
              type="text"
              value={contentState.heading}
              onChange={(e) => setContentState(prev => ({ ...prev, heading: e.target.value }))}
              className="text-3xl font-bold mb-4 border-b bg-transparent text-center"
            />
          ) : (
            <h2 className="text-3xl font-bold mb-4">{contentState.heading}</h2>
          )}
          
          {isEditing ? (
            <textarea
              value={contentState.subheading}
              onChange={(e) => setContentState(prev => ({ ...prev, subheading: e.target.value }))}
              className="text-lg max-w-3xl mx-auto border-b bg-transparent text-center w-full"
            />
          ) : (
            <p className="text-lg max-w-3xl mx-auto">
              {contentState.subheading}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {contentState.teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              className={`rounded-lg overflow-hidden shadow-lg ${
                theme === "dark" ? "bg-gray-900" : "bg-white"
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
                
                {isEditing && (
                  <motion.div
                    animate={{opacity:[0,1], scale:[0.8,1]}}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{scale:0.9}}
                    transition={{ duration: 0.3 }}
                    className="absolute mx-2 bottom-2 left-2 z-50 bg-white/80 p-1 rounded"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="text-xs w-full cursor-pointer"
                      onChange={(e) => handleTeamMemberImageSelect(index, e)}
                    />
                    {pendingImages[index] && (
                      <p className="text-xs text-orange-600 mt-1">
                        Image selected: {pendingImages[index].name} (will upload on save)
                      </p>
                    )}
                  </motion.div>
                )}
                
                {/* <div 
                  className="absolute bottom-0 left-0 w-full h-16 bg-opacity-90"
                  style={{ backgroundColor: "#facc15" }}
                ></div> */}
              </div>
              <div className="p-6 text-center">
                {isEditing ? (
                  <input
                    value={member.name}
                    onChange={(e) => updateTeamMemberField(index, "name", e.target.value)}
                    className="text-xl font-semibold mb-1 border-b bg-transparent text-center w-full"
                  />
                ) : (
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                )}
                
                {isEditing ? (
                  <input
                    value={member.role}
                    onChange={(e) => updateTeamMemberField(index, "role", e.target.value)}
                    className="font-medium mb-3 border-b bg-transparent text-center w-full"
                    style={{ color: "#facc15" }}
                  />
                ) : (
                  <p 
                    className="font-medium mb-3"
                    style={{ color: "#facc15" }}
                  >
                    {member.role}
                  </p>
                )}
                
                {isEditing ? (
                  <textarea
                    value={member.bio}
                    onChange={(e) => updateTeamMemberField(index, "bio", e.target.value)}
                    className={`text-sm border-b bg-transparent text-center w-full ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
                  />
                ) : (
                  <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                    {member.bio}
                  </p>
                )}
                
                <div className="flex justify-center mt-4 space-x-3">
                  {isEditing ? (
                    <>
                      <input
                        value={member.socialLinks.twitter}
                        onChange={(e) => updateSocialLink(index, "twitter", e.target.value)}
                        className="text-xs border-b bg-transparent text-center w-20"
                        placeholder="Twitter URL"
                      />
                      <input
                        value={member.socialLinks.linkedin}
                        onChange={(e) => updateSocialLink(index, "linkedin", e.target.value)}
                        className="text-xs border-b bg-transparent text-center w-20"
                        placeholder="LinkedIn URL"
                      />
                    </>
                  ) : (
                    <>
                      <a
                        href={member.socialLinks.twitter}
                        target="_black"
                        className={`p-2 rounded-full ${
                          theme === "dark" 
                            ? "bg-gray-800 hover:bg-gray-500" 
                            : "bg-gray-100 hover:bg-gray-200"
                        }`}
                        aria-label="Twitter"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
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
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                      </a>
                    </>
                  )}
                </div>
                
                {isEditing && (
                  <motion.button
                    whileHover={{scale:1.1}}
                    whileTap={{scale:0.9}}
                    onClick={() => removeTeamMember(index)}
                    className="mt-4 text-red-500 text-sm flex items-center justify-center gap-1 mx-auto"
                  >
                    <Trash2 size={14} />
                    Remove
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
          
          {isEditing && (
            <motion.div 
              className={`rounded-lg flex items-center justify-center border-dashed ${
                theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-300"
              } border-2`}
              whileHover={{ scale: 1.02 }}
            >
              <motion.button 
                onClick={addTeamMember}
                className="flex flex-col items-center p-6 text-green-600"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Plus size={32} />
                <span className="mt-2">Add Team Member</span>
              </motion.button>
            </motion.div>
          )}
        </div>

        
      </div>
    </section>
  );
};



export default Profile;