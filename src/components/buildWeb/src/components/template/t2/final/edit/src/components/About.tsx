import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  CheckCircle,
  Eye,
  Target,
  Rocket,
  Globe,
  Users,
  Heart,
  Shield,
  Lightbulb,
  Handshake
} from "lucide-react";
import { toast } from "react-toastify";

export default function About2({ aboutData, onStateChange, userId, publishedId, templateSelection }) {
  const [isEditing, setIsEditing] = useState(false);
  const [pendingImageFile, setPendingImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

   // Map the string icons to Lucide React components
  const iconMap = {
    "Shield": Shield,
    "Lightbulb": Lightbulb,
    "Target": Target,
    "Handshake": Handshake,
    "Globe": Globe,
    "Users": Users,
    "Rocket": Rocket,
    "Heart": Heart,
    // Add more mappings as needed
  };

  // Function to process aboutData and ensure icons are proper components
  const processAboutData = (data) => {
    if (!data) return null;
    
    return {
      ...data,
      visionPillars: data.visionPillars && data.visionPillars.map(pillar => ({
        ...pillar,
        icon: iconMap[pillar.icon] || Globe // Fallback to Globe if icon not found
      }))
    };
  };


  // Consolidated state
const [aboutState, setAboutState] = useState(processAboutData(aboutData));

    // Add this useEffect to notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(aboutState);
    }
  }, [aboutState, onStateChange]);
  // Update function for simple fields
  const updateField = (field, value) => {
    setAboutState((prev) => ({ ...prev, [field]: value }));
  };

  // Update function for features
  const updateFeature = (index, value) => {
    setAboutState((prev) => ({
      ...prev,
      features: prev.features.map((f, i) => (i === index ? value : f)),
    }));
  };

  // Add a new feature
  const addFeature = () => {
    setAboutState((prev) => ({
      ...prev,
      features: [...prev.features, "New Feature"],
    }));
  };

  // Update function for vision pillars
  const updatePillar = (index, field, value) => {
    setAboutState((prev) => ({
      ...prev,
      visionPillars: prev.visionPillars.map((p, i) =>
        i === index ? { ...p, [field]: value } : p
      ),
    }));
  };

  // Image selection - only shows local preview, no upload yet
  const handleImageUpload = (e) => {
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
    setPendingImageFile(file);
    
    // Show immediate local preview
    const reader = new FileReader();
    reader.onloadend = () => {
      updateField("imageUrl", reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Updated Save button handler - uploads image and stores S3 URL
  const handleSave = async () => {
    try {
      setIsUploading(true);

      // If there's a pending image, upload it first
      if (pendingImageFile) {
        if (!userId || !publishedId || !templateSelection) {
          console.error('Missing required props:', { userId, publishedId, templateSelection });
          toast.error('Missing user information. Please refresh and try again.');
          return;
        }
        
        const formData = new FormData();
        formData.append('file', pendingImageFile);
        formData.append('sectionName', 'about');
        formData.append('imageField', 'imageUrl'); // This will map to 'imageUrl' in your PUT lambda
        formData.append('templateSelection', templateSelection);

        const uploadResponse = await fetch(`https://o66ziwsye5.execute-api.ap-south-1.amazonaws.com/prod/upload-image/${userId}/${publishedId}`, {
          method: 'POST',
          body: formData,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          // Replace local preview with S3 URL
          updateField("imageUrl", uploadData.imageUrl);
          setPendingImageFile(null); // Clear pending file
          console.log('Image uploaded to S3:', uploadData.imageUrl);
        } else {
          const errorData = await uploadResponse.json();
          console.error('Image upload failed:', errorData);
          toast.error(`Image upload failed: ${errorData.message || 'Unknown error'}`);
          return; // Don't exit edit mode
        }
      }
      
      // Exit edit mode
      setIsEditing(false);
      toast.success('About section saved with S3 URLs ready for publish');

    } catch (error) {
      console.error('Error saving about section:', error);
      toast.error('Error saving changes. Please try again.');
      // Keep in edit mode so user can retry
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section id="about" className="py-20 bg-secondary theme-transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Edit / Save */}
        <div className="flex justify-end mt-6">
          {isEditing ? (
            <motion.button
            whileTap={{scale:0.9}}
              whileHover={{ y: -1, scaleX: 1.1 }}
              onClick={handleSave}
              disabled={isUploading}
              className={`${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:shadow-2xl'} text-white px-4 py-2 rounded shadow-xl hover:font-semibold`}
            >
              {isUploading ? 'Uploading...' : 'Save'}
            </motion.button>
          ) : (
            <motion.button
            whileTap={{scale:0.9}}
              whileHover={{ y: -1, scaleX: 1.1 }}
              onClick={() => setIsEditing(true)}
              className="bg-yellow-500 text-black px-4 py-2 rounded cursor-pointer  hover:shadow-2xl shadow-xl hover:font-semibold"
            >
              Edit
            </motion.button>
          )}
        </div>

        {/* Main About Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Image */}
          <motion.div
            className="relative rounded-2xl overflow-hidden shadow-xl"
            whileInView={{ opacity: [0, 1], x: [-50, 0] }}
            transition={{ duration: 0.8 }}
          >
            <img
              src={aboutState.imageUrl}
              alt="About"
              className="w-full h-[400px] object-cover"
            />
            {isEditing && (
              <div className="absolute bottom-4 left-4 bg-white/80 p-2 rounded shadow">
                <p className="text-sm mb-1">Change About Image:</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="text-sm border-2 border-dashed border-muted-foreground p-2 rounded w-full"
                />
                {pendingImageFile && (
                  <p className="text-xs text-orange-600 mt-1">
                    Image selected: {pendingImageFile.name} (will upload on save)
                  </p>
                )}
              </div>
            )}
          </motion.div>

          {/* Content */}
          <div className="space-y-8">
            <motion.div
              className="space-y-4"
              whileInView={{ opacity: [0, 1], x: [50, 0] }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {isEditing ? (
                <input
                  value={aboutState.aboutTitle}
                  onChange={(e) => updateField("aboutTitle", e.target.value)}
                  className="bg-transparent border-b border-primary text-3xl md:text-4xl text-foreground outline-none"
                />
              ) : (
                <h2 className="text-3xl md:text-4xl text-foreground">
                  {aboutState.aboutTitle}
                </h2>
              )}
              {isEditing ? (
                <textarea
                  value={aboutState.description1}
                  onChange={(e) => updateField("description1", e.target.value)}
                  className="w-full bg-transparent border-b border-muted-foreground text-lg text-muted-foreground outline-none"
                />
              ) : (
                <p className="text-lg text-muted-foreground">
                  {aboutState.description1}
                </p>
              )}
              {isEditing ? (
                <textarea
                  value={aboutState.description2}
                  onChange={(e) => updateField("description2", e.target.value)}
                  className="w-full bg-transparent border-b border-muted-foreground text-muted-foreground outline-none"
                />
              ) : (
                <p className="text-muted-foreground">{aboutState.description2}</p>
              )}
            </motion.div>

            {/* Features list */}
            <motion.div
              whileInView={{ opacity: [0, 1], x: [-50, 0] }}
              transition={{ duration: 1, delay: 0.5, ease: "backOut" }}
              className="space-y-3"
            >
              {aboutState.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  {isEditing ? (
                    <input
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      className="bg-transparent border-b border-muted-foreground text-muted-foreground outline-none"
                    />
                  ) : (
                    <span className="text-muted-foreground">{feature}</span>
                  )}
                </div>
              ))}
              {isEditing && (
                <motion.button
                whileTap={{scale:0.9}}
                whileHover={{scale:1.1}}
                  onClick={addFeature}
                  className="text-green-600 cursor-pointer text-sm mt-2"
                >
                  + Add Feature
                </motion.button>
              )}
            </motion.div>

            {/* Company metrics */}
            <motion.div className="grid grid-cols-2 gap-6 pt-6">
              <div className="text-center p-4 bg-card rounded-lg shadow-sm">
                {isEditing ? (
                  <input
                    value={aboutState.metric1Num}
                    onChange={(e) => updateField("metric1Num", e.target.value)}
                    className="bg-transparent border-b border-foreground text-2xl font-bold outline-none"
                  />
                ) : (
                  <motion.div
                    whileInView={{ opacity: [0, 1], y: [-15, 3, -3, 0] }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="text-2xl font-bold text-card-foreground"
                  >
                    {aboutState.metric1Num}
                  </motion.div>
                )}
                {isEditing ? (
                  <input
                    value={aboutState.metric1Label}
                    onChange={(e) =>
                      updateField("metric1Label", e.target.value)
                    }
                    className="bg-transparent border-b border-muted-foreground text-muted-foreground outline-none"
                  />
                ) : (
                  <motion.div
                    whileInView={{ opacity: [0, 1], y: [15, -3, 3, 0] }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="text-muted-foreground"
                  >
                    {aboutState.metric1Label}
                  </motion.div>
                )}
              </div>
              <div className="text-center p-4 bg-card rounded-lg shadow-sm">
                {isEditing ? (
                  <input
                    value={aboutState.metric2Num}
                    onChange={(e) => updateField("metric2Num", e.target.value)}
                    className="bg-transparent border-b border-foreground text-2xl font-bold outline-none"
                  />
                ) : (
                  <motion.div
                    whileInView={{ opacity: [0, 1], y: [-15, 3, -3, 0] }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="text-2xl font-bold text-card-foreground"
                  >
                    {aboutState.metric2Num}
                  </motion.div>
                )}
                {isEditing ? (
                  <input
                    value={aboutState.metric2Label}
                    onChange={(e) =>
                      updateField("metric2Label", e.target.value)
                    }
                    className="bg-transparent border-b border-muted-foreground text-muted-foreground outline-none"
                  />
                ) : (
                  <motion.div
                    whileInView={{ opacity: [0, 1], y: [15, -3, 3, 0] }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="text-muted-foreground"
                  >
                    {aboutState.metric2Label}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Vision Section */}
        <motion.div className="text-center mb-16">
          {isEditing ? (
            <input
              value={aboutState.visionBadge}
              onChange={(e) => updateField("visionBadge", e.target.value)}
              className="bg-transparent border-b border-primary text-primary outline-none"
            />
          ) : (
            <motion.div
              whileInView={{ opacity: [0, 1], y: [-20, 0] }}
              transition={{ duration: 0.5, ease: "backInOut" }}
              className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary mb-6"
            >
              <Eye className="w-4 h-4 mr-2" />
              <span className="font-semibold text-xl">{aboutState.visionBadge}</span>
            </motion.div>
          )}

          {isEditing ? (
            <input
              value={aboutState.visionTitle}
              onChange={(e) => updateField("visionTitle", e.target.value)}
              className="bg-transparent border-b border-foreground text-3xl md:text-4xl outline-none"
            />
          ) : (
            <motion.h2
              whileInView={{ opacity: [0, 1], x: [-20, 0] }}
              transition={{ duration: 1, ease: "backInOut" }}
              className="text-3xl md:text-4xl text-foreground mb-6"
            >
              {aboutState.visionTitle}
            </motion.h2>
          )}

          {isEditing ? (
            <textarea
              value={aboutState.visionDesc}
              onChange={(e) => updateField("visionDesc", e.target.value)}
              className="w-full bg-transparent border-b border-muted-foreground text-lg text-muted-foreground outline-none"
            />
          ) : (
            <motion.p
              whileInView={{ opacity: [0, 1], x: [20, 0] }}
              transition={{ duration: 1, ease: "backOut" }}
              className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12"
            >
              {aboutState.visionDesc}
            </motion.p>
          )}

          {/* Vision Pillars */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {aboutState.visionPillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  whileInView={{ opacity: [0, 1], scale: [0, 1] }}
                  transition={{ duration: 1, ease: "backInOut" }}
                  key={index}
                  className="text-center p-6 bg-card rounded-xl shadow-sm hover:shadow-lg"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  {isEditing ? (
                    <input
                      value={pillar.title}
                      onChange={(e) =>
                        updatePillar(index, "title", e.target.value)
                      }
                      className="bg-transparent border-b border-foreground font-semibold outline-none"
                    />
                  ) : (
                    <h3 className="font-semibold text-card-foreground mb-3">
                      {pillar.title}
                    </h3>
                  )}
                  {isEditing ? (
                    <textarea
                      value={pillar.description}
                      onChange={(e) =>
                        updatePillar(index, "description", e.target.value)
                      }
                      className="w-full bg-transparent border-b border-muted-foreground text-sm text-muted-foreground outline-none"
                    />
                  ) : (
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {pillar.description}
                    </p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Mission Section */}
        <motion.div className="bg-gradient-to-r from-primary/5 to-red-accent/5 rounded-2xl p-12 text-center">
          <Target className="w-12 h-12 text-primary mx-auto mb-6" />
          {isEditing ? (
            <input
              value={aboutState.missionTitle}
              onChange={(e) => updateField("missionTitle", e.target.value)}
              className="bg-transparent border-b border-foreground text-2xl font-semibold outline-none"
            />
          ) : (
            <motion.h3
            whileInView={{opacity:[0,1],scale:[0,1],y:[-20,0]}}
            transition={{duration:1,ease:"backInOut"}}
            className="text-2xl font-semibold text-foreground mb-6">
              {aboutState.missionTitle}
            </motion.h3>
          )}
          {isEditing ? (
            <textarea
              value={aboutState.missionDesc}
              onChange={(e) => updateField("missionDesc", e.target.value)}
              className="w-full bg-transparent border-b border-muted-foreground text-lg text-muted-foreground outline-none"
            />
          ) : (
            <motion.p 
            whileInView={{opacity:[0,1],x:[-40,0]}}
            transition={{duration:1,ease:"backInOut"}}
            className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
              {aboutState.missionDesc}
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  );
}