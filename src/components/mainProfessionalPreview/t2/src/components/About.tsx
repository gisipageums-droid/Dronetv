import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { AnimatedButton } from "./AnimatedButton";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface AboutData {
  heading: string;
  subtitle: string;
  description1: string;
  description2: string;
  skills: string[];
  imageSrc: string;
  buttonText?: string;
}

interface AboutProps {
  aboutData: AboutData;
}

export function About({ aboutData }: AboutProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const aboutRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<AboutData>(aboutData);

  // Initialize with provided aboutData
  useEffect(() => {
    if (aboutData) {
      setData(aboutData);
      setDataLoaded(true);
    }
  }, [aboutData]);

  // Intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (aboutRef.current) observer.observe(aboutRef.current);
    return () => {
      if (aboutRef.current) observer.unobserve(aboutRef.current);
    };
  }, []);

  // Fake API fetch
  const fetchAboutData = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setData(aboutData);
      setDataLoaded(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible && !dataLoaded && !isLoading) {
      fetchAboutData();
    }
  }, [isVisible, dataLoaded, isLoading, aboutData]);

  // Loading state
  if (isLoading) {
    return (
      <section ref={aboutRef} id="about" className="relative py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-8 h-8 animate-spin mx-auto text-yellow-500 border-2 border-yellow-500 border-t-transparent rounded-full"></div>
          <p className="text-muted-foreground mt-4">Loading about data...</p>
        </div>
      </section>
    );
  }

  return (
    <section ref={aboutRef} id="about" className="relative text-justify py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Content - Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-yellow-400 rounded-3xl transform -rotate-6"></div>
              <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src={data.imageSrc}
                  alt="About me"
                  className="w-full h-96 object-cover"
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6 relative"
          >
            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl text-foreground font-bold">
                {data.heading}
              </h2>
              <p className="text-xl text-yellow-500 font-semibold mt-2">
                {data.subtitle}
              </p>
            </motion.div>

            {/* Description 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <p className="text-lg text-muted-foreground leading-relaxed">
                {data.description1}
              </p>
            </motion.div>

            {/* Description 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <p className="text-lg text-muted-foreground leading-relaxed">
                {data.description2}
              </p>
            </motion.div>

            {/* Skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              {data.skills.map((skill, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-gray-700">{skill}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              viewport={{ once: true }}
            >
              <AnimatedButton href="#contact" size="lg">
                {data.buttonText || "Let's Connect"}
              </AnimatedButton>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}