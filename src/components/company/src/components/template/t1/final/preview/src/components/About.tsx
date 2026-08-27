import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";

// Custom Badge component
const Badge = ({ children, className }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
  >
    {children}
  </span>
);

export default function About({ aboutData }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="about"
      className="py-20 bg-gradient-to-b from-status-info/10 to-white scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start" ref={ref}>
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div>
              <Badge className="bg-brand-yellow text-ink mb-4">
                About Company
              </Badge>

              <h2 className="text-4xl font-bold text-ink mb-6">
                About {aboutData.companyName}
              </h2>
            </div>

            {/* Company Info Grid */}
            <div className="bg-surface-card rounded-xl p-6 shadow-md border border-ink-light">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-ink-caption text-xs uppercase tracking-wide">
                    Company
                  </p>
                  <p className="font-semibold text-ink">
                    {aboutData.companyName}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-ink-caption text-xs uppercase tracking-wide">
                    Industry
                  </p>
                  <p className="font-semibold text-ink">
                    {aboutData.industry}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-ink-caption text-xs uppercase tracking-wide">
                    Established
                  </p>
                  <p className="font-semibold text-ink">
                    {aboutData.established}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-ink-caption text-xs uppercase tracking-wide">
                    Headquarters
                  </p>
                  <p className="font-semibold text-ink">
                    {aboutData.headquarters}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <p className="text-ink-paragraph leading-relaxed text-base">
                {aboutData.description1}
              </p>
              <p className="text-ink-paragraph leading-relaxed text-base">
                {aboutData.description2}
              </p>
            </div>

            {/* Mission & Vision */}
            <div className="space-y-4">
              <div className="bg-status-info/15 rounded-lg p-5 border-l-4 border-status-info">
                <h3 className="font-bold text-ink mb-2 flex items-center gap-2">
                  <span className="text-status-info">🎯</span> Mission
                </h3>
                <p className="text-ink-paragraph text-sm leading-relaxed">
                  {aboutData.mission}
                </p>
              </div>
              <div className="bg-brand-gold/15 rounded-lg p-5 border-l-4 border-brand-gold">
                <h3 className="font-bold text-ink mb-2 flex items-center gap-2">
                  <span className="text-brand-gold">👁️</span> Vision
                </h3>
                <p className="text-ink-paragraph text-sm leading-relaxed">
                  {aboutData.vision}
                </p>
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-surface-card rounded-xl p-6 shadow-md border border-ink-light block lg:hidden">
              <h3 className="font-bold text-ink mb-4 text-lg flex items-center gap-2">
                <span className="text-status-success">✓</span> Certifications
              </h3>
              <ul className="space-y-2">
                {aboutData.certifications.map((cert, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-ink-paragraph text-sm"
                  >
                    <span className="text-status-success mt-0.5">•</span>
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Achievements */}
            <div className="bg-surface-card rounded-xl p-6 shadow-md border border-ink-light block lg:hidden">
              <h3 className="font-bold text-ink mb-4 text-lg flex items-center gap-2">
                <span className="text-brand-gold">🏆</span> Achievements
              </h3>
              <ul className="space-y-2">
                {aboutData.achievements.map((achievement, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-ink-paragraph text-sm"
                  >
                    <span className="text-brand-gold mt-0.5">•</span>
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-4"
          >
            {aboutData.officeImage && (
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-tr from-status-info/20 to-transparent mix-blend-multiply"></div>
                <img
                  src={aboutData.officeImage.startsWith('/assets/') ? '/images/about-office.jpg' : aboutData.officeImage}
                  alt="Office"
                  className="w-full h-auto object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/images/about-office.jpg'; }}
                />
              </div>
            )}

            {/* Certifications */}
            <div className="bg-surface-card rounded-xl p-6 shadow-md border border-ink-light hidden lg:block">
              <h3 className="font-bold text-ink mb-4 text-lg flex items-center gap-2">
                <span className="text-status-success">✓</span> Certifications
              </h3>
              <ul className="space-y-2">
                {aboutData.certifications.map((cert, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-ink-paragraph text-sm"
                  >
                    <span className="text-status-success mt-0.5">•</span>
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Achievements */}
            <div className="bg-surface-card rounded-xl p-6 shadow-md border border-ink-light hidden lg:block">
              <h3 className="font-bold text-ink mb-4 text-lg flex items-center gap-2">
                <span className="text-brand-gold">🏆</span> Achievements
              </h3>
              <ul className="space-y-2">
                {aboutData.achievements.map((achievement, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-ink-paragraph text-sm"
                  >
                    <span className="text-brand-gold mt-0.5">•</span>
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
