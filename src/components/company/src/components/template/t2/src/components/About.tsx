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
} from "lucide-react";

export default function About() {
  const [isEditing, setIsEditing] = useState(false);

  // Main content states
  const [aboutTitle, setAboutTitle] = useState("About Our Company");
  const [aboutDesc1, setAboutDesc1] = useState(
    "We are a forward-thinking company dedicated to helping businesses achieve their full potential through innovative solutions and strategic partnerships."
  );
  const [aboutDesc2, setAboutDesc2] = useState(
    "Founded with the vision of transforming how companies operate in the digital age, we combine cutting-edge technology with deep industry expertise to deliver exceptional results for our clients."
  );

  // Features
  const [features, setFeatures] = useState([
    "10+ years of industry experience",
    "Award-winning team of experts",
    "Proven track record of success",
    "Customer-first approach",
  ]);

  // Metrics
  const [metric1Num, setMetric1Num] = useState("15+");
  const [metric1Label, setMetric1Label] = useState("Years Experience");
  const [metric2Num, setMetric2Num] = useState("200+");
  const [metric2Label, setMetric2Label] = useState("Projects Completed");

  // Vision section
  const [visionBadge, setVisionBadge] = useState("Our Vision");
  const [visionTitle, setVisionTitle] = useState("Shaping the Future Together");
  const [visionDesc, setVisionDesc] = useState(
    "We envision a world where technology and human ingenuity combine to create sustainable solutions that empower businesses to thrive while making a positive impact on society and the environment."
  );

  // Vision Pillars
  const [visionPillars, setVisionPillars] = useState([
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
  ]);

  const updatePillar = (index: number, field: string, value: string) => {
    setVisionPillars((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
  };

  // Mission section
  const [missionTitle, setMissionTitle] = useState("Our Mission");
  const [missionDesc, setMissionDesc] = useState(
    "To empower businesses of all sizes with innovative solutions that drive growth, foster sustainability, and create lasting value for stakeholders, communities, and the world at large."
  );

  // Image
  const [imageUrl, setImageUrl] = useState(
    "https://images.unsplash.com/photo-1748346918817-0b1b6b2f9bab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBvZmZpY2UlMjBzcGFjZSUyMG1vZGVybnxlbnwxfHx8fDE3NTU2MTgzNjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section id='about' className='py-20 bg-secondary theme-transition'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Main About Section */}
        <div className='grid lg:grid-cols-2 gap-12 items-center mb-20'>
          {/* Image */}
          <motion.div
            className='relative rounded-2xl overflow-hidden shadow-xl'
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src={imageUrl}
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
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {isEditing ? (
                <input
                  value={aboutTitle}
                  onChange={(e) => setAboutTitle(e.target.value)}
                  className='bg-transparent border-b border-primary text-3xl md:text-4xl text-foreground outline-none'
                />
              ) : (
                <h2 className='text-3xl md:text-4xl text-foreground'>
                  {aboutTitle}
                </h2>
              )}
              {isEditing ? (
                <textarea
                  value={aboutDesc1}
                  onChange={(e) => setAboutDesc1(e.target.value)}
                  className='w-full bg-transparent border-b border-muted-foreground text-lg text-muted-foreground outline-none'
                />
              ) : (
                <p className='text-lg text-muted-foreground text-justify'>{aboutDesc1}</p>
              )}
              {isEditing ? (
                <textarea
                  value={aboutDesc2}
                  onChange={(e) => setAboutDesc2(e.target.value)}
                  className='w-full bg-transparent border-b border-muted-foreground text-muted-foreground outline-none'
                />
              ) : (
                <p className='text-muted-foreground text-justify'>{aboutDesc2}</p>
              )}
            </motion.div>

            {/* Features list */}
            <motion.div className='space-y-3'>
              {features.map((feature, index) => (
                <div key={index} className='flex items-center space-x-3'>
                  <CheckCircle className='h-5 w-5 text-primary flex-shrink-0' />
                  {isEditing ? (
                    <input
                      value={feature}
                      onChange={(e) =>
                        setFeatures((prev) =>
                          prev.map((f, i) => (i === index ? e.target.value : f))
                        )
                      }
                      className='bg-transparent border-b border-muted-foreground text-muted-foreground outline-none'
                    />
                  ) : (
                    <span className='text-muted-foreground'>{feature}</span>
                  )}
                </div>
              ))}
              {isEditing && (
                <button
                  onClick={() =>
                    setFeatures((prev) => [...prev, "New Feature"])
                  }
                  className='text-green-600 text-sm mt-2'
                >
                  + Add Feature
                </button>
              )}
            </motion.div>

            {/* Company metrics */}
            <motion.div className='grid grid-cols-2 gap-6 pt-6'>
              <div className='text-center p-4 bg-card rounded-lg shadow-sm'>
                {isEditing ? (
                  <input
                    value={metric1Num}
                    onChange={(e) => setMetric1Num(e.target.value)}
                    className='bg-transparent border-b border-foreground text-2xl font-bold outline-none'
                  />
                ) : (
                  <div className='text-2xl font-bold text-card-foreground'>
                    {metric1Num}
                  </div>
                )}
                {isEditing ? (
                  <input
                    value={metric1Label}
                    onChange={(e) => setMetric1Label(e.target.value)}
                    className='bg-transparent border-b border-muted-foreground text-muted-foreground outline-none'
                  />
                ) : (
                  <div className='text-muted-foreground'>{metric1Label}</div>
                )}
              </div>
              <div className='text-center p-4 bg-card rounded-lg shadow-sm'>
                {isEditing ? (
                  <input
                    value={metric2Num}
                    onChange={(e) => setMetric2Num(e.target.value)}
                    className='bg-transparent border-b border-foreground text-2xl font-bold outline-none'
                  />
                ) : (
                  <div className='text-2xl font-bold text-card-foreground'>
                    {metric2Num}
                  </div>
                )}
                {isEditing ? (
                  <input
                    value={metric2Label}
                    onChange={(e) => setMetric2Label(e.target.value)}
                    className='bg-transparent border-b border-muted-foreground text-muted-foreground outline-none'
                  />
                ) : (
                  <div className='text-muted-foreground'>{metric2Label}</div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Vision Section */}
        <motion.div className='text-center mb-16'>
          {isEditing ? (
            <input
              value={visionBadge}
              onChange={(e) => setVisionBadge(e.target.value)}
              className='bg-transparent border-b border-primary text-primary outline-none'
            />
          ) : (
            <>
              <Eye className='w-12 h-12 text-red-500 mx-auto mb-4' />
              <div className='inline-flex items-center px-4 py-2 bg-red-accent/10 rounded-full text-primary mb-6'>
                <span className='font-medium text-red-500 text-lg'>{visionBadge}</span>
              </div>
            </>
          )}

          {isEditing ? (
            <input
              value={visionTitle}
              onChange={(e) => setVisionTitle(e.target.value)}
              className='bg-transparent border-b border-foreground text-3xl md:text-4xl outline-none'
            />
          ) : (
            <h2 className='text-3xl md:text-4xl text-foreground mb-6'>
              {visionTitle}
            </h2>
          )}

          {isEditing ? (
            <textarea
              value={visionDesc}
              onChange={(e) => setVisionDesc(e.target.value)}
              className='w-full bg-transparent border-b border-muted-foreground text-lg text-muted-foreground outline-none'
            />
          ) : (
            <p className='text-lg text-muted-foreground max-w-3xl mx-auto mb-12 text-justify'>
              {visionDesc}
            </p>
          )}

          {/* Vision Pillars */}
          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {visionPillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <div
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
                    <p className='text-muted-foreground text-sm leading-relaxed text-justify'>
                      {pillar.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Mission Section */}
        <motion.div className='bg-gradient-to-r from-primary/5 to-red-accent/5 rounded-2xl p-12 text-center'>
          <Target className='w-12 h-12 text-primary mx-auto mb-6' />
          {isEditing ? (
            <input
              value={missionTitle}
              onChange={(e) => setMissionTitle(e.target.value)}
              className='bg-transparent border-b border-foreground text-2xl font-semibold outline-none'
            />
          ) : (
            <h3 className='text-2xl font-semibold text-foreground mb-6'>
              {missionTitle}
            </h3>
          )}
          {isEditing ? (
            <textarea
              value={missionDesc}
              onChange={(e) => setMissionDesc(e.target.value)}
              className='w-full bg-transparent border-b border-muted-foreground text-lg text-muted-foreground outline-none'
            />
          ) : (
            <p className='text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed text-justify'>
              {missionDesc}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
