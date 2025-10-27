import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Badge } from "../components/ui/badge";

export default function CompanyProfile() {
  const useScrollAnimation = () => {
    const [ref, setRef] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      if (!ref) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsVisible(entry.isIntersecting);
        },
        { threshold: 0.1 }
      );

      observer.observe(ref);
      return () => observer.unobserve(ref);
    }, [ref]);

    return [setRef, isVisible] as const;
  };

  const [profileRef, profileVisible] = useScrollAnimation();

  // Mock data
  const companyName = "Innovative Labs";
  const establishedYear = 2015;
  const growthThisYear = 42;
  const satisfiedCustomers = 20;
  const teamSize = 150;
  const projectsDelivered = 25;

  // 💡 Ref to ensure OTHER counters animate ONLY ONCE
  const hasAnimated = useRef(false);
  const [animatedCounters, setAnimatedCounters] = useState({
    growth: 0,
    team: 0,
    projects: 0,
  });

  // 💡 Animate only Growth, Team, Projects — ONCE
  useEffect(() => {
    if (!profileVisible || hasAnimated.current) return;

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
      animateCounter(animatedCounters.growth, growthThisYear, (v) =>
        setAnimatedCounters((prev) => ({ ...prev, growth: v }))
      ),
      animateCounter(animatedCounters.team, teamSize, (v) =>
        setAnimatedCounters((prev) => ({ ...prev, team: v }))
      ),
      animateCounter(animatedCounters.projects, projectsDelivered, (v) =>
        setAnimatedCounters((prev) => ({ ...prev, projects: v }))
      ),
    ];

    return () => timers.forEach((clear) => clear && clear());
  }, [profileVisible, growthThisYear, teamSize, projectsDelivered]);

  // ✅ FIXED IMAGE URL — using reliable Unsplash source + fallback
  const companyImageUrl =
    "https://images.unsplash.com/photo-1529533520516-5e45b20d07a5?w=800&h=600&fit=crop"; // Office interior

  return (
    <section
      id="profile"
      ref={profileRef}
      className="py-24 bg-gradient-to-b from-white to-yellow-50/30 scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* LEFT SIDE — FIXED: Working Image */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={profileVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="rounded-3xl overflow-hidden shadow-xl border border-yellow-100"
          >
            <img
              src={companyImageUrl}
              alt={`${companyName} Office`}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback if image fails
                e.currentTarget.src =
                  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop";
              }}
            />
          </motion.div>

          {/* RIGHT SIDE — Company Info */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={profileVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.7 }}
            >
              <Badge className="bg-[#ffeb3b] text-gray-900 px-4 py-1.5 mb-4">
                Since {establishedYear}
              </Badge>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                {companyName}
              </h2>
              <p className="text-lg text-gray-700 mt-4 max-w-xl">
                Founded in <strong>{establishedYear}</strong>, we are a global
                innovation studio crafting digital experiences, scalable
                platforms, and future-ready strategies for industry leaders.
              </p>
            </motion.div>

            {/* Stats Grid — Happy Customers is STATIC, others animate once */}
            <div className="grid grid-cols-2 gap-6 mt-8">
              {[
                {
                  label: "Growth This Year",
                  value: `${animatedCounters.growth}%`,
                  delay: 0.4,
                  animated: true,
                },
                {
                  label: "Happy Clients",
                  value: satisfiedCustomers.toLocaleString() + "+", // ← STATIC, no animation
                  delay: 0.6,
                  animated: false,
                },
                {
                  label: "Team Members",
                  value: animatedCounters.team,
                  delay: 0.8,
                  animated: true,
                },
                {
                  label: "Projects Delivered",
                  value: animatedCounters.projects,
                  delay: 1.0,
                  animated: true,
                },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={profileVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: stat.delay, duration: 0.6 }}
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
              animate={profileVisible ? { opacity: 1 } : {}}
              transition={{ delay: 1.2, duration: 0.7 }}
              className="mt-8 space-y-4"
            >
              <h3 className="text-xl font-bold text-gray-900">
                Our Core Values
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {[
                  "Innovation First",
                  "Client Obsessed",
                  "Ownership & Accountability",
                  "Grow Together",
                ].map((value, i) => (
                  <motion.div
                    key={i}
                    initial={{ x: -20, opacity: 0 }}
                    animate={profileVisible ? { x: 0, opacity: 1 } : {}}
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
