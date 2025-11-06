// components/Profile.tsx
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";
import { toast } from "react-toastify";
import { X, Zap, Edit, Save, Plus, Trash2, ZoomIn } from "lucide-react";
import Cropper from "react-easy-crop";

const Profile = ({
  profileData,
  onStateChange,
  userId,
  publishedId,
  templateSelection,
}) => {
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [pendingImages, setPendingImages] = useState<Record<number, File>>({});

  // Cropping states
  const [showCropper, setShowCropper] = useState(false);
  const [croppingIndex, setCroppingIndex] = useState<number | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(4 / 3);

  // Text field limits
  const TEXT_LIMITS = {
    heading: 60,
    subheading: 120,
    memberName: 40,
    memberRole: 30,
    memberBio: 150,
    socialLink: 100,
  };

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
    setContentState((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.map((m, i) =>
        i === index ? { ...m, [field]: value } : m
      ),
    }));
  };

  // Add a new team member
  const addTeamMember = () => {
    setContentState((prev) => ({
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
            linkedin: "#",
          },
        },
      ],
    }));
  };

  // Remove a team member
  const removeTeamMember = (index) => {
    setContentState((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index),
    }));
  };

  // Update social links
  const updateSocialLink = (index, platform, value) => {
    setContentState((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.map((m, i) =>
        i === index
          ? {
              ...m,
              socialLinks: { ...m.socialLinks, [platform]: value },
            }
          : m
      ),
    }));
  };

  // Image selection handler - now opens cropper
  const handleTeamMemberImageSelect = async (index, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageToCrop(reader.result);
      setOriginalFile(file);
      setCroppingIndex(index);
      setShowCropper(true);
      setAspectRatio(4 / 3); // Default to 3:4 for profile
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
    };
    reader.readAsDataURL(file);

    // Clear the file input
    e.target.value = "";
  };

  // Cropper functions
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Helper function to create image element
  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  // Function to get cropped image
  const getCroppedImg = async (imageSrc, pixelCrop, rotation = 0) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.translate(pixelCrop.width / 2, pixelCrop.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-pixelCrop.width / 2, -pixelCrop.height / 2);

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          const fileName = originalFile
            ? `cropped-profile-${croppingIndex}-${originalFile.name}`
            : `cropped-profile-${croppingIndex}-${Date.now()}.jpg`;

          const file = new File([blob], fileName, {
            type: "image/jpeg",
            lastModified: Date.now(),
          });

          const previewUrl = URL.createObjectURL(blob);

          resolve({
            file,
            previewUrl,
          });
        },
        "image/jpeg",
        0.95
      );
    });
  };

  // Apply crop and set pending file
  const applyCrop = async () => {
    try {
      if (!imageToCrop || !croppedAreaPixels || croppingIndex === null) return;

      const { file, previewUrl } = await getCroppedImg(
        imageToCrop,
        croppedAreaPixels,
        rotation
      );

      // Update preview immediately with blob URL (temporary)
      updateTeamMemberField(croppingIndex, "image", previewUrl);

      // Set the actual file for upload on save
      setPendingImages((prev) => ({ ...prev, [croppingIndex]: file }));
      console.log("Profile image cropped, file ready for upload:", file);

      toast.success("Image cropped successfully! Click Save to upload to S3.");
      setShowCropper(false);
      setImageToCrop(null);
      setOriginalFile(null);
      setCroppingIndex(null);
    } catch (error) {
      console.error("Error cropping image:", error);
      toast.error("Error cropping image. Please try again.");
    }
  };

  // Cancel cropping
  const cancelCrop = () => {
    setShowCropper(false);
    setImageToCrop(null);
    setOriginalFile(null);
    setCroppingIndex(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
  };

  // Reset zoom and rotation
  const resetCropSettings = () => {
    setZoom(1);
    setRotation(0);
    setCrop({ x: 0, y: 0 });
  };

  // Save button handler - uploads images and stores S3 URLs
  const handleSave = async () => {
    try {
      setIsUploading(true);

      // Upload all pending images
      for (const [indexStr, file] of Object.entries(pendingImages)) {
        const index = parseInt(indexStr);

        if (!userId || !publishedId || !templateSelection) {
          console.error("Missing required props:", {
            userId,
            publishedId,
            templateSelection,
          });
          toast.error(
            "Missing user information. Please refresh and try again."
          );
          return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("sectionName", "profile");
        formData.append(
          "imageField",
          `teamMembers[${index}].image` + Date.now()
        );
        formData.append("templateSelection", templateSelection);

        console.log("Uploading profile image to S3:", file);

        const uploadResponse = await fetch(
          `https://o66ziwsye5.execute-api.ap-south-1.amazonaws.com/prod/upload-image/${userId}/${publishedId}`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          // Replace local preview with S3 URL
          updateTeamMemberField(index, "image", uploadData.imageUrl);
          console.log("Image uploaded to S3:", uploadData.imageUrl);
        } else {
          const errorData = await uploadResponse.json();
          console.error("Image upload failed:", errorData);
          toast.error(
            `Image upload failed: ${errorData.message || "Unknown error"}`
          );
          return;
        }
      }

      // Clear pending images
      setPendingImages({});
      // Exit edit mode
      setIsEditing(false);
      toast.success("Profile section saved with S3 URLs!");
    } catch (error) {
      console.error("Error saving profile section:", error);
      toast.error("Error saving changes. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      {/* Image Cropper Modal - Profile (Same as Clients) */}
      {showCropper && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/90 z-[99999999] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl max-w-4xl w-full h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Crop Profile Image
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Recommended: 100×100px (1:1 ratio) - square
                </p>
              </div>
              <button
                onClick={cancelCrop}
                className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Cropper Area */}
            <div className="flex-1 relative bg-gray-900 min-h-0">
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={aspectRatio}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                showGrid={false}
                cropShape="rect"
                style={{
                  containerStyle: {
                    position: "relative",
                    width: "100%",
                    height: "100%",
                  },
                  cropAreaStyle: {
                    border: "2px solid white",
                    borderRadius: "8px",
                  },
                }}
              />
            </div>

            {/* Controls */}
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              {/* Aspect Ratio Buttons */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Aspect Ratio:
                </p>
                <div className="flex gap-2">
                  {/* <button
                    onClick={() => setAspectRatio(3 / 4)}
                    className={`px-3 py-2 text-sm rounded border ${
                      aspectRatio === 3 / 4
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-700 border-gray-300"
                    }`}
                  >
                    3:4 (Portrait)
                  </button> */}
                  {/* <button
                    onClick={() => setAspectRatio(1)}
                    className={`px-3 py-2 text-sm rounded border ${
                      aspectRatio === 1
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-700 border-gray-300"
                    }`}
                  >
                    1:1 (Square)
                  </button> */}
                  <button
                    onClick={() => setAspectRatio(4 / 3)}
                    className={`px-3 py-2 text-sm rounded border ${
                      aspectRatio === 4 / 3
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-700 border-gray-300"
                    }`}
                  >
                    4:3 (Standard)
                  </button>
                </div>
              </div>

              {/* Zoom Control */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-gray-700">
                    <ZoomIn className="w-4 h-4" />
                    Zoom
                  </span>
                  <span className="text-gray-600">{zoom.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={resetCropSettings}
                  className="w-full border border-gray-300 text-gray-700 hover:bg-gray-100 rounded py-2 text-sm"
                >
                  Reset
                </button>
                <button
                  onClick={cancelCrop}
                  className="w-full border border-gray-300 text-gray-700 hover:bg-gray-100 rounded py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={applyCrop}
                  className="w-full bg-green-600 hover:bg-green-700 text-white rounded py-2 text-sm"
                >
                  Apply Crop
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Main Profile Section */}
      <section
        id="our-team"
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
                whileTap={{ scale: 0.9 }}
                whileHover={{ y: -1, scaleX: 1.1 }}
                onClick={handleSave}
                disabled={isUploading}
                className={`${
                  isUploading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:shadow-2xl"
                } text-white px-4 py-2 rounded shadow-xl hover:font-semibold flex items-center gap-2`}
              >
                <Save size={16} />
                {isUploading ? "Uploading..." : "Save"}
              </motion.button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ y: -1, scaleX: 1.1 }}
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
              <div className="relative">
                <input
                  type="text"
                  value={contentState.heading}
                  onChange={(e) =>
                    setContentState((prev) => ({
                      ...prev,
                      heading: e.target.value,
                    }))
                  }
                  maxLength={TEXT_LIMITS.heading}
                  className={`text-3xl font-bold mb-4 border-b bg-transparent text-center w-full max-w-2xl mx-auto ${
                    contentState.heading.length >= TEXT_LIMITS.heading
                      ? "border-red-500"
                      : ""
                  }`}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <div>
                    {contentState.heading.length >= TEXT_LIMITS.heading && (
                      <span className="text-red-500 font-bold">
                        ⚠️ Character limit reached!
                      </span>
                    )}
                  </div>
                  <div>
                    {contentState.heading.length}/{TEXT_LIMITS.heading}
                  </div>
                </div>
              </div>
            ) : (
              <h2 className="text-3xl font-bold mb-4">
                {contentState.heading}
              </h2>
            )}

            {isEditing ? (
              <div className="relative">
                <textarea
                  value={contentState.subheading}
                  onChange={(e) =>
                    setContentState((prev) => ({
                      ...prev,
                      subheading: e.target.value,
                    }))
                  }
                  maxLength={TEXT_LIMITS.subheading}
                  className={`text-lg max-w-3xl mx-auto border-b bg-transparent text-center w-full ${
                    contentState.subheading.length >= TEXT_LIMITS.subheading
                      ? "border-red-500"
                      : ""
                  }`}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <div>
                    {contentState.subheading.length >=
                      TEXT_LIMITS.subheading && (
                      <span className="text-red-500 font-bold">
                        ⚠️ Character limit reached!
                      </span>
                    )}
                  </div>
                  <div>
                    {contentState.subheading.length}/{TEXT_LIMITS.subheading}
                  </div>
                </div>
              </div>
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
                      animate={{ opacity: [0, 1], scale: [0.8, 1] }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="absolute mx-2 bottom-2 left-2 z-50 bg-white/80 p-1 rounded"
                    >
                      <div className="text-xs text-gray-600 mb-1">
                        Recommended: 100×100px (1:1)
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="text-xs w-full cursor-pointer font-bold"
                        onChange={(e) => handleTeamMemberImageSelect(index, e)}
                      />
                      {pendingImages[index] && (
                        <p className="text-xs text-green-600 mt-1">
                          ✓ Image cropped and ready to upload
                        </p>
                      )}
                    </motion.div>
                  )}
                </div>
                <div className="p-6 text-center">
                  {isEditing ? (
                    <div className="relative mb-1">
                      <input
                        value={member.name}
                        onChange={(e) =>
                          updateTeamMemberField(index, "name", e.target.value)
                        }
                        maxLength={TEXT_LIMITS.memberName}
                        className={`text-xl font-semibold border-b bg-transparent text-center w-full ${
                          member.name.length >= TEXT_LIMITS.memberName
                            ? "border-red-500"
                            : ""
                        }`}
                      />
                      <div className="text-right text-xs text-gray-500 mt-1">
                        {member.name.length}/{TEXT_LIMITS.memberName}
                      </div>
                    </div>
                  ) : (
                    <h3 className="text-xl font-semibold mb-1">
                      {member.name}
                    </h3>
                  )}

                  {isEditing ? (
                    <div className="relative mb-3">
                      <input
                        value={member.role}
                        onChange={(e) =>
                          updateTeamMemberField(index, "role", e.target.value)
                        }
                        maxLength={TEXT_LIMITS.memberRole}
                        className={`font-medium border-b bg-transparent text-center w-full ${
                          member.role.length >= TEXT_LIMITS.memberRole
                            ? "border-red-500"
                            : ""
                        }`}
                        style={{ color: "#facc15" }}
                      />
                      <div className="text-right text-xs text-gray-500 mt-1">
                        {member.role.length}/{TEXT_LIMITS.memberRole}
                      </div>
                    </div>
                  ) : (
                    <p
                      className="font-medium mb-3"
                      style={{ color: "#facc15" }}
                    >
                      {member.role}
                    </p>
                  )}

                  {isEditing ? (
                    <div className="relative">
                      <textarea
                        value={member.bio}
                        onChange={(e) =>
                          updateTeamMemberField(index, "bio", e.target.value)
                        }
                        maxLength={TEXT_LIMITS.memberBio}
                        className={`text-sm border-b bg-transparent text-center w-full ${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        } ${
                          member.bio.length >= TEXT_LIMITS.memberBio
                            ? "border-red-500"
                            : ""
                        }`}
                      />
                      <div className="text-right text-xs text-gray-500 mt-1">
                        {member.bio.length}/{TEXT_LIMITS.memberBio}
                      </div>
                    </div>
                  ) : (
                    <p
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {member.bio}
                    </p>
                  )}
{/* 
                  <div className="flex justify-center mt-4 space-x-3">
                    {isEditing ? (
                      <>
                        <div className="relative">
                          <input
                            value={member.socialLinks.twitter}
                            onChange={(e) =>
                              updateSocialLink(index, "twitter", e.target.value)
                            }
                            maxLength={TEXT_LIMITS.socialLink}
                            className={`text-xs border-b bg-transparent text-center w-20 ${
                              member.socialLinks.twitter.length >=
                              TEXT_LIMITS.socialLink
                                ? "border-red-500"
                                : ""
                            }`}
                            placeholder="Twitter URL"
                          />
                          <div className="text-right text-xs text-gray-500 mt-1">
                            {member.socialLinks.twitter.length}/
                            {TEXT_LIMITS.socialLink}
                          </div>
                        </div>
                        <div className="relative">
                          <input
                            value={member.socialLinks.linkedin}
                            onChange={(e) =>
                              updateSocialLink(
                                index,
                                "linkedin",
                                e.target.value
                              )
                            }
                            maxLength={TEXT_LIMITS.socialLink}
                            className={`text-xs border-b bg-transparent text-center w-20 ${
                              member.socialLinks.linkedin.length >=
                              TEXT_LIMITS.socialLink
                                ? "border-red-500"
                                : ""
                            }`}
                            placeholder="LinkedIn URL"
                          />
                          <div className="text-right text-xs text-gray-500 mt-1">
                            {member.socialLinks.linkedin.length}/
                            {TEXT_LIMITS.socialLink}
                          </div>
                        </div>
                      </>
                    ) : (
                      <> */}
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
                      {/* </> */}
                    {/* )} */}
                  {/* </div> */}

                  {isEditing && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
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
                  theme === "dark"
                    ? "bg-gray-900 border-gray-700"
                    : "bg-white border-gray-300"
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
    </>
  );
};

// Default profile data structure
Profile.defaultProps = {
  profileData: {
    heading: "Our Team",
    subheading: "Meet the talented individuals who make our company great",
    teamMembers: [
      {
        id: 1,
        name: "John Smith",
        role: "CEO & Founder",
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
        bio: "10+ years of experience in business development and strategic planning.",
        socialLinks: {
          twitter: "#",
          linkedin: "#",
        },
      },
      // ... other team members
    ],
    joinTeam: {
      title: "Join Our Team",
      description:
        "We're always looking for talented individuals to join our growing team.",
      buttonText: "View Open Positions",
    },
  },
};

export default Profile;
