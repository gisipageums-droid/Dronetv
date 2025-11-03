import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// Custom Badge component
const Badge = ({ children, className }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
  >
    {children}
  </span>
);

export default function CompanyProfile({ profileData }) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Animation counters
  const hasAnimated = useRef(false);
  const [animatedCounters, setAnimatedCounters] = useState({
    growth: 0,
    team: 0,
    projects: 0,
  });

  // Default content structure
  const defaultContent = {
    companyName: profileData?.companyName || "Innovative Labs",
    establishedYear: profileData?.establishedYear || 2015,
    growthThisYear: profileData?.growthThisYear || 42,
    satisfiedCustomers: profileData?.satisfiedCustomers || 20,
    teamSize: profileData?.teamSize || 150,
    projectsDelivered: profileData?.projectsDelivered || 25,
    description:
      profileData?.description ||
      "Founded in 2015, we are a global innovation studio crafting digital experiences, scalable platforms, and future-ready strategies for industry leaders.",
    coreValues: profileData?.coreValues || [
      "Innovation First",
      "Client Obsessed",
      "Ownership & Accountability",
      "Grow Together",
    ],
    imageUrl:
      profileData?.imageUrl ||
      "https://images.unsplash.com/photo-1529533520516-5e45b20d07a5?w=800&h=600&fit=crop",
  };

  // Consolidated state
  const [profileState] = useState(defaultContent);

  // Intersection Observer for visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Animate counters when section becomes visible
  useEffect(() => {
    if (!isVisible || hasAnimated.current) return;

    hasAnimated.current = true;

    const duration = 2000;

    const animateCounter = (start, end, setter) => {
      const increment = end > start ? 1 : -1;
      const totalSteps = Math.abs(end - start);
      const stepTime = Math.floor(duration / totalSteps);

      let current = start;
      const timer = setInterval(() => {
        current += increment;
        setter(current);
        if (current === end) clearInterval(timer);
      }, stepTime);

      return () => clearInterval(timer);
    };

    const timers = [
      animateCounter(
        animatedCounters.growth,
        profileState.growthThisYear,
        (v) => setAnimatedCounters((prev) => ({ ...prev, growth: v }))
      ),
      animateCounter(animatedCounters.team, profileState.teamSize, (v) =>
        setAnimatedCounters((prev) => ({ ...prev, team: v }))
      ),
      animateCounter(
        animatedCounters.projects,
        profileState.projectsDelivered,
        (v) => setAnimatedCounters((prev) => ({ ...prev, projects: v }))
      ),
    ];

    return () => timers.forEach((clear) => clear && clear());
  }, [
    isVisible,
    profileState.growthThisYear,
    profileState.teamSize,
    profileState.projectsDelivered,
  ]);

  const displayCounters = animatedCounters;

  return (
    <section
      id="profile"
      ref={sectionRef}
      className="py-24 bg-gradient-to-b from-white to-yellow-50/30 scroll-mt-20 relative"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* LEFT SIDE — Company Image - Full Width & Height */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative flex justify-center"
          >
            <div className="rounded-3xl overflow-hidden shadow-xl border border-yellow-100 w-full max-w-[900px]">
              <img
                src={
                  profileState.imageUrl ||
                  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop"
                }
                alt={`${profileState.companyName} Office`}
                className="block w-full h-auto max-h-[75vh] object-contain"
                onError={(e) => {
                  // Fallback if image fails
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop";
                }}
              />
            </div>
          </motion.div>

          {/* RIGHT SIDE — Company Info */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.7 }}
            >
              <Badge className="bg-[#ffeb3b] text-gray-900 px-4 py-1.5 mb-4">
                Since {profileState.establishedYear}
              </Badge>

              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                {profileState.companyName}
              </h2>

              <p className="text-lg text-gray-700 mt-4 max-w-xl">
                {profileState.description}
              </p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6 mt-8">
              {[
                {
                  label: "Growth This Year",
                  value: `${displayCounters.growth}%`,
                },
                {
                  label: "Happy Clients",
                  value: `${profileState.satisfiedCustomers}+`,
                },
                {
                  label: "Team Members",
                  value: displayCounters.team,
                },
                {
                  label: "Projects Delivered",
                  value: displayCounters.projects,
                },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.2, duration: 0.6 }}
                  className="text-center p-6 bg-white/70 backdrop-blur rounded-2xl border border-yellow-100 hover:shadow-md transition-shadow"
                >
                  <div className="text-3xl md:text-4xl font-extrabold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-xs md:text-sm text-gray-600 mt-2 uppercase tracking-wide">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Core Values */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ delay: 1.2, duration: 0.7 }}
              className="mt-8 space-y-4"
            >
              <h3 className="text-xl font-bold text-gray-900">
                Our Core Values
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {profileState.coreValues.map((value, i) => (
                  <motion.div
                    key={i}
                    initial={{ x: -20, opacity: 0 }}
                    animate={isVisible ? { x: 0, opacity: 1 } : {}}
                    transition={{ delay: 1.3 + i * 0.1, duration: 0.5 }}
                    className="flex items-center gap-2 p-3 bg-yellow-50 rounded-xl"
                  >
                    <div className="w-2 h-2 bg-[#ffeb3b] rounded-full"></div>
                    <span className="text-gray-800 font-medium">{value}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
