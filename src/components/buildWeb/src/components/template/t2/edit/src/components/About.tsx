import { useState } from "react";
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
} from "lucide-react";

export default function About({ aboutData }) {
  const [isEditing, setIsEditing] = useState(false);

  // Map the emoji icons to Lucide React components
  const iconMap = {
    "🛡️": Shield, // You'll need to import Shield from lucide-react
    "💡": Lightbulb, // You'll need to import Lightbulb from lucide-react
    "🎯": Target, // You'll need to import Target from lucide-react
    // Add more mappings as needed
  };

  // Consolidated state
  const [aboutState, setAboutState] = useState({
    aboutTitle: "About Our Company",
    description1:
      aboutData?.description1 ||
      "We are a forward-thinking company dedicated to helping businesses achieve their full potential through innovative solutions and strategic partnerships.",
    description2:
      aboutData?.description2 ||
      "Founded with the vision of transforming how companies operate in the digital age, we combine cutting-edge technology with deep industry expertise to deliver exceptional results for our clients.",
    features: [
      "10+ years of industry experience",
      "Award-winning team of experts",
      "Proven track record of success",
      "Customer-first approach",
    ],
    metric1Num: "15+",
    metric1Label: "Years Experience",
    metric2Num: "200+",
    metric2Label: "Projects Completed",
    visionBadge: "Our Vision",
    visionTitle: "Shaping the Future Together",
    visionDesc:
      aboutData?.vision ||
      "We envision a world where technology and human ingenuity combine to create sustainable solutions that empower businesses to thrive while making a positive impact on society and the environment.",
    visionPillars: aboutData?.visionPillars
      ? aboutData.visionPillars.map((pillar) => ({
          ...pillar,
          icon: iconMap[pillar.icon] || Globe, // Fallback to Globe if icon not found
        }))
      : [
          {
            icon: Globe,
            title: "Global Impact",
            description:
              "Expanding our reach to serve clients across continents while maintaining our commitment to excellence.",
          },
          {
            icon: Users,
            title: "Community Building",
            description:
              "Creating ecosystems where businesses thrive together through collaboration and shared growth.",
          },
          {
            icon: Rocket,
            title: "Innovation First",
            description:
              "Continuously pushing boundaries with cutting-edge technologies and forward-thinking strategies.",
          },
          {
            icon: Heart,
            title: "Sustainable Growth",
            description:
              "Balancing profitability with social responsibility and environmental consciousness.",
          },
        ],
    missionTitle: "Our Mission",
    missionDesc:
      aboutData?.mission ||
      "To empower businesses of all sizes with innovative solutions that drive growth, foster sustainability, and create lasting value for stakeholders, communities, and the world at large.",
    imageUrl:
      "https://images.unsplash.com/photo-1748346918817-0b1b6b2f9bab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBvZmZpY2UlMjBzcGFjZSUyMG1vZGVybnxlbnwxfHx8fDE3NTU2MTgzNjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  });
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

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateField("imageUrl", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section id='about' className='py-20 bg-secondary theme-transition'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Edit / Save */}
        <div className='flex justify-end mt-6'>
          {isEditing ? (
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ y: -1, scaleX: 1.1 }}
              onClick={() => setIsEditing(false)}
              className='bg-green-600 cursor-pointer hover:font-semibold hover:shadow-2xl shadow-xl text-white px-4 py-2 rounded'
            >
              Save
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ y: -1, scaleX: 1.1 }}
              onClick={() => setIsEditing(true)}
              className='bg-yellow-500 text-black px-4 py-2 rounded cursor-pointer  hover:shadow-2xl shadow-xl hover:font-semibold'
            >
              Edit
            </motion.button>
          )}
        </div>

        {/* Main About Section */}
        <div className='grid lg:grid-cols-2 gap-12 items-center mb-20'>
          {/* Image */}
          <motion.div
            className='relative rounded-2xl overflow-hidden shadow-xl'
            whileInView={{ opacity: [0, 1], x: [-50, 0] }}
            transition={{ duration: 0.8 }}
          >
            <img
              src={aboutState.imageUrl}
              alt='About'
              className='w-full h-[400px] object-cover'
            />
            {isEditing && (
              <div className='absolute bottom-4 left-4 bg-white/80 p-2 rounded shadow'>
                <input
                  type='file'
                  accept='image/*'
                  onChange={handleImageUpload}
                />
              </div>
            )}
          </motion.div>

          {/* Content */}
          <div className='space-y-8'>
            <motion.div
              className='space-y-4'
              whileInView={{ opacity: [0, 1], x: [50, 0] }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {isEditing ? (
                <input
                  value={aboutState.aboutTitle}
                  onChange={(e) => updateField("aboutTitle", e.target.value)}
                  className='bg-transparent border-b border-primary text-3xl md:text-4xl text-foreground outline-none'
                />
              ) : (
                <h2 className='text-3xl md:text-4xl text-foreground'>
                  {aboutState.aboutTitle}
                </h2>
              )}
              {isEditing ? (
                <textarea
                  value={aboutState.description1}
                  onChange={(e) => updateField("description1", e.target.value)}
                  className='w-full bg-transparent border-b border-muted-foreground text-lg text-muted-foreground outline-none'
                />
              ) : (
                <p className='text-lg text-muted-foreground'>
                  {aboutState.description1}
                </p>
              )}
              {isEditing ? (
                <textarea
                  value={aboutState.description2}
                  onChange={(e) => updateField("description2", e.target.value)}
                  className='w-full bg-transparent border-b border-muted-foreground text-muted-foreground outline-none'
                />
              ) : (
                <p className='text-muted-foreground'>
                  {aboutState.description2}
                </p>
              )}
            </motion.div>

            {/* Features list */}
            <motion.div
              whileInView={{ opacity: [0, 1], x: [-50, 0] }}
              transition={{ duration: 1, delay: 0.5, ease: "backOut" }}
              className='space-y-3'
            >
              {aboutState.features.map((feature, index) => (
                <div key={index} className='flex items-center space-x-3'>
                  <CheckCircle className='h-5 w-5 text-primary flex-shrink-0' />
                  {isEditing ? (
                    <input
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      className='bg-transparent border-b border-muted-foreground text-muted-foreground outline-none'
                    />
                  ) : (
                    <span className='text-muted-foreground'>{feature}</span>
                  )}
                </div>
              ))}
              {isEditing && (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.1 }}
                  onClick={addFeature}
                  className='text-green-600 cursor-pointer text-sm mt-2'
                >
                  + Add Feature
                </motion.button>
              )}
            </motion.div>

            {/* Company metrics */}
            <motion.div className='grid grid-cols-2 gap-6 pt-6'>
              <div className='text-center p-4 bg-card rounded-lg shadow-sm'>
                {isEditing ? (
                  <input
                    value={aboutState.metric1Num}
                    onChange={(e) => updateField("metric1Num", e.target.value)}
                    className='bg-transparent border-b border-foreground text-2xl font-bold outline-none'
                  />
                ) : (
                  <motion.div
                    whileInView={{ opacity: [0, 1], y: [-15, 3, -3, 0] }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className='text-2xl font-bold text-card-foreground'
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
                    className='bg-transparent border-b border-muted-foreground text-muted-foreground outline-none'
                  />
                ) : (
                  <motion.div
                    whileInView={{ opacity: [0, 1], y: [15, -3, 3, 0] }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className='text-muted-foreground'
                  >
                    {aboutState.metric1Label}
                  </motion.div>
                )}
              </div>
              <div className='text-center p-4 bg-card rounded-lg shadow-sm'>
                {isEditing ? (
                  <input
                    value={aboutState.metric2Num}
                    onChange={(e) => updateField("metric2Num", e.target.value)}
                    className='bg-transparent border-b border-foreground text-2xl font-bold outline-none'
                  />
                ) : (
                  <motion.div
                    whileInView={{ opacity: [0, 1], y: [-15, 3, -3, 0] }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className='text-2xl font-bold text-card-foreground'
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
                    className='bg-transparent border-b border-muted-foreground text-muted-foreground outline-none'
                  />
                ) : (
                  <motion.div
                    whileInView={{ opacity: [0, 1], y: [15, -3, 3, 0] }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className='text-muted-foreground'
                  >
                    {aboutState.metric2Label}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Vision Section */}
        <motion.div className='text-center mb-16'>
          {isEditing ? (
            <input
              value={aboutState.visionBadge}
              onChange={(e) => updateField("visionBadge", e.target.value)}
              className='bg-transparent border-b border-primary text-primary outline-none'
            />
          ) : (
            <motion.div
              whileInView={{ opacity: [0, 1], y: [-20, 0] }}
              transition={{ duration: 0.5, ease: "backInOut" }}
              className='inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary mb-6'
            >
              <Eye className='w-4 h-4 mr-2' />
              <span className='font-medium'>{aboutState.visionBadge}</span>
            </motion.div>
          )}

          {isEditing ? (
            <input
              value={aboutState.visionTitle}
              onChange={(e) => updateField("visionTitle", e.target.value)}
              className='bg-transparent border-b border-foreground text-3xl md:text-4xl outline-none'
            />
          ) : (
            <motion.h2
              whileInView={{ opacity: [0, 1], x: [-20, 0] }}
              transition={{ duration: 1, ease: "backInOut" }}
              className='text-3xl md:text-4xl text-foreground mb-6'
            >
              {aboutState.visionTitle}
            </motion.h2>
          )}

          {isEditing ? (
            <textarea
              value={aboutState.visionDesc}
              onChange={(e) => updateField("visionDesc", e.target.value)}
              className='w-full bg-transparent border-b border-muted-foreground text-lg text-muted-foreground outline-none'
            />
          ) : (
            <motion.p
              whileInView={{ opacity: [0, 1], x: [20, 0] }}
              transition={{ duration: 1, ease: "backOut" }}
              className='text-lg text-muted-foreground max-w-3xl mx-auto mb-12'
            >
              {aboutState.visionDesc}
            </motion.p>
          )}

          {/* Vision Pillars */}
          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {aboutState.visionPillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  whileInView={{ opacity: [0, 1], scale: [0, 1] }}
                  transition={{ duration: 1, ease: "backInOut" }}
                  key={index}
                  className='text-center p-6 bg-card rounded-xl shadow-sm hover:shadow-lg'
                >
                  <div className='w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4'>
                    <Icon className='h-6 w-6 text-primary' />
                  </div>
                  {isEditing ? (
                    <input
                      value={pillar.title}
                      onChange={(e) =>
                        updatePillar(index, "title", e.target.value)
                      }
                      className='bg-transparent border-b border-foreground font-semibold outline-none'
                    />
                  ) : (
                    <h3 className='font-semibold text-card-foreground mb-3'>
                      {pillar.title}
                    </h3>
                  )}
                  {isEditing ? (
                    <textarea
                      value={pillar.description}
                      onChange={(e) =>
                        updatePillar(index, "description", e.target.value)
                      }
                      className='w-full bg-transparent border-b border-muted-foreground text-sm text-muted-foreground outline-none'
                    />
                  ) : (
                    <p className='text-muted-foreground text-sm leading-relaxed'>
                      {pillar.description}
                    </p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Mission Section */}
        <motion.div className='bg-gradient-to-r from-primary/5 to-red-accent/5 rounded-2xl p-12 text-center'>
          <Target className='w-12 h-12 text-primary mx-auto mb-6' />
          {isEditing ? (
            <input
              value={aboutState.missionTitle}
              onChange={(e) => updateField("missionTitle", e.target.value)}
              className='bg-transparent border-b border-foreground text-2xl font-semibold outline-none'
            />
          ) : (
            <motion.h3
              whileInView={{ opacity: [0, 1], scale: [0, 1], y: [-20, 0] }}
              transition={{ duration: 1, ease: "backInOut" }}
              className='text-2xl font-semibold text-foreground mb-6'
            >
              {aboutState.missionTitle}
            </motion.h3>
          )}
          {isEditing ? (
            <textarea
              value={aboutState.missionDesc}
              onChange={(e) => updateField("missionDesc", e.target.value)}
              className='w-full bg-transparent border-b border-muted-foreground text-lg text-muted-foreground outline-none'
            />
          ) : (
            <motion.p
              whileInView={{ opacity: [0, 1], x: [-40, 0] }}
              transition={{ duration: 1, ease: "backInOut" }}
              className='text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed'
            >
              {aboutState.missionDesc}
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
