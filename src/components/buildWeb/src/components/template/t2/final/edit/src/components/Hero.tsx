import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { ArrowRight, Play, CheckCircle } from "lucide-react";
import {toast} from "react-toastify"
import { motion } from "motion/react";

export default function Hero({ heroData, onStateChange, userId, publishedId, templateSelection }) {
  const [isEditing, setIsEditing] = useState(false);
  const [pendingImageFile, setPendingImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Consolidated state
  const [heroState, setHeroState] = useState(heroData);

  // Add this useEffect to notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(heroState);
    }
  }, [heroState, onStateChange]);

  // Update function for simple fields
  const updateField = (field, value) => {
    setHeroState(prev => ({ ...prev, [field]: value }));
  };

  // Stats functions
  const updateStat = (id, field, value) => {
    setHeroState(prev => ({
      ...prev,
      stats: prev.stats.map(s => s.id === id ? { ...s, [field]: value } : s)
    }));
  };

  const addStat = () => {
    setHeroState(prev => ({
      ...prev,
      stats: [
        ...prev.stats,
        { id: Date.now(), value: "0", label: "New Stat", color: "primary" }
      ]
    }));
  };

  const removeStat = (id) => {
    setHeroState(prev => ({
      ...prev,
      stats: prev.stats.filter(s => s.id !== id)
    }));
  };

  // Image selection - only shows local preview, no upload yet
  const handleHeroImageUpload = (e) => {
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
      updateField("heroImage", reader.result);
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
        formData.append('sectionName', 'hero');
        formData.append('imageField', 'heroImage'); // This will map to 'backgroundImage' in your PUT lambda
        formData.append('templateSelection', templateSelection);

        const uploadResponse = await fetch(`https://o66ziwsye5.execute-api.ap-south-1.amazonaws.com/prod/upload-image/${userId}/${publishedId}`, {
          method: 'POST',
          body: formData,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          // Replace local preview with S3 URL
          updateField("heroImage", uploadData.imageUrl);
          setPendingImageFile(null); // Clear pending file
          console.log('Image uploaded to S3:', uploadData.imageUrl);
        } else {
          const errorData = await uploadResponse.json();
          console.error('Image upload failed:', errorData);
          alert(`Image upload failed: ${errorData.message || 'Unknown error'}`);
          return; // Don't exit edit mode
        }
      }
      
      // Exit edit mode
      setIsEditing(false);
      toast.success('Hero section saved with S3 URLs ready for publish');

    } catch (error) {
      console.error('Error saving hero section:', error);
      toast.error('Error saving changes. Please try again.');
      // Keep in edit mode so user can retry
    } finally {
      setIsUploading(false);
    }
  };

  // Animations
  const containerVariants = { 
    hidden: { opacity: 0 }, 
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.3, 
        delayChildren: 0.2 
      } 
    } 
  };
  
  const itemVariants = { 
    hidden: { y: 50, opacity: 0 }, 
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        duration: 0.8, 
        ease: "easeOut" 
      } 
    } 
  };
  
  const floatingVariants = { 
    animate: { 
      y: [-10, 10, -10], 
      transition: { 
        duration: 4, 
        repeat: Infinity, 
        ease: "easeInOut" 
      } 
    } 
  };

  return (
    <section id="home" className="pt-20 mt-[4rem] pb-16 bg-background relative overflow-hidden theme-transition">
      {/* Background decorations */}
      <motion.div className="absolute top-20 right-0 w-72 h-72 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" animate={{ scale: [1, 1.1, 1], rotate: [0, 180, 360] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} />
      <motion.div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/3 rounded-full translate-y-1/2 -translate-x-1/2" animate={{ scale: [1, 1.2, 1], rotate: [0, -180, -360] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} />
      <motion.div className="absolute top-40 right-20 w-20 h-20 bg-red-accent/10 rounded-full" variants={floatingVariants} animate="animate" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div className="space-y-8" variants={containerVariants} initial="hidden" animate="visible">
            <div className="space-y-4">
              {/* Badge */}
              <motion.div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary border border-primary/20 mb-4" variants={itemVariants}>
                <CheckCircle className="w-4 h-4 mr-2" />
                {isEditing ? (
                  <input 
                    value={heroState.badgeText} 
                    onChange={(e) => updateField("badgeText", e.target.value)} 
                    className="bg-transparent hover:bg-blue-200 border-b border-primary text-sm outline-none" 
                  />
                ) : (
                  <span className="font-medium text-sm">{heroState.badgeText}</span>
                )}
              </motion.div>

              {/* Heading */}
              <motion.div variants={itemVariants}>
                {isEditing ? (
                  <>
                    <textarea 
                      value={heroState.heading} 
                      onChange={(e) => updateField("heading", e.target.value)} 
                      className="bg-transparent border-b border-foreground text-4xl md:text-6xl leading-tight outline-none w-full max-w-lg" 
                    />
                    <input 
                      value={heroState.highlight} 
                      onChange={(e) => updateField("highlight", e.target.value)} 
                      className="bg-transparent border-b border-primary text-4xl md:text-6xl text-primary outline-none" 
                    />
                  </>
                ) : (
                  <h1 className="text-4xl md:text-6xl text-foreground leading-tight">
                    {heroState.heading} <span className="text-primary">{heroState.highlight}</span>
                  </h1>
                )}
              </motion.div>

              {/* Description */}
              <motion.div variants={itemVariants}>
                {isEditing ? (
                  <>
                    <textarea 
                      value={heroState.description} 
                      onChange={(e) => updateField("description", e.target.value)} 
                      className="bg-transparent border-b border-muted-foreground text-xl text-muted-foreground outline-none w-full max-w-lg" 
                    />
                    <input 
                      value={heroState.highlightDesc} 
                      onChange={(e) => updateField("highlightDesc", e.target.value)} 
                      className="bg-transparent border-b border-red-accent text-xl font-semibold outline-none" 
                    />
                  </>
                ) : (
                  <p className="text-xl text-muted-foreground max-w-lg inline">
                    {heroState.description} <span className="text-red-accent font-semibold">{heroState.highlightDesc}</span>.
                  </p>
                )}
              </motion.div>
            </div>

            {/* Buttons */}
            <motion.div className="flex flex-col sm:flex-row gap-4" variants={itemVariants}>
              {isEditing ? (
                <>
                  <input 
                    value={heroState.primaryBtn} 
                    onChange={(e) => updateField("primaryBtn", e.target.value)} 
                    className="bg-transparent border-b border-primary outline-none max-w-[200px]" 
                  />
                 
                </>
              ) : (
                <>
                  <Button size="lg" className="bg-primary text-primary-foreground shadow-xl">
                    <a href="#contact">
                    {heroState.primaryBtn}

                    </a>
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  
                </>
              )}
            </motion.div>

            {/* Trust text */}
            <motion.div className="flex items-center space-x-6 pt-4" variants={itemVariants}>
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-primary rounded-full border-2 border-background" />
                  <div className="w-8 h-8 bg-primary/80 rounded-full border-2 border-background" />
                  <div className="w-8 h-8 bg-red-accent rounded-full border-2 border-background" />
                </div>
                {isEditing ? (
                  <input 
                    value={heroState.trustText} 
                    onChange={(e) => updateField("trustText", e.target.value)} 
                    className="bg-transparent border-b border-muted-foreground text-sm outline-none" 
                  />
                ) : (
                  <span className="text-sm text-muted-foreground">{heroState.trustText}</span>
                )}
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div className="grid grid-cols-3 gap-8 pt-8" variants={itemVariants}>
              {heroState.stats.map((s) => (
                <div key={s.id} className="group">
                  {isEditing ? (
                    <div className="flex flex-col gap-1">
                      <input 
                        value={s.value} 
                        onChange={(e) => updateStat(s.id, "value", e.target.value)} 
                        className="bg-transparent border-b border-foreground font-bold text-2xl outline-none" 
                      />
                      <input 
                        value={s.label} 
                        onChange={(e) => updateStat(s.id, "label", e.target.value)} 
                        className="bg-transparent border-b border-muted-foreground text-sm outline-none" 
                      />
                      <motion.button 
                      whileTap={{scale:0.9}}
                      whileHover={{scale:1.2}}
                        onClick={() => removeStat(s.id)} 
                        className="text-red-500 cursor-pointer text-xs"
                      >
                        ✕ Remove
                      </motion.button>
                    </div>
                  ) : (
                    <>
                      <div className={`text-2xl font-bold group-hover:text-${s.color}`}>{s.value}</div>
                      <div className="text-muted-foreground">{s.label}</div>
                      <div className={`w-8 h-1 bg-${s.color}/30 group-hover:bg-${s.color} mt-1`} />
                    </>
                  )}
                </div>
              ))}
              {isEditing && (
                <motion.button 
                whileTap={{scale:0.9}}
                      whileHover={{scale:1.2}}
                  onClick={addStat} 
                  className="text-green-600 cursor-pointer shadow-sm  text-sm font-medium"
                >
                  + Add Stat
                </motion.button>
              )}
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div className="relative" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.5 }}>
            {isEditing && (
              <div className="mb-4 p-2 bg-white/80 rounded shadow">
                <p className="text-sm mb-1">Change Hero Image:</p>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleHeroImageUpload}
                  className="text-sm border-2 border-dashed border-muted-foreground p-2 rounded w-full"
                />
                {pendingImageFile && (
                  <p className="text-xs text-orange-600 mt-1">
                    Image selected: {pendingImageFile.name} (will upload on save)
                  </p>
                )}
              </div>
            )}
            <motion.div className="relative rounded-2xl overflow-hidden shadow-2xl" whileHover={{ scale: 1.02 }}>
              <img src={heroState.heroImage} alt="Modern business team collaborating" className="w-full h-[500px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              
              {/* Image overlay decorations */}
              <motion.div 
                className="absolute top-4 right-4 w-16 h-16 bg-primary/20 rounded-full backdrop-blur-sm"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />
              <motion.div 
                className="absolute top-4 left-4 w-12 h-12 bg-red-accent/20 rounded-full backdrop-blur-sm"
                variants={floatingVariants}
                animate="animate"
              />
            </motion.div>
            
            {/* Floating card */}
            <motion.div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-xl shadow-lg border border-border" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }}>
              <div className="flex items-center space-x-3">
                <motion.div 
                  className="w-3 h-3 bg-primary rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                {isEditing ? (
                  <input 
                    value={heroState.cardText} 
                    onChange={(e) => updateField("cardText", e.target.value)} 
                    className="bg-transparent border-b border-foreground text-sm outline-none" 
                  />
                ) : (
                  <span className="text-sm font-medium">{heroState.cardText}</span>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Edit/Save Buttons */}
        <div className="flex justify-end mt-6">
          {isEditing ? (
            <motion.button 
              whileHover={{y:-1,scaleX:1.1}}
              whileTap={{scale:0.9}}
              onClick={handleSave}
              disabled={isUploading}
              className={`${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:shadow-2xl'} text-white px-4 py-2 rounded shadow-xl hover:font-semibold`}
            >
              {isUploading ? 'Uploading...' : 'Save'}
            </motion.button>
          ) : (
            <motion.button 
              whileHover={{y:-1,scaleX:1.1}}
              whileTap={{scale:0.9}}
              onClick={() => setIsEditing(true)} 
              className="bg-yellow-500 text-black px-4 py-2 rounded cursor-pointer hover:shadow-2xl shadow-xl hover:font-semibold"
            >
              Edit
            </motion.button>
          )}
        </div>
      </div>
    </section>
  );
}