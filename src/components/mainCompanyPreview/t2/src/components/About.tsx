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
  Handshake,
} from "lucide-react";

export default function About({ aboutData }) {
  // Map the string icons to Lucide React components
  const iconMap = {
    Shield: Shield,
    Lightbulb: Lightbulb,
    Target: Target,
    Handshake: Handshake,
    Globe: Globe,
    Users: Users,
    Rocket: Rocket,
    Heart: Heart,
  };

  // Function to process aboutData and ensure icons are proper components
  const processAboutData = (data) => {
    if (!data) return null;

    return {
      ...data,
      visionPillars:
        data.visionPillars &&
        data.visionPillars.map((pillar) => ({
          ...pillar,
          icon: iconMap[pillar.icon] || Globe,
        })),
    };
  };

  // Consolidated state
  const aboutState = processAboutData(aboutData);

  return (
    <section id="about" className="py-20 bg-secondary theme-transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main About Section - UPDATED LAYOUT: Image on Left, Title & Description1 on Right */}
        <div className="grid lg:grid-cols-2 gap-12 items-start mb-20">
          {/* Left Column - Image and Description2 */}
          <div className="space-y-12">
            {/* Image Section */}
            <motion.div
              className="relative rounded-2xl overflow-hidden shadow-xl"
              whileInView={{ opacity: [0, 1], x: [-50, 0] }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative w-full">
                <motion.div
                  className="relative"
                  whileInView={{ opacity: [0, 1], scale: [0.8, 1] }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <div className="relative flex justify-center">
                    <img
                      src={aboutState.imageUrl}
                      alt="About"
                      className="w-full max-w-full h-auto object-contain rounded-2xl shadow-2xl"
                      style={{
                        maxHeight: '500px',
                        width: 'auto',
                        margin: '0 auto'
                      }}
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Description 2 - Under the image */}
            <motion.div
              whileInView={{ opacity: [0, 1], y: [30, 0] }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <p className="text-muted-foreground leading-relaxed text-justify">
                {aboutState.description2}
              </p>
            </motion.div>
          </div>

          {/* Right Column - Title, Description1, Features & Metrics */}
          <div className="space-y-8">
            {/* Title and Description 1 */}
            <motion.div
              className="space-y-6"
              whileInView={{ opacity: [0, 1], x: [50, 0] }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-3xl md:text-4xl text-foreground text-justify">
                {aboutState.aboutTitle}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed text-justify">
                {aboutState.description1}
              </p>
            </motion.div>

            {/* Features list */}
            <motion.div
              whileInView={{ opacity: [0, 1], y: [30, 0] }}
              transition={{ duration: 1, delay: 0.6, ease: "backOut" }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold text-foreground mb-4">Why Choose Us</h3>
              {aboutState.features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{feature}</span>
                </div>
              ))}
            </motion.div>

            {/* Company metrics */}
            <motion.div
              className="grid grid-cols-2 gap-6 pt-6"
              whileInView={{ opacity: [0, 1], y: [30, 0] }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="text-center p-6 bg-card rounded-lg shadow-sm">
                <motion.div
                  whileInView={{ opacity: [0, 1], y: [-15, 3, -3, 0] }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="text-3xl font-bold text-card-foreground"
                >
                  {aboutState.metric1Num}
                </motion.div>
                <motion.div
                  whileInView={{ opacity: [0, 1], y: [15, -3, 3, 0] }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="text-muted-foreground text-lg"
                >
                  {aboutState.metric1Label}
                </motion.div>
              </div>

              <div className="text-center p-6 bg-card rounded-lg shadow-sm">
                <motion.div
                  whileInView={{ opacity: [0, 1], y: [-15, 3, -3, 0] }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="text-3xl font-bold text-card-foreground"
                >
                  {aboutState.metric2Num}
                </motion.div>
                <motion.div
                  whileInView={{ opacity: [0, 1], y: [15, -3, 3, 0] }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="text-muted-foreground text-lg"
                >
                  {aboutState.metric2Label}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Vision Section - Centrally Aligned and Justified */}
        <motion.div className="text-center mb-16 mt-16">
          <motion.div className="flex flex-col items-center justify-center mb-6">
            <Eye className="w-12 h-12 text-red-500 mb-3" />

            <motion.div
              whileInView={{ opacity: [0, 1], y: [-20, 0] }}
              transition={{ duration: 0.5, ease: "backInOut" }}
              className="px-4 py-2 bg-red-accent/10 rounded-full"
            >
              <span className="font-medium text-red-500 text-lg">
                {aboutState.visionBadge}
              </span>
            </motion.div>
          </motion.div>


          <motion.h2
            whileInView={{ opacity: [0, 1], x: [-20, 0] }}
            transition={{ duration: 1, ease: "backInOut" }}
            className="text-3xl md:text-4xl mb-6 text-center"
          >
            {aboutState.visionTitle}
          </motion.h2>

          <motion.p
            whileInView={{ opacity: [0, 1], x: [20, 0] }}
            transition={{ duration: 1, ease: "backOut" }}
            className="text-lg text-muted-foreground max-w-4xl mx-auto mb-12 text-justify leading-relaxed"
          >
            {aboutState.visionDesc}
          </motion.p>

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

                  <h3 className="font-semibold text-card-foreground mb-3 text-center">
                    {pillar.title}
                  </h3>

                  <p className="text-muted-foreground text-sm leading-relaxed text-justify">
                    {pillar.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Mission Section - Centrally Aligned and Justified */}
        <motion.div className="bg-gradient-to-r from-primary/5 to-red-accent/5 rounded-2xl p-12 text-center">
          <Target className="w-12 h-12 text-primary mx-auto mb-6" />

          <motion.h3
            whileInView={{ opacity: [0, 1], scale: [0, 1], y: [-20, 0] }}
            transition={{ duration: 1, ease: "backInOut" }}
            className="text-2xl font-semibold text-foreground mb-6 text-center"
          >
            {aboutState.missionTitle}
          </motion.h3>

          <motion.p
            whileInView={{ opacity: [0, 1], x: [-40, 0] }}
            transition={{ duration: 1, ease: "backInOut" }}
            className="text-muted-foreground text-lg max-w-4xl mx-auto leading-relaxed text-justify"
          >
            {aboutState.missionDesc}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}